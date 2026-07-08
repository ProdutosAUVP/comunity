import { useRef, useState } from 'react'
import { Gif, Image, ListBullets, TextB, TextItalic } from '@phosphor-icons/react'
import { Modal } from './ui'
import gifMindBlown from '../assets/bento/chart.gif'
import gifMoneyRain from '../assets/bento/coin.gif'
import gifFacepalm from '../assets/bento/confetti.gif'
import gifThumbsUp from '../assets/bento/wave.gif'
import gifCryingLaughing from '../assets/bento/pulse.gif'
import gifFire from '../assets/bento/sparkle.gif'

// Biblioteca de GIFs mockada (gerada localmente, sem integração externa).
// Num backend real isso seria uma busca no Giphy/Tenor; aqui simulamos com
// um catálogo fixo de reações, o suficiente para o mockup ser funcional.
const GIF_LIBRARY = [
  { id: 'mindblown', label: 'Chocado', src: gifMindBlown },
  { id: 'moneyrain', label: 'Chuva de dinheiro', src: gifMoneyRain },
  { id: 'facepalm', label: 'Facepalm', src: gifFacepalm },
  { id: 'thumbsup', label: 'Mandou bem', src: gifThumbsUp },
  { id: 'cryinglaughing', label: 'Rindo até chorar', src: gifCryingLaughing },
  { id: 'fire', label: 'Tá bombando', src: gifFire },
]

function GifPickerModal({ open, onClose, onPick }) {
  return (
    <Modal open={open} onClose={onClose} title="Inserir GIF">
      <div className="grid grid-cols-2 gap-[10px] sm:grid-cols-3">
        {GIF_LIBRARY.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => onPick(g)}
            className="group overflow-hidden rounded-[8px] border border-border text-left transition-all duration-240 hover:border-primary"
          >
            <img src={g.src} alt={g.label} className="h-[90px] w-full object-cover" />
            <p className="p-[6px] font-roboto text-[11px] text-foreground">{g.label}</p>
          </button>
        ))}
      </div>
    </Modal>
  )
}

// Textarea com barra de formatação (negrito, itálico, lista), upload de
// imagem e seleção de GIF — usado tanto na criação de posts quanto nos
// comentários. O texto formatado usa a sintaxe interpretada por <RichText>.
export default function RichComposer({
  value,
  onChange,
  placeholder,
  rows = 3,
  textareaClassName = '',
  ariaLabel = 'Corpo do texto',
}) {
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)
  const [gifPickerOpen, setGifPickerOpen] = useState(false)

  const focusAndSetSelection = (start, end) => {
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(start, end)
    })
  }

  const wrapSelection = (marker, placeholderText) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end) || placeholderText
    const next = `${value.slice(0, start)}${marker}${selected}${marker}${value.slice(end)}`
    onChange(next)
    focusAndSetSelection(start + marker.length, start + marker.length + selected.length)
  }

  const insertBulletList = () => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end)
    const lines = (selected || 'item da lista').split('\n').map((l) => `- ${l.replace(/^-\s*/, '')}`)
    const block = lines.join('\n')
    const needsLeadingBreak = start > 0 && value[start - 1] !== '\n'
    const insert = `${needsLeadingBreak ? '\n' : ''}${block}\n`
    const next = `${value.slice(0, start)}${insert}${value.slice(end)}`
    onChange(next)
    focusAndSetSelection(start + insert.length, start + insert.length)
  }

  const insertImageMarkdown = (url, alt) => {
    const el = textareaRef.current
    const pos = el ? el.selectionStart : value.length
    const needsLeadingBreak = pos > 0 && value[pos - 1] !== '\n'
    const insert = `${needsLeadingBreak ? '\n' : ''}![${alt}](${url})\n`
    const next = `${value.slice(0, pos)}${insert}${value.slice(pos)}`
    onChange(next)
    focusAndSetSelection(pos + insert.length, pos + insert.length)
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => insertImageMarkdown(String(reader.result), file.name || 'imagem')
    reader.readAsDataURL(file)
  }

  const TOOLBAR = [
    { icon: TextB, label: 'Negrito', onClick: () => wrapSelection('**', 'negrito') },
    { icon: TextItalic, label: 'Itálico', onClick: () => wrapSelection('_', 'itálico') },
    { icon: ListBullets, label: 'Lista', onClick: insertBulletList },
    { icon: Image, label: 'Inserir imagem', onClick: () => fileInputRef.current?.click() },
    { icon: Gif, label: 'Inserir GIF', onClick: () => setGifPickerOpen(true) },
  ]

  return (
    <div className="rounded-[5px] border border-border transition-all duration-240 focus-within:border-primary">
      <div className="flex gap-[4px] border-b border-border p-[8px]" role="toolbar" aria-label="Formatação de texto">
        {TOOLBAR.map(({ icon: Icon, label, onClick }) => (
          <button
            key={label}
            type="button"
            onClick={onClick}
            aria-label={label}
            title={label}
            className="rounded-[5px] p-[6px] text-muted-foreground transition-all duration-240 hover:bg-muted hover:text-primary"
          >
            <Icon size={16} weight="bold" />
          </button>
        ))}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={`w-full resize-y rounded-b-[5px] bg-background p-[15px] font-roboto text-[15px] leading-[1.6] text-foreground outline-none ${textareaClassName}`}
      />
      <GifPickerModal
        open={gifPickerOpen}
        onClose={() => setGifPickerOpen(false)}
        onPick={(g) => {
          insertImageMarkdown(g.src, g.label)
          setGifPickerOpen(false)
        }}
      />
    </div>
  )
}
