<template>
  <div class="search-list" v-show="searcHistory.length">
    <div class="title" v-if="titleFlag">
      <span class="text">搜索历史</span>
      <span class="clear" @click="clearAll">
        <i class="iconfont icon-close"></i>
      </span>
    </div>
    <transition-group name="list" tag="ul" class="content" >
      <li v-for="item in searcHistory" :key="item" @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <!-- 阻止向上冒泡点击 -->
        <span class="delete" @click.stop="delelteOne(item)">
          <i class="iconfont icon-close"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script>
export default {
  props:{
    searcHistory:{
      type:Array,
      default: []
    },
    titleFlag:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {};
  },
  components: {},
  computed: {},
  methods: {
    selectItem(item){
      this.$emit("select", item)
    },
    delelteOne(item){
      this.$emit("delete", item)
    },
    clearAll(){
      this.$emit("clear")
    }
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.search-list
  margin-top: 25px
  flex-direction: column
  .title
    display: flex
    font-size: $font-size-medium
    color: $color-text-l
    .text
      flex: 1 1 auto
  .content
    list-style: none
    padding-left: 0
    &.list-enter-active, &.list-leave-active
      transition: all 0.1s
    &.list-enter, &.list-leave
      height 0
    li
      padding: 10px 0
      display: flex
      font-size: 14px
      color: $color-text-d
      .text
        flex: 1 1 auto
</style>
