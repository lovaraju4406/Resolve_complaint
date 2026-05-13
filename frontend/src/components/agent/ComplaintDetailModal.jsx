import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatWindow from '../common/ChatWindow';
import {
  STATUS_META, timeAgo, formatDate, getSentiment,
  SENTIMENT_META, PRIORITY_META, getSLAStatus, renderStars,
  CANNED_RESPONSES, toast
} from './agentUtils';

export default function ComplaintDetailModal({ complaint, user, onClose, onStatusUpdate }) {
  const [statusSel, setStatusSel]   = useState(complaint.status || 'Pending');
  const [note, setNote]             = useState('');
  const [updating, setUpdating]     = useState(false);
  const [timeline, setTimeline]     = useState(complaint.timeline || []);
  const [showCanned, setShowCanned] = useState(false);
  const [aiLoading, setAiLoading]   = useState(false);
  const [chatOpen, setChatOpen]     = useState(false);

  const cid    = complaint.complaintId;
  const status = complaint.status || 'Pending';
  const meta   = STATUS_META[status] || STATUS_META.Pending;
  const isDone = status === 'Resolved' || status === 'completed' || status === 'Escalated';
  const sentiment  = getSentiment(complaint.comment);
  const sentMeta   = sentiment ? SENTIMENT_META[sentiment] : null;
  const priority   = complaint.priority || 'medium';
  const prioMeta   = PRIORITY_META[priority] || PRIORITY_META.medium;
  const sla        = getSLAStatus(complaint.dueAt, status);
  const attachments = complaint.attachments || [];

  // Fetch timeline if not bundled
  useEffect(() => {
    if (!complaint.timeline && cid) {
      axios.get(`https://resolve-complaint.onrender.com/complaint/${cid}/timeline`)
        .then(res => setTimeline(res.data || []))
        .catch(() => {});
    }
  }, [cid, complaint.timeline]);

  const updateStatus = async () => {
    if (!cid) { toast('Missing complaint ID', 'e'); return; }
    setUpdating(true);
    try {
      await axios.put(`https://resolve-complaint.onrender.com/complaint/${cid}`, {
        status: statusSel,
        note: note.trim() || undefined,
      });
      onStatusUpdate(cid, statusSel, note.trim());
      toast(`Status updated to "${statusSel}"`, 's');
      setNote('');
      // Add to local timeline
      setTimeline(prev => [{
        action: `Status changed to ${statusSel}`,
        note: note.trim() || undefined,
        by: user.name,
        at: new Date().toISOString(),
      }, ...prev]);
    } catch { toast('Update failed. Try again.', 'e'); }
    finally { setUpdating(false); }
  };

  const suggestReply = async () => {
    if (!complaint.comment) return;
    setAiLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a customer support agent. Write a concise, professional resolution note (2-3 sentences max) for this complaint:\n\n"${complaint.comment}"\n\nCustomer name: ${complaint.name}. Return only the note text, no preamble.`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      setNote(text.trim());
      toast('AI suggestion added ✨', 's');
    } catch { toast('AI suggestion failed', 'e'); }
    finally { setAiLoading(false); }
  };

  const insertCanned = (text) => {
    setNote(text);
    setShowCanned(false);
  };

  return (
    <div className="ag-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="ag-modal">
        {/* Header */}
        <div className="ag-modal-head">
          <div>
            <div className="ag-modal-title">{complaint.name}</div>
            {cid && <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
              #{cid.slice(-8).toUpperCase()}
            </div>}
          </div>
          <button className="ag-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="ag-modal-body">
          {/* Status + badges */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
            <span className="ag-pill" style={{ background: meta.bg, color: meta.color, border: `1.5px solid ${meta.border}` }}>
              {meta.icon} {status}
            </span>
            {sentMeta && (
              <span className={`ag-sentiment ${sentMeta.cls}`}>{sentMeta.icon} {sentMeta.label}</span>
            )}
            <span className={`ag-priority ${prioMeta.cls}`}>{prioMeta.icon} {prioMeta.label}</span>
            {sla && <span className={`ag-sla ${sla.cls}`}>⏰ {sla.label}</span>}
            {complaint.csatRating && (
              <span className="ag-pill" style={{ background: '#fefce8', color: '#a16207', border: '1px solid #fde68a' }}>
                ⭐ CSAT {complaint.csatRating}/5
              </span>
            )}
          </div>

          {/* Details grid */}
          <div className="ag-modal-sec">
            <div className="ag-modal-sec-title">Contact & Location</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 8 }}>
              {[
                { label: 'City',     val: complaint.city },
                { label: 'State',    val: complaint.state },
                { label: 'Pincode',  val: complaint.pincode },
                { label: 'Address',  val: complaint.address },
                { label: 'Email',    val: complaint.email },
                { label: 'Phone',    val: complaint.phone },
                { label: 'Submitted', val: formatDate(complaint.createdAt) },
                { label: 'Last Updated', val: formatDate(complaint.updatedAt) },
              ].map(d => (
                <div className="ag-detail" key={d.label}>
                  <div className="ag-dl">{d.label}</div>
                  <div className="ag-dv" style={{ fontSize: 12 }}>{d.val || '—'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Complaint description */}
          <div className="ag-modal-sec">
            <div className="ag-modal-sec-title">Complaint Description</div>
            <div className="ag-comment" style={{ marginBottom: 0 }}>
              <div className="ag-comment-t">{complaint.comment || 'No description provided.'}</div>
            </div>
          </div>

          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="ag-modal-sec">
              <div className="ag-modal-sec-title">Attachments ({attachments.length})</div>
              <div className="ag-attach-row">
                {attachments.map((att, i) => {
                  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(att.name || att.url || '');
                  return (
                    <a key={i} href={att.url} target="_blank" rel="noopener noreferrer"
                      className="ag-attach-item" download={att.name}>
                      {isImage
                        ? <img src={att.url} alt={att.name} className="ag-attach-thumb" />
                        : <span style={{ fontSize: 18 }}>📄</span>
                      }
                      <span>{att.name || `File ${i + 1}`}</span>
                      <span style={{ opacity: .5, fontSize: 10 }}>↗</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="ag-modal-sec">
            <div className="ag-modal-sec-title">Complaint Timeline</div>
            {timeline.length === 0 ? (
              <div style={{ fontSize: 12.5, color: 'var(--muted)', fontStyle: 'italic' }}>
                No history recorded yet.
              </div>
            ) : (
              <div className="ag-timeline-list">
                {timeline.map((item, i) => (
                  <div className="ag-tl-item" key={i}>
                    <div className="ag-tl-dot" style={{
                      background: item.action?.includes('Resolved') ? 'var(--green)'
                        : item.action?.includes('Escalated') ? '#7c3aed'
                        : item.action?.includes('Rejected') ? 'var(--red)'
                        : '#2563eb'
                    }} />
                    <div className="ag-tl-content">
                      <div className="ag-tl-action">{item.action}</div>
                      <div className="ag-tl-meta">
                        {item.by && <span>{item.by} · </span>}
                        {timeAgo(item.at)}
                      </div>
                      {item.note && <div className="ag-tl-note">"{item.note}"</div>}
                    </div>
                  </div>
                ))}
                {/* Creation event at the bottom */}
                <div className="ag-tl-item">
                  <div className="ag-tl-dot" style={{ background: 'var(--muted)' }} />
                  <div className="ag-tl-content">
                    <div className="ag-tl-action">Complaint submitted</div>
                    <div className="ag-tl-meta">{formatDate(complaint.createdAt)}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Update section */}
          {!isDone && (
            <div className="ag-modal-sec" style={{ marginBottom: 0 }}>
              <div className="ag-modal-sec-title">Update Status</div>

              {/* Canned responses */}
              <div style={{ marginBottom: 8 }}>
                <button className="ag-canned-btn" onClick={() => setShowCanned(p => !p)}>
                  📝 {showCanned ? 'Hide' : 'Insert'} canned response
                </button>
                <button className="ag-ai-btn" onClick={suggestReply} disabled={aiLoading}
                  style={{ marginLeft: 8 }}>
                  {aiLoading ? '⏳ Generating…' : '✨ AI Suggest Reply'}
                </button>
              </div>

              {showCanned && (
                <div className="ag-canned-drop">
                  {CANNED_RESPONSES.map(group => (
                    <React.Fragment key={group.group}>
                      <div className="ag-canned-title">{group.group}</div>
                      {group.items.map(item => (
                        <div key={item.title} className="ag-canned-item"
                          onClick={() => insertCanned(item.text)}>
                          <b>{item.title}</b> — <span style={{ opacity: .7 }}>{item.text.slice(0, 60)}…</span>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              )}

              <div className="ag-note-wrap">
                <textarea className="ag-note-ta"
                  placeholder="Add a resolution note (sent with status update)…"
                  value={note}
                  onChange={e => setNote(e.target.value)} />
              </div>

              <div className="ag-actions">
                <select className="ag-sel" value={statusSel}
                  onChange={e => setStatusSel(e.target.value)}>
                  <option value="Pending">⏳ Pending</option>
                  <option value="In Progress">🔄 In Progress</option>
                  <option value="Resolved">✅ Resolved</option>
                  <option value="Escalated">⬆️ Escalated</option>
                </select>
                <button className="ag-btn upd" onClick={updateStatus} disabled={updating}>
                  {updating ? '⏳' : '↑ Update'}
                </button>
              </div>
            </div>
          )}

          {/* Chat toggle */}
          <div style={{ marginTop: 16 }}>
            <button className={`ag-btn chat-btn${chatOpen ? ' open' : ''}`}
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => setChatOpen(p => !p)}>
              {chatOpen ? '✕ Close Chat' : '💬 Open Chat Thread'}
            </button>
          </div>

          {chatOpen && cid && (
            <div className="ag-chat-panel" style={{ marginTop: 12, borderRadius: 12, overflow: 'hidden' }}>
              <ChatWindow complaintId={cid} name={user.name} onClose={() => setChatOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}