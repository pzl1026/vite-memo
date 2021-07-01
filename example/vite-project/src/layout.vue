<template>
  <a-layout class="mqj-layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <a-menu
        mode="inline"
        theme="dark"
        v-model:openKeys="openKeys"
        v-model:selectedKeys="selectedKeys"
      >
        <a-menu-item key="1">
          <PieChartOutlined />
          <span>Option 1</span>
        </a-menu-item>
        <a-menu-item key="2">
          <DesktopOutlined />
          <span>Option 2</span>
        </a-menu-item>
        <a-menu-item key="3">
          <InboxOutlined />
          <span>Option 3</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <MailOutlined />
              <span>Navigation One</span>
            </span>
          </template>
          <a-menu-item key="5">Option 5</a-menu-item>
          <a-menu-item key="6">Option 6</a-menu-item>
          <a-menu-item key="7">Option 7</a-menu-item>
          <a-menu-item key="8">Option 8</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <AppstoreOutlined />
              <span>Navigation Two</span>
            </span>
          </template>
          <a-menu-item key="9">Option 9</a-menu-item>
          <a-menu-item key="10">Option 10</a-menu-item>
          <a-sub-menu key="sub3" title="Submenu">
            <a-menu-item key="11">Option 11</a-menu-item>
            <a-menu-item key="12">Option 12</a-menu-item>
          </a-sub-menu>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff; padding: 0">
        <menu-unfold-outlined
          v-if="collapsed"
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
        <menu-fold-outlined
          v-else
          class="trigger"
          @click="() => (collapsed = !collapsed)"
        />
      </a-layout-header>
      <a-layout-content
        :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
        }"
      >
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
  import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    MailOutlined,
    DesktopOutlined,
    InboxOutlined,
    AppstoreOutlined,
  } from '@ant-design/icons-vue';
  import {
    defineComponent,
    ref,
    reactive,
    toRefs,
    watch,
    getCurrentInstance,
  } from 'vue';
  import {
    onBeforeRouteUpdate,
    RouterLink,
    useLink,
    RouterView,
  } from 'vue-router';

  export default defineComponent({
    props: {
      // 如果使用 TypeScript，请添加 @ts-ignore
      ...RouterLink.props,
      inactiveClass: String,
      to: Object,
    },
    components: {
      MenuFoldOutlined,
      MenuUnfoldOutlined,
      PieChartOutlined,
      MailOutlined,
      DesktopOutlined,
      InboxOutlined,
      AppstoreOutlined,
      RouterView,
    },

    setup(props, context) {
      const internalInstance = getCurrentInstance();
      const gvm = internalInstance.appContext.config.globalProperties;
      const routes = gvm.routes;
      console.log(internalInstance.appContext.config.globalProperties, '9999');
      console.log(context, 'context');

      const state = reactive({
        collapsed: false,
        selectedKeys: ['1'],
        openKeys: ['sub1'],
        preOpenKeys: ['sub1'],
        routes,
        breads: [],
      });

      watch(
        () => state.openKeys,
        (val, oldVal) => {
          state.preOpenKeys = oldVal;
        }
      );
      const toggleCollapsed = () => {
        state.collapsed = !state.collapsed;
        state.openKeys = state.collapsed ? [] : state.preOpenKeys;
      };

      const getCompletePath = (breads, params) => {
        return breads.map((item) => {
          if (item.path.indexOf(':') > -1) {
            item.showPath = item.path.replace(/\:[a-zA-Z0-9]{1,}/g, (a, b) => {
              let paramStr = item.path.substring(b);
              let [, paramName] = paramStr.split(':');

              return params[paramName];
            });
          } else {
            item.showPath = item.path;
          }
          console.log(item, 'item');
          return item;
        });
      };

      watch(
        () => gvm.$route,
        (val, oldVal) => {
          state.breads = getCompletePath(val.matched, val.params);
          console.log(state.breads, 'state.breads');
        }
      );

      return {
        ...toRefs(state),
        selectedKeys: ref(['1']),
        // collapsed: ref(false),
        toggleCollapsed,
      };
    },
  });
</script>
<style lang="scss">
  .mqj-layout {
    height: 100vh;
    .trigger {
      font-size: 18px;
      line-height: 64px;
      padding: 0 24px;
      cursor: pointer;
      transition: color 0.3s;
    }

    .trigger:hover {
      color: #1890ff;
    }

    .logo {
      height: 32px;
      background: rgba(255, 255, 255, 0.3);
      margin: 16px;
    }

    .site-layout .site-layout-background {
      background: #fff;
    }
  }
</style>
