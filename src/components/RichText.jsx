// Renderizador leve de texto formatado (negrito, itálico, listas e imagens
// inline) para posts e comentários. Usa uma sintaxe minimalista inspirada em
// markdown, gerada pelo próprio RichComposer — não depende de bibliotecas
// externas nem de dangerouslySetInnerHTML.

const INLINE_RE = /(\*\*(.+?)\*\*|_(.+?)_)/g

function renderInline(line, keyPrefix) {
  const parts = []
  let lastIndex = 0
  let i = 0
  let m
  INLINE_RE.lastIndex = 0
  while ((m = INLINE_RE.exec(line))) {
    if (m.index > lastIndex) parts.push(line.slice(lastIndex, m.index))
    if (m[2] !== undefined) parts.push(<strong key={`${keyPrefix}-b-${i++}`}>{m[2]}</strong>)
    else if (m[3] !== undefined) parts.push(<em key={`${keyPrefix}-i-${i++}`}>{m[3]}</em>)
    lastIndex = INLINE_RE.lastIndex
  }
  if (lastIndex < line.length) parts.push(line.slice(lastIndex))
  return parts
}

const IMAGE_RE = /^!\[(.*?)\]\((.+?)\)$/
const BULLET_RE = /^-\s+(.*)$/

export function RichText({ text, className = '' }) {
  if (!text) return null
  const lines = text.split('\n')
  const blocks = []
  let listBuffer = []

  const flushList = () => {
    if (listBuffer.length) {
      blocks.push(
        <ul key={`ul-${blocks.length}`} className="my-[6px] list-disc pl-[22px]">
          {listBuffer.map((l, i) => (
            <li key={i}>{renderInline(l, `li-${blocks.length}-${i}`)}</li>
          ))}
        </ul>,
      )
      listBuffer = []
    }
  }

  lines.forEach((line, idx) => {
    const imgMatch = line.match(IMAGE_RE)
    if (imgMatch) {
      flushList()
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
    const bulletMatch = line.match(BULLET_RE)
    if (bulletMatch) {
      listBuffer.push(bulletMatch[1])
      return
    }
    flushList()
    if (line.trim() !== '') {
      blocks.push(
        <p key={`p-${idx}`} className="whitespace-pre-wrap">
          {renderInline(line, `p-${idx}`)}
        </p>,
      )
    }
  })
  flushList()

  return <div className={className}>{blocks}</div>
}

// Versão "achatada" para prévias curtas (card do post, story viewer): remove
// a sintaxe de formatação e substitui imagens por um marcador textual.
export function stripMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/!\[(.*?)\]\((.+?)\)/g, '[imagem]')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    .replace(/^-\s+/gm, '')
    .replace(/\s*\n\s*/g, ' ')
    .trim()
}
