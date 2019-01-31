import jsonp from 'common/js/jsonp'
import { commonParams, option } from './config'
import axios from 'axios'

export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    format: 'json',
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq'
  })
  return jsonp(url, data, option)
}

export function getSingerListTwo() {
  // qq音乐-歌手新接口，不知道为何用不了?
  const url = '/api/getSingerList'
  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0,
    data: { "comm": { "ct": 24, "cv": 10000 }, "singerList": { "module": "Music.SingerListServer", "method": "get_singer_list", "param": { "area": -100, "sex": -100, "genre": -100, "index": -100, "sin": 0, "cur_page": 1 } } }
  });
  return axios.get(url, { params: data })
    .then((res) => { return Promise.resolve(res.data) })
}
export function getSingerDetail(singerId) {
  // 获取歌手详情  singerId - 歌手的id
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    loginUinL: 0,
    hostUin: 0,
    format: 'json',
    platform: 'yqq.json',
    needNewCode: 0,
    ct: 24,
    singermid: singerId,
    order: 'listen',
    begin: 0,
    num: 30,
    songstatus: 1
  });
  return jsonp(url, data, option)
}
