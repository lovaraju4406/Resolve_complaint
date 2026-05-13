import React, { useState } from 'react';
import axios from './axiosInstance';
import { Icon, Icons, avgResolutionDays, monthlyActivity } from './userUtils';

export default function UserProfile({ user, complaints, logout, setUser }) {
  const [profile, setProfile]       = useState({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
  const [editMode, setEditMode]     = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const [pwd, setPwd]               = useState({ current: '', newPwd: '', confirm: '' });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg]         = useState('');

  const stats = {
    total:      complaints.length,
    pending:    complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved:   complaints.filter(c => c.status === 'Resolved' || c.status === 'completed').length,
    withdrawn:  complaints.filter(c => c.status === 'Withdrawn').length,
  };
  const avgDays  = avgResolutionDays(complaints);
  const monthly  = monthlyActivity(complaints);
  const maxMonth = Math.max(...monthly.map(m => m.count), 1);

  /* ── Save profile ── */
  const saveProfile = async () => {
    setSaveLoading(true);
    try {
      const res = await axios.put(`https://resolve-complaint.onrender.com/user/${user._id}`, {
        name: profile.name, email: profile.email, phone: profile.phone,
      });
      const updated = { ...user, ...res.data };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
      setEditMode(false);
    } catch { alert('Profile update failed. Please try again.'); }
    finally { setSaveLoading(false); }
  };

  /* ── Change password ── */
  const changePassword = async (e) => {
    e.preventDefault();
    if (pwd.newPwd !== pwd.confirm) { setPwdMsg('error:Passwords do not match'); return; }
    if (pwd.newPwd.length < 6)      { setPwdMsg('error:Minimum 6 characters required'); return; }
    setPwdLoading(true);
    try {
      await axios.put(`https://resolve-complaint.onrender.com/user/${user._id}/change-password`, {
        currentPassword: pwd.current,
        newPassword: pwd.newPwd,
      });
      setPwdMsg('success:Password updated successfully!');
      setPwd({ current: '', newPwd: '', confirm: '' });
    } catch (err) {
      const msg = err.response?.data?.message || 'Update failed. Check your current password.';
      setPwdMsg(`error:${msg}`);
    } finally { setPwdLoading(false); }
  };

  return (
    <div className="page-fade" style={{ maxWidth: 720 }}>

      {/* Hero */}
      <div className="prof-hero">
        <div className="prof-av">{user.name?.charAt(0).toUpperCase()}</div>
        <div>
          <div className="prof-name">{user.name}</div>
          <div className="prof-role">Member · ResolveNow</div>
          <div style={{ marginTop: 8 }}>
            <span className="badge badge-resolved" style={{ fontSize: 10.5 }}>
              <span className="badge-dot" />Active Account
            </span>
          </div>
        </div>
        <span className="prof-badge">MEMBER</span>
      </div>

      {/* Analytics */}
      <div className="analytics-grid">
        {[
          { label: 'Total Filed',  num: stats.total,      color: '#1a1a18' },
          { label: 'Pending',      num: stats.pending,    color: '#d97706' },
          { label: 'In Progress',  num: stats.inProgress, color: '#2563eb' },
          { label: 'Resolved',     num: stats.resolved,   color: '#10b981' },
          { label: 'Withdrawn',    num: stats.withdrawn,  color: '#9ca3af' },
          { label: 'Avg. Resolution', num: avgDays ? `${avgDays}d` : '—', color: '#7c3aed' },
        ].map(s => (
          <div className="ana-card" key={s.label}>
            <div className="ana-num" style={{ color: s.color }}>{s.num}</div>
            <div className="ana-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly activity mini chart */}
      {complaints.length > 0 && (
        <div className="pcard" style={{ marginBottom: 14 }}>
          <div className="pcard-hdr"><div className="pcard-title">📊 Filing Activity (last 6 months)</div></div>
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
          </div>
        </div>
      )}

      <div className="prof-grid">
        {/* Personal info */}
        <div className="pcard">
          <div className="pcard-hdr">
            <div className="pcard-title">Personal Info</div>
            <button className="view-btn"
              onClick={() => editMode ? saveProfile() : setEditMode(true)}
              disabled={saveLoading}>
              <Icon d={editMode ? Icons.check : Icons.edit} size={11} />
              {editMode ? (saveLoading ? 'Saving…' : 'Save') : 'Edit'}
            </button>
          </div>
          <div className="pcard-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Full Name', key: 'name',  placeholder: 'Your name' },
                { label: 'Email',     key: 'email', placeholder: 'Email address' },
                { label: 'Phone',     key: 'phone', placeholder: 'Phone number' },
              ].map(f => (
                <div key={f.key} className="form-group">
                  <label className="form-label">{f.label}</label>
                  {editMode
                    ? <input className="form-inp" value={profile[f.key]}
                        onChange={e => setProfile({ ...profile, [f.key]: e.target.value })}
                        placeholder={f.placeholder} />
                    : <div style={{
                        padding: '9px 12px', background: 'var(--surface)', borderRadius: 9,
                        fontSize: 13, color: profile[f.key] ? 'var(--text)' : 'var(--muted)',
                        border: '1.5px solid var(--border)',
                      }}>
                        {profile[f.key] || '—'}
                      </div>
                  }
                </div>
              ))}
              {editMode && (
                <button className="cancel-btn" style={{ padding: '7px 16px', alignSelf: 'flex-start' }}
                  onClick={() => { setEditMode(false); setProfile({ name: user.name, email: user.email, phone: user.phone || '' }); }}>
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Account summary */}
          <div className="pcard">
            <div className="pcard-hdr"><div className="pcard-title">Account Summary</div></div>
            <div className="pcard-body">
              {[
                { k: 'Account ID',    v: user._id?.slice(-8).toUpperCase() || '—' },
                { k: 'Total Filed',   v: stats.total },
                { k: 'Resolved',      v: stats.resolved },
                { k: 'Active',        v: stats.pending + stats.inProgress },
                { k: 'Resolution Rate', v: stats.total ? `${Math.round(stats.resolved / stats.total * 100)}%` : '—' },
              ].map(r => (
                <div key={r.k} className="info-row">
                  <div className="info-key">{r.k}</div>
                  <div className="info-val" style={{ color: 'var(--accent-dark)' }}>{r.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Danger zone */}
          <div className="pcard danger-card">
            <div className="pcard-hdr">
              <div className="pcard-title" style={{ color: '#dc2626' }}>⚠️ Danger Zone</div>
            </div>
            <div className="pcard-body">
              <div style={{ fontSize: 12.5, color: 'var(--text2)', marginBottom: 10 }}>
                Sign out from all devices
              </div>
              <button className="logout-pill" onClick={logout}>
                <Icon d={Icons.logout} size={12} stroke="#dc2626" /> Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change password */}
      <div className="pcard">
        <div className="pcard-hdr"><div className="pcard-title">🔒 Change Password</div></div>
        <div className="pcard-body">
          <form onSubmit={changePassword}>
            <div className="form-grid">
              <div className="form-group form-full">
                <label className="form-label">Current Password</label>
                <input className="form-inp" type="password" placeholder="Enter current password"
                  value={pwd.current} onChange={e => setPwd({ ...pwd, current: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input className="form-inp" type="password" placeholder="Min 6 characters"
                  value={pwd.newPwd} onChange={e => setPwd({ ...pwd, newPwd: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input className="form-inp" type="password" placeholder="Re-enter new password"
                  value={pwd.confirm} onChange={e => setPwd({ ...pwd, confirm: e.target.value })} required />
              </div>
            </div>

            {pwdMsg && (
              <div className={`pwd-msg ${pwdMsg.startsWith('success') ? 'ok' : 'err'}`}>
                {pwdMsg.startsWith('success') ? '✓' : '⚠'} {pwdMsg.split(':')[1]}
              </div>
            )}

            <div className="form-btns">
              <button type="submit" className="submit-btn" disabled={pwdLoading}>
                <Icon d={Icons.shield} size={14} />
                {pwdLoading ? 'Updating…' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}