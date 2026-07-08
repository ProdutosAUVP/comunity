import { useMemo, useState } from 'react'
import { useApp } from '../context/AppContext'
import PostCard from '../components/PostCard'
import TopicStories from '../components/TopicStories'
import { LiveNowBanner, UpcomingLiveCard } from '../components/Live'
import { EmptyState, Eyebrow, Segmented } from '../components/ui'

const FEEDS = [
  { value: 'foryou', label: 'Para Você' },
  { value: 'following', label: 'Seguindo' },
  { value: 'updates', label: 'Atualizações AUVP' },
]

export default function HubPage() {
  const { posts, currentUser } = useApp()
  const [feed, setFeed] = useState('foryou')

  const visiblePosts = useMemo(() => {
    if (feed === 'updates') {
      return posts.filter((p) => p.feed === 'updates').sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    if (feed === 'following') {
      return posts
        .filter((p) => currentUser.following.includes(p.authorId))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }
    // "Para Você": ordenação simples por afinidade (mesma turma pesa mais) + engajamento
    return posts
      .filter((p) => p.feed === 'foryou')
      .map((p) => ({ p, score: p.upvotes + (p.turma === currentUser.turma ? 40 : 0) }))
      .sort((a, b) => b.score - a.score)
      .map(({ p }) => p)
  }, [feed, posts, currentUser])

  return (
    <div className="flex flex-col gap-[15px]">
      <div>
        <Eyebrow>Comunidade AUVP</Eyebrow>
        <h1 className="mt-[4px] font-anek text-[30px] md:text-[41px] font-semibold leading-[1.15] text-foreground">
          Hub da Comunidade
        </h1>
      </div>

      <TopicStories />

      <LiveNowBanner />
      <UpcomingLiveCard />

      <div className="overflow-x-auto scrollbar-thin">
        <Segmented options={FEEDS} value={feed} onChange={setFeed} />
      </div>

      {visiblePosts.length === 0 ? (
        <EmptyState
          title="Nada por aqui ainda"
          subtitle={feed === 'following' ? 'Siga outros alunos para ver as publicações deles neste feed.' : 'Volte em breve para novidades.'}
        />
      ) : (
        visiblePosts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </div>
  )
}
