import { ArrowUpRight, Github, Mail } from 'lucide-react'
import { Link } from 'react-router'
import { BibtexDetails, NotesGrid } from '../components/ContentBlocks'
import CalligraphyGlyph from '../components/CalligraphyGlyph'
import { StandardPage } from '../components/SiteChrome'
import { researchAreas } from '../data/site'
import { useLanguage } from '../i18n'

export function ResearchPage() {
  const { pick } = useLanguage()
  return (
    <StandardPage
      mark="祎"
      mode="zigzag"
      eyebrow={pick('RESEARCH · 研究方向', 'RESEARCH')}
      title={pick(<>在生命系统中，<br />寻找<span>可计算的结构。</span></>, <>Finding computable<br /><span>structure in living systems.</span></>)}
      english="From sequences to structures, from structures to function."
      description={pick('我的研究位于人工智能、基因电路与 RNA 的交叉点，关注如何从复杂生物数据中恢复可解释、可验证的调控逻辑。', 'My research sits at the intersection of AI, genetic circuits, and RNA, recovering interpretable and testable regulatory logic from complex biological data.')}
    >
      <section className="research-section light-section subpage-section">
        <div className="page-width">
          <div className="section-intro">
            <p className="section-label">{pick('FOUR CONNECTED DIRECTIONS · 四个方向', 'FOUR CONNECTED DIRECTIONS')}</p>
            <h2>{pick(<>四个方向，<br />同一条<span>研究主线。</span></>, <>Four directions,<br /><span>one research thread.</span></>)}</h2>
            <p>{pick('图学习、结构生物学、表示学习与合成生物学在这里相互连接。', 'My work connects graph learning, structural biology, representation learning, and synthetic biology.')}</p>
          </div>
          <div className="research-list">
            {researchAreas.map((area, index) => {
              const Icon = area.icon
              return (
                <article className="research-row" key={area.title}>
                  <div className="research-icon"><Icon size={24} strokeWidth={1.5} /></div>
                  <div><span className="research-number">0{index + 1}</span><h3>{pick(area.title, area.titleEn)}</h3><p className="research-english">{area.english}</p></div>
                  <p className="research-description">{pick(area.description, area.descriptionEn)}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>
    </StandardPage>
  )
}

export function PublicationsPage() {
  const { pick } = useLanguage()
  return (
    <StandardPage
      mark="祎"
      mode="kyurem5"
      eyebrow={pick('PUBLICATIONS · 学术成果', 'PUBLICATIONS')}
      title={pick(<>让模型不仅回答<br /><span>“是否”，也回答“如何”。</span></>, <>Models that answer not only<br /><span>“whether,” but “how.”</span></>)}
      english="Selected work in graph learning and single-cell genomics."
      description={pick('从图结构学习基因之间的调控关系，并进一步识别激活与抑制的方向性。', 'Learning regulatory relationships between genes from graph structure and identifying whether they activate or repress.')}
    >
      <section className="publication-section subpage-section">
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
              <Link to="/posts/scgrip">{pick('阅读论文笔记', 'Read the paper note')} <ArrowUpRight size={17} /></Link>
              <a href="https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=Sc-GRIP%20Gene%20Interaction%20Polarity" target="_blank" rel="noreferrer">IEEE Xplore <ArrowUpRight size={17} /></a>
              <a href="https://dblp.org/search?q=Sc-GRIP+Gene+Interaction+Polarity" target="_blank" rel="noreferrer">DBLP <ArrowUpRight size={17} /></a>
            </div>
            <BibtexDetails id="scgrip-bibtex" />
          </article>
        </div>
      </section>
    </StandardPage>
  )
}

export function NotesPage() {
  const { pick } = useLanguage()
  return (
    <StandardPage
      mark="祎"
      mode="gladius"
      eyebrow={pick('FIELD NOTES · 随笔', 'FIELD NOTES')}
      title={pick(<>把复杂问题，<br />做成<span>可以探索的页面。</span></>, <>Complex ideas,<br /><span>made explorable.</span></>)}
      english="Interactive notes on algorithms, representations, and life."
      description={pick('算法不应只停留在公式里。这里的每篇笔记都保留一个可以亲手调整、观察与验证的互动现场。', 'Algorithms should not stay trapped in equations. Every note here includes a space to adjust, observe, and test the ideas yourself.')}
    >
      <section className="notes-section light-section subpage-section">
        <div className="page-width">
          <div className="notes-heading">
            <div><p className="section-label">{pick('THREE INTERACTIVE NOTES · 三篇互动笔记', 'THREE INTERACTIVE NOTES')}</p><h2>{pick(<>从图网络到<br />RNA 折叠。</>, <>From graph networks<br />to RNA folding.</>)}</h2></div>
            <p>{pick('选择一篇笔记，进入统一的阅读与互动页面。', 'Select a note to read, play, and explore.')}</p>
          </div>
          <NotesGrid />
        </div>
      </section>
    </StandardPage>
  )
}

export function AboutPage() {
  const { pick } = useLanguage()
  return (
    <StandardPage
      mark="祎"
      mode="clover"
      initialView="orb"
      eyebrow={pick('ABOUT · 自叙小笺', 'ABOUT')}
      title={pick(<>在计算与生命之间，<br /><span>保持好奇。</span></>, <>Curious across computing<br /><span>and living systems.</span></>)}
      english="Curiosity across computer science and living systems."
      description={pick('我是蔡祎涛，维也纳大学博士生，关注交叉研究如何帮助理解疾病、延长健康寿命。', 'I am Yitao Cai, a PhD student at the University of Vienna interested in how interdisciplinary research can help us understand disease and extend healthy lifespan.')}
    >
      <section className="about-section subpage-section">
        <div className="page-width about-layout">
          <div className="about-monogram" data-character="祎" aria-hidden="true"><CalligraphyGlyph character="祎" /></div>
          <div className="about-copy">
            <p className="section-label dark-label">CAI YITAO · VIENNA</p>
            <h2>{pick(<>跨越边界，<br />也保持问题的本质。</>, <>Crossing boundaries,<br />keeping the question intact.</>)}</h2>
            <p>{pick('我是蔡祎涛（Cai Yitao），维也纳大学计算机科学系与理论生物化学研究所的在读博士生。我关注系统与合成生物学、深度学习与强化学习、图学习与单细胞基因组学，以及受人脑启发的智能。', 'I am Yitao Cai, a PhD student in the Department of Computer Science and the Institute of Theoretical Biochemistry at the University of Vienna. My interests include systems and synthetic biology, deep and reinforcement learning, graph learning, single-cell genomics, and brain-inspired intelligence.')}</p>
            <p className="about-english">{pick('我希望通过交叉研究理解疾病，并为延长健康寿命探索新的可能。', 'I care about how interdisciplinary research can help us understand and treat disease and extend healthy lifespan.')}</p>
            <div className="contact-links">
              <a href="mailto:yitao.cai@univie.ac.at"><Mail size={19} /> yitao.cai@univie.ac.at <ArrowUpRight size={16} /></a>
              <a href="https://github.com/CaiYitao" target="_blank" rel="noreferrer"><Github size={19} /> GitHub <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </div>
      </section>
    </StandardPage>
  )
}
