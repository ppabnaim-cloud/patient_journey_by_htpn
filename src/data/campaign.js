/* ===========================================================================
   campaign.js — #gayahidupsihatHTPN

   WHAT THIS TAB DOES NOT DO, AND WHY
   It does not host, upload, store, display or moderate anything a patient
   posts. Three reasons, in order of weight:

   1. The app's central promise is that what a patient enters stays on their
      device. A feature that publishes patient content to other patients makes
      that sentence false, and rule 5 of this project says the copy and the
      behaviour can never disagree.
   2. Patient-submitted content on a Ministry-branded surface makes HTPN the
      publisher of it: moderation policy, takedown process, a named content
      owner. A photograph with a child, a ward in the background, or a claim
      like "I stopped my insulin and walk instead" becomes HTPN's to answer
      for. That is a governance programme, not a feature.
   3. A hospital-branded leaderboard of step counts tells every patient to walk
      further, including the ones for whom that is unsafe. This app cannot know
      which is which.

   So the tab sends the patient OUTWARD. It opens the hashtag on the platform
   they already use, and offers their own device's share sheet so they post
   under their own name, on their own account. HTPN holds nothing.

   The walking log is the opposite: entirely on-device, like the rest of the
   record, and never shared by this app.

   LINK PROVENANCE
   The hashtag URLs below are each platform's standard public hashtag address.
   They were NOT supplied by HTPN. They are low-risk — a stale one opens a
   public website's search page rather than the wrong hospital department — but
   they should still be clicked through once before launch, and Strava is
   deliberately absent because it has no public hashtag page to link to.
   ========================================================================= */

export const HASHTAG = 'gayahidupsihatHTPN'

