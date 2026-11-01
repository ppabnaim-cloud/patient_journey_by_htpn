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

/* The Main Building's own saved place, as supplied by HTPN for the site card
   below. Every department on this page is inside that building, so it is the
   pin for the three counters HTPN photographed without one — see the note
   above them. */
const MAIN_BUILDING_MAP = 'https://maps.app.goo.gl/39pox6E6PciNfYTz5'

/* Origin omitted on purpose — see the note at the top of this file. */
export function directionsUrl (destinationText) {
  return 'https://www.google.com/maps/dir/?api=1&destination=' +
         encodeURIComponent(destinationText) + '&travelmode=driving'
}

export const CAMPUSES = [
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
    map: MAIN_BUILDING_MAP
  },
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
    group: 'out',
    ms: 'Klinik Pakar 2 — Perubatan Am & Ortopedik',
    signboard: 'KLINIK PERUBATAN AM · KLINIK ORTOPEDIK',
    map: 'https://maps.app.goo.gl/bY8cEXWnWYxw69Dw5' },

  { icon: 'office',
    en: 'Management Office 1 & Nursing Management Office',
    group: 'admin',
    ms: 'Pejabat Pengurusan 1 & Pejabat Pengurusan Jururawat',
    map: 'https://maps.app.goo.gl/WuYSdY4AUdCgw78k8' },

  /* TWO radiology departments in the Main Building, not one: this is the CT
     and X-ray department, and ultrasound and mammography are a separate
     place with their own pin, under Outpatient. Each has its own saved
     place, confirmed by HTPN.

     What was merged into this card was a third entry for this same
     department, named by its signboard rather than by its service. Its
     signboard and its door arrows live here now — the arrows are what the
     patient reads at the door, and the second name is what is painted
     above it. */
  { icon: 'radiology',
    en: 'Radiology Department — X-ray & CT scan',
    group: 'urgent',
    ms: 'Jabatan Radiologi — X-ray & Imbasan CT',
    signboard: 'JABATAN PENGIMEJAN DIAGNOSTIK · IMBASAN TOMOGRAF BERKOMPUTER (CT SCAN)',
    photo: 'brand/bu-pengimejan.jpg',
    split: [
      { dir: 'left', en: 'CT scan', ms: 'CT Scan' },
      { dir: 'right', en: 'Radiography A — X-ray', ms: 'Radiografi A — X-Ray' }
    ],
    map: 'https://maps.app.goo.gl/BbPR8WGtQWKwL41Y8' },

  { icon: 'emergency',
    en: 'Emergency & Trauma Department',
    group: 'urgent',
    /* First in its group. Somebody reading this heading in a hurry is
       looking for this one, not for the X-ray department. */
    rank: 1,
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
    group: 'out',
    ms: 'Jabatan Rehabilitasi',
    map: 'https://maps.app.goo.gl/c9y63sR5tv7WSs8g7' },

  { icon: 'dental',
    en: 'Oral & Maxillofacial Surgery Specialist Clinic',
    group: 'out',
    ms: 'Klinik Pakar Bedah Mulut & Maksilofasial',
    map: 'https://maps.app.goo.gl/jV3jikoJCmLk1yYK9' },

  /* Renamed by HTPN from "Jabatan Farmasi". The hospital now has three
     pharmacy points, and an unqualified "Farmasi" would send a patient
     collecting a prescription to whichever one the search happened to find. */
  { icon: 'pharmacy',
    en: 'Specialist Clinic Pharmacy',
    group: 'out',
    ms: 'Farmasi Klinik Pakar',
    map: 'https://maps.app.goo.gl/iJa5mMaP8qgkN9WQ8' },

  { icon: 'it',
    en: 'Management Office 2 — IT & Engineering Unit',
    group: 'admin',
    ms: 'Pejabat Pengurusan 2 — Unit IT & Kejuruteraan',
    map: 'https://maps.app.goo.gl/NTbNN6VfJjrS7Ps29' },

  { icon: 'records',
    en: 'Medical Records Department',
    group: 'in',
    ms: 'Unit Rekod Perubatan',
    map: 'https://maps.app.goo.gl/HnXQsXmNPuq3WvL19' },

  /* The only entry supplied as coordinates rather than a saved place, so it
     is the only one whose directions are exact to the metre. Coordinates are
     better than a name here: "kaunter zon hijau" is not a thing Google Maps
     can resolve by text. */
  { icon: 'pharmacy',
    en: 'Pharmacy Green Zone Counter',
    group: 'urgent',
    ms: 'Kaunter Zon Hijau Farmasi',
    latLng: '2.993372,101.792977' },

  { icon: 'hall',
    en: 'Dewan Bestari / Dewan Permaisuri (hall)',
    group: 'admin',
    ms: 'Dewan Bestari / Dewan Permaisuri',
    map: 'https://maps.app.goo.gl/MsRkKipjFSRckRW88' },

  { icon: 'surgery',
    en: 'Operating Theatre',
    group: 'in',
    ms: 'Dewan Bedah',
    why: { en: 'Daily visiting period for family', ms: 'Waktu melawat harian untuk ahli keluarga' },
    map: 'https://maps.app.goo.gl/s9VpMtv2NaeQxrWm9' },

  { icon: 'icu',
    en: 'Intensive Care Unit (ICU)',
    group: 'in',
    ms: 'Unit Rawatan Rapi (ICU)',
    why: { en: 'Daily visiting period for family', ms: 'Waktu melawat harian untuk ahli keluarga' },
    map: 'https://maps.app.goo.gl/KN4nhPr8JJeeToWAA' },

  { icon: 'dietetics',
    en: 'Dietetics & Catering Department',
    group: 'admin',
    ms: 'Jabatan Dietetik & Sajian',
    why: { en: 'The dietitian clinic is held here', ms: 'Klinik pakar diet diadakan di sini' },
    map: 'https://maps.app.goo.gl/nU1V1f9VupnsuG8V7' },

  { icon: 'pharmacy',
    en: 'Logistics Pharmacy',
    group: 'admin',
    ms: 'Farmasi Logistik',
    why: { en: 'Bulk deliveries from suppliers', ms: 'Penghantaran pukal daripada pembekal' },
    map: 'https://maps.app.goo.gl/XLYRMo9B4BTEo7En7' },

  { icon: 'forensic',
    en: 'Forensic Department',
    group: 'admin',
    ms: 'Jabatan Forensik',
    map: 'https://maps.app.goo.gl/G8g1wyB1fJJU3ES1A' },

  /* ---- outpatient, added by HTPN ------------------------------------- */
  { icon: 'clinic',
    group: 'out',
    en: 'Specialist Clinic 1 — Surgery',
    ms: 'Klinik Pakar 1 — Pembedahan',
    map: 'https://maps.app.goo.gl/NNyF5yEnDg1avx3h7' },

  /* A second revenue counter, distinct from the Unit Hasil above: this one
     serves emergency patients and Specialist Clinic 2. Different counter,
     different saved place — the pin check below would catch it if it were
     the same one typed twice. */
  { icon: 'office',
    group: 'urgent',
    en: 'Revenue counter — emergency patients & Specialist Clinic 2',
    ms: 'Kaunter Hasil — Pesakit Kecemasan & Klinik Pakar 2',
    map: 'https://maps.app.goo.gl/NKa24BCyfNBBYVWz5' },

  /* Ultrasound and mammography sit under OUTPATIENT on HTPN's instruction,
     apart from the X-ray and CT departments in the emergency group above.
     They are different visits: these two are booked and attended, the other
     two are where somebody is sent mid-emergency. */
  { icon: 'radiology',
    group: 'out',
    en: 'Radiology Department — ultrasound & mammogram',
    ms: 'Jabatan Radiologi — Ultrasound & Mamogram',
    map: 'https://maps.app.goo.gl/CKN5XLkZYcf5Zv1a7' },

  { icon: 'bloods',
    group: 'out',
    en: 'Phlebotomy — blood-taking room',
    ms: 'Bilik Ambil Darah (Flebotomi)',
    map: 'https://maps.app.goo.gl/MaybWsUznps2F7wF9' },

  { icon: 'dental',
    group: 'out',
    en: 'Special Care Dentistry',
    ms: 'Pergigian Penjagaan Khas',
    map: 'https://maps.app.goo.gl/xXpD5bBgxJXqs7QYA' },

  { icon: 'pharmacy',
    group: 'out',
    en: 'Drive-through pharmacy',
    ms: 'Farmasi Pandu Lalu',
    map: 'https://maps.app.goo.gl/GXWeWkCcnNpeb7Hn7' },

  { icon: 'surau',
    group: 'admin',
    en: 'Surau',
    ms: 'Surau Hospital',
    map: 'https://maps.app.goo.gl/QmAwN7Pp1uQAGHvu8' },

  /* ---- the wards, the psychiatry clinic, the cafe and the public health
     offices, all supplied by HTPN as saved places -------------------------

     Wad 5 and Wad 9 are listed by number and nothing else, because that is
     what HTPN gave. A ward's speciality is not something to infer from its
     number, and a wrong guess sends a family to the wrong floor. If HTPN
     names them, the name goes beside the number as it does for 6, 7 and 8. */
  { icon: 'clinic',
    en: 'Psychiatry Specialist Clinic',
    group: 'out',
    ms: 'Klinik Pakar Psikiatri',
    map: 'https://maps.app.goo.gl/VhBEesH5v6AHQqyz5' },

  { icon: 'ward',
    en: 'Four-storey block — Wards 1, 2, 3 and 4',
    group: 'in',
    ms: 'Bangunan 4 Tingkat — Wad 1, 2, 3 dan 4',
    map: 'https://maps.app.goo.gl/Gc3pMfMPsfZy3yRf6' },

  { icon: 'ward',
    en: 'Ward 5',
    group: 'in',
    ms: 'Wad 5',
    map: 'https://maps.app.goo.gl/s3gdDiuEspc8nRuU6' },

  { icon: 'ward',
    en: 'Ward 6 — isolation',
    group: 'in',
    ms: 'Wad 6 — Isolasi',
    map: 'https://maps.app.goo.gl/8ZN2cbb59QUCB3db7' },

  { icon: 'ward',
    en: 'Ward 7 — surgical and orthopaedic',
    group: 'in',
    ms: 'Wad 7 — Wad Pembedahan dan Ortopedik',
    map: 'https://maps.app.goo.gl/ZdQL8qVNZYbYf18q8' },

  { icon: 'ward',
    en: 'Ward 8 — psychiatric',
    group: 'in',
    ms: 'Wad 8 — Wad Psikiatri',
    map: 'https://maps.app.goo.gl/fipssSWkAtocZpVK8' },

  { icon: 'ward',
    en: 'Ward 9',
    group: 'in',
    ms: 'Wad 9',
    map: 'https://maps.app.goo.gl/CHsXX3E6QRemhmrZ8' },

  { icon: 'dietetics',
    en: 'Hospital cafe',
    group: 'admin',
    ms: 'Kafe Hospital',
    map: 'https://maps.app.goo.gl/PmuYbav1Y2y1pAfb8' },

  { icon: 'office',
    en: 'Public Health Unit · Occupational & Environmental Health Unit · Assistant Medical Officer Supervisor\u2019s Office',
    group: 'admin',
    ms: 'Unit Kesihatan Awam · Unit Kesihatan Pekerjaan & Persekitaran · Pejabat Penyelia Pembantu Pegawai Perubatan (PPP)',
    map: 'https://maps.app.goo.gl/S1PGXBrnLq4UZYf76' },

  /* The three below were photographed by HTPN inside the Main Building, and
     no saved place of their own was supplied for any of them.

     They point at the MAIN BUILDING's pin rather than at nothing, so that
     every location on this page offers the same two things and a patient
     never meets a card that is missing one. That is not a guess: these are
     doors along a corridor inside that building, and the building is where
     somebody drives to. The signboard line on each card is what finds the
     door once they are through it — which is why these three are the cards
     that carry one.

     A coordinate is still not invented. If HTPN supplies a saved place for
     any of the three, replace MAIN_BUILDING_MAP on that entry with it and
     nothing else changes. */
  { icon: 'office',
    en: 'Revenue Unit — Patient & Emergency Registration',
    group: 'urgent',
    ms: 'Unit Hasil — Pendaftaran Pesakit & Kecemasan',
    signboard: 'UNIT HASIL · PENDAFTARAN PESAKIT & KECEMASAN',
    map: MAIN_BUILDING_MAP, photo: 'brand/bu-unit-hasil.jpg',
    hours: {
      en: 'Revenue Unit: Monday to Friday, 8am to 5pm. The ward admission counter is open 24 hours.',
      ms: 'Unit Hasil: Isnin hingga Jumaat, 8 pagi hingga 5 petang. Kaunter Daftar Masuk Wad dibuka 24 jam.'
    },
    sign: { en: 'Take your receipt after paying.', ms: 'Sila ambil resit selepas membuat pembayaran.' } },


  { icon: 'office',
    en: 'Director\u2019s Office & Management Division',
    group: 'admin',
    ms: 'Pejabat Pengarah & Pejabat Pengurusan',
    signboard: 'BAHAGIAN PENGURUSAN',
    map: MAIN_BUILDING_MAP, photo: 'brand/bu-pengurusan.jpg' }
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
    ms: 'Bangunan Utama dan Kompleks Wanita & Kanak-Kanak adalah dua tempat berbeza, hampir 1 km jaraknya. Kedua-duanya mempunyai jabatan kecemasan dan unit rawatan rapi, jadi nama sahaja tidak menentukan lokasi yang anda perlukan — sila semak lokasi yang dinyatakan dalam surat janji temu anda sebelum bertolak.'
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

