import Mock from 'mockjs'
import { generateAnnouncements, generateCampusActivities, generateLeaveApplications, generateScholarships } from './generators/studentAffairs'

// 配置 Mock.js 不拦截高德地图的请求
// 注意：Mock.setup 由 vite-plugin-mock 自动调用，这里不需要重复设置
if (Mock.XHR.prototype.__send === undefined) {
  Mock.XHR.prototype.__send = Mock.XHR.prototype.send
  Mock.XHR.prototype.send = function () {
    const url = this.url
    // 不拦截高德地图相关的请求（包括瓦片服务器）
    if (url && (
      url.includes('amap.com') ||
      url.includes('jsapi.amap.com') ||
      url.includes('webapi.amap.com') ||
      url.includes('restapi.amap.com') ||
      url.includes('custyle.amap.com') ||
      url.includes('mapplugin.amap.com') ||
      url.includes('o4.amap.com') ||
      url.includes('is.autonavi.com') ||
      url.includes('webrd0') ||
      url.includes('webst0') ||
      url.includes('vector.amap.com')
    )) {
      // 使用原始 XHR 发送请求，不经过 Mock
      return this.__send.apply(this, arguments)
    }
    // 其他请求正常走 Mock
    return this.__send.apply(this, arguments)
  }
}

// 登录相关Mock
Mock.mock('/api/auth/login', 'post', {
  code: 200,
  message: 'success',
  data: {
    token: '@guid',
    user: {
      id: '@id',
      username: '@cname',
      avatar: '@image("100x100", "#4A90E2", "#FFF", "Avatar")',
      role: 'student',
      studentId: '2021@string("number", 8)',
      class: '计算机科学与技术2021级1班',
      college: '计算机科学与技术学院'
    }
  }
})

Mock.mock('/api/auth/register', 'post', {
  code: 200,
  message: 'success',
  data: {
    token: '@guid',
    user: {
      id: '@id',
      username: '@cname',
      role: 'student'
    }
  }
})

// 用户相关Mock - 同时支持 /api/user/info 和 /user/info
Mock.mock(/\/api\/user\/info|user\/info/, 'get', {
  code: 200,
  message: 'success',
  data: {
    id: '@id',
    username: '@cname',
    avatar: '@image("100x100", "#4A90E2", "#FFF", "Avatar")',
    role: 'student',
    studentId: '2021@string("number", 8)',
    class: '计算机科学与技术2021级1班',
    college: '计算机科学与技术学院',
    phone: '@string("number", 11)',
    email: '@email'
  }
})

// 商品相关Mock - 同时支持 /api/products/hot 和 /products/hot
Mock.mock(/\/api\/products\/hot|products\/hot/, 'get', {
  code: 200,
  message: 'success',
  'data|8': [{
    id: '@id',
    name: '@ctitle(5, 15)',
    description: '@cparagraph(2, 4)',
    price: '@float(10, 500, 2, 2)',
    originalPrice: '@float(20, 800, 2, 2)',
    cover: '@image("300x300", "#667eea", "#FFF", "Product")',
    'images|3-5': ['@image("300x300", "#667eea", "#FFF", "Product")'],
    category: '@pick(["数码产品", "图书教材", "运动户外", "生活用品", "服饰鞋包", "食品零食"])',
    'stock|10-100': 50,
    'sales|0-1000': 100,
    'rating|1-5': 4.5,
    'reviews|0-100': 20,
    merchant: {
      id: '@id',
      name: '@ctitle(3, 8)店',
      logo: '@image("100x100", "#10b981", "#FFF", "Shop")'
    },
    tags: ['@pick(["热销", "新品", "特价", "包邮"])'],
    createTime: '@datetime'
  }]
})

// 课程表相关Mock
Mock.mock('/api/schedule', 'get', {
  code: 200,
  message: 'success',
  'data|5': [{
    'day|+1': 1,
    'courses|3-5': [{
      id: '@id',
      name: '@ctitle(3, 5)',
      teacher: '@cname',
      location: '@pick(["教学楼A", "教学楼B", "实验楼"])@integer(101, 405)',
      'startWeek|1-16': 1,
      'endWeek|1-16': 16,
      'day|1-7': 1,
      'startSection|1-8': 1,
      'endSection|1-8': 2
    }]
  }]
})

// 成绩相关Mock
Mock.mock('/api/grades', 'get', {
  code: 200,
  message: 'success',
  'data|8-12': [{
    id: '@id',
    courseName: '@ctitle(3, 6)',
    credit: '@float(1, 4, 1, 1)',
    grade: '@integer(60, 100)',
    gpa: '@float(1, 4, 2, 2)',
    semester: '@pick(["2023-2024-1", "2023-2024-2"])',
    type: '@pick(["必修", "选修"])'
  }]
})

// GPA相关Mock - 同时支持 /api/campus/gpa 和 /campus/gpa
Mock.mock(/\/api\/campus\/gpa|campus\/gpa/, 'get', {
  code: 200,
  message: 'success',
  data: {
    totalGPA: '@float(2.5, 4.0, 2, 2)',
    totalCredits: '@integer(120, 160)',
    semesterGPA: {
      '2023-2024-1': '@float(2.8, 4.0, 2, 2)',
      '2023-2024-2': '@float(2.8, 4.0, 2, 2)',
      '2022-2023-1': '@float(2.8, 4.0, 2, 2)',
      '2022-2023-2': '@float(2.8, 4.0, 2, 2)'
    }
  }
})

// 图书馆相关Mock
Mock.mock('/api/library/books', 'get', {
  code: 200,
  message: 'success',
  'data|10-20': [{
    id: '@id',
    title: '@ctitle(5, 15)',
    author: '@cname',
    publisher: '@ctitle(3, 8)出版社',
    isbn: '@string("number", 13)',
    'available|1': [true, false],
    location: '@pick(["A区", "B区", "C区"])@integer(1, 5)架',
    publishDate: '@date'
  }]
})

Mock.mock('/api/library/borrowed', 'get', {
  code: 200,
  message: 'success',
  'data|3-5': [{
    id: '@id',
    bookTitle: '@ctitle(5, 15)',
    author: '@cname',
    borrowDate: '@date',
    returnDate: '@date',
    'renewable|1': [true, false]
  }]
})

// 教室预约相关Mock
Mock.mock('/api/classroom/buildings', 'get', {
  code: 200,
  message: 'success',
  'data|3': [{
    id: '@id',
    name: '@pick(["教学楼A", "教学楼B", "实验楼"])',
    'classrooms|5-10': [{
      id: '@id',
      roomNumber: '@integer(101, 405)',
      'capacity|30-120': 60,
      'type|1': ['多媒体教室', '普通教室', '实验室'],
      'equipment|1-3': ['投影仪', '音响', '电脑'],
      'available|1': [true, false]
    }]
  }]
})

