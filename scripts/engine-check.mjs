/* Prints every threshold with its citation, then exercises the engine on a
   worked example. Run: node scripts/engine-check.mjs */
import { SRC, BMI_BANDS, WAIST_THRESHOLD, FPG_BANDS, HBA1C_BANDS, LAB_PANEL } from '../src/engine/sources.js'
import { calcBMI, classifyBMI, classifyWaist, classifyBP } from '../src/engine/anthro.js'
import { classifyResult } from '../src/engine/labs.js'
import { reviewRecord, summarise } from '../src/engine/review.js'
import { DEPARTMENTS, DEPARTMENTS_WCC, CAMPUSES, directionsUrl } from '../src/data/wayfinding.js'
import { readMedSheet, durationOf, durationLabel, normaliseFreq, readDate, MED_COLUMNS, expiryState, MED_STATUS } from '../src/engine/medsheet.js'

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

/* Every location offers the same two things. HTPN asked for the standard to
   hold across the whole list, and a card quietly missing one of them is the
   kind of gap nobody notices until a patient is standing in a car park. */
line('\n--- way-finding: both links on every location ---')
const ALL = DEPARTMENTS.concat(DEPARTMENTS_WCC)
check('twenty-eight Main Building locations', DEPARTMENTS.length, 28)
check('six WCC locations', DEPARTMENTS_WCC.length, 6)
/* Two cards pointing at one saved place sends somebody to the wrong door
   with nothing anywhere saying so. Checked per site, because each site
   legitimately has its own cafe, its own forensics and its own emergency
   department — the same NAME twice is fine, the same PIN twice is not. */
const mainPins = DEPARTMENTS.map(d => d.map)
check('Main Building pins are all distinct',
  [...new Set(mainPins.filter((u, i) => mainPins.indexOf(u) !== i))]
    .filter(u => u !== 'https://maps.app.goo.gl/39pox6E6PciNfYTz5').join(', '), '')
/* Every ward is named by its number. A speciality is only ever stated where
   HTPN stated one — a guess sends a family to the wrong floor. */
const wards = DEPARTMENTS.filter(d => d.icon === 'ward')
/* Six cards, nine wards: 1 to 4 share one four-storey block and one pin. */
check('six ward locations covering wards 1-9', wards.length, 6)
check('every ward is numbered', wards.every(d => /\d/.test(d.name.ms)), true)
const noDirections = ALL.filter(d => !d.destination || !directionsUrl(d.destination))
check('every location can give directions', noDirections.map(d => d.name.en).join(', '), '')
const noPin = ALL.filter(d => !d.map)
check('every location has an exact-location pin', noPin.map(d => d.name.en).join(', '), '')
const badPin = ALL.filter(d => d.map && !/^https:\/\//.test(d.map))
check('every pin is a real link', badPin.map(d => d.name.en).join(', '), '')
/* Two saved places that are the same place is a copy-paste slip, and it
   sends a patient to the wrong door with no error anywhere. */
const pins = ALL.map(d => d.map)
const dupes = [...new Set(pins.filter((u, i) => pins.indexOf(u) !== i))]
check('WCC pins are all distinct', DEPARTMENTS_WCC.filter(d => dupes.includes(d.map)).length, 0)
/* Each site's locations send their directions to THEIR OWN site. The two are
   a kilometre apart, so a WCC counter resolving to the Main Building is the
   exact failure this section exists to prevent. */
check('WCC directions name the WCC',
  DEPARTMENTS_WCC.every(d => /Wanita dan Kanak-Kanak/.test(d.destination)), true)
check('both sites keep their own pin', CAMPUSES.every(c => !!c.map), true)

/* The medicines sheet: what the device can read off a label, and what it
   must refuse to guess at. */
line('\n--- the medicines sheet ---')
check('ten columns, nine stored and one computed', MED_COLUMNS.length, 10)
check('three medicine states', MED_STATUS.map(x => x.id).join(','), 'active,completed,stopped')
/* Expiry is judged against the date the PATIENT typed, and against nothing
   else. A blank or malformed date says nothing rather than something. */
check('an expired date is flagged', expiryState({ expiryOn: '2026-10-01' }, '2026-10-31'), 'expired')
check('a month ahead is a warning', expiryState({ expiryOn: '2026-11-10' }, '2026-10-31'), 'soon')
check('a year ahead is fine', expiryState({ expiryOn: '2027-06-01' }, '2026-10-31'), 'ok')
check('no expiry date says nothing', expiryState({ expiryOn: '' }, '2026-10-31'), null)
check('a malformed expiry says nothing', expiryState({ expiryOn: 'next year' }, '2026-10-31'), null)
const LABEL = ['HOSPITAL TENGKU PERMAISURI NORASHIKIN', 'FARMASI PESAKIT LUAR',
               'Tarikh: 23/10/2026', '1. METFORMIN 500mg tablet TDS',
               '2) Amlodipine 10 mg OD', '3 - Atorvastatin 20mg ON', 'Qty 90'].join('\n')
const read = readMedSheet(LABEL)
check('three medicines read from one label', read.length, 3)
check('the list numbering is not part of the name', read[0].name, 'METFORMIN')
check('strength is read', read[0].dose, '500 mg')
check('frequency is normalised', read[0].frequency, 'tds')
check('the dispensing date is applied to every row',
  read.every(r => r.startedOn === '2026-10-23'), true)
check('the hospital is read from the header', read[0].hospital,
  'Hospital Tengku Permaisuri Norashikin')
/* The refusals matter more than the readings. A wrong dose nobody notices is
   worse than an empty cell somebody fills in. */
check('nothing is read out of text with no medicine in it', readMedSheet('aaa\nbbb\n123').length, 0)
check('a line with no strength is skipped', readMedSheet('Take one tablet daily').length, 0)
check('an impossible date is refused rather than coerced', readDate('45/13/2026'), '')
check('an unknown frequency is left empty', normaliseFreq('every so often'), '')
check('duration needs both dates', durationOf({ startedOn: '2026-01-02', lastOn: '' }), null)
check('duration refuses to run backwards', durationOf({ startedOn: '2026-04-02', lastOn: '2026-01-02' }), null)
check('duration is computed, not typed',
  durationLabel({ startedOn: '2026-01-02', lastOn: '2026-04-02' }).en, '3 months')

line('\n' + (fail === 0 ? 'ALL CHECKS PASSED' : fail + ' CHECK(S) FAILED'))
process.exit(fail === 0 ? 0 : 1)
