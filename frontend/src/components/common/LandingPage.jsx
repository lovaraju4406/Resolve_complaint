import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./FooterC";

const LandingPage = () => {
  const navigate = useNavigate();
  const threeCanvasRef    = useRef(null);
  const particleCanvasRef = useRef(null);

  /* ── Scroll progress + nav shrink ── */
  useEffect(() => {
    const onScroll = () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      const progress   = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      const bar        = document.getElementById("scrollProgress");
      const nav        = document.getElementById("rn-nav");
      if (bar) bar.style.width = progress + "%";
      if (nav) nav.classList.toggle("nav-scrolled", scrollTop > 40);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Cursor glow ── */
  useEffect(() => {
    const glow = document.getElementById("cursorGlow");
    if (!glow) return;
    const onMove = (e) => {
      glow.style.left = e.clientX + "px";
      glow.style.top  = e.clientY + "px";
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ── Intersection observer — fade-up ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-up").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ── Count-up animation ── */
  useEffect(() => {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || "";
        let current  = 0;
        const inc    = target / 60;
        const timer  = setInterval(() => {
          current += inc;
          if (current >= target) { current = target; clearInterval(timer); }
          el.textContent = target >= 1000
            ? Math.floor(current / 1000) + "K" + suffix
            : Math.floor(current) + suffix;
        }, 25);
        countObserver.unobserve(el);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll(".count-up").forEach(el => countObserver.observe(el));
    return () => countObserver.disconnect();
  }, []);

  /* ── Bar fill animation ── */
  useEffect(() => {
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        bar.style.width = bar.dataset.width + "%";
        barObserver.unobserve(bar);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll(".fc-bar-fill").forEach(b => barObserver.observe(b));
    return () => barObserver.disconnect();
  }, []);

  /* ── Tilt effect on cards ── */
  useEffect(() => {
    const cards = document.querySelectorAll(".float-card, .step-card, .feat-card, .test-card");
    const handlers = [];
    cards.forEach(card => {
      const onMove = (e) => {
        const rect    = card.getBoundingClientRect();
        const x       = e.clientX - rect.left;
        const y       = e.clientY - rect.top;
        const rotateX = ((y - rect.height / 2) / rect.height) * -3;
        const rotateY = ((x - rect.width  / 2) / rect.width)  *  3;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      };
      const onLeave = () => { card.style.transform = ""; };
      card.addEventListener("mousemove",  onMove);
      card.addEventListener("mouseleave", onLeave);
      handlers.push({ card, onMove, onLeave });
    });
    return () => handlers.forEach(({ card, onMove, onLeave }) => {
      card.removeEventListener("mousemove",  onMove);
      card.removeEventListener("mouseleave", onLeave);
    });
  }, []);

  /* ── Marquee ── */
  useEffect(() => {
    const track = document.getElementById("marqueeTrack");
    if (!track) return;
    const items = [
      "Complaint Tracking","Real-Time Updates","Agent Assignment",
      "PDF Reports","Smart Routing","In-App Chat",
      "Admin Dashboard","Resolution Analytics","Priority Queues",
      "User Satisfaction","Secure & Private","24/7 Support",
    ];
    const all = [...items, ...items];
    all.forEach(item => {
      const el = document.createElement("div");
      el.className = "marquee-item";
      el.innerHTML = `<span class="dot"></span>${item}`;
      track.appendChild(el);
    });
  }, []);

  /* ── Mobile menu ── */
  const toggleMobile = () => {
    document.getElementById("mobileToggle")?.classList.toggle("active");
    document.getElementById("mobileMenu")?.classList.toggle("active");
  };
  const closeMobile = () => {
    document.getElementById("mobileToggle")?.classList.remove("active");
    document.getElementById("mobileMenu")?.classList.remove("active");
  };

  /* ── THREE.JS ── */
  useEffect(() => {
    let renderer, animId;
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.onload = () => {
      const THREE    = window.THREE;
      const canvas   = threeCanvasRef.current;
      if (!canvas) return;

      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      const scene  = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
      camera.position.z = 18;

      scene.add(new THREE.AmbientLight(0xfff5ee, 0.6));
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(5, 10, 7);
      scene.add(dirLight);
      const pointLight = new THREE.PointLight(0xe05a2b, 1.5, 50);
      pointLight.position.set(-6, 4, 8);
      scene.add(pointLight);

      const shapeMaterials = [
        new THREE.MeshPhysicalMaterial({ color:0xe05a2b, transparent:true, opacity:0.12, roughness:0.3, metalness:0.1 }),
        new THREE.MeshPhysicalMaterial({ color:0x3c78ff, transparent:true, opacity:0.08, roughness:0.4, metalness:0.05 }),
        new THREE.MeshPhysicalMaterial({ color:0x1eb464, transparent:true, opacity:0.08, roughness:0.4, metalness:0.05 }),
        new THREE.MeshPhysicalMaterial({ color:0xf5a623, transparent:true, opacity:0.07, roughness:0.5, metalness:0 }),
      ];
      const geometries = [
        new THREE.IcosahedronGeometry(1, 0),
        new THREE.OctahedronGeometry(0.9, 0),
        new THREE.TorusGeometry(0.7, 0.25, 16, 32),
        new THREE.TorusKnotGeometry(0.6, 0.2, 64, 16),
        new THREE.DodecahedronGeometry(0.8, 0),
        new THREE.TetrahedronGeometry(0.9, 0),
        new THREE.ConeGeometry(0.6, 1.2, 6),
        new THREE.SphereGeometry(0.5, 16, 16),
      ];

      const shapes = [];
      for (let i = 0; i < 14; i++) {
        const geo  = geometries[i % geometries.length];
        const mat  = shapeMaterials[i % shapeMaterials.length].clone();
        const mesh = new THREE.Mesh(geo, mat);
        const angle  = (i / 14) * Math.PI * 2;
        const radius = 5 + Math.random() * 9;
        mesh.position.set(
          Math.cos(angle) * radius,
          (Math.random() - 0.5) * 12,
          (Math.random() - 0.5) * 8 - 4
        );
        const s = 0.6 + Math.random() * 1.2;
        mesh.scale.set(s, s, s);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
        scene.add(mesh);
        shapes.push({
          mesh,
          rotSpeed: { x:(Math.random()-0.5)*0.008, y:(Math.random()-0.5)*0.01, z:(Math.random()-0.5)*0.005 },
          floatSpeed: 0.3 + Math.random() * 0.6,
          floatAmp:   0.3 + Math.random() * 0.8,
          baseY: mesh.position.y,
          phase: Math.random() * Math.PI * 2,
        });
      }

      const gridSphere = new THREE.Mesh(
        new THREE.SphereGeometry(12, 24, 24),
        new THREE.MeshBasicMaterial({ color:0xe05a2b, wireframe:true, transparent:true, opacity:0.03 })
      );
      scene.add(gridSphere);

      let mouseX = 0, mouseY = 0;
      const onMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener("mousemove", onMouseMove);

      const onResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener("resize", onResize);

      let time = 0;
      const animate = () => {
        animId = requestAnimationFrame(animate);
        time  += 0.016;
        shapes.forEach(s => {
          s.mesh.rotation.x += s.rotSpeed.x;
          s.mesh.rotation.y += s.rotSpeed.y;
          s.mesh.rotation.z += s.rotSpeed.z;
          s.mesh.position.y  = s.baseY + Math.sin(time * s.floatSpeed + s.phase) * s.floatAmp;
        });
        gridSphere.rotation.y += 0.001;
        gridSphere.rotation.x += 0.0005;
        camera.position.x += (mouseX * 2  - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 1.5 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize",    onResize);
      };
    };
    document.head.appendChild(script);
    return () => {
      cancelAnimationFrame(animId);
      if (renderer) renderer.dispose();
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  /* ── PARTICLE CANVAS ── */
  useEffect(() => {
    const canvas = particleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w, h, animId;
    const particles = [];
    const COUNT = 60;

    const resize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x:  Math.random() * window.innerWidth,
        y:  Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r:  1.5 + Math.random() * 2,
        alpha: 0.15 + Math.random() * 0.2,
      });
    }

    const draw = () => {
      animId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224,90,43,${p.alpha})`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx   = p.x - particles[j].x;
          const dy   = p.y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(224,90,43,${0.06 * (1 - dist / 140)})`;
            ctx.lineWidth   = 0.8;
            ctx.stroke();
          }
        }
      });
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ─────── DATA ─────── */
  const features = [
    { icon:"📡", t:"Real-time tracking",    d:"Live status updates on every complaint. Know exactly where things stand at all times." },
    { icon:"💬", t:"In-app chat",            d:"Message your assigned agent directly. No emails, no phone queues." },
    { icon:"🔔", t:"Smart notifications",   d:"Get notified on status changes, replies, and resolution — instantly." },
    { icon:"📊", t:"Admin dashboard",        d:"Full oversight of all complaints, agent performance, and resolution metrics." },
    { icon:"👤", t:"Agent profiles",         d:"Agents manage their workload, update statuses, and close tickets efficiently." },
    { icon:"📄", t:"PDF reports",            d:"Download detailed complaint reports for records or escalations anytime." },
  ];

  const testimonials = [
    { text:"ResolveNow saved me hours of frustration. My complaint was resolved within 6 hours — incredible.", name:"Sarah Mitchell", role:"Customer",        initials:"SM" },
    { text:"The admin dashboard gives us complete visibility into every ticket. Our resolution rate has never been higher.", name:"James Chen",    role:"Support Manager", initials:"JC" },
    { text:"I love the real-time tracking. I always know exactly where my complaint stands. No more guessing.", name:"Priya Sharma",  role:"User",            initials:"PS" },
  ];

  const steps = [
    { n:"01", t:"Submit your complaint",  d:"Fill out a quick form describing your issue. Attach files if needed. Done in under 2 minutes." },
    { n:"02", t:"Get assigned an agent",  d:"Our system routes your complaint to the best available agent based on category and priority." },
    { n:"03", t:"Track & get resolved",   d:"Receive real-time updates at every stage. Chat with your agent and close the ticket once satisfied." },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --bg: #F9F7F4;
          --bg2: #FFFFFF;
          --bg3: #F1EDE8;
          --text: #1A1A2E;
          --text2: #4A4A68;
          --muted: #8A8AA0;
          --accent: #E05A2B;
          --accent2: #F07B4F;
          --accent-soft: rgba(224,90,43,0.08);
          --accent-border: rgba(224,90,43,0.2);
          --border: rgba(26,26,46,0.08);
          --card: #FFFFFF;
          --card-hover: #FFFCFA;
          --shadow: 0 4px 32px rgba(26,26,46,0.06);
          --shadow-lg: 0 12px 48px rgba(26,26,46,0.1);
        }

        html { scroll-behavior: smooth; }
        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--bg);
          color: var(--text);
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        /* CANVAS */
        #three-canvas {
          position: fixed; top: 0; left: 0;
          width: 100%; height: 100%;
          z-index: 0; pointer-events: none;
        }

        /* CURSOR */
        .cursor-glow {
          position: fixed;
          width: 320px; height: 320px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(224,90,43,0.07) 0%, transparent 70%);
          pointer-events: none; z-index: 1;
          transform: translate(-50%, -50%);
          transition: transform 0.1s ease-out;
        }

        /* NAV */
        .rn-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 1rem 5%;
          background: rgba(249,247,244,0.8);
          backdrop-filter: blur(20px) saturate(1.4);
          -webkit-backdrop-filter: blur(20px) saturate(1.4);
          border-bottom: 1px solid var(--border);
          transition: all 0.3s;
        }
        .nav-scrolled { padding: 0.7rem 5%; box-shadow: 0 2px 20px rgba(26,26,46,0.05); }
        .rn-logo {
          font-family: 'Sora', sans-serif; font-weight: 800; font-size: 1.35rem;
          color: var(--text); text-decoration: none;
          display: flex; align-items: center; gap: 10px;
        }
        .rn-logo-dot {
          width: 10px; height: 10px; border-radius: 50%;
          background: var(--accent); animation: pulse-dot 2s infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { box-shadow: 0 0 0 0 rgba(224,90,43,0.4); }
          50%       { box-shadow: 0 0 0 6px rgba(224,90,43,0); }
        }
        .rn-nav-links { display: flex; gap: 2rem; list-style: none; }
        .rn-nav-links a {
          color: var(--muted); text-decoration: none;
          font-size: 0.88rem; font-weight: 500;
          transition: color 0.25s; position: relative;
        }
        .rn-nav-links a::after {
          content: ''; position: absolute; bottom: -4px; left: 0;
          width: 0; height: 2px; background: var(--accent);
          border-radius: 2px; transition: width 0.3s;
        }
        .rn-nav-links a:hover { color: var(--text); }
        .rn-nav-links a:hover::after { width: 100%; }
        .rn-nav-btns { display: flex; gap: 0.6rem; align-items: center; }

        .btn-ghost {
          padding: 0.5rem 1.2rem; border-radius: 10px;
          border: 1px solid var(--border);
          background: transparent; color: var(--text);
          font-family: 'DM Sans', sans-serif; font-size: 0.88rem;
          cursor: pointer; transition: all 0.25s; font-weight: 500;
        }
        .btn-ghost:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-soft); }
        .btn-solid {
          padding: 0.55rem 1.4rem; border-radius: 10px;
          border: none; background: var(--accent);
          color: #fff; font-family: 'DM Sans', sans-serif;
          font-size: 0.88rem; font-weight: 500; cursor: pointer; transition: all 0.25s;
          box-shadow: 0 2px 12px rgba(224,90,43,0.25);
        }
        .btn-solid:hover { background: var(--accent2); transform: translateY(-1px); box-shadow: 0 4px 20px rgba(224,90,43,0.3); }

        /* HERO */
        .rn-hero {
          min-height: 100vh; display: flex; align-items: center;
          padding: 8rem 5% 5rem; position: relative;
        }
        .hero-content { position: relative; z-index: 2; max-width: 620px; }
        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--accent-soft); border: 1px solid var(--accent-border);
          border-radius: 100px; padding: 0.4rem 1.1rem;
          font-size: 0.75rem; font-weight: 600; color: var(--accent);
          margin-bottom: 1.8rem; letter-spacing: 0.08em; text-transform: uppercase;
        }
        .hero-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse-dot 2s infinite; }
        .hero-h1 {
          font-family: 'Sora', sans-serif;
          font-size: clamp(2.6rem, 5vw, 4rem);
          font-weight: 800; line-height: 1.08; margin-bottom: 1.4rem;
          color: var(--text); letter-spacing: -0.02em;
        }
        .hero-h1 span {
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hero-p { font-size: 1.05rem; color: var(--text2); line-height: 1.75; margin-bottom: 2.4rem; max-width: 480px; }
        .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-primary {
          padding: 0.85rem 2rem; border-radius: 12px;
          background: var(--accent); border: none; color: #fff;
          font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 500;
          cursor: pointer; transition: all 0.3s;
          display: flex; align-items: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(224,90,43,0.3);
        }
        .btn-primary:hover { background: var(--accent2); transform: translateY(-2px); box-shadow: 0 8px 30px rgba(224,90,43,0.35); }
        .btn-primary .arrow { transition: transform 0.3s; }
        .btn-primary:hover .arrow { transform: translateX(4px); }
        .btn-outline {
          padding: 0.85rem 2rem; border-radius: 12px;
          background: var(--bg2); border: 1px solid var(--border);
          color: var(--text); font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem; cursor: pointer; transition: all 0.3s;
        }
        .btn-outline:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }
        .hero-stats {
          display: flex; gap: 2.5rem; margin-top: 3.5rem;
          padding-top: 2.5rem; border-top: 1px solid var(--border);
        }
        .stat-num { font-family: 'Sora', sans-serif; font-size: 1.8rem; font-weight: 700; color: var(--text); line-height: 1; }
        .stat-label { font-size: 0.8rem; color: var(--muted); margin-top: 5px; }

        /* FLOATING CARDS */
        .hero-float {
          position: absolute; right: 6%; top: 50%;
          transform: translateY(-50%);
          z-index: 2; display: flex; flex-direction: column; gap: 1rem;
        }
        .float-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 16px; padding: 1.1rem 1.3rem;
          box-shadow: var(--shadow); min-width: 250px;
          transition: all 0.35s; animation: float-in 0.8s ease backwards;
        }
        .float-card:nth-child(1) { animation-delay: 0.6s; }
        .float-card:nth-child(2) { animation-delay: 0.8s; }
        .float-card:nth-child(3) { animation-delay: 1.0s; }
        .float-card:hover { transform: translateX(-4px); box-shadow: var(--shadow-lg); }
        @keyframes float-in { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        .float-card-head { display: flex; align-items: center; gap: 10px; margin-bottom: 0.7rem; }
        .fc-icon { width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
        .fc-icon.orange { background: rgba(224,90,43,0.1); }
        .fc-icon.green  { background: rgba(30,180,100,0.1); }
        .fc-icon.blue   { background: rgba(60,120,255,0.1); }
        .fc-title { font-size: 0.85rem; font-weight: 600; color: var(--text); }
        .fc-sub   { font-size: 0.72rem; color: var(--muted); }
        .fc-bar   { height: 5px; border-radius: 100px; background: rgba(26,26,46,0.06); overflow: hidden; }
        .fc-bar-fill { height: 100%; border-radius: 100px; width: 0; transition: width 1.2s ease; }
        .fc-bar-fill.orange { background: var(--accent); }
        .fc-bar-fill.green  { background: #1eb464; }
        .fc-bar-fill.blue   { background: #3c78ff; }
        .fc-value { font-size: 0.75rem; color: var(--muted); margin-top: 5px; text-align: right; }

        /* MARQUEE */
        .marquee-wrap {
          overflow: hidden; padding: 1.5rem 0;
          border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
          background: var(--bg2); position: relative; z-index: 2;
        }
        .marquee-track { display: flex; gap: 3rem; animation: marquee 30s linear infinite; width: max-content; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .marquee-item {
          font-family: 'Sora', sans-serif; font-size: 0.85rem; font-weight: 600;
          color: var(--muted); white-space: nowrap;
          display: flex; align-items: center; gap: 0.6rem; opacity: 0.6;
        }
        .marquee-item .dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }

        /* SECTIONS */
        section { padding: 6rem 5%; position: relative; z-index: 2; }
        .section-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.73rem; letter-spacing: 0.1em; text-transform: uppercase;
          color: var(--accent); font-weight: 600; margin-bottom: 0.8rem;
        }
        .section-tag::before { content: ''; width: 18px; height: 2px; background: var(--accent); border-radius: 2px; }
        .section-title { font-family: 'Sora', sans-serif; font-size: clamp(1.7rem, 3vw, 2.5rem); font-weight: 700; color: var(--text); line-height: 1.15; margin-bottom: 0.8rem; letter-spacing: -0.01em; }
        .section-sub { font-size: 1rem; color: var(--text2); line-height: 1.7; max-width: 520px; }

        /* HOW IT WORKS */
        .how-bg { background: var(--bg2); }
        .steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 3.5rem; }
        .step-card {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 18px; padding: 2rem 1.6rem;
          transition: all 0.35s; position: relative; overflow: hidden;
        }
        .step-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0;
          height: 3px; background: var(--accent);
          transform: scaleX(0); transform-origin: left; transition: transform 0.4s;
        }
        .step-card:hover::before { transform: scaleX(1); }
        .step-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: var(--accent-border); }
        .step-num { font-family: 'Sora', sans-serif; font-size: 3rem; font-weight: 800; color: rgba(224,90,43,0.1); line-height: 1; margin-bottom: 1rem; }
        .step-title { font-family: 'Sora', sans-serif; font-size: 1.05rem; font-weight: 600; color: var(--text); margin-bottom: 0.6rem; }
        .step-desc { font-size: 0.9rem; color: var(--text2); line-height: 1.65; }

        /* FEATURES */
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.3rem; margin-top: 3.5rem; }
        .feat-card {
          background: var(--card); border: 1px solid var(--border);
          border-radius: 18px; padding: 1.8rem 1.5rem; transition: all 0.35s; position: relative;
        }
        .feat-card:hover { border-color: var(--accent-border); transform: translateY(-4px); box-shadow: var(--shadow-lg); }
        .feat-card:hover .feat-icon { transform: scale(1.1) rotate(-4deg); }
        .feat-icon {
          width: 48px; height: 48px; border-radius: 14px;
          background: var(--accent-soft); border: 1px solid var(--accent-border);
          display: flex; align-items: center; justify-content: center;
          font-size: 1.3rem; margin-bottom: 1.2rem; transition: transform 0.3s;
        }
        .feat-title { font-family: 'Sora', sans-serif; font-size: 0.98rem; font-weight: 600; color: var(--text); margin-bottom: 0.5rem; }
        .feat-desc { font-size: 0.87rem; color: var(--text2); line-height: 1.65; }

        /* TESTIMONIALS */
        .test-section { background: var(--bg2); }
        .test-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.3rem; margin-top: 3.5rem; }
        .test-card {
          background: var(--bg); border: 1px solid var(--border);
          border-radius: 18px; padding: 1.8rem 1.5rem; transition: all 0.35s;
        }
        .test-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
        .test-stars { color: #F5A623; font-size: 0.85rem; letter-spacing: 2px; margin-bottom: 0.8rem; }
        .test-text { font-size: 0.92rem; color: var(--text2); line-height: 1.7; margin-bottom: 1.2rem; font-style: italic; }
        .test-author { display: flex; align-items: center; gap: 10px; }
        .test-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--accent-soft); border: 2px solid var(--accent-border);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Sora', sans-serif; font-weight: 700; font-size: 0.8rem; color: var(--accent);
        }
        .test-name { font-size: 0.85rem; font-weight: 600; color: var(--text); }
        .test-role { font-size: 0.75rem; color: var(--muted); }

        /* CTA */
        .cta-section { background: var(--bg); position: relative; z-index: 2; padding: 0 5% 6rem; }
        .cta-inner {
          background: linear-gradient(135deg, #1A1A2E 0%, #2D2D4E 100%);
          border-radius: 28px; padding: 4.5rem 3rem; text-align: center;
          position: relative; overflow: hidden;
        }
        .cta-inner::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 50% 60% at 20% 80%, rgba(224,90,43,0.15), transparent 60%),
            radial-gradient(ellipse 50% 60% at 80% 20%, rgba(60,120,255,0.1), transparent 60%);
        }
        .cta-dots {
          position: absolute; inset: 0;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 24px 24px;
        }
        .cta-title { font-family: 'Sora', sans-serif; font-size: clamp(1.8rem, 3vw, 2.5rem); font-weight: 800; color: #fff; margin-bottom: 1rem; position: relative; }
        .cta-sub { font-size: 1rem; color: rgba(255,255,255,0.6); margin-bottom: 2.2rem; position: relative; }
        .cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; position: relative; }
        .cta-btns .btn-primary { background: var(--accent); }
        .cta-btns .btn-outline { border-color: rgba(255,255,255,0.2); color: #fff; background: transparent; }
        .cta-btns .btn-outline:hover { border-color: rgba(255,255,255,0.5); background: rgba(255,255,255,0.05); }

        /* SCROLL PROGRESS */
        .scroll-progress {
          position: fixed; top: 0; left: 0; height: 3px;
          background: linear-gradient(90deg, var(--accent), var(--accent2));
          z-index: 200; width: 0; transition: width 0.1s linear;
        }

        /* MOBILE TOGGLE */
        .mobile-toggle {
          display: none; background: none; border: none;
          cursor: pointer; width: 28px; height: 20px;
          position: relative; z-index: 200;
        }
        .mobile-toggle span {
          display: block; width: 100%; height: 2px;
          background: var(--text); border-radius: 2px;
          transition: all 0.3s; position: absolute; left: 0;
        }
        .mobile-toggle span:nth-child(1) { top: 0; }
        .mobile-toggle span:nth-child(2) { top: 9px; }
        .mobile-toggle span:nth-child(3) { top: 18px; }
        .mobile-toggle.active span:nth-child(1) { top: 9px; transform: rotate(45deg); }
        .mobile-toggle.active span:nth-child(2) { opacity: 0; }
        .mobile-toggle.active span:nth-child(3) { top: 9px; transform: rotate(-45deg); }
        .mobile-menu {
          display: none; position: fixed; inset: 0; z-index: 150;
          background: rgba(249,247,244,0.98); backdrop-filter: blur(20px);
          flex-direction: column; align-items: center; justify-content: center; gap: 2rem;
        }
        .mobile-menu.active { display: flex; }
        .mobile-menu a { font-family: 'Sora', sans-serif; font-size: 1.4rem; font-weight: 600; color: var(--text); text-decoration: none; transition: color 0.2s; }
        .mobile-menu a:hover { color: var(--accent); }

        /* ANIMATIONS */
        .fade-up { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        .delay-4 { transition-delay: 0.4s; }
        .delay-5 { transition-delay: 0.5s; }
        .delay-6 { transition-delay: 0.6s; }
        .count-up { display: inline-block; }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .hero-float { display: none; }
          .steps-grid, .features-grid, .test-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .rn-nav-links { display: none; }
          .rn-nav-btns .btn-ghost, .rn-nav-btns .btn-solid { display: none; }
          .mobile-toggle { display: block; }
          .steps-grid, .features-grid, .test-grid { grid-template-columns: 1fr; }
          .hero-stats { gap: 1.5rem; }
          .cta-inner { padding: 3rem 1.5rem; }
          section { padding: 4rem 5%; }
        }
      `}</style>

      {/* Scroll Progress */}
      <div className="scroll-progress" id="scrollProgress" />

      {/* Cursor Glow */}
      <div className="cursor-glow" id="cursorGlow" />

      {/* 3D Canvas */}
      <canvas id="three-canvas" ref={threeCanvasRef} />

      {/* Particle Canvas */}
      <canvas id="particle-canvas" ref={particleCanvasRef}
        style={{ position:"fixed", top:0, left:0, width:"100%", height:"100%", zIndex:1, pointerEvents:"none" }} />

      {/* NAV */}
      <nav className="rn-nav" id="rn-nav">
        <a className="rn-logo" href="/">
          <span className="rn-logo-dot" />
          ResolveNow
        </a>
        <ul className="rn-nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#features">Features</a></li>
          <li><a href="#testimonials">Testimonials</a></li>
          <li><a href="#about">About</a></li>
        </ul>
        <div className="rn-nav-btns">
          <button className="btn-ghost" onClick={() => navigate("/Login")}>Sign in</button>
          <button className="btn-solid" onClick={() => navigate("/SignUp")}>Get started</button>
          <button className="mobile-toggle" id="mobileToggle" aria-label="Menu" onClick={toggleMobile}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className="mobile-menu" id="mobileMenu">
        <a href="#how"          onClick={closeMobile}>How it works</a>
        <a href="#features"     onClick={closeMobile}>Features</a>
        <a href="#testimonials" onClick={closeMobile}>Testimonials</a>
        <a href="#about"        onClick={closeMobile}>About</a>
        <button className="btn-primary" style={{ marginTop:"1rem" }} onClick={() => { closeMobile(); navigate("/SignUp"); }}>
          Get started
        </button>
      </div>

      {/* HERO */}
      <section className="rn-hero" id="hero">
        <div className="hero-content">
          <div className="hero-tag fade-up">
            <span className="hero-tag-dot" />
            Complaint Care Platform
          </div>
          <h1 className="hero-h1 fade-up delay-1">
            Your complaints.<br />
            <span>Resolved faster.</span>
          </h1>
          <p className="hero-p fade-up delay-2">
            ResolveNow connects you directly with support agents who care.
            Track every complaint, get real-time updates, and never feel unheard again.
          </p>
          <div className="hero-actions fade-up delay-3">
            <button className="btn-primary" onClick={() => navigate("/SignUp")}>
              Raise a complaint <span className="arrow">→</span>
            </button>
            <button className="btn-outline" onClick={() => navigate("/Login")}>
              Track status
            </button>
          </div>
          <div className="hero-stats fade-up delay-4">
            <div>
              <div className="stat-num">
                <span className="count-up" data-target="12000" data-suffix="+">0</span>
              </div>
              <div className="stat-label">Complaints resolved</div>
            </div>
            <div>
              <div className="stat-num">
                <span className="count-up" data-target="98" data-suffix="%">0</span>
              </div>
              <div className="stat-label">Resolution rate</div>
            </div>
            <div>
              <div className="stat-num">&lt;24h</div>
              <div className="stat-label">Avg. response time</div>
            </div>
          </div>
        </div>

        {/* Floating Cards */}
        <div className="hero-float">
          <div className="float-card">
            <div className="float-card-head">
              <div className="fc-icon orange">📋</div>
              <div>
                <div className="fc-title">Open Complaints</div>
                <div className="fc-sub">Last 30 days</div>
              </div>
            </div>
            <div className="fc-bar"><div className="fc-bar-fill orange" data-width="72" /></div>
            <div className="fc-value">72% resolved</div>
          </div>
          <div className="float-card">
            <div className="float-card-head">
              <div className="fc-icon green">✅</div>
              <div>
                <div className="fc-title">Agent Satisfaction</div>
                <div className="fc-sub">This month</div>
              </div>
            </div>
            <div className="fc-bar"><div className="fc-bar-fill green" data-width="91" /></div>
            <div className="fc-value">91% positive</div>
          </div>
          <div className="float-card">
            <div className="float-card-head">
              <div className="fc-icon blue">⚡</div>
              <div>
                <div className="fc-title">Response Speed</div>
                <div className="fc-sub">Avg. this week</div>
              </div>
            </div>
            <div className="fc-bar"><div className="fc-bar-fill blue" data-width="58" /></div>
            <div className="fc-value">~4.2 hours</div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="marquee-wrap">
        <div className="marquee-track" id="marqueeTrack" />
      </div>

      {/* HOW IT WORKS */}
      <section id="how" className="how-bg">
        <div className="fade-up">
          <span className="section-tag">How it works</span>
          <h2 className="section-title">Three steps to resolution</h2>
          <p className="section-sub">
            We've made the complaint process simple, transparent, and fast — from submission to closure.
          </p>
        </div>
        <div className="steps-grid">
          {steps.map((s, i) => (
            <div className={`step-card fade-up delay-${i + 1}`} key={i}>
              <div className="step-num">{s.n}</div>
              <div className="step-title">{s.t}</div>
              <div className="step-desc">{s.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <div className="fade-up">
          <span className="section-tag">Features</span>
          <h2 className="section-title">Everything you need</h2>
          <p className="section-sub">Powerful tools for users, agents, and admins — all in one platform.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className={`feat-card fade-up delay-${(i % 3) + 1}`} key={i}>
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-title">{f.t}</div>
              <div className="feat-desc">{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="test-section">
        <div className="fade-up">
          <span className="section-tag">Testimonials</span>
          <h2 className="section-title">Loved by thousands</h2>
          <p className="section-sub">Hear from users and agents who trust ResolveNow every day.</p>
        </div>
        <div className="test-grid">
          {testimonials.map((t, i) => (
            <div className={`test-card fade-up delay-${i + 1}`} key={i}>
              <div className="test-stars">★★★★★</div>
              <div className="test-text">"{t.text}"</div>
              <div className="test-author">
                <div className="test-avatar">{t.initials}</div>
                <div>
                  <div className="test-name">{t.name}</div>
                  <div className="test-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="cta-section">
        <div className="cta-inner fade-up">
          <div className="cta-dots" />
          <h2 className="cta-title">Ready to get your issue resolved?</h2>
          <p className="cta-sub">Join thousands who've already found their resolution.</p>
          <div className="cta-btns">
            <button className="btn-primary" onClick={() => navigate("/SignUp")}>
              Create free account <span className="arrow">→</span>
            </button>
            <button className="btn-outline" onClick={() => navigate("/Login")}>
              Sign in
            </button>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <Footer />
    </>
  );
};

export default LandingPage;