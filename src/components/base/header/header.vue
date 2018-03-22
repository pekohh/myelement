<template>
  <div id="head_top">
     <slot name="logo"></slot>
     <slot name="search"></slot>
     <!--返回按钮的设置-->
     <section class="head_goback" v-if="goBack" @click="$router.go(-1)">
         <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:2"/>
        </svg>
     </section>
     <!-- 登录|注册版块的判断-->
     <router-link class="head_login" :to="userInfo? '/profile' : '/login'" v-if="signinUp">
        <svg class="user_avatar" v-if="userInfo">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#user"></use>
        </svg>
        <span class="login_span" v-else>登录|注册</span>
     </router-link>

     <!-- 头部标题-->
     <div class="title-head ellipsis" v-if="headTitle">
        <span class="title_text">{{headTitle}}</span>
     </div>
     <slot name="edit"></slot>
     <slot name="msite-title"></slot>
     <slot name="changecity"></slot>
     <slot name="changeLogin"></slot>

  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapActions} from 'vuex'
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  mounted () {
    // 获取用户信息
    this.getUserInfo()
  },
  props: {
    signinUp: {
      type: String,
      default: ''
    },
    headTitle: {
      type: String,
      default: ''
    },
    goBack: { // 返回按钮。是否选择了
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {
    ...mapActions([
      'getUserInfo'
    ])
  },
  created () {
    // console.log(this.userInfo)
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
#head_top
  background-color:$blue
  position: fixed
  left:0
  top:0
  z-index:100
  wh(100%, 90px)
  .head_goback
    left: 20px
    wh(30px, 40px)
    line-height: 80px
    margin-left:20px
    ct()
  .head_login
    right: 50px
    sc(30px, #fff)
    ct()
    .login_span
      color:#fff
    .user_avatar
      fill:#fff
      wh(40px, 40px)
  .title-head
    width:50%
    color:#fff
    center()
    text-align: center
    .title_text
      sc(40px, #fff)
      text-align:center
      font-weight: bold
</style>
