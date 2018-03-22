<template>
  <div class="page">
    <span class="rem_time" style="color:orange;border-width:1px;border-style:solid;border-color:orange;">{{remaining}}</span>
    <alert-tip v-if="showAlert" @clioseTip="showAlert=false" :alertText="alertText"></alert-tip>
  </div>
</template>

<script>
import alertTip from 'components/base/alertTip/alertTip'
export default {
  data () {
    return {
      showAlert: false,
      alertText: '',
      countNum: 900
    }
  },
  components: {
    alertTip
  },
  props: {
    time: { // 此订单生成的时间
      type: Number,
      default: null
    }
  },
  mounted () {
    this.countNum -= this.numTime
    this.remainingTime()
  },
  computed: {
    // 转换时间成分秒
    remaining () {
      let minute = parseInt(this.countNum / 60)
      let second = parseInt(this.countNum % 60)
      if (minute < 10) {
        minute = '0' + minute
      }
      if (second < 10) {
        second = '0' + second
      }
      return '去支付(还剩' + minute + '分' + second + '秒)'
    },
    numTime () {
      if (this.time.toString().indexOf('分钟') !== -1) {
        return parseInt(this.time) * 60
      } else {
        return parseInt(this.time)
      }
    }
  },
  methods: {
    closeTip () {
      this.$emit('closeTip')
    },
    // 计算时间,多长时间以后弹出超时消息
    remainingTime () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.countNum--
        if (this.countNum === 0) {
          clearInterval(this.timer)
          this.showAlert = true
          this.alertText = '支付超时'
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.page
  display:inline-block
  .rem_time
    sc(30px, orange)
    padding:10px 20px
    border-radius: 5px
</style>
