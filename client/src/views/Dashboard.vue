import { ref, onMounted } from 'vue';
import { AlertTriangle, CheckCircle, Clock, BarChart3 } from 'lucide-vue-next';
import StatsCard from '../components/StatsCard.vue';
import api from '../api';

const stats = ref({
  total: 0,
  highUrgency: 0,
  negativeSentiment: 0
});

const tickets = ref([]);

const fetchStats = async () => {
  try {
    const res = await api.get('/tickets/stats');
    stats.value = res.data.data;
  } catch (error) {
    console.error("Failed to fetch stats", error);
    // Mock data for demo if backend offline
    stats.value = { total: 124, highUrgency: 12, negativeSentiment: 45 };
  }
};

const fetchTickets = async () => {
  try {
    const res = await api.get('/tickets');
    tickets.value = res.data.data;
  } catch (error) {
    console.error("Failed to fetch tickets", error);
    tickets.value = [
      { _id: 1, title: 'Sem luz na Rua A', category: 'Interrupção', priorityScore: 6, status: 'new', sentiment: 'negative' },
      { _id: 2, title: 'Cobrança indevida', category: 'Cobrança', priorityScore: 4, status: 'in_progress', sentiment: 'neutral' },
      { _id: 3, title: 'Elogio ao atendimento', category: 'Atendimento', priorityScore: 1, status: 'resolved', sentiment: 'positive' },
    ];
  }
};

onMounted(() => {
  fetchStats();
  fetchTickets();
});

const getPriorityColor = (score) => {
  if (score >= 5) return 'text-red-600 bg-red-50 ring-red-500/20';
  if (score >= 3) return 'text-orange-600 bg-orange-50 ring-orange-500/20';
  return 'text-green-600 bg-green-50 ring-green-500/20';
};
</script>

<template>
  <main class="flex-1 p-8 overflow-y-auto">
    <header class="mb-8 flex justify-between items-center">
      <div>
        <h2 class="text-3xl font-bold text-slate-900">Visão Geral</h2>
        <p class="text-slate-500">Acompanhe as métricas de atendimento em tempo real.</p>
      </div>
      <button 
        @click="$router.push('/tickets/new')"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 font-medium"
      >
        + Nova Reclamação
      </button>
    </header>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard 
        title="Total de Tickets" 
        :value="stats.total" 
        trend="+12%" 
        :trendUp="true"
        :icon="BarChart3"
        color="bg-blue-50"
      />
      <StatsCard 
        title="Alta Urgência" 
        :value="stats.highUrgency" 
        trend="+5%" 
        :trendUp="false"
        :icon="AlertTriangle"
        color="bg-red-50"
      />
      <StatsCard 
        title="Sentimento Negativo" 
        :value="stats.negativeSentiment" 
        trend="-2%" 
        :trendUp="true"
        :icon="AlertTriangle"
        color="bg-orange-50"
      />
      <StatsCard 
        title="Resolvidos Hoje" 
        value="18" 
        trend="+8%" 
        :trendUp="true"
        :icon="CheckCircle"
        color="bg-green-50"
      />
    </div>

    <!-- Recent Tickets -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 class="font-bold text-slate-800">Reclamações Recentes</h3>
        <router-link to="/tickets" class="text-blue-600 text-sm font-medium hover:underline">Ver todas</router-link>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-600">
          <thead class="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th class="px-6 py-4">Assunto</th>
              <th class="px-6 py-4">Categoria</th>
              <th class="px-6 py-4">Prioridade (Score)</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="ticket in tickets" :key="ticket._id" class="hover:bg-slate-50 transition">
              <td class="px-6 py-4 font-medium text-slate-900">{{ ticket.title }}</td>
              <td class="px-6 py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                  {{ ticket.category }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span :class="`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ring-1 ring-inset ${getPriorityColor(ticket.priorityScore)}`">
                    {{ ticket.priorityScore }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  ticket.status === 'new' ? 'bg-blue-50 text-blue-700' : 
                  ticket.status === 'resolved' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-700'
                }`">
                  {{ ticket.status === 'new' ? 'Novo' : ticket.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-slate-400 hover:text-blue-600">Editar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