Mock.mock('/api/classroom/appointments', 'get', {
  code: 200,
  message: 'success',
  'data|5-10': [{
    id: '@id',
    classroomId: '@id',
    buildingName: '@pick(["教学楼A", "教学楼B"])',
    roomNumber: '@integer(101, 405)',
    date: '@date',
    'startTime|1': ['08:00', '10:00', '14:00', '16:00'],
    'endTime|1': ['10:00', '12:00', '16:00', '18:00'],
    purpose: '@ctitle(5, 10)',
    status: '@pick(["pending", "approved", "rejected"])'
  }]
})

// 校园地图数据 - 黑龙江科技大学（坐标已根据高德地图实际位置校准）
// 学校地址：哈尔滨市松北区浦源路2468号
// 基准坐标（高德地图主位置）：126.654111, 45.819751
const campusMapData = {
  buildings: [
    // 行政办公区（校园中心偏北）
    {
      id: '1',
      name: '主楼（行政办公楼）',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.654111,
      latitude: 45.819751,
      tags: ['办公', '行政', '会议'],
      openTime: '08:00 - 17:00',
      phone: '0451-88033301',
      description: '学校主办公楼，设有校长办公室、教务处、学生处等行政部门。'
    },
    // 教学区（校园中部）
    {
      id: '2',
      name: '第一教学楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.652232,
      latitude: 45.819501,
      tags: ['上课', '自习', '考试'],
      openTime: '06:00 - 22:00',
      phone: '0451-88033302',
      description: '学校主要教学楼之一，拥有多媒体教室80间。'
    },
    {
      id: '3',
      name: '第二教学楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.652896,
      latitude: 45.818313,
      tags: ['上课', '自习', '考试'],
      openTime: '06:00 - 22:00',
      phone: '0451-88033303',
      description: '学校主要教学楼之一，配备现代化教学设备。'
    },
    {
      id: '4',
      name: '矿业工程实验楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.651109,
      latitude: 45.816803,
      tags: ['实验', '科研', '矿业'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033304',
      description: '矿业工程专业实验楼，配备采矿、安全等专业实验室。'
    },
    {
      id: '5',
      name: '机电工程实验楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.651124,
      latitude: 45.817178,
      tags: ['实验', '科研', '机电'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033305',
      description: '机电工程专业实验楼，配备机械、电气等专业实验室。'
    },
    // 图书馆（校园中心）
    {
      id: '6',
      name: '图书馆',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'library',
      longitude: 126.654315,
      latitude: 45.819798,
      tags: ['借阅', '自习', '电子资源'],
      openTime: '07:00 - 22:30',
      phone: '0451-88033306',
      description: '学校图书馆，总建筑面积31654平方米，藏书185万册，提供自习座位2000个。图书馆改造工程正在有序推进。'
    },
    // 食堂区（校园东部）
    {
      id: '7',
      name: '第一食堂（学生一餐厅/沁芳园）',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dining',
      longitude: 126.655437,
      latitude: 45.820711,
      tags: ['餐饮', '早餐', '午餐', '晚餐'],
      openTime: '06:30 - 21:00',
      phone: '0451-88033307',
      description: '学校第一食堂（沁芳园），提供各类中式快餐、面食、小吃等。食堂环境显著提升，菜品种类丰富多样。'
    },
    {
      id: '8',
      name: '第二食堂（学生二餐厅/知味园）',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dining',
      longitude: 126.653199,
      latitude: 45.816732,
      tags: ['餐饮', '小炒', '特色菜'],
      openTime: '06:30 - 21:00',
      phone: '0451-88033308',
      description: '学校第二食堂（知味园），以现炒小炒和特色菜品为主。'
    },
    {
      id: '9',
      name: '教工餐厅',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dining',
      longitude: 126.652557,
      latitude: 45.819567,
      tags: ['餐饮', '教工', '自助餐'],
      openTime: '11:00 - 13:00, 17:00 - 19:00',
      phone: '0451-88033309',
      description: '教工专用餐厅，提供自助餐服务。'
    },
    {
      id: '10',
      name: '第三食堂（沁香园）',
      address: '哈尔滨市松北区糖厂街5号',
      category: 'dining',
      longitude: 126.651816,
      latitude: 45.817892,
      tags: ['餐饮', '快餐', '小吃'],
      openTime: '06:30 - 21:00',
      phone: '0451-88033310',
      description: '学校第三食堂（沁香园），提供各类快餐和小吃。'
    },
    // 宿舍区（校园南部）
    {
      id: '11',
      name: '学生公寓1号楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.654818,
      latitude: 45.817689,
      tags: ['住宿', '生活'],
      openTime: '全天',
      phone: '0451-88033311',
      description: '男生公寓楼，可容纳1200名学生。住宿费：四人间1200元/年，六人间800元/年。'
    },
    {
      id: '12',
      name: '学生公寓2号楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.655818,
      latitude: 45.817189,
      tags: ['住宿', '生活'],
      openTime: '全天',
      phone: '0451-88033312',
      description: '男生公寓楼，可容纳1200名学生。'
    },
    {
      id: '13',
      name: '学生公寓3号楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.656818,
      latitude: 45.817689,
      tags: ['住宿', '生活'],
      openTime: '全天',
      phone: '0451-88033313',
      description: '女生公寓楼，可容纳1000名学生。'
    },
    {
      id: '14',
      name: '学生公寓4号楼（第四学生公寓）',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.654818,
      latitude: 45.817689,
      tags: ['住宿', '生活'],
      openTime: '全天',
      phone: '0451-88033314',
      description: '女生公寓楼，可容纳1000名学生。'
    },
    {
      id: '15',
      name: '学生公寓5号楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.657818,
      latitude: 45.817189,
      tags: ['住宿', '生活'],
      openTime: '全天',
      phone: '0451-88033315',
      description: '学生公寓楼，可容纳800名学生。'
    },
    {
      id: '16',
      name: '学生公寓6号楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.658818,
      latitude: 45.817689,
      tags: ['住宿', '生活'],
      openTime: '全天',
      phone: '0451-88033316',
      description: '学生公寓楼，可容纳800名学生。'
    },
    {
      id: '17',
      name: '人才公寓',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.659818,
      latitude: 45.818189,
      tags: ['住宿', '人才', '教师'],
      openTime: '全天',
      phone: '0451-88033317',
      description: '高标准"江景房"人才公寓，为引进博士教师提供舒适、温馨的居住条件，助力学校引才工作。'
    },
    // 运动场馆（校园西部和北部）
    {
      id: '18',
      name: '体育馆',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'sports',
      longitude: 126.652866,
      latitude: 45.817261,
      tags: ['运动', '篮球', '羽毛球', '乒乓球'],
      openTime: '08:00 - 21:00',
      phone: '0451-88033318',
      description: '学校体育馆，设有篮球场、羽毛球场、乒乓球场等室内运动场地。篮球馆已完成升级改造。'
    },
    {
      id: '19',
      name: '田径运动场',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'sports',
      longitude: 126.651866,
      latitude: 45.816261,
      tags: ['运动', '跑步', '足球'],
      openTime: '06:00 - 22:00',
      phone: '0451-88033319',
      description: '标准400米塑胶田径场，设有足球场和跑道。'
    },
    {
      id: '20',
      name: '游泳馆',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'sports',
      longitude: 126.653057,
      latitude: 45.819209,
      tags: ['运动', '游泳', '健身'],
      openTime: '09:00 - 21:00',
      phone: '0451-88033320',
      description: '学校游泳馆，设有标准泳池和健身房。'
    },
    {
      id: '21',
      name: '气排球馆',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'sports',
      longitude: 126.650866,
      latitude: 45.817261,
      tags: ['运动', '气排球', '体育'],
      openTime: '08:00 - 21:00',
      phone: '0451-88033321',
      description: '专业气排球馆，经过改造升级，设施完善，为师生体育锻炼提供优质场地。'
    },
    {
      id: '22',
      name: '羽毛球馆',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'sports',
      longitude: 126.650866,
      latitude: 45.815261,
      tags: ['运动', '羽毛球', '体育'],
      openTime: '08:00 - 21:00',
      phone: '0451-88033322',
      description: '羽毛球馆，正在有序推进改造升级。'
    },
    {
      id: '23',
      name: '网球场',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'sports',
      longitude: 126.651866,
      latitude: 45.818261,
      tags: ['运动', '网球', '体育'],
      openTime: '06:00 - 22:00',
      phone: '0451-88033323',
      description: '学校网球场，为学生提供网球运动场地。'
    },
    {
      id: '24',
      name: '塑胶操场',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'sports',
      longitude: 126.651866,
      latitude: 45.815261,
      tags: ['运动', '跑步', '健身'],
      openTime: '06:00 - 22:00',
      phone: '0451-88033324',
      description: '学校塑胶操场，为学生提供跑步和健身场地。'
    },
    // 医疗服务（校园东北部）
    {
      id: '25',
      name: '校医院',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'medical',
      longitude: 126.658792,
      latitude: 45.820809,
      tags: ['医疗', '急诊', '体检'],
      openTime: '24小时',
      phone: '0451-88033325',
      description: '学校附属医院，提供日常诊疗、急诊和体检服务。'
    },
    // 服务设施（校园各区域）
    {
      id: '26',
      name: '大学生活动中心',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.651919,
      latitude: 45.818793,
      tags: ['活动', '社团', '会议'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033326',
      description: '学生活动中心，设有报告厅、会议室、社团活动室等。'
    },
    {
      id: '27',
      name: '大学生服务中心',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.652232,
      latitude: 45.819501,
      tags: ['服务', '咨询', '办事'],
      openTime: '08:00 - 17:00',
      phone: '0451-88033327',
      description: '提供学生事务办理、就业指导、心理咨询等服务。'
    },
    {
      id: '28',
      name: '校园超市（教育超市）',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.653525,
      latitude: 45.817225,
      tags: ['购物', '日用品', '零食'],
      openTime: '07:00 - 23:00',
      phone: '0451-88033328',
      description: '校园超市，提供日用品、零食、文具等商品。'
    },
    {
      id: '29',
      name: '快递服务中心',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.653737,
      latitude: 45.817529,
      tags: ['快递', '取件', '寄件'],
      openTime: '09:00 - 19:00',
      phone: '0451-88033329',
      description: '校园快递集中收发点，支持各大快递公司。'
    },
    {
      id: '30',
      name: '洗浴中心',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.653737,
      latitude: 45.817529,
      tags: ['洗浴', '热水', '生活'],
      openTime: '10:00 - 22:00',
      phone: '0451-88033330',
      description: '学生公共洗浴中心，提供热水淋浴服务。'
    },
    {
      id: '31',
      name: '开水房',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.654737,
      latitude: 45.817029,
      tags: ['热水', '开水', '生活'],
      openTime: '06:00 - 23:00',
      phone: '0451-88033331',
      description: '提供免费开水服务。'
    },
    {
      id: '32',
      name: '科技大厦',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.651919,
      latitude: 45.818793,
      tags: ['科研', '办公', '会议'],
      openTime: '08:00 - 17:00',
      phone: '0451-88033332',
      description: '科技大厦，设有科研实验室、学术报告厅和会议室。'
    },
    {
      id: '33',
      name: '安全与应急管理实践平台（碳谷大厦）',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.652392,
      latitude: 45.823424,
      tags: ['实验', '科研', '安全', '应急'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033333',
      description: '"十四五"教育强国项目，2025年6月竣工投入使用。项目用地面积2.30万平方米，建筑面积2.70万平方米，用于安全与应急管理实践教学。'
    },
    {
      id: '34',
      name: '学校招待所',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.658625,
      latitude: 45.819625,
      tags: ['住宿', '接待', '宾馆'],
      openTime: '全天',
      phone: '0451-88033334',
      description: '学校招待所，为来访人员提供住宿服务。'
    },
    {
      id: '35',
      name: '创新创业学院',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.651919,
      latitude: 45.818793,
      tags: ['创业', '创新', '孵化'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033335',
      description: '创新创业学院，为学生提供创业指导和孵化服务。'
    },
    {
      id: '36',
      name: '网络信息中心',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.650525,
      latitude: 45.815925,
      tags: ['网络', '信息', '技术'],
      openTime: '08:00 - 17:00',
      phone: '0451-88033336',
      description: '网络信息中心，负责校园网络建设和维护。'
    },
    {
      id: '78',
      name: '科技园松北园区',
      address: '哈尔滨市松北区浦源路2468号黑龙江科技大学',
      category: 'service',
      longitude: 126.652371,
      latitude: 45.815711,
      tags: ['科研', '园区', '创新'],
      openTime: '08:00 - 17:00',
      phone: '0451-88033378',
      description: '黑龙江科技大学科技园松北园区，位于校园内，为科技成果转化和企业孵化提供服务。'
    },
    {
      id: '37',
      name: '财务处',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.654111,
      latitude: 45.819751,
      tags: ['财务', '缴费', '报销'],
      openTime: '08:00 - 17:00',
      phone: '0451-88033337',
      description: '学校财务处，负责学费收缴、报销等财务业务。'
    },
    {
      id: '38',
      name: '保卫处',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.658792,
      latitude: 45.820809,
      tags: ['安全', '保卫', '门禁'],
      openTime: '全天',
      phone: '0451-88033338',
      description: '学校保卫处，负责校园安全和门禁管理。'
    },
    {
      id: '39',
      name: '后勤管理处',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.657792,
      latitude: 45.820309,
      tags: ['后勤', '维修', '服务'],
      openTime: '08:00 - 17:00',
      phone: '0451-88033339',
      description: '学校后勤管理处，负责校园设施维护和后勤保障。全校73栋建筑已完成安全体检。'
    },
    // 文化场馆（校园北部）- 地矿文化博物馆三馆合一
    {
      id: '40',
      name: '地矿文化博物馆',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.653392,
      latitude: 45.822809,
      tags: ['博物馆', '文化', '展览', '三馆合一'],
      openTime: '09:00 - 11:30（暑期限时开放）',
      phone: '0451-88033340',
      description: '总面积约4400平方米，融校史馆、矿业馆、地质馆"三馆"于一体。校史馆约1100平方米，展示600余幅照片和近百件展品；矿业馆包含矿井调度中心、智能开采实验室、智能开采工作面、综采工作面等设施，是国内设置最全的地下模拟矿井；地质馆为中国地质学会科普研学基地、黑龙江省科普示范基地，主要展示岩层地质情况及矿石标本。'
    },
    // 高端服务平台（校园西部）
    {
      id: '41',
      name: '现代制造工程中心',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.650635,
      latitude: 45.816926,
      tags: ['制造', '工程', '实训'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033341',
      description: '具有国内一流水平的现代制造工程中心。'
    },
    {
      id: '42',
      name: '现代分析测试研究中心',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.649635,
      latitude: 45.816426,
      tags: ['分析', '测试', '科研'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033342',
      description: '具有国内一流水平的现代分析测试研究中心。'
    },
    {
      id: '43',
      name: '中奥职业技术培训中心',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.648635,
      latitude: 45.817926,
      tags: ['培训', '职业技术', '国际合作'],
      openTime: '08:00 - 17:00',
      phone: '0451-88033343',
      description: '中奥职业技术培训中心，开展国际合作办学和职业技能培训。'
    },
    {
      id: '44',
      name: '工程训练中心',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.650635,
      latitude: 45.815926,
      tags: ['实训', '工程', '实践'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033344',
      description: '工程训练中心，提供金工实习、电子实习等实践教学。'
    },
    // 各学院楼（校园中部和东部）
    {
      id: '45',
      name: '计算机科学与技术学院楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.652398,
      latitude: 45.818308,
      tags: ['教学', '计算机', '实验'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033345',
      description: '计算机科学与技术学院专用教学楼。'
    },
    {
      id: '46',
      name: '经济管理学院楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.650525,
      latitude: 45.815925,
      tags: ['教学', '经管', '办公'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033346',
      description: '经济管理学院专用教学楼。'
    },
    {
      id: '47',
      name: '电气与控制工程学院楼（碳谷大厦B座）',
      address: '哈尔滨市松北区碳谷大厦B座',
      category: 'teaching',
      longitude: 126.650166,
      latitude: 45.822845,
      tags: ['教学', '电气', '控制'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033347',
      description: '电气与控制工程学院专用教学楼，位于碳谷大厦B座。'
    },
    {
      id: '48',
      name: '测绘工程学院楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.652444,
      latitude: 45.818157,
      tags: ['教学', '测绘', '实验'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033348',
      description: '测绘工程学院专用教学楼。'
    },
    {
      id: '49',
      name: '材料科学与工程学院楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.652139,
      latitude: 45.816055,
      tags: ['教学', '材料', '实验'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033349',
      description: '材料科学与工程学院专用教学楼。'
    },
    {
      id: '50',
      name: '人文社会科学学院楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.652557,
      latitude: 45.819567,
      tags: ['教学', '人文', '社科'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033350',
      description: '人文社会科学学院专用教学楼。'
    },
    {
      id: '51',
      name: '理学院楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.652398,
      latitude: 45.818308,
      tags: ['教学', '数学', '物理'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033351',
      description: '理学院专用教学楼。'
    },
    {
      id: '52',
      name: '外国语学院楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.652557,
      latitude: 45.819567,
      tags: ['教学', '外语', '语言'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033352',
      description: '外国语学院专用教学楼。'
    },
    {
      id: '79',
      name: '马克思主义学院',
      address: '哈尔滨市松北区浦源路2468号黑龙江科技大学',
      category: 'teaching',
      longitude: 126.652503,
      latitude: 45.819513,
      tags: ['教学', '思政', '马列'],
      openTime: '08:00 - 17:00',
      phone: '0451-88033379',
      description: '马克思主义学院，负责思想政治理论课教学和马克思主义理论研究。'
    },
    {
      id: '53',
      name: '艺术学院楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.653557,
      latitude: 45.820567,
      tags: ['教学', '艺术', '设计'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033353',
      description: '艺术学院专用教学楼。'
    },
    {
      id: '54',
      name: '体育部',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'sports',
      longitude: 126.652866,
      latitude: 45.817261,
      tags: ['体育', '教学', '训练'],
      openTime: '08:00 - 21:00',
      phone: '0451-88033354',
      description: '体育部办公楼和训练场馆。'
    },
    // 红色文化地标（校园中心区域）
    {
      id: '55',
      name: '陈郁塑像',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'other',
      longitude: 126.653111,
      latitude: 45.819251,
      tags: ['雕塑', '红色文化', '地标'],
      openTime: '全天',
      phone: '0451-88033355',
      description: '陈郁塑像，新中国能源工业和煤炭教育事业的开拓者和奠基人，是爱国主义和校史校情教育的重要基地。'
    },
    {
      id: '56',
      name: '太阳石雕塑',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'other',
      longitude: 126.653611,
      latitude: 45.818751,
      tags: ['雕塑', '文化', '地标'],
      openTime: '全天',
      phone: '0451-88033356',
      description: '太阳石雕塑，代表学校的办学特色和精神文化，是科大精神谱系的重要组成部分。'
    },
    {
      id: '57',
      name: '劲牛雕塑',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'other',
      longitude: 126.652611,
      latitude: 45.818751,
      tags: ['雕塑', '文化', '地标'],
      openTime: '全天',
      phone: '0451-88033357',
      description: '劲牛雕塑，代表学校艰苦创业的办学历程和奋勇争先的精神，是科大精神谱系的重要组成部分。'
    },
    // 校门
    {
      id: '58',
      name: '东北门（正门）',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'other',
      longitude: 126.651958,
      latitude: 45.82417,
      tags: ['校门', '出入口'],
      openTime: '全天',
      phone: '0451-88033358',
      description: '学校东北门，面向浦源路，是学校正门。'
    },
    {
      id: '59',
      name: '东门',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'other',
      longitude: 126.658792,
      latitude: 45.820809,
      tags: ['校门', '出入口'],
      openTime: '全天',
      phone: '0451-88033359',
      description: '学校东门，方便学生出行。'
    },
    {
      id: '60',
      name: '西门',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'other',
      longitude: 126.650525,
      latitude: 45.815925,
      tags: ['校门', '出入口'],
      openTime: '全天',
      phone: '0451-88033360',
      description: '学校西门，靠近宿舍区。'
    },
    // 新增学生公寓（8、11-20号楼）
    {
      id: '61',
      name: '学生公寓8号楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.659818,
      latitude: 45.817189,
      tags: ['住宿', '生活'],
      openTime: '全天',
      phone: '0451-88033361',
      description: '学生公寓楼，可容纳800名学生。'
    },
    {
      id: '62',
      name: '学生公寓11号楼（第十一学生公寓）',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.656168,
      latitude: 45.814702,
      tags: ['住宿', '生活'],
      openTime: '全天',
      phone: '0451-88033362',
      description: '学生公寓楼，可容纳1000名学生。'
    },
    {
      id: '63',
      name: '学生公寓12号楼（第十二学生公寓）',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.657047,
      latitude: 45.809186,
      tags: ['住宿', '生活'],
      openTime: '全天',
      phone: '0451-88033363',
      description: '学生公寓楼，可容纳1000名学生。'
    },
    {
      id: '64',
      name: '学生公寓14号楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.658047,
      latitude: 45.808686,
      tags: ['住宿', '生活'],
      openTime: '全天',
      phone: '0451-88033364',
      description: '学生公寓楼，可容纳800名学生。'
    },
    {
      id: '65',
      name: '学生公寓15号楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.657829,
      latitude: 45.818347,
      tags: ['住宿', '生活'],
      openTime: '全天',
      phone: '0451-88033365',
      description: '学生公寓楼，可容纳800名学生。'
    },
    {
      id: '66',
      name: '学生公寓16号楼（第十六学生公寓）',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.660047,
      latitude: 45.808686,
      tags: ['住宿', '生活'],
      openTime: '全天',
      phone: '0451-88033366',
      description: '学生公寓楼，可容纳1000名学生。'
    },
    {
      id: '67',
      name: '学生公寓17号楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.661047,
      latitude: 45.809186,
      tags: ['住宿', '生活'],
      openTime: '全天',
      phone: '0451-88033367',
      description: '学生公寓楼，可容纳800名学生。'
    },
    {
      id: '68',
      name: '学生公寓18号楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.662047,
      latitude: 45.808686,
      tags: ['住宿', '生活'],
      openTime: '全天',
      phone: '0451-88033368',
      description: '学生公寓楼，可容纳800名学生。'
    },
    {
      id: '69',
      name: '学生公寓20号楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.656423,
      latitude: 45.822337,
      tags: ['住宿', '生活'],
      openTime: '全天',
      phone: '0451-88033369',
      description: '学生公寓楼，可容纳1000名学生。'
    },
    // 新增教学楼/实验楼
    {
      id: '70',
      name: '教学实验综合楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.653792,
      latitude: 45.821309,
      tags: ['教学', '实验', '综合'],
      openTime: '06:00 - 22:00',
      phone: '0451-88033370',
      description: '教学实验综合楼，集教学和实验功能于一体。'
    },
    {
      id: '71',
      name: '求是楼',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.654792,
      latitude: 45.821809,
      tags: ['教学', '办公'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033371',
      description: '求是楼，教学楼。'
    },
    // 新增研究所/中心
    {
      id: '72',
      name: '光波技术研究所',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.650792,
      latitude: 45.821309,
      tags: ['科研', '光波', '技术'],
      openTime: '08:00 - 17:00',
      phone: '0451-88033372',
      description: '光波技术研究所，从事光波技术相关研究。'
    },
    {
      id: '73',
      name: '工程力学与材料研究所',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'teaching',
      longitude: 126.649792,
      latitude: 45.820809,
      tags: ['科研', '力学', '材料'],
      openTime: '08:00 - 17:00',
      phone: '0451-88033373',
      description: '工程力学与材料研究所，从事工程力学与材料相关研究。'
    },
    {
      id: '74',
      name: '现代教育技术中心',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'service',
      longitude: 126.651792,
      latitude: 45.821309,
      tags: ['教育', '技术', '多媒体'],
      openTime: '08:00 - 17:00',
      phone: '0451-88033374',
      description: '现代教育技术中心，负责多媒体教学设备管理和技术支持。'
    },
    {
      id: '80',
      name: '电气工程实验与实践中心',
      address: '哈尔滨市松北区浦源路2468号黑龙江科技大学',
      category: 'teaching',
      longitude: 126.651349,
      latitude: 45.815741,
      tags: ['实验', '电气', '实践'],
      openTime: '08:00 - 22:00',
      phone: '0451-88033380',
      description: '电气工程实验与实践中心，为电气工程专业提供实验和实践教学服务。'
    },
    // 新增食堂
    {
      id: '75',
      name: '第四食堂',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dining',
      longitude: 126.656792,
      latitude: 45.818809,
      tags: ['餐饮', '快餐', '小吃'],
      openTime: '06:30 - 21:00',
      phone: '0451-88033375',
      description: '学校第四食堂，提供各类快餐和小吃。'
    },
    // 新增校门
    {
      id: '76',
      name: '北5门',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'other',
      longitude: 126.654792,
      latitude: 45.823809,
      tags: ['校门', '出入口'],
      openTime: '全天',
      phone: '0451-88033376',
      description: '学校北5门，位于校园北部。'
    },
    // 新增教师公寓
    {
      id: '77',
      name: '教师公寓',
      address: '哈尔滨市松北区浦源路2468号',
      category: 'dormitory',
      longitude: 126.660047,
      latitude: 45.818189,
      tags: ['住宿', '教师', '生活'],
      openTime: '全天',
      phone: '0451-88033377',
      description: '教师公寓，为教职工提供住宿服务。'
    }
  ],
  routes: []
}

// 校园地图API
Mock.mock('/api/campus/map', 'get', campusMapData)

// 课表相关API - 新接口
Mock.mock('/api/campus/schedule', 'get', {
  code: 200,
  message: 'success',
  'data|5-10': [{
    id: '@id',
    courseName: '@ctitle(3, 8)',
    teacher: '@cname',
    classroom: '@pick(["教学楼A", "教学楼B", "实验楼", "图书馆"])@integer(101, 405)',
    'dayOfWeek|0-6': 1,
    'startSection|1-8': 1,
    'endSection|1-8': 2,
    startTime: '@pick(["08:00", "08:55", "10:05", "11:00", "13:30", "14:25", "15:35", "16:30", "18:30", "19:25"])',
    endTime: '@pick(["08:45", "09:40", "10:50", "11:45", "14:15", "15:10", "16:20", "17:15", "19:15", "20:10"])',
    color: '@pick(["#667eea", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"])',
    weeks: '@pick(["1-16周", "1-8周", "9-16周", "3-10周", "5-12周"])'
  }]
})

// 添加课程
Mock.mock('/api/campus/schedule', 'post', {
  code: 200,
  message: 'success',
  data: {
    id: '@id',
    courseName: '@ctitle(3, 8)',
    teacher: '@cname',
    classroom: '@pick(["教学楼A", "教学楼B", "实验楼"])@integer(101, 405)',
    'dayOfWeek|0-6': 1,
    'startSection|1-8': 1,
    'endSection|1-8': 2,
    startTime: '08:00',
    endTime: '09:40',
    color: '#667eea'
  }
})

// 更新课程
Mock.mock(/\/api\/campus\/schedule\/\w+/, 'post', {
  code: 200,
  message: 'success',
  data: {
    id: '@id',
    courseName: '@ctitle(3, 8)',
    teacher: '@cname',
    classroom: '@pick(["教学楼A", "教学楼B", "实验楼"])@integer(101, 405)',
    'dayOfWeek|0-6': 1,
    'startSection|1-8': 1,
    'endSection|1-8': 2,
    startTime: '08:00',
    endTime: '09:40',
    color: '#667eea'
  }
})

// 删除课程
Mock.mock(/\/api\/campus\/schedule\/\w+\/delete/, 'post', {
  code: 200,
  message: 'success'
})

// 导入课表
Mock.mock('/api/campus/schedule/import', 'post', {
  code: 200,
  message: 'success',
  data: {
    success: true,
    imported: '@integer(3, 8)',
    failed: 0
  }
})

// 分享课表
Mock.mock('/api/campus/schedule/share', 'post', {
  code: 200,
  message: 'success',
  data: {
    shareId: '@id',
    shareUrl: 'https://heikeji.com/share/schedule/@id',
    expiresAt: '@datetime'
  }
})

// 获取提醒设置
Mock.mock('/api/campus/schedule/reminder', 'get', {
  code: 200,
  message: 'success',
  data: {
    enabled: '@boolean',
    reminderMinutes: '@pick([5, 10, 15, 30])',
    reminderMethod: '@pick(["notification", "email", "both"])'
  }
})

// 更新提醒设置
Mock.mock('/api/campus/schedule/reminder', 'post', {
  code: 200,
  message: 'success',
  data: {
    enabled: '@boolean',
    reminderMinutes: '@pick([5, 10, 15, 30])',
    reminderMethod: '@pick(["notification", "email", "both"])'
  }
})

// 图书馆图书搜索
Mock.mock('/api/campus/library/search', 'get', {
  code: 200,
  message: 'success',
  data: {
    'results|10-20': [{
      id: '@id',
      isbn: '@string("number", 13)',
      title: '@ctitle(5, 15)',
      author: '@cname',
      publisher: '@pick(["清华大学出版社", "人民邮电出版社", "机械工业出版社", "电子工业出版社"])',
      category: '@pick(["计算机", "数学", "文学", "科学", "经济", "艺术"])',
      location: '@pick(["A区", "B区", "C区"])-@integer(1, 5)-@integer(1, 100)',
      'copies|1-10': 1,
      available: '@boolean',
      cover: '@image("140x200", "#10b981", "#FFF", "Book")',
      intro: '@cparagraph(3, 5)',
      publishDate: '@date'
    }],
    'total|20-100': 1
  }
})

// 图书借阅
Mock.mock('/api/campus/library/borrow', 'post', {
  code: 200,
  message: 'success',
  data: {
    success: true,
    borrowId: '@id',
    dueDate: '@date'
  }
})

// 图书归还
Mock.mock('/api/campus/library/return', 'post', {
  code: 200,
  message: 'success',
  data: {
    success: true,
    'overdueDays|0-10': 0,
    'fine|0-50': 0
  }
})

// 图书续借
Mock.mock('/api/campus/library/renew', 'post', {
  code: 200,
  message: 'success',
  data: {
    success: true,
    newDueDate: '@date'
  }
})

// 获取我的借阅
Mock.mock('/api/campus/library/my-borrows', 'get', {
  code: 200,
  message: 'success',
  'data|3-8': [{
    id: '@id',
    bookId: '@id',
    bookTitle: '@ctitle(5, 15)',
    bookCover: '@image("100x140", "#10b981", "#FFF", "Book")',
    borrowDate: '@date',
    dueDate: '@date',
    returnDate: '@date',
    'status|1': ['borrowed', 'returned', 'overdue'],
    'renewCount|0-2': 0
  }]
})

// 添加收藏
Mock.mock('/api/campus/library/favorites', 'post', {
  code: 200,
  message: 'success',
  data: { success: true }
})

// 取消收藏
Mock.mock('/api/campus/library/favorites/remove', 'post', {
  code: 200,
  message: 'success',
  data: { success: true }
})

// 获取我的收藏
Mock.mock('/api/campus/library/favorites', 'get', {
  code: 200,
  message: 'success',
  'data|5-10': [{
    id: '@id',
    isbn: '@string("number", 13)',
    title: '@ctitle(5, 15)',
    author: '@cname',
    publisher: '@pick(["清华大学出版社", "人民邮电出版社", "机械工业出版社"])',
    category: '@pick(["计算机", "数学", "文学", "科学", "经济", "艺术"])',
    location: '@pick(["A区", "B区", "C区"])-@integer(1, 5)-@integer(1, 100)',
    'copies|1-10': 1,
    available: '@boolean',
    cover: '@image("140x200", "#10b981", "#FFF", "Book")',
    intro: '@cparagraph(3, 5)'
  }]
})

// 获取座位信息
Mock.mock('/api/campus/library/seats', 'get', {
  code: 200,
  message: 'success',
  'data|30-50': [{
    id: '@id',
    'num|1-200': 1,
    'floor|1-5': 1,
    'zone|1': ['A', 'B', 'C'],
    'row|1-10': 1,
    'status|1': ['available', 'available', 'available', 'available', 'occupied', 'reserved', 'maintenance']
  }]
})

// 预约座位
Mock.mock('/api/campus/library/seats/book', 'post', {
  code: 200,
  message: 'success',
  data: {
    success: true,
    bookingId: '@id'
  }
})

// 取消座位预约
Mock.mock('/api/campus/library/seats/cancel', 'post', {
  code: 200,
  message: 'success',
  data: { success: true }
})

// 座位签到
Mock.mock('/api/campus/library/seats/checkin', 'post', {
  code: 200,
  message: 'success',
  data: { success: true }
})

// 座位签退
Mock.mock('/api/campus/library/seats/checkout', 'post', {
  code: 200,
  message: 'success',
  data: { success: true }
})

// 获取我的座位预约
Mock.mock('/api/campus/library/my-bookings', 'get', {
  code: 200,
  message: 'success',
  'data|3-6': [{
    id: '@id',
    seatId: '@id',
    'seatNum|1-200': 1,
    'floor|1-5': 1,
    date: '@date',
    startTime: '@time',
    endTime: '@time',
    'status|1': ['active', 'completed', 'cancelled'],
    checkInTime: '@time',
    checkOutTime: '@time'
  }]
})

// 导出数据生成函数
export {
  generateAnnouncements,
  generateCampusActivities,
  generateLeaveApplications,
  generateScholarships,
  campusMapData
}

// 创建 mockAPI 对象供 request.ts 使用
export const mockAPI = {
  user: {
    info: () => Promise.resolve({ code: 200, data: { id: '1', username: 'test', role: 'student' } }),
    login: (data: any) => Promise.resolve({ code: 200, data: { token: 'mock-token', user: { id: '1', username: data?.username || 'test' } } }),
    register: (data: any) => Promise.resolve({ code: 200, data: { id: '1', username: data?.username || 'test' } }),
    logout: () => Promise.resolve({ code: 200, message: 'success' })
  },
  secondhand: {
    list: (params?: any) => Promise.resolve({ code: 200, data: { list: [], total: 0 } }),
    detail: (id: string) => Promise.resolve({ code: 200, data: { id, name: 'Item' } }),
    categories: () => Promise.resolve({ code: 200, data: [] }),
    myItems: () => Promise.resolve({ code: 200, data: [] }),
    publish: (data: any) => Promise.resolve({ code: 200, data: { id: '1', ...data } })
  },
  community: {
    boards: () => Promise.resolve({ code: 200, data: [] }),
    posts: (params?: any) => Promise.resolve({ code: 200, data: { list: [], total: 0 } }),
    postDetail: (id: string) => Promise.resolve({ code: 200, data: { id, title: 'Post' } }),
    createPost: (data: any) => Promise.resolve({ code: 200, data: { id: '1', ...data } }),
    likePost: (id: string) => Promise.resolve({ code: 200, message: 'success' }),
    unlikePost: (id: string) => Promise.resolve({ code: 200, message: 'success' }),
    addComment: (postId: string, content: string, parentId?: string) => Promise.resolve({ code: 200, data: { id: '1', postId, content } }),
    lostFoundList: (params?: any) => Promise.resolve({ code: 200, data: { list: [], total: 0 } }),
    publishLostFound: (data: any) => Promise.resolve({ code: 200, data: { id: '1', ...data } }),
    activities: (params?: any) => Promise.resolve({ code: 200, data: { list: [], total: 0 } }),
    activityDetail: (id: string) => Promise.resolve({ code: 200, data: { id, title: 'Activity' } }),
    joinActivity: (id: string) => Promise.resolve({ code: 200, message: 'success' }),
    createActivity: (data: any) => Promise.resolve({ code: 200, data: { id: '1', ...data } })
  },
  studentAffairs: {
    pendingTasks: () => Promise.resolve({ code: 200, data: [] }),
    leaveApplications: () => Promise.resolve({ code: 200, data: [] }),
    submitLeave: (data: any) => Promise.resolve({ code: 200, data: { id: '1', ...data } }),
    cancelLeave: (id: string) => Promise.resolve({ code: 200, message: 'success' }),
    aidApplications: () => Promise.resolve({ code: 200, data: [] }),
    submitAid: (data: any) => Promise.resolve({ code: 200, data: { id: '1', ...data } }),
    militaryOrders: () => Promise.resolve({ code: 200, data: [] }),
    submitMilitaryOrder: (data: any) => Promise.resolve({ code: 200, data: { id: '1', ...data } }),
    campusCard: () => Promise.resolve({ code: 200, data: { balance: 100 } }),
    rechargeRecords: () => Promise.resolve({ code: 200, data: [] }),
    rechargeCard: (amount: number, method: string) => Promise.resolve({ code: 200, message: 'success' }),
    reportLost: () => Promise.resolve({ code: 200, message: 'success' }),
    aidPolicies: () => Promise.resolve({ code: 200, data: [] })
  },
  products: {
    hot: () => Promise.resolve({ code: 200, data: [] }),
    list: (params?: any) => Promise.resolve({ code: 200, data: { list: [], total: 0 } }),
    detail: (id: string) => Promise.resolve({ code: 200, data: { id, name: 'Product' } }),
    categories: () => Promise.resolve({ code: 200, data: [] }),
    search: (keyword: string, params?: any) => Promise.resolve({ code: 200, data: { list: [], total: 0 } })
  },
  takeout: {
    merchants: (params?: any) => Promise.resolve({ code: 200, data: { list: [], total: 0 } }),
    searchMerchants: (keyword: string) => Promise.resolve({ code: 200, data: [] }),
    merchantDetail: (id: string) => Promise.resolve({ code: 200, data: { id, name: 'Merchant' } }),
    merchantProducts: (merchantId: string) => Promise.resolve({ code: 200, data: [] }),
    recommendedProducts: (merchantId: string) => Promise.resolve({ code: 200, data: [] }),
    productDetail: (productId: string) => Promise.resolve({ code: 200, data: { id: productId, name: 'Product' } })
  },
  campus: {
    schedule: (params?: any) => Promise.resolve({ code: 200, data: [] }),
    grades: (params?: any) => Promise.resolve({ code: 200, data: [] }),
    gpa: () => Promise.resolve({ code: 200, data: { gpa: 3.5 } }),
    // 图书馆 - 借阅记录
    libraryBorrows: () => Promise.resolve({
      code: 200,
      data: [
        {
          id: '1',
          bookId: 'b1',
          bookTitle: 'JavaScript高级程序设计',
          bookCover: 'https://via.placeholder.com/100x140/10b981/ffffff?text=JS',
          borrowDate: '2026-04-01',
          dueDate: '2026-05-01',
          status: 'borrowed',
          renewCount: 0
        },
        {
          id: '2',
          bookId: 'b2',
          bookTitle: 'Vue.js实战',
          bookCover: 'https://via.placeholder.com/100x140/667eea/ffffff?text=Vue',
          borrowDate: '2026-03-15',
          dueDate: '2026-04-15',
          returnDate: '2026-04-10',
          status: 'returned',
          renewCount: 1
        }
      ]
    }),
    // 图书馆 - 座位信息
    librarySeats: (floor?: number) => Promise.resolve({
      code: 200,
      data: Array.from({ length: 50 }, (_, i) => ({
        id: `seat-${floor || 3}-${i + 1}`,
        num: i + 1,
        floor: floor || 3,
        zone: ['A', 'B', 'C'][Math.floor(i / 20)],
        row: Math.floor(i / 10) + 1,
        status: ['available', 'available', 'available', 'occupied', 'reserved', 'maintenance'][Math.floor(Math.random() * 6)]
      }))
    }),
    // 图书馆 - 座位预约
    reserveSeat: (data: any) => Promise.resolve({ code: 200, message: 'success', data: { bookingId: 'bk' + Date.now() } }),
    // 图书馆 - 我的座位预约
    mySeatBookings: () => Promise.resolve({
      code: 200,
      data: [
        {
          id: 'bk1',
          seatId: 'seat-3-42',
          seatNum: 42,
          floor: 3,
          date: '2026-04-25',
          startTime: '09:00',
          endTime: '11:00',
          status: 'active'
        },
        {
          id: 'bk2',
          seatId: 'seat-2-18',
          seatNum: 18,
          floor: 2,
          date: '2026-04-24',
          startTime: '14:00',
          endTime: '16:00',
          status: 'completed'
        }
      ]
    }),
    // 图书馆 - 取消预约
    cancelSeatBooking: (bookingId: string) => Promise.resolve({ code: 200, message: 'success' }),
    // 图书馆 - 签到
    checkInSeat: (bookingId: string) => Promise.resolve({ code: 200, message: 'success' }),
    // 图书馆 - 签退
    checkOutSeat: (bookingId: string) => Promise.resolve({ code: 200, message: 'success' }),
    // 图书馆 - 借阅图书
    borrowBook: (data: any) => Promise.resolve({ code: 200, message: 'success', data: { borrowId: 'br' + Date.now(), dueDate: '2026-05-25' } }),
    // 图书馆 - 归还图书
    returnBook: (borrowId: string) => Promise.resolve({ code: 200, message: 'success' }),
    // 图书馆 - 续借图书
    renewBook: (borrowId: string) => Promise.resolve({ code: 200, message: 'success', data: { newDueDate: '2026-06-25' } }),
    // 图书馆 - 添加收藏
    addToFavorites: (bookId: string) => Promise.resolve({ code: 200, message: 'success' }),
    // 图书馆 - 获取收藏
    myFavorites: () => Promise.resolve({ code: 200, data: [] }),
    pendingPayments: () => Promise.resolve({ code: 200, data: [] }),
    paymentHistory: () => Promise.resolve({ code: 200, data: [] }),
    scholarships: () => Promise.resolve({ code: 200, data: [] }),
    aidPolicies: () => Promise.resolve({ code: 200, data: [] }),
    activities: () => Promise.resolve({ code: 200, data: [] }),
    counseling: () => Promise.resolve({ code: 200, data: [] }),
    careers: () => Promise.resolve({ code: 200, data: [] }),
    classrooms: (params?: { building?: string; floor?: number; type?: string; date?: string }) => {
      // 生成教室数据 - 黑龙江科技大学实际教学楼
      const buildings = ['主楼', '第一教学楼', '第二教学楼', '矿业工程实验楼', '机电工程实验楼']
      const types = ['lecture', 'lab', 'multimedia', 'seminar']
      const allClassrooms = []
      let id = 1

      // 教学楼编号前缀映射
      const buildingPrefix: Record<string, string> = {
        '主楼': 'Z',
        '第一教学楼': 'A',
        '第二教学楼': 'B',
        '矿业工程实验楼': 'K',
        '机电工程实验楼': 'J'
      }

      for (let b = 0; b < buildings.length; b++) {
        const building = buildings[b]
        const prefix = buildingPrefix[building] || String.fromCharCode(65 + b)
        // 不同楼层教室数量不同
        const floors = building === '主楼' ? 6 : 5
        const roomsPerFloor = building.includes('实验楼') ? 8 : 10

        for (let f = 1; f <= floors; f++) {
          for (let r = 1; r <= roomsPerFloor; r++) {
            const roomNum = `${prefix}${f}${String(r).padStart(2, '0')}`
            // 实验室容量较小，教学楼容量较大
            const capacity = building.includes('实验楼')
              ? [20, 25, 30, 35, 40][Math.floor(Math.random() * 5)]
              : [40, 45, 50, 60, 80, 120][Math.floor(Math.random() * 6)]
            const type = building.includes('实验楼') ? 'lab' : types[Math.floor(Math.random() * types.length)]
            const facilities = building.includes('实验楼')
              ? ['电脑', '投影仪', '空调', '实验设备'].filter(() => Math.random() > 0.2)
              : ['投影仪', '空调', '电脑'].filter(() => Math.random() > 0.3)

            allClassrooms.push({
              id: String(id++),
              roomNumber: roomNum,
              building: building,
              floor: f,
              type,
              capacity,
              facilities,
              isAvailable: Math.random() > 0.3,
              location: `${f}楼${['东侧', '西侧', '中部', '北侧', '南侧'][Math.floor(Math.random() * 5)]}`
            })
          }
        }
      }

      // 根据参数筛选
      let result = allClassrooms
      if (params?.building) {
        result = result.filter(c => c.building === params.building)
      }
      if (params?.floor !== undefined) {
        result = result.filter(c => c.floor === params.floor)
      }
      if (params?.type) {
        result = result.filter(c => c.type === params.type)
      }

      return Promise.resolve({ code: 200, data: result })
    },
    classroomTimeSlots: (roomId: string, date: string) => {
      const slots = [
        { period: 1, time: '08:00-08:45', available: Math.random() > 0.3 },
        { period: 2, time: '08:55-09:40', available: Math.random() > 0.3 },
        { period: 3, time: '10:05-10:50', available: Math.random() > 0.3 },
        { period: 4, time: '11:00-11:45', available: Math.random() > 0.3 },
        { period: 5, time: '13:30-14:15', available: Math.random() > 0.3 },
        { period: 6, time: '14:25-15:10', available: Math.random() > 0.3 },
        { period: 7, time: '15:35-16:20', available: Math.random() > 0.3 },
        { period: 8, time: '16:30-17:15', available: Math.random() > 0.3 },
        { period: 9, time: '18:30-19:15', available: Math.random() > 0.3 },
        { period: 10, time: '19:25-20:10', available: Math.random() > 0.3 }
      ]
      return Promise.resolve({ code: 200, data: slots })
    },
    bookClassroom: (roomId: string, data: { date: string; periods: number[]; reason?: string }) => {
      return Promise.resolve({
        code: 200,
        message: '预约成功',
        data: {
          success: true,
          bookingId: 'cb' + Date.now(),
          message: '教室预约成功'
        }
      })
    },
    myClassroomBookings: () => {
      return Promise.resolve({
        code: 200,
        data: [
          {
            id: 'cb1',
            roomId: '5',
            roomNumber: 'A202',
            building: '主楼',
            floor: 2,
            date: '2026-04-26',
            periods: [5, 6],
            time: '13:30-15:10',
            reason: '社团活动',
            status: 'active',
            bookedAt: '2026-04-25 10:30:00'
          },
          {
            id: 'cb2',
            roomId: '12',
            roomNumber: 'B301',
            building: '信息楼',
            floor: 3,
            date: '2026-04-24',
            periods: [1, 2],
            time: '08:00-09:40',
            reason: '小组讨论',
            status: 'completed',
            bookedAt: '2026-04-23 14:20:00'
          }
        ]
      })
    },
    cancelClassroomBooking: (bookingId: string) => {
      return Promise.resolve({ code: 200, message: '取消成功', data: { success: true } })
    },
    exams: () => Promise.resolve({ code: 200, data: [] }),
    busSchedule: () => Promise.resolve({ code: 200, data: [] }),
    cardBalance: () => Promise.resolve({ code: 200, data: { balance: 100 } }),
    cardTransactions: () => Promise.resolve({ code: 200, data: [] }),
    mapData: () => Promise.resolve({ code: 200, data: campusMapData })
  }
}

// 默认导出Mock配置
export default Mock
