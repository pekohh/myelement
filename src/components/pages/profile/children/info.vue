<template>
  <div class="rating_page">
    <header-top head-title="帐户信息" :goBack='goBack'></header-top>
    <section class="profile-info">
      <section class="headportrait">
       <input type="file" class="profileinfopanel-upload" @change="uploadAvatar">
       <h2>头像</h2>
       <div class="headportrait-div">
         <img v-if="userInfo" :src="imgBaseUrl + userInfo.avatar" class="headportrait-div-top">
         <span class="headportrait-div-top" v-else>
           <svg>
             <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#avatar-default"></use>
           </svg>
         </span>
         <span class="headportrait-div-bottom">
           <svg fill="#d8d8d8">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
           </svg>
         </span>
       </div>
      </section>
      <router-link class="info-router" to='/profile/info/setusername'>
        <section class="headportrait headportraitwo">
          <h2>用户名</h2>
          <div class="headportrait-div">
            <p>{{username}}</p>
            <span class="headportrait-div-bottom">
              <svg fill="#d8d8d8">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </section>
      </router-link>
      <router-link class="info-router" to='/profile/info/address'>
        <section class="headportrait headportraitwo headportraithree">
          <h2>收货地址</h2>
          <div class="headportrait-div">
            <span class="headportrait-div-bottom">
              <svg fill="#d8d8d8">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </section>
      </router-link>
      <section class="bind-phone">
        账号绑定
      </section>
      <section class="info-router" @click="changePhone">
        <section class="headportrait headportraitwo headportraithree">
          <h2><img src="src/images/bindphone.png" style="display:inline-block;margin-right:.4rem;" alt="">手机</h2>
          <div class="headportrait-div">
           <p>{{infotel}}</p>
           <span class="headportrait-div-bottom">
             <svg fill="#d8d8d8">
               <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
             </svg>
           </span>
          </div>
        </section>
      </section>
      <!--修改密码-->
      <section class="bind-phone">
        安全设置
      </section>
      <router-link to='/forget' class="info-router">
        <section class="headportrait headportraitwo headportraithree">
          <h2>登录密码</h2>
          <div class="headportrait-div">
            <p>修改</p>
            <span class="headportrait-div-bottom">
              <svg fill="#d8d8d8">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </section>
      </router-link>
      <section class="exitlogin" @click="exitlogin">退出登录</section>
    </section>
    <!--带有提示框的退出登录-->
    <section class="coverpart" v-if="show">
      <section class="cover-background"></section>
      <section class="cover-content" :class="{'cover-animate': isEnter, 'cover-animate-leave': isLeave}">
        <div class="sa-icon">
          <span class="sa-body"></span>
          <span class="sa-dot"></span>
        </div>
        <h2>是否退出登录</h2>
        <div class="sa-botton">
          <button class="waiting" @click="waitingThing">再等等</button>
          <div style="display:inline-block">
            <button class="quitlogin" @click="outLogin">退出登录</button>
          </div>
        </div>
      </section>
    </section>
    <alert-tip v-if="showAlert" @closeTip="showAlert = false" :alertText='alertText'></alert-tip>
    <transition name="router-slid" mode='out-in'>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import alertTip from 'components/base/alertTip/alertTip'
import {signout} from 'service/getData'
import {mapGetters, mapMutations} from 'vuex'
import {imgBaseUrl} from 'config/env'
import {removeStore} from 'config/Util'

