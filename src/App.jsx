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
import { SRC, LAB_PANEL, BMI_BANDS, WAIST_THRESHOLD, BP_THRESHOLD, ACTIVITY_TARGET } from './engine/sources.js'
import { calcBMI, classifyBMI, classifyWaist, classifyBP } from './engine/anthro.js'
import { classifyResult, seriesFor } from './engine/labs.js'
import { reviewRecord, summarise } from './engine/review.js'
import * as store from './storage.js'
import { readText, draftMedicationsFrom, draftLabsFrom, draftDateFrom, ocrAvailable } from './ocr.js'
import { sendUsage, onUsageStatus, newDeviceCode, LAST_RECORD_FOR_DISPLAY } from './usage.js'
import { CAMPUSES, DEPARTMENTS, UNCONFIRMED_NOTE, DIRECTIONS_NOTE, directionsUrl, confirmedCount } from './data/wayfinding.js'
import { IQMS, MYUBAT, EMERGENCY, BEFORE_YOU_COME } from './data/services.js'
import { SECTION as POSTER_SECTION, ROLES, POSTERS, postersForRole } from './data/posters.js'
import { TRIAGE, TRIAGE_SOURCE } from './data/triage.js'
import { CAMPAIGN, HASHTAG } from './data/campaign.js'
import { THEME, ARTICLE, ANNOUNCEMENT } from './data/announcement.js'
import { GLYPH, TRIAGE_GLYPHS } from './data/glyphs.js'
import { Stat, AllergyTile, LineChart, MultiLineChart, StackedBar, Meter, DayBars, Art } from './charts.jsx'

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
/* Department glyphs. Deliberately icons rather than photographs: a stock or
   generated picture of "a radiology department" is a picture of somewhere
   else, and on a way-finding screen a patient would take it for a landmark to
   look for. An icon says what the department does and claims nothing more. */
const DEPT_ICONS = {
  clinic: ['M12 3v6M9 6h6', 'M5 9h14v11H5z', 'M9 20v-5h6v5'],
  office: ['M4 20V6l8-3 8 3v14', 'M9 20v-5h6v5', 'M8 10h.01M12 10h.01M16 10h.01'],
  radiology: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 3v18', 'M4.5 8h15M4.5 16h15'],
  emergency: ['M12 3l9 16H3z', 'M12 9v5', 'M12 17h.01'],
  rehab: ['M5 20l4-7 3 2 3-5 4 10', 'M8 6a1.6 1.6 0 1 0 0-3.2A1.6 1.6 0 0 0 8 6z'],
  dental: ['M7 3c2 0 2 1.4 5 1.4S15 3 17 3c2.4 0 3 2.4 2.4 5.6-.6 3.2-1.4 4-2 7.4-.5 3-1 5-2.4 5-1.6 0-1.4-4-3-4s-1.4 4-3 4c-1.4 0-1.9-2-2.4-5-.6-3.4-1.4-4.2-2-7.4C4 5.4 4.6 3 7 3z'],
  pharmacy: ['M5 8h14l-1.4 11.2A2 2 0 0 1 15.6 21H8.4a2 2 0 0 1-2-1.8z', 'M9 8V5h6v3', 'M12 11v6M9 14h6'],
  it: ['M3 5h18v11H3z', 'M8 20h8M12 16v4'],
  pin: ['M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z', 'M12 10.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z']
}

const ICONS = {
  dashboard: ['M3 12h4l2.5 7 5-14L17 12h4'],
  records: ['M6 3h9l3 3v15H6z', 'M9 10h7', 'M9 14h7', 'M9 18h4'],
  measurements: ['M3 7h18v10H3z', 'M7 7v4', 'M11 7v6', 'M15 7v4', 'M19 7v6'],
  wayfinding: ['M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z', 'M12 10.5a1.8 1.8 0 1 0 0-3.6 1.8 1.8 0 0 0 0 3.6z'],
  iqms: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7.5V12l3 2'],
  myubat: ['M4.5 13.5l9-9a4.6 4.6 0 0 1 6.5 6.5l-9 9a4.6 4.6 0 0 1-6.5-6.5z', 'M9 9l6 6'],
  rakyat: ['M12 20.5s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7.8a4.2 4.2 0 0 1 7.5 2.7c0 5.4-7.5 10-7.5 10z'],
  gayahidup: ['M13.5 5.2a1.7 1.7 0 1 0 0-3.4 1.7 1.7 0 0 0 0 3.4z', 'M10 21l2-5.5-2.5-2.5.8-4.5 3.2 2.5 3 1', 'M9.3 8.5L6 10l-1 3.5', 'M12 15.5L8.5 21']
}

const shortDate = (iso) => String(iso || '').slice(2).replace(/-/g, '/')

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

/* True on a phone-width screen. Used to decide how many chart cards fit a
   page; the alternative is letting the fourth one spill, which the layout
   rule does not allow. */
