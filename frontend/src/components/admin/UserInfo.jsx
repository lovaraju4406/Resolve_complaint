import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CSS = `
.ui-wrap{font-family:'Plus Jakarta Sans',sans-serif;color:#111827}
.ui-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:22px}
.ui-stat{background:#fff;border:1.5px solid rgba(16,185,129,.12);border-radius:16px;padding:16px;transition:all .18s;box-shadow:0 2px 8px rgba(0,0,0,.04)}
.ui-stat:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(16,185,129,.1)}
.ui-stat-num{font-size:28px;font-weight:800;line-height:1;margin-bottom:4px}
.ui-stat-label{font-size:12px;color:#6b7280}
.ui-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap}
.ui-search{flex:1;min-width:200px;display:flex;align-items:center;gap:9px;background:#fff;border:1.5px solid rgba(16,185,129,.12);border-radius:12px;padding:10px 14px;transition:all .18s;box-shadow:0 2px 8px rgba(0,0,0,.03)}
.ui-search:focus-within{border-color:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.1)}
.ui-search input{flex:1;background:none;border:none;outline:none;font-size:13.5px;color:#111827;font-family:'Plus Jakarta Sans',sans-serif}
.ui-search input::placeholder{color:#9ca3af}
.ui-filter-select{padding:10px 14px;border-radius:12px;background:#fff;border:1.5px solid rgba(16,185,129,.12);font-size:13px;color:#374151;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;outline:none;transition:all .18s}
.ui-filter-select:focus{border-color:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.1)}
.ui-filter-select option{background:#fff;color:#111827}
.ui-count{font-size:12px;color:#6b7280;white-space:nowrap;margin-left:auto}
.ui-table-card{background:#fff;border:1.5px solid rgba(16,185,129,.12);border-radius:18px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.04)}
.ui-table{width:100%;border-collapse:collapse}
.ui-table th{padding:12px 16px;font-size:11px;font-weight:700;color:#059669;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid rgba(16,185,129,.1);text-align:left;background:#ecfdf5;white-space:nowrap;cursor:pointer;user-select:none}
.ui-table th:hover{color:#047857}
.ui-table td{padding:14px 16px;font-size:13.5px;color:#374151;border-bottom:1px solid rgba(0,0,0,.05);transition:background .1s;vertical-align:middle}
.ui-table tr:last-child td{border-bottom:none}
.ui-table tr:hover td{background:#f0fdf4}
.ui-user-cell{display:flex;align-items:center;gap:12px}
.ui-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#10b981,#34d399);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0;box-shadow:0 3px 8px rgba(16,185,129,.2)}
.ui-user-name{font-size:13.5px;font-weight:700;color:#111827}
.ui-user-id{font-size:11px;color:#9ca3af;font-family:'DM Mono',monospace}
.ui-pill{padding:5px 12px;border-radius:20px;font-size:11.5px;font-weight:700}
.ui-actions{display:flex;gap:8px;align-items:center}
.ui-btn{padding:7px 14px;border-radius:10px;border:none;font-size:12.5px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:5px}
.ui-btn.edit{background:#eff6ff;border:1px solid rgba(59,130,246,.15);color:#2563eb}
.ui-btn.edit:hover{background:#dbeafe;transform:translateY(-1px)}
.ui-btn.del{background:#fef2f2;border:1px solid rgba(239,68,68,.15);color:#dc2626}
.ui-btn.del:hover{background:#fee2e2;transform:translateY(-1px)}
.ui-btn.save{background:#ecfdf5;border:1px solid rgba(16,185,129,.15);color:#059669}
.ui-btn.save:hover{background:#d1fae5}
.ui-btn.cancel{background:#f3f4f6;border:1px solid rgba(0,0,0,.06);color:#6b7280}
.ui-btn.cancel:hover{background:#e5e7eb;color:#111827}
.ui-edit-row td{background:#f0fdf4 !important}
.ui-edit-input{background:#fff;border:1.5px solid rgba(16,185,129,.15);border-radius:10px;padding:8px 12px;font-size:13px;color:#111827;font-family:'Plus Jakarta Sans',sans-serif;outline:none;width:100%;min-width:120px;transition:all .18s}
.ui-edit-input:focus{border-color:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.1)}
.ui-empty{text-align:center;padding:56px;color:#6b7280;font-size:13.5px}
.ui-empty-icon{font-size:40px;margin-bottom:10px;opacity:.5}
.ui-skel{background:linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%);background-size:200% 100%;animation:uiShim 1.4s ease infinite;border-radius:10px;height:52px;margin-bottom:8px}
@keyframes uiShim{0%{background-position:200% 0}100%{background-position:-200% 0}}
.ui-pagination{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-top:1px solid rgba(16,185,129,.08)}
.ui-page-info{font-size:12.5px;color:#6b7280}
.ui-page-btns{display:flex;gap:6px}
.ui-page-btn{width:32px;height:32px;border-radius:10px;background:#fff;border:1px solid rgba(16,185,129,.12);color:#374151;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .18s}
.ui-page-btn:hover,.ui-page-btn.active{background:#ecfdf5;border-color:#10b981;color:#059669}
.ui-page-btn.active{background:linear-gradient(135deg,#10b981,#059669);color:#fff;box-shadow:0 3px 10px rgba(16,185,129,.25)}
.ui-page-btn:disabled{opacity:.35;cursor:not-allowed}

/* ─── Confirm Delete Modal (FIXED) ─── */
.ui-confirm-ov{
  position:fixed;inset:0;z-index:1000;
  background:rgba(15,23,42,.4);backdrop-filter:blur(6px);
  display:flex;align-items:center;justify-content:center;
  padding:1rem;animation:uiFade .2s ease both;
}
@keyframes uiFade{from{opacity:0}to{opacity:1}}
.ui-confirm{
  background:#fff;border:1.5px solid rgba(220,38,38,.18);
  border-radius:22px;padding:30px;width:100%;max-width:390px;
  box-shadow:0 20px 50px rgba(0,0,0,.1);
  animation:uiModal .3s cubic-bezier(.34,1.56,.64,1) both;
}
@keyframes uiModal{from{opacity:0;transform:scale(.92) translateY(20px)}to{opacity:1;transform:none}}
.ui-confirm-icon{font-size:40px;text-align:center;margin-bottom:14px}
.ui-confirm-title{font-size:20px;font-weight:800;color:#111827;margin-bottom:7px;text-align:center}
.ui-confirm-msg{font-size:13.5px;color:#6b7280;text-align:center;line-height:1.65;margin-bottom:24px}
.ui-confirm-footer{display:flex;gap:10px}
.ui-confirm-btn{flex:1;padding:12px;border-radius:12px;border:none;font-size:13.5px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .18s}
.ui-confirm-btn.cancel-btn{background:#f3f4f6;border:1.5px solid #e5e7eb;color:#6b7280}
.ui-confirm-btn.cancel-btn:hover{background:#e5e7eb;color:#111827}
.ui-confirm-btn.del-btn{background:linear-gradient(135deg,#ef4444,#dc2626);color:#fff;box-shadow:0 4px 14px rgba(239,68,68,.3)}
.ui-confirm-btn.del-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(239,68,68,.4)}
`;

