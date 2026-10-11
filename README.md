# Patient Journey by HTPN

A bilingual (Bahasa Melayu / English) companion for patients of **Hospital Tengku
Permaisuri Norashikin, Kajang**. It keeps a patient's own medicines, results and
measurements **on their own device**, helps them find their way around the two
sites, and points them at iQMS and MyUbat.

*Prototype design by Dr Naim, HTPN.*

---

## What it does, tab by tab

| | Tab | What it holds |
|---|---|---|
| 1 | **My Journey** | Everything on file, sorted by what needs acting on. Warning signs first; items with nothing to act on are folded, never deleted. Prints a clinic summary. |
| 2 | **My Records** | Medicines (drug / dose / indication / on–off), active problems, allergies, operations, serial blood results. Photograph a document, upload one, or type it in. |
| 3 | **Measurements** | Weight, height, BMI, waist circumference, with the trend. |
| 4 | **Finding Your Way** | The two sites and 21 further points, each opening in Google Maps. |
| 5 | **Queue Number** | The iQMS poster and the live queue link for HTPN. |
| 6 | **Medicine Delivery** | MyUbat, with a plain statement of what it must **not** be used for — anything on cold chain above all. |
| 7 | **The Public's Role** | The poster set, grouped by the five roles. |

Everything is in both languages, clinical text included. Every screen fits a
10-inch tablet in portrait with **no scrolling**: lists page, long sections split
into steps.

---

## The five rules this code is built to

1. **Every clinical statement is anchored or flagged.** Each threshold in
   `src/engine/sources.js` carries its exact source — guideline, edition, year,
   section — and that citation is rendered on screen next to the result. A
   threshold whose Malaysian source has not been read carries `verified: false`
   and the UI prints a warning beside it. Nothing is guessed, and a society
   consensus is never presented as a ministry guideline.
2. **Every user-facing string** goes through `L(en, ms)` / `pick(v, lang)` in
   `src/i18n.js`. A bare string literal in a component is a bug.
3. **The engine is separate from the presentation.** `src/engine/*` are pure
   functions with no JSX and no React import. Read them without reading any UI
   code.
4. **Results are sorted by what needs acting on.** `src/engine/review.js`.
5. **The app never promises what it is not doing.** One flag drives both the
   collection behaviour and the privacy copy, so they cannot disagree.

---

## Privacy, in one paragraph

Everything a patient enters — medicines, results, photographs — is written to
**their own device** (`localStorage` for the record, IndexedDB for photographs)
and nowhere else. It is never uploaded. The app works with **no internet
connection**; the only parts that need one are the Google Maps, iQMS and MyUbat
links, which are clearly marked.

The name and IC number typed for the printed summary are held in **browser
memory only**, for the printout. They are never written to storage and never
transmitted. The screen says so next to the fields. This is verified in the
browser as part of the test run.

### What the hospital receives

A count of use. Nothing else. The complete data model is one file,
**`src/collection.js`**, so an ethics reviewer can read what leaves the device
without reading any UI code:

| field | what it is |
|---|---|
| `schema`, `app`, `appVersion` | constants, for versioning the sheet |
| `deviceCode` | 8 random characters from a CSPRNG, alphabet without I/O/0/1. Counts repeat devices; derived from nothing about the person |
| `sessionCode`, `isNewDevice`, `seq` | one app session, and the nth event in it |
| `dateLocal`, `partOfDay` | a date and one of five parts of day. **No clock time** |
| `lang` | `en` or `ms` |
| `action`, `tab`, `detail` | which part of the app was used. Closed vocabularies — free text cannot ride out inside them |
| `platform`, `screen`, `standalone`, `online` | four coarse buckets, not a user-agent string |
| `sessionDuration`, `tabsUsed`, `recordsHeld` | banded; `recordsHeld` is `0 / 1_4 / 5_9 / 10_plus`, never an exact count |

No name, IC, phone, email, address, date of birth, age, medicine, diagnosis,
allergy, result, measurement or photograph. Not banded — **absent**.

Three things make that hold rather than merely being asserted:

- It is an **allowlist**, not a blocklist. `buildRecord()` constructs a fresh
  object from named fields, so a field added to the app later cannot leak by
  accident; it would have to be added here by hand.
- Every quasi-identifier is **banded in the browser**, before it leaves.
- The **server refuses** a record containing an identifier (`400`) rather than
  stripping it. A stripped record would hide that a client tried to send one,
  and that is exactly the fact a reviewer needs to see.

### Two flags, both off by default

`VITE_COLLECTION_ENABLED` controls the UI. `COLLECTION_ENABLED` on the server
**authorises the write** and is the authoritative one: a client build shipped
with its own flag on still writes nothing while the server flag is off. That is
what makes *"ethics approval pending"* enforceable rather than a promise.

Consent is asked **once**, before any question is answered. **Declining is a
first-class outcome**: the tool and the printed summary behave identically
either way, and the patient is never asked again. This is an ethics requirement,
not a courtesy. Submission is automatic when a tab is opened rather than behind
a button — a button loses everyone who consented and did not press it, and you
cannot count what you lost — and a live status line in the footer says exactly
what has been sent, so it is not covert.

