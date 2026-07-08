import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkle, X } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { AreaPill, Button, Card, Eyebrow, FlairBadge, TagPill } from '../components/ui'
import RichComposer from '../components/RichComposer'
import CoverPicker from '../components/CoverPicker'
import { ALL_TAGS, AREAS, FLAIRS, suggestArea, suggestTags } from '../data/mock'

export default function CreatePostPage() {
  const { createPost, currentUser } = useApp()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [flair, setFlair] = useState('Dúvida')
  const [cover, setCover] = useState(null)
  const [area, setArea] = useState(null)
  const [areaTouched, setAreaTouched] = useState(false)
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [publishing, setPublishing] = useState(false)

  // Sugestão automática de tags baseada no texto (simula IA)
  const suggested = useMemo(
    () => suggestTags(`${title} ${body}`).filter((t) => !tags.includes(t)),
    [title, body, tags],
  )

  // Sugestão automática de área baseada no texto (simula IA) — só entra em
  // ação enquanto o autor não escolher manualmente uma área.
  const suggestedArea = useMemo(() => suggestArea(`${title} ${body}`), [title, body])
  useEffect(() => {
    if (!areaTouched && suggestedArea) setArea(suggestedArea)
  }, [suggestedArea, areaTouched])

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
    if (!area) return
    setPublishing(true)
    // Simula latência de rede para exibir o estado "loading" do botão
    setTimeout(() => {
      const id = createPost({ title: title.trim(), body: body.trim(), flair, area, tags, cover })
      navigate(`/post/${id}`)
    }, 700)
  }

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-[15px]">
      <Link to="/" className="flex w-fit items-center gap-[6px] font-sora text-[12px] font-bold uppercase tracking-[0.05em] text-primary hover:underline">
        <ArrowLeft size={14} weight="bold" /> Voltar ao Início
      </Link>

      <div>
        <Eyebrow>Criação de Conteúdo</Eyebrow>
        <h1 className="mt-[4px] font-anek text-[30px] md:text-[41px] font-semibold leading-[1.15] text-foreground">Nova publicação</h1>
        <p className="mt-[8px] font-roboto text-[15px] text-muted-foreground">
          Publicando como <strong className="text-foreground">{currentUser.nickname}</strong> · {currentUser.turma}. Você
          seguirá automaticamente este tópico e receberá notificações de todas as interações.
        </p>
      </div>

      <form onSubmit={publish}>
        <Card className="flex flex-col gap-[20px]">
          <div>
            <label htmlFor="post-title" className="mb-[8px] block font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Pergunta (título)
            </label>
            <input
              id="post-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={140}
              placeholder="Ex.: Como declarar FIIs no imposto de renda?"
              className="w-full rounded-[5px] border border-border bg-background p-[15px] font-anek text-[19px] font-semibold text-foreground outline-none transition-all duration-240 focus:border-primary"
            />
            <p className="mt-[4px] text-right font-roboto text-[12px] text-muted-foreground">{title.length}/140</p>
          </div>

          <div>
            <label className="mb-[8px] block font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Detalhamento
            </label>
            <RichComposer
              value={body}
              onChange={setBody}
              rows={7}
              placeholder="Descreva o contexto, o que você já tentou e qual é exatamente a sua dúvida ou case…"
              ariaLabel="Detalhamento do post"
              textareaClassName="text-[16px]"
            />
          </div>

          <div>
            <p className="mb-[8px] font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Capa (opcional)
            </p>
            <CoverPicker value={cover} onChange={setCover} />
          </div>

          <div>
            <p className="mb-[8px] font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Área (obrigatório)
            </p>
            <div className="flex flex-wrap gap-[8px]" role="radiogroup" aria-label="Seleção de área">
              {Object.entries(AREAS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={area === key}
                  onClick={() => {
                    setArea(key)
                    setAreaTouched(true)
                  }}
                  className="rounded-[5px]"
                >
                  <AreaPill label={label} active={area === key} />
                </button>
              ))}
            </div>
            {!areaTouched && suggestedArea && (
              <p className="mt-[8px] flex items-center gap-[6px] font-roboto text-[12px] text-muted-foreground">
                <Sparkle size={13} weight="fill" className="text-primary" /> Área sugerida automaticamente pelo texto — pode
                trocar quando quiser.
              </p>
            )}
          </div>

          <div>
            <p className="mb-[8px] font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Flair institucional</p>
            <div className="flex flex-wrap gap-[8px]" role="radiogroup" aria-label="Seleção de flair">
              {Object.keys(FLAIRS).map((f) => (
                <button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={flair === f}
                  onClick={() => setFlair(f)}
                  className={`rounded-[5px] border p-[4px] transition-all duration-240 ${flair === f ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <FlairBadge flair={f} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-[8px] font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Tags (até 5)</p>
            {tags.length > 0 && (
              <div className="mb-[10px] flex flex-wrap gap-[8px]">
                {tags.map((t) => (
                  <span key={t} className="flex items-center gap-[4px] rounded-[4px] bg-primary/10 px-[10px] py-[3px] font-roboto text-[13px] text-primary">
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
                className="w-full rounded-[5px] border border-border bg-background p-[12px] font-roboto text-[15px] text-foreground outline-none transition-all duration-240 focus:border-primary"
              />
              {autocomplete.length > 0 && (
                <div className="absolute left-0 right-0 top-full z-10 mt-[4px] overflow-hidden rounded-[5px] border border-border bg-card shadow-auvp-card">
                  {autocomplete.map((t) => (
                    <button key={t} type="button" onClick={() => addTag(t)} className="block w-full px-[15px] py-[10px] text-left font-roboto text-[14px] text-foreground transition-all duration-240 hover:bg-muted">
                      #{t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {suggested.length > 0 && (
              <div className="mt-[10px] rounded-[5px] bg-muted p-[12px]">
                <p className="flex items-center gap-[6px] font-sora text-[10px] font-bold uppercase tracking-[0.15em] text-primary">
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

          <div className="flex justify-end gap-[15px] border-t border-border pt-[20px]">
            <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/')}>
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={!title.trim() || !body.trim() || !area || publishing}>
              {publishing ? (
                <>
                  <span className="h-[16px] w-[16px] animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" aria-hidden />
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
