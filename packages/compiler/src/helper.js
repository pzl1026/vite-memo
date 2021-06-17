const de = require('dotenv');
const cwd = process.cwd();

// 获取.env的通用配置
const getComEnvConf = (conf) => {
  let o = {};
  for (let [k, v] of Object.entries(conf)) {
    let key = k;
    let env = key.split('_').shift();
    if (!['DEV', 'BUILD'].includes(env)) {
      o[k] = typeof v == 'string' ? JSON.stringify(v) : v;
    }
  }

  return o;
};

// 获取.env的环境配置
const getModeConf = (conf, env) => {
  const envUpper = env.toUpperCase();
  const comConf = getComEnvConf(conf);
  let o = {};
  for (let [k, v] of Object.entries(conf)) {
    if (k.indexOf(envUpper + '_') > -1) {
      o[k] = typeof v == 'string' ? JSON.stringify(v) : v;
    }
  }
  return Object.assign({}, comConf, o);
};

// 获取当前环境的.env配置
const getEnvConf = (env) => {
  const res = de.config({ path: `${cwd}/.env` });
  if (res.error) {
    throw res.error;
  }

  return getModeConf(res.parsed, env);
};

// 获取viteChain环境通用配置
const getComViteConf = (conf) => {
  let o = {};
  for (let [k, v] of Object.entries(conf)) {
    if (!['dev', 'build'].includes(k)) {
      o[k] = v;
    }
  }

  return o;
};

// 获取viteChain环境配置
const getModeViteConf = (viteChain, env) => {
  return Object.assign({}, getComViteConf(viteChain), viteChain[env]);
};

// 获取vite配置
const getViteConf = (env) => {
  try {
    const { viteChain } = require(`${cwd}/.evam.js`);
    if (Object.prototype.toString.call(viteChain) !== '[object Object]') {
      console.warn('viteChain配置只能为Object');
      return {};
    }
    return getModeViteConf(viteChain, env);
  } catch (err) {
    throw err;
  }
};

// 获取自定义配置
const getCustomConf = () => {
  let notCustomConf = ['viteChain'];
  const allConf = require(`${cwd}/.evam.js`);
  let customConf = {};
  for (let [k, v] of Object.entries(allConf)) {
    if (!notCustomConf.includes(k)) {
      customConf[k] = v;
    }
  }
  return customConf;
};

// 将所有命令params加上 JSON.stringify
const params2Stringify = (params) => {
  for (let [k, v] of Object.entries(params)) {
    params[k] = JSON.stringify(v);
  }
};

// 去除JSON.stringify的双引号
const trimQuotation = (str) => {
  return str.replace(/(\'|\")/g, '');
};

// 处理联调环境的linkEnv
const proxyLink = (linkEnv, params) => {
  let proxyApi = linkEnv[params.e];
  let proxy = {};

  for (let [k, v] of Object.entries(proxyApi)) {
    if (typeof v == 'string') {
      proxy[k] = {
        target: v,
        changeOrigin: true,
      };
    } else {
      proxy[k] = v;
    }
  }

  return proxy;
};

// vite config merge
const merge = (...args) => {
  const confNames = [
    'resolve',
    'css',
    'json',
    'server',
    'build',
    'optimizeDeps',
    'ssr',
    'plugins',
  ];

  let config = {};

  args.forEach((item) => {
    for (let [k, v] of Object.entries(item)) {
      if (config.hasOwnProperty(k)) {
        if (confNames.includes(k)) {
          if (k == 'plugins') {
            config[k] = [...config[k], ...v];
          } else {
            config[k] = { ...config[k], ...v };
          }
        } else {
          config[k] = v;
        }
      } else {
        config[k] = v;
      }
    }
  });

  return config;
};

module.exports = {
  getEnvConf,
  getViteConf,
  merge,
  trimQuotation,
  params2Stringify,
  getCustomConf,
  proxyLink,
};
