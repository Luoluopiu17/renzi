import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import router from '@/router'
import store from '@/store'

const loginPath = '/login'
const notFoundPath = '/404'
const whiteList = [loginPath, notFoundPath]

// 监听路由的变化
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // 1.是否有token(是否登录)
  const token = store.getters.token
  if (token) {
    if (!store.getters.userId) {
      const res = await store.dispatch('user/getUserInfo')
      const routes = await store.dispatch('permission/filterRoutes', res.roles.menus)
      // console.log(routes)
      router.addRoutes(routes,
        { path: '*', redirect: '/404', hidden: true })
      // 重新再进行跳转
      next(to.path)
    }
    // 判断是否去登录界面
    if (to.path === loginPath) {
      next('/') // 跳转到首页
    } else {
      // 直接放行
      next()
    }
  } else {
    // 判断是否去白名单界面
    if (whiteList.includes(to.path)) {
      next()
    } else {
      // 如果你没有token，同时要去的界面不是白名单界面(要去有权限的界面) >> 重新定向到登录界面
      next(loginPath)
    }
  }
})

router.afterEach(function() {
  NProgress.done()
})
