<template>
  <div class="rating_page">
    <head-top :head-title='name' :go-back='goBack'></head-top>
    <section class="header_img">
      <img :src="imgpath" class="food_img"/>
      <div class="cover"></div>
    </section>
    <p class="description">{{description}}</p>
    <section class="detail_container">
      <section class="detail_left">
        <p>{{name}}</p>
        <div class="rating_sale">
          <span>评分</span>
          <rating-star :rating='rating'></rating-star>
          <span>{{rating.toFixed(1)}}</span>
        </div>
        <p>
          <span>月售{{month_sales}}单</span>
          <span>售价¥{{foods.specfoods[0].price}}</span>
          <span v-if='foods.specfoods.length'>起</span>
        </p>
        <p>
          <span>评论数 {{rating_count}}</span>
          <span>好评率 {{satisfy_rate}}%</span>
        </p>
      </section>
    </section>
  </div>
</template>

<script>
import headTop from 'components/base/header/header'
import ratingStar from 'components/base/rating-star/rating-star'

import {imgBaseUrl} from 'config/env'

export default {
  data () {
    return {
      goBack: true,
      imgBaseUrl,
      image_path: null,
      description: null,
      month_sales: null,
      name: null,
      rating: null,
      rating_count: null,
      satisfy_rate: null,
      foods: null,
      shopId: null
    }
  },
  components: {
    headTop,
    ratingStar
  },
  created () {
    this.image_path = this.$route.query.image_path
    this.description = this.$route.query.description
    this.month_sales = this.$route.query.month_sales
    this.name = this.$route.query.name
    this.rating = this.$route.query.rating
    this.satisfy_rate = this.$route.query.satisfy_rate
    this.foods = this.$route.query.foods
    this.shopId = this.$route.query.shopId
  },
  computed: {
    imgpath () {
      let url = imgBaseUrl + this.image_path
      return url
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.rating_page
  position: absolute
  top:0
  right:0
  left:0
  bottom:100px
  padding-top:10px
  background-color:#fff
  z-index:12
  .header_img
    position: relative
    .food_img
      width: 100%
      display: block
      height: 800px
      .cover
        position: absolute
        wh(100%, 100%)
        top:0
        left:0
  .description
    sc(20px, #666)
    margin-top:20px
    line-height:60px
    bottom: 20px
    padding:0 20px
  .detail_container
    padding: 20px
    fj()
    align-items: center
    .detail_left
      p:nth-of-type(1)
        sc(20px, #333)
        margin-bottom:20px
        line-height:40px
      .rating_sale
        display: flex
        align-items:center
        line-height:60px
        span:nth-of-type(1)
          sc(20px, #666)
          margin-right:20px
        span:nth-of-type(2)
          sc(30px, #f60)
          margin-left:20px
        span:nth-of-type(3)
          sc(30px, #666)
          margin-left:30px
      p:nth-of-type(2)
        font-size:0
        margin-top:20px
        margin-bottom:20px
        span:nth-of-type(1)
          sc(20px, #666)
          margin-right:30px
        span:nth-of-type(2), span:nth-of-type(3)
          sc(30px, #f60)
          margin-right:30px
      p:nth-of-type(3)
        span
          sc(30px, #666)
</style>
