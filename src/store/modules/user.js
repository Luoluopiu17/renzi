import { getToken, setToken, removeToken } from '@/utils/auth'
import { login } from '@/api/user'
// 状态
const state = {
  token: getToken() // 初始化的时候把本地存储里面的token复制给vuex默认值
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
  }
}
// 执行异步
const actions = {
  async login(context, data) {
    const res = await login(data)
    context.commit('setToken', res)
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

