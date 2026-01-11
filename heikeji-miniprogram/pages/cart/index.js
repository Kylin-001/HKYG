// 购物车页面JS
const productApi = require('../../api/product');

Page({
  data: {
    // 购物车列表
    cartList: [],
    // 总价格
    totalPrice: 0,
    // 加载状态
    loading: false
  },

  onLoad() {
    // 加载购物车数据
    this.loadCartList();
  },

  onShow() {
    // 每次页面显示时重新加载购物车数据
    this.loadCartList();
  },

  onPullDownRefresh() {
    // 下拉刷新购物车数据
    this.loadCartList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载购物车列表数据
   */
  async loadCartList() {
    wx.showLoading({ title: '加载中...' });
    
    try {
      const result = await productApi.getCartList();
      const cartList = result.data || [];
      
      // 计算总价格
      const totalPrice = this.calculateTotalPrice(cartList);
      
      this.setData({
        cartList: cartList,
        totalPrice: totalPrice
      });
    } catch (error) {
      console.error('加载购物车列表失败:', error);
      wx.showToast({ title: '加载失败', icon: 'error' });
      
      // 使用模拟数据
      const mockCartList = this.getMockCartList();
      this.setData({
        cartList: mockCartList,
        totalPrice: this.calculateTotalPrice(mockCartList)
      });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 计算总价格
   */
  calculateTotalPrice(cartList) {
    let total = 0;
    cartList.forEach(item => {
      total += item.product.price * item.quantity;
    });
    return total.toFixed(2);
  },

  /**
   * 减少商品数量
   */
  async decreaseQuantity(e) {
    const cartId = e.currentTarget.dataset.id;
    const cartItem = this.data.cartList.find(item => item.id === cartId);
    
    if (!cartItem) return;
    
    // 数量不能小于1
    if (cartItem.quantity <= 1) {
      wx.showToast({ title: '数量不能小于1', icon: 'none' });
      return;
    }
    
    try {
      // 调用API更新购物车商品数量
      await productApi.updateCartItem(cartId, { quantity: cartItem.quantity - 1 });
      
      // 更新本地数据
      const updatedCartList = this.data.cartList.map(item => {
        if (item.id === cartId) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      });
      
      this.setData({
        cartList: updatedCartList,
        totalPrice: this.calculateTotalPrice(updatedCartList)
      });
    } catch (error) {
      console.error('更新购物车数量失败:', error);
      wx.showToast({ title: '更新失败', icon: 'error' });
    }
  },

  /**
   * 增加商品数量
   */
  async increaseQuantity(e) {
    const cartId = e.currentTarget.dataset.id;
    const stock = e.currentTarget.dataset.stock;
    const cartItem = this.data.cartList.find(item => item.id === cartId);
    
    if (!cartItem) return;
    
    // 数量不能超过库存
    if (cartItem.quantity >= stock) {
      wx.showToast({ title: '已达到最大库存', icon: 'none' });
      return;
    }
    
    try {
      // 调用API更新购物车商品数量
      await productApi.updateCartItem(cartId, { quantity: cartItem.quantity + 1 });
      
      // 更新本地数据
      const updatedCartList = this.data.cartList.map(item => {
        if (item.id === cartId) {
          return { ...item, quantity: item.quantity + 1 };
        }
        return item;
      });
      
      this.setData({
        cartList: updatedCartList,
        totalPrice: this.calculateTotalPrice(updatedCartList)
      });
    } catch (error) {
      console.error('更新购物车数量失败:', error);
      wx.showToast({ title: '更新失败', icon: 'error' });
    }
  },

  /**
   * 删除购物车商品
   */
  async deleteCartItem(e) {
    const cartId = e.currentTarget.dataset.id;
    
    // 弹出确认对话框
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该商品吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            // 调用API删除购物车商品
            await productApi.deleteCartItem(cartId);
            
            // 更新本地数据
            const updatedCartList = this.data.cartList.filter(item => item.id !== cartId);
            
            this.setData({
              cartList: updatedCartList,
              totalPrice: this.calculateTotalPrice(updatedCartList)
            });
            
            wx.showToast({ title: '删除成功', icon: 'success' });
          } catch (error) {
            console.error('删除购物车商品失败:', error);
            wx.showToast({ title: '删除失败', icon: 'error' });
          }
        }
      }
    });
  },

  /**
   * 清空购物车
   */
  async clearCart() {
    // 弹出确认对话框
    wx.showModal({
      title: '确认清空',
      content: '确定要清空购物车吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            // 调用API清空购物车
            await productApi.clearCart();
            
            // 更新本地数据
            this.setData({
              cartList: [],
              totalPrice: 0
            });
            
            wx.showToast({ title: '清空成功', icon: 'success' });
          } catch (error) {
            console.error('清空购物车失败:', error);
            wx.showToast({ title: '清空失败', icon: 'error' });
          }
        }
      }
    });
  },

  /**
   * 去结算
   */
  onCheckout() {
    // 跳转到订单确认页面
    wx.navigateTo({
      url: '/pages/order/confirm/index?fromCart=true'
    });
  },

  /**
   * 获取模拟购物车数据
   */
  getMockCartList() {
    return [
      {
        id: 1,
        quantity: 2,
        product: {
          id: 1,
          name: '营养快线原味500ml',
          description: '经典原味，营养丰富，口感醇厚',
          price: 4.5,
          originalPrice: 5.5,
          discount: 8,
          sales: 1250,
          stock: 500,
          images: [
            'https://via.placeholder.com/300x300?text=营养快线1',
            'https://via.placeholder.com/300x300?text=营养快线2'
          ]
        }
      },
      {
        id: 2,
        quantity: 1,
        product: {
          id: 2,
          name: '乐事薯片青柠味135g',
          description: '清爽青柠味，薄脆口感，休闲必备',
          price: 6.8,
          originalPrice: 8.5,
          discount: 8,
          sales: 2100,
          stock: 300,
          images: [
            'https://via.placeholder.com/300x300?text=乐事薯片1'
          ]
        }
      },
      {
        id: 3,
        quantity: 3,
        product: {
          id: 3,
          name: '晨光中性笔0.5mm黑色',
          description: '书写流畅，不易断墨，适合学生使用',
          price: 1.5,
          sales: 3500,
          stock: 1000,
          images: [
            'https://via.placeholder.com/300x300?text=中性笔1'
          ]
        }
      }
    ];
  }
});