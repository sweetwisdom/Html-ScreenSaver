<template>
  <transition name="modal">
    <div v-if="visible" class="modal-overlay" @click.self="handleOverlayClick">
      <div class="modal-container">
        <button class="modal-close" @click="handleClose">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <div class="modal-content">
          <slot></slot>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Modal',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    handleClose() {
      this.$emit('close');
    },
    handleOverlayClick() {
      if (this.closeOnClickOutside) {
        this.handleClose();
      }
    },
  },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 0;
}

/* 小屏幕：全屏显示 */
@media (max-width: 460px) {
  .modal-overlay {
    padding: 0;
    align-items: stretch;
  }

  .modal-container {
    width: 100vw;
    height: 100vh;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
    margin: 0;
  }

  .modal-content {
    max-height: 100vh;
  }
}

/* 大屏幕：宽度由内容决定 */
@media (min-width: 461px) {
  .modal-overlay {
    padding: 20px;
  }

  .modal-container {
    width: auto;
    min-width: 460px;
    max-width: calc(100vw - 40px);
  }
}

.modal-container {
  position: relative;
  background: #fff;
  border-radius: 2px;
  max-height: calc(100vh - 40px);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: 0;
  right: 0;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.2s;
  color: rgba(0, 0, 0, 0.45);
}

.modal-close:hover {
  background-color: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.75);
}

.modal-close:active {
  background-color: rgba(0, 0, 0, 0.1);
}

.modal-close svg {
  width: 12px;
  height: 12px;
  color: currentColor;
}

.modal-content {
  padding: 24px 0px;
  overflow-y: auto;
  flex: 1;
}

/* 过渡动画 - Ant Design 风格 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86),
    opacity 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);
}

.modal-enter .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.8);
  opacity: 0;
}
</style>

