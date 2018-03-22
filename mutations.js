import * as types from './mutation-types.js'

export default {
  // 保存address的经纬度
  [types.RECORD_ADDRESS] (state, {
    latitude,
    longitude
  }) {
    state.latitude = latitude
    state.longitude = longitude
  },
  // 保存geohash
  [types.SAVE_GEOHASH] (state, geohash) {
    state.geohash = geohash
  },
  [types.GET_USERINFO] (state, userInfo) {
    if (state.userInfo && (state.userInfo.username !== userInfo.username)) {
      return
    }
    if (!state.login) {
      return
    }
    if (!userInfo.message) {
      state.userInfo = {...userInfo}
    } else {
      state.userInfo = null
    }
  }
}
