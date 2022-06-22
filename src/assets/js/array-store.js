import storage from 'good-storage'

// 【辅助函数】插入歌曲
function insertArray(arr, val, compare, maxLen) {
  // 判断歌曲是否已在列表中
  const index = arr.findIndex(compare)

  // 若歌曲已存在，直接return
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  // 若不存在，就插入到数组头部
  arr.unshift(val)

  // 若传入maxLen限制，并且当前存储数量>限制，将队头歌曲出列
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

// 【辅助函数】移除歌曲
function deleteFromArray(arr, compare) {
  // 若找到目标歌曲，删除它
  const index = arr.findIndex(compare)
  if (index > -1) {
    // 此方法会改变原数组
    arr.splice(index, 1)
  }
}

// 保存歌曲到收藏列表
// item:歌曲song
// key:localStorage的键
// compare:自己实现比较函数(用于findIndex)
// maxLen:列表最大限数
export function save(item, key, compare, maxLen) {
  // 1.从本地获取现有的数据（若没有存储过，默认是空数组[]
  const items = storage.get(key, [])
  // 2.保存到items中，也就是收藏列表中
  insertArray(items, item, compare, maxLen)
  // 3.修改后，重新保存到本地stoarga
  storage.set(key, items)
  return items
}

// 移除歌曲从列表中
export function remove(key, compare) {
  // 这里逻辑与 save() 类似
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

// 加载收藏列表数据
export function load(key) {
  // 从本地获取现有的数据（若没有存储过，默认是空数组[]
  return storage.get(key, [])
}

export function clear(key) {
  storage.remove(key)
  return []
}

export function saveAll(items, key) {
  storage.set(key, items)
}
