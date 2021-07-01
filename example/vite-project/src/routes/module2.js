import Module2 from '../components/module2.vue';
import Module2Children from '../components/module2Children.vue';

export default {
  path: '/module2',
  component: Module2,
  title: 'k',
  children: [
    {
      path: 'module2children',
      component: Module2Children,
    },
  ],
};
