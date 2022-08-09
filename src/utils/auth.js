import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'
const timeKey = 'time_Key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTime() {
  return Cookies.get(timeKey)
}

export function setTime() {
  Cookies.set(timeKey, Date.now())
}
