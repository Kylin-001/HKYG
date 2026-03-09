import request from '@/utils/request'
import type { 
  CampusBuilding, 
  CampusClassroom, 
  CampusClassroomSchedule,
  ClassroomSearchParams,
  CampusAnnouncementCategory,
  CampusAnnouncement,
  AnnouncementSearchParams
} from '@/types/campus'

export function getBuildings() {
  return request({
    url: '/api/campus/buildings',
    method: 'get'
  })
}

export function getClassrooms(buildingId: number) {
  return request({
    url: `/api/campus/classrooms/${buildingId}`,
    method: 'get'
  })
}

export function searchAvailableClassrooms(params: ClassroomSearchParams) {
  return request({
    url: '/api/campus/classrooms/available',
    method: 'get',
    params
  })
}

export function bookClassroom(data: any) {
  return request({
    url: '/api/campus/classrooms/book',
    method: 'post',
    data
  })
}

export function cancelBooking(id: number) {
  return request({
    url: `/api/campus/classrooms/book/${id}/cancel`,
    method: 'put'
  })
}

export function getClassroomSchedule(classroomId: number, date: string) {
  return request({
    url: `/api/campus/classrooms/${classroomId}/schedule`,
    method: 'get',
    params: { date }
  })
}

export function getAnnouncementCategories() {
  return request({
    url: '/api/campus/announcement/categories',
    method: 'get'
  })
}

export function getAnnouncements(params: AnnouncementSearchParams) {
  return request({
    url: '/api/campus/announcements',
    method: 'get',
    params
  })
}

export function getAnnouncementById(id: number) {
  return request({
    url: `/api/campus/announcements/${id}`,
    method: 'get'
  })
}

export function createAnnouncement(data: CampusAnnouncement) {
  return request({
    url: '/api/campus/announcements',
    method: 'post',
    data
  })
}

export function updateAnnouncement(data: CampusAnnouncement) {
  return request({
    url: `/api/campus/announcements/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteAnnouncement(id: number) {
  return request({
    url: `/api/campus/announcements/${id}`,
    method: 'delete'
  })
}

export function getPublishedAnnouncements() {
  return request({
    url: '/api/campus/announcements/published',
    method: 'get'
  })
}

export function getTopAnnouncements() {
  return request({
    url: '/api/campus/announcements/top',
    method: 'get'
  })
}
