import jsonp from 'common/js/jsonp'
import { commonParams, option } from './config'
import axios from 'axios'

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';
  const data = Object.assign({}, commonParams, {
    // 轮播图jsonp请求
    unin: 0, // qq号
    platform: 'h5',
    needNewCode: 1
  })

  return jsonp(url, data, option)
}

export function getDiscList() {
  // 后端代理
  const url = '/api/getDiscList'
  const data = Object.assign({}, commonParams, {
    // 歌单后端代理请求，data -- query(webpack.dev.conf.js)
    picmid: 1,
    rnd: Math.random(),
    hostUin: 0,
    loginUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    categoryId: 10000000,
    sortId: 5,
    sin: 0,
    ein: 29,
    format: 'json' // 得到json格式
  })

  return axios.get(url, { params: data }).then((res) => {
    return Promise.resolve(res.data)
  })
}

export function getSongList(disstid) {
  // 后端代理
  const url = 'api/getSongList'
  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })
  return axios.get(url, {params: data}).then(res => {
    return Promise.resolve(res.data)
  })
}
