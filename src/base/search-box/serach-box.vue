<template>
  <div class="search-box">
    <i class="iconfont icon-search"></i>
    <input
      ref="query"
      v-model="query"
      class="content-search"
      type="text"
      :placeholder="placeholder"
    >
    <i @click="clear" v-show="query" class="iconfont icon-dismiss"></i>
  </div>
</template>

<script>
import debounce from "common/js/util.js";
export default {
  props: {
    placeholder: {
      type: String,
      default: "搜索歌曲、歌手"
    }
  },
  data() {
    return {
      query: ""
    };
  },
  methods: {
    clear() {
      this.query = "";
    },
    blur() {
      this.refs.query.blur();
    },
    setQuery(query) {
      this.query = query;
    }
  },
  created() {
    this.$watch("query", (newQuery)=>{
      //实时监听并派发
      this.$emit("query", newQuery)
    })
    // this.$watch("query",debounce(newQuery => {
    //     this.$emit(query, newQuery);
    //   }, 200)
    // );
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.search-box
  display: flex
  width: 100%
  height: 40px
  box-sizing: border-box
  padding: 0 6px
  background: #cccccc
  align-items: center
  background: $color-hightLight-background
  border-radius: 6px
  .icon-search
    flex: 0 0 25px
    font-size: 16px
    color: $color-background-d
  .icon-dismiss
    flex: 0 0 16px
    font-size: 16px
    color: $color-background-d
  .content-search
    border: none
    flex: 1 1 auto
    color: $color-text
    background: $color-hightLight-background
</style>
