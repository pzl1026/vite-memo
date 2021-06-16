const de = require('dotenv');
const cwd = process.cwd();

const getEnvConf = () => {
  const res = de.config({ path: `${cwd}/.env` });

  if (res.error) {
    throw res.error;
  }

  return res.parsed;
};

const getViteConf = () => {
  try {
    const { viteChain } = require(`${cwd}/.evam.js`);
    if (Object.prototype.toString.call(viteChain) !== '[object Object]') {
      console.warn('viteChain配置只能为Object');
      return {};
    }
    return viteChain;
  } catch (err) {
    throw err;
  }
};

module.exports = { getEnvConf, getViteConf };
