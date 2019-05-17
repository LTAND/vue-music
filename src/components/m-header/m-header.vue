<template>
  <div class="m-header">
    <div class="logo"></div>
    <div class="text">Chicken Music</div>
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
  .logo
    display: inline-block
    vertical-align: top // 控制元素上下对齐
    width: 30px
    height: $logo-height = 32px
    margin-top: (($m-header-height - $logo-height) / 2) // 微调上下距离
    bg-image('logo') // 媒体查询logo
    background-size: 30px 32px
    font-size: 22px
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
