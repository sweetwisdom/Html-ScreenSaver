<template>

  <div class="content">
    <AIChatMain class="ai-chat-main" />
    <ServicePortal class="service-portal" />
  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import AIChatMain from './AIChatMain.vue';
import ServicePortal from './ServicePortal.vue';

export default Vue.extend({
  name: 'App',
  components: {
    AIChatMain,
    ServicePortal,
  },
});
</script>

<style scoped>
.content {
  height: 100%;
  width: 100%;
  display: flex;
  height: 100%;
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
</style>
