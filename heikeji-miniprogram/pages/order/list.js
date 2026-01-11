// pages/order/list.js
Page({
  data: {
    // 订单状态筛选
    tabs: [
      { id: 'all', name: '全部' },
      { id: 'pending', name: '待付款' },
      { id: 'processing', name: '处理中' },
      { id: 'delivered', name: '配送中' },
      { id: 'completed', name: '已完成' },
      { id: 'cancelled', name: '已取消' }
    ],
    currentTab: 'all',
    
    // 订单列表数据
    orders: [],
    
    // 订单类型映射
    orderTypeMap: {
      takeout: '外卖',
      errand: '跑腿',
      product: '商品',
      courier: '快递'
    },
    
    // 订单状态映射
    orderStatusMap: {
      pending: { text: '待付款', color: '#ff9500' },
      processing: { text: '处理中', color: '#34aadc' },
      delivered: { text: '配送中', color: '#3cc51f' },
      completed: { text: '已完成', color: '#999999' },
      cancelled: { text: '已取消', color: '#999999' }
    }
  },

  onLoad: function(options) {
    // 初始化订单列表
    this.loadOrders();
  },

  onShow: function() {
    // 每次显示页面时刷新订单数据
    this.loadOrders();
  },

  /**
   * 切换订单状态筛选
   */
  onTabChange: function(e) {
    const tabId = e.currentTarget.dataset.id;
    this.setData({
      currentTab: tabId
    });
    this.loadOrders();
  },

  /**
   * 加载订单数据
   */
  loadOrders: function() {
    wx.showLoading({
      title: '加载中...'
    });

    // 模拟订单数据，实际项目中应该调用API获取
    const mockOrders = this.getMockOrders();
    
    // 根据当前选中的状态筛选订单
    const filteredOrders = mockOrders.filter(order => {
      if (this.data.currentTab === 'all') {
        return true;
      } else {
        return order.status === this.data.currentTab;
      }
    });

    // 格式化订单数据，添加显示所需的额外信息
    const formattedOrders = filteredOrders.map(order => {
      return {
        ...order,
        orderTypeText: this.data.orderTypeMap[order.orderType] || '未知',
        statusText: this.data.orderStatusMap[order.status]?.text || '未知状态',
        statusColor: this.data.orderStatusMap[order.status]?.color || '#999999',
        totalItems: order.items.reduce((sum, item) => sum + item.quantity, 0),
        actions: this.getOrderActions(order)
      };
    });

    this.setData({
      orders: formattedOrders
    });

    wx.hideLoading();
  },

  /**
   * 获取订单操作按钮
   */
  getOrderActions: function(order) {
    const actions = [];
    
    switch (order.status) {
      case 'pending':
        actions.push(
          { actionText: '取消订单', actionType: 'danger', action: 'cancel' },
          { actionText: '立即支付', actionType: 'primary', action: 'pay' }
        );
        break;
      case 'processing':
        actions.push(
          { actionText: '联系客服', actionType: 'default', action: 'contact' }
        );
        break;
      case 'delivered':
        actions.push(
          { actionText: '确认收货', actionType: 'primary', action: 'confirm' },
          { actionText: '查看配送', actionType: 'default', action: 'track' }
        );
        break;
      case 'completed':
        actions.push(
          { actionText: '评价', actionType: 'default', action: 'evaluate' },
          { actionText: '再次购买', actionType: 'primary', action: 'rebuy' }
        );
        break;
      case 'cancelled':
        actions.push(
          { actionText: '删除订单', actionType: 'default', action: 'delete' },
          { actionText: '重新下单', actionType: 'primary', action: 'rebuy' }
        );
        break;
      default:
        actions.push(
          { actionText: '查看详情', actionType: 'default', action: 'view' }
        );
    }
    
    return actions;
  },

  /**
   * 点击订单项，查看详情
   */
  onOrderTap: function(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order/detail?id=${orderId}`
    });
  },

  /**
   * 点击订单操作按钮
   */
  onActionTap: function(e) {
    const orderId = e.currentTarget.dataset.orderId;
    const action = e.currentTarget.dataset.action;
    
    // 阻止事件冒泡，避免触发订单项的点击事件
    e.stopPropagation();
    
    switch (action) {
      case 'pay':
        this.handlePay(orderId);
        break;
      case 'cancel':
        this.handleCancel(orderId);
        break;
      case 'confirm':
        this.handleConfirm(orderId);
        break;
      case 'contact':
        this.handleContact(orderId);
        break;
      case 'track':
        this.handleTrack(orderId);
        break;
      case 'evaluate':
        this.handleEvaluate(orderId);
        break;
      case 'rebuy':
        this.handleRebuy(orderId);
        break;
      case 'delete':
        this.handleDelete(orderId);
        break;
      case 'view':
        this.onOrderTap(e);
        break;
    }
  },

  /**
   * 处理支付
   */
  handlePay: function(orderId) {
    // 跳转到订单详情页进行支付
    wx.navigateTo({
      url: `/pages/order/detail?id=${orderId}`,
      events: {
        // 监听详情页的支付成功事件
        paymentSuccess: (data) => {
          // 刷新订单列表
          this.loadOrders();
        }
      }
    });
  },

  /**
   * 处理取消订单
   */
  handleCancel: function(orderId) {
    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          // 调用取消订单API
          this.loadOrders();
          wx.showToast({
            title: '订单已取消',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 处理确认收货
   */
  handleConfirm: function(orderId) {
    wx.showModal({
      title: '确认收货',
      content: '确定已收到商品吗？',
      success: (res) => {
        if (res.confirm) {
          // 调用确认收货API
          this.loadOrders();
          wx.showToast({
            title: '已确认收货',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 处理联系客服
   */
  handleContact: function(orderId) {
    wx.showModal({
      title: '联系客服',
      content: '跳转到客服页面',
      showCancel: false
    });
  },

  /**
   * 处理查看配送
   */
  handleTrack: function(orderId) {
    wx.showModal({
      title: '查看配送',
      content: '跳转到配送跟踪页面',
      showCancel: false
    });
  },

  /**
   * 处理评价
   */
  handleEvaluate: function(orderId) {
    wx.navigateTo({
      url: `/pages/order/evaluate?id=${orderId}`
    });
  },

  /**
   * 处理再次购买
   */
  handleRebuy: function(orderId) {
    // 根据订单类型跳转到对应的页面
    const order = this.data.orders.find(o => o.orderId === orderId);
    if (order) {
      if (order.orderType === 'takeout') {
        wx.navigateTo({
          url: `/pages/takeout/index`
        });
      } else if (order.orderType === 'errand') {
        wx.navigateTo({
          url: `/pages/errand/index`
        });
      } else {
        wx.navigateTo({
          url: `/pages/index`
        });
      }
    }
  },

  /**
   * 处理删除订单
   */
  handleDelete: function(orderId) {
    wx.showModal({
      title: '删除订单',
      content: '确定要删除该订单吗？',
      success: (res) => {
        if (res.confirm) {
          // 调用删除订单API
          this.loadOrders();
          wx.showToast({
            title: '订单已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 空订单时，去首页
   */
  onGoHome: function() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  /**
   * 获取模拟订单数据
   */
  getMockOrders: function() {
    return [
      {
        orderId: '10001',
        orderType: 'takeout',
        status: 'completed',
        createTime: '2024-12-15 12:30',
        items: [
          { name: '宫保鸡丁', quantity: 1, price: 28, image: '/assets/images/default-product.png' },
          { name: '米饭', quantity: 2, price: 2, image: '/assets/images/default-product.png' },
          { name: '可乐', quantity: 1, price: 5, image: '/assets/images/default-product.png' }
        ],
        totalAmount: 37
      },
      {
        orderId: '10002',
        orderType: 'errand',
        status: 'processing',
        createTime: '2024-12-15 14:45',
        items: [
          { name: '快递代取', quantity: 1, price: 5, image: '/assets/images/default-product.png' }
        ],
        totalAmount: 5
      },
      {
        orderId: '10003',
        orderType: 'product',
        status: 'pending',
        createTime: '2024-12-15 16:20',
        items: [
          { name: '笔记本电脑', quantity: 1, price: 5999, image: '/assets/images/default-product.png' }
        ],
        totalAmount: 5999
      },
      {
        orderId: '10004',
        orderType: 'takeout',
        status: 'delivered',
        createTime: '2024-12-15 18:30',
        items: [
          { name: '鱼香肉丝', quantity: 1, price: 25, image: '/assets/images/default-product.png' },
          { name: '米饭', quantity: 1, price: 2, image: '/assets/images/default-product.png' }
        ],
        totalAmount: 27
      },
      {
        orderId: '10005',
        orderType: 'courier',
        status: 'cancelled',
        createTime: '2024-12-14 10:15',
        items: [
          { name: '快递代取', quantity: 2, price: 8, image: '/assets/images/default-product.png' }
        ],
        totalAmount: 8
      },
      {
        orderId: '10006',
        orderType: 'product',
        status: 'completed',
        createTime: '2024-12-13 09:10',
        items: [
          { name: '手机壳', quantity: 2, price: 15, image: '/assets/images/default-product.png' },
          { name: '充电器', quantity: 1, price: 50, image: '/assets/images/default-product.png' }
        ],
        totalAmount: 80
      }
    ];
  }
});