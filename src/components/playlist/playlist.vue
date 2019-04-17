<template>
  <!-- <transition name="list-fade"> -->
  <div class="playlist-wrapper" v-show="showFlag" @click="hide">
    <div class="playlist" @click.stop>
      <div class="list-header">
        <div class="title">
          <span @click="togglePalyMode"><i class="mode-icon" :class="clsModeIcon"></i></span>
          <span class="model-text">{{modeText}}</span>
          <span @click="showConfirm"><i class="iconfont icon-clean"></i></span>
        </div>
      </div>
      <scroll ref="listScroll" :data="sequenceList" class="list-scroll">
        <ul class="list" ref="listContent">
          <li class="list-item" v-for="(item, index) in sequenceList" v-bind:key="item.id" @click="selectItem(item, index)">
            <span><i class="current" :class="getCurrentIcon(item)"></i></span>
            <span class="name">{{item.name}}</span>
            <span><i class="iconfont icon-weishoucang"></i></span>
            <span @click="deleteOne(item)"><i class="iconfont icon-close"></i></span>
          </li>
        </ul>
      </scroll>
      <div class="add-btn-wrapper" @click="addSong">
        <div class="add-btn">
          <span><i class="iconfont icon-add"></i></span>
          <span class="text">添加歌曲到队列</span>
        </div>
      </div>
      <div class="list-close" @click="hide">
        <span class="text">关闭</span>
      </div>
    </div>
    <confirm ref="confirm" title="是否清空播放列表" confirmBtnText="清空" @confirm="deleteAll" @cancel="closeConfirm"></confirm>
  </div>
  <!-- </transition> -->
</template>

<script>
import { playMode } from "common/js/config.js"
import Scroll from 'base/scroll/scroll'
import Confirm from "base/confirm/confirm"
import { mapGetters, mapMutations, mapActions } from "vuex"
import { playerMixin } from "common/js/mixin.js"

export default {
  mixins:[playerMixin],
  data () {
    return {
      showFlag: false
    };
  },
  components: {
    Scroll,
    Confirm
  },
  computed: {
    // clsModeIcon(){
    //   switch(this.mode){
    //     case playMode.sequence:
    //       return "iconfont icon-sequence";
    //     case playMode.loop:
    //       return "iconfont icon-loop"
    //     case playMode.random:
    //       return "iconfont icon-random"
    //     default:
    //       return ""
    //   }
    // },
    modeText(){
      switch(this.mode){
        case playMode.sequence:
          return "顺序播放";
        case playMode.loop:
          return "单曲循环";
        case playMode.random:
          return "随机播放";
        default:
          return "";
      }
    }
    // ,...mapGetters([
    //   "sequenceList",
    //   "currentSong",
    //   "mode",
    //   "playList"
    // ])
  },
  methods: {
    getCurrentIcon(item){
      if(this.currentSong.id === item.id){
        return 'iconfont icon-play2'
      }
      return ''
    },
    show(){
      this.showFlag = true
      // 当playlist重新显示(DOM重新计算)时，滚动组件需要刷新
      setTimeout(()=>{
        this.$refs.listScroll.refresh()
        this.scrollToCurrent(this.currentSong) // 滚动当前歌曲
      }, 20)
    },
    hide(){
      this.showFlag = false
    },
    selectItem(item, index){
      if(this.mode === playMode.random){
        index = this.playList.findIndex((song)=>{
          return song.id === item.id
        })
      }
      // 单曲循环，顺序播放
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    addSong(){
      alert("addSong Page")
    },
    deleteOne(item){
      this.deleteSong(item)
      if(!this.playList.length){
        this.hide()
      }
    },
    showConfirm(){
      this.$refs.confirm.show()
    },
    deleteAll(){
      this.deleteSongList()
    },
    closeConfirm(){
      this.$refs.confirm.hide()
    },
    scrollToCurrent(current){
      // 快速滚动当前歌曲
      const index = this.sequenceList.findIndex((song)=>{
        return current.id === song.id
      })
      console.log(this.$refs.listContent.children[index])
      this.$refs.listScroll.scrollToElement(this.$refs.listContent.children[index], 300)
    },
    ...mapMutations({
      "setCurrentIndex": "SET_CURRENT_INDEX",
      "setPlayingState": "SET_PLAYING_STATE"
    }),
    ...mapActions([
      "deleteSong",
      "deleteSongList"
    ])
  },
  watch:{
    currentSong(newSong, oldSong){
      // 上下一首
      if(this.showFlag || newSong.id === oldSong.id){
        return
      }
      this.scrollToCurrent(newSong)
    }
  }
}

</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  @import "~common/stylus/variable"
  .playlist-wrapper
    position fixed
    top:0
    left:0
    right: 0
    bottom: 0
    background: $color-background-d
    z-index 200
    // 渐显动画
    // &.list-fade-enter-active, &.list-fade-leave-active
    //   transition: opacity 0.3s
    //   .playlist
    //     transition: all 0.3
    .playlist
      width: 100%
      position: absolute
      bottom: 0
      left: 0
      background: $color-hightLight-background
      .list-header
        padding 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .mode-icon
            width: 30px
            height: 30px
            color: $color-theme-d
            font-size: 30px
          .model-text
            flex: 1
            margin-left: 10px
            font-size: $font-size-medium
            color: $color-text-l
          .icon-clean
            color: $color-text-d
      .list-scroll
        max-height 240px 
        overflow hidden  
        .list
          height 100% 
          overflow hidden
          padding-left: 0
          list-style: none
          .list-item
            display flex
            height 40px
            align-items: center
            padding 5px 30px 5px 20px
            .current
              flex 0 0 20px
              display inline-block
              width 20px
              text-align right 
              font-size: $font-size-medium 
              color $color-theme-d
              margin-right: 5px
            .name
              flex: 1
              color: $color-text-d
              font-size: $font-size-medium
            .icon-weishoucang
              color: $color-theme
              font-size: $font-size-medium
              margin-right: 10px
            .icon-close
              color: $color-theme
              font-size: $font-size-medium-x
      .add-btn-wrapper
        padding: 10px 0 20px 0 
        .add-btn
          width 120px
          text-align center
          margin:0 auto
          padding:5px 10px
          border-radius: 20px
          border: 1px $color-text-l solid
          color: $color-text-l
          .icon-add
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align center
        line-height 50px
        height 50px
        background: $color-background-d
        color: $color-text-l
</style>

