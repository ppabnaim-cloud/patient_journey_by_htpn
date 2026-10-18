/* ===========================================================================
   wayfinding.js — the hospital locations, and how a patient gets to each.

   TWO KINDS OF LINK PER LOCATION, AND THE REASON FOR BOTH
   1. `directions` — opens Google Maps directions. The origin is deliberately
      LEFT OUT of the URL: Google Maps then uses the device's own current
      location automatically. That is what the patient wants, and it needs no
      geolocation permission prompt from this app, which never sees or stores
      a coordinate.
      The destination is the location's full name as a text query. Text
      resolution is very good but it is not a guarantee, which is why (2) exists.
   2. `map` — the exact Google Maps link supplied by HTPN. Always correct,
      because it points at a saved place rather than a search. Shown as the
      secondary action, for anyone whose directions resolve oddly.

   When maps.app.goo.gl can be reached from a build environment, resolve each
   short link to coordinates and put them in `latLng` below; `directions` then
   switches to exact coordinates and (2) becomes unnecessary.

   NAMES
   Locations 1-8 were named by HTPN and are marked confirmed. Locations 9-21
   were supplied as bare links with no names, and this build could not reach
   maps.app.goo.gl to read them. Rule 1 of this project forbids guessing, so
   they render as "Location N" with an on-screen note. Their links still work.
   ========================================================================= */

const HOSPITAL = 'Hospital Tengku Permaisuri Norashikin, Kajang, Selangor'

/* Origin omitted on purpose — see the note at the top of this file. */
export function directionsUrl (destinationText) {
  return 'https://www.google.com/maps/dir/?api=1&destination=' +
         encodeURIComponent(destinationText) + '&travelmode=driving'
}

export const CAMPUSES = [
  {
    id: 'wcc',
    confirmed: true,
    detailKey: 'wcc',
    image: 'brand/wcc.jpg',
    name: {
      en: 'Women & Children Complex (WCC)',
      ms: 'Kompleks Wanita & Kanak-Kanak (WCC)'
    },
    blurb: {
      en: 'Obstetrics, gynaecology, paediatrics and the newborn unit.',
      ms: 'Obstetrik, ginekologi, pediatrik dan unit bayi baharu lahir.'
    },
    destination: 'Hospital Tengku Permaisuri Norashikin (Pusat Rawatan Wanita dan Kanak-Kanak), Kajang',
    map: 'https://maps.app.goo.gl/REaZswJ2h5YenUyC6'
  },
  {
    id: 'main',
    confirmed: true,
    detailKey: 'main',
    image: 'brand/main-building.jpg',
    name: {
      en: 'Main Building',
      ms: 'Bangunan Utama'
    },
    blurb: {
      en: 'Emergency, specialist clinics, wards, pharmacy and the laboratory.',
      ms: 'Kecemasan, klinik pakar, wad, farmasi dan makmal.'
    },
    destination: HOSPITAL,
    map: 'https://maps.app.goo.gl/39pox6E6PciNfYTz5'
  }
]

/* ---------------------------------------------------------------------------
   THE DEPARTMENT LIST

   One entry per place, each carrying its own name and its own link, so a
   name can never drift onto the wrong pin — the previous shape kept names
   and links in two parallel arrays, which is exactly how that happens.

   Everything here is in the Main Building. That is stated once, as a banner
   above the list, rather than repeated on all sixteen cards.

   `access` is not decoration. An operating theatre, an intensive care unit,
   a logistics pharmacy and a catering department are not places a patient
   walks into, and a forensic department is somewhere a family is taken, not
   somewhere anyone should be sent by a cheerful "Get directions" button. The
   screen says which is which.

   `icon` names an inline SVG drawn in App.jsx. These are NOT photographs. A
   stock or generated picture of "a radiology department" is a picture of some
   other hospital, and on a way-finding screen a patient reads it as a landmark
   to look for. Real photographs of these departments drop straight in here.
   ------------------------------------------------------------------------ */
