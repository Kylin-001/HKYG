// pages/user/edit.js
Page({
  data: {
    // 表单数据
    formData: {
      avatarUrl: '',
      nickName: '',
      studentId: '',
      campus: '',
      gender: '',
      phone: '',
      email: ''
    },
    
    // 校区列表
    campusList: [
      { id: 1, name: '主校区' },
      { id: 2, name: '东校区' },
      { id: 3, name: '南校区' },
      { id: 4, name: '西校区' },
      { id: 5, name: '北校区' }
    ],
    campusIndex: 0,
    
    // 性别列表
    genderList: ['男', '女', '保密'],
    genderIndex: 0
  },

  onLoad: function(options) {
    // 加载用户数据
    this.loadUserData();
  },

  /**
   * 加载用户数据
   */
  loadUserData: function() {
    wx.showLoading({
      title: '加载中...'
    });

    // 从本地缓存获取用户信息，实际项目中应该调用API获取
    const userInfo = wx.getStorageSync('userInfo') || {};
    
    // 设置表单数据
    this.setData({
      formData: {
        ...this.data.formData,
        ...userInfo
      }
    });

    // 设置校区和性别的默认选中值
    const campusIndex = this.data.campusList.findIndex(item => item.name === userInfo.campus) || 0;
    const genderIndex = this.data.genderList.indexOf(userInfo.gender) || 0;
    
    this.setData({
      campusIndex: campusIndex,
      genderIndex: genderIndex
    });

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
   * 选择头像
   */
  onChooseAvatar: function() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        if (tempFilePaths && tempFilePaths.length > 0) {
          this.setData({
            'formData.avatarUrl': tempFilePaths[0]
          });
          
          // 实际项目中应该上传头像到服务器
          this.uploadAvatar(tempFilePaths[0]);
        }
      },
      fail: (err) => {
        console.log('选择头像失败:', err);
      }
    });
  },

  /**
   * 上传头像（模拟）
   */
  uploadAvatar: function(filePath) {
    wx.showLoading({
      title: '上传中...'
    });
    
    // 模拟上传过程，实际项目中应该调用API上传
    setTimeout(() => {
      wx.hideLoading();
      
      // 模拟上传成功，返回服务器地址
      const serverUrl = 'https://example.com/avatar.jpg';
      this.setData({
        'formData.avatarUrl': serverUrl
      });
      
      wx.showToast({
        title: '头像上传成功',
        icon: 'success'
      });
    }, 1000);
  },

  /**
   * 校区选择变化
   */
  onCampusChange: function(e) {
    const index = e.detail.value;
    const campus = this.data.campusList[index].name;
    
    this.setData({
      campusIndex: index,
      'formData.campus': campus
    });
  },

  /**
   * 性别选择变化
   */
  onGenderChange: function(e) {
    const index = e.detail.value;
    const gender = this.data.genderList[index];
    
    this.setData({
      genderIndex: index,
      'formData.gender': gender
    });
  },

  /**
   * 返回上一页
   */
  onBack: function() {
    wx.navigateBack();
  },

  /**
   * 保存个人信息
   */
  onSave: function() {
    // 表单验证
    if (!this.validateForm()) {
      return;
    }
    
    wx.showLoading({
      title: '保存中...'
    });
    
    // 模拟保存个人信息，实际项目中应该调用API
    setTimeout(() => {
      wx.hideLoading();
      
      // 保存到本地缓存
      wx.setStorageSync('userInfo', this.data.formData);
      
      // 更新全局用户信息
      const app = getApp();
      app.globalData.userInfo = this.data.formData;
      
      // 保存成功后返回上一页
      wx.showToast({
        title: '保存成功',
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
    const { nickName, studentId, phone, email } = this.data.formData;
    
    // 昵称验证
    if (nickName && nickName.length > 20) {
      wx.showToast({
        title: '昵称不能超过20个字符',
        icon: 'none'
      });
      return false;
    }
    
    // 手机号验证（如果填写了）
    if (phone) {
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none'
        });
        return false;
      }
    }
    
    // 邮箱验证（如果填写了）
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        wx.showToast({
          title: '请输入正确的邮箱地址',
          icon: 'none'
        });
        return false;
      }
    }
    
    return true;
  }
});