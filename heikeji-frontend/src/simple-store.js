// 简化版状态管理，用于渐进式测试
console.log('Creating simple store')

const Vue = require('vue')
const Vuex = require('vuex')

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0,
  },
  mutations: {
    increment(state) {
      state.count++
    },
  },
  actions: {
    increment({ commit }) {
      commit('increment')
    },
  },
  getters: {
    count: state => state.count,
  },
})

console.log('Simple store created')
module.exports = store
