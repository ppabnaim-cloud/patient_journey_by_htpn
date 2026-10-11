/* ===========================================================================
   posters.js — Tab 7, "The Public's Role Towards a Healthier Nation".

   The files are COPIED INTO THIS APP (public/posters/) rather than linked to
   raw.githubusercontent.com. That is deliberate: the app promises on screen
   that it works with no internet connection, and a poster fetched from GitHub
   would break that promise the moment a patient opened the tab in a basement
   corridor. Bundling them keeps the promise true.

   Titles and role groupings are taken verbatim from the manifest.json in
   ppabnaim-cloud/ed-pac-public-view (web/rakyat/manifest.json), which is the
   source of record for this poster set.
   ========================================================================= */

export const SECTION = {
  title: {
    en: "The Public's Role Towards a Healthier Nation",
    ms: 'Peranan Rakyat Ke Arah Negara Lebih Sihat'
  },
  subtitle: {
    en: 'Easing the crowding in the Emergency Department',
    ms: 'Mengurangkan kesesakan di Jabatan Kecemasan'
  },
  lead: {
    en: 'Each poster shows one small daily choice — and what happens when it is not made. Tap any poster to see it large or download it.',
    ms: 'Setiap poster menunjukkan satu pilihan kecil harian — dan apa yang berlaku apabila ia tidak dibuat. Ketik mana-mana poster untuk melihatnya besar atau memuat turunnya.'
  }
}

export const ROLES = [
  { role: 1, detailKey: 'role_1', title: { en: 'Move every day', ms: 'Bergerak setiap hari' } },
  { role: 2, detailKey: 'role_2', title: { en: 'Cut down on sugar', ms: 'Kurangkan gula' } },
  { role: 3, detailKey: 'role_3', title: { en: 'Get screened early', ms: 'Buat saringan awal' } },
  { role: 4, detailKey: 'role_4', title: { en: 'Stop over-claimed supplements', ms: 'Hentikan suplemen yang didakwa berlebihan' } },
  { role: 5, detailKey: 'role_5', title: { en: 'Report smoking where it is banned', ms: 'Laporkan merokok di kawasan larangan' } },
  { role: 0, detailKey: 'role_other', title: { en: 'Other', ms: 'Lain-lain' } }
]

const CREDITS = {
  naim: { en: 'Dr Naim, HTPN', ms: 'Dr Naim, HTPN' },
  kkm: { en: 'Ministry of Health Malaysia', ms: 'Kementerian Kesihatan Malaysia' }
}

export const POSTERS = [
  { file: 'rakyat-02.jpg', role: 1, credit: 'naim', title: { en: 'Getting up early to walk is hard', ms: 'Bangun awal untuk berjalan itu susah' } },
  { file: 'rakyat-05.jpg', role: 1, credit: 'naim', title: { en: 'Taking the office stairs is hard', ms: 'Naik tangga di pejabat itu susah' } },
  { file: 'kkm-langkah-sihat.jpg', role: 1, credit: 'kkm', title: { en: 'Healthy Steps Challenge — a national record', ms: 'Cabaran Langkah Sihat Itu Saya — rekod kebangsaan' } },

  { file: 'rakyat-03.jpg', role: 2, credit: 'naim', title: { en: 'Cutting the sugar in your teh tarik is hard', ms: 'Mengurangkan manis dalam teh tarik itu susah' } },
  { file: 'rakyat-06.jpg', role: 2, credit: 'naim', title: { en: 'Reading the sugar label before buying is hard', ms: 'Membaca label gula sebelum membeli itu susah' } },

  { file: 'rakyat-04.jpg', role: 3, credit: 'naim', title: { en: 'Taking a day off for screening is hard', ms: 'Mengambil cuti sehari untuk saringan itu susah' } },
  { file: 'rakyat-07.jpg', role: 3, credit: 'naim', title: { en: 'One blood test a year is hard', ms: 'Mengambil darah sekali setahun itu susah' } },
  { file: 'rakyat-08.jpg', role: 3, credit: 'naim', title: { en: 'Taking your medicine every day is hard', ms: 'Mengambil ubat setiap hari itu susah' } },
  { file: 'rakyat-09.jpg', role: 3, credit: 'naim', title: { en: 'Bringing a child for immunisation is hard', ms: 'Membawa anak untuk imunisasi itu susah' } },

  { file: 'rakyat-01.jpg', role: 4, credit: 'naim', title: { en: 'Refusing a friend’s "miracle cure" is hard', ms: 'Menolak pujukan "ubat ajaib" itu susah' } },

  { file: 'rakyat-10.jpg', role: 5, credit: 'naim', title: { en: 'Quitting smoking is hard', ms: 'Berhenti merokok itu susah' } },
  { file: 'rakyat-11.jpg', role: 5, credit: 'naim', title: { en: 'Reporting smoking where it is banned is hard', ms: 'Melaporkan perokok di kawasan larangan itu susah' } },

  { file: 'rakyat-12.jpg', role: 0, credit: 'naim', title: { en: 'Wearing a helmet for a five-minute ride is hard', ms: 'Memakai topi keledar untuk perjalanan 5 minit itu susah' } }
].map((p, i) => ({
  ...p,
  id: 'poster_' + String(i + 1).padStart(2, '0'),
  src: 'posters/' + p.file,
  creditLabel: CREDITS[p.credit] || CREDITS.naim
}))

export function postersForRole (role) {
  return POSTERS.filter(p => p.role === role)
}
