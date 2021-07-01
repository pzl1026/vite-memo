class routeHelper {
  constructor(routes = []) {
    // this.moduleName = this.getModuleName(routes);
    this.routes = this.nestRoutes(routes);
    console.log(this.routes);
  }

  // 模块名称
  getModuleName(routes) {}

  // 将path进行嵌套化
  nestRoutes(routes, parentPath = '', parent) {
    return routes.map((r) => {
      r.toLink = parentPath ? `${parentPath}/${r.path}` : '';
      r.parents = parent ? [...parent.parents, parent] : [];
      // r.breadcrumbs = this.getBreadcrumbs([...r.parents,r])

      if (r.children && r.children.length > 0) {
        this.nestRoutes(r.children, r.path, r);
      }
      return r;
    });
  }

  // 生成面包屑
  getBreadcrumbs(breads, params) {
    return breads.map((item) => {
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
  }

  // 获取当前模块的路由
  getCurrentRoutes(moduleName) {
    console.log(moduleName);
  }
}

export default routeHelper;
