export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:#f0faf5; --white:#fff; --s2:#f4fbf7; --s3:#eaf6ef;
  --border:#d1ede0; --border2:#a7d9bc;
  --green:#16a34a; --gl:#dcfce7; --gm:#86efac; --gd:#15803d;
  --blue:#2563eb; --bl:#eff6ff; --bm:#bfdbfe;
  --amber:#d97706; --al:#fef3c7; --am:#fde68a;
  --red:#dc2626; --rl:#fef2f2; --rm:#fecaca;
  --purple:#7c3aed; --pl:#ede9fe; --pm:#c4b5fd;
  --text:#0f2419; --text2:#2d5a3d; --muted:#6b8f78;
  --font:'Plus Jakarta Sans',sans-serif;
  --mono:'DM Mono',monospace;
  --sh:0 1px 4px rgba(22,163,74,.07);
  --sh2:0 4px 20px rgba(22,163,74,.11);
}

body{background:var(--bg);color:var(--text);font-family:var(--font)}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--gm);border-radius:3px}

/* ══ NAVBAR ══ */
/* ═════════════════ AGENT NAVBAR ═════════════════ */

.ag-nav{
  position:fixed;
  top:0;
  left:0;
  right:0;
  z-index:300;

  height:72px;

  display:grid;
  grid-template-columns:auto 1fr auto;

  align-items:center;

  padding:0 26px;

  background:rgba(255,255,255,.96);
  backdrop-filter:blur(18px);

  border-bottom:1px solid #ececec;
}

/* LEFT */
.ag-nav-left{
  display:flex;
  align-items:center;
  gap:14px;
}

.ag-nav-mark{
  width:40px;
  height:40px;

  border-radius:12px;

  background:#111111;

  display:flex;
  align-items:center;
  justify-content:center;

  font-size:18px;

  cursor:pointer;

  color:#ffffff;
}

.ag-nav-brand-wrap{
  cursor:pointer;
}

.ag-nav-brand{
  font-size:18px;
  font-weight:800;
  color:#111111;
  letter-spacing:-0.02em;
}

.ag-nav-sub{
  font-size:10px;
  font-weight:700;
  letter-spacing:.08em;
  color:#9ca3af;
  margin-top:2px;
}

/* CENTER */
.ag-nav-center{
  display:flex;
  align-items:center;
  justify-content:center;

  gap:6px;
}

/* TAB */
.ag-nav-tab{
  height:36px;

  padding:0 16px;

  border:none;
  border-radius:999px;

  background:transparent;

  display:flex;
  align-items:center;
  gap:7px;

  font-size:14px;
  font-weight:600;
  font-family:var(--font);

  color:#8b8b8b;

  cursor:pointer;

  transition:all .18s;
}

/* HOVER */
.ag-nav-tab:hover{
  background:#f5f5f5;
  color:#111111;
}

/* ACTIVE */
.ag-nav-tab.active{
  background:#d9f500;
  color:#111111;
  font-weight:700;
}

/* ICON */
.ag-nav-tab-icon{
  display:flex;
  align-items:center;
  justify-content:center;
}

/* BADGE */
.tab-badge{
  min-width:18px;
  height:18px;

  padding:0 5px;

  border-radius:999px;

  background:#dc2626;
  color:#ffffff;

  font-size:10px;
  font-weight:700;

  display:flex;
  align-items:center;
  justify-content:center;
}

/* RIGHT */
.ag-nav-right{
  display:flex;
  align-items:center;
  gap:10px;
}

/* SEARCH */
/* SEARCH */
.ag-search-wrap{
  position:relative;
  display:flex;
  align-items:center;
}

.ag-search-icon{
  position:absolute;
  left:14px;
  top:50%;
  transform:translateY(-50%);

  width:14px;
  height:14px;

  display:flex;
  align-items:center;
  justify-content:center;

  color:#9ca3af;

  pointer-events:none;
}
.ag-nav-search{
  width:220px;
  height:40px;

  padding:0 14px 0 42px;

  border-radius:14px;

  border:1.5px solid #d1d5db;
  background:#ffffff;

  font-size:13px;
  font-family:var(--font);

  color:#111827;

  outline:none;

  transition:all .18s;
}

