<template>
  <div class="marketing-coupon-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>优惠券管理</span>
        <el-button type="primary" size="small" @click="handleAdd">
          <i class="el-icon-plus"></i> 添加优惠券
        </el-button>
      </div>

      <el-form :inline="true" :model="searchForm" class="coupon-search-form">
        <el-form-item label="优惠券名称">
          <el-input v-model="searchForm.name" placeholder="请输入优惠券名称"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型">
            <el-option value="" label="全部"></el-option>
            <el-option value="cash" label="现金券"></el-option>
            <el-option value="discount" label="折扣券"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态">
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="启用"></el-option>
            <el-option value="0" label="禁用"></el-option>
            <el-option value="2" label="已过期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效期">
          <el-date-picker
            v-model="searchForm.validTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchCoupons">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="coupons" style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="name" label="优惠券名称" width="200"></el-table-column>
        <el-table-column prop="type" label="类型" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.type === 'cash'" type="primary">现金券</el-tag>
            <el-tag v-else type="success">折扣券</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="优惠金额/折扣" width="120">
          <template slot-scope="scope">
            {{ scope.row.type === 'cash' ? `￥${scope.row.value}` : `${scope.row.value}折` }}
          </template>
        </el-table-column>
        <el-table-column prop="minAmount" label="最低消费" width="120">
          <template slot-scope="scope">
            {{ scope.row.minAmount === 0 ? '无门槛' : `￥${scope.row.minAmount}` }}
          </template>
        </el-table-column>
        <el-table-column prop="totalCount" label="发行总量" width="100"></el-table-column>
        <el-table-column prop="usedCount" label="已使用" width="100"></el-table-column>
        <el-table-column prop="startTime" label="有效期开始" width="180"></el-table-column>
        <el-table-column prop="endTime" label="有效期结束" width="180"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
            <el-tag v-else-if="scope.row.status === 0" type="warning">禁用</el-tag>
            <el-tag v-else type="danger">已过期</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)" :disabled="scope.row.status === 2"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handleBatchSend(scope.row)"
              :disabled="scope.row.status !== 1"
              >批量发放</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              :disabled="scope.row.status !== 0"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        :page-size.sync="pagination.pageSize"
        :current-page.sync="pagination.currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="coupon-pagination"
      ></el-pagination>
    </el-card>

    <!-- 添加/编辑优惠券对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="700px">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="优惠券名称" prop="name">
          <el-input
            v-model="formData.name"
            placeholder="请输入优惠券名称"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="优惠券类型" prop="type">
          <el-radio-group v-model="formData.type" @change="handleTypeChange">
            <el-radio value="cash">现金券</el-radio>
            <el-radio value="discount">折扣券</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠金额" prop="value" v-if="formData.type === 'cash'">
          <el-input-number
            v-model="formData.value"
            :min="0.01"
            :precision="2"
            :step="0.01"
            style="width: 100%"
            placeholder="请输入优惠金额"
          >
            <template slot="prepend">￥</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="折扣" prop="value" v-else-if="formData.type === 'discount'">
          <el-input-number
            v-model="formData.value"
            :min="0.1"
            :max="9.9"
            :precision="1"
            :step="0.1"
            style="width: 100%"
            placeholder="请输入折扣系数"
          >
            <template slot="append">折</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="最低消费" prop="minAmount">
          <el-input-number
            v-model="formData.minAmount"
            :min="0"
            :precision="2"
            :step="0.01"
            style="width: 100%"
            placeholder="请输入最低消费金额，0表示无门槛"
          >
            <template slot="prepend">￥</template>
          </el-input-number>
        </el-form-item>
        <el-form-item label="发行总量" prop="totalCount">
          <el-input-number
            v-model="formData.totalCount"
            :min="1"
            :step="1"
            style="width: 100%"
            placeholder="请输入发行数量"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="有效期开始" prop="startTime">
          <el-date-picker
            v-model="formData.startTime"
            type="datetime"
            placeholder="请选择有效期开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="有效期结束" prop="endTime">
          <el-date-picker
            v-model="formData.endTime"
            type="datetime"
            placeholder="请选择有效期结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="formData.status"
            active-text="启用"
            inactive-text="禁用"
            active-value="1"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="使用说明" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            rows="3"
            placeholder="请输入优惠券使用说明"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!-- 批量发放对话框 -->
    <el-dialog title="批量发放" :visible.sync="batchSendVisible" width="500px">
      <el-form :model="batchForm" label-width="120px">
        <el-form-item label="发放数量">
          <el-input-number
            v-model="batchForm.count"
            :min="1"
            :step="1"
            style="width: 100%"
            placeholder="请输入发放数量"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="发放对象">
          <el-select v-model="batchForm.targetType" placeholder="请选择发放对象">
            <el-option value="all" label="全部用户"></el-option>
            <el-option value="vip" label="VIP用户"></el-option>
            <el-option value="new" label="新用户"></el-option>
            <el-option value="custom" label="指定用户"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchSendVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchSend">确认发放</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 类型定义
interface CouponItem {
  id: number
  name: string
  type: 'cash' | 'discount'
  value: number
  minAmount: number
  totalCount: number
  usedCount: number
  startTime: string
  endTime: string
  status: number
  description: string
}

interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

interface SearchForm {
  name: string
  type: string
  status: string
  validTime: string[]
}

interface FormData {
  name: string
  type: 'cash' | 'discount'
  value: number
  minAmount: number
  totalCount: number
  startTime: string
  endTime: string
  status: number
  description: string
  id?: number
}

