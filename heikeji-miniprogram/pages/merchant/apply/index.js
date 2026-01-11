// 商家入驻申请页面逻辑
const merchantApi = require('../../../api/merchant');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 申请表单数据
    formData: {
      // 基本信息
      merchantName: '',
      merchantType: '',
      businessLicense: '',
      licenseNo: '',
      legalPerson: '',
      idCard: '',
      phone: '',
      email: '',
      // 地址信息
      province: '',
      city: '',
      district: '',
      addressDetail: '',
      // 联系人信息
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      // 其他信息
      description: '',
      logo: '',
      coverImage: ''
    },
    // 表单验证错误信息
    errors: {},
    // 提交状态
    submitting: false,
    // 图片上传状态
    uploading: false,
    // 商家类型选项
    merchantTypes: [
      { value: 'restaurant', label: '餐饮商家' },
      { value: 'convenience', label: '便利店' },
      { value: 'supermarket', label: '超市' },
      { value: 'specialty', label: '特色店铺' },
      { value: 'other', label: '其他类型' }
    ],
    // 省市区选择器
    regions: ['请选择', '请选择', '请选择'],
    // 图片预览
    imagePreview: {
      businessLicense: '',
      logo: '',
      coverImage: ''
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
   * 选择商家类型
   */
  selectMerchantType: function (e) {
    const { value } = e.detail;
    this.setData({
      'formData.merchantType': value
    });
  },

  /**
   * 选择省市区
   */
  regionChange: function (e) {
    const { value } = e.detail;
    this.setData({
      regions: value,
      'formData.province': value[0],
      'formData.city': value[1],
      'formData.district': value[2]
    });
  },

  /**
   * 上传图片
   */
  uploadImage: function (e) {
    const { type } = e.currentTarget.dataset;
    const that = this;
    
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        that.setData({ uploading: true });
        
        // 模拟上传图片
        setTimeout(() => {
          that.setData({
            [`formData.${type}`]: tempFilePaths[0],
            [`imagePreview.${type}`]: tempFilePaths[0],
            uploading: false
          });
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
    const { type } = e.currentTarget.dataset;
    const imageUrl = this.data.imagePreview[type];
    
    if (imageUrl) {
      wx.previewImage({
        urls: [imageUrl],
        current: imageUrl
      });
    }
  },

  /**
   * 删除图片
   */
  deleteImage: function (e) {
    const { type } = e.currentTarget.dataset;
    this.setData({
      [`formData.${type}`]: '',
      [`imagePreview.${type}`]: ''
    });
  },

  /**
   * 表单验证
   */
  validateForm: function () {
    const { formData } = this.data;
    const errors = {};
    
    // 验证必填项
    if (!formData.merchantName.trim()) {
      errors.merchantName = '请输入商家名称';
    }
    
    if (!formData.merchantType) {
      errors.merchantType = '请选择商家类型';
    }
    
    if (!formData.businessLicense) {
      errors.businessLicense = '请上传营业执照';
    }
    
    if (!formData.licenseNo.trim()) {
      errors.licenseNo = '请输入营业执照注册号';
    }
    
    if (!formData.legalPerson.trim()) {
      errors.legalPerson = '请输入法定代表人';
    }
    
    if (!formData.idCard.trim()) {
      errors.idCard = '请输入法定代表人身份证号';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = '请输入联系电话';
    } else if (!/^1[3-9]\d{9}$/.test(formData.phone)) {
      errors.phone = '请输入正确的手机号';
    }
    
    if (!formData.contactName.trim()) {
      errors.contactName = '请输入联系人姓名';
    }
    
    if (!formData.contactPhone.trim()) {
      errors.contactPhone = '请输入联系人电话';
    } else if (!/^1[3-9]\d{9}$/.test(formData.contactPhone)) {
      errors.contactPhone = '请输入正确的联系人手机号';
    }
    
    if (!formData.province || formData.province === '请选择') {
      errors.province = '请选择省市区';
    }
    
    if (!formData.addressDetail.trim()) {
      errors.addressDetail = '请输入详细地址';
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
    
    merchantApi.applyMerchant(formData)
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
