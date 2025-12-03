<template>
  <div class="merchant-orders">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>订单管理</h2>
      <div class="header-actions">
        <el-button type="primary" @click="exportOrders">导出订单</el-button>
        <el-button @click="refreshOrders">刷新</el-button>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="订单状态">
          <el-select
            v-model="filterForm.status"
            placeholder="全部订单"
            @change="handleFilterChange"
          >
            <el-option label="全部订单" value=""></el-option>
            <el-option label="待接单" value="待接单"></el-option>
            <el-option label="制作中" value="制作中"></el-option>
            <el-option label="已完成制作" value="已完成制作"></el-option>
            <el-option label="已取消" value="已取消"></el-option>
            <el-option label="已退款" value="已退款"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="时间范围">
          <el-date-picker
            v-model="filterForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="handleFilterChange"
          />
        </el-form-item>

        <el-form-item label="订单号">
          <el-input
            v-model="filterForm.orderNo"
            placeholder="输入订单号"
            clearable
            @input="handleSearch"
            style="width: 200px"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleFilterChange">搜索</el-button>
          <el-button @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 订单统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="3">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-number">{{ orderStats.total }}</div>
            <div class="stat-label">总订单</div>
            <div class="stat-trend">
              <i class="el-icon-top trend-up"></i>
              <span>较昨日+12</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="stat-card pending">
          <div class="stat-content">
            <div class="stat-number">{{ orderStats.pending }}</div>
            <div class="stat-label">待接单</div>
            <div class="stat-trend">
              <i class="el-icon-warning trend-warning"></i>
              <span>{{ orderStats.pending > 5 ? '较多' : '正常' }}</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="stat-card cooking">
          <div class="stat-content">
            <div class="stat-number">{{ orderStats.cooking }}</div>
            <div class="stat-label">制作中</div>
            <div class="stat-trend">
              <i class="el-icon-time trend-normal"></i>
              <span>平均25分钟</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="stat-card delivering">
          <div class="stat-content">
            <div class="stat-number">{{ orderStats.delivering }}</div>
            <div class="stat-label">配送中</div>
            <div class="stat-trend">
              <i class="el-icon-truck trend-normal"></i>
              <span>配送员{{ orderStats.deliverymenCount }}人</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="stat-card ready">
          <div class="stat-content">
            <div class="stat-number">{{ orderStats.ready }}</div>
            <div class="stat-label">待配送</div>
            <div class="stat-trend">
              <i class="el-icon-check trend-success"></i>
              <span>已完成制作</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="stat-card completed">
          <div class="stat-content">
            <div class="stat-number">{{ orderStats.completed }}</div>
            <div class="stat-label">已完成</div>
            <div class="stat-trend">
              <i class="el-icon-success-filled trend-success"></i>
              <span>完成率{{ completionRate }}%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="stat-card revenue">
          <div class="stat-content">
            <div class="stat-number">¥{{ orderStats.revenue.toFixed(2) }}</div>
            <div class="stat-label">今日收入</div>
            <div class="stat-trend">
              <i class="el-icon-top trend-up"></i>
              <span>较昨日+8.5%</span>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="3">
        <el-card class="stat-card avg-rating">
          <div class="stat-content">
            <div class="stat-number">{{ orderStats.avgRating }}</div>
            <div class="stat-label">平均评分</div>
            <div class="stat-trend">
              <el-rate
                v-model="orderStats.avgRating"
                disabled
                size="mini"
                style="margin-top: 5px"
              />
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 订单列表 -->
    <el-card class="orders-card">
      <el-table
        :data="orders"
        style="width: 100%"
        v-loading="loading"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column prop="orderNo" label="订单号" width="160">
          <template slot-scope="{ row }">
            <span class="order-no">{{ row.orderNo }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="createTime" label="下单时间" width="140">
          <template slot-scope="{ row }">
            <div class="time-info">
              <div>{{ row.createTime.split(' ')[0] }}</div>
              <div>{{ row.createTime.split(' ')[1] }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="客户信息" width="120">
          <template slot-scope="{ row }">
            <div class="customer-info">
              <div>{{ row.customerName }}</div>
              <div class="customer-phone">{{ row.customerPhone }}</div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="订单内容" min-width="200">
          <template slot-scope="{ row }">
            <div class="order-items">
              <div v-for="(item, index) in row.items.slice(0, 2)" :key="index" class="item-line">
                {{ item.name }} x{{ item.quantity }}
              </div>
              <div v-if="row.items.length > 2" class="more-items">
                +{{ row.items.length - 2 }} 更多
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="amount" label="订单金额" width="100">
          <template slot-scope="{ row }">
            <span class="amount">¥{{ row.amount }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="支付方式" width="80">
          <template slot-scope="{ row }">
            <span class="pay-type">{{ row.payType }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="{ row }">
            <el-button
              v-if="row.status === '待接单'"
              type="primary"
              size="mini"
              @click="acceptOrder(row)"
            >
              接单
            </el-button>
            <el-button
              v-if="row.status === '制作中'"
              type="warning"
              size="mini"
              @click="updateStatus(row, '已完成制作')"
            >
              完成制作
            </el-button>
            <el-button
              v-if="row.status === '已完成制作'"
              type="success"
              size="mini"
              @click="updateStatus(row, '配送中')"
            >
              配送
            </el-button>
            <el-button
              v-if="row.status === '待接单'"
              type="danger"
              size="mini"
              @click="cancelOrder(row)"
            >
              取消
            </el-button>
            <el-button size="mini" @click="viewOrderDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pagination.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        />
      </div>
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog title="订单详情" :visible.sync="detailDialogVisible" width="800px">
      <div v-if="currentOrder" class="order-detail">
        <!-- 基本信息 -->
        <div class="detail-section">
          <h4>订单信息</h4>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="detail-item">
                <label>订单号:</label>
                <span>{{ currentOrder.orderNo }}</span>
              </div>
              <div class="detail-item">
                <label>下单时间:</label>
                <span>{{ currentOrder.createTime }}</span>
              </div>
              <div class="detail-item">
                <label>支付方式:</label>
                <span>{{ currentOrder.payType }}</span>
              </div>
              <div class="detail-item">
                <label>订单状态:</label>
                <el-tag :type="getStatusType(currentOrder.status)" size="small">
                  {{ currentOrder.status }}
                </el-tag>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="detail-item">
                <label>客户姓名:</label>
                <span>{{ currentOrder.customerName }}</span>
              </div>
              <div class="detail-item">
                <label>联系电话:</label>
                <span>{{ currentOrder.customerPhone }}</span>
              </div>
              <div class="detail-item">
                <label>配送地址:</label>
                <span>{{ currentOrder.deliveryAddress }}</span>
              </div>
              <div class="detail-item">
                <label>预计送达:</label>
                <span>{{ currentOrder.estimatedDelivery }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- 商品详情 -->
        <div class="detail-section">
          <h4>商品清单</h4>
          <el-table :data="currentOrder.items" size="small">
            <el-table-column prop="name" label="商品名称"></el-table-column>
            <el-table-column prop="spec" label="规格"></el-table-column>
            <el-table-column prop="price" label="单价" width="80">
              <template slot-scope="{ row }"> ¥{{ row.price }} </template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="60"></el-table-column>
            <el-table-column prop="total" label="小计" width="80">
              <template slot-scope="{ row }"> ¥{{ row.total }} </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 状态流跟踪 -->
        <div
          v-if="currentOrder.statusFlow && currentOrder.statusFlow.length > 0"
          class="detail-section"
        >
          <h4>订单状态跟踪</h4>
          <div class="status-timeline">
            <div
              v-for="(step, index) in currentOrder.statusFlow"
              :key="index"
              class="timeline-step"
              :class="{ active: step.completed, current: step.current }"
            >
              <div class="step-icon">
                <i :class="step.icon"></i>
              </div>
              <div class="step-content">
                <div class="step-title">{{ step.title }}</div>
                <div class="step-time">{{ step.time || '待处理' }}</div>
                <div class="step-desc">{{ step.description }}</div>
              </div>
              <div v-if="index < currentOrder.statusFlow.length - 1" class="step-line"></div>
            </div>
          </div>
        </div>

        <!-- 费用明细 -->
        <div class="detail-section">
          <h4>费用明细</h4>
          <div class="fee-breakdown">
            <div class="fee-item">
              <span>商品总额:</span>
              <span>¥{{ currentOrder.subtotal }}</span>
            </div>
            <div class="fee-item">
              <span>配送费:</span>
              <span>¥{{ currentOrder.deliveryFee }}</span>
            </div>
            <div class="fee-item">
              <span>优惠减免:</span>
              <span>-¥{{ currentOrder.discount }}</span>
            </div>
            <div class="fee-item total">
              <span>实付金额:</span>
              <span>¥{{ currentOrder.amount }}</span>
            </div>
          </div>
        </div>

        <!-- 备注信息 -->
        <div v-if="currentOrder.remark" class="detail-section">
          <h4>订单备注</h4>
          <p class="remark">{{ currentOrder.remark }}</p>
        </div>

        <!-- 快速操作 -->
        <div class="detail-section">
          <h4>快速操作</h4>
          <div class="quick-actions">
            <el-button-group>
              <el-button
                v-if="currentOrder.status === '待接单'"
                type="primary"
                size="small"
                @click="quickAcceptOrder(currentOrder)"
              >
                <i class="el-icon-check"></i> 快速接单
              </el-button>
              <el-button
                v-if="currentOrder.status === '已接单' || currentOrder.status === '制作中'"
                type="warning"
                size="small"
                @click="quickCompleteCooking(currentOrder)"
              >
                <i class="el-icon-food"></i> 完成制作
              </el-button>
              <el-button
                v-if="currentOrder.status === '已完成制作'"
                type="success"
                size="small"
                @click="quickAssignDelivery(currentOrder)"
              >
                <i class="el-icon-truck"></i> 分配配送
              </el-button>
            </el-button-group>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'MerchantOrders',
  data() {
    return {
      loading: false,
      orders: [],
      orderStats: {
        total: 0,
        pending: 0,
        cooking: 0,
        delivering: 0,
        ready: 0,
        completed: 0,
        revenue: 0,
        avgRating: 4.8,
        deliverymenCount: 5,
      },
      filterForm: {
        status: '',
        dateRange: [],
        orderNo: '',
      },
      pagination: {
        page: 1,
        size: 20,
        total: 0,
      },
      selectedOrders: [],
      detailDialogVisible: false,
      currentOrder: null,
    }
  },

  computed: {
    // 计算完成率
    completionRate() {
      if (this.orderStats.total === 0) return 0
      return Math.round((this.orderStats.completed / this.orderStats.total) * 100)
    },
  },

  mounted() {
    this.loadOrders()
    this.loadOrderStats()
  },

  methods: {
    // 加载订单列表
    async loadOrders() {
      this.loading = true
      try {
        // 模拟数据
        this.orders = [
          {
            id: 1,
            orderNo: 'TK20241121143001',
            createTime: '2024-11-21 14:30:15',
            customerName: '张三',
            customerPhone: '138****8888',
            items: [
              { name: '兰州拉面', spec: '大碗', price: 15, quantity: 2, total: 30 },
              { name: '小菜', spec: '凉拌', price: 5, quantity: 1, total: 5 },
            ],
            amount: 45.8,
            status: '待接单',
            payType: '微信支付',
            deliveryAddress: '清华大学学生公寓1号楼101',
            estimatedDelivery: '14:50-15:05',
            remark: '不要香菜，多放醋',
          },
          {
            id: 2,
            orderNo: 'TK20241121142502',
            createTime: '2024-11-21 14:25:30',
            customerName: '李四',
            customerPhone: '139****9999',
            items: [
              { name: '牛肉面', spec: '中碗', price: 18, quantity: 1, total: 18 },
              { name: '卤蛋', spec: '单个', price: 3, quantity: 1, total: 3 },
              { name: '酸奶', spec: '原味', price: 8, quantity: 1, total: 8 },
            ],
            amount: 32.5,
            status: '制作中',
            payType: '支付宝',
            deliveryAddress: '北京大学学生公寓2号楼201',
            estimatedDelivery: '14:45-15:00',
            remark: '',
          },
        ]
        this.pagination.total = this.orders.length
      } catch (error) {
        this.$message.error('加载订单失败')
      } finally {
        this.loading = false
      }
    },

    // 加载订单统计
    loadOrderStats() {
      // 模拟统计数据
      this.orderStats = {
        total: 156,
        pending: 8,
        cooking: 12,
        delivering: 5,
        ready: 7,
        completed: 124,
        revenue: 8945.6,
        avgRating: 4.8,
        deliverymenCount: 5,
      }
    },

    // 获取状态样式类型
    getStatusType(status) {
      const typeMap = {
        待接单: 'warning',
        已接单: 'primary',
        制作中: 'primary',
        配送中: 'info',
        已送达: 'info',
        用户已取货: 'success',
        已取消: 'danger',
        已退款: 'danger',
        超时未取货: 'danger',
      }
      return typeMap[status] || 'info'
    },

    // 获取状态对应的常量值
    getStatusConstant(status) {
      const statusMap = {
        待接单: 'TAKEOUT_STATUS_PENDING_ACCEPT',
        已接单: 'TAKEOUT_STATUS_ACCEPTED',
        制作中: 'TAKEOUT_STATUS_COOKING',
        配送中: 'TAKEOUT_STATUS_DELIVERING',
        已送达: 'TAKEOUT_STATUS_DELIVERED',
        用户已取货: 'TAKEOUT_STATUS_USER_PICKED',
        已取消: 'TAKEOUT_STATUS_CANCELLED',
        已退款: 'TAKEOUT_STATUS_REFUNDED',
        超时未取货: 'TAKEOUT_STATUS_TIMEOUT_NOT_PICKED',
      }
      return statusMap[status] || 'UNKNOWN'
    },

    // 处理筛选变化
    handleFilterChange() {
      this.pagination.page = 1
      this.loadOrders()
    },

    // 处理搜索
    handleSearch() {
      this.pagination.page = 1
      this.loadOrders()
    },

    // 重置筛选
    resetFilter() {
      this.filterForm = {
        status: '',
        dateRange: [],
        orderNo: '',
      }
      this.loadOrders()
    },

    // 刷新订单
    refreshOrders() {
      this.loadOrders()
      this.loadOrderStats()
      this.$message.success('订单已刷新')
    },

    // 导出订单
    exportOrders() {
      this.$message.info('导出功能开发中...')
    },

    // 批量选择
    handleSelectionChange(selection) {
      this.selectedOrders = selection
    },

    // 接单
    acceptOrder(order) {
      this.$confirm(`确定要接单吗？订单号: ${order.orderNo}`, '提示', {
        confirmButtonText: '确定接单',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 更新订单状态
        order.status = '制作中'
        this.$message.success('订单已接单')
      })
    },

    // 更新订单状态
    updateStatus(order, newStatus) {
      order.status = newStatus
      this.$message.success('订单状态已更新')
      this.loadOrderStats()
    },

    // 取消订单
    cancelOrder(order) {
      this.$confirm(`确定要取消订单吗？订单号: ${order.orderNo}`, '提示', {
        confirmButtonText: '确定取消',
        cancelButtonText: '不取消',
        type: 'warning',
      }).then(() => {
        order.status = '已取消'
        this.$message.success('订单已取消')
        this.loadOrderStats()
      })
    },

    // 查看订单详情
    viewOrderDetail(order) {
      // 为订单添加状态流信息
      order.statusFlow = this.generateStatusFlow(order)
      this.currentOrder = order
      this.detailDialogVisible = true
    },

    // 生成订单状态流
    generateStatusFlow(order) {
      const statusMap = {
        待接单: { title: '待接单', icon: 'el-icon-time', desc: '等待商家接单' },
        已接单: { title: '已接单', icon: 'el-icon-check', desc: '商家已接单' },
        制作中: { title: '制作中', icon: 'el-icon-food', desc: '正在制作食物' },
        配送中: { title: '配送中', icon: 'el-icon-truck', desc: '配送员取货中' },
        已送达: { title: '已送达', icon: 'el-icon-location-outline', desc: '商品已送达' },
        用户已取货: { title: '用户已取货', icon: 'el-icon-success', desc: '用户已确认收货' },
        已取消: { title: '已取消', icon: 'el-icon-close', desc: '订单已取消' },
      }

      const flow = []
      const statusSequence = this.getStatusSequence(order.status)

      statusSequence.forEach((status, index) => {
        const statusInfo = statusMap[status]
        if (statusInfo) {
          flow.push({
            title: statusInfo.title,
            icon: statusInfo.icon,
            description: statusInfo.desc,
            time: this.getStatusTime(order, status, index),
            completed: index < statusSequence.indexOf(order.status),
            current: status === order.status,
          })
        }
      })

      return flow
    },

    // 获取状态序列
    getStatusSequence(currentStatus) {
      const sequences = {
        待接单: ['待接单'],
        已接单: ['待接单', '已接单'],
        制作中: ['待接单', '已接单', '制作中'],
        配送中: ['待接单', '已接单', '制作中', '配送中'],
        已送达: ['待接单', '已接单', '制作中', '配送中', '已送达'],
        用户已取货: ['待接单', '已接单', '制作中', '配送中', '已送达', '用户已取货'],
        已取消: ['待接单', '已取消'],
      }
      return sequences[currentStatus] || ['待接单']
    },

    // 获取状态时间
    getStatusTime(order, status, index) {
      const createTime = new Date(order.createTime)
      const timeMap = {
        0: order.createTime,
        1: this.addMinutes(createTime, 2).toLocaleString(),
        2: this.addMinutes(createTime, 25).toLocaleString(),
        3: this.addMinutes(createTime, 35).toLocaleString(),
        4: this.addMinutes(createTime, 45).toLocaleString(),
        5: this.addMinutes(createTime, 50).toLocaleString(),
        6: this.addMinutes(createTime, 10).toLocaleString(),
      }
      return timeMap[index] || ''
    },

    // 添加分钟
    addMinutes(date, minutes) {
      return new Date(date.getTime() + minutes * 60000)
    },

    // 快速接单
    quickAcceptOrder(order) {
      this.$confirm(`确认快速接单？订单号: ${order.orderNo}`, '提示', {
        confirmButtonText: '确认接单',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        order.status = '已接单'
        order.statusFlow = this.generateStatusFlow(order)
        this.$message.success('订单已接单')
        this.loadOrderStats()
      })
    },

    // 快速完成制作
    quickCompleteCooking(order) {
      this.$confirm(`确认完成制作？订单号: ${order.orderNo}`, '提示', {
        confirmButtonText: '确认完成',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        order.status = '配送中'
        order.statusFlow = this.generateStatusFlow(order)
        this.$message.success('制作已完成，订单进入配送')
        this.loadOrderStats()
      })
    },

    // 快速分配配送
    quickAssignDelivery(order) {
      this.$prompt('请输入配送员姓名', '分配配送', {
        confirmButtonText: '确认分配',
        cancelButtonText: '取消',
        inputPattern: /.+/,
        inputErrorMessage: '配送员姓名不能为空',
      }).then(({ value }) => {
        order.status = '配送中'
        order.deliveryPerson = value
        order.statusFlow = this.generateStatusFlow(order)
        this.$message.success(`已分配配送员: ${value}`)
        this.loadOrderStats()
      })
    },

    // 分页处理
    handleSizeChange(size) {
      this.pagination.size = size
      this.loadOrders()
    },

    handleCurrentChange(page) {
      this.pagination.page = page
      this.loadOrders()
    },
  },
}
</script>

<style scoped>
.merchant-orders {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.filter-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

/* 统计卡片 */
.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 8px;
  text-align: center;
  border: none;
}

.stat-content {
  padding: 10px 0;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-card.pending .stat-number {
  color: #e6a23c;
}
.stat-card.cooking .stat-number {
  color: #409eff;
}
.stat-card.delivering .stat-number {
  color: #67c23a;
}
.stat-card.ready .stat-number {
  color: #909399;
}
.stat-card.completed .stat-number {
  color: #409eff;
}
.stat-card.revenue .stat-number {
  color: #e6a23c;
}
.stat-card.avg-rating .stat-number {
  color: #f56c6c;
}

/* 趋势指示器样式 */
.stat-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;
  font-size: 12px;
  gap: 4px;
}

.trend-up {
  color: #67c23a;
}

.trend-warning {
  color: #e6a23c;
}

.trend-normal {
  color: #409eff;
}

.trend-success {
  color: #67c23a;
}

/* 状态时间轴样式 */
.status-timeline {
  padding: 20px 0;
}

.timeline-step {
  display: flex;
  align-items: flex-start;
  margin-bottom: 30px;
  position: relative;
}

.timeline-step:last-child {
  margin-bottom: 0;
}

.step-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #909399;
  z-index: 2;
  flex-shrink: 0;
}

.timeline-step.active .step-icon {
  background: #409eff;
  color: white;
}

.timeline-step.current .step-icon {
  background: #e6a23c;
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(230, 162, 60, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(230, 162, 60, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(230, 162, 60, 0);
  }
}

.step-content {
  margin-left: 20px;
  flex: 1;
}

.step-title {
  font-weight: 600;
  color: #303133;
  margin-bottom: 5px;
}

.step-time {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.step-desc {
  font-size: 12px;
  color: #c0c4cc;
}

.step-line {
  position: absolute;
  left: 19px;
  top: 40px;
  width: 2px;
  height: calc(100% + 10px);
  background: #e4e7ed;
  z-index: 1;
}

.timeline-step:last-child .step-line {
  display: none;
}

.timeline-step.active .step-line {
  background: #409eff;
}

/* 快速操作样式 */
.quick-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* 订单详情对话框样式优化 */
.detail-section {
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.detail-section h4 {
  margin-bottom: 15px;
  color: #303133;
  font-size: 16px;
  font-weight: 600;
}

.detail-item {
  margin-bottom: 10px;
}

.detail-item label {
  display: inline-block;
  width: 80px;
  color: #606266;
  font-weight: 500;
}

.detail-item span {
  color: #303133;
}

/* 费用明细样式 */
.fee-breakdown {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
}

.fee-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.fee-item.total {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #dee2e6;
  font-weight: 600;
  font-size: 16px;
}

.remark {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  font-style: italic;
  color: #606266;
  border-left: 4px solid #409eff;
}
}
.stat-card.revenue .stat-number {
  color: #ff4757;
}

/* 订单列表 */
.orders-card {
  border-radius: 8px;
  border: none;
}

.order-no {
  font-family: 'Courier New', monospace;
  color: #409eff;
}

.time-info {
  font-size: 12px;
}

.customer-info {
  font-size: 12px;
}

.customer-phone {
  color: #999;
}

.order-items {
  font-size: 12px;
}

.item-line {
  margin-bottom: 2px;
}

.more-items {
  color: #999;
  font-style: italic;
}

.amount {
  font-weight: bold;
  color: #ff4757;
}

.pay-type {
  font-size: 12px;
  color: #666;
}

/* 分页 */
.pagination-wrapper {
  margin-top: 20px;
  text-align: right;
}

/* 订单详情 */
.order-detail {
  max-height: 500px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 25px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.detail-item {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.detail-item label {
  width: 80px;
  font-weight: bold;
  color: #666;
}

.fee-breakdown {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
}

.fee-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.fee-item.total {
  border-top: 1px solid #ddd;
  padding-top: 8px;
  font-weight: bold;
  font-size: 16px;
}

.remark {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  margin: 0;
  color: #666;
}

/* 响应式 */
@media (max-width: 768px) {
  .merchant-orders {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .stats-row .el-col {
    margin-bottom: 10px;
  }
}
</style>
