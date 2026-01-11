// 跑腿员任务列表页面JS
const errandApi = require('../../../../api/errand');

Page({
  data: {
    // 任务类型选项
    taskTypes: ['全部', '代取快递', '代购', '帮帮忙', '其他'],
    typeIndex: 0,
    // 任务状态选项
    taskStatuses: ['全部', '待接单', '进行中', '已完成'],
    statusIndex: 0,
    // 搜索关键词
    searchKeyword: '',
    // 任务列表
    taskList: [],
    // 分页参数
    page: 1,
    pageSize: 10,
    // 是否有更多数据
    hasMore: true,
    // 加载状态
    loading: false
  },

  onLoad() {
    // 加载任务列表
    this.loadTaskList();
  },

  onPullDownRefresh() {
    // 下拉刷新，重置分页参数
    this.setData({ page: 1, taskList: [], hasMore: true });
    this.loadTaskList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载更多数据
   */
  onLoadMore() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({ page: this.data.page + 1 });
      this.loadTaskList();
    }
  },

  /**
   * 类型选择变化
   */
  onTypeChange(e) {
    const typeIndex = e.detail.value;
    this.setData({ 
      typeIndex: typeIndex,
      page: 1, 
      taskList: [], 
      hasMore: true 
    });
    this.loadTaskList();
  },

  /**
   * 状态选择变化
   */
  onStatusChange(e) {
    const statusIndex = e.detail.value;
    this.setData({ 
      statusIndex: statusIndex,
      page: 1, 
      taskList: [], 
      hasMore: true 
    });
    this.loadTaskList();
  },

  /**
   * 搜索输入事件
   */
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  /**
   * 搜索确认
   */
  onSearch() {
    this.setData({ page: 1, taskList: [], hasMore: true });
    this.loadTaskList();
  },

  /**
   * 清除搜索
   */
  onClearSearch() {
    this.setData({ 
      searchKeyword: '',
      page: 1, 
      taskList: [], 
      hasMore: true 
    });
    this.loadTaskList();
  },

  /**
   * 加载任务列表
   */
  async loadTaskList() {
    if (this.data.loading) return;
    
    this.setData({ loading: true });
    
    try {
      // 构建查询参数
      const params = {
        page: this.data.page,
        pageSize: this.data.pageSize,
        keyword: this.data.searchKeyword
      };
      
      // 根据选择的类型设置查询参数
      const typeIndex = this.data.typeIndex;
      if (typeIndex > 0) {
        const typeMap = { 1: 'delivery', 2: 'purchase', 3: 'help', 4: 'other' };
        params.type = typeMap[typeIndex];
      }
      
      // 根据选择的状态设置查询参数
      const statusIndex = this.data.statusIndex;
      if (statusIndex > 0) {
        const statusMap = { 1: 1, 2: 2, 3: 3 };
        params.status = statusMap[statusIndex];
      }
      
      const result = await errandApi.getTaskList(params);
      
      if (result.code === 200) {
        const { list, total } = result.data;
        
        // 格式化任务数据
        const formattedTasks = this.formatTasks(list);
        
        // 合并新数据到现有列表
        const taskList = this.data.page === 1 ? formattedTasks : [...this.data.taskList, ...formattedTasks];
        
        // 判断是否还有更多数据
        const hasMore = taskList.length < total;
        
        this.setData({
          taskList: taskList,
          hasMore: hasMore
        });
      }
    } catch (error) {
      console.error('加载任务列表失败:', error);
      // 使用模拟数据
      if (this.data.page === 1) {
        const mockTasks = this.getMockTasks();
        this.setData({
          taskList: mockTasks,
          hasMore: false
        });
      }
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 格式化任务数据
   */
  formatTasks(tasks) {
    return tasks.map(task => {
      // 根据任务类型设置颜色
      let typeColor = '#9c27b0'; // 默认其他类型颜色
      switch (task.type) {
        case 'delivery':
          typeColor = '#2196f3';
          break;
        case 'purchase':
          typeColor = '#4caf50';
          break;
        case 'help':
          typeColor = '#ff9800';
          break;
      }
      
      return {
        ...task,
        typeName: this.getTypeName(task.type),
        typeColor: typeColor,
        distance: this.calculateDistance(task)
      };
    });
  },

  /**
   * 获取任务类型名称
   */
  getTypeName(type) {
    const typeMap = {
      'delivery': '代取快递',
      'purchase': '代购',
      'help': '帮帮忙',
      'other': '其他'
    };
    return typeMap[type] || '其他';
  },

  /**
   * 计算距离（模拟）
   */
  calculateDistance(task) {
    // 模拟计算距离，实际应该根据经纬度计算
    return (Math.random() * 5 + 0.5).toFixed(1);
  },

  /**
   * 跳转到任务详情
   */
  goToTaskDetail(e) {
    const taskId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/errand/detail/index?id=${taskId}`
    });
  },

  /**
   * 接单
   */
  async claimTask(e) {
    const taskId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认接单',
      content: '确定要接下这个任务吗？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '接单中...' });
          
          try {
            // 调用接单API
            await errandApi.claimTask(taskId);
            
            wx.hideLoading();
            wx.showToast({ title: '接单成功', icon: 'success' });
            
            // 刷新任务列表
            this.setData({ page: 1, taskList: [], hasMore: true });
            this.loadTaskList();
          } catch (error) {
            wx.hideLoading();
            console.error('接单失败:', error);
            wx.showToast({ title: '接单失败', icon: 'error' });
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
   * 获取模拟任务数据
   */
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
        createTime: '10分钟前',
        typeName: '代取快递',
        typeColor: '#2196f3',
        distance: '1.2'
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
        createTime: '15分钟前',
        typeName: '代购',
        typeColor: '#4caf50',
        distance: '0.8'
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
        createTime: '30分钟前',
        typeName: '帮帮忙',
        typeColor: '#ff9800',
        distance: '2.5'
      },
      {
        id: 4,
        type: 'other',
        title: '打印文件',
        description: '帮忙打印一份资料，送到图书馆',
        pickupLocation: '打印店',
        deliveryLocation: '图书馆',
        price: 4,
        status: 1,
        claimCount: 0,
        createTime: '1小时前',
        typeName: '其他',
        typeColor: '#9c27b0',
        distance: '1.5'
      }
    ];
  }
});