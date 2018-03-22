<template>
  <div class="rating_page">
    <header-top head-title="新增地址" :goBack="goBack"></header-top>
    <section class="addetail">
      <form action='' v-on:submit.prevent>
        <section class="ui-padding-block">
          <div class="input-new">
            <input type="text" placeholder="请填写你的姓名" v-model="message" :class="{verifies: verify}" @input="inputThing">
            <p v-if="verify">请填写您的姓名</p>
          </div>
          <router-link to='/profile/info/address/add/addDetail'>
            <div class="input-new">
              <input type="text" placeholder="小区/写字楼/学校等" readonly="readonly" v-model="addAddress">
            </div>
          </router-link>
          <div class="input-new">
            <input type="text" placeholder="请填写详细送餐地址" v-model="mesthree" :class="{verifies: verifythree}" @input='inputThingthree' />
            <p v-if="verifythree">{{sendaddress}}</p>
          </div>
          <div class="input-new">
            <input type="text" placeholder="请填写能够联系到您的手机号" v-model="telenum" />
            <p v-if="verifyfour"></p>
          </div>
          <div class="input-new">
            <input type="text" placeholder="备用联系电话（选填）" v-model="standbytelenum"/>
            <p v-if="verifyfive">{{standbytele}}</p>
          </div>
        </section>
        <section class="addbutton">
          <button :class="{butopacity: butpart}" @click.prevent='submitThing'>新增地址</button>
        </section>
      </form>
    </section>
    <transition name="router-slid" mode='out-in'>
      <router-view></router-view>
    </transition>
    <alert-tip v-if="showAlert" :alertText="alertText" @closeTip="showAlert=false"></alert-tip>
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
      verify: false, // 姓名
      verifythree: false,
      verifyfive: false,
      verifyfour: false,
      message: '', // 姓名
      mesthree: '',
      sendaddress: '',
      telenum: '',
      telephone: '',
      standbytelenum: '',
      standbytele: '',
      showAlert: false,
      alertText: '',
      butpart: false // 新增地址按钮的透明度
    }
  },
  components: {
    headerTop,
    alertTip
  },
  computed: {
    ...mapGetters([
      'addAddress', 'userInfo', 'removeAddress', 'newAddress', 'geohash'
    ])
  },
  mounted () {
    // console.log(this.addAddress)
  },
  methods: {
    ...mapMutations([
      'ADD_ADDRESS'
    ]),
    // 检测名字
    inputThing () {
      (!this.message) ? this.verify = true : this.verify = false
      this.bindThing()
    },
    bindThing () {
      if (this.message && this.mesthree && !this.verifyfour) {
        this.butpart = true
      } else {
        this.butpart = false
      }
    },
    // 检测详细送餐地址
    inputThingthree () {
      this.verifythree = true
      if (this.mesthree.length === 0) {
        this.sendaddress = '请详细填写送餐地址'
      } else if (this.mesthree.length > 0 && this.mesthree.length <= 2) {
        this.sendaddress = '送餐地址太短了,不能辨识'
      } else {
        this.sendaddress = ''
        this.verifythree = false
      }
      this.bindThing()
    },
    // 检测手机号
    inputThingfour () {
      this.verifyfour = true
      if ((/^[1][358][0-9]{9}$/).test(this.telenum)) {
        this.verifyfour = false
      } else if (this.telenum === '') {
        this.telephone = '手机号不能为空'
      } else {
        this.telephone = '请输入正确的手机号'
      }
      this.bindThing()
    },
    // 输入备注手机号
    inputThingfive () {
      this.verifyfive = true
      if ((/^[1][358][0-9]{9}$/).test(this.standbytelenum) || this.standbytelenum === '') {
        this.verifyfive = false
      } else {
        this.standbytele = '请输入正确的手机号'
      }
      this.bindThing()
    },
    // 新增地址
    async submitThing () {
      // 存到数据库
      let res = await postAddAddress(this.userInfo.user_id, this.mesthree, this.addAddress, this.geohash, this.message, this.telenum, this.standbytelenum, 0, 1, '公司', 4)
      if (res.message) {
        this.showAlert = true
        this.alertText = res.message
      } else if (this.butpart) {
        // 保存地址存入vuex
        this.ADD_ADDRESS({
          name: this.message,
          address: this.mesthree,
          address_detail: this.addAddress,
          geohash: 'wtw37r7cxep4',
          phone: this.telenum,
          phone_bk: this.standbytelenum,
          poi: this.addAddress,
          poi_type: 0
        })
        this.$router.go(-1)
      }
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
  .addetail
    margin-top:100px
    .ui-padding-block
      background:#fff
      padding-top:20px
      .add-detail
        display: block
      .input-new
        padding-bottom:10px
        input
          display: block
          width:96%
          font-size:30px
          margin:0 auto
          padding:10px
          background:#f2f2f2
          border:1px solid #ddd
          border-radius:6px
        .verifies
          border-color:#ea3106
        p
          sc(20px, #ea3106)
          padding-left:20px
          margin-top:20px
    .addbutton
      margin:20px auto
      width:96%
      background:#4cd964
      border-radius: 6px
      button
        width:100%
        sc(30px, #fff)
        line-height:80px
        background:none
        font-weigth:700
        opacity:.6
      .butopacity
        transition: all .4s
        opacity:1

</style>
