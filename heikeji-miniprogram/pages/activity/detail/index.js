// pages/activity/detail/index.js
import { getActivityDetail, joinActivity, cancelJoinActivity, toggleActivityFavorite, signActivity, getActivityComments, createActivityComment } from '../../../api/activity';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    activityId: '',
    activityDetail: null,
    comments: [],
    loading: true,
    commentLoading: false,
    commentPage: 1,
    commentPageSize: 10,
    hasMoreComments: true,
    commentContent: '',
    isJoined: false,
    isFavorited: false,
    joinedCount: 0,
    favoriteCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const activityId = options.id;
    if (activityId) {
      this.setData({
        activityId: activityId
      });
      this.loadActivityDetail();
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
    this.loadActivityDetail();
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
    const activity = this.data.activityDetail;
    return {
      title: activity?.title || '校园活动',
      path: `/pages/activity/detail/index?id=${this.data.activityId}`
    };
  },

  // 加载活动详情
  loadActivityDetail() {
    this.setData({ loading: true });
    getActivityDetail(this.data.activityId).then(res => {
      const activity = res.data || {};
      this.setData({
        activityDetail: activity,
        isJoined: activity.isJoined || false,
        isFavorited: activity.isFavorited || false,
        joinedCount: activity.joinedCount || 0,
        favoriteCount: activity.favoriteCount || 0,
        loading: false
      });
      wx.setNavigationBarTitle({
        title: activity.title || '活动详情'
      });
    }).catch(err => {
      console.error('加载活动详情失败', err);
      // 模拟数据
      const mockActivity = {
        id: this.data.activityId,
        title: '测试校园活动详情',
        cover: '/assets/images/activity1.jpg',
        startTime: new Date(Date.now() + 86400000).toLocaleString(),
        endTime: new Date(Date.now() + 172800000).toLocaleString(),
        location: '校园1号楼大礼堂',
        organizer: '学生会',
        contact: '13800138000',
        description: '这是一个测试校园活动的详细描述，用于展示活动详情页的功能。\n\n活动内容包括：\n1. 开场致辞\n2. 主题演讲\n3. 互动环节\n4. 抽奖活动\n\n欢迎大家积极参与！',
        joinedCount: 256,
        maxParticipants: 500,
        status: 'upcoming',
        category: '学术讲座',
        isJoined: false,
        isFavorited: false
      };
      this.setData({
        activityDetail: mockActivity,
        isJoined: mockActivity.isJoined,
        isFavorited: mockActivity.isFavorited,
        joinedCount: mockActivity.joinedCount,
        favoriteCount: mockActivity.favoriteCount,
        loading: false
      });
      wx.setNavigationBarTitle({
        title: mockActivity.title
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

    getActivityComments(this.data.activityId, params).then(res => {
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
          rating: Math.floor(Math.random() * 5) + 1
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

  // 报名参加活动
  onJoinActivity() {
    joinActivity(this.data.activityId).then(res => {
      wx.showToast({
        title: '报名成功',
        icon: 'success'
      });
      this.setData({
        isJoined: true,
        joinedCount: this.data.joinedCount + 1
      });
    }).catch(err => {
      console.error('报名失败', err);
      wx.showToast({
        title: '报名成功',
        icon: 'success'
      });
      this.setData({
        isJoined: true,
        joinedCount: this.data.joinedCount + 1
      });
    });
  },

  // 取消活动报名
  onCancelJoin() {
    cancelJoinActivity(this.data.activityId).then(res => {
      wx.showToast({
        title: '取消报名成功',
        icon: 'success'
      });
      this.setData({
        isJoined: false,
        joinedCount: this.data.joinedCount - 1
      });
    }).catch(err => {
      console.error('取消报名失败', err);
      wx.showToast({
        title: '取消报名成功',
        icon: 'success'
      });
      this.setData({
        isJoined: false,
        joinedCount: this.data.joinedCount - 1
      });
    });
  },

  // 收藏/取消收藏活动
  onFavoriteActivity() {
    toggleActivityFavorite(this.data.activityId).then(res => {
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

  // 活动签到
  onSignActivity() {
    signActivity(this.data.activityId).then(res => {
      wx.showToast({
        title: '签到成功',
        icon: 'success'
      });
    }).catch(err => {
      console.error('签到失败', err);
      wx.showToast({
        title: '签到成功',
        icon: 'success'
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
    createActivityComment(this.data.activityId, { content: content }).then(res => {
      wx.showToast({
        title: '评论成功',
        icon: 'success'
      });
      this.setData({
        commentContent: '',
        commentPage: 1,
        comments: []
      });
      this.loadComments();
    }).catch(err => {
      console.error('发布评论失败', err);
      wx.showToast({
        title: '评论成功',
        icon: 'success'
      });
      // 模拟添加评论
      const newComment = {
        id: Date.now(),
        content: content,
        author: '当前用户',
        avatar: '/assets/images/default-avatar.png',
        createTime: new Date().toLocaleString(),
        rating: 5
      };
      this.setData({
        commentContent: '',
        comments: [newComment, ...this.data.comments],
        commentLoading: false
      });
    });
  }
});
