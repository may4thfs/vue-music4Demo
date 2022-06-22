import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 第三方库，懒加载插件
import lazyPlugin from 'vue3-lazy'
// 引入自定义指令，全局注册
import loadingDirective from '@/components/base/loading/directive'
import noResultDirective from '@/components/base/no-result/directive'

// 引入全局样式文件
import '@/assets/scss/index.scss'

createApp(App).use(store).use(router).use(lazyPlugin, {
  // 懒加载的默认图片
  loading: require('@/assets/images/default.png')
}).directive('loading', loadingDirective).directive('no-result', noResultDirective).mount('#app')
