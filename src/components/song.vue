<template>
  <div v-if="currentSong" class="normal-player-wrap">
    <div class="player-bg"><img :src="currentSong.image" :alt="currentSong.name"></div>
    <div class="player-top">
      <i class="icon-back" @click="showMiniPlayer">返回</i>
      <h1 class="song-name" v-html="currentSong.name"></h1>
      <h1 class="singer" v-html="currentSong.singer"></h1>
    </div>
    <div class="player-middle" @touchstart="middleTouchStart" @touchmove="middleTouchMove" @touchend="middleTouchEnd">
      <div class="player-middle-left" ref="playerMiddleLeft">
        <div class="cd-wrap">
          <div class="cd-border" :class="playing">
            <img :src="currentSong.image" alt="">
          </div>
        </div>
        <div class="song-lyric-wrap">
          <p class="playing-lyric">{{playingLyric}}</p>
        </div>
      </div>
      <scroll v-if="currentLyric" class="player-middle-right" ref="playerMiddleRight" :probeType=3 :listenScroll=true>
        <div class="lyric-wrap">
          <p v-for="(line,index) in currentLyric.lines" :class="{'light-current-line':index===currentLineNum}" :key="index" ref="lyricLine">
            {{line.txt}} </p>
        </div>
      </scroll>
    </div>
    <div class="player-bottom">
      <div class="show-page">
        <div class="dot" :class="{active:currentPage==='cd'}"></div>
        <div class="dot" :class="{active:currentPage==='lyric'}"></div>
      </div>
      <div class="control-part">
        <i class="needsclick iconfont icon-bofang-yuanshijituantubiao" @click="changePlayState" ref='needsclick'></i>
      </div>
    </div>
    <!-- controls -->
    <audio ref="audio" :src="currentSong.url" autoplay></audio>
  </div>
</template>

<script>
  import lyricParser from 'lyric-parser'
  import { prefixStlye } from '@/common/js/dom'
  import Scroll from '@/base/scroll/scroll'

  let prefixTransform = prefixStlye('transform')
  let transitionDuration = prefixStlye('transitionDuration')

  export default {
    data() {
      return {
        canplay: false,
        currentSong: {},
        currentPage: 'cd',
        playingLyric: '歌词加载中...',
        playing: 'play',
        audio: '',
        currentLyric: null,
        currentLineNum: 0,
        startPageX: 0,
        startPageY: 0,
        movedPageX: 0,
        movedPageY: 0
      };
    },
    created() {
      this.getWYSongData();
      //   this.getWYLyric()
    },
    mounted() {
      this.audio = this.$refs.audio;
    },
    methods: {
      middleTouchStart(e) {
        this.startPageX = e.touches[0].pageX
        this.startPageY = e.touches[0].pageY
      },
      middleTouchMove(e) {
        this.movedPageX = e.touches[0].pageX - this.startPageX
        this.movedPageY = e.touches[0].pageY - this.startPageY

        this.$refs.playerMiddleRight.$el.style[transitionDuration] = '300ms'
        this.$refs.playerMiddleLeft.style[transitionDuration] = '300ms'

        if (this.movedPageX < 0) {
          this.$refs.playerMiddleRight.$el.style[prefixTransform] = `translate3d(${-window.innerWidth}px,0,0)`
          this.$refs.playerMiddleLeft.style.opacity = 0
          this.currentPage = 'lyric'
        } else {
          this.$refs.playerMiddleRight.$el.style[prefixTransform] = `translate3d(0,0,0)`
          this.$refs.playerMiddleLeft.style.opacity = 1
          this.currentPage = 'cd'
        }

      },
      middleTouchEnd() {
        // console.log(1)
      },
      getWYSongData() {
        this.currentSong = this.$route.query
        console.error(this.currentSong, this.$route.query)
      },
      showMiniPlayer() {
        this.$router.back()
      },
      showCurrentPage() {
        return this.currentPage === 'cd' ? 'cd' : 'lyric'
      },

      changePlayState() {
        this.currentLyric.togglePlay()
        // let audio = this.$refs.audio
        if (this.audio !== null) {
          if (this.audio.paused) {
            this.audio.play(); // 播放 
            this.playing = 'play'
          } else {
            this.audio.pause(); // 暂停
            this.playing = 'pause'
          }
        }
      },
      getWYLyric() {
        let params = {};
        // console.log(this.$route)
        params.id = this.$route.query.id;
        this.$api.getWYLyric(params).then(res => {
          if (res.data.code === 200) {
            this.$set(this.currentSong, 'lyric', res.data.lrc.lyric)

            this.currentLyric = new lyricParser(res.data.lrc.lyric, this.lyricHandle)

            this.currentLyric.play()


          }

        })
      },
      lyricHandle({ lineNum, txt }) {
        this.currentLineNum = lineNum

        let showCurrentEle = this.$refs.lyricLine[lineNum-5]
        console.log(showCurrentEle, 'showCurrentEle')



        if (lineNum > 5) {
          this.$refs.playerMiddleRight.scrollToElement(showCurrentEle, 1000)
        } else {
            // this.$refs.playerMiddleRight.scrollTo(0, 0, 1000)
        }

        // console.log(showCurrentEle, txt, 'lineNum, txt')
        this.playingLyric = txt
      }
    },
    components: {
      Scroll
    },
    watch: {
      currentSong(newSong, oldSong) {
        console.log('newSongnewSongnewSongnewSong', newSong)
        let webTitle = document.getElementsByTagName('title')[0];
        webTitle.innerText = newSong.name + '-' + newSong.singer;
        console.log(webTitle, 'webTitle')
        if (!newSong.id) {
          return
        }
        if (newSong.id === oldSong.id) {
          return
        }

        this.$nextTick(() => {
          clearTimeout(this.timer)
          if (this.currentLyric) {
            this.currentLyric.stop()
            this.currentTime = 0
            this.playingLyric = '歌词加载中...'
            this.currentLineNum = 0
          }
          this.timer = setTimeout(() => {
            this.$refs.audio.play()
            this.getWYLyric()
          }, 500)
        })
      },
    }
  }
