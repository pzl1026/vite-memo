const path = require('path');
const { build } = require('vite');
const vue = require('@vitejs/plugin-vue');
const legacy = require('@vitejs/plugin-legacy');

(async () => {
  await build({
    configFile: false,
    root: path.resolve(__dirname),
    build: {
      base: '/foo/',
      rollupOptions: {
        // ...
      },
    },
    plugins: [
      vue(),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
    ],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  });
})();
