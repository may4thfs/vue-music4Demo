<template>
  <!-- 推荐页面 < 1.顶部的轮播图 2.下面的推荐列表（左侧图片；右侧文本） -->
  <!-- BScroll滚动只对它第一个子元素生效，所以这里又增加一层div包裹（轮播图+推荐列表）-->
  <div class="recommend" v-loading:[loadingText]='loading'>
    <scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <slider v-if="sliders.length" :sliders='sliders'></slider>
          </div>
        </div>
        <div class="recommend-list">
          <h1 class="list-title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li
              v-for="item in albums"
              class="item"
              :key="item.id"
            >
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic">
              </div>
              <div class="text">
                <h2 class="name">
                  {{ item.username }}
                </h2>
                <p class="title">
                  {{item.title}}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
  import { getRecommend } from '@/service/recommend'
  import Slider from '@/components/base/slider/slider'
  import Scroll from '@/components/base/scroll/scroll'
  // import storage from 'good-storage'
  // import { ALBUM_KEY } from '@/assets/js/constant'

  export default {
    name: 'recommend',
    components: {
      Slider,
      Scroll
    },
    data() {
      return {
        // 显示需要的数据
        sliders: [],
        albums: [],
        // 用于自定义指令的动态参数
        loadingText: '正在载入',
        selectedAlbum: null
      }
    },
    computed: {
      // 因为自定义组件根据 true/false 决定是否启用，所以直接要返回布尔值
      // 当sliders和albums数据同时存在的时候为true
      loading() {
        return !this.sliders.length && !this.albums.length
      }
    },

    async created() {
      /*
        发送请求到拿到结果这个过程是异步的。所以可以使用async
        这里请求到轮播图的数据
      */
      const result = await getRecommend()
      // console.log(result)
      this.sliders = result.sliders
      this.albums = result.albums
    }
    // methods: {
    //   selectItem(album) {
    //     this.selectedAlbum = album
    //     this.cacheAlbum(album)
    //     this.$router.push({
    //       path: `/recommend/${album.id}`
    //     })
    //   },
    //   cacheAlbum(album) {
    //     storage.session.set(ALBUM_KEY, album)
    //   }
    // }
  }
</script>

<style lang="scss" scoped>

  // recommend 指整个组件的页面，距离浏览器窗口顶部88px是算上了header+tab的高度
  .recommend {
    position: fixed;
    width: 100%;
    top: 88px;
    bottom: 0;
    overflow: scroll;

    // *因为BScroll需要容器高度<内容高度才能滚动，这里将容器高度确定为recommend高度
    .recommend-content {
      height: 100%;
      overflow: hidden;

      // 1.轮播图位置
      .slider-wrapper {
        position: relative;
        width: 100%;
        //  * height配合padding-top作用是让自身高度设置为父盒子宽度40%
        height: 0;
        padding-top: 40%;
        overflow: hidden;
        // 轮播图
        .slider-content {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
        }
      }

      // 2.推荐列表位置
      .recommend-list {
        // 2.1列表题目（文本居中）
        .list-title {
          height: 65px;
          line-height: 65px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-theme;
        }
        // 2.2列表内容
        .item {
          display: flex;
          // 内容区实际宽度是width减去(border + padding)的值
          box-sizing: border-box;
          align-items: center;
          padding: 0 20px 20px 20px;

          // item里左边的头像
          .icon {
            flex: 0 0 60px;
            width: 60px;
            padding-right: 20px;
          }
          // item里右边的文本（包括了name+title）
          .text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            flex: 1;
            line-height: 20px;
            overflow: hidden;
            font-size: $font-size-medium;
          }
          .name {
            margin-bottom: 10px;
            color: $color-text;
          }
          .title {
            color: $color-text-d;
          }
        }
      }
    }
  }
</style>
