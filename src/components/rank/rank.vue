<template>
  <div class="rank">
    <scroll class="rank-content" :data="topList">
      <div>
        <ul class="top-list">
          <li @click="selectSong(top)" class="top-item" v-for="top in topList" :key="top.id">
            <div class="icon">
              <img width="100%" height="100%" v-lazy="top.picUrl" alt="">
            </div>
            <div class="content-wrapper">
              <div class="content">
                <p v-for="(item, index) in top.songList" :key="item.id">
                  <span>{{index+1}}</span>
                  <span>{{item.singername}}-{{item.songname}}</span>
                </p>
              </div>
            </div>
          </li>
        </ul>        
      </div>
      <div class="loading-wrapper" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
import { getTopList } from 'api/rank.js'
import { ERR_OK } from 'api/config.js'
import Scroll from 'base/scroll/scroll'
import Loading from "base/loading/loading";
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      topList: []
    };
  },
  created() {
    this._getTopList()
  },
  components: {
    Scroll,
    Loading
  },
  computed: {
  },
  methods: {
    selectSong(top){
      this.$router.push({name:"rankdetail", params: {id: top.id}})
      this.setTopList(top)
    },
    _getTopList(){
      getTopList().then((res)=>{
        if(res.code === ERR_OK){
          this.topList = res.data.topList
        }
      })
    },
    ...mapMutations({
      setTopList: 'SET_TOP_LIST'
    })
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'
.rank
  width 100%
  position: fixed
  top: 96px
  bottom: 0
  .rank-content
    height 100%
    overflow: hidden
    .top-list
      list-style: none
      padding-left: 0
      font-size: 0
      padding: 0 20px
      &:first-of-type
        padding-top: 10px
      .top-item
        width 100%
        padding-bottom: 20px
        text-align center
        .icon
          display: inline-block
          vertical-align top
          width 32%
          height 100px
        .content-wrapper
          display:inline-block
          vertical-align: top
          background $color-hightLight-background
          width 68%
          height 100px
          .content
            width: 80%
            padding: 0 20px
            display: inline-block
            text-align: left
            color: $color-text-d 
            font-size $font-size-small
            p
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
  .loading-wrapper
    width 100%
    position absolute
    top:20%
    transform: translateY(50%)
</style>
