// Dados mockados da Comunidade AUVP.
// Todas as datas são relativas ao momento de carregamento para que
// os rótulos de tempo ("há 2h") permaneçam plausíveis em qualquer demo.

const hoursAgo = (n) => new Date(Date.now() - n * 3600e3).toISOString()
const daysAgo = (n) => hoursAgo(n * 24)

// ── Lore: progressão visual por barcos e ilhas ─────────────────────────────
export const LORE_LEVELS = [
  { level: 1, boat: 'Jangada', island: 'Ilha da Poupança', minXp: 0 },
  { level: 2, boat: 'Barco a Vela', island: 'Ilha da Reserva de Emergência', minXp: 200 },
  { level: 3, boat: 'Escuna', island: 'Ilha da Renda Fixa', minXp: 600 },
  { level: 4, boat: 'Caravela', island: 'Ilha dos Fundos Imobiliários', minXp: 1400 },
  { level: 5, boat: 'Galeão', island: 'Ilha das Ações', minXp: 3000 },
  { level: 6, boat: 'Navio-Almirante', island: 'Arquipélago Internacional', minXp: 6000 },
]

export function loreForXp(xp) {
  let current = LORE_LEVELS[0]
  for (const l of LORE_LEVELS) if (xp >= l.minXp) current = l
  const next = LORE_LEVELS.find((l) => l.minXp > xp)
  const progress = next
    ? Math.round(((xp - current.minXp) / (next.minXp - current.minXp)) * 100)
    : 100
  return { ...current, next, progress }
}

// ── Flairs institucionais ──────────────────────────────────────────────────
export const FLAIRS = {
  Dúvida: { bg: '#023619', text: '#FFFFFF' },
  Case: { bg: '#1B1B1B', text: '#FFFFFF' },
  Meme: { bg: '#F2F2F2', text: '#1B1B1B', border: true },
  Live: { bg: '#EFBE4F', text: '#1B1B1B' },
  Aula: { bg: '#FFFFFF', text: '#023619', border: true },
  Conquista: { bg: '#EFBE4F', text: '#1B1B1B' },
}

export const TURMAS = ['Turma 38', 'Turma 40', 'Turma 42', 'Turma 43']

// ── Áreas (fóruns) ───────────────────────────────────────────────────────
// Cada tópico pertence a exatamente uma área — espelham 1:1 as categorias
// reais da Comunidade AUVP (grupo "Comunidade AUVP" + as de "AUVP -
// Exclusivo para alunos" relevantes ao módulo geral). Tags (mais abaixo)
// são específicas dentro de uma área: um ticker, um fundo, um diagrama
// nomeado do PIAR — não uma categoria ampla.
export const AREAS = {
  avisos: 'Avisos',
  'bagunca-tema-livre': 'Bagunçinha (Tema Livre)',
  depoimentos: 'Depoimentos',
  'renda-variavel': 'Renda Variável',
  'renda-fixa': 'Renda Fixa',
  'organizacao-financeira': 'Organização Financeira',
  'criptomoedas-e-defi': 'Criptomoedas e De-fi',
  confissionario: 'Confissionário (Anônimo)',
  desafios: 'Desafios',
  'previdencia-privada': 'Previdência Privada',
  'relacoes-profissionais': 'Relações Profissionais (Network)',
  'carreira-e-empreendedorismo': 'Carreira & Empreendedorismo (Conselho Sinceros)',
  lives: 'Lives',
  'debates-e-resumos-de-aulas': 'Debates e Resumos de Aulas',
  'sugestoes-e-reclamacoes': 'Sugestões & Reclamações',
  'precisa-de-ajuda': 'Precisa de Ajuda (Plataforma ou Curso)',
  'dicionario-do-mercado': 'Dicionário do Mercado',
}

// Descrições reais de cada área, exibidas no topo da listagem da área.
export const AREA_DESCRIPTIONS = {
  avisos:
    'Somente colaboradores da AUVP podem criar tópicos nesse espaço. Todos os avisos referentes à comunidade ou à plataforma serão publicados aqui primeiro.',
  'bagunca-tema-livre':
    'Nada sério deve ser discutido aqui — converse sobre assuntos aleatórios, puxe um papo legal, tudo é válido, menos ser chato. Se você quer criar um tópico sério, procure outra seção.',
  depoimentos: 'Se você quiser deixar um depoimento sobre a AUVP, esse é o lugar — e a gente agradece :)',
  'renda-variavel':
    'Quer conversar sobre ações, fundos imobiliários ou outros temas pertinentes à Renda Variável? Antes de criar um tópico, faça uma pesquisa — talvez alguém já tenha criado um semelhante.',
  'renda-fixa': 'CDBs, LCIs, LCAs, CRIs, CRAs, Debêntures, Tesouro Direto e tudo mais? Esse é o lugar!',
  'organizacao-financeira':
    'Vale a pena comprar à vista ou parcelado? Qual o melhor cartão para milhas? Onde deixar a sua reserva de emergência? Aqui você pode conversar sobre isso e qualquer assunto da sua vida financeira cotidiana.',
  'criptomoedas-e-defi': 'Quer debater sobre o novo whitepaper do momento, P2P ou o futuro do Bitcoin? Esse é o espaço.',
  confissionario:
    'Fez besteira e está precisando de um conselho? Crie seu tópico, conte sua história — mas poste anonimamente, sem usar seu nome nesse recinto.',
  desafios:
    'Desafios são postados regularmente para lutarmos contra o nosso próprio fracasso, buscando 1% de melhoria em qualquer área da vida. Convide ou aceite desafios de outros membros.',
  'previdencia-privada': 'PGBL, VGBL e planejamento para a aposentadoria complementar.',
  'relacoes-profissionais': 'Ofereça os seus serviços e encontre bons profissionais.',
  'carreira-e-empreendedorismo':
    'Espaço para discussões práticas sobre carreira, negócios e crescimento profissional. O foco é compartilhar desafios reais e receber visões diretas e imparciais — a proposta não é validação, é evolução.',
  lives: 'Aulas ao vivo com o Raul, sempre às segundas-feiras às 19h. Não pôde assistir? A gravação fica disponível depois.',
  'debates-e-resumos-de-aulas':
    'Se você tem uma ideia e eu outra, e as dividimos, ambos ficamos com duas ideias cada. A melhor forma de aprender é compartilhando o que você sabe com outra pessoa.',
  'sugestoes-e-reclamacoes': 'Encontrou algum problema em qualquer uma das nossas plataformas? Quer sugerir uma melhoria ou reclamar de algo? Estamos aqui para te atender.',
  'precisa-de-ajuda':
    'Dúvida sobre alguma aula ou investimento específico? É só compartilhar aqui — nossos alunos mais experientes e moderadores ajudam a resolver.',
  'dicionario-do-mercado': 'O que é IPO? E Follow-on? O que significa a sigla DARF? Um conjunto de definições dos termos do mercado financeiro.',
}

