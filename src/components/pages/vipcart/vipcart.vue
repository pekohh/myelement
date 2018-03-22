<template>
  <div class="rating_page">
    <header-top head-title="会员中心" :goBack="goBack"></header-top>
    <section v-if="userInfo">
      <p class="buy_for">为帐户<span>{{userInfo.username}}</span>购买会员</p>
      <section class="vip_prerogative">
        <router-link class="header_style" to="/vipcard/vipDescription">
          <span class="header_left">会员特权</span>
          <span class="header_right">
            <span>会员说明</span>
            <svg fill="#ccc">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </span>
        </router-link>
        <section class="vip_detail">
          <div class="vip_detail_left">
            <img src="../../../images/sheng.jpeg" height="80" width="70">
          </div>
          <div class="vip_detail_right">
            <h4>减免配送费</h4>
            <p>每月减免30单，每日可减免3单，每单最高减4元</p>
            <p>蜂鸟专送专享</p>
          </div>
        </section>
        <section class="vip_detail">
          <div class="vip_detail_left">
            <img src="../../../images/jifen.jpeg" height="80" width="70">
          </div>
          <div class="vip_detail_right">
            <h4>减免配送费</h4>
            <p>每月减免30单，每日可减免3单，每单最高减4元</p>
            <p>蜂鸟专送专享</p>
          </div>
        </section>
      </section>
      <!--开通会员-->
      <section class="apply_vip">
        <header class="header_style">
          <span class="header_left">开通会员</span>
        </header>
        <section class="apply_vip_buy">
          <div class="apply_vip_buy_left">
            <span>1个月</span>
            <span>￥20</span>
          </div>
          <div class="apply_vip_buy_right">购买</div>
        </section>
      </section>
      <!--兑换会员-->
      <router-link to="/vipcard/userCard" class="header_style common_style">
        <span class="header_left">兑换会员</span>
        <section class="header_right">
          <span>使用卡号卡密</span>
          <svg fill="#ccc">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
          </svg>
        </section>
      </router-link>
      <!--购买记录-->
      <router-link to="/vipcard/invoiceRecord" class="header_style common_style">
        <span class="header_left">购买记录</span>
        <section class="header_right">
          <span>开发票</span>
          <svg fill="#ccc">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
          </svg>
        </section>
      </router-link>
    </section>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import {mapGetters} from 'vuex'
export default {
  data () {
    return {
      goBack: true
    }
  },
  components: {
    headerTop
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.rating_page
  padding-top:100px
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .buy_for
    sc(30px, #666)
    line-height:80px
    padding-left:30px
    span
      font-weight:bold
  .vip_prerogative
    background-color:#fff
    padding-left:30px
    margin-bottom:20px
    .header_style
      fj()
      background-color:#fff
      line-height:100px
      border-bottom:1px solid #f5f5f5
      padding-right:20px
      .header_left
        sc(30px, #333)
      .header_right
        display:flex
        align-items:center
        span
          sc(30px, #999)
          margin-right:20px
        svg
          wh(30px, 30px)
    .vip_detail
      display:flex
      border-bottom:1px solid #f5f5f5
      padding:30px 0
      .vip_detail_left
        margin-right:20px
        img
          wh(80px, 90px)
      .vip_detail_right
        h4
          sc(30px, #333)
          font-weight:normal
        p
          sc(26px, #999)
  .apply_vip
    background-color:#fff
    padding-left:20px
    margin-bottom:20px
    .header_style
      fj()
      background-color: #fff
      line-height: 100px
      border-bottom: 1px solid #f5f5f5
      padding-right: 20px
      .header_left
        sc(30px, #333)
    .apply_vip_buy
      fj()
      align-items:center
      padding-right:20px
      font-size:30px
      line-height:130px
      .apply_vip_buy_left
        span:nth-of-type(2)
          font-weight:bold
          color:#f60
      .apply_vip_buy_right
        border:1px solid #f60
        border-radius: 6px
        line-height:62px
        height:62px
        width:134px
        text-align:center
        sc(30px, #f60)
  .header_style
    fj()
    background-color: #fff
    line-height: 100px
    border-bottom: 1px solid #f5f5f5
    padding-right: 20px
    .header_left
      sc(30px, #333)
    .header_right
      display: flex
      align-items:center
      span
        sc(26px, #999)
        margin-right:20px
      svg
        wh(50px, 50px)
  .common_style
    padding:0 20px
    margin-bottom:30px
  .router-slid-enter-active, .router-slid-leave-active
    transition: all .4s
  .router-slid-enter, .router-slid-leave-active
    transform: translate3d(200px, 0, 0)
    opacity: 0
</style>