const DEPARTMENT_LIST = [
  { icon: 'clinic', access: 'public',
    en: 'Specialist Clinic 2 — General Medicine & Orthopaedics',
    ms: 'Klinik Pakar 2 — Perubatan Am & Ortopedik',
    map: 'https://maps.app.goo.gl/bY8cEXWnWYxw69Dw5' },

  { icon: 'office', access: 'public',
    en: 'Management Office 1 & Nursing Management Office',
    ms: 'Pejabat Pengurusan 1 & Pejabat Pengurusan Jururawat',
    map: 'https://maps.app.goo.gl/WuYSdY4AUdCgw78k8' },

  { icon: 'radiology', access: 'public',
    en: 'Radiology Department — X-ray & CT scan',
    ms: 'Jabatan Radiologi — X-ray & Imbasan CT',
    map: 'https://maps.app.goo.gl/onqXD8CAeZaFsUUZ6' },

  { icon: 'emergency', access: 'public',
    en: 'Emergency & Trauma Department',
    ms: 'Jabatan Kecemasan & Trauma',
    map: 'https://maps.app.goo.gl/4qbAZVq1znC3E2iL6' },

  { icon: 'rehab', access: 'public',
    en: 'Rehabilitation Department',
    ms: 'Jabatan Rehabilitasi',
    map: 'https://maps.app.goo.gl/c9y63sR5tv7WSs8g7' },

  { icon: 'dental', access: 'public',
    en: 'Oral & Maxillofacial Surgery Specialist Clinic',
    ms: 'Klinik Pakar Bedah Mulut & Maksilofasial',
    map: 'https://maps.app.goo.gl/jV3jikoJCmLk1yYK9' },

  /* Renamed by HTPN from "Jabatan Farmasi". The hospital now has three
     pharmacy points, and an unqualified "Farmasi" would send a patient
     collecting a prescription to whichever one the search happened to find. */
  { icon: 'pharmacy', access: 'public',
    en: 'Specialist Clinic Pharmacy',
    ms: 'Farmasi Klinik Pakar',
    map: 'https://maps.app.goo.gl/iJa5mMaP8qgkN9WQ8' },

  { icon: 'it', access: 'public',
    en: 'Management Office 2 — IT & Engineering Unit',
    ms: 'Pejabat Pengurusan 2 — Unit IT & Kejuruteraan',
    map: 'https://maps.app.goo.gl/NTbNN6VfJjrS7Ps29' },

  { icon: 'records', access: 'public',
    en: 'Medical Records Department',
    ms: 'Unit Rekod Perubatan',
    map: 'https://maps.app.goo.gl/HnXQsXmNPuq3WvL19' },

  /* The only entry supplied as coordinates rather than a saved place, so it
     is the only one whose directions are exact to the metre. Coordinates are
     better than a name here: "kaunter zon hijau" is not a thing Google Maps
     can resolve by text. */
  { icon: 'pharmacy', access: 'public',
    en: 'Pharmacy Green Zone Counter',
    ms: 'Kaunter Zon Hijau Farmasi',
    latLng: '2.993372,101.792977' },

  { icon: 'hall', access: 'public',
    en: 'Dewan Bestari / Dewan Permaisuri (hall)',
    ms: 'Dewan Bestari / Dewan Permaisuri',
    map: 'https://maps.app.goo.gl/MsRkKipjFSRckRW88' },

  { icon: 'surgery', access: 'restricted',
    en: 'Operating Theatre',
    ms: 'Dewan Bedah',
    map: 'https://maps.app.goo.gl/s9VpMtv2NaeQxrWm9' },

  { icon: 'icu', access: 'restricted',
    en: 'Intensive Care Unit (ICU)',
    ms: 'Unit Rawatan Rapi (ICU)',
    map: 'https://maps.app.goo.gl/KN4nhPr8JJeeToWAA' },

  { icon: 'dietetics', access: 'staff',
    en: 'Dietetics & Catering Department',
    ms: 'Jabatan Dietetik & Sajian',
    map: 'https://maps.app.goo.gl/nU1V1f9VupnsuG8V7' },

  { icon: 'pharmacy', access: 'staff',
    en: 'Logistics Pharmacy',
    ms: 'Farmasi Logistik',
    map: 'https://maps.app.goo.gl/XLYRMo9B4BTEo7En7' },

  { icon: 'forensic', access: 'escorted',
    en: 'Forensic Department',
    ms: 'Jabatan Forensik',
    map: 'https://maps.app.goo.gl/G8g1wyB1fJJU3ES1A' }
]

