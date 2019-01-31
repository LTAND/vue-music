<template>
  <div class="tab">
    <ul>
      <router-link tag="li" to="/recommend">
        <span class="tab-text">推荐</span>
      </router-link>
      <router-link tag="li" to="/singer">
        <span class="tab-text">歌手</span>
      </router-link>
      <router-link tag="li" to="/rank">
        <span class="tab-text">排行</span>
      </router-link>
      <router-link tag="li" to="/search">
        <span class="tab-text">搜索</span>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.tab
  height: $tab-height = 44px
  text-decoration: none
  font-size: 0
  text-align: center
  ul
    padding-left: 0px
  li
    width: 25%
    display: inline-block
    height: $tab-height
    line-height: $tab-height
    font-size: $font-size-medium
    cursor: pointer
    .tab-text
      padding-bottom: 5px
      color: $color-text-l
    &.router-link-active  // router-link被点击的样式
      .tab-text
        color: $color-theme
        border-bottom: 2px $color-theme solid

</style>
