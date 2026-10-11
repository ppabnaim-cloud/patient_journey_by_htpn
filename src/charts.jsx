/* ===========================================================================
   charts.jsx — the chart primitives for the dashboard. Presentation only.

   Hand-drawn inline SVG, no charting library, because the project's stack rule
   allows four dependencies and a chart library is not one of them.

   WHAT IS AND IS NOT PLOTTED, AND WHY
   A single patient's own record supports a narrow set of honest forms:
     - counts of things (medicines, problems, allergies)      -> stat tiles
     - one measurement followed over time (HbA1c, weight)     -> line
     - one set of things split into parts (meds by indication)-> stacked bar
   It does NOT support a histogram, a scatter plot or a heatmap. Those need a
   population, or two variables measured across many subjects. One person's
   eight blood tests cannot make a distribution, and drawing one would invite a
   patient to read a pattern that is not in the data. So they are not here.

   Specs followed throughout: 2px lines, >=8px markers with a 2px surface ring,
   bars capped at 24px with a 4px rounded data-end, a 2px surface gap between
   touching segments, hairline recessive gridlines, selective direct labels
   (endpoint only), and text in ink tokens rather than the series colour.
   Every chart has a table view, because three of the light-mode series
   colours sit below 3:1 against the card and the relief rule applies.
   ========================================================================= */

import React, { useId, useState } from 'react'
import { ART } from './data/glyphs.js'

/* A line drawing for an empty state. Decorative: it carries no value, and the
   sentence beside it is what actually tells the patient anything. */
export function Art ({ name }) {
  const a = ART[name]
  if (!a) return null
  return (
    <svg className="art" viewBox={a.viewBox} aria-hidden="true" focusable="false">
      {a.paths.map((p, i) => <path key={i} d={p.d} className={p.cls} />)}
    </svg>
  )
}

/* Validated with the dataviz palette validator against this app's own card
   surfaces (#FFFFFF light, #1E182E dark): both modes pass the lightness band,
   the chroma floor, adjacent-pair CVD separation and the normal-vision floor.
   Light mode raises a contrast warning on three slots, which is why every
   chart here ships direct labels and a table view. */
export const SERIES = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)']

const fmt = (n, dp = 1) => {
  const v = Number(n)
  if (!Number.isFinite(v)) return '—'
  return Number.isInteger(v) ? String(v) : v.toFixed(dp)
}

/* --- stat tile ----------------------------------------------------------
   A single current value is a stat tile, never a one-bar bar chart. */
export function Stat ({ label, value, unit, sub, tone, icon }) {
  return (
    <div className={'stat' + (tone ? ' ' + tone : '')}>
      <div className="stat-l">{icon ? <span className="stat-ic">{icon}</span> : null}{label}</div>
      <div className="stat-v">
        {value}
        {unit ? <span className="stat-u">{unit}</span> : null}
      </div>
      {sub ? <div className="stat-s">{sub}</div> : null}
    </div>
  )
}

/* --- allergy tile --------------------------------------------------------
   A count is the wrong thing to show for an allergy: "2" tells a clinician
   nothing, and the whole point of the tile is that the substances can be read
   at a glance. So it lists them.

   On the attention treatment: a true blink is an accessibility fault — WCAG
   2.2.2 requires moving content to be pausable and 2.3.1 limits flashing, and
   anything that blinks forever is tuned out within a week, which is the
   opposite of what a severe allergy needs. Instead a severe allergy gets a
   permanent red tile and a short pulse that runs a few times when the screen
   opens and then stops, and it does not run at all for a viewer who has asked
   for reduced motion. The red and the names stay either way. */
export function AllergyTile ({ label, substances, severe, emptyText, severeLabel, moreLabel, icon }) {
  const has = substances.length > 0
  /* Three names, then a count. A tile that grows with the list would push the
     charts under it down the screen, and the full list is one tap away in
     My Records — this is the glance, not the record. */
  const SHOWN = 3
  const shown = substances.slice(0, SHOWN)
  const extra = substances.length - shown.length
  return (
    <div className={'stat allergy' + (has ? ' has' : '') + (severe ? ' severe' : '')}>
      <div className="stat-l">{icon ? <span className="stat-ic">{icon}</span> : null}{label}</div>
      {has ? (
        <>
          <ul className="allergy-list">
            {shown.map((sub, i) => <li key={i}>{sub}</li>)}
          </ul>
          {extra > 0 ? <span className="allergy-more">+{extra} {moreLabel}</span> : null}
          {severe ? <span className="allergy-badge">{severeLabel}</span> : null}
        </>
      ) : (
        <div className="stat-s" style={{ marginTop: 4 }}>{emptyText}</div>
      )}
    </div>
  )
}