/* ---------------------------------------------------------------------------
   THE MAIN BUILDING, GROUPED

   Thirty-three locations in one unbroken list is a wall. HTPN asked for three
   headings — outpatient, inpatient, administration — and they cover most of
   it.

   They do not cover three: the Emergency Department and the two imaging
   departments. A casualty department is not an outpatient clinic, and filing
   it under one to make the scheme tidy would be a guess with consequences for
   somebody reading quickly. So those three have a heading of their own, and
   it comes first, because that is the order of urgency rather than the order
   HTPN listed.

   `order` is the order the headings appear on screen; nothing infers it from
   the order locations happen to sit in the list.
   ------------------------------------------------------------------------ */
export const DEPT_GROUPS = [
  /* Emergency, the two imaging departments, and the two counters that serve
     the Emergency Department — registration and the green zone pharmacy.
     HTPN moved those two here: somebody being sent to them is in the middle
     of an emergency visit, not attending an outpatient clinic. */
  { id: 'urgent', order: 1,
    en: 'Emergency, imaging & emergency counters', ms: 'Kecemasan, Pengimejan & Kaunter Kecemasan' },
  { id: 'out', order: 2,
    en: 'Outpatient services', ms: 'Perkhidmatan Pesakit Luar' },
  { id: 'in', order: 3,
    en: 'Inpatient services', ms: 'Perkhidmatan Pesakit Dalam' },
  { id: 'admin', order: 4,
    en: 'Administration & facilities', ms: 'Pentadbiran & Kemudahan' }
]

