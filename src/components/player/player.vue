<template>
  <div class="player" v-show="playList.length>0">
    <div class="normal-player" v-show="fullScreen">
      <div class="top">
        <div class="back" @click="test()">
          <i class="iconfont icon-bottom"></i>
        </div>
        <h1 class="title">{{currentSong.name}}</h1>
        <span class="sub">{{currentSong.singer}}</span>
      </div>
      <div class="middle">
        <img :src="currentSong.img">
      </div>
      <div class="bottom">
        <div class="operators">
          <div class="icon-center">
            <i class="iconfont icon-play2"></i>
          </div>
        </div>
      </div>
      <div class="background">
      </div>
    </div>
    <div class="min-player" v-show="!fullScreen">缩小的播放器</div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["playList", "fullScreen", "currentSong"])
  },
  methods: {
    test() {
      console.log(this.currentSong);
    }
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.player
  text-align center
  position: fixed
  top: 0
  left: 0
  width: 100%
  height: 100%
  background-color: $color-background
  .normal-player
    .top
      position relative
      margin-bottom: 20px
      .back
        position absolute
        top: 0
        left: 5%
        .icon-bottom
          color: $color-theme
          font-size:$font-size-large-x
      .title
        font-size: $font-size-medium-x
      .sub
        font-size:$font-size-medium
    .middle
      font-size:0
      margin 0 auto
      width: 300px
      height: 300x
      border: 10px $color-dialog-background solid
      border-radius: 50%
      img
        border-radius: 50%
        width: 100%
        height: 100%

</style>
