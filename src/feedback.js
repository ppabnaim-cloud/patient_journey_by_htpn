/* ===========================================================================
   feedback.js — THE ENTIRE outgoing shape of a feedback submission.

   READ THIS NEXT TO src/collection.js, NOT INSTEAD OF IT
   This app now has two outgoing channels and they are opposites:

     src/collection.js   usage counts. Refuses every identifier. No free text.
                         Sent automatically. Pseudonymous by construction.
     src/feedback.js     this file. Accepts a name, an email, a photograph and
                         free text, because the patient typed them in order to
                         be answered. Sent only when the patient presses send.

   They share no builder, no allowlist and no endpoint, and neither imports
   the other. That is the whole defence: a field added here cannot reach the
   usage sheet, and a field added there cannot reach this one.

   WHAT THIS FILE WILL NOT DO
   It never reads the health record. Not to pre-fill a name, not to attach a
   medicine list, not to "helpfully" include the next appointment. Everything
   below comes from the form the patient filled in, and the builder is handed
   the form, never the record.
   ========================================================================= */

export const FEEDBACK_SCHEMA = 'pj-htpn-feedback-1'

/* OFF. See the long note at the head of src/data/feedback.js for why, and
   what to change if HTPN decides otherwise. Turning this on also turns on
   ageFromIc below, which fills the age field automatically. */
export const ASK_FOR_IC = false

/* --- the allowlist -------------------------------------------------------
   buildFeedback() constructs a fresh object from these names and asserts
   that it produced nothing else. A new form field cannot travel until it is
   added here by hand. */
export const FEEDBACK_FIELDS = [
  'schema',          // string   constant, versions the sheet
  'app',             // string   constant app id
  'appVersion',      // string
  'ticket',          // string   8 chars, the reference the patient quotes
  'submittedAt',     // string   ISO timestamp. Not banded: the hospital needs
                     //          to know when, and the patient chose to be known
  'lang',            // enum     en|ms
  'category',        // enum     appreciation|improvement|complaint
  'areaId',          // enum     one of AREA_IDS
  'rating',          // int      1-5, or null if not given
  'visitDate',       // string   YYYY-MM-DD or null
  'message',         // string   free text, the patient's own words
  'anonymous',       // bool     true means no name, email or RN was given
  'name',            // string   or null
  'rn',              // string   hospital registration number, or null
  'email',           // string   or null
  'ageYears',        // int      or null
  'ic',              // string   null unless ASK_FOR_IC is on
  'consentReply',    // bool
  'consentPublish',  // bool
  'publishAs',       // enum     anonymous|first|full, or null
  'imageName',       // string   or null
  'imageBytes',      // int      size after downscaling, or null
  'imageData'        // string   base64 JPEG, or null
]

/* Characters a spreadsheet treats as the start of a formula. Guarded on the
   way out as well as on the way in: a patient who begins a sentence with a
   minus sign should not produce a cell that executes. */
const FORMULA_LEAD = /^[=+\-@\t\r]/

export function deFormula (s) {
  const v = String(s ?? '')
  return FORMULA_LEAD.test(v) ? "'" + v : v
}

const CODE_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'

/* The reference number the patient is shown and may quote later. Random,
   from the platform CSPRNG, and carrying nothing about them. */
export function newTicket (len = 8) {
  const c = globalThis.crypto
  if (!c?.getRandomValues) throw new Error('No cryptographic RNG available; refusing to mint a ticket.')
  const out = []
  const buf = new Uint8Array(len * 2)
  while (out.length < len) {
    c.getRandomValues(buf)
    for (const b of buf) {
      if (out.length === len) break
      if (b < 256 - (256 % CODE_ALPHABET.length)) out.push(CODE_ALPHABET[b % CODE_ALPHABET.length])
    }
  }
  return out.join('')
}

/* --- Malaysian IC, if HTPN ever switches it on --------------------------
   YYMMDD-PB-###G. The century is a GUESS and is documented as one: a two
   digit year cannot distinguish 1935 from 2035, so the usual rule is used —
   a year at or below the current two-digit year is this century. That rule
   is wrong for anyone over 100, which a hospital does see. The age is
   therefore offered as a prefilled value the patient can correct, never as a
   fact the form asserts. */
export function ageFromIc (ic, today = new Date()) {
  const digits = String(ic || '').replace(/\D/g, '')
  if (digits.length !== 12) return null
  const yy = Number(digits.slice(0, 2))
  const mm = Number(digits.slice(2, 4))
  const dd = Number(digits.slice(4, 6))
  if (mm < 1 || mm > 12 || dd < 1 || dd > 31) return null
  const nowYY = today.getFullYear() % 100
  const year = yy <= nowYY ? 2000 + yy : 1900 + yy
  let age = today.getFullYear() - year
  const had = (today.getMonth() + 1) > mm || ((today.getMonth() + 1) === mm && today.getDate() >= dd)
  if (!had) age -= 1
  return age >= 0 && age < 130 ? age : null
}

