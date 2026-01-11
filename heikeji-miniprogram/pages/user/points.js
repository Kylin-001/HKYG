// 积分记录页面逻辑
const pointApi = require('../../api/point');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 积分余额
    pointBalance: 0,
    // 积分记录列表
    pointRecords: [],
    // 筛选条件
    filters: [
      { id: 'all', name: '全部' },
      { id: 'income', name: '收入' },
      { id: 'outcome', name: '支出' }
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
    // 初始化积分记录
    this.initPointRecords();
    // 加载积分余额
    this.loadPointBalance();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示时刷新积分记录和余额
    this.initPointRecords();
    this.loadPointBalance();
  },

  /**
   * 初始化积分记录列表
   */
  initPointRecords: function () {
    this.setData({
      pointRecords: [],
      page: 1,
      hasMore: true,
      loading: true,
      isEmpty: false
    });
    this.loadPointRecords();
  },

  /**
   * 加载积分余额
   */
  loadPointBalance: function () {
    pointApi.getPointBalance()
      .then(res => {
        this.setData({
          pointBalance: res.data || 0
        });
      })
      .catch(err => {
        console.error('获取积分余额失败:', err);
        this.setData({
          pointBalance: 0
        });
      });
  },

  /**
   * 加载积分记录
   */
  loadPointRecords: function () {
    if (!this.data.hasMore || this.data.loading) return;

    this.setData({ loading: true });

    const params = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      type: this.data.currentFilter === 'all' ? '' : this.data.currentFilter
    };

    pointApi.getPointRecords(params)
      .then(res => {
        const newRecords = res.data || [];
        const pointRecords = [...this.data.pointRecords, ...newRecords];
        
        this.setData({
          pointRecords: pointRecords,
          hasMore: newRecords.length === this.data.pageSize,
          page: this.data.page + 1,
          loading: false,
          isEmpty: pointRecords.length === 0
        });
      })
      .catch(err => {
        console.error('获取积分记录失败:', err);
        this.setData({
          loading: false,
          isEmpty: true
        });
        wx.showToast({
          title: '获取积分记录失败',
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
    this.initPointRecords();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadPointRecords();
  },

  /**
   * 页面下拉刷新事件的处理函数
   */
  onPullDownRefresh: function () {
    this.initPointRecords();
    this.loadPointBalance();
    wx.stopPullDownRefresh();
  },

  /**
   * 返回上一页
   */
  onBack: function () {
    wx.navigateBack();
  }
});
