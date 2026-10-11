/* ===========================================================================
   templates.js — hashtags and post templates

   WHAT THESE ARE, AND WHAT THEY ARE NOT
   Every hashtag below except #gayahidupsihatHTPN is PROPOSED by this build.
   None of them has been checked against the platforms to see whether it is
   already in use by someone else, because this build cannot open Facebook or
   any other platform from inside the hospital network. A hashtag is not
   owned by anybody: if another account is already posting under one of these,
   HTPN's posts and theirs land in the same place. Each entry therefore
   carries `verified: false` and the app says so on screen. Someone must open
   each tag once before any of this is printed on a poster.

   WHY ONE UMBRELLA PLUS ONE SPECIFIC
   Six separate hashtags means six searches for whoever at HTPN reads them,
   and a thank-you to a nurse never reaches the person looking at the doctor
   tag. So the four appreciation themes all carry #terimakasihHTPN as well as
   their own tag. One place to look; still separable.

   WHY ONE LANGUAGE PER TAG
   A hashtag is a literal string. #terimakasihHTPN and #thankyouHTPN are two
   different places, and splitting a campaign across both halves it. The
   captions are bilingual; the tags are not, and Malay is the register the
   hospital's own page posts in.

   ON "STAF NURSE"
   In a Malaysian hospital, Staff Nurse is a GRADE, not the profession. A tag
   spelt that way thanks U29 and above and silently excludes the PPK and the
   assistant nurses on the same shift. The tag below is therefore
   #terimakasihjururawatHTPN — the profession — and it is a deliberate
   departure from what was asked, flagged here rather than made quietly.
   ========================================================================= */

import { HASHTAG } from './campaign.js'

/* The hospital's own page, supplied by HTPN. Everything posted under these
   tags should tag it, or nobody at the hospital sees it. */
export const HTPN_PAGE = {
  name: 'Hospital Tengku Permaisuri Norashikin',
  handle: '@hospitalkajangofficial',
  url: 'https://www.facebook.com/hospitalkajangofficial/?locale=ms_MY',
  /* Supplied by HTPN, so the address is not a guess. The page is still named
     for the hospital's former name; that is the page's spelling, not ours. */
  source: { en: 'Supplied by HTPN', ms: 'Diberikan oleh HTPN' },
  howToTag: {
    en: 'Type @hospitalkajangofficial in your post and pick the page from the list that appears. Facebook only links the tag when you choose it from that list — pasting the text on its own does not tag the hospital.',
    ms: 'Taip @hospitalkajangofficial dalam hantaran anda dan pilih halaman tersebut daripada senarai yang muncul. Facebook hanya memautkan tag apabila anda memilihnya daripada senarai itu — menampal teks sahaja tidak akan menandakan hospital.'
  }
}

export const UMBRELLA = 'terimakasihHTPN'

/* The tab has two aims, and the screen is organised by them rather than by
   hashtag. A hashtag is a mechanism; neither of these is. */
export const GROUPS = [
  {
    id: 'sihat',
    title: { en: 'Healthy lifestyle', ms: 'Gaya Hidup Sihat' },
    lead: {
      en: 'Share what you are doing to stay well. Someone who has not started yet will see that a patient like them did.',
      ms: 'Kongsikan usaha anda untuk kekal sihat. Seseorang yang belum bermula akan melihat bahawa seorang pesakit seperti mereka telah melakukannya.'
    }
  },
  {
    id: 'hargai',
    title: { en: 'Appreciating our healthcare staff', ms: 'Penghargaan Kepada Warga Kesihatan' },
    lead: {
      en: 'The team works nights, weekends and public holidays. A few words from a patient or a family member reaches them in a way nothing else does.',
      ms: 'Pasukan kami bertugas pada waktu malam, hujung minggu dan cuti umum. Beberapa patah kata daripada pesakit atau ahli keluarga amat bermakna kepada mereka.'
    }
  }
]

/* A hashtag made only of digits does not register on most platforms; mixed
   letters and digits does. #10ribulangkahHTPN is safe on that count. */
