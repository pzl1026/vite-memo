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
  return commander;
}

const { commander, params } = getCommanderParams();

switch (commander) {
  case 'build':
    require('@vm/compiler')('build');
    break;
  default:
    require('@vm/compiler')();
}
