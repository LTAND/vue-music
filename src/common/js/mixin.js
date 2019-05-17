import { mapGetters, mapActions, mapMutations } from 'vuex'
import { playMode } from "./config"
import { shuffle } from './util'
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playList'
    ])
  },
  mounted() {
    this.handlePlayList(this.playList)
  },
  activated() {
    this.handlePlayList(this.playList)
  },
  watch: {
    playList(newVal) {
      this.handlePlayList(newVal)
    }
  },
  menthod: {
    handlePlayList() {
      throw new Error('compent must implement handlePlayList')
    }
  }
}
/* player.vue player-list.vue 共享收藏功能 */
export const playerMixin = {
  computed: {
    clsModeIcon() {
      switch (this.mode) {
        case playMode.sequence:
          return "iconfont icon-sequence";
        case playMode.loop:
          return "iconfont icon-loop"
        case playMode.random:
          return "iconfont icon-random"
        default:
          return ""
      }
    },
    ...mapGetters([
      "currentIndex",
      "mode",
      "playing",
      "currentSong",
      "sequenceList",
      "favoriteList"
    ])
  },
  methods: {
    /* 收藏功能 */
    isFavorite(song) {
      // 判断是否在收藏列表
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1 // 收藏此歌曲为true
    },
    clsFavoriteIcon(song) {
      // 切换图标状态
      if (this.isFavorite(song)) {
        return "iconfont icon-yishoucang"
      } else {
        return "iconfont icon-weishoucang"
      }
    },
    toggleFavorite(song) {
      // 增删收藏列表
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    togglePalyMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (mode === playMode.sequence) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentSong(list)
      this.setPlayList(list)
    },
    resetCurrentSong(list) {
      let index = list.findIndex(item => {
        if (item.id === this.currentIndex.id) {
          return true;
        } else {
          return false;
        }
      });
      this.setCurrentIndex(index);
    },
    ...mapMutations({
      "setPlayMode": "SET_PLAY_MODE",
      "setPlayList": "SET_PLAYLIST"
    }),
    ...mapActions([
      "saveFavoriteList",
      "deleteFavoriteList"
    ])
  }
}

export const searchMixin = {
  data() {
    return {
      query: "",
      refreshDelay: 100 // 保证search-list动画完成后，再refresh()
    }
  },
  computed: {
    ...mapGetters(["searcHistory"])
  },
  methods: {
    saveSearch() {
      this.saveSearcHistory(this.query)
    },
    onQueryChange(newQuery) {
      this.query = newQuery;
    },
    addQuery(hotKey) {
      this.$refs.SearchBox.setQuery(hotKey);
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    ...mapMutations({
      setSearchHistory: "SET_SEARCH_HISTORY"
    }),
    ...mapActions([
      "saveSearcHistory",
      "deleteSearcHistory"
    ])
  }
}
