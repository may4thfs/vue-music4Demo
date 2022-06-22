import { PLAY_MODE, SEARCH_KEY, FAVORITE_KEY } from '@/assets/js/constant'
import { load } from '@/assets/js/array-store'

const state = {
  // 歌曲列表（默认顺序）
  sequenceList: [],
  // 真实播放顺序列表（顺序or随机or循环）
  playlist: [],
  // 是否播放
  playing: false,
  // 播放模式：顺序or随机or循环
  playMode: PLAY_MODE.sequence,
  // 当前播放歌曲的索引
  currentIndex: 0,
  // 播放器全屏or收缩
  fullScreen: false,
  // 收藏歌曲
  favoriteList: load(FAVORITE_KEY),
  searchHistory: load(SEARCH_KEY),
  playHistory: []
}

export default state
