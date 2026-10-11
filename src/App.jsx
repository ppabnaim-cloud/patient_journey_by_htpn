/* ===========================================================================
   App.jsx — the whole user interface, deliberately in one file so a clinician
   can read it end to end without chasing imports.

   What is NOT in this file, on purpose:
     src/engine/*     the clinical logic. Pure functions, no JSX. Read those
                      first; nothing here changes what they decide.
     src/collection.js  everything that leaves the device.
     src/governance.js  the controller, the legal position, the privacy words.

   Layout contract enforced throughout: every screen fits a 10-inch tablet in
   portrait with no page scroll. Lists are PAGED with fixed page sizes; long
   sections are split into steps. See src/styles.js.
   ========================================================================= */

import React, { useState, useEffect, useMemo, useRef, useCallback, createContext, useContext } from 'react'
import { CSS } from './styles.js'
import { T, pick, LANGS, DEFAULT_LANG } from './i18n.js'
import { APP, CONTROLLER, ETHICS, PRIVACY, COLLECTION_UI_ENABLED, collectionStatement } from './governance.js'
import { SRC, LAB_PANEL, BMI_BANDS, WAIST_THRESHOLD } from './engine/sources.js'
import { calcBMI, classifyBMI, classifyWaist } from './engine/anthro.js'
import { classifyResult, seriesFor, changeSince } from './engine/labs.js'
import { reviewRecord, summarise } from './engine/review.js'
import * as store from './storage.js'
import { readText, draftMedicationsFrom, draftLabsFrom, draftDateFrom, ocrAvailable } from './ocr.js'
import { sendUsage, onUsageStatus, newDeviceCode, LAST_RECORD_FOR_DISPLAY } from './usage.js'
import { CAMPUSES, DEPARTMENTS, UNCONFIRMED_NOTE, confirmedCount } from './data/wayfinding.js'
import { IQMS, MYUBAT, EMERGENCY, BEFORE_YOU_COME } from './data/services.js'
import { SECTION as POSTER_SECTION, ROLES, POSTERS, postersForRole } from './data/posters.js'

/* --- language ----------------------------------------------------------- */
const LangCtx = createContext(DEFAULT_LANG)
const useT = () => { const lang = useContext(LangCtx); return [(v) => pick(v, lang), lang] }

/* --- fixed page sizes. Lists page; they never scroll. ------------------- */
const PAGE = { meds: 5, simple: 5, labs: 6, depts: 8, posters: 4, measurements: 5 }

/* --- icons -------------------------------------------------------------- */
const Icon = ({ d, filled }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor"
       strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d.map((p, i) => <path key={i} d={p} />)}
  </svg>
)
const ICONS = {
  dashboard: ['M3 12h4l2.5 7 5-14L17 12h4'],
  records: ['M6 3h9l3 3v15H6z', 'M9 10h7', 'M9 14h7', 'M9 18h4'],
  measurements: ['M3 7h18v10H3z', 'M7 7v4', 'M11 7v6', 'M15 7v4', 'M19 7v6'],
  wayfinding: ['M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z', 'M12 10.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z'],
  iqms: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7.5V12l3 2'],
  myubat: ['M4.5 13.5l9-9a4.6 4.6 0 0 1 6.5 6.5l-9 9a4.6 4.6 0 0 1-6.5-6.5z', 'M9 9l6 6'],
  rakyat: ['M12 20.5s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.8a4.2 4.2 0 0 1 7.5 2.7c0 5.4-7.5 10-7.5 10z']
}

/* --- generic bits -------------------------------------------------------- */

function Pager ({ page, pages, onPage, label }) {
  const [t] = useT()
  if (pages <= 1) return null
  return (
    <div className="pager">
      <button className="pgbtn" onClick={() => onPage(page - 1)} disabled={page === 0}>‹ {t(T.back)}</button>
      <span className="sp" />
      <span>{label || t(T.page)} {page + 1} {t(T.of)} {pages}</span>
      <span className="sp" />
      <button className="pgbtn" onClick={() => onPage(page + 1)} disabled={page >= pages - 1}>{t(T.next)} ›</button>
    </div>
  )
}

/* Pages an array and keeps the page index in range when the array shrinks. */
function usePaged (items, size) {
  const [page, setPage] = useState(0)
  const pages = Math.max(1, Math.ceil(items.length / size))
  const safe = Math.min(page, pages - 1)
  useEffect(() => { if (page !== safe) setPage(safe) }, [page, safe])
  return {
    page: safe, pages, setPage,
    slice: items.slice(safe * size, safe * size + size)
  }
}

function Field ({ label, hint, children }) {
  return (
    <div className="fld">
      {label ? <label>{label}</label> : null}
      {children}
      {hint ? <span className="hint">{hint}</span> : null}
    </div>
  )
}

/* A finding, rendered with its citation. Items with nothing to act on arrive
   folded (engine/review.js decides that, not this component) and open on tap.
   They are never removed from the list. */
