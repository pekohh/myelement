const state = {
  latitude: '', // 当前位置纬度
  longitude: '', // 当前位置经度
  geohash: 'wtw3sm0q087', // 地址geohash值
  userInfo: null, // 用户信息
  cartList: {}, // 加入购物车的商品列表
  shopDetail: null, // 商铺详情信息
  addressIndex: null, // 默认地址的索引值
  choosedAddress: null, // 地址列表中选中的地址
  newAddress: [], // 新添加的地址
  searchAddress: null, // 搜索并选择的地址(作为前一页面的结果)
  removeAddress: [], // 现有地址合集
  question: null, // 问题详情
  login: true, // 用户是否已登录
  addAddress: '', // 地址
  remarkText: null, // 可选备注内容
  inputText: '', // 输入备注内容
  orderParam: null, // 订单的参数
  orderMessage: null, // 订单返回的信息
  orderDetail: null, // 订单详情
  invoice: false // 是否开发票
}

export default state
