import { useEffect, useRef, useState } from 'react'
import {
  Gif,
  Image,
  Link as LinkIcon,
  ListBullets,
  ListNumbers,
  MagnifyingGlass,
  Quotes,
  TextAa,
  TextB,
  TextItalic,
  TextStrikethrough,
} from '@phosphor-icons/react'
import { Button, Modal } from './ui'
import gifMindBlown from '../assets/bento/chart.gif'
import gifMoneyRain from '../assets/bento/coin.gif'
import gifFacepalm from '../assets/bento/confetti.gif'
import gifThumbsUp from '../assets/bento/wave.gif'
import gifCryingLaughing from '../assets/bento/pulse.gif'
import gifFire from '../assets/bento/sparkle.gif'

// Reações rápidas (GIFs gerados localmente, sem dependência externa) —
// ficam sempre disponíveis mesmo sem conexão, ao lado da busca no Giphy.
const QUICK_REACTIONS = [
  { id: 'mindblown', label: 'Chocado', src: gifMindBlown },
  { id: 'moneyrain', label: 'Chuva de dinheiro', src: gifMoneyRain },
  { id: 'facepalm', label: 'Facepalm', src: gifFacepalm },
  { id: 'thumbsup', label: 'Mandou bem', src: gifThumbsUp },
  { id: 'cryinglaughing', label: 'Rindo até chorar', src: gifCryingLaughing },
  { id: 'fire', label: 'Tá bombando', src: gifFire },
]

// Chave pública de demonstração do Giphy (documentada pelo próprio Giphy
// para testes/protótipos). Antes de ir para produção, troque por uma chave
// própria gerada em developers.giphy.com.
const GIPHY_API_KEY = 'dc6zaTOxFJmzC'
const GIPHY_BASE = 'https://api.giphy.com/v1/gifs'

function useGiphy(query, active) {
  const [state, setState] = useState({ items: [], loading: true, error: null })

  useEffect(() => {
    if (!active) return
    const controller = new AbortController()
    setState((s) => ({ ...s, loading: true, error: null }))
    const url = query.trim()
      ? `${GIPHY_BASE}/search?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(query.trim())}&limit=24&rating=g&lang=pt`
      : `${GIPHY_BASE}/trending?api_key=${GIPHY_API_KEY}&limit=24&rating=g`
    const debounce = setTimeout(() => {
      fetch(url, { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw new Error('bad status')
          return r.json()
        })
        .then((data) => setState({ items: data.data || [], loading: false, error: null }))
        .catch((err) => {
          if (err.name === 'AbortError') return
          setState({ items: [], loading: false, error: 'Não foi possível carregar os GIFs do Giphy agora. Tente novamente.' })
        })
    }, 350)
    return () => {
      controller.abort()
      clearTimeout(debounce)
    }
  }, [query, active])

  return state
}

function GifPickerModal({ open, onClose, onPick }) {
  const [query, setQuery] = useState('')
  const { items, loading, error } = useGiphy(query, open)

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  return (
    <Modal open={open} onClose={onClose} title="Inserir GIF" wide>
      <label className="flex items-center gap-[8px] rounded-[5px] border border-border px-[12px] py-[9px] transition-all duration-240 focus-within:border-primary">
        <MagnifyingGlass size={15} weight="bold" className="text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar GIFs no Giphy…"
          aria-label="Buscar GIFs"
          autoFocus
          className="w-full bg-transparent font-roboto text-[14px] text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>

      <div className="mt-[15px] grid max-h-[320px] grid-cols-2 gap-[8px] overflow-y-auto scrollbar-thin sm:grid-cols-3">
        {loading &&
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[100px] animate-pulse rounded-[8px] bg-muted" />)}
        {!loading && error && (
          <p className="col-span-full py-[20px] text-center font-roboto text-[13px] text-muted-foreground">{error}</p>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="col-span-full py-[20px] text-center font-roboto text-[13px] text-muted-foreground">Nenhum GIF encontrado.</p>
        )}
        {!loading &&
          !error &&
          items.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => onPick({ src: g.images?.fixed_height?.url || g.images?.original?.url, label: g.title || 'GIF' })}
              className="overflow-hidden rounded-[8px] border border-border transition-all duration-240 hover:border-primary"
            >
              <img
                src={g.images?.fixed_height_small?.url || g.images?.fixed_height?.url}
                alt={g.title || 'GIF'}
                loading="lazy"
                className="h-[100px] w-full object-cover"
              />
            </button>
          ))}
      </div>

      <p className="mb-[8px] mt-[20px] font-sora text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
        Reações rápidas (offline)
      </p>
      <div className="grid grid-cols-3 gap-[8px] sm:grid-cols-6">
        {QUICK_REACTIONS.map((g) => (
          <button
            key={g.id}
            type="button"
            title={g.label}
            onClick={() => onPick(g)}
            className="overflow-hidden rounded-[8px] border border-border transition-all duration-240 hover:border-primary"
          >
            <img src={g.src} alt={g.label} className="h-[54px] w-full object-cover" />
          </button>
        ))}
      </div>

      <p className="mt-[15px] text-right font-roboto text-[11px] text-muted-foreground">Powered by GIPHY</p>
    </Modal>
  )
}

