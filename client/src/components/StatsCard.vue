<script setup>
defineProps({
  title: String,
  value: String | Number,
  trend: String,
  trendUp: Boolean,
  icon: Object,
  color: String
});
</script>

<template>
  <div class="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div class="flex justify-between items-start mb-4">
      <div :class="`p-3 rounded-xl ${color} bg-opacity-10 text-${color.split('-')[1]}-600`">
        <component :is="icon" :size="24" :class="`text-${color.split('-')[1]}-600`" />
      </div>
      <span :class="`text-sm font-medium ${trendUp ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`">
        {{ trend }}
        <span v-if="trendUp">↑</span><span v-else>↓</span>
      </span>
    </div>
    <h3 class="text-slate-500 text-sm font-medium mb-1">{{ title }}</h3>
    <p class="text-2xl font-bold text-slate-900">{{ value }}</p>
  </div>
</template>
