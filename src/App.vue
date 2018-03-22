<template>
  <div id="app">
    <transition name="router-fade" mode="out-in">
      <keep-alive>
          <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      </transition>
      <transition name="router-fade" mode="out-in">
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
    <svg-icon></svg-icon>
  </div>
</template>

<script>
import svgIcon from 'components/base/svg'
export default {
  name: 'App',
  components: {
    svgIcon
  }
}
</script>

<style lang='stylus'>
@import '~common/stylus/common.styl'
.router-fade-enter-active, .router-fade-leave-active
  transition: opacity .3s
.router-fade-enter, .router-fade-leave-active
  opacity: 0
</style>