</script>

<style>
  .normal-player-wrap {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .player-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: blur(20px);
    opacity: 0.6;
  }

  .player-top {
    color: #fff;
    position: relative;
    text-align: center;
  }

  .icon-back {
    position: absolute;
    top: 10%;
    left: 20px;
    font-size: 22px;
    color: #ffcd32;
    z-index: 1;
  }

  .song-name {
    width: 80%;
    margin: 0 auto;
    font-size: 18px;
    line-height: 40px;
    height: 40px;
    position: relative;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    margin: 0 50px;
  }

  .singer {
    line-height: 20px;
    height: 20px;
    width: 80%;
    margin: 0 auto;
    font-size: 16px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .player-middle {
    position: fixed;
    top: 70px;
    bottom: 170px;
    white-space: nowrap;
    width: 100%;
  }

  .player-middle-left {
    width: 100%;
    display: inline-block;
  }

  .cd-wrap {
    padding-top: 80%;
    height: 0;
    width: 100%;
    position: relative;
  }

  .cd-border {
    box-sizing: border-box;
    border: 10px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;

  }

  .cd-border.play {
    animation: rotation 8s infinite linear;
  }

  .cd-border.pause {
    animation-play-state: paused
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  .cd-border img {
    display: block;
    width: 100%;
    border-radius: 50%;
  }

  .player-bottom {
    position: absolute;
    bottom: 15px;
    left: 50%;
    width: 80%;
    margin: 0 auto;
    transform: translate(-50%, 0);
    text-align: center;
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5);
    display: inline-block;
    vertical-align: middle;
    font-size: 0;
    margin: 0 4px;
  }

  .dot.active {
    width: 20px;
    border-radius: 5px;
    background-color: #fff;
  }

  .control-part {
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 30px;
  }

  .needsclick {
    font-size: 40px;
  }

  .song-lyric-wrap {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.5);
    margin: 10px 0 0 0;
    text-align: center;
  }

  .playing-lyric {
    width: 80%;
    margin: 0 auto;
    overflow: hidden;
  }

  .player-middle-right {
    width: 100%;
    height: 100%;
    vertical-align: top;
    display: inline-block;
    overflow: hidden;
    text-align: center;
  }

  .light-current-line {
    color: #ffcd32;
    font-weight: bold;
  }
</style>