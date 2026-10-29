import { useEffect, useRef, useState, type ReactNode } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Box, Globe2, Languages, Mail, Menu, Pause, Play, ScanLine, X } from 'lucide-react'
import { Link, useLocation } from 'react-router'
import RnaScene from './RnaScene'
import CalligraphyGlyph, { type CalligraphyCharacter } from './CalligraphyGlyph'
import { getRnaStructure, type RnaMode } from '../data/rna'
import { useLanguage } from '../i18n'

const navigation = [
  { to: '/research', key: 'research', label: '研究', en: 'Research' },
  { to: '/publications', key: 'publications', label: '论文', en: 'Publications' },
  { to: '/notes', key: 'notes', label: '随笔', en: 'Notes' },
  { to: '/about', key: 'about', label: '关于', en: 'About' },
]

export function SiteHeader({ mark = '蔡' }: { mark?: CalligraphyCharacter }) {
  const { language, pick, toggleLanguage } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const activeKey = location.pathname.startsWith('/posts') ? 'notes' : location.pathname.slice(1)

  useEffect(() => {
    if (!menuOpen) return
    closeButtonRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/" aria-label={pick('蔡祎涛首页', 'Cai Yitao home')}>
          <span className="brand-mark" data-character={mark} aria-hidden="true"><CalligraphyGlyph character={mark} /></span>
          <span className="brand-copy"><strong>CAI YITAO</strong><small>COMPUTATIONAL LIFE SCIENCE</small></span>
        </Link>
        <nav className="desktop-nav" aria-label={pick('主导航', 'Main navigation')}>
          {navigation.map((item) => (
            <Link key={item.to} to={item.to} className={activeKey === item.key ? 'active' : ''} aria-current={activeKey === item.key ? 'page' : undefined}>
              {pick(item.label, item.en)}{language === 'zh' && <span>{item.en}</span>}
            </Link>
          ))}
        </nav>
        <button className="language-toggle" type="button" onClick={toggleLanguage} aria-label={language === 'zh' ? 'Switch to English' : '切换为中文'} title={language === 'zh' ? 'Switch to English' : '切换为中文'}>
          <Languages size={15} /><span>{language === 'zh' ? 'EN' : '中'}</span>
        </button>
        <a className="header-contact" href="mailto:yitao.cai@univie.ac.at">{pick('联系我', 'Contact')} <ArrowUpRight size={16} /></a>
        <button className="menu-button" type="button" onClick={() => setMenuOpen(true)} aria-label={pick('打开导航菜单', 'Open navigation menu')} aria-expanded={menuOpen}>
          <Menu size={22} />
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-menu-layer" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setMenuOpen(false) }}>
          <nav className="mobile-menu" aria-label={pick('移动端导航', 'Mobile navigation')}>
            <div className="mobile-menu-top"><span>{pick('导航 · MENU', 'MENU')}</span><button ref={closeButtonRef} type="button" onClick={() => setMenuOpen(false)} aria-label={pick('关闭导航菜单', 'Close navigation menu')}><X size={22} /></button></div>
            {navigation.map((item) => (
              <Link key={item.to} to={item.to} className={activeKey === item.key ? 'active' : ''} onClick={() => setMenuOpen(false)}>
                <span>{pick(item.label, item.en)}</span>{language === 'zh' && <small>{item.en}</small>}<ArrowRight size={20} />
              </Link>
            ))}
            <a href="mailto:yitao.cai@univie.ac.at"><span>{pick('联系我', 'Contact')}</span><small>Email</small><Mail size={20} /></a>
          </nav>
        </div>
      )}
    </>
  )
}

export function SiteFooter() {
  const { pick } = useLanguage()
  return (
    <footer className="site-footer">
      <div className="page-width"><span>© 2026 蔡祎涛 · Cai Yitao</span><a href="#top">{pick('回到顶部', 'Back to top')} <ArrowUpRight size={14} /></a></div>
    </footer>
  )
}

interface PageHeroProps {
  mode: RnaMode
  eyebrow: string
  title: ReactNode
  english?: ReactNode
  description?: ReactNode
  initialView?: '2d' | '3d' | 'orb'
  children?: ReactNode
}

export function PageHero({ mode, eyebrow, title, english, description, initialView = '3d', children }: PageHeroProps) {
  const { pick } = useLanguage()
  const [view, setView] = useState<'2d' | '3d' | 'orb'>(initialView)
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const structure = getRnaStructure(mode)

  return (
    <section className="page-hero" id="top">
      <RnaScene mode={mode} view={view} playing={playing} variant="page" />
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />
      <div className="page-hero-content page-width">
        <Link className="page-back" to="/"><ArrowLeft size={15} /> {pick('首页', 'Home')} <span>HOME</span></Link>
        <p className="page-hero-kicker"><span className="status-dot" />{eyebrow}</p>
        <h1>{title}</h1>
        {english && <p className="page-hero-english">{english}</p>}
        {description && <p className="page-hero-description">{description}</p>}
        {children}
      </div>
      <div className="page-hero-panel">
        <div className="page-structure-name"><span className="live-label"><i /> LIVE STRUCTURE</span><strong>{structure.name}</strong><small>{structure.sequence.length} NT · {structure.pairs.length} BP</small></div>
        <div className="view-controls" aria-label={pick('RNA 背景控制', 'RNA background controls')}>
          <button type="button" className={view === '2d' ? 'active' : ''} onClick={() => setView('2d')} aria-label={pick('切换为二维视图', 'Switch to 2D view')} aria-pressed={view === '2d'}><ScanLine size={16} /><span>2D</span></button>
          <button type="button" className={view === '3d' ? 'active' : ''} onClick={() => setView('3d')} aria-label={pick('切换为三维视图', 'Switch to 3D view')} aria-pressed={view === '3d'}><Box size={16} /><span>3D</span></button>
          <button type="button" className={view === 'orb' ? 'active' : ''} onClick={() => setView('orb')} aria-label={pick('切换为三维球面投影', 'Switch to spherical projection')} aria-pressed={view === 'orb'}><Globe2 size={16} /><span>{pick('球面', 'Orb')}</span></button>
          <button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? pick('暂停 RNA 动画', 'Pause RNA animation') : pick('播放 RNA 动画', 'Play RNA animation')} aria-pressed={!playing}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
        </div>
      </div>
    </section>
  )
}

interface StandardPageProps extends PageHeroProps {
  mark?: CalligraphyCharacter
}

export function StandardPage({ mark, children, ...heroProps }: StandardPageProps) {
  return (
    <div className="site-shell">
      <SiteHeader mark={mark} />
      <main>
        <PageHero {...heroProps} />
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
