// const COS = require('cos-js-sdk-v5');
import COS from 'cos-js-sdk-v5';

export default class TxOss {
  constructor(config) {
    this.progressEvent = config.progressEvent;
    this.file = config.file;
    this.successEvent = config.successEvent;
    this.objectKey = config.objectKey;
    this.checkpoint = config.checkpoint;
    this.uploadFail = config.uploadFail;
    this.clientConfig = config.clientConfig;
    this.startEvent = config.startEvent;
    this.bucket = config.clientConfig.bucket;
    this.startEvent = config.startEvent;
    this.initOss();
    this.upload();
  }

  initOss() {
    const _self = this;

    this.cos = new COS({
      // 必选参数
      getAuthorization: function (options, callback) {
        const {
          accessKeyId: TmpSecretId,
          accessKeySecret: TmpSecretKey,
          stsToken: XCosSecurityToken,
          startTime,
          expiredTime,
          expiration,
          requestId,
        } = _self.clientConfig;
        let opt = {
          TmpSecretId,
          TmpSecretKey,
          XCosSecurityToken,
          // 建议返回服务器时间作为签名的开始s时间，避免用户浏览器本地时间偏差过大导致签名错误
          StartTime: startTime, // 时间戳，单位秒，如：1580000000
          ExpiredTime: expiredTime, // 时间戳，单位秒，如：1580000900
          ScopeLimit: true, // 细粒度控制权限需要设为 true，会限制密钥只在相同请求时重复使用
        };

        callback(opt);
      },
    });
  }

  upload() {
    const _self = this;

    this.cos.sliceUploadFile(
      {
        Bucket: this.bucket /* 必须 */,
        Region: this.clientConfig.region /* 存储桶所在地域，必须字段 */,
        Key: this.objectKey /* 必须 */,
        Body: this.file /* 必须 */,
        onTaskReady: function (taskId) {
          /* 非必须 */
          console.info('开始上传...');
          _self.startEvent && _self.startEvent(this);
        },
        // onHashProgress: function (progressData) {       /* 非必须 */

        // },
        onProgress: function (progressData) {
          /* 非必须 */
          _self.progressEvent && _self.progressEvent(progressData.percent);
        },
      },
      function (err, data) {
        if (err) {
          throw new Error(err);
        }
        _self.successEvent && _self.successEvent({ ...data, key: data.Key });
      }
    );
  }
}
