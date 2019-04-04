<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  props: {
    /**
     * 1 滚动的时候会派发scroll事件，会截流。
     * 2 滚动的时候实时派发scroll事件，不会截流。
     * 3 除了实时派发scroll事件，在swipe的情况下仍然能实时派发scroll事件
     */
    probeType: {
      type: Number,
      default: 1
    },
    data: {
      type: Array,
      default: null
    },
    click: {
      type: Boolean,
      default: true
    },
    scrollX: {
      type: Boolean,
      default: false
    },
    refreshDelay: {
      type: Number,
      default: 20
    },
    scrollY: {
      type: Boolean,
      default: true
    },
    listenScroll: {
      type: Boolean,
      default: false
    },
    pullup:{
      // 上拉刷新, 派发scrollToEnd事件
      type: Boolean,
      default: false
    },
    beforeScroll: {
      // 滚动，派发beforeScroll事件
      type: Boolean,
      default: false
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this.refresh();
      }, 20);
    }
  },
  mounted() {
    setTimeout(() => {
      this._initScroll();
    }, this.refreshDelay);
  },
  methods: {
    _initScroll() {
      if (!this.$refs.wrapper) {
        return;
      }
      this.scroll = new BScroll(this.$refs.wrapper, {
        probeType: this.probeType,
        click: this.click
      });

      if (this.listenScroll) {
        // 监听srcoll事件
        let me = this;
        this.scroll.on("scroll", pos => {
          me.$emit("scroll", pos);
        });
      }

      if(this.pullup){
        this.scroll.on('scrollEnd',()=>{
          if(this.scroll.y <= this.scroll.maxScrollY+50){
            this.$emit("scrollToEnd")
          }
        })
      }

      if(this.beforeScroll){
        this.scroll.on('beforeScrollStart',()=>{
          this.$emit('beforeScroll')
        })
      }
      // console.log("data",this.data,this.scroll);
      // console.log("=============================");
      // hasVerticalScroll：true
      // 垂直滚动条件：scrollerHeight > wrapperHeight
    },
    enabled() {
      // 类型：Boolean,
      // 作用：判断当前 scroll 是否处于启用状态。
      this.scroll && this.scroll.enabled();
    },
    disable() {
      // 作用：禁用 better-scroll，DOM 事件（如 touchstart、touchmove、touchend）的回调函数不再响应。
      this.scroll && this.scroll.disable();
    },
    refresh() {
      // 作用：重新计算 better-scroll，当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常。
      this.scroll && this.scroll.refresh();
    },
    scrollTo() {
      this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    }
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
</style>
