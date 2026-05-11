import React, { useState } from 'react';
import axios from './axiosInstance';
import { Icon, Icons, CAT_EMOJI, getBadgeCls, getPriCls, timeAgo, downloadComplaintPDF, toast } from './userUtils';

export default function UserComplaints({ complaints, setComplaints, setView, setSelectedC, userId }) {
  const [search, setSearch]         = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy]         = useState('newest');
  const [confirmModal, setConfirmModal] = useState(null); // { type: 'cancel'|'reopen', complaint }
  const [pdfLoading, setPdfLoading] = useState({});

  const filtered = complaints
    .filter(c => {
      const q = !search || c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.comment?.toLowerCase().includes(search.toLowerCase()) ||
        c.city?.toLowerCase().includes(search.toLowerCase()) ||
        c._id?.toLowerCase().includes(search.toLowerCase());
      const f = filterStatus === 'All' || c.status === filterStatus ||
        (filterStatus === 'Resolved' && c.status === 'completed');
      return q && f;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'priority') {
        const o = { High: 0, urgent: 0, Medium: 1, Low: 2 };
        return (o[a.priority] ?? 1) - (o[b.priority] ?? 1);
      }
      return 0;
    });

  /* ── Withdraw (cancel) complaint ── */
  const withdrawComplaint = async (c) => {
    try {
      await axios.put(`http://localhost:8000/complaint/${c._id}`, { status: 'Withdrawn', agentName: 'User' });
      setComplaints(prev => prev.map(x => x._id === c._id ? { ...x, status: 'Withdrawn' } : x));
      toast('Complaint withdrawn successfully', 's');
    } catch { toast('Failed to withdraw complaint', 'e'); }
    setConfirmModal(null);
  };

  /* ── Reopen resolved complaint ── */
  const reopenComplaint = async (c) => {
    const daysSince = (Date.now() - new Date(c.updatedAt)) / 86400000;
    if (daysSince > 7) { toast('Reopen window (7 days) has passed', 'e'); return; }
    try {
      await axios.put(`http://localhost:8000/complaint/${c._id}`, {
        status: 'Pending',
        note: 'Reopened by user — issue persists.',
        agentName: 'User',
      });
      setComplaints(prev => prev.map(x => x._id === c._id ? { ...x, status: 'Pending' } : x));
      toast('Complaint reopened', 's');
    } catch { toast('Failed to reopen complaint', 'e'); }
    setConfirmModal(null);
  };

  /* ── Download PDF ── */
  const handlePDF = async (c, e) => {
    e.stopPropagation();
    setPdfLoading(p => ({ ...p, [c._id]: true }));
    // Fetch timeline if available
    let timeline = c.timeline || [];
    if (!timeline.length && c._id) {
      try {
        const res = await axios.get(`http://localhost:8000/complaint/${c._id}/timeline`);
        timeline = res.data || [];
      } catch {}
    }
    await downloadComplaintPDF(c, timeline);
    setPdfLoading(p => ({ ...p, [c._id]: false }));
    toast('PDF downloaded!', 's');
  };

  const canEdit    = (c) => c.status === 'Pending';
  const canCancel  = (c) => c.status === 'Pending' || c.status === 'In Progress';
  const canReopen  = (c) => {
    if (c.status !== 'Resolved' && c.status !== 'completed') return false;
    return (Date.now() - new Date(c.updatedAt)) / 86400000 <= 7;
  };

  return (
    <div className="page-fade">
      {/* Toolbar */}
      <div className="filter-row">
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'var(--white)', border: '1.5px solid var(--border)',
          borderRadius: 50, padding: '6px 14px', flex: 1, minWidth: 200,
          transition: 'border-color .18s',
        }}>
          <Icon d={Icons.search} size={13} stroke="var(--muted)" />
          <input
            style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)', fontFamily: 'var(--font)' }}
            placeholder="Search complaints…"
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 15, lineHeight: 1, padding: 0 }}>✕</button>
          )}
        </div>

        {['All', 'Pending', 'In Progress', 'Resolved', 'Withdrawn'].map(f => (
          <button key={f} className={`filter-pill${filterStatus === f ? ' active' : ''}`}
            onClick={() => setFilterStatus(f)}>{f}</button>
        ))}

        <select className="sort-sel" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">↓ Newest</option>
          <option value="oldest">↑ Oldest</option>
          <option value="priority">🔴 Priority</option>
        </select>

        <button className="new-btn" onClick={() => setView('raise')}>
          <Icon d={Icons.plus} size={13} stroke="#fff" /> New Complaint
        </button>
      </div>

      {/* Count */}
      <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>
        {filtered.length} complaint{filtered.length !== 1 ? 's' : ''}
        {search && ` matching "${search}"`}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="pcard">
          <div className="empty">
            <div className="empty-icon">📭</div>
            <div className="empty-title">{complaints.length === 0 ? 'No complaints yet' : 'No results found'}</div>
            <div className="empty-sub">
              {complaints.length === 0
                ? 'File your first complaint using the "New Complaint" button above.'
                : 'Try adjusting your search or filter.'}
            </div>
          </div>
        </div>
      ) : (
        <div className="c-list">
          {filtered.map(c => (
            <div key={c._id} className="c-row" onClick={() => { setSelectedC(c); setView('detail'); }}>
              <div className="c-cat-icon">{CAT_EMOJI[c.category] || '📋'}</div>

              <div className="c-info">
                <div className="c-name">{c.name}</div>
                <div className="c-meta">
                  <span className={`badge ${getBadgeCls(c.status)}`}>
                    <span className="badge-dot" />{c.status}
                  </span>
                  {c.priority && (
                    <span className={`pri-badge ${getPriCls(c.priority)}`}>{c.priority}</span>
                  )}
                  <span className="c-date">
                    {c.city}{c.category ? ` · ${c.category}` : ''} · {timeAgo(c.createdAt)}
                  </span>
                  {c.csatRating && (
                    <span style={{ fontSize: 11, color: '#d97706' }}>⭐ {c.csatRating}/5</span>
                  )}
                </div>
              </div>

              <div className="c-actions" onClick={e => e.stopPropagation()}>
                {/* Edit — only pending */}
                {canEdit(c) && (
                  <div className="ic-btn" title="Edit complaint"
                    onClick={() => { setSelectedC(c); setView('edit'); }}>
                    <Icon d={Icons.edit} size={13} />
                  </div>
                )}

                {/* Withdraw */}
                {canCancel(c) && (
                  <div className="ic-btn danger" title="Withdraw complaint"
                    onClick={() => setConfirmModal({ type: 'cancel', complaint: c })}>
                    <Icon d={Icons.trash} size={13} stroke="var(--red)" />
                  </div>
                )}

                {/* Reopen */}
                {canReopen(c) && (
                  <div className="ic-btn" title="Reopen complaint"
                    onClick={() => setConfirmModal({ type: 'reopen', complaint: c })}>
                    <Icon d={Icons.reopen} size={13} stroke="var(--blue)" />
                  </div>
                )}

                {/* Download PDF */}
                <div className="ic-btn" title="Download PDF"
                  onClick={e => handlePDF(c, e)}>
                  {pdfLoading[c._id]
                    ? <div style={{ width: 13, height: 13, border: '2px solid var(--border)', borderTopColor: 'var(--text)', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
                    : <Icon d={Icons.download} size={13} />}
                </div>

                {/* View detail */}
                <button className="view-btn"
                  onClick={() => { setSelectedC(c); setView('detail'); }}>
                  <Icon d={Icons.eye} size={12} /> View
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="modal-overlay" onClick={() => setConfirmModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-hdr">
              <div className="modal-title">
                {confirmModal.type === 'cancel' ? '⚠️ Withdraw Complaint' : '🔁 Reopen Complaint'}
              </div>
              <button className="modal-close" onClick={() => setConfirmModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13.5, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 18 }}>
                {confirmModal.type === 'cancel'
                  ? `Are you sure you want to withdraw "${confirmModal.complaint.name}"? This will notify the admin and the complaint will be closed.`
                  : `Reopen "${confirmModal.complaint.name}"? This will set the status back to Pending and notify the support team.`
                }
              </p>
              <div style={{ display: 'flex', gap: 9, justifyContent: 'flex-end' }}>
                <button className="cancel-btn" style={{ padding: '8px 18px' }} onClick={() => setConfirmModal(null)}>
                  Cancel
                </button>
                <button className="submit-btn" style={{ padding: '8px 18px' }}
                  onClick={() => confirmModal.type === 'cancel'
                    ? withdrawComplaint(confirmModal.complaint)
                    : reopenComplaint(confirmModal.complaint)}>
                  {confirmModal.type === 'cancel' ? 'Yes, Withdraw' : 'Yes, Reopen'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}