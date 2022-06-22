/* use-scroll.js 封装了 BScroll 相关逻辑 */
import BScroll from '@better-scroll/core'
import ObserveDOM from '@better-scroll/observe-dom'
import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'

BScroll.use(ObserveDOM)

/*
 * 参数1: BScroll初始化所需要的DOM
 * 参数2: Bscroll初始化需要的配置选项
 */
export default function useScroll(wrapperRef, options, emit) {
  // 定义一个响应式变量
  const scroll = ref(null)

  // 初始化
  onMounted(() => {
    // debugger
    const scrollVal = scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    })

    // 判断：当 probeType 大于0时，监听scroll事件，并将位置信息pos通过emit派发出去
    if (options.probeType > 0) {
      scrollVal.on('scroll', (pos) => {
        emit('scroll', pos)
      })
    }
  })

  // 卸载
  onUnmounted(() => {
    scroll.value.destroy()
  })

  onActivated(() => {
    scroll.value.enable()
    scroll.value.refresh()
  })

  onDeactivated(() => {
    scroll.value.disable()
  })

  return scroll
}
