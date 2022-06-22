/*
  singer.js 负责歌手列表页相关请求
*/
import { get } from './base'

// 请求歌手列表数据
export function getSingerList() {
  return get('/api/getSingerList')
}

// 请求该singer的详细数据
export function getSingerDetail(singer) {
  return get('/api/getSingerDetail', {
    mid: singer.mid
  })
}
