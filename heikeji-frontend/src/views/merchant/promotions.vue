<template>
  <div class="merchant-promotions">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>营销活动</h2>
      <div class="header-actions">
        <el-button type="primary" @click="addPromotion">
          <i class="el-icon-plus"></i>
          创建活动
        </el-button>
        <el-button @click="viewTemplates">活动模板</el-button>
      </div>
    </div>

    <!-- 活动统计 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon primary">
              <i class="el-icon-ticket"></i>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ promotionStats.total }}</div>
              <div class="stat-label">活动总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card active">
          <div class="stat-content">
            <div class="stat-icon success">
              <i class="el-icon-success"></i>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ promotionStats.active }}</div>
              <div class="stat-label">进行中</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card upcoming">
          <div class="stat-content">
            <div class="stat-icon warning">
              <i class="el-icon-time"></i>
            </div>
            <div class="stat-info">
              <div class="stat-number">{{ promotionStats.upcoming }}</div>
              <div class="stat-label">即将开始</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card revenue">
          <div class="stat-content">
            <div class="stat-icon info">
              <i class="el-icon-money"></i>
            </div>
            <div class="stat-info">
              <div class="stat-number">¥{{ promotionStats.revenue }}</div>
              <div class="stat-label">活动收益</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 筛选和搜索 -->
    <el-card class="filter-card">
      <el-form :inline="true" :model="filterForm">
        <el-form-item label="活动状态">
          <el-select
            v-model="filterForm.status"
            placeholder="全部状态"
            @change="handleFilterChange"
          >
            <el-option label="全部状态" value=""></el-option>
            <el-option label="未开始" value="未开始"></el-option>
            <el-option label="进行中" value="进行中"></el-option>
            <el-option label="已结束" value="已结束"></el-option>
            <el-option label="已暂停" value="已暂停"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="活动类型">
          <el-select v-model="filterForm.type" placeholder="全部类型" @change="handleFilterChange">
            <el-option label="全部类型" value=""></el-option>
            <el-option label="满减活动" value="满减活动"></el-option>
            <el-option label="折扣优惠" value="折扣优惠"></el-option>
            <el-option label="新用户专享" value="新用户专享"></el-option>
            <el-option label="单品优惠" value="单品优惠"></el-option>
            <el-option label="满赠活动" value="满赠活动"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="活动名称">
          <el-input
            v-model="filterForm.keyword"
            placeholder="搜索活动名称"
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

    <!-- 活动列表 -->
    <el-card class="promotions-card">
      <el-tabs v-model="activeTab" @tab-click="handleTabClick">
        <el-tab-pane label="所有活动" name="all"></el-tab-pane>
        <el-tab-pane label="满减活动" name="满减活动"></el-tab-pane>
        <el-tab-pane label="折扣优惠" name="折扣优惠"></el-tab-pane>
        <el-tab-pane label="新用户专享" name="新用户专享"></el-tab-pane>
      </el-tabs>

      <div class="promotions-grid">
        <div
          v-for="promotion in filteredPromotions"
          :key="promotion.id"
          class="promotion-card"
          :class="{ 'promotion-active': promotion.status === '进行中' }"
        >
          <!-- 活动头部 -->
          <div class="promotion-header">
            <div class="promotion-title">
              <span class="promotion-name">{{ promotion.name }}</span>
              <el-tag :type="getStatusType(promotion.status)" size="small">
                {{ promotion.status }}
              </el-tag>
            </div>
            <div class="promotion-actions">
              <el-dropdown @command="handleCommand">
                <el-button size="mini" type="text">
                  <i class="el-icon-more"></i>
                </el-button>
                <el-dropdown-menu v-slot:dropdown>
                  <el-dropdown-item :command="{ action: 'edit', promotion }">编辑</el-dropdown-item>
                  <el-dropdown-item :command="{ action: 'copy', promotion }">复制</el-dropdown-item>
                  <el-dropdown-item :command="{ action: 'toggle', promotion }">
                    {{ promotion.status === '进行中' ? '暂停' : '启用' }}
                  </el-dropdown-item>
                  <el-dropdown-item :command="{ action: 'delete', promotion }" divided
                    >删除</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>

          <!-- 活动类型和优惠信息 -->
          <div class="promotion-type">
            <el-tag size="small">{{ promotion.type }}</el-tag>
          </div>

          <div class="promotion-content">
            <div class="promotion-desc">{{ promotion.description }}</div>
            <div class="promotion-condition">
              <span v-if="promotion.conditionType === '满减'">
                满{{ promotion.conditionAmount }}减{{ promotion.discountAmount }}
              </span>
              <span v-else-if="promotion.conditionType === '折扣'">
                {{ promotion.discountRate }}折
              </span>
              <span v-else-if="promotion.conditionType === '新用户'">
                新用户专享立减{{ promotion.discountAmount }}元
              </span>
            </div>
          </div>

          <!-- 活动时间 -->
          <div class="promotion-time">
            <div class="time-label">活动时间</div>
            <div class="time-value">{{ promotion.startTime }} 至 {{ promotion.endTime }}</div>
          </div>

          <!-- 活动数据 -->
          <div class="promotion-stats">
            <div class="stat-item">
              <span class="stat-label">浏览量</span>
              <span class="stat-value">{{ promotion.views }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">参与量</span>
              <span class="stat-value">{{ promotion.participants }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">转化率</span>
              <span class="stat-value">{{ promotion.conversionRate }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">优惠金额</span>
              <span class="stat-value">¥{{ promotion.discountAmount }}</span>
            </div>
          </div>

          <!-- 进度条 -->
          <div class="promotion-progress">
            <div class="progress-label">
              <span>参与进度</span>
              <span>{{ promotion.participants }}/{{ promotion.maxParticipants || '∞' }}</span>
            </div>
            <el-progress
              :percentage="getProgressPercentage(promotion)"
              :show-text="false"
              :stroke-width="6"
            />
          </div>

          <!-- 操作按钮 -->
          <div class="promotion-footer">
            <el-button
              v-if="promotion.status === '未开始'"
              type="primary"
              size="mini"
              @click="startPromotion(promotion)"
            >
              开始活动
            </el-button>
            <el-button
              v-if="promotion.status === '进行中'"
              type="warning"
              size="mini"
              @click="pausePromotion(promotion)"
            >
              暂停
            </el-button>
            <el-button
              v-if="promotion.status === '已暂停'"
              type="success"
              size="mini"
              @click="resumePromotion(promotion)"
            >
              恢复
            </el-button>
            <el-button size="mini" @click="viewPromotionDetail(promotion)">详情</el-button>
            <el-button size="mini" @click="viewPromotionData(promotion)">数据</el-button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredPromotions.length === 0" class="empty-state">
        <i class="el-icon-ticket empty-icon"></i>
        <p>暂无营销活动</p>
        <el-button type="primary" @click="addPromotion">创建第一个活动</el-button>
      </div>
    </el-card>

    <!-- 添加/编辑活动对话框 -->
    <el-dialog
      :title="isEditing ? '编辑活动' : '创建活动'"
      :visible.sync="promotionDialogVisible"
      width="700px"
      @close="resetPromotionForm"
    >
      <el-form
        :model="promotionForm"
        :rules="promotionRules"
        ref="promotionFormRef"
        label-width="100px"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="promotionForm.name" placeholder="请输入活动名称"></el-input>
        </el-form-item>

        <el-form-item label="活动类型" prop="type">
          <el-select
            v-model="promotionForm.type"
            placeholder="选择活动类型"
            @change="handleTypeChange"
          >
            <el-option label="满减活动" value="满减活动"></el-option>
            <el-option label="折扣优惠" value="折扣优惠"></el-option>
            <el-option label="新用户专享" value="新用户专享"></el-option>
            <el-option label="单品优惠" value="单品优惠"></el-option>
            <el-option label="满赠活动" value="满赠活动"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="活动描述" prop="description">
          <el-input
            v-model="promotionForm.description"
            type="textarea"
            :rows="3"
            placeholder="请输入活动描述"
          />
        </el-form-item>

        <!-- 活动规则 -->
        <div class="promotion-rules">
          <h4>活动规则</h4>

          <!-- 满减活动 -->
          <div v-if="promotionForm.type === '满减活动'" class="rule-form">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="满足条件" prop="conditionAmount">
                  <el-input-number
                    v-model="promotionForm.conditionAmount"
                    :min="0"
                    :step="1"
                    placeholder="满足金额"
                  />
                  元
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="减免金额" prop="discountAmount">
                  <el-input-number
                    v-model="promotionForm.discountAmount"
                    :min="0"
                    :step="0.1"
                    :precision="2"
                    placeholder="减免金额"
                  />
                  元
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 折扣优惠 -->
          <div v-if="promotionForm.type === '折扣优惠'" class="rule-form">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="折扣比例" prop="discountRate">
                  <el-input-number
                    v-model="promotionForm.discountRate"
                    :min="1"
                    :max="9.9"
                    :step="0.1"
                    :precision="1"
                    placeholder="折扣比例"
                  />
                  折
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="封顶金额" prop="maxDiscount">
                  <el-input-number
                    v-model="promotionForm.maxDiscount"
                    :min="0"
                    :step="0.1"
                    :precision="2"
                    placeholder="封顶金额"
                  />
                  元
                </el-form-item>
              </el-col>
            </el-row>
          </div>

          <!-- 新用户专享 -->
          <div v-if="promotionForm.type === '新用户专享'" class="rule-form">
            <el-form-item label="优惠金额" prop="discountAmount">
              <el-input-number
                v-model="promotionForm.discountAmount"
                :min="0"
                :step="0.1"
                :precision="2"
                placeholder="优惠金额"
              />
              元
            </el-form-item>
          </div>

          <!-- 参与条件 -->
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="使用门槛" prop="minOrderAmount">
                <el-input-number
                  v-model="promotionForm.minOrderAmount"
                  :min="0"
                  :step="1"
                  placeholder="最小订单金额"
                />
                元
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="每人限用" prop="usageLimit">
                <el-input-number
                  v-model="promotionForm.usageLimit"
                  :min="1"
                  placeholder="使用次数限制"
                />
                次
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="活动总量" prop="maxParticipants">
                <el-input-number
                  v-model="promotionForm.maxParticipants"
                  :min="0"
                  placeholder="0表示不限制"
                />
                人
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="店铺承担比例" prop="storeShare">
                <el-input-number
                  v-model="promotionForm.storeShare"
                  :min="0"
                  :max="100"
                  :step="5"
                  placeholder="店铺承担比例"
                />
                %
              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 活动时间 -->
        <el-form-item label="活动时间" prop="timeRange">
          <el-date-picker
            v-model="promotionForm.timeRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
          />
        </el-form-item>

        <!-- 适用商品 -->
        <el-form-item label="适用商品">
          <el-radio-group v-model="promotionForm.applicableScope">
            <el-radio label="all">全部商品</el-radio>
            <el-radio label="category">指定分类</el-radio>
            <el-radio label="product">指定商品</el-radio>
          </el-radio-group>

          <div v-if="promotionForm.applicableScope === 'category'" class="applicable-select">
            <el-checkbox-group v-model="promotionForm.selectedCategories">
              <el-checkbox v-for="category in categories" :key="category.id" :label="category.id">
                {{ category.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>

          <div v-if="promotionForm.applicableScope === 'product'" class="applicable-select">
            <el-select
              v-model="promotionForm.selectedProducts"
              multiple
              placeholder="选择适用商品"
              style="width: 100%"
            >
              <el-option
                v-for="product in products"
                :key="product.id"
                :label="product.name"
                :value="product.id"
              />
            </el-select>
          </div>
        </el-form-item>

        <!-- 活动图片 -->
        <el-form-item label="活动图片">
          <el-upload
            class="upload-demo"
            action=""
            :show-file-list="false"
            :before-upload="beforeImageUpload"
          >
            <img v-if="promotionForm.image" :src="promotionForm.image" class="upload-image" />
            <div v-else class="upload-placeholder">
              <i class="el-icon-plus"></i>
              <p>点击上传活动图片</p>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>

      <div v-slot:footer>
        <el-button @click="promotionDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePromotion">保存</el-button>
      </div>
    </el-dialog>

    <!-- 活动详情对话框 -->
    <el-dialog title="活动详情" :visible.sync="detailDialogVisible" width="600px">
      <div v-if="currentPromotion" class="promotion-detail">
        <div class="detail-section">
          <h4>基本信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <label>活动名称:</label>
              <span>{{ currentPromotion.name }}</span>
            </div>
            <div class="detail-item">
              <label>活动类型:</label>
              <span>{{ currentPromotion.type }}</span>
            </div>
            <div class="detail-item">
              <label>活动状态:</label>
              <el-tag :type="getStatusType(currentPromotion.status)" size="small">
                {{ currentPromotion.status }}
              </el-tag>
            </div>
            <div class="detail-item">
              <label>创建时间:</label>
              <span>{{ currentPromotion.createTime }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>活动规则</h4>
          <div class="rule-description">
            {{ currentPromotion.description }}
          </div>
        </div>

        <div class="detail-section">
          <h4>活动数据</h4>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="data-item">
                <div class="data-value">{{ currentPromotion.views }}</div>
                <div class="data-label">浏览量</div>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="data-item">
                <div class="data-value">{{ currentPromotion.participants }}</div>
                <div class="data-label">参与量</div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useRouter } from 'vue-router'
import type { FormInstance } from 'element-plus'

// 定义类型接口
interface PromotionStats {
  total: number
  active: number
  upcoming: number
  revenue: number
}

interface FilterForm {
  status: string
  type: string
  keyword: string
}

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  name: string
}

interface Promotion {
  id: number
  name: string
  type: string
  description: string
  conditionType?: string
  conditionAmount?: number
  discountAmount?: number
  discountRate?: number
  maxDiscount?: number
  status: string
  startTime: string
  endTime: string
  views: number
  participants: number
  conversionRate: number
  maxParticipants: number
  createTime: string
}

interface PromotionForm {
  name: string
  type: string
  description: string
  conditionAmount: number
  discountAmount: number
  discountRate: number
  maxDiscount: number
  minOrderAmount: number
  usageLimit: number
  maxParticipants: number
  storeShare: number
  timeRange: string[]
  applicableScope: 'all' | 'category' | 'product'
  selectedCategories: number[]
  selectedProducts: number[]
  image: string
}

interface Command {
  action: string
  promotion: Promotion
}

// 响应式数据
const promotionStats = reactive<PromotionStats>({
  total: 8,
  active: 3,
  upcoming: 2,
  revenue: 2845.6,
})

const filterForm = reactive<FilterForm>({
  status: '',
  type: '',
  keyword: '',
})

const activeTab = ref<string>('all')
const promotions = ref<Promotion[]>([])
const categories = ref<Category[]>([])
const products = ref<Product[]>([])
const isEditing = ref<boolean>(false)
const promotionDialogVisible = ref<boolean>(false)
const detailDialogVisible = ref<boolean>(false)
const currentPromotion = ref<Promotion | null>(null)

const promotionForm = reactive<PromotionForm>({
  name: '',
  type: '',
  description: '',
  conditionAmount: 0,
  discountAmount: 0,
  discountRate: 0,
  maxDiscount: 0,
  minOrderAmount: 0,
  usageLimit: 1,
  maxParticipants: 0,
  storeShare: 100,
  timeRange: [],
  applicableScope: 'all',
  selectedCategories: [],
  selectedProducts: [],
  image: '',
})

const promotionRules = {
  name: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  description: [{ required: true, message: '请输入活动描述', trigger: 'blur' }],
}

// 表单引用
const promotionFormRef = ref<FormInstance | null>(null)

// 路由
const router = useRouter()

// 计算属性
const filteredPromotions = computed(() => {
  let result = promotions.value

  if (filterForm.status) {
    result = result.filter(p => p.status === filterForm.status)
  }

  if (filterForm.type) {
    result = result.filter(p => p.type === filterForm.type)
  }

  if (filterForm.keyword) {
    result = result.filter(p => p.name.includes(filterForm.keyword))
  }

  if (activeTab.value !== 'all') {
    result = result.filter(p => p.type === activeTab.value)
  }

  return result
})

// 生命周期钩子
onMounted(() => {
  loadPromotionData()
})

// 方法
// 加载活动数据
const loadPromotionData = () => {
  // 模拟数据
  promotions.value = [
    {
      id: 1,
      name: '新用户立减10元',
      type: '新用户专享',
      description: '新用户首次下单立减10元',
      conditionType: '新用户',
      discountAmount: 10.0,
      status: '进行中',
      startTime: '2024-11-21 00:00',
      endTime: '2024-12-31 23:59',
      views: 156,
      participants: 23,
      conversionRate: 14.7,
      maxParticipants: 1000,
      createTime: '2024-11-20 10:30',
    },
    {
      id: 2,
      name: '满50减8',
      type: '满减活动',
      description: '单笔订单满50元立减8元',
      conditionType: '满减',
      conditionAmount: 50,
      discountAmount: 8.0,
      status: '进行中',
      startTime: '2024-11-21 00:00',
      endTime: '2024-11-30 23:59',
      views: 89,
      participants: 12,
      conversionRate: 13.5,
      maxParticipants: 200,
      createTime: '2024-11-19 14:20',
    },
    {
      id: 3,
      name: '双十一特惠8折',
      type: '折扣优惠',
      description: '全场商品8折优惠',
      conditionType: '折扣',
      discountRate: 8.0,
      maxDiscount: 20.0,
      status: '未开始',
      startTime: '2024-11-25 00:00',
      endTime: '2024-11-25 23:59',
      views: 234,
      participants: 0,
      conversionRate: 0,
      maxParticipants: 500,
      createTime: '2024-11-20 16:45',
    },
  ]

  categories.value = [
    { id: 1, name: '面条类' },
    { id: 2, name: '小菜类' },
    { id: 3, name: '饮品类' },
    { id: 4, name: '小吃类' },
  ]

  products.value = [
    { id: 1, name: '兰州拉面' },
    { id: 2, name: '牛肉拉面' },
    { id: 3, name: '凉拌三丝' },
  ]
}

// 获取状态样式类型
const getStatusType = (status: string): string => {
  const typeMap: Record<string, string> = {
    未开始: 'info',
    进行中: 'success',
    已结束: 'danger',
    已暂停: 'warning',
  }
  return typeMap[status] || 'info'
}

// 获取进度百分比
const getProgressPercentage = (promotion: Promotion): number => {
  if (!promotion.maxParticipants) return 0
  return (promotion.participants / promotion.maxParticipants) * 100
}

// 处理筛选变化
const handleFilterChange = () => {
  // 筛选逻辑
}

// 处理搜索
const handleSearch = () => {
  // 搜索逻辑
}

// 重置筛选
const resetFilter = () => {
  filterForm.status = ''
  filterForm.type = ''
  filterForm.keyword = ''
}

// 处理Tab切换
const handleTabClick = (tab: any) => {
  // Tab切换逻辑
}

// 添加活动
const addPromotion = () => {
  isEditing.value = false
  resetPromotionForm()
  promotionDialogVisible.value = true
}

// 处理活动类型变化
const handleTypeChange = () => {
  // 根据类型重置相关字段
}

// 重置活动表单
const resetPromotionForm = () => {
  promotionForm.name = ''
  promotionForm.type = ''
  promotionForm.description = ''
  promotionForm.conditionAmount = 0
  promotionForm.discountAmount = 0
  promotionForm.discountRate = 0
  promotionForm.maxDiscount = 0
  promotionForm.minOrderAmount = 0
  promotionForm.usageLimit = 1
  promotionForm.maxParticipants = 0
  promotionForm.storeShare = 100
  promotionForm.timeRange = []
  promotionForm.applicableScope = 'all'
  promotionForm.selectedCategories = []
  promotionForm.selectedProducts = []
  promotionForm.image = ''
}

// 保存活动
const savePromotion = () => {
  promotionFormRef.value?.validate(valid => {
    if (valid) {
      // 保存逻辑
      promotionDialogVisible.value = false
      ElMessage.success(isEditing.value ? '活动已更新' : '活动已创建')
      loadPromotionData()
    }
  })
}

// 查看活动模板
const viewTemplates = () => {
  ElMessage.info('活动模板功能开发中...')
}

// 下拉菜单命令处理
const handleCommand = (command: Command) => {
  const { action, promotion } = command

  switch (action) {
    case 'edit':
      editPromotion(promotion)
      break
    case 'copy':
      copyPromotion(promotion)
      break
    case 'toggle':
      togglePromotionStatus(promotion)
      break
    case 'delete':
      deletePromotion(promotion)
      break
  }
}

// 编辑活动
const editPromotion = (promotion: Promotion) => {
  isEditing.value = true
  Object.assign(promotionForm, promotion)
  promotionDialogVisible.value = true
}

// 复制活动
const copyPromotion = (promotion: Promotion) => {
  ElMessage.success('活动已复制')
}

// 切换活动状态
const togglePromotionStatus = (promotion: Promotion) => {
  if (promotion.status === '进行中') {
    promotion.status = '已暂停'
  } else {
    promotion.status = '进行中'
  }
  ElMessage.success('活动状态已更新')
}

// 删除活动
const deletePromotion = (promotion: Promotion) => {
  ElMessageBox.confirm(`确定要删除活动"${promotion.name}"吗？`, '提示', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    ElMessage.success('活动已删除')
    loadPromotionData()
  })
}

// 开始活动
const startPromotion = (promotion: Promotion) => {
  promotion.status = '进行中'
  ElMessage.success('活动已开始')
}

// 暂停活动
const pausePromotion = (promotion: Promotion) => {
  promotion.status = '已暂停'
  ElMessage.success('活动已暂停')
}

// 恢复活动
const resumePromotion = (promotion: Promotion) => {
  promotion.status = '进行中'
  ElMessage.success('活动已恢复')
}

// 查看活动详情
const viewPromotionDetail = (promotion: Promotion) => {
  currentPromotion.value = promotion
  detailDialogVisible.value = true
}

// 查看活动数据
const viewPromotionData = (promotion: Promotion) => {
  router.push(`/merchant/promotions/${promotion.id}/analytics`)
}

// 图片上传前处理
const beforeImageUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传图片只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传图片大小不能超过 2MB!')
    return false
  }

  ElMessage.success('图片上传功能开发中...')
  return false
}
</script>

<style scoped>
.merchant-promotions {
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

/* 统计卡片 */
.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: none;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.stat-icon.primary {
  background: #409eff;
}
.stat-icon.success {
  background: #67c23a;
}
.stat-icon.warning {
  background: #e6a23c;
}
.stat-icon.info {
  background: #909399;
}

.stat-info {
  flex: 1;
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

.filter-card,
.promotions-card {
  border-radius: 8px;
  border: none;
  margin-bottom: 20px;
}

/* 活动卡片网格 */
.promotions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.promotion-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.promotion-card.promotion-active {
  border-color: #67c23a;
}

.promotion-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* 活动头部 */
.promotion-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.promotion-title {
  flex: 1;
}

.promotion-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-right: 10px;
}

.promotion-actions {
  margin-left: 10px;
}

/* 活动类型 */
.promotion-type {
  margin-bottom: 15px;
}

/* 活动内容 */
.promotion-content {
  margin-bottom: 15px;
}

.promotion-desc {
  color: #666;
  margin-bottom: 8px;
  font-size: 14px;
}

.promotion-condition {
  font-weight: bold;
  color: #ff4757;
  font-size: 16px;
}

/* 活动时间 */
.promotion-time {
  margin-bottom: 15px;
}

.time-label {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.time-value {
  font-size: 14px;
  color: #333;
}

/* 活动数据 */
.promotion-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 15px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-item {
  text-align: center;
}

.stat-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
}

.stat-value {
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

/* 进度条 */
.promotion-progress {
  margin-bottom: 15px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-size: 12px;
  color: #666;
}

/* 操作按钮 */
.promotion-footer {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  color: #ddd;
}

/* 活动规则表单 */
.promotion-rules {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.promotion-rules h4 {
  margin: 0 0 15px 0;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 5px;
}

.rule-form {
  margin-bottom: 20px;
}

.applicable-select {
  margin-top: 10px;
  padding: 15px;
  background: white;
  border-radius: 4px;
}

/* 图片上传 */
.upload-demo {
  width: 200px;
  height: 120px;
}

.upload-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.upload-placeholder {
  width: 100%;
  height: 100%;
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  cursor: pointer;
}

.upload-placeholder i {
  font-size: 30px;
  margin-bottom: 5px;
}

/* 活动详情 */
.promotion-detail {
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

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.detail-item {
  display: flex;
  align-items: center;
}

.detail-item label {
  width: 80px;
  font-weight: bold;
  color: #666;
}

.rule-description {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  color: #666;
  line-height: 1.6;
}

.data-item {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.data-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.data-label {
  font-size: 14px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .merchant-promotions {
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

  .promotions-grid {
    grid-template-columns: 1fr;
  }

  .promotion-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .promotion-footer {
    justify-content: center;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
