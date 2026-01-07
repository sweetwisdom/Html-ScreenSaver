**是的，可以，而且在你当前技术栈下这是一个“非常合适”的方案。**
在 **Vue 2.7 + Rsbuild（Rspack）** 中，用 `import.meta.webpackContext` 来 **自动注册 `pages` 目录下的路由**，是完全可行、工程上也说得通的做法。

下面我分 **可行性判断 → 设计建议 → 直接可用的示例代码 → 注意事项（非常重要）** 四部分说清楚。

---

## 一、可行性结论（先给你定心丸）

在 Rsbuild 中：

* ✅ `import.meta.webpackContext` **等价于** `require.context`
* ✅ 可以在 **构建期静态扫描 `pages` 目录**
* ✅ 非常适合 **自动路由注册**
* ✅ 对 Vue Router 3（Vue 2.7）完全友好

👉 本质上你做的是一个 **“约定式路由”插件**

---

## 二、推荐的路由约定（强烈建议）

假设你的目录结构是：

```text
src/pages/
├─ index.vue            → /
├─ login.vue            → /login
├─ user/
│  ├─ index.vue         → /user
│  └─ profile.vue       → /user/profile
```

约定规则：

| 文件          | 路由        |
| ----------- | --------- |
| `index.vue` | `/` 或父路径  |
| 其他 `.vue`   | 文件名即 path |
| 目录结构        | 对应 URL 层级 |

---

## 三、直接可用的实现（不封装、插件级）

### 1️⃣ `src/router/autoRoutes.js`

```js
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const context = import.meta.webpackContext('../pages', {
  recursive: true,
  regExp: /\.vue$/,
})

const routes = []

for (const key of context.keys()) {
  const mod = context(key)

  // key 示例：./user/profile.vue
  let path = key
    .replace('./', '')
    .replace('.vue', '')
    .replace(/\/index$/, '') // index.vue 特殊处理

  path = '/' + path

  routes.push({
    path,
    name: path === '/' ? 'index' : path.slice(1).replace(/\//g, '-'),
    component: mod.default || mod,
  })
}
```

---

### 2️⃣ 创建 Router 实例

```js
export default new Router({
  mode: 'history',
  routes,
})
```

---

## 四、你这个方案为什么“很对路”

结合你过往习惯（你之前做 modal / components 自动注册也很多）：

### ✅ 优点

* 和 `require.context` 心智完全一致
* 不需要写一堆 `routes.js`
* 新增页面 = 新增文件
* 非常适合 **中后台 / 工具型项目**

---

## 五、⚠️ 必须知道的几个关键注意点

### 1️⃣ 这是 **Rspack 特有能力**

```txt
✔ Rsbuild + Rspack：OK
✘ 纯 Vite：不支持
```

> 所以你这个“插件”应当明确标注：
> **Rspack-only**

---

### 2️⃣ 不适合复杂路由（这些要手写）

以下情况建议 **手动补充**：

* 路由 meta（auth、keepAlive）
* 动态参数 `/user/:id`
* 重定向
* 嵌套路由 children

👉 实际工程建议：
**自动路由 + 手写补充 routes**

---

### 3️⃣ 路由顺序问题（很重要）

`webpackContext.keys()` 的顺序是 **文件顺序，不保证 path 优先级**

例如：

```txt
/user/:id
/user/list
```

你需要 **手动排序**

```js
routes.sort((a, b) => a.path.length - b.path.length)
```

---

## 六、一个更工程化的小升级（可选）

你可以支持 `route.js` 旁路配置：

```text
pages/
└─ user/
   ├─ index.vue
   └─ route.js
```

```js
export default {
  meta: { requiresAuth: true }
}
```

然后在扫描时合并：

```js
const routeConfig = context('./user/route.js')?.default
Object.assign(route, routeConfig)
```

---

## 七、一句工程级结论

> **在 Vue 2.7 + Rsbuild 中，
> `import.meta.webpackContext` 是实现“约定式路由”的最佳过渡方案。**

等哪天你真的切到 **Vite**，再整体替换为 `import.meta.glob` 即可。

---

如果你愿意，下一步我可以帮你：

* 🧩 支持 `layout.vue` 自动嵌套
* 🔐 自动注入 `meta.auth`
* 🧪 给你一个 **pages → routes 映射测试脚本**
* 🔁 未来 **Rspack → Vite** 的一键迁移方案

你直接说想做哪一步。
