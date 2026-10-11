/* ===========================================================================
   sources.js — every clinical number used anywhere in this app lives here.
   ---------------------------------------------------------------------------
   RULE 1 of this project: a clinical statement is either ANCHORED to a named
   source (exact guideline, edition, year, section) or it is FLAGGED as having
   no guideline behind it. There is no third state, and nothing is guessed.

   `verified` means: the author of this file has read the cited document and
   confirmed the number against it.
       verified: true   -> number read from the cited source.
       verified: false  -> number is NOT asserted from that source. Either it
                           comes from the fallback source named in `anchoredTo`,
                           or the app refuses to interpret at all. The UI MUST
                           render `unverifiedNote` wherever it is used.

   Why anything is unverified: this build ran in a sandbox with no route to
   moh.gov.my, so the Malaysian CPGs could not be opened and read. They are
   therefore named as the local authority to confirm, and NOT quoted. The
   numbers actually used are the WHO / IDF ones, which are quoted directly.

   Do not "tidy" an unverified entry by deleting the flag. Verify it, change
   verified to true, and record who verified it and when.
   ========================================================================= */

export const SRC = {
  WHO_ASIA_PACIFIC_2000: {
    id: 'WHO_ASIA_PACIFIC_2000',
    short: { en: 'WHO/IASO/IOTF 2000', ms: 'WHO/IASO/IOTF 2000' },
    full: {
      en: 'WHO/IASO/IOTF. The Asia-Pacific Perspective: Redefining Obesity and its Treatment. Health Communications Australia, 2000 — proposed classification of weight by BMI in adult Asians.',
      ms: 'WHO/IASO/IOTF. The Asia-Pacific Perspective: Redefining Obesity and its Treatment. Health Communications Australia, 2000 — cadangan klasifikasi berat mengikut BMI bagi orang dewasa Asia.'
    },
    kind: 'international'
  },
  WHO_EXPERT_2004: {
    id: 'WHO_EXPERT_2004',
    short: { en: 'WHO Expert Consultation 2004', ms: 'Perundingan Pakar WHO 2004' },
    full: {
      en: 'WHO Expert Consultation. Appropriate body-mass index for Asian populations and its implications for policy and intervention strategies. Lancet 2004;363(9403):157-163 — public health action points at BMI 23.0 and 27.5.',
      ms: 'WHO Expert Consultation. Appropriate body-mass index for Asian populations. Lancet 2004;363(9403):157-163 — titik tindakan kesihatan awam pada BMI 23.0 dan 27.5.'
    },
    kind: 'international'
  },
  IDF_METS_2006: {
    id: 'IDF_METS_2006',
    short: { en: 'IDF 2006', ms: 'IDF 2006' },
    full: {
      en: 'International Diabetes Federation. The IDF consensus worldwide definition of the metabolic syndrome, 2006 — ethnicity-specific waist circumference, South Asian and Chinese values (IDF directs that South Asian values be used for other South and South-East Asian populations).',
      ms: 'International Diabetes Federation. The IDF consensus worldwide definition of the metabolic syndrome, 2006 — lilit pinggang mengikut etnik, nilai Asia Selatan dan Cina (IDF mengarahkan nilai Asia Selatan digunakan bagi populasi Asia Tenggara yang lain).'
    },
    kind: 'international'
  },
  WHO_IDF_2006_GLUCOSE: {
    id: 'WHO_IDF_2006_GLUCOSE',
    short: { en: 'WHO/IDF 2006', ms: 'WHO/IDF 2006' },
    full: {
      en: 'WHO/IDF. Definition and diagnosis of diabetes mellitus and intermediate hyperglycaemia: report of a WHO/IDF consultation. Geneva: WHO, 2006 — fasting plasma glucose criteria.',
      ms: 'WHO/IDF. Definition and diagnosis of diabetes mellitus and intermediate hyperglycaemia: laporan perundingan WHO/IDF. Geneva: WHO, 2006 — kriteria glukosa plasma puasa.'
    },
    kind: 'international'
  },
  WHO_HBA1C_2011: {
    id: 'WHO_HBA1C_2011',
    short: { en: 'WHO 2011', ms: 'WHO 2011' },
    full: {
      en: 'WHO. Use of glycated haemoglobin (HbA1c) in the diagnosis of diabetes mellitus: abbreviated report of a WHO consultation. Geneva: WHO, 2011 — HbA1c 6.5% (48 mmol/mol) as the diagnostic cut-off.',
      ms: 'WHO. Use of glycated haemoglobin (HbA1c) in the diagnosis of diabetes mellitus: laporan ringkas perundingan WHO. Geneva: WHO, 2011 — HbA1c 6.5% (48 mmol/mol) sebagai titik potong diagnostik.'
    },
    kind: 'international'
  },
  ADA_STANDARDS: {
    id: 'ADA_STANDARDS',
    short: { en: 'ADA Standards of Care', ms: 'Piawaian Penjagaan ADA' },
    full: {
      en: 'American Diabetes Association. Standards of Care in Diabetes, Section 2: Diagnosis and Classification — ADA defines impaired fasting glucose from 5.6 mmol/L, lower than the WHO threshold of 6.1 mmol/L. A professional society standard, NOT a Malaysian guideline.',
      ms: 'American Diabetes Association. Standards of Care in Diabetes, Seksyen 2: Diagnosis dan Klasifikasi — ADA mentakrifkan glukosa puasa terjejas bermula 5.6 mmol/L, lebih rendah daripada ambang WHO 6.1 mmol/L. Piawaian persatuan profesional, BUKAN garis panduan Malaysia.'
    },
    kind: 'society'
  },
  MOH_CPG_OBESITY: {
    id: 'MOH_CPG_OBESITY',
    short: { en: 'MOH CPG Obesity (to confirm)', ms: 'CPG KKM Obesiti (perlu disahkan)' },
    full: {
      en: 'Ministry of Health Malaysia. Clinical Practice Guidelines on Management of Obesity. Named here as the Malaysian authority that should govern these bands. NOT quoted in this build — the document could not be opened and read, so no number in this app is attributed to it.',
      ms: 'Kementerian Kesihatan Malaysia. Garis Panduan Amalan Klinikal Pengurusan Obesiti. Dinamakan di sini sebagai pihak berkuasa Malaysia yang sepatutnya mengawal julat ini. TIDAK dipetik dalam binaan ini — dokumen tidak dapat dibuka dan dibaca, jadi tiada nombor dalam aplikasi ini dikaitkan dengannya.'
    },
    kind: 'ministry'
  },
  MOH_CPG_T2DM: {
    id: 'MOH_CPG_T2DM',
    short: { en: 'MOH CPG T2DM (to confirm)', ms: 'CPG KKM DMT2 (perlu disahkan)' },
    full: {
      en: 'Ministry of Health Malaysia. Clinical Practice Guidelines on Management of Type 2 Diabetes Mellitus. Named here as the Malaysian authority that should govern these cut-offs. NOT quoted in this build — the document could not be opened and read, so no number in this app is attributed to it.',
      ms: 'Kementerian Kesihatan Malaysia. Garis Panduan Amalan Klinikal Pengurusan Diabetes Mellitus Jenis 2. Dinamakan di sini sebagai pihak berkuasa Malaysia yang sepatutnya mengawal titik potong ini. TIDAK dipetik dalam binaan ini — dokumen tidak dapat dibuka dan dibaca.'
    },
    kind: 'ministry'
  },
  WHO_HTN_2021: {
    id: 'WHO_HTN_2021',
    short: { en: 'WHO 2021', ms: 'WHO 2021' },
    full: {
      en: 'WHO. Guideline for the pharmacological treatment of hypertension in adults. Geneva: WHO, 2021 — hypertension is defined as an office systolic blood pressure of 140 mmHg or more, and/or a diastolic of 90 mmHg or more, on two separate occasions.',
      ms: 'WHO. Guideline for the pharmacological treatment of hypertension in adults. Geneva: WHO, 2021 — hipertensi ditakrifkan sebagai tekanan darah sistolik di klinik 140 mmHg atau lebih, dan/atau diastolik 90 mmHg atau lebih, pada dua kesempatan berasingan.'
    },
    kind: 'international'
  },
  ISH_2020: {
    id: 'ISH_2020',
    short: { en: 'ISH 2020', ms: 'ISH 2020' },
    full: {
      en: 'International Society of Hypertension Global Hypertension Practice Guidelines. Hypertension 2020;75(6):1334-1357 — grade 2 hypertension from 160/100 mmHg; a reading at or above 180/110 mmHg warrants prompt assessment. A professional society guideline, NOT a Malaysian one.',
      ms: 'International Society of Hypertension Global Hypertension Practice Guidelines. Hypertension 2020;75(6):1334-1357 — hipertensi gred 2 bermula 160/100 mmHg; bacaan pada atau melebihi 180/110 mmHg memerlukan penilaian segera. Garis panduan persatuan profesional, BUKAN garis panduan Malaysia.'
    },
    kind: 'society'
  },
  MOH_CPG_HTN: {
    id: 'MOH_CPG_HTN',
    short: { en: 'MOH CPG Hypertension (to confirm)', ms: 'CPG KKM Hipertensi (perlu disahkan)' },
    full: {
      en: 'Ministry of Health Malaysia. Clinical Practice Guidelines on Management of Hypertension. Named here as the Malaysian authority that should govern these cut-offs. NOT quoted in this build — the document could not be opened and read.',
      ms: 'Kementerian Kesihatan Malaysia. Garis Panduan Amalan Klinikal Pengurusan Hipertensi. Dinamakan sebagai pihak berkuasa Malaysia yang sepatutnya mengawal titik potong ini. TIDAK dipetik dalam binaan ini.'
    },
    kind: 'ministry'
  },
  WHO_PA_2020: {
    id: 'WHO_PA_2020',
    short: { en: 'WHO 2020', ms: 'WHO 2020' },
    full: {
      en: 'WHO guidelines on physical activity and sedentary behaviour. Geneva: WHO, 2020 — adults should do 150-300 minutes of moderate-intensity aerobic activity a week; adults living with a chronic condition should aim for the same where they are able, and should seek advice from a health professional on what is appropriate for them.',
      ms: 'Garis panduan WHO mengenai aktiviti fizikal dan tingkah laku sedentari. Geneva: WHO, 2020 — orang dewasa disarankan melakukan 150-300 minit aktiviti aerobik intensiti sederhana seminggu; mereka yang mempunyai penyakit kronik disarankan mensasarkan jumlah yang sama sekiranya mampu, dan hendaklah mendapatkan nasihat profesional kesihatan tentang apa yang sesuai bagi diri mereka.'
    },
    kind: 'international'
  },
  OWN_DEVICE: {
    id: 'OWN_DEVICE',
    short: { en: 'your own watch or phone', ms: 'jam atau telefon anda sendiri' },
    full: {
      en: 'The figure your own watch or phone reported. Step counts and especially energy estimates are produced by the device from movement, heart rate and assumptions about your body; they are estimates, not measurements, and two devices worn on the same day routinely disagree. This app records what your device told you and does not check it.',
      ms: 'Angka yang dilaporkan oleh jam atau telefon anda sendiri. Kiraan langkah dan terutamanya anggaran tenaga dihasilkan oleh peranti daripada pergerakan, kadar denyutan jantung dan andaian tentang badan anda; ia anggaran, bukan ukuran, dan dua peranti yang dipakai pada hari yang sama lazimnya berbeza. Aplikasi ini merekodkan apa yang dinyatakan oleh peranti anda dan tidak menyemaknya.'
    },
    kind: 'device'
  },
  OWN_LAB_REPORT: {
    id: 'OWN_LAB_REPORT',
    short: { en: "the reference range on your own report", ms: 'julat rujukan pada laporan anda sendiri' },
    full: {
      en: 'The reference range printed on the patient\'s own laboratory report by the issuing laboratory. Ranges are method- and analyser-specific, so the issuing laboratory is the only correct authority for them. No external range is substituted.',
      ms: 'Julat rujukan yang dicetak pada laporan makmal pesakit sendiri oleh makmal yang mengeluarkannya. Julat adalah khusus mengikut kaedah dan penganalisis, jadi makmal pengeluar sahaja pihak berkuasa yang betul. Tiada julat luar digantikan.'
    },
    kind: 'laboratory'
  },
  NO_GUIDELINE: {
    id: 'NO_GUIDELINE',
    short: { en: 'No guideline — record only', ms: 'Tiada garis panduan — rekod sahaja' },
    full: {
      en: 'No clinical guideline backs this item. It is stored and displayed exactly as the patient entered it, and is never interpreted, scored or ranked by this app.',
      ms: 'Tiada garis panduan klinikal menyokong item ini. Ia disimpan dan dipaparkan tepat seperti yang dimasukkan oleh pesakit, dan tidak pernah ditafsir, dimarkah atau disusun oleh aplikasi ini.'
    },
    kind: 'none'
  }
}

