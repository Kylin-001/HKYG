// 购物车模块
const state = {
  // 购物车商品列表
  products: [
    // 示例数据结构
    // {
    //   id: 1,
    //   name: '牛肉拉面',
    //   price: 28.00,
    //   image: '/static/images/default-product.jpg',
    //   quantity: 2,
    //   merchantId: 1,
    //   merchantName: '兰州拉面',
    //   specId: 2,
    //   specName: '中份',
    //   stock: 30
    // }
  ],
}

const mutations = {
  // 添加商品到购物车
  ADD_PRODUCT(state, product) {
    const existingProduct = state.products.find(
      p => p.id === product.id && p.specId === product.specId
    )

    if (existingProduct) {
      // 如果商品已存在，增加数量
      existingProduct.quantity += product.quantity
    } else {
      // 如果商品不存在，添加新商品
      state.products.push({
        ...product,
        quantity: product.quantity || 1,
      })
    }
  },

  // 更新商品数量
  UPDATE_QUANTITY(state, { productId, quantity }) {
    const product = state.products.find(p => p.id === productId)
    if (product) {
      if (quantity <= 0) {
        // 如果数量为0，移除商品
        const index = state.products.findIndex(p => p.id === productId)
        state.products.splice(index, 1)
      } else {
        product.quantity = Math.min(quantity, product.stock)
      }
    }
  },

  // 从购物车移除商品
  REMOVE_PRODUCT(state, productId) {
    const index = state.products.findIndex(p => p.id === productId)
    if (index > -1) {
      state.products.splice(index, 1)
    }
  },

  // 清空购物车
  CLEAR_CART(state) {
    state.products = []
  },
}

const actions = {
  // 添加商品到购物车
  addProduct({ commit }, { product, quantity = 1 }) {
    return new Promise((resolve, reject) => {
      try {
        // 模拟 API 调用
        setTimeout(() => {
          const cartProduct = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity,
            merchantId: product.merchantId,
            merchantName: product.merchantName,
            specId: product.specId || null,
            specName: product.specName || null,
            stock: product.stock,
          }

          commit('ADD_PRODUCT', cartProduct)
          resolve()
        }, 100)
      } catch (error) {
        reject(error)
      }
    })
  },

  // 更新商品数量
  updateQuantity({ commit }, { productId, quantity }) {
    return new Promise((resolve, reject) => {
      try {
        // 模拟 API 调用
        setTimeout(() => {
          commit('UPDATE_QUANTITY', { productId, quantity })
          resolve()
        }, 100)
      } catch (error) {
        reject(error)
      }
    })
  },

  // 移除商品
  removeProduct({ commit }, productId) {
    return new Promise((resolve, reject) => {
      try {
        // 模拟 API 调用
        setTimeout(() => {
          commit('REMOVE_PRODUCT', productId)
          resolve()
        }, 100)
      } catch (error) {
        reject(error)
      }
    })
  },

  // 清空购物车
  clearCart({ commit }) {
    return new Promise((resolve, reject) => {
      try {
        // 模拟 API 调用
        setTimeout(() => {
          commit('CLEAR_CART')
          resolve()
        }, 100)
      } catch (error) {
        reject(error)
      }
    })
  },
}

const getters = {
  // 购物车商品总数
  totalCount: state => {
    return state.products.reduce((total, product) => {
      return total + product.quantity
    }, 0)
  },

  // 购物车商品总金额（不包含配送费）
  goodsAmount: state => {
    return state.products.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)
  },

  // 总配送费
  totalDeliveryFee: state => {
    // 按商家分组计算配送费
    const merchantGroups = {}

    state.products.forEach(product => {
      const { merchantId } = product

      if (!merchantGroups[merchantId]) {
        merchantGroups[merchantId] = {
          deliveryFee: 2, // 每个商家固定配送费
          hasProducts: false,
        }
      }

      merchantGroups[merchantId].hasProducts = true
    })

    return Object.values(merchantGroups)
      .filter(group => group.hasProducts)
      .reduce((total, group) => total + group.deliveryFee, 0)
  },

  // 购物车总金额（包含配送费）
  totalAmount: (state, getters) => {
    return getters.goodsAmount + getters.totalDeliveryFee
  },

  // 购物车商品列表
  cartProducts: state => {
    return state.products
  },

  // 检查是否满足起送条件
  meetsMinOrderRequirement: (state, getters) => {
    return getters.totalAmount >= 15 // 最小起送金额
  },

  // 获取指定商家的商品
  getProductsByMerchant: state => merchantId => {
    return state.products.filter(product => product.merchantId === merchantId)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
}
