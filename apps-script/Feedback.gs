/* ===========================================================================
   Feedback.gs — the Google Apps Script endpoint for the feedback form.

   THIS IS A SECOND, SEPARATE SCRIPT AND A SECOND, SEPARATE SPREADSHEET
   Code.gs receives usage counts and nothing else. This one receives names,
   emails, free text and photographs. Do NOT put them in the same Sheet:
   they have different audiences, different retention and different
   consequences if the link is forwarded to the wrong person. Two Sheets,
   two deployments, two secrets.

   SET-UP, ONCE
   1. Create a NEW Google Sheet. Extensions > Apps Script.
   2. Paste this file in. Save.
   3. Run setup(). Approve the permissions prompt. It creates the tabs, the
      Drive folder for photographs, the README, and mints a secret.
   4. Run showSecret() and copy what it logs.
   5. Deploy > New deployment > Web app.
        Execute as:        Me
        Who has access:    Anyone
      "Anyone" is what lets a patient's browser reach it. The secret is what
      stops anything else writing to the Sheet — see the warning below.
   6. Put the deployment URL and the secret in the app's .env:
        VITE_FEEDBACK_URL=https://script.google.com/macros/s/..../exec
        VITE_FEEDBACK_SECRET=....
        VITE_FEEDBACK_ENABLED=true
   7. In this script, set FEEDBACK_ENABLED to true. Both must be true before
      a single submission is written. Either one set to false stops it.

   THE WARNING, AND IT IS A REAL ONE
   The browser holds the secret, so anyone who opens the app can read it out
   of the bundle. It prevents accidents and casual traffic; it does not stop
   somebody determined from posting junk into the Sheet. If HTPN needs more
   than that, the submission has to go through a server that holds the
   secret — the Vercel function in api/ is already shaped for exactly this.
   Decide which before this is given to patients.

   AND THE OTHER ONE
   This Sheet will hold named patient complaints and photographs taken inside
   a hospital. PDPA 2010 does not apply to a government body (s.3(1)), so
   the instrument that governs it is the Ministry's own ICT security policy
   and the hospital's data owner, not this script. Who may open the Sheet,
   how long rows are kept, and where the Drive folder lives are decisions for
   HTPN to take and record before the form is put in front of a patient.
   ========================================================================= */

var FEEDBACK_ENABLED = false;          // the server-side half of the switch

var SHEET_DATA   = 'feedback';
var SHEET_README = 'README';
var FOLDER_NAME  = 'HTPN feedback photographs';
var PROP_SECRET  = 'FEEDBACK_SECRET';
var PROP_FOLDER  = 'FEEDBACK_FOLDER_ID';

/* The column order. The script verifies the incoming record against this on
   every write, so a field added to the app without being added here fails
   loudly instead of silently landing in the wrong column. */
var FIELDS = [
  'submittedAt', 'ticket', 'category', 'areaId', 'rating', 'visitDate',
  'message', 'anonymous', 'name', 'rn', 'email', 'ageYears', 'ic',
  'consentReply', 'consentPublish', 'publishAs',
  'imageName', 'imageBytes', 'lang', 'appVersion', 'schema'
];

var HEADERS = FIELDS.concat(['photoUrl', 'status', 'handledBy', 'handledOn', 'notes']);

function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  var sheet = ss.getSheetByName(SHEET_DATA) || ss.insertSheet(SHEET_DATA);
  sheet.clear();
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  /* The last five columns are for the people handling the feedback, not for
     the app. Nothing this script writes ever touches them. */
  sheet.getRange(1, FIELDS.length + 2, 1, 4).setBackground('#EDE9F3');

  var folder = DriveApp.createFolder(FOLDER_NAME + ' — ' + ss.getName());
  PropertiesService.getScriptProperties().setProperty(PROP_FOLDER, folder.getId());

  var props = PropertiesService.getScriptProperties();
  if (!props.getProperty(PROP_SECRET)) {
    props.setProperty(PROP_SECRET, Utilities.getUuid().replace(/-/g, '') +
                                   Utilities.getUuid().replace(/-/g, '').slice(0, 8));
  }

  var readme = ss.getSheetByName(SHEET_README) || ss.insertSheet(SHEET_README);
  readme.clear();
  readme.getRange(1, 1, 14, 1).setValues([
    ['HTPN — Patient feedback'],
    [''],
    ['This Sheet holds feedback submitted by patients through the Patient Journey app.'],
    ['It contains names, email addresses, free text and links to photographs.'],
    [''],
    ['Before this form is given to patients, HTPN must decide and write down:'],
    ['  1. which unit reads this Sheet, and within how many working days it replies;'],
    ['  2. who may open this Sheet and the Drive folder of photographs;'],
    ['  3. how long rows and photographs are kept, and what happens at the end of that;'],
    ['  4. what happens to a complaint that needs the formal channel instead.'],
    [''],
    ['The last five columns (photoUrl aside) are for whoever handles the feedback.'],
    ['The app never writes to them.'],
    ['Photographs: ' + folder.getUrl()]
  ]);
  readme.setColumnWidth(1, 760);

  Logger.log('Ready. Sheet tabs: "%s", "%s". Photo folder: %s', SHEET_DATA, SHEET_README, folder.getUrl());
  Logger.log('Now run showSecret() and set FEEDBACK_ENABLED = true when HTPN is ready.');
}

