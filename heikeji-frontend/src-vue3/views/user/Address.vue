<template>
  <div class="address-list-container">
    <el-card class="box-card">
      <div slot="header" class="card-header">
        <span>用户地址管理</span>
        <el-button-group>
          <el-button :icon="Refresh" @click="refreshData">刷新</el-button>
          <el-button type="primary" @click="addAddress">添加地址</el-button>
          <el-button type="primary" :icon="Download" @click="exportAddresses">导出地址</el-button>
        </el-button-group>
      </div>

      <!-- 搜索筛选区域 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户ID">
          <el-input
            v-model="searchForm.userId"
            placeholder="请输入用户ID"
            clearable
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.userName"
            placeholder="请输入用户名"
            clearable
            style="width: 180px"
          ></el-input>
        </el-form-item>
        <el-form-item label="收货人">
          <el-input
            v-model="searchForm.consignee"
            placeholder="请输入收货人"
            clearable
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input
            v-model="searchForm.phone"
            placeholder="请输入手机号"
            clearable
            style="width: 180px"
          ></el-input>
        </el-form-item>
        <el-form-item label="默认地址">
          <el-select
            v-model="searchForm.isDefault"
            placeholder="请选择"
            clearable
            style="width: 120px"
          >
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 地址统计概览 -->
      <div class="address-stats">
        <div class="stat-item">
          <div class="stat-label">总地址数</div>
          <div class="stat-value">{{ totalAddressCount }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">今日新增</div>
          <div class="stat-value primary">{{ todayNewCount }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">默认地址数</div>
          <div class="stat-value success">{{ defaultAddressCount }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">活跃用户数</div>
          <div class="stat-value danger">{{ activeUserCount }}</div>
        </div>
      </div>

      <!-- 地址列表 -->
      <el-table
        v-loading="loading"
        :data="addressList"
        style="width: 100%"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="id" label="地址ID" width="100"></el-table-column>
        <el-table-column label="用户信息" width="200">
          <template v-slot="scope">
            <div class="user-info">
              <div class="user-details">
                <div class="user-id">用户ID: {{ scope.row.userId }}</div>
                <div class="username">{{ scope.row.userName }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="consignee" label="收货人" width="120"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="150"></el-table-column>
        <el-table-column prop="province" label="省份" width="120"></el-table-column>
        <el-table-column prop="city" label="城市" width="120"></el-table-column>
        <el-table-column prop="district" label="区/县" width="120"></el-table-column>
        <el-table-column prop="detailAddress" label="详细地址" min-width="200"></el-table-column>
        <el-table-column prop="isDefault" label="默认地址" width="100">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.isDefault"
              @change="handleDefaultChange(scope.row)"
              active-color="#13ce66"
              inactive-color="#c0c4cc"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template v-slot="scope">
            <el-button type="primary" size="small" @click="editAddress(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="deleteAddress(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination
          background
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>

      <!-- 编辑地址对话框 -->
      <el-dialog
        :title="isEditMode ? '编辑地址' : '添加地址'"
        v-model:visible="editDialogVisible"
        width="600px"
      >
        <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="120px">
          <el-form-item label="用户ID" prop="userId">
            <el-input v-model="editForm.userId" placeholder="请输入用户ID"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="editForm.userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="收货人" prop="consignee">
            <el-input v-model="editForm.consignee" placeholder="请输入收货人"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="editForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="省份" prop="province">
            <el-input v-model="editForm.province" placeholder="请输入省份"></el-input>
          </el-form-item>
          <el-form-item label="城市" prop="city">
            <el-input v-model="editForm.city" placeholder="请输入城市"></el-input>
          </el-form-item>
          <el-form-item label="区/县" prop="district">
            <el-input v-model="editForm.district" placeholder="请输入区/县"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="detailAddress">
            <el-input
              type="textarea"
              v-model="editForm.detailAddress"
              placeholder="请输入详细地址"
              rows="3"
            ></el-input>
          </el-form-item>
          <el-form-item label="默认地址" prop="isDefault">
            <el-switch
              v-model="editForm.isDefault"
              active-color="#13ce66"
              inactive-color="#c0c4cc"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEdit">取消</el-button>
          <el-button type="primary" @click="submitEdit" :loading="editForm.loading">提交</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入日志工具
import logger from '@/utils/logger'
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Download } from '@element-plus/icons-vue'

// 导入类型定义
import { Address, AddressEditForm as EditForm } from '@/types/user'

// 导入API
import { userApi } from '@/api/user'

// 加载状态
const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  userId: '',
  userName: '',
  consignee: '',
  phone: '',
  isDefault: '',
})

// 分页信息
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const addressList = ref<Address[]>([])

// 选中的地址ID
const selectedAddressIds = ref<number[]>([])
const selectedRows = ref<Address[]>([])

// 地址统计
const totalAddressCount = ref(0)
const todayNewCount = ref(0)
const defaultAddressCount = ref(0)
const activeUserCount = ref(0)

// 编辑对话框
const editDialogVisible = ref(false)
const isEditMode = ref(false)
const editForm = reactive<EditForm>({
  id: '',
  userId: '',
  userName: '',
  consignee: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detailAddress: '',
  isDefault: '0',
})

const editFormRef = ref()

// 表单验证规则
const editRules = reactive({
  userId: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
  userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  consignee: [{ required: true, message: '请输入收货人', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  province: [{ required: true, message: '请输入省份', trigger: 'blur' }],
  city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
  district: [{ required: true, message: '请输入区/县', trigger: 'blur' }],
  detailAddress: [
    { required: true, message: '请输入详细地址', trigger: 'blur' },
    { min: 5, max: 200, message: '详细地址长度在 5 到 200 个字符', trigger: 'blur' },
  ],
})

// 页面加载时获取数据
onMounted(() => {
  getAddresses()
  fetchAddressStats()
})

// 获取地址列表
const getAddresses = async () => {
  try {
    loading.value = true
    const params = {
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm,
    }

    const response = await userApi.getAddressList(params)
    addressList.value = response.data.records
    total.value = response.data.total

    logger.info('获取地址列表成功', { count: addressList.value.length })
  } catch (error) {
    logger.error('获取地址列表失败', error)
    ElMessage.error('获取地址列表失败')
    addressList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 获取地址统计数据
const fetchAddressStats = async () => {
  try {
    // 使用真实API调用统计数据
    // const response = await addressApi.getAddressStatistics()
    // const { totalAddressCount, todayNewCount, defaultAddressCount, activeUserCount } = response.data

    // 模拟数据
    totalAddressCount.value = 1568
    todayNewCount.value = 24
    defaultAddressCount.value = 345
    activeUserCount.value = 1234
  } catch (error) {
    logger.error('获取地址统计数据失败', error)
    ElMessage.error('获取地址统计数据失败')
  }
}

// 搜索地址
const search = () => {
  currentPage.value = 1
  getAddresses()
}

// 重置搜索
const resetSearch = () => {
  searchForm.userId = ''
  searchForm.userName = ''
  searchForm.consignee = ''
  searchForm.phone = ''
  searchForm.isDefault = ''
  currentPage.value = 1
  getAddresses()
}

// 刷新数据
const refreshData = () => {
  getAddresses()
  fetchAddressStats()
}

// 导出地址
const exportAddresses = async () => {
  try {
    const params = {
      currentPage: 1,
      pageSize: 0, // 导出所有数据
      ...searchForm,
    }

    const blob = await userApi.exportAddressList(params)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `地址列表_${new Date().toISOString().slice(0, 10)}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    ElMessage.success('导出成功')
    logger.info('导出地址列表成功')
  } catch (error) {
    logger.error('导出地址列表失败', error)
    ElMessage.error('导出失败')
  }
}

// 处理选择变化
const handleSelectionChange = (selection: Address[]) => {
  selectedAddressIds.value = selection.map(item => item.id)
  selectedRows.value = selection
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getAddresses()
}

// 处理每页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  getAddresses()
}

// 编辑地址
const editAddress = (row: Address) => {
  isEditMode.value = true
  editForm.id = String(row.id)
  editForm.userId = row.userId
  editForm.userName = row.userName
  editForm.consignee = row.consignee
  editForm.phone = row.phone
  editForm.province = row.province
  editForm.city = row.city
  editForm.district = row.district
  editForm.detailAddress = row.detailAddress
  editForm.isDefault = row.isDefault
  editDialogVisible.value = true
}

// 添加地址
const addAddress = () => {
  isEditMode.value = false
  editForm.id = ''
  editForm.userId = ''
  editForm.userName = ''
  editForm.consignee = ''
  editForm.phone = ''
  editForm.province = ''
  editForm.city = ''
  editForm.district = ''
  editForm.detailAddress = ''
  editForm.isDefault = '0'
  editDialogVisible.value = true
}

// 取消编辑
const cancelEdit = () => {
  editDialogVisible.value = false
}

// 提交编辑
const submitEdit = async () => {
  try {
    editForm.loading = true
    if (isEditMode.value) {
      // 更新地址
      await userApi.updateAddress(editForm)
      ElMessage.success('地址更新成功')
      logger.info('更新地址成功', { addressId: editForm.id })
    } else {
      // 创建地址
      await userApi.createAddress(editForm)
      ElMessage.success('地址创建成功')
      logger.info('创建地址成功', { addressId: editForm.id })
    }
    editDialogVisible.value = false
    getAddresses()
  } catch (error) {
    logger.error('保存地址失败', error)
    ElMessage.error('保存地址失败')
  } finally {
    editForm.loading = false
  }
}

// 处理默认地址变化
const handleDefaultChange = (row: Address) => {
  ElMessage.success('默认地址更新功能开发中')
}

// 删除地址
const deleteAddress = (row: Address) => {
  ElMessageBox.confirm(
    `确定要删除地址「${row.province}${row.city}${row.district}${row.detailAddress}」吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await userApi.deleteAddress(row.id.toString())
        ElMessage.success('删除成功')
        getAddresses()
        logger.info('删除地址成功', { addressId: row.id })
      } catch (error) {
        logger.error('删除地址失败', error)
        ElMessage.error('删除地址失败')
      }
    })
    .catch(() => {
      // 取消删除
    })
}
</script>

<style scoped>
.address-list-container {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.address-stats {
  display: flex;
  margin-bottom: 20px;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  background-color: #f5f7fa;
  border-radius: 8px;
  flex: 1;
}

.stat-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stat-value.primary {
  color: #409eff;
}

.stat-value.success {
  color: #67c23a;
}

.stat-value.danger {
  color: #f56c6c;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-details {
  margin-left: 10px;
}

.user-id {
  font-size: 12px;
  color: #909399;
  margin-bottom: 2px;
}

.username {
  font-weight: bold;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.dialog-footer {
  text-align: center;
}
</style>
