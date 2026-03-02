# FrogLog ✦ Especificações do Projeto

## Visão Geral

Aplicação web gamificada de rastreamento de hábitos e metas, inspirada em bullet journals analógicos. O usuário cria desafios com duração definida e acompanha seu progresso em um tabuleiro interativo estilo jogo de tabuleiro.

## Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS v4 + CSS customizado |
| Banco de Dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth |
| Fontes | Inter (sans) + Gochi Hand (manuscrita) via `next/font` |
| Ícones | Lucide React |
| Date Picker | react-day-picker v9 |
| Efeitos visuais | roughjs (instalado, uso opcional) |

## Identidade Visual

- **Estética**: Caderno quadriculado / bullet journal feito à mão
- **Mascote**: Sapo (`sapo.png`) — presente no logo, loading e incentivos
- **Background**: Grade quadriculada (graph paper) em tom creme
- **Cores**: Paleta verde — verde pastel (`#ceffb5`), verde médio (`#83d45a`), creme (`#faf8f5`)
- **Tipografia**: Títulos em Gochi Hand (manuscrita), corpo em Inter
- **Bordas do tabuleiro**: Caneta preta grossa (`#2a2520`) com sombra
- **Dias concluídos**: Efeito de marca-texto verde (`#ceffb5` gradiente)
- **Dias falhados**: Efeito marca-texto cinza

## Modelo de Dados

```
challenges
├── id (UUID, PK)
├── user_id (UUID, FK → auth.users)
├── title (TEXT)
├── start_date (DATE)
├── total_days (INTEGER, default 31)
├── reminders (JSONB, default '[]')
└── created_at (TIMESTAMPTZ)

rules
├── id (UUID, PK)
├── challenge_id (UUID, FK → challenges, CASCADE)
├── type ('do' | 'dont')
└── description (TEXT)

daily_logs
├── id (UUID, PK)
├── challenge_id (UUID, FK → challenges, CASCADE)
├── day_number (INTEGER)
├── log_date (DATE)
├── status ('success' | 'fail' | 'pending')
└── notes (TEXT)
```

## Segurança (RLS)

Todas as tabelas possuem Row Level Security habilitada. Políticas garantem que usuários só acessam seus próprios dados via `auth.uid() = user_id`.

## Funcionalidades Implementadas

### Autenticação
- Login e cadastro via e-mail/senha (Supabase Auth)
- Context provider (`AuthProvider`) para gerenciar sessão
- Redirecionamento automático para `/login` em páginas protegidas

### Dashboard (`/`)
- Lista de desafios do usuário com cards de preview
- Mini-tabuleiro no card mostrando progresso
- Botão para criar novo desafio
- Estado vazio quando não há desafios

### Criar Desafio (`/new`)
- Campo de título
- DatePicker customizado (react-day-picker, pt-BR)
- Presets de duração (7, 21, 31, 60, 90 dias ou personalizado)
- Campos dinâmicos para regras "Pode" e "Não Pode"
- Campo "Lembre-se" para motivações pessoais
- Auto-geração de `daily_logs` ao criar

### Detalhe do Desafio (`/challenge/[id]`)
- Header com título e botão de excluir
- Barra de stats (data início, progresso, sucessos/falhas)
- Barra de progresso visual
- Tabuleiro snake-path (boustrophedon) com 8 colunas
- Cards de regras (Pode ✓ / Não Pode ✗)
- Seção "Lembre-se" com motivações
- Modal para marcar dia (sucesso/falha + notas)
- Modal de confirmação para exclusão

### Regras de Negócio
- Não é possível marcar dias futuros
- Dias já marcados podem ser "desfeitos" via modal
- Exclusão de desafio em cascata (regras + logs)

## Estrutura de Arquivos

```
src/
├── app/
│   ├── globals.css            # Design system completo
│   ├── layout.tsx             # Layout raiz + fonts
│   ├── page.tsx               # Dashboard
│   ├── login/page.tsx         # Auth
│   ├── new/page.tsx           # Formulário de criação
│   └── challenge/[id]/page.tsx # Detalhe + tabuleiro
├── components/
│   ├── AuthProvider.tsx       # Context de autenticação
│   ├── BoardGrid.tsx          # Tabuleiro snake-path
│   ├── ChallengeCard.tsx      # Card do dashboard
│   ├── ConfirmModal.tsx       # Modal de confirmação
│   ├── DatePicker.tsx         # Date picker customizado
│   ├── DayCard.tsx            # Quadrado do dia (pen style)
│   ├── DayLogModal.tsx        # Modal de registro diário
│   ├── HandwrittenTitle.tsx   # Título manuscrito
│   ├── RuleCard.tsx           # Card de regra (do/dont)
│   └── RoughBoard.tsx         # Board com Rough.js (alternativo)
└── lib/
    ├── supabase.ts            # Cliente Supabase
    ├── types.ts               # Interfaces TypeScript
    └── api/
        ├── challenges.ts      # CRUD de desafios
        └── daily-logs.ts      # Atualização de dias
```

## Variáveis de Ambiente

```
NEXT_PUBLIC_SUPABASE_URL=<url do projeto supabase>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key do projeto>
```