function Finding ({ f }) {
  const [t, lang] = useT()
  const [open, setOpen] = useState(!f.folded)
  useEffect(() => { setOpen(!f.folded) }, [f.folded, f.id])
  const src = SRC[f.source]
  const badge = { warning: T.level_warning, attention: T.level_attention, watch: T.level_watch, none: T.level_none }[f.level]
  return (
    <div className={'finding ' + f.level}>
      <button className="finding-head" onClick={() => setOpen(o => !o)} aria-expanded={open}>
        <span className={'badge ' + f.level}>{t(badge)}</span>
        <span className="finding-t">{t(f.title)}</span>
        <span className="chev">{open ? '▴' : '▾'}</span>
      </button>
      {open ? (
        <div className="finding-body">
          <p>{t(f.detail)}</p>
          {f.note ? <p className="note">{t(f.note)}</p> : null}
          {f.steps?.length ? (
            <>
              <b style={{ fontSize: 12, color: 'var(--ink)' }}>{t(T.whatToDo)}</b>
              <ul className="steps">{f.steps.map((s, i) => <li key={i}>{t(s)}</li>)}</ul>
            </>
          ) : null}
          {f.flag ? <div className="flagline">⚠ {t(f.flag)}</div> : null}
          {src ? (
            <div className="cite">
              <b>{t(src.kind === 'none' ? T.notBasedOn : T.basedOn)}:</b> {t(src.full)}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

/* =========================================================================
   TAB 1 — My Journey (the dashboard)
   ====================================================================== */
function TabDashboard ({ record, goTo, onPrint }) {
  const [t] = useT()
  const findings = useMemo(() => reviewRecord(record), [record])
  const counts = useMemo(() => summarise(findings), [findings])
  const actionable = findings.filter(f => f.level !== 'none')
  const quiet = findings.filter(f => f.level === 'none')
  const [showQuiet, setShowQuiet] = useState(false)
  const list = showQuiet ? quiet : actionable
  const paged = usePaged(list, 4)

  if (store.entryCount(record) === 0) {
    return (
      <div className="pane">
        <div className="pane-head">
          <h1 className="pane-title">{t(T.tab_dashboard)}</h1>
          <p className="pane-lead">{t(T.dash_lead)}</p>
        </div>
        <div className="empty">
          <span className="big">{t(T.dash_empty_title)}</span>
          <span>{t(T.dash_empty_body)}</span>
          <button className="btn" onClick={() => goTo('records')}>{t(T.dash_goto_records)}</button>
        </div>
      </div>
    )
  }

  return (
    <div className="pane">
      <div className="pane-head">
        <h1 className="pane-title">{t(T.tab_dashboard)}</h1>
        <p className="pane-lead">{t(T.dash_lead)}</p>
      </div>
      <div className="subtabs">
        <button className="subtab" aria-selected={!showQuiet} onClick={() => setShowQuiet(false)}>
          {t(T.whatToDo)} · {counts.warning + counts.attention + counts.watch}
        </button>
        <button className="subtab" aria-selected={showQuiet} onClick={() => setShowQuiet(true)}>
          {t(T.dash_show_all)} · {counts.none}
        </button>
      </div>
      <div className="pane-body">
        {list.length === 0
          ? <div className="empty"><span className="big">{t(T.dash_nothing_to_act)}</span></div>
          : <div className="scroller">{paged.slice.map(f => <Finding key={f.id} f={f} />)}</div>}
      </div>
      <div className="pane-foot" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
        <Pager page={paged.page} pages={paged.pages} onPage={paged.setPage} />
        <button className="btn ghost wide" onClick={onPrint}>{t(T.dash_print)}</button>
      </div>
    </div>
  )
}

/* =========================================================================
   TAB 2 — My Records.  Five sections as sub-tabs, which is what keeps each
   one inside one screen. Each section has its own entry route: photograph,
   upload, or type.
   ====================================================================== */

const REC_SECTIONS = [
  { id: 'meds', label: T.sec_meds, detail: 'meds' },
  { id: 'issues', label: T.sec_issues, detail: 'issues' },
  { id: 'allergies', label: T.sec_allergies, detail: 'allergies' },
  { id: 'surgery', label: T.sec_surgery, detail: 'surgery' },
  { id: 'bloods', label: T.sec_bloods, detail: 'bloods' }
]

function OcrPanel ({ onDraft, onEvent, kind }) {
  const [t] = useT()
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [text, setText] = useState(null)
  const [err, setErr] = useState(null)
  const camRef = useRef(null)
  const upRef = useRef(null)

  const handle = useCallback(async (file, how) => {
    if (!file) return
    onEvent('record_photo_added', how)
    setErr(null); setText(null); setBusy(true); setProgress(0)
    const res = await readText(file, p => setProgress(p))
    setBusy(false)
    onEvent('record_ocr_run', how)
    if (!res.ok) { setErr(t(T.ocr_unavailable)); return }
    if (!res.text) { setErr(t(T.ocr_nothing)); return }
    setText(res.text)
  }, [onEvent, t])

  const accept = () => {
    const draft = kind === 'bloods' ? draftLabsFrom(text, LAB_PANEL) : draftMedicationsFrom(text)
    onDraft(draft, text)
    onEvent('record_ocr_accepted', 'none')
    setText(null)
  }

  return (
    <div className="card tight">
      <div className="btnrow">
        <button className="btn ghost" onClick={() => camRef.current?.click()} disabled={busy}>📷 {t(T.entry_camera)}</button>
        <button className="btn ghost" onClick={() => upRef.current?.click()} disabled={busy}>🖼 {t(T.entry_upload)}</button>
      </div>
      <input ref={camRef} type="file" accept="image/*" capture="environment" className="sr"
             onChange={e => handle(e.target.files?.[0], 'camera')} />
      <input ref={upRef} type="file" accept="image/*" className="sr"
             onChange={e => handle(e.target.files?.[0], 'upload')} />
      {busy ? <p className="hint" style={{ marginTop: 8 }}>{t(T.ocr_working)} {Math.round(progress * 100)}%</p> : null}
      {err ? <p className="hint" style={{ marginTop: 8, color: 'var(--attention)' }}>{err}</p> : null}
      {text ? (
        <div style={{ marginTop: 9 }}>
          <p className="hint">{t(T.ocr_result_lead)}</p>
          <pre style={{
            margin: '6px 0', padding: 8, background: 'var(--bg)', border: '1px solid var(--line)',
            borderRadius: 8, fontSize: 11, maxHeight: 92, overflow: 'auto', whiteSpace: 'pre-wrap'
          }}>{text.slice(0, 600)}</pre>
          <div className="btnrow">
            <button className="btn" onClick={accept}>{t(T.ocr_accept)}</button>
            <button className="btn quiet" onClick={() => setText(null)}>{t(T.ocr_discard)}</button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function MedsSection ({ record, update, onEvent }) {
  const [t] = useT()
  const [draft, setDraft] = useState({ drug: '', dose: '', indication: '', status: 'on' })
  const meds = record.medications || []
  const paged = usePaged(meds, PAGE.meds)

  const add = () => {
    if (!draft.drug.trim()) return
    update(r => ({ ...r, medications: [...(r.medications || []), { ...draft, id: store.newId() }] }))
    setDraft({ drug: '', dose: '', indication: '', status: 'on' })
    onEvent('record_typed_entry', 'meds')
  }
  const toggle = id => update(r => ({
    ...r, medications: r.medications.map(m => m.id === id ? { ...m, status: m.status === 'on' ? 'off' : 'on' } : m)
  }))
  const drop = id => update(r => ({ ...r, medications: r.medications.filter(m => m.id !== id) }))

  return (
    <>
      <OcrPanel kind="meds" onEvent={onEvent} onDraft={(rows) => {
        if (!rows.length) return
        update(r => ({ ...r, medications: [...(r.medications || []), ...rows.map(x => ({ ...x, id: store.newId() }))] }))
      }} />
      <div className="card tight" style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {meds.length === 0
          ? <div className="empty"><span className="big">{t(T.none)}</span><span>{t(T.none_hint)}</span></div>
          : (
            <table className="tbl">
              <thead><tr>
                <th>{t(T.col_drug)}</th><th>{t(T.col_dose)}</th>
                <th>{t(T.col_indication)}</th><th>{t(T.col_status)}</th><th />
              </tr></thead>
              <tbody>
                {paged.slice.map(m => (
                  <tr key={m.id}>
                    <td><b>{m.drug}</b></td>
                    <td>{m.dose}</td>
                    <td>{m.indication || <span className="hint">—</span>}</td>
                    <td>
                      <button className={'pill ' + (m.status === 'on' ? 'on' : 'off')} onClick={() => toggle(m.id)}>
                        {t(m.status === 'on' ? T.status_on : T.status_off)}
                      </button>
                    </td>
                    <td><button className="pgbtn" onClick={() => drop(m.id)} aria-label={t(T.remove)}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        <span style={{ flex: 1 }} />
        <Pager page={paged.page} pages={paged.pages} onPage={paged.setPage} />
      </div>
      <div className="card tight">
        <div className="frm three">
          <Field label={t(T.col_drug)}>
            <input value={draft.drug} onChange={e => setDraft({ ...draft, drug: e.target.value })} />
          </Field>
          <Field label={t(T.col_dose)}>
            <input value={draft.dose} onChange={e => setDraft({ ...draft, dose: e.target.value })} placeholder="500 mg BD" />
          </Field>
          <Field label={t(T.col_indication)}>
            <input value={draft.indication} onChange={e => setDraft({ ...draft, indication: e.target.value })} />
          </Field>
        </div>
        <button className="btn wide" style={{ marginTop: 8 }} onClick={add} disabled={!draft.drug.trim()}>
          + {t(T.add)}
        </button>
      </div>
    </>
  )
}

function SimpleListSection ({ record, update, onEvent, field, columns, makeEmpty, detail }) {
  const [t] = useT()
  const [draft, setDraft] = useState(makeEmpty())
  const rows = record[field] || []
  const paged = usePaged(rows, PAGE.simple)
  const primary = columns[0].key

  const add = () => {
    if (!String(draft[primary] || '').trim()) return
    update(r => ({ ...r, [field]: [...(r[field] || []), { ...draft, id: store.newId() }] }))
    setDraft(makeEmpty())
    onEvent('record_typed_entry', detail)
  }
  const drop = id => update(r => ({ ...r, [field]: r[field].filter(x => x.id !== id) }))

  return (
    <>
      <div className="card tight" style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {rows.length === 0
          ? <div className="empty"><span className="big">{t(T.none)}</span><span>{t(T.none_hint)}</span></div>
          : (
            <table className="tbl">
              <thead><tr>{columns.map(c => <th key={c.key}>{t(c.label)}</th>)}<th /></tr></thead>
              <tbody>
                {paged.slice.map(row => (
                  <tr key={row.id}>
                    {columns.map(c => (
                      <td key={c.key}>
                        {c.render ? c.render(row, t) : (row[c.key] || <span className="hint">—</span>)}
                      </td>
                    ))}
                    <td><button className="pgbtn" onClick={() => drop(row.id)} aria-label={t(T.remove)}>✕</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        <span style={{ flex: 1 }} />
        <Pager page={paged.page} pages={paged.pages} onPage={paged.setPage} />
      </div>
      <div className="card tight">
        <div className={'frm ' + (columns.length > 2 ? 'three' : 'two')}>
          {columns.map(c => (
            <Field key={c.key} label={t(c.label)} hint={c.hint ? t(c.hint) : null}>
              {c.options
                ? (
                  <select value={draft[c.key]} onChange={e => setDraft({ ...draft, [c.key]: e.target.value })}>
                    {c.options.map(o => <option key={o.value} value={o.value}>{t(o.label)}</option>)}
                  </select>
                )
                : (
                  <input type={c.type || 'text'} value={draft[c.key] || ''}
                         onChange={e => setDraft({ ...draft, [c.key]: e.target.value })} />
                )}
            </Field>
          ))}
        </div>
        <button className="btn wide" style={{ marginTop: 8 }} onClick={add}
                disabled={!String(draft[primary] || '').trim()}>+ {t(T.add)}</button>
      </div>
    </>
  )
}

function BloodsSection ({ record, update, onEvent }) {
  const [t] = useT()
  const labs = record.labs || []
  const [draft, setDraft] = useState({ analyteId: LAB_PANEL[0].id, value: '', date: '', refLow: '', refHigh: '' })
  const [view, setView] = useState('list')
  const sorted = useMemo(() => [...labs].sort((a, b) => String(b.date).localeCompare(String(a.date))), [labs])
  const paged = usePaged(sorted, PAGE.labs)
  const analyte = LAB_PANEL.find(a => a.id === draft.analyteId)
  const needsRange = analyte && analyte.interpret === 'OWN_RANGE'

  const add = () => {
    if (draft.value === '' || !draft.date) return
    update(r => ({ ...r, labs: [...(r.labs || []), { ...draft, value: parseFloat(draft.value), id: store.newId() }] }))
    setDraft({ analyteId: draft.analyteId, value: '', date: '', refLow: '', refHigh: '' })
    onEvent('record_typed_entry', 'bloods')
  }
  const drop = id => update(r => ({ ...r, labs: r.labs.filter(x => x.id !== id) }))

  return (
    <>
      <div className="subtabs">
        <button className="subtab" aria-selected={view === 'list'} onClick={() => setView('list')}>{t(T.col_value)}</button>
        <button className="subtab" aria-selected={view === 'add'} onClick={() => setView('add')}>{t(T.add)}</button>
        <button className="subtab" aria-selected={view === 'photo'} onClick={() => setView('photo')}>{t(T.entry_camera)}</button>
      </div>

      {view === 'photo' ? (
        <OcrPanel kind="bloods" onEvent={onEvent} onDraft={(rows) => {
          if (!rows.length) return
          const today = new Date().toISOString().slice(0, 10)
          update(r => ({ ...r, labs: [...(r.labs || []), ...rows.map(x => ({ ...x, date: today, id: store.newId() }))] }))
          setView('list')
        }} />
      ) : null}

      {view === 'add' ? (
        <div className="card tight">
          <div className="frm two">
            <Field label={t(T.col_test)}>
              <select value={draft.analyteId} onChange={e => setDraft({ ...draft, analyteId: e.target.value, refLow: '', refHigh: '' })}>
                {LAB_PANEL.map(a => <option key={a.id} value={a.id}>{t(a.label)} ({a.unit})</option>)}
              </select>
            </Field>
            <Field label={t(T.col_date)}>
              <input type="date" value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} />
            </Field>
            <Field label={t(T.col_value) + ' (' + (analyte?.unit || '') + ')'}>
              <input type="number" step="any" inputMode="decimal" value={draft.value}
                     onChange={e => setDraft({ ...draft, value: e.target.value })} />
            </Field>
            {needsRange ? (
              <Field label={t(T.col_range)} hint={t(T.range_help)}>
                <div style={{ display: 'flex', gap: 6 }}>
                  <input type="number" step="any" inputMode="decimal" placeholder={t(T.range_low)}
                         value={draft.refLow} onChange={e => setDraft({ ...draft, refLow: e.target.value })} />
                  <input type="number" step="any" inputMode="decimal" placeholder={t(T.range_high)}
                         value={draft.refHigh} onChange={e => setDraft({ ...draft, refHigh: e.target.value })} />
                </div>
              </Field>
            ) : <div />}
          </div>
          <button className="btn wide" style={{ marginTop: 8 }} onClick={add}
                  disabled={draft.value === '' || !draft.date}>+ {t(T.add)}</button>
        </div>
      ) : null}

      {view === 'list' ? (
        <div className="card tight" style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {sorted.length === 0
            ? <div className="empty"><span className="big">{t(T.none)}</span><span>{t(T.none_hint)}</span></div>
            : (
              <table className="tbl">
                <thead><tr>
                  <th>{t(T.col_date)}</th><th>{t(T.col_test)}</th>
                  <th className="num">{t(T.col_value)}</th><th>{t(T.col_range)}</th><th />
                </tr></thead>
                <tbody>
                  {paged.slice.map(row => {
                    const a = LAB_PANEL.find(x => x.id === row.analyteId)
                    const f = classifyResult(row.analyteId, row.value, { low: row.refLow, high: row.refHigh })
                    return (
                      <tr key={row.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{row.date}</td>
                        <td>{a ? t(a.label) : row.analyteId}</td>
                        <td className="num">
                          <b style={{ color: f && f.level !== 'none' ? 'var(--attention)' : 'inherit' }}>{row.value}</b>
                          <span className="hint"> {a?.unit}</span>
                        </td>
                        <td className="hint">{row.refLow !== '' && row.refHigh !== '' ? `${row.refLow}–${row.refHigh}` : '—'}</td>
                        <td><button className="pgbtn" onClick={() => drop(row.id)} aria-label={t(T.remove)}>✕</button></td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          <span style={{ flex: 1 }} />
          <Pager page={paged.page} pages={paged.pages} onPage={paged.setPage} />
        </div>
      ) : null}
    </>
  )
}

function TabRecords ({ record, update, onEvent }) {
  const [t] = useT()
  const [section, setSection] = useState('meds')
  useEffect(() => { onEvent('record_section_open', REC_SECTIONS.find(s => s.id === section)?.detail || 'none') }, [section])

  return (
    <div className="pane">
      <div className="pane-head">
        <h1 className="pane-title">{t(T.tab_records)}</h1>
        <p className="pane-lead">{t(T.rec_lead)}</p>
      </div>
      <div className="subtabs">
        {REC_SECTIONS.map(s => (
          <button key={s.id} className="subtab" aria-selected={section === s.id} onClick={() => setSection(s.id)}>
            {t(s.label)}
          </button>
        ))}
      </div>
      <div className="pane-body">
        {section === 'meds' ? <MedsSection record={record} update={update} onEvent={onEvent} /> : null}

        {section === 'issues' ? (
          <SimpleListSection
            record={record} update={update} onEvent={onEvent} field="issues" detail="issues"
            makeEmpty={() => ({ text: '', since: '', status: 'active' })}
            columns={[
              { key: 'text', label: T.col_problem },
              { key: 'since', label: T.col_since, type: 'date' },
              { key: 'status', label: T.col_status, options: [
                { value: 'active', label: T.status_active }, { value: 'resolved', label: T.status_resolved }
              ], render: (row, tt) => (
                <span className={'pill ' + (row.status === 'active' ? 'on' : 'off')}>
                  {tt(row.status === 'active' ? T.status_active : T.status_resolved)}
                </span>
              ) }
            ]} />
        ) : null}

        {section === 'allergies' ? (
          <>
            <SimpleListSection
              record={record} update={update} onEvent={onEvent} field="allergies" detail="allergies"
              makeEmpty={() => ({ substance: '', reaction: '', severity: 'mild' })}
              columns={[
                { key: 'substance', label: T.col_substance },
                { key: 'reaction', label: T.col_reaction },
                { key: 'severity', label: T.col_severity, hint: T.sev_severe_help, options: [
                  { value: 'mild', label: T.sev_mild }, { value: 'severe', label: T.sev_severe }
                ], render: (row, tt) => (
                  <span className={'pill ' + (row.severity === 'severe' ? 'sev' : 'off')}>
                    {tt(row.severity === 'severe' ? T.sev_severe : T.sev_mild)}
                  </span>
                ) }
              ]} />
            {(record.allergies || []).length === 0 ? (
              <button className="btn quiet wide" onClick={() => {
                update(r => ({ ...r, allergies: [{ id: store.newId(), substance: pick(T.allergy_none_known_label, 'en'), reaction: '', severity: 'mild', noneKnown: true }] }))
                onEvent('record_typed_entry', 'allergies')
              }}>{t(T.allergy_none_known)}</button>
            ) : null}
          </>
        ) : null}

        {section === 'surgery' ? (
          <SimpleListSection
            record={record} update={update} onEvent={onEvent} field="surgeries" detail="surgery"
            makeEmpty={() => ({ name: '', date: '', where: '' })}
            columns={[
              { key: 'name', label: T.col_operation },
              { key: 'date', label: T.col_date, type: 'date' },
              { key: 'where', label: T.col_where }
            ]} />
        ) : null}

        {section === 'bloods' ? <BloodsSection record={record} update={update} onEvent={onEvent} /> : null}
      </div>
    </div>
  )
}

/* =========================================================================
   TAB 3 — Measurements
   ====================================================================== */
function TabMeasurements ({ record, update, onEvent }) {
  const [t] = useT()
  const [view, setView] = useState('now')
  const rows = useMemo(
    () => [...(record.measurements || [])].sort((a, b) => String(b.date).localeCompare(String(a.date))),
    [record.measurements]
  )
  const latest = rows[0]
  const lastHeight = rows.find(r => r.heightCm)?.heightCm || ''
  const [draft, setDraft] = useState({
    date: new Date().toISOString().slice(0, 10), weightKg: '', heightCm: lastHeight, waistCm: ''
  })
  const paged = usePaged(rows, PAGE.measurements)

  const liveBmi = calcBMI(draft.weightKg, draft.heightCm)
  const bmiF = latest ? classifyBMI(calcBMI(latest.weightKg, latest.heightCm)) : null
  const waistF = latest ? classifyWaist(latest.waistCm, record.sex) : null

  const save = () => {
    if (!draft.weightKg && !draft.waistCm) return
    update(r => ({
      ...r,
      measurements: [...(r.measurements || []), {
        id: store.newId(), date: draft.date,
        weightKg: draft.weightKg === '' ? null : parseFloat(draft.weightKg),
        heightCm: draft.heightCm === '' ? null : parseFloat(draft.heightCm),
        waistCm: draft.waistCm === '' ? null : parseFloat(draft.waistCm)
      }]
    }))
    setDraft({ ...draft, weightKg: '', waistCm: '' })
    onEvent('measurement_saved', 'manual')
    setView('now')
  }

  const weights = rows.filter(r => r.weightKg).slice(0, 12).reverse().map(r => r.weightKg)
  const wMin = Math.min(...weights), wMax = Math.max(...weights)

  return (
    <div className="pane">
      <div className="pane-head">
        <h1 className="pane-title">{t(T.tab_measurements)}</h1>
        <p className="pane-lead">{t(T.meas_lead)}</p>
      </div>
      <div className="subtabs">
        <button className="subtab" aria-selected={view === 'now'} onClick={() => setView('now')}>{t(T.m_bmi)}</button>
        <button className="subtab" aria-selected={view === 'add'} onClick={() => setView('add')}>{t(T.add)}</button>
        <button className="subtab" aria-selected={view === 'past'} onClick={() => setView('past')}>{t(T.m_history)}</button>
      </div>

      <div className="pane-body">
        {view === 'now' ? (
          latest ? (
            <>
              <div className="card tight">
                <dl className="kv">
                  <dt>{t(T.m_weight)}</dt><dd>{latest.weightKg ? latest.weightKg + ' kg' : '—'}</dd>
                  <dt>{t(T.m_height)}</dt><dd>{latest.heightCm ? latest.heightCm + ' cm' : '—'}</dd>
                  <dt>{t(T.m_waist)}</dt><dd>{latest.waistCm ? latest.waistCm + ' cm' : '—'}</dd>
                  <dt>{t(T.m_bmi)}</dt><dd>{calcBMI(latest.weightKg, latest.heightCm) ?? '—'}</dd>
                  <dt>{t(T.col_date)}</dt><dd>{latest.date}</dd>
                </dl>
                {weights.length > 1 ? (
                  <div className="sparkrow" style={{ marginTop: 9 }} aria-hidden="true">
                    {weights.map((w, i) => (
                      <i key={i} style={{ height: (wMax === wMin ? 50 : 10 + ((w - wMin) / (wMax - wMin)) * 90) + '%' }} />
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="scroller">
                {bmiF ? <Finding f={{ ...bmiF, folded: bmiF.level === 'none' }} /> : null}
                {waistF ? <Finding f={{ ...waistF, folded: waistF.level === 'none' }} /> : null}
              </div>
            </>
          ) : (
            <div className="empty">
              <span className="big">{t(T.none)}</span>
              <button className="btn" onClick={() => setView('add')}>+ {t(T.add)}</button>
            </div>
          )
        ) : null}

        {view === 'add' ? (
          <>
            <div className="card tight">
              <div className="frm two">
                <Field label={t(T.col_date)}>
                  <input type="date" value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} />
                </Field>
                <Field label={t(T.m_weight) + ' (kg)'}>
                  <input type="number" step="0.1" inputMode="decimal" value={draft.weightKg}
                         onChange={e => setDraft({ ...draft, weightKg: e.target.value })} />
                </Field>
                <Field label={t(T.m_height) + ' (cm)'}>
                  <input type="number" step="0.1" inputMode="decimal" value={draft.heightCm}
                         onChange={e => setDraft({ ...draft, heightCm: e.target.value })} />
                </Field>
                <Field label={t(T.m_waist) + ' (cm)'} hint={t(T.m_waist_how)}>
                  <input type="number" step="0.1" inputMode="decimal" value={draft.waistCm}
                         onChange={e => setDraft({ ...draft, waistCm: e.target.value })} />
                </Field>
              </div>
              {liveBmi ? <p className="hint" style={{ marginTop: 7 }}>{t(T.m_bmi)}: <b>{liveBmi}</b> kg/m²</p> : null}
            </div>
            <div className="card tight">
              <Field label={t(T.m_sex)} hint={t(T.m_sex_why)}>
                <select value={record.sex || ''} onChange={e => update(r => ({ ...r, sex: e.target.value || null }))}>
                  <option value="">—</option>
                  <option value="female">{t(T.m_female)}</option>
                  <option value="male">{t(T.m_male)}</option>
                </select>
              </Field>
            </div>
            <button className="btn wide" onClick={save} disabled={!draft.weightKg && !draft.waistCm}>{t(T.save)}</button>
          </>
        ) : null}

        {view === 'past' ? (
          <div className="card tight" style={{ flex: '1 1 auto', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {rows.length === 0
              ? <div className="empty"><span className="big">{t(T.none)}</span><span>{t(T.none_hint)}</span></div>
              : (
              <table className="tbl">
                <thead><tr>
                  <th>{t(T.col_date)}</th><th className="num">{t(T.m_weight)}</th>
                  <th className="num">{t(T.m_waist)}</th><th className="num">{t(T.m_bmi)}</th><th />
                </tr></thead>
                <tbody>
                  {paged.slice.map(r => (
                    <tr key={r.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{r.date}</td>
                      <td className="num">{r.weightKg ?? '—'}</td>
                      <td className="num">{r.waistCm ?? '—'}</td>
                      <td className="num">{calcBMI(r.weightKg, r.heightCm) ?? '—'}</td>
                      <td><button className="pgbtn" aria-label={t(T.remove)}
                                  onClick={() => update(x => ({ ...x, measurements: x.measurements.filter(m => m.id !== r.id) }))}>✕</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <span style={{ flex: 1 }} />
            <Pager page={paged.page} pages={paged.pages} onPage={paged.setPage} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

/* =========================================================================
   TAB 4 — Finding Your Way
   ====================================================================== */
function TabWayfinding ({ onEvent, online }) {
  const [t] = useT()
  const [view, setView] = useState('sites')
  const paged = usePaged(DEPARTMENTS, PAGE.depts)
  const open = (item) => { onEvent('wayfinding_map_opened', item.detailKey) }

  return (
    <div className="pane">
      <div className="pane-head">
        <h1 className="pane-title">{t(T.tab_wayfinding)}</h1>
        <p className="pane-lead">{t(T.way_lead)}</p>
      </div>
      <div className="subtabs">
        <button className="subtab" aria-selected={view === 'sites'} onClick={() => setView('sites')}>{t(T.way_campuses)}</button>
        <button className="subtab" aria-selected={view === 'depts'} onClick={() => setView('depts')}>
          {t(T.way_departments)} · {DEPARTMENTS.length}
        </button>
      </div>

      <div className="pane-body">
        {view === 'sites' ? (
          <>
            {CAMPUSES.map(c => (
              <a key={c.id} className="linkcard big" href={c.map} target="_blank" rel="noreferrer" onClick={() => open(c)}>
                <span className="nm">{t(c.name)}</span>
                <span className="sub">{t(c.blurb)}</span>
                <span className="go">{t(T.way_open_maps)} →</span>
              </a>
            ))}
            <div className="card tight">
              <p className="card-t">{t(BEFORE_YOU_COME.title)}</p>
              <ul className="bullets">{BEFORE_YOU_COME.points.map((p, i) => <li key={i}>{t(p)}</li>)}</ul>
            </div>
            <span style={{ flex: 1 }} />
            <div className="emergency">
              <div style={{ fontWeight: 800, marginBottom: 3 }}>⚠ {t(T.emergencyHead)}</div>
              {t(EMERGENCY.text)}
            </div>
            <p className="note">{online ? t(T.way_needs_net) : '⚠ ' + t(T.way_needs_net)}</p>
          </>
        ) : (
          <>
            {confirmedCount() < DEPARTMENTS.length ? (
              <div className="flagline">⚠ {t(T.way_unconfirmed_banner)}</div>
            ) : null}
            <div className="linkgrid">
              {paged.slice.map(d => (
                <a key={d.id} className={'linkcard' + (d.confirmed ? '' : ' unconfirmed')}
                   href={d.map} target="_blank" rel="noreferrer" onClick={() => open(d)}>
                  <span className="nm">{t(d.name)}</span>
                  <span className="sub">{d.confirmed ? t(T.way_open_maps) : t(UNCONFIRMED_NOTE)}</span>
                </a>
              ))}
            </div>
            <span style={{ flex: 1 }} />
            <Pager page={paged.page} pages={paged.pages} onPage={paged.setPage} />
          </>
        )}
      </div>
    </div>
  )
}

/* =========================================================================
   TAB 5 — Queue number (iQMS)
   ====================================================================== */
function TabIqms ({ onEvent, onLightbox }) {
  const [t] = useT()
  return (
    <div className="pane">
      <div className="pane-head">
        <h1 className="pane-title">{t(T.tab_iqms)}</h1>
        <p className="pane-lead">{t(T.iqms_lead)}</p>
      </div>
      <div className="pane-body" style={{ flexDirection: 'row', gap: 12 }}>
        <button className="postercard" style={{ flex: '0 0 36%', minHeight: 0 }}
                onClick={() => { onLightbox({ src: IQMS.poster, title: T.iqms_poster_alt }); onEvent('poster_opened', 'none') }}>
          <img src={IQMS.poster} alt={t(T.iqms_poster_alt)} />
          <span className="cap">{t(T.tapToEnlarge)}</span>
        </button>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="card tight" style={{ flex: '1 1 auto', minHeight: 0 }}>
            <ul className="bullets">{IQMS.points.map((p, i) => <li key={i}>{t(p)}</li>)}</ul>
          </div>
          <a className="btn wide" href={IQMS.url} target="_blank" rel="noreferrer"
             onClick={() => onEvent('iqms_opened', 'none')}>{t(T.iqms_open)} →</a>
          <p className="note">{t(T.needsInternet)}</p>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   TAB 6 — Medicine delivery (MyUbat)
   ====================================================================== */
function TabMyUbat ({ onEvent }) {
  const [t] = useT()
  const [view, setView] = useState('for')
  return (
    <div className="pane">
      <div className="pane-head">
        <h1 className="pane-title">{t(T.tab_myubat)}</h1>
        <p className="pane-lead">{t(T.ubat_lead)}</p>
      </div>
      <div className="subtabs">
        <button className="subtab" aria-selected={view === 'for'} onClick={() => setView('for')}>{t(T.ubat_good_for)}</button>
        <button className="subtab" aria-selected={view === 'not'} onClick={() => setView('not')}>{t(T.ubat_not_for)}</button>
      </div>
      <div className="pane-body">
        <div className="card tight">
          {view === 'for'
            ? <ul className="bullets">{MYUBAT.points.map((p, i) => <li key={i}>{t(p)}</li>)}</ul>
            : (
              <>
                <ul className="bullets">{MYUBAT.notFor.map((p, i) => <li key={i}>{t(p)}</li>)}</ul>
                <div className="flagline" style={{ marginTop: 10 }}>❄ {t(T.ubat_cold)} — {t(MYUBAT.coldChainWarning)}</div>
              </>
            )}
        </div>
        <span style={{ flex: 1 }} />
        <a className="btn wide" href={MYUBAT.url} target="_blank" rel="noreferrer"
           onClick={() => onEvent('myubat_opened', 'none')}>{t(T.ubat_open)} →</a>
        <p className="note">{t(T.needsInternet)}</p>
      </div>
    </div>
  )
}

/* =========================================================================
   TAB 7 — The Public's Role
   ====================================================================== */
function TabRakyat ({ onEvent, onLightbox }) {
  const [t] = useT()
  const [role, setRole] = useState(1)
  const items = useMemo(() => postersForRole(role), [role])
  const paged = usePaged(items, PAGE.posters)
  const roleObj = ROLES.find(r => r.role === role)

  return (
    <div className="pane">
      <div className="pane-head">
        <h1 className="pane-title">{t(POSTER_SECTION.title)}</h1>
        <p className="pane-lead">{t(POSTER_SECTION.subtitle)} · {t(POSTER_SECTION.lead)}</p>
      </div>
      <div className="subtabs">
        {ROLES.map(r => (
          <button key={r.role} className="subtab" aria-selected={role === r.role} onClick={() => setRole(r.role)}>
            {r.role ? r.role + '. ' : ''}{t(r.title)}
          </button>
        ))}
      </div>
      <div className="pane-body">
        <div className="postergrid">
          {paged.slice.map(p => (
            <button key={p.id} className="postercard"
                    onClick={() => { onLightbox(p); onEvent('poster_opened', roleObj?.detailKey || 'role_other') }}>
              <img src={p.src} alt={t(p.title)} loading="lazy" />
              <span className="cap">{t(p.title)}</span>
            </button>
          ))}
        </div>
        <span style={{ flex: 1 }} />
        <Pager page={paged.page} pages={paged.pages} onPage={paged.setPage} />
      </div>
    </div>
  )
}

/* =========================================================================
   Lightbox
   ====================================================================== */
function Lightbox ({ item, onClose, onEvent }) {
  const [t] = useT()
  if (!item) return null
  return (
    <div className="lightbox" role="dialog" aria-modal="true">
      <img src={item.src} alt={t(item.title)} />
      <div className="lbbar">
        <span>{t(item.title)}</span>
        {item.creditLabel ? <span style={{ opacity: .7 }}>· {t(T.poster_credit)} {t(item.creditLabel)}</span> : null}
        <span className="sp" />
        <a className="btn ghost" href={item.src} download onClick={() => onEvent('poster_downloaded', 'none')}>
          {t(T.poster_download)}
        </a>
        <button className="btn quiet" onClick={onClose}>{t(T.close)}</button>
      </div>
    </div>
  )
}

/* =========================================================================
   Consent — asked ONCE, before any question is answered. Declining is a
   first-class outcome: the app is identical either way and never asks again.
   Only shown at all when the client flag is on; with it off there is nothing
   to consent to and asking would be theatre.
   ====================================================================== */
function ConsentGate ({ onDecide }) {
  const [t] = useT()
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>{t(T.consent_title)}</h2>
        <div className="modal-scroll">
          <p className="card-s">{t(T.consent_body)}</p>
          <p className="card-s" style={{ marginTop: 8 }}>{t(PRIVACY.collectionOn)}</p>
          <p className="card-s" style={{ marginTop: 8 }}><b>{t(PRIVACY.declineIsFine)}</b></p>
        </div>
        <div className="btnrow">
          <button className="btn" onClick={() => onDecide('given')}>{t(T.consent_yes)}</button>
          <button className="btn quiet" onClick={() => onDecide('declined')}>{t(T.consent_no)}</button>
        </div>
        <p className="note">{t(T.consent_once)}</p>
      </div>
    </div>
  )
}

/* =========================================================================
   Privacy & settings
   ====================================================================== */
function PrivacyScreen ({ record, prefs, onClose, onClear, onEvent, exampleRecord }) {
  const [t] = useT()
  const [page, setPage] = useState(0)
  const enabled = COLLECTION_UI_ENABLED && prefs.consent === 'given'

  const doExport = () => {
    const url = URL.createObjectURL(store.exportBlob(record))
    const a = document.createElement('a')
    a.href = url
    a.download = 'patient-journey-htpn-' + new Date().toISOString().slice(0, 10) + '.json'
    a.click()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    onEvent('data_exported', 'none')
  }

  const pages = [
    (
      <div key="p0" style={{ display: 'grid', gap: 10 }}>
        <div className="card tight">
          <p className="card-t">{t(T.priv_ondevice)}</p>
          <p className="card-s">{t(PRIVACY.onDevice)}</p>
        </div>
        <div className="card tight">
          <p className="card-t">{t(T.priv_collection)}</p>
          <p className="card-s">{t(collectionStatement(enabled))}</p>
          {prefs.consent === 'declined'
            ? <p className="card-s" style={{ marginTop: 6 }}><b>{t(T.coll_declined)}</b></p> : null}
        </div>
        <div className="card tight">
          <p className="card-t">{t(T.priv_notadvice)}</p>
          <p className="card-s">{t(PRIVACY.notMedicalAdvice)}</p>
        </div>
      </div>
    ),
    (
      <div key="p1" style={{ display: 'grid', gap: 10 }}>
        <div className="card tight">
          <p className="card-t">{t(T.priv_controller)}</p>
          <p className="card-s">{t(CONTROLLER.name)}</p>
        </div>
        <div className="card tight">
          <p className="card-t">{t(T.priv_legal)}</p>
          <p className="card-s">{t(CONTROLLER.legalBasis)}</p>
        </div>
        <div className="card tight">
          <p className="card-t">{t(T.priv_ethics)}</p>
          <p className="card-s">{t(ETHICS.statement)}</p>
        </div>
      </div>
    ),
    (
      <div key="p2" style={{ display: 'grid', gap: 10 }}>
        <div className="card tight">
          <p className="card-t">{t(T.priv_sent_fields)}</p>
          <p className="card-s">{t(collectionStatement(enabled))}</p>
          {exampleRecord ? (
            <pre style={{
              margin: '8px 0 0', padding: 8, background: 'var(--bg)', border: '1px solid var(--line)',
              borderRadius: 8, fontSize: 10.5, maxHeight: 190, overflow: 'auto'
            }}>{JSON.stringify(exampleRecord, null, 1)}</pre>
          ) : null}
        </div>
        <div className="card tight">
          <p className="card-t">{t(T.priv_device_code)}</p>
          <p className="card-s" style={{ fontFamily: 'ui-monospace, monospace', fontSize: 16 }}>
            {prefs.deviceCode || '—'}
          </p>
        </div>
      </div>
    ),
    (
      <div key="p3" style={{ display: 'grid', gap: 10 }}>
        <button className="btn ghost wide" onClick={doExport}>{t(T.priv_export)}</button>
        <button className="btn danger wide" onClick={() => {
          if (globalThis.confirm(t(T.priv_clear_confirm))) { onClear(); onEvent('data_cleared', 'none') }
        }}>{t(T.priv_clear)}</button>
        <div className="card tight">
          <p className="card-s">{t(APP.brand)}</p>
          <p className="note" style={{ marginTop: 4 }}>
            {t(APP.name)} v{APP.version} · {t(APP.facility)}
          </p>
          <p className="note" style={{ marginTop: 6 }}>{t(EMERGENCY.text)}</p>
        </div>
      </div>
    )
  ]

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>{t(T.priv_title)}</h2>
        <div className="modal-scroll">{pages[page]}</div>
        <Pager page={page} pages={pages.length} onPage={setPage} label={t(T.step)} />
        <button className="btn wide" onClick={onClose}>{t(T.close)}</button>
      </div>
    </div>
  )
}

/* =========================================================================
   Printable clinic summary.

   The patient's name and IC are asked for HERE and held in React state only.
   They are never written to storage and never reach src/usage.js, which has
   no way to see them. The screen says so, next to the fields.
   ====================================================================== */
function PrintSheet ({ record, identifiers, lang }) {
  const t = (v) => pick(v, lang)
  const findings = reviewRecord(record).filter(f => f.level !== 'none')
  const meds = (record.medications || []).filter(m => m.status !== 'off')
  const allergies = record.allergies || []
  const issues = (record.issues || []).filter(i => i.status !== 'resolved')
  const ops = record.surgeries || []
  const labs = [...(record.labs || [])].sort((a, b) => String(b.date).localeCompare(String(a.date))).slice(0, 10)
  const m = [...(record.measurements || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)))[0]

  return (
    <div className="printonly">
      <h1>{t(T.print_title)}</h1>
      <p className="meta">
        {t(APP.name)} — {t(APP.facility)}<br />
        {identifiers.name ? <>{t(T.print_name)}: <b>{identifiers.name}</b><br /></> : null}
        {identifiers.ic ? <>{t(T.print_ic)}: <b>{identifiers.ic}</b><br /></> : null}
        {t(T.print_generated)} {new Date().toLocaleString()}
      </p>
      <p className="warn">{t(T.print_disclaimer)}</p>

      {allergies.length ? (
        <>
          <h2>{t(T.sec_allergies)}</h2>
          <table><tbody>
            {allergies.map(a => (
              <tr key={a.id}>
                <td><b>{a.substance}</b></td><td>{a.reaction}</td>
                <td>{t(a.severity === 'severe' ? T.sev_severe : T.sev_mild)}</td>
              </tr>
            ))}
          </tbody></table>
        </>
      ) : null}

      {meds.length ? (
        <>
          <h2>{t(T.sec_meds)}</h2>
          <table>
            <thead><tr><th>{t(T.col_drug)}</th><th>{t(T.col_dose)}</th><th>{t(T.col_indication)}</th></tr></thead>
            <tbody>{meds.map(x => <tr key={x.id}><td>{x.drug}</td><td>{x.dose}</td><td>{x.indication}</td></tr>)}</tbody>
          </table>
        </>
      ) : null}

      {issues.length ? (
        <>
          <h2>{t(T.sec_issues)}</h2>
          <table><tbody>{issues.map(i => <tr key={i.id}><td>{i.text}</td><td>{i.since}</td></tr>)}</tbody></table>
        </>
      ) : null}

      {ops.length ? (
        <>
          <h2>{t(T.sec_surgery)}</h2>
          <table><tbody>{ops.map(o => <tr key={o.id}><td>{o.name}</td><td>{o.date}</td><td>{o.where}</td></tr>)}</tbody></table>
        </>
      ) : null}

      {m ? (
        <>
          <h2>{t(T.tab_measurements)}</h2>
          <table><tbody><tr>
            <td>{t(T.m_weight)}: {m.weightKg ?? '—'} kg</td>
            <td>{t(T.m_height)}: {m.heightCm ?? '—'} cm</td>
            <td>{t(T.m_waist)}: {m.waistCm ?? '—'} cm</td>
            <td>{t(T.m_bmi)}: {calcBMI(m.weightKg, m.heightCm) ?? '—'}</td>
            <td>{m.date}</td>
          </tr></tbody></table>
        </>
      ) : null}

      {labs.length ? (
        <>
          <h2>{t(T.sec_bloods)}</h2>
          <table>
            <thead><tr><th>{t(T.col_date)}</th><th>{t(T.col_test)}</th><th>{t(T.col_value)}</th><th>{t(T.col_range)}</th></tr></thead>
            <tbody>{labs.map(l => {
              const a = LAB_PANEL.find(x => x.id === l.analyteId)
              return <tr key={l.id}>
                <td>{l.date}</td><td>{a ? t(a.label) : l.analyteId}</td>
                <td>{l.value} {a?.unit}</td>
                <td>{l.refLow !== '' && l.refHigh !== '' ? `${l.refLow}–${l.refHigh}` : '—'}</td>
              </tr>
            })}</tbody>
          </table>
        </>
      ) : null}

      {findings.length ? (
        <>
          <h2>{t(T.whatToDo)}</h2>
          <ul>{findings.map(f => <li key={f.id}><b>{t(f.title)}</b> — {t(f.detail)}</li>)}</ul>
          <p className="meta">
            {t(T.basedOn)}: {[...new Set(findings.map(f => f.source))].map(id => SRC[id] && t(SRC[id].short)).filter(Boolean).join(' · ')}
          </p>
        </>
      ) : null}
    </div>
  )
}

function PrintDialog ({ identifiers, setIdentifiers, onPrint, onClose }) {
  const [t] = useT()
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>{t(T.print_title)}</h2>
        <div className="modal-scroll">
          <div className="frm">
            <Field label={t(T.print_name)}>
              <input value={identifiers.name} onChange={e => setIdentifiers({ ...identifiers, name: e.target.value })} />
            </Field>
            <Field label={t(T.print_ic)}>
              <input value={identifiers.ic} onChange={e => setIdentifiers({ ...identifiers, ic: e.target.value })} />
            </Field>
          </div>
          <div className="flagline" style={{ marginTop: 10 }}>🔒 {t(T.print_identifiers_note)}</div>
        </div>
        <div className="btnrow">
          <button className="btn" onClick={onPrint}>{t(T.print_do)}</button>
          <button className="btn quiet" onClick={onClose}>{t(T.cancel)}</button>
        </div>
      </div>
    </div>
  )
}

/* =========================================================================
   The shell
   ====================================================================== */
const TABS = [
  { id: 'dashboard', label: T.tab_dashboard },
  { id: 'records', label: T.tab_records },
  { id: 'measurements', label: T.tab_measurements },
  { id: 'wayfinding', label: T.tab_wayfinding },
  { id: 'iqms', label: T.tab_iqms },
  { id: 'myubat', label: T.tab_myubat },
  { id: 'rakyat', label: T.tab_rakyat }
]

export default function App () {
  const [prefs, setPrefs] = useState(() => store.loadPrefs())
  const [record, setRecord] = useState(() => store.loadRecord())
  const [tab, setTab] = useState('dashboard')
  const [lightbox, setLightbox] = useState(null)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showPrint, setShowPrint] = useState(false)
  const [identifiers, setIdentifiers] = useState({ name: '', ic: '' })   /* never persisted */
  const [status, setStatus] = useState(COLLECTION_UI_ENABLED ? 'queued' : 'off')
  const [online, setOnline] = useState(globalThis.navigator?.onLine !== false)
  const lang = prefs.lang || DEFAULT_LANG
  const tabsSeen = useRef(new Set(['dashboard']))
  const sessionCode = useRef(null)

  /* one-time: stylesheet, device code, session code */
  useEffect(() => {
    const el = document.createElement('style')
    el.textContent = CSS
    document.head.appendChild(el)
    document.documentElement.lang = lang
    return () => el.remove()
  }, [])

  useEffect(() => { document.documentElement.lang = lang }, [lang])

  if (!sessionCode.current) {
    try { sessionCode.current = newDeviceCode() } catch { sessionCode.current = 'XXXXXXXX' }
  }

  useEffect(() => {
    if (prefs.deviceCode) return
    let code = null
    try { code = newDeviceCode() } catch { code = null }
    if (code) setPrefs(p => ({ ...p, deviceCode: code, isNew: true }))
  }, [prefs.deviceCode])

  useEffect(() => { store.savePrefs(prefs) }, [prefs])
  useEffect(() => { store.saveRecord(record) }, [record])
  useEffect(() => onUsageStatus(s => setStatus(s)), [])

  useEffect(() => {
    const up = () => setOnline(true), down = () => setOnline(false)
    globalThis.addEventListener('online', up)
    globalThis.addEventListener('offline', down)
    return () => { globalThis.removeEventListener('online', up); globalThis.removeEventListener('offline', down) }
  }, [])

  /* Usage counting. Automatic, never behind a button — a button loses everyone
     who consented and did not press it. The status line below makes it visible. */
  const onEvent = useCallback((action, detail) => {
    sendUsage({
      enabled: COLLECTION_UI_ENABLED,
      consent: prefs.consent,
      deviceCode: prefs.deviceCode,
      sessionCode: sessionCode.current,
      isNewDevice: !!prefs.isNew,
      lang,
      appVersion: APP.version,
      action, detail: detail || 'none', tab,
      tabsUsed: tabsSeen.current.size,
      recordsHeld: store.entryCount(record)
    })
  }, [prefs.consent, prefs.deviceCode, prefs.isNew, lang, tab, record])

  useEffect(() => { onEvent('app_open', 'none') }, [prefs.consent])

  const goTo = useCallback((id) => {
    tabsSeen.current.add(id)
    setTab(id)
  }, [])

  useEffect(() => { onEvent('tab_open', 'none') }, [tab])

  const update = useCallback((fn) => setRecord(r => fn(r)), [])

  const clearAll = async () => {
    await store.clearEverything()
    setRecord({ ...store.EMPTY_RECORD })
    setShowPrivacy(false)
  }

  const needConsent = COLLECTION_UI_ENABLED && !prefs.consent

  const statusText = {
    off: T.coll_off, declined: T.coll_declined, queued: T.coll_queued,
    sent: T.coll_sent, failed: T.coll_failed, refused: T.coll_refused
  }[status] || T.coll_off

  const exampleRecord = useMemo(() => {
    if (!COLLECTION_UI_ENABLED) return null
    try {
      return LAST_RECORD_FOR_DISPLAY({
        appVersion: APP.version,
        deviceCode: prefs.deviceCode,
        sessionCode: sessionCode.current,
        isNewDevice: !!prefs.isNew,
        lang,
        tabsUsed: tabsSeen.current.size,
        recordsHeld: store.entryCount(record)
      })
    } catch { return null }
  }, [prefs.deviceCode, prefs.isNew, lang, record])

  return (
    <LangCtx.Provider value={lang}>
      <div className="shell">
        <header className="hdr">
          <div>
            <div className="hdr-title">{pick(T.appName, lang)}</div>
            <div className="hdr-sub">{pick(T.appBy, lang)} · {pick(T.prototype, lang)}</div>
          </div>
          <span className="hdr-spacer" />
          <div className="langset">
            {LANGS.map(l => (
              <button key={l.id} className="hdr-btn" aria-pressed={lang === l.id} title={l.full}
                      onClick={() => { setPrefs(p => ({ ...p, lang: l.id })); onEvent('lang_switch', 'none') }}>
                {l.label}
              </button>
            ))}
          </div>
          <button className="hdr-btn" onClick={() => setShowPrivacy(true)} aria-label={pick(T.settings, lang)}>🔒</button>
        </header>

        {tab === 'dashboard' ? <TabDashboard record={record} goTo={goTo} onPrint={() => setShowPrint(true)} /> : null}
        {tab === 'records' ? <TabRecords record={record} update={update} onEvent={onEvent} /> : null}
        {tab === 'measurements' ? <TabMeasurements record={record} update={update} onEvent={onEvent} /> : null}
        {tab === 'wayfinding' ? <TabWayfinding onEvent={onEvent} online={online} /> : null}
        {tab === 'iqms' ? <TabIqms onEvent={onEvent} onLightbox={setLightbox} /> : null}
        {tab === 'myubat' ? <TabMyUbat onEvent={onEvent} /> : null}
        {tab === 'rakyat' ? <TabRakyat onEvent={onEvent} onLightbox={setLightbox} /> : null}

        <nav className="tabbar">
          {TABS.map(x => (
            <button key={x.id} className="tabbtn" aria-selected={tab === x.id} onClick={() => goTo(x.id)}>
              <Icon d={ICONS[x.id]} />
              <span className="tablabel">{pick(x.label, lang)}</span>
              <span className="tabdot" />
            </button>
          ))}
        </nav>

        <div className="statusbar">
          <span className={'dot ' + (status === 'sent' ? '' : status === 'failed' || status === 'refused' ? 'bad' : 'off')} />
          <span>{pick(statusText, lang)}</span>
          <span className="sp" />
          <span>{online ? pick(T.offlineReady, lang) : '⚠ ' + pick(T.offlineReady, lang)}</span>
        </div>
      </div>

      <PrintSheet record={record} identifiers={identifiers} lang={lang} />

      {lightbox ? <Lightbox item={lightbox} onClose={() => setLightbox(null)} onEvent={onEvent} /> : null}
      {needConsent ? <ConsentGate onDecide={(d) => {
        setPrefs(p => ({ ...p, consent: d }))
        onEvent(d === 'given' ? 'consent_given' : 'consent_declined', 'none')
      }} /> : null}
      {showPrivacy ? (
        <PrivacyScreen record={record} prefs={prefs} onClose={() => setShowPrivacy(false)}
                       onClear={clearAll} onEvent={onEvent} exampleRecord={exampleRecord} />
      ) : null}
      {showPrint ? (
        <PrintDialog identifiers={identifiers} setIdentifiers={setIdentifiers}
                     onClose={() => setShowPrint(false)}
                     onPrint={() => { onEvent('summary_printed', 'none'); setShowPrint(false); setTimeout(() => globalThis.print(), 60) }} />
      ) : null}
    </LangCtx.Provider>
  )
}
