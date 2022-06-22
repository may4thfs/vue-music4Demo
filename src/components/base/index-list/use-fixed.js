/* 计算出当前吸附在顶部UI的标题内容 */
import { ref, watch, computed, nextTick } from 'vue'

export default function useFixed(props) {
  // 常量 标题高度
  const TITLE_HEIGHT = 30
  // 模板引用，这里是ul
  const groupRef = ref(null)
  // 记录各个组的高度区间（补充：该数组其实可以不定义成ref，它没有响应式的需求，也不被外界模板应用）
  const listHeights = ref([])
  // 纵向滚动的值
  const scrollY = ref(0)
  // 当前展示组的索引
  const currentIndex = ref(0)
  // 当前展示组的下一组距离容器顶部的值
  const distance = ref(0)

  // （计算属性）通过展示组索引拿到该组的title
  const fixedTitle = computed(() => {
    // 优化：Y值<0，不显示标题文本
    if (scrollY.value < 0) {
      return ''
    }
    const currentGroup = props.data[currentIndex.value]
    return currentGroup ? currentGroup.title : ''
  })

  // 标题的偏移动化样式
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    // 若距离满足>0同时<标题高度，计算偏移值，否则不偏移
    const diff = (distanceVal > 0 && distanceVal < TITLE_HEIGHT) ? distanceVal - TITLE_HEIGHT : 0
    // 使用transform实现偏移动画（这里是CSS内联样式的对象语法）
    return {
      transform: `translate3d(0,${diff}px,0)`
    }
  })

  /* 侦听到(props.data)数据变化的时候，计算所有列表高度区间 */
  watch(() => props.data, async () => {
    // 注意：数据变化之后，在这个回调函数内部，DOM还没发生变化。(查阅官网 - callback-flush-timing)
    // 而DOM发生变化是在 nextTick()之后，所以要添加以下代码，并设置为 async。表明在下一次DOM更新完成之后调用
    await nextTick()
    calculate()
  })

  /* 侦听scrollY变化，拿到更新的Y值来对比它落在哪个展示组，并存储该组索引currentIndex */
  watch(scrollY, (newY) => {
    const listHeightsVal = listHeights.value
    // 【补充：为何length-1】
    // （长度-1是因为数组listHeightsVal长度比list大1个，因为前者预先push了一个0高度作为第一个元素。
    // 再加上遍历时取底部高度要i+1，所以遍历到length是没有意义的，会拿到undefined）
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      // 取区间顶部 & 底部位置
      const heightTop = listHeightsVal[i]
      const heightBottom = listHeightsVal[i + 1]
      // 当 Y 落在当前展示区间内，i就是该区间索引
      if (newY >= heightTop && newY < heightBottom) {
        // 保存索引
        currentIndex.value = i
        // 计算出下一组距离容器顶部的值（因为组的底部相当于下一组顶部）
        distance.value = heightBottom - newY
        break
      }
    }
  })

  /* 计算各个组的高度区间，保存到listHeights */
  function calculate() {
    /* 变量 */
    // children 指ul下的li，即全部列表
    const list = groupRef.value.children
    // 数组记录各组高度（另外为了方便之后不需要每次都写.value，优化一下）
    const listHeightsVal = listHeights.value
    // height 记录各组区间的高度
    let height = 0

    /* 逻辑 */
    // 计算出所有区间之前 先清空数组
    listHeightsVal.length = 0
    // 先把第一个组的起始高度也就是0，给push进去
    listHeightsVal.push(height)

    // 遍历后续所有组的高度
    for (let i = 0; i < list.length; i++) {
      // 遍历的每个元素都是一个DOM，也就是li。
      // 举例：第一次 0+100=100 得到第二个li的起始高度
      height += list[i].clientHeight
      listHeightsVal.push(height)
    }

    // 备注：clientHeight 可以通过 CSS height + CSS padding - 水平滚动条高度 (如果存在)来计算.
  }

  /* 当index-list 监听到BScroll子组件通过emit发出的自定义事件后触发  */
  function onScroll(pos) {
    // 拿到纵轴的 Y 值
    // （取负的原因：BScroll 派发的值默认是 0~负无穷。这样就能和listHeightsVal对应起来）
    scrollY.value = -pos.y
  }

  return {
    groupRef,
    onScroll,
    fixedTitle,
    fixedStyle,
    currentIndex
  }
}
