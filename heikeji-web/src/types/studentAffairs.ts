// ==================== 请假申请相关 ====================
export interface LeaveApplication {
  id: string
  type: 'sick' | 'personal' | 'official' | 'other'
  reason: string
  startDate: string
  endDate: string
  startTime?: string // 开始时间段
  endTime?: string   // 结束时间段
  days: number       // 请假天数（自动计算）
  status: 'pending' | 'approved' | 'rejected' | 'cancelled'
  approver?: string  // 审批人（辅导员/班主任）
  approvedAt?: string
  rejectReason?: string
  createdAt: string
  attachments?: string[]  // 证明材料URL列表
  semesterTotalDays?: number  // 学期累计请假天数
}

export interface LeaveFormData {
  type: LeaveApplication['type']
  reason: string
  startDate: string
  endDate: string
  startTime?: string
  endTime?: string
  attachments?: File[]
}

// ==================== 助学金申请相关 ====================
export interface FamilyMember {
  id: string
  name: string
  relation: string  // 关系：父亲/母亲/兄弟/姐妹等
  age?: number
  occupation?: string  // 职业
  income?: number     // 年收入
  healthStatus?: string  // 健康状况
}

export interface AidApplication {
  id: string
  type: 'national' | 'school' | 'temporary' | 'workstudy'
  difficultyLevel: 'first' | 'second' | 'third'  // 困难等级
  amount: number  // 助学金金额（根据等级自动计算）
  status: 'submitted' | 'reviewing' | 'publicized' | 'approved' | 'rejected' | 'issued'
  submittedAt: string
  reviewedAt?: string
  issuedAt?: string  // 发放时间
  documents: string[]  // 证明材料URL
  familyInfo: {
    members: FamilyMember[]
    annualIncome: number  // 家庭年收入
    perCapitaIncome: number  // 人均年收入
    specialTypes: string[]  // 特殊困难类型
  }
  reviewerComment?: string
  rejectReason?: string
  expectedIssueDate?: string  // 预计发放时间
}

export interface AidFormData {
  type: AidApplication['type']
  familyInfo: AidApplication['familyInfo']
  documents?: File[]
}

// 军训服装相关接口保持不变
export interface MilitaryUniformOrder {
  id: string
  studentName: string
  studentId: string
  items: MilitaryOrderItem[]  // 预定的服装项目列表
  totalAmount: number  // 总金额
  deliveryMethod: 'pickup' | 'dormitory'  // 配送方式
  paymentMethod: 'campus_card' | 'wechat' | 'alipay'  // 支付方式
  status: 'ordered' | 'paid' | 'ready' | 'picked_up' | 'cancelled'
  verificationCode?: string
  orderDate: string
  paidAt?: string
  pickupDate?: string
  cancelReason?: string
}

export interface MilitaryOrderItem {
  type: 'uniform' | 'hat' | 'belt' | 'shoes' | 'tshirt'
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL'
  quantity: number
  unitPrice: number
  totalPrice: number
}

// 尺码对照表
export interface SizeChart {
  size: string
  height: string    // 身高范围
  weight: string    // 体重范围
  chest?: string    // 胸围
  waist?: string    // 腰围
}

// ==================== 校园卡服务相关 ====================
export interface CampusCardInfo {
  cardNo: string
  balance: number
  status: 'active' | 'frozen' | 'lost'
  lastRechargeAt?: string
  lastConsumeAt?: string
  permissions: {
    accessControl: boolean  // 门禁权限
    library: boolean        // 图书馆权限
    canteen: boolean        // 食堂权限
    supermarket: boolean    // 超市权限
  }
  passwordLastModified?: string
}

export interface RechargeRecord {
  id: string
  amount: number
  method: 'alipay' | 'wechat' | 'bank' | 'campus_card' | 'cash'
  status: 'success' | 'failed' | 'processing'
  transactionNo?: string
  createdAt: string
}

export interface ConsumeRecord {
  id: string
  amount: number
  merchant: string  // 消费商户
  location: string  // 消费地点
  type: 'canteen' | 'supermarket' | 'library' | 'other'  // 消费类型
  balanceAfter: number  // 消费后余额
  createdAt: string
}

export interface CampusCardFormData {
  rechargeAmount: number
  method: RechargeRecord['method']
  newPassword?: string
  oldPassword?: string
}

// ==================== 资助政策相关 ====================
export interface AidPolicy {
  id: string
  title: string
  category: 'scholarship' | 'grant' | 'loan' | 'workstudy' | 'temporary_aid'  // 政策分类
  type: 'national' | 'provincial' | 'school'
  description: string
  eligibility: string[]  // 申请条件列表
  amountRange: string
  deadline: string
  documentUrls: string[]
  isActive: boolean
  isFavorited?: boolean  // 是否收藏
  faqs: PolicyFAQ[]      // 常见问题
  applicationRequirements: ApplicationRequirement[]  // 申请要求清单
}

export interface PolicyFAQ {
  question: string
  answer: string
}

export interface ApplicationRequirement {
  requirement: string
  isMet: boolean  // 用户是否满足该条件
  description?: string
}

// ==================== 待办任务相关 ====================
export interface PendingTask {
  id: string
  type: 'leave' | 'aid' | 'military' | 'card'
  title: string
  description: string
  status: 'pending' | 'urgent'
  createdAt: string
  actionUrl: string
  priority?: 'low' | 'medium' | 'high'
}
