/* ===========================================================================
   appreciation.js — the 2026 appreciation counts shown on the Feedback tab.

   WHY THIS FILE HOLDS COUNTS AND NOT A LINK TO THE SPREADSHEET
   HTPN asked for the master sheet to be linked directly. It must not be, and
   the reason is not the two columns that were flagged.

   PEMBERI and BENTUK PENGHARGAAN were named as confidential, and they are
   excluded. But the column that was asked FOR — LOKASI — carries the same
   kind of content in 12 of the 75 rows for 2026:

       "WAD 8B /DR FAIZA"            a named doctor
       "NEFRO-DR ELLIYIN & DR AZIM"  two named doctors
       "WAD 7B- SN NURITA"           a named staff nurse
       "UNIT KAUNSELING-PN MAISURAH" a named counsellor
       "WAD 6B-BED 21"               a ward and a bed number
       "WAD 7B-KATIL 25"             the same, in Malay

   A ward plus a bed number plus a date is a patient. A named nurse on a
   public screen is a staff member published without being asked. Neither
   belongs on a dashboard a patient opens, so LOKASI is normalised to the
   place alone before it is counted, and the result is what ships.

   AND THE LINK ITSELF
   A Google "publish to web" CSV serves every column of the published sheet
   to anyone holding the URL. If the app carried that URL, the two
   confidential columns would be one click away in any browser's network
   tab — leaving them out of the app's code would hide nothing. This build
   could not open the link to check what it returns (the container's proxy
   blocks docs.google.com), which is itself a reason not to wire a screen to
   something unseen.

   SO: the app reads a SUMMARY, never the master sheet. Two columns, a place
   and a count, with nothing in it that could identify anybody.
   apps-script/Appreciation.gs builds that summary from the master sheet,
   applying the same normalisation as below, and is the thing to publish.
   Set VITE_APPRECIATION_CSV to its published URL and the numbers refresh on
   their own; leave it unset and the figures below are shown, dated.
   ========================================================================= */

export const APPRECIATION_YEAR = 2026

/* Counted from SENARAI_PENGHARGAAN.xlsx, sheet "dec2025-2026", as supplied
   by HTPN. Rows dated 2026 only: 75 of them, from 21 January to 9 October
   2026. The two rows dated December 2025 are not included — this is a 2026
   figure and mixing years would overstate it. */
export const AS_AT = '2026-10-09'
export const SOURCE_NOTE = {
  en: 'Counted from HTPN’s own appreciation register. Names and the form each appreciation took are not read by this app.',
  ms: 'Dikira daripada daftar penghargaan HTPN sendiri. Nama dan bentuk setiap penghargaan tidak dibaca oleh aplikasi ini.'
}

/* One row per place. A row recording more than one place is counted once,
   under the first named, so the total stays 75 rather than inflating past
   the number of appreciations actually received. */
export const APPRECIATION_2026 = [
  { loc: 'WAD 7B', n: 30 },
  { loc: 'WAD 8B', n: 6 },
  { loc: 'WAD 7A', n: 5 },
  { loc: 'WAD 6B', n: 5 },
  { loc: 'LABOUR ROOM', n: 2 },
  { loc: 'WAD 72', n: 2, queried: true },
  { loc: 'WAD 8A', n: 1 },
  { loc: 'WAD 6A', n: 1 },
  { loc: 'WAD 3', n: 1 },
  { loc: 'WAD 2', n: 1 },
  { loc: 'PICU', n: 1 },
  { loc: 'NICU', n: 1 },
  { loc: 'ED', n: 1 },
  { loc: 'ED-RESUS', n: 1 },
  { loc: 'ED-WCC', n: 1 },
  { loc: 'ED-BU', n: 1 },
  { loc: 'EPAU', n: 1 },
  { loc: 'PAC', n: 1 },
  { loc: 'WCC', n: 1 },
  { loc: 'NEFRO', n: 1 },
  { loc: 'OMFS', n: 1 },
  { loc: 'MOPD', n: 1 },
  { loc: 'JABATAN SOPD', n: 1 },
  { loc: 'KLINIK PSIKIATRIK', n: 1 },
  { loc: 'KLINIK PERGIGIAN PAED', n: 1 },
  { loc: 'PAED DENTAL -WCC', n: 1 },
  { loc: 'JABATAN SAJIAN', n: 1 },
  { loc: 'JAB DIETETIK', n: 1 },
  { loc: 'UNIT KAUNSELING', n: 1 },
  { loc: 'WARGA KERJA HTPN', n: 1 },
  { loc: 'WARGA KERJA WCC', n: 1 }
]

/* "WAD 72" is almost certainly a typing slip for 7A or 7B, but which one
   changes two counts, so it is left as written and marked rather than
   guessed. Same rule as everywhere else in this app. */
export const QUERIED_NOTE = {
  en: 'One entry is recorded as "WAD 72" in the register. It is shown as written rather than assigned to a ward this app would be guessing at.',
  ms: 'Satu catatan direkodkan sebagai “WAD 72” dalam daftar. Ia dipaparkan sebagaimana ditulis dan tidak diletakkan di bawah mana-mana wad secara andaian.'
}

/* The TikTok video HTPN supplied now lives in src/data/gallery.js, with
   the Threads posts: this file counts appreciation, the gallery shows it. */

export const TOTAL_2026 = APPRECIATION_2026.reduce((n, r) => n + r.n, 0)

/* --- parsing the live summary, when one is configured --------------------
   Two columns, a place and a count. Anything else in the file is ignored
   rather than rendered: a summary that has grown an extra column is a
   summary somebody has changed, and this screen is not the place to find
   out what they put in it. */
export function parseSummaryCsv (text) {
  const rows = []
  for (const line of String(text || '').split(/\r?\n/)) {
    if (!line.trim()) continue
    const cells = line.match(/("([^"]|"")*"|[^,]*)(,|$)/g) || []
    const clean = cells.map(c => c.replace(/,$/, '').replace(/^"|"$/g, '').replace(/""/g, '"').trim())
    const loc = clean[0]
    const n = Number(clean[1])
    if (!loc || !Number.isFinite(n) || n < 0) continue      // header and junk
    if (/^(lokasi|location|place)$/i.test(loc)) continue
    rows.push({ loc: loc.toUpperCase(), n: Math.round(n) })
  }
  return rows.sort((a, b) => b.n - a.n || a.loc.localeCompare(b.loc))
}
