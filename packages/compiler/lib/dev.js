const { createServer } = require('vite');
const {
  getEnvConf,
  getViteConf,
  merge,
  params2Stringify,
  getCustomConf,
  proxyLink,
} = require('./helper');
const comConf = require('./common');

module.exports = async (params) => {
  const envConf = getEnvConf('dev');
  const viteConf = getViteConf('dev');
  const evamParams = params2Stringify(params);

  const customConf = getCustomConf();
  const proxy = proxyLink(customConf.linkEnv, params);

  const conf = merge(
    {
      // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
      server: {
        port: 8080,
        open: '/index.html',
        proxy,
      },
      define: {
        ...envConf,
        ...evamParams,
      },
    },
    comConf,
    viteConf
  );

  const server = await createServer(conf);
  await server.listen();
};