// Sugestão automática de área (simula IA por palavras-chave)
export const AREA_KEYWORDS = {
  avisos: ['comunicado', 'aviso oficial', 'manutenção programada'],
  'bagunca-tema-livre': ['off-topic', 'zoeira', 'bagunça'],
  depoimentos: ['depoimento', 'meu depoimento sobre a auvp'],
  'renda-variavel': ['ação', 'ações', 'bolsa', 'ibovespa', 'fii', 'fiis', 'fundo imobiliário', 'day trade'],
  'renda-fixa': ['cdb', 'lci', 'lca', 'renda fixa', 'cdi', 'prefixado', 'tesouro', 'selic', 'ipca+'],
  'organizacao-financeira': ['organização financeira', 'planilha', 'orçamento', 'reserva de emergência', 'cartão'],
  'criptomoedas-e-defi': ['bitcoin', 'cripto', 'criptomoeda', 'defi', 'blockchain', 'ouro'],
  confissionario: ['confissão', 'anônimo', 'vergonha', 'ninguém sabe'],
  desafios: ['desafio', 'meta de 30 dias', 'sem gastar'],
  'previdencia-privada': ['previdência', 'pgbl', 'vgbl', 'aposentadoria'],
  'relacoes-profissionais': ['network', 'indicação de emprego', 'vaga', 'linkedin'],
  'carreira-e-empreendedorismo': ['carreira', 'empreender', 'empreendedorismo', 'negócio próprio', 'clt', 'pj'],
  lives: ['live', 'aula ao vivo'],
  'debates-e-resumos-de-aulas': ['aula', 'módulo', 'resumo de aula'],
  'sugestoes-e-reclamacoes': ['sugestão', 'reclamação', 'bug', 'problema na plataforma'],
  'precisa-de-ajuda': ['dúvida sobre a aula', 'dúvida sobre o curso', 'não entendi a aula'],
  'dicionario-do-mercado': ['o que é', 'significado de', 'sigla'],
}

// ── Tags (específicas) ─────────────────────────────────────────────────
// Muito mais granulares que a área: um ticker, um fundo, um diagrama do
// PIAR com nome próprio. Nem todo post precisa de uma — a maioria não tem.
export const ALL_TAGS = [
  'WEG3',
  'PETR4',
  'VALE3',
  'ITSA4',
  'BBAS3',
  'HGLG11',
  'KNRI11',
  'MXRF11',
  'XPML11',
  'Tesouro Selic 2029',
  'Tesouro IPCA+ 2035',
  'Tesouro Prefixado 2027',
  'Bitcoin',
  'Ethereum',
  'Ouro (XAU)',
  'Diagrama do Cerrado',
  'Diagrama do Atlântico',
  'Diagrama da Amazônia',
]

// Sugestão automática de tags específicas (simula IA por palavras-chave)
export const TAG_KEYWORDS = {
  WEG3: ['weg3', 'weg '],
  PETR4: ['petr4', 'petrobras'],
  VALE3: ['vale3', 'vale '],
  ITSA4: ['itsa4', 'itaúsa'],
  BBAS3: ['bbas3', 'banco do brasil'],
  HGLG11: ['hglg11'],
  KNRI11: ['knri11'],
  MXRF11: ['mxrf11'],
  XPML11: ['xpml11'],
  'Tesouro Selic 2029': ['tesouro selic 2029'],
  'Tesouro IPCA+ 2035': ['tesouro ipca+ 2035', 'ipca+ 2035'],
  'Tesouro Prefixado 2027': ['prefixado 2027'],
  Bitcoin: ['bitcoin', 'btc'],
  Ethereum: ['ethereum', 'eth'],
  'Ouro (XAU)': ['ouro', 'xau'],
  'Diagrama do Cerrado': ['diagrama do cerrado'],
  'Diagrama do Atlântico': ['diagrama do atlântico'],
  'Diagrama da Amazônia': ['diagrama da amazônia'],
}

export function suggestArea(text) {
  const lower = ` ${text.toLowerCase()} `
  for (const [area, keywords] of Object.entries(AREA_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) return area
  }
  return null
}

// ── Usuários ───────────────────────────────────────────────────────────────
export const USERS = {
  u1: {
    id: 'u1',
    name: 'Marina Costa',
    nickname: 'marina.investe',
    turma: 'Turma 42',
    role: 'aluno',
    xp: 1850,
    initials: 'MC',
    bio: 'Engenheira, investindo desde 2023. Focada em construir renda passiva com FIIs e renda fixa. Aluna da Escola AUVP desde a Turma 42.',
    followers: ['u5', 'u6', 'u9'],
    following: ['u2', 'u3', 'u5', 'u7'],
    badges: ['b1', 'b2', 'b3', 'b5'],
    infractions: 0,
    joinedAt: daysAgo(210),
    // Elegibilidade do Programa de Conselheiros: AUVP Sempre ativo OU
    // dentro das primeiras 8 semanas (56 dias) de Escola AUVP.
    auvpSempreAtivo: true,
    escolaStartedAt: daysAgo(210),
    piarOptIn: true,
    piar: [
      { label: 'Renda Fixa', value: 40 },
      { label: 'FIIs', value: 25 },
      { label: 'Ações BR', value: 20 },
      { label: 'Internacional', value: 10 },
      { label: 'Caixa', value: 5 },
    ],
  },
  u2: {
    id: 'u2',
    name: 'Ricardo Fontes',
    nickname: 'ricardo.fiis',
    turma: 'Turma 38',
    role: 'conselheiro',
    specialty: 'FIIs',
    xp: 7200,
    initials: 'RF',
    bio: 'Conselheiro AUVP especialista em Fundos Imobiliários. Respondo dúvidas técnicas da comunidade.',
    followers: ['u1', 'u5', 'u6', 'u7', 'u8', 'u9'],
    following: ['u4'],
    badges: ['b1', 'b4', 'b6'],
    infractions: 0,
    joinedAt: daysAgo(720),
  },
  u3: {
    id: 'u3',
    name: 'Paula Andrade',
    nickname: 'paula.ir',
    turma: 'Turma 38',
    role: 'conselheiro',
    specialty: 'Imposto de Renda',
    xp: 6400,
    initials: 'PA',
    bio: 'Conselheira AUVP especialista em tributação e IR para investidores.',
    followers: ['u1', 'u6'],
    following: [],
    badges: ['b1', 'b4'],
    infractions: 0,
    joinedAt: daysAgo(700),
  },
  u4: {
    id: 'u4',
    name: 'Eddy Paulini',
    nickname: 'eddy.auvp',
    turma: 'Equipe AUVP',
    role: 'moderador',
    xp: 9000,
    initials: 'EP',
    bio: 'Moderação oficial da Comunidade AUVP.',
    followers: [],
    following: [],
    badges: ['b1'],
    infractions: 0,
    joinedAt: daysAgo(900),
  },
  u5: {
    id: 'u5',
    name: 'João Menezes',
    nickname: 'joao.rf',
    turma: 'Turma 42',
    role: 'aluno',
    xp: 950,
    initials: 'JM',
    bio: 'Servidor público começando na renda fixa.',
    followers: ['u1'],
    following: ['u1', 'u2'],
    badges: ['b1', 'b2'],
    infractions: 0,
    joinedAt: daysAgo(200),
  },
  u6: {
    id: 'u6',
    name: 'Carla Ribeiro',
    nickname: 'carla.riber',
    turma: 'Turma 40',
    role: 'aluno',
    xp: 2100,
    initials: 'CR',
    bio: 'Médica, montando carteira previdenciária.',
    followers: [],
    following: ['u1', 'u2', 'u3'],
    badges: ['b1', 'b3'],
    infractions: 0,
    joinedAt: daysAgo(340),
  },
  u7: {
    id: 'u7',
    name: 'Felipe Santana',
    nickname: 'lipe.acoes',
    turma: 'Turma 43',
    role: 'aluno',
    xp: 400,
    initials: 'FS',
    bio: 'Estudante de economia, primeira carteira em construção.',
    followers: ['u1'],
    following: [],
    badges: ['b1'],
    infractions: 1,
    joinedAt: daysAgo(60),
  },
  u8: {
    id: 'u8',
    name: 'Bruno Teixeira',
    nickname: 'brunotx',
    turma: 'Turma 43',
    role: 'aluno',
    xp: 120,
    initials: 'BT',
    bio: 'Novo por aqui.',
    followers: [],
    following: ['u1'],
    badges: ['b1'],
    infractions: 2,
    joinedAt: daysAgo(30),
  },
  u9: {
    id: 'u9',
    name: 'Ana Lúcia Prado',
    nickname: 'analu.invest',
    turma: 'Turma 40',
    role: 'aluno',
    xp: 1500,
    initials: 'AP',
    bio: 'Advogada. Interesses: previdência e internacional.',
    followers: [],
    following: ['u1'],
    badges: ['b1', 'b2'],
    infractions: 0,
    joinedAt: daysAgo(300),
  },
  // ── Conselheiros do Programa de Conselheiros (conversas 1:1 agendadas) ──
  // Alunos/clientes voluntários e experientes — distintos dos conselheiros
  // técnicos do fórum (u2, u3), que respondem dúvidas de investimento.
  u10: {
    id: 'u10',
    name: 'Camila Torres',
    nickname: 'camila.torres',
    turma: 'Turma 35',
    role: 'conselheiro',
    xp: 5400,
    initials: 'CT',
    bio: 'Mudei de carreira aos 34 anos, de advocacia para produto. Ofereço conversas sobre transição de carreira e decisões difíceis.',
    followers: ['u1'],
    following: [],
    badges: ['b1'],
    infractions: 0,
    joinedAt: daysAgo(650),
  },
  u11: {
    id: 'u11',
    name: 'Marcelo Vidigal',
    nickname: 'marcelo.vidigal',
    turma: 'Turma 30',
    role: 'conselheiro',
    xp: 8100,
    initials: 'MV',
    bio: 'Empreendedor, abri e fechei um negócio antes de acertar o segundo. Converso sobre empreendedorismo, riscos e momentos de virada.',
    followers: [],
    following: [],
    badges: ['b1'],
    infractions: 0,
    joinedAt: daysAgo(800),
  },
  u12: {
    id: 'u12',
    name: 'Juliana Prado',
    nickname: 'ju.prado',
    turma: 'Turma 33',
    role: 'conselheiro',
    xp: 6900,
    initials: 'JP',
    bio: 'Casada há 12 anos, já brigou e fez as pazes com o orçamento do casal várias vezes. Converso sobre dinheiro a dois e relacionamentos.',
    followers: [],
    following: [],
    badges: ['b1'],
    infractions: 0,
    joinedAt: daysAgo(710),
  },
  auvp: {
    id: 'auvp',
    name: 'AUVP Oficial',
    nickname: 'AUVP',
    turma: 'Institucional',
    role: 'oficial',
    xp: 0,
    initials: 'AU',
    bio: 'Canal oficial de novidades, eventos, releases e comunicados da AUVP.',
    followers: [],
    following: [],
    badges: [],
    infractions: 0,
    joinedAt: daysAgo(1000),
  },
  suporte: {
    id: 'suporte',
    name: 'Suporte AUVP',
    nickname: 'Suporte AUVP',
    turma: 'Institucional',
    role: 'oficial',
    xp: 0,
    initials: 'SP',
    bio: 'Canal de suporte para dúvidas sobre a plataforma, cursos e questões de conta.',
    followers: [],
    following: [],
    badges: [],
    infractions: 0,
    joinedAt: daysAgo(1000),
  },
}

