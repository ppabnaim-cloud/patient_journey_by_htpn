/* ===========================================================================
   storage.js — everything the patient enters, kept on their own device.

   Two stores, for one reason: the structured record is small and is read on
   every render, so it lives in localStorage where reads are synchronous.
   Photographs are large and would blow the ~5 MB localStorage quota, so they
   live in IndexedDB as blobs and are fetched only when shown.

   Neither store is ever read by the network code. src/usage.js cannot import
   this file; the only thing it is told is a BANDED COUNT of how many entries
   exist, never what they are. Keep it that way.
   ========================================================================= */

const RECORD_KEY = 'pjhtpn.record.v1'
const PREFS_KEY = 'pjhtpn.prefs.v1'
const DB_NAME = 'pjhtpn-photos'
const DB_STORE = 'photos'

export const EMPTY_RECORD = {
  version: 2,
  gender: null,
  noKnownAllergy: false,
  medications: [],
  issues: [],
  allergies: [],
  surgeries: [],
  labs: [],
  imaging: [],
  activity: [],
  measurements: [],
  photos: []        // metadata only; the bytes live in IndexedDB
}

const safeParse = (s, fallback) => {
  try { return s ? JSON.parse(s) : fallback } catch { return fallback }
}

/* Private browsing and locked-down corporate profiles can throw on access
   rather than simply returning null, so every call is guarded. The app must
   still run when storage is unavailable; it just forgets. */
function ls () {
  try { return globalThis.localStorage || null } catch { return null }
}

export function loadRecord () {
  const store = ls()
  if (!store) return { ...EMPTY_RECORD }
  const r = safeParse(store.getItem(RECORD_KEY), null)
  if (!r || typeof r !== 'object') return { ...EMPTY_RECORD }
  return migrate({ ...EMPTY_RECORD, ...r })
}

/* v1 called the field `sex`; v2 calls it `gender`, which is the word the
   hospital uses with patients. Anyone who used the v1 build keeps their
   answer rather than being asked again. */
function migrate (r) {
  if (!Array.isArray(r.activity)) r.activity = []
  if (r.version < 2 || (r.gender == null && r.sex != null)) {
    r.gender = r.gender ?? r.sex ?? null
    delete r.sex
    r.imaging = r.imaging || []
    r.activity = r.activity || []
    r.version = 2
  }
  return r
}

export function saveRecord (record) {
  const store = ls()
  if (!store) return false
  try { store.setItem(RECORD_KEY, JSON.stringify(record)); return true } catch { return false }
}

export function loadPrefs () {
  const store = ls()
  const d = { lang: null, consent: null, deviceCode: null, seenPrivacy: false }
  if (!store) return d
  return { ...d, ...safeParse(store.getItem(PREFS_KEY), {}) }
}

export function savePrefs (prefs) {
  const store = ls()
  if (!store) return false
  try { store.setItem(PREFS_KEY, JSON.stringify(prefs)); return true } catch { return false }
}

/* How many things the patient has entered. Used for two purposes: the empty
   state, and the single BANDED number that usage counting is allowed to see.
   It returns a count, never any content. */
export function entryCount (record) {
  const r = record || EMPTY_RECORD
  return (r.medications?.length || 0) + (r.issues?.length || 0) +
         (r.allergies?.length || 0) + (r.surgeries?.length || 0) +
         (r.labs?.length || 0) + (r.imaging?.length || 0) + (r.measurements?.length || 0) +
         (r.activity?.length || 0)
}

/* --- photographs: IndexedDB --------------------------------------------- */

function openDB () {
  return new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) return reject(new Error('no indexedDB'))
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(DB_STORE)) db.createObjectStore(DB_STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error || new Error('indexedDB open failed'))
  })
}

function tx (mode, fn) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const t = db.transaction(DB_STORE, mode)
    const store = t.objectStore(DB_STORE)
    let out
    try { out = fn(store) } catch (e) { reject(e); return }
    t.oncomplete = () => resolve(out && out.result !== undefined ? out.result : out)
    t.onerror = () => reject(t.error)
    t.onabort = () => reject(t.error)
  }))
}

export async function putPhoto (id, blob) {
  try { await tx('readwrite', s => s.put(blob, id)); return true } catch { return false }
}

export async function getPhoto (id) {
  try { return await tx('readonly', s => s.get(id)) } catch { return null }
}

export async function deletePhoto (id) {
  try { await tx('readwrite', s => s.delete(id)); return true } catch { return false }
}

export async function clearEverything () {
  const store = ls()
  try { store?.removeItem(RECORD_KEY) } catch { /* nothing to do */ }
  try { await tx('readwrite', s => s.clear()) } catch { /* nothing to do */ }
  return true
}

/* Export is a plain JSON file the patient keeps. It is written by the browser
   to their own downloads folder; nothing is uploaded to produce it. */
export function exportBlob (record) {
  const payload = {
    exportedFrom: 'Patient Journey by HTPN',
    exportedAt: new Date().toISOString(),
    note: 'This file is your own record. It was created on your device and was not uploaded anywhere.',
    record
  }
  return new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
}

export const newId = () => {
  const b = new Uint8Array(8)
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(b)
  else for (let i = 0; i < b.length; i++) b[i] = Math.floor(Math.random() * 256)
  return [...b].map(x => x.toString(16).padStart(2, '0')).join('')
}
