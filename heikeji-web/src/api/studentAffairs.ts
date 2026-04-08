import { get, post } from '@/utils/request'
import type {
  LeaveApplication, AidApplication, MilitaryUniformOrder,
  CampusCardInfo, RechargeRecord, AidPolicy, PendingTask
} from '@/types/studentAffairs'

// 请假相关
export function getLeaveApplications(status?: string): Promise<LeaveApplication[]> {
  return get('/student-affairs/leaves', { params: status ? { status } : undefined })
}

export function submitLeaveApplication(data: Omit<LeaveApplication, 'id' | 'status' | 'createdAt'>): Promise<LeaveApplication> {
  return post('/student-affairs/leaves', data)
}

export function cancelLeaveApplication(id: string): Promise<void> {
  return post(`/student-affairs/leaves/${id}/cancel`)
}

// 助学金相关
export function getAidApplications(): Promise<AidApplication[]> {
  return get('/student-affairs/aid')
}

export function submitAidApplication(data: Omit<AidApplication, 'id' | 'status' | 'submittedAt'>): Promise<AidApplication> {
  return post('/student-affairs/aid', data)
}

// 军训服装相关
export function getMilitaryOrders(): Promise<MilitaryUniformOrder[]> {
  return get('/student-affairs/military')
}

export function submitMilitaryOrder(data: Omit<MilitaryUniformOrder, 'id' | 'status' | 'orderDate'>): Promise<MilitaryUniformOrder> {
  return post('/student-affairs/military', data)
}

export function getVerificationCode(orderId: string): Promise<{ code: string }> {
  return get(`/student-affairs/military/${orderId}/verification-code`)
}

// 校园卡相关
export function getCampusCardInfo(): Promise<CampusCardInfo> {
  return get('/student-affairs/campus-card')
}

export function rechargeCampusCard(amount: number, method: string): Promise<RechargeRecord> {
  return post('/student-affairs/campus-card/recharge', { amount, method })
}

export function reportLostCard(): Promise<void> {
  return post('/student-affairs/campus-card/report-lost')
}

export function getRechargeRecords(): Promise<RechargeRecord[]> {
  return get('/student-affairs/campus-card/records')
}

// 资助政策
export function getAidPolicies(): Promise<AidPolicy[]> {
  return get('/student-affairs/policies')
}

// 待办事项
export function getPendingTasks(): Promise<PendingTask[]> {
  return get('/student-affairs/pending-tasks')
}

// 迎新服务
export function getFreshmanInfo(): Promise<{
  classInfo: { className: string; counselor: string; counselorPhone: string }
  dormitory: { building: string; room: string; bed: string }
  militaryStatus: string
}> {
  return get('/student-affairs/freshman/info')
}
