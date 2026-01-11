// 快递代取首页JS
Page({
  data: {
    // 搜索关键词
    searchKeyword: '',
    
    // 当前导航标签
    currentNav: 'tasks',
    
    // 我的任务当前标签
    currentMyTab: 'published',
    
    // 任务列表数据
    tasks: [],
    
    // 快递柜列表数据
    lockers: [],
    
    // 我的任务数据
    myTasks: [],
    
    // 是否有更多数据
    hasMore: true,
    
    // 当前页码
    page: 1,
    
    // 每页条数
    pageSize: 10
  },

  onLoad() {
    // 页面加载时获取任务列表
    this.loadTasks();
    
    // 加载快递柜列表
    this.loadLockers();
  },

  onShow() {
    // 页面显示时刷新数据
    this.setData({ page: 1, tasks: [] });
    this.loadTasks();
  },

  // 搜索输入事件
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 搜索事件
  onSearch() {
    this.setData({ page: 1, tasks: [] });
    this.loadTasks();
  },

  // 切换导航
  switchNav(e) {
    const nav = e.currentTarget.dataset.nav;
    this.setData({
      currentNav: nav,
      page: 1
    });
    
    // 切换不同的导航时加载对应的数据
    if (nav === 'tasks') {
      this.loadTasks();
    } else if (nav === 'express') {
      this.loadLockers();
    } else if (nav === 'my') {
      this.loadMyTasks();
    }
  },

  // 切换我的任务标签
  switchMyTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentMyTab: tab,
      page: 1,
      myTasks: []
    });
    this.loadMyTasks();
  },

  // 加载更多
  onLoadMore() {
    if (this.data.hasMore) {
      this.setData({ page: this.data.page + 1 });
      
      if (this.data.currentNav === 'tasks') {
        this.loadTasks();
      } else if (this.data.currentNav === 'my') {
        this.loadMyTasks();
      }
    }
  },

  // 加载任务列表
  async loadTasks() {
    wx.showLoading({ title: '加载中...' });
    
    try {
      const courierApi = require('../../../api/courier');
      const params = {
        page: this.data.page,
        pageSize: this.data.pageSize,
        keyword: this.data.searchKeyword
      };
      
      const result = await courierApi.getCourierTaskList(params);
      
      this.setData({
        tasks: this.data.page === 1 ? result.data.list : [...this.data.tasks, ...result.data.list],
        hasMore: result.data.list.length === this.data.pageSize
      });
    } catch (error) {
      console.error('加载任务列表失败:', error);
      wx.showToast({ title: '加载失败', icon: 'error' });
      
      // 使用模拟数据
      this.setData({
        tasks: this.getMockTasks(),
        hasMore: false
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 加载快递柜列表
  async loadLockers() {
    wx.showLoading({ title: '加载中...' });
    
    try {
      const courierApi = require('../../../api/courier');
      const result = await courierApi.getLockerList();
      
      this.setData({
        lockers: result.data.list
      });
    } catch (error) {
      console.error('加载快递柜列表失败:', error);
      wx.showToast({ title: '加载失败', icon: 'error' });
      
      // 使用模拟数据
      this.setData({
        lockers: this.getMockLockers()
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 加载我的任务
  async loadMyTasks() {
    wx.showLoading({ title: '加载中...' });
    
    try {
      const courierApi = require('../../../api/courier');
      const params = {
        page: this.data.page,
        pageSize: this.data.pageSize
      };
      
      let result;
      if (this.data.currentMyTab === 'published') {
        result = await courierApi.getMyPublishedCourierTasks(params);
      } else {
        result = await courierApi.getMyClaimedCourierTasks(params);
      }
      
      this.setData({
        myTasks: this.data.page === 1 ? result.data.list : [...this.data.myTasks, ...result.data.list],
        hasMore: result.data.list.length === this.data.pageSize
      });
    } catch (error) {
      console.error('加载我的任务失败:', error);
      wx.showToast({ title: '加载失败', icon: 'error' });
      
      // 使用模拟数据
      this.setData({
        myTasks: this.getMockMyTasks(),
        hasMore: false
      });
    } finally {
      wx.hideLoading();
    }
  },

  // 跳转到发布页面
  navigateToPublish() {
    wx.navigateTo({
      url: '/pages/courier/publish/index'
    });
  },

  // 跳转到任务详情
  navigateToDetail(e) {
    const taskId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/courier/detail/index?id=${taskId}`
    });
  },

  // 跳转到快递柜详情
  navigateToLockerDetail(e) {
    const lockerId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/courier/locker/index?id=${lockerId}`
    });
  },

  /**
   * 获取模拟任务数据
   */
  getMockTasks() {
    return [
      {
        id: 1,
        expressCompany: '顺丰快递',
        trackingNumber: 'SF1234567890',
        lockerName: '图书馆快递柜',
        pickupCode: '1234-5678',
        deliveryLocation: '主校区A栋宿舍',
        price: 3,
        status: 'pending',
        statusText: '待接单',
        statusClass: 'pending',
        createTime: '2024-12-15 10:30'
      },
      {
        id: 2,
        expressCompany: '京东物流',
        trackingNumber: 'JD0987654321',
        lockerName: '食堂快递柜',
        pickupCode: '8765-4321',
        deliveryLocation: '东校区B栋宿舍',
        price: 5,
        status: 'claimed',
        statusText: '已接单',
        statusClass: 'claimed',
        createTime: '2024-12-15 09:15'
      },
      {
        id: 3,
        expressCompany: '中通快递',
        trackingNumber: 'ZT1122334455',
        lockerName: '教学楼快递柜',
        pickupCode: '5566-7788',
        deliveryLocation: '主校区C栋宿舍',
        price: 4,
        status: 'pending',
        statusText: '待接单',
        statusClass: 'pending',
        createTime: '2024-12-15 08:45'
      }
    ];
  },

  /**
   * 获取模拟快递柜数据
   */
  getMockLockers() {
    return [
      {
        id: 1,
        name: '图书馆快递柜',
        location: '图书馆门口',
        status: 'online',
        availableSlots: 120,
        totalSlots: 200
      },
      {
        id: 2,
        name: '食堂快递柜',
        location: '第一食堂门口',
        status: 'online',
        availableSlots: 80,
        totalSlots: 150
      },
      {
        id: 3,
        name: '教学楼快递柜',
        location: '主教学楼门口',
        status: 'offline',
        availableSlots: 0,
        totalSlots: 100
      },
      {
        id: 4,
        name: '宿舍区快递柜',
        location: 'A栋宿舍楼下',
        status: 'online',
        availableSlots: 95,
        totalSlots: 120
      }
    ];
  },

  /**
   * 获取模拟我的任务数据
   */
  getMockMyTasks() {
    return [
      {
        id: 4,
        expressCompany: '申通快递',
        trackingNumber: 'ST5566778899',
        lockerName: '图书馆快递柜',
        pickupCode: '3344-5566',
        deliveryLocation: '主校区A栋宿舍',
        price: 3,
        status: 'completed',
        statusText: '已完成',
        statusClass: 'completed',
        createTime: '2024-12-14 14:30'
      },
      {
        id: 5,
        expressCompany: '韵达快递',
        trackingNumber: 'YD9988776655',
        lockerName: '食堂快递柜',
        pickupCode: '7788-9900',
        deliveryLocation: '东校区B栋宿舍',
        price: 4,
        status: 'pending',
        statusText: '待接单',
        statusClass: 'pending',
        createTime: '2024-12-15 11:20'
      }
    ];
  }
});