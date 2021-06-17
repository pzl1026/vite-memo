module.exports = function complier(mode, params) {
  if (mode == 'build') {
    require('./src/build')(params);
  } else {
    require('./src/dev')(params);
  }
};
