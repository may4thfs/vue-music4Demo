<template>
  <div class="music-list">
    <!-- 左上侧的返回按钮 -->
    <div
      class="back"
      @click="goBack"
    >
      <i class="icon-back"></i>
    </div>
    <!-- 顶部的标题 -->
    <h1 class="title">{{ title }}</h1>
    <!-- 上方背景图片 -->
    <div
      class="bg-image"
      :style="bgImageStyle"
      ref="bgImage"
    >
      <!-- 随机播放按钮+文本 -->
      <div
        class="play-btn-wrapper"
        :style="playBtnStyle"
      >
        <div
          v-show="songs.length > 0"
          class="play-btn"
          @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 给图片上添加半透明模糊 -->
      <div
        class="filter"
        :style="filterStyle"
      ></div>
    </div>
    <!-- 可滚动歌曲列表 -->
    <scroll
      class="list"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="song-list-wrapper">
        <song-list
          :songs="songs"
          @select="selectItem"
        ></song-list>
      </div>
    </scroll>
  </div>
</template>

<script>
  import SongList from '@/components/base/song-list/song-list'
  import Scroll from '@/components/base/scroll/scroll.vue'
  // import Scroll from '@/components/wrap-scroll'
  import { mapActions, mapState } from 'vuex'

  // 常量：标题的高度
  const RESERVED_HEIGHT = 40

  export default {
    name: 'music-list',
    components: {
      SongList,
      Scroll
    },
    props: {
      // 父组件传递的数据
      songs: {
        type: Array,
        default() {
          return []
        }
      },
      title: String,
      pic: String,
      loading: Boolean,
      noResultText: {
        type: String,
        default: '抱歉，没有找到可播放的歌曲'
      },
      rank: Boolean
    },
    data() {
      return {
        imageHeight: 0,
        scrollY: 0,
        // 列表最大可以移动的距离
        maxTranslateY: 0
      }
    },
    computed: {
      noResult() {
        // loading为false（或者说loading结束） 并且 songs 数据为空的时候，返回true
        return !this.loading && !this.songs.length
      },
      // 动态添加样式
      playBtnStyle() {
        let display = ''
        // 当列表滚动超过最大滚动距离（即碰到标题时）
        if (this.scrollY >= this.maxTranslateY) {
          display = 'none'
        }
        return {
          display
        }
      },
      // 动态添加样式
      bgImageStyle() {
        const scrollY = this.scrollY
        // 背景图片默认层级 0
        let zIndex = 0
        let paddingTop = '70%'
        let height = 0
        // translateZ相关的代码，为了解决iOS移动端兼容
        let translateZ = 0

        // 当列表滚动超过最大滚动距离（即碰到标题时）
        if (scrollY > this.maxTranslateY) {
          zIndex = 10
          paddingTop = 0
          height = `${RESERVED_HEIGHT}px`
          translateZ = 1
        }

        // 当列表下拉的时候，实现图片缩放比例
        let scale = 1
        if (scrollY < 0) {
          scale = 1 + Math.abs(scrollY / this.imageHeight)
        }

        return {
          zIndex,
          paddingTop,
          height,
          backgroundImage: `url(${this.pic})`,
          transform: `scale(${scale})translateZ(${translateZ}px)`
        }
      },
      // 【动态配置】拿到图片高度，给歌曲列表添加一个top样式
      scrollStyle() {
        // const bottom = this.playlist.length ? '60px' : '0'
        return {
          top: `${this.imageHeight}px`
          // bottom
        }
      },
      filterStyle() {
        let blur = 0
        const scrollY = this.scrollY
        const imageHeight = this.imageHeight
        // 默认位置往上移动列表的时候，动态计算模糊
        if (scrollY >= 0) {
          // 模糊值是有最大值的，即参数一 最大滚动高度/图片高度 比例
          blur = Math.min(this.maxTranslateY / imageHeight, scrollY / imageHeight) * 20
        }
        return {
          backdropFilter: `blur(${blur}px)`
        }
      },
      ...mapState([
        'playlist'
      ])
    },
    mounted() {
      // 拿到图片UI高度
      this.imageHeight = this.$refs.bgImage.clientHeight
      // 列表最大滚动距离 = 图片UI高度 - 标题高度
      this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
    },
    methods: {
      // 返回上一页
      goBack() {
        this.$router.back()
      },
      // 保存滚动的距离
      onScroll(pos) {
        this.scrollY = -pos.y
      },
      // 播放选择的歌曲（传入歌曲列表+索引）
      selectItem({ song, index }) {
        this.selectPlay({
          list: this.songs,
          index
        })
      },
      // 随机播放歌曲
      random() {
        this.randomPlay(this.songs)
      },

      // 将 Actions 映射到methods内部后直接调用
      ...mapActions([
        'selectPlay',
        'randomPlay'
      ])
    }
  }
</script>

<style lang="scss" scoped>
  .music-list {
    position: relative;
    height: 100%;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 20;
      transform: translateZ(2px);
      .icon-back {
        display: block;
        padding: 10px;
        font-size: $font-size-large-x;
        color: $color-theme;
      }
    }
    .title {
      position: absolute;
      top: 0;
      left: 10%;
      width: 80%;
      z-index: 20;
      transform: translateZ(2px);
      @include no-wrap();
      text-align: center;
      line-height: 40px;
      font-size: $font-size-large;
      color: $color-text;
    }
    .bg-image {
      position: relative;
      width: 100%;
      transform-origin: top;
      background-size: cover;
      .play-btn-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .filter {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(7, 17, 27, 0.4);
      }
    }
    .list {
      // top 属性在 scrollStyle() 中动态计算
      position: absolute;
      bottom: 0;
      width: 100%;
      z-index: 0;
      .song-list-wrapper {
        padding: 20px 30px;
        background: $color-background;
      }
    }
  }
</style>
