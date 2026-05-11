import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#0d1f1a', color: '#fff', marginTop: '4rem', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Main footer content */}
      <div className="container py-5">
        <div className="row g-4">

          {/* ── Brand ── */}
          <div className="col-12 col-md-4">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div style={{
                width: '36px', height: '36px', background: '#1a4a38',
                borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="#f5f0e8">
                  <path d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 3a2 2 0 110 4 2 2 0 010-4zm0 9.5c-2.5 0-4.7-1.3-6-3.2.1-2 4-3.1 6-3.1s5.9 1.1 6 3.1c-1.3 1.9-3.5 3.2-6 3.2z" />
                </svg>
              </div>
              <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, fontSize: '17px', color: '#f5f0e8' }}>
                ResolveNow
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', lineHeight: 1.7 }}>
              Helping customers resolve issues faster, smarter, and stress-free.
            </p>
            <div className="d-flex align-items-center gap-2 mt-3">
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#4a9e7a', display: 'inline-block', animation: 'pulse 2s infinite'
              }} />
              <span style={{ color: '#4a9e7a', fontSize: '12px' }}>System Online</span>
            </div>
          </div>

          {/* ── Sitemap ── */}
          <div className="col-6 col-md-2 offset-md-1">
            <h6 style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Sitemap
            </h6>
            <ul className="list-unstyled mb-0" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { label: 'Home',          to: '/' },
                { label: 'Login',         to: '/Login' },
                { label: 'Sign Up',       to: '/SignUp' },
                { label: 'My Complaints', to: '/Status' },
                { label: 'Submit Issue',  to: '/Complaint' },
              ].map((link) => (
                <li key={link.to} className="d-flex align-items-center gap-2">
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)', display: 'inline-block', flexShrink: 0 }} />
                  <Link to={link.to} style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13.5px',
                    textDecoration: 'none', transition: 'color .2s' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.55)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Help ── */}
          <div className="col-6 col-md-2">
            <h6 style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Help
            </h6>
            <ul className="list-unstyled mb-0" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {['FAQs', 'Departments', 'Support', 'Privacy Policy', 'Terms of Use'].map((item) => (
                <li key={item} className="d-flex align-items-center gap-2">
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)', display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '13.5px', cursor: 'default' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div className="col-12 col-md-3">
            <h6 style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontWeight: 700,
              letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Contact
            </h6>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '13.5px', fontWeight: 600, margin: 0 }}>
                Complaint Care
              </p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', margin: 0 }}>
                ResolveNow
              </p>
              <a href="mailto:support@resolvenow.ap.gov.in"
                style={{ color: '#7ec4a0', fontSize: '13px', textDecoration: 'none', wordBreak: 'break-all' }}>
                resolvenow@gmail.com
              </a>
            </div>

            {/* Emergency box */}
            <div style={{
              background: 'rgba(220,53,69,0.1)', border: '1px solid rgba(220,53,69,0.25)',
              borderRadius: '12px', padding: '12px 14px'
            }}>
              <p style={{ color: '#f87171', fontSize: '12px', fontWeight: 700, margin: '0 0 4px',
                display: 'flex', alignItems: 'center', gap: '6px' }}>
                🚨 Emergency Helpline
              </p>
              <p style={{ color: '#fff', fontFamily: "'Sora', sans-serif", fontSize: '22px',
                fontWeight: 700, margin: 0 }}>
                112
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '14px 0' }}>
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', margin: 0 }}>
            © 2026 ResolveNow. All rights reserved.
          </p>
          <div className="d-flex gap-3">
            {['Privacy', 'Terms', 'Contact'].map((item) => (
              <span key={item} style={{ color: 'rgba(255,255,255,0.25)', fontSize: '12px', cursor: 'default' }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Pulse animation for status dot */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </footer>
  );
}