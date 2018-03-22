<template>
  <div class="download_page">
    <header-top head-title="下载" :goBack="goBack"></header-top>
    <section class="download_container">
      <img src="src/images/elmlogo.jpeg" class="logo_img">
      <p>下载饿了么APP</p>
      <div class="determine" @click="download">下载</div>
    </section>
    <alert-tip v-if="showAlert" :alertText="alertText" @closeTip="showAlert=false"></alert-tip>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import alertTip from 'components/base/alertTip/alertTip'
export default {
  data () {
    return {
      goBack: true,
      system: null,
      showAlert: false,
      alertText: null
    }
  },
  components: {
    headerTop,
    alertTip
  },
  created () {
    // 判断系统
    let u = navigator.userAgent
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
    let isIos = !!u.match(/\(i[^;]+;(U;)? CPU.+Mac OS X/) // ios终端
    if (isAndroid) {
      this.system = 'Android'
    } else if (isIos) {
      this.system = 'IOS'
    } else {
      this.system = 'pc'
    }
  },
  methods: {
    download () {
      // 如果是ios用户则提示，否则直接下载
      if (this.system === 'IOS') {
        this.showAlert = true
        this.alertText = 'IOS用户请前往AppStore下载'
      } else {
        try {
          let elemIF = document.createElement('iframe')
          elemIF.src = 'http://cangdu.org/files/elm.apk'
          elemIF.style.display = 'none'
          document.body.appendChild(elemIF)
        } catch (e) {
          alert('下载失败')
        }
      }
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.download_page
  position: absolute
  top: 0
  left: 0
  right: 0
  bottom: 0
  background-color: #fff
  z-index: 202
  padding-top: 100px
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .download_container
    text-align: center
    .logo_img
      border-radius: 2px
      margin-top:20px
    p
      sc(20px, #666)
      margin-bottom:20px
    .determine
      background-color:#4cd964
      sc(20px, #fff)
      text-align:center
      margin:0 20px
      line-height:60px
      border-radius: 10px
      margin-top:50px
</style>
