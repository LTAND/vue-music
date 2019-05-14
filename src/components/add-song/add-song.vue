<template>
  <div class="add-song-wrapper" v-show="showFlag" @click.stop>
    <div class="add-song-content">
      <div class="tilte">
        <span>添加歌曲到列表</span>
        <span @click="hide" class="close">
          <i class="iconfont icon-close"></i>
        </span>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" class="search-box" placeholder="搜索歌曲" @query="onQueryChange"></search-box>
      </div>
      <div class="shorcut" v-show="!query">
        <switches @switch="switchItem" :currentIndex="switcheIndex" :switches="switches"></switches>
        <div class="list-scroll-wrapper">
          <scroll ref="songScrollList" class="list-scroll" v-if="switcheIndex === 0" :data="playHistory">
            <div class="list-inner">
              <song-list class="song-list" :songs="playHistory" @select="selectSong"></song-list>
            </div>
          </scroll>
          <scroll ref="searchScrollList" :refreshDelay="refreshDelay" class="list-scroll" v-if="switcheIndex === 1" :data="searcHistory">
            <div class="list-inner">
              <search-list
                ref="searchList"
                class="search-list"
                :titleFlag="false"
                :searcHistory="searcHistory"
                @select="selectSuggest"
                @delete="deleteSearcHistory"
              ></search-list>
            </div>
          </scroll>
        </div>
      </div><!-- shorcut -->
    </div><!-- add-song-content -->

    <div class="search-result" v-show="query">
      <suggest
        class="suggest"
        :query="query"
        @select="saveSearch"
        :showSiger="showSinger"
        @listScroll="blurInput"
      ></suggest>
    </div>

    <top-tip class="top-tip" ref="topTip">
      <div class="top-tip-title">
        <span class="test">1首歌曲已添加到列表</span>
      </div>
    </top-tip>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import Switches from "base/switches/switches";
import SearchBox from "base/search-box/search-box";
import Suggest from "components/suggest/suggest.vue";
import { searchMixin } from "common/js/mixin.js";
import Scroll from "base/scroll/scroll";
import SongList from "base/song-list/song-list";
import SearchList from "base/search-list/search-list";
import TopTip from "base/top-tip/top-tip"

const PLAY_HISTORY_INDEX = 0
const SEARCH_HISTORY_INDEX = 1

export default {
  mixins: [searchMixin],
  data() {
    return {
      // search-box
      showSinger: false,
      showFlag: false,

      // switches
      switches: [{ name: "最近播放" }, { name: "搜素历史" }],
      switcheIndex: 0
    };
  },
  components: {
    SearchBox,
    Switches,
    Suggest,
    Scroll,
    SongList,
    SearchList,
    TopTip
  },
  computed: {
    ...mapGetters(["searcHistory", "playHistory"])
  },
  methods: {
    selectSuggest(){
      this.saveSearch()
      this.showTip() // 显示添加歌曲提示
    },
    switchItem(index) {
      this.switcheIndex = index;
    },
    showTip(){
      this.$refs.topTip.show()
    },
    selectSong(){
      if(index !==0){
        this.insertSong(new Song(song));
        this.showTip()
      }
    },
    show() {
      this.showFlag = true;
      setTimeout(()=>{
      // 显示add-song页面时候，刷新滚动组件的高度
        switch(this.switcheIndex){
          case PLAY_HISTORY_INDEX:
            this.$refs.songScrollList.refresh()
            break;
          case SEARCH_HISTORY_INDEX:
            this.$refs.searchScrollList.refresh()
            break;
        }
      }, 20)
    },
    hide() {
      this.showFlag = false;
    },
    ...mapActions(["insertSong"])
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.add-song-wrapper
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  width: 100%
  background-color: $color-background
  .add-song-content
    padding: 0 20px
    .tilte
      position: relative
      height: 44px
      line-height: 44px
      text-align: center
      font-size: $font-size-large
      .close
        position: absolute
        top: 0
        right: -1%
        .icon-close
          font-size: $font-size-large-x
          color: $color-theme
    .search-box
      margin: 20px 0px
    .shorcut
      .list-scroll-wrapper
        width: 100%
        position: fixed
        top: 165px
        left: 0
        right: 0
        bottom: 0
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            .search-list
              padding: 0 30px
  .top-tip
    text-align center
    padding: 10px 5px
    text-align: $color-text
</style>


