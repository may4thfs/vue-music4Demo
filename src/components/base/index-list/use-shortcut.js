/* 右侧快捷导航相关逻辑 */
import { ref, computed } from 'vue'

export default function useShortcut(props, groupRef) {
  // 锚点高度：文本12+上下padding3=18
  const ANCHOR_HEIGHT = 18
  // index-list页面上的scroll组件实例
  const scrollRef = ref(null)

  // 数组：每一组的title
  const shortcutList = computed(() => {
    // 使用map()方法映射一个新数组，元素为每一组的titile
    return props.data.map((group) => {
      return group.title
    })
  })

  // 记录起始Y值和移动时的Y值
  const touch = {}

  /* 【关键函数1】：当触摸到快速导航时使用的回调函数 */
  function onShortcutTouchStart(e) {
    // 拿到touch事件触发的目标元素的索引
    const anchorIndex = parseInt(e.target.dataset.index)
    // 拿到第一个手指的起始Y坐标
    touch.y1 = e.touches[0].pageY
    // （小技巧）将我的目标元素索引保存到touch对象，在别处可以方便获取
    touch.anchorIndex = anchorIndex

    scrollTo(anchorIndex)
  }

  /* 【关键函数2】：当在快速导航上移动时使用的回调函数 */
  function onShortcutTouchMove(e) {
    // 拿到第一个手指移动时的Y坐标
    touch.y2 = e.touches[0].pageY
    // 拖动距离 / 单个元素高度，再去整。得出拖动了几组
    // （或0是让正数向下取整的一种写法，也可以使用Math.floor）
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    // 目标索引 = 拿到初始索引 + 偏移
    const anchorIndex = touch.anchorIndex + delta

    // 【注意】当拖动过于远，delta值会变得很大，算出来最终的锚点可能是不在范围内的。即超过了shortcutList长度。
    // 解决办法：在srollTo()内部对index进行限制
    scrollTo(anchorIndex)
  }

  /* 【封装】让页面滚动到某一组（这里会用到groupRef因为需要拿到该DOM让它滚动） */
  function scrollTo(index) {
    // 【边界判断1】非数字值直接return，比如一般见到的undefined
    // 这里是防止恰好点到了外层的 div （也就是当前的 shortcut ）且没有点到内层的 li，这种情况会导致 anchorIndex 的值是 NaN
    if (isNaN(index)) {
      return
    }
    // 【边界判断2】目标组索引限制在 0 和 shortcutList长度-1 之间
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))

    // 当前要展示的目标组
    const targetEl = groupRef.value.children[index]
    // 拿到scroll组件下的BSCroll实例，调用scrollToElement滚动
    const scroll = scrollRef.value.scroll

    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    scrollRef,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
