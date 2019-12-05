<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot></slot>
    </div>
    <div class="dots">
      <span
        class="dot"
        :class="{active:currentPageIndex === index}"
        v-for="(item, index) in dots"
        :key="item.id"
      >1</span>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
// import { addClass } from "common/js/dom.js";
export default {
  // name: "slider",
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    };
  },
  mounted() {
    setTimeout(() => {
      this._setSliderWidth();
      this._initDots();
      this._initSlider(); // 初始化轮播对象,首尾会创造多一个元素
      if (this.autoPlay) {
        // 启动轮播
        this._play();
      }
    }, 20);
    window.addEventListener("resize", () => {
      // 监听窗口变化,重新计算宽度和better-scorll
      if (!this.slider) return;
      
      this._setSliderWidth(true);
      this.slider.refresh(); // 当 DOM 结构发生变化的时候务必要调用确保滚动的效果正常
    });
  },
  components: {},
  computed: {},
  methods: {
    _setSliderWidth(isResize) {
      // 初始化 - 宽
      let width = 0;
      let sliderWidth = this.$refs.slider.clientWidth;
      this.children = this.$refs.sliderGroup.children; // 图片盒子

      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i];
        child.style.width = sliderWidth + "px";
        width += sliderWidth;
      }
      if (this.loop && !isResize) {
        width += 2 * sliderWidth;
      }
      // console.log(this.children.length);
      this.$refs.sliderGroup.style.width = width + "px"; // 图片组
    },
    _initDots() {
      // 初始化 - 按钮组的个数
      this.dots = this.$refs.sliderGroup.children.length;
    },
    _initSlider() {
      // BScroll - 对象初始化
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false, // 滚动动画
        snap: {
          loop: this.loop,
          threshold: 0.3, // 表示可滚动到下一个的阈值
          speed: 400
        },
        click: true
      });
      // BScroll对象 - 触发事件
      this.slider.on("scrollEnd", () => {
        let pageIndex = this.slider.getCurrentPage().pageX;
        // console.log(this.slider.getCurrentPage())
        this.currentPageIndex = pageIndex;

        if (this.autoPlay) {
          clearTimeout(this.timer); // 清空手动滑动
          this._play();
        }
      });
    },
    _play() {
      this.timer = setTimeout(() => {
        this.slider.next();
      }, this.interval);
    }
  },
  destroyed() {
    // 销毁组件时，及时清空计时器
    clearTimeout(this.timer);
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.slider
  min-height: 1px
  position: relative
  .slider-group
    // 图片组
    // position: relative
    overflow: hidden
    white-space: nowrap
    .slider-item
      // box-sizing: border-box
      // overflow: hidden
      float: left
      text-align: center
      a
        display: block
        width: 100%
        // overflow hidden
        text-decoration: none
      img
        display: block
        width: 100%
  .dots
    // 按钮组
    position: absolute
    right: 0
    left: 0
    bottom: 12px
    text-align: center
    font-size: 0
    .dot
      display: inline-block
      margin: 0 4px
      width: 8px
      height: 8px
      border-radius: 50%
      background-color: #ccc
      &.active
        width: 20px
        border-radius: 5px
        background: $color-text-ll
</style>
