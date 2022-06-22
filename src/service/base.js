import axios from 'axios'
// import axiosRetry from 'axios-retry'

// axiosRetry(axios, { retries: 5 })

const ERR_OK = 0
const baseURL = process.env.NODE_ENV === 'production' ? 'http://ustbhuangyi.com/music-next/' : '/'

axios.defaults.baseURL = baseURL

/*
 * 封装axios的get请求（备注：Node.js后端所有的接口返回的数据都会放在res.date.result中）
 * 返回 result 对象
 */
export function get(url, params) {
  return axios.get(url, {
    params
  }).then((res) => {
    // 拿到返回的数据
    const serverData = res.data
    // 如果是成功请求，将数据返回
    if (serverData.code === ERR_OK) {
      return serverData.result
    }
  }).catch((e) => {
    console.log(e)
  })
}
