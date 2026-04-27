import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import type {
  CourseSchedule, GradeRecord, GPAInfo, Classroom,
  TimeSlot, DormitoryInfo, RepairRecord, LibraryBookSearchResult, MapPlace,
  AccessRecord, HygieneRecord, TemporaryPassword, VisitorRecord,
  DormSwapRequest, LateReturnRecord, DormBill
} from '@/types/campus'
import type { ReminderSettings, BorrowRecord, SeatBookingRecord, SeatInfo, ClassroomBookingRecord, AddCourseRequest } from '@/api/campus'
import * as campusApi from '@/api/campus'
import i18n from '@/locales'

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
  const mapPlaces = ref<MapPlace[]>([])
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
    try { dormitory.value = await campusApi.getDormitoryInfo(); error.value = null } catch (err: unknown) { const message = err instanceof Error ? err.message : '获取宿舍信息失败'; error.value = message } finally { loading.value = false }
  }

  async function fetchClassroomTimeSlots(roomId: string, date?: string) {
    loading.value = true
    try { classroomTimeSlots.value = await campusApi.getClassroomTimeSlots(roomId, date || new Date().toISOString().split('T')[0]); error.value = null } catch (err: unknown) { const message = err instanceof Error ? err.message : '获取时间段失败'; error.value = message } finally { loading.value = false }
  }

  async function bookClassroomRoom(roomId: string, data?: { date: string; periods: number[]; reason?: string }) {
    loading.value = true
    const { t } = i18n.global
    try { const res = await campusApi.bookClassroom(roomId, data || { date: new Date().toISOString().split('T')[0], periods: [1, 2] }); ElMessage.success(t('campusService.bookSuccess')); return res } catch (err: unknown) { const message = err instanceof Error ? err.message : t('campusService.bookFailed'); ElMessage.error(message); throw err } finally { loading.value = false }
  }

  async function submitRepairRequest(data: Omit<RepairRecord, 'id' | 'status' | 'submittedAt' | 'processedAt' | 'handler'>) {
    const { t } = i18n.global
    try { const res = await campusApi.submitRepair(data); ElMessage.success(t('campusService.repairSubmitSuccess')); return res } catch (err: unknown) { const message = err instanceof Error ? err.message : t('campusService.submitFailed'); ElMessage.error(message); throw err }
  }

  async function fetchRepairList(status?: string) {
    try { repairList.value = await campusApi.getRepairs(status) } catch (err: unknown) { if (err instanceof Error) ElMessage.error(err.message) }
  }

  async function rechargeElectricBalance(amount: number) {
    const { t } = i18n.global
    try { const res = await campusApi.rechargeElectric(amount); ElMessage.success(t('campusService.rechargeSuccess', { balance: res.balance })); return res } catch (err: unknown) { const message = err instanceof Error ? err.message : t('campusService.rechargeFailed'); ElMessage.error(message); throw err }
  }

  async function searchLibraryBooks(keyword: string) {
    loading.value = true
    try { libraryBooks.value = await campusApi.searchBooks(keyword); error.value = null } catch (err: unknown) { const message = err instanceof Error ? err.message : '搜索图书失败'; error.value = message } finally { loading.value = false }
  }

  async function fetchMapPlaces() {
    loading.value = true
    try {
      const data = await campusApi.getCampusMapData()
      mapData.value = data
      // 转换 buildings 到 mapPlaces
      if (data?.buildings) {
        mapPlaces.value = data.buildings.map((b: any) => ({
          id: b.id,
          name: b.name,
          address: b.address || b.name,
          category: b.category || 'other',
          longitude: b.position?.lng || b.longitude,
          latitude: b.position?.lat || b.latitude,
          tags: b.tags || [],
          openTime: b.openTime,
          phone: b.phone,
          description: b.description
        }))
      }
      error.value = null
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取地图数据失败'
      error.value = message
    } finally {
      loading.value = false
    }
  }

  async function addCourseItem(data: AddCourseRequest) {
    const { t } = i18n.global
    try {
      loading.value = true
      const newCourse = await campusApi.addCourse(data)
      schedule.value.push(newCourse)
      ElMessage.success(t('campus.addCourseSuccess'))
      return newCourse
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('campus.addCourseFailed')
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCourseItem(courseId: string, data: Partial<AddCourseRequest>) {
    const { t } = i18n.global
    try {
      loading.value = true
      const updatedCourse = await campusApi.updateCourse(courseId, data)
      const index = schedule.value.findIndex(s => s.id === courseId)
      if (index !== -1) {
        schedule.value[index] = updatedCourse
      }
      ElMessage.success(t('campus.updateCourseSuccess'))
      return updatedCourse
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('campus.updateCourseFailed')
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCourseItem(courseId: string) {
    const { t } = i18n.global
    try {
      loading.value = true
      await campusApi.deleteCourse(courseId)
      schedule.value = schedule.value.filter(s => s.id !== courseId)
      ElMessage.success(t('campus.deleteCourseSuccess'))
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('campus.deleteCourseFailed')
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function importScheduleFile(file: File) {
    const { t } = i18n.global
    try {
      loading.value = true
      const result = await campusApi.importSchedule(file)
      if (result.success) {
        ElMessage.success(`成功导入 ${result.imported} 门课程`)
        // 刷新课表
        await fetchSchedule()
      } else {
        ElMessage.warning(`导入完成：成功 ${result.imported} 门，失败 ${result.failed} 门`)
      }
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '导入失败'
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function shareScheduleLink(expireDays?: number) {
    try {
      loading.value = true
      const result = await campusApi.shareSchedule(expireDays)
      ElMessage.success('分享链接已生成')
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '生成分享链接失败'
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const reminderSettings = ref<ReminderSettings>({
    enabled: false,
    reminderMinutes: 15,
    reminderMethod: 'notification'
  })

  // 图书馆相关状态
  const myBorrows = ref<BorrowRecord[]>([])
  const myFavorites = ref<LibraryBookSearchResult[]>([])
  const librarySeats = ref<SeatInfo[]>([])
  const mySeatBookings = ref<SeatBookingRecord[]>([])

  async function fetchReminderSettings() {
    try {
      const result = await campusApi.getReminderSettings()
      reminderSettings.value = result
      return result
    } catch (err: unknown) {
      console.error('获取提醒设置失败:', err)
    }
  }

  async function updateReminder(settings: ReminderSettings) {
    try {
      loading.value = true
      const result = await campusApi.updateReminderSettings(settings)
      reminderSettings.value = result
      ElMessage.success('提醒设置已保存')
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '保存提醒设置失败'
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 图书馆借阅相关方法
  async function fetchMyBorrows() {
    try {
      loading.value = true
      const result = await campusApi.getMyBorrows()
      myBorrows.value = result
      return result
    } catch (err: unknown) {
      console.error('获取借阅记录失败:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function borrowBookItem(bookId: string, days?: number) {
    try {
      loading.value = true
      const result = await campusApi.borrowBook({ bookId, days })
      ElMessage.success(`借阅成功，请在 ${result.dueDate} 前归还`)
      await fetchMyBorrows()
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '借阅失败'
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function returnBookItem(borrowId: string) {
    try {
      loading.value = true
      const result = await campusApi.returnBook(borrowId)
      if (result.overdueDays && result.overdueDays > 0) {
        ElMessage.warning(`归还成功，逾期 ${result.overdueDays} 天，罚款 ${result.fine} 元`)
      } else {
        ElMessage.success('归还成功')
      }
      await fetchMyBorrows()
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '归还失败'
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function renewBookItem(borrowId: string) {
    try {
      loading.value = true
      const result = await campusApi.renewBook(borrowId)
      ElMessage.success(`续借成功，新的归还日期为 ${result.newDueDate}`)
      await fetchMyBorrows()
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '续借失败'
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMyFavorites() {
    try {
      const result = await campusApi.getMyFavorites()
      myFavorites.value = result
      return result
    } catch (err: unknown) {
      console.error('获取收藏列表失败:', err)
      return []
    }
  }

  async function addBookToFavorites(bookId: string) {
    try {
      await campusApi.addToFavorites(bookId)
      ElMessage.success('已添加到收藏')
      await fetchMyFavorites()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '添加收藏失败'
      ElMessage.error(message)
      throw err
    }
  }

  async function removeBookFromFavorites(bookId: string) {
    try {
      await campusApi.removeFromFavorites(bookId)
      ElMessage.success('已取消收藏')
      await fetchMyFavorites()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '取消收藏失败'
      ElMessage.error(message)
      throw err
    }
  }

  // 教室预约相关状态
  const myClassroomBookings = ref<ClassroomBookingRecord[]>([])

  // 宿舍相关状态
  const accessRecords = ref<AccessRecord[]>([])
  const hygieneRecords = ref<HygieneRecord[]>([])
  const tempPasswords = ref<TemporaryPassword[]>([])
  const visitorRecords = ref<VisitorRecord[]>([])
  const dormSwapRequests = ref<DormSwapRequest[]>([])
  const lateReturnRecords = ref<LateReturnRecord[]>([])
  const dormBills = ref<DormBill[]>([])

  async function fetchMyClassroomBookings() {
    try {
      loading.value = true
      const result = await campusApi.getMyClassroomBookings()
      myClassroomBookings.value = result
      return result
    } catch (err: unknown) {
      console.error('获取教室预约记录失败:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function bookClassroom(roomId: string, date: string, periods: number[], reason: string) {
    const { t } = i18n.global
    try {
      loading.value = true
      const result = await campusApi.bookClassroom(roomId, { date, periods, reason })
      if (result.success) {
        ElMessage.success(t('campus.bookingSuccess', { room: roomId }))
        await fetchMyClassroomBookings()
      }
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('campus.bookingFailed')
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelClassroomBookingItem(bookingId: string) {
    const { t } = i18n.global
    try {
      loading.value = true
      const result = await campusApi.cancelClassroomBooking(bookingId)
      if (result.success) {
        ElMessage.success(t('campus.cancelBookingSuccess'))
        await fetchMyClassroomBookings()
      }
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('campus.cancelBookingFailed')
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 图书馆座位预约相关方法
  async function fetchLibrarySeats(floor: number) {
    try {
      loading.value = true
      const result = await campusApi.getSeatsByFloor(floor)
      librarySeats.value = result
      return result
    } catch (err: unknown) {
      console.error('获取座位信息失败:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function bookLibrarySeat(seatId: string, floor: number, date: string, startTime: string, endTime: string) {
    try {
      loading.value = true
      const result = await campusApi.bookSeat({ seatId, floor, date, startTime, endTime })
      ElMessage.success('座位预约成功')
      await fetchMySeatBookings()
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '预约失败'
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelLibrarySeatBooking(bookingId: string) {
    try {
      loading.value = true
      await campusApi.cancelSeatBooking(bookingId)
      ElMessage.success('预约已取消')
      await fetchMySeatBookings()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '取消预约失败'
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function checkInLibrarySeat(bookingId: string) {
    try {
      await campusApi.checkInSeat(bookingId)
      ElMessage.success('签到成功')
      await fetchMySeatBookings()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '签到失败'
      ElMessage.error(message)
      throw err
    }
  }

  async function checkOutLibrarySeat(bookingId: string) {
    try {
      await campusApi.checkOutSeat(bookingId)
      ElMessage.success('签退成功')
      await fetchMySeatBookings()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '签退失败'
      ElMessage.error(message)
      throw err
    }
  }

  async function fetchMySeatBookings() {
    try {
      const result = await campusApi.getMySeatBookings()
      mySeatBookings.value = result
      return result
    } catch (err: unknown) {
      console.error('获取座位预约记录失败:', err)
      return []
    }
  }

  // 宿舍相关方法
  async function fetchAccessRecords(params?: { startDate?: string; endDate?: string; limit?: number }) {
    try {
      loading.value = true
      const result = await campusApi.getAccessRecords(params)
      accessRecords.value = result
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取门禁记录失败'
      ElMessage.error(message)
      return []
    } finally {
      loading.value = false
    }
  }

  async function fetchHygieneRecords() {
    try {
      loading.value = true
      const result = await campusApi.getHygieneRecords()
      hygieneRecords.value = result
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取卫生评分失败'
      ElMessage.error(message)
      return []
    } finally {
      loading.value = false
    }
  }

  async function rechargeWaterBalance(amount: number) {
    const { t } = i18n.global
    try {
      const res = await campusApi.rechargeWater(amount)
      ElMessage.success(t('campusService.rechargeSuccess', { balance: res.balance }))
      return res
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : t('campusService.rechargeFailed')
      ElMessage.error(message)
      throw err
    }
  }

  async function generateTempPassword(data: { validHours?: number; usageLimit?: number; purpose?: string }) {
    try {
      loading.value = true
      const result = await campusApi.generateTempPassword(data)
      tempPasswords.value.unshift(result)
      ElMessage.success('临时密码生成成功')
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '生成临时密码失败'
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchTempPasswords() {
    try {
      const result = await campusApi.getTempPasswords()
      tempPasswords.value = result
      return result
    } catch (err: unknown) {
      console.error('获取临时密码列表失败:', err)
      return []
    }
  }

  async function disableTempPasswordItem(id: string) {
    try {
      await campusApi.disableTempPassword(id)
      const index = tempPasswords.value.findIndex(p => p.id === id)
      if (index !== -1) {
        tempPasswords.value[index].status = 'disabled'
      }
      ElMessage.success('临时密码已禁用')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '禁用临时密码失败'
      ElMessage.error(message)
      throw err
    }
  }

  async function submitVisitor(data: Omit<VisitorRecord, 'id' | 'status' | 'createdAt' | 'approvedBy' | 'approvedAt'>) {
    try {
      loading.value = true
      const result = await campusApi.submitVisitorRequest(data)
      visitorRecords.value.unshift(result)
      ElMessage.success('访客申请提交成功')
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '提交访客申请失败'
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchVisitorRecords() {
    try {
      loading.value = true
      const result = await campusApi.getVisitorRecords()
      visitorRecords.value = result
      return result
    } catch (err: unknown) {
      console.error('获取访客记录失败:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function cancelVisitorItem(id: string) {
    try {
      await campusApi.cancelVisitorRequest(id)
      const index = visitorRecords.value.findIndex(v => v.id === id)
      if (index !== -1) {
        visitorRecords.value[index].status = 'rejected'
      }
      ElMessage.success('访客申请已取消')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '取消访客申请失败'
      ElMessage.error(message)
      throw err
    }
  }

  // 宿舍调换申请
  async function submitDormSwap(data: Omit<DormSwapRequest, 'id' | 'status' | 'createdAt' | 'approvedBy' | 'approvedAt'>) {
    try {
      loading.value = true
      const result = await campusApi.submitDormSwapRequest(data)
      dormSwapRequests.value.unshift(result)
      ElMessage.success('宿舍调换申请提交成功')
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '提交申请失败'
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchDormSwapRequests() {
    try {
      loading.value = true
      const result = await campusApi.getDormSwapRequests()
      dormSwapRequests.value = result
      return result
    } catch (err: unknown) {
      console.error('获取调换申请失败:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  async function cancelDormSwapItem(id: string) {
    try {
      await campusApi.cancelDormSwapRequest(id)
      const index = dormSwapRequests.value.findIndex(r => r.id === id)
      if (index !== -1) {
        dormSwapRequests.value[index].status = 'rejected'
      }
      ElMessage.success('申请已取消')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '取消申请失败'
      ElMessage.error(message)
      throw err
    }
  }

  // 晚归记录
  async function fetchLateReturnRecords(params?: { startDate?: string; endDate?: string }) {
    try {
      loading.value = true
      const result = await campusApi.getLateReturnRecords(params)
      lateReturnRecords.value = result
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取晚归记录失败'
      ElMessage.error(message)
      return []
    } finally {
      loading.value = false
    }
  }

  async function reportLateReturnItem(id: string, reason: string) {
    try {
      loading.value = true
      await campusApi.reportLateReturn(id, reason)
      const index = lateReturnRecords.value.findIndex(r => r.id === id)
      if (index !== -1) {
        lateReturnRecords.value[index].status = 'reported'
      }
      ElMessage.success('晚归说明已提交')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '提交失败'
      ElMessage.error(message)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 宿舍费用账单
  async function fetchDormBills(type?: string) {
    try {
      loading.value = true
      const result = await campusApi.getDormBills(type)
      dormBills.value = result
      return result
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '获取账单失败'
      ElMessage.error(message)
      return []
    } finally {
      loading.value = false
    }
  }

  return { schedule, grades, gpa, classrooms, timeSlots, dormitory, repairList, libraryBooks, mapData, mapPlaces, classroomTimeSlots, loading, error, reminderSettings, myBorrows, myFavorites, librarySeats, mySeatBookings, myClassroomBookings, accessRecords, hygieneRecords, tempPasswords, visitorRecords, dormSwapRequests, lateReturnRecords, dormBills, fetchSchedule, fetchGrades, fetchGPA, fetchClassrooms, fetchDormitory, fetchClassroomTimeSlots, bookClassroomRoom, submitRepairRequest, fetchRepairList, rechargeElectricBalance, rechargeWaterBalance, searchLibraryBooks, fetchMapPlaces, addCourseItem, updateCourseItem, deleteCourseItem, importScheduleFile, shareScheduleLink, fetchReminderSettings, updateReminder, fetchMyBorrows, borrowBookItem, returnBookItem, renewBookItem, fetchMyFavorites, addBookToFavorites, removeBookFromFavorites, fetchLibrarySeats, bookLibrarySeat, cancelLibrarySeatBooking, checkInLibrarySeat, checkOutLibrarySeat, fetchMySeatBookings, fetchMyClassroomBookings, bookClassroom, cancelClassroomBookingItem, fetchAccessRecords, fetchHygieneRecords, generateTempPassword, fetchTempPasswords, disableTempPasswordItem, submitVisitor, fetchVisitorRecords, cancelVisitorItem, submitDormSwap, fetchDormSwapRequests, cancelDormSwapItem, fetchLateReturnRecords, reportLateReturnItem, fetchDormBills }
})
