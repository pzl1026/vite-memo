const vue = require('@vitejs/plugin-vue');
const legacy = require('@vitejs/plugin-legacy');

module.exports = {
  configFile: false,
  resolve: {
    alias: {
      '@': '/src',
      // vue: 'vue/dist/vue.esm-browser.js',
      // axios: 'axios/dist/axios.js',
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
