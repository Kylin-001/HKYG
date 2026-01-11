// 商家详情页JS
Page({
  data: {
    // 商家ID
    merchantId: null,
    // 商家信息
    merchant: {},
    // 菜品分类列表
    categories: [],
    // 当前选中分类
    currentCategory: 0,
    // 评论列表
    comments: [],
    // 窗口高度
    windowHeight: 0,
    // 购物车数据
    cart: [],
    // 购物车商品数量
    cartCount: 0,
    // 购物车总价
    cartTotal: 0,
    // 菜品详情弹窗显示状态
    showDishModal: false,
    // 选中的菜品
    selectedDish: null,
    // 菜品数量
    dishCount: 1
  },

  onLoad(options) {
    // 获取商家ID
    this.setData({ merchantId: options.id });
    
    // 获取窗口高度
    wx.getSystemInfo({
      success: (res) => {
        this.setData({ windowHeight: res.windowHeight });
      }
    });
    
    // 加载商家信息和菜品
    this.loadMerchantInfo();
    this.loadComments();
    this.loadCartData();
  },

  onShow() {
    // 页面显示时刷新购物车数据
    this.loadCartData();
  },

  onPullDownRefresh() {
    // 下拉刷新
    this.loadMerchantInfo().then(() => {
      this.loadComments();
      this.loadCartData();
      wx.stopPullDownRefresh();
    });
  },

  // 加载商家信息和菜品
  async loadMerchantInfo() {
    wx.showLoading({ title: '加载中...' });
    
    try {
      const takeoutApi = require('../../../api/takeout');
      
      // 获取商家详情
      const merchantResult = await takeoutApi.getMerchantDetail(this.data.merchantId);
      
      // 获取菜品分类
      const categoriesResult = await takeoutApi.getMerchantCategories(this.data.merchantId);
      
      // 为每个分类获取菜品列表
      const categoriesWithDishes = await Promise.all(categoriesResult.data.map(async (category) => {
        const dishesResult = await takeoutApi.getMerchantDishes(this.data.merchantId, category.id);
        return {
          ...category,
          dishes: dishesResult.data
        };
      }));
      
      this.setData({
        merchant: merchantResult.data,
        categories: categoriesWithDishes,
        currentCategory: categoriesWithDishes.length > 0 ? categoriesWithDishes[0].id : 0
      });
    } catch (error) {
      console.error('加载商家信息失败:', error);
      wx.showToast({ title: '加载失败', icon: 'error' });
    } finally {
      wx.hideLoading();
    }
  },

  // 加载评价
  async loadComments() {
    try {
      const takeoutApi = require('../../../api/takeout');
      const result = await takeoutApi.getMerchantComments(this.data.merchantId, { page: 1, pageSize: 10 });
      this.setData({ comments: result.data.list });
    } catch (error) {
      console.error('加载评价失败:', error);
    }
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



  // 分类切换事件
  onCategoryChange(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({
      currentCategory: categoryId
    });
  },

  // 查看全部评论
  viewAllComments() {
    wx.navigateTo({
      url: `/pages/takeout/merchant/comments?id=${this.data.merchantId}`
    });
  },

  // 菜品点击事件
  onDishClick(e) {
    const dish = e.currentTarget.dataset.dish;
    this.setData({
      selectedDish: dish,
      dishCount: 1,
      showDishModal: true
    });
  },

  // 关闭菜品详情弹窗
  closeDishModal() {
    this.setData({
      showDishModal: false,
      selectedDish: null,
      dishCount: 1
    });
  },

  // 减少菜品数量
  decreaseCount() {
    if (this.data.dishCount > 1) {
      this.setData({
        dishCount: this.data.dishCount - 1
      });
    }
  },

  // 增加菜品数量
  increaseCount() {
    this.setData({
      dishCount: this.data.dishCount + 1
    });
  },

  // 加入购物车
  addToCart(e) {
    const dish = e.currentTarget.dataset.dish;
    this.addDishToCart(dish, 1);
  },

  // 确认加入购物车
  confirmAddToCart() {
    this.addDishToCart(this.data.selectedDish, this.data.dishCount);
    this.closeDishModal();
  },

  // 实际加入购物车的逻辑
  addDishToCart(dish, count) {
    const app = getApp();
    const cart = app.globalData.cart.takeout || [];
    
    // 检查购物车中是否已存在该菜品
    const existingIndex = cart.findIndex(item => item.id === dish.id);
    
    if (existingIndex > -1) {
      // 已存在，增加数量
      cart[existingIndex].quantity += count;
    } else {
      // 不存在，添加到购物车
      cart.push({
        ...dish,
        quantity: count
      });
    }
    
    // 更新全局购物车数据
    app.globalData.cart.takeout = cart;
    app.saveCartData();
    
    // 更新本地数据
    this.loadCartData();
    
    // 显示提示
    wx.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 1500
    });
  },

  // 跳转到购物车页面
  navigateToCart() {
    wx.navigateTo({
      url: '/pages/takeout/cart/index'
    });
  },

  // 跳转到结算页面
  navigateToCheckout() {
    wx.navigateTo({
      url: '/pages/takeout/checkout/index'
    });
  }
});