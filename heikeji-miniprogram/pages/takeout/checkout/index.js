// 订单结算页JS
Page({
  data: {
    // 购物车数据
    cart: [],
    // 选中的地址
    selectedAddress: null,
    // 配送方式
    selectedDelivery: 'normal',
    // 普通配送费
    deliveryFee: 2.00,
    // 快速配送费
    fastDeliveryFee: 5.00,
    // 支付方式
    selectedPayment: 'wechat',
    // 订单备注
    remark: '',
    // 商品总价
    goodsTotal: 0,
    // 优惠券折扣
    couponDiscount: 0,
    // 实付金额
    actualTotal: 0
  },

  onLoad() {
    // 加载购物车数据
    this.loadCartData();
    // 加载默认地址
    this.loadDefaultAddress();
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadCartData();
    this.loadDefaultAddress();
  },

  // 加载购物车数据
  loadCartData() {
    const app = getApp();
    const cart = app.globalData.cart.takeout || [];
    
    // 计算商品总价
    const goodsTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // 计算实付金额
    const deliveryFee = this.data.selectedDelivery === 'normal' ? this.data.deliveryFee : this.data.fastDeliveryFee;
    const actualTotal = (goodsTotal + deliveryFee - this.data.couponDiscount).toFixed(2);
    
    this.setData({
      cart: cart,
      goodsTotal: goodsTotal.toFixed(2),
      actualTotal: actualTotal
    });
  },

  // 加载默认地址
  loadDefaultAddress() {
    // 这里应该调用真实的API接口，暂时使用模拟数据
    const mockAddress = this.getMockDefaultAddress();
    this.setData({
      selectedAddress: mockAddress
    });
  },

  // 模拟默认地址
  getMockDefaultAddress() {
    return {
      id: 1,
      name: '张三',
      phone: '13800138000',
      province: '黑龙江省',
      city: '哈尔滨市',
      district: '松北区',
      detail: '黑龙江科技大学松北校区1号公寓312室',
      isDefault: true
    };
  },

  // 选择地址
  chooseAddress() {
    wx.navigateTo({
      url: '/pages/user/address/index?selectMode=true'
    });
  },

  // 选择配送方式
  selectDelivery(e) {
    const deliveryType = e.currentTarget.dataset.type;
    this.setData({
      selectedDelivery: deliveryType
    });
    
    // 重新计算实付金额
    this.updateActualTotal();
  },

  // 选择支付方式
  selectPayment(e) {
    const paymentType = e.currentTarget.dataset.type;
    this.setData({
      selectedPayment: paymentType
    });
  },

  // 订单备注输入
  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  // 更新实付金额
  updateActualTotal() {
    const goodsTotal = parseFloat(this.data.goodsTotal);
    const deliveryFee = this.data.selectedDelivery === 'normal' ? this.data.deliveryFee : this.data.fastDeliveryFee;
    const actualTotal = (goodsTotal + deliveryFee - this.data.couponDiscount).toFixed(2);
    
    this.setData({
      actualTotal: actualTotal
    });
  },

  // 提交订单
  async submitOrder() {
    // 验证地址
    if (!this.data.selectedAddress) {
      wx.showToast({
        title: '请选择配送地址',
        icon: 'error',
        duration: 1500
      });
      return;
    }
    
    // 验证购物车是否为空
    if (this.data.cart.length === 0) {
      wx.showToast({
        title: '购物车为空',
        icon: 'error',
        duration: 1500
      });
      return;
    }
    
    wx.showLoading({ title: '提交订单中...' });
    
    try {
      const takeoutApi = require('../../../api/takeout');
      
      // 构建订单数据
      const orderData = {
        merchantId: this.data.cart[0].merchantId || 1, // 假设购物车中商品来自同一个商家
        deliveryType: this.data.selectedDelivery,
        paymentType: this.data.selectedPayment,
        addressId: this.data.selectedAddress.id,
        remark: this.data.remark,
        items: this.data.cart.map(item => ({
          dishId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: this.data.goodsTotal,
        deliveryFee: this.data.selectedDelivery === 'normal' ? this.data.deliveryFee : this.data.fastDeliveryFee,
        actualAmount: this.data.actualTotal
      };
      
      // 调用创建订单API
      const result = await takeoutApi.createTakeoutOrder(orderData);
      
      wx.hideLoading();
      
      // 清空购物车
      const app = getApp();
      app.globalData.cart.takeout = [];
      app.saveCartData();
      
      // 跳转到订单成功页面
      wx.showToast({
        title: '订单提交成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            wx.navigateTo({
              url: `/pages/order/detail?id=${result.data.id}`
            });
          }, 2000);
        }
      });
    } catch (error) {
      wx.hideLoading();
      console.error('提交订单失败:', error);
      wx.showToast({
        title: '订单提交失败',
        icon: 'error',
        duration: 1500
      });
    }
  }
});