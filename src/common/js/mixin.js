import { mapGetters, mapMutations } from 'vuex'
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
      "sequenceList"
    ])
  },
  methods: {
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
    }
  }
}
