/* ===========================================================================
   usage.js — the only code in the app that touches the network with data.

   It cannot reach the patient's record: it does not import src/storage.js and
   must never be made to. Everything it knows is handed to it by the caller,
   already banded, and it passes that through collection.buildRecord() which
   enforces the allowlist one more time before anything is sent.

   Sending is AUTOMATIC, not behind a button. A button would lose everyone who
   consented and then did not press it, and a count you have silently lost is
   worse than no count at all. It is not covert either: the footer shows a live
   status line saying exactly what has been sent, and the privacy screen lists
   every field by name.
   ========================================================================= */

import { buildRecord, newDeviceCode } from './collection.js'

export const ENDPOINT = '/api/submit'

/* Status values the UI renders through i18n: 'off' | 'declined' | 'queued'
   | 'sent' | 'failed' | 'refused'. */
let listeners = []
export function onUsageStatus (fn) {
  listeners.push(fn)
  return () => { listeners = listeners.filter(f => f !== fn) }
}
function emit (status, extra) {
  for (const fn of listeners) { try { fn(status, extra) } catch { /* a bad listener must not stop the app */ } }
}

export { newDeviceCode }

/* One event per (action, tab, detail) per session. A patient flicking between
   tabs should move the "which parts were used" count by one, not by thirty. */
const sentThisSession = new Set()

let seq = 0
const sessionStart = Date.now()

export function sessionAgeMs () { return Date.now() - sessionStart }

export function resetSessionDedup () {
  sentThisSession.clear()
  seq = 0
}

/**
 * @param {object} opts
 *   enabled      client flag AND consent, decided by the caller
 *   consent      'given' | 'declined' | null
 *   deviceCode, sessionCode, isNewDevice, lang, appVersion
 *   action, tab, detail
 *   tabsUsed     int
 *   recordsHeld  int  (banded inside collection.js, never sent raw)
 */
export async function sendUsage (opts) {
  if (opts.consent === 'declined') { emit('declined'); return { sent: false, reason: 'declined' } }
  if (!opts.enabled) { emit('off'); return { sent: false, reason: 'flag_off' } }

  const key = [opts.action, opts.tab, opts.detail].join('|')
  if (sentThisSession.has(key)) return { sent: false, reason: 'already_counted' }
  sentThisSession.add(key)

  let record
  try {
    record = buildRecord({
      now: new Date(),
      appVersion: opts.appVersion,
      deviceCode: opts.deviceCode,
      sessionCode: opts.sessionCode,
      isNewDevice: opts.isNewDevice,
      lang: opts.lang,
      action: opts.action,
      tab: opts.tab,
      detail: opts.detail,
      seq: ++seq,
      userAgent: globalThis.navigator?.userAgent,
      screenWidth: globalThis.innerWidth,
      standalone: !!(globalThis.matchMedia?.('(display-mode: standalone)')?.matches) ||
                  globalThis.navigator?.standalone === true,
      online: globalThis.navigator?.onLine !== false,
      sessionMs: sessionAgeMs(),
      tabsUsed: opts.tabsUsed,
      recordsHeld: opts.recordsHeld
    })
  } catch (err) {
    /* buildRecord throws if a field not on the allowlist appeared. Fail shut:
       send nothing at all rather than sending something unreviewed. */
    emit('failed', String(err?.message || err))
    return { sent: false, reason: 'allowlist_violation' }
  }

  if (globalThis.navigator?.onLine === false) {
    /* Not queued for later. A usage count is worth nothing once it is stale,
       and a retry queue would mean writing it to disk — which the privacy copy
       says does not happen. Dropping it is the honest behaviour. */
    emit('failed', 'offline')
    return { sent: false, reason: 'offline' }
  }

  emit('queued')
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(record),
      keepalive: true
    })
    if (res.ok) { emit('sent'); return { sent: true } }
    if (res.status === 503) { emit('off'); return { sent: false, reason: 'server_flag_off' } }
    emit('refused', String(res.status))
    return { sent: false, reason: 'http_' + res.status }
  } catch (err) {
    emit('failed', String(err?.message || err))
    return { sent: false, reason: 'network' }
  }
}

export const LAST_RECORD_FOR_DISPLAY = (opts) => {
  /* Used by the privacy screen to show the patient a real example of what
     would be sent, built by the same function that does the sending. */
  try {
    return buildRecord({
      now: new Date(),
      appVersion: opts.appVersion,
      deviceCode: opts.deviceCode,
      sessionCode: opts.sessionCode,
      isNewDevice: opts.isNewDevice,
      lang: opts.lang,
      action: 'tab_open',
      tab: 'wayfinding',
      detail: 'none',
      seq: 1,
      userAgent: globalThis.navigator?.userAgent,
      screenWidth: globalThis.innerWidth,
      standalone: false,
      online: true,
      sessionMs: sessionAgeMs(),
      tabsUsed: opts.tabsUsed,
      recordsHeld: opts.recordsHeld
    })
  } catch { return null }
}
