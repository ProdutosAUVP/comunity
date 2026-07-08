import { Link, NavLink, Outlet } from 'react-router-dom'
import { ArrowLeft, ChartLine, ClockCounterClockwise, Flag, SealCheck, UsersThree } from '@phosphor-icons/react'
import { ToastStack } from '../../components/ui'
import AuvpLogo from '../../components/AuvpLogo'

const NAV = [
  { to: '/moderacao', label: 'M-01 · Visão Geral', icon: ChartLine, end: true },
  { to: '/moderacao/denuncias', label: 'M-02 · Denúncias', icon: Flag },
  { to: '/moderacao/usuarios', label: 'M-03 · Usuários', icon: UsersThree },
  { to: '/moderacao/conselheiros', label: 'M-04 · Conselheiros', icon: SealCheck },
  { to: '/moderacao/auditoria', label: 'M-05 · Auditoria', icon: ClockCounterClockwise },
]

// Dashboard do moderador: dark mode nativo obrigatório em 100% das telas,
// independente da preferência de tema do aluno. Verde (accent) reservado
// para o único acento pontual: a aba ativa.
export default function ModLayout() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur-md">
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center gap-[15px] px-6">
          <Link
            to="/"
            className="flex items-center gap-[6px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-muted-foreground transition-all duration-240 hover:text-foreground"
          >
            <ArrowLeft size={15} weight="bold" /> Comunidade
          </Link>
          <div className="ml-auto flex items-center gap-[10px]">
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-[5px] bg-accent p-[5px] text-accent-foreground">
              <AuvpLogo className="h-full w-full" />
            </span>
            <span className="font-anek text-[18px] font-semibold text-foreground">
              Moderação <span className="text-accent">AUVP</span>
            </span>
            <span className="rounded-[4px] bg-accent/10 px-[8px] py-[2px] font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-accent">
              Moderador oficial
            </span>
          </div>
        </div>
      </header>

      {/* Navegação em abas — mobile-first com adaptação desktop; glass sutil */}
      <nav className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-md" aria-label="Telas administrativas">
        <div className="mx-auto max-w-[1200px] overflow-x-auto scrollbar-thin px-6">
          <div className="flex min-w-max">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-[8px] border-b-2 px-[15px] py-[14px] font-sora text-[12px] font-bold uppercase tracking-[0.05em] transition-all duration-240 ${
                    isActive ? 'border-accent text-accent' : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`
                }
              >
                <Icon size={16} weight="bold" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[1200px] px-6 py-[30px] text-foreground">
        <Outlet />
      </main>
      <ToastStack />
    </div>
  )
}
