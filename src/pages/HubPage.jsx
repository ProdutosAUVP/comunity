import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import PostCard from '../components/PostCard'
import CategoryGrid from '../components/CategoryGrid'
import { LiveNowBanner, UpcomingLiveCard } from '../components/Live'
import { EmptyState, Segmented } from '../components/ui'

const FEEDS = [
  { value: 'foryou', label: 'Para Você' },
  { value: 'following', label: 'Seguindo' },
  { value: 'updates', label: 'Atualizações AUVP' },
]

const HUB_TABS = [
  { value: 'feed', label: 'Feed' },
  { value: 'topicos', label: 'Tópicos' },
]

// Cronológico por padrão — o aluno só vê outra ordem se escolher "Votos".
const POST_SORTS = [
  { value: 'date', label: 'Data', cmp: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
  { value: 'votes', label: 'Votos', cmp: (a, b) => b.upvotes - a.upvotes },
]

export default function HubPage() {
  const { posts, currentUser } = useApp()
  const [view, setView] = useState('feed')
  const [feed, setFeed] = useState('foryou')
  const [postSort, setPostSort] = useState('date')

  const visiblePosts = useMemo(() => {
    // Excluídos (soft delete) nunca voltam a aparecer aqui — só são
    // recuperáveis via Log de Auditoria (M-05) no dashboard de moderação.
    const notDeleted = posts.filter((p) => !p.deleted)
    const bySort = POST_SORTS.find((s) => s.value === postSort).cmp
    if (feed === 'updates') {
      return notDeleted.filter((p) => p.feed === 'updates').sort(bySort)
    }
    if (feed === 'following') {
      return notDeleted.filter((p) => currentUser.following.includes(p.authorId)).sort(bySort)
    }
    return notDeleted.filter((p) => p.feed === 'foryou').sort(bySort)
  }, [feed, postSort, posts, currentUser])

  return (
    <div className="flex flex-col gap-[15px]">
      <div className="flex gap-[24px] border-b border-border" role="tablist" aria-label="Seções da comunidade">
        {HUB_TABS.map((t) => (
          <button
            key={t.value}
            role="tab"
            aria-selected={view === t.value}
            onClick={() => setView(t.value)}
            className={`-mb-px border-b-2 pb-[12px] font-anek text-[20px] font-semibold transition-all duration-240 md:text-[24px] ${
              view === t.value ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {view === 'topicos' ? (
        // "Tópicos" são as áreas (categorias/fóruns) da comunidade — não os
        // posts das pessoas, que ficam na aba "Feed".
        <CategoryGrid />
      ) : (
        <>
          <LiveNowBanner />
          <UpcomingLiveCard />

          <div className="flex flex-wrap items-center justify-between gap-[10px]">
            <div className="overflow-x-auto scrollbar-thin">
              <Segmented options={FEEDS} value={feed} onChange={setFeed} />
            </div>
            <Segmented options={POST_SORTS.map(({ value, label }) => ({ value, label }))} value={postSort} onChange={setPostSort} />
          </div>

          {visiblePosts.length === 0 ? (
            <EmptyState
              title="Nada por aqui ainda"
              subtitle={feed === 'following' ? 'Siga outros alunos para ver as publicações deles neste feed.' : 'Volte em breve para novidades.'}
            />
          ) : (
            visiblePosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </>
      )}
    </div>
  )
}
