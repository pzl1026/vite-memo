const Generator = require('yeoman-generator');
const figlet = require('figlet');
const path = require('path');
const emoji = require('node-emoji');
const chalk = require('chalk');

const mm = require('minimist');

module.exports = class extends Generator {
  initlializing() {
    // 由于.xxx文件不能复制过去，所以这里列举出来，然后分别处理
    this.noFindFiles = ['.env', '.evam.js', '.gitignore'];
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
    return this.prompt([
      {
        type: 'input', // 交互类型
        name: 'name',
        message: 'Your project name', // 询问信息
        default: this.appname,
      },
      {
        type: 'input', // 交互类型
        name: 'description',
        message: 'Your project description', // 询问信息
        default: this.appname,
      },
    ]).then((answers) => {
      this.answers = answers; // 存入结果，可以在后面使用
    });
  }

  writing() {
    // 我们使用 Generator 提供的 fs 模块尝试往目录中写入文件
    // this.fs.write(
    //   // destinationPath() 基于项目地址
    //   this.destinationPath('temp.txt'), // 写入地址
    //   Math.random().toString() // 写入内容
    // );

    // 模板数据上下文
    const context = {
      name: this.answers.name,
      description: this.answers.description,
      success: true,
    };

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

  // 安装依赖
  // install() {
  //   this.installDependencies({
  //     yarn: { force: true },
  //     npm: false,
  //   });
  // }

  install() {
    const projectDir = path.join(process.cwd(), this.answers.name);
    // this.spawnCommandSync('npm', ['config', 'set', 'sass_binary_site=https://npm.taobao.org/mirrors/node-sass/'], {cwd: projectDir})
    // this.spawnCommandSync(
    //   'npm',
    //   ['install', '--registry=https://registry.npm.taobao.org'],
    //   { cwd: projectDir }
    // );

    this.spawnCommandSync('yarn', { cwd: projectDir });
  }

  end() {
    console.log(emoji.get(':rocket:') + ' ' + chalk.green('项目创建完成！!'));
  }
};
