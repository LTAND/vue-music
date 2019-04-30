<template>
  <div class="top-tip" v-show="showFlag">
    <h1>1111</h1>
  </div>
</template>

<script>
export default {
  data () {
    return {
      showFlag: false
    };
  },
  components: {},
  computed: {},
  methods: {
    show(){
      this.showFlag = true
    },
    hide(){
      this.showFlag = false
    }
  }
}

</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
  .top-tip
    position fixed
    width 100%
    top: 110px
    left: 0
    right: 0
    bottom: 0
    background red
    z-index 500
</style>
