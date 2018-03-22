<template>
  <div class="profile_page">
    <header-top head-title="我的" :goBack="goBack"></header-top>
    <section>
      <section class="profile-number">
        <router-link :to='userInfo&&userInfo.user_id ? "/profile/info" : "/login"' class="profile-link">
          <img :src='imgBaseUrl + userInfo.avatar' class='privateImage' v-if='userInfo && userInfo.user_id'>
          <span class="privateImage" v-else>
            <svg class="privateImage-svg">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#avatar-default"></use>
            </svg>
          </span>
          <div class="user-info">
            <p>{{username}}</p>
            <p>
              <span class="user-icon">
                <svg class="icon-mobile" fill="#fff">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mobile"></use>
                </svg>
              </span>
              <span class="icon-mobile-number">{{mobile}}</span>
            </p>
          </div>
          <span class="arrow">
            <svg class="arrow-svg" fill="#fff">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </span>
        </router-link>
      </section>
      <!--用户数据-->
      <section class="info-data">
        <ul class="clear">
          <router-link to="/balance" tag="li" class="info-data-link">
             <span class="info-data-top"><b>{{parseInt(balance).toFixed(2)}}</b>元</span>
             <span class="info-data-bottom">我的余额</span>
          </router-link>
          <router-link to="/benefit" tag="li" class="info-data-link">
             <span class="info-data-top"><b>{{count}}</b>元</span>
             <span class="info-data-bottom">我的优惠</span>
          </router-link>
          <router-link to="/points" tag="li" class="info-data-link">
             <span class="info-data-top"><b>{{pointNumber}}</b>元</span>
             <span class="info-data-bottom">我的积分</span>
          </router-link>
        </ul>
      </section>
      <!--我的订单-->
      <section class="profile-1reTe">
        <router-link to='/order' class="myorder">
          <aside>
            <svg fill="#4aa5f0">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#order"></use>
            </svg>
          </aside>
          <div class="myorder-div">
            <span>我的订单</span>
            <span class="myorder-divsvg">
              <svg fill="#bbb">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </router-link>
        <a href='https://home.m.duiba.com.cn/#/chome/index' class="myorder">
          <aside>
            <svg>
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#point"></use>
            </svg>
          </aside>
          <div class="myorder-div">
            <span>积分商场</span>
            <span class="myorder-divsvg">
              <svg fill="#bbb">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </a>
        <router-link to='/vipcard' class="myorder">
          <aside>
            <svg fill="#ffc636">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#vip"></use>
            </svg>
          </aside>
          <div class="myorder-div">
           <span>饿了么会员卡</span>
           <span class="myorder-divsvg">
             <svg fill="#bbb">
               <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
             </svg>
           </span>
          </div>
        </router-link>
      </section>
      <!--服务中心-->
      <section class="profile-1reTe">
        <router-link to='/service' class="myorder">
          <aside>
            <svg fill="#4aa5f0">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#service"></use>
            </svg>
          </aside>
          <div class="myorder-div">
            <span>服务中心</span>
            <span class="myorder-divsvg">
              <svg fill="#bbb">
               <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </router-link>
        <router-link to='/download' class="myorder">
          <aside>
            <svg fill="#3cabff">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#download"></use>
            </svg>
          </aside>
          <div class="myorder-div" style="border-bottom:0">
            <span>下载饿了么APP</span>
            <span class="myorder-divsvg">
              <svg fill="#bbb">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
              </svg>
            </span>
          </div>
        </router-link>
      </section>
    </section>
    <foot-guide></foot-guide>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import footGuide from 'components/base/footer/footer'
import {imgBaseUrl} from 'config/env'
import {mapGetters, mapMutations} from 'vuex'

export default {
  data () {
    return {
      goBack: true,
      profiletitle: '我的',
      username: '登录/注册',
      resetname: '',
      mobile: '暂无绑定手机号',
      balance: 0,
      count: 0,
      pointNumber: 0,
      avatar: '',
      imgBaseUrl
    }
  },
  components: {
    headerTop,
    footGuide
  },
  mounted () {
    // 初始化
    this.initData()
  },
  created () {
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    // 后台会返回两种头像地址格式，分别处理
    imgPath () {
      let path
      if (this.avatar.indexOf('/') !== -1) {
        path = imgBaseUrl + this.avatar
      } else {
        path = this.getImgPath(this.avatar)
      }
      this.SAVE_AVANDER(path)
      return path
    }
  },
  methods: {
    ...mapMutations([
      'SAVE_AVANDER'
    ]),
    initData () {
      if (this.userInfo && this.userInfo.user_id) {
        this.avatar = this.userInfo.avatar
        this.username = this.userInfo.username
        this.mobile = this.userInfo.mobile || '暂无绑定手机号'
        this.balance = this.userInfo.balance
        this.count = this.userInfo.gift_amount
        this.pointNumber = this.userInfo.point
      } else {
        this.username = '登录/注册'
        this.mobile = '暂无绑定手机号'
      }
    }
  },
  watch: {
    userInfo (value) {
      this.initData()
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.profile_page
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .profile-number
    padding-top: 90px
    .profile-link
      display: block
      display: flex
      box-align:center
      align-items:center
      background:$blue
      padding: 20px 30px
      .privateImage
        display: inline-block
        wh(130px, 130px)
        border-radius: 50%
        vertical-align: middle
        .privateImage-svg
          background:$fc
          border-radius: 50%
          wh(120px, 120px)
      .user-info
        margin-left: 20px
        flex-grow: 1
        p
          font-weight: 700
          sc(38px, $fc)
          .user-icon
            wh(24px, 40px)
            display: inline-block
            vertical-align: middle
            line-height: 60px
            .icon-mobile
              wh(100%, 100%)
          .icon-mobile-number
            display:inline-block
            sc(24px, $fc)
            line-height:48px
      .arrow
        wh(20px, 40px)
        display: inline-block
        svg
          wh(100%, 100%)
  .info-data
    width:100%
    background:$fc
    box-sizing: border-box
    ul
      .info-data-link
        float:left
        width:33.33%
        display: inline-block
        border-right: 1px solid #f1f1f1
        span
          display: block
          width: 100%
          text-align:center
        .info-data-top
          sc(30px, #333)
          padding:30px 0 20px
          b
            display: inline-block
            sc(50px, #f90)
            font-weight: 700
            line-height:40px
            font-family: Helvetica Neue,Tahoma
        .info-data-bottom
          sc(26px, #666)
          font-weight: 400
          padding-bottom: 30px
  .profile-1reTe
    margin-top:20px
    background:$fc
    .myorder
      padding-left: 30px
      display: flex
      align-items: center
      aside
        wh(35px, 35px)
        margin-left: -10px
        margin-right:20px
        display: flex
        align-items: center
        svg
          wh(100%, 100%)
      .myorder-div
        width:100%
        border-bottom:1px solid #f1f1f1
        padding: 20px 20px 20px 0
        sc(30px, #333)
        display: flex
        justify-content: space-between
        span
          display: block
        .myorder-divsvg
          wh(30px, 30px)
          svg
            wh(100%, 100%)
  .router-slid-enter-active, .router-slid-leave-active
    transition: all .5s
  .router-slid-enter, .router-slid-leave-active
    transform: translate3d(100px, 0, 0)
    opacity: 0
</style>
