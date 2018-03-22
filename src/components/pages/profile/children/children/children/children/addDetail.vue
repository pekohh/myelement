<template>
  <div class="rating_page">
    <header-top head-title="搜索地址" :goBack='goBack'></header-top>
    <section>
      <div class="add-detail">
        <input type="text" placeholder="请输入小区/写字楼/学校等" v-model="inputAdress">
        <button @click="inputThing">确认</button>
      </div>
      <div class="warnpart">为了满足商家的送餐要求，建议您从列表中选择地址</div>
      <div class="point" v-show="warning">
        <p>找不到地址？</p>
        <p>请尝试输入小区、写字楼或学校名</p>
        <p>详细地址（如门牌号）可稍后输入哦。</p>
      </div>
    </section>
    <section class="poisearch-container" v-show="adressList">
      <ul>
        <li v-for="(item, index) in adressList" :key="index" @click="listClick(index)">
          <p>{{item.name}}</p>
          <p>{{item.address}}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import {searchNearby} from 'service/getData'
import {mapMutations} from 'vuex'

export default {
  data () {
    return {
      goBack: true,
      adressList: [],
      inputAdress: '',
      warning: true
    }
  },
  components: {
    headerTop
  },
  methods: {
    ...mapMutations([
      'SAVE_ADDDETAIL'
    ]),
    // 搜索地址
    inputThing () {
      searchNearby(this.inputAdress).then(res => {
        this.adressList = res
        this.warning = true
        if (this.adressList.length > 0) {
          this.warning = false
          if (this.inputAdress === '') {
            this.adressList = []
            this.warning = true
          }
        }
      })
    },
    // 点击列表选择地址
    listClick (index) {
      this.SAVE_ADDDETAIL(this.adressList[index].name)
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
  background-color:#f2f2f2
  z-index:202
  padding-top:20px
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .add-detail
    fj(space-between)
    background:#fff
    padding:20px
    margin-top:75px
    input
      display: block
      width:80%
      padding:20px
      background:#f2f2f2
      border:1px solid #ddd
      border-radius:5px
      font-size:26px
    button
      display: block
      width:16%
      background:#3199e8
      sc(30px, #fff)
      border-radius: 5px
  .warnpart
    background:#fff6e4
    sc(28px, #ff883f)
    text-align:center
    padding:20px 0
  .point
    center()
    width:100%
    p
      width: 100%
      text-align:center
      sc(32px, #969696)
      margin-bottom:20px
  .poisearch-container
    background:#f2f2f2
    li
      border-bottom:1px solid #ccc
      padding:20px
      p
        sc(30px, #969696)
      p:first-child
        margin-bottom:20px
    li:last-child
      border:0
</style>