function showSecret() {
  Logger.log(PropertiesService.getScriptProperties().getProperty(PROP_SECRET));
}

function rotateSecret() {
  var s = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '').slice(0, 8);
  PropertiesService.getScriptProperties().setProperty(PROP_SECRET, s);
  Logger.log('New secret: %s  — update VITE_FEEDBACK_SECRET and redeploy the app.', s);
}

function doGet() {
  return reply(FEEDBACK_ENABLED ? 'ready' : 'disabled', 'This endpoint accepts POST only.');
}

function doPost(e) {
  /* Order matters and is deliberate: the switch is checked before the
     payload is even parsed, so a disabled endpoint cannot be probed for what
     it would accept. */
  if (!FEEDBACK_ENABLED) return reply('disabled', 'Collection is switched off on the server.');

  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return reply('error', 'Body is not JSON.');
  }

  var expected = PropertiesService.getScriptProperties().getProperty(PROP_SECRET);
  if (!expected) return reply('error', 'No secret configured. Run setup().');
  if (!constantTimeEquals(String(body.secret || ''), expected)) {
    return reply('error', 'Rejected.');
  }

  var rec = body.record;
  if (!rec || typeof rec !== 'object') return reply('error', 'No record.');
  if (rec.schema !== 'pj-htpn-feedback-1') return reply('error', 'Unknown schema.');

  /* A record carrying a field this Sheet has no column for is refused, not
     trimmed. A silent trim hides that the app and the Sheet have drifted. */
  var allowed = {};
  for (var i = 0; i < FIELDS.length; i++) allowed[FIELDS[i]] = true;
  allowed.imageData = true;
  for (var k in rec) {
    if (Object.prototype.hasOwnProperty.call(rec, k) && !allowed[k]) {
      return reply('error', 'Unexpected field: ' + k);
    }
  }

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_DATA);
  if (!sheet) return reply('error', 'Sheet not prepared. Run setup().');

  var header = sheet.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  for (var h = 0; h < FIELDS.length; h++) {
    if (header[h] !== FIELDS[h]) {
      return reply('error', 'Column ' + (h + 1) + ' is "' + header[h] + '", expected "' + FIELDS[h] + '". Run setup().');
    }
  }

  var photoUrl = '';
  if (rec.imageData) {
    try {
      var folderId = PropertiesService.getScriptProperties().getProperty(PROP_FOLDER);
      var folder = folderId ? DriveApp.getFolderById(folderId) : DriveApp.getRootFolder();
      var blob = Utilities.newBlob(
        Utilities.base64Decode(rec.imageData), 'image/jpeg',
        (rec.ticket || 'feedback') + '.jpg');
      photoUrl = folder.createFile(blob).getUrl();
    } catch (err2) {
      /* A photograph that will not save must not lose the words that came
         with it. The row is written either way and says what happened. */
      photoUrl = 'ERROR: ' + err2;
    }
  }

  var row = [];
  for (var f = 0; f < FIELDS.length; f++) row.push(guard(rec[FIELDS[f]]));
  row.push(photoUrl, 'new', '', '', '');
  sheet.appendRow(row);

  return reply('ok', '', rec.ticket || '');
}

/* A cell beginning with = + - or @ is a formula to Sheets. The app guards on
   the way out; this guards again on the way in, because the two ends are
   deployed separately and may not always be the same version. */
function guard(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'boolean' || typeof v === 'number') return v;
  var s = String(v);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function reply(status, reason, ticket) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: status, reason: reason || '', ticket: ticket || '' }))
    .setMimeType(ContentService.MimeType.JSON);
}

/* Comparing secrets with === leaks their length and prefix through timing.
   This compares every character whatever happens. */
function constantTimeEquals(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* --- optional: a daily note to whoever handles this ---------------------- */
function enableDailyDigest() {
  disableDailyDigest();
  ScriptApp.newTrigger('sendDailyDigest').timeBased().atHour(8).everyDays(1).create();
  Logger.log('Daily digest on. It emails the owner of this Sheet.');
}

function disableDailyDigest() {
  var t = ScriptApp.getProjectTriggers();
  for (var i = 0; i < t.length; i++) {
    if (t[i].getHandlerFunction() === 'sendDailyDigest') ScriptApp.deleteTrigger(t[i]);
  }
}

function sendDailyDigest() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_DATA);
  if (!sheet || sheet.getLastRow() < 2) return;
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, HEADERS.length).getValues();
  var since = new Date(Date.now() - 24 * 3600 * 1000);
  var n = 0, complaints = 0;
  for (var i = 0; i < data.length; i++) {
    var when = new Date(data[i][0]);
    if (when >= since) { n++; if (data[i][2] === 'complaint') complaints++; }
  }
  if (!n) return;
  MailApp.sendEmail(
    Session.getEffectiveUser().getEmail(),
    'HTPN feedback — ' + n + ' new (' + complaints + ' complaint' + (complaints === 1 ? '' : 's') + ')',
    n + ' new submissions in the last 24 hours, of which ' + complaints + ' are complaints.\n\n' + ss.getUrl());
}
