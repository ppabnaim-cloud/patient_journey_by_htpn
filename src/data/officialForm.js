/* ===========================================================================
   officialForm.js — HTPN's own feedback form, and what routes to it.

   WHY THIS CHANGES THE DESIGN FOR THE BETTER
   The biggest hole in the in-app form was never technical. It was that
   nobody had been named as the person who reads it, and within what time —
   so a complaint typed into this app would have gone into a spreadsheet with
   no owner and no service standard behind it. That is worse for the patient
   than no form at all.

   HTPN's official form does not have that problem: it already lands with the
   Public Relations Office, which already handles these. So a complaint, and
   anything asking for something to be put right, goes THERE. The app does
   not become a second, unmonitored complaints inbox competing with the one
   that works.

   What stays in the app is appreciation: it feeds the board that encourages
   the next patient to say something, and it carries the consent question
   about HTPN sharing it on Facebook, which the official form does not ask.

   Change ROUTE below to move a category from one to the other. Both halves
   exist and both are tested.

   THE PREFILL IS NOT WIRED UP YET, AND WILL NOT BE GUESSED
   A Google Form can be opened with its answers already filled in, using the
   entry IDs that form assigns to each question. This build could not open
   forms.gle — the container's proxy refuses every Google domain — so the IDs
   are not known, and inventing them would produce a link that silently drops
   every answer into nothing.

   To supply them, in the form: ⋮ (top right) > Get pre-filled link > type a
   recognisable word into each box > Get link > Copy link. That URL contains
   every entry ID. Paste it in as PREFILL_SAMPLE below and fill in ENTRIES,
   and the app will carry across what the patient already chose. Until then
   the form opens empty, which works today and misleads nobody.
   ========================================================================= */

export const OFFICIAL_FORM = {
  /* Supplied by HTPN. Not found, not derived — this is the address given. */
  url: 'https://forms.gle/J4sdRmTrUiDW7kQC6',
  source: { en: 'Supplied by HTPN', ms: 'Diberikan oleh HTPN' },
  goesTo: {
    en: 'Public Relations Office, HTPN',
    ms: 'Unit Perhubungan Awam, HTPN'
  },
  lead: {
    en: 'This opens the hospital’s own form. It goes straight to the Public Relations Office, which is the unit that looks into these and replies.',
    ms: 'Ini akan membuka borang rasmi hospital. Ia terus sampai kepada Unit Perhubungan Awam, iaitu unit yang menyiasat dan memberi maklum balas.'
  },
  /* Said plainly, because the patient is about to leave an app that has
     promised them the opposite on every other screen. */
  leaving: {
    en: 'It opens outside this app, on Google Forms. What you type there is between you and HTPN, and this app neither sees it nor keeps a copy.',
    ms: 'Ia dibuka di luar aplikasi ini, pada Google Forms. Apa yang anda taip di sana adalah antara anda dan HTPN; aplikasi ini tidak melihatnya dan tidak menyimpan salinan.'
  },
  open: { en: 'Open the hospital form', ms: 'Buka borang rasmi hospital' }
}

/* Where each kind of feedback goes.
     'official' — HTPN's form, straight to the Public Relations Office
     'app'      — the form in this app, which needs the Sheet and the two
                  flags described in apps-script/Feedback.gs */
export const ROUTE = {
  appreciation: 'app',
  improvement: 'official',
  complaint: 'official'
}

/* Paste the "Get pre-filled link" URL here when you have it. Kept beside
   ENTRIES so the two can never disagree about which form they describe. */
export const PREFILL_SAMPLE = null

/* Map this app's fields onto that form's entry IDs, e.g.
     { areaId: 'entry.1234567890', message: 'entry.987654321' }
   Empty means no prefill, and buildPrefillUrl returns the plain form URL. */
export const ENTRIES = {}

export function prefillConfigured () {
  return Object.keys(ENTRIES).length > 0
}

/* Only the fields that are both mapped AND filled in travel. A blank answer
   is left out rather than sent as an empty string, so the form's own
   required-field checks still behave as HTPN set them up. */
export function buildPrefillUrl (values) {
  if (!prefillConfigured()) return OFFICIAL_FORM.url
  const base = OFFICIAL_FORM.url.replace(/\/viewform.*$/, '/viewform')
  const q = new URLSearchParams({ usp: 'pp_url' })
  for (const [field, entry] of Object.entries(ENTRIES)) {
    const v = values?.[field]
    if (v === null || v === undefined || v === '') continue
    q.set(entry, String(v))
  }
  return `${base}?${q.toString()}`
}
