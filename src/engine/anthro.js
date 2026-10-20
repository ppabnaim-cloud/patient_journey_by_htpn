/* ===========================================================================
   anthro.js — body measurements. Pure functions only. No React, no DOM.
   Every exported function returns either a plain number/null, or a FINDING:

     { id, level, title, detail, steps[], source, flag, value }

   level is one of: 'warning' | 'attention' | 'watch' | 'none'
     warning   — a safety item that must be seen now; never folded away.
     attention — outside the cited band; bring it up at the next visit.
     watch     — borderline against the cited band.
     none      — nothing to act on. The UI folds these, it does not delete them.

   source is an SRC id. flag is null when the number is anchored, or a bilingual
   sentence when it is not. Nothing here diagnoses anything.
   ========================================================================= */

import { SRC, BMI_BANDS, WAIST_THRESHOLD, BP_THRESHOLD, UNVERIFIED_NOTE } from './sources.js'

const num = (v) => {
  const n = typeof v === 'number' ? v : parseFloat(v)
  return Number.isFinite(n) ? n : null
}

/* BMI = kg / m^2. Returns null rather than NaN when either input is unusable,
   so a caller can never render "NaN" at a patient. */
export function calcBMI (weightKg, heightCm) {
  const w = num(weightKg)
  const h = num(heightCm)
  if (w === null || h === null) return null
  if (w <= 0 || w > 400) return null
  if (h <= 0 || h > 260) return null
  const m = h / 100
  return Math.round((w / (m * m)) * 10) / 10
}

/* Lowest band whose `max` the value is strictly under. The final band's max is
   Infinity, so this always resolves. */
function bandFor (value, bands) {
  for (const b of bands) if (value < b.max) return b
  return bands[bands.length - 1]
}

export function classifyBMI (bmiValue) {
  const v = num(bmiValue)
  if (v === null) {
    return {
      id: 'bmi', level: 'none', value: null,
      title: { en: 'Body mass index', ms: 'Indeks jisim badan' },
      detail: { en: 'Enter a height and a weight to work this out.', ms: 'Masukkan tinggi dan berat untuk mengiranya.' },
      steps: [], source: BMI_BANDS.anchoredTo, flag: null
    }
  }
  const band = bandFor(v, BMI_BANDS.bands)
  const steps = []
  if (band.level !== 'none') {
    steps.push({
      en: 'Show this number to your doctor or nurse at your next visit.',
      ms: 'Tunjukkan nombor ini kepada doktor atau jururawat anda pada lawatan berikutnya.'
    })
  }
  if (band.id === 'underweight') {
    steps.push({
      en: 'Say whether you have lost weight without trying. That matters more than the number itself.',
      ms: 'Nyatakan sama ada anda hilang berat tanpa mencuba. Itu lebih penting daripada nombor itu sendiri.'
    })
  }
  if (band.id === 'overweight' || band.id === 'obese1' || band.id === 'obese2') {
    steps.push({
      en: 'Ask whether you are due for a blood sugar, cholesterol and blood pressure check.',
      ms: 'Tanya sama ada anda perlu pemeriksaan gula dalam darah, kolesterol dan tekanan darah.'
    })
  }
  return {
    id: 'bmi',
    level: band.level,
    value: v,
    title: { en: 'Body mass index', ms: 'Indeks jisim badan' },
    detail: {
      en: `BMI ${v} ${BMI_BANDS.unit} — ${band.label.en}. Asian cut-offs, which sit lower than the international ones.`,
      ms: `BMI ${v} ${BMI_BANDS.unit} — ${band.label.ms}. Titik potong Asia, yang lebih rendah daripada antarabangsa.`
    },
    steps,
    source: BMI_BANDS.anchoredTo,
    flag: BMI_BANDS.verified ? null : UNVERIFIED_NOTE
  }
}

/* Gender is needed because the cited threshold is gender-specific. When it is
   not recorded the app refuses to pick one on the patient's behalf. */
