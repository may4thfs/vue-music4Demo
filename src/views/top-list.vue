<template>
  <div class="top-list">top</div>
</template>

<script>
  // import Scroll from '@/components/wrap-scroll'
  // import { getTopList } from '@/service/top-list'
  // import { TOP_KEY } from '@/assets/js/constant'
  // import storage from 'good-storage'

  export default {
    name: 'top-list'
    // components: {
    //   Scroll
    // },
    // data() {
    //   return {
    //     topList: [],
    //     loading: true,
    //     selectedTop: null
    //   }
    // },
    // async created() {
    //   const result = await getTopList()
    //   this.topList = result.topList
    //   this.loading = false
    // },
    // methods: {
    //   selectItem(top) {
    //     this.selectedTop = top
    //     this.cacheTop(top)
    //     this.$router.push({
    //       path: `/top-list/${top.id}`
    //     })
    //   },
    //   cacheTop(top) {
    //     storage.session.set(TOP_KEY, top)
    //   }
    // }
  }
</script>

<style lang="scss" scoped>
  .top-list {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    .top-list-content {
      height: 100%;
      overflow: hidden;
      .item {
        display: flex;
        margin: 0 20px;
        padding-top: 20px;
        height: 100px;
        &:last-child {
          padding-bottom: 20px;
        }
        .icon {
          flex: 0 0 100px;
          width: 100px;
          height: 100px;
        }
        .song-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 20px;
          height: 100px;
          overflow: hidden;
          background: $color-highlight-background;
          color: $color-text-d;
          font-size: $font-size-small;
          .song {
            @include no-wrap();
            line-height: 26px;
          }
        }
      }
    }
  }
</style>
