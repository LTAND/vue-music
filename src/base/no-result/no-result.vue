<template>
  <div class="no-result">
      <div class="no-result-icon"></div>
      <p class="no-result-desc">{{title}}</p>
  </div>
</template>

<script>
// TODO working this no-result.vue 2018/5/17
export default {
  props: {
    title:{
      type: String,
      default:"当前为默认提示文字属性title"
    },
    font:{
      type: Number,
      default: 0
    }
  },
  data () {
    return {
    };
  },

  components: {},
  computed: {},
  methods: {}
}

</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.no-result
  text-align center
  .no-result-icon
    width 86px
    height 90px
    margin: 0 auto
    bg-image("no-result")
    background-size: 86px 90px
  .no-result-desc
    margin-top: 20px
    color: $color-dialog-background
/* 
  外部套用
  .no-resilt-wrapper
    position absolute 
    width 100%
    top: 50%
    transform translateY(-50%) 
*/
</style>
