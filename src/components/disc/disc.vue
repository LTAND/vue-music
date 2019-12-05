<template>
  <transition name="slide">
    <div class="disc">
      <MusicList :title="title" :bg-image="bgImage" :songs="songs"></MusicList>
    </div>
  </transition>

</template>

<script>
import MusicList from "components/music-list/music-list";
import axios from 'axios'
import { mapGetters } from 'vuex'
import { getSongList } from 'api/recommend'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song.js'

export default {
  data () {
    return {
      songs: []
    };
  },
  created(){
    this._getSongList()
  },
  components: {
    MusicList
  },
  computed: {
    title(){
      return this.disc.dissname
    },
    bgImage(){
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
      ])
  },
  methods: {
    _getSongList(){
      getSongList(this.disc.dissid).then((res)=>{
        if(res.code === ERR_OK){
          this.songs = this._normalizSongs(res.cdlist[0].songlist)
        }
      })
    },
    _normalizSongs(list){
      let ret = []
      list.forEach(musicData => {
        if(musicData.songid && musicData.albummid){
         ret.push(createSong(musicData))
        }
      });
      return ret
    }
  }
}

</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.disc
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
