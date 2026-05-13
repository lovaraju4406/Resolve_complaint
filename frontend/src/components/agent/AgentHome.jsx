import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../user/axiosInstance';

import { CSS } from './agentStyles';
import { Toasts, toast } from './agentUtils';
import AgentLanding    from './AgentLanding';
import AgentDashboard  from './AgentDashboard';
import AgentComplaints from './AgentComplaints';
import AgentProfile    from './AgentProfile';
import Footer from '../common/FooterC';

const TABS = [
  { id: 'dashboard',  label: 'Dashboard',      },
  { id: 'complaints', label: 'My Complaints',  },
  
];

export default function AgentHome() {
  const navigate = useNavigate();
  const notifRef   = useRef(null);
  const profileRef = useRef(null);

  const [user, setUser]             = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [activeTab, setActiveTab]   = useState('landing'); // ← starts on landing now

  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen]         = useState(false);
  const [profileOpen, setProfileOpen]     = useState(false);
  const [unreadCount, setUnreadCount]     = useState(0);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/Login'); return; }
    const u = JSON.parse(stored);
    setUser(u);

    axios.get(`https://resolve-complaint.onrender.com/allcomplaints/${u._id}`)
      .then(res => { setComplaints(res.data || []); setLoading(false); })
      .catch(() => setLoading(false));

    axios.get(`https://resolve-complaint.onrender.com/notifications/${u._id}`)
      .then(res => {
        setNotifications(res.data || []);
        setUnreadCount((res.data || []).filter(n => !n.read).length);
      })
      .catch(() => setNotifications(null));
  }, [navigate]);

  const stats = {
    total:     complaints.length,
    pending:   complaints.filter(c => c.status === 'Pending').length,
    progress:  complaints.filter(c => c.status === 'In Progress').length,
    resolved:  complaints.filter(c => c.status === 'Resolved' || c.status === 'completed').length,
    escalated: complaints.filter(c => c.status === 'Escalated').length,
  };

  const computedNotifs = [
    { icon: '📋', msg: `You have ${stats.pending} pending complaint${stats.pending !== 1 ? 's' : ''}`, time: 'Now', unread: true },
    { icon: '✅', msg: `${stats.resolved} complaint${stats.resolved !== 1 ? 's' : ''} resolved in total`, time: 'Today', unread: false },
    { icon: '🔔', msg: 'Admin has assigned new complaints', time: 'Earlier', unread: false },
  ];

  const displayNotifs = notifications !== null ? notifications : computedNotifs;
  const hasUnread = unreadCount > 0 || stats.pending > 0;

  const markAllRead = () => {
    setUnreadCount(0);
    if (user?._id) {
      axios.put(`https://resolve-complaint.onrender.com/notifications/${user._id}/read-all`).catch(() => {});
    }
  };

  const logout = () => { localStorage.removeItem('user'); navigate('/'); };

  if (!user) return null;

  return (
    <>
      <style>{CSS}</style>
      <Toasts />

      {/* ════ NAVBAR ════ */}
      <nav className="ag-nav">

  {/* LEFT */}
  <div className="ag-nav-left">

    <div
      className="ag-nav-mark"
      onClick={() => setActiveTab('landing')}
    >
      🎯
    </div>

    <div
      className="ag-nav-brand-wrap"
      onClick={() => setActiveTab('landing')}
    >
      <div className="ag-nav-brand">
        ResolveNow
      </div>

      <div className="ag-nav-sub">
        AGENT PORTAL
      </div>
    </div>

  </div>

  {/* CENTER */}
  <div className="ag-nav-center">

    {TABS.map(t => (
      <button
        key={t.id}
        className={`ag-nav-tab ${activeTab === t.id ? 'active' : ''}`}
        onClick={() => setActiveTab(t.id)}
      >

        <span className="ag-nav-tab-icon">
          {t.icon}
        </span>

        <span>
          {t.label}
        </span>

        {t.id === 'complaints' && stats.pending > 0 && (
          <span className="tab-badge">
            {stats.pending}
          </span>
        )}

      </button>
    ))}

  </div>

  {/* RIGHT */}
  <div className="ag-nav-right">

    {/* SEARCH */}
    <div className="ag-search-wrap">

  <div className="ag-search-icon">
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  </div>

  <input
    type="text"
    className="ag-nav-search"
    placeholder="Search complaints..."
  />

</div>

    {/* NOTIFICATION */}
    <div className="ag-notif-wrap" ref={notifRef}>

      <button
        className="ag-notif-btn"
        onClick={() => {
          setNotifOpen(o => !o);
          setProfileOpen(false);
        }}
      >
        🔔

        {hasUnread && (
          <span className="ag-notif-dot"/>
        )}

      </button>

      {notifOpen && (
        <div className="ag-notif-drop">

          <div className="ag-notif-head">

            <span>
              Notifications
            </span>

            {unreadCount > 0 && (
              <button
                className="ag-notif-mark-all"
                onClick={markAllRead}
              >
                Mark all read
              </button>
            )}

          </div>

          {displayNotifs.length === 0 ? (

            <div className="ag-notif-empty">
              No new notifications
            </div>

          ) : (

            displayNotifs.map((n, i) => (
              <div
                key={i}
                className={`ag-notif-item ${n.unread || !n.read ? 'unread' : ''}`}
              >

                <div className="ag-notif-icon">
                  {n.icon}
                </div>

                <div>
                  <div className="ag-notif-msg">
                    {n.message || n.msg}
                  </div>

                  <div className="ag-notif-time">
                    {n.time || n.createdAt || 'Now'}
                  </div>
                </div>

              </div>
            ))

          )}

        </div>
      )}

    </div>

    {/* PROFILE */}
    <div className="ag-profile-wrap" ref={profileRef}>

      <div
        className="ag-profile-btn"
        onClick={() => {
          setProfileOpen(o => !o);
          setNotifOpen(false);
        }}
      >

        <div className="ag-profile-av">
          {user.name?.[0]?.toUpperCase()}
        </div>

        <span className="ag-profile-name">
          {user.name?.split(' ')[0]}
        </span>

        <span className={`ag-profile-caret ${profileOpen ? 'open' : ''}`}>
          ▾
        </span>

      </div>

      {profileOpen && (
        <div className="ag-profile-drop">

          <button
            className="ag-profile-drop-item"
            onClick={() => {
              setActiveTab('profile');
              setProfileOpen(false);
            }}
          >
            👤 My Profile
          </button>

          <button
            className="ag-profile-drop-item"
            onClick={() => {
              setActiveTab('profile');
              setProfileOpen(false);
            }}
          >
            🔒 Change Password
          </button>

          <div className="ag-profile-drop-divider"/>

          <button
            className="ag-profile-drop-item logout"
            onClick={logout}
          >
            🚪 Log Out
          </button>

        </div>
      )}

    </div>

    {/* CTA */}
    <button
      className="ag-logout-btn"
      onClick={logout}
    >
      Log Out
    </button>

  </div>

</nav>

      {/* ════ PAGE CONTENT ════ */}
      <div className="ag-page" style={{ padding: activeTab === 'landing' ? 0 : 26 }}>

        {loading && activeTab === 'complaints' ? (
          <div className="ag-grid">
            {[1, 2, 3].map(i => <div key={i} className="ag-skel" />)}
          </div>
        ) : (
          <>
            {activeTab === 'landing' && (
              <AgentLanding
                user={user}
                stats={stats}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'dashboard' && (
              <AgentDashboard
                user={user}
                stats={stats}
                complaints={complaints}
                setActiveTab={setActiveTab}
              />
            )}
            {activeTab === 'complaints' && (
              <AgentComplaints
                user={user}
                complaints={complaints}
                setComplaints={setComplaints}
              />
            )}
            {activeTab === 'profile' && (
              <AgentProfile
                user={user}
                stats={stats}
                complaints={complaints}
              />
            )}
          </>
        )}
      </div>

      <Footer />
    </>
  );
}