/* ===========================================================================
   ics.js — builds a calendar file the patient's own phone can hold.

   This is the only part of the app that can notify a patient on a day they
   do not open it. The file is built in the browser, handed to the phone's
   calendar, and never sent anywhere: see the note at the top of
   engine/appointments.js for why the alternative (a push server) is not used.

   RFC 5545 is picky in two ways that matter and are easy to get wrong:
     - TEXT values escape backslash, semicolon, comma and newline. A clinic
       name with a comma in it silently truncates the summary otherwise.
     - Lines are folded at 75 octets, continued with a leading space. Long
       Malay department names cross that on their own.
   ========================================================================= */

const esc = (s) => String(s ?? '')
  .replace(/\\/g, '\\\\')
  .replace(/;/g, '\;')
  .replace(/,/g, '\\,')
  .replace(/\r?\n/g, '\\n')

/* Fold on octets, not characters: a Malay name is ASCII but a patient's note
   may not be, and splitting mid-codepoint corrupts the file. */
function fold (line) {
  const bytes = new TextEncoder().encode(line)
  if (bytes.length <= 75) return line
  const out = []
  let start = 0
  while (start < bytes.length) {
    const limit = start === 0 ? 75 : 74
    let end = Math.min(start + limit, bytes.length)
    while (end > start && end < bytes.length && (bytes[end] & 0xc0) === 0x80) end--
    out.push((start === 0 ? '' : ' ') + new TextDecoder().decode(bytes.slice(start, end)))
    start = end
  }
  return out.join('\r\n')
}

const stamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

/* A floating local time — no Z, no TZID. The phone reads it in its own
   timezone, which for a patient attending HTPN is the right one by
   definition. A UTC time here would show as 5pm for a 9am clinic. */
function dtstart (date, time) {
  const d = String(date).replace(/-/g, '')
  if (!time) return { key: 'DTSTART;VALUE=DATE', value: d }
  return { key: 'DTSTART', value: `${d}T${String(time).replace(':', '')}00` }
}

function dtend (date, time, minutes = 60) {
  if (!time) return { key: 'DTEND;VALUE=DATE', value: String(date).replace(/-/g, '') }
  const [h, m] = String(time).split(':').map(Number)
  const total = h * 60 + m + minutes
  const p = (v) => String(v).padStart(2, '0')
  return { key: 'DTEND', value: `${String(date).replace(/-/g, '')}T${p(Math.floor(total / 60) % 24)}${p(total % 60)}00` }
}

/* One VEVENT per appointment, each with an alarm the agreed number of days
   before. `daysBefore` is passed in rather than hard-coded so the engine
   stays the single place that decides when a patient is reminded. */
export function buildIcs (appointments, { daysBefore = 1, alarmText = 'Appointment tomorrow', title = 'Appointment' } = {}) {
  const now = stamp(new Date())
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HTPN//Patient Journey//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ]
  for (const a of appointments) {
    if (!a?.date) continue
    const s = dtstart(a.date, a.time)
    const e = dtend(a.date, a.time)
    lines.push(
      'BEGIN:VEVENT',
      `UID:${esc(a.id)}@patient-journey.htpn`,
      `DTSTAMP:${now}`,
      `${s.key}:${s.value}`,
      `${e.key}:${e.value}`,
      `SUMMARY:${esc(a.summary || title)}`,
      a.location ? `LOCATION:${esc(a.location)}` : null,
      a.note ? `DESCRIPTION:${esc(a.note)}` : null,
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${esc(alarmText)}`,
      `TRIGGER:-P${Math.max(0, Number(daysBefore) || 0)}D`,
      'END:VALARM',
      'END:VEVENT'
    )
  }
  lines.push('END:VCALENDAR')
  return lines.filter(Boolean).map(fold).join('\r\n') + '\r\n'
}
