import { createStore, createLogger } from 'vuex'
import state from './state'
import mutations from './mutations'
import * as getters from './getters'
import * as actions from './actions'

// 获取开发环境
const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state,
  getters,
  mutations,
  actions,
  // 开发环境下，开启严格模式.
  // 在严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。
  strict: debug,
  // createLogger 是 vuex 提供日志查看函数，这里在开发模式下使用
  plugins: debug ? [createLogger()] : []
})

// 项目没有用module，目前足够
