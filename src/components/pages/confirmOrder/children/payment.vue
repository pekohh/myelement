<template>
  <div class="rating_page">
    <header-top head-title="在线支付" :goBack="goBack"></header-top>
    <!--倒计时-->
    <section class="show_time_amount">
      <section>
        <header class="time_last">支付剩余时间</header>
        <p class="time">{{remaining}}</p>
        <footer class="order_detail" v-if="payDetail.resultData">
          <span>详情</span>
        </footer>
      </section>
    </section>
    <!--支付方式-->
    <div class="pay_way">选择支付方式</div>
    <section class="pay_way_list">
      <section class="pay_item">
        <div class="pay_icon_container">
          <div class="zhifubao"></div>
          <span>支付宝</span>
        </div>
        <svg class="choose_icon" @click="payWay = 1" :class="{choosed_way: payWay == 1}">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
        </svg>
      </section>
      <section class="pay_item">
        <div class="pay_icon_container">
          <svg>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#weixin"></use>
          </svg>
          <span>微信</span>
        </div>
        <svg class="choose_icon" @click="payWay = 2" :class="{choosed_way: payWay == 2}">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
        </svg>
      </section>
      <p class="determine" @click="confirmPay">确认支付</p>
      <alert-tip v-if="showAlert" @closeTip="closeTipFun" :alertText='alertText'></alert-tip>
    </section>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import alertTip from 'components/base/alertTip/alertTip'
import {payRequest} from 'service/getData'
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      goBack: true,
      countNum: 900, // 倒计时15分钟
      payDetail: false, // 付款信息详情
      showAlert: false,
      alertText: '',
      payWay: 1, // 付款方式
      gotoOrders: false // 去付款
    }
  },
  components: {
    headerTop,
    alertTip
  },
  computed: {
    ...mapGetters([
      'userInfo', 'orderMessage'
    ]),
    // 时间
    remaining () {
      let minute = parseInt(this.countNum / 60)
      if (minute < 10) {
        minute = '0' + minute
      }
      let second = parseInt(this.countNum % 60)
      if (second < 10) {
        second = '0' + second
      }
      return '00 : ' + minute + ' : ' + second
    }
  },
  created () {
    this.initData()
  },
  mounted () {
    this.remainingTime()
  },
  beforeDestroy () { // 在离开页面之前清除定时器
    clearInterval(this.timer)
  },
  methods: {
    // 初始化信息
    async initData () {
      this.payDetail = await payRequest(this.orderMessage.order_id, this.userInfo.user_id)
      console.log(this.payDetail)
      if (this.payDetail.message) {
        this.showAlert = true
        this.alertText = this.payDetail.message
      }
    },
    // 倒计时
    remainingTime () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.countNum--
        if (this.countNum === 0) {
          clearInterval(this.timer)
          this.showAlert = true
          this.alertText = '支付超时'
        }
      }, 1000)
    },
    // 确认付款
    confirmPay () {
      this.showAlert = true
      this.alertText = '当前环境无法支付，请打开官网APP进行付款'
      this.gotoOrders = true
    },
    // 关闭提示，跳到订单列表页
    closeTipFun () {
      this.showAlert = false
      if (this.gotoOrders) {
        this.$router.push('/order')
      }
    }
  },
  watch: {
    userInfo (value) {
      if (this.userInfo && this.userInfo.user_id) {
        // this.initData()
      }
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.rating_page
  position: fixed
  top:0
  left:0
  right:0
  bottom:0
  background-color:#f5f5f5
  z-index:204
  padding-top:20px
  p, span
    font-family:Helvetica Neue,Tahoma,Arial
  .show_time_amount
    background-color:#fff
    padding:100px
    text-align:center
    .time_last
      sc(30px, #666)
      margin-top:50px
    .time
      sc(60px, #333)
      margin:20px 0 10px
    .order_detail
      fj()
      span
        sc(20px, #666)
      span:nth-of-type(2)
        color:#ff6000
  .pay_way
    background-color:#f1f1f1
    padding:0 20px
    sc(20px, #6660)
    line-height:60px
  .pay_way_list
    background-color:#fff
    .pay_item
      padding:20px 30px
      fj()
      align-items:center
      line-height:80px
      border-bottom:1px solid #f5f5f5
      .pay_icon_container
        fj()
        align-items:center
        .zhifubao
          wh(100px, 100px)
          background: url('../../../../images/zhifubao.png') no-repeat
          background-size:100% 100%
          margin-right:20px
        svg
          wh(100px, 100px)
          margin-right:20px
      svg
        wh(50px, 50px)
        margin-right:20px
        fill:#ccc
      .choosed_way
        fill:#4cd964
      span
        sc(30px, #666)
  .determine
    background-color:#4cd964
    sc(32px, #fff)
    text-align:center
    margin:0 20px
    line-height:90px
    border-radius:6px
    margin-top:40px
    font-weight: bold
</style>
