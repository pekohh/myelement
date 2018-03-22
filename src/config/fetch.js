import {baseUrl} from './env'

export default async (url = '', data = {}, type = 'GET', method = 'fetch') => {
  type = type.toUpperCase() // 保证大写
  url = baseUrl + url

  if (type === 'GET') {
    let dataStr = '' // 数据拼接字符串 name=haha&age=124
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&'
    })

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&')) // 如果数据字符串有值，则去掉最后一个&
      url = url + '?' + dataStr
    }
  }

  if (window.fetch && method === 'fetch') { // 如果匹配fetch。
    let requestConfig = {
      credentials: 'include',
      method: type,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      cache: 'force-cache'
    }
    if (type === 'POST') { // 如果是post请求。则给上面的请求信息添加body属性
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }
    try {
      const response = await fetch(url, requestConfig)
      const responseJson = await response.json()
      return responseJson
    } catch (error) {
      throw new Error(error)
    }
  } else {
    return new Promise((resolve, reject) => { // 否则最后匹配原生js的请求数据方法
      let requestObj
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest()
      } else {
        // requestObj = new ActiveXObject()
      }
      let sendData = ''
      if (type === 'POST') {
        sendData = JSON.stringify(data)
      }
      requestObj.open(type, url, true)
      requestObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
      requestObj.send(sendData)
      // 反馈响应信息
      requestObj.onreadystatechange = () => {
        if (requestObj.readyState === 4) {
          if (requestObj.status === 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj)
            }
            resolve(obj)
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }
}
