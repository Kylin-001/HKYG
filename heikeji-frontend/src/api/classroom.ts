/**
 * 空教室查询API
 */

import request from '@/utils/request'

export interface Classroom {
  id: string
  building: string
  name: string
  capacity: number
  floor: number
  type: 'lecture' | 'lab' | 'meeting' | 'exercise'
  equipment: string[]
}

export interface EmptyRoomQuery {
  date: string
  startTime?: string
  endTime?: string
  building?: string
  floor?: number
  capacity?: number
  type?: string
}

export interface TimeSlot {
  time: string
  status: 'available' | 'occupied' | 'reserved'
  courseName?: string
  className?: string
}

export interface ClassroomStatus {
  classroom: Classroom
  timeSlots: TimeSlot[]
}

/**
 * 获取教学楼列表
 */
export function getBuildings() {
  return request({
    url: '/api/classroom/buildings',
    method: 'get',
  })
}

/**
 * 获取教室列表
 */
export function getClassrooms(params?: {
  building?: string
  floor?: number
  type?: string
  capacity?: number
}) {
  return request({
    url: '/api/classroom/list',
    method: 'get',
    params,
  })
}

/**
 * 查询空教室
 */
export function queryEmptyRooms(params: EmptyRoomQuery) {
  return request({
    url: '/api/classroom/empty',
    method: 'get',
    params,
  })
}

/**
 * 获取教室详情
 */
export function getClassroomDetail(classroomId: string) {
  return request({
    url: `/api/classroom/${classroomId}`,
    method: 'get',
  })
}

/**
 * 获取教室使用状态
 */
export function getClassroomStatus(classroomId: string, date: string) {
  return request({
    url: `/api/classroom/${classroomId}/status`,
    method: 'get',
    params: { date },
  })
}

/**
 * 获取某天所有教室状态
 */
export function getAllClassroomStatus(date: string, timeSlots?: string[]) {
  return request({
    url: '/api/classroom/status/all',
    method: 'get',
    params: { date, timeSlots: timeSlots?.join(',') },
  })
}

/**
 * 预约教室
 */
export function reserveClassroom(data: {
  classroomId: string
  date: string
  startTime: string
  endTime: string
  purpose: string
  contactName: string
  contactPhone: string
}) {
  return request({
    url: '/api/classroom/reserve',
    method: 'post',
    data,
  })
}

/**
 * 取消预约
 */
export function cancelReservation(reservationId: string) {
  return request({
    url: `/api/classroom/reserve/${reservationId}`,
    method: 'delete',
  })
}

/**
 * 获取我的预约列表
 */
export function getMyReservations(params?: {
  status?: string
  startDate?: string
  endDate?: string
  page?: number
  size?: number
}) {
  return request({
    url: '/api/classroom/my-reservations',
    method: 'get',
    params,
  })
}

/**
 * 获取可选时间段
 */
export function getTimeSlots() {
  return request({
    url: '/api/classroom/time-slots',
    method: 'get',
  })
}