/* Locations in HTPN's heading order, with their heading. A location whose
   group is unknown would vanish from a grouped list without a word, so it is
   returned under a heading of its own instead — and engine-check fails on
   it, which is how it gets fixed rather than shipped. */
export function groupedDepartments (list) {
  const seen = new Map()
  for (const d of list) {
    const g = d.group || 'ungrouped'
    if (!seen.has(g)) seen.set(g, [])
    seen.get(g).push(d)
  }
  /* Stable: equal ranks keep the order they were listed in. */
  for (const [, list] of seen) list.sort((a, b) => (a.rank ?? 50) - (b.rank ?? 50))
  const out = []
  for (const g of [...DEPT_GROUPS].sort((a, b) => a.order - b.order)) {
    if (seen.has(g.id)) { out.push({ group: g, items: seen.get(g.id) }); seen.delete(g.id) }
  }
  for (const [id, items] of seen) {
    out.push({ group: { id, en: id, ms: id }, items })
  }
  /* Numbered in the order they are READ, not in the order they happen to sit
     in the source list. Grouping scrambled the old numbers — the first three
     cards read 3, 4, 32 — which looks like a list with holes in it. The
     number is only a handle for pointing at a card, so it follows the eye. */
  let n = 0
  for (const section of out) {
    section.items = section.items.map(d => ({ ...d, displayIndex: ++n }))
  }
  return out
}
const WCC_BUILDING = { en: 'Women & Children Complex (WCC)', ms: 'Kompleks Wanita & Kanak-Kanak (WCC)' }

