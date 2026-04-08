// ==================== 缴费项目相关 ====================
export interface PaymentItem {
  id: string
  name: string
  type: 'tuition' | 'dormitory' | 'textbook' | 'insurance' | 'other'
  amount: number
  paidAmount?: number  // 已缴金额（部分缴费时使用）
  dueDate: string
  status: 'unpaid' | 'paid' | 'partial' | 'overdue'
  academicYear: string
  semester?: string
  description?: string
  details?: PaymentItemDetail[]  // 学费明细
  installmentOptions?: InstallmentOption[]  // 分期选项
  discountInfo?: DiscountInfo  // 减免信息
}

export interface PaymentItemDetail {
  name: string
  amount: number
  description?: string
}

export interface InstallmentOption {
  periods: number  // 分期数：1(一次性)/2/4
  amountPerPeriod: number  // 每期金额
  dueDates: string[]  // 各期截止日期
  fee?: number  // 手续费
}

export interface DiscountInfo {
  type: 'loan_deduction' | 'scholarship_deduction' | 'poverty_alleviation'  // 减免类型
  amount: number  // 减免金额
  description: string
  isApplied: boolean  // 是否已应用
}

// ==================== 缴费记录相关 ====================
export interface PaymentRecord {
  id: string
  paymentItemId: string
  itemName: string
  itemType: PaymentItem['type']
  amount: number
  method: 'wechat' | 'alipay' | 'bank' | 'campus_card' | 'offline'
  status: 'success' | 'failed' | 'pending' | 'refunded'
  transactionNo: string
  invoiceInfo?: InvoiceInfo  // 发票信息
  paidAt: string
  receiptUrl?: string  // 电子收据URL
  receiptPdfUrl?: string  // PDF收据URL
}

export interface InvoiceInfo {
  title: string  // 抬头
  taxId?: string  // 税号
  email?: string  // 邮箱
  type: 'personal' | 'company'  // 个人/企业
}

// ==================== 绿色通道相关 ====================
export interface GreenChannelApplication {
  id: string
  studentName: string
  studentId: string
  studentInfo: {
    college: string
    major: string
    grade: string
    className: string
  }
  reason: string  // 申请原因描述
  difficultyDescription: string  // 家庭经济困难情况
  supportingDocuments: SupportingDocument[]  // 证明材料
  status: 'draft' | 'submitted' | 'reviewing' | 'approved' | 'rejected' | 'agreement_signed'
  submittedAt: string
  reviewedAt?: string
  reviewerComment?: string
  rejectReason?: string
  deferredAgreement?: DeferredAgreement  // 缓缴协议
  repaymentPlan?: RepaymentPlan  // 延期还款计划
}

export interface SupportingDocument {
  id: string
  name: string  // 文件名
  type: 'id_card' | 'low_income' | 'disability' | 'medical' | 'other'  // 文件类型
  url: string  // 文件URL
  uploadedAt: string
}

export interface DeferredAgreement {
  id: string
  content: string  // 协议内容
  signedAt?: string  // 签署时间
  signature?: string  // 电子签名
  status: 'pending' | 'signed' | 'expired'
}

export interface RepaymentPlan {
  id: string
  totalAmount: number  // 总缓缴金额
  installments: RepaymentInstallment[]  // 还款计划
  startDate: string  // 开始日期
  endDate: string  // 结束日期
  status: 'active' | 'completed' | 'overdue' | 'cancelled'
}

export interface RepaymentInstallment {
  period: number  // 期数
  amount: number  // 金额
  dueDate: string  // 应还日期
  status: 'pending' | 'paid' | 'overdue'  // 状态
  paidAt?: string  // 实际还款日期
}

// ==================== 缴费汇总相关 ====================
export interface PaymentSummary {
  totalDue: number
  totalPaid: number
  totalOverdue: number
  itemCounts: { unpaid: number; paid: number; partial: number; overdue: number }
  currentSemesterDue: number  // 本学期待缴
  currentYearDue: number  // 本学年待缴
  upcomingDeadlines: UpcomingDeadline[]  // 即将到期的缴费项
}

export interface UpcomingDeadline {
  itemId: string
  itemName: string
  dueDate: string
  daysLeft: number  // 剩余天数
  amount: number
}

// ==================== 住宿费相关 ====================
export interface DormitoryFeeInfo {
  id: string
  building: string  // 楼栋
  roomNumber: string  // 房间号
  bedNumber: string  // 床位号
  roomType: 'four_person' | 'six_person' | 'other'  // 房间类型
  standardFee: number  // 标准费用（4人间1200/6人间800）
  annualFee: number  // 本学年费用
  refundCalculator: RefundCalculator  // 退宿退款计算器
}

export interface RefundCalculator {
  monthlyFee: number  // 月费用
  monthsUsed: number  // 已使用月数
  remainingMonths: number  // 剩余月数
  estimatedRefund: number  // 预计退款金额
}

// ==================== 学费缴纳表单数据 ====================
export interface TuitionPaymentFormData {
  selectedItems: string[]  // 选中的缴费项目ID
  paymentMethod: PaymentRecord['method']
  installmentOption?: number  // 分期选项（1/2/4）
  applyLoanDeduction?: boolean  // 是否应用助学贷款抵扣
  applyScholarshipDeduction?: boolean  // 是否应用奖助学金抵扣
  invoiceInfo?: InvoiceInfo  // 发票信息
}
