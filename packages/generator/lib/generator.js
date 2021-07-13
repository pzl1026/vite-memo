const execa = require('execa');

function generator(type, params) {
  // TODO
  console.log(type, params, 'jjj');
  if (type == 'init') {
    execa('yo', ['evam-tpl', '-t', 'project'], { stdio: 'inherit' });
  }

  if (type == 'createpage') {
    execa('yo', ['evam-tpl', '-t', 'page'], { stdio: 'inherit' });
  }
}

module.exports = generator;
