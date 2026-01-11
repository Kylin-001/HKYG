// pages/forum/detail/index.js
import { getPostDetail, togglePostLike, togglePostFavorite, getCommentList, createComment, toggleCommentLike } from '../../../api/forum';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    postId: '',
    postDetail: null,
    comments: [],
    loading: true,
    commentLoading: false,
    commentPage: 1,
    commentPageSize: 10,
    hasMoreComments: true,
    commentContent: '',
    isLiked: false,
    isFavorited: false,
    likeCount: 0,
    favoriteCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const postId = options.id;
    if (postId) {
      this.setData({
        postId: postId
      });
      this.loadPostDetail();
      this.loadComments();
    }
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
      commentPage: 1,
      comments: [],
      hasMoreComments: true
    });
    this.loadPostDetail();
    this.loadComments(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreComments && !this.data.commentLoading) {
      this.loadComments();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const post = this.data.postDetail;
    return {
      title: post?.title || '论坛帖子',
      path: `/pages/forum/detail/index?id=${this.data.postId}`
    };
  },

  // 加载帖子详情
  loadPostDetail() {
    this.setData({ loading: true });
    getPostDetail(this.data.postId).then(res => {
      const post = res.data || {};
      this.setData({
        postDetail: post,
        isLiked: post.isLiked || false,
        isFavorited: post.isFavorited || false,
        likeCount: post.likeCount || 0,
        favoriteCount: post.favoriteCount || 0,
        loading: false
      });
      wx.setNavigationBarTitle({
        title: post.title || '帖子详情'
      });
    }).catch(err => {
      console.error('加载帖子详情失败', err);
      // 模拟数据
      const mockPost = {
        id: this.data.postId,
        title: '测试帖子详情',
        content: '这是一个测试帖子的详细内容，用于展示论坛帖子详情页的功能。\n\n这里可以包含多行文本、图片等内容。\n\n支持点赞、收藏、评论等交互功能。',
        author: '测试用户',
        avatar: '/assets/images/default-avatar.png',
        createTime: '2024-01-01 12:00:00',
        likeCount: 123,
        commentCount: 45,
        viewCount: 567,
        isLiked: false,
        isFavorited: false
      };
      this.setData({
        postDetail: mockPost,
        isLiked: mockPost.isLiked,
        isFavorited: mockPost.isFavorited,
        likeCount: mockPost.likeCount,
        favoriteCount: mockPost.favoriteCount,
        loading: false
      });
      wx.setNavigationBarTitle({
        title: mockPost.title
      });
    });
  },

  // 加载评论列表
  loadComments(refresh = false) {
    if (this.data.commentLoading) return;

    this.setData({ commentLoading: true });

    const params = {
      page: this.data.commentPage,
      pageSize: this.data.commentPageSize
    };

    getCommentList(this.data.postId, params).then(res => {
      const newComments = res.data || [];
      const comments = refresh ? newComments : [...this.data.comments, ...newComments];
      const hasMoreComments = newComments.length >= this.data.commentPageSize;

      this.setData({
        comments: comments,
        hasMoreComments: hasMoreComments,
        commentPage: refresh ? 2 : this.data.commentPage + 1,
        commentLoading: false
      });

      if (refresh) {
        wx.stopPullDownRefresh();
      }
    }).catch(err => {
      console.error('加载评论失败', err);
      // 模拟数据
      const mockComments = [];
      for (let i = 0; i < 10; i++) {
        mockComments.push({
          id: (this.data.commentPage - 1) * 10 + i + 1,
          content: `测试评论 ${(this.data.commentPage - 1) * 10 + i + 1}`,
          author: `用户${Math.floor(Math.random() * 1000)}`,
          avatar: `/assets/images/avatar${Math.floor(Math.random() * 5) + 1}.png`,
          createTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString(),
          likeCount: Math.floor(Math.random() * 50),
          isLiked: false
        });
      }

      const comments = refresh ? mockComments : [...this.data.comments, ...mockComments];
      this.setData({
        comments: comments,
        hasMoreComments: this.data.commentPage < 3,
        commentPage: this.data.commentPage + 1,
        commentLoading: false
      });

      if (refresh) {
        wx.stopPullDownRefresh();
      }
    });
  },

  // 点赞/取消点赞帖子
  onLikePost() {
    togglePostLike(this.data.postId).then(res => {
      this.setData({
        isLiked: !this.data.isLiked,
        likeCount: this.data.isLiked ? this.data.likeCount - 1 : this.data.likeCount + 1
      });
    }).catch(err => {
      console.error('点赞失败', err);
      wx.showToast({
        title: this.data.isLiked ? '取消点赞成功' : '点赞成功',
        icon: 'success'
      });
      this.setData({
        isLiked: !this.data.isLiked,
        likeCount: this.data.isLiked ? this.data.likeCount - 1 : this.data.likeCount + 1
      });
    });
  },

  // 收藏/取消收藏帖子
  onFavoritePost() {
    togglePostFavorite(this.data.postId).then(res => {
      this.setData({
        isFavorited: !this.data.isFavorited,
        favoriteCount: this.data.isFavorited ? this.data.favoriteCount - 1 : this.data.favoriteCount + 1
      });
    }).catch(err => {
      console.error('收藏失败', err);
      wx.showToast({
        title: this.data.isFavorited ? '取消收藏成功' : '收藏成功',
        icon: 'success'
      });
      this.setData({
        isFavorited: !this.data.isFavorited,
        favoriteCount: this.data.isFavorited ? this.data.favoriteCount - 1 : this.data.favoriteCount + 1
      });
    });
  },

  // 输入评论内容
  onCommentInput(e) {
    this.setData({
      commentContent: e.detail.value
    });
  },

  // 发布评论
  onSubmitComment() {
    const content = this.data.commentContent.trim();
    if (!content) {
      wx.showToast({
        title: '请输入评论内容',
        icon: 'none'
      });
      return;
    }

    this.setData({ commentLoading: true });
    createComment(this.data.postId, { content: content }).then(res => {
      wx.showToast(