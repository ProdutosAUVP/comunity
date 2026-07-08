import { Link, NavLink, Outlet } from 'react-router-dom'
import { ArrowLeft, ChartLine, ClockCounterClockwise, Flag, SealCheck, UsersThree } from '@phosphor-icons/react'
import { ToastStack } from '../../components/ui'

const NAV = [
  { to: '/moderacao', label: 'M-01 · Visão Geral', icon: ChartLine, end: true },
  { to: '/moderacao/denuncias', label: 'M-02 · Denúncias', icon: Flag },
  { to: '/moderacao/usuarios', label: 'M-03 · Usuários', icon: UsersThree },
  { to: '/moderacao/conselheiros', label: 'M-04 · Conselheiros', icon: SealCheck },
  { to: '/moderacao/auditoria', label: 'M-05 · Auditoria', icon: ClockCounterClockwise },
]

// Dashboard do moderador: dark mode nativo obrigatório em 100% das telas.
export default function ModLayout() {
  return (
    <div className="dark min-h-screen bg-black">
      <header className="border-b border-white/10 bg-auvp-green-dark">
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center gap-[15px] px-6">
          <Link
            to="/"
            className="flex items-center gap-[6px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-auvp-gray transition-all duration-240 hover:text-white"
          >
            <ArrowLeft size={15} weight="bold" /> Comunidade
          </Link>
          <div className="ml-auto flex items-center gap-[10px]">
            <span className="font-anek text-[18px] font-semibold text-white">
              Moderação <span className="text-auvp-yellow">AUVP</span>
            </span>
            <span className="rounded-[4px] bg-auvp-yellow px-[8px] py-[2px] font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-auvp-chumbo">
              Moderador oficial
            </span>
          </div>
        </div>
      </header>

      {/* Navegação em abas — mobile-first com adaptação desktop */}
      <nav className="sticky top-0 z-30 border-b border-white/10 bg-black" aria-label="Telas administrativas">
        <div className="mx-auto max-w-[1200px] overflow-x-auto scrollbar-thin px-6">
          <div className="flex min-w-max">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-[8px] border-b-2 px-[15px] py-[14px] font-sora text-[12px] font-bold uppercase tracking-[0.05em] transition-all duration-240 ${
                    isActive ? 'border-auvp-yellow text-auvp-yellow' : 'border-transparent text-auvp-gray hover:text-white'
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

      <main className="mx-auto max-w-[1200px] px-6 py-[30px] text-auvp-gray">
        <Outlet />
      </main>
      <ToastStack />
    </div>
  )
}
