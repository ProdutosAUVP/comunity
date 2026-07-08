import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ListBullets, Sparkle, TextB, TextItalic, X } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { Button, Card, Eyebrow, FlairBadge, TagPill } from '../components/ui'
import { ALL_TAGS, FLAIRS, suggestTags } from '../data/mock'

export default function CreatePostPage() {
  const { createPost, currentUser } = useApp()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [flair, setFlair] = useState('Dúvida')
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [publishing, setPublishing] = useState(false)

  // Sugestão automática de tags baseada no texto (simula IA)
  const suggested = useMemo(
    () => suggestTags(`${title} ${body}`).filter((t) => !tags.includes(t)),
    [title, body, tags],
  )

  const autocomplete = useMemo(() => {
    const q = tagInput.trim().toLowerCase()
    if (!q) return []
    return ALL_TAGS.filter((t) => t.includes(q) && !tags.includes(t)).slice(0, 5)
  }, [tagInput, tags])

  const addTag = (t) => {
    if (tags.length >= 5 || tags.includes(t)) return
    setTags((ts) => [...ts, t])
    setTagInput('')
  }

  useEffect(() => {
    document.title = 'Nova publicação — Comunidade AUVP'
    return () => {
      document.title = 'Comunidade AUVP'
    }
  }, [])

  const publish = (e) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    setPublishing(true)
    // Simula latência de rede para exibir o estado "loading" do botão
    setTimeout(() => {
      const id = createPost({ title: title.trim(), body: body.trim(), flair, tags })
      navigate(`/post/${id}`)
    }, 700)
  }

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-[15px]">
      <Link to="/" className="flex w-fit items-center gap-[6px] font-sora text-[12px] font-bold uppercase tracking-[0.05em] text-auvp-green hover:underline">
        <ArrowLeft size={14} weight="bold" /> Voltar ao Hub
      </Link>

      <div>
        <Eyebrow>Criação de Conteúdo</Eyebrow>
        <h1 className="mt-[4px] font-anek text-[30px] md:text-[41px] font-semibold leading-[1.15] text-auvp-green">Nova publicação</h1>
        <p className="mt-[8px] font-roboto text-[15px] text-auvp-gray-mid">
          Publicando como <strong className="text-auvp-chumbo">{currentUser.nickname}</strong> · {currentUser.turma}. Você
          seguirá automaticamente este tópico e receberá notificações de todas as interações.
        </p>
      </div>

      <form onSubmit={publish}>
        <Card className="flex flex-col gap-[20px]">
          <div>
            <label htmlFor="post-title" className="mb-[8px] block font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-auvp-green">
              Pergunta (título)
            </label>
            <input
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={140}
              placeholder="Ex.: Como declarar FIIs no imposto de renda?"
              className="w-full rounded-[5px] border border-black/15 p-[15px] font-anek text-[19px] font-semibold text-auvp-chumbo outline-none transition-all duration-240 focus:border-auvp-green"
            />
            <p className="mt-[4px] text-right font-roboto text-[12px] text-auvp-gray-mid">{title.length}/140</p>
          </div>

          <div>
            <label htmlFor="post-body" className="mb-[8px] block font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-auvp-green">
              Detalhamento
            </label>
            <div className="rounded-[5px] border border-black/15 transition-all duration-240 focus-within:border-auvp-green">
              <div className="flex gap-[4px] border-b border-black/[0.08] p-[8px]" role="toolbar" aria-label="Formatação de texto">
                {[TextB, TextItalic, ListBullets].map((Icon, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={['Negrito', 'Itálico', 'Lista'][i]}
                    className="rounded-[5px] p-[6px] text-auvp-gray-mid transition-all duration-240 hover:bg-auvp-gray hover:text-auvp-green"
                  >
                    <Icon size={16} weight="bold" />
                  </button>
                ))}
              </div>
              <textarea
                id="post-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={7}
                placeholder="Descreva o contexto, o que você já tentou e qual é exatamente a sua dúvida ou case…"
                className="w-full resize-y rounded-b-[5px] p-[15px] font-roboto text-[16px] leading-[1.6] outline-none"
              />
            </div>
          </div>

          <div>
            <p className="mb-[8px] font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-auvp-green">Flair institucional</p>
            <div className="flex flex-wrap gap-[8px]" role="radiogroup" aria-label="Seleção de flair">
              {Object.keys(FLAIRS).map((f) => (
                <button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={flair === f}
                  onClick={() => setFlair(f)}
                  className={`rounded-[5px] border p-[4px] transition-all duration-240 ${flair === f ? 'border-auvp-green' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <FlairBadge flair={f} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-[8px] font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-auvp-green">Tags (até 5)</p>
            {tags.length > 0 && (
              <div className="mb-[10px] flex flex-wrap gap-[8px]">
                {tags.map((t) => (
                  <span key={t} className="flex items-center gap-[4px] rounded-[4px] bg-auvp-green px-[10px] py-[3px] font-roboto text-[13px] text-white">
                    #{t}
                    <button type="button" onClick={() => setTags((ts) => ts.filter((x) => x !== t))} aria-label={`Remover tag ${t}`}>
                      <X size={12} weight="bold" />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="relative">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Digite para buscar tags…"
                aria-label="Adicionar tag"
                className="w-full rounded-[5px] border border-black/15 p-[12px] font-roboto text-[15px] outline-none transition-all duration-240 focus:border-auvp-green"
              />
              {autocomplete.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-10 mt-[4px] overflow-hidden rounded-[5px] border border-black/10 bg-white shadow-auvp-card">
                  {autocomplete.map((t) => (
                    <button key={t} type="button" onClick={() => addTag(t)} className="block w-full px-[15px] py-[10px] text-left font-roboto text-[14px] transition-all duration-240 hover:bg-auvp-gray">
                      #{t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {suggested.length > 0 && (
              <div className="mt-[10px] rounded-[5px] bg-auvp-gray p-[12px]">
                <p className="flex items-center gap-[6px] font-sora text-[10px] font-bold uppercase tracking-[0.15em] text-auvp-green">
                  <Sparkle size={13} weight="fill" /> Tags sugeridas pelo texto
                </p>
                <div className="mt-[8px] flex flex-wrap gap-[8px]">
                  {suggested.map((t) => (
                    <TagPill key={t} tag={t} onClick={() => addTag(t)} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-[15px] border-t border-black/[0.08] pt-[20px]">
            <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/')}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={!title.trim() || !body.trim() || publishing}>
              {publishing ? (
                <>
                  <span className="h-[16px] w-[16px] animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
                  Carregando...
                </>
              ) : (
                'Publicar no fórum'
              )}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  )
}
