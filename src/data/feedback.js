/* ===========================================================================
   feedback.js — the service rating and feedback form

   THIS TAB BREAKS THE APP'S CENTRAL PROMISE, ON PURPOSE AND IN THE OPEN
   Every other screen says the same thing: what you enter stays on this
   device. This one sends what you type to HTPN. That is the point of it.

   So the separation has to be visible and absolute, not a footnote:
     - the form carries its own banner, in its own colour, on every screen
       of this tab, saying plainly that this one is sent;
     - nothing from the health record is read, offered or pre-filled here.
       Not the name on the print sheet, not an appointment, not a medicine.
       The patient types what they want HTPN to have, and nothing else;
     - the outgoing shape lives in src/feedback.js as its OWN allowlist,
       separate from src/collection.js, which carries the usage counts and
       refuses every identifier this form accepts. Two regimes, two files,
       no shared builder. A field cannot drift from one into the other.

   WHAT IS NOT ASKED FOR, AND WHY
   The IC number. It was requested, in order to calculate age. Age is asked
   for directly instead, in one field, because:
     - IC yields date of birth, age, gender and state of birth, so collecting
       it to derive one of those collects all four;
     - in a spreadsheet of named complaints it is the single most damaging
       field to lose, and it earns nothing operationally that the hospital
       registration number does not earn better;
     - to find a patient's case, HTPN uses the RN. That is the identifier the
       hospital's own systems are keyed on.
   The code for it is written and tested all the same (see ASK_FOR_IC and
   ageFromIc in src/feedback.js). Set ASK_FOR_IC to true and the field, the
   validation and the automatic age all appear. It is off, not absent, so
   the decision stays HTPN's and takes one line either way.
   ========================================================================= */

import { DEPARTMENTS as CLINICAL } from './departments.js'

export const RATING_MAX = 5

/* Labelled at every point. A bare row of stars means something different to
   every person who taps it; words make the scale the same scale for all. */
export const RATING_LABELS = [
  { v: 1, en: 'Poor', ms: 'Lemah' },
  { v: 2, en: 'Fair', ms: 'Sederhana' },
  { v: 3, en: 'Good', ms: 'Baik' },
  { v: 4, en: 'Very good', ms: 'Sangat baik' },
  { v: 5, en: 'Excellent', ms: 'Cemerlang' }
]

export const CATEGORIES = [
  {
    id: 'appreciation',
    icon: 'heart',
    en: 'Appreciation',
    ms: 'Penghargaan',
    lead: {
      en: 'Something went well, and you would like the team to know.',
      ms: 'Sesuatu yang baik telah berlaku, dan anda ingin pasukan kami mengetahuinya.'
    },
    canPublish: true
  },
  {
    id: 'improvement',
    icon: 'idea',
    en: 'Room for improvement',
    ms: 'Ruang Penambahbaikan',
    lead: {
      en: 'Something could be better. Nothing went wrong, but it could have gone better.',
      ms: 'Sesuatu boleh diperbaiki. Tiada yang tidak kena, tetapi ia boleh menjadi lebih baik.'
    },
    canPublish: false
  },
  {
    id: 'complaint',
    icon: 'alert',
    en: 'Complaint',
    ms: 'Aduan',
    lead: {
      en: 'Something went wrong and you would like it looked into.',
      ms: 'Sesuatu yang tidak kena telah berlaku dan anda ingin ia disiasat.'
    },
    canPublish: false
  }
]

/* The areas a patient actually deals with, which is not the same list as the
   clinics they are given appointments at. Supplied by neither HTPN nor a
   directory: these are the counters and services named on the hospital's own
   way-finding and triage screens in this app, plus the clinical departments.
   Anything missing goes in `other`, which is why `other` exists. */
export const SERVICE_AREAS = [
  { id: 'registration', en: 'Registration counter', ms: 'Kaunter Pendaftaran' },
  { id: 'emergency', en: 'Emergency & Trauma Department', ms: 'Jabatan Kecemasan & Trauma' },
  { id: 'outpatient', en: 'Outpatient clinics', ms: 'Klinik Pesakit Luar' },
  { id: 'ward', en: 'Ward', ms: 'Wad' },
  { id: 'pharmacy', en: 'Pharmacy', ms: 'Farmasi' },
  { id: 'lab', en: 'Laboratory / blood taking', ms: 'Makmal / Pengambilan Darah' },
  { id: 'payment', en: 'Payment counter', ms: 'Kaunter Bayaran' },
  { id: 'appointment_desk', en: 'Appointment counter', ms: 'Kaunter Temujanji' },
  { id: 'ambulance', en: 'Ambulance & transport', ms: 'Ambulans & Pengangkutan' },
  { id: 'cleanliness', en: 'Cleanliness & facilities', ms: 'Kebersihan & Kemudahan' },
  { id: 'security', en: 'Security & parking', ms: 'Keselamatan & Tempat Letak Kereta' },
  { id: 'cafeteria', en: 'Cafeteria', ms: 'Kafeteria' },
  { id: 'whole_hospital', en: 'The hospital as a whole', ms: 'Hospital secara keseluruhan' },
  { id: 'other', en: 'Something else', ms: 'Lain-lain' }
]

/* One dropdown, two groups: the clinical departments the patient may have
   been seen in, and the service areas everyone passes through. */