export function classifyWaist (waistCm, gender) {
  const v = num(waistCm)
  if (v === null) {
    return {
      id: 'waist', level: 'none', value: null,
      title: { en: 'Waist circumference', ms: 'Lilit pinggang' },
      detail: { en: 'Measure around the waist at the level of the navel, standing, breathing out.', ms: 'Ukur di sekeliling pinggang pada aras pusat, berdiri, sambil menghembus nafas.' },
      steps: [], source: WAIST_THRESHOLD.anchoredTo, flag: null
    }
  }
  if (gender !== 'male' && gender !== 'female') {
    return {
      id: 'waist', level: 'none', value: v,
      title: { en: 'Waist circumference', ms: 'Lilit pinggang' },
      detail: {
        en: `${v} cm recorded. The cited threshold differs between men and women, so this app will not interpret the figure until gender is recorded.`,
        ms: `${v} cm direkodkan. Ambang yang dirujuk berbeza antara lelaki dan perempuan, maka aplikasi ini tidak akan mentafsirkan angka ini sehingga jantina direkodkan.`
      },
      steps: [], source: WAIST_THRESHOLD.anchoredTo,
      flag: { en: 'Not interpreted: gender not recorded.', ms: 'Tidak ditafsirkan: jantina belum direkodkan.' }
    }
  }
  const cut = gender === 'male' ? WAIST_THRESHOLD.male : WAIST_THRESHOLD.female
  const over = v >= cut
  return {
    id: 'waist',
    level: over ? 'attention' : 'none',
    value: v,
    title: { en: 'Waist circumference', ms: 'Lilit pinggang' },
    detail: over
      ? { en: `${v} cm, at or above the ${cut} cm mark used for this population.`, ms: `${v} cm, pada atau melebihi paras ${cut} cm bagi populasi ini.` }
      : { en: `${v} cm, under the ${cut} cm mark used for this population.`, ms: `${v} cm, bawah paras ${cut} cm bagi populasi ini.` },
    steps: over ? [{
      en: 'Mention this alongside your weight. Waist size carries information that BMI alone does not.',
      ms: 'Sebutkan ini bersama berat anda. Saiz pinggang membawa maklumat yang tidak diberikan oleh BMI sahaja.'
    }] : [],
    source: WAIST_THRESHOLD.anchoredTo,
    flag: WAIST_THRESHOLD.verified ? null : UNVERIFIED_NOTE
  }
}

/* Blood pressure. Two numbers, one finding. The app reports which side of the
   cited line a reading falls and never calls it hypertension — that is a
   diagnosis made on repeated readings, which this app cannot make. */
