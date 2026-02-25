# Plataforma Reclama

## Como rodar o projeto

### Pré-requisitos
*   Node.js instalado
*   MongoDB rodando (local ou Atlas)

### 1. Backend (API)
```bash
cd server
npm install
# Certifique-se que o MongoDB está rodando ou configure .env
npm start
```
O servidor rodará em `http://localhost:5000`.

### 2. Frontend (Dashboard)
```bash
cd client
npm install
npm run dev
```
O frontend rodará em `http://localhost:5173`.

## Funcionalidades
*   Classificação automática de tickets (Mock AI).
*   Dashboard de métricas.
*   Priorização inteligente.
