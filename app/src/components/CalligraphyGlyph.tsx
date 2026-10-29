import type { CSSProperties } from 'react'

const glyphs = {
  蔡: '/marks/wang-cai.svg',
  祎: '/marks/wang-yi.svg',
  涛: '/marks/wang-tao.svg',
}

export type CalligraphyCharacter = keyof typeof glyphs

export default function CalligraphyGlyph({ character, className = '' }: { character: CalligraphyCharacter; className?: string }) {
  return (
    <span
      className={`calligraphy-glyph ${className}`}
      style={{ '--glyph-url': `url("${glyphs[character]}")` } as CSSProperties}
      aria-hidden="true"
    />
  )
}
