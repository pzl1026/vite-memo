const fs = require('fs-extra');
const path = require('path');
const emoji = require('node-emoji');
const chalk = require('chalk');

module.exports = function () {
  let conf;
  let err;
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
      console.log(
        path.join(process.cwd(), conf.build.outDir, '/index.html'),
        path.join(process.cwd(), '/view/index.html'),
        'path'
      );
      fs.copy(
        path.join(process.cwd(), conf.build.outDir, '/index.html'),
        path.join(process.cwd(), '/view/index.html')
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
            path.join(
              '文件拷贝：' + process.cwd(),
              conf.build.outDir,
              '/index.html'
            ) +
              ' => ' +
              path.join(process.cwd(), '/view/index.html')
          )
        );
        console.log(emoji.get(':palm_tree:') + chalk.blue('项目目录部署完成'));
      });
    },
  };
};
