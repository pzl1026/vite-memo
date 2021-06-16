const path = require('path');
require('@babel/polyfill');
const { build } = require('vite');
const vue = require('@vitejs/plugin-vue');
const legacy = require('@vitejs/plugin-legacy');
const { getEnvConf } = require('./helper');
const copyFtp = require('./plugins/copyFtp');
const performance = require('./plugins/performance');

(async () => {
  const envConf = getEnvConf();
  await build({
    configFile: false,
    root: path.resolve(process.cwd()),
    build: {
      // outDir: `output/${envConf.STATIC_DIR}`,
      outDir: 'output',
      assetsDir: `static/${envConf.STATIC_DIR}`,
      // base: '/foo/',
      // rollupOptions: {
      //   // 请确保外部化那些你的库中不需要的依赖
      //   external: ['vue'],
      //   output: {
      //     // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
      //     globals: {
      //       vue: 'Vue',
      //     },
      //   },
      // },
    },
    plugins: [
      vue(),
      legacy({
        targets: ['defaults', 'not IE 11'],
      }),
      copyFtp(),
      performance(),
    ],
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    define: {
      ...envConf,
    },
  });
})();
