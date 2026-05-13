import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from './axiosInstance';
import { CSS as USER_CSS } from './userStyles';
import UserDashboard     from './UserDashboard';
import UserComplaints    from './UserComplaints';
import UserRaise         from './UserRaise';
import UserDetail        from './UserDetail';
import UserNotifications from './UserNotifications';
import UserProfile       from './UserProfile';
import Footer from '../common/FooterC';
/* ─── Toasts ─────────────────────────────────────────────── */
let _addToast = () => {};
export const toast = (msg, type = 's') => _addToast(msg, type);
function Toasts() {
  const [list, setList] = useState([]);
  useEffect(() => {
    _addToast = (msg, type) => {
      const id = Date.now();
      setList(p => [...p, { id, msg, type }]);
      setTimeout(() => setList(p => p.filter(t => t.id !== id)), 3500);
    };
  }, []);
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:8 }}>
      {list.map(t => (
        <div key={t.id} style={{
          padding:'10px 16px', borderRadius:12, fontSize:13, fontWeight:600,
          fontFamily:"'DM Sans',sans-serif", boxShadow:'0 12px 40px rgba(0,0,0,.12)',
          display:'flex', alignItems:'center', gap:8, minWidth:220,
          animation:'popIn .3s cubic-bezier(.34,1.56,.64,1) both',
          background: t.type==='s'?'#f0fdf4':t.type==='e'?'#fef2f2':'#eff6ff',
          border:`1.5px solid ${t.type==='s'?'#86efac':t.type==='e'?'#fecaca':'#bfdbfe'}`,
          color: t.type==='s'?'#15803d':t.type==='e'?'#dc2626':'#1d4ed8',
        }}>
          {t.type==='s'?'✓':t.type==='e'?'⚠':'ℹ'} {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─── Icons ──────────────────────────────────────────────── */
const Ico = ({ d, size=18, stroke='currentColor', fill='none', sw=1.7 }) => (
  <svg width={size} height={size} fill={fill} stroke={stroke} strokeWidth={sw}
    strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{ flexShrink:0 }}>
    {Array.isArray(d) ? d.map((p,i) => <path key={i} d={p}/>) : <path d={d}/>}
  </svg>
);
const I = {
  home:   'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  list:   ['M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z','M14 2v6h6','M16 13H8','M16 17H8'],
  plus:   'M12 5v14M5 12h14',
  bell:   ['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9','M13.73 21a2 2 0 0 1-3.46 0'],
  user:   ['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2','M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z'],
  logout: ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4','M16 17l5-5-5-5','M21 12H9'],
  menu:   'M3 12h18M3 6h18M3 18h18',
  close:  'M18 6L6 18M6 6l12 12',
  send:   'M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z',
  eye:    ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 0 0-6 0'],
};

const POLL_MS = 30000;
const BUBBLES = [
  { from:'agent', text:'Hi! How can I help you today?',               delay:0    },
  { from:'user',  text:'I want to track my complaint status.',         delay:1200 },
  { from:'agent', text:'Sure! Your ticket #TKT-2847 is In Progress.', delay:2600 },
  { from:'user',  text:'Thank you! When will it be resolved?',         delay:4000 },
  { from:'agent', text:"Within 24 hours. You'll be notified! ✅",     delay:5400 },
];

/* ─── Chat Demo ──────────────────────────────────────────── */
function ChatDemo() {
  const [visible, setVisible] = useState([]);
  useEffect(() => {
    const timers = BUBBLES.map((b,i) => setTimeout(() => setVisible(v => [...v,i]), b.delay));
    return () => timers.forEach(clearTimeout);
  }, []);
  useEffect(() => {
    if (visible.length === BUBBLES.length) {
      const t = setTimeout(() => setVisible([]), 3000);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <div className="chat-area">
      {BUBBLES.map((b,i) => (
        <div key={i} className="chat-row" style={{ justifyContent: b.from==='user' ? 'flex-end' : 'flex-start' }}>
          {b.from==='agent' && <div className="agent-avatar">🎯</div>}
          <div className={`chat-bubble ${b.from}${visible.includes(i) ? ' visible' : ''}`}>
            {b.text}
            {b.from==='user' && <span className="tick">✓✓</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── 3D Canvas ──────────────────────────────────────────── */
function ThreeCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!window.THREE) return;
    const THREE = window.THREE;
    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth/window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(5,10,7); scene.add(dirLight);
    const ptLight = new THREE.PointLight(0xd4f000, 0.5, 50);
    ptLight.position.set(-10,5,10); scene.add(ptLight);

    const matAccent = new THREE.MeshStandardMaterial({ color:0xd4f000, metalness:.1, roughness:.4, transparent:true, opacity:.7 });
    const matDark   = new THREE.MeshStandardMaterial({ color:0x1a1a18, metalness:.3, roughness:.5, transparent:true, opacity:.5 });
    const matWhite  = new THREE.MeshStandardMaterial({ color:0xf2f0eb, metalness:0,  roughness:.8, transparent:true, opacity:.45 });
    const matGreen  = new THREE.MeshStandardMaterial({ color:0x10b981, metalness:.1, roughness:.5, transparent:true, opacity:.5 });
    const matWire   = new THREE.MeshStandardMaterial({ color:0xd4f000, wireframe:true, transparent:true, opacity:.25 });
    const mats = [matAccent, matDark, matWhite, matGreen, matWire];

    const geomFns = [
      () => new THREE.IcosahedronGeometry(1,0),
      () => new THREE.OctahedronGeometry(1,0),
      () => new THREE.TetrahedronGeometry(1,0),
      () => new THREE.TorusGeometry(.7,.25,12,32),
      () => new THREE.TorusKnotGeometry(.6,.2,64,12),
      () => new THREE.DodecahedronGeometry(.8,0),
      () => new THREE.BoxGeometry(1,1,1),
      () => new THREE.SphereGeometry(.6,16,16),
      () => new THREE.ConeGeometry(.6,1.2,6),
      () => new THREE.CylinderGeometry(.4,.6,1,8),
    ];

    const shapes = [];
    for (let i=0; i<28; i++) {
      const geom = geomFns[Math.floor(Math.random()*geomFns.length)]();
      const mat  = mats[Math.floor(Math.random()*mats.length)];
      const mesh = new THREE.Mesh(geom, mat);
      const s = .3 + Math.random()*1.2;
      mesh.scale.set(s,s,s);
      mesh.position.set((Math.random()-.5)*50,(Math.random()-.5)*40,(Math.random()-.5)*20-5);
      mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,Math.random()*Math.PI);
      scene.add(mesh);
      shapes.push({
        mesh,
        rotSpeed:{ x:(Math.random()-.5)*.008, y:(Math.random()-.5)*.008, z:(Math.random()-.5)*.004 },
        floatSpeed:.3+Math.random()*.6,
        floatAmp:.3+Math.random()*1.2,
        baseY:mesh.position.y,
        phase:Math.random()*Math.PI*2,
      });
    }

    let mx=0, my=0, sy=0;
    const onMove  = e => { mx=(e.clientX/window.innerWidth-.5)*2; my=(e.clientY/window.innerHeight-.5)*2; };
    const onScroll= () => { sy=window.scrollY; };
    document.addEventListener('mousemove', onMove);
    window.addEventListener('scroll', onScroll);

    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const t = performance.now()*.001;
      shapes.forEach(s => {
        s.mesh.rotation.x += s.rotSpeed.x;
        s.mesh.rotation.y += s.rotSpeed.y;
        s.mesh.rotation.z += s.rotSpeed.z;
        s.mesh.position.y = s.baseY + Math.sin(t*s.floatSpeed+s.phase)*s.floatAmp;
      });
      camera.position.x += (mx*3 - camera.position.x)*.02;
      camera.position.y += (-my*2 - camera.position.y)*.02;
      camera.position.z  = 30 + sy*.008;
      camera.lookAt(0,0,0);
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} id="canvas3d" style={{ position:'fixed', top:0, left:0, width:'100%', height:'100%', zIndex:0, pointerEvents:'none' }}/>;
}

/* ─── Cursor Glow ────────────────────────────────────────── */
function CursorGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const h = e => {
      if (ref.current) { ref.current.style.left = e.clientX+'px'; ref.current.style.top = e.clientY+'px'; }
    };
    document.addEventListener('mousemove', h);
    return () => document.removeEventListener('mousemove', h);
  }, []);
  return <div ref={ref} className="cursor-glow" id="cursorGlow"/>;
}

/* ─── Demo Tabs ──────────────────────────────────────────── */
function DemoSection({ setView }) {
  const [activeTab, setActiveTab] = useState('tickets');
  const chartRef = useRef(null);

  const renderChart = () => {
    const chart = chartRef.current;
    if (!chart || chart.children.length > 0) return;
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const values = [3,5,2,7,4,6,8,3,5,9,6,4];
    const max    = Math.max(...values);
    months.forEach((m,i) => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;gap:4px;flex:1';
      const bar = document.createElement('div');
      bar.style.cssText = `width:100%;border-radius:4px 4px 0 0;background:var(--accent);min-height:4px;transition:height .6s ${i*.05}s cubic-bezier(.34,1.56,.64,1);height:4px;opacity:.7;cursor:default`;
      bar.onmouseenter = () => { bar.style.opacity='1'; };
      bar.onmouseleave = () => { bar.style.opacity='.7'; };
      setTimeout(() => { bar.style.height = (values[i]/max*100)+'%'; }, 100);
      const lbl = document.createElement('div');
      lbl.style.cssText = 'font-size:9px;color:var(--muted)';
      lbl.textContent = m;
      wrap.appendChild(bar); wrap.appendChild(lbl);
      chart.appendChild(wrap);
    });
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'analytics') setTimeout(renderChart, 50);
  };

  return (
    <section className="demo-section" id="demo">
      <div className="demo-inner">
        <div className="reveal-left">
          <div className="section-tag">✦ Demo</div>
          <h2 className="section-h2">See it in action</h2>
          <p className="section-sub">Experience a real-time simulation of the complaint lifecycle — from filing to resolution.</p>
          <div style={{ display:'flex', flexDirection:'column', gap:16, marginTop:32 }}>
            {[
              { ico:'🚀', bg:'#f0fdf4', title:'Instant Filing',  desc:'Submit your complaint in under 60 seconds with AI-assisted descriptions.' },
              { ico:'📡', bg:'#f0f4ff', title:'Live Tracking',   desc:'Watch your complaint move through each stage in real-time.' },
              { ico:'🔔', bg:'#fef9e7', title:'Smart Alerts',    desc:'Get notified at every milestone — assignment, progress, resolution.' },
            ].map(f => (
              <div key={f.title} className="demo-feature-item" style={{ display:'flex', alignItems:'center', gap:14, padding:'16px 20px', borderRadius:14, background:'white', border:'1.5px solid var(--border)', transition:'all .3s', cursor:'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent-dark)'; e.currentTarget.style.transform='translateX(6px)'; e.currentTarget.style.boxShadow='0 4px 20px rgba(212,240,0,.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.transform=''; e.currentTarget.style.boxShadow=''; }}>
                <div style={{ width:44, height:44, borderRadius:12, background:f.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{f.ico}</div>
                <div>
                  <div style={{ fontFamily:'var(--display)', fontSize:14, fontWeight:700, color:'var(--text)', marginBottom:3 }}>{f.title}</div>
                  <div style={{ fontSize:12.5, color:'var(--text2)', lineHeight:1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal-right">
          <div className="demo-screen">
            <div className="demo-topbar">
              <div style={{ display:'flex', gap:5, marginRight:12 }}>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'#ef4444' }}/>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'#f59e0b' }}/>
                <div style={{ width:10, height:10, borderRadius:'50%', background:'#10b981' }}/>
              </div>
              {[{id:'tickets',label:'My Tickets'},{id:'timeline',label:'Timeline'},{id:'analytics',label:'Analytics'}].map(t => (
                <button key={t.id} className={`demo-tab${activeTab===t.id?' active':''}`} onClick={() => switchTab(t.id)}>{t.label}</button>
              ))}
            </div>
            <div className="demo-body">
              {/* Tickets */}
              {activeTab==='tickets' && (
                <div>
                  {[
                    { id:'TKT-2847', status:'resolved',  statusLabel:'Resolved',    title:'Incorrect billing charge on monthly statement', meta:'Filed 2 days ago · Resolved in 4 hours' },
                    { id:'TKT-3012', status:'progress',  statusLabel:'In Progress', title:'Product warranty claim not acknowledged',       meta:'Filed today · Agent assigned' },
                    { id:'TKT-3058', status:'pending',   statusLabel:'Pending',     title:'Delayed delivery — order not received',         meta:'Filed just now · Awaiting assignment' },
                  ].map(t => (
                    <div key={t.id} className="demo-ticket"
                      onMouseEnter={e => { e.currentTarget.style.borderColor='var(--accent-dark)'; e.currentTarget.style.transform='translateX(4px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor=''; e.currentTarget.style.transform=''; }}>
                      <div className="demo-ticket-hdr">
                        <div className="demo-ticket-id">{t.id}</div>
                        <div className={`demo-badge ${t.status}`}><div className="demo-badge-dot"/> {t.statusLabel}</div>
                      </div>
                      <div className="demo-ticket-title">{t.title}</div>
                      <div className="demo-ticket-meta">{t.meta}</div>
                    </div>
                  ))}
                </div>
              )}
              {/* Timeline */}
              {activeTab==='timeline' && (
                <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                  {[
                    { label:'Complaint Filed',  time:'Jan 15, 2026 · 10:32 AM', state:'done',    sub:null },
                    { label:'Agent Assigned',   time:'Jan 15, 2026 · 11:05 AM', state:'done',    sub:null },
                    { label:'In Progress',      time:'Agent reviewing your case…', state:'current', color:'#3b82f6' },
                    { label:'Resolved',         time:'Pending',                  state:'pending', sub:null },
                  ].map((s,i) => (
                    <div key={i} className="timeline-item">
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                        <div className={`timeline-dot${s.state==='done'?' done':s.state==='current'?' current':''}`}/>
                        {i<3 && <div className={`timeline-line${s.state==='done'?' done':''}`} style={{ height:32 }}/>}
                      </div>
                      <div style={{ padding:'0 0 16px' }}>
                        <div style={{ fontSize:13, fontWeight:700, color:s.color||'var(--text)' }}>{s.label}</div>
                        <div style={{ fontSize:11.5, color:'var(--muted)' }}>{s.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Analytics */}
              {activeTab==='analytics' && (
                <div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:16 }}>
                    {[
                      { n:'12',   lbl:'Total Filed',   color:'var(--text)' },
                      { n:'10',   lbl:'Resolved',      color:'#10b981'     },
                      { n:'1',    lbl:'In Progress',   color:'#3b82f6'     },
                      { n:'4.2h', lbl:'Avg. Resolution',color:'var(--accent-dark)' },
                    ].map(c => (
                      <div key={c.lbl} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:16 }}>
                        <div style={{ fontFamily:'var(--display)', fontSize:28, fontWeight:800, color:c.color }}>{c.n}</div>
                        <div style={{ fontSize:11, color:'var(--muted)' }}>{c.lbl}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:12, padding:16 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'var(--text2)', marginBottom:12 }}>Monthly Activity</div>
                    <div ref={chartRef} id="demoChart" style={{ display:'flex', alignItems:'flex-end', gap:6, height:80 }}/>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Stat Counter ───────────────────────────────────────── */
function StatCounter({ target, prefix='', suffix='', isStatic, staticVal }) {
  const [val, setVal] = useState(isStatic ? staticVal : (prefix+0+suffix));
  const ref = useRef(null);
  const counted = useRef(false);
  useEffect(() => {
    if (isStatic) return;
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !counted.current) {
        counted.current = true;
        let cur = 0;
        const step = Math.max(1, Math.floor(target/60));
        const iv = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(iv); }
          setVal(prefix + cur.toLocaleString() + suffix);
        }, 25);
      }
    }, { threshold:.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <div ref={ref} className="stat-num">{val}</div>;
}

/* ─── Main UserHome ──────────────────────────────────────── */
export default function UserHome() {
  const navigate     = useNavigate();
  const notifRef     = useRef(null);
  const profileRef   = useRef(null);
  const navRef       = useRef(null);
  const threeLoaded  = useRef(false);

  const [user,         setUser]         = useState(null);
  const [complaints,   setComplaints]   = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [view,         setView]         = useState('landing');
  const [selectedC,    setSelectedC]    = useState(null);
  const [notifOpen,    setNotifOpen]    = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [unreadCount,  setUnreadCount]  = useState(0);
  const [searchVal,    setSearchVal]    = useState('');
  const [activeSection, setActiveSection] = useState('hero'); // eslint-disable-line no-unused-vars
  const [threeReady,   setThreeReady]   = useState(false);

  const isLanding = view === 'landing';

  /* Load Three.js */
  useEffect(() => {
    if (threeLoaded.current) return;
    threeLoaded.current = true;
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    s.onload = () => setThreeReady(true);
    document.head.appendChild(s);
  }, []);

  /* Scroll reveal observer */
  useEffect(() => {
    if (!isLanding) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold:.1, rootMargin:'0px 0px -40px 0px' });
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale').forEach(el => obs.observe(el));
    }, 100);
    return () => { clearTimeout(timer); obs.disconnect(); };
  }, [isLanding]);

  /* Nav scroll: scrolled class + active section */
  useEffect(() => {
    if (!isLanding) return;
    const onScroll = () => {
      if (navRef.current) navRef.current.classList.toggle('scrolled', window.scrollY > 20);
      const secs = ['hero','features','hiw','demo','reviews'];
      let cur = 'hero';
      secs.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= window.scrollY + 100) cur = id;
      });
      setActiveSection(cur);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLanding]);

  /* Card tilt effect */
  useEffect(() => {
    if (!isLanding) return;
    const timer = setTimeout(() => {
      document.querySelectorAll('.feat-card,.review-card,.demo-ticket').forEach(card => {
        card.addEventListener('mousemove', e => {
          const r = card.getBoundingClientRect();
          const x = (e.clientX-r.left)/r.width-.5;
          const y = (e.clientY-r.top)/r.height-.5;
          card.style.transform = `translateY(-6px) perspective(600px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform=''; });
      });
    }, 500);
    return () => clearTimeout(timer);
  }, [isLanding]);

  /* Ripple on primary buttons */
  useEffect(() => {
    if (!isLanding) return;
    const timer = setTimeout(() => {
      document.querySelectorAll('.btn-primary').forEach(btn => {
        btn.addEventListener('click', function(e) {
          const rect = this.getBoundingClientRect();
          const rip  = document.createElement('span');
          rip.className = 'ripple-effect';
          const sz = Math.max(rect.width, rect.height);
          rip.style.width = rip.style.height = sz+'px';
          rip.style.left  = (e.clientX-rect.left-sz/2)+'px';
          rip.style.top   = (e.clientY-rect.top-sz/2)+'px';
          this.appendChild(rip);
          setTimeout(() => rip.remove(), 600);
        });
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [isLanding]);

  /* Close dropdowns on outside click */
  useEffect(() => {
    const h = e => {
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  /* Load user & complaints */
  const fetchComplaints = useCallback((uid) => {
    axios.get(`https://resolve-complaint.onrender.com/status/${uid}`)
      .then(res => { if (res.data?.length) setComplaints(res.data); })
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { navigate('/'); return; }
    const u = JSON.parse(stored);
    setUser(u);
    fetchComplaints(u._id);
    axios.get(`https://resolve-complaint.onrender.com/notifications/${u._id}`)
      .then(res => setUnreadCount((res.data||[]).filter(n=>!n.read).length))
      .catch(() => {});
  }, [navigate, fetchComplaints]);

  useEffect(() => {
    if (!user?._id) return;
    const iv = setInterval(() => fetchComplaints(user._id), POLL_MS);
    return () => clearInterval(iv);
  }, [user?._id, fetchComplaints]);

  const logout = () => { localStorage.removeItem('user'); navigate('/'); };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
    setMobileOpen(false);
  };

  const NAV_ITEMS = [
    { id:'dashboard',  label:'Dashboard',      icon:I.home },
    { id:'complaints', label:'My Complaints',  icon:I.list },
    { id:'raise',      label:'File Complaint', icon:I.plus },
  ];

  /* ─── CSS (from HTML, verbatim) ─────────────────────────── */
  const CSS = `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    html{scroll-behavior:smooth}
    :root{
      --bg:#f8f7f4;--white:#ffffff;--surface:#f2f0eb;--border:#e4e1d8;
      --text:#1a1a18;--text2:#4a4744;--muted:#9a9790;
      --accent:#d4f000;--accent-dark:#b8d400;--dark:#1a1a18;
      --font:'DM Sans',sans-serif;--display:'Syne',sans-serif;
      --nav-h:62px;--r:14px;--r-lg:20px;
      --shadow:0 1px 3px rgba(0,0,0,.07);
      --shadow-md:0 4px 16px rgba(0,0,0,.08);
      --shadow-lg:0 12px 40px rgba(0,0,0,.12);
    }
    body{background:var(--white);color:var(--text);font-family:var(--font);overflow-x:hidden}
    ::-webkit-scrollbar{width:5px}
    ::-webkit-scrollbar-thumb{background:#ccc8be;border-radius:4px}

    @keyframes fadeUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:none}}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:none}}
    @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-12px)}}
    @keyframes floatSlow{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-8px) rotate(2deg)}}
    @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    @keyframes popIn{0%{transform:scale(.85);opacity:0}100%{transform:scale(1);opacity:1}}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes glow{0%,100%{box-shadow:0 0 20px rgba(212,240,0,.2)}50%{box-shadow:0 0 40px rgba(212,240,0,.4)}}
    @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
    @keyframes ripple{0%{transform:scale(0);opacity:.5}100%{transform:scale(4);opacity:0}}

    /* NAV */
    .nav{
      position:fixed;top:0;left:0;right:0;height:var(--nav-h);z-index:300;
      display:flex;align-items:center;padding:0 28px;
      background:rgba(255,255,255,.92);backdrop-filter:blur(24px) saturate(1.8);
      border-bottom:1px solid rgba(228,225,216,.6);transition:all .3s ease;
    }
    .nav.scrolled{box-shadow:0 4px 30px rgba(0,0,0,.06)}
    .nav-brand{
      display:flex;align-items:center;gap:9px;
      font-family:var(--display);font-size:17px;font-weight:800;
      color:var(--text);cursor:pointer;text-decoration:none;flex-shrink:0;
    }
    .nav-brand-icon{
      width:36px;height:36px;border-radius:10px;background:var(--dark);
      display:flex;align-items:center;justify-content:center;font-size:16px;
      transition:transform .3s ease;
    }
    .nav-brand:hover .nav-brand-icon{transform:rotate(-8deg) scale(1.05)}
    .nav-centre{flex:1;display:flex;align-items:center;justify-content:center;gap:4px}
    .nav-link{
      display:flex;align-items:center;gap:6px;padding:7px 16px;
      border-radius:100px;border:none;background:transparent;
      font-size:13px;font-weight:500;color:var(--muted);
      font-family:var(--font);cursor:pointer;transition:all .2s;white-space:nowrap;
      position:relative;overflow:hidden;
    }
    .nav-link:hover{background:var(--surface);color:var(--text)}
    .nav-link.active{background:var(--accent);color:var(--text);font-weight:600}
    .nav-right{display:flex;align-items:center;gap:10px;flex-shrink:0}
    .nav-cta{
      display:flex;align-items:center;gap:6px;padding:0 18px;height:38px;
      border-radius:50px;border:none;background:var(--dark);color:#fff;
      font-family:var(--font);font-size:13px;font-weight:600;cursor:pointer;
      transition:all .2s;white-space:nowrap;position:relative;overflow:hidden;
    }
    .nav-cta:hover{background:#333;transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,.15)}
    .nav-cta::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent);transform:translateX(-100%);transition:transform .5s}
    .nav-cta:hover::after{transform:translateX(100%)}
    .nav-icon-btn{
      width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;
      background:var(--surface);border:1.5px solid var(--border);
      cursor:pointer;position:relative;transition:all .2s;color:var(--text2);
    }
    .nav-icon-btn:hover{background:var(--accent);border-color:var(--accent-dark);transform:scale(1.05)}
    .pip{width:7px;height:7px;border-radius:50%;background:#e84545;position:absolute;top:4px;right:4px;animation:pulse 2s infinite}
    .hamburger{display:none;width:38px;height:38px;border-radius:10px;border:1.5px solid var(--border);background:var(--surface);align-items:center;justify-content:center;cursor:pointer}

    /* Notif dropdown */
    .nav-dropdown{
      position:absolute;top:calc(100% + 8px);right:0;
      background:var(--white);border:1px solid var(--border);
      border-radius:16px;box-shadow:var(--shadow-lg);
      z-index:400;overflow:hidden;animation:slideDown .2s ease both;
    }
    .drop-hdr{padding:12px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;background:var(--surface)}
    .drop-av{width:36px;height:36px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:var(--text);flex-shrink:0}
    .drop-item{display:flex;align-items:center;gap:10px;padding:10px 16px;border:none;background:none;font-family:var(--font);font-size:13px;color:var(--text2);width:100%;text-align:left;cursor:pointer;transition:background .15s}
    .drop-item:hover{background:var(--surface);color:var(--text)}
    .drop-item.danger{color:#dc2626}
    .drop-item.danger:hover{background:#fef2f2}
    .notif-pip{background:#e84545;color:#fff;font-size:9px;padding:1px 5px;border-radius:50px;line-height:1.4}

    /* CURSOR GLOW */
    .cursor-glow{
      position:fixed;width:300px;height:300px;border-radius:50%;
      background:radial-gradient(circle,rgba(212,240,0,.06),transparent 70%);
      pointer-events:none;z-index:0;transition:left .15s,top .15s;transform:translate(-50%,-50%);
    }

    /* HERO */
    .hero{
      position:relative;min-height:100vh;display:grid;grid-template-columns:1fr 1fr;
      max-width:1320px;margin:0 auto;padding:0 48px;align-items:center;gap:48px;
      padding-top:var(--nav-h);z-index:1;
    }
    .hero-left{padding:60px 0;position:relative;z-index:2}
    .hero-tag{
      display:inline-flex;align-items:center;gap:8px;padding:7px 16px;
      border-radius:50px;background:#f0fdf4;border:1.5px solid #86efac;
      font-size:12.5px;font-weight:600;color:#15803d;margin-bottom:24px;
      animation:fadeUp .6s ease both;cursor:default;transition:all .2s;
    }
    .hero-tag:hover{transform:translateY(-2px);box-shadow:0 4px 16px rgba(134,239,172,.3)}
    .hero-h1{font-family:var(--display);font-size:60px;font-weight:800;line-height:1.06;color:var(--text);margin-bottom:24px;animation:fadeUp .7s .1s ease both}
    .hero-h1 span{color:transparent;background:linear-gradient(135deg,var(--accent-dark),#8fb800);-webkit-background-clip:text;background-clip:text}
    .hero-sub{font-size:17px;color:var(--text2);line-height:1.7;max-width:500px;margin-bottom:32px;animation:fadeUp .7s .2s ease both}
    .hero-checks{display:flex;flex-wrap:wrap;gap:10px 28px;margin-bottom:38px;animation:fadeUp .7s .3s ease both}
    .hero-check{display:flex;align-items:center;gap:8px;font-size:13.5px;color:var(--text2);font-weight:500;transition:all .2s;cursor:default}
    .hero-check:hover{color:var(--text);transform:translateX(3px)}
    .hero-check-icon{width:20px;height:20px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;color:var(--text);font-weight:700}
    .hero-btns{display:flex;align-items:center;gap:14px;flex-wrap:wrap;animation:fadeUp .7s .4s ease both}
    .btn-primary{
      padding:15px 30px;border-radius:50px;border:none;background:var(--accent);
      color:var(--text);font-family:var(--font);font-size:15px;font-weight:700;
      cursor:pointer;transition:all .25s;display:flex;align-items:center;gap:8px;
      position:relative;overflow:hidden;
    }
    .btn-primary:hover{background:var(--accent-dark);transform:translateY(-3px);box-shadow:0 12px 32px rgba(212,240,0,.45)}
    .btn-primary:active{transform:translateY(-1px)}
    .btn-primary .ripple-effect{position:absolute;border-radius:50%;background:rgba(255,255,255,.4);animation:ripple .6s ease-out forwards;pointer-events:none}
    .btn-outline{padding:15px 30px;border-radius:50px;background:transparent;color:var(--text);border:2px solid var(--border);font-family:var(--font);font-size:15px;font-weight:600;cursor:pointer;transition:all .25s;display:flex;align-items:center;gap:8px}
    .btn-outline:hover{border-color:var(--text);background:var(--surface);transform:translateY(-2px)}

    /* HERO RIGHT */
    .hero-right{display:flex;align-items:center;justify-content:center;position:relative;padding:40px 0;z-index:2}
    .hero-card-wrap{width:100%;max-width:500px;position:relative}
    .hero-blob{position:absolute;inset:-30px;background:radial-gradient(ellipse at 30% 30%,rgba(212,240,0,.12) 0%,transparent 70%);border-radius:40px;z-index:0}
    .hero-card{position:relative;z-index:1;background:white;border-radius:24px;border:1.5px solid var(--border);box-shadow:0 24px 80px rgba(0,0,0,.1);overflow:hidden;animation:fadeUp .8s .2s ease both;transition:transform .3s ease}
    .hero-card:hover{transform:translateY(-4px)}
    .hero-card-top{background:var(--dark);padding:18px 22px;display:flex;align-items:center;gap:10px}
    .hct-dots{display:flex;gap:6px}
    .hct-dot{width:11px;height:11px;border-radius:50%;transition:transform .2s}
    .hct-dot:hover{transform:scale(1.3)}
    .hct-title{font-size:13px;font-weight:600;color:rgba(255,255,255,.65);margin-left:8px}
    .hct-badge{margin-left:auto;padding:4px 12px;border-radius:50px;background:rgba(212,240,0,.2);border:1px solid rgba(212,240,0,.3);font-size:11px;font-weight:600;color:var(--accent)}
    .float-badge{
      position:absolute;background:white;border-radius:16px;
      box-shadow:0 10px 36px rgba(0,0,0,.12);border:1.5px solid var(--border);
      padding:12px 16px;display:flex;align-items:center;gap:10px;
      font-size:12.5px;font-weight:600;color:var(--text);z-index:3;cursor:default;transition:all .3s ease;
    }
    .float-badge:hover{transform:translateY(-4px) scale(1.03) !important;box-shadow:0 14px 44px rgba(0,0,0,.16)}
    .float-badge-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}

    /* CHAT AREA */
    .chat-area{padding:20px 18px;min-height:280px;display:flex;flex-direction:column;gap:10px}
    .chat-bubble{max-width:78%;padding:11px 16px;font-size:13px;line-height:1.55;opacity:0;transform:translateY(12px);transition:opacity .45s ease,transform .45s ease}
    .chat-bubble.visible{opacity:1;transform:none}
    .chat-bubble.agent{background:white;color:var(--text);border:1px solid #e8e5de;border-radius:18px 18px 18px 4px;align-self:flex-start;box-shadow:0 2px 12px rgba(0,0,0,.06)}
    .chat-bubble.user{background:var(--dark);color:white;border-radius:18px 18px 4px 18px;align-self:flex-end}
    .chat-bubble .tick{margin-left:6px;opacity:.5;font-size:11px}
    .agent-avatar{width:30px;height:30px;border-radius:50%;background:var(--accent);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0;margin-right:8px;align-self:flex-end}
    .chat-row{display:flex;align-items:flex-end}
    .chat-input-bar{padding:14px 18px;border-top:1px solid #f0ede6;display:flex;align-items:center;gap:10px;background:#fafaf8}
    .chat-input-bar input{flex:1;padding:10px 16px;border-radius:50px;border:1.5px solid #e4e1d8;background:white;font-size:13px;font-family:var(--font);color:var(--text);outline:none;transition:all .2s}
    .chat-input-bar input:focus{border-color:var(--accent-dark);box-shadow:0 0 0 3px rgba(212,240,0,.15)}
    .send-btn{width:38px;height:38px;border-radius:50%;background:var(--dark);display:flex;align-items:center;justify-content:center;flex-shrink:0;cursor:pointer;border:none;transition:all .2s}
    .send-btn:hover{background:#333;transform:scale(1.08)}

    /* MARQUEE */
    .marquee-section{border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:18px 0;overflow:hidden;background:var(--surface);position:relative;z-index:1}
    .marquee-track{display:flex;gap:48px;animation:marquee 30s linear infinite;width:max-content}
    .marquee-item{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:500;color:var(--muted);white-space:nowrap}
    .marquee-item span{font-size:18px}

    /* FEATURES */
    .features{background:var(--bg);padding:100px 48px;position:relative;z-index:1}
    .features-inner{max-width:1200px;margin:0 auto}
    .section-tag{display:inline-flex;align-items:center;gap:7px;padding:6px 16px;border-radius:50px;background:rgba(212,240,0,.15);border:1.5px solid rgba(212,240,0,.4);font-size:12px;font-weight:700;color:#6d6210;text-transform:uppercase;letter-spacing:.08em;margin-bottom:18px}
    .section-h2{font-family:var(--display);font-size:44px;font-weight:800;color:var(--text);margin-bottom:16px;line-height:1.12}
    .section-sub{font-size:16.5px;color:var(--text2);max-width:540px;line-height:1.7;margin-bottom:56px}
    .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
    .feat-card{background:white;border-radius:var(--r-lg);padding:30px 28px;border:1.5px solid var(--border);box-shadow:var(--shadow);transition:all .3s cubic-bezier(.25,.46,.45,.94);cursor:default;position:relative;overflow:hidden}
    .feat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--accent);transform:scaleX(0);transform-origin:left;transition:transform .4s ease}
    .feat-card:hover::before{transform:scaleX(1)}
    .feat-card:hover{transform:translateY(-6px);box-shadow:var(--shadow-lg);border-color:var(--accent-dark)}
    .feat-icon{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:24px;margin-bottom:20px;transition:transform .3s}
    .feat-card:hover .feat-icon{transform:scale(1.1) rotate(-3deg)}
    .feat-title{font-family:var(--display);font-size:16.5px;font-weight:700;color:var(--text);margin-bottom:10px}
    .feat-desc{font-size:13.5px;color:var(--text2);line-height:1.7}

    /* STATS */
    .stats-banner{background:var(--dark);padding:72px 48px;position:relative;z-index:1;overflow:hidden}
    .stats-banner::before{content:'';position:absolute;top:-100px;right:-100px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(212,240,0,.08),transparent);pointer-events:none}
    .stats-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:24px;text-align:center}
    .stat-card{padding:20px;border-radius:16px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);transition:all .3s;cursor:default}
    .stat-card:hover{background:rgba(255,255,255,.06);transform:translateY(-4px)}
    .stat-num{font-family:var(--display);font-size:46px;font-weight:800;color:var(--accent);margin-bottom:8px}
    .stat-lbl{font-size:13px;color:rgba(255,255,255,.5);font-weight:500}

    /* HOW IT WORKS */
    .hiw{padding:100px 48px;background:white;position:relative;z-index:1}
    .hiw-inner{max-width:1200px;margin:0 auto}
    .hiw-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;margin-top:56px}
    .hiw-step{text-align:center;position:relative;cursor:default}
    .hiw-step:not(:last-child)::after{content:'';position:absolute;top:30px;right:-14px;width:28px;height:2px;background:linear-gradient(90deg,var(--accent),var(--border))}
    .hiw-num{width:58px;height:58px;border-radius:50%;background:var(--accent);color:var(--text);font-family:var(--display);font-size:22px;font-weight:800;display:flex;align-items:center;justify-content:center;margin:0 auto 18px;transition:all .3s;animation:glow 3s ease-in-out infinite}
    .hiw-step:hover .hiw-num{transform:scale(1.12);box-shadow:0 8px 28px rgba(212,240,0,.5)}
    .hiw-title{font-size:15.5px;font-weight:700;color:var(--text);margin-bottom:10px;font-family:var(--display)}
    .hiw-desc{font-size:13px;color:var(--text2);line-height:1.65}

    /* DEMO SECTION */
    .demo-section{padding:100px 48px;background:var(--bg);position:relative;z-index:1;border-top:1px solid var(--border)}
    .demo-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
    .demo-screen{background:white;border-radius:20px;border:1.5px solid var(--border);box-shadow:var(--shadow-lg);overflow:hidden}
    .demo-topbar{background:var(--dark);padding:12px 18px;display:flex;align-items:center;gap:8px}
    .demo-tab{padding:6px 14px;border-radius:8px;font-size:12px;font-weight:600;font-family:var(--font);cursor:pointer;border:none;transition:all .2s}
    .demo-tab.active{background:var(--accent);color:var(--text)}
    .demo-tab:not(.active){background:rgba(255,255,255,.08);color:rgba(255,255,255,.5)}
    .demo-tab:not(.active):hover{background:rgba(255,255,255,.15)}
    .demo-body{padding:24px}
    .demo-ticket{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:18px 20px;margin-bottom:14px;transition:all .3s}
    .demo-ticket-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
    .demo-ticket-id{font-family:monospace;font-size:12px;font-weight:700;color:var(--accent-dark);background:rgba(212,240,0,.15);padding:3px 10px;border-radius:6px}
    .demo-badge{padding:3px 10px;border-radius:50px;font-size:11px;font-weight:600;display:inline-flex;align-items:center;gap:4px}
    .demo-badge.progress{background:#f0f4ff;color:#1e3a8a}
    .demo-badge.resolved{background:#f0fdf4;color:#064e3b}
    .demo-badge.pending{background:#fef9e7;color:#78350f}
    .demo-badge-dot{width:5px;height:5px;border-radius:50%}
    .demo-badge.progress .demo-badge-dot{background:#3b82f6}
    .demo-badge.resolved .demo-badge-dot{background:#10b981}
    .demo-badge.pending .demo-badge-dot{background:#f59e0b}
    .demo-ticket-title{font-size:14px;font-weight:600;color:var(--text);margin-bottom:4px}
    .demo-ticket-meta{font-size:11.5px;color:var(--muted)}
    .timeline-item{display:flex;gap:12px;margin-bottom:4px}
    .timeline-dot{width:12px;height:12px;border-radius:50%;border:2px solid var(--border);flex-shrink:0;margin-top:4px;transition:all .3s}
    .timeline-dot.done{background:#10b981;border-color:#10b981}
    .timeline-dot.current{background:#f0f4ff;border-color:#3b82f6}
    .timeline-line{width:2px;background:var(--border);margin:3px auto}
    .timeline-line.done{background:#10b981}

    /* REVIEWS */
    .reviews{background:white;border-top:1px solid var(--border);padding:100px 48px;position:relative;z-index:1}
    .reviews-inner{max-width:1200px;margin:0 auto}
    .review-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:52px}
    .review-card{background:var(--bg);border-radius:var(--r-lg);padding:28px;border:1.5px solid var(--border);transition:all .3s;cursor:default;position:relative}
    .review-card:hover{transform:translateY(-4px);box-shadow:var(--shadow-md);border-color:var(--accent)}
    .review-card::before{content:'"';position:absolute;top:16px;right:24px;font-family:Georgia,serif;font-size:64px;color:var(--accent);opacity:.3;line-height:1}
    .review-stars{color:var(--accent-dark);font-size:17px;margin-bottom:14px;letter-spacing:2px}
    .review-text{font-size:14px;color:var(--text2);line-height:1.75;margin-bottom:18px}
    .review-author{display:flex;align-items:center;gap:12px}
    .review-av{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:15px;color:var(--text);flex-shrink:0}
    .review-name{font-size:13.5px;font-weight:700;color:var(--text)}
    .review-role{font-size:11.5px;color:var(--muted)}

    /* CTA */
    .cta-section{background:var(--dark);padding:100px 48px;text-align:center;position:relative;z-index:1;overflow:hidden}
    .cta-section::before{content:'';position:absolute;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(212,240,0,.06),transparent);top:50%;left:50%;transform:translate(-50%,-50%);pointer-events:none}
    .cta-h2{font-family:var(--display);font-size:46px;font-weight:800;color:white;margin-bottom:16px;position:relative}
    .cta-sub{font-size:17px;color:rgba(255,255,255,.5);margin-bottom:40px;position:relative}
    .cta-btns{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;position:relative}

    /* FOOTER */
    .footer{background:#0d0d0c;padding:48px;position:relative;z-index:1}
    .footer-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:40px}
    .footer-brand{font-family:var(--display);font-size:18px;font-weight:800;color:white;margin-bottom:12px;display:flex;align-items:center;gap:8px}
    .footer-desc{font-size:13px;color:rgba(255,255,255,.35);line-height:1.7;margin-bottom:20px}
    .footer-social{display:flex;gap:10px}
    .footer-social-btn{width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.04);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s;font-size:14px}
    .footer-social-btn:hover{background:var(--accent);border-color:var(--accent);transform:translateY(-2px)}
    .footer-col-title{font-size:12px;font-weight:700;color:rgba(255,255,255,.4);text-transform:uppercase;letter-spacing:.1em;margin-bottom:16px}
    .footer-link{display:block;font-size:13.5px;color:rgba(255,255,255,.5);text-decoration:none;padding:4px 0;transition:all .2s;cursor:pointer}
    .footer-link:hover{color:rgba(255,255,255,.9);transform:translateX(3px)}
    .footer-bottom{max-width:1200px;margin:0 auto;padding-top:32px;margin-top:32px;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center}
    .footer-copy{font-size:12.5px;color:rgba(255,255,255,.3)}

    /* SCROLL REVEAL */
    .reveal{opacity:0;transform:translateY(30px);transition:all .7s cubic-bezier(.25,.46,.45,.94)}
    .reveal.visible{opacity:1;transform:none}
    .reveal-left{opacity:0;transform:translateX(-40px);transition:all .7s cubic-bezier(.25,.46,.45,.94)}
    .reveal-left.visible{opacity:1;transform:none}
    .reveal-right{opacity:0;transform:translateX(40px);transition:all .7s cubic-bezier(.25,.46,.45,.94)}
    .reveal-right.visible{opacity:1;transform:none}
    .reveal-scale{opacity:0;transform:scale(.9);transition:all .6s cubic-bezier(.25,.46,.45,.94)}
    .reveal-scale.visible{opacity:1;transform:none}

    /* MOBILE MENU */
    .mobile-menu{position:fixed;top:var(--nav-h);left:0;right:0;background:white;border-bottom:1px solid var(--border);padding:12px;z-index:250;animation:slideDown .25s ease both;box-shadow:0 10px 40px rgba(0,0,0,.1)}
    .mobile-menu-link{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:12px;width:100%;background:transparent;border:none;font-family:var(--font);font-size:14px;color:var(--text2);cursor:pointer;transition:all .15s}
    .mobile-menu-link:hover{background:var(--surface);color:var(--text)}
    .mobile-menu-link.active{background:var(--accent);color:var(--text);font-weight:600}

    /* APP SHELL (non-landing) */
    .shell{display:flex;padding-top:var(--nav-h);min-height:100vh;background:var(--bg)}
    .main{flex:1;padding:28px 24px;width:100%;display:flex;flex-direction:column;align-items:center;background-image:radial-gradient(circle,rgba(26,26,24,.07) 1px,transparent 1px);background-size:22px 22px}
    .main>*{width:100%;max-width:880px}

    /* SKEL */
    .skel{background:linear-gradient(90deg,var(--surface) 25%,#f9f7f3 50%,var(--surface) 75%);background-size:200% 100%;animation:shimmer 1.4s ease infinite;border-radius:var(--r);border:1px solid var(--border)}

    /* RESPONSIVE */
    @media(max-width:1080px){
      .hero{grid-template-columns:1fr;min-height:auto;padding:80px 32px}
      .hero-right{display:none}
      .feat-grid,.hiw-steps,.review-grid,.stats-inner{grid-template-columns:1fr 1fr}
      .demo-inner{grid-template-columns:1fr}
      .footer-inner{grid-template-columns:1fr 1fr}
    }
    @media(max-width:768px){
      .nav-centre{display:none}
      .nav-cta{display:none}
      .hamburger{display:flex}
      .hero{padding:40px 20px}
      .hero-h1{font-size:40px}
      .section-h2,.cta-h2{font-size:32px}
      .features,.hiw,.reviews,.demo-section,.cta-section,.stats-banner{padding:60px 20px}
      .feat-grid,.hiw-steps,.review-grid,.stats-inner,.footer-inner{grid-template-columns:1fr}
      .footer-inner{gap:24px}
    }
  `;

  /* ─── MARQUEE items ──────────────────────────────────────── */
  const MARQUEE = [
    {ico:'🔒','text':'End-to-End Encrypted'},{ico:'🤖',text:'AI-Powered Descriptions'},
    {ico:'⚡',text:'Instant Ticket Generation'},{ico:'📊',text:'Real-Time Analytics'},
    {ico:'🔔',text:'Smart Notifications'},{ico:'💬',text:'Live Agent Chat'},
    {ico:'📎',text:'File Attachments'},{ico:'🎯',text:'98% Resolution Rate'},
    {ico:'🕐',text:'24/7 Support'},{ico:'⭐',text:'5-Star Reviews'},
  ];

  if (!user) return null;

  /* ─── LANDING ──────────────────────────────────────────── */
  const Landing = () => (
    <>
      {threeReady && <ThreeCanvas/>}
      <CursorGlow/>

      {/* HERO */}
      <section className="hero" id="hero">
        <div className="hero-left">
          <div className="hero-tag"><span>✨</span> Powered by AI · Trusted by 10,000+ users</div>
          <h1 className="hero-h1"><span>Effortless</span><br/>Complaint Care<br/>Software</h1>
          <p className="hero-sub">File, track and resolve your complaints in one place. Get real-time updates, AI-assisted descriptions, and dedicated agent support — all without the runaround.</p>
          <div className="hero-checks">
            {['No lengthy phone queues','Real-time status updates','AI-powered complaint filing','Resolved within 24–48 hrs'].map(t=>(
              <div key={t} className="hero-check"><div className="hero-check-icon">✓</div> {t}</div>
            ))}
          </div>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => setView('raise')}>
              <Ico d={I.plus} size={15}/> File a Complaint
            </button>
            <button className="btn-outline" onClick={() => scrollTo('demo')}>
              <Ico d={I.eye} size={15}/> See Demo
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-card-wrap">
            <div className="hero-blob"/>
            <div className="float-badge" style={{ top:-18, left:-28, animation:'float 3s ease-in-out infinite' }}>
              <div className="float-badge-icon" style={{ background:'#f0fdf4' }}>✅</div>
              <div><div style={{ fontSize:12, fontWeight:700 }}>Complaint Resolved</div><div style={{ fontSize:10.5, color:'var(--muted)' }}>Ticket #TKT-2847</div></div>
            </div>
            <div className="float-badge" style={{ bottom:-18, right:-24, animation:'float 3s 1.5s ease-in-out infinite' }}>
              <div className="float-badge-icon" style={{ background:'#fef9e7' }}>⚡</div>
              <div><div style={{ fontSize:12, fontWeight:700 }}>Avg. Response</div><div style={{ fontSize:10.5, color:'var(--muted)' }}>Under 2 hours</div></div>
            </div>
            <div className="hero-card">
              <div className="hero-card-top">
                <div className="hct-dots">
                  <div className="hct-dot" style={{ background:'#ef4444' }}/>
                  <div className="hct-dot" style={{ background:'#f59e0b' }}/>
                  <div className="hct-dot" style={{ background:'#10b981' }}/>
                </div>
                <span className="hct-title">ResolveNow · Live Support</span>
                <div className="hct-badge">🟢 Online</div>
              </div>
              <ChatDemo/>
              <div className="chat-input-bar">
                <input type="text" placeholder="Type your complaint…" readOnly/>
                <button className="send-btn">
                  <Ico d={I.send} size={14} stroke="white"/>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-section">
        <div className="marquee-track">
          {[...MARQUEE,...MARQUEE].map((m,i)=>(
            <div key={i} className="marquee-item"><span>{m.ico}</span>{m.text}</div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="features-inner">
          <div className="reveal">
            <div className="section-tag">✦ Features</div>
            <h2 className="section-h2">Everything you need<br/>to get heard</h2>
            <p className="section-sub">From filing to resolution — our platform handles every step so your complaint never falls through the cracks.</p>
          </div>
          <div className="feat-grid">
            {[
              {ico:'🤖',bg:'#f0fdf4',title:'AI Description Helper',     desc:"Can't find the right words? Our AI rewrites your complaint into a clear, professional report that agents can act on instantly.",delay:.05},
              {ico:'⚡',bg:'#fef9e7',title:'Instant Ticket ID',          desc:'Every complaint gets a unique ticket ID the moment you submit. Copy it, share it, track it — your reference is always with you.',delay:.1},
              {ico:'🔔',bg:'#f0f4ff',title:'Real-Time Notifications',    desc:'Get notified the moment your complaint is assigned, updated, or resolved. No more guessing or refreshing.',delay:.15},
              {ico:'💬',bg:'#fff9f0',title:'Live Agent Chat',             desc:'Communicate directly with your assigned support agent inside the complaint thread. Faster resolutions, less frustration.',delay:.2},
              {ico:'📎',bg:'#fdf0f8',title:'File Attachments',            desc:'Attach photos, invoices, screenshots or documents directly to your complaint — up to 5 files per ticket.',delay:.25},
              {ico:'📊',bg:'#f0fdf8',title:'Personal Analytics',          desc:'Track your filing history, resolution rates, and average response times with your personal complaint dashboard.',delay:.3},
            ].map(f=>(
              <div key={f.title} className="feat-card reveal" style={{ transitionDelay:`${f.delay}s` }}>
                <div className="feat-icon" style={{ background:f.bg }}>{f.ico}</div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-banner" id="stats">
        <div className="stats-inner">
          {[
            { target:10000, suffix:'+',    lbl:'Complaints Resolved', delay:.05 },
            { target:2,     prefix:'< ',   suffix:' hrs', lbl:'Avg. First Response', delay:.1 },
            { target:98,    suffix:'%',    lbl:'User Satisfaction',   delay:.15 },
            { isStatic:true, staticVal:'24/7', lbl:'Support Coverage', delay:.2 },
          ].map((s,i)=>(
            <div key={i} className="stat-card reveal-scale" style={{ transitionDelay:`${s.delay}s` }}>
              <StatCounter {...s}/>
              <div className="stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="hiw" id="hiw">
        <div className="hiw-inner">
          <div style={{ textAlign:'center' }} className="reveal">
            <div className="section-tag">✦ Process</div>
            <h2 className="section-h2">Resolved in 4 simple steps</h2>
            <p className="section-sub" style={{ margin:'0 auto', textAlign:'center' }}>No forms lost in email, no endless hold music. Just clear, accountable complaint resolution.</p>
          </div>
          <div className="hiw-steps">
            {[
              {n:'1',title:'File Your Complaint',desc:'Describe your issue in plain language. Our AI helps you write it clearly so agents understand immediately.',delay:.1},
              {n:'2',title:'Get Your Ticket ID', desc:'Receive an instant unique ticket ID. Your complaint is logged and queued for assignment.',delay:.2},
              {n:'3',title:'Agent Takes Over',   desc:'A dedicated agent reviews your case, contacts you via the chat thread, and works toward resolution.',delay:.3},
              {n:'4',title:'Resolved & Rated',   desc:'Once resolved, rate your experience. If the issue persists, reopen your ticket within 7 days.',delay:.4},
            ].map(s=>(
              <div key={s.n} className="hiw-step reveal" style={{ transitionDelay:`${s.delay}s` }}>
                <div className="hiw-num">{s.n}</div>
                <div className="hiw-title">{s.title}</div>
                <div className="hiw-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO */}
      <DemoSection setView={setView}/>

      {/* REVIEWS */}
      <section className="reviews" id="reviews">
        <div className="reviews-inner">
          <div style={{ textAlign:'center' }} className="reveal">
            <div className="section-tag">✦ Reviews</div>
            <h2 className="section-h2">What our users say</h2>
          </div>
          <div className="review-grid">
            {[
              {stars:5,text:`I filed a complaint about a wrong delivery and it was resolved within 6 hours. The agent kept me updated throughout. Best support experience I've ever had.`,name:'Priya Sharma',role:'E-commerce Customer',av:'P',bg:'#d4f000',delay:.1},
              {stars:5,text:'The AI description helper is incredible. I typed a few broken sentences and it turned into a perfectly clear complaint. My issue got resolved same day.',name:'Ravi Kumar',role:'Tech User',av:'R',bg:'#ffd6a5',delay:.2},
              {stars:5,text:`Finally a platform where I can actually track what's happening with my complaint. No more chasing emails or calling helplines on hold for 40 minutes.`,name:'Ananya Patel',role:'Service Customer',av:'A',bg:'#caffbf',delay:.3},
            ].map(r=>(
              <div key={r.name} className="review-card reveal" style={{ transitionDelay:`${r.delay}s` }}>
                <div className="review-stars">{'★'.repeat(r.stars)}</div>
                <div className="review-text">{r.text}</div>
                <div className="review-author">
                  <div className="review-av" style={{ background:r.bg }}>{r.av}</div>
                  <div><div className="review-name">{r.name}</div><div className="review-role">{r.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <div style={{ maxWidth:640, margin:'0 auto' }} className="reveal-scale">
          <h2 className="cta-h2">Ready to get your<br/>issue resolved?</h2>
          <p className="cta-sub">Join thousands who've had their complaints resolved quickly and fairly.<br/>File yours in under 2 minutes.</p>
          <div className="cta-btns">
            <button className="btn-primary" style={{ fontSize:16, padding:'16px 34px' }} onClick={() => setView('raise')}>
              🎯 File a Complaint Now
            </button>
            <button className="btn-outline" style={{ color:'white', borderColor:'rgba(255,255,255,.25)', fontSize:16, padding:'16px 34px' }} onClick={() => setView('complaints')}>
              <Ico d={I.list} size={16}/> View My Complaints
            </button>
          </div>
        </div>
      </section>
      
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <style>{USER_CSS}</style>
      <Toasts/>

      {/* ─── NAVBAR ─────────────────────────────────────────── */}
      <nav className="nav" ref={navRef}>
        {/* Brand */}
        <div className="nav-brand" onClick={() => setView('landing')}>
          <div className="nav-brand-icon">🎯</div>
          ResolveNow
        </div>

        {/* Centre — always the 3 React nav links: Dashboard, My Complaints, File Complaint */}
        <div className="nav-centre">
          {NAV_ITEMS.map(item => (
            <button key={item.id}
              className={`nav-link${view === item.id ? ' active' : ''}`}
              onClick={() => setView(item.id)}>
              <Ico d={item.icon} size={13}/>
              {item.label}
              {item.id === 'notifications' && unreadCount > 0 && (
                <span className="notif-pip">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Right */}
        <div className="nav-right">

          {/* Search bar */}
          <div style={{ position:'relative', display:'flex', alignItems:'center' }}>
            <span style={{ position:'absolute', left:10, color:'var(--muted)', pointerEvents:'none' }}>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
            </span>
            <input
              style={{
                padding:'7px 12px 7px 30px', borderRadius:50,
                border:'1.5px solid var(--border)', background:'var(--surface)',
                fontFamily:'var(--font)', fontSize:'12.5px', color:'var(--text)',
                outline:'none', width:170, transition:'all .2s',
              }}
              placeholder="Search complaints…"
              value={searchVal}
              onChange={e => { setSearchVal(e.target.value); if(e.target.value) setView('complaints'); }}
              onFocus={e => { e.target.style.borderColor='var(--accent-dark)'; e.target.style.width='200px'; }}
              onBlur={e => { e.target.style.borderColor='var(--border)'; e.target.style.width='170px'; }}
            />
          </div>

          {/* Bell */}
          <div ref={notifRef} style={{ position:'relative' }}>
            <button className="nav-icon-btn" onClick={()=>{ setNotifOpen(o=>!o); setProfileOpen(false); }}>
              <Ico d={I.bell} size={15}/>
              {unreadCount>0 && <span className="pip"/>}
            </button>
            {notifOpen && (
              <div className="nav-dropdown" style={{ width:230, right:0 }}>
                <div style={{ padding:'12px 16px', fontSize:13, color:'var(--text2)', textAlign:'center' }}>
                  {unreadCount>0 ? `${unreadCount} unread notification${unreadCount>1?'s':''}` : 'All caught up! 🎉'}
                </div>
                <div style={{ borderTop:'1px solid var(--border)', padding:'8px 0' }}>
                  <button className="drop-item" onClick={()=>{ setView('notifications'); setNotifOpen(false); }}>
                    <Ico d={I.bell} size={13}/> View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} style={{ position:'relative' }}>
            <div style={{ display:'flex', alignItems:'center', gap:7, padding:'4px 10px 4px 4px', borderRadius:50, border:'1.5px solid var(--border)', background:'var(--surface)', cursor:'pointer', transition:'all .15s' }}
              onClick={()=>{ setProfileOpen(o=>!o); setNotifOpen(false); }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='var(--accent-dark)'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='var(--border)'}>
              <div style={{ width:30, height:30, borderRadius:'50%', background:'var(--accent)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:13, color:'var(--text)', flexShrink:0 }}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:'var(--text)' }}>{user.name?.split(' ')[0]}</span>
              <span style={{ fontSize:10, color:'var(--muted)' }}>▾</span>
            </div>
            {profileOpen && (
              <div className="nav-dropdown" style={{ right:0, minWidth:210 }}>
                <div className="drop-hdr">
                  <div className="drop-av">{user.name?.charAt(0).toUpperCase()}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--text)' }}>{user.name}</div>
                    <div style={{ fontSize:11, color:'var(--muted)' }}>Member</div>
                  </div>
                </div>
                <div style={{ padding:'5px 0' }}>
                  <button className="drop-item" onClick={()=>{ setView('dashboard'); setProfileOpen(false); }}><Ico d={I.home} size={13}/> Dashboard</button>
                  <button className="drop-item" onClick={()=>{ setView('profile'); setProfileOpen(false); }}><Ico d={I.user} size={13}/> My Profile</button>
                  <button className="drop-item" onClick={()=>{ setView('complaints'); setProfileOpen(false); }}><Ico d={I.list} size={13}/> My Complaints</button>
                  <button className="drop-item" onClick={()=>{ setView('raise'); setProfileOpen(false); }}><Ico d={I.plus} size={13}/> File Complaint</button>
                  <button className="drop-item" onClick={()=>{ setView('notifications'); setProfileOpen(false); }}>
                    <Ico d={I.bell} size={13}/> Notifications
                    {unreadCount>0 && <span className="notif-pip" style={{ marginLeft:'auto' }}>{unreadCount}</span>}
                  </button>
                  <div style={{ height:1, background:'var(--border)', margin:'4px 0' }}/>
                  <button className="drop-item danger" onClick={logout}><Ico d={I.logout} size={13} stroke="#dc2626"/> Sign Out</button>
                </div>
              </div>
            )}
          </div>

          {/* CTA */}
          <button className="nav-cta" onClick={() => setView('raise')}>
            <Ico d={I.plus} size={14}/> File Complaint
          </button>

          {/* Hamburger */}
          <button className="hamburger" onClick={()=>setMobileOpen(o=>!o)}>
            <Ico d={mobileOpen ? I.close : I.menu} size={16}/>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="mobile-menu" onClick={() => setMobileOpen(false)}>
          {[
            { id:'landing',       label:'🏠 Home'            },
            { id:'dashboard',     label:'📊 Dashboard'       },
            { id:'complaints',    label:'📋 My Complaints'   },
            { id:'raise',         label:'➕ File Complaint'  },
            { id:'notifications', label:'🔔 Notifications'   },
            { id:'profile',       label:'👤 My Profile'      },
          ].map(item => (
            <button key={item.id}
              className={`mobile-menu-link${view === item.id ? ' active' : ''}`}
              onClick={() => { setView(item.id); setMobileOpen(false); }}>
              {item.label}
              {item.id === 'notifications' && unreadCount > 0 && (
                <span className="notif-pip" style={{ marginLeft:'auto' }}>{unreadCount}</span>
              )}
            </button>
          ))}
          <div style={{ height:1, background:'var(--border)', margin:'6px 0' }}/>
          <button className="mobile-menu-link" style={{ color:'#dc2626' }} onClick={logout}>🚪 Sign Out</button>
        </div>
      )}

      {/* ─── VIEWS ──────────────────────────────────────────── */}
      {isLanding ? <Landing/> : (
        <div className="shell">
          <main className="main">
            {loading && (
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(130px,1fr))', gap:12, marginBottom:18 }}>
                  {[1,2,3,4].map(i=><div key={i} className="skel" style={{ height:80 }}/>)}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div className="skel" style={{ height:200 }}/>
                  <div className="skel" style={{ height:200 }}/>
                </div>
              </div>
            )}
            {!loading && (
              <>
                {view==='dashboard' && <UserDashboard userName={user.name} complaints={complaints} setView={setView} setSelectedC={c=>{setSelectedC(c);setView('detail');}}/>}
                {view==='complaints' && <UserComplaints complaints={complaints} setComplaints={setComplaints} setView={setView} setSelectedC={(c,v)=>{setSelectedC(c);setView(v||'detail');}} userId={user._id}/>}
                {view==='raise'     && <UserRaise userId={user._id} userName={user.name} complaints={complaints} setComplaints={setComplaints} setView={setView}/>}
                {view==='detail'    && selectedC && <UserDetail complaint={selectedC} user={user} setView={setView} setComplaints={setComplaints}/>}
                {view==='edit'      && selectedC && <UserRaise userId={user._id} userName={user.name} complaints={complaints} setComplaints={setComplaints} setView={setView} editComplaint={selectedC}/>}
                {view==='notifications' && <UserNotifications userId={user._id} unreadCount={unreadCount} setUnreadCount={setUnreadCount}/>}
                {view==='profile'   && <UserProfile user={user} complaints={complaints} logout={logout} setUser={setUser}/>}
              </>
            )}
          </main>
        </div>
      )}
      <Footer />
    </>
  );
}