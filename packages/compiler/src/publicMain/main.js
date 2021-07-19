import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import Antd from 'ant-design-vue';
import routesList from '@/routes/index.js';
import App from '@/widgets/layout.vue';
import RouterHelper from '@evam/utils/lib/routeHelper';
import 'ant-design-vue/dist/antd.css';
import componentsInstall from './globalComponents';

const rh = new RouterHelper(routesList);

const router = createRouter({
  history: createWebHashHistory(),
  routes: rh.routes, // `routes: routes` 的缩写
});

const app = createApp(App);
componentsInstall(app);
app.config.globalProperties = { rh };
app.use(router);
app.use(Antd);

app.mount('#app');
