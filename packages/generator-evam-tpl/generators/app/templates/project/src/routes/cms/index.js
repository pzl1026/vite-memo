import Banner from '@/pages/banner/index.vue';
import Banner2 from '@/pages/banner2/index.vue';
import BannerList from '@/pages/bannerList/index.vue';
import Info from '@/pages/info/index.vue';
import ModuleLayout from '@/widgets/moduleLayout.vue';

export default {
  path: '/cms',
  component: ModuleLayout,
  name: 'cms',
  meta: {
    title: 'cms',
    icon: 'MailOutlined',
  },
  children: [
    {
      name: 'banner',
      meta: {
        title: 'banner',
        icon: 'MailOutlined',
      },
      path: '/banner',
      // component: {
      //   template: () => null,
      // },
      children: [
        {
          name: 'BannerList',
          meta: {
            title: 'BannerList',
          },
          path: '/list',
          component: BannerList,
          children: [
            {
              name: 'info',
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
    },
    {
      name: 'banner2',
      meta: {
        title: 'banner2',
        icon: 'MailOutlined',
      },
      path: '/banner2',
      component: Banner2,
    },
  ],
};
