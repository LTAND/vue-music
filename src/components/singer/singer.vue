<template>
  <div class="singer">
    <list-view @select="selectSinger" :singers="singers"></list-view>
    <!-- 二级歌手详情router -->
    <router-view></router-view>
  </div>
</template>

<script>
import { getSingerList } from "api/singer";
import { ERR_OK } from "api/config";
import Singer from "common/js/singer.js";
import ListView from "base/listview/listview";
import { mapMutations } from "vuex";
const HOT_NUM = 10;
const HOT_NAME = "热门";

export default {
  data() {
    return {
      singers: []
    };
  },
  created() {
    this._getSingerList();
  },
  components: {
    ListView
  },
  methods: {
    selectSinger(singer) {
      // console.log(singer)
      // 等同于this.$router.push({ path: `/singer/${singer.id}` });
      this.$router.push({ name: "singerdetail", params: { id: singer.id } });
      this.setSinger(singer);
    },
    _getSingerList() {
      // 获取歌手数据
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this.normalSinger(res.data.list);
          // console.log(this.singers);
        }
      });
    },
    normalSinger(list) {
      // 设置初始化歌手数据的排序
      let map = {
        hot: {
          title: HOT_NAME,
          item: []
        }
      };
      list.forEach((item, index) => {
        // 设置前10条歌手数据是热门
        if (index < HOT_NUM) {
          map.hot.item.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }
        // 设置字母数据
        const key = item.Findex; // 获取歌手字母
        // 不存在键名的字母，则创建
        if (!map[key]) {
          map[key] = {
            title: key,
            item: []
          };
        }
        map[key].item.push(
          new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          })
        );
      });
      // 序列化map,顺序hot,A~Z
      let hot = [];
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title === HOT_NAME) {
          hot.push(val);
        } else if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    ...mapMutations({
      setSinger: "SET_SINGER"
    })
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.singer
  position: fixed
  width: 100%
  top: 96px
  bottom: 0
</style>