/* ---------------------------------------------------------------------------
   THE WCC'S OWN LOCATIONS

   The list above is the Main Building's. These six are the Women & Children
   Complex's, supplied by HTPN as saved places.

   WHY A SECOND FORENSIC DEPARTMENT IS NOT A MISTAKE
   There is a Jabatan Forensik in the list above as well. The two sites each
   have one, as they each have their own emergency department, and the WCC's
   own directory board lists Unit Forensik on Aras 1. Somebody told to go to
   "forensics" needs the site named before the department, which is the whole
   reason this section is split by building.

   The parking entrance and the café are here for the same reason as the
   lobby: they are what a family actually asks for on arrival, and neither
   appears on a directory board.
   ------------------------------------------------------------------------ */
const WCC = 'Hospital Tengku Permaisuri Norashikin (Pusat Rawatan Wanita dan Kanak-Kanak), Kajang'

const DEPARTMENT_LIST_WCC = [
  { icon: 'hall',
    en: 'Main Lobby',
    ms: 'Lobi Utama',
    map: 'https://maps.app.goo.gl/XweXtDWaZHBgMjyaA' },

  { icon: 'emergency',
    en: 'Emergency Department — triage counter',
    ms: 'Kaunter Triaj, Jabatan Kecemasan',
    map: 'https://maps.app.goo.gl/W2mUSpUtieqTq1xg8' },

  { icon: 'clinic',
    en: 'Patient Assessment Centre (PAC) — maternity emergencies',
    ms: 'Pusat Penilaian Pesakit (PAC) — Kecemasan Bersalin',
    why: { en: 'Obstetrics & Gynaecology. This is where a maternity emergency is seen, not the main emergency department.',
           ms: 'Jabatan Obstetrik & Ginekologi. Di sinilah kecemasan bersalin dilihat, bukan di Jabatan Kecemasan utama.' },
    map: 'https://maps.app.goo.gl/L2VKUTVaJiCrP9zS7' },

  { icon: 'forensic',
    en: 'Forensic Department',
    ms: 'Jabatan Forensik',
    map: 'https://maps.app.goo.gl/PLucw3DV1bQDBLnX6' },

  { icon: 'pin',
    en: 'Multi-storey public car park — entrance',
    ms: 'Laluan Masuk Parkir Awam Bertingkat',
    map: 'https://maps.app.goo.gl/HuiyrBiW5LmKsFte8' },

  { icon: 'dietetics',
    en: 'Hospital café',
    ms: 'Kafe Hospital',
    map: 'https://maps.app.goo.gl/2SNUpmjcJNksbdTU7' }
]

