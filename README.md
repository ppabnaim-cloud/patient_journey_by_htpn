# Patient Journey by HTPN

A bilingual (Bahasa Melayu / English) companion for patients of **Hospital Tengku
Permaisuri Norashikin, Kajang**. It keeps a patient's own medicines, results and
measurements **on their own device**, helps them find their way around the two
sites, and points them at iQMS and MyUbat.

**Ke Arah 1 Pesakit 1 Rekod — Towards 1 Patient 1 Record.**

*Prototype design by Dr Naim, HTPN.*

The theme line in the header opens a notice for patients seen at more than one
hospital: no single one of them holds the whole record, so ask the doctor or
pharmacist at each place to help update this app, or photograph the medicine
list they hand over. It also states plainly that **One Citizen One Record is a
Ministry of Health programme and this app is not part of it** — this is a
record the patient keeps themselves, useful precisely because their hospitals
are not yet joined up.

---

## What it does, tab by tab

| | Tab | What it holds |
|---|---|---|
| 1 | **My Journey** | *Overview*: four stat tiles, then HbA1c, fasting glucose, blood pressure, steps, energy burned, weight and BMI trends, and medicines by indication. *Needs attention*: the findings, warning signs first. *Reviewed*: findings with nothing to act on, folded but never deleted. Prints a clinic summary. |
| 2 | **My Records** | Seven numbered stations — medicines, active problems, allergies, operations, blood results, imaging reports, walking and activity — shown as a pipeline so progress is visible. Medicines carry a start date and either a supply-until date or a stopped-on date; a supply date that has passed is raised on the dashboard. Photograph a document, upload one, or type it in. |
| 3 | **Monitoring** | The readings a patient takes themselves: weight, height, BMI, waist, blood pressure and home fasting blood sugar, each followed over time. A blood pressure at or above 180/110 is ranked a warning and sorts to the top. Fasting sugar is written to the same store as a laboratory result, so home and lab readings share one chart. |
| 4 | **Finding Your Way** | The two sites with photographs, and 21 further points. Every location offers *Get directions* — which opens Google Maps routing from wherever the phone is, with no origin in the URL so this app never sees a coordinate — and *Exact location*, the precise link HTPN supplied. |
| 5 | **Queue Number** | The iQMS poster and the live queue link for HTPN. |
| 6 | **Medicine Delivery** | MyUbat's two services (Appointment System and Medicine By Post), the delivery charge stated plainly, a pictogram list of what it must **not** be used for — cold chain above all — and the official 8-page poster set from Program Perkhidmatan Farmasi. |
| 8 | **#gayahidupsihatHTPN** | Sharing only: it opens the hashtag on the patient's own platform and hands them their device's share sheet. The walking log itself lives in My Records, where the rest of the record is. It hosts nothing. |
| 7 | **The Public's Role** | All 12 posters designed by Dr Naim plus the Ministry's Langkah Sihat poster, grouped by the five roles; and *Emergency, or not?*, the two triage lists rendered bilingually from the HTPN patient-guidance poster. |

Everything is in both languages, clinical text included.

**The no-scroll rule is a tablet rule.** Every screen fits a 10-inch tablet in
portrait without scrolling: lists page, long sections split into steps. A phone
is different. Safari gives about 390×664 once its own chrome is accounted for —
roughly 180px less than the 390×844 these screens were first checked against —
and holding the rule at that height does not make content fit, it makes it
overlap. A patient cannot scroll to recover a Save button sitting underneath the
tab bar. So on a phone the header, tab bar and status line stay fixed and the
content pane between them scrolls, which is what a phone app does anyway.
`scripts`-adjacent harnesses check the two contracts separately: the strict
no-scroll rule at 800×1280, and at 390×664 and 360×600 that the shell fits, that
nothing paints over the tab bar, and that cards stack rather than overlap.

---

### Pointing patients at other companies' apps

The walking tab links to Strava and BookDoc because some patients already use
one. Neither is required — the on-device log works alone — and the screen says
so. It also says plainly that these are **other companies' apps, not HTPN's**,
that what they collect is governed by their own privacy policies and not this
one, and that an activity app usually records where you walked. A hospital
placing a commercial app in front of patients should say that out loud rather
than let the placement imply endorsement.

### Who can see what a patient posts

Asked directly, and answered on the screen rather than only here: not this app,
and not HTPN through this app — there is no feed and no store of anyone's
posts. Whether anyone else can see a post is decided by that patient's own
account settings on that platform, not by the hashtag: a hashtag on a private
account is still private, and on a public account it is public to everyone, not
only to patients. The tab also warns, before they post, that a photograph can
carry more than intended — a face, a child, a ward, a name on a wristband.

### The campaign tab hosts nothing, on purpose

