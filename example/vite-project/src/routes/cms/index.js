import Banner from '@/pages/banner/index.vue';
import Layout from '@/widgets/layout.vue';

export default {
  path: '/cms',
  component: Layout,
  name: 'cms',
  meta: {
    title: 'CMS',
    icon: 'MailOutlined',
  },
  children: [
    {
      meta: {
        title: 'banner',
        icon: 'MailOutlined',
      },
      path: 'banner',
      component: Banner,
    },
  ],
};
