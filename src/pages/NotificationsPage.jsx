import { Link } from 'react-router-dom'
import { ArrowFatUp, Bell, Broadcast, ChatCircle, GearSix, Medal, ShieldStar, Sparkle, UserPlus } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { Button, Card, EmptyState, Eyebrow } from '../components/ui'
import { timeAgo } from '../data/mock'

const TYPE_ICON = {
  reply: ChatCircle,
  voto: ArrowFatUp,
  follow: UserPlus,
  live: Broadcast,
  badge: Medal,
  moderation: ShieldStar,
  retro: Sparkle,
}

export default function NotificationsPage() {
  const { notifications, markNotificationsRead, markNotificationRead, settings } = useApp()
  const unread = notifications.filter((n) => !n.read).length
  const sorted = [...notifications].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  return (
    <div className="flex flex-col gap-[15px]">
      <div className="flex flex-wrap items-end justify-between gap-[15px]">
        <div>
          <Eyebrow>Central de Notificações</Eyebrow>
          <h1 className="mt-[4px] font-anek text-[30px] md:text-[41px] font-semibold leading-[1.15] text-foreground">Notificações</h1>
          {settings.dnd && (
            <p className="mt-[6px] font-roboto text-[13px] text-muted-foreground">
              Modo "não perturbe" ativo — novos alertas ficam silenciados conforme suas preferências.
            </p>
          )}
        </div>
        <div className="flex items-center gap-[10px]">
          {unread > 0 && (
            <Button size="xs" variant="outline" onClick={markNotificationsRead}>
              Marcar todas como lidas
            </Button>
          )}
          <Link
            to="/configuracoes"
            aria-label="Configurações de notificação"
            className="rounded-[5px] border border-border bg-card p-[10px] text-muted-foreground transition-all duration-240 hover:text-primary hover:border-primary"
          >
            <GearSix size={18} weight="bold" />
          </Link>
        </div>
      </div>

      <Card className="!p-[10px]">
        {sorted.length === 0 && <EmptyState title="Nenhuma notificação" />}
        {sorted.map((n) => {
          const Icon = TYPE_ICON[n.type] || Bell
          return (
            <Link
              key={n.id}
              to={n.link}
              onClick={() => markNotificationRead(n.id)}
              className={`flex items-start gap-[12px] rounded-[8px] p-[15px] transition-all duration-240 hover:bg-muted ${n.read ? '' : 'bg-muted/60'}`}
            >
              <span className={`mt-[2px] flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full ${n.read ? 'bg-muted text-muted-foreground' : 'bg-primary/10 text-primary'}`}>
                <Icon size={17} weight="bold" />
              </span>
              <span className="min-w-0 flex-1">
                <span className={`block font-roboto text-[15px] leading-[1.5] ${n.read ? 'text-muted-foreground' : 'text-foreground font-medium'}`}>
                  {n.text}
                </span>
                <span className="mt-[2px] block font-roboto text-[12px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
              </span>
              {!n.read && <span className="mt-[6px] h-[9px] w-[9px] shrink-0 rounded-full bg-primary" aria-label="Não lida" />}
            </Link>
          )
        })}
      </Card>
    </div>
  )
}
