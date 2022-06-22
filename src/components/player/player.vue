<template>
  <!-- player 根组件  -->
  <div
    class="player"
    v-show="playlist.length"
  >
    <!-- 全屏播放器 -->
    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div
        class="normal-player"
        v-show="fullScreen"
      >
        <div class="background">
          <img :src="currentSong.pic">
        </div>
        <div class="top">
          <div
            class="back"
            @click="goBack"
          >
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{currentSong.name}}</h1>
          <h2 class="subtitle">{{currentSong.singer}}</h2>
        </div>
        <div class="middle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div
            class="middle-l"
            :style="middleLStyle"
          >
            <div
              ref="cdWrapperRef"
              class="cd-wrapper"
            >
              <div
                ref="cdRef"
                class="cd"
              >
                <img
                  ref="cdImageRef"
                  class="image"
                  :class="cdCls"
                  :src="currentSong.pic">
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll
            class="middle-r"
            ref="lyricScrollRef"
            :style="middleRStyle"
          >
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p
                  class="text"
                  :class="{'current': currentLineNum ===index}"
                  v-for="(line,index) in currentLyric.lines"
                  :key="line.num"
                >
                  {{line.txt}}
                </p>
              </div>
              <div class="pure-music" v-show="pureMusicLyric">
                <p>{{pureMusicLyric}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <!-- 进度条区 -->
          <div class="progress-wrapper">
            <!-- 左侧当前播放时间 -->
            <span class="time time-l">{{formatTime(currentTime)}}</span>
            <!-- 中间的进度条部分 -->
            <div class="progress-bar-wrapper">
              <progress-bar
                ref="barRef"
                :progress="progress"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
              ></progress-bar>
            </div>
            <!-- 右侧歌曲总时长 -->
            <span class="time time-r">{{formatTime(currentSong.duration)}}</span>
          </div>
          <!-- 操作按钮区 -->
          <div class="operators">
            <div class="icon i-left">
              <i @click="changeMode" :class="modeIcon"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlay" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i @click="toggleFavorite(currentSong)" :class="getFavoriteIcon(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- mini播放器 -->
    <mini-player
      :progress="progress"
      :toggle-play="togglePlay"
    ></mini-player>
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script>
  import { useStore } from 'vuex'
  import { computed, watch, ref, nextTick } from 'vue'
  import useMode from './use-mode'
  import useFavorite from './use-favorite'
  import useCd from './use-cd'
  import useLyric from './use-lyric'
  import useMiddleInteractive from './use-middle-interactive'
  import useAnimation from './use-animation'
  import usePlayHistory from './use-play-history'
  import ProgressBar from './progress-bar'
  import Scroll from '@/components/base/scroll/scroll'
  import MiniPlayer from './mini-player'
  import { formatTime } from '@/assets/js/util'
  import { PLAY_MODE } from '@/assets/js/constant'

  export default {
    name: 'player',
    components: {
      MiniPlayer,
      ProgressBar,
      Scroll
    },
    setup() {
      /* data */
      const audioRef = ref(null)
      const barRef = ref(null)

      // flag：歌曲是否已准备
      const songReady = ref(false)
      // 当前歌曲播放时间
      const currentTime = ref(0)
      // flag：进度条是否改变中
      let progressChanging = false

      /* vuex */
      const store = useStore()
      const fullScreen = computed(() => store.state.fullScreen)
      const currentSong = computed(() => store.getters.currentSong)
      const playing = computed(() => store.state.playing)
      const currentIndex = computed(() => store.state.currentIndex)
      const playMode = computed(() => store.state.playMode)

      /* hooks */
      const { modeIcon, changeMode } = useMode()
      const { getFavoriteIcon, toggleFavorite } = useFavorite()
      const { cdCls, cdRef, cdImageRef } = useCd()
      const { currentLyric, currentLineNum, pureMusicLyric, playingLyric, lyricScrollRef, lyricListRef, playLyric, stopLyric } = useLyric({
        songReady,
        currentTime
      })
      const { currentShow, middleLStyle, middleRStyle, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd } = useMiddleInteractive()
      const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation()
      const { savePlay } = usePlayHistory()

      /* computed */
      const playlist = computed(() => store.state.playlist)

      // 根据播放状态切换icon
      const playIcon = computed(() => {
        return playing.value ? 'icon-pause' : 'icon-play'
      })

      // 歌曲播放进度比
      const progress = computed(() => {
        // 当前播放时间 / 歌曲总时长
        console.log(currentTime.value / currentSong.value.duration)
        return currentTime.value / currentSong.value.duration
      })

      // 动态样式。如果true，不会有任何class；如果false，设置disable样式
      const disableCls = computed(() => {
        return songReady.value ? '' : 'disable'
      })

      /* watch */
      // 侦听当前歌曲，并用audio播放
      watch(currentSong, (newSong) => {
        // id或者url有一个为空就直接return
        if (!newSong.id || !newSong.url) {
          return
        }
        // 重置歌曲当前时间0
        currentTime.value = 0
        // * 每次当前歌曲更新的时候，都要赋值false
        songReady.value = false

        // audio 元素播放歌曲
        const audioEl = audioRef.value
        audioEl.src = newSong.url
        audioEl.play()

        store.commit('setPlayingState', true)
      })

      // 侦听播放状态，调用audio的播放/暂停
      watch(playing, (newPlaying) => {
        // 若歌曲没缓存好，就不要执行后续代码
        if (!songReady.value) {
          return
        }

        const audioEl = audioRef.value
        if (newPlaying) {
          audioEl.play()
          playLyric()
        } else {
          audioEl.pause()
          stopLyric()
        }
      })

      watch(fullScreen, async (newFullScreen) => {
        if (newFullScreen) {
          await nextTick()
          barRef.value.setOffset(progress.value)
        }
      })

      /* methods */
      function goBack() {
        store.commit('setFullScreen', false)
      }

      // 切换播放状态
      function togglePlay() {
        if (!songReady.value) {
          return
        }
        store.commit('setPlayingState', !playing.value)
      }

      // 当监听到 audio 暂停后，显式修改播放状态 false
      function pause() {
        store.commit('setPlayingState', false)
      }

      function prev() {
        const list = playlist.value
        // 歌曲未缓冲好 or 歌曲为空，直接return
        if (!songReady.value || !list.length) {
          return
        }

        // 如果只有一首歌，就循环播放
        if (list.length === 1) {
          loop()
        } else {
          // 如果当前索引是0，它上一首应为末尾的歌
          let index = currentIndex.value - 1
          if (index === -1) {
            index = list.length - 1
          }
          store.commit('setCurrentIndex', index)
        }
      }

      function next() {
        const list = playlist.value
        // 歌曲未缓冲好 or 歌曲为空，直接return
        if (!songReady.value || !list.length) {
          return
        }

        // 如果只有一首歌，就循环播放
        if (list.length === 1) {
          loop()
        } else {
          // 如果当前索引是最后一首，它下一首应为第一首
          let index = currentIndex.value + 1
          if (index === list.length) {
            index = 0
          }
          store.commit('setCurrentIndex', index)
          if (!playing.value) {
            store.commit('setPlayingState', true)
          }
        }
      }

      // 重新播放当前歌曲
      function loop() {
        const audioEl = audioRef.value
        audioEl.currentTime = 0
        audioEl.play()
        // 重新开启播放状态（因为拖动进度条会触发pause，那里会设置播放状态false）
        store.commit('setPlayingState', true)
      }

      // 监听 audio 的 canplay，来决定是否准备好播放歌曲
      function ready() {
        // * 因为数据会多次缓冲，canplay也会多次触发，所以只要第一次ready过了，就不要执行后面逻辑
        if (songReady.value) {
          return
        }
        songReady.value = true

        playLyric()
        savePlay(currentSong.value)
      }

      // 监听 audio 的 error，即歌曲出错时
      function error() {
        // 因为播放/切歌都是依赖songReady，当前逻辑在它为false的时候，按钮会disable。
        // 所以这时得让按钮能够恢复点击
        songReady.value = true
      }

      // 监听 audio 的 timeupdate
      // * 知识点：当audio的currentTime更新时会触发timeupdate事件。
      function updateTime(e) {
        // 更新歌曲当前播放时间
        // （优化）如果正在手动拖动进度条，则不执行这段代码。-- 因为 currentTime一旦修改就会响应改变进度条。若不加上这句判断，那么updateTime()和onProgressChanging()中的currentTime冲突。 --- 相当于当我手动拖动的时候，我的优先级更高，而自身歌曲播放导致curruntTime级别变低
        if (!progressChanging) {
          currentTime.value = e.target.currentTime
        }
      }

      // 监听手动拖动进度过程中
      function onProgressChanging(progress) {
        progressChanging = true
        // 更新当前歌曲播放时间（总时长 * 通过进度比 ）会响应之后的逻辑把进度条修改到期望位置
        currentTime.value = currentSong.value.duration * progress
        playLyric()
        stopLyric()
      }

      // 监听手动拖动进度完毕时
      function onProgressChanged(progress) {
        progressChanging = false
        // * 真实地修改播放器的当前时间
        audioRef.value.currentTime = currentTime.value = currentSong.value.duration * progress
        // 如果是暂停状态，让它播放
        if (!playing.value) {
          store.commit('setPlayingState', true)
        }
        playLyric()
      }

      // 监听 audio 的 ended，播放结束时
      function end() {
        // 当播放结束后，重置当前时间
        currentTime.value = 0
        // 并判断播放模式进行播放
        if (playMode.value === PLAY_MODE.loop) {
          loop()
        } else {
          next()
        }
      }

      return {
        audioRef,
        barRef,
        fullScreen,
        currentTime,
        currentSong,
        playlist,
        playIcon,
        disableCls,
        progress,
        goBack,
        togglePlay,
        pause,
        prev,
        next,
        ready,
        error,
        updateTime,
        formatTime,
        onProgressChanging,
        onProgressChanged,
        end,
        // mode
        modeIcon,
        changeMode,
        // favorite
        getFavoriteIcon,
        toggleFavorite,
        // cd
        cdCls,
        cdRef,
        cdImageRef,
        // lyric
        currentLyric,
        currentLineNum,
        pureMusicLyric,
        playingLyric,
        lyricScrollRef,
        lyricListRef,
        // middle-interactive
        currentShow,
        middleLStyle,
        middleRStyle,
        onMiddleTouchStart,
        onMiddleTouchMove,
        onMiddleTouchEnd,
        // animation
        cdWrapperRef,
        enter,
        afterEnter,
        leave,
        afterLeave
      }
    }
  }
</script>

<style lang="scss" scoped>
  .player {
    .normal-player {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 150;
      background: $color-background;
      .background {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        opacity: 0.6;
        filter: blur(20px);

        img {
          width: 100%;
          height: 100%;
        }
      }
      .top {
        position: relative;
        margin-bottom: 25px;
        .back {
          position: absolute;
          top: 0;
          left: 6px;
          z-index: 50;
        }
        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
        .title {
          width: 70%;
          margin: 0 auto;
          line-height: 40px;
          text-align: center;
          @include no-wrap();
          font-size: $font-size-large;
          color: $color-text;
        }
        .subtitle {
          line-height: 20px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-text;
        }
      }
      .middle {
        position: fixed;
        width: 100%;
        top: 80px;
        bottom: 170px;
        white-space: nowrap;
        font-size: 0;
        .middle-l {
          display: inline-block;
          vertical-align: top;
          position: relative;
          width: 100%;
          height: 0;
          padding-top: 80%;
          .cd-wrapper {
            position: absolute;
            left: 10%;
            top: 0;
            width: 80%;
            box-sizing: border-box;
            height: 100%;
            .cd {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              img {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
              .playing {
                animation: rotate 20s linear infinite
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r {
          display: inline-block;
          vertical-align: top;
          width: 100%;
          height: 100%;
          overflow: hidden;
          .lyric-wrapper {
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            text-align: center;
            .text {
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
              &.current {
                color: $color-text;
              }
            }
            .pure-music {
              padding-top: 50%;
              line-height: 32px;
              color: $color-text-l;
              font-size: $font-size-medium;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper {
          text-align: center;
          font-size: 0;
          .dot {
            display: inline-block;
            vertical-align: middle;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
              width: 20px;
              border-radius: 5px;
              background: $color-text-ll;
            }
          }
        }
        .progress-wrapper {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 40px;
            line-height: 30px;
            width: 40px;
            &.time-l {
              text-align: left;
            }
            &.time-r {
              text-align: right;
            }
          }
          .progress-bar-wrapper {
            flex: 1;
          }
        }
        .operators {
          display: flex;
          align-items: center;
          .icon {
            flex: 1;
            color: $color-theme;
            &.disable {
              color: $color-theme-d;
            }
            i {
              font-size: 30px;
            }
          }
          .i-left {
            text-align: right;
          }
          .i-center {
            padding: 0 20px;
            text-align: center;
            i {
              font-size: 40px;
            }
          }
          .i-right {
            text-align: left
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active {
        transition: all .6s;
        .top, .bottom {
          transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
        }
      }
      &.normal-enter-from, &.normal-leave-to {
        opacity: 0;
        .top {
          transform: translate3d(0, -100px, 0);
        }
        .bottom {
          transform: translate3d(0, 100px, 0)
        }
      }
    }
  }
</style>
