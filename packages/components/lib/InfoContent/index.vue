<template>
  <a-row :gutter="[16, 16]">
    <a-col v-for="item in renderItems" :key="item.key" :span="item.span">
      <a-row :gutter="8">
        <a-col
          :span="item.itemLayout.labelWidth ? '' : item.itemLayout.labelSpan"
          class="info-label"
          :style="{ width: (item.itemLayout.labelWidth || 200) + 'px' }"
        >
          <span>{{ item.label }}:</span>
        </a-col>
        <a-col
          :span="item.itemLayout.valueWidth ? '' : item.itemLayout.valueSpan"
          class="info-value"
          :style="{ width: (item.itemLayout.valueWidth || 200) + 'px' }"
        >
          <span>{{ item.value }}</span>
        </a-col>
      </a-row>
    </a-col>
  </a-row>
</template>

<script>
  import {
    defineComponent,
    reactive,
    ref,
    toRaw,
    toRefs,
    watch,
    onMounted,
  } from 'vue';

  const itemLayout = {
    labelSpan: 8,
    valueSpan: 16,
  };

  function transfromData(info, itemLabel, lineCount, handleInfo) {
    if (![1, 2, 3, 4].includes(lineCount)) {
      console.warn('lineCount传参错误，只允许1，2，3，4');
      return [];
    }
    if (handleInfo) {
      handleInfo(info);
    }
    let infoItems = [];

    // for (let [k, v] of Object.entries(info)) {
    //   let isset = itemLabel.find((m) => m.key == k);
    //   if (isset) {
    //     infoItems.push({
    //       label: isset.label,
    //       value: v,
    //       key: isset.key,
    //       span: isset.span || 24 / lineCount,
    //       itemLayout: isset.itemLayout ? isset.itemLayout : itemLayout,
    //     });
    //   }
    // }

    for (let v of itemLabel) {
      infoItems.push({
        label: v.label,
        value: info[v.key],
        key: v.key,
        span: v.span || 24 / lineCount,
        itemLayout: v.itemLayout ? v.itemLayout : itemLayout,
      });
    }

    return infoItems;
  }

  export default defineComponent({
    props: {
      info: {
        type: Object,
        default: {},
      },
      itemLabel: {
        type: Array,
        default: [],
      },
      lineCount: {
        type: Number,
        default: 2,
      },
      handleInfo: {
        type: [Function, undefined],
        default: undefined,
      },
    },

    setup(props, context) {
      const { info, itemLabel, lineCount, handleInfo } = props;
      const state = reactive({
        renderItems: transfromData(info, itemLabel, lineCount, handleInfo),
      });

      watch(
        () => props.info,
        (val) => {
          state.renderItems = transfromData(
            val,
            itemLabel,
            lineCount,
            handleInfo
          );
        }
      );

      return {
        ...toRefs(state),
      };
    },
  });
</script>

<style lang="scss">
  .info-label {
    display: flex !important;
    justify-content: flex-end;
  }
  .info-value {
    display: flex !important;
    justify-content: flex-start;
  }
</style>
