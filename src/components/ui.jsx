import { useEffect } from 'react'
import { SealCheck, ShieldStar, X } from '@phosphor-icons/react'
import { FLAIRS } from '../data/mock'
import { useApp } from '../context/AppContext'

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
    primary: 'bg-auvp-green text-white border-auvp-green hover:bg-transparent hover:text-auvp-green',
    outline: 'bg-transparent text-auvp-green border-auvp-green hover:bg-auvp-green hover:text-white',
    'outline-dark': 'bg-transparent text-white border-white hover:bg-white hover:text-auvp-green',
    yellow: 'bg-auvp-yellow text-auvp-chumbo border-auvp-yellow hover:bg-transparent hover:text-auvp-yellow',
    ghost: 'bg-transparent text-auvp-green border-transparent hover:border-auvp-green',
    'ghost-dark': 'bg-transparent text-auvp-gray border-transparent hover:border-white hover:text-white',
    danger: 'bg-[#B42318] text-white border-[#B42318] hover:bg-transparent hover:text-[#B42318]',
    'danger-outline': 'bg-transparent text-[#B42318] border-[#B42318] hover:bg-[#B42318] hover:text-white',
  }
  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

// ── Card padrão (radius 12px) ──────────────────────────────────────────────
export function Card({ className = '', hover = false, dark = false, children, ...props }) {
  return (
    <div
      className={`rounded-[12px] p-[20px] md:p-[30px] ${
        dark ? 'bg-auvp-chumbo' : 'bg-white border border-black/[0.06]'
      } ${hover ? 'transition-all duration-240 hover:shadow-auvp-card hover:-translate-y-[2px]' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function Eyebrow({ children, dark = false, className = '' }) {
  return (
    <span
      className={`font-sora text-[12px] font-bold uppercase tracking-[0.15em] ${dark ? 'text-auvp-yellow' : 'text-auvp-green'} ${className}`}
    >
      {children}
    </span>
  )
}

// ── Flair de post (marcador visual institucional) ──────────────────────────
export function FlairBadge({ flair, className = '' }) {
  const style = FLAIRS[flair] || FLAIRS['Dúvida']
  return (
    <span
      className={`inline-flex items-center rounded-[4px] px-[10px] py-[3px] font-sora text-[11px] font-bold uppercase tracking-[0.05em] ${className}`}
      style={{
        backgroundColor: style.bg,
        color: style.text,
        border: style.border ? '1px solid rgba(0,0,0,0.15)' : '1px solid transparent',
      }}
    >
      {flair}
    </span>
  )
}

export function TagPill({ tag, active = false, onClick, dark = false }) {
  const cls = active
    ? 'bg-auvp-green text-white border-auvp-green'
    : dark
      ? 'bg-transparent text-auvp-gray border-white/30 hover:border-white'
      : 'bg-white text-auvp-gray-mid border-black/10 hover:border-auvp-green hover:text-auvp-green'
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

export function TurmaTag({ turma, dark = false }) {
  return (
    <span
      className={`inline-flex items-center rounded-[4px] px-[8px] py-[2px] font-sora text-[10px] font-bold uppercase tracking-[0.05em] ${
        dark ? 'bg-auvp-yellow text-auvp-chumbo' : 'bg-auvp-green text-white'
      }`}
    >
      {turma}
    </span>
  )
}

// ── Avatar com hierarquia visual (conselheiro em destaque / moderador) ─────
export function Avatar({ user, size = 44, showRole = true }) {
  const isCounselor = user.role === 'conselheiro'
  const isMod = user.role === 'moderador' || user.role === 'oficial'
  const ring = isCounselor
    ? 'ring-2 ring-auvp-yellow ring-offset-2'
    : isMod
      ? 'ring-2 ring-auvp-green ring-offset-2'
      : ''
  const fontSize = Math.max(11, Math.round(size * 0.34))
  return (
    <span className="relative inline-flex shrink-0">
      <span
        className={`inline-flex items-center justify-center rounded-full font-anek font-semibold text-white ${ring}`}
        style={{ width: size, height: size, backgroundColor: isMod ? '#011F0E' : '#023619', fontSize }}
        aria-label={`Avatar de ${user.nickname}`}
      >
        {user.initials}
      </span>
      {showRole && isCounselor && (
        <SealCheck
          size={Math.max(14, size * 0.4)}
          weight="fill"
          color="#EFBE4F"
          className="absolute -bottom-1 -right-1 bg-white rounded-full"
          aria-label="Conselheiro AUVP"
        />
      )}
      {showRole && isMod && (
        <ShieldStar
          size={Math.max(14, size * 0.4)}
          weight="fill"
          color="#023619"
          className="absolute -bottom-1 -right-1 bg-white rounded-full"
          aria-label="Moderação oficial"
        />
      )}
    </span>
  )
}

export function RoleLabel({ user, dark = false }) {
  if (user.role === 'conselheiro')
    return (
      <span className={`font-sora text-[10px] font-bold uppercase tracking-[0.05em] rounded-[4px] px-[6px] py-[1px] ${dark ? 'bg-auvp-yellow text-auvp-chumbo' : 'bg-auvp-yellow text-auvp-chumbo'}`}>
        Conselheiro{user.specialty ? ` · ${user.specialty}` : ''}
      </span>
    )
  if (user.role === 'moderador')
    return (
      <span className="font-sora text-[10px] font-bold uppercase tracking-[0.05em] rounded-[4px] px-[6px] py-[1px] bg-auvp-green text-white">
        Moderação
      </span>
    )
  if (user.role === 'oficial')
    return (
      <span className="font-sora text-[10px] font-bold uppercase tracking-[0.05em] rounded-[4px] px-[6px] py-[1px] bg-auvp-green text-white">
        Oficial
      </span>
    )
  return null
}

// ── Segmented control (alternador de feeds) ────────────────────────────────
export function Segmented({ options, value, onChange, dark = false }) {
  return (
    <div
      role="tablist"
      className={`inline-flex rounded-[5px] border overflow-hidden ${dark ? 'border-white/20 bg-auvp-chumbo' : 'border-black/10 bg-white'}`}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={`px-[15px] py-[10px] font-sora text-[12px] font-bold uppercase tracking-[0.05em] transition-all duration-240 ${
              active
                ? 'bg-auvp-green text-white'
                : dark
                  ? 'text-auvp-gray hover:text-white'
                  : 'text-auvp-gray-mid hover:text-auvp-green'
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
export function Modal({ open, onClose, title, children, dark = false, wide = false }) {
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
        className={`relative w-full ${wide ? 'max-w-[760px]' : 'max-w-[520px]'} max-h-[88vh] overflow-y-auto scrollbar-thin rounded-[12px] p-[20px] md:p-[30px] ${
          dark ? 'bg-auvp-chumbo text-auvp-gray' : 'bg-white'
        }`}
      >
        <div className="flex items-start justify-between gap-[15px] mb-[15px]">
          <h3 className={`font-anek text-[22px] md:text-[28px] font-semibold leading-tight ${dark ? 'text-white' : 'text-auvp-green'}`}>
            {title}
          </h3>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className={`rounded-[5px] p-[6px] transition-all duration-240 ${dark ? 'text-auvp-gray hover:bg-white/10' : 'text-auvp-gray-mid hover:bg-auvp-gray'}`}
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
    <div className="fixed bottom-[15px] left-1/2 -translate-x-1/2 z-[60] flex flex-col gap-[8px] w-[calc(100%-30px)] max-w-[440px]" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-toast-in rounded-[5px] px-[15px] py-[12px] font-roboto text-[14px] shadow-auvp-card border ${
            t.kind === 'error'
              ? 'bg-[#B42318] text-white border-[#B42318]'
              : t.kind === 'info'
                ? 'bg-auvp-chumbo text-auvp-gray border-auvp-chumbo'
                : 'bg-auvp-green text-white border-auvp-green'
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ title, subtitle, dark = false }) {
  return (
    <div className={`rounded-[12px] border border-dashed px-[20px] py-[45px] text-center ${dark ? 'border-white/20' : 'border-black/15'}`}>
      <p className={`font-anek text-[22px] font-semibold ${dark ? 'text-white' : 'text-auvp-green'}`}>{title}</p>
      {subtitle && <p className={`mt-[8px] font-roboto text-[15px] ${dark ? 'text-auvp-gray' : 'text-auvp-gray-mid'}`}>{subtitle}</p>}
    </div>
  )
}

export function ProgressBar({ value, dark = false }) {
  return (
    <div
      className={`h-[8px] w-full rounded-[4px] overflow-hidden ${dark ? 'bg-white/15' : 'bg-black/10'}`}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className={`h-full ${dark ? 'bg-auvp-yellow' : 'bg-auvp-green'}`} style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  )
}

export function Stat({ label, value, urgent = false, dark = false, onClick }) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      onClick={onClick}
      className={`rounded-[12px] p-[20px] text-left w-full transition-all duration-240 ${
        dark ? 'bg-auvp-chumbo border border-white/10' : 'bg-white border border-black/[0.06]'
      } ${onClick ? 'hover:shadow-auvp-card hover:-translate-y-[2px] cursor-pointer' : ''}`}
    >
      <p className={`font-anek text-[34px] font-semibold leading-none ${urgent ? 'text-[#E5484D]' : dark ? 'text-white' : 'text-auvp-green'}`}>
        {value}
      </p>
      <p className={`mt-[8px] font-roboto text-[13px] ${dark ? 'text-auvp-gray' : 'text-auvp-gray-mid'}`}>{label}</p>
    </Comp>
  )
}
