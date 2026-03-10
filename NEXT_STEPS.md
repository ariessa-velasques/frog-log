# FrogLog ✦ Próximos Passos

Roadmap para tornar o projeto robusto e pronto para produção.

---

## 🔴 Prioridade Alta (Essencial)

### 1. Middleware de Autenticação
- [ ] Criar `src/middleware.ts` com proteção de rotas server-side
- [ ] Redirecionar `/login` → `/` se já autenticado
- [ ] Redirecionar rotas protegidas → `/login` se não autenticado
- [ ] Usar `@supabase/ssr` com `createServerClient` para cookies

### 2. Validação de Dados
- [ ] Adicionar validação com **Zod** nos formulários (título, datas, regras)
- [ ] Validação server-side nas API calls
- [ ] Sanitizar inputs contra XSS

### 3. Tratamento de Erros
- [ ] Criar componente `ErrorBoundary` global
- [ ] Toasts/notificações para feedback de ações (sucesso, erro)
- [ ] Páginas de erro customizadas (404, 500)
- [ ] Retry automático em falhas de rede

### 4. Loading States
- [ ] Skeleton loaders nos cards do dashboard
- [ ] Skeleton loader no tabuleiro
- [ ] Indicador de loading no DatePicker
- [ ] Optimistic updates ao marcar dias

---

## 🟡 Prioridade Média (Qualidade)

### 5. Responsividade Mobile
- [ ] Tabuleiro com scroll horizontal suave em telas pequenas
- [ ] Reduzir colunas automaticamente (8 → 5 → 4) conforme viewport
- [ ] Bottom sheet ao invés de modal em mobile para registro de dia
- [ ] Testar em dispositivos reais (iOS Safari, Android Chrome)

### 6. Acessibilidade (a11y)
- [ ] Navegação por teclado no tabuleiro (arrow keys)
- [ ] `aria-labels` descritivos em todos os botões
- [ ] Anúncios de screen reader ao marcar dias
- [ ] Contraste adequado (WCAG AA) em todos os estados
- [ ] Focus trap nos modais

### 7. Performance
- [ ] Implementar `React.memo` nos DayCards (evitar re-renders)
- [ ] Lazy loading do DatePicker e modais
- [ ] Cursor-based pagination se muitos desafios
- [ ] Prefetch de dados com `useSWR` ou React Query
- [ ] Otimizar imagens com `next/image`

### 8. Testes
- [ ] Testes unitários com **Vitest** (utils, regras de negócio)
- [ ] Testes de componente com **Testing Library**
- [ ] Testes E2E com **Playwright** (fluxo completo de criação/marcação)
- [ ] Coverage mínimo de 70% em lib/api

---

## 🟢 Prioridade Baixa (Features)

### 9. Edição de Desafio
- [ ] Tela de edição do desafio (título, regras, lembretes)
- [ ] Adicionar/remover regras após criação
- [ ] Editar lembretes

### 10. Estatísticas e Insights
- [ ] Página de estatísticas por desafio (streak, melhor semana)
- [ ] Gráfico de progresso semanal (barras ou linha)
- [ ] Streak counter (dias consecutivos de sucesso)
- [ ] Exportar dados como CSV/PDF

### 11. Gamificação Avançada
- [ ] Sistema de conquistas/badges (primeiro desafio, 7 dias seguidos, etc.)
- [ ] Nível do usuário baseado em XP acumulado
- [ ] Animações comemorativas ao completar desafio (confetti)
- [ ] Frases motivacionais aleatórias no dashboard

### 12. Social / Compartilhamento
- [ ] Compartilhar progresso como imagem (screenshot do tabuleiro)
- [ ] Link público do desafio (read-only)
- [ ] Perfil público com desafios concluídos

### 13. PWA e Offline
- [ ] Service worker para funcionamento offline
- [ ] Cache de dados com sync quando voltar online
- [ ] Push notifications para lembrar de marcar o dia
- [ ] Instalável como app (manifest.json)

### 14. Deploy e Infra
- [ ] Deploy no Vercel com variáveis de ambiente
- [ ] GitHub Actions para CI/CD (lint + build + testes)
- [ ] Monitoramento de erros com Sentry
- [ ] Analytics com Vercel Analytics ou Plausible

---

## 🛠️ Dívidas Técnicas Atuais

| Item | Descrição |
|------|-----------|
| Middleware | Proteção de rotas é apenas client-side |
| Error handling | Erros de API são logados no console, sem UI |
| Validação | Formulários sem validação robusta |
| `RoughBoard.tsx` | Componente criado mas não utilizado (alternativa ao BoardGrid) |
| `.env.local` | Sem `.env.local.example` para referência |
| Testes | Zero testes automatizados |
