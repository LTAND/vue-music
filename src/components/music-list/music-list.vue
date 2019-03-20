<template>
  <div class="music-list">
    <h1 class="title-text">
      <i class="iconfont icon-back" @click="goback"></i>
      {{title}}
    </h1>
    <div class="bgImage" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="playBtn" @click="random">
          <i class="iconfont icon-play2"></i>
          <span class="play-text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll
      class="list"
      @scroll="scroll"
      :probeTyoe="probeType"
      :listenScroll="listenScroll"
      :data="songs"
      ref="list"
    >
      <div class="song-list-wrapper">
        <song-list @select="selectItem" :songs="songs"></song-list>
      </div>
    </scroll>
    <div class="loader-wrapper" v-show="!songs.length">
      <loading></loading>
    </div>
  </div>
</template>

<script>
import SongList from "base/song-list/song-list";
import Scroll from "base/scroll/scroll";
// import { playlistMixin } from '../../common/js/mixin'
import { playlistMixin } from "common/js/mixin.js";
import { mapActions } from "vuex";
import Loading from 'base/loading/loading'
const RESERVED_HEIGHT = 40;

export default {
  mixins: [playlistMixin], // 插入
  props: {
    bgImage: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    songs: {
      type: Array,
      default: null
    }
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  data() {
    return {
      scrollY: 0
    };
  },
  mounted() {
    this.imgHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imgHeight + RESERVED_HEIGHT;
    this.$refs.list.$el.style.top = `${this.imgHeight}px`;
  },
  components: {
    SongList,
    Scroll,
    Loading
  },
  computed: {
    bgStyle() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY, newY);
      this.$refs.layer.style["transform"] = `translate3d(0,${translateY}px,0)`;
      this.$refs.layer.style[
        "webkitTransform"
      ] = `translate3d(0,${translateY}px,0)`;
      // console.log(translateY);
    }
  },
  methods: {
    handlePlayList(playList) {
      const bottom = playList.length > 0 ? "60px" : "";
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    goSinger() {
      this.$router.push({ name: "singer" });
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selectItem(song, index) {
      this.selectPlay({
        list: this.songs,
        index
      });
    },
    goback() {
      this.$router.back(-1); // 后退
    },
    random() {
      this.randomPlay({
        list: this.songs
      });
    },
    ...mapActions(["selectPlay", "randomPlay"])
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.music-list
  // width: 100%
  // height: 100%
  // z-index: 100
  text-align: center
  position: fixed
  top: 0
  left: 0
  bottom: 0
  right: 0
  font-size: 0
  // background-color: $color-background
  .list
    // position: relative
    overflow: hidden
    position: fixed
    top: 0
    bottom: 0
    height: 100%
    width: 100%
    background: $color-background
  .title-text
    margin-top: 0
    z-index: 200
    width: 100%
    line-height: 40px
    position: absolute
    top: 0
    left: 0
    font-size: $font-size-medium-x
    .icon-back
      position: absolute
      top: 0
      left: 20px
      color: $color-theme
      font-size: $font-size-large
  .bgImage
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    background-size: cover
    .play-wrapper
      position: absolute
      width: 100%
      bottom: 20px
      z-index: 50 // 防止背景阴影图遮盖
      .playBtn
        padding: 0 10px
        margin: 0 auto
        border-radius: 100px
        width: 135px
        height: 25px
        line-height: 25px
        padding: 2px 0
        border: 1px solid $color-theme
        color: $color-theme
        text-align: center
        .icon-play2
          display: inline-block
          vertical-align: center
          font-size: $font-size-medium-x
        .play-text
          display: inline-block
          vertical-align: center
          margin-left: 5px
          font-size: $font-size-small
    .filter
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      background: rgba(7, 17, 27, 0.4)
  .bg-layer
    position: relative
    height: 100%
    // background: $color-background
  .loader-wrapper
    position: absolute
    width 100%
    top: 50%
    transform: translateY(50%)
</style>
