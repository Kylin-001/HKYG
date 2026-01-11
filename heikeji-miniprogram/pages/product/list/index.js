// 商品商城列表页面JS
Page({
  data: {
    // 搜索关键词
    searchKeyword: '',
    
    // 当前选中分类ID
    currentCategory: 0,
    
    // 分类列表
    categories: [],
    
    // 当前排序方式
    currentSort: 'default',
    
    // 商品列表数据
    products: [],
    
    // 是否有更多数据
    hasMore: true,
    
    // 当前页码
    page: 1,
    
    // 每页条数
    pageSize: 10
  },

  onLoad() {
    // 页面加载时获取分类列表和商品列表
    this.loadCategories();
    this.loadProducts();
  },

  /**
   * 加载分类列表
   */
  async loadCategories() {
    try {
      // 调用API获取分类列表
      const productApi = require('../../../api/product');
      const result = await productApi.getCategoryList();
      
      this.setData({
        categories: result.data.list
      });
    } catch (error) {
      console.error('加载分类列表失败:', error);
      
      // 使用模拟数据
      this.setData({
        categories: this.getMockCategories()
      });
    }
  },

  /**
   * 加载商品列表
   */
  async loadProducts() {
    wx.showLoading({ title: '加载中...' });
    
    try {
      const productApi = require('../../../api/product');
      const params = {
        page: this.data.page,
        pageSize: this.data.pageSize,
        keyword: this.data.searchKeyword,
        categoryId: this.data.currentCategory || undefined,
        sort: this.data.currentSort
      };
      
      const result = await productApi.getProductList(params);
      
      const products = this.data.page === 1 ? 
        result.data.list : [...this.data.products, ...result.data.list];
      
      this.setData({
        products: products,
        hasMore: result.data.list.length === this.data.pageSize
      });
    } catch (error) {
      console.error('加载商品列表失败:', error);
      wx.showToast({ title: '加载失败', icon: 'error' });
      
      // 使用模拟数据
      this.setData({
        products: this.getMockProducts(),
        hasMore: false
      });
    } finally {
      wx.hideLoading();
    }
  },

  /**
   * 搜索输入事件
   */
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  /**
   * 搜索事件
   */
  onSearch() {
    this.setData({ page: 1, products: [] });
    this.loadProducts();
  },

  /**
   * 清除搜索
   */
  onClearSearch() {
    this.setData({ searchKeyword: '', page: 1, products: [] });
    this.loadProducts();
  },

  /**
   * 分类切换事件
   */
  onCategoryChange(e) {
    const categoryId = parseInt(e.currentTarget.dataset.id);
    this.setData({
      currentCategory: categoryId,
      page: 1,
      products: []
    });
    this.loadProducts();
  },

  /**
   * 排序切换事件
   */
  onSortChange(e) {
    const sort = e.currentTarget.dataset.sort;
    this.setData({
      currentSort: sort,
      page: 1,
      products: []
    });
    this.loadProducts();
  },

  /**
   * 加载更多商品
   */
  loadMore() {
    if (this.data.hasMore) {
      this.setData({ page: this.data.page + 1 });
      this.loadProducts();
    }
  },

  /**
   * 跳转到商品详情
   */
  navigateToDetail(e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/detail/index?id=${productId}`
    });
  },

  /**
   * 跳转到购物车
   */
  navigateToCart() {
    wx.navigateTo({
      url: '/pages/cart/index'
    });
  },

  /**
   * 添加到购物车
   */
  addCart(e) {
    e.stopPropagation(); // 阻止事件冒泡
    
    const productId = e.currentTarget.dataset.id;
    const product = this.data.products.find(p => p.id === productId);
    
    if (product) {
      // 调用添加到购物车API
      try {
        const productApi = require('../../../api/product');
        productApi.addToCart({ productId: productId, quantity: 1 });
        
        wx.showToast({
          title: '已添加到购物车',
          icon: 'success',
          duration: 1500
        });
      } catch (error) {
        console.error('添加到购物车失败:', error);
        wx.showToast({ title: '添加失败', icon: 'error' });
      }
    }
  },

  /**
   * 获取模拟分类数据
   */
  getMockCategories() {
    return [
      { id: 0, name: '全部', icon: '/assets/icons/all.png' },
      { id: 1, name: '零食饮料', icon: '/assets/icons/snacks.png' },
      { id: 2, name: '生活用品', icon: '/assets/icons/life.png' },
      { id: 3, name: '学习用品', icon: '/assets/icons/study.png' },
      { id: 4, name: '水果生鲜', icon: '/assets/icons/fruit.png' },
      { id: 5, name: '数码配件', icon: '/assets/icons/digital.png' }
    ];
  },

  /**
   * 获取模拟商品数据
   */
  getMockProducts() {
    return [
      {
        id: 1,
        name: '营养快线原味500ml',
        description: '经典原味，营养丰富，口感醇厚',
        price: 4.5,
        originalPrice: 5.5,
        discount: 8,
        sales: 1250,
        imageUrl: 'https://via.placeholder.com/160x160?text=营养快线'
      },
      {
        id: 2,
        name: '乐事薯片青柠味135g',
        description: '清爽青柠味，薄脆口感，休闲必备',
        price: 6.8,
        originalPrice: 8.5,
        discount: 8,
        sales: 2100,
        imageUrl: 'https://via.placeholder.com/160x160?text=乐事薯片'
      },
      {
        id: 3,
        name: '晨光中性笔0.5mm黑色',
        description: '书写流畅，不易断墨，适合学生使用',
        price: 1.5,
        sales: 3500,
        imageUrl: 'https://via.placeholder.com/160x160?text=中性笔'
      },
      {
        id: 4,
        name: '清风抽纸100抽3层',
        description: '原木浆制作，柔软亲肤，韧性强',
        price: 3.8,
        originalPrice: 4.5,
        discount: 8.4,
        sales: 1800,
        imageUrl: 'https://via.placeholder.com/160x160?text=抽纸'
      },
      {
        id: 5,
        name: '苹果iPhone 15手机壳',
        description: '透明硅胶材质，防摔抗震，贴合机身',
        price: 19.9,
        sales: 850,
        imageUrl: 'https://via.placeholder.com/160x160?text=手机壳'
      },
      {
        id: 6,
        name: '草莓新鲜水果500g',
        description: '新鲜采摘，酸甜可口，营养丰富',
        price: 15.8,
        sales: 620,
        imageUrl: 'https://via.placeholder.com/160x160?text=草莓'
      }
    ];
  }
});
