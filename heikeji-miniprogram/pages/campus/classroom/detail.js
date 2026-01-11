// 教室详情页面JS
const campusApi = require('../../../api/campus');

Page({
  data: {
    classroomId: '',
    classroom: {},
    todaysClasses: [],
    currentStatus: 'empty', // empty 或 occupied
    isLoading: false,
    timeRanges: [
      '第1-2节 (08:00-09:40)',
      '第3-4节 (10:00-11:40)',
      '第5-6节 (14:00-15:40)',
      '第7-8节 (16:00-17:40)',
      '第9-10节 (18:00-19:40)',
      '第11-12节 (20:00-21:40)'
    ]
  },

  onLoad: function (options) {
    // 获取教室ID
    const id = options.id;
    this.setData({
      classroomId: id
    });
    
    // 加载教室详情
    this.loadClassroomDetail();
  },

  /**
   * 加载教室详情
   */
  loadClassroomDetail: function () {
    this.setData({ isLoading: true });
    
    // 构建查询参数
    const params = {
      id: this.data.classroomId
    };
    
    campusApi.getClassroomDetail(params)
      .then(res => {
        // 设置教室信息
        this.setData({
          classroom: res.data || {},
          todaysClasses: res.data.todaysClasses || [],
          currentStatus: this.getCurrentStatus(res.data.todaysClasses || []),
          isLoading: false
        });
      })
      .catch(err => {
        console.error('加载教室详情失败:', err);
        // 使用模拟数据
        this.setData({
          classroom: {
            id: this.data.classroomId,
            name: 'A101',
            building: '第一教学楼',
            floor: 1,
            capacity: 50
          },
          todaysClasses: [
            {
              timeRange: '第3-4节 (10:00-11:40)',
              courseName: '高等数学',
              teacher: '张老师',
              className: '计算机科学与技术1班'
            },
            {
              timeRange: '第7-8节 (16:00-17:40)',
              courseName: '大学英语',
              teacher: '李老师',
              className: '计算机科学与技术2班'
            }
          ],
          currentStatus: this.getCurrentStatus([
            {
              timeRange: '第3-4节 (10:00-11:40)',
              courseName: '高等数学',
              teacher: '张老师',
              className: '计算机科学与技术1班'
            },
            {
              timeRange: '第7-8节 (16:00-17:40)',
              courseName: '大学英语',
              teacher: '李老师',
              className: '计算机科学与技术2班'
            }
          ]),
          isLoading: false
        });
      });
  },

  /**
   * 获取当前教室状态
   */
  getCurrentStatus: function (classes) {
    // 获取当前时间
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // 定义时间段的分钟范围
    const timeRangesInMinutes = [
      { start: 8 * 60, end: 9 * 60 + 40 },   // 第1-2节
      { start: 10 * 60, end: 11 * 60 + 40 }, // 第3-4节
      { start: 14 * 60, end: 15 * 60 + 40 }, // 第5-6节
      { start: 16 * 60, end: 17 * 60 + 40 }, // 第7-8节
      { start: 18 * 60, end: 19 * 60 + 40 }, // 第9-10节
      { start: 20 * 60, end: 21 * 60 + 40 }  // 第11-12节
    ];
    
    // 检查当前时间是否在某个课程时间段内
    for (const range of timeRangesInMinutes) {
      if (currentTimeInMinutes >= range.start && currentTimeInMinutes <= range.end) {
        return 'occupied';
      }
    }
    
    return 'empty';
  },

  /**
   * 返回上一页
   */
  onBack: function () {
    wx.navigateBack();
  }
});