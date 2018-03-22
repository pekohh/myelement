<template>
  <div class="search_address_page">
    <section>
      <header-top head-title="搜索" :goBack="goBack"></header-top>
      <form class="search_form">
        <input type="search" name="search" placeholdre="请输入小区/写字楼/学校等" v-model="searchValue">
        <button @click.prevent="searchPlace()">搜索</button>
      </form>
      <ul class="address_list" v-if="searchData">
        <li v-for="(item, index) in searchData" :key="index" @click="choooedAddress(item)">
          <h4>{{item.name}}</h4>
          <p>{{item.address}}</p>
        </li>
      </ul>
      <div class="empty_tips" v-else>
        <p>找不到地址？</p>
        <p>尝试输入小区、写字楼或学校名</p>
        <p>详细地址（如门牌号等）可稍后输入哦</p>
      </div>
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
      searchValue: null, // 输入的搜索内容
      searchData: null // 搜索结果
    }
  },
  components: {
    headerTop
  },
  methods: {
    ...mapMutations([
      'CHOOSE_SEARCH_ADDRESS'
    ]),
    async searchPlace () {
      if (this.searchValue) {
        this.searchData = await searchNearby(this.searchValue) // 从数据库中搜索所填地址
      }
    },
    // 选择搜索结果
    choooedAddress (item) {
      this.CHOOSE_SEARCH_ADDRESS(item) // 将选择的地址存入vuex
      this.$router.go(-1)
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'

.search_address_page
  position: fixed
  top:0
  left:0
  right:0
  bottom:0
  background-color:#fff
  z-index:204
  overflow-y: auto
  paddint-top: 100px
  p, span
    font-family: Helvetica Neue,Tahoma,Arial
  .search_form
    display: flex
    padding: 20px
    margin-top:100px
    input
      sc(40px, #999)
      flex: 4
      background-color:#f1f1f1
      margin-right:20px
      height:60px
      border-radius: 6px
      padding:0 20px
    button
      flex: 1
      sc(20px, #fff)
      background-color:$blue
      border-radius:6px
  .address_list
    padding:20px
    li
      padding:20px 0
      border-bottom:1px solid #f5f5f5
      line-height:80px
      h4
        sc(30px, #555)
      p
        sc(30px, #999)
  .empty_tips
    center()
    width:100%
    p
      sc(30px, #aaa)
      line-height:80px
      text-align:center
</style>
