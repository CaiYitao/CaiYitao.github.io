import { useEffect } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Link, Navigate, Route, Routes, useLocation } from 'react-router'
import Home from './pages/Home'
import { AboutPage, NotesPage, PublicationsPage, ResearchPage } from './pages/SectionPages'
import { NussinovArticlePage, RepresentationArticlePage, ScGripArticlePage } from './pages/ArticlePages'
import { StandardPage } from './components/SiteChrome'
import { useLanguage } from './i18n'

const pageTitles: Record<string, [string, string]> = {
  '/': ['蔡祎涛 · Computational Life Science', 'Yitao Cai · Computational Life Science'],
  '/research': ['研究方向 · 蔡祎涛', 'Research · Yitao Cai'],
  '/publications': ['学术成果 · 蔡祎涛', 'Publications · Yitao Cai'],
  '/notes': ['互动随笔 · 蔡祎涛', 'Interactive Notes · Yitao Cai'],
  '/about': ['关于 · 蔡祎涛', 'About · Yitao Cai'],
  '/posts/scgrip': ['Sc-GRIP · 蔡祎涛', 'Sc-GRIP · Yitao Cai'],
  '/posts/deep-representation-ch2': ['线性与独立结构 · 蔡祎涛', 'Linear and Independent Structure · Yitao Cai'],
  '/posts/nussinov': ['Nussinov–Jacobson RNA 折叠 · 蔡祎涛', 'Nussinov–Jacobson RNA Folding · Yitao Cai'],
}

function RouteEffects() {
  const location = useLocation()
  const { language } = useLanguage()
  useEffect(() => {
    window.scrollTo(0, 0)
    const titles = pageTitles[location.pathname] || pageTitles['/']
    document.title = titles[language === 'zh' ? 0 : 1]
  }, [location.pathname, language])
  return null
}

function NotFoundPage() {
  const { pick } = useLanguage()
  return (
    <StandardPage mark="祎" mode="shooting-star" eyebrow="404 · PAGE NOT FOUND" title={pick(<>这条序列，<br /><span>尚未折叠成页面。</span></>, <>This sequence<br /><span>has not folded into a page.</span></>)} english="The page you requested does not exist.">
      <section className="not-found light-section"><div className="page-width"><h2>{pick('回到主页，继续探索。', 'Return home and keep exploring.')}</h2><Link className="primary-action" to="/">{pick('返回首页', 'Back to home')} <ArrowUpRight size={17} /></Link></div></section>
    </StandardPage>
  )
}

export default function App() {
  return (
    <>
      <RouteEffects />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/posts/scgrip" element={<ScGripArticlePage />} />
        <Route path="/posts/deep-representation-ch2" element={<RepresentationArticlePage />} />
        <Route path="/posts/nussinov" element={<NussinovArticlePage />} />
        <Route path="/about.html" element={<Navigate to="/about" replace />} />
        <Route path="/publications.html" element={<Navigate to="/publications" replace />} />
        <Route path="/blog.html" element={<Navigate to="/notes" replace />} />
        <Route path="/posts/2025_icdm_scgrip/*" element={<Navigate to="/posts/scgrip" replace />} />
        <Route path="/posts/deep-representation-ch2/*" element={<Navigate to="/posts/deep-representation-ch2" replace />} />
        <Route path="/posts/nussinov/*" element={<Navigate to="/posts/nussinov" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
