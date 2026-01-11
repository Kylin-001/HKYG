// pages/user/address-edit.js
Page({
  data: {
    // 操作模式：add 或 edit
    mode: 'add',
    // 地址ID
    addressId: '',
    // 表单数据
    formData: {
      name: '',
      phone: '',
      province: '',
      city: '',
      district: '',
      address: '',
      isDefault: false
    }
  },

  onLoad: function(options) {
    // 获取操作模式和地址ID
    const mode = options.mode || 'add';
    const addressId = options.id || '';
    
    this.setData({
      mode: mode
    });
    
    // 如果是编辑模式，加载地址数据
    if (mode === 'edit' && addressId) {
      this.setData({
        addressId: addressId
      });
      this.loadAddressData(addressId);
    }
  },

  /**
   * 加载地址数据（编辑模式下）
   */
  loadAddressData: function(addressId) {
    wx.showLoading({
      title: '加载中...'
    });

    // 模拟地址数据，实际项目中应该调用API获取
    const mockAddresses = this.getMockAddresses();
    const address = mockAddresses.find(item => item.addressId === addressId);
    
    if (address) {
      this.setData({
        formData: address
      });
    }

    wx.hideLoading();
  },

  /**
   * 输入框内容变化
   */
  onInputChange: function(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`formData.${field}`]: value
    });
  },

  /**
   * 文本域内容变化
   */
  onTextareaChange: function(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`formData.${field}`]: value
    });
  },

  /**
   * 选择地区
   */
  onChooseArea: function() {
    // 实际项目中应该使用微信的地区选择器或自定义地区选择组件
    wx.chooseLocation({
      success: (res) => {
        console.log('选择位置成功:', res);
        // 这里只是模拟选择了地区，实际需要解析地址获取省市区信息
        this.setData({
          'formData.province': '黑龙江省',
          'formData.city': '哈尔滨市',
          'formData.district': '松北区',
          'formData.address': this.data.formData.address + res.name
        });
      },
      fail: (err) => {
        console.log('选择位置失败:', err);
      }
    });
  },

  /**
   * 切换默认地址
   */
  onToggleDefault: function() {
    this.setData({
      'formData.isDefault': !this.data.formData.isDefault
    });
  },

  /**
   * 返回上一页
   */
  onBack: function() {
    wx.navigateBack();
  },

  /**
   * 保存地址
   */
  onSave: function() {
    this.onSubmit();
  },

  /**
   * 表单提交
   */
  onSubmit: function() {
    // 表单验证
    if (!this.validateForm()) {
      return;
    }
    
    wx.showLoading({
      title: '保存中...'
    });
    
    // 模拟保存地址，实际项目中应该调用API
    setTimeout(() => {
      wx.hideLoading();
      
      // 保存成功后返回上一页
      wx.showToast({
        title: this.data.mode === 'add' ? '新增成功' : '修改成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      });
    }, 1000);
  },

  /**
   * 表单验证
   */
  validateForm: function() {
    const { name, phone, province, city, district, address } = this.data.formData;
    
    if (!name.trim()) {
      wx.showToast({
        title: '请输入收货人姓名',
        icon: 'none'
      });
      return false;
    }
    
    if (!phone.trim()) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      });
      return false;
    }
    
    // 手机号格式验证
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return false;
    }
    
    if (!province || !city || !district) {
      wx.showToast({
        title: '请选择所在地区',
        icon: 'none'
      });
      return false;
    }
    
    if (!address.trim()) {
      wx.showToast({
        title: '请输入详细地址',
        icon: 'none'
      });
      return false;
    }
    
    return true;
  },

  /**
   * 获取模拟地址数据
   */
  getMockAddresses: function() {
    return [
      {
        addressId: '1',
        name: '张三',
        phone: '13800138000',
        province: '黑龙江省',
        city: '哈尔滨市',
        district: '松北区',
        address: '黑龙江科技大学主校区宿舍A栋101室',
        isDefault: true
      },
      {
        addressId: '2',
        name: '张三',
        phone: '13800138000',
        province: '黑龙江省',
        city: '哈尔滨市',
        district: '松北区',
        address: '黑龙江科技大学科技大厦B座205室',
        isDefault: false
      }
    ];
  }
});