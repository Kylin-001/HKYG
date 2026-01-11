// 跑腿进度追踪页面
const app = getApp();
const { get, put } = require('../../../utils/request');
const errandAPI = require('../../../api/errand');

Page({
  data: {
    taskInfo: {}, // 任务详情
    progressWidth: 0, // 进度条宽度
    errandId: '' // 跑腿订单ID
  },

  onLoad(options) {
    // 获取订单ID
    this.setData({
      errandId: options.id
    });
    
    // 加载任务详情
    this.loadTaskDetail();
  },

  onShow() {
    // 页面显示时重新加载数据，确保信息最新
    if (this.data.errandId) {
      this.loadTaskDetail();
    }
  },

  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack();
  },

  /**
   * 加载任务详情
   */
  loadTaskDetail() {
    const { errandId } = this.data;
    
    get(errandAPI.detail + `/${errandId}`, {}, {
      loading: true
    }).then(res => {
      if (res.code === 200) {
        const taskInfo = res.data;
        // 处理任务类型和状态
        this.processTaskInfo(taskInfo);
        // 计算进度条宽度
        this.calculateProgressWidth(taskInfo.status);
        // 更新数据
        this.setData({
          taskInfo
        });
      }
    }).catch(err => {
      console.error('加载任务详情失败:', err);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    });
  },

  /**
   * 处理任务类型和状态显示
   */
  processTaskInfo(taskInfo) {
    // 任务类型映射
    const taskTypeMap = {
      1: { name: '取快递', color: '#4CAF50' },
      2: { name: '代购', color: '#FF9800' },
      3: { name: '代办', color: '#2196F3' }
    };
    
    // 任务状态映射
    const taskStatusMap = {
      1: { text: '待接单', color: '#999999' },
      2: { text: '进行中', color: '#2196F3' },
      3: { text: '已完成', color: '#4CAF50' },
      4: { text: '已取消', color: '#F44336' }
    };
    
    // 处理任务类型
    const typeInfo = taskTypeMap[taskInfo.type] || { name: '未知类型', color: '#999999' };
    taskInfo.typeName = typeInfo.name;
    taskInfo.typeColor = typeInfo.color;
    
    // 处理任务状态
    const statusInfo = taskStatusMap[taskInfo.status] || { text: '未知状态', color: '#999999' };
    taskInfo.statusText = statusInfo.text;
    taskInfo.statusColor = statusInfo.color;
    
    // 处理时间格式
    if (taskInfo.createTime) {
      taskInfo.createTime = this.formatTime(taskInfo.createTime);
    }
    if (taskInfo.claimTime) {
      taskInfo.claimTime = this.formatTime(taskInfo.claimTime);
    }
    if (taskInfo.startTime) {
      taskInfo.startTime = this.formatTime(taskInfo.startTime);
    }
    if (taskInfo.completeTime) {
      taskInfo.completeTime = this.formatTime(taskInfo.completeTime);
    }
  },

  /**
   * 计算进度条宽度
   */
  calculateProgressWidth(status) {
    // 总共有4个步骤，每个步骤占25%
    let progressWidth = 0;
    switch (status) {
      case 1: // 待接单
        progressWidth = 25;
        break;
      case 2: // 进行中
        progressWidth = 50;
        break;
      case 3: // 已完成
        progressWidth = 100;
        break;
      case 4: // 已取消
        progressWidth = 25;
        break;
      default:
        progressWidth = 0;
    }
    this.setData({
      progressWidth
    });
  },

  /**
   * 格式化时间
   */
  formatTime(time) {
    const date = new Date(time);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day} ${hour < 10 ? '0' + hour : hour}:${minute < 10 ? '0' + minute : minute}`;
  },

  /**
   * 打开取件地点地图
   */
  openPickupMap() {
    const { taskInfo } = this.data;
    if (taskInfo.pickupLatitude && taskInfo.pickupLongitude) {
      wx.openLocation({
        latitude: parseFloat(taskInfo.pickupLatitude),
        longitude: parseFloat(taskInfo.pickupLongitude),
        name: taskInfo.pickupLocation,
        scale: 18
      });
    } else {
      wx.showToast({
        title: '该地点暂不支持地图查看',
        icon: 'none'
      });
    }
  },

  /**
   * 打开送达地点地图
   */
  openDeliveryMap() {
    const { taskInfo } = this.data;
    if (taskInfo.deliveryLatitude && taskInfo.deliveryLongitude) {
      wx.openLocation({
        latitude: parseFloat(taskInfo.deliveryLatitude),
        longitude: parseFloat(taskInfo.deliveryLongitude),
        name: taskInfo.deliveryLocation,
        scale: 18
      });
    } else {
      wx.showToast({
        title: '该地点暂不支持地图查看',
        icon: 'none'
      });
    }
  },

  /**
   * 前往跑腿员详情页
   */
  goToRunnerDetail() {
    const { taskInfo } = this.data;
    if (taskInfo.runnerId) {
      wx.navigateTo({
        url: `/pages/user/runner/detail?id=${taskInfo.runnerId}`
      });
    }
  },

  /**
   * 联系跑腿员
   */
  contactRunner() {
    const { taskInfo } = this.data;
    if (taskInfo.runnerPhone) {
      wx.makePhoneCall({
        phoneNumber: taskInfo.runnerPhone
      });
    } else {
      wx.showToast({
        title: '暂无联系方式',
        icon: 'none'
      });
    }
  },

  /**
   * 联系发布者
   */
  contactPublisher() {
    const { taskInfo } = this.data;
    if (taskInfo.publisherPhone) {
      wx.makePhoneCall({
        phoneNumber: taskInfo.publisherPhone
      });
    } else {
      wx.showToast({
        title: '暂无联系方式',
        icon: 'none'
      });
    }
  },

  /**
   * 确认完成
   */
  onConfirmComplete() {
    const { errandId } = this.data;
    
    wx.showModal({
      title: '确认完成',
      content: '确认该任务已完成吗？',
      success: (res) => {
        if (res.confirm) {
          put(errandAPI.complete + `/${errandId}`, {}, {
            loading: true
          }).then(res => {
            if (res.code === 200) {
              wx.showToast({
                title: '确认成功',
                icon: 'success'
              });
              // 重新加载数据
              this.loadTaskDetail();
            }
          }).catch(err => {
            console.error('确认完成失败:', err);
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
   * 评价
   */
  onEvaluate() {
    const { taskInfo } = this.data;
    wx.navigateTo({
      url: `/pages/order/evaluate?type=errand&id=${taskInfo.id}&runnerId=${taskInfo.runnerId}`
    });
  },

  /**
   * 再次发布
   */
  onBuyAgain() {
    const { taskInfo } = this.data;
    wx.navigateTo({
      url: `/pages/errand/request?template=${JSON.stringify({
        type: taskInfo.type,
        title: taskInfo.title,
        description: taskInfo.description,
        pickupLocation: taskInfo.pickupLocation,
        deliveryLocation: taskInfo.deliveryLocation,
        price: taskInfo.price
      })}`
    });
  },

  /**
   * 取消订单
   */
  onCancelTask() {
    const { errandId } = this.data;
    
    wx.showModal({
      title: '取消订单',
      content: '确定要取消该订单吗？',
      success: (res) => {
        if (res.confirm) {
          put(errandAPI.cancel + `/${errandId}`, {}, {
            loading: true
          }).then(res => {
            if (res.code === 200) {
              wx.showToast({
                title: '取消成功',
                icon: 'success'
              });
              // 重新加载数据
              this.loadTaskDetail();
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
  }
});
