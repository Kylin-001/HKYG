// ============================================
// 校园服务类型定义
// ============================================

export interface Schedule {
  id: string
  dayOfWeek: number
  courseName: string
  teacher: string
  classroom: string
  timeSlot: string
  weeks: string
  color?: string
}

export interface Grade {
  id: string
  courseName: string
  credit: number
  score: number
  gpa: number
  semester: string
  type: 'required' | 'elective' | 'public'
}

export interface LibraryBook {
  id: string
  isbn: string
  title: string
  author: string
  publisher: string
  year: number
  category: string
  location: string
  status: 'available' | 'borrowed' | 'reserved'
  borrowCount: number
}

export interface LibraryReservation {
  id: string
  seatId: string
  seatNumber: string
  floor: number
  area: string
  date: string
  startTime: string
  endTime: string
  status: 'active' | 'completed' | 'cancelled'
}

export interface Classroom {
  id: string
  building: string
  roomNumber: string
  capacity: number
  type: 'lecture' | 'lab' | 'multimedia'
  facilities: string[]
  isAvailable: boolean
  currentUsage?: number
}

export interface RepairRecord {
  id: string
  type: 'electric' | 'plumbing' | 'furniture' | 'network' | 'other'
  location: string
  description: string
  images?: string[]
  status: 'pending' | 'processing' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  resolvedAt?: string
}

export interface DormitoryInfo {
  buildingId: string
  roomNumber: string
  bedNumber: string
  floor: number
  capacity: number
  currentOccupancy: number
  gender: 'male' | 'female'
  facilities: string[]
  electricityBalance: number
  waterBalance: number
}

export interface CourseSchedule {
  id: string
  dayOfWeek: number
  courseName: string
  teacher: string
  classroom: string
  startSection: number
  endSection: number
  startTime: string
  endTime: string
  weeks: string
  color?: string
}

export interface GradeRecord {
  id: string
  courseName: string
  credit: number
  score: number
  gpa: number
  semester: string
  type: 'required' | 'elective' | 'public'
}

export interface GPAInfo {
  totalGPA: number
  totalCredits: number
  semesterGPA: Record<string, number>
}

export interface TimeSlot {
  id: string
  roomId: string
  date: string
  period: number
  startTime: string
  endTime: string
  available: boolean
  reason?: string
}

export interface LibraryBookSearchResult {
  id: string
  title: string
  author: string
  publisher: string
  isbn: string
  status: 'available' | 'borrowed' | 'reserved'
  location: string
}
