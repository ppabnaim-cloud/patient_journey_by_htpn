/* ===========================================================================
   Appreciation.gs — builds a publishable SUMMARY from the appreciation
   register, so the app can show the counts without the register itself ever
   being exposed.

   THE PROBLEM THIS SOLVES
   "Publish to web" serves every column of the published sheet to anyone who
   has the URL. Publishing SENARAI PENGHARGAAN therefore publishes PEMBERI
   and BENTUK PENGHARGAAN, whatever an app chooses to display. It also
   publishes LOKASI, which in the 2026 data carries a named doctor, a named
   staff nurse, a named counsellor, or a ward-and-bed in 12 of 75 rows.

   So nothing here publishes the register. This script reads it, strips the
   names and bed numbers out of LOKASI, counts by place and year, and writes
   a separate tab holding two columns and no one's name. THAT tab is the one
   to publish.

   HOW TO USE IT
   1. Open the appreciation spreadsheet. Extensions > Apps Script.
   2. Paste this in. Save. Set YEAR below if it is no longer 2026.
   3. Run buildSummary(). Approve the prompt. It creates a "ringkasan" tab.
   4. Check the tab. It should contain places and numbers, nothing else.
   5. File > Share > Publish to web. Choose the "ringkasan" SHEET — not
      "Entire document". Format: CSV. Publish, and copy the URL.
   6. Put that URL in the app's .env as VITE_APPRECIATION_CSV.
   7. Optional: run enableWeeklyRefresh() so the summary keeps itself current.

   Step 5 is the one that matters. Publishing the entire document undoes
   everything above it.
   ========================================================================= */

var YEAR         = 2026;
var SHEET_SOURCE = 'dec2025-2026';   // the register
var SHEET_OUT    = 'ringkasan';      // the summary this script writes
var COL_DATE     = 3;                // TARIKH TERIMA   (1-based)
var COL_LOCATION = 4;                // LOKASI

/* PEMBERI (5) and BENTUK PENGHARGAAN (6) are deliberately absent from the
   list above and are never read by this script. */

function buildSummary() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var src = ss.getSheetByName(SHEET_SOURCE);
  if (!src) throw new Error('No sheet named "' + SHEET_SOURCE + '". Set SHEET_SOURCE.');

  var last = src.getLastRow();
  var values = src.getRange(1, 1, last, Math.max(COL_DATE, COL_LOCATION)).getValues();

  var counts = {};
  var total = 0, earliest = null, latest = null;

  for (var i = 0; i < values.length; i++) {
    var d = values[i][COL_DATE - 1];
    if (!(d instanceof Date) || d.getFullYear() !== YEAR) continue;
    var place = normaliseLocation(values[i][COL_LOCATION - 1]);
    counts[place] = (counts[place] || 0) + 1;
    total++;
    if (!earliest || d < earliest) earliest = d;
    if (!latest || d > latest) latest = d;
  }

  var rows = [];
  for (var k in counts) if (Object.prototype.hasOwnProperty.call(counts, k)) rows.push([k, counts[k]]);
  rows.sort(function (a, b) { return b[1] - a[1] || (a[0] < b[0] ? -1 : 1); });

  var out = ss.getSheetByName(SHEET_OUT) || ss.insertSheet(SHEET_OUT);
  out.clear();
  out.getRange(1, 1, 1, 2).setValues([['LOKASI', 'JUMLAH']]).setFontWeight('bold');
  if (rows.length) out.getRange(2, 1, rows.length, 2).setValues(rows);
  out.setFrozenRows(1);

  /* The as-at line goes in a cell well clear of the two data columns, so the
     CSV the app reads stays two columns wide and the parser ignores it. */
  out.getRange(1, 4).setValue('as at ' + fmt(latest) + ' — ' + total + ' in ' + YEAR +
                              ' (from ' + fmt(earliest) + '). Rebuilt ' + fmt(new Date()) + '.');

  Logger.log('%s places, %s appreciations in %s. Publish the "%s" SHEET as CSV — not the whole document.',
             rows.length, total, YEAR, SHEET_OUT);
}

/* Reduces a free-text LOKASI to the place alone.
     "WAD 8B /DR FAIZA"             -> WAD 8B
     "WAD 7B-KATIL 25"              -> WAD 7B
     "NEFRO-DR ELLIYIN & DR AZIM"   -> NEFRO
     "WAD 7B/PAC/LABOR ROOM"        -> WAD 7B   (first place; counted once)
   Counting a multi-place row under each place would push the total above the
   number of appreciations actually received, so the first is taken and the
   row is counted once. */
function normaliseLocation(v) {
  var s = String(v == null ? '' : v).toUpperCase().trim();
  if (!s) return 'TIDAK DINYATAKAN';
  s = s.replace(/LABOR/g, 'LABOUR');
  /* Anything from a person's title onwards is dropped, titles included. */
  s = s.replace(/\s*[-\/,&]?\s*\b(DR|SN|PN|EN|MR|MRS|CIK|PUAN|ENCIK|MATRON|SISTER|DOKTOR|NURSE|JURURAWAT|STAF)\b[\s\S]*$/i, '');
  /* And from a bed number onwards. */
  s = s.replace(/\s*[-\/,]?\s*\b(KATIL|BED)\b\s*\.?\s*\d*[\s\S]*$/i, '');
  s = s.split(/[\/,&]/)[0];
  s = s.replace(/\s+/g, ' ').replace(/^[\s\-.,]+|[\s\-.,]+$/g, '');
  return s || 'TIDAK DINYATAKAN';
}

function fmt(d) {
  if (!(d instanceof Date)) return '';
  return Utilities.formatDate(d, Session.getScriptTimeZone(), 'yyyy-MM-dd');
}

function enableWeeklyRefresh() {
  disableWeeklyRefresh();
  ScriptApp.newTrigger('buildSummary').timeBased().onWeekDay(ScriptApp.WeekDay.MONDAY).atHour(7).create();
  Logger.log('The summary will rebuild every Monday morning.');
}

function disableWeeklyRefresh() {
  var t = ScriptApp.getProjectTriggers();
  for (var i = 0; i < t.length; i++) {
    if (t[i].getHandlerFunction() === 'buildSummary') ScriptApp.deleteTrigger(t[i]);
  }
}

/* Run this to see what normaliseLocation does to the awkward rows before
   trusting it with the real ones. */
function testNormalise() {
  var cases = ['WAD 8B /DR FAIZA', 'WAD 7B-KATIL 25', 'NEFRO-DR ELLIYIN & DR AZIM',
               'WAD 7B/PAC/LABOR ROOM', 'UNIT KAUNSELING-PN MAISURAH', 'WAD 6B-BED 21',
               'WAD 7A- DOKTOR & NURSE', 'WCC, HTPN, JAB.SAJIAN', '  wad 7b  ', ''];
  for (var i = 0; i < cases.length; i++) {
    Logger.log('%s  ->  %s', JSON.stringify(cases[i]), normaliseLocation(cases[i]));
  }
}
