<template>
  <div ref="contentRef" class="content">
    <AIChatMain class="ai-chat-main" />
    <ServicePortal v-if="isDesktop" class="service-portal" />
    <Modal :visible="modalVisible" @close="handleCloseModal">
      <ServicePortal />
    </Modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import AIChatMain from './AIChatMain.vue';
import ServicePortal from './ServicePortal.vue';
import Modal from './components/Modal.vue';
import { useResponsiveLayout } from './composables/useResponsiveLayout';
import store from './store';

export default Vue.extend({
  name: 'App',
  components: {
    AIChatMain,
    ServicePortal,
    Modal,
  },
  data() {
    return {
      isDesktop: false,
      modalVisible: false,
      layoutHook: null as ReturnType<typeof useResponsiveLayout> | null,
    };
  },
  mounted() {
    // 初始化响应式布局
    this.$nextTick(() => {
      const contentEl = this.$refs.contentRef as HTMLElement;
      if (contentEl) {
        this.layoutHook = useResponsiveLayout(contentEl, 1250);

        // 监听布局变化
        this.$watch(
          () => this.layoutHook?.state.isDesktop,
          (newVal) => {
            this.isDesktop = newVal || false;
            // 如果是桌面模式，关闭弹框
            if (newVal && this.modalVisible) {
              this.modalVisible = false;
              store.closeModal();
            }
          },
          { immediate: true }
        );
      }
    });

    // 监听 store 中的弹框状态
    this.$watch(
      () => store.getState().modalVisible,
      (newVal) => {
        this.modalVisible = newVal;
      },
      { immediate: true }
    );
  },
  beforeDestroy() {
    if (this.layoutHook) {
      this.layoutHook.cleanup();
    }
  },
  provide() {
    return {
      isDesktop: () => this.isDesktop,
      openModal: () => {
        if (!this.isDesktop) {
          store.openModal();
        }
      },
    };
  },
  methods: {
    handleCloseModal() {
      store.closeModal();
    },
  },
});
</script>

<style scoped>
.content {
  height: 100%;
  width: 100%;
  display: flex;
  gap: 40px;
  align-items: start;
  padding: 20px;
  overflow: hidden;
}

.ai-chat-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  overflow: auto;
}

.service-portal {
  width: 100%;
  max-width: 480px;

  height: 100%;
  overflow: auto;
}
</style>