const PAGE_SIZE = 8;
const ROLE_COLORS = {
  Ordinary: { bg:'rgba(59,130,246,.1)',  color:'#2563eb', border:'rgba(59,130,246,.2)'  },
  Agent:    { bg:'rgba(99,102,241,.1)',  color:'#6366f1', border:'rgba(99,102,241,.2)'  },
  Admin:    { bg:'rgba(245,158,11,.1)',  color:'#d97706', border:'rgba(245,158,11,.2)'  },
};

export default function UserInfo({ showToast }) {
  const [users,      setUsers]      = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [editId,     setEditId]     = useState(null);
  const [editForm,   setEditForm]   = useState({ name:'', email:'', phone:'' });
  const [page,       setPage]       = useState(1);
  const [confirmId,  setConfirmId]  = useState(null);
  const [sortKey,    setSortKey]    = useState('name');
  const [sortDir,    setSortDir]    = useState(1);

  useEffect(() => {
    axios.get('http://localhost:8000/OrdinaryUsers')
      .then(r => { setUsers(r.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSort = key => {
    if (sortKey === key) setSortDir(d => -d);
    else { setSortKey(key); setSortDir(1); }
  };

  const filtered = users
    .filter(u => {
      const matchSearch = !search ||
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search);
      const matchRole = roleFilter === 'All' || u.userType === roleFilter;
      return matchSearch && matchRole;
    })
    .sort((a, b) => {
      const av = (a[sortKey] || '').toLowerCase();
      const bv = (b[sortKey] || '').toLowerCase();
      return av < bv ? -sortDir : av > bv ? sortDir : 0;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const startEdit = user => { setEditId(user._id); setEditForm({ name:user.name, email:user.email, phone:user.phone||'' }); };

  const saveEdit = async id => {
    try {
      await axios.put(`http://localhost:8000/user/${id}`, editForm);
      setUsers(p => p.map(u => u._id===id ? { ...u, ...editForm } : u));
      setEditId(null);
      showToast?.('User updated successfully', 'success');
    } catch { showToast?.('Update failed', 'error'); }
  };

  const deleteUser = async () => {
    try {
      await axios.delete(`http://localhost:8000/OrdinaryUsers/${confirmId}`);
      setUsers(p => p.filter(u => u._id !== confirmId));
      setConfirmId(null);
      showToast?.('User deleted', 'success');
    } catch { showToast?.('Delete failed', 'error'); setConfirmId(null); }
  };

  const SortIcon = ({ col }) => (
    <span style={{ marginLeft:4, opacity:sortKey===col?1:.3 }}>
      {sortKey===col ? (sortDir===1?'↑':'↓') : '↕'}
    </span>
  );

  return (
    <>
      <style>{CSS}</style>
      <div className="ui-wrap">
        {/* Stats */}
        <div className="ui-stats">
          {[
            { label:'Total Users', num:users.length,                                        color:'#2563eb' },
            { label:'Ordinary',    num:users.filter(u=>u.userType==='Ordinary').length,     color:'#6366f1' },
            { label:'Agents',      num:users.filter(u=>u.userType==='Agent').length,        color:'#059669' },
            { label:'Admins',      num:users.filter(u=>u.userType==='Admin').length,        color:'#d97706' },
          ].map(s => (
            <div className="ui-stat" key={s.label}>
              <div className="ui-stat-num" style={{ color:s.color }}>{s.num}</div>
              <div className="ui-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="ui-toolbar">
          <div className="ui-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search by name, email, phone…" value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}/>
            {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:16, padding:0 }}>✕</button>}
          </div>
          <select className="ui-filter-select" value={roleFilter} onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="All">All Roles</option>
            <option value="Ordinary">Ordinary</option>
            <option value="Agent">Agent</option>
            <option value="Admin">Admin</option>
          </select>
          <span className="ui-count">{filtered.length} user{filtered.length!==1?'s':''}</span>
        </div>

        {/* Table */}
        <div className="ui-table-card">
          {loading ? (
            <div style={{ padding:16 }}>{[1,2,3,4,5].map(i => <div key={i} className="ui-skel"/>)}</div>
          ) : paginated.length === 0 ? (
            <div className="ui-empty"><div className="ui-empty-icon">👤</div>{search||roleFilter!=='All' ? 'No users match your filters.' : 'No users registered yet.'}</div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table className="ui-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')}>User <SortIcon col="name"/></th>
                    <th onClick={() => handleSort('email')}>Email <SortIcon col="email"/></th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(user => {
                    const isEditing  = editId === user._id;
                    const roleStyle  = ROLE_COLORS[user.userType] || ROLE_COLORS.Ordinary;
                    return (
                      <tr key={user._id} className={isEditing ? 'ui-edit-row' : ''}>
                        <td>
                          {isEditing ? (
                            <input className="ui-edit-input" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name:e.target.value }))}/>
                          ) : (
                            <div className="ui-user-cell">
                              <div className="ui-avatar">{user.name?.[0]?.toUpperCase()}</div>
                              <div>
                                <div className="ui-user-name">{user.name}</div>
                                <div className="ui-user-id">#{user._id?.slice(-6).toUpperCase()}</div>
                              </div>
                            </div>
                          )}
                        </td>
                        <td>
                          {isEditing
                            ? <input className="ui-edit-input" type="email" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email:e.target.value }))}/>
                            : user.email}
                        </td>
                        <td>
                          {isEditing
                            ? <input className="ui-edit-input" type="tel" value={editForm.phone} placeholder="Phone" onChange={e => setEditForm(p => ({ ...p, phone:e.target.value }))}/>
                            : (user.phone || '—')}
                        </td>
                        <td>
                          <span className="ui-pill" style={{ background:roleStyle.bg, color:roleStyle.color, border:`1px solid ${roleStyle.border}` }}>
                            {user.userType || 'Ordinary'}
                          </span>
                        </td>
                        <td>
                          <div className="ui-actions">
                            {isEditing ? (
                              <>
                                <button className="ui-btn save" onClick={() => saveEdit(user._id)}>✓ Save</button>
                                <button className="ui-btn cancel" onClick={() => setEditId(null)}>✕</button>
                              </>
                            ) : (
                              <>
                                <button className="ui-btn edit" onClick={() => startEdit(user)}>✏ Edit</button>
                                <button className="ui-btn del" onClick={() => setConfirmId(user._id)}>🗑 Delete</button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {totalPages > 1 && (
            <div className="ui-pagination">
              <span className="ui-page-info">Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</span>
              <div className="ui-page-btns">
                <button className="ui-page-btn" onClick={() => setPage(p=>p-1)} disabled={page===1}>‹</button>
                {Array.from({ length:totalPages }, (_,i) => (
                  <button key={i+1} className={`ui-page-btn${page===i+1?' active':''}`} onClick={() => setPage(i+1)}>{i+1}</button>
                ))}
                <button className="ui-page-btn" onClick={() => setPage(p=>p+1)} disabled={page===totalPages}>›</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal (fixed CSS) */}
      {confirmId && (
        <div className="ui-confirm-ov" onClick={e => e.target===e.currentTarget && setConfirmId(null)}>
          <div className="ui-confirm">
            <div className="ui-confirm-icon">⚠️</div>
            <div className="ui-confirm-title">Delete User?</div>
            <div className="ui-confirm-msg">
              This will permanently remove the user and all their associated data. This action cannot be undone.
            </div>
            <div className="ui-confirm-footer">
              <button className="ui-confirm-btn cancel-btn" onClick={() => setConfirmId(null)}>Cancel</button>
              <button className="ui-confirm-btn del-btn" onClick={deleteUser}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}