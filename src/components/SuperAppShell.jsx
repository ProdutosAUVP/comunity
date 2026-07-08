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
      {/* Barra global do SuperApp (desktop) — só texto, sem ícones. Alinhada
          à esquerda com o conteúdo abaixo (mesmo container/padding do
          cabeçalho e do corpo da página), não centralizada na tela. */}
      <nav
        className="sticky top-0 z-[80] hidden h-[40px] border-b border-border/60 bg-background/70 backdrop-blur-md lg:flex"
        aria-label="Menu global do SuperApp AUVP (mockado)"
      >
        <div className="mx-auto flex w-full max-w-[1200px] items-center gap-[30px] px-6">
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
        </div>
      </nav>

      <div className="flex-1">{children}</div>

      {/* Navegação inferior do SuperApp (mobile) — só ícones, glass sutil */}
      <nav
        className="sticky bottom-0 z-[70] flex items-center justify-around border-t border-border/60 bg-background/70 backdrop-blur-md py-[10px] lg:hidden"
        aria-label="Navegação do SuperApp AUVP (mockada)"
      >
        {TABS.map((tab) => {
          const isActive = tab.key === 'comunidade'
          const Icon = tab.icon
          return (
            <div key={tab.key} className="flex flex-1 items-center justify-center py-[4px]" aria-current={isActive ? 'page' : undefined} aria-label={tab.label} title={tab.label}>
              <Icon size={24} weight={isActive ? 'fill' : 'bold'} className={isActive ? 'text-primary' : 'text-muted-foreground'} />
            </div>
          )
        })}
      </nav>
    </div>
  )
}