function useNarrow () {
  const [narrow, setNarrow] = useState(
    () => typeof matchMedia === 'function' && matchMedia('(max-width: 560px)').matches
  )
  useEffect(() => {
    if (typeof matchMedia !== 'function') return
    const mq = matchMedia('(max-width: 560px)')
    const on = e => setNarrow(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return narrow
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

   Three sub-tabs so that each fits one screen without scrolling:
     Overview  — the figures and the trends
     Needs attention — the findings the engine ranked as actionable
     Reviewed  — the findings with nothing to act on, folded (never deleted)
   ====================================================================== */

function Overview ({ record }) {
  const [t, lang] = useT()
  const narrow = useNarrow()

  const meds = record.medications || []
  const onMeds = meds.filter(m => m.status !== 'off')
  const issues = (record.issues || []).filter(i => i.status !== 'resolved')
  const allergies = record.allergies || []
  const severe = allergies.filter(a => a.severity === 'severe').length

  const labDates = (record.labs || []).map(l => l.date).filter(Boolean).sort()
  const lastLab = labDates[labDates.length - 1]
  const daysSince = lastLab
    ? Math.max(0, Math.round((Date.now() - new Date(lastLab + 'T00:00:00').getTime()) / 86400000))
    : null

  const hba1c = seriesFor(record.labs, 'hba1c').map(r => ({ label: shortDate(r.date), value: r.value }))
  const fpg = seriesFor(record.labs, 'fpg').map(r => ({ label: shortDate(r.date), value: r.value }))
  const measures = (record.measurements || [])
    .filter(m => m.date)
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))
  const weights = measures
    .filter(m => Number.isFinite(Number(m.weightKg)))
    .map(m => ({ label: shortDate(m.date), value: m.weightKg }))
  /* BMI is computed by the engine, not recomputed here, so the chart and the
     finding can never disagree about what the number is. */
  const bmis = measures
    .map(m => ({ label: shortDate(m.date), value: calcBMI(m.weightKg, m.heightCm) }))
    .filter(p => p.value !== null)
  /* Both series come from the same rows, so the two lines always line up on
     the same dates rather than being interleaved from separate lists. */
  const bpRows = measures.filter(m => m.systolic != null && m.diastolic != null)
  const bpSeries = [
    { key: 'sys', label: t(T.m_sys), points: bpRows.map(m => ({ label: shortDate(m.date), value: m.systolic })) },
    { key: 'dia', label: t(T.m_dia), points: bpRows.map(m => ({ label: shortDate(m.date), value: m.diastolic })) }
  ]

  /* Medicines grouped by what they are for. Four named groups at most, the
     tail folded into "Other" — never a generated ninth colour. */
  const byIndication = useMemo(() => {
    const counts = new Map()
    for (const m of onMeds) {
      const key = (m.indication || '').trim() || pick(T.chart_not_recorded, lang)
      counts.set(key, (counts.get(key) || 0) + 1)
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1])
    const head = sorted.slice(0, 3).map(([label, value]) => ({ label, value }))
    const tail = sorted.slice(3).reduce((n, [, v]) => n + v, 0)
    if (tail) head.push({ label: pick(T.chart_other, lang), value: tail })
    return head
  }, [onMeds, lang])

  const tableLabels = {
    date: t(T.col_date), value: t(T.col_value), name: t(T.col_indication),
    tableView: t(T.chart_table_view), chartView: t(T.chart_chart_view)
  }

  const cards = [
    {
      id: 'hba1c', plottable: hba1c.length >= 2,
      node: (
        <div className="card tight">
          <p className="chart-t"><span className="ct-ic"><Icon d={GLYPH.droplet} /></span>{t(T.chart_hba1c)} (%)</p>
          <LineChart points={hba1c} unit="%" cutoff={6.5}
                     emptyText={t(T.chart_need_two)} tableLabels={tableLabels} />
          <p className="cite" style={{ marginTop: 4 }}>
            <span className="cutkey" /> {t(T.chart_cutoff)} 6.5% — <b>{t(T.basedOn)}:</b> {t(SRC.WHO_HBA1C_2011.short)}
          </p>
        </div>
      )
    },
    {
      id: 'fpg', plottable: fpg.length >= 2,
      node: (
        <div className="card tight">
          <p className="chart-t"><span className="ct-ic"><Icon d={GLYPH.droplet} /></span>{t(T.chart_fpg)} (mmol/L)</p>
          {/* Both cited lines, not just one: 6.1 opens the raised band and 7.0
              is the diagnostic threshold. Showing one would misstate WHO. */}
          <LineChart points={fpg} unit="mmol/L" cutoff={[6.1, 7.0]}
                     emptyText={t(T.chart_need_two)} tableLabels={tableLabels} />
          <p className="cite" style={{ marginTop: 4 }}>
            <span className="cutkey" /> {t(T.chart_cutoff)} 6.1 / 7.0 — <b>{t(T.basedOn)}:</b> {t(SRC.WHO_IDF_2006_GLUCOSE.short)}
          </p>
        </div>
      )
    },
    {
      id: 'bp', plottable: bpRows.length >= 2,
      node: (
        <div className="card tight">
          <p className="chart-t"><span className="ct-ic"><Icon d={GLYPH.heartbeat} /></span>{t(T.chart_bp)} (mmHg)</p>
          <MultiLineChart series={bpSeries} unit="mmHg"
                          refLines={[{ value: BP_THRESHOLD.raisedSystolic }, { value: BP_THRESHOLD.raisedDiastolic }]}
                          emptyText={t(T.chart_need_two)} tableLabels={tableLabels} />
          <p className="cite" style={{ marginTop: 4 }}>
            <span className="cutkey" /> {t(T.chart_cutoff)} 140 / 90 — <b>{t(T.basedOn)}:</b> {t(SRC.WHO_HTN_2021.short)}
          </p>
        </div>
      )
    },
    {
      id: 'weight', plottable: weights.length >= 2,
      node: (
        <div className="card tight">
          <p className="chart-t"><span className="ct-ic"><Icon d={GLYPH.scale} /></span>{t(T.chart_weight)} (kg)</p>
          <LineChart points={weights} unit="kg"
                     emptyText={t(T.chart_need_two)} tableLabels={tableLabels} />
        </div>
      )
    },
    {
      id: 'bmi', plottable: bmis.length >= 2,
      node: (
        <div className="card tight">
          <p className="chart-t"><span className="ct-ic"><Icon d={GLYPH.ruler} /></span>{t(T.chart_bmi)} (kg/m²)</p>
          <LineChart points={bmis} unit="kg/m²" cutoff={23.0}
                     emptyText={t(T.chart_need_two)} tableLabels={tableLabels} />
          <p className="cite" style={{ marginTop: 4 }}>
            <span className="cutkey" /> {t(T.chart_cutoff)} 23.0 — <b>{t(T.basedOn)}:</b> {t(SRC.WHO_ASIA_PACIFIC_2000.short)}
          </p>
        </div>
      )
    },
    {
      id: 'meds', plottable: false,
      node: (
        <div className="card tight">
          <p className="chart-t"><span className="ct-ic"><Icon d={GLYPH.pill} /></span>{t(T.chart_meds_by)}</p>
          {byIndication.length
            ? <StackedBar parts={byIndication} total={onMeds.length} tableLabels={tableLabels} />
            : <p className="chart-empty">{t(T.none)}</p>}
        </div>
      )
    }
  ]

  /* A phone scrolls, so there is nothing to page around; a tablet does not,
     so three cards is what a page holds there. */
  const paged = usePaged(cards, narrow ? cards.length : 3)

  return (
    <>
      <div className="kpirow">
        <Stat label={t(T.kpi_meds)} value={onMeds.length} sub={t(T.kpi_meds_sub)}
              icon={<Icon d={GLYPH.pill} />} />
        <Stat label={t(T.kpi_issues)} value={issues.length} sub={t(T.kpi_issues_sub)}
              icon={<Icon d={GLYPH.problem} />} />
        <AllergyTile
          label={t(T.kpi_allergy)}
          substances={allergies.map(a => String(a.substance || '').trim()).filter(Boolean)}
          severe={severe > 0}
          severeLabel={t(T.sev_severe)}
          moreLabel={t(T.kpi_allergy_more)}
          icon={<Icon d={GLYPH.rash} />}
          emptyText={t(T.kpi_allergy_none)} />
        <Stat label={t(T.kpi_lastlab)}
              value={daysSince === null ? '—' : daysSince}
              sub={daysSince === null ? t(T.kpi_never) : t(T.kpi_days_ago)}
              icon={<Icon d={GLYPH.droplet} />} />
      </div>

      {/* A card that cannot plot anything yet should not hold a full row open,
          so each row is sized from whether that chart has a trend to draw. */}
      <div className="chartgrid" style={{
        /* The template must describe the rows actually rendered, not every
           card in the set. Built from all six it declared six rows for three
           items, so the cards landed on the min-content rows and the 1fr rows
           sat empty underneath — which is why the charts stayed small. */
        gridTemplateRows: paged.slice
          .map(c => (!narrow && c.plottable ? 'minmax(0, 1fr)' : 'min-content')).join(' ')
      }}>
        {paged.slice.map(c => <React.Fragment key={c.id}>{c.node}</React.Fragment>)}
      </div>
      <Pager page={paged.page} pages={paged.pages} onPage={paged.setPage} />
    </>
  )
}

function TabDashboard ({ record, goTo, onPrint }) {
  const [t] = useT()
  /* The dashboard shows the patient's own record and nothing else. An earlier
     version filled an empty dashboard with a worked example to avoid a blank
     screen. That was wrong: invented numbers on a clinical screen are
     dangerous even behind a label, because a label can be missed and a figure
     cannot be unseen. An empty record now reads zero, which is the truth. */
  const isEmpty = store.entryCount(record) === 0
  const shown = record

  const findings = useMemo(() => reviewRecord(shown), [shown])
  const actionable = findings.filter(f => f.level !== 'none')
  const quiet = findings.filter(f => f.level === 'none')
  const [view, setView] = useState('overview')
  const narrow = useNarrow()
  const list = view === 'actions' ? actionable : quiet
  const paged = usePaged(list, narrow ? list.length || 1 : 4)

  return (
    <div className="pane">
      <div className="pane-head">
        <h1 className="pane-title">{t(T.tab_dashboard)}</h1>
        <p className="pane-lead">{t(T.dash_lead)}</p>
      </div>

      <button className="multibar" onClick={() => goTo('records')}>
        <span className="mb-i">⌁</span>
        <span className="mb-t">
          <b>{t(ANNOUNCEMENT.title)}</b>
          <span>{t(ANNOUNCEMENT.medsNote)}</span>
        </span>
        <span className="mb-go">›</span>
      </button>

      {isEmpty ? (
        <div className="emptybar">
          <span>{t(T.dash_empty_body)}</span>
          <span className="sp" />
          <button className="btn" style={{ padding: '6px 11px', fontSize: 12 }} onClick={() => goTo('records')}>
            {t(T.dash_empty_cta)}
          </button>
        </div>
      ) : null}

      <div className="subtabs">
        <button className="subtab" aria-selected={view === 'overview'} onClick={() => setView('overview')}>
          {t(T.dash_sub_overview)}
        </button>
        <button className="subtab" aria-selected={view === 'actions'} onClick={() => setView('actions')}>
          {t(T.dash_sub_actions)} · {actionable.length}
        </button>
        <button className="subtab" aria-selected={view === 'checked'} onClick={() => setView('checked')}>
          {t(T.dash_sub_checked)} · {quiet.length}
        </button>
      </div>

      <div className="pane-body">
        {view === 'overview'
          ? <Overview record={shown} />
          : list.length === 0
            ? <div className="empty"><span className="big">{t(T.dash_nothing_to_act)}</span></div>
            : <div className="scroller">{paged.slice.map(f => <Finding key={f.id} f={f} />)}</div>}
      </div>

      <div className="pane-foot" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 8 }}>
        {view !== 'overview' ? <Pager page={paged.page} pages={paged.pages} onPage={paged.setPage} /> : null}
        <button className="btn ghost wide" onClick={onPrint} disabled={isEmpty}>{t(T.dash_print)}</button>
      </div>
    </div>
  )
}

