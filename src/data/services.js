/* ===========================================================================
   services.js — the outside services the app links to. Links only; this app
   never posts anything to them and never reads anything back from them.

   PROVENANCE OF EVERY LINK IN THIS FILE
   A link is a factual claim about where something lives, so it gets the same
   treatment as a clinical number: it is either sourced or it does not ship.
   An earlier version of this file carried an invented MyUbat web address that
   nobody had supplied. It is gone.

     IQMS.url     supplied by HTPN (Dr Naim).
     MYUBAT.url      supplied by HTPN (Dr Naim) — the Google Play listing.
     MYUBAT.briefing supplied by HTPN (Dr Naim) — the official briefing site.
     MYUBAT.posters  the official 8-page MyUBAT poster set, Program Perkhidmatan
                     Farmasi, ref PPF/A&P/IF042021, supplied by HTPN as a PDF
                     and bundled here as images so the tab works offline.
     EMERGENCY    999 is the Malaysian emergency number. No link.

   Do not add a link here that was not given to you. If you need one and do not
   have it, leave it out and say so on screen.
   ========================================================================= */

export const IQMS = {
  id: 'iqms',
  url: 'https://jknselangor.moh.gov.my/qms/#!/facility/11',
  poster: 'posters/iqms-htpn.jpg',
  name: { en: 'iQMS — queue number', ms: 'iQMS — nombor giliran' },
  points: [
    { en: 'Check your queue number from wherever you are. You do not have to sit outside the department.',
      ms: 'Semak nombor giliran anda dari mana-mana sahaja. Anda tidak perlu duduk di luar jabatan.' },
    { en: 'The number updates live, so you can see how close yours is.',
      ms: 'Nombor dikemas kini secara langsung, jadi anda boleh lihat sejauh mana giliran anda.' },
    { en: 'No registration and no account. Open the link and read your number.',
      ms: 'Tiada pendaftaran dan tiada akaun. Buka pautan dan baca nombor anda.' },
    { en: 'Needs an internet connection — this is the one part of the app that does.',
      ms: 'Memerlukan sambungan internet — ini satu-satunya bahagian aplikasi yang memerlukannya.' }
  ]
}

