import { ArrowUpRight } from 'lucide-react'
import { BibtexDetails, InteractiveFrame } from '../components/ContentBlocks'
import ScGripDemo from '../components/ScGripDemo'
import { StandardPage } from '../components/SiteChrome'
import { useLanguage } from '../i18n'

export function ScGripArticlePage() {
  const { pick } = useLanguage()
  return (
    <StandardPage
      mark="涛"
      mode="thunderbolt"
      eyebrow="FIELD NOTE · IEEE ICDM 2025"
      title={pick(<>Sc-GRIP：从单细胞数据<br />推断<span>基因互作极性。</span></>, <>Sc-GRIP: inferring gene<br /><span>interaction polarity.</span></>)}
      english="A graph-convolutional approach to infer activation and repression."
      description={pick('Carolina E. Atria、蔡祎涛等 · 2025.11.12 · 图学习 / 单细胞', 'Carolina E. Atria, Yitao Cai et al. · 2025.11.12 · Graph Learning / Single-cell')}
    >
      <article className="article-section light-section">
        <div className="page-width article-layout">
          <aside className="article-aside">
            <p>IN THIS NOTE</p>
            <a href="#summary">{pick('摘要', 'Summary')} · Abstract</a>
            <a href="#problem">{pick('问题', 'Problem')} · Problem</a>
            <a href="#method">{pick('方法', 'Method')} · Method</a>
            <a href="#interactive">{pick('互动', 'Interactive')} · Interactive</a>
            <a href="#paper">{pick('全文', 'Paper')} · Paper</a>
          </aside>
          <div className="article-content">
            <section id="summary">
              <p className="section-label">{pick('01 · 摘要 / ABSTRACT', '01 · ABSTRACT')}</p>
              <h2>{pick(<>不仅知道哪些基因相关，<br />还要理解它们如何调控。</>, <>Beyond whether genes interact,<br />understand how they regulate.</>)}</h2>
              <p>{pick('理解基因如何被调控，是众多生物学问题的核心。实验与计算方法已经能告诉我们「哪些基因可能相互作用」，但要判断这种作用的极性——究竟是激活还是抑制——却非常困难。我们提出 Sc-GRIP（Single-cell Gene Regulation Interaction Polarity），一个图卷积框架，直接从单细胞 RNA 数据中推断转录因子（TF）与目标基因之间互作的方向性。', 'Understanding how genes are regulated is central to many biological questions. Experiments and computational methods can suggest which genes may interact, but determining the polarity of those interactions — activation or repression — remains difficult. We introduce Sc-GRIP (Single-cell Gene Regulation Interaction Polarity), a graph-convolutional framework that infers the direction and sign of transcription-factor–target interactions directly from single-cell RNA data.')}</p>
              <p>{pick('Sc-GRIP 把基因表达谱与基因互作图结合起来，学习基因的隐表示，再用一个双线性解码器预测调控极性。该方法可扩展、且可针对特定细胞类型，无需依赖物种特异的先验注释或大量实验验证。', 'Sc-GRIP combines gene-expression profiles with gene-interaction graphs, learns latent gene representations, and predicts regulatory polarity with a bilinear decoder. The method is scalable and cell-type-specific, without requiring species-specific prior annotations or extensive experimental validation.')}</p>
              <blockquote className="article-english">Understanding how genes are regulated is fundamental to many biological questions. Sc-GRIP combines gene-expression profiles with gene-interaction graphs, learns latent gene representations, and predicts regulatory polarity with a bilinear decoder.</blockquote>
            </section>

            <section id="problem">
              <p className="section-label">{pick('02 · 问题 / THE PROBLEM', '02 · THE PROBLEM')}</p>
              <h2>{pick(<>图的结构已知，<br />边上的符号仍待推断。</>, <>The graph is known.<br />Its edge signs are not.</>)}</h2>
              <p>{pick('转录因子（TF）是一类特殊蛋白，它们结合到 DNA 的特定序列上，决定目标基因被「打开」还是「关闭」。给定一张已知的 TF–目标基因互作图，我们可以观察连接，但边上的符号与权重却随细胞类型与状态而变，难以推断。', 'Transcription factors (TFs) are specialized proteins that bind particular DNA sequences and determine whether target genes are switched on or off. Given a known TF–target interaction graph, the connections are visible, but their signs and weights vary across cell types and states and remain difficult to infer.')}</p>
              <ol className="article-challenges">
                <li><span>01</span>{pick('建模潜在的调控结构。', 'Model the underlying regulatory structure.')}</li>
                <li><span>02</span>{pick('推断每条边的标签：激活或抑制。', 'Infer each edge label: activation or repression.')}</li>
                <li><span>03</span>{pick('对生物噪声与细胞异质性保持稳健。', 'Remain robust to biological noise and cellular heterogeneity.')}</li>
              </ol>
            </section>

            <section id="method">
              <p className="section-label">{pick('03 · 方法 / METHOD', '03 · METHOD')}</p>
              <h2>{pick(<>图卷积编码，<br />双线性解码。</>, <>Graph-convolutional encoding.<br />Bilinear decoding.</>)}</h2>
              <p>{pick('输入是高维、稀疏的基因表达矩阵与一个无符号的 TF–目标基因邻接矩阵。模型先通过图卷积层聚合邻居信息，学习基因的隐表示；随后用双线性解码器对每条边打分，分数的符号即对应「激活」或「抑制」。', 'The inputs are a high-dimensional, sparse gene-expression matrix and an unsigned TF–target adjacency matrix. Graph-convolutional layers aggregate neighborhood information to learn latent gene representations; a bilinear decoder then scores every edge, with the score sign indicating activation or repression.')}</p>
              <p>{pick('由于带标签的极性数据稀少且偏向研究充分的基因，方法采用自监督／弱监督的思路，使其能泛化到未见过的转录因子与细胞类型。', 'Because labeled polarity data are sparse and biased toward well-studied genes, the method uses self-supervised and weakly supervised learning to generalize to unseen transcription factors and cell types.')}</p>
              <div className="method-flow" aria-label={pick('Sc-GRIP 方法流程', 'Sc-GRIP method flow')}><span>{pick('表达矩阵', 'Expression matrix')}<br /><small>Expression</small></span><i>→</i><span>{pick('图卷积编码', 'Graph encoder')}<br /><small>Graph encoder</small></span><i>→</i><span>{pick('极性解码', 'Polarity decoder')}<br /><small>Polarity decoder</small></span></div>
            </section>

            <section id="interactive" className="article-interactive">
              <ScGripDemo />
            </section>

            <section id="paper">
              <p className="section-label">{pick('04 · 全文与引用 / PAPER & CITATION', '04 · PAPER & CITATION')}</p>
              <h2>{pick('阅读完整论文。', 'Read the full paper.')}</h2>
              <div className="article-external-links"><a href="/papers/2025-ICDM-Sc-GRIP.pdf" target="_blank" rel="noreferrer">{pick('下载论文 PDF', 'Download paper PDF')} <ArrowUpRight size={16} /></a><a href="https://ieeexplore.ieee.org/search/searchresult.jsp?queryText=Sc-GRIP%20Gene%20Interaction%20Polarity" target="_blank" rel="noreferrer">IEEE Xplore <ArrowUpRight size={16} /></a></div>
              <InteractiveFrame src="/papers/2025-ICDM-Sc-GRIP.pdf" title="Sc-GRIP paper (PDF)" label="2025_ICDM_scGRIP.pdf" />
              <BibtexDetails />
            </section>
          </div>
        </div>
      </article>
    </StandardPage>
  )
}

