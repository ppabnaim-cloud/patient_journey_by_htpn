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
  --c-appointments: #6D3BBF; --c-appointments-t: #F0E9FA;
  --c-dashboard:    #1F6FD0; --c-dashboard-t:    #E6F0FC;
  --c-records:      #0E7C73; --c-records-t:      #E0F2F0;
  --c-measurements: #2F8A4E; --c-measurements-t: #E5F3E9;
  --c-wayfinding:   #C2621B; --c-wayfinding-t:   #FBEDE1;
  --c-iqms:         #3B5BBF; --c-iqms-t:         #E9EDFB;
  --c-myubat:       #A8357F; --c-myubat-t:       #FAE7F3;
  --c-rakyat:       #B3384A; --c-rakyat-t:       #FBE8EB;
  --c-feedback:     #9A6407; --c-feedback-t:     #FAF0DE;
  --c-home: #5B2D8E; --c-home-t: #F0E9FA;
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
    --c-appointments: #C0A2EC; --c-appointments-t: #2B2140;
    --c-dashboard:    #93C0F0; --c-dashboard-t:    #152638;
    --c-records:      #7ECFC6; --c-records-t:      #12302D;
    --c-measurements: #9ED5AE; --c-measurements-t: #16301E;
    --c-wayfinding:   #F0B183; --c-wayfinding-t:   #352211;
    --c-iqms:         #A9B8F0; --c-iqms-t:         #1B2240;
    --c-myubat:       #EFA3D2; --c-myubat-t:       #341630;
    --c-rakyat:       #F0A3AD; --c-rakyat-t:       #37181D;
    --c-feedback:     #EAC078; --c-feedback-t:     #342710;
    --c-home: #B388E0; --c-home-t: #2A1F3D;
    --grid: #2E2742;
  }
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

html, body, #root {
  height: 100%;
  /* dvh, not vh: on iOS Safari the toolbar shrinks the visible area and a
     100vh shell ends up taller than the screen, which is how content came to
     sit on top of the tab bar on a real phone. */
  height: 100dvh;
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
  height: calc(var(--header-h) + env(safe-area-inset-top, 0px));
  padding-top: env(safe-area-inset-top, 0px);
  flex: 0 0 auto;
  display: flex; align-items: center; gap: 10px;
  padding: 0 var(--pad);
  background: var(--brand); color: #fff;
}
.hdr-id {
  background: none; border: 0; padding: 2px 4px; margin-left: -4px; border-radius: 8px;
  display: flex; flex-direction: column; align-items: flex-start; gap: 1px;
  min-width: 0; text-align: left; color: inherit;
}
.hdr-id:hover, .hdr-id:focus-visible { background: rgba(255,255,255,.12); }
.hdr-title { display: block; font-weight: 700; font-size: 16px; letter-spacing: -0.2px; line-height: 1.1; }
.hdr-sub {
  display: block; font-size: 11px; opacity: .88; line-height: 1.1;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;
}
@media (max-width: 430px) { .hdr-title { font-size: 15px; } .hdr-sub { font-size: 10px; } }

/* The multi-centre line sits above the medicines list, which is where a
   patient is standing when it is relevant. */
.note.multisite {
  flex: 0 0 auto; border-left: 3px solid var(--brand); padding: 6px 0 6px 9px;
  color: var(--ink-soft); font-size: 11.5px;
}

.newsfig { margin: 0 0 8px; }
.newsfig img { width: 100%; max-height: 180px; object-fit: cover; object-position: center 22%;
  border-radius: 10px; display: block; background: var(--line); }
.newsfig figcaption { margin-top: 4px; font-size: 10px; color: var(--ink-faint); }
.newshead { margin: 0; font-size: 14px; font-weight: 700; line-height: 1.3; }

