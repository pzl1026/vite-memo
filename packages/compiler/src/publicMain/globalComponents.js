import components from '@evam/components';

// 注册组件
export default function componentsInstall(app) {
  for (let [key, name] of Object.entries(components)) {
    app.component(key, name);
  }
}
