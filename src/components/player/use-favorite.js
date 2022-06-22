import { useStore } from 'vuex'
import { computed } from 'vue'
import { save, remove } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'

export default function useFavorite() {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)
  const maxLen = 100

  // 根据是否在 favoriteList 中，切换收藏/未收藏 图标
  function getFavoriteIcon(song) {
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }

  // 添加/移除歌曲
  function toggleFavorite(song) {
    let list
    // 如果歌曲已经在列表，则移除，反之添加
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    // 更新到 vuex
    store.commit('setFavoriteList', list)

    // 定义比较条件：id相等即为同一首
    function compare(item) {
      return item.id === song.id
    }
  }

  // 【辅助函数】歌曲是否在收藏列表
  function isFavorite(song) {
    // 如果在列表中找到，返回true
    // * array.findIndex 未找到元素会返回-1
    return favoriteList.value.findIndex((item) => {
      return item.id === song.id
    }) > -1
  }

  return {
    getFavoriteIcon,
    toggleFavorite
  }
}
