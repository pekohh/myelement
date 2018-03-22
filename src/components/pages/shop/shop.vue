<template>
  <div class="shop">
    <section class="shop_container" v-if="!showLoading">
      <!--导航-->
      <nav class="goback" @click="goback">
        <svg width="4rem" height="100%" xmlns="http://www.w3.org/2000/svg" version="1.1">
          <polyline points="12,18 4,9 12,0" style="fill:none;stroke:rgb(255,255,255);stroke-width:3"/>
        </svg>
      </nav>
      <!--头部-->
      <header class="shop_detail_header" ref="shopheader" :style="{zIndex:showActivities ? '14':'10'}">
        <img  class="header_cover_img" :src="imgBaseUrl + shopDetailData.image_path" >
        <section class="description_header">
          <!--头部，左右-->
          <router-link to="/shop/shopDetail" class="description_top">
            <section class="description_left">
              <img :src="imgBaseUrl + shopDetailData.image_path">
            </section>
            <section class="description_right">
              <h4 class="description_title ellipsis">{{shopDetailData.name}}</h4>
              <p class="description_text">商家配送/{{shopDetailData.order_lead_time}}分钟送达/配送费￥{{shopDetailData.float_delivery_fee}}</p>
              <p class="description_promotion ellipsis">公告：{{promotionInfo}}</p>
            </section>
            <svg width="14" height="14" xmlns="http://www.w3.org/2000/svg" version="1.1" class="description_arrow" >
              <path d="M0 0 L8 7 L0 14"  stroke="#fff" stroke-width="1" fill="none"/>
            </svg>
          </router-link>
          <!--底部公告-->
          <footer class="description_footer" v-if="shopDetailData.activities.length" @click="showActivitiesFun">
            <p class="ellipsis">
              <span class="tip_icon" :style="{backgroundColor: '#' + shopDetailData.activities[0].icon_color, borderColor: '#' + shopDetailData.activities[0].icon_color}">{{shopDetailData.activities[0].icon_name}}</span>
              <span>{{shopDetailData.activities[0].description}}(App专享)</span>
            </p>
            <p>{{shopDetailData.activities.length}}个活动</p>
            <svg class="footer_arrow">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-left"></use>
            </svg>
          </footer>
        </section>
      </header>
      <!---公告详情-->
      <transition name="fade">
        <section class="activities_details" v-if="showActivities">
          <h2 class="activities_shoptitle">{{shopDetailData.name}}</h2>
          <h3 class="activities_ratingstar">
            <rating-star :rating='shopDetailData.rating'></rating-star>
          </h3>
          <section class="activities_list">
            <header class="activities_title_style"><span>优惠信息</span></header>
            <ul>
              <li v-for="item in shopDetailData.activities" :key="item.id">
                <span class="activities_icon" :style="{backgroundColor:'#'+ item.icon_color, borderColor:'#'+item.icon_color}">{{item.icon_name}}</span>
                <span>{{item.description}}(App专享)</span>
              </li>
            </ul>
          </section>
          <section class="activities_shopinfo">
            <header class="activities_title_style"><span>商家公告</span></header>
            <p>{{promotionInfo}}</p>
          </section>
          <svg width="60" height="60" class="close_activities" @click="showActivitiesFun">
            <circle cx="30" cy="30" r="25" stroke="#555" stroke-width="1" fill="none"/>
            <line x1="22" y1="38" x2="38" y2="22" style="stroke:#999;stroke-width:2"/>
            <line x1="22" y1="22" x2="38" y2="38" style="stroke:#999;stroke-width:2"/>
          </svg>
        </section>
      </transition>
      <!--列表-->
      <section class="change_show_type" ref="chooseType">
        <!--导航-->
        <div>
          <span :class="{activity_show:changeShowType == 'food'}" @click="changeShowType='food'">商品</span>
        </div>
        <div>
          <span :class="{activity_show:changeShowType == 'rating'}" @click="changeShowType='rating'">评价</span>
        </div>
      </section>
      <!--列表项--商品-->
      <transition name="fade-choose">
        <section v-show="changeShowType == 'food'" class="food_container">
          <section class="menu_container">
            <section class="menu_left" id="wrapper_menu" ref="wrapperMenu">
              <ul>
                <li v-for="(item, index) in menuList" :key="index" class="menu_left_li" :class="{activity_menu:index == menuIndex}" @click="chooseMenu(index)">
                  <img :src="getImgPaths(item.icon_url)" v-if="item.icon_url">
                  <span>{{item.name}}</span>
                  <span class="category_num" v-if="categoryNum[index]&&item.type==1">{{categoryNum[index]}}</span>
                </li>
              </ul>
            </section>
            <section class='menu_right' ref="menuFoodList">
              <ul>
                <li v-for="(item, index) in menuList" :key="index">
                  <!--热销榜-->
                  <header class="menu_detail_header">
                    <section class="menu_detail_header_left">
                      <strong class="menu_item_title">{{item.name}}</strong>
                      <span class="menu_item_description">{{item.description}}</span>
                    </section>
                    <span class="menu_detail_header_right" @click="showTitleDetail(index)"></span>
                    <p class="description_tip" v-if="index == TitleDetailIndex">
                      <span>{{item.name}}</span>
                      {{item.description}}
                    </p>
                  </header>
                  <!--列表-->
                  <section v-for="(foods, foodindex) in item.foods" :key="foodindex" class="menu_detail_list">
                    <router-link :to="{path: 'shop/foodDetail', query:{image_path:foods.image_path, description: foods.description, month_sales: foods.month_sales, name: foods.name, rating: foods.rating, rating_count: foods.rating_count, satisfy_rate: foods.satisfy_rate, foods, shopId}}" tag="div" class="menu_detail_link">
                      <section class="menu_food_img">
                        <img :src="imgBaseUrl + foods.image_path">
                      </section>
                      <section class="menu_food_description">
                        <h3 class="food_description_head">
                          <strong class="description_foodname">{{foods.name}}</strong>
                          <ul class="attributes_ul" v-if="foods.attributes.length">
                            <li v-for="(attribute, foodindex) in foods.attributes" :key="foodindex" :style="{color:'#'+attribute.icon_color, borderColor:'#'+attribute.icon_color}" :class="{attribute_new: attribute.icon_name == '新' }">
                              <p  :style="{color:attribute.icon_name == '新'?'#fff':'#'+attribute.icon_color}">{{attribute.icon_name == '新'?'新品':attribute.icon_name}}</p>
                            </li>
                          </ul>
                        </h3>
                        <p class="food_description_content">{{foods.description}}</p>
                        <p class="food_description_sale_rating">
                          <span>月售{{foods.month_sales}}</span>
                          <span>好评率{{foods.satisfy_rate}}%</span>
                        </p>
                        <p v-if="foods.activity" class="food_activity">
                          <span :style="{color:'#'+foods.activity.image_text_color, borderColor:'#'+foods.activity.icon_color}">{{foods.activity.image_text}}</span>
                        </p>
                      </section>
                    </router-link>
                    <footer class="menu_detail_footer">
                    <!--价格-->
                     <section class="food_price">
                       <span>￥</span>
                       <span>{{foods.specfoods[0].price}}</span>
                       <span v-if="foods.specifications.length">起</span>
                     </section>
                    <!--加减button-->
                    <buy-cart :shopId="parseInt(shopId)" :foods='foods' @showChooseList="showChooseList" @showMoveDot="showMoveDotFun" @showReduceTip="showReduceTip"></buy-cart>
                    </footer>
                  </section>
                </li>
              </ul>
            </section>
          </section>
          <!--购物车-->
          <section class="buy_cart_container">
            <section class="cart_icon_num" @click="toggleCartList">
              <div class="cart_icon_container" :class="{cart_icon_activity:totalPrice>0, move_in_cart:receiveInCart}" ref="cartContainer">
                <span class="cart_list_length" v-if="totalNum">{{totalNum}}</span>
                <svg class="cart_icon">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-icon"></use>
                </svg>
              </div>
              <div class="cart_num">
                <div>￥{{totalPrice}}</div>
                <div>配送费￥{{deliveryFee}}</div>
              </div>
            </section>
            <section class="gotopay" :class="{gotopay_acitvity:minimumOrderAmount <= 0}">
              <span class="gotopay_button_style" v-if="minimumOrderAmount > 0">还差¥{{minimumOrderAmount}}起送</span>
              <router-link :to="{path:'/confirmOrder', query:{geohash, shopId}}" class="gotopay_button_style" v-else>去结算</router-link>
            </section>
          </section>
          <!--购物车详情-->
          <transition name="toggle-cart">
            <section class="cart_food_list" v-show="showCartList&&cartFoodList.length">
              <header>
               <h4>购物车</h4>
               <div @click='clearCart'>
                 <svg>
                   <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-remove"></use>
                 </svg>
                 <span>清空</span>
               </div>
              </header>
              <section class="cart_food_details" id="cartFood">
                <ul>
                  <li v-for="(item,index) in cartFoodList" :key="index" class="cart_food_li">
                    <div class="cart_list_num">
                      <p class="ellipsis">{{item.name}}</p>
                      <p class="ellipsis">{{item.specs}}</p>
                    </div>
                    <div class="cart_list_price">
                      <span>￥</span>
                      <span>{{item.price}}</span>
                    </div>
                    <section class="cart_list_control">
                      <span @click="removeOutCart(item.category_id,item.item_id,item.food_id,item.name,item.price,item.specs)">
                        <svg>
                          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
                        </svg>
                      </span>
                      <span class="cart_num">{{item.num}}</span>
                      <svg class="cart_add" @click="addToCart(item.category_id, item.item_id, item.food_id, item.name, item.price, item.specs)">
                        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
                      [</svg>
                    </section>
                  </li>
                </ul>
              </section>
            </section>
          </transition>
        </section>
      </transition>
      <!--列表项--评价-->
      <transition name="fade-choose">
        <section class="rating_container" id="ratingContainer" v-show="changeShowType == 'rating'">
          <section  type="2" v-load-more='loaderMoreRating'>
            <section>
              <header class="rating_header">
                <section class="rating_header_left">
                  <p>{{shopDetailData.rating}}</p>
                  <p>综合评价</p>
                  <p>高于周边商家{{(ratingScoresData.compara_rating*100).toFixed(1)}}%</p>
                </section>
                <section class="rating_header_right">
                  <p>
                    <span>服务态度</span>
                    <rating-star :rating='ratingScoresData.food_score'></rating-star>
                    <span class="rating_num">{{ratingScoresData.service_score.toFixed(1)}}</span>
                  </p>
                  <p>
                    <span>菜品评价</span>
                    <rating-star :rating='ratingScoresData.food_score'></rating-star>
                    <span class="rating_num">{{ratingScoresData.food_score.toFixed(1)}}</span>
                  </p>
                  <p>
                    <span>送达时间</span>
                    <span class="delivery_time">{{ratingScoresData.order_lead_time}}分钟</span>
                  </p>
                </section>
              </header>
              <!--评价tag列表-->
              <ul class="tag_list_ul">
                <li v-for="(item, index) in ratingTagsList" :key="index" :class="{unsatisfied: item.unsatisfied, tagActivity: ratingTageIndex == index}" @click="changeTgeIndex(index, item.name)">{{item.name}}({{item.count}})</li>
              </ul>
              <!--评价分类列表-->
              <ul class="rating_list_ul">
                <li v-for="(item, index) in ratingList" :key="index" class="rating_list_li">
                  <img :src="getImgPaths(item.avatar)" class="user_avatar">
                  <section class="rating_list_details">
                    <header>
                      <section class="username_star">
                        <p class="username">{{item.username}}</p>
                        <p class="star_desc">
                          <rating-star :rating='item.rating_star'></rating-star>
                          <span class="time_spent_desc">{{item.time_spent_desc}}</span>
                        </p>
                      </section>
                      <time class="rated_at">{{item.rated_at}}</time>
                    </header>
                    <ul class="food_img_ul">
                      <li v-for="(item, index) in item.item_ratings" :key="index">
                        <img :src="getImgPaths(item.image_hash)" v-if="item.image_hash">
                      </li>
                    </ul>
                    <ul class="food_name_ul">
                      <li v-for="(item, index) in item.item_ratings" :key="index" class="ellipsis">{{item.food_name}}</li>
                    </ul>
                  </section>
                </li>
              </ul>
            </section>
          </section>
        </section>
      </transition>
    </section>
    <!-- 规格选框-->
    <section>
      <transition name="fade">
        <div class="specs_cover" @click="showChooseList" v-if="showSpecs"></div>
      </transition>
      <transition name="fadeBounce">
        <div class="specs_list" v-if="showSpecs">
          <header class="specs_list_header">
            <h4 class="ellipsis">{{choosedFoods.name}}</h4>
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" version="1.1" class="specs_cancel" @click="showChooseList">
              <line x1="0" y1="0" x2="16" y2="16"  stroke="#666" stroke-width="1.2"/>
              <line x1="0" y1="16" x2="16" y2="0"  stroke="#666" stroke-width="1.2"/>
            </svg>
          </header>
          <section class="specs_details">
            <h5 class="specs_details_title">{{choosedFoods.specifications[0].name}}</h5>
            <ul>
              <li v-for="(item, itemIndex) in choosedFoods.specifications[0].values" :class="{specs_activity: itemIndex == specsIndex}" @click="chooseSpecs(itemIndex)" :key="item.id">{{item}}</li>
            </ul>
          </section>
          <footer class="specs_footer">
            <div class="specs_price">
              <span>¥</span>
              <span>{{choosedFoods.specfoods[specsIndex].price}}</span>
            </div>
            <div class="specs_addto_cart" @click="addSpecs(choosedFoods.category_id, choosedFoods.item_id, choosedFoods.specfoods[specsIndex].food_id, choosedFoods.specfoods[specsIndex].name, choosedFoods.specfoods[specsIndex].price, choosedFoods.specifications[0].values[specsIndex], choosedFoods.specfoods[specsIndex].packing_fee, choosedFoods.specfoods[specsIndex].sku_id, choosedFoods.specfoods[specsIndex].stock)">
              加入购物车
            </div>
          </footer>
        </div>
      </transition>
    </section>
    <!--单击多规格旁边的减号。弹出来提示框-->
    <transition name="fade">
      <p class="show_delete_tip" v-if="showDeleteTip">多规格商品只能去购物车删除哦</p>
    </transition>
    <!--加号运动-->
    <transition appear @after-appear='afterEnter' @before-appear='beforeEnter' v-for="(item, index) in showMoveDot" v-if="item" :key="index">
      <span class="move_dot" >
        <svg class="move_liner">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
        </svg>
      </span>
    </transition>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import ratingStar from 'components/base/rating-star/rating-star'
import buyCart from 'components/base/buy-cart/buy-cart'
import loading from 'components/base/loading/loading'
import {imgBaseUrl} from 'config/env'
import {mapGetters, mapMutations} from 'vuex'
import {shopDetails, msiteAddress, foodMenu, ratingScores, ratingTags, getRatingList} from 'service/getData'
import BScroll from 'better-scroll'
import {loadMore, getImgPath} from 'common/js/mixin'

export default {
  mixins: [loadMore, getImgPath],
  data () {
    return {
      geohash: '', // geohash位置信息
      shopId: 0, // 商店id值
      imgBaseUrl,
      shopDetailData: null, // 商铺详情
      showActivities: false, // 是否显示活动详情
      showLoading: true, // 显示加载动画
      changeShowType: 'food', // 切换显示商品或者评价
      menuList: [], // 食品列表
      categoryNum: [], // 商品类型右上角已加入购物车的数量(menu列表右上角小红圈里的值)
      TitleDetailIndex: null, // 点击展示列表头部详情
      menuIndex: 0, // 已选菜单索引值，默认为0
      ratingScoresData: null, // 评价总体分数
      ratingTagsList: null, // 评价分类列表
      ratingTageIndex: 0, // 评价分类索引
      ratingList: null, // 评价列表
      showSpecs: false, // 控制显示食品规格
      choosedFoods: null, // 当前选中食品数据
      totalPrice: 0, // 总共价格
      chooseFoods: null, // 当前选中的规格索引值
      specsIndex: 0, // 当前选中的规格索引值
      showMoveDot: [], // 控制下落小圆点显示隐藏
      elLeft: 0, // 当前点击加按钮在网页中的绝对top值
      elBottom: 0, // 当前点击加按钮在网页中的绝对left值
      showCartList: false, // 显示购物车列表
      showDeleteTip: false, // 多规格商品点击减按钮，弹出提示框
      foodScroll: false, // 食品列表scroll
      menuIndexChange: true,
      shopListTop: [], // 商品列表的高度集合
      receiveInCart: false, // 购物车组件下落的圆点是否到达目标位置
      cartFoodList: [], // 购物车商品列表
      loadRatings: false, // 加载更多评论是显示加载组件
      windowHeight: null, // 屏幕的高度
      preventRepeatRequest: false // 防止多次触发数据请求
    }
  },
  components: {
    ratingStar,
    loading,
    buyCart
  },
  created () {
    this.geohash = this.$route.query.geohash
    this.shopId = this.$route.query.id
    this.INIT_BUYCART()
  },
  mounted () {
    this.initData()
    this.windowHeight = window.innerHeight
  },
  computed: {
    ...mapGetters([
      'latitude', 'longitude', 'cartList'
    ]),
    // 配送费
    deliveryFee () {
      if (this.shopDetailData) {
        return this.shopDetailData.float_delivery_fee
      } else {
        return null
      }
    },
    // 还差多少元起送,为负数时显示去结算按钮
    minimumOrderAmount () {
      if (this.shopDetailData) {
        return this.shopDetailData.float_minimum_order_amount - this.totalPrice
      } else {
        return null
      }
    },
    // 公告内容
    promotionInfo () {
      return this.shopDetailData.promotion_info || '欢迎光临，用餐高峰期请提前下单，谢谢。'
    },
    // 购物车中总商品的数量
    totalNum () {
      let num = 0
      this.cartFoodList.forEach(item => {
        num += item.num
      })
      return num
    },
    // 当前商店购物信息
    shopCart () {
      return {...this.cartList[this.shopId]} // mark
    }
  },
  methods: {
    ...mapMutations([
      'RECORD_ADDRESS', 'ADD_CART', 'CLEAR_CART', 'INIT_BUYCART', 'REDUCE_CART', 'RECORD_SHOPDETAIL'
    ]),
    // 初始化时获取基本数据
    async initData () {
      if (!this.latitude) {
        // 获取位置信息
        let res = await msiteAddress(this.geohash)
        // 记录当前经度纬度进入vuex
        this.RECORD_ADDRESS(res)
      }
      // 获取商铺信息
      this.shopDetailData = await shopDetails(this.shopId, this.latitude, this.longitude)
      // 获取商铺食品列表
      this.menuList = await foodMenu(this.shopId)
      // 商铺评论详情
      this.ratingScoresData = await ratingScores(this.shopId)
      // 评论tag列表
      this.ratingTagsList = await ratingTags(this.shopId)
      this.RECORD_SHOPDETAIL(this.shopDetailData) // 将商铺信息存入vuex
      // 评论list列表
      this.ratingList = await getRatingList(this.shopId, this.ratingOffset)
      // 隐藏加载动画
      this.hideLoading()
    },
    // 隐藏动画
    hideLoading () {
      this.showLoading = false
    },
    goback () {
      this.$router.go(-1)
    },
    // 获取食品列表的高度，存入shoplistTop
    getFoodListHeight () {
      const listContainer = this.$refs.menuFoodList
      const listArr = Array.from(listContainer.children[0].children) // from函数用来将其他对象转换成数
      listArr.forEach((item, index) => {
        this.shopListTop[index] = item.offsetTop
      })
      this.listenScroll(listContainer)
    },
    // 当滑动食品列表时，监听其scrollTop值来设置对应的食品列表标题的样式
    listenScroll (element) { // 给食品列表添加滚动事件
      this.foodScroll = new BScroll(element, {
        probeType: 3,
        deceleration: 0.001,
        bounce: false,
        swipeTime: 2000,
        click: true
      })
      const wrapperMenu = new BScroll('#wrapper_menu', { // 给分类menu添加滚动事件
        click: true
      })
      const wrapMenuHeight = this.$refs.wrapperMenu.clientHeight // 左边menu的长度
      this.foodScroll.on('scroll', (pos) => { // 监听foodScroll事件的scroll
        if (!this.$refs.wrapperMenu) {
          return
        }
        this.shopListTop.forEach((item, index) => {
          if (this.menuIndexChange && Math.abs(Math.round(pos.y)) >= item) {
            this.menuIndex = index
            const menuList = this.$refs.wrapperMenu.querySelectorAll('.activity_menu') // 取到class名为这个的元素合集
            const el = menuList[0]
            wrapperMenu.scrollToElement(el, 800, 0, -(wrapMenuHeight / 2 - 50)) // 元素,时间,x,y,方式
          }
        })
      })
    },
    /**
    * 初始化和shopCart变化时，重新获取购物车改变过的数据，赋值 categoryNum，totalPrice，cartFoodList，整个数据流是自上而下的形式，所有的购物车数据都交给vuex统一管理，包括购物车组件中自身的商品数量，使整个数据流更加清晰
    */
    initCategoryNum () {
      let newArr = []
      let cartFoodNum = 0 // 购物车商品数量
      this.totalPrice = 0 // 总价
      this.cartFoodList = [] // 购物车商品列表
      this.menuList.forEach((item, index) => {
        if (this.shopCart && this.shopCart[item.foods[0].category_id]) {
          let num = 0
          Object.keys(this.shopCart[item.foods[0].category_id]).forEach(itemid => {
            Object.keys(this.shopCart[item.foods[0].category_id][itemid]).forEach(foodid => {
              let foodItem = this.shopCart[item.foods[0].category_id][itemid][foodid]
              num += foodItem.num
              if (item.type === 1) {
                this.totalPrice += foodItem.num * foodItem.price
                if (foodItem.num > 0) {
                  this.cartFoodList[cartFoodNum] = {}
                  this.cartFoodList[cartFoodNum].category_id = item.foods[0].category_id
                  this.cartFoodList[cartFoodNum].item_id = itemid
                  this.cartFoodList[cartFoodNum].food_id = foodid
                  this.cartFoodList[cartFoodNum].num = foodItem.num
                  this.cartFoodList[cartFoodNum].price = foodItem.price
                  this.cartFoodList[cartFoodNum].name = foodItem.name
                  this.cartFoodList[cartFoodNum].specs = foodItem.specs
                  cartFoodNum++
                }
              }
            })
          })
          newArr[index] = num
        } else {
          newArr[index] = 0
        }
      })
      this.totalPrice = this.totalPrice.toFixed(2)
      this.categoryNum = [...newArr]
    },
    // 控制活动详情页的显示隐藏
    showActivitiesFun () {
      this.showActivities = !this.showActivities
    },
    // 点击省略号，展示与隐藏详情
    showTitleDetail (index) {
      if (this.TitleDetailIndex === index) {
        this.TitleDetailIndex = null
      } else {
        this.TitleDetailIndex = index
      }
    },
    // 点击左侧食品列表标题，相应列表移动到最顶层
    chooseMenu (index) {
      this.menuIndex = index
      // menuIndexChange解决运动时listenScroll依然监听的bug
      this.menuIndexChange = false
      this.foodScroll.scrollTo(0, -this.shopListTop[index], 400)
      this.foodScroll.on('scrollEnd', () => {
        this.menuIndexChange = true
      })
    },
    // 点击列表项获取不同类型的评论列表
    async changeTgeIndex (index, name) {
      this.ratingTageIndex = index
      this.ratingOffset = 0
      this.ratingTagName = name
      let res = await getRatingList(this.shopId, this.ratingOffset, name)
      this.ratingList = [...res]
      this.$nextTick(() => {
        this.ratingScroll.refresh()
      })
    },
    // 加入购物车，所需7个参数，商铺id，食品分类id，食品id，食品规格id，食品名字，食品价格，食品规格
    /* eslint-disable */
    addToCart (categoryId, itemId, foodId, name, price, specs) {
      this.ADD_CART({
        shopid: this.shopId,
        categoryId,
        itemId,
        foodId,
        name,
        price,
        specs
      })
    },
    // 移出购物车,
    removeOutCart (categoryId, itemId, foodId, name, price, specs) {
      this.REDUCE_CART({
        shopid: this.shopId,
        categoryId,
        itemId,
        foodId,
        name,
        price,
        specs
      })
    },
    /* eslint-disable */
    // 接收buy-cart传过来的显示规格事件
    showChooseList (foods) {
      if (foods) {
        this.choosedFoods = foods
      }
      this.showSpecs = !this.showSpecs
      this.specsIndex = 0
    },
    // 记录当前所选规格的索引值
    chooseSpecs (index) {
      this.specsIndex = index
    },
    // 接收buy-cart传过来的显示下落圆球的事件
    showMoveDotFun (showMoveDot, elLeft, elBottom) {
      this.showMoveDot = [...this.showMoveDot, ...showMoveDot]
      this.elLeft = elLeft
      this.elBottom = elBottom
    },
    beforeEnter (el) {
      el.style.transform = `translate3d(0, ${37 + this.elBottom - this.windowHeight}px, 0)`
      el.children[0].style.transform = `translte3d(${this.elLeft - 30}px, 0, 0)`
      el.children[0].style.opacity = 0
    },
    afterEnter (el) {
      el.style.transform = `translate3d(0, 0, 0)`
      el.children[0].style.transform = `translate#d(0, 0, 0)`
      el.style.transition = `transform .55s cubic-bezier(.3, -.25, .7, -.15)`
      el.children[0].style.transition = 'transform .55s linear'
      this.showMoveDot = this.showMoveDot.map(item => false)
      el.children[0].style.opacity = 1
      el.children[0].addEventListener('transitionend', () => {
        this.listenInCart()
      })
      el.children[0].addEventListener('webkitAnimationEnd', () => {
        this.listenInCart()
      })
    },
    // 多规格商品加入购物车
    addSpecs (categoryId, itemId, foodId, name, price, specs, packingFee, skuId, stock) {
      this.ADD_CART({
        shopid: this.shopId,
        categoryId,
        itemId,
        foodId,
        name,
        price,
        specs,
        packingFee,
        skuId,
        stock
      })
      this.showChooseList() // 执行完操作后。对现有的状态取反
    },
    // 显示提示，无法减去商品
    showReduceTip () {
      this.showDeleteTip = true
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.showDeleteTip = false
      }, 3000)
    },
    // 监听圆点是否进入购物车
    listenInCart () {
      if (!this.receiveInCart) {
        this.receiveInCart = true
        this.$refs.cartContainer.addEventListener('animationend', () => {
          this.receiveIncart = false
        })
        this.$refs.cartContainer.addEventListener('webkitAnimationEnd', () => {
          this.receiveInCart = false
        })
      }
    },
    // 控制购物车列表是否显示
    toggleCartList () {
      /* eslint-disable */
      this.cartFoodList.length ? this.showCartList = !this.showCartList : true
      /* eslint-disable */
    },
    // 清除购物车
    clearCart () {
      this.toggleCartList()
      this.CLEAR_CART(this.shopId)
    },
    // 加载更多评论
    async loaderMoreRating () {
      if (this.preventRepeatRequest) {
        return
      }
      this.loadRatings = true
      this.preventRepeatRequest = true
      this.ratingOffset += 10
      let ratingDate = await getRatingList(this.shopId, this.ratingOffset, this.ratingTagName)
      this.ratingList = [...this.ratingList, ...ratingDate]
      this.loadRatings = false
      if (ratingDate.length >= 10) {
        this.preventRepeatRequest = false
      }
    }
  },
  watch: {
    // showLoading变化时说明组件已经获取初始化数据，在下一帧nextTick进行后续操作
    showLoading (value) {
      if (!value) {
        this.$nextTick(() => {
          this.getFoodListHeight() // 获取列表高度。为scroll做准备
          this.initCategoryNum() // 获取购物车基础数据
        })
      }
    },
    // 商品，评论切换状态
    changeShowType (value) {
      if (value === 'rating') {
        this.$nextTick(() => {
          this.ratingScroll = new BScroll('#ratingContainer', {
            probeType: 3,
            deceleration: 0.003,
            bounce: false,
            swipeTime: 2000,
            click: true
          })
          this.ratingScroll.on('scroll', (pos) => {
            if (Math.abs(Math.round(pos.y)) >= Math.abs(Math.round(this.ratingScroll.maxScrollY))) {
              this.loaderMoreRating()
              this.ratingScroll.refresh()
            }
          })
        })
      }
    },
    // 
    shopCart () {
      this.initCategoryNum()
    },
    // 购物车列表发生变化，没有商铺时。隐藏
    cartFoodList (value) {
      if (!value.length) {
        this.showCartList = false
      }
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.shop
  .shop_container
    display: flex
    flex-direction: column
    position: absolute
    right:0
    left:0
    height:100%
    .goback
      position: fixed
      top:0
      left:0
      width:100%
      height:100px
      z-index:11
      padding-top: 10px
      padding:10px
      svg
        width:50px
    .shop_detail_header
      overflow: hidden
      position: relative
      .header_cover_img
        width:100%
        position: absolute
        top:0
        left:0
        z-index:9
        filter:blur(10px)
      .description_header
        position: relative
        z-index:10
        background-color:rgba(119,103,137,.43)
        padding: 10px
        width:100%
        overflow:hidden
        .description_top
          display:flex
          .description_left
            margin-right:10px
            img
              wh(150px, 150px)
              display: block
              border-radius: 2px
          .description_right
            flex:1
            .description_title
              sc(30px, #fff)
              font-weight:bold
              width:100%
              margin-bottom: 15px
            .description_text
              sc(20px, #fff)
              margin-bottom:15px
            .description_promotion
              sc(20px, #fff)
              width: 600px
          .description_arrow
            ct()
            right: 30px
            z-index: 11
      .description_footer
        fj()
        margin-top: 20px
        margin-right: 40px
        p
          sc(20px, #fff)
          span
            color:#fff
          .tip_icon
            padding: 0 10px
            border:1px solid #fff
            border-radius: 5px
            font-size: 26px
            display: inline-block
        .ellipsis
          width: 83%
        .footer_arrow
          wh(22px, 22px)
          position: absolute
          right: 10px
    .activities_details
      position: fixed
      top:0
      left:0
      right:0
      bottom:0
      background-color:#262626
      z-index:200
      padding:50px
      .fade-enter-active, .fade-leave-active
        transition: opacity .5s
      .fade-enter, .fade-leave-active
        opacity: 0
      .activities_shoptitle
        text-align:center
        sc(40px, #fff)
      .activities_ratingstar
        display: flex
        justify-content:center
        transform:scale(1)
        margin-top:100px
      .activities_list
        margin-top:30px
        margin-bottom:20px
        sc(20px, #fff)
        .activities_title_style
          text-align:center
          margin-bottom: 30px
          span
            sc(20px, #fff)
            border:1px solid #555
            padding:10px 20px
            border-radius: 6px
        li
          margin-bottom: 20px
          .activities_icon
            padding:0 10px
            display:inline-block
            border:2px solid #fff
            border-radius:2px
          span
            color:#fff
            line-height:40px
      .activities_shopinfo
        .activities_title_style
          text-align:center
          margin-bottom: 30px
          span
            sc(20px, #fff)
            border:1px solid #555
            padding:10px 20px
            border-radius: 6px
        p
          line-height: 80px
          sc(20px, #fff)
      .close_activities
        position: absolute
        bottom:50px
        cl()
    .change_show_type
      display: flex
      background-color:#fff
      padding: 20px 0 40px 0
      border-bottom:1px solid #ebebeb
      div
        flex:1
        text-align:center
        span
          sc(30px, #666)
          padding: 20px 10px
          border-bottom:3px solid #fff
        .activity_show
          color:#3190e8
          border-color:#3190e8
    .food_container
      display: flex
      flex:1
      padding-bottom: 20px
      .menu_container
        display: flex
        flex:1
        overflow-y:hidden
        position: relative
        .menu_left
          width:200px
          .menu_left_li
            padding: 40px 20px
            border-bottom:1px solid #ededed
            box-sizing:border-box
            border-left:1px solid #f8f8f8
            position: relative
            img
              wh(24px, 30px)
            span
              sc(32px, #666)
            .category_num
              position: absolute
              top:5px
              right:5px
              background-color:#ff461d
              line-height:30px
              text-align:center
              border-radius: 50%
              border:1px solid #ff461d
              min-width: 30px
              height:30px
              sc(20px, #fff)
              font-family: Helvetica Neue,Tahoma,Arial
          .activity_menu
            border-left:3px solid #3190e8
            background-color:#fff
            span:nth-of-type(1)
              font-weight:bold
        .menu_right
          flex: 4
          overflow-y: auto
          .menu_detail_header
            width: 100%
            padding: 20px
            position: relative
            fj()
            align-items:center
            .menu_detail_header_left
              width: 560px
              white-space:nowrap
              overflow:hidden
              .menu_item_title
                sc(30px, #666)
                font-weight:bold
              .menu_item_description
                sc(20px, #999)
                width:30%
                overflow:hidden
            .menu_detail_header_right
              wh(15px, 25px)
              display:block
              background-size:100% 100px
              background-position: left center
              bis('../../../images/icon_point.png')
            .description_tip
              background-color:#39373a
              opacity: 0.95
              sc(20px, #fff)
              position: absolute
              top:60px
              z-index:14
              width:300px
              right:20px
              padding:20px 10px
              border:1px
              border-radius:5px
              span
                color:#fff
                line-height:40px
                font-size:20px
            .description_tip::after
              content:''
              position:absolute
              wh(30px, 30px)
              background-color:#39373a
              top:-20px
              right:20px
              transform:rotate(-45deg) translateY(30px)
          .menu_detail_list
            background-color:#fff
            padding:20px 10px
            border-bottom:1px solid #f8f8f8
            position: relative
            overflow:hidden
            .menu_detail_link
              display:flex
              .menu_food_img
                margin-right:20px
                img
                  wh(100px, 100px)
                  display:block
              .menu_food_description
                width:100%
                .food_description_head
                  fj()
                  margin-bottom:20px
                  .description_foodname
                    sc(30px, #333)
                  .attributes_ul
                    display: flex
                    li
                      font-size: 20px
                      height: 50px
                      padding: 5px
                      border:1px solid #666
                      border-radius: 4px
                      margin-right:20px
                      transform: scale(.8)
                      p
                        white-space: nowrap
                    .attribute_new
                      position: absolute
                      top: 0
                      left: 0
                      background-color:#4cd964
                      wh(200px, 200px)
                      display: flex
                      align-items: flex-end
                      transform: rotate(-45deg) translate(-0px,-195px)
                      border:none
                      border-radius:0
                      p
                        sc(20px, #fff)
                        text-align:center
                        flex:1
            .menu_detail_footer
              margin-left: 120px
              font-size:0
              margin-top:20px
              fj()
              .food_price
                span
                  font-family:'Helvetica Neue',Tahoma,Arial
                span:nth-of-type(1)
                  sc(20px, #f60)
                  font-weight: bold
                  margin-right:4px
                span:nth-of-type(2)
                  sc(24px, #f60)
                  font-weight: bold
                  margin-right:20px
                span:nth-of-type(3)
                  sc(20px, #666)
      .buy_cart_container
        position: absolute
        background-color:#3d3d3f
        bottom:0
        left:0
        z-index:13
        display:flex
        wh(100%, 100px)
        .cart_icon_num
          flex:1
          .cart_icon_container
            display:flex
            background-color:#3d3d3f
            position: absolute
            padding:15px
            border:10px solid #444
            border-radius:50%
            left:20px
            top:-30px
            .cart_list_length
              position: absolute
              top:-10px
              right:-5px
              background-color:#ff461d
              line-height:35px
              border-radius:50%
              border:1px solid #ff461d
              min-width:35px
              height:35px
              sc(20px, #fff)
              text-align:center
              font-family: Helvetica Neue,Tahoma,Arial
            .cart_icon
              wh(60px, 60px)
          .cart_icon_activity
            background-color:#3190e8
          .move_in_cart
            animation:mymove .5s ease-in-out
          .cart_num
            ct()
            left:130px
            div
              color:#fff
            div:nth-of-type(1)
              font-size:30px
              font-weight:bold
              margin-bottom:10px
            div:nth-of-type(2)
              font-size:20px
        .gotopay
          position: absolute
          right:0
          background-color:#535356
          wh(240px, 100%)
          text-align:center
          display:flex
          align-items:center
          justify-content:center
          .gotopay_button_style
            sc(34px, #fff)
            font-weight:bold
        .gotopay_acitvity
          background-color:#4cd964
      .cart_food_list
        position: fixed
        width:100%
        padding-bottom:110px
        z-index:12
        bottom:0
        left:0
        background-color:#fff
        header
          fj()
          align-items:center
          padding:20px 30px
          background-color:#eceff1
          svg
            wh(30px, 30px)
            vertical-align:middle
          h4
            sc(30px, #666)
          .clear_cart
            sc(20px, #666)
        .cart_food_details
          background-color:#fff
          max-height:380px
          overflow-y: auto
          .cart_food_li
            fj()
            padding:20px 30px
            .cart_list_num
              width:55%
              p:nth-of-type(1)
                sc(30px, #666)
                font-weight: bold
              p:nth-of-type(2)
                sc(20px,#666)
            .cart_list_price
              font-size:0
              span:nth-of-type(1)
                sc(30px, #f60)
                font-family: Helvetica Neue,Tahoma
              span:nth-of-type(2)
                sc(30px,#f60)
                font-family:Helvetica Neue,Tahoma
                font-weight:bold
            .cart_list_control
              display:flex
              align-items:center
              span
                display:flex
                align-items:center
                justify-content:center
              svg
                wh(50px, 50px)
                fill:#3190e8
              .specs_reduce_icon
                fill:#999
              .cart_num
                sc(20px,#666)
                min-width:50px
                text-align:center
                font-family: Helvetica Neue,Tahoma
    .rating_container
      flex: 1
      overflow-y: hidden
      p, span, li, time
        font-family: Helvetica Neue,Tahoma,Arial
      .rating_header
        display: flex
        background-color:#fff
        padding:20px 10px
        margin-bottom:20px
        .rating_header_left
          flex:3
          text-align:center
          p:nth-of-type(1)
            sc(50px, #f60)
          p:nth-of-type(2)
            sc(30px, #666)
            margin-bottom:10px
          p:nth-of-type(3)
            sc(20px, #999)
        .rating_header_right
          flex:4
          p
            font-size:30px
            line-height:60px
            display:flex
            align-items: center
            justify-content: flex-start
            span:nth-of-type(1)
              color:#666
              margin-right:20px
            .rating_num
              width:30px
              sc(20px, #f60)
            .delivery_time
              sc(14px, #999)
      .tag_list_ul
        display: flex
        flex-wrap:wrap
        background-color:#fff
        padding:10px
        li
          sc(20px, #6d7885)
          padding:20px
          background-color:#ebf5ff
          border-radius:4px
          border:1px
          margin:0 20px 10px 0
        .unsatisfied
          background-color:#f5f5f5
          color:#aaa
        .tagActivity
          background-color:#3190e8
          color:#fff
      .rating_list_ul
        background-color:#fff
        padding:0 10px
        .rating_list_li
          border-top:1px solid #f1f1f1
          display:flex
          padding:10px 0
          .user_avatar
            wh(80px, 80px)
            border:2px
            border-radius:50%
            margin-right:30px
          .rating_list_details
            flex:1
            header
              display:flex
              flex:1
              justify-content: space-between
              margin-bottom:20px
              .username_star
                sc(20px, #666)
                .username
                  color:#666
                  margin-bottom:20px
                .star_desc
                  display:flex
                  align-items:center
                  .time_spent_desc
                    sc(20px, #666)
                    margin-left:20px
            .food_img_ul
              display: flex
              flex-wrap:wrap
              margin-bottom:20px
              li
                img
                  wh(200px, 200px)
                  margin-right: 20px
                  display: block
            .food_name_ul
              display: flex
              flex-wrap: wrap
              li
                sc(24px, #999)
                width: 100px
                padding:10px
                border:1px solid #ebebeb
                border-radius:2px
                margin-right:10px
                margin-bottom:4px
  .specs_cover
    position: fixed
    top:0
    left:0
    right:0
    bottom:0
    background-color:rgba(0,0,0,.4)
    z-index:17
  .specs_list
    position: fixed
    top:35%
    left:15%
    width:70%
    background-color:#fff
    z-index:18
    border:1px
    border-radius:2px
    .specs_list_header
      h4
        sc(30px, #222)
        font-weight:normal
        text-align:center
        padding:30px
      .specs_cancel
        position: absolute
        right:20px
        top:20px
    .specs_details
      padding:10px
      .specs_details_title
        sc(30px, #666)
      ul
        display: flex
        flex-wrap: wrap
        padding:10px 0
        li
          font-size:30px
          padding:14px 24px
          border:1px solid #ddd
          border-radius:6px
          margin-right:10px
          margin-bottom:10px
        .specs_activity
          border-color:#3199e8
          color:#3199e8
    .specs_footer
      fj()
      align-items: center
      background-color:#f9f9f9
      padding:20px
      border:1px
      border-bottom-left-radius:2px
      border-bottom-right-radius:2px
      .specs_price
        span
          color:#ff6000
        span:nth-of-type(1)
          font-size:26px
        span:nth-of-type(2)
          font-size: 26px
          font-weight:bold
          font-family: Helvetica Neue,Tahoma
      .specs_addto_cart
        wh(200px, 80px)
        background-color:#3199e8
        border:1px
        border-radius:2px
        sc(30px, #fff)
        text-align:center
        line-height:80px
  .show_delete_tip
    position: fixed
    top:50%
    left:15%
    width:70%
    transform: translateY(-50%)
    background-color:rgba(0,0,0,.8)
    z-index: 18
    sc(30px, #fff)
    text-align:center
    padding:30px 0
    border:1px
    border-radius:6px
  .move_dot
    position: fixed
    bottom:30px
    left:30px
    svg
      wh(30px, 30px)
      fill:#3190e8
  .router-slid-enter-active, .router-slid-leave-active
    transition: all .4s
  .router-slid-enter, .router-slid-leave-active
    transform: translate3d(100px, 0, 0)
    opacity: 0
  .toggle-cart-enter-active, .toggle-cart-leave-active
    transition: all .3s ease-out
  .toggle-cart-enter, .toggle-cart-leave-active
    transform: translateY(100%)
  .fade-choose-enter-active, .fade-choose-leave-active
    transition: opacity .5s
  .fade-choose-leave, .fade-choose-leave-active
    display: none
  .fade-choose-enter, .fade-choose-leave-active
    opacity: 0
  @keyframes mymove
    0%
      transform: scale(1)
    25%
      transform: scale(.8)
    50%
      transform: scale(1.1)
    75%
      transform: scale(.9)
    100%
      transform: scale(1)
  @-moz-keyframes mymove
    0%
      transform: scale(1)
    25%
      transform: scale(.8)
    50%
      transform: scale(1.1)
    75%
      transform: scale(.9)
    100%
      transform: scale(1)
  @-webkit-keyframes mymove
    0%
      transform: scale(1)
    25%
      transform: scale(.8)
    50%
      transform: scale(1.1)
    75%
      transform: scale(.9)
    100%
      transform: scale(1)
  @-o-keyframes mymove
    0%
      transform: scale(1)
    25%
      transform: scale(.8)
    50%
      transform: scale(1.1)
    75%
      transform: scale(.9)
    100%
      transform: scale(1)    
</style>
