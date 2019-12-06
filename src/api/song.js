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

// 获取vkey
export const getSongVkey = (songmid) => {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?'
  const data = Object.assign({}, {
    callback: 'musicJsonCallback',
    loginUin: 3051522991, // 可以传空值
    format: 'jsonp',
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    uin: 0, // 可以传空值
    guid: 2095717240,
    // guid 随机变化 Math.round(2147483647 * Math.random()) * ((new Date()).getUTCMilliseconds()) % 1e10
    songmid: songmid,
    filename: `C400${songmid}.m4a`
  })

  return jsonp(url, data)
}
