const fs = require('fs-extra');
const path = require('path');

module.exports = function () {
  let conf;
  return {
    name: 'render-html', // 必须的，将会显示在 warning 和 error 中

    transformIndexHtml(html) {
      return html.replace(
        /<title>(.*?)<\/title>/,
        `<title>Title replaced!</title>`
      );
    },
  };
};
