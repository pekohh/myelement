import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
// import Home from '@/components/pages/home/home'
const Home = (resolve) => {
  import('components/pages/home/home').then((module) => {
    resolve(module)
  })
}
const City = (resolve) => {
  import('components/pages/city/city').then((module) => {
    resolve(module)
  })
}
const Msite = (resolve) => {
  import('components/pages/msite/msite').then((module) => {
    resolve(module)
  })
}
const Shop = (resolve) => {
  import('components/pages/shop/shop').then((module) => {
    resolve(module)
  })
}
const ShopDetail = (resolve) => {
  import('components/pages/shop/children/shopDetail').then((module) => {
    resolve(module)
  })
}
const ShopSafe = (resolve) => {
  import('components/pages/shop/children/children/shopSafe').then((module) => {
    resolve(module)
  })
}
const confirmOrder = (resolve) => {
  import('components/pages/confirmOrder/confirmOrder').then((module) => {
    resolve(module)
  })
}
const chooseAddress = (resolve) => {
  import('components/pages/confirmOrder/children/chooseAddress').then((module) => {
    resolve(module)
  })
}
const invoice = (resolve) => {
  import('components/pages/confirmOrder/children/invoice').then((module) => {
    resolve(module)
  })
}
const remark = (resolve) => {
  import('components/pages/confirmOrder/children/remark').then((module) => {
    resolve(module)
  })
}
const payment = (resolve) => {
  import('components/pages/confirmOrder/children/remark').then((module) => {
    resolve(module)
  })
}
const addAddress = (resolve) => {
  import('components/pages/confirmOrder/children/children/addAddress').then((module) => {
    resolve(module)
  })
}
const searchAddress = (resolve) => {
  import('components/pages/confirmOrder/children/children/children/searchAddress').then((module) => {
    resolve(module)
  })
}
const FoodDetail = (resolve) => {
  import('components/pages/shop/children/foodDetail').then((module) => {
    resolve(module)
  })
}
const Search = (resolve) => {
  import('components/pages/search/search').then((module) => {
    resolve(module)
  })
}
const Food = (resolve) => {
  import('components/pages/food/food').then((module) => {
    resolve(module)
  })
}
const order = (resolve) => {
  import('components/pages/order/order').then((module) => {
    resolve(module)
  })
}
const orderDetail = (resolve) => {
  import('components/pages/order/children/orderDetail').then((module) => {
    resolve(module)
  })
}
const vipcart = (resolve) => {
  import('components/pages/vipcart/vipcart').then((module) => {
    resolve(module)
  })
}
const invoiceRecord = (resolve) => {
  import('components/pages/vipcart/children/invoiceRecord').then((module) => {
    resolve(module)
  })
}
const vipDescription = (resolve) => {
  import('components/pages/vipcart/children/vipDescription').then((module) => {
    resolve(module)
  })
}
const userCart = (resolve) => {
  import('components/pages/vipcart/children/userCart').then((module) => {
    resolve(module)
  })
}
const service = (resolve) => {
  import('components/pages/service/service').then((module) => {
    resolve(module)
  })
}
const questionDetail = (resolve) => {
  import('components/pages/service/children/questionDetail').then((module) => {
    resolve(module)
  })
}
const download = (resolve) => {
  import('components/pages/download/download').then((module) => {
    resolve(module)
  })
}
const profile = (resolve) => {
  import('components/pages/profile/profile').then((module) => {
    resolve(module)
  })
}
const info = (resolve) => {
  import('components/pages/profile/children/info').then((module) => {
    resolve(module)
  })
}
const setusername = (resolve) => {
  import('components/pages/profile/children/children/setusername').then((module) => {
    resolve(module)
  })
}
const address = (resolve) => {
  import('components/pages/profile/children/children/address').then((module) => {
    resolve(module)
  })
}
const add = (resolve) => {
  import('components/pages/profile/children/children/children/add').then((module) => {
    resolve(module)
  })
}
const addDetail = (resolve) => {
  import('components/pages/profile/children/children/children/children/addDetail').then((module) => {
    resolve(module)
  })
}
const login = (resolve) => {
  import('components/pages/login/login').then((module) => {
    resolve(module)
  })
}
const forget = (resolve) => {
  import('components/pages/forget/forget').then((module) => {
    resolve(module)
  })
}
// import City from '@/components/pages/city/city'
// import Msite from '@/components/pages/msite/msite'
// import Shop from '@/components/pages/shop/shop'
// import ShopDetail from '@/components/pages/shop/children/shopDetail'
// import ShopSafe from '@/components/pages/shop/children/children/shopSafe'
// import confirmOrder from '@/components/pages/confirmOrder/confirmOrder'
// import chooseAddress from '@/components/pages/confirmOrder/children/chooseAddress'
// import invoice from '@/components/pages/confirmOrder/children/invoice'
// import remark from '@/components/pages/confirmOrder/children/remark'
// import payment from '@/components/pages/confirmOrder/children/payment'

