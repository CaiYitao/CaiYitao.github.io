import { BrainCircuit, Dna, FlaskConical, Network } from 'lucide-react'

export const BIBTEX = `@inproceedings{atria2025sc,
  title     = {Sc-GRIP: a Graph Convolutional Approach to Infer Gene Interaction Polarity from Single-Cell Data},
  author    = {Atria, Carolina E and Cai, Yitao and Weber, Pascal and Beer, Anna and
               Kriege, Nils and B{\\"o}hm, Christian and Revilla-i-Domingo, Roger and Plant, Claudia},
  booktitle = {2025 IEEE International Conference on Data Mining (ICDM)},
  pages     = {1030--1039},
  year      = {2025},
  organization = {IEEE}
}`

export const researchAreas = [
  {
    icon: Network,
    title: '基因调控网络',
    titleEn: 'Gene-regulatory networks',
    english: 'Graph learning × single-cell genomics',
    description: '从稀疏的单细胞表达数据中恢复有方向、有符号的基因互作，理解细胞状态背后的调控逻辑。',
    descriptionEn: 'Recover directed, signed gene interactions from sparse single-cell expression data to understand the regulatory logic behind cell states.',
  },
  {
    icon: Dna,
    title: 'RNA 折叠与设计',
    titleEn: 'RNA folding and design',
    english: 'RNA folding × computational structural biology',
    description: '把序列、二级结构与功能连接起来，探索可计算、可验证的 RNA 结构生成与设计方法。',
    descriptionEn: 'Connect sequence, secondary structure, and function through computable, experimentally testable approaches to RNA structure generation and design.',
  },
  {
    icon: BrainCircuit,
    title: '深度表示学习',
    titleEn: 'Deep representation learning',
    english: 'Representation learning × attention',
    description: '研究高维生物数据中的独立结构、可解释表示，以及面向复杂系统的学习与推理机制。',
    descriptionEn: 'Study independent structure and interpretable representations in high-dimensional biological data, alongside learning and reasoning for complex systems.',
  },
  {
    icon: FlaskConical,
    title: '合成生物学',
    titleEn: 'Synthetic biology',
    english: 'Genetic circuits × systems biology',
    description: '将模型预测带回基因电路与实验场景，面向疾病治疗与更长健康寿命的交叉研究。',
    descriptionEn: 'Bring model predictions back to genetic circuits and experiments, connecting computation with disease treatment and longer healthy lifespan.',
  },
]

export type NoteType = 'graph' | 'representation' | 'rna'

export const notes: Array<{
  title: string
  titleEn: string
  summary: string
  summaryEn: string
  date: string
  tags: string[]
  href: string
  type: NoteType
}> = [
  {
    title: 'Sc-GRIP · 从单细胞数据推断基因互作极性',
    titleEn: 'Sc-GRIP · Inferring gene interaction polarity from single-cell data',
    summary: '图卷积、双线性解码器，以及一个可亲手切换激活与抑制关系的互动演示。',
    summaryEn: 'Graph convolution, a bilinear decoder, and a hands-on demo for switching activation and repression.',
    date: '2025.11.12',
    tags: ['Graph Learning', 'Single-cell'],
    href: '/posts/scgrip',
    type: 'graph',
  },
  {
    title: '深度表示学习 · 第2章：线性与独立结构',
    titleEn: 'Deep Representation Learning · Chapter 2: Linear and Independent Structure',
    summary: '从 PCA 到 ICA 与稀疏编码，把表示学习的基础概念变成可响应参数的图形。',
    summaryEn: 'From PCA to ICA and sparse coding, turn foundational representation-learning ideas into parameter-responsive figures.',
    date: '2025.05.30',
    tags: ['Representation', 'Deep Learning'],
    href: '/posts/deep-representation-ch2',
    type: 'representation',
  },
  {
    title: 'Nussinov–Jacobson RNA 折叠算法 · 互动教程',
    titleEn: 'Nussinov–Jacobson RNA Folding Algorithm · Interactive Tutorial',
    summary: '逐格观察动态规划矩阵，回溯最优碱基配对，亲手走完 RNA 折叠的经典算法。',
    summaryEn: 'Watch the dynamic-programming matrix fill cell by cell, trace optimal pairs, and work through the classic RNA-folding algorithm.',
    date: '2025.05.13',
    tags: ['RNA', 'Algorithm'],
    href: '/posts/nussinov',
    type: 'rna',
  },
]