export const CURRENT_USER_ID = 'u1'

// ── Badges e Loja ──────────────────────────────────────────────────────────
export const BADGES = {
  b1: { id: 'b1', name: 'Embarque', desc: 'Entrou na Comunidade AUVP', icon: 'Anchor' },
  b2: { id: 'b2', name: 'Primeira Pergunta', desc: 'Publicou o primeiro tópico', icon: 'ChatCircleText' },
  b3: { id: 'b3', name: 'Resposta Útil', desc: '10 respostas com voto positivo', icon: 'ThumbsUp' },
  b4: { id: 'b4', name: 'Conselheiro', desc: 'Autoridade técnica reconhecida', icon: 'SealCheck' },
  b5: { id: 'b5', name: 'Navegante da Turma 42', desc: 'Concluiu o módulo 4 da Escola', icon: 'Boat' },
  b6: { id: 'b6', name: '100 Respostas Validadas', desc: 'Marco de contribuição técnica', icon: 'Trophy' },
}

export const SHOP_ITEMS = [
  { id: 's1', name: 'Tema Verde Abissal', type: 'Tema de cores', requirement: 'Nível 3 — Escuna', unlocked: true },
  { id: 's2', name: 'Moldura Caravela', type: 'Moldura de avatar', requirement: 'Nível 4 — Caravela', unlocked: true },
  { id: 's3', name: 'Uso de GIFs em comentários', type: 'Permissão', requirement: 'Badge Resposta Útil', unlocked: true },
  { id: 's4', name: 'Moldura Galeão Dourado', type: 'Moldura de avatar', requirement: 'Nível 5 — Galeão', unlocked: false },
  { id: 's5', name: 'Título "Lobo do Mar"', type: 'Título de perfil', requirement: 'Nível 6 — Navio-Almirante', unlocked: false },
]

// ── Lives ──────────────────────────────────────────────────────────────────
export const LIVES = [
  {
    id: 'live1',
    title: 'Análise ao vivo: cenário de juros e impacto nos FIIs',
    host: 'Raul Sena (Conselheiro)',
    hostPhoto: true,
    status: 'live', // acontecendo agora → modal no topo do Hub
    startsAt: hoursAgo(0.5),
    eligible: true,
    viewers: 412,
    materials: ['Planilha de acompanhamento de FIIs', 'Slide da apresentação'],
  },
  {
    id: 'live2',
    title: 'Aula aberta: declaração de IR para investidores 2026',
    host: 'Paula Andrade (Conselheira)',
    status: 'scheduled',
    startsAt: hoursAgo(-30),
    eligible: true,
    viewers: 0,
    materials: ['Checklist de documentos'],
  },
]

