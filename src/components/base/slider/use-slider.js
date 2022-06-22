/* use-slider.js 是对slider初始化的逻辑封装 */

// 1.导入库
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'

import { onMounted, onUnmounted, onActivated, onDeactivated, ref } from 'vue'

// 2.按需安装slide插件
BScroll.use(Slide)

// 3.初始化better-scroll
/*
  ref模板引用只会在初始渲染之后【获得赋值】---官方文档。在setup函数里是拿不到的（它早于mounted生命周期）
   * 在最新的官方文档中也指出：你只可以在组件挂载后才能访问 模板ref（也称DOM引用）
  所以在mounted中获取 wrapperRef 这个DOM引用，初始化BScroll
*/
export default function useSlider(wrapperRef) {
  const slider = ref(null)
  const currentPageIndex = ref(0)

  onMounted(() => {
    const sliderVal = slider.value = new BScroll(wrapperRef.value, {
      // BScroll基础配置项
      // https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-options.html#%E9%85%8D%E7%BD%AE%E9%A1%B9
      // click属性：因为 BetterScroll 默认会阻止浏览器的原生 click 事件。当设置为 true，BetterScroll 会派发一个 click 事件，我们会给派发的 event 参数加一个私有属性 _constructed，值为 true。
      click: true,
      scrollX: true,   // 开启横向滚动
      scrollY: false,  // 关闭纵向滚动
      momentum: false, // 关闭快速滑动后的滚动动画
      bounce: false,   // 关闭回弹效果
      probeType: 2,    // 仅手指按在滚动区域上时，一直派发 scroll 事件
      slide: true      // 使用slide的默认配置
    })

    // 监听当前实例上的 slideWillChange 事件/钩子函数（这是BScroll自己的事件）
    // 逻辑：当 slide 的 currentPage 值将要改变时，拿到页码保存下来应用到 dot 切换
    // pageX: 横向对应 Page 的索引，下标从 0 开始
    sliderVal.on('slideWillChange', (page) => {
      currentPageIndex.value = page.pageX
    })
  })

  onUnmounted(() => {
    // 在卸载的生命周期 销毁slider
    slider.value.destroy()
  })

  onActivated(() => {
    slider.value.enable()
    slider.value.refresh()
  })

  onDeactivated(() => {
    slider.value.disable()
  })

  return {
    slider,
    currentPageIndex
  }
}
