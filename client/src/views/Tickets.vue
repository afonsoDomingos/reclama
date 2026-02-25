<script setup>
import { ref } from 'vue';
import { Filter, Search, Plus } from 'lucide-vue-next';

import { onMounted } from 'vue';
import api from '../api';

const tickets = ref([]);

const fetchTickets = async () => {
    try {
        const res = await api.get('/tickets');
        tickets.value = res.data.data;
    } catch (e) {
        console.error(e);
    }
};

onMounted(() => {
    fetchTickets();
});

const getPriorityColor = (score) => {
  if (score >= 5) return 'text-red-600 bg-red-50 ring-red-500/20';
  if (score >= 3) return 'text-orange-600 bg-orange-50 ring-orange-500/20';
  return 'text-green-600 bg-green-50 ring-green-500/20';
};
</script>

<template>
  <main class="flex-1 p-8 overflow-y-auto h-full">
    <header class="mb-8 flex justify-between items-center">
      <div>
        <h2 class="text-3xl font-bold text-slate-900">Todas as Reclamações</h2>
        <p class="text-slate-500">Gerencie e classifique os tickets de atendimento.</p>
      </div>
      <button @click="$router.push('/tickets/new')" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 font-medium flex items-center gap-2">
        <Plus :size="18" />
        Nova Reclamação
      </button>
    </header>

    <!-- Filters & Search -->
    <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex gap-4 mb-6">
      <div class="relative flex-1">
        <Search :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Buscar por protocolo, cliente ou assunto..." 
          class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
        >
      </div>
      <button class="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm font-medium transition-colors">
        <Filter :size="18" />
        Filtros
      </button>
    </div>

    <!-- Tickets Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-100">
            <tr>
              <th class="px-6 py-4">Assunto / Cliente</th>
              <th class="px-6 py-4">Categoria</th>
              <th class="px-6 py-4 text-center">Score (IA)</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Data</th>
              <th class="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="ticket in tickets" :key="ticket._id" class="hover:bg-slate-50 transition-colors group cursor-pointer">
              <td class="px-6 py-4">
                <div class="font-medium text-slate-900">{{ ticket.title }}</div>
                <div class="text-xs text-slate-400">#{{ ticket._id }} • Cliente Anônimo</div>
              </td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  {{ ticket.category }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <div class="flex flex-col items-center">
                   <span :class="`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ring-1 ring-inset ${getPriorityColor(ticket.priorityScore)}`">
                    {{ ticket.priorityScore }}
                  </span>
                  <span class="text-[10px] text-slate-400 mt-1 uppercase">{{ ticket.sentiment }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit ${
                  ticket.status === 'new' ? 'bg-blue-50 text-blue-700' : 
                  ticket.status === 'resolved' ? 'bg-green-50 text-green-700' : 
                  ticket.status === 'closed' ? 'bg-slate-100 text-slate-500' : 'bg-orange-50 text-orange-700'
                }`">
                  <span class="w-1.5 h-1.5 rounded-full mr-1.5" :class="{
                    'bg-blue-600': ticket.status === 'new',
                    'bg-green-600': ticket.status === 'resolved',
                    'bg-slate-500': ticket.status === 'closed',
                    'bg-orange-600': ticket.status === 'in_progress',
                  }"></span>
                  {{ 
                    ticket.status === 'new' ? 'Novo' : 
                    ticket.status === 'resolved' ? 'Resolvido' : 
                    ticket.status === 'closed' ? 'Fechado' : 'Em Análise' 
                  }}
                </span>
              </td>
              <td class="px-6 py-4 text-slate-400 text-xs">
                {{ new Date(ticket.createdAt).toLocaleDateString() }}
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-slate-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-all">
                   Editar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Pagination (Static) -->
      <div class="px-6 py-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
        <span>Mostrando 1-5 de 24 resultados</span>
        <div class="flex gap-2">
          <button class="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50" disabled>Anterior</button>
          <button class="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">Próximo</button>
        </div>
      </div>
    </div>
  </main>
</template>
