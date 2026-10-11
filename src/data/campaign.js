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
  }
}