export default {
  data () {
    return {
      goBack: true,
      username: '', // 用户名
      resetname: '', // 重置用户名
      infotel: '', // 用户手机
      avatar: ' ', // 用户头像
      show: false, // 显示提示框
      isEnter: true, // 是否登录
      isLeave: false, // 是否退出
      showAlert: false,
      alertText: null,
      imgBaseUrl
    }
  },
  components: {
    headerTop,
    alertTip
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    ...mapMutations([
      'OUT_LOGIN'
    ]),
    // 上传头像
    async uploadAvatar () {
      if (this.userInfo) {
        let input = document.querySelector('.profileinfopanel-upload')
        let data = new FormData()
        data.append('file', input.files[0])
        try {
          let response = await fetch('/eus/v1/users/' + this.userInfo.user_id + '/avatar', {
            method: 'POST',
            credentials: 'include',
            body: data
          })
          let res = await response.json()
          if (res.status === 1) {
            this.userInfo.avatar = res.image_path
          }
        } catch (error) {
          this.showAlert = true
          this.alertText = '上传失败'
          throw new Error(error)
        }
      }
    },
    // 绑定手机
    changePhone () {
      this.showAlert = true
      this.alertText = '请在手机App中设置'
    },
    // 退出登录
    exitlogin () {
      this.show = true
      this.isEnter = true
      this.isLeave = false
    },
    // 再等再退出
    waitingThing () {
      clearTimeout(this.timer)
      this.isEnter = false
      this.isLeave = true
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.show = false
      }, 200)
    },
    // 退出登录
    async outLogin () {
      this.OUT_LOGIN() // vuex取消登录
      this.waitingThing()
      this.$router.go(-1)
      removeStore('user_id') // 删除storage信息
      await signout() // 数据库退出登录
    }
  },
  watch: {
    userInfo (value) {
      if (value && value.user_id) {
        this.username = value.username
        this.infotel = value.mobile
        this.avatar = value.avatar
      }
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.rating_page
  position: absolute
  top:0
  left:0
  right:0
  bottom:0
  background-color:#f2f2f2
  z-index:202
  padding-top:20px
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .profile-info
    wh(100%, 160px)
    margin-top:110px
    .headportrait
      padding:20px 20px
      fj(space-between)
      align-items:center
      border-top:1px solid #ddd
      background:#fff
      .profileinfopanel-upload
        display:block
        position: absolute
        opacity:0
        top:110px
        left:0
        wh(100%, 160px)
      h2
        sc(30px, #333)
        font-weight:500
        display:flex
        align-items: center
      .headportrait-div
        .headportrait-div-top
          wh(100px, 100px)
          border-radius:50%
          vertical-align:top
        .headportrait-div-bottom
          wh(34px, 72px)
          position: relative
          top:10px
        span
          display: inline-block
          svg
            wh(100%, 100%)
    .headportraitwo
      margin-top:0
      padding:20px 30px
      .headportrait-div
        fj(left)
        p
          text-align:left
          line-height:80px
          sc(30px, #999)
          margin-right:20px
          font-weight:100
          font-family: Arial
        .headportrait-div-bottom
          top:0
    .info-router
      display:block
    .bind-phone
      padding: 20px
      sc(20px, #666)
      .headportraithree
        border-bottom:1px solid #ddd
  .exitlogin
    width:96%
    margin:60px auto 0
    line-height: 80px
    border-radius: 10px
    text-align:center
    background:#d8584a
    sc(20px, #fff)
  .coverpart
    wh(100%, 100%)
    allcover()
    .cover-background
      wh(100%, 100%)
      background:#000
      z-index:100
      opacity: .2
      allcover()
    .cover-content
      width:94%
      background:$fc
      padding:34px
      position: absolute
      top:20%
      left:3%
      z-index:1000
      border-radius:6px
      .sa-icon
        wh(180px, 180px)
        border:4px solid #f8bb86
        border-radius: 50%
        margin:20px auto
        position: relative
        .sa-body
          wh(10px, 94px)
          border-radius:2px
          background: #f8bb86
          cl()
          top:10px
        .sa-dot
          wh(14px, 14px)
          border-radius:50%
          background:#f8bb86
          cl()
          bottom:10px
      h2
        width:100%
        text-align:center
        sc(54px, #575757)
        font-weight:500
        margin:50px 0
      .sa-botton
        width:100%
        text-align:center
        button
          display: inline-block
          padding:20px 60px
          border-radius:10px
          letter-spacing:1px
          margin-top:52px
          color:#fff
        .waiting
          background:#c1c1c1
          margin-right:20px
        .quitlogin
          background:rgb(221, 107, 85)
    .cover-animate
      transition: all 1s
      animation: bounceIn .6s
    .cover-animate-leave
      animation:zoomOut .4s
  .router-slid-enter-active, .router-slid-leave-active
    transition: all .5s
  .router-slid-enter, .router-slid-leave-active
    transform: translate3d(100px, 0, 0)
    opacity: 0
  @keyframes bounceIn
    from, 20%, 40%, 60%, 80%, 100%
      animation-timing-function:cubic-bezier(0.215, 0.610, 0.355, 1.000)
      animation-timing-function: cubic-bezier(0.215, 0.610, 0.355, 1.000)
    0%
      opacity:0
      transform: scale3d(.3, .3, .3)
    20%
      transform: scale3d(1.1, 1.1, 1.1)
    40%
      transform: scale3d(.9, .9, .9)
    60%
      opacity: 1
      transform: scale3d(1.03, 1.03, 1.03)
    80%
      transform: scale3d(.97, .97, .97)
    100%
      opacity: 1
      transform: scale3d(1, 1, 1)
  @keyframes zoomOut
    from
      opacity: 1
    50%
      opacity: 0
      transform: scale3d(.3, .3, .3)
    100%
      opacity: 0
</style>