// ── Posts (tópicos do fórum) ───────────────────────────────────────────────
export const POSTS = [
  {
    id: 'p1',
    authorId: 'u5',
    title: 'Como declarar FIIs no imposto de renda pela primeira vez?',
    body: 'Comprei minhas primeiras cotas de fundos imobiliários em 2025 e agora estou perdido com a declaração. Preciso declarar mesmo sem ter vendido nada? Os dividendos isentos entram onde? Alguém da turma pode me ajudar com um passo a passo?',
    flair: 'Dúvida',
    area: 'renda-variavel',
    tags: [],
    turma: 'Turma 42',
    createdAt: hoursAgo(5),
    upvotes: 34,
    feed: 'foryou',
    solutionCommentId: 'c3',
    suggestedLesson: { module: 'Módulo 7 — Tributação', lesson: 'Aula 3: IR sobre FIIs na prática' },
  },
  {
    id: 'p2',
    authorId: 'auvp',
    title: 'Nova live hoje às 19h: cenário de juros e impacto nos FIIs',
    body: 'A live desta semana com o conselheiro Ricardo Fontes acontece hoje às 19h. Material de apoio já disponível na área da live. Alunos das turmas 40, 42 e 43 são elegíveis.',
    flair: 'Live',
    area: 'lives',
    tags: [],
    turma: 'Institucional',
    createdAt: hoursAgo(8),
    upvotes: 120,
    feed: 'updates',
    solutionCommentId: null,
  },
  {
    id: 'p3',
    authorId: 'u1',
    title: 'Case: como montei minha reserva de emergência em 8 meses',
    body: 'Quero compartilhar com a turma como saí do zero até 6 meses de custo de vida guardados. Usei uma combinação de Tesouro Selic e CDB de liquidez diária, com aporte automático todo dia 5. O ponto de virada foi tratar a reserva como uma "conta obrigatória", não como sobra do mês.',
    flair: 'Case',
    area: 'organizacao-financeira',
    tags: [],
    turma: 'Turma 42',
    createdAt: daysAgo(1.2),
    upvotes: 89,
    feed: 'foryou',
    solutionCommentId: null,
    cover: 'ocean',
  },
  {
    id: 'p4',
    authorId: 'u6',
    title: 'Tesouro IPCA+ ou prefixado para objetivo de 10 anos?',
    body: 'Meu objetivo é a aposentadoria complementar em ~10 anos. Estou em dúvida entre travar uma taxa prefixada agora ou ir de IPCA+ para proteger da inflação. Como vocês pensam essa decisão dentro do método AUVP?',
    flair: 'Dúvida',
    area: 'renda-fixa',
    tags: ['Tesouro IPCA+ 2035'],
    turma: 'Turma 40',
    createdAt: daysAgo(2),
    upvotes: 41,
    feed: 'foryou',
    solutionCommentId: null,
    suggestedLesson: { module: 'Módulo 4 — Renda Fixa', lesson: 'Aula 6: Indexadores e prazos' },
    cover: 'chart',
  },
  {
    id: 'p5',
    authorId: 'auvp',
    title: 'Release: nova Calculadora de Rendimentos no SuperApp',
    body: 'A calculadora de rendimentos foi atualizada com simulação de aportes mensais e comparação entre CDI, IPCA+ e prefixado. Disponível para todos os alunos na aba Ferramentas.',
    flair: 'Aula',
    area: 'avisos',
    tags: [],
    turma: 'Institucional',
    createdAt: daysAgo(2.5),
    upvotes: 76,
    feed: 'updates',
    solutionCommentId: null,
  },
  {
    id: 'p6',
    authorId: 'u7',
    title: 'Quando o gerente do banco descobre que você fez a Escola AUVP',
    body: 'Fui "convidado" para uma reunião sobre um COE imperdível. Recusei educadamente citando a aula de produtos estruturados. A cara dele não tinha preço.',
    flair: 'Meme',
    area: 'bagunca-tema-livre',
    tags: [],
    turma: 'Turma 43',
    createdAt: daysAgo(3),
    upvotes: 214,
    feed: 'foryou',
    solutionCommentId: null,
  },
  {
    id: 'p7',
    authorId: 'u9',
    title: 'Conquista: primeiro aporte internacional realizado!',
    body: 'Depois do módulo de investimentos no exterior, finalmente abri conta e fiz meu primeiro aporte em ETF internacional. Obrigada à comunidade pelas dicas na minha dúvida da semana passada.',
    flair: 'Conquista',
    area: 'renda-variavel',
    tags: [],
    turma: 'Turma 40',
    createdAt: daysAgo(4),
    upvotes: 132,
    feed: 'foryou',
    solutionCommentId: null,
  },
  {
    id: 'p8',
    authorId: 'auvp',
    title: 'Comunicado: manutenção programada do SuperApp neste sábado',
    body: 'No sábado, das 02h às 05h, o SuperApp passará por manutenção. A comunidade ficará em modo somente leitura nesse período.',
    flair: 'Aula',
    area: 'avisos',
    tags: [],
    turma: 'Institucional',
    createdAt: daysAgo(5),
    upvotes: 18,
    feed: 'updates',
    solutionCommentId: null,
  },
  {
    id: 'p9',
    authorId: 'u5',
    title: 'Vale a pena manter previdência PGBL do banco antigo?',
    body: 'Tenho um PGBL antigo com taxa de administração de 2,5% a.a. e carregamento na saída. Faço a portabilidade ou resgato e invisto por conta? Declaro no modelo completo.',
    flair: 'Dúvida',
    area: 'previdencia-privada',
    tags: [],
    turma: 'Turma 42',
    createdAt: hoursAgo(14),
    upvotes: 27,
    feed: 'foryou',
    solutionCommentId: null,
  },
  {
    id: 'p10',
    authorId: 'u1',
    title: 'Dúvida sobre rebalanceamento com o PIAR',
    body: 'Meu diagrama do PIAR está apontando 8% de desvio em FIIs depois da alta do mês. Vocês rebalanceiam vendendo ou apenas direcionando os novos aportes? Qual o critério de vocês para o desvio máximo tolerado?',
    flair: 'Dúvida',
    area: 'organizacao-financeira',
    tags: ['Diagrama do Cerrado'],
    turma: 'Turma 42',
    createdAt: daysAgo(6),
    upvotes: 55,
    feed: 'foryou',
    solutionCommentId: 'c12',
    cover: 'allocation',
  },
  {
    id: 'p11',
    authorId: 'u2',
    title: 'Análise da semana: o que olhar em relatórios gerenciais de FIIs',
    body: 'Publiquei um roteiro objetivo do que verificar todo mês nos relatórios gerenciais: vacância, inadimplência, cronograma de vencimento de contratos, alavancagem e distribuição vs. resultado. Sigam o roteiro antes de reagir a qualquer queda de cota.',
    flair: 'Aula',
    area: 'renda-variavel',
    tags: ['HGLG11', 'KNRI11'],
    turma: 'Turma 38',
    createdAt: daysAgo(1),
    upvotes: 167,
    feed: 'foryou',
    solutionCommentId: null,
    cover: 'skyline',
  },
  {
    id: 'p12',
    authorId: 'u8',
    title: 'URGENTE: grupo VIP com sinais de day trade, chama no privado',
    body: 'Galera, montei um grupo com sinais certeiros de day trade, resultados garantidos de 5% ao dia. Quem quiser entrar me chama no privado que passo o link.',
    flair: 'Case',
    area: 'renda-variavel',
    tags: [],
    turma: 'Turma 43',
    createdAt: hoursAgo(6),
    upvotes: -12,
    feed: 'foryou',
    solutionCommentId: null,
    hidden: true, // ocultado temporariamente pela moderação
  },
  // ── Posts refletindo os canais reais da comunidade AUVP (Discord) ────────
  {
    id: 'p13',
    authorId: 'u9',
    title: 'Vale a pena ter uma pequena posição em ouro na carteira?',
    body: 'Tenho visto muita gente falando de ouro como proteção em cenário de instabilidade global. Faz sentido destinar uns 5% da carteira via ETF de ouro, ou isso foge do método AUVP de simplicidade?',
    flair: 'Dúvida',
    area: 'criptomoedas-e-defi',
    tags: ['Ouro (XAU)'],
    turma: 'Turma 40',
    createdAt: hoursAgo(9),
    upvotes: 22,
    feed: 'foryou',
    solutionCommentId: null,
  },
  {
    id: 'p14',
    authorId: 'u7',
    title: 'Bitcoin como reserva de valor: exagero ou faz sentido em 2026?',
    body: 'Depois da aula de ativos alternativos fiquei na dúvida: bitcoin entra na conversa de "renda variável" ou é uma classe totalmente à parte? Como vocês enxergam isso dentro de uma carteira de longo prazo?',
    flair: 'Dúvida',
    area: 'criptomoedas-e-defi',
    tags: ['Bitcoin'],
    turma: 'Turma 43',
    createdAt: hoursAgo(30),
    upvotes: 38,
    feed: 'foryou',
    solutionCommentId: null,
  },
  {
    id: 'p15',
    authorId: 'u6',
    title: 'Minha planilha de organização financeira mensal (compartilhando)',
    body: 'Depois de meses ajustando, cheguei numa planilha simples de orçamento doméstico que separa essenciais, desejos e investimentos automaticamente a partir do extrato. Deixo o link nos comentários para quem quiser copiar.',
    flair: 'Case',
    area: 'organizacao-financeira',
    tags: [],
    turma: 'Turma 40',
    createdAt: daysAgo(3),
    upvotes: 145,
    feed: 'foryou',
    solutionCommentId: null,
  },
  {
    id: 'p16',
    authorId: 'u5',
    title: 'Confissionário: já resgatei a reserva de emergência pra viagem',
    body: 'Ninguém sabe disso além de vocês aqui: mês passado resgatei metade da minha reserva pra uma viagem "imperdível". Já reforcei o valor no meu planejamento, mas confesso que doeu ver o número cair no extrato.',
    flair: 'Meme',
    area: 'confissionario',
    tags: [],
    turma: 'Turma 42',
    createdAt: hoursAgo(15),
    upvotes: 96,
    feed: 'foryou',
    solutionCommentId: null,
  },
  {
    id: 'p17',
    authorId: 'u1',
    title: 'Desafio dos 30 dias sem gastos supérfluos — quem topa comigo?',
    body: 'Vou tentar 30 dias cortando qualquer gasto que não seja essencial ou investimento, só pra testar meu próprio limite de disciplina. Quem quiser topar o desafio comigo, comenta aqui que a gente se cobra mutuamente!',
    flair: 'Case',
    area: 'desafios',
    tags: [],
    turma: 'Turma 42',
    createdAt: hoursAgo(20),
    upvotes: 71,
    feed: 'foryou',
    solutionCommentId: null,
  },
  {
    id: 'p18',
    authorId: 'u2',
    title: 'Network: alguém trabalha com análise de crédito e topa um bate-papo?',
    body: 'Estou migrando de carreira para o mercado financeiro e queria trocar uma ideia com quem já atua com análise de crédito ou risco. Sei que tem gente da turma nessa área — bora conectar?',
    flair: 'Dúvida',
    area: 'relacoes-profissionais',
    tags: [],
    turma: 'Turma 38',
    createdAt: daysAgo(1.5),
    upvotes: 19,
    feed: 'foryou',
    solutionCommentId: null,
  },
  {
    id: 'p19',
    authorId: 'u9',
    title: 'Larguei o emprego CLT pra empreender — o que aprendi sobre dinheiro',
    body: 'Depois de 8 anos de CLT, resolvi abrir minha própria consultoria. O maior aprendizado não foi sobre o negócio em si, mas sobre como precisei reforçar a reserva de emergência ANTES de dar esse passo. Deixo esse relato pra quem está pensando em empreender.',
    flair: 'Case',
    area: 'carreira-e-empreendedorismo',
    tags: [],
    turma: 'Turma 40',
    createdAt: daysAgo(4),
    upvotes: 203,
    feed: 'foryou',
    solutionCommentId: null,
  },
  {
    id: 'p20',
    authorId: 'u6',
    title: 'Vitrine: bati a primeira carteira de 6 dígitos!',
    body: 'Print em anexo mostrando que finalmente cruzei a marca de 6 dígitos investidos. 3 anos de aportes mensais consistentes e muita paciência com a renda fixa. Obrigada à comunidade pelas trocas!',
    flair: 'Conquista',
    area: 'organizacao-financeira',
    tags: [],
    turma: 'Turma 40',
    createdAt: hoursAgo(11),
    upvotes: 187,
    feed: 'foryou',
    solutionCommentId: null,
  },
]

