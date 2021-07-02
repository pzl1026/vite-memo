import Banner from '@/pages/banner/index.vue';
import Info from '@/pages/info/index.vue';

export default {
  path: '/cms',
  component: Banner,
  name: 'cms',
  meta: {
    title: 'cms',
    icon: 'MailOutlined',
  },
  children: [
    {
      meta: {
        title: 'banner',
        icon: 'MailOutlined',
      },
      path: '/banner',
      component: Banner,
      children: [
        {
          meta: {
            title: 'Info',
            hidden: true,
          },
          path: '/info/:id',
          component: Info,
        },
      ],
    },
    {
      meta: {
        title: 'banner2',
        icon: 'MailOutlined',
      },
      path: '/banner2',
      component: Banner,
    },
  ],
};
