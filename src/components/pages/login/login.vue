<template>
  <div class="loginContainer">
    <header-top :head-title="loginWay? '登录':'密码登录'" :goBack='goBack'></header-top>
    <!--短信登录-->
    <form class="loginForm" v-if="loginWay">
      <section class="input_container phone_number">
        <input type="text" placeholder='账号密码随便输入' name="phone" maxlength = '11' v-model="phoneNumber">
        <button @click.prevent='getVerifyCode'>获取验证码</button>
        <button>已发送({computedTime}s)</button>
      </section>
      <section class="input_container">
        <input type="text" placeholder='验证码' name="mobileCode" maxlength='6' v-mode='mobileCode'>
      </section>
    </form>
    <!--账号密码登录-->
    <form class="loginForm" v-else>
      <section class="input_container">
        <input type="text" placeholder="帐号" v-model.lazy='userAccount'>
      </section>
      <section class="input_container">
        <input type="password" v-if="!showPassword" placeholder="密码" v-model="passWord">
        <input type="text" v-else placeholder="密码" v-model="passWord">
        <div class="button_switch" :class="{change_to_text:showPassword}">
          <div class="circle_button" :class="{trans_to_right:showPassword}" @click="changePassWordType"></div>
          <span>abc</span>
          <span>...</span>
        </div>
      </section>
      <section class="input_container captcha_code_container">
        <input type="text" placeholder="验证码" maxlength="4" v-model="codeNumber">
        <div class="img_change_img">
          <img v-show="captchaCodeImg" :src="captchaCodeImg">
          <div class="change_img" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>
    <p class="login_tips">
      温馨提示：未注册过的账号，登录时将自动注册
    </p>
    <p class="login_tips">
      注册过的用户可凭账号密码登录
    </p>
    <div class="login_container" @click="mobileLogin">登录</div>
    <router-link to="/forget" class="to_forget" v-if="!loginWay">重置密码？</router-link>
    <alert-tip v-if="showAlert" :showHide='showAlert' @closeTip='closeTip' :alertText="alertText"></alert-tip>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import alertTip from 'components/base/alertTip/alertTip'
import {getcaptchas, accountLogin} from 'service/getData'
import {mapMutations} from 'vuex'

export default {
  data () {
    return {
      goBack: true,
      showPassword: false, // 是否显示密码
      loginWay: false, // 登录方式（默认用户名密码登录）
      passWord: null,
      phoneNumber: null, // 电话号码
      userAccount: null, // 用户名
      codeNumber: null, // 验证码
      captchaCodeImg: null, // 验证码地址
      showAlert: false, // 是否显示弹出框
      alertText: null // 提示的内容
    }
  },
  components: {
    headerTop,
    alertTip
  },
  created () {
    // 初始化内容
    this.getCaptchaCode()
  },
  methods: {
    ...mapMutations([
      'RECORD_USERINFO'
    ]),
    // 是否显示密码
    changePassWordType () {
      this.showPassword = !this.showPassword
    },
    // 获取验证码，线上环境使用固定的图片，生产环境使用真实的验证码
    async getCaptchaCode () {
      let res = await getcaptchas()
      this.captchaCodeImg = res.code
    },
    // 获取短信验证码
    async getVerifyCode () {
    },
    // 登录
    async mobileLogin () {
      if (this.loginWay) { // 短信登录
        if (!this.rightPhoneNumber) {
          this.showAlert = true
          this.alertText = '手机号不正确'
          return
        } else if (!(/^\d{6}$/gi.test(this.mobileCode))) {
          this.showAlert = true
          this.alertText = '短信验证码不正确'
          return
        }
        // this.userInfo = await sendLogin (this.mobileCode, this.phoneNumber, this.validate_token)
      } else { // 账号密码登录
        if (!this.userAccount) {
          this.showAlert = true
          this.alertText = '请输入手机号/邮箱/用户名'
          return
        } else if (!this.passWord) {
          this.showAlert = true
          this.alertText = '请输入密码'
          return
        } else if (!this.codeNumber) {
          this.showAlert = true
          this.alertText = '请输入验证码'
          return
        }
        this.userInfo = await accountLogin(this.userAccount, this.passWord, this.codeNumber) // 把用户信息记录到服务器
      }
      // 如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
      if (!this.userInfo.user_id) {
        this.showAlert = true
        this.alertText = this.userInfo.message
        if (!this.loginWay) this.getCaptchaCode() // 每变一次登录方式。重生一次验证码图片
      } else {
        this.RECORD_USERINFO(this.userInfo) // 把当前用户信息记录到vuex
        this.$router.go(-1) // 返回登录前页面
      }
    },
    closeTip () {
      this.showAlert = false
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.loginContainer
  padding-top: 100px
  p, span, input
    font-family: Helvetica Neue,Tahoma,Arial
  .loginForm
    background-color:#fff
    margin-top: 20px
    .input_container
      display: flex
      justify-content: space-between
      padding:30px 40px
      border-bottom: 1px solid #f1f1f1
      input
        sc(30px, #666)
      button
        sc(20px, #fff0)
        font-family:Helvetica Neue,Tahoma,Arial
        padding:20px 30px
        border:1px
        border-radius: 5px
      .button_switch
        background-color:#ccc
        display:flex
        justify-content:center
        wh(100px, 36px)
        padding:0 20px
        border:1px
        border-radius:5px
        position:relative
        .circle_button
          transition: all .3s
          position: absolute
          top:-14px
          z-index:1
          left:-10px
          wh(60px, 60px)
          box-shadow:0 5px 6px 0 rgba(0,0,0,0.1)
          background-color:#f1f1f1
          border-radius:50%
        .trans_to_right
          transform: translateX(80px)
        span
          sc(20px, #fff)
          transform: translateY(-2px)
          line-height:40px
        span:nth-of-type(2)
          transform: translateY(-2px)
      .change_to_text
        background-color: #4cd964
    .captcha_code_container
      height:110px
      .img_change_img
        display: flex
        align-items:center
        img
          wh(200px, 80px)
          margin-right:20px
        .change_img
          display: flex
          flex-direction: 'column'
          flex-wrap: wrap
          width: 84px
          justify-content:center
          p
            sc(2px, #666)
          p:nth-of-type(2)
            color:#3b95e9
            margin-top:10px
  .login_tips
    sc(26px, red)
    padding:5px 20px
    line-height:40px
    a
      color:#3b95e9
  .login_container
    margin:10px 20px 40px
    sc(30px, #fff)
    background-color:#4cd964
    padding:20px 0
    border:1px
    border-radius:4px
    text-align:center
  .to_forget
    float: right
    sc(26px, #3b95e9)
    margin-right:30px
</style>
