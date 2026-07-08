import { GraduationCap, House, UsersThree, Wrench } from '@phosphor-icons/react'

// Casca MOCKADA do SuperApp AUVP. A Comunidade é apenas um módulo dentro do
// SuperApp — que já possui sua própria navegação global. Este componente
// existe só para demonstrar esse contexto; a aba "Comunidade" é a única
// funcional aqui (as demais são ilustrativas).
//
// No desktop, o SuperApp se apresenta como uma barra global de texto acima
// do cabeçalho do módulo (menu global). No mobile, vira a barra de abas
// inferior nativa do app, com ícones.
export const SUPERAPP_TOPBAR_HEIGHT = 40

const TABS = [
  { key: 'inicio', label: 'Início', icon: House },
  { key: 'aulas', label: 'Aulas', icon: GraduationCap },
  { key: 'ferramentas', label: 'Ferramentas', icon: Wrench },
  { key: 'comunidade', label: 'Comunidade', icon: UsersThree },
]

export default function SuperAppShell({ children }) {
  return (
    <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col bg-muted/40">
      {/* Barra global do SuperApp (desktop) — só texto, sem ícones */}
      <nav
        className="sticky top-0 z-[80] hidden h-[40px] items-center justify-center gap-[30px] border-b border-border/60 bg-background/70 backdrop-blur-md lg:flex"
        aria-label="Menu global do SuperApp AUVP (mockado)"
      >
        {TABS.map((tab) => {
          const isActive = tab.key === 'comunidade'
          return (
            <span
              key={tab.key}
              aria-current={isActive ? 'page' : undefined}
              className={`font-sora text-[12px] font-bold uppercase tracking-[0.05em] ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {tab.label}
            </span>
          )
        })}
      </nav>

      <div className="flex-1">{children}</div>

      {/* Navegação inferior do SuperApp (mobile) — ícones + texto, glass sutil */}
      <nav
        className="sticky bottom-0 z-[70] flex items-center justify-around border-t border-border/60 bg-background/70 backdrop-blur-md py-[6px] lg:hidden"
        aria-label="Navegação do SuperApp AUVP (mockada)"
      >
        {TABS.map((tab) => {
          const isActive = tab.key === 'comunidade'
          const Icon = tab.icon
          return (
            <div key={tab.key} className="flex flex-1 flex-col items-center gap-[2px] py-[6px]" aria-current={isActive ? 'page' : undefined}>
              <Icon size={22} weight={isActive ? 'fill' : 'bold'} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
              <span className={`font-sora text-[10px] font-bold uppercase tracking-[0.03em] ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {tab.label}
              </span>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
