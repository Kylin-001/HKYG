// 校园跑腿首页JS
const errandApi = require('../../../api/errand');

Page({
  data: {
    searchKeyword: '',
    currentService: 'all',
    currentServiceName: '全部',
    serviceTypes: [
      { type: 'all', name: '全部', icon: '/assets/icons/all.png' },
      { type: 'delivery', name: '代取快递', icon: '/assets/icons/courier.png' },
      { type: 'purchase', name: '代购', icon: '/assets/icons/purchase.png' },
      { type: 'help', name: '帮帮忙', icon: '/assets/icons/help.png' },
      { type: 'other', name: '其他', icon: '/assets/icons/other.png' }
    ],
    tasks: [],
    hasMore: true,
    page: 1,
    pageSize: 10,
    isLoading: false,
    searchTimer: null,
    lastSearchKeyword: '',
    lastServiceType: 'all'
  },

  onLoad() {
    this.loadTasks();
  },

  onShow() {
    // 页面显示时，只有当数据为空时才刷新
    if (this.data.tasks.length === 0) {
      this.setData({ page: 1, tasks: [] });
      this.loadTasks();
    }
  },

  onPullDownRefresh() {
    this.setData({ page: 1, tasks: [] });
    this.loadTasks().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom() {
    this.onLoadMore();
  },

  // 搜索输入事件 - 防抖处理
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    
    // 清除之前的定时器
    if (this.data.searchTimer) {
      clearTimeout(this.data.searchTimer);
    }
    
    // 设置新的定时器，500ms后执行搜索
    this.setData({
      searchTimer: setTimeout(() => {
        this.onSearch();
      }, 500)
    });
  },

  // 搜索事件
  onSearch() {
    const { searchKeyword, lastSearchKeyword, lastServiceType, currentService } = this.data;
    
    // 如果搜索关键词和服务类型都没有变化，不重新搜索
    if (searchKeyword === lastSearchKeyword && currentService === lastServiceType) {
      return;
    }
    
    this.setData({
      page: 1,
      tasks: [],
      lastSearchKeyword: searchKeyword,
      lastServiceType: currentService
    });
    
    this.loadTasks();
  },

  onServiceChange(e) {
    const serviceType = e.currentTarget.dataset.type;
    
    // 如果点击的是当前服务类型，不重新加载
    if (serviceType === this.data.currentService) {
      return;
    }
    
    const serviceName = this.data.serviceTypes.find(item => item.type === serviceType)?.name || '全部';
    this.setData({
      currentService: serviceType,
      currentServiceName: serviceName,
      page: 1,
      tasks: [],
      lastServiceType: serviceType
    });
    
    this.loadTasks();
  },

  onLoadMore() {
    if (this.data.hasMore && !this.data.isLoading) {
      this.setData({ page: this.data.page + 1 });
      this.loadTasks();
    }
  },

  async loadTasks() {
    // 防止重复加载
    if (this.data.isLoading) {
      return;
    }
    
    this.setData({ isLoading: true });

    try {
      const params = {
        page: this.data.page,
        pageSize: this.data.pageSize,
        type: this.data.currentService === 'all' ? null : this.data.currentService,
        keyword: this.data.searchKeyword,
        cache: this.data.page === 1 // 第一页数据缓存，后续页面不缓存
      };

      const result = await errandApi.getTaskList(params);

      const formattedTasks = this.formatTasks(result.data.list);

      this.setData({
        tasks: this.data.page === 1 ? formattedTasks : [...this.data.tasks, ...formattedTasks],
        hasMore: result.data.list.length === this.data.pageSize,
        isLoading: false
      });
    } catch (error) {
      console.error('加载任务列表失败:', error);
      const mockTasks = this.getMockTasks();
      this.setData({
        tasks: this.data.page === 1 ? mockTasks : [...this.data.tasks, ...mockTasks],
        hasMore: mockTasks.length === this.data.pageSize,
        isLoading: false
      });
    }
  },

  formatTasks(tasks) {
    return tasks.map(task => ({
      ...task,
      typeName: this.getTypeName(task.type),
      statusClass: this.getStatusClass(task.status),
      statusText: this.getStatusText(task.status)
    }));
  },

  getTypeName(type) {
    const typeMap = {
      'delivery': '代取快递',
      'purchase': '代购',
      'help': '帮帮忙',
      'other': '其他'
    };
    return typeMap[type] || '其他';
  },

  getStatusClass(status) {
    const statusMap = {
      1: 'pending',
      2: 'in-progress',
      3: 'completed',
      4: 'completed'
    };
    return statusMap[status] || 'pending';
  },

  getStatusText(status) {
    const statusMap = {
      1: '待接单',
      2: '进行中',
      3: '已完成',
      4: '已取消'
    };
    return statusMap[status] || '未知';
  },

  getMockTasks() {
    return [
      {
        id: 1,
        type: 'delivery',
        title: '取快递',
        description: '帮忙取一下中通快递的包裹，编号ZTO123456',
        pickupLocation: '中通快递点',
        deliveryLocation: '1号公寓楼下',
        price: 3,
        status: 1,
        claimCount: 2,
        createTime: '10分钟前'
      },
      {
        id: 2,
        type: 'purchase',
        title: '买早餐',
        description: '帮忙买一份豆浆油条送到教室',
        pickupLocation: '第一食堂',
        deliveryLocation: '教学楼A101',
        price: 5,
        status: 1,
        claimCount: 1,
        createTime: '15分钟前'
      },
      {
        id: 3,
        type: 'help',
        title: '搬东西',
        description: '帮忙把行李从宿舍搬到校门口',
        pickupLocation: '3号公寓',
        deliveryLocation: '学校南门',
        price: 10,
        status: 2,
        claimCount: 3,
        createTime: '30分钟前'
      }
    ];
  },

  navigateToPublish() {
    wx.navigateTo({
      url: '/pages/errand/request/index'
    });
  },

  navigateToDetail(e) {
    const taskId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/errand/detail/index?id=${taskId}`
    });
  }
});