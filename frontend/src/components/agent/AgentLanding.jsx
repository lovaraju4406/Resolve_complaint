import React, { useEffect, useState } from 'react';

/* ─── Animated complaint card demo ──────────────────────────── */
const CARDS = [
  { id: 'TKT-3821', name: 'Priya Sharma',  status: 'Pending',     priority: 'High',   city: 'Mumbai'  },
  { id: 'TKT-3744', name: 'Ravi Kumar',    status: 'In Progress', priority: 'Medium', city: 'Delhi'   },
  { id: 'TKT-3699', name: 'Ananya Patel',  status: 'Resolved',    priority: 'Low',    city: 'Chennai' },
];

const STATUS_COLORS = {
  'Pending':     { bg: '#fef9e7', color: '#92400e', dot: '#f59e0b' },
  'In Progress': { bg: '#f0f4ff', color: '#1e3a8a', dot: '#3b82f6' },
  'Resolved':    { bg: '#f0fdf4', color: '#064e3b', dot: '#10b981' },
};

const PRI_COLORS = {
  'High':   { bg: '#fef2f2', color: '#dc2626' },
  'Medium': { bg: '#fef9e7', color: '#92400e' },
  'Low':    { bg: '#f0fdf4', color: '#065f46' },
};

function CardDemo() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setActive(p => (p + 1) % CARDS.length), 2000);
    return () => clearInterval(iv);
  }, []);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 14px' }}>
      {CARDS.map((c, i) => {
        const sc = STATUS_COLORS[c.status];
        const pc = PRI_COLORS[c.priority];
        return (
          <div key={c.id} style={{
            background: i === active ? '#fffff8' : 'white',
            border: `1.5px solid ${i === active ? '#b8d400' : '#e4e1d8'}`,
            borderRadius: 12, padding: '11px 13px',
            transition: 'all .4s ease',
            transform: i === active ? 'scale(1.02)' : 'scale(1)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 7 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#9a9790', background: '#f2f0eb', padding: '2px 7px', borderRadius: 5 }}>
                #{c.id}
              </span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 50, background: sc.bg, color: sc.color, display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: sc.dot, display: 'inline-block' }} />
                {c.status}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a18', marginBottom: 2 }}>{c.name}</div>
                <div style={{ fontSize: 11, color: '#9a9790' }}>{c.city}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 5, background: pc.bg, color: pc.color }}>
                {c.priority}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Landing ──────────────────────────────────────────── */
