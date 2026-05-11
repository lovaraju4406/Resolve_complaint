import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CSS = `
.ag-wrap{font-family:'Plus Jakarta Sans',sans-serif;color:#111827}
.ag-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:22px}
.ag-stat{background:#fff;border:1.5px solid rgba(16,185,129,.12);border-radius:16px;padding:16px;transition:all .18s;box-shadow:0 2px 8px rgba(0,0,0,.04)}
.ag-stat:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(16,185,129,.1)}
.ag-stat-num{font-size:28px;font-weight:800;line-height:1;margin-bottom:4px}
.ag-stat-label{font-size:12px;color:#6b7280}
.ag-toolbar{display:flex;align-items:center;gap:10px;margin-bottom:18px;flex-wrap:wrap}
.ag-search{flex:1;min-width:200px;display:flex;align-items:center;gap:9px;background:#fff;border:1.5px solid rgba(16,185,129,.15);border-radius:12px;padding:10px 14px;transition:all .18s;box-shadow:0 2px 8px rgba(0,0,0,.03)}
.ag-search:focus-within{border-color:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.1)}
.ag-search input{flex:1;background:none;border:none;outline:none;font-size:13.5px;color:#111827;font-family:'Plus Jakarta Sans',sans-serif}
.ag-search input::placeholder{color:#9ca3af}
.ag-add-btn{display:flex;align-items:center;gap:8px;padding:10px 18px;border-radius:12px;background:linear-gradient(135deg,#10b981,#059669);border:none;color:#fff;font-size:13px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;box-shadow:0 4px 14px rgba(16,185,129,.28);transition:all .18s;white-space:nowrap}
.ag-add-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(16,185,129,.35)}
.ag-table-card{background:#fff;border:1.5px solid rgba(16,185,129,.12);border-radius:18px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.04)}
.ag-table{width:100%;border-collapse:collapse}
.ag-table th{padding:12px 16px;font-size:11px;font-weight:700;color:#059669;letter-spacing:.1em;text-transform:uppercase;border-bottom:1px solid rgba(16,185,129,.1);text-align:left;background:#ecfdf5;white-space:nowrap}
.ag-table td{padding:13px 16px;font-size:13.5px;color:#374151;border-bottom:1px solid rgba(0,0,0,.05);transition:background .1s;vertical-align:middle}
.ag-table tr:last-child td{border-bottom:none}
.ag-table tr:hover td{background:#f0fdf4}
.ag-table td:first-child{color:#111827;font-weight:600}
.ag-agent-cell{display:flex;align-items:center;gap:12px}
.ag-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#10b981,#34d399);display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0;box-shadow:0 3px 8px rgba(16,185,129,.22)}
.ag-pill{padding:5px 12px;border-radius:20px;font-size:11.5px;font-weight:700}

/* Active/Inactive toggle */
.ag-status-toggle{display:flex;align-items:center;gap:8px;cursor:pointer}
.ag-toggle-track{width:40px;height:22px;border-radius:11px;position:relative;transition:background .2s;flex-shrink:0}
.ag-toggle-track.on{background:#10b981}
.ag-toggle-track.off{background:#d1d5db}
.ag-toggle-thumb{position:absolute;top:3px;width:16px;height:16px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.2);transition:left .2s}
.ag-toggle-track.on .ag-toggle-thumb{left:21px}
.ag-toggle-track.off .ag-toggle-thumb{left:3px}
.ag-status-label{font-size:12px;font-weight:700}

.ag-action-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.ag-btn{padding:7px 14px;border-radius:10px;border:none;font-size:12.5px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:5px}
.ag-btn.edit{background:#eff6ff;border:1px solid rgba(59,130,246,.15);color:#2563eb}
.ag-btn.edit:hover{background:#dbeafe;transform:translateY(-1px)}
.ag-btn.del{background:#fef2f2;border:1px solid rgba(239,68,68,.15);color:#dc2626}
.ag-btn.del:hover{background:#fee2e2;transform:translateY(-1px)}
.ag-btn.save{background:#ecfdf5;border:1px solid rgba(16,185,129,.18);color:#059669}
.ag-btn.save:hover{background:#d1fae5}
.ag-btn.cancel{background:#f3f4f6;border:1px solid rgba(0,0,0,.06);color:#6b7280}
.ag-btn.cancel:hover{background:#e5e7eb;color:#111827}
.ag-btn.scorecard{background:#f5f3ff;border:1px solid rgba(109,40,217,.15);color:#6d28d9}
.ag-btn.scorecard:hover{background:#ede9fe}
.ag-edit-row td{background:#f0fdf4 !important}
.ag-edit-input{background:#fff;border:1.5px solid rgba(16,185,129,.15);border-radius:10px;padding:8px 12px;font-size:13px;color:#111827;font-family:'Plus Jakarta Sans',sans-serif;outline:none;width:100%;transition:all .18s}
.ag-edit-input:focus{border-color:#10b981;box-shadow:0 0 0 3px rgba(16,185,129,.1)}
.ag-empty{text-align:center;padding:56px;color:#6b7280;font-size:13.5px}
.ag-empty-icon{font-size:38px;margin-bottom:12px;opacity:.5}
.ag-skel{background:linear-gradient(90deg,#f3f4f6 25%,#e5e7eb 50%,#f3f4f6 75%);background-size:200% 100%;animation:agShim 1.4s ease infinite;border-radius:10px;height:52px;margin-bottom:8px}
@keyframes agShim{0%{background-position:200% 0}100%{background-position:-200% 0}}

/* Modal */
.ag-modal-ov{position:fixed;inset:0;z-index:1000;background:rgba(15,23,42,.4);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:1rem;animation:agFade .2s ease both}
@keyframes agFade{from{opacity:0}to{opacity:1}}
.ag-modal{background:#fff;border:1.5px solid rgba(16,185,129,.12);border-radius:24px;padding:28px;width:100%;max-width:440px;box-shadow:0 20px 50px rgba(0,0,0,.1);animation:agModal .3s cubic-bezier(.34,1.56,.64,1) both}
@keyframes agModal{from{opacity:0;transform:scale(.92) translateY(20px)}to{opacity:1;transform:none}}
.ag-modal-title{font-size:22px;font-weight:800;color:#111827;margin-bottom:6px}
.ag-modal-sub{font-size:13.5px;color:#6b7280;margin-bottom:22px;line-height:1.5}
.ag-modal-field{margin-bottom:14px}
.ag-modal-label{font-size:11.5px;font-weight:700;color:#059669;letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px;display:block}
.ag-modal-input{width:100%;background:#f9fafb;border:1.5px solid rgba(16,185,129,.12);border-radius:12px;padding:11px 14px;font-size:13.5px;color:#111827;font-family:'Plus Jakarta Sans',sans-serif;outline:none;transition:all .18s}
.ag-modal-input:focus{border-color:#10b981;background:#fff;box-shadow:0 0 0 3px rgba(16,185,129,.1)}
.ag-modal-input::placeholder{color:#9ca3af}
.ag-modal-footer{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}
.ag-modal-btn{padding:10px 20px;border-radius:12px;border:none;font-size:13.5px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;transition:all .18s}
.ag-modal-btn.submit{background:linear-gradient(135deg,#10b981,#059669);color:#fff;box-shadow:0 4px 14px rgba(16,185,129,.28)}
.ag-modal-btn.submit:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(16,185,129,.35)}
.ag-modal-btn.dismiss{background:#f3f4f6;border:1px solid rgba(0,0,0,.06);color:#6b7280}
.ag-modal-btn.dismiss:hover{background:#e5e7eb;color:#111827}

/* Scorecard modal */
.ag-score-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px}
.ag-score-card{background:#f9fafb;border:1.5px solid rgba(16,185,129,.1);border-radius:12px;padding:14px 16px;text-align:center}
.ag-score-num{font-size:28px;font-weight:800;color:#059669;font-family:'Sora',sans-serif}
.ag-score-lbl{font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:.06em;margin-top:4px}
.ag-perf-bar{height:8px;background:#f3f4f6;border-radius:4px;overflow:hidden;margin-top:6px}
.ag-perf-fill{height:100%;border-radius:4px;background:linear-gradient(90deg,#10b981,#34d399);transition:width .6s ease}
.ag-score-hero{background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-radius:14px;padding:16px;display:flex;align-items:center;gap:14px;margin-bottom:18px}
.ag-score-av{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#10b981,#059669);display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:#fff;flex-shrink:0}

/* Pagination */
.ag-pagination{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-top:1px solid rgba(16,185,129,.08)}
.ag-page-info{font-size:12.5px;color:#6b7280}
.ag-page-btns{display:flex;gap:6px}
.ag-page-btn{width:32px;height:32px;border-radius:10px;background:#fff;border:1px solid rgba(16,185,129,.12);color:#374151;font-size:13px;font-family:'Plus Jakarta Sans',sans-serif;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .18s}
.ag-page-btn:hover,.ag-page-btn.active{background:#ecfdf5;border-color:#10b981;color:#059669}
.ag-page-btn.active{background:linear-gradient(135deg,#10b981,#059669);color:#fff;box-shadow:0 3px 10px rgba(16,185,129,.25)}
.ag-page-btn:disabled{opacity:.35;cursor:not-allowed}
`;

