// 跑腿任务详情页JS
Page({
  data: {
    taskId: null,
    task: {}
  },

  onLoad(options) {
    this.setData({ taskId: options.id });
    this.loadTaskDetail();
  },

  async loadTaskDetail() {
    wx.showLoading({ title: '加载中...' });

    try {
      const errandApi = require('../../../api/errand');
      const result = await errandApi.getTaskDetail(this.data.taskId);
      const task = this.formatTask(result.data);

      this.setData({ task });
    } catch (error) {
      console.error('加载任务详情失败:', error);
      const mockTask = this.getMockTask();
      this.setData({ task: mockTask });
    } finally {
      wx.hideLoading();
    }
  },

  formatTask(task) {
    return {
      ...task,
      typeName: this.getTypeName(task.type),
      statusClass: this.getStatusClass(task.status),
      statusText: this.getStatusText(task.status),
      urgencyText: this.getUrgencyText(task.urgency),
      totalPrice: (task.price + (task.rewardBonus || 0)).toFixed(2)
    };
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

  getUrgencyText(urgency) {
    const urgencyMap = {
      'normal': '',
      'urgent': '加急任务 - 1小时内完成',
      'very-urgent': '特急任务 - 30分钟内完成'
    };
    return urgencyMap[urgency] || '';
  },

  getMockTask() {
    return {
      id: 1,
      type: 'delivery',
      typeName: '代取快递',
      title: '取快递',
      description: '帮忙取一下中通快递的包裹，编号ZTO123456，放在快递柜3号柜',
      pickupLocation: '中通快递点',
      deliveryLocation: '1号公寓楼下',
      price: 3,
      rewardBonus: 0,
      totalPrice: '3.00',
      status: 1,
      statusClass: 'pending',
      statusText: '待接单',
      urgency: 'normal',
      urgencyText: '',
      publisherName: '张三',
      publisherAvatar: '',
      publisherTaskCount: 15,
      publisherRating: 98,
      createTime: '2024-01-05 10:30',
      claimTime: null,
      completeTime: null,
      isPublisher: false,
      hasClaimed: false
    };
  },

  openMap(e) {
    const type = e.currentTarget.dataset.type;
    const task = this.data.task;
    let latitude, longitude, name, address;

    if (type === 'pickup') {
      latitude = task.pickupLatitude || 45.7859;
      longitude = task.pickupLongitude || 126.6494;
      name = task.pickupLocation;
      address = task.pickupLocation;
    } else {
      latitude = task.deliveryLatitude || 45.7860;
      longitude = task.deliveryLongitude || 126.6495;
      name = task.deliveryLocation;
      address = task.deliveryLocation;
    }

    wx.openLocation({
      latitude,
      longitude,
      name,
      address
    });
  },

  contactPublisher() {
    wx.makePhoneCall({
      phoneNumber: '13800138000'
    });
  },

  contactRunner() {
    wx.makePhoneCall({
      phoneNumber: '13900139000'
    });
  },

  shareTask() {
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  async claimTask() {
    wx.showModal({
      title: '确认接单',
      content: '确定要接下这个任务吗？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '接单中...' });

          try {
            const errandApi = require('../../../api/errand');
            await errandApi.claimTask(this.data.taskId);

            wx.hideLoading();
            wx.showToast({
              title: '接单成功',
              icon: 'success',
              duration: 2000,
              success: () => {
                this.loadTaskDetail();
              }
            });
          } catch (error) {
            wx.hideLoading();
            wx.showToast({
              title: '接单失败',
              icon: 'error'
            });
          }
        }
      }
    });
  },

  async completeTask() {
    wx.showModal({
      title: '确认完成',
      content: '确认任务已完成吗？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '提交中...' });

          try {
            const errandApi = require('../../../api/errand');
            await errandApi.completeTask(this.data.taskId);

            wx.hideLoading();
            wx.showToast({
              title: '任务完成',
              icon: 'success',
              duration: 2000,
              success: () => {
                this.loadTaskDetail();
              }
            });
          } catch (error) {
            wx.hideLoading();
            wx.showToast({
              title: '提交失败',
              icon: 'error'
            });
          }
        }
      }
    });
  },

  async cancelTask() {
    wx.showModal({
      title: '取消任务',
      content: '确定要取消这个任务吗？',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '取消中...' });

          try {
            const errandApi = require('../../../api/errand');
            await errandApi.cancelTask(this.data.taskId);

            wx.hideLoading();
            wx.showToast({
              title: '已取消',
              icon: 'success',
              duration: 2000,
              success: () => {
                wx.navigateBack();
              }
            });
          } catch (error) {
            wx.hideLoading();
            wx.showToast({
              title: '取消失败',
              icon: 'error'
            });
          }
        }
      }
    });
  },

  async abandonTask() {
    wx.showModal({
      title: '放弃任务',
      content: '确定要放弃这个任务吗？可能会影响您的信用评分',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '处理中...' });

          try {
            const errandApi = require('../../../api/errand');
            await errandApi.abandonTask(this.data.taskId);

            wx.hideLoading();
            wx.showToast({
              title: '已放弃',
              icon: 'success',
              duration: 2000,
              success: () => {
                wx.navigateBack();
              }
            });
          } catch (error) {
            wx.hideLoading();
            wx.showToast({
              title: '操作失败',
              icon: 'error'
            });
          }
        }
      }
    });
  }
});