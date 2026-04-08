// ============================================
// 校园服务类型定义
// ============================================

export interface CourseSchedule {
  weekDay: WeekDay
  periods: PeriodInfo[]
}

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface PeriodInfo {
  period: number
  course: CourseInfo | null
}

export interface CourseInfo {
  id: string
  name: string
  teacher: string
  classroom: string
  weeks: string
  color: string
}

export interface GradeRecord {
  id: string
  courseName: string
  credit: number
  score: number
  gradePoint: number
  level: GradeLevel
  semester: string
  category: string
}

export type GradeLevel = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'F'

export interface GPAInfo {
  gpa: number
  totalCredits: number
  totalCourses: number
  avgScore: number
  rank?: number
  classRank?: string
}

export interface Classroom {
  id: string
  building: string
  roomNumber: string
  floor: number
  type: ClassroomType
  capacity: number
  facilities: string[]
  status: ClassroomStatus
  image?: string
}

export type ClassroomType = 'lecture' | 'lab' | 'computer' | 'multimedia' | 'meeting'

export type ClassroomStatus = 'available' | 'occupied' | 'maintenance'

export interface TimeSlot {
  period: number
  startTime: string
  endTime: string
  available: boolean
}

export interface DormitoryInfo {
  building: string
  roomNumber: string
  floor: number
  bedNumber: string
  roommates: Roommate[]
  utilities: UtilityInfo
  repairs: RepairRecord[]
}

export interface Roommate {
  id: string
  name: string
  department: string
  major: string
  avatar?: string
  online: boolean
}

export interface UtilityInfo {
  electricBalance: number
  electricUsage: number
  waterBalance: number
  waterUsage: number
  lastRechargeDate?: string
}

export interface RepairRecord {
  id: string
  type: RepairType
  description: string
  status: RepairStatus
  submittedAt: string
  processedAt?: string
  handler?: string
  images?: string[]
  reply?: string
}

export type RepairType = 'electric' | 'plumbing' | 'furniture' | 'network' | 'door' | 'sanitation' | 'other'

export type RepairStatus = 'pending' | 'processing' | 'completed' | 'rejected'

export interface LibraryBookSearchResult {
  id: string
  title: string
  author: string
  isbn: string
  publisher: string
  year: number
  available: boolean
  location: string
  callNumber: string
  coverUrl?: string
}