/* The sentence the UI must print beside any threshold whose `verified` is false. */
export const UNVERIFIED_NOTE = {
  en: 'Band taken from the international source named above. The Malaysian CPG was not read in this build — confirm against it before clinical use.',
  ms: 'Julat diambil daripada sumber antarabangsa yang dinamakan di atas. CPG Malaysia tidak dibaca dalam binaan ini — sahkan dengannya sebelum penggunaan klinikal.'
}

/* ---------------------------------------------------------------------------
   THRESHOLDS
   Each entry: the numbers, the source id they are quoted from, the Malaysian
   authority that ought to govern them, and whether that authority was read.
   ------------------------------------------------------------------------ */

export const BMI_BANDS = {
  anchoredTo: SRC.WHO_ASIA_PACIFIC_2000.id,
  alsoSee: SRC.WHO_EXPERT_2004.id,
  localAuthority: SRC.MOH_CPG_OBESITY.id,
  verified: false,              // WHO numbers quoted; Malaysian CPG not read.
  unit: 'kg/m2',
  bands: [
    { id: 'underweight', max: 18.5, level: 'watch',     label: { en: 'Underweight',          ms: 'Berat badan kurang' } },
    { id: 'normal',      max: 23.0, level: 'none',      label: { en: 'Healthy range',         ms: 'Julat sihat' } },
    { id: 'overweight',  max: 25.0, level: 'watch',     label: { en: 'Overweight (at risk)',  ms: 'Berat badan berlebihan (berisiko)' } },
    { id: 'obese1',      max: 30.0, level: 'attention', label: { en: 'Obese I',               ms: 'Obes I' } },
    { id: 'obese2',      max: Infinity, level: 'attention', label: { en: 'Obese II',          ms: 'Obes II' } }
  ]
}

