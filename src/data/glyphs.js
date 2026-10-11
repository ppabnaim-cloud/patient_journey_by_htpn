/* ===========================================================================
   glyphs.js — small pictograms, as inline SVG paths.

   WHY DRAWN RATHER THAN PHOTOGRAPHED OR GENERATED
   A photograph or a generated picture of "a stroke" or "a snake bite" is a
   picture of a specific person having a specific event. On a triage screen a
   patient matches themselves against what they see, and a picture that does
   not look like what is happening to them can talk them out of going. A
   symbol says the category and claims nothing about how it looks.
   They also scale, work offline, and follow the theme.

   Each entry is an array of path `d` strings, drawn on a 24x24 grid with
   round caps and no fill unless noted. Keep them geometric and legible at
   18px — a glyph that needs 40px to be read is not doing its job.
   ========================================================================= */

export const GLYPH = {
  /* --- emergency ------------------------------------------------------- */
  heart:      ['M12 20.5S4 15.2 4 9.8A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 8 2.4c0 5.4-8 10.7-8 10.7z', 'M11 10.5l-1.4 2.4h3L11 15.8'],
  stroke:     ['M7.5 20v-3.3A6.5 6.5 0 0 1 9 4.6a5.5 5.5 0 0 1 8.5 4.6c0 1.8-1 2.6-1 4.3V16h-2v4', 'M12.5 8.5l-1.6 2.8h3l-1.6 2.8'],
  breath:     ['M12 3.5v7', 'M12 10.5c0-2 1.6-3.2 3-3.2 2.3 0 3.6 2 3.6 5.3 0 3.6-1 6.4-3.4 6.4-1.8 0-3.2-1.3-3.2-3.4z', 'M12 10.5c0-2-1.6-3.2-3-3.2-2.3 0-3.6 2-3.6 5.3 0 3.6 1 6.4 3.4 6.4 1.8 0 3.2-1.3 3.2-3.4z'],
  bone:       ['M6.5 17.5l11-11', 'M4.6 15.6a2 2 0 1 1 2.8-2.8l3.8 3.8a2 2 0 1 1-2.8 2.8 2 2 0 1 1-3.8-3.8z', 'M19.4 8.4a2 2 0 1 0-2.8 2.8l-3.8-3.8a2 2 0 1 0 2.8-2.8 2 2 0 1 0 3.8 3.8z'],
  bleeding:   ['M12 3.5s5.5 6.1 5.5 9.6a5.5 5.5 0 0 1-11 0C6.5 9.6 12 3.5 12 3.5z', 'M12 17.2a3.3 3.3 0 0 1-3.3-3.3'],
  burn:       ['M12 20.5c3 0 5.2-2.1 5.2-5 0-4.2-5.2-8-5.2-11.5 0 0-3 2.4-3 5.4 0 2 1 2.8 1 4 0 1-.8 1.7-1.6 1.7S7 14.3 7 13.3c-.6 1-.2 2.2-.2 2.2 0 2.9 2.2 5 5.2 5z'],
  seizure:    ['M3 12h3l2-5 3 10 3-8 2 3h5'],
  trauma:     ['M4 16h16', 'M5.5 16V12l2-4.5h9L18.5 12v4', 'M7.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'M16.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z', 'M3 4l3 3M21 4l-3 3'],
  poison:     ['M9 3h6', 'M10 3v4.2L5.8 16A3.3 3.3 0 0 0 8.8 21h6.4a3.3 3.3 0 0 0 3-5L14 7.2V3', 'M9 14.5h6'],
  faint:      ['M12 6.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z', 'M8 10l8 1.5', 'M16 11.5L19 16', 'M8 10l-3 4', 'M16 11.5l-2.5 8', 'M11 12l-2.5 8'],
  chemical:   ['M10 3h4', 'M11 3v6L6.5 17.6A2.4 2.4 0 0 0 8.6 21h6.8a2.4 2.4 0 0 0 2.1-3.4L13 9V3', 'M9.5 14.5h5', 'M20 5.5l1.6 1.6M21.6 5.5L20 7.1'],
  snake:      ['M6 19c0-3 4-3 4-6s-4-3-4-6 4-3 6-1', 'M14 6a4 4 0 0 1 4 4c0 3-3 4-3 6.5a2.5 2.5 0 0 0 5 0', 'M16.2 8.8h.01', 'M12 19.5h.01'],

  /* --- not an emergency ------------------------------------------------ */
  fever:      ['M14 13.4V5.5a2 2 0 1 0-4 0v7.9a4 4 0 1 0 4 0z', 'M12 8.5v6.5'],
  cough:      ['M9.5 14a5 5 0 1 1 4.6-6.9', 'M14.5 10.5h5M15.5 13.5h4M16.5 16.5h3'],
  eye:        ['M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z', 'M12 14.6a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2z'],
  stomach:    ['M9 4v4.5c0 3.5-3.5 3.2-3.5 6.4A4.6 4.6 0 0 0 10 19.5c4 0 5.5-2.4 5.5-5.2 0-2 1-2.4 2-2.4', 'M9 4h2.5'],
  rash:       ['M4.5 6.5h15v11h-15z', 'M8 10h.01M12 9.5h.01M16 11h.01M9.5 14h.01M14 14.5h.01'],
  wound:      ['M4.2 14.1l9.9-9.9a3.5 3.5 0 0 1 5 5l-9.9 9.9a3.5 3.5 0 1 1-5-5z', 'M7.6 10.7l5.7 5.7', 'M10.5 11.5h.01M12.5 13.5h.01'],
  dressing:   ['M5 9.5h14v5H5z', 'M5 9.5a2.5 2.5 0 0 1 0 5', 'M19 9.5a2.5 2.5 0 0 0 0 5', 'M10 12h4'],
  tube:       ['M7 3.5v5a4 4 0 0 0 4 4h2a4 4 0 0 1 4 4v3', 'M5 3.5h4', 'M15 20.5h4'],
  screening:  ['M8 3.5h8a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1z', 'M10 3.5V6h4V3.5', 'M9.5 10.5h5M9.5 14h5'],
  refill:     ['M8 7.5h8v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z', 'M9.5 7.5V4h5v3.5', 'M12 11.5v5M9.5 14h5'],
  mc:         ['M7 3.5h7l4 4v13H7z', 'M14 3.5v4h4', 'M9.5 12.5h5M9.5 16h3'],

  /* --- MyUbat exclusions ----------------------------------------------- */
  cold:       ['M12 3v18', 'M4.2 7.5l15.6 9M19.8 7.5L4.2 16.5', 'M12 6.5l-2 -2M12 6.5l2 -2', 'M12 17.5l-2 2M12 17.5l2 2'],
  lock:       ['M6.5 10.5h11v9h-11z', 'M9 10.5V8a3 3 0 0 1 6 0v2.5', 'M12 14v2.5'],
  counsel:    ['M4 5.5h11a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 15 13.5H8L4.5 16.5V7A1.5 1.5 0 0 1 6 5.5z', 'M19 9.5h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1l-2 2v-2'],
  empty:      ['M5 8.5h14l-1 11a2 2 0 0 1-2 1.8H8a2 2 0 0 1-2-1.8z', 'M9 8.5V6a3 3 0 0 1 6 0v2.5', 'M9.5 15.5l5 0'],

  /* fallback */
  dot:        ['M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z']
}

/* The two triage lists, in the published order, mapped to a glyph each. Kept
   here rather than in triage.js so that file stays a faithful transcription of
   the poster and nothing else. */
export const TRIAGE_GLYPHS = {
  notEmergency: ['fever', 'cough', 'eye', 'stomach', 'rash', 'wound', 'dressing', 'tube', 'screening', 'refill', 'mc'],
  emergency: ['heart', 'stroke', 'breath', 'bone', 'bleeding', 'burn', 'seizure', 'trauma', 'poison', 'faint', 'chemical', 'snake']
}
