/* ===========================================================================
   governance.js — who controls what, and the exact words shown to the patient.

   RULE 5 of this project: the app never promises something it is not doing.
   ONE flag changes both the collection behaviour and the privacy copy, so the
   two can never drift apart. That flag is COLLECTION_UI_ENABLED below.
   ========================================================================= */

export const APP = {
  id: 'patient-journey-by-htpn',
  version: '0.1.0',
  name: { en: 'Patient Journey by HTPN', ms: 'Perjalanan Pesakit oleh HTPN' },
  facility: {
    en: 'Hospital Tengku Permaisuri Norashikin, Kajang',
    ms: 'Hospital Tengku Permaisuri Norashikin, Kajang'
  },
  brand: {
    en: 'Prototype design by Dr Naim, HTPN',
    ms: 'Reka bentuk prototaip oleh Dr Naim, HTPN'
  }
}

/* ---------------------------------------------------------------------------
   CONTROLLER
   HTPN is a facility of the Ministry of Health Malaysia, so the controller is
   a federal government body.

   PDPA 2010 s.3(1) states that the Act does not apply to the Federal
   Government and State Governments. Writing "stored in accordance with the
   PDPA" for a government controller would therefore be false. What is both
   true and a stronger undertaking is that PDPA standards are applied
   VOLUNTARILY as a minimum floor, on top of the duties that do bind a
   government hospital: MREC/NMRR ethics approval where the activity is
   research, Ministry of Health data directives, and medical confidentiality.

   Change CONTROLLER_KIND to 'private' and every string below switches to the
   full statutory wording, because then the PDPA genuinely does bind.
   ------------------------------------------------------------------------ */
export const CONTROLLER_KIND = 'government'   // 'government' | 'private'

export const CONTROLLER = {
  name: {
    en: 'Hospital Tengku Permaisuri Norashikin (HTPN), Ministry of Health Malaysia, with Dr Naim as the responsible officer.',
    ms: 'Hospital Tengku Permaisuri Norashikin (HTPN), Kementerian Kesihatan Malaysia, dengan Dr Naim sebagai pegawai bertanggungjawab.'
  },
  legalBasis: CONTROLLER_KIND === 'government'
    ? {
        en: 'HTPN is a Ministry of Health facility. The Personal Data Protection Act 2010 does not bind the Federal Government under section 3(1). HTPN nonetheless applies PDPA standards voluntarily as its minimum floor, and is bound in addition by Ministry of Health data directives, medical confidentiality, and MREC/NMRR ethics approval for any research use.',
        ms: 'HTPN ialah fasiliti Kementerian Kesihatan. Akta Perlindungan Data Peribadi 2010 tidak mengikat Kerajaan Persekutuan di bawah seksyen 3(1). Walau bagaimanapun HTPN menerapkan piawaian PDPA secara sukarela sebagai paras minimum, dan turut terikat dengan arahan data Kementerian Kesihatan, kerahsiaan perubatan, serta kelulusan etika MREC/NMRR bagi sebarang kegunaan penyelidikan.'
      }
    : {
        en: 'The controller is not a government body, so the Personal Data Protection Act 2010 applies in full. Health information is sensitive personal data: explicit consent is required, a data protection officer is appointed, and breaches are notifiable.',
        ms: 'Pengawal bukan badan kerajaan, jadi Akta Perlindungan Data Peribadi 2010 terpakai sepenuhnya. Maklumat kesihatan ialah data peribadi sensitif: persetujuan nyata diperlukan, pegawai perlindungan data dilantik, dan pelanggaran mesti dilaporkan.'
      }
}

/* ---------------------------------------------------------------------------
   ETHICS
   No ethics submission describes this build. Both collection flags therefore
   default OFF, and the server flag is the one that authorises a write — so
   "ethics approval pending" is enforceable from the server and cannot be
   bypassed by shipping a client build with the wrong constant in it.
   ------------------------------------------------------------------------ */