// ── Reações de comentário (além do upvote) ──────────────────────────────────
// Substituem o downvote em comentários: em vez de permitir que a galera se
// junte anonimamente para "afundar" alguém, canalizamos o sentimento negativo
// (e o bom humor) em reações nomeadas e públicas.
export const REACTIONS = [
  { key: 'brabo', label: 'Brabo' },
  { key: 'aula', label: 'Aí cê deu aula' },
  { key: 'ajudou', label: 'Me ajudou' },
  { key: 'haha', label: 'Hahaha' },
  { key: 'merda', label: 'Esse post ficou uma merda' },
  { key: 'pobre', label: 'Você é pobre premium' },
  { key: 'sad', label: 'Sad' },
]

// Gera contagens iniciais determinísticas (sem Math.random) a partir do id
// do comentário, só para o mock parecer vivo.
function seedReactionCounts(commentId) {
  let seed = 0
  for (let i = 0; i < commentId.length; i++) seed += commentId.charCodeAt(i) * (i + 1)
  const counts = {}
  REACTIONS.forEach((r, i) => {
    const v = (seed * (i + 3)) % 11
    if (v > 6) counts[r.key] = v - 6
  })
  return counts
}
export const COMMENT_REACTIONS = Object.fromEntries(
  Array.from({ length: 60 }, (_, i) => `c${i + 1}`).map((id) => [id, seedReactionCounts(id)]),
)

