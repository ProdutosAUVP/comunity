import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowFatUp, CaretLeft, CaretRight, ChatCircle, X } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { timeAgo } from '../data/mock'
import { Avatar, Button, FlairBadge, TurmaTag } from './ui'
import { stripMarkdown } from './RichText'
import gifChart from '../assets/bento/chart.gif'
import gifCoin from '../assets/bento/coin.gif'
import gifConfetti from '../assets/bento/confetti.gif'
import gifWave from '../assets/bento/wave.gif'
import gifPulse from '../assets/bento/pulse.gif'
import gifSparkle from '../assets/bento/sparkle.gif'

// GIFs de memes gerados localmente (sem dependência externa, sem reusar
// templates de terceiros) para dar um visual arrojado e engraçado aos tiles
// do bentobox — cada tópico em alta recebe um looping cômico diferente.
const BENTO_GIFS = [gifChart, gifCoin, gifConfetti, gifWave, gifPulse, gifSparkle]

// Alterna a altura de cada tile para dar ritmo de "bentobox" mesmo com todos
// ocupando 100% da largura (evita buracos de grid em telas estreitas).
const BENTO_HEIGHTS = ['h-[220px]', 'h-[150px]', 'h-[180px]', 'h-[150px]', 'h-[200px]', 'h-[160px]']

