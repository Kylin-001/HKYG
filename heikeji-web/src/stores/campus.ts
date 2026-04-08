import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  CourseSchedule, GradeRecord, GPAInfo, Classroom,
  TimeSlot, DormitoryInfo, RepairRecord, LibraryBookSearchResult
} from '@/types/campus'
import * as campusApi from '@/api/campus'

interface LibraryData {
  results: LibraryBookSearchResult[]
  total: number
}

interface MapData {
  buildings: Array<{ id: string; name: string; position: { lat: number; lng: number }; [key: string]: unknown }>
  routes: Array<{ id: string; [key: string]: unknown }>
}

export const useCampusStore = defineStore('campus', () => {
  const schedule = ref<CourseSchedule[]>([])
  const grades = ref<GradeRecord[]>([])
  const gpa = ref<GPAInfo | null>(null)
  const classrooms = ref<Classroom[]>([])
  const timeSlots = ref<TimeSlot[]>([])
  const dormitory = ref<DormitoryInfo | null>(null)
  const repairList = ref<RepairRecord[]>([])
  const libraryBooks = ref<LibraryData | null>(null)
  const mapData = ref<MapData | null>(null)
  const classroomTimeSlots = ref<TimeSlot[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchSchedule(semester?: string) {
    try {
      loading.value = true
      const res = await campusApi.getSchedule(semester)
      schedule.value = res || []
      return schedule.value
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取课表失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchGrades(semester?: string) {
    try {
      loading.value = true
      const res = await campusApi.getGrades(semester)
      grades.value = res || []
      return grades.value
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取成绩失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchGPA() {
    try {
      const res = await campusApi.getGPA()
      gpa.value = res
      return gpa.value
    } catch (err) {
      console.error('获取GPA失败:', err)
      return null
    }
  }

  async function fetchClassrooms(params?: {
    building?: string
    floor?: number
    type?: string
    date?: string
  }) {
    try {
      loading.value = true
      const res = await campusApi.getClassrooms(params)
      classrooms.value = res || []
      return classrooms.value
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取教室失败'
      error.value = message
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDormitory() {
    loading.value = true
    try { dormitory.value = await campusApi.getDormitoryInfo(); error.value = null }
    catch (err: unknown) { const message = err instanceof Error ? err.message : '获取宿舍信息失败'; error.value = message }
    finally { loading.value = false }
  }

  async function fetchClassroomTimeSlots(roomId: string, date?: string) {
    loading.value = true
    try { classroomTimeSlots.value = await campusApi.getClassroomTimeSlots(roomId, date || new Date().toISOString().split('T')[0]); error.value = null }
    catch (err: unknown) { const message = err instanceof Error ? err.message : '获取时间段失败'; error.value = message }
    finally { loading.value = false }
  }

  async function bookClassroomRoom(roomId: string, data?: { date: string; periods: number[]; reason?: string }) {
    loading.value = true
    try { const res = await campusApi.bookClassroom(roomId, data || { date: new Date().toISOString().split('T')[0], periods: [1, 2] }); ElMessage.success('预约成功'); return res }
    catch (err: unknown) { const message = err instanceof Error ? err.message : '预约失败'; ElMessage.error(message); throw err }
    finally { loading.value = false }
  }

  async function submitRepairRequest(data: Omit<RepairRecord, 'id' | 'status' | 'submittedAt' | 'processedAt' | 'handler'>) {
    try { const res = await campusApi.submitRepair(data); ElMessage.success('报修提交成功'); return res }
    catch (err: unknown) { const message = err instanceof Error ? err.message : '提交失败'; ElMessage.error(message); throw err }
  }

  async function fetchRepairList(status?: string) {
    try { repairList.value = await campusApi.getRepairs(status) }
    catch (err: unknown) { if (err instanceof Error) ElMessage.error(err.message) }
  }

  async function rechargeElectricBalance(amount: number) {
    try { const res = await campusApi.rechargeElectric(amount); ElMessage.success(`充值成功，余额：${res.balance}元`); return res }
    catch (err: unknown) { const message = err instanceof Error ? err.message : '充值失败'; ElMessage.error(message); throw err }
  }

  async function searchLibraryBooks(keyword: string) {
    loading.value = true
    try { libraryBooks.value = await campusApi.searchBooks(keyword); error.value = null }
    catch (err: unknown) { const message = err instanceof Error ? err.message : '搜索图书失败'; error.value = message }
    finally { loading.value = false }
  }

  async function fetchMapPlaces() {
    loading.value = true
    try { mapData.value = await campusApi.getCampusMapData(); error.value = null }
    catch (err: unknown) { const message = err instanceof Error ? err.message : '获取地图数据失败'; error.value = message }
    finally { loading.value = false }
  }

  return { schedule, grades, gpa, classrooms, timeSlots, dormitory, repairList, libraryBooks, mapData, classroomTimeSlots, loading, error, fetchSchedule, fetchGrades, fetchGPA, fetchClassrooms, fetchDormitory, fetchClassroomTimeSlots, bookClassroomRoom, submitRepairRequest, fetchRepairList, rechargeElectricBalance, searchLibraryBooks, fetchMapPlaces }
})
