import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CalendarBlank, Star, VideoCamera, X } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { Avatar, Button, Card, EmptyState, Eyebrow, Modal } from '../components/ui'
import { ADVISOR_AREAS, CONSELHEIRO_PROGRAM, formatDateTime, isEligibleForConselheiros } from '../data/mock'

function AreaPill({ area }) {
  return (
    <span className="rounded-[4px] border border-border bg-muted px-[8px] py-[2px] font-roboto text-[12px] text-muted-foreground">
      {ADVISOR_AREAS[area] || area}
    </span>
  )
}

function StarPicker({ value, onChange }) {
  return (
    <div className="flex gap-[4px]" role="radiogroup" aria-label="Nota da conversa">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} onClick={() => onChange(n)} aria-label={`${n} estrelas`}>
          <Star size={22} weight={n <= value ? 'fill' : 'regular'} className={n <= value ? 'text-primary' : 'text-muted-foreground'} />
        </button>
      ))}
    </div>
  )
}

function RateMeeting({ booking }) {
  const { submitCsat } = useApp()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [sent, setSent] = useState(false)

  if (sent || booking.csat) {
    return (
      <p className="flex items-center gap-[6px] font-roboto text-[13px] text-muted-foreground">
        <Star size={14} weight="fill" className="text-primary" /> Avaliação enviada{booking.csat ? `: ${booking.csat.rating}/5` : ''}
      </p>
    )
  }

  return (
    <div className="mt-[10px] flex flex-col gap-[8px]">
      <p className="font-roboto text-[13px] text-muted-foreground">Como foi essa conversa?</p>
      <StarPicker value={rating} onChange={setRating} />
      <input
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comentário opcional…"
        className="rounded-[5px] border border-border bg-background px-[10px] py-[6px] font-roboto text-[13px] text-foreground outline-none focus:border-primary"
      />
      <Button
        size="xs"
        variant="outline"
        disabled={!rating}
        onClick={() => {
          submitCsat(booking.id, rating, comment)
          setSent(true)
        }}
      >
        Enviar avaliação
      </Button>
    </div>
  )
}

function BookingModal({ conselheiro, onClose }) {
  const { bookMeeting } = useApp()
  if (!conselheiro) return null
  const advisor = CONSELHEIRO_PROGRAM.find((c) => c.userId === conselheiro.id)

  return (
    <Modal open onClose={onClose} title={`Agendar com ${conselheiro.nickname}`}>
      <p className="mb-[15px] flex items-center gap-[6px] font-roboto text-[13px] text-muted-foreground">
        <CalendarBlank size={15} weight="bold" /> Agendamento via Cal.com · reunião gerada automaticamente no Google Meet
      </p>
      <div className="flex flex-col gap-[8px]">
        {advisor.availability.map((slot) => (
          <button
            key={slot.id}
            onClick={() => {
              bookMeeting(conselheiro.id, slot)
              onClose()
            }}
            className="flex items-center justify-between rounded-[5px] border border-border p-[12px] text-left transition-all duration-240 hover:border-primary hover:text-primary"
          >
            <span className="font-roboto text-[15px] text-foreground">{slot.label}</span>
            <span className="font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-primary">Confirmar</span>
          </button>
        ))}
      </div>
    </Modal>
  )
}

function EligibilityGate() {
  const { toast } = useApp()
  return (
    <Card>
      <Eyebrow>Elegibilidade</Eyebrow>
      <h2 className="mt-[8px] font-anek text-[24px] font-semibold text-foreground">
        O Programa de Conselheiros é exclusivo para quem tem o AUVP Sempre ativo
      </h2>
      <p className="mt-[10px] font-roboto text-[15px] text-muted-foreground">
        Alunos nas primeiras 8 semanas de Escola AUVP também têm acesso liberado automaticamente. Fora desses critérios, é
        preciso ativar o AUVP Sempre para agendar uma conversa.
      </p>
      <div className="mt-[20px]">
        <Button onClick={() => toast('Redirecionando para a página do AUVP Sempre…', 'info')}>Conhecer o AUVP Sempre</Button>
      </div>
    </Card>
  )
}

