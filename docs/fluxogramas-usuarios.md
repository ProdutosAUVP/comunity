# Fluxogramas de Usuário — Comunidade AUVP

Diagramas dos fluxos descritos na seção **7. Fluxos de Usuário e Jornadas Principais**
da Tech Spec, no mesmo estilo do mapa de arquitetura (blocos ASCII).

---

## 7.1 Fluxos do Aluno (Interface Social)

### Fluxo 1 — Consumo e Descoberta de Conteúdo (Feed e Busca)

```
+-------------------------------------+
|  Aluno abre o SuperApp e acessa      |
|  a aba "Comunidade" (SuperAppShell)  |
+-------------------------------------+
                  |
                  v
+-------------------------------------+
|  HubPage carrega o Feed "Para Você"  |
+-------------------------------------+
                  |
                  v
+-------------------------------------+
|  Exibe TopicStories institucionais   |
|  e/ou card de Live elegível no topo  |
+-------------------------------------+
                  |
                  v
        +---------+----------+
        |  Como o aluno quer  |
        |  encontrar conteúdo?|
        +---------+----------+
                  |
     +------------+-------------+
     |            |              |
     v            v              v
+----------+ +-------------+ +----------------+
| Header   | | CategoryGrid| | SearchPage      |
| Search   | | (navegação  | | (busca avançada:|
| (busca   | | visual por  | | palavra-chave,  |
| rápida)  | | nichos)     | | Turma, Flair,   |
|          | |             | | Data)           |
+----------+ +-------------+ +----------------+
     |            |              |
     +------------+-------------+
                  |
                  v
+-------------------------------------+
|  Sistema exibe resultados            |
|  organizados por relevância e data   |
+-------------------------------------+
```

### Fluxo 2 — Criação de Postagem e Validação

```
+-------------------------------------+
|  Aluno aciona botão de nova          |
|  publicação (CreatePostPage)         |
+-------------------------------------+
                  |
                  v
+-------------------------------------+
|  RichComposer: título + texto        |
|  (+ GIF opcional via Giphy API)      |
+-------------------------------------+
                  |
                  v
+-------------------------------------+
|  CoverPicker: escolhe arte de capa   |
+-------------------------------------+
                  |
                  v
+-------------------------------------+
|  Serviço de IA sugere Tags           |
|  automáticas com base no texto       |
+-------------------------------------+
                  |
                  v
+-------------------------------------+
|  Aluno publica o conteúdo             |
|  -> passa a seguir o tópico          |
|     automaticamente                  |
+-------------------------------------+
                  |
                  v
        +---------+----------+
        | Um conselheiro       |
        | validou uma resposta |
        | como solução?        |
        +---------+----------+
             |             |
          Sim|             |Não
             v             v
+-----------------------+  +---------------------------+
| PostDetailPage destaca |  | Discussão segue na ordem   |
| a resposta (visual do  |  | cronológica normal,         |
| DS) + aviso "Ir para    |  | sem alterações              |
| solução" sob a pergunta,|  +---------------------------+
| mantendo a ordem        |
| cronológica original    |
+-----------------------+
```

### Fluxo 3 — Gestão de Perfil e Gamificação

```
+-------------------------------------+
|  Aluno acessa seu Perfil Social      |
|  (ProfilePage)                       |
+-------------------------------------+
                  |
                  v
+-------------------------------------+
|  Sistema exibe a narrativa visual    |
|  de progresso (Lore: barcos, ilhas)  |
+-------------------------------------+
                  |
                  v
+-------------------------------------+
|  Aluno acessa SettingsPage e         |
|  solicita alteração de Apelido       |
+-------------------------------------+
                  |
                  v
+-------------------------------------+
|  Serviço de IA aplica filtro prévio  |
|  (bloqueia termos políticos,         |
|  religiosos ou obscenos)             |
+-------------------------------------+
                  |
                  v
+-------------------------------------+
|  Solicitação entra na fila de        |
|  moderação (ModUsers)                |
+-------------------------------------+
                  |
                  v
+-------------------------------------+
|  Perfil completo: mostra nome legal  |
|  + apelido. Nos fóruns: apenas o     |
|  apelido aprovado                    |
+-------------------------------------+
```

