import axios from 'axios';
import { message } from 'ant-design-vue';

function setOption() {
  const headers = {};
  // 常量在.env文件
  headers[AUTHORIZATION] = localStorage.getItem(MQJ_TOKEN);
  headers[TOKEN] = localStorage.getItem(MQJ_TOKEN);
  headers[X_ACCOUNT_TYPE] = X_ACCOUNT_TYPE_VALUE;
  headers[BRACHNAME] = BRACHNAME_VALUE;

  function getBaseUrl(nodeEnv, prodEnv = 'st1') {
    if (nodeEnv != 'production') {
      return '/api';
    } else {
      if (prodEnv == 'prod') {
        return '//mobile-api.towngasvcc.com/';
      } else if (prodEnv == 'pre') {
        return '//pre-mobile-api.mingqijia.com/';
      } else if (prodEnv == 'st2'){
        return '//st2-api.mingqijia.com/';
      } else {
        return '//st1-api.mingqijia.com/';
      }
    }
  }

  let baseURL = '';

  try {
    baseURL = getBaseUrl(import.meta.env.MODE, PROD_ENV);
  } catch (e) {}
  const option = {
    headers,
    baseURL,
  };

  for (const key in option) {
    if (axios.defaults[key] && axios.defaults[key].constructor == Object) {
      for (const sk in option[key]) {
        axios.defaults[key][sk] = option[key][sk];
      }
    } else {
      axios.defaults[key] = option[key];
    }
  }
}

// 异常拦截处理器
const errorHandler = (error, reject) => {
  const status = error.response.status;

  switch (status) {
    case 400:
      error.message = '请求错误:400';
      break;
    case 401:
      error.message = '未授权，请登录:401';
      break;
    case 403:
      error.message = '拒绝访问:403';
      break;
    case 404:
      error.message = `请求地址出错: ${error.response.config.url}:404`;
      break;
    case 405:
      error.message = '请求方式不正确:405';
      break;
    case 408:
      error.message = '请求超时:408';
      break;
    case 500:
      error.message = '服务器内部错误:500';
      break;
    case 501:
      error.message = '服务未实现:501';
      break;
    case 502:
      error.message = '网关错误:502';
      break;
    case 503:
      error.message = '服务不可用:503';
      break;
    case 504:
      error.message = '网关超时:504';
      break;
    case 505:
      error.message = 'HTTP版本不受支持:505';
      break;
    default:
      break;
  }
  message.error(error.message);
  return reject(error);
};

function override(f) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      setOption();
      f(...args)
        .then((res) => {
          if (res.data.code == 0) {
            resolve(res.data);
          } else {
            message.error(res.data.msg);
            reject(res.data);
            if (res.data.code == 10000) {
              // location = location.pathname + '#/account/login';
            }
          }
        })
        .catch((err) => {
          errorHandler(err, reject);
        });
    });
  };
}

const r = override(axios);

const m = 'request get delete head options post put patch'.split(' ');

m.forEach((method) => {
  r[method] = override(axios[method]);
});

for (const i in axios) {
  if (m.indexOf(i) > -1) {
    r[i] = override(axios[i]);
  } else {
    r[i] = axios[i];
  }
}

export default r;
