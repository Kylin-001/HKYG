// 订单确认页面JS
const couponApi = require('../../../api/coupon');
const orderApi = require('../../../api/order');
const paymentApi = require('../../../api/payment');

Page({
  data: {
    // 商品ID和数量（从商品详情页面传入）
    productId: '',
    quantity: 1,
    
    // 选中的地址
    selectedAddress: null,
    
    // 配送方式
    selectedDelivery: 'normal',
    
    // 配送费用
    deliveryFee: {
      normal: 2.00,
      fast: 5.00
    },
    
    // 支付方式
    paymentMethods: [
      { id: 'wechat', name: '微信支付', icon: '/assets/icons/wechat-pay.png', checked: true },
      { id: 'alipay', name: '支付宝', icon: '/assets/icons/alipay.png', checked: false },
      { id: 'balance', name: '余额支付', icon: '/assets/icons/wallet.png', checked: false }
    ],
    selectedPayment: 'wechat',
    
    // 订单备注
    remark: '',
    
    // 商品信息
    orderGoods: [],
    
    // 商品总价
    goodsTotal: 0,
    
    // 优惠券相关
    couponDiscount: 0,
    selectedCoupon: null,
    availableCoupons: [],
    
    // 实付金额
    actualTotal: 0,
    
    // 提交订单加载状态
    submitLoading: false
  },

  onLoad(options) {
    // 检查是否从购物车跳转过来
    if (options.fromCart) {
      // 从购物车跳转，加载购物车数据
      this.loadCartItems();
    } else if (options.productId) {
      // 从商品详情跳转，加载单个商品信息
      this.setData({
        productId: options.productId,
        quantity: parseInt(options.quantity) || 1
      });
      // 加载商品信息
      this.loadProductInfo();
    }
    // 加载默认地址
    this.loadDefaultAddress();
  },

  onShow() {
    // 页面显示时刷新地址信息
    this.loadDefaultAddress();
  },

  /**
   * 从购物车加载商品数据
   */
  async loadCartItems() {
    try {
      const productApi = require('../../../api/product');
      const result = await productApi.getCartList();
      
      if (result.code === 200 && result.data) {
        const cartItems = result.data;
        
        // 构建订单商品信息
        const orderGoods = cartItems.map(item => ({
          id: item.product.id,
          name: item.product.name,
          spec: item.product.spec || '',
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0] || '/assets/images/default-product.png'
        }));
        
        // 计算商品总价
        const goodsTotal = cartItems.reduce((total, item) => {
          return total + (item.product.price * item.quantity);
        }, 0);
        
        this.setData({
          orderGoods: orderGoods,
          goodsTotal: goodsTotal
        });
        
        // 计算实付金额
        this.calculateActualTotal();
        
        // 加载可用优惠券
        this.loadAvailableCoupons();
      }
    } catch (error) {
      console.error('加载购物车商品失败:', error);
      wx.showToast({ title: '加载失败', icon: 'error' });
      
      // 使用模拟购物车数据
      this.loadMockCartItems();
    }
  },

  /**
   * 加载模拟购物车数据（用于开发测试）
   */
  loadMockCartItems() {
    // 模拟购物车数据
    const mockCartItems = [
      {
        id: '1',
        name: '营养快线原味500ml',
        spec: '500ml/瓶',
        price: 4.5,
        quantity: 2,
        image: 'https://via.placeholder.com/160x160?text=营养快线'
      },
      {
        id: '2',
        name: '乐事薯片青柠味135g',
        spec: '135g/袋',
        price: 6.8,
        quantity: 1,
        image: 'https://via.placeholder.com/160x160?text=乐事薯片'
      }
    ];
    
    // 计算商品总价
    const goodsTotal = mockCartItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
    
    this.setData({
      orderGoods: mockCartItems,
      goodsTotal: goodsTotal
    });
    
    // 计算实付金额
    this.calculateActualTotal();
    
    // 加载可用优惠券
    this.loadAvailableCoupons();
  },

  /**
   * 加载商品信息
   */
  async loadProductInfo() {
    try {
      const productApi = require('../../../api/product');
      const result = await productApi.getProductDetail(this.data.productId);
      
      if (result.code === 200 && result.data) {
        const product = result.data;
        
        // 构建订单商品信息
        const orderGoods = [{
          id: product.id,
          name: product.name,
          spec: product.spec || '',
          price: product.price,
          quantity: this.data.quantity,
          image: product.images[0] || '/assets/images/default-product.png'
        }];
        
        // 计算商品总价
    const goodsTotal = product.price * this.data.quantity;
    
    this.setData({
      orderGoods: orderGoods,
      goodsTotal: goodsTotal
    });
    
    // 计算实付金额
    this.calculateActualTotal();
    
    // 加载可用优惠券
    this.loadAvailableCoupons();
      }
    } catch (error) {
      console.error('加载商品信息失败:', error);
      wx.showToast({ title: '加载商品失败', icon: 'error' });
      
      // 使用模拟数据
      this.loadMockProductInfo();
    }
  },

  /**
   * 加载模拟商品信息（用于开发测试）
   */
  loadMockProductInfo() {
    // 模拟商品数据
    const mockProduct = {
      id: this.data.productId,
      name: '营养快线原味500ml',
      spec: '500ml/瓶',
      price: 4.5,
      quantity: this.data.quantity,
      image: 'https://via.placeholder.com/160x160?text=营养快线'
    };
    
    // 构建订单商品信息
    const orderGoods = [mockProduct];
    
    // 计算商品总价
    const goodsTotal = mockProduct.price * mockProduct.quantity;
    
    this.setData({
      orderGoods: orderGoods,
      goodsTotal: goodsTotal
    });
    
    // 计算实付金额
    this.calculateActualTotal();
    
    // 加载可用优惠券
    this.loadAvailableCoupons();
  },

  /**
   * 加载默认地址
   */
  async loadDefaultAddress() {
    try {
      // 这里应该调用地址API获取默认地址
      // const addressApi = require('../../../api/address');
      // const result = await addressApi.getDefaultAddress();
      // if (result.code === 200 && result.data) {
      //   this.setData({ selectedAddress: result.data });
      // }
      
      // 使用模拟地址数据
      this.setData({
        selectedAddress: {
          id: 1,
          name: '张三',
          phone: '13800138000',
          province: '黑龙江省',
          city: '哈尔滨市',
          district: '松北区',
          detailAddress: '黑龙江科技大学松北校区A栋宿舍101室'
        }
      });
    } catch (error) {
      console.error('加载默认地址失败:', error);
      // 默认不设置地址
      this.setData({ selectedAddress: null });
    }
  },

  /**
   * 选择地址
   */
  chooseAddress() {
    wx.navigateTo({
      url: '/pages/user/address/select',
      events: {
        // 监听地址选择事件
        addressSelected: (address) => {
          this.setData({ selectedAddress: address });
        }
      }
    });
  },

  /**
   * 选择配送方式
   */
  selectDelivery(e) {
    const delivery = e.currentTarget.dataset.delivery;
    this.setData({ selectedDelivery: delivery });
    // 重新计算实付金额
    this.calculateActualTotal();
  },

  /**
   * 选择支付方式
   */
  selectPayment(e) {
    const paymentId = e.currentTarget.dataset.paymentId;
    // 更新支付方式的选中状态
    const paymentMethods = this.data.paymentMethods.map(method => ({
      ...method,
      checked: method.id === paymentId
    }));
    
    this.setData({
      paymentMethods: paymentMethods,
      selectedPayment: paymentId
    });
  },

  /**
   * 订单备注输入
   */
  onRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  /**
   * 计算实付金额
   */
  calculateActualTotal() {
    const { goodsTotal, selectedCoupon, deliveryFee, selectedDelivery } = this.data;
    const delivery = deliveryFee[selectedDelivery];
    const couponDiscount = selectedCoupon ? selectedCoupon.amount : 0;
    const actualTotal = Math.max(0, (goodsTotal + delivery - couponDiscount)).toFixed(2);
    
    this.setData({
      couponDiscount: couponDiscount,
      actualTotal: actualTotal
    });
  },

  /**
   * 加载可用优惠券
   */
  loadAvailableCoupons() {
    const params = {
      amount: this.data.goodsTotal,
      orderType: 'product' // 根据实际订单类型调整
    };
    
    couponApi.getAvailableCoupons(params)
      .then(res => {
        this.setData({
          availableCoupons: res.data || []
        });
      })
      .catch(err => {
        console.error('加载可用优惠券失败:', err);
      });
  },

  /**
   * 选择优惠券
   */
  selectCoupon() {
    wx.navigateTo({
      url: `/pages/coupon/list/index?amount=${this.data.goodsTotal}&orderType=product`,
      events: {
        // 监听优惠券选择事件
        couponSelected: (coupon) => {
          this.setData({
            selectedCoupon: coupon
          });
          // 重新计算实付金额
          this.calculateActualTotal();
        }
      }
    });
  },

  /**
   * 提交订单
   */
  async submitOrder() {
    // 验证地址
    if (!this.data.selectedAddress) {
      wx.showToast({ title: '请选择收货地址', icon: 'none' });
      return;
    }
    
    // 验证商品信息
    if (this.data.orderGoods.length === 0) {
      wx.showToast({ title: '商品信息为空', icon: 'none' });
      return;
    }
    
    this.setData({ submitLoading: true });
    
    try {
      // 创建订单
      const orderData = {
        addressId: this.data.selectedAddress.id,
        deliveryType: this.data.selectedDelivery,
        paymentMethod: this.data.selectedPayment,
        remark: this.data.remark,
        items: this.data.orderGoods.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: this.data.actualTotal,
        couponId: this.data.selectedCoupon ? this.data.selectedCoupon.id : null,
        couponDiscount: this.data.couponDiscount
      };
      
      // 调用创建订单API
      const result = await orderApi.createOrder(orderData);
      
      if (result.code === 200 && result.data) {
        const order = result.data;
        
        // 跳转到订单详情页进行支付
        wx.navigateTo({
          url: `/pages/order/detail?id=${order.id}`,
          events: {
            // 监听支付成功事件
            paymentSuccess: (data) => {
              // 支付成功后，跳转到订单列表页
              wx.navigateTo({
                url: '/pages/order/list'
              });
            }
          }
        });
      } else {
        throw new Error(result.message || '创建订单失败');
      }
    } catch (error) {
      console.error('提交订单失败:', error);
      wx.showToast({ 
        title: error.message || '提交订单失败', 
        icon: 'error'
      });
    } finally {
      this.setData({ submitLoading: false });
    }
  },

  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack();
  }
});
