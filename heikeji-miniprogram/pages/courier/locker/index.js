// 快递柜详情页面JS
Page({
  data: {
    // 快递柜详情数据
    locker: {
      id: '',
      name: '',
      location: '',
      status: '',
      statusText: '',
      statusClass: '',
      availableSlots: 0,
      totalSlots: 0,
      usageRate: 0,
      slotTypes: [],
      mapImage: ''
    }
  },

  onLoad(options) {
    // 获取快递柜ID
    const lockerId = options.id;
    if (lockerId) {
      this.loadLockerDetail(lockerId);
    }
  },

  /**
   * 加载快递柜详情
   */
  async loadLockerDetail(lockerId) {
    wx.showLoading({ title: '加载中...' });
    
    try {
      const courierApi = require('../../../api/courier');
      const result = await courierApi.getLockerDetail(lockerId);
      
      // 格式化快递柜数据
      const formattedLocker = this.formatLockerData(result.data);
      
      this.setData({
        locker: formattedLocker
      });
    } catch (error) {
      console.error('加载快递柜详情失败:', error);
      wx.showToast({ title: '加载失败', icon: 'error' });
      
      // 使用模拟数据
      this.setData({
        locker: this.getMockLockerData()
      });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 格式化快递柜数据
   */
  formatLockerData(lockerData) {
    // 状态文本和样式映射
    const statusMap = {
      'online': {
        text: '在线',
        class: 'online'
      },
      'offline': {
        text: '离线',
        class: 'offline'
      },
      'maintenance': {
        text: '维护中',
        class: 'maintenance'
      }
    };
    
    // 计算使用率
    const usageRate = Math.round(((lockerData.totalSlots - lockerData.availableSlots) / lockerData.totalSlots) * 100);
    
    // 如果没有格口类型数据，生成模拟数据
    const slotTypes = lockerData.slotTypes || [
      { type: '小格口', available: Math.round(lockerData.availableSlots * 0.6), total: Math.round(lockerData.totalSlots * 0.6) },
      { type: '中格口', available: Math.round(lockerData.availableSlots * 0.3), total: Math.round(lockerData.totalSlots * 0.3) },
      { type: '大格口', available: Math.round(lockerData.availableSlots * 0.1), total: Math.round(lockerData.totalSlots * 0.1) }
    ];
    
    // 计算每个格口类型的使用率
    const formattedSlotTypes = slotTypes.map(type => ({
      ...type,
      usageRate: Math.round(((type.total - type.available) / type.total) * 100)
    }));
    
    return {
      ...lockerData,
      statusText: statusMap[lockerData.status]?.text || '未知状态',
      statusClass: statusMap[lockerData.status]?.class || '',
      usageRate: usageRate,
      slotTypes: formattedSlotTypes
    };
  },

  /**
   * 导航到快递柜位置
   */
  navigateToLocation() {
    wx.openLocation({
      name: this.data.locker.name,
      address: this.data.locker.location,
      scale: 18
    });
  },

  /**
   * 发布代取任务
   */
  createTask() {
    // 跳转到发布页面，并传递快递柜信息
    wx.navigateTo({
      url: `/pages/courier/publish/index?lockerId=${this.data.locker.id}&lockerName=${this.data.locker.name}`
    });
  },

  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack();
  },

  /**
   * 获取模拟快递柜数据
   */
  getMockLockerData() {
    return {
      id: '1',
      name: '图书馆快递柜',
      location: '图书馆门口',
      status: 'online',
      statusText: '在线',
      statusClass: 'online',
      availableSlots: 120,
      totalSlots: 200,
      usageRate: 40,
      slotTypes: [
        { type: '小格口', available: 72, total: 120, usageRate: 40 },
        { type: '中格口', available: 36, total: 60, usageRate: 40 },
        { type: '大格口', available: 12, total: 20, usageRate: 40 }
      ],
      mapImage: ''
    };
  }
});
