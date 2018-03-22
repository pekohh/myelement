import fetch from 'config/fetch' // 一个方法
import {getStore} from 'config/Util'

// 获取首页当前城市
export const cityGuess = () => fetch('/v1/cities', {
  type: 'guess'
})

// 获取首页热门城市
export const hotcity = () => fetch('/v1/cities', {
  type: 'hot'
})

// 获取首页所有城市
export const groupcity = () => fetch('/v1/cities', {
  type: 'group'
})

// city获取当前所在城市
export const currentcity = number => fetch('/v1/cities/' + number)

// city根据搜索词获取搜索地址
export const searchplace = (cityid, value) => fetch('/v1/pois', {
  type: 'search',
  city_id: cityid,
  keyword: value
})

// 获取msite页面地址信息
export const msiteAddress = geohash => fetch('/v2/pois/' + geohash)

// 获取msite页面food食品分类列表
export const msiteFoodTypes = geohash => fetch('/v2/index_entry', {
  geohash,
  group_type: '1',
  'flags[]': 'F'
})

// 获取food页面的category 种类列表
export const foodCategory = (latitude, longitude) => fetch('/shopping/v2/restaurant/category', {
  latitude,
  longitude
})

// 获取food页面的配送方式
export const foodDelivery = (latitude, longitude) => fetch('/shopping/v1/restaurants/delivery_modes', {
  latitude,
  longitude,
  kw: ''
})
// 获取food页面的商家属性
export const foodActivity = (latitude, longitude) => fetch('/shopping/v1/restaurants/activity_attributes', {
  latitude,
  longitude,
  kw: ''
})

// 获取shop-list 商铺列表
export const shopList = (latitude, longitude, offset, restaurant_category_id = '', restaurant_category_ids = '', order_by = '', deliveryMode = '', support_ids = []) => {
  let supportStr = ''
  support_ids.forEach(item => {
    if (item.status) {
      supportStr += '&support_ids[]=' + item.id
    }
  })
  let data = {
    latitude,
    longitude,
    offset,
    limit: '20',
    'extras[]': 'activities',
    keyword: '',
    restaurant_category_id,
    'restaurant_category_ids[]': restaurant_category_ids,
    order_by,
    'delivery_mode[]': deliveryMode + supportStr
  }
  return fetch('/shopping/restaurants', data)
}

// 获取shop页面商铺详情
export const shopDetails = (shopid, latitude, longitude) => fetch('/shopping/restaurant/' + shopid, {
  latitude,
  longitude: longitude + '&extras[]=activities&extras[]=album&extras[]=license&extras[]=identification&extras[]=statistics'
})

// 获取shop页面food食品菜单列表
/* eslint-disable */
export const foodMenu = restaurant_id => fetch('/shopping/v2/menu', {
  restaurant_id
/* eslint-disable */
})

// 获取shop商铺rating分类评价分数
export const ratingScores = shopid => fetch('/ugc/v2/restaurants/' + shopid + '/ratings/scores')

// 获取shop商铺rating分类评价tag列表
export const ratingTags = shopid => fetch('/ugc/v2/restaurants/' + shopid + '/ratings/tags')

// 获取shop商铺rating分类评价列表
export const getRatingList = (shopid, offset, tag_name = '') => fetch('/ugc/v2/restaurants/' + shopid + '/ratings', {
  has_content: true,
  offset,
  limit: 10,
  tag_name
})

// confirmOrder页面确认订单
export const checkout = (geohash, entities, shopid) => fetch('/v1/carts/checkout', {
  come_from: 'web',
  geohash,
  entities,
  restaurant_id: shopid
}, 'POST')

// (根据user_id。取出来数据库中的地址列表)
export const getAddressList = (user_id) => fetch('/v1/users/' + user_id + '/addresses')

// 添加地址
export const postAddAddress = (userId, address, address_detail, geohash, name, phone, phone_bk, poi_type, sex, tag, tag_type) => fetch('/v1/users/' + userId + '/addresses', {
  address,
  address_detail,
  geohash,
  name,
  phone,
  phone_bk,
  poi_type,
  sex,
  tag,
  tag_type,
}, 'POST');

// 获取用户信息
export const getUser = () => fetch('/v1/user', {user_id: getStore('user_id')})

// ------获取图片验证码
export const getcaptchas = () => fetch('/v1/captchas', {}, 'POST')

// 帐号密码登录
export const accountLogin = (username, password, captcha_code) => fetch('/v2/login', {username, password, captcha_code}, 'POST')

// 退出登录
export const signout = () => fetch('/v2/signout')

// 获取服务中心信息
export const getService = () => fetch('/v3/profile/explain')

// 重置密码
export const changePassword = (username, oldpassWord, newpassword, confirmpassword, captcha_code) => fetch('/v2/changepassword', {username, oldpassWord, newpassword, confirmpassword, captcha_code}, 'POST')

// 添加地址里面搜索地址
export const searchNearby = keyword => fetch('/v1/pois', {
  type: 'nearby',
  keyword
})

// 删除一条地址
export const deleteAddress = (userid, addressid) => fetch('/v1/users/' + userid + '/addresses/' + addressid, {}, 'DELETE')

// 下单
export const placeOrders = (user_id, cart_id, address_id, description, entities, geohash, sig) => fetch('/v1/users/' + user_id + '/carts/' + cart_id + '/orders', {
  address_id,
  come_from: "mobile_web",
  deliver_time: "",
  description,
  entities,
  geohash,
  paymethod_id: 1,
  sig,
}, 'POST')

// 发送订单验证码
export const payRequest = (merchantOrderNo, userId) => fetch('/payapi/payment/queryOrder', {
  marchantId: 5,
  merchantOrderNo,
  source: 'MOBILE_WAP',
  userId,
  version: '1.0.0'
})

// 
export const getOrderList = (user_id, offset) => fetch('/bos/v2/users/' + user_id + '/orders', {
  limit: 10,
  offset,
})

// 获取search页面搜索信息
export const searchRestaurant = (geohash, keyword) => fetch('/v4/restaurants', {
  'extras[]': 'restaurant_activity',
  geohash,
  keyword,
  type: 'search'
})

// 获取订单详情
export const getOrderDetail = (user_id, orderid) => fetch('/bos/v1/users/' + user_id + '/orders/' + orderid + '/snapshot')

// 
export const vipCart = (id, number, password) => fetch('/member/v1/users/' + id + '/delivery_card/physical_card/bind', {
  number,
  password
}, 'POST')

// 获取快速备注列表
export const getRemark = (id, sig) => fetch('/v1/carts/' + id +'/remarks', {
  sig
})