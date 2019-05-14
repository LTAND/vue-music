<template>
  <div class="user-center">
    <div class="title">
      <span>
        <i @click="goBack()" class="iconfont icon-back"></i>
      </span>
    </div>
    <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
  </div>
</template>

<script>
import Switches from "base/switches/switches";
export default {
  data() {
    return {
      switches: [
        { name: "我喜欢的" }, 
        { name: "最近播放" }
      ],
      currentIndex: 0
    };
  },
  components: {
    Switches
  },
  computed: {},
  methods: {
    goBack() {
      this.$router.back(-1);
    },
    switchItem(index){
      this.currentIndex = index
    }
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
.user-center
  width: 100%
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  background: #ccc
</style>
