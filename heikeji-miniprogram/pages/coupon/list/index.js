// 优惠券列表页面逻辑
const couponApi = require('../../../api/coupon');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 优惠券列表
    coupons: [],
    // 筛选条件
    filters: [
      { id: 'all', name: '全部' },
      { id: 'available', name: '可用' },
      { id: 'used', name: '已使用' },
      { id: 'expired', name: '已过期' }
    ],
    // 当前筛选条件
    currentFilter: 'all',
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
    // 获取订单金额和类型（从订单页面传入）
    this.orderAmount = options.amount;
    this.orderType = options.orderType;
    // 初始化优惠券列表
    this.initCoupons();
    
    // 获取事件通道，用于返回优惠券选择结果
    this.eventChannel = this.getOpenerEventChannel();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时刷新优惠券列表
    this.initCoupons();
  },

  /**
   * 初始化优惠券列表
   */
  initCoupons: function () {
    this.setData({
      coupons: [],
      page: 1,
      hasMore: true,
      loading: true,
      isEmpty: false
    });
    this.getCoupons();
  },

  /**
   * 获取优惠券列表
   */
  getCoupons: function () {
    if (!this.data.hasMore || this.data.loading) return;

    this.setData({ loading: true });

    const params = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      status: this.data.currentFilter === 'all' ? '' : this.data.currentFilter
    };

    couponApi.getUserCoupons(params)
      .then(res => {
        const newCoupons = res.data || [];
        const coupons = [...this.data.coupons, ...newCoupons];
        
        this.setData({
          coupons: coupons,
          hasMore: newCoupons.length === this.data.pageSize,
          page: this.data.page + 1,
          loading: false,
          isEmpty: coupons.length === 0
        });
      })
      .catch(err => {
        console.error('获取优惠券列表失败:', err);
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
   * 切换筛选条件
   */
  onFilterChange: function (e) {
    const filterId = e.currentTarget.dataset.id;
    if (filterId === this.data.currentFilter) return;

    this.setData({
      currentFilter: filterId
    });
    this.initCoupons();
  },

  /**
   * 跳转到优惠券详情页或选择优惠券
   */
  viewCouponDetail: function (e) {
    const couponId = e.currentTarget.dataset.id;
    const coupon = this.data.coupons.find(item => item.id === couponId);
    
    // 如果是从订单页面跳过来的，直接选择优惠券
    if (this.orderAmount && this.eventChannel) {
      // 返回优惠券选择结果
      this.eventChannel.emit('couponSelected', coupon);
      // 返回上一页
      wx.navigateBack();
    } else {
      // 否则跳转到详情页
      wx.navigateTo({
        url: `/pages/coupon/detail/index?id=${couponId}`
      });
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getCoupons();
  },

  /**
   * 页面下拉刷新事件的处理函数
   */
  onPullDownRefresh: function () {
    this.initCoupons();
    wx.stopPullDownRefresh();
  },

  /**
   * 领取优惠券
   */
  receiveCoupon: function (e) {
    const couponId = e.currentTarget.dataset.id;
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
        // 刷新优惠券列表
        this.initCoupons();
      })
      .catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: err.message || '领取失败',
          icon: 'none'
        });
      });
  }
});
