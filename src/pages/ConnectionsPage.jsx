import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Copy, ShareNetwork, X } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { Avatar, Button, Card, EmptyState, Eyebrow, RoleLabel, TurmaTag } from '../components/ui'
import { REFERRAL_LINK, timeAgo } from '../data/mock'

export default function ConnectionsPage() {
  const { users, currentUser, friendRequests, acceptFriendRequest, declineFriendRequest, toggleFollow, toast } = useApp()
  const [copied, setCopied] = useState(false)

  // Amigos = seguem-se mutuamente
  const friends = useMemo(
    () => currentUser.following.filter((id) => users[id]?.following.includes(currentUser.id)).map((id) => users[id]),
    [currentUser, users],
  )
  const followingOnly = currentUser.following.filter((id) => !users[id]?.following.includes(currentUser.id)).map((id) => users[id])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_LINK)
    } catch {
      /* clipboard indisponível em alguns contextos — o feedback visual basta na demo */
    }
    setCopied(true)
    toast('Link de indicação copiado!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col gap-[15px]">
      <div>
        <Eyebrow>Relacionamento</Eyebrow>
        <h1 className="mt-[4px] font-anek text-[30px] md:text-[41px] font-semibold leading-[1.15] text-foreground">Conexões</h1>
        <p className="mt-[8px] font-roboto text-[15px] text-muted-foreground">
          Quando alguém te segue e você segue de volta, vocês se tornam amigos — e as DMs passam a chegar na caixa Principal.
        </p>
      </div>

      {/* Link de indicação — seção de impacto, sempre em fundo escuro */}
      <div className="dark rounded-[12px] border border-border bg-card p-[20px] md:p-[30px]">
        <Eyebrow>Indique um futuro aluno</Eyebrow>
        <p className="mt-[8px] font-roboto text-[15px] text-muted-foreground">Compartilhe seu link exclusivo de indicação da Escola AUVP.</p>
        <div className="mt-[15px] flex flex-wrap items-center gap-[15px]">
          <code className="min-w-0 flex-1 truncate rounded-[5px] border border-border px-[15px] py-[12px] font-roboto text-[14px] text-foreground">
            {REFERRAL_LINK}
          </code>
          <Button variant="primary" size="sm" onClick={copyLink}>
            {copied ? <Check size={15} weight="bold" /> : <Copy size={15} weight="bold" />} {copied ? 'Copiado' : 'Copiar'}
          </Button>
          <Button variant="outline" size="sm" onClick={() => toast('Compartilhamento aberto no seu dispositivo.', 'info')}>
            <ShareNetwork size={15} weight="bold" /> Compartilhar
          </Button>
        </div>
      </div>

      {/* Solicitações pendentes */}
      <Card>
        <Eyebrow>Solicitações de amizade pendentes ({friendRequests.length})</Eyebrow>
        <div className="mt-[15px] flex flex-col gap-[10px]">
          {friendRequests.length === 0 && <p className="font-roboto text-[14px] text-muted-foreground">Nenhuma solicitação no momento.</p>}
          {friendRequests.map((req) => {
            const u = users[req.fromId]
            return (
              <div key={req.id} className="flex flex-wrap items-center gap-[10px] rounded-[12px] bg-muted p-[15px]">
                <Avatar user={u} size={40} />
                <div className="min-w-0 flex-1">
                  <Link to={`/perfil/${u.id}`} className="font-roboto text-[15px] font-medium text-foreground hover:underline">
                    {u.nickname}
                  </Link>
                  <p className="font-roboto text-[12px] text-muted-foreground">
                    {u.turma} · começou a te seguir {timeAgo(req.createdAt)}
                  </p>
                </div>
                <Button size="xs" onClick={() => acceptFriendRequest(req.id)}>
                  <Check size={13} weight="bold" /> Seguir de volta
                </Button>
                <Button size="xs" variant="ghost" onClick={() => declineFriendRequest(req.id)} aria-label={`Dispensar solicitação de ${u.nickname}`}>
                  <X size={13} weight="bold" />
                </Button>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Amigos ativos */}
      <Card>
        <Eyebrow>Amigos ativos ({friends.length})</Eyebrow>
        <div className="mt-[15px] grid gap-[15px] sm:grid-cols-2">
          {friends.map((u) => (
            <div key={u.id} className="flex items-center gap-[10px] rounded-[12px] bg-muted p-[15px]">
              <Avatar user={u} size={44} />
              <div className="min-w-0 flex-1">
                <Link to={`/perfil/${u.id}`} className="block truncate font-roboto text-[15px] font-medium text-foreground hover:underline">
                  {u.nickname}
                </Link>
                <div className="mt-[4px] flex items-center gap-[6px]">
                  <TurmaTag turma={u.turma} />
                  <RoleLabel user={u} />
                </div>
              </div>
              <Link to="/mensagens">
                <Button size="xs" variant="outline">
                  DM
                </Button>
              </Link>
            </div>
          ))}
          {friends.length === 0 && <EmptyState title="Nenhum amigo ainda" subtitle="Siga alunos que te seguem para formar amizades." />}
        </div>
      </Card>

      {/* Seguindo */}
      <Card>
        <Eyebrow>Você segue ({followingOnly.length})</Eyebrow>
        <div className="mt-[15px] grid gap-[15px] sm:grid-cols-2">
          {followingOnly.map((u) => (
            <div key={u.id} className="flex items-center gap-[10px] rounded-[12px] border border-border p-[15px]">
              <Avatar user={u} size={40} />
              <div className="min-w-0 flex-1">
                <Link to={`/perfil/${u.id}`} className="block truncate font-roboto text-[15px] font-medium text-foreground hover:underline">
                  {u.nickname}
                </Link>
                <TurmaTag turma={u.turma} />
              </div>
              <Button size="xs" variant="ghost" onClick={() => toggleFollow(u.id)}>
                Deixar de seguir
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
