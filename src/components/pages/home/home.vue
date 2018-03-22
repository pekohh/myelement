<template>
  <div class="home">
    <header-top signin-up="home">
      <span slot="logo" class="head_logo" @click="reload">ele.me</span>
    </header-top>
    <!--城市定位-->
    <nav class="city_nav">
      <div class="city_tip">
        <span>当前定位城市：</span>
        <span>定位不准时，请在城市列表中选择</span>
      </div>
      <router-link :to="'/city/' + guessCityid" class="guess_city">
        <span>{{guessCity}}</span>
        <svg class="arrow-right">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
        </svg>
      </router-link>
    </nav>
    <!--热门城市-->
    <div id="hot_city_container">
      <h4 class="city_title">热门城市</h4>
      <ul class="citylistul clear">
        <router-link tag="li" v-for="item in hotcity" :to="'/city/' + item.id" :key="item.id">
          {{item.name}}
        </router-link>
      </ul>
    </div>

    <!--城市列表（按字母排序） -->
    <div class="group_city_container">
      <ul class="letter_classify">
        <li v-for="(value, key, index) in sortgroupcity" :key="key" class="letter_classify_li">
          <h4 class="city_title">{{key}}
            <span v-if="index == 0">(按字母排序)</span>
          </h4>
          <ul class="groupcity_name_container citylistul clear">
            <router-link tag="li" v-for="item in value" :to="'/city/' + item.id" :key="item.id" class="ellipsis">
              {{item.name}}
            </router-link>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import headerTop from 'components/base/header/header'
import {cityGuess, hotcity, groupcity} from 'service/getData'

export default {
  data () {
    return {
      guessCity: '', // 当前城市
      guessCityid: '', // 当前城市id
      hotcity: [], // 热门城市列表
      groupcity: {} // 所有城市列表
    }
  },
  components: {
    headerTop
  },
  mounted () {
    // 获取当前城市
    cityGuess().then(res => {
      this.guessCity = res.name
      this.guessCityid = res.id
    })
    // 获取热门城市
    hotcity().then(res => {
      this.hotcity = res
    })
    // 获取所有城市
    groupcity().then(res => {
      this.groupcity = res
    })
  },
  methods: {
    // 点击图标刷新页面
    reload () {
      window.location.reload()
    }
  },
  computed: {
    // 将获取的数据按照A-Z字母开头排序
    sortgroupcity () {
      let sortobj = {}
      for (let i = 65; i <= 90; i++) {
        if (this.groupcity[String.fromCharCode(i)]) {
          sortobj[String.fromCharCode(i)] = this.groupcity[String.fromCharCode(i)]
        }
      }
      return sortobj
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.home
  .head_logo
    left: 20px
    font-weight:400
    sc(40px, #fff)
    wh(100px, 40px)
    ct()
  .city_nav
    padding-top: 100px
    border-top:1px solid $bc
    background-color:#fff
    margin-bottom: 30px
    .city_tip
      fj()
      line-height:100px
      padding: 0 20px 0
      span:nth-of-type(1)
        sc(20px, #666)
      span:nth-of-type(2)
        sc(28px, #9f9f9f)
        font-weight: 900
    .guess_city
      fj()
      align-items: center
      height:90px
      border-top:1px solid $bc
      border-bottom: 2px solid $bc
      padding: 0 20px 0
      font(30px, 60px)
      span:nth-of-type(1)
        color:$blue
      .arrow-right
        wh(30px, 30px)
        fill: #999
  #hot_city_container
    background-color:#fff
    margin-bottom:20px
    .city_title
      color: #666
      font-weight:400
      text-indent: 0.45rem
      border-top:2px solid $bc
      border-bottom:1px solid $bc
      font(26px, 50px, "Helvetica Neue")
    .citylistul
      li
        float:left
        text-align:center
        color:$blue
        border-bottom: 1px solid $bc
        border-right: 1px solid $bc
        wh(25%, 80px)
        font(26px, 80px)
      li:nth-of-type(4n)
        border-right: none
  .group_city_container
    .letter_classify
      .letter_classify_li
        margin-bottom: 30px
        background-color:#fff
        border-bottom: 1px solid $bc
        .city_title
          color: #666
          font-weight:400
          text-indent: 24px
          border-top:2px solid $bc
          border-bottom:1px solid $bc
          font(26px, 50px, "Helvetica Neue")
        .groupcity_name_container
          li
            color:#666
            float:left
            text-align:center
            border-bottom: 1px solid $bc
            border-right: 1px solid $bc
            wh(25%, 80px)
            font(26px, 80px)
          li:nth-of-type(4n)
            border-right: none
</style>
