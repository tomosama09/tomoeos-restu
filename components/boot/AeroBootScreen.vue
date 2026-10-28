<template>
  <div id="aero-boot-screen" class="aero-boot-screen select-none">
    <div class="aero-boot-text">Starting TomoeOS</div>
    <div class="aero-boot-progress">
      <div id="boot-progress-fill" class="aero-boot-progress-fill" :style="{ width: `${progress}%` }" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  progress: number
}>()
</script>
