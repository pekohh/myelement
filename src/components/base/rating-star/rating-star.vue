<template>
  <div class="rating_container" >
    <section class="star_container">
      <svg class="grey_fill" v-for="num in 5" :key="num">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#star"></use>
      </svg>
    </section>
    <div :style="'width:' + rating * 2 /5 + 'px'" class="star_overflow">
      <section class="star_container">
          <svg class="orange_fill" v-for="num in 5" :key="num">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#star"></use>
          </svg>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  props: {
    rating: {
      type: Number,
      default: 0
    }
  },
  computed: {
    culWidth () {
      console.log(1)
      console.log(this.$refs.star)
      return `width: ${this.$refs.star.clientWidth * this.rating}`
    }
  }
}
</script>
<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.rating_container
  position: relative
  top: 10px
  wh(100px, 26px)
  .star_container
    position:absolute
    display:flex
    width: 100px
    height:26px
    top: -4px
    .grey_fill
      fill:#d1d1d1
    .orange_fill
        fill:#ff9a0d
  .star_overflow
    overflow: hidden
    position: relative
    height: 100%
</style>
