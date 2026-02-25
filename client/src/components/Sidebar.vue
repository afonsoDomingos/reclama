<script setup>
import { 
  LayoutDashboard, 
  Ticket, 
  Users, 
  Settings,
  LogOut 
} from 'lucide-vue-next';
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted } from 'vue';

const router = useRouter();
const route = useRoute();

const user = ref({
  name: 'Usuário',
  role: 'Gestor'
});

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    user.value = JSON.parse(storedUser);
  }
});

const menuItems = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Reclamações', path: '/tickets', icon: Ticket },
  { name: 'Equipe', path: '/team', icon: Users },
  { name: 'Configurações', path: '/settings', icon: Settings },
];

const navigate = (path) => {
  router.push(path);
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};

const isActive = (path) => {
  if (path === '/' && route.path === '/') return true;
  if (path !== '/' && route.path.startsWith(path)) return true;
  return false;
};
</script>

<template>
  <div class="h-screen w-64 bg-slate-900 text-white flex flex-col shrink-0 transition-all duration-300">
    <div class="p-6">
      <h1 class="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer" @click="navigate('/')">
        Reclama.AI
      </h1>
    </div>

    <nav class="flex-1 px-4 space-y-2">
      <a 
        v-for="item in menuItems" 
        :key="item.path"
        href="#" 
        @click.prevent="navigate(item.path)"
        :class="[
          'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden',
          isActive(item.path) 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40' 
            : 'text-slate-400 hover:text-white hover:bg-slate-800'
        ]"
      >
        <component :is="item.icon" :size="20" :class="isActive(item.path) ? 'text-white' : 'group-hover:text-blue-400 transition-colors'" />
        <span class="font-medium z-10 relative">{{ item.name }}</span>
        
        <!-- Hover Effect Beam -->
        <div v-if="!isActive(item.path)" class="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </a>
    </nav>

    <div class="p-4 border-t border-slate-800 space-y-2">
      <div class="flex items-center gap-3 w-full p-2 rounded-lg">
        <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-xs font-bold ring-2 ring-slate-900 ring-offset-2 ring-offset-blue-500">
          {{ user.name.substring(0, 2).toUpperCase() }}
        </div>
        <div class="text-left flex-1 overflow-hidden">
          <p class="text-sm font-medium text-white truncate">{{ user.name }}</p>
          <p class="text-xs text-slate-500 capitalize">{{ user.role }}</p>
        </div>
      </div>
      
      <button 
        @click="handleLogout"
        class="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
      >
        <LogOut :size="20" class="group-hover:rotate-12 transition-transform" />
        <span class="font-medium">Sair</span>
      </button>
    </div>
  </div>
</template>
