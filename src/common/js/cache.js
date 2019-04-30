import storage from 'good-storage'

const SEARCH_KEY = "__search__" // 表示key的值
const SEARCH_MAX_LEN = 15 // 最大存储的长度

const PLAY_KEY = "__play__"
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = "__favorite__"
const FAVORITE_MAX_LEN = 200

function insertArry(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    // 只有一首并相同的歌
    return
  }
  if (index > 0) {
    arr.splice(index, 1) // 删除在原来找到的歌曲
  }
  arr.unshift(val) // 为了放入放在列表开头
  if (maxLen && arr.length > maxLen) {
    // 超过arr限度
    arr.pop()
  }
}

function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

// 搜索历史
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, []) // 获取，获取不到，初始值为[]
  insertArry(searches, query, item => { return item === query }, SEARCH_MAX_LEN) // 插入
  storage.set(SEARCH_KEY, searches) // 提交保存
  return searches
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, item => { return item === query })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

// 播放历史
export function loadPlay() {
  // 如果没有, 就赋值空数组
  return storage.get(PLAY_KEY, [])
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArry(songs, song, item => item === song, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function clearPlay() {
  storage.remove(PLAY_KEY)
  return []
}

export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArry(songs, song, item => item === song, FAVORITE_MAX_LEN)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, song, item => item === song, FAVORITE_MAX_LEN)
  return songs
}
