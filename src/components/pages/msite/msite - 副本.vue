<template>
  <div class="msite">
    <!-- 头部-->
    <header-top signin-up="msite">
      <!-- 搜索-->
      <router-link slot="search" :to="'/search/' + geohash" class="link_search">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <circle cx="8" cy="8" r="7" stroke="rgb(255,255,255)" stroke-width="1" fill="none"/>
            <line x1="14" y1="14" x2="20" y2="20" style="stroke:rgb(255,255,255);stroke-width:2"/>
        </svg>
      </router-link>
      <!-- 标题-->
      <router-link slot="msite-title" to="/home" class="msite_title">
        <span class="title_text ellipsis">{{msiteTitle}}</span>
      </router-link>
    </header-top>
    <!-- 本页店铺种类导航-->
    <nav class="msite_nav">
      <!---->
      <div class="swiper-container" v-if="foodTypes.length">
        <div class="swiper-wrapper">
          <div class="swiper-slide food_types_container" v-for="(item, index) in foodTypes" :key="index">
            <router-link class="link_to_food" v-for="foodItem in item" :key="foodItem.id" :to="{path: '/food', query: {geohash, title: foodItem.title, restaurant_category_id: getCategoryId(foodItem.link)}}">
              <figure>
                <img :src="imgBaseUrl + foodItem.image_url">
                <figcaption>{{foodItem.title}}</figcaption> <!--h5标签。图和标题 -->
              </figure>
            </router-link>
          </div>
        </div>
        <div class="swiper-pagination"></div>
      </div>
    </nav>
    <!-- 商店列表
    <div class="shop_list_container">
      <div class="shop_header">
        <svg class="shop_icon">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#shop"></use>
        </svg>
        <span class="shop_header_title">附近商家</span>
      </div>
      <shop-list v-if="hasGetData" :geohash="geohash"></shop-list>
    </div>-->
    <foot-guide></foot-guide>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import footGuide from 'components/base/footer/footer'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.min.css'
import {msiteFoodTypes, cityGuess, msiteAddress} from 'service/getData'
import shopList from 'components/base/shop-list/shop-list'
import {mapMutations} from 'vuex'

export default {
  data () {
    return {
      msiteTitle: '请选择地址...', // msite页面头部标题
      geohash: '', // city页面传过来的地址
      foodTypes: [], // 食品分类列表
      imgBaseUrl: 'https://fuss10.elemecdn.com', // 图片域名地址
      hasGetData: false // 是否已经获取地理位置数据，成功之后再获取商铺列表信息
    }
  },
  components: {
    headerTop,
    shopList,
    footGuide
  },
  async beforeMount () {
    if (!this.$route.query.geohash) {
      const address = await cityGuess()
      this.geohash = address.latitude + ',' + address.longitude
    } else {
      this.geohash = this.$route.query.geohash
    }
    // 保存geohash 到vuex
    this.SAVE_GEOHASH(this.geohash)
    // 获取位置信息
    let res = await msiteAddress(this.geohash)
    this.msiteTitle = res.name
    // 保存当前经纬度
    this.RECORD_ADDRESS(res)
    this.hasGetData = true
  },
  mounted () {
    // 获取导航食品类型列表
    msiteFoodTypes(this.geohash).then(res => {
      let resLength = res.length
      let resArr = [...res]
      let foodArr = []
      for (let i = 0, j = 0; i < resLength; i += 8, j++) {
        foodArr[j] = resArr.splice(0, 8) // 把前8条数据放到foodArr[0],并且resArr中删除这8个
      }
      this.foodTypes = foodArr // [[8],[8]]
    }).then(() => {
      // 初始化swiper
      /* eslint-disable no-new */
      new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        loop: true
      })
    })
  },
  methods: {
    ...mapMutations([
      'RECORD_ADDRESS', 'SAVE_GEOHASH'
    ]),
    // 解码url地址，求去restaurant_category_id值
    getCategoryId (url) {
      let urlData = decodeURIComponent(url.split('=')[1].replace('&target_name', '')) // 解码url
      if (/restaurant_category_id/gi.test(urlData)) {
        return JSON.parse(urlData).restaurant_category_id.id
      } else {
        return ''
      }
    }
  },
  watch: {
    geohash (newGeohash) {
      // console.log(newGeohash)
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.msite
  .link_search
    left: 40px
    wh(30px, 30px)
    ct()
  .msite_title
    center()
    width: 50%
    color:#fff
    text-align:center
    margin-left:-40px
    .title_text
      sc(20px, #fff)
      text-align: center
      display: block
  .msite_nav
    padding-top:100px
    background-color:#fff
    border-bottom: 2px solid $bc
    height: 500px
    .swiper-container
      wh(100%, auto)
      padding-bottom: 50px
      .swiper-pagination
        bottom: 10px
      .fl_back
        wh(100%, 100%)
      .food_types_container
        display: flex
        flex-wrap: wrap
        .link_to_food
          width: 25%
          padding: 10px 0
          fj(center)
          figure
            img
              margin-bottom: 20px
              wh(100px, 100px)
            figcaption
              text-align:center
              sc(30px, $666)
  .shop_list_container
    margin-top: 30px
    border-top: 2px solid $bc
    background-color:#fff
    .shop_header
      .shop_icon
        fill:#999
        margin-left: 20px
        vertical-align: middle
        wh(50px, 50px)
      .shop_header_title
        color:#999
        font(26px, 80px)

</style>
