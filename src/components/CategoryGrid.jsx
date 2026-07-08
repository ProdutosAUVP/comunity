import { useEffect, useMemo, useState } from 'react'
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

// Capas de fallback (ilustrações abstratas + GIFs locais) — usadas enquanto o
// meme do Giphy carrega, ou se a busca falhar/estiver bloqueada na rede.
const FALLBACK_COVERS = ['chart', gifWave, 'ocean', gifCoin, 'skyline', gifConfetti, 'allocation', gifPulse, gifChart, gifSparkle]

function fallbackCoverFor(index) {
  const c = FALLBACK_COVERS[index % FALLBACK_COVERS.length]
  return typeof c === 'string' ? <CoverArt id={c} className="h-full w-full" /> : <img src={c} alt="" className="h-full w-full object-cover" />
}

// Termo de busca de meme no Giphy para cada área — cada categoria ganha um
// GIF animado real relacionado ao assunto (mesma chave pública usada no
// GifPickerModal do RichComposer.jsx).
const GIPHY_API_KEY = 'dc6zaTOxFJmzC'
const MEME_QUERY = {
  avisos: 'attention meme',
  'bagunca-tema-livre': 'chaos meme funny',
  depoimentos: 'success story meme',
  'renda-variavel': 'stock market meme',
  'renda-fixa': 'safe boring meme',
  'organizacao-financeira': 'budget spreadsheet meme',
  'criptomoedas-e-defi': 'bitcoin crypto meme',
  confissionario: 'confession meme',
  desafios: 'challenge accepted meme',
  'previdencia-privada': 'retirement meme',
  'relacoes-profissionais': 'office meme',
  'carreira-e-empreendedorismo': 'hustle startup meme',
  lives: 'live stream meme',
  'debates-e-resumos-de-aulas': 'studying meme',
  'sugestoes-e-reclamacoes': 'feedback meme',
  'precisa-de-ajuda': 'help sos meme',
  'dicionario-do-mercado': 'confused math lady meme',
}

// Cache em módulo (memória) + localStorage (entre sessões) — a chave pública
// de demonstração do Giphy tem limite de uso baixo e compartilhado
// globalmente com qualquer outro app que a use, então buscar o mesmo meme
// de novo a cada visita à aba Tópicos esgotaria a cota rapidamente.
const STORAGE_PREFIX = 'auvp:giphy-cover:'
const STORAGE_TTL = 7 * 86400e3 // 7 dias

const memeCache = new Map()

function readStoredCover(areaKey) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + areaKey)
    if (!raw) return null
    const { url, savedAt } = JSON.parse(raw)
    if (!url || Date.now() - savedAt > STORAGE_TTL) return null
    return url
  } catch {
    return null
  }
}

function storeCover(areaKey, url) {
  try {
    localStorage.setItem(STORAGE_PREFIX + areaKey, JSON.stringify({ url, savedAt: Date.now() }))
  } catch {
    // localStorage indisponível (modo privado, cota cheia etc.) — segue só com o cache em memória.
  }
}

function CategoryCover({ areaKey, index }) {
  const query = MEME_QUERY[areaKey]
  const [url, setUrl] = useState(() => memeCache.get(areaKey) || readStoredCover(areaKey) || null)

  useEffect(() => {
    if (url || !query) return
    const controller = new AbortController()
    // Escalona as buscas (uma categoria por vez, ~200ms de intervalo) em vez
    // de disparar todas de uma vez — evita estourar de imediato o limite de
    // requisições da chave pública quando o grid inteiro monta junto.
    const delay = setTimeout(() => {
      fetch(`https://api.giphy.com/v1/gifs/translate?api_key=${GIPHY_API_KEY}&s=${encodeURIComponent(query)}&rating=g`, {
        signal: controller.signal,
      })
        .then((r) => {
          if (!r.ok) throw new Error(`status ${r.status}`)
          return r.json()
        })
        .then((data) => {
          const gifUrl = data?.data?.images?.fixed_height?.url || data?.data?.images?.original?.url
          if (gifUrl) {
            memeCache.set(areaKey, gifUrl)
            storeCover(areaKey, gifUrl)
            setUrl(gifUrl)
          }
        })
        .catch(() => {
          // Rede bloqueada, chave sem cota (429) ou sem resultado: mantém a capa de fallback local.
        })
    }, index * 200)
    return () => {
      controller.abort()
      clearTimeout(delay)
    }
  }, [areaKey, query, url, index])

  if (!url) return fallbackCoverFor(index)
  return <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
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
          index,
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
          <div className="h-[110px] w-full shrink-0">
            <CategoryCover areaKey={c.key} index={c.index} />
          </div>
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
