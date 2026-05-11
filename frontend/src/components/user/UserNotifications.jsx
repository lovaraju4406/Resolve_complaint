import React, { useState, useEffect } from 'react';
import axios from './axiosInstance';
import { Icon, Icons, timeAgo } from './userUtils';

const NOTIF_ICONS = {
  assign:  { icon: '👤', bg: '#f0f4ff' },
  update:  { icon: '🔄', bg: '#fef9e7' },
  message: { icon: '💬', bg: '#fffff0' },
  submit:  { icon: '✅', bg: '#f0fdf4' },
  resolve: { icon: '🎉', bg: '#f0fdf4' },
  default: { icon: '🔔', bg: '#f5f2ec' },
};

function getNType(notif) {
  const msg = (notif.message || notif.msg || '').toLowerCase();
  if (msg.includes('assign')) return 'assign';
  if (msg.includes('resolve') || msg.includes('closed')) return 'resolve';
  if (msg.includes('progress') || msg.includes('status') || msg.includes('update')) return 'update';
  if (msg.includes('message') || msg.includes('reply')) return 'message';
  if (msg.includes('submitted') || msg.includes('received')) return 'submit';
  return 'default';
}

export default function UserNotifications({ userId, unreadCount, setUnreadCount }) {
  const [notifs, setNotifs]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifs = () => {
    if (!userId) return;
    axios.get(`http://localhost:8000/notifications/${userId}`)
      .then(res => {
        setNotifs(res.data || []);
        setUnreadCount((res.data || []).filter(n => !n.read).length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotifs();
    const iv = setInterval(fetchNotifs, 30000);
    return () => clearInterval(iv);
  }, [userId]);

  const markAllRead = async () => {
    try {
      await axios.put(`http://localhost:8000/notifications/${userId}/read-all`);
      setNotifs(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch {}
  };

  const markOneRead = async (notifId) => {
    setNotifs(prev => prev.map(n => n._id === notifId ? { ...n, read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
    // Optional: backend per-item mark
  };

  if (loading) {
    return (
      <div className="page-fade" style={{ maxWidth: 640 }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skel" style={{ height: 72, marginBottom: 10 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="page-fade" style={{ maxWidth: 640 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontFamily: 'var(--display)', fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
          🔔 Notifications
          {unreadCount > 0 && (
            <span style={{
              marginLeft: 8, background: '#e84545', color: '#fff',
              borderRadius: 50, fontSize: 10, fontWeight: 700, padding: '2px 7px',
            }}>{unreadCount}</span>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unreadCount > 0 && (
            <button className="view-btn" onClick={markAllRead}>
              <Icon d={Icons.check} size={12} /> Mark all read
            </button>
          )}
          <button className="view-btn" onClick={fetchNotifs}>
            <Icon d={Icons.refresh} size={12} /> Refresh
          </button>
        </div>
      </div>

      <div className="pcard">
        {notifs.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">🔔</div>
            <div className="empty-title">All caught up!</div>
            <div className="empty-sub">No notifications right now. We'll alert you on status changes.</div>
          </div>
        ) : notifs.map(n => {
          const type = getNType(n);
          const meta = NOTIF_ICONS[type] || NOTIF_ICONS.default;
          return (
            <div key={n._id}
              className={`notif-full-item${!n.read ? ' unread' : ''}`}
              onClick={() => !n.read && markOneRead(n._id)}>
              <div className="notif-big-icon" style={{ background: meta.bg }}>{meta.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, color: 'var(--text)', lineHeight: 1.5 }}>
                  {n.message || n.msg}
                </div>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>
                  {timeAgo(n.createdAt || n.time)}
                </div>
              </div>
              {!n.read && <div className="unread-dot" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}