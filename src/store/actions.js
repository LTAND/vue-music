import * as types from './mutation-types'
import { shuffle } from './../common/js/util'
import { playMode } from './../common/js/config'

import { saveSearch, deleteSearch, clearSearch, savePlay, clearPlay, saveFavorite, deleteFavorite } from './../common/js/cache'

function findIndex(list, song) {
  /**
   * arry.findIndex()
   * 测试条件时返回 true 时, 返回索引
   * 没找到返回-1
   * findIndex() 对于空数组，函数是不会执行的。
   * */
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

// 点击播放
export const selectPlay = function ({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list)
  if (state.mode === playMode.random) {
    let randomListt = shuffle(list)
    commit(types.SET_PLAYLIST, randomListt)
    // 当前随机播放的列表索引
    index = findIndex(randomListt, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_CURRENT_INDEX, index)
  commit(types.SET_PLAYING_STATE, true)
}

// 随机播放
export const randomPlay = function ({ commit }, { list }) {
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_SEQUENCE_LIST, list)
  let ramdomList = shuffle(list)
  commit(types.SET_PLAYLIST, ramdomList)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAYING_STATE, true)
}

// 在search中点击插入一首歌
export const insertSong = function ({ commit, state }, song) {
  let playList = state.playList.slice() // 传副本
  let sequenceList = state.sequenceList.slice() // 传副本
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fpIndex = findIndex(playList, song)
  // 插入歌曲索引是当前歌曲的下一首
  currentIndex++
  playList.splice(currentIndex, 0, song)
  // 如果包含这首歌
  if (fpIndex > -1) {
    // 如果当期插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      playList.splice(fpIndex + 1, 1)
    }
  }

  let currentSIndex = findIndex(sequenceList, currentSong) + 1

  let fsIndex = findIndex(sequenceList, song)

  sequenceList.splice(currentSIndex, 0, song)

  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      sequenceList.splice(fsIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULLSCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

export const deleteSong = function ({commit, state}, song) {
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  let pIndex = findIndex(playList, song)
  playList.splice(pIndex, 1)

  let sIndex = findIndex(sequenceList, song)
  sequenceList.splice(sIndex, 1)
  if (currentIndex > pIndex || currentIndex === playList.length) {
    currentIndex--
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)

  if (!playList.length) {
    commit(types.SET_PLAYING_STATE, false)
  } else {
    commit(types.SET_PLAYING_STATE, true)
  }
}

/* 增删空 - 搜索历史 */
export const saveSearcHistory = function ({ commit }, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query))
}

export const deleteSearcHistory = function({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query))
}

export const clearSearcHistory = function ({ commit }) {
  commit(types.SET_SEARCH_HISTORY, clearSearch())
}

export const deleteSongList = function({commit}) {
  // 删除歌曲
  commit(types.SET_CURRENT_INDEX, -1)
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_PLAYING_STATE, false)
}

/*  增删空 - 播放历史 */
export const savePlayHistory = function({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

export const clearPlayHistory = function({commit}) {
  commit(types.SET_PLAY_HISTORY, clearPlay())
}

/* 收藏功能 */
export const saveFavoriteList = function({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}
export const deleteFavoriteList = function({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}
