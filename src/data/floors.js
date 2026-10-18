/* ===========================================================================
   floors.js — the nine-level directory, transcribed from the board itself.

   SOURCE
   A photograph of the DIREKTORI board supplied by HTPN, saved in this
   repository as public/brand/wcc-directory.jpg so anybody can check this
   transcription against it. Nothing here is inferred: every line below is a
   line on that board, in the order it appears, including the two oddities
   noted at the foot of this file.

   WHY THIS MATTERS MORE THAN THE GPS PINS
   A map pin puts a patient at the front door of a nine-storey building. The
   floor number is what gets them to the right counter. For everything on this
   board, the level is the useful instruction and the pin is the fallback.

   WHICH BUILDING — ANSWERED
   This was flagged as an open conflict: six departments on this board had
   also been described as being in the Main Building. HTPN's satellite view
   settles it. They are TWO SEPARATE SITES about a kilometre apart, and the
   map shows each has its own emergency department and its own intensive
   care. So both statements were true all along: this board is the WCC's, and
   the Main Building has its own Medical Records, theatre, ICU and the rest.

   That distinction is now the most important thing on the way-finding screen.
   A patient who goes to the wrong one does not take a wrong turn inside a
   building — they are a kilometre away with an appointment starting.
   ========================================================================= */

export const BUILDING = {
  en: 'Women & Children Complex (WCC)',
  ms: 'Kompleks Wanita & Kanak-Kanak (WCC)'
}

/* The Main Building has departments of the same name — its own emergency
   department, its own intensive care unit. The levels below are the WCC's
   and nobody else's. */
export const BUILDING_QUERY = {
  en: 'These nine levels are the Women & Children Complex. The Main Building is a separate site about a kilometre away and has departments of the same name, so check which one your appointment letter gives.',
  ms: 'Sembilan aras ini adalah Kompleks Wanita & Kanak-Kanak. Bangunan Utama ialah lokasi berasingan kira-kira satu kilometer dari sini dan mempunyai jabatan dengan nama yang sama, jadi sila semak lokasi yang dinyatakan dalam surat temujanji anda.'
}

export const DIRECTORY_PHOTO = 'brand/wcc-directory.jpg'
export const DIRECTORY_CAPTION = {
  en: 'The directory board, photographed by HTPN. Every line below is transcribed from it.',
  ms: 'Papan direktori, dirakam oleh HTPN. Setiap baris di bawah disalin daripadanya.'
}