// import addAddress from '@/components/pages/confirmOrder/children/children/addAddress'
// import searchAddress from '@/components/pages/confirmOrder/children/children/children/searchAddress'
// import FoodDetail from '@/components/pages/shop/children/foodDetail'
// import Search from '@/components/pages/search/search'
// import Food from '@/components/pages/food/food'
// import order from '@/components/pages/order/order'
// import orderDetail from '@/components/pages/order/children/orderDetail'

// import vipcart from '@/components/pages/vipcart/vipcart'
// import invoiceRecord from '@/components/pages/vipcart/children/invoiceRecord'
// import vipDescription from '@/components/pages/vipcart/children/vipDescription'
// import userCart from '@/components/pages/vipcart/children/userCart'

// import service from '@/components/pages/service/service'
// import questionDetail from '@/components/pages/service/children/questionDetail'
// import download from '@/components/pages/download/download'
// import profile from '@/components/pages/profile/profile'
// import info from '@/components/pages/profile/children/info'
// import setusername from '@/components/pages/profile/children/children/setusername'
// import address from '@/components/pages/profile/children/children/address'
// import add from '@/components/pages/profile/children/children/children/add'
// import addDetail from '@/components/pages/profile/children/children/children/children/addDetail'

// import login from '@/components/pages/login/login'
// import forget from '@/components/pages/forget/forget'

Vue.use(Router)
export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      component: App,
      children: [
        {
          path: '',
          redirect: '/home'
        },
        { // 首页城市列表页面
          path: '/home',
          component: Home
        },
        { // 当前选择城市页面
          path: '/city/:cityid',
          component: City
        },
        { // 所有商铺列表页面
          path: '/msite',
          component: Msite
        },
        // 搜索页面
        {
          path: '/search/:geohash',
          component: Search
        },
        // 特色商铺列表页food页面
        {
          path: '/food',
          component: Food
        },
        // 商铺详情页面
        {
          path: '/shop',
          component: Shop,
          children: [
            {
              path: 'shopDetail', // 商铺详情页面
              component: ShopDetail,
              children: [
                {
                  path: 'ShopSafe',
                  component: ShopSafe // 商铺安全信息
                }
              ]
            },
            {
              path: 'foodDetail', // 食物详情页面
              component: FoodDetail
            }
          ]
        },
        {
          path: '/profile', // 个人信息
          component: profile,
          children: [
            {
              path: 'info',
              component: info,
              children: [
                {
                  path: 'setusername',
                  component: setusername
                },
                {
                  path: 'address',
                  component: address,
                  children: [
                    {
                      path: 'add',
                      component: add,
                      children: [
                        {
                          path: 'addDetail',
                          component: addDetail
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          path: '/order', // 我的订单
          component: order,
          children: [
            {
              path: 'orderDetail',
              component: orderDetail
            }
          ]
        },
        {
          path: '/vipcard',
          component: vipcart,
          children: [
            {
              path: 'userCart',
              component: userCart
            },
            {
              path: 'invoiceRecord',
              component: invoiceRecord
            },
            {
              path: 'vipDescription',
              component: vipDescription
            }
          ]
        },
        {
          path: '/service',
          component: service,
          children: [
            {
              path: 'questionDetail',
              component: questionDetail
            }
          ]
        },
        {
          path: '/download',
          component: download
        },
        {
          path: '/login',
          component: login
        },
        {
          path: '/forget',
          component: forget
        },
        {
          path: '/confirmOrder', // 结算
          component: confirmOrder,
          children: [
            {
              path: 'chooseAddress', // 选择地址
              component: chooseAddress,
              children: [
                {
                  path: 'addAddress',
                  component: addAddress,
                  children: [
                    {
                      path: 'searchAddress',
                      component: searchAddress
                    }
                  ]
                }
              ]
            },
            {
              path: 'payment', // 支付页面
              component: payment
            },
            {
              path: 'invoice',
              component: invoice
            },
            {
              path: 'remark',
              component: remark
            }
          ]
        }
      ]
    }
  ]
})