export function RepresentationArticlePage() {
  const { pick } = useLanguage()
  return (
    <StandardPage
      mark="涛"
      mode="fractal3"
      eyebrow="FIELD NOTE · DEEP REPRESENTATION LEARNING"
      title={pick(<>第 2 章：<br /><span>线性与独立结构。</span></>, <>Chapter 2:<br /><span>Linear and independent structure.</span></>)}
      english="PCA, ICA, sparse coding, and dictionary learning — made playable."
      description="2025.05.30 · Representation / Deep Learning · Pluto + Makie"
    >
      <article className="article-section light-section">
        <div className="page-width article-content article-narrow">
          <p className="section-label">CHAPTER 02 · INTERACTIVE NOTEBOOK</p>
          <h2>{pick(<>从主轴到独立成分，<br />让表示学习的地基可见。</>, <>From principal axes to independent components,<br />making the foundations visible.</>)}</h2>
          <p>{pick('线性与独立结构是表示学习的地基：从 PCA 找主轴，到 ICA 拆出独立成分，再到稀疏编码／字典学习学到过完备而可解释的基。本篇把马毅实验室《Deep Representation Learning》第 2 章做成一个可玩的 Pluto + Makie 笔记本——拖动参数，图形即时回应。', 'Linear and independent structures are the foundations of representation learning: PCA finds principal axes, ICA separates independent components, and sparse coding and dictionary learning discover overcomplete, interpretable bases. This note turns Chapter 2 of Ma Yi lab’s Deep Representation Learning into a playable Pluto + Makie notebook — adjust a parameter and every figure responds.')}</p>
          <blockquote className="article-english">Linear and independent structure is the bedrock of representation learning — from PCA to ICA to sparse coding and dictionary learning. Every figure in this notebook responds to your input.</blockquote>
          <div className="load-note"><strong>{pick('首次加载请稍候。', 'The first load may take a moment.')}</strong><span>{pick('该笔记本体积较大，会在浏览器中执行互动计算。也可以在新标签中打开，获得更大的操作空间。', 'This large notebook performs interactive computations in your browser. Open it in a new tab for more working space.')}</span></div>
          <InteractiveFrame src="/interactive/deep-representation-ch2.html" title="Deep Representation Learning Chapter 2 — interactive Pluto notebook" label="deep-representation-learning · ch.2 · pluto + makie" tall />
        </div>
      </article>
    </StandardPage>
  )
}