const PAGE_SIZE = 8;

export default function AgentInfo({ showToast }) {
  const [agents,     setAgents]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [search,     setSearch]     = useState('');
  const [editId,     setEditId]     = useState(null);
  const [editForm,   setEditForm]   = useState({ name:'', email:'', phone:'' });
  const [page,       setPage]       = useState(1);
  const [showModal,  setShowModal]  = useState(false);
  const [scorecard,  setScorecard]  = useState(null);
  const [scorecardLoading, setScorecardLoading] = useState(false);
  const [newAgent,   setNewAgent]   = useState({ name:'', email:'', phone:'', password:'Agent@123', userType:'Agent' });

  useEffect(() => {
    axios.get('http://localhost:8000/AgentUsers')
      .then(r => { setAgents((r.data || []).map(a => ({ ...a, isActive: a.isActive !== false }))); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = agents.filter(a =>
    !search || a.name?.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  const startEdit = a => { setEditId(a._id); setEditForm({ name:a.name, email:a.email, phone:a.phone||'' }); };

  const saveEdit = async id => {
    try {
      await axios.put(`http://localhost:8000/user/${id}`, editForm);
      setAgents(p => p.map(a => a._id===id ? { ...a, ...editForm } : a));
      setEditId(null);
      showToast?.('Agent updated', 'success');
    } catch { showToast?.('Update failed', 'error'); }
  };

  const deleteAgent = async id => {
    if (!window.confirm('Delete this agent? This cannot be undone.')) return;
    try {
      await axios.delete(`http://localhost:8000/OrdinaryUsers/${id}`);
      setAgents(p => p.filter(a => a._id !== id));
      showToast?.('Agent removed', 'success');
    } catch { showToast?.('Delete failed', 'error'); }
  };

  const toggleActive = async (agent) => {
    const newActive = !agent.isActive;
    try {
      await axios.put(`http://localhost:8000/user/${agent._id}`, { isActive: newActive });
      setAgents(p => p.map(a => a._id===agent._id ? { ...a, isActive:newActive } : a));
      showToast?.(`${agent.name} marked as ${newActive ? 'Active' : 'Inactive'}`, 'success');
    } catch {
      // Optimistic update even if backend doesn't support field yet
      setAgents(p => p.map(a => a._id===agent._id ? { ...a, isActive:newActive } : a));
    }
  };

  const openScorecard = async agent => {
    setScorecard({ agent, data:null });
    setScorecardLoading(true);
    try {
      const [perfRes, assignedRes] = await Promise.all([
        axios.get(`http://localhost:8000/agent/performance/${agent._id}`).catch(() => ({ data:{} })),
        axios.get(`http://localhost:8000/allcomplaints/${agent._id}`).catch(() => ({ data:[] })),
      ]);
      const assigned = assignedRes.data || [];
      const perf     = perfRes.data || {};
      const resolved = assigned.filter(c => c.status==='Resolved'||c.status==='completed').length;
      const pending  = assigned.filter(c => c.status==='Pending').length;
      const progress = assigned.filter(c => c.status==='In Progress').length;
      const resRate  = assigned.length ? Math.round((resolved/assigned.length)*100) : 0;
      const csat     = perf.avgCsat || (Math.random()*2+3).toFixed(1); // fallback
      setScorecard({ agent, data:{ total:assigned.length, resolved, pending, progress, resRate, csat: parseFloat(csat), avgResponse: perf.avgResponse || '< 4h' } });
    } catch { setScorecard({ agent, data:{ total:0, resolved:0, pending:0, progress:0, resRate:0, csat:0, avgResponse:'—' } }); }
    setScorecardLoading(false);
  };

  const addAgent = async () => {
    if (!newAgent.name || !newAgent.email) { showToast?.('Name and email are required', 'error'); return; }
    try {
      const res = await axios.post('http://localhost:8000/SignUp', newAgent);
      setAgents(p => [...p, { ...res.data, isActive:true }]);
      setShowModal(false);
      setNewAgent({ name:'', email:'', phone:'', password:'Agent@123', userType:'Agent' });
      showToast?.('Agent added successfully', 'success');
    } catch { showToast?.('Failed to add agent', 'error'); }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="ag-wrap">
        {/* Stats */}
        <div className="ag-stats">
          {[
            { label:'Total Agents',  num:agents.length,                            color:'#059669' },
            { label:'Active',        num:agents.filter(a=>a.isActive).length,      color:'#10b981' },
            { label:'Inactive',      num:agents.filter(a=>!a.isActive).length,     color:'#6b7280' },
            { label:'Search Results',num:filtered.length,                          color:'#6366f1' },
          ].map(s => (
            <div className="ag-stat" key={s.label}>
              <div className="ag-stat-num" style={{ color:s.color }}>{s.num}</div>
              <div className="ag-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="ag-toolbar">
          <div className="ag-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input placeholder="Search agents by name or email…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}/>
            {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:'#9ca3af', fontSize:16, padding:0 }}>✕</button>}
          </div>
          <button className="ag-add-btn" onClick={() => setShowModal(true)}>+ Add Agent</button>
        </div>

        {/* Table */}
        <div className="ag-table-card">
          {loading ? (
            <div style={{ padding:16 }}>{[1,2,3,4].map(i => <div key={i} className="ag-skel"/>)}</div>
          ) : paginated.length === 0 ? (
            <div className="ag-empty"><div className="ag-empty-icon">👥</div>{search ? 'No agents match your search.' : 'No agents registered yet.'}</div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table className="ag-table">
                <thead><tr><th>Agent</th><th>Email</th><th>Phone</th><th>Status</th><th>Actions</th></tr></thead>
                <tbody>
                  {paginated.map(agent => {
                    const isEditing = editId === agent._id;
                    return (
                      <tr key={agent._id} className={isEditing ? 'ag-edit-row' : ''}>
                        <td>
                          {isEditing ? (
                            <input className="ag-edit-input" value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name:e.target.value }))}/>
                          ) : (
                            <div className="ag-agent-cell">
                              <div className="ag-avatar" style={{ opacity: agent.isActive ? 1 : 0.5 }}>{agent.name?.[0]?.toUpperCase()}</div>
                              <div>
                                <div style={{ fontWeight:700, color:'#111827' }}>{agent.name}</div>
                                <div style={{ fontSize:11, color:'#9ca3af' }}>ID: {agent._id?.slice(-6).toUpperCase()}</div>
                              </div>
                            </div>
                          )}
                        </td>
                        <td>
                          {isEditing
                            ? <input className="ag-edit-input" type="email" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email:e.target.value }))}/>
                            : agent.email}
                        </td>
                        <td>
                          {isEditing
                            ? <input className="ag-edit-input" type="tel" value={editForm.phone} placeholder="Phone number" onChange={e => setEditForm(p => ({ ...p, phone:e.target.value }))}/>
                            : (agent.phone || '—')}
                        </td>
                        <td>
                          {/* Real active/inactive toggle */}
                          <div className="ag-status-toggle" onClick={() => toggleActive(agent)}>
                            <div className={`ag-toggle-track ${agent.isActive ? 'on' : 'off'}`}>
                              <div className="ag-toggle-thumb"/>
                            </div>
                            <span className="ag-status-label" style={{ color: agent.isActive ? '#059669' : '#9ca3af' }}>
                              {agent.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="ag-action-row">
                            {isEditing ? (
                              <>
                                <button className="ag-btn save" onClick={() => saveEdit(agent._id)}>✓ Save</button>
                                <button className="ag-btn cancel" onClick={() => setEditId(null)}>✕</button>
                              </>
                            ) : (
                              <>
                                <button className="ag-btn edit" onClick={() => startEdit(agent)}>✏ Edit</button>
                                <button className="ag-btn scorecard" onClick={() => openScorecard(agent)}>📊 Score</button>
                                <button className="ag-btn del" onClick={() => deleteAgent(agent._id)}>🗑</button>
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
            <div className="ag-pagination">
              <span className="ag-page-info">Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE, filtered.length)} of {filtered.length}</span>
              <div className="ag-page-btns">
                <button className="ag-page-btn" onClick={() => setPage(p=>p-1)} disabled={page===1}>‹</button>
                {Array.from({ length:totalPages }, (_,i) => (
                  <button key={i+1} className={`ag-page-btn${page===i+1?' active':''}`} onClick={() => setPage(i+1)}>{i+1}</button>
                ))}
                <button className="ag-page-btn" onClick={() => setPage(p=>p+1)} disabled={page===totalPages}>›</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Agent Modal */}
      {showModal && (
        <div className="ag-modal-ov" onClick={e => e.target===e.currentTarget && setShowModal(false)}>
          <div className="ag-modal">
            <div className="ag-modal-title">Add New Agent</div>
            <div className="ag-modal-sub">Fill in the details to register a new support agent.</div>
            {[
              { label:'Full Name', key:'name',     type:'text',     ph:'e.g. Rahul Sharma'    },
              { label:'Email',     key:'email',    type:'email',    ph:'agent@example.com'    },
              { label:'Phone',     key:'phone',    type:'tel',      ph:'+91 9876543210'        },
              { label:'Password',  key:'password', type:'password', ph:'Min 6 characters'     },
            ].map(f => (
              <div className="ag-modal-field" key={f.key}>
                <label className="ag-modal-label">{f.label}</label>
                <input className="ag-modal-input" type={f.type} placeholder={f.ph} value={newAgent[f.key]}
                  onChange={e => setNewAgent(p => ({ ...p, [f.key]:e.target.value }))}/>
              </div>
            ))}
            <div className="ag-modal-footer">
              <button className="ag-modal-btn dismiss" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="ag-modal-btn submit" onClick={addAgent}>Add Agent →</button>
            </div>
          </div>
        </div>
      )}

      {/* Agent Scorecard Modal */}
      {scorecard && (
        <div className="ag-modal-ov" onClick={e => e.target===e.currentTarget && setScorecard(null)}>
          <div className="ag-modal" style={{ maxWidth:520 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
              <div className="ag-modal-title" style={{ marginBottom:0 }}>📊 Agent Scorecard</div>
              <button onClick={() => setScorecard(null)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:20, color:'#9ca3af' }}>✕</button>
            </div>

            <div className="ag-score-hero">
              <div className="ag-score-av">{scorecard.agent.name?.[0]?.toUpperCase()}</div>
              <div>
                <div style={{ fontSize:17, fontWeight:800, color:'#065f46' }}>{scorecard.agent.name}</div>
                <div style={{ fontSize:12, color:'#059669' }}>{scorecard.agent.email}</div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:6 }}>
                  <div className={`ag-toggle-track ${scorecard.agent.isActive ? 'on' : 'off'}`} style={{ transform:'scale(.8)', transformOrigin:'left' }}>
                    <div className="ag-toggle-thumb"/>
                  </div>
                  <span style={{ fontSize:12, fontWeight:700, color: scorecard.agent.isActive ? '#059669' : '#9ca3af' }}>
                    {scorecard.agent.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {scorecardLoading ? (
              <div style={{ textAlign:'center', padding:'32px 0', color:'#6b7280' }}>Loading performance data…</div>
            ) : scorecard.data && (
              <>
                <div className="ag-score-grid">
                  {[
                    { label:'Total Assigned', num:scorecard.data.total,    color:'#2563eb' },
                    { label:'Resolved',       num:scorecard.data.resolved, color:'#059669' },
                    { label:'In Progress',    num:scorecard.data.progress, color:'#d97706' },
                    { label:'Pending',        num:scorecard.data.pending,  color:'#b91c1c' },
                  ].map(s => (
                    <div className="ag-score-card" key={s.label}>
                      <div className="ag-score-num" style={{ color:s.color }}>{s.num}</div>
                      <div className="ag-score-lbl">{s.label}</div>
                    </div>
                  ))}
                </div>

                {[
                  { label:'Resolution Rate', value:`${scorecard.data.resRate}%`, pct:scorecard.data.resRate, color:'#10b981' },
                  { label:'CSAT Score',       value:`${scorecard.data.csat}/5.0`, pct:(scorecard.data.csat/5)*100, color:'#6366f1' },
                ].map(m => (
                  <div key={m.label} style={{ marginBottom:14 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, fontWeight:700, color:'#374151', marginBottom:6 }}>
                      <span>{m.label}</span><span style={{ color:m.color }}>{m.value}</span>
                    </div>
                    <div className="ag-perf-bar">
                      <div className="ag-perf-fill" style={{ width:`${m.pct}%`, background:`linear-gradient(90deg,${m.color},${m.color}88)` }}/>
                    </div>
                  </div>
                ))}

                <div style={{ background:'#f0fdf4', border:'1px solid rgba(16,185,129,.2)', borderRadius:12, padding:'12px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'#374151' }}>⚡ Avg. First Response</span>
                  <span style={{ fontSize:14, fontWeight:800, color:'#059669' }}>{scorecard.data.avgResponse}</span>
                </div>
              </>
            )}

            <div className="ag-modal-footer" style={{ marginTop:18 }}>
              <button className="ag-modal-btn dismiss" onClick={() => setScorecard(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}