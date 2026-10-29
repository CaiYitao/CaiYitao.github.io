import { useState } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { Link } from 'react-router'
import { BIBTEX, notes } from '../data/site'
import NoteVisual from './NoteVisual'
import { useLanguage } from '../i18n'

export function BibtexDetails({ id }: { id?: string }) {
  const { pick } = useLanguage()
  const [copied, setCopied] = useState(false)

  const copyBibtex = async () => {
    try {
      await navigator.clipboard.writeText(BIBTEX)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = BIBTEX
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <details className="bibtex" id={id}>
      <summary>{pick('查看引用格式', 'View citation')} {pick(<span>View citation</span>, null)}</summary>
      <div className="bibtex-body"><pre>{BIBTEX}</pre><button type="button" onClick={copyBibtex}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? pick('已复制', 'Copied') : pick('复制 BibTeX', 'Copy BibTeX')}</button></div>
    </details>
  )
}

export function NotesGrid() {
  const { pick } = useLanguage()
  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <Link className="note-card" key={note.href} to={note.href}>
          <div className={`note-visual ${note.type}`}><NoteVisual type={note.type} /><span>{pick('互动', 'INTERACTIVE')} <ArrowUpRight size={14} /></span></div>
          <div className="note-body">
            <time>{note.date}</time>
            <h3>{pick(note.title, note.titleEn)}</h3>
            <p>{pick(note.summary, note.summaryEn)}</p>
            <div className="note-tags">{note.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export function InteractiveFrame({ src, title, label, tall = false }: { src: string; title: string; label: string; tall?: boolean }) {
  const { pick } = useLanguage()
  return (
    <div className="interactive-frame-wrap">
      <div className="interactive-frame-bar">
        <span className="frame-dots" aria-hidden="true"><i /><i /><i /></span>
        <span>{label}</span>
        <a href={src} target="_blank" rel="noreferrer">{pick('新标签打开', 'Open in new tab')} <ArrowUpRight size={13} /></a>
      </div>
      <iframe className={tall ? 'interactive-frame tall' : 'interactive-frame'} src={src} title={title} loading="lazy" />
    </div>
  )
}