export default function ConselheirosPage() {
  const { users, currentUser, conselheiroBookings, cancelBooking } = useApp()
  const [booking, setBooking] = useState(null)
  const eligible = isEligibleForConselheiros(currentUser)

  const upcoming = conselheiroBookings.filter((b) => b.status === 'agendado').sort((a, b) => new Date(a.at) - new Date(b.at))
  const past = conselheiroBookings.filter((b) => b.status !== 'agendado').sort((a, b) => new Date(b.at) - new Date(a.at))

  return (
    <div className="flex flex-col gap-[15px]">
      <div>
        <Eyebrow>Programa de Conselheiros</Eyebrow>
        <h1 className="mt-[4px] font-anek text-[30px] md:text-[41px] font-semibold leading-[1.15] text-foreground">
          Converse com quem já passou por isso
        </h1>
        <p className="mt-[8px] font-roboto text-[15px] text-muted-foreground max-w-[640px]">
          Conselheiros são alunos e clientes voluntários que compartilham sua trajetória em conversas rápidas, objetivas e
          humanas sobre carreira, dinheiro, relacionamentos, saúde, empreendedorismo e decisões difíceis.
        </p>
      </div>

      {!eligible ? (
        <EligibilityGate />
      ) : (
        <>
          {upcoming.length > 0 && (
            <section aria-label="Próximas conversas">
              <h2 className="mb-[10px] font-anek text-[20px] font-semibold text-foreground">Próxima conversa</h2>
              <div className="flex flex-col gap-[10px]">
                {upcoming.map((b) => {
                  const advisor = users[b.conselheiroId]
                  return (
                    <Card key={b.id} className="!p-[15px]">
                      <div className="flex flex-wrap items-center gap-[15px]">
                        <Avatar user={advisor} size={44} />
                        <div className="min-w-0 flex-1">
                          <p className="font-roboto text-[15px] font-medium text-foreground">{advisor.nickname}</p>
                          <p className="font-roboto text-[13px] text-muted-foreground">{formatDateTime(b.at)}</p>
                        </div>
                        <a href={b.meetLink} target="_blank" rel="noreferrer">
                          <Button size="xs" variant="primary">
                            <VideoCamera size={14} weight="bold" /> Entrar na reunião
                          </Button>
                        </a>
                        <Button size="xs" variant="ghost" onClick={() => cancelBooking(b.id)}>
                          <X size={14} weight="bold" /> Cancelar
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </section>
          )}

          <section aria-label="Conselheiros disponíveis">
            <h2 className="mb-[10px] font-anek text-[20px] font-semibold text-foreground">Conselheiros disponíveis</h2>
            <div className="grid gap-[15px] sm:grid-cols-2">
              {CONSELHEIRO_PROGRAM.map((advisor) => {
                const u = users[advisor.userId]
                return (
                  <Card key={advisor.userId} hover className="!p-[20px]">
                    <div className="flex items-start gap-[12px]">
                      <Avatar user={u} size={48} />
                      <div className="min-w-0 flex-1">
                        <Link to={`/perfil/${u.id}`} className="font-roboto text-[16px] font-medium text-foreground hover:underline">
                          {u.nickname}
                        </Link>
                        <div className="mt-[6px] flex flex-wrap gap-[6px]">
                          {advisor.areas.map((a) => (
                            <AreaPill key={a} area={a} />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-[12px] font-roboto text-[14px] text-foreground/80 line-clamp-3">{u.bio}</p>
                    <div className="mt-[15px]">
                      <Button size="sm" variant="outline" onClick={() => setBooking(u)}>
                        Ver horários
                      </Button>
                    </div>
                  </Card>
                )
              })}
            </div>
          </section>

          <section aria-label="Histórico de encontros">
            <h2 className="mb-[10px] font-anek text-[20px] font-semibold text-foreground">Histórico de encontros</h2>
            {past.length === 0 ? (
              <EmptyState title="Nenhum encontro anterior" subtitle="Suas conversas concluídas aparecerão aqui." />
            ) : (
              <div className="flex flex-col gap-[10px]">
                {past.map((b) => {
                  const advisor = users[b.conselheiroId]
                  return (
                    <Card key={b.id} className="!p-[15px]">
                      <div className="flex flex-wrap items-center gap-[15px]">
                        <Avatar user={advisor} size={40} />
                        <div className="min-w-0 flex-1">
                          <p className="font-roboto text-[15px] font-medium text-foreground">{advisor.nickname}</p>
                          <p className="font-roboto text-[13px] text-muted-foreground">
                            {formatDateTime(b.at)} · {b.status === 'cancelado' ? 'Cancelada' : 'Concluída'}
                          </p>
                        </div>
                      </div>
                      {b.status === 'concluido' && <RateMeeting booking={b} />}
                    </Card>
                  )
                })}
              </div>
            )}
          </section>
        </>
      )}

      <BookingModal conselheiro={booking} onClose={() => setBooking(null)} />
    </div>
  )
}
