import { createApp } from 'vue'
import { addClass, removeClass } from '@/assets/js/dom'

// 这个 g-relative 是 scss/base.scss 中设定的class，值为 postion: relative
const relativeCls = 'g-relative'

/*
 * 参数：Comp 组件（以loading.vue为例）
 * 函数：将 loading 组件挂载到 el 上（就是指令作用的DOM上，比如 .recommend）
 */
export default function createLoadingLikeDirective(Comp) {
  return {
    mounted(el, binding) {
      // 创建 loading 组件
      const app = createApp(Comp)
      // 将 loading 组件挂载到动态创建的容器元素 div 上
      const instance = app.mount(document.createElement('div'))
      // * 在el上给不同Comp添加不同属性（如果是直接el.instance，后者会覆盖前者 --4.9）
      const name = Comp.name
      if (!el[name]) {
        el[name] = {}
      }
      // 因instance还会在其它生命周期中用到，所以保存起来（小技巧：这里放到el对象里）
      el[name].instance = instance

      // 拿到自定义指令的参数，前提不为空的时候，将它赋值设定到loading组件的标题上
      const title = binding.arg
      if (typeof title !== 'undefined') {
        instance.setTitle(title)
      }

      if (binding.value) {
        append(el)
      }
    },

    updated(el, binding) {
      // 更新的时候，在这里也更新一下loading的title
      const title = binding.arg
      const name = Comp.name
      if (typeof title !== 'undefined') {
        el[name].instance.setTitle(title)
      }
      // 若前后值不一致，需要做添加 or 移除的操作
      if (binding.value !== binding.oldValue) {
        // value的变量为true就添加，反之就移除
        binding.value ? append(el) : remove(el)
      }
    }
  }

  /*
   * 函数：挂载操作，将loading组件对应的DOM对象挂在到el
   */
  function append(el) {
    const name = Comp.name
    /* 【优化】因为loading组件要求父组件position是非static，这里需要设置父组件样式
     *  判断若style.postion不是以下一个的话，就自己主动给它添加定位
     */
    const style = getComputedStyle(el)
    // debugger
    if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
      addClass(el, relativeCls)
    }

    el.appendChild(el[name].instance.$el)
  }

  /*
   * 函数：移除操作，将loading组件对应的DOM对象从el移除
   */
  function remove(el) {
    const name = Comp.name
    removeClass(el, relativeCls)
    el.removeChild(el[name].instance.$el)
  }
}
