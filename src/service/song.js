/*
  song.js 负责歌曲页相关请求
*/
import { get } from './base'

// 参数：歌曲列表  返回：Promise
export function processSongs(songs) {
  // 若没有歌曲，原样返回songs
  if (!songs.length) {
    return Promise.resolve(songs)
  }

  return get('/api/getSongsUrl', {
    // 映射songs的mid作为数组（因为第三方需要一个[mid]数组作为请求参数）
    mid: songs.map((song) => {
      return song.mid
    })
  }).then((result) => {
    // 拿到请求下来的url
    const map = result.map
    // 将url一一对应映射保存到songs中
    // 接着filter过滤，因为url必须要包括vkey字符串，才能有效且能播放（这是第三方服务器的加密策略）
    return songs.map((song) => {
      song.url = map[song.mid]
      return song
    }).filter((song) => {
      return song.url && song.url.indexOf('vkey') > -1
    })
  })
}

const lyricMap = {}

export function getLyric(song) {
  if (song.lyric) {
    return Promise.resolve(song.lyric)
  }
  const mid = song.mid
  const lyric = lyricMap[mid]
  if (lyric) {
    return Promise.resolve(lyric)
  }

  return get('/api/getLyric', {
    mid
  }).then((result) => {
    const lyric = result ? result.lyric : '[00:00:00]该歌曲暂时无法获取歌词'
    lyricMap[mid] = lyric
    return lyric
  })
}
