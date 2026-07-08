import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Anchor,
  Boat,
  ChatCircleText,
  Eye,
  Lock,
  LockOpen,
  MapTrifold,
  Medal,
  SealCheck,
  ThumbsUp,
  Trophy,
  UserPlus,
} from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import PostCard from '../components/PostCard'
import { Avatar, Button, Card, EmptyState, Eyebrow, ProgressBar, RoleLabel, Segmented, TurmaTag } from '../components/ui'
import { BADGES, LORE_LEVELS, RECENT_VISITORS, SHOP_ITEMS, loreForXp, timeAgo } from '../data/mock'

// Paleta do gráfico PIAR: majoritariamente tons neutros + um único acento
// (verde institucional) — visualização de dados, não decoração de UI.
const PIE_COLORS = ['#023619', '#5A8770', '#8C8C8C', '#B7B7B7', '#1B1B1B']

const BADGE_ICONS = { Anchor, ChatCircleText, ThumbsUp, SealCheck, Boat, Trophy }

function PiarPie({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0)
  let acc = 0
  const slices = data.map((d, i) => {
    const start = (acc / total) * 2 * Math.PI
    acc += d.value
    const end = (acc / total) * 2 * Math.PI
    const large = end - start > Math.PI ? 1 : 0
    const x1 = 60 + 52 * Math.sin(start)
    const y1 = 60 - 52 * Math.cos(start)
    const x2 = 60 + 52 * Math.sin(end)
    const y2 = 60 - 52 * Math.cos(end)
    return <path key={d.label} d={`M60 60 L${x1} ${y1} A52 52 0 ${large} 1 ${x2} ${y2} Z`} fill={PIE_COLORS[i % PIE_COLORS.length]} />
  })
  return (
    <div className="flex flex-wrap items-center gap-[20px]">
      <svg viewBox="0 0 120 120" className="h-[120px] w-[120px]" role="img" aria-label="Gráfico de alocação do PIAR">
        {slices}
      </svg>
      <ul className="flex flex-col gap-[4px]">
        {data.map((d, i) => (
          <li key={d.label} className="flex items-center gap-[8px] font-roboto text-[13px] text-foreground">
            <span className="h-[10px] w-[10px] rounded-[2px]" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
            {d.label} — {d.value}%
          </li>
        ))}
      </ul>
    </div>
  )
}

