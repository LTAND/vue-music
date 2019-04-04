<template>
  <div class="search" ref="search">
    <search-box ref="SearchBox" @query="onQueryChange"></search-box>
    <div class="hot-key" v-show="!query">
      <div class="title">热门搜索</div>
      <div class="content">
        <span @click="addQuery(key.k)" v-for="key in hotKey" :key="key.id">{{key.k}}</span>
      </div>
    </div>
    <div class="search-history" v-show="history.length">
      <span class="title">历史记录</span>
      <ul class="content">
        <li v-for="item in history" :key="item.id">
          <span>{{item}}</span>
          <span @click="deleteSearcHistory(item)"><i class="iconfont icon-close"></i></span>
        </li>
      </ul>
    </div>
    <suggest
      @select="savaSearch"
      @listScroll="blurInput"
      class="suggest"
      ref="suggest"
      v-show="query"
      :query="query"
    ></suggest>
  </div>
</template>

<script>
import SearchBox from "base/search-box/serach-box";
import Suggest from "components/suggest/suggest.vue";
import { createSong } from "common/js/song.js";
import { getHotKey, search } from "api/search.js";
import { ERR_OK } from "api/config.js";
import { playlistMixin } from "common/js/mixin.js";
import { mapActions, mapGetters } from "vuex";

export default {
  mixins: [playlistMixin],
  data() {
    return {
      hotKey: [],
      query: ""
    };
  },
  components: {
    SearchBox,
    Suggest
  },
  created() {
    this._getHotKey();
  },
  computed: {
    history(){
      return this.searcHistory()
    }
  },
  methods: {
    deleteSearcHistory(item){
      this.deleteSearcHistory(item)
    },
    savaSearch() {
      this.savaSearcHistory(this.query);
    },
    handlePlayList(playList) {
      // 留出播放器的高度
      const bottom = playList.length > 0 ? "60px" : 0;
      this.$refs.search.style.bottom = bottom;
      this.$refs.suggest.$refs.SuggestContent.refresh();
    },
    onQueryChange(newQuery) {
      this.query = newQuery;
    },
    addQuery(hotKey) {
      this.$refs.SearchBox.setQuery(hotKey);
    },
    blurInput() {
      this.$refs.SearchBox.blur();
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data["hotkey"].slice(0, 10);
        }
      });
    },
    ...mapGetters([
      "searcHistory"
    ]),
    ...mapActions([
      "savaSearcHistory",
      "deleteSearcHistory",
      "clearSearcHistory"
    ])
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.search
  padding: 20px 20px 0 20px
  .hot-key
    display: flex
    margin-top: 20px
    flex-flow: column
    .title
      flex: 1 1 auto
      margin-bottom: 20px
      font-size: $font-size-medium
      color: $color-text-l
    .content
      flex: 1 1 auto
      span
        display: inline-block
        font-size: 14px
        padding: 3px 9px
        border-radius: 6px
        color: $color-text-d
        background: $color-hightLight-background
        margin: 0 20px 10px 0
  .search-history
    display: flex
    margin-top: 20px
    flex-flow: column
    .title
      flex: 1 1 auto
      margin-bottom: 20px
      font-size: $font-size-medium
      color: $color-text-l
    .content
      flex: 1 1 auto
      list-style: none
      padding-left: 0 
      li
        justify-content flex-end
        flex 1 1 auto
        align-items: center 
        span
          display: inline-block
          font-size: 14px
          color: $color-text-d
</style>
