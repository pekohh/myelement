<template>
  <div class="rating_page">
    <section v-if="!showLoading">
      <header-top head-title="订单备注" :goBack="goBack"></header-top>
      <section class="quick_remark" v-if="remarkList.remarks.length">
        <header class="header_style">快速备注</header>
        <ul class="remark_arr_list_ul">
          <li class="remark_arr_list_li" v-for="(item, index) in remarkList.remarks" :key="index">
            <span :class='{first: remarkIndex === 0, last: remarkIndex === item.length - 1, choosed: remarkText[index]&&(remarkText[index][0] === remarkIndex)}' class="remark_item_li" v-for="(remarkItem, remarkIndex) in item" :key='remarkIndex' @click="chooseRemark(index, remarkIndex, remarkItem)">{{remarkItem}}</span>
          </li>
        </ul>
      </section>
      <section class="input_remark quick_remark">
        <header class="header_style">其他备注</header>
        <textarea class="input_text" v-model="inputText" placeholder="请输入备注内容(可不填)"></textarea>
      </section>
      <div class="determine" @click="confirmRemark">确定</div>
    </section>
    <loading v-if="showLoading"></loading>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import loading from 'components/base/loading/loading'
import {getRemark} from 'service/getData'
import {mapMutations} from 'vuex'

export default {
  data () {
    return {
      goBack: true,
      showLoading: true,
      id: null,
      sig: null,
      remarkText: {},
      inputText: null,
      remarkList: null
    }
  },
  components: {
    headerTop,
    loading
  },
  created () {
    this.id = this.$route.query.id
    this.sig = this.$route.query.sig
  },
  mounted () {
    this.initData()
  },
  methods: {
    ...mapMutations([
      'CONFIRM_REMARK'
    ]),
    async initData () {
      // 初始化信息
      this.remarkList = await getRemark(this.id, this.sig)
      this.showLoading = false
    },
    // 选择备注
    chooseRemark (index, remarkIndex, text) {
      this.remarkText[index] = [remarkIndex, text]
      this.remarkText = Object.assign({}, this.remarkText)
    },
    // 确认选择
    confirmRemark () {
      this.CONFIRM_REMARK({
        remarkText: this.remarkText,
        inputText: this.inputText
      })
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
  background-color:#fff
  z-index: 202
  padding-top:100px
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .quick_remark
    background-color:#fff
    margin-top:30px
    padding:0 20px 30px
    ul
      display:flex
      flex-wrap:wrap
      li
        margin-right:30px
        margin-bottom:50px
        span
          sc(30px, #333)
          padding:20px 30px
          border:1px solid #3190e8
          border-left:0
        .first
          border-left:1px solid #3190e8
          border-top-left-radius:5px
          border-bottom-left-radius:5px
        .choosed
          color:#fff
          background-color:#3190e8
    .header_style
      sc(34px, #333)
      line-height:100px
  .input_remark
    background-color:#fff
    .input_text
      width:100%
      background-color:#f9f9f9
      border:1px solid #eee
      resie:none
      min-height:240px
      border-radius:5px
      sc(30px, #666)
      padding:30px
  .determine
    background:#4cd964
    sc(30px, #fff)
    text-align:center
    margin:0 20px
    line-height:100px
    border-radius:5px
</style>