### The legal position

The controller is **HTPN, Ministry of Health Malaysia**, with Dr Naim as the
responsible officer. PDPA 2010 **s.3(1) exempts the Federal Government**, so
this app does not claim to store data "in accordance with the PDPA" — that would
be false. It states instead that **PDPA standards are applied voluntarily as a
minimum floor**, which is true, and a stronger undertaking than citing a statute
that does not bind you. What does bind a government hospital is named alongside
it: MOH data directives, medical confidentiality, and MREC/NMRR ethics approval
for any research use. Set `CONTROLLER_KIND = 'private'` in
`src/governance.js` and every string switches to the full statutory wording.

---

## Deploying

The repository's default branch is the one this lives on, so an import deploys
it as production with no branch to switch.

[**Import into Vercel**](https://vercel.com/new/import?s=https%3A%2F%2Fgithub.com%2Fppabnaim-cloud%2Fpatient_journey_by_htpn)

Vercel reads `vercel.json`, so framework, build command and output directory are
already set — accept the defaults. The first deploy needs **no environment
variables at all**: both collection flags default to off, so the app ships
collecting nothing, which is the correct state while no ethics submission
describes it.

Turn collection on later, once the sheet is ready and the governance question is
settled, by setting `COLLECTION_ENABLED=true`, `VITE_COLLECTION_ENABLED=true`,
`APPS_SCRIPT_URL` and `APPS_SCRIPT_SECRET` in **Settings → Environment
Variables**, then redeploying. `VITE_` variables are read at build time, so a
redeploy is required for that one to take effect — changing it without
rebuilding does nothing.

## Running it

```bash
npm install
npm run dev        # http://localhost:5173
npm run check      # engine + server refusal rules
npm run build      # vendors the OCR engine, then builds
```

Dependencies, on purpose: `react`, `react-dom`, `vite`, `@vitejs/plugin-react`,
plus `tesseract.js` and `@tesseract.js-data/eng` for tab 2. No Tailwind, no
component library, no state manager, no TypeScript, no test framework. The whole
stylesheet is one template string in `src/styles.js`.

### Where things are

```
src/engine/sources.js   every clinical number, with its citation. READ FIRST.
src/engine/anthro.js    BMI, waist. Pure functions.
src/engine/labs.js      blood results. Pure functions.
src/engine/review.js    assembles and sorts the findings (rule 4).
src/collection.js       EVERYTHING that leaves the device. One file.
src/governance.js       controller, legal position, ethics status, privacy copy.
src/i18n.js             every user-facing string, both languages.
src/App.jsx             the whole UI, one file, deliberately.
api/submit.js           the only write path. Imports the same allowlist.
apps-script/Code.gs     the Google Sheet end. Run setup() once.
```

### Setting up the Google Sheet

Open your sheet → **Extensions → Apps Script** → paste `apps-script/Code.gs` →
run `setup()` once. It creates the tabs, writes and formats the header row, adds
a README tab explaining what is and is not in the sheet, and prints a freshly
generated shared secret. Then deploy as a Web App ("Execute as: Me", "Who has
access: Anyone") and put the `/exec` URL and the secret into Vercel along with
`COLLECTION_ENABLED=true`. Full steps are in the comment at the top of that file.

`enableDailyDigest()` sends one email a day with the counts. The email route
lives in Apps Script rather than the serverless function because Apps Script can
send mail from inside the Workspace, and a serverless function cannot without
another third-party credential.

---

## Known gaps — read before deploying

1. **21 of the 23 map links are unnamed.** Two were supplied with their names
   (WCC and the Main Building); the rest were supplied as bare links, and the
   build environment could not reach `maps.app.goo.gl` to read what they point
   to. Guessing would break rule 1 — labelling a link "Pharmacy" when it might
   be the mortuary is exactly the failure that rule exists to prevent. They are
   therefore shown as "Location 1 … 21" with an on-screen note, and each link
   still opens the right place in Google Maps. **To fix:** fill in
   `DEPARTMENT_NAMES` in `src/data/wayfinding.js` and set `confirmed: true`.
   That array is the only thing that needs editing.

2. **No Malaysian CPG was read in this build.** The sandbox had no route to
   `moh.gov.my`. The BMI, waist, fasting glucose and HbA1c bands are quoted
   directly from WHO and IDF, which are named on screen; the Malaysian CPGs are
   named as the local authority that should govern them and are **not quoted**.
   Every affected threshold carries `verified: false` and the UI prints a
   warning beside it. **To fix:** read the CPGs, correct any band that differs,
   and set `verified: true` in `src/engine/sources.js`.

3. **OCR is an assist, not a scanner.** Printed pharmacy labels and lab
   printouts read reasonably; handwriting reads badly. Output is always a draft
   the patient confirms field by field, and is never written into the record
   unconfirmed. The engine, its wasm core and the English model are served from
   this app (about 10 MB, fetched only when someone actually uses OCR) so it
   works with no connection.

4. **No ethics submission describes this build.** Both flags are off by default
   and nothing is collected until that changes.
