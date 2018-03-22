<template>
  <div class="shoplist_container">
    <!-- 店铺列表-->
    <ul v-if="shopListArr.length" v-load-more="loaderMore">
        <router-link :to="{path: 'shop', query: {geohash, id: item.id}}"
        v-for="item in shopListArr" tag="li" :key="item.id" class="shop_li">
          <section>
              <img :src="imgBaseUrl + item.image_path" class="shop_img">
          </section>
          <hgroup class="shop_right">
              <!-- 1第一栏-->
              <header class="shop_detail_header">
                <h4 :class="item.is_premium ? 'premium' : ''" class="shop_title ellipsis">{{item.name}}</h4>
                <!--保准票-->
                <ul class="shop_detail_ul">
                  <li v-for="item in item.supports" class='supports' :key="item.id">{{item.icon_name}}</li>
                </ul>
              </header>
              <!--2评价月售-->
              <h5 class="rating_order_num">
                <section class="rating_order_num_left">
                  <section class="rating_section">
                    <rating-star :rating="item.rating"></rating-star>
                    <span class="rating_num">{{item.rating}}</span>
                  </section>
                  <section class="order_section">
                    月售{{item.recent_order_num}}单
                  </section>
                </section>
                <section class="rating_order_num_right">
                  <span class="delivery_style delivery_left" v-if="item.delivery_mode">{{item.delivery_mode.text}}</span>
                  <span class="delivery_style delivery_right" v-if="zhunshi(item.supports)">准时达</span>
                </section>
              </h5>
              <!--3费用-->
              <h5 class="fee_distance">
                <p class="fee">
                  ￥{{item.float_minimum_order_amount}}起送
                  <span class="segmentation">/</span>
                  {{item.piecewise_agent_fee.tips}}
                </p>
                <p class="distance_time">
                  <span v-if="Number(item.distance)">{{item.distance > 1000 ? (item.distance/1000).toFixed(2) + 'km': item.distance + 'm'}}<span class="segmentation">/</span></span>
                  <span v-else>{{item.distance}}</span>
                  <span class="segmentation">/</span>
                  <span class="order_time">{{item.order_lead_time}}</span>
                </p>
              </h5>
          </hgroup>
        </router-link>
    </ul>
    <!-- -->
    <ul v-else class="animation_opactiy">
      <li class="list_back_li" v-for="item in 10" :key="item">
        <img src="src/images/shop_back_svg" class="list_back_svg">
      </li>
    </ul>
  </div>
</template>

<script>
import {shopList} from 'service/getData'
import {mapGetters} from 'vuex'
import {imgBaseUrl} from 'config/env'
import ratingStar from 'components/base/rating-star/rating-star'

export default {
  data () {
    return {
      offset: 0, // 批次加载店铺列表，每次加载20个 limit = 20
      shopListArr: [], // 店铺列表数据
      touchend: false, // 没有更多数据
      imgBaseUrl,
      showLoading: true, // 显示加载动画
      preventRepeatRequest: false // 到达底部加载数据，防止重复加载
    }
  },
  components: {
    ratingStar
  },
  mounted () {
    this.initData()
  },
  computed: {
    ...mapGetters([
      'latitude', 'longitude'
    ])
  },
  props: {
    restaurantCategoryId: { // 食品分类(16个)类型id值
      type: Number,
      default: 0
    },
    restaurantCategoryIds: { // 排序类型的id
      type: Number,
      default: 0
    },
    sortByType: { // 根据(6种)何种方式排序
      type: String,
      default: ''
    },
    deliveryMode: {
      type: Number,
      default: 0
    },
    comfirmSelect: {
      type: Boolean,
      default: false
    },
    geohash: { // msite页面传过来的地址geohash
      type: String,
      default: ''
    },
    supportIds: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    async initData () {
      // 获取数据(此地区的店铺列表)
      let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId)
      this.shopListArr = [...res]
      if (res.length < 20) {
        this.touchend = true
      }
      // this.hideLoading()
    },
    zhunshi (supports) {
      let zhunStatus
      if ((supports instanceof Array) && supports.length) {
        supports.forEach(item => {
          if (item.icon_name === '准') {
            zhunStatus = true
          }
        })
      } else {
        zhunStatus = false
      }
      return zhunStatus
    },
    // 到达底部加载更多数据
    async loaderMore () {
      if (this.touchend) {
        return
      }
      // 防止重复请求
      if (this.preventRepeatRequest) {
        return
      }
      this.showLoading = true
      this.preventRepeatRequest = true
      this.offset += 20
      let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCatgegoryId)
      this.hideLoading()
      this.shopListAee = [...this.shopListArr, ...res]
      if (res.legth < 20) {
        this.touchend = true
        return
      }
      this.preventRepeatRequest = false
    },
    // 监听父级传来的数据发生变化时，触发此函数重新根据属性值获取数据
    async listenPropChange () {
      this.offset = 0
      let res = await shopList(this.latitude, this.longitude, this.offset, '', this.restaurantCategoryIds, this.sortByType, this.deliveryMode, this.supportIds)
      // 考虑到本地模拟数据是引用类型，所以返回一个新的数组
      this.shopListArr = [...res]
    }
  },
  watch: {
    // 监听父级传来的restaurantCategoryIds，当值发生变化的时候重新获取餐馆数据，作用于排序和筛选
    restaurantCategoryIds: function () {
      this.listenPropChange()
    },
    // 监听父级传来的排序方式
    sortByType: function (value) {
      console.log(value)
      this.listenPropChange()
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.shoplist_container
  background-color:#fff
  margin-bottom:20px
  .shop_li
    display: flex
    border-bottom:2px solid #f1f1f1
    padding: 25px 15px
    .shop_img
      wh(140px, 140px)
      display: block
      margin-right:20px
    .shop_right
      flex: auto
      .shop_detail_header
        fj()
        align-items:center
        .shop_title
          width: 400px
          color:#333
          padding-top:10px
          font(30px, 30px, 'PingFangSC-Regular')
          font-weight:700
        .premium::before
          content: '品牌'
          display: inline-block
          font-size:20px
          line-height: 40px
          color:#333
          background-color:#ffd930
          padding: 0 10px
          border-radius: 5px
          margin-right: 10px
        .shop_detail_ul
          display:flex
          transform:scale(.8)
          margin-right:-10px
          .supports
            sc(20px, #999)
            border: 1px solid #f1f1f1
            padding: 0 3px
            border-radius:5px
            margin-left:8px
      .rating_order_num
        fj(space-between)
        height: 30px
        margin-top:20px
        .rating_order_num_left
          fj(flex-start)
          .rating_section
            display: flex
            .rating_num
              sc(20px, #ff6000)
              margin: 0 10px
          .order_section
            transform: scale(.8)
            margin-left: -4px
            sc(20px, #666)
        .rating_order_num_right
          display: flex
          align-items: center
          transform: scale(.7)
          min-width: 60px
          justify-content: flex-end
          margin-right: -20px
          .delivery_style
            font-size:16px
            padding: 4px 6px
            border-radius: 6px
            margin-left: 10px
            border:1px
          .delivery_left
            color:#fff
            background-color:$blue
            border: 1px solid $blue
          .delivery_right
            color:$blue
            border:1px solid $blue
      .fee_distance
        margin-top:10px
        fj()
        sc(14px, #333)
        .fee
          transform:scale(.9)
          sc(14px, #666)
        .distance_time
          transform: scale(.9)
          span
            color:#999
          .order_time
            color:$blue
          .segmenttation
            color:#ccc
</style>