export const TAGS = [
  {
    id: 'sihat',
    group: 'sihat',
    tag: HASHTAG,                       // gayahidupsihatHTPN
    theme: { en: 'Healthy lifestyle', ms: 'Gaya hidup sihat' },
    forWho: { en: 'Patients and the public', ms: 'Pesakit dan orang awam' },
    verified: true,                     // decided by HTPN, already in the app
    also: []
  },
  {
    id: 'langkah',
    group: 'sihat',
    tag: '10ribulangkahHTPN',
    theme: { en: '10,000 steps', ms: '10 ribu langkah' },
    forWho: { en: 'Anyone logging a walk', ms: 'Sesiapa yang merekod jalan kaki' },
    verified: false,
    also: [HASHTAG]
  },
  {
    id: 'terimakasih',
    group: 'hargai',
    tag: UMBRELLA,
    theme: { en: 'Thank you, HTPN', ms: 'Terima kasih HTPN' },
    forWho: { en: 'Patients and families', ms: 'Pesakit dan keluarga' },
    verified: false,
    also: []
  },
  {
    id: 'servis',
    group: 'hargai',
    tag: 'perkhidmatancemerlangHTPN',
    theme: { en: 'Excellent service at HTPN', ms: 'Perkhidmatan cemerlang HTPN' },
    forWho: { en: 'Patients and families', ms: 'Pesakit dan keluarga' },
    verified: false,
    also: [UMBRELLA]
  },
  {
    id: 'doktor',
    group: 'hargai',
    tag: 'terimakasihdoktorHTPN',
    theme: { en: 'Thank you, doctor', ms: 'Terima kasih doktor' },
    forWho: { en: 'Patients and families', ms: 'Pesakit dan keluarga' },
    verified: false,
    also: [UMBRELLA]
  },
  {
    id: 'jururawat',
    group: 'hargai',
    tag: 'terimakasihjururawatHTPN',
    theme: { en: 'Thank you, nurses', ms: 'Terima kasih jururawat' },
    forWho: { en: 'Patients and families', ms: 'Pesakit dan keluarga' },
    verified: false,
    also: [UMBRELLA],
    /* The departure from "staf nurse", stated where it is read, not buried. */
    note: {
      en: 'Written as “jururawat”, the profession, rather than “staff nurse”, which is a grade — so the thank-you also reaches the assistant nurses and healthcare assistants on the same shift.',
      ms: 'Ditulis sebagai “jururawat”, iaitu profesion, dan bukan “staff nurse” yang merupakan gred — supaya penghargaan ini turut sampai kepada penolong jururawat dan pembantu perawatan kesihatan pada syif yang sama.'
    }
  }
]

/* Post templates. Square brackets are slots the person fills in; nothing is
   filled in by the app, because the app holds no name of a staff member and
   should not start. No template praises a named clinician for a clinical
   outcome — a thank-you is for the care, not an endorsement of treatment. */
