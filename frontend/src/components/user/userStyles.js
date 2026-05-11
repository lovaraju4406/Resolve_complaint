export const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Syne:wght@400;500;600;700;800&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}

:root{
  --bg:#eeebe4;
  --white:#ffffff;
  --surface:#f5f2ec;
  --surface2:#f9f7f3;
  --border:#dedad2;
  --border2:#ccc8be;
  --text:#1a1a18;
  --text2:#4a4744;
  --muted:#9a9790;
  --accent:#d4f000;
  --accent-dark:#b8d400;
  --pill-dark:#1a1a18;
  --green:#10b981;
  --red:#dc2626;
  --blue:#2563eb;
  --amber:#d97706;
  --font:'DM Sans',sans-serif;
  --display:'Syne',sans-serif;
  --nav-h:62px;
  --r:14px;
  --r-lg:20px;
  --shadow:0 1px 3px rgba(0,0,0,.07),0 1px 2px rgba(0,0,0,.04);
  --shadow-md:0 4px 16px rgba(0,0,0,.08);
  --shadow-lg:0 12px 40px rgba(0,0,0,.12);
}

body,#root{
  background-color:var(--bg);
  color:var(--text);
  font-family:var(--font);
  min-height:100vh;
  /* Subtle dot-grid pattern — clean, professional, always visible */
  background-image:
    radial-gradient(circle, rgba(26,26,24,.09) 1px, transparent 1px);
  background-size:24px 24px;
}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:4px}

/* ── KEYFRAMES ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes popIn{0%{transform:scale(.88);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* ════ NAVBAR ════ */
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--nav-h);
  z-index: 300;

  display: flex;
  align-items: center;
  gap: 14px;
  padding: 0 28px;

  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

/* BRAND */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--display);
  font-size: 17px;
  font-weight: 800;
  color: var(--text);
  cursor: pointer;
}

.nav-brand-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--dark);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* DIVIDER */
.nav-divider {
  width: 1px;
  height: 26px;
  background: var(--border);
}

/* CENTER LINKS */
.nav-links {
  flex: 1;
  display: flex;
  justify-content: center;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;

  padding: 7px 15px;
  border-radius: 100px;
  border: none;
  background: transparent;

  font-size: 13.5px;
  font-weight: 500;
  color: var(--muted);

  cursor: pointer;
  transition: all 0.18s;
}

.nav-link:hover {
  background: var(--surface);
  color: var(--text);
}

.nav-link.active {
  background: var(--accent);
  color: var(--text);
  font-weight: 600;
}

/* RIGHT SECTION */
.nav-right{
  display:flex;
  align-items:center;
  gap:12px;
  margin-left:auto;
  flex-shrink:0;
}

/* SEARCH */
.nav-search input{
  width:180px;
  height:38px;

  padding:0 14px;

  border-radius:999px;
  border:1.5px solid var(--border);

  background:var(--surface);

  font-size:13px;
  font-family:var(--font);

  transition:all .2s;
}

.nav-search input:focus{
  outline:none;
  border-color:var(--accent-dark);
  width:220px;
}

/* ICON BUTTON (NOTIF) */
.nav-icon-btn{
  width:38px;
  height:38px;

  border-radius:50%;

  display:flex;
  align-items:center;
  justify-content:center;

  background:var(--surface);
  border:1px solid var(--border);

  cursor:pointer;
  position:relative;

  flex-shrink:0;

  transition:all .15s;
}
.file-btn{
  height:38px;

  padding:0 16px;

  border-radius:10px;

  border:1.5px solid #1a1a18;
  background:#ffffff;

  display:flex;
  align-items:center;
  gap:7px;

  font-size:14px;
  font-weight:600;
  font-family:var(--font);

  cursor:pointer;

  transition:all .18s;
}

.file-btn:hover{
  background:#1a1a18;
  color:#ffffff;
}
.nav-icon-btn:hover {
  background: var(--accent);
  border-color: var(--accent-dark);
}

/* NOTIFICATION DOT */
.pip {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #e84545;
  position: absolute;
  top: 4px;
  right: 4px;
}

/* BADGE */
.notif-pip {
  background: #e84545;
  color: #fff;
  font-size: 9px;
  padding: 1px 5px;
  border-radius: 50px;
}

