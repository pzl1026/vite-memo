const { createServer } = require('vite');
const {
  getEnvConf,
  getViteConf,
  merge,
  params2Stringify,
} = require('./helper');
const comConf = require('./common');

module.exports = async (params) => {
  const envConf = getEnvConf('dev');
  const viteConf = getViteConf('dev');
  params2Stringify(params);

  const conf = merge(
    {
      // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
      server: {
        port: 8090,
        open: '/index.html',
      },
      define: {
        ...envConf,
        ...params,
      },
    },
    comConf,
    viteConf
  );

  const server = await createServer(conf);
  await server.listen();
};