export function NussinovArticlePage() {
  const { pick } = useLanguage()
  return (
    <StandardPage
      mark="涛"
      mode="clover"
      initialView="2d"
      eyebrow="FIELD NOTE · RNA ALGORITHMS"
      title={pick(<>Nussinov–Jacobson<br /><span>RNA 折叠算法。</span></>, <>Nussinov–Jacobson<br /><span>RNA folding algorithm.</span></>)}
      english="Fill the dynamic-programming matrix. Trace the optimal pairs."
      description={pick('2025.05.13 · RNA / 算法 · 互动教程', '2025.05.13 · RNA / Algorithm · Interactive tutorial')}
    >
      <article className="article-section light-section">
        <div className="page-width article-content article-narrow">
          <p className="section-label">DYNAMIC PROGRAMMING · INTERACTIVE TUTORIAL</p>
          <h2>{pick(<>逐格填入矩阵，<br />回溯一条最优折叠路径。</>, <>Fill the matrix cell by cell,<br />then trace an optimal fold.</>)}</h2>
          <p>{pick('RNA 是单链分子——它会自我折叠、链内配对，形成发夹、茎环、内环与多分支接头等二级与三级结构，而这些结构往往直接决定其功能。Nussinov–Jacobson 算法用动态规划求解「最多碱基配对」这一最优化问题，是理解 RNA 折叠的第一块基石。', 'RNA is single-stranded: it folds back on itself and forms intramolecular pairs, producing hairpins, stem-loops, internal loops, and multi-branch junctions that often underpin function. The Nussinov–Jacobson algorithm uses dynamic programming to maximize base pairing and is a foundational way to understand RNA folding.')}</p>
          <blockquote className="article-english">The Nussinov–Jacobson algorithm maximises base pairing through dynamic programming — the classic entry point to RNA-folding prediction.</blockquote>
          <p>{pick('在下面的互动页面中输入序列，逐格观察 DP 矩阵的填充过程，并回溯出最优的碱基配对弧线。', 'Enter a sequence in the interactive page below, watch the DP matrix fill cell by cell, and trace the optimal base-pairing arcs.')}</p>
          <InteractiveFrame src="/interactive/nussinov.html" title="Nussinov–Jacobson RNA folding interactive tutorial" label="nussinov-jacobson · interactive" tall />
        </div>
      </article>
    </StandardPage>
  )
}
