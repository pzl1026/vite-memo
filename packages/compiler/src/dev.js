const { createServer } = require('vite');
const vue = require('@vitejs/plugin-vue');
const legacy = require('@vitejs/plugin-legacy');
const path = require('path');
const { getEnvConf, getViteConf } = require('./helper');

(async () => {
  const envConf = getEnvConf();
  const viteConf = getViteConf();
  console.log(viteConf, 'viteConf');
  const server = await createServer(
    Object.assign(
      {},
      {
        // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
        configFile: false,
        server: {
          port: 8090,
          open: '/index.html',
        },
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
        define: {
          ...envConf,
        },
      },
      viteConf
    )
  );
  await server.listen();
})();
