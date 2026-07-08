import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Avatar, Button, EmptyState, Eyebrow, Modal, TurmaTag } from '../../components/ui'
import { NICKNAME_HISTORY, NICKNAME_REJECT_REASONS, formatDateTime, timeAgo } from '../../data/mock'

const SANCTIONS = ['Advertência Formal', 'Modo Somente Leitura / Mute 24h', 'Modo Somente Leitura / Mute 7 dias', 'Banimento Permanente da Comunidade']

export default function ModUsers() {
  const { nicknameQueue, users, reviewNickname, applySanction, sanctions } = useApp()
  const [rejecting, setRejecting] = useState(null)
  const [rejectReason, setRejectReason] = useState(NICKNAME_REJECT_REASONS[0])
  const [record, setRecord] = useState(null) // prontuário aberto
  const [sanctionTarget, setSanctionTarget] = useState(null)
  const [sanctionChoice, setSanctionChoice] = useState(SANCTIONS[0])

  const pending = nicknameQueue.filter((n) => n.status === 'pendente')
  const processed = nicknameQueue.filter((n) => n.status !== 'pendente')

  return (
    <div className="flex flex-col gap-[20px]">
      <div>
        <Eyebrow>Tela M-03</Eyebrow>
        <h1 className="mt-[4px] font-anek text-[30px] md:text-[41px] font-semibold leading-[1.15] text-foreground">
          Gestão de Usuários e Apelidos
        </h1>
        <p className="mt-[8px] font-roboto text-[15px] text-muted-foreground">
          Compliance de identidade e aplicação de sanções disciplinares. Reprovações exigem seleção de motivo padrão.
        </p>
      </div>

      {/* Fila de aprovação de apelidos */}
      <section aria-label="Fila de aprovação de apelidos">
        <h2 className="mb-[10px] font-anek text-[22px] font-semibold text-foreground">
          Fila de aprovação <span className="font-roboto text-[14px] font-normal text-muted-foreground">({pending.length})</span>
        </h2>
        {pending.length === 0 ? (
          <EmptyState title="Nenhum apelido aguardando aprovação" />
        ) : (
          <div className="flex flex-col gap-[15px]">
            {pending.map((item) => {
              const u = users[item.userId]
              const suspicious = /auvp|suporte|admin|oficial/i.test(item.suggestedNickname)
              return (
                <div key={item.id} className="rounded-[12px] border border-border bg-card p-[20px]">
                  <div className="flex flex-wrap items-center gap-[10px]">
                    <Avatar user={u} size={38} />
                    <div className="min-w-0 flex-1">
                      <p className="font-roboto text-[14px] text-foreground">
                        Nome legal: <strong className="text-foreground">{item.legalName}</strong>
                      </p>
                      <p className="font-roboto text-[14px] text-foreground">
                        <span className="text-muted-foreground">{item.currentNickname}</span> →{' '}
                        <strong className={suspicious ? 'text-destructive' : 'text-accent'}>{item.suggestedNickname}</strong>
                        {suspicious && (
                          <span className="ml-[8px] rounded-[4px] bg-destructive px-[6px] py-[1px] font-sora text-[10px] font-bold uppercase text-destructive-foreground">
                            Termo protegido
                          </span>
                        )}
                      </p>
                    </div>
                    <span className={`font-roboto text-[12px] ${item.changesThisYear >= 3 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {item.changesThisYear} alterações no período · {timeAgo(item.createdAt)}
                    </span>
                  </div>
                  <div className="mt-[15px] flex flex-wrap gap-[10px] border-t border-border pt-[15px]">
                    <Button size="xs" variant="accent" onClick={() => reviewNickname(item.id, true)}>
                      Aprovar
                    </Button>
                    <Button size="xs" variant="danger" onClick={() => { setRejecting(item); setRejectReason(NICKNAME_REJECT_REASONS[0]) }}>
                      Reprovar
                    </Button>
                    <Button size="xs" variant="ghost" onClick={() => setRecord(u)}>
                      Abrir prontuário
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
        {processed.length > 0 && (
          <ul className="mt-[15px] flex flex-col gap-[6px]">
            {processed.map((item) => (
              <li key={item.id} className="font-roboto text-[13px] text-muted-foreground">
                {item.suggestedNickname} — <span className={item.status === 'aprovado' ? 'text-accent' : 'text-destructive'}>{item.status}</span>
                {item.reason ? ` · ${item.reason}` : ''}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Prontuários */}
      <section aria-label="Prontuário social dos alunos">
        <h2 className="mb-[10px] font-anek text-[22px] font-semibold text-foreground">Prontuário Social dos Alunos</h2>
        <div className="grid gap-[15px] sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(users)
            .filter((u) => u.role === 'aluno')
            .map((u) => (
              <button
                key={u.id}
                onClick={() => setRecord(u)}
                className="rounded-[12px] border border-border bg-card p-[15px] text-left transition-all duration-240 hover:border-accent"
              >
                <div className="flex items-center gap-[10px]">
                  <Avatar user={u} size={38} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-roboto text-[15px] font-medium text-foreground">{u.nickname}</p>
                    <TurmaTag turma={u.turma} />
                  </div>
                  <span className={`font-anek text-[22px] font-semibold ${u.infractions > 0 ? 'text-destructive' : 'text-accent'}`}>
                    {u.infractions}
                  </span>
                </div>
                <p className="mt-[6px] font-roboto text-[12px] text-muted-foreground">infrações acumuladas</p>
              </button>
            ))}
        </div>
      </section>

      {/* Modal de reprovação com motivo padrão */}
      <Modal open={!!rejecting} onClose={() => setRejecting(null)} title="Reprovar apelido">
        {rejecting && (
          <>
            <p className="font-roboto text-[15px] text-muted-foreground">
              Ao reprovar, o nome público retorna obrigatoriamente ao apelido anterior aprovado (
              <strong className="text-foreground">{rejecting.currentNickname}</strong>) e um alerta é adicionado ao perfil interno.
            </p>
            <div className="mt-[15px] flex flex-col gap-[8px]">
              {NICKNAME_REJECT_REASONS.map((r) => (
                <label key={r} className={`flex cursor-pointer items-center gap-[10px] rounded-[5px] border p-[12px] transition-all duration-240 ${rejectReason === r ? 'border-accent bg-background' : 'border-border'}`}>
                  <input type="radio" name="reject-reason" checked={rejectReason === r} onChange={() => setRejectReason(r)} className="accent-accent" />
                  <span className="font-roboto text-[14px] text-foreground">{r}</span>
                </label>
              ))}
            </div>
            <div className="mt-[20px] flex justify-end gap-[15px]">
              <Button size="sm" variant="ghost" onClick={() => setRejecting(null)}>
                Cancelar
              </Button>
              <Button size="sm" variant="danger" onClick={() => { reviewNickname(rejecting.id, false, rejectReason); setRejecting(null) }}>
                Reprovar apelido
              </Button>
            </div>
          </>
        )}
      </Modal>

      {/* Prontuário Social do Aluno */}
      <Modal open={!!record} onClose={() => setRecord(null)} title="Prontuário Social do Aluno" wide>
        {record && (
          <div className="flex flex-col gap-[20px]">
            <div className="flex flex-wrap items-center gap-[15px]">
              <Avatar user={record} size={56} />
              <div>
                <p className="font-anek text-[22px] font-semibold text-foreground">{record.name}</p>
                <p className="font-roboto text-[14px] text-muted-foreground">
                  Apelido: {record.nickname} · <TurmaTag turma={record.turma} /> · membro {timeAgo(record.joinedAt)}
                </p>
              </div>
              <span className="ml-auto rounded-[12px] bg-background px-[20px] py-[12px] text-center">
                <span className={`block font-anek text-[28px] font-semibold leading-none ${record.infractions > 0 ? 'text-destructive' : 'text-accent'}`}>
                  {record.infractions}
                </span>
                <span className="font-roboto text-[11px] text-muted-foreground">infrações</span>
              </span>
            </div>

            <div>
              <Eyebrow>Linha do tempo de apelidos (auditável)</Eyebrow>
              <ul className="mt-[10px] flex flex-col gap-[8px]">
                {(NICKNAME_HISTORY[record.id] || []).map((h, i) => (
                  <li key={i} className="flex items-center gap-[10px] font-roboto text-[14px] text-foreground">
                    <span className="h-[10px] w-[10px] shrink-0 rounded-full border-[3px] border-background bg-primary" />
                    {h.from} → <strong className="text-foreground">{h.to}</strong>
                    <span className="ml-auto text-[12px] text-muted-foreground">{formatDateTime(h.date)} · {h.status}</span>
                  </li>
                ))}
                {!(NICKNAME_HISTORY[record.id] || []).length && (
                  <li className="font-roboto text-[14px] text-muted-foreground">Nenhuma alteração registrada.</li>
                )}
              </ul>
            </div>

            {sanctions.filter((s) => s.userId === record.id).length > 0 && (
              <div>
                <Eyebrow>Sanções aplicadas nesta sessão</Eyebrow>
                <ul className="mt-[10px] flex flex-col gap-[6px]">
                  {sanctions
                    .filter((s) => s.userId === record.id)
                    .map((s, i) => (
                      <li key={i} className="font-roboto text-[14px] text-destructive">
                        {s.sanction} · {timeAgo(s.date)}
                      </li>
                    ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap justify-end gap-[10px] border-t border-border pt-[20px]">
              <Button size="sm" variant="danger-outline" onClick={() => { setSanctionTarget(record); setSanctionChoice(SANCTIONS[0]) }}>
                Aplicar sanção
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setRecord(null)}>
                Fechar
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Menu de sanções */}
      <Modal open={!!sanctionTarget} onClose={() => setSanctionTarget(null)} title="Aplicar sanção disciplinar">
        {sanctionTarget && (
          <>
            <p className="font-roboto text-[15px] text-muted-foreground">
              Sanção para <strong className="text-foreground">{sanctionTarget.nickname}</strong>. Mutes bloqueiam interações na
              comunidade sem afetar o acesso ao LMS. Advertências enviam push interno ao aluno.
            </p>
            <div className="mt-[15px] flex flex-col gap-[8px]">
              {SANCTIONS.map((s) => (
                <label key={s} className={`flex cursor-pointer items-center gap-[10px] rounded-[5px] border p-[12px] transition-all duration-240 ${sanctionChoice === s ? 'border-accent bg-background' : 'border-border'}`}>
                  <input type="radio" name="sanction-choice" checked={sanctionChoice === s} onChange={() => setSanctionChoice(s)} className="accent-accent" />
                  <span className="font-roboto text-[14px] text-foreground">{s}</span>
                </label>
              ))}
            </div>
            <div className="mt-[20px] flex justify-end gap-[15px]">
              <Button size="sm" variant="ghost" onClick={() => setSanctionTarget(null)}>
                Cancelar
              </Button>
              <Button size="sm" variant="danger" onClick={() => { applySanction(sanctionTarget.id, sanctionChoice); setSanctionTarget(null) }}>
                Confirmar sanção
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
