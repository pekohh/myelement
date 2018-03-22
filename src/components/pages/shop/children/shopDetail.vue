<template>
  <div class="rating_page">
    <head-top head-title='商家详情' :go-back='goBack'></head-top>
    <!--活动信息-->
    <section class="activities_container">
      <header>活动与属性</header>
      <ul class="actibities_ul">
        <li v-for="item in shopDetail.activities" :key="item.id">
          <span :style='{backgroundColor: "#" + item.icon_color}'>{{item.icon_name}}</span>
          <span>{{item.description}}(APP专享)</span>
        </li>
      </ul>
      <ul class="actibities_ul">
        <li v-for="item in shopDetail.supports" :key='item.id'>
          <span :style="{backgroundColor:'#'+item.icon_color}">{{item.icon_name}}</span>
          <span>{{item.description}}(APP专享)</span>
        </li>
      </ul>
    </section>
    <!--安全信息-->
    <section class="shop_status_container">
      <router-link to="/shop/shopDetail/shopSafe" class="shop_status_header">
        <span class="shop_detail_title">食品监督安全公示</span>
        <div>
          <span class="identification_detail">企业认证详情</span>
          <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description_arrow" >
            <path d="M0 0 L8 7 L0 14"  stroke="#bbb" stroke-width="1.5" fill="none"/>
          </svg>
        </div>
      </router-link>
      <section class="shop_statu_detail">
        <div>
          <svg class="shop_status" v-if="shopDetail.status == 1">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#res-well"></use>
          </svg>
          <svg class="res-well" v-else>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#res-bad"></use>
          </svg>
        </div>
        <div class="check_date">
          <p>
            <span>监督检查结果:</span>
            <span class="shop_status_well" v-if="shopDetail.status == 1">良好</span>
            <span class="shop_status_bad" v-else>差</span>
          </p>
          <p>
            <span>检查日期:</span>
            <span>{{shopDetail.identification.identificate_date && shopDetail.identification.identificate_date.split('T')[0]}}</span>
          </p>
        </div>
      </section>
    </section>
    <!--商家信息-->
    <section class="shop_status_info">
      <header>商家信息</header>
      <p>{{shopDetail.name}}</p>
      <p>地址:{{shopDetail.address}}</p>
      <p>营业时间: [{{shopDetail.opening_hours[0]}}]</p>
      <p @click="showLicenseImg(shopDetail.license.business_license_image)">
        <span>营业执照</span>
        <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description_arrow">
          <path d="M0 0 L8 7 L0 14"  stroke="#bbb" stroke-width="1.5" fill="none"/>
        </svg>
      </P>
      <p @click="showLicenseImg(shopDetail.license.catering_service_license_image)">
        <span>餐饮服务许可证</span>
        <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description_arrow" >
          <path d="M0 0 L8 7 L0 14"  stroke="#bbb" stroke-width="1.5" fill="none"/>
        </svg>
      </p>
    </section>
    <transition name="fade">
      <section class="license_container" v-if="showlicenseImg" @click="showlicenseImg = false">
        <img :src="imgBaseUrl + licenseImg">
      </section>
    </transition>
    <transition name='router-slid'>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headTop from 'components/base/header/header'
import {imgBaseUrl} from 'config/env'
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      goBack: true,
      showlicenseImg: false,
      imgBaseUrl
    }
  },
  components: {
    headTop
  },
  created () {
    console.log(this.shopDetail)
  },
  computed: {
    ...mapGetters([
      'shopDetail'
    ])
  },
  methods: {
    showLicenseImg (img) {
      this.licenseImg = img
      this.showlicenseImg = true
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.rating_page
  position: absolute
  top:0
  right:0
  left:0
  bottom:0
  padding-top:10px
  background-color:#ebebeb
  z-index:18
  .activities_container
    background-color:#fff
    margin-top:100px
    margin-bottom:20px
    padding-bottom:30px
    header
      sc(30px, #333)
      line-height:80px
      padding-left:20px
      border-bottom:1px solid #f1f1f1
      margin-bottom:20px
    .actibities_ul
      padding:0 20px
      li
        margin-bottom:30px
        span:nth-of-type(1)
          sc(24px, #fff)
          padding: 5px
          border:1px
          border-radius:6px
          margin-right:20px
        span:nth-of-type(2)
          sc(26px, #666)
  .shop_status_container
    background-color:#fff
    margin-bottom:20px
    .shop_status_header
      display: flex
      justify-content: space-between
      align-items:center
      line-height:60px
      padding:0 20px
      border-bottom:1px solid #f1f1f1
      .shop_detail_title
        sc(30px, #333)
        line-height:90px
      .identification_detail
        sc(30px, #bbb)
        vertical-align: middle
        margin-right:20px
      svg
        vertical-align:middle
        wh(30px, 30px)
    .shop_statu_detail
      display: flex
      padding: 30px
      svg
        wh(100px, 100px)
        margin-right:30px
      .check_date
        line-height:80px
        span
          sc(26px, #666)
          margin-right:10px
        .shop_status_well
          color: rgb(126, 211, 33)
        .shop_status_bad
          color: red
  .shop_status_info
    background-color:#fff
    margin-bottom: 20px
    header
      line-height:90px
      padding: 0 20px
      sc(30px, #333)
      border-bottom:1px solid #f1f1f1
    p
      sc(28px, #666)
      padding:20px 20px 20px 0
      border-bottom:1px solid #f5f5f5
      margin-left:20px
      line-height:60px
    span
      color:#666
  .license_container
    position: fixed
    top:0
    left:0
    right:0
    bottom:0
    background-color:rgba(0,0,0,0.5)
    z-index: 101
    img
      width: 100%
      center()
  .fade-enter-active, .fade-leave-active
    transition: opacity .5s
  .fade-enter, .fade-leave-active
    opacity: 0
  .router-slid-enter-active, .router-slid-leave-active
    transition: all .4s
  .router-slid-enter, .router-slid-leave-active
    transform: translate3d(100px, 0, 0)
    opacity: 0
</style>
