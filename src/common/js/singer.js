export default class Singer {
  // 歌手数据
  constructor({id, name}) {
    this.id = id;
    this.name = name;
    this.imgurl = `https://y.gtimg.cn/music/photo_new/T001R150x150M000${id}.jpg`
  }
}
// console.log(new Singer({id: '1', name: 'aaaaaa'}))
