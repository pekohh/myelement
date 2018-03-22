import * as types from './mutation-types.js'
import {setStore, getStore} from 'config/Util'

export default {
  // 初始化获取用户信息
  [types.GET_USERINFO] (state, userInfo) {
    if (state.userInfo && (state.userInfo.username !== userInfo.username)) {
      return
    }
    if (!state.login) {
      return
    }
    if (!userInfo.message) { // 没有错误信息，则把从数据库里获取的用户信息赋值给state.userInfo
      state.userInfo = {...userInfo}
    } else {
      state.userInfo = null
    }
  },
  // 保存geohash
  [types.SAVE_GEOHASH] (state, geohash) {
    state.geohash = geohash
  },
  // 保存address的经纬度
  [types.RECORD_ADDRESS] (state, {
    latitude,
    longitude
  }) {
    state.latitude = latitude
    state.longitude = longitude
  },
  // 网页初始化时从本地storage缓存获取购物车数据
  [types.INIT_BUYCART] (state) {
    let initCart = getStore('buyCart')
    if (initCart) {
      state.cartList = JSON.parse(initCart)
    }
  },
  // 记录shopDetail列表
  [types.RECORD_SHOPDETAIL] (state, detail) {
    state.shopDetail = detail
  },
  // 加入购物车
  [types.ADD_CART] (state, {
    shopid,
    categoryId,
    itemId,
    foodId,
    name,
    price,
    specs,
    packingFee,
    skuId,
    stock
  }) {
    let cart = state.cartList
    let shop = cart[shopid] = (cart[shopid] || {})
    let category = shop[categoryId] = (shop[categoryId] || {})
    let item = category[itemId] = (category[itemId] || {})
    if (item[foodId]) {
      item[foodId]['num']++ // 说明购物车的商品列表中已经有此商品。则不用添加进去，只把num+1
    } else {
      item[foodId] = {
        'num': 1,
        'id': foodId,
        'name': name,
        'price': price,
        'specs': specs,
        'packing_fee': packingFee,
        'sku_id': skuId,
        'stock': stock
      }
    }
    state.cartList = {...cart}
    // 存入localStorage
    setStore('buyCart', state.cartList)
  },
  // 移出购物车
  [types.REDUCE_CART] (state, {
    shopid,
    categoryId,
    itemId,
    foodId,
    name,
    price,
    specs
  }) {
    let cart = state.cartList
    let shop = (cart[shopid] || {})
    let category = (shop[categoryId] || {})
    let item = (category[itemId] || {})
    if (item && item[foodId]) {
      if (item[foodId]['num'] > 0) {
        item[foodId]['num']--
        state.cartList = {...cart}
        // 存入localStore
        setStore('buyCart', state.cartList)
      } else {
        // 商品数量为0, 则清空当前商品信息
        item[foodId] = null
      }
    }
  },
  // 清空当前商品的购物车信息
  [types.CLEAR_CART] (state, shopid) {
    state.cartList[shopid] = null
    state.cartList = {...state.cartList}
    setStore('buyCart', state.cartList)
  },
  // 记录店铺详情
  [types.RECORD_SHOPDETAIL] (state, detail) {
    state.shopDetail = detail
  },
  // 保存商铺id
  [types.SAVE_SHOPID] (state, shopid) {
    state.shopid = shopid
  },
  // 保存下单后购物id和sig(confirmOrder)
  [types.SAVE_CART_ID_SIG] (state, {
    cartId,
    sig
  }) {
    state.cart_id = cartId
    state.sig = sig
  },
  // 选择的默认地址
  [types.CHOOSE_ADDRESS] (state, {
    address,
    index
  }) {
    state.choosedAddress = address
    state.addressIndex = index
  },
  // 选中的地址
  [types.CHOOSE_SEARCH_ADDRESS] (state, place) {
    state.searchAddress = place
  },
  // 确认订单页添加新的的地址
  [types.CONFIRM_ADDRESS] (state, newAddress) {
    state.newAddress.push(newAddress)
  },
  // ===login记录用户登录信息
  [types.RECORD_USERINFO] (state, info) {
    state.userInfo = info
    state.login = true
    setStore('user_id', info.user_id)
  },
  // 保存图片
  [types.SAVE_AVANDER] (state, imgPath) {
    state.imgPath = imgPath
  },
  // 退出登录
  [types.OUT_LOGIN] (state) {
    state.userInfo = {}
    state.login = false
  },
  // 修改用户名
  [types.RETSET_NAME] (state, username) {
    state.userInfo = Object.assign({}, state.userInfo, {username}) // 对象，替换掉state.userInfo中username的值
  },
  // 用新地址替换旧地址
  [types.SAVE_ADDRESS] (state, newAdress) {
    state.removeAddress = newAdress
  },
  // 保存所选问题标题和详情
  [types.SAVE_QUESTION] (state, question) {
    state.question = {...question}
    setStore('question', question)
  },
  // 记录选择的地址名称
  [types.SAVE_ADDDETAIL] (state, addAddress) {
    state.addAddress = addAddress
  },
  // 用户个人信息地址中增加地址
  [types.ADD_ADDRESS] (state, obj) {
    state.removeAddress = [obj, ...state.removeAddress] // 数组的解构赋值（[{},{}]）
  },
  // 保存订单
  [types.SAVE_ORDER_PARAM] (state, orderParam) {
    state.orderParam = orderParam
  },
  // 保存下单需要验证的返回值
  [types.NEED_VALIDATION] (state, needValidation) {
    state.needValidation = needValidation
  },
  // 下单成功，保存订单返回信息
  [types.ORDER_SUCCESS] (state, order) {
    state.cartPrice = null
    state.orderMessage = order
  },
  // 进入订单详情页面前保存该订单信息
  [types.SAVE_ORDER] (state, orderDetail) {
    state.orderDetail = orderDetail
  },
  // 记录订单页面用户选择的备注。传递给订单确认页面
  [types.CONFIRM_REMARK] (state, {
    remarkText,
    inputText
  }) {
    state.remarkText = remarkText
    state.inputText = inputText
  },
  // 是否开发票
  [types.CONFIRM_INVOICE] (state, invoice) {
    state.invoice = invoice
  }
}
