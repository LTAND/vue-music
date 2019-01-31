<template>
  <div class="music-list">
    <h1 class="title-text">{{title}}</h1>
    <div class="bgImage" :style="bgStyle" ref="bgImage">
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
  </div>
</template>

<script>
import SongList from "base/song-list/song-list";
import Scroll from "base/scroll/scroll";
import { mapActions } from "vuex";
const RESERVED_HEIGHT = 40;
export default {
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
    Scroll
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
      this.$refs.layer.style["webkitTransform"] = `translate3d(0,${translateY}px,0)`;
      console.log(translateY);
    }
  },
  methods: {
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
    ...mapActions(["selectPlay"])
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
    width: 100%
    z-index: 40
    line-height: 40px
    position: absolute
    top: 0
    left: 0
    font-size: $font-size-medium-x
  .bgImage
    position: relative
    width: 100%
    height: 0
    padding-top: 70%
    background-size: cover
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
</style>
