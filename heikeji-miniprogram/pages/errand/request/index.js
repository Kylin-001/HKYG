// 跑腿任务发布页JS
Page({
  data: {
    formData: {
      type: 'delivery',
      title: '',
      description: '',
      pickupLocation: '',
      pickupLatitude: null,
      pickupLongitude: null,
      deliveryLocation: '',
      deliveryLatitude: null,
      deliveryLongitude: null,
      price: '',
      phone: '',
      remark: '',
      urgency: 'normal'
    }
  },

  onLoad() {
    this.loadUserPhone();
  },

  loadUserPhone() {
    const app = getApp();
    if (app.globalData.userInfo && app.globalData.userInfo.phone) {
      this.setData({
        'formData.phone': app.globalData.userInfo.phone
      });
    }
  },

  selectType(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({
      'formData.type': type
    });
  },

  onTitleInput(e) {
    this.setData({
      'formData.title': e.detail.value
    });
  },

  onDescInput(e) {
    this.setData({
      'formData.description': e.detail.value
    });
  },

  onPriceInput(e) {
    this.setData({
      'formData.price': e.detail.value
    });
  },

  onPhoneInput(e) {
    this.setData({
      'formData.phone': e.detail.value
    });
  },

  onRemarkInput(e) {
    this.setData({
      'formData.remark': e.detail.value
    });
  },

  setPrice(e) {
    const price = e.currentTarget.dataset.price;
    this.setData({
      'formData.price': price.toString()
    });
  },

  setUrgency(e) {
    const urgency = e.currentTarget.dataset.urgency;
    this.setData({
      'formData.urgency': urgency
    });
  },

  chooseLocation(e) {
    const field = e.currentTarget.dataset.field;
    wx.chooseLocation({
      success: (res) => {
        if (field === 'pickup') {
          this.setData({
            'formData.pickupLocation': res.name || res.address,
            'formData.pickupLatitude': res.latitude,
            'formData.pickupLongitude': res.longitude
          });
        } else {
          this.setData({
            'formData.deliveryLocation': res.name || res.address,
            'formData.deliveryLatitude': res.latitude,
            'formData.deliveryLongitude': res.longitude
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '请手动输入地点',
          icon: 'none'
        });
      }
    });
  },

  validateForm() {
    const { type, title, description, pickupLocation, deliveryLocation, price, phone } = this.data.formData;

    if (!title.trim()) {
      wx.showToast({ title: '请输入任务标题', icon: 'none' });
      return false;
    }

    if (!description.trim()) {
      wx.showToast({ title: '请输入任务详情', icon: 'none' });
      return false;
    }

    if (!pickupLocation) {
      wx.showToast({ title: '请选择取件地点', icon: 'none' });
      return false;
    }

    if (!deliveryLocation) {
      wx.showToast({ title: '请选择送达地点', icon: 'none' });
      return false;
    }

    if (!price || parseFloat(price) <= 0) {
      wx.showToast({ title: '请输入有效的跑腿费', icon: 'none' });
      return false;
    }

    if (!/^1\d{10}$/.test(phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'none' });
      return false;
    }

    return true;
  },

  async submitForm() {
    if (!this.validateForm()) return;

    wx.showLoading({ title: '发布中...' });

    try {
      const errandApi = require('../../../api/errand');
      const taskData = {
        type: this.data.formData.type,
        title: this.data.formData.title,
        description: this.data.formData.description,
        pickupLocation: this.data.formData.pickupLocation,
        pickupLatitude: this.data.formData.pickupLatitude,
        pickupLongitude: this.data.formData.pickupLongitude,
        deliveryLocation: this.data.formData.deliveryLocation,
        deliveryLatitude: this.data.formData.deliveryLatitude,
        deliveryLongitude: this.data.formData.deliveryLongitude,
        price: parseFloat(this.data.formData.price),
        phone: this.data.formData.phone,
        remark: this.data.formData.remark,
        urgency: this.data.formData.urgency
      };

      const result = await errandApi.createTask(taskData);

      wx.hideLoading();
      wx.showToast({
        title: '发布成功',
        icon: 'success',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        }
      });
    } catch (error) {
      wx.hideLoading();
      console.error('发布任务失败:', error);
      wx.showToast({
        title: '发布失败，请重试',
        icon: 'none',
        duration: 1500
      });
    }
  }
});