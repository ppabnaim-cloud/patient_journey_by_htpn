/* ===========================================================================
   collection.js — THE ENTIRE DATA MODEL THAT LEAVES THE DEVICE.

   An ethics reviewer should be able to read this one file, end to end, and
   know everything the hospital receives. Nothing is assembled anywhere else.
   If a field is not in OUTGOING_FIELDS below, it cannot be sent.

   What leaves:  which parts of the app were opened, and roughly when and on
                 what kind of device. A count of use, nothing more.
   What never leaves: every clinical thing. Medicines, diagnoses, allergies,
                 operations, results, measurements, photographs, names, IC
                 numbers, dates of birth, ages, locations. None of it is in the
                 allowlist, and the server refuses a record that carries any.

   Design points that matter for review:
   1. ALLOWLIST, not a blocklist. buildRecord() constructs a fresh object from
      named fields. A new field added to the app cannot leak by accident,
      because it would have to be added here by hand to travel.
   2. Every quasi-identifier is BANDED in the browser before it leaves. A
      timestamp becomes a date plus a part-of-day. A duration becomes a bucket.
      An exact count becomes a range.
   3. The device code is random, generated with the platform CSPRNG, from an
      alphabet with I, O, 0 and 1 removed because codes get read aloud.
   4. Both flags default OFF, and the server flag is the authoritative one.
   ========================================================================= */

export const SCHEMA = 'pj-htpn-usage-1'

/* --- 1. Participant / device code ---------------------------------------- */

/* I, O, 0 and 1 removed: these get read down a phone line. */
const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
const CODE_LENGTH = 8

export function newDeviceCode () {
  const cryptoObj = globalThis.crypto
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    /* No CSPRNG means no code. We do not quietly fall back to Math.random():
       a predictable code would let records be linked by guesswork. */
    throw new Error('No cryptographic RNG available; refusing to mint a device code.')
  }
  /* Rejection sampling, so the 32-letter alphabet maps evenly onto 0-255. */
  const out = []
  const buf = new Uint8Array(CODE_LENGTH * 2)
  while (out.length < CODE_LENGTH) {
    cryptoObj.getRandomValues(buf)
    for (const b of buf) {
      if (out.length === CODE_LENGTH) break
      if (b < 256 - (256 % CODE_ALPHABET.length)) out.push(CODE_ALPHABET[b % CODE_ALPHABET.length])
    }
  }
  return out.join('')
}

/* --- 2. Banding. Every quasi-identifier passes through one of these. ------ */

/* A precise clock time is a quasi-identifier when joined to a clinic roster.
   A part-of-day is not, and answers the only question worth asking of it. */
export function bandHour (date) {
  const h = date.getHours()
  if (h < 8) return 'early'          // before 08:00
  if (h < 12) return 'morning'       // 08:00-11:59
  if (h < 15) return 'midday'        // 12:00-14:59
  if (h < 19) return 'afternoon'     // 15:00-18:59
  return 'evening'                   // 19:00-23:59
}

export function bandDuration (ms) {
  const m = ms / 60000
  if (m < 1) return 'under_1min'
  if (m < 3) return '1_3min'
  if (m < 10) return '3_10min'
  return 'over_10min'
}

/* Exact counts of a patient's own entries are banded, because "47 medicines"
   is far rarer, and so far more identifying, than "10 or more". */
export function bandCount (n) {
  const v = Number(n) || 0
  if (v === 0) return '0'
  if (v <= 4) return '1_4'
  if (v <= 9) return '5_9'
  return '10_plus'
}

export function bandScreen (width) {
  if (!Number.isFinite(width)) return 'unknown'
  if (width < 600) return 'phone'
  if (width < 1100) return 'tablet'
  return 'desktop'
}

/* Deliberately coarse. The full user-agent string is a near-unique
   fingerprint; four buckets are not. */
export function bandPlatform (ua) {
  const s = String(ua || '').toLowerCase()
  if (/android/.test(s)) return 'android'
  if (/iphone|ipad|ipod/.test(s)) return 'ios'
  if (/mobile/.test(s)) return 'other_mobile'
  return 'desktop'
}

/* --- 3. The closed vocabularies ------------------------------------------
   Anything not listed here is replaced with 'other' before it is sent, so a
   free-text value can never ride out inside an enum field. */

export const TABS = ['dashboard', 'records', 'measurements', 'wayfinding', 'iqms', 'myubat', 'rakyat', 'privacy']

export const ACTIONS = [
  'app_open',
  'tab_open',
  'lang_switch',
  'record_photo_added',
  'record_ocr_run',
  'record_ocr_accepted',
  'record_typed_entry',
  'record_section_open',
  'measurement_saved',
  'summary_printed',
  'wayfinding_map_opened',
  'iqms_opened',
  'myubat_opened',
  'poster_opened',
  'poster_downloaded',
  'data_exported',
  'data_cleared',
  'consent_given',
  'consent_declined'
]

