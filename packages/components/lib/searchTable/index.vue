<template>
  <div class="search-form-body" v-if="needSearch" style="margin-bottom: 16px">
    <a-form ref="formRef" :rules="rules" :model="formParams">
      <a-row :gutter="24">
        <a-col
          v-for="(item, index) in formItems"
          :key="item.name"
          :span="item.span || 8"
        >
          <a-form-item
            v-bind="{
              labelCol: {
                span: 7,
              },
              wrapperCol: {
                span: 16,
              },
              ...item.itemProps,
            }"
            :label="item.label"
            :name="item.name"
            class="mqj-form-item-nospan"
          >
            <template v-if="item.slot">
              <slot :name="item.slot" :item="item" :formParams="formParams" />
            </template>
            <template v-else>
              <component
                :is="`a-${item.type}`"
                v-model:value="formParams[item.name]"
                v-bind="{
                  placeholder: item.type == 'input' ? '请输入' : '请选择',
                  ...item.itemProps,
                }"
                :style="item.itemProps && item.itemProps.style"
                allowClear
                @change="(...args) => formChange(item, args)"
              />
            </template>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item
        :wrapperCol="{ xs: { span: 16, offset: 8 } }"
        style="margin-bottom: 0; margin-top: 10px"
      >
        <a-space size="small" class="search-submit">
          <a-button type="primary" html-type="submit" @click="submitForm">
            <template #icon><SearchOutlined /></template>
            查询
          </a-button>
          <a-button @click="resetForm">
            <template #icon><ClearOutlined /></template>
            重置
          </a-button>
          <a
            :style="{ fontSize: '12px' }"
            @click="collapseFormItems"
            v-if="needCollapsed"
          >
            {{ collapsed ? '收起' : '展开' }}
            <UpOutlined v-if="collapsed" />
            <DownOutlined v-else />
          </a>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
  <a-row :gutter="[16, 16]">
    <a-col :span="12">
      <slot name="actions"></slot>
    </a-col>
    <a-col :span="12" class="page-actions">
      <a-space>
        <slot name="pageActions"></slot>
        <a-button @click="() => (needSearch = !needSearch)" v-if="searchShow">
          {{ needSearch ? '隐藏' : '显示' }}搜索条件
        </a-button>
      </a-space>
    </a-col>
    <a-col :span="24">
      <a-table
        :rowKey="rowKey"
        bordered
        :dataSource="dataSource"
        :columns="columns"
        :pagination="false"
        :loading="loading"
        v-bind="$attrs"
      >
        <template
          v-for="(item, index) in tableActionSlots"
          :key="item"
          v-slot:[item]="{ text, record }"
        >
          <slot :name="item" :text="text" :record="record"></slot>
        </template>
        <template #expandedRowRender="{ text, record }" v-if="expandedRow">
          <slot name="expandedRowRender" :value="text" :row="record"></slot>
        </template>
      </a-table>
    </a-col>
    <a-col :span="24" class="table-pagination">
      <a-pagination
        show-size-changer
        show-quick-jumper
        v-model:current="pageParams.page"
        v-model:pageSize="pageParams.page_size"
        :total="pageParams.total"
        :show-total="(total) => `共 ${total} 条数据`"
        @change="pageChange"
        @showSizeChange="pageChange"
        v-bind="paginationProps"
      />
    </a-col>
  </a-row>
</template>

