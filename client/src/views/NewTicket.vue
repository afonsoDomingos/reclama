<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { ArrowLeft, Save, Loader2 } from 'lucide-vue-next';

const router = useRouter();

const form = ref({
  title: '',
  description: '',
  contactEmail: '',
  source: 'form'
});

const loading = ref(false);
const error = ref(null);

const submitTicket = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    // In production change URL to env variable
    const response = await axios.post('http://localhost:5000/api/tickets', form.value);
    
    if (response.data.success) {
      // Navigate back to ticket list or dashboard
      router.push('/tickets');
    }
  } catch (err) {
    console.error(err);
    error.value = "Falha ao criar reclamação. Tente novamente.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <main class="flex-1 p-8 overflow-y-auto h-full flex flex-col items-center">
    <div class="w-full max-w-2xl">
      <!-- Header -->
      <header class="mb-8 flex items-center gap-4">
        <button @click="router.back()" class="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h2 class="text-3xl font-bold text-slate-900">Nova Reclamação</h2>
          <p class="text-slate-500">Preencha os dados abaixo para classificar o problema.</p>
        </div>
      </header>

      <!-- Form Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        <form @submit.prevent="submitTicket" class="space-y-6">
          
          <!-- Alert Error -->
          <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
            {{ error }}
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Assunto / O Problema</label>
            <input 
              v-model="form.title"
              type="text" 
              required
              placeholder="Ex: Sem luz na rua principal" 
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Descrição Detalhada</label>
            <textarea 
              v-model="form.description"
              required
              rows="5"
              placeholder="Descreva o que aconteceu, quando começou e detalhes adicionais..." 
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            ></textarea>
            <p class="text-xs text-slate-400 mt-2">Nossa IA analisará este texto para categorizar e definir a prioridade.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Email para Contato (Opcional)</label>
            <input 
              v-model="form.contactEmail"
              type="email" 
              placeholder="cliente@exemplo.com" 
              class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            >
          </div>

          <div class="pt-4 flex items-center justify-end gap-3">
            <button 
              type="button" 
              @click="router.back()"
              class="px-6 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              :disabled="loading"
              class="px-8 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="loading" :size="20" class="animate-spin" />
              <Save v-else :size="20" />
              {{ loading ? 'Analisando...' : 'Registrar Reclamação' }}
            </button>
          </div>

        </form>
      </div>
    </div>
  </main>
</template>
