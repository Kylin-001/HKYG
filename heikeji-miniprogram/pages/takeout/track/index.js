// 外卖订单追踪页面
const app = getApp();
const { get, put } = require('../../../utils/request');
const takeoutAPI = require('../../../api/takeout');

Page({
  data: {
    orderInfo: {}, // 订单详情
    orderId: '' // 订单ID
  },

  onLoad(options) {
    // 获取订单ID
    this.setData({
      orderId: options.id
    });
    
    // 加载订单详情
    this.loadOrderDetail();
  },

  onShow() {
    // 页面显示时重新加载数据，确保信息最新
    if (this.data.orderId) {
      this.loadOrderDetail();
    }
  },

  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack();
  },

  /**
   * 加载订单详情
   */
  loadOrderDetail() {
    const { orderId } = this.data;
    
    get(takeoutAPI.getTakeoutOrderDetail + `/${orderId}`, {}, {
      loading: true
    }).then(res => {
      if (res.code === 200) {
        const orderInfo = res.data;
        // 处理订单状态
        this.processOrderStatus(orderInfo);
        // 计算配送进度
        this.calculateDeliveryProgress(orderInfo);
        // 更新数据
        this.setData({
          orderInfo
        });
      }
    }).catch(err => {
      console.error('加载订单详情失败:', err);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    });
  },

  /**
   * 处理订单状态显示
   */
  processOrderStatus(orderInfo) {
    // 订单状态映射
    const orderStatusMap = {
      1: {
        text: '订单已提交',
        desc: '商家正在处理您的订单',
        color: '#999999',
        icon: '/assets/icons/order-submitted.png'
      },
      2: {
        text: '商家已接单',
        desc: '商家正在准备您的餐品',
        color: '#2196F3',
        icon: '/assets/icons/merchant-accepted.png'
      },
      3: {
        text: '正在配送',
        desc: '骑手正在配送您的餐品',
        color: '#FF9800',
        icon: '/assets/icons/delivering.png'
      },
      4: {
        text: '订单已完成',
        desc: '感谢您的惠顾，期待再次为您服务',
        color: '#4CAF50',
        icon: '/assets/icons/order-completed.png'
      },
      5: {
        text: '订单已取消',
        desc: '订单已取消',
        color: '#F44336',
        icon: '/assets/icons/order-canceled.png'
      }
    };
    
    // 处理订单状态
    const statusInfo = orderStatusMap[orderInfo.status] || {
      text: '未知状态',
      desc: '订单状态未知',
      color: '#999999',
      icon: '/assets/icons/unknown-status.png'
    };
    
    orderInfo.statusText = statusInfo.text;
    orderInfo.statusDesc = statusInfo.desc;
    orderInfo.statusColor = statusInfo.color;
    orderInfo.statusIcon = statusInfo.icon;
    
    // 处理时间格式
    if (orderInfo.createTime) {
      orderInfo.createTime = this.formatTime(orderInfo.createTime);
    }
    if (orderInfo.acceptTime) {
      orderInfo.acceptTime = this.formatTime(orderInfo.acceptTime);
    }
    if (orderInfo.deliveryStartTime) {
      orderInfo.deliveryStartTime = this.formatTime(orderInfo.deliveryStartTime);
    }
    if (orderInfo.completeTime) {
      orderInfo.completeTime = this.formatTime(orderInfo.completeTime);
    }
    if (orderInfo.estimatedDeliveryTime) {
      orderInfo.estimatedDeliveryTime = this.formatTime(orderInfo.estimatedDeliveryTime, true);
    }
  },

  /**
   * 计算配送进度
   */
  calculateDeliveryProgress(orderInfo) {
    // 根据订单状态计算进度
    let progress = 0;
    switch (orderInfo.status) {
      case 1: // 订单已提交
        progress = 25;
        break;
      case 2: // 商家已接单
        progress = 50;
        break;
      case 3: // 正在配送
        progress = 75;
        break;
      case 4: // 订单已完成
        progress = 100;
        break;
      case 5: // 订单已取消
        progress = 0;
        break;
      default:
        progress = 0;
    }
    orderInfo.deliveryProgress = progress;
  },

  /**
   * 格式化时间
   */
  formatTime(time, showTimeOnly = false) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    
    if (showTimeOnly) {
      return `${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
    }
    
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
  },

  /**
   * 前往骑手详情页
   */
  goToRiderDetail() {
    const { orderInfo } = this.data;
    if (orderInfo.riderId) {
      wx.navigateTo({
        url: `/pages/user/runner/detail?id=${orderInfo.riderId}`
      });
    }
  },

  /**
   * 联系骑手
   */
  contactRider() {
    const { orderInfo } = this.data;
    if (orderInfo.riderPhone) {
      wx.makePhoneCall({
        phoneNumber: orderInfo.riderPhone
      });
    } else {
      wx.showToast({
        title: '暂无联系方式',
        icon: 'none'
      });
    }
  },

  /**
   * 停止事件冒泡
   */
  stopPropagation() {
    // 阻止事件冒泡
  },

  /**
   * 取消订单
   */
  onCancelOrder() {
    const { orderId } = this.data;
    
    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          put(takeoutAPI.cancelTakeoutOrder + `/${orderId}`, {}, {
            loading: true
          }).then(res => {
            if (res.code === 200) {
              wx.showToast({
                title: '取消成功',
                icon: 'success'
              });
              // 重新加载数据
              this.loadOrderDetail();
            }
          }).catch(err => {
            console.error('取消订单失败:', err);
            wx.showToast({
              title: '操作失败',
              icon: 'none'
            });
          });
        }
      }
    });
  },

  /**
   * 确认收货
   */
  onConfirmReceived() {
    const { orderId } = this.data;
    
    wx.showModal({
      title: '确认收货',
      content: '确认已经收到您的餐品了吗？',
      success: (res) => {
        if (res.confirm) {
          put(takeoutAPI.confirmTakeoutOrder + `/${orderId}`, {}, {
            loading: true
          }).then(res => {
            if (res.code === 200) {
              wx.showToast({
                title: '确认成功',
                icon: 'success'
              });
              // 重新加载数据
              this.loadOrderDetail();
              // 跳转到评价页面
              setTimeout(() => {
                wx.navigateTo({
                  url: `/pages/order/evaluate?type=takeout&id=${orderId}&riderId=${this.data.orderInfo.riderId}`
                });
              }, 2000);
            }
          }).catch(err => {
            console.error('确认收货失败:', err);
            wx.showToast({
              title: '操作失败',
              icon: 'none'
            });
          });
        }
      }
    });
  }
});
