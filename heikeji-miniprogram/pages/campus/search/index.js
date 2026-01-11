// 校园搜索页面JS
const campusApi = require('../../../api/campus');

Page({
  data: {
    keyword: '', // 搜索关键词
    isFocus: true, // 是否自动聚焦
    hasSearched: false, // 是否已搜索
    searchResults: {}, // 搜索结果
    searchHistory: [], // 搜索历史
    hotKeywords: ['开学', '图书馆', '空教室', '考试', '奖学金'] // 热门搜索词
  },

  onLoad: function (options) {
    // 加载搜索历史
    this.loadSearchHistory();
    
    // 如果从其他页面传递了搜索类型和关键词，直接搜索
    if (options.type && options.keyword) {
      this.setData({
        keyword: options.keyword
      });
      this.onSearch();
    }
  },

  /**
   * 加载搜索历史
   */
  loadSearchHistory: function () {
    const history = wx.getStorageSync('campusSearchHistory') || [];
    this.setData({
      searchHistory: history
    });
  },

  /**
   * 保存搜索历史
   */
  saveSearchHistory: function (keyword) {
    let history = wx.getStorageSync('campusSearchHistory') || [];
    
    // 移除重复项
    history = history.filter(item => item !== keyword);
    
    // 添加到开头
    history.unshift(keyword);
    
    // 只保留最近10条
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    
    wx.setStorageSync('campusSearchHistory', history);
    this.loadSearchHistory();
  },

  /**
   * 输入事件
   */
  onInput: function (e) {
    this.setData({
      keyword: e.detail.value
    });
  },

  /**
   * 搜索事件
   */
  onSearch: function () {
    const keyword = this.data.keyword.trim();
    if (!keyword) {
      return;
    }
    
    // 保存搜索历史
    this.saveSearchHistory(keyword);
    
    // 设置已搜索状态
    this.setData({
      hasSearched: true,
      searchResults: {} // 清空之前的搜索结果
    });
    
    // 执行搜索
    this.search(keyword);
  },

  /**
   * 执行搜索
   */
  search: function (keyword) {
    // 构建搜索结果
    const searchResults = {
      announcements: [
        {
          id: 1,
          title: '关于2024年春季学期开学通知',
          summary: '根据学校安排，2024年春季学期将于2月20日正式开学，现将相关事宜通知如下...',
          source: '校长办公室',
          createTime: '2024-02-15'
        }
      ],
      classrooms: [
        {
          id: 1,
          name: 'A101',
          building: '第一教学楼',
          floor: 1,
          capacity: 50
        },
        {
          id: 2,
          name: 'A102',
          building: '第一教学楼',
          floor: 1,
          capacity: 50
        },
        {
          id: 3,
          name: 'B201',
          building: '第二教学楼',
          floor: 2,
          capacity: 40
        }
      ]
    };
    
    // 模拟搜索延迟
    setTimeout(() => {
      this.setData({
        searchResults: searchResults
      });
    }, 300);
  },

  /**
   * 清空输入
   */
  onClear: function () {
    this.setData({
      keyword: ''
    });
  },

  /**
   * 取消搜索
   */
  onCancel: function () {
    wx.navigateBack();
  },

  /**
   * 点击搜索历史
   */
  onHistoryTagClick: function (e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      keyword: keyword
    });
    this.onSearch();
  },

  /**
   * 点击热门搜索词
   */
  onHotTagClick: function (e) {
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({
      keyword: keyword
    });
    this.onSearch();
  },

  /**
   * 清空搜索历史
   */
  onClearHistory: function () {
    wx.setStorageSync('campusSearchHistory', []);
    this.setData({
      searchHistory: []
    });
  },

  /**
   * 导航到公告详情
   */
  navigateToAnnouncementDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/campus/announcement/detail?id=${id}`
    });
  },

  /**
   * 导航到空教室详情
   */
  navigateToClassroomDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/campus/classroom/detail?id=${id}`
    });
  }
});