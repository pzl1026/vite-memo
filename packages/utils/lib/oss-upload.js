import ajax from './r';
// import UploadOSS from './oss';
import UploadOSS from './tx-oss';
import { message } from 'ant-design-vue';
import { MQJ_TOKEN } from '@/mqj/mqj.config';
// let md5 = require('js-md5');
import md5 from 'js-md5';

function handleSuccess(data, key, bucket, file, fn) {
  const reader = new FileReader();

  reader.readAsDataURL(file);
  reader.onload = () => {
    let base64 = reader.result;

    ajax
      .post('/v1_img_token/getImgUrl', { key, bucket, upload_channel: 'cos' })
      .then((res) => {
        let o = {
          name: file.name,
          key,
          url: res.data,
          img_url: res.data,
          uid: file.uid,
          base64,
          // eTag: data.etag
          eTag: data.ETag,
        };

        fn(o);
      });
  };
}

function upload(
  file,
  bucket,
  userInfo,
  { successEvent, progressEvent, uploadFail },
  checkpoint
) {
  return new Promise((resolve, reject) => {
    let objectKey = md5(
      parseInt(Math.random() * 100).toString() +
        new Date().valueOf() +
        '-' +
        file.name
    );

    ajax
      .post('/v1_img_token/getToken', {
        bucket,
        upload_channel: 'cos',
        objectKey,
        token: localStorage.getItem(MQJ_TOKEN),
      })
      .then((res) => {
        if (res.code != 0) {
          reject(res);
          message.warning('获取上传token失败');
          return;
        }
        let token = res.data.img_token;
        let clientConfig = {
          accessKeyId: token.credentials.tmpSecretId,
          accessKeySecret: token.credentials.tmpSecretKey,
          // region: userInfo.buckets.public.region,
          region: userInfo.buckets.public.region,
          bucket,
          stsToken: token.credentials.sessionToken,
          startTime: token.startTime,
          expiredTime: token.expiredTime,
          expiration: token.expiration,
          requestId: token.requestId,
        };

        let oss = new UploadOSS({
          file,
          checkpoint,
          clientConfig,
          objectKey,
          successEvent(res) {
            handleSuccess(res, objectKey, bucket, file, successEvent);
          },
          progressEvent,
          uploadFail,
        });

        resolve(oss);
      });
  });
}

function startUpload(file, bucket, userInfo, opt = {}, ready) {
  return new Promise((resolve, reject) => {
    upload(file, bucket, userInfo, {
      progressEvent: opt.progressEvent,
      successEvent(res) {
        (opt.successEvent && opt.successEvent(res)) || resolve(res);
      },
      uploadFail(err) {
        (opt.uploadFail && opt.uploadFail(err)) || reject(err);
      },
    }).then((oss) => {
      ready && ready(oss); //这边的ready配合之前写的lib下的q-upload.js
    });
  });
}

export default startUpload;
