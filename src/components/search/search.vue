<template>
  <div class="search">
    <search-box ref="SearchBox" @query="onQueryChange"></search-box>
    <div class="hot-key" v-show="!query">
      <div class="title">热门搜索</div>
      <div class="content">
        <span @click="addQuery(key.k)" v-for="key in hotKey" :key="key.id">{{key.k}}</span>
      </div>
    </div>
    <suggest v-show="query" :query="query"></suggest>
  </div>
</template>

<script>
import SearchBox from "base/search-box/serach-box";
import Suggest from 'components/suggest/suggest.vue'
import { createSong } from 'common/js/song.js' 
import { getHotKey, search } from "api/search.js";
import { ERR_OK } from "api/config.js";
export default {
  data() {
    return {
      hotKey: [],
      query: ''
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
  },
  methods: {
    onQueryChange(newQuery){
      this.query = newQuery 
    },
    addQuery(hotKey){
      this.$refs.SearchBox.setQuery(hotKey)
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data['hotkey'].slice(0, 10)
        }
      })
    }
  }

};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'
.search
  padding: 20px 20px 0 20px
  .hot-key
    display flex
    margin-top: 20px
    flex-flow column
    .title
      flex 1 1 auto
      margin-bottom: 20px
      font-size: $font-size-medium
      color: $color-text-l
    .content
      flex 1 1 auto
      span 
        display: inline-block
        font-size: 14px
        padding: 3px 9px
        border-radius: 6px 
        color: $color-text-d
        background: $color-hightLight-background
        margin:0 20px 10px 0       
</style>
