<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div
        class="progress-btn-wrapper"
        ref="progressBtn"
        @touchstart.prevent="progressTouchStart"
        @touchmove.prevent="progressTouchMove"
        @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { prefixStyle } from "../../common/js/dom";

const progressBtnWidth = 16;
const transform = prefixStyle("transform");

// 需要制作音乐拖动进度条
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {};
  },
  computed: {},
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true; // 判断是否开始拖动的标志
      this.touch.startX = e.touches[0].pageX;
      this.touch.left = this.$refs.progress.clientWidth; // 当前进度条的宽度
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const deltaX = e.touches[0].pageX - this.touch.startX;
      const offsetWidth = Math.min(
        Math.max(0, this.touch.left + deltaX),
        this.$refs.progressBar.clientWidth - progressBtnWidth
      ); // 按钮移动的距离，移动距离的范围
      this._offset(offsetWidth);
    },
    progressTouchEnd(e) {
      this.touch.initiated = false;
      this._triggerPercent();
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      this._offset(offsetWidth);
      // 点击按钮会出现，获取不对
      // this._offset(e.offsetX)
      this._triggerPercent();
    },
    _offset(offsetWidth) {
      // 进度条与按钮同时移动
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
    },
    _triggerPercent() {
      // 传递出组件滑动后的进度条百分比
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      const percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit("percentChange", percent);
    }
  },
  watch: {
    percent(newPercent) {
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth; // 进度条的宽度
        const offsetWidth = barWidth * newPercent; // 实时百分比对应进度条的宽度
        this._offset(offsetWidth);
      }
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/variable'

.progress-bar
  height: 30px
  .bar-inner
    position: relative
    top: 13px
    height: 4px
    background: rgba(0, 0, 0, 0.3)
    .progress
      position: absolute
      height: 100%
      background: $color-theme
    .progress-btn-wrapper
      position: absolute
      left: -8px
      top: -13px
      width: 30px
      height: 30px
      .progress-btn
        position: relative
        top: 7px
        left: 7px
        box-sizing: border-box
        width: 16px
        height: 16px
        border: 3px solid $color-text
        border-radius: 50%
        background: $color-theme
</style>