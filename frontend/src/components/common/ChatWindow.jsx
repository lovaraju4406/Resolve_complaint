import React, { useState, useEffect, useRef } from 'react';
import axios from '../user/axiosInstance';

const ChatWindow = (props) => {
  const [messageInput, setMessageInput] = useState('');
  const messageWindowRef = useRef(null);
  const [messageList, setMessageList] = useState([]);
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState('');
  const [showSummary, setShowSummary] = useState(false);

  const fetchMessageList = async () => {
    try {
      const response = await axios.get(`https://resolve-complaint.onrender.com/messages/${props.complaintId}`);
      setMessageList(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessageList();
  }, [props.complaintId]);

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const sendMessage = async () => {
    if (!messageInput.trim()) return;
    try {
      const data = {
        name: props.name,
        message: messageInput,
        complaintId: props.complaintId,
      };
      const response = await axios.post('https://resolve-complaint.onrender.com/messages', data);
      setMessageList([...messageList, response.data]);
      setMessageInput('');
      fetchMessageList();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    if (messageWindowRef.current) {
      messageWindowRef.current.scrollTop = messageWindowRef.current.scrollHeight;
    }
  };

  // ── AI Summarize chat thread ──
  const summarizeChat = async () => {
    if (messageList.length === 0) return;
    setSummarizing(true);
    setShowSummary(false);
    setSummary('');
    try {
      const transcript = messageList
        .slice()
        .reverse()
        .map(m =>
          `[${new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}] ${m.name}: ${m.message}`
        )
        .join('\n');

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a customer support assistant. Summarize the following complaint chat thread in 3-4 concise bullet points. Focus on: the main issue raised, key actions taken or promised, and current resolution status. Be brief and professional.\n\nChat thread:\n${transcript}\n\nReturn only the bullet points, no preamble.`,
          }],
        }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === 'text')?.text || 'Could not generate summary.';
      setSummary(text.trim());
      setShowSummary(true);
    } catch {
      setSummary('Failed to generate summary. Please try again.');
      setShowSummary(true);
    } finally {
      setSummarizing(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--white, #fff)' }}>

      {/* ── Chat Header ── */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1.5px solid var(--border, #d1ede0)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'var(--s2, #f4fbf7)',
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text, #0f2419)' }}>
          💬 Chat Thread
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Summarize button — only shown when there are messages */}
          {messageList.length >= 2 && (
            <button
              onClick={summarizeChat}
              disabled={summarizing}
              style={{
                fontSize: 11, fontWeight: 700,
                color: summarizing ? '#999' : '#d97706',
                background: summarizing ? '#f5f5f5' : '#fef3c7',
                border: `1px solid ${summarizing ? '#ddd' : '#fde68a'}`,
                borderRadius: 7, padding: '4px 10px',
                cursor: summarizing ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', transition: 'all .12s',
                display: 'inline-flex', alignItems: 'center', gap: 4,
              }}
            >
              {summarizing ? '⏳ Summarizing…' : '✨ AI Summary'}
            </button>
          )}
          {props.onClose && (
            <button
              onClick={props.onClose}
              style={{
                background: 'none', border: 'none',
                fontSize: 15, cursor: 'pointer',
                color: 'var(--muted, #6b8f78)', lineHeight: 1,
              }}
            >✕</button>
          )}
        </div>
      </div>

      {/* ── AI Summary Panel ── */}
      {showSummary && (
        <div style={{
          margin: '10px 12px 0',
          background: '#fef3c7', border: '1.5px solid #fde68a',
          borderRadius: 10, padding: '12px 14px',
          animation: 'fadeIn .2s ease both',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 8,
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '.06em' }}>
              ✨ AI Summary
            </span>
            <button
              onClick={() => setShowSummary(false)}
              style={{ background: 'none', border: 'none', fontSize: 13, cursor: 'pointer', color: '#d97706' }}
            >✕</button>
          </div>
          <div style={{ fontSize: 13, color: '#78350f', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
            {summary}
          </div>
        </div>
      )}

      {/* ── Message List ── */}
      <div
        ref={messageWindowRef}
        style={{
          flex: 1, overflowY: 'auto', padding: '12px 14px',
          display: 'flex', flexDirection: 'column', gap: 10,
        }}
      >
        {messageList.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--muted, #6b8f78)', fontSize: 13, marginTop: 30 }}>
            No messages yet. Start the conversation.
          </div>
        ) : (
          messageList.slice().reverse().map((msg) => {
            const isAgent = msg.name === props.name;
            return (
              <div
                key={msg._id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isAgent ? 'flex-end' : 'flex-start',
                }}
              >
                <div style={{
                  maxWidth: '80%',
                  background: isAgent ? 'var(--gl, #dcfce7)' : 'var(--s2, #f4fbf7)',
                  border: `1.5px solid ${isAgent ? 'var(--gm, #86efac)' : 'var(--border, #d1ede0)'}`,
                  borderRadius: isAgent ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                  padding: '9px 13px',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: isAgent ? 'var(--gd, #15803d)' : 'var(--muted, #6b8f78)', marginBottom: 3 }}>
                    {msg.name}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text, #0f2419)', lineHeight: 1.5 }}>
                    {msg.message}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted, #6b8f78)', marginTop: 4, textAlign: 'right' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })},{' '}
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Input ── */}
      <div style={{
        padding: '10px 12px',
        borderTop: '1.5px solid var(--border, #d1ede0)',
        display: 'flex', gap: 8,
        background: 'var(--s2, #f4fbf7)',
      }}>
        <input
          type="text"
          placeholder="Type a message…"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{
            flex: 1, background: '#fff',
            border: '1.5px solid var(--border, #d1ede0)',
            borderRadius: 9, padding: '9px 13px',
            fontSize: 13, outline: 'none',
            fontFamily: 'inherit', color: 'var(--text, #0f2419)',
            transition: 'border-color .18s',
          }}
          onFocus={e => e.target.style.borderColor = '#16a34a'}
          onBlur={e => e.target.style.borderColor = 'var(--border, #d1ede0)'}
        />
        <button
          onClick={sendMessage}
          disabled={!messageInput.trim()}
          style={{
            padding: '9px 18px', borderRadius: 9, border: 'none',
            background: messageInput.trim()
              ? 'linear-gradient(135deg, #16a34a, #15803d)'
              : 'var(--s3, #eaf6ef)',
            color: messageInput.trim() ? '#fff' : 'var(--muted, #6b8f78)',
            fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
            cursor: messageInput.trim() ? 'pointer' : 'not-allowed',
            transition: 'all .15s', whiteSpace: 'nowrap',
          }}
        >
          Send ↑
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;