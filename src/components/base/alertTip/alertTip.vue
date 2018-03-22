<template>
  <div class="alert_container">
    <section class="tip_text_container">
      <div class="tip_icon">
        <span></span>
        <span></span>
      </div>
      <p class="tip_text">{{alertText}}</p>
      <div class="confirm" @click="closeTip">确认</div>
    </section>
  </div>
</template>

<script>
export default {
  data () {
    return {
      positionY: 0,
      timer: null
    }
  },
  props: {
    alertText: {
      type: String,
      default: ''
    }
  },
  methods: {
    closeTip () {
      this.$emit('closeTip')
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
@keyframes tipMove
  0%
    transform: scale(1)
  35%
    transform: scale(.8)
  70%
    transform: scale(1.1)
  100%
    transform: scale(1)
.alert_container
  position: fixed
  top:0
  left:0
  right:0
  bottom:0
  z-index: 200
  .tip_text_container
    position: absolute
    top:30%
    left:50%
    margin-top:-200px
    margin-left:-300px
    width:600px
    animation: tipMove .4s
    background-color:rgba(255,255,255,1)
    border:1px
    padding-top:20px
    display: flex
    justify-content: center
    align-items:center
    flex-direction: column
    border-radius: 6px
    .tip_icon
      wh(150px, 150px)
      border: 0.15rem solid #f8cb86
      border-radius: 50%
      display: flex
      justify-content: center
      align-items: center
      flex-direction: column
      span:nth-of-type(1)
        wh(.12rem, 1.5rem)
        background-color: #f8cb86
      span:nth-of-type(2)
        wh(.2rem, .2rem)
        border: 1px
        border-radius: 50%
        margin-top: .2rem
        background-color: #f8cb86
    .tip_text
      sc(30px, #333)
      line-height: 80px
      text-align: center
      margin-top: 20px
      padding: 0 20px
    .confirm
      sc(40px, #fff)
      font-weight: bold
      margin-top: 50px
      background-color: #4cd964
      width: 100%
      text-align: center
      line-height: 80px
      border: 1px
      border-bottom-left-radius: 6px
      border-bottom-right-radius: 6px
</style>
