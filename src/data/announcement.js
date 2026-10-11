/* ===========================================================================
   announcement.js — the theme, the notice, and the article behind it.

   THE QUOTE SLOT IS DELIBERATELY EMPTY.
   The brief asked for the Health Minister's words from the article below. The
   build environment could not open nst.com.my, so the words are not here. A
   quotation attributed to a named minister, printed in a hospital's own app,
   is the last thing that should ever be reconstructed from memory: if a single
   clause is wrong it is a government hospital misquoting a government
   minister. ARTICLE.quote stays null until someone pastes the exact sentence
   in, and the UI simply omits the block while it is null rather than filling
   the space with something approximate.

   WHAT IS ASSERTED HERE AND ON WHAT BASIS
   - The URL was supplied by HTPN.
   - The publisher (New Straits Times) and the date (December 2025) are read
     off that URL's own path.
   - The headline is the URL's slug turned back into a sentence, which is how
     NST builds its slugs; it is marked as such rather than quoted as exact.
   - Nothing else about the article is claimed.

   WHAT THIS APP IS NOT
   One Citizen One Record is a Ministry of Health programme. This prototype is
   not it, is not part of it, and must never imply that it is. What it is, is a
   record the patient holds themselves, which is useful precisely while a
   national one does not yet join a patient's hospitals together.
   ========================================================================= */

export const THEME = {
  short: { en: '1 Patient 1 Record', ms: '1 Pesakit 1 Rekod' },
  full: { en: 'Towards 1 Patient 1 Record', ms: 'Ke Arah 1 Pesakit 1 Rekod' }
}

export const ARTICLE = {
  url: 'https://www.nst.com.my/news/nation/2025/12/1334315/one-citizen-one-record-transform-malaysias-healthcare-system-dzulkefly',
  publisher: 'New Straits Times',
  published: { en: 'December 2025', ms: 'Disember 2025' },
  headlineFromSlug: {
    en: 'One Citizen One Record to transform Malaysia’s healthcare system — Dzulkefly',
    ms: 'One Citizen One Record untuk mentransformasi sistem penjagaan kesihatan Malaysia — Dzulkefly'
  },
  headlineIsExact: false,
  /* Paste the exact sentence here, with the speaker, and it will render.
     { text: { en, ms }, speaker: { en, ms } } */
  quote: null,
  readMore: { en: 'Read the article', ms: 'Baca artikel penuh' },
  needsInternet: true
}

export const ANNOUNCEMENT = {
  title: {
    en: 'If you are seen at more than one hospital or clinic',
    ms: 'Jika anda membuat susulan di lebih daripada satu hospital atau klinik'
  },
  body: {
    en: 'No single one of them holds your whole record. Until a national record joins them up, the most complete version of your history is the one you carry.',
    ms: 'Tiada satu pun daripadanya menyimpan keseluruhan rekod anda. Sehingga rekod kebangsaan menghubungkannya, versi sejarah perubatan anda yang paling lengkap ialah yang anda bawa sendiri.'
  },
  steps: [
    { en: 'Ask the doctor or pharmacist at each place to help you update this app while you are with them. It takes a minute and they can read their own prescription better than you can.',
      ms: 'Minta doktor atau ahli farmasi di setiap tempat membantu anda mengemas kini aplikasi ini semasa anda bersama mereka. Ia mengambil masa seminit dan mereka lebih memahami preskripsi mereka sendiri.' },
    { en: 'If they cannot, enter it yourself, or simply photograph the medicine list they hand you and read it in later.',
      ms: 'Sekiranya mereka tidak dapat berbuat demikian, masukkan sendiri, atau ambil gambar senarai ubat yang diberikan dan bacanya kemudian.' },
    { en: 'Keep the medicine list current above everything else. When your care is split between places, it is the one thing each of them asks for and none of them has in full.',
      ms: 'Pastikan senarai ubat sentiasa terkini melebihi yang lain. Apabila rawatan anda terbahagi antara beberapa tempat, itulah satu-satunya perkara yang ditanya oleh setiap satu dan tidak dimiliki sepenuhnya oleh mana-mana.' }
  ],
  /* Shown wherever the app could be mistaken for the national programme. */
  notTheProgramme: {
    en: 'One Citizen One Record is a Ministry of Health programme. This app is not part of it. This is a record you keep yourself, which is useful precisely because your hospitals are not yet joined up.',
    ms: 'One Citizen One Record ialah program Kementerian Kesihatan. Aplikasi ini bukan sebahagian daripadanya. Ini ialah rekod yang anda simpan sendiri, yang berguna justeru kerana hospital anda masih belum dihubungkan.'
  },
  /* The line that goes beside the medicines station, where it matters most. */
  medsNote: {
    en: 'Seen somewhere else as well? Add their medicines here too, or photograph the list they gave you. A list that covers only one hospital is the one that causes trouble.',
    ms: 'Mendapat rawatan di tempat lain juga? Tambah ubat dari sana di sini, atau ambil gambar senarai yang diberikan. Senarai yang merangkumi satu hospital sahaja itulah yang menimbulkan masalah.'
  }
}
