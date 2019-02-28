<template>
    <div class="tab">
        <router-link to="/recommend" tag="div" class="tab-item">推荐</router-link>
        <router-link to="/rank" tag="div" class="tab-item">排行</router-link>
        <router-link to="/category" tag="div" class="tab-item">分类</router-link>
        <router-link to="/singer" tag="div" class="tab-item">歌手</router-link>
        <router-link to="/search" tag="div" class="tab-item">搜索</router-link>
  </div>
</template>

<script>
  export default {
    name: 'tab',
    data () {
      return {}
    }
  }
</script>
