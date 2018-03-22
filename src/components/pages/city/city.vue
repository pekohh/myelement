<template>
  <div class="city_container">
    <header-top :head-title="cityname" :go-back="goBack">
      <router-link class="change_city" to="/home" slot="changecity">切换城市</router-link>
    </header-top>
    <!--输入地址 -->
    <form class="city_form" v-on:submit.prevent>
        <div>
            <input type="search" class="city_input input_style" name="city" placeholder="输入学校、商务楼、地址" v-model="inputValue"/>
        </div>
        <div>
            <input type="submit" name="submit" class="city_submit input_style" @click="postpois" value="提交"/>
        </div>
    </form>
    <!--搜索历史 -->
    <header v-if="historytitle" class='pois_search_history'>搜索历史</header>
    <!--搜索地区显示列表 -->
    <ul class="getpois_ul">
      <li v-for="(item,index) in placelist" :key="index" @click="nextpage(index, item.geohash)">
        <h4 class="pois_name ellipsis">{{item.name}}</h4>
        <p class="pois_address ellipsis">{{item.address}}</p>
      </li>
    </ul>
    <!-- 清空所有-->
    <footer v-if="historytitle&&placelist.length" class="clear_all_history" @click="clearAll">清空所有</footer>
    <div class="search_none_place" v-if="placeNone">很抱歉！无搜索结果</div>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import {currentcity, searchplace} from 'service/getData'
import {getStore, setStore, removeStore} from 'config/Util'

export default {
  data () {
    return {
      inputValue: '', // 搜索地址
      cityname: '', // 当前城市名字
      goBack: true,
      historytitle: true, // 默认显示搜索历史头部，点击搜索后隐藏
      placelist: [], // 搜索地区列表[{address:,geohash:,latitude:,longitude:,name:},]
      placeNone: false, // 搜索无结果。显示提示信息
      placeHistory: [] // 历史搜索记录
    }
  },
  components: {
    headerTop
  },
  mounted () {
    this.cityid = this.$route.params.cityid
    // 获取当前城市名字
    currentcity(this.cityid).then(res => {
      this.cityname = res.name
    })
    this.initData()
  },
  methods: {
    // 获取搜索历史记录(存在了本地localstorage)
    initData () {
      if (getStore('placeHistory')) {
        this.placelist = JSON.parse(getStore('placeHistory'))
      } else {
        this.placelist = []
      }
    },
    // 提交搜索信息inputValue
    postpois () {
      // 输入值不为空时才发送信息
      if (this.inputValue) {
        searchplace(this.cityid, this.inputValue).then(res => { // 从数据库中查找此地址匹配的信息
          this.historytitle = false
          this.placelist = res
          console.log(this.placelist)
          if (res.length) {
            this.placeNone = false
          } else {
            this.placeNone = true
          }
        })
      }
    },
    /**
    * 点击搜索结果进入下一页面时进行判断是否已经有一样的历史记录
    * 如果没有则新增，如果有则不做重复储存，判断完成后进入下一页
    */
    nextpage (index, geohash) {
      let history = getStore('placeHistory') // 取出来存入storage的地址历史搜索记录
      let choosePlace = this.placelist[index] // 获取选择的地区的数据
      if (history) {
        let checkrepeat = false // 检查重复标志
        this.placeHistory = JSON.parse(history)
        this.placeHistory.forEach(item => {
          if (item.geohash === geohash) {
            checkrepeat = true
          }
        })
        // 如此storage里面没有这条搜索词.则把当前词加入storage
        if (!checkrepeat) {
          this.placeHistory.push(choosePlace) // 把现在这个值放在placeHistory里面
        }
      } else { // 没有值,这条为第一条,放进去
        this.placeHistory.push(choosePlace)
      }
      setStore('placeHistory', this.placeHistory) // 存入本地localstorage里面
      this.$router.push({path: '/msite', query: {geohash}}) // 存进去就跳到下一页面
    },
    clearAll () {
      removeStore('placeHistory')
      this.initData()
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.city_container
  padding-top: 110px
  .change_city
    right:30px
    sc(30px, #fff)
    ct()
  .city_form
    background-color:#fff
    border-top: 1px solid $bc
    border-bottom: 1px solid $bc
    padding-top: 30px
    div
      width: 90%
      margin: 0 auto
      text-align: center
      .input_style
        border-radius: 5px
        margin-bottom: 20px
        wh(100%, 60px)
      .city_input
        border:1px solid $bc
        padding: 0 20px
        sc(30px, #333)
      .city_submit
        background-color:$blue
        sc(30px, #fff)
  .pois_search_history
    border-top: 1px solid $bc
    border-bottom:1px solid $bc
    padding-left: 30px
    font(26px, 80px)
  .getpois_ul
    background-color:#fff
    border-top:1px solid $bc
    li
      margin: 0 auto
      padding-top: 20px
      border-bottom:1px solid $bc
      .pois_name
        margin: 0 auto 20px
        width: 90%
        sc(30px, #333)
      .pois_address
        width: 90%
        margin: 0 auto 30px
        sc(20px, #999)
  .clear_all_history
    sc(40px, #666)
    text-align:center
    line-height:80px
    background-color:#fff
</style>
