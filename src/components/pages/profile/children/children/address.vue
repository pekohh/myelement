<template>
  <div class="rating_page">
    <header-top head-title="编辑地址" :goBack="goBack">
      <span slot='edit' class="edit" @click="editThing">{{editText}}</span>
    </header-top>
    <section class="address">
      <!--现有地址合集-->
      <ul class="addresslist">
        <li v-for="(item, index) in removeAddress" :key="index">
          <div>
            <p>{{item.address}}</p>
            <p><span>{{item.phone}}</span><span v-if="item.phonepk">、{{item.phonepk}}</span></p>
          </div>
          <div class="deletesite" v-if="deletesite">
            <span @click="deleteSite(index, item)">X</span>
          </div>
        </li>
      </ul>
      <!--新增地址-->
      <router-link to='/profile/info/address/add'>
        <div class="addsite">
          <span>新增地址</span>
          <span class="addsvg">
            <svg fill="#d8d8d8">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
            </svg>
          </span>
        </div>
      </router-link>
    </section>
    <transition name="router-slid" mode='out-in'>
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import {mapGetters, mapActions} from 'vuex'
import {deleteAddress} from 'service/getData'

export default {
  data () {
    return {
      goBack: true,
      editText: '编辑',
      deletesite: false, // 是否编辑状态
      adressList: [] // 地址列表
    }
  },
  components: {
    headerTop
  },
  computed: { // 时时获取最新的数据
    ...mapGetters([
      'removeAddress', 'userInfo'
    ])
  },
  mounted () {
    this.initData()
    console.log(this.removeAddress)
  },
  methods: {
    ...mapActions([
      'saveAddress'
    ]),
    // 初始化
    initData () {
      if (this.userInfo && this.userInfo.user_id) {
        this.saveAddress() // 将数据库的地址存入vuex中的removeAddress
      }
    },
    // 删除一条地址
    async deleteSite (index, item) {
      if (this.userInfo && this.userInfo.user_id) {
        await deleteAddress(this.userInfo.user_id, item.id) // 数据库中删除
        this.removeAddress.splice(index, 1) // vuex中删除
      }
    },
    // 编辑事件
    editThing () {
      if (this.editText === '编辑') {
        this.editText = '完成'
        this.deletesite = true
      } else {
        this.editText = '编辑'
        this.deletesite = false
      }
    }
  },
  watch: {
    userInfo (value) {
      if (value && value.user_id) {
        this.initData()
      }
    },
    removeAddress (value) {
      // console.log(value)
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
  .edit
    right: 20px
    sc(30px, #fff)
    ct()
  .address
    margin-top:100px
    width: 100%
    border-bottom:1px solid #d9d9d9
    .addresslist
      background:#fff
      li
        border-bottom:1px solid #d9d9d9
        padding:20px
        fj(space-between)
        p
          line-height: 40px
          sc(30px, #333)
          span
            display:inline-block
            sc(20px, #333)
        .deletesite
          display: flex
          align-items:center
          span
            display:block
            sc(20px, #999)
      li:nth-of-type(1)
        background:#fff8c3
    .addsite
      margin-top:20px
      background:#fff
      padding:20px
      border-top:1px solid #d9d9d9
      fj(space-between)
      span
        display: block
        sc(30px, #333)
        line-height:60px
      .addsvg
       wh(50px, 50px)
       svg
         wh(100%, 100%)
  .router-slid-enter-active, .router-slid-leave-active
    transition: all .4s
  .router-slid-enter, .router-slid-leave-active
    transform: translate3d(100px, 0, 0)
    opacity: 0
</style>
