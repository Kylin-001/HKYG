// 团长招募申请页面逻辑
const captainApi = require('../../../api/captain');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 申请表单数据
    formData: {
      // 基本信息
      name: '',
      phone: '',
      email: '',
      studentId: '',
      school: '',
      major: '',
      grade: '',
      // 团队信息
      teamName: '',
      teamSize: '',
      teamDescription: '',
      // 经验信息
      hasExperience: false,
      experienceDescription: '',
      // 联系方式
      wechat: '',
      qq: '',
      // 其他信息
      motivation: '',
      expectations: '',
      // 证明材料
      idCardFront: '',
      idCardBack: '',
      studentCard: '',
      otherCertificates: []
    },
    // 表单验证错误信息
    errors: {},
    // 提交状态
    submitting: false,
    // 图片上传状态
    uploading: false,
    // 年级选项
    gradeOptions: ['大一', '大二', '大三', '大四', '研究生', '其他'],
    // 图片预览
    imagePreview: {
      idCardFront: '',
      idCardBack: '',
      studentCard: '',
      otherCertificates: []
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 可以从options中获取参数
  },

  /**
   * 输入表单数据
   */
  inputChange: function (e) {
    const { field } = e.currentTarget.dataset;
    const { value } = e.detail;
    
    this.setData({
      [`formData.${field}`]: value
    });
    
    // 清除对应字段的错误信息
    if (this.data.errors[field]) {
      this.setData({
        [`errors.${field}`]: ''
      });
    }
  },

  /**
   * 选择年级
   */
  selectGrade: function (e) {
    const { value } = e.detail;
    this.setData({
      'formData.grade': this.data.gradeOptions[value]
    });
  },

  /**
   * 切换是否有经验
   */
  toggleExperience: function (e) {
    const { value } = e.detail;
    this.setData({
      'formData.hasExperience': value
    });
  },

  /**
   * 上传图片
   */
  uploadImage: function (e) {
    const { type, index } = e.currentTarget.dataset;
    const that = this;
    
    wx.chooseImage({
      count: type === 'otherCertificates' ? 5 - this.data.formData.otherCertificates.length : 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        that.setData({ uploading: true });
        
        // 模拟上传图片
        setTimeout(() => {
          if (type === 'otherCertificates') {
            // 多张图片上传
            const otherCertificates = [...that.data.formData.otherCertificates, ...tempFilePaths];
            const otherPreview = [...that.data.imagePreview.otherCertificates, ...tempFilePaths];
            that.setData({
              'formData.otherCertificates': otherCertificates,
              'imagePreview.otherCertificates': otherPreview,
              uploading: false
            });
          } else {
            // 单张图片上传
            that.setData({
              [`formData.${type}`]: tempFilePaths[0],
              [`imagePreview.${type}`]: tempFilePaths[0],
              uploading: false
            });
          }
        }, 1000);
      },
      fail: () => {
        that.setData({ uploading: false });
      }
    });
  },

  /**
   * 预览图片
   */
  previewImage: function (e) {
    const { type, index } = e.currentTarget.dataset;
    let imageUrl = '';
    let urls = [];
    
    if (type === 'otherCertificates') {
      imageUrl = this.data.imagePreview.otherCertificates[index];
      urls = this.data.imagePreview.otherCertificates;
    } else {
      imageUrl = this.data.imagePreview[type];
      urls = [imageUrl];
    }
    
    if (imageUrl) {
      wx.previewImage({
        urls: urls,
        current: imageUrl
      });
    }
  },

  /**
   * 删除图片
   */
  deleteImage: function (e) {
    const { type, index } = e.currentTarget.dataset;
    
    if (type === 'otherCertificates') {
      // 删除多张图片中的一张
      const otherCertificates = [...this.data.formData.otherCertificates];
      const otherPreview = [...this.data.imagePreview.otherCertificates];
      otherCertificates.splice(index, 1);
      otherPreview.splice(index, 1);
      
      this.setData({
        'formData.otherCertificates': otherCertificates,
        'imagePreview.otherCertificates': otherPreview
      });
    } else {
      // 删除单张图片
      this.setData({
        [`formData.${type}`]: '',
        [`imagePreview.${type}`]: ''
      });
    }
  },

  /**
   * 表单验证
   */
  validateForm: function () {
    const { formData } = this.data;
    const errors = {};
    
    // 验证必填项
    if (!formData.name.trim()) {
      errors.name = '请输入姓名';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = '请输入手机号';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      errors.phone = '请输入正确的手机号';
    }
    
    if (!formData.studentId.trim()) {
      errors.studentId = '请输入学生证号';
    }
    
    if (!formData.school.trim()) {
      errors.school = '请输入学校名称';
    }
    
    if (!formData.major.trim()) {
      errors.major = '请输入专业名称';
    }
    
    if (!formData.grade) {
      errors.grade = '请选择年级';
    }
    
    if (!formData.wechat.trim()) {
      errors.wechat = '请输入微信号';
    }
    
    if (!formData.teamName.trim()) {
      errors.teamName = '请输入团队名称';
    }
    
    if (!formData.teamSize.trim()) {
      errors.teamSize = '请输入团队人数';
    } else if (!/^\d+$/.test(formData.teamSize)) {
      errors.teamSize = '请输入正确的团队人数';
    }
    
    if (!formData.motivation.trim()) {
      errors.motivation = '请输入申请动机';
    }
    
    if (!formData.idCardFront) {
      errors.idCardFront = '请上传身份证正面';
    }
    
    if (!formData.idCardBack) {
      errors.idCardBack = '请上传身份证反面';
    }
    
    if (!formData.studentCard) {
      errors.studentCard = '请上传学生证';
    }
    
    this.setData({ errors: errors });
    return Object.keys(errors).length === 0;
  },

  /**
   * 提交申请
   */
  submitApply: function () {
    if (!this.validateForm()) {
      return;
    }
    
    this.setData({ submitting: true });
    
    const { formData } = this.data;
    
    captainApi.applyCaptain(formData)
      .then(res => {
        this.setData({ submitting: false });
        
        wx.showToast({
          title: '申请提交成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(() => {
              // 返回上一页
              wx.navigateBack();
            }, 2000);
          }
        });
      })
      .catch(err => {
        this.setData({ submitting: false });
        wx.showToast({
          title: '申请提交失败',
          icon: 'none'
        });
      });
  },

  /**
   * 返回上一页
   */
  onBack: function () {
    wx.navigateBack();
  }
});
