import Module1 from '../components/module1.vue';
import Module1Children from '../components/module1Children.vue';
import Info from '../components/info.vue';

export default {
  path: '/module1',
  component: Module1,
  name: 'module1',
  meta: {
    title: 'module1',
    icon: 'MailOutlined',
  },
  children: [
    {
      meta: {
        title: 'module1children',
      },
      path: 'module1children',
      component: Module1Children,
      children: [
        {
          meta: {
            title: 'module1children1',
          },
          path: 'module1children1',
          component: Info,
        },
      ],
    },
    {
      meta: {
        title: 'info',
        hidden: true,
      },
      path: 'info/:id',
      component: Info,
    },
  ],
};
