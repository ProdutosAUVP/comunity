import { useState } from 'react'
import { Moon, Sun } from '@phosphor-icons/react'
import { useApp } from '../context/AppContext'
import { useTheme } from '../context/ThemeContext'
import { Button, Card, Eyebrow } from '../components/ui'
import { NICKNAME_HISTORY, formatDateTime } from '../data/mock'

function Toggle({ checked, onChange, label, description }) {
  return (
    <label className="flex cursor-pointer items-center gap-[15px] py-[12px]">
      <span className="min-w-0 flex-1">
        <span className="block font-roboto text-[15px] font-medium text-foreground">{label}</span>
        {description && <span className="block font-roboto text-[13px] text-muted-foreground">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={onChange}
        className={`relative h-[26px] w-[46px] shrink-0 rounded-full transition-all duration-240 ${checked ? 'bg-primary' : 'bg-muted'}`}
      >
        <span
          className={`absolute top-[3px] h-[20px] w-[20px] rounded-full bg-background transition-all duration-240 ${checked ? 'left-[23px]' : 'left-[3px]'}`}
        />
      </button>
    </label>
  )
}

const NOTIF_CATEGORIES = [
  { key: 'respostas', label: 'Respostas e comentários', desc: 'Interações nos tópicos que você criou ou segue' },
  { key: 'votos', label: 'Votos', desc: 'Quando suas publicações recebem votos' },
  { key: 'seguidores', label: 'Novos seguidores', desc: 'Quando alguém começa a te seguir' },
  { key: 'lives', label: 'Lives e eventos', desc: 'Avisos de lives elegíveis para a sua turma' },
  { key: 'moderacao', label: 'Moderação', desc: 'Avisos oficiais e resultados de solicitações' },
  { key: 'retrospectivas', label: 'Retrospectivas', desc: 'Resumos semanais e mensais dos destaques' },
]

export default function SettingsPage() {
  const { currentUser, settings, updateSettings, requestNicknameChange, toggleAuvpSempre } = useApp()
  const { theme, setTheme } = useTheme()
  const [nickname, setNickname] = useState('')
  const history = NICKNAME_HISTORY[currentUser.id] || []

  const submitNickname = (e) => {
    e.preventDefault()
    const value = nickname.trim()
    if (!value) return
    requestNicknameChange(value)
    setNickname('')
  }

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-[15px]">
      <div>
        <Eyebrow>Configurações da Comunidade</Eyebrow>
        <h1 className="mt-[4px] font-anek text-[30px] md:text-[41px] font-semibold leading-[1.15] text-foreground">Preferências</h1>
      </div>

      {/* Aparência: modo claro / escuro */}
      <Card>
        <Eyebrow>Aparência</Eyebrow>
        <p className="mt-[8px] font-roboto text-[14px] text-muted-foreground">Escolha entre modo claro ou escuro para a Comunidade.</p>
        <div className="mt-[15px] grid grid-cols-2 gap-[10px]">
          <button
            onClick={() => setTheme('light')}
            className={`flex flex-col items-center gap-[8px] rounded-[12px] border p-[15px] transition-all duration-240 ${
              theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <Sun size={22} weight="bold" className={theme === 'light' ? 'text-primary' : 'text-muted-foreground'} />
            <span className="font-roboto text-[14px] font-medium text-foreground">Claro</span>
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`flex flex-col items-center gap-[8px] rounded-[12px] border p-[15px] transition-all duration-240 ${
              theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
            }`}
          >
            <Moon size={22} weight="bold" className={theme === 'dark' ? 'text-primary' : 'text-muted-foreground'} />
            <span className="font-roboto text-[14px] font-medium text-foreground">Escuro</span>
          </button>
        </div>
      </Card>

      {/* Apelido público com histórico moderável */}
      <Card>
        <Eyebrow>Apelido público</Eyebrow>
        <p className="mt-[8px] font-roboto text-[14px] text-muted-foreground">
          Nas interações em postagens aparece apenas o seu apelido. Alterações passam por aprovação da moderação, com filtro
          de obscenidade, política e religião, e ficam registradas em histórico transparente.
        </p>
        <form onSubmit={submitNickname} className="mt-[15px] flex flex-wrap items-center gap-[10px]">
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={currentUser.nickname}
            aria-label="Novo apelido"
            maxLength={30}
            className="min-w-0 flex-1 rounded-[5px] border border-border bg-background px-[15px] py-[12px] font-roboto text-[15px] text-foreground outline-none transition-all duration-240 focus:border-primary"
          />
          <Button size="sm" type="submit" disabled={!nickname.trim() || !!settings.nicknamePending}>
            Solicitar alteração
          </Button>
        </form>
        {settings.nicknamePending && (
          <p className="mt-[10px] rounded-[5px] bg-muted p-[12px] font-roboto text-[14px] text-foreground">
            Solicitação <strong>"{settings.nicknamePending}"</strong> aguardando aprovação da moderação.
          </p>
        )}
        {history.length > 0 && (
          <div className="mt-[15px] border-t border-border pt-[15px]">
            <p className="font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Histórico de alterações</p>
            <ul className="mt-[10px] flex flex-col gap-[8px]">
              {history.map((h, i) => (
                <li key={i} className="font-roboto text-[13px] text-muted-foreground">
                  <strong className="text-foreground">{h.from}</strong> → <strong className="text-foreground">{h.to}</strong> ·{' '}
                  {formatDateTime(h.date)} · {h.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* Notificações granulares */}
      <Card>
        <Eyebrow>Notificações granulares</Eyebrow>
        <div className="mt-[10px] divide-y divide-border">
          <Toggle
            checked={settings.dnd}
            onChange={() => updateSettings({ dnd: !settings.dnd })}
            label='Modo "não perturbe"'
            description="Silencia todos os alertas push, mantendo o histórico na central"
          />
          {NOTIF_CATEGORIES.map((c) => (
            <Toggle
              key={c.key}
              checked={settings.notifPrefs[c.key]}
              onChange={() => updateSettings({ notifPrefs: { ...settings.notifPrefs, [c.key]: !settings.notifPrefs[c.key] } })}
              label={c.label}
              description={c.desc}
            />
          ))}
        </div>
        <div className="mt-[15px] border-t border-border pt-[15px]">
          <p className="mb-[8px] font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">Frequência</p>
          <div className="flex flex-wrap gap-[8px]">
            {[
              { value: 'imediata', label: 'Imediata' },
              { value: 'resumo-diario', label: 'Resumo diário' },
              { value: 'resumo-semanal', label: 'Resumo semanal' },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => updateSettings({ notifFrequency: f.value })}
                className={`rounded-[4px] border px-[12px] py-[6px] font-roboto text-[13px] transition-all duration-240 ${
                  settings.notifFrequency === f.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* AUVP Sempre — elegibilidade do Programa de Conselheiros */}
      <Card>
        <Eyebrow>AUVP Sempre</Eyebrow>
        <div className="mt-[10px] divide-y divide-border">
          <Toggle
            checked={!!currentUser.auvpSempreAtivo}
            onChange={toggleAuvpSempre}
            label="AUVP Sempre ativo (simulação)"
            description="Controla a elegibilidade ao Programa de Conselheiros — alunos nas primeiras 8 semanas de Escola AUVP também têm acesso"
          />
        </div>
      </Card>

      {/* Privacidade */}
      <Card>
        <Eyebrow>Privacidade social</Eyebrow>
        <div className="mt-[10px] divide-y divide-border">
          <Toggle
            checked={settings.anonymousMode}
            onChange={() => updateSettings({ anonymousMode: !settings.anonymousMode })}
            label="Modo Anônimo"
            description="Oculta suas visitas a perfis — em contrapartida, você deixa de ver quem visitou o seu (reciprocidade)"
          />
          <Toggle
            checked={settings.piarOptIn}
            onChange={() => updateSettings({ piarOptIn: !settings.piarOptIn })}
            label="Exibir alocação PIAR para amigos"
            description="Visível apenas para amigos que também compartilham a própria alocação"
          />
        </div>
      </Card>
    </div>
  )
}
