<template>
  <div
    class="aero-peek-card absolute bottom-12 mb-1 p-2 rounded-lg bg-gradient-to-b from-sky-100/90 to-blue-200/90 border border-white/80 shadow-2xl backdrop-blur-md pointer-events-none z-50 flex flex-col gap-1.5 w-48 transition-all duration-150 animate-fade-in"
  >
    <div class="flex items-center gap-1.5 border-b border-blue-300/40 pb-1">
      <img :src="icon" alt="" class="w-3.5 h-3.5 shrink-0" />
      <span class="text-[11px] font-bold text-slate-800 truncate">{{ title }}</span>
    </div>
    <!-- Miniature preview window silhouette -->
    <div class="h-24 bg-white/70 rounded border border-blue-200/50 flex flex-col items-center justify-center p-2 text-center overflow-hidden">
      <img :src="icon" alt="" class="w-8 h-8 opacity-40 mb-1" />
      <span class="text-[10px] text-slate-500 font-medium truncate max-w-full">Active Window Preview</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  icon: string
}>()
</script>
