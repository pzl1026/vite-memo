module.exports = function complier(mode, params) {
  if (mode == 'build') {
    require('./build')(params);
  } else {
    require('./dev')(params);
  }
};
