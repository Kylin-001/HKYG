// 购物车页面JS
Page({
  data: {
    // 购物车数据
    cart: [],
    // 购物车商品数量
    cartCount: 0,
    // 购物车总价
    cartTotal: 0
  },

  onLoad() {
    // 加载购物车数据
    this.loadCartData();
  },

  onShow() {
    // 页面显示时刷新购物车数据
    this.loadCartData();
  },

  onPullDownRefresh() {
    // 下拉刷新
    this.loadCartData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 加载购物车数据
  loadCartData() {
    const app = getApp();
    const cart = app.globalData.cart.takeout || [];
    
    // 计算购物车数量和总价
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);
    
    this.setData({
      cart: cart,
      cartCount: cartCount,
      cartTotal: cartTotal
    });
  },

  // 减少商品数量
  decreaseCount(e) {
    const index = e.currentTarget.dataset.index;
    const cart = this.data.cart;
    
    if (cart[index].quantity > 1) {
      cart[index].quantity--;
      this.updateCart(cart);
    }
  },

  // 增加商品数量
  increaseCount(e) {
    const index = e.currentTarget.dataset.index;
    const cart = this.data.cart;
    
    cart[index].quantity++;
    this.updateCart(cart);
  },

  // 删除商品
  deleteItem(e) {
    const index = e.currentTarget.dataset.index;
    wx.showModal({
      title: '提示',
      content: '确定要删除该商品吗？',
      success: (res) => {
        if (res.confirm) {
          const cart = this.data.cart;
          cart.splice(index, 1);
          this.updateCart(cart);
        }
      }
    });
  },

  // 清空购物车
  clearCart() {
    wx.showModal({
      title: '提示',
      content: '确定要清空购物车吗？',
      success: (res) => {
        if (res.confirm) {
          this.updateCart([]);
        }
      }
    });
  },

  // 更新购物车数据
  updateCart(cart) {
    const app = getApp();
    
    // 更新全局购物车数据
    app.globalData.cart.takeout = cart;
    app.saveCartData();
    
    // 更新本地数据
    this.loadCartData();
    
    // 显示提示
    wx.showToast({
      title: '更新成功',
      icon: 'success',
      duration: 1500
    });
  },

  // 去购物
  goShopping() {
    wx.switchTab({
      url: '/pages/takeout/index'
    });
  },

  // 去结算
  goToCheckout() {
    wx.navigateTo({
      url: '/pages/takeout/checkout/index'
    });
  },

  // 加载更多（预留）
  onLoadMore() {
    // 购物车数据一般不需要分页加载，这里预留接口
  }
});