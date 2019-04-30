<template>
  <div class="song-list">
    <ul>
      <li
        @click="selectItem(song, index)"
        v-for="(song,index) in songs"
        :key="song.id"
        class="song"
      >
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)"></span>
          <span :class="getRankText(index)">{{getRankText(index)}}</span>
        </div>
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
    },
    rank:{
      type: Boolean,
      default: false
    }
  },
  computed: {},
  methods: {
    getRankCls(index){
      if(index<=2){
        return `icon icon${index}`
      }else{
        return 'text'
      }
    },
    getRankText(index){
      if(index > 2){
        return index + 1
      }
    },
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
@import '~common/stylus/mixin';
.song-list
  text-align: left
  font-size: $font-size-medium
  overflow: hidden
  background-color: $color-background
  ul
    padding: 30px 30px
    margin: 0 auto
    list-style: none
    .song
      display flex
      height 64px
      align-items: center
      font-size: $font-size-medium
      .rank
        flex 0 0 25px
        width 25px
        margin-right: 30px
        text-align: center //数字居中
        .icon
          display inline-block
          width 25px
          height 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex 1   
        line-height 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d

// @import '~common/stylus/variable'
// @import '~common/stylus/mixin';
// .song-list
//   overflow: hidden
//   text-align: left
//   font-size: $font-size-medium
//   background-color: $color-background
//   ul
//     padding: 30px 20px
//     margin: 0 auto
//     list-style: none
//     .song
//       padding: 10px 10px
//       .rank
//         display: inline-block
//         vertical-align middle
//         .icon
//           display block
//           width 25px
//           height 24px
//           background-size: 25px 24px
//           &.icon0
//             bg-image('first')
//           &.icon1
//             bg-image('second')
//           &.icon2
//             bg-image('third')
//         .text
//           color: $color-theme
//           font-size: $font-size-large
//       .content
//         display: inline-block;
//         vertical-align middle
//         padding-left: 20px
//         white-space nowrap
//         overflow: hidden
//         text-overflow: ellipsis
//         .desc
//           padding-top: 10px
//           color: $color-text-l
</style>
