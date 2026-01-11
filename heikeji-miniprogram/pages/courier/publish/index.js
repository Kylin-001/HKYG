// 快递代取发布页面JS
Page({
  data: {
    // 表单数据
    formData: {
      expressCompany: '',
      trackingNumber: '',
      lockerId: '',
      lockerName: '',
      pickupCode: '',
      deliveryLocation: '',
      price: '',
      phone: '',
      remark: '',
      urgency: 'normal'
    },
    
    // 快递公司列表
    expressCompanies: ['顺丰快递', '京东物流', '中通快递', '圆通速递', '申通快递', '韵达快递', '百世快递', '极兔速递', 'EMS', '邮政快递'],
    
    // 快递柜列表
    lockers: [],
    
    // 快递公司选择器显示状态
    showExpressCompanyPicker: false,
    
    // 快递柜选择器显示状态
    showLockerPicker: false
  },

  onLoad() {
    // 加载快递柜列表
    this.loadLockers();
  },

  // 显示快递公司选择器
  showExpressCompanyPicker() {
    this.setData({
      showExpressCompanyPicker: true
    });
  },

  // 隐藏快递公司选择器
  hideExpressCompanyPicker() {
    this.setData({
      showExpressCompanyPicker: false
    });
  },

  // 显示快递柜选择器
  showLockerPicker() {
    this.setData({
      showLockerPicker: true
    });
  },

  // 隐藏快递柜选择器
  hideLockerPicker() {
    this.setData({
      showLockerPicker: false
    });
  },

  // 选择快递公司
  onExpressCompanyChange(e) {
    const index = e.detail.value;
    const expressCompany = this.data.expressCompanies[index];
    
    this.setData({
      'formData.expressCompany': expressCompany,
      showExpressCompanyPicker: false
    });
  },

  // 选择快递柜
  onLockerChange(e) {
    const index = e.detail.value;
    const locker = this.data.lockers[index];
    
    this.setData({
      'formData.lockerId': locker.id,
      'formData.lockerName': locker.name,
      showLockerPicker: false
    });
  },

  // 加载快递柜列表
  async loadLockers() {
    try {
      const courierApi = require('../../../api/courier');
      const result = await courierApi.getLockerList();
      
      this.setData({
        lockers: result.data.list
      });
    } catch (error) {
      console.error('加载快递柜列表失败:', error);
      
      // 使用模拟数据
      this.setData({
        lockers: this.getMockLockers()
      });
    }
  },

  // 选择位置
  chooseLocation() {
    wx.chooseLocation({
      success: (res) => {
        this.setData({
          'formData.deliveryLocation': res.name
        });
      },
      fail: (err) => {
        console.log('选择位置失败:', err);
      }
    });
  },

  // 输入框变化事件
  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`formData.${field}`]: value
    });
  },

  // 文本域变化事件
  onTextareaChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`formData.${field}`]: value
    });
  },

  // 设置价格
  setPrice(e) {
    const price = e.currentTarget.dataset.price;
    this.setData({
      'formData.price': price
    });
  },

  // 设置紧急程度
  setUrgency(e) {
    const urgency = e.currentTarget.dataset.urgency;
    this.setData({
      'formData.urgency': urgency
    });
  },

  // 表单验证
  validateForm() {
    const { expressCompany, trackingNumber, lockerId, pickupCode, deliveryLocation, price, phone } = this.data.formData;
    
    if (!expressCompany) {
      wx.showToast({ title: '请选择快递公司', icon: 'none' });
      return false;
    }
    
    if (!trackingNumber) {
      wx.showToast({ title: '请输入快递单号', icon: 'none' });
      return false;
    }
    
    if (!lockerId) {
      wx.showToast({ title: '请选择快递柜', icon: 'none' });
      return false;
    }
    
    if (!pickupCode) {
      wx.showToast({ title: '请输入取件码', icon: 'none' });
      return false;
    }
    
    if (!deliveryLocation) {
      wx.showToast({ title: '请选择配送地址', icon: 'none' });
      return false;
    }
    
    if (!price || parseFloat(price) <= 0) {
      wx.showToast({ title: '请输入有效的代取费用', icon: 'none' });
      return false;
    }
    
    if (!phone) {
      wx.showToast({ title: '请输入联系电话', icon: 'none' });
      return false;
    }
    
    // 手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return false;
    }
    
    return true;
  },

  // 表单提交
  async onSubmit() {
    // 表单验证
    if (!this.validateForm()) {
      return;
    }
    
    wx.showLoading({ title: '发布中...' });
    
    try {
      const courierApi = require('../../../api/courier');
      const result = await courierApi.createCourierTask(this.data.formData);
      
      wx.hideLoading();
      
      wx.showToast({
        title: '发布成功',
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
      console.error('发布失败:', error);
      wx.showToast({ title: '发布失败', icon: 'error' });
    }
  },

  // 点击发布按钮
  onPublish() {
    this.onSubmit();
  },

  // 返回上一页
  onBack() {
    wx.navigateBack();
  },

  /**
   * 获取模拟快递柜数据
   */
  getMockLockers() {
    return [
      { id: 1, name: '图书馆快递柜' },
      { id: 2, name: '食堂快递柜' },
      { id: 3, name: '教学楼快递柜' },
      { id: 4, name: '宿舍区快递柜' }
    ];
  }
});