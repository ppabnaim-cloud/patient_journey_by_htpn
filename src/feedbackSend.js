/* ===========================================================================
   feedbackSend.js — the one place a feedback submission leaves the browser.

   TWO FLAGS, BOTH DEFAULT OFF, THE SERVER'S ONE WINS
   The same pattern the usage channel uses, for the same reason: the switch
   that actually authorises a write lives on the server, where a patient's
   browser cannot reach it. The client flag only decides whether the app
   OFFERS the form. If the client flag is on and the server's is off, the
   patient is told the form is not accepting submissions yet — rather than
   being thanked for something that went nowhere.

   WHY text/plain
   A cross-origin POST with Content-Type: application/json triggers a CORS
   preflight, and Apps Script Web Apps do not answer one. text/plain is a
   "simple request" and goes straight through. The body is still JSON; only
   the declared type differs, and the script parses it as JSON regardless.
   ========================================================================= */

import { buildFeedback } from './feedback.js'

export const FEEDBACK_UI_ENABLED =
  String(import.meta.env?.VITE_FEEDBACK_ENABLED ?? '').toLowerCase() === 'true'

const URL_ = String(import.meta.env?.VITE_FEEDBACK_URL ?? '')
const SECRET = String(import.meta.env?.VITE_FEEDBACK_SECRET ?? '')
const VERSION = String(import.meta.env?.VITE_APP_VERSION ?? '0.1.0')

export function feedbackConfigured () {
  return FEEDBACK_UI_ENABLED && !!URL_ && !!SECRET
}

/* Returns { ok, ticket, reason }. It never throws at the caller: a form that
   explodes on send loses what the patient wrote, and they will not type it
   again. */
export async function sendFeedback (form, ticket) {
  const record = buildFeedback(form, { ticket, appVersion: VERSION })

  if (!feedbackConfigured()) {
    return { ok: false, reason: 'not_configured', record }
  }

  try {
    const res = await fetch(URL_, {
      method: 'POST',
      /* See the note above: this must stay text/plain. */
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ secret: SECRET, record }),
      redirect: 'follow'
    })
    const text = await res.text()
    let body = null
    try { body = JSON.parse(text) } catch { /* Apps Script can return HTML on error */ }
    if (body?.status === 'ok') return { ok: true, ticket: body.ticket || ticket }
    if (body?.status === 'disabled') return { ok: false, reason: 'server_off' }
    return { ok: false, reason: body?.reason || 'rejected' }
  } catch {
    /* Offline, blocked, or the deployment moved. The caller keeps the form
       filled in so the patient can press send again. */
    return { ok: false, reason: 'no_connection' }
  }
}
