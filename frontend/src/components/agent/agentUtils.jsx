import { useState } from 'react';

/* ── Toast system ── */
let _tid = 0, _setSt = () => {};
export function toast(msg, t = 'i') {
  const id = ++_tid;
  _setSt(p => [...p, { id, msg, t }]);
  setTimeout(() => _setSt(p => p.filter(x => x.id !== id)), 3500);
}
export function Toasts() {
  const [list, set] = useState([]);
  _setSt = set;
  if (!list.length) return null;
  return (
    <div className="ag-toast-wrap">
      {list.map(t => (
        <div key={t.id} className={`ag-toast ${t.t}`}>
          {t.t === 's' ? '✓' : t.t === 'e' ? '✕' : 'ℹ'} {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ── Date helpers ── */
export function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

/* ── SLA helper ── */
// dueAt is an ISO string; returns { label, cls }
export function getSLAStatus(dueAt, status) {
  if (!dueAt) return null;
  if (status === 'Resolved' || status === 'completed') return null;
  const diff = new Date(dueAt).getTime() - Date.now();
  const hrs = Math.round(diff / 3600000);
  if (diff < 0) return { label: `Overdue ${Math.abs(hrs)}h`, cls: 'ag-sla-over' };
  if (hrs < 4) return { label: `Due in ${hrs}h`, cls: 'ag-sla-warn' };
  return { label: `Due in ${hrs}h`, cls: 'ag-sla-ok' };
}

/* ── Sentiment analysis (client-side heuristic) ── */
const ANGRY_WORDS = ['worst', 'terrible', 'useless', 'horrible', 'disgusting', 'pathetic',
  'fraud', 'cheated', 'scam', 'furious', 'angry', 'outraged', 'unacceptable',
  'ridiculous', 'incompetent', 'rude', 'harassment', 'lawsuit', 'never again'];
const POSITIVE_WORDS = ['thank', 'great', 'excellent', 'helpful', 'satisfied', 'good',
  'happy', 'appreciate', 'pleased', 'nice', 'wonderful', 'perfect'];

export function getSentiment(text) {
  if (!text) return null;
  const lower = text.toLowerCase();
  const angryScore = ANGRY_WORDS.filter(w => lower.includes(w)).length;
  const posScore = POSITIVE_WORDS.filter(w => lower.includes(w)).length;
  if (angryScore >= 2 || (angryScore === 1 && text.includes('!'))) return 'angry';
  if (posScore > angryScore) return 'positive';
  return 'neutral';
}

export const SENTIMENT_META = {
  angry:    { icon: '😠', label: 'Upset',    cls: 'ag-sent-angry'    },
  neutral:  { icon: '😐', label: 'Neutral',  cls: 'ag-sent-neutral'  },
  positive: { icon: '😊', label: 'Positive', cls: 'ag-sent-positive' },
};

/* ── Priority (AI-based via Claude in parent; this is fallback heuristic) ── */
export function getHeuristicPriority(text) {
  if (!text) return 'medium';
  const lower = text.toLowerCase();
  if (ANGRY_WORDS.slice(0, 8).some(w => lower.includes(w))) return 'high';
  if (lower.includes('urgent') || lower.includes('immediately') || lower.includes('emergency')) return 'urgent';
  if (lower.includes('minor') || lower.includes('small') || lower.includes('when possible')) return 'low';
  return 'medium';
}

export const PRIORITY_META = {
  urgent: { icon: '🔴', label: 'Urgent',  cls: 'ag-prio-urgent' },
  high:   { icon: '🟠', label: 'High',    cls: 'ag-prio-high'   },
  medium: { icon: '🔵', label: 'Medium',  cls: 'ag-prio-medium' },
  low:    { icon: '🟢', label: 'Low',     cls: 'ag-prio-low'    },
};

/* ── Canned responses ── */
export const CANNED_RESPONSES = [
  {
    group: 'Acknowledgement',
    items: [
      { title: 'Received & reviewing', text: 'Thank you for reaching out. We have received your complaint and our team is currently reviewing it. We will get back to you shortly.' },
      { title: 'Under investigation', text: 'We acknowledge your concern and have escalated it to our investigation team. You will receive an update within 24–48 hours.' },
    ]
  },
  {
    group: 'Resolution',
    items: [
      { title: 'Issue resolved', text: 'We are pleased to inform you that your complaint has been resolved. The issue has been addressed and appropriate corrective measures have been taken. Please let us know if you need any further assistance.' },
      { title: 'Partial resolution', text: 'We have partially resolved your complaint. Further steps are underway and we expect full resolution within 2 business days.' },
    ]
  },
  {
    group: 'Apology / Follow-up',
    items: [
      { title: 'Sincere apology', text: 'We sincerely apologize for the inconvenience caused. This does not reflect our service standards and we are taking steps to ensure this does not recur.' },
      { title: 'Need more info', text: 'To better assist you, could you please provide additional details about your complaint? Specifically, the date of the incident and any reference numbers would be very helpful.' },
    ]
  },
];

/* ── Status metadata ── */
export const STATUS_META = {
  Pending:       { color: '#d97706', bg: '#fef3c7', border: '#fde68a', icon: '⏳', strip: 'pending'   },
  'In Progress': { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe', icon: '🔄', strip: 'progress'  },
  Resolved:      { color: '#15803d', bg: '#f0fdf4', border: '#86efac', icon: '✅', strip: 'resolved'  },
  completed:     { color: '#15803d', bg: '#f0fdf4', border: '#86efac', icon: '✅', strip: 'resolved'  },
  Rejected:      { color: '#dc2626', bg: '#fef2f2', border: '#fecaca', icon: '❌', strip: 'rejected'  },
  Escalated:     { color: '#7c3aed', bg: '#ede9fe', border: '#c4b5fd', icon: '⬆️', strip: 'escalated' },
};

/* ── Star renderer ── */
export function renderStars(rating) {
  if (!rating) return null;
  return Array.from({ length: 5 }, (_, i) => (
    <span key={i} className="ag-csat-star">{i < rating ? '⭐' : '☆'}</span>
  ));
}