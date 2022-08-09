import { getToken, setToken, removeToken, setTime } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router/index'
// 状态
const state = {
  token: getToken(), // 初始化的时候把本地存储里面的token复制给vuex默认值
  userInfo: {}
}
// 修改状态
const mutations = {
  // 设置token
  setToken(state, token) {
    state.token = token
    setToken(token)
  },
  // 移除token
  removeToken(state, token) {
    state.token = null
    removeToken(token)
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  removeUserInfo(state) {
    state.userInfo = {}
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    const res = await login(data)
    context.commit('setToken', res)
    setTime()
  },
  async getUserInfo(context) {
    const res = await getUserInfo()
    const baseInfo = await getUserDetailById(res.userId)
    // console.log(res)
    context.commit('setUserInfo', { ...res, ...baseInfo })
    return { ...res, ...baseInfo }
  },
  logOut(context) {
    context.commit('removeUserInfo')
    context.commit('removeToken')
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

