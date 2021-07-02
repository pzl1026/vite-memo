<template>
  <a-menu
    mode="inline"
    theme="dark"
    v-model:openKeys="openKeys"
    v-model:selectedKeys="selectedKeys"
  >
    <menu-item v-for="item in menuList" :item="item" />
  </a-menu>
</template>

<script>
  import { reactive, toRefs, watch, getCurrentInstance } from 'vue';
  import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    MailOutlined,
    DesktopOutlined,
    InboxOutlined,
    AppstoreOutlined,
  } from '@ant-design/icons-vue';
  import MenuItem from './menuItem.vue';
  import { cloneDeep } from 'lodash';

  export default {
    props: ['menuList'],
    components: {
      MenuFoldOutlined,
      MenuUnfoldOutlined,
      PieChartOutlined,
      MailOutlined,
      DesktopOutlined,
      InboxOutlined,
      AppstoreOutlined,
      MenuItem,
    },

    setup(props, context) {
      const getMenuList = (menuList) => {
        return menuList.map((m) => {
          if (m.children) {
            m.children = m.children.filter((n) => !n.meta.hidden);
            if (m.children.length == 0) {
              m.children = undefined;
            } else {
              getMenuList(m.children);
            }
          }

          return m;
        });
      };
      const state = reactive({
        selectedKeys: ['1'],
        openKeys: ['sub1'],
        preOpenKeys: ['sub1'],
        menuList: getMenuList(props.menuList),
      });

      console.log(state.menuList, 'menuList');

      watch(
        () => props.menuList,
        (val, oldVal) => {
          state.menuList = getMenuList(val);
        }
      );

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

      return {
        ...toRefs(state),
        toggleCollapsed,
      };
    },
  };
</script>
