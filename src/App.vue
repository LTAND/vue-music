<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view/>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from "components/m-header/m-header";
import Tab from "components/tab/tab";
import Player from "components/player/player";
import vConsole from "vconsole";
export default {
  name: "App",
  components: {
    MHeader,
    Tab,
    Player
  }
};
</script>

<style lang="stylus" scoped>
@import 'common/stylus/cssreset.styl'
@import 'common/stylus/base.styl'

#app
  width: 100%
  height: 100%
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: $color-background
  color: $color-text
</style>
