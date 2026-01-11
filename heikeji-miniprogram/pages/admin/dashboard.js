// 数据统计页面逻辑
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 统计数据
    statistics: {
      totalOrders: 0,
      totalUsers: 0,
      totalProducts: 0,
      totalRevenue: 0
    },
    // 订单趋势数据
    orderTrend: [],
    // 用户趋势数据
    userTrend: [],
    // 商品销量排名
    productSales: [],
    // 加载状态
    loading: true,
    // 时间范围
    timeRange: 'week',
    // 图表数据
    chartData: {
      orderChart: null,
      userChart: null
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // 加载统计数据
    this.loadStatistics();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成后初始化图表
    setTimeout(() => {
      this.initCharts();
    }, 500);
  },

  /**
   * 加载统计数据
   */
  loadStatistics: function () {
    this.setData({ loading: true });
    
    // 模拟加载统计数据
    setTimeout(() => {
      // 模拟统计数据
      const mockStatistics = {
        totalOrders: 1258,
        totalUsers: 3245,
        totalProducts: 156,
        totalRevenue: 89562.50
      };
      
      // 模拟订单趋势数据（最近7天）
      const orderTrend = [
        { date: '12-10', count: 156, revenue: 12560.50 },
        { date: '12-11', count: 189, revenue: 15680.00 },
        { date: '12-12', count: 345, revenue: 28950.75 },
        { date: '12-13', count: 212, revenue: 17850.20 },
        { date: '12-14', count: 198, revenue: 16230.40 },
        { date: '12-15', count: 225, revenue: 18960.30 },
        { date: '12-16', count: 233, revenue: 19580.65 }
      ];
      
      // 模拟用户趋势数据（最近7天）
      const userTrend = [
        { date: '12-10', newUsers: 89, activeUsers: 456 },
        { date: '12-11', newUsers: 102, activeUsers: 512 },
        { date: '12-12', newUsers: 234, activeUsers: 789 },
        { date: '12-13', newUsers: 156, activeUsers: 623 },
        { date: '12-14', newUsers: 123, activeUsers: 545 },
        { date: '12-15', newUsers: 167, activeUsers: 689 },
        { date: '12-16', newUsers: 189, activeUsers: 723 }
      ];
      
      // 模拟商品销量排名
      const productSales = [
        { id: 'p1', name: '营养快线原味500ml', sales: 345, revenue: 1552.50 },
        { id: 'p2', name: '康师傅红烧牛肉面', sales: 289, revenue: 1445.00 },
        { id: 'p3', name: '可口可乐330ml', sales: 256, revenue: 768.00 },
        { id: 'p4', name: '脉动维生素饮料', sales: 212, revenue: 1060.00 },
        { id: 'p5', name: '乐事薯片', sales: 189, revenue: 945.00 }
      ];
      
      this.setData({
        statistics: mockStatistics,
        orderTrend: orderTrend,
        userTrend: userTrend,
        productSales: productSales,
        loading: false
      });
      
      // 更新图表数据
      this.updateCharts();
    }, 1000);
  },

  /**
   * 初始化图表
   */
  initCharts: function () {
    // 这里可以初始化微信小程序的图表组件
    // 由于微信小程序原生没有图表组件，这里使用模拟数据展示
    console.log('图表初始化完成');
  },

  /**
   * 更新图表数据
   */
  updateCharts: function () {
    // 更新图表数据逻辑
    console.log('图表数据更新完成');
  },

  /**
   * 切换时间范围
   */
  switchTimeRange: function (e) {
    const timeRange = e.currentTarget.dataset.range;
    this.setData({ timeRange: timeRange });
    // 重新加载对应时间范围的数据
    this.loadStatistics();
  },

  /**
   * 查看订单列表
   */
  viewOrders: function () {
    wx.navigateTo({
      url: '/pages/order/list'
    });
  },

  /**
   * 查看用户列表
   */
  viewUsers: function () {
    wx.showToast({
      title: '用户列表功能开发中',
      icon: 'none'
    });
  },

  /**
   * 查看商品列表
   */
  viewProducts: function () {
    wx.navigateTo({
      url: '/pages/product/list'
    });
  },

  /**
   * 查看商品详情
   */
  viewProductDetail: function (e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/detail?id=${productId}`
    });
  },

  /**
   * 刷新数据
   */
  refreshData: function () {
    this.loadStatistics();
  }
});
