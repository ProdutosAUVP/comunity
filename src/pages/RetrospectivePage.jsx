import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowFatUp, Boat, CaretLeft, CaretRight, ChatCircle, Medal, Sparkle, UsersThree, X } from '@phosphor-icons/react'
import { RETROSPECTIVE } from '../data/mock'
import { Button } from '../components/ui'

// Retrospectiva em tela cheia estilo "Stories"
export default function RetrospectivePage() {
  const navigate = useNavigate()
  const [slide, setSlide] = useState(0)
  const r = RETROSPECTIVE

  const slides = [
    {
      key: 'intro',
      render: () => (
        <>
          <Sparkle size={56} weight="fill" color="#EFBE4F" />
          <p className="mt-[30px] font-sora text-[12px] font-bold uppercase tracking-[0.15em] text-auvp-yellow">Sua retrospectiva</p>
          <h2 className="mt-[15px] font-anek text-[36px] md:text-[54px] font-semibold leading-[1.1] tracking-[-0.02em] text-white">
            {r.period}
          </h2>
          <p className="mt-[30px] font-roboto text-[18px] text-auvp-gray">Veja como foi a sua semana na Comunidade AUVP.</p>
        </>
      ),
    },
    {
      key: 'numeros',
      render: () => (
        <>
          <p className="font-sora text-[12px] font-bold uppercase tracking-[0.15em] text-auvp-yellow">Seus números</p>
          <div className="mt-[30px] grid w-full max-w-[440px] grid-cols-2 gap-[15px]">
            {[
              { icon: ChatCircle, label: 'posts lidos', value: r.stats.postsRead },
              { icon: ArrowFatUp, label: 'votos recebidos', value: r.stats.upvotesReceived },
              { icon: ChatCircle, label: 'comentários feitos', value: r.stats.commentsMade },
              { icon: UsersThree, label: 'novos seguidores', value: r.stats.newFollowers },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-[12px] bg-auvp-chumbo p-[20px] text-left">
                <Icon size={22} weight="bold" color="#EFBE4F" />
                <p className="mt-[10px] font-anek text-[36px] font-semibold leading-none text-white">{value}</p>
                <p className="mt-[4px] font-roboto text-[13px] text-auvp-gray">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-[30px] font-roboto text-[16px] text-auvp-gray">
            E você navegou <strong className="text-auvp-yellow">+{r.stats.xpGained} XP</strong> rumo à próxima ilha.
          </p>
        </>
      ),
    },
    {
      key: 'melhor-post',
      render: () => (
        <>
          <Medal size={48} weight="fill" color="#EFBE4F" />
          <p className="mt-[30px] font-sora text-[12px] font-bold uppercase tracking-[0.15em] text-auvp-yellow">Melhor conteúdo da semana</p>
          <h2 className="mt-[15px] max-w-[560px] font-anek text-[28px] md:text-[41px] font-semibold leading-[1.15] text-white">
            “{r.bestPost.title}”
          </h2>
          <p className="mt-[15px] font-roboto text-[16px] text-auvp-gray">
            Seu case recebeu <strong className="text-auvp-yellow">{r.bestPost.upvotes} votos</strong> da comunidade.
          </p>
        </>
      ),
    },
    {
      key: 'melhor-resposta',
      render: () => (
        <>
          <p className="font-sora text-[12px] font-bold uppercase tracking-[0.15em] text-auvp-yellow">Melhor resposta</p>
          <h2 className="mt-[15px] max-w-[560px] font-anek text-[28px] md:text-[41px] font-semibold leading-[1.15] text-white">
            {r.bestAnswer.text}
          </h2>
          <p className="mt-[15px] font-roboto text-[16px] text-auvp-gray">
            por <strong className="text-auvp-yellow">{r.bestAnswer.author}</strong> · {r.bestAnswer.upvotes} votos
          </p>
          <div className="mt-[30px] rounded-[12px] bg-auvp-chumbo p-[20px]">
            <p className="font-sora text-[11px] font-bold uppercase tracking-[0.15em] text-auvp-yellow">Aluno em destaque</p>
            <p className="mt-[8px] font-anek text-[22px] font-semibold text-white">{r.featuredStudent.nickname}</p>
            <p className="mt-[4px] font-roboto text-[14px] text-auvp-gray">{r.featuredStudent.reason}</p>
          </div>
        </>
      ),
    },
    {
      key: 'fim',
      render: () => (
        <>
          <Boat size={56} weight="fill" color="#EFBE4F" />
          <p className="mt-[30px] font-sora text-[12px] font-bold uppercase tracking-[0.15em] text-auvp-yellow">Novidades do ecossistema</p>
          <h2 className="mt-[15px] max-w-[560px] font-anek text-[28px] md:text-[41px] font-semibold leading-[1.15] text-white">
            {r.ecosystemNews}
          </h2>
          <div className="mt-[45px]">
            <Button variant="yellow" onClick={() => navigate('/')}>
              Voltar à comunidade
            </Button>
          </div>
        </>
      ),
    },
  ]

  useEffect(() => {
    if (slide >= slides.length - 1) return
    const t = setTimeout(() => setSlide((s) => s + 1), 6000)
    return () => clearTimeout(t)
  }, [slide, slides.length])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Barras de progresso */}
      <div className="flex gap-[6px] p-[15px]">
        {slides.map((s, i) => (
          <div key={s.key} className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/20">
            {i < slide && <div className="h-full w-full bg-auvp-yellow" />}
            {i === slide && <div key={slide} className="h-full bg-auvp-yellow animate-story-bar" />}
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/')}
        aria-label="Fechar retrospectiva"
        className="absolute right-[15px] top-[36px] z-10 rounded-[5px] p-[8px] text-white transition-all duration-240 hover:bg-white/10"
      >
        <X size={22} weight="bold" />
      </button>

      <div className="relative flex flex-1 items-center justify-center px-[30px] pb-[60px] text-center">
        {/* Áreas de toque para navegar */}
        <button aria-label="Slide anterior" onClick={() => setSlide((s) => Math.max(0, s - 1))} className="absolute inset-y-0 left-0 w-1/4" />
        <button aria-label="Próximo slide" onClick={() => setSlide((s) => Math.min(slides.length - 1, s + 1))} className="absolute inset-y-0 right-0 w-1/4" />
        <div className="flex flex-col items-center">{slides[slide].render()}</div>
      </div>

      <div className="flex items-center justify-center gap-[30px] pb-[30px]">
        <button
          onClick={() => setSlide((s) => Math.max(0, s - 1))}
          disabled={slide === 0}
          aria-label="Anterior"
          className="rounded-full border border-white/30 p-[10px] text-white transition-all duration-240 hover:bg-white/10 disabled:opacity-30"
        >
          <CaretLeft size={18} weight="bold" />
        </button>
        <span className="font-sora text-[12px] font-bold text-auvp-gray">
          {slide + 1} / {slides.length}
        </span>
        <button
          onClick={() => setSlide((s) => Math.min(slides.length - 1, s + 1))}
          disabled={slide === slides.length - 1}
          aria-label="Próximo"
          className="rounded-full border border-white/30 p-[10px] text-white transition-all duration-240 hover:bg-white/10 disabled:opacity-30"
        >
          <CaretRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  )
}