// ── Comentários (árvore via parentId) ──────────────────────────────────────
export const COMMENTS = [
  // p1 — dúvida de IR com solução validada
  {
    id: 'c1',
    postId: 'p1',
    parentId: null,
    authorId: 'u6',
    body: 'Passei por isso ano passado! O informe da corretora resolve 90% do trabalho. Espera o conselheiro confirmar, mas o caminho é a ficha de Bens e Direitos + Rendimentos Isentos.',
    upvotes: 12,
    createdAt: hoursAgo(4.5),
    validated: false,
  },
  {
    id: 'c2',
    postId: 'p1',
    parentId: 'c1',
    authorId: 'u5',
    body: 'A corretora manda o informe automaticamente ou preciso pedir?',
    upvotes: 3,
    createdAt: hoursAgo(4.2),
    validated: false,
  },
  {
    id: 'c3',
    postId: 'p1',
    parentId: null,
    authorId: 'u2',
    body: 'Resposta completa: (1) Sim, você declara mesmo sem vender — cada FII entra em Bens e Direitos, grupo 07, código 03, pelo custo de aquisição. (2) Os rendimentos mensais isentos entram em "Rendimentos Isentos e Não Tributáveis", código 26. (3) Se houver venda com lucro, aí sim há DARF de 20% até o último dia útil do mês seguinte. O informe de rendimentos da sua corretora traz os valores consolidados.',
    upvotes: 48,
    createdAt: hoursAgo(3.8),
    validated: true,
  },
  {
    id: 'c4',
    postId: 'p1',
    parentId: 'c3',
    authorId: 'u5',
    body: 'Perfeito, exatamente o que eu precisava. Marquei como solução!',
    upvotes: 6,
    createdAt: hoursAgo(3),
    validated: false,
  },
  {
    id: 'c5',
    postId: 'p1',
    parentId: 'c3',
    authorId: 'u1',
    body: 'Salvando esse comentário para a minha declaração também. Obrigada, conselheiro!',
    upvotes: 4,
    createdAt: hoursAgo(2.5),
    validated: false,
  },
  // p3 — case
  {
    id: 'c6',
    postId: 'p3',
    parentId: null,
    authorId: 'u5',
    body: 'O aporte automático no dia do salário muda o jogo mesmo. Comigo funcionou igual.',
    upvotes: 9,
    createdAt: daysAgo(1),
    validated: false,
  },
  {
    id: 'c7',
    postId: 'p3',
    parentId: null,
    authorId: 'u7',
    body: 'Quanto você deixou no Tesouro Selic vs CDB? Estou montando a minha agora.',
    upvotes: 5,
    createdAt: daysAgo(0.9),
    validated: false,
  },
  {
    id: 'c8',
    postId: 'p3',
    parentId: 'c7',
    authorId: 'u1',
    body: 'Fiz 70% Tesouro Selic e 30% CDB 102% do CDI com liquidez diária, pelos limites do FGC e praticidade de resgate.',
    upvotes: 11,
    createdAt: daysAgo(0.8),
    validated: false,
  },
  // p4
  {
    id: 'c9',
    postId: 'p4',
    parentId: null,
    authorId: 'u2',
    body: 'Para prazos longos com objetivo de consumo futuro (aposentadoria), a proteção contra inflação tende a importar mais do que a taxa nominal. O método sugere olhar o objetivo antes do produto.',
    upvotes: 22,
    createdAt: daysAgo(1.8),
    validated: false,
  },
  {
    id: 'c10',
    postId: 'p4',
    parentId: 'c9',
    authorId: 'u6',
    body: 'Faz sentido. Vou rever a proporção entre os dois na minha carteira.',
    upvotes: 2,
    createdAt: daysAgo(1.7),
    validated: false,
  },
  // p10 — PIAR com solução
  {
    id: 'c11',
    postId: 'p10',
    parentId: null,
    authorId: 'u6',
    body: 'Eu só direciono os aportes novos, nunca vendo para rebalancear. Menos custo e menos imposto.',
    upvotes: 14,
    createdAt: daysAgo(5.8),
    validated: false,
  },
  {
    id: 'c12',
    postId: 'p10',
    parentId: null,
    authorId: 'u2',
    body: 'Resposta validada: com 8% de desvio, o padrão do método é rebalancear com aportes novos direcionados pelo próprio PIAR — venda só em desvios extremos (>15%) ou mudança de tese. Vender para rebalancear gera evento tributário desnecessário na maioria dos casos.',
    upvotes: 39,
    createdAt: daysAgo(5.5),
    validated: true,
  },
  {
    id: 'c13',
    postId: 'p10',
    parentId: 'c12',
    authorId: 'u1',
    body: 'Ótimo, vou seguir com os aportes direcionados. Obrigada!',
    upvotes: 5,
    createdAt: daysAgo(5.2),
    validated: false,
  },
  // p11
  {
    id: 'c14',
    postId: 'p11',
    parentId: null,
    authorId: 'u1',
    body: 'Roteiro salvo! A parte de distribuição vs. resultado deveria ser obrigatória antes de qualquer post de pânico por aqui.',
    upvotes: 18,
    createdAt: hoursAgo(20),
    validated: false,
  },
  {
    id: 'c15',
    postId: 'p11',
    parentId: 'c14',
    authorId: 'u2',
    body: 'Exatamente o motivo do roteiro. Distribuição alta com resultado fraco é sinal de alerta, não de festa.',
    upvotes: 21,
    createdAt: hoursAgo(19),
    validated: false,
  },
  // p9
  {
    id: 'c16',
    postId: 'p9',
    parentId: null,
    authorId: 'u3',
    body: 'Com modelo completo e PGBL, avalie primeiro a portabilidade para um plano com taxa menor — resgatar pode gerar IR regressivo alto dependendo do prazo das contribuições. Portabilidade não é evento tributário.',
    upvotes: 16,
    createdAt: hoursAgo(10),
    validated: false,
  },
]

// ── Notificações ───────────────────────────────────────────────────────────
export const NOTIFICATIONS = [
  { id: 'n1', type: 'live', text: 'A live "Análise ao vivo: cenário de juros e impacto nos FIIs" está acontecendo agora. Você é elegível!', createdAt: hoursAgo(0.4), read: false, link: '/' },
  { id: 'n2', type: 'reply', text: 'ricardo.fiis respondeu ao seu tópico "Dúvida sobre rebalanceamento com o PIAR".', createdAt: daysAgo(5.5), read: true, link: '/post/p10' },
  { id: 'n3', type: 'voto', text: 'Seu case "Como montei minha reserva de emergência" recebeu 25 novos votos.', createdAt: daysAgo(0.5), read: false, link: '/post/p3' },
  { id: 'n4', type: 'follow', text: 'analu.invest está te seguindo.', createdAt: daysAgo(1), read: false, link: '/perfil/u9' },
  { id: 'n5', type: 'badge', text: 'Você desbloqueou a badge "Navegante da Turma 42".', createdAt: daysAgo(2), read: true, link: '/perfil/u1' },
  { id: 'n6', type: 'reply', text: 'joao.rf comentou no tópico que você segue: "Como declarar FIIs no imposto de renda...".', createdAt: hoursAgo(4), read: false, link: '/post/p1' },
  { id: 'n7', type: 'retro', text: 'Sua retrospectiva semanal está pronta. Veja seus destaques!', createdAt: hoursAgo(2), read: false, link: '/retrospectiva' },
  { id: 'n8', type: 'moderation', text: 'Sua solicitação de apelido foi aprovada pela moderação.', createdAt: daysAgo(12), read: true, link: '/configuracoes' },
]

// ── Conexões e DMs ─────────────────────────────────────────────────────────
export const FRIEND_REQUESTS = [
  { id: 'fr1', fromId: 'u9', createdAt: daysAgo(1) },
  { id: 'fr2', fromId: 'u6', createdAt: hoursAgo(6) },
]

export const REFERRAL_LINK = 'https://auvp.com.br/convite/marina-investe-42'

export const CONVERSATIONS = [
  {
    id: 'dm1',
    withId: 'u5',
    box: 'principal', // amigos (seguem-se mutuamente)
    messages: [
      { id: 'm1', fromId: 'u5', text: 'Marina, vi seu case da reserva. Qual CDB você usou?', createdAt: hoursAgo(26) },
      { id: 'm2', fromId: 'u1', text: 'Oi João! Um de liquidez diária a 102% do CDI, banco médio dentro do FGC.', createdAt: hoursAgo(25) },
      { id: 'm3', fromId: 'u5', text: 'Show, obrigado! Vou comparar com o Tesouro Selic.', createdAt: hoursAgo(24) },
    ],
  },
  {
    id: 'dm2',
    withId: 'u4',
    box: 'principal', // moderador cai direto na caixa principal
    messages: [
      { id: 'm4', fromId: 'u4', text: 'Olá, Marina! Sua solicitação de apelido foi aprovada. Bons estudos!', createdAt: daysAgo(12) },
      { id: 'm5', fromId: 'u1', text: 'Obrigada, Eddy!', createdAt: daysAgo(12) },
    ],
  },
  {
    id: 'dm3',
    withId: 'u8',
    box: 'solicitacoes', // não são amigos → cai em solicitações
    messages: [
      { id: 'm6', fromId: 'u8', text: 'Oi! Tenho uma oportunidade imperdível pra te mostrar, posso enviar o link?', createdAt: hoursAgo(3) },
    ],
  },
  {
    id: 'dm4',
    withId: 'suporte',
    box: 'suporte', // aba exclusiva de suporte — sempre disponível, sem trava de amizade
    messages: [
      { id: 'm7', fromId: 'u1', text: 'Oi! O certificado do módulo 6 não aparece na minha área de aluno, alguém pode verificar?', createdAt: daysAgo(2) },
      { id: 'm8', fromId: 'suporte', text: 'Olá, Marina! Vamos verificar por aqui. Pode confirmar o e-mail cadastrado na sua conta?', createdAt: daysAgo(2) },
      { id: 'm9', fromId: 'u1', text: 'Claro, é o mesmo do cadastro da Escola AUVP.', createdAt: daysAgo(1.9) },
      { id: 'm10', fromId: 'suporte', text: 'Encontramos a pendência e já liberamos o certificado. Pode conferir novamente na sua área — qualquer coisa, seguimos por aqui!', createdAt: daysAgo(1.8) },
    ],
  },
]