// Narrativa visual do progresso (Lore: barcos e ilhas) — seção de impacto,
// sempre em fundo escuro independente do tema do app.
function LoreJourney({ xp }) {
  const lore = loreForXp(xp)
  return (
    <div className="dark rounded-[12px] border border-border bg-card p-[20px] md:p-[30px]">
      <Eyebrow>Jornada do Navegante</Eyebrow>
      <div className="mt-[15px] flex flex-wrap items-center gap-[15px]">
        <span className="flex h-[56px] w-[56px] items-center justify-center rounded-[12px] bg-muted">
          <Boat size={30} weight="fill" className="text-accent" />
        </span>
        <div>
          <p className="font-anek text-[24px] font-semibold leading-tight text-foreground">
            {lore.boat} <span className="text-accent">· Nível {lore.level}</span>
          </p>
          <p className="font-roboto text-[14px] text-muted-foreground">Ancorado na {lore.island}</p>
        </div>
      </div>

      {/* Rota entre ilhas */}
      <div className="mt-[30px] overflow-x-auto scrollbar-thin pb-[8px]">
        <div className="flex min-w-[560px] items-center">
          {LORE_LEVELS.map((l, i) => {
            const reached = xp >= l.minXp
            const isCurrent = l.level === lore.level
            return (
              <div key={l.level} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-[6px]">
                  <span
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-full border-[3px] border-background ${
                      isCurrent ? 'bg-accent' : reached ? 'bg-primary' : 'bg-muted'
                    }`}
                    title={l.island}
                  >
                    <MapTrifold
                      size={15}
                      weight="fill"
                      className={isCurrent ? 'text-accent-foreground' : reached ? 'text-primary-foreground' : 'text-muted-foreground'}
                    />
                  </span>
                  <span className={`max-w-[90px] text-center font-roboto text-[10px] leading-tight ${reached ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {l.island.replace('Ilha da ', '').replace('Ilha dos ', '').replace('Ilha das ', '')}
                  </span>
                </div>
                {i < LORE_LEVELS.length - 1 && (
                  <div className={`mx-[4px] h-[3px] flex-1 ${xp >= LORE_LEVELS[i + 1].minXp ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {lore.next && (
        <div className="mt-[20px]">
          <div className="mb-[6px] flex justify-between font-roboto text-[12px] text-muted-foreground">
            <span>
              {xp} XP · rumo à {lore.next.island}
            </span>
            <span>{lore.progress}%</span>
          </div>
          <ProgressBar value={lore.progress} />
        </div>
      )}
    </div>
  )
}

export default function ProfilePage() {
  const { userId } = useParams()
  const { users, currentUser, posts, comments, toggleFollow, settings, updateSettings, toast } = useApp()
  const [tab, setTab] = useState('sobre')

  const user = users[userId]
  const isMe = userId === currentUser.id

  const userPosts = useMemo(() => posts.filter((p) => p.authorId === userId && !p.hidden), [posts, userId])
  const userComments = useMemo(() => comments.filter((c) => c.authorId === userId), [comments, userId])

  if (!user) return <EmptyState title="Usuário não encontrado" />

  const following = currentUser.following.includes(userId)
  const followsMe = user.following.includes(currentUser.id)
  const isFriend = following && followsMe

  return (
    <div className="flex flex-col gap-[15px]">
      {/* Cabeçalho de identidade */}
      <Card>
        <div className="flex flex-wrap items-start gap-[20px]">
          <Avatar user={user} size={80} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-[10px]">
              <h1 className="font-anek text-[28px] md:text-[34px] font-semibold leading-tight text-foreground">{user.nickname}</h1>
              <RoleLabel user={user} />
              <TurmaTag turma={user.turma} />
            </div>
            {/* Nome legal visível apenas no próprio perfil; nas interações aparece só o apelido */}
            {isMe && <p className="mt-[2px] font-roboto text-[14px] text-muted-foreground">{user.name} · visível apenas para você e para a moderação</p>}
            <div className="mt-[10px] flex flex-wrap gap-[20px] font-roboto text-[14px] text-muted-foreground">
              <span>
                <strong className="text-foreground">{user.followers.length}</strong> seguidores
              </span>
              <span>
                <strong className="text-foreground">{user.following.length}</strong> seguindo
              </span>
              <span>
                <strong className="text-foreground">{user.xp}</strong> XP
              </span>
              {isFriend && !isMe && <span className="text-primary font-medium">✓ Vocês são amigos</span>}
            </div>
          </div>
          {!isMe && (
            <div className="flex gap-[10px]">
              <Button size="sm" variant={following ? 'outline' : 'primary'} onClick={() => toggleFollow(userId)}>
                <UserPlus size={15} weight="bold" /> {following ? 'Seguindo' : 'Seguir'}
              </Button>
              <Link to="/mensagens">
                <Button size="sm" variant="ghost">
                  <ChatCircleText size={15} weight="bold" /> DM
                </Button>
              </Link>
            </div>
          )}
        </div>
      </Card>

      <LoreJourney xp={user.xp} />

      {/* Perfil modular: Sobre mim / Atividades */}
      <Segmented
        options={[
          { value: 'sobre', label: 'Sobre mim' },
          { value: 'atividades', label: 'Atividades', count: userPosts.length + userComments.length },
        ]}
        value={tab}
        onChange={setTab}
      />

      {tab === 'sobre' ? (
        <div className="flex flex-col gap-[15px]">
          <Card>
            <Eyebrow>Institucional</Eyebrow>
            <p className="mt-[10px] font-roboto text-[16px] leading-[1.6] text-foreground">{user.bio}</p>
            <p className="mt-[15px] font-roboto text-[13px] text-muted-foreground">Membro da comunidade {timeAgo(user.joinedAt)}</p>
          </Card>

          <Card>
            <Eyebrow>Badges e conquistas</Eyebrow>
            <div className="mt-[15px] grid gap-[15px] sm:grid-cols-2">
              {user.badges.map((bid) => {
                const b = BADGES[bid]
                const Icon = BADGE_ICONS[b.icon] || Medal
                return (
                  <div key={bid} className="flex items-center gap-[12px] rounded-[12px] bg-muted p-[15px]">
                    <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Icon size={20} weight="fill" className="text-primary" />
                    </span>
                    <div>
                      <p className="font-roboto text-[15px] font-medium text-foreground">{b.name}</p>
                      <p className="font-roboto text-[13px] text-muted-foreground">{b.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {isMe && (
            <Card>
              <Eyebrow>Loja de personalização</Eyebrow>
              <p className="mt-[8px] font-roboto text-[14px] text-muted-foreground">
                Badges, títulos e níveis liberam novas personalizações de uso.
              </p>
              <div className="mt-[15px] flex flex-col gap-[10px]">
                {SHOP_ITEMS.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center gap-[10px] rounded-[12px] border border-border p-[15px]">
                    {item.unlocked ? <LockOpen size={18} weight="bold" className="text-primary" /> : <Lock size={18} weight="bold" className="text-muted-foreground" />}
                    <div className="min-w-0 flex-1">
                      <p className={`font-roboto text-[15px] font-medium ${item.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>{item.name}</p>
                      <p className="font-roboto text-[12px] text-muted-foreground">
                        {item.type} · requisito: {item.requirement}
                      </p>
                    </div>
                    {item.unlocked ? (
                      <Button size="xs" variant="outline" onClick={() => toast(`"${item.name}" aplicado ao seu perfil.`)}>
                        Usar
                      </Button>
                    ) : (
                      <span className="font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-muted-foreground">Bloqueado</span>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Integração PIAR — opcional, reciprocidade */}
          {(isMe || (user.piarOptIn && isFriend)) && user.piar && (
            <Card>
              <div className="flex flex-wrap items-center justify-between gap-[10px]">
                <Eyebrow>Alocação PIAR (opcional)</Eyebrow>
                {isMe && (
                  <button
                    onClick={() => updateSettings({ piarOptIn: !settings.piarOptIn })}
                    className="font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-primary hover:underline"
                  >
                    {settings.piarOptIn ? 'Ocultar dos amigos' : 'Exibir para amigos'}
                  </button>
                )}
              </div>
              <p className="mt-[8px] font-roboto text-[13px] text-muted-foreground">
                Visível somente sob reciprocidade: apenas amigos que também compartilham a própria alocação.
              </p>
              <div className="mt-[15px]">
                <PiarPie data={user.piar} />
              </div>
            </Card>
          )}

          {/* Visitantes recentes — reciprocidade LGPD */}
          {isMe && (
            <Card>
              <Eyebrow>Visitantes recentes</Eyebrow>
              <p className="mt-[8px] font-roboto text-[13px] text-muted-foreground">
                <Eye size={14} weight="bold" className="mr-[4px] inline" />
                Regra de privacidade cruzada: você só vê quem visitou seu perfil porque também permite ser visto.
              </p>
              <div className="mt-[15px] flex flex-col gap-[10px]">
                {RECENT_VISITORS.map((v) => (
                  <Link key={v.userId} to={`/perfil/${v.userId}`} className="flex items-center gap-[10px] rounded-[5px] p-[8px] transition-all duration-240 hover:bg-muted">
                    <Avatar user={users[v.userId]} size={34} />
                    <span className="font-roboto text-[14px] font-medium text-foreground">{users[v.userId].nickname}</span>
                    <span className="ml-auto font-roboto text-[12px] text-muted-foreground">{timeAgo(v.visitedAt)}</span>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-[15px]">
          <Card className="!p-[20px]">
            <Eyebrow>Histórico de tópicos criados</Eyebrow>
          </Card>
          {userPosts.length === 0 ? (
            <EmptyState title="Nenhum tópico publicado ainda" />
          ) : (
            userPosts.map((p) => <PostCard key={p.id} post={p} compact />)
          )}
          <Card className="!p-[20px]">
            <Eyebrow>Últimos comentários</Eyebrow>
            <div className="mt-[15px] flex flex-col gap-[10px]">
              {userComments.slice(-6).reverse().map((c) => {
                const post = posts.find((p) => p.id === c.postId)
                return (
                  <Link key={c.id} to={`/post/${c.postId}`} className="rounded-[12px] bg-muted p-[15px] transition-all duration-240 hover:shadow-auvp-card">
                    <p className="font-roboto text-[14px] text-foreground line-clamp-2">“{c.body}”</p>
                    <p className="mt-[6px] font-roboto text-[12px] text-muted-foreground">
                      em <strong>{post?.title}</strong> · {timeAgo(c.createdAt)} · {c.upvotes} votos
                    </p>
                  </Link>
                )
              })}
              {userComments.length === 0 && <p className="font-roboto text-[14px] text-muted-foreground">Nenhum comentário ainda.</p>}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
