<template>
  <div class="rating_page">
    <header-top head-title="选择地址" :goBack="goBack"></header-top>
    <router-link to="/confirmOrder/chooseAddress/addAddress" class="add_icon_footer">
      <img src="src/images/add_address.png" height="24" width="24">
      <span>新增收货地址</span>
    </router-link>
    <!---地址列表-->
    <section id="scroll_section" class="scroll_container">
      <section class="list_container">
        <ul class="deliverable_address">
          <li v-for="(item, index) in deliverable" :key="index" @click.prevent.stop="chooseAddress(item, index)">
            <svg class="choosed_address" :class="{default_address: defaultIndex === index}">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
            </svg>
            <div>
              <header>
                <span>{{item.name}}</span>
                <span>{{item.sex === 1 ? '先生' : '女士'}}</span>
                <span>{{item.phone}}</span>
              </header>
              <div class="address_detail ellipsis">
                <span v-if="item.tag" :style="{backgroundColor: iconColor(item.tag)}">{{item.tag}}</span>
                <p>{{item.address_detail}}</p>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </section>
    <alert-tip v-if="showAlert" @closeTip="showAlert=false" :alertText="alertText"></alert-tip>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import alertTip from 'components/base/alertTip/alertTip'
import {mapGetters, mapMutations} from 'vuex'
import {getAddressList} from 'service/getData'

export default {
  data () {
    return {
      goBack: true,
      showAlert: false,
      alertText: '',
      deliverable: [], // 有效地址列表
      deliverdisable: [], // 无效地址列表
      id: null,
      sig: null
    }
  },
  components: {
    headerTop,
    alertTip
  },
  created () {
    this.id = this.$route.query.id
    this.sig = this.$route.query.sig
  },
  computed: {
    ...mapGetters([
      'userInfo', 'addressIndex', 'newAddress'
    ]),
    defaultIndex () { // 设为默认地址
      if (this.addressIndex) { // 从vuex中读取已设置好的默认地址的位置
        return this.addressIndex
      } else {
        return 0
      }
    }
  },
  methods: {
    ...mapMutations([
      'CHOOSE_ADDRESS'
    ]),
    // 初始化信息
    async initData () {
      this.addressList = []
      this.deliverable = []
      this.deliverdisable = []
      if (this.userInfo && this.userInfo.user_id) {
        this.addressList = await getAddressList(this.userInfo.user_id) // 从数据库中读取地址列表
        // 将当前所有地址访问有效无效两种
        this.addressList.forEach(item => {
          if (item.is_deliverable) {
            this.deliverable.push(item)
          } else {
            this.deliverdisable.push(item)
          }
        })
      }
    },
    iconColor (name) {
      switch (name) {
        case '公司': return '#4c964'
        case '学校': return '#3190e8'
      }
    },
    // 选择地址
    chooseAddress (address, index) {
      this.CHOOSE_ADDRESS({address, index}) // 选择哪个地址就将哪个地址放到vuex的chooseedAddress中
      this.$router.go(-1)
    }
  },
  watch: {
    userInfo (value) {
      if (value && value.user_id) {
        this.initData()
      }
    },
    newAddress () { // 只要有新地址.重新初始化
      this.initData()
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
  .add_icon_footer
    position: fixed
    bottom: 0
    left:0
    right:0
    height:120px
    background-color:#fff
    display: flex
    justify-content: center
    align-items: center
    z-index: 202
    span
      sc(32px, $blue)
      margin-left:20px
  .scroll_container
    position: fixed
    top:0
    left:0
    right:0
    bottom:0
    padding-top: 100px
    overflow-y: auto
    .list_container
      paddint-bottom:20px
      .deliverable_address
        background-color:#fff
        li
          display: flex
          align-items:center
          border-bottom:1px solid #f5f5f5
          padding:20px
          line-height:50px
          .choosed_address
            wh(40px, 40px)
            fill:#4cd964
            margin-right:20px
            opacity:0
          .default_address
            opacity:1
          header
            sc(30px, #333)
            span:nth-of-type(1)
              font-size:34px
              font-weight:bold
          .address_detail
            width:100%
            display:flex
            align-items: center
            span
              sc(20px, #fff)
              border-radius:6px
              background-color:#ff5722
              height:40px
              line-height:40px
              padding:0 10px
              margin-right:10px
            p
              sc(28px, #777)
.router-slid-enter-active, .router-slid-leave-active
  transition: all .4s
.router-slid-enter, .router-slid-leave-active
  transform: translate3d(100px, 0, 0)
  opacity: 0
</style>
