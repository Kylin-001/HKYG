// pages/forum/index.js
import { getForumCategories, getPostList, getHotPosts } from '../../api/forum';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    selectedCategory: 0,
    postList: [],
    hotPosts: [],
    page: 1,
    pageSize: 10,
    hasMore: true,
    loading: false,
    refreshing: false,
    searchKeyword: '',
    showSearch: false,
    tabBar: [
      { id: 'all', name: '全部' },
      { id: 'hot', name: '热门' },
      { id: 'new', name: '最新' }
    ],
    selectedTab: 'all'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadCategories();
    this.loadHotPosts();
    this.loadPostList();
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
      postList: [],
      hasMore: true
    });
    this.loadPostList(true);
    this.loadHotPosts();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMore && !this.data.loading) {
      this.loadPostList();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 加载论坛分类
  loadCategories() {
    getForumCategories().then(res => {
      this.setData({
        categories: res.data || []
      });
    }).catch(err => {
      console.error('加载分类失败', err);
      // 模拟数据
      this.setData({
        categories: [
          { id: 1, name: '闲聊吐槽' },
          { id: 2, name: '学习交流' },
          { id: 3, name: '二手交易' },
          { id: 4, name: '失物招领' },
          { id: 5, name: '校园资讯' },
          { id: 6, name: '社团活动' }
        ]
      });
    });
  },

  // 加载热门帖子
  loadHotPosts() {
    getHotPosts({ limit: 5 }).then(res => {
      this.setData({
        hotPosts: res.data || []
      });
    }).catch(err => {
      console.error('加载热门帖子失败', err);
      // 模拟数据
      this.setData({
        hotPosts: [
          { id: 1, title: '分享一下我的考研经验', author: '考研党', likeCount: 123, commentCount: 45 },
          { id: 2, title: '学校附近好吃的外卖推荐', author: '吃货一枚', likeCount: 89, commentCount: 32 },
          { id: 3, title: '求购一本二手英语词典', author: '新生小白', likeCount: 23, commentCount: 15 },
          { id: 4, title: '失物招领：捡到一个校园卡', author: '好心人', likeCount: 56, commentCount: 8 },
          { id: 5, title: '社团招新啦！', author: '社团负责人', likeCount: 78, commentCount: 21 }
        ]
      });
    });
  },

  // 加载帖子列表
  loadPostList(refresh = false) {
    if (this.data.loading) return;

    this.setData({ loading: true });

    const params = {
      page: this.data.page,
      pageSize: this.data.pageSize,
      categoryId: this.data.selectedCategory === 0 ? '' : this.data.selectedCategory,
      sort: this.data.selectedTab === 'hot' ? 'hot' : this.data.selectedTab === 'new' ? 'new' : 'default'
    };

    getPostList(params).then(res => {
      const newPosts = res.data || [];
      const postList = refresh ? newPosts : [...this.data.postList, ...newPosts];
      const hasMore = newPosts.length >= this.data.pageSize;

      this.setData({
        postList: postList,
        hasMore: hasMore,
        page: refresh ? 2 : this.data.page + 1,
        loading: false,
        refreshing: false
      });

      if (refresh) {
        wx.stopPullDownRefresh();
      }
    }).catch(err => {
      console.error('加载帖子列表失败', err);
      // 模拟数据
      const mockPosts = [];
      for (let i = 0; i < 10; i++) {
        mockPosts.push({
          id: (this.data.page - 1) * 10 + i + 1,
          title: `测试帖子 ${(this.data.page - 1) * 10 + i + 1}`,
          content: `这是一个测试帖子的内容，用于展示论坛功能...`,
          author: `用户${Math.floor(Math.random() * 1000)}`,
          avatar: `/assets/images/avatar${Math.floor(Math.random() * 5) + 1}.png`,
          createTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString(),
          likeCount: Math.floor(Math.random() * 100),
          commentCount: Math.floor(Math.random() * 50),
          viewCount: Math.floor(Math.random() * 500)
        });
      }

      const postList = refresh ? mockPosts : [...this.data.postList, ...mockPosts];
      this.setData({
        postList: postList,
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
      postList: [],
      hasMore: true
    });
    this.loadPostList();
  },

  // 切换标签
  onTabChange(e) {
    const tabId = e.currentTarget.dataset.id;
    this.setData({
      selectedTab: tabId,
      page: 1,
      postList: [],
      hasMore: true
    });
    this.loadPostList();
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
        url: `/pages/forum/search/index?keyword=${encodeURIComponent(this.data.searchKeyword)}`
      });
    }
  },

  // 发布帖子
  onPublish() {
    wx.navigateTo({
      url: '/pages/forum/publish/index'
    });
  },

  // 查看帖子详情
  onPostTap(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/forum/detail/index?id=${postId}`
    });
  },

  // 查看热门帖子详情
  onHotPostTap(e) {
    const postId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/forum/detail/index?id=${postId}`
    });
  }
});
