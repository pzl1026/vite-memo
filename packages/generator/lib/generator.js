const execa = require('execa');
const fetch = require('node-fetch');

// 处理依赖
let getEvamDeps = () => {
  return new Promise(async (resolve, reject) => {
    let deps = [
      { cli_v: '@evam/cli' },
      { compiler_v: '@evam/compiler' },
      { components_v: '@evam/components' },
      { generator_v: '@evam/generator' },
      { utils_v: '@evam/utils' },
      { get_v: 'generator-evam-tpl' },
    ];

    let depsVersion = {};

    for (let i = 0; i < deps.length; i++) {
      let pkg = Object.values(deps[i])[0];
      let context = Object.keys(deps[i])[0];
      try {
        fetch(`http://registry.npmjs.org/${pkg}/latest`).then((result) => {
          result.json().then((res) => {
            depsVersion[context] = `^${res.version}`;
          });
        });
      } catch (e) {
        throw e;
      }
    }

    let timer = setInterval(() => {
      if (Object.keys(depsVersion).length == deps.length) {
        clearInterval(timer);
        resolve(depsVersion);
      }
    }, 60);
  });
};

function generator(type, params) {
  // TODO
  console.log(type, params, 'jjj');
  if (type == 'init') {
    getEvamDeps().then((res) => {
      execa(require.resolve('yo/lib/cli', yoPath), ['evam-tpl', '-t', 'project', '-v', JSON.stringify(res)], {
        stdio: 'inherit',
      });
    });
  }

  if (type == 'createpage') {
    execa(require.resolve('yo/lib/cli', yoPath), ['evam-tpl', '-t', 'page'], {
      stdio: 'inherit',
    });
  }
}

module.exports = generator;
