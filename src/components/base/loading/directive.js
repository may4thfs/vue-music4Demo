import Loading from './loading'
import createLoadingLikeDirective from '@/assets/js/create-loading-like-directive'

// 传入 loading 组件，创建 loading 指令
const loadingDirective = createLoadingLikeDirective(Loading)

export default loadingDirective
