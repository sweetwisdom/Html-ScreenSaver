<template>
  <div>
    <h2>这是组件自动导入测试</h2>
    <component 
      v-for="(component, index) in componentList" 
      :key="index" 
      :is="component"
    ></component>
  </div>
</template>

<script setup>
import { shallowRef } from 'vue'

const context = import.meta.webpackContext("./components", {
  recursive: false,
  regExp: /\.vue$/,
});

const componentList = shallowRef([]);

// 直接导入组件
for (const key of context.keys()) {
  const mod = context(key);
  const component = mod.default || mod;
  componentList.value.push(component);
}
</script>

<style lang="scss" scoped></style>