const { createServer } = require('vite');
const vue = require('@vitejs/plugin-vue');
const legacy = require('@vitejs/plugin-legacy');
const path = require('path');

(async () => {
  const server = await createServer({
    // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    configFile: false,
    root: path.resolve(),
    server: {
      port: 1337,
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
  });
  await server.listen();
})();
