// 二手市场首页JS
const secondhandApi = require('../../../../api/secondhand');

Page({
  data: {
    // 商品列表
    goodsList: [],
    // 当前筛选条件
    currentFilter: 'all',
    // 加载状态
    loading: false,
    // 是否有更多数据
    hasMore: true,
    // 当前页码
    page: 1,
    // 每页条数
    pageSize: 10
  },

  onLoad() {
    // 加载商品列表
    this.loadGoodsList();
  },

  onShow() {
    // 页面显示时，如果是从其他页面返回，刷新数据
    if (this.data.refreshFlag) {
      this.setData({ page: 1, goodsList: [], hasMore: true });
      this.loadGoodsList();
      this.setData({ refreshFlag: false });
    }
  },

  /**
   * 加载商品列表
   */
  async loadGoodsList() {
    if (this.data.loading || !this.data.hasMore) return;
    
    this.setData({ loading: true });
    
    try {
      const params = {
        page: this.data.page,
        pageSize: this.data.pageSize,
        category: this.data.currentFilter === 'all' ? undefined : this.data.currentFilter
      };
      
      const result = await secondhandApi.getGoodsList(params);
      const goods = result.data.list || [];
      
      // 更新商品列表
      const updatedGoodsList = this.data.page === 1 ? goods : [...this.data.goodsList, ...goods];
      
      this.setData({
        goodsList: updatedGoodsList,
        hasMore: goods.length === this.data.pageSize,
        page: this.data.page + 1
      });
    } catch (error) {
      console.error('加载商品列表失败:', error);
      wx.showToast({ title: '加载失败', icon: 'error' });
      
      // 使用模拟数据
      this.setData({
        goodsList: this.getMockGoodsList(),
        hasMore: false,
        loading: false
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 筛选条件变化
   */
  onFilterChange(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({
      currentFilter: filter,
      page: 1,
      goodsList: [],
      hasMore: true
    });
    this.loadGoodsList();
  },

  /**
   * 商品点击事件
   */
  onGoodsClick(e) {
    const goodsId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/campus/secondhand/detail/index?id=${goodsId}`
    });
  },

  /**
   * 搜索事件
   */
  onSearch() {
    wx.navigateTo({
      url: `/pages/campus/secondhand/search/index`
    });
  },

  /**
   * 发布商品
   */
  onPublish() {
    wx.navigateTo({
      url: `/pages/campus/secondhand/publish/index`
    });
  },

  /**
   * 返回事件
   */
  onBack() {
    wx.navigateBack();
  },

  /**
   * 加载更多
   */
  onLoadMore() {
    this.loadGoodsList();
  },

  /**
   * 获取模拟商品数据
   */
  getMockGoodsList() {
    return [
      {
        id: 1,
        title: 'iPhone 13 128G 蓝色 99新',
        price: 4500,
        originalPrice: 6999,
        location: '第一教学楼',
        createTime: '2小时前',
        imageUrl: 'https://via.placeholder.com/200x200?text=iPhone13',
        category: 'electronics'
      },
      {
        id: 2,
        title: '考研英语真题 2020-2025',
        price: 35,
        originalPrice: 128,
        location: '图书馆',
        createTime: '1天前',
        imageUrl: 'https://via.placeholder.com/200x200?text=考研英语',
        category: 'books'
      },
      {
        id: 3,
        title: '运动套装 全新 L码',
        price: 80,
        originalPrice: 299,
        location: '第二宿舍楼',
        createTime: '3天前',
        imageUrl: 'https://via.placeholder.com/200x200?text=运动套装',
        category: 'clothes'
      },
      {
        id: 4,
        title: '篮球 斯伯丁 几乎全新',
        price: 50,
        originalPrice: 129,
        location: '体育馆',
        createTime: '5天前',
        imageUrl: 'https://via.placeholder.com/200x200?text=篮球',
        category: 'sports'
      },
      {
        id: 5,
        title: '小米手环7 黑色',
        price: 120,
        originalPrice: 249,
        location: '第三教学楼',
        createTime: '1周前',
        imageUrl: 'https://via.placeholder.com/200x200?text=小米手环7',
        category: 'electronics'
      },
      {
        id: 6,
        title: '大学物理教材 上下册',
        price: 20,
        originalPrice: 89,
        location: '第四教学楼',
        createTime: '1周前',
        imageUrl: 'https://via.placeholder.com/200x200?text=大学物理',
        category: 'books'
      }
    ];
  }
});
