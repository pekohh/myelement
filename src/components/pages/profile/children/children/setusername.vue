<template>
  <div class="rating_page">
    <header-top head-title="修改用户名" :goBack='goBack'></header-top>
    <section class="setname">
      <section class="setname-top">
        <input
        type="text" placeholder="输入用户名" :class="{'setname-input': bordercolor}" @input="inputThing" v-model="inputValue">
        <div>
          <p v-if="earn">用户名只能修改一次（5-24字符之间）</p>
          <p class="unlikep" v-else>用户名长度在5到24位之间</p>
        </div>
      </section>
      <section class="reset">
        <button :class="{fontopacity:opacityall}" @click="resetName">确认修改</button>
      </section>
    </section>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import {mapMutations} from 'vuex'

export default {
  data () {
    return {
      goBack: true,
      earn: true, // 输入框提醒
      bordercolor: false, // 输入框边框颜色
      opacityall: false, // 字体透明度
      inputValue: '' // 输入框的内容
    }
  },
  components: {
    headerTop
  },
  methods: {
    ...mapMutations([
      'RETSET_NAME'
    ]),
    // 输入字符检测
    inputThing () {
      // 当输入字符长度小于5或者大于24时。输入框的提示和背景颜色及确定按钮会变化
      if (this.inputValue.length < 5 || this.inputValue.length > 24) {
        this.earn = false
        this.bordercolor = true
        this.opacityall = false
        return false
      } else {
        this.earn = true
        this.bordercolor = false
        this.opacityall = true
        return true
      }
    },
    // 确认修改
    resetName () {
      let checkResult = this.inputThing() // 输入完成后的检测结果
      if (!checkResult) { // 如果不对，无法提交。直接返回
        return
      }
      this.RETSET_NAME(this.inputValue) // 提交结果。
      this.$router.go(-1)
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
  z-index:202
  background:#f2f2f2
  paddint-top:100px
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .setname
    width: 96%
    margin:20px auto 0
    .setname-top
      padding-top:80px
      input
        background:none
        width: 100%
        border:1px solid #ddd
        border-radius: 6px
        padding:15px 10px
        line-height:60px
        font-size:30px
        display:block
      .setname-input
        border-color:#ea3106
      p
        width:100%
        sc(20px, #666)
        padding:10px 10px 40px
      .unlikep
        sc(20px, #ea3106)
        padding-top:20px
    .reset
      width:100%
      background:#3199e8
      button
        display: block
        width:100%
        background:none
        line-height:100px
        sc(30px, #fff)
        opacity:.6
        transition: all 1s
      .fontopacity
        transition: all 1s
        opacity:1
</style>
