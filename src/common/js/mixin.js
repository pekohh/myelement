import {getStyle} from 'config/Util'
export const loadMore = {
  directives: {
    'load-more': {
      bind: (el, binding) => { // binding指的是这个指令
        let windowHeight = window.screen.height
        let height
        let setTop
        let paddingBottom
        let marginBottom
        let requestFram
        let oldScrollTop
        let scrollEl
        let heightEl
        let scrollType = el.attributes.type && el.attributes.type.value
        let scrollReduce = 2
        if (scrollType === 2) {
          scrollEl = el // 类型为2,则滚动元素为其本身
          heightEl = el.children[0]
        } else {
          scrollEl = document.body // 类型为1,则滚动元素为整个body
          heightEl = el
        }
        // 绑定el的touchstart事件,开始触摸事件
        el.addEventListener('touchstart', () => {
          height = heightEl.clientHeight // 滚动元素的高度
          // if (scrollType === 2) {
          //  height = height
          // }
          setTop = el.offsetTop // 距离顶部的位置
          paddingBottom = getStyle(el, 'paddingBottom') // 获取元素距离底部的padding值
          marginBottom = getStyle(el, 'marginBottom')
        }, false)
        // 绑定el的touchmove事件
        el.addEventListener('touchMode', () => {
          loadMore()
        }, false)
        // 绑定el的touchend事件
        el.addEventListener('touchend', () => {
          oldScrollTop = scrollEl.oldScrollTop
          moveEnd()
        })
        // moveEnd()事件
        const moveEnd = () => {
          requestFram = requestAnimationFrame(() => { // 告诉浏览器您希望执行动画并请求浏览器在下一次重绘之前调用指定的函数来更新动画
            if (scrollEl.scrollTop !== oldScrollTop) {
              oldScrollTop = scrollEl.scrollTop
              moveEnd()
            } else {
              cancelAnimationFrame(requestFram) // 取消一个先前通过调用window.requestAnimationFrame()方法添加到计划中的动画帧请求.
              height = heightEl.clientHeight
              loadMore()
            }
          })
        }
        // loadMore()事件
        const loadMore = () => {
          if (scrollEl.scrollTop + windowHeight >= height + setTop + paddingBottom + marginBottom - scrollReduce) {
            binding.value()
          }
        }
      }
    }
  }
}

export const getImgPath = {
  methods: {
    // 传递过来的图片地址需要处理后才能正常使用
    getImgPaths (path) {
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
    }
  }
}
