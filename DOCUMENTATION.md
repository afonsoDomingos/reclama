# 📖 Guia de Uso - Reclama.AI

Bem-vindo ao manual oficial da **Reclama.AI**. Este documento servirá como guia para usuários e administradores explorarem todas as funcionalidades da plataforma de gestão inteligente de reclamações.

---

## 🔑 1. Acesso ao Sistema
Para acessar a plataforma, utilize as credenciais corporativas fornecidas pela administração.

*   **URL de Acesso**: [https://reclama-murex.vercel.app](https://reclama-murex.vercel.app)
*   **Login**: Insira seu e-mail corporativo e senha na tela de login.
*   **Nota**: O sistema utiliza tokens de segurança (JWT) que mantém sua sessão ativa de forma segura.

---

## 📊 2. Dashboard (Painel de Visão Geral)
O Dashboard é a sua central de comando. Ele oferece uma visão macro da saúde do atendimento.

*   **Cards de Métricas**:
    *   **Total de Tickets**: Volume histórico de reclamações.
    *   **Alta Urgência**: Quantidade de casos que precisam de atenção imediata.
    *   **Sentimento Negativo**: Alerta sobre clientes extremamente insatisfeitos.
*   **Gráficos Interativos**:
    *   **Tendência**: Visualize se o volume de reclamações está subindo ou descendo nos últimos 7 dias.
    *   **Por Categoria**: Identifique rapidamente qual setor (Energia, Água, Cobrança) está gerando mais problemas.

---

## 🎫 3. Gestão de Reclamações (Tickets)

### 3.1 Criando uma Nova Reclamação
1. Clique no botão **"+ Nova Reclamação"** no Dashboard ou na página de Tickets.
2. Preencha o **Assunto**, **E-mail do Cliente** e a **Descrição detalhada**.
3. Ao salvar, a IA classificará automaticamente o ticket e atribuirá uma prioridade.

### 3.2 Listagem e Filtros
Na página **"Reclamações"**, você encontrará a tabela completa de chamados.
*   **Busca**: Use a barra de pesquisa para encontrar reclamações por palavras-chave no título.
*   **Prioridade (Score)**: A coluna de score (1-5) indica a gravidade. Scores elevados (4 e 5) em vermelho devem ser resolvidos primeiro.

---

## ⚙️ 4. Fluxo de Trabalho (Status)
O sistema permite a gestão do ciclo de vida da reclamação:

1.  **Novo**: Ticket recém-criado, aguardando análise.
2.  **Em Atendimento**: O técnico ou atendente já está trabalhando no caso.
3.  **Resolvido**: O problema foi solucionado e o cliente notificado.
4.  **Fechado**: Processo administrativo concluído.

*Para alterar o status, utilize o seletor na coluna da direita em cada linha da tabela.*

---

## 🤖 5. Como a "IA" nos ajuda?
A Reclama.AI utiliza lógica de processamento de linguagem natural (NLP) para:

*   **Categorização Automática**: Se um cliente escreve "Minha rua está sem luz", o sistema marca automaticamente como **Interrupção de Serviço**.
*   **Detecção de Urgência**: Palavras como "perigo", "risco", "urgente" e "explosão" elevam o Score de Prioridade instantaneamente.

---

## 🛠️ 6. Suporte Técnico e Administração
Caso encontre dificuldades:
*   **Suporte**: 0800-RECLAMA.
*   **Desenvolvimento**: O código-fonte está disponível no repositório GitHub vinculado para auditoria e expansão de funcionalidades.

---
*Reclama.AI - Transformando insatisfação em eficiência operacional.*
