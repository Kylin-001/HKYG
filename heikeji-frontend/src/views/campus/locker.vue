<template>
  <div class="locker-list-container">
    <div class="page-header">
      <h2>智能外卖柜管理</h2>
      <div class="header-actions">
        <el-button type="success" @click="handleViewMap">
          <i class="el-icon-location"></i> 校园地图
        </el-button>
        <el-button type="warning" @click="handleViewStats">
          <i class="el-icon-data-analysis"></i> 使用统计
        </el-button>
        <el-button type="primary" @click="handleAddLocker">
          <i class="el-icon-plus"></i> 添加外卖柜
        </el-button>
      </div>
    </div>

    <!-- 监控仪表板 -->
    <div class="monitoring-dashboard">
      <div class="dashboard-header">
        <h3>实时监控仪表板</h3>
        <div class="refresh-info">
          <span>最后更新: {{ lastUpdateTime }}</span>
          <el-button size="mini" @click="refreshData" :loading="monitoringLoading">
            <i class="el-icon-refresh"></i> 刷新
          </el-button>
        </div>
      </div>

      <!-- 状态监控卡片 -->
      <div class="status-cards">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-card class="status-card">
              <div class="stats-content">
                <div class="stats-number">{{ lockerStats.onlineCount }}</div>
                <div class="stats-label">在线外卖柜</div>
                <div class="trend-indicator" :class="getTrendClass('online')">
                  <i :class="getTrendIcon('online')"></i>
                  {{ getTrendText('online') }}
                </div>
              </div>
              <div class="stats-icon online">
                <i class="el-icon-wifi"></i>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="status-card">
              <div class="stats-content">
                <div class="stats-number">{{ lockerStats.offlineCount }}</div>
                <div class="stats-label">离线外卖柜</div>
                <div class="trend-indicator" :class="getTrendClass('offline')">
                  <i :class="getTrendIcon('offline')"></i>
                  {{ getTrendText('offline') }}
                </div>
              </div>
              <div class="stats-icon offline">
                <i class="el-icon-wifi-outline"></i>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="status-card">
              <div class="stats-content">
                <div class="stats-number">{{ lockerStats.usageRate }}%</div>
                <div class="stats-label">平均使用率</div>
                <div class="progress-bar">
                  <el-progress
                    :percentage="lockerStats.usageRate"
                    :color="getUsageRateColor(lockerStats.usageRate)"
                  ></el-progress>
                </div>
              </div>
              <div class="stats-icon usage">
                <i class="el-icon-pie-chart"></i>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="status-card warning">
              <div class="stats-content">
                <div class="stats-number">{{ lockerStats.warningCount }}</div>
                <div class="stats-label">设备告警</div>
                <div class="alert-list">
                  <div class="alert-item" v-for="alert in recentAlerts.slice(0, 2)" :key="alert.id">
                    {{ alert.type }}: {{ alert.count }}
                  </div>
                </div>
              </div>
              <div class="stats-icon warning">
                <i class="el-icon-warning"></i>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="status-card">
              <div class="stats-content">
                <div class="stats-number">{{ lockerStats.totalTransactions }}</div>
                <div class="stats-label">今日交易</div>
                <div class="real-time-stats">
                  <div class="stat-item">
                    <span class="label">取餐:</span>
                    <span class="value">{{ lockerStats.todayPickup }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="label">投餐:</span>
                    <span class="value">{{ lockerStats.todayDeposit }}</span>
                  </div>
                </div>
              </div>
              <div class="stats-icon transaction">
                <i class="el-icon-data-analysis"></i>
              </div>
            </el-card>
          </el-col>
          <el-col :span="4">
            <el-card class="status-card success">
              <div class="stats-content">
                <div class="stats-number">{{ lockerStats.averageResponseTime }}ms</div>
                <div class="stats-label">平均响应时间</div>
                <div class="performance-indicators">
                  <div
                    class="indicator"
                    :class="getPerformanceClass(lockerStats.averageResponseTime)"
                  >
                    <i class="el-icon-cpu"></i> 响应良好
                  </div>
                </div>
              </div>
              <div class="stats-icon performance">
                <i class="el-icon-timer"></i>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- 实时监控图表 -->
    <div class="monitoring-charts">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-card class="chart-card">
            <div slot="header">
              <span>设备状态分布</span>
              <el-tag size="small" :type="getStatusTagType(1)" class="ml-10">实时</el-tag>
            </div>
            <div class="chart-container">
              <div class="status-distribution">
                <div class="status-item" v-for="status in statusDistribution" :key="status.name">
                  <div class="status-bar">
                    <div
                      class="status-color"
                      :style="{ backgroundColor: status.color, width: status.percentage + '%' }"
                    ></div>
                  </div>
                  <div class="status-info">
                    <span class="status-name">{{ status.name }}</span>
                    <span class="status-count">{{ status.count }} ({{ status.percentage }}%)</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="chart-card">
            <div slot="header">
              <span>使用趋势 (24小时)</span>
              <el-button-group size="small" class="ml-10">
                <el-button :type="timeRange === '1h' ? 'primary' : ''" @click="timeRange = '1h'"
                  >1小时</el-button
                >
                <el-button :type="timeRange === '24h' ? 'primary' : ''" @click="timeRange = '24h'"
                  >24小时</el-button
                >
                <el-button :type="timeRange === '7d' ? 'primary' : ''" @click="timeRange = '7d'"
                  >7天</el-button
                >
              </el-button-group>
            </div>
            <div class="chart-container">
              <div class="usage-trend">
                <div class="trend-chart">
                  <div
                    class="trend-line"
                    v-for="(point, index) in usageTrendData"
                    :key="index"
                    :style="{ left: point.x + '%', height: point.y + '%' }"
                    :title="point.label + ': ' + point.value"
                  ></div>
                </div>
                <div class="chart-legend">
                  <div class="legend-item">
                    <div class="legend-color" style="background-color: #409eff"></div>
                    <span>取餐次数</span>
                  </div>
                  <div class="legend-item">
                    <div class="legend-color" style="background-color: #67c23a"></div>
                    <span>投餐次数</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 容量预警提示 -->
    <el-alert
      v-if="urgentLockers.length > 0"
      title="紧急提醒"
      type="error"
      :description="`当前有 ${urgentLockers.length} 个外卖柜容量不足，需要及时处理`"
      :closable="false"
      show-icon
      class="urgent-alert"
    >
      <el-button size="mini" type="danger" @click="handleBatchProcess">批量处理</el-button>
    </el-alert>

    <el-card class="mt-20">
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
          <el-form-item label="所属校区">
            <el-select
              v-model="searchForm.campusId"
              placeholder="请选择校区"
              clearable
              @change="onCampusChange"
            >
              <el-option
                v-for="campus in campusList"
                :key="campus.id"
                :label="campus.name"
                :value="campus.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属楼栋">
            <el-select v-model="searchForm.buildingId" placeholder="请选择楼栋" clearable>
              <el-option
                v-for="building in filteredBuildings"
                :key="building.id"
                :label="building.name"
                :value="building.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="外卖柜编号">
            <el-input v-model="searchForm.code" placeholder="请输入外卖柜编号" clearable></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
              <el-option label="在线" value="online"></el-option>
              <el-option label="离线" value="offline"></el-option>
              <el-option label="容量预警" value="warning"></el-option>
              <el-option label="维护中" value="maintenance"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <i class="el-icon-search"></i> 搜索
            </el-button>
            <el-button @click="resetSearch"> <i class="el-icon-refresh"></i> 重置 </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        v-loading="loading"
        :data="lockerList"
        style="width: 100%"
        stripe
        border
        row-key="id"
        :row-class-name="getRowClassName"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="locker-detail">
              <el-row :gutter="20">
                <el-col :span="8">
                  <h4>基本信息</h4>
                  <p><strong>地址：</strong>{{ props.row.location }}</p>
                  <p><strong>最后维护：</strong>{{ props.row.lastMaintenance || '暂无记录' }}</p>
                  <p><strong>备注：</strong>{{ props.row.remark || '无' }}</p>
                </el-col>
                <el-col :span="8">
                  <h4>使用统计</h4>
                  <p><strong>今日存放：</strong>{{ props.row.todayCount || 0 }} 次</p>
                  <p><strong>本周存放：</strong>{{ props.row.weekCount || 0 }} 次</p>
                  <p><strong>本月存放：</strong>{{ props.row.monthCount || 0 }} 次</p>
                </el-col>
                <el-col :span="8">
                  <h4>配送员信息</h4>
                  <p><strong>在线配送员：</strong>{{ props.row.onlineCourierCount || 0 }} 人</p>
                  <p><strong>待取餐：</strong>{{ props.row.pendingPickup || 0 }} 单</p>
                  <p><strong>今日配送：</strong>{{ props.row.todayDelivery || 0 }} 单</p>
                </el-col>
              </el-row>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id" label="外卖柜ID" width="80"></el-table-column>
        <el-table-column prop="campusName" label="所属校区" width="150"></el-table-column>
        <el-table-column prop="buildingName" label="所属楼栋" width="150"></el-table-column>
        <el-table-column prop="code" label="外卖柜编号" width="150"></el-table-column>
        <el-table-column prop="location" label="详细位置" width="200">
          <template slot-scope="{ row }">
            <el-tooltip :content="row.location" placement="top">
              <span>{{
                row.location.length > 20 ? row.location.substring(0, 20) + '...' : row.location
              }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="compartmentCount" label="总格口数" width="100"></el-table-column>
        <el-table-column prop="availableCompartments" label="可用格口" width="100">
          <template slot-scope="{ row }">
            <el-tag :type="getAvailabilityTagType(row.availableCompartments, row.compartmentCount)">
              {{ row.availableCompartments }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="onlineStatus" label="在线状态" width="100">
          <template slot-scope="{ row }">
            <el-tag :type="row.onlineStatus === 'online' ? 'success' : 'danger'">
              {{ row.onlineStatus === 'online' ? '在线' : '离线' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="120">
          <template slot-scope="{ row }">
            <el-tag :type="getStatusTagType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEditLocker(scope.row)"
              :disabled="!scope.row.status"
            >
              编辑
            </el-button>
            <el-button
              :type="scope.row.status === 1 ? 'danger' : 'success'"
              size="small"
              @click="handleUpdateStatus(scope.row)"
            >
              {{ scope.row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button type="warning" size="small" @click="handleMaintainLocker(scope.row)">
              维护
            </el-button>
            <el-button type="info" size="small" @click="handleViewCouriers(scope.row)">
              配送员
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          :page-sizes="[10, 20, 50, 100]"
          :current-page.sync="pagination.currentPage"
          :page-size.sync="pagination.pageSize"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加/编辑外卖柜对话框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="600px"
      :close-on-click-modal="false"
    >
      <el-form
        :model="lockerForm"
        :rules="rules"
        ref="lockerFormRef"
        label-width="120px"
        size="small"
      >
        <el-form-item label="所属校区" prop="campusId">
          <el-select
            v-model="lockerForm.campusId"
            placeholder="请选择校区"
            @change="onFormCampusChange"
          >
            <el-option
              v-for="campus in campusList"
              :key="campus.id"
              :label="campus.name"
              :value="campus.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属楼栋" prop="buildingId">
          <el-select v-model="lockerForm.buildingId" placeholder="请选择楼栋">
            <el-option
              v-for="building in formFilteredBuildings"
              :key="building.id"
              :label="building.name"
              :value="building.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="外卖柜编号" prop="code">
          <el-input v-model="lockerForm.code" placeholder="请输入外卖柜编号"></el-input>
        </el-form-item>
        <el-form-item label="详细位置" prop="location">
          <el-input v-model="lockerForm.location" placeholder="请输入详细位置"></el-input>
        </el-form-item>
        <el-form-item label="格口数量" prop="compartmentCount">
          <el-input-number
            v-model="lockerForm.compartmentCount"
            :min="1"
            :max="100"
            placeholder="请输入格口数量"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="lockerForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!-- 校园地图对话框 -->
    <el-dialog title="校园外卖柜分布地图" :visible.sync="mapDialogVisible" width="800px">
      <div class="campus-map">
        <div id="lockerMap" class="map-container"></div>
        <div class="map-legend">
          <h4>图例</h4>
          <div class="legend-item"><span class="legend-marker online"></span> 在线</div>
          <div class="legend-item"><span class="legend-marker offline"></span> 离线</div>
          <div class="legend-item"><span class="legend-marker warning"></span> 容量预警</div>
          <div class="legend-item"><span class="legend-marker maintenance"></span> 维护中</div>
        </div>
      </div>
    </el-dialog>

    <!-- 配送员信息对话框 -->
    <el-dialog title="配送员状态" :visible.sync="courierDialogVisible" width="600px">
      <div class="courier-info" v-if="selectedLocker">
        <h4>{{ selectedLocker.campusName }} - {{ selectedLocker.buildingName }}</h4>
        <el-table :data="courierList" style="width: 100%">
          <el-table-column prop="name" label="姓名" width="120"></el-table-column>
          <el-table-column prop="phone" label="电话" width="120"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="{ row }">
              <el-tag :type="row.status === 'online' ? 'success' : 'info'">
                {{ row.status === 'online' ? '在线' : '离线' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="pendingOrders" label="待取餐" width="80"></el-table-column>
          <el-table-column prop="todayDeliveries" label="今日配送" width="80"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox, FormInstance } from 'element-plus'
import logger from '@/utils/logger'

// 定义类型接口
interface SearchForm {
  campusId: string
  buildingId: string
  code: string
  status: string
}

interface Pagination {
  currentPage: number
  pageSize: number
}

interface LockerForm {
  id?: string
  campusId: string
  buildingId: string
  code: string
  location: string
  compartmentCount: number
  remark: string
}

interface LockerStats {
  onlineCount: number
  offlineCount: number
  usageRate: number
  warningCount: number
  totalTransactions?: number
  todayPickup?: number
  todayDeposit?: number
  averageResponseTime?: number
}

interface Trend {
  value: number
  isPositive: boolean
}

interface Trends {
  online: Trend
  offline: Trend
  usage: Trend
}

interface StatusDistributionItem {
  name: string
  count: number
  percentage: number
  color: string
}

interface UsageTrendPoint {
  x: number
  y: number
  label: string
  value: number
}

interface Alert {
  id: number
  type: string
  count: number
}

interface Courier {
  name: string
  phone: string
  status: string
  pendingOrders: number
  todayDeliveries: number
}

interface Locker {
  id: number
  code: string
  buildingName: string
  onlineStatus: string
  availableCompartments: number
  status: number
  campusId: string
  buildingId: string
  location: string
  compartmentCount: number
  remark?: string
}

// 获取Vuex store
const store = useStore()

// 从Vuex获取状态
const lockerList = computed(() => store.state.campus.lockerList)
const lockerTotal = computed(() => store.state.campus.lockerTotal)
const campusList = computed(() => store.state.campus.campusList)
const buildingList = computed(() => store.state.campus.buildingList)

// 响应式数据
const loading = ref(false)
const searchForm = reactive<SearchForm>({
  campusId: '',
  buildingId: '',
  code: '',
  status: '',
})

const pagination = reactive<Pagination>({
  currentPage: 1,
  pageSize: 10,
})

const dialogVisible = ref(false)
const dialogTitle = ref('')
const editingLocker = ref<Locker | null>(null)
const lockerForm = reactive<LockerForm>({
  campusId: '',
  buildingId: '',
  code: '',
  location: '',
  compartmentCount: 10,
  remark: '',
})

const lockerFormRef = ref<FormInstance | null>(null)

const rules = reactive({
  campusId: [{ required: true, message: '请选择所属校区', trigger: 'change' }],
  buildingId: [{ required: true, message: '请选择所属楼栋', trigger: 'change' }],
  code: [
    { required: true, message: '请输入外卖柜编号', trigger: 'blur' },
    { min: 1, max: 20, message: '外卖柜编号长度在 1 到 20 个字符', trigger: 'blur' },
  ],
  location: [
    { required: true, message: '请输入详细位置', trigger: 'blur' },
    { min: 1, max: 100, message: '详细位置长度在 1 到 100 个字符', trigger: 'blur' },
  ],
  compartmentCount: [{ required: true, message: '请输入格口数量', trigger: 'blur' }],
})

// 新增校园特色功能数据
const mapDialogVisible = ref(false)
const courierDialogVisible = ref(false)
const statsDialogVisible = ref(false)
const selectedLocker = ref<Locker | null>(null)
const urgentLockers = ref<Locker[]>([])

const lockerStats = reactive<LockerStats>({
  onlineCount: 0,
  offlineCount: 0,
  usageRate: 0,
  warningCount: 0,
})

const courierList = ref<Courier[]>([])

// 监控相关数据
const lastUpdateTime = ref('')
const monitoringLoading = ref(false)
const timeRange = ref('24h')

const statusDistribution = reactive<StatusDistributionItem[]>([
  { name: '正常运行', count: 45, percentage: 85, color: '#67c23a' },
  { name: '使用中', count: 8, percentage: 15, color: '#e6a23c' },
  { name: '离线', count: 2, percentage: 4, color: '#f56c6c' },
  { name: '维护中', count: 1, percentage: 2, color: '#909399' },
])

const usageTrendData = reactive<UsageTrendPoint[]>([
  { x: 0, y: 20, label: '00:00', value: 12 },
  { x: 10, y: 15, label: '01:00', value: 8 },
  { x: 20, y: 30, label: '02:00', value: 15 },
  { x: 30, y: 25, label: '03:00', value: 18 },
  { x: 40, y: 40, label: '04:00', value: 25 },
  { x: 50, y: 60, label: '05:00', value: 35 },
  { x: 60, y: 80, label: '06:00', value: 55 },
  { x: 70, y: 95, label: '07:00', value: 68 },
  { x: 80, y: 100, label: '08:00', value: 75 },
  { x: 90, y: 85, label: '09:00', value: 62 },
])

const recentAlerts = reactive<Alert[]>([
  { id: 1, type: '设备离线', count: 2 },
  { id: 2, type: '格口满载', count: 5 },
  { id: 3, type: '通信异常', count: 1 },
])

const trends = reactive<Trends>({
  online: { value: 2, isPositive: true },
  offline: { value: -1, isPositive: false },
  usage: { value: 5, isPositive: true },
})

// 计算属性
const total = computed(() => lockerTotal.value)

// 根据选择的校区筛选楼栋列表
const filteredBuildings = computed(() => {
  if (!searchForm.campusId) return buildingList.value
  return buildingList.value.filter(item => item.campusId === searchForm.campusId)
})

// 表单中根据选择的校区筛选楼栋列表
const formFilteredBuildings = computed(() => {
  if (!lockerForm.campusId) return buildingList.value
  return buildingList.value.filter(item => item.campusId === lockerForm.campusId)
})

// Vuex actions
const getLockers = (params: any) => store.dispatch('campus/getLockers', params)
const addNewLocker = (params: any) => store.dispatch('campus/addNewLocker', params)
const updateExistingLocker = (params: any) => store.dispatch('campus/updateExistingLocker', params)
const updateLockerEnabledStatus = (params: any) =>
  store.dispatch('campus/updateLockerEnabledStatus', params)
const getCampuses = () => store.dispatch('campus/getCampuses')
const getBuildings = () => store.dispatch('campus/getBuildings')

// 生命周期钩子
onMounted(() => {
  loadData()
  initializeStats()
})

// 加载数据
const loadData = async () => {
  loading.value = true
  try {
    // 先加载校区和楼栋列表
    await Promise.all([getCampuses(), getBuildings()])
    // 再加载外卖柜列表
    await loadLockerList()
  } catch (error) {
    ElMessage.error('数据加载失败')
  } finally {
    loading.value = false
  }
}

// 加载外卖柜列表
const loadLockerList = async () => {
  try {
    await getLockers({
      ...searchForm,
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
    })
  } catch (error) {
    ElMessage.error('获取外卖柜列表失败')
  }
}

// 搜索
const handleSearch = () => {
  pagination.currentPage = 1
  loadLockerList()
}

// 重置搜索
const resetSearch = () => {
  searchForm.campusId = ''
  searchForm.buildingId = ''
  searchForm.code = ''
  searchForm.status = ''
  handleSearch()
}

// 分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadLockerList()
}

// 分页页码变化
const handleCurrentChange = (current: number) => {
  pagination.currentPage = current
  loadLockerList()
}

// 校区选择变化
const onCampusChange = () => {
  searchForm.buildingId = ''
}

// 表单中校区选择变化
const onFormCampusChange = () => {
  lockerForm.buildingId = ''
}

// 添加外卖柜
const handleAddLocker = () => {
  dialogTitle.value = '添加外卖柜'
  editingLocker.value = null
  lockerForm.campusId = campusList.value.length > 0 ? campusList.value[0].id : ''
  lockerForm.buildingId = ''
  lockerForm.code = ''
  lockerForm.location = ''
  lockerForm.compartmentCount = 10
  lockerForm.remark = ''
  dialogVisible.value = true
}

// 编辑外卖柜
const handleEditLocker = (row: Locker) => {
  dialogTitle.value = '编辑外卖柜'
  editingLocker.value = row
  lockerForm.id = row.id
  lockerForm.campusId = row.campusId
  lockerForm.buildingId = row.buildingId
  lockerForm.code = row.code
  lockerForm.location = row.location
  lockerForm.compartmentCount = row.compartmentCount || 10
  lockerForm.remark = row.remark || ''
  dialogVisible.value = true
}

// 更新状态
const handleUpdateStatus = async (row: Locker) => {
  const originalStatus = row.status
  const newStatus = originalStatus === 1 ? 0 : 1
  try {
    await ElMessageBox.confirm(`确定要${newStatus === 1 ? '启用' : '禁用'}该外卖柜吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    await updateLockerEnabledStatus({ id: row.id, status: newStatus })
    ElMessage.success(`${newStatus === 1 ? '启用' : '禁用'}成功`)
    // 重新加载列表以获取最新数据
    await loadLockerList()
    // 重新初始化统计数据
    initializeStats()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error(`${newStatus === 1 ? '启用' : '禁用'}失败`)
      // 恢复原状态
      row.status = originalStatus
    }
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!lockerFormRef.value) return

  try {
    await lockerFormRef.value.validate()

    // 转换数据类型
    const submitData = {
      ...lockerForm,
      compartmentCount: Number(lockerForm.compartmentCount),
    }

    if (editingLocker.value) {
      // 更新外卖柜
      await updateExistingLocker(submitData)
      ElMessage.success('外卖柜更新成功')
    } else {
      // 添加外卖柜
      await addNewLocker(submitData)
      ElMessage.success('外卖柜添加成功')
    }
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error(editingLocker.value ? '外卖柜更新失败' : '外卖柜添加失败')
  }
}

// 初始化统计数据
const initializeStats = async () => {
  try {
    // 模拟统计数据
    Object.assign(lockerStats, {
      onlineCount: Math.floor(Math.random() * 20) + 5,
      offlineCount: Math.floor(Math.random() * 3),
      usageRate: Math.floor(Math.random() * 30) + 60,
      warningCount: Math.floor(Math.random() * 5),
      totalTransactions: 1248 + Math.floor(Math.random() * 100),
      todayPickup: 567 + Math.floor(Math.random() * 50),
      todayDeposit: 681 + Math.floor(Math.random() * 50),
      averageResponseTime: 120 + Math.floor(Math.random() * 50),
    })

    // 生成紧急需要处理的外卖柜
    urgentLockers.value = lockerList.value.filter(
      locker => locker.availableCompartments <= 3 && locker.status === 1
    )

    // 初始化时间戳
    lastUpdateTime.value = new Date().toLocaleString('zh-CN')
  } catch (error) {
    logger.error('初始化统计数据失败:', error)
  }
}

// 刷新监控数据
const refreshData = async () => {
  monitoringLoading.value = true
  try {
    // 模拟数据刷新延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    initializeStats()
    updateStatusDistribution()
    updateUsageTrend()
    updateTrends()
    lastUpdateTime.value = new Date().toLocaleString('zh-CN')
    ElMessage.success('数据刷新成功')
  } catch (error) {
    ElMessage.error('数据刷新失败')
  } finally {
    monitoringLoading.value = false
  }
}

// 获取趋势样式类
const getTrendClass = (type: string) => {
  const trend = trends[type as keyof Trends]
  if (!trend) return ''
  return trend.isPositive ? 'positive' : 'negative'
}

// 获取趋势图标
const getTrendIcon = (type: string) => {
  const trend = trends[type as keyof Trends]
  if (!trend) return 'el-icon-minus'
  return trend.isPositive ? 'el-icon-top' : 'el-icon-bottom'
}

// 获取趋势文本
const getTrendText = (type: string) => {
  const trend = trends[type as keyof Trends]
  if (!trend) return '无变化'
  return trend.isPositive ? `+${trend.value}` : `${trend.value}`
}

// 获取使用率颜色
const getUsageRateColor = (rate: number) => {
  if (rate >= 80) return '#f56c6c'
  if (rate >= 60) return '#e6a23c'
  if (rate >= 40) return '#409eff'
  return '#67c23a'
}

// 获取性能样式类
const getPerformanceClass = (responseTime: number) => {
  if (responseTime <= 100) return 'excellent'
  if (responseTime <= 300) return 'good'
  if (responseTime <= 500) return 'normal'
  return 'poor'
}

// 更新状态分布数据
const updateStatusDistribution = () => {
  // 模拟实时更新状态分布
  statusDistribution.forEach(item => {
    item.count = Math.floor(Math.random() * 10) + item.count - 5
    item.percentage = Math.floor(Math.random() * 10) + item.percentage - 5
  })
}

// 更新使用趋势数据
const updateUsageTrend = () => {
  // 模拟实时更新使用趋势
  usageTrendData.forEach(point => {
    point.y = Math.floor(Math.random() * 20) + point.y - 10
    point.value = Math.floor(Math.random() * 20) + point.value - 10
  })
}

// 更新趋势数据
const updateTrends = () => {
  // 模拟实时更新趋势
  trends.online.value = Math.floor(Math.random() * 5) - 2
  trends.online.isPositive = Math.random() > 0.3
  trends.offline.value = Math.floor(Math.random() * 3) - 1
  trends.offline.isPositive = Math.random() < 0.5
  trends.usage.value = Math.floor(Math.random() * 10) - 3
  trends.usage.isPositive = Math.random() > 0.4
}

// 查看校园地图
const handleViewMap = () => {
  mapDialogVisible.value = true
  // 延迟加载地图，确保DOM已渲染
  nextTick(() => {
    initCampusMap()
  })
}

// 初始化校园地图
const initCampusMap = () => {
  const mapContainer = document.getElementById('lockerMap')
  if (!mapContainer) return

  // 模拟地图初始化
  mapContainer.innerHTML = `
    <div class="mock-campus-map">
      <div class="campus-building" style="top: 20px; left: 20px;">
        <div class="building-name">第一教学楼</div>
        <div class="locker-markers">
          ${generateLockers(1, 3)}
        </div>
      </div>
      <div class="campus-building" style="top: 20px; right: 20px;">
        <div class="building-name">第二教学楼</div>
        <div class="locker-markers">
          ${generateLockers(4, 6)}
        </div>
      </div>
      <div class="campus-building" style="bottom: 20px; left: 20px;">
        <div class="building-name">学生宿舍A区</div>
        <div class="locker-markers">
          ${generateLockers(7, 10)}
        </div>
      </div>
      <div class="campus-building" style="bottom: 20px; right: 20px;">
        <div class="building-name">学生宿舍B区</div>
        <div class="locker-markers">
          ${generateLockers(11, 15)}
        </div>
      </div>
    </div>
  `
}

// 生成外卖柜标记
const generateLockers = (start: number, end: number) => {
  let html = ''
  for (let i = start; i <= end; i++) {
    const locker = lockerList.value.find((l: Locker) => l.id === i)
    if (locker) {
      const status = locker.onlineStatus === 'online' ? 'online' : 'offline'
      const usage = locker.availableCompartments <= 3 ? 'warning' : 'normal'
      html += `<div class="locker-marker ${status} ${usage}" title="${locker.code} - ${locker.buildingName}">
        <i class="el-icon-box"></i>
      </div>`
    } else {
      html += `<div class="locker-marker offline" title="外卖柜${i} - 暂无数据">
        <i class="el-icon-box"></i>
      </div>`
    }
  }
  return html
}

// 查看使用统计
const handleViewStats = () => {
  statsDialogVisible.value = true
  // 这里可以打开统计图表对话框
  ElMessage.info('统计图表功能正在开发中...')
}

// 维护外卖柜
const handleMaintainLocker = (row: Locker) => {
  ElMessageBox.prompt('请输入维护原因', '外卖柜维护', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputType: 'textarea',
    inputPlaceholder: '请详细描述需要维护的问题...',
  })
    .then(({ value }) => {
      // 模拟维护操作
      ElMessage.success(`外卖柜${row.code}已标记为维护状态`)
    })
    .catch(() => {
      // 取消维护
    })
}

// 查看配送员信息
const handleViewCouriers = (row: Locker) => {
  selectedLocker.value = row
  courierDialogVisible.value = true

  // 模拟加载配送员数据
  courierList.value = [
    {
      name: '张三',
      phone: '13800138001',
      status: 'online',
      pendingOrders: 5,
      todayDeliveries: 23,
    },
    {
      name: '李四',
      phone: '13800138002',
      status: 'offline',
      pendingOrders: 0,
      todayDeliveries: 8,
    },
    {
      name: '王五',
      phone: '13800138003',
      status: 'online',
      pendingOrders: 2,
      todayDeliveries: 15,
    },
    {
      name: '赵六',
      phone: '13800138004',
      status: 'online',
      pendingOrders: 3,
      todayDeliveries: 20,
    },
  ]
}

// 批量处理紧急情况
const handleBatchProcess = () => {
  ElMessageBox.confirm(
    `确定要批量处理 ${urgentLockers.value.length} 个容量不足的外卖柜吗？`,
    '批量处理',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      // 模拟批量处理
      ElMessage.success(`已成功处理 ${urgentLockers.value.length} 个外卖柜的容量问题`)
      urgentLockers.value = []
    })
    .catch(() => {
      // 取消批量处理
    })
}

// 获取表格行样式类名
const getRowClassName = ({ row }: { row: Locker }) => {
  if (row.availableCompartments <= 3 && row.status === 1) {
    return 'urgent-row'
  }
  if (row.onlineStatus === 'offline') {
    return 'offline-row'
  }
  return ''
}

// 获取可用格口标签类型
const getAvailabilityTagType = (available: number, total: number) => {
  const ratio = available / total
  if (ratio <= 0.2) return 'danger'
  if (ratio <= 0.5) return 'warning'
  return 'success'
}

// 获取状态标签类型
const getStatusTagType = (status: string) => {
  switch (status) {
    case 'warning':
      return 'warning'
    case 'maintenance':
      return 'info'
    case 'offline':
      return 'danger'
    case 'online':
      return 'success'
    default:
      return 'info'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'warning':
      return '容量预警'
    case 'maintenance':
      return '维护中'
    case 'offline':
      return '离线'
    case 'online':
      return '正常'
    default:
      return '未知'
  }
}
</script>

<style lang="scss" scoped>
.locker-list-container {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    .header-actions {
      display: flex;
      gap: 10px;
    }

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
  }

  .status-cards {
    margin-bottom: 20px;

    .status-card {
      position: relative;
      height: 100px;
      display: flex;
      align-items: center;

      .stats-content {
        flex: 1;

        .stats-number {
          font-size: 28px;
          font-weight: bold;
          color: #303133;
          line-height: 1;
        }

        .stats-label {
          font-size: 14px;
          color: #909399;
          margin-top: 5px;
        }
      }

      .stats-icon {
        font-size: 36px;
        margin-left: 15px;

        &.online {
          color: #67c23a;
        }
        &.offline {
          color: #f56c6c;
        }
        &.usage {
          color: #e6a23c;
        }
        &.warning {
          color: #f56c6c;
        }
      }

      &.warning {
        border-left: 4px solid #f56c6c;
      }
    }
  }

  .urgent-alert {
    margin-bottom: 20px;
  }

  .search-form {
    margin-bottom: 20px;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

// 监控图表样式
.monitoring-charts {
  margin-top: 20px;

  .chart-card {
    .chart-container {
      height: 250px;
      padding: 10px;
    }
  }
}

// 监控仪表板样式
.monitoring-dashboard {
  margin-bottom: 20px;

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    h3 {
      margin: 0;
      color: #303133;
      font-size: 18px;
    }

    .refresh-info {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 12px;
      color: #909399;
    }
  }
}

.status-card {
  position: relative;
  overflow: hidden;

  .stats-content {
    flex: 1;
  }

  .stats-number {
    font-size: 2em;
    font-weight: bold;
    color: #303133;
  }

  .stats-label {
    color: #606266;
    margin: 5px 0;
    font-size: 12px;
  }

  .stats-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;

    &.online {
      background-color: #67c23a;
    }

    &.offline {
      background-color: #f56c6c;
    }

    &.usage {
      background-color: #409eff;
    }

    &.warning {
      background-color: #e6a23c;
    }

    &.transaction {
      background-color: #e6a23c;
    }

    &.performance {
      background-color: #909399;
    }
  }

  .stats-icon.success {
    background-color: #67c23a;
  }
}

// 趋势指标样式
.trend-indicator {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  font-weight: bold;

  &.positive {
    color: #67c23a;
  }

  &.negative {
    color: #f56c6c;
  }
}

// 进度条样式
.progress-bar {
  margin-top: 5px;
}

// 告警列表样式
.alert-list {
  margin-top: 5px;

  .alert-item {
    font-size: 11px;
    color: #e6a23c;
    padding: 2px 0;
  }
}

// 实时统计样式
.real-time-stats {
  margin-top: 5px;

  .stat-item {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    margin: 2px 0;

    .label {
      color: #909399;
    }

    .value {
      font-weight: bold;
      color: #303133;
    }
  }
}

// 性能指标样式
.performance-indicators {
  margin-top: 5px;

  .indicator {
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 3px;

    &.excellent {
      background-color: #f0f9ff;
      color: #67c23a;
    }

    &.good {
      background-color: #f0f9ff;
      color: #409eff;
    }

    &.normal {
      background-color: #fcf6cd;
      color: #e6a23c;
    }

    &.poor {
      background-color: #fef0f0;
      color: #f56c6c;
    }
  }
}

// 状态分布图表样式
.status-distribution {
  .status-item {
    margin-bottom: 15px;

    .status-bar {
      height: 8px;
      background-color: #f5f7fa;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 5px;

      .status-color {
        height: 100%;
        border-radius: 4px;
        transition: width 0.3s ease;
      }
    }

    .status-info {
      display: flex;
      justify-content: space-between;
      font-size: 12px;

      .status-name {
        color: #303133;
      }

      .status-count {
        color: #909399;
      }
    }
  }
}

// 使用趋势图表样式
.usage-trend {
  .trend-chart {
    height: 160px;
    position: relative;
    background: linear-gradient(to bottom, #f0f9ff 0%, #ffffff 100%);
    border-radius: 4px;
    padding: 10px;

    .trend-line {
      position: absolute;
      width: 2px;
      background-color: #409eff;
      border-radius: 1px;
      transition: all 0.3s ease;

      &:hover {
        background-color: #e6a23c;
        transform: scaleX(2);
      }
    }
  }

  .chart-legend {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 10px;

    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 12px;

      .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 2px;
      }
    }
  }
}

// 扩展表格样式
::v-deep {
  .el-table {
    .urgent-row {
      background-color: #fef0f0 !important;

      &:hover > td {
        background-color: #fef0f0 !important;
      }
    }

    .offline-row {
      opacity: 0.6;

      &:hover > td {
        opacity: 0.6;
      }
    }
  }

  .locker-detail {
    padding: 20px;
    background-color: #fafafa;
    border-radius: 4px;
    margin: 10px 0;

    h4 {
      margin: 0 0 10px 0;
      color: #303133;
      font-size: 16px;
    }

    p {
      margin: 8px 0;
      color: #606266;
      line-height: 1.5;

      strong {
        color: #303133;
      }
    }
  }
}

// 监控页面布局样式
::v-deep .el-row {
  .el-col {
    margin-bottom: 10px;
  }
}

// 响应式调整
@media (max-width: 1200px) {
  .status-card {
    .stats-number {
      font-size: 1.5em;
    }

    .stats-icon {
      width: 50px;
      height: 50px;
      font-size: 20px;
    }
  }

  .monitoring-charts {
    .chart-card {
      .chart-container {
        height: 200px;
      }
    }
  }
}

// 校园地图样式
.campus-map {
  position: relative;

  .map-container {
    width: 100%;
    height: 500px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
  }

  .mock-campus-map {
    width: 100%;
    height: 100%;
    background:
      linear-gradient(45deg, #f0f9ff 25%, transparent 25%),
      linear-gradient(-45deg, #f0f9ff 25%, transparent 25%),
      linear-gradient(45deg, transparent 75%, #f0f9ff 75%),
      linear-gradient(-45deg, transparent 75%, #f0f9ff 75%);
    background-size: 20px 20px;
    background-position:
      0 0,
      0 10px,
      10px -10px,
      -10px 0px;
    position: relative;
  }

  .campus-building {
    position: absolute;
    width: 150px;
    height: 100px;
    background: white;
    border: 2px solid #409eff;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    .building-name {
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 8px;
      color: #303133;
    }

    .locker-markers {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
      justify-content: center;
    }
  }

  .locker-marker {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.2);
    }

    &.online {
      background-color: #67c23a;
      color: white;
    }

    &.offline {
      background-color: #f56c6c;
      color: white;
    }

    &.warning {
      background-color: #e6a23c;
      color: white;
      animation: pulse 1.5s infinite;
    }

    &.normal {
      background-color: #409eff;
      color: white;
    }
  }

  .map-legend {
    position: absolute;
    top: 20px;
    right: 20px;
    background: white;
    padding: 15px;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    h4 {
      margin: 0 0 10px 0;
      font-size: 14px;
      color: #303133;
    }

    .legend-item {
      display: flex;
      align-items: center;
      margin: 5px 0;
      font-size: 12px;

      .legend-marker {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 8px;

        &.online {
          background-color: #67c23a;
        }
        &.offline {
          background-color: #f56c6c;
        }
        &.warning {
          background-color: #e6a23c;
        }
        &.maintenance {
          background-color: #909399;
        }
      }
    }
  }
}

// 配送员信息样式
.courier-info {
  h4 {
    margin: 0 0 20px 0;
    padding-bottom: 10px;
    border-bottom: 1px solid #dcdfe6;
    color: #303133;
  }
}

// 脉冲动画
@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.7;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
