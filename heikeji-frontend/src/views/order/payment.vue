<template>
  <div class="payment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单支付</span>
        <el-button size="small" type="primary" @click="handleBack">返回订单详情</el-button>
      </div>

      <!-- 加载中状态 -->
      <el-row v-if="loading" type="flex" justify="center" align="middle" style="height: 300px">
        <el-col>
          <el-loading-spinner type="snake" :size="40" />
          <p style="margin-top: 20px; text-align: center">加载中...</p>
        </el-col>
      </el-row>

      <!-- 支付内容 -->
      <div v-else-if="orderInfo" class="payment-content">
        <!-- 安全警告提示 -->
        <el-alert
          v-if="securityWarnings.length > 0 && !isEnvironmentSecure"
          title="安全提示：当前支付环境可能存在风险，请谨慎操作"
          type="warning"
          :description="`检测到 ${securityWarnings.length} 项安全风险，建议在安全网络下完成支付`"
          show-icon
          class="mb-20"
        >
          <template slot="title">
            <div class="flex items-center">
              <i class="el-icon-warning-outline mr-2"></i>
              安全提示
            </div>
          </template>
        </el-alert>

        <!-- 风险评估提示 -->
        <el-card v-if="riskAssessmentResult && riskAssessmentResult.level !== 'LOW'" class="mb-20">
          <div class="risk-assessment-tip">
            <div class="flex items-center mb-2">
              <i
                v-if="riskAssessmentResult.level === 'HIGH'"
                class="el-icon-error danger-icon mr-2"
              ></i>
              <i v-else class="el-icon-warning warning-icon mr-2"></i>
              <span class="font-bold"
                >{{ riskAssessmentResult.level === 'HIGH' ? '高风险' : '中等风险' }}提示</span
              >
            </div>
            <p class="text-sm text-gray-600 mb-1">
              {{ riskAdvice || '建议验证支付密码后再继续支付' }}
            </p>
            <p class="text-xs text-gray-500">如有疑问，请联系客服</p>
          </div>
        </el-card>

        <!-- 支付锁定提示 -->
        <el-alert
          v-if="isPaymentLocked"
          title="支付已被锁定"
          type="error"
          :description="lockReason || '系统检测到异常支付行为，请联系客服解锁'"
          show-icon
          class="mb-20"
        >
          <template slot="title">
            <div class="flex items-center">
              <i class="el-icon-lock mr-2"></i>
              支付锁定
            </div>
          </template>
        </el-alert>

        <!-- 支付倒计时 -->
        <div
          v-if="countdown > 0"
          class="countdown-tip"
          :class="{ 'countdown-warning': isCountdownWarning }"
        >
          <i class="el-icon-timer mr-2"></i>
          <span>请在 {{ formattedCountdown }} 内完成支付，超时订单将自动取消</span>
        </div>
        <!-- 订单信息卡片 -->
        <el-card class="order-info-card" shadow="hover">
          <el-row>
            <el-col :span="6">
              <div class="order-number">订单编号：{{ orderInfo.orderNo }}</div>
            </el-col>
            <el-col :span="6">
              <div class="order-time">下单时间：{{ formatDateTime(orderInfo.createTime) }}</div>
            </el-col>
            <el-col :span="6">
              <div class="order-status">
                <el-tag :type="getStatusType(orderInfo.orderStatus)" size="small">
                  {{ getStatusText(orderInfo.orderStatus) }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="6" class="text-right">
              <div class="order-amount">
                支付金额：<span class="amount-value">¥{{ orderInfo.actualAmount.toFixed(2) }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <!-- 支付方式选择 -->
        <el-card class="payment-method-card mt-20" shadow="hover">
          <div slot="header" class="card-header">
            <span class="card-title">选择支付方式</span>
          </div>

          <div class="payment-methods">
            <el-radio-group v-model="selectedPaymentMethod" size="large">
              <!-- 微信支付 -->
              <el-radio label="WECHAT_PAY" border>
                <div class="payment-method-item">
                  <div class="payment-icon wechat-icon"></div>
                  <div class="payment-info">
                    <div class="payment-name">微信支付</div>
                    <div class="payment-desc">微信安全支付</div>
                  </div>
                </div>
              </el-radio>

              <!-- 支付宝 -->
              <el-radio label="ALIPAY" border>
                <div class="payment-method-item">
                  <div class="payment-icon alipay-icon"></div>
                  <div class="payment-info">
                    <div class="payment-name">支付宝</div>
                    <div class="payment-desc">支付宝安全支付</div>
                  </div>
                </div>
              </el-radio>

              <!-- 余额支付 -->
              <el-radio label="BALANCE" border>
                <div class="payment-method-item">
                  <div class="payment-icon balance-icon"></div>
                  <div class="payment-info">
                    <div class="payment-name">余额支付</div>
                    <div class="payment-desc">当前余额：¥{{ userBalance.toFixed(2) }}</div>
                  </div>
                </div>
              </el-radio>
            </el-radio-group>
          </div>
        </el-card>

        <!-- 商品信息 -->
        <el-card class="order-summary-card mt-20" shadow="hover">
          <div slot="header" class="card-header">
            <span class="card-title">订单摘要</span>
          </div>

          <el-table :data="[orderInfo]" style="width: 100%" border>
            <el-table-column prop="totalCount" label="商品数量" width="120">
              <template slot-scope="scope">{{ scope.row.totalCount }}件</template>
            </el-table-column>
            <el-table-column prop="goodsAmount" label="商品金额" width="120" align="right">
              <template slot-scope="scope">¥{{ scope.row.goodsAmount.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="expressFee" label="运费" width="120" align="right">
              <template slot-scope="scope">¥{{ scope.row.expressFee.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="couponAmount" label="优惠券" width="120" align="right">
              <template slot-scope="scope">
                <span v-if="scope.row.couponAmount > 0" class="negative"
                  >-¥{{ scope.row.couponAmount.toFixed(2) }}</span
                >
                <span v-else>¥0.00</span>
              </template>
            </el-table-column>
            <el-table-column prop="actualAmount" label="应付金额" width="120" align="right">
              <template slot-scope="scope">
                <span class="total-amount">¥{{ scope.row.actualAmount.toFixed(2) }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 支付按钮 -->
        <div class="payment-actions mt-30">
          <el-button
            type="primary"
            size="large"
            :loading="paymentLoading"
            @click="handlePay"
            :disabled="paymentLoading"
          >
            立即支付 ¥{{ orderInfo.actualAmount.toFixed(2) }}
          </el-button>

          <el-button size="large" @click="handleBack"> 稍后支付 </el-button>
        </div>
      </div>

      <!-- 订单不存在 -->
      <el-row v-else type="flex" justify="center" align="middle" style="height: 300px">
        <el-col>
          <div class="order-not-found">
            <i class="el-icon-document-remove" style="font-size: 48px; color: #909399"></i>
            <p style="margin-top: 20px; text-align: center">订单不存在或已被删除</p>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 支付确认对话框 -->
    <el-dialog
      title="支付确认"
      :visible.sync="payConfirmVisible"
      width="400px"
      :close-on-click-modal="false"
    >
      <div class="confirm-content">
        <p>您确认使用 {{ getPaymentMethodName(selectedPaymentMethod) }} 支付</p>
        <p class="confirm-amount">¥{{ orderInfo?.actualAmount.toFixed(2) }}</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="payConfirmVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPayment">确认支付</el-button>
      </div>
    </el-dialog>

    <!-- 支付结果对话框 -->
    <el-dialog
      title="支付结果"
      :visible.sync="payResultVisible"
      width="500px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="payment-result">
        <div v-if="paySuccess" class="result-success">
          <i class="el-icon-circle-check" style="font-size: 64px; color: #67c23a"></i>
          <h3>支付成功</h3>
          <p>订单支付已完成，请等待商家发货</p>
        </div>
        <div v-else class="result-failed">
          <i class="el-icon-circle-close" style="font-size: 64px; color: #f56c6c"></i>
          <h3>支付失败</h3>
          <p class="error-message">{{ payErrorMessage || '支付过程中出现问题，请重试' }}</p>

          <!-- 支付失败原因分析 -->
          <div class="failure-analysis" v-if="paymentFailureType.length > 0">
            <h4>可能原因：</h4>
            <ul>
              <li v-if="paymentFailureType.includes('network')">网络连接不稳定，请检查网络设置</li>
              <li v-if="paymentFailureType.includes('balance')">
                账户余额不足，请选择其他支付方式
              </li>
              <li v-if="paymentFailureType.includes('timeout')">
                支付超时，请在规定时间内完成支付
              </li>
              <li v-if="paymentFailureType.includes('system')">系统繁忙，请稍后重试</li>
              <li v-if="paymentFailureType.includes('security')">安全验证失败，请检查支付环境</li>
            </ul>
          </div>

          <!-- 解决建议 -->
          <div class="failure-solutions">
            <h4>解决建议：</h4>
            <div class="solution-item" @click="switchPaymentMethod">
              <i class="el-icon-switch"></i>
              <span>更换支付方式</span>
            </div>
            <div class="solution-item" @click="contactCustomerService">
              <i class="el-icon-service"></i>
              <span>联系客服</span>
            </div>
            <div class="solution-item" @click="checkAccountStatus">
              <i class="el-icon-user"></i>
              <span>检查账户状态</span>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="paySuccess" type="primary" @click="handleViewOrder"> 查看订单 </el-button>
        <el-button v-if="!paySuccess" type="primary" @click="retryPayment"> 重新支付 </el-button>
        <el-button v-if="!paySuccess" @click="handleBack"> 返回订单 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import logger from '@/utils/logger'
import { getOrderDetail } from '@/api/order'
import { mapState, mapActions, mapGetters } from 'vuex'
import * as paymentSecurity from '@/utils/payment-security'
import notificationService from '@/utils/notification-service'

export default {
  name: 'OrderPayment',
  data() {
    return {
      loading: true,
      paymentLoading: false,
      orderInfo: null,
      orderId: '',
      payConfirmVisible: false,
      payResultVisible: false,
      paySuccess: false,
      payErrorMessage: '',
      paymentFailureType: [], // 支付失败类型，用于显示不同的错误原因和解决方案
      paymentPollingInterval: null,
      pollingController: null,
      countdown: 0,
      countdownTimer: null,
      showPaymentPassword: false,
      paymentPassword: '',
      // 安全相关状态
      securityWarnings: [],
      isEnvironmentSecure: true,
      securityCheckResult: null,
      riskAssessmentResult: null,
      isPasswordVerified: false,
    }
  },
  computed: {
    ...mapState('payment', [
      'paymentMethods',
      'selectedMethod',
      'paymentStatus',
      'security',
      'riskLevel',
      'isPaymentLocked',
      'lockReason',
    ]),
    ...mapGetters(['userBalance']),
    ...mapGetters('payment', [
      'availablePaymentMethods',
      'isBalanceSufficient',
      'formattedBalance',
      'needPaymentPassword',
      'riskAdvice',
      'securityWarnings',
    ]),

    // 获取订单支付类型
    orderType() {
      return this.orderInfo?.orderType || 'normal'
    },

    // 获取订单实付金额
    orderAmount() {
      return this.orderInfo?.actualAmount || 0
    },

    // 余额是否足够
    balanceEnough() {
      return this.isBalanceSufficient(this.orderAmount)
    },

    // 获取可用支付方式列表
    availableMethods() {
      return this.availablePaymentMethods(this.orderType, this.orderAmount)
    },

    // 支付处理中
    isProcessing() {
      return this.paymentStatus.loading
    },

    // 是否需要安全验证
    needSecurityVerification() {
      // 高风险支付或大额支付需要验证
      return (
        this.riskLevel === 'HIGH' ||
        (this.riskLevel === 'MEDIUM' && this.orderAmount > 1000) ||
        (this.selectedMethod === 'BALANCE' && this.orderAmount > 500)
      )
    },

    // 格式化后的倒计时
    formattedCountdown() {
      return this.formatCountdown()
    },

    // 倒计时是否即将结束（低于5分钟）
    isCountdownWarning() {
      return this.countdown > 0 && this.countdown < 300
    },
  },

  mounted() {
    // 获取订单ID
    this.orderId = this.$route.params.id || this.$route.query.id
    if (this.orderId) {
      // 执行环境安全检测
      this.performEnvironmentSecurityCheck()

      // 加载订单信息和用户余额
      this.fetchOrderAndUserInfo()
    } else {
      this.loading = false
    }
  },

  beforeDestroy() {
    // 清除轮询
    if (this.paymentPollingInterval) {
      clearInterval(this.paymentPollingInterval)
    }

    // 停止轮询控制器
    this.stopPolling()

    // 停止倒计时
    this.stopCountdown()

    // 重置支付状态
    this.resetPaymentStatus()
  },

  methods: {
    ...mapActions('payment', [
      'getPaymentMethods',
      'setSelectedMethod',
      'getUserBalance',
      'createPaymentOrder',
      'executeBalancePayment',
      'startPaymentPolling',
      'resetPaymentStatus',
      'clearPaymentCache',
      'getPaymentRemainingTime',
      // 安全相关actions
      'recordSecurityCheck',
      'verifyUserPaymentPassword',
      'performPaymentRiskAssessment',
      'lockPayment',
      'unlockPayment',
      'createPaymentOrder',
      'executeBalancePayment',
    ]),

    // 获取订单详情和用户信息
    async fetchOrderAndUserInfo() {
      this.loading = true
      try {
        // 获取订单详情
        this.orderInfo = await this.$store.dispatch('order/getOrderDetail', this.orderId)

        // 检查订单状态
        if (this.orderInfo.orderStatus !== 1) {
          this.$message.warning('该订单状态不允许支付')
          this.$router.push(`/order/detail/${this.orderId}`)
          return
        }

        // 获取用户余额
        await this.getUserBalance()

        // 初始化支付方式
        await this.getPaymentMethods(this.orderType)

        // 计算倒计时
        this.calculateCountdown()
        this.startCountdown()

        // 如果余额不足，默认不选中余额支付
        if (!this.balanceEnough && this.selectedMethod === 'BALANCE') {
          this.setSelectedMethod('WECHAT_PAY')
        }
      } catch (error) {
        logger.error('获取订单信息失败', error)
        this.$message.error('获取订单信息失败')
        this.orderInfo = null
      } finally {
        this.loading = false
      }
    },

    // 计算倒计时
    calculateCountdown() {
      if (!this.orderInfo || this.orderInfo.orderStatus !== 1) return

      this.countdown = this.getPaymentRemainingTime(this.orderInfo)

      if (this.countdown <= 0) {
        this.countdown = 0
        this.$message.warning('订单支付超时')
        this.$router.push(`/order/detail/${this.orderId}`)
      }
    },

    // 开始倒计时
    startCountdown() {
      this.stopCountdown()

      this.countdownTimer = setInterval(() => {
        if (this.countdown <= 0) {
          this.stopCountdown()
          this.$message.warning('订单支付超时')
          this.$router.push(`/order/detail/${this.orderId}`)
          return
        }
        this.countdown--
      }, 1000)
    },

    // 停止倒计时
    stopCountdown() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer)
        this.countdownTimer = null
      }
    },

    // 停止轮询
    stopPolling() {
      if (this.pollingController) {
        this.pollingController()
        this.pollingController = null
      }
    },

    // 处理支付按钮点击
    handlePay() {
      // 检查余额是否足够
      if (this.selectedMethod === 'BALANCE' && !this.balanceEnough) {
        this.$message.error('余额不足，请选择其他支付方式或充值')
        return
      }

      // 余额支付且需要支付密码
      if (this.selectedMethod === 'BALANCE' && this.needPaymentPassword) {
        this.showPaymentPassword = true
      } else {
        // 显示确认对话框
        this.payConfirmVisible = true
      }
    },

    // 确认支付
    confirmPayment() {
      // 检查支付是否被锁定
      if (this.isPaymentLocked) {
        this.$message.error(this.lockReason || '当前支付已被系统锁定，请联系客服')
        return
      }

      // 检查是否选择了支付方式
      if (!this.selectedMethod) {
        this.$message.error('请选择支付方式')
        return
      }

      // 执行风险评估
      this.performRiskAssessment()
        .then(assessmentResult => {
          this.riskAssessmentResult = assessmentResult

          // 高风险支付需要额外确认
          if (assessmentResult.level === 'HIGH') {
            // 发送支付风险警告通知
            notificationService.sendPaymentRiskAlert({
              orderId: this.orderId,
              amount: this.orderAmount,
              riskLevel: 'high',
              riskFactors: assessmentResult.factors || [],
            })

            this.$confirm('系统检测到当前支付存在较高风险，是否继续？', '风险提示', {
              confirmButtonText: '继续支付',
              cancelButtonText: '取消',
              type: 'warning',
            })
              .then(() => {
                this.proceedWithPayment()
              })
              .catch(() => {
                this.$message.info('支付已取消')
              })
          } else {
            // 普通风险直接继续支付流程
            this.proceedWithPayment()
          }
        })
        .catch(error => {
          logger.error('风险评估失败:', error)
          // 风险评估失败仍允许支付，但显示警告
          this.$notify.warning({
            title: '提示',
            message: '风险评估暂时不可用，建议谨慎操作',
            duration: 3000,
          })

          // 发送风险评估失败通知
          notificationService.sendPaymentRiskAlert({
            orderId: this.orderId,
            amount: this.orderAmount,
            riskLevel: 'unknown',
            error: error.message,
          })

          this.proceedWithPayment()
        })
    },

    // 执行风险评估
    performRiskAssessment() {
      return new Promise((resolve, reject) => {
        try {
          // 收集支付环境信息
          const paymentContext = {
            orderId: this.orderId,
            amount: this.orderAmount,
            paymentMethod: this.selectedMethod,
            browserInfo: navigator.userAgent,
            timestamp: Date.now(),
            ip: this.securityCheckResult?.clientIp,
          }

          // 调用store进行风险评估
          this.performPaymentRiskAssessment(paymentContext)
            .then(result => {
              resolve(result)

              // 记录风险评估日志
              if (result.level !== 'LOW') {
                logger.warn('支付风险评估结果:', result)
              }
            })
            .catch(error => {
              reject(error)
            })
        } catch (error) {
          reject(error)
        }
      })
    },

    // 继续支付流程
    proceedWithPayment() {
      // 检查是否需要支付密码
      if (
        (this.needPaymentPassword && this.selectedMethod === 'BALANCE') ||
        (this.needSecurityVerification && !this.isPasswordVerified)
      ) {
        this.showPaymentPassword = true
        return
      }

      this.payConfirmVisible = false
      this.paymentLoading = true
      this.showPaymentPassword = false

      // 发送支付开始通知
      notificationService.sendPaymentInitiatedNotification({
        orderId: this.orderId,
        amount: this.orderAmount,
        paymentMethod: this.getSelectedMethodName(),
        timestamp: new Date(),
      })

      // 生成安全签名
      const paymentParams = {
        orderId: this.orderId,
        amount: this.orderAmount,
        paymentMethod: this.selectedMethod,
        timestamp: Date.now(),
        securityToken: this.security?.token || '',
        riskLevel: this.riskAssessmentResult?.level || 'UNKNOWN',
        paymentPassword: this.paymentPassword,
      }

      // 清空支付密码
      this.paymentPassword = ''

      // 对支付参数进行签名
      try {
        paymentParams.signature = paymentSecurity.generatePaymentSignature(paymentParams)
      } catch (error) {
        logger.error('生成支付签名失败:', error)
        this.paymentLoading = false
        this.paySuccess = false
        this.payErrorMessage = '系统安全验证失败，请稍后重试'
        this.payResultVisible = true
        return
      }

      // 根据支付方式调用对应的API
      this.processPayment(paymentParams)
    },

    // 获取选中的支付方式名称
    getSelectedMethodName() {
      return this.getPaymentMethodName(this.selectedMethod)
    },

    // 处理支付
    async processPayment(paymentParams) {
      try {
        let paymentResult

        switch (this.selectedMethod) {
          case 'WECHAT_PAY':
          case 'ALIPAY':
            // 创建支付订单
            paymentResult = await this.createPaymentOrder(paymentParams)

            // 根据支付平台处理跳转
            if (paymentResult) {
              // 这里根据后端返回的支付链接或表单进行跳转
              if (paymentResult.paymentUrl) {
                // 跳转到支付平台
                window.location.href = paymentResult.paymentUrl
                // 开始轮询支付结果
                this.startMonitoringPaymentStatus()
              } else if (paymentResult.payForm) {
                // 处理表单提交
                this.submitPaymentForm(paymentResult.payForm)
              }
            }
            break

          case 'BALANCE':
            // 余额支付
            if (!this.balanceEnough) {
              this.paymentLoading = false
              this.paySuccess = false
              this.payErrorMessage = '账户余额不足'
              this.paymentFailureType = ['balance']
              this.payResultVisible = true
              return
            }

            const balanceResult = await this.executeBalancePayment(paymentParams)

            if (balanceResult && balanceResult.success) {
              this.paySuccess = true
              this.paymentFailureType = []
              this.payResultVisible = true
              // 更新订单状态
              await this.fetchOrderAndUserInfo()

              this.$notify.success({
                title: '支付成功',
                message: '您的订单已支付成功',
                duration: 3000,
              })
            } else {
              this.paySuccess = false
              this.payErrorMessage = balanceResult?.message || '余额支付失败'
              this.analyzePaymentError(balanceResult?.message)
              this.payResultVisible = true
            }
            break
        }
      } catch (error) {
        logger.error('创建支付订单失败', error)
        this.paySuccess = false
        this.payErrorMessage = error.message || '支付过程中出现错误'
        this.analyzePaymentError(error.message)
        this.payResultVisible = true
      } finally {
        this.paymentLoading = false
      }
    },

    // 开始监控支付状态
    startMonitoringPaymentStatus() {
      this.stopPolling()

      // 使用vuex中的轮询方法
      this.pollingController = this.startPaymentPolling({
        orderId: this.orderId,
        callback: this.handlePollingResult,
      })
    },

    // 处理轮询结果
    handlePollingResult(result) {
      if (result.success) {
        this.paySuccess = true
        this.paymentFailureType = []
        this.payResultVisible = true
        // 更新订单状态
        this.fetchOrderAndUserInfo()
      } else if (result.timeout) {
        this.paySuccess = false
        this.payErrorMessage = result.message || '支付超时'
        this.paymentFailureType = ['timeout']
        this.payResultVisible = true
      } else {
        this.paySuccess = false
        this.payErrorMessage = result.error || '支付失败'
        // 分析错误类型
        this.analyzePaymentError(result.error)
        this.payResultVisible = true
      }
    },

    // 分析支付错误类型
    analyzePaymentError(errorMessage) {
      this.paymentFailureType = []

      if (!errorMessage) return

      const lowerCaseError = errorMessage.toLowerCase()

      // 根据错误信息关键词判断失败类型
      if (lowerCaseError.includes('网络') || lowerCaseError.includes('network')) {
        this.paymentFailureType.push('network')
      }
      if (lowerCaseError.includes('余额') || lowerCaseError.includes('balance')) {
        this.paymentFailureType.push('balance')
      }
      if (lowerCaseError.includes('超时') || lowerCaseError.includes('timeout')) {
        this.paymentFailureType.push('timeout')
      }
      if (lowerCaseError.includes('系统') || lowerCaseError.includes('system')) {
        this.paymentFailureType.push('system')
      }
      if (lowerCaseError.includes('安全') || lowerCaseError.includes('security')) {
        this.paymentFailureType.push('security')
      }
    },

    // 切换支付方式
    switchPaymentMethod() {
      this.payResultVisible = false
      // 根据当前选中的支付方式，推荐切换到另一种
      if (this.selectedMethod === 'WECHAT_PAY') {
        this.setSelectedMethod('ALIPAY')
      } else if (this.selectedMethod === 'ALIPAY') {
        this.setSelectedMethod('WECHAT_PAY')
      }

      this.$message.info('已为您切换支付方式，请重新支付')
      this.payConfirmVisible = true
    },

    // 联系客服
    contactCustomerService() {
      // 调用通知服务的客服联系方法
      notificationService.sendServiceContactNotification({
        userId: this.$store.getters.userId,
        orderId: this.orderId,
        reason: '支付失败需要协助',
        contactType: 'payment_failure',
      })

      this.$message.success('客服人员将尽快与您联系，请保持通讯畅通')
      // 这里可以添加跳转到在线客服的逻辑
      this.$router.push('/user/service')
    },

    // 检查账户状态
    checkAccountStatus() {
      this.payResultVisible = false
      this.$router.push('/user/account')
    },

    // 提交支付表单
    submitPaymentForm(payForm) {
      const form = document.createElement('form')
      form.method = 'POST'
      form.action = payForm.action

      // 添加表单字段
      for (const key in payForm.params) {
        if (payForm.params.hasOwnProperty(key)) {
          const input = document.createElement('input')
          input.type = 'hidden'
          input.name = key
          input.value = payForm.params[key]
          form.appendChild(input)
        }
      }

      // 添加到文档并提交
      document.body.appendChild(form)
      form.submit()
      // 移除表单
      setTimeout(() => {
        document.body.removeChild(form)
      }, 100)
    },

    // 重试支付
    retryPayment() {
      this.payResultVisible = false
      this.resetPaymentStatus()
      this.clearPaymentCache(this.orderId)
      // 重新开始支付流程
      this.payConfirmVisible = true
    },

    // 格式化倒计时
    formatCountdown() {
      const minutes = Math.floor(this.countdown / 60)
      const seconds = this.countdown % 60
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    },

    // 复制订单号
    copyOrderNo() {
      if (!this.orderInfo?.orderNo) return

      const textArea = document.createElement('textarea')
      textArea.value = this.orderInfo.orderNo
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()

      try {
        document.execCommand('copy')
        this.$message.success('订单号已复制')
      } catch (err) {
        this.$message.error('复制失败')
      } finally {
        document.body.removeChild(textArea)
      }
    },

    // 执行环境安全检测
    performEnvironmentSecurityCheck() {
      try {
        // 使用安全工具检测环境
        this.securityCheckResult = paymentSecurity.checkEnvironmentSecurity()
        this.isEnvironmentSecure = this.securityCheckResult.secure

        // 收集安全警告
        if (this.securityCheckResult.warnings && this.securityCheckResult.warnings.length > 0) {
          this.securityWarnings = this.securityCheckResult.warnings
          logger.warn('支付环境存在安全风险:', this.securityWarnings)

          // 显示安全警告提示
          this.$notify.warning({
            title: '安全提示',
            message: '当前支付环境存在风险，建议在安全网络下进行支付操作',
            duration: 5000,
          })
        }

        // 调用store记录安全检测结果
        this.recordSecurityCheck(this.securityCheckResult)
      } catch (error) {
        logger.error('环境安全检测失败:', error)
      }
    },

    // 验证支付密码
    verifyPaymentPassword() {
      return new Promise((resolve, reject) => {
        if (!this.paymentPassword) {
          this.$message.error('请输入支付密码')
          reject(new Error('支付密码不能为空'))
          return
        }

        try {
          // 使用安全工具对密码进行加密处理
          const encryptedPassword = paymentSecurity.encryptPassword(this.paymentPassword)

          // 调用store验证支付密码
          this.verifyUserPaymentPassword({
            password: encryptedPassword,
            orderId: this.orderId,
          })
            .then(result => {
              if (result.success) {
                this.isPasswordVerified = true
                this.$message.success('支付密码验证成功')
                resolve(true)
              } else {
                this.isPasswordVerified = false
                this.$message.error(result.message || '支付密码验证失败')
                reject(new Error(result.message || '支付密码验证失败'))
              }
            })
            .catch(error => {
              this.isPasswordVerified = false
              this.$message.error('支付密码验证失败')
              reject(error)
            })
        } catch (error) {
          logger.error('支付密码处理失败:', error)
          this.$message.error('系统错误，请稍后再试')
          reject(error)
        } finally {
          // 清空密码输入
          this.paymentPassword = ''
        }
      })
    },

    // 查看订单
    handleViewOrder() {
      this.payResultVisible = false
      this.$router.push(`/order/detail/${this.orderId}`)
    },

    // 返回订单详情
    handleBack() {
      this.$router.push(`/order/detail/${this.orderId}`)
    },

    // 获取支付方式名称
    getPaymentMethodName(method) {
      // 优先从vuex中获取支付方式信息
      const paymentMethod = this.paymentMethods.find(m => m.code === method)
      if (paymentMethod) {
        return paymentMethod.name
      }

      // 备用映射
      const methodMap = {
        WECHAT_PAY: '微信支付',
        ALIPAY: '支付宝',
        BALANCE: '余额支付',
      }
      return methodMap[method] || method
    },

    // 获取订单状态文本
    getStatusText(status) {
      const statusMap = {
        1: '待支付',
        2: '待发货',
        3: '待收货',
        4: '已完成',
        5: '已取消',
        6: '退款中',
        7: '已退款',
      }
      return statusMap[status] || '未知状态'
    },

    // 获取订单状态标签类型
    getStatusType(status) {
      const typeMap = {
        1: 'warning',
        2: 'info',
        3: 'primary',
        4: 'success',
        5: 'danger',
        6: 'warning',
        7: 'danger',
      }
      return typeMap[status] || 'info'
    },

    // 格式化日期时间
    formatDateTime(date) {
      if (!date) return '--'
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      const hour = String(d.getHours()).padStart(2, '0')
      const minute = String(d.getMinutes()).padStart(2, '0')
      return `${year}-${month}-${day} ${hour}:${minute}`
    },
  },
}
</script>

<style scoped>
.payment-container {
  padding: 20px;
}

.payment-content {
  max-width: 1000px;
  margin: 0 auto;
}

/* 安全相关样式 */
.mb-20 {
  margin-bottom: 20px;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.mr-2 {
  margin-right: 8px;
}

.font-bold {
  font-weight: bold;
}

.text-sm {
  font-size: 14px;
}

.text-xs {
  font-size: 12px;
}

.text-gray-600 {
  color: #606266;
}

.text-gray-500 {
  color: #909399;
}

.danger-icon {
  color: #f56c6c;
}

.warning-icon {
  color: #e6a23c;
}

/* 风险评估提示样式 */
.risk-assessment-tip {
  padding: 10px;
  background-color: #fdf6ec;
  border-radius: 4px;
}

/* 倒计时提示样式 */
.countdown-tip {
  padding: 10px 15px;
  background-color: #f0f9ff;
  border-left: 4px solid #409eff;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #409eff;
}

.countdown-warning {
  background-color: #fef0f0;
  border-left-color: #f56c6c;
  color: #f56c6c;
  font-weight: bold;
}

.mt-20 {
  margin-top: 20px;
}

.mt-30 {
  margin-top: 30px;
}

.order-info-card {
  margin-bottom: 20px;
}

.order-number,
.order-time,
.order-status {
  margin: 10px 0;
  font-size: 14px;
}

.order-amount {
  font-size: 16px;
}

.amount-value {
  font-size: 20px;
  font-weight: bold;
  color: #f56c6c;
}

.card-header {
  padding: 10px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 15px;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
}

.payment-methods {
  margin-bottom: 20px;
}

.payment-method-item {
  display: flex;
  align-items: center;
}

.payment-icon {
  width: 32px;
  height: 32px;
  margin-right: 10px;
  border-radius: 4px;
}

.wechat-icon {
  background-color: #09bb07;
  background-image: url('@/assets/images/wechat-pay.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.alipay-icon {
  background-color: #1677ff;
  background-image: url('@/assets/images/alipay.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.balance-icon {
  background-color: #ff6700;
  background-image: url('@/assets/images/balance.png');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.payment-info {
  display: flex;
  flex-direction: column;
}

.payment-name {
  font-size: 16px;
  font-weight: bold;
}

.payment-desc {
  font-size: 12px;
  color: #909399;
}

.negative {
  color: #f56c6c;
}

.total-amount {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
}

.payment-actions {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.payment-actions .el-button {
  margin: 0 15px;
}

.confirm-content {
  text-align: center;
  padding: 20px 0;
}

.confirm-amount {
  font-size: 24px;
  font-weight: bold;
  color: #f56c6c;
  margin-top: 10px;
}

.payment-result {
  text-align: center;
  padding: 30px 0;
}

.payment-result h3 {
  margin: 20px 0 10px 0;
  font-size: 20px;
}

.payment-result p {
  color: #606266;
}

.error-message {
  color: #f56c6c;
  margin-top: 10px;
  margin-bottom: 20px;
  font-weight: bold;
}

.failure-analysis {
  background-color: #fef0f0;
  border: 1px solid #fbc4c4;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
}

.failure-analysis h4 {
  color: #f56c6c;
  margin: 0 0 10px 0;
  font-size: 14px;
}

.failure-analysis ul {
  margin: 0;
  padding-left: 20px;
}

.failure-analysis li {
  color: #606266;
  margin-bottom: 5px;
  font-size: 13px;
}

.failure-solutions {
  margin-top: 20px;
}

.failure-solutions h4 {
  color: #606266;
  margin: 0 0 10px 0;
  font-size: 14px;
}

.solution-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.solution-item:hover {
  background-color: #e4e7ed;
  transform: translateX(5px);
}

.solution-item i {
  color: #409eff;
  margin-right: 8px;
  font-size: 16px;
}

.solution-item span {
  color: #303133;
  font-size: 13px;
}

.order-not-found {
  text-align: center;
}
</style>
