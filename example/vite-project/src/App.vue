<template>
  <!-- <img alt="Vue logo" src="@/assets/logo.png" />
  <HelloWorld msg="Hello Vue 32 + Vite" />
  <router-link to="/module1">module1</router-link>
  <br />
  <router-link to="/module2">module2</router-link>

  <router-view></router-view> -->
  <Layout />
</template>

<script>
  import HelloWorld from '@/components/HelloWorld.vue';
  import Layout from './widgets/layout.vue';
  import axios from 'axios';
  // This starter template is using Vue 3 experimental <script setup> SFCs
  // Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md

  export default {
    components: {
      HelloWorld,
      Layout,
    },

    setup() {
      console.log(import.meta.env, 'import.meta.env');
      console.log(VITE_APP_TITLE, 'VITE_APP_TITLE');
      console.log(E, 'ststst');
      // if (import.meta.hot) {
      //   import.meta.hot.on('special-update', (data) => {
      //     // 执行自定义更新
      //   });
      // }
      // axios.get('/api', {params: 'aaa'}).then(res => {
      //   console.log(res, 'resss')
      // })
    },
  };
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* text-align: center; */
    /* color: #2c3e50; */
    /* margin-top: 60px; */
  }
</style>
