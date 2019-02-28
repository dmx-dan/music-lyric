<template>
  <div>
    <h3> 抱歉！页面未找到，请检查网址是否正确。点击 <span style="color: blue;cursor: pointer" @click="goToFirstPage">这里</span> 跳转至首页。 </h3>
    <p>错误代码：404</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {};
    },
    methods: {
      goToFirstPage() {
        window.location.href = window.location.origin;
      }
    }
    // mounted() {
    //   if (confirm('抱歉，您访问的网址不存在，是否跳转至首页？')) {
    //     window.location.href = window.location.host
    //   }
    // },
  };
</script>