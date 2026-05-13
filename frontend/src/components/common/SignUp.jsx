import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import Footer from './FooterC';

// ─────────────────────────────────────────
// Inline styles
// ─────────────────────────────────────────
const S = {
  page: {
    margin: 0,
    padding: '1rem',
    minHeight: '100vh',
    background: '#0d1f1a',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    width: '100%',
    maxWidth: '960px',
    minHeight: '600px',
    background: '#f5f0e8',
    borderRadius: '24px',
    overflow: 'hidden',
    boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
  },
  left: {
    padding: '36px 44px',
    display: 'flex',
    flexDirection: 'column',
    background: '#f5f0e8',
  },
  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    marginBottom: '28px',
  },
  logoIcon: {
    width: '34px',
    height: '34px',
    background: '#1a4a38',
    borderRadius: '9px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: "'Sora', sans-serif",
    fontSize: '17px',
    fontWeight: 700,
    color: '#1a4a38',
  },
  heading: {
    fontFamily: "'Sora', sans-serif",
    fontSize: '24px',
    fontWeight: 700,
    color: '#0d1f1a',
    margin: 0,
  },
  sub: {
    fontSize: '13.5px',
    color: '#6b7b74',
    marginTop: '4px',
    marginBottom: '18px',
  },
  roles: {
    display: 'flex',
    gap: '6px',
    marginBottom: '18px',
    background: '#e8e3d8',
    borderRadius: '50px',
    padding: '4px',
  },
  roleBtn: (active) => ({
    flex: 1,
    padding: '8px 0',
    border: 'none',
    background: active ? '#1a4a38' : 'transparent',
    borderRadius: '50px',
    fontSize: '12.5px',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    color: active ? '#f5f0e8' : '#6b7b74',
    cursor: 'pointer',
    transition: 'all .2s',
  }),
  socialBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px',
    border: '1.5px solid #d1ccc0',
    borderRadius: '10px',
    background: '#fff',
    fontSize: '13px',
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    color: '#0d1f1a',
    cursor: 'pointer',
    marginBottom: '10px',
    transition: 'border .2s',
  },
  socialBtnLoading: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  dividerWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: '12px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: '#d1ccc0',
  },
  dividerText: {
    fontSize: '12px',
    color: '#8a9b93',
  },
  field: { marginBottom: '12px' },
  label: {
    display: 'block',
    fontSize: '12.5px',
    fontWeight: 500,
    color: '#3d5248',
    marginBottom: '5px',
  },
  required: { color: '#e25c5c' },
  inputWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '13px',
    width: '16px',
    height: '16px',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '10px 13px 10px 38px',
    border: '1.5px solid #d1ccc0',
    borderRadius: '10px',
    fontSize: '13.5px',
    fontFamily: "'DM Sans', sans-serif",
    background: '#fff',
    color: '#0d1f1a',
    outline: 'none',
    boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'flex',
  },
  submitBtn: {
    width: '100%',
    padding: '13px',
    background: '#1a4a38',
    color: '#f5f0e8',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: 600,
    fontFamily: "'Sora', sans-serif",
    cursor: 'pointer',
    marginTop: '6px',
  },
  loginLink: {
    textAlign: 'center',
    marginTop: '14px',
    fontSize: '13px',
    color: '#6b7b74',
  },
  errorBox: {
    background: '#fff0f0',
    border: '1px solid #f5c6c6',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '12.5px',
    color: '#c0392b',
    marginBottom: '10px',
  },
  right: {
    background: '#1a4a38',
    padding: '40px 40px 36px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  quoteMark: {
    fontSize: '52px',
    color: '#4a9e7a',
    lineHeight: 1,
    marginBottom: '12px',
    fontFamily: 'Georgia, serif',
  },
  quoteText: {
    fontSize: '16px',
    color: '#e8f4ee',
    lineHeight: 1.65,
    marginBottom: '18px',
  },
  reviewer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
  },
  avatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: '#4a9e7a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 700,
    color: '#1a4a38',
    flexShrink: 0,
  },
  reviewerName: { fontSize: '14px', fontWeight: 600, color: '#e8f4ee' },
  reviewerRole: { fontSize: '12px', color: '#7ec4a0' },
  stats: { display: 'flex', gap: '12px', marginTop: '16px' },
  stat: {
    background: 'rgba(255,255,255,0.07)',
    borderRadius: '12px',
    padding: '12px 10px',
    flex: 1,
    textAlign: 'center',
  },
  statNum: {
    fontFamily: "'Sora', sans-serif",
    fontSize: '20px',
    fontWeight: 700,
    color: '#fff',
  },
  statLbl: { fontSize: '11px', color: '#7ec4a0', marginTop: '2px' },
};

