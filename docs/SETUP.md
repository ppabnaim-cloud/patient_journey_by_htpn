# Turning things on — a step-by-step

Three separate jobs. They are independent: you can do any one of them and
leave the others. None of them is urgent, and nothing in the app breaks
while they are all switched off.

| # | What it does | Where the data goes | Needed before patients use the app? |
|---|---|---|---|
| A | Counts how the app is used | A Google Sheet you own | No |
| B | Receives appreciation from the Feedback tab | A **second**, separate Google Sheet | No — appreciation just cannot be sent until it is done |
| C | Carries the patient's answers into HTPN's own form | Nowhere new | No — the form opens empty without it |

Throughout: **anything called a "secret" is a password.** Do not paste one
into a chat, an email or a WhatsApp group. The only place it goes is the
box described in step A7 or B7.

---

## A. Usage counts — how many people use the app, and which parts

This answers "how many patients used wayfinding this month". It carries no
names, no IC numbers, no clinical information and nothing anyone typed. The
server refuses a record that contains any of those rather than quietly
removing them.

### A1. Make the Sheet
Go to **sheets.new**. It opens a new empty spreadsheet. Name it something
you will recognise in a year, for example `HTPN Patient Journey — usage`.

### A2. Open the script editor
In that Sheet: **Extensions → Apps Script**. A new tab opens with a small
code window containing `function myFunction() {}`.

### A3. Paste the script
Select everything in that code window and delete it. Then open
`apps-script/Code.gs` from this repository, copy the whole file, and paste
it in. Click the **floppy-disk Save icon**.

### A4. Run setup
At the top of the editor there is a dropdown listing function names. Choose
**setup**, then click **Run**.

**Google will now ask for permission, and this is the step where most people
stop.** It looks alarming. What it is actually asking is whether this script
may edit the Sheet you just made. The sequence is:

1. **Review permissions**
2. Choose your Google account
3. A screen saying *"Google hasn't verified this app"* — click **Advanced**
   (small text, bottom left)
4. **Go to Untitled project (unsafe)**
5. **Allow**

"Unverified" here means "written by you, not submitted to Google for
review". It is the normal path for a script you wrote yourself.

When it finishes, the Sheet will have two new tabs: `usage` and `README`.

### A5. Copy the secret
Back in the script editor, choose **showSecret** from the dropdown and click
**Run**. Look at the **Execution log** panel at the bottom. It prints a long
string of letters and numbers. Select it and copy it.

That string is a password. Keep it in the clipboard for step A7, or put it
somewhere secure — not in a chat window.

### A6. Publish it as a web address
**Deploy → New deployment**. Click the **gear icon** next to "Select type"
and choose **Web app**. Then:

- **Description**: anything, e.g. `v1`
- **Execute as**: **Me**
- **Who has access**: **Anyone**

Click **Deploy**. Copy the **Web app URL** it shows you — it looks like
`https://script.google.com/macros/s/AKfycb..../exec`.

*"Anyone" sounds wrong but is correct here:* it means the address can be
reached without a Google login. The secret from A5 is what stops anything
other than your app writing to the Sheet.

### A7. Put both values into the deployment
Wherever the app is hosted (Vercel, if you used the import link), open
**Settings → Environment Variables** and add four entries:

| Name | Value |
|---|---|
| `APPS_SCRIPT_URL` | the URL from A6 |
| `APPS_SCRIPT_SECRET` | the secret from A5 |
| `COLLECTION_ENABLED` | `true` |
| `VITE_COLLECTION_ENABLED` | `true` |

Then **redeploy** — environment variables are read at build time, so a save
alone changes nothing.

### A8. Check it worked
Open the app, move between a few tabs, then look at the `usage` tab of your
Sheet. Rows should appear. If they do not, open the Web app URL from A6
directly in a browser: it replies `{"status":"ready"}` when the script is
reachable, and `{"status":"disabled"}` if the flag inside the script is off.

### What you can switch off again
Setting `COLLECTION_ENABLED` to `false` and redeploying stops everything.
That flag lives on the server, not in the patient's browser, so it is the
one that actually decides.

### Optional: a daily email
In the script editor, run **enableDailyDigest** once. It emails the Sheet's
owner each morning with the previous day's count. Run `disableDailyDigest`
to stop it.

---

## B. The Feedback Sheet — appreciation from patients

**This is a second Sheet and a second deployment.** Do not put it in the
same spreadsheet as A. That one holds anonymous counts; this one holds
names, email addresses, free text and photographs. They have different
audiences and very different consequences if the link reaches the wrong
person.

The steps are the same as A, with four differences:

- In **B1**, name it something like `HTPN Patient Journey — feedback`.
- In **B3**, paste `apps-script/Feedback.gs` instead.
- In **B3a**, before saving, find this line near the top and change it:
  ```
  var FEEDBACK_ENABLED = false;      →      var FEEDBACK_ENABLED = true;
  ```
