const { createServer } = require('vite');
const vue = require('@vitejs/plugin-vue');
const legacy = require('@vitejs/plugin-legacy');

;(async () => {
  const server = await createServer({
    // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    configFile: false,
    root: __dirname,
    server: {
      port: 1337
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
  })
  await server.listen()
})()
