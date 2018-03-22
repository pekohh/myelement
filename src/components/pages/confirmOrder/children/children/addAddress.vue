<template>
  <div class="address_page">
    <header-top head-title="添加地址" :goBack="goBack"></header-top>
    <section class="page_text_container">
      <section class="section_list">
        <span class="section_left">联系人</span>
        <section class="section_right">
          <input type="text" name="name" placeholder="你的名字" v-model="name" class="input_style"/>
          <div class="choose_sex">
            <span class="choose_option">
              <svg class="address_empty_right" @click="chooseSex(1)" :class="{choosed: sex === 1}">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
              <span>先生</span>
            </span>
            <span class="choose_option">
              <svg class="address_empty_right" @click="chooseSex(2)" :class="{choosed: sex === 2}">
                <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#select"></use>
              </svg>
              <span>女士</span>
            </span>
          </div>
        </section>
      </section>
      <section class="section_list">
        <span class="section_left">联系电话</span>
        <section class="section_right">
          <div class="phone_add">
            <input type="text" name="phone" placeholder="你的手机号" v-model="phone" class="input_style"/>
            <img src="src/images/add_phone.png" height="20" width="20" @click="phone_bk = true">
          </div>
          <input v-if="phone_bk" type="text" name="anntherPhoneNumber" placeholder='备选电话' v-model="anntherPhoneNumber" class="input_style phone_bk">
        </section>
      </section>
      <section class="section_list">
        <span class="section_left">送餐地址</span>
        <section class="section_right">
          <router-link to='/confirmOrder/chooseAddress/addAddress/searchAddress' tag="div" class="choose_address">
            {{searchAddress ? searchAddress.name: '小区/写字楼/学校等'}}
          </router-link>
          <input type="text" name="address_detail" placeholder='详细地址（如门牌号等）' v-model="address_detail" class='input_style'>
        </section>
      </section>
      <section class="section_list">
        <span class="section_left">标签</span>
        <section class="section_right">
          <input type="text" name="tag" placeholder="无/家/学校/公司" v-model="tag" class="input_style">
        </section>
      </section>
    </section>
    <div class="determine" @click="addAddress">确定</div>
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
import {postAddAddress} from 'service/getData'

export default {
  data () {
    return {
      goBack: true,
      name: null, // 姓名
      phone: null, // 电话
      address_detail: null, // 详细地址
      sex: 1, // 性别
      tag: '', // 备注
      phone_bk: false, // 是否选择备注电话
      showAlert: false,
      alertText: '',
      anntherPhoneNumber: '' // 备注电话
    }
  },
  components: {
    headerTop,
    alertTip
  },
  computed: {
    ...mapGetters([
      'searchAddress', 'userInfo', 'geohash'
    ])
  },
  methods: {
    ...mapMutations([
      'CONFIRM_ADDRESS'
    ]),
    // 选择性别
    chooseSex (sex) {
      this.sex = sex
    },
    // 保存地址信息
    async addAddress () {
      if (!(this.userInfo && this.userInfo.user_id)) {
        this.showAlert = true
        this.alertText = '请登录'
        return
      } else if (!this.name) {
        this.showAlert = true
        this.alertText = '请输入姓名'
        return
      } else if (!this.phone) {
        this.showAlert = true
        this.alertText = '请输入电话号码'
        return
      } else if (!this.searchAddress) {
        this.showAlert = true
        this.alertText = '请选择地址'
        return
      } else if (!this.address_detail) {
        this.showAlert = true
        this.alertText = '请输入详细地址'
        return
      }
      if (this.tag === '无') {
        this.tag_type = 0
      } else if (this.tag === '家') {
        this.tag_type = 2
      } else if (this.tag === '学校') {
        this.tag_type = 3
      } else if (this.tag === '公司') {
        this.tag_type = 4
      }
      // 将新添加的地址保存到数据库中
      let res = await postAddAddress(this.userInfo.user_id, this.searchAddress.name, this.address_detail, this.geohash, this.name, this.phone, this.anntherPhoneNumber, 0, this.sex, this.tag, this.tag_type)
      // 保存成功返回上一页，否则弹出提示框
      if (res.message) {
        this.showAlert = true
        this.alertText = res.message
      } else {
        this.CONFIRM_ADDRESS(1) // 把新地址添加到vuex
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.address_page
  position: fixed
  top:0
  left:0
  right:0
  bottom:0
  background-color:#f5f5f5
  z-index: 204
  padding-top:100px
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .page_text_container
    background-color:#fff
    padding:0 40px
    .section_list
      display: flex
      border-bottom:1px solid #f5f5f5
      .section_left
        sc(30px, #333)
        flex: 2
        line-height:120px
      .section_right
        flex: 5
        .input_style
          width: 100%
          height:120px
          sc(30px, #999)
        .phone_bk
          border-top:1px solid #f5f5f5
        .phone_add
          fj()
          align-items: center
        .choose_sex
          display: flex
          line-height:120px
          border-top:1px solid #f5f5f5
          .choose_option
            sc(30px, #333)
            display: flex
            align-items: center
            margin-right:20px
            svg
              margin-right:20px
              wh(30px, 30px)
              fill:#ccc
             .choosed
               fill:#4cd964
        .choose_address
          sc(30px, #999)
          line-height:120px
          border-bottom:1px solid #f5f5f5
  .determine
    background-color:#4cd964
    sc(30px, #fff)
    text-align:center
    margin:0 20px
    line-height:80px
    border-radius:6px
    margin-top:30px
.router-slid-enter-active, .router-slid-leave-active
  transition: all .4s
.router-slid-enter, .router-slid-leave-active
  transform: translate3d(100px, 0, 0)
  opacity: 0
</style>
