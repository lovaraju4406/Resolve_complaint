import React from 'react';
import { Icon, Icons, CAT_EMOJI, getBadgeCls, timeAgo, monthlyActivity, avgResolutionDays } from './userUtils';

export default function UserDashboard({ userName, complaints, setView, setSelectedC }) {
  const stats = {
    total:      complaints.length,
    pending:    complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved:   complaints.filter(c => c.status === 'Resolved' || c.status === 'completed').length,
    withdrawn:  complaints.filter(c => c.status === 'Withdrawn').length,
  };
  const resRate   = stats.total ? Math.round((stats.resolved / stats.total) * 100) : 0;
  const avgDays   = avgResolutionDays(complaints);
  const monthly   = monthlyActivity(complaints);
  const maxMonth  = Math.max(...monthly.map(m => m.count), 1);

  return (
    <div className="page-fade">
      {/* Stat cards */}
      <div className="dash-stats" style={{ marginBottom: 18 }}>
        {[
          { label: 'Total Filed',  num: stats.total,      color: '#1a1a18' },
          { label: 'Pending',      num: stats.pending,    color: '#d97706' },
          { label: 'In Progress',  num: stats.inProgress, color: '#2563eb' },
          { label: 'Resolved',     num: stats.resolved,   color: '#10b981' },
          { label: 'Resolution %', num: `${resRate}%`,    color: '#7c3aed' },
        ].map(s => (
          <div className="dash-stat" key={s.label}
            style={{ borderLeft: `4px solid ${s.color}` }}>
            <div className="dash-stat-num" style={{ color: s.color }}>{s.num}</div>
            <div className="dash-stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="two-col">
        {/* Activity chart */}
        <div className="pcard">
          <div className="pcard-hdr">
            <div className="pcard-title">📊 Monthly Activity</div>
            {avgDays && (
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>
                Avg resolution: <b style={{ color: 'var(--text)' }}>{avgDays}d</b>
              </span>
            )}
          </div>
          <div className="pcard-body">
            <div className="month-chart">
              {monthly.map(m => (
                <div className="month-bar-wrap" key={m.month}>
                  <div className="month-bar"
                    style={{ height: `${Math.round((m.count / maxMonth) * 100)}%` }}
                    title={`${m.count} complaint${m.count !== 1 ? 's' : ''}`} />
                  <div className="month-lbl">{m.month}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { label: 'Pending',     val: stats.pending,    color: '#f59e0b' },
                { label: 'In Progress', val: stats.inProgress, color: '#3b82f6' },
                { label: 'Resolved',    val: stats.resolved,   color: '#10b981' },
              ].map(s => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, color: 'var(--muted)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                  {s.label}: <b style={{ color: 'var(--text)' }}>{s.val}</b>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent complaints */}
        <div className="pcard">
          <div className="pcard-hdr">
            <div className="pcard-title">🕐 Recent Complaints</div>
            <button onClick={() => setView('complaints')}
              style={{ fontSize: 12, color: 'var(--accent-dark)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}>
              View all →
            </button>
          </div>
          <div className="pcard-body" style={{ padding: 0 }}>
            {complaints.length === 0 ? (
              <div style={{ padding: '30px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: 32, opacity: .3 }}>📭</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>No complaints yet</div>
              </div>
            ) : complaints.slice(0, 4).map((c, i) => (
              <div key={c._id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 18px',
                  borderBottom: i < Math.min(complaints.length, 4) - 1 ? '1px solid var(--border)' : 'none',
                  cursor: 'pointer', transition: 'background .15s',
                }}
                onClick={() => { setSelectedC(c); setView('detail'); }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--surface)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <div style={{ fontSize: 20, flexShrink: 0 }}>{CAT_EMOJI[c.category] || '📋'}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {c.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{timeAgo(c.createdAt)}</div>
                </div>
                <span className={`badge ${getBadgeCls(c.status)}`}>
                  <span className="badge-dot" />{c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="pcard" style={{ marginBottom: 0 }}>
        <div className="pcard-hdr"><div className="pcard-title">⚡ Quick Actions</div></div>
        <div className="pcard-body">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 10 }}>
            {[
              { icon: Icons.plus,      label: 'Raise Complaint',   sub: 'File a new issue',       view: 'raise',         bg: '#fffff0' },
              { icon: Icons.complaint, label: 'My Complaints',     sub: 'Track all your tickets', view: 'complaints',    bg: '#f0f4ff' },
              { icon: Icons.bell,      label: 'Notifications',     sub: 'Status updates',         view: 'notifications', bg: '#fef9e7' },
              { icon: Icons.user,      label: 'My Profile',        sub: 'Account & settings',     view: 'profile',       bg: '#f0fdf4' },
            ].map(a => (
              <div key={a.label}
                onClick={() => setView(a.view)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 16px', borderRadius: 'var(--r)',
                  background: a.bg, border: '1.5px solid var(--border)',
                  cursor: 'pointer', transition: 'all .15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(255,255,255,.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon d={a.icon} size={17} />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{a.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}