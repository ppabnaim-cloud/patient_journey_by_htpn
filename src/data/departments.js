/* ===========================================================================
   departments.js — the clinics a patient can have an appointment at

   SOURCE
   Supplied by HTPN. Nothing in this list was looked up, inferred or filled in
   from another hospital's directory: a clinic that is not on this list does
   not appear in the app, and the patient types a free-text note instead.

   TWO ENTRIES ARE TRANSCRIBED AS GIVEN AND QUERIED, NOT CORRECTED
   `queried: true` marks a name that reads as though a word may have been
   lost in the list that was handed over. They are rendered exactly as HTPN
   wrote them, because a department's own name is HTPN's to state and not this
   build's to improve, and they are flagged here so somebody answers rather
   than the app quietly inventing an answer:

     - Psychiatry → "acute & emergency medicine". Reads like acute and
       emergency PSYCHIATRY; acute and emergency medicine is its own
       discipline and already has a department.
     - Rehabilitation → "unit physiology". Reads like PHYSIOTHERAPY
       (fisioterapi). Physiology is a basic science, not a clinic a patient
       is given an appointment at.

   Each has one meaning that sends a patient to the right door and one that
   does not, so neither is a spelling to tidy up silently.

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
    clinics: [
      { id: 'psy_general', en: 'General', ms: 'Am' },
      { id: 'psy_geri', en: 'Psychogeriatric', ms: 'Psikogeriatrik' },
      { id: 'psy_addiction', en: 'Addiction', ms: 'Ketagihan' },
      { id: 'psy_acute', en: 'Acute & Emergency Medicine', ms: 'Perubatan Akut & Kecemasan', queried: true },
      { id: 'psy_cap', en: 'Child & Adolescent Psychiatry', ms: 'Psikiatri Kanak-kanak & Remaja' }
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
      { id: 'rehab_clinic', en: 'Rehabilitation Clinic', ms: 'Klinik Rehabilitasi' },
      { id: 'rehab_ot', en: 'Occupational Therapy Unit', ms: 'Unit Terapi Carakerja' },
      { id: 'rehab_physio', en: 'Physiology Unit', ms: 'Unit Physiology', queried: true },
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
