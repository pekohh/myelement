<template>
  <div class="food_container">
    <header-top :head-title="headTitle" :goBack="goBack"></header-top>
    <!--导航-->
    <section class="sort_container">
      <!-- 分类-->
      <div class="sort_item" :class="{choose_type:sortBy == 'food'}">
        <div class="sort_item_container" @click="chooseType('food')">
          <div class="sort_item_border">
            <span :class="{category_title: sortBy == 'food'}">{{foodTitle}}</span>
              <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
                <polygon points="0,3 10,3 5,8"/>
              </svg>
          </div>
        </div>
        <transition name="showlist" v-show="category">
          <section v-show="sortBy == 'food'" class="category_container sort_detail_type">
            <section class="category_left">
              <ul>
                <li class="category_left_li" :key="index" v-for='(item, index) in category' @click='selectCategoryName(item.id, index)' :class="{category_active:restaurant_category_id === item.id}">
                  <section>
                    <img class="category_icon" :src="getImgPath(item.image_url)">
                    <span class="">{{item.name}}</span>
                  </section>
                  <section>
                    <span class="category_count">{{item.count}}</span>
                    <svg v-if="index" width="8" height="8" xmlns="http://www.w3.org/2000/svg" version="1.1" class="category_arrow" >
                        <path d="M0 0 L6 4 L0 8"  stroke="#bbb" stroke-width="1" fill="none"/>
                    </svg>
                  </section>
                </li>
              </ul>
            </section>
            <section class="category_right">
              <ul>
                <li class="category_right_li" v-for="(item, index) in categoryDetail" v-if="index" :key="item.id" :class="{category_right_choosed: restaurant_category_ids == item.id || (!restaurant_category_ids)&&index == 0}" @click="getCategoryIds(item.id, item.name)">
                  <span>{{item.name}}</span>
                  <span>{{item.count}}</span>
                </li>
              </ul>
            </section>
          </section>
        </transition>
      </div>
      <!-- 排序-->
      <div class="sort_item" :class="{choose_type:sortBy == 'sort'}">
        <div class="sort_item_container" @click="chooseType('sort')">
          <div class="sort_item_border">
           <span :class="{category_title: sortBy == 'sort'}">排序</span>
           <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
                <polygon points="0,3 10,3 5,8"/>
            </svg>
          </div>
        </div>
        <transition name="showlist">
          <section v-show="sortBy == 'sort'" class="sort_detail_type">
              <ul class="sort_list_container" @click="sortList($event)">
                <li class="sort_list_li" v-for="(item, index) in sortArr" :key="index">
                  <svg>
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="item.href"></use>
                  </svg>
                    <p :data="index" :class="{sort_select: sortByType == index}">
                      <span>{{item.name}}</span>
                      <svg v-if="sortByType == index">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                      </svg>
                    </p>
                </li>
              </ul>
            </section>
          </transition>
      </div>
      <!-- 筛选-->
      <div class="sort_item" :class="{choose_type:sortBy == 'activity'}">
        <div class="sort_item_container" @click="chooseType('activity')">
          <span :class="{category_title: sortBy == 'activity'}">筛选</span>
          <svg width="10" height="10" xmlns="http://www.w3.org/2000/svg" version="1.1" class="sort_icon">
            <polygon points="0,3 10,3 5,8"/>
          </svg>
        </div>
        <transition name="showlist">
          <section v-show="sortBy == 'activity'" class="sort_detail_type filter_container">
           <section style="width:100%">
             <header class="filter_header_style">配送方式</header>
             <ul class="filter_ul">
               <li v-for="item in Delivery" :key="item.id" class="filter_li" @click="selectDeliveryMode(item.id)">
                  <svg :style="{opacity: (item.id == 0)&&(delivery_mode !== 0)? 0: 1}">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="delivery_mode == item.id? '#selected':'#fengniao'"></use>
                  </svg>
                  <span :class="{selected_filter: delivery_mode == item.id}">{{item.text}}</span>
               </li>
             </ul>
           </section>
           <section style="width:100%">
             <header class="filter_header_style">商家属性（可以多选）</header>
             <ul class="filter_ul">
               <li v-for="(item,index) in Activity" :key="item.id" class="filter_li" @click="selectSupportIds(index, item.id)">
                 <svg class="activity_svg" v-show="support_ids[index].status">
                   <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#selected"></use>
                 </svg>
                 <span class="filter_icon" :style="{color: '#' + item.icon_color, borderColor: '#' + item.icon_color}" v-show="!support_ids[index].status">{{item.icon_name}}</span>
                 <span>{{item.name}}</span>
               </li>
             </ul>
           </section>
           <footer class="confirm_filter">
             <div class="clear_all filter_botton_style" @click="clearSelect">清空</div>
             <div class="confirm_select filter_botton_style" @click="confirmSelectFun">确定</div>
           </footer>
          </section>
        </transition>
      </div>
    </section>
    <!--列表 -->
      <!-- 背景-->
    <transition name="showcover">
        <div class="back_cover" v-show="sortBy"></div>
    </transition>
    <section class="shop_list_container" >
      <shop-list :geohash="geohash" :restaurantCategoryId="restaurant_category_id" :restaurantCategoryIds="restaurant_category_ids" :sortByType="sortByType" :deliveryMode="delivery_mode" :confirmSelect="confirmStatus" :supportIds="support_ids"></shop-list>
    </section>
  </div>
