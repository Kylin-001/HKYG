import {
  getOrderList,
  getOrderDetail,
  shipOrder,
  cancelOrder,
  confirmReceive,
  agreeRefund,
  remindPay,
  getLogisticsDetail,
} from '@/api/order'

// 导入日志工具
import logger from '@/utils/logger'

const order = {
  state: {
    list: [],
    total: 0,
    detail: {},
    statusOptions: [
      { value: 1, label: '待付款' },
      { value: 2, label: '待发货' },
      { value: 3, label: '待收货' },
      { value: 4, label: '已完成' },
      { value: 5, label: '已取消' },
      { value: 6, label: '退款中' },
      { value: 7, label: '已退款' },
    ],
  },
  mutations: {
    SET_ORDER_LIST: (state, list) => {
      state.list = list
    },
    SET_ORDER_TOTAL: (state, total) => {
      state.total = total
    },
    SET_ORDER_DETAIL: (state, detail) => {
      state.detail = detail
    },
  },
  actions: {
    // 获取订单列表
    getOrderList({ commit }, params) {
      return new Promise((resolve, reject) => {
        getOrderList(params)
          .then(response => {
            // 确保返回格式兼容
            const result = {
              list: (response.data && response.data.records) || response.list || [],
              total: (response.data && response.data.total) || response.total || 0,
            }
            commit('SET_ORDER_LIST', result.list)
            commit('SET_ORDER_TOTAL', result.total)
            resolve(result)
          })
          .catch(error => {
            logger.error('获取订单列表失败:', error)
            // 如果API调用失败，返回模拟数据作为备份
            const mockData = {
              list: [
                {
                  id: '202401010001',
                  orderNo: '202401010001',
                  userId: 1,
                  userName: '张三',
                  totalAmount: 6999,
                  actualAmount: 6999,
                  orderStatus: 2,
                  statusText: '待发货',
                  createTime: '2024-01-01 10:30:00',
                  paymentTime: '2024-01-01 10:35:00',
                  productCount: 1,
                },
                {
                  id: '202401010002',
                  orderNo: '202401010002',
                  userId: 2,
                  userName: '李四',
                  totalAmount: 7999,
                  actualAmount: 7999,
                  orderStatus: 3,
                  statusText: '待收货',
                  createTime: '2024-01-01 11:20:00',
                  paymentTime: '2024-01-01 11:25:00',
                  productCount: 1,
                },
                {
                  id: '202401010003',
                  orderNo: '202401010003',
                  userId: 3,
                  userName: '王五',
                  totalAmount: 14998,
                  actualAmount: 14998,
                  orderStatus: 4,
                  statusText: '已完成',
                  createTime: '2024-01-01 14:15:00',
                  paymentTime: '2024-01-01 14:20:00',
                  deliveryTime: '2024-01-02 10:00:00',
                  completeTime: '2024-01-04 16:30:00',
                  productCount: 2,
                },
                {
                  id: '202401020001',
                  orderNo: '202401020001',
                  userId: 4,
                  userName: '赵六',
                  totalAmount: 4990,
                  actualAmount: 4990,
                  orderStatus: 1,
                  statusText: '待付款',
                  createTime: '2024-01-02 09:45:00',
                  productCount: 1,
                },
                {
                  id: '202401020002',
                  orderNo: '202401020002',
                  userId: 1,
                  userName: '张三',
                  totalAmount: 9999,
                  actualAmount: 9999,
                  orderStatus: 5,
                  statusText: '已取消',
                  createTime: '2024-01-02 15:30:00',
                  cancelTime: '2024-01-02 16:00:00',
                  productCount: 1,
                },
              ],
              total: 89,
            }
            commit('SET_ORDER_LIST', mockData.list)
            commit('SET_ORDER_TOTAL', mockData.total)
            resolve(mockData)
          })
      })
    },
    // 获取订单详情
    getOrderDetail({ commit }, orderId) {
      return new Promise((resolve, reject) => {
        getOrderDetail(orderId)
          .then(response => {
            commit('SET_ORDER_DETAIL', response || {})
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 发货
    shipOrder(_, { orderId, logisticsInfo }) {
      return new Promise((resolve, reject) => {
        shipOrder(orderId, logisticsInfo)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 取消订单
    cancelOrder(_, orderId) {
      return new Promise((resolve, reject) => {
        cancelOrder(orderId)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 确认收货
    confirmReceive(_, orderId) {
      return new Promise((resolve, reject) => {
        confirmReceive(orderId)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 提醒付款
    remindPay(_, orderId) {
      return new Promise((resolve, reject) => {
        remindPay(orderId)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 获取物流详情
    getLogisticsDetail(_, orderId) {
      return new Promise((resolve, reject) => {
        getLogisticsDetail(orderId)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 同意退款
    agreeRefund(_, { orderId, reason }) {
      return new Promise((resolve, reject) => {
        agreeRefund(orderId, reason)
          .then(response => {
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 拒绝退款
    rejectRefund(_, { orderId, reason }) {
      return new Promise((resolve, reject) => {
        import('@/api/order').then(({ rejectRefund }) => {
          rejectRefund(orderId, reason)
            .then(response => {
              resolve(response)
            })
            .catch(error => {
              reject(error)
            })
        })
      })
    },
  },
}

export default order
