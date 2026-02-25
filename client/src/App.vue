<script setup>
import Sidebar from './components/Sidebar.vue';
import { RouterView, useRoute } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const isLoginPage = computed(() => route.path === '/login');
</script>

<template>
  <div class="flex h-screen bg-slate-50 font-sans antialiased overflow-hidden">
    <Sidebar v-if="!isLoginPage" />
    <div class="flex-1 flex flex-col h-screen overflow-hidden relative">
       <!-- Topbar placeholder if needed -->
       <RouterView />
    </div>
  </div>
</template>
