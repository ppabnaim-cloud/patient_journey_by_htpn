/* ===========================================================================
   Code.gs — Google Apps Script Web App for "Patient Journey by HTPN".

   WHY APPS SCRIPT AND NOT THE SHEETS API
   The Sheets API needs a service account, which needs Google Cloud Platform.
   Government Workspace tenants very often have GCP disabled, so that route is
   blocked before it starts. Apps Script is a WORKSPACE service, not Cloud
   Platform, and usually survives that block. That is the only reason this file
   exists; if GCP is available to you, the service-account route in
   api/submit.js is the better one.

   SECURITY
   A Web App deployed with access "Anyone" is reachable by URL alone. The URL
   is not a secret: it travels in logs, link previews and browser history. So
   this script refuses any request whose shared secret does not match, and the
   secret lives in Script Properties, never in this file.

   SETUP — three minutes
   1. Open your Google Sheet. Extensions > Apps Script. Paste this file in,
      replacing whatever is there.
   2. Run the function setup() once. Approve the permission prompt. It creates
      the tabs, writes the header row, formats it and prints a freshly
      generated secret into the execution log. Copy that secret.
   3. Deploy > New deployment > type "Web app".
         Execute as:        Me
         Who has access:    Anyone
      Copy the /exec URL it gives you.
   4. In Vercel > Project > Settings > Environment Variables, set:
         APPS_SCRIPT_URL     = the /exec URL from step 3
         APPS_SCRIPT_SECRET  = the secret from step 2
         COLLECTION_ENABLED  = true
      Nothing is written until COLLECTION_ENABLED is true. That is deliberate:
      it is the switch that keeps collection off while ethics approval is
      pending, and it lives on the server so a client build cannot bypass it.
   5. Optional: run enableDailyDigest() to get one email a day with the counts.
      Run disableDailyDigest() to stop it.

   After changing this file you must Deploy > Manage deployments > edit the
   existing deployment > New version. Saving alone does not update the live
   Web App.
   ========================================================================= */

var SHEET_DATA = 'usage';
var SHEET_README = 'README';
var SCHEMA = 'pj-htpn-usage-1';

/* Must match OUTGOING_FIELDS in src/collection.js, in the same order. The
   server sends the order with every request and this script checks it, so a
   mismatch fails loudly instead of silently writing values into wrong columns. */
var FIELDS = [
  'schema', 'app', 'appVersion', 'deviceCode', 'sessionCode', 'isNewDevice',
  'dateLocal', 'partOfDay', 'lang', 'action', 'tab', 'detail', 'seq',
  'platform', 'screen', 'standalone', 'online', 'sessionDuration',
  'tabsUsed', 'recordsHeld'
];

/* --------------------------------------------------------------------------
   setup() — run once, by hand. Prepares the sheet so you never rename a tab
   or type a header by hand.
   ----------------------------------------------------------------------- */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Open this script from inside the Google Sheet (Extensions > Apps Script).');

  var sheet = ss.getSheetByName(SHEET_DATA) || ss.insertSheet(SHEET_DATA);
  var header = ['receivedAt'].concat(FIELDS);
  sheet.getRange(1, 1, 1, header.length).setValues([header]);
  sheet.getRange(1, 1, 1, header.length)
       .setFontWeight('bold')
       .setBackground('#1f3864')
       .setFontColor('#ffffff');
  sheet.setFrozenRows(1);
  for (var c = 1; c <= header.length; c++) sheet.autoResizeColumn(c);

  var readme = ss.getSheetByName(SHEET_README) || ss.insertSheet(SHEET_README);
  readme.clear();
  readme.getRange(1, 1, 12, 2).setValues([
    ['Patient Journey by HTPN — usage counts', ''],
    ['', ''],
    ['What is in this sheet', 'A count of which parts of the app were opened. One row per event.'],
    ['What is NOT in this sheet', 'No name, no IC, no phone, no email, no address, no date of birth, no age,'],
    ['', 'no medicine, no diagnosis, no allergy, no result, no measurement, no photograph.'],
    ['', 'The server refuses any record containing those rather than removing them.'],
    ['deviceCode', 'A random 8-character code minted on the device. It counts repeat devices.'],
    ['', 'It is not derived from anything about the person and cannot be reversed.'],
    ['Banding', 'Times are a date plus a part of day. Durations and counts are ranges.'],
    ['Controller', 'HTPN, Ministry of Health Malaysia. PDPA standards applied voluntarily'],
    ['', 'as a minimum floor; MREC/NMRR ethics approval governs any research use.'],
    ['Schema', SCHEMA]
  ]);
  readme.getRange(1, 1).setFontWeight('bold').setFontSize(14);
  readme.getRange(1, 1, 12, 1).setFontWeight('bold');
  readme.setColumnWidth(1, 220);
  readme.setColumnWidth(2, 640);

  var props = PropertiesService.getScriptProperties();
  var secret = props.getProperty('SHARED_SECRET');
  if (!secret) {
    secret = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '').slice(0, 8);
    props.setProperty('SHARED_SECRET', secret);
  }

  Logger.log('--------------------------------------------------------');
  Logger.log('Sheet prepared. Tabs: "%s" and "%s".', SHEET_DATA, SHEET_README);
  Logger.log('APPS_SCRIPT_SECRET = %s', secret);
  Logger.log('Copy that into Vercel, then deploy this script as a Web App.');
  Logger.log('--------------------------------------------------------');
  return secret;
}

