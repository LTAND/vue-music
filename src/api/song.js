import { commonParams } from './config'
import axios from 'axios'
import jsonp from 'common/js/jsonp'

export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    g_tk: 67232076,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongVkey(songmid) { // 获取歌曲的vkey
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'
  const data = Object.assign({}, {
    g_tk: 195219765,
    jsonpCallback: 'MusicJsonCallback004680169373158849',
    loginUin: 1297716249, // 可以传空值
    hostUin: 0,
    format: 'json',
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    callback: 'MusicJsonCallback004680169373158849',
    uin: 1297716249, // 可以传空值
    songmid: `${songmid}`,
    filename: `C400${songmid}.m4a`,
    guid: 4208080920
    // guid 随机变化 Math.round(2147483647 * Math.random()) * ((new Date()).getUTCMilliseconds()) % 1e10
  })

  return jsonp(url, data)
}
