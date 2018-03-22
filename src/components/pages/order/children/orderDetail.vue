<template>
  <div class="order_detail_page">
    <header-top head-title="订单详情" :goBack="goBack"></header-top>
    <section v-if="!showLoading" id="scroll_section" class="scroll_container">
      <section class="scroll_insert">
        <!--头部-->
        <section class="order_title">
          <img :src="imgBaseUrl + orderDetail.restaurant_image_url">
          <p>{{orderDetail.status_bar.title}}</p>
          <p>{{orderDetail.timeline_node.description}}</p>
          <router-link class="order_again" :to='{path: "/shop", query: {geohash, id: orderDetail.restaurant_id}}'>再来一单</router-link>
        </section>
        <!--食品信息-->
        <section class="food_list">
          <router-link class="food_list_header" :to="{path: '/shop', query: {geohash, id:orderDetail.restaurant_id}}">
            <div class="shop_name">
             <img :src="imgBaseUrl + orderDetail.restaurant_imgage_url">
             <span>{{orderDetail.restaurant_name}}</span>
            </div>
            <svg fill="#333" class="arrow_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </router-link>
          <!--列表-->
          <ul class="food_list_ul">
            <li v-for="item in orderDetail.basket.group[0]" :key="item.id">
              <p class="food_name ellipsis">{{item.name}}</p>
              <div class="quantity_price">
                <span>X{{item.quantity}}</span>
                <span>￥{{item.price}}</span>
              </div>
            </li>
          </ul>
          <div class="deliver_fee">
            <span>配送费</span>
            <span>{{orderDetail.basket.deliver_fee&&orderDetail.basket.deliver_fee.price||0}}</span>
          </div>
          <div class="pay_ment">实付{{orderDetail.total_amount.toFixed(2)}}</div>
        </section>
        <section class="order_detail_style">
          <header>配送信息</header>
          <section class="item_style">
            <p class="item_left">送达时间：</p>
            <div class="item_right">
              <p>{{orderData.deliver_time}}</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">送货地址：</p>
            <div class="item_right">
              <p>{{orderData.consignee}}</p>
              <p>{{orderData.phone}}</p>
              <p>{{orderData.address}}</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">配送方式：</p>
            <div class="item_right">
              <p>蜂鸟专送</p>
            </div>
          </section>
        </section>
        <!--订单信息-->
        <section class="order_detail_style">
          <header>订单信息</header>
          <section class="item_style">
            <p class="item_left">订单号：</p>
            <div class="item_right">
              <p>{{orderDetail.id}}</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">支付方式：</p>
            <div class="item_right">
              <p>在线支付</p>
            </div>
          </section>
          <section class="item_style">
            <p class="item_left">下单时间：</p>
            <div class="item_right">
              <p>{{orderDetail.formatted_created_at}}</p>
            </div>
          </section>
        </section>
      </section>
    </section>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import {imgBaseUrl} from 'config/env'
import {getOrderDetail} from 'service/getData'
import BScroll from 'better-scroll'
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      goBack: true,
      showLoading: true,
      imgBaseUrl
    }
  },
  components: {
    headerTop
  },
  mounted () {
    this.initData()
  },
  computed: {
    ...mapGetters([
      'orderDetail', 'userInfo', 'geohash'
    ])
  },
  methods: {
    // 初始化数据
    async initData () {
      console.log(this.orderDetail)
      if (this.userInfo && this.userInfo.user_id) {
        this.orderData = await getOrderDetail(this.userInfo.user_id, this.orderDetail.unique_id)
        this.showLoading = false
        this.$nextTick(() => {
          /* eslint-disable no-new */
          new BScroll('#scroll_section', {
            deceleration: 0.001,
            bounce: true,
            swipeTime: 1800,
            click: true
          })
        })
      }
    }
  },
  watch: {
    userInfo (value) {
      if (value && value.user_id) {
        this.initData()
      }
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.order_detail_page
  position: fixed
  top:0
  left:0
  right:0
  bottom:0
  background-color:#f1f1f1
  z-index:202
  padding-top:100px
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .scroll_container
    position: fixed
    top:0
    left:0
    right: 0
    bottom:0
    padding-top:100px
    .scroll_insert
      padding-bottom:100px
      .order_title
        display:flex
        flex-direction:column
        align-items:center
        padding:10px
        background-color:#fff
        margin-bottom:20px
        img
          border:1px solid $blue
          border-radius:50%
          wh(100px, 100px)
        p:nth-of-type(1)
          sc(30px, #333)
          font-weight:bold
          margin-top:30px
        p:nth-of-type(2)
          sc(30px, #999)
          width:100px
          margin-top:30px
          text-align:center
        .order_again
          sc(30px, $blue)
          margin-top:30px
          border:1px solid $blue
          padding:20px 30px
          border-radius:2px
      .food_list
        background-color:#fff
        .food_list_header
          fj()
          align-items:center
          padding:20px 30px
          border-bottom:1px solid #f5f5f5
          .shop_name
            img
              wh(60px, 60px)
              vertical-align:middle
              margin-right:20px
            span
              sc(36px, #333)
              font-weight:bold
          svg
            wh(30px, 30px)
            fill:#666
        .food_list_ul
          li
            fj()
            align-items:center
            padding:0 10px
            line-height:60px
            .food_name
              sc(30px, #666)
              flex:4
            .quantity_price
              flex:1
              fj()
              align-items:center
              span:nth-of-type(1)
                sc(30px, #ccc)
              span:nth-of-type(2)
                sc(30px, #666)
        .deliver_fee
          fj()
          align-items:center
          padding:0 10px
          line-height:60px
          border-top:1px solid #f5f5f5
          span
            sc(30px, #666)
        .pay_ment
          sc(30px, #fb6b23)
          border-top:1px solid #f5f5f5
          font-weight:bold
          line-height:60px
          text-align:right
          padding-right:20px
      .order_detail_style
        background-color: #fff
        margin-top: 30px
        header
          sc(36px, #333)
          padding: 20px
          border-bottom: 1px solid #f5f5f5
        .item_style
          display: flex
          padding: 20px
          p
            sc(30px, #666)
            line-height:60px
</style>