/* PROFILE */
.profile-btn{
  height:38px;

  display:flex;
  align-items:center;
  gap:8px;

  padding:0 14px 0 4px;

  border-radius:999px;

  border:1.5px solid var(--border);
  background:var(--surface);

  cursor:pointer;

  transition:all .15s;
}

.profile-btn:hover {
  border-color: var(--accent-dark);
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--accent);

  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
}

/* DROPDOWN */
.dropdown {
  position: absolute;
  top: 110%;
  right: 0;

  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;

  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  overflow: hidden;
  min-width: 200px;
  z-index: 100;
}

.dropdown button {
  width: 100%;
  padding: 10px 14px;
  border: none;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.dropdown button:hover {
  background: var(--surface);
}

.divider {
  height: 1px;
  background: var(--border);
}

.logout {
  color: #e84545;
}
/* ── DROPDOWN ── */
.dropdown{
  position:absolute;top:calc(100% + 8px);right:0;
  background:var(--white);border:1px solid var(--border);
  border-radius:16px;box-shadow:var(--shadow-lg);
  z-index:400;overflow:hidden;min-width:300px;
  animation:slideDown .2s ease both;
}
.dropdown-hdr{
  padding:.85rem 1.1rem;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
}
.dropdown-hdr span{font-size:.84rem;font-weight:700;color:var(--text)}
.dropdown-link{
  font-size:.73rem;color:var(--accent-dark);font-weight:600;
  background:none;border:none;cursor:pointer;font-family:var(--font);
}
.dropdown-link:hover{text-decoration:underline}
.notif-item{
  display:flex;gap:.75rem;padding:.82rem 1.1rem;
  border-bottom:1px solid var(--border);cursor:pointer;transition:background .15s;
}
.notif-item:last-child{border-bottom:none}
.notif-item:hover{background:var(--surface)}
.notif-item.unread{background:#fffff0}
.notif-icon{width:32px;height:32px;border-radius:9px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:.9rem}
.notif-msg{font-size:.78rem;color:var(--text);line-height:1.5}
.notif-time{font-size:.68rem;color:var(--muted);margin-top:.15rem}
.unread-dot{width:6px;height:6px;border-radius:50%;background:var(--accent-dark);flex-shrink:0;margin-top:5px}

.prof-drop{min-width:210px}
.prof-drop-hdr{
  padding:.9rem 1.1rem;display:flex;align-items:center;gap:.75rem;
  border-bottom:1px solid var(--border);background:var(--surface);
}
.prof-drop-av{
  width:38px;height:38px;border-radius:50%;
  background:var(--accent);display:flex;align-items:center;justify-content:center;
  font-weight:700;font-size:.95rem;color:var(--text);flex-shrink:0;
}
.prof-drop-name{font-size:.85rem;font-weight:700;color:var(--text)}
.prof-drop-role{font-size:.7rem;color:var(--muted)}
.prof-menu-item{
  display:flex;align-items:center;gap:.65rem;
  padding:.68rem 1.1rem;border:none;background:none;
  font-family:var(--font);font-size:.83rem;color:var(--text2);
  width:100%;text-align:left;cursor:pointer;transition:background .15s;
}
.prof-menu-item:hover{background:var(--surface);color:var(--text)}
.prof-menu-item.danger{color:#e84545}
.prof-menu-item.danger:hover{background:#fff5f5}

/* ════ SHELL ════ */
.shell{display:flex;padding-top:var(--nav-h);min-height:100vh;background:transparent}

/* ════ MAIN — centers all page content ════ */
.main{
  flex:1;
  padding:24px 20px;
  overflow-y:auto;
  width:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
}

/* Every direct child of .main gets a max-width and is auto-centered */
.main > *{
  width:100%;
  max-width:860px;
}

/* ════ PANEL CARD ════ */
.pcard{
  background:var(--white);border:1px solid var(--border);
  border-radius:var(--r-lg);overflow:hidden;box-shadow:var(--shadow);
}
.pcard-hdr{
  padding:14px 18px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;gap:10px;
}
.pcard-title{font-family:var(--display);font-size:13.5px;font-weight:700;color:var(--text)}
.pcard-body{padding:18px}

/* ════ DASHBOARD ════ */
.dash-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px;margin-bottom:18px}
.dash-stat{
  background:var(--white);border:1px solid var(--border);
  border-radius:var(--r);padding:16px 18px;box-shadow:var(--shadow);
  transition:transform .15s;cursor:default;
}
.dash-stat:hover{transform:translateY(-2px);box-shadow:var(--shadow-md)}
.dash-stat-num{font-family:var(--display);font-size:28px;font-weight:800;line-height:1;margin-bottom:4px}
.dash-stat-lbl{font-size:11.5px;color:var(--muted);font-weight:500}

.two-col{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:16px}
.chips{display:flex;flex-wrap:wrap;gap:7px}
.chip{
  padding:7px 16px;border-radius:50px;font-size:13px;font-weight:500;
  cursor:pointer;transition:all .18s;border:1.5px solid var(--border);
  background:transparent;color:var(--text2);font-family:var(--font);
}
.chip:hover{border-color:var(--text);background:var(--surface)}
.chip.active{background:var(--pill-dark);color:var(--white);border-color:var(--pill-dark)}

/* mini chart bars */
.mini-bars{display:flex;align-items:flex-end;gap:4px;height:50px}
.mini-bar{border-radius:4px 4px 0 0;background:var(--accent);opacity:.7;transition:opacity .2s}
.mini-bar:hover{opacity:1}
.mini-bar-lbl{font-size:8px;color:var(--muted);text-align:center;margin-top:3px}

/* ════ FILTER ROW ════ */
.filter-row{display:flex;align-items:center;gap:7px;margin-bottom:14px;flex-wrap:wrap}
.filter-pill{
  padding:6px 14px;border-radius:50px;border:1.5px solid var(--border);
  background:var(--white);font-size:12.5px;font-weight:500;
  color:var(--text2);cursor:pointer;transition:all .18s;font-family:var(--font);
}
.filter-pill.active{background:var(--accent);border-color:var(--accent-dark);color:var(--text);font-weight:600}
.filter-pill:hover:not(.active){border-color:var(--border2);color:var(--text)}
.sort-sel{
  padding:6px 12px;border-radius:50px;border:1.5px solid var(--border);
  background:var(--white);font-size:12.5px;font-weight:500;
  color:var(--text2);font-family:var(--font);outline:none;cursor:pointer;
}
.new-btn{
  margin-left:auto;display:flex;align-items:center;gap:5px;
  padding:7px 16px;border-radius:50px;
  background:var(--pill-dark);color:var(--white);
  border:none;font-family:var(--font);font-size:12.5px;font-weight:600;
  cursor:pointer;transition:all .18s;
}
.new-btn:hover{background:var(--text2);transform:translateY(-1px)}

/* ════ COMPLAINT ROWS ════ */
.c-list{display:flex;flex-direction:column;gap:9px}
.c-row{
  background:var(--white);border:1.5px solid var(--border);
  border-radius:var(--r);padding:14px 16px;
  display:flex;align-items:center;gap:12px;
  transition:all .2s;cursor:pointer;
}
.c-row:hover{border-color:var(--border2);box-shadow:var(--shadow-md);transform:translateY(-1px)}
.c-cat-icon{
  width:44px;height:44px;border-radius:12px;flex-shrink:0;
  background:var(--surface);border:1px solid var(--border);
  display:flex;align-items:center;justify-content:center;font-size:18px;
}
.c-info{flex:1;min-width:0}
.c-name{font-size:14px;font-weight:600;color:var(--text);margin-bottom:4px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-family:var(--display)}
.c-meta{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
.c-date{font-size:11px;color:var(--muted)}
.c-actions{display:flex;align-items:center;gap:7px;flex-shrink:0}

/* badges */
.badge{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:50px;font-size:11px;font-weight:600}
.badge-dot{width:5px;height:5px;border-radius:50%}
.badge-pending{background:#fef9e7;color:#78350f}.badge-pending .badge-dot{background:#f59e0b}
.badge-progress{background:#f0f4ff;color:#1e3a8a}.badge-progress .badge-dot{background:#3b82f6}
.badge-resolved{background:#f0fdf4;color:#064e3b}.badge-resolved .badge-dot{background:#10b981}
.badge-withdrawn{background:#f5f5f5;color:#6b7280}.badge-withdrawn .badge-dot{background:#9ca3af}
.pri-badge{display:inline-flex;align-items:center;padding:2px 7px;border-radius:5px;font-size:10.5px;font-weight:700}
.pri-high{background:#fef2f2;color:#dc2626}
.pri-med{background:#fef9e7;color:#92400e}
.pri-low{background:#f0fdf4;color:#065f46}

.view-btn{
  display:flex;align-items:center;gap:5px;
  padding:6px 13px;border-radius:50px;
  background:var(--surface);border:1.5px solid var(--border);
  font-family:var(--font);font-size:12px;font-weight:600;
  color:var(--text2);cursor:pointer;transition:all .15s;
}
.view-btn:hover{background:var(--accent);border-color:var(--accent-dark);color:var(--text)}

/* action buttons */
.ic-btn{
  width:30px;height:30px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  border:1.5px solid var(--border);background:var(--surface);
  cursor:pointer;transition:all .15s;font-size:13px;
}
.ic-btn:hover{background:var(--accent);border-color:var(--accent-dark)}
.ic-btn.danger:hover{background:#fef2f2;border-color:rgba(220,38,38,.3)}

/* ════ RAISE COMPLAINT ════ */
.raise-wrap{width:100%;max-width:860px}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.form-full{grid-column:1/-1}
.form-group{display:flex;flex-direction:column;gap:5px}
.form-label{font-size:11px;font-weight:600;color:var(--text2);text-transform:uppercase;letter-spacing:.06em}
.form-inp,.form-sel,.form-ta{
  padding:10px 13px;border-radius:10px;
  border:1.5px solid var(--border);background:var(--surface);
  font-size:13.5px;font-family:var(--font);color:var(--text);
  outline:none;width:100%;transition:all .18s;
}
.form-inp:focus,.form-sel:focus,.form-ta:focus{border-color:var(--accent-dark);background:var(--white);box-shadow:0 0 0 3px rgba(212,240,0,.18)}
.form-inp::placeholder,.form-ta::placeholder{color:var(--muted)}
.form-ta{resize:vertical;min-height:110px;line-height:1.6}
.pri-row{display:flex;gap:8px}
.pri-opt{
  flex:1;padding:9px;border-radius:10px;
  border:1.5px solid var(--border);background:var(--surface);
  text-align:center;font-size:12.5px;font-weight:600;
  cursor:pointer;transition:all .18s;font-family:var(--font);
}
.pri-opt.sel-High{border-color:#dc2626;background:#fef2f2;color:#dc2626}
.pri-opt.sel-Medium{border-color:#f59e0b;background:#fef9e7;color:#92400e}
.pri-opt.sel-Low{border-color:#10b981;background:#f0fdf4;color:#065f46}

/* upload zone */
.upload-zone{
  border:2px dashed var(--border);border-radius:12px;padding:24px;
  text-align:center;background:var(--surface);cursor:pointer;transition:all .2s;
  position:relative;
}
.upload-zone:hover,.upload-zone.drag-over{border-color:var(--accent-dark);background:#fffff0}
.upload-zone input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
.upload-text{font-size:13.5px;color:var(--text2)}
.upload-sub{font-size:11.5px;color:var(--muted);margin-top:3px}
.file-chip{
  display:inline-flex;align-items:center;gap:6px;
  padding:4px 10px;border-radius:8px;
  background:var(--surface2);border:1px solid var(--border);
  font-size:11.5px;color:var(--text2);
}
.file-chip button{background:none;border:none;cursor:pointer;color:var(--muted);font-size:14px;line-height:1;padding:0}
.file-chip button:hover{color:var(--red)}

/* AI helper bar */
.ai-bar{
  display:flex;align-items:center;gap:8px;
  padding:8px 12px;border-radius:9px;
  background:#fffff0;border:1.5px solid rgba(212,240,0,.5);
  margin-bottom:6px;
}
.ai-btn{
  padding:5px 13px;border-radius:50px;border:none;
  background:var(--pill-dark);color:var(--white);
  font-family:var(--font);font-size:12px;font-weight:600;
  cursor:pointer;transition:all .15s;white-space:nowrap;
  display:flex;align-items:center;gap:5px;
}
.ai-btn:hover{background:var(--text2)}
.ai-btn:disabled{opacity:.5;cursor:not-allowed}
.ai-spinner{width:12px;height:12px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}

/* duplicate warning */
.dup-warn{
  padding:10px 14px;border-radius:10px;
  background:#fef9e7;border:1.5px solid rgba(245,158,11,.3);
  display:flex;align-items:flex-start;gap:9px;margin-bottom:10px;
}

/* auto-category suggestion */
.cat-suggest{
  display:flex;align-items:center;gap:8px;
  padding:7px 12px;border-radius:9px;
  background:var(--surface);border:1px solid var(--border);
  margin-top:5px;font-size:12px;color:var(--text2);
}
.cat-accept{
  padding:3px 10px;border-radius:50px;border:none;
  background:var(--pill-dark);color:var(--white);
  font-family:var(--font);font-size:11px;font-weight:600;
  cursor:pointer;
}

.form-btns{display:flex;justify-content:flex-end;gap:9px;margin-top:20px}
.cancel-btn{
  padding:10px 22px;border-radius:50px;
  background:transparent;border:1.5px solid var(--border);
  font-family:var(--font);font-size:13.5px;font-weight:600;
  color:var(--text2);cursor:pointer;transition:all .18s;
}
.cancel-btn:hover{border-color:var(--border2);background:var(--surface)}
.submit-btn{
  padding:10px 24px;border-radius:50px;border:none;
  background:var(--pill-dark);color:var(--white);
  font-family:var(--font);font-size:13.5px;font-weight:600;
  cursor:pointer;display:inline-flex;align-items:center;gap:7px;transition:all .18s;
}
.submit-btn:hover:not(:disabled){background:var(--text2);transform:translateY(-1px)}
.submit-btn:disabled{opacity:.5;cursor:not-allowed}
.spinner{width:16px;height:16px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}

/* progress bar */
.upload-prog{height:4px;border-radius:2px;background:var(--border);overflow:hidden;margin-top:8px}
.upload-prog-fill{height:100%;border-radius:2px;background:var(--accent-dark);transition:width .3s}

/* success bar */
.success-bar{
  display:flex;align-items:center;gap:10px;
  padding:12px 16px;border-radius:12px;margin-bottom:16px;
  background:#f0fdf4;border:1.5px solid rgba(16,185,129,.25);
  animation:popIn .35s ease;
}
.success-icon{width:28px;height:28px;border-radius:50%;background:#10b981;display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0}
.ticket-id{
  font-family:'DM Mono',monospace;font-size:13px;font-weight:600;
  padding:3px 10px;border-radius:6px;
  background:#dcfce7;border:1px solid #86efac;color:#15803d;
  display:inline-flex;align-items:center;gap:5px;cursor:pointer;
}
.ticket-id:hover{background:#bbf7d0}

/* ════ DETAIL ════ */
.detail-grid{display:grid;grid-template-columns:1fr 300px;gap:14px}
.info-row{display:flex;justify-content:space-between;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--border)}
.info-row:last-child{border:none}
.info-key{font-size:12px;color:var(--muted);font-weight:500}
.info-val{font-size:13px;color:var(--text);font-weight:600;text-align:right;max-width:180px;word-break:break-word}

/* timeline */
.stl-step{display:flex;gap:10px}
.stl-col{display:flex;flex-direction:column;align-items:center;flex-shrink:0}
.stl-circle{
  width:30px;height:30px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  border:2px solid var(--border);background:var(--white);
  font-size:11px;color:var(--muted);
}
.stl-circle.done{background:#10b981;border-color:#10b981;color:#fff}
.stl-circle.curr{background:#f0f4ff;border-color:#3b82f6;color:#3b82f6}
.stl-line{width:2px;flex:1;min-height:14px;background:var(--border);margin:4px 0}
.stl-line.done{background:#10b981}
.stl-body{padding:.25rem 0 1rem}
.stl-ttl{font-size:13px;font-weight:600;color:var(--text);margin-bottom:2px}
.stl-sub{font-size:11px;color:var(--muted)}
.stl-note{font-size:11.5px;color:var(--text2);margin-top:3px;font-style:italic;padding:5px 8px;background:var(--surface);border-radius:6px;border:1px solid var(--border)}

/* chat */
.chat-msgs{height:260px;overflow-y:auto;padding:12px;display:flex;flex-direction:column;gap:8px}
.bubble{max-width:82%;padding:9px 12px;border-radius:13px;font-size:13px;line-height:1.55}
.bubble-user{background:var(--pill-dark);color:#fff;border-radius:13px 13px 4px 13px;align-self:flex-end}
.bubble-agent{background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:13px 13px 13px 4px;align-self:flex-start}
.bubble-time{font-size:10px;opacity:.55;margin-top:3px;text-align:right}
.chat-inp-row{display:flex;gap:8px;padding:10px 12px;border-top:1px solid var(--border)}
.chat-inp{
  flex:1;padding:9px 12px;border-radius:50px;
  border:1.5px solid var(--border);background:var(--surface);
  font-size:13px;font-family:var(--font);color:var(--text);outline:none;transition:border-color .18s;
}
.chat-inp:focus{border-color:var(--accent-dark)}
.chat-send{
  width:36px;height:36px;border-radius:50%;border:none;
  background:var(--pill-dark);color:#fff;cursor:pointer;flex-shrink:0;
  display:flex;align-items:center;justify-content:center;transition:all .15s;
}
.chat-send:hover{background:var(--text2);transform:scale(1.06)}

/* CSAT stars */
.star-row{display:flex;gap:6px;margin:8px 0}
.star{font-size:26px;cursor:pointer;transition:transform .1s;line-height:1}
.star:hover{transform:scale(1.15)}
.csat-submitted{
  display:flex;align-items:center;gap:8px;
  padding:10px 14px;border-radius:10px;
  background:#f0fdf4;border:1.5px solid rgba(16,185,129,.25);
  font-size:13px;font-weight:600;color:#064e3b;
}

/* attachment items in detail */
.att-item{
  display:flex;align-items:center;gap:8px;
  padding:8px 10px;border-radius:8px;
  background:var(--surface);border:1px solid var(--border);
  font-size:12.5px;color:var(--text2);
  text-decoration:none;transition:all .12s;cursor:pointer;
}
.att-item:hover{background:var(--surface2);border-color:var(--accent-dark)}
.att-thumb{width:36px;height:36px;border-radius:6px;object-fit:cover;border:1px solid var(--border)}

/* edit inline */
.edit-ta{
  width:100%;padding:10px;border-radius:10px;
  border:1.5px solid var(--accent-dark);background:var(--white);
  font-size:13px;font-family:var(--font);color:var(--text);
  outline:none;resize:vertical;min-height:80px;
}

/* ════ NOTIFICATIONS ════ */
.notif-full-item{
  display:flex;align-items:flex-start;gap:10px;
  padding:13px 16px;border-bottom:1px solid var(--border);
  transition:background .15s;cursor:pointer;
}
.notif-full-item:last-child{border:none}
.notif-full-item.unread{background:#fffff0}
.notif-full-item:hover{background:var(--surface)}
.notif-big-icon{width:40px;height:40px;border-radius:11px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}

/* ════ PROFILE ════ */
.prof-hero{
  background:var(--pill-dark);border-radius:var(--r-lg);
  padding:26px 28px;margin-bottom:16px;
  display:flex;align-items:center;gap:18px;position:relative;overflow:hidden;
}
.prof-hero::before{content:'';position:absolute;top:-50px;right:-50px;width:180px;height:180px;border-radius:50%;background:rgba(212,240,0,.08);pointer-events:none}
.prof-av{
  width:70px;height:70px;border-radius:50%;flex-shrink:0;
  background:var(--accent);display:flex;align-items:center;justify-content:center;
  font-family:var(--display);font-size:28px;font-weight:800;color:var(--text);
  box-shadow:0 0 0 4px rgba(212,240,0,.25);
}
.prof-name{font-family:var(--display);font-size:20px;font-weight:800;color:#fff;margin-bottom:3px}
.prof-role{font-size:13px;color:rgba(255,255,255,.45)}
.prof-badge{
  margin-left:auto;padding:5px 14px;border-radius:50px;
  background:rgba(212,240,0,.15);border:1px solid rgba(212,240,0,.3);
  font-size:11.5px;font-weight:600;color:var(--accent);font-family:var(--font);
}
.prof-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.danger-card{border:1.5px solid rgba(220,38,38,.2) !important}
.logout-pill{
  display:flex;align-items:center;gap:6px;
  padding:8px 16px;border-radius:50px;
  background:#fef2f2;border:1.5px solid rgba(220,38,38,.25);
  font-family:var(--font);font-size:12.5px;font-weight:600;
  color:#dc2626;cursor:pointer;transition:all .15s;
}
.logout-pill:hover{background:#fee2e2}

/* pwd msg */
.pwd-msg{
  padding:9px 13px;border-radius:9px;font-size:12.5px;font-weight:600;
  display:flex;align-items:center;gap:7px;margin-bottom:10px;
}
.pwd-msg.ok{background:#f0fdf4;border:1.5px solid rgba(16,185,129,.25);color:#065f46}
.pwd-msg.err{background:#fef2f2;border:1.5px solid rgba(220,38,38,.2);color:#dc2626}

/* analytics */
.analytics-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin-bottom:16px}
.ana-card{
  background:var(--white);border:1px solid var(--border);
  border-radius:var(--r);padding:14px 16px;box-shadow:var(--shadow);
}
.ana-num{font-family:var(--display);font-size:24px;font-weight:800;line-height:1;margin-bottom:3px}
.ana-lbl{font-size:11px;color:var(--muted)}

/* month chart */
.month-chart{display:flex;align-items:flex-end;gap:5px;height:60px;padding:0 4px}
.month-bar-wrap{display:flex;flex-direction:column;align-items:center;gap:3px;flex:1}
.month-bar{border-radius:3px 3px 0 0;background:var(--accent);opacity:.75;width:100%;transition:opacity .2s;min-height:2px}
.month-bar:hover{opacity:1}
.month-lbl{font-size:8.5px;color:var(--muted)}

/* ════ EMPTY ════ */
.empty{text-align:center;padding:50px 16px}
.empty-icon{font-size:48px;opacity:.3;margin-bottom:10px}
.empty-title{font-family:var(--display);font-size:16px;font-weight:700;color:var(--text2);margin-bottom:4px}
.empty-sub{font-size:13px;color:var(--muted)}

/* ════ BACK BTN ════ */
.back-btn{
  display:inline-flex;align-items:center;gap:6px;
  padding:7px 14px;border-radius:50px;
  background:var(--white);border:1.5px solid var(--border);
  font-family:var(--font);font-size:12.5px;font-weight:600;
  color:var(--text2);cursor:pointer;margin-bottom:16px;transition:all .15s;
}
.back-btn:hover{border-color:var(--border2);background:var(--surface)}

/* ════ TOAST ════ */
.toast-wrap{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:8px}
.toast{
  padding:10px 16px;border-radius:12px;font-size:13px;font-weight:600;
  font-family:var(--font);box-shadow:var(--shadow-lg);
  display:flex;align-items:center;gap:8px;min-width:220px;
  animation:popIn .3s cubic-bezier(.34,1.56,.64,1) both;
}
.toast.s{background:#f0fdf4;border:1.5px solid #86efac;color:#15803d}
.toast.e{background:#fef2f2;border:1.5px solid #fecaca;color:#dc2626}
.toast.i{background:#eff6ff;border:1.5px solid #bfdbfe;color:#1d4ed8}

/* ════ SKELETON ════ */
.skel{
  background:linear-gradient(90deg,var(--surface) 25%,var(--surface2) 50%,var(--surface) 75%);
  background-size:200% 100%;animation:shimmer 1.4s ease infinite;
  border-radius:var(--r);border:1px solid var(--border);
}

/* ════ PAGE FADE ════ */
.page-fade{animation:fadeUp .28s ease both}

/* ════ MODAL OVERLAY ════ */
.modal-overlay{
  position:fixed;inset:0;background:rgba(0,0,0,.35);
  z-index:500;display:flex;align-items:center;justify-content:center;
  padding:20px;animation:fadeIn .2s ease both;
}
.modal{
  background:var(--white);border-radius:20px;
  width:100%;max-width:460px;
  box-shadow:0 20px 60px rgba(0,0,0,.2);
  animation:popIn .25s cubic-bezier(.34,1.56,.64,1) both;
  overflow:hidden;
}
.modal-hdr{
  padding:16px 20px;border-bottom:1px solid var(--border);
  display:flex;align-items:center;justify-content:space-between;
}
.modal-title{font-family:var(--display);font-size:15px;font-weight:700;color:var(--text)}
.modal-close{width:28px;height:28px;border-radius:7px;background:var(--surface);border:1px solid var(--border);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px}
.modal-close:hover{background:var(--border);color:var(--red)}
.modal-body{padding:20px}

/* ════ RESPONSIVE ════ */
@media(max-width:1080px){.detail-grid{grid-template-columns:1fr}}
@media(max-width:900px){
  .main{padding:16px}
  .nav-tabs{display:none}
  .hamburger{display:flex}
  .two-col,.prof-grid{grid-template-columns:1fr}
  .form-grid{grid-template-columns:1fr}
}
@media(max-width:600px){
  .dash-stats{grid-template-columns:1fr 1fr}
  .detail-grid{grid-template-columns:1fr}
}
`;