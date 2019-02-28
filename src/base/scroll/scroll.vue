<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      listenScroll: {
        type: Boolean,
        default: true
      },
      click: {
        type: Boolean,
        default: true
      },
    },
    mounted() {

      setTimeout(() => {
        this.initScroll()
      }, 20)
    },
    methods: {
      initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click
        })
        if (this.listenScroll) {
          let me = this
          this.scroll.on('scroll', (pos) => {
            me.$emit('scroll', pos)
          })
        }
      },
      scrollTo: function () {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement: function () {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
        console.log(this.scroll, 'scrollToElement')
      }
    }
  }
</script>