.ag-nav-search::placeholder{
  color:#9ca3af;
}

.ag-nav-search:focus{
  border-color:#22c55e;
  box-shadow:0 0 0 4px rgba(34,197,94,.08);
}




/* NOTIFICATION */
.ag-notif-btn{
  width:36px;
  height:36px;

  border-radius:50%;

  border:1px solid #e5e5e5;
  background:#ffffff;

  display:flex;
  align-items:center;
  justify-content:center;

  cursor:pointer;

  position:relative;

  transition:all .18s;
}

.ag-notif-btn:hover{
  background:#f5f5f5;
}

.ag-notif-dot{
  width:8px;
  height:8px;

  border-radius:50%;

  background:#ef4444;

  position:absolute;
  top:5px;
  right:5px;
}

/* PROFILE */
.ag-profile-btn{
  height:36px;

  padding:0 12px 0 5px;

  border-radius:999px;

  border:1px solid #e5e5e5;
  background:#ffffff;

  display:flex;
  align-items:center;
  gap:8px;

  cursor:pointer;

  transition:all .18s;
}

.ag-profile-btn:hover{
  background:#f5f5f5;
}

.ag-profile-av{
  width:26px;
  height:26px;

  border-radius:50%;

  background:#16a34a;

  display:flex;
  align-items:center;
  justify-content:center;

  color:#ffffff;

  font-size:12px;
  font-weight:700;
}

.ag-profile-name{
  font-size:13px;
  font-weight:700;
  color:#111111;
}

.ag-profile-caret{
  font-size:10px;
  color:#9ca3af;
  transition:transform .18s;
}

.ag-profile-caret.open{
  transform:rotate(180deg);
}

/* DROPDOWN */
.ag-profile-drop,
.ag-notif-drop{
  position:absolute;
  top:110%;
  right:0;

  background:#ffffff;

  border:1px solid #ececec;
  border-radius:14px;

  box-shadow:0 12px 30px rgba(0,0,0,.08);

  overflow:hidden;

  z-index:100;
}

.ag-profile-drop{
  min-width:220px;
}

.ag-notif-drop{
  width:300px;
}

.ag-profile-drop-item{
  width:100%;

  padding:11px 14px;

  border:none;
  background:transparent;

  text-align:left;

  cursor:pointer;

  font-size:13px;
  font-family:var(--font);

  transition:all .15s;
}

.ag-profile-drop-item:hover{
  background:#f5f5f5;
}

.ag-profile-drop-divider{
  height:1px;
  background:#ececec;
}

.ag-profile-drop-item.logout{
  color:#dc2626;
}

/* CTA */
.ag-logout-btn{
  height:38px;

  padding:0 16px;

  border:none;
  border-radius:10px;

  background:#111111;
  color:#ffffff;

  font-size:14px;
  font-weight:700;
  font-family:var(--font);

  cursor:pointer;

  transition:all .18s;
}

.ag-logout-btn:hover{
  opacity:.92;
}

/* ══ PAGE WRAPPER ══ */
.ag-page{min-height:calc(100vh - 62px);background:var(--bg);padding:26px}
.ag-ph{margin-bottom:22px}
.ag-ph-title{font-size:24px;font-weight:800;color:var(--text);margin-bottom:3px}
.ag-ph-sub{font-size:13.5px;color:var(--muted)}

/* ══ STAT CARDS ══ */
.ag-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:14px;margin-bottom:22px}
.ag-stat{
  background:var(--white);border:1.5px solid var(--border);
  border-radius:14px;padding:18px 20px;
  transition:transform .15s,box-shadow .15s;cursor:default;
  box-shadow:var(--sh);
}
.ag-stat:hover{transform:translateY(-2px);box-shadow:var(--sh2)}
.ag-stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.ag-stat-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px}
.ag-stat-num{font-size:30px;font-weight:800;line-height:1;margin-bottom:3px}
.ag-stat-label{font-size:12px;color:var(--muted);font-weight:500}

