#!/usr/bin/env node

const mm = require('minimist');
console.log(111);
function getCommanderParams() {
  const argv = mm(process.argv);
  const commander = argv._.pop();
  delete argv._;
  return {
    commander,
    params: argv,
  };
}

const { commander, params } = getCommanderParams();

switch (commander) {
  // 生产
  case 'build':
    require('@evam/compiler')('build', params);
    break;
  // 初始化项目
  case 'init':
    require('@evam/generator')('init');
    break;
  // 创建页面
  case 'createpage':
    require('@evam/generator')('createpage', params);
    break;
  default:
    require('@evam/compiler')('dev', params);
}


