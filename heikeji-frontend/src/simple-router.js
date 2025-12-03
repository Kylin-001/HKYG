// 简化版路由配置，用于渐进式测试
console.log('Creating simple router')

const Vue = require('vue')
const Router = require('vue-router')

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: {
        template: '<div>Home Page</div>',
      },
    },
  ],
})

console.log('Simple router created')
module.exports = router
