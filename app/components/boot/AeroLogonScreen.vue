<template>
  <div id="aero-logon-screen" class="aero-logon-screen select-none" @keydown.enter="handleLogin">
    <!-- User Card -->
    <div class="aero-logon-card">
      <div class="aero-logon-user">
        <img
          class="aero-logon-avatar"
          src="/icons/logon-avatar.svg"
          alt="User Avatar"
        />
        <div class="aero-logon-user-copy">
          <div class="aero-logon-name">User</div>
          <div class="aero-logon-tagline">Welcome</div>
        </div>
      </div>
      <button
        id="logon-enter-btn"
        type="button"
        class="aero-jelly-btn aero-logon-enter cursor-pointer active:scale-95 transition-transform"
        @click="handleLogin"
      >
        Login
      </button>
    </div>

    <!-- Logon Footer -->
    <div class="aero-logon-footer">
      <div class="aero-logon-brand">TomoeOS</div>
      <button
        type="button"
        class="aero-logon-power cursor-pointer hover:bg-blue-900/60"
        title="Shut down"
        @click="$emit('shutdown')"
      >
        ⏻
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

const emit = defineEmits<{
  (e: 'login'): void
  (e: 'shutdown'): void
}>()

const handleLogin = () => {
  emit('login')
}

const onKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleLogin()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', onKeyDown)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', onKeyDown)
  }
})
</script>
