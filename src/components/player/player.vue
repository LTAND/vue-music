<template>
  <div class="player" v-show="playList.length>0">
    <!-- 动画钩子函数 -->
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen" ref="NormalPlayer">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.img">
        </div>
        <div class="top">
          <div class="back" @click="back()">
            <i class="iconfont icon-bottom"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <span class="sub">{{currentSong.singer}}</span>
        </div>

        <div
          class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd" ref="Img" :class="cdCls">
              <img :src="currentSong.img">
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <!-- 一开始currentLyric为null -->
            <div class="lyric-wrapper">
              <div v-if="currentLyric" class="lyric">
                <p
                  ref="lyricLine"
                  class="text"
                  :class="{'current':currentLineNum === index}"
                  v-for="(line,index) in currentLyric.lines"
                  :key="line.id"
                >{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>

        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active': currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active': currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <div class="time time-left">{{format(currentTime)}}</div>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <div class="time time-right">{{format(currentSong.duration)}}</div>
          </div>
          <div class="operators">
            <span @click="togglePalyMode" :class="disableCls">
              <i :class="clsModeIcon"></i>
              <!-- mixin.js 改为类名-->
              <!-- <i v-show="mode===getPlayModeConfig.sequence" class="iconfont icon-sequence"></i>
              <i v-show="mode===getPlayModeConfig.loop" class="iconfont icon-loop"></i>
              <i v-show="mode===getPlayModeConfig.random" class="iconfont icon-random"></i>-->
            </span>
            <span @click="playPrev" :class="disableCls">
              <i class="iconfont icon--previous"></i>
            </span>
            <span class="icon-center" @click="togglePlay" :class="disableCls">
              <i v-show="!playing" class="iconfont icon-play2"></i>
              <i v-show="playing" class="iconfont icon-pase"></i>
            </span>
            <span @click="playNext" :class="disableCls">
              <i class="iconfont icon--next"></i>
            </span>
            <span class="icon-sho`ucang" @click="toggleFavorite(currentSong)">
              <i :class="clsFavoriteIcon(currentSong)"></i>
              <!-- <i v-show="favoriteFlag" class="iconfont icon-weishoucang"></i>
              <i v-show="favoriteFlag" class="iconfont icon-yishoucang"></i>-->
            </span>
          </div>
        </div>

        <div class="background"></div>
      </div>
    </transition>

    <transition name="mini">
      <div class="min-player" v-show="!fullScreen" @click="open">
        <div class="left-img">
          <img :src="currentSong.img" :class="cdCls">
        </div>
        <div class="center-singer">
          <div class="name">{{currentSong.name}}</div>
          <div class="singer">{{currentSong.singer}}</div>
        </div>
        <div class="right-iconfont">
          <progress-circle class="progress-circle" :radius="radius" :percent="percent">
            <span class="play2-pase" @click.stop="togglePlay">
              <i v-show="!playing" class="iconfont icon-play2"></i>
              <i v-show="playing" class="iconfont icon-pase"></i>
            </span>
          </progress-circle>
          <span class="queuemus" @click.stop="showPlaylist">
            <i class="iconfont icon-queuemus"></i>
          </span>
        </div>
      </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio
      ref="audio"
      :src="currentSong.url"
      @play="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";
import animations from "create-keyframe-animation";
import { prefixStyle } from "common/js/dom";
import { playMode } from "../../common/js/config";
import ProgressBar from "../../base/progress-bar/progress-bar";
import ProgressCircle from "../../base/progress-circle/progress-circle";
import { shuffle } from "../../common/js/util";
import Lyric from "lyric-parser";
import scroll from "../../base/scroll/scroll";
import Playlist from "../playlist/playlist";
import { playerMixin } from "../../common/js/mixin.js";
const transform = prefixStyle("transform");
const transitionDuration = prefixStyle("transitionDuration");

export default {
  mixins: [playerMixin],
  data() {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32,
      currentLyric: null,
      currentLineNum: 0,
      playingLyric: null,
      currentShow: "cd"
    };
  },
  // TODO working favorite
  computed: {
    disableCls() {
      return this.songReady ? "" : "disable";
    },
    cdCls() {
      // 根据播放状态 切换cd滚动开始与停止
      return this.playing ? "play" : "play pause";
    },
    getPlayModeConfig() {
      return playMode;
    },
    percent() {
      return this.currentTime / this.currentSong.duration;
    },
    ...mapGetters([
      "playList",
      "fullScreen",
      "currentSong",
      "currentIndex"
      // mixin.js
      // "mode",
      // "playing",
      // "sequenceList",
      // "favoriteList"
    ])
  },
  created() {
    this.touch = {};
  },
  methods: {
    showPlaylist() {
      this.$refs.playlist.show();
    },
    back() {
      this.$refs.NormalPlayer.style.display = "none";
      this.setFullScreen(false);
    },
    open() {
      this.setFullScreen(true);
    },

    // 歌词处理 start
    getLyric() {
      this.currentSong
        .getLyric()
        .then(lyric => {
          if (this.currentSong.lyric !== lyric) {
            // 保持歌曲与歌词同步
            return;
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric);
          if (this.playing) {
            this.currentLyric.play();
          }
        })
        .catch(() => {
          // 歌词出现问题，就初始化
          this.currentLyric = null;
          this.currentLineNum = 0;
          this.playingLyric = "";
        });
    },
    handleLyric({ lineNum, txt }) {
      // 回调函数, 根据歌词行号滚动
      this.currentLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollTo(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    middleTouchStart(e) {
      this.touch.inittated = true;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.inittated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return;
      }
      if (!this.touch.moved) {
        this.touch.moved = true;
      }
      const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(
        0,
        Math.max(-window.innerWidth, left + deltaX)
      );
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      // 歌词页面
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = 0;
      // cd页面
      this.$refs.middleL.style.opacity = 1 - this.touch.percent; // percent越大，透明度越小
      this.$refs.middleL.style[transitionDuration] = 0;
      // console.log(this.$refs.lyricList);
    },
    middleTouchEnd() {
      let offsetWidth;
      let opacity;
      if (this.currentShow === "cd") {
        // 在cd页面
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.currentShow = "lyric";
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        // 在歌词页面
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          this.currentShow = "cd";
          opacity = 1;
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      this.$refs.lyricList.$el.style[
        transform
      ] = `translate3d(${offsetWidth}px,0,0)`;

      const time = 300; // 滑动歌词页面时间
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style[transitionDuration] = 0;
    },
    // 歌词处理 end

    // start 20190226
    // 播放器事件 start
    togglePlay() {
      this.setPlayingState(!this.playing);
      if (this.currentLyric) {
        this.currentLyric.togglePlay();
      }
    },
    togglePalyMode() {
      const mode = (this.mode + 1) % 3;
      // let list = null;
      // if(mode === playMode.sequence){
      //   list = shuffle(this.sequence)
      // }else{
      //   list = this.sequence
      // }
      // this.resetCurrentSong(list)
      this.setPlayMode(mode);
      // this.setPlayList(list)
    },
    resetCurrentSong(list) {
      let index = list.findIndex(item => {
        if (item.id === this.currentIndex.id) {
          return true;
        } else {
          return false;
        }
      });
      this.setCurrentIndex(index);
    },
    end() {
      // 在单曲循环模式，播放结束要循环
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.playNext();
      }
    },
    loop() {
      // 循环播放模式
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.currentLyric) {
        // 单曲循环的时候，歌词循环播放
        this.currentLyric.seek(0);
      }
    },
    autoPlay() {
      if (!this.playing) {
        this.togglePlay();
      }
    },
    playPrev() {
      if (!this.songReady) {
        return;
      }
      if (this.playList.length === 1) {
        this.loop();
        return;
      } else {
        let index = this.currentIndex - 1;
        if (index < 0) {
          index = this.playList.length - 1;
        }
        this.setCurrentIndex(index);
        this.autoPlay();
      }
      this.songReady = false;
    },
    playNext() {
      if (!this.songReady) {
        return;
      }
      if (this.playList.length === 1) {
        // 只有一首歌是,单曲循环
        this.loop();
        return;
      } else {
        let index = this.currentIndex + 1;
        if (index === this.playList.length) {
          index = 0;
        }
        this.setCurrentIndex(index);
        this.autoPlay();
      }
      this.songReady = false;
    },
    // 播放器事件 end

    ready() {
      this.songReady = true;
      this.savePlayHistory(this.currentSong);
    },
    error() {
      // 歌曲加载失败
      this.songReady = true;
    },
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },
    format(interval) {
      interval = interval | 0; // | 0 向下取整
      const mintue = (interval / 60) | 0;
      const second = this._pad(interval % 60);
      return `${mintue}:${second}`;
    },
    _pad(num, n = 2) {
      // 补零
      let len = num.toString().length;
      while (len < n) {
        num = "0" + num;
        len++;
      }
      return num;
    },
    onProgressBarChange(percent) {
      const currentTime = this.currentSong.duration * percent;
      console.log(currentTime);
      this.$refs.audio.currentTime = currentTime;
      this.autoPlay();
      // console.log("percent:", percent, "time", this.format(this.currentTime));
      // 滑动播放进度条随之改变歌词
      if (this.currentLyric) {
        this.currentLyric.seek(currentTime * 1000);
      }
    },
    // end

    // 7-7播放器展开收起动画（下） start
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();

      let animation = {
        0: {
          transform: `translate3d:(${x}px,${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `tansalte3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `transform(0,0,0) scale(1)`
        }
      };

      animations.registerAnimation({
        name: "move",
        animation,
        presets: {
          duration: 400, // 时间
          easing: "linear" // 线性动画
        }
      });
      animations.runAnimation(this.$refs.Img, "move", done);
    },
    afterEnter() {
      animations.unregisterAnimation("move");
      this.$refs.Img.style.animation = "";
    },
    leave(el, done) {
      this.$refs.Img.style.transition = "all 0.4s";
      const { x, y, scale } = this._getPosAndScale();
      this.$refs.Img.style[transform] = `translate3d(${x}px, ${y}px) scale(${scale})`;
      this.$refs.Img.addEventListener("transitionend", done);
    },
    afterLeave() {
      this.$refs.Img.style.transition = "";
      this.$refs.Img.style[transform] = "";
    },
    _getPosAndScale() {
      const targetWidth = 40;
      const paddingLeft = 40; // 大圆
      const paddingTop = 80; // 大圆
      const paddingBottom = 30; // 小圆
      const width = window.innerWidth * 0.8; // 大圆
      const scale = targetWidth / width; // 缩放原始比例
      const x = -(window.innerWidth / 2 - paddingLeft);
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    // 7-7播放器展开收起动画（下） end

    ...mapMutations({
      setFullScreen: "SET_FULLSCREEN",
      setPlayingState: "SET_PLAYING_STATE",
      setCurrentIndex: "SET_CURRENT_INDEX",
      setPlayMode: "SET_PLAY_MODE",
      setSequenceList: "SET_SEQUENCE_LIST",
      setPlayHistory: "SET_PLAY_HISTORY"
    }),
    ...mapActions(["savePlayHistory"])
  },
  watch: {
    currentSong(newSong, oldSong) {
      // 上下一首，当前歌曲变动，自动播放
      if (newSong.id === oldSong.id) {
        // 切换模式后是同一首歌则不马上播放
        return;
      }
      if (this.currentLyric) {
        // 每点一次歌,停止上一首的歌词
        this.currentLyric.stop();
      }
      // 防止后台切换后，延迟
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.audio.play();
          this.getLyric();
        });
      }, 1000);
    },
    playing(newPlay) {
      let audio = this.$refs.audio;
      this.$nextTick(() => {
        // dom更新后
        newPlay ? audio.play() : audio.pause();
      });
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    scroll,
    Playlist
  }
};
</script>
<style lang='stylus' scoped rel='stylesheet/stylus'>
@import '~common/stylus/variable'

