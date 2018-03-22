<template>
  <div class="confirmOrderContainer">
    <section v-if="!showLoading">
      <header-top head-title="确认订单" :goBack="goBack" signin-up='confirmOrder'></header-top>
      <router-link :to="{path: '/confirmOrder/chooseAddress', query: {id: checkoutData.cart.id, sig: checkoutData.sig}}" class="address_container">
        <div class="address_empty_left">
          <svg class="location_icon">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#location"></use>
          </svg>
          <!--如果没有选中地址-->
          <div class="add_address" v-if="!choosedAddress">请添加一个收货地址</div>
          <!--将现有的地址显示出来-->
          <div v-else class="address_detail_container">
            <header>
              <span>{{choosedAddress.name}}</span>
              <span>{{choosedAddress.sex === 1 ? '先生' : '女士'}}</span>
              <span>{{choosedAddress.phone}}</span>
            </header>
            <div class="address_detail">
              <span v-if="choosedAddress.tag" :style="{backgroundColor: iconColor(choosedAddress.tag)}">{{choosedAddress.tag}}</span>
              <p>{{choosedAddress.address_detail}}</p>
            </div>
          </div>
        </div>
        <svg class="address_empty_right">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
        </svg>
     </router-link>
     <!--送达时间-->
     <section class="delivery_model container_style">
      <p class="delivery_text">送达时间</p>
      <section class="delivery_time">
        <p>尽快送达|预计{{checkoutData.delivery_reach_time}}</p>
        <p v-if="checkoutData.cart.is_deliver_by_fengniao">蜂鸟专送</p>
      </section>
     </section>
     <!--支付方式-->
     <section class="pay_way container_style">
        <header class="header_style">
          <span>支付方式</span>
          <div class="more_type" @click="showPayWayFun">
            <span>在线支付</span>
            <svg class="address_empty_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </div>
        </header>
        <section class="hongbo">
          <span>红包</span>
          <span>暂时只在饿了么APP中支持</span>
        </section>
      </section>
      <!--购物车食品列表-->
      <section class="food_list">
        <header v-if="checkoutData.cart.restaurant_info">
          <img :src="imgBaseUrl + checkoutData.cart.restaurant_info.image_path">
          <span>{{checkoutData.cart.restaurant_info.name}}</span>
        </header>
        <ul class="food_list_ul" v-if="checkoutData.cart.groups">
          <li v-for="item in checkoutData.cart.groups[0]" :key="item.id" class="food_item_style">
            <p class="food_name ellipsis">{{item.name}}</p>
            <div class="num_price">
              <span>X{{item.quantity}}</span>
              <span>￥{{item.price}}</span>
            </div>
          </li>
        </ul>
        <div class="food_item_style" v-if="checkoutData.cart.extra">
          <p class="food_name ellisis">{{checkoutData.cart.extra[0].name}}</p>
          <div class="num_price">
            <span></span>
            <span>￥{{checkoutData.cart.extra[0].price}}</span>
          </div>
        </div>
        <div class="food_item_style">
          <p class="food_name ellipsis">配送费</p>
          <div class="num_price">
            <span></span>
            <span>￥{{checkoutData.cart.deliver_amount || 0}}</span>
          </div>
        </div>
        <div class="food_item_style total_price">
          <p class="food_name ellipsis">订单￥{{checkoutData.cart.total}}</P>
          <div class="num_price">
            <span>待支付￥{{checkoutData.cart.total}}</span>
          </div>
        </div>
      </section>
      <!--支付方式备注-->
      <section class="pay_way container_style">
        <router-link :to="{path: '/confirmOrder/remark', query: {id:checkoutData.cart.id, sig:checkoutData.sig}}" class="header_style">
          <span>订单备注</span>
          <div class="more_type">
            <span class="ellipsis">{{remarkText||inputText?remarklist: '口味、偏好等'}}</span>
            <svg class="address_empty_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </div>
        </router-link>
        <router-link :to="checkoutData.invoice.is_available? '/confirmOrder/invoice': ''" class="hongbo" :class="{support_is_available:checkoutData.invoice.is_available}">
          <span>发票抬头</span>
          <span class="more_type">
            {{checkoutData.invoice.status_text}}
            <svg class="address_empty_right">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </span>
        </router-link>
      </section>
      <!--确认-->
      <section class="confrim_order">
        <p>待支付￥{{checkoutData.cart.total}}</p>
        <p @click='confirmOrder'>确认下单</p>
      </section>
      <!--支付方式的组件-->
      <transition name="fade">
        <div class="cover" v-if="showPayWay" @click="showPayWayFun"></div>
      </transition>
      <transition name="slid_up">
        <div class="choose_type_container" v-if="showPayWay">
          <header>支付方式</header>
          <ul>
            <li v-for="item in checkoutData.payments" :key="item.id" :class="{choose:payWayId === item.id}" @click="choosePayWay(item.is_online_payment, item.id)">
              <span>
                {{item.name}}
                <span v-if="!item.is_online_payment">{{item.description}}</span>
              </span>
              <svg class="address_empty_right">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
            </li>
          </ul>
        </div>
      </transition>
    </section>
    <alert-tip v-if="showAlert" @closeTip="showAlert=false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import {mapGetters, mapMutations} from 'vuex'
