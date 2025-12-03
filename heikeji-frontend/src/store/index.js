import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import user from './modules/user'
import product from './modules/product'
import order from './modules/order'
import permission from './modules/permission'
import marketing from './modules/marketing'
import system from './modules/system'
import campus from './modules/campus'
import dashboard from './modules/dashboard'
import courier from './modules/courier'
import payment from './modules/payment'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    user,
    product,
    order,
    permission,
    marketing,
    system,
    campus,
    dashboard,
    courier,
    payment,
  },
  getters,
})

export default store
