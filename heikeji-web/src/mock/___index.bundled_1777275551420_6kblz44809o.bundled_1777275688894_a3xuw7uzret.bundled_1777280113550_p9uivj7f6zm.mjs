// src/mock/__index.bundled_1777275551420_6kblz44809o.bundled_1777275688894_a3xuw7uzret.mjs
import Mock from "mockjs";
if (Mock.XHR.prototype.__send === void 0) {
  Mock.XHR.prototype.__send = Mock.XHR.prototype.send;
  Mock.XHR.prototype.send = function() {
    const url = this.url;
    if (url && (url.includes("amap.com") || url.includes("jsapi.amap.com") || url.includes("webapi.amap.com") || url.includes("restapi.amap.com") || url.includes("custyle.amap.com") || url.includes("mapplugin.amap.com") || url.includes("o4.amap.com") || url.includes("is.autonavi.com") || url.includes("webrd0") || url.includes("webst0") || url.includes("vector.amap.com"))) {
      return this.__send.apply(this, arguments);
    }
    return this.__send.apply(this, arguments);
  };
}
Mock.mock("/api/auth/login", "post", {
  code: 200,
  message: "success",
  data: {
    token: "@guid",
    user: {
      id: "@id",
      username: "@cname",
      avatar: '@image("100x100", "#4A90E2", "#FFF", "Avatar")',
      role: "student",
      studentId: '2021@string("number", 8)',
      class: "\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u6280\u672F2021\u7EA71\u73ED",
      college: "\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u6280\u672F\u5B66\u9662"
    }
  }
});
Mock.mock("/api/auth/register", "post", {
  code: 200,
  message: "success",
  data: {
    token: "@guid",
    user: {
      id: "@id",
      username: "@cname",
      role: "student"
    }
  }
});
Mock.mock(/\/api\/user\/info|user\/info/, "get", {
  code: 200,
  message: "success",
  data: {
    id: "@id",
    username: "@cname",
    avatar: '@image("100x100", "#4A90E2", "#FFF", "Avatar")',
    role: "student",
    studentId: '2021@string("number", 8)',
    class: "\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u6280\u672F2021\u7EA71\u73ED",
    college: "\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u6280\u672F\u5B66\u9662",
    phone: '@string("number", 11)',
    email: "@email"
  }
});
Mock.mock(/\/api\/products\/hot|products\/hot/, "get", {
  code: 200,
  message: "success",
  "data|8": [{
    id: "@id",
    name: "@ctitle(5, 15)",
    description: "@cparagraph(2, 4)",
    price: "@float(10, 500, 2, 2)",
    originalPrice: "@float(20, 800, 2, 2)",
    cover: '@image("300x300", "#667eea", "#FFF", "Product")',
    "images|3-5": ['@image("300x300", "#667eea", "#FFF", "Product")'],
    category: '@pick(["\u6570\u7801\u4EA7\u54C1", "\u56FE\u4E66\u6559\u6750", "\u8FD0\u52A8\u6237\u5916", "\u751F\u6D3B\u7528\u54C1", "\u670D\u9970\u978B\u5305", "\u98DF\u54C1\u96F6\u98DF"])',
    "stock|10-100": 50,
    "sales|0-1000": 100,
    "rating|1-5": 4.5,
    "reviews|0-100": 20,
    merchant: {
      id: "@id",
      name: "@ctitle(3, 8)\u5E97",
      logo: '@image("100x100", "#10b981", "#FFF", "Shop")'
    },
    tags: ['@pick(["\u70ED\u9500", "\u65B0\u54C1", "\u7279\u4EF7", "\u5305\u90AE"])'],
    createTime: "@datetime"
  }]
});
Mock.mock("/api/schedule", "get", {
  code: 200,
  message: "success",
  "data|5": [{
    "day|+1": 1,
    "courses|3-5": [{
      id: "@id",
      name: "@ctitle(3, 5)",
      teacher: "@cname",
      location: '@pick(["\u6559\u5B66\u697CA", "\u6559\u5B66\u697CB", "\u5B9E\u9A8C\u697C"])@integer(101, 405)',
      "startWeek|1-16": 1,
      "endWeek|1-16": 16,
      "day|1-7": 1,
      "startSection|1-8": 1,
      "endSection|1-8": 2
    }]
  }]
});
Mock.mock("/api/grades", "get", {
  code: 200,
  message: "success",
  "data|8-12": [{
    id: "@id",
    courseName: "@ctitle(3, 6)",
    credit: "@float(1, 4, 1, 1)",
    grade: "@integer(60, 100)",
    gpa: "@float(1, 4, 2, 2)",
    semester: '@pick(["2023-2024-1", "2023-2024-2"])',
    type: '@pick(["\u5FC5\u4FEE", "\u9009\u4FEE"])'
  }]
});
Mock.mock(/\/api\/campus\/gpa|campus\/gpa/, "get", {
  code: 200,
  message: "success",
  data: {
    totalGPA: "@float(2.5, 4.0, 2, 2)",
    totalCredits: "@integer(120, 160)",
    semesterGPA: {
      "2023-2024-1": "@float(2.8, 4.0, 2, 2)",
      "2023-2024-2": "@float(2.8, 4.0, 2, 2)",
      "2022-2023-1": "@float(2.8, 4.0, 2, 2)",
      "2022-2023-2": "@float(2.8, 4.0, 2, 2)"
    }
  }
});
Mock.mock("/api/library/books", "get", {
  code: 200,
  message: "success",
  "data|10-20": [{
    id: "@id",
    title: "@ctitle(5, 15)",
    author: "@cname",
    publisher: "@ctitle(3, 8)\u51FA\u7248\u793E",
    isbn: '@string("number", 13)',
    "available|1": [true, false],
    location: '@pick(["A\u533A", "B\u533A", "C\u533A"])@integer(1, 5)\u67B6',
    publishDate: "@date"
  }]
});
Mock.mock("/api/library/borrowed", "get", {
  code: 200,
  message: "success",
  "data|3-5": [{
    id: "@id",
    bookTitle: "@ctitle(5, 15)",
    author: "@cname",
    borrowDate: "@date",
    returnDate: "@date",
    "renewable|1": [true, false]
  }]
});
Mock.mock("/api/classroom/buildings", "get", {
  code: 200,
  message: "success",
  "data|3": [{
    id: "@id",
    name: '@pick(["\u6559\u5B66\u697CA", "\u6559\u5B66\u697CB", "\u5B9E\u9A8C\u697C"])',
    "classrooms|5-10": [{
      id: "@id",
      roomNumber: "@integer(101, 405)",
      "capacity|30-120": 60,
      "type|1": ["\u591A\u5A92\u4F53\u6559\u5BA4", "\u666E\u901A\u6559\u5BA4", "\u5B9E\u9A8C\u5BA4"],
      "equipment|1-3": ["\u6295\u5F71\u4EEA", "\u97F3\u54CD", "\u7535\u8111"],
      "available|1": [true, false]
    }]
  }]
});
Mock.mock("/api/classroom/appointments", "get", {
  code: 200,
  message: "success",
  "data|5-10": [{
    id: "@id",
    classroomId: "@id",
    buildingName: '@pick(["\u6559\u5B66\u697CA", "\u6559\u5B66\u697CB"])',
    roomNumber: "@integer(101, 405)",
    date: "@date",
    "startTime|1": ["08:00", "10:00", "14:00", "16:00"],
    "endTime|1": ["10:00", "12:00", "16:00", "18:00"],
    purpose: "@ctitle(5, 10)",
    status: '@pick(["pending", "approved", "rejected"])'
  }]
});
var campusMapData = {
  buildings: [
    // 行政办公区（校园中心偏北）
    {
      id: "1",
      name: "\u4E3B\u697C\uFF08\u884C\u653F\u529E\u516C\u697C\uFF09",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.654111,
      latitude: 45.819751,
      tags: ["\u529E\u516C", "\u884C\u653F", "\u4F1A\u8BAE"],
      openTime: "08:00 - 17:00",
      phone: "0451-88033301",
      description: "\u5B66\u6821\u4E3B\u529E\u516C\u697C\uFF0C\u8BBE\u6709\u6821\u957F\u529E\u516C\u5BA4\u3001\u6559\u52A1\u5904\u3001\u5B66\u751F\u5904\u7B49\u884C\u653F\u90E8\u95E8\u3002"
    },
    // 教学区（校园中部）
    {
      id: "2",
      name: "\u7B2C\u4E00\u6559\u5B66\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.652232,
      latitude: 45.819501,
      tags: ["\u4E0A\u8BFE", "\u81EA\u4E60", "\u8003\u8BD5"],
      openTime: "06:00 - 22:00",
      phone: "0451-88033302",
      description: "\u5B66\u6821\u4E3B\u8981\u6559\u5B66\u697C\u4E4B\u4E00\uFF0C\u62E5\u6709\u591A\u5A92\u4F53\u6559\u5BA480\u95F4\u3002"
    },
    {
      id: "3",
      name: "\u7B2C\u4E8C\u6559\u5B66\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.652896,
      latitude: 45.818313,
      tags: ["\u4E0A\u8BFE", "\u81EA\u4E60", "\u8003\u8BD5"],
      openTime: "06:00 - 22:00",
      phone: "0451-88033303",
      description: "\u5B66\u6821\u4E3B\u8981\u6559\u5B66\u697C\u4E4B\u4E00\uFF0C\u914D\u5907\u73B0\u4EE3\u5316\u6559\u5B66\u8BBE\u5907\u3002"
    },
    {
      id: "4",
      name: "\u77FF\u4E1A\u5DE5\u7A0B\u5B9E\u9A8C\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.651109,
      latitude: 45.816803,
      tags: ["\u5B9E\u9A8C", "\u79D1\u7814", "\u77FF\u4E1A"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033304",
      description: "\u77FF\u4E1A\u5DE5\u7A0B\u4E13\u4E1A\u5B9E\u9A8C\u697C\uFF0C\u914D\u5907\u91C7\u77FF\u3001\u5B89\u5168\u7B49\u4E13\u4E1A\u5B9E\u9A8C\u5BA4\u3002"
    },
    {
      id: "5",
      name: "\u673A\u7535\u5DE5\u7A0B\u5B9E\u9A8C\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.651124,
      latitude: 45.817178,
      tags: ["\u5B9E\u9A8C", "\u79D1\u7814", "\u673A\u7535"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033305",
      description: "\u673A\u7535\u5DE5\u7A0B\u4E13\u4E1A\u5B9E\u9A8C\u697C\uFF0C\u914D\u5907\u673A\u68B0\u3001\u7535\u6C14\u7B49\u4E13\u4E1A\u5B9E\u9A8C\u5BA4\u3002"
    },
    // 图书馆（校园中心）
    {
      id: "6",
      name: "\u56FE\u4E66\u9986",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "library",
      longitude: 126.654315,
      latitude: 45.819798,
      tags: ["\u501F\u9605", "\u81EA\u4E60", "\u7535\u5B50\u8D44\u6E90"],
      openTime: "07:00 - 22:30",
      phone: "0451-88033306",
      description: "\u5B66\u6821\u56FE\u4E66\u9986\uFF0C\u603B\u5EFA\u7B51\u9762\u79EF31654\u5E73\u65B9\u7C73\uFF0C\u85CF\u4E66185\u4E07\u518C\uFF0C\u63D0\u4F9B\u81EA\u4E60\u5EA7\u4F4D2000\u4E2A\u3002\u56FE\u4E66\u9986\u6539\u9020\u5DE5\u7A0B\u6B63\u5728\u6709\u5E8F\u63A8\u8FDB\u3002"
    },
    // 食堂区（校园东部）
    {
      id: "7",
      name: "\u7B2C\u4E00\u98DF\u5802\uFF08\u5B66\u751F\u4E00\u9910\u5385/\u6C81\u82B3\u56ED\uFF09",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dining",
      longitude: 126.655437,
      latitude: 45.820711,
      tags: ["\u9910\u996E", "\u65E9\u9910", "\u5348\u9910", "\u665A\u9910"],
      openTime: "06:30 - 21:00",
      phone: "0451-88033307",
      description: "\u5B66\u6821\u7B2C\u4E00\u98DF\u5802\uFF08\u6C81\u82B3\u56ED\uFF09\uFF0C\u63D0\u4F9B\u5404\u7C7B\u4E2D\u5F0F\u5FEB\u9910\u3001\u9762\u98DF\u3001\u5C0F\u5403\u7B49\u3002\u98DF\u5802\u73AF\u5883\u663E\u8457\u63D0\u5347\uFF0C\u83DC\u54C1\u79CD\u7C7B\u4E30\u5BCC\u591A\u6837\u3002"
    },
    {
      id: "8",
      name: "\u7B2C\u4E8C\u98DF\u5802\uFF08\u5B66\u751F\u4E8C\u9910\u5385/\u77E5\u5473\u56ED\uFF09",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dining",
      longitude: 126.653199,
      latitude: 45.816732,
      tags: ["\u9910\u996E", "\u5C0F\u7092", "\u7279\u8272\u83DC"],
      openTime: "06:30 - 21:00",
      phone: "0451-88033308",
      description: "\u5B66\u6821\u7B2C\u4E8C\u98DF\u5802\uFF08\u77E5\u5473\u56ED\uFF09\uFF0C\u4EE5\u73B0\u7092\u5C0F\u7092\u548C\u7279\u8272\u83DC\u54C1\u4E3A\u4E3B\u3002"
    },
    {
      id: "9",
      name: "\u6559\u5DE5\u9910\u5385",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dining",
      longitude: 126.652557,
      latitude: 45.819567,
      tags: ["\u9910\u996E", "\u6559\u5DE5", "\u81EA\u52A9\u9910"],
      openTime: "11:00 - 13:00, 17:00 - 19:00",
      phone: "0451-88033309",
      description: "\u6559\u5DE5\u4E13\u7528\u9910\u5385\uFF0C\u63D0\u4F9B\u81EA\u52A9\u9910\u670D\u52A1\u3002"
    },
    {
      id: "10",
      name: "\u7B2C\u4E09\u98DF\u5802\uFF08\u6C81\u9999\u56ED\uFF09",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u7CD6\u5382\u88575\u53F7",
      category: "dining",
      longitude: 126.651816,
      latitude: 45.817892,
      tags: ["\u9910\u996E", "\u5FEB\u9910", "\u5C0F\u5403"],
      openTime: "06:30 - 21:00",
      phone: "0451-88033310",
      description: "\u5B66\u6821\u7B2C\u4E09\u98DF\u5802\uFF08\u6C81\u9999\u56ED\uFF09\uFF0C\u63D0\u4F9B\u5404\u7C7B\u5FEB\u9910\u548C\u5C0F\u5403\u3002"
    },
    // 宿舍区（校园南部）
    {
      id: "11",
      name: "\u5B66\u751F\u516C\u5BD31\u53F7\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.654818,
      latitude: 45.817689,
      tags: ["\u4F4F\u5BBF", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033311",
      description: "\u7537\u751F\u516C\u5BD3\u697C\uFF0C\u53EF\u5BB9\u7EB31200\u540D\u5B66\u751F\u3002\u4F4F\u5BBF\u8D39\uFF1A\u56DB\u4EBA\u95F41200\u5143/\u5E74\uFF0C\u516D\u4EBA\u95F4800\u5143/\u5E74\u3002"
    },
    {
      id: "12",
      name: "\u5B66\u751F\u516C\u5BD32\u53F7\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.655818,
      latitude: 45.817189,
      tags: ["\u4F4F\u5BBF", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033312",
      description: "\u7537\u751F\u516C\u5BD3\u697C\uFF0C\u53EF\u5BB9\u7EB31200\u540D\u5B66\u751F\u3002"
    },
    {
      id: "13",
      name: "\u5B66\u751F\u516C\u5BD33\u53F7\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.656818,
      latitude: 45.817689,
      tags: ["\u4F4F\u5BBF", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033313",
      description: "\u5973\u751F\u516C\u5BD3\u697C\uFF0C\u53EF\u5BB9\u7EB31000\u540D\u5B66\u751F\u3002"
    },
    {
      id: "14",
      name: "\u5B66\u751F\u516C\u5BD34\u53F7\u697C\uFF08\u7B2C\u56DB\u5B66\u751F\u516C\u5BD3\uFF09",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.654818,
      latitude: 45.817689,
      tags: ["\u4F4F\u5BBF", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033314",
      description: "\u5973\u751F\u516C\u5BD3\u697C\uFF0C\u53EF\u5BB9\u7EB31000\u540D\u5B66\u751F\u3002"
    },
    {
      id: "15",
      name: "\u5B66\u751F\u516C\u5BD35\u53F7\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.657818,
      latitude: 45.817189,
      tags: ["\u4F4F\u5BBF", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033315",
      description: "\u5B66\u751F\u516C\u5BD3\u697C\uFF0C\u53EF\u5BB9\u7EB3800\u540D\u5B66\u751F\u3002"
    },
    {
      id: "16",
      name: "\u5B66\u751F\u516C\u5BD36\u53F7\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.658818,
      latitude: 45.817689,
      tags: ["\u4F4F\u5BBF", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033316",
      description: "\u5B66\u751F\u516C\u5BD3\u697C\uFF0C\u53EF\u5BB9\u7EB3800\u540D\u5B66\u751F\u3002"
    },
    {
      id: "17",
      name: "\u4EBA\u624D\u516C\u5BD3",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.659818,
      latitude: 45.818189,
      tags: ["\u4F4F\u5BBF", "\u4EBA\u624D", "\u6559\u5E08"],
      openTime: "\u5168\u5929",
      phone: "0451-88033317",
      description: '\u9AD8\u6807\u51C6"\u6C5F\u666F\u623F"\u4EBA\u624D\u516C\u5BD3\uFF0C\u4E3A\u5F15\u8FDB\u535A\u58EB\u6559\u5E08\u63D0\u4F9B\u8212\u9002\u3001\u6E29\u99A8\u7684\u5C45\u4F4F\u6761\u4EF6\uFF0C\u52A9\u529B\u5B66\u6821\u5F15\u624D\u5DE5\u4F5C\u3002'
    },
    // 运动场馆（校园西部和北部）
    {
      id: "18",
      name: "\u4F53\u80B2\u9986",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "sports",
      longitude: 126.652866,
      latitude: 45.817261,
      tags: ["\u8FD0\u52A8", "\u7BEE\u7403", "\u7FBD\u6BDB\u7403", "\u4E52\u4E53\u7403"],
      openTime: "08:00 - 21:00",
      phone: "0451-88033318",
      description: "\u5B66\u6821\u4F53\u80B2\u9986\uFF0C\u8BBE\u6709\u7BEE\u7403\u573A\u3001\u7FBD\u6BDB\u7403\u573A\u3001\u4E52\u4E53\u7403\u573A\u7B49\u5BA4\u5185\u8FD0\u52A8\u573A\u5730\u3002\u7BEE\u7403\u9986\u5DF2\u5B8C\u6210\u5347\u7EA7\u6539\u9020\u3002"
    },
    {
      id: "19",
      name: "\u7530\u5F84\u8FD0\u52A8\u573A",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "sports",
      longitude: 126.651866,
      latitude: 45.816261,
      tags: ["\u8FD0\u52A8", "\u8DD1\u6B65", "\u8DB3\u7403"],
      openTime: "06:00 - 22:00",
      phone: "0451-88033319",
      description: "\u6807\u51C6400\u7C73\u5851\u80F6\u7530\u5F84\u573A\uFF0C\u8BBE\u6709\u8DB3\u7403\u573A\u548C\u8DD1\u9053\u3002"
    },
    {
      id: "20",
      name: "\u6E38\u6CF3\u9986",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "sports",
      longitude: 126.653057,
      latitude: 45.819209,
      tags: ["\u8FD0\u52A8", "\u6E38\u6CF3", "\u5065\u8EAB"],
      openTime: "09:00 - 21:00",
      phone: "0451-88033320",
      description: "\u5B66\u6821\u6E38\u6CF3\u9986\uFF0C\u8BBE\u6709\u6807\u51C6\u6CF3\u6C60\u548C\u5065\u8EAB\u623F\u3002"
    },
    {
      id: "21",
      name: "\u6C14\u6392\u7403\u9986",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "sports",
      longitude: 126.650866,
      latitude: 45.817261,
      tags: ["\u8FD0\u52A8", "\u6C14\u6392\u7403", "\u4F53\u80B2"],
      openTime: "08:00 - 21:00",
      phone: "0451-88033321",
      description: "\u4E13\u4E1A\u6C14\u6392\u7403\u9986\uFF0C\u7ECF\u8FC7\u6539\u9020\u5347\u7EA7\uFF0C\u8BBE\u65BD\u5B8C\u5584\uFF0C\u4E3A\u5E08\u751F\u4F53\u80B2\u953B\u70BC\u63D0\u4F9B\u4F18\u8D28\u573A\u5730\u3002"
    },
    {
      id: "22",
      name: "\u7FBD\u6BDB\u7403\u9986",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "sports",
      longitude: 126.650866,
      latitude: 45.815261,
      tags: ["\u8FD0\u52A8", "\u7FBD\u6BDB\u7403", "\u4F53\u80B2"],
      openTime: "08:00 - 21:00",
      phone: "0451-88033322",
      description: "\u7FBD\u6BDB\u7403\u9986\uFF0C\u6B63\u5728\u6709\u5E8F\u63A8\u8FDB\u6539\u9020\u5347\u7EA7\u3002"
    },
    {
      id: "23",
      name: "\u7F51\u7403\u573A",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "sports",
      longitude: 126.651866,
      latitude: 45.818261,
      tags: ["\u8FD0\u52A8", "\u7F51\u7403", "\u4F53\u80B2"],
      openTime: "06:00 - 22:00",
      phone: "0451-88033323",
      description: "\u5B66\u6821\u7F51\u7403\u573A\uFF0C\u4E3A\u5B66\u751F\u63D0\u4F9B\u7F51\u7403\u8FD0\u52A8\u573A\u5730\u3002"
    },
    {
      id: "24",
      name: "\u5851\u80F6\u64CD\u573A",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "sports",
      longitude: 126.651866,
      latitude: 45.815261,
      tags: ["\u8FD0\u52A8", "\u8DD1\u6B65", "\u5065\u8EAB"],
      openTime: "06:00 - 22:00",
      phone: "0451-88033324",
      description: "\u5B66\u6821\u5851\u80F6\u64CD\u573A\uFF0C\u4E3A\u5B66\u751F\u63D0\u4F9B\u8DD1\u6B65\u548C\u5065\u8EAB\u573A\u5730\u3002"
    },
    // 医疗服务（校园东北部）
    {
      id: "25",
      name: "\u6821\u533B\u9662",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "medical",
      longitude: 126.658792,
      latitude: 45.820809,
      tags: ["\u533B\u7597", "\u6025\u8BCA", "\u4F53\u68C0"],
      openTime: "24\u5C0F\u65F6",
      phone: "0451-88033325",
      description: "\u5B66\u6821\u9644\u5C5E\u533B\u9662\uFF0C\u63D0\u4F9B\u65E5\u5E38\u8BCA\u7597\u3001\u6025\u8BCA\u548C\u4F53\u68C0\u670D\u52A1\u3002"
    },
    // 服务设施（校园各区域）
    {
      id: "26",
      name: "\u5927\u5B66\u751F\u6D3B\u52A8\u4E2D\u5FC3",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.651919,
      latitude: 45.818793,
      tags: ["\u6D3B\u52A8", "\u793E\u56E2", "\u4F1A\u8BAE"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033326",
      description: "\u5B66\u751F\u6D3B\u52A8\u4E2D\u5FC3\uFF0C\u8BBE\u6709\u62A5\u544A\u5385\u3001\u4F1A\u8BAE\u5BA4\u3001\u793E\u56E2\u6D3B\u52A8\u5BA4\u7B49\u3002"
    },
    {
      id: "27",
      name: "\u5927\u5B66\u751F\u670D\u52A1\u4E2D\u5FC3",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.652232,
      latitude: 45.819501,
      tags: ["\u670D\u52A1", "\u54A8\u8BE2", "\u529E\u4E8B"],
      openTime: "08:00 - 17:00",
      phone: "0451-88033327",
      description: "\u63D0\u4F9B\u5B66\u751F\u4E8B\u52A1\u529E\u7406\u3001\u5C31\u4E1A\u6307\u5BFC\u3001\u5FC3\u7406\u54A8\u8BE2\u7B49\u670D\u52A1\u3002"
    },
    {
      id: "28",
      name: "\u6821\u56ED\u8D85\u5E02\uFF08\u6559\u80B2\u8D85\u5E02\uFF09",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.653525,
      latitude: 45.817225,
      tags: ["\u8D2D\u7269", "\u65E5\u7528\u54C1", "\u96F6\u98DF"],
      openTime: "07:00 - 23:00",
      phone: "0451-88033328",
      description: "\u6821\u56ED\u8D85\u5E02\uFF0C\u63D0\u4F9B\u65E5\u7528\u54C1\u3001\u96F6\u98DF\u3001\u6587\u5177\u7B49\u5546\u54C1\u3002"
    },
    {
      id: "29",
      name: "\u5FEB\u9012\u670D\u52A1\u4E2D\u5FC3",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.653737,
      latitude: 45.817529,
      tags: ["\u5FEB\u9012", "\u53D6\u4EF6", "\u5BC4\u4EF6"],
      openTime: "09:00 - 19:00",
      phone: "0451-88033329",
      description: "\u6821\u56ED\u5FEB\u9012\u96C6\u4E2D\u6536\u53D1\u70B9\uFF0C\u652F\u6301\u5404\u5927\u5FEB\u9012\u516C\u53F8\u3002"
    },
    {
      id: "30",
      name: "\u6D17\u6D74\u4E2D\u5FC3",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.653737,
      latitude: 45.817529,
      tags: ["\u6D17\u6D74", "\u70ED\u6C34", "\u751F\u6D3B"],
      openTime: "10:00 - 22:00",
      phone: "0451-88033330",
      description: "\u5B66\u751F\u516C\u5171\u6D17\u6D74\u4E2D\u5FC3\uFF0C\u63D0\u4F9B\u70ED\u6C34\u6DCB\u6D74\u670D\u52A1\u3002"
    },
    {
      id: "31",
      name: "\u5F00\u6C34\u623F",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.654737,
      latitude: 45.817029,
      tags: ["\u70ED\u6C34", "\u5F00\u6C34", "\u751F\u6D3B"],
      openTime: "06:00 - 23:00",
      phone: "0451-88033331",
      description: "\u63D0\u4F9B\u514D\u8D39\u5F00\u6C34\u670D\u52A1\u3002"
    },
    {
      id: "32",
      name: "\u79D1\u6280\u5927\u53A6",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.651919,
      latitude: 45.818793,
      tags: ["\u79D1\u7814", "\u529E\u516C", "\u4F1A\u8BAE"],
      openTime: "08:00 - 17:00",
      phone: "0451-88033332",
      description: "\u79D1\u6280\u5927\u53A6\uFF0C\u8BBE\u6709\u79D1\u7814\u5B9E\u9A8C\u5BA4\u3001\u5B66\u672F\u62A5\u544A\u5385\u548C\u4F1A\u8BAE\u5BA4\u3002"
    },
    {
      id: "33",
      name: "\u5B89\u5168\u4E0E\u5E94\u6025\u7BA1\u7406\u5B9E\u8DF5\u5E73\u53F0\uFF08\u78B3\u8C37\u5927\u53A6\uFF09",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.652392,
      latitude: 45.823424,
      tags: ["\u5B9E\u9A8C", "\u79D1\u7814", "\u5B89\u5168", "\u5E94\u6025"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033333",
      description: '"\u5341\u56DB\u4E94"\u6559\u80B2\u5F3A\u56FD\u9879\u76EE\uFF0C2025\u5E746\u6708\u7AE3\u5DE5\u6295\u5165\u4F7F\u7528\u3002\u9879\u76EE\u7528\u5730\u9762\u79EF2.30\u4E07\u5E73\u65B9\u7C73\uFF0C\u5EFA\u7B51\u9762\u79EF2.70\u4E07\u5E73\u65B9\u7C73\uFF0C\u7528\u4E8E\u5B89\u5168\u4E0E\u5E94\u6025\u7BA1\u7406\u5B9E\u8DF5\u6559\u5B66\u3002'
    },
    {
      id: "34",
      name: "\u5B66\u6821\u62DB\u5F85\u6240",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.658625,
      latitude: 45.819625,
      tags: ["\u4F4F\u5BBF", "\u63A5\u5F85", "\u5BBE\u9986"],
      openTime: "\u5168\u5929",
      phone: "0451-88033334",
      description: "\u5B66\u6821\u62DB\u5F85\u6240\uFF0C\u4E3A\u6765\u8BBF\u4EBA\u5458\u63D0\u4F9B\u4F4F\u5BBF\u670D\u52A1\u3002"
    },
    {
      id: "35",
      name: "\u521B\u65B0\u521B\u4E1A\u5B66\u9662",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.651919,
      latitude: 45.818793,
      tags: ["\u521B\u4E1A", "\u521B\u65B0", "\u5B75\u5316"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033335",
      description: "\u521B\u65B0\u521B\u4E1A\u5B66\u9662\uFF0C\u4E3A\u5B66\u751F\u63D0\u4F9B\u521B\u4E1A\u6307\u5BFC\u548C\u5B75\u5316\u670D\u52A1\u3002"
    },
    {
      id: "36",
      name: "\u7F51\u7EDC\u4FE1\u606F\u4E2D\u5FC3",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.650525,
      latitude: 45.815925,
      tags: ["\u7F51\u7EDC", "\u4FE1\u606F", "\u6280\u672F"],
      openTime: "08:00 - 17:00",
      phone: "0451-88033336",
      description: "\u7F51\u7EDC\u4FE1\u606F\u4E2D\u5FC3\uFF0C\u8D1F\u8D23\u6821\u56ED\u7F51\u7EDC\u5EFA\u8BBE\u548C\u7EF4\u62A4\u3002"
    },
    {
      id: "78",
      name: "\u79D1\u6280\u56ED\u677E\u5317\u56ED\u533A",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66",
      category: "service",
      longitude: 126.652371,
      latitude: 45.815711,
      tags: ["\u79D1\u7814", "\u56ED\u533A", "\u521B\u65B0"],
      openTime: "08:00 - 17:00",
      phone: "0451-88033378",
      description: "\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66\u79D1\u6280\u56ED\u677E\u5317\u56ED\u533A\uFF0C\u4F4D\u4E8E\u6821\u56ED\u5185\uFF0C\u4E3A\u79D1\u6280\u6210\u679C\u8F6C\u5316\u548C\u4F01\u4E1A\u5B75\u5316\u63D0\u4F9B\u670D\u52A1\u3002"
    },
    {
      id: "37",
      name: "\u8D22\u52A1\u5904",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.654111,
      latitude: 45.819751,
      tags: ["\u8D22\u52A1", "\u7F34\u8D39", "\u62A5\u9500"],
      openTime: "08:00 - 17:00",
      phone: "0451-88033337",
      description: "\u5B66\u6821\u8D22\u52A1\u5904\uFF0C\u8D1F\u8D23\u5B66\u8D39\u6536\u7F34\u3001\u62A5\u9500\u7B49\u8D22\u52A1\u4E1A\u52A1\u3002"
    },
    {
      id: "38",
      name: "\u4FDD\u536B\u5904",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.658792,
      latitude: 45.820809,
      tags: ["\u5B89\u5168", "\u4FDD\u536B", "\u95E8\u7981"],
      openTime: "\u5168\u5929",
      phone: "0451-88033338",
      description: "\u5B66\u6821\u4FDD\u536B\u5904\uFF0C\u8D1F\u8D23\u6821\u56ED\u5B89\u5168\u548C\u95E8\u7981\u7BA1\u7406\u3002"
    },
    {
      id: "39",
      name: "\u540E\u52E4\u7BA1\u7406\u5904",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.657792,
      latitude: 45.820309,
      tags: ["\u540E\u52E4", "\u7EF4\u4FEE", "\u670D\u52A1"],
      openTime: "08:00 - 17:00",
      phone: "0451-88033339",
      description: "\u5B66\u6821\u540E\u52E4\u7BA1\u7406\u5904\uFF0C\u8D1F\u8D23\u6821\u56ED\u8BBE\u65BD\u7EF4\u62A4\u548C\u540E\u52E4\u4FDD\u969C\u3002\u5168\u682173\u680B\u5EFA\u7B51\u5DF2\u5B8C\u6210\u5B89\u5168\u4F53\u68C0\u3002"
    },
    // 文化场馆（校园北部）- 地矿文化博物馆三馆合一
    {
      id: "40",
      name: "\u5730\u77FF\u6587\u5316\u535A\u7269\u9986",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.653392,
      latitude: 45.822809,
      tags: ["\u535A\u7269\u9986", "\u6587\u5316", "\u5C55\u89C8", "\u4E09\u9986\u5408\u4E00"],
      openTime: "09:00 - 11:30\uFF08\u6691\u671F\u9650\u65F6\u5F00\u653E\uFF09",
      phone: "0451-88033340",
      description: '\u603B\u9762\u79EF\u7EA64400\u5E73\u65B9\u7C73\uFF0C\u878D\u6821\u53F2\u9986\u3001\u77FF\u4E1A\u9986\u3001\u5730\u8D28\u9986"\u4E09\u9986"\u4E8E\u4E00\u4F53\u3002\u6821\u53F2\u9986\u7EA61100\u5E73\u65B9\u7C73\uFF0C\u5C55\u793A600\u4F59\u5E45\u7167\u7247\u548C\u8FD1\u767E\u4EF6\u5C55\u54C1\uFF1B\u77FF\u4E1A\u9986\u5305\u542B\u77FF\u4E95\u8C03\u5EA6\u4E2D\u5FC3\u3001\u667A\u80FD\u5F00\u91C7\u5B9E\u9A8C\u5BA4\u3001\u667A\u80FD\u5F00\u91C7\u5DE5\u4F5C\u9762\u3001\u7EFC\u91C7\u5DE5\u4F5C\u9762\u7B49\u8BBE\u65BD\uFF0C\u662F\u56FD\u5185\u8BBE\u7F6E\u6700\u5168\u7684\u5730\u4E0B\u6A21\u62DF\u77FF\u4E95\uFF1B\u5730\u8D28\u9986\u4E3A\u4E2D\u56FD\u5730\u8D28\u5B66\u4F1A\u79D1\u666E\u7814\u5B66\u57FA\u5730\u3001\u9ED1\u9F99\u6C5F\u7701\u79D1\u666E\u793A\u8303\u57FA\u5730\uFF0C\u4E3B\u8981\u5C55\u793A\u5CA9\u5C42\u5730\u8D28\u60C5\u51B5\u53CA\u77FF\u77F3\u6807\u672C\u3002'
    },
    // 高端服务平台（校园西部）
    {
      id: "41",
      name: "\u73B0\u4EE3\u5236\u9020\u5DE5\u7A0B\u4E2D\u5FC3",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.650635,
      latitude: 45.816926,
      tags: ["\u5236\u9020", "\u5DE5\u7A0B", "\u5B9E\u8BAD"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033341",
      description: "\u5177\u6709\u56FD\u5185\u4E00\u6D41\u6C34\u5E73\u7684\u73B0\u4EE3\u5236\u9020\u5DE5\u7A0B\u4E2D\u5FC3\u3002"
    },
    {
      id: "42",
      name: "\u73B0\u4EE3\u5206\u6790\u6D4B\u8BD5\u7814\u7A76\u4E2D\u5FC3",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.649635,
      latitude: 45.816426,
      tags: ["\u5206\u6790", "\u6D4B\u8BD5", "\u79D1\u7814"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033342",
      description: "\u5177\u6709\u56FD\u5185\u4E00\u6D41\u6C34\u5E73\u7684\u73B0\u4EE3\u5206\u6790\u6D4B\u8BD5\u7814\u7A76\u4E2D\u5FC3\u3002"
    },
    {
      id: "43",
      name: "\u4E2D\u5965\u804C\u4E1A\u6280\u672F\u57F9\u8BAD\u4E2D\u5FC3",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.648635,
      latitude: 45.817926,
      tags: ["\u57F9\u8BAD", "\u804C\u4E1A\u6280\u672F", "\u56FD\u9645\u5408\u4F5C"],
      openTime: "08:00 - 17:00",
      phone: "0451-88033343",
      description: "\u4E2D\u5965\u804C\u4E1A\u6280\u672F\u57F9\u8BAD\u4E2D\u5FC3\uFF0C\u5F00\u5C55\u56FD\u9645\u5408\u4F5C\u529E\u5B66\u548C\u804C\u4E1A\u6280\u80FD\u57F9\u8BAD\u3002"
    },
    {
      id: "44",
      name: "\u5DE5\u7A0B\u8BAD\u7EC3\u4E2D\u5FC3",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.650635,
      latitude: 45.815926,
      tags: ["\u5B9E\u8BAD", "\u5DE5\u7A0B", "\u5B9E\u8DF5"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033344",
      description: "\u5DE5\u7A0B\u8BAD\u7EC3\u4E2D\u5FC3\uFF0C\u63D0\u4F9B\u91D1\u5DE5\u5B9E\u4E60\u3001\u7535\u5B50\u5B9E\u4E60\u7B49\u5B9E\u8DF5\u6559\u5B66\u3002"
    },
    // 各学院楼（校园中部和东部）
    {
      id: "45",
      name: "\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u6280\u672F\u5B66\u9662\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.652398,
      latitude: 45.818308,
      tags: ["\u6559\u5B66", "\u8BA1\u7B97\u673A", "\u5B9E\u9A8C"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033345",
      description: "\u8BA1\u7B97\u673A\u79D1\u5B66\u4E0E\u6280\u672F\u5B66\u9662\u4E13\u7528\u6559\u5B66\u697C\u3002"
    },
    {
      id: "46",
      name: "\u7ECF\u6D4E\u7BA1\u7406\u5B66\u9662\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.650525,
      latitude: 45.815925,
      tags: ["\u6559\u5B66", "\u7ECF\u7BA1", "\u529E\u516C"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033346",
      description: "\u7ECF\u6D4E\u7BA1\u7406\u5B66\u9662\u4E13\u7528\u6559\u5B66\u697C\u3002"
    },
    {
      id: "47",
      name: "\u7535\u6C14\u4E0E\u63A7\u5236\u5DE5\u7A0B\u5B66\u9662\u697C\uFF08\u78B3\u8C37\u5927\u53A6B\u5EA7\uFF09",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u78B3\u8C37\u5927\u53A6B\u5EA7",
      category: "teaching",
      longitude: 126.650166,
      latitude: 45.822845,
      tags: ["\u6559\u5B66", "\u7535\u6C14", "\u63A7\u5236"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033347",
      description: "\u7535\u6C14\u4E0E\u63A7\u5236\u5DE5\u7A0B\u5B66\u9662\u4E13\u7528\u6559\u5B66\u697C\uFF0C\u4F4D\u4E8E\u78B3\u8C37\u5927\u53A6B\u5EA7\u3002"
    },
    {
      id: "48",
      name: "\u6D4B\u7ED8\u5DE5\u7A0B\u5B66\u9662\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.652444,
      latitude: 45.818157,
      tags: ["\u6559\u5B66", "\u6D4B\u7ED8", "\u5B9E\u9A8C"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033348",
      description: "\u6D4B\u7ED8\u5DE5\u7A0B\u5B66\u9662\u4E13\u7528\u6559\u5B66\u697C\u3002"
    },
    {
      id: "49",
      name: "\u6750\u6599\u79D1\u5B66\u4E0E\u5DE5\u7A0B\u5B66\u9662\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.652139,
      latitude: 45.816055,
      tags: ["\u6559\u5B66", "\u6750\u6599", "\u5B9E\u9A8C"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033349",
      description: "\u6750\u6599\u79D1\u5B66\u4E0E\u5DE5\u7A0B\u5B66\u9662\u4E13\u7528\u6559\u5B66\u697C\u3002"
    },
    {
      id: "50",
      name: "\u4EBA\u6587\u793E\u4F1A\u79D1\u5B66\u5B66\u9662\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.652557,
      latitude: 45.819567,
      tags: ["\u6559\u5B66", "\u4EBA\u6587", "\u793E\u79D1"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033350",
      description: "\u4EBA\u6587\u793E\u4F1A\u79D1\u5B66\u5B66\u9662\u4E13\u7528\u6559\u5B66\u697C\u3002"
    },
    {
      id: "51",
      name: "\u7406\u5B66\u9662\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.652398,
      latitude: 45.818308,
      tags: ["\u6559\u5B66", "\u6570\u5B66", "\u7269\u7406"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033351",
      description: "\u7406\u5B66\u9662\u4E13\u7528\u6559\u5B66\u697C\u3002"
    },
    {
      id: "52",
      name: "\u5916\u56FD\u8BED\u5B66\u9662\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.652557,
      latitude: 45.819567,
      tags: ["\u6559\u5B66", "\u5916\u8BED", "\u8BED\u8A00"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033352",
      description: "\u5916\u56FD\u8BED\u5B66\u9662\u4E13\u7528\u6559\u5B66\u697C\u3002"
    },
    {
      id: "79",
      name: "\u9A6C\u514B\u601D\u4E3B\u4E49\u5B66\u9662",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66",
      category: "teaching",
      longitude: 126.652503,
      latitude: 45.819513,
      tags: ["\u6559\u5B66", "\u601D\u653F", "\u9A6C\u5217"],
      openTime: "08:00 - 17:00",
      phone: "0451-88033379",
      description: "\u9A6C\u514B\u601D\u4E3B\u4E49\u5B66\u9662\uFF0C\u8D1F\u8D23\u601D\u60F3\u653F\u6CBB\u7406\u8BBA\u8BFE\u6559\u5B66\u548C\u9A6C\u514B\u601D\u4E3B\u4E49\u7406\u8BBA\u7814\u7A76\u3002"
    },
    {
      id: "53",
      name: "\u827A\u672F\u5B66\u9662\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.653557,
      latitude: 45.820567,
      tags: ["\u6559\u5B66", "\u827A\u672F", "\u8BBE\u8BA1"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033353",
      description: "\u827A\u672F\u5B66\u9662\u4E13\u7528\u6559\u5B66\u697C\u3002"
    },
    {
      id: "54",
      name: "\u4F53\u80B2\u90E8",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "sports",
      longitude: 126.652866,
      latitude: 45.817261,
      tags: ["\u4F53\u80B2", "\u6559\u5B66", "\u8BAD\u7EC3"],
      openTime: "08:00 - 21:00",
      phone: "0451-88033354",
      description: "\u4F53\u80B2\u90E8\u529E\u516C\u697C\u548C\u8BAD\u7EC3\u573A\u9986\u3002"
    },
    // 红色文化地标（校园中心区域）
    {
      id: "55",
      name: "\u9648\u90C1\u5851\u50CF",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "other",
      longitude: 126.653111,
      latitude: 45.819251,
      tags: ["\u96D5\u5851", "\u7EA2\u8272\u6587\u5316", "\u5730\u6807"],
      openTime: "\u5168\u5929",
      phone: "0451-88033355",
      description: "\u9648\u90C1\u5851\u50CF\uFF0C\u65B0\u4E2D\u56FD\u80FD\u6E90\u5DE5\u4E1A\u548C\u7164\u70AD\u6559\u80B2\u4E8B\u4E1A\u7684\u5F00\u62D3\u8005\u548C\u5960\u57FA\u4EBA\uFF0C\u662F\u7231\u56FD\u4E3B\u4E49\u548C\u6821\u53F2\u6821\u60C5\u6559\u80B2\u7684\u91CD\u8981\u57FA\u5730\u3002"
    },
    {
      id: "56",
      name: "\u592A\u9633\u77F3\u96D5\u5851",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "other",
      longitude: 126.653611,
      latitude: 45.818751,
      tags: ["\u96D5\u5851", "\u6587\u5316", "\u5730\u6807"],
      openTime: "\u5168\u5929",
      phone: "0451-88033356",
      description: "\u592A\u9633\u77F3\u96D5\u5851\uFF0C\u4EE3\u8868\u5B66\u6821\u7684\u529E\u5B66\u7279\u8272\u548C\u7CBE\u795E\u6587\u5316\uFF0C\u662F\u79D1\u5927\u7CBE\u795E\u8C31\u7CFB\u7684\u91CD\u8981\u7EC4\u6210\u90E8\u5206\u3002"
    },
    {
      id: "57",
      name: "\u52B2\u725B\u96D5\u5851",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "other",
      longitude: 126.652611,
      latitude: 45.818751,
      tags: ["\u96D5\u5851", "\u6587\u5316", "\u5730\u6807"],
      openTime: "\u5168\u5929",
      phone: "0451-88033357",
      description: "\u52B2\u725B\u96D5\u5851\uFF0C\u4EE3\u8868\u5B66\u6821\u8270\u82E6\u521B\u4E1A\u7684\u529E\u5B66\u5386\u7A0B\u548C\u594B\u52C7\u4E89\u5148\u7684\u7CBE\u795E\uFF0C\u662F\u79D1\u5927\u7CBE\u795E\u8C31\u7CFB\u7684\u91CD\u8981\u7EC4\u6210\u90E8\u5206\u3002"
    },
    // 校门
    {
      id: "58",
      name: "\u4E1C\u5317\u95E8\uFF08\u6B63\u95E8\uFF09",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "other",
      longitude: 126.651958,
      latitude: 45.82417,
      tags: ["\u6821\u95E8", "\u51FA\u5165\u53E3"],
      openTime: "\u5168\u5929",
      phone: "0451-88033358",
      description: "\u5B66\u6821\u4E1C\u5317\u95E8\uFF0C\u9762\u5411\u6D66\u6E90\u8DEF\uFF0C\u662F\u5B66\u6821\u6B63\u95E8\u3002"
    },
    {
      id: "59",
      name: "\u4E1C\u95E8",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "other",
      longitude: 126.658792,
      latitude: 45.820809,
      tags: ["\u6821\u95E8", "\u51FA\u5165\u53E3"],
      openTime: "\u5168\u5929",
      phone: "0451-88033359",
      description: "\u5B66\u6821\u4E1C\u95E8\uFF0C\u65B9\u4FBF\u5B66\u751F\u51FA\u884C\u3002"
    },
    {
      id: "60",
      name: "\u897F\u95E8",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "other",
      longitude: 126.650525,
      latitude: 45.815925,
      tags: ["\u6821\u95E8", "\u51FA\u5165\u53E3"],
      openTime: "\u5168\u5929",
      phone: "0451-88033360",
      description: "\u5B66\u6821\u897F\u95E8\uFF0C\u9760\u8FD1\u5BBF\u820D\u533A\u3002"
    },
    // 新增学生公寓（8、11-20号楼）
    {
      id: "61",
      name: "\u5B66\u751F\u516C\u5BD38\u53F7\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.659818,
      latitude: 45.817189,
      tags: ["\u4F4F\u5BBF", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033361",
      description: "\u5B66\u751F\u516C\u5BD3\u697C\uFF0C\u53EF\u5BB9\u7EB3800\u540D\u5B66\u751F\u3002"
    },
    {
      id: "62",
      name: "\u5B66\u751F\u516C\u5BD311\u53F7\u697C\uFF08\u7B2C\u5341\u4E00\u5B66\u751F\u516C\u5BD3\uFF09",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.656168,
      latitude: 45.814702,
      tags: ["\u4F4F\u5BBF", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033362",
      description: "\u5B66\u751F\u516C\u5BD3\u697C\uFF0C\u53EF\u5BB9\u7EB31000\u540D\u5B66\u751F\u3002"
    },
    {
      id: "63",
      name: "\u5B66\u751F\u516C\u5BD312\u53F7\u697C\uFF08\u7B2C\u5341\u4E8C\u5B66\u751F\u516C\u5BD3\uFF09",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.657047,
      latitude: 45.809186,
      tags: ["\u4F4F\u5BBF", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033363",
      description: "\u5B66\u751F\u516C\u5BD3\u697C\uFF0C\u53EF\u5BB9\u7EB31000\u540D\u5B66\u751F\u3002"
    },
    {
      id: "64",
      name: "\u5B66\u751F\u516C\u5BD314\u53F7\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.658047,
      latitude: 45.808686,
      tags: ["\u4F4F\u5BBF", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033364",
      description: "\u5B66\u751F\u516C\u5BD3\u697C\uFF0C\u53EF\u5BB9\u7EB3800\u540D\u5B66\u751F\u3002"
    },
    {
      id: "65",
      name: "\u5B66\u751F\u516C\u5BD315\u53F7\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.657829,
      latitude: 45.818347,
      tags: ["\u4F4F\u5BBF", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033365",
      description: "\u5B66\u751F\u516C\u5BD3\u697C\uFF0C\u53EF\u5BB9\u7EB3800\u540D\u5B66\u751F\u3002"
    },
    {
      id: "66",
      name: "\u5B66\u751F\u516C\u5BD316\u53F7\u697C\uFF08\u7B2C\u5341\u516D\u5B66\u751F\u516C\u5BD3\uFF09",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.660047,
      latitude: 45.808686,
      tags: ["\u4F4F\u5BBF", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033366",
      description: "\u5B66\u751F\u516C\u5BD3\u697C\uFF0C\u53EF\u5BB9\u7EB31000\u540D\u5B66\u751F\u3002"
    },
    {
      id: "67",
      name: "\u5B66\u751F\u516C\u5BD317\u53F7\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.661047,
      latitude: 45.809186,
      tags: ["\u4F4F\u5BBF", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033367",
      description: "\u5B66\u751F\u516C\u5BD3\u697C\uFF0C\u53EF\u5BB9\u7EB3800\u540D\u5B66\u751F\u3002"
    },
    {
      id: "68",
      name: "\u5B66\u751F\u516C\u5BD318\u53F7\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.662047,
      latitude: 45.808686,
      tags: ["\u4F4F\u5BBF", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033368",
      description: "\u5B66\u751F\u516C\u5BD3\u697C\uFF0C\u53EF\u5BB9\u7EB3800\u540D\u5B66\u751F\u3002"
    },
    {
      id: "69",
      name: "\u5B66\u751F\u516C\u5BD320\u53F7\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.656423,
      latitude: 45.822337,
      tags: ["\u4F4F\u5BBF", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033369",
      description: "\u5B66\u751F\u516C\u5BD3\u697C\uFF0C\u53EF\u5BB9\u7EB31000\u540D\u5B66\u751F\u3002"
    },
    // 新增教学楼/实验楼
    {
      id: "70",
      name: "\u6559\u5B66\u5B9E\u9A8C\u7EFC\u5408\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.653792,
      latitude: 45.821309,
      tags: ["\u6559\u5B66", "\u5B9E\u9A8C", "\u7EFC\u5408"],
      openTime: "06:00 - 22:00",
      phone: "0451-88033370",
      description: "\u6559\u5B66\u5B9E\u9A8C\u7EFC\u5408\u697C\uFF0C\u96C6\u6559\u5B66\u548C\u5B9E\u9A8C\u529F\u80FD\u4E8E\u4E00\u4F53\u3002"
    },
    {
      id: "71",
      name: "\u6C42\u662F\u697C",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.654792,
      latitude: 45.821809,
      tags: ["\u6559\u5B66", "\u529E\u516C"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033371",
      description: "\u6C42\u662F\u697C\uFF0C\u6559\u5B66\u697C\u3002"
    },
    // 新增研究所/中心
    {
      id: "72",
      name: "\u5149\u6CE2\u6280\u672F\u7814\u7A76\u6240",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.650792,
      latitude: 45.821309,
      tags: ["\u79D1\u7814", "\u5149\u6CE2", "\u6280\u672F"],
      openTime: "08:00 - 17:00",
      phone: "0451-88033372",
      description: "\u5149\u6CE2\u6280\u672F\u7814\u7A76\u6240\uFF0C\u4ECE\u4E8B\u5149\u6CE2\u6280\u672F\u76F8\u5173\u7814\u7A76\u3002"
    },
    {
      id: "73",
      name: "\u5DE5\u7A0B\u529B\u5B66\u4E0E\u6750\u6599\u7814\u7A76\u6240",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "teaching",
      longitude: 126.649792,
      latitude: 45.820809,
      tags: ["\u79D1\u7814", "\u529B\u5B66", "\u6750\u6599"],
      openTime: "08:00 - 17:00",
      phone: "0451-88033373",
      description: "\u5DE5\u7A0B\u529B\u5B66\u4E0E\u6750\u6599\u7814\u7A76\u6240\uFF0C\u4ECE\u4E8B\u5DE5\u7A0B\u529B\u5B66\u4E0E\u6750\u6599\u76F8\u5173\u7814\u7A76\u3002"
    },
    {
      id: "74",
      name: "\u73B0\u4EE3\u6559\u80B2\u6280\u672F\u4E2D\u5FC3",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "service",
      longitude: 126.651792,
      latitude: 45.821309,
      tags: ["\u6559\u80B2", "\u6280\u672F", "\u591A\u5A92\u4F53"],
      openTime: "08:00 - 17:00",
      phone: "0451-88033374",
      description: "\u73B0\u4EE3\u6559\u80B2\u6280\u672F\u4E2D\u5FC3\uFF0C\u8D1F\u8D23\u591A\u5A92\u4F53\u6559\u5B66\u8BBE\u5907\u7BA1\u7406\u548C\u6280\u672F\u652F\u6301\u3002"
    },
    {
      id: "80",
      name: "\u7535\u6C14\u5DE5\u7A0B\u5B9E\u9A8C\u4E0E\u5B9E\u8DF5\u4E2D\u5FC3",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7\u9ED1\u9F99\u6C5F\u79D1\u6280\u5927\u5B66",
      category: "teaching",
      longitude: 126.651349,
      latitude: 45.815741,
      tags: ["\u5B9E\u9A8C", "\u7535\u6C14", "\u5B9E\u8DF5"],
      openTime: "08:00 - 22:00",
      phone: "0451-88033380",
      description: "\u7535\u6C14\u5DE5\u7A0B\u5B9E\u9A8C\u4E0E\u5B9E\u8DF5\u4E2D\u5FC3\uFF0C\u4E3A\u7535\u6C14\u5DE5\u7A0B\u4E13\u4E1A\u63D0\u4F9B\u5B9E\u9A8C\u548C\u5B9E\u8DF5\u6559\u5B66\u670D\u52A1\u3002"
    },
    // 新增食堂
    {
      id: "75",
      name: "\u7B2C\u56DB\u98DF\u5802",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dining",
      longitude: 126.656792,
      latitude: 45.818809,
      tags: ["\u9910\u996E", "\u5FEB\u9910", "\u5C0F\u5403"],
      openTime: "06:30 - 21:00",
      phone: "0451-88033375",
      description: "\u5B66\u6821\u7B2C\u56DB\u98DF\u5802\uFF0C\u63D0\u4F9B\u5404\u7C7B\u5FEB\u9910\u548C\u5C0F\u5403\u3002"
    },
    // 新增校门
    {
      id: "76",
      name: "\u53175\u95E8",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "other",
      longitude: 126.654792,
      latitude: 45.823809,
      tags: ["\u6821\u95E8", "\u51FA\u5165\u53E3"],
      openTime: "\u5168\u5929",
      phone: "0451-88033376",
      description: "\u5B66\u6821\u53175\u95E8\uFF0C\u4F4D\u4E8E\u6821\u56ED\u5317\u90E8\u3002"
    },
    // 新增教师公寓
    {
      id: "77",
      name: "\u6559\u5E08\u516C\u5BD3",
      address: "\u54C8\u5C14\u6EE8\u5E02\u677E\u5317\u533A\u6D66\u6E90\u8DEF2468\u53F7",
      category: "dormitory",
      longitude: 126.660047,
      latitude: 45.818189,
      tags: ["\u4F4F\u5BBF", "\u6559\u5E08", "\u751F\u6D3B"],
      openTime: "\u5168\u5929",
      phone: "0451-88033377",
      description: "\u6559\u5E08\u516C\u5BD3\uFF0C\u4E3A\u6559\u804C\u5DE5\u63D0\u4F9B\u4F4F\u5BBF\u670D\u52A1\u3002"
    }
  ],
  routes: []
};
Mock.mock("/api/campus/map", "get", campusMapData);
Mock.mock("/api/campus/schedule", "get", {
  code: 200,
  message: "success",
  "data|5-10": [{
    id: "@id",
    courseName: "@ctitle(3, 8)",
    teacher: "@cname",
    classroom: '@pick(["\u6559\u5B66\u697CA", "\u6559\u5B66\u697CB", "\u5B9E\u9A8C\u697C", "\u56FE\u4E66\u9986"])@integer(101, 405)',
    "dayOfWeek|0-6": 1,
    "startSection|1-8": 1,
    "endSection|1-8": 2,
    startTime: '@pick(["08:00", "08:55", "10:05", "11:00", "13:30", "14:25", "15:35", "16:30", "18:30", "19:25"])',
    endTime: '@pick(["08:45", "09:40", "10:50", "11:45", "14:15", "15:10", "16:20", "17:15", "19:15", "20:10"])',
    color: '@pick(["#667eea", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"])',
    weeks: '@pick(["1-16\u5468", "1-8\u5468", "9-16\u5468", "3-10\u5468", "5-12\u5468"])'
  }]
});
Mock.mock("/api/campus/schedule", "post", {
  code: 200,
  message: "success",
  data: {
    id: "@id",
    courseName: "@ctitle(3, 8)",
    teacher: "@cname",
    classroom: '@pick(["\u6559\u5B66\u697CA", "\u6559\u5B66\u697CB", "\u5B9E\u9A8C\u697C"])@integer(101, 405)',
    "dayOfWeek|0-6": 1,
    "startSection|1-8": 1,
    "endSection|1-8": 2,
    startTime: "08:00",
    endTime: "09:40",
    color: "#667eea"
  }
});
Mock.mock(/\/api\/campus\/schedule\/\w+/, "post", {
  code: 200,
  message: "success",
  data: {
    id: "@id",
    courseName: "@ctitle(3, 8)",
    teacher: "@cname",
    classroom: '@pick(["\u6559\u5B66\u697CA", "\u6559\u5B66\u697CB", "\u5B9E\u9A8C\u697C"])@integer(101, 405)',
    "dayOfWeek|0-6": 1,
    "startSection|1-8": 1,
    "endSection|1-8": 2,
    startTime: "08:00",
    endTime: "09:40",
    color: "#667eea"
  }
});
Mock.mock(/\/api\/campus\/schedule\/\w+\/delete/, "post", {
  code: 200,
  message: "success"
});
Mock.mock("/api/campus/schedule/import", "post", {
  code: 200,
  message: "success",
  data: {
    success: true,
    imported: "@integer(3, 8)",
    failed: 0
  }
});
Mock.mock("/api/campus/schedule/share", "post", {
  code: 200,
  message: "success",
  data: {
    shareId: "@id",
    shareUrl: "https://heikeji.com/share/schedule/@id",
    expiresAt: "@datetime"
  }
});
Mock.mock("/api/campus/schedule/reminder", "get", {
  code: 200,
  message: "success",
  data: {
    enabled: "@boolean",
    reminderMinutes: "@pick([5, 10, 15, 30])",
    reminderMethod: '@pick(["notification", "email", "both"])'
  }
});
Mock.mock("/api/campus/schedule/reminder", "post", {
  code: 200,
  message: "success",
  data: {
    enabled: "@boolean",
    reminderMinutes: "@pick([5, 10, 15, 30])",
    reminderMethod: '@pick(["notification", "email", "both"])'
  }
});
Mock.mock("/api/campus/library/search", "get", {
  code: 200,
  message: "success",
  data: {
    "results|10-20": [{
      id: "@id",
      isbn: '@string("number", 13)',
      title: "@ctitle(5, 15)",
      author: "@cname",
      publisher: '@pick(["\u6E05\u534E\u5927\u5B66\u51FA\u7248\u793E", "\u4EBA\u6C11\u90AE\u7535\u51FA\u7248\u793E", "\u673A\u68B0\u5DE5\u4E1A\u51FA\u7248\u793E", "\u7535\u5B50\u5DE5\u4E1A\u51FA\u7248\u793E"])',
      category: '@pick(["\u8BA1\u7B97\u673A", "\u6570\u5B66", "\u6587\u5B66", "\u79D1\u5B66", "\u7ECF\u6D4E", "\u827A\u672F"])',
      location: '@pick(["A\u533A", "B\u533A", "C\u533A"])-@integer(1, 5)-@integer(1, 100)',
      "copies|1-10": 1,
      available: "@boolean",
      cover: '@image("140x200", "#10b981", "#FFF", "Book")',
      intro: "@cparagraph(3, 5)",
      publishDate: "@date"
    }],
    "total|20-100": 1
  }
});
Mock.mock("/api/campus/library/borrow", "post", {
  code: 200,
  message: "success",
  data: {
    success: true,
    borrowId: "@id",
    dueDate: "@date"
  }
});
Mock.mock("/api/campus/library/return", "post", {
  code: 200,
  message: "success",
  data: {
    success: true,
    "overdueDays|0-10": 0,
    "fine|0-50": 0
  }
});
Mock.mock("/api/campus/library/renew", "post", {
  code: 200,
  message: "success",
  data: {
    success: true,
    newDueDate: "@date"
  }
});
Mock.mock("/api/campus/library/my-borrows", "get", {
  code: 200,
  message: "success",
  "data|3-8": [{
    id: "@id",
    bookId: "@id",
    bookTitle: "@ctitle(5, 15)",
    bookCover: '@image("100x140", "#10b981", "#FFF", "Book")',
    borrowDate: "@date",
    dueDate: "@date",
    returnDate: "@date",
    "status|1": ["borrowed", "returned", "overdue"],
    "renewCount|0-2": 0
  }]
});
Mock.mock("/api/campus/library/favorites", "post", {
  code: 200,
  message: "success",
  data: { success: true }
});
Mock.mock("/api/campus/library/favorites/remove", "post", {
  code: 200,
  message: "success",
  data: { success: true }
});
Mock.mock("/api/campus/library/favorites", "get", {
  code: 200,
  message: "success",
  "data|5-10": [{
    id: "@id",
    isbn: '@string("number", 13)',
    title: "@ctitle(5, 15)",
    author: "@cname",
    publisher: '@pick(["\u6E05\u534E\u5927\u5B66\u51FA\u7248\u793E", "\u4EBA\u6C11\u90AE\u7535\u51FA\u7248\u793E", "\u673A\u68B0\u5DE5\u4E1A\u51FA\u7248\u793E"])',
    category: '@pick(["\u8BA1\u7B97\u673A", "\u6570\u5B66", "\u6587\u5B66", "\u79D1\u5B66", "\u7ECF\u6D4E", "\u827A\u672F"])',
    location: '@pick(["A\u533A", "B\u533A", "C\u533A"])-@integer(1, 5)-@integer(1, 100)',
    "copies|1-10": 1,
    available: "@boolean",
    cover: '@image("140x200", "#10b981", "#FFF", "Book")',
    intro: "@cparagraph(3, 5)"
  }]
});
Mock.mock("/api/campus/library/seats", "get", {
  code: 200,
  message: "success",
  "data|30-50": [{
    id: "@id",
    "num|1-200": 1,
    "floor|1-5": 1,
    "zone|1": ["A", "B", "C"],
    "row|1-10": 1,
    "status|1": ["available", "available", "available", "available", "occupied", "reserved", "maintenance"]
  }]
});
Mock.mock("/api/campus/library/seats/book", "post", {
  code: 200,
  message: "success",
  data: {
    success: true,
    bookingId: "@id"
  }
});
Mock.mock("/api/campus/library/seats/cancel", "post", {
  code: 200,
  message: "success",
  data: { success: true }
});
Mock.mock("/api/campus/library/seats/checkin", "post", {
  code: 200,
  message: "success",
  data: { success: true }
});
Mock.mock("/api/campus/library/seats/checkout", "post", {
  code: 200,
  message: "success",
  data: { success: true }
});
Mock.mock("/api/campus/library/my-bookings", "get", {
  code: 200,
  message: "success",
  "data|3-6": [{
    id: "@id",
    seatId: "@id",
    "seatNum|1-200": 1,
    "floor|1-5": 1,
    date: "@date",
    startTime: "@time",
    endTime: "@time",
    "status|1": ["active", "completed", "cancelled"],
    checkInTime: "@time",
    checkOutTime: "@time"
  }]
});
var mockAPI = {
  user: {
    info: () => Promise.resolve({ code: 200, data: { id: "1", username: "test", role: "student" } }),
    login: (data) => Promise.resolve({ code: 200, data: { token: "mock-token", user: { id: "1", username: data?.username || "test" } } }),
    register: (data) => Promise.resolve({ code: 200, data: { id: "1", username: data?.username || "test" } }),
    logout: () => Promise.resolve({ code: 200, message: "success" })
  },
  secondhand: {
    list: (params) => Promise.resolve({ code: 200, data: { list: [], total: 0 } }),
    detail: (id) => Promise.resolve({ code: 200, data: { id, name: "Item" } }),
    categories: () => Promise.resolve({ code: 200, data: [] }),
    myItems: () => Promise.resolve({ code: 200, data: [] }),
    publish: (data) => Promise.resolve({ code: 200, data: { id: "1", ...data } })
  },
  community: {
    boards: () => Promise.resolve({ code: 200, data: [] }),
    posts: (params) => Promise.resolve({ code: 200, data: { list: [], total: 0 } }),
    postDetail: (id) => Promise.resolve({ code: 200, data: { id, title: "Post" } }),
    createPost: (data) => Promise.resolve({ code: 200, data: { id: "1", ...data } }),
    likePost: (id) => Promise.resolve({ code: 200, message: "success" }),
    unlikePost: (id) => Promise.resolve({ code: 200, message: "success" }),
    addComment: (postId, content, parentId) => Promise.resolve({ code: 200, data: { id: "1", postId, content } }),
    lostFoundList: (params) => Promise.resolve({ code: 200, data: { list: [], total: 0 } }),
    publishLostFound: (data) => Promise.resolve({ code: 200, data: { id: "1", ...data } }),
    activities: (params) => Promise.resolve({ code: 200, data: { list: [], total: 0 } }),
    activityDetail: (id) => Promise.resolve({ code: 200, data: { id, title: "Activity" } }),
    joinActivity: (id) => Promise.resolve({ code: 200, message: "success" }),
    createActivity: (data) => Promise.resolve({ code: 200, data: { id: "1", ...data } })
  },
  studentAffairs: {
    pendingTasks: () => Promise.resolve({ code: 200, data: [] }),
    leaveApplications: () => Promise.resolve({ code: 200, data: [] }),
    submitLeave: (data) => Promise.resolve({ code: 200, data: { id: "1", ...data } }),
    cancelLeave: (id) => Promise.resolve({ code: 200, message: "success" }),
    aidApplications: () => Promise.resolve({ code: 200, data: [] }),
    submitAid: (data) => Promise.resolve({ code: 200, data: { id: "1", ...data } }),
    militaryOrders: () => Promise.resolve({ code: 200, data: [] }),
    submitMilitaryOrder: (data) => Promise.resolve({ code: 200, data: { id: "1", ...data } }),
    campusCard: () => Promise.resolve({ code: 200, data: { balance: 100 } }),
    rechargeRecords: () => Promise.resolve({ code: 200, data: [] }),
    rechargeCard: (amount, method) => Promise.resolve({ code: 200, message: "success" }),
    reportLost: () => Promise.resolve({ code: 200, message: "success" }),
    aidPolicies: () => Promise.resolve({ code: 200, data: [] })
  },
  products: {
    hot: () => Promise.resolve({ code: 200, data: [] }),
    list: (params) => Promise.resolve({ code: 200, data: { list: [], total: 0 } }),
    detail: (id) => Promise.resolve({ code: 200, data: { id, name: "Product" } }),
    categories: () => Promise.resolve({ code: 200, data: [] }),
    search: (keyword, params) => Promise.resolve({ code: 200, data: { list: [], total: 0 } })
  },
  takeout: {
    merchants: (params) => Promise.resolve({ code: 200, data: { list: [], total: 0 } }),
    searchMerchants: (keyword) => Promise.resolve({ code: 200, data: [] }),
    merchantDetail: (id) => Promise.resolve({ code: 200, data: { id, name: "Merchant" } }),
    merchantProducts: (merchantId) => Promise.resolve({ code: 200, data: [] }),
    recommendedProducts: (merchantId) => Promise.resolve({ code: 200, data: [] }),
    productDetail: (productId) => Promise.resolve({ code: 200, data: { id: productId, name: "Product" } })
  },
  campus: {
    schedule: (params) => Promise.resolve({ code: 200, data: [] }),
    grades: (params) => Promise.resolve({ code: 200, data: [] }),
    gpa: () => Promise.resolve({ code: 200, data: { gpa: 3.5 } }),
    // 图书馆 - 借阅记录
    libraryBorrows: () => Promise.resolve({
      code: 200,
      data: [
        {
          id: "1",
          bookId: "b1",
          bookTitle: "JavaScript\u9AD8\u7EA7\u7A0B\u5E8F\u8BBE\u8BA1",
          bookCover: "https://via.placeholder.com/100x140/10b981/ffffff?text=JS",
          borrowDate: "2026-04-01",
          dueDate: "2026-05-01",
          status: "borrowed",
          renewCount: 0
        },
        {
          id: "2",
          bookId: "b2",
          bookTitle: "Vue.js\u5B9E\u6218",
          bookCover: "https://via.placeholder.com/100x140/667eea/ffffff?text=Vue",
          borrowDate: "2026-03-15",
          dueDate: "2026-04-15",
          returnDate: "2026-04-10",
          status: "returned",
          renewCount: 1
        }
      ]
    }),
    // 图书馆 - 座位信息
    librarySeats: (floor) => Promise.resolve({
      code: 200,
      data: Array.from({ length: 50 }, (_, i) => ({
        id: `seat-${floor || 3}-${i + 1}`,
        num: i + 1,
        floor: floor || 3,
        zone: ["A", "B", "C"][Math.floor(i / 20)],
        row: Math.floor(i / 10) + 1,
        status: ["available", "available", "available", "occupied", "reserved", "maintenance"][Math.floor(Math.random() * 6)]
      }))
    }),
    // 图书馆 - 座位预约
    reserveSeat: (data) => Promise.resolve({ code: 200, message: "success", data: { bookingId: "bk" + Date.now() } }),
    // 图书馆 - 我的座位预约
    mySeatBookings: () => Promise.resolve({
      code: 200,
      data: [
        {
          id: "bk1",
          seatId: "seat-3-42",
          seatNum: 42,
          floor: 3,
          date: "2026-04-25",
          startTime: "09:00",
          endTime: "11:00",
          status: "active"
        },
        {
          id: "bk2",
          seatId: "seat-2-18",
          seatNum: 18,
          floor: 2,
          date: "2026-04-24",
          startTime: "14:00",
          endTime: "16:00",
          status: "completed"
        }
      ]
    }),
    // 图书馆 - 取消预约
    cancelSeatBooking: (bookingId) => Promise.resolve({ code: 200, message: "success" }),
    // 图书馆 - 签到
    checkInSeat: (bookingId) => Promise.resolve({ code: 200, message: "success" }),
    // 图书馆 - 签退
    checkOutSeat: (bookingId) => Promise.resolve({ code: 200, message: "success" }),
    // 图书馆 - 借阅图书
    borrowBook: (data) => Promise.resolve({ code: 200, message: "success", data: { borrowId: "br" + Date.now(), dueDate: "2026-05-25" } }),
    // 图书馆 - 归还图书
    returnBook: (borrowId) => Promise.resolve({ code: 200, message: "success" }),
    // 图书馆 - 续借图书
    renewBook: (borrowId) => Promise.resolve({ code: 200, message: "success", data: { newDueDate: "2026-06-25" } }),
    // 图书馆 - 添加收藏
    addToFavorites: (bookId) => Promise.resolve({ code: 200, message: "success" }),
    // 图书馆 - 获取收藏
    myFavorites: () => Promise.resolve({ code: 200, data: [] }),
    pendingPayments: () => Promise.resolve({ code: 200, data: [] }),
    paymentHistory: () => Promise.resolve({ code: 200, data: [] }),
    scholarships: () => Promise.resolve({ code: 200, data: [] }),
    aidPolicies: () => Promise.resolve({ code: 200, data: [] }),
    activities: () => Promise.resolve({ code: 200, data: [] }),
    counseling: () => Promise.resolve({ code: 200, data: [] }),
    careers: () => Promise.resolve({ code: 200, data: [] }),
    classrooms: (params) => {
      const buildings = ["\u4E3B\u697C", "\u7B2C\u4E00\u6559\u5B66\u697C", "\u7B2C\u4E8C\u6559\u5B66\u697C", "\u77FF\u4E1A\u5DE5\u7A0B\u5B9E\u9A8C\u697C", "\u673A\u7535\u5DE5\u7A0B\u5B9E\u9A8C\u697C"];
      const types = ["lecture", "lab", "multimedia", "seminar"];
      const allClassrooms = [];
      let id = 1;
      const buildingPrefix = {
        "\u4E3B\u697C": "Z",
        "\u7B2C\u4E00\u6559\u5B66\u697C": "A",
        "\u7B2C\u4E8C\u6559\u5B66\u697C": "B",
        "\u77FF\u4E1A\u5DE5\u7A0B\u5B9E\u9A8C\u697C": "K",
        "\u673A\u7535\u5DE5\u7A0B\u5B9E\u9A8C\u697C": "J"
      };
      for (let b = 0; b < buildings.length; b++) {
        const building = buildings[b];
        const prefix = buildingPrefix[building] || String.fromCharCode(65 + b);
        const floors = building === "\u4E3B\u697C" ? 6 : 5;
        const roomsPerFloor = building.includes("\u5B9E\u9A8C\u697C") ? 8 : 10;
        for (let f = 1; f <= floors; f++) {
          for (let r = 1; r <= roomsPerFloor; r++) {
            const roomNum = `${prefix}${f}${String(r).padStart(2, "0")}`;
            const capacity = building.includes("\u5B9E\u9A8C\u697C") ? [20, 25, 30, 35, 40][Math.floor(Math.random() * 5)] : [40, 45, 50, 60, 80, 120][Math.floor(Math.random() * 6)];
            const type = building.includes("\u5B9E\u9A8C\u697C") ? "lab" : types[Math.floor(Math.random() * types.length)];
            const facilities = building.includes("\u5B9E\u9A8C\u697C") ? ["\u7535\u8111", "\u6295\u5F71\u4EEA", "\u7A7A\u8C03", "\u5B9E\u9A8C\u8BBE\u5907"].filter(() => Math.random() > 0.2) : ["\u6295\u5F71\u4EEA", "\u7A7A\u8C03", "\u7535\u8111"].filter(() => Math.random() > 0.3);
            allClassrooms.push({
              id: String(id++),
              roomNumber: roomNum,
              building,
              floor: f,
              type,
              capacity,
              facilities,
              isAvailable: Math.random() > 0.3,
              location: `${f}\u697C${["\u4E1C\u4FA7", "\u897F\u4FA7", "\u4E2D\u90E8", "\u5317\u4FA7", "\u5357\u4FA7"][Math.floor(Math.random() * 5)]}`
            });
          }
        }
      }
      let result = allClassrooms;
      if (params?.building) {
        result = result.filter((c) => c.building === params.building);
      }
      if (params?.floor !== void 0) {
        result = result.filter((c) => c.floor === params.floor);
      }
      if (params?.type) {
        result = result.filter((c) => c.type === params.type);
      }
      return Promise.resolve({ code: 200, data: result });
    },
    classroomTimeSlots: (roomId, date) => {
      const slots = [
        { period: 1, time: "08:00-08:45", available: Math.random() > 0.3 },
        { period: 2, time: "08:55-09:40", available: Math.random() > 0.3 },
        { period: 3, time: "10:05-10:50", available: Math.random() > 0.3 },
        { period: 4, time: "11:00-11:45", available: Math.random() > 0.3 },
        { period: 5, time: "13:30-14:15", available: Math.random() > 0.3 },
        { period: 6, time: "14:25-15:10", available: Math.random() > 0.3 },
        { period: 7, time: "15:35-16:20", available: Math.random() > 0.3 },
        { period: 8, time: "16:30-17:15", available: Math.random() > 0.3 },
        { period: 9, time: "18:30-19:15", available: Math.random() > 0.3 },
        { period: 10, time: "19:25-20:10", available: Math.random() > 0.3 }
      ];
      return Promise.resolve({ code: 200, data: slots });
    },
    bookClassroom: (roomId, data) => {
      return Promise.resolve({
        code: 200,
        message: "\u9884\u7EA6\u6210\u529F",
        data: {
          success: true,
          bookingId: "cb" + Date.now(),
          message: "\u6559\u5BA4\u9884\u7EA6\u6210\u529F"
        }
      });
    },
    myClassroomBookings: () => {
      return Promise.resolve({
        code: 200,
        data: [
          {
            id: "cb1",
            roomId: "5",
            roomNumber: "A202",
            building: "\u4E3B\u697C",
            floor: 2,
            date: "2026-04-26",
            periods: [5, 6],
            time: "13:30-15:10",
            reason: "\u793E\u56E2\u6D3B\u52A8",
            status: "active",
            bookedAt: "2026-04-25 10:30:00"
          },
          {
            id: "cb2",
            roomId: "12",
            roomNumber: "B301",
            building: "\u4FE1\u606F\u697C",
            floor: 3,
            date: "2026-04-24",
            periods: [1, 2],
            time: "08:00-09:40",
            reason: "\u5C0F\u7EC4\u8BA8\u8BBA",
            status: "completed",
            bookedAt: "2026-04-23 14:20:00"
          }
        ]
      });
    },
    cancelClassroomBooking: (bookingId) => {
      return Promise.resolve({ code: 200, message: "\u53D6\u6D88\u6210\u529F", data: { success: true } });
    },
    exams: () => Promise.resolve({ code: 200, data: [] }),
    busSchedule: () => Promise.resolve({ code: 200, data: [] }),
    cardBalance: () => Promise.resolve({ code: 200, data: { balance: 100 } }),
    cardTransactions: () => Promise.resolve({ code: 200, data: [] }),
    mapData: () => Promise.resolve({ code: 200, data: campusMapData })
  }
};
var index_default = Mock;
var export_generateAnnouncements = void 0;
var export_generateCampusActivities = void 0;
var export_generateLeaveApplications = void 0;
var export_generateScholarships = void 0;
export {
  campusMapData,
  index_default as default,
  export_generateAnnouncements as generateAnnouncements,
  export_generateCampusActivities as generateCampusActivities,
  export_generateLeaveApplications as generateLeaveApplications,
  export_generateScholarships as generateScholarships,
  mockAPI
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsic3JjL21vY2svc3JjL21vY2svc3JjL21vY2svaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiRTpcXFxcUHJvZ3JhbSBGaWxlXFxcXEhLWUdcXFxcaGVpa2VqaS1tYWxsXFxcXGhlaWtlamktd2ViXFxcXHNyY1xcXFxtb2NrXFxcXGluZGV4LnRzXCI7Y29uc3QgX19pbmplY3RlZF9kaXJuYW1lX18gPSBcIkU6XFxcXFByb2dyYW0gRmlsZVxcXFxIS1lHXFxcXGhlaWtlamktbWFsbFxcXFxoZWlrZWppLXdlYlxcXFxzcmNcXFxcbW9ja1wiO2NvbnN0IF9faW5qZWN0ZWRfaW1wb3J0X21ldGFfdXJsX18gPSBcImZpbGU6Ly8vRTovUHJvZ3JhbSUyMEZpbGUvSEtZRy9oZWlrZWppLW1hbGwvaGVpa2VqaS13ZWIvc3JjL21vY2svaW5kZXgudHNcIjtpbXBvcnQgTW9jayBmcm9tICdtb2NranMnXHJcbmltcG9ydCB7IGdlbmVyYXRlQW5ub3VuY2VtZW50cywgZ2VuZXJhdGVDYW1wdXNBY3Rpdml0aWVzLCBnZW5lcmF0ZUxlYXZlQXBwbGljYXRpb25zLCBnZW5lcmF0ZVNjaG9sYXJzaGlwcyB9IGZyb20gJy4vZ2VuZXJhdG9ycy9zdHVkZW50QWZmYWlycydcclxuXHJcbi8vIFx1OTE0RFx1N0Y2RSBNb2NrLmpzIFx1NEUwRFx1NjJFNlx1NjIyQVx1OUFEOFx1NUZCN1x1NTczMFx1NTZGRVx1NzY4NFx1OEJGN1x1NkM0MlxyXG4vLyBcdTZDRThcdTYxMEZcdUZGMUFNb2NrLnNldHVwIFx1NzUzMSB2aXRlLXBsdWdpbi1tb2NrIFx1ODFFQVx1NTJBOFx1OEMwM1x1NzUyOFx1RkYwQ1x1OEZEOVx1OTFDQ1x1NEUwRFx1OTcwMFx1ODk4MVx1OTFDRFx1NTkwRFx1OEJCRVx1N0Y2RVxyXG5pZiAoTW9jay5YSFIucHJvdG90eXBlLl9fc2VuZCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgTW9jay5YSFIucHJvdG90eXBlLl9fc2VuZCA9IE1vY2suWEhSLnByb3RvdHlwZS5zZW5kXHJcbiAgTW9jay5YSFIucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBjb25zdCB1cmwgPSB0aGlzLnVybFxyXG4gICAgLy8gXHU0RTBEXHU2MkU2XHU2MjJBXHU5QUQ4XHU1RkI3XHU1NzMwXHU1NkZFXHU3NkY4XHU1MTczXHU3Njg0XHU4QkY3XHU2QzQyXHVGRjA4XHU1MzA1XHU2MkVDXHU3NEU2XHU3MjQ3XHU2NzBEXHU1MkExXHU1NjY4XHVGRjA5XHJcbiAgICBpZiAodXJsICYmIChcclxuICAgICAgdXJsLmluY2x1ZGVzKCdhbWFwLmNvbScpIHx8XHJcbiAgICAgIHVybC5pbmNsdWRlcygnanNhcGkuYW1hcC5jb20nKSB8fFxyXG4gICAgICB1cmwuaW5jbHVkZXMoJ3dlYmFwaS5hbWFwLmNvbScpIHx8XHJcbiAgICAgIHVybC5pbmNsdWRlcygncmVzdGFwaS5hbWFwLmNvbScpIHx8XHJcbiAgICAgIHVybC5pbmNsdWRlcygnY3VzdHlsZS5hbWFwLmNvbScpIHx8XHJcbiAgICAgIHVybC5pbmNsdWRlcygnbWFwcGx1Z2luLmFtYXAuY29tJykgfHxcclxuICAgICAgdXJsLmluY2x1ZGVzKCdvNC5hbWFwLmNvbScpIHx8XHJcbiAgICAgIHVybC5pbmNsdWRlcygnaXMuYXV0b25hdmkuY29tJykgfHxcclxuICAgICAgdXJsLmluY2x1ZGVzKCd3ZWJyZDAnKSB8fFxyXG4gICAgICB1cmwuaW5jbHVkZXMoJ3dlYnN0MCcpIHx8XHJcbiAgICAgIHVybC5pbmNsdWRlcygndmVjdG9yLmFtYXAuY29tJylcclxuICAgICkpIHtcclxuICAgICAgLy8gXHU0RjdGXHU3NTI4XHU1MzlGXHU1OUNCIFhIUiBcdTUzRDFcdTkwMDFcdThCRjdcdTZDNDJcdUZGMENcdTRFMERcdTdFQ0ZcdThGQzcgTW9ja1xyXG4gICAgICByZXR1cm4gdGhpcy5fX3NlbmQuYXBwbHkodGhpcywgYXJndW1lbnRzKVxyXG4gICAgfVxyXG4gICAgLy8gXHU1MTc2XHU0RUQ2XHU4QkY3XHU2QzQyXHU2QjYzXHU1RTM4XHU4RDcwIE1vY2tcclxuICAgIHJldHVybiB0aGlzLl9fc2VuZC5hcHBseSh0aGlzLCBhcmd1bWVudHMpXHJcbiAgfVxyXG59XHJcblxyXG4vLyBcdTc2N0JcdTVGNTVcdTc2RjhcdTUxNzNNb2NrXHJcbk1vY2subW9jaygnL2FwaS9hdXRoL2xvZ2luJywgJ3Bvc3QnLCB7XHJcbiAgY29kZTogMjAwLFxyXG4gIG1lc3NhZ2U6ICdzdWNjZXNzJyxcclxuICBkYXRhOiB7XHJcbiAgICB0b2tlbjogJ0BndWlkJyxcclxuICAgIHVzZXI6IHtcclxuICAgICAgaWQ6ICdAaWQnLFxyXG4gICAgICB1c2VybmFtZTogJ0BjbmFtZScsXHJcbiAgICAgIGF2YXRhcjogJ0BpbWFnZShcIjEwMHgxMDBcIiwgXCIjNEE5MEUyXCIsIFwiI0ZGRlwiLCBcIkF2YXRhclwiKScsXHJcbiAgICAgIHJvbGU6ICdzdHVkZW50JyxcclxuICAgICAgc3R1ZGVudElkOiAnMjAyMUBzdHJpbmcoXCJudW1iZXJcIiwgOCknLFxyXG4gICAgICBjbGFzczogJ1x1OEJBMVx1N0I5N1x1NjczQVx1NzlEMVx1NUI2Nlx1NEUwRVx1NjI4MFx1NjcyRjIwMjFcdTdFQTcxXHU3M0VEJyxcclxuICAgICAgY29sbGVnZTogJ1x1OEJBMVx1N0I5N1x1NjczQVx1NzlEMVx1NUI2Nlx1NEUwRVx1NjI4MFx1NjcyRlx1NUI2Nlx1OTY2MidcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG5Nb2NrLm1vY2soJy9hcGkvYXV0aC9yZWdpc3RlcicsICdwb3N0Jywge1xyXG4gIGNvZGU6IDIwMCxcclxuICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgZGF0YToge1xyXG4gICAgdG9rZW46ICdAZ3VpZCcsXHJcbiAgICB1c2VyOiB7XHJcbiAgICAgIGlkOiAnQGlkJyxcclxuICAgICAgdXNlcm5hbWU6ICdAY25hbWUnLFxyXG4gICAgICByb2xlOiAnc3R1ZGVudCdcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG4vLyBcdTc1MjhcdTYyMzdcdTc2RjhcdTUxNzNNb2NrIC0gXHU1NDBDXHU2NUY2XHU2NTJGXHU2MzAxIC9hcGkvdXNlci9pbmZvIFx1NTQ4QyAvdXNlci9pbmZvXHJcbk1vY2subW9jaygvXFwvYXBpXFwvdXNlclxcL2luZm98dXNlclxcL2luZm8vLCAnZ2V0Jywge1xyXG4gIGNvZGU6IDIwMCxcclxuICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgZGF0YToge1xyXG4gICAgaWQ6ICdAaWQnLFxyXG4gICAgdXNlcm5hbWU6ICdAY25hbWUnLFxyXG4gICAgYXZhdGFyOiAnQGltYWdlKFwiMTAweDEwMFwiLCBcIiM0QTkwRTJcIiwgXCIjRkZGXCIsIFwiQXZhdGFyXCIpJyxcclxuICAgIHJvbGU6ICdzdHVkZW50JyxcclxuICAgIHN0dWRlbnRJZDogJzIwMjFAc3RyaW5nKFwibnVtYmVyXCIsIDgpJyxcclxuICAgIGNsYXNzOiAnXHU4QkExXHU3Qjk3XHU2NzNBXHU3OUQxXHU1QjY2XHU0RTBFXHU2MjgwXHU2NzJGMjAyMVx1N0VBNzFcdTczRUQnLFxyXG4gICAgY29sbGVnZTogJ1x1OEJBMVx1N0I5N1x1NjczQVx1NzlEMVx1NUI2Nlx1NEUwRVx1NjI4MFx1NjcyRlx1NUI2Nlx1OTY2MicsXHJcbiAgICBwaG9uZTogJ0BzdHJpbmcoXCJudW1iZXJcIiwgMTEpJyxcclxuICAgIGVtYWlsOiAnQGVtYWlsJ1xyXG4gIH1cclxufSlcclxuXHJcbi8vIFx1NTU0Nlx1NTRDMVx1NzZGOFx1NTE3M01vY2sgLSBcdTU0MENcdTY1RjZcdTY1MkZcdTYzMDEgL2FwaS9wcm9kdWN0cy9ob3QgXHU1NDhDIC9wcm9kdWN0cy9ob3RcclxuTW9jay5tb2NrKC9cXC9hcGlcXC9wcm9kdWN0c1xcL2hvdHxwcm9kdWN0c1xcL2hvdC8sICdnZXQnLCB7XHJcbiAgY29kZTogMjAwLFxyXG4gIG1lc3NhZ2U6ICdzdWNjZXNzJyxcclxuICAnZGF0YXw4JzogW3tcclxuICAgIGlkOiAnQGlkJyxcclxuICAgIG5hbWU6ICdAY3RpdGxlKDUsIDE1KScsXHJcbiAgICBkZXNjcmlwdGlvbjogJ0BjcGFyYWdyYXBoKDIsIDQpJyxcclxuICAgIHByaWNlOiAnQGZsb2F0KDEwLCA1MDAsIDIsIDIpJyxcclxuICAgIG9yaWdpbmFsUHJpY2U6ICdAZmxvYXQoMjAsIDgwMCwgMiwgMiknLFxyXG4gICAgY292ZXI6ICdAaW1hZ2UoXCIzMDB4MzAwXCIsIFwiIzY2N2VlYVwiLCBcIiNGRkZcIiwgXCJQcm9kdWN0XCIpJyxcclxuICAgICdpbWFnZXN8My01JzogWydAaW1hZ2UoXCIzMDB4MzAwXCIsIFwiIzY2N2VlYVwiLCBcIiNGRkZcIiwgXCJQcm9kdWN0XCIpJ10sXHJcbiAgICBjYXRlZ29yeTogJ0BwaWNrKFtcIlx1NjU3MFx1NzgwMVx1NEVBN1x1NTRDMVwiLCBcIlx1NTZGRVx1NEU2Nlx1NjU1OVx1Njc1MFwiLCBcIlx1OEZEMFx1NTJBOFx1NjIzN1x1NTkxNlwiLCBcIlx1NzUxRlx1NkQzQlx1NzUyOFx1NTRDMVwiLCBcIlx1NjcwRFx1OTk3MFx1OTc4Qlx1NTMwNVwiLCBcIlx1OThERlx1NTRDMVx1OTZGNlx1OThERlwiXSknLFxyXG4gICAgJ3N0b2NrfDEwLTEwMCc6IDUwLFxyXG4gICAgJ3NhbGVzfDAtMTAwMCc6IDEwMCxcclxuICAgICdyYXRpbmd8MS01JzogNC41LFxyXG4gICAgJ3Jldmlld3N8MC0xMDAnOiAyMCxcclxuICAgIG1lcmNoYW50OiB7XHJcbiAgICAgIGlkOiAnQGlkJyxcclxuICAgICAgbmFtZTogJ0BjdGl0bGUoMywgOClcdTVFOTcnLFxyXG4gICAgICBsb2dvOiAnQGltYWdlKFwiMTAweDEwMFwiLCBcIiMxMGI5ODFcIiwgXCIjRkZGXCIsIFwiU2hvcFwiKSdcclxuICAgIH0sXHJcbiAgICB0YWdzOiBbJ0BwaWNrKFtcIlx1NzBFRFx1OTUwMFwiLCBcIlx1NjVCMFx1NTRDMVwiLCBcIlx1NzI3OVx1NEVGN1wiLCBcIlx1NTMwNVx1OTBBRVwiXSknXSxcclxuICAgIGNyZWF0ZVRpbWU6ICdAZGF0ZXRpbWUnXHJcbiAgfV1cclxufSlcclxuXHJcbi8vIFx1OEJGRVx1N0EwQlx1ODg2OFx1NzZGOFx1NTE3M01vY2tcclxuTW9jay5tb2NrKCcvYXBpL3NjaGVkdWxlJywgJ2dldCcsIHtcclxuICBjb2RlOiAyMDAsXHJcbiAgbWVzc2FnZTogJ3N1Y2Nlc3MnLFxyXG4gICdkYXRhfDUnOiBbe1xyXG4gICAgJ2RheXwrMSc6IDEsXHJcbiAgICAnY291cnNlc3wzLTUnOiBbe1xyXG4gICAgICBpZDogJ0BpZCcsXHJcbiAgICAgIG5hbWU6ICdAY3RpdGxlKDMsIDUpJyxcclxuICAgICAgdGVhY2hlcjogJ0BjbmFtZScsXHJcbiAgICAgIGxvY2F0aW9uOiAnQHBpY2soW1wiXHU2NTU5XHU1QjY2XHU2OTdDQVwiLCBcIlx1NjU1OVx1NUI2Nlx1Njk3Q0JcIiwgXCJcdTVCOUVcdTlBOENcdTY5N0NcIl0pQGludGVnZXIoMTAxLCA0MDUpJyxcclxuICAgICAgJ3N0YXJ0V2Vla3wxLTE2JzogMSxcclxuICAgICAgJ2VuZFdlZWt8MS0xNic6IDE2LFxyXG4gICAgICAnZGF5fDEtNyc6IDEsXHJcbiAgICAgICdzdGFydFNlY3Rpb258MS04JzogMSxcclxuICAgICAgJ2VuZFNlY3Rpb258MS04JzogMlxyXG4gICAgfV1cclxuICB9XVxyXG59KVxyXG5cclxuLy8gXHU2MjEwXHU3RUU5XHU3NkY4XHU1MTczTW9ja1xyXG5Nb2NrLm1vY2soJy9hcGkvZ3JhZGVzJywgJ2dldCcsIHtcclxuICBjb2RlOiAyMDAsXHJcbiAgbWVzc2FnZTogJ3N1Y2Nlc3MnLFxyXG4gICdkYXRhfDgtMTInOiBbe1xyXG4gICAgaWQ6ICdAaWQnLFxyXG4gICAgY291cnNlTmFtZTogJ0BjdGl0bGUoMywgNiknLFxyXG4gICAgY3JlZGl0OiAnQGZsb2F0KDEsIDQsIDEsIDEpJyxcclxuICAgIGdyYWRlOiAnQGludGVnZXIoNjAsIDEwMCknLFxyXG4gICAgZ3BhOiAnQGZsb2F0KDEsIDQsIDIsIDIpJyxcclxuICAgIHNlbWVzdGVyOiAnQHBpY2soW1wiMjAyMy0yMDI0LTFcIiwgXCIyMDIzLTIwMjQtMlwiXSknLFxyXG4gICAgdHlwZTogJ0BwaWNrKFtcIlx1NUZDNVx1NEZFRVwiLCBcIlx1OTAwOVx1NEZFRVwiXSknXHJcbiAgfV1cclxufSlcclxuXHJcbi8vIEdQQVx1NzZGOFx1NTE3M01vY2sgLSBcdTU0MENcdTY1RjZcdTY1MkZcdTYzMDEgL2FwaS9jYW1wdXMvZ3BhIFx1NTQ4QyAvY2FtcHVzL2dwYVxyXG5Nb2NrLm1vY2soL1xcL2FwaVxcL2NhbXB1c1xcL2dwYXxjYW1wdXNcXC9ncGEvLCAnZ2V0Jywge1xyXG4gIGNvZGU6IDIwMCxcclxuICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgZGF0YToge1xyXG4gICAgdG90YWxHUEE6ICdAZmxvYXQoMi41LCA0LjAsIDIsIDIpJyxcclxuICAgIHRvdGFsQ3JlZGl0czogJ0BpbnRlZ2VyKDEyMCwgMTYwKScsXHJcbiAgICBzZW1lc3RlckdQQToge1xyXG4gICAgICAnMjAyMy0yMDI0LTEnOiAnQGZsb2F0KDIuOCwgNC4wLCAyLCAyKScsXHJcbiAgICAgICcyMDIzLTIwMjQtMic6ICdAZmxvYXQoMi44LCA0LjAsIDIsIDIpJyxcclxuICAgICAgJzIwMjItMjAyMy0xJzogJ0BmbG9hdCgyLjgsIDQuMCwgMiwgMiknLFxyXG4gICAgICAnMjAyMi0yMDIzLTInOiAnQGZsb2F0KDIuOCwgNC4wLCAyLCAyKSdcclxuICAgIH1cclxuICB9XHJcbn0pXHJcblxyXG4vLyBcdTU2RkVcdTRFNjZcdTk5ODZcdTc2RjhcdTUxNzNNb2NrXHJcbk1vY2subW9jaygnL2FwaS9saWJyYXJ5L2Jvb2tzJywgJ2dldCcsIHtcclxuICBjb2RlOiAyMDAsXHJcbiAgbWVzc2FnZTogJ3N1Y2Nlc3MnLFxyXG4gICdkYXRhfDEwLTIwJzogW3tcclxuICAgIGlkOiAnQGlkJyxcclxuICAgIHRpdGxlOiAnQGN0aXRsZSg1LCAxNSknLFxyXG4gICAgYXV0aG9yOiAnQGNuYW1lJyxcclxuICAgIHB1Ymxpc2hlcjogJ0BjdGl0bGUoMywgOClcdTUxRkFcdTcyNDhcdTc5M0UnLFxyXG4gICAgaXNibjogJ0BzdHJpbmcoXCJudW1iZXJcIiwgMTMpJyxcclxuICAgICdhdmFpbGFibGV8MSc6IFt0cnVlLCBmYWxzZV0sXHJcbiAgICBsb2NhdGlvbjogJ0BwaWNrKFtcIkFcdTUzM0FcIiwgXCJCXHU1MzNBXCIsIFwiQ1x1NTMzQVwiXSlAaW50ZWdlcigxLCA1KVx1NjdCNicsXHJcbiAgICBwdWJsaXNoRGF0ZTogJ0BkYXRlJ1xyXG4gIH1dXHJcbn0pXHJcblxyXG5Nb2NrLm1vY2soJy9hcGkvbGlicmFyeS9ib3Jyb3dlZCcsICdnZXQnLCB7XHJcbiAgY29kZTogMjAwLFxyXG4gIG1lc3NhZ2U6ICdzdWNjZXNzJyxcclxuICAnZGF0YXwzLTUnOiBbe1xyXG4gICAgaWQ6ICdAaWQnLFxyXG4gICAgYm9va1RpdGxlOiAnQGN0aXRsZSg1LCAxNSknLFxyXG4gICAgYXV0aG9yOiAnQGNuYW1lJyxcclxuICAgIGJvcnJvd0RhdGU6ICdAZGF0ZScsXHJcbiAgICByZXR1cm5EYXRlOiAnQGRhdGUnLFxyXG4gICAgJ3JlbmV3YWJsZXwxJzogW3RydWUsIGZhbHNlXVxyXG4gIH1dXHJcbn0pXHJcblxyXG4vLyBcdTY1NTlcdTVCQTRcdTk4ODRcdTdFQTZcdTc2RjhcdTUxNzNNb2NrXHJcbk1vY2subW9jaygnL2FwaS9jbGFzc3Jvb20vYnVpbGRpbmdzJywgJ2dldCcsIHtcclxuICBjb2RlOiAyMDAsXHJcbiAgbWVzc2FnZTogJ3N1Y2Nlc3MnLFxyXG4gICdkYXRhfDMnOiBbe1xyXG4gICAgaWQ6ICdAaWQnLFxyXG4gICAgbmFtZTogJ0BwaWNrKFtcIlx1NjU1OVx1NUI2Nlx1Njk3Q0FcIiwgXCJcdTY1NTlcdTVCNjZcdTY5N0NCXCIsIFwiXHU1QjlFXHU5QThDXHU2OTdDXCJdKScsXHJcbiAgICAnY2xhc3Nyb29tc3w1LTEwJzogW3tcclxuICAgICAgaWQ6ICdAaWQnLFxyXG4gICAgICByb29tTnVtYmVyOiAnQGludGVnZXIoMTAxLCA0MDUpJyxcclxuICAgICAgJ2NhcGFjaXR5fDMwLTEyMCc6IDYwLFxyXG4gICAgICAndHlwZXwxJzogWydcdTU5MUFcdTVBOTJcdTRGNTNcdTY1NTlcdTVCQTQnLCAnXHU2NjZFXHU5MDFBXHU2NTU5XHU1QkE0JywgJ1x1NUI5RVx1OUE4Q1x1NUJBNCddLFxyXG4gICAgICAnZXF1aXBtZW50fDEtMyc6IFsnXHU2Mjk1XHU1RjcxXHU0RUVBJywgJ1x1OTdGM1x1NTRDRCcsICdcdTc1MzVcdTgxMTEnXSxcclxuICAgICAgJ2F2YWlsYWJsZXwxJzogW3RydWUsIGZhbHNlXVxyXG4gICAgfV1cclxuICB9XVxyXG59KVxyXG5cclxuTW9jay5tb2NrKCcvYXBpL2NsYXNzcm9vbS9hcHBvaW50bWVudHMnLCAnZ2V0Jywge1xyXG4gIGNvZGU6IDIwMCxcclxuICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgJ2RhdGF8NS0xMCc6IFt7XHJcbiAgICBpZDogJ0BpZCcsXHJcbiAgICBjbGFzc3Jvb21JZDogJ0BpZCcsXHJcbiAgICBidWlsZGluZ05hbWU6ICdAcGljayhbXCJcdTY1NTlcdTVCNjZcdTY5N0NBXCIsIFwiXHU2NTU5XHU1QjY2XHU2OTdDQlwiXSknLFxyXG4gICAgcm9vbU51bWJlcjogJ0BpbnRlZ2VyKDEwMSwgNDA1KScsXHJcbiAgICBkYXRlOiAnQGRhdGUnLFxyXG4gICAgJ3N0YXJ0VGltZXwxJzogWycwODowMCcsICcxMDowMCcsICcxNDowMCcsICcxNjowMCddLFxyXG4gICAgJ2VuZFRpbWV8MSc6IFsnMTA6MDAnLCAnMTI6MDAnLCAnMTY6MDAnLCAnMTg6MDAnXSxcclxuICAgIHB1cnBvc2U6ICdAY3RpdGxlKDUsIDEwKScsXHJcbiAgICBzdGF0dXM6ICdAcGljayhbXCJwZW5kaW5nXCIsIFwiYXBwcm92ZWRcIiwgXCJyZWplY3RlZFwiXSknXHJcbiAgfV1cclxufSlcclxuXHJcbi8vIFx1NjgyMVx1NTZFRFx1NTczMFx1NTZGRVx1NjU3MFx1NjM2RSAtIFx1OUVEMVx1OUY5OVx1NkM1Rlx1NzlEMVx1NjI4MFx1NTkyN1x1NUI2Nlx1RkYwOFx1NTc1MFx1NjgwN1x1NURGMlx1NjgzOVx1NjM2RVx1OUFEOFx1NUZCN1x1NTczMFx1NTZGRVx1NUI5RVx1OTY0NVx1NEY0RFx1N0Y2RVx1NjgyMVx1NTFDNlx1RkYwOVxyXG4vLyBcdTVCNjZcdTY4MjFcdTU3MzBcdTU3NDBcdUZGMUFcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3XHJcbi8vIFx1NTdGQVx1NTFDNlx1NTc1MFx1NjgwN1x1RkYwOFx1OUFEOFx1NUZCN1x1NTczMFx1NTZGRVx1NEUzQlx1NEY0RFx1N0Y2RVx1RkYwOVx1RkYxQTEyNi42NTQxMTEsIDQ1LjgxOTc1MVxyXG5jb25zdCBjYW1wdXNNYXBEYXRhID0ge1xyXG4gIGJ1aWxkaW5nczogW1xyXG4gICAgLy8gXHU4ODRDXHU2NTNGXHU1MjlFXHU1MTZDXHU1MzNBXHVGRjA4XHU2ODIxXHU1NkVEXHU0RTJEXHU1RkMzXHU1MDRGXHU1MzE3XHVGRjA5XHJcbiAgICB7XHJcbiAgICAgIGlkOiAnMScsXHJcbiAgICAgIG5hbWU6ICdcdTRFM0JcdTY5N0NcdUZGMDhcdTg4NENcdTY1M0ZcdTUyOUVcdTUxNkNcdTY5N0NcdUZGMDknLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAndGVhY2hpbmcnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTQxMTEsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTk3NTEsXHJcbiAgICAgIHRhZ3M6IFsnXHU1MjlFXHU1MTZDJywgJ1x1ODg0Q1x1NjUzRicsICdcdTRGMUFcdThCQUUnXSxcclxuICAgICAgb3BlblRpbWU6ICcwODowMCAtIDE3OjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzAxJyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTVCNjZcdTY4MjFcdTRFM0JcdTUyOUVcdTUxNkNcdTY5N0NcdUZGMENcdThCQkVcdTY3MDlcdTY4MjFcdTk1N0ZcdTUyOUVcdTUxNkNcdTVCQTRcdTMwMDFcdTY1NTlcdTUyQTFcdTU5MDRcdTMwMDFcdTVCNjZcdTc1MUZcdTU5MDRcdTdCNDlcdTg4NENcdTY1M0ZcdTkwRThcdTk1RThcdTMwMDInXHJcbiAgICB9LFxyXG4gICAgLy8gXHU2NTU5XHU1QjY2XHU1MzNBXHVGRjA4XHU2ODIxXHU1NkVEXHU0RTJEXHU5MEU4XHVGRjA5XHJcbiAgICB7XHJcbiAgICAgIGlkOiAnMicsXHJcbiAgICAgIG5hbWU6ICdcdTdCMkNcdTRFMDBcdTY1NTlcdTVCNjZcdTY5N0MnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAndGVhY2hpbmcnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTIyMzIsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTk1MDEsXHJcbiAgICAgIHRhZ3M6IFsnXHU0RTBBXHU4QkZFJywgJ1x1ODFFQVx1NEU2MCcsICdcdTgwMDNcdThCRDUnXSxcclxuICAgICAgb3BlblRpbWU6ICcwNjowMCAtIDIyOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzAyJyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTVCNjZcdTY4MjFcdTRFM0JcdTg5ODFcdTY1NTlcdTVCNjZcdTY5N0NcdTRFNEJcdTRFMDBcdUZGMENcdTYyRTVcdTY3MDlcdTU5MUFcdTVBOTJcdTRGNTNcdTY1NTlcdTVCQTQ4MFx1OTVGNFx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnMycsXHJcbiAgICAgIG5hbWU6ICdcdTdCMkNcdTRFOENcdTY1NTlcdTVCNjZcdTY5N0MnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAndGVhY2hpbmcnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTI4OTYsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTgzMTMsXHJcbiAgICAgIHRhZ3M6IFsnXHU0RTBBXHU4QkZFJywgJ1x1ODFFQVx1NEU2MCcsICdcdTgwMDNcdThCRDUnXSxcclxuICAgICAgb3BlblRpbWU6ICcwNjowMCAtIDIyOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzAzJyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTVCNjZcdTY4MjFcdTRFM0JcdTg5ODFcdTY1NTlcdTVCNjZcdTY5N0NcdTRFNEJcdTRFMDBcdUZGMENcdTkxNERcdTU5MDdcdTczQjBcdTRFRTNcdTUzMTZcdTY1NTlcdTVCNjZcdThCQkVcdTU5MDdcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzQnLFxyXG4gICAgICBuYW1lOiAnXHU3N0ZGXHU0RTFBXHU1REU1XHU3QTBCXHU1QjlFXHU5QThDXHU2OTdDJyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ3RlYWNoaW5nJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUxMTA5LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE2ODAzLFxyXG4gICAgICB0YWdzOiBbJ1x1NUI5RVx1OUE4QycsICdcdTc5RDFcdTc4MTQnLCAnXHU3N0ZGXHU0RTFBJ10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAyMjowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMwNCcsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU3N0ZGXHU0RTFBXHU1REU1XHU3QTBCXHU0RTEzXHU0RTFBXHU1QjlFXHU5QThDXHU2OTdDXHVGRjBDXHU5MTREXHU1OTA3XHU5MUM3XHU3N0ZGXHUzMDAxXHU1Qjg5XHU1MTY4XHU3QjQ5XHU0RTEzXHU0RTFBXHU1QjlFXHU5QThDXHU1QkE0XHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICc1JyxcclxuICAgICAgbmFtZTogJ1x1NjczQVx1NzUzNVx1NURFNVx1N0EwQlx1NUI5RVx1OUE4Q1x1Njk3QycsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICd0ZWFjaGluZycsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1MTEyNCxcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgxNzE3OCxcclxuICAgICAgdGFnczogWydcdTVCOUVcdTlBOEMnLCAnXHU3OUQxXHU3ODE0JywgJ1x1NjczQVx1NzUzNSddLFxyXG4gICAgICBvcGVuVGltZTogJzA4OjAwIC0gMjI6MDAnLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzMDUnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NjczQVx1NzUzNVx1NURFNVx1N0EwQlx1NEUxM1x1NEUxQVx1NUI5RVx1OUE4Q1x1Njk3Q1x1RkYwQ1x1OTE0RFx1NTkwN1x1NjczQVx1NjhCMFx1MzAwMVx1NzUzNVx1NkMxNFx1N0I0OVx1NEUxM1x1NEUxQVx1NUI5RVx1OUE4Q1x1NUJBNFx1MzAwMidcclxuICAgIH0sXHJcbiAgICAvLyBcdTU2RkVcdTRFNjZcdTk5ODZcdUZGMDhcdTY4MjFcdTU2RURcdTRFMkRcdTVGQzNcdUZGMDlcclxuICAgIHtcclxuICAgICAgaWQ6ICc2JyxcclxuICAgICAgbmFtZTogJ1x1NTZGRVx1NEU2Nlx1OTk4NicsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdsaWJyYXJ5JyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjU0MzE1LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE5Nzk4LFxyXG4gICAgICB0YWdzOiBbJ1x1NTAxRlx1OTYwNScsICdcdTgxRUFcdTRFNjAnLCAnXHU3NTM1XHU1QjUwXHU4RDQ0XHU2RTkwJ10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDc6MDAgLSAyMjozMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMwNicsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1QjY2XHU2ODIxXHU1NkZFXHU0RTY2XHU5OTg2XHVGRjBDXHU2MDNCXHU1RUZBXHU3QjUxXHU5NzYyXHU3OUVGMzE2NTRcdTVFNzNcdTY1QjlcdTdDNzNcdUZGMENcdTg1Q0ZcdTRFNjYxODVcdTRFMDdcdTUxOENcdUZGMENcdTYzRDBcdTRGOUJcdTgxRUFcdTRFNjBcdTVFQTdcdTRGNEQyMDAwXHU0RTJBXHUzMDAyXHU1NkZFXHU0RTY2XHU5OTg2XHU2NTM5XHU5MDIwXHU1REU1XHU3QTBCXHU2QjYzXHU1NzI4XHU2NzA5XHU1RThGXHU2M0E4XHU4RkRCXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIC8vIFx1OThERlx1NTgwMlx1NTMzQVx1RkYwOFx1NjgyMVx1NTZFRFx1NEUxQ1x1OTBFOFx1RkYwOVxyXG4gICAge1xyXG4gICAgICBpZDogJzcnLFxyXG4gICAgICBuYW1lOiAnXHU3QjJDXHU0RTAwXHU5OERGXHU1ODAyXHVGRjA4XHU1QjY2XHU3NTFGXHU0RTAwXHU5OTEwXHU1Mzg1L1x1NkM4MVx1ODJCM1x1NTZFRFx1RkYwOScsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdkaW5pbmcnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTU0MzcsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MjA3MTEsXHJcbiAgICAgIHRhZ3M6IFsnXHU5OTEwXHU5OTZFJywgJ1x1NjVFOVx1OTkxMCcsICdcdTUzNDhcdTk5MTAnLCAnXHU2NjVBXHU5OTEwJ10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDY6MzAgLSAyMTowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMwNycsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1QjY2XHU2ODIxXHU3QjJDXHU0RTAwXHU5OERGXHU1ODAyXHVGRjA4XHU2QzgxXHU4MkIzXHU1NkVEXHVGRjA5XHVGRjBDXHU2M0QwXHU0RjlCXHU1NDA0XHU3QzdCXHU0RTJEXHU1RjBGXHU1RkVCXHU5OTEwXHUzMDAxXHU5NzYyXHU5OERGXHUzMDAxXHU1QzBGXHU1NDAzXHU3QjQ5XHUzMDAyXHU5OERGXHU1ODAyXHU3M0FGXHU1ODgzXHU2NjNFXHU4NDU3XHU2M0QwXHU1MzQ3XHVGRjBDXHU4M0RDXHU1NEMxXHU3OUNEXHU3QzdCXHU0RTMwXHU1QkNDXHU1OTFBXHU2ODM3XHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICc4JyxcclxuICAgICAgbmFtZTogJ1x1N0IyQ1x1NEU4Q1x1OThERlx1NTgwMlx1RkYwOFx1NUI2Nlx1NzUxRlx1NEU4Q1x1OTkxMFx1NTM4NS9cdTc3RTVcdTU0NzNcdTU2RURcdUZGMDknLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnZGluaW5nJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUzMTk5LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE2NzMyLFxyXG4gICAgICB0YWdzOiBbJ1x1OTkxMFx1OTk2RScsICdcdTVDMEZcdTcwOTInLCAnXHU3Mjc5XHU4MjcyXHU4M0RDJ10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDY6MzAgLSAyMTowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMwOCcsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1QjY2XHU2ODIxXHU3QjJDXHU0RThDXHU5OERGXHU1ODAyXHVGRjA4XHU3N0U1XHU1NDczXHU1NkVEXHVGRjA5XHVGRjBDXHU0RUU1XHU3M0IwXHU3MDkyXHU1QzBGXHU3MDkyXHU1NDhDXHU3Mjc5XHU4MjcyXHU4M0RDXHU1NEMxXHU0RTNBXHU0RTNCXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICc5JyxcclxuICAgICAgbmFtZTogJ1x1NjU1OVx1NURFNVx1OTkxMFx1NTM4NScsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdkaW5pbmcnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTI1NTcsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTk1NjcsXHJcbiAgICAgIHRhZ3M6IFsnXHU5OTEwXHU5OTZFJywgJ1x1NjU1OVx1NURFNScsICdcdTgxRUFcdTUyQTlcdTk5MTAnXSxcclxuICAgICAgb3BlblRpbWU6ICcxMTowMCAtIDEzOjAwLCAxNzowMCAtIDE5OjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzA5JyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTY1NTlcdTVERTVcdTRFMTNcdTc1MjhcdTk5MTBcdTUzODVcdUZGMENcdTYzRDBcdTRGOUJcdTgxRUFcdTUyQTlcdTk5MTBcdTY3MERcdTUyQTFcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzEwJyxcclxuICAgICAgbmFtZTogJ1x1N0IyQ1x1NEUwOVx1OThERlx1NTgwMlx1RkYwOFx1NkM4MVx1OTk5OVx1NTZFRFx1RkYwOScsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTdDRDZcdTUzODJcdTg4NTc1XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdkaW5pbmcnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTE4MTYsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTc4OTIsXHJcbiAgICAgIHRhZ3M6IFsnXHU5OTEwXHU5OTZFJywgJ1x1NUZFQlx1OTkxMCcsICdcdTVDMEZcdTU0MDMnXSxcclxuICAgICAgb3BlblRpbWU6ICcwNjozMCAtIDIxOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzEwJyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTVCNjZcdTY4MjFcdTdCMkNcdTRFMDlcdTk4REZcdTU4MDJcdUZGMDhcdTZDODFcdTk5OTlcdTU2RURcdUZGMDlcdUZGMENcdTYzRDBcdTRGOUJcdTU0MDRcdTdDN0JcdTVGRUJcdTk5MTBcdTU0OENcdTVDMEZcdTU0MDNcdTMwMDInXHJcbiAgICB9LFxyXG4gICAgLy8gXHU1QkJGXHU4MjBEXHU1MzNBXHVGRjA4XHU2ODIxXHU1NkVEXHU1MzU3XHU5MEU4XHVGRjA5XHJcbiAgICB7XHJcbiAgICAgIGlkOiAnMTEnLFxyXG4gICAgICBuYW1lOiAnXHU1QjY2XHU3NTFGXHU1MTZDXHU1QkQzMVx1NTNGN1x1Njk3QycsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdkb3JtaXRvcnknLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTQ4MTgsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTc2ODksXHJcbiAgICAgIHRhZ3M6IFsnXHU0RjRGXHU1QkJGJywgJ1x1NzUxRlx1NkQzQiddLFxyXG4gICAgICBvcGVuVGltZTogJ1x1NTE2OFx1NTkyOScsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMxMScsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU3NTM3XHU3NTFGXHU1MTZDXHU1QkQzXHU2OTdDXHVGRjBDXHU1M0VGXHU1QkI5XHU3RUIzMTIwMFx1NTQwRFx1NUI2Nlx1NzUxRlx1MzAwMlx1NEY0Rlx1NUJCRlx1OEQzOVx1RkYxQVx1NTZEQlx1NEVCQVx1OTVGNDEyMDBcdTUxNDMvXHU1RTc0XHVGRjBDXHU1MTZEXHU0RUJBXHU5NUY0ODAwXHU1MTQzL1x1NUU3NFx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnMTInLFxyXG4gICAgICBuYW1lOiAnXHU1QjY2XHU3NTFGXHU1MTZDXHU1QkQzMlx1NTNGN1x1Njk3QycsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdkb3JtaXRvcnknLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTU4MTgsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTcxODksXHJcbiAgICAgIHRhZ3M6IFsnXHU0RjRGXHU1QkJGJywgJ1x1NzUxRlx1NkQzQiddLFxyXG4gICAgICBvcGVuVGltZTogJ1x1NTE2OFx1NTkyOScsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMxMicsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU3NTM3XHU3NTFGXHU1MTZDXHU1QkQzXHU2OTdDXHVGRjBDXHU1M0VGXHU1QkI5XHU3RUIzMTIwMFx1NTQwRFx1NUI2Nlx1NzUxRlx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnMTMnLFxyXG4gICAgICBuYW1lOiAnXHU1QjY2XHU3NTFGXHU1MTZDXHU1QkQzM1x1NTNGN1x1Njk3QycsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdkb3JtaXRvcnknLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTY4MTgsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTc2ODksXHJcbiAgICAgIHRhZ3M6IFsnXHU0RjRGXHU1QkJGJywgJ1x1NzUxRlx1NkQzQiddLFxyXG4gICAgICBvcGVuVGltZTogJ1x1NTE2OFx1NTkyOScsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMxMycsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1OTczXHU3NTFGXHU1MTZDXHU1QkQzXHU2OTdDXHVGRjBDXHU1M0VGXHU1QkI5XHU3RUIzMTAwMFx1NTQwRFx1NUI2Nlx1NzUxRlx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnMTQnLFxyXG4gICAgICBuYW1lOiAnXHU1QjY2XHU3NTFGXHU1MTZDXHU1QkQzNFx1NTNGN1x1Njk3Q1x1RkYwOFx1N0IyQ1x1NTZEQlx1NUI2Nlx1NzUxRlx1NTE2Q1x1NUJEM1x1RkYwOScsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdkb3JtaXRvcnknLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTQ4MTgsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTc2ODksXHJcbiAgICAgIHRhZ3M6IFsnXHU0RjRGXHU1QkJGJywgJ1x1NzUxRlx1NkQzQiddLFxyXG4gICAgICBvcGVuVGltZTogJ1x1NTE2OFx1NTkyOScsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMxNCcsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1OTczXHU3NTFGXHU1MTZDXHU1QkQzXHU2OTdDXHVGRjBDXHU1M0VGXHU1QkI5XHU3RUIzMTAwMFx1NTQwRFx1NUI2Nlx1NzUxRlx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnMTUnLFxyXG4gICAgICBuYW1lOiAnXHU1QjY2XHU3NTFGXHU1MTZDXHU1QkQzNVx1NTNGN1x1Njk3QycsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdkb3JtaXRvcnknLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTc4MTgsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTcxODksXHJcbiAgICAgIHRhZ3M6IFsnXHU0RjRGXHU1QkJGJywgJ1x1NzUxRlx1NkQzQiddLFxyXG4gICAgICBvcGVuVGltZTogJ1x1NTE2OFx1NTkyOScsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMxNScsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1QjY2XHU3NTFGXHU1MTZDXHU1QkQzXHU2OTdDXHVGRjBDXHU1M0VGXHU1QkI5XHU3RUIzODAwXHU1NDBEXHU1QjY2XHU3NTFGXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICcxNicsXHJcbiAgICAgIG5hbWU6ICdcdTVCNjZcdTc1MUZcdTUxNkNcdTVCRDM2XHU1M0Y3XHU2OTdDJyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ2Rvcm1pdG9yeScsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1ODgxOCxcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgxNzY4OSxcclxuICAgICAgdGFnczogWydcdTRGNEZcdTVCQkYnLCAnXHU3NTFGXHU2RDNCJ10sXHJcbiAgICAgIG9wZW5UaW1lOiAnXHU1MTY4XHU1OTI5JyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzE2JyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTVCNjZcdTc1MUZcdTUxNkNcdTVCRDNcdTY5N0NcdUZGMENcdTUzRUZcdTVCQjlcdTdFQjM4MDBcdTU0MERcdTVCNjZcdTc1MUZcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzE3JyxcclxuICAgICAgbmFtZTogJ1x1NEVCQVx1NjI0RFx1NTE2Q1x1NUJEMycsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdkb3JtaXRvcnknLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTk4MTgsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTgxODksXHJcbiAgICAgIHRhZ3M6IFsnXHU0RjRGXHU1QkJGJywgJ1x1NEVCQVx1NjI0RCcsICdcdTY1NTlcdTVFMDgnXSxcclxuICAgICAgb3BlblRpbWU6ICdcdTUxNjhcdTU5MjknLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzMTcnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1OUFEOFx1NjgwN1x1NTFDNlwiXHU2QzVGXHU2NjZGXHU2MjNGXCJcdTRFQkFcdTYyNERcdTUxNkNcdTVCRDNcdUZGMENcdTRFM0FcdTVGMTVcdThGREJcdTUzNUFcdTU4RUJcdTY1NTlcdTVFMDhcdTYzRDBcdTRGOUJcdTgyMTJcdTkwMDJcdTMwMDFcdTZFMjlcdTk5QThcdTc2ODRcdTVDNDVcdTRGNEZcdTY3NjFcdTRFRjZcdUZGMENcdTUyQTlcdTUyOUJcdTVCNjZcdTY4MjFcdTVGMTVcdTYyNERcdTVERTVcdTRGNUNcdTMwMDInXHJcbiAgICB9LFxyXG4gICAgLy8gXHU4RkQwXHU1MkE4XHU1NzNBXHU5OTg2XHVGRjA4XHU2ODIxXHU1NkVEXHU4OTdGXHU5MEU4XHU1NDhDXHU1MzE3XHU5MEU4XHVGRjA5XHJcbiAgICB7XHJcbiAgICAgIGlkOiAnMTgnLFxyXG4gICAgICBuYW1lOiAnXHU0RjUzXHU4MEIyXHU5OTg2JyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ3Nwb3J0cycsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1Mjg2NixcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgxNzI2MSxcclxuICAgICAgdGFnczogWydcdThGRDBcdTUyQTgnLCAnXHU3QkVFXHU3NDAzJywgJ1x1N0ZCRFx1NkJEQlx1NzQwMycsICdcdTRFNTJcdTRFNTNcdTc0MDMnXSxcclxuICAgICAgb3BlblRpbWU6ICcwODowMCAtIDIxOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzE4JyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTVCNjZcdTY4MjFcdTRGNTNcdTgwQjJcdTk5ODZcdUZGMENcdThCQkVcdTY3MDlcdTdCRUVcdTc0MDNcdTU3M0FcdTMwMDFcdTdGQkRcdTZCREJcdTc0MDNcdTU3M0FcdTMwMDFcdTRFNTJcdTRFNTNcdTc0MDNcdTU3M0FcdTdCNDlcdTVCQTRcdTUxODVcdThGRDBcdTUyQThcdTU3M0FcdTU3MzBcdTMwMDJcdTdCRUVcdTc0MDNcdTk5ODZcdTVERjJcdTVCOENcdTYyMTBcdTUzNDdcdTdFQTdcdTY1MzlcdTkwMjBcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzE5JyxcclxuICAgICAgbmFtZTogJ1x1NzUzMFx1NUY4NFx1OEZEMFx1NTJBOFx1NTczQScsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdzcG9ydHMnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTE4NjYsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTYyNjEsXHJcbiAgICAgIHRhZ3M6IFsnXHU4RkQwXHU1MkE4JywgJ1x1OEREMVx1NkI2NScsICdcdThEQjNcdTc0MDMnXSxcclxuICAgICAgb3BlblRpbWU6ICcwNjowMCAtIDIyOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzE5JyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTY4MDdcdTUxQzY0MDBcdTdDNzNcdTU4NTFcdTgwRjZcdTc1MzBcdTVGODRcdTU3M0FcdUZGMENcdThCQkVcdTY3MDlcdThEQjNcdTc0MDNcdTU3M0FcdTU0OENcdThERDFcdTkwNTNcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzIwJyxcclxuICAgICAgbmFtZTogJ1x1NkUzOFx1NkNGM1x1OTk4NicsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdzcG9ydHMnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTMwNTcsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTkyMDksXHJcbiAgICAgIHRhZ3M6IFsnXHU4RkQwXHU1MkE4JywgJ1x1NkUzOFx1NkNGMycsICdcdTUwNjVcdThFQUInXSxcclxuICAgICAgb3BlblRpbWU6ICcwOTowMCAtIDIxOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzIwJyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTVCNjZcdTY4MjFcdTZFMzhcdTZDRjNcdTk5ODZcdUZGMENcdThCQkVcdTY3MDlcdTY4MDdcdTUxQzZcdTZDRjNcdTZDNjBcdTU0OENcdTUwNjVcdThFQUJcdTYyM0ZcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzIxJyxcclxuICAgICAgbmFtZTogJ1x1NkMxNFx1NjM5Mlx1NzQwM1x1OTk4NicsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdzcG9ydHMnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTA4NjYsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTcyNjEsXHJcbiAgICAgIHRhZ3M6IFsnXHU4RkQwXHU1MkE4JywgJ1x1NkMxNFx1NjM5Mlx1NzQwMycsICdcdTRGNTNcdTgwQjInXSxcclxuICAgICAgb3BlblRpbWU6ICcwODowMCAtIDIxOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzIxJyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTRFMTNcdTRFMUFcdTZDMTRcdTYzOTJcdTc0MDNcdTk5ODZcdUZGMENcdTdFQ0ZcdThGQzdcdTY1MzlcdTkwMjBcdTUzNDdcdTdFQTdcdUZGMENcdThCQkVcdTY1QkRcdTVCOENcdTU1ODRcdUZGMENcdTRFM0FcdTVFMDhcdTc1MUZcdTRGNTNcdTgwQjJcdTk1M0JcdTcwQkNcdTYzRDBcdTRGOUJcdTRGMThcdThEMjhcdTU3M0FcdTU3MzBcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzIyJyxcclxuICAgICAgbmFtZTogJ1x1N0ZCRFx1NkJEQlx1NzQwM1x1OTk4NicsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdzcG9ydHMnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTA4NjYsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTUyNjEsXHJcbiAgICAgIHRhZ3M6IFsnXHU4RkQwXHU1MkE4JywgJ1x1N0ZCRFx1NkJEQlx1NzQwMycsICdcdTRGNTNcdTgwQjInXSxcclxuICAgICAgb3BlblRpbWU6ICcwODowMCAtIDIxOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzIyJyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTdGQkRcdTZCREJcdTc0MDNcdTk5ODZcdUZGMENcdTZCNjNcdTU3MjhcdTY3MDlcdTVFOEZcdTYzQThcdThGREJcdTY1MzlcdTkwMjBcdTUzNDdcdTdFQTdcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzIzJyxcclxuICAgICAgbmFtZTogJ1x1N0Y1MVx1NzQwM1x1NTczQScsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdzcG9ydHMnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTE4NjYsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTgyNjEsXHJcbiAgICAgIHRhZ3M6IFsnXHU4RkQwXHU1MkE4JywgJ1x1N0Y1MVx1NzQwMycsICdcdTRGNTNcdTgwQjInXSxcclxuICAgICAgb3BlblRpbWU6ICcwNjowMCAtIDIyOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzIzJyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTVCNjZcdTY4MjFcdTdGNTFcdTc0MDNcdTU3M0FcdUZGMENcdTRFM0FcdTVCNjZcdTc1MUZcdTYzRDBcdTRGOUJcdTdGNTFcdTc0MDNcdThGRDBcdTUyQThcdTU3M0FcdTU3MzBcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzI0JyxcclxuICAgICAgbmFtZTogJ1x1NTg1MVx1ODBGNlx1NjRDRFx1NTczQScsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdzcG9ydHMnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTE4NjYsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTUyNjEsXHJcbiAgICAgIHRhZ3M6IFsnXHU4RkQwXHU1MkE4JywgJ1x1OEREMVx1NkI2NScsICdcdTUwNjVcdThFQUInXSxcclxuICAgICAgb3BlblRpbWU6ICcwNjowMCAtIDIyOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzI0JyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTVCNjZcdTY4MjFcdTU4NTFcdTgwRjZcdTY0Q0RcdTU3M0FcdUZGMENcdTRFM0FcdTVCNjZcdTc1MUZcdTYzRDBcdTRGOUJcdThERDFcdTZCNjVcdTU0OENcdTUwNjVcdThFQUJcdTU3M0FcdTU3MzBcdTMwMDInXHJcbiAgICB9LFxyXG4gICAgLy8gXHU1MzNCXHU3NTk3XHU2NzBEXHU1MkExXHVGRjA4XHU2ODIxXHU1NkVEXHU0RTFDXHU1MzE3XHU5MEU4XHVGRjA5XHJcbiAgICB7XHJcbiAgICAgIGlkOiAnMjUnLFxyXG4gICAgICBuYW1lOiAnXHU2ODIxXHU1MzNCXHU5NjYyJyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ21lZGljYWwnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTg3OTIsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MjA4MDksXHJcbiAgICAgIHRhZ3M6IFsnXHU1MzNCXHU3NTk3JywgJ1x1NjAyNVx1OEJDQScsICdcdTRGNTNcdTY4QzAnXSxcclxuICAgICAgb3BlblRpbWU6ICcyNFx1NUMwRlx1NjVGNicsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMyNScsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1QjY2XHU2ODIxXHU5NjQ0XHU1QzVFXHU1MzNCXHU5NjYyXHVGRjBDXHU2M0QwXHU0RjlCXHU2NUU1XHU1RTM4XHU4QkNBXHU3NTk3XHUzMDAxXHU2MDI1XHU4QkNBXHU1NDhDXHU0RjUzXHU2OEMwXHU2NzBEXHU1MkExXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIC8vIFx1NjcwRFx1NTJBMVx1OEJCRVx1NjVCRFx1RkYwOFx1NjgyMVx1NTZFRFx1NTQwNFx1NTMzQVx1NTdERlx1RkYwOVxyXG4gICAge1xyXG4gICAgICBpZDogJzI2JyxcclxuICAgICAgbmFtZTogJ1x1NTkyN1x1NUI2Nlx1NzUxRlx1NkQzQlx1NTJBOFx1NEUyRFx1NUZDMycsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdzZXJ2aWNlJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUxOTE5LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE4NzkzLFxyXG4gICAgICB0YWdzOiBbJ1x1NkQzQlx1NTJBOCcsICdcdTc5M0VcdTU2RTInLCAnXHU0RjFBXHU4QkFFJ10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAyMjowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMyNicsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1QjY2XHU3NTFGXHU2RDNCXHU1MkE4XHU0RTJEXHU1RkMzXHVGRjBDXHU4QkJFXHU2NzA5XHU2MkE1XHU1NDRBXHU1Mzg1XHUzMDAxXHU0RjFBXHU4QkFFXHU1QkE0XHUzMDAxXHU3OTNFXHU1NkUyXHU2RDNCXHU1MkE4XHU1QkE0XHU3QjQ5XHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICcyNycsXHJcbiAgICAgIG5hbWU6ICdcdTU5MjdcdTVCNjZcdTc1MUZcdTY3MERcdTUyQTFcdTRFMkRcdTVGQzMnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnc2VydmljZScsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1MjIzMixcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgxOTUwMSxcclxuICAgICAgdGFnczogWydcdTY3MERcdTUyQTEnLCAnXHU1NEE4XHU4QkUyJywgJ1x1NTI5RVx1NEU4QiddLFxyXG4gICAgICBvcGVuVGltZTogJzA4OjAwIC0gMTc6MDAnLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzMjcnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NjNEMFx1NEY5Qlx1NUI2Nlx1NzUxRlx1NEU4Qlx1NTJBMVx1NTI5RVx1NzQwNlx1MzAwMVx1NUMzMVx1NEUxQVx1NjMwN1x1NUJGQ1x1MzAwMVx1NUZDM1x1NzQwNlx1NTRBOFx1OEJFMlx1N0I0OVx1NjcwRFx1NTJBMVx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnMjgnLFxyXG4gICAgICBuYW1lOiAnXHU2ODIxXHU1NkVEXHU4RDg1XHU1RTAyXHVGRjA4XHU2NTU5XHU4MEIyXHU4RDg1XHU1RTAyXHVGRjA5JyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ3NlcnZpY2UnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTM1MjUsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTcyMjUsXHJcbiAgICAgIHRhZ3M6IFsnXHU4RDJEXHU3MjY5JywgJ1x1NjVFNVx1NzUyOFx1NTRDMScsICdcdTk2RjZcdTk4REYnXSxcclxuICAgICAgb3BlblRpbWU6ICcwNzowMCAtIDIzOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzI4JyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTY4MjFcdTU2RURcdThEODVcdTVFMDJcdUZGMENcdTYzRDBcdTRGOUJcdTY1RTVcdTc1MjhcdTU0QzFcdTMwMDFcdTk2RjZcdTk4REZcdTMwMDFcdTY1ODdcdTUxNzdcdTdCNDlcdTU1NDZcdTU0QzFcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzI5JyxcclxuICAgICAgbmFtZTogJ1x1NUZFQlx1OTAxMlx1NjcwRFx1NTJBMVx1NEUyRFx1NUZDMycsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdzZXJ2aWNlJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUzNzM3LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE3NTI5LFxyXG4gICAgICB0YWdzOiBbJ1x1NUZFQlx1OTAxMicsICdcdTUzRDZcdTRFRjYnLCAnXHU1QkM0XHU0RUY2J10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDk6MDAgLSAxOTowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMyOScsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU2ODIxXHU1NkVEXHU1RkVCXHU5MDEyXHU5NkM2XHU0RTJEXHU2NTM2XHU1M0QxXHU3MEI5XHVGRjBDXHU2NTJGXHU2MzAxXHU1NDA0XHU1OTI3XHU1RkVCXHU5MDEyXHU1MTZDXHU1M0Y4XHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICczMCcsXHJcbiAgICAgIG5hbWU6ICdcdTZEMTdcdTZENzRcdTRFMkRcdTVGQzMnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnc2VydmljZScsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1MzczNyxcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgxNzUyOSxcclxuICAgICAgdGFnczogWydcdTZEMTdcdTZENzQnLCAnXHU3MEVEXHU2QzM0JywgJ1x1NzUxRlx1NkQzQiddLFxyXG4gICAgICBvcGVuVGltZTogJzEwOjAwIC0gMjI6MDAnLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzMzAnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NUI2Nlx1NzUxRlx1NTE2Q1x1NTE3MVx1NkQxN1x1NkQ3NFx1NEUyRFx1NUZDM1x1RkYwQ1x1NjNEMFx1NEY5Qlx1NzBFRFx1NkMzNFx1NkRDQlx1NkQ3NFx1NjcwRFx1NTJBMVx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnMzEnLFxyXG4gICAgICBuYW1lOiAnXHU1RjAwXHU2QzM0XHU2MjNGJyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ3NlcnZpY2UnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTQ3MzcsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTcwMjksXHJcbiAgICAgIHRhZ3M6IFsnXHU3MEVEXHU2QzM0JywgJ1x1NUYwMFx1NkMzNCcsICdcdTc1MUZcdTZEM0InXSxcclxuICAgICAgb3BlblRpbWU6ICcwNjowMCAtIDIzOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzMxJyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTYzRDBcdTRGOUJcdTUxNERcdThEMzlcdTVGMDBcdTZDMzRcdTY3MERcdTUyQTFcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzMyJyxcclxuICAgICAgbmFtZTogJ1x1NzlEMVx1NjI4MFx1NTkyN1x1NTNBNicsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdzZXJ2aWNlJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUxOTE5LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE4NzkzLFxyXG4gICAgICB0YWdzOiBbJ1x1NzlEMVx1NzgxNCcsICdcdTUyOUVcdTUxNkMnLCAnXHU0RjFBXHU4QkFFJ10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAxNzowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMzMicsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU3OUQxXHU2MjgwXHU1OTI3XHU1M0E2XHVGRjBDXHU4QkJFXHU2NzA5XHU3OUQxXHU3ODE0XHU1QjlFXHU5QThDXHU1QkE0XHUzMDAxXHU1QjY2XHU2NzJGXHU2MkE1XHU1NDRBXHU1Mzg1XHU1NDhDXHU0RjFBXHU4QkFFXHU1QkE0XHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICczMycsXHJcbiAgICAgIG5hbWU6ICdcdTVCODlcdTUxNjhcdTRFMEVcdTVFOTRcdTYwMjVcdTdCQTFcdTc0MDZcdTVCOUVcdThERjVcdTVFNzNcdTUzRjBcdUZGMDhcdTc4QjNcdThDMzdcdTU5MjdcdTUzQTZcdUZGMDknLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAndGVhY2hpbmcnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTIzOTIsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MjM0MjQsXHJcbiAgICAgIHRhZ3M6IFsnXHU1QjlFXHU5QThDJywgJ1x1NzlEMVx1NzgxNCcsICdcdTVCODlcdTUxNjgnLCAnXHU1RTk0XHU2MDI1J10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAyMjowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMzMycsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXCJcdTUzNDFcdTU2REJcdTRFOTRcIlx1NjU1OVx1ODBCMlx1NUYzQVx1NTZGRFx1OTg3OVx1NzZFRVx1RkYwQzIwMjVcdTVFNzQ2XHU2NzA4XHU3QUUzXHU1REU1XHU2Mjk1XHU1MTY1XHU0RjdGXHU3NTI4XHUzMDAyXHU5ODc5XHU3NkVFXHU3NTI4XHU1NzMwXHU5NzYyXHU3OUVGMi4zMFx1NEUwN1x1NUU3M1x1NjVCOVx1N0M3M1x1RkYwQ1x1NUVGQVx1N0I1MVx1OTc2Mlx1NzlFRjIuNzBcdTRFMDdcdTVFNzNcdTY1QjlcdTdDNzNcdUZGMENcdTc1MjhcdTRFOEVcdTVCODlcdTUxNjhcdTRFMEVcdTVFOTRcdTYwMjVcdTdCQTFcdTc0MDZcdTVCOUVcdThERjVcdTY1NTlcdTVCNjZcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzM0JyxcclxuICAgICAgbmFtZTogJ1x1NUI2Nlx1NjgyMVx1NjJEQlx1NUY4NVx1NjI0MCcsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdzZXJ2aWNlJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjU4NjI1LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE5NjI1LFxyXG4gICAgICB0YWdzOiBbJ1x1NEY0Rlx1NUJCRicsICdcdTYzQTVcdTVGODUnLCAnXHU1QkJFXHU5OTg2J10sXHJcbiAgICAgIG9wZW5UaW1lOiAnXHU1MTY4XHU1OTI5JyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzM0JyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTVCNjZcdTY4MjFcdTYyREJcdTVGODVcdTYyNDBcdUZGMENcdTRFM0FcdTY3NjVcdThCQkZcdTRFQkFcdTU0NThcdTYzRDBcdTRGOUJcdTRGNEZcdTVCQkZcdTY3MERcdTUyQTFcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzM1JyxcclxuICAgICAgbmFtZTogJ1x1NTIxQlx1NjVCMFx1NTIxQlx1NEUxQVx1NUI2Nlx1OTY2MicsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdzZXJ2aWNlJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUxOTE5LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE4NzkzLFxyXG4gICAgICB0YWdzOiBbJ1x1NTIxQlx1NEUxQScsICdcdTUyMUJcdTY1QjAnLCAnXHU1Qjc1XHU1MzE2J10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAyMjowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMzNScsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1MjFCXHU2NUIwXHU1MjFCXHU0RTFBXHU1QjY2XHU5NjYyXHVGRjBDXHU0RTNBXHU1QjY2XHU3NTFGXHU2M0QwXHU0RjlCXHU1MjFCXHU0RTFBXHU2MzA3XHU1QkZDXHU1NDhDXHU1Qjc1XHU1MzE2XHU2NzBEXHU1MkExXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICczNicsXHJcbiAgICAgIG5hbWU6ICdcdTdGNTFcdTdFRENcdTRGRTFcdTYwNkZcdTRFMkRcdTVGQzMnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnc2VydmljZScsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1MDUyNSxcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgxNTkyNSxcclxuICAgICAgdGFnczogWydcdTdGNTFcdTdFREMnLCAnXHU0RkUxXHU2MDZGJywgJ1x1NjI4MFx1NjcyRiddLFxyXG4gICAgICBvcGVuVGltZTogJzA4OjAwIC0gMTc6MDAnLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzMzYnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1N0Y1MVx1N0VEQ1x1NEZFMVx1NjA2Rlx1NEUyRFx1NUZDM1x1RkYwQ1x1OEQxRlx1OEQyM1x1NjgyMVx1NTZFRFx1N0Y1MVx1N0VEQ1x1NUVGQVx1OEJCRVx1NTQ4Q1x1N0VGNFx1NjJBNFx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNzgnLFxyXG4gICAgICBuYW1lOiAnXHU3OUQxXHU2MjgwXHU1NkVEXHU2NzdFXHU1MzE3XHU1NkVEXHU1MzNBJyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjdcdTlFRDFcdTlGOTlcdTZDNUZcdTc5RDFcdTYyODBcdTU5MjdcdTVCNjYnLFxyXG4gICAgICBjYXRlZ29yeTogJ3NlcnZpY2UnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTIzNzEsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTU3MTEsXHJcbiAgICAgIHRhZ3M6IFsnXHU3OUQxXHU3ODE0JywgJ1x1NTZFRFx1NTMzQScsICdcdTUyMUJcdTY1QjAnXSxcclxuICAgICAgb3BlblRpbWU6ICcwODowMCAtIDE3OjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzc4JyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTlFRDFcdTlGOTlcdTZDNUZcdTc5RDFcdTYyODBcdTU5MjdcdTVCNjZcdTc5RDFcdTYyODBcdTU2RURcdTY3N0VcdTUzMTdcdTU2RURcdTUzM0FcdUZGMENcdTRGNERcdTRFOEVcdTY4MjFcdTU2RURcdTUxODVcdUZGMENcdTRFM0FcdTc5RDFcdTYyODBcdTYyMTBcdTY3OUNcdThGNkNcdTUzMTZcdTU0OENcdTRGMDFcdTRFMUFcdTVCNzVcdTUzMTZcdTYzRDBcdTRGOUJcdTY3MERcdTUyQTFcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzM3JyxcclxuICAgICAgbmFtZTogJ1x1OEQyMlx1NTJBMVx1NTkwNCcsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdzZXJ2aWNlJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjU0MTExLFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE5NzUxLFxyXG4gICAgICB0YWdzOiBbJ1x1OEQyMlx1NTJBMScsICdcdTdGMzRcdThEMzknLCAnXHU2MkE1XHU5NTAwJ10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAxNzowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMzNycsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1QjY2XHU2ODIxXHU4RDIyXHU1MkExXHU1OTA0XHVGRjBDXHU4RDFGXHU4RDIzXHU1QjY2XHU4RDM5XHU2NTM2XHU3RjM0XHUzMDAxXHU2MkE1XHU5NTAwXHU3QjQ5XHU4RDIyXHU1MkExXHU0RTFBXHU1MkExXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICczOCcsXHJcbiAgICAgIG5hbWU6ICdcdTRGRERcdTUzNkJcdTU5MDQnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnc2VydmljZScsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1ODc5MixcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgyMDgwOSxcclxuICAgICAgdGFnczogWydcdTVCODlcdTUxNjgnLCAnXHU0RkREXHU1MzZCJywgJ1x1OTVFOFx1Nzk4MSddLFxyXG4gICAgICBvcGVuVGltZTogJ1x1NTE2OFx1NTkyOScsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzMzOCcsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1QjY2XHU2ODIxXHU0RkREXHU1MzZCXHU1OTA0XHVGRjBDXHU4RDFGXHU4RDIzXHU2ODIxXHU1NkVEXHU1Qjg5XHU1MTY4XHU1NDhDXHU5NUU4XHU3OTgxXHU3QkExXHU3NDA2XHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICczOScsXHJcbiAgICAgIG5hbWU6ICdcdTU0MEVcdTUyRTRcdTdCQTFcdTc0MDZcdTU5MDQnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnc2VydmljZScsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1Nzc5MixcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgyMDMwOSxcclxuICAgICAgdGFnczogWydcdTU0MEVcdTUyRTQnLCAnXHU3RUY0XHU0RkVFJywgJ1x1NjcwRFx1NTJBMSddLFxyXG4gICAgICBvcGVuVGltZTogJzA4OjAwIC0gMTc6MDAnLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzMzknLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NUI2Nlx1NjgyMVx1NTQwRVx1NTJFNFx1N0JBMVx1NzQwNlx1NTkwNFx1RkYwQ1x1OEQxRlx1OEQyM1x1NjgyMVx1NTZFRFx1OEJCRVx1NjVCRFx1N0VGNFx1NjJBNFx1NTQ4Q1x1NTQwRVx1NTJFNFx1NEZERFx1OTY5Q1x1MzAwMlx1NTE2OFx1NjgyMTczXHU2ODBCXHU1RUZBXHU3QjUxXHU1REYyXHU1QjhDXHU2MjEwXHU1Qjg5XHU1MTY4XHU0RjUzXHU2OEMwXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIC8vIFx1NjU4N1x1NTMxNlx1NTczQVx1OTk4Nlx1RkYwOFx1NjgyMVx1NTZFRFx1NTMxN1x1OTBFOFx1RkYwOS0gXHU1NzMwXHU3N0ZGXHU2NTg3XHU1MzE2XHU1MzVBXHU3MjY5XHU5OTg2XHU0RTA5XHU5OTg2XHU1NDA4XHU0RTAwXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNDAnLFxyXG4gICAgICBuYW1lOiAnXHU1NzMwXHU3N0ZGXHU2NTg3XHU1MzE2XHU1MzVBXHU3MjY5XHU5OTg2JyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ3NlcnZpY2UnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTMzOTIsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MjI4MDksXHJcbiAgICAgIHRhZ3M6IFsnXHU1MzVBXHU3MjY5XHU5OTg2JywgJ1x1NjU4N1x1NTMxNicsICdcdTVDNTVcdTg5QzgnLCAnXHU0RTA5XHU5OTg2XHU1NDA4XHU0RTAwJ10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDk6MDAgLSAxMTozMFx1RkYwOFx1NjY5MVx1NjcxRlx1OTY1MFx1NjVGNlx1NUYwMFx1NjUzRVx1RkYwOScsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM0MCcsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU2MDNCXHU5NzYyXHU3OUVGXHU3RUE2NDQwMFx1NUU3M1x1NjVCOVx1N0M3M1x1RkYwQ1x1ODc4RFx1NjgyMVx1NTNGMlx1OTk4Nlx1MzAwMVx1NzdGRlx1NEUxQVx1OTk4Nlx1MzAwMVx1NTczMFx1OEQyOFx1OTk4NlwiXHU0RTA5XHU5OTg2XCJcdTRFOEVcdTRFMDBcdTRGNTNcdTMwMDJcdTY4MjFcdTUzRjJcdTk5ODZcdTdFQTYxMTAwXHU1RTczXHU2NUI5XHU3QzczXHVGRjBDXHU1QzU1XHU3OTNBNjAwXHU0RjU5XHU1RTQ1XHU3MTY3XHU3MjQ3XHU1NDhDXHU4RkQxXHU3NjdFXHU0RUY2XHU1QzU1XHU1NEMxXHVGRjFCXHU3N0ZGXHU0RTFBXHU5OTg2XHU1MzA1XHU1NDJCXHU3N0ZGXHU0RTk1XHU4QzAzXHU1RUE2XHU0RTJEXHU1RkMzXHUzMDAxXHU2NjdBXHU4MEZEXHU1RjAwXHU5MUM3XHU1QjlFXHU5QThDXHU1QkE0XHUzMDAxXHU2NjdBXHU4MEZEXHU1RjAwXHU5MUM3XHU1REU1XHU0RjVDXHU5NzYyXHUzMDAxXHU3RUZDXHU5MUM3XHU1REU1XHU0RjVDXHU5NzYyXHU3QjQ5XHU4QkJFXHU2NUJEXHVGRjBDXHU2NjJGXHU1NkZEXHU1MTg1XHU4QkJFXHU3RjZFXHU2NzAwXHU1MTY4XHU3Njg0XHU1NzMwXHU0RTBCXHU2QTIxXHU2MkRGXHU3N0ZGXHU0RTk1XHVGRjFCXHU1NzMwXHU4RDI4XHU5OTg2XHU0RTNBXHU0RTJEXHU1NkZEXHU1NzMwXHU4RDI4XHU1QjY2XHU0RjFBXHU3OUQxXHU2NjZFXHU3ODE0XHU1QjY2XHU1N0ZBXHU1NzMwXHUzMDAxXHU5RUQxXHU5Rjk5XHU2QzVGXHU3NzAxXHU3OUQxXHU2NjZFXHU3OTNBXHU4MzAzXHU1N0ZBXHU1NzMwXHVGRjBDXHU0RTNCXHU4OTgxXHU1QzU1XHU3OTNBXHU1Q0E5XHU1QzQyXHU1NzMwXHU4RDI4XHU2MEM1XHU1MUI1XHU1M0NBXHU3N0ZGXHU3N0YzXHU2ODA3XHU2NzJDXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIC8vIFx1OUFEOFx1N0FFRlx1NjcwRFx1NTJBMVx1NUU3M1x1NTNGMFx1RkYwOFx1NjgyMVx1NTZFRFx1ODk3Rlx1OTBFOFx1RkYwOVxyXG4gICAge1xyXG4gICAgICBpZDogJzQxJyxcclxuICAgICAgbmFtZTogJ1x1NzNCMFx1NEVFM1x1NTIzNlx1OTAyMFx1NURFNVx1N0EwQlx1NEUyRFx1NUZDMycsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICd0ZWFjaGluZycsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1MDYzNSxcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgxNjkyNixcclxuICAgICAgdGFnczogWydcdTUyMzZcdTkwMjAnLCAnXHU1REU1XHU3QTBCJywgJ1x1NUI5RVx1OEJBRCddLFxyXG4gICAgICBvcGVuVGltZTogJzA4OjAwIC0gMjI6MDAnLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzNDEnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NTE3N1x1NjcwOVx1NTZGRFx1NTE4NVx1NEUwMFx1NkQ0MVx1NkMzNFx1NUU3M1x1NzY4NFx1NzNCMFx1NEVFM1x1NTIzNlx1OTAyMFx1NURFNVx1N0EwQlx1NEUyRFx1NUZDM1x1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNDInLFxyXG4gICAgICBuYW1lOiAnXHU3M0IwXHU0RUUzXHU1MjA2XHU2NzkwXHU2RDRCXHU4QkQ1XHU3ODE0XHU3QTc2XHU0RTJEXHU1RkMzJyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ3RlYWNoaW5nJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjQ5NjM1LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE2NDI2LFxyXG4gICAgICB0YWdzOiBbJ1x1NTIwNlx1Njc5MCcsICdcdTZENEJcdThCRDUnLCAnXHU3OUQxXHU3ODE0J10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAyMjowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM0MicsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1MTc3XHU2NzA5XHU1NkZEXHU1MTg1XHU0RTAwXHU2RDQxXHU2QzM0XHU1RTczXHU3Njg0XHU3M0IwXHU0RUUzXHU1MjA2XHU2NzkwXHU2RDRCXHU4QkQ1XHU3ODE0XHU3QTc2XHU0RTJEXHU1RkMzXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICc0MycsXHJcbiAgICAgIG5hbWU6ICdcdTRFMkRcdTU5NjVcdTgwNENcdTRFMUFcdTYyODBcdTY3MkZcdTU3RjlcdThCQURcdTRFMkRcdTVGQzMnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnc2VydmljZScsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY0ODYzNSxcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgxNzkyNixcclxuICAgICAgdGFnczogWydcdTU3RjlcdThCQUQnLCAnXHU4MDRDXHU0RTFBXHU2MjgwXHU2NzJGJywgJ1x1NTZGRFx1OTY0NVx1NTQwOFx1NEY1QyddLFxyXG4gICAgICBvcGVuVGltZTogJzA4OjAwIC0gMTc6MDAnLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzNDMnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NEUyRFx1NTk2NVx1ODA0Q1x1NEUxQVx1NjI4MFx1NjcyRlx1NTdGOVx1OEJBRFx1NEUyRFx1NUZDM1x1RkYwQ1x1NUYwMFx1NUM1NVx1NTZGRFx1OTY0NVx1NTQwOFx1NEY1Q1x1NTI5RVx1NUI2Nlx1NTQ4Q1x1ODA0Q1x1NEUxQVx1NjI4MFx1ODBGRFx1NTdGOVx1OEJBRFx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNDQnLFxyXG4gICAgICBuYW1lOiAnXHU1REU1XHU3QTBCXHU4QkFEXHU3RUMzXHU0RTJEXHU1RkMzJyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ3RlYWNoaW5nJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUwNjM1LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE1OTI2LFxyXG4gICAgICB0YWdzOiBbJ1x1NUI5RVx1OEJBRCcsICdcdTVERTVcdTdBMEInLCAnXHU1QjlFXHU4REY1J10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAyMjowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM0NCcsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1REU1XHU3QTBCXHU4QkFEXHU3RUMzXHU0RTJEXHU1RkMzXHVGRjBDXHU2M0QwXHU0RjlCXHU5MUQxXHU1REU1XHU1QjlFXHU0RTYwXHUzMDAxXHU3NTM1XHU1QjUwXHU1QjlFXHU0RTYwXHU3QjQ5XHU1QjlFXHU4REY1XHU2NTU5XHU1QjY2XHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIC8vIFx1NTQwNFx1NUI2Nlx1OTY2Mlx1Njk3Q1x1RkYwOFx1NjgyMVx1NTZFRFx1NEUyRFx1OTBFOFx1NTQ4Q1x1NEUxQ1x1OTBFOFx1RkYwOVxyXG4gICAge1xyXG4gICAgICBpZDogJzQ1JyxcclxuICAgICAgbmFtZTogJ1x1OEJBMVx1N0I5N1x1NjczQVx1NzlEMVx1NUI2Nlx1NEUwRVx1NjI4MFx1NjcyRlx1NUI2Nlx1OTY2Mlx1Njk3QycsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICd0ZWFjaGluZycsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1MjM5OCxcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgxODMwOCxcclxuICAgICAgdGFnczogWydcdTY1NTlcdTVCNjYnLCAnXHU4QkExXHU3Qjk3XHU2NzNBJywgJ1x1NUI5RVx1OUE4QyddLFxyXG4gICAgICBvcGVuVGltZTogJzA4OjAwIC0gMjI6MDAnLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzNDUnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1OEJBMVx1N0I5N1x1NjczQVx1NzlEMVx1NUI2Nlx1NEUwRVx1NjI4MFx1NjcyRlx1NUI2Nlx1OTY2Mlx1NEUxM1x1NzUyOFx1NjU1OVx1NUI2Nlx1Njk3Q1x1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNDYnLFxyXG4gICAgICBuYW1lOiAnXHU3RUNGXHU2RDRFXHU3QkExXHU3NDA2XHU1QjY2XHU5NjYyXHU2OTdDJyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ3RlYWNoaW5nJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUwNTI1LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE1OTI1LFxyXG4gICAgICB0YWdzOiBbJ1x1NjU1OVx1NUI2NicsICdcdTdFQ0ZcdTdCQTEnLCAnXHU1MjlFXHU1MTZDJ10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAyMjowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM0NicsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU3RUNGXHU2RDRFXHU3QkExXHU3NDA2XHU1QjY2XHU5NjYyXHU0RTEzXHU3NTI4XHU2NTU5XHU1QjY2XHU2OTdDXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICc0NycsXHJcbiAgICAgIG5hbWU6ICdcdTc1MzVcdTZDMTRcdTRFMEVcdTYzQTdcdTUyMzZcdTVERTVcdTdBMEJcdTVCNjZcdTk2NjJcdTY5N0NcdUZGMDhcdTc4QjNcdThDMzdcdTU5MjdcdTUzQTZCXHU1RUE3XHVGRjA5JyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NzhCM1x1OEMzN1x1NTkyN1x1NTNBNkJcdTVFQTcnLFxyXG4gICAgICBjYXRlZ29yeTogJ3RlYWNoaW5nJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUwMTY2LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODIyODQ1LFxyXG4gICAgICB0YWdzOiBbJ1x1NjU1OVx1NUI2NicsICdcdTc1MzVcdTZDMTQnLCAnXHU2M0E3XHU1MjM2J10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAyMjowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM0NycsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU3NTM1XHU2QzE0XHU0RTBFXHU2M0E3XHU1MjM2XHU1REU1XHU3QTBCXHU1QjY2XHU5NjYyXHU0RTEzXHU3NTI4XHU2NTU5XHU1QjY2XHU2OTdDXHVGRjBDXHU0RjREXHU0RThFXHU3OEIzXHU4QzM3XHU1OTI3XHU1M0E2Qlx1NUVBN1x1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNDgnLFxyXG4gICAgICBuYW1lOiAnXHU2RDRCXHU3RUQ4XHU1REU1XHU3QTBCXHU1QjY2XHU5NjYyXHU2OTdDJyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ3RlYWNoaW5nJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUyNDQ0LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE4MTU3LFxyXG4gICAgICB0YWdzOiBbJ1x1NjU1OVx1NUI2NicsICdcdTZENEJcdTdFRDgnLCAnXHU1QjlFXHU5QThDJ10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAyMjowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM0OCcsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU2RDRCXHU3RUQ4XHU1REU1XHU3QTBCXHU1QjY2XHU5NjYyXHU0RTEzXHU3NTI4XHU2NTU5XHU1QjY2XHU2OTdDXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICc0OScsXHJcbiAgICAgIG5hbWU6ICdcdTY3NTBcdTY1OTlcdTc5RDFcdTVCNjZcdTRFMEVcdTVERTVcdTdBMEJcdTVCNjZcdTk2NjJcdTY5N0MnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAndGVhY2hpbmcnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTIxMzksXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTYwNTUsXHJcbiAgICAgIHRhZ3M6IFsnXHU2NTU5XHU1QjY2JywgJ1x1Njc1MFx1NjU5OScsICdcdTVCOUVcdTlBOEMnXSxcclxuICAgICAgb3BlblRpbWU6ICcwODowMCAtIDIyOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzQ5JyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTY3NTBcdTY1OTlcdTc5RDFcdTVCNjZcdTRFMEVcdTVERTVcdTdBMEJcdTVCNjZcdTk2NjJcdTRFMTNcdTc1MjhcdTY1NTlcdTVCNjZcdTY5N0NcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzUwJyxcclxuICAgICAgbmFtZTogJ1x1NEVCQVx1NjU4N1x1NzkzRVx1NEYxQVx1NzlEMVx1NUI2Nlx1NUI2Nlx1OTY2Mlx1Njk3QycsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICd0ZWFjaGluZycsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1MjU1NyxcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgxOTU2NyxcclxuICAgICAgdGFnczogWydcdTY1NTlcdTVCNjYnLCAnXHU0RUJBXHU2NTg3JywgJ1x1NzkzRVx1NzlEMSddLFxyXG4gICAgICBvcGVuVGltZTogJzA4OjAwIC0gMjI6MDAnLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzNTAnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NEVCQVx1NjU4N1x1NzkzRVx1NEYxQVx1NzlEMVx1NUI2Nlx1NUI2Nlx1OTY2Mlx1NEUxM1x1NzUyOFx1NjU1OVx1NUI2Nlx1Njk3Q1x1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNTEnLFxyXG4gICAgICBuYW1lOiAnXHU3NDA2XHU1QjY2XHU5NjYyXHU2OTdDJyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ3RlYWNoaW5nJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUyMzk4LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE4MzA4LFxyXG4gICAgICB0YWdzOiBbJ1x1NjU1OVx1NUI2NicsICdcdTY1NzBcdTVCNjYnLCAnXHU3MjY5XHU3NDA2J10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAyMjowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM1MScsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU3NDA2XHU1QjY2XHU5NjYyXHU0RTEzXHU3NTI4XHU2NTU5XHU1QjY2XHU2OTdDXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICc1MicsXHJcbiAgICAgIG5hbWU6ICdcdTU5MTZcdTU2RkRcdThCRURcdTVCNjZcdTk2NjJcdTY5N0MnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAndGVhY2hpbmcnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTI1NTcsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTk1NjcsXHJcbiAgICAgIHRhZ3M6IFsnXHU2NTU5XHU1QjY2JywgJ1x1NTkxNlx1OEJFRCcsICdcdThCRURcdThBMDAnXSxcclxuICAgICAgb3BlblRpbWU6ICcwODowMCAtIDIyOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzUyJyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTU5MTZcdTU2RkRcdThCRURcdTVCNjZcdTk2NjJcdTRFMTNcdTc1MjhcdTY1NTlcdTVCNjZcdTY5N0NcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzc5JyxcclxuICAgICAgbmFtZTogJ1x1OUE2Q1x1NTE0Qlx1NjAxRFx1NEUzQlx1NEU0OVx1NUI2Nlx1OTY2MicsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3XHU5RUQxXHU5Rjk5XHU2QzVGXHU3OUQxXHU2MjgwXHU1OTI3XHU1QjY2JyxcclxuICAgICAgY2F0ZWdvcnk6ICd0ZWFjaGluZycsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1MjUwMyxcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgxOTUxMyxcclxuICAgICAgdGFnczogWydcdTY1NTlcdTVCNjYnLCAnXHU2MDFEXHU2NTNGJywgJ1x1OUE2Q1x1NTIxNyddLFxyXG4gICAgICBvcGVuVGltZTogJzA4OjAwIC0gMTc6MDAnLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzNzknLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1OUE2Q1x1NTE0Qlx1NjAxRFx1NEUzQlx1NEU0OVx1NUI2Nlx1OTY2Mlx1RkYwQ1x1OEQxRlx1OEQyM1x1NjAxRFx1NjBGM1x1NjUzRlx1NkNCQlx1NzQwNlx1OEJCQVx1OEJGRVx1NjU1OVx1NUI2Nlx1NTQ4Q1x1OUE2Q1x1NTE0Qlx1NjAxRFx1NEUzQlx1NEU0OVx1NzQwNlx1OEJCQVx1NzgxNFx1N0E3Nlx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNTMnLFxyXG4gICAgICBuYW1lOiAnXHU4MjdBXHU2NzJGXHU1QjY2XHU5NjYyXHU2OTdDJyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ3RlYWNoaW5nJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUzNTU3LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODIwNTY3LFxyXG4gICAgICB0YWdzOiBbJ1x1NjU1OVx1NUI2NicsICdcdTgyN0FcdTY3MkYnLCAnXHU4QkJFXHU4QkExJ10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAyMjowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM1MycsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU4MjdBXHU2NzJGXHU1QjY2XHU5NjYyXHU0RTEzXHU3NTI4XHU2NTU5XHU1QjY2XHU2OTdDXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICc1NCcsXHJcbiAgICAgIG5hbWU6ICdcdTRGNTNcdTgwQjJcdTkwRTgnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnc3BvcnRzJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUyODY2LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE3MjYxLFxyXG4gICAgICB0YWdzOiBbJ1x1NEY1M1x1ODBCMicsICdcdTY1NTlcdTVCNjYnLCAnXHU4QkFEXHU3RUMzJ10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAyMTowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM1NCcsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU0RjUzXHU4MEIyXHU5MEU4XHU1MjlFXHU1MTZDXHU2OTdDXHU1NDhDXHU4QkFEXHU3RUMzXHU1NzNBXHU5OTg2XHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIC8vIFx1N0VBMlx1ODI3Mlx1NjU4N1x1NTMxNlx1NTczMFx1NjgwN1x1RkYwOFx1NjgyMVx1NTZFRFx1NEUyRFx1NUZDM1x1NTMzQVx1NTdERlx1RkYwOVxyXG4gICAge1xyXG4gICAgICBpZDogJzU1JyxcclxuICAgICAgbmFtZTogJ1x1OTY0OFx1OTBDMVx1NTg1MVx1NTBDRicsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdvdGhlcicsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1MzExMSxcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgxOTI1MSxcclxuICAgICAgdGFnczogWydcdTk2RDVcdTU4NTEnLCAnXHU3RUEyXHU4MjcyXHU2NTg3XHU1MzE2JywgJ1x1NTczMFx1NjgwNyddLFxyXG4gICAgICBvcGVuVGltZTogJ1x1NTE2OFx1NTkyOScsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM1NScsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU5NjQ4XHU5MEMxXHU1ODUxXHU1MENGXHVGRjBDXHU2NUIwXHU0RTJEXHU1NkZEXHU4MEZEXHU2RTkwXHU1REU1XHU0RTFBXHU1NDhDXHU3MTY0XHU3MEFEXHU2NTU5XHU4MEIyXHU0RThCXHU0RTFBXHU3Njg0XHU1RjAwXHU2MkQzXHU4MDA1XHU1NDhDXHU1OTYwXHU1N0ZBXHU0RUJBXHVGRjBDXHU2NjJGXHU3MjMxXHU1NkZEXHU0RTNCXHU0RTQ5XHU1NDhDXHU2ODIxXHU1M0YyXHU2ODIxXHU2MEM1XHU2NTU5XHU4MEIyXHU3Njg0XHU5MUNEXHU4OTgxXHU1N0ZBXHU1NzMwXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICc1NicsXHJcbiAgICAgIG5hbWU6ICdcdTU5MkFcdTk2MzNcdTc3RjNcdTk2RDVcdTU4NTEnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnb3RoZXInLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTM2MTEsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTg3NTEsXHJcbiAgICAgIHRhZ3M6IFsnXHU5NkQ1XHU1ODUxJywgJ1x1NjU4N1x1NTMxNicsICdcdTU3MzBcdTY4MDcnXSxcclxuICAgICAgb3BlblRpbWU6ICdcdTUxNjhcdTU5MjknLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzNTYnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NTkyQVx1OTYzM1x1NzdGM1x1OTZENVx1NTg1MVx1RkYwQ1x1NEVFM1x1ODg2OFx1NUI2Nlx1NjgyMVx1NzY4NFx1NTI5RVx1NUI2Nlx1NzI3OVx1ODI3Mlx1NTQ4Q1x1N0NCRVx1Nzk1RVx1NjU4N1x1NTMxNlx1RkYwQ1x1NjYyRlx1NzlEMVx1NTkyN1x1N0NCRVx1Nzk1RVx1OEMzMVx1N0NGQlx1NzY4NFx1OTFDRFx1ODk4MVx1N0VDNFx1NjIxMFx1OTBFOFx1NTIwNlx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNTcnLFxyXG4gICAgICBuYW1lOiAnXHU1MkIyXHU3MjVCXHU5NkQ1XHU1ODUxJyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ290aGVyJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUyNjExLFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE4NzUxLFxyXG4gICAgICB0YWdzOiBbJ1x1OTZENVx1NTg1MScsICdcdTY1ODdcdTUzMTYnLCAnXHU1NzMwXHU2ODA3J10sXHJcbiAgICAgIG9wZW5UaW1lOiAnXHU1MTY4XHU1OTI5JyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzU3JyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTUyQjJcdTcyNUJcdTk2RDVcdTU4NTFcdUZGMENcdTRFRTNcdTg4NjhcdTVCNjZcdTY4MjFcdTgyNzBcdTgyRTZcdTUyMUJcdTRFMUFcdTc2ODRcdTUyOUVcdTVCNjZcdTUzODZcdTdBMEJcdTU0OENcdTU5NEJcdTUyQzdcdTRFODlcdTUxNDhcdTc2ODRcdTdDQkVcdTc5NUVcdUZGMENcdTY2MkZcdTc5RDFcdTU5MjdcdTdDQkVcdTc5NUVcdThDMzFcdTdDRkJcdTc2ODRcdTkxQ0RcdTg5ODFcdTdFQzRcdTYyMTBcdTkwRThcdTUyMDZcdTMwMDInXHJcbiAgICB9LFxyXG4gICAgLy8gXHU2ODIxXHU5NUU4XHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNTgnLFxyXG4gICAgICBuYW1lOiAnXHU0RTFDXHU1MzE3XHU5NUU4XHVGRjA4XHU2QjYzXHU5NUU4XHVGRjA5JyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ290aGVyJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUxOTU4LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODI0MTcsXHJcbiAgICAgIHRhZ3M6IFsnXHU2ODIxXHU5NUU4JywgJ1x1NTFGQVx1NTE2NVx1NTNFMyddLFxyXG4gICAgICBvcGVuVGltZTogJ1x1NTE2OFx1NTkyOScsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM1OCcsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1QjY2XHU2ODIxXHU0RTFDXHU1MzE3XHU5NUU4XHVGRjBDXHU5NzYyXHU1NDExXHU2RDY2XHU2RTkwXHU4REVGXHVGRjBDXHU2NjJGXHU1QjY2XHU2ODIxXHU2QjYzXHU5NUU4XHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICc1OScsXHJcbiAgICAgIG5hbWU6ICdcdTRFMUNcdTk1RTgnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnb3RoZXInLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTg3OTIsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MjA4MDksXHJcbiAgICAgIHRhZ3M6IFsnXHU2ODIxXHU5NUU4JywgJ1x1NTFGQVx1NTE2NVx1NTNFMyddLFxyXG4gICAgICBvcGVuVGltZTogJ1x1NTE2OFx1NTkyOScsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM1OScsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1QjY2XHU2ODIxXHU0RTFDXHU5NUU4XHVGRjBDXHU2NUI5XHU0RkJGXHU1QjY2XHU3NTFGXHU1MUZBXHU4ODRDXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICc2MCcsXHJcbiAgICAgIG5hbWU6ICdcdTg5N0ZcdTk1RTgnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnb3RoZXInLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTA1MjUsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTU5MjUsXHJcbiAgICAgIHRhZ3M6IFsnXHU2ODIxXHU5NUU4JywgJ1x1NTFGQVx1NTE2NVx1NTNFMyddLFxyXG4gICAgICBvcGVuVGltZTogJ1x1NTE2OFx1NTkyOScsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM2MCcsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1QjY2XHU2ODIxXHU4OTdGXHU5NUU4XHVGRjBDXHU5NzYwXHU4RkQxXHU1QkJGXHU4MjBEXHU1MzNBXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIC8vIFx1NjVCMFx1NTg5RVx1NUI2Nlx1NzUxRlx1NTE2Q1x1NUJEM1x1RkYwODhcdTMwMDExMS0yMFx1NTNGN1x1Njk3Q1x1RkYwOVxyXG4gICAge1xyXG4gICAgICBpZDogJzYxJyxcclxuICAgICAgbmFtZTogJ1x1NUI2Nlx1NzUxRlx1NTE2Q1x1NUJEMzhcdTUzRjdcdTY5N0MnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnZG9ybWl0b3J5JyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjU5ODE4LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE3MTg5LFxyXG4gICAgICB0YWdzOiBbJ1x1NEY0Rlx1NUJCRicsICdcdTc1MUZcdTZEM0InXSxcclxuICAgICAgb3BlblRpbWU6ICdcdTUxNjhcdTU5MjknLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzNjEnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NUI2Nlx1NzUxRlx1NTE2Q1x1NUJEM1x1Njk3Q1x1RkYwQ1x1NTNFRlx1NUJCOVx1N0VCMzgwMFx1NTQwRFx1NUI2Nlx1NzUxRlx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNjInLFxyXG4gICAgICBuYW1lOiAnXHU1QjY2XHU3NTFGXHU1MTZDXHU1QkQzMTFcdTUzRjdcdTY5N0NcdUZGMDhcdTdCMkNcdTUzNDFcdTRFMDBcdTVCNjZcdTc1MUZcdTUxNkNcdTVCRDNcdUZGMDknLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnZG9ybWl0b3J5JyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjU2MTY4LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE0NzAyLFxyXG4gICAgICB0YWdzOiBbJ1x1NEY0Rlx1NUJCRicsICdcdTc1MUZcdTZEM0InXSxcclxuICAgICAgb3BlblRpbWU6ICdcdTUxNjhcdTU5MjknLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzNjInLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NUI2Nlx1NzUxRlx1NTE2Q1x1NUJEM1x1Njk3Q1x1RkYwQ1x1NTNFRlx1NUJCOVx1N0VCMzEwMDBcdTU0MERcdTVCNjZcdTc1MUZcdTMwMDInXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICBpZDogJzYzJyxcclxuICAgICAgbmFtZTogJ1x1NUI2Nlx1NzUxRlx1NTE2Q1x1NUJEMzEyXHU1M0Y3XHU2OTdDXHVGRjA4XHU3QjJDXHU1MzQxXHU0RThDXHU1QjY2XHU3NTFGXHU1MTZDXHU1QkQzXHVGRjA5JyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ2Rvcm1pdG9yeScsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1NzA0NyxcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgwOTE4NixcclxuICAgICAgdGFnczogWydcdTRGNEZcdTVCQkYnLCAnXHU3NTFGXHU2RDNCJ10sXHJcbiAgICAgIG9wZW5UaW1lOiAnXHU1MTY4XHU1OTI5JyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzYzJyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTVCNjZcdTc1MUZcdTUxNkNcdTVCRDNcdTY5N0NcdUZGMENcdTUzRUZcdTVCQjlcdTdFQjMxMDAwXHU1NDBEXHU1QjY2XHU3NTFGXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICc2NCcsXHJcbiAgICAgIG5hbWU6ICdcdTVCNjZcdTc1MUZcdTUxNkNcdTVCRDMxNFx1NTNGN1x1Njk3QycsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdkb3JtaXRvcnknLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTgwNDcsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MDg2ODYsXHJcbiAgICAgIHRhZ3M6IFsnXHU0RjRGXHU1QkJGJywgJ1x1NzUxRlx1NkQzQiddLFxyXG4gICAgICBvcGVuVGltZTogJ1x1NTE2OFx1NTkyOScsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM2NCcsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1QjY2XHU3NTFGXHU1MTZDXHU1QkQzXHU2OTdDXHVGRjBDXHU1M0VGXHU1QkI5XHU3RUIzODAwXHU1NDBEXHU1QjY2XHU3NTFGXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICc2NScsXHJcbiAgICAgIG5hbWU6ICdcdTVCNjZcdTc1MUZcdTUxNkNcdTVCRDMxNVx1NTNGN1x1Njk3QycsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdkb3JtaXRvcnknLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTc4MjksXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTgzNDcsXHJcbiAgICAgIHRhZ3M6IFsnXHU0RjRGXHU1QkJGJywgJ1x1NzUxRlx1NkQzQiddLFxyXG4gICAgICBvcGVuVGltZTogJ1x1NTE2OFx1NTkyOScsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM2NScsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1QjY2XHU3NTFGXHU1MTZDXHU1QkQzXHU2OTdDXHVGRjBDXHU1M0VGXHU1QkI5XHU3RUIzODAwXHU1NDBEXHU1QjY2XHU3NTFGXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICc2NicsXHJcbiAgICAgIG5hbWU6ICdcdTVCNjZcdTc1MUZcdTUxNkNcdTVCRDMxNlx1NTNGN1x1Njk3Q1x1RkYwOFx1N0IyQ1x1NTM0MVx1NTE2RFx1NUI2Nlx1NzUxRlx1NTE2Q1x1NUJEM1x1RkYwOScsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdkb3JtaXRvcnknLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NjAwNDcsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MDg2ODYsXHJcbiAgICAgIHRhZ3M6IFsnXHU0RjRGXHU1QkJGJywgJ1x1NzUxRlx1NkQzQiddLFxyXG4gICAgICBvcGVuVGltZTogJ1x1NTE2OFx1NTkyOScsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM2NicsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1QjY2XHU3NTFGXHU1MTZDXHU1QkQzXHU2OTdDXHVGRjBDXHU1M0VGXHU1QkI5XHU3RUIzMTAwMFx1NTQwRFx1NUI2Nlx1NzUxRlx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNjcnLFxyXG4gICAgICBuYW1lOiAnXHU1QjY2XHU3NTFGXHU1MTZDXHU1QkQzMTdcdTUzRjdcdTY5N0MnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnZG9ybWl0b3J5JyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjYxMDQ3LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODA5MTg2LFxyXG4gICAgICB0YWdzOiBbJ1x1NEY0Rlx1NUJCRicsICdcdTc1MUZcdTZEM0InXSxcclxuICAgICAgb3BlblRpbWU6ICdcdTUxNjhcdTU5MjknLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzNjcnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NUI2Nlx1NzUxRlx1NTE2Q1x1NUJEM1x1Njk3Q1x1RkYwQ1x1NTNFRlx1NUJCOVx1N0VCMzgwMFx1NTQwRFx1NUI2Nlx1NzUxRlx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNjgnLFxyXG4gICAgICBuYW1lOiAnXHU1QjY2XHU3NTFGXHU1MTZDXHU1QkQzMThcdTUzRjdcdTY5N0MnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnZG9ybWl0b3J5JyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjYyMDQ3LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODA4Njg2LFxyXG4gICAgICB0YWdzOiBbJ1x1NEY0Rlx1NUJCRicsICdcdTc1MUZcdTZEM0InXSxcclxuICAgICAgb3BlblRpbWU6ICdcdTUxNjhcdTU5MjknLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzNjgnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NUI2Nlx1NzUxRlx1NTE2Q1x1NUJEM1x1Njk3Q1x1RkYwQ1x1NTNFRlx1NUJCOVx1N0VCMzgwMFx1NTQwRFx1NUI2Nlx1NzUxRlx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNjknLFxyXG4gICAgICBuYW1lOiAnXHU1QjY2XHU3NTFGXHU1MTZDXHU1QkQzMjBcdTUzRjdcdTY5N0MnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnZG9ybWl0b3J5JyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjU2NDIzLFxyXG4gICAgICBsYXRpdHVkZTogNDUuODIyMzM3LFxyXG4gICAgICB0YWdzOiBbJ1x1NEY0Rlx1NUJCRicsICdcdTc1MUZcdTZEM0InXSxcclxuICAgICAgb3BlblRpbWU6ICdcdTUxNjhcdTU5MjknLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzNjknLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NUI2Nlx1NzUxRlx1NTE2Q1x1NUJEM1x1Njk3Q1x1RkYwQ1x1NTNFRlx1NUJCOVx1N0VCMzEwMDBcdTU0MERcdTVCNjZcdTc1MUZcdTMwMDInXHJcbiAgICB9LFxyXG4gICAgLy8gXHU2NUIwXHU1ODlFXHU2NTU5XHU1QjY2XHU2OTdDL1x1NUI5RVx1OUE4Q1x1Njk3Q1xyXG4gICAge1xyXG4gICAgICBpZDogJzcwJyxcclxuICAgICAgbmFtZTogJ1x1NjU1OVx1NUI2Nlx1NUI5RVx1OUE4Q1x1N0VGQ1x1NTQwOFx1Njk3QycsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICd0ZWFjaGluZycsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1Mzc5MixcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgyMTMwOSxcclxuICAgICAgdGFnczogWydcdTY1NTlcdTVCNjYnLCAnXHU1QjlFXHU5QThDJywgJ1x1N0VGQ1x1NTQwOCddLFxyXG4gICAgICBvcGVuVGltZTogJzA2OjAwIC0gMjI6MDAnLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzNzAnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NjU1OVx1NUI2Nlx1NUI5RVx1OUE4Q1x1N0VGQ1x1NTQwOFx1Njk3Q1x1RkYwQ1x1OTZDNlx1NjU1OVx1NUI2Nlx1NTQ4Q1x1NUI5RVx1OUE4Q1x1NTI5Rlx1ODBGRFx1NEU4RVx1NEUwMFx1NEY1M1x1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNzEnLFxyXG4gICAgICBuYW1lOiAnXHU2QzQyXHU2NjJGXHU2OTdDJyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ3RlYWNoaW5nJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjU0NzkyLFxyXG4gICAgICBsYXRpdHVkZTogNDUuODIxODA5LFxyXG4gICAgICB0YWdzOiBbJ1x1NjU1OVx1NUI2NicsICdcdTUyOUVcdTUxNkMnXSxcclxuICAgICAgb3BlblRpbWU6ICcwODowMCAtIDIyOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzcxJyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTZDNDJcdTY2MkZcdTY5N0NcdUZGMENcdTY1NTlcdTVCNjZcdTY5N0NcdTMwMDInXHJcbiAgICB9LFxyXG4gICAgLy8gXHU2NUIwXHU1ODlFXHU3ODE0XHU3QTc2XHU2MjQwL1x1NEUyRFx1NUZDM1xyXG4gICAge1xyXG4gICAgICBpZDogJzcyJyxcclxuICAgICAgbmFtZTogJ1x1NTE0OVx1NkNFMlx1NjI4MFx1NjcyRlx1NzgxNFx1N0E3Nlx1NjI0MCcsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICd0ZWFjaGluZycsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1MDc5MixcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgyMTMwOSxcclxuICAgICAgdGFnczogWydcdTc5RDFcdTc4MTQnLCAnXHU1MTQ5XHU2Q0UyJywgJ1x1NjI4MFx1NjcyRiddLFxyXG4gICAgICBvcGVuVGltZTogJzA4OjAwIC0gMTc6MDAnLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzNzInLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NTE0OVx1NkNFMlx1NjI4MFx1NjcyRlx1NzgxNFx1N0E3Nlx1NjI0MFx1RkYwQ1x1NEVDRVx1NEU4Qlx1NTE0OVx1NkNFMlx1NjI4MFx1NjcyRlx1NzZGOFx1NTE3M1x1NzgxNFx1N0E3Nlx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNzMnLFxyXG4gICAgICBuYW1lOiAnXHU1REU1XHU3QTBCXHU1MjlCXHU1QjY2XHU0RTBFXHU2NzUwXHU2NTk5XHU3ODE0XHU3QTc2XHU2MjQwJyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjcnLFxyXG4gICAgICBjYXRlZ29yeTogJ3RlYWNoaW5nJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjQ5NzkyLFxyXG4gICAgICBsYXRpdHVkZTogNDUuODIwODA5LFxyXG4gICAgICB0YWdzOiBbJ1x1NzlEMVx1NzgxNCcsICdcdTUyOUJcdTVCNjYnLCAnXHU2NzUwXHU2NTk5J10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAxNzowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM3MycsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU1REU1XHU3QTBCXHU1MjlCXHU1QjY2XHU0RTBFXHU2NzUwXHU2NTk5XHU3ODE0XHU3QTc2XHU2MjQwXHVGRjBDXHU0RUNFXHU0RThCXHU1REU1XHU3QTBCXHU1MjlCXHU1QjY2XHU0RTBFXHU2NzUwXHU2NTk5XHU3NkY4XHU1MTczXHU3ODE0XHU3QTc2XHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgaWQ6ICc3NCcsXHJcbiAgICAgIG5hbWU6ICdcdTczQjBcdTRFRTNcdTY1NTlcdTgwQjJcdTYyODBcdTY3MkZcdTRFMkRcdTVGQzMnLFxyXG4gICAgICBhZGRyZXNzOiAnXHU1NEM4XHU1QzE0XHU2RUU4XHU1RTAyXHU2NzdFXHU1MzE3XHU1MzNBXHU2RDY2XHU2RTkwXHU4REVGMjQ2OFx1NTNGNycsXHJcbiAgICAgIGNhdGVnb3J5OiAnc2VydmljZScsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1MTc5MixcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgyMTMwOSxcclxuICAgICAgdGFnczogWydcdTY1NTlcdTgwQjInLCAnXHU2MjgwXHU2NzJGJywgJ1x1NTkxQVx1NUE5Mlx1NEY1MyddLFxyXG4gICAgICBvcGVuVGltZTogJzA4OjAwIC0gMTc6MDAnLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzNzQnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NzNCMFx1NEVFM1x1NjU1OVx1ODBCMlx1NjI4MFx1NjcyRlx1NEUyRFx1NUZDM1x1RkYwQ1x1OEQxRlx1OEQyM1x1NTkxQVx1NUE5Mlx1NEY1M1x1NjU1OVx1NUI2Nlx1OEJCRVx1NTkwN1x1N0JBMVx1NzQwNlx1NTQ4Q1x1NjI4MFx1NjcyRlx1NjUyRlx1NjMwMVx1MzAwMidcclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIGlkOiAnODAnLFxyXG4gICAgICBuYW1lOiAnXHU3NTM1XHU2QzE0XHU1REU1XHU3QTBCXHU1QjlFXHU5QThDXHU0RTBFXHU1QjlFXHU4REY1XHU0RTJEXHU1RkMzJyxcclxuICAgICAgYWRkcmVzczogJ1x1NTRDOFx1NUMxNFx1NkVFOFx1NUUwMlx1Njc3RVx1NTMxN1x1NTMzQVx1NkQ2Nlx1NkU5MFx1OERFRjI0NjhcdTUzRjdcdTlFRDFcdTlGOTlcdTZDNUZcdTc5RDFcdTYyODBcdTU5MjdcdTVCNjYnLFxyXG4gICAgICBjYXRlZ29yeTogJ3RlYWNoaW5nJyxcclxuICAgICAgbG9uZ2l0dWRlOiAxMjYuNjUxMzQ5LFxyXG4gICAgICBsYXRpdHVkZTogNDUuODE1NzQxLFxyXG4gICAgICB0YWdzOiBbJ1x1NUI5RVx1OUE4QycsICdcdTc1MzVcdTZDMTQnLCAnXHU1QjlFXHU4REY1J10sXHJcbiAgICAgIG9wZW5UaW1lOiAnMDg6MDAgLSAyMjowMCcsXHJcbiAgICAgIHBob25lOiAnMDQ1MS04ODAzMzM4MCcsXHJcbiAgICAgIGRlc2NyaXB0aW9uOiAnXHU3NTM1XHU2QzE0XHU1REU1XHU3QTBCXHU1QjlFXHU5QThDXHU0RTBFXHU1QjlFXHU4REY1XHU0RTJEXHU1RkMzXHVGRjBDXHU0RTNBXHU3NTM1XHU2QzE0XHU1REU1XHU3QTBCXHU0RTEzXHU0RTFBXHU2M0QwXHU0RjlCXHU1QjlFXHU5QThDXHU1NDhDXHU1QjlFXHU4REY1XHU2NTU5XHU1QjY2XHU2NzBEXHU1MkExXHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIC8vIFx1NjVCMFx1NTg5RVx1OThERlx1NTgwMlxyXG4gICAge1xyXG4gICAgICBpZDogJzc1JyxcclxuICAgICAgbmFtZTogJ1x1N0IyQ1x1NTZEQlx1OThERlx1NTgwMicsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdkaW5pbmcnLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NTY3OTIsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTg4MDksXHJcbiAgICAgIHRhZ3M6IFsnXHU5OTEwXHU5OTZFJywgJ1x1NUZFQlx1OTkxMCcsICdcdTVDMEZcdTU0MDMnXSxcclxuICAgICAgb3BlblRpbWU6ICcwNjozMCAtIDIxOjAwJyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzc1JyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTVCNjZcdTY4MjFcdTdCMkNcdTU2REJcdTk4REZcdTU4MDJcdUZGMENcdTYzRDBcdTRGOUJcdTU0MDRcdTdDN0JcdTVGRUJcdTk5MTBcdTU0OENcdTVDMEZcdTU0MDNcdTMwMDInXHJcbiAgICB9LFxyXG4gICAgLy8gXHU2NUIwXHU1ODlFXHU2ODIxXHU5NUU4XHJcbiAgICB7XHJcbiAgICAgIGlkOiAnNzYnLFxyXG4gICAgICBuYW1lOiAnXHU1MzE3NVx1OTVFOCcsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdvdGhlcicsXHJcbiAgICAgIGxvbmdpdHVkZTogMTI2LjY1NDc5MixcclxuICAgICAgbGF0aXR1ZGU6IDQ1LjgyMzgwOSxcclxuICAgICAgdGFnczogWydcdTY4MjFcdTk1RTgnLCAnXHU1MUZBXHU1MTY1XHU1M0UzJ10sXHJcbiAgICAgIG9wZW5UaW1lOiAnXHU1MTY4XHU1OTI5JyxcclxuICAgICAgcGhvbmU6ICcwNDUxLTg4MDMzMzc2JyxcclxuICAgICAgZGVzY3JpcHRpb246ICdcdTVCNjZcdTY4MjFcdTUzMTc1XHU5NUU4XHVGRjBDXHU0RjREXHU0RThFXHU2ODIxXHU1NkVEXHU1MzE3XHU5MEU4XHUzMDAyJ1xyXG4gICAgfSxcclxuICAgIC8vIFx1NjVCMFx1NTg5RVx1NjU1OVx1NUUwOFx1NTE2Q1x1NUJEM1xyXG4gICAge1xyXG4gICAgICBpZDogJzc3JyxcclxuICAgICAgbmFtZTogJ1x1NjU1OVx1NUUwOFx1NTE2Q1x1NUJEMycsXHJcbiAgICAgIGFkZHJlc3M6ICdcdTU0QzhcdTVDMTRcdTZFRThcdTVFMDJcdTY3N0VcdTUzMTdcdTUzM0FcdTZENjZcdTZFOTBcdThERUYyNDY4XHU1M0Y3JyxcclxuICAgICAgY2F0ZWdvcnk6ICdkb3JtaXRvcnknLFxyXG4gICAgICBsb25naXR1ZGU6IDEyNi42NjAwNDcsXHJcbiAgICAgIGxhdGl0dWRlOiA0NS44MTgxODksXHJcbiAgICAgIHRhZ3M6IFsnXHU0RjRGXHU1QkJGJywgJ1x1NjU1OVx1NUUwOCcsICdcdTc1MUZcdTZEM0InXSxcclxuICAgICAgb3BlblRpbWU6ICdcdTUxNjhcdTU5MjknLFxyXG4gICAgICBwaG9uZTogJzA0NTEtODgwMzMzNzcnLFxyXG4gICAgICBkZXNjcmlwdGlvbjogJ1x1NjU1OVx1NUUwOFx1NTE2Q1x1NUJEM1x1RkYwQ1x1NEUzQVx1NjU1OVx1ODA0Q1x1NURFNVx1NjNEMFx1NEY5Qlx1NEY0Rlx1NUJCRlx1NjcwRFx1NTJBMVx1MzAwMidcclxuICAgIH1cclxuICBdLFxyXG4gIHJvdXRlczogW11cclxufVxyXG5cclxuLy8gXHU2ODIxXHU1NkVEXHU1NzMwXHU1NkZFQVBJXHJcbk1vY2subW9jaygnL2FwaS9jYW1wdXMvbWFwJywgJ2dldCcsIGNhbXB1c01hcERhdGEpXHJcblxyXG4vLyBcdThCRkVcdTg4NjhcdTc2RjhcdTUxNzNBUEkgLSBcdTY1QjBcdTYzQTVcdTUzRTNcclxuTW9jay5tb2NrKCcvYXBpL2NhbXB1cy9zY2hlZHVsZScsICdnZXQnLCB7XHJcbiAgY29kZTogMjAwLFxyXG4gIG1lc3NhZ2U6ICdzdWNjZXNzJyxcclxuICAnZGF0YXw1LTEwJzogW3tcclxuICAgIGlkOiAnQGlkJyxcclxuICAgIGNvdXJzZU5hbWU6ICdAY3RpdGxlKDMsIDgpJyxcclxuICAgIHRlYWNoZXI6ICdAY25hbWUnLFxyXG4gICAgY2xhc3Nyb29tOiAnQHBpY2soW1wiXHU2NTU5XHU1QjY2XHU2OTdDQVwiLCBcIlx1NjU1OVx1NUI2Nlx1Njk3Q0JcIiwgXCJcdTVCOUVcdTlBOENcdTY5N0NcIiwgXCJcdTU2RkVcdTRFNjZcdTk5ODZcIl0pQGludGVnZXIoMTAxLCA0MDUpJyxcclxuICAgICdkYXlPZldlZWt8MC02JzogMSxcclxuICAgICdzdGFydFNlY3Rpb258MS04JzogMSxcclxuICAgICdlbmRTZWN0aW9ufDEtOCc6IDIsXHJcbiAgICBzdGFydFRpbWU6ICdAcGljayhbXCIwODowMFwiLCBcIjA4OjU1XCIsIFwiMTA6MDVcIiwgXCIxMTowMFwiLCBcIjEzOjMwXCIsIFwiMTQ6MjVcIiwgXCIxNTozNVwiLCBcIjE2OjMwXCIsIFwiMTg6MzBcIiwgXCIxOToyNVwiXSknLFxyXG4gICAgZW5kVGltZTogJ0BwaWNrKFtcIjA4OjQ1XCIsIFwiMDk6NDBcIiwgXCIxMDo1MFwiLCBcIjExOjQ1XCIsIFwiMTQ6MTVcIiwgXCIxNToxMFwiLCBcIjE2OjIwXCIsIFwiMTc6MTVcIiwgXCIxOToxNVwiLCBcIjIwOjEwXCJdKScsXHJcbiAgICBjb2xvcjogJ0BwaWNrKFtcIiM2NjdlZWFcIiwgXCIjZjU5ZTBiXCIsIFwiIzEwYjk4MVwiLCBcIiNlZjQ0NDRcIiwgXCIjOGI1Y2Y2XCIsIFwiI2VjNDg5OVwiLCBcIiMwNmI2ZDRcIiwgXCIjODRjYzE2XCJdKScsXHJcbiAgICB3ZWVrczogJ0BwaWNrKFtcIjEtMTZcdTU0NjhcIiwgXCIxLThcdTU0NjhcIiwgXCI5LTE2XHU1NDY4XCIsIFwiMy0xMFx1NTQ2OFwiLCBcIjUtMTJcdTU0NjhcIl0pJ1xyXG4gIH1dXHJcbn0pXHJcblxyXG4vLyBcdTZERkJcdTUyQTBcdThCRkVcdTdBMEJcclxuTW9jay5tb2NrKCcvYXBpL2NhbXB1cy9zY2hlZHVsZScsICdwb3N0Jywge1xyXG4gIGNvZGU6IDIwMCxcclxuICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgZGF0YToge1xyXG4gICAgaWQ6ICdAaWQnLFxyXG4gICAgY291cnNlTmFtZTogJ0BjdGl0bGUoMywgOCknLFxyXG4gICAgdGVhY2hlcjogJ0BjbmFtZScsXHJcbiAgICBjbGFzc3Jvb206ICdAcGljayhbXCJcdTY1NTlcdTVCNjZcdTY5N0NBXCIsIFwiXHU2NTU5XHU1QjY2XHU2OTdDQlwiLCBcIlx1NUI5RVx1OUE4Q1x1Njk3Q1wiXSlAaW50ZWdlcigxMDEsIDQwNSknLFxyXG4gICAgJ2RheU9mV2Vla3wwLTYnOiAxLFxyXG4gICAgJ3N0YXJ0U2VjdGlvbnwxLTgnOiAxLFxyXG4gICAgJ2VuZFNlY3Rpb258MS04JzogMixcclxuICAgIHN0YXJ0VGltZTogJzA4OjAwJyxcclxuICAgIGVuZFRpbWU6ICcwOTo0MCcsXHJcbiAgICBjb2xvcjogJyM2NjdlZWEnXHJcbiAgfVxyXG59KVxyXG5cclxuLy8gXHU2NkY0XHU2NUIwXHU4QkZFXHU3QTBCXHJcbk1vY2subW9jaygvXFwvYXBpXFwvY2FtcHVzXFwvc2NoZWR1bGVcXC9cXHcrLywgJ3Bvc3QnLCB7XHJcbiAgY29kZTogMjAwLFxyXG4gIG1lc3NhZ2U6ICdzdWNjZXNzJyxcclxuICBkYXRhOiB7XHJcbiAgICBpZDogJ0BpZCcsXHJcbiAgICBjb3Vyc2VOYW1lOiAnQGN0aXRsZSgzLCA4KScsXHJcbiAgICB0ZWFjaGVyOiAnQGNuYW1lJyxcclxuICAgIGNsYXNzcm9vbTogJ0BwaWNrKFtcIlx1NjU1OVx1NUI2Nlx1Njk3Q0FcIiwgXCJcdTY1NTlcdTVCNjZcdTY5N0NCXCIsIFwiXHU1QjlFXHU5QThDXHU2OTdDXCJdKUBpbnRlZ2VyKDEwMSwgNDA1KScsXHJcbiAgICAnZGF5T2ZXZWVrfDAtNic6IDEsXHJcbiAgICAnc3RhcnRTZWN0aW9ufDEtOCc6IDEsXHJcbiAgICAnZW5kU2VjdGlvbnwxLTgnOiAyLFxyXG4gICAgc3RhcnRUaW1lOiAnMDg6MDAnLFxyXG4gICAgZW5kVGltZTogJzA5OjQwJyxcclxuICAgIGNvbG9yOiAnIzY2N2VlYSdcclxuICB9XHJcbn0pXHJcblxyXG4vLyBcdTUyMjBcdTk2NjRcdThCRkVcdTdBMEJcclxuTW9jay5tb2NrKC9cXC9hcGlcXC9jYW1wdXNcXC9zY2hlZHVsZVxcL1xcdytcXC9kZWxldGUvLCAncG9zdCcsIHtcclxuICBjb2RlOiAyMDAsXHJcbiAgbWVzc2FnZTogJ3N1Y2Nlc3MnXHJcbn0pXHJcblxyXG4vLyBcdTVCRkNcdTUxNjVcdThCRkVcdTg4NjhcclxuTW9jay5tb2NrKCcvYXBpL2NhbXB1cy9zY2hlZHVsZS9pbXBvcnQnLCAncG9zdCcsIHtcclxuICBjb2RlOiAyMDAsXHJcbiAgbWVzc2FnZTogJ3N1Y2Nlc3MnLFxyXG4gIGRhdGE6IHtcclxuICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICBpbXBvcnRlZDogJ0BpbnRlZ2VyKDMsIDgpJyxcclxuICAgIGZhaWxlZDogMFxyXG4gIH1cclxufSlcclxuXHJcbi8vIFx1NTIwNlx1NEVBQlx1OEJGRVx1ODg2OFxyXG5Nb2NrLm1vY2soJy9hcGkvY2FtcHVzL3NjaGVkdWxlL3NoYXJlJywgJ3Bvc3QnLCB7XHJcbiAgY29kZTogMjAwLFxyXG4gIG1lc3NhZ2U6ICdzdWNjZXNzJyxcclxuICBkYXRhOiB7XHJcbiAgICBzaGFyZUlkOiAnQGlkJyxcclxuICAgIHNoYXJlVXJsOiAnaHR0cHM6Ly9oZWlrZWppLmNvbS9zaGFyZS9zY2hlZHVsZS9AaWQnLFxyXG4gICAgZXhwaXJlc0F0OiAnQGRhdGV0aW1lJ1xyXG4gIH1cclxufSlcclxuXHJcbi8vIFx1ODNCN1x1NTNENlx1NjNEMFx1OTE5Mlx1OEJCRVx1N0Y2RVxyXG5Nb2NrLm1vY2soJy9hcGkvY2FtcHVzL3NjaGVkdWxlL3JlbWluZGVyJywgJ2dldCcsIHtcclxuICBjb2RlOiAyMDAsXHJcbiAgbWVzc2FnZTogJ3N1Y2Nlc3MnLFxyXG4gIGRhdGE6IHtcclxuICAgIGVuYWJsZWQ6ICdAYm9vbGVhbicsXHJcbiAgICByZW1pbmRlck1pbnV0ZXM6ICdAcGljayhbNSwgMTAsIDE1LCAzMF0pJyxcclxuICAgIHJlbWluZGVyTWV0aG9kOiAnQHBpY2soW1wibm90aWZpY2F0aW9uXCIsIFwiZW1haWxcIiwgXCJib3RoXCJdKSdcclxuICB9XHJcbn0pXHJcblxyXG4vLyBcdTY2RjRcdTY1QjBcdTYzRDBcdTkxOTJcdThCQkVcdTdGNkVcclxuTW9jay5tb2NrKCcvYXBpL2NhbXB1cy9zY2hlZHVsZS9yZW1pbmRlcicsICdwb3N0Jywge1xyXG4gIGNvZGU6IDIwMCxcclxuICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgZGF0YToge1xyXG4gICAgZW5hYmxlZDogJ0Bib29sZWFuJyxcclxuICAgIHJlbWluZGVyTWludXRlczogJ0BwaWNrKFs1LCAxMCwgMTUsIDMwXSknLFxyXG4gICAgcmVtaW5kZXJNZXRob2Q6ICdAcGljayhbXCJub3RpZmljYXRpb25cIiwgXCJlbWFpbFwiLCBcImJvdGhcIl0pJ1xyXG4gIH1cclxufSlcclxuXHJcbi8vIFx1NTZGRVx1NEU2Nlx1OTk4Nlx1NTZGRVx1NEU2Nlx1NjQxQ1x1N0QyMlxyXG5Nb2NrLm1vY2soJy9hcGkvY2FtcHVzL2xpYnJhcnkvc2VhcmNoJywgJ2dldCcsIHtcclxuICBjb2RlOiAyMDAsXHJcbiAgbWVzc2FnZTogJ3N1Y2Nlc3MnLFxyXG4gIGRhdGE6IHtcclxuICAgICdyZXN1bHRzfDEwLTIwJzogW3tcclxuICAgICAgaWQ6ICdAaWQnLFxyXG4gICAgICBpc2JuOiAnQHN0cmluZyhcIm51bWJlclwiLCAxMyknLFxyXG4gICAgICB0aXRsZTogJ0BjdGl0bGUoNSwgMTUpJyxcclxuICAgICAgYXV0aG9yOiAnQGNuYW1lJyxcclxuICAgICAgcHVibGlzaGVyOiAnQHBpY2soW1wiXHU2RTA1XHU1MzRFXHU1OTI3XHU1QjY2XHU1MUZBXHU3MjQ4XHU3OTNFXCIsIFwiXHU0RUJBXHU2QzExXHU5MEFFXHU3NTM1XHU1MUZBXHU3MjQ4XHU3OTNFXCIsIFwiXHU2NzNBXHU2OEIwXHU1REU1XHU0RTFBXHU1MUZBXHU3MjQ4XHU3OTNFXCIsIFwiXHU3NTM1XHU1QjUwXHU1REU1XHU0RTFBXHU1MUZBXHU3MjQ4XHU3OTNFXCJdKScsXHJcbiAgICAgIGNhdGVnb3J5OiAnQHBpY2soW1wiXHU4QkExXHU3Qjk3XHU2NzNBXCIsIFwiXHU2NTcwXHU1QjY2XCIsIFwiXHU2NTg3XHU1QjY2XCIsIFwiXHU3OUQxXHU1QjY2XCIsIFwiXHU3RUNGXHU2RDRFXCIsIFwiXHU4MjdBXHU2NzJGXCJdKScsXHJcbiAgICAgIGxvY2F0aW9uOiAnQHBpY2soW1wiQVx1NTMzQVwiLCBcIkJcdTUzM0FcIiwgXCJDXHU1MzNBXCJdKS1AaW50ZWdlcigxLCA1KS1AaW50ZWdlcigxLCAxMDApJyxcclxuICAgICAgJ2NvcGllc3wxLTEwJzogMSxcclxuICAgICAgYXZhaWxhYmxlOiAnQGJvb2xlYW4nLFxyXG4gICAgICBjb3ZlcjogJ0BpbWFnZShcIjE0MHgyMDBcIiwgXCIjMTBiOTgxXCIsIFwiI0ZGRlwiLCBcIkJvb2tcIiknLFxyXG4gICAgICBpbnRybzogJ0BjcGFyYWdyYXBoKDMsIDUpJyxcclxuICAgICAgcHVibGlzaERhdGU6ICdAZGF0ZSdcclxuICAgIH1dLFxyXG4gICAgJ3RvdGFsfDIwLTEwMCc6IDFcclxuICB9XHJcbn0pXHJcblxyXG4vLyBcdTU2RkVcdTRFNjZcdTUwMUZcdTk2MDVcclxuTW9jay5tb2NrKCcvYXBpL2NhbXB1cy9saWJyYXJ5L2JvcnJvdycsICdwb3N0Jywge1xyXG4gIGNvZGU6IDIwMCxcclxuICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgZGF0YToge1xyXG4gICAgc3VjY2VzczogdHJ1ZSxcclxuICAgIGJvcnJvd0lkOiAnQGlkJyxcclxuICAgIGR1ZURhdGU6ICdAZGF0ZSdcclxuICB9XHJcbn0pXHJcblxyXG4vLyBcdTU2RkVcdTRFNjZcdTVGNTJcdThGRDhcclxuTW9jay5tb2NrKCcvYXBpL2NhbXB1cy9saWJyYXJ5L3JldHVybicsICdwb3N0Jywge1xyXG4gIGNvZGU6IDIwMCxcclxuICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgZGF0YToge1xyXG4gICAgc3VjY2VzczogdHJ1ZSxcclxuICAgICdvdmVyZHVlRGF5c3wwLTEwJzogMCxcclxuICAgICdmaW5lfDAtNTAnOiAwXHJcbiAgfVxyXG59KVxyXG5cclxuLy8gXHU1NkZFXHU0RTY2XHU3RUVEXHU1MDFGXHJcbk1vY2subW9jaygnL2FwaS9jYW1wdXMvbGlicmFyeS9yZW5ldycsICdwb3N0Jywge1xyXG4gIGNvZGU6IDIwMCxcclxuICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgZGF0YToge1xyXG4gICAgc3VjY2VzczogdHJ1ZSxcclxuICAgIG5ld0R1ZURhdGU6ICdAZGF0ZSdcclxuICB9XHJcbn0pXHJcblxyXG4vLyBcdTgzQjdcdTUzRDZcdTYyMTFcdTc2ODRcdTUwMUZcdTk2MDVcclxuTW9jay5tb2NrKCcvYXBpL2NhbXB1cy9saWJyYXJ5L215LWJvcnJvd3MnLCAnZ2V0Jywge1xyXG4gIGNvZGU6IDIwMCxcclxuICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgJ2RhdGF8My04JzogW3tcclxuICAgIGlkOiAnQGlkJyxcclxuICAgIGJvb2tJZDogJ0BpZCcsXHJcbiAgICBib29rVGl0bGU6ICdAY3RpdGxlKDUsIDE1KScsXHJcbiAgICBib29rQ292ZXI6ICdAaW1hZ2UoXCIxMDB4MTQwXCIsIFwiIzEwYjk4MVwiLCBcIiNGRkZcIiwgXCJCb29rXCIpJyxcclxuICAgIGJvcnJvd0RhdGU6ICdAZGF0ZScsXHJcbiAgICBkdWVEYXRlOiAnQGRhdGUnLFxyXG4gICAgcmV0dXJuRGF0ZTogJ0BkYXRlJyxcclxuICAgICdzdGF0dXN8MSc6IFsnYm9ycm93ZWQnLCAncmV0dXJuZWQnLCAnb3ZlcmR1ZSddLFxyXG4gICAgJ3JlbmV3Q291bnR8MC0yJzogMFxyXG4gIH1dXHJcbn0pXHJcblxyXG4vLyBcdTZERkJcdTUyQTBcdTY1MzZcdTg1Q0ZcclxuTW9jay5tb2NrKCcvYXBpL2NhbXB1cy9saWJyYXJ5L2Zhdm9yaXRlcycsICdwb3N0Jywge1xyXG4gIGNvZGU6IDIwMCxcclxuICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgZGF0YTogeyBzdWNjZXNzOiB0cnVlIH1cclxufSlcclxuXHJcbi8vIFx1NTNENlx1NkQ4OFx1NjUzNlx1ODVDRlxyXG5Nb2NrLm1vY2soJy9hcGkvY2FtcHVzL2xpYnJhcnkvZmF2b3JpdGVzL3JlbW92ZScsICdwb3N0Jywge1xyXG4gIGNvZGU6IDIwMCxcclxuICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgZGF0YTogeyBzdWNjZXNzOiB0cnVlIH1cclxufSlcclxuXHJcbi8vIFx1ODNCN1x1NTNENlx1NjIxMVx1NzY4NFx1NjUzNlx1ODVDRlxyXG5Nb2NrLm1vY2soJy9hcGkvY2FtcHVzL2xpYnJhcnkvZmF2b3JpdGVzJywgJ2dldCcsIHtcclxuICBjb2RlOiAyMDAsXHJcbiAgbWVzc2FnZTogJ3N1Y2Nlc3MnLFxyXG4gICdkYXRhfDUtMTAnOiBbe1xyXG4gICAgaWQ6ICdAaWQnLFxyXG4gICAgaXNibjogJ0BzdHJpbmcoXCJudW1iZXJcIiwgMTMpJyxcclxuICAgIHRpdGxlOiAnQGN0aXRsZSg1LCAxNSknLFxyXG4gICAgYXV0aG9yOiAnQGNuYW1lJyxcclxuICAgIHB1Ymxpc2hlcjogJ0BwaWNrKFtcIlx1NkUwNVx1NTM0RVx1NTkyN1x1NUI2Nlx1NTFGQVx1NzI0OFx1NzkzRVwiLCBcIlx1NEVCQVx1NkMxMVx1OTBBRVx1NzUzNVx1NTFGQVx1NzI0OFx1NzkzRVwiLCBcIlx1NjczQVx1NjhCMFx1NURFNVx1NEUxQVx1NTFGQVx1NzI0OFx1NzkzRVwiXSknLFxyXG4gICAgY2F0ZWdvcnk6ICdAcGljayhbXCJcdThCQTFcdTdCOTdcdTY3M0FcIiwgXCJcdTY1NzBcdTVCNjZcIiwgXCJcdTY1ODdcdTVCNjZcIiwgXCJcdTc5RDFcdTVCNjZcIiwgXCJcdTdFQ0ZcdTZENEVcIiwgXCJcdTgyN0FcdTY3MkZcIl0pJyxcclxuICAgIGxvY2F0aW9uOiAnQHBpY2soW1wiQVx1NTMzQVwiLCBcIkJcdTUzM0FcIiwgXCJDXHU1MzNBXCJdKS1AaW50ZWdlcigxLCA1KS1AaW50ZWdlcigxLCAxMDApJyxcclxuICAgICdjb3BpZXN8MS0xMCc6IDEsXHJcbiAgICBhdmFpbGFibGU6ICdAYm9vbGVhbicsXHJcbiAgICBjb3ZlcjogJ0BpbWFnZShcIjE0MHgyMDBcIiwgXCIjMTBiOTgxXCIsIFwiI0ZGRlwiLCBcIkJvb2tcIiknLFxyXG4gICAgaW50cm86ICdAY3BhcmFncmFwaCgzLCA1KSdcclxuICB9XVxyXG59KVxyXG5cclxuLy8gXHU4M0I3XHU1M0Q2XHU1RUE3XHU0RjREXHU0RkUxXHU2MDZGXHJcbk1vY2subW9jaygnL2FwaS9jYW1wdXMvbGlicmFyeS9zZWF0cycsICdnZXQnLCB7XHJcbiAgY29kZTogMjAwLFxyXG4gIG1lc3NhZ2U6ICdzdWNjZXNzJyxcclxuICAnZGF0YXwzMC01MCc6IFt7XHJcbiAgICBpZDogJ0BpZCcsXHJcbiAgICAnbnVtfDEtMjAwJzogMSxcclxuICAgICdmbG9vcnwxLTUnOiAxLFxyXG4gICAgJ3pvbmV8MSc6IFsnQScsICdCJywgJ0MnXSxcclxuICAgICdyb3d8MS0xMCc6IDEsXHJcbiAgICAnc3RhdHVzfDEnOiBbJ2F2YWlsYWJsZScsICdhdmFpbGFibGUnLCAnYXZhaWxhYmxlJywgJ2F2YWlsYWJsZScsICdvY2N1cGllZCcsICdyZXNlcnZlZCcsICdtYWludGVuYW5jZSddXHJcbiAgfV1cclxufSlcclxuXHJcbi8vIFx1OTg4NFx1N0VBNlx1NUVBN1x1NEY0RFxyXG5Nb2NrLm1vY2soJy9hcGkvY2FtcHVzL2xpYnJhcnkvc2VhdHMvYm9vaycsICdwb3N0Jywge1xyXG4gIGNvZGU6IDIwMCxcclxuICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgZGF0YToge1xyXG4gICAgc3VjY2VzczogdHJ1ZSxcclxuICAgIGJvb2tpbmdJZDogJ0BpZCdcclxuICB9XHJcbn0pXHJcblxyXG4vLyBcdTUzRDZcdTZEODhcdTVFQTdcdTRGNERcdTk4ODRcdTdFQTZcclxuTW9jay5tb2NrKCcvYXBpL2NhbXB1cy9saWJyYXJ5L3NlYXRzL2NhbmNlbCcsICdwb3N0Jywge1xyXG4gIGNvZGU6IDIwMCxcclxuICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgZGF0YTogeyBzdWNjZXNzOiB0cnVlIH1cclxufSlcclxuXHJcbi8vIFx1NUVBN1x1NEY0RFx1N0I3RVx1NTIzMFxyXG5Nb2NrLm1vY2soJy9hcGkvY2FtcHVzL2xpYnJhcnkvc2VhdHMvY2hlY2tpbicsICdwb3N0Jywge1xyXG4gIGNvZGU6IDIwMCxcclxuICBtZXNzYWdlOiAnc3VjY2VzcycsXHJcbiAgZGF0YTogeyBzdWNjZXNzOiB0cnVlIH1cclxufSlcclxuXHJcbi8vIFx1NUVBN1x1NEY0RFx1N0I3RVx1OTAwMFxyXG5Nb2NrLm1vY2soJy9hcGkvY2FtcHVzL2xpYnJhcnkvc2VhdHMvY2hlY2tvdXQnLCAncG9zdCcsIHtcclxuICBjb2RlOiAyMDAsXHJcbiAgbWVzc2FnZTogJ3N1Y2Nlc3MnLFxyXG4gIGRhdGE6IHsgc3VjY2VzczogdHJ1ZSB9XHJcbn0pXHJcblxyXG4vLyBcdTgzQjdcdTUzRDZcdTYyMTFcdTc2ODRcdTVFQTdcdTRGNERcdTk4ODRcdTdFQTZcclxuTW9jay5tb2NrKCcvYXBpL2NhbXB1cy9saWJyYXJ5L215LWJvb2tpbmdzJywgJ2dldCcsIHtcclxuICBjb2RlOiAyMDAsXHJcbiAgbWVzc2FnZTogJ3N1Y2Nlc3MnLFxyXG4gICdkYXRhfDMtNic6IFt7XHJcbiAgICBpZDogJ0BpZCcsXHJcbiAgICBzZWF0SWQ6ICdAaWQnLFxyXG4gICAgJ3NlYXROdW18MS0yMDAnOiAxLFxyXG4gICAgJ2Zsb29yfDEtNSc6IDEsXHJcbiAgICBkYXRlOiAnQGRhdGUnLFxyXG4gICAgc3RhcnRUaW1lOiAnQHRpbWUnLFxyXG4gICAgZW5kVGltZTogJ0B0aW1lJyxcclxuICAgICdzdGF0dXN8MSc6IFsnYWN0aXZlJywgJ2NvbXBsZXRlZCcsICdjYW5jZWxsZWQnXSxcclxuICAgIGNoZWNrSW5UaW1lOiAnQHRpbWUnLFxyXG4gICAgY2hlY2tPdXRUaW1lOiAnQHRpbWUnXHJcbiAgfV1cclxufSlcclxuXHJcbi8vIFx1NUJGQ1x1NTFGQVx1NjU3MFx1NjM2RVx1NzUxRlx1NjIxMFx1NTFGRFx1NjU3MFxyXG5leHBvcnQge1xyXG4gIGdlbmVyYXRlQW5ub3VuY2VtZW50cyxcclxuICBnZW5lcmF0ZUNhbXB1c0FjdGl2aXRpZXMsXHJcbiAgZ2VuZXJhdGVMZWF2ZUFwcGxpY2F0aW9ucyxcclxuICBnZW5lcmF0ZVNjaG9sYXJzaGlwcyxcclxuICBjYW1wdXNNYXBEYXRhXHJcbn1cclxuXHJcbi8vIFx1NTIxQlx1NUVGQSBtb2NrQVBJIFx1NUJGOVx1OEM2MVx1NEY5QiByZXF1ZXN0LnRzIFx1NEY3Rlx1NzUyOFxyXG5leHBvcnQgY29uc3QgbW9ja0FQSSA9IHtcclxuICB1c2VyOiB7XHJcbiAgICBpbmZvOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IHsgaWQ6ICcxJywgdXNlcm5hbWU6ICd0ZXN0Jywgcm9sZTogJ3N0dWRlbnQnIH0gfSksXHJcbiAgICBsb2dpbjogKGRhdGE6IGFueSkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiB7IHRva2VuOiAnbW9jay10b2tlbicsIHVzZXI6IHsgaWQ6ICcxJywgdXNlcm5hbWU6IGRhdGE/LnVzZXJuYW1lIHx8ICd0ZXN0JyB9IH0gfSksXHJcbiAgICByZWdpc3RlcjogKGRhdGE6IGFueSkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiB7IGlkOiAnMScsIHVzZXJuYW1lOiBkYXRhPy51c2VybmFtZSB8fCAndGVzdCcgfSB9KSxcclxuICAgIGxvZ291dDogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBtZXNzYWdlOiAnc3VjY2VzcycgfSlcclxuICB9LFxyXG4gIHNlY29uZGhhbmQ6IHtcclxuICAgIGxpc3Q6IChwYXJhbXM/OiBhbnkpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogeyBsaXN0OiBbXSwgdG90YWw6IDAgfSB9KSxcclxuICAgIGRldGFpbDogKGlkOiBzdHJpbmcpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogeyBpZCwgbmFtZTogJ0l0ZW0nIH0gfSksXHJcbiAgICBjYXRlZ29yaWVzOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IFtdIH0pLFxyXG4gICAgbXlJdGVtczogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiBbXSB9KSxcclxuICAgIHB1Ymxpc2g6IChkYXRhOiBhbnkpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogeyBpZDogJzEnLCAuLi5kYXRhIH0gfSlcclxuICB9LFxyXG4gIGNvbW11bml0eToge1xyXG4gICAgYm9hcmRzOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IFtdIH0pLFxyXG4gICAgcG9zdHM6IChwYXJhbXM/OiBhbnkpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogeyBsaXN0OiBbXSwgdG90YWw6IDAgfSB9KSxcclxuICAgIHBvc3REZXRhaWw6IChpZDogc3RyaW5nKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IHsgaWQsIHRpdGxlOiAnUG9zdCcgfSB9KSxcclxuICAgIGNyZWF0ZVBvc3Q6IChkYXRhOiBhbnkpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogeyBpZDogJzEnLCAuLi5kYXRhIH0gfSksXHJcbiAgICBsaWtlUG9zdDogKGlkOiBzdHJpbmcpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgbWVzc2FnZTogJ3N1Y2Nlc3MnIH0pLFxyXG4gICAgdW5saWtlUG9zdDogKGlkOiBzdHJpbmcpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgbWVzc2FnZTogJ3N1Y2Nlc3MnIH0pLFxyXG4gICAgYWRkQ29tbWVudDogKHBvc3RJZDogc3RyaW5nLCBjb250ZW50OiBzdHJpbmcsIHBhcmVudElkPzogc3RyaW5nKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IHsgaWQ6ICcxJywgcG9zdElkLCBjb250ZW50IH0gfSksXHJcbiAgICBsb3N0Rm91bmRMaXN0OiAocGFyYW1zPzogYW55KSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IHsgbGlzdDogW10sIHRvdGFsOiAwIH0gfSksXHJcbiAgICBwdWJsaXNoTG9zdEZvdW5kOiAoZGF0YTogYW55KSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IHsgaWQ6ICcxJywgLi4uZGF0YSB9IH0pLFxyXG4gICAgYWN0aXZpdGllczogKHBhcmFtcz86IGFueSkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiB7IGxpc3Q6IFtdLCB0b3RhbDogMCB9IH0pLFxyXG4gICAgYWN0aXZpdHlEZXRhaWw6IChpZDogc3RyaW5nKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IHsgaWQsIHRpdGxlOiAnQWN0aXZpdHknIH0gfSksXHJcbiAgICBqb2luQWN0aXZpdHk6IChpZDogc3RyaW5nKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIG1lc3NhZ2U6ICdzdWNjZXNzJyB9KSxcclxuICAgIGNyZWF0ZUFjdGl2aXR5OiAoZGF0YTogYW55KSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IHsgaWQ6ICcxJywgLi4uZGF0YSB9IH0pXHJcbiAgfSxcclxuICBzdHVkZW50QWZmYWlyczoge1xyXG4gICAgcGVuZGluZ1Rhc2tzOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IFtdIH0pLFxyXG4gICAgbGVhdmVBcHBsaWNhdGlvbnM6ICgpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogW10gfSksXHJcbiAgICBzdWJtaXRMZWF2ZTogKGRhdGE6IGFueSkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiB7IGlkOiAnMScsIC4uLmRhdGEgfSB9KSxcclxuICAgIGNhbmNlbExlYXZlOiAoaWQ6IHN0cmluZykgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBtZXNzYWdlOiAnc3VjY2VzcycgfSksXHJcbiAgICBhaWRBcHBsaWNhdGlvbnM6ICgpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogW10gfSksXHJcbiAgICBzdWJtaXRBaWQ6IChkYXRhOiBhbnkpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogeyBpZDogJzEnLCAuLi5kYXRhIH0gfSksXHJcbiAgICBtaWxpdGFyeU9yZGVyczogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiBbXSB9KSxcclxuICAgIHN1Ym1pdE1pbGl0YXJ5T3JkZXI6IChkYXRhOiBhbnkpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogeyBpZDogJzEnLCAuLi5kYXRhIH0gfSksXHJcbiAgICBjYW1wdXNDYXJkOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IHsgYmFsYW5jZTogMTAwIH0gfSksXHJcbiAgICByZWNoYXJnZVJlY29yZHM6ICgpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogW10gfSksXHJcbiAgICByZWNoYXJnZUNhcmQ6IChhbW91bnQ6IG51bWJlciwgbWV0aG9kOiBzdHJpbmcpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgbWVzc2FnZTogJ3N1Y2Nlc3MnIH0pLFxyXG4gICAgcmVwb3J0TG9zdDogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBtZXNzYWdlOiAnc3VjY2VzcycgfSksXHJcbiAgICBhaWRQb2xpY2llczogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiBbXSB9KVxyXG4gIH0sXHJcbiAgcHJvZHVjdHM6IHtcclxuICAgIGhvdDogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiBbXSB9KSxcclxuICAgIGxpc3Q6IChwYXJhbXM/OiBhbnkpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogeyBsaXN0OiBbXSwgdG90YWw6IDAgfSB9KSxcclxuICAgIGRldGFpbDogKGlkOiBzdHJpbmcpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogeyBpZCwgbmFtZTogJ1Byb2R1Y3QnIH0gfSksXHJcbiAgICBjYXRlZ29yaWVzOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IFtdIH0pLFxyXG4gICAgc2VhcmNoOiAoa2V5d29yZDogc3RyaW5nLCBwYXJhbXM/OiBhbnkpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogeyBsaXN0OiBbXSwgdG90YWw6IDAgfSB9KVxyXG4gIH0sXHJcbiAgdGFrZW91dDoge1xyXG4gICAgbWVyY2hhbnRzOiAocGFyYW1zPzogYW55KSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IHsgbGlzdDogW10sIHRvdGFsOiAwIH0gfSksXHJcbiAgICBzZWFyY2hNZXJjaGFudHM6IChrZXl3b3JkOiBzdHJpbmcpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogW10gfSksXHJcbiAgICBtZXJjaGFudERldGFpbDogKGlkOiBzdHJpbmcpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogeyBpZCwgbmFtZTogJ01lcmNoYW50JyB9IH0pLFxyXG4gICAgbWVyY2hhbnRQcm9kdWN0czogKG1lcmNoYW50SWQ6IHN0cmluZykgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiBbXSB9KSxcclxuICAgIHJlY29tbWVuZGVkUHJvZHVjdHM6IChtZXJjaGFudElkOiBzdHJpbmcpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogW10gfSksXHJcbiAgICBwcm9kdWN0RGV0YWlsOiAocHJvZHVjdElkOiBzdHJpbmcpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogeyBpZDogcHJvZHVjdElkLCBuYW1lOiAnUHJvZHVjdCcgfSB9KVxyXG4gIH0sXHJcbiAgY2FtcHVzOiB7XHJcbiAgICBzY2hlZHVsZTogKHBhcmFtcz86IGFueSkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiBbXSB9KSxcclxuICAgIGdyYWRlczogKHBhcmFtcz86IGFueSkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiBbXSB9KSxcclxuICAgIGdwYTogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiB7IGdwYTogMy41IH0gfSksXHJcbiAgICAvLyBcdTU2RkVcdTRFNjZcdTk5ODYgLSBcdTUwMUZcdTk2MDVcdThCQjBcdTVGNTVcclxuICAgIGxpYnJhcnlCb3Jyb3dzOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoe1xyXG4gICAgICBjb2RlOiAyMDAsXHJcbiAgICAgIGRhdGE6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJzEnLFxyXG4gICAgICAgICAgYm9va0lkOiAnYjEnLFxyXG4gICAgICAgICAgYm9va1RpdGxlOiAnSmF2YVNjcmlwdFx1OUFEOFx1N0VBN1x1N0EwQlx1NUU4Rlx1OEJCRVx1OEJBMScsXHJcbiAgICAgICAgICBib29rQ292ZXI6ICdodHRwczovL3ZpYS5wbGFjZWhvbGRlci5jb20vMTAweDE0MC8xMGI5ODEvZmZmZmZmP3RleHQ9SlMnLFxyXG4gICAgICAgICAgYm9ycm93RGF0ZTogJzIwMjYtMDQtMDEnLFxyXG4gICAgICAgICAgZHVlRGF0ZTogJzIwMjYtMDUtMDEnLFxyXG4gICAgICAgICAgc3RhdHVzOiAnYm9ycm93ZWQnLFxyXG4gICAgICAgICAgcmVuZXdDb3VudDogMFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgaWQ6ICcyJyxcclxuICAgICAgICAgIGJvb2tJZDogJ2IyJyxcclxuICAgICAgICAgIGJvb2tUaXRsZTogJ1Z1ZS5qc1x1NUI5RVx1NjIxOCcsXHJcbiAgICAgICAgICBib29rQ292ZXI6ICdodHRwczovL3ZpYS5wbGFjZWhvbGRlci5jb20vMTAweDE0MC82NjdlZWEvZmZmZmZmP3RleHQ9VnVlJyxcclxuICAgICAgICAgIGJvcnJvd0RhdGU6ICcyMDI2LTAzLTE1JyxcclxuICAgICAgICAgIGR1ZURhdGU6ICcyMDI2LTA0LTE1JyxcclxuICAgICAgICAgIHJldHVybkRhdGU6ICcyMDI2LTA0LTEwJyxcclxuICAgICAgICAgIHN0YXR1czogJ3JldHVybmVkJyxcclxuICAgICAgICAgIHJlbmV3Q291bnQ6IDFcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0pLFxyXG4gICAgLy8gXHU1NkZFXHU0RTY2XHU5OTg2IC0gXHU1RUE3XHU0RjREXHU0RkUxXHU2MDZGXHJcbiAgICBsaWJyYXJ5U2VhdHM6IChmbG9vcj86IG51bWJlcikgPT4gUHJvbWlzZS5yZXNvbHZlKHtcclxuICAgICAgY29kZTogMjAwLFxyXG4gICAgICBkYXRhOiBBcnJheS5mcm9tKHsgbGVuZ3RoOiA1MCB9LCAoXywgaSkgPT4gKHtcclxuICAgICAgICBpZDogYHNlYXQtJHtmbG9vciB8fCAzfS0ke2kgKyAxfWAsXHJcbiAgICAgICAgbnVtOiBpICsgMSxcclxuICAgICAgICBmbG9vcjogZmxvb3IgfHwgMyxcclxuICAgICAgICB6b25lOiBbJ0EnLCAnQicsICdDJ11bTWF0aC5mbG9vcihpIC8gMjApXSxcclxuICAgICAgICByb3c6IE1hdGguZmxvb3IoaSAvIDEwKSArIDEsXHJcbiAgICAgICAgc3RhdHVzOiBbJ2F2YWlsYWJsZScsICdhdmFpbGFibGUnLCAnYXZhaWxhYmxlJywgJ29jY3VwaWVkJywgJ3Jlc2VydmVkJywgJ21haW50ZW5hbmNlJ11bTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNildXHJcbiAgICAgIH0pKVxyXG4gICAgfSksXHJcbiAgICAvLyBcdTU2RkVcdTRFNjZcdTk5ODYgLSBcdTVFQTdcdTRGNERcdTk4ODRcdTdFQTZcclxuICAgIHJlc2VydmVTZWF0OiAoZGF0YTogYW55KSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIG1lc3NhZ2U6ICdzdWNjZXNzJywgZGF0YTogeyBib29raW5nSWQ6ICdiaycgKyBEYXRlLm5vdygpIH0gfSksXHJcbiAgICAvLyBcdTU2RkVcdTRFNjZcdTk5ODYgLSBcdTYyMTFcdTc2ODRcdTVFQTdcdTRGNERcdTk4ODRcdTdFQTZcclxuICAgIG15U2VhdEJvb2tpbmdzOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoe1xyXG4gICAgICBjb2RlOiAyMDAsXHJcbiAgICAgIGRhdGE6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2JrMScsXHJcbiAgICAgICAgICBzZWF0SWQ6ICdzZWF0LTMtNDInLFxyXG4gICAgICAgICAgc2VhdE51bTogNDIsXHJcbiAgICAgICAgICBmbG9vcjogMyxcclxuICAgICAgICAgIGRhdGU6ICcyMDI2LTA0LTI1JyxcclxuICAgICAgICAgIHN0YXJ0VGltZTogJzA5OjAwJyxcclxuICAgICAgICAgIGVuZFRpbWU6ICcxMTowMCcsXHJcbiAgICAgICAgICBzdGF0dXM6ICdhY3RpdmUnXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBpZDogJ2JrMicsXHJcbiAgICAgICAgICBzZWF0SWQ6ICdzZWF0LTItMTgnLFxyXG4gICAgICAgICAgc2VhdE51bTogMTgsXHJcbiAgICAgICAgICBmbG9vcjogMixcclxuICAgICAgICAgIGRhdGU6ICcyMDI2LTA0LTI0JyxcclxuICAgICAgICAgIHN0YXJ0VGltZTogJzE0OjAwJyxcclxuICAgICAgICAgIGVuZFRpbWU6ICcxNjowMCcsXHJcbiAgICAgICAgICBzdGF0dXM6ICdjb21wbGV0ZWQnXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9KSxcclxuICAgIC8vIFx1NTZGRVx1NEU2Nlx1OTk4NiAtIFx1NTNENlx1NkQ4OFx1OTg4NFx1N0VBNlxyXG4gICAgY2FuY2VsU2VhdEJvb2tpbmc6IChib29raW5nSWQ6IHN0cmluZykgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBtZXNzYWdlOiAnc3VjY2VzcycgfSksXHJcbiAgICAvLyBcdTU2RkVcdTRFNjZcdTk5ODYgLSBcdTdCN0VcdTUyMzBcclxuICAgIGNoZWNrSW5TZWF0OiAoYm9va2luZ0lkOiBzdHJpbmcpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgbWVzc2FnZTogJ3N1Y2Nlc3MnIH0pLFxyXG4gICAgLy8gXHU1NkZFXHU0RTY2XHU5OTg2IC0gXHU3QjdFXHU5MDAwXHJcbiAgICBjaGVja091dFNlYXQ6IChib29raW5nSWQ6IHN0cmluZykgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBtZXNzYWdlOiAnc3VjY2VzcycgfSksXHJcbiAgICAvLyBcdTU2RkVcdTRFNjZcdTk5ODYgLSBcdTUwMUZcdTk2MDVcdTU2RkVcdTRFNjZcclxuICAgIGJvcnJvd0Jvb2s6IChkYXRhOiBhbnkpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgbWVzc2FnZTogJ3N1Y2Nlc3MnLCBkYXRhOiB7IGJvcnJvd0lkOiAnYnInICsgRGF0ZS5ub3coKSwgZHVlRGF0ZTogJzIwMjYtMDUtMjUnIH0gfSksXHJcbiAgICAvLyBcdTU2RkVcdTRFNjZcdTk5ODYgLSBcdTVGNTJcdThGRDhcdTU2RkVcdTRFNjZcclxuICAgIHJldHVybkJvb2s6IChib3Jyb3dJZDogc3RyaW5nKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIG1lc3NhZ2U6ICdzdWNjZXNzJyB9KSxcclxuICAgIC8vIFx1NTZGRVx1NEU2Nlx1OTk4NiAtIFx1N0VFRFx1NTAxRlx1NTZGRVx1NEU2NlxyXG4gICAgcmVuZXdCb29rOiAoYm9ycm93SWQ6IHN0cmluZykgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBtZXNzYWdlOiAnc3VjY2VzcycsIGRhdGE6IHsgbmV3RHVlRGF0ZTogJzIwMjYtMDYtMjUnIH0gfSksXHJcbiAgICAvLyBcdTU2RkVcdTRFNjZcdTk5ODYgLSBcdTZERkJcdTUyQTBcdTY1MzZcdTg1Q0ZcclxuICAgIGFkZFRvRmF2b3JpdGVzOiAoYm9va0lkOiBzdHJpbmcpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgbWVzc2FnZTogJ3N1Y2Nlc3MnIH0pLFxyXG4gICAgLy8gXHU1NkZFXHU0RTY2XHU5OTg2IC0gXHU4M0I3XHU1M0Q2XHU2NTM2XHU4NUNGXHJcbiAgICBteUZhdm9yaXRlczogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiBbXSB9KSxcclxuICAgIHBlbmRpbmdQYXltZW50czogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiBbXSB9KSxcclxuICAgIHBheW1lbnRIaXN0b3J5OiAoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IFtdIH0pLFxyXG4gICAgc2Nob2xhcnNoaXBzOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IFtdIH0pLFxyXG4gICAgYWlkUG9saWNpZXM6ICgpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogW10gfSksXHJcbiAgICBhY3Rpdml0aWVzOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IFtdIH0pLFxyXG4gICAgY291bnNlbGluZzogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiBbXSB9KSxcclxuICAgIGNhcmVlcnM6ICgpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogW10gfSksXHJcbiAgICBjbGFzc3Jvb21zOiAocGFyYW1zPzogeyBidWlsZGluZz86IHN0cmluZzsgZmxvb3I/OiBudW1iZXI7IHR5cGU/OiBzdHJpbmc7IGRhdGU/OiBzdHJpbmcgfSkgPT4ge1xyXG4gICAgICAvLyBcdTc1MUZcdTYyMTBcdTY1NTlcdTVCQTRcdTY1NzBcdTYzNkUgLSBcdTlFRDFcdTlGOTlcdTZDNUZcdTc5RDFcdTYyODBcdTU5MjdcdTVCNjZcdTVCOUVcdTk2NDVcdTY1NTlcdTVCNjZcdTY5N0NcclxuICAgICAgY29uc3QgYnVpbGRpbmdzID0gWydcdTRFM0JcdTY5N0MnLCAnXHU3QjJDXHU0RTAwXHU2NTU5XHU1QjY2XHU2OTdDJywgJ1x1N0IyQ1x1NEU4Q1x1NjU1OVx1NUI2Nlx1Njk3QycsICdcdTc3RkZcdTRFMUFcdTVERTVcdTdBMEJcdTVCOUVcdTlBOENcdTY5N0MnLCAnXHU2NzNBXHU3NTM1XHU1REU1XHU3QTBCXHU1QjlFXHU5QThDXHU2OTdDJ11cclxuICAgICAgY29uc3QgdHlwZXMgPSBbJ2xlY3R1cmUnLCAnbGFiJywgJ211bHRpbWVkaWEnLCAnc2VtaW5hciddXHJcbiAgICAgIGNvbnN0IGFsbENsYXNzcm9vbXMgPSBbXVxyXG4gICAgICBsZXQgaWQgPSAxXHJcblxyXG4gICAgICAvLyBcdTY1NTlcdTVCNjZcdTY5N0NcdTdGMTZcdTUzRjdcdTUyNERcdTdGMDBcdTY2MjBcdTVDMDRcclxuICAgICAgY29uc3QgYnVpbGRpbmdQcmVmaXg6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XHJcbiAgICAgICAgJ1x1NEUzQlx1Njk3Qyc6ICdaJyxcclxuICAgICAgICAnXHU3QjJDXHU0RTAwXHU2NTU5XHU1QjY2XHU2OTdDJzogJ0EnLFxyXG4gICAgICAgICdcdTdCMkNcdTRFOENcdTY1NTlcdTVCNjZcdTY5N0MnOiAnQicsXHJcbiAgICAgICAgJ1x1NzdGRlx1NEUxQVx1NURFNVx1N0EwQlx1NUI5RVx1OUE4Q1x1Njk3Qyc6ICdLJyxcclxuICAgICAgICAnXHU2NzNBXHU3NTM1XHU1REU1XHU3QTBCXHU1QjlFXHU5QThDXHU2OTdDJzogJ0onXHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGZvciAobGV0IGIgPSAwOyBiIDwgYnVpbGRpbmdzLmxlbmd0aDsgYisrKSB7XHJcbiAgICAgICAgY29uc3QgYnVpbGRpbmcgPSBidWlsZGluZ3NbYl1cclxuICAgICAgICBjb25zdCBwcmVmaXggPSBidWlsZGluZ1ByZWZpeFtidWlsZGluZ10gfHwgU3RyaW5nLmZyb21DaGFyQ29kZSg2NSArIGIpXHJcbiAgICAgICAgLy8gXHU0RTBEXHU1NDBDXHU2OTdDXHU1QzQyXHU2NTU5XHU1QkE0XHU2NTcwXHU5MUNGXHU0RTBEXHU1NDBDXHJcbiAgICAgICAgY29uc3QgZmxvb3JzID0gYnVpbGRpbmcgPT09ICdcdTRFM0JcdTY5N0MnID8gNiA6IDVcclxuICAgICAgICBjb25zdCByb29tc1BlckZsb29yID0gYnVpbGRpbmcuaW5jbHVkZXMoJ1x1NUI5RVx1OUE4Q1x1Njk3QycpID8gOCA6IDEwXHJcblxyXG4gICAgICAgIGZvciAobGV0IGYgPSAxOyBmIDw9IGZsb29yczsgZisrKSB7XHJcbiAgICAgICAgICBmb3IgKGxldCByID0gMTsgciA8PSByb29tc1BlckZsb29yOyByKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgcm9vbU51bSA9IGAke3ByZWZpeH0ke2Z9JHtTdHJpbmcocikucGFkU3RhcnQoMiwgJzAnKX1gXHJcbiAgICAgICAgICAgIC8vIFx1NUI5RVx1OUE4Q1x1NUJBNFx1NUJCOVx1OTFDRlx1OEY4M1x1NUMwRlx1RkYwQ1x1NjU1OVx1NUI2Nlx1Njk3Q1x1NUJCOVx1OTFDRlx1OEY4M1x1NTkyN1xyXG4gICAgICAgICAgICBjb25zdCBjYXBhY2l0eSA9IGJ1aWxkaW5nLmluY2x1ZGVzKCdcdTVCOUVcdTlBOENcdTY5N0MnKVxyXG4gICAgICAgICAgICAgID8gWzIwLCAyNSwgMzAsIDM1LCA0MF1bTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSldXHJcbiAgICAgICAgICAgICAgOiBbNDAsIDQ1LCA1MCwgNjAsIDgwLCAxMjBdW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDYpXVxyXG4gICAgICAgICAgICBjb25zdCB0eXBlID0gYnVpbGRpbmcuaW5jbHVkZXMoJ1x1NUI5RVx1OUE4Q1x1Njk3QycpID8gJ2xhYicgOiB0eXBlc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0eXBlcy5sZW5ndGgpXVxyXG4gICAgICAgICAgICBjb25zdCBmYWNpbGl0aWVzID0gYnVpbGRpbmcuaW5jbHVkZXMoJ1x1NUI5RVx1OUE4Q1x1Njk3QycpXHJcbiAgICAgICAgICAgICAgPyBbJ1x1NzUzNVx1ODExMScsICdcdTYyOTVcdTVGNzFcdTRFRUEnLCAnXHU3QTdBXHU4QzAzJywgJ1x1NUI5RVx1OUE4Q1x1OEJCRVx1NTkwNyddLmZpbHRlcigoKSA9PiBNYXRoLnJhbmRvbSgpID4gMC4yKVxyXG4gICAgICAgICAgICAgIDogWydcdTYyOTVcdTVGNzFcdTRFRUEnLCAnXHU3QTdBXHU4QzAzJywgJ1x1NzUzNVx1ODExMSddLmZpbHRlcigoKSA9PiBNYXRoLnJhbmRvbSgpID4gMC4zKVxyXG5cclxuICAgICAgICAgICAgYWxsQ2xhc3Nyb29tcy5wdXNoKHtcclxuICAgICAgICAgICAgICBpZDogU3RyaW5nKGlkKyspLFxyXG4gICAgICAgICAgICAgIHJvb21OdW1iZXI6IHJvb21OdW0sXHJcbiAgICAgICAgICAgICAgYnVpbGRpbmc6IGJ1aWxkaW5nLFxyXG4gICAgICAgICAgICAgIGZsb29yOiBmLFxyXG4gICAgICAgICAgICAgIHR5cGUsXHJcbiAgICAgICAgICAgICAgY2FwYWNpdHksXHJcbiAgICAgICAgICAgICAgZmFjaWxpdGllcyxcclxuICAgICAgICAgICAgICBpc0F2YWlsYWJsZTogTWF0aC5yYW5kb20oKSA+IDAuMyxcclxuICAgICAgICAgICAgICBsb2NhdGlvbjogYCR7Zn1cdTY5N0Mke1snXHU0RTFDXHU0RkE3JywgJ1x1ODk3Rlx1NEZBNycsICdcdTRFMkRcdTkwRTgnLCAnXHU1MzE3XHU0RkE3JywgJ1x1NTM1N1x1NEZBNyddW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpXX1gXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBcdTY4MzlcdTYzNkVcdTUzQzJcdTY1NzBcdTdCNUJcdTkwMDlcclxuICAgICAgbGV0IHJlc3VsdCA9IGFsbENsYXNzcm9vbXNcclxuICAgICAgaWYgKHBhcmFtcz8uYnVpbGRpbmcpIHtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQuZmlsdGVyKGMgPT4gYy5idWlsZGluZyA9PT0gcGFyYW1zLmJ1aWxkaW5nKVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChwYXJhbXM/LmZsb29yICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQuZmlsdGVyKGMgPT4gYy5mbG9vciA9PT0gcGFyYW1zLmZsb29yKVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChwYXJhbXM/LnR5cGUpIHtcclxuICAgICAgICByZXN1bHQgPSByZXN1bHQuZmlsdGVyKGMgPT4gYy50eXBlID09PSBwYXJhbXMudHlwZSlcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogcmVzdWx0IH0pXHJcbiAgICB9LFxyXG4gICAgY2xhc3Nyb29tVGltZVNsb3RzOiAocm9vbUlkOiBzdHJpbmcsIGRhdGU6IHN0cmluZykgPT4ge1xyXG4gICAgICBjb25zdCBzbG90cyA9IFtcclxuICAgICAgICB7IHBlcmlvZDogMSwgdGltZTogJzA4OjAwLTA4OjQ1JywgYXZhaWxhYmxlOiBNYXRoLnJhbmRvbSgpID4gMC4zIH0sXHJcbiAgICAgICAgeyBwZXJpb2Q6IDIsIHRpbWU6ICcwODo1NS0wOTo0MCcsIGF2YWlsYWJsZTogTWF0aC5yYW5kb20oKSA+IDAuMyB9LFxyXG4gICAgICAgIHsgcGVyaW9kOiAzLCB0aW1lOiAnMTA6MDUtMTA6NTAnLCBhdmFpbGFibGU6IE1hdGgucmFuZG9tKCkgPiAwLjMgfSxcclxuICAgICAgICB7IHBlcmlvZDogNCwgdGltZTogJzExOjAwLTExOjQ1JywgYXZhaWxhYmxlOiBNYXRoLnJhbmRvbSgpID4gMC4zIH0sXHJcbiAgICAgICAgeyBwZXJpb2Q6IDUsIHRpbWU6ICcxMzozMC0xNDoxNScsIGF2YWlsYWJsZTogTWF0aC5yYW5kb20oKSA+IDAuMyB9LFxyXG4gICAgICAgIHsgcGVyaW9kOiA2LCB0aW1lOiAnMTQ6MjUtMTU6MTAnLCBhdmFpbGFibGU6IE1hdGgucmFuZG9tKCkgPiAwLjMgfSxcclxuICAgICAgICB7IHBlcmlvZDogNywgdGltZTogJzE1OjM1LTE2OjIwJywgYXZhaWxhYmxlOiBNYXRoLnJhbmRvbSgpID4gMC4zIH0sXHJcbiAgICAgICAgeyBwZXJpb2Q6IDgsIHRpbWU6ICcxNjozMC0xNzoxNScsIGF2YWlsYWJsZTogTWF0aC5yYW5kb20oKSA+IDAuMyB9LFxyXG4gICAgICAgIHsgcGVyaW9kOiA5LCB0aW1lOiAnMTg6MzAtMTk6MTUnLCBhdmFpbGFibGU6IE1hdGgucmFuZG9tKCkgPiAwLjMgfSxcclxuICAgICAgICB7IHBlcmlvZDogMTAsIHRpbWU6ICcxOToyNS0yMDoxMCcsIGF2YWlsYWJsZTogTWF0aC5yYW5kb20oKSA+IDAuMyB9XHJcbiAgICAgIF1cclxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogc2xvdHMgfSlcclxuICAgIH0sXHJcbiAgICBib29rQ2xhc3Nyb29tOiAocm9vbUlkOiBzdHJpbmcsIGRhdGE6IHsgZGF0ZTogc3RyaW5nOyBwZXJpb2RzOiBudW1iZXJbXTsgcmVhc29uPzogc3RyaW5nIH0pID0+IHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7XHJcbiAgICAgICAgY29kZTogMjAwLFxyXG4gICAgICAgIG1lc3NhZ2U6ICdcdTk4ODRcdTdFQTZcdTYyMTBcdTUyOUYnLFxyXG4gICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgIHN1Y2Nlc3M6IHRydWUsXHJcbiAgICAgICAgICBib29raW5nSWQ6ICdjYicgKyBEYXRlLm5vdygpLFxyXG4gICAgICAgICAgbWVzc2FnZTogJ1x1NjU1OVx1NUJBNFx1OTg4NFx1N0VBNlx1NjIxMFx1NTI5RidcclxuICAgICAgICB9XHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgbXlDbGFzc3Jvb21Cb29raW5nczogKCkgPT4ge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHtcclxuICAgICAgICBjb2RlOiAyMDAsXHJcbiAgICAgICAgZGF0YTogW1xyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogJ2NiMScsXHJcbiAgICAgICAgICAgIHJvb21JZDogJzUnLFxyXG4gICAgICAgICAgICByb29tTnVtYmVyOiAnQTIwMicsXHJcbiAgICAgICAgICAgIGJ1aWxkaW5nOiAnXHU0RTNCXHU2OTdDJyxcclxuICAgICAgICAgICAgZmxvb3I6IDIsXHJcbiAgICAgICAgICAgIGRhdGU6ICcyMDI2LTA0LTI2JyxcclxuICAgICAgICAgICAgcGVyaW9kczogWzUsIDZdLFxyXG4gICAgICAgICAgICB0aW1lOiAnMTM6MzAtMTU6MTAnLFxyXG4gICAgICAgICAgICByZWFzb246ICdcdTc5M0VcdTU2RTJcdTZEM0JcdTUyQTgnLFxyXG4gICAgICAgICAgICBzdGF0dXM6ICdhY3RpdmUnLFxyXG4gICAgICAgICAgICBib29rZWRBdDogJzIwMjYtMDQtMjUgMTA6MzA6MDAnXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAge1xyXG4gICAgICAgICAgICBpZDogJ2NiMicsXHJcbiAgICAgICAgICAgIHJvb21JZDogJzEyJyxcclxuICAgICAgICAgICAgcm9vbU51bWJlcjogJ0IzMDEnLFxyXG4gICAgICAgICAgICBidWlsZGluZzogJ1x1NEZFMVx1NjA2Rlx1Njk3QycsXHJcbiAgICAgICAgICAgIGZsb29yOiAzLFxyXG4gICAgICAgICAgICBkYXRlOiAnMjAyNi0wNC0yNCcsXHJcbiAgICAgICAgICAgIHBlcmlvZHM6IFsxLCAyXSxcclxuICAgICAgICAgICAgdGltZTogJzA4OjAwLTA5OjQwJyxcclxuICAgICAgICAgICAgcmVhc29uOiAnXHU1QzBGXHU3RUM0XHU4QkE4XHU4QkJBJyxcclxuICAgICAgICAgICAgc3RhdHVzOiAnY29tcGxldGVkJyxcclxuICAgICAgICAgICAgYm9va2VkQXQ6ICcyMDI2LTA0LTIzIDE0OjIwOjAwJ1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBjYW5jZWxDbGFzc3Jvb21Cb29raW5nOiAoYm9va2luZ0lkOiBzdHJpbmcpID0+IHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgbWVzc2FnZTogJ1x1NTNENlx1NkQ4OFx1NjIxMFx1NTI5RicsIGRhdGE6IHsgc3VjY2VzczogdHJ1ZSB9IH0pXHJcbiAgICB9LFxyXG4gICAgZXhhbXM6ICgpID0+IFByb21pc2UucmVzb2x2ZSh7IGNvZGU6IDIwMCwgZGF0YTogW10gfSksXHJcbiAgICBidXNTY2hlZHVsZTogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiBbXSB9KSxcclxuICAgIGNhcmRCYWxhbmNlOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IHsgYmFsYW5jZTogMTAwIH0gfSksXHJcbiAgICBjYXJkVHJhbnNhY3Rpb25zOiAoKSA9PiBQcm9taXNlLnJlc29sdmUoeyBjb2RlOiAyMDAsIGRhdGE6IFtdIH0pLFxyXG4gICAgbWFwRGF0YTogKCkgPT4gUHJvbWlzZS5yZXNvbHZlKHsgY29kZTogMjAwLCBkYXRhOiBjYW1wdXNNYXBEYXRhIH0pXHJcbiAgfVxyXG59XHJcblxyXG4vLyBcdTlFRDhcdThCQTRcdTVCRkNcdTUxRkFNb2NrXHU5MTREXHU3RjZFXHJcbmV4cG9ydCBkZWZhdWx0IE1vY2tcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvVCxPQUFPLFVBQVU7QUFLclUsSUFBSSxLQUFLLElBQUksVUFBVSxXQUFXLFFBQVc7QUFDM0MsT0FBSyxJQUFJLFVBQVUsU0FBUyxLQUFLLElBQUksVUFBVTtBQUMvQyxPQUFLLElBQUksVUFBVSxPQUFPLFdBQVk7QUFDcEMsVUFBTSxNQUFNLEtBQUs7QUFFakIsUUFBSSxRQUNGLElBQUksU0FBUyxVQUFVLEtBQ3ZCLElBQUksU0FBUyxnQkFBZ0IsS0FDN0IsSUFBSSxTQUFTLGlCQUFpQixLQUM5QixJQUFJLFNBQVMsa0JBQWtCLEtBQy9CLElBQUksU0FBUyxrQkFBa0IsS0FDL0IsSUFBSSxTQUFTLG9CQUFvQixLQUNqQyxJQUFJLFNBQVMsYUFBYSxLQUMxQixJQUFJLFNBQVMsaUJBQWlCLEtBQzlCLElBQUksU0FBUyxRQUFRLEtBQ3JCLElBQUksU0FBUyxRQUFRLEtBQ3JCLElBQUksU0FB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
