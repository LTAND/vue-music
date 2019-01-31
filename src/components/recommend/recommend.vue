<template>
  <div class="recommend">
    <scroll ref="scroll" :data="discList" class="recommed-content">
      <div>
        <!-- div为了将slider组件包含一起垂直滚动 -->
        <!-- v-if获取完get的内容执行插槽 -->
        <div v-if="slider.length" class="slider-wrapper" ref="sliderWrapper">
          <slider>
            <div class="slider-item" v-for="item in slider" :key="item.id">
              <a :href="item.linkUrl">
                <img class="needsclick" @load="loadImage" :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommed-list">
          <div class="list-title">热门歌单推荐</div>
          <ul class="disc-list">
            <li class="item" v-for="item in discList" :key="item.id">
              <div class="item-icon">
                <img v-lazy="item.imgurl">
              </div>
              <div class="item-text">
                <div class="name">{{item.creator.name}}</div>
                <div class="desc">{{item.dissname}}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="loader-wrapper" v-show="!discList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script>
import { getRecommend, getDiscList } from "api/recommend";
import { ERR_OK } from "api/config";
import Slider from "base/slider/slider";
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
export default {
  data() {
    return {
      slider: [],
      discList: []
    };
  },
  created() {
    this._getRecommend();
    this._getDiscList();
    // setTimeout(() => {
    // }, 10000);
  },
  methods: {
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          // banner图片数据
          this.slider = res.data.slider;
        }
      });
    },
    _getDiscList() {
      getDiscList().then(res => {
        if (res.code === ERR_OK) {
          // 歌单数据
          this.discList = res.data.list;
        }
      });
    },
    loadImage() {
      if (!this.checkloaded) {
        // 由于可能轮播图还未渲染,已经计算好高度，所以要重新滚动对象要重新refresh
        this.$refs.scroll.refresh();
        this.checkloaded = true;
      }
    }
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.recommend
  // 滚动样式
  width: 100%
  position: fixed
  top: 96px
  bottom: 0
  // 滚动样式
  font-size: 0
  background-color: $color-background
  .recommed-content
    position: relative
    // 滚动样式
    height: 100%
    overflow: hidden
    // 滚动样式
    .loader-wrapper
      position: absolute
      width: 100%
      top: 30%
      transform: translateY(-50%) // 垂直居中对齐
    .slider-wrapper
      // position relative
      // width 100%
      overflow: hidden
    .recommed-list
      text-align: left
      .list-title
        padding: 20px 0
        text-align: center
        font-size: $font-size-small
        color: $color-theme
      ul
        padding-left: 0
        list-style: none
        .item
          padding: 0 20px 20px 20px
          .item-icon
            display: inline-block
            vertical-align: middle
            width: 60px
            height: 60px
            padding-right: 20px
            img
              width: 100%
          .item-text
            display: inline-block
            vertical-align: middle
            .name
              padding-bottom: 10px
              font-size: $font-size-small
              color: $color-text
            .desc
              font-size: $font-size-small-s
              color: $color-text-d
</style>
