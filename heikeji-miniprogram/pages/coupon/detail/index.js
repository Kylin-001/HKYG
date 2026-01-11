// 优惠券详情页面逻辑
const couponApi = require('../../../api/coupon');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 优惠券ID
    couponId: '',
    // 优惠券详情
    couponDetail: null,
    // 加载状态
    loading: true,
    // 是否可以使用
    canUse: false,
    // 是否可以领取
    canReceive: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取优惠券ID
    const couponId = options.id;
    if (couponId) {
      this.setData({ couponId: couponId });
      // 加载优惠券详情
      this.loadCouponDetail();
    } else {
      wx.showToast({
        title: '优惠券ID无效',
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
   * 加载优惠券详情
   */
  loadCouponDetail: function () {
    this.setData({ loading: true });
    
    couponApi.getCouponDetail(this.data.couponId)
      .then(res => {
        const couponDetail = res.data;
        // 计算是否可以使用和领取
        const canUse = couponDetail.status === 'available';
        const canReceive = couponDetail.status === 'not_received';
        
        this.setData({
          couponDetail: couponDetail,
          loading: false,
          canUse: canUse,
          canReceive: canReceive
        });
      })
      .catch(err => {
        console.error('获取优惠券详情失败:', err);
        this.setData({ loading: false });
        wx.showToast({
          title: '获取优惠券详情失败',
          icon: 'none'
        });
      });
  },

  /**
   * 领取优惠券
   */
  receiveCoupon: function () {
    wx.showLoading({
      title: '领取中...'
    });
    
    couponApi.receiveCoupon(this.data.couponId)
      .then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '领取成功',
          icon: 'success',
          duration: 2000,
          success: () => {
            setTimeout(() => {
              // 返回优惠券列表页
              wx.navigateBack();
            }, 2000);
          }
        });
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: err.message || '领取失败',
          icon: 'none'
        });
      });
  },

  /**
   * 使用优惠券
   */
  useCoupon: function () {
    // 跳转到使用优惠券的相关页面
    wx.navigateTo({
      url: '/pages/index/index',
      events: {
        // 可以传递优惠券信息给目标页面
        useCoupon: (data) => {
          console.log('使用优惠券:', data);
        }
      },
      success: (res) => {
        // 向目标页面传递优惠券信息
        res.eventChannel.emit('setCoupon', {
          coupon: this.data.couponDetail
        });
      }
    });
  },

  /**
   * 返回上一页
   */
  onBack: function () {
    wx.navigateBack();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: `${this.data.couponDetail?.name || '黑科易购'}优惠券`,
      path: `/pages/coupon/detail/index?id=${this.data.couponId}`,
      imageUrl: this.data.couponDetail?.image || ''
    };
  }
});
