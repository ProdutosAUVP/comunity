import { useMemo, useState } from 'react'
import { ArrowSquareOut, WarningOctagon } from '@phosphor-icons/react'
import { useApp } from '../../context/AppContext'
import { Button, EmptyState, Eyebrow, Modal, Segmented } from '../../components/ui'
import { timeAgo } from '../../data/mock'

const STATUS_TABS = [
  { value: 'pendente', label: 'Pendentes' },
  { value: 'analise', label: 'Em Análise' },
  { value: 'resolvida', label: 'Resolvidas' },
  { value: 'arquivada', label: 'Arquivadas' },
]

const SANCTIONS = ['Sem sanção adicional', 'Advertência Formal', 'Mute de 24 horas', 'Mute de 48 horas', 'Mute de 7 dias', 'Banimento Permanente da Comunidade']

// Realça termos sensíveis em amarelo dentro do recorte do texto
function Excerpt({ text, terms }) {
  if (!terms?.length) return <>“{text}”</>
  const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
  const parts = text.split(pattern)
  return (
    <>
      “
      {parts.map((part, i) =>
        terms.some((t) => t.toLowerCase() === part.toLowerCase()) ? (
          <mark key={i} className="rounded-[2px] bg-auvp-yellow px-[3px] text-auvp-chumbo">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
      ”
    </>
  )
}

export default function ModReports() {
  const { reports, users, resolveReport, bulkArchiveReports } = useApp()
  const [tab, setTab] = useState('pendente')
  const [selected, setSelected] = useState([])
  const [contextReport, setContextReport] = useState(null)
  const [removeReport, setRemoveReport] = useState(null)
  const [sanction, setSanction] = useState(SANCTIONS[0])

  const filtered = useMemo(() => reports.filter((r) => r.status === tab), [reports, tab])

  const toggleSelect = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const counts = Object.fromEntries(STATUS_TABS.map((t) => [t.value, reports.filter((r) => r.status === t.value).length]))

  return (
    <div className="flex flex-col gap-[20px]">
      <div>
        <Eyebrow dark>Tela M-02</Eyebrow>
        <h1 className="mt-[4px] font-anek text-[30px] md:text-[41px] font-semibold leading-[1.15] text-white">
          Fila de Denúncias
        </h1>
        <p className="mt-[8px] font-roboto text-[15px] text-auvp-gray-mid">
          Triagem rápida otimizada para alto volume. A identificação do denunciante é protegida por anonimato público e
          visível apenas aqui.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-[15px]">
        <div className="overflow-x-auto scrollbar-thin">
          <Segmented
            dark
            options={STATUS_TABS.map((t) => ({ ...t, count: counts[t.value] }))}
            value={tab}
            onChange={(v) => {
              setTab(v)
              setSelected([])
            }}
          />
        </div>
        {/* Ações em massa — interface desktop */}
        {tab === 'pendente' && selected.length > 0 && (
          <Button size="xs" variant="outline-dark" onClick={() => { bulkArchiveReports(selected); setSelected([]) }}>
            Arquivar em massa ({selected.length})
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState dark title="Fila limpa" subtitle="Nenhuma denúncia neste estado." />
      ) : (
        <div className="flex flex-col gap-[15px]">
          {filtered.map((r) => {
            const overdue = r.status === 'pendente' && Date.now() - new Date(r.createdAt).getTime() > 4 * 3600e3
            return (
              <div key={r.id} className="rounded-[12px] border border-white/10 bg-auvp-chumbo p-[20px]">
                <div className="flex flex-wrap items-center gap-[10px]">
                  {tab === 'pendente' && (
                    <input
                      type="checkbox"
                      checked={selected.includes(r.id)}
                      onChange={() => toggleSelect(r.id)}
                      aria-label={`Selecionar denúncia ${r.id}`}
                      className="h-[16px] w-[16px] accent-[#EFBE4F]"
                    />
                  )}
                  <span className="rounded-[4px] bg-[#B42318] px-[8px] py-[2px] font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-white">
                    {r.reason}
                  </span>
                  <span className="font-roboto text-[13px] text-auvp-gray-mid">
                    {r.targetType === 'post' ? 'Publicação' : 'Comentário'} de <strong className="text-auvp-gray">{users[r.targetAuthorId]?.nickname}</strong>
                  </span>
                  {overdue && (
                    <span className="flex items-center gap-[4px] font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-[#E5484D]">
                      <WarningOctagon size={13} weight="fill" /> SLA estourado (+4h)
                    </span>
                  )}
                  <span className="ml-auto font-roboto text-[12px] text-auvp-gray-mid">{timeAgo(r.createdAt)}</span>
                </div>

                <p className="mt-[15px] rounded-[8px] bg-black p-[15px] font-roboto text-[15px] leading-[1.6] text-auvp-gray">
                  <Excerpt text={r.excerpt} terms={r.sensitiveTerms} />
                </p>

                <div className="mt-[10px] flex flex-wrap items-center gap-[10px] font-roboto text-[12px] text-auvp-gray-mid">
                  <span>
                    Denunciante (visível só para moderação): <strong className="text-auvp-gray">{users[r.reporterId]?.nickname}</strong>
                  </span>
                  <button
                    onClick={() => setContextReport(r)}
                    className="flex items-center gap-[4px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-auvp-yellow hover:underline"
                  >
                    <ArrowSquareOut size={13} weight="bold" /> Ver contexto original
                  </button>
                </div>

                {r.resolution && (
                  <p className="mt-[10px] font-roboto text-[13px] text-auvp-gray-mid">
                    Resolução: <strong className="text-auvp-gray">{r.resolution}</strong>
                  </p>
                )}

                {(r.status === 'pendente' || r.status === 'analise') && (
                  <div className="mt-[15px] flex flex-wrap gap-[10px] border-t border-white/10 pt-[15px]">
                    <Button size="xs" variant="outline-dark" onClick={() => resolveReport(r.id, 'manter')}>
                      Manter Conteúdo
                    </Button>
                    <Button size="xs" variant="yellow" onClick={() => resolveReport(r.id, 'ocultar')}>
                      Ocultar Temporariamente
                    </Button>
                    <Button size="xs" variant="danger" onClick={() => { setRemoveReport(r); setSanction(SANCTIONS[0]) }}>
                      Remover Permanentemente
                    </Button>
                    <Button size="xs" variant="ghost-dark" onClick={() => resolveReport(r.id, 'escalar')}>
                      Escalar para Admin
                    </Button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      <p className="font-roboto text-[13px] text-auvp-gray-mid">
        No mobile, gestos de deslizar aplicam "Manter" (direita) ou "Ocultar" (esquerda). Conteúdos removidos recebem a flag
        <code className="mx-[4px] rounded-[4px] bg-auvp-chumbo px-[6px] py-[1px] text-auvp-yellow">status: deleted_by_moderator</code>
        (soft delete) e permanecem legíveis no Log de Auditoria, em conformidade com o Marco Civil da Internet.
      </p>

      {/* Modal "Ver contexto original" */}
      <Modal open={!!contextReport} onClose={() => setContextReport(null)} title="Contexto original" dark wide>
        {contextReport && (
          <div className="flex flex-col gap-[15px]">
            <p className="font-roboto text-[14px] text-auvp-gray-mid">
              {contextReport.targetType === 'post' ? 'Publicação' : 'Comentário'} · autor:{' '}
              <strong className="text-auvp-gray">{users[contextReport.targetAuthorId]?.nickname}</strong> · {timeAgo(contextReport.createdAt)}
            </p>
            <div className="rounded-[12px] bg-black p-[20px] font-roboto text-[16px] leading-[1.6] text-auvp-gray">
              <Excerpt text={contextReport.excerpt} terms={contextReport.sensitiveTerms} />
            </div>
            <p className="font-roboto text-[13px] text-auvp-gray-mid">
              Prontuário do autor: {users[contextReport.targetAuthorId]?.infractions} infração(ões) acumulada(s).
            </p>
          </div>
        )}
      </Modal>

      {/* Pop-up de confirmação de sanção ao remover */}
      <Modal open={!!removeReport} onClose={() => setRemoveReport(null)} title="Remover permanentemente" dark>
        {removeReport && (
          <>
            <p className="font-roboto text-[15px] text-auvp-gray-mid">
              O conteúdo será excluído do fórum e o autor <strong className="text-auvp-gray">{users[removeReport.targetAuthorId]?.nickname}</strong>{' '}
              será avisado com justificativa parametrizada. Selecione a sanção adicional:
            </p>
            <div className="mt-[15px] flex flex-col gap-[8px]">
              {SANCTIONS.map((s) => (
                <label
                  key={s}
                  className={`flex cursor-pointer items-center gap-[10px] rounded-[5px] border p-[12px] transition-all duration-240 ${
                    sanction === s ? 'border-auvp-yellow bg-black' : 'border-white/10'
                  }`}
                >
                  <input type="radio" name="sanction" checked={sanction === s} onChange={() => setSanction(s)} className="accent-[#EFBE4F]" />
                  <span className="font-roboto text-[14px] text-auvp-gray">{s}</span>
                </label>
              ))}
            </div>
            <div className="mt-[20px] flex justify-end gap-[15px]">
              <Button size="sm" variant="ghost-dark" onClick={() => setRemoveReport(null)}>
                Cancelar
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => {
                  resolveReport(removeReport.id, 'remover', sanction === SANCTIONS[0] ? null : sanction)
                  setRemoveReport(null)
                }}
              >
                Confirmar remoção
              </Button>
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
