// 快递代取详情页面JS
Page({
  data: {
    // 任务详情数据
    task: {
      id: '',
      status: '',
      statusText: '',
      statusDesc: '',
      statusClass: '',
      createTime: '',
      expectedCompleteTime: '',
      expressCompany: '',
      trackingNumber: '',
      lockerId: '',
      lockerName: '',
      pickupCode: '',
      deliveryLocation: '',
      price: '',
      phone: '',
      remark: '',
      urgency: '',
      urgencyText: '',
      timeline: [],
      canCancel: false,
      canClaim: false,
      canComplete: false,
      canConfirm: false,
      canRate: false
    }
  },

  onLoad(options) {
    // 获取任务ID
    const taskId = options.id;
    if (taskId) {
      this.loadTaskDetail(taskId);
    }
  },

  /**
   * 加载任务详情
   */
  async loadTaskDetail(taskId) {
    wx.showLoading({ title: '加载中...' });
    
    try {
      const courierApi = require('../../../api/courier');
      const result = await courierApi.getCourierTaskDetail(taskId);
      
      // 格式化任务数据
      const formattedTask = this.formatTaskData(result.data);
      
      this.setData({
        task: formattedTask
      });
    } catch (error) {
      console.error('加载任务详情失败:', error);
      wx.showToast({ title: '加载失败', icon: 'error' });
      
      // 使用模拟数据
      this.setData({
        task: this.getMockTaskData()
      });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 格式化任务数据
   */
  formatTaskData(taskData) {
    // 紧急程度文本映射
    const urgencyMap = {
      'normal': '普通',
      'urgent': '加急',
      'very-urgent': '特急'
    };
    
    // 状态文本和样式映射
    const statusMap = {
      'pending': {
        text: '待接单',
        desc: '等待骑手接单中',
        class: 'pending'
      },
      'claimed': {
        text: '已接单',
        desc: '骑手正在处理中',
        class: 'claimed'
      },
      'completed': {
        text: '已完成',
        desc: '任务已完成',
        class: 'completed'
      },
      'cancelled': {
        text: '已取消',
        desc: '任务已取消',
        class: 'cancelled'
      }
    };
    
    // 计算各种操作权限
    const canCancel = taskData.status === 'pending';
    const canClaim = taskData.status === 'pending';
    const canComplete = taskData.status === 'claimed';
    const canConfirm = taskData.status === 'completed' && !taskData.confirmed;
    const canRate = taskData.status === 'completed' && taskData.confirmed && !taskData.rated;
    
    return {
      ...taskData,
      statusText: statusMap[taskData.status]?.text || '未知状态',
      statusDesc: statusMap[taskData.status]?.desc || '',
      statusClass: statusMap[taskData.status]?.class || '',
      urgencyText: urgencyMap[taskData.urgency] || '普通',
      canCancel: canCancel,
      canClaim: canClaim,
      canComplete: canComplete,
      canConfirm: canConfirm,
      canRate: canRate
    };
  },

  /**
   * 取消任务
   */
  onCancel() {
    wx.showModal({
      title: '取消任务',
      content: '确定要取消这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          this.handleCancel();
        }
      }
    });
  },

  /**
   * 处理取消任务
   */
  async handleCancel() {
    wx.showLoading({ title: '取消中...' });
    
    try {
      const courierApi = require('../../../api/courier');
      await courierApi.cancelCourierTask(this.data.task.id);
      
      wx.hideLoading();
      
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });
    } catch (error) {
      wx.hideLoading();
      console.error('取消任务失败:', error);
      wx.showToast({ title: '取消失败', icon: 'error' });
    }
  },

  /**
   * 接单
   */
  onClaim() {
    wx.showModal({
      title: '接单',
      content: '确定要接这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          this.handleClaim();
        }
      }
    });
  },

  /**
   * 处理接单
   */
  async handleClaim() {
    wx.showLoading({ title: '接单中...' });
    
    try {
      const courierApi = require('../../../api/courier');
      await courierApi.claimCourierTask(this.data.task.id);
      
      wx.hideLoading();
      
      wx.showToast({
        title: '接单成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            this.loadTaskDetail(this.data.task.id);
          }, 1500);
        }
      });
    } catch (error) {
      wx.hideLoading();
      console.error('接单失败:', error);
      wx.showToast({ title: '接单失败', icon: 'error' });
    }
  },

  /**
   * 完成任务
   */
  onComplete() {
    wx.showModal({
      title: '完成任务',
      content: '确定已经完成这个任务吗？',
      success: (res) => {
        if (res.confirm) {
          this.handleComplete();
        }
      }
    });
  },

  /**
   * 处理完成任务
   */
  async handleComplete() {
    wx.showLoading({ title: '提交中...' });
    
    try {
      const courierApi = require('../../../api/courier');
      await courierApi.completeCourierTask(this.data.task.id);
      
      wx.hideLoading();
      
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            this.loadTaskDetail(this.data.task.id);
          }, 1500);
        }
      });
    } catch (error) {
      wx.hideLoading();
      console.error('提交失败:', error);
      wx.showToast({ title: '提交失败', icon: 'error' });
    }
  },

  /**
   * 确认完成
   */
  onConfirm() {
    wx.showModal({
      title: '确认完成',
      content: '确认已经收到快递吗？',
      success: (res) => {
        if (res.confirm) {
          this.handleConfirm();
        }
      }
    });
  },

  /**
   * 处理确认完成
   */
  async handleConfirm() {
    wx.showLoading({ title: '确认中...' });
    
    try {
      const courierApi = require('../../../api/courier');
      await courierApi.confirmCourierTask(this.data.task.id);
      
      wx.hideLoading();
      
      wx.showToast({
        title: '确认成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            this.loadTaskDetail(this.data.task.id);
          }, 1500);
        }
      });
    } catch (error) {
      wx.hideLoading();
      console.error('确认失败:', error);
      wx.showToast({ title: '确认失败', icon: 'error' });
    }
  },

  /**
   * 评价任务
   */
  onRate() {
    wx.navigateTo({
      url: `/pages/courier/rate/index?id=${this.data.task.id}`
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
  getMockTaskData() {
    return {
      id: '1',
      status: 'claimed',
      statusText: '已接单',
      statusDesc: '骑手正在处理中',
      statusClass: 'claimed',
      createTime: '2024-12-15 10:30',
      expectedCompleteTime: '2024-12-15 11:30',
      expressCompany: '顺丰快递',
      trackingNumber: 'SF1234567890',
      lockerId: 1,
      lockerName: '图书馆快递柜',
      pickupCode: '1234-5678',
      deliveryLocation: '主校区A栋宿舍',
      price: 3,
      phone: '13800138000',
      remark: '麻烦尽快取件，谢谢',
      urgency: 'normal',
      urgencyText: '普通',
      confirmed: false,
      rated: false,
      timeline: [
        {
          title: '任务已发布',
          time: '2024-12-15 10:30',
          desc: '用户发布了快递代取任务',
          isCurrent: false
        },
        {
          title: '任务已接单',
          time: '2024-12-15 10:35',
          desc: '骑手已接单，正在前往快递柜',
          isCurrent: true
        },
        {
          title: '任务已完成',
          time: '',
          desc: '骑手已完成任务，等待确认',
          isCurrent: false
        }
      ],
      canCancel: false,
      canClaim: false,
      canComplete: true,
      canConfirm: false,
      canRate: false
    };
  }
});