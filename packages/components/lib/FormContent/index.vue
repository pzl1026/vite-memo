<template>
  <a-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    :label-col="labelCol"
    :wrapper-col="wrapperCol"
  >
    <a-row>
      <a-col
        :span="item.span || parseInt(24 / columnsCount)"
        v-for="item in formItems"
        :key="item.name"
      >
      <!-- :name="item.name" -->
        <a-form-item
          v-if="!item.hidden"
          :label="item.label"
          v-bind="item.formItemProps"
          style="display: flex"
        >
          <template v-if="item.slot">
            <slot :name="item.slot" :item="item" :formState="formState" />
          </template>
          <template v-else>
            <component
              v-if="item.type != 'switch'"
              :is="
                CUSTOM_ITEMS.includes(item.type) ? item.type : `a-${item.type}`
              "
              v-model:value="formState[item.name]"
              v-bind="item.itemProps"
              allowClear
              :style="
                (item.itemProps && item.itemProps.style) || { width: '300px' }
              "
              @change="(...args) => formChange(item, ...args)"
            />
            <a-switch
              v-else
              v-model:checked="formState[item.name]"
              v-bind="item.itemProps"
              @change="(...args) => formChange(item, ...args)"
            ></a-switch>
          </template>
        </a-form-item>
      </a-col>
    </a-row>
    <a-form-item
      :wrapper-col="handleSubmitWrapperCol()"
      v-if="needSubmitButton"
    >
      <div
        :style="
          columnsCount == 1
            ? { justifyContent: 'flex-start' }
            : { justifyContent: 'center' }
        "
        class="form-submit-btn"
      >
        <slot
          name="submit-btn"
          :onSubmit="onSubmit"
          :resetForm="resetForm"
          :formState="formState"
        >
          <a-button type="primary" @click="onSubmit">提交</a-button>
          <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
        </slot>
      </div>
    </a-form-item>
  </a-form>