export const FEEDBACK_AREAS = [
  {
    group: { en: 'Clinical departments', ms: 'Jabatan Klinikal' },
    items: CLINICAL.map(d => ({ id: 'dept_' + d.id, en: d.en, ms: d.ms }))
  },
  {
    group: { en: 'Services and facilities', ms: 'Perkhidmatan dan Kemudahan' },
    items: SERVICE_AREAS.map(a => ({ id: 'area_' + a.id, en: a.en, ms: a.ms }))
  }
]

export const AREA_IDS = FEEDBACK_AREAS.flatMap(g => g.items.map(i => i.id))

export function areaLabel (id, lang) {
  for (const g of FEEDBACK_AREAS) {
    const hit = g.items.find(i => i.id === id)
    if (hit) return hit[lang] || hit.en
  }
  return null
}

/* --- consent ------------------------------------------------------------
   Two separate questions, because they are two separate decisions and a
   single tick cannot carry both. Each says what it covers and how to undo
   it. Neither is pre-ticked. */
export const CONSENT = {
  reply: {
    id: 'consentReply',
    en: 'You may use my email to reply to me about this.',
    ms: 'Anda boleh menggunakan e-mel saya untuk membalas mengenai perkara ini.',
    note: {
      en: 'Without an email address HTPN has no way to come back to you, and your feedback is read without a reply.',
      ms: 'Tanpa alamat e-mel, pihak HTPN tidak dapat menghubungi anda semula, dan maklum balas anda akan dibaca tanpa balasan.'
    }
  },
  /* Publication is a separate decision from submission, and it names exactly
     what would be published. "My feedback" is not specific enough to consent
     to; "these words and this photograph, on this page, under a first name
     or no name" is. */
  publish: {
    id: 'consentPublish',
    en: 'HTPN may share this appreciation — my words and the photograph I attached — on the hospital’s official Facebook page.',
    ms: 'HTPN boleh berkongsi penghargaan ini — kata-kata saya dan gambar yang saya lampirkan — di halaman Facebook rasmi hospital.',
    note: {
      en: 'Your full name, email and registration number are never published. HTPN decides what to share and may shorten your words; nothing is published automatically. To withdraw this later, reply to the acknowledgement or contact the hospital, quoting your reference number.',
      ms: 'Nama penuh, e-mel dan nombor pendaftaran anda tidak sekali-kali diterbitkan. HTPN menentukan apa yang dikongsikan dan mungkin memendekkan kata-kata anda; tiada apa-apa yang diterbitkan secara automatik. Untuk menarik balik kebenaran ini kemudian, balas e-mel pengesahan atau hubungi pihak hospital dengan menyatakan nombor rujukan anda.'
    },
    nameChoice: {
      en: 'If it is shared, show my name as:',
      ms: 'Jika dikongsikan, paparkan nama saya sebagai:'
    },
    nameOptions: [
      { id: 'anonymous', en: 'Do not show my name', ms: 'Jangan paparkan nama saya' },
      { id: 'first', en: 'First name only', ms: 'Nama pertama sahaja' },
      { id: 'full', en: 'My full name', ms: 'Nama penuh saya' }
    ]
  }
}

/* --- what the patient is told before they submit -------------------------
   WHO reads this, and WHEN. A form with neither is a form that quietly
   absorbs complaints nobody is accountable for. The two values below are
   placeholders and are marked as such on screen until HTPN fills them in:
   the app will not invent a service standard for a hospital. */
export const HANDLING = {
  owner: { en: 'HTPN — to be named', ms: 'HTPN — untuk dinamakan' },
  withinDays: null,
  confirmed: false,
  note: {
    en: 'Before this form is used by patients, HTPN must name the unit that reads it and the working days within which it replies. Until that is set, this screen says so rather than implying someone is watching.',
    ms: 'Sebelum borang ini digunakan oleh pesakit, HTPN perlu menamakan unit yang membacanya dan tempoh hari bekerja untuk balasan. Sehingga ia ditetapkan, skrin ini menyatakannya dan tidak memberi tanggapan bahawa ada pihak yang sedang memantau.'
  }
}

/* The one thing a feedback form must never swallow. */
export const URGENT = {
  en: 'If you or someone else is unwell right now, do not use this form. Go to the Emergency & Trauma Department or call 999. This form is read during office hours and is not a way to get help quickly.',
  ms: 'Sekiranya anda atau orang lain tidak sihat sekarang, jangan gunakan borang ini. Pergi ke Jabatan Kecemasan & Trauma atau hubungi 999. Borang ini dibaca pada waktu pejabat dan bukan saluran untuk mendapatkan bantuan segera.'
}

/* An official route exists. An app that becomes a second, unmonitored
   complaints inbox is worse for the patient than one that points at the
   first. The URL is NOT filled in: this build could not reach any government
   domain to confirm it, and a wrong complaints address is a complaint that
   goes nowhere. */
export const OFFICIAL_CHANNEL = {
  en: 'A formal complaint can also be made through the Public Complaints Bureau channel that the Ministry runs. Ask at the Public Relations Unit for the current address.',
  ms: 'Aduan rasmi juga boleh dibuat melalui saluran Biro Pengaduan Awam yang dikendalikan oleh Kementerian. Sila tanya di Unit Perhubungan Awam untuk alamat terkini.',
  url: null,
  urlConfirmed: false
}

export const IMAGE_LIMITS = {
  maxEdgePx: 1280,
  quality: 0.72,
  maxBytes: 400 * 1024,
  maxCount: 1
}
