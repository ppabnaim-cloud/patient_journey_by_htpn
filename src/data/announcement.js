/* ===========================================================================
   announcement.js — the theme, the notice, and the article behind it.

   WHAT IS ASSERTED HERE AND ON WHAT BASIS
   The headline, byline and timestamp below were supplied verbatim by HTPN
   from the article itself, so they are rendered as exact. nst.com.my could
   not be opened from the build environment, so NOTHING ELSE about the article
   is claimed — in particular there is no quotation from the Minister's speech
   here, because none was read. The headline carries his words in quotation
   marks and is shown as a headline, which is what it is; it is not dressed up
   as a sentence he was heard to say.

   THE PHOTOGRAPH
   It is a press photograph from the article, supplied by HTPN and bundled so
   the panel works offline like the rest of the app. It is credited on screen.
   Press agency photographs are licensed: formal permission from Bernama / New
   Straits Times should be in hand before this goes beyond a prototype.

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
  publisher: 'Bernama',
  carriedBy: 'New Straits Times',
  byline: { en: 'By Bernama', ms: 'Oleh Bernama' },
  published: { en: '10 December 2025, 11:22pm', ms: '10 Disember 2025, 11:22 malam' },
  /* Supplied verbatim by HTPN from the article itself, so rendered as exact. */
  headline: {
    en: '\u201cOne Citizen, One Record\u201d says Health Minister Datuk Seri Dr Dzulkefly Ahmad',
    ms: '\u201cOne Citizen, One Record\u201d kata Menteri Kesihatan Datuk Seri Dr Dzulkefly Ahmad'
  },
  headlineIsExact: true,
  photo: {
    src: 'brand/minister-dzulkefly.jpg',
    alt: { en: 'Health Minister Datuk Seri Dr Dzulkefly Ahmad',
           ms: 'Menteri Kesihatan Datuk Seri Dr Dzulkefly Ahmad' },
    credit: { en: 'Photograph: Bernama, via New Straits Times',
              ms: 'Gambar: Bernama, melalui New Straits Times' }
  },
  /* No speech is quoted. The article itself was not read from this build, and
     the headline above already carries the Minister's phrase in quotation
     marks, presented as the headline it is rather than dressed up as a
     sentence he was heard to say. */
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
