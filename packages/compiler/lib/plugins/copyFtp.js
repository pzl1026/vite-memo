const fs = require('fs-extra');
const path = require('path');
const emoji = require('node-emoji');
const chalk = require('chalk');
const { trimQuotation } = require('../helper');

module.exports = function (envConf) {
  let conf;
  let err;

  const copySide = () => {
    let pathArr = [
      {
        entry: '../publicMain/dist/index.html',
        output: './output/view/index.html',
      },
      {
        entry: `../publicMain/dist/static/${trimQuotation(
          envConf.STATIC_DIR || ''
        )}`,
        output: `./output/static/${trimQuotation(envConf.STATIC_DIR || '')}`,
      },
    ];

    return new Promise((resolve, reject) => {
      for (let i = 0; i < pathArr.length; i++) {
        let item = pathArr[i];
        fs.copy(
          path.resolve(__dirname, item.entry),
          path.resolve(process.cwd(), item.output)
        ).then((err) => {
          if (err) {
            throw err;
            console.log(
              emoji.get(':confounded:') + chalk.red('项目目录部署失败！')
            );

            return;
          }
          console.log(
            chalk.yellow(
              '文件拷贝：' +
                path.resolve(__dirname, item.entry) +
                ' => ' +
                path.resolve(process.cwd(), item.output)
            )
          );
          if (i == pathArr.length - 1) {
            resolve();
          }
        });
      }
    });
  };
  return {
    name: 'copy-ftp', // 必须的，将会显示在 warning 和 error 中

    config(config, env) {
      conf = config;
    },

    buildEnd(error) {
      if (error) {
        err = error;
      }
    },

    closeBundle() {
      if (err) {
        return;
      }

      copySide().then((res) => {
        console.log(emoji.get(':palm_tree:') + chalk.blue('项目目录部署完成'));
      });
    },
  };
};