// ─────────────────────────────────────────
// SVG Icon helpers
// ─────────────────────────────────────────
const IconUser = () => (
  <svg style={S.inputIcon} viewBox="0 0 24 24" fill="none" stroke="#8a9b93" strokeWidth="1.8" strokeLinecap="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);
const IconEmail = () => (
  <svg style={S.inputIcon} viewBox="0 0 24 24" fill="none" stroke="#8a9b93" strokeWidth="1.8" strokeLinecap="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M2 8l10 6 10-6" />
  </svg>
);
const IconPhone = () => (
  <svg style={S.inputIcon} viewBox="0 0 24 24" fill="none" stroke="#8a9b93" strokeWidth="1.8" strokeLinecap="round">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <circle cx="12" cy="18" r="1" />
  </svg>
);
const IconLock = () => (
  <svg style={S.inputIcon} viewBox="0 0 24 24" fill="none" stroke="#8a9b93" strokeWidth="1.8" strokeLinecap="round">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const IconEye = ({ show }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a9b93" strokeWidth="1.8" strokeLinecap="round">
    {show ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    )}
  </svg>
);

// ─────────────────────────────────────────
// Complaint illustration (right panel)
// ─────────────────────────────────────────
const ComplaintIllustration = () => (
  <svg viewBox="0 0 280 180" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', maxWidth: '260px' }}>
    <circle cx="140" cy="150" r="75" fill="rgba(255,255,255,0.04)" />
    <rect x="30" y="142" width="220" height="7" rx="3" fill="#4a9e7a" opacity=".45" />
    <rect x="88" y="75" width="104" height="66" rx="6" fill="rgba(255,255,255,0.11)" stroke="#4a9e7a" strokeWidth="1.5" />
    <rect x="98" y="83" width="84" height="46" rx="3" fill="rgba(255,255,255,0.07)" />
    <rect x="102" y="87" width="50" height="6" rx="2" fill="#4a9e7a" opacity=".85" />
    <rect x="102" y="97" width="72" height="4" rx="2" fill="rgba(255,255,255,0.22)" />
    <rect x="102" y="105" width="60" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
    <rect x="102" y="113" width="44" height="4" rx="2" fill="rgba(255,255,255,0.22)" />
    <circle cx="162" cy="90" r="3" fill="#7ec4a0" />
    <circle cx="170" cy="90" r="3" fill="#f0b429" />
    <circle cx="178" cy="90" r="3" fill="#e25c5c" opacity=".75" />
    <rect x="133" y="140" width="14" height="5" rx="2" fill="#4a9e7a" opacity=".45" />
    <rect x="125" y="144" width="30" height="4" rx="2" fill="#4a9e7a" opacity=".45" />
    <circle cx="63" cy="103" r="14" fill="rgba(255,255,255,0.09)" stroke="#4a9e7a" strokeWidth="1.5" />
    <circle cx="63" cy="97" r="5" fill="#4a9e7a" opacity=".8" />
    <path d="M53 113c0-5.5 4.5-9 10-9s10 3.5 10 9" fill="#4a9e7a" opacity=".45" />
    <path d="M54 98 a9 9 0 0 1 18 0" stroke="#7ec4a0" strokeWidth="1.8" fill="none" />
    <rect x="51" y="98" width="4" height="7" rx="2" fill="#4a9e7a" />
    <rect x="71" y="98" width="4" height="7" rx="2" fill="#4a9e7a" />
    <g transform="translate(195,52)">
      <rect width="62" height="38" rx="7" fill="rgba(255,255,255,0.1)" stroke="#4a9e7a" strokeWidth="1" />
      <rect x="8" y="8" width="30" height="4" rx="2" fill="#7ec4a0" opacity=".9" />
      <rect x="8" y="16" width="46" height="3" rx="2" fill="rgba(255,255,255,0.2)" />
      <rect x="8" y="23" width="38" height="3" rx="2" fill="rgba(255,255,255,0.15)" />
      <circle cx="52" cy="10" r="4" fill="#7ec4a0" opacity=".8" />
    </g>
    <g transform="translate(8,48)">
      <rect width="58" height="36" rx="7" fill="rgba(255,255,255,0.07)" stroke="#4a9e7a" strokeWidth="1" />
      <rect x="7" y="8" width="28" height="4" rx="2" fill="#f0b429" opacity=".7" />
      <rect x="7" y="16" width="44" height="3" rx="2" fill="rgba(255,255,255,0.18)" />
      <rect x="7" y="23" width="36" height="3" rx="2" fill="rgba(255,255,255,0.12)" />
    </g>
    <circle cx="215" cy="135" r="14" fill="#4a9e7a" opacity=".9" />
    <path d="M208 135l5 5 9-9" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="77" y1="103" x2="88" y2="107" stroke="#4a9e7a" strokeWidth="1" strokeDasharray="3,3" opacity=".5" />
    <line x1="192" y1="72" x2="192" y2="81" stroke="#4a9e7a" strokeWidth="1" strokeDasharray="3,3" opacity=".5" />
  </svg>
);

// ─────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────
const ROLES = ['Ordinary', 'Agent', 'Admin'];

const SignUp = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('Ordinary');
  const [showPwd, setShowPwd] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    userType: 'Ordinary',
  });

  // ── Regular field change ──
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // ── Role toggle ──
  const handleRole = (r) => {
    setRole(r);
    setUser((prev) => ({ ...prev, userType: r }));
  };

  // ── Google OAuth ──
  // Step 1: useGoogleLogin gives us an access_token (implicit flow).
  // Step 2: We exchange it with our backend which fetches the user's
  //         Google profile and creates/logs in the account.
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true);
      setError('');
      try {
        // Fetch user info from Google using the access token
        const googleUserRes = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );

        const { name, email, sub: googleId, picture } = googleUserRes.data;

        // Send to your backend — backend creates user if not exists, returns JWT
        const res = await axios.post('https://resolve-complaint.onrender.com/auth/google', {
          name,
          email,
          googleId,
          picture,
          userType: role,
        });

        // Store token (adjust key name to match your backend)
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
        }

        alert(`Welcome, ${name}!`);
        navigate('/dashboard');
      } catch (err) {
        console.error('Google sign-in error:', err);
        setError('Google sign-in failed. Please try again.');
      } finally {
        setGoogleLoading(false);
      }
    },
    onError: (err) => {
      console.error('Google OAuth error:', err);
      setError('Google sign-in was cancelled or failed.');
      setGoogleLoading(false);
    },
  });

  // ── Manual form submit ──
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const payload = { ...user, userType: role };
    try {
      const res = await axios.post('https://resolve-complaint.onrender.com/SignUp', payload);
      alert('Account created successfully!');
      console.log(res.data.user);
      setUser({ name: '', email: '', password: '', phone: '', userType: 'Ordinary' });
      setRole('Ordinary');
      navigate('/login');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Sign up failed. Please try again.';
      setError(msg);
    }
  };

  return (
    <>
      <div style={S.page}>
        <div style={S.card}>

          {/* ══ LEFT PANEL ══ */}
          <div style={S.left}>

            {/* Logo */}
            <div style={S.logoWrap}>
              <div style={S.logoIcon}>
                <svg width="18" height="18" viewBox="0 0 20 20" fill="#f5f0e8">
                  <path d="M10 2C5.6 2 2 5.6 2 10s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 3a2 2 0 110 4 2 2 0 010-4zm0 9.5c-2.5 0-4.7-1.3-6-3.2.1-2 4-3.1 6-3.1s5.9 1.1 6 3.1c-1.3 1.9-3.5 3.2-6 3.2z" />
                </svg>
              </div>
              <span style={S.logoText}>ResolveNow</span>
            </div>

            <h2 style={S.heading}>Create Your Account</h2>
            <p style={S.sub}>Enter your details and get started</p>

            {/* Role Toggle */}
            <div style={S.roles}>
              {ROLES.map((r) => (
                <button key={r} type="button" style={S.roleBtn(role === r)} onClick={() => handleRole(r)}>
                  {r}
                </button>
              ))}
            </div>

            {/* Error message */}
            {error && <div style={S.errorBox}>{error}</div>}

            {/* Google Sign-In */}
            <button
              type="button"
              style={{ ...S.socialBtn, ...(googleLoading ? S.socialBtnLoading : {}) }}
              onClick={() => !googleLoading && googleLogin()}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <span style={{ fontSize: '13px', color: '#6b7b74' }}>Connecting to Google…</span>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 18 18">
                    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.433 17.64 12.125 17.64 9.2z" />
                    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" />
                    <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" />
                    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" />
                  </svg>
                  Sign in with Google
                </>
              )}
            </button>

            {/* Divider */}
            <div style={S.dividerWrap}>
              <div style={S.dividerLine} />
              <span style={S.dividerText}>OR</span>
              <div style={S.dividerLine} />
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit}>
              <div style={S.field}>
                <label style={S.label}>Full Name <span style={S.required}>*</span></label>
                <div style={S.inputWrap}>
                  <IconUser />
                  <input style={S.input} type="text" name="name" value={user.name}
                    onChange={handleChange} placeholder="John Doe" required />
                </div>
              </div>

              <div style={S.field}>
                <label style={S.label}>Email Address <span style={S.required}>*</span></label>
                <div style={S.inputWrap}>
                  <IconEmail />
                  <input style={S.input} type="email" name="email" value={user.email}
                    onChange={handleChange} placeholder="hello@example.com" required />
                </div>
              </div>

              <div style={S.field}>
                <label style={S.label}>Mobile No. <span style={S.required}>*</span></label>
                <div style={S.inputWrap}>
                  <IconPhone />
                  <input style={S.input} type="text" name="phone" value={user.phone}
                    onChange={handleChange} placeholder="+91 9876543210" required />
                </div>
              </div>

              <div style={S.field}>
                <label style={S.label}>Password <span style={S.required}>*</span></label>
                <div style={S.inputWrap}>
                  <IconLock />
                  <input style={S.input} type={showPwd ? 'text' : 'password'} name="password"
                    value={user.password} onChange={handleChange} placeholder="Enter password" required />
                  <button type="button" style={S.eyeBtn} onClick={() => setShowPwd(!showPwd)}>
                    <IconEye show={showPwd} />
                  </button>
                </div>
              </div>

              <button type="submit" style={S.submitBtn}>
                Register as {role}
              </button>
            </form>

            <p style={S.loginLink}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#1a4a38', fontWeight: 600, textDecoration: 'none' }}>
                Login here
              </Link>
            </p>
          </div>

          {/* ══ RIGHT PANEL ══ */}
          <div style={S.right}>
            <div>
              <div style={S.quoteMark}>"</div>
              <p style={S.quoteText}>
                ResolveNow transformed how we handle complaints. Issues get resolved 3x faster,
                and our team stays on top of every ticket effortlessly.
              </p>
              <div style={S.reviewer}>
                <div style={S.avatar}>SM</div>
                <div>
                  <div style={S.reviewerName}>Sanjay Mehta</div>
                  <div style={S.reviewerRole}>Operations Head, CareFirst</div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ComplaintIllustration />
            </div>

            <div style={S.stats}>
              {[['12k+', 'Complaints Resolved'], ['98%', 'Satisfaction Rate'], ['3x', 'Faster Resolution']].map(
                ([num, lbl]) => (
                  <div key={lbl} style={S.stat}>
                    <div style={S.statNum}>{num}</div>
                    <div style={S.statLbl}>{lbl}</div>
                  </div>
                )
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default SignUp;