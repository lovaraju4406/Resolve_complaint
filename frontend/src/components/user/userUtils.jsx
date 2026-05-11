import { useState } from 'react';
import jsPDF from 'jspdf';
import { CSS as USER_CSS } from './userStyles';

/* ── SVG Icon ── */
export const Icon = ({ d, size = 16, stroke = 'currentColor', fill = 'none', sw = 1.6 }) => (
  <svg width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw}
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

export const Icons = {
  home:     'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  complaint:['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8','M10 9H8'],
  bell:     ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0'],
  user:     ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  logout:   ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4','M16 17l5-5-5-5','M21 12H9'],
  plus:     'M12 5v14M5 12h14',
  search:   ['M21 21l-4.35-4.35','M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z'],
  send:     'M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z',
  eye:      ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0'],
  edit:     ['M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7','M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'],
  check:    'M20 6L9 17l-5-5',
  upload:   ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M17 8l-5-5-5 5','M12 3v12'],
  shield:   'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  menu:     'M3 12h18M3 6h18M3 18h18',
  close:    'M18 6L6 18M6 6l12 12',
  arrow:    'M19 12H5M12 19l-7-7 7-7',
  chart:    ['M18 20V10','M12 20V4','M6 20v-6'],
  download: ['M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4','M7 10l5 5 5-5','M12 15V3'],
  trash:    ['M3 6h18','M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6','M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2'],
  refresh:  ['M23 4v6h-6','M1 20v-6h6','M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15'],
  star:     'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.77 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z',
  warn:     ['M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z','M12 9v4','M12 17h.01'],
  pdf:      ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6'],
  copy:     ['M20 9H11a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2z','M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'],
  reopen:   'M1 4v6h6M23 20v-6h-6M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15',
};