import alertTip from 'components/base/alertTip/alertTip'
import {checkout, getAddressList, placeOrders} from 'service/getData'
import {imgBaseUrl} from 'config/env'

export default {
  data () {
    return {
      goBack: true,
      geohash: '',
      checkoutData: null,
      showAlert: false,
      alertText: '',
      showLoading: true, // 显示加载动画
      imgBaseUrl, // 图片域名
      showPayWay: false, // 显示付款方式
      payWayId: 1 // 付款方式
    }
  },
  components: {
    headerTop,
    alertTip
  },
  created () {
    // 初始化上级页面传来的数据
    this.geohash = this.$route.query.geohash
    // 获取上个页面传来的shopid
    this.shopId = this.$route.query.shopId
    this.INIT_BUYCART()
    this.SAVE_SHOPID(this.shopId)
    // 获取当前商铺购物车信息
    this.shopCart = this.cartList[this.shopId]
  },
  computed: {
    ...mapGetters([
      'cartList', 'choosedAddress', 'remarkText', 'inputText', 'userInfo'
    ]),
    // 备注页面返回的信息进行处理
    remarklist () {
      let str = ''
      if (this.remarkText) {
        Object.values(this.remarkText).forEach(item => {
          str += item[1] + ', '
        })
      }
      // 是否有自定义备注，分开处理
      if (this.inputText) {
        return str + this.inputText
      } else {
        return str.substr(0, str.lastIndexOf(', '))
      }
    }
  },
  mounted () {
    if (this.geohash) {
      this.initData()
      this.SAVE_GEOHASH(this.geohash)
    }
  },
  methods: {
    ...mapMutations([
      'INIT_BUYCART', 'SAVE_GEOHASH', 'SAVE_SHOPID', 'SAVE_CART_ID_SIG', 'CHOOSE_ADDRESS', 'SAVE_ORDER_PARAM', 'NEED_VALIDATION', 'ORDER_SUCCESS'
    ]),
    // 初始化数据
    async initData () {
      /* eslint-disable */
      let newArr = new Array()
      // 将shopCart购物车里的数据整合
      Object.values(this.shopCart).forEach(categoryItem => {
        Object.values(categoryItem).forEach(itemValue => {
          Object.values(itemValue).forEach(item => {
            newArr.push({
              attrs: [],
              extra: {},
              id: item.id,
              name: item.name,
              packing_fee: item.packing_fee,
              price: item.price,
              quantity: item.num,
              sku_id: item.sku_id,
              specs: [item.specs],
              stock: item.stock
            })
          })
        })
      })
      // 检验订单是否满足条件
      this.checkoutData = await checkout(this.geohash, [newArr], this.shopId) // 在数据库里做检测
      // console.log(this.checkoutData)
      this.SAVE_CART_ID_SIG({ // 保存在vuex下单后购物id和sig
        cartId: this.checkoutData.cart.id,
        sig: this.checkoutData.sig
      })
      this.initAddress()
      this.showLoading = false
    },
    // 初始化的时候,获取地址信息，第一个地址为默认选项
    async initAddress () {
      if (this.userInfo && this.userInfo.user_id) {
        const addressRes = await getAddressList (this.userInfo.user_id) // 从数据库获取地址
        if (addressRes instanceof Array && addressRes.length) {
          this.CHOOSE_ADDRESS({ // 将数据库地址列表的第一个值设为默认地址
            address: addressRes[0],
            index: 0
          })
        }
      }
    },
    // 地址备注颜色
    iconColor (name) {
      switch (name) {
        case '公司' : return '#4cd964'
        case '学校' : return '#3190e8'
      }
    },
    // 确认下单
    async confirmOrder () {
      // 用户未登录时弹出提示框
      if (!(this.userInfo && this.userInfo.user_id)) {
        this.showAlert = true
        this.alertText = '请登录'
        return
        // 未选择地址则提示
      } else if (!this.choosedAddress) {
        this.showAlert = true
        this.alertText = "请添加一个收货地址"
        return
      }
      // 保存订单
      this.SAVE_ORDER_PARAM({ // 把订单信息存入vuex
        userId: this.userInfo.user_id,
        cartId: this.checkoutData.cart.id,
        addressId: this.choosedAddress.id,
        description: this.remarklist,
        entities: this.checkoutData.cart.groups,
        geohash: this.geohash,
        sig: this.checkoutData.sig
      })
      // 把订单数据存到数据库
      let orderRes = await placeOrders(this.userInfo.user_id, this.checkoutData.cart.id, this.choosedAddress.id, this.remarklist, this.checkoutData.cart.groups, this.geohash, this.checkoutData.sig)
      // 第一次下单的手机号需要验证，否则直接下单成功
      if (orderRes.need_validation) {
        this.NEED_VALIDATION(orderRes) // 在vuex里面存入验证信息
        this.$router.push('/confirmOrder/userValidation')
      } else {
        this.ORDER_SUCCESS(orderRes) // 把订单信息存入数据库的结果存入vuex
        this.$router.push('/confirmOrder/payment')
      }
    },
    showPayWayFun () {
      this.showPayWay = !this.showPayWay
    },
    choosePayWay (is_online_payment, id) {
      console.log(is_online_payment)
      if (is_online_payment) {
        this.showPayWay = !this.showPayWay
        this.payWayId = id
      }
    }
  },
  watch: {
    userInfo (value) {
      if (value && value.user_id) {
        this.initAddress()
      }
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.confirmOrderContainer
  padding-top:90px
  padding-bottom:130px
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .address_container
    min-height:180px
    fj()
    align-items:center
    padding: 0 20px
    background: url('../../../images/address_bottom.png') left bottom repeat-x
    background-color: #fff
    background-size: auto 8px
    .address_empty_left
      display: flex
      align-items: center
      .location_icon
        wh(36px, 40px)
        fill: $blue
        margin-right: 20px
      .add_address
        sc(30px, #333)
      .address_detail_container
        margin-left:20px
        header
          sc(30px, #333)
          span:nth-of-type(1)
            font-size:38px
            font-weight:bold
        .address_detail
          width:100%
          display:flex
          align-items:center
          span
            sc(20px, #fff)
            border-radius:6px
            background-color:#ff5722
            height:30px
            line-height:30px
            padding:0 10px
            margin-right:20px
          p
            sc(20px, #777)
    .address_empty_right
      wh(30px, 30px)
      fill:#999
  .delivery_model
    border-left:6px solid $blue
    min-height:200px
    fj()
    align-items:center
    .delivery_text
      sc(40px, #333)
      font-weight:bold
      padding-left:20px
    .delivery_time
      display:flex
      flex-direction:column
      align-items:flex-end
      p:nth-of-type(1)
        sc(36px, $blue)
      p:nth-of-type(2)
        sc(20px, #fff)
        background-color:$blue
        width:120px
        margin-top:20px
        text-align:center
        border-radius:5px
        padding:5px
  .pay_way
    .header_style
      fj()
      line-height:60px
      span:nth-of-type(1)
        sc(34px, #666)
      .more_type
        span:nth-of-type(1)
          sc(28px, #aaa)
          width:200px
          display:inline-block
          text-align:right
        svg
          wh(24px, 24px)
          fill:#ccc
    .hongbo
      fj()
      border-top:1px solid #f5f5f5
      span
        sc(24px, #aaa)
        line-height:60px
        svg
          wh(30px, 30px)
          vartical-align: middle
          fill:#ccc
    .support_is_available
      span
        color:#666
  .confrim_order
    display: flex
    position: fixed
    bottom: 0
    width:100%
    height: 100px
    p
      line-height:80px
      sc(34px, #fff)
    p:nth-of-type(1)
      background-color:#3c3c3c
      flex: 5
      padding-left:20px
    p:nth-of-type(2)
      flex:2
      background-color:#56d176
      text-align:center
  .food_list
    background-color:#fff
    margin-top:20px
    header
      padding:20px
      border-bottom:2px solid #f5f5f5
      img
        wh(60px, 60px)
        vertical-align:middle
      span
        sc(30px, #333)
    .food_list_ul
      padding-top: 20px
      .food_item_style
        fj()
        line-height:60px
        padding:0 20px
        span, p
          sc(30px, #666)
        .food_name
          width:560px
        .num_price
          flex:1
          fj()
          align-items:center
          span:nth-of-type(1)
            color:#f60
    .food_item_style
        fj()
        line-height:60px
        padding:0 20px
        span, p
          sc(30px, #666)
        .food_name
          width:560px
        .num_price
          flex:1
          fj()
          align-items:center
          span:nth-of-type(1)
            color:#f60
    .total_price
      border-top:1px solid #f5f5f5
  .container_style
    background-color:#fff
    margin-top:20px
    padding:0 20px
  .cover
    position: fixed
    top:0
    bottom:0
    left:0
    right:0
    background-color:rgba(0,0,0,.3)
    z-index: 203
  .choose_type_container
    min-height:500px
    background-color:#fff
    position: fixed
    bottom:0
    width:100%
    z-index:204
    header
      background-color:#fafafa
      sc(36px, #333)
      text-align:center
      line-height: 80px
    ul
      li
        fj()
        padding:0 20px
        line-height:80px
        align-items:center
        span
          sc(30px, #ccc)
        svg
          wh(40px, 40px)
          fill: #eee
      .choose
        span
          color:#333
        svg
          fill:#4cd964
.fade-enter-active, .fade-leave-active
  transition: opacity .3s
.fade-enter, .fade-leave-active
  opacity: 0
.slid_up-enter-active, .slid_up-leave-active
  transition: all .3s
.slid_up-enter, .slid_up-leave-active
  transform: translate3d(0, 100px, 0)
.router-slid-enter-active, .router-slid-leave-active
  transition: all .4s
.router-slid-enter, .router-slid-leave-active
  transform: translate3d(100px, 0, 0)
  opacity: 0
</style>
