// Ilustrações de capa abstratas (geradas localmente, sem dependências
// externas) para dar mais presença visual ao feed. Usam os tokens do
// design system via currentColor/CSS vars, então se adaptam automaticamente
// ao modo claro/escuro.
const ARTS = {
  // Linha ascendente — usado em conteúdos de renda fixa / rendimentos
  chart: (
    <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <rect width="400" height="140" className="fill-muted" />
      <polyline points="0,110 60,95 110,100 160,70 210,78 260,45 310,55 400,20" className="stroke-primary" fill="none" strokeWidth="3" />
      <polygon points="0,110 60,95 110,100 160,70 210,78 260,45 310,55 400,20 400,140 0,140" className="fill-primary/10" />
      {[[60, 95], [160, 70], [260, 45], [400, 20]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="4" className="fill-primary" />
      ))}
    </svg>
  ),
  // Skyline de edifícios — usado em conteúdos de fundos imobiliários
  skyline: (
    <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <rect width="400" height="140" className="fill-muted" />
      {[
        [10, 60, 34, 80],
        [50, 40, 34, 100],
        [90, 70, 34, 70],
        [130, 20, 34, 120],
        [170, 50, 34, 90],
        [210, 35, 34, 105],
        [250, 65, 34, 75],
        [290, 15, 34, 125],
        [330, 55, 34, 85],
        [370, 30, 30, 110],
      ].map(([x, y, w, h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} className={i % 3 === 0 ? 'fill-primary/70' : 'fill-foreground/20'} />
      ))}
    </svg>
  ),
  // Ondas — remete à narrativa de Lore (barcos e ilhas)
  ocean: (
    <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <rect width="400" height="140" className="fill-muted" />
      <path d="M0,90 Q50,70 100,90 T200,90 T300,90 T400,90 V140 H0 Z" className="fill-primary/15" />
      <path d="M0,110 Q50,95 100,110 T200,110 T300,110 T400,110 V140 H0 Z" className="fill-primary/30" />
      <circle cx="330" cy="35" r="22" className="fill-primary/50" />
    </svg>
  ),
  // Diagrama de alocação — usado em conteúdos de planejamento/PIAR
  allocation: (
    <svg viewBox="0 0 400 140" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <rect width="400" height="140" className="fill-muted" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={20 + i * 64} y={140 - (30 + i * 15)} width="40" height={30 + i * 15} rx="4" className={i % 2 === 0 ? 'fill-primary/60' : 'fill-foreground/15'} />
      ))}
    </svg>
  ),
}

export default function CoverArt({ id, className = '' }) {
  const art = ARTS[id]
  if (!art) return null
  return (
    <div className={`overflow-hidden ${className}`} role="img" aria-label="Ilustração de capa">
      {art}
    </div>
  )
}
