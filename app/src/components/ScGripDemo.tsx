import { useMemo, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { useLanguage } from '../i18n'

const transcriptionFactors = [
  { id: 'TF1', x: 92, y: 105 },
  { id: 'TF2', x: 92, y: 235 },
]

const genes = [
  { id: 'A', x: 470, y: 45 },
  { id: 'B', x: 470, y: 110 },
  { id: 'C', x: 470, y: 175 },
  { id: 'D', x: 470, y: 240 },
  { id: 'E', x: 470, y: 305 },
]

const initialEdges = [
  { from: 'TF1', to: 'A', sign: 1 },
  { from: 'TF1', to: 'B', sign: -1 },
  { from: 'TF1', to: 'C', sign: 1 },
  { from: 'TF2', to: 'C', sign: -1 },
  { from: 'TF2', to: 'D', sign: 1 },
  { from: 'TF2', to: 'E', sign: -1 },
  { from: 'TF2', to: 'B', sign: 1 },
]

export default function ScGripDemo() {
  const { pick } = useLanguage()
  const [activeTf, setActiveTf] = useState<Record<string, boolean>>({ TF1: true, TF2: false })
  const [edges, setEdges] = useState(initialEdges)
  const nodes = useMemo(() => [...transcriptionFactors, ...genes], [])

  const geneState = (id: string) => edges.reduce((net, edge) => {
    if (edge.to !== id || !activeTf[edge.from]) return net
    return net + edge.sign
  }, 0)

  const reset = () => {
    setActiveTf({ TF1: true, TF2: false })
    setEdges(initialEdges)
  }

  const keyboardAction = (event: React.KeyboardEvent<SVGGElement>, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      action()
    }
  }

  return (
    <div className="scgrip-demo">
      <div className="demo-heading">
        <div><p className="section-label">INTERACTIVE DEMO</p><h2>{pick('亲手改变调控极性', 'Change regulatory polarity yourself')}</h2></div>
        <button type="button" onClick={reset}><RotateCcw size={16} /> {pick('重置', 'Reset')}</button>
      </div>
      <p className="demo-instruction">{pick('点击左侧 TF 切换活跃状态；点击边上的 + / − 翻转激活或抑制。右侧基因会根据收到的净效应切换 ON / OFF。', 'Click a TF on the left to toggle its activity; click + / − on an edge to flip activation or repression. Genes on the right switch ON / OFF according to their net input.')}</p>
      <svg className="scgrip-svg" viewBox="0 0 560 340" role="img" aria-label={pick('可交互的基因调控网络示意图', 'Interactive gene-regulatory network diagram')}>
        <defs>
          <marker id="demo-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" /></marker>
        </defs>
        {edges.map((edge, index) => {
          const from = nodes.find((node) => node.id === edge.from)!
          const to = nodes.find((node) => node.id === edge.to)!
          const color = edge.sign > 0 ? '#39ad83' : '#d87970'
          const toggle = () => setEdges((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, sign: -item.sign } : item))
          return (
            <g key={`${edge.from}-${edge.to}`} className="scgrip-edge" role="button" tabIndex={0} aria-label={pick(`${edge.from} 到基因 ${edge.to}，当前为${edge.sign > 0 ? '激活' : '抑制'}，点击切换`, `${edge.from} to gene ${edge.to}, currently ${edge.sign > 0 ? 'activation' : 'repression'}; activate to switch`)} onClick={toggle} onKeyDown={(event) => keyboardAction(event, toggle)}>
              <line x1={from.x + 32} y1={from.y} x2={to.x - 30} y2={to.y} stroke={color} markerEnd="url(#demo-arrow)" />
              <line className="edge-hit" x1={from.x + 32} y1={from.y} x2={to.x - 30} y2={to.y} />
              <circle cx={(from.x + to.x) / 2} cy={(from.y + to.y) / 2} r="15" fill={color} />
              <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 + 5}>{edge.sign > 0 ? '+' : '−'}</text>
            </g>
          )
        })}
        {transcriptionFactors.map((tf) => {
          const active = activeTf[tf.id]
          const toggle = () => setActiveTf((current) => ({ ...current, [tf.id]: !current[tf.id] }))
          return (
            <g key={tf.id} className={active ? 'tf-node active' : 'tf-node'} role="button" tabIndex={0} aria-label={`${tf.id}，当前${active ? '活跃' : '未活跃'}，点击切换`} onClick={toggle} onKeyDown={(event) => keyboardAction(event, toggle)}>
              <circle cx={tf.x} cy={tf.y} r="32" />
              <text className="node-label" x={tf.x} y={tf.y + 5}>{tf.id}</text>
              <text className="node-state" x={tf.x} y={tf.y + 51}>{active ? 'ACTIVE' : 'INACTIVE'}</text>
            </g>
          )
        })}
        {genes.map((gene) => {
          const state = geneState(gene.id)
          return (
            <g key={gene.id} className={state > 0 ? 'gene-node active' : 'gene-node'}>
              <circle cx={gene.x} cy={gene.y} r="25" />
              <text className="node-label" x={gene.x} y={gene.y + 5}>{gene.id}</text>
              <text className="node-state" x={gene.x - 57} y={gene.y + 4}>{state > 0 ? 'ON' : 'OFF'}</text>
            </g>
          )
        })}
      </svg>
      <div className="demo-legend"><span><i className="activation" />激活 activation (+)</span><span><i className="repression" />抑制 repression (−)</span><span><i className="gene-on" />基因 ON</span></div>
    </div>
  )
}
