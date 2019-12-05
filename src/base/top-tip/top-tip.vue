<template>
  <div class="top-tip" v-show="showFlag">
    <slot></slot>
  </div>
</template>

<script>
// 延迟提示框组件
export default {
  props:{
    // 外部调用控制时间
    delay:{
      type: Number,
      default: 2000
    }
  },
  data () {
    return {
      showFlag: false
    };
  },
  components: {},
  computed: {},
  methods: {
    // 延迟显示
    show(){
      this.showFlag = true
      // delay秒关闭
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.hide()
      }, this.delay);
    },
    hide(){
      this.showFlag = false
    }
  }
}

</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'
  .top-tip
    position fixed
    width 100%
    top: 0
    background $color-dialog-background 
    z-index 500
    &.drop-enter-active, &.drop-leave-active
      transition: all 0.3s
    &.drop-enter, &.drop-leave-top
      transform: translate3d(0, -100%, 0)
</style>
