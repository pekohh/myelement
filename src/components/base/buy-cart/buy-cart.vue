<template>
  <section class="cart_module">
    <!-- 当没有规格的时候.直接 显示加减-->
    <section class='cart_button' v-if="!foods.specifications.length">
      <!--减少-->
      <transition name="showReduce">
        <span v-if="foodNum" @click="removeOutCart(foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock)">
          <svg>
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
          </svg>
        </span>
      </transition>
      <!--选择的个数-->
      <transition name="fade">
        <span class="cart_num" v-if="foodNum">{{foodNum}}</span>
      </transition>
      <!--加-->
      <svg class="add_icon" @touchstart="addToCart(foods.category_id, foods.item_id, foods.specfoods[0].food_id, foods.specfoods[0].name, foods.specfoods[0].price, '', foods.specfoods[0].packing_fee, foods.specfoods[0].sku_id, foods.specfoods[0].stock, $event)">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-add"></use>
      </svg>
    </section>
    <!-- 有规格的时候.显示规格-->
    <section v-else class="choose_specification" >
      <section class="chooose_icon_container">
        <transition name="showReduce">
          <svg class="specs_reduce_icon" v-if="foodNum" @click="showReduceTip">
            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#cart-minus"></use>
          </svg>
        </transition>
        <transition name="fade">
          <span class="cart_num" v-if="foodNum">{{foodNum}}</span>
        </transition>
        <span class="show_chooselist" @click="showChooseList(foods)">选规格</span>
      </section>
    </section>
  </section>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'
export default {
  data () {
    return {
      showMoveDot: [] // 控制下落的小圆点显示隐藏
    }
  },
  created () {
    // console.log(this.foods)
  },
  props: {
    foods: {
      type: Object,
      default: null
    },
    shopId: {
      type: Number,
      default: null
    }
  },
  computed: {
    ...mapGetters([
      'cartList'
    ]),
    // 监听cartList变化，更新当前商铺的购物车信息shopCart，同时返回一个新的对象
    shopCart () {
      return Object.assign({}, this.cartList[this.shopId])
    },
    // shopCart变化的时候重新计算当前商品的数量
    foodNum () {
      /* eslint-disable */
      let category_id = this.foods.category_id
      /* eslint-disable */
      let item_id = this.foods.item_id
      if (this.shopCart && this.shopCart[category_id] && this.shopCart[category_id][item_id]) {
        let num = 0
        Object.values(this.shopCart[category_id][item_id]).forEach((item,index) => {
          num += item.num
        })
        return num
      } else {
        return 0
      }
    }
  },
  methods: {
    ...mapMutations([
      'ADD_CART', 'REDUCE_CART'
    ]),
    // 显示规格列表
    showChooseList (foodScroll) {
      this.$emit('showChooseList', foodScroll)
    },
    // 加入购物车,计算按钮位置
    addToCart (categoryId, itemId, foodId, name, price, specs, packingFee, skuId, stock, event) {
      this.ADD_CART({ // 把要放到购物车的物品的各种参数记录到vuex中
        shopid: this.shopId, // 店铺id
        categoryId, // 分类id
        itemId, // 食品id
        foodId, // 规格id
        name, // 名称
        price, // 价格
        specs, // 规格
        packingFee,
        skuId,
        stock
      })
      let elLeft = event.target.getBoundingClientRect().left
      let elBottom = event.target.getBoundingClientRect().bottom
      this.showMoveDot.push(true)
      this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom) // 向上派发每个小圆球的下落事件
    },
    // 移出购物车
    removeOutCart (categoryId, itemId, foodId, name, price, specs, packingFee, skuId, stock) {
      if (this.foodNum > 0) {
        this.REDUCE_CART({
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
      }
    },
    // 点击多规格商品的减按钮，弹出提示
    showReduceTip () {
      this.$emit('showReduceTip')
    }
  }
}
</script>

<style scoped lang='stylus'>
@import '~common/stylus/mixin'
.cart_module
  svg
    wh(30px, 30px)
    fill:#3190e8
  .cart_button
    display:flex
    align-items: center
    .add_icon
      position: relative
    .cart_num
      sc(20px, #666)
      min-width:50px
      text-align:center
      font-family: Helvetica Neue,Tahoma
  .choose_specification
    .chooose_icon_container
      display:flex
      align-items: center
      .specs_reduce_icon
        fill: #999
      .cart_num
        sc(20px, #666)
        min-width:50px
        text-align:center
        font-family: Helvetica Neue,Tahoma
      .show_chooselist
        display: block
        sc(20px, #fff)
        padding:10px 20px
        background-color:$blue
        border-radius:2px
        border:1px solid $blue
.showReduce-enter-active, .showReduce-leave-active
  transition: all .3s ease-out
.showReduce-enter, .showReduce-leave-active
  opacity:0
  transform: translateX(200px)
.fade-enter-active, .fade-leave-active
  transition: all .3s
.fade-enter, .fade-leave-active
  opacity: 0

</style>
