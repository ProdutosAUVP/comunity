import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowBendUpLeft,
  ArrowLeft,
  CheckCircle,
  Flag,
  GraduationCap,
  PushPin,
  SealCheck,
} from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { VoteControl } from '../components/PostCard'
import CoverArt from '../components/CoverArt'
import { Avatar, Button, Card, EmptyState, FlairBadge, Modal, RoleLabel, TagPill, TurmaTag } from '../components/ui'
import { REPORT_REASONS, timeAgo } from '../data/mock'

function buildTree(comments) {
  const byParent = {}
  for (const c of comments) {
    const key = c.parentId || 'root'
    ;(byParent[key] ||= []).push(c)
  }
  for (const key of Object.keys(byParent)) {
    byParent[key].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }
  return byParent
}

function CommentNode({ comment, byParent, post, depth, onReply, onReport }) {
  const { users, commentVotes, voteComment, markSolution, validateAnswer, currentUser } = useApp()
  const author = users[comment.authorId]
  const children = byParent[comment.id] || []
  const isSolution = post.solutionCommentId === comment.id
  const canMarkSolution = post.authorId === currentUser.id

  return (
    <div
      id={`comment-${comment.id}`}
      className={depth > 0 ? 'ml-[15px] border-l-2 border-border pl-[15px] md:ml-[20px] md:pl-[20px]' : ''}
    >
      <div
        className={`rounded-[12px] p-[15px] bg-card border ${
          isSolution ? 'border-primary/40' : comment.validated ? 'border-accent/40' : 'border-border'
        }`}
      >
        {(isSolution || comment.validated) && (
          <div className="mb-[10px] flex flex-wrap gap-[8px]">
            {isSolution && (
              <span className="flex items-center gap-[4px] rounded-[4px] bg-primary/10 px-[8px] py-[3px] font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-primary">
                <PushPin size={12} weight="fill" /> Solução do tópico
              </span>
            )}
            {comment.validated && (
              <span className="flex items-center gap-[4px] rounded-[4px] bg-accent/10 px-[8px] py-[3px] font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-accent">
                <SealCheck size={12} weight="fill" /> Resposta Validada
              </span>
            )}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-[8px]">
          <Avatar user={author} size={28} />
          <Link to={`/perfil/${author.id}`} className="font-roboto text-[13px] font-medium text-foreground hover:underline">
            {author.nickname}
          </Link>
          <RoleLabel user={author} />
          <TurmaTag turma={author.turma} />
          <span className="font-roboto text-[12px] text-muted-foreground">· {timeAgo(comment.createdAt)}</span>
        </div>

        <p className="mt-[10px] font-roboto text-[15px] leading-[1.6] text-foreground">{comment.body}</p>

        <div className="mt-[10px] flex flex-wrap items-center gap-[10px]">
          <VoteControl
            score={comment.upvotes}
            vote={commentVotes[comment.id] || 0}
            onVote={(dir) => voteComment(comment.id, dir)}
            vertical={false}
          />
          <button
            onClick={() => onReply(comment)}
            className="flex items-center gap-[4px] rounded-[5px] px-[8px] py-[4px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-muted-foreground transition-all duration-240 hover:text-primary"
          >
            <ArrowBendUpLeft size={14} weight="bold" /> Responder
          </button>
          {canMarkSolution && (
            <button
              onClick={() => markSolution(post.id, comment.id)}
              className={`flex items-center gap-[4px] rounded-[5px] px-[8px] py-[4px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] transition-all duration-240 ${
                isSolution ? 'text-primary' : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <CheckCircle size={14} weight={isSolution ? 'fill' : 'bold'} /> {isSolution ? 'Solução marcada' : 'Marcar solução'}
            </button>
          )}
          {currentUser.role === 'conselheiro' || currentUser.role === 'moderador' ? (
            <button
              onClick={() => validateAnswer(comment.id)}
              className="flex items-center gap-[4px] rounded-[5px] px-[8px] py-[4px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-muted-foreground transition-all duration-240 hover:text-accent"
            >
              <SealCheck size={14} weight="bold" /> Validar
            </button>
          ) : null}
          <button
            onClick={() => onReport({ targetType: 'comment', targetId: comment.id, targetAuthorId: comment.authorId, excerpt: comment.body.slice(0, 120) })}
            aria-label="Denunciar comentário"
            className="ml-auto flex items-center gap-[4px] rounded-[5px] px-[8px] py-[4px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-muted-foreground transition-all duration-240 hover:text-destructive"
          >
            <Flag size={14} weight="bold" /> Denunciar
          </button>
        </div>
      </div>

      {children.length > 0 && (
        <div className="mt-[10px] flex flex-col gap-[10px]">
          {children.map((child) => (
            <CommentNode key={child.id} comment={child} byParent={byParent} post={post} depth={depth + 1} onReply={onReply} onReport={onReport} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function PostDetailPage() {
  const { postId } = useParams()
  const { posts, comments, users, postVotes, votePost, addComment, reportContent, toast } = useApp()
  const [replyTo, setReplyTo] = useState(null)
  const [commentText, setCommentText] = useState('')
  const [reportTarget, setReportTarget] = useState(null)
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0])

  const post = posts.find((p) => p.id === postId)
  const postComments = useMemo(() => comments.filter((c) => c.postId === postId), [comments, postId])
  const byParent = useMemo(() => buildTree(postComments), [postComments])

  if (!post) {
    return <EmptyState title="Tópico não encontrado" subtitle="Ele pode ter sido removido pela moderação." />
  }

  const author = users[post.authorId]

  const submitComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    addComment(post.id, replyTo?.id || null, commentText.trim())
    setCommentText('')
    setReplyTo(null)
    toast('Comentário publicado. O autor do tópico será notificado.')
  }

  const goToSolution = () => {
    document.getElementById(`comment-${post.solutionCommentId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const submitReport = () => {
    reportContent({ ...reportTarget, reason: reportReason })
    setReportTarget(null)
  }

  return (
    <div className="flex flex-col gap-[15px]">
      <Link to="/" className="flex w-fit items-center gap-[6px] font-sora text-[12px] font-bold uppercase tracking-[0.05em] text-primary hover:underline">
        <ArrowLeft size={14} weight="bold" /> Voltar ao Hub
      </Link>

      <Card>
        {post.cover && <CoverArt id={post.cover} className="-mx-[20px] -mt-[20px] md:-mx-[30px] md:-mt-[30px] mb-[20px] h-[180px] rounded-t-[12px]" />}
        <div className="flex gap-[15px]">
          <VoteControl score={post.upvotes} vote={postVotes[post.id] || 0} onVote={(dir) => votePost(post.id, dir)} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-[8px]">
              <Avatar user={author} size={34} />
              <Link to={`/perfil/${author.id}`} className="font-roboto text-[14px] font-medium text-foreground hover:underline">
                {author.nickname}
              </Link>
              <RoleLabel user={author} />
              <TurmaTag turma={author.turma} />
              <span className="font-roboto text-[13px] text-muted-foreground">· {timeAgo(post.createdAt)}</span>
            </div>

            <div className="mt-[15px] flex flex-wrap items-center gap-[8px]">
              <FlairBadge flair={post.flair} />
            </div>
            <h1 className="mt-[8px] font-anek text-[26px] md:text-[34px] font-semibold leading-[1.15] text-foreground">{post.title}</h1>
            <p className="mt-[15px] font-roboto text-[17px] leading-[1.6] text-foreground">{post.body}</p>

            <div className="mt-[15px] flex flex-wrap gap-[8px]">
              {post.tags.map((t) => (
                <TagPill key={t} tag={t} />
              ))}
            </div>

            {/* Aviso de pergunta respondida + ir para solução */}
            {post.solutionCommentId && (
              <div className="mt-[20px] flex flex-wrap items-center gap-[15px] rounded-[12px] bg-muted p-[15px]">
                <span className="flex items-center gap-[8px] font-roboto text-[15px] font-medium text-foreground">
                  <CheckCircle size={20} weight="fill" className="text-primary" /> Esta pergunta já foi respondida
                </span>
                <Button size="xs" variant="outline" onClick={goToSolution}>
                  Ir para solução
                </Button>
              </div>
            )}

            {/* Sugestão automática de aula da Escola AUVP */}
            {post.suggestedLesson && (
              <div className="mt-[15px] flex flex-wrap items-center gap-[10px] rounded-[12px] border border-primary/20 bg-card p-[15px]">
                <GraduationCap size={22} weight="bold" className="text-primary" />
                <div className="min-w-0 flex-1">
                  <p className="font-sora text-[10px] font-bold uppercase tracking-[0.15em] text-primary">Sugestão de aula · Escola AUVP</p>
                  <p className="font-roboto text-[14px] text-foreground">
                    {post.suggestedLesson.module} — {post.suggestedLesson.lesson}
                  </p>
                </div>
                <Button size="xs" variant="ghost" onClick={() => toast('Abrindo a aula na Escola AUVP…', 'info')}>
                  Assistir
                </Button>
              </div>
            )}

            <div className="mt-[15px] flex justify-end">
              <button
                onClick={() => setReportTarget({ targetType: 'post', targetId: post.id, targetAuthorId: post.authorId, excerpt: post.title })}
                className="flex items-center gap-[4px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-muted-foreground transition-all duration-240 hover:text-destructive"
              >
                <Flag size={14} weight="bold" /> Denunciar publicação
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Editor de comentário */}
      <Card className="!p-[20px]">
        <form onSubmit={submitComment}>
          {replyTo && (
            <div className="mb-[10px] flex items-center justify-between rounded-[5px] bg-muted px-[12px] py-[8px]">
              <p className="font-roboto text-[13px] text-muted-foreground">
                Respondendo a <strong className="text-foreground">{users[replyTo.authorId].nickname}</strong>: “{replyTo.body.slice(0, 60)}…”
              </p>
              <button type="button" onClick={() => setReplyTo(null)} className="font-sora text-[11px] font-bold uppercase text-primary">
                Cancelar
              </button>
            </div>
          )}
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={replyTo ? 'Escreva sua resposta…' : 'Contribua com o tópico…'}
            rows={3}
            aria-label="Escrever comentário"
            className="w-full resize-y rounded-[5px] border border-border bg-background p-[15px] font-roboto text-[15px] text-foreground outline-none transition-all duration-240 focus:border-primary"
          />
          <div className="mt-[10px] flex justify-end">
            <Button size="sm" type="submit" disabled={!commentText.trim()}>
              {replyTo ? 'Responder' : 'Comentar'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Árvore de comentários */}
      <section aria-label="Comentários">
        <h2 className="mb-[15px] font-anek text-[22px] font-semibold text-foreground">
          Comentários <span className="font-roboto text-[14px] font-normal text-muted-foreground">({postComments.length})</span>
        </h2>
        <div className="flex flex-col gap-[10px]">
          {(byParent.root || []).map((c) => (
            <CommentNode key={c.id} comment={c} byParent={byParent} post={post} depth={0} onReply={setReplyTo} onReport={setReportTarget} />
          ))}
          {postComments.length === 0 && <EmptyState title="Seja o primeiro a comentar" subtitle="O autor segue automaticamente este tópico e será notificado." />}
        </div>
      </section>

      {/* Modal de denúncia */}
      <Modal open={!!reportTarget} onClose={() => setReportTarget(null)} title="Denunciar conteúdo">
        <p className="font-roboto text-[15px] text-muted-foreground">
          Sua identidade fica protegida por anonimato público — apenas a moderação poderá vê-la.
        </p>
        <div className="mt-[15px] flex flex-col gap-[8px]">
          {REPORT_REASONS.map((r) => (
            <label key={r} className={`flex cursor-pointer items-center gap-[10px] rounded-[5px] border p-[12px] transition-all duration-240 ${reportReason === r ? 'border-primary bg-muted' : 'border-border'}`}>
              <input type="radio" name="report-reason" checked={reportReason === r} onChange={() => setReportReason(r)} className="accent-primary" />
              <span className="font-roboto text-[15px] text-foreground">{r}</span>
            </label>
          ))}
        </div>
        <div className="mt-[20px] flex justify-end gap-[15px]">
          <Button size="sm" variant="ghost" onClick={() => setReportTarget(null)}>
            Cancelar
          </Button>
          <Button size="sm" variant="danger" onClick={submitReport}>
            Enviar denúncia
          </Button>
        </div>
      </Modal>
    </div>
  )
}
