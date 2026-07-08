import { useState } from 'react'
import { Broadcast, CalendarBlank, FileArrowDown, Play, Users } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { LIVES, formatDateTime } from '../data/mock'
import { Button, Card, Modal } from './ui'
import raulSenaPhoto from '../assets/raul-sena.jpg'

// Modal da live em andamento, fixado no topo da comunidade para elegíveis.
// Seção "de impacto": fundo sempre escuro, independente do tema do app —
// por isso é envolvida em .dark, que resolve os tokens automaticamente.
export function LiveNowBanner() {
  const { liveDismissed, setLiveDismissed, toast } = useApp()
  const [open, setOpen] = useState(false)
  const live = LIVES.find((l) => l.status === 'live' && l.eligible)
  if (!live || liveDismissed) return null

  return (
    <div className="dark">
      <div
        className="relative overflow-hidden rounded-[12px] border border-border p-[20px] md:p-[30px]"
        role="region"
        aria-label="Live em andamento"
      >
        {live.hostPhoto && (
          <>
            <img src={raulSenaPhoto} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
            {/* Overlay preto para garantir legibilidade do texto sobre a foto */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-black/40" />
          </>
        )}
        <div className="relative">
          <div className="flex flex-wrap items-center gap-[15px]">
            <span className="flex items-center gap-[8px] rounded-[4px] bg-foreground px-[10px] py-[4px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-background">
              <span className="h-[8px] w-[8px] rounded-full bg-destructive animate-live-dot" /> Ao vivo agora
            </span>
            <span className="flex items-center gap-[6px] font-roboto text-[13px] text-muted-foreground">
              <Users size={15} weight="bold" /> {live.viewers} assistindo
            </span>
            <button
              onClick={() => setLiveDismissed(true)}
              className="ml-auto font-roboto text-[13px] text-muted-foreground underline-offset-2 hover:underline"
            >
              Dispensar
            </button>
          </div>
          <h2 className="mt-[15px] font-anek text-[24px] md:text-[30px] font-semibold leading-[1.15] text-foreground">{live.title}</h2>
          <p className="mt-[8px] font-roboto text-[15px] text-muted-foreground">com {live.host}</p>
          <div className="mt-[20px] flex flex-wrap gap-[15px]">
            <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
              <Play size={16} weight="fill" /> Assistir agora
            </Button>
            <Button variant="outline" size="sm" onClick={() => toast('Materiais de apoio enviados para o seu e-mail de aluno.')}>
              <FileArrowDown size={16} weight="bold" /> Materiais de apoio
            </Button>
          </div>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={live.title} wide>
        <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[12px] bg-muted">
          {live.hostPhoto && (
            <>
              <img src={raulSenaPhoto} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover object-[50%_20%]" />
              <div className="absolute inset-0 bg-black/55" />
            </>
          )}
          <div className="relative text-center">
            <Broadcast size={44} weight="bold" className="mx-auto text-white" />
            <p className="mt-[15px] font-roboto text-[15px] text-white/80">Transmissão ao vivo (player integrado ao SuperApp)</p>
            <p className="mt-[4px] font-sora text-[12px] font-bold uppercase tracking-[0.05em] text-white">{live.viewers} alunos assistindo</p>
          </div>
        </div>
        <div className="mt-[20px]">
          <p className="font-sora text-[12px] font-bold uppercase tracking-[0.15em] text-primary">Materiais de apoio</p>
          <ul className="mt-[10px] flex flex-col gap-[8px]">
            {live.materials.map((m) => (
              <li key={m} className="flex items-center gap-[8px] font-roboto text-[15px] text-foreground">
                <FileArrowDown size={16} weight="bold" className="text-accent" /> {m}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </div>
  )
}

// Card de live elegível (agendada) no topo do feed.
export function UpcomingLiveCard() {
  const { toast } = useApp()
  const live = LIVES.find((l) => l.status === 'scheduled' && l.eligible)
  if (!live) return null
  return (
    <Card className="!p-[20px]">
      <div className="flex flex-wrap items-center gap-[15px]">
        <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[5px] bg-primary text-primary-foreground">
          <CalendarBlank size={20} weight="bold" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-primary">Live elegível para sua turma</p>
          <p className="mt-[2px] font-anek text-[18px] font-semibold leading-tight text-foreground">{live.title}</p>
          <p className="mt-[2px] font-roboto text-[13px] text-muted-foreground">
            {formatDateTime(live.startsAt)} · com {live.host}
          </p>
        </div>
        <Button size="xs" variant="outline" onClick={() => toast('Lembrete criado! Você será notificado quando a live começar.')}>
          Ativar lembrete
        </Button>
      </div>
    </Card>
  )
}
