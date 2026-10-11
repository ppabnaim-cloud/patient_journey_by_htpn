/* ===========================================================================
   services.js — the outside services the app links to. Links only; this app
   never posts anything to them and never reads anything back from them.

   PROVENANCE OF EVERY LINK IN THIS FILE
   A link is a factual claim about where something lives, so it gets the same
   treatment as a clinical number: it is either sourced or it does not ship.
   An earlier version of this file carried an invented MyUbat web address that
   nobody had supplied. It is gone.

     IQMS.url     supplied by HTPN (Dr Naim).
     MYUBAT.url   supplied by HTPN (Dr Naim) — the Google Play listing.
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
  points: [
    { en: 'For repeat supplies of a medicine you already take, where the doctor has left refills on your prescription.',
      ms: 'Untuk bekalan ulangan ubat yang anda sudah ambil, apabila doktor meninggalkan ulangan pada preskripsi anda.' },
    { en: 'You collect nothing and queue for nothing. It arrives at the address you give.',
      ms: 'Anda tidak perlu mengambil atau beratur. Ia sampai ke alamat yang anda berikan.' },
    { en: 'Keep taking your current supply until the new one arrives. Do not stop and wait.',
      ms: 'Teruskan mengambil bekalan semasa anda sehingga yang baharu tiba. Jangan berhenti dan menunggu.' }
  ],
  /* The exclusion is the clinically important half of this tab, so it is held
     as its own list rather than buried in the points above. */
  notFor: [
    { en: 'Anything that must stay cold. Insulin, some eye drops, some injections and all vaccines go by cold chain and are collected in person.',
      ms: 'Apa-apa yang mesti kekal sejuk. Insulin, sesetengah titisan mata, sesetengah suntikan dan semua vaksin menggunakan rantaian sejuk dan diambil sendiri.' },
    { en: 'Controlled medicines such as strong painkillers, which must be handed over in person.',
      ms: 'Ubat terkawal seperti ubat tahan sakit kuat, yang mesti diserahkan sendiri.' },
    { en: 'A medicine you have never taken before, or one whose dose has just been changed. The pharmacist needs to counsel you for those.',
      ms: 'Ubat yang anda tidak pernah ambil sebelum ini, atau yang dosnya baru ditukar. Ahli farmasi perlu memberi kaunseling untuk itu.' },
    { en: 'Anything you have run out of today. Delivery takes days — go to the pharmacy counter instead.',
      ms: 'Apa-apa yang anda kehabisan hari ini. Penghantaran mengambil masa berhari-hari — pergi ke kaunter farmasi sebaliknya.' }
  ],
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