### Fluxo 4 — Conexão e Mensagem Privada (DMs)

```
+-------------------------------------+
|  Aluno acessa o perfil de outro      |
|  aluno e clica em "Seguir"           |
|  (dispara push de notificação)       |
+-------------------------------------+
                  |
                  v
        +---------+----------+
        |  Houve reciprocidade |
        |  (o outro também      |
        |  segue de volta)?      |
        +---------+----------+
             |             |
          Sim|             |Não
             v             v
+-----------------------+  +---------------------------+
| Tornam-se "amigos"     |  | Segue de forma              |
| (ConnectionsPage)      |  | unidirecional, sem status   |
|                        |  | de amizade                  |
+-----------------------+  +---------------------------+
             |
             v
+-------------------------------------+
|  Aluno envia uma DM (InboxPage)      |
+-------------------------------------+
                  |
                  v
        +---------+----------+
        | Remetente é amigo ou |
        | Moderador?            |
        +---------+----------+
             |             |
          Sim|             |Não
             v             v
+-----------------------+  +---------------------------+
| DM cai na caixa        |  | DM cai na caixa             |
| "Principal"            |  | "Solicitações"              |
+-----------------------+  +---------------------------+
```

---

## 7.2 Fluxos Operacionais (Painel do Moderador)

### Fluxo Operacional A — Processamento de Denúncia Abusiva (Integração Blip)

```
+-------------------------------------+
|  Denúncia recebida entra na          |
|  Fila Pendente (ModReports)          |
+-------------------------------------+
                  |
                  v
+-------------------------------------+
|  Moderador lê o texto com termos     |
|  sensíveis destacados em amarelo     |
+-------------------------------------+
                  |
                  v
        +---------+----------+
        |  Qual ação tomar?    |
        +---------+----------+
        |          |           |
        v          v           v
+----------+ +-----------+ +----------------------+
| Manter   | | Ocultar    | | Remover              |
| (conteúdo| | (para      | | Permanentemente      |
| segue no | | análise)   | | (Soft Delete:        |
| ar)      | |            | | status:              |
|          | |            | | deleted_by_moderator)|
+----------+ +-----------+ +----------------------+
                                  |
                                  v
                    +-------------------------------+
                    |  Moderador escolhe sanção no    |
                    |  Prontuário do Aluno             |
                    |  (ex.: "Mute de 48 horas")        |
                    +-------------------------------+
                                  |
                                  v
        +-------------------------+-------------------------+
        |                         |                         |
        v                         v                         v
+----------------+   +-------------------------+   +------------------+
| Infração é      |   | Aluno recebe push       |   | Ação consolidada |
| computada no     |   | in-app + alerta via      |   | em ModAudit       |
| Prontuário       |   | Blip (WhatsApp)          |   | (log imutável)    |
+----------------+   +-------------------------+   +------------------+
```

### Fluxo Operacional B — Auditoria Antifraude de Apelido

```
+-------------------------------------+
|  Aluno solicita apelido protegido    |
|  (ex.: "Suporte_AUVP")               |
+-------------------------------------+
                  |
                  v
+-------------------------------------+
|  Solicitação fica retida na fila     |
|  de aprovação (ModUsers)             |
+-------------------------------------+
                  |
                  v
+-------------------------------------+
|  Moderador avalia a solicitação      |
+-------------------------------------+
                  |
                  v
        +---------+----------+
        |  Aprovar ou rejeitar? |
        +---------+----------+
             |             |
      Aprovar|             |Rejeitar
             v             v
+-----------------------+  +---------------------------------+
| Apelido é atualizado   |  | Rejeita com motivo (ex.:          |
| e aluno é notificado   |  | "Tentativa de se passar por       |
|                        |  | colaborador/instituição")         |
+-----------------------+  +---------------------------------+
                                          |
                                          v
                            +---------------------------------+
                            | Apelido revogado à versão          |
                            | anterior válida + flag interna     |
                            | acionada no perfil do aluno         |
                            +---------------------------------+
```
