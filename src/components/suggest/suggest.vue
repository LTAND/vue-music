<template>
    <srocll class="suggest-content" :data="result" :pullup="pullup" @scrollToEnd="searchMore">
        <ul class="suggest-list">
          <li class="suggest-item" v-for="item in result" :key="item.id">
            <div class="name">
              <i class="iconfont icon-time"></i>
              <p class="text">{{nameText(item)}}</p>
            </div>
          </li>
        </ul>
    </srocll>
</template>

<script>
import { search } from "api/search.js";
import { ERR_OK } from "api/config.js";
import { createSong } from 'common/js/song'
import Srocll from 'base/scroll/scroll'
const TYPE_SINGER = 'singer'
const perpage = 20 // 改变每一页搜索个数
export default {
  props: {
    query: {
      type: String,
      dafeult: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    },
    pullup:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      hasMore: true
    };
  },
  components: {
    Srocll
  },
  computed: {
    },
  methods: {
    nameText(item){
      if(item.type === TYPE_SINGER){
        return item.singername
      }else{
        return `${item.name}-${item.singer}`
      }
    },
    _search() {
      search(this.query, this.page, this.showSinger,perpage).then(res=>{
        if(res.code === ERR_OK){
          this.hasMore = this._checkMore(res.data)
          this.result = this._genResult(res.data)
          console.log("res", res.data)
          console.log("result", this.result)
        }
      })
    },
    searchMore(){
      if(!this.hasMore){
        return 
      }
    },
    _checkMore(data){
      const song = data.song
      const isTotalEnd = song['totalnum'] < song['curnum']+song['curpage'] * perpage?true:false
      if(!data.list.length || isTotalEnd){
        return false
      }else{
        return true
      }
    },
    _genResult(data){
      let ret = []
      if(data.zhida && data.zhida.singerid ){
      // 判断是歌手，首先添加歌手消息
        ret.push({...data.zhida, ...{type: TYPE_SINGER}})
      }
      if(data.song){
      // 添加所有相关联的歌
        ret = ret.concat(this._normalizeSongs(data.song.list))
      }
      return ret 
    },
    _normalizeSongs(list){
      // 格式化
      let ret = []
      list.forEach(musicData => {
        if(musicData.songid && musicData.albummid){
          ret.push(createSong(musicData))
        }
      });
      return ret
    }
  },
  watch:{
    query(){
      this._search() // 搜索接口
    }
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.suggest-content
  height 100%
  overflow hidden
  background $color-background 
  .suggest-list
    padding-left:0
    list-style: none 
    .suggest-item
      .name
        display flex
        align-items: center
        overflow hidden
        .icon-time
          flex: 0 1 16px
          display inline-block
        .text
          flex: 1
          margin-left:10px
          display inline-block
          no-wrap()
</style>
