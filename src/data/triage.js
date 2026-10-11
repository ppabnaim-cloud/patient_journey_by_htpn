/* ===========================================================================
   triage.js — "Emergency, or not?"

   Content and both lists are taken from the HTPN patient-guidance poster
   (Tahukah Anda… Jabatan Kecemasan hanyalah untuk kes-kes kecemasan), which
   cites: Redirection Policy July 2024, JKN Selangor / Public Health Malaysia.

   That citation is why this screen is allowed to exist. Telling a patient
   which complaints are and are not emergencies is a clinical statement, and
   under rule 1 of this project it ships only because a named policy stands
   behind it. The source is rendered on screen with the lists, not hidden in a
   comment here.

   The lists are reproduced as published. Do not add a complaint to either
   column because it seems to belong — that would be this app making a triage
   decision of its own, which it must never do.
   ========================================================================= */

export const TRIAGE_SOURCE = {
  short: { en: 'JKN Selangor, July 2024', ms: 'JKN Selangor, Julai 2024' },
  full: {
    en: 'Redirection Policy, July 2024. Jabatan Kesihatan Negeri Selangor / Public Health Malaysia, as reproduced on the HTPN patient-guidance poster.',
    ms: 'Dasar Pengalihan (Redirection Policy), Julai 2024. Jabatan Kesihatan Negeri Selangor / Public Health Malaysia, sebagaimana dipaparkan pada poster panduan pesakit HTPN.'
  }
}

export const TRIAGE = {
  title: {
    en: 'Emergency, or not?',
    ms: 'Kecemasan, atau tidak?'
  },
  lead: {
    en: 'The Emergency Department is for emergencies. Bringing a non-emergency there means a longer wait for you, and a longer wait for someone whose life depends on it.',
    ms: 'Jabatan Kecemasan adalah untuk kes kecemasan sahaja. Membawa kes bukan kecemasan ke sana bermakna penantian yang lebih lama untuk anda, dan penantian yang lebih lama untuk seseorang yang nyawanya bergantung padanya.'
  },

  notEmergency: {
    heading: { en: 'Not an emergency', ms: 'Kes bukan kecemasan' },
    where: {
      en: 'Please seek treatment at your nearest Klinik Kesihatan.',
      ms: 'Sila dapatkan rawatan di Klinik Kesihatan berdekatan.'
    },
    items: [
      { en: 'Ordinary fever', ms: 'Demam biasa' },
      { en: 'Cough or cold', ms: 'Batuk atau selsema' },
      { en: 'Red eye, where no chemical is involved', ms: 'Mata merah, tidak berkaitan bahan kimia' },
      { en: 'Ordinary vomiting or diarrhoea', ms: 'Muntah atau cirit-birit biasa' },
      { en: 'Skin rash', ms: 'Ruam kulit' },
      { en: 'Minor wound or bruise', ms: 'Luka ringan atau lebam' },
      { en: 'Routine wound dressing, or removal of stitches', ms: 'Rawatan luka harian atau membuka jahitan luka' },
      { en: 'Changing a urinary catheter or a nasogastric tube', ms: 'Penukaran tiub kencing atau tiub makanan (nasogastrik)' },
      { en: 'A medical examination or health screening', ms: 'Pemeriksaan perubatan atau saringan kesihatan' },
      { en: 'Continuing existing treatment or medication', ms: 'Sambungan rawatan atau ubat sedia ada' },
      { en: 'Extending a medical certificate', ms: 'Sambungan cuti sakit' }
    ]
  },

  emergency: {
    heading: { en: 'An emergency', ms: 'Kes kecemasan' },
    where: {
      en: 'Please seek treatment at the Emergency Department immediately.',
      ms: 'Sila dapatkan rawatan di Jabatan Kecemasan dengan segera.'
    },
    items: [
      { en: 'Chest pain, or a suspected heart attack', ms: 'Sakit dada atau serangan jantung' },
      { en: 'Stroke', ms: 'Strok' },
      { en: 'Difficulty breathing', ms: 'Sesak nafas' },
      { en: 'A broken bone', ms: 'Patah tulang' },
      { en: 'Serious bleeding', ms: 'Pendarahan serius' },
      { en: 'Burns', ms: 'Luka terbakar' },
      { en: 'A fit or seizure', ms: 'Sawan' },
      { en: 'Trauma or a road accident', ms: 'Trauma atau kemalangan' },
      { en: 'Poisoning', ms: 'Keracunan' },
      { en: 'Fainting without regaining consciousness', ms: 'Pengsan tanpa sedar kembali' },
      { en: 'Chemical exposure', ms: 'Serangan bahan kimia' },
      { en: 'Snake bite or a venomous sting', ms: 'Gigitan ular atau sengatan berbisa' }
    ]
  },

  /* Shown under both columns. A list cannot cover every presentation, and a
     patient who reads one and talks themselves out of going is the harm this
     screen could do. */
  caveat: {
    en: 'These lists cannot cover everything. If you are frightened by what is happening, or it is getting worse quickly, go to the Emergency Department. Nobody will fault you for coming.',
    ms: 'Senarai ini tidak dapat merangkumi setiap keadaan. Sekiranya anda berasa bimbang dengan keadaan yang dialami, atau keadaan bertambah teruk dengan cepat, sila ke Jabatan Kecemasan. Anda tidak akan dipersalahkan kerana datang.'
  }
}
