<template>
  <div class="singer">
    <ul class="singers-list">
      <li v-for="(item,index) in singerList" :key="index" class="singers-list-li" @click="chooseSinger(item)">
        <img :src="item.picUrl" :alt="item.name">
        <span>{{item.name}}</span>
      </li>
    </ul>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
  export default {
    data() {
      return {
        singerList: []
      };
    },
    created() {
      this.getSingerList();
    },
    methods: {
      getSingerList() {
        let params = {};
        params.offset = 0;
        params.limit = 20;
        this.$api.getWYSingerList(params).then(res => {
          if (res.data.code === 200) {
            this.singerList = res.data.artists;
          }
          console.log(this.singerList, "1556");
        });
      },
      chooseSinger(item) {
        console.log(item);
        this.$router.push({
          path: `/singer/${item.id}`,
          query: { name: item.name }
        });
      }
    }
  };
</script>

<style scoped>
  .singer {
    height: 100%;
    overflow-y: auto;
  }

  .singers-list-li {
    padding: 15px 0 15px 30px;
    display: flex;
    align-items: center;
  }

  .singers-list-li>img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .singers-list-li>span {
    color: rgba(255, 255, 255, 0.5);
    font-size: 14px;
    margin-left: 20px;
  }
</style>