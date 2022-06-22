export const currentSong = (state) => {
  // 通过索引找到播放列表的歌曲
  // * 为了避免数组为空而报错，会返回空对象。因为外面通过{}.xxx只会返回undefined，而不会直接报错
  return state.playlist[state.currentIndex] || {}
}
