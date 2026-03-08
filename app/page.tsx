'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  useEffect(() => {
    // Scroll reveal observer
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible')
      })
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <style jsx global>{`
        /* ── LANDING PAGE STYLES ── */
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');

        :root {
          --rose: #E8527A;
          --rose-light: #F4A0B5;
          --rose-pale: #FDE8EF;
          --cream: #FDF7F2;
          --warm-dark: #1A0E14;
          --warm-mid: #3D2233;
          --gold: #C9935A;
          --gold-light: #EDD4B0;
          --sage: #7DAF8C;
          --text: #2A1820;
        }

        html { scroll-behavior: smooth; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--text);
          overflow-x: hidden;
          margin: 0;
          padding: 0;
        }

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        /* ── NOISE TEXTURE OVERLAY ── */
        .landing-page::before {
          content: '';
          position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 1000; opacity: 0.35;
        }

        /* ── NAV ── */
        .landing-nav {
          position: fixed; top: 0; left: 0; right: 0;
          padding: 20px 40px;
          display: flex; align-items: center; justify-content: space-between;
          z-index: 100;
          background: rgba(253,247,242,0.85);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(232,82,122,0.12);
        }

        .nav-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.6rem;
          font-weight: 900;
          color: var(--rose);
          letter-spacing: -0.02em;
        }

        .nav-logo span {
          color: var(--warm-dark);
        }

        .landing-nav ul { list-style: none; display: flex; gap: 36px; margin: 0; padding: 0; }
        .landing-nav ul a {
          text-decoration: none;
          color: var(--warm-mid);
          font-size: 0.88rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          transition: color 0.2s;
        }
        .landing-nav ul a:hover { color: var(--rose); }

        .nav-cta {
          background: var(--rose);
          color: white !important;
          padding: 10px 22px;
          border-radius: 50px;
          transition: background 0.2s, transform 0.2s !important;
        }
        .nav-cta:hover { background: var(--warm-mid) !important; transform: translateY(-1px); }

        /* ── HERO ── */
        .hero {
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          padding: 120px 80px 80px;
          gap: 60px;
          position: relative;
          overflow: hidden;
        }

        .hero-bg {
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 60% 70% at 100% 50%, rgba(244,160,181,0.25) 0%, transparent 60%),
            radial-gradient(ellipse 40% 40% at 10% 80%, rgba(201,147,90,0.15) 0%, transparent 50%);
        }

        .hero-blob {
          position: absolute;
          right: -100px; top: 50%;
          transform: translateY(-50%);
          width: 600px; height: 600px;
          border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%;
          background: linear-gradient(135deg, rgba(232,82,122,0.12), rgba(244,160,181,0.2));
          animation: morphBlob 8s ease-in-out infinite;
        }

        @keyframes morphBlob {
          0%, 100% { border-radius: 60% 40% 70% 30% / 50% 60% 40% 50%; }
          33%       { border-radius: 40% 60% 30% 70% / 60% 40% 60% 40%; }
          66%       { border-radius: 70% 30% 50% 50% / 40% 70% 30% 60%; }
        }

        .hero-content { position: relative; z-index: 2; }

        .hero-tag {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(232,82,122,0.1);
          border: 1px solid rgba(232,82,122,0.3);
          padding: 6px 16px;
          border-radius: 50px;
          font-size: 0.78rem;
          font-weight: 500;
          color: var(--rose);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 28px;
          animation: fadeUp 0.8s ease both;
        }

        .hero-tag::before {
          content: '';
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--rose);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }

        .landing-page h1 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(3rem, 5vw, 4.8rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.03em;
          color: var(--warm-dark);
          margin-bottom: 24px;
          animation: fadeUp 0.8s 0.1s ease both;
        }

        .landing-page h1 em {
          font-style: italic;
          color: var(--rose);
        }

        .hero-sub {
          font-size: 1.15rem;
          font-weight: 300;
          color: var(--warm-mid);
          line-height: 1.7;
          max-width: 460px;
          margin-bottom: 40px;
          animation: fadeUp 0.8s 0.2s ease both;
        }

        .hero-actions {
          display: flex; gap: 16px; flex-wrap: wrap;
          animation: fadeUp 0.8s 0.3s ease both;
        }

        .btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          background: var(--rose);
          color: white;
          padding: 16px 32px;
          border-radius: 50px;
          font-size: 0.95rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.25s;
          box-shadow: 0 8px 30px rgba(232,82,122,0.35);
        }
        .btn-primary:hover { background: var(--warm-dark); transform: translateY(-2px); box-shadow: 0 12px 40px rgba(232,82,122,0.4); }

        .btn-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          background: transparent;
          color: var(--warm-dark);
          padding: 16px 28px;
          border-radius: 50px;
          border: 1.5px solid rgba(26,14,20,0.2);
          font-size: 0.95rem;
          font-weight: 500;
          text-decoration: none;
          transition: all 0.25s;
        }
        .btn-secondary:hover { border-color: var(--rose); color: var(--rose); }

        /* ── PHONE MOCKUP ── */
        .hero-visual {
          position: relative; z-index: 2;
          display: flex; justify-content: center; align-items: center;
          animation: fadeUp 0.8s 0.15s ease both;
        }

        .phone-wrap {
          position: relative;
          filter: drop-shadow(0 40px 80px rgba(232,82,122,0.3));
        }

        .phone {
          width: 280px;
          background: var(--warm-dark);
          border-radius: 44px;
          padding: 16px;
          border: 2px solid rgba(255,255,255,0.08);
          position: relative;
          overflow: hidden;
        }

        .phone-notch {
          width: 100px; height: 28px;
          background: var(--warm-dark);
          border-radius: 0 0 18px 18px;
          margin: 0 auto 8px;
          position: relative; z-index: 2;
        }

        .phone-screen {
          background: #F8F0F4;
          border-radius: 32px;
          overflow: hidden;
          min-height: 520px;
        }

        .chat-header {
          background: var(--rose);
          padding: 14px 16px;
          display: flex; align-items: center; gap: 10px;
        }
        .chat-avatar {
          width: 32px; height: 32px; border-radius: 50%;
          background: white;
          display: flex; align-items: center; justify-content: center;
          font-size: 1rem;
        }
        .chat-header-info h4 { color: white; font-size: 0.85rem; font-weight: 600; margin: 0; }
        .chat-header-info p  { color: rgba(255,255,255,0.7); font-size: 0.68rem; margin: 0; }

        .chat-messages { padding: 16px 12px; display: flex; flex-direction: column; gap: 10px; }

        .msg {
          max-width: 85%;
          padding: 10px 13px;
          border-radius: 16px;
          font-size: 0.78rem;
          line-height: 1.5;
          animation: msgIn 0.4s ease both;
        }
        .msg-bot {
          background: white;
          color: var(--text);
          border-bottom-left-radius: 4px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .msg-user {
          background: var(--rose);
          color: white;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }

        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .msg-time { font-size: 0.62rem; opacity: 0.5; margin-top: 3px; }

        .amount-badge {
          display: inline-block;
          background: rgba(125,175,140,0.2);
          color: var(--sage);
          border: 1px solid var(--sage);
          border-radius: 4px;
          padding: 1px 6px;
          font-weight: 600;
        }

        /* ── FLOATING STATS ── */
        .stat-card {
          position: absolute;
          background: white;
          border-radius: 16px;
          padding: 14px 18px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.12);
          display: flex; align-items: center; gap: 12px;
          animation: floatCard 4s ease-in-out infinite;
        }

        .stat-card.left {
          left: -80px; bottom: 120px;
          animation-delay: 0.5s;
        }

        .stat-card.right {
          right: -70px; top: 100px;
          animation-delay: 1.2s;
        }

        @keyframes floatCard {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }

        .stat-icon {
          width: 40px; height: 40px; border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.1rem;
        }
        .stat-icon.green { background: rgba(125,175,140,0.15); }
        .stat-icon.gold  { background: rgba(201,147,90,0.15); }

        .stat-label { font-size: 0.68rem; color: #999; font-weight: 400; }
        .stat-value { font-size: 1rem; font-weight: 700; color: var(--warm-dark); }

        /* ── ANIMATIONS ── */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── TRUST BAR ── */
        .trust-bar {
          background: var(--warm-dark);
          padding: 20px 80px;
          display: flex; align-items: center; justify-content: center; gap: 60px;
          overflow: hidden;
        }

        .trust-item {
          display: flex; align-items: center; gap: 10px;
          color: rgba(255,255,255,0.6);
          font-size: 0.82rem;
          white-space: nowrap;
          letter-spacing: 0.02em;
        }
        .trust-item span { color: var(--rose-light); font-size: 1rem; }

        /* ── SECTIONS ── */
        .landing-section { padding: 100px 80px; }

        .section-tag {
          display: inline-block;
          color: var(--rose);
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 16px;
        }

        .landing-page h2 {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 3.5vw, 3.2rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--warm-dark);
          margin-bottom: 20px;
        }

        .section-intro {
          font-size: 1.05rem;
          color: var(--warm-mid);
          font-weight: 300;
          line-height: 1.7;
          max-width: 520px;
          margin-bottom: 64px;
        }

        /* ── STEPS ── */
        .steps {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .step {
          position: relative;
          padding: 36px 32px;
          border-radius: 24px;
          transition: transform 0.3s, box-shadow 0.3s;
          cursor: default;
        }

        .step:hover { transform: translateY(-6px); }

        .step-1 { background: var(--rose-pale); }
        .step-2 { background: rgba(201,147,90,0.1); }
        .step-3 { background: rgba(125,175,140,0.12); }

        .step-number {
          font-family: 'Playfair Display', serif;
          font-size: 4rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 20px;
          opacity: 0.15;
        }
        .step-1 .step-number { color: var(--rose); }
        .step-2 .step-number { color: var(--gold); }
        .step-3 .step-number { color: var(--sage); }

        .step-icon {
          width: 52px; height: 52px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.5rem;
          margin-bottom: 20px;
        }
        .step-1 .step-icon { background: rgba(232,82,122,0.15); }
        .step-2 .step-icon { background: rgba(201,147,90,0.15); }
        .step-3 .step-icon { background: rgba(125,175,140,0.2); }

        .step h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--warm-dark);
          margin-bottom: 12px;
        }

        .step p {
          font-size: 0.9rem;
          color: var(--warm-mid);
          line-height: 1.65;
          font-weight: 300;
        }

        /* ── FEATURES ── */
        .features { background: var(--warm-dark); padding: 100px 80px; }

        .features h2,
        .features .section-tag { color: var(--rose-light); }
        .features h2 { color: white; }

        .features .section-intro { color: rgba(255,255,255,0.55); }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2px;
        }

        .feature-item {
          padding: 48px 44px;
          border: 1px solid rgba(255,255,255,0.05);
          transition: background 0.3s;
          position: relative;
          overflow: hidden;
        }

        .feature-item::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 3px; height: 100%;
          background: var(--rose);
          transform: scaleY(0);
          transform-origin: bottom;
          transition: transform 0.3s;
        }

        .feature-item:hover { background: rgba(255,255,255,0.03); }
        .feature-item:hover::before { transform: scaleY(1); }

        .feature-emoji { font-size: 2rem; margin-bottom: 18px; }

        .feature-item h3 {
          font-family: 'Playfair Display', serif;
          font-size: 1.2rem;
          color: white;
          margin-bottom: 10px;
          font-weight: 700;
        }

        .feature-item p {
          font-size: 0.88rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.7;
          font-weight: 300;
        }

        /* ── SOCIAL PROOF ── */
        .testimonials { padding: 100px 80px; background: var(--rose-pale); }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .testimonial {
          background: white;
          border-radius: 24px;
          padding: 36px 32px;
          position: relative;
          transition: transform 0.3s;
        }
        .testimonial:hover { transform: translateY(-4px); }

        .testimonial::before {
          content: '\\201C';
          font-family: 'Playfair Display', serif;
          font-size: 6rem;
          color: var(--rose);
          opacity: 0.15;
          position: absolute;
          top: -10px; left: 20px;
          line-height: 1;
        }

        .testimonial p {
          font-size: 0.92rem;
          color: var(--warm-mid);
          line-height: 1.75;
          margin-bottom: 24px;
          font-style: italic;
          font-weight: 300;
          position: relative; z-index: 1;
        }

        .testimonial-author {
          display: flex; align-items: center; gap: 12px;
        }
        .author-avatar {
          width: 42px; height: 42px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.2rem;
          background: var(--rose-pale);
        }
        .author-name { font-weight: 600; font-size: 0.85rem; color: var(--warm-dark); }
        .author-role { font-size: 0.75rem; color: #999; }

        .stars { color: var(--gold); font-size: 0.85rem; margin-bottom: 14px; }

        /* ── CTA SECTION ── */
        .cta-section {
          padding: 120px 80px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute; inset: 0;
          background:
            radial-gradient(ellipse 50% 60% at 50% 50%, rgba(232,82,122,0.1) 0%, transparent 70%);
        }

        .cta-section h2 { margin: 0 auto 20px; max-width: 700px; position: relative; }
        .cta-section p  {
          font-size: 1.1rem; color: var(--warm-mid);
          font-weight: 300; line-height: 1.7;
          max-width: 500px; margin: 0 auto 40px;
          position: relative;
        }

        .cta-actions { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; position: relative; }

        .whatsapp-btn {
          display: inline-flex; align-items: center; gap: 12px;
          background: #25D366;
          color: white;
          padding: 18px 36px;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 500;
          text-decoration: none;
          box-shadow: 0 8px 30px rgba(37,211,102,0.35);
          transition: all 0.25s;
          letter-spacing: 0.01em;
        }
        .whatsapp-btn:hover { background: #128C7E; transform: translateY(-2px); }

        .whatsapp-icon {
          width: 22px; height: 22px;
          background: white;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
        }

        /* ── FOOTER ── */
        .landing-footer {
          background: var(--warm-dark);
          padding: 40px 80px;
          display: flex; align-items: center; justify-content: space-between;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .footer-logo {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 900;
          color: white;
        }
        .footer-logo span { color: var(--rose); }

        .landing-footer p { color: rgba(255,255,255,0.3); font-size: 0.8rem; margin: 0; }

        /* ── SCROLL REVEAL ── */
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: none;
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; padding: 100px 32px 60px; text-align: center; }
          .hero-visual { display: none; }
          .hero-sub { margin: 0 auto 40px; }
          .hero-actions { justify-content: center; }
          .landing-section, .features, .testimonials, .cta-section { padding: 70px 32px; }
          .steps, .testimonials-grid { grid-template-columns: 1fr; }
          .features-grid { grid-template-columns: 1fr; }
          .landing-nav ul { display: none; }
          .landing-footer { flex-direction: column; gap: 12px; text-align: center; }
          .trust-bar { gap: 24px; flex-wrap: wrap; padding: 20px 32px; }
          .stat-card { display: none; }
        }
      `}</style>

      <div className="landing-page">
        {/* NAV */}
        <nav className="landing-nav">
          <div className="nav-logo">She<span>Ledger</span></div>
          <ul>
            <li><a href="#como-funciona">Cómo funciona</a></li>
            <li><a href="#funcionalidades">Funciones</a></li>
            <li><a href="#testimonios">Historias</a></li>
            <li><Link href="/demo" className="nav-cta">Comenzar gratis</Link></li>
          </ul>
        </nav>

        {/* HERO */}
        <section className="hero">
          <div className="hero-bg"></div>
          <div className="hero-blob"></div>

          <div className="hero-content">
            <div className="hero-tag">Para mujeres emprendedoras</div>
            <h1>Tu negocio,<br /><em>bajo control.</em></h1>
            <p className="hero-sub">SheLedger es tu asistente financiera personal por WhatsApp. Registra ventas, controla gastos y entiende tu negocio — con solo enviar un mensaje.</p>
            <div className="hero-actions">
              <Link href="/demo" className="btn-primary">
                <span>▶</span> Prueba el Demo
              </Link>
              <a href="#como-funciona" className="btn-secondary">Ver cómo funciona →</a>
            </div>
          </div>

          <div className="hero-visual">
            <div className="phone-wrap">
              {/* Stat left */}
              <div className="stat-card left">
                <div className="stat-icon green">💰</div>
                <div>
                  <div className="stat-label">Ganancia hoy</div>
                  <div className="stat-value">S/ 340</div>
                </div>
              </div>
              {/* Stat right */}
              <div className="stat-card right">
                <div className="stat-icon gold">📈</div>
                <div>
                  <div className="stat-label">Este mes</div>
                  <div className="stat-value">+18%</div>
                </div>
              </div>

              <div className="phone">
                <div className="phone-notch"></div>
                <div className="phone-screen">
                  <div className="chat-header">
                    <div className="chat-avatar">💜</div>
                    <div className="chat-header-info">
                      <h4>SheLedger</h4>
                      <p>● En línea</p>
                    </div>
                  </div>
                  <div className="chat-messages">
                    <div className="msg msg-bot" style={{ animationDelay: '0.3s' }}>
                      ¡Hola! Soy tu asistente de SheLedger 🌸 Cuéntame tus ventas y gastos de hoy.
                      <div className="msg-time">09:12</div>
                    </div>
                    <div className="msg msg-user" style={{ animationDelay: '1.2s' }}>
                      Vendí 200 soles hoy
                      <div className="msg-time">09:14</div>
                    </div>
                    <div className="msg msg-bot" style={{ animationDelay: '2.0s' }}>
                      ✅ Registrado: <span className="amount-badge">+S/ 200</span><br />
                      Llevas <strong>S/ 680</strong> esta semana. ¡Excelente ritmo! 🚀
                      <div className="msg-time">09:14</div>
                    </div>
                    <div className="msg msg-user" style={{ animationDelay: '3.0s' }}>
                      Gasté 45 en insumos
                      <div className="msg-time">09:16</div>
                    </div>
                    <div className="msg msg-bot" style={{ animationDelay: '3.8s' }}>
                      Gasto registrado 📝 Tu margen de hoy es del <strong>77%</strong>. Tu puntaje SheLedger: <strong>⭐ 82/100</strong>
                      <div className="msg-time">09:16</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BAR */}
        <div className="trust-bar">
          <div className="trust-item"><span>💬</span> Funciona en WhatsApp</div>
          <div className="trust-item"><span>🇵🇪</span> Hecho para Latinoamérica</div>
          <div className="trust-item"><span>🔒</span> Tus datos seguros</div>
          <div className="trust-item"><span>⚡</span> Sin apps que descargar</div>
          <div className="trust-item"><span>💸</span> Empieza gratis</div>
        </div>

        {/* HOW IT WORKS */}
        <section className="landing-section" id="como-funciona">
          <div className="reveal">
            <span className="section-tag">El proceso</span>
            <h2>Tres pasos<br />para tomar control</h2>
            <p className="section-intro">Sin formularios. Sin apps complicadas. Solo WhatsApp — el canal que ya usas todos los días.</p>
          </div>

          <div className="steps">
            <div className="step step-1 reveal">
              <div className="step-number">01</div>
              <div className="step-icon">📱</div>
              <h3>Únete por WhatsApp</h3>
              <p>Envía un mensaje de WhatsApp al número de SheLedger y en segundos tienes tu asistente lista para trabajar contigo.</p>
            </div>
            <div className="step step-2 reveal" style={{ transitionDelay: '0.12s' }}>
              <div className="step-number">02</div>
              <div className="step-icon">🗣️</div>
              <h3>Registra en lenguaje natural</h3>
              <p>Di &quot;Vendí 150 soles&quot; o &quot;Gasté 40 en insumos&quot;. No necesitas aprender nada especial. SheLedger te entiende.</p>
            </div>
            <div className="step step-3 reveal" style={{ transitionDelay: '0.24s' }}>
              <div className="step-number">03</div>
              <div className="step-icon">📊</div>
              <h3>Recibe insights al instante</h3>
              <p>Consulta tu margen, historial de ventas, puntaje financiero y proyecciones — directamente en el chat.</p>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features" id="funcionalidades">
          <div className="reveal">
            <span className="section-tag">Funcionalidades</span>
            <h2>Todo lo que necesita<br />tu negocio</h2>
            <p className="section-intro">SheLedger hace que la gestión financiera sea tan fácil como mandar un mensaje a una amiga.</p>
          </div>

          <div className="features-grid reveal">
            <div className="feature-item">
              <div className="feature-emoji">💬</div>
              <h3>Registro por voz natural</h3>
              <p>Escribe como hablas. &quot;Hoy vendí 3 tortas a 25 cada una&quot; y SheLedger lo calcula y registra automáticamente.</p>
            </div>
            <div className="feature-item">
              <div className="feature-emoji">📈</div>
              <h3>Puntaje financiero SheLedger</h3>
              <p>Un score del 0 al 100 que refleja la salud de tu negocio. Sube tu puntaje mejorando tus hábitos financieros.</p>
            </div>
            <div className="feature-item">
              <div className="feature-emoji">📅</div>
              <h3>Reportes semanales y mensuales</h3>
              <p>Recibe resúmenes automáticos con tus mejores días, gastos más frecuentes y tendencias de tu negocio.</p>
            </div>
            <div className="feature-item">
              <div className="feature-emoji">🎯</div>
              <h3>Metas y seguimiento</h3>
              <p>Define cuánto quieres ganar este mes y SheLedger te avisa cada día cómo vas hacia tu objetivo.</p>
            </div>
            <div className="feature-item">
              <div className="feature-emoji">💡</div>
              <h3>Consejos personalizados</h3>
              <p>SheLedger analiza tu negocio y te da recomendaciones concretas para mejorar tu rentabilidad.</p>
            </div>
            <div className="feature-item">
              <div className="feature-emoji">🔐</div>
              <h3>Privado y seguro</h3>
              <p>Tus datos son solo tuyos. Encriptación de extremo a extremo y nunca compartimos tu información.</p>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="testimonials" id="testimonios">
          <div className="reveal">
            <span className="section-tag">Historias reales</span>
            <h2>Emprendedoras que<br />ya llevan las riendas</h2>
            <p className="section-intro">Miles de mujeres ya están tomando decisiones más inteligentes con SheLedger.</p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial reveal">
              <div className="stars">★★★★★</div>
              <p>&quot;Antes anotaba todo en un cuaderno y al final del mes no sabía si había ganado o perdido. Con SheLedger sé exactamente cómo va mi pastelería cada día.&quot;</p>
              <div className="testimonial-author">
                <div className="author-avatar">👩‍🍳</div>
                <div>
                  <div className="author-name">María Quispe</div>
                  <div className="author-role">Pastelería artesanal, Lima</div>
                </div>
              </div>
            </div>
            <div className="testimonial reveal" style={{ transitionDelay: '0.12s' }}>
              <div className="stars">★★★★★</div>
              <p>&quot;Lo mejor es que lo uso mientras despacho. Entre cliente y cliente le mando el mensaje y ya está registrado. Nunca había sido tan fácil controlar mis finanzas.&quot;</p>
              <div className="testimonial-author">
                <div className="author-avatar">🧴</div>
                <div>
                  <div className="author-name">Rosa Mamani</div>
                  <div className="author-role">Cosmética natural, Cusco</div>
                </div>
              </div>
            </div>
            <div className="testimonial reveal" style={{ transitionDelay: '0.24s' }}>
              <div className="stars">★★★★★</div>
              <p>&quot;Mi puntaje subió de 45 a 78 en un mes siguiendo los consejos de SheLedger. Ahora sé cuánto ahorrar y cuándo conviene invertir en más mercadería.&quot;</p>
              <div className="testimonial-author">
                <div className="author-avatar">👗</div>
                <div>
                  <div className="author-name">Carmen López</div>
                  <div className="author-role">Boutique de ropa, Arequipa</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="cta-section" id="empezar">
          <div className="reveal">
            <span className="section-tag">Empieza hoy</span>
            <h2>Tu negocio merece<br /><em>una asistente inteligente</em></h2>
            <p>Únete a SheLedger ahora mismo. Sin descargas, sin complicaciones — solo WhatsApp y tú.</p>
            <div className="cta-actions">
              <a href="https://wa.me/14155238886?text=join%20early-building" className="whatsapp-btn" target="_blank" rel="noopener noreferrer">
                <div className="whatsapp-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                </div>
                Conectar con SheLedger
              </a>
              <Link href="/demo" className="btn-primary" style={{ background: 'var(--rose)' }}>
                Probar el Demo →
              </Link>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="landing-footer">
          <div className="footer-logo">She<span>Ledger</span></div>
          <p>Empoderamiento financiero para mujeres emprendedoras 💜</p>
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.75rem' }}>© 2025 SheLedger</p>
        </footer>
      </div>
    </>
  )
}
