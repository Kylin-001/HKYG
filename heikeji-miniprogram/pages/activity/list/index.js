// pages/activity/list/index.js
import { getActivityCategories, getActivityList, getHotActivities } from '../../../api/activity';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    selectedCategory: 0,
    activities: [],
    hotActivities: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    refreshing: false,
    searchKeyword: '',
    showSearch: false,
    tabBar: [
      { id: 'all', name: '全部' },
      { id: 'upcoming', name: '即将开始' },
      { id: 'ongoing', name: '进行中' },
      { id: 'ended', name: '已结束' }
    ],
    selectedTab: 'all',
    sortOptions: [
      { id: 'hot', name: '热门' },
      { id: 'time', name: '时间' },
      { id: 'participants', name: '参与人数' }
    ],
    selectedSort: 'hot'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadCategories();
    this.loadHotActivities();
    this.loadActivities();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      refreshing: true,
      page: 1,
      activities: [],
      hasMore: true
    });
    this.loadActivities(true);
    this.loadHotActivities();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore && !this.data.loading) {
      this.loadActivities();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 加载活动分类
  loadCategories() {
    getActivityCategories().then(res => {
      this.setData({
        categories: res.data || []
      });
    }).catch(err => {
      console.error('加载分类失败', err);
      // 模拟数据
      this.setData({
        categories: [
          { id: 1, name: '学术讲座' },
          { id: 2, name: '文艺演出' },
          { id: 3, name: '体育赛事' },
          { id: 4, name: '社团活动' },
          { id: 5, name: '志愿公益' },
          { id: 6, name: '就业招聘' }
        ]
      });
    });
  },

  // 加载热门活动
  loadHotActivities() {
    getHotActivities({ limit: 5 }).then(res => {
      this.setData({
        hotActivities: res.data || []
      });
    }).catch(err => {
      console.error('加载热门活动失败', err);
      // 模拟数据
      this.setData({
        hotActivities: [
          { id: 1, title: '2024校园招聘会', cover: '/assets/images/activity1.jpg', startTime: '2024-06-15 09:00', participants: 500 },
          { id: 2, title: '夏季音乐节', cover: '/assets/images/activity2.jpg', startTime: '2024-06-20 19:30', participants: 300 },
          { id: 3, title: '篮球联赛总决赛', cover: '/assets/images/activity3.jpg', startTime: '2024-06-18 14:00', participants: 200 },
          { id: 4, title: 'AI技术讲座', cover: '/assets/images/activity4.jpg', startTime: '2024-06-22 15:00', participants: 150 },
          { id: 5, title: '公益植树活动', cover: '/assets/images/activity5.jpg', startTime: '2024-06-25 08:30', participants: 100 }
        ]
      });
    });
  },

  // 加载活动列表
  loadActivities(refresh = false) {
    if (this.data.loading) return;

    this.setData({ loading: true });

    const params = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      categoryId: this.data.selectedCategory === 0 ? '' : this.data.selectedCategory,
      status: this.data.selectedTab === 'all' ? '' : this.data.selectedTab,
      sort: this.data.selectedSort
    };

    getActivityList(params).then(res => {
      const newActivities = res.data || [];
      const activities = refresh ? newActivities : [...this.data.activities, ...newActivities];
      const hasMore = newActivities.length >= this.data.pageSize;

      this.setData({
        activities: activities,
        hasMore: hasMore,
        page: refresh ? 2 : this.data.page + 1,
        loading: false,
        refreshing: false
      });

      if (refresh) {
        wx.stopPullDownRefresh();
      }
    }).catch(err => {
      console.error('加载活动列表失败', err);
      // 模拟数据
      const mockActivities = [];
      for (let i = 0; i < 10; i++) {
        const status = this.data.selectedTab;
        const mockStatus = status === 'all' ? ['upcoming', 'ongoing', 'ended'][Math.floor(Math.random() * 3)] : status;
        
        mockActivities.push({
          id: (this.data.page - 1) * 10 + i + 1,
          title: `测试活动 ${(this.data.page - 1) * 10 + i + 1}`,
          cover: `/assets/images/activity${(i % 5) + 1}.jpg`,
          startTime: new Date(Date.now() + (mockStatus === 'upcoming' ? 86400000 : mockStatus === 'ongoing' ? 0 : -86400000)).toLocaleString(),
          endTime: new Date(Date.now() + (mockStatus === 'upcoming' ? 172800000 : mockStatus === 'ongoing' ? 86400000 : -0)).toLocaleString(),
          location: `校园${(i % 5) + 1}号楼`,
          participants: Math.floor(Math.random() * 500),
          maxParticipants: Math.floor(Math.random() * 500) + 100,
          status: mockStatus,
          category: this.data.categories[Math.floor(Math.random() * this.data.categories.length)]?.name || '其他'
        });
      }

      const activities = refresh ? mockActivities : [...this.data.activities, ...mockActivities];
      this.setData({
        activities: activities,
        hasMore: this.data.page < 3,
        page: this.data.page + 1,
        loading: false,
        refreshing: false
      });

      if (refresh) {
        wx.stopPullDownRefresh();
      }
    });
  },

  // 切换分类
  onCategoryChange(e) {
    const categoryId = e.currentTarget.dataset.id;
    this.setData({
      selectedCategory: categoryId,
      page: 1,
      activities: [],
      hasMore: true
    });
    this.loadActivities();
  },

  // 切换标签
  onTabChange(e) {
    const tabId = e.currentTarget.dataset.id;
    this.setData({
      selectedTab: tabId,
      page: 1,
      activities: [],
      hasMore: true
    });
    this.loadActivities();
  },

  // 切换排序方式
  onSortChange(e) {
    const sortId = e.currentTarget.dataset.id;
    this.setData({
      selectedSort: sortId,
      page: 1,
      activities: [],
      hasMore: true
    });
    this.loadActivities();
  },

  // 切换搜索框显示
  toggleSearch() {
    this.setData({
      showSearch: !this.data.showSearch,
      searchKeyword: ''
    });
  },

  // 输入搜索关键词
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 执行搜索
  onSearch() {
    if (this.data.searchKeyword.trim()) {
      // 跳转到搜索结果页
      wx.navigateTo({
        url: `/pages/activity/search/index?keyword=${encodeURIComponent(this.data.searchKeyword)}`
      });
    }
  },

  // 查看活动详情
  onActivityTap(e) {
    const activityId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/activity/detail/index?id=${activityId}`
    });
  },

  // 查看热门活动详情
  onHotActivityTap(e) {
    const activityId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/activity/detail/index?id=${activityId}`
    });
  }
});
