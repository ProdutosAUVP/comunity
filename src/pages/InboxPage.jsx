import { useMemo, useState } from 'react'
import { Flag, PaperPlaneRight, Prohibit } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { Avatar, Button, Card, EmptyState, Eyebrow, Modal, RoleLabel, Segmented } from '../components/ui'
import { DM_DAILY_LIMIT, timeAgo } from '../data/mock'

export default function InboxPage() {
  const { conversations, users, currentUser, sendMessage, moveToPrincipal, blockUser, dmSentToday, reportContent } = useApp()
  const [box, setBox] = useState('principal')
  const [activeId, setActiveId] = useState(conversations.find((c) => c.box === 'principal')?.id || null)
  const [text, setText] = useState('')
  const [confirmBlock, setConfirmBlock] = useState(null)

  const boxConversations = useMemo(() => conversations.filter((c) => c.box === box), [conversations, box])
  const active = conversations.find((c) => c.id === activeId && c.box === box) || boxConversations[0] || null
  const solicitacoes = conversations.filter((c) => c.box === 'solicitacoes').length
  const isSupportChat = active?.withId === 'suporte'

  const submit = (e) => {
    e.preventDefault()
    if (!text.trim() || !active) return
    if (sendMessage(active.id, text.trim())) setText('')
  }

  return (
    <div className="flex flex-col gap-[15px]">
      <div>
        <Eyebrow>Mensagens Diretas</Eyebrow>
        <h1 className="mt-[4px] font-anek text-[30px] md:text-[41px] font-semibold leading-[1.15] text-foreground">Inbox</h1>
        <p className="mt-[8px] font-roboto text-[14px] text-muted-foreground">
          Limite anti-spam: {dmSentToday}/{DM_DAILY_LIMIT} mensagens enviadas hoje. Mensagens de moderadores chegam sempre na
          caixa Principal.
        </p>
      </div>

      <Segmented
        options={[
          { value: 'principal', label: 'Principal' },
          { value: 'solicitacoes', label: 'Solicitações', count: solicitacoes },
          { value: 'suporte', label: 'Suporte' },
        ]}
        value={box}
        onChange={(b) => {
          setBox(b)
          setActiveId(null)
        }}
      />

      <div className="grid gap-[15px] lg:grid-cols-[300px_1fr]">
        {/* Lista de conversas */}
        <Card className="!p-[10px]">
          {boxConversations.length === 0 && (
            <p className="p-[15px] font-roboto text-[14px] text-muted-foreground">Nenhuma conversa nesta caixa.</p>
          )}
          {boxConversations.map((c) => {
            const u = users[c.withId]
            const last = c.messages[c.messages.length - 1]
            const isActive = active?.id === c.id
            return (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`flex w-full items-center gap-[10px] rounded-[8px] p-[12px] text-left transition-all duration-240 ${
                  isActive ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                }`}
              >
                <Avatar user={u} size={40} />
                <span className="min-w-0 flex-1">
                  <span className={`block truncate font-roboto text-[14px] font-medium ${isActive ? 'text-primary-foreground' : 'text-foreground'}`}>
                    {u.nickname}
                  </span>
                  <span className={`block truncate font-roboto text-[12px] ${isActive ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                    {last?.text}
                  </span>
                </span>
              </button>
            )
          })}
        </Card>

        {/* Chat */}
        {active ? (
          <Card className="flex min-h-[440px] flex-col !p-[15px]">
            <div className="flex items-center gap-[10px] border-b border-border pb-[12px]">
              <Avatar user={users[active.withId]} size={36} />
              <div className="min-w-0 flex-1">
                <p className="font-roboto text-[15px] font-medium text-foreground">{users[active.withId].nickname}</p>
                <RoleLabel user={users[active.withId]} />
              </div>
              {!isSupportChat && (
                <>
                  <button
                    onClick={() =>
                      reportContent({
                        targetType: 'comment',
                        targetId: active.id,
                        targetAuthorId: active.withId,
                        reason: 'Spam',
                        excerpt: active.messages[active.messages.length - 1]?.text || '',
                      })
                    }
                    className="flex items-center gap-[4px] rounded-[5px] px-[8px] py-[6px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-muted-foreground transition-all duration-240 hover:text-destructive"
                  >
                    <Flag size={14} weight="bold" /> Denunciar
                  </button>
                  <button
                    onClick={() => setConfirmBlock(active.withId)}
                    className="flex items-center gap-[4px] rounded-[5px] px-[8px] py-[6px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-muted-foreground transition-all duration-240 hover:text-destructive"
                  >
                    <Prohibit size={14} weight="bold" /> Bloquear
                  </button>
                </>
              )}
            </div>

            {isSupportChat && (
              <div className="mt-[12px] rounded-[8px] bg-muted p-[12px]">
                <p className="font-roboto text-[13px] text-muted-foreground">
                  Canal exclusivo de suporte da AUVP — tire dúvidas sobre a plataforma, cursos ou sua conta diretamente com a
                  nossa equipe.
                </p>
              </div>
            )}

            {active.box === 'solicitacoes' && (
              <div className="mt-[12px] flex flex-wrap items-center gap-[10px] rounded-[8px] bg-muted p-[12px]">
                <p className="min-w-0 flex-1 font-roboto text-[13px] text-muted-foreground">
                  Vocês não são amigos. Aceite para mover a conversa para a caixa Principal.
                </p>
                <Button size="xs" onClick={() => moveToPrincipal(active.id)}>
                  Aceitar
                </Button>
              </div>
            )}

            <div className="flex flex-1 flex-col gap-[10px] overflow-y-auto scrollbar-thin py-[15px]">
              {active.messages.map((m) => {
                const mine = m.fromId === currentUser.id
                return (
                  <div key={m.id} className={`max-w-[75%] ${mine ? 'self-end' : 'self-start'}`}>
                    <div className={`rounded-[12px] px-[15px] py-[10px] font-roboto text-[15px] ${mine ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                      {m.text}
                    </div>
                    <p className={`mt-[2px] font-roboto text-[11px] text-muted-foreground ${mine ? 'text-right' : ''}`}>{timeAgo(m.createdAt)}</p>
                  </div>
                )
              })}
            </div>

            <form onSubmit={submit} className="flex gap-[10px] border-t border-border pt-[12px]">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Escreva uma mensagem…"
                aria-label="Escrever mensagem"
                disabled={active.box === 'solicitacoes'}
                className="min-w-0 flex-1 rounded-[5px] border border-border bg-background px-[15px] py-[10px] font-roboto text-[15px] text-foreground outline-none transition-all duration-240 focus:border-primary disabled:opacity-50"
              />
              <Button size="sm" type="submit" disabled={!text.trim() || active.box === 'solicitacoes'} aria-label="Enviar mensagem">
                <PaperPlaneRight size={16} weight="bold" />
              </Button>
            </form>
          </Card>
        ) : (
          <EmptyState title="Selecione uma conversa" subtitle="Ou inicie uma nova a partir do perfil de um amigo." />
        )}
      </div>

      {/* Popconfirm de bloqueio */}
      <Modal open={!!confirmBlock} onClose={() => setConfirmBlock(null)} title="Bloquear usuário?">
        <p className="font-roboto text-[15px] text-muted-foreground">
          {confirmBlock && users[confirmBlock]?.nickname} não poderá mais enviar mensagens nem interagir com você. Essa ação
          pode ser revertida nas configurações.
        </p>
        <div className="mt-[20px] flex justify-end gap-[15px]">
          <Button size="sm" variant="ghost" onClick={() => setConfirmBlock(null)}>
            Cancelar
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              blockUser(confirmBlock)
              setConfirmBlock(null)
              setActiveId(null)
            }}
          >
            Bloquear
          </Button>
        </div>
      </Modal>
    </div>
  )
}
