<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view />
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from "components/m-header/m-header";
import Tab from "components/tab/tab";
import Player from "components/player/player";
import vConsole from "vconsole";
// import { getSongVkey } from "../src/api/song";

export default {
  name: "App",
  components: {
    MHeader,
    Tab,
    Player
  }
  // created() {
  //   this._getSongVkey();
  // },
  // methods: {
  //   _getSongVkey() {
  //     let songmid = "0039MnYb0qxYhV" // 001KSwwu4Ud9LM
  //     getSongVkey(songmid).then(res => {
  //       let vkey = res.data.items[0].vkey
  //       console.log(res.data)

  //       console.log(`http://isure.stream.qqmusic.qq.com/C400${songmid}.m4a?guid=4208080920&vkey=${vkey}&uin=0&fromtag=66`)
  //       console.log(`http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400${songmid}.m4a?fromtag=38&guid=4208080920&vkey=${vkey}`)
  //       // console.log(`http://dl.stream.qqmusic.qq.com/C400${songmid}.m4a?fromtag=38&guid=5931742855&vkey=${vkey}`)
  //     });
  //   }
  // }
};
</script>

<style lang="stylus" scoped>
@import 'common/stylus/cssreset.styl';
@import 'common/stylus/base.styl';

#app {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: $color-background;
  color: $color-text;
}
</style>
