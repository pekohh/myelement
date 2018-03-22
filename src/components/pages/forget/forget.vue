<template>
  <div class="restContainer">
    <header-top head-title="重置密码" :goBack='goBack'></header-top>
    <form class="restForm">
      <section class="input_container phone_number">
        <input type="text" placeholder="帐号" name="phone" maxlength="11" v-model="phoneNumber">
      </section>
      <section class="input_container">
        <input type="text" placeholder="旧密码" name="oldPassWord" v-model="oldPassWord">
      </section>
      <section class="input_container">
        <input type="text" placeholder="请输入密码" name="newPassWord" v-model="newPassWord">
      </section>
      <section class="input_container">
        <input type="text" placeholder="请确认密码" name="confirmPassWord" v-model="confirmPassWord">
      </section>
      <section class="input_container captcha_code_container">
        <input type="text" placeholder="验证码"  name="mobileCode" maxlength="6" v-model="mobileCode">
        <div class="img_change_img">
          <img v-show="captchaCodeImg" :src="captchaCodeImg">
          <div class="change_img" @click="getCaptchaCode">
            <p>看不清</p>
            <p>换一张</p>
          </div>
        </div>
      </section>
    </form>
    <div class="login_container" @click="resetButton">确认修改</div>
    <alert-tip :showHide="showAlert" v-if="showAlert" :alertText="alertText" @closeTip="closeTip"></alert-tip>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import alertTip from 'components/base/alertTip/alertTip'
import {getcaptchas, changePassword} from 'service/getData'
export default {
  data () {
    return {
      goBack: true,
      phoneNumber: null,
      oldPassWord: null,
      newPassWord: null,
      captchaCodeImg: null, // 验证码地址
      showAlert: false,
      confirmPassWord: null,
      mobileCode: null
    }
  },
  components: {
    headerTop,
    alertTip
  },
  created () {
    this.getCaptchaCode()
  },
  methods: {
    async getCaptchaCode () {
      let res = await getcaptchas() // 获取图片验证码
      this.captchaCodeImg = res.code
    },
    async resetButton () {
      if (!this.phoneNumber) {
        this.showAlert = true
        this.alertText = '请输入正确的帐号'
        return
      } else if (!this.oldPassWord) {
        this.showAlert = true
        this.alertText = '请输入旧密码'
        return
      } else if (!this.newPassWord) {
        this.showAlert = true
        this.alertText = '请输入新密码'
        return
      } else if (!this.confirmPassWord) {
        this.showAlert = true
        this.alertText = '请输入确认密码'
        return
      } else if (this.newPassWord !== this.confirmPassWord) {
        this.showAlert = true
        this.alertText = '两次输入密码不一致'
        return
      } else if (!this.mobileCode) {
        this.showAlert = true
        this.alertText = '请输入验证码'
        return
      }
      // 发送重置信息
      let res = await changePassword(this.phoneNumber, this.oldPassWord, this.newPassWord, this.confirmPassWord, this.mobileCode)
      if (res.message) {
        this.showAlert = true
        this.aletText = res.message
        this.getCaptchaCode()
      } else {
        this.showAlert = true
        this.alertText = '密码修改成功'
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
.restContainer
  paddint-top:100px
  .restForm
    background-color:#fff
    margin-top:120px
    .input_container
      display: flex
      justify-content: space-between
      padding:30px 40px
      border-bottom: 1px solid #f1f1f1
      input
        sc(32px, #666)
      botton
        sc(20px, #fff)
        font-family: Helvetica Neue,Tahoma,Arial
        padding:20px 30px
        border:1px
        border-radius: 6px
    .captcha_code_container
      height:110px
      .img_change_img
        display: flex
        align-items:center
        img
          wh(180px, 80px)
          margin-right:20px
        .change_img
          display:flex
          flex-direction: column
          flex-wrap: wrap
          width: 90px
          justify-content: center
          p
            sc(20px, #666)
          p:nth-of-type(2)
            color:#3b95e9
            margin-top:10px
  .login_container
    margin:20px 10px
    sc(30px, #fff)
    background-color:#4cd964
    padding:20px 0
    border:1px
    border-radius:6px
    text-align: center
</style>
