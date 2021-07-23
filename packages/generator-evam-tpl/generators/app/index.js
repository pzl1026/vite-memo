const Generator = require('yeoman-generator');
const figlet = require('figlet');
const path = require('path');
const emoji = require('node-emoji');
const chalk = require('chalk');
const fs = require('fs');
const fetch = require('node-fetch');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.type = opts.t;

  }
  initializing() {
    // 由于.xxx文件不能复制过去，所以这里列举出来，然后分别处理
    this.noFindFiles = ['.env', '.evam.js'];
  }
  // add your own methods
  ddLogo() {
    figlet.text(
      'HELLO MQJ EVAM!!',
      {
        font: 'Ghost',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true,
      },
      function (err, data) {
        if (err) {
          console.log('Something went wrong...');
          console.dir(err);
          return;
        }
        console.log(data);
      }
    );
  }

  // 在此方法中可以调用父类的 prompt() 方法与用户进行命令行询问
  prompting() {
    return this.type == 'project'
      ? this.prompt([
          {
            type: 'input', // 交互类型
            name: 'name',
            message: '项目名称', // 询问信息
            default: this.appname,
          },
          {
            type: 'input', // 交互类型
            name: 'description',
            message: '项目描述', // 询问信息
            default: this.appname,
          },
        ]).then((answers) => {
          this.answers = answers; // 存入结果，可以在后面使用
        })
      : this.prompt([
          {
            type: 'rawlist', // 交互类型
            name: 'pageType',
            choices: [
              'common',
              'form',
              'info',
              'searchTable',
              'searchTableModal',
            ],
            message: '你想创建哪种页面？', // 询问信息
          },
          {
            type: 'input', // 交互类型
            name: 'pageName',
            message: '页面目录名称？', // 询问信息
            default: 'testPage_' + parseInt(Math.random() * 100000),
          },
        ]).then((answers) => {
          this.answers = answers; // 存入结果，可以在后面使用
        });
  }

  writing() {
    if (this.type == 'page') {
      this._createPage();
    } else {
      this._createProject();
    }
  }
  
  // 处理依赖
  _createProject() {
    // 模板数据上下文
    const context = {
      name: this.answers.name,
      description: this.answers.description,
      success: true,
      // deps: `{ \"execa\": \"^5.1.1\"}`
    };

    // if (this.type != 'page') {
    //   const deps = await this._getEvamDeps();
    //   console.log(deps, 'ddd')
    //   context.deps = deps;
    // }

    // // 模版文件路径，默认指向 templates
    const tempPath = this.templatePath('project');
    // // 输出目标路径
    const output = this.destinationPath(this.answers.name);

    this.fs.copyTpl(tempPath, output, context);

   

    for (let f of this.noFindFiles) {
      this.fs.copyTpl(
        this.templatePath(`project/${f}`),
        this.destinationPath(`${this.answers.name}/${f}`),
        context
      );
    }
  }

  _createPage() {
    // 模版文件路径，默认指向 templates
    const tempPath = this.templatePath(`pages/${this.answers.pageType}`);
    // 输出目标路径
    const output = this.destinationPath(`src/pages/${this.answers.pageName}`);

    this.fs.copyTpl(tempPath, output, { success: true });
  }

  // 安装依赖
  // install() {
  //   this.installDependencies({
  //     yarn: { force: true },
  //     npm: false,
  //   });
  // }

  // 处理依赖
  _getEvamDeps() {
    // "@evam/cli": "^1.0.12-alpha.0",
    // "@evam/compiler": "^1.0.11-alpha.0",
    // "@evam/components": "^1.0.9-alpha.0",
    // "@evam/generator": "^1.0.9-alpha.0",
    // "@evam/utils": "^1.0.9-alpha.0",
    // "generator-evam-tpl": "^1.0.11-alpha.0",

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
                 console.log(dependencies, 'dependencies')
                resolve(JSON.stringify(dependencies));
              }
            })
          })
        } catch (e) {
          throw e;
        }
      }
    });
  }

  install() {
    if (this.type == 'project') {
      const projectDir = path.join(process.cwd(), this.answers.name);
      this.spawnCommandSync('yarn', [], { cwd: projectDir });
    }
  }

  end() {
    if (this.type == 'project') {
      console.log(
        emoji.get(':rocket:') +
          ' ' +
          chalk.green(`${this.answers.name} 项目创建完成！`)
      );
      fs.rename(
        path.join(process.cwd(), this.answers.name + '/gitignore'),
        path.join(process.cwd(), this.answers.name + '/.gitignore'),
        (err) => {
          if (err) {
            throw err;
          }
        }
      );
    } else {
      console.log(
        emoji.get(':tada:') +
          ' ' +
          chalk.green(`${this.answers.pageName} 页面创建完成！`)
      );
    }
  }
};
