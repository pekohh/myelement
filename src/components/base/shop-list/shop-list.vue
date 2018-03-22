<template>
  <div class="shoplist_container">
    <!--加载更多-->
    <ul v-load-more="loaderMore" v-if="shopListArr.length" type="1">
      <router-link :to="{path: 'shop',query: {geohash, id:item.id}}" v-for="item in shopListArr" tag="li" :key="item.id" class="shop_li">
       <section>
         <img :src="imgBaseUrl + item.image_path" class="shop_img">
       </section>
       <hgroup class="shop_right">
         <!--第一行-->
         <header class="shop_detail_header">
           <h4 :class="item.is_premium?'premium':''" class="shop_title">{{item.name}}</h4>
           <ul class="shop_detail_ul">
             <li class="supports" v-for="item in item.supports" :key="item.id">{{item.icon_name}}</li>
           </ul>
         </header>
         <!--第二行-->
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
             <span class="delivery_style delivery_left" v-if="item.delivery_mode">
               {{item.delivery_mode.text}}
             </span>
             <span class="delivery_style delivery_right" v-if="zhunshi(item.supports)">准时达</span>
           </section>
         </h5>
         <!--第三行-->
         <h5 class="fee_distance">
           <p class="fee">
             ¥{{item.float_minimum_order_amount}}起送
             <span class="segmentation">/</span>
             {{item.piecewise_agent_fee.tips}}
           </p>
           <p class="distance_time">
             <span v-if="Number(item.distance)">{{item.distance > 1000 ? (item.distance/1000).toFixed(2) + 'km': item.distance + 'm'}}
               <span class="segmentation">/</span>
             </span>
             <span v-else>{{item.distance}}</span>
             <span class="segmentation">/</span>
             <span class="order_time">{{item.order_lead_time}}</span>
           </p>
         </h5>
       </hgroup>
      </router-link>
    </ul>
    <!--没有了-->
    <ul v-else class="animation_ipacity">
      <li class="list_back_li">
        <img src="src/images/shopback.svg" class="list_back_svg">
      </li>
    </ul>
    <!--最底下显示没有更多了-->
    <p v-if="touchend" class="empty_data">没有更多了</p>
    <!--返回顶部-->
    <aside class="return_top" v-if="showBackStatus" @click="backTop">
      <svg class="back_top_svg">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#backtop"></use>
      </svg>
    </aside>
  </div>
</template>

<script>
import ratingStar from 'components/base/rating-star/rating-star'
import {shopList} from 'service/getData'
import {mapGetters} from 'vuex'
import {imgBaseUrl} from 'config/env'
import {loadMore} from 'common/js/mixin.js'
import {showBack, animate} from 'config/Util'

