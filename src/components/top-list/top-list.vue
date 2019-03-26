<template>
  <transition name="slide">
    <div class="top-list">
      <music-list :rank='rank' :title="title" :bg-image="bgImage" :songs="songs"></music-list>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'
import MusicList from 'components/music-list/music-list'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong } from 'common/js/song.js' 
export default {
  data () {
    return {
      songs: [],
      rank: true
    };
  },
  created(){
    this._getMusicList()
  }, 
  components: {
    MusicList
  },
  computed: {
    title(){
      return this.topList.topTitle
    },
    bgImage(){
      if(this.songs.length){
        return this.songs[0].img
      }
      return ''
    },
    ...mapGetters([
      'topList'
    ])
  },
  methods: {
    _getMusicList(){
      if(!this.topList.id){
        this.$router.push('/rank')
        return 
      }
      getMusicList(this.topList.id).then((res) => {
        if (res.code === ERR_OK) {
          this.songs = this._normalizeSongs(res.songlist)
        }
      })
    },
    _normalizeSongs(list){
      let ret = []
      list.forEach(item => {
        const musicData  = item.data
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

.top-list
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
