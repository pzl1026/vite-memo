import Module2 from '../components/module2.vue';
import Module2Children from '../components/module2Children.vue';

export default {
  path: '/module2',
  component: Module2,
  name: 'module2',
  meta: {
    title: 'module2',
    icon: 'PieChartOutlined',
  },
  children: [
    {
      meta: {
        title: 'module2children',
      },
      path: 'module2children',
      component: Module2Children,
    },
  ],
};
