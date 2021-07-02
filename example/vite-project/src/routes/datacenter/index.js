import Dashboard from '@/pages/dashboard/index.vue';
// import Info from '../components/info.vue';
import Module1 from '@/components/module1.vue';
import Layout from '@/widgets/layout.vue';

export default {
  path: '/datacenter',
  component: Layout,
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
      path: 'dashboard',
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
