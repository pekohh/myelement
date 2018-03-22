<template>
  <div class="footer" id="foot_guide">
    <section @click="gotoAddress({path: '/msite', query:{geohash}})" class="guide_item">
        <svg class="icon_style">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="$route.path.indexOf('msite') !== -1? '#msiteActive' : '#msite'"></use>
        </svg>
        <span>外卖</span>
    </section>
    <section @click="gotoAddress({path: '/search/geohash'})" class="guide_item">
        <svg class="icon_style">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="$route.path.indexOf('search') !== -1? '#findActive' : '#find'"></use>
        </svg>
        <span>搜索</span>
    </section>
    <section @click="gotoAddress({path: '/order'})" class="guide_item">
        <svg class="icon_style">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="$route.path.indexOf('order') !== -1? '#orderActive' : '#order'"></use>
        </svg>
        <span>订单</span>
    </section>
    <section @click="gotoAddress({path: '/profile'})" class="guide_item">
        <svg class="icon_style">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="$route.path.indexOf('profile') !== -1? '#profileActive' : '#profile'"></use>
        </svg>
        <span>我的</span>
    </section>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  computed: {
    ...mapGetters([
      'geohash'
    ])
  },
  methods: {
    gotoAddress (path) {
      this.$router.push(path)
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
#foot_guide
  background-color:#fff
  position:fixed
  z-index:100
  left:0
  right:0
  bottom:0
  wh(100%, 90px)
  display:flex
  box-shadow: 0 -0.026667rem 0.053333rem rgba(0,0,0,.1)
  .guide_item
    flex:1
    display:flex
    text-align:center
    flex-direction: column
    align-items: center
    .icon_style
      wh(40px, 40px)
      margin-bottom: 15px
      margin-top:15px
      fill:#ccc
    span
      sc(20px, #666)
</style>