export default function AgentLanding({ user, stats, setActiveTab }) {
  const firstName = user?.name?.split(' ')[0] || 'Agent';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const resolvedPct = stats.total
    ? Math.round((stats.resolved / stats.total) * 100)
    : 0;

  const S = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#f8f7f4;--white:#fff;--surface:#f2f0eb;--border:#e4e1d8;
      --text:#1a1a18;--text2:#4a4744;--muted:#9a9790;
      --accent:#d4f000;--accent-dark:#b8d400;--dark:#1a1a18;
      --font:'DM Sans',sans-serif;--display:'Syne',sans-serif;
    }
    .al-wrap{min-height:calc(100vh - 62px);background:var(--bg);padding:0}
    /* Hero */
    .al-hero{
      background:var(--dark);padding:52px 48px 48px;
      display:grid;grid-template-columns:1fr 420px;gap:40px;align-items:center;
    }
    .al-tag{
      display:inline-flex;align-items:center;gap:7px;padding:5px 14px;
      border-radius:50px;background:rgba(212,240,0,.15);
      border:1px solid rgba(212,240,0,.3);
      font-size:12px;font-weight:600;color:var(--accent);
      margin-bottom:18px;font-family:var(--font);
    }
    .al-h1{
      font-family:var(--display);font-size:48px;font-weight:800;
      color:#fff;line-height:1.1;margin-bottom:16px;
    }
    .al-h1 span{color:var(--accent)}
    .al-sub{font-size:15px;color:rgba(255,255,255,.5);line-height:1.65;max-width:440px;margin-bottom:32px;font-family:var(--font)}
    .al-btns{display:flex;gap:12px;flex-wrap:wrap}
    .al-btn-primary{
      padding:12px 24px;border-radius:50px;border:none;
      background:var(--accent);color:var(--text);
      font-family:var(--font);font-size:14px;font-weight:700;
      cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:7px;
    }
    .al-btn-primary:hover{background:var(--accent-dark);transform:translateY(-1px)}
    .al-btn-outline{
      padding:12px 24px;border-radius:50px;background:transparent;
      color:rgba(255,255,255,.8);border:1.5px solid rgba(255,255,255,.2);
      font-family:var(--font);font-size:14px;font-weight:600;
      cursor:pointer;transition:all .2s;
    }
    .al-btn-outline:hover{border-color:rgba(255,255,255,.5);color:#fff}
    /* Hero right card */
    .al-hero-card{
      background:white;border-radius:20px;border:1.5px solid var(--border);
      overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.2);
    }
    .al-card-top{
      background:var(--dark);padding:14px 16px;
      display:flex;align-items:center;gap:8px;
      border-bottom:1px solid rgba(255,255,255,.08);
    }
    .al-dot{width:9px;height:9px;border-radius:50%}
    .al-card-title{font-size:12px;color:rgba(255,255,255,.5);margin-left:4px;font-family:var(--font)}
    .al-card-badge{
      margin-left:auto;padding:3px 10px;border-radius:50px;
      background:rgba(212,240,0,.2);border:1px solid rgba(212,240,0,.3);
      font-size:10px;font-weight:600;color:var(--accent);font-family:var(--font);
    }
    /* Stats section */
    .al-stats{padding:36px 48px;background:white;border-bottom:1px solid var(--border)}
    .al-stats-title{font-family:var(--display);font-size:13px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:20px}
    .al-stats-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}
    .al-stat{
      background:var(--surface);border:1px solid var(--border);border-radius:14px;
      padding:18px;text-align:center;transition:all .18s;cursor:default;
    }
    .al-stat:hover{transform:translateY(-2px);border-color:var(--accent-dark);background:white}
    .al-stat-num{font-family:var(--display);font-size:32px;font-weight:800;line-height:1;margin-bottom:5px}
    .al-stat-lbl{font-size:12px;color:var(--muted);font-weight:500;font-family:var(--font)}
    /* Progress bar */
    .al-progress{padding:28px 48px;background:var(--surface);border-bottom:1px solid var(--border)}
    .al-prog-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
    .al-prog-label{font-family:var(--display);font-size:14px;font-weight:700;color:var(--text)}
    .al-prog-pct{font-family:var(--display);font-size:22px;font-weight:800;color:var(--accent-dark)}
    .al-prog-track{height:10px;background:var(--border);border-radius:5px;overflow:hidden;margin-bottom:16px}
    .al-prog-fill{height:100%;border-radius:5px;background:linear-gradient(90deg,#b8d400,#d4f000);transition:width .8s ease}
    .al-prog-breakdown{display:flex;gap:20px;flex-wrap:wrap}
    .al-prog-item{display:flex;align-items:center;gap:7px;font-size:12.5px;color:var(--text2);font-family:var(--font)}
    .al-prog-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
    /* Quick actions */
    .al-actions{padding:36px 48px}
    .al-actions-title{font-family:var(--display);font-size:16px;font-weight:700;color:var(--text);margin-bottom:20px}
    .al-actions-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
    .al-action-card{
      background:white;border:1.5px solid var(--border);border-radius:16px;
      padding:22px;cursor:pointer;transition:all .18s;
      display:flex;flex-direction:column;gap:12px;
    }
    .al-action-card:hover{transform:translateY(-3px);border-color:var(--accent-dark);box-shadow:0 8px 24px rgba(0,0,0,.07)}
    .al-action-icon{width:44px;height:44px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
    .al-action-title{font-family:var(--display);font-size:14px;font-weight:700;color:var(--text)}
    .al-action-sub{font-size:12.5px;color:var(--muted);line-height:1.5;font-family:var(--font)}
    .al-action-arrow{margin-top:auto;font-size:13px;color:var(--accent-dark);font-weight:700;font-family:var(--font)}
    /* Tips banner */
    .al-tips{
      margin:0 48px 36px;background:var(--dark);border-radius:16px;
      padding:22px 26px;display:flex;align-items:center;gap:20px;
    }
    .al-tip-icon{font-size:28px;flex-shrink:0}
    .al-tip-title{font-family:var(--display);font-size:14px;font-weight:700;color:#fff;margin-bottom:4px}
    .al-tip-sub{font-size:12.5px;color:rgba(255,255,255,.5);line-height:1.5;font-family:var(--font)}
    .al-tip-btn{
      margin-left:auto;padding:9px 20px;border-radius:50px;border:none;
      background:var(--accent);color:var(--text);
      font-family:var(--font);font-size:13px;font-weight:700;
      cursor:pointer;white-space:nowrap;transition:all .15s;flex-shrink:0;
    }
    .al-tip-btn:hover{background:var(--accent-dark)}
    @media(max-width:900px){
      .al-hero{grid-template-columns:1fr;padding:36px 24px}
      .al-hero-card{display:none}
      .al-h1{font-size:36px}
      .al-stats,.al-progress,.al-actions{padding:24px}
      .al-stats-grid{grid-template-columns:repeat(2,1fr)}
      .al-actions-grid{grid-template-columns:1fr}
      .al-tips{margin:0 24px 28px}
    }
  `;

  return (
    <>
      <style>{S}</style>
      <div className="al-wrap">

        {/* ── Hero ── */}
        <div className="al-hero">
          <div style={{ animation: 'fadeIn .5s ease both' }}>
            <div className="al-tag">🎯 Agent Portal · ResolveNow</div>
            <h1 className="al-h1">
              {greeting},<br /><span>{firstName}</span> 👋
            </h1>
            <p className="al-sub">
              You have <strong style={{ color: '#fff' }}>{stats.pending} pending</strong> and{' '}
              <strong style={{ color: '#fff' }}>{stats.progress} in-progress</strong> complaints
              waiting for your attention today.
            </p>
            <div className="al-btns">
              <button className="al-btn-primary" onClick={() => setActiveTab('complaints')}>
                📋 View My Complaints
              </button>
              <button className="al-btn-outline" onClick={() => setActiveTab('dashboard')}>
                ▦ Open Dashboard
              </button>
            </div>
          </div>

          {/* Animated card preview */}
          <div className="al-hero-card">
            <div className="al-card-top">
              <div className="al-dot" style={{ background: '#ef4444' }} />
              <div className="al-dot" style={{ background: '#f59e0b' }} />
              <div className="al-dot" style={{ background: '#10b981' }} />
              <span className="al-card-title">Assigned Complaints · Live</span>
              <div className="al-card-badge">🟢 Active</div>
            </div>
            <CardDemo />
          </div>
        </div>

        {/* ── Stats ── */}
        <div className="al-stats">
          <div className="al-stats-title">Your complaint overview</div>
          <div className="al-stats-grid">
            {[
              { num: stats.total,     label: 'Total Assigned', color: '#1a1a18' },
              { num: stats.pending,   label: 'Pending',        color: '#d97706' },
              { num: stats.progress,  label: 'In Progress',    color: '#2563eb' },
              { num: stats.resolved,  label: 'Resolved',       color: '#16a34a' },
              { num: stats.escalated, label: 'Escalated',      color: '#7c3aed' },
            ].map(s => (
              <div key={s.label} className="al-stat">
                <div className="al-stat-num" style={{ color: s.color }}>{s.num}</div>
                <div className="al-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Resolution progress ── */}
        <div className="al-progress">
          <div className="al-prog-head">
            <div className="al-prog-label">📊 Resolution Progress</div>
            <div className="al-prog-pct">{resolvedPct}%</div>
          </div>
          <div className="al-prog-track">
            <div className="al-prog-fill" style={{ width: `${resolvedPct}%` }} />
          </div>
          <div className="al-prog-breakdown">
            {[
              { label: 'Resolved',    val: stats.resolved,  color: '#16a34a' },
              { label: 'In Progress', val: stats.progress,  color: '#2563eb' },
              { label: 'Pending',     val: stats.pending,   color: '#d97706' },
              { label: 'Escalated',   val: stats.escalated, color: '#7c3aed' },
            ].map(b => (
              <div key={b.label} className="al-prog-item">
                <div className="al-prog-dot" style={{ background: b.color }} />
                {b.label}: <strong style={{ color: '#1a1a18' }}>{b.val}</strong>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="al-actions">
          <div className="al-actions-title">⚡ Quick Actions</div>
          <div className="al-actions-grid">
            {[
              {
                icon: '📋', bg: '#f0fdf4',
                title: 'My Complaints',
                sub: 'View, filter, and update all complaints assigned to you.',
                tab: 'complaints',
              },
              {
                icon: '▦', bg: '#eff6ff',
                title: 'Dashboard',
                sub: 'See your workload, today\'s activity, and resolution stats.',
                tab: 'dashboard',
              },
              {
                icon: '👤', bg: '#fef9e7',
                title: 'My Profile',
                sub: 'Update your account details, password, and view your CSAT scores.',
                tab: 'profile',
              },
            ].map(a => (
              <div key={a.title} className="al-action-card" onClick={() => setActiveTab(a.tab)}>
                <div className="al-action-icon" style={{ background: a.bg }}>{a.icon}</div>
                <div>
                  <div className="al-action-title">{a.title}</div>
                  <div className="al-action-sub">{a.sub}</div>
                </div>
                <div className="al-action-arrow">Go → </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tip banner ── */}
        {stats.pending > 0 && (
          <div className="al-tips">
            <div className="al-tip-icon">💡</div>
            <div>
              <div className="al-tip-title">
                You have {stats.pending} pending complaint{stats.pending !== 1 ? 's' : ''} waiting
              </div>
              <div className="al-tip-sub">
                Use AI reply suggestions and canned responses to resolve complaints faster. Sort by SLA deadline to prioritize.
              </div>
            </div>
            <button className="al-tip-btn" onClick={() => setActiveTab('complaints')}>
              Resolve Now →
            </button>
          </div>
        )}

      </div>
    </>
  );
}