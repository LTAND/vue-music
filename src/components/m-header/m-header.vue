<template>
  <div class="m-header">
    <div class="text">Music Player</div>
    <router-link tag="div" class="user" to="/user">
       <i class="iconfont icon-user"></i>
    </router-link>
  </div>
</template>

<script>
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.m-header
  height: $m-header-height = 44px
  color: $color-theme
  text-align: center // .lodo .text 居中对齐
  font-size: 0
  position relative
  .text
    display: inline-block
    vertical-align: top
    margin-left: 9px
    line-height: $m-header-height
    font-size: $font-size-large
  .user
    line-height: $m-header-height
    position: absolute
    top: 0
    right: 5%
    .icon-user
      font-size: $font-size-large
</style>
