import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  Bell,
  ChatsCircle,
  Compass,
  GearSix,
  House,
  List,
  MagnifyingGlass,
  Moon,
  Plus,
  ShieldCheck,
  ShieldStar,
  Sparkle,
  Sun,
  UsersThree,
  X,
} from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import { Avatar, ToastStack } from './ui'
import AuvpEscolaLogo from './AuvpEscolaLogo'
import HeaderSearch from './HeaderSearch'

const NAV = [
  { to: '/', label: 'Início', icon: House, end: true },
  { to: '/busca', label: 'Busca Avançada', icon: MagnifyingGlass },
  { to: '/conselheiros', label: 'Conselheiros', icon: Compass },
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
  const { currentUser, notifications, conversations, moderationMode, toggleModerationMode } = useApp()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const unread = notifications.filter((n) => !n.read).length
  const pendingDms = conversations.filter((c) => c.box === 'solicitacoes').length

  const navLinkCls = ({ isActive }) =>
    `flex items-center gap-[10px] rounded-[5px] px-[15px] py-[11px] font-roboto text-[15px] transition-all duration-240 ${
      isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'
    }`

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Cabeçalho mobile: a faixa da logo vem primeiro (rola normalmente
          junto com o conteúdo). A faixa de ações (busca, sino, avatar) é
          "sticky" — ocupa o lugar dela logo abaixo da logo normalmente, e
          gruda no topo assim que a logo rola pra fora, ficando sempre
          acessível daí em diante. */}
      <div className="flex h-[84px] items-center justify-center border-b border-border/60 bg-background lg:hidden">
        <Link to="/" aria-label="Comunidade AUVP — início">
          <AuvpEscolaLogo className="h-[72px] w-auto text-foreground" />
        </Link>
      </div>

      <div className="sticky top-0 z-50 flex h-[64px] items-center gap-[10px] border-b border-border/60 bg-background/70 backdrop-blur-md px-4 lg:hidden">
        {/* Menu hamburguer — a navegação inferior não é usada aqui porque a
            Comunidade roda embutida no SuperApp, que já tem sua própria
            barra de navegação inferior. */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Abrir menu de navegação"
          className="shrink-0 rounded-[5px] p-[8px] text-foreground"
        >
          <List size={22} weight="bold" />
        </button>

        <HeaderSearch className="min-w-0 flex-1" />

        <ThemeToggle />

        <Link
          to="/notificacoes"
          className="relative shrink-0 rounded-[5px] p-[8px] text-foreground transition-all duration-240 hover:bg-muted"
          aria-label={`Notificações${unread ? `, ${unread} não lidas` : ''}`}
        >
          <Bell size={20} weight="bold" />
          {unread > 0 && (
            <span className="absolute -right-[2px] -top-[2px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-destructive px-[4px] font-sora text-[10px] font-bold text-destructive-foreground">
              {unread}
            </span>
          )}
        </Link>

        <Link to={`/perfil/${currentUser.id}`} aria-label="Meu perfil" className="shrink-0">
          <Avatar user={currentUser} size={36} showRole={false} />
        </Link>
      </div>

      {/* Cabeçalho desktop — única linha, glass sutil, abaixo da barra
          global do SuperApp. */}
      <header className="sticky top-[40px] z-40 hidden border-b border-border/60 bg-background/70 backdrop-blur-md lg:block">
        <div className="mx-auto flex h-[84px] max-w-[1200px] items-center gap-[15px] px-6">
          <Link to="/" aria-label="Comunidade AUVP — início">
            <AuvpEscolaLogo className="h-[72px] w-auto text-foreground" />
          </Link>

          <HeaderSearch className="ml-auto min-w-0 max-w-[420px] flex-1" />

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
            className="flex items-center gap-[6px] rounded-[5px] border border-border px-[12px] py-[8px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-foreground transition-all duration-240 hover:border-primary hover:text-primary"
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
          <div className="sticky top-[94px] lg:top-[154px] flex flex-col gap-[4px]">
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
              <button
                onClick={toggleModerationMode}
                aria-pressed={moderationMode}
                className={`flex w-full items-center gap-[10px] rounded-[5px] px-[15px] py-[11px] font-roboto text-[15px] transition-all duration-240 ${
                  moderationMode ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <ShieldCheck size={18} weight={moderationMode ? 'fill' : 'bold'} />
                {moderationMode ? 'Moderando comunidade' : 'Moderar comunidade'}
              </button>
            </div>
          </div>
        </nav>

        <main className="min-w-0 flex-1">
          {moderationMode && (
            <div className="mb-[15px] flex flex-wrap items-center gap-[10px] rounded-[8px] border border-accent/30 bg-accent/5 px-[15px] py-[10px]">
              <ShieldCheck size={16} weight="fill" className="text-accent" />
              <p className="font-roboto text-[13px] text-foreground">
                Modo de moderação ativo — tópicos ganham controles de editar, ocultar, mover e excluir.
              </p>
              <button onClick={toggleModerationMode} className="ml-auto font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-accent hover:underline">
                Sair do modo
              </button>
            </div>
          )}
          {children}
        </main>
      </div>

      {/* Botão flutuante de nova postagem */}
      <Link
        to="/novo-post"
        aria-label="Criar nova publicação"
        className="fixed bottom-[74px] lg:bottom-[24px] right-[20px] z-40 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-primary text-primary-foreground shadow-auvp-card transition-all duration-240 hover:opacity-90 animate-pulse-ring"
      >
        <Plus size={26} weight="bold" />
      </Link>

      {/* Drawer de navegação (mobile) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu de navegação">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawerOpen(false)} />
          <div className="animate-drawer-in absolute left-0 top-0 h-full w-[280px] max-w-[80vw] overflow-y-auto scrollbar-thin border-r border-border/60 bg-background/80 backdrop-blur-md p-[20px]">
            <div className="mb-[20px] flex items-center justify-between">
              <AuvpEscolaLogo className="h-[44px] w-auto text-foreground" />
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
              <div className="mt-[15px] border-t border-border pt-[15px]" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={toggleModerationMode}
                  aria-pressed={moderationMode}
                  className={`flex w-full items-center gap-[10px] rounded-[5px] px-[15px] py-[11px] font-roboto text-[15px] transition-all duration-240 ${
                    moderationMode ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <ShieldCheck size={18} weight={moderationMode ? 'fill' : 'bold'} />
                  {moderationMode ? 'Moderando comunidade' : 'Moderar comunidade'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastStack />
    </div>
  )
}
