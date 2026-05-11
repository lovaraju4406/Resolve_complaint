import React, { useState, useEffect, useRef } from 'react';
import axios from './axiosInstance';
import { Icon, Icons, CATEGORIES, CAT_EMOJI, suggestCategory, toast } from './userUtils';

const EMPTY_FORM = {
  name: '', address: '', city: '', state: '', pincode: '',
  category: 'Technical', priority: 'Medium', comment: '',
};

export default function UserRaise({ userId, userName, complaints, setComplaints, setView }) {
  const [form, setForm]             = useState({ ...EMPTY_FORM, name: userName });
  const [files, setFiles]           = useState([]);
  const [dragOver, setDragOver]     = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [uploadPct, setUploadPct]   = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(null); // { ticketId }
  const [aiLoading, setAiLoading]   = useState(false);
  const [catSuggest, setCatSuggest] = useState(null);
  const [dupWarning, setDupWarning] = useState(null);
  const [faqOpen, setFaqOpen]       = useState(false);
  const [faqMsg, setFaqMsg]         = useState('');
  const [faqHistory, setFaqHistory] = useState([]);
  const [faqLoading, setFaqLoading] = useState(false);
  const fileRef = useRef(null);

  /* ── Auto-category on description change ── */
  useEffect(() => {
    if (!form.comment || form.comment.length < 20) { setCatSuggest(null); return; }
    const suggested = suggestCategory(form.comment);
    if (suggested && suggested !== form.category) setCatSuggest(suggested);
    else setCatSuggest(null);
  }, [form.comment, form.category]);

  /* ── Duplicate detection on title change ── */
  useEffect(() => {
    if (!form.name || form.name.length < 5 || !form.comment || form.comment.length < 20) {
      setDupWarning(null); return;
    }
    const lower = form.comment.toLowerCase();
    const dup = complaints.find(c =>
      c.status !== 'Resolved' && c.status !== 'completed' && c.status !== 'Withdrawn' &&
      c.comment && c.comment.toLowerCase().split(' ').filter(w => w.length > 4)
        .some(w => lower.includes(w))
    );
    setDupWarning(dup || null);
  }, [form.name, form.comment, complaints]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  /* ── File handling ── */
  const addFiles = (newFiles) => {
    const arr = Array.from(newFiles).filter(f => f.size <= 10 * 1024 * 1024);
    if (arr.length < newFiles.length) toast('Some files exceed 10MB and were skipped', 'e');
    setFiles(prev => [...prev, ...arr].slice(0, 5)); // max 5 files
  };
  const removeFile = (i) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  /* ── AI improve description ── */
  const improveWithAI = async () => {
    if (!form.comment || form.comment.length < 20) {
      toast('Write at least 20 characters first', 'e'); return;
    }
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
            content: `Rewrite this complaint description to be clear, professional, and easy for a support agent to understand. Keep all the facts. Return only the rewritten text, no preamble:\n\n"${form.comment}"`
          }]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      setForm(f => ({ ...f, comment: text.trim() }));
      toast('Description improved with AI ✨', 's');
    } catch { toast('AI improvement failed', 'e'); }
    finally { setAiLoading(false); }
  };

  /* ── FAQ chatbot ── */
  const sendFaqMsg = async () => {
    if (!faqMsg.trim()) return;
    const userMsg = faqMsg.trim();
    setFaqHistory(h => [...h, { role: 'user', text: userMsg }]);
    setFaqMsg('');
    setFaqLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: 'You are a helpful FAQ assistant for a complaint management platform called ResolveNow. Help users self-resolve their issues before filing a complaint. Ask clarifying questions. If the issue can be self-resolved, explain how. If they truly need to file a complaint, tell them to proceed. Keep responses concise (2-3 sentences max).',
          messages: [
            ...faqHistory.map(m => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text })),
            { role: 'user', content: userMsg }
          ]
        })
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === 'text')?.text || '';
      setFaqHistory(h => [...h, { role: 'assistant', text: text.trim() }]);
    } catch {
      setFaqHistory(h => [...h, { role: 'assistant', text: 'Sorry, I could not respond. Please file your complaint directly.' }]);
    } finally { setFaqLoading(false); }
  };

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let attachments = [];

      // Upload files if any
      if (files.length > 0) {
        setUploading(true);
        const fd = new FormData();
        files.forEach(f => fd.append('files', f));
        try {
          const upRes = await axios.post('http://localhost:8000/upload', fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (e) => setUploadPct(Math.round((e.loaded / e.total) * 100)),
          });
          attachments = upRes.data.files || [];
        } catch {
          // Backend upload route may not exist yet — continue without attachments
          attachments = files.map(f => ({ name: f.name, url: '' }));
        }
        setUploading(false);
      }

      const payload = { ...form, userId, attachments };
      const res = await axios.post(`http://localhost:8000/Complaint/${userId}`, payload);
      const newComplaint = res.data;

      setComplaints(prev => [newComplaint, ...prev]);
      setSuccess({ ticketId: newComplaint._id });
      toast('Complaint submitted successfully!', 's');
    } catch (err) {
      toast('Submission failed. Please try again.', 'e');
    } finally {
      setSubmitting(false);
      setUploadPct(0);
    }
  };

  const copyTicketId = (id) => {
    navigator.clipboard.writeText(id.slice(-10).toUpperCase());
    toast('Ticket ID copied!', 'i');
  };

  if (success) {
    return (
      <div className="raise-wrap page-fade">
        <div className="pcard">
          <div className="pcard-body" style={{ textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
            <div style={{ fontFamily: 'var(--display)', fontSize: 22, fontWeight: 800, color: 'var(--text)', marginBottom: 8 }}>
              Complaint Submitted!
            </div>
            <div style={{ fontSize: 13.5, color: 'var(--text2)', marginBottom: 20 }}>
              Your ticket has been filed. Our team will review it shortly.
            </div>
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 11.5, color: 'var(--muted)', marginBottom: 8 }}>Your Ticket ID (save this)</div>
              <div className="ticket-id" style={{ justifyContent: 'center', fontSize: 15 }}
                onClick={() => copyTicketId(success.ticketId)}>
                <Icon d={Icons.copy} size={13} /> #{success.ticketId.slice(-10).toUpperCase()}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <button className="cancel-btn" onClick={() => {
                setSuccess(null);
                setForm({ ...EMPTY_FORM, name: userName });
                setFiles([]);
              }}>File Another</button>
              <button className="submit-btn" onClick={() => setView('complaints')}>
                <Icon d={Icons.complaint} size={14} /> View My Complaints
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="raise-wrap page-fade">

      {/* FAQ Chatbot toggle */}
      <div style={{ marginBottom: 14 }}>
        <button
          onClick={() => setFaqOpen(o => !o)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '8px 16px', borderRadius: 50, border: '1.5px solid var(--border)',
            background: faqOpen ? 'var(--pill-dark)' : 'var(--white)',
            color: faqOpen ? '#fff' : 'var(--text2)',
            fontFamily: 'var(--font)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
          ❓ {faqOpen ? 'Close' : 'Try Self-Help First (AI FAQ)'}
        </button>

        {faqOpen && (
          <div className="pcard" style={{ marginTop: 10 }}>
            <div className="pcard-hdr">
              <div className="pcard-title">🤖 Self-Help Assistant</div>
              <span style={{ fontSize: 11.5, color: 'var(--muted)' }}>May save you from filing a complaint</span>
            </div>
            <div style={{ height: 220, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {faqHistory.length === 0 && (
                <div style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', marginTop: 40 }}>
                  Describe your issue and I'll try to help you resolve it!
                </div>
              )}
              {faqHistory.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div className={`bubble bubble-${m.role === 'user' ? 'user' : 'agent'}`}>{m.text}</div>
                </div>
              ))}
              {faqLoading && (
                <div className="bubble bubble-agent" style={{ width: 60 }}>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)', animation: `spin .9s ${i * .2}s ease infinite` }} />
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="chat-inp-row">
              <input className="chat-inp"
                placeholder="Describe your issue…"
                value={faqMsg} onChange={e => setFaqMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !faqLoading && sendFaqMsg()} />
              <button className="chat-send" onClick={sendFaqMsg} disabled={faqLoading}>
                <Icon d={Icons.send} size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Duplicate warning */}
      {dupWarning && (
        <div className="dup-warn" style={{ marginBottom: 14 }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#78350f', marginBottom: 2 }}>
              Similar complaint already open
            </div>
            <div style={{ fontSize: 12, color: '#92400e' }}>
              You already have a similar complaint "{dupWarning.name}" (Status: {dupWarning.status}).
              Consider tracking that instead of filing a duplicate.
            </div>
            <button
              onClick={() => { /* navigate to existing */ }}
              style={{ marginTop: 5, fontSize: 11.5, fontWeight: 600, color: '#b45309', background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline', fontFamily: 'var(--font)' }}>
              Track existing complaint →
            </button>
          </div>
        </div>
      )}

      <div className="pcard">
        <div className="pcard-hdr">
          <div className="pcard-title">Register New Complaint</div>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>All fields required unless noted</span>
        </div>
        <div className="pcard-body">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">

              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input className="form-inp" name="name" value={form.name} onChange={handleChange}
                  placeholder="Your full name" required />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input className="form-inp" name="address" value={form.address} onChange={handleChange}
                  placeholder="Street address" required />
              </div>

              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-inp" name="city" value={form.city} onChange={handleChange}
                  placeholder="City" required />
              </div>

              <div className="form-group">
                <label className="form-label">State</label>
                <input className="form-inp" name="state" value={form.state} onChange={handleChange}
                  placeholder="State" required />
              </div>

              <div className="form-group">
                <label className="form-label">Pincode</label>
                <input className="form-inp" name="pincode" value={form.pincode} onChange={handleChange}
                  placeholder="6-digit pincode" maxLength={6} required />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-sel" name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{CAT_EMOJI[c]} {c}</option>
                  ))}
                </select>
                {catSuggest && (
                  <div className="cat-suggest">
                    <span>✨ AI suggests: <b>{CAT_EMOJI[catSuggest]} {catSuggest}</b></span>
                    <button type="button" className="cat-accept"
                      onClick={() => { setForm(f => ({ ...f, category: catSuggest })); setCatSuggest(null); }}>
                      Accept
                    </button>
                    <button type="button"
                      onClick={() => setCatSuggest(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 13, fontFamily: 'var(--font)' }}>
                      ✕
                    </button>
                  </div>
                )}
              </div>

              <div className="form-group form-full">
                <label className="form-label">Priority Level</label>
                <div className="pri-row">
                  {['High', 'Medium', 'Low'].map(p => (
                    <div key={p} className={`pri-opt${form.priority === p ? ` sel-${p}` : ''}`}
                      onClick={() => setForm({ ...form, priority: p })}>
                      {p === 'High' ? '🔴' : p === 'Medium' ? '🟡' : '🟢'} {p}
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group form-full">
                <label className="form-label">Describe the Issue</label>
                <div className="ai-bar">
                  <span style={{ fontSize: 12, color: 'var(--text2)', flex: 1 }}>✨ Use AI to improve your description</span>
                  <button type="button" className="ai-btn" onClick={improveWithAI} disabled={aiLoading}>
                    {aiLoading ? <><div className="ai-spinner" /> Improving…</> : '✨ Improve with AI'}
                  </button>
                </div>
                <textarea className="form-ta" name="comment" value={form.comment} onChange={handleChange}
                  placeholder="Describe what happened, when, and how it affects you. Be specific — this helps agents resolve faster."
                  required />
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4, textAlign: 'right' }}>
                  {form.comment.length} chars {form.comment.length < 30 ? '(please be more detailed)' : ''}
                </div>
              </div>

              {/* File upload */}
              <div className="form-group form-full">
                <label className="form-label">Attachments <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: 'var(--muted)' }}>(optional, max 5 files · 10MB each)</span></label>
                <div
                  className={`upload-zone${dragOver ? ' drag-over' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                  onClick={() => fileRef.current?.click()}>
                  <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    onChange={e => addFiles(e.target.files)} />
                  <div style={{ fontSize: 28, marginBottom: 8 }}>📎</div>
                  <div className="upload-text">Drag & drop or click to browse</div>
                  <div className="upload-sub">JPG, PNG, PDF, DOC · up to 10MB each</div>
                </div>

                {/* File previews */}
                {files.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 8 }}>
                    {files.map((f, i) => (
                      <div key={i} className="file-chip">
                        {f.type.startsWith('image/') ? '🖼️' : '📄'} {f.name.slice(0, 18)}{f.name.length > 18 ? '…' : ''}
                        <button type="button" onClick={() => removeFile(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload progress */}
                {uploading && (
                  <div className="upload-prog" style={{ marginTop: 10 }}>
                    <div className="upload-prog-fill" style={{ width: `${uploadPct}%` }} />
                  </div>
                )}
              </div>
            </div>

            <div className="form-btns">
              <button type="button" className="cancel-btn" onClick={() => setView('complaints')}>Cancel</button>
              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting
                  ? <><div className="spinner" />Submitting…</>
                  : <><Icon d={Icons.send} size={14} />Submit Complaint</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}