/* What each access level means on screen. Worded so a patient knows whether
   to walk there, and worded carefully for the one that matters most. */

/* One builder, two lists. The WCC's locations get the same card, the same two
   links and the same checks as the Main Building's — a second hand-rolled
   shape would drift from this one within a week. */
function buildList (list, building, destinationSite, prefix) {
  return list.map((d, i) => ({
  id: prefix + String(i + 1).padStart(2, '0'),
  index: i + 1,
  confirmed: true,
  icon: d.icon,
  /* Which heading this location sits under. Null on the WCC's list, which
     is six entries and needs none. */
  group: d.group || null,
  /* Position within the group. Everything without one keeps the order it
     sits in the list; a lower number pulls a location to the top of its
     heading. */
  rank: d.rank ?? 50,
  why: d.why || null,
  detailKey: 'department',
  /* Kept on the record for anything that reads a single department on its
     own; the list screen prints the building once instead. */
  building,
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
  destination: d.latLng || `${d.ms}, ${destinationSite}`
  }))
}

export const DEPARTMENTS = buildList(DEPARTMENT_LIST, DEPARTMENTS_BUILDING, HOSPITAL, 'dept_')
export const DEPARTMENTS_WCC = buildList(DEPARTMENT_LIST_WCC, WCC_BUILDING, WCC, 'wccd_')
export const WCC_BUILDING_NAME = WCC_BUILDING

export const UNCONFIRMED_NOTE = {
  en: 'HTPN has not yet confirmed a name for this point. The exact-location link still opens the right place in Google Maps, where its real name is shown.',
  ms: 'HTPN masih belum mengesahkan nama bagi titik ini. Pautan lokasi tepat tetap membuka tempat yang betul dalam Google Maps, yang memaparkan nama sebenarnya.'
}

/* DIRECTIONS_NOTE was here — "directions start from wherever your phone is,
   this app never sees your location". Removed on HTPN's instruction: it is
   reassurance about the app's own plumbing, which a patient looking for a
   clinic does not need to read. Nothing about the behaviour changed — the
   origin is still left out of every Maps URL, so the app still never sees a
   coordinate. */

export const confirmedCount = () => DEPARTMENTS.filter(d => d.confirmed).length
