const MQJ_RECENT = '_mqj_recent';
const RECENT_COUNT = 10;

class routeHelper {
  constructor(routes = []) {
    // this.moduleName = this.getModuleName(routes);
    this.routes = this.nestRoutes(routes);
    this.breads = [];
    console.log(this.routes);
  }

  // 模块名称
  getModuleName(routes) {}

  // 将path进行嵌套化
  nestRoutes(routes, parentPath = '', parent) {
    return routes.map((r) => {
      r.toLink = parentPath ? `${parentPath}/${r.path}` : '';
      r.parents = parent ? [...parent.parents, parent] : [];

      if (r.children && r.children.length > 0) {
        this.nestRoutes(r.children, r.path, r);
      }
      return r;
    });
  }

  // 生成面包屑
  getBreadcrumbs(breads, params) {
    this.breads = breads.map((item) => {
      if (item.path.indexOf(':') > -1) {
        item.showPath = item.path.replace(/\:[a-zA-Z0-9]{1,}/g, (a, b) => {
          let paramStr = item.path.substring(b);
          let [, paramName] = paramStr.split(':');

          return params[paramName];
        });
      } else {
        item.showPath = item.path;
      }
      return item;
    });
    return this.breads;
  }

  // 获取最近访问列表
  getRecentList() {
    let mqjRecent = localStorage.getItem(MQJ_RECENT);
    let o = {
      title: this.breads.map((m) => m.meta.title).join('/'),
      showPath: this.breads[this.breads.length - 1].showPath,
    };
    if (mqjRecent) {
      mqjRecent = JSON.parse(mqjRecent);
      try {
        let isset = mqjRecent.find((m) => m.showPath == o.showPath);
        if (!isset) {
          mqjRecent.unshift(o);
        }
      } catch (err) {
        throw err;
      }
    } else {
      mqjRecent = [o];
    }
    mqjRecent = mqjRecent.slice(0, RECENT_COUNT);
    localStorage.setItem(MQJ_RECENT, JSON.stringify(mqjRecent));
    return mqjRecent;
  }

  // 获取当前模块的路由
  getCurrentRoutes(moduleName) {
    console.log(moduleName);
  }
}

export default routeHelper;
