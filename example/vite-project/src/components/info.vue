<template>
  <div>info {{ id }}</div>
</template>

<script>
  export default {
    computed: {
      id() {
        // 我们很快就会看到 `params` 是什么
        return this.$route.params.id;
      },
    },
  };
</script>
