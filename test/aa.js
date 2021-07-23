const fetch = require('node-fetch')
const ff = () => {
  return new Promise(async (resolve, reject) => {
    let deps = ['@evam/cli', '@evam/compiler', '@evam/components', '@evam/generator', '@evam/utils', 'generator-evam-tpl'];

    let dependencies = {};
    for (let i = 0 ; i < deps.length; i++) {
      let pkg = deps[i];
      try {
        res = await fetch(`http://registry.npmjs.org/${pkg}/latest`).then(result => {
          result.json().then(res => {
            dependencies[pkg] = `^${res.version}`;
             if (i == deps.length - 1) {
              resolve(dependencies)
            }
          })
        })
      } catch (e) {
        throw e;
      }
    }
  });
}
ff();