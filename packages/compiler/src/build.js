const path = require('path');
const { build } = require('vite');
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
  params2Stringify(params);

  const conf = merge(
    {
      root: path.resolve(process.cwd()),
      plugins: [copyFtp(), performance()],
      define: Object.assign({}, envConf, params),
      build: {
        outDir: 'output',
        assetsDir: `static/${trimQuotation(envConf.STATIC_DIR)}`,
        // base: '/foo/',
        // rollupOptions: {
        // input: '/src/main.js',
        // 请确保外部化那些你的库中不需要的依赖
        // external: ['vue'],
        // output: {
        //   // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        //   globals: {
        //     vue: 'Vue',
        //   },
        // },
        // },
      },
    },
    comConf,
    viteConf
  );

  await build(conf);
};
