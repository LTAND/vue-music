import { getLyric } from '../../api/song'
import { ERR_OK } from '../../api/config'
import { Base64 } from 'js-base64'

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
  // 解析base64歌词
  getLyric() {
    // getLyric(this.mid).then((res) => {
    //   if (res.retcode === ERR_OK) {
    //     this.lyric = Base64.decode(res.lyric)
    //     console.log(this.lyric)
    //   }
    // })
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    // 为了处理
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
          // console.log(this.lyric)
        } else {
          reject(new Error("no lyric"))
        }
      })
    })
  }
}

export function createSong(musicData, vkey) {
  // 创建单个歌曲数据对象
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid, // 002GrJ771EmliH
    singer: fliteSinger(musicData.singer),
    album: musicData.albumname,
    name: musicData.songname,
    duration: musicData.interval,
    // C400002KcRGW4WFSys
    // C400002GrJ771EmliH
    img: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?guid=2095717240&vkey=${vkey}&uin=0&fromtag=38`
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`// 旧qq音乐的播放源
    // url: `https://api.bzqll.com/music/tencent/url?id=${musicData.songmid}&key=579621905&br=320`
    // url: `https://dl.stream.qqmusic.qq.com/M500${musicData.songmid}.mp3?vkey=FEDE7DFD5274174AA34294FE74190360CBC7F0AAC7A0365300927B7EC1D3DFCEA730B2896AF09110B6727612056A3EBAB8DEB8968E34EE1F&guid=1551429817&uin=0&fromtag=53`
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
    // url: `http://61.144.207.146:8081/b8154d3d-4166-4561-ad8d-7188a96eb195/4001/bc/de/bcde835d-f360-4f88-882d-64b2b835f617/kfid/14786576/C400${musicData.songmid}.m4a?guid=2962606080&vkey=94CDDF2F0C265782616E208177B31A070243A56317B1C0A41D1BC82D8483E06BFE2557D14093AD6E3DE736F1D9AC0FD0284A317B048AD202&uin=0&fromtag=3&r=04613806494510175`
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