export const WAIST_THRESHOLD = {
  anchoredTo: SRC.IDF_METS_2006.id,
  alsoSee: SRC.WHO_ASIA_PACIFIC_2000.id,
  localAuthority: SRC.MOH_CPG_OBESITY.id,
  verified: false,              // IDF numbers quoted; Malaysian CPG not read.
  unit: 'cm',
  male: 90,
  female: 80,
  note: {
    en: 'IDF ethnicity-specific values for South Asian and Chinese adults. IDF directs that South Asian values be used for other South and South-East Asian populations, which covers Malaysia.',
    ms: 'Nilai IDF khusus etnik bagi dewasa Asia Selatan dan Cina. IDF mengarahkan nilai Asia Selatan digunakan bagi populasi Asia Selatan dan Tenggara yang lain, yang merangkumi Malaysia.'
  }
}

export const FPG_BANDS = {
  anchoredTo: SRC.WHO_IDF_2006_GLUCOSE.id,
  divergentSource: SRC.ADA_STANDARDS.id,
  localAuthority: SRC.MOH_CPG_T2DM.id,
  verified: false,              // WHO numbers quoted; Malaysian CPG not read.
  unit: 'mmol/L',
  bands: [
    { id: 'low',         max: 4.0,  level: 'attention', label: { en: 'Below the usual range', ms: 'Bawah julat biasa' } },
    { id: 'normal',      max: 6.1,  level: 'none',      label: { en: 'Within the usual range', ms: 'Dalam julat biasa' } },
    { id: 'ifg',         max: 7.0,  level: 'watch',     label: { en: 'Above the usual range',  ms: 'Atas julat biasa' } },
    { id: 'diabetes_rg', max: Infinity, level: 'attention', label: { en: 'Well above the usual range', ms: 'Jauh atas julat biasa' } }
  ],
  divergenceNote: {
    en: 'WHO places the raised-fasting-glucose band at 6.1 mmol/L. The American Diabetes Association places it lower, at 5.6 mmol/L. This app uses WHO and says so rather than merging the two.',
    ms: 'WHO meletakkan julat glukosa puasa tinggi pada 6.1 mmol/L. American Diabetes Association meletakkannya lebih rendah, pada 5.6 mmol/L. Aplikasi ini menggunakan WHO dan menyatakannya, bukan menggabungkan kedua-duanya.'
  }
}