blockquote.quote {
  margin: 0 0 8px; padding: 9px 11px; border-left: 3px solid var(--brand);
  background: var(--brand-tint); border-radius: 0 9px 9px 0;
  font-size: 13px; line-height: 1.45; font-style: italic; color: var(--ink);
}
blockquote.quote cite { display: block; margin-top: 5px; font-style: normal;
  font-size: 11.5px; font-weight: 700; color: var(--ink-soft); }
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

.pane-body {
  flex: 1 1 auto; min-height: 0;
  display: flex; flex-direction: column; gap: 10px;
  overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch;
}
/* Without this a child squashes below its own content instead of scrolling,
   and the text lands on top of the card beneath it. */
.pane-body > * { flex-shrink: 0; }
.pane-foot { flex: 0 0 auto; display: flex; align-items: center; gap: 8px; }

/* ---------- tab bar ---------- */
.tabbar {
  height: var(--tabbar-h); flex: 0 0 auto;
  display: grid; grid-template-columns: repeat(10, 1fr);
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
  height: calc(var(--status-h) + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  flex: 0 0 auto;
  display: flex; align-items: center; gap: 8px;
  padding-left: var(--pad); padding-right: var(--pad);
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
/* A list card fills the space it is given on a tablet; inside the phone's
   scrolling pane it takes its own height instead (see the small-screen
   block below). */
.listcard { flex: 1 1 auto; min-height: min-content; display: flex; flex-direction: column; }
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
.chartgrid { display: grid; grid-template-columns: 1fr; gap: 9px; flex: 1 1 auto; min-height: 0; }
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
.stat-l { font-size: 10px; font-weight: 700; letter-spacing: .3px; text-transform: uppercase;
  color: var(--ink-faint); display: flex; align-items: center; gap: 5px; }
.stat-ic { display: inline-flex; color: var(--brand); flex: 0 0 auto; }
.stat-ic svg { width: 13px; height: 13px; }
.stat.allergy.has .stat-ic { color: var(--warning); }
.stat-v { font-size: 26px; font-weight: 700; line-height: 1.1; letter-spacing: -0.5px; font-variant-numeric: tabular-nums; }
.stat-u { font-size: 12px; font-weight: 600; color: var(--ink-faint); margin-left: 3px; }
.stat-s { font-size: 10.5px; color: var(--ink-soft); }
.stat.warning { border-color: var(--warning); background: var(--warning-bg); }
.stat.warning .stat-v { color: var(--warning); }

/* Allergy tile: the substances, not a count, and red whenever there are any. */
.stat.allergy.has { border-color: var(--warning); background: var(--warning-bg); }
.allergy-list { list-style: none; margin: 3px 0 0; padding: 0; display: flex;
  flex-direction: column; gap: 1px; min-width: 0; }
.allergy-list li {
  font-size: 14px; font-weight: 800; line-height: 1.25; color: var(--warning);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.allergy-more { font-size: 10.5px; font-weight: 700; color: var(--warning); margin-top: 1px; }
.allergy-badge {
  align-self: flex-start; margin-top: 4px; font-size: 9.5px; font-weight: 800;
  letter-spacing: .5px; text-transform: uppercase; padding: 2px 7px;
  border-radius: 999px; background: var(--warning); color: #fff;
}
/* A short pulse on open, then still. Not a blink: content that flashes
   indefinitely breaches WCAG 2.2.2 and stops being noticed within a week. */
.stat.allergy.severe { animation: allergy-pulse 1.4s ease-in-out 3; }
@keyframes allergy-pulse {
  0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--warning) 0%, transparent); }
  50% { box-shadow: 0 0 0 5px color-mix(in srgb, var(--warning) 32%, transparent); }
}
@media (prefers-reduced-motion: reduce) {
  .stat.allergy.severe { animation: none; }
}

