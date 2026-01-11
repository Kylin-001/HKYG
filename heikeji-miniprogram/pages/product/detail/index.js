// 商品商城详情页面JS
Page({
  data: {
    // 商品ID
    productId: '',
    
    // 商品详情数据
    product: {
      id: '',
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      discount: 0,
      sales: 0,
      stock: 0,
      rating: 0,
      images: [],
      detailImages: [],
      detailText: ''
    },
    
    // 购买数量
    quantity: 1,
    
    // 是否已收藏
    isCollected: false
  },

  onLoad(options) {
    // 获取商品ID
    const productId = options.id;
    if (productId) {
      this.setData({
        productId: productId
      });
      this.loadProductDetail(productId);
      this.checkCollectStatus(productId);
    }
  },

  /**
   * 加载商品详情
   */
  async loadProductDetail(productId) {
    wx.showLoading({ title: '加载中...' });
    
    try {
      const productApi = require('../../../api/product');
      const result = await productApi.getProductDetail(productId);
      
      this.setData({
        product: result.data
      });
    } catch (error) {
      console.error('加载商品详情失败:', error);
      wx.showToast({ title: '加载失败', icon: 'error' });
      
      // 使用模拟数据
      this.setData({
        product: this.getMockProductDetail()
      });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 检查收藏状态
   */
  async checkCollectStatus(productId) {
    try {
      const productApi = require('../../../api/product');
      const result = await productApi.checkCollectStatus(productId);
      
      this.setData({
        isCollected: result.data.isCollected
      });
    } catch (error) {
      console.error('检查收藏状态失败:', error);
      // 默认未收藏
      this.setData({
        isCollected: false
      });
    }
  },

  /**
   * 减少购买数量
   */
  decreaseQuantity() {
    if (this.data.quantity > 1) {
      this.setData({
        quantity: this.data.quantity - 1
      });
    }
  },

  /**
   * 增加购买数量
   */
  increaseQuantity() {
    if (this.data.quantity < this.data.product.stock) {
      this.setData({
        quantity: this.data.quantity + 1
      });
    }
  },

  /**
   * 加入购物车
   */
  async addCart() {
    try {
      const productApi = require('../../../api/product');
      await productApi.addToCart({
        productId: this.data.productId,
        quantity: this.data.quantity
      });
      
      wx.showToast({
        title: '已添加到购物车',
        icon: 'success',
        duration: 1500
      });
    } catch (error) {
      console.error('添加到购物车失败:', error);
      wx.showToast({ title: '添加失败', icon: 'error' });
    }
  },

  /**
   * 立即购买
   */
  async buyNow() {
    // 跳转到订单确认页面
    wx.navigateTo({
      url: `/pages/order/confirm/index?productId=${this.data.productId}&quantity=${this.data.quantity}`
    });
  },

  /**
   * 收藏/取消收藏
   */
  async onCollect() {
    try {
      const productApi = require('../../../api/product');
      let result;
      
      if (this.data.isCollected) {
        // 取消收藏
        result = await productApi.cancelCollect(this.data.productId);
      } else {
        // 添加收藏
        result = await productApi.addCollect(this.data.productId);
      }
      
      this.setData({
        isCollected: !this.data.isCollected
      });
      
      wx.showToast({
        title: this.data.isCollected ? '收藏成功' : '取消收藏',
        icon: 'success',
        duration: 1500
      });
    } catch (error) {
      console.error('收藏操作失败:', error);
      wx.showToast({ title: '操作失败', icon: 'error' });
    }
  },

  /**
   * 分享
   */
  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  /**
   * 跳转到购物车
   */
  navigateToCart() {
    wx.navigateTo({
      url: '/pages/cart/index'
    });
  },

  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack();
  },

  /**
   * 获取模拟商品详情数据
   */
  getMockProductDetail() {
    return {
      id: '1',
      name: '营养快线原味500ml',
      description: '经典原味，营养丰富，口感醇厚',
      price: 4.5,
      originalPrice: 5.5,
      discount: 8,
      sales: 1250,
      stock: 500,
      rating: 98,
      images: [
        'https://via.placeholder.com/300x300?text=营养快线1',
        'https://via.placeholder.com/300x300?text=营养快线2',
        'https://via.placeholder.com/300x300?text=营养快线3'
      ],
      detailImages: [
        'https://via.placeholder.com/750x500?text=商品详情1',
        'https://via.placeholder.com/750x500?text=商品详情2'
      ],
      detailText: '营养快线是娃哈哈集团旗下的一款营养型乳饮料，口感醇厚，营养丰富，适合各种场合饮用。产品采用优质奶源和多种维生素，为您提供健康营养的饮品选择。'
    };
  }
});
