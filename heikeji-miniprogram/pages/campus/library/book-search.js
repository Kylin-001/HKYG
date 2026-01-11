// 图书搜索页面JS
const campusApi = require('../../../api/campus');

Page({
  data: {
    // 搜索关键词
    searchKeyword: '',
    // 搜索历史
    searchHistory: [],
    // 热门搜索
    hotSearchList: [
      'JavaScript高级程序设计',
      '数据结构与算法分析',
      'Python编程从入门到实践',
      '机器学习实战',
      '算法导论',
      '深入理解计算机系统',
      'Java核心技术',
      '设计模式',
      '数据库系统概念',
      '计算机网络'
    ],
    // 搜索结果
    searchResult: [],
    // 加载状态
    isLoading: false,
    isSearching: false,
    // 分页参数
    currentPage: 1,
    pageSize: 10,
    hasMore: false,
    // 防抖定时器
    debounceTimer: null
  },

  onLoad: function (options) {
    // 加载搜索历史
    this.loadSearchHistory();
  },

  /**
   * 加载搜索历史
   */
  loadSearchHistory: function () {
    const history = wx.getStorageSync('bookSearchHistory') || [];
    this.setData({ searchHistory: history });
  },

  /**
   * 保存搜索历史
   */
  saveSearchHistory: function (keyword) {
    if (!keyword) return;
    
    let history = wx.getStorageSync('bookSearchHistory') || [];
    // 去重并添加到开头
    history = history.filter(item => item !== keyword);
    history.unshift(keyword);
    // 限制历史记录数量
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    wx.setStorageSync('bookSearchHistory', history);
    this.setData({ searchHistory: history });
  },

  /**
   * 输入框输入事件
   */
  onInput: function (e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    
    // 防抖处理，输入停止300ms后自动搜索
    if (this.data.debounceTimer) {
      clearTimeout(this.data.debounceTimer);
    }
    this.setData({
      debounceTimer: setTimeout(() => {
        if (keyword.trim()) {
          this.onSearch();
        }
      }, 300)
    });
  },

  /**
   * 搜索事件
   */
  onSearch: function () {
    const keyword = this.data.searchKeyword.trim();
    if (!keyword) {
      wx.showToast({
        title: '请输入搜索关键词',
        icon: 'none'
      });
      return;
    }
    
    // 保存搜索历史
    this.saveSearchHistory(keyword);
    
    // 重置分页参数
    this.setData({
      currentPage: 1,
      searchResult: [],
      isSearching: true,
      isLoading: true
    });
    
    // 执行搜索
    this.searchBooks();
  },

  /**
   * 执行图书搜索
   */
  searchBooks: function () {
    const { searchKeyword, currentPage, pageSize } = this.data;
    
    campusApi.searchBooks({
      keyword: searchKeyword,
      page: currentPage,
      pageSize: pageSize
    }).then(res => {
      const { data, total, hasMore } = res.data;
      const searchResult = currentPage === 1 ? data : [...this.data.searchResult, ...data];
      
      this.setData({
        searchResult,
        hasMore,
        isLoading: false
      });
    }).catch(err => {
      console.error('搜索图书失败:', err);
      wx.showToast({
        title: err.message || '搜索失败，请重试',
        icon: 'none'
      });
      this.setData({ isLoading: false });
    });
  },

  /**
   * 清空搜索
   */
  clearSearch: function () {
    this.setData({
      searchKeyword: '',
      searchResult: [],
      isSearching: false
    });
  },

  /**
   * 根据历史记录搜索
   */
  searchByHistory: function (e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ searchKeyword: keyword });
    this.onSearch();
  },

  /**
   * 根据热门搜索搜索
   */
  searchByHot: function (e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ searchKeyword: keyword });
    this.onSearch();
  },

  /**
   * 清空搜索历史
   */
  clearHistory: function () {
    wx.showModal({
      title: '提示',
      content: '确定要清空搜索历史吗？',
      success: res => {
        if (res.confirm) {
          wx.removeStorageSync('bookSearchHistory');
          this.setData({ searchHistory: [] });
        }
      }
    });
  },

  /**
   * 删除单条搜索历史
   */
  deleteHistoryItem: function (e) {
    const index = e.currentTarget.dataset.index;
    let history = this.data.searchHistory;
    history.splice(index, 1);
    wx.setStorageSync('bookSearchHistory', history);
    this.setData({ searchHistory: history });
  },

  /**
   * 加载更多
   */
  loadMore: function () {
    if (this.data.isLoading || !this.data.hasMore) return;
    
    this.setData({
      currentPage: this.data.currentPage + 1,
      isLoading: true
    });
    
    this.searchBooks();
  },

  /**
   * 导航到图书详情页
   */
  navigateToBookDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/campus/library/book-detail?id=${id}`
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    if (this.data.isSearching) {
      this.setData({
        currentPage: 1,
        searchResult: [],
        isLoading: true
      });
      this.searchBooks().then(() => {
        wx.stopPullDownRefresh();
      });
    } else {
      wx.stopPullDownRefresh();
    }
  },

  /**
   * 页面卸载时清理
   */
  onUnload: function () {
    if (this.data.debounceTimer) {
      clearTimeout(this.data.debounceTimer);
    }
  }
});