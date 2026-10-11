/* ===========================================================================
   wayfinding.js — the hospital locations, and the Google Maps link for each.

   >>> NAMES PENDING CONFIRMATION <<<
   The two campuses below are named because they were given with their names.
   The other 21 links were supplied without names, and the build environment
   could not open maps.app.goo.gl to read them, so the place each one points to
   is NOT known to this file.

   Rule 1 of this project forbids guessing. Writing "Pharmacy" against a link
   that might be the mortuary is exactly the failure that rule exists to stop.
   So each unnamed link carries confirmed:false, the UI labels it plainly as
   unconfirmed, and the patient is told the link opens Google Maps where the
   real name will be shown.

   TO FIX: replace the name of each entry below and set confirmed:true. This is
   the only file that needs editing; nothing else references the labels.
   ========================================================================= */

export const CAMPUSES = [
  {
    id: 'wcc',
    confirmed: true,
    detailKey: 'wcc',
    name: {
      en: 'Women & Children Complex (WCC), HTPN',
      ms: 'Kompleks Wanita & Kanak-Kanak (WCC), HTPN'
    },
    blurb: {
      en: 'Obstetrics, gynaecology, paediatrics and the newborn unit.',
      ms: 'Obstetrik, ginekologi, pediatrik dan unit bayi baru lahir.'
    },
    map: 'https://maps.app.goo.gl/REaZswJ2h5YenUyC6'
  },
  {
    id: 'main',
    confirmed: true,
    detailKey: 'main',
    name: {
      en: 'Main Building, HTPN',
      ms: 'Bangunan Utama, HTPN'
    },
    blurb: {
      en: 'Emergency, specialist clinics, wards, pharmacy and the laboratory.',
      ms: 'Kecemasan, klinik pakar, wad, farmasi dan makmal.'
    },
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
   >>> EDIT HERE. One line per link, same order as above. <<<
   Put the real name in en/ms and change confirmed to true. Anything still
   false renders with the "name not confirmed" label and is listed last.
   ------------------------------------------------------------------------ */
const DEPARTMENT_NAMES = [
  { confirmed: false, en: '', ms: '' },   //  1
  { confirmed: false, en: '', ms: '' },   //  2
  { confirmed: false, en: '', ms: '' },   //  3
  { confirmed: false, en: '', ms: '' },   //  4
  { confirmed: false, en: '', ms: '' },   //  5
  { confirmed: false, en: '', ms: '' },   //  6
  { confirmed: false, en: '', ms: '' },   //  7
  { confirmed: false, en: '', ms: '' },   //  8
  { confirmed: false, en: '', ms: '' },   //  9
  { confirmed: false, en: '', ms: '' },   // 10
  { confirmed: false, en: '', ms: '' },   // 11
  { confirmed: false, en: '', ms: '' },   // 12
  { confirmed: false, en: '', ms: '' },   // 13
  { confirmed: false, en: '', ms: '' },   // 14
  { confirmed: false, en: '', ms: '' },   // 15
  { confirmed: false, en: '', ms: '' },   // 16
  { confirmed: false, en: '', ms: '' },   // 17
  { confirmed: false, en: '', ms: '' },   // 18
  { confirmed: false, en: '', ms: '' },   // 19
  { confirmed: false, en: '', ms: '' },   // 20
  { confirmed: false, en: '', ms: '' }    // 21
]

export const DEPARTMENTS = RAW_DEPARTMENT_LINKS.map((map, i) => {
  const n = DEPARTMENT_NAMES[i] || { confirmed: false, en: '', ms: '' }
  const ok = n.confirmed && n.en && n.ms
  return {
    id: 'dept_' + String(i + 1).padStart(2, '0'),
    index: i + 1,
    confirmed: !!ok,
    detailKey: 'department',
    map,
    name: ok
      ? { en: n.en, ms: n.ms }
      : {
          en: `Location ${i + 1}`,
          ms: `Lokasi ${i + 1}`
        }
  }
})

export const UNCONFIRMED_NOTE = {
  en: 'The hospital has not yet confirmed the name for this point. The link opens Google Maps, which will show the real name.',
  ms: 'Hospital masih belum mengesahkan nama bagi titik ini. Pautan membuka Google Maps, yang akan memaparkan nama sebenar.'
}

export const confirmedCount = () => DEPARTMENTS.filter(d => d.confirmed).length
