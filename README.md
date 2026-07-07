# Comunidade AUVP

Fórum social da Escola AUVP — um "Reddit institucional" construído em React a partir do documento
**"Comunidade e Serviços Transversais: Construção e Consolidação do Escopo Funcional"**, seguindo o
Design System AUVP Capital (Anek Latin / Roboto / Sora, verde institucional `#023619`, amarelo
destaque `#EFBE4F`).

Toda a aplicação é funcional com **dados mockados** (sem backend): votos, comentários aninhados,
criação de posts, DMs, denúncias, moderação e gamificação funcionam em memória durante a sessão.

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento em http://localhost:5173
npm run build    # build de produção em dist/
npm run preview  # serve o build localmente
```

## Deploy no GitHub Pages

O repositório já está preparado:

- `vite.config.js` usa `base: './'` (caminhos relativos, funciona em `https://<user>.github.io/<repo>/`);
- o roteamento usa `HashRouter`, evitando 404 em refresh/links diretos no Pages;
- o workflow `.github/workflows/deploy.yml` builda e publica no Pages a cada push em `main`/`master`.

Para ativar: em **Settings → Pages**, selecione **Source: GitHub Actions**.

## Funcionalidades (mapeadas do documento de escopo)

### Área do aluno
| Tela | Rota | Destaques |
| --- | --- | --- |
| Hub da Comunidade | `/` | Tópicos como **stories** (bolinhas estilo Instagram) no topo, feeds "Para Você" / "Seguindo" / "Atualizações AUVP", card de live elegível, modal de live ao vivo, botão flutuante de novo post |
| Busca Avançada | `/busca` | Busca textual global + filtros em pílulas (tags, turma, flair, data), resultados categorizados por tipo (usuários/tópicos) |
| Detalhe da Postagem | `/post/:id` | Árvore de comentários aninhados (estilo Reddit), votos, "Marcar solução", selo "Resposta Validada", aviso "Esta pergunta já foi respondida" + "Ir para solução", sugestão automática de aula da Escola AUVP, denúncia |
| Criação de Conteúdo | `/novo-post` | Pergunta + detalhamento, seletor de flairs (Dúvida, Case, Meme, Live, Aula, Conquista), tags com autocomplete e **sugestão automática por texto (IA simulada)** |
| Perfil do Usuário | `/perfil/:id` | Abas "Sobre mim" / "Atividades", **Lore de barcos e ilhas** com progresso, badges + loja de personalização, Tag de Turma, visitantes recentes (reciprocidade), alocação PIAR opcional |
| Conexões | `/conexoes` | Amigos (follow mútuo), solicitações pendentes, link de indicação |
| Inbox (DMs) | `/mensagens` | Caixas Principal/Solicitações (like Instagram), moderador cai direto na Principal, limite anti-spam diário, bloqueio e denúncia |
| Central de Notificações | `/notificacoes` | Lista cronológica por tipo, atalho para configurações |
| Configurações | `/configuracoes` | Apelido editável com histórico moderável, notificações granulares + "não perturbe" + frequência, Modo Anônimo, opt-in do PIAR |
| Retrospectiva | `/retrospectiva` | Tela cheia estilo "Stories" com destaques da semana |

### Dashboard do Moderador (dark mode nativo obrigatório)
| Tela | Rota | Destaques |
| --- | --- | --- |
| M-01 Visão Geral | `/moderacao` | Contadores de urgência em vermelho (clicáveis → fila filtrada), gráfico denúncias vs. postagens (desktop), SLA de 1ª resposta, últimas 5 ações |
| M-02 Denúncias | `/moderacao/denuncias` | Abas Pendentes/Em Análise/Resolvidas/Arquivadas, termos sensíveis realçados em amarelo, "Ver contexto original", ações Manter/Ocultar/Remover/Escalar, pop-up de sanção, **ações em massa** (checkboxes) |
| M-03 Usuários | `/moderacao/usuarios` | Fila de aprovação de apelidos (nome legal, alerta de termo protegido), Prontuário Social com linha do tempo auditável, sanções (Advertência, Mute 24h/7d, Ban) |
| M-04 Conselheiros | `/moderacao/conselheiros` | Dúvidas sem resposta há +12h, "Notificar Conselheiro Especialista", painel de performance, chancela de Respostas Validadas |
| M-05 Auditoria | `/moderacao/auditoria` | Log técnico cronológico com filtros por moderador/aluno/ação e botão **Desfazer** (admin sênior); soft delete preservado |

## Stack

- React 18 + Vite 5
- React Router 6 (HashRouter)
- Tailwind CSS 3 (tokens do Design System AUVP Capital)
- Phosphor Icons
- Estado global em Context API (`src/context/AppContext.jsx`)
- Dados mockados em `src/data/mock.js`
