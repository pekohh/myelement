import {getUser, getAddressList} from 'service/getData'
import {GET_USERINFO, SAVE_ADDRESS} from './mutation-types.js'

export default {
  // 从数据库获取用户信息到vuex
  async getUserInfo ({
    commit,
    state
  }) {
    let res = await getUser() // 根据当前storage里面的user_id获取此用户信息。
    // console.log(res)
    commit(GET_USERINFO, res)
  },
  // 从数据库获取地址信息到vuex
  async saveAddress ({
    commit,
    state
  }) {
    if (state.removeAddress.length > 0) return
    let addres = await getAddressList(state.userInfo.user_id) // 将数据库的地址存入vuex
    commit(SAVE_ADDRESS, addres)
  }
}
