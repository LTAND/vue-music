import { playMode } from 'common/js/config'
const state = {
  singer: {},
  // 播放器
  playing: false,
  fullScreen: false,
  playList: [],
  sequenceList: [],
  mode: playMode.sequence, // 播放模式
  currentIndex: -1,
  disc: {}, // 歌词
  topList: {} // 排行歌单
}
export default state
