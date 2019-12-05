<template>
  <transition name="slide">
    <div class="singer-detail">
      <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";
import { getSingerDetail } from "api/singer";
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";
import MusicList from "components/music-list/music-list";
export default {
  data() {
    return {
      songs: []
    };
  },
  components: {
    MusicList
  },
  created() {
    if (!this.singer.id) {
      // 没有获取到id,则回到歌手页面
      this.$router.push({ name: "singer" });
      return;
    }
    this._getSingerDetail(this.singer.id);
  },
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.imgurl;
    },
    ...mapGetters(["singer"])
  },
  methods: {
    _getSingerDetail(id) {
      // 获取歌手原始的歌曲数据
      getSingerDetail(id).then(res => {
        if (res.code === ERR_OK) {
          // console.log(res.data.list);
          this.songs = this._normalizeSongs(res.data.list);
          // console.log(this.songs);
        }
      });
    },
    _normalizeSongs(list) {
      let ret = [];
      list.forEach(item => {
        let { musicData } = item;
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData)); // 格式化每一首歌曲
        }
      });
      return ret;
    }
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.singer-detail
  width: 100%
  height: 100%
  text-align: center
  position: fixed
  top: 0
  left: 0
  z-index 200
  background-color: $color-background
.slide-enter-active, .slide-leave-active
  transition: all 0.3s
.slide-enter, .slide-leave-to
  // 从右到左滑动
  transform: translate3d(100%, 0, 0)
</style>
