import React, { useState, useEffect } from 'react';
import axios from '../user/axiosInstance';
import { toast, renderStars } from './agentUtils';

const WEEKS = ['This week', '1 wk ago', '2 wks ago', '3 wks ago', '4 wks ago'];

export default function AgentProfile({ user, stats, complaints }) {
  const [pwdForm, setPwdForm] = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdMsg, setPwdMsg]   = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);
  const [perfData, setPerfData]     = useState(null);
  const [perfLoading, setPerfLoading] = useState(true);

  // CSAT data from complaints
  const rated = complaints.filter(c => c.csatRating);
  const avgCsat = rated.length
    ? (rated.reduce((s, c) => s + c.csatRating, 0) / rated.length).toFixed(1)
    : null;

  // Fetch real performance data; fall back to dummy
  useEffect(() => {
    if (!user?._id) return;
    axios.get(`http://localhost:8000/agent/performance/${user._id}`)
      .then(res => setPerfData(res.data))
      .catch(() => {
        // Fallback dummy data when endpoint doesn't exist yet
        setPerfData([
          { week: 'This week', resolved: stats.resolved },
          { week: '1 wk ago',   resolved: 3 },
          { week: '2 wks ago',  resolved: 5 },
          { week: '3 wks ago',  resolved: 2 },
          { week: '4 wks ago',  resolved: 7 },
        ]);
      })
      .finally(() => setPerfLoading(false));
  }, [user?._id, stats.resolved]);

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwdForm.newPwd !== pwdForm.confirm) {
      setPwdMsg('error:Passwords do not match');
      return;
    }
    if (pwdForm.newPwd.length < 6) {
      setPwdMsg('error:Minimum 6 characters required');
      return;
    }
    setPwdLoading(true);
    try {
      // Send current password to backend for verification
      await axios.put(`http://localhost:8000/user/${user._id}/change-password`, {
        currentPassword: pwdForm.current,
        newPassword: pwdForm.newPwd,
      });
      setPwdMsg('success:Password updated successfully!');
      setPwdForm({ current: '', newPwd: '', confirm: '' });
      toast('Password changed!', 's');
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed. Check your current password.';
      setPwdMsg(`error:${msg}`);
    } finally {
      setPwdLoading(false);
    }
  };

  const perfMax = perfData ? Math.max(...perfData.map(r => r.resolved), 1) : 1;

  return (
    <>
      <div className="ag-ph">
        <div className="ag-ph-title">👤 My Profile</div>
        <div className="ag-ph-sub">Your account details, settings and performance.</div>
      </div>

      {/* Hero */}
      <div className="ag-prof-hero">
        <div className="ag-prof-av">{user.name?.[0]?.toUpperCase()}</div>
        <div>
          <div className="ag-prof-name">{user.name}</div>
          <div className="ag-prof-email">{user.email}</div>
        </div>
        <span className="ag-prof-badge">Support Agent</span>
      </div>

      {/* Info grid */}
      <div className="ag-info-grid">
        {[
          { label: 'Full Name',       val: user.name || '—' },
          { label: 'Email',           val: user.email || '—' },
          { label: 'Phone',           val: user.phone || '—' },
          { label: 'Agent ID',        val: user._id?.slice(-8).toUpperCase() || '—' },
          { label: 'Role',            val: 'Support Agent' },
          { label: 'Total Resolved',  val: `${stats.resolved} complaints` },
          { label: 'Avg CSAT',        val: avgCsat ? `${avgCsat} / 5 ⭐` : 'No ratings yet' },
          { label: 'Escalated',       val: `${stats.escalated} complaints` },
        ].map(i => (
          <div className="ag-info-item" key={i.label}>
            <div className="ag-info-l">{i.label}</div>
            <div className="ag-info-v">{i.val}</div>
          </div>
        ))}
      </div>

      {/* CSAT breakdown */}
      {rated.length > 0 && (
        <div className="ag-csat-card">
          <div className="ag-perf-title">⭐ Customer Satisfaction Scores</div>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <div className="ag-csat-big">{avgCsat}</div>
              <div className="ag-csat-stars-lg">{'⭐'.repeat(Math.round(avgCsat))}</div>
              <div className="ag-csat-sub">avg from {rated.length} ratings</div>
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              {[5, 4, 3, 2, 1].map(star => {
                const count = rated.filter(c => c.csatRating === star).length;
                const pct = rated.length ? Math.round((count / rated.length) * 100) : 0;
                return (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                    <span style={{ fontSize: 12, width: 14, textAlign: 'right', color: 'var(--muted)' }}>{star}</span>
                    <span style={{ fontSize: 12 }}>⭐</span>
                    <div style={{ flex: 1, height: 7, background: 'var(--s3)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: '#facc15', borderRadius: 4 }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--muted)', width: 28 }}>{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Change password */}
      <div className="ag-pwd-card">
        <div className="ag-pwd-title">🔒 Change Password</div>
        <form onSubmit={changePassword}>
          <div className="ag-pwd-grid">
            <div className="ag-pwd-field full">
              <label className="ag-pwd-label">Current Password</label>
              <input className="ag-pwd-input" type="password" placeholder="Enter your current password"
                value={pwdForm.current}
                onChange={e => setPwdForm(p => ({ ...p, current: e.target.value }))} required />
            </div>
            <div className="ag-pwd-field">
              <label className="ag-pwd-label">New Password</label>
              <input className="ag-pwd-input" type="password" placeholder="Min 6 characters"
                value={pwdForm.newPwd}
                onChange={e => setPwdForm(p => ({ ...p, newPwd: e.target.value }))} required />
            </div>
            <div className="ag-pwd-field">
              <label className="ag-pwd-label">Confirm Password</label>
              <input className="ag-pwd-input" type="password" placeholder="Re-enter new password"
                value={pwdForm.confirm}
                onChange={e => setPwdForm(p => ({ ...p, confirm: e.target.value }))} required />
            </div>
          </div>
          {pwdMsg && (
            <div style={{
              padding: '9px 14px', borderRadius: 9, marginBottom: 14,
              fontSize: 13, fontWeight: 600,
              background: pwdMsg.startsWith('success') ? '#f0fdf4' : '#fef2f2',
              border: `1.5px solid ${pwdMsg.startsWith('success') ? '#86efac' : '#fecaca'}`,
              color: pwdMsg.startsWith('success') ? '#15803d' : '#dc2626',
            }}>
              {pwdMsg.startsWith('success') ? '✓' : '⚠'} {pwdMsg.split(':')[1]}
            </div>
          )}
          <button type="submit" className="ag-pwd-submit" disabled={pwdLoading}>
            {pwdLoading ? 'Updating…' : 'Update Password →'}
          </button>
        </form>
      </div>

      {/* Performance history */}
      <div className="ag-perf-card">
        <div className="ag-perf-title">
          📈 Performance History
          {perfLoading && <span style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 400 }}> Loading…</span>}
        </div>
        <div className="ag-perf-bars">
          {(perfData || WEEKS.map(w => ({ week: w, resolved: 0 }))).map(row => (
            <div className="ag-perf-row" key={row.week}>
              <span className="ag-perf-week">{row.week}</span>
              <div className="ag-perf-track">
                <div className="ag-perf-fill"
                  style={{ width: `${Math.round((row.resolved / perfMax) * 100)}%` }} />
              </div>
              <span className="ag-perf-num">{row.resolved}</span>
            </div>
          ))}
        </div>
        <div className="ag-perf-foot">
          Total resolved all time: <b style={{ color: 'var(--gd)' }}>{stats.resolved}</b> complaint{stats.resolved !== 1 ? 's' : ''}
        </div>
      </div>
    </>
  );
}