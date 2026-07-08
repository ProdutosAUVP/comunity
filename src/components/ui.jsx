import { useEffect } from 'react'
import { SealCheck, ShieldStar, X } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'

// Mapeamento de flair -> token semântico (usado só como pequeno indicador
// de cor; o corpo do badge permanece neutro — cor de forma pontual).
export const FLAIR_TOKENS = {
  Dúvida: 'info',
  Case: 'primary',
  Meme: 'neutral',
  Live: 'destructive',
  Aula: 'success',
  Conquista: 'warning',
}

// ── Botões do Design System (radius 5px, Sora 700 uppercase) ───────────────
export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  const base =
    'inline-flex items-center justify-center gap-[8px] font-sora font-bold uppercase tracking-[0.05em] rounded-[5px] border transition-all duration-240 ease-in-out active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none'
  const sizes = {
    md: 'text-[14px] py-[18px] px-[32px]',
    sm: 'text-[12px] py-[10px] px-[20px]',
    xs: 'text-[11px] py-[7px] px-[15px]',
  }
  const variants = {
    primary: 'bg-primary text-primary-foreground border-primary hover:bg-transparent hover:text-primary',
    outline: 'bg-transparent text-foreground border-border hover:border-primary hover:text-primary',
    secondary:
      'bg-secondary text-secondary-foreground border-secondary hover:bg-transparent hover:text-secondary dark:bg-transparent dark:text-foreground dark:border-foreground dark:hover:bg-foreground dark:hover:text-background',
    ghost: 'bg-transparent text-muted-foreground border-transparent hover:text-foreground hover:border-border',
    danger: 'bg-destructive text-destructive-foreground border-destructive hover:bg-transparent hover:text-destructive',
    'danger-outline': 'bg-transparent text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground',
    accent: 'bg-accent text-accent-foreground border-accent hover:bg-transparent hover:text-accent',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// ── Card padrão (radius 12px) ──────────────────────────────────────────────
export function Card({ className = '', hover = false, children, ...props }) {
  return (
    <div
      className={`rounded-[12px] border border-border bg-card text-card-foreground p-[20px] md:p-[30px] ${
        hover ? 'transition-all duration-240 hover:shadow-auvp-card hover:-translate-y-[2px]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function Eyebrow({ children, className = '' }) {
  return (
    <span className={`font-sora text-[12px] font-bold uppercase tracking-[0.15em] text-primary ${className}`}>
      {children}
    </span>
  )
}

// ── Flair de post: badge neutro + pequeno indicador de cor pontual ─────────
export function FlairBadge({ flair, className = '' }) {
  const token = FLAIR_TOKENS[flair] || 'primary'
  const dotCls =
    token === 'neutral'
      ? 'bg-muted-foreground'
      : token === 'destructive'
        ? 'bg-destructive'
        : token === 'success'
          ? 'bg-success'
          : token === 'warning'
            ? 'bg-warning'
            : token === 'info'
              ? 'bg-info'
              : 'bg-primary'
  return (
    <span
      className={`inline-flex items-center gap-[6px] rounded-[4px] border border-border bg-muted px-[10px] py-[3px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] text-foreground ${className}`}
    >
      <span className={`h-[6px] w-[6px] rounded-full ${dotCls}`} aria-hidden />
      {flair}
    </span>
  )
}

export function TagPill({ tag, active = false, onClick }) {
  const cls = active
    ? 'bg-primary text-primary-foreground border-primary'
    : 'bg-transparent text-muted-foreground border-border hover:border-primary hover:text-primary'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={`rounded-[4px] border px-[10px] py-[3px] font-roboto text-[13px] transition-all duration-240 ${cls} ${!onClick ? 'cursor-default' : ''}`}
    >
      #{tag}
    </button>
  )
}

export function TurmaTag({ turma }) {
  return (
    <span className="inline-flex items-center rounded-[4px] border border-border bg-muted px-[8px] py-[2px] font-sora text-[10px] font-bold uppercase tracking-[0.05em] text-muted-foreground">
      {turma}
    </span>
  )
}

// ── Avatar com hierarquia visual (conselheiro em destaque / moderador) ─────
export function Avatar({ user, size = 44, showRole = true }) {
  const isCounselor = user.role === 'conselheiro'
  const isMod = user.role === 'moderador' || user.role === 'oficial'
  const ring = isCounselor ? 'ring-2 ring-accent ring-offset-2 ring-offset-background' : isMod ? 'ring-2 ring-foreground/30 ring-offset-2 ring-offset-background' : ''
  const fontSize = Math.max(11, Math.round(size * 0.34))
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={`inline-flex items-center justify-center rounded-full bg-muted font-anek font-semibold text-foreground ${ring}`}
        style={{ width: size, height: size, fontSize }}
        aria-label={`Avatar de ${user.nickname}`}
      >
        {user.initials}
      </span>
      {showRole && isCounselor && (
        <SealCheck
          size={Math.max(14, size * 0.4)}
          weight="fill"
          className="absolute -bottom-1 -right-1 rounded-full bg-background text-accent"
          aria-label="Conselheiro AUVP"
        />
      )}
      {showRole && isMod && (
        <ShieldStar
          size={Math.max(14, size * 0.4)}
          weight="fill"
          className="absolute -bottom-1 -right-1 rounded-full bg-background text-foreground"
          aria-label="Moderação oficial"
        />
      )}
    </span>
  )
}

export function RoleLabel({ user }) {
  if (user.role === 'conselheiro')
    return (
      <span className="font-sora text-[10px] font-bold uppercase tracking-[0.05em] rounded-[4px] px-[6px] py-[1px] bg-accent/10 text-accent">
        Conselheiro{user.specialty ? ` · ${user.specialty}` : ''}
      </span>
    )
  if (user.role === 'moderador')
    return (
      <span className="font-sora text-[10px] font-bold uppercase tracking-[0.05em] rounded-[4px] px-[6px] py-[1px] bg-primary/10 text-primary">
        Moderação
      </span>
    )
  if (user.role === 'oficial')
    return (
      <span className="font-sora text-[10px] font-bold uppercase tracking-[0.05em] rounded-[4px] px-[6px] py-[1px] bg-primary/10 text-primary">
        Oficial
      </span>
    )
  return null
}

// ── Segmented control (alternador de feeds) ────────────────────────────────
export function Segmented({ options, value, onChange }) {
  return (
    <div role="tablist" className="inline-flex rounded-[5px] border border-border bg-muted/50 overflow-hidden">
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`px-[15px] py-[10px] font-sora text-[12px] font-bold uppercase tracking-[0.05em] transition-all duration-240 ${
              active ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {opt.label}
            {opt.count != null && <span className="ml-[8px] opacity-70">{opt.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

// ── Modal ──────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, wide = false }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-[15px]" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div
        className={`relative w-full ${wide ? 'max-w-[760px]' : 'max-w-[520px]'} max-h-[88vh] overflow-y-auto scrollbar-thin rounded-[12px] border border-border bg-card text-card-foreground p-[20px] md:p-[30px]`}
      >
        <div className="flex items-start justify-between gap-[15px] mb-[15px]">
          <h3 className="font-anek text-[22px] md:text-[28px] font-semibold leading-tight text-foreground">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="rounded-[5px] p-[6px] text-muted-foreground transition-all duration-240 hover:bg-muted hover:text-foreground"
          >
            <X size={20} weight="bold" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ── Toasts ─────────────────────────────────────────────────────────────────
export function ToastStack() {
  const { toasts } = useApp()
  if (!toasts.length) return null
  return (
    <div className="fixed bottom-[65px] left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-[8px] w-[calc(100%-30px)] max-w-[440px]" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-toast-in rounded-[5px] px-[15px] py-[12px] font-roboto text-[14px] shadow-auvp-card border ${
            t.kind === 'error'
              ? 'bg-destructive text-destructive-foreground border-destructive'
              : t.kind === 'info'
                ? 'bg-foreground text-background border-foreground'
                : 'bg-primary text-primary-foreground border-primary'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ title, subtitle }) {
  return (
    <div className="rounded-[12px] border border-dashed border-border px-[20px] py-[45px] text-center">
      <p className="font-anek text-[22px] font-semibold text-foreground">{title}</p>
      {subtitle && <p className="mt-[8px] font-roboto text-[15px] text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

export function ProgressBar({ value }) {
  return (
    <div className="h-[8px] w-full rounded-[4px] overflow-hidden bg-muted" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
      <div className="h-full bg-primary" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}

export function Stat({ label, value, urgent = false, onClick }) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      onClick={onClick}
      className={`rounded-[12px] border border-border bg-card p-[20px] text-left w-full transition-all duration-240 ${
        onClick ? 'hover:shadow-auvp-card hover:-translate-y-[2px] cursor-pointer' : ''
      }`}
    >
      <p className={`font-anek text-[34px] font-semibold leading-none ${urgent ? 'text-destructive' : 'text-foreground'}`}>{value}</p>
      <p className="mt-[8px] font-roboto text-[13px] text-muted-foreground">{label}</p>
    </Comp>
  )
}