/* Every department above is in the Main Building. Said once, here. */
export const DEPARTMENTS_BUILDING = { en: 'Main Building', ms: 'Bangunan Utama' }

/* What each access level means on screen. Worded so a patient knows whether
   to walk there, and worded carefully for the one that matters most. */
export const ACCESS_NOTES = {
  public: null,
  restricted: {
    label: { en: 'Visitors by arrangement', ms: 'Pelawat mengikut kebenaran' },
    note: {
      en: 'A closed unit. Visiting is by the ward\u2019s arrangement, not by walking in — ask the nurse in charge first.',
      ms: 'Unit tertutup. Lawatan adalah mengikut kebenaran wad, bukan dengan masuk terus — sila tanya jururawat bertugas dahulu.'
    }
  },
  staff: {
    label: { en: 'Staff area', ms: 'Kawasan kakitangan' },
    note: {
      en: 'A service department rather than a patient one. The location is here for staff and for deliveries.',
      ms: 'Jabatan sokongan, bukan untuk pesakit. Lokasi ini disertakan untuk kakitangan dan urusan penghantaran.'
    }
  },
  escorted: {
    label: { en: 'Please ask at the counter first', ms: 'Sila tanya di kaunter dahulu' },
    note: {
      en: 'Families are accompanied here by hospital staff. If you have been asked to come, speak to the counter or the ward first so that somebody meets you.',
      ms: 'Keluarga akan diiringi ke sini oleh pihak hospital. Sekiranya anda diminta hadir, sila berhubung dengan kaunter atau wad terlebih dahulu supaya ada yang menyambut anda.'
    }
  }
}

export const DEPARTMENTS = DEPARTMENT_LIST.map((d, i) => ({
  id: 'dept_' + String(i + 1).padStart(2, '0'),
  index: i + 1,
  confirmed: true,
  icon: d.icon,
  access: d.access,
  detailKey: 'department',
  /* Kept on the record for anything that reads a single department on its
     own; the list screen prints the building once instead. */
  building: DEPARTMENTS_BUILDING,
  /* A saved place where HTPN gave one, a Maps query where it gave
     coordinates. Both open the same app at the same pin. */
  map: d.map || `https://www.google.com/maps/search/?api=1&query=${d.latLng}`,
  name: { en: d.en, ms: d.ms },
  /* Coordinates beat a text search every time, so they are used where they
     exist and the department's own name is the fallback. */
  destination: d.latLng || `${d.ms}, ${HOSPITAL}`
}))

export const UNCONFIRMED_NOTE = {
  en: 'HTPN has not yet confirmed a name for this point. The exact-location link still opens the right place in Google Maps, where its real name is shown.',
  ms: 'HTPN masih belum mengesahkan nama bagi titik ini. Pautan lokasi tepat tetap membuka tempat yang betul dalam Google Maps, yang memaparkan nama sebenarnya.'
}

export const DIRECTIONS_NOTE = {
  en: 'Directions start from wherever your phone is now. This app never sees your location — Google Maps reads it on its own.',
  ms: 'Arah bermula dari kedudukan telefon anda sekarang. Aplikasi ini tidak sekali-kali melihat lokasi anda — Google Maps membacanya sendiri.'
}

export const confirmedCount = () => DEPARTMENTS.filter(d => d.confirmed).length
