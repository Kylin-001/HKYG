export interface CampusBuilding {
  id: number
  name: string
  location: string
  floorCount: number
  description: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface CampusClassroom {
  id: number
  buildingId: number
  name: string
  floor: number
  capacity: number
  equipment: string
  description: string
  status: number
  createdAt: string
  updatedAt: string
}

export interface CampusClassroomSchedule {
  id: number
  classroomId: number
  date: string
  startTime: string
  endTime: string
  courseName: string
  teacherName: string
  bookedBy: number
  bookingType: number
  status: number
  createdAt: string
  updatedAt: string
}

export interface ClassroomSearchParams {
  buildingId?: number
  date?: string
  startTime?: string
  endTime?: string
  weekday?: number
  classSection?: number
}

export interface CampusAnnouncementCategory {
  id: number
  name: string
  icon: string
  sortOrder: number
  status: number
  createdAt: string
  updatedAt: string
}

export interface CampusAnnouncement {
  id: number
  title: string
  content: string
  categoryId: number
  priority: number
  isTop: number
  publishTime: string
  expireTime: string
  publisherId: number
  viewCount: number
  status: number
  createdAt: string
  updatedAt: string
}

export interface AnnouncementSearchParams {
  title?: string
  categoryId?: number
  status?: number
  pageNum: number
  pageSize: number
}
