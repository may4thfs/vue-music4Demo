<template>
  <!-- 数据会传给index-list组件，当没有数据的时候，显示loading页面 -->
  <div class="singer" v-loading="!singers.length">
    <index-list
      :data="singers"
      @select="selectSinger"
    ></index-list>
    <!-- 跳转到歌手详情页 -->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :data="selectedSinger"/>
      </transition>
    </router-view>
  </div>
</template>

<script>
  // 数据请求
  import { getSingerList } from '@/service/singer'
  // 引入组件
  import IndexList from '@/components/base/index-list/index-list'
  import storage from 'good-storage'
  import { SINGER_KEY } from '@/assets/js/constant'

  export default {
    name: 'singer',
    components: {
      IndexList
    },
    data() {
      return {
        singers: [],
        selectedSinger: null
      }
    },
    async created() {
      // * 请求到数据后保存到singers数组
      const result = await getSingerList()
      console.log(result)
      this.singers = result.singers
    },
    methods: {
      // 将点击选中的歌手保存，并缓存。进行路由跳转
      selectSinger(singer) {
        this.selectedSinger = singer
        this.cacheSinger(singer)
        this.$router.push({
          path: `/singer/${singer.mid}`
        })
      },
      // 缓存歌手数据（见4.7）
      cacheSinger(singer) {
        storage.session.set(SINGER_KEY, singer)
      }
    }
  }
</script>

<style lang="scss" scoped>
  // 用fixed布局固定该组件的高度。(fixed相对可视窗口，不随页面滚动而变化。用top+bottom限定了高度)
  // 这是因为要导入BScroll，为了实现滚动需要让外层容器固定高度
  // * 固定高度就是让这个外层容器有一个固定的高度，而不是根据内容动态撑高的，这样才能让 BetterScroll 的滚动生效。
  .singer {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
  }
</style>