export const HBA1C_BANDS = {
  anchoredTo: SRC.WHO_HBA1C_2011.id,
  localAuthority: SRC.MOH_CPG_T2DM.id,
  verified: false,              // WHO number quoted; Malaysian CPG not read.
  unit: '%',
  bands: [
    { id: 'normal', max: 6.0,      level: 'none',      label: { en: 'Within the usual range',    ms: 'Dalam julat biasa' } },
    { id: 'grey',   max: 6.5,      level: 'watch',     label: { en: 'Just under the cut-off',    ms: 'Hampir titik potong' } },
    { id: 'raised', max: Infinity, level: 'attention', label: { en: 'At or above the cut-off',   ms: 'Pada atau atas titik potong' } }
  ],
  note: {
    en: 'HbA1c is unreliable in anaemia, recent transfusion, pregnancy and haemoglobin variants, which are common in Malaysia. A number here is not a diagnosis.',
    ms: 'HbA1c tidak boleh dipercayai dalam anemia, pemindahan darah baru-baru ini, kehamilan dan varian hemoglobin, yang lazim di Malaysia. Nombor di sini bukan diagnosis.'
  }
}

/* Blood pressure. A home or clinic reading is a single measurement, not a
   diagnosis: hypertension is defined on repeated readings, and this app says
   so wherever it shows a band. */
