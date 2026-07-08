import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowBendUpLeft,
  ArrowFatUp,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeSlash,
  Flag,
  GraduationCap,
  Minus,
  PencilSimple,
  Plus,
  PushPin,
  SealCheck,
  ShieldCheck,
  Trash,
} from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { VoteControl } from '../components/PostCard'
import CoverArt from '../components/CoverArt'
import RichComposer from '../components/RichComposer'
import { RichText, stripMarkdown } from '../components/RichText'
import { AreaPill, Avatar, Button, Card, EmptyState, FlairBadge, Modal, RoleLabel, Segmented, TagPill, TurmaTag } from '../components/ui'
import { AREAS, REACTIONS, REPORT_REASONS, timeAgo } from '../data/mock'

// Barra de moderação inline do comentário — mesmo padrão do ModTools de
// posts (PostCard.jsx), disponível em qualquer lugar do programa onde a
// árvore de comentários apareça, sempre que "Moderar comunidade" está ativo.
function CommentModTools({ comment }) {
  const { editComment, toggleCommentHidden, deleteComment } = useApp()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [body, setBody] = useState(comment.body)

  const stop = (e) => e.stopPropagation()

  return (
    <div onClick={stop} className="mb-[10px] flex flex-wrap items-center gap-[8px] rounded-[8px] border border-accent/30 bg-accent/5 px-[10px] py-[6px]">
      <span className="flex items-center gap-[4px] font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-accent">
        <ShieldCheck size={12} weight="bold" /> Moderação
      </span>
      <Button size="xs" variant="ghost" onClick={() => setEditOpen(true)}>
        <PencilSimple size={12} weight="bold" /> Editar
      </Button>
      <Button size="xs" variant="ghost" onClick={() => toggleCommentHidden(comment.id)}>
        {comment.hidden ? <Eye size={12} weight="bold" /> : <EyeSlash size={12} weight="bold" />}
        {comment.hidden ? 'Reexibir' : 'Ocultar'}
      </Button>
      <Button size="xs" variant="danger-outline" onClick={() => setDeleteOpen(true)}>
        <Trash size={12} weight="bold" /> Excluir
      </Button>
      {comment.hidden && (
        <span className="ml-auto rounded-[4px] bg-muted px-[8px] py-[2px] font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-muted-foreground">
          Oculto da comunidade
        </span>
      )}

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar comentário">
        <div onClick={stop} className="flex flex-col gap-[15px]">
          <RichComposer value={body} onChange={setBody} rows={4} ariaLabel="Editar comentário" />
          <div className="flex justify-end gap-[15px]">
            <Button size="sm" variant="ghost" onClick={() => setEditOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={() => {
                editComment(comment.id, { body: body.trim() || comment.body })
                setEditOpen(false)
              }}
            >
              Salvar edição
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Excluir comentário">
        <div onClick={stop}>
          <p className="font-roboto text-[15px] text-muted-foreground">
            O comentário será removido da comunidade. Conforme o Marco Civil da Internet, o registro não é apagado
            fisicamente — fica marcado como excluído e permanece legível no Log de Auditoria (soft delete).
          </p>
          <div className="mt-[20px] flex justify-end gap-[15px]">
            <Button size="sm" variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancelar
            </Button>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                deleteComment(comment.id)
                setDeleteOpen(false)
              }}
            >
              Excluir comentário
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

// Upvote-only: comentários não têm downvote (evita brigada anônima), só um
// toggle de apoio — inline na barra de ações, junto de Responder/Denunciar.
function CommentUpvote({ score, active, onToggle }) {
  return (
    <button
      onClick={() => onToggle()}
      aria-label="Apoiar comentário"
      className={`flex items-center gap-[4px] rounded-[5px] px-[8px] py-[4px] font-sora text-[11px] font-bold transition-all duration-240 ${
        active ? 'text-primary' : 'text-muted-foreground hover:text-primary'
      }`}
    >
      <ArrowFatUp size={14} weight={active ? 'fill' : 'bold'} /> {score}
    </button>
  )
}

function ReactionBar({ commentId }) {
  const { commentReactions, myReactions, toggleReaction } = useApp()
  const counts = commentReactions[commentId] || {}
  const mine = myReactions[commentId] || new Set()
  return (
    <div className="mt-[10px] flex flex-wrap gap-[6px]">
      {REACTIONS.map((r) => {
        const active = mine.has(r.key)
        const count = counts[r.key] || 0
        return (
          <button
            key={r.key}
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              toggleReaction(commentId, r.key)
            }}
            className={`rounded-[5px] border px-[8px] py-[3px] font-roboto text-[12px] transition-all duration-240 ${
              active
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
            }`}
          >
            {r.label}
            {count > 0 && <span className="ml-[4px] opacity-70">{count}</span>}
          </button>
        )
      })}
    </div>
  )
}

