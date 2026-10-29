import { useState } from 'react'
import { ArrowDown, ArrowUpRight, Box, ChevronDown, Github, Globe2, Mail, Pause, Play, ScanLine } from 'lucide-react'
import { Link } from 'react-router'
import RnaScene from '../components/RnaScene'
import CalligraphyGlyph from '../components/CalligraphyGlyph'
import { BibtexDetails, NotesGrid } from '../components/ContentBlocks'
import { SiteFooter, SiteHeader } from '../components/SiteChrome'
import { getRnaStructure, RNA_STRUCTURE_OPTIONS, type RnaMode } from '../data/rna'
import { researchAreas } from '../data/site'
import { useLanguage } from '../i18n'
import '../App.css'

export default function Home() {
  const { pick } = useLanguage()
  const [mode, setMode] = useState<RnaMode>('shooting-star')
  const [view, setView] = useState<'2d' | '3d' | 'orb'>('3d')
  const [playing, setPlaying] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const structure = getRnaStructure(mode)

  return (
    <div className="site-shell">
      <SiteHeader mark="蔡" />
      <main>
        <section className="hero" id="top">
          <RnaScene mode={mode} view={view} playing={playing} />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-glow" aria-hidden="true" />
          <div className="hero-content page-width">
            <div className="hero-copy">
              <div className="hero-kicker"><span className="status-dot" /> AI × GENETIC CIRCUITS × RNA</div>
              <h1>{pick(<>让生命结构，<br />成为<span>可计算的语言。</span></>, <>Making life’s structures<br /><span>computable.</span></>)}</h1>
              <p className="hero-english">{pick(<>Reading the language of life<br />through structure and intelligence.</>, <>Reading the language of life through<br />structure and intelligence.</>)}</p>
              <p className="hero-intro">{pick('你好，我是蔡祎涛，维也纳大学博士生。我在人工智能、基因电路与 RNA 的交叉点，探索从序列到结构、从结构到功能的计算路径。', 'I am Yitao Cai, a PhD student at the University of Vienna. At the intersection of AI, genetic circuits, and RNA, I explore computational paths from sequence to structure and from structure to function.')}</p>
              <div className="hero-actions">
                <Link className="primary-action" to="/research">{pick('探索我的研究', 'Explore my research')} <ArrowDown size={18} /></Link>
                <Link className="text-action" to="/publications">{pick('阅读 ICDM 2025 论文', 'Read the ICDM 2025 paper')} <ArrowUpRight size={17} /></Link>
              </div>
            </div>
          </div>

          <div className="structure-console">
            <div className="console-heading">
              <div><span className="live-label"><i /> LIVE STRUCTURE</span><strong>{structure.name}</strong></div>
              <div className="structure-metrics"><span>{structure.sequence.length} NT</span><span>{structure.pairs.length} BP</span></div>
            </div>
            <div className="structure-select">
              <select value={mode} onChange={(event) => setMode(event.target.value as RnaMode)} aria-label={pick('选择 RNA 结构', 'Choose an RNA structure')}>
                {RNA_STRUCTURE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </div>
            <div className="console-footer">
              <a href={structure.sourceUrl} target="_blank" rel="noreferrer">{structure.source} <ArrowUpRight size={12} /></a>
              <div className="view-controls">
                <button type="button" className={view === '2d' ? 'active' : ''} onClick={() => setView('2d')} aria-label={pick('切换为二维视图', 'Switch to 2D view')} aria-pressed={view === '2d'}><ScanLine size={16} /><span>2D</span></button>
                <button type="button" className={view === '3d' ? 'active' : ''} onClick={() => setView('3d')} aria-label={pick('切换为三维视图', 'Switch to 3D view')} aria-pressed={view === '3d'}><Box size={16} /><span>3D</span></button>
                <button type="button" className={view === 'orb' ? 'active' : ''} onClick={() => setView('orb')} aria-label={pick('切换为三维球面投影', 'Switch to spherical projection')} aria-pressed={view === 'orb'}><Globe2 size={16} /><span>{pick('球面', 'Orb')}</span></button>
                <button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? pick('暂停 RNA 动画', 'Pause RNA animation') : pick('播放 RNA 动画', 'Play RNA animation')} aria-pressed={!playing}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
              </div>
            </div>
          </div>
          <div className="scroll-cue" aria-hidden="true"><span>SCROLL TO UNFOLD</span><i /></div>
        </section>

        <section className="research-section light-section" id="research">
          <div className="page-width">
            <div className="section-intro">
              <p className="section-label">{pick('RESEARCH · 研究方向', 'RESEARCH')}</p>
              <h2>{pick(<>从序列到功能，<br />寻找生命系统的<span>隐藏结构。</span></>, <>From sequence to function,<br />revealing life’s <span>hidden structure.</span></>)}</h2>
              <p>{pick('我的研究连接深度学习、基因电路与 RNA，构建能够揭示生物系统组织方式的计算模型。', 'My work sits at the intersection of deep learning, genetic circuits, and RNA — building computational models that reveal how biological systems are organized.')}</p>
            </div>
            <div className="research-list">
              {researchAreas.map((area) => {
                const Icon = area.icon
                return (
                  <article className="research-row" key={area.title}>
                    <div className="research-icon"><Icon size={24} strokeWidth={1.5} /></div>
                    <div><h3>{pick(area.title, area.titleEn)}</h3><p className="research-english">{area.english}</p></div>
                    <p className="research-description">{pick(area.description, area.descriptionEn)}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="publication-section" id="publications">
          <div className="page-width publication-layout">
            <div className="publication-aside">
              <p className="section-label dark-label">{pick('SELECTED PUBLICATION · 代表论文', 'SELECTED PUBLICATION')}</p>
              <div className="venue-stamp"><span>IEEE</span><strong>ICDM<br />2025</strong><small>DATA MINING</small></div>
            </div>
            <article className="publication-main">
              <h2>Sc-GRIP: a Graph Convolutional Approach to Infer Gene Interaction Polarity from Single-Cell Data</h2>
              <p className="authors">Carolina E. Atria · <strong>Yitao Cai</strong> · Pascal Weber · Anna Beer · Nils Kriege · Christian Böhm · Roger Revilla-i-Domingo · Claudia Plant</p>
              <p className="publication-abstract">{pick(<>Sc-GRIP 将单细胞基因调控网络推断建模为图卷积学习问题，不仅判断基因是否互作，还进一步推断互作的<strong>极性</strong>——激活或抑制。</>, <>Sc-GRIP frames gene-regulatory network inference as a graph-convolutional learning problem, predicting not only whether genes interact but also the <strong>polarity</strong> of that interaction — activation or repression.</>)}</p>
              <div className="publication-links">
                <a href="https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=Sc-GRIP%20Gene%20Interaction%20Polarity" target="_blank" rel="noreferrer">IEEE Xplore <ArrowUpRight size={17} /></a>
                <a href="https://dblp.org/search?q=Sc-GRIP+Gene+Interaction+Polarity" target="_blank" rel="noreferrer">DBLP <ArrowUpRight size={17} /></a>
                <a href="#scgrip-bibtex">BibTeX <ArrowDown size={17} /></a>
              </div>
              <BibtexDetails id="scgrip-bibtex" />
            </article>
          </div>
        </section>

        <section className="notes-section light-section" id="notes">
          <div className="page-width">
            <div className="notes-heading">
              <div><p className="section-label">{pick('FIELD NOTES · 随笔', 'FIELD NOTES')}</p><h2>{pick(<>把复杂问题，<br />做成可以亲手探索的页面。</>, <>Complex ideas,<br />made hands-on.</>)}</h2></div>
              <p>{pick(<>算法、表示学习与计算生物学笔记。<br />每一篇都可以亲手调整与验证。</>, <>Notes on algorithms, representation learning, and computational biology.<br />Read, adjust, and explore.</>)}</p>
            </div>
            <NotesGrid />
          </div>
        </section>

        <section className="about-section" id="about">
          <div className="page-width about-layout">
            <div className="about-monogram" data-character="蔡" aria-hidden="true"><CalligraphyGlyph character="蔡" /></div>
            <div className="about-copy">
              <p className="section-label dark-label">{pick('ABOUT · 自叙小笺', 'ABOUT')}</p>
              <h2>{pick(<>在计算与生命之间，<br />保持好奇。</>, <>Curious across computing<br />and living systems.</>)}</h2>
              <p>{pick('我是蔡祎涛（Cai Yitao），维也纳大学计算机科学系与理论生物化学研究所的在读博士生。我关注系统与合成生物学、深度学习与强化学习、图学习与单细胞基因组学，以及受人脑启发的智能。', 'I am Yitao Cai, a PhD student in the Department of Computer Science and the Institute of Theoretical Biochemistry at the University of Vienna. My interests include systems and synthetic biology, deep and reinforcement learning, graph learning, single-cell genomics, and brain-inspired intelligence.')}</p>
              <p className="about-english">{pick('我希望通过交叉研究理解疾病，并为延长健康寿命探索新的可能。', 'I care about how interdisciplinary research can help us understand and treat disease and extend healthy lifespan.')}</p>
              <div className="contact-links">
                <a href="mailto:yitao.cai@univie.ac.at"><Mail size={19} /> yitao.cai@univie.ac.at <ArrowUpRight size={16} /></a>
                <a href="https://github.com/CaiYitao" target="_blank" rel="noreferrer"><Github size={19} /> GitHub <ArrowUpRight size={16} /></a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
