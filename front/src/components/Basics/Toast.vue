<script setup>
import { useToastStore } from '@/stores/toastStore';

const toastStore = useToastStore();

</script>

<template>
    <div class="toast-container">
      <transition-group name="toast-fade">
          <div v-for="toast in toastStore.toasts" :key="toast.id" :class="['toast-item', toast.type]" @click="toastStore.removeToast(toast.id)">
              <div class="toast-icon">
                  <i v-if="toast.type === 'success'" class="icon-check">✓</i>
                  <i v-else-if="toast.type === 'error'" class="icon-error">✕</i>
                  <i v-else class="icon-info">ℹ</i>
              </div>
              <div class="toast-message">{{ toast.message }}</div>
          </div>
      </transition-group>
    </div>
</template>

<style scoped lang="scss">
.toast-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast-item {
  pointer-events: auto;
  min-width: 250px;
  padding: 12px 20px;
  border-radius: 12px;
  background: rgba(30, 30, 45, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

  &.success {
    border-left: 4px solid #4ade80;
  }

  &.error {
    border-left: 4px solid #f87171;
  }

  &.info {
    border-left: 4px solid #60a5fa;
  }

  &:hover {
    transform: scale(1.02);
    background: rgba(40, 40, 60, 0.95);
  }
}

.toast-icon {
  font-weight: bold;
  font-size: 1.2rem;
  
  .icon-check { color: #4ade80; }
  .icon-error { color: #f87171; }
  .icon-info { color: #60a5fa; }
}

.toast-message {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Animations */
.toast-fade-enter-from {
  opacity: 0;
  transform: translateX(-50px);
}
.toast-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
