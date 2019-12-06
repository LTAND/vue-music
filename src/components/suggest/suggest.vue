<template>
  <div class="suggest">
    <srocll
      class="suggest-content"
      ref="SuggestContent"
      :data="result"
      :pullup="pullup"
      :beforeScroll="beforeScroll"
      @beforeScroll="listScroll"
      @scrollToEnd="searchMore"
    >
      <ul class="suggest-list">
        <li class="suggest-item" @click="selectSuggest(item)" v-for="item in result" :key="item.id">
          <div class="name">
            <i class="iconfont icon-time"></i>
            <p class="text">{{nameText(item)}}</p>
          </div>
        </li>
        <div class="result-tip">
          <loading class="laoding" v-show="hasMore" title></loading>
          <div v-show="!hasMore && !result.length">抱歉，暂时无搜素结果</div>
        </div>
      </ul>
    </srocll>
  </div>
</template>

<script>
import { search } from "api/search.js";
import { ERR_OK } from "api/config.js";
import { createSong } from "common/js/song";
import { getSongVkey } from "api/song";
import Singer from "common/js/singer";
import { mapActions, mapMutations, mapGetters } from "vuex";
import Loading from "base/loading/loading";
import Srocll from "base/scroll/scroll";

const TYPE_SINGER = "singer";
const perpage = 20; // 改变每一页搜索个数
export default {
  props: {
    query: {
      type: String,
      dafeult: ""
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      hasMore: true,
      pullup: true, // 派发scrollToEnd事件
      beforeScroll: true // 派发beforeScroll事件
    };
  },
  components: {
    Srocll,
    Loading
  },
  computed: {},
  methods: {
    selectSuggest(item) {
      // 点击选择搜素结果中有歌曲或歌手
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername
        });
        this.$router.push({ name: "singerdetail", params: { id: singer.id } });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
      this.$emit('select', item) // 派发处理搜素历史
    },
    nameText(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    _search() {
      // 每次重新搜索前,重置数据
      this.page = 1;
      this.hasMore = true;
      this.$refs.SuggestContent.scrollTo(0, 0);

      // 搜索接口请求
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this._genResult(res.data);
          this.hasMore = this._checkMore(res.data);
          // console.log("res", res.data);
          // console.log("result", this.result);
        }
      });
    },
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.result = this.result.concat(this._genResult(res.data));
          this.hasMore = this._checkMore(res.data);
        }
      });
    },
    listScroll() {
      this.$emit("listScroll")
    },
    _checkMore(data) {
      const song = data.song;
      const isTotalEnd =
        song["totalnum"] < song["curnum"] + song["curpage"] * perpage;
      if (!song.list.length || isTotalEnd) {
        return false;
      } else {
        return true;
      }
    },
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid) {
        // 判断是歌手，首先添加歌手消息
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }
      if (data.song) {
        // 在是歌手上，添加所有相关联的歌
        ret = ret.concat(this._normalizeSongs(data.song.list));
      }
      return ret;
    },
    _normalizeSongs(list) {
      // 格式化
      let ret = [];
      list.forEach(musicData => {
        // console.log(musicData)
        // getSongVkey(musicData.songmid).then(res => {
        //   if (musicData.songid && musicData.albummid) {
        //     ret.push(createSong(musicData, res.data.items[0].vkey))
        //   }
        // })
        let vkey = "8EDA36E324125A6A4CF07D3C7DB251BD5582FFD28EF436D6F51EB252F73678E773A0C4174C783FCBFB69012A6F7A67B905F03DFC166EB963"
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData, vkey))
        }
      });
      return ret;
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    }),
    ...mapActions(["insertSong"])
  },
  watch: {
    query() {
      this._search(); // 搜索接口
    }
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.suggest
  position: fixed
  width: 100%
  top: 150px
  left: 0
  bottom: 0
  .suggest-content
    height: 100%
    padding: 0 20px
    overflow: hidden
    background: $color-background
    .suggest-list
      padding-left: 0
      list-style: none
      .suggest-item
        .name
          display: flex
          align-items: center
          overflow: hidden
          font-size: $font-size-medium
          color: $color-text-d
          .icon-time
            flex: 0 1 16px
            display: inline-block
            margin-left: 5px
          .text
            flex: 1
            margin-left: 10px
            display: inline-block
            no-wrap()
      .result-tip
        // width 100%
        text-align: center
        padding: 5px
        color: $color-text-d
</style>