export const MYUBAT = {
  id: 'myubat',
  /* MyUbat is a phone app, not a website. This is its Google Play listing,
     supplied by HTPN. It is NOT opened inside this app — it is installed on
     the patient's own phone, which matters on a shared clinic tablet where
     nothing can be installed. */
  url: 'https://play.google.com/store/apps/details?id=my.gov.onegovappstore.myubat&hl=en',
  isApp: true,
  /* The official briefing page, run by Bahagian Perkhidmatan Farmasi. It
     explains the scheme; the app above is how a patient actually orders. */
  briefing: 'https://myubat.pharmacy.gov.my/?lang=en',
  name: { en: 'MyUbat — medicine delivered home', ms: 'MyUbat — ubat dihantar ke rumah' },
  howToGet: {
    en: 'MyUbat is an app you install on your own phone, not a website. Download it from Google Play, then sign in there.',
    ms: 'MyUbat ialah aplikasi yang anda pasang pada telefon anda sendiri, bukan laman web. Muat turunnya dari Google Play, kemudian log masuk di sana.'
  },
  /* We were given the Android listing only. Asserting that an iPhone version
     exists, or that it does not, would be a guess either way — so the app
     sends the patient to the one place that actually knows. */
  otherPhones: {
    en: 'This link is the Android version. If you use an iPhone, ask at the pharmacy counter which app to install — this app does not know.',
    ms: 'Pautan ini ialah versi Android. Jika anda menggunakan iPhone, tanya di kaunter farmasi aplikasi mana untuk dipasang — aplikasi ini tidak mengetahuinya.'
  },
  onTablet: {
    en: 'If you are reading this on a hospital tablet, do not install it here. Install it on your own phone when you get home.',
    ms: 'Jika anda membaca ini pada tablet hospital, jangan pasang di sini. Pasangkannya pada telefon anda sendiri apabila pulang.'
  },
  /* Two services, not one. An earlier version of this file described only the
     postal one and said nothing about the delivery charge — both corrected
     here against the official poster set. */
  points: [
    { en: 'Two services. Appointment System: your repeat supply is prepared in advance and you collect it at the facility on an agreed date, without the long wait.',
      ms: 'Dua perkhidmatan. Sistem Temu Janji: bekalan ubat susulan anda disediakan lebih awal dan anda mengambilnya di fasiliti pada tarikh yang dipersetujui, tanpa menunggu lama.' },
    { en: 'Medicine By Post (UMP): a courier delivers your repeat supply to an address you choose.',
      ms: 'Ubat Melalui Pos (UMP): syarikat penghantaran menghantar bekalan ubat susulan anda ke lokasi pilihan anda.' },
    { en: 'Delivery normally carries a charge, paid in cash to the courier on receipt. A free-delivery initiative has been running since 1 October 2026 while its allocation lasts — see the note below before you assume it is free.',
      ms: 'Penghantaran kebiasaannya dikenakan caj, dibayar secara tunai kepada syarikat penghantaran semasa menerima. Inisiatif penghantaran percuma sedang berjalan sejak 1 Oktober 2026 selagi peruntukannya masih ada — sila baca nota di bawah sebelum menganggap ia percuma.' },
    { en: 'For repeat supplies of a medicine you already take. Keep taking your current supply until the new one arrives — do not stop and wait.',
      ms: 'Untuk bekalan ulangan ubat yang anda sudah ambil. Teruskan bekalan semasa anda sehingga yang baharu tiba — jangan berhenti dan menunggu.' }
  ],

  /* The official poster set, bundled as images rather than linked, so the tab
     keeps working with no connection like the rest of the app. */
  posters: [
    { file: 'myubat-01.jpg', title: { en: 'What MyUBAT is', ms: 'Apakah itu MyUBAT?' } },
    { file: 'myubat-02.jpg', title: { en: 'Appointment System', ms: 'Sistem Temu Janji' } },
    { file: 'myubat-03.jpg', title: { en: 'Medicine By Post (UMP)', ms: 'Ubat Melalui Pos (UMP)' } },
    { file: 'myubat-04.jpg', title: { en: 'Six benefits of using MyUBAT', ms: '6 faedah menggunakan MyUBAT' } },
    { file: 'myubat-05.jpg', title: { en: 'Four simple steps', ms: '4 langkah mudah' } },
    { file: 'myubat-06.jpg', title: { en: 'Registering as a new user', ms: 'Pendaftaran pengguna baharu' } },
    { file: 'myubat-07.jpg', title: { en: 'Seven steps — Appointment System', ms: '7 langkah — Sistem Temu Janji' } },
    { file: 'myubat-08.jpg', title: { en: 'Seven steps — Medicine By Post', ms: '7 langkah — Ubat Melalui Pos' } }
  ].map(p => ({
    ...p,
    id: 'myubat_' + p.file.slice(7, 9),
    src: 'posters/myubat/' + p.file,
    creditLabel: { en: 'Program Perkhidmatan Farmasi, Ministry of Health Malaysia',
                   ms: 'Program Perkhidmatan Farmasi, Kementerian Kesihatan Malaysia' }
  })),
  /* The exclusion is the clinically important half of this tab, so it is held
     as its own list rather than buried in the points above. */
  notFor: [
    { glyph: 'cold',
      en: 'Anything that must stay cold. Insulin, some eye drops, some injections and all vaccines go by cold chain and are collected in person.',
      ms: 'Apa-apa yang mesti kekal sejuk. Insulin, sesetengah titisan mata, sesetengah suntikan dan semua vaksin menggunakan rantaian sejuk dan diambil sendiri.' },
    { glyph: 'lock',
      en: 'Controlled medicines such as strong painkillers, which must be handed over in person.',
      ms: 'Ubat terkawal seperti ubat tahan sakit kuat, yang mesti diserahkan sendiri.' },
    { glyph: 'counsel',
      en: 'A medicine you have never taken before, or one whose dose has just been changed. The pharmacist needs to counsel you for those.',
      ms: 'Ubat yang anda tidak pernah ambil sebelum ini, atau yang dosnya baru ditukar. Ahli farmasi perlu memberi kaunseling untuk itu.' },
    { glyph: 'empty',
      en: 'Anything you have run out of today. Delivery takes days — go to the pharmacy counter instead.',
      ms: 'Apa-apa yang anda kehabisan hari ini. Penghantaran mengambil masa berhari-hari — pergi ke kaunter farmasi sebaliknya.' }
  ],
  /* The charge and the current waiver, kept apart because they come from
     different places and have different lifespans.

     The charge is from the official 2021 poster set (PPF/A&P/IF042021), which
     is bundled in this app and says payment is made in cash on receipt.

     The waiver was reported to this build as a free-delivery initiative from
     1 October 2026, funded to RM5 million and ending when that is spent. The
     source given was a news item (siraplimau.com), not a Ministry circular,
     and the build environment could not open it to read it. It is therefore
     shown as a time-limited initiative to confirm, NOT as a standing fact:
     a patient who reads "free" in December and is charged has been misled by
     this app. Replace `verified: false` once the circular is in hand, and set
     `endedOn` when the allocation is exhausted. */
  deliveryCharge: {
    verified: false,
    source: { en: 'Reported to HTPN; not yet confirmed against a Ministry circular.',
              ms: 'Dilaporkan kepada HTPN; belum disahkan dengan pekeliling Kementerian.' },
    startedOn: '2026-10-01',
    endedOn: null,
    text: {
      en: 'Free delivery has been running since 1 October 2026, funded to RM5 million, and stops when that allocation is spent. There is no fixed end date, so ask the pharmacy whether it still applies before you order. Outside that period UMP carries a charge paid in cash to the courier.',
      ms: 'Penghantaran percuma sedang berjalan sejak 1 Oktober 2026, dengan peruntukan RM5 juta, dan akan berhenti apabila peruntukan itu habis. Tiada tarikh tamat yang ditetapkan, jadi sila tanya pihak farmasi sama ada ia masih terpakai sebelum anda memesan. Di luar tempoh tersebut, UMP dikenakan caj yang dibayar secara tunai kepada syarikat penghantaran.'
    }
  },

  coldChainWarning: {
    en: 'If you are not sure whether your medicine needs to stay cold, ask the pharmacy before ordering. Getting this wrong makes the medicine useless and you will not be able to tell by looking at it.',
    ms: 'Jika anda tidak pasti sama ada ubat anda perlu kekal sejuk, tanya farmasi sebelum memesan. Kesilapan ini menjadikan ubat tidak berkesan dan anda tidak akan dapat mengetahuinya dengan melihat sahaja.'
  }
}