export function isValidIc (ic) {
  return /^\d{6}-?\d{2}-?\d{4}$/.test(String(ic || '').trim())
}

/* --- image ---------------------------------------------------------------
   Downscaled in the browser before it is sent, for three reasons, in order:
   a photograph straight off a phone is several megabytes and will not reach
   a Google Apps Script endpoint; it carries EXIF, including where it was
   taken; and the hospital needs to see what happened, not a 48-megapixel
   version of it. Drawing to a canvas and re-encoding drops the EXIF as a
   side effect of how canvas works — the pixels are copied, the metadata is
   not. */
export async function downscaleImage (file, limits) {
  const { maxEdgePx, quality, maxBytes } = limits
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxEdgePx / Math.max(bitmap.width, bitmap.height))
  const w = Math.max(1, Math.round(bitmap.width * scale))
  const h = Math.max(1, Math.round(bitmap.height * scale))
  const canvas = document.createElement('canvas')
  canvas.width = w; canvas.height = h
  canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h)
  bitmap.close?.()

  let q = quality
  let blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', q))
  /* Step the quality down rather than refusing a large photograph: a patient
     holding a picture of what went wrong should not be told their camera is
     the wrong camera. */
  while (blob && blob.size > maxBytes && q > 0.35) {
    q -= 0.12
    blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', q))
  }
  if (!blob) throw new Error('Could not read that image.')
  if (blob.size > maxBytes) throw new Error('too_large')
  const dataUrl = await new Promise((res, rej) => {
    const r = new FileReader()
    r.onload = () => res(String(r.result))
    r.onerror = () => rej(new Error('Could not read that image.'))
    r.readAsDataURL(blob)
  })
  return { base64: dataUrl.split(',')[1], bytes: blob.size, width: w, height: h }
}

/* --- the builder ---------------------------------------------------------
   Takes the FORM, never the record. Returns a fresh object and refuses to
   return one carrying a field that is not on the allowlist. */
export function buildFeedback (form, meta = {}) {
  const anonymous = !!form.anonymous
  const text = (v) => {
    const s = String(v ?? '').trim()
    return s ? deFormula(s) : null
  }

  const out = {
    schema: FEEDBACK_SCHEMA,
    app: 'patient-journey-htpn',
    appVersion: String(meta.appVersion || ''),
    ticket: String(meta.ticket || ''),
    submittedAt: new Date().toISOString(),
    lang: form.lang === 'ms' ? 'ms' : 'en',
    category: form.category,
    areaId: form.areaId,
    rating: Number.isFinite(Number(form.rating)) && Number(form.rating) > 0 ? Number(form.rating) : null,
    visitDate: form.visitDate ? String(form.visitDate) : null,
    message: text(form.message),
    anonymous,
    /* One switch, and it really does empty the fields rather than hiding
       them: an anonymous submission that still carries the name typed before
       the box was ticked is the worst kind of broken promise. */
    name: anonymous ? null : text(form.name),
    rn: anonymous ? null : text(form.rn),
    email: anonymous ? null : text(form.email),
    ageYears: Number.isFinite(Number(form.ageYears)) && Number(form.ageYears) > 0 ? Number(form.ageYears) : null,
    ic: (!anonymous && ASK_FOR_IC) ? text(form.ic) : null,
    consentReply: !anonymous && !!form.consentReply,
    consentPublish: !!form.consentPublish,
    publishAs: form.consentPublish ? (form.publishAs || 'anonymous') : null,
    imageName: form.image ? 'feedback.jpg' : null,
    imageBytes: form.image ? Number(form.image.bytes) : null,
    imageData: form.image ? String(form.image.base64) : null
  }

  const extra = Object.keys(out).filter(k => !FEEDBACK_FIELDS.includes(k))
  if (extra.length) throw new Error('feedback.js built a field not on the allowlist: ' + extra.join(', '))
  return out
}

/* A submission is worth sending only if it says something. */
export function validateFeedback (form) {
  const problems = []
  if (!form.category) problems.push('category')
  if (!form.areaId) problems.push('areaId')
  if (!String(form.message || '').trim()) problems.push('message')
  if (!form.anonymous && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) problems.push('email')
  if (!form.anonymous && form.consentReply && !String(form.email || '').trim()) problems.push('email_needed_for_reply')
  if (ASK_FOR_IC && !form.anonymous && form.ic && !isValidIc(form.ic)) problems.push('ic')
  return problems
}
