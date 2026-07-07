import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChatsCircle,
  GearSix,
  House,
  MagnifyingGlass,
  Plus,
  ShieldStar,
  Sparkle,
  UsersThree,
} from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { Avatar, ToastStack } from './ui'

const NAV = [
  { to: '/', label: 'Hub da Comunidade', icon: House, end: true },
  { to: '/busca', label: 'Busca Avançada', icon: MagnifyingGlass },
  { to: '/conexoes', label: 'Conexões', icon: UsersThree },
  { to: '/mensagens', label: 'Mensagens', icon: ChatsCircle },
  { to: '/notificacoes', label: 'Notificações', icon: Bell },
  { to: '/retrospectiva', label: 'Retrospectiva', icon: Sparkle },
  { to: '/configuracoes', label: 'Configurações', icon: GearSix },
]

export default function Layout({ children }) {
  const { currentUser, notifications, conversations } = useApp()
  const navigate = useNavigate()
  const unread = notifications.filter((n) => !n.read).length
  const pendingDms = conversations.filter((c) => c.box === 'solicitacoes').length

  return (
    <div className="min-h-screen bg-auvp-gray">
      {/* Barra superior */}
      <header className="sticky top-0 z-40 bg-auvp-green">
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center gap-[15px] px-6">
          <Link to="/" className="flex items-center gap-[8px]" aria-label="Comunidade AUVP — início">
            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[5px] bg-auvp-yellow font-anek text-[18px] font-bold text-auvp-green">
              A
            </span>
            <span className="hidden sm:block font-anek text-[20px] font-semibold text-white leading-none">
              Comunidade <span className="text-auvp-yellow">AUVP</span>
            </span>
          </Link>

          <button
            onClick={() => navigate('/busca')}
            className="ml-auto flex min-w-0 flex-1 max-w-[420px] items-center gap-[8px] rounded-[5px] border border-white/25 px-[15px] py-[9px] text-left font-roboto text-[14px] text-white/70 transition-all duration-240 hover:border-white"
            aria-label="Abrir busca avançada"
          >
            <MagnifyingGlass size={16} weight="bold" />
            <span className="truncate">Buscar posts, usuários, tags, turmas…</span>
          </button>

          <Link
            to="/notificacoes"
            className="relative rounded-[5px] p-[8px] text-white transition-all duration-240 hover:bg-white/10"
            aria-label={`Notificações${unread ? `, ${unread} não lidas` : ''}`}
          >
            <Bell size={20} weight="bold" />
            {unread > 0 && (
              <span className="absolute -right-[2px] -top-[2px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-auvp-yellow px-[4px] font-sora text-[10px] font-bold text-auvp-chumbo">
                {unread}
              </span>
            )}
          </Link>

          <Link
            to="/moderacao"
            className="hidden md:flex items-center gap-[6px] rounded-[5px] border border-white/25 px-[12px] py-[8px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-white transition-all duration-240 hover:bg-white hover:text-auvp-green"
          >
            <ShieldStar size={15} weight="bold" /> Moderação
          </Link>

          <Link to={`/perfil/${currentUser.id}`} aria-label="Meu perfil">
            <Avatar user={currentUser} size={36} showRole={false} />
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-[1200px] gap-[30px] px-6 py-[30px]">
        {/* Navegação lateral (desktop) */}
        <nav className="hidden lg:block w-[240px] shrink-0" aria-label="Navegação principal">
          <div className="sticky top-[94px] flex flex-col gap-[4px]">
            {NAV.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-[10px] rounded-[5px] px-[15px] py-[11px] font-roboto text-[15px] transition-all duration-240 ${
                    isActive ? 'bg-auvp-green text-white' : 'text-auvp-chumbo hover:bg-white'
                  }`
                }
              >
                <Icon size={18} weight="bold" />
                {label}
                {to === '/notificacoes' && unread > 0 && (
                  <span className="ml-auto rounded-[4px] bg-auvp-yellow px-[6px] font-sora text-[10px] font-bold text-auvp-chumbo">{unread}</span>
                )}
                {to === '/mensagens' && pendingDms > 0 && (
                  <span className="ml-auto rounded-[4px] bg-auvp-yellow px-[6px] font-sora text-[10px] font-bold text-auvp-chumbo">{pendingDms}</span>
                )}
              </NavLink>
            ))}
            <div className="mt-[15px] border-t border-black/[0.08] pt-[15px]">
              <NavLink
                to="/moderacao"
                className="flex items-center gap-[10px] rounded-[5px] px-[15px] py-[11px] font-roboto text-[15px] text-auvp-gray-mid transition-all duration-240 hover:bg-white hover:text-auvp-green"
              >
                <ShieldStar size={18} weight="bold" /> Dashboard Moderação
              </NavLink>
            </div>
          </div>
        </nav>

        <main className="min-w-0 flex-1 pb-[90px] lg:pb-0">{children}</main>
      </div>

      {/* Botão flutuante de nova postagem */}
      <Link
        to="/novo-post"
        aria-label="Criar nova publicação"
        className="fixed bottom-[80px] lg:bottom-[30px] right-[20px] z-40 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-auvp-green text-white shadow-auvp-card transition-all duration-240 hover:bg-auvp-green-dark animate-pulse-ring"
      >
        <Plus size={26} weight="bold" />
      </Link>

      {/* Navegação inferior (mobile) */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around border-t border-black/[0.08] bg-white py-[8px] lg:hidden"
        aria-label="Navegação móvel"
      >
        {NAV.slice(0, 5).map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={label}
            className={({ isActive }) =>
              `rounded-[5px] p-[10px] transition-all duration-240 ${isActive ? 'text-auvp-green bg-auvp-gray' : 'text-auvp-gray-mid'}`
            }
          >
            <Icon size={22} weight="bold" />
          </NavLink>
        ))}
      </nav>

      <ToastStack />
    </div>
  )
}
