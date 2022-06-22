<template>
  <!-- 进度条 -->
  <div
    class="progress-bar"
    @click="onClick"
  >
    <!-- 进度条背景 -->
    <div class="bar-inner">
      <!-- 黄色进度条 -->
      <div
        class="progress"
        ref="progress"
        :style="progressStyle"
      ></div>
      <!-- 可拖动的进度图标 -->
      <div
        class="progress-btn-wrapper"
        :style="btnStyle"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script>
  const progressBtnWidth = 16

  export default {
    name: 'progress-bar',
    emits: ['progress-changing', 'progress-changed'],
    props: {
      progress: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        offset: 0
      }
    },
    computed: {
      // 动态修改黄色条宽度
      progressStyle() {
        return `width:${this.offset}px`
      },
      // 动态移动圆形图标
      btnStyle() {
        return `transform:translate3d(${this.offset}px,0,0)`
      }
    },
    watch: {
      progress(newProgress) {
        this.setOffset(newProgress)
      }
    },
    created() {
      // 为了共享进度按钮横坐标信息，绑定到这里
      this.touch = {}
    },
    methods: {
      onTouchStart(e) {
        // 进度按钮横坐标
        this.touch.x1 = e.touches[0].pageX
        // 黄色进度条宽度
        this.touch.beginWidth = this.$refs.progress.clientWidth
        // （.x1 .beginWidth 是自己自定义的属性）
      },
      onTouchMove(e) {
        // 按钮偏移量 = 当前按钮x - 开始的x
        const delta = e.touches[0].pageX - this.touch.x1
        // 移动后进度条的宽度
        const tempWidth = this.touch.beginWidth + delta
        // 总进度条宽度
        const barWidth = this.$el.clientWidth - progressBtnWidth
        // 计算出进度比
        const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))

        // 计算进度条偏移量（修改UI样式）
        this.offset = barWidth * progress
        // 通知父组件，进度已变更（修改数据）
        this.$emit('progress-changing', progress)
      },
      onTouchEnd() {
        const barWidth = this.$el.clientWidth - progressBtnWidth
        // 进度比
        const progress = this.$refs.progress.clientWidth / barWidth

        // 通知父组件，进度已变更
        this.$emit('progress-changed', progress)
      },
      // 点击进度条时
      onClick(e) {
        // 目标进度条宽度 = 点击位置 - 进度条起点
        const rect = this.$el.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        const barWidth = this.$el.clientWidth - progressBtnWidth
        // 进度比例
        const progress = offsetWidth / barWidth

       this.$emit('progress-changed', progress)
      },
      setOffset(progress) {
        // 总进度条宽度 = 整个进度条宽度 - 圆形进度条图标宽度
        const barWidth = this.$el.clientWidth - progressBtnWidth
        // progress 是0～1，所以相乘得到进度条偏移量
        this.offset = barWidth * progress
      }
    }
  }
</script>

<style lang="scss" scoped>
  .progress-bar {
    height: 30px;
    .bar-inner {
      position: relative;
      top: 13px;
      height: 4px;
      background: rgba(0, 0, 0, 0.3);
      .progress {
        position: absolute;
        height: 100%;
        background: $color-theme;
      }
      .progress-btn-wrapper {
        position: absolute;
        left: -8px;
        top: -13px;
        width: 30px;
        height: 30px;
        .progress-btn {
          position: relative;
          top: 7px;
          left: 7px;
          box-sizing: border-box;
          width: 16px;
          height: 16px;
          border: 3px solid $color-text;
          border-radius: 50%;
          background: $color-theme;
        }
      }
    }
  }
</style>