interface BatchForm {
  count: number
  targetType: string
  userIds: number[]
}

// 优惠券列表数据
const coupons = ref<CouponItem[]>([])

// 分页信息
const pagination = reactive<Pagination>({
  currentPage: 1,
  pageSize: 10,
  total: 0
})

// 加载状态
const loading = ref(false)

// 搜索表单
const searchForm = reactive<SearchForm>({
  name: '',
  type: '',
  status: '',
  validTime: []
})

// 表单数据
const formData = reactive<FormData>({
  name: '',
  type: 'cash',
  value: 0,
  minAmount: 0,
  totalCount: 100,
  startTime: '',
  endTime: '',
  status: 1,
  description: ''
})

// 批量发放表单
const batchForm = reactive<BatchForm>({
  count: 1,
  targetType: 'all',
  userIds: []
})

// 对话框显示状态
const dialogVisible = ref(false)
const batchSendVisible = ref(false)

// 表单加载状态
const submitLoading = ref(false)

// 是否编辑状态
const isEdit = ref(false)

// 对话框标题
const dialogTitle = ref('添加优惠券')

// 当前选中的优惠券
const currentCoupon = ref<CouponItem | null>(null)

// 表单引用
const formRef = ref()

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入优惠券名称', trigger: 'blur' },
    { max: 50, message: '长度不能超过50个字符', trigger: 'blur' }
  ],
  type: [{ required: true, message: '请选择优惠券类型', trigger: 'change' }],
  value: [
    { required: true, message: '请输入优惠值', trigger: 'blur' },
    { type: 'number', message: '优惠值必须为数字', trigger: 'blur' }
  ],
  minAmount: [{ type: 'number', message: '最低消费必须为数字', trigger: 'blur' }],
  totalCount: [
    { required: true, message: '请输入发行总量', trigger: 'blur' },
    { type: 'number', message: '发行总量必须为数字', trigger: 'blur' }
  ],
  startTime: [{ required: true, message: '请选择有效期开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择有效期结束时间', trigger: 'change' }]
}

// 获取优惠券列表
const fetchCoupons = async () => {
  loading.value = true
  try {
    // 模拟数据
    coupons.value = [
      {
        id: 1,
        name: '满100减20',
        type: 'cash',
        value: 20,
        minAmount: 100,
        totalCount: 1000,
        usedCount: 500,
        startTime: '2024-01-01 00:00:00',
        endTime: '2024-12-31 23:59:59',
        status: 1,
        description: '满100元即可使用'
      },
      {
        id: 2,
        name: '9折优惠券',
        type: 'discount',
        value: 9.0,
        minAmount: 0,
        totalCount: 500,
        usedCount: 200,
        startTime: '2024-01-01 00:00:00',
        endTime: '2024-06-30 23:59:59',
        status: 1,
        description: '全场商品9折优惠'
      }
    ]
    pagination.total = coupons.value.length
  } catch (error) {
    ElMessage.error('获取优惠券列表失败')
  } finally {
    loading.value = false
  }
}

// 搜索优惠券
const searchCoupons = () => {
  pagination.currentPage = 1
  fetchCoupons()
}

// 重置搜索
const resetSearch = () => {
  searchForm.name = ''
  searchForm.type = ''
  searchForm.status = ''
  searchForm.validTime = []
  pagination.currentPage = 1
  fetchCoupons()
}

// 添加优惠券
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '添加优惠券'
  resetForm()
  dialogVisible.value = true
}

// 编辑优惠券
const handleEdit = (row: CouponItem) => {
  isEdit.value = true
  dialogTitle.value = '编辑优惠券'
  Object.assign(formData, row)
  dialogVisible.value = true
}

// 优惠券类型改变
const handleTypeChange = (value: 'cash' | 'discount') => {
  formData.value = 0
}

// 删除确认
const confirmDelete = (row: CouponItem) => {
  ElMessageBox.confirm('确定要删除该优惠券吗？', '提示', {}
  }).then(() => {
    handleDelete(row)
  })
}

// 删除优惠券
const handleDelete = async (row: CouponItem) => {
  try {
    ElMessage.success('删除成功')
    fetchCoupons()
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

// 批量发放
const handleBatchSend = (row: CouponItem) => {
  batchForm.count = 1
  batchForm.targetType = 'all'
  batchForm.userIds = []
  currentCoupon.value = row
  batchSendVisible.value = true
}

// 确认批量发放
const confirmBatchSend = () => {
  ElMessage.success('批量发放成功')
  batchSendVisible.value = false
}

// 表单提交
const handleSubmit = () => {
  if (!formRef.value) return
  formRef.value.validate((valid: boolean) => {
    if (valid) {
      submitLoading.value = true
      setTimeout(() => {
        submitLoading.value = false
        dialogVisible.value = false
        ElMessage.success(isEdit.value ? '更新成功' : '添加成功')
        fetchCoupons()
      }, 1000)
    }
  })
}

// 重置表单
const resetForm = () => {
  formData.name = ''
  formData.type = 'cash'
  formData.value = 0
  formData.minAmount = 0
  formData.totalCount = 100
  formData.startTime = ''
  formData.endTime = ''
  formData.status = 1
  formData.description = ''
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 分页大小改变
const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  fetchCoupons()
}

// 页码改变
const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  fetchCoupons()
}

// 组件挂载时获取数据
onMounted(() => {
  fetchCoupons()
})
</script>

<style scoped>
.marketing-coupon-container {
  padding: 20px;
}

.coupon-search-form {
  margin-bottom: 20px;
}

.coupon-pagination {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  text-align: center;
}
</style>