/* ══ WORKLOAD ══ */
.ag-workload{
  background:var(--white);border:1.5px solid var(--border);
  border-radius:14px;padding:20px;margin-bottom:22px;box-shadow:var(--sh);
}
.ag-wl-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.ag-wl-title{font-size:14px;font-weight:700;color:var(--text)}
.ag-wl-pct{font-size:20px;font-weight:800;color:var(--green)}
.ag-wl-bars{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:14px}
.ag-wbar{display:flex;flex-direction:column;gap:5px}
.ag-wbar-row{display:flex;justify-content:space-between;font-size:12px;color:var(--muted)}
.ag-wbar-row span:last-child{font-weight:700;color:var(--text)}
.ag-wbar-track{height:8px;background:var(--s3);border-radius:4px;overflow:hidden}
.ag-wbar-fill{height:100%;border-radius:4px;transition:width .6s ease}

/* ══ TODAY ══ */
.ag-today{display:grid;grid-template-columns:repeat(auto-fit,minmax(175px,1fr));gap:12px;margin-bottom:22px}
.ag-today-card{
  background:var(--white);border:1.5px solid var(--border);
  border-radius:12px;padding:14px 16px;
  display:flex;align-items:center;gap:12px;box-shadow:var(--sh);
}
.ag-today-icon{font-size:22px;flex-shrink:0}
.ag-today-num{font-size:22px;font-weight:800}
.ag-today-label{font-size:12px;color:var(--muted)}

/* ══ QUICK ACTIONS ══ */
.ag-quick{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:6px}
.ag-qcard{
  background:var(--white);border:1.5px solid var(--border);
  border-radius:14px;padding:16px 18px;
  display:flex;align-items:center;gap:14px;
  cursor:pointer;transition:all .15s;box-shadow:var(--sh);
}
.ag-qcard:hover{transform:translateY(-2px);box-shadow:var(--sh2);border-color:var(--border2)}
.ag-qcard-icon{width:42px;height:42px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.ag-qcard-title{font-size:14px;font-weight:700;color:var(--text)}
.ag-qcard-sub{font-size:12px;color:var(--muted)}

/* ══ TOOLBAR ══ */
.ag-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap}
.ag-search{
  flex:1;min-width:200px;
  display:flex;align-items:center;gap:9px;
  background:var(--white);border:1.5px solid var(--border);
  border-radius:10px;padding:9px 14px;
  transition:border-color .18s;box-shadow:var(--sh);
}
.ag-search:focus-within{border-color:var(--green)}
.ag-search input{flex:1;background:none;border:none;outline:none;font-size:13.5px;color:var(--text);font-family:var(--font)}
.ag-search input::placeholder{color:var(--muted)}
.ag-filter-btn{
  padding:9px 16px;border-radius:10px;
  background:var(--white);border:1.5px solid var(--border);
  color:var(--muted);font-size:13px;font-weight:600;
  font-family:var(--font);cursor:pointer;transition:all .15s;box-shadow:var(--sh);
}
.ag-filter-btn:hover,.ag-filter-btn.active{background:var(--gl);border-color:var(--border2);color:var(--gd)}
.ag-sort-sel{
  padding:9px 14px;border-radius:10px;
  background:var(--white);border:1.5px solid var(--border);
  color:var(--muted);font-size:13px;font-weight:600;
  font-family:var(--font);cursor:pointer;outline:none;box-shadow:var(--sh);
}
.ag-count{font-size:12px;color:var(--muted);margin-left:auto;white-space:nowrap}

