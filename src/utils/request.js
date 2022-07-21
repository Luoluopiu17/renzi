import axios from 'axios'
import { Message } from 'element-ui'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API
})

// 请求拦截器
request.interceptors.request.use()

// 响应拦截器
request.interceptors.response.use(response => {
  console.log(response)
  const { data: { data, message, success }} = response
  if (success) {
    return data
  }
  Message.error(message || '系统错误')
  return Promise.reject(message || '系统错误')
})

export default request
