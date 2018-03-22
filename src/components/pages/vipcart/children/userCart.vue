<template>
  <div class="page_container">
    <header-top head-title="兑换会员" :goBack="goBack"></header-top>
    <p class="buy_for">成功兑换后将关联到当前帐号： <span>{{userInfo.username}}</span></p>
    <form class="form_style">
      <input type="text" name="cartNumber" maxlength="10" v-model="cartNumber" placeholder="请输入10位卡号">
      <input type="text" name="passWord" maxlength="6" v-model="passWord" placeholder="请输入6位卡密">
    </form>
    <p class="determine" :class="{could_pay: couldPay}" @click="confirmPay">兑换</p>
    <footer class="binding">
      <h3>--温馨提示--</h3>
      <p>新兑换的会员服务，权益以「会员说明」为准。</p>
      <p>月卡：<b>30次</b>减免配送费。</p>
      <p>季卡：<b>90次</b>减免配送费。</p>
      <p>年卡：<b>360</b>次减免配送费。</p>
      <p>＊仅限蜂鸟专送订单，每日最多减免3单，每单最高减免4元（一个月按31天计算）</p>
    </footer>
    <alert-tip v-if="showAlert" @closeTip="showAlert=false" :alertText="alertText"></alert-tip>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import alertTip from 'components/base/alertTip/alertTip'
import {vipCart} from 'service/getData'
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      goBack: true,
      showAlert: false,
      alertText: '',
      cartNumber: null,
      passWord: null
    }
  },
  components: {
    headerTop,
    alertTip
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    couldPay () {
      return (/^\d{10}$/.test(this.cartNumber)) && (/^\d{6}$/.test(this.passWord))
    }
  },
  methods: {
    async confirmPay () {
      if (this.couldPay) {
        let res = await vipCart(this.userInfo.id, this.cartNumber, this.passWord) // 将卡信息在数据库中操作
        if (res.message) {
          this.showAlert = true
          this.alertText = res.message
        } else if (res.name) {
          this.showAlert = true
          this.alertText = res.name
        }
      }
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.page_container
  position: fixed
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: #f5f5f5
  z-index: 202
  padding-top: 100px
  overflow-y: auto
  color: #999
  font-size: 30px
  padding-top: 100px
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .buy_for
    sc(30px, #666)
    line-height:80px
    padding-left:20px
    span
      font-weight: bold
  .form_style
    display: flex
    flex-direction: column
    input
      border-bottom:1px solid #f5f5f5
      height:100px
      sc(30px, #999)
      padding-left:30px
  .determine
    background-color:#ccc
    sc(30px, #fff)
    text-align:center
    margin:0 30px
    line-height:80px
    border-radius:10px
    margin-top:20px
    font-weight:bold
  .could_pay
    background-color: #4cd964
  .binding
    margin-top:30px
    h3
      text-align:center
      font-weight:normal
      sc(30px, #aaa)
      margin-bottom:20px
    p, b
      sc(24px, #aaa)
      line-height:50px
    p
      padding:0 30px
</style>
