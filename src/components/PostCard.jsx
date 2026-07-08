import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowFatDown,
  ArrowFatUp,
  ChatCircle,
  CheckCircle,
  Eye,
  EyeSlash,
  FolderSimple,
  PencilSimple,
  Trash,
} from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { AREAS, timeAgo } from '../data/mock'
import { AreaPill, Avatar, Button, Card, FlairBadge, Modal, RoleLabel, TagPill, TurmaTag } from './ui'
import CoverArt from './CoverArt'

export function VoteControl({ score, vote, onVote, vertical = true }) {
  return (
    <div className={`flex ${vertical ? 'flex-col' : 'flex-row'} items-center gap-[4px]`}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onVote(1)
        }}
        aria-label="Voto positivo"
        className={`rounded-[5px] p-[5px] transition-all duration-240 ${vote === 1 ? 'text-primary bg-muted' : 'text-muted-foreground hover:text-primary'}`}
      >
        <ArrowFatUp size={18} weight={vote === 1 ? 'fill' : 'bold'} />
      </button>
      <span className={`font-sora text-[13px] font-bold ${vote === 1 ? 'text-primary' : vote === -1 ? 'text-destructive' : 'text-foreground'}`}>
        {score}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onVote(-1)
        }}
        aria-label="Voto negativo"
        className={`rounded-[5px] p-[5px] transition-all duration-240 ${vote === -1 ? 'text-destructive bg-muted' : 'text-muted-foreground hover:text-destructive'}`}
      >
        <ArrowFatDown size={18} weight={vote === -1 ? 'fill' : 'bold'} />
      </button>
    </div>
  )
}

