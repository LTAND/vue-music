<template>
  <div class="user-center">
    <div class="title">
        <div class="back"><i @click="goBack()" class="iconfont icon-back"></i></div>
        <switches :switches="switches" :currentIndex="switchIndex" @switch="switchItem"></switches>
    </div>
    <div class="content">
      <div class="playBtn" @click="random">
        <i class="iconfont icon-play2"></i>
        <span class="play-text">随机播放全部</span>
      </div>
      <div class="scroll-wrapper">
        <scroll class="list-scroll" :data="favoriteList" v-if="switchIndex === FAVORITE_LIST_INDEX">
          <div class="inner">
            <song-list class="song-list" :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll class="list-scroll" :data="playHistory" v-if="switchIndex === PLAY_HISTORY_INDEX">
          <div class="inner">
            <song-list class="song-list" :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
    </div>
  </div>
</template>

<script>
import Switches from "base/switches/switches";
import SongList from "base/song-list/song-list"
import Scroll from "base/scroll/scroll"
import { mapGetters,mapActions } from "vuex"
import Song from "common/js/song.js"
   
export default {
  data() {
    return {
      switches: [
        { name: "我喜欢的" }, 
        { name: "最近播放" }
      ],
      switchIndex: 0,
      showFlag: false,
      FAVORITE_LIST_INDEX: 0,
      PLAY_HISTORY_INDEX: 1
    };
  },
  components: {
    Switches,
    SongList,
    Scroll
  },
  computed: {
    ...mapGetters([
      "favoriteList",
      "playHistory"
    ])
  },
  methods: {
    random(){
      let list = this.switchIndex === this.FAVORITE_LIST_INDEX?this.favoriteList:this.playHistory
      list = list.map((song)=>{
        return new Song(song)
      })
      this.randomPlay({ list })
    },
    goBack() {
      this.$router.back(-1);
    },
    switchItem(index){
      this.switchIndex = index
    },
    selectSong(song){
      this.insertSong(new Song(song))
    },
    ...mapActions([
      "insertSong",
      "randomPlay"
    ])
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'
.user-center
  width: 100%
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: $color-background
  .title
    width 100%
    height 20px
    margin-bottom: 35px
    font-size: $font-size-medium
    padding: 10px 5px
    text-align center
    position relative
    .back
      position absolute
      top: 15px
      left: 15px
      color: $color-theme
      .icon-back
        font-size: $font-size-large-x
  .content
    width 100%
    font-size: $font-size-medium
    .playBtn
      padding: 0 10px
      margin: 0 auto
      border-radius: 100px
      width: 135px
      height: 25px
      line-height: 25px
      padding: 2px 0
      border: 1px solid $color-text
      color: $color-text
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
    .scroll-wrapper
      width 100%
      position fixed
      top: 20%
      left: 0
      right: 0
      bottom: 0
      .list-scroll
        height 100%
        overflow hidden
</style>
