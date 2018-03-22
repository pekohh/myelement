<template>
  <div class="page_container">
    <header-top head-title="购买记录" :goBack="goBack"></header-top>
    <section class="invoice_container">
      <img src='src/images/no-log.png'>
      <p>没有购买记录</p>
    </section>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
export default {
  data () {
    return {
      goBack: true
    }
  },
  components: {
    headerTop
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
  background-color: #fff
  z-index: 202
  padding-top: 100px
  overflow-y: auto
  color: #999
  font-size: 30px
  padding: 30px 20px 0
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .invoice_container
    display: flex
    flex-direction: column
    align-items:center
    img
      wh(200px, 100px)
      margin-top:400px
    p
      sc(30px, #999)
      margin-top:30px
</style>
