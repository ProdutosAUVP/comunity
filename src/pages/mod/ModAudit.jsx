import { useMemo, useState } from 'react'
import { ArrowCounterClockwise } from '@phosphor-icons/react'
import { useApp } from '../../context/AppContext'
import { Button, Eyebrow } from '../../components/ui'
import { formatDateTime } from '../../data/mock'

export default function ModAudit() {
  const { auditLog, users, undoAction } = useApp()
  const [moderatorFilter, setModeratorFilter] = useState('todos')
  const [userFilter, setUserFilter] = useState('todos')
  const [actionFilter, setActionFilter] = useState('todas')

  const actionTypes = useMemo(() => [...new Set(auditLog.map((a) => a.action))], [auditLog])
  const affectedUsers = useMemo(() => [...new Set(auditLog.map((a) => a.targetUserId).filter((id) => id !== '-'))], [auditLog])

  const filtered = auditLog.filter(
    (a) =>
      (moderatorFilter === 'todos' || a.moderatorId === moderatorFilter) &&
      (userFilter === 'todos' || a.targetUserId === userFilter) &&
      (actionFilter === 'todas' || a.action === actionFilter),
  )

  const selectCls =
    'rounded-[5px] border border-border bg-card px-[12px] py-[8px] font-roboto text-[14px] text-foreground outline-none transition-all duration-240 focus:border-accent'

  return (
    <div className="flex flex-col gap-[20px]">
      <div>
        <Eyebrow>Tela M-05</Eyebrow>
        <h1 className="mt-[4px] font-anek text-[30px] md:text-[41px] font-semibold leading-[1.15] text-foreground">
          Histórico de Ações e Auditoria
        </h1>
        <p className="mt-[8px] font-roboto text-[15px] text-muted-foreground">
          Governança e monitoramento interno. O botão "Desfazer" é de uso exclusivo de administradores seniores; registros
          nunca são apagados fisicamente (soft delete).
        </p>
      </div>

      {/* Filtros avançados */}
      <div className="flex flex-wrap gap-[15px]" role="group" aria-label="Filtros do log">
        <label className="flex flex-col gap-[4px]">
          <span className="font-sora text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Moderador</span>
          <select value={moderatorFilter} onChange={(e) => setModeratorFilter(e.target.value)} className={selectCls}>
            <option value="todos">Todos</option>
            <option value="u4">eddy.auvp</option>
          </select>
        </label>
        <label className="flex flex-col gap-[4px]">
          <span className="font-sora text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Aluno afetado</span>
          <select value={userFilter} onChange={(e) => setUserFilter(e.target.value)} className={selectCls}>
            <option value="todos">Todos</option>
            {affectedUsers.map((id) => (
              <option key={id} value={id}>
                {users[id]?.nickname || id}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-[4px]">
          <span className="font-sora text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Tipologia da ação</span>
          <select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} className={selectCls}>
            <option value="todas">Todas</option>
            {actionTypes.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Tabela cronológica em formato de log técnico */}
      <div className="overflow-x-auto scrollbar-thin rounded-[12px] border border-border">
        <table className="w-full min-w-[760px] border-collapse text-left">
          <thead>
            <tr className="bg-card">
              {['Data/Hora', 'Moderador', 'Ação', 'Usuário afetado', 'Referência', 'Motivo alegado', ''].map((h) => (
                <th key={h} className="px-[15px] py-[12px] font-sora text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className={`border-t border-border ${a.undone ? 'opacity-45' : ''}`}>
                <td className="whitespace-nowrap px-[15px] py-[12px] font-roboto text-[13px] text-muted-foreground">{formatDateTime(a.date)}</td>
                <td className="px-[15px] py-[12px] font-roboto text-[14px] text-foreground">{users[a.moderatorId]?.nickname}</td>
                <td className="px-[15px] py-[12px]">
                  <span className="whitespace-nowrap rounded-[4px] bg-accent/10 px-[8px] py-[2px] font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-accent">
                    {a.action}
                  </span>
                  {a.undone && <span className="ml-[6px] font-sora text-[10px] font-bold uppercase text-destructive">desfeita</span>}
                </td>
                <td className="px-[15px] py-[12px] font-roboto text-[14px] text-foreground">
                  {a.targetUserId !== '-' ? users[a.targetUserId]?.nickname || a.targetUserId : '—'}
                </td>
                <td className="px-[15px] py-[12px] font-roboto text-[13px] text-muted-foreground">{a.targetRef}</td>
                <td className="px-[15px] py-[12px] font-roboto text-[13px] text-muted-foreground">{a.reason}</td>
                <td className="px-[15px] py-[12px]">
                  {a.undoable && !a.undone && (
                    <Button size="xs" variant="danger-outline" onClick={() => undoAction(a.id)}>
                      <ArrowCounterClockwise size={13} weight="bold" /> Desfazer
                    </Button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-[15px] py-[30px] text-center font-roboto text-[14px] text-muted-foreground">
                  Nenhum registro com os filtros selecionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
