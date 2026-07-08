import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import {
  AUDIT_LOG,
  COMMENT_REACTIONS,
  COMMENTS,
  CONSELHEIRO_BOOKINGS,
  CONVERSATIONS,
  CURRENT_USER_ID,
  FRIEND_REQUESTS,
  NICKNAME_QUEUE,
  NOTIFICATIONS,
  POSTS,
  REPORTS,
  USERS,
} from '../data/mock'

const AppContext = createContext(null)

let idSeq = 1000
const nextId = (prefix) => `${prefix}${idSeq++}`

export function AppProvider({ children }) {
  const [users, setUsers] = useState(USERS)
  const [posts, setPosts] = useState(POSTS)
  const [comments, setComments] = useState(COMMENTS)
  const [postVotes, setPostVotes] = useState({ p3: 1, p11: 1 }) // votos do usuário atual
  const [commentVotes, setCommentVotes] = useState({ c3: 1 })
  const [commentReactions, setCommentReactions] = useState(COMMENT_REACTIONS)
  const [myReactions, setMyReactions] = useState({}) // { [commentId]: Set(reactionKey) }
  const [notifications, setNotifications] = useState(NOTIFICATIONS)
  const [conversations, setConversations] = useState(CONVERSATIONS)
  const [friendRequests, setFriendRequests] = useState(FRIEND_REQUESTS)
  const [blockedUsers, setBlockedUsers] = useState([])
  const [dmSentToday, setDmSentToday] = useState(4)
  const [reports, setReports] = useState(REPORTS)
  const [nicknameQueue, setNicknameQueue] = useState(NICKNAME_QUEUE)
  const [auditLog, setAuditLog] = useState(AUDIT_LOG)
  const [sanctions, setSanctions] = useState([]) // sanções aplicadas na sessão
  const [toasts, setToasts] = useState([])
  const [settings, setSettings] = useState({
    nicknamePending: null,
    anonymousMode: false,
    piarOptIn: true,
    dnd: false,
    notifPrefs: {
      respostas: true,
      votos: true,
      seguidores: true,
      lives: true,
      moderacao: true,
      retrospectivas: true,
    },
    notifFrequency: 'imediata', // imediata | resumo-diario | resumo-semanal
  })
  const [liveDismissed, setLiveDismissed] = useState(false)
  // Modo de moderação inline: visualiza a comunidade normalmente, mas com
  // controles de moderação (editar/ocultar/mover/excluir) nos tópicos.
  const [moderationMode, setModerationMode] = useState(false)
  const [conselheiroBookings, setConselheiroBookings] = useState(CONSELHEIRO_BOOKINGS)

  const currentUser = users[CURRENT_USER_ID]

  const toast = useCallback((message, kind = 'success') => {
    const id = nextId('t')
    setToasts((t) => [...t, { id, message, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200)
  }, [])

  // ── Votos (estilo Reddit: 1 / -1 / 0) ────────────────────────────────
  const votePost = useCallback((postId, dir) => {
    setPostVotes((v) => {
      const prev = v[postId] || 0
      const next = prev === dir ? 0 : dir
      setPosts((ps) => ps.map((p) => (p.id === postId ? { ...p, upvotes: p.upvotes - prev + next } : p)))
      return { ...v, [postId]: next }
    })
  }, [])

  const voteComment = useCallback((commentId, dir) => {
    setCommentVotes((v) => {
      const prev = v[commentId] || 0
      const next = prev === dir ? 0 : dir
      setComments((cs) => cs.map((c) => (c.id === commentId ? { ...c, upvotes: c.upvotes - prev + next } : c)))
      return { ...v, [commentId]: next }
    })
  }, [])

  // Reações nomeadas de comentário — substituem o downvote (evita brigada
  // anônima) sem tirar o espaço para reações espontâneas.
  const toggleReaction = useCallback((commentId, key) => {
    setMyReactions((mine) => {
      const current = mine[commentId] || new Set()
      const active = current.has(key)
      const nextSet = new Set(current)
      active ? nextSet.delete(key) : nextSet.add(key)
      setCommentReactions((cr) => {
        const counts = { ...(cr[commentId] || {}) }
        counts[key] = Math.max(0, (counts[key] || 0) + (active ? -1 : 1))
        return { ...cr, [commentId]: counts }
      })
      return { ...mine, [commentId]: nextSet }
    })
  }, [])

  // ── Posts e comentários ──────────────────────────────────────────────
  const createPost = useCallback(
    ({ title, body, flair, area, tags }) => {
      const id = nextId('p')
      const post = {
        id,
        authorId: CURRENT_USER_ID,
        title,
        body,
        flair,
        area,
        tags,
        turma: currentUser.turma,
        createdAt: new Date().toISOString(),
        upvotes: 1,
        feed: 'foryou',
        solutionCommentId: null,
      }
      setPosts((ps) => [post, ...ps])
      setPostVotes((v) => ({ ...v, [id]: 1 }))
      toast('Tópico publicado! Você seguirá automaticamente todas as interações.')
      return id
    },
    [currentUser.turma, toast],
  )

  const addComment = useCallback(
    (postId, parentId, body) => {
      const id = nextId('c')
      setComments((cs) => [
        ...cs,
        {
          id,
          postId,
          parentId,
          authorId: CURRENT_USER_ID,
          body,
          upvotes: 1,
          createdAt: new Date().toISOString(),
          validated: false,
        },
      ])
      setCommentVotes((v) => ({ ...v, [id]: 1 }))
      return id
    },
    [],
  )

  const markSolution = useCallback(
    (postId, commentId) => {
      setPosts((ps) =>
        ps.map((p) => (p.id === postId ? { ...p, solutionCommentId: p.solutionCommentId === commentId ? null : commentId } : p)),
      )
      toast('Resposta destacada como solução do tópico.')
    },
    [toast],
  )

  const validateAnswer = useCallback(
    (commentId) => {
      setComments((cs) => cs.map((c) => (c.id === commentId ? { ...c, validated: !c.validated } : c)))
      toast('Chancela de Resposta Validada atualizada.')
    },
    [toast],
  )

  const reportContent = useCallback(
    ({ targetType, targetId, targetAuthorId, reason, excerpt }) => {
      setReports((rs) => [
        {
          id: nextId('r'),
          status: 'pendente',
          reporterId: CURRENT_USER_ID,
          targetType,
          targetId,
          targetAuthorId,
          reason,
          excerpt,
          sensitiveTerms: [],
          createdAt: new Date().toISOString(),
        },
        ...rs,
      ])
      toast('Denúncia enviada. Sua identidade fica protegida por anonimato público.')
    },
    [toast],
  )

  const toggleAuvpSempre = useCallback(() => {
    setUsers((us) => ({
      ...us,
      [CURRENT_USER_ID]: { ...us[CURRENT_USER_ID], auvpSempreAtivo: !us[CURRENT_USER_ID].auvpSempreAtivo },
    }))
  }, [])

  // ── Rede social ──────────────────────────────────────────────────────
  const toggleFollow = useCallback(
    (targetId) => {
      setUsers((us) => {
        const me = us[CURRENT_USER_ID]
        const target = us[targetId]
        const isFollowing = me.following.includes(targetId)
        return {
          ...us,
          [CURRENT_USER_ID]: {
            ...me,
            following: isFollowing ? me.following.filter((i) => i !== targetId) : [...me.following, targetId],
          },
          [targetId]: {
            ...target,
            followers: isFollowing ? target.followers.filter((i) => i !== CURRENT_USER_ID) : [...target.followers, CURRENT_USER_ID],
          },
        }
      })
    },
    [],
  )

  const acceptFriendRequest = useCallback(
    (reqId) => {
      const req = friendRequests.find((r) => r.id === reqId)
      if (!req) return
      setFriendRequests((rs) => rs.filter((r) => r.id !== reqId))
      setUsers((us) => {
        const me = us[CURRENT_USER_ID]
        if (me.following.includes(req.fromId)) return us
        return {
          ...us,
          [CURRENT_USER_ID]: { ...me, following: [...me.following, req.fromId] },
          [req.fromId]: { ...us[req.fromId], followers: [...us[req.fromId].followers, CURRENT_USER_ID] },
        }
      })
      toast(`Agora vocês são amigos! DMs de ${users[req.fromId].nickname} chegarão na caixa Principal.`)
    },
    [friendRequests, users, toast],
  )

  const declineFriendRequest = useCallback((reqId) => {
    setFriendRequests((rs) => rs.filter((r) => r.id !== reqId))
  }, [])

  // ── DMs ──────────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    (conversationId, text) => {
      if (settings.dnd) toast('Modo "não perturbe" ativo: você não receberá push desta conversa.', 'info')
      if (dmSentToday >= 30) {
        toast('Limite anti-spam diário de mensagens atingido.', 'error')
        return false
      }
      setDmSentToday((n) => n + 1)
      setConversations((cs) =>
        cs.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [...c.messages, { id: nextId('m'), fromId: CURRENT_USER_ID, text, createdAt: new Date().toISOString() }],
              }
            : c,
        ),
      )
      return true
    },
    [dmSentToday, settings.dnd, toast],
  )

  const moveToPrincipal = useCallback(
    (conversationId) => {
      setConversations((cs) => cs.map((c) => (c.id === conversationId ? { ...c, box: 'principal' } : c)))
      toast('Solicitação aceita — conversa movida para a caixa Principal.')
    },
    [toast],
  )

  const blockUser = useCallback(
    (userId) => {
      setBlockedUsers((b) => (b.includes(userId) ? b : [...b, userId]))
      setConversations((cs) => cs.filter((c) => c.withId !== userId))
      toast(`Usuário bloqueado. Ele não poderá mais enviar mensagens.`)
    },
    [toast],
  )

  // ── Notificações e configurações ─────────────────────────────────────
  const markNotificationsRead = useCallback(() => {
    setNotifications((ns) => ns.map((n) => ({ ...n, read: true })))
  }, [])

  const markNotificationRead = useCallback((id) => {
    setNotifications((ns) => ns.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const updateSettings = useCallback((patch) => {
    setSettings((s) => ({ ...s, ...patch }))
  }, [])

  const requestNicknameChange = useCallback(
    (newNickname) => {
      setSettings((s) => ({ ...s, nicknamePending: newNickname }))
      setNicknameQueue((q) => [
        {
          id: nextId('nk'),
          userId: CURRENT_USER_ID,
          legalName: currentUser.name,
          currentNickname: currentUser.nickname,
          suggestedNickname: newNickname,
          changesThisYear: 2,
          createdAt: new Date().toISOString(),
          status: 'pendente',
        },
        ...q,
      ])
      toast('Solicitação enviada para o histórico transparente avaliado pela moderação.')
    },
    [currentUser, toast],
  )

  // ── Moderação ────────────────────────────────────────────────────────
  const logAction = useCallback((action, targetUserId, targetRef, reason, undoable = true) => {
    setAuditLog((log) => [
      {
        id: nextId('a'),
        date: new Date().toISOString(),
        moderatorId: 'u4',
        action,
        targetUserId,
        targetRef,
        reason,
        undoable,
      },
      ...log,
    ])
  }, [])

  const resolveReport = useCallback(
    (reportId, action, sanction) => {
      const report = reports.find((r) => r.id === reportId)
      if (!report) return
      const statusMap = {
        manter: 'arquivada',
        ocultar: 'analise',
        remover: 'resolvida',
        escalar: 'analise',
      }
      const labelMap = {
        manter: 'Manter Conteúdo',
        ocultar: 'Ocultar Temporariamente',
        remover: 'Remover Permanentemente',
        escalar: 'Escalar para Admin',
      }
      setReports((rs) =>
        rs.map((r) =>
          r.id === reportId
            ? { ...r, status: statusMap[action], resolution: labelMap[action] + (sanction ? ` + ${sanction}` : '') }
            : r,
        ),
      )
      if (action === 'ocultar' || action === 'remover') {
        setPosts((ps) => ps.map((p) => (p.id === report.targetId ? { ...p, hidden: true } : p)))
      }
      if (action === 'manter') {
        setPosts((ps) => ps.map((p) => (p.id === report.targetId ? { ...p, hidden: false } : p)))
      }
      if (sanction) {
        setSanctions((ss) => [...ss, { userId: report.targetAuthorId, sanction, date: new Date().toISOString() }])
        setUsers((us) => ({
          ...us,
          [report.targetAuthorId]: { ...us[report.targetAuthorId], infractions: us[report.targetAuthorId].infractions + 1 },
        }))
      }
      logAction(labelMap[action], report.targetAuthorId, `${report.targetType === 'post' ? 'Post' : 'Comentário'} ${report.targetId}`, report.reason)
      toast(`Ação aplicada: ${labelMap[action]}${sanction ? ` + ${sanction}` : ''}.`)
    },
    [reports, logAction, toast],
  )

  const bulkArchiveReports = useCallback(
    (ids) => {
      setReports((rs) => rs.map((r) => (ids.includes(r.id) ? { ...r, status: 'arquivada', resolution: 'Arquivada em massa' } : r)))
      logAction('Arquivar em Massa', '-', `${ids.length} denúncias`, 'Ação em lote via desktop')
      toast(`${ids.length} denúncias arquivadas em massa.`)
    },
    [logAction, toast],
  )

  const reviewNickname = useCallback(
    (queueId, approve, reason) => {
      const item = nicknameQueue.find((q) => q.id === queueId)
      if (!item) return
      setNicknameQueue((q) => q.map((x) => (x.id === queueId ? { ...x, status: approve ? 'aprovado' : 'reprovado', reason } : x)))
      if (approve) {
        setUsers((us) => ({ ...us, [item.userId]: { ...us[item.userId], nickname: item.suggestedNickname } }))
        if (item.userId === CURRENT_USER_ID) setSettings((s) => ({ ...s, nicknamePending: null }))
      }
      logAction(approve ? 'Aprovar Apelido' : 'Reprovar Apelido', item.userId, item.suggestedNickname, reason || 'Dentro das diretrizes', !approve)
      toast(approve ? `Apelido "${item.suggestedNickname}" aprovado.` : `Apelido reprovado: ${reason}`)
    },
    [nicknameQueue, logAction, toast],
  )

  const applySanction = useCallback(
    (userId, sanction) => {
      setSanctions((ss) => [...ss, { userId, sanction, date: new Date().toISOString() }])
      setUsers((us) => ({ ...us, [userId]: { ...us[userId], infractions: us[userId].infractions + 1 } }))
      logAction(sanction, userId, 'Prontuário', 'Sanção disciplinar aplicada pelo moderador')
      toast(`Sanção aplicada: ${sanction}.`)
    },
    [logAction, toast],
  )

  const undoAction = useCallback(
    (actionId) => {
      setAuditLog((log) => log.map((a) => (a.id === actionId ? { ...a, undone: true } : a)))
      toast('Ação revertida pelo administrador sênior (registro mantido no log).')
    },
    [toast],
  )

  const notifyCounselor = useCallback(
    (postId, counselorId) => {
      logAction('Notificar Conselheiro', counselorId, `Post ${postId}`, 'Dúvida direcionada ao especialista', false)
      toast('Conselheiro especialista notificado sobre a dúvida.')
    },
    [logAction, toast],
  )

  const toggleModerationMode = useCallback(() => {
    setModerationMode((m) => !m)
  }, [])

  // ── Moderação inline de tópicos (visão da própria comunidade) ─────────
  const editPost = useCallback(
    (postId, patch) => {
      setPosts((ps) => ps.map((p) => (p.id === postId ? { ...p, ...patch } : p)))
      logAction('Editar Tópico', '-', `Post ${postId}`, 'Edição direta pela moderação', false)
      toast('Tópico editado pela moderação.')
    },
    [logAction, toast],
  )

  const togglePostHidden = useCallback(
    (postId) => {
      let nowHidden = false
      setPosts((ps) =>
        ps.map((p) => {
          if (p.id !== postId) return p
          nowHidden = !p.hidden
          return { ...p, hidden: nowHidden }
        }),
      )
      logAction(nowHidden ? 'Ocultar Tópico' : 'Reexibir Tópico', '-', `Post ${postId}`, 'Ação direta na visão da comunidade')
      toast(nowHidden ? 'Tópico ocultado da comunidade.' : 'Tópico reexibido na comunidade.')
    },
    [logAction, toast],
  )

  const movePost = useCallback(
    (postId, newArea) => {
      setPosts((ps) => ps.map((p) => (p.id === postId ? { ...p, area: newArea } : p)))
      logAction('Mover Tópico', '-', `Post ${postId} → ${newArea}`, 'Recategorização pela moderação', false)
      toast(`Tópico movido para a área "${newArea}".`)
    },
    [logAction, toast],
  )

  const deletePost = useCallback(
    (postId) => {
      // Soft delete: nunca remove fisicamente o registro (flag status:
      // deleted_by_moderator), mantendo o payload legível na Auditoria.
      setPosts((ps) => ps.map((p) => (p.id === postId ? { ...p, hidden: true, deleted: true } : p)))
      logAction('Remover Tópico', '-', `Post ${postId}`, 'Exclusão direta pela moderação (soft delete)', true)
      toast('Tópico removido. Registro mantido no Log de Auditoria (soft delete).')
    },
    [logAction, toast],
  )

  // ── Programa de Conselheiros (conversas 1:1 agendadas) ────────────────
  let bookingSeq = 100
  const bookMeeting = useCallback((conselheiroId, slot) => {
    const id = `bk${bookingSeq++}`
    const booking = {
      id,
      conselheiroId,
      status: 'agendado',
      at: slot.at,
      meetLink: `https://meet.google.com/mock-${id}`,
    }
    setConselheiroBookings((bs) => [booking, ...bs])
    toast(`Conversa agendada para ${slot.label}. Lembrete automático enviado e link do Google Meet gerado.`)
    return id
  }, [toast])

  const cancelBooking = useCallback(
    (bookingId) => {
      setConselheiroBookings((bs) => bs.map((b) => (b.id === bookingId ? { ...b, status: 'cancelado' } : b)))
      toast('Conversa cancelada.', 'info')
    },
    [toast],
  )

  const submitCsat = useCallback(
    (bookingId, rating, comment) => {
      setConselheiroBookings((bs) => bs.map((b) => (b.id === bookingId ? { ...b, csat: { rating, comment } } : b)))
      toast('Obrigado pela avaliação! Isso ajuda o conselheiro e a curadoria do programa.')
    },
    [toast],
  )

  const value = useMemo(
    () => ({
      users,
      currentUser,
      posts,
      comments,
      postVotes,
      commentVotes,
      commentReactions,
      myReactions,
      toggleReaction,
      notifications,
      conversations,
      friendRequests,
      blockedUsers,
      dmSentToday,
      reports,
      nicknameQueue,
      auditLog,
      sanctions,
      settings,
      toasts,
      liveDismissed,
      setLiveDismissed,
      moderationMode,
      toggleModerationMode,
      editPost,
      togglePostHidden,
      movePost,
      deletePost,
      conselheiroBookings,
      bookMeeting,
      cancelBooking,
      submitCsat,
      toggleAuvpSempre,
      toast,
      votePost,
      voteComment,
      createPost,
      addComment,
      markSolution,
      validateAnswer,
      reportContent,
      toggleFollow,
      acceptFriendRequest,
      declineFriendRequest,
      sendMessage,
      moveToPrincipal,
      blockUser,
      markNotificationsRead,
      markNotificationRead,
      updateSettings,
      requestNicknameChange,
      resolveReport,
      bulkArchiveReports,
      reviewNickname,
      applySanction,
      undoAction,
      notifyCounselor,
    }),
    [
      users, currentUser, posts, comments, postVotes, commentVotes, commentReactions, myReactions,
      toggleReaction, notifications, conversations,
      friendRequests, blockedUsers, dmSentToday, reports, nicknameQueue, auditLog, sanctions,
      settings, toasts, liveDismissed, moderationMode, toggleModerationMode, editPost,
      togglePostHidden, movePost, deletePost, conselheiroBookings, bookMeeting, cancelBooking,
      submitCsat, toggleAuvpSempre, toast, votePost, voteComment, createPost, addComment,
      markSolution, validateAnswer, reportContent, toggleFollow, acceptFriendRequest,
      declineFriendRequest, sendMessage, moveToPrincipal, blockUser, markNotificationsRead,
      markNotificationRead, updateSettings, requestNicknameChange, resolveReport,
      bulkArchiveReports, reviewNickname, applySanction, undoAction, notifyCounselor,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp deve ser usado dentro de AppProvider')
  return ctx
}