export const CAMPAIGN = {
  title: { en: '#gayahidupsihatHTPN', ms: '#gayahidupsihatHTPN' },
  lead: {
    en: 'Walked today? Post it under the hashtag and someone who has not started yet will see that a patient like them did.',
    ms: 'Sudah berjalan hari ini? Kongsikan di bawah hashtag ini, dan seseorang yang belum bermula akan melihat bahawa seorang pesakit seperti mereka telah melakukannya.'
  },
  how: [
    { en: 'Record your walk here first, so you keep your own count. It stays on this device.',
      ms: 'Rekodkan jalan kaki anda di sini dahulu, supaya anda menyimpan kiraan sendiri. Ia kekal pada peranti ini.' },
    { en: 'Then post on your own account — a photograph, your step count, or a screenshot from whichever app you use.',
      ms: 'Kemudian kongsikan di akaun anda sendiri — gambar, kiraan langkah, atau tangkapan skrin daripada aplikasi yang anda gunakan.' },
    { en: 'Add the hashtag so others at HTPN can find it. Nothing you post passes through this app.',
      ms: 'Tambah hashtag supaya orang lain di HTPN dapat menemuinya. Tiada apa-apa yang anda kongsikan melalui aplikasi ini.' }
  ],

  /* What the share sheet pre-fills. The patient edits it before posting; it is
     a starting point, not a script, and it carries no figures of theirs. */
  shareText: {
    en: 'Walked today. One step at a time. #gayahidupsihatHTPN',
    ms: 'Berjalan kaki hari ini. Selangkah demi selangkah. #gayahidupsihatHTPN'
  },

  platforms: [
    { id: 'instagram', name: 'Instagram', url: `https://www.instagram.com/explore/tags/${HASHTAG.toLowerCase()}/` },
    { id: 'tiktok', name: 'TikTok', url: `https://www.tiktok.com/tag/${HASHTAG.toLowerCase()}` },
    { id: 'facebook', name: 'Facebook', url: `https://www.facebook.com/hashtag/${HASHTAG.toLowerCase()}` },
    { id: 'threads', name: 'Threads', url: `https://www.threads.net/search?q=%23${HASHTAG}` },
    { id: 'x', name: 'X', url: `https://x.com/hashtag/${HASHTAG}` }
  ],

  /* Apps some patients already use to count what they walk. Both links were
     supplied by HTPN and are Google Play listings.

     Deliberately named without describing what they do beyond counting
     activity: this build could not open either listing, and a government
     hospital describing a commercial app's features wrongly is worse than
     describing them not at all. The caveat below matters more than the
     description anyway — these are other companies' apps, and a hospital
     pointing patients at them should say so plainly rather than let the
     placement imply endorsement. */
  trackers: {
    title: { en: 'Apps that count it for you', ms: 'Aplikasi yang mengira untuknya' },
    lead: {
      en: 'Some patients already use one of these. Neither is needed — the log above works on its own — but if a counter keeps you going, use it and type the total in here.',
      ms: 'Sesetengah pesakit sudah menggunakan salah satu daripadanya. Kedua-duanya tidak diperlukan — log di atas berfungsi dengan sendirinya — tetapi jika pengira membantu anda meneruskan, gunakannya dan taip jumlahnya di sini.'
    },
    apps: [
      { id: 'strava', name: 'Strava',
        url: 'https://play.google.com/store/apps/details?id=com.strava&hl=en' },
      { id: 'bookdoc', name: 'BookDoc',
        url: 'https://play.google.com/store/apps/details?id=com.bookdoc.bookdoc&hl=en' }
    ],
    caveat: {
      en: 'These are other companies\u2019 apps, not HTPN\u2019s. What they collect about you, and where it goes, is governed by their own privacy policies and not by this one — an activity app usually records where you walked. Both links are the Android versions.',
      ms: 'Ini aplikasi syarikat lain, bukan milik HTPN. Apa yang dikumpul mengenai anda, dan ke mana ia pergi, tertakluk kepada dasar privasi mereka sendiri dan bukan dasar aplikasi ini — aplikasi aktiviti kebiasaannya merekod lokasi anda berjalan. Kedua-dua pautan ialah versi Android.'
    }
  },

  /* Strava has no public hashtag page, so it gets a sentence rather than a
     broken link. */
  stravaNote: {
    en: 'Using Strava or a step counter? Screenshot it and post that — there is no public hashtag page on Strava to link to.',
    ms: 'Menggunakan Strava atau pengira langkah? Tangkap skrinnya dan kongsikan — tiada halaman hashtag awam di Strava untuk dipautkan.'
  },

  /* The safety line. It errs toward asking, never toward reassuring, because
     this app does not know the person reading it. */
  safety: {
    en: 'Before you walk further or faster than usual: if you have a heart or lung condition, a wound on your foot, eye disease, or you have had surgery recently, ask your doctor what is safe for you first. This app does not know your situation and is not telling you it is safe.',
    ms: 'Sebelum anda berjalan lebih jauh atau lebih laju daripada kebiasaan: sekiranya anda mempunyai penyakit jantung atau paru-paru, luka pada kaki, penyakit mata, atau baru menjalani pembedahan, sila tanya doktor anda dahulu tentang apa yang selamat untuk anda. Aplikasi ini tidak mengetahui keadaan anda dan tidak menyatakan bahawa ia selamat.'
  },

  privacyNote: {
    en: 'This app uploads nothing and reads nothing back. Opening a platform below leaves the app; what you post there is between you and that platform.',
    ms: 'Aplikasi ini tidak memuat naik apa-apa dan tidak membaca apa-apa kembali. Membuka mana-mana platform di bawah akan meninggalkan aplikasi ini; apa yang anda kongsikan di sana adalah antara anda dan platform tersebut.'
  },

  /* Asked directly: can everyone see what other people share? The honest
     answer has two halves, and both belong on the screen rather than in a
     README, because a patient deciding whether to post is deciding it here. */
  whoCanSee: {
    title: { en: 'Who can see what you post?', ms: 'Siapa boleh melihat hantaran anda?' },
    points: [
      { en: 'Not this app, and not HTPN through this app. There is no feed here and no store of anyone\u2019s posts — nothing you or anyone else shares is kept by this app or sent to the hospital.',
        ms: 'Bukan aplikasi ini, dan bukan HTPN melalui aplikasi ini. Tiada suapan di sini dan tiada simpanan hantaran sesiapa — tiada apa yang anda atau orang lain kongsikan disimpan oleh aplikasi ini atau dihantar kepada hospital.' },
      { en: 'Whether anyone can see your post is decided by your own account settings on that platform, not by the hashtag. A hashtag on a private account is still private; on a public account it is public to anyone, not only to patients.',
        ms: 'Sama ada sesiapa boleh melihat hantaran anda ditentukan oleh tetapan akaun anda sendiri pada platform tersebut, bukan oleh hashtag. Hashtag pada akaun persendirian tetap persendirian; pada akaun awam ia terbuka kepada sesiapa sahaja, bukan kepada pesakit sahaja.' },
      { en: 'The buttons below open that platform\u2019s own hashtag page, so what you see there is whatever that platform chooses to show you.',
        ms: 'Butang di bawah membuka halaman hashtag platform tersebut, maka apa yang anda lihat di sana adalah apa yang platform itu pilih untuk paparkan.' }
    ],
    beforeYouPost: {
      en: 'Before you post: a photograph can carry more than you meant — a face, a child, a ward, a name on a wristband, a prescription on a table.',
      ms: 'Sebelum anda berkongsi: sesebuah gambar boleh membawa lebih daripada yang anda maksudkan — wajah, kanak-kanak, wad, nama pada gelang tangan, atau preskripsi di atas meja.'
    }
  }
}
