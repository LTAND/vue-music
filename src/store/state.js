import { playMode } from 'common/js/config'
import { loadSearch } from 'common/js/cache'

const state = {
  singer: {},
  // 播放器
  playing: false, // 是否播放
  fullScreen: false, // play组件全屏
  playList: [], // 播放列表
  sequenceList: [], // 顺序列表
  mode: playMode.sequence, // 播放模式
  currentIndex: -1,
  disc: {}, // 歌词
  topList: {}, // 排行歌单
  searcHistory: loadSearch() // 搜素历史
}
export default state