</template>

<script>
import headerTop from 'components/base/header/header'
import {foodCategory, msiteAddress, foodDelivery, foodActivity} from 'service/getData'
import shopList from 'components/base/shop-list/shop-list'
import {mapMutations} from 'vuex'
const arr = [{href: '#default', name: '智能排序'}, {href: '#price', name: '起送价最低'}, {href: '#speed', name: '配送速度最快'}, {href: '#rating', name: '评分最高'}, {href: '#hot', name: '销量最高'}, {href: '#distance', name: '距离最近'}]

export default {
  data () {
    return {
      geohash: '', // msite页面传过来的地址geohash
      headTitle: '', // food页面头部标题
      goBack: true,
      foodTitle: '', // 排序左侧头部标题
      sortBy: '', // 筛选的条件
      category: null, // 分类左侧数据
      categoryDetail: null, // 分类右侧的详细数据
      restaurant_category_id: 0, // 食品分类类型id值
      restaurant_category_ids: 0, // 分类里面右侧每个类别的id
      sortByType: null, // 根据何种方式排序,data的值
      delivery_mode: 0, // 筛选中选中的配送方式
      confirmStatus: false, // 确认选择
      support_ids: [], // 选中的商家属性列表
      sortArr: arr,
      Delivery: null, // 配送方式数据
      Activity: null, // 商家属性数据
      filterNum: 0 // 选中的所有样式的集合
    }
  },
  components: {
    headerTop,
    shopList
  },
  created () {
    this.initData()
  },
  methods: {
    // 初始化数据
    async initData () {
      // 获取从msite页面传过来的参数
      this.geohash = this.$route.query.geohash
      this.headTitle = this.$route.query.title
      this.foodTitle = this.headTitle
      this.restaurant_category_id = parseInt(this.$route.query.restaurant_category_id)
      // 防止刷新页面时，vuex状态丢失，经度纬度需要重新获取，并存入vuex
      if (!this.latitude) {
        // 获取位置信息
        let res = await msiteAddress(this.geohash)
        this.RECORD_ADDRESS(res)
      }
      // 获取category分类左侧数据
      this.category = await foodCategory(this.latitude, this.longitude)
      console.log(this.category)
      // 初始化时定位当前category分类左侧默认选择项，在右侧展示出其sub_categories列表
      this.category.forEach(item => {
        if (this.restaurant_category_id === item.id) {
          this.categoryDetail = item.sub_categories
          console.log(this.categoryDetail)
        }
      })
      // 获取筛选列表的配送方式
      this.Delivery = await foodDelivery(this.latitude, this.longitude)
      // 获取筛选商家属性
      this.Activity = await foodActivity(this.latitude, this.longitude)
      // 记录support_ids的状态，默认不选中。点击状态取反。status为true时为选中状态
      this.Activity.forEach((item, index) => {
        this.support_ids[index] = {status: false, id: item.id}
      })
    },
    // 点击顶部三个选项展示不同的列表，选中当前选项进行展示，同时收回其他选项
    async chooseType (type) {
      if (this.sortBy !== type) { // 说明点击的不是当前的选项
        this.sortBy = type
        // 此时food选项的头部标题发生改变，需要特殊处理
        if (type === 'food') {
          this.foodTitle = '分类'
        } else {
          // 将foodTitle和headTitle进行同步
          // this.foodTitle = this.headTitle
        }
      } else {
        // 再次点击相同选项时收回列表
        this.sortBy = ''
        if (type === 'food') {
          // 将foodTitle 和 headTitle 进行同步
          this.foodTitle = this.headTitle
        }
      }
    },
    getImgPath (path) {
      let suffix
      if (!path) {
        return 'http://test.fe.ptdev.cn/elm/elmlogo.jpeg'
      }
      if (path.indexOf('jpeg') !== -1) {
        suffix = '.jpeg'
      } else {
        suffix = '.png'
      }
      let url = '/' + path.substr(0, 1) + '/' + path.substr(1, 2) + '/' + path.substr(3) + suffix
      return 'https://fuss10.elemecdn.com' + url
    },
    // 一选中Category左侧列表的某个选项时，右侧渲染相应的sub_categories列表
    selectCategoryName (id, index) {
      // 默认选项--全部商家.因为没有自己的列表,所以默认显示所有数据
      // if (index === 0) {
      //   this.restaurant_category_ids = null
      //   this.sortBy = ''
      // 不是第一个时.右侧展示其子级sub_categories的列表
      // } else {
      //   this.restaurant_category_id = id
      //  this.categoryDetail = this.category[index].sub_categories
      // }
      this.restaurant_category_id = id
      this.categoryDetail = this.category[index].sub_categories
    },
    // 一选中Category右侧列表的某个选项时，进行筛选，重新获取数据并渲染
    getCategoryIds (id, name) {
      this.restaurant_category_ids = id
      this.sortBy = ''
      this.foodTitle = this.headTitle = name
    },
    // 二点击某个排序方式，获取事件对象的data值，并根据获取的值重新获取数据渲染
    sortList (event) {
      let node
      // 如果点击的是 span中的文字 ,则需要获取其父级p标签
      if (event.target.nodeName.toUpperCase() !== 'P') {
        node = event.target.parentNode
      } else {
        node = event.target
      }
      this.sortByType = node.getAttribute('data')
      this.sortBy = ''
    },
    // 三筛选配送方式的选择
    selectDeliveryMode (id) {
      // delivery_mode为空时，选中当前选项，filterNum+1
      if (this.delivery_mode === 0) {
        this.filterNum++
        this.delivery_mode = id
        // delivery_mode为当前已有值时，清空所选项，并且filterNum减一
      } else if (this.delivery_mode === id) {
        this.filterNum--
        this.delivery_mode = 0
      } else {
        this.deliver_mode = id
      }
    },
    // 三点击商家活动，状态取反
    selectSupportIds (index, id) {
      // 数组替换新的值
      this.support_ids.splice(index, 1, {status: !this.support_ids[index].status, id})
      // 重新计算filterNum的个数
      this.filterNum = this.delivery_mode == null ? 0 : 1
      this.support_ids.forEach(item => {
        if (item.status) {
          this.filterNum++
        }
      })
    },
    // 筛选确定,将需要筛选的id值传递给子组件，并且收回列表
    confirmSelectFun () {
      // 状态改变时，因为子组件进行了监听，会重新获取数据进行筛选
      this.confirmStatus = !this.confirmStatus
      this.sortBy = ''
    },
    // 清空
    clearSelect () {
      this.support_ids.map((item) => {
        item.status = false
      })
      this.filterNum = 0
      this.delivery_mode = null
    },
    ...mapMutations([
      'RECORD_ADDRESS'
    ])
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.food_container
  padding-top:176px
  .sort_container
    background-color:#fff
    border-bottom: 1px solid #f1f1f1
    position:fixed
    top:90px
    right:0
    width:100%
    display:flex
    z-index:13
    box-sizing:border-box
    .sort_item
      sc(26px, #444)
      wh(33.3%, 84px)
      text-align:center
      line-height:84px
      .sort_item_container
        wh(100%, 100%)
        position:relative
        z-index:14
        background-color:#fff
        box-sizing:border-box
        padding-top:10px
    .choose_type
      .sort_item_container
        .category_title
          color:$blue
        .sort_icon
          transform: rotate(180deg)
          fill:$blue
      .sort_detail_type
        width: 100%
        position: absolute
        display: flex
        left:0
        border-top:1px solid $bc
        background-color:#fff
        &.showlist-enter-active, &.showlist-leave-active
          transition: all .3s
          transform: translateY(0)
        &.showlist-enter, &.showlist-leave-active
          opacity: 0
          transform: translateY(-100%)
        .category_left
          flex:1
          background-color:#f1f1f1
          height:800px
          overflow-y: auto
          .category_left_li
            fj()
            padding: 0 20px
            .category_icon
              wh(36px, 36px)
              vertical-align:middle
              margin-right: 10px
            .category_count
              background-color:#ccc
              sc(20px, #fff)
              padding: 0 10px
              border: 1px solid #ccc
              border-radius: 50%
              vartical-align:middle
              margin-right: 10px
          .category_active
            background-color:#fff
            span
              sc(20px, #666)
              line-height: 60px
        .category_right
          flex: 1
          background-color:#fff
          padding-left: 10px
          height: 800px
          overflow-y: auto
          .category_right_li
            fj()
            height: 84px
            line-height:84px
            padding-right:10px
            border-bottom:1px solid $bc
            span
              color:#666
          .category_right_choosed
            span
              color:$blue
      .sort_detail_type
        .sort_list_container
          width:100%
          .sort_list_li
            height:120px
            display:flex
            align-items:center
            svg
              wh(40px, 40px)
              margin: 0 20px 0 30px
            p
              line-height:80px
              flex: auto
              text-align:left
              text-index: 40px
              border-bottom:1px solid $bc
              fj()
              align-items: center
              span
                color:#666
            .sort_select
              span
                color
      .filter_container
        flex-direction: column
        align-items:flex-start
        min-height: 300px
        background-color:#f1f1f1
        .filter_header_style
          sc(20px, #333)
          line-height:60px
          height:75px
          text-align:left
          padding-left: 30px
          background-color:#fff
        .filter_ul
          display: flex
          flex-wrap: wrap
          padding: 0 20px
          background-color:#fff
          .filter_li
            display: flex
            align-items: center
            border: 1px solid #eee
            wh(33.3%,70px)
            border-radius: 10px
            padding: 0 20px
            margin-bottom:20px
            svg
              wh(30px, 30px)
            .filter_icon
              wh(40px, 40px)
              font-size:20px
              border:2px solid $bc
              border-radius: 2px
              margin-right:10px
              line-height: 36px
              text-align: center
            span
              sc(20px, #333)
            &.selected_filter
              color: $blue
        .confirm_filter
          display: flex
          background-color:#f1f1f1
          width:100%
          padding: 20px 15px
          .filter_botton_style
            wh(50%, 60px)
            font-size:20px
            line-height: 60px
            border-radius: 10px
          .clear_all
            background-color: #fff
            margin-right: 20px
            border: 1px solid #fff
          .confirm_select
            background-color:#56d176
            color:#fff
            border:1px solid #56d176
            span
               color:#fff
  .back_cover
    position: fixed
    wh(100%, 100%)
    z-index:10
    background-color:rgba(0,0,0,0.3)
</style>
