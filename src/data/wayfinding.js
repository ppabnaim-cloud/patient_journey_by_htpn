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

   `signboard` IS THE SIGN ABOVE THE DOOR, TRANSCRIBED FROM HTPN'S OWN
   PHOTOGRAPHS. It is not the department's official name and often differs
   from it — location 1 is "Klinik Pakar 2" in the directory but the board
   over the entrance reads KLINIK PERUBATAN AM / KLINIK ORTOPEDIK. A patient
   standing in the car park is reading the board, not the directory, so the
   board is what the card shows them to look for.

   NO ACCESS LABELS. This build added "visitors by arrangement" and "staff
   area" chips on the theatre, ICU, dietetics and the logistics pharmacy.
   HTPN removed them, and was right to: the theatre and ICU have daily
   visiting periods for family, dietetics runs a dietician clinic, and the
   logistics pharmacy receives vendor deliveries. Every location here is one
   somebody has a reason to walk to, and all of them give directions.

   What replaced the chips is `why` — the reason a visitor would come, where
   HTPN gave one. The useful half of the same sentence.

   `icon` names an inline SVG drawn in App.jsx. These are NOT photographs. A
   stock or generated picture of "a radiology department" is a picture of some
   other hospital, and on a way-finding screen a patient reads it as a landmark
   to look for. Real photographs of these departments drop straight in here.
   ------------------------------------------------------------------------ */
