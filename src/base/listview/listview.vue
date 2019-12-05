<template>
  <scroll
    :data="singers"
    :listenScroll="listenScroll"
    :probeType="probeType"
    @scroll="scroll"
    class="list-view"
    ref="ListView"
  >
    <div>
      <div v-for="group in singers" :key="group.id" class="list-group" ref="ListGroup">
        <div class="list-group-tilte">{{group.title}}</div>
        <ul>
          <li
            class="list-group-item"
            @click="selectItem(item)"
            v-for="item in group.item"
            :key="item.id"
          >
            <div class="icon">
              <img v-lazy="item.imgurl">
            </div>
            <div class="name">{{item.name}}</div>
          </li>
        </ul>
      </div>
    </div>
    <div
      class="list-shortcut"
      @touchstart="onShortCutTouchStart"
      @touchmove.stop.prevent="onShortCutTouchMove"
    >
      <!-- stop阻止冒泡与prevent事件默认行为 -->
      <ul>
        <li
          class="item"
          v-for="(item, index) in getShortCutList"
          :key="item.id"
          :data-index="index"
          :class="{active:currentIndex===index}"
        >
          <span>{{item}}</span>
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="fixed">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div class="loading-wrapper" v-show="!singers.length">
      <loading></loading>
    </div>
  </scroll>
</template>
<script>
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import { getData } from "common/js/dom.js";

const ANCHOR_HEIGHT = 18; // .list-shortcut > .item 的高度（包含字体，用浏览器观测得到）
const TITLE_HEIGHT = 30; // .fixed-title 的高度

export default {
  props: {
    singers: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1 // 计算临界要自动移动
    };
  },
  created() {
    // 在props和data()定义，则会被watch观测到
    this.touch = {};
    this.listHeight = [];
    this.probeType = 3; // 设置为滚动时派发scroll事件
    this.listenScroll = true;
  },
  computed: {
    getShortCutList() {
      // 获取单个字的列表
      let shortCutList = [];
      this.singers.map(item => {
        shortCutList.push(item.title.substr(0, 1));
      });
      return shortCutList;
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return "";
      }
      // 等待数据加载，才返回
      return this.singers[this.currentIndex]
        ? this.singers[this.currentIndex].title
        : "";
    }
  },
  methods: {
    selectItem(item) {
      this.$emit("select", item);
      // console.log(item)
    },
    scroll(pos) {
      // scroll组件的事件
      this.scrollY = pos.y;
    },
    onShortCutTouchStart(e) {
      let anchorIndex = getData(e.target, "index"); // 获取单字列表属性值index
      let firsTouch = e.touches[0];
      this.touch.y1 = firsTouch.pageY;
      this.touch.anchorIndex = anchorIndex;

      this._scrollTo(anchorIndex);
      // console.log(e.target);
      // console.log(e.touches);
    },
    onShortCutTouchMove(e) {
      let firsTouch = e.touches[0];
      this.touch.y2 = firsTouch.pageY;
      let delta = ((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT) | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;

      this._scrollTo(anchorIndex);
      // console.log("this.touch", this.touch);
      // console.log("anchorIndex:" + anchorIndex, "delta:" + delta);
    },
    _scrollTo(index) {
      // 根据index滑动元素
      if (!index && index !== 0) {
        // 点击index==null 无效
        return;
      }
      if (index < 0) {
        // shortcut 拖动到顶部
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        // shortcut 拖动到底部
        index = this.listHeight.length - 2;
      }
      // console.log(index);
      this.scrollY = -this.listHeight[index];
      this.$refs.ListView.scrollToElement(this.$refs.ListGroup[index], 0); // 移动元素 0->缓冲动画时间
    },
    _calculateHeight() {
      // 计算每一个list距离顶端的高度
      this.listHeight = [];
      const LIST = this.$refs.ListGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < LIST.length; i++) {
        height += LIST[i].clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  watch: {
    singers() {
      // 等待singer.vue传递的singers数据渲染20ms后再计算高度
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      // 滚动时 - 获取listGroup的currentIndex
      let listHeight = this.listHeight;
      if (newY > 0) {
        // 滚动顶部 - newY>0
        this.currentIndex = 0;
        return;
      }
      // 当滚动到中部 - newY<0
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i];
        let height2 = listHeight[i + 1];
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i;
          this.diff = height2 + newY; // 偏移的差值
          // console.log('偏移的差值:'+this.diff);
          return;
        }
      }
      // 滚到底部，且-newY>listHeight的最后一个元素的上限
      this.currentIndex = listHeight.length - 2;
    },
    diff(newVal) {
      // 根据偏移值变化计算
      let fixedTop =
        newVal > 0 && newVal < TITLE_HEIGHT ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTop === fixedTop) {
        return;
      }
      this.fixedTop = fixedTop;
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`;
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.list-view
  // 滚动样式开始
  // width: 100%
  height: 100%
  position: relative
  overflow: hidden
  // 滚动样式结束
  background-color: $color-background
  text-align: center
  font-size: 0
  .list-group
    text-align: left
  .list-group-tilte
    padding-left: 20px
    line-height: 30px
    background-color: $color-hightLight-background
    color: $color-text-l
    font-size: $font-size-small
  ul
    padding-left: 0
    list-style: none
    .list-group-item
      padding: 15px 0 15px 20px
      .icon
        display: inline-block
        vertical-align: middle
        width: 50px
        height: 50px
        img
          border-radius: 50%
          width: 100%
      .name
        display: inline-block
        vertical-align: middle
        font-size: $font-size-medium
        color: $color-text-l
        padding-left: 20px
  .list-shortcut
    position: absolute
    top: 10%
    right: 0.5%
    background-color: $color-background-d
    padding: 20px 0
    border-radius: 10px
    .item
      padding: 3px
      line-height: 1
      font-size: $font-size-small
      color: $color-text-l
      &.active
        color: $color-theme
  .list-fixed
    width: 100%
    position: absolute
    top: 0
    left: 0
    .fixed-title
      text-align: left
      padding-left: 20px
      line-height: 30px
      background-color: $color-hightLight-background
      color: $color-text-l
      font-size: $font-size-small
  .loading-wrapper
    position: absolute
    width: 100%
    top: 20%
    transition: translateY(-50%)
</style>
