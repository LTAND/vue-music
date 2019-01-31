export default class Song {
  constructor({ id, mid, singer, album, name, duration, img, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.album = album
    this.name = name
    this.duration = duration
    this.img = img
    this.url = url
  }
}

export function createSong(musicData) {
  // 创建单个歌曲数据对象
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: fliteSinger(musicData.singer),
    album: musicData.albumname,
    name: musicData.songname,
    duration: musicData.interval,
    img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

function fliteSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  } else {
    singer.forEach(s => {
      ret.push(s.name)
    });
    return ret.join("/")
  }
}
