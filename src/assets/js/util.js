// 洗牌（随机算法）
export function shuffle(source) {
  // 拷贝出一个新的数组
  const arr = source.slice()
  // 遍历中随机交换
  for (let i = 0; i < arr.length; i++) {
    const j = getRandomInt(i)
    swap(arr, i, j)
  }
  return arr
}

// 【辅助函数】取从0～max之间的值 [0,max]
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1))
}

// 【辅助函数】交换
function swap(arr, i, j) {
  const t = arr[i]
  arr[i] = arr[j]
  arr[j] = t
}

// 格式化时间
export function formatTime(interval) {
  // 向下取整
  interval = interval | 0
  // 分
  const minute = ((interval / 60 | 0) + '').padStart(2, '0')
  // 秒
  const second = (interval % 60 + '').padStart(2, '0')
  // 分:秒格式
  return `${minute}:${second}`
}

// math.random 返回一个浮点型伪随机数字，在0（包括 0）和1（不包括）之间。
// Math.random() 生成 [0,1) 的数，所以 Math.random()*5 生成 [0,5) 的数。
