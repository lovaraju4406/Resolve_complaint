import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from '../user/axiosInstance';
import ChatWindow from '../common/ChatWindow';
import ComplaintDetailModal from './ComplaintDetailModal';
import {
  STATUS_META, timeAgo, getSentiment, SENTIMENT_META,
  PRIORITY_META, getSLAStatus, getHeuristicPriority,
  renderStars, CANNED_RESPONSES, toast
} from './agentUtils';

const POLL_INTERVAL = 30000; // 30 seconds

export default function AgentComplaints({ user, complaints, setComplaints }) {
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('All');
  const [sortBy, setSortBy]         = useState('newest');
  const [chatOpen, setChatOpen]     = useState({});
  const [statusSel, setStatusSel]   = useState({});
  const [notes, setNotes]           = useState({});
  const [updating, setUpdating]     = useState({});
  const [showCanned, setShowCanned] = useState({});
  const [aiLoading, setAiLoading]   = useState({});
  const [showTimeline, setShowTimeline] = useState({});
  const [detailModal, setDetailModal]   = useState(null);
  const pollRef = useRef(null);

  // ── Polling for new complaints ──
  const fetchComplaints = useCallback(() => {
    if (!user?._id) return;
    axios.get(`http://localhost:8000/allcomplaints/${user._id}`)
      .then(res => {
        const fresh = res.data || [];
        setComplaints(prev => {
          if (JSON.stringify(prev.map(c => c.complaintId)) !== JSON.stringify(fresh.map(c => c.complaintId))) {
            const newCount = fresh.length - prev.length;
            if (newCount > 0) toast(`${newCount} new complaint${newCount > 1 ? 's' : ''} assigned!`, 'i');
          }
          return fresh;
        });
      })
      .catch(() => {});
  }, [user?._id, setComplaints]);

  useEffect(() => {
    pollRef.current = setInterval(fetchComplaints, POLL_INTERVAL);
    return () => clearInterval(pollRef.current);
  }, [fetchComplaints]);

  // ── Update status ──
  const updateStatus = async (complaint) => {
    const cid = complaint.complaintId;
    const newStatus = statusSel[cid] || complaint.status;
    if (!cid) { toast('Missing complaint ID', 'e'); return; }
    setUpdating(p => ({ ...p, [cid]: true }));
    try {
      await axios.put(`http://localhost:8000/complaint/${cid}`, {
        status: newStatus,
        note: notes[cid]?.trim() || undefined,
      });
      setComplaints(p => p.map(c => c.complaintId === cid
        ? { ...c, status: newStatus, updatedAt: new Date().toISOString() }
        : c
      ));
      setNotes(p => ({ ...p, [cid]: '' }));
      toast(`Status updated to "${newStatus}"`, 's');
    } catch { toast('Update failed. Try again.', 'e'); }
    finally { setUpdating(p => ({ ...p, [cid]: false })); }
  };

  // ── Escalate ──
  const escalate = async (complaint) => {
    const cid = complaint.complaintId;
    if (!cid) return;
    if (!window.confirm('Escalate this complaint to supervisor?')) return;
    setUpdating(p => ({ ...p, [cid]: true }));
    try {
      await axios.put(`http://localhost:8000/complaint/${cid}`, {
        status: 'Escalated',
        note: 'Escalated to supervisor by agent.',
      });
      setComplaints(p => p.map(c => c.complaintId === cid
        ? { ...c, status: 'Escalated', updatedAt: new Date().toISOString() }
        : c
      ));
      toast('Complaint escalated to supervisor', 'i');
    } catch { toast('Escalation failed', 'e'); }
    finally { setUpdating(p => ({ ...p, [cid]: false })); }
  };

  // ── AI suggest reply ──
  const suggestReply = async (complaint) => {
    const cid = complaint.complaintId;
    setAiLoading(p => ({ ...p, [cid]: true }));
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a professional customer support agent. Write a concise resolution note (2-3 sentences) for this complaint:\n\n"${complaint.comment}"\n\nCustomer: ${complaint.name}, City: ${complaint.city}. Be empathetic and solution-oriented. Return only the note, no preamble.`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      setNotes(p => ({ ...p, [cid]: text.trim() }));
      toast('AI suggestion added ✨', 's');
    } catch { toast('AI suggestion failed', 'e'); }
    finally { setAiLoading(p => ({ ...p, [cid]: false })); }
  };

  const toggleChat     = (id) => setChatOpen(p => ({ ...p, [id]: !p[id] }));
  const toggleTimeline = (id) => setShowTimeline(p => ({ ...p, [id]: !p[id] }));
  const toggleCanned   = (id) => setShowCanned(p => ({ ...p, [id]: !p[id] }));

  const insertCanned = (cid, text) => {
    setNotes(p => ({ ...p, [cid]: text }));
    setShowCanned(p => ({ ...p, [cid]: false }));
  };

  // ── Modal status update callback ──
  const handleModalStatusUpdate = (cid, newStatus, newNote) => {
    setComplaints(p => p.map(c => c.complaintId === cid
      ? { ...c, status: newStatus, updatedAt: new Date().toISOString() }
      : c
    ));
  };

  // ── Filter + Sort ──
  const filtered = complaints
    .filter(c => {
      const q = search.toLowerCase();
      const ms = !q ||
        c.name?.toLowerCase().includes(q) ||
        c.city?.toLowerCase().includes(q) ||
        c.comment?.toLowerCase().includes(q) ||
        c.complaintId?.toLowerCase().includes(q);
      const mf = filter === 'All' || c.status === filter ||
        (filter === 'Resolved' && c.status === 'completed');
      return ms && mf;
    })
    .sort((a, b) => {
      if (sortBy === 'newest')   return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest')   return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'priority') {
        const order = { urgent: 0, high: 1, medium: 2, low: 3 };
        return (order[a.priority || 'medium'] || 2) - (order[b.priority || 'medium'] || 2);
      }
      if (sortBy === 'sla') {
        const aT = a.dueAt ? new Date(a.dueAt).getTime() : Infinity;
        const bT = b.dueAt ? new Date(b.dueAt).getTime() : Infinity;
        return aT - bT;
      }
      return 0;
    });

  return (
    <>
      <div className="ag-ph">
        <div className="ag-ph-title">📋 My Complaints</div>
        <div className="ag-ph-sub">
          Manage and resolve all complaints assigned to you. Auto-refreshes every 30s.
        </div>
      </div>

      {/* Toolbar */}
      <div className="ag-toolbar">
        <div className="ag-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="var(--muted)" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input placeholder="Search name, city, ID, description…"
            value={search} onChange={e => setSearch(e.target.value)} />
          {search && (
            <button onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0, fontSize: 16 }}>
              ✕
            </button>
          )}
        </div>

        {['All', 'Pending', 'In Progress', 'Resolved', 'Escalated'].map(f => (
          <button key={f} className={`ag-filter-btn${filter === f ? ' active' : ''}`}
            onClick={() => setFilter(f)}>{f}</button>
        ))}

        <select className="ag-sort-sel" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="newest">↓ Newest first</option>
          <option value="oldest">↑ Oldest first</option>
          <option value="priority">🔴 Priority</option>
          <option value="sla">⏰ SLA deadline</option>
        </select>

        <span className="ag-count">
          {filtered.length} complaint{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Grid */}
      <div className="ag-grid">
        {filtered.length === 0 ? (
          <div className="ag-empty">
            <div className="ag-empty-icon">📭</div>
            <div className="ag-empty-title">
              {complaints.length === 0 ? 'No complaints assigned yet' : 'No results found'}
            </div>
            <div className="ag-empty-sub">
              {complaints.length === 0
                ? 'The admin will assign complaints to you soon. Check back later.'
                : 'Try clearing your search or changing the filter.'}
            </div>
          </div>
        ) : filtered.map((complaint, idx) => {
          const cid    = complaint.complaintId;
          const status = complaint.status || 'Pending';
          const meta   = STATUS_META[status] || STATUS_META.Pending;
          const isChat = !!chatOpen[cid];
          const isDone = status === 'Resolved' || status === 'completed' || status === 'Escalated';
          const sentiment = getSentiment(complaint.comment);
          const sentMeta  = sentiment ? SENTIMENT_META[sentiment] : null;
          const priority  = complaint.priority || getHeuristicPriority(complaint.comment);
          const prioMeta  = PRIORITY_META[priority] || PRIORITY_META.medium;
          const sla       = getSLAStatus(complaint.dueAt, status);
          const attachments = complaint.attachments || [];
          const tlItems   = complaint.timeline || [];

          return (
            <div key={cid || idx} className={`ag-card${isChat ? ' chat-open' : ''}`}>
              <div className={`ag-card-strip ag-cs-${meta.strip}`} />
              <div className="ag-card-body">

                {/* Header */}
                <div className="ag-card-head">
                  <div>
                    <div className="ag-card-name">{complaint.name}</div>
                    <div style={{ marginTop: 4 }}>
                      <span className="ag-pill"
                        style={{ background: meta.bg, color: meta.color, border: `1.5px solid ${meta.border}` }}>
                        {meta.icon} {status}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    {cid && <span className="ag-card-id">#{cid.slice(-6).toUpperCase()}</span>}
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>{timeAgo(complaint.createdAt)}</span>
                  </div>
                </div>

                {/* Badges row: sentiment + priority + SLA + CSAT */}
                <div className="ag-card-meta">
                  {sentMeta && (
                    <span className={`ag-sentiment ${sentMeta.cls}`}>{sentMeta.icon} {sentMeta.label}</span>
                  )}
                  <span className={`ag-priority ${prioMeta.cls}`}>{prioMeta.icon} {prioMeta.label}</span>
                  {sla && <span className={`ag-sla ${sla.cls}`}>⏰ {sla.label}</span>}
                  {complaint.csatRating && (
                    <span className="ag-pill" style={{
                      background: '#fefce8', color: '#a16207',
                      border: '1px solid #fde68a', fontSize: 11
                    }}>
                      ⭐ {complaint.csatRating}/5
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="ag-detail-grid">
                  {[
                    { label: 'City',    val: complaint.city },
                    { label: 'State',   val: complaint.state },
                    { label: 'Pincode', val: complaint.pincode },
                    { label: 'Date',    val: complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—' },
                  ].map(d => (
                    <div className="ag-detail" key={d.label}>
                      <div className="ag-dl">{d.label}</div>
                      <div className="ag-dv">{d.val || '—'}</div>
                    </div>
                  ))}
                </div>

                {/* Complaint description */}
                <div className="ag-comment">
                  <div className="ag-comment-l">Description</div>
                  <div className="ag-comment-t" style={{
                    maxHeight: 80, overflow: 'hidden',
                    WebkitMaskImage: 'linear-gradient(180deg,#000 60%,transparent)'
                  }}>
                    {complaint.comment || 'No description provided.'}
                  </div>
                </div>

                {/* Attachments preview */}
                {attachments.length > 0 && (
                  <div className="ag-attachments">
                    <div className="ag-attach-l">📎 Attachments ({attachments.length})</div>
                    <div className="ag-attach-row">
                      {attachments.slice(0, 3).map((att, i) => {
                        const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(att.name || att.url || '');
                        return (
                          <a key={i} href={att.url} target="_blank" rel="noopener noreferrer"
                            className="ag-attach-item" download={att.name}>
                            {isImage
                              ? <img src={att.url} alt={att.name} className="ag-attach-thumb" />
                              : <span>📄</span>
                            }
                            {att.name ? att.name.slice(0, 12) + (att.name.length > 12 ? '…' : '') : `File ${i + 1}`}
                          </a>
                        );
                      })}
                      {attachments.length > 3 && (
                        <span style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>
                          +{attachments.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Timeline (collapsible) */}
                {tlItems.length > 0 && (
                  <div className="ag-timeline">
                    <button className="ag-timeline-toggle" onClick={() => toggleTimeline(cid)}>
                      {showTimeline[cid] ? '▾' : '▸'} History ({tlItems.length} event{tlItems.length !== 1 ? 's' : ''})
                    </button>
                    {showTimeline[cid] && (
                      <div className="ag-timeline-list">
                        {tlItems.slice(0, 4).map((item, i) => (
                          <div className="ag-tl-item" key={i}>
                            <div className="ag-tl-dot" />
                            <div className="ag-tl-content">
                              <div className="ag-tl-action">{item.action}</div>
                              <div className="ag-tl-meta">{item.by && `${item.by} · `}{timeAgo(item.at)}</div>
                              {item.note && <div className="ag-tl-note">"{item.note}"</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Resolution note with canned + AI */}
                {!isDone && (
                  <div className="ag-note-wrap">
                    <div className="ag-note-head">
                      <span className="ag-note-label">Resolution Note</span>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="ag-canned-btn" onClick={() => toggleCanned(cid)}>
                          📝 Canned
                        </button>
                        <button className="ag-ai-btn"
                          onClick={() => suggestReply(complaint)}
                          disabled={!!aiLoading[cid]}>
                          {aiLoading[cid] ? '⏳' : '✨ AI'}
                        </button>
                      </div>
                    </div>

                    {showCanned[cid] && (
                      <div className="ag-canned-drop">
                        {CANNED_RESPONSES.map(group => (
                          <React.Fragment key={group.group}>
                            <div className="ag-canned-title">{group.group}</div>
                            {group.items.map(item => (
                              <div key={item.title} className="ag-canned-item"
                                onClick={() => insertCanned(cid, item.text)}>
                                <b>{item.title}</b> —{' '}
                                <span style={{ opacity: .7 }}>{item.text.slice(0, 55)}…</span>
                              </div>
                            ))}
                          </React.Fragment>
                        ))}
                      </div>
                    )}

                    <textarea className="ag-note-ta"
                      placeholder="Add a resolution note (sent with status update)…"
                      value={notes[cid] || ''}
                      onChange={e => setNotes(p => ({ ...p, [cid]: e.target.value }))} />
                  </div>
                )}

                {/* Action row */}
                <div className="ag-actions">
                  {!isDone && (
                    <>
                      <select className="ag-sel"
                        value={statusSel[cid] || status}
                        onChange={e => setStatusSel(p => ({ ...p, [cid]: e.target.value }))}>
                        <option value="Pending">⏳ Pending</option>
                        <option value="In Progress">🔄 In Progress</option>
                        <option value="Resolved">✅ Resolved</option>
                      </select>
                      <button className="ag-btn upd"
                        onClick={() => updateStatus(complaint)}
                        disabled={updating[cid]}>
                        {updating[cid] ? '⏳' : '↑ Update'}
                      </button>
                      <button className="ag-btn escalate-btn"
                        onClick={() => escalate(complaint)}
                        disabled={updating[cid]}
                        title="Escalate to supervisor">
                        ⬆️
                      </button>
                    </>
                  )}
                  {isDone && (
                    <span className="ag-btn" style={{
                      background: meta.bg, color: meta.color,
                      border: `1.5px solid ${meta.border}`, flex: 1,
                      justifyContent: 'center', cursor: 'default'
                    }}>
                      {meta.icon} {status}
                    </span>
                  )}
                  <button className="ag-btn detail-btn"
                    onClick={() => setDetailModal(complaint)}
                    title="Full details">
                    🔍
                  </button>
                  <button className={`ag-btn chat-btn${isChat ? ' open' : ''}`}
                    onClick={() => toggleChat(cid)}>
                    {isChat ? '✕' : '💬'}
                  </button>
                </div>
              </div>

              {/* Chat panel */}
              {isChat && cid && (
                <div className="ag-chat-panel">
                  <ChatWindow complaintId={cid} name={user.name} onClose={() => toggleChat(cid)} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {detailModal && (
        <ComplaintDetailModal
          complaint={detailModal}
          user={user}
          onClose={() => setDetailModal(null)}
          onStatusUpdate={handleModalStatusUpdate}
        />
      )}
    </>
  );
}