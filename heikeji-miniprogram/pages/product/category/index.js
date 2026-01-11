// 商品分类页面JS
const productApi = require('../../../api/product');

Page({
  data: {
    // 分类列表
    categories: [],
    // 当前选中分类ID
    currentCategory: 0,
    // 当前选中分类名称
    currentCategoryName: '',
    // 当前分类下的商品列表
    currentCategoryGoods: [],
    // 加载状态
    loading: false
  },

  onLoad() {
    // 加载分类列表
    this.loadCategories();
  },

  /**
   * 加载分类列表
   */
  async loadCategories() {
    this.setData({ loading: true });
    
    try {
      const result = await productApi.getCategoryList();
      const categories = result.data.list;
      
      // 如果有分类，默认选中第一个
      if (categories.length > 0) {
        this.setData({
          categories: categories,
          currentCategory: categories[0].id,
          currentCategoryName: categories[0].name
        });
        
        // 加载第一个分类的商品
        this.loadCategoryGoods(categories[0].id);
      }
    } catch (error) {
      console.error('加载分类列表失败:', error);
      wx.showToast({ title: '加载失败', icon: 'error' });
      
      // 使用模拟数据
      const mockCategories = this.getMockCategories();
      this.setData({
        categories: mockCategories,
        currentCategory: mockCategories[0].id,
        currentCategoryName: mockCategories[0].name
      });
      
      // 加载模拟商品数据
      this.loadMockCategoryGoods(mockCategories[0].id);
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 加载分类商品列表
   */
  async loadCategoryGoods(categoryId) {
    this.setData({ loading: true });
    
    try {
      const result = await productApi.getProductList({ categoryId: categoryId });
      this.setData({
        currentCategoryGoods: result.data.list
      });
    } catch (error) {
      console.error('加载分类商品失败:', error);
      // 使用模拟数据
      this.loadMockCategoryGoods(categoryId);
    } finally {
      this.setData({ loading: false });
    }
  },

  /**
   * 加载模拟分类商品
   */
  loadMockCategoryGoods(categoryId) {
    // 根据分类ID返回不同的模拟商品
    const mockGoods = this.getMockCategoryGoods(categoryId);
    this.setData({
      currentCategoryGoods: mockGoods
    });
  },

  /**
   * 分类切换事件
   */
  onCategoryChange(e) {
    const categoryId = parseInt(e.currentTarget.dataset.id);
    const categoryName = this.data.categories.find(c => c.id === categoryId)?.name || '';
    
    this.setData({
      currentCategory: categoryId,
      currentCategoryName: categoryName,
      currentCategoryGoods: []
    });
    
    // 加载选中分类的商品
    this.loadCategoryGoods(categoryId);
  },

  /**
   * 商品点击事件
   */
  onGoodsClick(e) {
    const productId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/product/detail/index?id=${productId}`
    });
  },

  /**
   * 搜索事件
   */
  onSearch() {
    wx.navigateTo({
      url: `/pages/product/list/index?search=true`
    });
  },

  /**
   * 返回事件
   */
  onBack() {
    wx.navigateBack();
  },

  /**
   * 获取模拟分类数据
   */
  getMockCategories() {
    return [
      { id: 1, name: '零食饮料', icon: '/assets/icons/snacks.png' },
      { id: 2, name: '生活用品', icon: '/assets/icons/life.png' },
      { id: 3, name: '学习用品', icon: '/assets/icons/study.png' },
      { id: 4, name: '水果生鲜', icon: '/assets/icons/fruit.png' },
      { id: 5, name: '数码配件', icon: '/assets/icons/digital.png' },
      { id: 6, name: '美妆护肤', icon: '/assets/icons/beauty.png' },
      { id: 7, name: '运动户外', icon: '/assets/icons/sports.png' },
      { id: 8, name: '礼品文具', icon: '/assets/icons/gifts.png' }
    ];
  },

  /**
   * 获取模拟分类商品
   */
  getMockCategoryGoods(categoryId) {
    // 根据不同分类ID返回不同的商品列表
    const goodsMap = {
      1: [
        { id: 1, name: '营养快线原味500ml', price: 4.5, imageUrl: 'https://via.placeholder.com/160x160?text=营养快线' },
        { id: 2, name: '乐事薯片青柠味135g', price: 6.8, imageUrl: 'https://via.placeholder.com/160x160?text=乐事薯片' },
        { id: 3, name: '可口可乐330ml', price: 3.5, imageUrl: 'https://via.placeholder.com/160x160?text=可口可乐' },
        { id: 4, name: '奥利奥夹心饼干', price: 5.5, imageUrl: 'https://via.placeholder.com/160x160?text=奥利奥' },
        { id: 5, name: '康师傅红烧牛肉面', price: 4.0, imageUrl: 'https://via.placeholder.com/160x160?text=康师傅' },
        { id: 6, name: '恰恰瓜子500g', price: 12.8, imageUrl: 'https://via.placeholder.com/160x160?text=恰恰瓜子' }
      ],
      2: [
        { id: 7, name: '清风抽纸100抽3层', price: 3.8, imageUrl: 'https://via.placeholder.com/160x160?text=抽纸' },
        { id: 8, name: '飘柔洗发水500ml', price: 29.9, imageUrl: 'https://via.placeholder.com/160x160?text=飘柔' },
        { id: 9, name: '舒肤佳香皂', price: 5.5, imageUrl: 'https://via.placeholder.com/160x160?text=舒肤佳' },
        { id: 10, name: '立白洗衣液1L', price: 19.9, imageUrl: 'https://via.placeholder.com/160x160?text=立白' }
      ],
      3: [
        { id: 11, name: '晨光中性笔0.5mm黑色', price: 1.5, imageUrl: 'https://via.placeholder.com/160x160?text=中性笔' },
        { id: 12, name: '得力笔记本A5', price: 6.8, imageUrl: 'https://via.placeholder.com/160x160?text=笔记本' },
        { id: 13, name: '晨光2B铅笔', price: 0.8, imageUrl: 'https://via.placeholder.com/160x160?text=铅笔' },
        { id: 14, name: '得力订书机', price: 12.9, imageUrl: 'https://via.placeholder.com/160x160?text=订书机' }
      ],
      4: [
        { id: 15, name: '新鲜草莓500g', price: 15.8, imageUrl: 'https://via.placeholder.com/160x160?text=草莓' },
        { id: 16, name: '进口香蕉1kg', price: 8.9, imageUrl: 'https://via.placeholder.com/160x160?text=香蕉' },
        { id: 17, name: '红富士苹果2kg', price: 19.8, imageUrl: 'https://via.placeholder.com/160x160?text=苹果' },
        { id: 18, name: '葡萄柚2个', price: 12.8, imageUrl: 'https://via.placeholder.com/160x160?text=葡萄柚' }
      ]
    };
    
    // 默认返回零食饮料分类的商品
    return goodsMap[categoryId] || goodsMap[1];
  }
});