const DEPARTMENT_LIST = [
  { icon: 'clinic',
    en: 'Specialist Clinic 2 — General Medicine & Orthopaedics',
    ms: 'Klinik Pakar 2 — Perubatan Am & Ortopedik',
    signboard: 'KLINIK PERUBATAN AM · KLINIK ORTOPEDIK',
    map: 'https://maps.app.goo.gl/bY8cEXWnWYxw69Dw5' },

  { icon: 'office',
    en: 'Management Office 1 & Nursing Management Office',
    ms: 'Pejabat Pengurusan 1 & Pejabat Pengurusan Jururawat',
    map: 'https://maps.app.goo.gl/WuYSdY4AUdCgw78k8' },

  { icon: 'radiology',
    en: 'Radiology Department — X-ray & CT scan',
    ms: 'Jabatan Radiologi — X-ray & Imbasan CT',
    signboard: 'IMBASAN TOMOGRAF BERKOMPUTER (CT SCAN)',
    map: 'https://maps.app.goo.gl/onqXD8CAeZaFsUUZ6' },

  { icon: 'emergency',
    en: 'Emergency & Trauma Department',
    ms: 'Jabatan Kecemasan & Trauma',
    signboard: 'JABATAN KECEMASAN & TRAUMA · KAUNTER SARINGAN UTAMA',
    /* The gantry over the approach road splits three ways, and which lane a
       family takes matters: walking up the ambulance lane puts people in
       front of a reversing ambulance. Transcribed from the sign itself. */
    split: [
      { dir: 'left', en: 'Public', ms: 'Awam' },
      { dir: 'right', en: 'Ambulance route', ms: 'Laluan Ambulans' }
    ],
    why: { en: 'Green Zone building, Emergency & Trauma', ms: 'Bangunan Zon Hijau, Jabatan Kecemasan dan Trauma' },
    map: 'https://maps.app.goo.gl/4qbAZVq1znC3E2iL6' },

  { icon: 'rehab',
    en: 'Rehabilitation Department',
    ms: 'Jabatan Rehabilitasi',
    map: 'https://maps.app.goo.gl/c9y63sR5tv7WSs8g7' },

  { icon: 'dental',
    en: 'Oral & Maxillofacial Surgery Specialist Clinic',
    ms: 'Klinik Pakar Bedah Mulut & Maksilofasial',
    map: 'https://maps.app.goo.gl/jV3jikoJCmLk1yYK9' },

  /* Renamed by HTPN from "Jabatan Farmasi". The hospital now has three
     pharmacy points, and an unqualified "Farmasi" would send a patient
     collecting a prescription to whichever one the search happened to find. */
  { icon: 'pharmacy',
    en: 'Specialist Clinic Pharmacy',
    ms: 'Farmasi Klinik Pakar',
    map: 'https://maps.app.goo.gl/iJa5mMaP8qgkN9WQ8' },

  { icon: 'it',
    en: 'Management Office 2 — IT & Engineering Unit',
    ms: 'Pejabat Pengurusan 2 — Unit IT & Kejuruteraan',
    map: 'https://maps.app.goo.gl/NTbNN6VfJjrS7Ps29' },

  { icon: 'records',
    en: 'Medical Records Department',
    ms: 'Unit Rekod Perubatan',
    map: 'https://maps.app.goo.gl/HnXQsXmNPuq3WvL19' },

  /* The only entry supplied as coordinates rather than a saved place, so it
     is the only one whose directions are exact to the metre. Coordinates are
     better than a name here: "kaunter zon hijau" is not a thing Google Maps
     can resolve by text. */
  { icon: 'pharmacy',
    en: 'Pharmacy Green Zone Counter',
    ms: 'Kaunter Zon Hijau Farmasi',
    latLng: '2.993372,101.792977' },

  { icon: 'hall',
    en: 'Dewan Bestari / Dewan Permaisuri (hall)',
    ms: 'Dewan Bestari / Dewan Permaisuri',
    map: 'https://maps.app.goo.gl/MsRkKipjFSRckRW88' },

  { icon: 'surgery',
    en: 'Operating Theatre',
    ms: 'Dewan Bedah',
    why: { en: 'Daily visiting period for family', ms: 'Waktu melawat harian untuk ahli keluarga' },
    map: 'https://maps.app.goo.gl/s9VpMtv2NaeQxrWm9' },

  { icon: 'icu',
    en: 'Intensive Care Unit (ICU)',
    ms: 'Unit Rawatan Rapi (ICU)',
    why: { en: 'Daily visiting period for family', ms: 'Waktu melawat harian untuk ahli keluarga' },
    map: 'https://maps.app.goo.gl/KN4nhPr8JJeeToWAA' },

  { icon: 'dietetics',
    en: 'Dietetics & Catering Department',
    ms: 'Jabatan Dietetik & Sajian',
    why: { en: 'The dietitian clinic is held here', ms: 'Klinik pakar diet diadakan di sini' },
    map: 'https://maps.app.goo.gl/nU1V1f9VupnsuG8V7' },

  { icon: 'pharmacy',
    en: 'Logistics Pharmacy',
    ms: 'Farmasi Logistik',
    why: { en: 'Bulk deliveries from suppliers', ms: 'Penghantaran pukal daripada pembekal' },
    map: 'https://maps.app.goo.gl/XLYRMo9B4BTEo7En7' },

  { icon: 'forensic',
    en: 'Forensic Department',
    ms: 'Jabatan Forensik',
    map: 'https://maps.app.goo.gl/G8g1wyB1fJJU3ES1A' },

  /* The three below were photographed by HTPN inside the Main Building. No
     map pin has been supplied for them, so `map` is null and the card offers
     directions to the hospital rather than to a guessed coordinate. The
     photographs and the signage are what actually find these counters: they
     are doors along a corridor, not places a satellite can point at. */
  { icon: 'office',
    en: 'Revenue Unit — Patient & Emergency Registration',
    ms: 'Unit Hasil — Pendaftaran Pesakit & Kecemasan',
    signboard: 'UNIT HASIL · PENDAFTARAN PESAKIT & KECEMASAN',
    map: null, photo: 'brand/bu-unit-hasil.jpg',
    hours: {
      en: 'Revenue Unit: Monday to Friday, 8am to 5pm. The ward admission counter is open 24 hours.',
      ms: 'Unit Hasil: Isnin hingga Jumaat, 8 pagi hingga 5 petang. Kaunter Daftar Masuk Wad dibuka 24 jam.'
    },
    sign: { en: 'Take your receipt after paying.', ms: 'Sila ambil resit selepas membuat pembayaran.' } },

  { icon: 'radiology',
    en: 'Diagnostic Imaging Department',
    ms: 'Jabatan Pengimejan Diagnostik',
    signboard: 'JABATAN PENGIMEJAN DIAGNOSTIK',
    map: null, photo: 'brand/bu-pengimejan.jpg',
    /* The department's own signboard splits here, with an arrow each way.
       Reproduced rather than summarised: at the door, the arrow is the
       instruction. */
    split: [
      { dir: 'left', en: 'CT scan', ms: 'CT Scan' },
      { dir: 'right', en: 'Radiography A — X-ray', ms: 'Radiografi A — X-Ray' }
    ] },

  { icon: 'office',
    en: 'Director\u2019s Office & Management Division',
    ms: 'Pejabat Pengarah & Pejabat Pengurusan',
    signboard: 'BAHAGIAN PENGURUSAN',
    map: null, photo: 'brand/bu-pengurusan.jpg' }
]

