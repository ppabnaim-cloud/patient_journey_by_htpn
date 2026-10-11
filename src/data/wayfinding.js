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

/* The 21 further links, in the order they were supplied. */
const RAW_DEPARTMENT_LINKS = [
  'https://maps.app.goo.gl/bY8cEXWnWYxw69Dw5',
  'https://maps.app.goo.gl/WuYSdY4AUdCgw78k8',
  'https://maps.app.goo.gl/onqXD8CAeZaFsUUZ6',
  'https://maps.app.goo.gl/4qbAZVq1znC3E2iL6',
  'https://maps.app.goo.gl/c9y63sR5tv7WSs8g7',
  'https://maps.app.goo.gl/jV3jikoJCmLk1yYK9',
  'https://maps.app.goo.gl/iJa5mMaP8qgkN9WQ8',
  'https://maps.app.goo.gl/NTbNN6VfJjrS7Ps29',
  'https://maps.app.goo.gl/tHprYFFDAF2xpHXLA',
  'https://maps.app.goo.gl/uhUW6pEogbUKRSxdA',
  'https://maps.app.goo.gl/S5dm3qfw55UByBRG6',
  'https://maps.app.goo.gl/vAm3eigPkjkWB2JW8',
  'https://maps.app.goo.gl/cEc36HXjkszkdX6fA',
  'https://maps.app.goo.gl/D2UJUXU22VbDyvJk6',
  'https://maps.app.goo.gl/cvfB7meQd5fHN5xd6',
  'https://maps.app.goo.gl/ebAMqdZrR1Qwu5u58',
  'https://maps.app.goo.gl/5EBrFw8oT7TgsffC7',
  'https://maps.app.goo.gl/o5k2tDMkHGF1eFuT6',
  'https://maps.app.goo.gl/iaekFi5wJ1pPgZ1ZA',
  'https://maps.app.goo.gl/8oKYkM6PRBE9je4w8',
  'https://maps.app.goo.gl/3qcMu2JoF7zPd6xBA'
]

/* ---------------------------------------------------------------------------
   Locations 1-8 named by HTPN. Locations 9-21 still awaiting names.

   `icon` names an inline SVG drawn in App.jsx. These are NOT photographs. A
   stock or generated picture of "a radiology department" is a picture of some
   other hospital, and on a way-finding screen a patient would read it as a
   landmark to look for. An icon says what the department does and claims to be
   nothing else. Real photographs of these departments would be better, and
   would drop straight in here.
   ------------------------------------------------------------------------ */
const DEPARTMENT_NAMES = [
  { confirmed: true, icon: 'clinic',
    en: 'Specialist Clinic 2 — General Medicine & Orthopaedics',
    ms: 'Klinik Pakar 2 — Perubatan Am & Ortopedik', where: 'main' },                       //  1
  { confirmed: true, icon: 'office',
    en: 'Management Office 1 & Nursing Management Office',
    ms: 'Pejabat Pengurusan 1 & Pejabat Pengurusan Jururawat', where: 'main' },             //  2
  { confirmed: true, icon: 'radiology',
    en: 'Radiology Department — X-ray & CT scan',
    ms: 'Jabatan Radiologi — X-ray & Imbasan CT', where: 'main' },                          //  3
  { confirmed: true, icon: 'emergency',
    en: 'Emergency & Trauma Department',
    ms: 'Jabatan Kecemasan & Trauma', where: 'main' },                                      //  4
  { confirmed: true, icon: 'rehab',
    en: 'Rehabilitation Department',
    ms: 'Jabatan Rehabilitasi', where: 'main' },                                            //  5
  { confirmed: true, icon: 'dental',
    en: 'Oral & Maxillofacial Surgery Specialist Clinic',
    ms: 'Klinik Pakar Bedah Mulut & Maksilofasial', where: 'main' },                        //  6
  { confirmed: true, icon: 'pharmacy',
    en: 'Pharmacy Department',
    ms: 'Jabatan Farmasi', where: 'main' },                                                 //  7
  { confirmed: true, icon: 'it',
    en: 'Management Office 2 — IT & Engineering Unit',
    ms: 'Pejabat Pengurusan 2 — Unit IT & Kejuruteraan', where: 'main' },                   //  8
  { confirmed: false }, { confirmed: false }, { confirmed: false }, { confirmed: false },   //  9-12
  { confirmed: false }, { confirmed: false }, { confirmed: false }, { confirmed: false },   // 13-16
  { confirmed: false }, { confirmed: false }, { confirmed: false }, { confirmed: false },   // 17-20
  { confirmed: false }                                                                      // 21
]

export const DEPARTMENTS = RAW_DEPARTMENT_LINKS.map((map, i) => {
  const n = DEPARTMENT_NAMES[i] || { confirmed: false }
  const ok = !!(n.confirmed && n.en && n.ms)
  const name = ok ? { en: n.en, ms: n.ms } : { en: `Location ${i + 1}`, ms: `Lokasi ${i + 1}` }
  return {
    id: 'dept_' + String(i + 1).padStart(2, '0'),
    index: i + 1,
    confirmed: ok,
    icon: n.icon || 'pin',
    detailKey: 'department',
    building: n.where === 'main'
      ? { en: 'Main Building', ms: 'Bangunan Utama' }
      : null,
    map,
    name,
    /* An unconfirmed location has no name to search for, so it gets directions
       to the hospital itself rather than to a guess. */
    destination: ok ? `${n.ms}, ${HOSPITAL}` : HOSPITAL
  }
})

export const UNCONFIRMED_NOTE = {
  en: 'HTPN has not yet confirmed a name for this point. The exact-location link still opens the right place in Google Maps, where its real name is shown.',
  ms: 'HTPN masih belum mengesahkan nama bagi titik ini. Pautan lokasi tepat tetap membuka tempat yang betul dalam Google Maps, yang memaparkan nama sebenarnya.'
}

export const DIRECTIONS_NOTE = {
  en: 'Directions start from wherever your phone is now. This app never sees your location — Google Maps reads it on its own.',
  ms: 'Arah bermula dari kedudukan telefon anda sekarang. Aplikasi ini tidak sekali-kali melihat lokasi anda — Google Maps membacanya sendiri.'
}

export const confirmedCount = () => DEPARTMENTS.filter(d => d.confirmed).length
