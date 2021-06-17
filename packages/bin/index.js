#!/usr/bin/env node

const mm = require('minimist');

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
  case 'build':
    require('@vm/compiler')('build', params);
    break;
  default:
    require('@vm/compiler')('dev', params);
}