/* Shown on the way-finding tab. Not clinical advice and not derived from any
   guideline — it is the list the registration counter asks for. */
export const BEFORE_YOU_COME = {
  title: { en: 'Before you set off', ms: 'Sebelum anda bertolak' },
  points: [
    { en: 'Check which of the two sites your appointment letter names. They are not next door to each other.',
      ms: 'Semak lokasi mana antara dua yang dinyatakan dalam surat temujanji anda. Keduanya tidak bersebelahan.' },
    { en: 'Bring your appointment letter, your IC, and your medicines or their boxes.',
      ms: 'Bawa surat temujanji, kad pengenalan, dan ubat anda atau kotaknya.' },
    { en: 'If you cannot bring the medicines, bring the list. My Records will print one for you.',
      ms: 'Jika anda tidak dapat membawa ubat, bawa senarainya. Rekod Saya boleh mencetaknya untuk anda.' }
  ]
}

export const EMERGENCY = {
  number: '999',
  text: {
    en: 'Chest pain, trouble breathing, weakness on one side, heavy bleeding, a fit, or a child who will not wake — go straight to the Emergency Department or call 999. Do not use this app for that.',
    ms: 'Sakit dada, sukar bernafas, lemah sebelah badan, pendarahan berat, sawan, atau anak yang tidak mahu bangun — terus ke Jabatan Kecemasan atau hubungi 999. Jangan gunakan aplikasi ini untuk itu.'
  }
}
