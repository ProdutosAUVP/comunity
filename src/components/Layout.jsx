import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  Bell,
  ChatsCircle,
  GearSix,
  House,
  List,
  MagnifyingGlass,
  Moon,
  Plus,
  ShieldStar,
  Sparkle,
  Sun,
  UsersThree,
  X,
} from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
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

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      className="rounded-[5px] p-[8px] text-foreground transition-all duration-240 hover:bg-muted"
    >
      {theme === 'dark' ? <Sun size={19} weight="bold" /> : <Moon size={19} weight="bold" />}
    </button>
  )
}

export default function Layout({ children }) {
  const { currentUser, notifications, conversations } = useApp()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const unread = notifications.filter((n) => !n.read).length
  const pendingDms = conversations.filter((c) => c.box === 'solicitacoes').length

  const navLinkCls = ({ isActive }) =>
    `flex items-center gap-[10px] rounded-[5px] px-[15px] py-[11px] font-roboto text-[15px] transition-all duration-240 ${
      isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
    }`

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Barra superior — cromada neutra; verde reservado à marca (logo) e a estados ativos */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-saturate-150">
        <div className="mx-auto flex h-[64px] max-w-[1200px] items-center gap-[15px] px-6">
          {/* Menu hamburguer (mobile) — a navegação inferior não é usada aqui
              porque a Comunidade roda embutida no SuperApp, que já tem sua
              própria barra de navegação inferior. */}
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Abrir menu de navegação"
            className="rounded-[5px] p-[8px] text-foreground lg:hidden"
          >
            <List size={22} weight="bold" />
          </button>

          <Link to="/" className="flex items-center gap-[8px]" aria-label="Comunidade AUVP — início">
            <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[5px] bg-primary font-anek text-[18px] font-bold text-primary-foreground">
              A
            </span>
            <span className="hidden sm:block font-anek text-[20px] font-semibold text-foreground leading-none">
              Comunidade AUVP
            </span>
          </Link>

          <button
            onClick={() => navigate('/busca')}
            className="ml-auto flex min-w-0 flex-1 max-w-[420px] items-center gap-[8px] rounded-[5px] border border-border px-[15px] py-[9px] text-left font-roboto text-[14px] text-muted-foreground transition-all duration-240 hover:border-primary"
            aria-label="Abrir busca avançada"
          >
            <MagnifyingGlass size={16} weight="bold" />
            <span className="truncate">Buscar posts, usuários, tags, turmas…</span>
          </button>

          <ThemeToggle />

          <Link
            to="/notificacoes"
            className="relative rounded-[5px] p-[8px] text-foreground transition-all duration-240 hover:bg-muted"
            aria-label={`Notificações${unread ? `, ${unread} não lidas` : ''}`}
          >
            <Bell size={20} weight="bold" />
            {unread > 0 && (
              <span className="absolute -right-[2px] -top-[2px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-destructive px-[4px] font-sora text-[10px] font-bold text-destructive-foreground">
                {unread}
              </span>
            )}
          </Link>

          <Link
            to="/moderacao"
            className="hidden md:flex items-center gap-[6px] rounded-[5px] border border-border px-[12px] py-[8px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-foreground transition-all duration-240 hover:border-primary hover:text-primary"
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
              <NavLink key={to} to={to} end={end} className={navLinkCls}>
                <Icon size={18} weight="bold" />
                {label}
                {to === '/notificacoes' && unread > 0 && (
                  <span className="ml-auto rounded-[4px] bg-destructive px-[6px] font-sora text-[10px] font-bold text-destructive-foreground">{unread}</span>
                )}
                {to === '/mensagens' && pendingDms > 0 && (
                  <span className="ml-auto rounded-[4px] bg-destructive px-[6px] font-sora text-[10px] font-bold text-destructive-foreground">{pendingDms}</span>
                )}
              </NavLink>
            ))}
            <div className="mt-[15px] border-t border-border pt-[15px]">
              <NavLink to="/moderacao" className="flex items-center gap-[10px] rounded-[5px] px-[15px] py-[11px] font-roboto text-[15px] text-muted-foreground transition-all duration-240 hover:bg-muted hover:text-foreground">
                <ShieldStar size={18} weight="bold" /> Dashboard Moderação
              </NavLink>
            </div>
          </div>
        </nav>

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {/* Botão flutuante de nova postagem */}
      <Link
        to="/novo-post"
        aria-label="Criar nova publicação"
        className="fixed bottom-[74px] right-[20px] z-40 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-auvp-card transition-all duration-240 hover:opacity-90 animate-pulse-ring"
      >
        <Plus size={26} weight="bold" />
      </Link>

      {/* Drawer de navegação (mobile) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu de navegação">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="animate-drawer-in absolute left-0 top-0 h-full w-[280px] max-w-[80vw] overflow-y-auto scrollbar-thin bg-background p-[20px]">
            <div className="mb-[20px] flex items-center justify-between">
              <span className="font-anek text-[18px] font-semibold text-foreground">Comunidade AUVP</span>
              <button onClick={() => setDrawerOpen(false)} aria-label="Fechar menu" className="rounded-[5px] p-[6px] text-muted-foreground hover:bg-muted">
                <X size={20} weight="bold" />
              </button>
            </div>
            <div className="flex flex-col gap-[4px]" onClick={() => setDrawerOpen(false)}>
              {NAV.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} className={navLinkCls}>
                  <Icon size={18} weight="bold" />
                  {label}
                </NavLink>
              ))}
              <div className="mt-[15px] border-t border-border pt-[15px]">
                <NavLink to="/moderacao" className="flex items-center gap-[10px] rounded-[5px] px-[15px] py-[11px] font-roboto text-[15px] text-muted-foreground transition-all duration-240 hover:bg-muted hover:text-foreground">
                  <ShieldStar size={18} weight="bold" /> Dashboard Moderação
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastStack />
    </div>
  )
}
