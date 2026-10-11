/* ===========================================================================
   engine/appointments.js — pure functions. No JSX, no storage, no Date.now()
   taken implicitly: every function that needs "today" is handed it, so the
   tests can ask what the screen looks like on any day of the year.

   WHAT A REMINDER CAN AND CANNOT BE, IN A WEB APP
   The requirement is: notify the patient one day before. A web page cannot
   wake itself up tomorrow. There are exactly three mechanisms and only one of
   them is honest here:

     1. A notification fired while the app is open. Works, but a patient who
        does not open the app the day before is never told — which is the
        patient the reminder exists for.
     2. Web Push. Reliable, and it needs a server holding a subscription for
        each device, with the schedule on that server. That breaks the app's
        one promise — the record stays on the device — so it is not used.
     3. The phone's own calendar, given the appointment in an .ics file with
        an alarm set one day before. The phone fires it whether or not this
        app is running, whether or not there is a signal, and nothing leaves
        the device to make it work.

   So this engine computes (3) and (1): the calendar entry is the reminder,
   and the in-app banner is what the patient sees when they do open the app.
   `reminderDate` below is the same date in both.
   ========================================================================= */

export const REMIND_DAYS_BEFORE = 1

/* Dates are handled as YYYY-MM-DD strings throughout. Parsing them into Date
   objects and back is how a reminder silently lands on the wrong day: a
   Date built from '2026-10-15' is UTC midnight, which is the 14th in a
   browser set west of Greenwich. String arithmetic has no timezone. */
export function addDays (iso, n) {
  const [y, m, d] = String(iso).split('-').map(Number)
  if (!y || !m || !d) return null
  const t = Date.UTC(y, m - 1, d) + n * 86400000
  const z = new Date(t)
  const p = (v) => String(v).padStart(2, '0')
  return `${z.getUTCFullYear()}-${p(z.getUTCMonth() + 1)}-${p(z.getUTCDate())}`
}

export function daysUntil (iso, today) {
  const a = Date.parse(`${today}T00:00:00Z`)
  const b = Date.parse(`${iso}T00:00:00Z`)
  if (Number.isNaN(a) || Number.isNaN(b)) return null
  return Math.round((b - a) / 86400000)
}

export function reminderDate (appt) {
  return appt?.date ? addDays(appt.date, -REMIND_DAYS_BEFORE) : null
}

/* One word for how near an appointment is. The UI never recomputes this. */
export function dueState (appt, today) {
  const n = daysUntil(appt?.date, today)
  if (n === null) return 'unknown'
  if (n < 0) return 'past'
  if (n === 0) return 'today'
  if (n === 1) return 'tomorrow'
  if (n <= 7) return 'soon'
  return 'later'
}

const RANK = { today: 0, tomorrow: 1, soon: 2, later: 3, unknown: 4, past: 5 }

/* Soonest first, past last. Within a day, earlier time first; an appointment
   with no time given sorts before one with a time, because "sometime that
   morning" is what a patient without a time slip has to plan around. */
export function sortAppointments (list, today) {
  return [...(list || [])].sort((a, b) => {
    const ra = RANK[dueState(a, today)], rb = RANK[dueState(b, today)]
    if (ra !== rb) return ra - rb
    const da = String(a.date || ''), db = String(b.date || '')
    if (da !== db) return (ra === 5 ? db.localeCompare(da) : da.localeCompare(db))
    return String(a.time || '').localeCompare(String(b.time || ''))
  })
}

export function upcoming (list, today) {
  return sortAppointments(list, today).filter(a => dueState(a, today) !== 'past')
}

export function pastAppointments (list, today) {
  return sortAppointments(list, today).filter(a => dueState(a, today) === 'past')
}

/* What the dashboard should raise. Same shape as every other finding in this
   app — { id, level, source, flag } — so the existing sorter handles it and
   nothing about appointments needs a special case downstream.

   The source is the patient. That is not a hedge: until phase 2 reads SPP.AI,
   an appointment in this app is what somebody typed, and a screen that shows
   it in the same voice as a hospital-confirmed date would be lying about
   where it came from. */
export const APPT_SOURCE = {
  id: 'OWN_APPOINTMENT_CARD',
  short: { en: 'Typed in by you', ms: 'Ditaip oleh anda' },
  full: {
    en: 'Typed in by you from your appointment card. This app does not read the hospital system, so it cannot confirm the date, and it will not know if the clinic changes it.',
    ms: 'Ditaip oleh anda daripada kad temujanji anda. Aplikasi ini tidak membaca sistem hospital, jadi ia tidak dapat mengesahkan tarikh tersebut, dan ia tidak akan mengetahui jika klinik menukarnya.'
  }
}

export function appointmentFindings (record, today) {
  const list = record?.appointments || []
  const out = []
  for (const a of upcoming(list, today)) {
    const state = dueState(a, today)
    if (state !== 'today' && state !== 'tomorrow') continue
    out.push({
      id: 'appt_' + a.id,
      kind: 'appointment',
      level: state === 'today' ? 'attention' : 'soon',
      appointment: a,
      state,
      source: APPT_SOURCE,
      flag: null
    })
  }
  return out
}