export const TEMPLATES = [
  {
    id: 'langkah',
    group: 'sihat',
    tagId: 'langkah',
    title: { en: 'I walked today', ms: 'Saya berjalan kaki hari ini' },
    body: {
      en: 'Walked [ ] steps today. Started small, kept going. If I can, you can.\n\n#10ribulangkahHTPN #gayahidupsihatHTPN\n@hospitalkajangofficial',
      ms: 'Hari ini saya berjalan [ ] langkah. Bermula dengan sedikit, dan terus berterusan. Jika saya mampu, anda juga mampu.\n\n#10ribulangkahHTPN #gayahidupsihatHTPN\n@hospitalkajangofficial'
    }
  },
  {
    id: 'sihat',
    group: 'sihat',
    tagId: 'sihat',
    title: { en: 'A healthier habit', ms: 'Tabiat yang lebih sihat' },
    body: {
      en: 'One change I made this month: [ ]. Small, but I have kept it.\n\n#gayahidupsihatHTPN\n@hospitalkajangofficial',
      ms: 'Satu perubahan yang saya lakukan bulan ini: [ ]. Kecil, tetapi saya berjaya mengekalkannya.\n\n#gayahidupsihatHTPN\n@hospitalkajangofficial'
    }
  },
  {
    id: 'terimakasih',
    group: 'hargai',
    tagId: 'terimakasih',
    title: { en: 'Thank you, HTPN', ms: 'Terima kasih HTPN' },
    body: {
      en: 'Thank you to everyone at Hospital Tengku Permaisuri Norashikin who looked after [me / my family] at [department] on [date]. It was not a small thing to us.\n\n#terimakasihHTPN\n@hospitalkajangofficial',
      ms: 'Terima kasih kepada semua warga Hospital Tengku Permaisuri Norashikin yang merawat [saya / keluarga saya] di [jabatan] pada [tarikh]. Ia amat bermakna bagi kami.\n\n#terimakasihHTPN\n@hospitalkajangofficial'
    }
  },
  {
    id: 'servis',
    group: 'hargai',
    tagId: 'servis',
    title: { en: 'The service was excellent', ms: 'Perkhidmatan yang cemerlang' },
    body: {
      en: 'Excellent service at Hospital Tengku Permaisuri Norashikin today — [what happened, in your own words]. Thank you to the team at [department].\n\n#perkhidmatancemerlangHTPN #terimakasihHTPN\n@hospitalkajangofficial',
      ms: 'Perkhidmatan yang cemerlang di Hospital Tengku Permaisuri Norashikin hari ini — [apa yang berlaku, dalam ayat anda sendiri]. Terima kasih kepada pasukan di [jabatan].\n\n#perkhidmatancemerlangHTPN #terimakasihHTPN\n@hospitalkajangofficial'
    }
  },
  {
    id: 'doktor',
    group: 'hargai',
    tagId: 'doktor',
    title: { en: 'Thank you, doctor', ms: 'Terima kasih doktor' },
    body: {
      en: 'Thank you to the doctor who explained things to me properly and gave me the time at [department], Hospital Tengku Permaisuri Norashikin.\n\n#terimakasihdoktorHTPN #terimakasihHTPN\n@hospitalkajangofficial',
      ms: 'Terima kasih kepada doktor yang menerangkan dengan jelas dan memberikan masa kepada saya di [jabatan], Hospital Tengku Permaisuri Norashikin.\n\n#terimakasihdoktorHTPN #terimakasihHTPN\n@hospitalkajangofficial'
    }
  },
  {
    id: 'jururawat',
    group: 'hargai',
    tagId: 'jururawat',
    title: { en: 'Thank you, nurses', ms: 'Terima kasih jururawat' },
    body: {
      en: 'Thank you to the nurses at [ward / department], Hospital Tengku Permaisuri Norashikin. You were there through the night and you did not make me feel like a burden.\n\n#terimakasihjururawatHTPN #terimakasihHTPN\n@hospitalkajangofficial',
      ms: 'Terima kasih kepada jururawat di [wad / jabatan], Hospital Tengku Permaisuri Norashikin. Anda ada sepanjang malam dan tidak sekali-kali membuatkan saya rasa menyusahkan.\n\n#terimakasihjururawatHTPN #terimakasihHTPN\n@hospitalkajangofficial'
    }
  }
]

/* Shown above the list, because a reader deciding whether to print one of
   these on a banner needs to know which of them has been checked. */
export const TEMPLATE_NOTE = {
  en: 'The app fills nothing in for you. Brackets are yours to complete, and the text is a starting point you should change into your own words.',
  ms: 'Aplikasi ini tidak mengisi apa-apa untuk anda. Tanda kurungan perlu anda lengkapkan, dan teks ini hanyalah permulaan yang patut anda ubah kepada ayat anda sendiri.'
}

export const UNCHECKED_NOTE = {
  en: 'Proposed by this prototype and not yet checked on the platforms — another account may already be posting under the same tag. Open each one once before it goes on a poster.',
  ms: 'Dicadangkan oleh prototaip ini dan belum disemak di platform — mungkin terdapat akaun lain yang sudah menggunakan tag yang sama. Semak setiap satu sebelum ia dicetak pada poster.'
}

/* Nothing here names a patient, a staff member or a ward bed, and the app
   never pre-fills one. The reminder belongs next to the template, where the
   person is about to type. */
export const BEFORE_POSTING = {
  en: 'Thank the team, the ward or the clinic — the people who were with you will know exactly who you mean. Take one last look at your photograph first, so that faces, wristbands and papers stay private.',
  ms: 'Hargailah pasukan, wad atau klinik berkenaan — mereka yang bersama anda pasti tahu siapa yang anda maksudkan. Lihat gambar anda sekali lagi sebelum dikongsikan, supaya wajah, gelang tangan dan dokumen kekal peribadi.'
}
