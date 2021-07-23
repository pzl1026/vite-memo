const chalk = require('chalk');

module.exports = function () {
  let startTime;
  let endTime;
  return {
    name: 'performance', // 必须的，将会显示在 warning 和 error 中

    buildStart(options) {
      startTime = new Date().valueOf();
    },

    buildEnd() {
      endTime = new Date().valueOf();

      console.log(
        chalk.bold.yellow(`编译所使用时间：${(endTime - startTime) / 1000}s`)
      );
    },
  };
};
