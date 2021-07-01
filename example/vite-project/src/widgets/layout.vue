<template>
  <a-layout class="mqj-layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <MenuList :menu-list="menuList" />
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
      <a-row class="page-row">
        <a-col :span="12">
          <a-breadcrumb>
            <a-breadcrumb-item v-for="(bread, k) in breads" :key="bread.path">
              <router-link v-if="k < breads.length - 1" :to="bread.showPath">
                {{ bread.meta.title }}
              </router-link>
              <span v-else> {{ bread.meta.title }} </span>
            </a-breadcrumb-item>
          </a-breadcrumb>
        </a-col>
      </a-row>
      <a-layout-content class="page-content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
  import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue';
  import {
    defineComponent,
    ref,
    reactive,
    toRefs,
    watch,
    getCurrentInstance,
  } from 'vue';
  // import {
  //   RouterLink,
  //   RouterView,
  // } from 'vue-router';
  import MenuList from './menuList.vue';

  export default defineComponent({
    props: {
      // // 如果使用 TypeScript，请添加 @ts-ignore
      // ...RouterLink.props,
      // inactiveClass: String,
      to: Object,
    },
    components: {
      MenuFoldOutlined,
      MenuUnfoldOutlined,
      MenuList,
    },

    setup(props, context) {
      const internalInstance = getCurrentInstance();
      const gvm = internalInstance.appContext.config.globalProperties;
      const menuList = gvm.routes;

      const state = reactive({
        collapsed: false,
        menuList,
        breads: [],
      });

      const toggleCollapsed = () => {
        state.collapsed = !state.collapsed;
        // state.openKeys = state.collapsed ? [] : state.preOpenKeys;
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
          return item;
        });
      };

      watch(
        () => gvm.$route,
        (val, oldVal) => {
          state.breads = getCompletePath(val.matched, val.params);
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
    .page-row {
      padding: 16px;
    }
    .page-content {
      margin: 0 16px 24px;
      padding: 24px;
      background: #fff;
      min-height: 280px;
    }
  }
</style>