// Barra de moderação inline — visível só quando o moderador ativa "Moderar
// Comunidade" no menu lateral. Permite editar, ocultar, mover e excluir o
// tópico sem sair da visão normal da comunidade.
function ModTools({ post }) {
  const { editPost, togglePostHidden, movePost, deletePost } = useApp()
  const [editOpen, setEditOpen] = useState(false)
  const [moveOpen, setMoveOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [title, setTitle] = useState(post.title)
  const [body, setBody] = useState(post.body)

  const stop = (e) => e.stopPropagation()

  return (
    <>
      <div
        onClick={stop}
        className="mb-[15px] flex flex-wrap items-center gap-[8px] rounded-[8px] border border-accent/30 bg-accent/5 px-[12px] py-[8px]"
      >
        <span className="font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-accent">Moderação</span>
        <Button size="xs" variant="ghost" onClick={() => setEditOpen(true)}>
          <PencilSimple size={13} weight="bold" /> Editar
        </Button>
        <Button size="xs" variant="ghost" onClick={() => togglePostHidden(post.id)}>
          {post.hidden ? <Eye size={13} weight="bold" /> : <EyeSlash size={13} weight="bold" />}
          {post.hidden ? 'Reexibir' : 'Ocultar'}
        </Button>
        <Button size="xs" variant="ghost" onClick={() => setMoveOpen(true)}>
          <FolderSimple size={13} weight="bold" /> Mover
        </Button>
        <Button size="xs" variant="danger-outline" onClick={() => setDeleteOpen(true)}>
          <Trash size={13} weight="bold" /> Excluir
        </Button>
        {post.hidden && (
          <span className="ml-auto rounded-[4px] bg-muted px-[8px] py-[2px] font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-muted-foreground">
            Oculto da comunidade
          </span>
        )}
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar tópico">
        <div onClick={stop} className="flex flex-col gap-[15px]">
          <div>
            <label className="mb-[6px] block font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-[5px] border border-border bg-background p-[12px] font-roboto text-[15px] text-foreground outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-[6px] block font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Detalhamento</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              className="w-full resize-y rounded-[5px] border border-border bg-background p-[12px] font-roboto text-[15px] text-foreground outline-none focus:border-primary"
            />
          </div>
          <div className="flex justify-end gap-[15px]">
            <Button size="sm" variant="ghost" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={() => {
                editPost(post.id, { title: title.trim() || post.title, body: body.trim() || post.body })
                setEditOpen(false)
              }}
            >
              Salvar edição
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={moveOpen} onClose={() => setMoveOpen(false)} title="Mover tópico">
        <div onClick={stop}>
          <p className="mb-[15px] font-roboto text-[14px] text-muted-foreground">
            Mova o tópico para outra área (fórum) da comunidade.
          </p>
          <div className="flex flex-wrap gap-[8px]">
            {Object.entries(AREAS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => {
                  movePost(post.id, key)
                  setMoveOpen(false)
                }}
                className={`rounded-[5px] p-[2px] transition-all duration-240 ${key === post.area ? '' : 'opacity-70 hover:opacity-100'}`}
              >
                <AreaPill label={label} active={key === post.area} />
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Excluir tópico">
        <div onClick={stop}>
          <p className="font-roboto text-[15px] text-muted-foreground">
            O tópico <strong className="text-foreground">"{post.title}"</strong> será removido da comunidade. Conforme o
            Marco Civil da Internet, o registro não é apagado fisicamente — fica marcado como excluído e permanece legível
            no Log de Auditoria (soft delete).
          </p>
          <div className="mt-[20px] flex justify-end gap-[15px]">
            <Button size="sm" variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                deletePost(post.id)
                setDeleteOpen(false)
              }}
            >
              Excluir tópico
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default function PostCard({ post, compact = false }) {
  const { users, comments, postVotes, votePost, moderationMode } = useApp()
  const navigate = useNavigate()
  const author = users[post.authorId]
  const commentCount = comments.filter((c) => c.postId === post.id).length

  if (post.hidden && !moderationMode) {
    return (
      <Card className="!p-[20px] opacity-80">
        <div className="flex items-center gap-[10px] text-muted-foreground">
          <EyeSlash size={18} weight="bold" />
          <p className="font-roboto text-[14px]">
            Conteúdo ocultado temporariamente pela moderação e enviado para análise.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <Card
      hover
      className="!p-[20px] cursor-pointer"
      onClick={() => navigate(`/post/${post.id}`)}
      role="article"
      aria-label={post.title}
    >
      {moderationMode && <ModTools post={post} />}
      {post.cover && <CoverArt id={post.cover} className="-mx-[20px] -mt-[20px] mb-[15px] h-[110px] rounded-t-[12px]" />}
      <div className="flex gap-[15px]">
        <VoteControl score={post.upvotes} vote={postVotes[post.id] || 0} onVote={(dir) => votePost(post.id, dir)} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-[8px]">
            <Avatar user={author} size={30} />
            <span className="font-roboto text-[13px] font-medium text-foreground">{author.nickname}</span>
            <RoleLabel user={author} />
            <TurmaTag turma={author.turma} />
            <span className="font-roboto text-[13px] text-muted-foreground">· {timeAgo(post.createdAt)}</span>
          </div>

          <div className="mt-[10px] flex flex-wrap items-center gap-[8px]">
            <AreaPill label={AREAS[post.area] || post.area} />
            <FlairBadge flair={post.flair} />
            <h3 className="font-anek text-[19px] md:text-[22px] font-semibold leading-[1.2] text-foreground">
              {post.title}
            </h3>
          </div>

          {!compact && <p className="mt-[8px] font-roboto text-[15px] text-foreground/80 line-clamp-2">{post.body}</p>}

          <div className="mt-[15px] flex flex-wrap items-center gap-[8px]">
            {post.tags.map((t) => (
              <TagPill key={t} tag={t} />
            ))}
            <span className="ml-auto flex items-center gap-[6px] font-roboto text-[13px] text-muted-foreground">
              <ChatCircle size={16} weight="bold" /> {commentCount} comentários
            </span>
            {post.solutionCommentId && (
              <span className="flex items-center gap-[4px] rounded-[4px] bg-primary/10 px-[8px] py-[2px] font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-primary">
                <CheckCircle size={12} weight="fill" /> Respondida
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}
