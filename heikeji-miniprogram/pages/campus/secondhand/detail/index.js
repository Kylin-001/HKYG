// 二手市场详情页面JS
const secondhandApi = require('../../../../api/secondhand');

Page({
  data: {
    // 商品ID
    goodsId: '',
    // 商品详情数据
    goodsDetail: {
      id: '',
      title: '',
      price: 0,
      originalPrice: 0,
      location: '',
      createTime: '',
      views: 0,
      images: [],
      description: '',
      sellerId: '',
      sellerName: '',
      sellerAvatar: '',
      sellerRating: 0,
      isCollected: false
    },
    // 加载状态
    loading: true
  },

  onLoad(options) {
    // 获取商品ID
    const goodsId = options.id;
    if (goodsId) {
      this.setData({ goodsId: goodsId });
      // 加载商品详情
      this.loadGoodsDetail(goodsId);
    } else {
      wx.showToast({
        title: '商品ID无效',
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
   * 加载商品详情
   */
  async loadGoodsDetail(goodsId) {
    this.setData({ loading: true });
    
    try {
      const result = await secondhandApi.getGoodsDetail(goodsId);
      this.setData({
        goodsDetail: result.data,
        loading: false
      });
      
      // 增加浏览次数
      secondhandApi.increaseGoodsViews(goodsId).catch(err => {
        console.error('增加浏览次数失败:', err);
      });
    } catch (error) {
      console.error('加载商品详情失败:', error);
      wx.showToast({ title: '加载失败', icon: 'error' });
      
      // 使用模拟数据
      this.setData({
        goodsDetail: this.getMockGoodsDetail(),
        loading: false
      });
    }
  },

  /**
   * 图片预览
   */
  onImagePreview(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      urls: this.data.goodsDetail.images,
      current: this.data.goodsDetail.images[index]
    });
  },

  /**
   * 分享功能
   */
  onShare() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  /**
   * 收藏功能
   */
  async onCollect() {
    const { goodsId, goodsDetail } = this.data;
    const isCollected = goodsDetail.isCollected;
    
    try {
      if (isCollected) {
        await secondhandApi.cancelCollect(goodsId);
        this.setData({
          'goodsDetail.isCollected': false
        });
        wx.showToast({ title: '取消收藏', icon: 'success' });
      } else {
        await secondhandApi.collectGoods(goodsId);
        this.setData({
          'goodsDetail.isCollected': true
        });
        wx.showToast({ title: '收藏成功', icon: 'success' });
      }
    } catch (error) {
      console.error('收藏操作失败:', error);
      wx.showToast({ title: '操作失败', icon: 'error' });
    }
  },

  /**
   * 联系卖家
   */
  onContact() {
    const { sellerId, sellerName } = this.data.goodsDetail;
    wx.navigateTo({
      url: `/pages/chat/index?userId=${sellerId}&userName=${sellerName}`
    });
  },

  /**
   * 立即购买
   */
  onBuyNow() {
    const { goodsId, goodsDetail } = this.data;
    wx.showModal({
      title: '确认购买',
      content: `确定要购买"${goodsDetail.title}"吗？`,
      success: (res) => {
        if (res.confirm) {
          // 跳转到购买确认页面
          wx.navigateTo({
            url: `/pages/campus/secondhand/buy/index?id=${goodsId}`
          });
        }
      }
    });
  },

  /**
   * 查看卖家信息
   */
  onSellerInfo() {
    const { sellerId } = this.data.goodsDetail;
    wx.navigateTo({
      url: `/pages/user/profile?userId=${sellerId}`
    });
  },

  /**
   * 返回上一页
   */
  onBack() {
    wx.navigateBack();
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadGoodsDetail(this.data.goodsId);
    wx.stopPullDownRefresh();
  },

  /**
   * 获取模拟商品详情数据
   */
  getMockGoodsDetail() {
    return {
      id: this.data.goodsId,
      title: 'iPhone 13 128G 蓝色 99新',
      price: 4500,
      originalPrice: 6999,
      location: '第一教学楼',
      createTime: '2小时前',
      views: 120,
      images: [
        'https://via.placeholder.com/600x600?text=iPhone13_1',
        'https://via.placeholder.com/600x600?text=iPhone13_2',
        'https://via.placeholder.com/600x600?text=iPhone13_3'
      ],
      description: 'iPhone 13 128G 蓝色，99新，无划痕，无维修记录，配件齐全。支持当面交易，可验机。',
      sellerId: '1',
      sellerName: '张三',
      sellerAvatar: 'https://via.placeholder.com/100x100?text=Avatar',
      sellerRating: 4.8,
      isCollected: false
    };
  }
});