/* ── Toast ── */
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
    <div className="toast-wrap">
      {list.map(t => (
        <div key={t.id} className={`toast ${t.t}`}>
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
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function formatDateShort(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

/* ── Constants ── */
export const CATEGORIES = ['Electronics', 'Orders', 'Billing', 'Technical', 'Delivery', 'Service', 'Water', 'Electricity', 'Roads', 'Other'];
export const CAT_EMOJI = {
  Electronics: '💻', Orders: '📦', Billing: '💳', Technical: '🛠️',
  Delivery: '🚚', Service: '🎧', Water: '💧', Electricity: '⚡',
  Roads: '🛣️', Other: '📋',
};

/* ── Badge class helper ── */
export function getBadgeCls(s) {
  if (s === 'Pending') return 'badge-pending';
  if (s === 'In Progress') return 'badge-progress';
  if (s === 'Resolved' || s === 'completed') return 'badge-resolved';
  if (s === 'Withdrawn') return 'badge-withdrawn';
  return 'badge-pending';
}

/* ── Priority badge class ── */
export function getPriCls(p) {
  if (p === 'High' || p === 'urgent') return 'pri-high';
  if (p === 'Medium') return 'pri-med';
  return 'pri-low';
}

/* ── Auto-category suggestion (heuristic) ── */
const CAT_KEYWORDS = {
  Electronics: ['laptop', 'phone', 'screen', 'device', 'charger', 'battery', 'computer', 'keyboard', 'printer'],
  Orders: ['order', 'product', 'item', 'delivered', 'delivery', 'package', 'shipment', 'wrong', 'missing'],
  Billing: ['bill', 'charge', 'payment', 'refund', 'invoice', 'overcharge', 'subscription', 'fee', 'amount'],
  Technical: ['app', 'crash', 'error', 'bug', 'login', 'website', 'software', 'update', 'glitch', 'password'],
  Delivery: ['courier', 'tracking', 'late', 'delay', 'dispatch', 'not received', 'lost'],
  Service: ['service', 'agent', 'support', 'response', 'rude', 'staff', 'customer'],
  Water: ['water', 'pipe', 'leakage', 'supply', 'drainage', 'sewage', 'tap'],
  Electricity: ['electricity', 'power', 'outage', 'voltage', 'meter', 'wire', 'current'],
  Roads: ['road', 'pothole', 'street', 'footpath', 'traffic', 'signal', 'bridge'],
};

export function suggestCategory(text) {
  if (!text || text.length < 10) return null;
  const lower = text.toLowerCase();
  let best = null, bestScore = 0;
  for (const [cat, keywords] of Object.entries(CAT_KEYWORDS)) {
    const score = keywords.filter(k => lower.includes(k)).length;
    if (score > bestScore) { bestScore = score; best = cat; }
  }
  return bestScore > 0 ? best : null;
}

/* ── PDF generator ── */
export async function downloadComplaintPDF(complaint, timeline = []) {
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(26, 26, 24);
  doc.rect(0, 0, pageW, 28, 'F');
  doc.setTextColor(212, 240, 0);
  doc.setFontSize(16); doc.setFont(undefined, 'bold');
  doc.text('ResolveNow — Complaint Report', 14, 18);

  // Ticket ID
  doc.setFillColor(245, 242, 236);
  doc.roundedRect(14, 33, pageW - 28, 14, 3, 3, 'F');
  doc.setTextColor(26, 26, 24);
  doc.setFontSize(10); doc.setFont(undefined, 'normal');
  doc.text(`Ticket ID: ${complaint._id?.slice(-10).toUpperCase() || 'N/A'}`, 18, 42);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, pageW - 60, 42);

  // Details
  let y = 58;
  const fields = [
    ['Name', complaint.name], ['Status', complaint.status],
    ['Category', complaint.category || 'General'], ['Priority', complaint.priority || 'Medium'],
    ['City', complaint.city], ['State', complaint.state],
    ['Address', complaint.address], ['Pincode', complaint.pincode],
    ['Submitted', complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('en-IN') : '—'],
  ];

  doc.setFontSize(11); doc.setFont(undefined, 'bold');
  doc.text('Complaint Details', 14, y); y += 8;

  doc.setFontSize(10); doc.setFont(undefined, 'normal');
  doc.setTextColor(74, 71, 68);
  for (const [k, v] of fields) {
    doc.setFont(undefined, 'bold'); doc.setTextColor(26, 26, 24);
    doc.text(`${k}:`, 14, y);
    doc.setFont(undefined, 'normal'); doc.setTextColor(74, 71, 68);
    doc.text(String(v || '—'), 55, y);
    y += 7;
  }

  y += 4;
  doc.setFont(undefined, 'bold'); doc.setTextColor(26, 26, 24);
  doc.text('Description:', 14, y); y += 7;
  doc.setFont(undefined, 'normal'); doc.setTextColor(74, 71, 68);
  const descLines = doc.splitTextToSize(complaint.comment || '—', pageW - 28);
  doc.text(descLines, 14, y); y += descLines.length * 6 + 6;

  // Timeline
  if (timeline.length > 0) {
    doc.setFont(undefined, 'bold'); doc.setTextColor(26, 26, 24);
    doc.setFontSize(11);
    doc.text('Status Timeline', 14, y); y += 8;
    doc.setFontSize(10);
    for (const item of timeline) {
      doc.setFont(undefined, 'bold'); doc.setTextColor(26, 26, 24);
      doc.text(`• ${item.action}`, 16, y);
      doc.setFont(undefined, 'normal'); doc.setTextColor(74, 71, 68);
      doc.text(`  ${item.by ? `by ${item.by} · ` : ''}${item.at ? new Date(item.at).toLocaleDateString('en-IN') : ''}`, 16, y + 5);
      if (item.note) { doc.text(`  "${item.note}"`, 16, y + 10); y += 5; }
      y += 12;
      if (y > 270) { doc.addPage(); y = 20; }
    }
  }

  // Footer
  const pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(245, 242, 236);
  doc.rect(0, pageH - 14, pageW, 14, 'F');
  doc.setTextColor(154, 151, 144);
  doc.setFontSize(8);
  doc.text('ResolveNow Complaint Management System — Confidential', 14, pageH - 5);

  doc.save(`complaint-${complaint._id?.slice(-8) || 'report'}.pdf`);
}

/* ── Avg resolution time ── */
export function avgResolutionDays(complaints) {
  const resolved = complaints.filter(c =>
    (c.status === 'Resolved' || c.status === 'completed') && c.createdAt && c.updatedAt
  );
  if (!resolved.length) return null;
  const avg = resolved.reduce((s, c) =>
    s + (new Date(c.updatedAt) - new Date(c.createdAt)), 0
  ) / resolved.length;
  return (avg / 86400000).toFixed(1);
}

/* ── Monthly activity ── */
export function monthlyActivity(complaints) {
  const months = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = d.toLocaleDateString('en-IN', { month: 'short' });
    months[key] = 0;
  }
  complaints.forEach(c => {
    if (!c.createdAt) return;
    const key = new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'short' });
    if (key in months) months[key]++;
  });
  return Object.entries(months).map(([month, count]) => ({ month, count }));
}