import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTime } from './auth'
import router from '@/router'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
})

const timeOut = 6000000

const isCheckTimeOut = function() {
  return Date.now() - getTime() < timeOut
}

// 请求拦截器
request.interceptors.request.use(config => {
  // console.log(config)
  const token = store.getters.token
  if (token) {
    if (isCheckTimeOut()) {
      config.headers.Authorization = `Bearer ${token}`
    } else {
      Message.error('登录过期，请重新登录')
      store.dispatch('user/logOut')
      router.push('/')
      return Promise.reject('')
    }
  }
  return config
})

// 响应拦截器
request.interceptors.response.use(response => {
  // console.log(response)
  const { data: { data, message, success }} = response
  if (success) {
    return data
  }
  Message.error(message || '系统错误')
  return Promise.reject(message || '系统错误')
}, error => {
  // console.dir(error)
  if (error.response.status === 401) {
    store.dispatch('user/logOut')
    router.push('/login')
  }
  Message.error(error.response?.data?.message || '系统错误')
  return Promise.reject(error)
})

export default request