/* --- meter ---------------------------------------------------------------
   A single ratio against a limit is a meter, never a pie of two slices. The
   track and the fill are the same hue, two steps apart, so it reads as "how
   far along" rather than as two competing categories. Over-target does not
   change colour: exceeding a minimum is not a warning state. */
export function Meter ({ value, target, unit, label, caption }) {
  const pct = Math.max(0, Math.min(100, (value / target) * 100))
  return (
    <div className="meter">
      <div className="meter-top">
        <span className="meter-v">{fmt(value, 0)}<span className="meter-u"> / {target} {unit}</span></span>
        <span className="meter-l">{label}</span>
      </div>
      <div className="meter-track" role="img" aria-label={`${fmt(value, 0)} of ${target} ${unit}`}>
        <div className="meter-fill" style={{ width: pct + '%' }} />
      </div>
      {caption ? <p className="meter-c">{caption}</p> : null}
    </div>
  )
}

/* --- day bars ------------------------------------------------------------
   Magnitude across a small fixed set of slots: columns, one hue, capped at
   24px thick with a 4px rounded cap and a square baseline. Labelled
   selectively — today only — because a number on every column goes unread. */
export function DayBars ({ days, unit, todayLabel }) {
  const max = Math.max(1, ...days.map(d => d.value))
  return (
    <div className="daybars">
      {days.map((d, i) => {
        const h = (d.value / max) * 100
        const isLast = i === days.length - 1
        return (
          <div key={i} className="daycol" title={`${d.label}: ${fmt(d.value, 0)} ${unit}`}>
            <span className="dayv">{d.value > 0 ? fmt(d.value, 0) : ''}</span>
            <div className="daytrack">
              <div className={'daybar' + (isLast ? ' now' : '')} style={{ height: Math.max(d.value > 0 ? 3 : 0, h) + '%' }} />
            </div>
            <span className="dayl">{isLast && todayLabel ? todayLabel : d.label}</span>
          </div>
        )
      })}
    </div>
  )
}

/* --- line chart ---------------------------------------------------------
   One series, so no legend: the title names what is plotted. `cutoff` draws a
   cited reference line; the caller passes the citation, this never invents one. */
