// Renderizador leve de texto formatado (negrito, itálico, tachado, título,
// citação, listas, links e imagens inline) para posts e comentários. Usa uma
// sintaxe minimalista inspirada em markdown, gerada pelo próprio
// RichComposer — não depende de bibliotecas externas nem de
// dangerouslySetInnerHTML.

const INLINE_RE = /(\*\*(.+?)\*\*|~~(.+?)~~|_(.+?)_|(?<!!)\[(.+?)\]\((.+?)\))/g

function renderInline(line, keyPrefix) {
  const parts = []
  let lastIndex = 0
  let i = 0
  let m
  INLINE_RE.lastIndex = 0
  while ((m = INLINE_RE.exec(line))) {
    if (m.index > lastIndex) parts.push(line.slice(lastIndex, m.index))
    if (m[2] !== undefined) parts.push(<strong key={`${keyPrefix}-b-${i++}`}>{m[2]}</strong>)
    else if (m[3] !== undefined) parts.push(<del key={`${keyPrefix}-s-${i++}`}>{m[3]}</del>)
    else if (m[4] !== undefined) parts.push(<em key={`${keyPrefix}-i-${i++}`}>{m[4]}</em>)
    else if (m[5] !== undefined)
      parts.push(
        <a
          key={`${keyPrefix}-a-${i++}`}
          href={m[6]}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline underline-offset-2 hover:no-underline"
        >
          {m[5]}
        </a>,
      )
    lastIndex = INLINE_RE.lastIndex
  }
  if (lastIndex < line.length) parts.push(line.slice(lastIndex))
  return parts
}

const IMAGE_RE = /^!\[(.*?)\]\((.+?)\)$/
const BULLET_RE = /^-\s+(.*)$/
const ORDERED_RE = /^\d+\.\s+(.*)$/
const QUOTE_RE = /^>\s?(.*)$/
const HEADING_RE = /^##\s+(.*)$/

export function RichText({ text, className = '' }) {
  if (!text) return null
  const lines = text.split('\n')
  const blocks = []
  let bulletBuffer = []
  let orderedBuffer = []
  let quoteBuffer = []

  const flushBullets = () => {
    if (bulletBuffer.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="my-[6px] list-disc pl-[22px]">
          {bulletBuffer.map((l, i) => (
            <li key={i}>{renderInline(l, `li-${blocks.length}-${i}`)}</li>
          ))}
        </ul>,
      )
      bulletBuffer = []
    }
  }
  const flushOrdered = () => {
    if (orderedBuffer.length) {
      blocks.push(
        <ol key={`ol-${blocks.length}`} className="my-[6px] list-decimal pl-[22px]">
          {orderedBuffer.map((l, i) => (
            <li key={i}>{renderInline(l, `oli-${blocks.length}-${i}`)}</li>
          ))}
        </ol>,
      )
      orderedBuffer = []
    }
  }
  const flushQuote = () => {
    if (quoteBuffer.length) {
      blocks.push(
        <blockquote key={`bq-${blocks.length}`} className="my-[6px] border-l-2 border-primary/40 pl-[12px] text-foreground/80 italic">
          {quoteBuffer.map((l, i) => (
            <p key={i}>{renderInline(l, `bq-${blocks.length}-${i}`)}</p>
          ))}
        </blockquote>,
      )
      quoteBuffer = []
    }
  }
  const flushAll = () => {
    flushBullets()
    flushOrdered()
    flushQuote()
  }

  lines.forEach((line, idx) => {
    const imgMatch = line.match(IMAGE_RE)
    if (imgMatch) {
      flushAll()
      blocks.push(
        <img
          key={`img-${idx}`}
          src={imgMatch[2]}
          alt={imgMatch[1] || 'imagem'}
          className="my-[8px] max-h-[360px] rounded-[8px] border border-border object-contain"
        />,
      )
      return
    }
    const headingMatch = line.match(HEADING_RE)
    if (headingMatch) {
      flushAll()
      blocks.push(
        <h3 key={`h-${idx}`} className="mt-[12px] font-anek text-[19px] font-semibold text-foreground">
          {renderInline(headingMatch[1], `h-${idx}`)}
        </h3>,
      )
      return
    }
    const quoteMatch = line.match(QUOTE_RE)
    if (quoteMatch) {
      flushBullets()
      flushOrdered()
      quoteBuffer.push(quoteMatch[1])
      return
    }
    const bulletMatch = line.match(BULLET_RE)
    if (bulletMatch) {
      flushOrdered()
      flushQuote()
      bulletBuffer.push(bulletMatch[1])
      return
    }
    const orderedMatch = line.match(ORDERED_RE)
    if (orderedMatch) {
      flushBullets()
      flushQuote()
      orderedBuffer.push(orderedMatch[1])
      return
    }
    flushAll()
    if (line.trim() !== '') {
      blocks.push(
        <p key={`p-${idx}`} className="whitespace-pre-wrap">
          {renderInline(line, `p-${idx}`)}
        </p>,
      )
    }
  })
  flushAll()

  return <div className={className}>{blocks}</div>
}

// Versão "achatada" para prévias curtas (card do post, story viewer): remove
// a sintaxe de formatação e substitui imagens por um marcador textual.
export function stripMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/!\[(.*?)\]\((.+?)\)/g, '[imagem]')
    .replace(/(?<!!)\[(.+?)\]\((.+?)\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/~~(.+?)~~/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/^#+\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^-\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/\s*\n\s*/g, ' ')
    .trim()
}