export default {
  mixins: [loadMore],
  data () {
    return {
      offset: 0, // 批次加载店铺列表，每次加载20个 limit = 20
      shopListArr: [], // 店铺列表数据
      imgBaseUrl,
      preventRepeatReuqest: false, // 到达底部加载数据,防止重复加载
      touchend: false, // 没有更多数据了
      showBackStatus: false // 是否显示返回顶部按钮
    }
  },
  components: {
    ratingStar
  },
  mounted () {
    this.initData()
  },
  props: {
    restaurantCategoryId: { // 分类id
      type: Number,
      default: 0
    },
    restaurantCategoryIds: { // 食品分类id
      type: Number,
      default: 0
    },
    sortByType: { // 排序.data的值
      type: String,
      default: null
    },
    deliveryMode: { // 配送方式
      type: String,
      default: null
    },
    supportIds: {
      type: Array,
      default: function () {
        return []
      }
    },
    confirmSelect: {
      type: Boolean,
      default: false
    },
    geohash: {
      type: String,
      default: ''
    }
  },
  computed: {
    ...mapGetters([
      'latitude', 'longitude'
    ])
  },
  methods: {
    // 初始化数据
    async initData () {
      let res = await shopList(this.latitude, this.longitudde, this.offset, this.restaurantCategoryId)
      this.shopListArr = [...res]
      if (res.length < 20) { // 如果初始化时数据都不够20条。说明数据根本没有20条。touchend为true
        this.touched = true
      }
      // 开始监听scrollTop的值，达到一定程度后显示返回顶部按钮
      showBack((status) => {
        this.showBackStatus = status
      })
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
      if (this.touchend) { // 如果加载更多前。touchend为true,则没有更多数据了。返回
        return
      }
      // 防止重复请求
      if (this.preventRepeatReuqest) {
        return
      }
      this.preventRepeatReuqest = true

      // 数据的定位加20个
      this.offset += 20
      let res = await shopList(this.latitude, this.longitude, this.offset, this.restaurantCategoryId)
      this.shopListArr = [...this.shopListArr, ...res]
      // 当数据小于20,说明没有更多数据,不需要再次请求数据
      if (res.length < 20) {
        this.touchend = true
        return
      }
      this.preventRepeatReuqest = false
    },
    // 返回顶部
    backTop () {
      animate(document.body, {scrollTop: '0'}, 400, 'ease-out')
    },
    // 监听父级传来的数据发生变化时，触发此函数重新根据属性值获取数据
    async listenPropChange () {
      this.showLoading = true
      this.offset = 0
      let res = await shopList(this.latitude, this.longitude, this.offset, '', this.restaurantCategoryIds, this.sortByType, this.deliveryMode, this.supportIds)
      this.shopListArr = [...res]
    }
  },
  watch: {
    // 监听父级传来的restaurantCategoryIds，当值发生变化的时候重新获取餐馆数据，作用于排序和筛选
    restaurantCategoryIds (value) {
      this.listenPropChange()
    },
    // 监听父级传来的排序方式
    sortByType (value) {
      this.listenPropChange()
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.shoplist_container
  background-color:#fff
  margin-bottom:120px
  .shop_li
    display:flex
    border-bottom:1px solid #f1f1f1
    padding:10px 10px
    .shop_img
      wh(140px, 140px)
      display:block
      margin-right:10px
    .shop_right
      flex: auto
      .shop_detail_header
        fj()
        align-items:center
        .shop_title
          width: 300px
          color:#333
          padding-top: 4px
          font(30px, 30px, 'PingFangSC-Regular')
          font-weight:700
        .premium::before
          content: '品牌'
          display: inline-block
          font-size: 16px
          line-height:32px
          color:#333
          background-color:#ffd930
          padding:0 10px
          border-radius:10px
          margin-right:10px
        .shop_detail_ul
          display:flex
          transform:scale(.8)
          margin-right:-10px
          .supports
            sc(20px, #999)
            border:1px solid #f1f1f1
            padding: 0 0 10px
            border-radius:10px
            margin-left:6px
      .rating_order_num
        fj(space-between)
        height: 30px
        margin-top:16px
        .rating_order_num_left
          fj(flex-start)
          .rating_section
            display: flex
            .rating_num
              sc(20px, #ff6000)
              margin:0 10px
          .order_section
            transform: scale(.8)
            margin-left: -10px
            sc(20px, #666)
        .rating_order_num_right
          display:flex
          align-items:center
          transform: scale(.7)
          min-width: 10px
          justify-content:flex-end
          margin-right:-20px
          .delivery_style
            font-size:20px
            padding: 6px 10px
            border-radius:4px
            margin-left:10px
            line-height:30px
            border:1px
          .delivery_left
            color:#fff
            background-color:$blue
            border:1px solid $blue
          .delivery_right
            color:$blue
            border:1px solid $blue
      .fee_distance
        margin-top:16px
        fj()
        sc(24px, #333)
        .fee
          transform: scale(.9)
          sc(20px, #666)
        .distance_time
          transform:scale(.9)
          span
            color:#999
          .order_time
            color:$blue
          .segmentation
            color:#ccc
  .list_back_li
    height:60px
    .list_back_svg
      wh(100%, 100%)
  .empty_data
    sc(26px, #666)
    text-align:center
    line-height:80px
  .return_top
    position: fixed
    bottom: 100px
    right:10px
    .back_top_svg
      wh(100px, 100px)
</style>
