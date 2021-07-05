<template>
  <template v-if="isLogin">
    <Login />
  </template>
  <a-layout class="mqj-layout" v-else>
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo" />
      <MenuList :menu-list="menuList" :selectedKeys="selectedKeys" />
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="mqj-layout-header">
        <a-row type="flex" justify="space-between">
          <a-col :span="1">
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
          </a-col>
          <a-col :span="22">
            <a-menu
              mode="horizontal"
              theme="dark"
              v-model:selectedKeys="moduleKey"
            >
              <a-menu-item v-for="m in modules" :key="m.name">
                <router-link :to="m.path">
                  {{ m.meta.title }}
                </router-link>
              </a-menu-item>
            </a-menu>
          </a-col>
          <a-col :span="1" class="mqj-avatar">
            <a-dropdown>
              <a href="javascript:;">
                <a-avatar shape="square" size="large">
                  <template #icon><UserOutlined /></template>
                </a-avatar>
              </a>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a href="javascript:;">退出登录</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </a-col>
        </a-row>
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
        <a-col :span="12" class="mqj-recent">
          <a-dropdown>
            <a class="ant-dropdown-link" @click.prevent>
              最近访问
              <DownOutlined />
            </a>
            <template #overlay>
              <a-menu>
                <a-menu-item v-for="link in recentList" :key="link.showPath">
                  <router-link
                    :to="link.showPath"
                    style="display: inline-block; width: 100%"
                  >
                    {{ link.title }}
                  </router-link>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </a-col>
      </a-row>
      <a-layout-content class="page-content">
        <router-view></router-view>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
  import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    DownOutlined,
  } from '@ant-design/icons-vue';
  import {
    defineComponent,
    ref,
    reactive,
    toRefs,
    watch,
    getCurrentInstance,
  } from 'vue';
  import MenuList from './components/menuList.vue';
  import Login from './components/login.vue';

  export default defineComponent({
    components: {
      MenuFoldOutlined,
      MenuUnfoldOutlined,
      UserOutlined,
      DownOutlined,
      MenuList,
      Login,
    },

    setup(props, context) {
      const internalInstance = getCurrentInstance();
      const gvm = internalInstance.appContext.config.globalProperties;
      const modules = gvm.rh.modules;

      const state = reactive({
        collapsed: false,
        // menuList: gvm.$route.matched[0].children || [],
        menuList: [],
        modules,
        breads: [],
        recentList: [],
        isLogin: false,
        selectedKeys: [],
        openKeys: [],
        moduleKey: [],
      });

      const toggleCollapsed = () => {
        state.collapsed = !state.collapsed;
        // state.openKeys = state.collapsed ? [] : state.preOpenKeys;
      };
      watch(
        () => gvm.$route,
        (val, oldVal) => {
          console.log(val, 'uuu');
          state.moduleKey = [val.matched[0].name];
          state.selectedKeys = [val.path];
          if (gvm.$route.fullPath.indexOf('/login') > -1) {
            state.isLogin = true;
          } else {
            state.isLogin = false;
            let moduleName = gvm.rh.getCurrentModuleName(val);

            state.menuList = gvm.rh.originRoutes.find(
              (m) => m.name == moduleName
            ).children;
            state.breads = gvm.rh.getBreadcrumbs(val.matched, val.params);
            state.recentList = gvm.rh.getRecentList();
          }
        }
      );

      return {
        ...toRefs(state),
        toggleCollapsed,
      };
    },
  });
</script>
<style lang="scss">
  .mqj-layout {
    height: 100vh;

    .mqj-layout-header {
      padding: 0 16px;
      background: #001529;
    }

    .mqj-avatar,
    .mqj-recent {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }

    .trigger {
      font-size: 18px;
      line-height: 64px;
      cursor: pointer;
      transition: color 0.3s;
      color: #fff;
    }

    .trigger:hover {
      // color: #1890ff;
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
