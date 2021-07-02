<template>
  <div>info {{ id }}</div>
</template>

<script>
  export default {
    computed: {
      id() {
        console.log(this.$route.params.id, 'jjj');
        // 我们很快就会看到 `params` 是什么
        return this.$route.params.id;
      },
    },
    created() {
      console.log(this.$route.params.id, 'ddd');
    },
  };
</script>
