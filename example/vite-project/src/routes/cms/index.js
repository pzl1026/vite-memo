import Banner from '@/pages/banner/index.vue';
import Info from '@/pages/info/index.vue';

export default {
  path: '/cms',
  component: Banner,
  name: 'cms',
  meta: {
    title: 'CMS',
    icon: 'MailOutlined',
  },
  children: [
    {
      meta: {
        title: 'Banner',
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
  ],
};
