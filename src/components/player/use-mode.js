import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'

export default function useMode() {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)

  // 根据 playMode 切换对应图标
  const modeIcon = computed(() => {
    const playModeVal = playMode.value
    // * 这是使用了嵌套的三元运算符。
    return playModeVal === PLAY_MODE.sequence
      ? 'icon-sequence'
      : playModeVal === PLAY_MODE.random
        ? 'icon-random'
        : 'icon-loop'
  })

  // 根据 playMode 切换文本
  const modeText = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? '顺序播放'
      : playModeVal === PLAY_MODE.random
        ? '随机播放'
        : '单曲循环'
  })

  // 切换 playMode
  function changeMode() {
    // 在0，1，2这三个数字切换
    const mode = (playMode.value + 1) % 3
    // 使用 vuex 的 actions提交修改播放模式
    store.dispatch('changeMode', mode)
  }

  return {
    modeIcon,
    modeText,
    changeMode
  }
}