/* ══ COMPLAINT GRID ══ */
.ag-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:18px}
.ag-card{
  background:var(--white);border:1.5px solid var(--border);
  border-radius:16px;overflow:hidden;
  transition:transform .15s,box-shadow .15s;
  display:flex;flex-direction:column;box-shadow:var(--sh);
}
.ag-card:hover{transform:translateY(-2px);box-shadow:var(--sh2);border-color:var(--border2)}
.ag-card.chat-open{border-color:var(--green);box-shadow:0 0 0 3px rgba(22,163,74,.1)}
.ag-card-strip{height:4px}
.ag-cs-pending{background:linear-gradient(90deg,#f59e0b,#d97706)}
.ag-cs-progress{background:linear-gradient(90deg,#3b82f6,#2563eb)}
.ag-cs-resolved{background:linear-gradient(90deg,var(--green),var(--gd))}
.ag-cs-rejected{background:linear-gradient(90deg,#ef4444,#dc2626)}
.ag-cs-escalated{background:linear-gradient(90deg,#7c3aed,#6d28d9)}

.ag-card-body{padding:18px;flex:1}
.ag-card-head{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px;gap:8px}
.ag-card-name{font-size:15px;font-weight:700;color:var(--text);margin-bottom:4px}
.ag-card-id{
  font-family:var(--mono);font-size:10.5px;color:var(--muted);
  background:var(--s2);border-radius:6px;padding:3px 8px;
  flex-shrink:0;border:1px solid var(--border);
}
.ag-pill{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700}

/* ══ SENTIMENT BADGE ══ */
.ag-sentiment{
  display:inline-flex;align-items:center;gap:4px;
  padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;
  margin-left:6px;
}
.ag-sent-angry{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}
.ag-sent-neutral{background:#f0f9ff;color:#0369a1;border:1px solid #bae6fd}
.ag-sent-positive{background:#f0fdf4;color:#16a34a;border:1px solid #86efac}

/* ══ PRIORITY BADGE ══ */
.ag-priority{
  display:inline-flex;align-items:center;gap:4px;
  padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;
}
.ag-prio-urgent{background:#fef2f2;color:#dc2626;border:1px solid #fecaca}
.ag-prio-high{background:#fef3c7;color:#d97706;border:1px solid #fde68a}
.ag-prio-medium{background:#eff6ff;color:#2563eb;border:1px solid #bfdbfe}
.ag-prio-low{background:#f0fdf4;color:#16a34a;border:1px solid #86efac}

/* ══ SLA BADGE ══ */
.ag-sla{
  display:inline-flex;align-items:center;gap:4px;
  padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;
}
.ag-sla-ok{background:#f0fdf4;color:#16a34a;border:1px solid #86efac}
.ag-sla-warn{background:#fef3c7;color:#d97706;border:1px solid #fde68a}
.ag-sla-over{background:#fef2f2;color:#dc2626;border:1px solid #fecaca;animation:pulse 1.4s ease infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.65}}

.ag-card-meta{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px;align-items:center}

.ag-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
.ag-detail{background:var(--s2);border-radius:8px;padding:8px 10px;border:1px solid var(--border)}
.ag-dl{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:2px}
.ag-dv{font-size:13px;font-weight:600;color:var(--text)}

.ag-comment{background:var(--s2);border-radius:10px;padding:11px 13px;border:1px solid var(--border);margin-bottom:12px}
.ag-comment-l{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px}
.ag-comment-t{font-size:13px;color:var(--text2);line-height:1.55}

/* ══ ATTACHMENTS ══ */
.ag-attachments{margin-bottom:12px}
.ag-attach-l{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:6px}
.ag-attach-row{display:flex;flex-wrap:wrap;gap:6px}
.ag-attach-item{
  display:flex;align-items:center;gap:6px;
  padding:5px 10px;border-radius:8px;
  background:var(--s2);border:1px solid var(--border);
  font-size:12px;font-weight:600;color:var(--text2);
  cursor:pointer;text-decoration:none;transition:all .12s;
}
.ag-attach-item:hover{background:var(--gl);border-color:var(--border2);color:var(--gd)}
.ag-attach-thumb{width:40px;height:40px;border-radius:6px;object-fit:cover;border:1px solid var(--border)}

/* ══ TIMELINE ══ */
.ag-timeline{margin-bottom:12px}
.ag-timeline-toggle{
  font-size:12px;font-weight:600;color:var(--blue);
  background:none;border:none;cursor:pointer;padding:0;
  font-family:var(--font);margin-bottom:8px;
  display:flex;align-items:center;gap:5px;
}
.ag-timeline-list{display:flex;flex-direction:column;gap:0}
.ag-tl-item{
  display:flex;gap:10px;padding:8px 0;
  border-left:2px solid var(--border);padding-left:14px;
  margin-left:6px;position:relative;
}
.ag-tl-item:last-child{border-left-color:transparent}
.ag-tl-dot{
  position:absolute;left:-5px;top:12px;
  width:8px;height:8px;border-radius:50%;
  background:var(--green);border:2px solid var(--white);
  flex-shrink:0;
}
.ag-tl-content{flex:1}
.ag-tl-action{font-size:12.5px;font-weight:600;color:var(--text)}
.ag-tl-meta{font-size:11px;color:var(--muted)}
.ag-tl-note{font-size:12px;color:var(--text2);margin-top:2px;font-style:italic}

/* ══ CANNED RESPONSES ══ */
.ag-canned-btn{
  font-size:11px;font-weight:600;color:var(--purple);
  background:var(--pl);border:1px solid var(--pm);
  border-radius:7px;padding:4px 10px;cursor:pointer;
  font-family:var(--font);transition:all .12s;
  display:inline-flex;align-items:center;gap:4px;
}
.ag-canned-btn:hover{background:var(--pm)}
.ag-canned-drop{
  background:var(--white);border:1.5px solid var(--border);
  border-radius:12px;padding:8px;margin-bottom:8px;
  box-shadow:var(--sh2);
  animation:dropIn .18s ease both;
}
.ag-canned-item{
  padding:8px 10px;border-radius:8px;font-size:12.5px;
  color:var(--text2);cursor:pointer;transition:background .1s;
  line-height:1.4;
}
.ag-canned-item:hover{background:var(--s2)}
.ag-canned-title{font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;padding:4px 10px;margin-top:4px}

.ag-note-wrap{margin-bottom:12px}
.ag-note-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:5px}
.ag-note-label{font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
.ag-note-ta{
  width:100%;background:#f0fdf4;border:1.5px solid var(--border);
  border-radius:10px;padding:10px 12px;font-size:13px;
  color:var(--text);font-family:var(--font);resize:none;outline:none;
  transition:border-color .18s;line-height:1.5;min-height:68px;
}
.ag-note-ta:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(22,163,74,.08)}
.ag-note-ta::placeholder{color:var(--muted)}

/* AI suggest button */
.ag-ai-btn{
  font-size:11px;font-weight:700;color:#d97706;
  background:#fef3c7;border:1px solid #fde68a;
  border-radius:7px;padding:4px 10px;cursor:pointer;
  font-family:var(--font);transition:all .12s;
  display:inline-flex;align-items:center;gap:4px;
}
.ag-ai-btn:hover{background:#fde68a}
.ag-ai-btn:disabled{opacity:.5;cursor:not-allowed}

.ag-actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.ag-sel{
  flex:1;padding:8px 12px;border-radius:9px;
  background:var(--s2);border:1.5px solid var(--border);
  font-size:13px;color:var(--text);font-family:var(--font);
  cursor:pointer;outline:none;transition:border-color .18s;
}
.ag-sel:focus{border-color:var(--green)}
.ag-sel option{background:#fff}
.ag-btn{
  padding:8px 14px;border-radius:9px;border:none;
  font-size:13px;font-weight:700;font-family:var(--font);
  cursor:pointer;display:inline-flex;align-items:center;gap:5px;transition:all .15s;
}
.ag-btn.upd{background:var(--gl);border:1.5px solid var(--border2);color:var(--gd);flex:1}
.ag-btn.upd:hover{background:var(--gm)}
.ag-btn.upd:disabled{opacity:.4;cursor:not-allowed}
.ag-btn.chat-btn{background:var(--bl);border:1.5px solid var(--bm);color:var(--blue)}
.ag-btn.chat-btn:hover{background:#dbeafe}
.ag-btn.chat-btn.open{background:#dbeafe;border-color:#93c5fd}
.ag-btn.escalate-btn{background:var(--pl);border:1.5px solid var(--pm);color:var(--purple)}
.ag-btn.escalate-btn:hover{background:var(--pm)}
.ag-btn.detail-btn{background:var(--s2);border:1.5px solid var(--border);color:var(--muted)}
.ag-btn.detail-btn:hover{background:var(--s3);color:var(--text)}

.ag-chat-panel{
  border-top:1.5px solid var(--border);height:400px;
  display:flex;flex-direction:column;
  animation:chatSlide .22s ease both;
}
@keyframes chatSlide{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

/* ══ CSAT STARS ══ */
.ag-csat{display:flex;align-items:center;gap:4px;margin-top:6px}
.ag-csat-label{font-size:11px;color:var(--muted)}
.ag-csat-stars{display:flex;gap:2px}
.ag-csat-star{font-size:13px}

/* ══ EMPTY ══ */
.ag-empty{
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;padding:80px 0;
  color:var(--muted);gap:10px;grid-column:1/-1;
}
.ag-empty-icon{font-size:52px;opacity:.3}
.ag-empty-title{font-size:18px;font-weight:700;color:var(--text)}
.ag-empty-sub{font-size:13.5px;color:var(--muted);text-align:center;max-width:280px;line-height:1.5}

/* ══ SKELETON ══ */
.ag-skel{
  background:linear-gradient(90deg,#f0fdf4 25%,#dcfce7 50%,#f0fdf4 75%);
  background-size:200% 100%;animation:agShim 1.4s ease infinite;
  border-radius:16px;height:300px;border:1.5px solid var(--border);
}
@keyframes agShim{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* ══ DETAIL MODAL ══ */
.ag-modal-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.35);
  z-index:500;display:flex;align-items:center;justify-content:center;
  padding:20px;animation:fadeIn .2s ease both;
}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
.ag-modal{
  background:var(--white);border-radius:20px;
  width:100%;max-width:680px;max-height:90vh;
  overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,.2);
  animation:modalUp .25s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes modalUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
.ag-modal-head{
  padding:20px 24px;border-bottom:1.5px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
  position:sticky;top:0;background:var(--white);z-index:10;
}
.ag-modal-title{font-size:17px;font-weight:800;color:var(--text)}
.ag-modal-close{
  width:32px;height:32px;border-radius:8px;
  background:var(--s2);border:1px solid var(--border);
  cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;
}
.ag-modal-close:hover{background:var(--rl);color:var(--red)}
.ag-modal-body{padding:24px}
.ag-modal-sec{margin-bottom:20px}
.ag-modal-sec-title{font-size:12px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:10px}

/* ══ PROFILE ══ */
.ag-prof-hero{
  background:linear-gradient(135deg,var(--green),var(--gd));
  border-radius:18px;padding:28px;margin-bottom:20px;
  display:flex;align-items:center;gap:20px;
  box-shadow:0 4px 20px rgba(22,163,74,.25);
}
.ag-prof-av{
  width:70px;height:70px;border-radius:50%;
  background:rgba(255,255,255,.2);border:3px solid rgba(255,255,255,.5);
  display:flex;align-items:center;justify-content:center;
  font-size:28px;font-weight:800;color:#fff;flex-shrink:0;
}
.ag-prof-name{font-size:22px;font-weight:800;color:#fff;margin-bottom:3px}
.ag-prof-email{font-size:13px;color:rgba(255,255,255,.75)}
.ag-prof-badge{
  margin-left:auto;padding:6px 16px;border-radius:20px;
  background:rgba(255,255,255,.2);border:1.5px solid rgba(255,255,255,.4);
  font-size:12px;font-weight:700;color:#fff;white-space:nowrap;
}

.ag-info-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:20px}
.ag-info-item{background:var(--white);border:1.5px solid var(--border);border-radius:12px;padding:14px 16px;box-shadow:var(--sh)}
.ag-info-l{font-size:10.5px;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:4px}
.ag-info-v{font-size:14px;font-weight:700;color:var(--text)}

.ag-pwd-card{background:var(--white);border:1.5px solid var(--border);border-radius:16px;padding:24px;margin-bottom:20px;box-shadow:var(--sh)}
.ag-pwd-title{font-size:15px;font-weight:700;color:var(--text);margin-bottom:16px;display:flex;align-items:center;gap:8px}
.ag-pwd-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.ag-pwd-field{display:flex;flex-direction:column;gap:5px}
.ag-pwd-field.full{grid-column:1/-1}
.ag-pwd-label{font-size:11.5px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
.ag-pwd-input{
  background:var(--s2);border:1.5px solid var(--border);
  border-radius:10px;padding:10px 14px;font-size:13.5px;
  color:var(--text);font-family:var(--font);outline:none;transition:border-color .18s;
}
.ag-pwd-input:focus{border-color:var(--green);box-shadow:0 0 0 3px rgba(22,163,74,.08)}
.ag-pwd-input::placeholder{color:var(--muted)}
.ag-pwd-submit{
  padding:11px 26px;border-radius:10px;border:none;
  background:linear-gradient(135deg,var(--green),var(--gd));
  color:#fff;font-size:13.5px;font-weight:700;font-family:var(--font);
  cursor:pointer;box-shadow:0 4px 14px rgba(22,163,74,.3);transition:all .15s;
}
.ag-pwd-submit:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(22,163,74,.4)}
.ag-pwd-submit:disabled{opacity:.5;cursor:not-allowed;transform:none}

.ag-perf-card{background:var(--white);border:1.5px solid var(--border);border-radius:16px;padding:22px;box-shadow:var(--sh);margin-bottom:20px}
.ag-perf-title{font-size:15px;font-weight:700;color:var(--text);margin-bottom:16px;display:flex;align-items:center;gap:8px}
.ag-perf-bars{display:flex;flex-direction:column;gap:11px}
.ag-perf-row{display:flex;align-items:center;gap:14px}
.ag-perf-week{font-size:12px;color:var(--muted);width:72px;flex-shrink:0}
.ag-perf-track{flex:1;height:10px;background:var(--s3);border-radius:5px;overflow:hidden}
.ag-perf-fill{height:100%;border-radius:5px;background:linear-gradient(90deg,var(--green),var(--gd));transition:width .7s ease}
.ag-perf-num{font-size:13px;font-weight:700;color:var(--gd);width:28px;text-align:right}
.ag-perf-foot{margin-top:16px;padding-top:14px;border-top:1px solid var(--border);font-size:12.5px;color:var(--muted)}

/* CSAT on profile */
.ag-csat-card{background:var(--white);border:1.5px solid var(--border);border-radius:16px;padding:22px;box-shadow:var(--sh);margin-bottom:20px}
.ag-csat-big{font-size:42px;font-weight:800;color:var(--green)}
.ag-csat-sub{font-size:13px;color:var(--muted)}
.ag-csat-stars-lg{font-size:22px;margin:6px 0}

/* ══ TOAST ══ */
.ag-toast-wrap{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px}
.ag-toast{
  padding:11px 18px;border-radius:12px;font-size:13px;font-weight:600;
  font-family:var(--font);box-shadow:var(--sh2);
  display:flex;align-items:center;gap:9px;min-width:240px;
  animation:toastIn .3s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
.ag-toast.s{background:#f0fdf4;border:1.5px solid #86efac;color:#15803d}
.ag-toast.e{background:#fef2f2;border:1.5px solid #fecaca;color:#dc2626}
.ag-toast.i{background:#eff6ff;border:1.5px solid #bfdbfe;color:#1d4ed8}

.ag-sec-title{font-size:14px;font-weight:700;color:var(--text);margin-bottom:12px;display:flex;align-items:center;gap:7px}

@media(max-width:900px){
  .ag-nav{grid-template-columns:1fr auto;gap:8px;padding:0 14px}
  .ag-nav-center{display:none}
  .ag-page{padding:14px}
  .ag-grid{grid-template-columns:1fr}
  .ag-info-grid{grid-template-columns:1fr 1fr}
  .ag-pwd-grid{grid-template-columns:1fr}
  .ag-prof-hero{flex-direction:column;text-align:center}
  .ag-prof-badge{margin-left:0}
  .ag-modal{max-height:100vh;border-radius:16px}
}
`;