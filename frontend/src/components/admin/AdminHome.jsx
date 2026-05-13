import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../user/axiosInstance';
import AccordionAdmin from './AccordionAdmin';
import UserInfo from './UserInfo';
import AgentInfo from './AgentInfo';
import Footer from '../common/FooterC';

const API = 'https://resolve-complaint.onrender.com';

/* ─── Toast ──────────────────────────────────────────────── */
let _tid = 0, _setT = () => {};
export function showToast(msg, type = 'i') {
  const id = ++_tid;
  _setT(p => [...p, { id, msg, type: type==='success'?'s':type==='error'?'e':'i' }]);
  setTimeout(() => _setT(p => p.filter(t => t.id !== id)), 3500);
}
function Toasts() {
  const [list, set] = useState([]); _setT = set;
  if (!list.length) return null;
  return (
    <div style={{ position:'fixed', bottom:24, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:8 }}>
      {list.map(t => (
        <div key={t.id} style={{
          padding:'11px 18px', borderRadius:14, fontSize:13.5, fontWeight:700,
          fontFamily:"'Plus Jakarta Sans',sans-serif", boxShadow:'0 8px 32px rgba(0,0,0,.1)',
          display:'flex', alignItems:'center', gap:9, minWidth:260,
          animation:'adm-popIn .3s cubic-bezier(.34,1.56,.64,1) both',
          background: t.type==='s'?'#f0fdf4':t.type==='e'?'#fef2f2':'#eff6ff',
          border:`1.5px solid ${t.type==='s'?'#86efac':t.type==='e'?'#fecaca':'#bfdbfe'}`,
          color: t.type==='s'?'#15803d':t.type==='e'?'#dc2626':'#1d4ed8',
        }}>
          {t.type==='s'?'✓':t.type==='e'?'✕':'ℹ'} {t.msg}
        </div>
      ))}
    </div>
  );
}

/* ─── Bar Chart ──────────────────────────────────────────── */
function BarChart({ data, color='#2D6A4F', height=130 }) {
  const max = Math.max(...data.map(d => d.v), 1);
  const W=340, H=height, px=10, py=24;
  const bw=(W-px*2)/data.length-5;
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:'visible' }}>
      {data.map((d, i) => {
        const bh=Math.max(d.v>0?(d.v/max)*(H-py-16):0, d.v>0?4:0);
        const x=px+i*((W-px*2)/data.length)+2.5, y=H-py-bh;
        return (
          <g key={i}>
            <rect x={x} y={H-py} width={bw} height={2} fill={color} opacity={.12} rx={2}/>
            <rect x={x} y={y} width={bw} height={bh} fill={color} opacity={d.v>0?.8:.08} rx={4}/>
            <text x={x+bw/2} y={H-8} textAnchor="middle" fill="#a8a29e" fontSize={9}>{d.l}</text>
            {d.v>0&&<text x={x+bw/2} y={y-5} textAnchor="middle" fill={color} fontSize={9} fontWeight={600}>{d.v}</text>}
          </g>
        );
      })}
    </svg>
  );
}