</template>
<script>
  import { defineComponent, reactive, ref, toRaw, watch } from 'vue';

  const SELECT_PROPS = {
    showSearch: true,
    optionFilterProp: 'label',
    filterOption: (input, option) => {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  };

  function formItems2FormState(formItems) {
    let fs = {};
    for (let v of formItems) {
      fs[v.name] = v.type == 'Uploader' ? v.value || [] : v.value;
    }
    return fs;
  }

  function handleParams(params, formItems) {
    let newParams = {};
    for (let [k, v] of Object.entries(params)) {
      let curr = formItems.find((m) => m.name == k);
      if (curr && !curr.hidden) {
        switch (curr.type) {
          case 'date-picker':
            if (!v) break;
            if (curr.valueType == 'number') {
              newParams[k] = parseInt(v.valueOf() / 1000);
            } else {
              newParams[k] = v.format(curr.itemProps.format);
            }
            break;
          case 'time-picker':
            if (!v) break;
            if (curr.valueType == 'number') {
              newParams[k] = parseInt(v.valueOf() / 1000);
            } else {
              newParams[k] = v.format(curr.itemProps.format);
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
              newParams[curr.valueFields[0]] =
                v[0] && v[0].format(curr.itemProps.format);
              newParams[curr.valueFields[1]] =
                v[1] && v[1].format(curr.itemProps.format);
            }
            break;
          default:
            newParams[k] = params[k];
        }
      }
    }

    return { ...params, ...newParams };
  }

  function feildStr2Obj(data, dataField) {
    let val = data;
    if (!data.list) return [];
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
        if (!data || !data.list) {
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
            item.itemProps.treeData = item.itemProps.options = data.map(
              (m) => ({
                ...m,
                label: m[item.asyncOptions.optionFields.label],
                title: m[item.asyncOptions.optionFields.label],
                key: m[item.asyncOptions.optionFields.value],
                value: m[item.asyncOptions.optionFields.value],
              })
            );
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
    emits: ['formChange', 'afterInfo', 'optionsAsync'],
    props: {
      rules: {
        type: Object,
        default: {},
      },
      formItems: {
        type: Array,
        default: [],
      },
      handleInitFormData: {
        type: [Function, undefined],
        default: undefined,
      },
      beforeSubmit: {
        type: [Function, undefined],
        default: undefined,
      },
      afterSubmit: {
        type: [Function, undefined],
        default: undefined,
      },
      submitApi: {
        type: [Function, undefined],
        default: undefined,
      },
      needSubmitButton: {
        type: Boolean,
        default: true,
      },
      columnsCount: {
        type: Number,
        default: 1,
      },
      formStateInit: {
        type: Object,
        default: {},
      },
      formItemsAfterInfo: {
        type: [Function, undefined],
        default: undefined,
      },
      infoInit: {
        type: Boolean,
        default: false,
      },
    },
    methods: {
      handleSwitchVal(val) {
        return ![0, false].includes(val) ? true : false;
      },

      handleSubmitWrapperCol() {
        return this.columnsCount == 1 ? { span: 14, offset: 4 } : { span: 24 };
      },
    },
    setup(props, context) {
      const {
        rules,
        formItems,
        handleInitFormData,
        beforeSubmit,
        afterSubmit,
        submitApi,
        formStateInit,
        formItemsAfterInfo,
      } = props;
      const formRef = ref();

      const CUSTOM_ITEMS = ref(['Uploader']);

      const formState = reactive(
        handleInitFormData
          ? handleInitFormData(formItems2FormState(formItems))
          : formItems2FormState(formItems)
      );

      // 对异步options做处理
      handleAsyncOptions(formItems, formState, undefined, context.emit);

      const state = reactive({
        api: submitApi,
      });

      const onSubmit = () => {
        formRef.value
          .validate()
          .then(() => {
            let params = beforeSubmit
              ? beforeSubmit(toRaw(formState), formItems)
              : toRaw(formState);
            params = handleParams(params, toRaw(formItems));
            state.api(params).then((res) => {
              afterSubmit && afterSubmit(res);
            });
          })
          .catch((error) => {
            console.warn('error', error);
          });
      };

      const resetForm = () => {
        formRef.value.resetFields();
      };

      const formChange = (item, ...args) => {
        if (item.type == 'Uploader') {
          formState[item.name] = args[0];
        }
        if (item.relateName instanceof Array && item.relateName.length > 0) {
          let relateName = [...item.relateName];
          relateName.forEach((name, index) => {
            if (index == 0) {
              handleAsyncOptions(formItems, formState, name, context.emit);
            }
            formState[name] = undefined;
            let isset = formItems.find((m) => m.name == name);
            if (
              isset &&
              (isset.itemProps.mode == 'multiple' ||
                isset.itemProps.treeCheckable == true)
            ) {
              formState[name] = [];
            }
          });
          relateName.shift();
          formItems.forEach((m) => {
            if (relateName.includes(m.name)) {
              m.itemProps.options = [];
            }
          });
        }
        context.emit('formChange', item, formState, formItems, args);
      };

      // 编辑进来初始化数据
      const handleInitAsyncInfo = () => {
        setTimeout(() => {
          formItems.forEach((item) => {
            if (
              item.relateName instanceof Array &&
              item.relateName.length > 0
            ) {
              item.relateName.forEach((name) => {
                handleAsyncOptions(formItems, formState, name, context.emit);
              });
            }
          });
          context.emit('afterInfo', formState, formItems);
        });
      };

      const info2FormState = (info) => {
        for (let [k, item] of Object.entries(formState)) {
          formState[k] = info[k];
        }
        formItemsAfterInfo && formItemsAfterInfo(formItems);
        handleInitAsyncInfo();
      };

      if (props.infoInit) {
        info2FormState(props.formStateInit);
      }

      // 监听info初始化
      watch(
        () => [props.formStateInit],
        ([newFormStateInit], [prevFormStateInit]) => {
          info2FormState(newFormStateInit);
        }
      );

      watch(
        () => props.submitApi,
        (val) => {
          state.api = val;
        }
      );

      return {
        formRef,
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 14,
        },
        formState,
        onSubmit,
        resetForm,
        formChange,
        state,
        CUSTOM_ITEMS,
      };
    },
  });
</script>

<style lang="scss">
  .form-submit-btn {
    display: flex;
  }
</style>
