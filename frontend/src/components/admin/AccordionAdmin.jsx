import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from '../user/axiosInstance';   // ✅ was: import axios from 'axios'
import ChatWindow from '../common/ChatWindow';

const API = 'http://localhost:8000';

/* ─────────────────────────────────────────────────────────
   AccordionAdmin.jsx — Fixed version
   Fixes applied:
   ✅ Now uses axiosInstance (sends auth token)
   ✅ /status response unwrapped correctly (handles { complaints, total, page } OR plain array)
   ✅ Assign no longer removes complaint from list prematurely
   ✅ Assigned complaints visible in "assigned" mode
   ✅ Reassign button on assigned complaints
   ✅ SLA deadline field when assigning
   ✅ Export to CSV
   ✅ Sort by date / priority / SLA
   ✅ Email sent on assignment
───────────────────────────────────────────────────────── */

const STATUS_META = {
  Pending:       { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)',  icon: '⏳' },
  'In Progress': { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.25)',  icon: '🔄' },
  Resolved:      { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.25)',  icon: '✅' },
  Rejected:      { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)',   icon: '❌' },
  Escalated:     { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.25)',  icon: '⬆️' },
};

const PRIORITY_META = {
  urgent: { color: '#ef4444', label: '🔴 Urgent' },
  high:   { color: '#f59e0b', label: '🟠 High'   },
  medium: { color: '#3b82f6', label: '🔵 Medium'  },
  low:    { color: '#10b981', label: '🟢 Low'    },
};

