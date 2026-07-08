import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChatCircle } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import CoverArt from './CoverArt'
import { Avatar } from './ui'
import { stripMarkdown } from './RichText'
import { AREAS, AREA_DESCRIPTIONS, timeAgo } from '../data/mock'
import gifChart from '../assets/bento/chart.gif'
import gifCoin from '../assets/bento/coin.gif'
import gifConfetti from '../assets/bento/confetti.gif'
import gifWave from '../assets/bento/wave.gif'
import gifPulse from '../assets/bento/pulse.gif'
import gifSparkle from '../assets/bento/sparkle.gif'

// Capas por área — alterna entre as ilustrações abstratas (CoverArt) e os
// GIFs gerados localmente, na ordem das áreas, só para dar identidade visual
// a cada categoria sem depender de fotos externas.
const COVERS = ['chart', gifWave, 'ocean', gifCoin, 'skyline', gifConfetti, 'allocation', gifPulse, gifChart, gifSparkle]

function coverFor(index) {
  const c = COVERS[index % COVERS.length]
  return typeof c === 'string' ? <CoverArt id={c} className="h-full w-full" /> : <img src={c} alt="" className="h-full w-full object-cover" />
}

// Número de seguidores é sintético (a plataforma não modela "seguir uma
// área"): estimado a partir do volume de posts, com uma variação
// determinística por área para não parecerem todos redondos demais.
function estimateFollowers(areaKey, postCount) {
  let seed = 0
  for (let i = 0; i < areaKey.length; i++) seed += areaKey.charCodeAt(i) * (i + 1)
  return postCount * 6 + (seed % 40)
}

// Visão "Tópicos": categorias da comunidade (fóruns), não os posts em si —
// espelha a listagem de categorias do Discourse real, em formato de grid.
export default function CategoryGrid() {
  const { posts, users } = useApp()
  const navigate = useNavigate()

  const categories = useMemo(
    () =>
      Object.entries(AREAS).map(([key, label], index) => {
        const areaPosts = posts.filter((p) => p.area === key && !p.hidden && !p.deleted)
        const latest = areaPosts.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
        const latestAuthor = latest ? users[latest.authorId] : null
        return {
          key,
          label,
          description: AREA_DESCRIPTIONS[key] || '',
          postCount: areaPosts.length,
          followerCount: estimateFollowers(key, areaPosts.length),
          latest,
          latestAuthor,
          cover: coverFor(index),
        }
      }),
    [posts, users],
  )

  const openCategory = (key) => navigate('/busca', { state: { initialArea: key } })

  return (
    <div className="grid gap-[15px] sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((c) => (
        <button
          key={c.key}
          onClick={() => openCategory(c.key)}
          className="flex flex-col overflow-hidden rounded-[12px] border border-border bg-card text-left transition-all duration-240 hover:shadow-auvp-card hover:-translate-y-[2px]"
        >
          <div className="h-[110px] w-full shrink-0">{c.cover}</div>
          <div className="flex flex-1 flex-col p-[15px]">
            <div className="flex items-center gap-[8px]">
              <ChatCircle size={16} weight="fill" className="shrink-0 text-primary" />
              <span className="font-anek text-[16px] font-semibold leading-tight text-foreground">{c.label}</span>
            </div>
            <p className="mt-[2px] font-roboto text-[11px] text-muted-foreground">
              {c.postCount} posts · {c.followerCount} seguidores
            </p>
            {c.description && <p className="mt-[8px] font-roboto text-[13px] leading-[1.5] text-muted-foreground line-clamp-3">{c.description}</p>}

            {c.latest && c.latestAuthor && (
              <div className="mt-[12px] flex items-start gap-[8px] border-t border-border pt-[10px]">
                <Avatar user={c.latestAuthor} size={22} showRole={false} />
                <div className="min-w-0">
                  <p className="truncate font-roboto text-[12px] font-medium text-primary">{c.latest.title}</p>
                  <p className="mt-[2px] line-clamp-2 font-roboto text-[12px] text-foreground/70">{stripMarkdown(c.latest.body)}</p>
                  <p className="mt-[4px] truncate font-roboto text-[11px] text-muted-foreground">
                    Última resposta por {c.latestAuthor.nickname} · {timeAgo(c.latest.createdAt)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  )
}
