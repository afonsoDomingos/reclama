<script setup>
import Sidebar from './components/Sidebar.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <div class="flex h-screen bg-slate-50 font-sans antialiased overflow-hidden">
    <Sidebar />
    <div class="flex-1 flex flex-col h-screen overflow-hidden relative">
       <!-- Topbar placeholder if needed -->
       <RouterView />
    </div>
  </div>
</template>
