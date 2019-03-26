<template>
  <div class="search">
    <search-box></search-box>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/serach-box' 
export default {
  data () {
    return {
      };
  },

  components: {
    SearchBox
  },

  computed: {},

  methods: {}
}

</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'
.search 
  padding:10px 20px 0 20px

</style>
