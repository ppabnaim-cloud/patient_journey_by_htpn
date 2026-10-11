/* ===========================================================================
   styles.js — the whole stylesheet, as one template string, injected once.

   The hard layout rule this file exists to enforce: EVERY SCREEN FITS WITHOUT
   SCROLLING ON A 10-INCH TABLET HELD PORTRAIT. So:
     - html, body and #root are locked to the viewport height, overflow hidden.
     - the shell is a flex column: header / content / tab bar / status line.
     - the content pane is flex:1 with min-height:0, which is what actually
       stops a flex child from growing past its parent.
     - lists are PAGED, not scrolled. Page sizes are fixed numbers in App.jsx.
   If something does not fit, it becomes a second step. It never becomes a
   scrollbar.
   ========================================================================= */

export const CSS = `
:root {
  --brand: #5B2D8E;          /* the purple of the hospital's own iQMS material */
  --brand-dark: #3C1C63;
  --brand-tint: #F3EDFA;
  --ink: #1A1230;
  --ink-soft: #544B6B;
  --ink-faint: #8A82A0;
  --line: #E2DCEC;
  --bg: #FAF8FD;
  --card: #FFFFFF;

  --warning: #B3261E;        --warning-bg: #FDECEA;
  --attention: #9A5B00;      --attention-bg: #FFF3E0;
  --watch: #1A5C8A;          --watch-bg: #E8F2F9;
  --calm: #4A6B55;           --calm-bg: #EDF4EF;

  /* Chart series. Validated with the dataviz validator against this app's own
     card surfaces; see the header of src/charts.jsx. */
  --s1: #2a78d6;  --s2: #eb6834;  --s3: #1baf7a;  --s4: #eda100;
  --grid: #EDE9F3;

  --r: 14px;
  --pad: 14px;
  --header-h: 54px;
  --tabbar-h: 60px;
  --status-h: 26px;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --brand: #B388E0; --brand-dark: #D5BFF0; --brand-tint: #2A1F3D;
    --ink: #F2EEF9; --ink-soft: #BFB6D4; --ink-faint: #8E85A6;
    --line: #38304B; --bg: #140F21; --card: #1E182E;
    --warning: #FF9A92; --warning-bg: #3A1A18;
    --attention: #FFC46B; --attention-bg: #3A2A10;
    --watch: #8FC7EC; --watch-bg: #12293A;
    --calm: #A6CDB4; --calm-bg: #19291F;
    --s1: #3987e5;  --s2: #d95926;  --s3: #199e70;  --s4: #c98500;
    --grid: #2E2742;
  }
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

html, body, #root {
  height: 100%;
  margin: 0;
  overflow: hidden;
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 15px;
  line-height: 1.45;
  -webkit-font-smoothing: antialiased;
}

button { font: inherit; color: inherit; cursor: pointer; }
input, select, textarea { font: inherit; color: inherit; }

/* ---------- shell ---------- */
.shell { height: 100%; display: flex; flex-direction: column; min-height: 0; }

.hdr {
  height: var(--header-h); flex: 0 0 auto;
  display: flex; align-items: center; gap: 10px;
  padding: 0 var(--pad);
  background: var(--brand); color: #fff;
}
.hdr-title { font-weight: 700; font-size: 16px; letter-spacing: -0.2px; line-height: 1.1; }
.hdr-sub { font-size: 11px; opacity: .82; line-height: 1.1; }
.hdr-spacer { flex: 1; }
.hdr-btn {
  background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.3);
  color: #fff; border-radius: 999px; padding: 5px 11px; font-size: 12px; font-weight: 600;
}
.hdr-btn[aria-pressed="true"] { background: #fff; color: var(--brand); border-color: #fff; }
.langset { display: flex; gap: 4px; }

.pane {
  flex: 1 1 auto; min-height: 0;
  display: flex; flex-direction: column;
  padding: var(--pad);
  gap: 10px;
}

.pane-head { flex: 0 0 auto; }
.pane-title { font-size: 19px; font-weight: 700; margin: 0 0 2px; letter-spacing: -0.3px; }
.pane-lead { margin: 0; color: var(--ink-soft); font-size: 13px; }

.pane-body { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 10px; }
.pane-foot { flex: 0 0 auto; display: flex; align-items: center; gap: 8px; }

/* ---------- tab bar ---------- */
.tabbar {
  height: var(--tabbar-h); flex: 0 0 auto;
  display: grid; grid-template-columns: repeat(7, 1fr);
  background: var(--card); border-top: 1px solid var(--line);
}
.tabbtn {
  background: none; border: 0; padding: 4px 2px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
  color: var(--ink-faint); font-size: 10px; font-weight: 600; line-height: 1.1;
  text-align: center; overflow: hidden;
}
.tabbtn svg { width: 21px; height: 21px; flex: 0 0 auto; }
.tabbtn[aria-selected="true"] { color: var(--brand); }
.tabbtn[aria-selected="true"] .tabdot { opacity: 1; }
.tabdot { width: 16px; height: 3px; border-radius: 2px; background: var(--brand); opacity: 0; }
.tablabel { max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

/* ---------- status line ---------- */
.statusbar {
  height: var(--status-h); flex: 0 0 auto;
  display: flex; align-items: center; gap: 8px;
  padding: 0 var(--pad);
  background: var(--brand-dark); color: #fff; font-size: 11px;
}
.statusbar > span { white-space: nowrap; }
/* The status line must never wrap: at 26px tall a second line is clipped, and
   a clipped status line is a status line that lies. The collection status
   ellipsises, the connection label drops on narrow screens, and the credit —
   which is the one thing asked to be in this corner — always survives. */
.statusbar .st { overflow: hidden; text-overflow: ellipsis; min-width: 0; }
.statusbar .credit { flex: 0 0 auto; }
@media (max-width: 560px) { .statusbar .net { display: none; } }
.statusbar .dot { width: 7px; height: 7px; border-radius: 50%; background: #9BE6A8; flex: 0 0 auto; }
.statusbar .dot.off { background: #BDB6CC; }
.statusbar .dot.bad { background: #FF9A92; }
.statusbar .sp { flex: 1; }

/* ---------- cards ---------- */
.card {
  background: var(--card); border: 1px solid var(--line); border-radius: var(--r);
  padding: 12px; min-height: 0;
}
.card.tight { padding: 10px; }
.card-t { font-weight: 700; font-size: 14px; margin: 0 0 4px; }
.card-s { color: var(--ink-soft); font-size: 13px; margin: 0; }

.scroller { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; gap: 8px; }

/* ---------- findings ---------- */
.finding { border-radius: 12px; border: 1px solid var(--line); background: var(--card); overflow: hidden; }
.finding.warning { border-color: var(--warning); background: var(--warning-bg); }
.finding.attention { border-color: color-mix(in srgb, var(--attention) 45%, transparent); background: var(--attention-bg); }
.finding.watch { border-color: color-mix(in srgb, var(--watch) 40%, transparent); background: var(--watch-bg); }
.finding-head {
  width: 100%; display: flex; align-items: center; gap: 9px;
  padding: 9px 11px; background: none; border: 0; text-align: left;
}
.badge {
  flex: 0 0 auto; font-size: 10px; font-weight: 800; letter-spacing: .4px;
  text-transform: uppercase; padding: 3px 7px; border-radius: 999px;
  background: var(--ink-faint); color: #fff; white-space: nowrap;
}
.badge.warning { background: var(--warning); }
.badge.attention { background: var(--attention); }
.badge.watch { background: var(--watch); }
.badge.none { background: var(--ink-faint); }
.finding-t { flex: 1; font-weight: 650; font-size: 14px; line-height: 1.25; }
.chev { flex: 0 0 auto; color: var(--ink-faint); font-size: 12px; }
.finding-body { padding: 0 11px 11px 11px; font-size: 13px; color: var(--ink-soft); }
.finding-body p { margin: 0 0 7px; }
.steps { margin: 6px 0 0; padding-left: 17px; }
.steps li { margin-bottom: 4px; }
.cite { margin-top: 8px; font-size: 11px; color: var(--ink-faint); line-height: 1.35; }
.cite b { color: var(--ink-soft); }
.emergency {
  flex: 0 0 auto; border: 1px solid var(--warning); background: var(--warning-bg);
  color: var(--warning); border-radius: 12px; padding: 10px 12px;
  font-size: 12.5px; font-weight: 600; line-height: 1.4;
}
.flagline {
  margin-top: 7px; padding: 6px 8px; border-radius: 8px;
  background: var(--attention-bg); color: var(--attention);
  font-size: 11px; font-weight: 600; line-height: 1.35;
}

/* ---------- sub tabs ---------- */
.subtabs { display: flex; gap: 5px; flex: 0 0 auto; flex-wrap: wrap; }
.subtab {
  border: 1px solid var(--line); background: var(--card); color: var(--ink-soft);
  border-radius: 999px; padding: 5px 11px; font-size: 12.5px; font-weight: 600;
}
.subtab[aria-selected="true"] { background: var(--brand); color: #fff; border-color: var(--brand); }

/* ---------- tables ---------- */
.tbl { width: 100%; border-collapse: collapse; font-size: 13px; }
.tbl th {
  text-align: left; font-size: 10.5px; text-transform: uppercase; letter-spacing: .4px;
  color: var(--ink-faint); padding: 5px 7px; border-bottom: 1px solid var(--line); font-weight: 700;
}
.tbl td { padding: 7px; border-bottom: 1px solid var(--line); vertical-align: top; }
.tbl tr:last-child td { border-bottom: 0; }
.tbl .num { text-align: right; font-variant-numeric: tabular-nums; }
.pill { display: inline-block; font-size: 10.5px; font-weight: 700; padding: 2px 7px; border-radius: 999px; }
.pill.on { background: var(--calm-bg); color: var(--calm); }
.pill.off { background: var(--line); color: var(--ink-faint); }
.pill.sev { background: var(--warning-bg); color: var(--warning); }

/* ---------- pager ---------- */
.pager { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--ink-soft); }
.pager .sp { flex: 1; }
.pgbtn {
  border: 1px solid var(--line); background: var(--card); border-radius: 9px;
  padding: 5px 10px; font-size: 12.5px; font-weight: 600;
}
.pgbtn:disabled { opacity: .4; cursor: default; }

/* ---------- buttons ---------- */
.btn {
  border: 1px solid var(--brand); background: var(--brand); color: #fff;
  border-radius: 11px; padding: 9px 14px; font-size: 13.5px; font-weight: 650;
  display: inline-flex; align-items: center; gap: 7px; justify-content: center;
}
.btn.ghost { background: var(--card); color: var(--brand); }
.btn.quiet { background: var(--card); color: var(--ink-soft); border-color: var(--line); }
.btn.danger { background: var(--card); color: var(--warning); border-color: var(--warning); }
.btn.wide { width: 100%; }
.btn:disabled { opacity: .5; cursor: default; }
.btnrow { display: flex; gap: 8px; flex-wrap: wrap; }

/* ---------- forms ---------- */
.frm { display: grid; gap: 9px; }
.frm.two { grid-template-columns: 1fr 1fr; }
.frm.three { grid-template-columns: 1fr 1fr 1fr; }
.fld { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
.fld label { font-size: 11px; font-weight: 700; color: var(--ink-soft); text-transform: uppercase; letter-spacing: .3px; }
.fld input, .fld select {
  border: 1px solid var(--line); border-radius: 9px; padding: 8px 10px;
  background: var(--card); font-size: 14px; min-width: 0; width: 100%;
}
.fld input:focus, .fld select:focus { outline: 2px solid var(--brand); outline-offset: -1px; }
.hint { font-size: 11px; color: var(--ink-faint); line-height: 1.35; }

/* ---------- lists of links (wayfinding) ---------- */
.linkgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.linkcard {
  display: flex; flex-direction: column; gap: 3px; text-align: left;
  border: 1px solid var(--line); background: var(--card); border-radius: 12px;
  padding: 10px 11px; text-decoration: none; color: inherit;
}
.linkcard .nm { font-weight: 650; font-size: 13.5px; line-height: 1.2; }
.linkcard .sub { font-size: 11.5px; color: var(--ink-faint); line-height: 1.3; }
.linkcard.big {
  border-color: var(--brand); background: var(--brand-tint);
  flex: 0 0 auto; padding: 15px 17px; gap: 4px;
}
.linkcard.big .nm { font-size: 18px; }
.linkcard.big .sub { font-size: 13px; color: var(--ink-soft); }
.linkcard .go { font-size: 13px; font-weight: 800; color: var(--brand); margin-top: 6px; }
.linkcard.unconfirmed .nm { color: var(--ink-soft); font-weight: 600; }

/* ---------- posters ---------- */
.postergrid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 9px;
  flex: 1 1 auto; min-height: 0; grid-auto-rows: minmax(0, 1fr);
}
.postercard {
  border: 1px solid var(--line); border-radius: 12px; overflow: hidden;
  background: var(--card); padding: 0; display: flex; flex-direction: column;
  text-align: left; min-height: 0;
}
/* contain, not cover: a poster that has been cropped to fit a box has lost the
   half of its argument that was in the cropped part. */
.postercard img {
  width: 100%; flex: 1 1 auto; min-height: 0; object-fit: contain;
  display: block; background: var(--brand-tint);
}
.postercard .cap { flex: 0 0 auto; padding: 7px 9px; font-size: 11.5px; font-weight: 600; line-height: 1.25;
  display: flex; flex-direction: column; gap: 2px; }
.postercard .cap .credit { font-size: 9.5px; font-weight: 600; color: var(--ink-faint); }

/* The dashboard's chart grid. Rows share the leftover height, and each chart
   keeps its aspect ratio inside its row rather than being stretched. */
.chartgrid { display: grid; grid-template-columns: 1fr; gap: 9px; flex: 1 1 auto; min-height: 0;
  align-content: start; }
.chartgrid .card { overflow: hidden; display: flex; flex-direction: column; min-height: 0; }
.chartgrid .chart { flex: 1 1 auto; min-height: 0; max-height: 100%; width: 100%; margin: 0 auto; }

/* The stacked bar is HTML: 24px thick at any width, 2px gaps in the surface
   colour doing the separating, outer ends rounded. */
.stackbar { display: flex; height: 24px; gap: 2px; margin-top: 2px; }
.stackbar .seg { min-width: 3px; display: flex; align-items: center; justify-content: center;
  font-size: 11px; font-weight: 700; color: #fff; overflow: hidden; }
.stackbar .seg.first { border-radius: 4px 0 0 4px; }
.stackbar .seg.last { border-radius: 0 4px 4px 0; }
.stackbar .seg.first.last { border-radius: 4px; }

.lightbox {
  position: fixed; inset: 0; z-index: 50; background: rgba(12,8,22,.92);
  display: flex; flex-direction: column; padding: 12px; gap: 10px;
}
.lightbox img { flex: 1 1 auto; min-height: 0; width: 100%; object-fit: contain; }
.lightbox .lbbar { flex: 0 0 auto; display: flex; align-items: center; gap: 8px; color: #fff; font-size: 13px; }
.lightbox .lbbar .sp { flex: 1; }

/* ---------- modal ---------- */
.modal {
  position: fixed; inset: 0; z-index: 60; background: rgba(12,8,22,.55);
  display: flex; align-items: center; justify-content: center; padding: 16px;
}
.modal-card {
  background: var(--card); border-radius: 16px; padding: 18px;
  width: 100%; max-width: 480px; max-height: 100%;
  display: flex; flex-direction: column; gap: 10px; min-height: 0;
}
.modal-card h2 { margin: 0; font-size: 18px; }
.modal-scroll { overflow-y: auto; min-height: 0; }

/* ---------- misc ---------- */
.empty { display: flex; flex-direction: column; align-items: center; justify-content: center;
  text-align: center; gap: 10px; flex: 1 1 auto; color: var(--ink-soft); padding: 20px; }
.empty .big { font-size: 15px; font-weight: 700; color: var(--ink); }
.kv { display: grid; grid-template-columns: auto 1fr; gap: 3px 10px; font-size: 12px; }
.kv dt { color: var(--ink-faint); font-weight: 600; }
.kv dd { margin: 0; font-variant-numeric: tabular-nums; }
.note { font-size: 11.5px; color: var(--ink-faint); line-height: 1.4; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }
.chipline { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 999px; background: var(--brand-tint); color: var(--brand); }
.bullets { margin: 0; padding-left: 17px; font-size: 13px; color: var(--ink-soft); }
.bullets li { margin-bottom: 5px; }
.sparkrow { display: flex; align-items: flex-end; gap: 3px; height: 34px; }
.sparkrow i { flex: 1; background: var(--brand); border-radius: 2px 2px 0 0; min-height: 2px; display: block; }

/* ---------- brand: logos, credit, building backdrop ---------- */
.hdr-logos { display: flex; align-items: center; gap: 7px; flex: 0 0 auto; }
.hdr-logos img { height: 32px; width: auto; display: block; border-radius: 3px; background: #fff; padding: 2px; }
.hdr-logos .wide-only { display: block; }
@media (max-width: 560px) { .hdr-logos .wide-only { display: none; } }

/* The WCC building, as a faint backdrop. It sits behind the cards, which are
   opaque, so it only ever shows in the gutters and can never reduce the
   contrast of text sitting on a card. */
.shell::before {
  content: ''; position: fixed; inset: 0; z-index: -1; pointer-events: none;
  background-image: url('/brand/wcc.jpg');
  background-size: cover; background-position: center 35%;
  filter: grayscale(1) contrast(0.7);
  opacity: 0.07;
  mask-image: linear-gradient(to bottom, transparent 0%, #000 38%, #000 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, #000 38%, #000 100%);
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .shell::before { opacity: 0.1; filter: grayscale(1) contrast(0.55) invert(1); }
}

.statusbar .credit { font-weight: 600; opacity: .92; white-space: nowrap; }
@media (max-width: 430px) { .statusbar .credit { font-size: 10px; } }

/* ---------- stat tiles & charts ---------- */
.kpirow { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; flex: 0 0 auto; }
@media (max-width: 560px) { .kpirow { grid-template-columns: repeat(2, 1fr); } }
.stat {
  background: var(--card); border: 1px solid var(--line); border-radius: 12px;
  padding: 9px 10px; display: flex; flex-direction: column; gap: 1px; min-width: 0;
}
.stat-l { font-size: 10px; font-weight: 700; letter-spacing: .3px; text-transform: uppercase; color: var(--ink-faint); }
.stat-v { font-size: 26px; font-weight: 700; line-height: 1.1; letter-spacing: -0.5px; font-variant-numeric: tabular-nums; }
.stat-u { font-size: 12px; font-weight: 600; color: var(--ink-faint); margin-left: 3px; }
.stat-s { font-size: 10.5px; color: var(--ink-soft); }
.stat.warning { border-color: var(--warning); background: var(--warning-bg); }
.stat.warning .stat-v { color: var(--warning); }

.chart { width: 100%; height: auto; display: block; overflow: visible; }
.chart .grid { stroke: var(--grid); stroke-width: 1; }
.chart .cutoff { stroke: var(--attention); stroke-width: 1; stroke-dasharray: 3 3; }
.chart .line { stroke: var(--brand); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
.chart .dot { fill: var(--brand); stroke: var(--card); stroke-width: 2; }
.chart .axis { font-size: 11px; fill: var(--ink-faint); }
.chart .endlabel { font-size: 14px; font-weight: 700; fill: var(--ink); }
.chart .seglabel { font-size: 11px; font-weight: 700; fill: #fff; }
.cite .cutkey { display: inline-block; width: 14px; height: 0; vertical-align: middle;
  border-top: 2px dashed var(--attention); margin-right: 3px; }
.chart-empty { font-size: 12px; color: var(--ink-faint); margin: 6px 0; }
.chart-t { font-size: 12px; font-weight: 700; margin: 0 0 5px; }

.legend { display: flex; flex-wrap: wrap; gap: 4px 11px; margin-top: 7px; }
.legend .lg { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; color: var(--ink-soft); }
.legend .lg i { width: 9px; height: 9px; border-radius: 2px; flex: 0 0 auto; }
.linkbtn {
  background: none; border: 0; padding: 3px 0 0; font-size: 10.5px; font-weight: 600;
  color: var(--brand); text-decoration: underline; text-underline-offset: 2px;
}
.tbl.mini th, .tbl.mini td { padding: 3px 5px; font-size: 11.5px; }

.demobar {
  flex: 0 0 auto; display: flex; align-items: center; gap: 9px;
  border: 1px dashed var(--attention); background: var(--attention-bg); color: var(--attention);
  border-radius: 11px; padding: 8px 11px; font-size: 12px; line-height: 1.35;
}
.demobar b { text-transform: uppercase; letter-spacing: .5px; font-size: 10px;
  background: var(--attention); color: #fff; padding: 2px 7px; border-radius: 999px; flex: 0 0 auto; }
.demobar .sp { flex: 1; }

/* ---------- record stations (the pipeline) ---------- */
.stations { display: flex; align-items: stretch; gap: 0; flex: 0 0 auto; overflow: hidden; }
.station {
  flex: 1 1 0; min-width: 0; position: relative;
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  background: none; border: 0; padding: 4px 2px 5px;
}
.station .num {
  width: 24px; height: 24px; border-radius: 50%; flex: 0 0 auto;
  display: flex; align-items: center; justify-content: center;
  font-size: 11.5px; font-weight: 800;
  background: var(--card); color: var(--ink-faint); border: 1.5px solid var(--line);
}
.station .nm { font-size: 10px; font-weight: 600; color: var(--ink-faint); line-height: 1.15;
  text-align: center; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.station.done .num { background: var(--calm-bg); color: var(--calm); border-color: var(--calm); }
.station[aria-selected="true"] .num { background: var(--brand); color: #fff; border-color: var(--brand); }
.station[aria-selected="true"] .nm { color: var(--brand); font-weight: 700; }
/* the connector between stations, drawn behind the numbers */
.station::after {
  content: ''; position: absolute; top: 15px; left: 50%; width: 100%; height: 1.5px;
  background: var(--line); z-index: -1;
}
.station:last-child::after { display: none; }
.station.done::after { background: var(--calm); }
.stationwrap { position: relative; z-index: 0; }

/* ---------- wayfinding cards with a photograph ---------- */
.sitecard {
  flex: 1 1 0; min-height: 0; display: flex; flex-direction: column;
  border: 1px solid var(--line); border-radius: 14px; overflow: hidden; background: var(--card);
}
.sitecard img { width: 100%; flex: 1 1 auto; min-height: 56px; object-fit: cover; display: block; background: var(--line); }
.sitecard .body { flex: 0 0 auto; padding: 9px 11px 10px; display: flex; flex-direction: column; gap: 2px; }
.sitecard .nm { font-size: 15px; font-weight: 700; line-height: 1.2; }
.sitecard .sub { font-size: 11.5px; color: var(--ink-soft); line-height: 1.3; }
.sitecard .acts { display: flex; gap: 7px; align-items: center; margin-top: 7px; }
.sitecard .acts .btn { padding: 7px 12px; font-size: 12.5px; }

.deptcard {
  display: flex; align-items: center; gap: 9px; text-align: left; text-decoration: none; color: inherit;
  border: 1px solid var(--line); background: var(--card); border-radius: 12px; padding: 8px 10px;
}
.deptcard .ic {
  width: 32px; height: 32px; flex: 0 0 auto; border-radius: 9px;
  background: var(--brand-tint); color: var(--brand);
  display: flex; align-items: center; justify-content: center;
}
.deptcard .ic svg { width: 18px; height: 18px; }
.deptcard .tx { min-width: 0; flex: 1; }
.deptcard .nm { font-size: 12.5px; font-weight: 650; line-height: 1.2; }
.deptcard .sub { font-size: 10.5px; color: var(--brand); font-weight: 600; }
.deptcard.unconfirmed .sub { color: var(--ink-faint); font-weight: 500; }
.deptcard .pin { flex: 0 0 auto; font-size: 10.5px; color: var(--brand); font-weight: 700; text-decoration: underline; }
.deptcard.unconfirmed .ic { background: var(--line); color: var(--ink-faint); }

/* ---------- triage: emergency or not ---------- */
.triage { display: grid; grid-template-columns: 1fr 1fr; gap: 9px; flex: 0 1 auto; min-height: 0;
  align-items: start; }
@media (max-width: 560px) { .triage { grid-template-columns: 1fr; } }
.tcol { border-radius: 12px; border: 1px solid var(--line); padding: 9px 11px; min-height: 0;
  display: flex; flex-direction: column; background: var(--card); }
.tcol.ok { border-color: var(--calm); background: var(--calm-bg); }
.tcol.bad { border-color: var(--warning); background: var(--warning-bg); }
.tcol h3 { margin: 0 0 2px; font-size: 13.5px; font-weight: 800; }
.tcol.ok h3 { color: var(--calm); }
.tcol.bad h3 { color: var(--warning); }
.tcol .where { font-size: 11px; font-weight: 700; margin: 0 0 6px; color: var(--ink-soft); }
.tcol ul { margin: 0; padding-left: 16px; font-size: 11.5px; line-height: 1.45; color: var(--ink); }
.tcol li { margin-bottom: 2px; }

/* ---------- print ---------- */
.printonly { display: none; }
@media print {
  html, body, #root { height: auto; overflow: visible; }
  .shell { display: none !important; }
  .modal, .lightbox { display: none !important; }
  .printonly { display: block; padding: 14mm; color: #000; font-size: 11pt; }
  .printonly h1 { font-size: 16pt; margin: 0 0 2mm; }
  .printonly h2 { font-size: 12pt; margin: 6mm 0 2mm; border-bottom: 1pt solid #000; padding-bottom: 1mm; }
  .printonly table { width: 100%; border-collapse: collapse; font-size: 10pt; }
  .printonly th, .printonly td { border: 0.5pt solid #666; padding: 1.5mm 2mm; text-align: left; }
  .printonly .meta { font-size: 9pt; color: #333; }
  .printonly .plogos { display: flex; gap: 8mm; align-items: center; margin-bottom: 4mm; }
  .printonly .plogos img { height: 16mm; width: auto; }
  .printonly .warn { border: 1pt solid #000; padding: 2mm; font-weight: bold; margin: 3mm 0; }
}

/* ---------- small screens: the tab bar gets tighter, nothing scrolls ---------- */
@media (max-width: 430px) {
  :root { --pad: 11px; --tabbar-h: 56px; }
  .tabbtn { font-size: 9px; }
  .tabbtn svg { width: 19px; height: 19px; }
  .frm.three { grid-template-columns: 1fr 1fr; }
  .linkgrid, .postergrid { grid-template-columns: 1fr; }
}

/* ---------- wide screens: keep the column readable ---------- */
@media (min-width: 1100px) {
  .pane { max-width: 980px; width: 100%; margin: 0 auto; }
  .postergrid { grid-template-columns: repeat(3, 1fr); }
  .linkgrid { grid-template-columns: repeat(3, 1fr); }
}
`
