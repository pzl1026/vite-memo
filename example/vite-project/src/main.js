import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import Antd from 'ant-design-vue';
import routesList from './routes/index.js';
import App from './App.vue';
import RouterHelper from './util/routeHelper';
import 'ant-design-vue/dist/antd.css';

const rh = new RouterHelper(routesList);
console.log(rh.routes, 'rh.routes');
const router = createRouter({
  history: createWebHashHistory(),
  routes: rh.routes, // `routes: routes` 的缩写
});

const app = createApp(App);
app.config.globalProperties = { rh };
app.use(router);
app.use(Antd);

app.mount('#app');
