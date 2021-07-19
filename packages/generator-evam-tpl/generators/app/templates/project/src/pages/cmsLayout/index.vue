<template>
  <div>CmsLayout</div>
</template>

<script>
  import axios from 'axios';
  export default {
    created() {
      console.log(import.meta.env, 'import.meta.env');
      console.log(VITE_APP_TITLE, 'VITE_APP_TITLE');
      console.log(SERVE_ENV, 'ststst');
      console.log(DEV_TEST, 'DEV_TEST');
      axios
        .post('/api/manager/login', {
          username: 'admin',
          password: 'j1NyTNirvxM=',
          phone: '138000000000',
          sms_phone: '1',
        })
        .then((res) => {
          console.log(res, ' eee');
        });
    },
  };
</script>