// Tópicos em alta no topo do Hub, em formato de bentobox (grid assimétrico
// com GIFs animados). Ao tocar um tile, abre o mesmo visualizador em tela
// cheia estilo stories. Ponto de destaque (verde) = ainda não visto.
export default function TopicStories() {
  const { posts, users, comments } = useApp()
  const navigate = useNavigate()
  const [seen, setSeen] = useState(() => new Set())
  const [viewerIndex, setViewerIndex] = useState(null)

  // Tópicos em alta: mais votados das últimas publicações visíveis
  const stories = useMemo(
    () =>
      posts
        .filter((p) => !p.hidden)
        .sort((a, b) => b.upvotes - a.upvotes)
        .slice(0, 8),
    [posts],
  )

  const openStory = (index) => {
    setViewerIndex(index)
    setSeen((s) => new Set(s).add(stories[index].id))
  }

  const goTo = (index) => {
    if (index < 0 || index >= stories.length) {
      setViewerIndex(null)
      return
    }
    openStory(index)
  }

  // Avanço automático de story a cada 6s
  useEffect(() => {
    if (viewerIndex === null) return
    const t = setTimeout(() => goTo(viewerIndex + 1), 6000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerIndex])

  useEffect(() => {
    if (viewerIndex === null) return
    const onKey = (e) => {
      if (e.key === 'Escape') setViewerIndex(null)
      if (e.key === 'ArrowRight') goTo(viewerIndex + 1)
      if (e.key === 'ArrowLeft') goTo(viewerIndex - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewerIndex])

  if (stories.length === 0) return null

  const active = viewerIndex !== null ? stories[viewerIndex] : null
  const activeAuthor = active ? users[active.authorId] : null
  const activeComments = active ? comments.filter((c) => c.postId === active.id).length : 0

  return (
    <>
      {/* Mobile: lista compacta (sem GIF de fundo, só uma miniatura) */}
      <div className="flex flex-col gap-[8px] sm:hidden" role="list" aria-label="Tópicos em alta">
        {stories.map((post, i) => {
          const author = users[post.authorId]
          const wasSeen = seen.has(post.id)
          const gif = BENTO_GIFS[i % BENTO_GIFS.length]
          return (
            <button
              key={post.id}
              role="listitem"
              onClick={() => openStory(i)}
              aria-label={`Ver tópico em destaque: ${post.title}`}
              className="flex items-center gap-[10px] rounded-[10px] border border-border bg-card p-[8px] text-left transition-all duration-240 active:scale-[0.99]"
            >
              <span className="relative shrink-0 overflow-hidden rounded-[8px]">
                <img src={gif} alt="" aria-hidden className="h-[48px] w-[48px] object-cover" />
                {!wasSeen && <span className="absolute right-[3px] top-[3px] h-[7px] w-[7px] rounded-full bg-accent ring-2 ring-black/30" aria-hidden />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-anek text-[14px] font-semibold leading-tight text-foreground line-clamp-1">{post.title}</p>
                <p className="mt-[2px] flex items-center gap-[8px] font-roboto text-[11px] text-muted-foreground">
                  <span>{author.nickname}</span>
                  <span className="flex items-center gap-[2px]">
                    <ArrowFatUp size={11} weight="bold" /> {post.upvotes}
                  </span>
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Tablet/desktop: bentobox de visual arrojado com GIFs, tiles sempre
          em largura total (evita buracos de grid em telas mais estreitas) */}
      <div className="hidden flex-col gap-[10px] sm:flex" role="list" aria-label="Tópicos em alta">
        {stories.map((post, i) => {
          const author = users[post.authorId]
          const wasSeen = seen.has(post.id)
          const gif = BENTO_GIFS[i % BENTO_GIFS.length]
          const height = BENTO_HEIGHTS[i % BENTO_HEIGHTS.length]
          return (
            <button
              key={post.id}
              role="listitem"
              onClick={() => openStory(i)}
              aria-label={`Ver tópico em destaque: ${post.title}`}
              className={`group relative w-full overflow-hidden rounded-[14px] text-left transition-all duration-240 hover:-translate-y-[2px] ${height}`}
            >
              <img src={gif} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover transition-transform duration-240 group-hover:scale-[1.06]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
              {!wasSeen && <span className="absolute right-[15px] top-[15px] h-[9px] w-[9px] rounded-full bg-accent ring-2 ring-black/40" aria-hidden />}
              <div className="absolute left-[15px] top-[15px] flex items-center gap-[6px]">
                <Avatar user={author} size={26} showRole={false} />
                <span className="font-roboto text-[12px] font-medium text-white/90">{author.nickname}</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-[15px]">
                <p className="font-anek text-[18px] font-semibold leading-tight text-white line-clamp-2 md:text-[22px]">{post.title}</p>
                <p className="mt-[6px] flex items-center gap-[4px] font-roboto text-[12px] text-white/70">
                  <ArrowFatUp size={13} weight="bold" /> {post.upvotes}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Visualizador em tela cheia estilo Instagram — seção de impacto,
          sempre em fundo escuro independente do tema do app. */}
      {active && (
        <div className="dark fixed inset-0 z-[90] flex flex-col bg-background" role="dialog" aria-modal="true" aria-label={`Story: ${active.title}`}>
          {/* Barras de progresso */}
          <div className="flex gap-[5px] p-[15px]">
            {stories.map((s, i) => (
              <div key={s.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-muted">
                {i < viewerIndex && <div className="h-full w-full bg-accent" />}
                {i === viewerIndex && <div key={active.id} className="h-full bg-accent animate-story-bar" />}
              </div>
            ))}
          </div>

          {/* Cabeçalho do story */}
          <div className="flex items-center gap-[10px] px-[20px] pt-[4px]">
            <Avatar user={activeAuthor} size={36} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-roboto text-[14px] font-medium text-foreground">{activeAuthor.nickname}</p>
              <p className="font-roboto text-[12px] text-muted-foreground">{timeAgo(active.createdAt)}</p>
            </div>
            <TurmaTag turma={activeAuthor.turma} />
            <button
              onClick={() => setViewerIndex(null)}
              aria-label="Fechar stories"
              className="rounded-[5px] p-[8px] text-foreground transition-all duration-240 hover:bg-muted"
            >
              <X size={22} weight="bold" />
            </button>
          </div>

          {/* Conteúdo do tópico */}
          <div className="relative flex flex-1 items-center justify-center px-[30px]">
            <button aria-label="Story anterior" onClick={() => goTo(viewerIndex - 1)} className="absolute inset-y-0 left-0 z-10 w-1/4" />
            <button aria-label="Próximo story" onClick={() => goTo(viewerIndex + 1)} className="absolute inset-y-0 right-0 z-10 w-1/4" />

            <div className="max-w-[560px] text-center">
              <FlairBadge flair={active.flair} />
              <h2 className="mt-[15px] font-anek text-[28px] md:text-[41px] font-semibold leading-[1.15] text-foreground">
                {active.title}
              </h2>
              <p className="mt-[15px] font-roboto text-[16px] leading-[1.6] text-muted-foreground line-clamp-4">{stripMarkdown(active.body)}</p>
              <div className="mt-[20px] flex items-center justify-center gap-[20px] font-roboto text-[14px] text-muted-foreground">
                <span className="flex items-center gap-[6px]">
                  <ArrowFatUp size={16} weight="bold" className="text-accent" /> {active.upvotes} votos
                </span>
                <span className="flex items-center gap-[6px]">
                  <ChatCircle size={16} weight="bold" className="text-accent" /> {activeComments} comentários
                </span>
              </div>
              <div className="relative z-20 mt-[45px]">
                <Button variant="primary" size="sm" onClick={() => navigate(`/post/${active.id}`)}>
                  Abrir tópico completo
                </Button>
              </div>
            </div>
          </div>

          {/* Navegação inferior */}
          <div className="flex items-center justify-center gap-[30px] pb-[30px]">
            <button
              onClick={() => goTo(viewerIndex - 1)}
              disabled={viewerIndex === 0}
              aria-label="Anterior"
              className="rounded-full border border-border p-[10px] text-foreground transition-all duration-240 hover:bg-muted disabled:opacity-30"
            >
              <CaretLeft size={18} weight="bold" />
            </button>
            <span className="font-sora text-[12px] font-bold text-muted-foreground">
              {viewerIndex + 1} / {stories.length}
            </span>
            <button
              onClick={() => goTo(viewerIndex + 1)}
              aria-label="Próximo"
              className="rounded-full border border-border p-[10px] text-foreground transition-all duration-240 hover:bg-muted"
            >
              <CaretRight size={18} weight="bold" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
