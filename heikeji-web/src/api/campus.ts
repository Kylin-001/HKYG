import { get, post } from '@/utils/request'
import type {
  CourseSchedule, GradeRecord, GPAInfo, Classroom,
  TimeSlot, DormitoryInfo, RepairRecord, LibraryBookSearchResult,
  AccessRecord, HygieneRecord, TemporaryPassword, VisitorRecord,
  DormSwapRequest, LateReturnRecord, DormBill
} from '@/types/campus'

export function getSchedule(semester?: string): Promise<CourseSchedule[]> {
  return get('/campus/schedule', { params: semester ? { semester } : undefined })
}

export interface AddCourseRequest {
  courseName: string
  teacher: string
  classroom: string
  dayOfWeek: number // 0-6, 0=周日
  startSection: number
  endSection: number
  startTime: string
  endTime: string
  color?: string
  semester?: string
}

export function addCourse(data: AddCourseRequest): Promise<CourseSchedule> {
  return post('/campus/schedule', data)
}

export function updateCourse(courseId: string, data: Partial<AddCourseRequest>): Promise<CourseSchedule> {
  return post(`/campus/schedule/${courseId}`, data)
}

export function deleteCourse(courseId: string): Promise<void> {
  return post(`/campus/schedule/${courseId}/delete`)
}

export interface ImportScheduleResponse {
  success: boolean
  imported: number
  failed: number
  errors?: string[]
}

