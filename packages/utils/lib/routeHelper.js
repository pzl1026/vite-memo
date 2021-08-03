const MQJ_RECENT = '_mqj_recent';
const RECENT_COUNT = 10;
import routesList from '@/routes';
class routeHelper {
  constructor(routes = []) {
    this.originRoutes = routesList;
    this.currModule = {};
    this.modules = [];
    this.routes = [];
    this.getMenus(routesList);
    this.menus = routesList;
    this.breads = [];
    this.nestRoutes(routes);
    this.getModules(routes);
  }

  getMenus(routes, parentPath = '') {
    routes.forEach(item => {
      item.toLink = parentPath ? `${parentPath}${item.path}` : item.path;
      if (item.children && item.children.length > 0) {
        this.getMenus(item.children, item.toLink);
      }
    });
  }

  // 模块名称
  getCurrentModuleName(route) {
    return route.matched[0].meta.moduleName;
  }

  // 获取模块
  getModules(routes) {
    this.modules = routes.map((m) => {
      return {
        path: m.path,
        name: m.name,
        meta: m.meta,
      };
    });
  }

  // 将path进行嵌套化
  nestRoutes(routes, parentPath = '', parent, moduleName) {
    routes.forEach((r) => {
      r.toLink = parentPath ? `${parentPath}${r.path}` : r.path;
      r.parents = parent ? [...parent.parents, parent] : [];
      r.meta.moduleName = moduleName || r.name;
      r.path = r.toLink;
      if (!r.component) {
        r.component = {
          template: () => null,
        };
        r.meta.beardDisable = true;
      }

      this.routes.push(r);

      if (r.children && r.children.length > 0) {
        this.nestRoutes(r.children, r.toLink, r, moduleName || r.name);
        // delete r.children;
      }
    });
  }

  // 生成面包屑
  getBreadcrumbs(breads, params) {
    let currentRoute = this.routes.find((m) => breads[0].path == m.path);
    if (!currentRoute) {
      console.error(`当前路由¥${breads[0].path}不存在！！`);
      return;
    }
    let parents = [...currentRoute.parents];
    parents.shift(); //去除当前模块
    breads = [...parents, ...breads];

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
