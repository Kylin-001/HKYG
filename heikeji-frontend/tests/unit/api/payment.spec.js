import { describe, it, expect, beforeEach, vi } from 'vitest'

// 模拟依赖项
vi.mock('@/utils/request', () => ({
  default: vi.fn(),
}))

vi.mock('@/utils/logger', () => ({
  default: {
    error: vi.fn(),
  },
}))

vi.mock('@/config/environment', () => ({
  default: {
    API_BASE_URL: 'http://localhost:3000/api',
  },
}))

// 导入要测试的函数
import request from '@/utils/request'
import logger from '@/utils/logger'
import config from '@/config/environment'
import {
  getPaymentMethods,
  getAvailablePaymentMethods,
  getPaymentConfig,
  createWechatPayment,
  queryWechatPayment,
  createAlipayPayment,
  queryAlipayPayment,
  balancePayment,
  verifyBalancePassword,
  getPaymentRecords,
  getPaymentDetail,
  applyRefund,
  queryRefundStatus,
  batchQueryPaymentStatus,
  checkPaymentTimeout,
  getPaymentQrcode,
  pollPaymentResult,
  createPayment,
  getPaymentStatus,
  balancePay,
} from '@/api/payment'

describe('支付API测试', () => {
  beforeEach(() => {
    // 清除所有模拟调用
    vi.clearAllMocks()
  })

  describe('基础支付方式API', () => {
    it('getPaymentMethods should call request with correct params', async () => {
      const mockResult = { data: { methods: [] } }
      request.mockResolvedValue(mockResult)

      const orderType = 'product'
      const result = await getPaymentMethods(orderType)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/methods`,
        method: 'get',
        params: { orderType },
      })
      expect(result).toEqual(mockResult)
    })

    it('getPaymentMethods should call without params when orderType is not provided', async () => {
      const mockResult = { data: { methods: [] } }
      request.mockResolvedValue(mockResult)

      const result = await getPaymentMethods()

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/methods`,
        method: 'get',
        params: {},
      })
      expect(result).toEqual(mockResult)
    })

    it('getAvailablePaymentMethods should call request with correct params', async () => {
      const mockResult = { data: { methods: [] } }
      request.mockResolvedValue(mockResult)

      const orderId = '123'
      const result = await getAvailablePaymentMethods(orderId)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/order/${orderId}/methods`,
        method: 'get',
      })
      expect(result).toEqual(mockResult)
    })

    it('getPaymentConfig should call request with correct params', async () => {
      const mockResult = { data: { config: {} } }
      request.mockResolvedValue(mockResult)

      const result = await getPaymentConfig()

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/config`,
        method: 'get',
      })
      expect(result).toEqual(mockResult)
    })
  })

  describe('微信支付API', () => {
    it('createWechatPayment should call request with correct params', async () => {
      const mockResult = { data: { paymentParams: {} } }
      request.mockResolvedValue(mockResult)

      const orderId = '123'
      const result = await createWechatPayment(orderId)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/wechat/create/${orderId}`,
        method: 'post',
      })
      expect(result).toEqual(mockResult)
    })

    it('queryWechatPayment should call request with correct params', async () => {
      const mockResult = { data: { status: 'SUCCESS' } }
      request.mockResolvedValue(mockResult)

      const orderId = '123'
      const result = await queryWechatPayment(orderId)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/wechat/query/${orderId}`,
        method: 'get',
      })
      expect(result).toEqual(mockResult)
    })
  })

  describe('支付宝支付API', () => {
    it('createAlipayPayment should call request with correct params', async () => {
      const mockResult = { data: { paymentParams: {} } }
      request.mockResolvedValue(mockResult)

      const orderId = '123'
      const result = await createAlipayPayment(orderId)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/alipay/create/${orderId}`,
        method: 'post',
      })
      expect(result).toEqual(mockResult)
    })

    it('queryAlipayPayment should call request with correct params', async () => {
      const mockResult = { data: { status: 'SUCCESS' } }
      request.mockResolvedValue(mockResult)

      const orderId = '123'
      const result = await queryAlipayPayment(orderId)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/alipay/query/${orderId}`,
        method: 'get',
      })
      expect(result).toEqual(mockResult)
    })
  })

  describe('余额支付API', () => {
    it('balancePayment should call request with correct params', async () => {
      const mockResult = { data: { success: true } }
      request.mockResolvedValue(mockResult)

      const orderId = '123'
      const password = 'test123'
      const result = await balancePayment(orderId, password)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/balance/${orderId}`,
        method: 'post',
        data: { password },
      })
      expect(result).toEqual(mockResult)
    })

    it('verifyBalancePassword should call request with correct params', async () => {
      const mockResult = { data: { valid: true } }
      request.mockResolvedValue(mockResult)

      const password = 'test123'
      const result = await verifyBalancePassword(password)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/balance/verify`,
        method: 'post',
        data: { password },
      })
      expect(result).toEqual(mockResult)
    })
  })

  describe('支付记录API', () => {
    it('getPaymentRecords should call request with correct params', async () => {
      const mockResult = { data: { records: [], total: 0 } }
      request.mockResolvedValue(mockResult)

      const params = { page: 1, pageSize: 10 }
      const result = await getPaymentRecords(params)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/records`,
        method: 'get',
        params,
      })
      expect(result).toEqual(mockResult)
    })

    it('getPaymentDetail should call request with correct params', async () => {
      const mockResult = { data: { id: '1', status: 'SUCCESS' } }
      request.mockResolvedValue(mockResult)

      const paymentId = '1'
      const result = await getPaymentDetail(paymentId)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/detail/${paymentId}`,
        method: 'get',
      })
      expect(result).toEqual(mockResult)
    })
  })

  describe('退款API', () => {
    it('applyRefund should call request with correct params', async () => {
      const mockResult = { data: { refundId: '1', status: 'PENDING' } }
      request.mockResolvedValue(mockResult)

      const orderId = '123'
      const params = { amount: 100, reason: '商品质量问题' }
      const result = await applyRefund(orderId, params)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/refund/apply/${orderId}`,
        method: 'post',
        data: params,
      })
      expect(result).toEqual(mockResult)
    })

    it('queryRefundStatus should call request with correct params', async () => {
      const mockResult = { data: { status: 'SUCCESS' } }
      request.mockResolvedValue(mockResult)

      const refundId = '1'
      const result = await queryRefundStatus(refundId)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/refund/status/${refundId}`,
        method: 'get',
      })
      expect(result).toEqual(mockResult)
    })
  })

  describe('其他支付API', () => {
    it('batchQueryPaymentStatus should call request with correct params', async () => {
      const mockResult = { data: { statuses: [] } }
      request.mockResolvedValue(mockResult)

      const orderIds = ['1', '2', '3']
      const result = await batchQueryPaymentStatus(orderIds)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/batch/status`,
        method: 'post',
        data: { orderIds },
      })
      expect(result).toEqual(mockResult)
    })

    it('checkPaymentTimeout should call request with correct params', async () => {
      const mockResult = { data: { timeout: false } }
      request.mockResolvedValue(mockResult)

      const orderId = '123'
      const result = await checkPaymentTimeout(orderId)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/checkTimeout/${orderId}`,
        method: 'get',
      })
      expect(result).toEqual(mockResult)
    })

    it('getPaymentQrcode should call request with correct params', async () => {
      const mockResult = { data: { qrcode: 'http://example.com/qrcode.png' } }
      request.mockResolvedValue(mockResult)

      const orderId = '123'
      const paymentMethod = 'WECHAT_PAY'
      const result = await getPaymentQrcode(orderId, paymentMethod)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/qrcode/${orderId}`,
        method: 'get',
        params: { paymentMethod },
      })
      expect(result).toEqual(mockResult)
    })
  })

  describe('高级支付功能', () => {
    it('balancePay should call balancePayment with correct params', async () => {
      const mockResult = { data: { success: true } }
      request.mockResolvedValue(mockResult)

      const data = {
        orderId: '123',
        password: 'test123',
      }

      const result = await balancePay(data)

      expect(request).toHaveBeenCalledWith({
        url: `${config.API_BASE_URL}/payment/balance/${data.orderId}`,
        method: 'post',
        data: { password: data.password },
      })
      expect(result).toEqual(mockResult.data)
    })
  })
})