/* =========================================================================
   TAB 2 — My Records.  Five sections as sub-tabs, which is what keeps each
   one inside one screen. Each section has its own entry route: photograph,
   upload, or type.
   ====================================================================== */

/* The six stations of the record, in the order a patient is asked for them at
   a clinic desk. `field` is what makes a station count as done, which is what
   drives the progress state on the pipeline. */
const REC_SECTIONS = [
  { id: 'meds', label: T.sec_meds, short: T.short_meds, detail: 'meds', field: 'medications' },
  { id: 'issues', label: T.sec_issues, short: T.short_issues, detail: 'issues', field: 'issues' },
  { id: 'allergies', label: T.sec_allergies, short: T.short_allergies, detail: 'allergies', field: 'allergies' },
  { id: 'surgery', label: T.sec_surgery, short: T.short_surgery, detail: 'surgery', field: 'surgeries' },
  { id: 'bloods', label: T.sec_bloods, short: T.short_bloods, detail: 'bloods', field: 'labs' },
  { id: 'imaging', label: T.sec_imaging, short: T.short_imaging, detail: 'bloods', field: 'imaging' }
]

/* The pipeline. Numbered, connected, and filled in as each station gets its
   first entry — so "where am I up to" is answerable at a glance, which is the
   thing the plain row of pills did not say. */
