<template>
<!--
 slider < 1.轮播图的容器slider-group  2.下滑点的容器dots-wrapper
 * slider-group < slider-page 每一页的内容（图片，链接）
 * dots-wrapper < dot 每一个点
 -->
  <div class="slider" ref="rootRef">
    <div class="slider-group">
      <div
        class="slider-page"
        v-for="item in sliders"
        :key="item.id"
      >
        <a :href="item.link">
          <img :src="item.pic"/>
        </a>
      </div>
    </div>
    <div class="dots-wrapper">
      <span
        class="dot"
        v-for="(item, index) in sliders"
        :key="item.id"
        :class="{'active': currentPageIndex === index}">
      </span>
    </div>
  </div>
</template>

<script>
  import { ref } from 'vue'
  import useSlider from './use-slider'

  export default {
    name: 'slider',
    // 轮播图需要的数据（即基于sliders来渲染的）
    props: {
      sliders: {
        type: Array,
        default() {
          return []
        }
      }
    },
    setup() {
      /*
       * better-scroll插件，它的参数要求class或者DOM作为容器wrapper（这里使用vue中ref绑定的方式拿到DOM）
       * userSlider 返回了滑动时变化的下标currentPageIndex，可以应用到同步dot切换
          * （目前没有完全理解这里）提醒：useSlider(rootRef.value) 这样使用是不行的，这样直接传入DOM的话，到了这个userSlider函数里的onMounted中，你拿到的是undefined，因为它不是响应式的。    相反，若传入是ref响应式的，这样在onMounted中就可以取到DOM。
          * 个人理解上面的话（不保证正确）：可能是因为这是模板引用，你直接传入value就不会拿到挂载后的DOM
      */
      const rootRef = ref(null)
      const { currentPageIndex } = useSlider(rootRef)

      return {
        rootRef,
        currentPageIndex
      }
    }
  }
</script>

<style lang="scss" scoped>
  .slider {
    min-height: 1px;
    font-size: 0;
    touch-action: pan-y;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;
      .slider-page {
        display: inline-block;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        a {
          display: block;
          width: 100%;
        }
        img {
          display: block;
          width: 100%;
        }
      }
    }
    .dots-wrapper {
      position: absolute;
      left: 50%;
      bottom: 12px;
      line-height: 12px;
      transform: translateX(-50%);
      .dot {
        display: inline-block;
        margin: 0 4px;
        width: 8px;
        height: 8px;
        transform: translateZ(1px);
        border-radius: 50%;
        background: $color-text-l;
        &.active {
          width: 20px;
          border-radius: 5px;
          background: $color-text-ll;
        }
      }
    }
  }
</style>
