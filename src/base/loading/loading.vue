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