export const DM_DAILY_LIMIT = 30 // trava anti-spam de mensagens/dia

// ── Moderação: denúncias ───────────────────────────────────────────────────
export const REPORTS = [
  {
    id: 'r1',
    status: 'pendente',
    reporterId: 'u6',
    targetType: 'post',
    targetId: 'p12',
    targetAuthorId: 'u8',
    reason: 'Spam',
    excerpt: 'grupo VIP com sinais de day trade, resultados garantidos de 5% ao dia',
    sensitiveTerms: ['sinais', 'garantidos', 'day trade'],
    createdAt: hoursAgo(5),
  },
  {
    id: 'r2',
    status: 'pendente',
    reporterId: 'u1',
    targetType: 'comment',
    targetId: 'c-ext-1',
    targetAuthorId: 'u7',
    reason: 'Ofensa',
    excerpt: 'só um idiota compraria isso, vai estudar antes de postar',
    sensitiveTerms: ['idiota'],
    createdAt: hoursAgo(7),
  },
  {
    id: 'r3',
    status: 'pendente',
    reporterId: 'u5',
    targetType: 'comment',
    targetId: 'c-ext-2',
    targetAuthorId: 'u8',
    reason: 'Informação Incorreta',
    excerpt: 'FII não paga imposto nunca, pode vender à vontade que é tudo isento',
    sensitiveTerms: ['isento', 'nunca'],
    createdAt: hoursAgo(2),
  },
  {
    id: 'r4',
    status: 'analise',
    reporterId: 'u9',
    targetType: 'post',
    targetId: 'p-ext-1',
    targetAuthorId: 'u7',
    reason: 'Off-topic',
    excerpt: 'alguém aí joga poker online? bora montar uma mesa da turma',
    sensitiveTerms: ['poker'],
    createdAt: daysAgo(1),
  },
  {
    id: 'r5',
    status: 'resolvida',
    reporterId: 'u6',
    targetType: 'comment',
    targetId: 'c-ext-3',
    targetAuthorId: 'u8',
    reason: 'Spam',
    excerpt: 'segue meu canal de dicas quentes, link na bio',
    sensitiveTerms: ['link na bio'],
    createdAt: daysAgo(2),
    resolution: 'Removido permanentemente + advertência formal',
  },
  {
    id: 'r6',
    status: 'arquivada',
    reporterId: 'u7',
    targetType: 'post',
    targetId: 'p6',
    targetAuthorId: 'u7',
    reason: 'Off-topic',
    excerpt: 'Quando o gerente do banco descobre que você fez a Escola AUVP',
    sensitiveTerms: [],
    createdAt: daysAgo(3),
    resolution: 'Conteúdo mantido — flair Meme é permitido',
  },
]

// ── Moderação: fila de apelidos ────────────────────────────────────────────
export const NICKNAME_QUEUE = [
  {
    id: 'nk1',
    userId: 'u8',
    legalName: 'Bruno Teixeira da Silva',
    currentNickname: 'brunotx',
    suggestedNickname: 'Suporte_AUVP',
    changesThisYear: 3,
    createdAt: hoursAgo(9),
    status: 'pendente',
  },
  {
    id: 'nk2',
    userId: 'u7',
    legalName: 'Felipe Santana Rocha',
    currentNickname: 'lipe.acoes',
    suggestedNickname: 'lipe.valuation',
    changesThisYear: 1,
    createdAt: hoursAgo(20),
    status: 'pendente',
  },
  {
    id: 'nk3',
    userId: 'u9',
    legalName: 'Ana Lúcia Prado',
    currentNickname: 'analu.invest',
    suggestedNickname: 'analu.prev',
    changesThisYear: 0,
    createdAt: daysAgo(2),
    status: 'pendente',
  },
]

export const NICKNAME_REJECT_REASONS = [
  'Uso de termos institucionais',
  'Tentativa de se passar por colaborador/instituição',
  'Obscenidade',
  'Conotação política ou religiosa',
  'Excesso de alterações no período',
]

// ── Moderação: histórico de apelidos (prontuário) ──────────────────────────
export const NICKNAME_HISTORY = {
  u1: [
    { from: 'marina.c', to: 'marina.investe', date: daysAgo(12), status: 'aprovado' },
    { from: 'MarinaCosta42', to: 'marina.c', date: daysAgo(150), status: 'aprovado' },
  ],
  u8: [
    { from: 'brunao_trader', to: 'brunotx', date: daysAgo(10), status: 'aprovado' },
    { from: 'bruno.t', to: 'brunao_trader', date: daysAgo(18), status: 'aprovado' },
    { from: 'brunotx1', to: 'bruno.t', date: daysAgo(25), status: 'aprovado' },
  ],
}

// ── Moderação: log de auditoria ────────────────────────────────────────────
export const AUDIT_LOG = [
  { id: 'a1', date: hoursAgo(1), moderatorId: 'u4', action: 'Ocultar Temporariamente', targetUserId: 'u8', targetRef: 'Post p12', reason: 'Suspeita de spam/promessa de retorno', undoable: true },
  { id: 'a2', date: hoursAgo(6), moderatorId: 'u4', action: 'Resposta Validada', targetUserId: 'u2', targetRef: 'Comentário c3', reason: 'Chancela técnica — IR sobre FIIs', undoable: false },
  { id: 'a3', date: daysAgo(1), moderatorId: 'u4', action: 'Advertência Formal', targetUserId: 'u7', targetRef: 'Comentário c-ext-1', reason: 'Ofensa a outro aluno', undoable: true },
  { id: 'a4', date: daysAgo(2), moderatorId: 'u4', action: 'Remover Permanentemente', targetUserId: 'u8', targetRef: 'Comentário c-ext-3', reason: 'Spam recorrente', undoable: true },
  { id: 'a5', date: daysAgo(2.2), moderatorId: 'u4', action: 'Mute 24h', targetUserId: 'u8', targetRef: 'Prontuário', reason: 'Reincidência de spam', undoable: true },
  { id: 'a6', date: daysAgo(3), moderatorId: 'u4', action: 'Aprovar Apelido', targetUserId: 'u1', targetRef: 'marina.investe', reason: 'Dentro das diretrizes', undoable: false },
  { id: 'a7', date: daysAgo(4), moderatorId: 'u4', action: 'Manter Conteúdo', targetUserId: 'u7', targetRef: 'Post p6', reason: 'Meme dentro das regras', undoable: false },
  { id: 'a8', date: daysAgo(5), moderatorId: 'u4', action: 'Notificar Conselheiro', targetUserId: 'u2', targetRef: 'Post p4', reason: 'Dúvida técnica de renda fixa sem resposta', undoable: false },
]