.player
  .normal-player
    width: 100%
    height: 100%
    z-index: 150
    background-color: $color-background
    text-align: center
    position: fixed
    top: 0
    left: 0
    right: 0
    bottom: 0
    .background
      // 背景
      position: absolute
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: -1
      opacity: 0.6
      filter: blur(20px) // 模糊
    .top
      position: relative
      margin-bottom: 20px
      .back
        position: absolute
        top: 0
        left: 5%
        .icon-bottom
          color: $color-theme
          font-size: 30px
      .title
        font-size: $font-size-medium-x
      .sub
        font-size: $font-size-medium
    .middle
      position: fixed
      width: 100%
      top: 80px
      bottom: 170px
      white-space: nowrap // 段落中的文本不换行
      text-align: center
      font-size: 0
      .middle-l
        display: inline-block
        vertical-align: top
        margin-left: 9%;
        // position: relative
        // width 100%
        // height 0
        .cd
          display: inline-block
          vertical-align: top
          // margin: 0 auto
          width: 300px
          height: 300x
          border: 10px $color-dialog-background solid
          border-radius: 50%
          &.play
            animation: rotate 20s linear infinite
          &.pause
            animation-play-state: paused
          img
            border-radius: 50%
            width: 100%
            height: 100%
        .playing-lyric-wrapper
          width: 80%
          overflow: hidden
          margin: 30px auto 0 auto
          text-align: center
          font-size: 12px
          text-overflow:ellipsis;
          white-space: nowrap;
          .playing-lyric
            max-width: 319px;
            overflow: hidden
            text-overflow:ellipsis;
            white-space: nowrap;
      .middle-r
        // 滚动外壳
        display: inline-block
        vertical-align: top
        // position relative
        width: 100%
        height: 100%
        overflow: hidden
        .lyric-wrapper
          width: 80%
          margin: 0 0
          overflow: hidden
          margin-left: 14%
          text-align: center
          .text
            line-height: 32px
            color: $color-text-l
            font-size: $font-size-medium
            &.current
              color: $color-text
    .bottom
      width: 100%
      font-size: 0
      position: absolute
      bottom: 7%
      left: 0
      .dot-wrapper
        width: 100%
        position: absolute
        bottom: 100px
        .dot
          display: inline-block
          vertical-align: middle
          width: 8px
          height: 8px
          margin: 0 4px
          border-radius: 50%
          background: $color-text-l
          &.active
            width: 20px
            border-radius: 5px
            background: $color-text-ll
      .progress-wrapper
        width: 90%
        padding: 10px 0
        margin: 0 auto
        .progress-bar-wrapper
          display: inline-block
          vertical-align: middle
          width: 70% // 进度条的宽度
        .time
          line-height: 30px
          width: 30px
          display: inline-block
          vertical-align: middle
          color: $color-text
          font-size: $font-size-small
        .time-left
          padding-right: 5px
        .time-right
          padding-left: 5px
      .operators
        text-align: center
        span
          display: inline-block
          vertical-align: middle
          padding: 0 18px
          color: $color-theme
          &.disable
            color: $color-theme-d
          i
            font-size: 30px
        .icon-center i
          font-size: 40px
        .icon-yishoucang
          color: $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition: all 0.4s
      .top, .bottom
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32) // 掉落感
    &.normal-enter, &.normal-leave-to
      // display: none
      opacity: 0
      // 起始位置
      .top
        transform: translate3d(0, -100px, 0)
      .bottom
        transform: translate3d(0, -100px, 0)
  .min-player
    z-index: 180
    width: 100%
    height: 60px
    display: flex
    align-items: center
    position: fixed
    left: 0
    bottom: 0
    background: $color-hightLight-background
    & > div
      display: inline-block
    // 小播放器渐隐渐现
    &.mini-enter-active, &.mini-leave-active
      transition: all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity: 0
    .left-img
      width: 40px
      height: 40px
      padding: 0 10px 0 20px
      img
        width: 100%
        height: 100%
        border-radius: 50%
        &.play
          animation: rotate 20s linear infinite
        &.pause
          animation-play-state: paused
    .center-singer
      .name
        width: 100%
        font-size: $font-size-medium
        color: $color-text
      .singer
        padding-top: 5px
        font-size: $font-size-small
        color: $color-text-d
    .right-iconfont
      position: absolute
      bottom: 25%
      right: 2%
      // margin-left:52%
      .iconfont
        font-size: 32px
        color: $color-theme-d
      .progress-circle
        left: -40px
        top: 35px
        .play2-pase
          position: absolute
          left: 0
          top: -1px
      .queuemus
        padding-left: 10px
@keyframes rotate
  // 0%和100%的关键帧
  0%
    transform: rotate(0)
  100%
    transform: rotate(360deg)
</style>
