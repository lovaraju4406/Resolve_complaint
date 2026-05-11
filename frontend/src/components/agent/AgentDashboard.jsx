import React from 'react';

export default function AgentDashboard({ user, stats, complaints, setActiveTab }) {
  const today = new Date().toDateString();
  const updatedToday  = complaints.filter(c => c.updatedAt && new Date(c.updatedAt).toDateString() === today).length;
  const resolvedToday = complaints.filter(c =>
    (c.status === 'Resolved' || c.status === 'completed') &&
    c.updatedAt && new Date(c.updatedAt).toDateString() === today
  ).length;
  const resolvedPct = stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0;

  // Average CSAT from resolved complaints that have a rating
  const rated = complaints.filter(c => c.csatRating);
  const avgCsat = rated.length
    ? (rated.reduce((s, c) => s + c.csatRating, 0) / rated.length).toFixed(1)
    : null;

  return (
    <>
      <div className="ag-ph">
        <div className="ag-ph-title">Good day, {user.name?.split(' ')[0]} 👋</div>
        <div className="ag-ph-sub">Your complaint activity at a glance.</div>
      </div>

      {/* Stat cards */}
      <div className="ag-stats">
        {[
          { label: 'Assigned',    num: stats.total,     color: '#16a34a', bg: '#f0fdf4', border: '#86efac', icon: '📁' },
          { label: 'Pending',     num: stats.pending,   color: '#d97706', bg: '#fef3c7', border: '#fde68a', icon: '⏳' },
          { label: 'In Progress', num: stats.progress,  color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: '🔄' },
          { label: 'Resolved',    num: stats.resolved,  color: '#15803d', bg: '#dcfce7', border: '#6ee7b7', icon: '✅' },
          { label: 'Escalated',   num: stats.escalated, color: '#7c3aed', bg: '#ede9fe', border: '#c4b5fd', icon: '⬆️' },
        ].map(s => (
          <div className="ag-stat" key={s.label}
            style={{ borderColor: s.border, borderLeftWidth: 4, borderLeftColor: s.color }}>
            <div className="ag-stat-top">
              <div className="ag-stat-icon" style={{ background: s.bg }}>{s.icon}</div>
            </div>
            <div className="ag-stat-num" style={{ color: s.color }}>{s.num}</div>
            <div className="ag-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Workload */}
      <div className="ag-workload">
        <div className="ag-wl-head">
          <div>
            <div className="ag-wl-title">📊 Workload Overview</div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
              Progress across all assigned complaints
            </div>
          </div>
          <div className="ag-wl-pct">{resolvedPct}% resolved</div>
        </div>
        <div className="ag-wl-bars">
          {[
            { label: 'Resolved',    val: stats.resolved,  color: '#16a34a' },
            { label: 'In Progress', val: stats.progress,  color: '#2563eb' },
            { label: 'Pending',     val: stats.pending,   color: '#d97706' },
            { label: 'Escalated',   val: stats.escalated, color: '#7c3aed' },
          ].map(b => (
            <div className="ag-wbar" key={b.label}>
              <div className="ag-wbar-row">
                <span>{b.label}</span>
                <span>{b.val} / {stats.total}</span>
              </div>
              <div className="ag-wbar-track">
                <div className="ag-wbar-fill"
                  style={{
                    width: `${stats.total ? Math.round((b.val / stats.total) * 100) : 0}%`,
                    background: b.color
                  }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSAT summary */}
      {avgCsat && (
        <div style={{
          background: 'var(--white)', border: '1.5px solid var(--border)',
          borderRadius: 14, padding: '16px 20px', marginBottom: 22,
          boxShadow: 'var(--sh)', display: 'flex', alignItems: 'center', gap: 20
        }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '.07em', marginBottom: 4 }}>
              Avg. Customer Satisfaction
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--green)' }}>{avgCsat} ⭐</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            Based on <b style={{ color: 'var(--text)' }}>{rated.length}</b> rated complaint{rated.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Today's activity */}
      <div className="ag-sec-title">🗓️ Today's Activity</div>
      <div className="ag-today">
        {[
          { icon: '📋', num: stats.total,   label: 'Total Assigned', color: '#16a34a' },
          { icon: '🔄', num: updatedToday,  label: 'Updated Today',  color: '#2563eb' },
          { icon: '✅', num: resolvedToday, label: 'Resolved Today', color: '#15803d' },
          { icon: '⏳', num: stats.pending, label: 'Still Pending',  color: '#d97706' },
        ].map(c => (
          <div className="ag-today-card" key={c.label}
            style={{ borderLeftWidth: 4, borderLeftColor: c.color }}>
            <div className="ag-today-icon">{c.icon}</div>
            <div>
              <div className="ag-today-num" style={{ color: c.color }}>{c.num}</div>
              <div className="ag-today-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="ag-sec-title">⚡ Quick Actions</div>
      <div className="ag-quick">
        {[
          { icon: '📋', bg: '#f0fdf4', title: 'View Complaints', sub: 'See & update assigned complaints', tab: 'complaints' },
          { icon: '👤', bg: '#eff6ff', title: 'My Profile',      sub: 'Account details & settings',       tab: 'profile'    },
        ].map(a => (
          <div key={a.title} className="ag-qcard" onClick={() => setActiveTab(a.tab)}>
            <div className="ag-qcard-icon" style={{ background: a.bg }}>{a.icon}</div>
            <div>
              <div className="ag-qcard-title">{a.title}</div>
              <div className="ag-qcard-sub">{a.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}