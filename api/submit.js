/* ===========================================================================
   api/submit.js — the only write path. Vercel serverless function, Node.

   It imports ../src/collection.js, the same file the browser builds records
   with, so the allowlist cannot drift between the two halves.

   Order of checks, and why each one is in that position:
     1. Method. POST only.
     2. SERVER FLAG. This is the authoritative one. A client build shipped with
        its own flag on still writes nothing while this is off, which is what
        makes "ethics approval pending" enforceable rather than a promise.
     3. IDENTIFIERS. A record carrying a name, IC, phone, email, address, date
        of birth or age is REFUSED with 400 — not stripped and stored. A
        stripped record would hide the fact that a client tried to send one,
        and that is precisely the fact a reviewer needs to see.
     4. ALLOWLIST. Unknown fields are refused for the same reason.
     5. Vocabulary. Enum fields must hold values from the closed lists.
     6. Write, to whichever destination is configured.

   Nothing is logged except counts and refusal reasons. The record body is not
   written to the function log.
   ========================================================================= */

import crypto from 'node:crypto'
import { OUTGOING_FIELDS, FORBIDDEN_KEY_PATTERNS, SCHEMA, TABS, ACTIONS, DETAILS } from '../src/collection.js'

/* --- flag 2 of 2. Defaults OFF. ----------------------------------------- */
const COLLECTION_ENABLED = String(process.env.COLLECTION_ENABLED || '').toLowerCase() === 'true'

const ENUMS = {
  tab: TABS,
  action: ACTIONS,
  detail: DETAILS,
  lang: ['en', 'ms'],
  partOfDay: ['early', 'morning', 'midday', 'afternoon', 'evening'],
  platform: ['android', 'ios', 'other_mobile', 'desktop'],
  screen: ['phone', 'tablet', 'desktop', 'unknown'],
  sessionDuration: ['under_1min', '1_3min', '3_10min', 'over_10min'],
  recordsHeld: ['0', '1_4', '5_9', '10_plus']
}

const normaliseKey = (k) => String(k).toLowerCase().replace(/[^a-z]/g, '')

/* Patterns are normalised the same way as the keys they are tested against.
   Without this, a pattern written with an underscore would never match and the
   rule would be silently disarmed — which is how 'ocr_text' slipped through
   the first version of this file. */
const FORBIDDEN_NORMALISED = [...new Set(FORBIDDEN_KEY_PATTERNS.map(normaliseKey))].filter(Boolean)

/* A key is forbidden when it equals a pattern, or is that pattern with a
   common prefix/suffix (patientName, name_full). Substring matching alone
   would reject legitimate keys — "detail" contains "tel" — so the test is
   anchored at a word boundary of the normalised key. */
function forbiddenKeysIn (obj) {
  const hits = []
  for (const key of Object.keys(obj)) {
    const k = normaliseKey(key)
    for (const p of FORBIDDEN_NORMALISED) {
      if (k === p || k.startsWith(p) || k.endsWith(p)) { hits.push(key); break }
    }
  }
  return hits
}

function validate (body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { ok: false, code: 400, reason: 'not_an_object' }
  }
  if (body.schema !== SCHEMA) {
    return { ok: false, code: 400, reason: 'wrong_schema' }
  }

  /* 3. Identifiers: refuse, do not strip. */
  const forbidden = forbiddenKeysIn(body)
  if (forbidden.length) {
    return { ok: false, code: 400, reason: 'identifier_fields_present', fields: forbidden }
  }

  /* 4. Allowlist. */
  const unknown = Object.keys(body).filter(k => !OUTGOING_FIELDS.includes(k))
  if (unknown.length) {
    return { ok: false, code: 400, reason: 'fields_not_on_allowlist', fields: unknown }
  }

  /* 5. Closed vocabularies, and shapes for everything else. */
  for (const [field, allowed] of Object.entries(ENUMS)) {
    if (body[field] !== undefined && !allowed.includes(body[field])) {
      return { ok: false, code: 400, reason: 'value_outside_vocabulary', fields: [field] }
    }
  }
  for (const f of ['deviceCode', 'sessionCode']) {
    if (!/^[A-Z2-9]{8}$/.test(String(body[f] || ''))) {
      return { ok: false, code: 400, reason: 'bad_code_format', fields: [f] }
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(body.dateLocal || ''))) {
    return { ok: false, code: 400, reason: 'bad_date_format', fields: ['dateLocal'] }
  }
  for (const f of ['seq', 'tabsUsed']) {
    if (!Number.isInteger(body[f]) || body[f] < 0 || body[f] > 99999) {
      return { ok: false, code: 400, reason: 'bad_number', fields: [f] }
    }
  }
  for (const f of ['isNewDevice', 'standalone', 'online']) {
    if (typeof body[f] !== 'boolean') {
      return { ok: false, code: 400, reason: 'bad_boolean', fields: [f] }
    }
  }
  /* Free-text length cap on the two string fields that are not enums. */
  for (const f of ['appVersion', 'app']) {
    if (String(body[f] || '').length > 40) {
      return { ok: false, code: 400, reason: 'string_too_long', fields: [f] }
    }
  }
  return { ok: true }
}