- In **B7**, the variable names are different, and all three go in:

| Name | Value |
|---|---|
| `VITE_FEEDBACK_URL` | the Web app URL |
| `VITE_FEEDBACK_SECRET` | the secret |
| `VITE_FEEDBACK_ENABLED` | `true` |

`setup()` also creates a Drive folder for the photographs and prints its
address in the log.

### Two things to settle before patients use this form

Neither is a coding question, and the app currently says on screen that
neither has been answered:

1. **Who reads the Sheet, and within how many working days do they reply?**
   Write it down. Once you have it, tell me and I will put it on the screen
   in place of the line that currently admits nobody has been named.
2. **Who may open the Sheet and the photograph folder, and how long are rows
   kept?** PDPA 2010 does not apply to a government body (s.3(1)), so the
   instrument that governs this is the Ministry's own ICT security policy
   and HTPN's data owner — not this script.

### One honest limitation
The secret for the feedback form sits in the patient's browser, so somebody
technical who opens the app can read it and could post junk into the Sheet.
It prevents accidents, not a determined person. If that matters, the
submission can be routed through the server instead — the code in `api/` is
already shaped for it. Tell me and I will wire it.

---

## C. The pre-filled link for HTPN's own form

**What this is for.** Complaints and "room for improvement" open your
official form, which goes to the Public Relations Office. Right now that
form opens **empty** — the patient has to choose the department again and
retype what they already typed. This step lets the app carry their answers
across so the form opens with the boxes already filled.

It works today without this. This only removes the double typing.

**Why I cannot do it myself.** Every Google address is blocked from the
machine I run on, so I cannot open your form to see what its questions are
called internally. Each question has a hidden number like
`entry.1845629107`. Guessing one produces a link that looks fine and
silently throws the answer away, so I have not guessed.

### How to get it — about one minute

1. Open the form **as its editor** — from Google Forms, or Drive. Not the
   `forms.gle/...` link, which is the version patients see.
2. Top right, click the **⋮** (three vertical dots).
3. Choose **Get pre-filled link**.
4. The form opens in a special mode. **Type a word you will recognise into
   every box** — literally `AAA` in the first question, `BBB` in the
   second, and so on. For dropdowns and multiple choice, just pick any
   option. Do not worry about making sense; nothing is submitted.
5. Scroll to the bottom and click **GET LINK**.
6. A small bar appears at the bottom of the screen. Click **COPY LINK**.
7. Paste that link into our chat.

**Is it safe to paste?** Yes. It contains the form's field numbers and the
dummy words you typed. It submits nothing, and it carries no patient data.

**One exception.** If the form has a file-upload question, that one cannot
be pre-filled by anyone — it is a Google limitation, not ours. The patient
will still attach the photograph on the form itself.

Once you paste it, the change is a few minutes' work in
`src/data/officialForm.js`.

---

## Where each setting lives, for reference

| Setting | File | Default |
|---|---|---|
| `VITE_COLLECTION_ENABLED` | deployment env | `false` |
| `COLLECTION_ENABLED` | deployment env | `false` |
| `APPS_SCRIPT_URL`, `APPS_SCRIPT_SECRET` | deployment env | unset |
| `VITE_FEEDBACK_ENABLED`, `VITE_FEEDBACK_URL`, `VITE_FEEDBACK_SECRET` | deployment env | `false` / unset |
| `FEEDBACK_ENABLED` | `apps-script/Feedback.gs`, line ~45 | `false` |
| `VITE_APPRECIATION_CSV` | deployment env | unset — the board shows the dated figures that ship with the app |
| Which category goes to HTPN's form | `src/data/officialForm.js`, `ROUTE` | complaint and improvement → HTPN's form |

---

## The feedback Sheet already exists

Created 22 October 2026 in ppnaim@moh.gov.my's Drive:

**HTPN — Maklum Balas Pesakit (Patient Journey app)**
https://docs.google.com/spreadsheets/d/1VVEsLyrUOizL9tllXTRhPOxy6T3nKpbGw1cJ9VI2q-k/edit

Its first tab, **MULA DI SINI**, carries the six set-up steps in Bahasa
Malaysia, in order, with the exact menu names. Follow that tab rather than
this file; this file is the longer reference behind it.

What could be done for HTPN, and what could not:

- The Sheet itself, its name, and the step-by-step tab — done.
- Pasting `apps-script/Feedback.gs` into Extensions › Apps Script, running
  `setup()`, and deploying it as a Web App — **only HTPN can do this.** A
  deployment runs as a Google account and has to be authorised by the person
  who owns it, in their own browser. No tool can authorise it on their
  behalf, and nothing should be able to.