/* ---------------------------------------------------------------------------
   THE TWO SITES ARE NOT THE SAME PLACE, AND THAT IS THE HEADLINE

   HTPN occupies two separate sites about a kilometre apart. Each has its own
   emergency department and its own intensive care unit, so the names on a
   signboard do not tell a patient which site they are standing at. Going to
   the wrong one is not a wrong turn down a corridor — it is a kilometre and
   a missed appointment.

   Distance supplied by HTPN as "within 1 km"; it is stated as approximate
   because that is how it was given, and because the walk between two
   hospital entrances is never the straight line a map measures.
   ------------------------------------------------------------------------ */
export const SITES_DIFFER = {
  title: { en: 'Two sites, nearly 1 km apart', ms: 'Dua lokasi, hampir 1 km berbeza' },
  body: {
    en: 'The Main Building and the Women & Children Complex are different places, nearly 1 km apart. Both have an emergency department and an intensive care unit, so the name alone will not tell you which one you want — check the site named on your appointment letter before you set off.',
    ms: 'Bangunan Utama dan Kompleks Wanita & Kanak-Kanak adalah dua tempat berbeza, hampir 1 km jaraknya. Kedua-duanya mempunyai jabatan kecemasan dan unit rawatan rapi, jadi nama sahaja tidak menentukan lokasi yang anda perlukan — sila semak lokasi yang dinyatakan dalam surat temujanji anda sebelum bertolak.'
  },
  approxKm: 1,
  /* HTPN's own satellite view, which is what makes the point at a glance:
     two emergency departments, two sites, a kilometre of Kajang between
     them. A sentence can be skimmed past; the picture cannot. */
  image: 'brand/two-sites.jpg',
  imageCaption: {
    en: 'Both sites on one map, as supplied by HTPN. The Main Building is on the left, the Women & Children Complex on the right.',
    ms: 'Kedua-dua lokasi pada satu peta, sebagaimana diberikan oleh HTPN. Bangunan Utama di sebelah kiri, Kompleks Wanita & Kanak-Kanak di sebelah kanan.'
  },
  source: { en: 'Distance as given by HTPN', ms: 'Jarak sebagaimana dinyatakan oleh HTPN' }
}

/* Every department above is in the Main Building. Said once, here. */
export const DEPARTMENTS_BUILDING = { en: 'Main Building', ms: 'Bangunan Utama' }

/* What each access level means on screen. Worded so a patient knows whether
   to walk there, and worded carefully for the one that matters most. */

export const DEPARTMENTS = DEPARTMENT_LIST.map((d, i) => ({
  id: 'dept_' + String(i + 1).padStart(2, '0'),
  index: i + 1,
  confirmed: true,
  icon: d.icon,
  why: d.why || null,
  detailKey: 'department',
  /* Kept on the record for anything that reads a single department on its
     own; the list screen prints the building once instead. */
  building: DEPARTMENTS_BUILDING,
  /* A saved place where HTPN gave one, a Maps query where it gave
     coordinates, and null where it gave neither — a door photographed along
     a corridor has no pin, and inventing one is worse than offering none. */
  map: d.map || (d.latLng ? `https://www.google.com/maps/search/?api=1&query=${d.latLng}` : null),
  photo: d.photo || null,
  signboard: d.signboard || null,
  hours: d.hours || null,
  sign: d.sign || null,
  split: d.split || null,
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
