<template>
  <div class="order_page">
    <header-top head-title="订单列表" :goBack="goBack"></header-top>
    <ul class="order_list_ul" v-load-more='loaderMore'>
      <li class="order_list_li" v-for="item in orderList" :key="item.id">
        <img :src="imgBaseUrl + item.restaurant_image_url" class="restaurant_image">
        <section class="order_item_right">
        <!--店铺-->
         <section @click="showDetail(item)">
          <header class="order_item_right_header">
            <section class="order_header">
              <h4>
                <span class="ellipsis">{{item.restaurant_name}}</span>
                <svg fill="#333" class="arrow_right">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                </svg>
              </h4>
              <p class="order_time">{{item.formatted_created_at}}</p>
            </section>
            <!--支付状态-->
            <p class="order_status">
              {{item.status_bar.title}}
            </p>
          </header>
          <!--食品名称-->
          <section class="order_basket">
            <p class="order_name ellipsis">{{item.basket.group[0][0].name}}{{item.basket.group[0].length>1?'等'+item.basket.group[0].length+'件商品': ''}}</p>
            <p class="order_amount">¥{{item.total_amount.toFixed(2)}}</p>
          </section>
         </section>
         <!--支付倒计时-->
         <div class="order_again">
            <compute-time v-if="item.status_bar.title==='等待支付'" :time="item.time_pass"></compute-time>
            <router-link :to="{path: '/shop', query: {geohash, id: item.restaurant_id}}" tag="span" class="buy_again" v-else>再来一单</router-link>
          </div>
        </section>
      </li>
    </ul>
    <foot-guide></foot-guide>
    <transition name="loading">
      <loading v-show="showLoading"></loading>
    </transition>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import footGuide from 'components/base/footer/footer'
import loading from 'components/base/loading/loading'
import computeTime from 'components/base/computeTime/computeTime'
import {imgBaseUrl} from 'config/env'
import {getOrderList} from 'service/getData'
import {mapGetters, mapMutations} from 'vuex'
import {loadMore} from 'common/js/mixin'

export default {
  mixins: [loadMore],
  data () {
    return {
      goBack: true,
      imgBaseUrl,
      orderList: null,
      showLoading: true, // 显示加载动画
      offset: 0
    }
  },
  components: {
    headerTop,
    footGuide,
    loading,
    computeTime
  },
  mounted () {
    this.initData()
  },
  computed: {
    ...mapGetters([
      'userInfo', 'geohash'
    ])
  },
  methods: {
    ...mapMutations([
      'SAVE_ORDER'
    ]),
    async initData () {
      if (this.userInfo && this.userInfo.user_id) {
        let res = await getOrderList(this.userInfo.user_id, this.offset) // 从数据库中获取订单数据列表
        this.orderList = [...res]
        this.hideLoading()
      } else {
        this.hideLoading()
      }
    },
    // 生产环境与发布环境隐藏loading的方式 不同
    hideLoading () {
      this.showLoading = false
    },
    // 加载更多
    async loaderMore () {
      if (this.preventRepeat) {
        return
      }
      this.preventRepeat = true
      this.showLoading = true
      this.offset += 10
      // 获取信息
      let res = await getOrderList(this.userInfo.user_id, this.offset)
      this.orderList = [...this.orderList, ...res]
      this.hideLoading()
      if (res.length < 10) {
        return
      }
      this.preventRepeat = false
    },
    // 显示详情页
    showDetail (item) {
      this.SAVE_ORDER(item) // 将当前信息存入vuex
      this.preventRepeat = false
      this.$router.push('/order/orderDetail')
    }
  },
  watch: {
    userInfo (value) {
      if (value && value.user_id && !this.orderList) {
        this.initData()
      }
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.order_page
  background-color:#f1f1f1
  margin-bottom:100px
  p, span, h4
    font-family: Helvetica Neue,Tahoma,Arial
  .order_list_ul
    padding-top: 100px
    .order_list_li
      background-color:#fff
      display: flex
      margin-bottom: 20px
      padding:10px 20px 0
      .restaurant_image
        wh(100px, 100px)
        margin-right:20px
      .order_item_right
        flex:5
        .order_item_right_header
          border-bottom:1px solid #f5f5f5
          padding-bottom:1px
          fj()
          .order_header
            h4
              display:flex
              align-items:center
              justify-content:flex-start
              sc(30px, #333)
              line-height:60px
              width:200px
              .arrow_right
                wh(30px, 30px)
                fill:#ccc
                margin-left:10px
            .order_time
              sc(26px, #999)
              line-height:60px
          .order_status
            sc(30px, #333)
        .order_basket
          fj()
          line-height:60px
          border-bottom:1px solid #f5f5f5
          .order_name
            sc(26px, #666)
            width:200px
          .order_amount
            sc(20px, #f60)
            font-weight:bold
        .order_again
          text-align:right
          line-height:60px
          .buy_again
            sc(20px, #3190e8)
            border:1px solid #3190e8
            padding:10px 20px
            border-radius:6px
  .router-slid-enter-active, .router-leave-enter-active
    transition: all .4s
  .router-slid-enter, .router-slid-leave-active
    transform: translate3d(100px, 0, 0)
    opacity: 0
</style>
