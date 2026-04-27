/**
 * 学生事务相关 Mock 数据生成器
 */

import Mock from 'mockjs'

/**
 * 生成公告列表
 */
export function generateAnnouncements(count: number = 10) {
  return Mock.mock({
    [`data|${count}`]: [{
      id: '@id',
      title: '@ctitle(10, 30)',
      content: '@cparagraph(5, 15)',
      author: '@cname',
      'type|1': ['通知', '公告', '活动', '讲座', '比赛'],
      'isTop|1': [true, false, false, false],
      'isRead|1': [true, false, false, false],
      'attachments|0-3': [{
        id: '@id',
        name: '@ctitle(3, 8).pdf',
        url: '@url',
        size: '@integer(1000, 1000000)'
      }],
      createTime: '@datetime',
      updateTime: '@datetime'
    }]
  }).data
}

/**
 * 生成校园活动列表
 */
export function generateCampusActivities(count: number = 10) {
  return Mock.mock({
    [`data|${count}`]: [{
      id: '@id',
      title: '@ctitle(5, 15)',
      description: '@cparagraph(2, 5)',
      'type|1': ['学术讲座', '文体活动', '志愿服务', '社团活动', '就业指导', '创新创业'],
      location: '@pick(["教学楼A", "教学楼B", "图书馆报告厅", "体育馆", "学生活动中心"])',
      startTime: '@datetime',
      endTime: '@datetime',
      'capacity|10-200': 50,
      'registered|0-100': 30,
      organizer: '@ctitle(3, 8)',
      contact: '@string("number", 11)',
      'isRegistered|1': [true, false],
      cover: '@image("300x200", "#667eea", "#FFF", "Activity")',
      createTime: '@datetime'
    }]
  }).data
}

/**
 * 生成请假申请列表
 */
export function generateLeaveApplications(count: number = 5) {
  return Mock.mock({
    [`data|${count}`]: [{
      id: '@id',
      'type|1': ['事假', '病假', '年假', '其他'],
      startDate: '@date',
      endDate: '@date',
      'days|1-7': 3,
      reason: '@cparagraph(1, 3)',
      'status|1': ['pending', 'approved', 'rejected'],
      approver: '@cname',
      comment: '@csentence(5, 20)',
      attachments: [],
      createTime: '@datetime',
      updateTime: '@datetime'
    }]
  }).data
}

/**
 * 生成奖学金列表
 */
export function generateScholarships(count: number = 8) {
  return Mock.mock({
    [`data|${count}`]: [{
      id: '@id',
      name: '@pick(["国家奖学金", "国家励志奖学金", "校级一等奖学金", "校级二等奖学金", "校级三等奖学金", "单项奖学金"])',
      'amount|1000-10000': 5000,
      description: '@cparagraph(2, 4)',
      'requirements|3-5': ['@csentence(5, 15)'],
      startDate: '@date',
      endDate: '@date',
      'isApplied|1': [true, false],
      'status|1': ['not_started', 'in_progress', 'ended'],
      createTime: '@datetime'
    }]
  }).data
}

// 默认导出
export default {
  generateAnnouncements,
  generateCampusActivities,
  generateLeaveApplications,
  generateScholarships
}
