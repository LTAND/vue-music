<template>
  <div class="song-list">
    <ul>
      <li
        @click="selectItem(song, index)"
        v-for="(song,index) in songs"
        :key="song.id"
        class="song"
      >
        <div class="content">
          <div class="name">{{song.name}}</div>
          <div class="desc">{{getDesc(song)}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    songs: {
      type: Array,
      default: null
    }
  },
  computed: {},
  methods: {
    getDesc(song) {
      return `${song.singer}-${song.album}`;
    },
    selectItem(song, index) {
      this.$emit("select", song, index);
    }
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.song-list
  overflow: hidden
  text-align: left
  font-size: $font-size-medium
  background-color: $color-background
  ul
    padding: 30px 20px
    margin: 0 auto
    list-style: none
    .song
      padding: 10px 10px
      .desc
        padding-top: 10px
        color: $color-text-l
</style>
