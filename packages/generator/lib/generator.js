const execa = require('execa');

function generator(type, params) {
  // TODO
  console.log(type, params, 'jjj');
  if (type == 'init') {
    console.log(2222);
    execa('yo', ['evam-tpl'], { stdio: 'inherit' });
  }

  if (type == 'createpage') {
  }
}

module.exports = generator;
