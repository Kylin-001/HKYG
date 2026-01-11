// 订单详情页面JS
const orderApi = require('../../../api/order');
const paymentApi = require('../../../api/payment');

Page({
  data: {
    // 订单ID
    orderId: '',
    // 订单详情数据
    orderDetail: {},
    // 状态图标
    statusIcon: '',
    // 状态文字
    statusText: '',
    // 状态描述
    statusDescription: '',
    // 配送方式文本
    deliveryTypeText: '',
    // 支付方式文本
    paymentMethodText: ''
  },

  onLoad(options) {
    // 获取订单ID
    const orderId = options.id;
    if (orderId) {
      this.setData({ orderId: orderId });
      // 加载订单详情
      this.loadOrderDetail(orderId);
    }
  },

  onShow() {
    // 每次页面显示时重新加载订单详情，确保数据最新
    if (this.data.orderId) {
      this.loadOrderDetail(this.data.orderId);
    }
  },

  onPullDownRefresh() {
    // 下拉刷新订单详情
    if (this.data.orderId) {
      this.loadOrderDetail(this.data.orderId).then(() => {
        wx.stopPullDownRefresh();
      });
    } else {
      wx.stopPullDownRefresh();
    }
  },

  /**
   * 加载订单详情
   */
  async loadOrderDetail(orderId) {
    wx.showLoading({ title: '加载中...' });
    
    try {
      const result = await orderApi.getOrderDetail(orderId);
      
      if (result.code === 200 && result.data) {
        const orderDetail = result.data;
        
        // 设置订单状态信息
        this.setOrderStatusInfo(orderDetail.status);
        
        // 设置配送方式文本
        this.setDeliveryTypeText(orderDetail.deliveryType);
        
        // 设置支付方式文本
        this.setPaymentMethodText(orderDetail.paymentMethod);
        
        this.setData({
          orderDetail: orderDetail
        });
      }
    } catch (error) {
      console.error('加载订单详情失败:', error);
      wx.showToast({ title: '加载失败', icon: 'error' });
      
      // 使用模拟数据
      this.setData({
        orderDetail: this.getMockOrderDetail()
      });
      this.setOrderStatusInfo('pending');
      this.setDeliveryTypeText('normal');
      this.setPaymentMethodText('wechat');
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 设置订单状态信息
   */
  setOrderStatusInfo(status) {
    let statusIcon = '';
    let statusText = '';
    let statusDescription = '';
    
    switch (status) {
      case 'pending':
        statusIcon = '/assets/icons/order-pending.png';
        statusText = '待支付';
        statusDescription = '请在24小时内完成支付';
        break;
      case 'confirmed':
        statusIcon = '/assets/icons/order-confirmed.png';
        statusText = '待发货';
        statusDescription = '商家正在处理您的订单';
        break;
      case 'shipped':
        statusIcon = '/assets/icons/order-shipped.png';
        statusText = '待收货';
        statusDescription = '商品正在配送中，请耐心等待';
        break;
      case 'completed':
        statusIcon = '/assets/icons/order-completed.png';
        statusText = '已完成';
        statusDescription = '交易已完成，感谢您的购买';
        break;
      case 'cancelled':
        statusIcon = '/assets/icons/order-cancelled.png';
        statusText = '已取消';
        statusDescription = '订单已取消';
        break;
      default:
        statusIcon = '/assets/icons/order-pending.png';
        statusText = '未知状态';
        statusDescription = '';
    }
    
    this.setData({
      statusIcon: statusIcon,
      statusText: statusText,
      statusDescription: statusDescription
    });
  },

  /**
   * 设置配送方式文本
   */
  setDeliveryTypeText(deliveryType) {
    const deliveryTypeMap = {
      'normal': '普通配送',
      'fast': '快速配送',
      'self-pickup': '自提'
    };
    
    this.setData({
      deliveryTypeText: deliveryTypeMap[deliveryType] || '未知配送方式'
    });
  },

  /**
   * 设置支付方式文本
   */
  setPaymentMethodText(paymentMethod) {
    const paymentMethodMap = {
      'wechat': '微信支付',
      'alipay': '支付宝',
      'balance': '余额支付',
      'cod': '货到付款'
    };
    
    this.setData({
      paymentMethodText: paymentMethodMap[paymentMethod] || '未知支付方式'
    });
  },

  /**
   * 立即支付
   */
  async onPayOrder() {
    const { orderId, orderDetail } = this.data;
    
    try {
      // 调用支付API
      const payParams = await paymentApi.createPayment({
        orderId: orderId,
        amount: orderDetail.payAmount,
        paymentMethod: orderDetail.paymentMethod
      });
      
      // 调用微信支付
      wx.requestPayment({
        ...payParams,
        success: (res) => {
          // 支付成功
          wx.showToast({ title: '支付成功', icon: 'success' });
          // 刷新订单详情
          this.loadOrderDetail(orderId);
        },
        fail: (err) => {
          // 支付失败
          wx.showToast({ title: '支付失败', icon: 'error' });
        }
      });
    } catch (error) {
      console.error('创建支付失败:', error);
      wx.showToast({ title: '支付失败', icon: 'error' });
    }
  },

  /**
   * 取消订单
   */
  async onCancelOrder() {
    const orderId = this.data.orderId;
    
    wx.showModal({
      title: '确认取消',
      content: '确定要取消该订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await orderApi.cancelOrder(orderId);
            wx.showToast({ title: '取消成功', icon: 'success' });
            // 刷新订单详情
            this.loadOrderDetail(orderId);
          } catch (error) {
            console.error('取消订单失败:', error);
            wx.showToast({ title: '取消失败', icon: 'error' });
          }
        }
      }
    });
  },

  /**
   * 提醒发货
   */
  onRemindShip() {
    wx.showToast({ title: '已发送提醒', icon: 'success' });
    // 这里可以调用提醒发货API
  },

  /**
   * 查看物流
   */
  onCheckLogistics() {
    const orderId = this.data.orderId;
    wx.navigateTo({
      url: `/pages/order/logistics?id=${orderId}`
    });
  },

  /**
   * 确认收货
   */
  async onConfirmReceive() {
    const orderId = this.data.orderId;
    
    wx.showModal({
      title: '确认收货',
      content: '请确认您已收到商品，确认后将无法更改',
      success: async (res) => {
        if (res.confirm) {
          try {
            await orderApi.confirmReceive(orderId);
            wx.showToast({ title: '确认成功', icon: 'success' });
            // 刷新订单详情
            this.loadOrderDetail(orderId);
          } catch (error) {
            console.error('确认收货失败:', error);
            wx.showToast({ title: '确认失败', icon: 'error' });
          }
        }
      }
    });
  },

  /**
   * 评价
   */
  onEvaluate() {
    const orderId = this.data.orderId;
    wx.navigateTo({
      url: `/pages/order/evaluate?id=${orderId}`
    });
  },

  /**
   * 再次购买
   */
  onBuyAgain() {
    const { orderDetail } = this.data;
    // 将商品添加到购物车，然后跳转到购物车页面
    const app = getApp();
    
    orderDetail.items.forEach(item => {
      app.addToCart('product', {
        productId: item.productId,
        specId: item.specId || 1,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        image: item.image
      });
    });
    
    wx.showToast({ title: '已添加到购物车', icon: 'success' });
    // 跳转到购物车页面
    setTimeout(() => {
      wx.navigateTo({
        url: '/pages/cart/index'
      });
    }, 1500);
  },

  /**
   * 删除订单
   */
  async onDeleteOrder() {
    const orderId = this.data.orderId;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该订单吗？删除后将无法恢复',
      success: async (res) => {
        if (res.confirm) {
          try {
            await orderApi.deleteOrder(orderId);
            wx.showToast({ title: '删除成功', icon: 'success' });
            // 跳转到订单列表页
            wx.navigateTo({
              url: '/pages/order/list'
            });
          } catch (error) {
            console.error('删除订单失败:', error);
            wx.showToast({ title: '删除失败', icon: 'error' });
          }
        }
      }
    });
  },

  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack();
  },

  /**
   * 获取模拟订单详情数据
   */
  getMockOrderDetail() {
    return {
      id: this.data.orderId,
      orderNo: '202401010000001',
      status: 'pending',
      createTime: '2024-01-01 12:00:00',
      payTime: null,
      shipTime: null,
      receiveTime: null,
      cancelTime: null,
      totalAmount: 15.8,
      deliveryFee: 2.00,
      couponDiscount: 0,
      payAmount: 17.80,
      deliveryType: 'normal',
      paymentMethod: 'wechat',
      remark: '请尽快送达',
      address: {
        id: 1,
        name: '张三',
        phone: '13800138000',
        province: '黑龙江省',
        city: '哈尔滨市',
        district: '松北区',
        detailAddress: '黑龙江科技大学松北校区A栋宿舍101室'
      },
      items: [
        {
          id: '1',
          productId: '1',
          name: '营养快线原味500ml',
          spec: '500ml/瓶',
          price: 4.5,
          quantity: 2,
          image: 'https://via.placeholder.com/160x160?text=营养快线'
        },
        {
          id: '2',
          productId: '2',
          name: '乐事薯片青柠味135g',
          spec: '135g/袋',
          price: 6.8,
          quantity: 1,
          image: 'https://via.placeholder.com/160x160?text=乐事薯片'
        }
      ]
    };
  }
});