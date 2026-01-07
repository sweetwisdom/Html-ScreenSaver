查看项目结构，确认是否已使用 vue-router，并了解 pages 目录结构：


[6 tools called]


可以使用 `import.meta.webpackContext` 创建自动路由注册插件。以下是实现方案：

## 实现方案

### 1. 安装 vue-router

```bash
pnpm add vue-router@3
```

### 2. 创建自动路由注册插件

创建一个工具文件来自动扫描并注册路由：

```javascript
// src/utils/auto-router.js

/**
 * 自动路由注册插件
 * 使用 import.meta.webpackContext 扫描 pages 目录，自动生成路由配置
 */
export function createAutoRouter(basePath = '../pages') {
  // 扫描 pages 目录下的所有 App.vue 文件
  const context = import.meta.webpackContext(basePath, {
    recursive: true,
    regExp: /\/App\.vue$/,
  });

  const routes = [];

  // 遍历所有匹配的文件
  for (const key of context.keys()) {
    // 解析路径，例如: ./ai-chat/App.vue -> /ai-chat
    const pathMatch = key.match(/\.\/([^/]+)\/App\.vue$/);
    if (pathMatch) {
      const pageName = pathMatch[1];
      const routePath = `/${pageName}`;
      
      // 导入组件
      const component = () => context(key);
      
      routes.push({
        path: routePath,
        name: pageName,
        component: component().then(mod => mod.default || mod),
      });
    }
  }

  // 添加根路径重定向（可选）
  routes.push({
    path: '/',
    redirect: '/index', // 重定向到首页
  });

  return routes;
}
```

### 3. 更完善的版本（支持嵌套路由和配置）

```javascript
// src/utils/auto-router.js

/**
 * 自动路由注册插件 - 增强版
 * 支持：
 * - 自动扫描 pages 目录
 * - 支持嵌套路由
 * - 支持路由元信息配置
 */
export function createAutoRouter(options = {}) {
  const {
    basePath = '../pages',
    routePrefix = '',
    defaultRoute = '/index',
    excludePages = [],
  } = options;

  // 扫描所有 App.vue 文件
  const context = import.meta.webpackContext(basePath, {
    recursive: true,
    regExp: /\/App\.vue$/,
  });

  const routes = [];
  const routeMap = new Map();

  // 第一遍：收集所有路由
  for (const key of context.keys()) {
    // 解析路径: ./ai-chat/App.vue 或 ./nested/parent/child/App.vue
    const pathMatch = key.match(/\.\/(.+)\/App\.vue$/);
    if (!pathMatch) continue;

    const fullPath = pathMatch[1];
    const segments = fullPath.split('/');
    const pageName = segments[segments.length - 1];

    // 排除指定页面
    if (excludePages.includes(pageName)) continue;

    // 构建路由路径
    const routePath = routePrefix + '/' + fullPath.replace(/\//g, '/');

    // 导入组件
    const loadComponent = () => {
      const mod = context(key);
      return Promise.resolve(mod.default || mod);
    };

    routeMap.set(fullPath, {
      path: routePath,
      name: pageName,
      fullPath,
      segments,
      loadComponent,
    });
  }

  // 第二遍：构建路由树（支持嵌套）
  const processedRoutes = new Set();

  function buildRoute(fullPath) {
    if (processedRoutes.has(fullPath)) {
      return routeMap.get(fullPath);
    }

    const route = routeMap.get(fullPath);
    if (!route) return null;

    processedRoutes.add(fullPath);

    // 检查是否有父路由
    if (route.segments.length > 1) {
      const parentPath = route.segments.slice(0, -1).join('/');
      const parentRoute = buildRoute(parentPath);

      if (parentRoute) {
        // 添加到父路由的 children
        if (!parentRoute.children) {
          parentRoute.children = [];
        }
        parentRoute.children.push({
          path: route.segments[route.segments.length - 1],
          name: route.name,
          component: route.loadComponent,
        });
        return null; // 不添加到根路由
      }
    }

    // 根级路由
    return {
      path: route.path,
      name: route.name,
      component: route.loadComponent,
    };
  }

  // 构建所有路由
  for (const fullPath of routeMap.keys()) {
    const route = buildRoute(fullPath);
    if (route) {
      routes.push(route);
    }
  }

  // 添加默认路由
  if (defaultRoute) {
    routes.push({
      path: '/',
      redirect: defaultRoute,
    });
  }

  // 添加 404 路由
  routes.push({
    path: '*',
    component: () => import('../pages/404/App.vue').catch(() => ({
      template: '<div>404 - Page Not Found</div>',
    })),
  });

  return routes;
}
```

### 4. 在入口文件中使用

```javascript
// src/router/index.js
import Vue from 'vue';
import VueRouter from 'vue-router';
import { createAutoRouter } from '@/utils/auto-router';

Vue.use(VueRouter);

// 自动生成路由配置
const routes = createAutoRouter({
  basePath: '../pages',
  routePrefix: '',
  defaultRoute: '/index',
  excludePages: ['404'], // 排除某些页面
});

const router = new VueRouter({
  mode: 'history', // 或 'hash'
  base: process.env.BASE_URL,
  routes,
});

export default router;
```

### 5. 在 App.vue 中使用路由

```vue
<!-- src/App.vue -->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
});
</script>
```

### 6. 主入口文件

```javascript
// src/main.js
import Vue from 'vue';
import App from './App.vue';
import router from './router';

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
```

## 特性说明

1. 自动扫描：使用 `import.meta.webpackContext` 自动扫描 `pages` 目录
2. 路径映射：目录名自动映射为路由路径（如 `ai-chat` → `/ai-chat`）
3. 懒加载：组件按需加载
4. 可配置：支持排除页面、默认路由等配置
5. 扩展性：可扩展支持路由元信息、权限控制等

## 注意事项

1. 当前项目是 MPA，如果改为 SPA 需要调整构建配置
2. 路由路径基于目录结构，确保目录命名规范
3. 每个页面目录需要有 `App.vue` 文件
4. 如需嵌套路由，确保目录结构对应

需要我帮你实现具体某个部分吗？