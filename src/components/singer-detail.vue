<template>
  <div class="music-list-wrapper">
    <div class="singerAvatar" ref="singerAvatar"></div>
    <div class="singer-name">
      <span class="icon-back" @click="goback">返回</span>
      <h2>{{$route.query.name}}</h2>
    </div>
    <scroll class="music-list-con" ref="scrollSongList" :probeType="probeType" :listenScroll="listenScroll" @scroll="scroll">
      <ul class="song-ul">
        <li v-for="(item,index) in musicList" :key="index" class="song-ul-li" @click="selectItem(item)">
          <div class="song-name-detail">
            <h2 class="song-name"><span> {{index + 1}}. </span> {{item.name}}</h2>
            <p class="song-detail">{{songDetail(item)}} </p>
          </div>
        </li>
      </ul>
    </scroll>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import scroll from '@/base/scroll/scroll'
  import { prefixStlye } from '@/common/js/dom'

  let prefixTransform = prefixStlye('transform')

  export default {
    data() {
      return {
        musicList: [],
        scrollY: 0,
        singerAvatarHeight: 0,
      };
    },
    components: {
      scroll
    },
    created() {
      this.probeType = 3
      this.listenScroll = true
      this.getSingerMusicList();
    },
    mounted() {
      this.singerAvatarHeight = this.$refs.singerAvatar.clientHeight
      this.$refs.scrollSongList.$el.style.top = this.$refs.singerAvatar.clientHeight + 'px'
    },
    watch: {
      scrollY(newY) {
        let moveHeight = this.singerAvatarHeight - 40;
        if (-newY < moveHeight) {
          this.$refs.scrollSongList.$el.style[prefixTransform] = `translate3d(0,${newY}px,0)`
        } else {}
        // console.log(newY, 'newY')
      }
    },
    methods: {
      scroll(pos) {
        this.scrollY = pos.y
      },
      goback() {
        this.$router.back()
      },
      songDetail(item) {
        let arName = ''
        let arNames = ''
        if (item.ar.length > 1) {
          item.ar.forEach((e, index) => {
            arNames += e.name + '/'
          });
          arName = arNames.substr(0, arNames.length - 1)

        } else {
          arName = item.ar[0].name
        }
        return `${arName}·${item.al.name}`
      },
      getSingerMusicList() {
        let params = {};
        console.log(this.$route)
        params.id = this.$route.params.id;
        this.$api.getWYSingerMusicList(params).then(res => {
          if (res.data.code === 200) {
            this.musicList = res.data.hotSongs;
            this.$refs.singerAvatar.style.backgroundImage = `url(${res.data.artist.img1v1Url})`
          }
          console.log(res.data, "this.styleBg");
        });
      },
      selectItem(item) {
        var musicData = {}
        musicData.id = item.id
        musicData.singer = this.filterSinger(item.ar)
        musicData.name = item.name
        musicData.album = item.al.name
        musicData.duration = item.dt / 1000
        musicData.image = item.al.picUrl
        musicData.url = `http://music.163.com/song/media/outer/url?id=${item.id}.mp3`
        this.$router.push({
          path: '/song',
          query: musicData
        });
        console.log(item, 'index')
      },
      filterSinger(singer) {
        let meger_singer = []
        if (!singer) {
          return ''
        }
        if (typeof singer === 'string') {
          return singer
        }

        singer.forEach((item) => {
          meger_singer.push(item.name)
        })
        return meger_singer.join('/')
      },

    }
  };
</script>

<style>
  .music-list-wrapper {
    height: 100%;
    width: 100%;
    position: relative;
  }

  .singerAvatar {
    position: relative;
    width: 100%;
    height: 0;
    background-size: cover;
    padding-bottom: 80%;
    transform-origin: top;

  }

  .singer-name {
    z-index: 40;
    color: #ffcd32;
    position: absolute;
    text-align: center;
    width: 100%;
    top: 0;
  }

  .icon-back {
    left: 25px;
    top: 0;
    position: absolute;
    display: block;
    height: 40px;
    line-height: 40px;
    font-size: 22px;
  }

  .singer-name>h2 {
    margin: 0;
    font-size: 18px;
    line-height: 40px;
    height: 40px;
    padding: 0 50px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  /* .song-list-bg {
    background-color: #ffcd32;
    position: fixed;
    width: 100%;
    height: 90%;
    bottom: 0;
    top: 230px;
  } */

  .music-list-con {
    position: fixed;
    background-color: #063;
    bottom: 0;
    width: 100%;
    height: 95%;
    overflow: hidden;
  }

  .song-ul {
    width: 100%;
  }

  .song-ul-li {
    padding: 10px 30px;
    display: flex;
    align-items: center;
  }

  .song-name-detail {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .song-name {
    margin: 0;
    color: #fff;
    line-height: 20px;
    font-size: 14px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .song-detail {
    color: rgba(255, 255, 255, 0.3);
    margin: 0;
    margin-top: 4px;
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
</style>