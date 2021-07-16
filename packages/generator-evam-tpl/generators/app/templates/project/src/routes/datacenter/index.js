import Dashboard from '@/pages/dashboard/index.vue';
import DataCenterLayout from '@/pages/dataCenterLayout/index.vue';

export default {
  path: '/datacenter',
  component: DataCenterLayout,
  name: 'datacenter',
  meta: {
    title: '数据中心',
    icon: 'MailOutlined',
  },
  children: [
    {
      name: 'dashboard',
      meta: {
        title: 'dashboard',
        icon: 'MailOutlined',
      },
      path: '/dashboard',
      component: Dashboard, //defineAsyncComponent(() => Dashboard),
      // children: [
      //   {
      //     meta: {
      //       title: 'module1children1',
      //     },
      //     path: 'module1children1',
      //     component: Info,
      //   },
      // ],
    },
  ],
};