const COMMENT_SORTS = [
  { value: 'votes', label: 'Mais votados', cmp: (a, b) => b.upvotes - a.upvotes },
  { value: 'newest', label: 'Mais recentes', cmp: (a, b) => new Date(b.createdAt) - new Date(a.createdAt) },
  { value: 'oldest', label: 'Mais antigos', cmp: (a, b) => new Date(a.createdAt) - new Date(b.createdAt) },
]

// Só os comentários de nível raiz seguem o filtro escolhido — as respostas
// dentro de uma mesma conversa continuam em ordem cronológica, como no Reddit.
function buildTree(comments, rootCmp) {
  const byParent = {}
  for (const c of comments) {
    const key = c.parentId || 'root'
    ;(byParent[key] ||= []).push(c)
  }
  for (const key of Object.keys(byParent)) {
    byParent[key].sort(key === 'root' ? rootCmp : (a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }
  return byParent
}

// Caixa de resposta inline: abre logo abaixo do comentário respondido,
// empurrando a thread abaixo dela para baixo (fluxo normal do documento,
// sem overlay) — anima a entrada/saída em vez de aparecer bruscamente.
function InlineReplyBox({ authorName, onCancel, onSubmit }) {
  const [text, setText] = useState('')
  return (
    <div className="animate-reply-in mt-[10px] rounded-[10px] border border-primary/30 bg-muted/40 p-[12px]">
      <RichComposer
        value={text}
        onChange={setText}
        rows={3}
        placeholder={`Respondendo a ${authorName}…`}
        ariaLabel="Escrever resposta"
      />
      <div className="mt-[10px] flex justify-end gap-[10px]">
        <Button size="xs" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          size="xs"
          disabled={!text.trim()}
          onClick={() => {
            onSubmit(text.trim())
            setText('')
          }}
        >
          Responder
        </Button>
      </div>
    </div>
  )
}

// Conta toda a descendência (respostas de respostas) de um comentário, para
// o resumo exibido quando a thread está recolhida ("X respostas ocultas").
function countDescendants(byParent, commentId) {
  const kids = byParent[commentId] || []
  return kids.reduce((total, k) => total + 1 + countDescendants(byParent, k.id), 0)
}

// Largura do "trilho" do avatar e distância até a coluna de conteúdo —
// usadas também para calcular o conector curvo (ver comentário abaixo).
const RAIL_WIDTH = 32
const RAIL_GAP = 10
const CURVE_OFFSET = RAIL_WIDTH / 2 + RAIL_GAP // até o centro do trilho do pai
const CURVE_HEIGHT = RAIL_WIDTH / 2 // até a metade da altura do avatar

function CommentNode({ comment, byParent, post, depth, replyingTo, onStartReply, onCancelReply, onSubmitReply, onReport }) {
  const { users, commentVotes, voteComment, markSolution, validateAnswer, currentUser, moderationMode } = useApp()
  const [collapsed, setCollapsed] = useState(false)
  const author = users[comment.authorId]
  const children = byParent[comment.id] || []
  const hasChildren = children.length > 0
  const isSolution = post.solutionCommentId === comment.id
  const canMarkSolution = post.authorId === currentUser.id
  const isReplying = replyingTo === comment.id
  const descendantCount = hasChildren ? countDescendants(byParent, comment.id) : 0

  const hiddenPlaceholder = comment.hidden && !moderationMode

  return (
    // Estilo Reddit: a linha sai do círculo do avatar, passa por um "nó"
    // (o botão de recolher/expandir) e se curva para se ligar ao avatar da
    // resposta abaixo — em vez de um traço reto genérico.
    <div id={`comment-${comment.id}`} className="relative">
      {depth > 0 && (
        <span
          className="pointer-events-none absolute left-0 top-0 rounded-bl-[10px] border-b-2 border-l-2 border-border"
          style={{ left: `-${CURVE_OFFSET}px`, width: `${CURVE_OFFSET}px`, height: `${CURVE_HEIGHT}px` }}
          aria-hidden
        />
      )}

      {hiddenPlaceholder ? (
        <div className="flex items-center gap-[8px] py-[10px] text-muted-foreground">
          <EyeSlash size={15} weight="bold" />
          <p className="font-roboto text-[13px]">Comentário ocultado pela moderação.</p>
        </div>
      ) : (
        <div className="flex gap-[10px] py-[10px]">
          {/* Trilho: avatar no topo, nó de recolher/expandir logo abaixo, e
              a linha que continua descendo até a última resposta aninhada. */}
          <div className="flex shrink-0 flex-col items-center" style={{ width: RAIL_WIDTH }}>
            <Avatar user={author} size={RAIL_WIDTH} showRole={false} />
            {hasChildren && (
              <button
                onClick={() => setCollapsed((c) => !c)}
                aria-label={collapsed ? 'Expandir respostas' : 'Recolher respostas'}
                title={collapsed ? 'Expandir respostas' : 'Recolher respostas'}
                className="my-[6px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-240 hover:border-primary hover:text-primary"
              >
                {collapsed ? <Plus size={10} weight="bold" /> : <Minus size={10} weight="bold" />}
              </button>
            )}
            {!collapsed && hasChildren && <span className="w-[2px] flex-1 bg-border" aria-hidden />}
          </div>

          <div className="min-w-0 flex-1 pb-[4px]">
            {moderationMode && (
              <div className="mb-[10px]">
                <CommentModTools comment={comment} />
              </div>
            )}

            {collapsed ? (
              <button onClick={() => setCollapsed(false)} className="flex items-center gap-[6px] text-left">
                <Link to={`/perfil/${author.id}`} className="font-roboto text-[13px] font-medium text-foreground hover:underline">
                  {author.nickname}
                </Link>
                <span className="font-roboto text-[12px] text-muted-foreground">
                  · {timeAgo(comment.createdAt)} · {descendantCount + 1} comentários ocultos
                </span>
              </button>
            ) : (
              <>
                {(isSolution || comment.validated) && (
                  <div className="mb-[8px] flex flex-wrap gap-[8px]">
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
                  <Link to={`/perfil/${author.id}`} className="font-roboto text-[13px] font-medium text-foreground hover:underline">
                    {author.nickname}
                  </Link>
                  <RoleLabel user={author} />
                  <TurmaTag turma={author.turma} />
                  <span className="font-roboto text-[12px] text-muted-foreground">· {timeAgo(comment.createdAt)}</span>
                </div>

                <RichText text={comment.body} className="mt-[6px] font-roboto text-[15px] leading-[1.6] text-foreground" />

                <ReactionBar commentId={comment.id} />

                <div className="mt-[8px] flex flex-wrap items-center gap-[10px]">
                  <CommentUpvote
                    score={comment.upvotes}
                    active={(commentVotes[comment.id] || 0) === 1}
                    onToggle={() => voteComment(comment.id, 1)}
                  />
                  <button
                    onClick={() => onStartReply(comment.id)}
                    className={`flex items-center gap-[4px] rounded-[5px] px-[8px] py-[4px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] transition-all duration-240 ${
                      isReplying ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                    }`}
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
                    onClick={() => onReport({ targetType: 'comment', targetId: comment.id, targetAuthorId: comment.authorId, excerpt: stripMarkdown(comment.body).slice(0, 120) })}
                    aria-label="Denunciar comentário"
                    className="ml-auto flex items-center gap-[4px] rounded-[5px] px-[8px] py-[4px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-muted-foreground transition-all duration-240 hover:text-destructive"
                  >
                    <Flag size={14} weight="bold" /> Denunciar
                  </button>
                </div>

                {isReplying && (
                  <InlineReplyBox
                    authorName={author.nickname}
                    onCancel={onCancelReply}
                    onSubmit={(text) => onSubmitReply(comment.id, text)}
                  />
                )}
              </>
            )}

            {!collapsed && hasChildren && (
              <div className="mt-[10px] flex flex-col">
                {children.map((child) => (
                  <CommentNode
                    key={child.id}
                    comment={child}
                    byParent={byParent}
                    post={post}
                    depth={depth + 1}
                    replyingTo={replyingTo}
                    onStartReply={onStartReply}
                    onCancelReply={onCancelReply}
                    onSubmitReply={onSubmitReply}
                    onReport={onReport}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function PostDetailPage() {
  const { postId } = useParams()
  const { posts, comments, users, postVotes, votePost, addComment, reportContent, toast } = useApp()
  const [commentText, setCommentText] = useState('')
  const [reportTarget, setReportTarget] = useState(null)
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0])
  // Só um comentário pode estar com a caixa de resposta aberta por vez —
  // ela aparece inline, logo abaixo do comentário respondido.
  const [replyingTo, setReplyingTo] = useState(null)
  const [commentSort, setCommentSort] = useState('votes')

  const post = posts.find((p) => p.id === postId)
  const postComments = useMemo(() => comments.filter((c) => c.postId === postId), [comments, postId])
  const rootCmp = COMMENT_SORTS.find((s) => s.value === commentSort).cmp
  const byParent = useMemo(() => buildTree(postComments, rootCmp), [postComments, rootCmp])

  if (!post) {
    return <EmptyState title="Tópico não encontrado" subtitle="Ele pode ter sido removido pela moderação." />
  }

  const author = users[post.authorId]

  const submitComment = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    addComment(post.id, null, commentText.trim())
    setCommentText('')
    toast('Comentário publicado. O autor do tópico será notificado.')
  }

  const startReply = (commentId) => setReplyingTo((prev) => (prev === commentId ? null : commentId))

  const submitReply = (parentId, text) => {
    if (!text.trim()) return
    addComment(post.id, parentId, text.trim())
    setReplyingTo(null)
    toast('Resposta publicada. O autor será notificado.')
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
        <ArrowLeft size={14} weight="bold" /> Voltar ao Início
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
              <AreaPill label={AREAS[post.area] || post.area} />
              <FlairBadge flair={post.flair} />
            </div>
            <h1 className="mt-[8px] font-anek text-[26px] md:text-[34px] font-semibold leading-[1.15] text-foreground">{post.title}</h1>
            <RichText text={post.body} className="mt-[15px] font-roboto text-[17px] leading-[1.6] text-foreground" />

            {post.tags.length > 0 && (
              <div className="mt-[15px] flex flex-wrap gap-[8px]">
                {post.tags.map((t) => (
                  <TagPill key={t} tag={t} />
                ))}
              </div>
            )}

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

      {/* Editor de novo comentário (raiz) — respostas a comentários específicos
          abrem inline, logo abaixo do comentário respondido. */}
      <Card className="!p-[20px]">
        <form onSubmit={submitComment}>
          <RichComposer
            value={commentText}
            onChange={setCommentText}
            placeholder="Contribua com o tópico…"
            rows={3}
            ariaLabel="Escrever comentário"
          />
          <div className="mt-[10px] flex justify-end">
            <Button size="sm" type="submit" disabled={!commentText.trim()}>
              Comentar
            </Button>
          </div>
        </form>
      </Card>

      {/* Árvore de comentários — estilo Reddit: recuo + traço vertical por
          nível, sem card em volta de cada comentário. */}
      <section aria-label="Comentários">
        <div className="mb-[10px] flex flex-wrap items-center justify-between gap-[10px]">
          <h2 className="font-anek text-[22px] font-semibold text-foreground">
            Comentários <span className="font-roboto text-[14px] font-normal text-muted-foreground">({postComments.length})</span>
          </h2>
          {postComments.length > 1 && (
            <Segmented
              options={COMMENT_SORTS.map(({ value, label }) => ({ value, label }))}
              value={commentSort}
              onChange={setCommentSort}
            />
          )}
        </div>
        <div className="flex flex-col divide-y divide-border">
          {(byParent.root || []).map((c) => (
            <CommentNode
              key={c.id}
              comment={c}
              byParent={byParent}
              post={post}
              depth={0}
              replyingTo={replyingTo}
              onStartReply={startReply}
              onCancelReply={() => setReplyingTo(null)}
              onSubmitReply={submitReply}
              onReport={setReportTarget}
            />
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
