<template>
  <div class="loading">
    <img src="./loading.gif">
    <div class="desc">{{title}}</div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "正在载入..."
    }
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '../../common/stylus/variable'

/*
引用
<div class="loader-wrapper" v-show="!discList.length">
  <loading></loading>
</div>
.loader-wrapper
  position: absolute
  width: 100%
  top: 50%
  transform: translateY(-50%) // 垂直居中对齐
*/

.loading
  text-align center
  img
    width: 24px
    height: 24px
  .desc
    line-height: 20px
    color: $color-text-ll
    font-size: $font-size-small
</style>
