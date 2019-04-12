<template>
  <div class="search" ref="search">
    <search-box ref="SearchBox" @query="onQueryChange"></search-box>
    <div class="shortcut-wrapper" ref="shortcutWrapper" v-show="!query">
      <scroll class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-key" v-show="!query">
            <div class="title">热门搜索</div>
            <div class="content">
              <span @click="addQuery(key.k)" v-for="key in hotKey" :key="key.id">{{key.k}}</span>
            </div>
          </div>
          <search-list
            :searcHistory="searcHistory"
            @clear="openWindowClear"
            @delete="deleteHistory"
          ></search-list>
        </div>
      </scroll>
    </div>
    <suggest
      @select="savaSearch"
      @listScroll="blurInput"
      class="suggest"
      ref="suggest"
      v-show="query"
      :query="query"
    ></suggest>
    <confirm
      ref="Confirm"
      @confirm="clearSearcHistory"
      @cancel="closeWindowClear"
      title="是否清空所有搜索历史记录"
      confirmBtnText="清空"
    ></confirm>
  </div>
</template>

<script>
import SearchBox from "base/search-box/serach-box";
import Suggest from "components/suggest/suggest.vue";
import { createSong } from "common/js/song.js";
import { getHotKey, search } from "api/search.js";
import { ERR_OK } from "api/config.js";
import { playlistMixin } from "common/js/mixin.js";
import { mapActions, mapGetters, mapMutations } from "vuex";
import SearchList from "base/search-list/search-list";
import Confirm from "base/confirm/confirm";
import Scroll from "base/scroll/scroll";

export default {
  mixins: [playlistMixin],
  data() {
    return {
      hotKey: [],
      query: "",
      isClear: false
    };
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
            this.$refs.shortcut.refresh();
        }, 20);
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  },
  created() {
    this._getHotKey();
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searcHistory);
    },
    ...mapGetters(["searcHistory"])
  },
  methods: {
    savaSearch(){
      this.savaSearcHistory(this.query)
    },
    deleteHistory(item){
      this.deleteSearcHistory(item)
    },
    openWindowClear() {
      this.$refs.Confirm.show()
    },
    closeWindowClear() {
      this.$refs.Confirm.hide()
    },
    handlePlayList(playList) {
      // 留出播放器的高度
      const bottom = playList.length > 0 ? "60px" : 0;

      this.$refs.search.style.bottom = bottom;
      this.$refs.suggest.$refs.SuggestContent.refresh(); // srcoll组件刷新

      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.shortcut.refresh(); // srcoll组件刷新
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
    ...mapMutations({
      setSearchHistory: "SET_SEARCH_HISTORY"
    }),
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
  .shortcut-wrapper
    width: 100%
    position: fixed
    top: 178px
    left: 0
    right: 0
    bottom: 0
    .shortcut
      padding: 0 20px 0 20px
      height: 100%
      overflow: hidden
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
</style>
