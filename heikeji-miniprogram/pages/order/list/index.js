// 订单列表页面JS
const orderApi = require('../../../api/order');
const paymentApi = require('../../../api/payment');

Page({
  data: {
    // 订单状态筛选
    statusFilter: [
      { label: '全部', value: '' },
      { label: '待支付', value: 'pending' },
      { label: '待发货', value: 'confirmed' },
      { label: '待收货', value: 'shipped' },
      { label: '已完成', value: 'completed' },
      { label: '已取消', value: 'cancelled' }
    ],
    // 当前选中的状态
    currentStatus: '',
    // 订单列表数据
    orderList: [],
    // 分页参数
    page: 1,
    pageSize: 10,
    // 是否有更多数据
    hasMore: true,
    // 加载状态
    loading: false
  },

  onLoad() {
    // 加载订单列表
    this.loadOrderList();
  },

  onPullDownRefresh() {
    // 下拉刷新，重置分页参数，重新加载数据
    this.setData({ page: 1, orderList: [], hasMore: true });
    this.loadOrderList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载更多数据
   */
  onLoadMore() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 });
      this.loadOrderList();
    }
  },

  /**
   * 加载订单列表
   */
  async loadOrderList() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      const params = {
        page: this.data.page,
        pageSize: this.data.pageSize,
        status: this.data.currentStatus
      };
      
      const result = await orderApi.getOrderList(params);
      
      if (result.code === 200) {
        const { list, total } = result.data;
        
        // 合并新数据到现有列表
        const orderList = this.data.page === 1 ? list : [...this.data.orderList, ...list];
        
        // 判断是否还有更多数据
        const hasMore = orderList.length < total;
        
        this.setData({
          orderList: orderList,
          hasMore: hasMore
        });
      }
    } catch (error) {
      console.error('加载订单列表失败:', error);
      wx.showToast({ title: '加载失败', icon: 'error' });
      
      // 使用模拟数据
      if (this.data.page === 1) {
        this.setData({
          orderList: this.getMockOrderList(),
          hasMore: false
        });
      }
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 切换订单状态筛选
   */
  onStatusChange(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({
      currentStatus: status,
      page: 1,
      orderList: [],
      hasMore: true
    });
    this.loadOrderList();
  },

  /**
   * 获取订单状态文本
   */
  getStatusText(status) {
    const statusMap = {
      'pending': '待支付',
      'confirmed': '待发货',
      'shipped': '待收货',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return statusMap[status] || '未知状态';
  },

  /**
   * 获取订单状态颜色
   */
  getStatusColor(status) {
    const colorMap = {
      'pending': '#ff9800',
      'confirmed': '#2196f3',
      'shipped': '#9c27b0',
      'completed': '#4caf50',
      'cancelled': '#f44336'
    };
    return colorMap[status] || '#666';
  },

  /**
   * 跳转到订单详情
   */
  goToOrderDetail(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order/detail?id=${orderId}`
    });
  },

  /**
   * 立即支付
   */
  async onPayOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    
    try {
      // 跳转到订单详情页进行支付
      wx.navigateTo({
        url: `/pages/order/detail?id=${orderId}`,
        events: {
          // 监听支付成功事件
          paymentSuccess: (data) => {
            // 支付成功后，刷新订单列表
            this.setData({ page: 1, orderList: [], hasMore: true });
            this.loadOrderList();
          }
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
  async onCancelOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认取消',
      content: '确定要取消该订单吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await orderApi.cancelOrder(orderId);
            wx.showToast({ title: '取消成功', icon: 'success' });
            // 刷新订单列表
            this.setData({ page: 1, orderList: [], hasMore: true });
            this.loadOrderList();
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
  onRemindShip(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showToast({ title: '已发送提醒', icon: 'success' });
    // 这里可以调用提醒发货API
  },

  /**
   * 查看物流
   */
  onCheckLogistics(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order/logistics?id=${orderId}`
    });
  },

  /**
   * 确认收货
   */
  async onConfirmReceive(e) {
    const orderId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认收货',
      content: '请确认您已收到商品，确认后将无法更改',
      success: async (res) => {
        if (res.confirm) {
          try {
            await orderApi.confirmReceive(orderId);
            wx.showToast({ title: '确认成功', icon: 'success' });
            // 刷新订单列表
            this.setData({ page: 1, orderList: [], hasMore: true });
            this.loadOrderList();
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
  onEvaluate(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/order/evaluate?id=${orderId}`
    });
  },

  /**
   * 再次购买
   */
  onBuyAgain(e) {
    const orderId = e.currentTarget.dataset.id;
    // 查找订单
    const order = this.data.orderList.find(item => item.id === orderId);
    if (order) {
      // 将商品添加到购物车
      const app = getApp();
      order.items.forEach(item => {
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
    }
  },

  /**
   * 删除订单
   */
  async onDeleteOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除该订单吗？删除后将无法恢复',
      success: async (res) => {
        if (res.confirm) {
          try {
            await orderApi.deleteOrder(orderId);
            wx.showToast({ title: '删除成功', icon: 'success' });
            // 刷新订单列表
            this.setData({ page: 1, orderList: [], hasMore: true });
            this.loadOrderList();
          } catch (error) {
            console.error('删除订单失败:', error);
            wx.showToast({ title: '删除失败', icon: 'error' });
          }
        }
      }
    });
  },

  /**
   * 去购物
   */
  goToShopping() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack();
  },

  /**
   * 获取模拟订单列表数据
   */
  getMockOrderList() {
    return [
      {
        id: '1',
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
      },
      {
        id: '2',
        orderNo: '202401020000002',
        status: 'completed',
        createTime: '2024-01-02 14:30:00',
        payTime: '2024-01-02 14:35:00',
        shipTime: '2024-01-02 15:00:00',
        receiveTime: '2024-01-02 16:00:00',
        cancelTime: null,
        totalAmount: 45.5,
        deliveryFee: 2.00,
        couponDiscount: 5.00,
        payAmount: 42.50,
        deliveryType: 'normal',
        paymentMethod: 'wechat',
        remark: '',
        items: [
          {
            id: '3',
            productId: '3',
            name: '晨光中性笔0.5mm黑色',
            spec: '10支装',
            price: 15.00,
            quantity: 3,
            image: 'https://via.placeholder.com/160x160?text=中性笔'
          }
        ]
      },
      {
        id: '3',
        orderNo: '202401030000003',
        status: 'shipped',
        createTime: '2024-01-03 10:00:00',
        payTime: '2024-01-03 10:05:00',
        shipTime: '2024-01-03 11:00:00',
        receiveTime: null,
        cancelTime: null,
        totalAmount: 29.8,
        deliveryFee: 2.00,
        couponDiscount: 0,
        payAmount: 31.80,
        deliveryType: 'normal',
        paymentMethod: 'alipay',
        remark: '请放在宿舍门口',
        items: [
          {
            id: '4',
            productId: '4',
            name: '清风抽纸100抽3层',
            spec: '20包',
            price: 29.8,
            quantity: 1,
            image: 'https://via.placeholder.com/160x160?text=抽纸'
          }
        ]
      }
    ];
  }
});