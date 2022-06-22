<template>
  <div class="singer-detail">
    <!-- 将歌曲列表，标题，图片传递过去 -->
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>

<script>
  // import createDetailComponent from '@/assets/js/create-detail-component'
  import { getSingerDetail } from '@/service/singer'
  import { processSongs } from '@/service/song'
  import MusicList from '@/components/music-list/music-list'
  import { SINGER_KEY } from '@/assets/js/constant'
  import storage from 'good-storage'

  // export default createDetailComponent('singer-detail', SINGER_KEY, getSingerDetail)
  export default {
    name: 'singer-detail',
    components: { MusicList },
    props: {
      singer: Object
    },
    data() {
      return {
        songs: [],
        loading: true
      }
    },
    computed: {
      computedSinger() {
        let ret = null
        const singer = this.singer
        // （因为singer是父组件传递过来的，如果有值代表从singer页跳转而来）
        // 如果singer有值，返回该singer（默认逻辑）
        if (singer) {
          ret = singer
        } else {
          // 如果没有值，就通过缓存获取（页面刷新时）
          const cachedSinger = storage.session.get(SINGER_KEY)
          // 若缓存有，且mid与路由上的id相同，说明是从当前页渲染/刷新的。并返回
          if (cachedSinger && (cachedSinger.mid || cachedSinger.id + '') === this.$route.params.id) {
            ret = cachedSinger
          }
        }
        return ret
        // 注意：if判断中当缓存不匹配的情况下，ret就不会被赋值，即null。后续使用该数据需要排除null的情况
      },
      // computedData() {
        // let ret = null
        // const data = this.data
        // if (data) {
        //   ret = data
        // } else {
        //   const cached = storage.session.get(key)
        //   if (cached && (cached.mid || cached.id + '') === this.$route.params.id) {
        //     ret = cached
        //   }
        // }
        // return ret
      // },
      pic() {
        const singer = this.computedSinger
        return singer && singer.pic
        // const data = this.computedData
        // return data && data.pic
      },
      title() {
        const singer = this.computedSinger
        return singer && singer.name
        // const data = this.computedData
        // return data && (data.name || data.title)
      }
    },
    async created() {
      // 歌手数据为null的情况，退回到一级路由
      if (!this.computedSinger) {
        // 拿到第一个匹配的路径，也就是一级路由的path
        // (知识点：一级路由singer，二级路由singer/:id)
        const path = this.$route.matched[0].path
        // 跳转一级路由
        this.$router.push({
          path
        })
        return
      }
      console.log(this.$route.matched[1])
      const result = await getSingerDetail(this.computedSinger)
      this.songs = await processSongs(result.songs)
      console.log(this.songs)
      // 加载好数据后取消loading组件
      this.loading = false
    }
  }
</script>

<style lang="scss" scoped>
  .singer-detail {
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: $color-background;
  }
</style>
