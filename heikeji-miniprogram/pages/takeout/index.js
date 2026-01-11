// 外卖首页JS
const takeoutApi = require('../../../api/takeout');

Page({
  data: {
    // 搜索关键词
    searchKeyword: '',
    // 当前选中分类
    currentCategory: 0,
    // 分类列表
    categories: [
      { id: 0, name: '全部', icon: '/assets/icons/all.png' },
      { id: 1, name: '食堂', icon: '/assets/icons/canteen.png' },
      { id: 2, name: '奶茶', icon: '/assets/icons/milktea.png' },
      { id: 3, name: '快餐', icon: '/assets/icons/fastfood.png' },
      { id: 4, name: '水果', icon: '/assets/icons/fruit.png' },
      { id: 5, name: '小吃', icon: '/assets/icons/snack.png' }
    ],
    // 商家列表
    merchants: [],
    // 是否有更多数据
    hasMore: true,
    // 当前页码
    page: 1,
    // 每页条数
    pageSize: 10,
    // 是否正在加载数据
    isLoading: false,
    // 搜索防抖定时器
    searchTimer: null,
    // 上次搜索关键词
    lastSearchKeyword: '',
    // 上次分类ID
    lastCategoryId: 0
  },

  onLoad() {
    // 页面加载时获取商家列表
    this.loadMerchants();
  },

  onShow() {
    // 页面显示时，只有当数据为空时才刷新
    if (this.data.merchants.length === 0) {
      this.setData({ page: 1, merchants: [] });
      this.loadMerchants();
    }
  },

  onPullDownRefresh() {
    // 下拉刷新
    this.setData({ page: 1, merchants: [] });
    this.loadMerchants().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 监听页面滚动到底部
  onReachBottom() {
    this.onLoadMore();
  },

  // 搜索输入事件 - 防抖处理
  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    
    // 清除之前的定时器
    if (this.data.searchTimer) {
      clearTimeout(this.data.searchTimer);
    }
    
    // 设置新的定时器，500ms后执行搜索
    this.setData({
      searchTimer: setTimeout(() => {
        this.onSearch();
      }, 500)
    });
  },

  // 搜索事件
  onSearch() {
    const { searchKeyword, lastSearchKeyword, lastCategoryId, currentCategory } = this.data;
    
    // 如果搜索关键词和分类都没有变化，不重新搜索
    if (searchKeyword === lastSearchKeyword && currentCategory === lastCategoryId) {
      return;
    }
    
    this.setData({
      page: 1,
      merchants: [],
      lastSearchKeyword: searchKeyword,
      lastCategoryId: currentCategory
    });
    
    this.loadMerchants();
  },

  // 分类切换事件
  onCategoryChange(e) {
    const categoryId = e.currentTarget.dataset.id;
    
    // 如果点击的是当前分类，不重新加载
    if (categoryId === this.data.currentCategory) {
      return;
    }
    
    this.setData({
      currentCategory: categoryId,
      page: 1,
      merchants: [],
      lastCategoryId: categoryId
    });
    
    this.loadMerchants();
  },

  // 加载更多
  onLoadMore() {
    if (this.data.hasMore && !this.data.isLoading) {
      this.setData({ page: this.data.page + 1 });
      this.loadMerchants();
    }
  },

  // 加载商家列表
  async loadMerchants() {
    // 防止重复加载
    if (this.data.isLoading) {
      return;
    }
    
    this.setData({ isLoading: true });
    
    try {
      const params = {
        page: this.data.page,
        pageSize: this.data.pageSize,
        categoryId: this.data.currentCategory === 0 ? null : this.data.currentCategory,
        keyword: this.data.searchKeyword,
        cache: this.data.page === 1 // 第一页数据缓存，后续页面不缓存
      };
      
      const result = await takeoutApi.getMerchantList(params);
      
      this.setData({
        merchants: this.data.page === 1 ? result.data.list : [...this.data.merchants, ...result.data.list],
        hasMore: result.data.list.length === this.data.pageSize,
        isLoading: false
      });
    } catch (error) {
      console.error('加载商家列表失败:', error);
      wx.showToast({ 
        title: '加载失败', 
        icon: 'none',
        duration: 1500
      });
      this.setData({ isLoading: false });
    }
  },

  // 跳转到商家详情页
  navigateToMerchant(e) {
    const merchantId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/takeout/merchant/index?id=${merchantId}`
    });
  }
});