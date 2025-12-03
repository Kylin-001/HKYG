import {
  getCouponList,
  getCouponDetail,
  addCoupon,
  updateCoupon,
  deleteCoupon,
  updateCouponStatus,
  getBannerList,
  getBannerDetail,
  addBanner,
  updateBanner,
  deleteBanner,
  updateBannerStatus,
} from '@/api/marketing'

const marketing = {
  state: {
    // 优惠券相关状态
    couponList: [],
    couponTotal: 0,
    couponDetail: {},

    // 轮播图相关状态
    bannerList: [],
    bannerDetail: {},
  },

  mutations: {
    // 优惠券相关mutations
    SET_COUPON_LIST: (state, list) => {
      state.couponList = list || []
    },
    SET_COUPON_TOTAL: (state, total) => {
      state.couponTotal = total || 0
    },
    SET_COUPON_DETAIL: (state, detail) => {
      state.couponDetail = detail || {}
    },

    // 轮播图相关mutations
    SET_BANNER_LIST: (state, list) => {
      state.bannerList = list || []
    },
    SET_BANNER_DETAIL: (state, detail) => {
      state.bannerDetail = detail || {}
    },
  },

  actions: {
    // 优惠券相关actions
    getCouponList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getCouponList(params)
          .then(response => {
            const { list, total } = response
            commit('SET_COUPON_LIST', list)
            commit('SET_COUPON_TOTAL', total)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    getCouponDetail({ commit }, id) {
      return new Promise((resolve, reject) => {
        getCouponDetail(id)
          .then(response => {
            commit('SET_COUPON_DETAIL', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    addCoupon(_, data) {
      return new Promise((resolve, reject) => {
        addCoupon(data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    updateCoupon(_, data) {
      return new Promise((resolve, reject) => {
        updateCoupon(data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    deleteCoupon(_, id) {
      return new Promise((resolve, reject) => {
        deleteCoupon(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    updateCouponStatus(_, { id, status }) {
      return new Promise((resolve, reject) => {
        updateCouponStatus(id, status)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 轮播图相关actions
    getBannerList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getBannerList(params)
          .then(response => {
            commit('SET_BANNER_LIST', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    getBannerDetail({ commit }, id) {
      return new Promise((resolve, reject) => {
        getBannerDetail(id)
          .then(response => {
            commit('SET_BANNER_DETAIL', response)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    addBanner({ commit }, data) {
      return new Promise((resolve, reject) => {
        addBanner(data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    updateBanner({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateBanner(data)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    deleteBanner({ commit }, id) {
      return new Promise((resolve, reject) => {
        deleteBanner(id)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    updateBannerStatus({ commit }, { id, status }) {
      return new Promise((resolve, reject) => {
        updateBannerStatus(id, status)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
  },
}

export default marketing