export function LineChart ({ points, unit, cutoff, emptyText, tableLabels }) {
  const cuts = cutoff == null ? [] : (Array.isArray(cutoff) ? cutoff : [cutoff])
  const uid = useId()
  const [showTable, setShowTable] = useState(false)
  const rows = (points || []).filter(p => Number.isFinite(Number(p.value)))

  if (rows.length < 2) {
    return <div className="chart-blank"><Art name="trend" /><p className="chart-empty">{emptyText}</p></div>
  }

  const W = 700, H = 130, PL = 50, PR = 26, PT = 12, PB = 26
  const vals = rows.map(r => Number(r.value))
  const lo = Math.min(...vals, ...cuts)
  const hi = Math.max(...vals, ...cuts)
  const pad = (hi - lo) * 0.18 || Math.abs(hi * 0.1) || 1
  const yMin = lo - pad, yMax = hi + pad
  const x = i => PL + (i * (W - PL - PR)) / Math.max(1, rows.length - 1)
  const y = v => PT + (1 - (v - yMin) / (yMax - yMin || 1)) * (H - PT - PB)

  const d = rows.map((r, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(Number(r.value)).toFixed(1)}`).join(' ')
  const last = rows[rows.length - 1]

  if (showTable) {
    return (
      <>
        <table className="tbl mini">
          <thead><tr><th>{tableLabels.date}</th><th className="num">{tableLabels.value}</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}><td>{r.label}</td><td className="num">{fmt(r.value, 2)} {unit}</td></tr>
            ))}
          </tbody>
        </table>
        <button className="linkbtn" onClick={() => setShowTable(false)}>{tableLabels.chartView}</button>
      </>
    )
  }

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img"
           aria-label={`${tableLabels.value}: ${rows.map(r => `${r.label} ${fmt(r.value, 2)}`).join(', ')}`}>
        {/* hairline gridlines, one step off the surface, solid and recessive */}
        {[yMin, (yMin + yMax) / 2, yMax].map((v, i) => (
          <g key={i}>
            <line x1={PL} x2={W - PR} y1={y(v)} y2={y(v)} className="grid" />
            <text x={PL - 8} y={y(v) + 4} className="axis" textAnchor="end">{fmt(v, 1)}</text>
          </g>
        ))}
        {/* The reference line is drawn, but its label lives beside the chart:
            at this size an inline label collides with the axis ticks, and the
            rule is that a label which does not fit is moved, never clipped. */}
        {cuts.map((c, i) => (
          <line key={i} x1={PL} x2={W - PR} y1={y(c)} y2={y(c)} className="cutoff" />
        ))}

        <path d={d} className="line" fill="none" />

        {rows.map((r, i) => (
          <circle key={i} cx={x(i)} cy={y(Number(r.value))} r="5" className="dot">
            <title>{`${r.label}: ${fmt(r.value, 2)} ${unit}`}</title>
          </circle>
        ))}

        {/* one direct label, on the endpoint only */}
        <text x={x(rows.length - 1)} y={y(Number(last.value)) - 10} className="endlabel" textAnchor="end">
          {fmt(last.value, 1)}
        </text>

        <text x={PL} y={H - 8} className="axis">{rows[0].label}</text>
        <text x={W - PR} y={H - 8} className="axis" textAnchor="end">{last.label}</text>
      </svg>
      <button className="linkbtn" onClick={() => setShowTable(true)} aria-describedby={uid}>
        {tableLabels.tableView}
      </button>
    </>
  )
}

/* --- two-series line chart ----------------------------------------------
   Systolic and diastolic share a unit and a scale, so they share ONE axis.
   This is never a dual-axis chart: two y-scales on one plot is the single
   most misleading thing a chart can do, and two measures that genuinely do
   not share a scale get two charts instead.

   Two series means a legend is mandatory — identity is never carried by
   colour alone — and both endpoints are directly labelled. */
export function MultiLineChart ({ series, unit, refLines, emptyText, tableLabels }) {
  const [showTable, setShowTable] = useState(false)
  const clean = (series || []).filter(s => s.points.length >= 2)
  if (!clean.length) {
    return <div className="chart-blank"><Art name="trend" /><p className="chart-empty">{emptyText}</p></div>
  }

  const labels = clean[0].points.map(p => p.label)

  if (showTable) {
    return (
      <>
        <table className="tbl mini">
          <thead>
            <tr><th>{tableLabels.date}</th>{clean.map(s => <th key={s.key} className="num">{s.label}</th>)}</tr>
          </thead>
          <tbody>
            {labels.map((lab, i) => (
              <tr key={i}>
                <td>{lab}</td>
                {clean.map(s => <td key={s.key} className="num">{fmt(s.points[i]?.value, 0)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <button className="linkbtn" onClick={() => setShowTable(false)}>{tableLabels.chartView}</button>
      </>
    )
  }

  const W = 700, H = 130, PL = 50, PR = 46, PT = 12, PB = 26
  const all = clean.flatMap(s => s.points.map(p => Number(p.value)))
             .concat((refLines || []).map(r => r.value))
  const lo = Math.min(...all), hi = Math.max(...all)
  const pad = (hi - lo) * 0.15 || 10
  const yMin = lo - pad, yMax = hi + pad
  const x = i => PL + (i * (W - PL - PR)) / Math.max(1, labels.length - 1)
  const y = v => PT + (1 - (v - yMin) / (yMax - yMin || 1)) * (H - PT - PB)

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} className="chart" role="img"
           aria-label={clean.map(s => `${s.label}: ${s.points.map(p => `${p.label} ${p.value}`).join(', ')}`).join('. ')}>
        {[yMin, (yMin + yMax) / 2, yMax].map((v, i) => (
          <g key={i}>
            <line x1={PL} x2={W - PR} y1={y(v)} y2={y(v)} className="grid" />
            <text x={PL - 8} y={y(v) + 4} className="axis" textAnchor="end">{fmt(v, 0)}</text>
          </g>
        ))}
        {(refLines || []).map((r, i) => (
          <line key={i} x1={PL} x2={W - PR} y1={y(r.value)} y2={y(r.value)} className="cutoff" />
        ))}

        {clean.map((sr, si) => (
          <g key={sr.key}>
            <path d={sr.points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(Number(p.value)).toFixed(1)}`).join(' ')}
                  fill="none" stroke={SERIES[si % SERIES.length]} strokeWidth="2"
                  strokeLinejoin="round" strokeLinecap="round" />
            {sr.points.map((p, i) => (
              <circle key={i} cx={x(i)} cy={y(Number(p.value))} r="5"
                      fill={SERIES[si % SERIES.length]} stroke="var(--card)" strokeWidth="2">
                <title>{`${sr.label} — ${p.label}: ${fmt(p.value, 0)} ${unit}`}</title>
              </circle>
            ))}
            <text x={x(sr.points.length - 1) + 8} y={y(Number(sr.points[sr.points.length - 1].value)) + 4}
                  className="endlabel" textAnchor="start">
              {fmt(sr.points[sr.points.length - 1].value, 0)}
            </text>
          </g>
        ))}

        <text x={PL} y={H - 8} className="axis">{labels[0]}</text>
        <text x={W - PR} y={H - 8} className="axis" textAnchor="end">{labels[labels.length - 1]}</text>
      </svg>
      {clean.length > 1 ? (
        <div className="legend">
          {clean.map((sr, si) => (
            <span key={sr.key} className="lg">
              <i style={{ background: SERIES[si % SERIES.length] }} />{sr.label}
            </span>
          ))}
        </div>
      ) : null}
      <button className="linkbtn" onClick={() => setShowTable(true)}>{tableLabels.tableView}</button>
    </>
  )
}

