'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import './landing.css'

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
  )
}
