<template>
  <div>
    <h2>这是组件自动导入测试</h2>
    <!-- 依次渲染组件 -->
     <div v-for="component in components" :key="component">
      <p>component is: {{ component }}</p>
      <component :is="component"></component>
    </div>
  </div>
</template>
<script>
const context = import.meta.webpackContext("./components", {
  recursive: false,
  regExp: /\.vue$/,
});
const modules = {};
const components = [];

for (const key of context.keys()) {
  const name = key.replace("./", "").replace(".vue", "");
  const mod = context(key);
  console.log('⚠️:[ mod ]🎈：', mod)
  modules[name] = mod.default || mod;
  components.push(name);
}
export default {
  data() {
    return {
      components,
    };
  },
  components: {
    ...modules,
  },
  computed: {},
  props: {},
  watch: {},
  mounted() {},
  created() {},

  methods: {},
};
</script>

<style lang="scss" scoped></style>
