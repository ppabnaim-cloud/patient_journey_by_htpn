/* Prints every threshold with its citation, then exercises the engine on a
   worked example. Run: node scripts/engine-check.mjs */
import { SRC, BMI_BANDS, WAIST_THRESHOLD, FPG_BANDS, HBA1C_BANDS, LAB_PANEL } from '../src/engine/sources.js'
import { calcBMI, classifyBMI, classifyWaist, classifyBP } from '../src/engine/anthro.js'
import { classifyResult } from '../src/engine/labs.js'
import { reviewRecord, summarise } from '../src/engine/review.js'

const line = (s='') => console.log(s)
const cite = id => SRC[id].full.en

line('================ THRESHOLDS AND THEIR CITATIONS ================\n')

line('BMI  (' + BMI_BANDS.unit + ')   verified=' + BMI_BANDS.verified)
for (const b of BMI_BANDS.bands) line('   < ' + String(b.max).padEnd(8) + b.label.en + '  [' + b.level + ']')
line('   SOURCE: ' + cite(BMI_BANDS.anchoredTo))
line('   ALSO:   ' + cite(BMI_BANDS.alsoSee))
line('   LOCAL:  ' + cite(BMI_BANDS.localAuthority))
line()

line('WAIST (cm)   verified=' + WAIST_THRESHOLD.verified)
line('   male >= ' + WAIST_THRESHOLD.male + '   female >= ' + WAIST_THRESHOLD.female)
line('   SOURCE: ' + cite(WAIST_THRESHOLD.anchoredTo))
line('   LOCAL:  ' + cite(WAIST_THRESHOLD.localAuthority))
line()

line('FASTING GLUCOSE (' + FPG_BANDS.unit + ')   verified=' + FPG_BANDS.verified)
for (const b of FPG_BANDS.bands) line('   < ' + String(b.max).padEnd(8) + b.label.en + '  [' + b.level + ']')
line('   SOURCE:    ' + cite(FPG_BANDS.anchoredTo))
line('   DIVERGENT: ' + cite(FPG_BANDS.divergentSource))
line('   LOCAL:     ' + cite(FPG_BANDS.localAuthority))
line()

line('HbA1c (' + HBA1C_BANDS.unit + ')   verified=' + HBA1C_BANDS.verified)
for (const b of HBA1C_BANDS.bands) line('   < ' + String(b.max).padEnd(8) + b.label.en + '  [' + b.level + ']')
line('   SOURCE: ' + cite(HBA1C_BANDS.anchoredTo))
line('   LOCAL:  ' + cite(HBA1C_BANDS.localAuthority))
line()

line('ALL OTHER ANALYTES: no app-held range. Compared against the range the')
line('patient copies from their own report. SOURCE: ' + cite('OWN_LAB_REPORT'))
line('   ' + LAB_PANEL.filter(a => a.interpret === 'OWN_RANGE').map(a => a.id).join(', '))
line()

line('================ WORKED EXAMPLE ================\n')
let fail = 0
const check = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want)
  if (!ok) { fail++; console.log('  FAIL ' + name + ': got ' + JSON.stringify(got) + ' want ' + JSON.stringify(want)) }
  else console.log('  ok   ' + name + ' = ' + JSON.stringify(got))
}

