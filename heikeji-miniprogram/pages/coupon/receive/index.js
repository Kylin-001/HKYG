// 优惠券领取页面逻辑
const couponApi = require('../../../api/coupon');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 可领取优惠券列表
    receivableCoupons: [],
    // 加载状态
    loading: false,
    // 是否还有更多数据
    hasMore: true,
    // 当前页码
    page: 1,
    // 每页条数
    pageSize: 10,
    // 空状态
    isEmpty: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化可领取优惠券列表
    this.initCoupons();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时刷新可领取优惠券列表
    this.initCoupons();
  },

  /**
   * 初始化可领取优惠券列表
   */
  initCoupons: function () {
    this.setData({
      receivableCoupons: [],
      page: 1,
      hasMore: true,
      loading: true,
      isEmpty: false
    });
    this.getReceivableCoupons();
  },

  /**
   * 获取可领取优惠券列表
   */
  getReceivableCoupons: function () {
    if (!this.data.hasMore || this.data.loading) return;

    this.setData({ loading: true });

    const params = {
      page: this.data.page,
      pageSize: this.data.pageSize
    };

    couponApi.getReceivableCoupons(params)
      .then(res => {
        const newCoupons = res.data || [];
        const receivableCoupons = [...this.data.receivableCoupons, ...newCoupons];
        
        this.setData({
          receivableCoupons: receivableCoupons,
          hasMore: newCoupons.length === this.data.pageSize,
          page: this.data.page + 1,
          loading: false,
          isEmpty: receivableCoupons.length === 0
        });
      })
      .catch(err => {
        console.error('获取可领取优惠券列表失败:', err);
        this.setData({
          loading: false,
          isEmpty: true
        });
        wx.showToast({
          title: '获取优惠券失败',
          icon: 'none'
        });
      });
  },

  /**
   * 领取优惠券
   */
  receiveCoupon: function (e) {
    const couponId = e.currentTarget.dataset.id;
    const index = e.currentTarget.dataset.index;
    
    // 防止重复点击
    const couponItem = this.data.receivableCoupons[index];
    if (couponItem.receiving) return;
    
    // 设置领取中状态
    const receivableCoupons = [...this.data.receivableCoupons];
    receivableCoupons[index] = {
      ...couponItem,
      receiving: true
    };
    this.setData({ receivableCoupons: receivableCoupons });
    
    wx.showLoading({
      title: '领取中...'
    });

    couponApi.receiveCoupon(couponId)
      .then(res => {
        wx.hideLoading();
        wx.showToast({
          title: '领取成功',
          icon: 'success'
        });
        
        // 更新优惠券状态
        receivableCoupons[index] = {
          ...couponItem,
          receiving: false,
          received: true
        };
        this.setData({ receivableCoupons: receivableCoupons });
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: err.message || '领取失败',
          icon: 'none'
        });
        
        // 恢复正常状态
        receivableCoupons[index] = {
          ...couponItem,
          receiving: false
        };
        this.setData({ receivableCoupons: receivableCoupons });
      });
  },

  /**
   * 查看优惠券详情
   */
  viewCouponDetail: function (e) {
    const couponId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/coupon/detail/index?id=${couponId}`
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getReceivableCoupons();
  },

  /**
   * 页面下拉刷新事件的处理函数
   */
  onPullDownRefresh: function () {
    this.initCoupons();
    wx.stopPullDownRefresh();
  },

  /**
   * 返回上一页
   */
  onBack: function () {
    wx.navigateBack();
  }
});
