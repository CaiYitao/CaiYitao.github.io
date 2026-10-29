import type { NoteType } from '../data/site'

export default function NoteVisual({ type }: { type: NoteType }) {
  if (type === 'graph') {
    const nodes = Array.from({ length: 11 }, (_, index) => ({
      x: 38 + (index % 4) * 66 + Math.sin(index * 2.1) * 13,
      y: 34 + Math.floor(index / 4) * 52 + Math.cos(index * 1.7) * 10,
    }))
    return (
      <svg viewBox="0 0 300 180" aria-hidden="true">
        {nodes.slice(0, -1).map((node, index) => (
          <line key={index} x1={node.x} y1={node.y} x2={nodes[(index * 3 + 4) % nodes.length].x} y2={nodes[(index * 3 + 4) % nodes.length].y} className="viz-line" />
        ))}
        {nodes.map((node, index) => <circle key={index} cx={node.x} cy={node.y} r={index % 3 === 0 ? 7 : 4} className={index % 3 === 0 ? 'viz-node accent' : 'viz-node'} />)}
      </svg>
    )
  }

  if (type === 'representation') {
    const points = Array.from({ length: 24 }, (_, index) => ({
      x: 42 + index * 8.8,
      y: 92 + Math.sin(index * 0.66) * 36 + Math.cos(index * 0.21) * 15,
    }))
    return (
      <svg viewBox="0 0 300 180" aria-hidden="true">
        <line x1="34" y1="140" x2="270" y2="140" className="viz-axis" />
        <line x1="34" y1="140" x2="34" y2="24" className="viz-axis" />
        <path d="M40 132 L262 38" className="viz-main-axis" />
        {points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="3.5" className={index % 5 === 0 ? 'viz-node accent' : 'viz-node'} />)}
      </svg>
    )
  }

  const nodes = Array.from({ length: 25 }, (_, index) => {
    const angle = index / 24 * Math.PI * 2
    const radius = 50 + Math.sin(angle * 3) * 23
    return { x: 150 + Math.cos(angle) * radius * 1.45, y: 90 + Math.sin(angle) * radius }
  })
  return (
    <svg viewBox="0 0 300 180" aria-hidden="true">
      <polyline points={nodes.map((node) => `${node.x},${node.y}`).join(' ')} className="viz-rna-backbone" />
      {[2, 6, 10, 14, 18].map((index) => <line key={index} x1={nodes[index].x} y1={nodes[index].y} x2={nodes[24 - index].x} y2={nodes[24 - index].y} className="viz-line" />)}
      {nodes.map((node, index) => <circle key={index} cx={node.x} cy={node.y} r="3.8" className={index % 4 === 0 ? 'viz-node accent' : 'viz-node'} />)}
    </svg>
  )
}