export const ETHICS = {
  status: 'prototype_no_submission',
  statement: {
    en: 'This is a prototype. No MREC/NMRR submission describes it yet. Usage counting stays switched off until one does, or until it is formally registered as a service-improvement audit.',
    ms: 'Ini ialah prototaip. Tiada penghantaran MREC/NMRR menerangkannya lagi. Pengiraan penggunaan kekal dimatikan sehingga ada, atau sehingga ia didaftarkan secara rasmi sebagai audit penambahbaikan perkhidmatan.'
  }
}

/* ---------------------------------------------------------------------------
   THE FLAG
   Client flag — controls the UI only. Reads the build-time environment so a
   deployment can enable it without a code change. Defaults OFF.
   The server holds the second, authoritative flag (see api/submit.js). A build
   with this ON still writes nothing unless the server flag is also ON.
   ------------------------------------------------------------------------ */
export const COLLECTION_UI_ENABLED =
  String(import.meta.env?.VITE_COLLECTION_ENABLED ?? '').toLowerCase() === 'true'

/* ---------------------------------------------------------------------------
   PRIVACY COPY
   Driven off the same flag as the behaviour. There is no second place to edit.
   ------------------------------------------------------------------------ */
export const PRIVACY = {
  onDevice: {
    en: 'Everything you type or photograph here — your medicines, your results, your pictures — is saved on this device and nowhere else. It is not uploaded, not backed up, and no one at the hospital can see it. If you clear this browser\'s data or lose the device, it is gone. The app works with no internet connection.',
    ms: 'Semua yang anda taip atau gambarkan di sini — ubat anda, keputusan anda, gambar anda — disimpan pada peranti ini sahaja. Ia tidak dimuat naik, tidak disandarkan, dan tiada sesiapa di hospital boleh melihatnya. Jika anda memadam data pelayar ini atau kehilangan peranti, ia hilang. Aplikasi ini berfungsi tanpa sambungan internet.'
  },
  collectionOff: {
    en: 'Nothing at all leaves this device right now. Usage counting is switched off in this build.',
    ms: 'Tiada apa-apa yang meninggalkan peranti ini sekarang. Pengiraan penggunaan dimatikan dalam binaan ini.'
  },
  collectionOn: {
    en: 'One thing, and only one thing, leaves this device: a count of which parts of the app were opened — way-finding, records, measurements and so on. It carries a random code for this device so repeat visits are not counted twice. It carries no name, no IC, no phone, no age, no medicine, no result and no photograph. The server refuses any record that contains those, rather than removing them.',
    ms: 'Satu perkara sahaja meninggalkan peranti ini: kiraan bahagian aplikasi yang dibuka — pencarian arah, rekod, ukuran dan sebagainya. Ia membawa kod rawak bagi peranti ini supaya lawatan berulang tidak dikira dua kali. Ia tidak membawa nama, tiada KP, tiada telefon, tiada umur, tiada ubat, tiada keputusan dan tiada gambar. Pelayan menolak sebarang rekod yang mengandunginya, bukan membuangnya.'
  },
  declineIsFine: {
    en: 'If you say no, nothing changes. Every part of the app works exactly the same way, and you will not be asked again.',
    ms: 'Jika anda menolak, tiada apa yang berubah. Setiap bahagian aplikasi berfungsi dengan cara yang sama, dan anda tidak akan ditanya lagi.'
  },
  notMedicalAdvice: {
    en: 'This app keeps your notes and shows them back to you. It does not diagnose, it does not treat, and it does not replace your doctor. In an emergency go to the Emergency Department or call 999.',
    ms: 'Aplikasi ini menyimpan catatan anda dan memaparkannya semula. Ia tidak mendiagnosis, tidak merawat, dan tidak menggantikan doktor anda. Dalam kecemasan, pergi ke Jabatan Kecemasan atau hubungi 999.'
  }
}

/* The single sentence the privacy screen shows about collection. One source of
   truth, so the copy cannot disagree with the behaviour. */
export function collectionStatement (enabled) {
  return enabled ? PRIVACY.collectionOn : PRIVACY.collectionOff
}
