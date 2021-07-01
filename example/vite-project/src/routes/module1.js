import Module1 from '../components/module1.vue';
import Module1Children from '../components/module1Children.vue';
import Info from '../components/info.vue';

export default {
  path: '/module1',
  component: Module1,
  meta: {
    title: 'module1',
  },
  children: [
    {
      meta: {
        title: 'module1children',
      },
      path: 'module1children',
      component: Module1Children,
    },
    {
      meta: {
        title: 'info',
      },
      path: 'info/:id',
      component: Info,
    },
  ],
};