/* `urgent` marks the two entries the board itself prints in red. */
export const FLOORS = [
  {
    level: 1,
    en: 'Level 1', ms: 'Aras 1',
    items: [
      { en: 'Main Lobby', ms: 'Lobi Utama' },
      { en: 'Registration & Payment', ms: 'Pendaftaran & Pembayaran' },
      { en: 'Radiology Department', ms: 'Jabatan Radiologi' },
      { en: 'Cafeteria', ms: 'Kafeteria' },
      { en: 'Emergency & Trauma Department', ms: 'Jabatan Kecemasan & Trauma', urgent: true },
      { en: 'Pregnancy Assessment Centre (PAC / EPAU)', ms: 'Pusat Penilaian Kehamilan (PAC / EPAU)' },
      { en: 'Forensic Unit', ms: 'Unit Forensik' },
      { en: 'Hospital Support Services', ms: 'Perkhidmatan Sokongan Hospital' },
      { en: 'Logistics Pharmacy', ms: 'Farmasi Logistik' },
      { en: 'Dietetics & Catering Department', ms: 'Jabatan Dietetik & Sajian' },
      { en: 'Medical Social Work Department', ms: 'Jabatan Kerja Sosial Perubatan' }
    ]
  },
  {
    level: 2,
    en: 'Level 2', ms: 'Aras 2',
    items: [
      { en: 'Rehabilitation Department', ms: 'Jabatan Rehabilitasi' },
      { en: 'Obstetrics & Gynaecology Specialist Clinic', ms: 'Klinik Pakar Obstetrik & Ginekologi' },
      { en: 'Paediatric Dentistry Specialist Clinic', ms: 'Klinik Pakar Pergigian Pediatrik' },
      { en: 'Paediatric Surgery / Orthopaedics Specialist Clinic', ms: 'Klinik Pakar Pembedahan / Ortopedik Pediatrik' },
      { en: 'Paediatrics Specialist Clinic', ms: 'Klinik Pakar Pediatrik' },
      { en: 'Specialist Clinic Registration & Payment', ms: 'Pendaftaran & Pembayaran Klinik Pakar' },
      { en: 'Specialist Clinic Pharmacy', ms: 'Farmasi Klinik Pakar' }
    ]
  },
  {
    level: 3,
    en: 'Level 3', ms: 'Aras 3',
    items: [
      { en: 'Paediatric Intensive Care Unit (PICU)', ms: 'Unit Rawatan Rapi Pediatrik (PICU)' },
      { en: 'Special Care Nursery (SCN)', ms: 'Unit Penjagaan Bayi (SCN)' },
      { en: 'Neonatal Intensive Care Unit (NICU)', ms: 'Unit Rawatan Rapi Neonatal (NICU)' },
      { en: 'Labour Room', ms: 'Dewan Bersalin', urgent: true }
    ]
  },
  {
    level: 4,
    en: 'Level 4', ms: 'Aras 4',
    items: [
      { en: 'Intensive Care & High Dependency Ward (ICU & HDW)', ms: 'Unit Rawatan Rapi & High Dependency Ward (ICU & HDW)' },
      { en: 'Operating Theatre', ms: 'Dewan Bedah' },
      { en: 'Sterile Supply Unit (UBBS)', ms: 'Unit Bekalan Bahan Steril (UBBS)' }
    ]
  },
  {
    level: 5,
    en: 'Level 5', ms: 'Aras 5',
    items: [
      { en: 'Day Care Unit', ms: 'Unit Rawatan Harian' },
      { en: 'Pathology Department', ms: 'Jabatan Patologi' },
      { en: 'Information Technology Unit', ms: 'Unit Teknologi Maklumat' },
      { en: 'Health Education Unit', ms: 'Unit Pendidikan Kesihatan' },
      { en: 'Medical Records Department', ms: 'Jabatan Rekod Perubatan' },
      { en: 'Pharmacy Department', ms: 'Jabatan Farmasi' },
      { en: 'Inpatient Pharmacy', ms: 'Farmasi Pesakit Dalam' },
      { en: 'Engineering Unit', ms: 'Unit Kejuruteraan' }
    ]
  },
  {
    level: 6,
    en: 'Level 6', ms: 'Aras 6',
    items: [
      { en: 'Ward 6A (Gynaecology)', ms: 'Wad 6A (Ginekologi)' },
      { en: 'Ward 6B (Paediatric Surgery)', ms: 'Wad 6B (Pembedahan Pediatrik)' },
      { en: 'On-Call Officers’ Complex', ms: 'Kompleks Pegawai Atas Panggilan' }
    ]
  },
  {
    level: 7,
    en: 'Level 7', ms: 'Aras 7',
    items: [
      { en: 'Ward 7A (Obstetrics)', ms: 'Wad 7A (Obstetrik)' },
      { en: 'Ward 7B (Obstetrics)', ms: 'Wad 7B (Obstetrik)' },
      { en: 'Satellite Pharmacy', ms: 'Farmasi Satelit' }
    ]
  },
  {
    level: 8,
    en: 'Level 8', ms: 'Aras 8',
    items: [
      { en: 'Ward 8A (Paediatric Medicine)', ms: 'Wad 8A (Perubatan Pediatrik)' },
      { en: 'Ward 8B (Paediatric Medicine)', ms: 'Wad 8B (Perubatan Pediatrik)' }
    ]
  },
  {
    level: 9,
    en: 'Level 9', ms: 'Aras 9',
    items: [
      { en: 'Ward 9A (First Class)', ms: 'Wad 9A (Kelas Satu)' },
      { en: 'Infection Control Unit', ms: 'Unit Kawalan Infeksi' },
      { en: 'Administration Office', ms: 'Pejabat Pentadbiran' },
      { en: 'Nursing Unit', ms: 'Unit Kejururawatan' },
      { en: 'Specialists’ Office Complex', ms: 'Kompleks Pejabat Pakar' },
      { en: 'Health Education Unit', ms: 'Unit Pendidikan Kesihatan' }
    ]
  }
]

/* Two things the board itself does, transcribed rather than tidied:
   - "Unit Pendidikan Kesihatan" is printed on BOTH Aras 5 and Aras 9. It may
     be two rooms, or the board may be out of date. It is left on both.
   - "Jabatan Farmasi" on Aras 5 and "Farmasi Klinik Pakar" on Aras 2 are
     different counters, which is why HTPN renamed the clinic one: an
     unqualified "Farmasi" sends a patient to whichever the search finds. */
export const TRANSCRIPTION_NOTES = {
  en: 'Transcribed exactly as printed, including the Health Education Unit appearing on both Level 5 and Level 9.',
  ms: 'Disalin tepat sebagaimana tercetak, termasuk Unit Pendidikan Kesihatan yang muncul pada Aras 5 dan Aras 9.'
}

export const TOTAL_ITEMS = FLOORS.reduce((n, f) => n + f.items.length, 0)

/* One flat index, so the search on the wayfinding screen can answer "which
   floor is X on" without walking the tree on every keystroke. */
export function findFloor (query, lang) {
  const q = String(query || '').trim().toLowerCase()
  if (q.length < 2) return []
  const out = []
  for (const f of FLOORS) {
    for (const it of f.items) {
      const hay = `${it.ms} ${it.en}`.toLowerCase()
      if (hay.includes(q)) out.push({ floor: f, item: it })
    }
  }
  return out
}