export function importSchedule(file: File): Promise<ImportScheduleResponse> {
  const formData = new FormData()
  formData.append('file', file)
  return post('/campus/schedule/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export interface ShareScheduleResponse {
  shareId: string
  shareUrl: string
  expiresAt: string
}

export function shareSchedule(expireDays?: number): Promise<ShareScheduleResponse> {
  return post('/campus/schedule/share', { expireDays: expireDays || 7 })
}

export interface ReminderSettings {
  enabled: boolean
  reminderMinutes: number // 提前多少分钟提醒
  reminderMethod: 'notification' | 'email' | 'both'
}

export function getReminderSettings(): Promise<ReminderSettings> {
  return get('/campus/schedule/reminder')
}

export function updateReminderSettings(settings: ReminderSettings): Promise<ReminderSettings> {
  return post('/campus/schedule/reminder', settings)
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

export interface BookClassroomResponse {
  success: boolean
  message: string
  bookingId?: string
}

export function bookClassroom(roomId: string, data: { date: string; periods: number[]; reason?: string }): Promise<BookClassroomResponse> {
  return post(`/campus/classrooms/${roomId}/book`, data)
}

export interface ClassroomBookingRecord {
  id: string
  roomId: string
  roomNumber: string
  building: string
  floor: number
  date: string
  periods: number[]
  time: string
  reason: string
  status: 'active' | 'completed' | 'cancelled'
  bookedAt: string
}

export function getMyClassroomBookings(): Promise<ClassroomBookingRecord[]> {
  return get('/campus/classrooms/my-bookings')
}

export function cancelClassroomBooking(bookingId: string): Promise<{ success: boolean }> {
  return post('/campus/classrooms/cancel', { bookingId })
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

// 水费充值
export function rechargeWater(amount: number): Promise<{ balance: number }> {
  return post('/campus/water/recharge', { amount })
}

// 门禁记录
export function getAccessRecords(params?: { startDate?: string; endDate?: string; limit?: number }): Promise<AccessRecord[]> {
  return get('/campus/dormitory/access-records', { params })
}

// 卫生评分
export function getHygieneRecords(): Promise<HygieneRecord[]> {
  return get('/campus/dormitory/hygiene-records')
}

// 临时密码
export function generateTempPassword(data: { validHours?: number; usageLimit?: number; purpose?: string }): Promise<TemporaryPassword> {
  return post('/campus/dormitory/temp-password', data)
}

export function getTempPasswords(): Promise<TemporaryPassword[]> {
  return get('/campus/dormitory/temp-passwords')
}

export function disableTempPassword(id: string): Promise<{ success: boolean }> {
  return post(`/campus/dormitory/temp-passwords/${id}/disable`)
}

// 访客管理
export function submitVisitorRequest(data: Omit<VisitorRecord, 'id' | 'status' | 'createdAt' | 'approvedBy' | 'approvedAt'>): Promise<VisitorRecord> {
  return post('/campus/dormitory/visitors', data)
}

export function getVisitorRecords(): Promise<VisitorRecord[]> {
  return get('/campus/dormitory/visitors')
}

export function cancelVisitorRequest(id: string): Promise<{ success: boolean }> {
  return post(`/campus/dormitory/visitors/${id}/cancel`)
}

// 宿舍调换申请
export function submitDormSwapRequest(data: Omit<DormSwapRequest, 'id' | 'status' | 'createdAt' | 'approvedBy' | 'approvedAt'>): Promise<DormSwapRequest> {
  return post('/campus/dormitory/swap-requests', data)
}

export function getDormSwapRequests(): Promise<DormSwapRequest[]> {
  return get('/campus/dormitory/swap-requests')
}

export function cancelDormSwapRequest(id: string): Promise<{ success: boolean }> {
  return post(`/campus/dormitory/swap-requests/${id}/cancel`)
}

// 晚归记录
export function getLateReturnRecords(params?: { startDate?: string; endDate?: string }): Promise<LateReturnRecord[]> {
  return get('/campus/dormitory/late-returns', { params })
}

export function reportLateReturn(id: string, reason: string): Promise<{ success: boolean }> {
  return post(`/campus/dormitory/late-returns/${id}/report`, { reason })
}

// 宿舍费用账单
export function getDormBills(type?: string): Promise<DormBill[]> {
  return get('/campus/dormitory/bills', { params: type ? { type } : undefined })
}

export function getDormBillDetail(id: string): Promise<DormBill> {
  return get(`/campus/dormitory/bills/${id}`)
}

export function searchBooks(keyword: string, page?: number): Promise<{ results: LibraryBookSearchResult[]; total: number }> {
  return get('/campus/library/search', { params: { keyword, page } })
}

// 图书借阅相关接口
export interface BorrowRequest {
  bookId: string
  days?: number
}

export interface BorrowRecord {
  id: string
  bookId: string
  bookTitle: string
  bookCover: string
  borrowDate: string
  dueDate: string
  returnDate?: string
  status: 'borrowed' | 'returned' | 'overdue'
  renewCount: number
}

export function borrowBook(data: BorrowRequest): Promise<{ success: boolean; borrowId: string; dueDate: string }> {
  return post('/campus/library/borrow', data)
}

export function returnBook(borrowId: string): Promise<{ success: boolean; overdueDays?: number; fine?: number }> {
  return post('/campus/library/return', { borrowId })
}

export function renewBook(borrowId: string): Promise<{ success: boolean; newDueDate: string }> {
  return post('/campus/library/renew', { borrowId })
}

export function getMyBorrows(): Promise<BorrowRecord[]> {
  return get('/campus/library/my-borrows')
}

export function addToFavorites(bookId: string): Promise<{ success: boolean }> {
  return post('/campus/library/favorites', { bookId })
}

export function removeFromFavorites(bookId: string): Promise<{ success: boolean }> {
  return post('/campus/library/favorites/remove', { bookId })
}

export function getMyFavorites(): Promise<LibraryBookSearchResult[]> {
  return get('/campus/library/favorites')
}

// 座位预约相关接口
export interface SeatBookingRequest {
  seatId: string
  floor: number
  date: string
  startTime: string
  endTime: string
}

export interface SeatBookingRecord {
  id: string
  seatId: string
  seatNum: number
  floor: number
  date: string
  startTime: string
  endTime: string
  status: 'active' | 'completed' | 'cancelled'
  checkInTime?: string
  checkOutTime?: string
}

export interface SeatInfo {
  id: string
  num: number
  floor: number
  zone: string
  row: number
  status: 'available' | 'occupied' | 'reserved' | 'maintenance'
}

export function getSeatsByFloor(floor: number): Promise<SeatInfo[]> {
  return get('/campus/library/seats', { params: { floor } })
}

export function bookSeat(data: SeatBookingRequest): Promise<{ success: boolean; bookingId: string }> {
  return post('/campus/library/seats/book', data)
}

export function cancelSeatBooking(bookingId: string): Promise<{ success: boolean }> {
  return post('/campus/library/seats/cancel', { bookingId })
}

export function checkInSeat(bookingId: string): Promise<{ success: boolean }> {
  return post('/campus/library/seats/checkin', { bookingId })
}

export function checkOutSeat(bookingId: string): Promise<{ success: boolean }> {
  return post('/campus/library/seats/checkout', { bookingId })
}

export function getMySeatBookings(): Promise<SeatBookingRecord[]> {
  return get('/campus/library/my-bookings')
}

export interface CampusMapBuilding {
  id: string
  name: string
  position: { lat: number; lng: number }
  type?: string
}

export interface CampusMapRoute {
  id: string
  from: string
  to: string
  path: { lat: number; lng: number }[]
}

export function getCampusMapData(): Promise<{ buildings: CampusMapBuilding[]; routes: CampusMapRoute[] }> {
  return get('/campus/map/data')
}
