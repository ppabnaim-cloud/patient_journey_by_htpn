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
export function Stat ({ label, value, unit, sub, tone }) {
  return (
    <div className={'stat' + (tone ? ' ' + tone : '')}>
      <div className="stat-l">{label}</div>
      <div className="stat-v">
        {value}
        {unit ? <span className="stat-u">{unit}</span> : null}
      </div>
      {sub ? <div className="stat-s">{sub}</div> : null}
    </div>
  )
}

/* --- line chart ---------------------------------------------------------
   One series, so no legend: the title names what is plotted. `cutoff` draws a
   cited reference line; the caller passes the citation, this never invents one. */
export function LineChart ({ points, unit, cutoff, emptyText, tableLabels }) {
  const uid = useId()
  const [showTable, setShowTable] = useState(false)
  const rows = (points || []).filter(p => Number.isFinite(Number(p.value)))

  if (rows.length < 2) return <p className="chart-empty">{emptyText}</p>

  const W = 700, H = 210, PL = 52, PR = 24, PT = 20, PB = 34
  const vals = rows.map(r => Number(r.value))
  const lo = Math.min(...vals, ...(cutoff != null ? [cutoff] : []))
  const hi = Math.max(...vals, ...(cutoff != null ? [cutoff] : []))
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
        {cutoff != null
          ? <line x1={PL} x2={W - PR} y1={y(cutoff)} y2={y(cutoff)} className="cutoff" />
          : null}

        <path d={d} className="line" fill="none" />

        {rows.map((r, i) => (
          <circle key={i} cx={x(i)} cy={y(Number(r.value))} r="5" className="dot">
            <title>{`${r.label}: ${fmt(r.value, 2)} ${unit}`}</title>
          </circle>
        ))}

        {/* one direct label, on the endpoint only */}
        <text x={x(rows.length - 1)} y={y(Number(last.value)) - 12} className="endlabel" textAnchor="end">
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
