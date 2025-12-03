// 渐进式测试入口文件
console.log('Starting progressive test build')

// 逐步引入项目模块，找出导致内存问题的部分
// 第1阶段：只引入基础Vue
console.log('Stage 1: Basic Vue import')
const Vue = require('vue')
console.log('Vue version:', Vue.version)

// 第2阶段：引入简化版App组件
console.log('Stage 2: Simple App component import')
const SimpleApp = require('./SimpleApp.vue')
console.log('Simple App component loaded')

// 第3阶段：引入简化版路由
console.log('Stage 3: Simple Router import')
const router = require('./simple-router')
console.log('Simple Router loaded')

// 第4阶段：引入简化版状态管理
console.log('Stage 4: Simple Store import')
const store = require('./simple-store')
console.log('Simple Store loaded')
