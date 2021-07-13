const vue = require('@vitejs/plugin-vue');
const legacy = require('@vitejs/plugin-legacy');
const path = require('path');

module.exports = {
  root: __dirname,
  configFile: false,
  resolve: {
    alias: {
      // '@': '/src',
      '@': path.resolve(process.cwd(), 'src'),
      'ant-design-vue$': 'ant-design-vue/es/index.js',
      'vue-router$': 'vue-router/dist/vue-router.cjs.js',
      '@ant-design/icons-vue$': '@ant-design/icons-vue/lib',
      axios$: 'axios/dist/axios.js',
      // moment$: 'moment/dist/moment.js',
      vue$: 'vue/dist/vue.esm-browser.js',
    },
  },
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
};
