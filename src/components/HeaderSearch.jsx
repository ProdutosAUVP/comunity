import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { stripMarkdown } from './RichText'
import { Avatar } from './ui'

// Busca reduzida do cabeçalho: um campo de verdade (não só um atalho para
// a página) que já sugere posts e usuários enquanto o aluno digita — uma
// versão condensada da Busca Avançada, só com recomendação rápida.
export default function HeaderSearch({ className = '', inputClassName = '' }) {
  const { posts, users } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const onPointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [])

  const q = query.trim().toLowerCase()

  const { postResults, userResults } = useMemo(() => {
    if (!q) return { postResults: [], userResults: [] }
    const postResults = posts
      .filter((p) => !p.hidden && !p.deleted)
      .filter((p) => `${p.title} ${stripMarkdown(p.body)} ${p.tags.join(' ')}`.toLowerCase().includes(q))
      .slice(0, 5)
    const userResults = Object.values(users)
      .filter((u) => u.name.toLowerCase().includes(q) || u.nickname.toLowerCase().includes(q))
      .slice(0, 4)
    return { postResults, userResults }
  }, [q, posts, users])

  const hasResults = postResults.length > 0 || userResults.length > 0

  const goToFullSearch = () => {
    navigate('/busca', { state: { initialQuery: query } })
    setOpen(false)
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          goToFullSearch()
        }}
        className="flex items-center gap-[8px] rounded-[5px] border border-border px-[12px] py-[9px] transition-all duration-240 focus-within:border-primary"
      >
        <MagnifyingGlass size={16} weight="bold" className="shrink-0 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Buscar posts, usuários, tags, turmas…"
          aria-label="Buscar"
          className={`w-full min-w-0 bg-transparent font-roboto text-[14px] text-foreground outline-none placeholder:text-muted-foreground ${inputClassName}`}
        />
      </form>

      {open && q && (
        <div className="absolute left-0 right-0 top-full z-20 mt-[6px] max-h-[70vh] overflow-y-auto scrollbar-thin rounded-[8px] border border-border bg-card shadow-auvp-card">
          {!hasResults ? (
            <p className="p-[15px] text-center font-roboto text-[13px] text-muted-foreground">Nenhum resultado para "{query}"</p>
          ) : (
            <>
              {userResults.length > 0 && (
                <div className="p-[8px]">
                  <p className="mb-[4px] px-[6px] font-sora text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Usuários</p>
                  {userResults.map((u) => (
                    <Link
                      key={u.id}
                      to={`/perfil/${u.id}`}
                      onClick={() => {
                        setOpen(false)
                        setQuery('')
                      }}
                      className="flex items-center gap-[10px] rounded-[5px] p-[8px] transition-all duration-240 hover:bg-muted"
                    >
                      <Avatar user={u} size={28} showRole={false} />
                      <span className="truncate font-roboto text-[14px] text-foreground">{u.nickname}</span>
                    </Link>
                  ))}
                </div>
              )}
              {postResults.length > 0 && (
                <div className="border-t border-border p-[8px]">
                  <p className="mb-[4px] px-[6px] font-sora text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Tópicos</p>
                  {postResults.map((p) => (
                    <Link
                      key={p.id}
                      to={`/post/${p.id}`}
                      onClick={() => {
                        setOpen(false)
                        setQuery('')
                      }}
                      className="block truncate rounded-[5px] p-[8px] font-roboto text-[14px] text-foreground transition-all duration-240 hover:bg-muted"
                    >
                      {p.title}
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
          <button
            type="button"
            onClick={goToFullSearch}
            className="block w-full border-t border-border p-[10px] text-center font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-primary transition-all duration-240 hover:bg-muted"
          >
            Ver todos os resultados na Busca Avançada
          </button>
        </div>
      )}
    </div>
  )
}
