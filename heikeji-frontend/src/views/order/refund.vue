<template>
  <div class="order-refund-container">
    <el-card class="box-card">
      <template v-slot:header>
        <div class="clearfix">
          <span>退款管理</span>
        </div>
      </template>
      <el-form :inline="true" :model="searchForm" class="refund-search-form">
        <el-form-item label="订单编号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单编号"></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input v-model="searchForm.userId" placeholder="请输入用户ID"></el-input>
        </el-form-item>
        <el-form-item label="退款类型">
          <el-select v-model="searchForm.type" placeholder="请选择退款类型">
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="退款"></el-option>
            <el-option value="2" label="退货退款"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退款状态">
          <el-select v-model="searchForm.status" placeholder="请选择退款状态">
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="待处理"></el-option>
            <el-option value="2" label="退款中"></el-option>
            <el-option value="3" label="已退款"></el-option>
            <el-option value="4" label="已拒绝"></el-option>
            <el-option value="5" label="已取消"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="申请时间">
          <el-date-picker
            v-model="searchForm.applyTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchRefunds">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="refundList" style="width: 100%" border>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="refundNo" label="退款单号" width="180">
          <template v-slot:default="scope">{{ scope.row.refundNo }}</template>
        </el-table-column>
        <el-table-column prop="orderNo" label="订单编号" width="180">
          <template v-slot:default="scope">
            <a @click="viewOrder(scope.row.orderNo)" style="cursor: pointer; color: #409eff">{{
              scope.row.orderNo
            }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="userId" label="用户ID" width="100"></el-table-column>
        <el-table-column prop="userName" label="用户姓名" width="120"></el-table-column>
        <el-table-column prop="type" label="退款类型" width="100">
          <template v-slot:default="scope">
            <el-tag v-if="scope.row.type === 1" type="info">退款</el-tag>
            <el-tag v-else type="success">退货退款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="refundAmount" label="退款金额" width="120" align="right">
          <template v-slot:default="scope">¥{{ scope.row.refundAmount.toFixed(2) }}</template>
        </el-table-column>
        <el-table-column prop="status" label="退款状态" width="100">
          <template v-slot:default="scope">
            <el-tag :type="getStatusType(scope.row.status)">{{
              getStatusText(scope.row.status)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime" label="申请时间" width="180"></el-table-column>
        <el-table-column prop="processTime" label="处理时间" width="180">
          <template v-slot:default="scope">{{ scope.row.processTime || '--' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template v-slot:default="scope">
            <el-button size="mini" @click="viewRefundDetail(scope.row.id)">详情</el-button>
            <el-button
              v-if="scope.row.status === 1"
              size="mini"
              type="primary"
              @click="handleAgreeRefund(scope.row.id)"
              >同意退款</el-button
            >
            <el-button
              v-if="scope.row.status === 1"
              size="mini"
              type="danger"
              @click="handleRejectRefund(scope.row.id)"
              >拒绝退款</el-button
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
        class="refund-pagination"
      ></el-pagination>
    </el-card>

    <!-- 退款详情对话框 -->
    <el-dialog title="退款详情" v-model="detailDialogVisible" width="800px" top="10%">
      <div v-if="refundDetail" class="refund-detail-content">
        <!-- 基本信息 -->
        <el-descriptions :column="3" border class="mb-20">
          <el-descriptions-item label="退款单号">{{ refundDetail.refundNo }}</el-descriptions-item>
          <el-descriptions-item label="订单编号">
            <a @click="viewOrder(refundDetail.orderNo)" style="cursor: pointer; color: #409eff">{{
              refundDetail.orderNo
            }}</a>
          </el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ refundDetail.userId }}</el-descriptions-item>
          <el-descriptions-item label="用户姓名">{{ refundDetail.userName }}</el-descriptions-item>
          <el-descriptions-item label="退款类型">
            <el-tag v-if="refundDetail.type === 1" type="info">退款</el-tag>
            <el-tag v-else type="success">退货退款</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="退款状态">
            <el-tag :type="getStatusType(refundDetail.status)">{{
              getStatusText(refundDetail.status)
            }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="退款金额"
            >¥{{ refundDetail.refundAmount.toFixed(2) }}</el-descriptions-item
          >
          <el-descriptions-item label="申请时间">{{ refundDetail.applyTime }}</el-descriptions-item>
          <el-descriptions-item label="处理时间">{{
            refundDetail.processTime || '--'
          }}</el-descriptions-item>
        </el-descriptions>

        <!-- 退款商品信息 -->
        <el-card class="mb-20" shadow="hover">
          <template v-slot:header>
            <div class="card-header">
              <span class="card-title">退款商品信息</span>
            </div>
          </template>
          <el-table :data="refundDetail.refundItems" style="width: 100%" border>
            <el-table-column prop="productImage" label="商品图片" width="100">
              <template v-slot:default="scope">
                <el-image
                  :src="scope.row.productImage"
                  fit="cover"
                  style="width: 80px; height: 80px"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="productName" label="商品名称" min-width="200">
              <template v-slot:default="scope">
                {{ scope.row.productName }}
                <div v-if="scope.row.skuAttributes" class="sku-attributes">
                  {{ scope.row.skuAttributes }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="price" label="单价" width="120" align="right">
              <template v-slot:default="scope">¥{{ scope.row.price.toFixed(2) }}</template>
            </el-table-column>
            <el-table-column prop="quantity" label="数量" width="80" align="center">
              <template v-slot:default="scope">{{ scope.row.quantity }}</template>
            </el-table-column>
            <el-table-column prop="refundAmount" label="退款金额" width="120" align="right">
              <template v-slot:default="scope">¥{{ scope.row.refundAmount.toFixed(2) }}</template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 退款原因和凭证 -->
        <el-card class="mb-20" shadow="hover">
          <template v-slot:header>
            <div class="card-header">
              <span class="card-title">退款说明</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="退款原因">{{
              refundDetail.refundReason
            }}</el-descriptions-item>
            <el-descriptions-item label="退款说明">{{
              refundDetail.refundExplain
            }}</el-descriptions-item>
            <el-descriptions-item
              label="退款凭证"
              v-if="refundDetail.images && refundDetail.images.length > 0"
            >
              <el-upload-list
                list-type="picture"
                :file-list="getImageList(refundDetail.images)"
                :on-preview="handleImagePreview"
                :on-remove="() => false"
              ></el-upload-list>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 退款处理信息 -->
        <el-card v-if="refundDetail.status > 1" shadow="hover">
          <template v-slot:header>
            <div class="card-header">
              <span class="card-title">处理信息</span>
            </div>
          </template>
          <el-descriptions :column="1" border>
            <el-descriptions-item label="处理人">{{
              refundDetail.handler || '--'
            }}</el-descriptions-item>
            <el-descriptions-item label="处理时间">{{
              refundDetail.processTime || '--'
            }}</el-descriptions-item>
            <el-descriptions-item label="处理结果">{{
              refundDetail.status === 3
                ? '同意退款'
                : refundDetail.status === 4
                  ? '拒绝退款'
                  : '取消退款'
            }}</el-descriptions-item>
            <el-descriptions-item label="处理说明">{{
              refundDetail.processRemark || '--'
            }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 退款操作按钮 -->
        <div v-if="refundDetail.status === 1" class="detail-actions">
          <el-button type="primary" @click="handleAgreeRefund(refundDetail.id)">同意退款</el-button>
          <el-button type="danger" @click="handleRejectRefund(refundDetail.id)">拒绝退款</el-button>
        </div>
      </div>

      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 退款处理对话框 -->
    <el-dialog :title="processDialogTitle" v-model="processDialogVisible" width="500px">
      <el-form
        :model="processForm"
        :rules="processFormRules"
        ref="processFormRef"
        label-width="100px"
      >
        <el-form-item label="处理说明" prop="remark">
          <el-input
            v-model="processForm.remark"
            type="textarea"
            rows="3"
            placeholder="请输入处理说明"
            maxlength="200"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>

      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button @click="processDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmProcess">确定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="previewDialogVisible" :show-close="false" class="image-preview-dialog">
      <img :src="previewImageSrc" class="preview-image" alt="预览图片" />
      <span class="el-dialog__close" @click="previewDialogVisible = false">×</span>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入必要的API和类型
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { FormInstance, FormRules } from 'element-plus'

// 导入日志工具
import logger from '@/utils/logger'

// 类型定义
interface RefundItem {
  id: string
  refundNo: string
  orderNo: string
  userId: string
  userName: string
  type: number
  refundAmount: number
  status: number
  statusText: string
  applyTime: string
  processTime: string
  refundReason: string
  refundExplain: string
  images: string[]
  handler: string
  processRemark: string
  refundItems: RefundProductItem[]
}

interface RefundProductItem {
  productImage: string
  productName: string
  skuAttributes: string
  price: number
  quantity: number
  refundAmount: number
}

interface SearchForm {
  orderNo: string
  userId: string
  type: string
  status: string
  applyTime: [string | null, string | null]
}

interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

interface ProcessForm {
  remark: string
}

interface ImageFile {
  uid: number
  name: string
  status: string
  url: string
}

// 响应式数据
const loading = ref(false)
const detailLoading = ref(false)
const processLoading = ref(false)

const searchForm = reactive<SearchForm>({
  orderNo: '',
  userId: '',
  type: '',
  status: '',
  applyTime: [null, null],
})

const refundList = ref<RefundItem[]>([])

const pagination = reactive<Pagination>({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

const detailDialogVisible = ref(false)
const refundDetail = ref<RefundItem | null>(null)

const processDialogVisible = ref(false)
const processDialogTitle = ref('')
const processForm = reactive<ProcessForm>({ remark: '' })
const processFormRules = reactive<FormRules>({
  remark: [
    { required: true, message: '请输入处理说明', trigger: 'blur' },
    { max: 200, message: '说明长度不能超过200个字符', trigger: 'blur' },
  ],
})
const processType = ref(0)
const currentRefundId = ref('')

const previewDialogVisible = ref(false)
const previewImageSrc = ref('')

// 表单引用
const processFormRef = ref<FormInstance | null>(null)

// 路由和状态管理
const router = useRouter()
const store = useStore()

// 生命周期钩子
onMounted(() => {
  fetchRefundList()
})

// 获取退款列表
async function fetchRefundList() {
  loading.value = true
  try {
    const params = {
      page: pagination.currentPage,
      pageSize: pagination.pageSize,
      ...searchForm,
    }
    // 处理时间范围参数
    if (searchForm.applyTime && searchForm.applyTime.length === 2) {
      params.startDate = searchForm.applyTime[0]
      params.endDate = searchForm.applyTime[1]
    }
    // 删除空值参数
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })

    const response = await store.dispatch('marketing/getRefunds', params)
    if (response && response.success) {
      refundList.value = response.data.list || []
      pagination.total = response.data.total || 0
    }
  } catch (error) {
    logger.error('获取退款列表失败:', error)
    ElMessage.error(`获取退款列表失败：${(error as any).message}` || '未知错误')
  } finally {
    loading.value = false
  }
}

// 搜索退款
async function searchRefunds() {
  pagination.currentPage = 1
  await fetchRefundList()
}

// 重置搜索
function resetSearch() {
  searchForm.orderNo = ''
  searchForm.userId = ''
  searchForm.type = ''
  searchForm.status = ''
  searchForm.applyTime = [null, null]
  pagination.currentPage = 1
  fetchRefundList()
}

// 查看订单
function viewOrder(orderNo: string) {
  router.push({ path: '/order/detail', query: { id: orderNo } })
}

// 查看退款详情
async function viewRefundDetail(id: string) {
  detailDialogVisible.value = true
  detailLoading.value = true
  try {
    const response = await store.dispatch('marketing/getRefundDetail', { id })
    if (response && response.success) {
      refundDetail.value = response.data
    }
  } catch (error) {
    logger.error('获取退款详情失败:', error)
    ElMessage.error(`获取退款详情失败：${(error as any).message}` || '未知错误')
    detailDialogVisible.value = false
  } finally {
    detailLoading.value = false
  }
}

// 同意退款
function handleAgreeRefund(id: string) {
  processDialogTitle.value = '同意退款'
  processType.value = 1
  currentRefundId.value = id
  processForm.remark = ''
  processDialogVisible.value = true
}

// 拒绝退款
function handleRejectRefund(id: string) {
  processDialogTitle.value = '拒绝退款'
  processType.value = 2
  currentRefundId.value = id
  processForm.remark = ''
  processDialogVisible.value = true
}

// 确认处理
async function confirmProcess() {
  if (!processFormRef.value) return

  processFormRef.value.validate(async valid => {
    if (valid) {
      processLoading.value = true
      try {
        const params = {
          id: currentRefundId.value,
          type: processType.value,
          remark: processForm.remark,
        }
        const response = await store.dispatch('marketing/processRefund', params)
        if (response && response.success) {
          ElMessage.success(processType.value === 1 ? '退款处理成功' : '已拒绝退款')
          processDialogVisible.value = false
          // 更新列表数据
          await fetchRefundList()
          // 如果详情对话框打开着，刷新详情
          if (
            detailDialogVisible.value &&
            refundDetail.value &&
            refundDetail.value.id === currentRefundId.value
          ) {
            await viewRefundDetail(currentRefundId.value)
          }
        }
      } catch (error) {
        logger.error('退款处理失败:', error)
        ElMessage.error(`退款处理失败：${(error as any).message}` || '未知错误')
      } finally {
        processLoading.value = false
      }
    }
  })
}

// 获取状态文本
function getStatusText(status: number): string {
  const statusMap: Record<number, string> = {
    1: '待处理',
    2: '退款中',
    3: '已退款',
    4: '已拒绝',
    5: '已取消',
  }
  return statusMap[status] || '未知状态'
}

// 获取状态标签类型
function getStatusType(status: number): string {
  const typeMap: Record<number, string> = {
    1: 'warning',
    2: 'primary',
    3: 'success',
    4: 'danger',
    5: 'info',
  }
  return typeMap[status] || 'info'
}

// 格式化日期时间
function formatDateTime(date: string): string {
  if (!date) return '--'
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hour = String(d.getHours()).padStart(2, '0')
  const minute = String(d.getMinutes()).padStart(2, '0')
  const second = String(d.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`
}

// 获取图片列表
function getImageList(images: string[]): ImageFile[] {
  if (!images || !Array.isArray(images)) return []
  return images.map((url, index) => ({
    uid: index,
    name: `图片${index + 1}`,
    status: 'success',
    url,
  }))
}

// 处理图片预览
function handleImagePreview(file: ImageFile) {
  previewImageSrc.value = file.url
  previewDialogVisible.value = true
}

// 处理分页
function handleSizeChange(val: number) {
  pagination.pageSize = val
  fetchRefundList()
}

function handleCurrentChange(val: number) {
  pagination.currentPage = val
  fetchRefundList()
}
</script>

<style scoped>
.order-refund-container {
  padding: 20px;
}

.refund-search-form {
  margin-bottom: 20px;
}

.refund-pagination {
  margin-top: 20px;
  text-align: right;
}

.refund-detail-content {
  max-height: 600px;
  overflow-y: auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  font-weight: bold;
}

.mb-20 {
  margin-bottom: 20px;
}

.detail-actions {
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid #ebeef5;
  margin-top: 20px;
}

.detail-actions .el-button {
  margin: 0 10px;
}

.image-preview-dialog {
  text-align: center;
}

.preview-image {
  max-width: 100%;
  max-height: 80vh;
}

.sku-attributes {
  font-size: 12px;
  color: #909399;
  margin-top: 4px;
}
</style>