/* Prints the secret again without changing it. */
function showSecret() {
  var s = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
  Logger.log(s ? 'APPS_SCRIPT_SECRET = ' + s : 'No secret yet. Run setup() first.');
  return s;
}

/* Mints a new secret and invalidates the old one. Update Vercel straight
   after running this, or writes will start failing. */
function rotateSecret() {
  var secret = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '').slice(0, 8);
  PropertiesService.getScriptProperties().setProperty('SHARED_SECRET', secret);
  Logger.log('NEW APPS_SCRIPT_SECRET = %s — update Vercel now.', secret);
  return secret;
}

/* --------------------------------------------------------------------------
   doPost — the endpoint. api/submit.js has already validated the record
   against the allowlist; this checks the secret, the schema and the column
   order, then appends.
   ----------------------------------------------------------------------- */
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) return reply(400, 'no_body');

    var body;
    try { body = JSON.parse(e.postData.contents); } catch (err) { return reply(400, 'bad_json'); }

    var expected = PropertiesService.getScriptProperties().getProperty('SHARED_SECRET');
    if (!expected) return reply(500, 'secret_not_configured');
    if (!body.secret || !constantTimeEquals(String(body.secret), expected)) {
      return reply(403, 'bad_secret');
    }

    if (body.schema !== SCHEMA) return reply(400, 'wrong_schema');

    if (!body.fields || body.fields.length !== FIELDS.length) return reply(400, 'field_count_mismatch');
    for (var i = 0; i < FIELDS.length; i++) {
      if (body.fields[i] !== FIELDS[i]) return reply(400, 'field_order_mismatch_at_' + i);
    }

    if (!body.row || body.row.length !== FIELDS.length) return reply(400, 'row_length_mismatch');

    /* A value with a leading = would be read as a formula by Sheets. Prefix it
       so it is stored as the text it is. */
    var row = [new Date()];
    for (var j = 0; j < body.row.length; j++) {
      var v = String(body.row[j] === null || body.row[j] === undefined ? '' : body.row[j]);
      if (v.charAt(0) === '=' || v.charAt(0) === '+' || v.charAt(0) === '@') v = "'" + v;
      row.push(v.slice(0, 200));
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      var sheet = ss.getSheetByName(SHEET_DATA);
      if (!sheet) return reply(500, 'run_setup_first');
      sheet.appendRow(row);
    } finally {
      lock.releaseLock();
    }

    return reply(200, null, true);
  } catch (err) {
    return reply(500, 'error:' + (err && err.message ? err.message : String(err)));
  }
}

/* A GET returns a deliberately uninformative page. The URL is not a secret,
   so this should not confirm what sits behind it. */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: false, reason: 'post_only' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function reply(status, reason, ok) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: ok === true, status: status, reason: reason || null }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* Compares in time independent of how early the two strings diverge, so the
   secret cannot be recovered one character at a time by timing the replies. */
function constantTimeEquals(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* --------------------------------------------------------------------------
   Optional daily digest. Apps Script can send mail from inside the Workspace,
   which is why the email fallback lives here rather than in the serverless
   function — that would need yet another third-party credential.
   ----------------------------------------------------------------------- */
function enableDailyDigest() {
  disableDailyDigest();
  ScriptApp.newTrigger('sendDailyDigest').timeBased().atHour(7).everyDays(1).create();
  Logger.log('Daily digest on, around 07:00. It goes to %s', Session.getEffectiveUser().getEmail());
}

function disableDailyDigest() {
  var all = ScriptApp.getProjectTriggers();
  for (var i = 0; i < all.length; i++) {
    if (all[i].getHandlerFunction() === 'sendDailyDigest') ScriptApp.deleteTrigger(all[i]);
  }
  Logger.log('Daily digest off.');
}

function sendDailyDigest() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_DATA);
  if (!sheet || sheet.getLastRow() < 2) return;

  var values = sheet.getRange(2, 1, sheet.getLastRow() - 1, FIELDS.length + 1).getValues();
  var dateCol = FIELDS.indexOf('dateLocal') + 1;
  var tabCol = FIELDS.indexOf('tab') + 1;
  var deviceCol = FIELDS.indexOf('deviceCode') + 1;

  var yesterday = Utilities.formatDate(new Date(Date.now() - 86400000), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  var devices = {}, tabs = {}, events = 0;
  for (var i = 0; i < values.length; i++) {
    if (String(values[i][dateCol]) !== yesterday) continue;
    events++;
    devices[values[i][deviceCol]] = true;
    var t = values[i][tabCol];
    tabs[t] = (tabs[t] || 0) + 1;
  }
  if (!events) return;

  var lines = ['Patient Journey by HTPN — ' + yesterday, '',
               'Devices: ' + Object.keys(devices).length,
               'Events:  ' + events, '', 'By tab:'];
  Object.keys(tabs).sort(function (a, b) { return tabs[b] - tabs[a]; })
        .forEach(function (k) { lines.push('  ' + k + ': ' + tabs[k]); });
  lines.push('', 'Counts of use only. No patient information is held in this sheet.');

  MailApp.sendEmail(Session.getEffectiveUser().getEmail(),
                    'Patient Journey by HTPN — usage ' + yesterday,
                    lines.join('\n'));
}
