<template>
  <!-- 组件要支持滚动的，因此最外界这里套了scroll组件 -->
  <scroll
    class="index-list"
    :probe-type="3"
    @scroll="onScroll"
    ref="scrollRef"
  >
    <!-- ul的每个li分别表示一个组 -->
    <ul ref="groupRef">
      <li
        v-for="group in data"
        :key="group.title"
        class="group"
      >
        <!-- 每个组 拥有h2标题+ul歌手列表(头像+姓名) -->
        <h2 class="title">{{group.title}}</h2>
        <ul>
          <li
            v-for="item in group.list"
            :key="item.id"
            class="item"
            @click="onItemClick(item)"
          >
            <img class="avatar" v-lazy="item.pic">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 固定在顶部的展示组标题 -->
    <div
      class="fixed"
      v-show="fixedTitle"
      :style="fixedStyle"
    >
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <!-- 固定在右侧的快捷导航 -->
    <div
      class="shortcut"
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="item"
          :data-index="index"
          class="item"
          :class="{'current':currentIndex===index}">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>

<script>
  import Scroll from '@/components/base/scroll/scroll'
  // 钩子函数
  import useFixed from './use-fixed'
  import useShortcut from './use-shortcut'

  export default {
    name: 'index-list',
    components: { Scroll },
    props: {
      // data就是歌手数据
      data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    emits: ['select'],
    setup(props, { emit }) {
      // 参数：模板引用 emit触发的函数 展示标题 标题偏移动画 展示组索引
      const { groupRef, onScroll, fixedTitle, fixedStyle, currentIndex } = useFixed(props)
      // 参数：快捷导航列表，模板引用，回调函数
      const { shortcutList, scrollRef, onShortcutTouchStart, onShortcutTouchMove } = useShortcut(props, groupRef)

      // 点击列表中歌手（可以理解为cell）
      function onItemClick(item) {
        emit('select', item)
      }

      return {
        onItemClick,
        // fixed
        groupRef,
        onScroll,
        fixedTitle,
        fixedStyle,
        currentIndex,
        // shortcut
        shortcutList,
        scrollRef,
        onShortcutTouchStart,
        onShortcutTouchMove
      }
    }
  }
</script>

<style lang="scss" scoped>
  // 当前组件页面
  .index-list {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: $color-background;
    // 每一组（h2+ul）
    .group {
      padding-bottom: 30px;
      // 当前组的标题
      .title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
      // 当前组的每一个item
      .item {
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .name {
          margin-left: 20px;
          color: $color-text-l;
          font-size: $font-size-medium;
        }
      }
    }
    // 固定于顶部的展示组标题（使用了绝对定位）
    .fixed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      .fixed-title {
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background: $color-highlight-background;
      }
    }
    // 固定于右侧的快捷导航（绝对定位）
    .shortcut {
      position: absolute;
      right: 4px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      border-radius: 10px;
      text-align: center;
      background: $color-background-d;
      font-family: Helvetica;
      .item {
        padding: 3px;
        line-height: 1;
        color: $color-text-l;
        font-size: $font-size-small;
        &.current {
          color: $color-theme
        }
      }
    }
  }
</style>
