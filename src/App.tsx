import { useState, useEffect, useRef, type ReactNode } from 'react'

// ─── Color tokens ─────────────────────────────────────────────────────────────
const C = {
  petrol: '#004761',
  flame: '#FF6A13',
  bg: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#1F2937',
  muted: '#6B7280',
  border: '#E5E7EB',
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ end, suffix = '', duration = 1800 }: { end: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          setVal(Math.round(ease * end))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])

  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

// ─── Fade-in on scroll ────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'lg' ? 32 : size === 'md' ? 24 : 20
  return (
    <span style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: sz, letterSpacing: '-0.02em', lineHeight: 1 }}>
      <span style={{ color: C.petrol }}>Brandi</span>
      <span style={{ color: C.flame }}>GO</span>
    </span>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────
function Btn({
  children, variant = 'primary', size = 'md', onClick, type = 'button', full = false
}: {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  type?: 'button' | 'submit'
  full?: boolean
}) {
  const [hov, setHov] = useState(false)
  const pad = size === 'lg' ? '14px 32px' : size === 'sm' ? '8px 18px' : '11px 24px'
  const fs = size === 'lg' ? 16 : size === 'sm' ? 13 : 15

  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: hov ? '#e55a0a' : C.flame,
      color: '#fff',
      border: 'none',
    },
    secondary: {
      background: hov ? '#003a52' : C.petrol,
      color: '#fff',
      border: 'none',
    },
    outline: {
      background: hov ? C.surface : 'transparent',
      color: C.petrol,
      border: `1.5px solid ${C.petrol}`,
    },
  }

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...styles[variant],
        padding: pad,
        fontSize: fs,
        fontFamily: 'Manrope',
        fontWeight: 700,
        borderRadius: 10,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        transition: 'all 0.18s ease',
        width: full ? '100%' : undefined,
        justifyContent: full ? 'center' : undefined,
        letterSpacing: '0.01em',
      }}
    >
      {children}
    </button>
  )
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function Card({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const [hov, setHov] = useState(false)
  return (
    <div
      className={className}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#fff',
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: '28px 28px',
        transition: 'box-shadow 0.2s, transform 0.2s',
        boxShadow: hov ? '0 8px 32px rgba(0,71,97,0.10)' : '0 1px 4px rgba(0,0,0,0.05)',
        transform: hov ? 'translateY(-2px)' : 'none',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ─── SVG icons ────────────────────────────────────────────────────────────────
function Icon({ name, size = 24, color = C.petrol }: { name: string; size?: number; color?: string }) {
  const icons: Record<string, ReactNode> = {
    car: <><path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h14l4 4v4a2 2 0 0 1-2 2h-2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M13 9H7l-2 4h12l-1.5-4H13z"/></>,
    building: <><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22V12h6v10"/><path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01"/></>,
    fuel: <><path d="M3 22V8l8-6 8 6v14H3z"/><path d="M10 22V16h4v6"/><path d="M14 10.5A2 2 0 0 0 12 9a2 2 0 0 0-2 1.5"/></>,
    trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    check: <><polyline points="20 6 9 17 4 12"/></>,
    map: <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    dollar: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    zap: <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
    bar: <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    phone: <><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.29 6.29l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></>,
    mail: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    award: <><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    globe: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    minus: <><line x1="5" y1="12" x2="19" y2="12"/></>,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></>,
    twitter: <><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></>,
    linkedin: <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></>,
  }

  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name] ?? null}
    </svg>
  )
}

