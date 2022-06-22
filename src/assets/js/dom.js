// 封装通用的DOM操作逻辑

export function addClass(el, className) {
  // 如果el的类列表中没有该类，则添加进来
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

export function removeClass(el, className) {
  // 直接移除类
  el.classList.remove(className)
}

// classList 是一种更方便的访问元素的类列表的方法。
