const path = require('path');
const { build } = require('vite');
const viteCompression = require('vite-plugin-compression').default;
const legacy = require('@vitejs/plugin-legacy');
const {
  getEnvConf,
  getViteConf,
  merge,
  trimQuotation,
  params2Stringify,
} = require('./helper');
const copyFtp = require('./plugins/copyFtp');
const performance = require('./plugins/performance');
const comConf = require('./common');

module.exports = async (params) => {
  const envConf = getEnvConf('build');
  const viteConf = getViteConf('build');
  const evamParams = params2Stringify(params);

  const conf = merge(
    {
      // root: path.resolve(process.cwd()),
      plugins: [
        copyFtp(),
        // legacy({
        //   targets: ['defaults', 'not IE 11'],
        // }),
        performance(),
        viteCompression(),
      ],
      define: Object.assign({}, envConf, evamParams),
      build: {
        chunkSizeWarningLimit: 2048,
        rollupOptions: {
          output: {
            manualChunks: {
              'mqj-vendor': ['vue', 'vue-router', 'axios', 'moment'],
              'mqj-ant': ['ant-design-vue'],
            },
          },
        },
        // outDir: 'output',
        assetsDir: `static/${trimQuotation(envConf.STATIC_DIR || '')}`,
      },
    },
    comConf,
    viteConf
  );

  await build(conf);
};