/* --- horizontal stacked bar --------------------------------------------
   Part-to-whole with few, long-named categories: a horizontal stack, not a
   pie. Built from HTML rather than SVG so the bar is exactly 24px thick at
   any card width — an SVG viewBox scaled to the container stretches the mark
   past the 24px cap. The 2px separators are gaps in the surface colour, never
   strokes, and only the outer ends are rounded. A label is printed inside a
   segment only when it measurably fits; otherwise the legend carries it. */
export function StackedBar ({ parts, total, tableLabels }) {
  const [showTable, setShowTable] = useState(false)
  const rows = (parts || []).filter(p => p.value > 0)
  if (!rows.length || !total) return null

  if (showTable) {
    return (
      <>
        <table className="tbl mini">
          <thead><tr><th>{tableLabels.name}</th><th className="num">{tableLabels.value}</th></tr></thead>
          <tbody>{rows.map((p, i) => <tr key={i}><td>{p.label}</td><td className="num">{p.value}</td></tr>)}</tbody>
        </table>
        <button className="linkbtn" onClick={() => setShowTable(false)}>{tableLabels.chartView}</button>
      </>
    )
  }

  return (
    <>
      <div className="stackbar" role="img" aria-label={rows.map(p => `${p.label}: ${p.value}`).join(', ')}>
        {rows.map((p, i) => (
          <div key={i}
               className={'seg' + (i === 0 ? ' first' : '') + (i === rows.length - 1 ? ' last' : '')}
               style={{ flexGrow: p.value, background: SERIES[i % SERIES.length] }}
               title={`${p.label}: ${p.value}`}>
            {/* roughly 9px per digit plus padding; narrower than that and the
                number would be clipped, so it is left to the legend instead */}
            {(p.value / total) * 100 > 9 ? <span>{p.value}</span> : null}
          </div>
        ))}
      </div>
      <div className="legend">
        {rows.map((p, i) => (
          <span key={i} className="lg">
            <i style={{ background: SERIES[i % SERIES.length] }} />
            {p.label} <b>{p.value}</b>
          </span>
        ))}
      </div>
      <button className="linkbtn" onClick={() => setShowTable(true)}>{tableLabels.tableView}</button>
    </>
  )
}
