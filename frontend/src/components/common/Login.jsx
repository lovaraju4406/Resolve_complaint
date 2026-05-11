import axios from 'axios';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

const SLIDES = [
  {
    img: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1600&q=85',
    label: 'Professional support, every step',
    caption: 'Trusted by thousands of customers',
  },
  {
    img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=85',
    label: 'Real agents. Real resolutions.',
    caption: 'Average resolution time under 24 hours',
  },
  {
    img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1600&q=85',
    label: 'Your voice matters here',
    caption: '98% customer satisfaction rate',
  },
  {
    img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&q=85',
    label: 'Fast. Transparent. Reliable.',
    caption: '12,000+ complaints resolved',
  },
];

const Login = () => {
  const navigate = useNavigate();

  const [user, setUser]         = useState({ email: '', password: '' });
  const [showPwd, setShowPwd]   = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  const [slide, setSlide]   = useState(0);
  const [fading, setFading] = useState(false);

  const [fpOpen, setFpOpen]       = useState(false);
  const [fpStep, setFpStep]       = useState('email');
  const [fpEmail, setFpEmail]     = useState('');
  const [fpOtp, setFpOtp]         = useState('');
  const [fpNewPwd, setFpNewPwd]   = useState('');
  const [fpConfirm, setFpConfirm] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError]     = useState('');
  const [fpShowNew, setFpShowNew] = useState(false);
  const [fpShowConf, setFpShowConf] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setFading(true);
      setTimeout(() => { setSlide(s => (s + 1) % SLIDES.length); setFading(false); }, 700);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    document.body.style.overflow = fpOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [fpOpen]);

  const redirectByRole = (userType) => {
    switch (userType) {
      case 'Admin':    navigate('/AdminHome'); break;
      case 'Ordinary': navigate('/home');      break;
      case 'Agent':    navigate('/AgentHome'); break;
      default:         navigate('/Login');
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post('http://localhost:8000/Login', user);
      const { token, ...userData } = res.data;
      localStorage.setItem('user',  JSON.stringify(userData));
      localStorage.setItem('token', token);
      redirectByRole(userData.userType);
    } catch (err) {
      setError(err.response?.status === 401
        ? 'Invalid email or password.'
        : 'Something went wrong. Please try again.');
    } finally { setLoading(false); }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true); setError('');
      try {
        const { data: profile } = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        );
        const res = await axios.post('http://localhost:8000/auth/google', {
          name: profile.name, email: profile.email,
          googleId: profile.sub, picture: profile.picture, userType: 'Ordinary',
        });
        const { token, user: googleUser } = res.data;
        localStorage.setItem('user',  JSON.stringify(googleUser));
        localStorage.setItem('token', token);
        redirectByRole(googleUser.userType);
      } catch {
        setError('Google sign-in failed. Please try again.');
      } finally { setGoogleLoading(false); }
    },
    onError: () => { setError('Google sign-in was cancelled.'); setGoogleLoading(false); },
  });

  const openForgot = () => {
    setFpOpen(true); setFpStep('email');
    setFpEmail(''); setFpOtp(''); setFpNewPwd(''); setFpConfirm('');
    setFpError(''); setFpLoading(false);
  };
  const closeForgot = () => setFpOpen(false);

  const handleFpEmail = async (e) => {
    e.preventDefault();
    if (!fpEmail) { setFpError('Please enter your email.'); return; }
    setFpLoading(true); setFpError('');
    try {
      await axios.post('http://localhost:8000/forgot-password', { email: fpEmail });
      setFpStep('otp');
    } catch (err) {
      setFpError(err.response?.data?.message || 'No account found with that email.');
    } finally { setFpLoading(false); }
  };

  const handleFpOtp = async (e) => {
    e.preventDefault();
    if (fpOtp.length < 4) { setFpError('Please enter the full OTP.'); return; }
    setFpLoading(true); setFpError('');
    try {
      await axios.post('http://localhost:8000/verify-otp', { email: fpEmail, otp: fpOtp });
      setFpStep('reset');
    } catch (err) {
      setFpError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally { setFpLoading(false); }
  };

  const handleFpReset = async (e) => {
    e.preventDefault();
    if (fpNewPwd.length < 6) { setFpError('Password must be at least 6 characters.'); return; }
    if (fpNewPwd !== fpConfirm) { setFpError('Passwords do not match.'); return; }
    setFpLoading(true); setFpError('');
    try {
      await axios.post('http://localhost:8000/reset-password', { email: fpEmail, otp: fpOtp, newPassword: fpNewPwd });
      setFpStep('done');
    } catch (err) {
      setFpError(err.response?.data?.message || 'Failed to reset password.');
    } finally { setFpLoading(false); }
  };

  const fpSteps = ['email', 'otp', 'reset', 'done'];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700;900&family=Nunito:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin:0; padding:0; }
        html, body, #root { width:100%; height:100%; }

        @keyframes spin    { to { transform:rotate(360deg); } }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn { from{opacity:0;transform:translateX(-18px)} to{opacity:1;transform:translateX(0)} }
        @keyframes modalIn { from{opacity:0;transform:scale(0.94) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes shake   { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-6px)} 40%,80%{transform:translateX(6px)} }
        @keyframes checkPop { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }

        :root {
          --primary:   #e05a2b;
          --primary-h: #c94f1a;
          --primary-l: #fff0eb;
          --primary-m: #fdddd0;
          --ink:       #1a1a2e;
          --ink2:      #3d3d5c;
          --muted:     #7a7a9a;
          --border:    #e2e0f0;
          --surface:   #ffffff;
          --bg:        #f8f7ff;
          --success:   #0d9c6e;
          --font-h:    'Fraunces', serif;
          --font-b:    'Nunito', sans-serif;
        }

        .lp-root {
          font-family: var(--font-b);
          width: 100vw; min-height: 100vh;
          display: flex;
          background: var(--bg);
        }

        /* ── LEFT PANEL (image) ── */
        .lp-left {
          flex: 1.1;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        @media (max-width: 860px) { .lp-left { display: none; } }

        .lp-left-img {
          position: absolute; inset: 0;
          width: 100%; height: 100%; object-fit: cover;
          transition: opacity 0.7s ease;
        }
        .lp-left-img.fading { opacity: 0; }

        .lp-left-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(10,10,30,0.15) 0%,
            rgba(10,10,30,0.55) 60%,
            rgba(10,10,30,0.82) 100%
          );
        }

        .lp-left-content {
          position: relative; z-index: 2;
          padding: 2.5rem 3rem 3rem;
        }

        .lp-left-logo {
          display: flex; align-items: center; gap: 0.7rem;
          margin-bottom: auto;
          position: absolute; top: 2rem; left: 2.5rem;
        }
        .lp-left-logo-icon {
          width: 36px; height: 36px;
          background: var(--primary);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
        }
        .lp-left-logo-name {
          font-family: var(--font-h);
          font-size: 1.05rem; font-weight: 700;
          color: white; letter-spacing: 0.01em;
        }

        .lp-left-text {
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .lp-left-text.fading { opacity: 0; transform: translateY(10px); }

        .lp-left-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 100px;
          padding: 0.3rem 0.9rem;
          font-size: 0.72rem; font-weight: 600;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.07em; text-transform: uppercase;
          margin-bottom: 0.9rem;
        }
        .lp-left-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); }

        .lp-left-headline {
          font-family: var(--font-h);
          font-size: 2.3rem; font-weight: 700;
          color: white; line-height: 1.2;
          margin-bottom: 0.7rem;
          letter-spacing: -0.01em;
        }

        .lp-left-caption {
          font-size: 0.88rem; color: rgba(255,255,255,0.6);
          font-weight: 500;
        }

        .lp-dots {
          display: flex; gap: 7px;
          margin-top: 1.6rem;
        }
        .lp-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: rgba(255,255,255,0.3); border: none;
          cursor: pointer; padding: 0;
          transition: background 0.3s, transform 0.3s;
        }
        .lp-dot.active { background: var(--primary); transform: scale(1.4); }

        /* trust badges */
        .lp-trust {
          display: flex; gap: 1.5rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.15);
        }
        .lp-trust-item { text-align: center; }
        .lp-trust-num {
          font-family: var(--font-h);
          font-size: 1.4rem; font-weight: 700; color: white; line-height: 1;
        }
        .lp-trust-label { font-size: 0.7rem; color: rgba(255,255,255,0.5); margin-top: 3px; }

        /* ── RIGHT PANEL (form) ── */
        .lp-right {
          width: 440px;
          min-height: 100vh;
          background: var(--surface);
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 3rem 2.8rem;
          position: relative;
          overflow-y: auto;
          box-shadow: -4px 0 32px rgba(0,0,0,0.06);
        }
        @media (max-width: 860px) {
          .lp-right { width: 100%; padding: 2.2rem 1.6rem; }
        }

        .lp-right-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 2.5rem;
        }
        .lp-right-logo {
          display: flex; align-items: center; gap: 0.6rem;
          text-decoration: none;
        }
        .lp-right-logo-icon {
          width: 34px; height: 34px;
          background: var(--primary);
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
        }
        .lp-right-logo-name {
          font-family: var(--font-h);
          font-size: 1rem; font-weight: 700;
          color: var(--ink);
        }
        .lp-right-signup-link {
          font-size: 0.82rem; color: var(--muted);
          text-decoration: none;
          display: flex; align-items: center; gap: 4px;
        }
        .lp-right-signup-link span { color: var(--primary); font-weight: 700; }
        .lp-right-signup-link:hover span { text-decoration: underline; }

        .lp-welcome {
          margin-bottom: 0.4rem;
          animation: fadeUp 0.55s ease both;
        }
        .lp-welcome-eyebrow {
          font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--primary);
          margin-bottom: 0.4rem;
        }
        .lp-welcome-h1 {
          font-family: var(--font-h);
          font-size: 2rem; font-weight: 900;
          color: var(--ink); line-height: 1.1;
          margin-bottom: 0.4rem;
        }
        .lp-welcome-sub {
          font-size: 0.88rem; color: var(--muted);
          line-height: 1.65; margin-bottom: 1.8rem;
        }

        /* error */
        .lp-err {
          background: #fff4f1;
          border: 1px solid #fdc4b0;
          color: #c94f1a;
          font-size: 0.82rem; font-weight: 500;
          padding: 0.7rem 1rem; border-radius: 10px;
          margin-bottom: 1.2rem;
          display: flex; align-items: center; gap: 8px;
          animation: shake 0.4s ease;
        }

        /* Google btn */
        .lp-google-btn {
          width: 100%; padding: 0.82rem 1rem;
          display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          background: white;
          border: 1.5px solid var(--border);
          border-radius: 12px;
          color: var(--ink2); font-size: 0.9rem; font-weight: 600;
          font-family: var(--font-b);
          cursor: pointer; margin-bottom: 1.3rem;
          transition: border-color 0.2s, box-shadow 0.2s, transform 0.15s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.07);
        }
        .lp-google-btn:hover:not(:disabled) {
          border-color: #bbb8d4;
          box-shadow: 0 3px 12px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }
        .lp-google-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        /* divider */
        .lp-divider {
          display: flex; align-items: center; gap: 0.8rem;
          margin-bottom: 1.3rem;
        }
        .lp-divider::before, .lp-divider::after {
          content: ''; flex: 1; height: 1px; background: var(--border);
        }
        .lp-divider span { font-size: 0.72rem; color: var(--muted); letter-spacing: 0.05em; white-space: nowrap; }

        /* form fields */
        .lp-field { margin-bottom: 1.1rem; }
        .lp-label {
          display: block; font-size: 0.72rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--ink2); margin-bottom: 0.45rem;
        }
        .lp-iw { position: relative; }
        .lp-inp {
          width: 100%; padding: 0.82rem 2.8rem 0.82rem 1rem;
          background: var(--bg); border: 1.5px solid var(--border);
          border-radius: 12px; font-size: 0.9rem;
          font-family: var(--font-b); color: var(--ink); outline: none;
          transition: border-color 0.18s, background 0.18s, box-shadow 0.18s;
        }
        .lp-inp::placeholder { color: #b0aec8; }
        .lp-inp:focus {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 3px rgba(224,90,43,0.12);
        }
        .lp-eye {
          position: absolute; right: 0.85rem; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: var(--muted); display: flex; align-items: center;
          padding: 0; transition: color 0.15s;
        }
        .lp-eye:hover { color: var(--primary); }

        /* remember + forgot */
        .lp-row {
          display: flex; align-items: center; justify-content: space-between;
          margin: 0.1rem 0 1.6rem;
        }
        .lp-check-label {
          display: flex; align-items: center; gap: 7px;
          font-size: 0.83rem; color: var(--muted); cursor: pointer; user-select: none;
        }
        .lp-check-label input { width: 15px; height: 15px; accent-color: var(--primary); cursor: pointer; }
        .lp-forgot-btn {
          font-size: 0.83rem; color: var(--primary); font-weight: 700;
          background: none; border: none; cursor: pointer;
          font-family: var(--font-b); padding: 0;
          transition: opacity 0.15s;
        }
        .lp-forgot-btn:hover { opacity: 0.7; }

        /* submit btn */
        .lp-btn {
          width: 100%; padding: 0.95rem;
          background: var(--primary);
          color: white; border: none; border-radius: 12px;
          font-size: 1rem; font-weight: 700;
          font-family: var(--font-b); cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.55rem;
          box-shadow: 0 4px 16px rgba(224,90,43,0.32);
          transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
          margin-bottom: 1.4rem;
        }
        .lp-btn:hover:not(:disabled) {
          background: var(--primary-h);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(224,90,43,0.4);
        }
        .lp-btn:active:not(:disabled) { transform: translateY(0); }
        .lp-btn:disabled { background: #d4d2e3; box-shadow: none; cursor: not-allowed; color: #a0a0b8; }

        .lp-spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,0.35); border-top-color: white; border-radius: 50%; animation: spin 0.7s linear infinite; }
        .lp-spinner.dark { border-color: rgba(224,90,43,0.25); border-top-color: var(--primary); }

        .lp-register { text-align: center; font-size: 0.83rem; color: var(--muted); }
        .lp-register a { color: var(--primary); font-weight: 700; text-decoration: none; }
        .lp-register a:hover { text-decoration: underline; }

        /* ── FORGOT PASSWORD MODAL ── */
        .fp-overlay {
          position: fixed; inset: 0; z-index: 50;
          background: rgba(26,26,46,0.45);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: 1rem;
          animation: fadeUp 0.2s ease both;
        }
        .fp-modal {
          background: white;
          border: 1px solid var(--border);
          border-radius: 20px; padding: 2.4rem 2.2rem;
          width: 100%; max-width: 400px;
          position: relative;
          box-shadow: 0 24px 60px rgba(0,0,0,0.15);
          animation: modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        .fp-close {
          position: absolute; top: 1.1rem; right: 1.1rem;
          background: var(--bg); border: 1px solid var(--border);
          color: var(--muted); width: 32px; height: 32px;
          border-radius: 50%; display: flex; align-items: center;
          justify-content: center; cursor: pointer; font-size: 0.95rem;
          transition: background 0.15s, color 0.15s;
        }
        .fp-close:hover { background: var(--primary-m); color: var(--primary); }

        .fp-step-bar-wrap { display: flex; gap: 4px; margin-bottom: 1.8rem; }
        .fp-step-bar { flex: 1; height: 3px; border-radius: 2px; background: var(--border); transition: background 0.4s; }
        .fp-step-bar.done { background: var(--primary); }

        .fp-icon {
          width: 54px; height: 54px;
          background: var(--primary-l); border: 1.5px solid var(--primary-m);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem; margin: 0 auto 1.2rem;
        }
        .fp-title { font-family: var(--font-h); font-size: 1.5rem; font-weight: 900; color: var(--ink); text-align: center; margin-bottom: 0.35rem; }
        .fp-sub { font-size: 0.84rem; color: var(--muted); text-align: center; line-height: 1.65; margin-bottom: 1.5rem; }
        .fp-email-hi { color: var(--primary); font-weight: 700; }

        .fp-err { background: #fff4f1; border: 1px solid #fdc4b0; color: #c94f1a; font-size: 0.8rem; padding: 0.65rem 0.9rem; border-radius: 8px; margin-bottom: 1rem; animation: shake 0.4s ease; display: flex; align-items: center; gap: 7px; }

        .fp-field { margin-bottom: 1rem; }
        .fp-label { display: block; font-size: 0.68rem; font-weight: 700; color: var(--ink2); letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 0.42rem; }
        .fp-iw { position: relative; }
        .fp-inp { width: 100%; padding: 0.82rem 2.8rem 0.82rem 1rem; background: var(--bg); border: 1.5px solid var(--border); border-radius: 10px; font-size: 0.9rem; font-family: var(--font-b); color: var(--ink); outline: none; transition: border-color 0.18s, box-shadow 0.18s; }
        .fp-inp::placeholder { color: #b0aec8; }
        .fp-inp:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(224,90,43,0.1); }
        .fp-eye { position: absolute; right: 0.85rem; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--muted); display: flex; padding: 0; transition: color 0.15s; }
        .fp-eye:hover { color: var(--primary); }

        .fp-otp-inp { width: 100%; text-align: center; padding: 0.9rem; background: var(--bg); border: 1.5px solid var(--border); border-radius: 10px; font-size: 1.8rem; font-family: var(--font-h); color: var(--ink); letter-spacing: 0.5em; outline: none; transition: border-color 0.18s, box-shadow 0.18s; }
        .fp-otp-inp:focus { border-color: var(--primary); box-shadow: 0 0 0 3px rgba(224,90,43,0.1); }
        .fp-otp-hint { text-align: center; font-size: 0.76rem; color: var(--muted); margin-top: 0.5rem; margin-bottom: 1rem; }
        .fp-resend { background: none; border: none; cursor: pointer; color: var(--primary); font-size: 0.76rem; font-weight: 700; font-family: var(--font-b); padding: 0; transition: opacity 0.15s; }
        .fp-resend:hover { opacity: 0.7; }

        .fp-btn { width: 100%; padding: 0.88rem; background: var(--primary); color: white; border: none; border-radius: 10px; font-size: 0.95rem; font-weight: 700; font-family: var(--font-b); cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; box-shadow: 0 4px 14px rgba(224,90,43,0.28); transition: transform 0.15s, box-shadow 0.15s, background 0.15s; margin-top: 0.4rem; }
        .fp-btn:hover:not(:disabled) { background: var(--primary-h); transform: translateY(-2px); box-shadow: 0 8px 22px rgba(224,90,43,0.36); }
        .fp-btn:disabled { background: #d4d2e3; box-shadow: none; cursor: not-allowed; color: #a0a0b8; }

        .fp-back { display: flex; align-items: center; gap: 5px; background: none; border: none; cursor: pointer; color: var(--muted); font-size: 0.8rem; font-family: var(--font-b); padding: 0; margin-top: 1rem; transition: color 0.15s; width: 100%; justify-content: center; }
        .fp-back:hover { color: var(--ink); }

        .fp-success { text-align: center; padding: 0.5rem 0; }
        .fp-check { width: 68px; height: 68px; margin: 0 auto 1.2rem; animation: checkPop 0.4s ease both; }
        .fp-check circle { fill: var(--primary-l); stroke: var(--primary); stroke-width: 2; }
        .fp-check path { fill: none; stroke: var(--primary); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
        .fp-success-title { font-family: var(--font-h); font-size: 1.5rem; font-weight: 900; color: var(--ink); margin-bottom: 0.5rem; }
        .fp-success-msg { font-size: 0.84rem; color: var(--muted); line-height: 1.65; margin-bottom: 1.5rem; }
      `}</style>

      <div className="lp-root">

        {/* ── LEFT: IMAGE PANEL ── */}
        <div className="lp-left">
          <img
            className={`lp-left-img${fading ? ' fading' : ''}`}
            src={SLIDES[slide].img} alt="complaint care"
          />
          <div className="lp-left-overlay" />

          {/* Logo top-left */}
          <div className="lp-left-logo">
            <div className="lp-left-logo-icon">🎯</div>
            <span className="lp-left-logo-name">ResolveNow</span>
          </div>

          {/* Bottom text */}
          <div className="lp-left-content">
            <div className={`lp-left-text${fading ? ' fading' : ''}`}>
              <div className="lp-left-tag">
                <span className="lp-left-tag-dot" />
                Complaint Care Platform
              </div>
              <div className="lp-left-headline">{SLIDES[slide].label}</div>
              <div className="lp-left-caption">{SLIDES[slide].caption}</div>
            </div>

            <div className="lp-dots">
              {SLIDES.map((_, i) => (
                <button key={i}
                  className={`lp-dot${slide === i ? ' active' : ''}`}
                  onClick={() => { setFading(true); setTimeout(() => { setSlide(i); setFading(false); }, 700); }}
                />
              ))}
            </div>

            <div className="lp-trust">
              {[['12K+','Resolved'], ['98%','Satisfaction'], ['<24h','Response']].map(([n, l]) => (
                <div className="lp-trust-item" key={l}>
                  <div className="lp-trust-num">{n}</div>
                  <div className="lp-trust-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT: FORM PANEL ── */}
        <div className="lp-right">
          <div className="lp-right-top">
            <Link to="/" className="lp-right-logo">
              <div className="lp-right-logo-icon">🎯</div>
              <span className="lp-right-logo-name">ResolveNow</span>
            </Link>
            <Link to="/SignUp" className="lp-right-signup-link">
              New here? <span>Sign up</span>
            </Link>
          </div>

          <div className="lp-welcome">
            <div className="lp-welcome-eyebrow">Welcome back</div>
            <h1 className="lp-welcome-h1">Sign in to your account</h1>
            <p className="lp-welcome-sub">Track complaints, chat with agents, and get resolved fast.</p>
          </div>

          {error && (
            <div className="lp-err">
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}

          {/* Google */}
          <button type="button" className="lp-google-btn"
            onClick={() => !googleLoading && googleLogin()}
            disabled={googleLoading || loading}>
            {googleLoading ? (
              <><div className="lp-spinner dark" />Connecting…</>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 18 18">
                  <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908C16.658 14.433 17.64 12.125 17.64 9.2z"/>
                  <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"/>
                  <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/>
                  <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          <div className="lp-divider"><span>or continue with email</span></div>

          <form onSubmit={handleSubmit}>
            <div className="lp-field">
              <label className="lp-label">Email address</label>
              <div className="lp-iw">
                <input type="email" name="email" className="lp-inp"
                  placeholder="you@example.com" value={user.email}
                  onChange={handleChange} required autoComplete="email" />
              </div>
            </div>

            <div className="lp-field">
              <label className="lp-label">Password</label>
              <div className="lp-iw">
                <input type={showPwd ? 'text' : 'password'} name="password"
                  className="lp-inp" placeholder="Enter your password"
                  value={user.password} onChange={handleChange}
                  required autoComplete="current-password" />
                <button type="button" className="lp-eye"
                  onClick={() => setShowPwd(!showPwd)} tabIndex={-1}>
                  {showPwd
                    ? <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              </div>
            </div>

            <div className="lp-row">
              <label className="lp-check-label">
                <input type="checkbox" checked={remember}
                  onChange={e => setRemember(e.target.checked)} />
                Remember me
              </label>
              <button type="button" className="lp-forgot-btn" onClick={openForgot}>
                Forgot password?
              </button>
            </div>

            <button type="submit" className="lp-btn" disabled={loading || googleLoading}>
              {loading ? <><div className="lp-spinner" />Signing in…</> : 'Sign in →'}
            </button>
          </form>

          <div className="lp-register">
            Don't have an account? <Link to="/SignUp">Create one free</Link>
          </div>
        </div>
      </div>

      {/* ── FORGOT PASSWORD MODAL ── */}
      {fpOpen && (
        <div className="fp-overlay" onClick={e => e.target === e.currentTarget && closeForgot()}>
          <div className="fp-modal">
            <button className="fp-close" onClick={closeForgot}>✕</button>

            <div className="fp-step-bar-wrap">
              {fpSteps.map((s, i) => (
                <div key={s} className={`fp-step-bar${fpSteps.indexOf(fpStep) >= i ? ' done' : ''}`} />
              ))}
            </div>

            {fpStep === 'email' && (
              <>
                <div className="fp-icon">📧</div>
                <div className="fp-title">Reset Password</div>
                <p className="fp-sub">Enter your registered email and we'll send you a reset OTP.</p>
                {fpError && <div className="fp-err">⚠ {fpError}</div>}
                <form onSubmit={handleFpEmail}>
                  <div className="fp-field">
                    <label className="fp-label">Email address</label>
                    <div className="fp-iw">
                      <input type="email" className="fp-inp" placeholder="you@example.com"
                        value={fpEmail} onChange={e => { setFpEmail(e.target.value); setFpError(''); }}
                        required autoFocus />
                    </div>
                  </div>
                  <button type="submit" className="fp-btn" disabled={fpLoading}>
                    {fpLoading ? <><div className="lp-spinner" />Sending…</> : 'Send OTP →'}
                  </button>
                </form>
                <button className="fp-back" onClick={closeForgot}>← Back to login</button>
              </>
            )}

            {fpStep === 'otp' && (
              <>
                <div className="fp-icon">🔢</div>
                <div className="fp-title">Check your inbox</div>
                <p className="fp-sub">
                  We sent a 6-digit code to <span className="fp-email-hi">{fpEmail}</span>
                </p>
                {fpError && <div className="fp-err">⚠ {fpError}</div>}
                <form onSubmit={handleFpOtp}>
                  <div className="fp-field">
                    <label className="fp-label">One-time password</label>
                    <input type="text" className="fp-otp-inp" placeholder="------"
                      value={fpOtp}
                      onChange={e => { setFpOtp(e.target.value.replace(/\D/g,'').slice(0,6)); setFpError(''); }}
                      maxLength={6} inputMode="numeric" autoFocus />
                    <div className="fp-otp-hint">
                      Didn't receive it?{' '}
                      <button type="button" className="fp-resend"
                        onClick={() => { setFpStep('email'); setFpError(''); }}>Resend</button>
                    </div>
                  </div>
                  <button type="submit" className="fp-btn" disabled={fpLoading || fpOtp.length < 4}>
                    {fpLoading ? <><div className="lp-spinner" />Verifying…</> : 'Verify OTP →'}
                  </button>
                </form>
                <button className="fp-back" onClick={() => { setFpStep('email'); setFpError(''); }}>← Change email</button>
              </>
            )}

            {fpStep === 'reset' && (
              <>
                <div className="fp-icon">🔒</div>
                <div className="fp-title">New password</div>
                <p className="fp-sub">Choose a strong password for your account.</p>
                {fpError && <div className="fp-err">⚠ {fpError}</div>}
                <form onSubmit={handleFpReset}>
                  {[
                    { label: 'New password', val: fpNewPwd, set: setFpNewPwd, show: fpShowNew, tog: () => setFpShowNew(!fpShowNew), ph: 'Min. 6 characters' },
                    { label: 'Confirm password', val: fpConfirm, set: setFpConfirm, show: fpShowConf, tog: () => setFpShowConf(!fpShowConf), ph: 'Re-enter password' },
                  ].map(({ label, val, set, show, tog, ph }) => (
                    <div className="fp-field" key={label}>
                      <label className="fp-label">{label}</label>
                      <div className="fp-iw">
                        <input type={show ? 'text' : 'password'} className="fp-inp"
                          placeholder={ph} value={val}
                          onChange={e => { set(e.target.value); setFpError(''); }} required />
                        <button type="button" className="fp-eye" onClick={tog} tabIndex={-1}>
                          {show
                            ? <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                            : <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                          }
                        </button>
                      </div>
                    </div>
                  ))}
                  <button type="submit" className="fp-btn" disabled={fpLoading}>
                    {fpLoading ? <><div className="lp-spinner" />Resetting…</> : 'Reset password →'}
                  </button>
                </form>
              </>
            )}

            {fpStep === 'done' && (
              <div className="fp-success">
                <svg className="fp-check" viewBox="0 0 68 68">
                  <circle cx="34" cy="34" r="32"/>
                  <path d="M20 34l10 10 18-18"/>
                </svg>
                <div className="fp-success-title">All done!</div>
                <p className="fp-success-msg">Your password has been reset.<br />You can now sign in with your new password.</p>
                <button className="fp-btn" onClick={closeForgot}>Back to login →</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Login;