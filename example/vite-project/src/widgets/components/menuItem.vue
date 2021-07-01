<template>
  <template v-if="!item.meta.hidden">
    <a-sub-menu
      :key="item.path"
      v-if="item.children && item.children.length > 0"
    >
      <template #title>
        <span>
          <component :is="item.meta.icon"></component>
          <span>{{ item.meta.title }}</span>
        </span>
      </template>
      <menu-item v-for="c in item.children" :item="c" />
    </a-sub-menu>
    <a-menu-item :key="item.path" v-else>
      <component :is="item.meta.icon"></component>

      <router-link :to="item.toLink">
        {{ item.meta.title }}
      </router-link>
    </a-menu-item>
  </template>
</template>

<script>
  import { defineComponent, reactive, toRefs, watch } from 'vue';
  import { PieChartOutlined, MailOutlined } from '@ant-design/icons-vue';

  export default defineComponent({
    name: 'menu-item',
    components: {
      PieChartOutlined,
      MailOutlined,
    },
    props: ['item'],
    setup(props, context) {
      const state = reactive({
        item: props.item,
      });

      watch(
        () => props.item,
        (val, oldVal) => {
          state.item = val;
        }
      );

      return {
        ...toRefs(state),
      };
    },
  });
</script>
