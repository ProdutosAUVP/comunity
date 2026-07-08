import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Star } from '@phosphor-icons/react'
import { useApp } from '../../context/AppContext'
import { Avatar, Button, Eyebrow, Modal, TagPill } from '../../components/ui'
import { COUNSELOR_PERFORMANCE, UNANSWERED_QUEUE } from '../../data/mock'

export default function ModAdvisors() {
  const { users, comments, validateAnswer, notifyCounselor } = useApp()
  const [notifyingPost, setNotifyingPost] = useState(null)

  // Espaço de chancela: melhores respostas candidatas a "Resposta Validada"
  const candidates = comments.filter((c) => c.upvotes >= 10 && users[c.authorId])

  return (
    <div className="flex flex-col gap-[20px]">
      <div>
        <Eyebrow dark>Tela M-04</Eyebrow>
        <h1 className="mt-[4px] font-anek text-[30px] md:text-[41px] font-semibold leading-[1.15] text-white">
          Central de Validação e Conselheiros
        </h1>
        <p className="mt-[8px] font-roboto text-[15px] text-auvp-gray-mid">
          Impulsione os usuários de alta autoridade técnica da plataforma.
        </p>
      </div>

      {/* Fila de dúvidas sem resposta há +12h */}
      <section aria-label="Dúvidas sem resposta">
        <h2 className="mb-[10px] font-anek text-[22px] font-semibold text-white">
          Dúvidas sem resposta válida há mais de 12h <span className="font-roboto text-[14px] font-normal text-auvp-gray-mid">({UNANSWERED_QUEUE.length})</span>
        </h2>
        <div className="flex flex-col gap-[15px]">
          {UNANSWERED_QUEUE.map((q) => (
            <div key={q.id} className="rounded-[12px] border border-white/10 bg-auvp-chumbo p-[20px]">
              <div className="flex flex-wrap items-center gap-[10px]">
                <span className="rounded-[4px] bg-[#B42318] px-[8px] py-[2px] font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-white">
                  {q.hoursOpen}h em aberto
                </span>
                <Link to={`/post/${q.postId}`} className="min-w-0 flex-1 font-anek text-[18px] font-semibold text-white hover:text-auvp-yellow transition-all duration-240">
                  {q.topic}
                </Link>
              </div>
              <div className="mt-[10px] flex flex-wrap items-center gap-[8px]">
                {q.tags.map((t) => (
                  <TagPill key={t} tag={t} dark />
                ))}
                <div className="ml-auto">
                  <Button size="xs" variant="yellow" onClick={() => setNotifyingPost(q)}>
                    Notificar Conselheiro Especialista
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Painel de performance dos conselheiros */}
      <section aria-label="Performance dos conselheiros">
        <h2 className="mb-[10px] font-anek text-[22px] font-semibold text-white">Performance dos conselheiros ativos</h2>
        <div className="grid gap-[15px] sm:grid-cols-2">
          {COUNSELOR_PERFORMANCE.map((c) => {
            const u = users[c.userId]
            return (
              <div key={c.userId} className="rounded-[12px] border border-white/10 bg-auvp-chumbo p-[20px]">
                <div className="flex items-center gap-[12px]">
                  <Avatar user={u} size={48} />
                  <div className="min-w-0 flex-1">
                    <p className="font-roboto text-[16px] font-medium text-white">{u.nickname}</p>
                    <p className="font-roboto text-[13px] text-auvp-gray-mid">Especialista em {c.specialty}</p>
                  </div>
                </div>
                <div className="mt-[15px] grid grid-cols-2 gap-[15px] border-t border-white/10 pt-[15px]">
                  <div>
                    <p className="font-anek text-[28px] font-semibold leading-none text-auvp-yellow">{c.validatedAnswers}</p>
                    <p className="mt-[4px] font-roboto text-[12px] text-auvp-gray-mid">respostas validadas</p>
                  </div>
                  <div>
                    <p className="flex items-center gap-[4px] font-anek text-[28px] font-semibold leading-none text-auvp-yellow">
                      {c.avgRating} <Star size={18} weight="fill" />
                    </p>
                    <p className="mt-[4px] font-roboto text-[12px] text-auvp-gray-mid">nota média de utilidade</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Espaço de chancela */}
      <section aria-label="Chancela de respostas validadas">
        <h2 className="mb-[10px] font-anek text-[22px] font-semibold text-white">Espaço de chancela institucional</h2>
        <p className="mb-[15px] font-roboto text-[14px] text-auvp-gray-mid">
          Transforme as melhores respostas da comunidade em "Respostas Validadas" institucionais.
        </p>
        <div className="flex flex-col gap-[10px]">
          {candidates.map((c) => (
            <div key={c.id} className="flex flex-wrap items-center gap-[10px] rounded-[12px] border border-white/10 bg-auvp-chumbo p-[15px]">
              <Avatar user={users[c.authorId]} size={32} />
              <p className="min-w-0 flex-1 font-roboto text-[14px] text-auvp-gray line-clamp-2">“{c.body}”</p>
              <span className="font-roboto text-[12px] text-auvp-gray-mid">{c.upvotes} votos</span>
              <Button size="xs" variant={c.validated ? 'outline-dark' : 'yellow'} onClick={() => validateAnswer(c.id)}>
                {c.validated ? 'Remover chancela' : 'Validar resposta'}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Modal de direcionamento a especialista */}
      <Modal open={!!notifyingPost} onClose={() => setNotifyingPost(null)} title="Notificar Conselheiro Especialista" dark>
        {notifyingPost && (
          <>
            <p className="font-roboto text-[15px] text-auvp-gray-mid">
              Direcione a dúvida <strong className="text-auvp-gray">“{notifyingPost.topic}”</strong> para o painel de um conselheiro
              especialista:
            </p>
            <div className="mt-[15px] flex flex-col gap-[10px]">
              {COUNSELOR_PERFORMANCE.map((c) => (
                <button
                  key={c.userId}
                  onClick={() => {
                    notifyCounselor(notifyingPost.postId, c.userId)
                    setNotifyingPost(null)
                  }}
                  className="flex items-center gap-[10px] rounded-[5px] border border-white/10 p-[12px] text-left transition-all duration-240 hover:border-auvp-yellow"
                >
                  <Avatar user={users[c.userId]} size={36} />
                  <span>
                    <span className="block font-roboto text-[15px] font-medium text-white">{users[c.userId].nickname}</span>
                    <span className="block font-roboto text-[12px] text-auvp-gray-mid">Especialista em {c.specialty}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </Modal>
    </div>
  )
}