check('BMI 82kg/170cm', calcBMI(82, 170), 28.4)
check('BMI bad input', calcBMI('abc', 170), null)
check('BMI 0 height', calcBMI(70, 0), null)
check('classify 22.9', classifyBMI(22.9).level, 'none')
check('classify 23.0', classifyBMI(23.0).level, 'watch')
check('classify 25.0', classifyBMI(25.0).level, 'attention')
check('classify 28.4', classifyBMI(28.4).level, 'attention')
check('waist m 90', classifyWaist(90, 'male').level, 'attention')
check('waist m 89', classifyWaist(89, 'male').level, 'none')
check('waist f 80', classifyWaist(80, 'female').level, 'attention')
check('waist no gender', classifyWaist(95, null).level, 'none')
check('bp 118/76 normal', classifyBP(118, 76).level, 'none')
check('bp 140/85 raised', classifyBP(140, 85).level, 'attention')
check('bp 135/92 raised on diastolic', classifyBP(135, 92).level, 'attention')
check('bp 182/95 is a warning', classifyBP(182, 95).level, 'warning')
check('bp 150/112 is a warning', classifyBP(150, 112).level, 'warning')
check('bp 85/55 low', classifyBP(85, 55).level, 'watch')
check('bp typed backwards is not interpreted', classifyBP(80, 120).level, 'none')
check('bp missing one number is not interpreted', classifyBP(130, null).level, 'none')
check('fpg 3.2 is warning', classifyResult('fpg', 3.2).level, 'warning')
check('fpg 5.5 normal', classifyResult('fpg', 5.5).level, 'none')
check('fpg 6.5 watch', classifyResult('fpg', 6.5).level, 'watch')
check('fpg 9.0 attention', classifyResult('fpg', 9.0).level, 'attention')
check('hba1c 6.5 attention', classifyResult('hba1c', 6.5).level, 'attention')
check('ldl no range = none', classifyResult('ldl', 4.9).level, 'none')
check('ldl with range', classifyResult('ldl', 4.9, { low: 0, high: 3.4 }).level, 'watch')

const record = {
  gender: 'female',
  allergies: [
    { substance: 'Penicillin', severity: 'severe' },
    { substance: 'Seafood', severity: 'mild' }
  ],
  medications: [
    { drug: 'Metformin', dose: '500 mg BD', indication: 'Diabetes', status: 'on' },
    { drug: 'Simvastatin', dose: '20 mg ON', indication: '', status: 'on' },
    { drug: 'Amlodipine', dose: '5 mg OD', indication: 'Hypertension', status: 'off' }
  ],
  issues: [{ text: 'Type 2 diabetes', status: 'active' }],
  surgeries: [{ name: 'Caesarean section', date: '2016-04-02' }],
  measurements: [
    { date: '2026-01-10', weightKg: 78, heightCm: 158, waistCm: 92, systolic: 134, diastolic: 84 },
    { date: '2026-09-01', weightKg: 82, heightCm: 158, waistCm: 94, systolic: 146, diastolic: 92 }
  ],
  imaging: [
    { date: '2026-08-20', modality: 'ct', bodyPart: 'Abdomen', finding: 'Fatty liver. No focal lesion.' }
  ],
  labs: [
    { date: '2026-09-01', analyteId: 'hba1c', value: 8.1 },
    { date: '2026-09-01', analyteId: 'fpg', value: 7.8 },
    { date: '2026-09-01', analyteId: 'ldl', value: 4.9, refLow: 0, refHigh: 3.4 }
  ]
}

const findings = reviewRecord(record)
line('\n  Sorted output (rule 4 — warning first, nothing-to-do folded):')
for (const f of findings) {
  line('   [' + f.level.padEnd(9) + '] ' + (f.folded ? 'folded ' : '       ') + f.title.en + ' — ' + f.detail.en.slice(0, 72))
}
line('\n  Counts: ' + JSON.stringify(summarise(findings)))

const order = findings.map(f => f.level)
const rank = { warning: 3, attention: 2, watch: 1, none: 0 }
let monotonic = true
for (let i = 1; i < order.length; i++) if (rank[order[i]] > rank[order[i-1]]) monotonic = false
check('sorted descending by urgency', monotonic, true)
check('first finding is the severe allergy', findings[0].id, 'allergy_severe')
check('waist is interpreted when gender is recorded',
  findings.find(f => f.id === 'waist')?.level, 'attention')
check('imaging findings appear', !!findings.find(f => f.id === 'imaging_count'), true)
check('blood pressure is reviewed', findings.find(f => f.id === 'bp')?.level, 'attention')
check('severe allergy is never folded', findings[0].folded, false)
check('every finding carries a source', findings.every(f => !!f.source), true)

line('\n' + (fail === 0 ? 'ALL CHECKS PASSED' : fail + ' CHECK(S) FAILED'))
process.exit(fail === 0 ? 0 : 1)
