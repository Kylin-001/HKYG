import { get, post, put } from '@/utils/request'
import type {
  CourseSchedule, GradeRecord, GPAInfo, Classroom,
  TimeSlot, DormitoryInfo, RepairRecord, LibraryBookSearchResult
} from '@/types/campus'

export function getSchedule(semester?: string): Promise<CourseSchedule[]> {
  return get('/campus/schedule', { params: semester ? { semester } : undefined })
}

export function getGrades(semester?: string): Promise<GradeRecord[]> {
  return get('/campus/grades', { params: semester ? { semester } : undefined })
}

export function getGPA(): Promise<GPAInfo> {
  return get('/campus/gpa')
}

export function getClassrooms(params?: {
  building?: string
  floor?: number
  type?: string
  date?: string
}): Promise<Classroom[]> {
  return get('/campus/classrooms', { params })
}

export function getClassroomTimeSlots(roomId: string, date: string): Promise<TimeSlot[]> {
  return get(`/campus/classrooms/${roomId}/slots`, { params: { date } })
}

export function bookClassroom(roomId: string, data: { date: string; periods: number[]; reason?: string }): Promise<any> {
  return post(`/campus/classrooms/${roomId}/book`, data)
}

export function getDormitoryInfo(): Promise<DormitoryInfo> {
  return get('/campus/dormitory')
}

export function submitRepair(data: Omit<RepairRecord, 'id' | 'status' | 'submittedAt' | 'processedAt' | 'handler'>): Promise<RepairRecord> {
  return post('/campus/repairs', data)
}

export function getRepairs(status?: string): Promise<RepairRecord[]> {
  return get('/campus/repairs', { params: status ? { status } : undefined })
}

export function rechargeElectric(amount: number): Promise<{ balance: number }> {
  return post('/campus/electric/recharge', { amount })
}

export function searchBooks(keyword: string, page?: number): Promise<{ results: LibraryBookSearchResult[]; total: number }> {
  return get('/campus/library/search', { params: { keyword, page } })
}

export function getCampusMapData(): Promise<{ buildings: any[]; routes: any[] }> {
  return get('/campus/map/data')
}
