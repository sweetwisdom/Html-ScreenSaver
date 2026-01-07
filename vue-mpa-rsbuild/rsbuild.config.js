import { defineConfig, loadEnv } from '@rsbuild/core'
import { pluginVue2 } from '@rsbuild/plugin-vue2'
import { pluginSass } from '@rsbuild/plugin-sass'
import { pluginBabel } from '@rsbuild/plugin-babel'
import { pluginNodePolyfill } from '@rsbuild/plugin-node-polyfill'
import path from 'node:path'
import { glob } from 'glob'
const { publicVars } = loadEnv({ prefixes: ['VUE_APP_'] })
export default defineConfig(async () => {
  const entryFiles = await glob('./src/pages/**/index.{ts,tsx,js,jsx}')
  const templates = Object.fromEntries(
    entryFiles.map(file => {
      const entryName = path.basename(path.dirname(file))
      return [entryName, './' + file]
    })
  )
  console.log('⚠️:[ entryFiles ]🎈：', entryFiles)

  return {
    root: './',
    source: {
      entry: {
        ...templates,
      },
      define: publicVars
    },

    server: {
      host: 'localhost',
      open: false,
    },
    html: {
      inject: 'body',
    },
    output: {
      assetPrefix: './',
      polyfill: 'usage',
      inlineScripts: true,
      inlineStyles: true,
    },
    performance: {
      chunkSplit: {
        strategy: 'all-in-one',
      },
    },
    plugins: [pluginVue2(), pluginSass(), pluginBabel(), pluginNodePolyfill()],
  }
})