`#gayahidupsihatHTPN` encourages patients to post, but the app stores,
displays and moderates none of it. Three reasons, in order of weight: a
feature that publishes patient content makes "everything stays on your
device" false; patient-submitted content on a Ministry-branded surface makes
HTPN its publisher, with the moderation and takedown duties that implies; and
a hospital-branded step target tells every patient to walk further, including
the ones for whom that is unsafe. So the tab sends them outward — to the
hashtag on their own platform, through their own device's share sheet — and
keeps the walking log entirely on-device like the rest of the record. The
reasoning is written out at the top of `src/data/campaign.js`.

### Why there is no correlation between steps, energy and weight

Asked for, and deliberately not built. The three series are shown on a shared
date axis so a patient can read them together — but the app computes no
relationship between them, and here is why it would be wrong to:

- A month from one person is about thirty points, and consecutive weights are
  not independent of each other. That is not enough to separate a signal.
- Weight moves with food, fluid, illness and medicines at least as much as
  with walking, and none of those are recorded here to adjust for.
- A watch's energy figure is an **estimate** the device computes from movement,
  heart rate and assumptions about the wearer's body. Two watches worn on the
  same day routinely disagree. Correlating an estimate of that quality with
  weight and printing a number would dress a guess as a finding.

So the app shows the three trends, says plainly that it does not calculate a
relationship, and leaves the reading to the patient and their clinician.

### What the dashboard plots, and what it refuses to

A single patient's own record supports stat tiles, a line per measurement
followed over time, and one part-to-whole split. It does **not** support a
histogram, a scatter plot or a heatmap: those need a population, or two
variables measured across many subjects. Eight blood tests from one person
cannot make a distribution, and drawing one would invite a patient to read a
pattern that is not in the data. So they are not there.

The categorical palette was validated against this app's own card surfaces in
both light and dark mode — lightness band, chroma floor, adjacent-pair CVD
separation and normal-vision floor all pass. Light mode raises a contrast
warning on three slots, so every chart ships direct labels and a table view.

**An empty dashboard reads zero.** An earlier build filled it with a labelled
worked example so the screen was not blank. That was wrong and has been
removed: invented numbers on a clinical screen are dangerous even behind a
label, because the label can be missed and a figure cannot be unseen. The
dashboard now shows the patient's own record and nothing else, and the test
suite asserts that no invented value appears on an empty one.

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

1. **13 of the 21 department links are still unnamed.** Locations 1–8 were
   named by HTPN and are live. The remaining 13 were supplied as bare links,
   and the build environment could not reach `maps.app.goo.gl` to read what
   they point to. Guessing would break rule 1 — labelling a link "Pharmacy"
   when it might be the mortuary is exactly the failure that rule exists to
   prevent. They show as "Location N" with an on-screen note, and each link
   still opens the right place in Google Maps. **To fix:** fill in
   `DEPARTMENT_NAMES` in `src/data/wayfinding.js` and set `confirmed: true`.

   Department tiles carry **icons, not photographs**. A stock or generated
   picture of "a radiology department" is a picture of some other hospital, and
   on a way-finding screen a patient would read it as a landmark to look for.
   Real photographs of these departments would be better and drop straight in.

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

4. **The Minister's photograph is a press agency image.** It is bundled and
   credited on screen to Bernama via New Straits Times. Press photographs are
   licensed: get formal permission from Bernama / NST before this goes beyond
   a prototype.

   The headline, byline and timestamp were supplied verbatim by HTPN and are
   rendered as exact. No speech is quoted — nst.com.my could not be opened
   from the build environment, so `ARTICLE.quote` is `null` and the UI omits
   that block entirely. The headline already carries the Minister's phrase in
   quotation marks and is presented as the headline it is, not dressed up as a
   sentence he was heard to say. Paste a verified sentence into `ARTICLE.quote`
   and it renders, styled and attributed.

5. **No ethics submission describes this build.** Both flags are off by default
   and nothing is collected until that changes.

6. **The emergency/non-emergency poster is a low-resolution recovery.** The
   only copy available to this build was extracted from a screenshot, so it is
   offered as a secondary view and labelled as such. The two triage lists
   themselves are rendered as bilingual text, which is better than the image in
   any case: the poster is Malay only, and text scales and can be read aloud.
   Replacing `public/posters/emergency-or-not-lowres.jpg` with the original
   artwork needs no code change.

7. **The Main Building photograph shows the pre-rebrand "Hospital Kajang"
   signage.** That is what is actually on the gate, so it is arguably the more
   useful landmark — but it is worth a deliberate decision rather than an
   accident.

8. **The triage and exclusion pictograms are drawn, not photographed.** A
   picture of "a stroke" or "a snake bite" is a picture of one person having
   one event, and on a triage screen a patient matches themselves against what
   they see. A symbol names the category and claims nothing about how it looks.
   They are in `src/data/glyphs.js`, one array of SVG paths each.