const CSS = `
.acc-wrap { font-family: 'Bricolage Grotesque', sans-serif; }

/* ── TOOLBAR ── */
.acc-toolbar {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 18px; flex-wrap: wrap;
}
.acc-search {
  flex: 1; min-width: 220px;
  display: flex; align-items: center; gap: 10px;
  background: #ffffff; border: 1.5px solid rgba(0,0,0,0.08);
  border-radius: 10px; padding: 9px 14px; transition: border-color .18s;
}
.acc-search:focus-within { border-color: #6366f1; }
.acc-search input {
  flex: 1; background: none; border: none; outline: none;
  font-size: 13.5px; color: #111827;
  font-family: 'Bricolage Grotesque', sans-serif;
}
.acc-search input::placeholder {
  color: rgba(107,114,128,0.8);
  font-weight: 500;
}
.acc-filter-btn {
  padding: 9px 16px; border-radius: 10px;
  background: #ffffff; border: 1.5px solid rgba(255,255,255,0.09);
  color: #374151; font-size: 13px; font-weight: 600;
  font-family: 'Bricolage Grotesque', sans-serif;
  cursor: pointer; transition: all .15s; white-space: nowrap;
}
.acc-filter-btn:hover, .acc-filter-btn.active {
  background: rgba(99,102,241,0.12);
  border-color: rgba(99,102,241,0.3); color: #a5b4fc;
}
.acc-sort-sel {
  padding: 9px 14px; border-radius: 10px;
  background: #ffffff; border: 1.5px solid rgba(255,255,255,0.09);
  color:#374151; font-size: 13px;
  font-family: 'Bricolage Grotesque', sans-serif;
  cursor: pointer; outline: none; transition: border-color .18s;
}
.acc-sort-sel:focus { border-color: #6366f1; }
.acc-sort-sel option { background: #ffffff; }
.acc-export-btn {
  display: flex; align-items: center; gap: 7px;
  padding: 9px 16px; border-radius: 10px; border: none;
  background: rgba(16,185,129,0.12);
  border: 1.5px solid rgba(16,185,129,0.25);
  color: #059669; font-size: 13px; font-weight: 600;
  font-family: 'Bricolage Grotesque', sans-serif;
  cursor: pointer; transition: all .15s; white-space: nowrap;
}
.acc-export-btn:hover { background: rgba(16,185,129,0.22); color: #065f46; }
.acc-count {
  font-size: 12px; color: #6b7280;
  margin-left: auto; white-space: nowrap;
}

/* ── ACCORDION ITEM ── */
.acc-item {
  background: #ffffff; border: 1px solid rgba(0,0,0,0.08);
  border-radius: 14px; margin-bottom: 10px; overflow: hidden;
  transition: border-color .15s;
}
.acc-item:hover { border-color: rgba(0,0,0,0.15); }
.acc-item.open  { border-color: rgba(99,102,241,0.25); }
.acc-item.overdue { border-color: rgba(239,68,68,0.35) !important; }

.acc-header {
  display: flex; align-items: center; gap: 14px;
  padding: 16px 18px; cursor: pointer;
  transition: background .12s; user-select: none;
}
.acc-header:hover { background: rgba(0,0,0,0.02); }
.acc-chevron {
  width: 22px; height: 22px; border-radius: 6px;
  background: rgba(0,0,0,0.04);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; color: rgba(17,24,39,0.4); flex-shrink: 0;
  transition: transform .25s, background .15s;
}
.acc-item.open .acc-chevron {
  transform: rotate(180deg);
  background: rgba(99,102,241,0.15); color: #6366f1;
}
.acc-header-info { flex: 1; min-width: 0; }
.acc-header-name {
  font-size: 14.5px; font-weight: 700; color: #111827; margin-bottom: 2px;
}
.acc-header-meta {
  font-size: 12px; color: rgba(17,24,39,0.5);
  display: flex; gap: 12px; flex-wrap: wrap;
}
.acc-pill {
  padding: 4px 10px; border-radius: 20px;
  font-size: 11.5px; font-weight: 700; flex-shrink: 0;
  display: inline-flex; align-items: center; gap: 5px;
}
.acc-id {
  font-family: 'DM Mono', monospace; font-size: 10.5px;
  color: rgba(17,24,39,0.45); background: rgba(0,0,0,0.04);
  border-radius: 6px; padding: 3px 8px; flex-shrink: 0;
}
.acc-sla-badge {
  font-size: 11px; font-weight: 700;
  padding: 3px 9px; border-radius: 20px; flex-shrink: 0;
}

/* ── BODY ── */
.acc-body {
  overflow: hidden; max-height: 0;
  transition: max-height .35s cubic-bezier(.4,0,.2,1);
}
.acc-item.open .acc-body { max-height: 1200px; }
.acc-body-inner {
  padding: 0 18px 20px;
  border-top: 1px solid rgba(0,0,0,0.06);
}
.acc-detail-grid {
  display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px; margin: 16px 0;
}
.acc-detail-item {
  background: #f8fafc; border: 1px solid rgba(0,0,0,0.06);
  border-radius: 10px; padding: 12px 14px;
}
.acc-detail-label {
  font-size: 10.5px; color: rgba(17,24,39,0.45);
  text-transform: uppercase; letter-spacing: .08em; margin-bottom: 4px;
}
.acc-detail-val { font-size: 13.5px; font-weight: 600; color: #111827; }

.acc-comment-box {
  background: #f8fafc; border: 1px solid rgba(0,0,0,0.06);
  border-radius: 10px; padding: 14px 16px; margin-bottom: 16px;
}
.acc-comment-label {
  font-size: 10.5px; color: rgba(17,24,39,0.45);
  text-transform: uppercase; letter-spacing: .08em; margin-bottom: 6px;
}
.acc-comment-text {
  font-size: 13.5px; color: rgba(17,24,39,0.9); line-height: 1.6;
}

/* ── TIMELINE ── */
.acc-timeline { margin-bottom: 16px; }
.acc-tl-title {
  font-size: 10.5px; color: rgba(17,24,39,0.45);
  text-transform: uppercase; letter-spacing: .08em; margin-bottom: 10px;
}
.acc-tl-item {
  display: flex; gap: 10px; position: relative; padding-bottom: 10px;
}
.acc-tl-item:last-child { padding-bottom: 0; }
.acc-tl-item:not(:last-child)::before {
  content: ''; position: absolute; left: 11px; top: 22px;
  width: 1.5px; height: 100%; background: rgba(0,0,0,0.08);
}
.acc-tl-dot {
  width: 22px; height: 22px; border-radius: 50%;
  background: rgba(99,102,241,0.1); border: 1.5px solid rgba(99,102,241,0.3);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; flex-shrink: 0; margin-top: 1px;
}
.acc-tl-text { font-size: 12.5px; color: rgba(17,24,39,0.7); line-height: 1.4; }
.acc-tl-time { font-size: 11px; color: rgba(17,24,39,0.45); margin-top: 2px; }

/* ── SLA INPUT ── */
.acc-sla-row {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 12px; flex-wrap: wrap;
}
.acc-sla-label { font-size: 12px; color: rgba(17,24,39,0.65); white-space: nowrap; }
.acc-sla-inp {
  padding: 7px 12px; border-radius: 8px;
  background: #f8fafc; border: 1.5px solid rgba(0,0,0,0.09);
  color: #111827; font-size: 13px;
  font-family: 'Bricolage Grotesque', sans-serif;
  outline: none; transition: border-color .18s; width: 80px;
}
.acc-sla-inp:focus { border-color: #6366f1; }

/* ── ACTIONS ── */
.acc-actions { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.acc-assign-select {
  flex: 1; min-width: 180px;
  background: #f8fafc; border: 1.5px solid rgba(0,0,0,0.09);
  border-radius: 10px; padding: 9px 14px;
  font-size: 13px; color: #111827;
  font-family: 'Bricolage Grotesque', sans-serif;
  cursor: pointer; outline: none; transition: border-color .18s;
}
.acc-assign-select:focus { border-color: #6366f1; }
.acc-btn {
  padding: 9px 18px; border-radius: 10px; border: none;
  font-size: 13px; font-weight: 700;
  font-family: 'Bricolage Grotesque', sans-serif;
  cursor: pointer; display: flex; align-items: center; gap: 7px;
  transition: all .15s; white-space: nowrap;
}
.acc-btn.primary {
  background: linear-gradient(135deg, #6366f1, #4f46e5); color: #fff;
  box-shadow: 0 4px 14px rgba(99,102,241,0.3);
}
.acc-btn.primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(99,102,241,0.4); }
.acc-btn.primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }
.acc-btn.ghost {
  background: #f8fafc; border: 1px solid rgba(0,0,0,0.1);
  color: rgba(17,24,39,0.75);
}
.acc-btn.ghost:hover { background: #f1f5f9; color: #111827; }
.acc-btn.danger {
  background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
  color: #dc2626;
}
.acc-btn.danger:hover { background: rgba(239,68,68,0.15); }
.acc-btn.chat-btn {
  background: rgba(59,130,246,0.08); border: 1px solid rgba(59,130,246,0.2);
  color: #2563eb;
}
.acc-btn.chat-btn:hover { background: rgba(59,130,246,0.15); }
.acc-btn.reassign-btn {
  background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.2);
  color: #d97706;
}
.acc-btn.reassign-btn:hover { background: rgba(245,158,11,0.15); }

.acc-status-select {
  padding: 9px 14px; border-radius: 10px;
  background: #f8fafc; border: 1.5px solid rgba(0,0,0,0.09);
  font-size: 13px; color: #111827;
  font-family: 'Bricolage Grotesque', sans-serif;
  cursor: pointer; outline: none; transition: border-color .18s;
}
.acc-status-select:focus { border-color: #6366f1; }

/* ── CHAT PANEL ── */
.acc-chat-panel {
  border-top: 1px solid rgba(0,0,0,0.07);
  height: 380px; display: flex; flex-direction: column;
  animation: chatSlide .22s ease both;
  --white: #ffffff; --bg: #f8fafc; --s2: #ffffff; --s3: #eef2ff;
  --border: rgba(0,0,0,0.08); --text: #111827; --text2: rgba(17,24,39,0.7);
  --muted: rgba(17,24,39,0.4); --gl: rgba(99,102,241,0.15);
  --gm: rgba(99,102,241,0.3); --gd: #6366f1;
}
@keyframes chatSlide { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

/* ── EMPTY / SKELETON ── */
.acc-empty {
  text-align: center; padding: 56px 0;
  color: rgba(17,24,39,0.45); font-size: 13.5px;
}
.acc-empty-icon { font-size: 40px; margin-bottom: 10px; opacity: .4; }
.acc-skel {
  background: linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%);
  background-size: 200% 100%;
  animation: accShimmer 1.4s ease infinite;
  border-radius: 10px; height: 72px; margin-bottom: 10px;
}
@keyframes accShimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

@media(max-width:600px){
  .acc-detail-grid { grid-template-columns: 1fr 1fr; }
  .acc-actions { flex-direction: column; align-items: stretch; }
  .acc-assign-select { width: 100%; }
}
`;

