// 校园地图页面JS
const campusApi = require('../../../api/campus');

Page({
  data: {
    // 地图相关
    longitude: 126.660631, // 默认经度（黑龙江科技大学）
    latitude: 45.769083, // 默认纬度（黑龙江科技大学）
    scale: 18, // 地图缩放级别
    markers: [], // 地图标记点
    polyline: [], // 地图路线
    controls: [], // 地图控件
    showLocation: true, // 显示当前位置
    // 建筑分类
    buildingCategories: {
      all: '全部',
      teaching: '教学楼',
      dormitory: '宿舍',
      dining: '餐厅',
      library: '图书馆',
      sports: '体育场馆',
      administration: '行政楼'
    },
    activeCategory: 'all', // 当前选中的分类
    buildings: [], // 所有建筑数据
    filteredBuildings: [], // 筛选后的建筑数据
    showBuildingList: false, // 是否显示建筑列表
    // 建筑详情
    showBuildingDetail: false, // 是否显示建筑详情
    selectedBuilding: {}, // 当前选中的建筑
    // 加载状态
    isLoading: false
  },

  onLoad: function (options) {
    // 加载校园地图数据
    this.loadCampusMapData();
  },

  onShow: function () {
    // 页面显示时刷新数据
    this.loadCampusMapData();
  },

  /**
   * 加载校园地图数据
   */
  loadCampusMapData: function () {
    this.setData({ isLoading: true });
    
    campusApi.getCampusMap()
      .then(res => {
        const buildings = res.data || [];
        const markers = this.generateMarkers(buildings);
        
        this.setData({
          buildings: buildings,
          filteredBuildings: buildings,
          markers: markers,
          isLoading: false
        });
      })
      .catch(err => {
        console.error('加载校园地图数据失败:', err);
        // 使用模拟数据
        const mockBuildings = this.getMockBuildings();
        const markers = this.generateMarkers(mockBuildings);
        
        this.setData({
          buildings: mockBuildings,
          filteredBuildings: mockBuildings,
          markers: markers,
          isLoading: false
        });
      });
  },

  /**
   * 生成地图标记点
   */
  generateMarkers: function (buildings) {
    return buildings.map(building => {
      let markerIcon = '/assets/icons/building.png';
      
      // 根据建筑类型设置不同的标记图标
      switch (building.type) {
        case 'teaching':
          markerIcon = '/assets/icons/teaching.png';
          break;
        case 'dormitory':
          markerIcon = '/assets/icons/dorm.png';
          break;
        case 'dining':
          markerIcon = '/assets/icons/dining.png';
          break;
        case 'library':
          markerIcon = '/assets/icons/library.png';
          break;
        case 'sports':
          markerIcon = '/assets/icons/sports.png';
          break;
        case 'administration':
          markerIcon = '/assets/icons/admin.png';
          break;
        default:
          markerIcon = '/assets/icons/building.png';
      }
      
      return {
        id: building.id,
        longitude: building.longitude,
        latitude: building.latitude,
        iconPath: markerIcon,
        width: 32,
        height: 32,
        title: building.name,
        callout: {
          content: building.name,
          color: '#333',
          fontSize: 12,
          borderRadius: 4,
          bgColor: '#fff',
          padding: 5,
          display: 'BYCLICK'
        }
      };
    });
  },

  /**
   * 建筑分类切换
   */
  onCategoryChange: function (e) {
    const category = e.currentTarget.dataset.category;
    
    let filteredBuildings = [];
    if (category === 'all') {
      filteredBuildings = this.data.buildings;
    } else {
      filteredBuildings = this.data.buildings.filter(building => building.type === category);
    }
    
    this.setData({
      activeCategory: category,
      filteredBuildings: filteredBuildings,
      markers: this.generateMarkers(filteredBuildings)
    });
  },

  /**
   * 点击地图
   */
  onMapTap: function (e) {
    this.setData({
      showBuildingList: false
    });
  },

  /**
   * 点击标记点
   */
  onMarkerTap: function (e) {
    const markerId = e.markerId;
    const building = this.data.buildings.find(b => b.id === markerId);
    
    if (building) {
      this.setData({
        selectedBuilding: building,
        showBuildingDetail: true
      });
    }
  },

  /**
   * 点击控件
   */
  onControlTap: function (e) {
    const controlId = e.controlId;
    // 处理控件点击事件
  },

  /**
   * 地图区域变化
   */
  onRegionChange: function (e) {
    // 处理地图区域变化事件
  },

  /**
   * 定位当前位置
   */
  onLocate: function () {
    wx.getLocation({
      type: 'gcj02',
      success: res => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude,
          scale: 18
        });
      },
      fail: err => {
        console.error('获取位置失败:', err);
        wx.showToast({
          title: '定位失败，请检查权限设置',
          icon: 'none'
        });
      }
    });
  },

  /**
   * 点击建筑列表项
   */
  onBuildingTap: function (e) {
    const buildingId = e.currentTarget.dataset.id;
    const building = this.data.buildings.find(b => b.id === buildingId);
    
    if (building) {
      this.setData({
        selectedBuilding: building,
        showBuildingDetail: true,
        longitude: building.longitude,
        latitude: building.latitude,
        scale: 18
      });
    }
  },

  /**
   * 显示/隐藏建筑详情
   */
  onCloseDetail: function () {
    this.setData({
      showBuildingDetail: false,
      selectedBuilding: {}
    });
  },

  /**
   * 导航到建筑
   */
  onNavigate: function () {
    const building = this.data.selectedBuilding;
    if (!building) return;
    
    wx.openLocation({
      longitude: building.longitude,
      latitude: building.latitude,
      name: building.name,
      address: building.address,
      scale: 18
    });
  },

  /**
   * 返回上一页
   */
  onBack: function () {
    wx.navigateBack();
  },

  /**
   * 获取模拟建筑数据
   */
  getMockBuildings: function () {
    return [
      {
        id: 1,
        name: '第一教学楼',
        type: 'teaching',
        typeName: '教学楼',
        address: '黑龙江科技大学校内',
        description: '主要用于本科生教学',
        longitude: 126.660531,
        latitude: 45.768983
      },
      {
        id: 2,
        name: '第二教学楼',
        type: 'teaching',
        typeName: '教学楼',
        address: '黑龙江科技大学校内',
        description: '主要用于研究生教学',
        longitude: 126.661631,
        latitude: 45.768083
      },
      {
        id: 3,
        name: '图书馆',
        type: 'library',
        typeName: '图书馆',
        address: '黑龙江科技大学校内',
        description: '学校图书馆，藏书丰富',
        longitude: 126.660031,
        latitude: 45.769583
      },
      {
        id: 4,
        name: '学生第一食堂',
        type: 'dining',
        typeName: '餐厅',
        address: '黑龙江科技大学校内',
        description: '学生第一食堂，提供各种美食',
        longitude: 126.659031,
        latitude: 45.767083
      },
      {
        id: 5,
        name: '学生宿舍1号楼',
        type: 'dormitory',
        typeName: '宿舍',
        address: '黑龙江科技大学校内',
        description: '学生宿舍1号楼',
        longitude: 126.658031,
        latitude: 45.766083
      },
      {
        id: 6,
        name: '体育馆',
        type: 'sports',
        typeName: '体育场馆',
        address: '黑龙江科技大学校内',
        description: '学校体育馆，设施齐全',
        longitude: 126.662631,
        latitude: 45.769083
      },
      {
        id: 7,
        name: '行政楼',
        type: 'administration',
        typeName: '行政楼',
        address: '黑龙江科技大学校内',
        description: '学校行政办公大楼',
        longitude: 126.660531,
        latitude: 45.770083
      }
    ];
  }
});