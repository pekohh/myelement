/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */

let baseUrl = ''
let routerMode = 'history'
let imgBaseUrl = ''

// 开发环境
if (process.env.NODE_ENV === 'development') {
  imgBaseUrl = 'http: //cangdu.org:8001/img/'
} else if (process.env.NODE_ENV === 'production') { // 生产环境，线上环境
  baseUrl = 'http://cangdu.org:8001'
  imgBaseUrl = 'http://cangdu.org:8001/img/'
}

export {
  baseUrl,
  routerMode,
  imgBaseUrl
}
