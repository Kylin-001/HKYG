// 校园公告详情页面JS
const campusApi = require('../../../api/campus');

Page({
  data: {
    announcementId: '',
    announcement: {},
    isLoading: false
  },

  onLoad: function (options) {
    // 获取公告ID
    const id = options.id;
    this.setData({
      announcementId: id
    });
    
    // 加载公告详情
    this.loadAnnouncementDetail();
  },

  /**
   * 加载公告详情
   */
  loadAnnouncementDetail: function () {
    this.setData({ isLoading: true });
    
    // 构建查询参数
    const params = {
      id: this.data.announcementId
    };
    
    campusApi.getAnnouncementDetail(params)
      .then(res => {
        // 设置公告信息
        this.setData({
          announcement: res.data || {},
          isLoading: false
        });
      })
      .catch(err => {
        console.error('加载公告详情失败:', err);
        // 使用模拟数据
        this.setData({
          announcement: {
            id: this.data.announcementId,
            title: '关于2024年春季学期开学通知',
            source: '校长办公室',
            createTime: '2024-02-15',
            summary: '根据学校安排，2024年春季学期将于2月20日正式开学，现将相关事宜通知如下...',
            content: '<div><p>各学院、各部门：</p><p>根据学校2024年春季学期工作安排，现将开学相关事宜通知如下：</p><h3>一、开学时间</h3><p>1. 学生：2月20日（星期一）正式上课。</p><p>2. 教职工：2月18日（星期六）正式上班。</p><h3>二、报到注册</h3><p>1. 学生报到时间：2月18日-19日。</p><p>2. 报到地点：各学院学生工作办公室。</p><h3>三、注意事项</h3><p>1. 请各学院、各部门做好开学前的各项准备工作。</p><p>2. 请全体师生按时报到，遵守学校各项规章制度。</p><p>3. 请各学院做好学生返校情况统计，并及时上报。</p><p>特此通知。</p><p>校长办公室</p><p>2024年2月15日</p></div>'
          },
          isLoading: false
        });
      });
  },

  /**
   * 分享功能
   */
  onShare: function () {
    return {
      title: this.data.announcement.title || '校园公告',
      path: `/pages/campus/announcement/detail?id=${this.data.announcementId}`,
      imageUrl: ''
    };
  },

  /**
   * 返回上一页
   */
  onBack: function () {
    wx.navigateBack();
  }
});