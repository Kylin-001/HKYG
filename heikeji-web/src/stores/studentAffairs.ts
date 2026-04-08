import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  LeaveApplication, AidApplication, MilitaryUniformOrder,
  CampusCardInfo, RechargeRecord, AidPolicy, PendingTask
} from '@/types/studentAffairs'
import * as api from '@/api/studentAffairs'

export const useStudentAffairsStore = defineStore('studentAffairs', () => {
  const leaveList = ref<LeaveApplication[]>([])
  const aidList = ref<AidApplication[]>([])
  const militaryOrders = ref<MilitaryUniformOrder[]>([])
  const campusCard = ref<CampusCardInfo | null>(null)
  const rechargeRecords = ref<RechargeRecord[]>([])
  const aidPolicies = ref<AidPolicy[]>([])
  const pendingTasks = ref<PendingTask[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchPendingTasks() {
    try {
      loading.value = true
      pendingTasks.value = await api.getPendingTasks()
      error.value = null
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取待办失败'
    } finally {
      loading.value = false
    }
  }

  async function fetchLeaveApplications(status?: string) {
    try {
      loading.value = true
      leaveList.value = await api.getLeaveApplications(status)
      error.value = null
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取请假记录失败'
    } finally {
      loading.value = false
    }
  }

  async function submitLeave(data: Omit<LeaveApplication, 'id' | 'status' | 'createdAt'>) {
    try {
      loading.value = true
      const result = await api.submitLeaveApplication(data)
      await fetchLeaveApplications()
      return result
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '提交请假申请失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function cancelLeave(id: string) {
    try {
      await api.cancelLeaveApplication(id)
      await fetchLeaveApplications()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '取消请假失败'
      throw err
    }
  }

  async function fetchAidApplications() {
    try {
      loading.value = true
      aidList.value = await api.getAidApplications()
      error.value = null
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取助学金信息失败'
    } finally {
      loading.value = false
    }
  }

  async function submitAid(data: Omit<AidApplication, 'id' | 'status' | 'submittedAt'>) {
    try {
      loading.value = true
      const result = await api.submitAidApplication(data)
      await fetchAidApplications()
      return result
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '提交助学金申请失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchMilitaryOrders() {
    try {
      loading.value = true
      militaryOrders.value = await api.getMilitaryOrders()
      error.value = null
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取军训服装订单失败'
    } finally {
      loading.value = false
    }
  }

  async function submitMilitaryOrder(data: Omit<MilitaryUniformOrder, 'id' | 'status' | 'orderDate'>) {
    try {
      loading.value = true
      const result = await api.submitMilitaryOrder(data)
      await fetchMilitaryOrders()
      return result
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '提交军训服装预定失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchCampusCard() {
    try {
      campusCard.value = await api.getCampusCardInfo()
      error.value = null
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取校园卡信息失败'
    }
  }

  async function rechargeCard(amount: number, method: string) {
    try {
      loading.value = true
      const record = await api.rechargeCampusCard(amount, method)
      await fetchCampusCard()
      await fetchRechargeRecords()
      return record
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '充值失败'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function reportLost() {
    try {
      await api.reportLostCard()
      await fetchCampusCard()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '挂失失败'
      throw err
    }
  }

  async function fetchRechargeRecords() {
    try {
      rechargeRecords.value = await api.getRechargeRecords()
    } catch (err: unknown) {
      console.error('获取充值记录失败:', err)
    }
  }

  async function fetchAidPolicies() {
    try {
      loading.value = true
      aidPolicies.value = await api.getAidPolicies()
      error.value = null
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : '获取资助政策失败'
    } finally {
      loading.value = false
    }
  }

  return {
    leaveList, aidList, militaryOrders, campusCard,
    rechargeRecords, aidPolicies, pendingTasks,
    loading, error,
    fetchPendingTasks, fetchLeaveApplications, submitLeave, cancelLeave,
    fetchAidApplications, submitAid, fetchMilitaryOrders, submitMilitaryOrder,
    fetchCampusCard, rechargeCard, reportLost, fetchRechargeRecords,
    fetchAidPolicies
  }
})
