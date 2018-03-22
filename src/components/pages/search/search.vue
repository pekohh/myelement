<template>
  <div class="search_page" paddingTop>
    <!--搜索 -->
    <header-top head-title="搜索" :goBack="goBack"></header-top>
    <form class="search_form">
      <input type="search" name="search" placeholder="请输入商家或美食名称" class="search_input" v-model="searchValue" @input="checkInput">
      <input type="submit" name="submit" class="search_submit" @click.prevent="searchTarget('')">
    </form>
    <!--搜索结果 -->
    <section class="search-result" v-if="restaurantList.length">
      <h4 class="title_restaurant">商家</h4>
      <ul class="list_container">
        <router-link :to="{path: '/shop', query: {id:item.id}}" tag="li" v-for="item in restaurantList" :key="item.id" class="list_li" >
          <section class="item_left">
            <img :src="imgBaseUrl + item.image_path" class="restaurant_img">
          </section>
          <section class="item_right">
            <div class='item_right_text'>
              <p>
                <span>{{item.name}}</span>
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="14" class="pay_icon">
                <polygon points="0,14 4,0 24,0 20,14" style="fill:none;stroke:#FF6000;stroke-width:1" />
                <line x1="1.5" y1="12" x2="20" y2="12" style="stroke:#FF6000;stroke-width:1.5"/>
                <text x="3.5" y="9" style="fill:#FF6000;font-size:9;font-weight:bold;">支付</text>
                </svg>
              </p>
              <p>月售{{item.month_sales||item.recent_order_num}}单</p>
              <p>{{item.delivery_fee||item.float_minimum_order_amount}}元起送/距离{{item.distance}}</p>
            </div>
            <ul class='item_right_detail' >
              <li v-for="activities in item.restaurant_activity" :key="activities.id">
                <span :style="{backgroundColor: '#' + activities.icon_color}" class="activities_icon">{{activities.icon_name}}</span>
                <span>{{activities.name}}</span>
                <span class="only_phone">(手机客户端专享)</span>
              </li>
            </ul>
          </section>
        </router-link>
      </ul>
    </section>
    <!--历史记录 -->
    <section class="search_history" v-if="searchHistory.length && showHistory">
      <h4 class="title_restaurant">搜索历史</h4>
        <ul>
          <li v-for="(item, index) in searchHistory" :key="index" class="history_list" @click="searchTarget(item)">
            <span class="history_text ellipsis">{{item}}</span>
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="delete_icon" @click="deleteHistory(index)">
              <line x1="8" y1="8" x2="18" y2="18" style="stroke:#999;stroke-width:3" />
              <line x1="18" y1="8" x2="8" y2="18" style="stroke:#999;stroke-width:3" />
            </svg>
           </li>
       </ul>
       <footer class="clear_history" @click="clearAllHistory">清空搜索历史</footer>
    </section>
    <div class="search_none" v-if="emptyResult">很抱歉！无搜索结果</div>
    <foot-guide></foot-guide>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import footGuide from 'components/base/footer/footer'
import {imgBaseUrl} from 'config/env'
import {getStore, setStore} from 'config/Util'
import {searchRestaurant} from 'service/getData'
import {mapGetters} from 'vuex'

