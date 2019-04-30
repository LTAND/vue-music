<template>
  <ul class="switches">
    <li
      v-for="(item,index) in switches"
      :key="item.id"
      class="switch-item"
      @click="selectItem(item, index)"
      :class="{'active':currentIndex === index}"
    ><span>{{item.name}}</span></li>
  </ul>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    switches: {
      type: Array,
      default: []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  components: {
  },
  computed: {},
  methods: {
    selectItem(item, index){
      this.$emit("switch", index)
    }
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'
.switches
  display: flex
  align-items: center
  width 240px
  list-style: none
  margin: 0 auto
  padding-left: 0
  text-align center
  border: 1px solid $color-hightLight-background
  border-radius: 5px
  .switch-item
    flex 1
    padding: 5px 8px
    font-size: $font-size-medium
    color: $color-text-d
    &.active
      background:  $color-hightLight-background
      color: $color-text
</style>
