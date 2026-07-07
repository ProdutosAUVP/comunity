import { useState } from 'react'
import { Broadcast, CalendarBlank, FileArrowDown, Play, Users } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { LIVES, formatDateTime } from '../data/mock'
import { Button, Card, Modal } from './ui'

// Modal da live em andamento, fixado no topo da comunidade para elegíveis.
export function LiveNowBanner() {
  const { liveDismissed, setLiveDismissed, toast } = useApp()
  const [open, setOpen] = useState(false)
  const live = LIVES.find((l) => l.status === 'live' && l.eligible)
  if (!live || liveDismissed) return null

  return (
    <>
      <div className="rounded-[12px] bg-black p-[20px] md:p-[30px]" role="region" aria-label="Live em andamento">
        <div className="flex flex-wrap items-center gap-[15px]">
          <span className="flex items-center gap-[8px] rounded-[4px] bg-auvp-yellow px-[10px] py-[4px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-auvp-chumbo">
            <span className="h-[8px] w-[8px] rounded-full bg-[#B42318] animate-live-dot" /> Ao vivo agora
          </span>
          <span className="flex items-center gap-[6px] font-roboto text-[13px] text-auvp-gray">
            <Users size={15} weight="bold" /> {live.viewers} assistindo
          </span>
          <button
            onClick={() => setLiveDismissed(true)}
            className="ml-auto font-roboto text-[13px] text-auvp-gray underline-offset-2 hover:underline"
          >
            Dispensar
          </button>
        </div>
        <h2 className="mt-[15px] font-anek text-[24px] md:text-[30px] font-semibold leading-[1.15] text-white">{live.title}</h2>
        <p className="mt-[8px] font-roboto text-[15px] text-auvp-gray">com {live.host}</p>
        <div className="mt-[20px] flex flex-wrap gap-[15px]">
          <Button variant="yellow" size="sm" onClick={() => setOpen(true)}>
            <Play size={16} weight="fill" /> Assistir agora
          </Button>
          <Button variant="outline-dark" size="sm" onClick={() => toast('Materiais de apoio enviados para o seu e-mail de aluno.')}>
            <FileArrowDown size={16} weight="bold" /> Materiais de apoio
          </Button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={live.title} dark wide>
        <div className="flex aspect-video items-center justify-center rounded-[12px] bg-black">
          <div className="text-center">
            <Broadcast size={44} weight="bold" color="#EFBE4F" className="mx-auto" />
            <p className="mt-[15px] font-roboto text-[15px] text-auvp-gray">Transmissão ao vivo (player integrado ao SuperApp)</p>
            <p className="mt-[4px] font-sora text-[12px] font-bold uppercase tracking-[0.05em] text-auvp-yellow">{live.viewers} alunos assistindo</p>
          </div>
        </div>
        <div className="mt-[20px]">
          <p className="font-sora text-[12px] font-bold uppercase tracking-[0.15em] text-auvp-yellow">Materiais de apoio</p>
          <ul className="mt-[10px] flex flex-col gap-[8px]">
            {live.materials.map((m) => (
              <li key={m} className="flex items-center gap-[8px] font-roboto text-[15px] text-auvp-gray">
                <FileArrowDown size={16} weight="bold" color="#EFBE4F" /> {m}
              </li>
            ))}
          </ul>
        </div>
      </Modal>
    </>
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
        <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[5px] bg-auvp-green text-white">
          <CalendarBlank size={20} weight="bold" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-auvp-green">Live elegível para sua turma</p>
          <p className="mt-[2px] font-anek text-[18px] font-semibold leading-tight text-auvp-chumbo">{live.title}</p>
          <p className="mt-[2px] font-roboto text-[13px] text-auvp-gray-mid">
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
