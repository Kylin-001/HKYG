// pages/order/detail.js
const { getPaymentStatus, createPayment, wechatPay } = require('../../api/payment');
const { getUserOrders } = require('../../api/user');
const { formatTime, getOrderStatusText, getOrderTypeText, getPaymentStatusText } = require('../../utils/utils');

Page({
  data: {
    orderId: '',
    orderDetail: null,
    loading: true,
    paymentMethods: [
      { id: 'wechat', name: '微信支付', icon: '/assets/icons/wechat-pay.png', checked: true },
      { id: 'alipay', name: '支付宝', icon: '/assets/icons/alipay.png', checked: false },
      { id: 'balance', name: '余额支付', icon: '/assets/icons/wallet.png', checked: false }
    ],
    isPaymentModalVisible: false,
    paymentLoading: false
  },

  /**
   * 格式化时间，供WXML调用
   */
  formatTime: formatTime,

  /**
   * 获取订单状态文本，供WXML调用
   */
  getOrderStatusText: getOrderStatusText,

  /**
   * 获取订单类型文本，供WXML调用
   */
  getOrderTypeText: getOrderTypeText,

  /**
   * 获取支付状态文本，供WXML调用
   */
  getPaymentStatusText: getPaymentStatusText,

  onLoad: function (options) {
    if (options.id) {
      this.setData({ orderId: options.id });
      this.loadOrderDetail();
    }
  },

  onShow: function () {
    if (this.data.orderId) {
      this.loadOrderDetail();
    }
  },

  /**
   * 加载订单详情
   */
  loadOrderDetail: function () {
    this.setData({ loading: true });
    
    getUserOrders({ id: this.data.orderId })
      .then(res => {
        if (res.code === 200 && res.data) {
          this.setData({ orderDetail: res.data });
          // 如果订单已支付，检查支付状态
          if (res.data.status === 'PAID' || res.data.status === 'COMPLETED') {
            this.checkPaymentStatus();
          }
        } else {
          wx.showToast({
            title: '订单不存在',
            icon: 'none'
          });
        }
      })
      .catch(err => {
        console.error('加载订单失败:', err);
        wx.showToast({
          title: '加载失败',
          icon: 'none'
        });
      })
      .finally(() => {
        this.setData({ loading: false });
      });
  },

  /**
   * 检查支付状态
   */
  checkPaymentStatus: function () {
    getPaymentStatus(this.data.orderId)
      .then(res => {
        if (res.code === 200) {
          // 更新订单状态
          this.setData({
            'orderDetail.paymentStatus': res.data.status
          });
        }
      })
      .catch(err => {
        console.error('检查支付状态失败:', err);
      });
  },

  /**
   * 打开支付选择弹窗
   */
  openPaymentModal: function () {
    this.setData({ isPaymentModalVisible: true });
  },

  /**
   * 关闭支付选择弹窗
   */
  closePaymentModal: function () {
    this.setData({ isPaymentModalVisible: false });
  },

  /**
   * 选择支付方式
   */
  selectPaymentMethod: function (e) {
    const methodId = e.currentTarget.dataset.id;
    const paymentMethods = this.data.paymentMethods.map(method => ({
      ...method,
      checked: method.id === methodId
    }));
    this.setData({ paymentMethods });
  },

  /**
   * 确认支付
   */
  confirmPayment: function () {
    const selectedMethod = this.data.paymentMethods.find(method => method.checked);
    
    if (!selectedMethod) {
      wx.showToast({
        title: '请选择支付方式',
        icon: 'none'
      });
      return;
    }

    this.setData({ paymentLoading: true });
    
    // 准备订单数据
    const orderData = {
      orderType: this.data.orderDetail.orderType,
      orderId: this.data.orderDetail.id,
      amount: this.data.orderDetail.totalAmount,
      paymentMethod: selectedMethod.id
    };

    // 创建支付订单
    createPayment(orderData)
      .then(res => {
        if (res.code === 200 && res.data) {
          // 根据支付方式调用不同的支付接口
          if (selectedMethod.id === 'wechat') {
            // 调用微信支付
            return wechatPay(res.data);
          } else if (selectedMethod.id === 'alipay') {
            // 支付宝支付（需要调用支付宝SDK）
            wx.showToast({
              title: '支付宝支付功能开发中',
              icon: 'none'
            });
            return Promise.reject({ message: '支付宝支付未实现' });
          } else if (selectedMethod.id === 'balance') {
            // 余额支付
            wx.showToast({
              title: '余额支付处理中',
              icon: 'loading'
            });
            // 模拟余额支付成功
            return Promise.resolve({});
          }
        } else {
          throw new Error(res.message || '创建支付订单失败');
        }
      })
      .then(() => {
        // 支付成功
        this.closePaymentModal();
        wx.showToast({
          title: '支付成功',
          icon: 'success'
        });
        // 重新加载订单状态
        setTimeout(() => {
          this.loadOrderDetail();
        }, 1000);
      })
      .catch(err => {
        console.error('支付失败:', err);
        if (err.errMsg !== 'requestPayment:fail cancel') {
          wx.showToast({
            title: err.message || '支付失败',
            icon: 'none'
          });
        }
      })
      .finally(() => {
        this.setData({ paymentLoading: false });
      });
  },

  /**
   * 取消订单
   */
  cancelOrder: function () {
    wx.showModal({
      title: '确认取消',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          // 调用取消订单API
          wx.showLoading({ title: '处理中' });
          // 模拟取消订单
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({ title: '订单已取消' });
            this.loadOrderDetail();
          }, 1000);
        }
      }
    });
  },

  /**
   * 确认收货
   */
  confirmReceipt: function () {
    wx.showModal({
      title: '确认收货',
      content: '确定已收到商品吗？',
      success: (res) => {
        if (res.confirm) {
          // 调用确认收货API
          wx.showLoading({ title: '处理中' });
          // 模拟确认收货
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({ title: '收货成功' });
            this.loadOrderDetail();
          }, 1000);
        }
      }
    });
  },

  /**
   * 申请退款
   */
  applyRefund: function () {
    wx.navigateTo({
      url: `/pages/order/refund?id=${this.data.orderId}`
    });
  },

  /**
   * 拨打电话给商家
   */
  callMerchant: function () {
    if (this.data.orderDetail && this.data.orderDetail.merchantPhone) {
      wx.makePhoneCall({
        phoneNumber: this.data.orderDetail.merchantPhone
      });
    }
  },

  /**
   * 联系客服
   */
  contactCustomerService: function () {
    wx.showModal({
      title: '客服电话',
      content: '客服电话：400-123-4567',
      showCancel: true,
      confirmText: '拨打电话',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '4001234567'
          });
        }
      }
    });
  }
});