export function classifyBP (systolic, diastolic) {
  const sys = num(systolic)
  const dia = num(diastolic)
  const base = {
    id: 'bp',
    title: { en: 'Blood pressure', ms: 'Tekanan darah' },
    source: BP_THRESHOLD.anchoredTo,
    note: BP_THRESHOLD.note,
    flag: BP_THRESHOLD.verified ? null : UNVERIFIED_NOTE
  }
  if (sys === null || dia === null) {
    return {
      ...base, level: 'none', value: null,
      detail: { en: 'Enter both the upper and the lower number to have this checked.',
                ms: 'Masukkan kedua-dua nombor atas dan bawah untuk disemak.' },
      steps: []
    }
  }
  if (sys <= dia || sys > 300 || dia > 200 || sys < 40 || dia < 20) {
    return {
      ...base, level: 'none', value: `${sys}/${dia}`,
      detail: { en: `${sys}/${dia} mmHg recorded. These two numbers do not look like a blood pressure reading, so the app has not interpreted them.`,
                ms: `${sys}/${dia} mmHg direkodkan. Kedua-dua nombor ini tidak kelihatan seperti bacaan tekanan darah, jadi aplikasi tidak mentafsirkannya.` },
      steps: [],
      flag: { en: 'Not interpreted: the reading looks mistyped.', ms: 'Tidak ditafsirkan: bacaan kelihatan tersalah taip.' }
    }
  }

  const severe = sys >= BP_THRESHOLD.severeSystolic || dia >= BP_THRESHOLD.severeDiastolic
  const raised = sys >= BP_THRESHOLD.raisedSystolic || dia >= BP_THRESHOLD.raisedDiastolic
  const low = sys < BP_THRESHOLD.lowSystolic

  if (severe) {
    return {
      ...base, level: 'warning', value: `${sys}/${dia}`,
      source: BP_THRESHOLD.severeSource,
      detail: {
        en: `${sys}/${dia} mmHg — at or above the ${BP_THRESHOLD.severeSystolic}/${BP_THRESHOLD.severeDiastolic} mark, which is the level at which a prompt check is advised.`,
        ms: `${sys}/${dia} mmHg — pada atau melebihi paras ${BP_THRESHOLD.severeSystolic}/${BP_THRESHOLD.severeDiastolic}, iaitu paras yang memerlukan pemeriksaan segera.`
      },
      steps: [
        { en: 'Sit quietly for five minutes and measure again. If it stays this high, be seen today rather than at your next appointment.',
          ms: 'Duduk tenang selama lima minit dan ukur semula. Sekiranya ia kekal setinggi ini, dapatkan pemeriksaan hari ini dan bukan pada janji temu seterusnya.' },
        { en: 'With chest pain, breathlessness, a bad headache, blurred vision or weakness on one side — go to the Emergency Department now.',
          ms: 'Sekiranya disertai sakit dada, sesak nafas, sakit kepala teruk, penglihatan kabur atau lemah sebelah badan — terus ke Jabatan Kecemasan sekarang.' }
      ]
    }
  }
  if (raised) {
    return {
      ...base, level: 'attention', value: `${sys}/${dia}`,
      detail: {
        en: `${sys}/${dia} mmHg — at or above the ${BP_THRESHOLD.raisedSystolic}/${BP_THRESHOLD.raisedDiastolic} mark used to define raised blood pressure.`,
        ms: `${sys}/${dia} mmHg — pada atau melebihi paras ${BP_THRESHOLD.raisedSystolic}/${BP_THRESHOLD.raisedDiastolic} yang digunakan untuk mentakrifkan tekanan darah tinggi.`
      },
      steps: [{
        en: 'Bring your readings to your next appointment. A single raised reading is common and does not settle anything on its own.',
        ms: 'Bawa bacaan anda ke janji temu seterusnya. Satu bacaan tinggi adalah perkara biasa dan tidak menentukan apa-apa dengan sendirinya.'
      }]
    }
  }
  if (low) {
    return {
      ...base, level: 'watch', value: `${sys}/${dia}`,
      detail: { en: `${sys}/${dia} mmHg — below the usual range.`, ms: `${sys}/${dia} mmHg — bawah julat biasa.` },
      steps: [{
        en: 'Mention it if you have felt dizzy on standing, or faint.',
        ms: 'Nyatakannya sekiranya anda berasa pening apabila berdiri, atau hampir pengsan.'
      }]
    }
  }
  return {
    ...base, level: 'none', value: `${sys}/${dia}`,
    detail: { en: `${sys}/${dia} mmHg — under the ${BP_THRESHOLD.raisedSystolic}/${BP_THRESHOLD.raisedDiastolic} mark.`,
              ms: `${sys}/${dia} mmHg — bawah paras ${BP_THRESHOLD.raisedSystolic}/${BP_THRESHOLD.raisedDiastolic}.` },
    steps: []
  }
}

/* Trend over the stored measurement series. Deliberately descriptive only:
   it reports the change and does not call it good or bad, because no cited
   guideline in this app defines a meaningful rate of weight change. */
export function weightTrend (measurements) {
  const rows = (measurements || [])
    .filter(m => num(m.weightKg) !== null && m.date)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
  if (rows.length < 2) return null
  const first = rows[0]
  const last = rows[rows.length - 1]
  const delta = Math.round((num(last.weightKg) - num(first.weightKg)) * 10) / 10
  return {
    id: 'weight_trend',
    level: 'none',
    value: delta,
    n: rows.length,
    from: first.date,
    to: last.date,
    title: { en: 'Weight change', ms: 'Perubahan berat' },
    detail: {
      en: `${delta > 0 ? '+' : ''}${delta} kg across ${rows.length} entries, ${first.date} to ${last.date}.`,
      ms: `${delta > 0 ? '+' : ''}${delta} kg merentas ${rows.length} catatan, ${first.date} hingga ${last.date}.`
    },
    steps: [],
    source: SRC.NO_GUIDELINE.id,
    flag: {
      en: 'Description only. No guideline in this app defines what a given rate of weight change means.',
      ms: 'Keterangan sahaja. Tiada garis panduan dalam aplikasi ini mentakrifkan maksud kadar perubahan berat tertentu.'
    }
  }
}