/* ─── Donut ──────────────────────────────────────────────── */
function Donut({ slices }) {
  const total = slices.reduce((a,s)=>a+s.v,0)||1;
  let cum=0;
  const cx=60,cy=60,r=52,ir=34;
  const paths = slices.map(s => {
    const pct=s.v/total; if(pct===0) return null;
    const sa=cum*2*Math.PI-Math.PI/2; cum+=pct;
    const ea=cum*2*Math.PI-Math.PI/2;
    const x1=cx+r*Math.cos(sa),y1=cy+r*Math.sin(sa);
    const x2=cx+r*Math.cos(ea),y2=cy+r*Math.sin(ea);
    const ix1=cx+ir*Math.cos(sa),iy1=cy+ir*Math.sin(sa);
    const ix2=cx+ir*Math.cos(ea),iy2=cy+ir*Math.sin(ea);
    return <path key={s.l} fill={s.color} opacity={.88}
      d={`M${x1} ${y1}A${r} ${r} 0 ${pct>.5?1:0} 1 ${x2} ${y2}L${ix2} ${iy2}A${ir} ${ir} 0 ${pct>.5?1:0} 0 ${ix1} ${iy1}Z`}/>;
  });
  return (
    <div style={{ display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}>
      <svg width={120} height={120} viewBox="0 0 120 120" style={{ flexShrink:0 }}>
        {paths}
        <text x={cx} y={cy-4} textAnchor="middle" fontSize={18} fontWeight={700} fill="#1c1917">{total}</text>
        <text x={cx} y={cy+12} textAnchor="middle" fontSize={9} fill="#78716c">total</text>
      </svg>
      <div style={{ display:'flex', flexDirection:'column', gap:9 }}>
        {slices.map(s=>(
          <div key={s.l} style={{ display:'flex', alignItems:'center', gap:9 }}>
            <div style={{ width:10,height:10,borderRadius:3,background:s.color,flexShrink:0 }}/>
            <span style={{ fontSize:12.5,color:'#44403c',flex:1 }}>{s.l}</span>
            <span style={{ fontSize:13,fontWeight:700,color:'#1c1917',paddingLeft:12 }}>{s.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CSS ─────────────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Sora:wght@600;700;800&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
:root{
  --bg:#F8F7F4;--bg2:#F0EEE9;--white:#FFF;
  --border:#E5E3DC;--border2:#CCCAC2;
  --green:#2D6A4F;--green2:#40916C;--green3:#74C69D;
  --green-lt:#D8F3DC;--green-pale:#F0FAF3;
  --amber:#92400E;--amber-bg:#FEF3C7;
  --red:#B91C1C;--red-bg:#FEF2F2;
  --blue:#1E40AF;--blue-bg:#EFF6FF;
  --purple:#6D28D9;--purple-bg:#F5F3FF;
  --text:#1C1917;--text2:#44403C;--muted:#78716C;--muted2:#A8A29E;
  --font:'Plus Jakarta Sans',sans-serif;--display:'Sora',sans-serif;--mono:'DM Mono',monospace;
  --nav-h:66px;--r:14px;--r-lg:20px;
  --sh1:0 1px 3px rgba(0,0,0,.05),0 1px 2px rgba(0,0,0,.03);
  --sh2:0 4px 16px rgba(0,0,0,.07),0 2px 6px rgba(0,0,0,.04);
  --sh3:0 12px 40px rgba(0,0,0,.09),0 4px 14px rgba(0,0,0,.05);
}
body,#root{background:var(--bg);color:var(--text);font-family:var(--font);min-height:100vh}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-thumb{background:var(--border2);border-radius:10px}
@keyframes adm-popIn{0%{transform:scale(.88);opacity:0}100%{transform:scale(1);opacity:1}}
@keyframes adm-fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@keyframes adm-slideDown{from{opacity:0;transform:translateY(-10px) scale(.97)}to{opacity:1;transform:none}}
@keyframes adm-shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
@keyframes adm-blink{0%,100%{opacity:1}50%{opacity:.3}}
.an{position:fixed;top:0;left:0;right:0;z-index:400;height:var(--nav-h);background:rgba(255,255,255,.96);backdrop-filter:blur(24px);border-bottom:1.5px solid var(--border);box-shadow:var(--sh1);display:flex;align-items:center;justify-content:space-between;padding:0 28px;gap:16px}
.an-brand{display:flex;align-items:center;gap:10px;flex-shrink:0;cursor:pointer}
.an-mark{width:38px;height:38px;border-radius:11px;flex-shrink:0;background:linear-gradient(135deg,#2D6A4F,#40916C);display:flex;align-items:center;justify-content:center;font-size:18px;box-shadow:0 3px 10px rgba(45,106,79,.28)}
.an-name{font-family:var(--display);font-size:16px;font-weight:700;color:var(--text);letter-spacing:-.01em}
.an-badge-pill{font-size:9.5px;font-weight:700;letter-spacing:.07em;background:var(--green-lt);color:var(--green);border:1px solid rgba(45,106,79,.22);border-radius:6px;padding:2px 7px}
.an-nav-links{display:flex;align-items:center;justify-content:center;gap:4px;flex:1;overflow-x:auto}
.an-tab{display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:10px;border:none;background:transparent;font-family:var(--font);font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;transition:all .18s;white-space:nowrap}
.an-tab:hover{color:var(--text2);background:rgba(0,0,0,.04)}
.an-tab.active{color:var(--green);background:var(--green-pale);font-weight:700}
.an-tab-badge{background:var(--red);color:#fff;border-radius:50px;font-size:9px;font-weight:800;padding:1px 6px;min-width:16px;text-align:center}
.an-right{display:flex;align-items:center;gap:9px;flex-shrink:0}
.an-search-wrap{position:relative;display:flex;align-items:center}
.an-search-ico{position:absolute;left:11px;color:var(--muted2);pointer-events:none}
.an-search{padding:8px 14px 8px 33px;border-radius:50px;border:1.5px solid var(--border);background:var(--bg2);font-family:var(--font);font-size:12.5px;color:var(--text);outline:none;width:180px;transition:all .2s}
.an-search::placeholder{color:var(--muted2)}
.an-search:focus{border-color:var(--green3);background:var(--white);width:210px;box-shadow:0 0 0 3px rgba(45,106,79,.1)}
.an-icon-btn{width:38px;height:38px;border-radius:11px;background:var(--bg2);border:1.5px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:1rem;transition:all .15s;position:relative;flex-shrink:0;box-shadow:var(--sh1)}
.an-icon-btn:hover{background:var(--green-pale);border-color:var(--green3)}
.an-notif-pip{position:absolute;top:6px;right:6px;width:8px;height:8px;border-radius:50%;background:var(--red);border:2px solid var(--white);animation:adm-blink 2s ease infinite}
.an-notif-wrap{position:relative}
.an-drop{position:absolute;top:calc(100% + 10px);right:0;width:315px;background:var(--white);border:1.5px solid var(--border);border-radius:18px;box-shadow:var(--sh3);z-index:500;overflow:hidden;animation:adm-slideDown .22s ease both}
.an-drop-hdr{padding:13px 16px;display:flex;align-items:center;justify-content:space-between;background:var(--bg2);border-bottom:1.5px solid var(--border)}
.an-drop-title{font-size:13px;font-weight:700;color:var(--text)}
.an-drop-mark{font-size:11.5px;font-weight:600;color:var(--green);background:none;border:none;cursor:pointer;font-family:var(--font)}
.an-notif-item{display:flex;gap:11px;padding:12px 16px;border-bottom:1px solid var(--border);cursor:pointer;transition:background .12s}
.an-notif-item:last-child{border:none}
.an-notif-item:hover{background:var(--green-pale)}
.an-notif-item.unread{background:#f7fef9}
.an-notif-ico{width:34px;height:34px;border-radius:10px;background:var(--green-lt);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.an-notif-msg{font-size:12.5px;color:var(--text2);line-height:1.45}
.an-notif-time{font-size:11px;color:var(--muted2);margin-top:2px}
.an-notif-dot{width:7px;height:7px;border-radius:50%;background:var(--green);flex-shrink:0;margin-top:5px}
.an-notif-empty{padding:28px;text-align:center;font-size:13px;color:var(--muted)}
.an-drop-footer{padding:10px 16px;border-top:1px solid var(--border);text-align:center}
.an-drop-footer button{font-size:12.5px;color:var(--green);font-weight:600;background:none;border:none;cursor:pointer;font-family:var(--font)}
.an-profile-wrap{position:relative}
.an-profile-btn{display:flex;align-items:center;gap:9px;padding:5px 12px 5px 5px;background:var(--bg2);border:1.5px solid var(--border);border-radius:50px;cursor:pointer;transition:all .15s;box-shadow:var(--sh1)}
.an-profile-btn:hover{background:var(--green-pale);border-color:var(--green3)}
.an-profile-av{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--green),var(--green2));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}
.an-profile-name{font-size:13px;font-weight:600;color:var(--text)}
.an-caret{font-size:10px;color:var(--muted);transition:transform .18s}
.an-caret.open{transform:rotate(180deg)}
.an-profile-drop{position:absolute;top:calc(100% + 10px);right:0;width:200px;background:var(--white);border:1.5px solid var(--border);border-radius:16px;box-shadow:var(--sh3);z-index:500;overflow:hidden;animation:adm-slideDown .22s ease both}
.an-drop-user{padding:14px 16px;display:flex;align-items:center;gap:10px;background:var(--bg2);border-bottom:1.5px solid var(--border)}
.an-drop-uav{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--green),var(--green2));display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;flex-shrink:0}
.an-drop-uname{font-size:13.5px;font-weight:700;color:var(--text)}
.an-drop-urole{font-size:10px;color:#fff;background:var(--green);border-radius:4px;padding:1px 7px;width:fit-content;margin-top:2px;font-weight:600}
.an-profile-item{display:flex;align-items:center;gap:9px;padding:10px 16px;font-size:13px;font-weight:500;color:var(--text2);cursor:pointer;transition:background .12s;border:none;background:transparent;width:100%;text-align:left;font-family:var(--font)}
.an-profile-item:hover{background:var(--bg2);color:var(--text)}
.an-profile-item.red{color:var(--red)}
.an-profile-item.red:hover{background:var(--red-bg)}
.an-profile-sep{height:1px;background:var(--border);margin:3px 0}
.an-cta{padding:9px 18px;border-radius:10px;border:none;background:linear-gradient(135deg,#2D6A4F,#40916C);color:#fff;font-family:var(--font);font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap;transition:all .18s;box-shadow:0 3px 10px rgba(45,106,79,.28)}
.an-cta:hover{transform:translateY(-1px);box-shadow:0 5px 18px rgba(45,106,79,.38)}
.an-ham{display:none;width:38px;height:38px;border-radius:11px;background:var(--bg2);border:1.5px solid var(--border);align-items:center;justify-content:center;cursor:pointer;font-size:1.1rem;color:var(--text)}
@media(max-width:960px){.an-ham{display:flex}.an-nav-links{display:none!important}}
.an-mobile-nav{position:fixed;top:var(--nav-h);left:0;right:0;background:var(--white);border-bottom:1.5px solid var(--border);padding:8px;z-index:350;box-shadow:var(--sh2);animation:adm-slideDown .2s ease both}
.an-mob-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:11px;background:transparent;border:none;font-family:var(--font);font-size:14px;font-weight:600;color:var(--muted);cursor:pointer;width:100%;transition:background .12s}
.an-mob-item.active{background:var(--green-pale);color:var(--green)}
.an-mob-item:hover:not(.active){background:var(--bg2)}
.a-shell{padding-top:var(--nav-h);min-height:100vh;background:var(--bg)}
.a-content{max-width:1200px;margin:0 auto;padding:32px 32px 60px;animation:adm-fadeUp .3s ease both}
@media(max-width:900px){.a-content{padding:20px 16px 48px}}
.a-pg-title{font-family:var(--display);font-size:28px;font-weight:700;color:var(--text);margin-bottom:5px;letter-spacing:-.02em}
.a-pg-sub{font-size:13.5px;color:var(--muted);margin-bottom:26px}
.a-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:14px;margin-bottom:26px}
.a-stat{background:var(--white);border:1.5px solid var(--border);border-radius:var(--r-lg);padding:20px 22px;box-shadow:var(--sh1);transition:transform .18s,box-shadow .18s;position:relative;overflow:hidden;cursor:default}
.a-stat:hover{transform:translateY(-2px);box-shadow:var(--sh2)}
.a-stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}
.a-stat-ico{width:42px;height:42px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:20px}
.a-stat-tag{font-size:10px;font-weight:700;letter-spacing:.06em;padding:3px 9px;border-radius:20px;font-family:var(--mono)}
.a-stat-num{font-family:var(--display);font-size:34px;font-weight:700;line-height:1;margin-bottom:5px;letter-spacing:-.02em}
.a-stat-lbl{font-size:12px;color:var(--muted);font-weight:500}
.a-stat-bar{position:absolute;bottom:0;left:0;right:0;height:3px;border-radius:0 0 var(--r-lg) var(--r-lg)}
.a-card{background:var(--white);border:1.5px solid var(--border);border-radius:var(--r-lg);padding:22px;box-shadow:var(--sh1);margin-bottom:18px}
.a-card:last-child{margin-bottom:0}
.a-card-hdr{display:flex;align-items:center;gap:8px;margin-bottom:18px}
.a-card-title{font-family:var(--display);font-size:15px;font-weight:700;color:var(--text)}
.a-card-link{margin-left:auto;font-size:12.5px;font-weight:600;color:var(--green);background:none;border:none;cursor:pointer;font-family:var(--font)}
.a-card-link:hover{text-decoration:underline}
.a-grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:18px}
@media(max-width:900px){.a-grid2{grid-template-columns:1fr}}
.a-quick{display:grid;grid-template-columns:repeat(auto-fit,minmax(195px,1fr));gap:13px;margin-bottom:26px}
.a-qcard{background:var(--white);border:1.5px solid var(--border);border-radius:var(--r-lg);padding:18px 20px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:all .2s;box-shadow:var(--sh1)}
.a-qcard:hover{transform:translateY(-2px);box-shadow:var(--sh2);border-color:var(--green3)}
.a-qcard-ico{width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:21px;flex-shrink:0}
.a-qcard-title{font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px}
.a-qcard-sub{font-size:12px;color:var(--muted)}
.a-tbl-wrap{overflow-x:auto}
.a-tbl{width:100%;border-collapse:collapse}
.a-tbl th{padding:10px 14px;font-size:11px;font-weight:700;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;border-bottom:1.5px solid var(--border);text-align:left;white-space:nowrap;background:var(--bg2)}
.a-tbl td{padding:13px 14px;font-size:13.5px;color:var(--text2);border-bottom:1px solid var(--border);transition:background .1s}
.a-tbl tr:last-child td{border-bottom:none}
.a-tbl tbody tr:hover td{background:var(--green-pale)}
.a-tbl td:first-child{color:var(--text);font-weight:600}
.a-pill{padding:4px 10px;border-radius:20px;font-size:11.5px;font-weight:600;white-space:nowrap;display:inline-block}
.a-wl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(225px,1fr));gap:14px}
.a-wl-card{background:var(--white);border:1.5px solid var(--border);border-radius:var(--r-lg);padding:18px 20px;display:flex;flex-direction:column;gap:11px;box-shadow:var(--sh1);transition:all .2s}
.a-wl-card:hover{transform:translateY(-2px);box-shadow:var(--sh2)}
.a-wl-top{display:flex;align-items:center;justify-content:space-between}
.a-wl-agent{display:flex;align-items:center;gap:10px}
.a-wl-av{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,var(--green),var(--green2));display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#fff;flex-shrink:0}
.a-wl-name{font-size:13.5px;font-weight:700;color:var(--text)}
.a-wl-email{font-size:11px;color:var(--muted)}
.a-wl-badge{font-size:11.5px;font-weight:700;padding:4px 11px;border-radius:20px}
.a-wl-track{height:6px;background:var(--bg2);border-radius:10px;overflow:hidden}
.a-wl-fill{height:100%;border-radius:10px;transition:width .6s ease}
.a-wl-meta{display:flex;gap:14px;font-size:12px;color:var(--muted);flex-wrap:wrap}
.a-skel{background:linear-gradient(90deg,var(--bg2) 25%,var(--border) 50%,var(--bg2) 75%);background-size:200% 100%;animation:adm-shimmer 1.4s ease infinite;border-radius:var(--r)}
.a-empty{text-align:center;padding:52px 16px}
.a-empty-ico{font-size:48px;opacity:.3;margin-bottom:10px}
.a-empty-title{font-family:var(--display);font-size:17px;font-weight:700;color:var(--muted);margin-bottom:4px}
.a-empty-sub{font-size:13px;color:var(--muted2)}
.a-float-btn{position:fixed;bottom:28px;right:28px;z-index:200;display:flex;align-items:center;gap:9px;padding:12px 24px;border-radius:50px;border:none;background:linear-gradient(135deg,var(--green),var(--green2));color:#fff;font-family:var(--font);font-size:13.5px;font-weight:700;cursor:pointer;box-shadow:0 6px 24px rgba(45,106,79,.35);transition:all .18s}
.a-float-btn:hover{transform:translateY(-2px);box-shadow:0 10px 32px rgba(45,106,79,.45)}
.ai-banner{background:linear-gradient(135deg,#f5f3ff,#ede9fe);border:1.5px solid rgba(109,40,217,.18);border-radius:16px;padding:18px 20px;display:flex;align-items:flex-start;gap:14px;margin-bottom:18px}
.ai-icon-wrap{width:44px;height:44px;border-radius:13px;background:linear-gradient(135deg,#7c3aed,#6d28d9);display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0}
.ai-banner-title{font-size:14px;font-weight:800;color:#4c1d95;margin-bottom:4px}
.ai-banner-desc{font-size:13px;color:#5b21b6;line-height:1.55}
.ai-btn{padding:8px 16px;border-radius:9px;border:none;background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;font-family:var(--font);font-size:12.5px;font-weight:700;cursor:pointer;transition:all .15s;display:flex;align-items:center;gap:6px;margin-top:10px;box-shadow:0 3px 10px rgba(109,40,217,.28)}
.ai-btn:hover{transform:translateY(-1px);box-shadow:0 5px 16px rgba(109,40,217,.38)}
.ai-btn:disabled{opacity:.6;cursor:not-allowed;transform:none}
.ana-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:12px;margin-bottom:20px}
.ana-card{background:var(--white);border:1.5px solid var(--border);border-radius:14px;padding:16px 18px;box-shadow:var(--sh1)}
.ana-num{font-family:var(--display);font-size:28px;font-weight:800;line-height:1;margin-bottom:4px}
.ana-lbl{font-size:11.5px;color:var(--muted);font-weight:500}
.cat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-bottom:18px}
.cat-card{background:var(--white);border:1.5px solid var(--border);border-radius:14px;padding:16px 18px;box-shadow:var(--sh1);display:flex;align-items:center;justify-content:space-between;gap:10px}
.cat-name{font-size:14px;font-weight:700;color:var(--text)}
.cat-sla{font-size:11.5px;color:var(--muted)}
.cat-actions{display:flex;gap:7px}
.cat-btn{padding:5px 12px;border-radius:8px;border:none;font-size:12px;font-weight:600;font-family:var(--font);cursor:pointer;transition:all .15s}
.cat-btn.edit{background:#eff6ff;color:#2563eb}
.cat-btn.del{background:#fef2f2;color:#dc2626}
.cat-btn.edit:hover{background:#dbeafe}
.cat-btn.del:hover{background:#fee2e2}
.audit-item{display:flex;gap:12px;padding:13px 16px;border-bottom:1px solid var(--border);align-items:flex-start}
.audit-item:last-child{border:none}
.audit-ico{width:34px;height:34px;border-radius:10px;background:var(--green-lt);display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;margin-top:1px}
.audit-action{font-size:13.5px;color:var(--text);font-weight:600;margin-bottom:2px}
.audit-detail{font-size:12px;color:var(--muted)}
.audit-time{font-size:11.5px;color:var(--muted2);white-space:nowrap;flex-shrink:0;margin-top:2px}
.a-modal-ov{position:fixed;inset:0;z-index:800;background:rgba(15,23,42,.35);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:1rem;animation:adm-fadeUp .2s ease both}
.a-modal{background:var(--white);border:1.5px solid var(--border);border-radius:22px;padding:26px;width:100%;max-width:480px;box-shadow:var(--sh3);animation:adm-popIn .3s cubic-bezier(.34,1.56,.64,1) both}
.a-modal-title{font-family:var(--display);font-size:20px;font-weight:800;color:var(--text);margin-bottom:5px}
.a-modal-sub{font-size:13px;color:var(--muted);margin-bottom:20px}
.a-form-field{margin-bottom:13px}
.a-form-label{font-size:11px;font-weight:700;color:var(--green);letter-spacing:.08em;text-transform:uppercase;margin-bottom:5px;display:block}
.a-form-input{width:100%;background:var(--bg2);border:1.5px solid var(--border);border-radius:11px;padding:10px 13px;font-size:13.5px;color:var(--text);font-family:var(--font);outline:none;transition:all .18s}
.a-form-input:focus{border-color:var(--green3);background:var(--white);box-shadow:0 0 0 3px rgba(45,106,79,.1)}
.a-form-input::placeholder{color:var(--muted2)}
.a-modal-footer{display:flex;gap:10px;justify-content:flex-end;margin-top:18px}
.a-modal-btn{padding:10px 20px;border-radius:11px;border:none;font-size:13.5px;font-weight:700;font-family:var(--font);cursor:pointer;transition:all .18s}
.a-modal-btn.submit{background:linear-gradient(135deg,var(--green),var(--green2));color:#fff;box-shadow:0 4px 14px rgba(45,106,79,.28)}
.a-modal-btn.submit:hover{transform:translateY(-1px)}
.a-modal-btn.cancel{background:var(--bg2);border:1px solid var(--border);color:var(--muted)}
.a-modal-btn.cancel:hover{background:var(--border)}
`;

/* ─── Helpers ─────────────────────────────────────────────── */
function toArr(raw, ...keys) {
  if (Array.isArray(raw)) return raw;
  for (const k of keys) if (Array.isArray(raw?.[k])) return raw[k];
  return [];
}

/* ─── Audit Log ───────────────────────────────────────────── */
const AUDIT_KEY = 'resolvenow_audit_log';
function addAuditEntry(action, detail) {
  const entry = { id: Date.now(), action, detail, at: new Date().toISOString() };
  const existing = JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
  localStorage.setItem(AUDIT_KEY, JSON.stringify([entry, ...existing].slice(0, 100)));
}
function getAuditLog() {
  return JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
}

/* ─── Dashboard ───────────────────────────────────────────── */
function Dashboard({ onNav, unreadCount }) {
  const [complaints, setComplaints] = useState([]);
  const [agents,     setAgents]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [anomaly,    setAnomaly]    = useState(null);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/status`).catch(() => ({ data: [] })),
      axios.get(`${API}/AgentUsers`).catch(() => ({ data: [] })),
    ]).then(([c, a]) => {
      const complaints = toArr(c.data, 'complaints', 'data', 'result');
      const agentsArr  = toArr(a.data, 'agents', 'data', 'users', 'result');
      setComplaints(complaints);
      setAgents(agentsArr);
      setLoading(false);
      const now = Date.now();
      const last24h  = complaints.filter(x => now - new Date(x.createdAt).getTime() < 86400000).length;
      const dailyAvg = complaints.length / 7;
      if (last24h > dailyAvg * 2.5 && last24h > 3) setAnomaly({ type:'spike', count:last24h, avg:Math.round(dailyAvg) });
      const cities = {};
      complaints.forEach(x => { if (x.city) cities[x.city] = (cities[x.city] || 0) + 1; });
      const topCity = Object.entries(cities).sort((a, b) => b[1] - a[1])[0];
      if (topCity && topCity[1] > complaints.length * 0.4 && complaints.length > 4)
        setAnomaly({ type:'city', city:topCity[0], count:topCity[1] });
    });
  }, []);

  const c   = complaints;
  const st  = { total:c.length, pending:c.filter(x=>x.status==='Pending').length, progress:c.filter(x=>x.status==='In Progress').length, resolved:c.filter(x=>x.status==='Resolved').length, agents:agents.length };
  const pct = st.total ? Math.round((st.resolved/st.total)*100) : 0;
  const barData = (() => {
    const days = [];
    for (let i=6;i>=0;i--) { const d=new Date(); d.setDate(d.getDate()-i); days.push({l:d.toLocaleDateString('en-IN',{weekday:'short'}),date:d.toDateString(),v:0}); }
    c.forEach(x => { const day=days.find(d=>d.date===new Date(x.createdAt).toDateString()); if(day) day.v++; });
    return days;
  })();
  const CARDS = [{label:'Total',num:st.total,color:'#2D6A4F',bg:'#D8F3DC',tag:'ALL'},{label:'Pending',num:st.pending,color:'#92400E',bg:'#FEF3C7',tag:'OPEN'},{label:'Active',num:st.progress,color:'#1E40AF',bg:'#DBEAFE',tag:'WIP'},{label:'Resolved',num:st.resolved,color:'#065F46',bg:'#D1FAE5',tag:'DONE'},{label:'Agents',num:st.agents,color:'#6D28D9',bg:'#EDE9FE',tag:'TEAM'}];
  const ICO = {ALL:'📁',OPEN:'⏳',WIP:'🔄',DONE:'✅',TEAM:'👥'};
  const SC  = {Pending:'#92400E','In Progress':'#1E40AF',Resolved:'#065F46',Rejected:'#B91C1C'};
  const SB  = {Pending:'#FEF3C7','In Progress':'#DBEAFE',Resolved:'#D1FAE5',Rejected:'#FEF2F2'};
  const recent = [...c].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,6);

  return (
    <>
      <div className="a-pg-title">Dashboard Overview 📊</div>
      <div className="a-pg-sub">{pct}% resolved · {st.pending} pending · {st.progress} in progress</div>

      {anomaly && (
        <div style={{background:'#fff7ed',border:'1.5px solid rgba(217,119,6,.3)',borderRadius:14,padding:'14px 18px',marginBottom:18,display:'flex',alignItems:'flex-start',gap:12}}>
          <span style={{fontSize:22}}>⚠️</span>
          <div>
            <div style={{fontSize:14,fontWeight:800,color:'#92400e',marginBottom:4}}>Anomaly Detected</div>
            {anomaly.type==='spike'&&<div style={{fontSize:13,color:'#b45309'}}>Complaint spike: <strong>{anomaly.count}</strong> in last 24h (avg: {anomaly.avg}/day).</div>}
            {anomaly.type==='city'&&<div style={{fontSize:13,color:'#b45309'}}>High concentration from <strong>{anomaly.city}</strong> — {anomaly.count} complaints.</div>}
          </div>
          <button onClick={()=>setAnomaly(null)} style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',color:'#b45309',fontSize:18,flexShrink:0}}>✕</button>
        </div>
      )}

      <div className="a-stats">
        {CARDS.map(s=>(
          <div key={s.label} className="a-stat" style={{borderColor:`${s.color}22`}}>
            <div className="a-stat-top">
              <div className="a-stat-ico" style={{background:s.bg}}>{ICO[s.tag]}</div>
              <span className="a-stat-tag" style={{background:s.bg,color:s.color}}>{s.tag}</span>
            </div>
            {loading?<div className="a-skel" style={{height:36,width:68,marginBottom:8}}/>:<div className="a-stat-num" style={{color:s.color}}>{s.num}</div>}
            <div className="a-stat-lbl">{s.label}</div>
            <div className="a-stat-bar" style={{background:`linear-gradient(90deg,${s.color},${s.color}55)`}}/>
          </div>
        ))}
      </div>

      <div style={{fontSize:11,fontWeight:700,color:'var(--muted)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:11}}>Quick Actions</div>
      <div className="a-quick">
        {[
          {ico:'📋',bg:'#D8F3DC',title:'Assign Complaints',sub:'Review & assign to agents',tab:'complaints'},
          {ico:'✅',bg:'#D1FAE5',title:'Assigned',sub:'Track assigned tickets',tab:'assigned'},
          {ico:'📊',bg:'#DBEAFE',title:'Analytics',sub:'Deep dive into metrics',tab:'analytics'},
          {ico:'📝',bg:'#F5F3FF',title:'Audit Log',sub:'All admin actions',tab:'audit'},
        ].map(a=>(
          <div key={a.title} className="a-qcard" onClick={()=>onNav(a.tab)}>
            <div className="a-qcard-ico" style={{background:a.bg}}>{a.ico}</div>
            <div><div className="a-qcard-title">{a.title}</div><div className="a-qcard-sub">{a.sub}</div></div>
          </div>
        ))}
      </div>

      <div className="a-grid2">
        <div className="a-card" style={{marginBottom:0}}>
          <div className="a-card-hdr"><span className="a-card-title">📈 Last 7 Days</span></div>
          {loading?<div className="a-skel" style={{height:120}}/>:<BarChart data={barData} color="#2D6A4F"/>}
        </div>
        <div className="a-card" style={{marginBottom:0}}>
          <div className="a-card-hdr"><span className="a-card-title">🍩 Status Breakdown</span></div>
          {loading?<div className="a-skel" style={{height:120}}/>:<Donut slices={[{l:'Pending',v:st.pending,color:'#F59E0B'},{l:'In Progress',v:st.progress,color:'#3B82F6'},{l:'Resolved',v:st.resolved,color:'#10B981'}]}/>}
        </div>
      </div>

      <div className="a-card">
        <div className="a-card-hdr">
          <span className="a-card-title">🕒 Recent Complaints</span>
          <button className="a-card-link" onClick={()=>onNav('complaints')}>View all →</button>
        </div>
        {loading?[1,2,3].map(i=><div key={i} className="a-skel" style={{height:44,marginBottom:8}}/>):
          recent.length===0?<div className="a-empty"><div className="a-empty-ico">📭</div><div className="a-empty-title">No complaints yet</div></div>:(
          <div className="a-tbl-wrap">
            <table className="a-tbl">
              <thead><tr><th>Name</th><th>City</th><th>Category</th><th>Filed</th><th>Status</th></tr></thead>
              <tbody>
                {recent.map(r=>{
                  const col=SC[r.status]||'#78716C', bg=SB[r.status]||'#F5F5F4';
                  return (<tr key={r._id}><td>{r.name}</td><td style={{color:'var(--muted)'}}>{r.city}</td><td style={{color:'var(--muted)'}}>{r.category||'—'}</td><td style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--muted2)'}}>{r.createdAt?new Date(r.createdAt).toLocaleDateString('en-IN'):'—'}</td><td><span className="a-pill" style={{background:bg,color:col,border:`1px solid ${col}28`}}>{r.status}</span></td></tr>);
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

/* ─── Analytics ───────────────────────────────────────────── */
function AnalyticsPage() {
  const [complaints, setComplaints] = useState([]);
  const [agents,     setAgents]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [aiSummary,  setAiSummary]  = useState('');
  const [aiLoading,  setAiLoading]  = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/status`).catch(()=>({data:[]})),
      axios.get(`${API}/AgentUsers`).catch(()=>({data:[]})),
    ]).then(([c, a]) => {
      setComplaints(toArr(c.data, 'complaints', 'data', 'result'));
      setAgents(toArr(a.data, 'agents', 'data', 'users', 'result'));
      setLoading(false);
    });
  }, []);

  const c        = complaints;
  const total    = c.length || 1;
  const resolved = c.filter(x=>x.status==='Resolved'||x.status==='completed').length;
  const pending  = c.filter(x=>x.status==='Pending').length;
  const progress = c.filter(x=>x.status==='In Progress').length;
  const resRate  = Math.round((resolved/total)*100);

  const catCounts = {};
  c.forEach(x=>{ if(x.category) catCounts[x.category]=(catCounts[x.category]||0)+1; });
  const topCats = Object.entries(catCounts).sort((a,b)=>b[1]-a[1]).slice(0,5);

  const cityCounts = {};
  c.forEach(x=>{ if(x.city) cityCounts[x.city]=(cityCounts[x.city]||0)+1; });
  const topCities = Object.entries(cityCounts).sort((a,b)=>b[1]-a[1]).slice(0,6);

  const monthData = [];
  for(let i=29;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); monthData.push({l:i%5===0?d.getDate().toString():'',date:d.toDateString(),v:0}); }
  c.forEach(x=>{ const day=monthData.find(d=>d.date===new Date(x.createdAt).toDateString()); if(day) day.v++; });

  const avgRes    = resolved > 0 ? '< 48h' : '—';
  const last7     = monthData.slice(-7).reduce((a,b)=>a+b.v,0);
  const prev7     = monthData.slice(-14,-7).reduce((a,b)=>a+b.v,0);
  const growthRate= prev7 > 0 ? (last7-prev7)/prev7 : 0;
  const forecast  = Array.from({length:7},(_,i)=>({l:`D+${i+1}`,v:Math.max(0,Math.round((last7/7)*(1+growthRate*(i+1)/7)))}));

  const generateAiSummary = async () => {
    setAiLoading(true);
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:300,
          messages:[{role:'user',content:`You are a complaint analytics expert. Summarize these complaint stats in 3 sharp sentences for an admin: Total=${total}, Pending=${pending}, InProgress=${progress}, Resolved=${resolved}, ResolutionRate=${resRate}%, TopCategory=${topCats[0]?.[0]||'N/A'}, TopCity=${topCities[0]?.[0]||'N/A'}. Be concise and actionable.`}]
        })
      });
      const data = await res.json();
      setAiSummary(data.content?.[0]?.text || 'Unable to generate summary.');
    } catch { setAiSummary('AI summary unavailable.'); }
    setAiLoading(false);
    addAuditEntry('AI Summary Generated','Admin requested AI analytics summary');
  };

  return (
    <>
      <div className="a-pg-title">Advanced Analytics 📈</div>
      <div className="a-pg-sub">Deep insights into complaint trends, resolution performance, and forecasts.</div>
      <div className="ai-banner">
        <div className="ai-icon-wrap">🤖</div>
        <div style={{flex:1}}>
          <div className="ai-banner-title">AI Analytics Summary</div>
          <div className="ai-banner-desc">{aiSummary||'Get a 3-sentence AI-generated summary of your current complaint landscape and recommended actions.'}</div>
          <button className="ai-btn" onClick={generateAiSummary} disabled={aiLoading}>{aiLoading?'⏳ Generating…':'✨ Generate AI Summary'}</button>
        </div>
      </div>
      <div className="ana-grid">
        {[
          {label:'Resolution Rate',num:`${resRate}%`,color:'#059669'},
          {label:'Total Complaints',num:total,color:'#2563eb'},
          {label:'Avg Resolution',num:avgRes,color:'#7c3aed'},
          {label:'Active Agents',num:agents.length,color:'#d97706'},
          {label:'SLA Breach Est.',num:`${Math.max(0,pending-Math.round(agents.length*2))}`,color:'#dc2626'},
        ].map(s=>(
          <div key={s.label} className="ana-card">
            <div className="ana-num" style={{color:s.color}}>{s.num}</div>
            <div className="ana-lbl">{s.label}</div>
          </div>
        ))}
      </div>
      <div className="a-card">
        <div className="a-card-hdr"><span className="a-card-title">📅 30-Day Complaint Volume</span></div>
        {loading?<div className="a-skel" style={{height:120}}/>:<BarChart data={monthData} color="#2D6A4F" height={140}/>}
      </div>
      <div className="a-grid2">
        <div className="a-card" style={{marginBottom:0}}>
          <div className="a-card-hdr"><span className="a-card-title">🏷 Top Categories</span></div>
          {topCats.length===0?<div style={{color:'var(--muted)',fontSize:13,textAlign:'center',padding:'24px 0'}}>No category data yet</div>:
            topCats.map(([cat,count])=>{ const pct=Math.round((count/total)*100); return(
              <div key={cat} style={{marginBottom:13}}>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:13,fontWeight:600,color:'var(--text)',marginBottom:5}}><span>{cat}</span><span style={{color:'var(--muted)'}}>{count} ({pct}%)</span></div>
                <div style={{height:7,background:'var(--bg2)',borderRadius:4,overflow:'hidden'}}><div style={{height:'100%',borderRadius:4,background:'linear-gradient(90deg,#2D6A4F,#40916C)',width:`${pct}%`,transition:'width .6s ease'}}/></div>
              </div>
            );})}
        </div>
        <div className="a-card" style={{marginBottom:0}}>
          <div className="a-card-hdr"><span className="a-card-title">🗺 Top Cities</span></div>
          {topCities.length===0?<div style={{color:'var(--muted)',fontSize:13,textAlign:'center',padding:'24px 0'}}>No city data yet</div>:
            topCities.map(([city,count],i)=>(
              <div key={city} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 0',borderBottom:i<topCities.length-1?'1px solid var(--border)':'none'}}>
                <div style={{width:24,height:24,borderRadius:50,background:'var(--green-lt)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'var(--green)',flexShrink:0}}>{i+1}</div>
                <div style={{flex:1,fontSize:13,fontWeight:600,color:'var(--text)'}}>{city}</div>
                <div style={{fontSize:13,color:'var(--muted)'}}>{count} complaint{count!==1?'s':''}</div>
                <div style={{padding:'2px 8px',borderRadius:20,background:'var(--green-pale)',color:'var(--green)',fontSize:11,fontWeight:700}}>{Math.round((count/total)*100)}%</div>
              </div>
            ))}
        </div>
      </div>
      <div className="a-card">
        <div className="a-card-hdr">
          <span className="a-card-title">🔮 7-Day Forecast</span>
          <button className="a-card-link" onClick={()=>addAuditEntry('Forecast Viewed','Admin viewed 7-day prediction')}>Refresh</button>
        </div>
        <div style={{fontSize:12.5,color:'var(--muted)',marginBottom:14}}>Growth rate: {growthRate>=0?'+':''}{(growthRate*100).toFixed(1)}%/week</div>
        <div style={{display:'flex',alignItems:'flex-end',gap:8,height:100,padding:'0 4px'}}>
          {forecast.map((f,i)=>{ const maxV=Math.max(...forecast.map(x=>x.v),1); const h=Math.max(f.v>0?(f.v/maxV)*80:4,4); return(
            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
              {f.v>0&&<div style={{fontSize:9,fontWeight:600,color:'#6366f1'}}>{f.v}</div>}
              <div style={{width:'100%',height:h,borderRadius:'4px 4px 0 0',background:'linear-gradient(180deg,#6366f1,#4f46e5)',opacity:.75+i*.03}}/>
              <div style={{fontSize:9,color:'var(--muted)'}}>{f.l}</div>
            </div>
          );})}
        </div>
      </div>
    </>
  );
}

/* ─── Workload ────────────────────────────────────────────── */
function WorkloadView() {
  const [agents,  setAgents]  = useState([]);
  const [wl,      setWl]      = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const r    = await axios.get(`${API}/AgentUsers`);
        const all  = toArr(r.data, 'agents', 'data', 'users', 'result');
        const w    = {};
        await Promise.all(
          all.map(async ag => {
            try {
              const res = await axios.get(`${API}/allcomplaints/${ag._id}`);
              const d   = toArr(res.data, 'complaints', 'data', 'result');
              w[ag._id] = {
                total:    d.length,
                pending:  d.filter(c=>c.status==='Pending').length,
                progress: d.filter(c=>c.status==='In Progress').length,
                resolved: d.filter(c=>c.status==='Resolved'||c.status==='completed').length,
              };
            } catch {
              w[ag._id] = { total:0, pending:0, progress:0, resolved:0 };
            }
          })
        );
        setAgents(all);
        setWl(w);
      } catch (err) {
        console.error('WorkloadView error:', err);
      }
      setLoading(false);
    };
    load();
  }, []);

  const maxL = Math.max(...Object.values(wl).map(w=>w.total), 1);

  return (
    <>
      <div className="a-pg-title">Agent Workload 📊</div>
      <div className="a-pg-sub">Current ticket load per agent — check before assigning.</div>
      {loading ? (
        <div className="a-wl-grid">{[1,2,3,4].map(i=><div key={i} className="a-skel" style={{height:148}}/>)}</div>
      ) : agents.length===0 ? (
        <div className="a-empty"><div className="a-empty-ico">👥</div><div className="a-empty-title">No agents registered yet</div></div>
      ) : (
        <div className="a-wl-grid">
          {agents.map(ag=>{
            const w   = wl[ag._id]||{total:0,pending:0,progress:0,resolved:0};
            const pct = maxL>0?Math.round((w.total/maxL)*100):0;
            const col = pct>75?'#B91C1C':pct>40?'#92400E':'#2D6A4F';
            const bg  = pct>75?'#FEF2F2':pct>40?'#FEF3C7':'#D8F3DC';
            return (
              <div key={ag._id} className="a-wl-card" style={{borderColor:`${col}28`}}>
                <div className="a-wl-top">
                  <div className="a-wl-agent">
                    <div className="a-wl-av">{ag.name?.[0]?.toUpperCase()}</div>
                    <div>
                      <div className="a-wl-name">{ag.name}</div>
                      <div className="a-wl-email">{ag.email}</div>
                    </div>
                  </div>
                  <span className="a-wl-badge" style={{background:bg,color:col,border:`1px solid ${col}28`}}>{w.total} tickets</span>
                </div>
                <div className="a-wl-track"><div className="a-wl-fill" style={{width:`${pct}%`,background:`linear-gradient(90deg,${col},${col}aa)`}}/></div>
                <div className="a-wl-meta">
                  <span>⏳ {w.pending} pending</span>
                  <span>🔄 {w.progress} active</span>
                  <span>✅ {w.resolved} done</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ─── Category Manager ────────────────────────────────────── */
const DEFAULT_CATS = [
  {id:1,name:'Water Supply',sla:48,icon:'💧'},
  {id:2,name:'Roads & Potholes',sla:72,icon:'🛣️'},
  {id:3,name:'Electricity',sla:24,icon:'⚡'},
  {id:4,name:'Sanitation',sla:48,icon:'🗑️'},
  {id:5,name:'Public Safety',sla:12,icon:'🚨'},
  {id:6,name:'Billing',sla:72,icon:'💳'},
];

function CategoryManager() {
  const [cats,      setCats]      = useState(()=>{ try{ return JSON.parse(localStorage.getItem('resolvenow_cats')||'null')||DEFAULT_CATS; }catch{ return DEFAULT_CATS; } });
  const [showModal, setShowModal] = useState(false);
  const [editCat,   setEditCat]   = useState(null);
  const [form,      setForm]      = useState({name:'',sla:48,icon:'📋'});

  const save      = ()=>{ localStorage.setItem('resolvenow_cats',JSON.stringify(cats)); showToast('Categories saved','success'); addAuditEntry('Categories Updated','Admin saved category changes'); };
  const openAdd   = ()=>{ setForm({name:'',sla:48,icon:'📋'}); setEditCat(null); setShowModal(true); };
  const openEdit  = cat=>{ setForm({name:cat.name,sla:cat.sla,icon:cat.icon}); setEditCat(cat); setShowModal(true); };
  const deleteCat = id=>{ setCats(p=>p.filter(c=>c.id!==id)); addAuditEntry('Category Deleted',`ID ${id}`); };
  const submit    = ()=>{
    if(!form.name.trim()){ showToast('Category name is required','error'); return; }
    if(editCat){ setCats(p=>p.map(c=>c.id===editCat.id?{...c,...form}:c)); addAuditEntry('Category Edited',form.name); }
    else{ setCats(p=>[...p,{id:Date.now(),...form}]); addAuditEntry('Category Added',form.name); }
    setShowModal(false);
  };

  return (
    <>
      <div className="a-pg-title">Category Management 🏷</div>
      <div className="a-pg-sub">Create and manage complaint categories. SLA is the default deadline in hours.</div>
      <div style={{display:'flex',gap:10,marginBottom:18}}>
        <button onClick={openAdd} style={{padding:'9px 18px',borderRadius:10,border:'none',background:'linear-gradient(135deg,#2D6A4F,#40916C)',color:'#fff',fontFamily:'var(--font)',fontSize:13,fontWeight:700,cursor:'pointer',boxShadow:'0 3px 10px rgba(45,106,79,.28)'}}>+ Add Category</button>
        <button onClick={save} style={{padding:'9px 18px',borderRadius:10,border:'1.5px solid var(--border)',background:'var(--white)',color:'var(--text)',fontFamily:'var(--font)',fontSize:13,fontWeight:700,cursor:'pointer'}}>💾 Save Changes</button>
      </div>
      <div className="cat-grid">
        {cats.map(cat=>(
          <div key={cat.id} className="cat-card">
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontSize:22}}>{cat.icon}</span>
              <div><div className="cat-name">{cat.name}</div><div className="cat-sla">SLA: {cat.sla}h deadline</div></div>
            </div>
            <div className="cat-actions">
              <button className="cat-btn edit" onClick={()=>openEdit(cat)}>✏</button>
              <button className="cat-btn del" onClick={()=>deleteCat(cat.id)}>🗑</button>
            </div>
          </div>
        ))}
      </div>
      {showModal&&(
        <div className="a-modal-ov" onClick={e=>e.target===e.currentTarget&&setShowModal(false)}>
          <div className="a-modal">
            <div className="a-modal-title">{editCat?'Edit Category':'New Category'}</div>
            <div className="a-modal-sub">Set the name, icon, and default SLA deadline.</div>
            {[{label:'Category Name',key:'name',type:'text',ph:'e.g. Water Supply'},{label:'Icon (emoji)',key:'icon',type:'text',ph:'e.g. 💧'},{label:'SLA (hours)',key:'sla',type:'number',ph:'e.g. 48'}].map(f=>(
              <div className="a-form-field" key={f.key}>
                <label className="a-form-label">{f.label}</label>
                <input className="a-form-input" type={f.type} placeholder={f.ph} value={form[f.key]} onChange={e=>setForm(p=>({...p,[f.key]:f.type==='number'?parseInt(e.target.value)||0:e.target.value}))}/>
              </div>
            ))}
            <div className="a-modal-footer">
              <button className="a-modal-btn cancel" onClick={()=>setShowModal(false)}>Cancel</button>
              <button className="a-modal-btn submit" onClick={submit}>{editCat?'Save Changes':'Add Category'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ─── Audit Log ───────────────────────────────────────────── */
function AuditLogView() {
  const [log,    setLog]    = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(()=>{ setLog(getAuditLog()); },[]);

  const filtered = log.filter(e=>!filter||e.action.toLowerCase().includes(filter.toLowerCase())||e.detail.toLowerCase().includes(filter.toLowerCase()));

  const clearLog  = ()=>{ if(!window.confirm('Clear entire audit log?')) return; localStorage.removeItem(AUDIT_KEY); setLog([]); showToast('Audit log cleared','success'); };
  const exportLog = ()=>{ const csv=['Action,Detail,Timestamp',...log.map(e=>`"${e.action}","${e.detail}","${new Date(e.at).toLocaleString('en-IN')}"`)].join('\n'); const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download=`audit-log-${Date.now()}.csv`; a.click(); };
  const actionIcon= a=>a.includes('Assign')?'📋':a.includes('Delete')?'🗑':a.includes('Status')?'🔄':a.includes('AI')||a.includes('Summary')?'🤖':a.includes('Category')?'🏷':a.includes('Forecast')?'🔮':'📝';

  return (
    <>
      <div className="a-pg-title">Admin Audit Log 🛡</div>
      <div className="a-pg-sub">Complete record of every admin action.</div>
      <div style={{display:'flex',gap:10,marginBottom:16,flexWrap:'wrap'}}>
        <input style={{flex:1,minWidth:200,padding:'9px 13px',borderRadius:10,border:'1.5px solid var(--border)',background:'var(--bg2)',fontFamily:'var(--font)',fontSize:13,color:'var(--text)',outline:'none'}} placeholder="Filter by action or detail…" value={filter} onChange={e=>setFilter(e.target.value)}/>
        <button onClick={exportLog} style={{padding:'9px 16px',borderRadius:10,border:'1.5px solid var(--border)',background:'var(--white)',color:'var(--green)',fontFamily:'var(--font)',fontSize:13,fontWeight:600,cursor:'pointer'}}>📤 Export CSV</button>
        <button onClick={clearLog} style={{padding:'9px 16px',borderRadius:10,border:'1.5px solid rgba(220,38,38,.2)',background:'#fef2f2',color:'#dc2626',fontFamily:'var(--font)',fontSize:13,fontWeight:600,cursor:'pointer'}}>🗑 Clear Log</button>
        <span style={{display:'flex',alignItems:'center',fontSize:12.5,color:'var(--muted)'}}>{filtered.length} entr{filtered.length!==1?'ies':'y'}</span>
      </div>
      <div className="a-card" style={{padding:0}}>
        {filtered.length===0?(
          <div className="a-empty"><div className="a-empty-ico">🛡</div><div className="a-empty-title">No audit entries yet</div><div className="a-empty-sub">Admin actions will appear here automatically.</div></div>
        ):filtered.map(entry=>(
          <div key={entry.id} className="audit-item">
            <div className="audit-ico">{actionIcon(entry.action)}</div>
            <div style={{flex:1}}><div className="audit-action">{entry.action}</div><div className="audit-detail">{entry.detail}</div></div>
            <div className="audit-time">{new Date(entry.at).toLocaleString('en-IN',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ─── Nav Config ──────────────────────────────────────────── */
const NAV_TABS = [
  {id:'dashboard', label:'Dashboard', ico:'▦'},
  {id:'complaints',label:'Complaints',ico:'📋',badge:true},
  {id:'assigned',  label:'Assigned',  ico:'✅'},
  {id:'agents',    label:'Agents',    ico:'👥'},
  {id:'users',     label:'Users',     ico:'👤'},
];

/* ─── AdminHome ───────────────────────────────────────────── */
export default function AdminHome() {
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const profRef  = useRef(null);

  const [active,     setActive]     = useState('dashboard');
  const [user,       setUser]       = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen,  setNotifOpen]  = useState(false);
  const [profOpen,   setProfOpen]   = useState(false);
  const [notifs,     setNotifs]     = useState([]);

  useEffect(()=>{
    const h=e=>{
      if(notifRef.current&&!notifRef.current.contains(e.target)) setNotifOpen(false);
      if(profRef.current&&!profRef.current.contains(e.target))   setProfOpen(false);
    };
    document.addEventListener('mousedown',h);
    return ()=>document.removeEventListener('mousedown',h);
  },[]);

  useEffect(()=>{
    const s=localStorage.getItem('user');
    if(!s){ navigate('/Login'); return; }
    const u=JSON.parse(s);
    if(u.userType!=='Admin'){ navigate('/Login'); return; }
    setUser(u);
  },[navigate]);

  useEffect(()=>{
    const fetchNotifs=async()=>{
      try{
        const r       = await axios.get(`${API}/status`);
        const notifArr= toArr(r.data,'complaints','data','result');
        setNotifs(notifArr
          .sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))
          .slice(0,8)
          .map(c=>({id:c._id,msg:`${c.name} filed from ${c.city}`,time:c.createdAt?new Date(c.createdAt).toLocaleDateString('en-IN'):'',read:false}))
        );
      }catch{}
    };
    fetchNotifs();
    const iv=setInterval(fetchNotifs,30000);
    return ()=>clearInterval(iv);
  },[]);

  const go=useCallback((tab)=>{
    setActive(tab); setMobileOpen(false);
    if(tab!=='dashboard') addAuditEntry(`Navigated to ${tab}`,`Admin opened ${tab} section`);
  },[]);

  const unread   = notifs.filter(n=>!n.read).length;
  const markRead = ()=>setNotifs(p=>p.map(n=>({...n,read:true})));
  const logout   = ()=>{ addAuditEntry('Logout','Admin signed out'); localStorage.removeItem('user'); navigate('/'); };

  if(!user) return null;

  return (
    <>
      <style>{CSS}</style>
      <Toasts/>

      <nav className="an">
        <div className="an-brand" onClick={()=>go('dashboard')}>
          <div className="an-mark">🎯</div>
          <span className="an-name">ResolveNow</span>
          <span className="an-badge-pill">ADMIN</span>
        </div>
        <div className="an-nav-links">
          {NAV_TABS.map(t=>(
            <button key={t.id} className={`an-tab${active===t.id?' active':''}`} onClick={()=>go(t.id)}>
              {t.ico} {t.label}
              {t.badge&&unread>0&&<span className="an-tab-badge">{unread}</span>}
            </button>
          ))}
        </div>
        <div className="an-right">
          <div className="an-search-wrap">
            <span className="an-search-ico">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input className="an-search" placeholder="Search…" onChange={e=>{if(e.target.value.trim())go('complaints');}}/>
          </div>
          <div className="an-notif-wrap" ref={notifRef}>
            <div className="an-icon-btn" onClick={()=>{setNotifOpen(o=>!o);setProfOpen(false);}}>
              🔔{unread>0&&<span className="an-notif-pip"/>}
            </div>
            {notifOpen&&(
              <div className="an-drop">
                <div className="an-drop-hdr">
                  <span className="an-drop-title">🔔 Notifications {unread>0&&`(${unread})`}</span>
                  <button className="an-drop-mark" onClick={markRead}>Mark all read</button>
                </div>
                {notifs.length===0?<div className="an-notif-empty">🎉 All caught up!</div>:
                  notifs.slice(0,6).map(n=>(
                    <div key={n.id} className={`an-notif-item${!n.read?' unread':''}`}
                      onClick={()=>{setNotifs(p=>p.map(x=>x.id===n.id?{...x,read:true}:x));go('complaints');setNotifOpen(false);}}>
                      <div className="an-notif-ico">📋</div>
                      <div style={{flex:1}}><div className="an-notif-msg">{n.msg}</div><div className="an-notif-time">{n.time}</div></div>
                      {!n.read&&<div className="an-notif-dot"/>}
                    </div>
                  ))
                }
                <div className="an-drop-footer"><button onClick={()=>{go('complaints');setNotifOpen(false);}}>View all complaints →</button></div>
              </div>
            )}
          </div>
          <div className="an-profile-wrap" ref={profRef}>
            <div className="an-profile-btn" onClick={()=>{setProfOpen(o=>!o);setNotifOpen(false);}}>
              <div className="an-profile-av">{user.name?.charAt(0).toUpperCase()}</div>
              <span className="an-profile-name">{user.name?.split(' ')[0]}</span>
              <span className={`an-caret${profOpen?' open':''}`}>▾</span>
            </div>
            {profOpen&&(
              <div className="an-profile-drop">
                <div className="an-drop-user">
                  <div className="an-drop-uav">{user.name?.charAt(0).toUpperCase()}</div>
                  <div><div className="an-drop-uname">{user.name}</div><div className="an-drop-urole">Admin</div></div>
                </div>
                <button className="an-profile-item" onClick={()=>{go('analytics');setProfOpen(false);}}>📈 Analytics</button>
                <button className="an-profile-item" onClick={()=>{go('categories');setProfOpen(false);}}>🏷 Categories</button>
                <button className="an-profile-item" onClick={()=>{go('audit');setProfOpen(false);}}>🛡 Audit Log</button>
                <button className="an-profile-item" onClick={()=>{go('workload');setProfOpen(false);}}>📊 Workload</button>
                <div className="an-profile-sep"/>
                <button className="an-profile-item red" onClick={logout}>🚪 Sign Out</button>
              </div>
            )}
          </div>
          <button className="an-cta" onClick={()=>go('complaints')}>📋 Assign</button>
          <button className="an-ham" onClick={()=>setMobileOpen(o=>!o)}>☰</button>
        </div>
      </nav>

      {mobileOpen&&(
        <div className="an-mobile-nav" onClick={()=>setMobileOpen(false)}>
          {NAV_TABS.map(t=>(
            <button key={t.id} className={`an-mob-item${active===t.id?' active':''}`} onClick={()=>go(t.id)}>
              {t.ico} {t.label}
              {t.badge&&unread>0&&<span style={{background:'var(--red)',color:'#fff',borderRadius:50,fontSize:9,fontWeight:800,padding:'1px 6px',marginLeft:4}}>{unread}</span>}
            </button>
          ))}
          <button className="an-mob-item" onClick={()=>go('workload')}>📊 Workload</button>
          <div style={{height:1,background:'var(--border)',margin:'4px 0'}}/>
          <button className="an-mob-item" style={{color:'var(--red)'}} onClick={logout}>🚪 Sign Out</button>
        </div>
      )}

      <div className="a-shell">
        <div className="a-content">
          {active==='dashboard'  && <Dashboard onNav={go} unreadCount={unread}/>}
          {active==='complaints' && (<>
            <div className="a-pg-title">📋 Complaint Management</div>
            <div className="a-pg-sub">Review, assign and track all unassigned complaints.</div>
            <div style={{background:'#eff6ff',border:'1.5px solid rgba(37,99,235,.2)',borderRadius:12,padding:'10px 14px',marginBottom:16,fontSize:13,color:'#1e40af',display:'flex',alignItems:'center',gap:8}}>
              ℹ️ <strong>Email notifications</strong> are triggered automatically by the backend on assignment.
            </div>
            <AccordionAdmin showToast={showToast} mode="unassigned" onAudit={addAuditEntry}/>
          </>)}
          {active==='assigned' && (<>
            <div className="a-pg-title">✅ Assigned Complaints</div>
            <div className="a-pg-sub">All complaints assigned to agents — track progress and reassign.</div>
            <AccordionAdmin showToast={showToast} mode="assigned" onAudit={addAuditEntry}/>
          </>)}
          {active==='analytics'  && <AnalyticsPage/>}
          {active==='workload'   && <WorkloadView/>}
          {active==='agents'     && (<>
            <div className="a-pg-title">👥 Agent Management</div>
            <div className="a-pg-sub">Add, edit, toggle active/inactive status, and view scorecards.</div>
            <AgentInfo showToast={showToast}/>
          </>)}
          {active==='users'      && (<>
            <div className="a-pg-title">👤 User Management</div>
            <div className="a-pg-sub">View and manage all registered citizens.</div>
            <UserInfo showToast={showToast}/>
          </>)}
          {active==='categories' && <CategoryManager/>}
          {active==='audit'      && <AuditLogView/>}
        </div>
      </div>

      {active==='dashboard'&&(
        <button className="a-float-btn" onClick={()=>go('complaints')}>📋 Assign Complaints</button>
      )}
      <Footer/>
    </>
  );
}