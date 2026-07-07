import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Eyebrow, Stat } from '../../components/ui'
import { MOD_METRICS, timeAgo } from '../../data/mock'

// Gráfico de tendência denúncias vs. postagens (exclusivo desktop)
function TrendChart({ data }) {
  const W = 640
  const H = 200
  const pad = 30
  const maxPosts = Math.max(...data.map((d) => d.posts))
  const x = (i) => pad + (i * (W - pad * 2)) / (data.length - 1)
  const yPosts = (v) => H - pad - (v / maxPosts) * (H - pad * 2)
  const maxReports = Math.max(...data.map((d) => d.reports))
  const yReports = (v) => H - pad - (v / maxReports) * (H - pad * 2)

  const line = (get, yFn) => data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)} ${yFn(get(d))}`).join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Tendência de denúncias versus postagens nos últimos 7 dias">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line key={f} x1={pad} x2={W - pad} y1={H - pad - f * (H - pad * 2)} y2={H - pad - f * (H - pad * 2)} stroke="rgba(255,255,255,0.08)" />
      ))}
      <path d={line((d) => d.posts, yPosts)} fill="none" stroke="#EFBE4F" strokeWidth="2.5" />
      <path d={line((d) => d.reports, yReports)} fill="none" stroke="#E5484D" strokeWidth="2.5" />
      {data.map((d, i) => (
        <g key={d.day}>
          <circle cx={x(i)} cy={yPosts(d.posts)} r="4" fill="#EFBE4F" />
          <circle cx={x(i)} cy={yReports(d.reports)} r="4" fill="#E5484D" />
          <text x={x(i)} y={H - 8} textAnchor="middle" fill="#6B6B6B" fontSize="11" fontFamily="Roboto, sans-serif">
            {d.day}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function ModOverview() {
  const { reports, nicknameQueue, auditLog, users } = useApp()
  const navigate = useNavigate()

  const pending = reports.filter((r) => r.status === 'pendente')
  const overdue = pending.filter((r) => Date.now() - new Date(r.createdAt).getTime() > 4 * 3600e3)
  const pendingNicks = nicknameQueue.filter((n) => n.status === 'pendente')

  return (
    <div className="flex flex-col gap-[30px]">
      <div>
        <Eyebrow dark>Tela M-01</Eyebrow>
        <h1 className="mt-[4px] font-anek text-[30px] md:text-[41px] font-semibold leading-[1.15] text-white">
          Painel Principal · Visão Geral
        </h1>
        <p className="mt-[8px] font-roboto text-[15px] text-auvp-gray-mid">
          Saúde operacional e SLAs. Clique em um contador para abrir a fila correspondente já filtrada.
        </p>
      </div>

      {/* Contadores de urgência em destaque vermelho */}
      <div className="grid gap-[15px] sm:grid-cols-2 lg:grid-cols-4">
        <Stat dark urgent label="Denúncias pendentes" value={pending.length} onClick={() => navigate('/moderacao/denuncias')} />
        <Stat dark urgent label="Sem tratamento há mais de 4h" value={overdue.length} onClick={() => navigate('/moderacao/denuncias')} />
        <Stat dark urgent label="Apelidos aguardando aprovação" value={pendingNicks.length} onClick={() => navigate('/moderacao/usuarios')} />
        <Stat dark label="Tempo médio de 1ª resposta" value={`${MOD_METRICS.avgFirstResponseMin} min`} />
      </div>

      {/* Gráfico de tendência — exclusivo desktop */}
      <div className="hidden rounded-[12px] border border-white/10 bg-auvp-chumbo p-[30px] md:block">
        <div className="flex flex-wrap items-center justify-between gap-[15px]">
          <Eyebrow dark>Tendência · denúncias vs. postagens (7 dias)</Eyebrow>
          <div className="flex gap-[20px] font-roboto text-[13px]">
            <span className="flex items-center gap-[6px] text-auvp-gray">
              <span className="h-[10px] w-[10px] rounded-full bg-auvp-yellow" /> Postagens
            </span>
            <span className="flex items-center gap-[6px] text-auvp-gray">
              <span className="h-[10px] w-[10px] rounded-full bg-[#E5484D]" /> Denúncias
            </span>
          </div>
        </div>
        <div className="mt-[15px]">
          <TrendChart data={MOD_METRICS.trend} />
        </div>
      </div>

      {/* Log das últimas 5 ações da equipe */}
      <div className="rounded-[12px] border border-white/10 bg-auvp-chumbo p-[20px] md:p-[30px]">
        <Eyebrow dark>Últimas 5 ações da equipe</Eyebrow>
        <ul className="mt-[15px] divide-y divide-white/[0.06]">
          {auditLog.slice(0, 5).map((a) => (
            <li key={a.id} className="flex flex-wrap items-center gap-[10px] py-[12px]">
              <span className="rounded-[4px] bg-auvp-green px-[8px] py-[2px] font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-white">
                {a.action}
              </span>
              <span className="min-w-0 flex-1 font-roboto text-[14px] text-auvp-gray">
                {users[a.moderatorId]?.nickname} → {a.targetUserId !== '-' ? users[a.targetUserId]?.nickname || a.targetUserId : a.targetRef} · {a.reason}
              </span>
              <span className="font-roboto text-[12px] text-auvp-gray-mid">{timeAgo(a.date)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-[15px] border-t border-white/10 pt-[15px] font-roboto text-[13px] text-auvp-gray-mid">
          Regra de acesso: conselheiros visualizam apenas o painel técnico de respostas (M-04); moderadores oficiais têm
          acesso completo.
        </p>
      </div>
    </div>
  )
}