// ─── Vehicle illustration with ad wrap ───────────────────────────────────────
function VehicleHero() {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 560, margin: '0 auto' }}>
      {/* Map background */}
      <div style={{
        background: 'linear-gradient(135deg, #e8f4fd 0%, #d0eaf8 50%, #b8dfff 100%)',
        borderRadius: 24,
        padding: '32px',
        position: 'relative',
        overflow: 'hidden',
        minHeight: 340,
      }}>
        {/* Grid map lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }} viewBox="0 0 560 340">
          {[0,1,2,3,4,5,6,7,8].map(i => (
            <line key={`h${i}`} x1="0" y1={i*48} x2="560" y2={i*48} stroke={C.petrol} strokeWidth="1"/>
          ))}
          {[0,1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
            <line key={`v${i}`} x1={i*48} y1="0" x2={i*48} y2="340" stroke={C.petrol} strokeWidth="1"/>
          ))}
          {/* Road-like paths */}
          <path d="M 60 100 Q 160 80 260 120 Q 360 160 460 140" stroke={C.petrol} strokeWidth="3" fill="none" opacity="0.4"/>
          <path d="M 80 200 Q 180 220 280 180 Q 380 140 480 200" stroke={C.petrol} strokeWidth="3" fill="none" opacity="0.4"/>
        </svg>

        {/* Route dots */}
        {[{x:'18%',y:'30%'},{x:'40%',y:'52%'},{x:'62%',y:'38%'},{x:'80%',y:'60%'}].map((p, i) => (
          <div key={i} style={{
            position: 'absolute', left: p.x, top: p.y,
            width: i === 3 ? 14 : 10, height: i === 3 ? 14 : 10,
            borderRadius: '50%',
            background: i === 3 ? C.flame : C.petrol,
            boxShadow: `0 0 0 ${i===3?6:4}px ${i===3?'rgba(255,106,19,0.2)':'rgba(0,71,97,0.15)'}`,
            animation: 'pulse 2s ease-in-out infinite',
            animationDelay: `${i * 0.4}s`,
          }}/>
        ))}

        {/* Route line */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 560 340" preserveAspectRatio="none">
          <polyline
            points="101,102 224,176 347,130 448,204"
            fill="none"
            stroke={C.flame}
            strokeWidth="2.5"
            strokeDasharray="6,4"
            opacity="0.7"
          />
        </svg>

        {/* Car SVG */}
        <div style={{ position: 'relative', zIndex: 10, marginTop: 60, display: 'flex', justifyContent: 'center' }}>
          <svg viewBox="0 0 320 120" width="320" style={{ filter: 'drop-shadow(0 8px 24px rgba(0,71,97,0.18))' }}>
            {/* Car body */}
            <rect x="20" y="55" width="280" height="50" rx="10" fill={C.petrol}/>
            {/* Ad wrap on side */}
            <rect x="60" y="56" width="200" height="48" rx="0" fill="none" stroke={C.flame} strokeWidth="2"/>
            <rect x="62" y="58" width="196" height="44" rx="2" fill="rgba(255,106,19,0.12)"/>
            {/* BrandiGO text on car */}
            <text x="162" y="85" textAnchor="middle" fontFamily="Manrope" fontWeight="800" fontSize="15" fill={C.flame} letterSpacing="-0.5">BrandiGO</text>
            <text x="162" y="98" textAnchor="middle" fontFamily="Manrope" fontWeight="500" fontSize="8" fill="rgba(255,255,255,0.7)">publicidad en movimiento</text>
            {/* Car top */}
            <path d="M 90 55 L 115 22 Q 120 16 130 16 L 195 16 Q 205 16 210 22 L 230 55 Z" fill="#003a52"/>
            {/* Windows */}
            <rect x="120" y="22" width="60" height="28" rx="4" fill="rgba(173,216,240,0.7)"/>
            <rect x="185" y="26" width="28" height="22" rx="3" fill="rgba(173,216,240,0.5)"/>
            {/* Wheels */}
            <circle cx="80" cy="105" r="18" fill="#1a1a2e"/>
            <circle cx="80" cy="105" r="10" fill="#333"/>
            <circle cx="80" cy="105" r="4" fill="#888"/>
            <circle cx="240" cy="105" r="18" fill="#1a1a2e"/>
            <circle cx="240" cy="105" r="10" fill="#333"/>
            <circle cx="240" cy="105" r="4" fill="#888"/>
            {/* Headlight */}
            <rect x="288" y="64" width="16" height="10" rx="3" fill="#FFE066"/>
            {/* Tail light */}
            <rect x="16" y="64" width="10" height="10" rx="2" fill="#FF4444"/>
          </svg>
        </div>

        {/* Stats chips */}
        <div style={{ position: 'absolute', top: 16, right: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { label: 'Km monitoreados', value: '12,340' },
            { label: 'Impresiones hoy', value: '8,200+' },
          ].map(s => (
            <div key={s.label} style={{
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(8px)',
              borderRadius: 10,
              padding: '8px 14px',
              fontSize: 12,
              fontFamily: 'Manrope',
              boxShadow: '0 2px 12px rgba(0,71,97,0.10)',
            }}>
              <div style={{ fontWeight: 700, color: C.petrol }}>{s.value}</div>
              <div style={{ color: C.muted, fontSize: 11 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Active campaign chip */}
        <div style={{
          position: 'absolute', bottom: 16, left: 16,
          background: C.flame,
          color: '#fff',
          borderRadius: 8,
          padding: '6px 14px',
          fontSize: 12,
          fontWeight: 700,
          fontFamily: 'Manrope',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#fff', animation: 'pulse 1.4s ease infinite' }}/>
          Campaña activa
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.15); }
        }
      `}</style>
    </div>
  )
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      borderBottom: scrolled ? `1px solid ${C.border}` : 'none',
      transition: 'all 0.25s ease',
    }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Logo />

        {/* Desktop links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="hidden-mobile">
          {[
            ['Cómo funciona', 'how'],
            ['Beneficios', 'benefits'],
            ['Por qué BrandiGO', 'why'],
            ['FAQ', 'faq'],
          ].map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Manrope', fontWeight: 600, fontSize: 14,
                color: C.text, padding: 0, transition: 'color 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = C.petrol)}
              onMouseLeave={e => (e.currentTarget.style.color = C.text)}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="hidden-mobile">
            <Btn variant="outline" size="sm" onClick={() => scrollTo('cta')}>Unirme al piloto</Btn>
          </div>
          <Btn variant="primary" size="sm" onClick={() => scrollTo('cta')}>Comenzar</Btn>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <line x1="3" y1="6" x2="19" y2="6" stroke={C.petrol} strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="11" x2="19" y2="11" stroke={C.petrol} strokeWidth="2" strokeLinecap="round"/>
              <line x1="3" y1="16" x2="19" y2="16" stroke={C.petrol} strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: '#fff',
          borderBottom: `1px solid ${C.border}`,
          padding: '16px 24px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {[
            ['Cómo funciona', 'how'],
            ['Beneficios', 'benefits'],
            ['Por qué BrandiGO', 'why'],
            ['FAQ', 'faq'],
            ['Unirme al piloto', 'cta'],
          ].map(([label, id]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'Manrope', fontWeight: 600, fontSize: 15,
                color: C.petrol, textAlign: 'left', padding: 0,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .hidden-mobile { display: flex; }
        .show-mobile { display: none; }
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section style={{ background: C.bg, paddingTop: 100, paddingBottom: 80, minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', width: '100%' }}>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
          {/* Left */}
          <div>
            <FadeIn>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,106,19,0.08)',
                border: `1px solid rgba(255,106,19,0.2)`,
                borderRadius: 100, padding: '6px 16px',
                marginBottom: 28,
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.flame, animation: 'pulse 1.5s ease infinite' }}/>
                <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: C.flame }}>
                  Programa Piloto Abierto
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={80}>
              <h1 style={{
                fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(36px, 5vw, 60px)',
                color: C.petrol, lineHeight: 1.08, letterSpacing: '-0.03em', margin: '0 0 20px',
              }}>
                Tu vehículo genera<br />
                <span style={{ color: C.flame }}>ingresos.</span> Las marcas<br />
                ganan visibilidad.
              </h1>
            </FadeIn>

            <FadeIn delay={160}>
              <p style={{
                fontFamily: 'Manrope', fontSize: 18, color: C.muted,
                lineHeight: 1.65, maxWidth: 480, margin: '0 0 36px',
              }}>
                BrandiGO conecta conductores con empresas en <strong style={{ color: C.petrol }}>Guayaquil</strong> para transformar vehículos en espacios publicitarios móviles. Más ingresos para ti, más visibilidad para ellos.
              </p>
            </FadeIn>

            <FadeIn delay={240}>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Btn variant="primary" size="lg" onClick={() => scrollTo('cta')}>
                  <Icon name="car" size={18} color="#fff"/> Soy conductor
                </Btn>
                <Btn variant="secondary" size="lg" onClick={() => scrollTo('cta')}>
                  <Icon name="building" size={18} color="#fff"/> Soy una empresa
                </Btn>
              </div>

              <p style={{ marginTop: 20, fontFamily: 'Manrope', fontSize: 13, color: C.muted }}>
                Sin costo de registro · Plataforma en validación · Sé de los primeros
              </p>
            </FadeIn>
          </div>

          {/* Right */}
          <FadeIn delay={120} className="hero-visual">
            <VehicleHero />
          </FadeIn>
        </div>

        {/* Guayaquil badge */}
        <FadeIn delay={400}>
          <div style={{ marginTop: 56, display: 'flex', justifyContent: 'center' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 100,
              padding: '10px 24px',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.petrol} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 14, color: C.petrol }}>
                Iniciando operaciones en <span style={{ color: C.flame }}>Guayaquil, Ecuador</span>
              </span>
            </div>
          </div>
        </FadeIn>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-visual { order: -1; }
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}

// ─── Problem ──────────────────────────────────────────────────────────────────
function Problem() {
  return (
    <section style={{ background: C.surface, padding: '96px 24px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: C.flame, letterSpacing: '0.1em', textTransform: 'uppercase' }}>El problema</span>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: C.petrol, margin: '12px 0 0', letterSpacing: '-0.02em' }}>
              Dos retos, una sola solución
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="two-col">
          {/* Conductores */}
          <FadeIn delay={100}>
            <div style={{
              background: '#fff',
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: '36px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                background: `linear-gradient(90deg, ${C.petrol}, #006a9a)`,
              }}/>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(0,71,97,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <Icon name="car" size={26} color={C.petrol}/>
              </div>
              <h3 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, color: C.petrol, margin: '0 0 8px' }}>Para conductores</h3>
              <p style={{ fontFamily: 'Manrope', fontSize: 15, color: C.muted, lineHeight: 1.6, marginBottom: 24 }}>
                Mantener un vehículo implica gastos constantes sin una fuente adicional de ingresos.
              </p>
              {['Alto costo de combustible mensual', 'Mantenimiento y depreciación constante', 'Sin ingresos mientras manejas', 'Tiempo y kilómetros desaprovechados'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'rgba(255,106,19,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10"><line x1="2" y1="5" x2="8" y2="5" stroke={C.flame} strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <span style={{ fontFamily: 'Manrope', fontSize: 14, color: C.text }}>{item}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* PYMES */}
          <FadeIn delay={200}>
            <div style={{
              background: '#fff',
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: '36px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                background: `linear-gradient(90deg, ${C.flame}, #ff8c4a)`,
              }}/>
              <div style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(255,106,19,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <Icon name="building" size={26} color={C.flame}/>
              </div>
              <h3 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 22, color: C.petrol, margin: '0 0 8px' }}>Para PYMES</h3>
              <p style={{ fontFamily: 'Manrope', fontSize: 15, color: C.muted, lineHeight: 1.6, marginBottom: 24 }}>
                La publicidad tradicional es cara y casi imposible de medir con precisión.
              </p>
              {['Presupuestos limitados para anunciarse', 'Vallas y agencias muy costosas', 'Difícil medir el impacto real', 'Escasa visibilidad local y física'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'rgba(255,106,19,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                  }}>
                    <svg width="10" height="10" viewBox="0 0 10 10"><line x1="2" y1="5" x2="8" y2="5" stroke={C.flame} strokeWidth="2" strokeLinecap="round"/></svg>
                  </div>
                  <span style={{ fontFamily: 'Manrope', fontSize: 14, color: C.text }}>{item}</span>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

        <style>{`
          .two-col { grid-template-columns: 1fr 1fr !important; }
          @media (max-width: 768px) {
            .two-col { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </section>
  )
}

// ─── Solution ─────────────────────────────────────────────────────────────────
function Solution() {
  return (
    <section style={{ background: C.bg, padding: '96px 24px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', textAlign: 'center' }}>
        <FadeIn>
          <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: C.flame, letterSpacing: '0.1em', textTransform: 'uppercase' }}>La solución</span>
          <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: C.petrol, margin: '12px 0 16px', letterSpacing: '-0.02em' }}>
            Una plataforma. Dos problemas resueltos.
          </h2>
          <p style={{ fontFamily: 'Manrope', fontSize: 17, color: C.muted, lineHeight: 1.7, maxWidth: 640, margin: '0 auto 64px' }}>
            BrandiGO actúa como el puente inteligente: las empresas publican campañas, los conductores las muestran en sus vehículos y ambas partes obtienen beneficios medibles.
          </p>
        </FadeIn>

        {/* Central connector graphic */}
        <FadeIn delay={100}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' }} className="connector-row">
            {/* Conductores */}
            <div style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: '32px 28px',
              textAlign: 'center',
              width: 200,
            }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(0,71,97,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Icon name="car" size={28} color={C.petrol}/>
              </div>
              <h4 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 17, color: C.petrol, margin: '0 0 8px' }}>Conductores</h4>
              <p style={{ fontFamily: 'Manrope', fontSize: 13, color: C.muted }}>Muestran publicidad en sus rutas diarias</p>
            </div>

            {/* Arrows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ height: 2, width: 60, background: `linear-gradient(90deg, ${C.petrol}, ${C.flame})`, borderRadius: 1 }}/>
                <svg width="8" height="12" viewBox="0 0 8 12"><path d="M 0 0 L 8 6 L 0 12" fill={C.flame}/></svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row-reverse' }}>
                <div style={{ height: 2, width: 60, background: `linear-gradient(90deg, ${C.flame}, ${C.petrol})`, borderRadius: 1 }}/>
                <svg width="8" height="12" viewBox="0 0 8 12"><path d="M 8 0 L 0 6 L 8 12" fill={C.petrol}/></svg>
              </div>
            </div>

            {/* BrandiGO center */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: 24,
              padding: '36px 32px',
              textAlign: 'center',
              width: 200,
              boxShadow: '0 12px 40px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <Logo size="lg" />
              <p style={{ fontFamily: 'Manrope', fontSize: 13, color: C.muted, marginTop: 10 }}>Plataforma inteligente</p>
              <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                {['GPS', 'Analytics', 'Pagos'].map(t => (
                  <span key={t} style={{
                    background: 'rgba(1,1,1,0.12)',
                    color: C.muted,
                    borderRadius: 6, padding: '3px 10px',
                    fontFamily: 'Manrope', fontWeight: 600, fontSize: 11,
                  }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Arrows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '0 8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ height: 2, width: 60, background: `linear-gradient(90deg, ${C.flame}, ${C.petrol})`, borderRadius: 1 }}/>
                <svg width="8" height="12" viewBox="0 0 8 12"><path d="M 0 0 L 8 6 L 0 12" fill={C.petrol}/></svg>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexDirection: 'row-reverse' }}>
                <div style={{ height: 2, width: 60, background: `linear-gradient(90deg, ${C.petrol}, ${C.flame})`, borderRadius: 1 }}/>
                <svg width="8" height="12" viewBox="0 0 8 12"><path d="M 8 0 L 0 6 L 8 12" fill={C.flame}/></svg>
              </div>
            </div>

            {/* PYMES */}
            <div style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: '32px 28px',
              textAlign: 'center',
              width: 200,
            }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(255,106,19,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Icon name="building" size={28} color={C.flame}/>
              </div>
              <h4 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 17, color: C.petrol, margin: '0 0 8px' }}>PYMES</h4>
              <p style={{ fontFamily: 'Manrope', fontSize: 13, color: C.muted }}>Publican campañas y miden resultados</p>
            </div>
          </div>
        </FadeIn>
      </div>

      <style>{`
        .connector-row { flex-direction: row; }
        @media (max-width: 768px) {
          .connector-row { flex-direction: column; align-items: center; gap: 16px !important; }
        }
      `}</style>
    </section>
  )
}

// ─── How it works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  const [active, setActive] = useState<'conductores' | 'empresas'>('conductores')

  const steps = {
    conductores: [
      { icon: 'users', title: 'Regístrate gratis', desc: 'Crea tu perfil de conductor en minutos con tus datos básicos y los de tu vehículo.' },
      { icon: 'check', title: 'Verifica tu vehículo', desc: 'Sube fotos y documenta el estado de tu auto. Proceso simple y rápido.' },
      { icon: 'car', title: 'Participa en campañas', desc: 'Elige campañas disponibles en tu zona y acepta la publicación en tu vehículo.' },
      { icon: 'dollar', title: 'Recibe tus ingresos', desc: 'Gana dinero mientras manejas tus rutas habituales. Pagos transparentes.' },
    ],
    empresas: [
      { icon: 'zap', title: 'Publica una campaña', desc: 'Define tu mensaje, el área geográfica y las características del público objetivo.' },
      { icon: 'trending', title: 'Define tu presupuesto', desc: 'Establece cuánto invertir. Planes desde cualquier tamaño de empresa.' },
      { icon: 'users', title: 'Selecciona conductores', desc: 'Elige conductores verificados según rutas, zonas y alcance deseado.' },
      { icon: 'bar', title: 'Mide resultados', desc: 'Accede a datos reales: km recorridos, zonas de alto impacto e impresiones estimadas.' },
    ],
  }

  return (
    <section id="how" style={{ background: C.surface, padding: '96px 24px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: C.flame, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Cómo funciona</span>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: C.petrol, margin: '12px 0 0', letterSpacing: '-0.02em' }}>
              Simple para todos
            </h2>
          </div>
        </FadeIn>

        {/* Toggle */}
        <FadeIn delay={100}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
            <div style={{
              background: '#fff',
              border: `1px solid ${C.border}`,
              borderRadius: 12,
              padding: 4,
              display: 'flex',
              gap: 4,
            }}>
              {(['conductores', 'empresas'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActive(tab)}
                  style={{
                    padding: '10px 28px',
                    borderRadius: 9,
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Manrope',
                    fontWeight: 700,
                    fontSize: 14,
                    background: active === tab ? (tab === 'conductores' ? C.petrol : C.flame) : 'transparent',
                    color: active === tab ? '#fff' : C.muted,
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <Icon name={tab === 'conductores' ? 'car' : 'building'} size={16} color={active === tab ? '#fff' : C.muted}/>
                  {tab === 'conductores' ? 'Soy conductor' : 'Soy empresa'}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Steps */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }} className="steps-grid">
          {steps[active].map((step, i) => (
            <FadeIn key={`${active}-${i}`} delay={i * 80}>
              <div style={{
                background: '#fff',
                border: `1px solid ${C.border}`,
                borderRadius: 16,
                padding: '28px 24px',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: -14, left: 24,
                  width: 28, height: 28, borderRadius: '50%',
                  background: active === 'conductores' ? C.petrol : C.flame,
                  color: '#fff',
                  fontFamily: 'Manrope', fontWeight: 800, fontSize: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {i + 1}
                </div>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: active === 'conductores' ? 'rgba(0,71,97,0.08)' : 'rgba(255,106,19,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 16,
                }}>
                  <Icon name={step.icon} size={24} color={active === 'conductores' ? C.petrol : C.flame}/>
                </div>
                <h4 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 16, color: C.petrol, margin: '0 0 8px' }}>{step.title}</h4>
                <p style={{ fontFamily: 'Manrope', fontSize: 13, color: C.muted, lineHeight: 1.6, margin: 0 }}>{step.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <style>{`
          .steps-grid { grid-template-columns: repeat(4, 1fr); }
          @media (max-width: 900px) { .steps-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 520px) { .steps-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>
    </section>
  )
}

// ─── Benefits ─────────────────────────────────────────────────────────────────
function Benefits() {
  const driverBenefits = [
    { icon: 'dollar', title: 'Ingresos adicionales', desc: 'Gana dinero con tu vehículo sin cambiar tu rutina ni horarios.' },
    { icon: 'map', title: 'Tus rutas, tu tiempo', desc: 'No modificas tus recorridos habituales. Tú decides cuándo y cómo.' },
    { icon: 'shield', title: 'Pagos transparentes', desc: 'Cada peso que generas es visible y auditable en tiempo real desde la plataforma.' },
    { icon: 'phone', title: 'Todo desde la app', desc: 'Gestiona campañas, ingresos y perfil desde una sola aplicación móvil.' },
  ]

  const bizBenefits = [
    { icon: 'trending', title: 'Cualquier presupuesto', desc: 'Campañas adaptadas al tamaño de tu empresa. Sin mínimos inalcanzables.' },
    { icon: 'globe', title: 'Mayor presencia física', desc: 'Tu marca circula por las calles de tu ciudad todos los días.' },
    { icon: 'bar', title: 'Campañas medibles', desc: 'Datos reales de recorridos, zonas y exposición. No más suposiciones.' },
    { icon: 'award', title: 'Publicidad verificable', desc: 'Sistema GPS que confirma que tu campaña se está mostrando donde importa.' },
  ]

  return (
    <section id="benefits" style={{ background: C.bg, padding: '96px 24px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: C.flame, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Beneficios</span>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: C.petrol, margin: '12px 0 0', letterSpacing: '-0.02em' }}>
              Todos ganan con BrandiGO
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }} className="ben-grid">
          {/* Conductores */}
          <div>
            <FadeIn>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,71,97,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="car" size={20} color={C.petrol}/>
                </div>
                <h3 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 20, color: C.petrol, margin: 0 }}>Para conductores</h3>
              </div>
            </FadeIn>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {driverBenefits.map((b, i) => (
                <FadeIn key={b.title} delay={i * 80}>
                  <Card style={{ display: 'flex', gap: 16, padding: '20px 22px', alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,71,97,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name={b.icon} size={20} color={C.petrol}/>
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, color: C.text, margin: '0 0 4px' }}>{b.title}</h4>
                      <p style={{ fontFamily: 'Manrope', fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.55 }}>{b.desc}</p>
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* PYMES */}
          <div>
            <FadeIn>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,106,19,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="building" size={20} color={C.flame}/>
                </div>
                <h3 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 20, color: C.petrol, margin: 0 }}>Para empresas</h3>
              </div>
            </FadeIn>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {bizBenefits.map((b, i) => (
                <FadeIn key={b.title} delay={i * 80}>
                  <Card style={{ display: 'flex', gap: 16, padding: '20px 22px', alignItems: 'flex-start' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,106,19,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon name={b.icon} size={20} color={C.flame}/>
                    </div>
                    <div>
                      <h4 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, color: C.text, margin: '0 0 4px' }}>{b.title}</h4>
                      <p style={{ fontFamily: 'Manrope', fontSize: 13, color: C.muted, margin: 0, lineHeight: 1.55 }}>{b.desc}</p>
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          .ben-grid { grid-template-columns: 1fr 1fr; }
          @media (max-width: 768px) { .ben-grid { grid-template-columns: 1fr !important; gap: 40px !important; } }
        `}</style>
      </div>
    </section>
  )
}

// ─── Why BrandiGO ─────────────────────────────────────────────────────────────
function Why() {
  const reasons = [
    { icon: 'shield', title: 'Transparencia total', desc: 'Cada campaña, pago e impresión queda registrado y auditable en tiempo real.' },
    { icon: 'map', title: 'Seguimiento GPS real', desc: 'Tecnología de rastreo que verifica exactamente por dónde circula tu publicidad.' },
    { icon: 'eye', title: 'Publicidad verificable', desc: 'No más "te damos la palabra". Los datos confirman la exposición de tu marca.' },
    { icon: 'zap', title: 'Tecnología de punta', desc: 'Plataforma moderna que conecta campañas, conductores y resultados en un solo lugar.' },
    { icon: 'users', title: 'Comunidad verificada', desc: 'Conductores identificados y vehículos revisados para garantizar la calidad.' },
    { icon: 'clock', title: 'Simplicidad primero', desc: 'Registro en minutos, gestión intuitiva. Sin curva de aprendizaje.' },
  ]

  return (
    <section id="why" style={{ background: `linear-gradient(135deg, ${C.petrol} 0%, #003a52 100%)`, padding: '96px 24px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: C.flame, letterSpacing: '0.1em', textTransform: 'uppercase' }}>¿Por qué elegirnos?</span>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: '#fff', margin: '12px 0 16px', letterSpacing: '-0.02em' }}>
              ¿Por qué elegir BrandiGO?
            </h2>
            <p style={{ fontFamily: 'Manrope', fontSize: 17, color: 'rgba(255,255,255,0.65)', maxWidth: 560, margin: '0 auto', lineHeight: 1.65 }}>
              Construimos sobre la confianza. Cada decisión de diseño y tecnología apunta a que conductores y empresas se sientan seguros.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="why-grid">
          {reasons.map((r, i) => (
            <FadeIn key={r.title} delay={i * 70}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  borderRadius: 16,
                  padding: '28px 24px',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.10)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              >
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'rgba(255,106,19,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 18,
                }}>
                  <Icon name={r.icon} size={22} color={C.flame}/>
                </div>
                <h4 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 17, color: '#fff', margin: '0 0 8px' }}>{r.title}</h4>
                <p style={{ fontFamily: 'Manrope', fontSize: 14, color: 'rgba(255,255,255,0.60)', lineHeight: 1.6, margin: 0 }}>{r.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <style>{`
          .why-grid { grid-template-columns: repeat(3, 1fr); }
          @media (max-width: 900px) { .why-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 520px) { .why-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  const items = [
    { q: '¿Cuánto puede ganar un conductor con BrandiGO?', a: 'Los ingresos dependen de la cantidad de km recorridos y campañas activas. Estimamos entre $150.000 y $400.000 mensuales adicionales para conductores con rutas diarias regulares. Los montos exactos se confirmarán en el programa piloto.' },
    { q: '¿Cómo funcionan las campañas para empresas?', a: 'Las empresas crean una campaña definiendo el mensaje, zona geográfica y presupuesto. BrandiGO asigna conductores verificados y entrega reportes de recorrido y exposición en tiempo real.' },
    { q: '¿Cómo se instala la publicidad en el vehículo?', a: 'Se utilizan vinilos o materiales adhesivos de fácil instalación y remoción. BrandiGO coordina el proceso con proveedores aliados. El conductor recibe el material y asistencia para la instalación.' },
    { q: '¿La publicidad daña la pintura del vehículo?', a: 'No. Se utilizan materiales especialmente diseñados que no dañan la pintura ni el acabado del vehículo. Además, el proceso de remoción al finalizar la campaña es completamente seguro.' },
    { q: '¿Cómo se miden los recorridos y resultados?', a: 'A través de tecnología GPS integrada en la app del conductor, registramos en tiempo real cada kilómetro recorrido con la publicidad activa. Las empresas acceden a un dashboard con mapas de calor, zonas de mayor tráfico e impresiones estimadas.' },
    { q: '¿Quiénes pueden participar como conductores?', a: 'Cualquier persona con vehículo propio en buen estado que realice recorridos regulares en zonas urbanas. No es necesario ser taxi, Uber o transporte público. Basta con manejar en la ciudad.' },
  ]

  return (
    <section id="faq" style={{ background: C.surface, padding: '96px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: C.flame, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Preguntas frecuentes</span>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 40px)', color: C.petrol, margin: '12px 0 0', letterSpacing: '-0.02em' }}>
              Resolvemos tus dudas
            </h2>
          </div>
        </FadeIn>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {items.map((item, i) => (
            <FadeIn key={i} delay={i * 60}>
              <div
                style={{
                  background: '#fff',
                  border: `1px solid ${open === i ? C.petrol : C.border}`,
                  borderRadius: 14,
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                }}
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '20px 24px', background: 'none', border: 'none', cursor: 'pointer',
                    textAlign: 'left', gap: 16,
                  }}
                >
                  <span style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 15, color: C.text }}>{item.q}</span>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: open === i ? C.petrol : C.surface,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'background 0.2s',
                  }}>
                    <Icon name={open === i ? 'minus' : 'plus'} size={14} color={open === i ? '#fff' : C.petrol}/>
                  </div>
                </button>

                {open === i && (
                  <div style={{ padding: '0 24px 20px' }}>
                    <p style={{ fontFamily: 'Manrope', fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>{item.a}</p>
                  </div>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA / Form ───────────────────────────────────────────────────────────────
function CTA() {
  const [role, setRole] = useState<'conductor' | 'empresa'>('conductor')
  const [form, setForm] = useState({ name: '', email: '', why: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1400)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: 10,
    border: `1.5px solid ${C.border}`,
    fontFamily: 'Manrope',
    fontSize: 15,
    color: C.text,
    background: '#fff',
    outline: 'none',
    transition: 'border-color 0.18s',
    boxSizing: 'border-box',
  }

  return (
    <section id="cta" style={{ background: C.bg, padding: '96px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <FadeIn>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,106,19,0.08)',
              border: `1px solid rgba(255,106,19,0.2)`,
              borderRadius: 100, padding: '6px 16px', marginBottom: 20,
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.flame, animation: 'pulse 1.5s ease infinite' }}/>
              <span style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: C.flame }}>Cupos limitados</span>
            </div>
            <h2 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', color: C.petrol, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
              Únete al programa piloto
            </h2>
            <p style={{ fontFamily: 'Manrope', fontSize: 16, color: C.muted, lineHeight: 1.65 }}>
              Sé de los primeros en probar BrandiGO. Sin costo, sin compromisos. Solo la oportunidad de ser parte de algo nuevo.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          {submitted ? (
            <div style={{
              background: C.surface,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: '48px 40px',
              textAlign: 'center',
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: 'rgba(0,71,97,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <Icon name="check" size={32} color={C.petrol}/>
              </div>
              <h3 style={{ fontFamily: 'Manrope', fontWeight: 800, fontSize: 24, color: C.petrol, margin: '0 0 12px' }}>¡Estás dentro!</h3>
              <p style={{ fontFamily: 'Manrope', fontSize: 15, color: C.muted, lineHeight: 1.6 }}>
                Recibimos tu solicitud. Nos pondremos en contacto contigo pronto con los próximos pasos del programa piloto.
              </p>
            </div>
          ) : (
            <div style={{
              background: '#fff',
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: '40px',
              boxShadow: '0 4px 32px rgba(0,71,97,0.07)',
            }}>
              {/* Role selector */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 28 }}>
                {(['conductor', 'empresa'] as const).map(r => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    style={{
                      flex: 1, padding: '12px',
                      borderRadius: 10,
                      border: `2px solid ${role === r ? (r === 'conductor' ? C.petrol : C.flame) : C.border}`,
                      background: role === r ? (r === 'conductor' ? 'rgba(0,71,97,0.06)' : 'rgba(255,106,19,0.06)') : '#fff',
                      cursor: 'pointer',
                      fontFamily: 'Manrope', fontWeight: 700, fontSize: 14,
                      color: role === r ? (r === 'conductor' ? C.petrol : C.flame) : C.muted,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      transition: 'all 0.18s',
                    }}
                  >
                    <Icon name={r === 'conductor' ? 'car' : 'building'} size={16} color={role === r ? (r === 'conductor' ? C.petrol : C.flame) : C.muted}/>
                    {r === 'conductor' ? 'Soy conductor' : 'Soy empresa'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: C.text, display: 'block', marginBottom: 6 }}>
                    Nombre completo *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Tu nombre"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = C.petrol)}
                    onBlur={e => (e.target.style.borderColor = C.border)}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: C.text, display: 'block', marginBottom: 6 }}>
                    Correo electrónico *
                  </label>
                  <input
                    required
                    type="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="tu@correo.com"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = C.petrol)}
                    onBlur={e => (e.target.style.borderColor = C.border)}
                  />
                </div>

                <div>
                  <label style={{ fontFamily: 'Manrope', fontWeight: 600, fontSize: 13, color: C.text, display: 'block', marginBottom: 6 }}>
                    ¿Por qué te interesa participar? *
                  </label>
                  <textarea
                    required
                    value={form.why}
                    onChange={e => setForm({ ...form, why: e.target.value })}
                    placeholder="Cuéntanos brevemente por qué quieres ser parte del programa piloto..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical', minHeight: 88 }}
                    onFocus={e => (e.target.style.borderColor = C.petrol)}
                    onBlur={e => (e.target.style.borderColor = C.border)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? '#ccc' : C.flame,
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    padding: '16px',
                    fontFamily: 'Manrope',
                    fontWeight: 800,
                    fontSize: 16,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.18s',
                    letterSpacing: '0.01em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    marginTop: 4,
                  }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.background = '#e55a0a')}
                  onMouseLeave={e => !loading && (e.currentTarget.style.background = C.flame)}
                >
                  {loading ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" style={{ animation: 'spin 0.8s linear infinite' }}/></svg>
                      Enviando...
                    </>
                  ) : (
                    <>Quiero unirme al programa piloto <Icon name="arrow" size={18} color="#fff"/></>
                  )}
                </button>

                <p style={{ fontFamily: 'Manrope', fontSize: 12, color: C.muted, textAlign: 'center', margin: 0 }}>
                  Al registrarte aceptas nuestra{' '}
                  <a href="#footer" style={{ color: C.petrol, textDecoration: 'none', fontWeight: 600 }}>Política de Privacidad</a>.
                  Sin spam, sin compromisos.
                </p>
              </form>
            </div>
          )}
        </FadeIn>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer id="footer" style={{ background: '#111827', padding: '64px 24px 32px' }}>
      <div style={{ maxWidth: 1180, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 48, marginBottom: 48 }} className="footer-grid">
          {/* Brand */}
          <div>
            <Logo size="md" />
            <p style={{ fontFamily: 'Manrope', fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginTop: 16, maxWidth: 300 }}>
              Transformando vehículos en espacios publicitarios móviles. Una plataforma que conecta conductores y empresas para beneficio mutuo.
            </p>
            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              {[
                { icon: 'instagram', href: '#' },
              ].map(s => (
                <a
                  key={s.icon}
                  href={s.href}
                  style={{
                    width: 36, height: 36, borderRadius: 8,
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.18s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,106,19,0.25)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                >
                  <Icon name={s.icon} size={16} color="rgba(255,255,255,0.7)"/>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h5 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 16px' }}>Plataforma</h5>
            {['Cómo funciona', 'Para conductores', 'Para empresas', 'Programa piloto'].map(l => (
              <div key={l} style={{ marginBottom: 10 }}>
                <a href="#cta" style={{ fontFamily: 'Manrope', fontSize: 14, color: 'rgba(255,255,255,0.65)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
                >
                  {l}
                </a>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h5 style={{ fontFamily: 'Manrope', fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 16px' }}>Contacto</h5>
            {[
              { icon: 'mail', text: 'urbanmotion@brandigo.com' },
              { icon: 'globe', text: 'Guayaquil, Ecuador' },
            ].map(c => (
              <div key={c.text} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <Icon name={c.icon} size={15} color="rgba(255,106,19,0.85)"/>
                <span style={{ fontFamily: 'Manrope', fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>{c.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.10)',
          paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontFamily: 'Manrope', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            © 2025 BrandiGO · Guayaquil, Ecuador. Todos los derechos reservados.
          </span>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Política de privacidad', 'Términos y condiciones'].map(l => (
              <a key={l} href="#" style={{ fontFamily: 'Manrope', fontSize: 13, color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .footer-grid { grid-template-columns: 2fr 1fr 1fr; }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: 1fr !important; gap: 32px !important; } }
      `}</style>
    </footer>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <div style={{ fontFamily: 'Manrope, Inter, sans-serif', overflowX: 'hidden' }}>
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Benefits />
      <Why />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  )
}
