<template>
  <div class="content">
    <h1>Rsbuild with Vue</h1>
    <p>Start building amazing things with Rsbuild.{{url}}</p>
    <p>count is {{ count }}</p>
    <div>
      <button @click="count++">add</button>
      <button @click="count--">reduce</button>
    </div>
    <p>
      <a href="/about">to about</a>
    </p>
  </div>
</template>

<script lang="ts">
const url =process.env.VUE_APP_BASE_API
console.log('⚠️:[ url ]🎈：', url)
import Vue from 'vue'
export default Vue.extend({
  name: 'App',
  data() {
    return {
      count: 0,
      url: process.env.VUE_APP_BASE_API,
    }
  },
})
</script>

<style scoped>
.content {
  display: flex;
  min-height: 100vh;
  line-height: 1.1;
  text-align: center;
  flex-direction: column;
  justify-content: center;
}

.content h1 {
  font-size: 3.6rem;
  font-weight: 700;
}

.content p {
  font-size: 1.2rem;
  font-weight: 400;
  opacity: 0.5;
}
</style>