// ── Moderação: métricas do overview ────────────────────────────────────────
export const MOD_METRICS = {
  pendingReports: 3,
  overdueReports: 1, // sem tratamento há mais de 4h
  pendingNicknames: 3,
  avgFirstResponseMin: 42,
  trend: [
    { day: 'Seg', reports: 4, posts: 38 },
    { day: 'Ter', reports: 2, posts: 45 },
    { day: 'Qua', reports: 6, posts: 41 },
    { day: 'Qui', reports: 3, posts: 52 },
    { day: 'Sex', reports: 5, posts: 60 },
    { day: 'Sáb', reports: 1, posts: 28 },
    { day: 'Dom', reports: 3, posts: 33 },
  ],
}

// ── Moderação: central de conselheiros ─────────────────────────────────────
export const UNANSWERED_QUEUE = [
  { id: 'q1', postId: 'p4', hoursOpen: 48, topic: 'Tesouro IPCA+ ou prefixado para objetivo de 10 anos?', tags: ['tesouro-direto', 'renda-fixa'] },
  { id: 'q2', postId: 'p9', hoursOpen: 14, topic: 'Vale a pena manter previdência PGBL do banco antigo?', tags: ['previdencia-privada', 'imposto-de-renda'] },
]

export const COUNSELOR_PERFORMANCE = [
  { userId: 'u2', validatedAnswers: 112, avgRating: 4.9, specialty: 'FIIs' },
  { userId: 'u3', validatedAnswers: 87, avgRating: 4.8, specialty: 'Imposto de Renda' },
]

// ── Programa de Conselheiros (conversas 1:1 agendadas) ──────────────────────
// Conecta alunos a membros experientes da própria comunidade (clientes e
// alunos voluntários) para conversas orientativas rápidas, objetivas e
// humanas antes de uma decisão importante. Distinto da validação técnica
// de respostas do fórum (COUNSELOR_PERFORMANCE, acima).
export const ADVISOR_AREAS = {
  carreira: 'Carreira',
  dinheiro: 'Dinheiro',
  relacionamentos: 'Relacionamentos',
  saude: 'Saúde',
  empreendedorismo: 'Empreendedorismo',
  'decisoes-dificeis': 'Decisões difíceis',
  'transicao-de-vida': 'Momentos de transição',
}

export const CONSELHEIRO_PROGRAM = [
  {
    userId: 'u10',
    areas: ['carreira', 'decisoes-dificeis', 'transicao-de-vida'],
    availability: [
      { id: 'slot1', label: 'Amanhã, 09:00', at: hoursAgo(-20) },
      { id: 'slot2', label: 'Amanhã, 14:30', at: hoursAgo(-25.5) },
      { id: 'slot3', label: 'Quinta, 18:00', at: hoursAgo(-68) },
    ],
  },
  {
    userId: 'u11',
    areas: ['empreendedorismo', 'decisoes-dificeis', 'carreira'],
    availability: [
      { id: 'slot4', label: 'Hoje, 19:00', at: hoursAgo(-6) },
      { id: 'slot5', label: 'Sexta, 12:00', at: hoursAgo(-90) },
    ],
  },
  {
    userId: 'u12',
    areas: ['relacionamentos', 'dinheiro', 'transicao-de-vida'],
    availability: [
      { id: 'slot6', label: 'Amanhã, 20:00', at: hoursAgo(-30) },
      { id: 'slot7', label: 'Sábado, 10:00', at: hoursAgo(-110) },
    ],
  },
]

// Elegibilidade: AUVP Sempre ativo OU dentro das primeiras 8 semanas (56
// dias) de Escola AUVP. Fora disso, o agendamento redireciona para a
// página do AUVP Sempre.
export function isEligibleForConselheiros(user) {
  if (!user) return false
  if (user.auvpSempreAtivo) return true
  if (!user.escolaStartedAt) return false
  const weeksSinceStart = (Date.now() - new Date(user.escolaStartedAt).getTime()) / (7 * 86400e3)
  return weeksSinceStart <= 8
}

export const CONSELHEIRO_BOOKINGS = [
  {
    id: 'bk1',
    conselheiroId: 'u2', // ilustra reagendamento fora do fluxo principal (não usado na UI)
    status: 'cancelado',
    at: daysAgo(20),
    meetLink: null,
  },
  {
    id: 'bk2',
    conselheiroId: 'u11',
    status: 'concluido',
    at: daysAgo(9),
    meetLink: 'https://meet.google.com/xyz-mock-9021',
    csat: { rating: 5, comment: 'Conversa direta e sem rodeios, exatamente o que eu precisava antes de pedir demissão.' },
  },
  {
    id: 'bk3',
    conselheiroId: 'u10',
    status: 'concluido',
    at: daysAgo(3),
    meetLink: 'https://meet.google.com/xyz-mock-4487',
    csat: null, // aguardando avaliação CSAT
  },
  {
    id: 'bk4',
    conselheiroId: 'u12',
    status: 'agendado',
    at: hoursAgo(-30),
    meetLink: 'https://meet.google.com/xyz-mock-7734',
    csat: null,
  },
]

// ── Retrospectiva semanal ──────────────────────────────────────────────────
export const RETROSPECTIVE = {
  period: 'Semana de 29/06 a 05/07',
  stats: {
    postsRead: 47,
    upvotesReceived: 63,
    commentsMade: 12,
    newFollowers: 3,
    xpGained: 240,
  },
  bestPost: { id: 'p3', title: 'Case: como montei minha reserva de emergência em 8 meses', upvotes: 89 },
  bestAnswer: { author: 'ricardo.fiis', text: 'Resposta validada sobre IR em FIIs', upvotes: 48 },
  featuredStudent: { nickname: 'analu.invest', reason: 'Primeiro aporte internacional + 3 respostas úteis' },
  ecosystemNews: 'Nova Calculadora de Rendimentos disponível no SuperApp',
}

// ── Visitantes recentes (reciprocidade LGPD) ───────────────────────────────
export const RECENT_VISITORS = [
  { userId: 'u5', visitedAt: hoursAgo(3) },
  { userId: 'u6', visitedAt: hoursAgo(12) },
  { userId: 'u9', visitedAt: daysAgo(1.5) },
]

export const REPORT_REASONS = ['Spam', 'Ofensa', 'Informação Incorreta', 'Off-topic']

// ── Utilidades ─────────────────────────────────────────────────────────────
export function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  if (diff < 0) {
    const abs = -diff
    if (abs < 3600e3) return `em ${Math.max(1, Math.round(abs / 60e3))} min`
    if (abs < 86400e3) return `em ${Math.round(abs / 3600e3)}h`
    return `em ${Math.round(abs / 86400e3)} dias`
  }
  const min = Math.floor(diff / 60e3)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const h = Math.floor(min / 60)
  if (h < 24) return `há ${h}h`
  const d = Math.floor(h / 24)
  if (d === 1) return 'há 1 dia'
  if (d < 30) return `há ${d} dias`
  return `há ${Math.floor(d / 30)} meses`
}

export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function suggestTags(text) {
  const lower = ` ${text.toLowerCase()} `
  const found = []
  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k))) found.push(tag)
  }
  return found.slice(0, 4)
}
