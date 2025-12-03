import { getProductList, getProductDetail, getCategoryList, getBrandList } from '@/api/product'

const product = {
  state: {
    list: [],
    total: 0,
    detail: {},
    categories: [],
    brands: [],
  },
  mutations: {
    SET_PRODUCT_LIST: (state, list) => {
      state.list = list
    },
    SET_PRODUCT_TOTAL: (state, total) => {
      state.total = total
    },
    SET_PRODUCT_DETAIL: (state, detail) => {
      state.detail = detail
    },
    SET_CATEGORIES: (state, categories) => {
      state.categories = categories
    },
    SET_BRANDS: (state, brands) => {
      state.brands = brands
    },
  },
  actions: {
    getProductList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getProductList(params)
          .then(response => {
            const { list, total } = response
            commit('SET_PRODUCT_LIST', list || [])
            commit('SET_PRODUCT_TOTAL', total || 0)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getProductDetail({ commit }, id) {
      return new Promise((resolve, reject) => {
        getProductDetail(id)
          .then(response => {
            commit('SET_PRODUCT_DETAIL', response || {})
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getCategories({ commit }) {
      return new Promise((resolve, reject) => {
        getCategoryList()
          .then(response => {
            commit('SET_CATEGORIES', response || [])
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getBrands({ commit }, params = {}) {
      return new Promise((resolve, reject) => {
        getBrandList(params)
          .then(response => {
            commit('SET_BRANDS', response || [])
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  },
}

export default product