.chart { width: 100%; height: auto; display: block; overflow: visible; }
.chart .grid { stroke: var(--grid); stroke-width: 1; }
.chart .cutoff { stroke: var(--attention); stroke-width: 1; stroke-dasharray: 3 3; }
.chart .line { stroke: var(--brand); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
.chart .dot { fill: var(--brand); stroke: var(--card); stroke-width: 2; }
.chart .axis { font-size: 10.5px; fill: var(--ink-faint); }
.chart .endlabel { font-size: 14px; font-weight: 700; fill: var(--ink); }
.chart .seglabel { font-size: 11px; font-weight: 700; fill: #fff; }
.cite .cutkey { display: inline-block; width: 14px; height: 0; vertical-align: middle;
  border-top: 2px dashed var(--attention); margin-right: 3px; }
.chart-empty { font-size: 12px; color: var(--ink-faint); margin: 5px 0; }
.chart-t { font-size: 12px; font-weight: 700; margin: 0 0 5px;
  display: flex; align-items: center; gap: 6px; }
.ct-ic { display: inline-flex; color: var(--brand); flex: 0 0 auto; }
.ct-ic svg { width: 14px; height: 14px; }

/* An empty chart shows a drawing of the chart it is waiting for. The solid
   part is what exists, the faint part is what is still to come. */
.chart-blank { display: flex; align-items: center; gap: 12px; padding: 2px 0; }
.art { width: 124px; height: auto; flex: 0 0 auto; fill: none;
  stroke-linecap: round; stroke-linejoin: round; }
.art .art-base { stroke: var(--line); stroke-width: 1.5; }
.art .art-line { stroke: var(--brand); stroke-width: 2.5; }
.art .art-ghost { stroke: var(--brand); stroke-width: 2.5; opacity: .3; stroke-dasharray: 5 6; }
.art .art-dot { fill: var(--brand); stroke: none; }
.art .art-ghostdot { fill: var(--brand); stroke: none; opacity: .3; }
.art .art-bar { stroke: var(--brand); stroke-width: 9; }
.art .art-ghostbar { stroke: var(--brand); stroke-width: 9; opacity: .22; }
@media (max-width: 560px) { .art { width: 98px; } }

.legend { display: flex; flex-wrap: wrap; gap: 4px 11px; margin-top: 7px; }
.legend .lg { display: inline-flex; align-items: center; gap: 5px; font-size: 11px; color: var(--ink-soft); }
.legend .lg i { width: 9px; height: 9px; border-radius: 2px; flex: 0 0 auto; }
.linkbtn {
  background: none; border: 0; padding: 3px 0 0; font-size: 10.5px; font-weight: 600;
  color: var(--brand); text-decoration: underline; text-underline-offset: 2px;
}
.tbl.mini th, .tbl.mini td { padding: 3px 5px; font-size: 11.5px; }

.multibar {
  flex: 0 0 auto; display: flex; align-items: flex-start; gap: 9px; width: 100%;
  border: 1px solid var(--brand); background: var(--brand-tint); color: var(--ink);
  border-radius: 11px; padding: 9px 11px; text-align: left;
}
.multibar .mb-i { flex: 0 0 auto; color: var(--brand); font-size: 15px; line-height: 1.2; }
.multibar .mb-t { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.multibar .mb-t b { font-size: 12.5px; line-height: 1.25; color: var(--brand-dark); }
.multibar .mb-t span { font-size: 11.5px; line-height: 1.35; color: var(--ink-soft); }
.multibar .mb-go { flex: 0 0 auto; color: var(--brand); font-size: 18px; font-weight: 700; }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) .multibar .mb-t b { color: var(--brand); }
}

.emptybar {
  flex: 0 0 auto; display: flex; align-items: center; gap: 9px;
  border: 1px solid var(--line); background: var(--card); color: var(--ink-soft);
  border-radius: 11px; padding: 8px 11px; font-size: 12px; line-height: 1.35;
}
.emptybar .sp { flex: 1; }

/* A list where each item carries a pictogram. */
.glyphlist { list-style: none; margin: 0; padding: 0; }
.glyphlist li { display: flex; align-items: center; gap: 9px; margin-bottom: 7px;
  font-size: 12.5px; line-height: 1.35; }
.glyphlist.roomy li { font-size: 13px; margin-bottom: 11px; align-items: center; }
.glyphlist .g { flex: 0 0 auto; width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  background: var(--card); border: 1px solid var(--line); }
.glyphlist.roomy .g { width: 30px; height: 30px; border-radius: 9px; }
.glyphlist .g svg { width: 18px; height: 18px; }
.glyphlist.roomy .g svg { width: 19px; height: 19px; }
.tcol.ok .glyphlist .g { color: var(--calm); border-color: color-mix(in srgb, var(--calm) 40%, transparent); }
.tcol.bad .glyphlist .g { color: var(--warning); border-color: color-mix(in srgb, var(--warning) 40%, transparent); }
.glyphlist.roomy .g { color: var(--warning); border-color: color-mix(in srgb, var(--warning) 40%, transparent); }

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
 /* Full-bleed: the photograph fills the card edge to edge. The crop is from
    sky and foreground, so the building itself — the thing a patient is looking
    for from the road — stays whole. */
.sitecard img { width: 100%; flex: 1 1 auto; min-height: 56px; object-fit: cover;
  object-position: center; display: block; background: var(--brand-tint); }
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

/* The iQMS poster sits beside its points on a tablet and above them on a
   phone, where a 36% column is too narrow for a tall portrait poster. */
.pane-body.sidebyside { flex-direction: row; gap: 12px; }
.pane-body.sidebyside > .postercard { flex: 0 0 36%; }
@media (max-width: 560px) {
  .pane-body.sidebyside { flex-direction: column; gap: 10px; }
  .pane-body.sidebyside > .postercard { flex: 0 0 auto; max-height: 46vh; }
}

/* ---------- meter & day bars (#gayahidupsihatHTPN) ---------- */
.meter { display: flex; flex-direction: column; gap: 5px; }
.meter-top { display: flex; align-items: baseline; gap: 8px; }
.meter-v { font-size: 25px; font-weight: 700; letter-spacing: -0.5px; font-variant-numeric: tabular-nums; }
.meter-u { font-size: 12px; font-weight: 600; color: var(--ink-faint); }
.meter-l { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .3px;
  color: var(--ink-faint); margin-left: auto; }
.meter-track { height: 10px; border-radius: 5px; background: var(--brand-tint); overflow: hidden; }
.meter-fill { height: 100%; border-radius: 5px; background: var(--brand); }
.meter-c { margin: 2px 0 0; font-size: 10.5px; color: var(--ink-faint); line-height: 1.35; }

.daybars { display: flex; gap: 6px; align-items: stretch; height: 140px; min-height: 70px; }
@media (max-width: 560px) { .daybars { height: 104px; } }
.daycol { flex: 1 1 0; display: flex; flex-direction: column; align-items: center; gap: 3px; min-width: 0; }
.dayv { font-size: 10px; font-weight: 700; color: var(--ink-soft); height: 13px; font-variant-numeric: tabular-nums; }
.daytrack { flex: 1 1 auto; width: 100%; max-width: 24px; display: flex; align-items: flex-end; min-height: 0; }
.daybar { width: 100%; background: color-mix(in srgb, var(--brand) 45%, transparent);
  border-radius: 4px 4px 0 0; }
.daybar.now { background: var(--brand); }
.dayl { font-size: 9.5px; color: var(--ink-faint); white-space: nowrap; }

.srclist { margin: 6px 0 0; padding-left: 15px; font-weight: 500; font-size: 10.5px; line-height: 1.45; }
.srclist li { margin-bottom: 2px; }
.srclist a { color: inherit; font-weight: 700; text-decoration: underline; text-underline-offset: 2px; }
.srcnote { margin-top: 3px; font-weight: 500; font-size: 10px; opacity: .85; }

.posterstrip {
  display: flex; gap: 8px; overflow-x: auto; padding-bottom: 2px;
  scrollbar-width: thin; overscroll-behavior-x: contain;
}
.pstrip-item {
  flex: 1 1 0; min-width: 84px; max-width: 150px; padding: 0;
  border: 1px solid var(--line); border-radius: 9px; overflow: hidden;
  background: var(--card); line-height: 0;
}
.pstrip-item img { width: 100%; aspect-ratio: 1.41; object-fit: cover; object-position: top center; display: block; }
.pstrip-item:hover, .pstrip-item:focus-visible { border-color: var(--brand); }
@media (max-width: 560px) {
  .pstrip-item { flex: 0 0 auto; width: 104px; min-width: 104px; }
}

.platgrid { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 7px; }
.platbtn {
  display: flex; align-items: center; justify-content: center; gap: 6px;
  border: 1px solid var(--line); background: var(--card); color: var(--ink);
  border-radius: 11px; padding: 10px 8px; font-size: 13px; font-weight: 650;
  text-decoration: none;
}
.hashline { display: flex; align-items: center; gap: 8px; }
.sitewarn { flex: 0 0 auto; padding: 11px 13px; border-radius: 11px;
  background: var(--attention-bg); border: 1px solid var(--attention);
  color: var(--ink); margin-bottom: 2px; }
.sitewarn .card-t { color: var(--attention); }
.splitrow { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
.splitway { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 999px;
  background: var(--brand-tint); color: var(--brand); }
.dhours, .dsign { display: block; font-size: 11px; color: var(--ink-soft); margin-top: 3px;
  line-height: 1.35; }
.pin.muted { color: var(--ink-faint); text-decoration: none; cursor: default; }
.flowlist { list-style: decimal; margin: 7px 0 0; padding-left: 18px;
  display: flex; flex-direction: column; gap: 3px; }
.flowlist li { font-size: 12px; line-height: 1.4; color: var(--ink); }

/* ---------- floor directory ---------- */
.floorcard { display: flex; flex-direction: column; }
.fl-head { margin: 0 0 7px; }
.fl-badge { display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: .03em;
  padding: 3px 9px; border-radius: 999px; background: var(--brand); color: #fff; }
.fl-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 4px; }
.fl-list li { font-size: 12px; line-height: 1.35; color: var(--ink); padding-left: 11px;
  position: relative; }
.fl-list li::before { content: ''; position: absolute; left: 0; top: 7px; width: 4px; height: 4px;
  border-radius: 50%; background: var(--line); }
.fl-list li.urgent { color: var(--warning); font-weight: 650; }
.fl-list li.urgent::before { background: var(--warning); }
.floorhits { display: flex; flex-direction: column; gap: 6px; margin-top: 9px; }
.floorhit { display: flex; align-items: center; gap: 9px; padding: 7px 10px;
  border: 1px solid var(--line); border-radius: 9px; background: var(--bg); }
.fl-name { font-size: 12.5px; font-weight: 600; color: var(--ink); }
.boardshot { display: block; width: 100%; padding: 0; border: 0; background: none; cursor: pointer;
  text-align: left; }
.boardshot img { width: 100%; border-radius: 10px; border: 1px solid var(--line); display: block; }
.boardshot .note { display: block; margin-top: 6px; }

/* ---------- wayfinding ---------- */
.buildingbar { flex: 0 0 auto; display: flex; align-items: center; gap: 9px;
  padding: 9px 12px; border-radius: 10px; margin-bottom: 2px;
  background: var(--brand-tint); color: var(--brand); font-size: 12.5px; }
.buildingbar .bb-ic { display: grid; flex: 0 0 auto; }
.buildingbar svg { width: 18px; height: 18px; }
.dwhy { display: block; margin-top: 3px; font-size: 11px; color: var(--brand);
  font-weight: 600; line-height: 1.35; }

/* ---------- home hub ---------- */
/* The landing screen. Big targets, one colour each, so a patient who opens
   the app for the first time can see everything it does without reading a
   tab bar of nine small words. */
.hero { flex: 0 0 auto; border-radius: var(--r); padding: 15px 16px; margin-bottom: 10px;
  background: linear-gradient(135deg, var(--brand) 0%, #8249C4 55%, #B06FD8 100%);
  color: #fff; }
:root[data-theme="dark"] .hero, :root:not([data-theme="light"]) .hero {
  background: linear-gradient(135deg, #3C1E63 0%, #5B2D8E 55%, #7A47B0 100%); }
.hero-t { margin: 0; font-size: 21px; font-weight: 800; letter-spacing: -0.3px; }
.hero-s { margin: 4px 0 0; font-size: 12.5px; opacity: .92; line-height: 1.45; }
.hero-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.hero-chip { font-size: 10.5px; font-weight: 700; letter-spacing: .03em; padding: 3px 9px;
  border-radius: 999px; background: rgba(255,255,255,.18); color: #fff; }

.hubgrid { display: grid; grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: minmax(0, 1fr); gap: 10px; flex: 1 1 auto; min-height: 0;
  max-height: 760px; }
@media (max-width: 560px) {
  /* A phone scrolls, so the cards take their own height instead of being
     squeezed into one screenful. */
  .hubgrid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: auto; flex: 0 0 auto; }
  .hubcard { min-height: 112px; }
}
.hubcard { display: flex; flex-direction: column; gap: 7px; align-items: flex-start;
  justify-content: center;
  padding: 14px 13px; border-radius: var(--r); border: 1px solid var(--line);
  background: var(--card); cursor: pointer; text-align: left; min-height: 104px;
  transition: transform .12s ease, box-shadow .12s ease; }
.hubcard:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,.10); }
.hubcard:active { transform: translateY(0); }
@media (prefers-reduced-motion: reduce) { .hubcard { transition: none; } .hubcard:hover { transform: none; } }
.hubic { width: 48px; height: 48px; border-radius: 14px; display: grid; place-items: center;
  flex: 0 0 auto; }
.hubic svg { width: 26px; height: 26px; }
.hubname { font-size: 15px; font-weight: 750; color: var(--ink); line-height: 1.25; }
.hubdesc { font-size: 11.5px; color: var(--ink-soft); line-height: 1.35; }
.hubbadge { position: absolute; }
.hubcard { position: relative; }
.hubcount { position: absolute; top: 9px; right: 9px; min-width: 19px; height: 19px;
  padding: 0 5px; border-radius: 999px; font-size: 11px; font-weight: 800;
  display: grid; place-items: center; color: #fff; }

/* ---------- appreciation board ---------- */
.teaser { flex: 0 0 auto; width: 100%; text-align: left; padding: 9px 12px; border-radius: 10px;
  border: 1px solid var(--brand); background: var(--brand-tint); color: var(--brand);
  font: inherit; font-size: 12.5px; font-weight: 700; cursor: pointer; }
.appgrid { display: flex; flex-direction: column; gap: 5px; margin-top: 7px; }
.approw { display: grid; grid-template-columns: 112px 1fr 30px; align-items: center; gap: 8px; }
.apploc { font-size: 12px; font-weight: 650; color: var(--ink); overflow: hidden;
  text-overflow: ellipsis; white-space: nowrap; }
.appbar { display: block; height: 11px; border-radius: 999px; background: var(--grid); overflow: hidden; }
.appbar i { display: block; height: 100%; border-radius: 999px; background: var(--brand); }
.appn { font-size: 12px; font-weight: 700; color: var(--ink-soft); text-align: right;
  font-variant-numeric: tabular-nums; }

/* ---------- feedback ---------- */
/* The one tab that transmits says so on every view, in a colour used
   nowhere else in the app. */
.sendbar { flex: 0 0 auto; margin: 0 0 8px; padding: 6px 11px; border-radius: 8px;
  font-size: 12px; font-weight: 700; background: var(--watch-bg); color: var(--watch);
  border: 1px solid var(--watch); }
.stars { display: flex; gap: 4px; margin-top: 8px; }
.star { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 2px;
  padding: 7px 2px; border: 1px solid var(--line); border-radius: 10px;
  background: var(--card); cursor: pointer; }
.star.on { border-color: var(--brand); background: var(--brand-tint); }
.star-g { font-size: 19px; line-height: 1; color: var(--ink-faint); }
.star.on .star-g { color: var(--brand); }
.star-l { font-size: 9.5px; font-weight: 700; letter-spacing: .02em; color: var(--ink-soft);
  text-align: center; line-height: 1.2; }
.star.on .star-l { color: var(--brand); }
.pickcard { text-align: left; width: 100%; border: 1px solid var(--line); cursor: pointer; }
.pickcard.on { border-color: var(--brand); }
.chk { display: flex; gap: 9px; align-items: flex-start; font-size: 13px; line-height: 1.45; }
.chk input { margin-top: 2px; flex: 0 0 auto; width: 17px; height: 17px; accent-color: var(--brand); }
textarea { width: 100%; font: inherit; font-size: 13.5px; padding: 8px 10px; resize: vertical;
  border: 1px solid var(--line); border-radius: 9px; background: var(--card); color: var(--ink); }

.onerecord { flex: 0 0 auto; padding: 9px 12px; border-radius: 10px; margin-bottom: 8px;
  background: var(--brand-tint); color: var(--ink); font-size: 12px; line-height: 1.5; }
.appthosp { margin: 3px 0 0; font-size: 11.5px; color: var(--ink-soft); }
.monthbar { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.monthname { font-size: 14px; font-weight: 750; color: var(--ink); }
.calgrid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 3px; margin-top: 9px; }
.calhead { font-size: 10px; font-weight: 800; color: var(--ink-faint); text-align: center;
  padding-bottom: 2px; letter-spacing: .02em; }
.calcell { min-height: 38px; border-radius: 8px; border: 1px solid var(--line);
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 3px;
  background: var(--card); }
.calcell.empty { border-color: transparent; background: none; }
.caldate { font-size: 12px; color: var(--ink); font-variant-numeric: tabular-nums; }
.calcell.today { border-color: var(--brand); }
.calcell.today .caldate { font-weight: 800; color: var(--brand); }
.calcell.has { background: var(--brand-tint); }
.calcell.clash { border-color: var(--attention); background: var(--attention-bg); }
.caldots { display: flex; gap: 2px; }
.caldots i { width: 5px; height: 5px; border-radius: 50%; background: var(--brand); display: block; }
.calcell.clash .caldots i { background: var(--attention); }
.clashday { display: flex; flex-direction: column; gap: 2px; margin-top: 8px;
  padding-top: 7px; border-top: 1px solid var(--line); font-size: 12px; }
.clashitem { color: var(--ink-soft); padding-left: 10px; }

/* ---------- appointments ---------- */
.apptcard { border-left: 3px solid var(--line); }
.apptcard.today { border-left-color: var(--attention); }
.apptcard.tomorrow { border-left-color: var(--brand); }
.apptcard.past { opacity: .62; }
.apptrow { display: flex; align-items: center; gap: 8px; }
.apptbadge { font-size: 10px; font-weight: 800; letter-spacing: .04em; padding: 2px 7px;
  border-radius: 999px; background: var(--grid); color: var(--ink-soft); white-space: nowrap; }
.apptbadge.today { background: var(--attention-bg); color: var(--attention); }
.apptbadge.tomorrow { background: var(--brand-tint); color: var(--brand); }
.apptwhen { font-size: 12px; color: var(--ink-soft); font-variant-numeric: tabular-nums; }
.apptname { margin: 6px 0 0; font-size: 14.5px; font-weight: 650; color: var(--ink); line-height: 1.35; }
.apptfoot { display: flex; align-items: center; gap: 8px; margin-top: 8px; }

.sect { margin: 2px 0 -2px; font-size: 11px; font-weight: 800; letter-spacing: .07em;
  text-transform: uppercase; color: var(--ink-faint); }
.bullets.num { list-style: decimal; padding-left: 18px; }
.hashtag.sm { font-size: 13px; }
.taggrid { display: flex; flex-direction: column; gap: 5px; margin-top: 7px; }
.tagchip { display: flex; align-items: center; gap: 8px; padding: 5px 9px;
  border: 1px solid var(--line); border-radius: 8px; background: var(--bg); }
.tagtheme { font-size: 12px; color: var(--ink-soft); flex: 1; }
.badge.warn { font-size: 10px; font-weight: 700; letter-spacing: .02em; padding: 2px 6px;
  border-radius: 999px; background: var(--attention-bg); color: var(--attention); white-space: nowrap; }
.tplbody { margin: 7px 0 0; padding: 8px 10px; border-radius: 8px; background: var(--bg);
  border: 1px solid var(--line); font: 400 12.5px/1.5 inherit; white-space: pre-wrap;
  color: var(--ink); overflow-wrap: anywhere; }
table.mini { width: 100%; border-collapse: collapse; margin-top: 5px; }
table.mini td { font-size: 12px; color: var(--ink-soft); padding: 3px 0;
  border-top: 1px solid var(--line); white-space: nowrap; }
table.mini td:first-child { color: var(--ink); font-weight: 600; }
.hashtag { font-size: 17px; font-weight: 800; color: var(--brand); letter-spacing: -0.3px; }

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

/* ---------- small screens ----------------------------------------------
   THE NO-SCROLL RULE IS A TABLET RULE, AND IT STOPS HERE.

   The brief asks that every screen fit a 10-inch tablet in portrait without
   scrolling, and on a tablet it does. A phone in Safari gives about 390x664
   once the browser's own chrome is taken out — roughly 180px less than the
   390x844 these screens were first checked against. Holding the no-scroll
   rule at that height does not make the content fit; it makes it overlap,
   which is strictly worse than a scrollbar: a patient cannot scroll to
   recover a button that is sitting underneath the tab bar.

   So on a phone the header, the tab bar and the status line stay fixed, and
   the content pane between them scrolls. The chart rows take their natural
   height here rather than sharing a fixed one, and the pagers stand down
   because there is nothing left to page around.
   ---------------------------------------------------------------------- */
@media (max-width: 560px) {
  .pane { overflow: hidden; }
  .pane-body {
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
  }
  /* A flex column whose children may shrink will squash them below their own
     content when the container is scrollable, and a card with no overflow of
     its own then paints over the card beneath it. In a scrolling column the
     children keep their height and the container scrolls instead. */
  .pane-body > * { flex-shrink: 0; }
  .listcard { flex: 0 0 auto; }
  /* A chart sized to a share of the viewport would be squashed inside a
     scrolling container, so on a phone it takes its own height. */
  .chartgrid { flex: 0 0 auto; }
  .chartgrid .chart { max-height: none; }
  .scroller { flex: 0 0 auto; }
  .card, .card.tight { padding: 9px 10px; }
  .empty { padding: 10px; gap: 6px; }
  .cite { font-size: 10px; line-height: 1.32; margin-top: 5px; }
  .chart-t { font-size: 11.5px; margin-bottom: 3px; }
  .finding-head { padding: 7px 9px; }
  .finding-body { padding: 0 9px 9px; font-size: 12px; }
  .steps { padding-left: 15px; }
  .fld input, .fld select { padding: 6px 9px; }
  .frm { gap: 7px; }
  .stat { padding: 7px 9px; }
  .stat-v { font-size: 22px; }
  .glyphlist li { margin-bottom: 5px; }
  .chartgrid { gap: 7px; }
  .chart-empty { margin: 3px 0; font-size: 11.5px; }
  .cite { margin-top: 4px; }
  .kpirow { gap: 7px; }
}
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