<script>
  /* eslint-disable vue/require-valid-default-prop */
  import {
    defineComponent,
    reactive,
    ref,
    toRaw,
    toRefs,
    watch,
    onMounted,
    computed,
    nextTick,
  } from 'vue';
  import {
    DownOutlined,
    UpOutlined,
    SearchOutlined,
    ClearOutlined,
  } from '@ant-design/icons-vue';
  import FormContent from '../FormContent/index.vue';
  import ConfigProvider from 'ant-design-vue/lib/config-provider';
  import zhCN from 'ant-design-vue/es/date-picker/locale/zh_CN';

  const SELECT_PROPS = {
    showSearch: true,
    optionFilterProp: 'label',
    filterOption: (input, option) => {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  };

  const formItemLayout = {
    wrapperCol: {
      xs: {
        span: 16,
      },
    },
  };
  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 20,
        offset: 4,
      },
    },
  };

  const tableSlots = (columns) => {
    const slots = [];

    for (const v of columns) {
      if (v.slots && v.slots.customRender) {
        slots.push(v.slots.customRender);
      }
      if (v.slots && v.slots.title) {
        slots.push(v.slots.title);
      }
    }
    return slots;
  };

  function formItems2FormState(formItems) {
    const fs = {};

    for (const v of formItems) {
      fs[v.name] = v.value;
    }
    return fs;
  }

  function handleParams(params, formItems) {
    const newParams = {};

    for (const [k, v] of Object.entries(params)) {
      const curr = formItems.find((m) => m.name == k);

      switch (curr.type) {
        case 'date-picker':
          if (!v) break;
          if (curr.valueType == 'number') {
            newParams[k] = parseInt(v.valueOf() / 1000);
          } else {
            newParams[k] = v.format(curr.format);
          }
          break;
        case 'range-picker':
          if (!v) break;
          if (curr.valueType == 'number') {
            newParams[curr.valueFields[0]] =
              v[0] && parseInt(v[0].valueOf() / 1000);
            newParams[curr.valueFields[1]] =
              v[1] && parseInt(v[1].valueOf() / 1000);
          } else {
            newParams[curr.valueFields[0]] = v[0] && v[0].format(curr.format);
            newParams[curr.valueFields[1]] = v[1] && v[1].format(curr.format);
          }
          break;
        default:
          newParams[k] = params[k];
      }
    }

    return newParams;
  }

  function feildStr2Obj(data, dataField) {
    let val = data;
    if (dataField) {
      if (dataField.indexOf('.') == -1) {
        val = data[dataField];
      } else {
        let dataFields = dataField.split('.').reverse();

        while (dataFields.length > 0) {
          let col = dataFields.pop();
          val = val[col];
        }
      }
    }

    return val;
  }

  async function handleAsyncOptions(formItems, formState, asyncItemName, emit) {
    for (let item of formItems) {
      if (asyncItemName && asyncItemName != item.name) {
        continue;
      }
      item.type = item.type || 'select';
      if (!item.itemProps) {
        item.itemProps = {
          ...SELECT_PROPS,
        };
      } else {
        item.itemProps = {
          ...SELECT_PROPS,
          ...item.itemProps,
        };
      }
      if (item.asyncOptions && !item.asyncOptions.notFirstFetch) {
        let res = {};
        try {
          res = await item.asyncOptions.api(
            item.asyncOptions.apiParams
              ? item.asyncOptions.apiParams(item, formState, formItems)
              : {}
          );
        } catch (err) {}

        let data = res.data;
        if (!data) {
          item.itemProps.treeData = item.itemProps.options = [];
        }
        if (item.asyncOptions.dataField) {
          data = feildStr2Obj(data, item.asyncOptions.dataField);
        }
        emit('optionsAsync', item, data);
        if (item.asyncOptions.handleData) {
          item.itemProps.treeData = item.itemProps.options =
            item.asyncOptions.handleData(data);
        } else {
          if (item.asyncOptions.optionFields) {
            item.itemProps.treeData = item.itemProps.options = Array.isArray(
              data
            )
              ? data.map((m) => ({
                  ...m,
                  label: m[item.asyncOptions.optionFields.label],
                  title: m[item.asyncOptions.optionFields.label],
                  key: m[item.asyncOptions.optionFields.value],
                  value: m[item.asyncOptions.optionFields.value],
                }))
              : [];
          } else {
            console.warn('缺少asyncOptions.handleData');
          }
        }
      } else {
        if (item.asyncOptions) {
          item.asyncOptions.notFirstFetch = false;
        }
      }
    }
  }

  export default defineComponent({
    emits: ['loadedList', 'formChange', 'optionsAsync'],
    inheritAttrs: false,
    components: {
      DownOutlined,
      UpOutlined,
      FormContent,
      SearchOutlined,
      ClearOutlined,
    },
    props: {
      formItems: {
        type: Array,
        default: [],
      },
      fixParams: {
        type: Object,
        default: {},
      },
      minCount: {
        type: Number,
        default: 3,
      },
      api: {
        type: Function,
        default: () => {},
      },
      columns: {
        type: Array,
        default: [],
      },
      rowKey: {
        type: String,
        default: 'id',
      },
      handleData: {
        type: [Function, undefined],
        default: undefined,
      },
      collapsed: {
        type: Boolean,
        default: true,
      },
      rules: {
        type: Object,
        default: {},
      },
      beforeSearch: {
        type: [Function, undefined],
        default: undefined,
      },
      expandedRow: {
        type: Boolean,
        default: false,
      },
      searchShow: {
        type: Boolean,
        default: true,
      },
      paginationProps: {
        type: Object,
        default: {},
      },
      needSearchFirstShow: {
        type: Boolean,
        default: false,
      },
      waitInit: {
        type: Boolean,
        default: false,
      },
    },
    data() {
      return {
        zhCN,
        tableActionSlots: tableSlots(this.columns),
      };
    },
    setup(props, context) {
      const { formItems, minCount, api, beforeSearch, rules } = props;
      const formRef = ref();

      const formParams = reactive(formItems2FormState(formItems));

      const formState = reactive({
        needCollapsed: formItems.length > minCount,
        minCount,
        rules,
        collapsed: props.collapsed,
        formItems,
      });

      const state = reactive({
        needSearch: props.needSearchFirstShow,
        dataSource: [],
        pageParams: {
          page: 1,
          pageNum: 1,
          total: 10,
          page_size: 10,
          pageSize: 10,
        },
        params: {},
        loading: false,
        fixParams: props.fixParams,
      });

      watch(
        () => props.fixParams,
        (val) => {
          state.fixParams = val;
        }
      );

      // 对异步options做处理
      handleAsyncOptions(
        formState.formItems,
        undefined,
        undefined,
        context.emit
      );

      const collapseFormItems = () => {
        formState.collapsed = !formState.collapsed;

        if (formState.collapsed) {
          formState.formItems = formItems;
        } else {
          formState.formItems = formItems.slice(0, formState.minCount);
        }
      };

      const getData = async (params) => {
        delete params.total;
        state.loading = true;
        const data = await api(params);

        state.loading = false;
        if (data.data.list) {
          state.dataSource = props.handleData
            ? props.handleData(data.data.list)
            : data.data.list;
          state.pageParams = {
            page: data.data.page,
            pageNum: data.data.page,
            total: data.data.total,
            page_size: data.data.page_size,
            pageSize: data.data.page_size,
          };
          context.emit('loadedList', state.dataSource, state.pageParams);
        } else {
          state.dataSource = [];
        }
      };

      collapseFormItems();

      watch(
        () => [state.params],
        ([newParamsVal], [prevParamsVal]) => {
          state.pageParams = {
            page: 1,
            pageNum: 1,
            total: 10,
            page_size: 10,
            pageSize: 10,
          };
          getData(
            Object.assign(
              {},
              toRaw(newParamsVal),
              toRaw(state.pageParams),
              state.fixParams
            )
          );
        }
      );

      function load() {
        getData(
          Object.assign(
            {},
            toRaw(formParams),
            toRaw(state.pageParams),
            state.fixParams
          )
        );
      }
      if (props.waitInit) {
        state.loading = true;
        nextTick(() => {
          setTimeout(() => {
            load();
          }, 1000);
        });
      } else {
        load();
      }

      const getSearchParams = () => {
        return Object.assign(
          {},
          state.fixParams,
          handleParams(toRaw(formParams), toRaw(formItems))
        );
      };

      const submitForm = () => {
        formRef.value
          .validate()
          .then(() => {
            let params = Object.assign(
              {},
              state.fixParams,
              handleParams(toRaw(formParams), toRaw(formItems))
            );

            if (beforeSearch) {
              params = beforeSearch(params);
            }

            state.params = params;
          })
          .catch((error) => {
            console.warn('error', error);
          });
      };

      const resetForm = () => {
        formRef.value.resetFields();
        // 处理ant reset 问题，数组的时候不能完全清空
        for (let [k, v] of Object.entries(toRaw(formParams))) {
          if (v instanceof Array) {
            formParams[k] = v.filter((m) => m);
          }
        }
      };

      const pageChange = (val, size) => {
        state.pageParams = {
          ...state.pageParams,
          page: val,
          pageNum: val,
          page_size: size,
          pageSize: size,
        };

        getData(
          Object.assign(
            {},
            toRaw(state.params),
            toRaw(state.pageParams),
            state.fixParams
          )
        );
      };

      const formChange = (item, args) => {
        if (item.relateName instanceof Array && item.relateName.length > 0) {
          let relateName = [...item.relateName];
          relateName.forEach((name, index) => {
            if (index == 0) {
              handleAsyncOptions(
                formState.formItems,
                formParams,
                name,
                context.emit
              );
            }
            formParams[name] = undefined;
          });
          relateName.shift();
          formState.formItems = formState.formItems.map((m) => {
            if (relateName.includes(m.name)) {
              m.itemProps.options = [];
            }
            return m;
          });
        }
        context.emit('formChange', item, formParams, formItems, args);
      };

      return {
        formRef,
        formItemLayout,
        formItemLayoutWithOutLabel,
        ...toRefs(formState),
        ...toRefs(state),
        formParams,
        submitForm,
        resetForm,
        collapseFormItems,
        pageChange,
        load,
        formChange,
        getSearchParams,
      };
    },
  });
</script>

<style lang="scss">
  .search-submit {
    display: flex !important;
    justify-content: flex-end;
  }
  .search-form-body {
    padding: 24px;
    background: #fbfbfb;
    border: 1px solid #d9d9d9;
    border-radius: 3px;
    .mqj-form-item-nospan.ant-form-item {
      margin-bottom: 0;
    }
  }
  .table-pagination {
    display: flex;
    justify-content: flex-end;
    // .ant-pagination-item-link{
    //   display: flex;
    //   align-items: center;
    //   justify-content: center;
    // }
  }

  .page-actions {
    display: flex !important;
    justify-content: flex-end;
  }
</style>
