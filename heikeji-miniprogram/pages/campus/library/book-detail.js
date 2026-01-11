// 图书详情页面JS
const campusApi = require('../../../api/campus');

Page({
  data: {
    // 图书ID
    bookId: '',
    // 图书详情
    bookDetail: null,
    // 加载状态
    isLoading: true,
    // 借阅状态
    borrowStatus: {
      canBorrow: true,
      message: ''
    }
  },

  onLoad: function (options) {
    // 获取图书ID
    const bookId = options.id;
    if (!bookId) {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      });
      wx.navigateBack();
      return;
    }
    
    this.setData({ bookId });
    // 加载图书详情
    this.loadBookDetail();
  },

  /**
   * 加载图书详情
   */
  loadBookDetail: function () {
    this.setData({ isLoading: true });
    
    campusApi.getBookDetail({
      id: this.data.bookId
    }).then(res => {
      const bookDetail = res.data;
      // 判断是否可借阅
      const canBorrow = bookDetail.availableCopies > 0;
      
      this.setData({
        bookDetail,
        borrowStatus: {
          canBorrow,
          message: canBorrow ? `${bookDetail.availableCopies}本可借` : '已借出'
        },
        isLoading: false
      });
    }).catch(err => {
      console.error('获取图书详情失败:', err);
      wx.showToast({
        title: err.message || '获取图书详情失败，请重试',
        icon: 'none'
      });
      this.setData({ isLoading: false });
    });
  },

  /**
   * 借阅图书
   */
  borrowBook: function () {
    const { bookId, bookDetail } = this.data;
    
    if (!bookDetail.availableCopies) {
      wx.showToast({
        title: '该图书已借出',
        icon: 'none'
      });
      return;
    }
    
    wx.showModal({
      title: '确认借阅',
      content: `确定要借阅《${bookDetail.title}》吗？`,
      success: res => {
        if (res.confirm) {
          this.doBorrowBook();
        }
      }
    });
  },

  /**
   * 执行借阅操作
   */
  doBorrowBook: function () {
    const { bookId } = this.data;
    
    wx.showLoading({
      title: '借阅中...',
      mask: true
    });
    
    // 这里应该调用借阅API，暂时使用模拟数据
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '借阅成功',
        icon: 'success'
      });
      // 更新图书详情
      this.loadBookDetail();
    }, 1000);
  },

  /**
   * 预约图书
   */
  reserveBook: function () {
    const { bookDetail } = this.data;
    
    wx.showModal({
      title: '确认预约',
      content: `确定要预约《${bookDetail.title}》吗？`,
      success: res => {
        if (res.confirm) {
          this.doReserveBook();
        }
      }
    });
  },

  /**
   * 执行预约操作
   */
  doReserveBook: function () {
    const { bookId } = this.data;
    
    wx.showLoading({
      title: '预约中...',
      mask: true
    });
    
    // 这里应该调用预约API，暂时使用模拟数据
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '预约成功',
        icon: 'success'
      });
    }, 1000);
  },

  /**
   * 返回上一页
   */
  goBack: function () {
    wx.navigateBack();
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.loadBookDetail().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});