// 快递代取评价页面JS
Page({
  data: {
    // 任务ID
    taskId: '',
    
    // 评分（1-5）
    rating: 0,
    
    // 评分文本
    ratingText: '请选择评分',
    
    // 评价标签列表
    tags: [
      { id: 1, name: '速度快' },
      { id: 2, name: '服务好' },
      { id: 3, name: '态度好' },
      { id: 4, name: '准时' },
      { id: 5, name: '包裹完好' },
      { id: 6, name: '效率高' }
    ],
    
    // 选中的标签ID列表
    selectedTags: [],
    
    // 评价内容
    comment: '',
    
    // 上传的图片列表
    images: [],
    
    // 评分文本映射
    ratingTextMap: {
      0: '请选择评分',
      1: '很差',
      2: '较差',
      3: '一般',
      4: '很好',
      5: '非常好'
    }
  },

  onLoad(options) {
    // 获取任务ID
    const taskId = options.id;
    if (taskId) {
      this.setData({
        taskId: taskId
      });
    }
  },

  /**
   * 设置评分
   */
  setRating(e) {
    const rating = parseInt(e.currentTarget.dataset.rating);
    this.setData({
      rating: rating,
      ratingText: this.data.ratingTextMap[rating]
    });
  },

  /**
   * 切换标签选择
   */
  toggleTag(e) {
    const tagId = parseInt(e.currentTarget.dataset.tagId);
    let selectedTags = [...this.data.selectedTags];
    
    if (selectedTags.includes(tagId)) {
      // 取消选择
      selectedTags = selectedTags.filter(id => id !== tagId);
    } else {
      // 添加选择
      selectedTags.push(tagId);
    }
    
    this.setData({
      selectedTags: selectedTags
    });
  },

  /**
   * 评价内容输入事件
   */
  onCommentInput(e) {
    this.setData({
      comment: e.detail.value
    });
  },

  /**
   * 选择图片
   */
  chooseImage() {
    const maxImages = 5;
    const remaining = maxImages - this.data.images.length;
    
    if (remaining <= 0) {
      wx.showToast({ title: '最多只能上传5张图片', icon: 'none' });
      return;
    }
    
    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      camera: 'back',
      success: (res) => {
        const tempFiles = res.tempFiles || res.tempFilePaths;
        const images = tempFiles.map(item => item.tempFilePath || item);
        
        this.setData({
          images: [...this.data.images, ...images]
        });
      },
      fail: (err) => {
        console.error('选择图片失败:', err);
      }
    });
  },

  /**
   * 删除图片
   */
  deleteImage(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    const images = [...this.data.images];
    images.splice(index, 1);
    
    this.setData({
      images: images
    });
  },

  /**
   * 表单验证
   */
  validateForm() {
    if (this.data.rating === 0) {
      wx.showToast({ title: '请选择评分', icon: 'none' });
      return false;
    }
    
    return true;
  },

  /**
   * 提交评价
   */
  async onSubmit() {
    // 表单验证
    if (!this.validateForm()) {
      return;
    }
    
    wx.showLoading({ title: '提交中...' });
    
    try {
      const courierApi = require('../../../api/courier');
      
      // 构建评价数据
      const ratingData = {
        rating: this.data.rating,
        tags: this.data.selectedTags,
        comment: this.data.comment,
        images: this.data.images
      };
      
      // 调用API提交评价
      const result = await courierApi.rateCourierTask(this.data.taskId, ratingData);
      
      wx.hideLoading();
      
      wx.showToast({
        title: '评价成功',
        icon: 'success',
        duration: 1500,
        success: () => {
          setTimeout(() => {
            wx.navigateBack({
              delta: 2 // 返回上上级页面（详情页）
            });
          }, 1500);
        }
      });
    } catch (error) {
      wx.hideLoading();
      console.error('评价失败:', error);
      wx.showToast({ title: '评价失败', icon: 'error' });
    }
  },

  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack();
  }
});