function Stations ({ record, current, onPick }) {
  const [t] = useT()
  return (
    <div className="stationwrap">
      <div className="stations" role="tablist">
        {REC_SECTIONS.map((sec, i) => {
          const done = (record[sec.field] || []).length > 0
          return (
            <button key={sec.id} role="tab" className={'station' + (done ? ' done' : '')}
                    aria-selected={current === sec.id} onClick={() => onPick(sec.id)}>
              <span className="num">{done ? '✓' : i + 1}</span>
              <span className="nm">{t(sec.short || sec.label)}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

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
  const [draft, setDraft] = useState({ drug: '', dose: '', indication: '', status: 'on', startedOn: '', endsOn: '' })
  const meds = record.medications || []
  const paged = usePaged(meds, PAGE.meds)

  const add = () => {
    if (!draft.drug.trim()) return
    update(r => ({ ...r, medications: [...(r.medications || []), { ...draft, id: store.newId() }] }))
    setDraft({ drug: '', dose: '', indication: '', status: 'on', startedOn: '', endsOn: '' })
    onEvent('record_typed_entry', 'meds')
  }
  const toggle = id => update(r => ({
    ...r, medications: r.medications.map(m => m.id === id ? { ...m, status: m.status === 'on' ? 'off' : 'on' } : m)
  }))
  const drop = id => update(r => ({ ...r, medications: r.medications.filter(m => m.id !== id) }))

  return (
    <>
      <p className="note multisite">⌁ {t(ANNOUNCEMENT.medsNote)}</p>
      <OcrPanel kind="meds" onEvent={onEvent} onDraft={(rows) => {
        if (!rows.length) return
        update(r => ({ ...r, medications: [...(r.medications || []), ...rows.map(x => ({ ...x, id: store.newId() }))] }))
      }} />
      <div className="card tight listcard">
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
                    <td>
                      <b>{m.drug}</b>
                      {m.startedOn ? <div className="hint">{t(T.med_since)} {m.startedOn}</div> : null}
                    </td>
                    <td>{m.dose}</td>
                    <td>{m.indication || <span className="hint">—</span>}</td>
                    <td>
                      <button className={'pill ' + (m.status === 'on' ? 'on' : 'off')} onClick={() => toggle(m.id)}>
                        {t(m.status === 'on' ? T.status_on : T.status_off)}
                      </button>
                      {m.endsOn ? (
                        <div className="hint">
                          {m.status === 'on' ? t(T.med_until) : t(T.status_off).toLowerCase()} {m.endsOn}
                        </div>
                      ) : null}
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
          <Field label={t(T.col_status)}>
            <select value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value })}>
              <option value="on">{t(T.status_on)}</option>
              <option value="off">{t(T.status_off)}</option>
            </select>
          </Field>
          <Field label={t(T.col_started)}>
            <input type="date" value={draft.startedOn}
                   onChange={e => setDraft({ ...draft, startedOn: e.target.value })} />
          </Field>
          {/* The same field means two different things, so it is labelled by
              the status rather than carrying a label that is half wrong. */}
          <Field label={draft.status === 'on' ? t(T.col_until) : t(T.col_stopped)}
                 hint={draft.status === 'on' ? t(T.med_until_help) : t(T.med_stopped_help)}>
            <input type="date" value={draft.endsOn}
                   onChange={e => setDraft({ ...draft, endsOn: e.target.value })} />
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
      <div className="card tight listcard">
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
        <div className="card tight listcard">
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

const MODALITIES = [
  { value: 'ct', label: T.modality_ct },
  { value: 'mri', label: T.modality_mri },
  { value: 'us', label: T.modality_us },
  { value: 'xray', label: T.modality_xray },
  { value: 'other', label: T.modality_other }
]

/* Imaging reports. The app stores the CONCLUSION the patient copies from the
   report, not the whole report, and never interprets it — an imaging finding
   has no threshold to compare against and no guideline in this app behind it.
   It is kept so the patient can say what the last scan showed. */
function ImagingSection ({ record, update, onEvent }) {
  const [t] = useT()
  const rows = useMemo(
    () => [...(record.imaging || [])].sort((a, b) => String(b.date).localeCompare(String(a.date))),
    [record.imaging]
  )
  const paged = usePaged(rows, PAGE.simple)
  const [draft, setDraft] = useState({ modality: 'ct', bodyPart: '', date: '', finding: '' })
  const [view, setView] = useState('list')

  const add = () => {
    if (!draft.finding.trim()) return
    update(r => ({ ...r, imaging: [...(r.imaging || []), { ...draft, id: store.newId() }] }))
    setDraft({ modality: draft.modality, bodyPart: '', date: '', finding: '' })
    onEvent('record_typed_entry', 'bloods')
    setView('list')
  }
  const drop = id => update(r => ({ ...r, imaging: r.imaging.filter(x => x.id !== id) }))

  return (
    <>
      <div className="subtabs">
        <button className="subtab" aria-selected={view === 'list'} onClick={() => setView('list')}>{t(T.col_value)}</button>
        <button className="subtab" aria-selected={view === 'add'} onClick={() => setView('add')}>{t(T.add)}</button>
        <button className="subtab" aria-selected={view === 'photo'} onClick={() => setView('photo')}>{t(T.entry_camera)}</button>
      </div>

      {view === 'photo' ? (
        <OcrPanel kind="imaging" onEvent={onEvent} onDraft={(_, text) => {
          setDraft(d => ({ ...d, finding: String(text || '').slice(0, 300), date: draftDateFrom(text) || d.date }))
          setView('add')
        }} />
      ) : null}

      {view === 'add' ? (
        <div className="card tight">
          <div className="frm two">
            <Field label={t(T.col_modality)}>
              <select value={draft.modality} onChange={e => setDraft({ ...draft, modality: e.target.value })}>
                {MODALITIES.map(m => <option key={m.value} value={m.value}>{t(m.label)}</option>)}
              </select>
            </Field>
            <Field label={t(T.col_date)}>
              <input type="date" value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} />
            </Field>
            <Field label={t(T.col_bodypart)}>
              <input value={draft.bodyPart} onChange={e => setDraft({ ...draft, bodyPart: e.target.value })} />
            </Field>
            <Field label={t(T.col_finding)} hint={t(T.img_help)}>
              <input value={draft.finding} onChange={e => setDraft({ ...draft, finding: e.target.value })} />
            </Field>
          </div>
          <button className="btn wide" style={{ marginTop: 8 }} onClick={add}
                  disabled={!draft.finding.trim()}>+ {t(T.add)}</button>
        </div>
      ) : null}

      {view === 'list' ? (
        <div className="card tight listcard">
          <p className="hint" style={{ marginBottom: 6 }}>{t(T.img_lead)}</p>
          {rows.length === 0
            ? <div className="empty"><span className="big">{t(T.none)}</span><span>{t(T.none_hint)}</span></div>
            : (
              <table className="tbl">
                <thead><tr>
                  <th>{t(T.col_date)}</th><th>{t(T.col_modality)}</th>
                  <th>{t(T.col_bodypart)}</th><th>{t(T.col_finding)}</th><th />
                </tr></thead>
                <tbody>
                  {paged.slice.map(r => {
                    const m = MODALITIES.find(x => x.value === r.modality)
                    return (
                      <tr key={r.id}>
                        <td style={{ whiteSpace: 'nowrap' }}>{r.date || '—'}</td>
                        <td>{m ? t(m.label) : r.modality}</td>
                        <td>{r.bodyPart || <span className="hint">—</span>}</td>
                        <td>{r.finding}</td>
                        <td><button className="pgbtn" onClick={() => drop(r.id)} aria-label={t(T.remove)}>✕</button></td>
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
      <Stations record={record} current={section} onPick={setSection} />
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
        {section === 'imaging' ? <ImagingSection record={record} update={update} onEvent={onEvent} /> : null}
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
    date: new Date().toISOString().slice(0, 10), weightKg: '', heightCm: lastHeight,
    waistCm: '', systolic: '', diastolic: '', fpg: ''
  })
  const paged = usePaged(rows, PAGE.measurements)

  const liveBmi = calcBMI(draft.weightKg, draft.heightCm)
  const bmiF = latest ? classifyBMI(calcBMI(latest.weightKg, latest.heightCm)) : null
  const waistF = latest ? classifyWaist(latest.waistCm, record.gender) : null
  const latestBP = rows.find(r => r.systolic != null && r.diastolic != null)
  const latestFpg = seriesFor(record.labs, 'fpg').slice(-1)[0] || null
  const bpF = latestBP ? classifyBP(latestBP.systolic, latestBP.diastolic) : null

  const save = () => {
    if (!draft.weightKg && !draft.waistCm && !draft.systolic && !draft.fpg) return
    update(r => ({
      ...r,
      /* A fasting sugar taken at home and one taken by the laboratory are the
         same measurement, so they go to the same place rather than to two
         lists that would each tell half the story. */
      labs: draft.fpg === ''
        ? (r.labs || [])
        : [...(r.labs || []), {
            id: store.newId(), date: draft.date, analyteId: 'fpg',
            value: parseFloat(draft.fpg), refLow: '', refHigh: '', atHome: true
          }],
      measurements: [...(r.measurements || []), {
        id: store.newId(), date: draft.date,
        weightKg: draft.weightKg === '' ? null : parseFloat(draft.weightKg),
        heightCm: draft.heightCm === '' ? null : parseFloat(draft.heightCm),
        waistCm: draft.waistCm === '' ? null : parseFloat(draft.waistCm),
        systolic: draft.systolic === '' ? null : parseInt(draft.systolic, 10),
        diastolic: draft.diastolic === '' ? null : parseInt(draft.diastolic, 10)
      }]
    }))
    setDraft({ ...draft, weightKg: '', waistCm: '', systolic: '', diastolic: '', fpg: '' })
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
                  <dt>{t(T.m_bp)}</dt>
                  <dd>{latestBP ? `${latestBP.systolic}/${latestBP.diastolic} mmHg` : '—'}</dd>
                  <dt>{t(T.m_fpg)}</dt>
                  <dd>{latestFpg ? `${latestFpg.value} mmol/L (${latestFpg.date})` : '—'}</dd>
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
                {bpF ? <Finding f={{ ...bpF, folded: bpF.level === 'none' }} /> : null}
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
                <Field label={t(T.m_sys) + ' mmHg'}>
                  <input type="number" inputMode="numeric" value={draft.systolic}
                         onChange={e => setDraft({ ...draft, systolic: e.target.value })} />
                </Field>
                <Field label={t(T.m_dia) + ' mmHg'} hint={t(T.m_bp_how)}>
                  <input type="number" inputMode="numeric" value={draft.diastolic}
                         onChange={e => setDraft({ ...draft, diastolic: e.target.value })} />
                </Field>
                <Field label={t(T.m_fpg) + ' (mmol/L)'} hint={t(T.m_fpg_how)}>
                  <input type="number" step="0.1" inputMode="decimal" value={draft.fpg}
                         onChange={e => setDraft({ ...draft, fpg: e.target.value })} />
                </Field>
              </div>
              {liveBmi ? <p className="hint" style={{ marginTop: 7 }}>{t(T.m_bmi)}: <b>{liveBmi}</b> kg/m²</p> : null}
            </div>
            <div className="card tight">
              <Field label={t(T.m_gender)} hint={t(T.m_gender_why)}>
                <select value={record.gender || ''} onChange={e => update(r => ({ ...r, gender: e.target.value || null }))}>
                  <option value="">—</option>
                  <option value="female">{t(T.m_female)}</option>
                  <option value="male">{t(T.m_male)}</option>
                </select>
              </Field>
            </div>
            <button className="btn wide" onClick={save}
                  disabled={!draft.weightKg && !draft.waistCm && !draft.systolic && !draft.fpg}>
            {t(T.save)}
          </button>
          </>
        ) : null}

        {view === 'past' ? (
          <div className="card tight listcard">
            {rows.length === 0
              ? <div className="empty"><span className="big">{t(T.none)}</span><span>{t(T.none_hint)}</span></div>
              : (
              <table className="tbl">
                <thead><tr>
                  <th>{t(T.col_date)}</th><th className="num">{t(T.m_weight)}</th>
                  <th className="num">{t(T.m_waist)}</th><th className="num">{t(T.m_bmi)}</th>
                  <th className="num">{t(T.m_bp)}</th><th />
                </tr></thead>
                <tbody>
                  {paged.slice.map(r => (
                    <tr key={r.id}>
                      <td style={{ whiteSpace: 'nowrap' }}>{r.date}</td>
                      <td className="num">{r.weightKg ?? '—'}</td>
                      <td className="num">{r.waistCm ?? '—'}</td>
                      <td className="num">{calcBMI(r.weightKg, r.heightCm) ?? '—'}</td>
                      <td className="num">{r.systolic != null && r.diastolic != null ? `${r.systolic}/${r.diastolic}` : '—'}</td>
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

   Every location offers two actions, and the reason for both is in
   src/data/wayfinding.js: "Get directions" opens Google Maps with no origin in
   the URL, so Maps starts from the device's own current position without this
   app ever requesting, seeing or storing a coordinate; "Exact location" opens
   the precise link HTPN supplied, which is always right because it points at a
   saved place rather than a search.
   ====================================================================== */
function TabWayfinding ({ onEvent, online }) {
  const [t] = useT()
  const [view, setView] = useState('sites')
  const paged = usePaged(DEPARTMENTS, PAGE.depts)
  const go = (item) => onEvent('wayfinding_map_opened', item.detailKey)

  return (
    <div className="pane">
      <div className="pane-head">
        <h1 className="pane-title">{t(T.tab_wayfinding)}</h1>
        <p className="pane-lead">{t(T.way_lead)}</p>
      </div>
      <div className="subtabs">
        <button className="subtab" aria-selected={view === 'sites'} onClick={() => setView('sites')}>
          {t(T.way_campuses)}
        </button>
        <button className="subtab" aria-selected={view === 'depts'} onClick={() => setView('depts')}>
          {t(T.way_departments)} · {DEPARTMENTS.length}
        </button>
      </div>

      <div className="pane-body">
        {view === 'sites' ? (
          <>
            {CAMPUSES.map(c => (
              <div key={c.id} className="sitecard">
                <img src={c.image} alt={t(c.name)} />
                <div className="body">
                  <span className="nm">{t(c.name)}</span>
                  <span className="sub">{t(c.blurb)}</span>
                  <div className="acts">
                    <a className="btn" href={directionsUrl(c.destination)} target="_blank" rel="noreferrer"
                       onClick={() => go(c)}>➤ {t(T.way_directions)}</a>
                    <a className="pin" href={c.map} target="_blank" rel="noreferrer"
                       onClick={() => go(c)} style={{ fontSize: 12, color: 'var(--brand)', fontWeight: 700 }}>
                      {t(T.way_exact)}
                    </a>
                  </div>
                </div>
              </div>
            ))}
            <div className="card tight">
              <p className="card-t">{t(T.before_you_come)}</p>
              <ul className="bullets">{BEFORE_YOU_COME.points.map((p, i) => <li key={i}>{t(p)}</li>)}</ul>
            </div>
            <p className="note">{t(DIRECTIONS_NOTE)} {online ? '' : '· ⚠ '}{t(T.way_needs_net)}</p>
          </>
        ) : (
          <>
            {confirmedCount() < DEPARTMENTS.length ? (
              <p className="note">{t(T.way_unconfirmed_banner)}</p>
            ) : null}
            <div className="linkgrid">
              {paged.slice.map(d => (
                <div key={d.id} className={'deptcard' + (d.confirmed ? '' : ' unconfirmed')}>
                  <span className="ic"><Icon d={DEPT_ICONS[d.icon] || DEPT_ICONS.pin} /></span>
                  <span className="tx">
                    <a className="nm" href={directionsUrl(d.destination)} target="_blank" rel="noreferrer"
                       onClick={() => go(d)} style={{ color: 'inherit', textDecoration: 'none', display: 'block' }}>
                      {d.index}. {t(d.name)}
                    </a>
                    <span className="sub">
                      ➤ {t(T.way_directions)}{d.building ? ' · ' + t(d.building) : ''}
                    </span>
                  </span>
                  <a className="pin" href={d.map} target="_blank" rel="noreferrer" onClick={() => go(d)}>
                    {t(T.way_exact)}
                  </a>
                </div>
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
      <div className="pane-body sidebyside">
        <button className="postercard"
                style={{ minHeight: 0 }}
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
/* The poster set, previewed in place rather than hidden behind a sub-tab.
   Thumbnails are 320px copies, so showing all eight costs about 130 KB rather
   than the 1.5 MB the full-size posters would. Tapping one opens it full
   screen. The strip scrolls sideways on a narrow screen; that is a strip
   scrolling, not the page. */
function PosterStrip ({ posters, label, onOpen }) {
  const [t] = useT()
  return (
    <div className="card tight">
      <p className="chart-t">{label}</p>
      <div className="posterstrip">
        {posters.map(p => (
          <button key={p.id} className="pstrip-item" onClick={() => onOpen(p)}
                  title={t(p.title)} aria-label={t(p.title)}>
            <img src={p.thumb} alt={t(p.title)} loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  )
}

function TabMyUbat ({ onEvent, onLightbox }) {
  const [t] = useT()
  const [view, setView] = useState('for')
  const paged = usePaged(MYUBAT.posters, 4)

  return (
    <div className="pane">
      <div className="pane-head">
        <h1 className="pane-title">{t(T.tab_myubat)}</h1>
        <p className="pane-lead">{t(T.ubat_lead)}</p>
      </div>
      <div className="subtabs">
        <button className="subtab" aria-selected={view === 'for'} onClick={() => setView('for')}>{t(T.ubat_good_for)}</button>
        <button className="subtab" aria-selected={view === 'not'} onClick={() => setView('not')}>{t(T.ubat_not_for)}</button>
        <button className="subtab" aria-selected={view === 'posters'} onClick={() => setView('posters')}>
          {t(T.ubat_posters)} · {MYUBAT.posters.length}
        </button>
      </div>

      <div className="pane-body">
        {view === 'posters' ? (
          <>
            <div className="postergrid">
              {paged.slice.map(p => (
                <button key={p.id} className="postercard"
                        onClick={() => { onLightbox(p); onEvent('poster_opened', 'none') }}>
                  <img src={p.src} alt={t(p.title)} loading="lazy" />
                  <span className="cap">
                    {t(p.title)}
                    <span className="credit">{t(p.creditLabel)}</span>
                  </span>
                </button>
              ))}
            </div>
            <span style={{ flex: 1 }} />
            <Pager page={paged.page} pages={paged.pages} onPage={paged.setPage} />
          </>
        ) : (
          <>
            <div className="card tight">
              {view === 'for'
                ? (
                  <>
                    <ul className="bullets">{MYUBAT.points.map((p, i) => <li key={i}>{t(p)}</li>)}</ul>
                    {/* A waiver that ends when a budget runs out is not the
                        same claim as "free", so it is shown as its own
                        time-limited note with what is unconfirmed about it. */}
                    <div className="flagline" style={{ marginTop: 9 }}>
                      <b>{t(T.ubat_charge)} — {t(T.ubat_confirm)}.</b> {t(MYUBAT.deliveryCharge.text)}
                      {MYUBAT.deliveryCharge.verified ? null : (
                        <div style={{ marginTop: 4, fontWeight: 500 }}>⚠ {t(MYUBAT.deliveryCharge.source)}</div>
                      )}
                    </div>
                  </>
                )
                : (
                  <>
                    {/* A glyph per exclusion: this is the list a patient skims
                        rather than reads, and the cold-chain one in particular
                        has to be noticed. */}
                    <ul className="glyphlist roomy">
                      {MYUBAT.notFor.map((p, i) => (
                        <li key={i}>
                          <span className="g"><Icon d={GLYPH[p.glyph] || GLYPH.dot} /></span>
                          <span>{t(p)}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="flagline" style={{ marginTop: 10 }}>❄ {t(T.ubat_cold)} — {t(MYUBAT.coldChainWarning)}</div>
                  </>
                )}
            </div>
            <PosterStrip posters={MYUBAT.posters} label={t(T.ubat_preview)}
                         onOpen={(p) => { onLightbox(p); onEvent('poster_opened', 'none') }} />
            <span style={{ flex: 1 }} />
            <div className="btnrow">
              <a className="btn" style={{ flex: '1 1 60%' }} href={MYUBAT.url} target="_blank" rel="noreferrer"
                 onClick={() => onEvent('myubat_opened', 'none')}>{t(T.ubat_open)} →</a>
              <a className="btn ghost" style={{ flex: '1 1 30%' }} href={MYUBAT.briefing} target="_blank" rel="noreferrer"
                 onClick={() => onEvent('myubat_opened', 'none')}>{t(T.ubat_brief)} →</a>
            </div>
            <p className="note"><b>{t(T.ubat_otherphone)}</b> {t(MYUBAT.otherPhones)} · {t(T.needsInternet)}</p>
          </>
        )}
      </div>
    </div>
  )
}

/* =========================================================================
   TAB 7 — The Public's Role

   Two sub-tabs: the posters, and the triage lists.

   The triage lists are rendered as text rather than as the poster image, for
   three reasons: the poster is in Malay only and this app is bilingual; text
   scales and can be read aloud by a screen reader; and the only copy of the
   poster available to this build was recovered from a screenshot. That
   recovered image is still offered, labelled for exactly what it is.
   ====================================================================== */
function TriageColumn ({ side, tone, glyphs }) {
  const [t] = useT()
  return (
    <div className={'tcol ' + tone}>
      <h3>{t(side.heading)}</h3>
      <p className="where">{t(side.where)}</p>
      <ul className="glyphlist">
        {side.items.map((x, i) => (
          <li key={i}>
            <span className="g"><Icon d={GLYPH[glyphs[i]] || GLYPH.dot} /></span>
            <span>{t(x)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function TriageView ({ onLightbox, onEvent }) {
  const [t] = useT()
  const narrow = useNarrow()
  /* Side by side on a tablet. On a phone the two lists stacked did not fit and
     spilled over one another, so the patient picks the one they need instead —
     which is the question they are actually asking anyway. */
  const [side, setSide] = useState('emergency')

  return (
    <>
      {narrow ? null : <p className="pane-lead" style={{ marginBottom: 2 }}>{t(TRIAGE.lead)}</p>}

      {narrow ? (
        <>
          <div className="subtabs">
            <button className="subtab" aria-selected={side === 'not'} onClick={() => setSide('not')}>
              {t(TRIAGE.notEmergency.heading)}
            </button>
            <button className="subtab" aria-selected={side === 'emergency'} onClick={() => setSide('emergency')}>
              {t(TRIAGE.emergency.heading)}
            </button>
          </div>
          {side === 'emergency'
            ? <TriageColumn side={TRIAGE.emergency} tone="bad" glyphs={TRIAGE_GLYPHS.emergency} />
            : <TriageColumn side={TRIAGE.notEmergency} tone="ok" glyphs={TRIAGE_GLYPHS.notEmergency} />}
        </>
      ) : (
        <div className="triage">
          <TriageColumn side={TRIAGE.notEmergency} tone="ok" glyphs={TRIAGE_GLYPHS.notEmergency} />
          <TriageColumn side={TRIAGE.emergency} tone="bad" glyphs={TRIAGE_GLYPHS.emergency} />
        </div>
      )}

      <span style={{ flex: 1 }} />
      <div className="flagline">⚠ {t(TRIAGE.caveat)}</div>
      <div className="pane-foot" style={{ gap: 10 }}>
        <button className="btn quiet" onClick={() => {
          onLightbox({ src: 'posters/emergency-or-not-lowres.jpg', title: TRIAGE.title, note: T.triage_lowres_note })
          onEvent('poster_opened', 'none')
        }}>{t(T.triage_original)}</button>
        <span className="cite" style={{ flex: 1, marginTop: 0 }}>
          <b>{t(T.basedOn)}:</b> {t(TRIAGE_SOURCE.full)}
        </span>
      </div>
    </>
  )
}

function TabRakyat ({ onEvent, onLightbox }) {
  const [t] = useT()
  const [view, setView] = useState('posters')
  const [role, setRole] = useState(1)
  const items = useMemo(() => postersForRole(role), [role])
  const paged = usePaged(items, PAGE.posters)
  const roleObj = ROLES.find(r => r.role === role)

  return (
    <div className="pane">
      <div className="pane-head">
        <h1 className="pane-title">{t(POSTER_SECTION.title)}</h1>
        <p className="pane-lead">{t(POSTER_SECTION.subtitle)}</p>
      </div>

      <div className="subtabs">
        <button className="subtab" aria-selected={view === 'posters'} onClick={() => setView('posters')}>
          {t(T.rakyat_sub_posters)} · {POSTERS.length}
        </button>
        <button className="subtab" aria-selected={view === 'triage'} onClick={() => setView('triage')}>
          {t(T.rakyat_sub_triage)}
        </button>
      </div>

      <div className="pane-body">
        {view === 'triage' ? <TriageView onLightbox={onLightbox} onEvent={onEvent} /> : (
          <>
            <div className="subtabs">
              {ROLES.map(r => (
                <button key={r.role} className="subtab" aria-selected={role === r.role} onClick={() => setRole(r.role)}>
                  {r.role ? r.role + '. ' : ''}{t(r.title)}
                </button>
              ))}
            </div>
            <div className="postergrid">
              {paged.slice.map(p => (
                <button key={p.id} className="postercard"
                        onClick={() => { onLightbox(p); onEvent('poster_opened', roleObj?.detailKey || 'role_other') }}>
                  <img src={p.src} alt={t(p.title)} loading="lazy" />
                  <span className="cap">
                    {t(p.title)}
                    <span className="credit">{t(p.creditLabel)}</span>
                  </span>
                </button>
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
   TAB 8 — #gayahidupsihatHTPN

   The tab hosts nothing. See the header of src/data/campaign.js for why: a
   feature that publishes patient content would make this app's central
   promise false, would make HTPN the publisher of whatever is posted, and
   would put a hospital-branded step target in front of patients for whom
   walking further is not safe.

   So there are two halves, and neither of them uploads anything:
     My walking — an on-device log, like the rest of the record.
     Share it   — opens the hashtag on the platform the patient already uses,
                  and hands them their own device's share sheet.
   ====================================================================== */

const startOfWeek = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  /* Monday as day one, which is how a clinic week is spoken about here. */
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return d
}
const isoDay = (d) => d.toISOString().slice(0, 10)

function WalkingLog ({ record, update, onEvent }) {
  const [t, lang] = useT()
  const today = isoDay(new Date())
  const rows = record.activity || []
  const [draft, setDraft] = useState({ minutes: '', km: '', steps: '' })

  const weekStart = isoDay(startOfWeek())
  const weekMinutes = rows
    .filter(r => r.date >= weekStart)
    .reduce((n, r) => n + (Number(r.minutes) || 0), 0)

  /* Seven slots, oldest first, so the bars read left to right as a week. */
  const days = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    const key = isoDay(d)
    days.push({
      label: d.toLocaleDateString(lang === 'ms' ? 'ms-MY' : 'en-GB', { weekday: 'short' }),
      value: rows.filter(r => r.date === key).reduce((n, r) => n + (Number(r.minutes) || 0), 0)
    })
  }

  const save = () => {
    if (!draft.minutes && !draft.km && !draft.steps) return
    update(r => ({
      ...r,
      activity: [...(r.activity || []), {
        id: store.newId(), date: today,
        minutes: draft.minutes === '' ? null : parseFloat(draft.minutes),
        km: draft.km === '' ? null : parseFloat(draft.km),
        steps: draft.steps === '' ? null : parseInt(draft.steps, 10)
      }]
    }))
    setDraft({ minutes: '', km: '', steps: '' })
    onEvent('activity_logged', 'manual')
  }

  return (
    <>
      <div className="card tight">
        <Meter value={weekMinutes} target={ACTIVITY_TARGET.weeklyMinutes}
               unit={ACTIVITY_TARGET.unit} label={t(T.gh_week)}
               caption={t(ACTIVITY_TARGET.note)} />
        <p className="cite" style={{ marginTop: 6 }}>
          <b>{t(T.basedOn)}:</b> {t(SRC.WHO_PA_2020.full)}
        </p>
      </div>

      <div className="card tight">
        <p className="chart-t"><span className="ct-ic"><Icon d={GLYPH.walker} /></span>{t(T.gh_last7)} — {t(T.gh_minutes).toLowerCase()}</p>
        {weekMinutes === 0 && days.every(d => d.value === 0)
          ? <div className="chart-blank"><Art name="week" /><p className="chart-empty">{t(T.gh_nolog)}</p></div>
          : <DayBars days={days} unit="min" todayLabel={t(T.gh_today)} />}
      </div>

      <span style={{ flex: 1 }} />

      <div className="card tight">
        <div className="frm three">
          <Field label={t(T.gh_minutes)}>
            <input type="number" inputMode="numeric" value={draft.minutes}
                   onChange={e => setDraft({ ...draft, minutes: e.target.value })} />
          </Field>
          <Field label={t(T.gh_km)}>
            <input type="number" step="0.1" inputMode="decimal" value={draft.km}
                   onChange={e => setDraft({ ...draft, km: e.target.value })} />
          </Field>
          <Field label={t(T.gh_steps)}>
            <input type="number" inputMode="numeric" value={draft.steps}
                   onChange={e => setDraft({ ...draft, steps: e.target.value })} />
          </Field>
        </div>
        <button className="btn wide" style={{ marginTop: 8 }} onClick={save}
                disabled={!draft.minutes && !draft.km && !draft.steps}>
          + {t(T.gh_log)}
        </button>
      </div>
    </>
  )
}

function ShareIt ({ onEvent }) {
  const [t, lang] = useT()
  const [copied, setCopied] = useState(null)

  const copy = async (text, what) => {
    try { await navigator.clipboard.writeText(text) } catch { /* nothing to do */ }
    setCopied(what)
    setTimeout(() => setCopied(null), 1800)
  }

  const share = async () => {
    const text = pick(CAMPAIGN.shareText, lang)
    onEvent('share_opened', 'none')
    /* The device's own share sheet. The app never sees what is chosen or
       posted — it hands the text over and stops there. */
    if (navigator.share) {
      try { await navigator.share({ text }); return } catch { /* dismissed */ return }
    }
    copy(text, 'share')
  }

  return (
    <>
      <div className="card tight">
        <div className="hashline">
          <span className="hashtag">#{HASHTAG}</span>
          <span style={{ flex: 1 }} />
          <button className="btn quiet" style={{ padding: '6px 11px', fontSize: 12 }}
                  onClick={() => copy('#' + HASHTAG, 'tag')}>
            {copied === 'tag' ? '✓ ' + t(T.gh_copied) : t(T.gh_copy)}
          </button>
        </div>
      </div>

      <div className="card tight">
        <p className="card-t">{t(T.gh_howto)}</p>
        <ul className="bullets">{CAMPAIGN.how.map((x, i) => <li key={i}>{t(x)}</li>)}</ul>
      </div>

      <div className="card tight">
        <p className="card-t">{t(CAMPAIGN.whoCanSee.title)}</p>
        <ul className="bullets">{CAMPAIGN.whoCanSee.points.map((x, i) => <li key={i}>{t(x)}</li>)}</ul>
        <div className="flagline" style={{ marginTop: 8 }}>⚠ {t(CAMPAIGN.whoCanSee.beforeYouPost)}</div>
      </div>

      <button className="btn wide" onClick={share}>↗ {t(T.gh_share)}</button>
      {copied === 'share' ? <p className="note">{t(T.gh_share_unavailable)}</p> : null}

      <div className="card tight">
        <p className="card-t">{t(T.gh_open_on)}</p>
        <div className="platgrid">
          {CAMPAIGN.platforms.map(pl => (
            <a key={pl.id} className="platbtn" href={pl.url} target="_blank" rel="noreferrer"
               onClick={() => onEvent('hashtag_opened', pl.id)}>{pl.name} ↗</a>
          ))}
        </div>
        <p className="note" style={{ marginTop: 8 }}>{t(CAMPAIGN.stravaNote)}</p>
      </div>

      <span style={{ flex: 1 }} />
      <p className="note">{t(CAMPAIGN.privacyNote)}</p>
    </>
  )
}

function TabGayaHidup ({ record, update, onEvent }) {
  const [t] = useT()
  const [view, setView] = useState('log')
  return (
    <div className="pane">
      <div className="pane-head">
        <h1 className="pane-title">{t(CAMPAIGN.title)}</h1>
        <p className="pane-lead">{t(CAMPAIGN.lead)}</p>
      </div>
      <div className="subtabs">
        <button className="subtab" aria-selected={view === 'log'} onClick={() => setView('log')}>{t(T.gh_sub_log)}</button>
        <button className="subtab" aria-selected={view === 'share'} onClick={() => setView('share')}>{t(T.gh_sub_share)}</button>
        <button className="subtab" aria-selected={view === 'safe'} onClick={() => setView('safe')}>{t(T.gh_safety)}</button>
      </div>
      <div className="pane-body">
        {view === 'log' ? <WalkingLog record={record} update={update} onEvent={onEvent} /> : null}
        {view === 'share' ? <ShareIt onEvent={onEvent} /> : null}
        {view === 'safe' ? (
          <>
            <div className="emergency">
              <div style={{ fontWeight: 800, marginBottom: 4 }}>⚠ {t(T.gh_safety)}</div>
              {t(CAMPAIGN.safety)}
            </div>
            <div className="card tight">
              <p className="card-s">{t(ACTIVITY_TARGET.note)}</p>
              <p className="cite" style={{ marginTop: 6 }}>
                <b>{t(T.basedOn)}:</b> {t(SRC.WHO_PA_2020.full)}
              </p>
            </div>
            <span style={{ flex: 1 }} />
            <p className="note">{t(EMERGENCY.text)}</p>
          </>
        ) : null}
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
        {item.creditLabel ? <span style={{ opacity: .7 }}>· {t(item.creditLabel)}</span> : null}
        {item.note ? <span style={{ opacity: .7, fontSize: 11 }}>· {t(item.note)}</span> : null}
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
   The announcement behind the theme line in the header.

   The article's quote block renders only when announcement.js actually holds
   one. It is null in this build because the source could not be read, and an
   approximate quotation attributed to a named minister is not something a
   hospital app should ever print.
   ====================================================================== */
function AnnouncementModal ({ onClose, onEvent }) {
  const [t] = useT()
  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h2>{t(THEME.full)}</h2>
        <div className="modal-scroll">
          <div className="card tight">
            <p className="card-t">{t(ANNOUNCEMENT.title)}</p>
            <p className="card-s">{t(ANNOUNCEMENT.body)}</p>
            <ul className="bullets" style={{ marginTop: 8 }}>
              {ANNOUNCEMENT.steps.map((x, i) => <li key={i}>{t(x)}</li>)}
            </ul>
          </div>

          <div className="flagline" style={{ marginTop: 10 }}>
            {t(ANNOUNCEMENT.notTheProgramme)}
          </div>

          <div className="card tight newscard" style={{ marginTop: 10 }}>
            <p className="card-t">{t(T.ann_source)}</p>
            {ARTICLE.photo ? (
              <figure className="newsfig">
                <img src={ARTICLE.photo.src} alt={t(ARTICLE.photo.alt)} />
                <figcaption>{t(ARTICLE.photo.credit)}</figcaption>
              </figure>
            ) : null}
            {ARTICLE.quote ? (
              <blockquote className="quote">
                “{t(ARTICLE.quote.text)}”
                <cite>— {t(ARTICLE.quote.speaker)}</cite>
              </blockquote>
            ) : null}
            <p className="newshead">{t(ARTICLE.headline)}</p>
            <p className="note" style={{ marginTop: 4 }}>
              {t(ARTICLE.byline)} · {ARTICLE.carriedBy} · {t(ARTICLE.published)}
              {ARTICLE.headlineIsExact ? '' : ' · ' + t(T.ann_headline_note)}
            </p>
            <a className="btn ghost wide" style={{ marginTop: 8 }} href={ARTICLE.url}
               target="_blank" rel="noreferrer" onClick={() => onEvent('article_opened', 'none')}>
              {t(ARTICLE.readMore)} ↗
            </a>
            <p className="note" style={{ marginTop: 5 }}>{t(T.needsInternet)}</p>
          </div>
        </div>
        <button className="btn wide" onClick={onClose}>{t(T.close)}</button>
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
      <div className="plogos">
        <img src="brand/logo-kkm-htpn.jpg" alt="Kementerian Kesihatan Malaysia — HTPN" />
        <img src="brand/logo-kajang.png" alt="Hospital Kajang" />
      </div>
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
            <td>{t(T.m_bp)}: {m.systolic != null && m.diastolic != null ? `${m.systolic}/${m.diastolic}` : '—'}</td>
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

      {(record.imaging || []).length ? (
        <>
          <h2>{t(T.sec_imaging)}</h2>
          <table><tbody>
            {record.imaging.map(g => (
              <tr key={g.id}>
                <td>{g.date}</td>
                <td>{t(MODALITIES.find(m => m.value === g.modality)?.label || g.modality)}</td>
                <td>{g.bodyPart}</td>
                <td>{g.finding}</td>
              </tr>
            ))}
          </tbody></table>
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
      <p className="meta" style={{ marginTop: '6mm' }}>{t(T.credit)}</p>
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
  { id: 'dashboard', label: T.tab_dashboard, short: T.short_dashboard },
  { id: 'records', label: T.tab_records, short: T.short_records },
  { id: 'measurements', label: T.tab_measurements, short: T.short_measurements },
  { id: 'wayfinding', label: T.tab_wayfinding, short: T.short_wayfinding },
  { id: 'iqms', label: T.tab_iqms, short: T.short_iqms },
  { id: 'myubat', label: T.tab_myubat, short: T.short_myubat },
  { id: 'rakyat', label: T.tab_rakyat, short: T.short_rakyat },
  { id: 'gayahidup', label: T.tab_gayahidup, short: T.short_gayahidup }
]

export default function App () {
  const [prefs, setPrefs] = useState(() => store.loadPrefs())
  const [record, setRecord] = useState(() => store.loadRecord())
  const [tab, setTab] = useState('dashboard')
  const [lightbox, setLightbox] = useState(null)
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showPrint, setShowPrint] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(false)
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
          <div className="hdr-logos">
            <img src="brand/logo-kkm-htpn.jpg" alt="Kementerian Kesihatan Malaysia — HTPN" className="wide-only" />
            <img src="brand/logo-kajang.png" alt="Hospital Kajang" />
          </div>
          <button className="hdr-id" onClick={() => setShowAnnouncement(true)}
                  aria-label={pick(T.ann_open, lang)}>
            <span className="hdr-title">{pick(T.appName, lang)}</span>
            <span className="hdr-sub">{pick(THEME.full, lang)} ⓘ</span>
          </button>
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
        {tab === 'myubat' ? <TabMyUbat onEvent={onEvent} onLightbox={setLightbox} /> : null}
        {tab === 'rakyat' ? <TabRakyat onEvent={onEvent} onLightbox={setLightbox} /> : null}
        {tab === 'gayahidup' ? <TabGayaHidup record={record} update={update} onEvent={onEvent} /> : null}

        <nav className="tabbar">
          {TABS.map(x => (
            <button key={x.id} className="tabbtn" aria-selected={tab === x.id} onClick={() => goTo(x.id)}>
              <Icon d={ICONS[x.id]} />
              <span className="tablabel">{pick(x.short || x.label, lang)}</span>
              <span className="tabdot" />
            </button>
          ))}
        </nav>

        <div className="statusbar">
          <span className={'dot ' + (status === 'sent' ? '' : status === 'failed' || status === 'refused' ? 'bad' : 'off')} />
          <span className="st">{pick(statusText, lang)}</span>
          <span className="net">· {online ? pick(T.offlineReady, lang) : '⚠ ' + pick(T.offlineReady, lang)}</span>
          <span className="sp" />
          <span className="credit">{pick(T.credit, lang)}</span>
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
      {showAnnouncement ? (
        <AnnouncementModal onClose={() => setShowAnnouncement(false)} onEvent={onEvent} />
      ) : null}
      {showPrint ? (
        <PrintDialog identifiers={identifiers} setIdentifiers={setIdentifiers}
                     onClose={() => setShowPrint(false)}
                     onPrint={() => { onEvent('summary_printed', 'none'); setShowPrint(false); setTimeout(() => globalThis.print(), 60) }} />
      ) : null}
    </LangCtx.Provider>
  )
}
