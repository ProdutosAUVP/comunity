import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import PostCard from '../components/PostCard'
import { AreaPill, Avatar, Card, EmptyState, Eyebrow, RoleLabel, TagPill, TurmaTag } from '../components/ui'
import { ALL_TAGS, AREAS, FLAIRS, TURMAS } from '../data/mock'

const DATE_FILTERS = [
  { value: 'all', label: 'Qualquer data' },
  { value: '24h', label: 'Últimas 24h' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
]

export default function SearchPage() {
  const { posts, users } = useApp()
  const location = useLocation()
  // A busca reduzida do cabeçalho passa o termo digitado via router state
  // (link "Ver todos os resultados"), para não perder o que o aluno já tinha buscado.
  const [query, setQuery] = useState(location.state?.initialQuery || '')
  // O grid de categorias (aba "Tópicos" do Hub) abre a área já filtrada aqui.
  const [area, setArea] = useState(location.state?.initialArea || null)
  const [tags, setTags] = useState([])
  const [turma, setTurma] = useState(null)
  const [flair, setFlair] = useState(null)
  const [date, setDate] = useState('all')

  const toggleTag = (t) => setTags((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]))

  const { postResults, userResults } = useMemo(() => {
    const q = query.trim().toLowerCase()
    const maxAge = date === '24h' ? 86400e3 : date === '7d' ? 7 * 86400e3 : date === '30d' ? 30 * 86400e3 : Infinity

    const postResults = posts.filter((p) => {
      if (p.hidden) return false
      if (q && !`${p.title} ${p.body} ${p.tags.join(' ')}`.toLowerCase().includes(q)) return false
      if (area && p.area !== area) return false
      if (tags.length && !tags.every((t) => p.tags.includes(t))) return false
      if (turma && p.turma !== turma) return false
      if (flair && p.flair !== flair) return false
      if (Date.now() - new Date(p.createdAt).getTime() > maxAge) return false
      return true
    })

    const userResults = q
      ? Object.values(users).filter(
          (u) => u.name.toLowerCase().includes(q) || u.nickname.toLowerCase().includes(q),
        )
      : []

    return { postResults, userResults }
  }, [query, area, tags, turma, flair, date, posts, users])

  const hasFilters = query || area || tags.length || turma || flair || date !== 'all'

  return (
    <div className="flex flex-col gap-[15px]">
      <div>
        <Eyebrow>Descoberta e Organização</Eyebrow>
        <h1 className="mt-[4px] font-anek text-[30px] md:text-[41px] font-semibold leading-[1.15] text-foreground">Busca Avançada</h1>
        <p className="mt-[8px] font-roboto text-[16px] text-muted-foreground">
          Pesquise por posts, tópicos, usuários, grupos, tags, turmas e datas.
        </p>
      </div>

      <Card className="!p-[20px]">
        <label className="flex items-center gap-[10px] rounded-[5px] border border-border px-[15px] py-[12px] focus-within:border-primary transition-all duration-240">
          <MagnifyingGlass size={18} weight="bold" className="text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="O que você procura?"
            aria-label="Termo de busca"
            className="w-full bg-transparent font-roboto text-[16px] outline-none placeholder:text-muted-foreground"
            autoFocus
          />
        </label>

        {/* Filtros rápidos em pílulas */}
        <div className="mt-[15px] flex flex-col gap-[15px]">
          <div>
            <p className="mb-[8px] font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Área</p>
            <div className="flex flex-wrap gap-[8px]">
              {Object.entries(AREAS).map(([key, label]) => (
                <button key={key} onClick={() => setArea(area === key ? null : key)} className="rounded-[5px]">
                  <AreaPill label={label} active={area === key} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-[8px] font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Tags</p>
            <div className="flex flex-wrap gap-[8px]">
              {ALL_TAGS.map((t) => (
                <TagPill key={t} tag={t} active={tags.includes(t)} onClick={() => toggleTag(t)} />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-[30px]">
            <div>
              <p className="mb-[8px] font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Turma</p>
              <div className="flex flex-wrap gap-[8px]">
                {TURMAS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTurma(turma === t ? null : t)}
                    className={`rounded-[4px] border px-[10px] py-[3px] font-roboto text-[13px] transition-all duration-240 ${
                      turma === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-[8px] font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Flair</p>
              <div className="flex flex-wrap gap-[8px]">
                {Object.keys(FLAIRS).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFlair(flair === f ? null : f)}
                    className={`rounded-[4px] border px-[10px] py-[3px] font-roboto text-[13px] transition-all duration-240 ${
                      flair === f ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-[8px] font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Data</p>
              <div className="flex flex-wrap gap-[8px]">
                {DATE_FILTERS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDate(d.value)}
                    className={`rounded-[4px] border px-[10px] py-[3px] font-roboto text-[13px] transition-all duration-240 ${
                      date === d.value ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Resultados categorizados por tipo */}
      {userResults.length > 0 && (
        <section aria-label="Usuários encontrados">
          <h2 className="mb-[10px] font-anek text-[22px] font-semibold text-foreground">
            Usuários <span className="font-roboto text-[14px] font-normal text-muted-foreground">({userResults.length})</span>
          </h2>
          <div className="grid gap-[15px] sm:grid-cols-2">
            {userResults.map((u) => (
              <Link key={u.id} to={`/perfil/${u.id}`}>
                <Card hover className="!p-[15px]">
                  <div className="flex items-center gap-[10px]">
                    <Avatar user={u} size={40} />
                    <div className="min-w-0">
                      <p className="truncate font-roboto text-[15px] font-medium text-foreground">{u.nickname}</p>
                      <div className="mt-[2px] flex items-center gap-[6px]">
                        <TurmaTag turma={u.turma} />
                        <RoleLabel user={u} />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section aria-label="Tópicos encontrados">
        <h2 className="mb-[10px] font-anek text-[22px] font-semibold text-foreground">
          Tópicos <span className="font-roboto text-[14px] font-normal text-muted-foreground">({postResults.length})</span>
        </h2>
        <div className="flex flex-col gap-[15px]">
          {postResults.length === 0 ? (
            <EmptyState
              title={hasFilters ? 'Nenhum resultado com esses filtros' : 'Comece digitando ou selecione um filtro'}
              subtitle={hasFilters ? 'Tente remover algum filtro ou usar termos mais amplos.' : 'Você pode combinar texto, tags, turma, flair e período.'}
            />
          ) : (
            postResults.map((p) => <PostCard key={p.id} post={p} compact />)
          )}
        </div>
      </section>
    </div>
  )
}
