<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import { Lock, Mail, Loader2 } from 'lucide-vue-next';

const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref(null);

const handleLogin = async () => {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email: email.value,
      password: password.value
    });
    
    if (response.data.success) {
      // Store token
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect to dashboard
      router.push('/');
    }
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.error || "Falha no login. Verique suas credenciais.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Abstract Background Shapers -->
    <div class="absolute top-0 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-0 -right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]"></div>

    <div class="w-full max-w-md z-10">
      <div class="text-center mb-10">
        <h1 class="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
          Reclama.AI
        </h1>
        <p class="text-slate-400">Portal de Gestão de Reclamações</p>
      </div>

      <div class="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
        <h2 class="text-xl font-bold text-white mb-6">Acesse sua conta</h2>

        <form @submit.prevent="handleLogin" class="space-y-5">
           <!-- Alert Error -->
           <div v-if="error" class="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
            {{ error }}
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-300">Email Corporativo</label>
            <div class="relative">
              <Mail class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" :size="18" />
              <input 
                v-model="email"
                type="email" 
                required
                placeholder="nome@empresa.com"
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
              >
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium text-slate-300">Senha</label>
            <div class="relative">
              <Lock class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" :size="18" />
              <input 
                v-model="password"
                type="password" 
                required
                placeholder="••••••••"
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
              >
            </div>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Loader2 v-if="loading" class="animate-spin" :size="20" />
            {{ loading ? 'Entrando...' : 'Entrar no Sistema' }}
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-slate-800 flex justify-between text-xs text-slate-500">
          <a href="#" class="hover:text-blue-400 transition-colors">Esqueceu a senha?</a>
          <span>Suporte: 0800-RECLAMA</span>
        </div>
      </div>
      
      <p class="text-center mt-8 text-slate-600 text-sm">
        &copy; 2024 Reclama.AI - Inteligência na Gestão Essential Services
      </p>
    </div>
  </div>
</template>
