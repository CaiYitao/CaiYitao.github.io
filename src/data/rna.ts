import structureRecords from './structures.json'

export type RnaMode = 'clover' | 'zigzag' | 'gladius' | 'kyurem5' | 'fractal3' | 'thunderbolt' | 'shooting-star'
export type Vec2 = [number, number]
export type Vec3 = [number, number, number]

export interface RnaStructure {
  mode: RnaMode
  name: string
  shortName: string
  sequence: string
  dotBracket: string
  pairs: Array<[number, number]>
  positions2D: Vec2[]
  positions3D: Vec3[]
  source: string
  sourceUrl: string
  author: string
  eternaId: string
}

export const RNA_STRUCTURE_OPTIONS = structureRecords.map((record) => ({
  value: record.id as RnaMode,
  label: record.id === 'clover' ? 'tRNA · 三叶草' : record.name,
}))

export function parsePairs(dotBracket: string): Array<[number, number]> {
  const stack: number[] = []
  const pairs: Array<[number, number]> = []
  for (let i = 0; i < dotBracket.length; i += 1) {
    if (dotBracket[i] === '(') stack.push(i)
    if (dotBracket[i] === ')') {
      const start = stack.pop()
      if (start !== undefined) pairs.push([start, i])
    }
  }
  return pairs.sort((a, b) => a[0] - b[0])
}

const cache = new Map<RnaMode, RnaStructure>()

export function getRnaStructure(mode: RnaMode): RnaStructure {
  const cached = cache.get(mode)
  if (cached) return cached
  const record = structureRecords.find((item) => item.id === mode)
  if (!record) throw new Error(`Unknown RNA structure: ${mode}`)
  const positions2D = record.positions as Vec2[]
  const positions3D = positions2D.map(([x, y], index): Vec3 => [
    x,
    y,
    Math.sin(index * 0.37) * 0.09 + Math.cos(x * 1.7 + y * 1.2) * 0.055,
  ])
  const structure: RnaStructure = {
    ...record,
    mode,
    pairs: parsePairs(record.dotBracket),
    positions2D,
    positions3D,
  }
  cache.set(mode, structure)
  return structure
}

export function getSpherePositions(structure: RnaStructure): Vec3[] {
  const maxRadius = Math.max(...structure.positions2D.map(([x, y]) => Math.hypot(x, y)), 0.001)
  return structure.positions2D.map(([x, y], index): Vec3 => {
    const radius = Math.hypot(x, y)
    const theta = Math.atan2(y, x) + Math.sin(index * 0.13) * 0.035
    const phi = 0.16 + radius / maxRadius * 2.18
    const sphereRadius = 1.9
    return [
      Math.sin(phi) * Math.cos(theta) * sphereRadius,
      Math.cos(phi) * sphereRadius,
      Math.sin(phi) * Math.sin(theta) * sphereRadius,
    ]
  })
}

export function getUnfoldedPositions(count: number): Vec3[] {
  const length = count > 250 ? 6.4 : 5.8
  return Array.from({ length: count }, (_, index) => {
    const t = index / Math.max(1, count - 1)
    return [
      (t - 0.5) * length,
      Math.sin(index * 0.29) * 0.28,
      Math.cos(index * 0.21) * 0.24,
    ]
  })
}
