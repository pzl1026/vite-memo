import Dashboard from '@/pages/dashboard/index.vue';

export default {
  path: '/datacenter',
  component: Dashboard,
  name: 'datacenter',
  meta: {
    title: '数据中心',
    icon: 'MailOutlined',
  },
  children: [
    {
      meta: {
        title: 'dashboard',
        icon: 'MailOutlined',
      },
      path: '/dashboard',
      component: Dashboard,
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
