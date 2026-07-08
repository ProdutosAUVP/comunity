import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowFatUp, CaretLeft, CaretRight, ChatCircle, X } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { timeAgo } from '../data/mock'
import { Avatar, Button, FLAIR_TOKENS, FlairBadge, TurmaTag } from './ui'

const RING_CLASS = {
  info: 'ring-info',
  primary: 'ring-primary',
  destructive: 'ring-destructive',
  success: 'ring-success',
  warning: 'ring-warning',
  neutral: 'ring-border',
}

// Tópicos da comunidade em formato de stories (bolinhas no topo do Hub,
// como no Instagram). Anel colorido = ainda não visto; cinza = já visto.
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
      {/* Bolinhas no topo */}
      <div className="overflow-x-auto scrollbar-thin" role="list" aria-label="Tópicos em alta">
        <div className="flex gap-[15px] pb-[8px]">
          {stories.map((post, i) => {
            const author = users[post.authorId]
            const token = FLAIR_TOKENS[post.flair] || 'primary'
            const wasSeen = seen.has(post.id)
            return (
              <button
                key={post.id}
                role="listitem"
                onClick={() => openStory(i)}
                className="flex w-[76px] shrink-0 flex-col items-center gap-[6px] text-center"
                aria-label={`Story do tópico: ${post.title}`}
              >
                <span
                  className={`flex h-[66px] w-[66px] items-center justify-center rounded-full ring-2 ring-offset-2 ring-offset-background p-[3px] transition-all duration-240 hover:scale-[1.05] ${
                    wasSeen ? 'ring-border' : RING_CLASS[token]
                  }`}
                >
                  <span className="flex h-full w-full items-center justify-center rounded-full border-[3px] border-background bg-muted font-anek text-[18px] font-semibold text-foreground">
                    {author.initials}
                  </span>
                </span>
                <span className={`w-full truncate font-roboto text-[11px] leading-tight ${wasSeen ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                  {post.title}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Visualizador em tela cheia estilo Instagram — seção de impacto,
          sempre em fundo escuro independente do tema do app. */}
      {active && (
        <div className="dark fixed inset-0 z-50 flex flex-col bg-background" role="dialog" aria-modal="true" aria-label={`Story: ${active.title}`}>
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
              <p className="mt-[15px] font-roboto text-[16px] leading-[1.6] text-muted-foreground line-clamp-4">{active.body}</p>
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