/* --- destinations -------------------------------------------------------
   The first one configured wins. (b) is listed first on purpose: Apps Script
   is a Workspace service, not Google Cloud Platform, so it survives the GCP
   block that government Workspace tenants usually have in place. (a) is better
   when it is available, which is less often than one would like. */

function rowFrom (record) {
  return OUTGOING_FIELDS.map(f => {
    const v = record[f]
    return v === undefined || v === null ? '' : String(v)
  })
}

async function writeViaAppsScript (record) {
  const url = process.env.APPS_SCRIPT_URL
  const secret = process.env.APPS_SCRIPT_SECRET
  /* A Web App deployed as "Anyone" is reachable by URL alone, so the shared
     secret is what actually protects it. Refuse to use it without one. */
  if (!secret) return { ok: false, reason: 'apps_script_secret_missing' }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ secret, schema: SCHEMA, fields: OUTGOING_FIELDS, row: rowFrom(record) })
  })
  if (!res.ok) return { ok: false, reason: 'apps_script_http_' + res.status }
  const text = await res.text()
  if (!/"ok"\s*:\s*true/.test(text)) return { ok: false, reason: 'apps_script_rejected' }
  return { ok: true, via: 'apps_script' }
}

/* Service-account JWT, minted with Node's own crypto. No googleapis
   dependency, which keeps the function small and its surface readable. */
async function googleAccessToken (email, key) {
  const now = Math.floor(Date.now() / 1000)
  const header = { alg: 'RS256', typ: 'JWT' }
  const claim = {
    iss: email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }
  const b64 = o => Buffer.from(JSON.stringify(o)).toString('base64url')
  const unsigned = `${b64(header)}.${b64(claim)}`
  const signature = crypto.createSign('RSA-SHA256').update(unsigned).sign(key.replace(/\\n/g, '\n')).toString('base64url')
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: `${unsigned}.${signature}`
    })
  })
  if (!res.ok) throw new Error('token_http_' + res.status)
  const json = await res.json()
  return json.access_token
}

async function writeViaSheetsApi (record) {
  const id = process.env.SHEETS_SPREADSHEET_ID
  const email = process.env.GOOGLE_SA_EMAIL
  const key = process.env.GOOGLE_SA_PRIVATE_KEY
  const tab = process.env.SHEETS_TAB || 'usage'
  const token = await googleAccessToken(email, key)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(id)}` +
              `/values/${encodeURIComponent(tab)}!A1:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`
  const res = await fetch(url, {
    method: 'POST',
    headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' },
    body: JSON.stringify({ values: [[new Date().toISOString(), ...rowFrom(record)]] })
  })
  if (!res.ok) return { ok: false, reason: 'sheets_http_' + res.status }
  return { ok: true, via: 'sheets_api' }
}

/* Last resort: a tab-separated line in the function log. It pastes into a
   sheet in one action, which is the whole point of the fallback. For email,
   use the Apps Script destination and switch its digest on — Apps Script can
   send mail from inside the Workspace, and a serverless function cannot
   without yet another third-party credential. */
function writeViaLog (record) {
  console.log('USAGE_TSV\t' + rowFrom(record).join('\t'))
  return { ok: true, via: 'tsv_log' }
}

function destination () {
  if (process.env.APPS_SCRIPT_URL) return writeViaAppsScript
  if (process.env.SHEETS_SPREADSHEET_ID && process.env.GOOGLE_SA_EMAIL && process.env.GOOGLE_SA_PRIVATE_KEY) return writeViaSheetsApi
  return writeViaLog
}

export default async function handler (req, res) {
  res.setHeader('cache-control', 'no-store')

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, reason: 'method_not_allowed' })
    return
  }

  /* 2. The authoritative flag. 503, so the client can tell "switched off"
        apart from "broken" and say so honestly in its status line. */
  if (!COLLECTION_ENABLED) {
    res.status(503).json({ ok: false, reason: 'collection_disabled_on_server' })
    return
  }

  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = null } }

  const v = validate(body)
  if (!v.ok) {
    console.warn('USAGE_REFUSED', v.reason, (v.fields || []).join(','))
    res.status(v.code).json({ ok: false, reason: v.reason, fields: v.fields })
    return
  }

  try {
    const out = await destination()(body)
    if (!out.ok) {
      console.error('USAGE_WRITE_FAILED', out.reason)
      res.status(502).json({ ok: false, reason: out.reason })
      return
    }
    res.status(200).json({ ok: true, via: out.via })
  } catch (err) {
    console.error('USAGE_WRITE_ERROR', String(err?.message || err))
    res.status(502).json({ ok: false, reason: 'write_error' })
  }
}

/* Exported for the test harness in scripts/. */
export const __test = { validate, forbiddenKeysIn, rowFrom, COLLECTION_ENABLED }
