# Especificação Técnica - Plataforma Reclama

## 1. Visão Geral
**Nome do Produto:** Reclama  
**Objetivo:** Plataforma SaaS para classificação, priorização e gestão inteligente de reclamações para empresas de serviços essenciais (Água, Energia, Seguros, Telecom).  
**Público-Alvo:** Gestores de atendimento, equipes de suporte, ouvidorias.

## 2. Arquitetura da Solução
A plataforma adotará uma arquitetura **Modular Monolith** (para o MVP) ou **Microservices** (para escala futura), separando claramente o Frontend do Backend.

### 2.1. Diagrama de Alto Nível
```mermaid
graph TD
    Client[Clientes] -->|E-mail/Form/API| Gateway[API Gateway / Load Balancer]
    Gateway --> API[Backend API (Node.js)]
    API --> DB[(MongoDB)]
    API --> AI_Service[Serviço de IA (Classificação/NLP)]
    API --> Queue[Fila de Processamento (BullMQ/Redis)]
    Queue --> Workers[Workers de Notificação/Relatórios]
    
    Manager[Gestores] -->|HTTPS| Frontend[SPA Vue.js]
    Frontend --> API
```

## 3. Stack Tecnológica

### Frontend (Dashboard & Cliente Web)
*   **Framework:** Vue.js 3 (Composition API)
*   **Build Tool:** Vite
*   **Estilização:** TailwindCSS (Design moderno e responsivo)
*   **Gerenciamento de Estado:** Pinia
*   **Http Client:** Axios
*   **Gráficos:** Chart.js ou ApexCharts
*   **Ícones:** Lucide-vue ou Heroicons

### Backend (API REST)
*   **Runtime:** Node.js
*   **Framework:** Express.js (Estrutura robusta e simples)
*   **Banco de Dados:** MongoDB (Flexibilidade para dados não estruturados de reclamações)
*   **ODM:** Mongoose
*   **Validação:** Zod ou Joi
*   **Autenticação:** JWT (JSON Web Tokens)
*   **Uploads:** Multer (Armazenamento local ou S3)

### IA & Processamento de Dados (Sugestão de Modelo)
Para o MVP, utilizaremos bibliotecas de NLP em Node.js ou integração com APIs de LLM, evoluindo para um serviço dedicado em Python.
*   **Etapa 1 (MVP):** Integração com OpenAI API ou uso de biblioteca `natural` (Node.js) para classificação simples de palavras-chave.
*   **Etapa 2 (V1):** Microserviço Python com `Scikit-learn` ou `Hugging Face Transformers` (BERT) para análise de sentimento e classificação multiclasse.

## 4. Estrutura do Banco de Dados (MongoDB)

### Coleção: `tickets` (Reclamações)
```json
{
  "_id": "ObjectId",
  "source": "email|form|api|csv",
  "externalId": "String (opcional)",
  "customer": {
    "name": "String",
    "email": "String",
    "phone": "String"
  },
  "content": {
    "subject": "String",
    "body": "String",
    "attachments": ["String (URL)"]
  },
  "classification": {
    "category": "String (Cobrança, Interrupção, etc)",
    "sentiment": "negative|neutral|positive",
    "urgency": "high|medium|low",
    "confidenceScore": "Number (0.0 - 1.0)",
    "suggestedDepartment": "String"
  },
  "status": "new|in_progress|resolved|closed",
  "priorityScore": "Number (Calculado)",
  "assignedTo": "ObjectId (User)",
  "history": [
    {
      "action": "String",
      "timestamp": "Date",
      "user": "ObjectId"
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### Coleção: `users` (Gestores/Atendentes)
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "passwordHash": "String",
  "role": "admin|manager|agent",
  "department": "String"
}
```

## 5. Exemplo de API (Endpoints Principais)

### Tickets
*   `POST /api/v1/tickets` - Criação de nova reclamação (Webhook/Form).
*   `GET /api/v1/tickets` - Listagem com filtros (status, prioridade, data).
*   `GET /api/v1/tickets/:id` - Detalhes de uma reclamação.
*   `PATCH /api/v1/tickets/:id/classify` - Forçar reclassificação ou correção humana (Feedback Loop).
*   `PATCH /api/v1/tickets/:id/assign` - Atribuir responsável.

### Dashboard
*   `GET /api/v1/analytics/summary` - Resumo para cards (Total, Críticos, Pendentes).
*   `GET /api/v1/analytics/trends` - Dados para gráficos de linha (evolução temporal).

### Ingestão
*   `POST /api/v1/ingest/csv` - Upload de arquivo CSV para processamento em lote.

## 6. Fluxo de Dados (Data Flow)

1.  **Ingestão:** Cliente envia reclamação via Form Web.
2.  **Pré-processamento:** API recebe, valida dados básicos e salva com status `pending_analysis`.
3.  **Análise IA (Async):** 
    *   Texto é enviado para o módulo de classificação.
    *   IA retorna: Categoria (ex: Cobrança), Sentimento (ex: -0.8 Crítico), Urgência (Alta).
4.  **Priorização:** Sistema calcula `PriorityScore` basead em (Sentimento * Peso) + (Urgência * Peso).
5.  **Roteamento:** Ticket atualizado com metadados e atribuído à fila correta (ex: Financeiro).
6.  **Ação:** Gestor visualiza no Dashboard.

## 7. Roadmap de Desenvolvimento

### Fase 1: MVP (Minimum Viable Product) - Semanas 1-2
*   [x] Setup do Repositório (Monorepo).
*   [ ] Backend: CRUD de Tickets e Autenticação Básica.
*   [ ] Frontend: Layout Base (Dashboard Shell).
*   [ ] Ingestão: Formulário Web simples.
*   [ ] IA Simples: Classificação baseada em palavras-chave (Regex/Logica simples) para prova de conceito.
*   [ ] Dashboard: Lista de tickets e KPIs básicos.

### Fase 2: V1 (Release Inicial) - Semanas 3-4
*   [ ] Ingestão: Upload de CSV e Webhook para Emails.
*   [ ] IA Avançada: Integração com API de NLP real.
*   [ ] Dashboard: Gráficos interativos e filtros avançados.
*   [ ] Feedback Loop: Interface para corrigir a IA e salvar o feedback.

### Fase 3: Expansão - Mês 2+
*   [ ] Multi-tenant (SaaS real para múltiplos clientes).
*   [ ] API Pública documentada (Swagger).
*   [ ] App Mobile para gestores.

---
**Observação sobre Design:**
O Frontend deve utilizar uma paleta de cores corporativa, mas moderna (Azul Profundo, Cinza Neutro, Alertas em Laranja/Vermelho Suave). Uso de sombras sutis (Glassmorphism onde apropriado) para dar sensação de tecnologia premium.
