// 空教室查询页面JS
const campusApi = require('../../../api/campus');

Page({
  data: {
    // 日期选择
    selectedDate: '',
    // 时间段选择
    timeRanges: [
      '第1-2节 (08:00-09:40)',
      '第3-4节 (10:00-11:40)',
      '第5-6节 (14:00-15:40)',
      '第7-8节 (16:00-17:40)',
      '第9-10节 (18:00-19:40)',
      '第11-12节 (20:00-21:40)'
    ],
    selectedTimeIndex: 0,
    // 教学楼选择
    buildings: ['全部教学楼', '第一教学楼', '第二教学楼', '第三教学楼', '第四教学楼', '第五教学楼'],
    selectedBuildingIndex: 0,
    // 楼层选择
    floors: ['全部楼层', '1层', '2层', '3层', '4层', '5层', '6层'],
    selectedFloorIndex: 0,
    // 空教室列表
    classrooms: [],
    // 加载状态
    isLoading: false
  },

  onLoad: function (options) {
    // 初始化日期为今天
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    
    this.setData({
      selectedDate: formattedDate
    });

    // 默认查询当前时间段的空教室
    this.searchEmptyClassrooms();
  },

  /**
   * 处理日期选择
   */
  onDateChange: function (e) {
    this.setData({
      selectedDate: e.detail.value
    });
  },

  /**
   * 处理时间段选择
   */
  onTimeChange: function (e) {
    this.setData({
      selectedTimeIndex: e.detail.value
    });
  },

  /**
   * 处理教学楼选择
   */
  onBuildingChange: function (e) {
    this.setData({
      selectedBuildingIndex: e.detail.value
    });
  },

  /**
   * 处理楼层选择
   */
  onFloorChange: function (e) {
    this.setData({
      selectedFloorIndex: e.detail.value
    });
  },

  /**
   * 查询空教室
   */
  searchEmptyClassrooms: function () {
    this.setData({ isLoading: true, classrooms: [] });

    // 构建查询参数
    const params = {
      date: this.data.selectedDate,
      timeSlot: this.data.selectedTimeIndex + 1,
      building: this.data.selectedBuildingIndex === 0 ? '' : this.data.buildings[this.data.selectedBuildingIndex],
      floor: this.data.selectedFloorIndex === 0 ? '' : this.data.selectedFloorIndex
    };

    campusApi.getEmptyClassrooms(params)
      .then(res => {
        this.setData({
          classrooms: res.data || [],
          isLoading: false
        });
      })
      .catch(err => {
        console.error('查询空教室失败:', err);
        // 使用模拟数据
        this.setData({
          classrooms: [
            { id: 1, name: 'A101', building: '第一教学楼', floor: 1, capacity: 50 },
            { id: 2, name: 'A102', building: '第一教学楼', floor: 1, capacity: 50 },
            { id: 3, name: 'A103', building: '第一教学楼', floor: 1, capacity: 50 },
            { id: 4, name: 'B201', building: '第二教学楼', floor: 2, capacity: 40 },
            { id: 5, name: 'B202', building: '第二教学楼', floor: 2, capacity: 40 },
            { id: 6, name: 'B203', building: '第二教学楼', floor: 2, capacity: 40 }
          ],
          isLoading: false
        });
      });
  },

  /**
   * 导航到教室详情
   */
  navigateToClassroomDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/campus/classroom/detail?id=${id}`
    });
  },

  /**
   * 返回上一页
   */
  onBack: function () {
    wx.navigateBack();
  }
});