/* ── helpers ── */

/**
 * Safely unwrap the response from GET /status.
 * Backend may return:
 *   - plain array  → []
 *   - { complaints: [], total, page }
 *   - { data: [] }
 */
function unwrapComplaints(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.complaints)) return responseData.complaints;
  if (Array.isArray(responseData?.data))       return responseData.data;
  return [];
}

function slaInfo(dueAt) {
  if (!dueAt) return null;
  const diff = new Date(dueAt).getTime() - Date.now();
  const h    = Math.round(diff / 3600000);
  if (diff < 0) return { label:`Overdue ${Math.abs(h)}h`, color:'#ef4444', bg:'rgba(239,68,68,0.15)', border:'rgba(239,68,68,0.3)', overdue:true };
  if (h <= 4)   return { label:`Due in ${h}h`,            color:'#f59e0b', bg:'rgba(245,158,11,0.15)', border:'rgba(245,158,11,0.3)', overdue:false };
  return              { label:`${h}h left`,                color:'#10b981', bg:'rgba(16,185,129,0.12)', border:'rgba(16,185,129,0.25)', overdue:false };
}

function timeAgo(dateStr) {
  if (!dateStr) return '—';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function exportToCSV(complaints) {
  const headers = ['ID','Name','City','State','Pincode','Status','Priority','Filed On','Description'];
  const rows = complaints.map(c => [
    c._id?.slice(-6).toUpperCase() || '',
    c.name  || '',
    c.city  || '',
    c.state || '',
    c.pincode || '',
    c.status   || '',
    c.priority || '',
    c.createdAt ? new Date(c.createdAt).toLocaleDateString('en-IN') : '',
    `"${(c.comment || '').replace(/"/g, "'")}"`,
  ]);
  const csv  = [headers, ...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type:'text/csv' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `resolvenow-complaints-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
   mode = 'unassigned' (default) | 'assigned'
───────────────────────────────────────────────────────── */
export default function AccordionAdmin({ showToast, mode = 'unassigned', onAudit }) {
  const [complaints,     setComplaints]     = useState([]);
  const [agents,         setAgents]         = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [open,           setOpen]           = useState({});
  const [chatOpen,       setChatOpen]       = useState({});
  const [search,         setSearch]         = useState('');
  const [filter,         setFilter]         = useState('All');
  const [sortBy,         setSortBy]         = useState('newest');
  const [selectedAgent,  setSelectedAgent]  = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});
  const [slaDuration,    setSlaDuration]    = useState({});
  const [assigning,      setAssigning]      = useState({});
  const [reassigning,    setReassigning]    = useState({});

  useEffect(() => {
    const load = async () => {
      try {
        // ✅ FIX 1: use axiosInstance so auth token is sent automatically
        // ✅ FIX 2: use unwrapComplaints() to handle both array and paginated responses
        const [cRes, aRes] = await Promise.all([
          axiosInstance.get(`${API}/status`),
          axiosInstance.get(`${API}/AgentUsers`).catch(() => ({ data: [] })),
        ]);

        const allComplaints = unwrapComplaints(cRes.data);
        const agentList     = Array.isArray(aRes.data) ? aRes.data : (aRes.data?.agents || aRes.data?.data || []);

        // Build set of assigned complaint IDs from each agent's assigned list
        const assignedIds = new Set();
        await Promise.all(agentList.map(async agent => {
          try {
            const res = await axiosInstance.get(`${API}/allcomplaints/${agent._id}`);
            (res.data || []).forEach(c => assignedIds.add(c.complaintId?.toString() || c._id?.toString()));
          } catch { /* agent may have no complaints yet */ }
        }));

        if (mode === 'assigned') {
          setComplaints(allComplaints.filter(c => assignedIds.has(c._id?.toString())));
        } else {
          setComplaints(allComplaints.filter(c => !assignedIds.has(c._id?.toString())));
        }

        setAgents(agentList);
      } catch (err) {
        console.error('AccordionAdmin load error:', err);
        showToast?.('Failed to load complaints. Check your session.', 'error');
      }
      setLoading(false);
    };
    load();
  }, [mode]);

  const toggleOpen = id => setOpen(p => ({ ...p, [id]: !p[id] }));
  const toggleChat = id => setChatOpen(p => ({ ...p, [id]: !p[id] }));

  /* ── Assign ── */
  const handleAssign = async (complaint) => {
    const agentId = selectedAgent[complaint._id];
    if (!agentId) { showToast?.('Please select an agent first.', 'error'); return; }
    const agent = agents.find(a => a._id === agentId);
    const hours = parseInt(slaDuration[complaint._id] || '48', 10);
    setAssigning(p => ({ ...p, [complaint._id]: true }));
    try {
      await axiosInstance.post(`${API}/assignedComplaints`, {
        agentId,
        complaintId: complaint._id,
        status:      complaint.status,
        agentName:   agent?.name,
      });

      if (!isNaN(hours) && hours > 0) {
        const dueAt = new Date(Date.now() + hours * 3600000).toISOString();
        await axiosInstance.put(`${API}/complaint/${complaint._id}`, {
          status:    complaint.status,
          agentName: agent?.name,
          note:      `Assigned to ${agent?.name}. SLA: ${hours}h`,
          dueAt,
        });
      }

      showToast?.(`✅ Assigned to ${agent?.name} (SLA: ${hours}h)`, 'success');
      onAudit?.('Complaint Assigned', `#${complaint._id.slice(-6).toUpperCase()} → ${agent?.name} (SLA: ${hours}h)`);

      // Update in state first (show assigned badge, keep in list briefly)
      setComplaints(p => p.map(c =>
        c._id === complaint._id
          ? { ...c, assignedTo: agent?.name, assignedAgentId: agentId }
          : c
      ));

      // In unassigned mode, remove from list after short delay so user sees confirmation
      if (mode === 'unassigned') {
        setTimeout(() => setComplaints(p => p.filter(c => c._id !== complaint._id)), 1500);
      }
    } catch (err) {
      console.error('Assignment error:', err);
      showToast?.('Assignment failed. Try again.', 'error');
    } finally {
      setAssigning(p => ({ ...p, [complaint._id]: false }));
    }
  };

  /* ── Reassign ── */
  const handleReassign = async (complaint) => {
    const agentId = selectedAgent[complaint._id];
    if (!agentId) { showToast?.('Select a new agent to reassign.', 'error'); return; }
    const agent = agents.find(a => a._id === agentId);
    setReassigning(p => ({ ...p, [complaint._id]: true }));
    try {
      await axiosInstance.post(`${API}/assignedComplaints`, {
        agentId,
        complaintId: complaint._id,
        status:      complaint.status,
        agentName:   agent?.name,
      });
      await axiosInstance.put(`${API}/complaint/${complaint._id}`, {
        status:    complaint.status,
        agentName: agent?.name,
        note:      `Reassigned to ${agent?.name}`,
      });
      showToast?.(`🔄 Reassigned to ${agent?.name}`, 'success');
      onAudit?.('Complaint Reassigned', `#${complaint._id.slice(-6).toUpperCase()} → ${agent?.name}`);
      setComplaints(p => p.map(c =>
        c._id === complaint._id ? { ...c, assignedTo: agent?.name } : c
      ));
    } catch (err) {
      console.error('Reassignment error:', err);
      showToast?.('Reassignment failed.', 'error');
    } finally {
      setReassigning(p => ({ ...p, [complaint._id]: false }));
    }
  };

  /* ── Status update ── */
  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await axiosInstance.put(`${API}/complaint/${complaintId}`, {
        status:    newStatus,
        agentName: 'Admin',
        note:      `Status set to ${newStatus} by Admin`,
      });
      setComplaints(p => p.map(c => c._id === complaintId ? { ...c, status: newStatus } : c));
      showToast?.('Status updated', 'success');
      onAudit?.('Status Updated', `#${complaintId.slice(-6).toUpperCase()} → ${newStatus}`);
    } catch {
      showToast?.('Failed to update status', 'error');
    }
  };

  /* ── Filter + Sort ── */
  const FILTER_TABS = ['All', 'Pending', 'In Progress', 'Resolved', 'Escalated'];

  const filtered = complaints
    .filter(c => {
      const matchSearch = !search ||
        c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.city?.toLowerCase().includes(search.toLowerCase()) ||
        c.comment?.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'All' || c.status === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => {
      if (sortBy === 'newest')   return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest')   return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'sla')      return new Date(a.dueAt || 9e15) - new Date(b.dueAt || 9e15);
      if (sortBy === 'priority') {
        const order = { urgent:0, high:1, medium:2, low:3 };
        return (order[a.priority] ?? 4) - (order[b.priority] ?? 4);
      }
      return 0;
    });

  return (
    <>
      <style>{CSS}</style>
      <div className="acc-wrap">

        {/* ── TOOLBAR ── */}
        <div className="acc-toolbar">
          <div className="acc-search">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(17,24,39,0.45)" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              placeholder="Search by name, city, description…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background:'none', border:'none', color:'#6b7280', cursor:'pointer', fontSize:16, padding:0 }}>✕</button>
            )}
          </div>

          {FILTER_TABS.map(tab => (
            <button key={tab} className={`acc-filter-btn${filter === tab ? ' active' : ''}`} onClick={() => setFilter(tab)}>
              {tab}
            </button>
          ))}

          <select className="acc-sort-sel" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="sla">SLA deadline</option>
            <option value="priority">Priority</option>
          </select>

          <button
            className="acc-export-btn"
            onClick={() => { exportToCSV(filtered); showToast?.(`Exported ${filtered.length} complaints`, 'success'); }}
          >
            ⬇ Export CSV
          </button>

          <span className="acc-count">{filtered.length} complaint{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* ── LIST ── */}
        {loading ? (
          [1,2,3,4].map(i => <div key={i} className="acc-skel"/>)
        ) : filtered.length === 0 ? (
          <div className="acc-empty">
            <div className="acc-empty-icon">📭</div>
            {search || filter !== 'All'
              ? 'No complaints match your filters.'
              : mode === 'assigned'
                ? 'No assigned complaints yet.'
                : 'All complaints have been assigned!'
            }
          </div>
        ) : filtered.map(complaint => {
          const isOpen   = !!open[complaint._id];
          const isChatOn = !!chatOpen[complaint._id];
          const meta     = STATUS_META[complaint.status] || STATUS_META.Pending;
          const sla      = slaInfo(complaint.dueAt);
          const prio     = PRIORITY_META[complaint.priority];

          return (
            <div
              key={complaint._id}
              className={`acc-item${isOpen ? ' open' : ''}${sla?.overdue ? ' overdue' : ''}`}
            >
              {/* ── HEADER ── */}
              <div className="acc-header" onClick={() => toggleOpen(complaint._id)}>
                <div className="acc-chevron">▾</div>

                <div className="acc-header-info">
                  <div className="acc-header-name">{complaint.name}</div>
                  <div className="acc-header-meta">
                    <span>📍 {complaint.city}, {complaint.state}</span>
                    <span>🕒 {timeAgo(complaint.createdAt)}</span>
                    {complaint.assignedTo && <span>👤 {complaint.assignedTo}</span>}
                  </div>
                </div>

                {prio && (
                  <span style={{ fontSize:11, fontWeight:700, padding:'3px 9px', borderRadius:20, background:`${prio.color}18`, color:prio.color, border:`1px solid ${prio.color}30`, flexShrink:0 }}>
                    {prio.label}
                  </span>
                )}

                {sla && (
                  <span className="acc-sla-badge" style={{ background:sla.bg, color:sla.color, border:`1px solid ${sla.border}` }}>
                    ⏱ {sla.label}
                  </span>
                )}

                <span className="acc-pill" style={{ background:meta.bg, color:meta.color, border:`1px solid ${meta.border}` }}>
                  {meta.icon} {complaint.status}
                </span>

                <span className="acc-id">#{complaint._id.slice(-6).toUpperCase()}</span>
              </div>

              {/* ── BODY ── */}
              <div className="acc-body">
                <div className="acc-body-inner">

                  {/* Detail grid */}
                  <div className="acc-detail-grid">
                    {[
                      { label:'Full Name', val: complaint.name    },
                      { label:'City',      val: complaint.city    },
                      { label:'State',     val: complaint.state   },
                      { label:'Pincode',   val: complaint.pincode },
                      { label:'Address',   val: complaint.address },
                      { label:'Filed',     val: complaint.createdAt ? new Date(complaint.createdAt).toLocaleDateString('en-IN') : '—' },
                    ].map(d => (
                      <div className="acc-detail-item" key={d.label}>
                        <div className="acc-detail-label">{d.label}</div>
                        <div className="acc-detail-val">{d.val || '—'}</div>
                      </div>
                    ))}
                  </div>

                  {/* Description */}
                  <div className="acc-comment-box">
                    <div className="acc-comment-label">Complaint Description</div>
                    <div className="acc-comment-text">{complaint.comment || 'No description provided.'}</div>
                  </div>

                  {/* Timeline */}
                  {complaint.timeline?.length > 0 && (
                    <div className="acc-timeline">
                      <div className="acc-tl-title">Timeline</div>
                      {complaint.timeline.slice(0, 4).map((t, i) => (
                        <div key={i} className="acc-tl-item">
                          <div className="acc-tl-dot">📌</div>
                          <div>
                            <div className="acc-tl-text">
                              {t.action}{t.note ? ` — ${t.note}` : ''}{' '}
                              <span style={{ opacity:.5 }}>by {t.by}</span>
                            </div>
                            <div className="acc-tl-time">{timeAgo(t.at)}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* SLA duration input (unassigned mode only) */}
                  {mode === 'unassigned' && (
                    <div className="acc-sla-row">
                      <span className="acc-sla-label">⏱ SLA deadline (hours):</span>
                      <input
                        className="acc-sla-inp"
                        type="number" min="1" max="720"
                        value={slaDuration[complaint._id] ?? '48'}
                        onChange={e => setSlaDuration(p => ({ ...p, [complaint._id]: e.target.value }))}
                      />
                      <span className="acc-sla-label">hours from now</span>
                    </div>
                  )}

                  {/* ── ACTIONS ── */}
                  <div className="acc-actions">
                    <select
                      className="acc-assign-select"
                      value={selectedAgent[complaint._id] || ''}
                      onChange={e => setSelectedAgent(p => ({ ...p, [complaint._id]: e.target.value }))}
                    >
                      <option value="">
                        👤 {mode === 'assigned' ? 'Select agent to reassign…' : 'Select agent to assign…'}
                      </option>
                      {agents.map(a => (
                        <option key={a._id} value={a._id}>{a.name}</option>
                      ))}
                    </select>

                    {mode === 'assigned' ? (
                      <button
                        className="acc-btn reassign-btn"
                        onClick={() => handleReassign(complaint)}
                        disabled={!selectedAgent[complaint._id] || reassigning[complaint._id]}
                      >
                        {reassigning[complaint._id] ? '⏳ Reassigning…' : '🔄 Reassign'}
                      </button>
                    ) : (
                      <button
                        className="acc-btn primary"
                        onClick={() => handleAssign(complaint)}
                        disabled={!selectedAgent[complaint._id] || assigning[complaint._id]}
                      >
                        {assigning[complaint._id] ? '⏳ Assigning…' : '→ Assign'}
                      </button>
                    )}

                    <select
                      className="acc-status-select"
                      value={selectedStatus[complaint._id] || complaint.status}
                      onChange={e => setSelectedStatus(p => ({ ...p, [complaint._id]: e.target.value }))}
                    >
                      <option value="Pending">⏳ Pending</option>
                      <option value="In Progress">🔄 In Progress</option>
                      <option value="Resolved">✅ Resolved</option>
                      <option value="Rejected">❌ Rejected</option>
                    </select>

                    <button
                      className="acc-btn ghost"
                      onClick={() => handleStatusUpdate(complaint._id, selectedStatus[complaint._id] || complaint.status)}
                    >
                      ↑ Update Status
                    </button>

                    <button
                      className={`acc-btn chat-btn${isChatOn ? ' active' : ''}`}
                      onClick={() => toggleChat(complaint._id)}
                    >
                      {isChatOn ? '✕ Close Chat' : '💬 Chat'}
                    </button>
                  </div>

                  {/* Chat panel */}
                  {isChatOn && (
                    <div className="acc-chat-panel" style={{ marginTop:16, borderRadius:12, overflow:'hidden' }}>
                      <ChatWindow
                        complaintId={complaint._id}
                        name="Admin"
                        onClose={() => toggleChat(complaint._id)}
                      />
                    </div>
                  )}

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}