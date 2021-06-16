console.log('complier');

module.exports = function complier(mode) {
  if (mode == 'build') {
    require('./src/build');
  } else {
    require('./src/dev');
  }
};
