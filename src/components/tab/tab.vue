<template>
  <div class="tab">
    <!-- 遍历标签，将tab.path属性绑定到key和路由 -->
    <!-- 结构：tab是container，router-link是items -->
    <router-link
      class="tab-item"
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
    >
      <span class="tab-link">
        {{tab.name}}
      </span>
    </router-link>
  </div>
</template>

<script>
  export default {
    name: 'tab',
    data() {
      return {
        /*
          name 用于 HTML文本
          path 用于 Vue-router
        */
        tabs: [
          {
            name: '推荐',
            path: '/recommend'
          },
          {
            name: '歌手',
            path: '/singer'
          },
          {
            name: '排行',
            path: '/top-list'
          },
          {
            name: '搜索',
            path: '/search'
          }
        ]
      }
    }
  }
</script>

<style lang="scss" scoped>
  // container
  .tab {
    display: flex;
    height: 44px;
    line-height: 44px;
    font-size: $font-size-medium;

    // items
    .tab-item {
      // flex指定一个值是flex-grow
      flex: 1;
      text-align: center;

      .tab-link {
        padding-bottom: 5px;
        color: $color-text-l;
      }

      // 链接激活时，应用的 class。（vue-router自带的类）
      // （&语法转成css是 .tab-item.router-link-active 正好是交集选择器的写法）
      &.router-link-active {
        .tab-link {
          color: $color-theme;
          border-bottom: 2px solid $color-theme;
        }
      }
    }
  }
</style>
