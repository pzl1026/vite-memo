<template>
  <div>
    <a-upload
      accept="image/*"
      list-type="picture-card"
      v-model:file-list="fileList"
      :multiple="true"
      :before-upload="() => false"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < maxLen && !uploading">
        <PlusOutlined />
        <div class="ant-upload-text">上传</div>
      </div>
      <div v-if="uploading">
        <a-popover title="正在上传的图片">
          <template #content>
            <a-space>
              <img
                class="uploading-img"
                :src="img.thumbUrl"
                :alt="img.name"
                v-for="img in uploadingFiles"
                :key="img.uid"
              />
            </a-space>
          </template>
          <div class="uploading-block">
            <LoadingOutlined />
            <div style="font-size: 12px">已选文件正在上传....</div>
          </div>
        </a-popover>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
  import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
  import {
    defineComponent,
    ref,
    computed,
    nextTick,
    watch,
    toRefs,
    reactive,
    getCurrentInstance,
    emit,
  } from 'vue';
  import { message } from 'ant-design-vue';
  import { debounce } from 'lodash';
  import OssUpload from '@evam/utils/lib/oss-upload';

  const FILE_OBJ = {
    uid: '',
    name: '',
    status: '',
    url: '',
  };

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });
  }

  function validateFileChanged(fileList, { beforeUploadStart, maxSize }) {
    for (let f of fileList) {
      if (f.size > maxSize * 1024 * 1024) {
        message.warning(`${f.name}的文件大于${maxSize}M`);
        return fileList
          .filter(
            (m) => m.originFileObj instanceof File && m.uploaded == undefined
          )
          .map((m) => m.uid);
      }
    }

    return true;
  }

  export default defineComponent({
    emits: ['fileUploaded', 'change'],
    components: {
      PlusOutlined,
      LoadingOutlined,
    },

    props: {
      beforeUploadStart: {
        type: Function,
        default: () => true,
      },
      maxLen: {
        type: [String, Number],
        default: 3,
      },
      multiple: {
        type: [Boolean],
        default: true,
      },
      maxSize: {
        type: [Number],
        default: 1,
      },
      value: {
        type: [Array],
        default: [],
      },
    },

    setup(props, context) {
      const $userInfo =
        getCurrentInstance().appContext.config.globalProperties.$userInfo;
      const { beforeUploadStart, maxSize, value, maxLen } = props;
      const previewVisible = ref(false);
      const previewImage = ref('');

      const state = reactive({
        fileList: value,
        uploadNext: 0,
      });

      watch(() => props.value, val => {
        state.fileList = val;
      })

      const uploadingFiles = computed(() => {
        return state.fileList.filter((m) => m.uploaded === false);
      });

      const uploading = computed(() => {
        return state.fileList.some((m) => m.uploaded === false);
      });

      const handleCancel = () => {
        previewVisible.value = false;
      };

      const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }

        previewImage.value = file.url || file.preview;
        previewVisible.value = true;
      };

      const uploadStart = () => {
        let uploadFs = state.fileList.filter((m) => m.uploaded === false);

        if (uploadFs.length == 0) {
          context.emit('change', state.fileList);
          return;
        }

        OssUpload(
          uploadFs[0].originFileObj,
          $userInfo.buckets.public.name,
          $userInfo
        ).then((res) => {
          state.fileList = state.fileList.map((f) => {
            if (f.uid == res.uid) {
              return {
                img_key: res.key,
                img_url: res.url.img_url,
                url: res.url.img_url,
                name: res.name,
                status: 'done',
                uid: res.uid,
                upload_channel: 'cos',
                bucket: $userInfo.buckets.public.name,
              };
            }
            return f;
          });
          context.emit('fileUploaded', state.fileList, uploadFs[0]);
          nextTick(() => {
            uploadStart();
          });
        });
      };

      const handleChange = debounce(({ fileList, file }) => {
        if (fileList.length > maxLen) {
          message.warning('超出上传数量');
          state.fileList = state.fileList.filter((m) => !m.originFileObj);
          return;
        }
        let changedFiles = validateFileChanged(fileList, {
          beforeUploadStart,
          maxSize,
        });
        if (changedFiles instanceof Array) {
          state.fileList = fileList.filter(
            (m) => !changedFiles.includes(m.uid)
          );
          return;
        }

        if (!beforeUploadStart(state.fileList, file)) {
          return;
        }

        state.fileList = fileList.map((f) => {
          if (f.originFileObj instanceof File) {
            f.uploaded = false;
          }
          return f;
        });
        uploadStart();
      });

      return {
        previewVisible,
        previewImage,
        handleCancel,
        handlePreview,
        handleChange,
        uploadingFiles,
        uploading,
        ...toRefs(state),
      };
    },
  });
</script>
<style lang="scss">
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
  .uploading-block {
    width: 86px;
    height: 86px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }

  .uploading-img {
    width: 30px;
    height: 30px;
  }
</style>
