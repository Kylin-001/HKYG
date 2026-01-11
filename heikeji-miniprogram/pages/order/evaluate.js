// 评价页面逻辑
const commentApi = require('../../api/comment');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 订单ID
    orderId: '',
    // 订单信息
    orderInfo: null,
    // 评价项目列表
    evaluateItems: [],
    // 整体评分
    overallRating: 5,
    // 评价内容
    content: '',
    // 评价图片
    images: [],
    // 服务评分
    serviceRating: 5,
    // 配送评分
    deliveryRating: 5,
    // 提交状态
    submitting: false,
    // 图片上传状态
    uploading: false,
    // 加载状态
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取订单ID
    const orderId = options.id;
    if (orderId) {
      this.setData({ orderId: orderId });
      // 加载订单信息
      this.loadOrderInfo();
    } else {
      wx.showToast({
        title: '订单ID无效',
        icon: 'none',
        duration: 2000,
        success: () => {
          setTimeout(() => {
            wx.navigateBack();
          }, 2000);
        }
      });
    }
  },

  /**
   * 加载订单信息
   */
  loadOrderInfo: function () {
    this.setData({ loading: true });
    
    // 模拟加载订单信息
    setTimeout(() => {
      // 模拟订单数据
      const mockOrder = {
        id: this.data.orderId,
        orderType: 'product',
        status: 'completed',
        items: [
          {
            id: '1',
            productId: 'p1',
            name: '营养快线原味500ml',
            image: 'https://via.placeholder.com/160x160?text=营养快线',
            quantity: 1,
            price: 4.5
          },
          {
            id: '2',
            productId: 'p2',
            name: '康师傅红烧牛肉面',
            image: 'https://via.placeholder.com/160x160?text=康师傅',
            quantity: 2,
            price: 5.0
          }
        ],
        createTime: '2024-12-15 12:30'
      };
      
      // 初始化评价项目
      const evaluateItems = mockOrder.items.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        image: item.image,
        rating: 5,
        content: ''
      }));
      
      this.setData({
        orderInfo: mockOrder,
        evaluateItems: evaluateItems,
        loading: false
      });
    }, 1000);
  },

  /**
   * 选择评分
   */
  selectRating: function (e) {
    const { index, rating, type } = e.currentTarget.dataset;
    
    if (type === 'overall') {
      this.setData({
        overallRating: rating
      });
    } else if (type === 'service') {
      this.setData({
        serviceRating: rating
      });
    } else if (type === 'delivery') {
      this.setData({
        deliveryRating: rating
      });
    } else {
      // 商品评分
      const evaluateItems = [...this.data.evaluateItems];
      evaluateItems[index].rating = rating;
      this.setData({
        evaluateItems: evaluateItems
      });
    }
  },

  /**
   * 输入评价内容
   */
  inputContent: function (e) {
    this.setData({
      content: e.detail.value
    });
  },

  /**
   * 输入商品评价内容
   */
  inputItemContent: function (e) {
    const { index } = e.currentTarget.dataset;
    const evaluateItems = [...this.data.evaluateItems];
    evaluateItems[index].content = e.detail.value;
    this.setData({
      evaluateItems: evaluateItems
    });
  },

  /**
   * 选择图片
   */
  chooseImage: function () {
    const maxCount = 9 - this.data.images.length;
    if (maxCount <= 0) {
      wx.showToast({
        title: '最多只能上传9张图片',
        icon: 'none'
      });
      return;
    }
    
    wx.chooseImage({
      count: maxCount,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        this.setData({
          uploading: true
        });
        
        // 模拟上传图片
        setTimeout(() => {
          const images = [...this.data.images, ...tempFilePaths];
          this.setData({
            images: images,
            uploading: false
          });
        }, 1000);
      }
    });
  },

  /**
   * 删除图片
   */
  deleteImage: function (e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.images];
    images.splice(index, 1);
    this.setData({
      images: images
    });
  },

  /**
   * 预览图片
   */
  previewImage: function (e) {
    const { index } = e.currentTarget.dataset;
    wx.previewImage({
      urls: this.data.images,
      current: this.data.images[index]
    });
  },

  /**
   * 提交评价
   */
  submitEvaluate: function () {
    if (!this.validateForm()) return;
    
    this.setData({ submitting: true });
    
    const commentData = {
      orderId: this.data.orderId,
      rating: this.data.overallRating,
      content: this.data.content,
      images: this.data.images,
      serviceRating: this.data.serviceRating,
      deliveryRating: this.data.deliveryRating,
      items: this.data.evaluateItems.map(item => ({
        productId: item.productId,
        rating: item.rating,
        content: item.content
      }))
    };
    
    commentApi.createComment(commentData)
      .then(res => {
        this.setData({ submitting: false });
        wx.showToast({
          title: '评价成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(() => {
              // 评价成功后返回订单列表页
              wx.navigateTo({
                url: '/pages/order/list'
              });
            }, 2000);
          }
        });
      })
      .catch(err => {
        this.setData({ submitting: false });
        wx.showToast({
          title: '评价失败',
          icon: 'none'
        });
      });
  },

  /**
   * 表单验证
   */
  validateForm: function () {
    if (!this.data.content.trim()) {
      wx.showToast({
        title: '请输入评价内容',
        icon: 'none'
      });
      return false;
    }
    
    return true;
  },

  /**
   * 返回上一页
   */
  onBack: function () {
    wx.navigateBack();
  }
});
