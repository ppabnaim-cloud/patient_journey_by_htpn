/* ===========================================================================
   departments.js — the clinics a patient can have an appointment at

   SOURCE
   Supplied by HTPN. Nothing in this list was looked up, inferred or filled in
   from another hospital's directory: a clinic that is not on this list does
   not appear in the app, and the patient types a free-text note instead.

   TWO NAMES WERE QUERIED RATHER THAN CORRECTED. BOTH ARE NOW ANSWERED.
   Each had one reading that sends a patient to the right door and one that
   does not, so neither was a spelling to tidy up silently:

     - Psychiatry → "acute & emergency medicine" read like acute and
       emergency PSYCHIATRY, while acute and emergency medicine is its own
       discipline with its own department. HTPN's answer: no sub-clinics at
       all, one "Psychiatry Clinic".
     - Rehabilitation → "unit physiology" read like PHYSIOTHERAPY. HTPN
       confirmed physiotherapy, and named four units in all.

   The `queried` field remains supported for the next name nobody is sure
   of; nothing carries it today.

   NUMBERING
   None. These are chosen from a list, not walked to, so a number here would
   collide in the patient's head with the numbered map points on the
   way-finding screen, which mean a different thing entirely.
   ========================================================================= */

export const DEPARTMENTS = [
  {
    id: 'phlebotomy',
    icon: 'clinic',
    en: 'Phlebotomy Room — blood taking',
    ms: 'Bilik Flebotomi — pengambilan darah',
    clinics: []
  },
  {
    id: 'medical',
    icon: 'clinic',
    en: 'Department of Medicine',
    ms: 'Jabatan Perubatan',
    clinics: [
      { id: 'med_general', en: 'General', ms: 'Am' },
      { id: 'med_nephro', en: 'Nephrology Unit', ms: 'Unit Nefrologi' },
      { id: 'med_endo', en: 'Endocrinology', ms: 'Endokrin' },
      { id: 'med_acute', en: 'Acute Medicine', ms: 'Perubatan Akut' },
      { id: 'med_id', en: 'Infectious Disease', ms: 'Penyakit Berjangkit' }
    ]
  },
  {
    id: 'surgery',
    icon: 'clinic',
    en: 'Department of Surgery',
    ms: 'Jabatan Pembedahan',
    clinics: [
      { id: 'surg_general', en: 'General', ms: 'Am' },
      { id: 'surg_paeds', en: 'Paediatric Surgery', ms: 'Pembedahan Kanak-kanak' }
    ]
  },
  {
    id: 'psychiatry',
    icon: 'clinic',
    en: 'Department of Psychiatry & Mental Health',
    ms: 'Jabatan Psikiatri dan Kesihatan Mental',
    /* HTPN asked for psychiatry to stay general rather than break into
       sub-clinics, which also settles the queried "acute & emergency
       medicine" entry: it is gone rather than guessed at. */
    clinics: [
      { id: 'psy_clinic', en: 'Psychiatry Clinic', ms: 'Klinik Psikiatri' }
    ]
  },
  {
    id: 'anaesthesiology',
    icon: 'clinic',
    en: 'Department of Anaesthesiology',
    ms: 'Jabatan Anestesiologi',
    clinics: [
      { id: 'anaes_preop', en: 'Pre-operative Assessment Clinic', ms: 'Klinik Penilaian Pra-pembedahan' },
      { id: 'anaes_obs', en: 'Obstetric Anaesthesiology', ms: 'Anestesiologi Obstetrik' }
    ]
  },
  {
    id: 'orthopaedics',
    icon: 'clinic',
    en: 'Department of Orthopaedics',
    ms: 'Jabatan Ortopedik',
    clinics: [
      { id: 'ortho_general', en: 'General', ms: 'Am' },
      { id: 'ortho_paeds', en: 'Paediatric Orthopaedics', ms: 'Ortopedik Kanak-kanak' }
    ]
  },
  {
    id: 'paediatrics',
    icon: 'clinic',
    en: 'Department of Paediatrics',
    ms: 'Jabatan Pediatrik',
    clinics: [
      { id: 'paeds_general', en: 'General', ms: 'Am' }
    ]
  },
  {
    id: 'og',
    icon: 'clinic',
    en: 'Department of Obstetrics & Gynaecology',
    ms: 'Jabatan Obstetrik & Ginekologi',
    clinics: [
      { id: 'og_obs', en: 'Obstetric Clinic', ms: 'Klinik Obstetrik' },
      { id: 'og_gynae', en: 'Gynaecology Clinic', ms: 'Klinik Ginekologi' }
    ]
  },
  {
    id: 'paed_dental',
    icon: 'dental',
    en: 'Department of Paediatric Dentistry',
    ms: 'Jabatan Pergigian Pediatrik',
    clinics: []
  },
  {
    id: 'omfs',
    icon: 'dental',
    en: 'Department of Oral & Maxillofacial Surgery',
    ms: 'Jabatan OMFS',
    clinics: []
  },
  {
    id: 'special_dental',
    icon: 'dental',
    en: 'Department of Special Needs Dentistry',
    ms: 'Jabatan Pergigian Keperluan Khas',
    clinics: []
  },
  {
    id: 'radiology',
    icon: 'radiology',
    en: 'Department of Radiology',
    ms: 'Jabatan Radiologi',
    clinics: [
      { id: 'rad_us', en: 'Ultrasound', ms: 'Ultrasound' },
      { id: 'rad_ct', en: 'CT scan', ms: 'Imbasan CT' },
      { id: 'rad_xray', en: 'X-ray', ms: 'X-ray' }
    ]
  },
  {
    id: 'rehab',
    icon: 'rehab',
    en: 'Department of Rehabilitation',
    ms: 'Jabatan Rehabilitasi',
    clinics: [
      { id: 'rehab_general', en: 'General Rehabilitation', ms: 'Rehabilitasi Am' },
      { id: 'rehab_physio', en: 'Physiotherapy', ms: 'Fisioterapi' },
      { id: 'rehab_ot', en: 'Occupational Therapy', ms: 'Terapi Carakerja' },
      { id: 'rehab_speech', en: 'Speech Therapy', ms: 'Terapi Pertuturan' }
    ]
  }
]

/* Flattened once, so a saved appointment can be read back by id without
   walking the tree every render. */
export const CLINIC_INDEX = (() => {
  const out = new Map()
  for (const d of DEPARTMENTS) {
    out.set(d.id, { dept: d, clinic: null })
    for (const c of d.clinics) out.set(c.id, { dept: d, clinic: c })
  }
  return out
})()

export const QUERIED_CLINICS = DEPARTMENTS
  .flatMap(d => d.clinics.filter(c => c.queried).map(c => ({ dept: d, clinic: c })))