export const BP_THRESHOLD = {
  anchoredTo: SRC.WHO_HTN_2021.id,
  severeSource: SRC.ISH_2020.id,
  localAuthority: SRC.MOH_CPG_HTN.id,
  verified: false,            // WHO/ISH figures quoted; Malaysian CPG not read.
  unit: 'mmHg',
  raisedSystolic: 140,
  raisedDiastolic: 90,
  severeSystolic: 180,
  severeDiastolic: 110,
  lowSystolic: 90,
  note: {
    en: 'One reading is not a diagnosis. Hypertension is defined on readings taken on separate occasions, by someone using a cuff of the right size on a rested arm.',
    ms: 'Satu bacaan bukan diagnosis. Hipertensi ditakrifkan berdasarkan bacaan yang diambil pada kesempatan berasingan, menggunakan saiz cuff yang betul pada lengan yang telah berehat.'
  }
}

/* The weekly activity target the app measures against. WHO publishes a range;
   the app uses the lower bound as the target because that is the figure the
   guideline frames as the minimum, and overstating a target discourages the
   people most likely to benefit from starting. */
export const ACTIVITY_TARGET = {
  anchoredTo: SRC.WHO_PA_2020.id,
  verified: true,            // WHO figure, quoted directly from the guideline.
  unit: 'min/week',
  weeklyMinutes: 150,
  upperMinutes: 300,
  note: {
    en: 'This target is for adults in general. It is not a target this app has set for you, and this app does not know whether it is safe for you.',
    ms: 'Sasaran ini adalah untuk orang dewasa secara umum. Ia bukan sasaran yang ditetapkan oleh aplikasi ini untuk anda, dan aplikasi ini tidak mengetahui sama ada ia selamat untuk anda.'
  }
}

/* Analytes the app will store on a serial chart. Only FPG and HbA1c have an
   internationally anchored cut-off; for every other analyte the app compares
   against the range printed on the patient's own report and attributes it to
   the issuing laboratory. It never substitutes a range of its own. */
export const LAB_PANEL = [
  { id: 'fpg',    unit: 'mmol/L', interpret: 'FPG_BANDS',   label: { en: 'Fasting glucose',    ms: 'Glukosa puasa' } },
  { id: 'hba1c',  unit: '%',      interpret: 'HBA1C_BANDS', label: { en: 'HbA1c',              ms: 'HbA1c' } },
  { id: 'tchol',  unit: 'mmol/L', interpret: 'OWN_RANGE',   label: { en: 'Total cholesterol',  ms: 'Jumlah kolesterol' } },
  { id: 'ldl',    unit: 'mmol/L', interpret: 'OWN_RANGE',   label: { en: 'LDL cholesterol',    ms: 'Kolesterol LDL' } },
  { id: 'hdl',    unit: 'mmol/L', interpret: 'OWN_RANGE',   label: { en: 'HDL cholesterol',    ms: 'Kolesterol HDL' } },
  { id: 'tg',     unit: 'mmol/L', interpret: 'OWN_RANGE',   label: { en: 'Triglycerides',      ms: 'Trigliserida' } },
  { id: 'creat',  unit: 'umol/L', interpret: 'OWN_RANGE',   label: { en: 'Creatinine',         ms: 'Kreatinin' } },
  { id: 'egfr',   unit: 'mL/min', interpret: 'OWN_RANGE',   label: { en: 'eGFR',               ms: 'eGFR' } },
  { id: 'hb',     unit: 'g/dL',   interpret: 'OWN_RANGE',   label: { en: 'Haemoglobin',        ms: 'Hemoglobin' } },
  { id: 'k',      unit: 'mmol/L', interpret: 'OWN_RANGE',   label: { en: 'Potassium',          ms: 'Kalium' } }
]