/* `detail` is an enum too, never free text. These are the only values it may
   carry; they identify which part of a tab was used, nothing about a person. */
export const DETAILS = [
  'none',
  'meds', 'issues', 'allergies', 'surgery', 'bloods',
  'wcc', 'main', 'department',
  'role_1', 'role_2', 'role_3', 'role_4', 'role_5', 'role_other',
  'camera', 'upload', 'manual'
]

const inVocab = (v, list, fallback) => (list.includes(v) ? v : fallback)

/* --- 4. THE ALLOWLIST ----------------------------------------------------
   The complete set of field names that may be transmitted. The server holds
   the same list and rejects anything outside it. */
export const OUTGOING_FIELDS = [
  'schema',          // string  constant, for versioning the sheet
  'app',             // string  constant app id
  'appVersion',      // string  e.g. '0.1.0'
  'deviceCode',      // string  8 random chars; counts repeat devices, names no one
  'sessionCode',     // string  8 random chars; one app session
  'isNewDevice',     // bool    first time this device opened the app
  'dateLocal',       // string  YYYY-MM-DD, no clock time
  'partOfDay',       // enum    early|morning|midday|afternoon|evening
  'lang',            // enum    en|ms
  'action',          // enum    see ACTIONS
  'tab',             // enum    see TABS
  'detail',          // enum    see DETAILS
  'seq',             // int     nth event this session
  'platform',        // enum    android|ios|other_mobile|desktop
  'screen',          // enum    phone|tablet|desktop|unknown
  'standalone',      // bool    opened as an installed app rather than a tab
  'online',          // bool    was there a connection at the time
  'sessionDuration', // enum    banded, see bandDuration
  'tabsUsed',        // int     how many distinct tabs this session (0-8)
  'recordsHeld'      // enum    banded count of the patient's own entries
]

/* --- 5. The builder ------------------------------------------------------
   Constructs a NEW object from named fields. It never copies an input object
   and deletes keys from it, because a field added upstream would then travel
   until someone remembered to delete it too. */
export function buildRecord (ctx) {
  const now = ctx.now instanceof Date ? ctx.now : new Date()
  const record = {
    schema: SCHEMA,
    app: 'patient-journey-by-htpn',
    appVersion: String(ctx.appVersion || ''),
    deviceCode: String(ctx.deviceCode || ''),
    sessionCode: String(ctx.sessionCode || ''),
    isNewDevice: ctx.isNewDevice === true,
    dateLocal: [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0')
    ].join('-'),
    partOfDay: bandHour(now),
    lang: ctx.lang === 'ms' ? 'ms' : 'en',
    action: inVocab(ctx.action, ACTIONS, 'app_open'),
    tab: inVocab(ctx.tab, TABS, 'dashboard'),
    detail: inVocab(ctx.detail, DETAILS, 'none'),
    seq: Math.max(0, Math.min(99999, Math.trunc(Number(ctx.seq) || 0))),
    platform: bandPlatform(ctx.userAgent),
    screen: bandScreen(ctx.screenWidth),
    standalone: ctx.standalone === true,
    online: ctx.online !== false,
    sessionDuration: bandDuration(Math.max(0, Number(ctx.sessionMs) || 0)),
    tabsUsed: Math.max(0, Math.min(TABS.length, Math.trunc(Number(ctx.tabsUsed) || 0))),
    recordsHeld: bandCount(ctx.recordsHeld)
  }

  /* Belt and braces: assert the object we built has exactly the allowed keys
     and nothing else, before it goes near the network. */
  const keys = Object.keys(record)
  const extra = keys.filter(k => !OUTGOING_FIELDS.includes(k))
  if (extra.length) throw new Error('collection.js built a field not on the allowlist: ' + extra.join(', '))
  return record
}

/* --- 6. Identifiers the server must refuse -------------------------------
   Kept here, next to the allowlist, so a reviewer sees both halves at once.
   The server REFUSES a record containing any of these rather than stripping
   them: a stripped record hides that a client tried to send one. */
export const FORBIDDEN_KEY_PATTERNS = [
  'name', 'nama',
  'ic', 'nric', 'mykad', 'kadpengenalan', 'nokp',
  'phone', 'tel', 'mobile', 'hp', 'notelefon',
  'email', 'emel',
  'address', 'alamat', 'postcode', 'poskod',
  'dob', 'birth', 'lahir',
  'age', 'umur',
  'lat', 'lng', 'lon', 'gps', 'coord',
  'mrn', 'rn', 'patientid', 'pesakitid',
  'diagnosis', 'diagnos', 'medication', 'ubat', 'drug', 'allergy', 'alahan',
  'result', 'keputusan', 'weight', 'berat', 'height', 'tinggi', 'bmi', 'waist', 'pinggang',
  'photo', 'image', 'gambar', 'ocrtext', 'note', 'nota', 'freetext'
]