export default {
  data () {
    return {
      searchValue: '',
      goBack: true,
      showHistory: true, // 显示历史记录
      imgBaseUrl,
      searchHistory: [], // 搜索历史记录
      restaurantList: [], // 搜索返回的结果
      emptyResult: false // 搜索结果为空的时候显示
    }
  },
  components: {
    headerTop,
    footGuide
  },
  created () {
    console.log(this.geohash)
  },
  mounted () {
    // this.geohash = this.$route.params.geohash ? this.$route.params.geohash : this.geohash
    // 获取搜索历史记录
    if (getStore('searchHistory')) {
      this.searchHistory = JSON.parse(getStore('searchHistory'))
      console.log(this.searchHistory)
    }
  },
  computed: {
    ...mapGetters([
      'geohash'
    ])
  },
  methods: {
    checkInput () {},
    // 点击提交按钮，搜索结果并显示，同时将搜索内容存入历史记录
    async searchTarget (historyValue) {
      if (historyValue) {
        this.searchValue = historyValue
      } else if (!this.searchValue) {
        return
      }
      // 隐藏历史记录
      this.showHistory = false
      // 获取搜索结果
      this.restaurantList = await searchRestaurant(this.geohash, this.searchValue)
      console.log(this.restaurantList)
      this.emptyResult = !this.restaurantList.length
      /**
      * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
      * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
      */
      let history = getStore('searchHistory')
      if (history) { // 如果此前历史记录有值，就判断当下的值与历史记录的值的关系
        let checkrepeat = false
        this.searchHistory = JSON.parse(history)
        this.searchHistory.forEach(item => {
          if (item === this.searchValue) { // 把当前的值与历史记录相比较,是否有重复的
            checkrepeat = true
          }
        })
        // 如果没有重复的，则把此值添加到历史记录列表
        if (!checkrepeat) {
          this.searchHistory.push(this.searchValue)
        }
      } else { // 如果没有,把当下的值添加到历史记录
        this.searchHistory.push(this.searchValue)
      }
      setStore('searchHistory', this.searchHistory) // 最后把当前的历史记录添加到localStore
    },
    // 点击删除一项历史记录的值
    deleteHistory (index) {
      this.searchHistory.splice(index, 1)
      setStore('searchHistory', this.searchHistory)
    },
    // 清空搜索历史的值
    clearAllHistory () {
      this.searchHistory = []
      setStore('searchHistory', this.searchHisotry)
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.search_page
  margin-bottom: 60px
  padding-top:90px
  .search_form
    background-color:#fff
    padding: 20px
    display: flex
    input
      height:70px
    .search_input
      flex: 4
      border: 1px solid $bc
      sc(30px, #333)
      background-color:#f2f2f2
      font-weight: bold
      padding: 0 10px
    .search_submit
      flex: 1
      border:1px solid $blue
      margin-left: 10px
      sc(30px, #fff)
      border-radius: 4px
      background-color:$blue
      font-weigth: bold
      padding: 0 10px
  .search-result
    .title_restaurant
      font-size: 26px
      line-height: 80px
      text-indent: 30px
      font-weight: bold
      color:#666
    .list_container
      background-color:#fff
    .list_li
      display:flex
      justify-content: center
      padding:24px
      border-bottom:1px solid $bc
      .item_left
        margin-right:10px
        .restaurant_img
          wh(80px,80px)
      .item_right
        flex:1
        font-size:26px
        .item_right_text
          padding-bottom: 20px
          border-bottom: 1px solid $bc
          p
            line-height: 46px
            .pay_icon
              margin-bottom: -6px
        .item_right_detail
          margin-top: 20px
          li
            font-size:0
            span
              font-size:20px
              vartical-align: middle
              display:inline-block
              margin-bottom:10px
              .activities_icon
                sc(20px, #fff)
                font-weight: bold
                padding: 20px
                border-radius: 2px
                margin-right:20px
                .only_phone
                  color:#ff6000
  .search_history
    .title_restaurant
      font-size: 26px
      line-height: 80px
      text-indent: 30px
      font-weight: bold
      color:#666
    .history_list
      background-color:#fff
      border-bottom: 1px solid $bc
      font(30px, 94px)
      padding: 0 20px
      display: flex
      justify-content: space-between
      align-items: center
      .history_text
        display: inline-block
        width: 80%
      .delete_icon
        wh(46px, 46px)
    .clear_history
      background-color:#fff
      color:$blue
      font(30px, 60px)
      font-weight: bold
      text-align:center
  .search_none
    margin: 0 auto
    font(30px, 80px)
    color:#333
    background-color:#fff
    text-align:center
    margin-top:30px

</style>
