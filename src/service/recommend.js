/*
  recommend.js 负责轮播图相关请求
*/
import { get } from './base'

// 请求推荐歌单数据
/*
  ⭐️备注：可以看出这里的url 和 backend/router.js/registerRecommend方法里代理的请求是一致的
  前端在这里发送get请求，到了node后端内部就可以执行registerRecommend()里的请求逻辑了。
*/
export function getRecommend() {
  return get('/api/getRecommend')
}

// 请求轮播图数据
export function getAlbum(album) {
  return get('/api/getAlbum', {
    id: album.id
  })
}
