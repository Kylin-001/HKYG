// 图书馆座位预约JS
const campusApi = require('../../../api/campus');

Page({
  data: {
    // 导航选项
    currentNav: 'today',
    // 日期选择
    startDate: '',
    endDate: '',
    currentDate: '',
    // 时间段选项
    timeSlots: [
      { id: 1, label: '8:00-10:00', value: '08:00-10:00' },
      { id: 2, label: '10:00-12:00', value: '10:00-12:00' },
      { id: 3, label: '14:00-16:00', value: '14:00-16:00' },
      { id: 4, label: '16:00-18:00', value: '16:00-18:00' },
      { id: 5, label: '18:00-20:00', value: '18:00-20:00' },
      { id: 6, label: '20:00-22:00', value: '20:00-22:00' }
    ],
    selectedTime: '',
    // 楼层选项
    floors: [1, 2, 3, 4],
    selectedFloor: 1,
    // 座位数据
    seats: [],
    selectedSeat: null,
    // 加载状态
    isLoading: false,
    // 预约按钮状态
    canReserve: false,
    reserveBtnText: '选择座位进行预约'
  },

  onLoad: function (options) {
    // 初始化日期
    this.initDate();
    // 加载座位数据
    this.loadSeatData();
  },

  /**
   * 初始化日期
   */
  initDate: function () {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 7);

    this.setData({
      startDate: this.formatDate(today),
      endDate: this.formatDate(endDate),
      currentDate: this.formatDate(today)
    });
  },

  /**
   * 格式化日期
   */
  formatDate: function (date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * 切换导航
   */
  switchNav: function (e) {
    const nav = e.currentTarget.dataset.nav;
    this.setData({ currentNav: nav });

    // 根据导航切换日期
    const today = new Date();
    let targetDate;
    
    switch (nav) {
      case 'today':
        targetDate = today;
        break;
      case 'tomorrow':
        targetDate = new Date(today);
        targetDate.setDate(targetDate.getDate() + 1);
        break;
      case 'week':
        targetDate = today;
        break;
    }
    
    this.setData({
      currentDate: this.formatDate(targetDate)
    });
    
    // 重新加载座位数据
    this.loadSeatData();
  },

  /**
   * 日期变化
   */
  onDateChange: function (e) {
    this.setData({
      currentDate: e.detail.value
    });
    // 重新加载座位数据
    this.loadSeatData();
  },

  /**
   * 选择时间段
   */
  selectTime: function (e) {
    const time = e.currentTarget.dataset.time;
    this.setData({ selectedTime: time });
    // 检查是否可以预约
    this.checkReserveStatus();
    // 重新加载座位数据
    this.loadSeatData();
  },

  /**
   * 选择楼层
   */
  selectFloor: function (e) {
    const floor = e.currentTarget.dataset.floor;
    this.setData({ selectedFloor: floor });
    // 重新加载座位数据
    this.loadSeatData();
  },

  /**
   * 选择座位
   */
  selectSeat: function (e) {
    const seat = e.currentTarget.dataset.seat;
    if (seat.status !== 'available') {
      wx.showToast({
        title: seat.status === 'occupied' ? '座位已被占用' : '座位已被预约',
        icon: 'none'
      });
      return;
    }
    this.setData({ selectedSeat: seat });
    // 检查是否可以预约
    this.checkReserveStatus();
  },

  /**
   * 检查是否可以预约
   */
  checkReserveStatus: function () {
    const { selectedTime, selectedSeat } = this.data;
    if (selectedTime && selectedSeat) {
      this.setData({
        canReserve: true,
        reserveBtnText: '确认预约'
      });
    } else {
      this.setData({
        canReserve: false,
        reserveBtnText: '选择座位进行预约'
      });
    }
  },

  /**
   * 加载座位数据
   */
  loadSeatData: function () {
    if (this.data.isLoading) {
      return;
    }

    this.setData({ isLoading: true });

    const { currentDate, selectedTime, selectedFloor } = this.data;

    campusApi.getLibrarySeats({
      floor: selectedFloor,
      date: currentDate,
      time: selectedTime,
      cache: true
    }).then(res => {
      const seats = res.data || this.generateMockSeats();
      this.setData({ seats });
    }).catch(err => {
      console.error('加载座位数据失败:', err);
      // 使用模拟数据
      const mockSeats = this.generateMockSeats();
      this.setData({ seats: mockSeats });
    }).finally(() => {
      this.setData({ isLoading: false });
    });
  },

  /**
   * 生成模拟座位数据
   */
  generateMockSeats: function () {
    const seats = [];
    const statuses = ['available', 'occupied', 'reserved'];
    const statusTexts = {
      available: '可用',
      occupied: '已占用',
      reserved: '已预约'
    };

    for (let i = 1; i <= 30; i++) {
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      seats.push({
        id: i,
        number: `${i}`,
        location: `${this.data.selectedFloor}层A区`,
        status: randomStatus,
        statusText: statusTexts[randomStatus],
        isWindow: i % 5 === 0,
        isPower: i % 3 === 0
      });
    }

    return seats;
  },

  /**
   * 确认预约
   */
  confirmReservation: function () {
    const { selectedSeat, selectedTime, currentDate } = this.data;
    
    if (!selectedSeat || !selectedTime) {
      wx.showToast({
        title: '请选择座位和时间段',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认预约',
      content: `是否确认预约${currentDate} ${selectedTime}的${selectedSeat.number}号座位？`,
      success: res => {
        if (res.confirm) {
          this.doReservation();
        }
      }
    });
  },

  /**
   * 执行预约
   */
  doReservation: function () {
    const { selectedSeat, selectedTime, currentDate } = this.data;
    
    this.setData({ isLoading: true });
    
    campusApi.reserveLibrarySeat({
      seatId: selectedSeat.id,
      date: currentDate,
      time: selectedTime
    }).then(res => {
      wx.showToast({
        title: '预约成功',
        icon: 'success'
      });
      
      // 更新座位状态
      const seats = this.data.seats.map(seat => {
        if (seat.id === selectedSeat.id) {
          return {
            ...seat,
            status: 'reserved',
            statusText: '已预约'
          };
        }
        return seat;
      });
      
      this.setData({
        seats,
        selectedSeat: null,
        canReserve: false,
        reserveBtnText: '选择座位进行预约'
      });
      
      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }).catch(err => {
      wx.showToast({
        title: err.message || '预约失败，请重试',
        icon: 'none'
      });
    }).finally(() => {
      this.setData({ isLoading: false });
    });
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.loadSeatData().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});