function LinkModal({ open, onClose, onInsert }) {
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    if (open) {
      setText('')
      setUrl('')
    }
  }, [open])

  return (
    <Modal open={open} onClose={onClose} title="Inserir link">
      <div className="flex flex-col gap-[15px]">
        <div>
          <label className="mb-[6px] block font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
            Texto do link
          </label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ex.: Escola AUVP"
            className="w-full rounded-[5px] border border-border bg-background p-[12px] font-roboto text-[14px] text-foreground outline-none transition-all duration-240 focus:border-primary"
          />
        </div>
        <div>
          <label className="mb-[6px] block font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://…"
            className="w-full rounded-[5px] border border-border bg-background p-[12px] font-roboto text-[14px] text-foreground outline-none transition-all duration-240 focus:border-primary"
          />
        </div>
        <div className="flex justify-end gap-[15px]">
          <Button type="button" size="sm" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!url.trim()}
            onClick={() => {
              onInsert(text.trim() || url.trim(), url.trim())
              onClose()
            }}
          >
            Inserir link
          </Button>
        </div>
      </div>
    </Modal>
  )
}

// Textarea com barra de formatação completa (negrito, itálico, tachado,
// título, citação, lista, lista numerada, link), upload de imagem e busca
// de GIF no Giphy — usado tanto na criação de posts quanto nos comentários.
// O texto formatado usa a sintaxe interpretada por <RichText>.
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
  const [linkModalOpen, setLinkModalOpen] = useState(false)

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

  const insertBlock = (buildLines, fallback) => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart
    const end = el.selectionEnd
    const selected = value.slice(start, end)
    const rawLines = (selected || fallback).split('\n')
    const block = buildLines(rawLines).join('\n')
    const needsLeadingBreak = start > 0 && value[start - 1] !== '\n'
    const insert = `${needsLeadingBreak ? '\n' : ''}${block}\n`
    const next = `${value.slice(0, start)}${insert}${value.slice(end)}`
    onChange(next)
    focusAndSetSelection(start + insert.length, start + insert.length)
  }

  const insertBulletList = () => insertBlock((lines) => lines.map((l) => `- ${l.replace(/^-\s*/, '')}`), 'item da lista')

  const insertOrderedList = () =>
    insertBlock((lines) => lines.map((l, i) => `${i + 1}. ${l.replace(/^\d+\.\s*/, '')}`), 'item da lista')

  const insertHeading = () => insertBlock((lines) => lines.map((l) => `## ${l.replace(/^#+\s*/, '')}`), 'título')

  const insertQuote = () => insertBlock((lines) => lines.map((l) => `> ${l.replace(/^>\s*/, '')}`), 'citação')

  const insertLink = (text, url) => {
    const el = textareaRef.current
    const start = el ? el.selectionStart : value.length
    const end = el ? el.selectionEnd : value.length
    const token = `[${text}](${url})`
    const next = `${value.slice(0, start)}${token}${value.slice(end)}`
    onChange(next)
    focusAndSetSelection(start + token.length, start + token.length)
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
    { icon: TextStrikethrough, label: 'Tachado', onClick: () => wrapSelection('~~', 'tachado') },
    { icon: TextAa, label: 'Título', onClick: insertHeading },
    { icon: Quotes, label: 'Citação', onClick: insertQuote },
    { icon: ListBullets, label: 'Lista', onClick: insertBulletList },
    { icon: ListNumbers, label: 'Lista numerada', onClick: insertOrderedList },
    { icon: LinkIcon, label: 'Inserir link', onClick: () => setLinkModalOpen(true) },
    { icon: Image, label: 'Inserir imagem', onClick: () => fileInputRef.current?.click() },
    { icon: Gif, label: 'Inserir GIF', onClick: () => setGifPickerOpen(true) },
  ]

  return (
    <div className="rounded-[5px] border border-border transition-all duration-240 focus-within:border-primary">
      <div className="flex flex-wrap gap-[4px] border-b border-border p-[8px]" role="toolbar" aria-label="Formatação de texto">
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
      <LinkModal open={linkModalOpen} onClose={() => setLinkModalOpen(false)} onInsert={insertLink} />
    </div>
  )
}
