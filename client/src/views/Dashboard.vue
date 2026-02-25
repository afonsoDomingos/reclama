<script setup>
import { ref, onMounted } from 'vue';
import { AlertTriangle, CheckCircle, Clock, BarChart3 } from 'lucide-vue-next';
import StatsCard from '../components/StatsCard.vue';
import api from '../api';

const stats = ref({
  total: 0,
  highUrgency: 0,
  negativeSentiment: 0,
  byCategory: []
});

const tickets = ref([]);

// Chart Options
const categoryChartOptions = ref({
  chart: { type: 'donut' },
  labels: [],
  colors: ['#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'],
  legend: { position: 'bottom' },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '70%',
        labels: {
          show: true,
          total: {
            show: true,
            label: 'Total',
            formatter: (w) => stats.value.total
          }
        }
      }
    }
  }
});

const categoryChartSeries = ref([]);

const trendChartOptions = ref({
  chart: { 
    type: 'area',
    toolbar: { show: false },
    sparkline: { enabled: false }
  },
  stroke: { curve: 'smooth', width: 2 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.45,
      opacityTo: 0.05,
      stops: [20, 100, 100, 100]
    }
  },
  xaxis: {
    categories: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'],
    labels: { show: true, style: { colors: '#94a3b8' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: { show: false },
  grid: { show: false },
  colors: ['#3b82f6'],
  dataLabels: { enabled: false }
});

const trendChartSeries = ref([
  { name: 'Chamados', data: [31, 40, 28, 51, 42, 109, 100] }
]);

const fetchStats = async () => {
  try {
    const res = await api.get('/tickets/stats');
    stats.value = res.data.data;
    
    // Update category chart
    categoryChartSeries.value = stats.value.byCategory.map(c => c.count);
    categoryChartOptions.value = {
      ...categoryChartOptions.value,
      labels: stats.value.byCategory.map(c => c._id)
    };
  } catch (error) {
    console.error("Failed to fetch stats", error);
    stats.value = { total: 0, highUrgency: 0, negativeSentiment: 0, byCategory: [] };
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

const updateStatus = async (id, newStatus) => {
  try {
    await api.put(`/tickets/${id}`, { status: newStatus });
    await Promise.all([fetchTickets(), fetchStats()]); // Refresh both
  } catch (err) {
    console.error("Failed to update status", err);
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

    <!-- Charts Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
       <!-- Trend Chart -->
       <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div class="flex justify-between items-center mb-6">
            <h3 class="font-bold text-slate-800">Tendência de Atendimento</h3>
            <span class="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">Últimos 7 dias</span>
          </div>
          <apexchart height="300" :options="trendChartOptions" :series="trendChartSeries"></apexchart>
       </div>

       <!-- Category Chart -->
       <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 class="font-bold text-slate-800 mb-6">Por Categoria</h3>
          <div class="flex justify-center items-center h-[300px]">
            <apexchart width="100%" :options="categoryChartOptions" :series="categoryChartSeries"></apexchart>
          </div>
       </div>
    </div>

    <!-- Recent Tickets -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div class="p-6 border-b border-slate-100 flex justify-between items-center text-slate-800">
        <h3 class="font-bold">Reclamações Recentes</h3>
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
                  ticket.status === 'resolved' ? 'bg-green-50 text-green-700' : 
                  ticket.status === 'in_progress' ? 'bg-orange-50 text-orange-700' : 'bg-gray-100 text-gray-700'
                }`">
                  {{ 
                    ticket.status === 'new' ? 'Novo' : 
                    ticket.status === 'resolved' ? 'Resolvido' : 
                    ticket.status === 'in_progress' ? 'Em Atendimento' : ticket.status 
                  }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <select 
                  :value="ticket.status" 
                  @change="(e) => updateStatus(ticket._id, e.target.value)"
                  class="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="new">Novo</option>
                  <option value="in_progress">Atendimento</option>
                  <option value="resolved">Resolvido</option>
                  <option value="closed">Fechado</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>
</template>
