<template>
  <div class="rating_page">
    <header-top head-title="选择发票抬头" :goBack="goBack"></header-top>
    <section class="choose_invoice">
      <span>不需要开发票</span>
      <svg @click="chooseInvoice" :class="{choosed: invoice}">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
      </svg>
    </section>
    <div class="determine" @click="confirmInvoice">确定</div>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import {mapMutations} from 'vuex'
export default {
  data () {
    return {
      goBack: true,
      invoice: false // 是否需要发票
    }
  },
  components: {
    headerTop
  },
  methods: {
    ...mapMutations([
      'CONFIRM_INVOICE'
    ]),
    // 是否选择开发票
    chooseInvoice () {
      this.invoice = !this.invoice
    },
    // 保存发票信息
    confirmInvoice () {
      this.CONFIRM_INVOICE(this.invoice)
      this.$router.go(-1)
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
  z-index: 202
  padding-top:100px
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .choose_invoice
    fj()
    align-items:center
    background-color:#fff
    line-height:80px
    margin-top:20px
    padding:0 40px
    span
      sc(30px, #333)
    svg
      wh(40px, 40px)
      fill:#999
    .choosed
      fill:#4cd964
  .determine
    background-color:#4cd964
    sc(30px, #fff)
    text-align:center
    margin:0 20px
    line-height:100px
    border-radius:6px
    margin-top:40px
</style>
