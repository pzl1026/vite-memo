import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
const legacy = require('@vitejs/plugin-legacy');
console.log(22333)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),     
    legacy({
    targets: ['defaults', 'not IE 11'],
  }),],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  resolve: {
    alias: {
      '@': '/src',
      // '@': path.resolve(process.cwd(), 'src'),
      // 'ant-design-vue$': 'ant-design-vue/es/index.js',
      'vue-router$': 'vue-router/dist/vue-router.cjs.js',
      '@ant-design/icons-vue$': '@ant-design/icons-vue/lib',
      axios$: 'axios/dist/axios.js',
      // moment$: 'moment/dist/moment.js',
      vue$: 'vue/dist/vue.esm-browser.js',
    },
  },
})
