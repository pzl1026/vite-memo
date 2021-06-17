const vue = require('@vitejs/plugin-vue');
const legacy = require('@vitejs/plugin-legacy');

module.exports = {
  configFile: false,
  resolve: {
    alias: {
      '@': '/src',
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
