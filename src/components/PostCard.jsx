import { useNavigate } from 'react-router-dom'
import { ArrowFatDown, ArrowFatUp, ChatCircle, CheckCircle, EyeSlash } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { timeAgo } from '../data/mock'
import { Avatar, Card, FlairBadge, RoleLabel, TagPill, TurmaTag } from './ui'

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

export default function PostCard({ post, compact = false }) {
  const { users, comments, postVotes, votePost } = useApp()
  const navigate = useNavigate()
  const author = users[post.authorId]
  const commentCount = comments.filter((c) => c.postId === post.id).length

  if (post.hidden) {
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
