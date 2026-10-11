/* Exercises the server's refusal rules. Run: node scripts/server-check.mjs */
import { __test } from '../api/submit.js'
import { buildRecord, newDeviceCode, OUTGOING_FIELDS } from '../src/collection.js'

const { validate, forbiddenKeysIn } = __test
let fail = 0
const t = (name, cond) => { if (cond) console.log('  ok   ' + name); else { fail++; console.log('  FAIL ' + name) } }

const good = buildRecord({
  appVersion: '0.1.0', deviceCode: newDeviceCode(), sessionCode: newDeviceCode(),
  isNewDevice: true, lang: 'en', action: 'tab_open', tab: 'records', detail: 'meds',
  seq: 2, userAgent: 'Mozilla/5.0 (iPhone)', screenWidth: 390, standalone: false,
  online: true, sessionMs: 90000, tabsUsed: 2, recordsHeld: 3
})

console.log('--- no false positives on the allowlist itself ---')
t('every allowlisted key survives the identifier test', forbiddenKeysIn(good).length === 0)
if (forbiddenKeysIn(good).length) console.log('     tripped on: ' + forbiddenKeysIn(good).join(', '))
t('a clean record validates', validate(good).ok === true)

console.log('\n--- identifiers are REFUSED, not stripped ---')
for (const [k, v] of [
  ['name', 'Ali bin Abu'], ['patientName', 'Ali'], ['full_name', 'Ali'],
  ['ic', '880101105533'], ['nric', '880101105533'], ['no_kp', '880101105533'],
  ['phone', '0123456789'], ['mobileNumber', '0123456789'],
  ['email', 'a@b.com'], ['address', 'Jalan 1'], ['postcode', '43000'],
  ['dob', '1988-01-01'], ['dateOfBirth', '1988-01-01'], ['age', 38], ['exactAge', 38], ['umur', 38],
  ['latitude', 2.99], ['lng', 101.7], ['gps', '2.99,101.7'],
  ['diagnosis', 'T2DM'], ['medication', 'Metformin'], ['drug', 'Metformin'],
  ['allergy', 'Penicillin'], ['result', 8.1], ['weight', 82], ['bmi', 32.8],
  ['photo', 'data:image/jpeg;base64,...'], ['ocr_text', 'Metformin 500mg'], ['note', 'felt unwell']
]) {
  const r = validate({ ...good, [k]: v })
  const refused = r.ok === false && r.reason === 'identifier_fields_present' && r.fields.includes(k)
  t(`refuses "${k}"`, refused)
}

console.log('\n--- allowlist ---')
let r = validate({ ...good, somethingNew: 'x' })
t('refuses an unknown field', r.ok === false && r.reason === 'fields_not_on_allowlist')
r = validate({ ...good, tab: 'secret_admin_tab' })
t('refuses a tab outside the vocabulary', r.ok === false && r.reason === 'value_outside_vocabulary')
r = validate({ ...good, action: 'exfiltrate' })
t('refuses an action outside the vocabulary', r.ok === false && r.reason === 'value_outside_vocabulary')
r = validate({ ...good, detail: 'Ali bin Abu' })
t('refuses free text smuggled into detail', r.ok === false && r.reason === 'value_outside_vocabulary')
r = validate({ ...good, deviceCode: 'notacode' })
t('refuses a malformed device code', r.ok === false && r.reason === 'bad_code_format')
r = validate({ ...good, dateLocal: '2026-10-11T14:32:07Z' })
t('refuses a full timestamp where a date belongs', r.ok === false && r.reason === 'bad_date_format')
r = validate({ ...good, recordsHeld: 47 })
t('refuses an exact count where a band belongs', r.ok === false && r.reason === 'value_outside_vocabulary')
r = validate({ ...good, schema: 'something-else' })
t('refuses a wrong schema', r.ok === false && r.reason === 'wrong_schema')
r = validate(null)
t('refuses a null body', r.ok === false)
r = validate([1, 2, 3])
t('refuses an array body', r.ok === false)
r = validate({ ...good, appVersion: 'x'.repeat(100) })
t('refuses an over-long string', r.ok === false && r.reason === 'string_too_long')

console.log('\n--- the two halves agree ---')
t('server allowlist is the browser allowlist', OUTGOING_FIELDS.length === 20)
t('row has one cell per allowlisted field', __test.rowFrom(good).length === OUTGOING_FIELDS.length)
t('server flag defaults OFF', __test.COLLECTION_ENABLED === false)

console.log('\n' + (fail === 0 ? 'ALL CHECKS PASSED' : fail + ' CHECK(S) FAILED'))
process.exit(fail === 0 ? 0 : 1)
