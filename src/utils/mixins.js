import store from '@/store'
// 定义一个混入对象
export const mixins = {
  // created: function() {
  //   console.log('我是混入对象的created')
  //   this.hello()
  // },
  // mounted() {
  //   console.log('我是混入对象的mounted')
  // },
  methods: {
    checkPermission(key) {
      // console.log(store.state.user.userInfo.roles.points)
      return !store.state.user.userInfo.roles.points.includes(key)
    }
  }
}
