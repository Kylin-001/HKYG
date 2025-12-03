<template>
  <div class="address-container">
    <el-card class="box-card">
      <div slot="header" class="card-header">
        <span>地址管理</span>
        <el-button-group>
          <el-button :icon="Refresh" @click="refreshData">刷新</el-button>
          <el-button type="primary" @click="addAddress">添加地址</el-button>
          <el-button type="primary" :icon="Download" @click="exportAddresses">导出地址</el-button>
        </el-button-group>
      </div>

      <!-- 搜索筛选区域 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="地址ID">
          <el-input
            v-model="searchForm.addressId"
            placeholder="请输入地址ID"
            clearable
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input
            v-model="searchForm.userId"
            placeholder="请输入用户ID"
            clearable
            style="width: 150px"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人">
          <el-input
            v-model="searchForm.contactName"
            placeholder="请输入联系人"
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
        <el-form-item label="是否默认">
          <el-select
            v-model="searchForm.isDefault"
            placeholder="请选择"
            clearable
            style="width: 120px"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="是" value="1"></el-option>
            <el-option label="否" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

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
        <el-table-column prop="userId" label="用户ID" width="100"></el-table-column>
        <el-table-column label="用户信息" width="200">
          <template v-slot="scope">
            <div class="user-info">
              <div class="username" :title="scope.row.username">
                {{ scope.row.username || '未知用户' }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="地址信息" width="300">
          <template v-slot="scope">
            <div class="address-info">
              <div class="contact" :title="scope.row.contactName">
                {{ scope.row.contactName }}
                <el-tag v-if="scope.row.isDefault === '1'" size="small" type="primary">默认</el-tag>
              </div>
              <div class="phone">{{ scope.row.phone }}</div>
              <div class="full-address">
                {{
                  `${scope.row.province} ${scope.row.city} ${scope.row.district} ${scope.row.detail}`
                }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="zipCode" label="邮政编码" width="120"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template v-slot="scope">
            <el-button type="primary" size="small" @click="editAddress(scope.row)">编辑</el-button>
            <el-button type="success" size="small" @click="setDefault(scope.row)">
              {{ scope.row.isDefault === '1' ? '取消默认' : '设为默认' }}
            </el-button>
            <el-button type="danger" size="small" @click="deleteAddress(scope.row)">删除</el-button>
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
          <el-form-item label="联系人" prop="contactName">
            <el-input v-model="editForm.contactName" placeholder="请输入联系人"></el-input>
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
          <el-form-item label="区县" prop="district">
            <el-input v-model="editForm.district" placeholder="请输入区县"></el-input>
          </el-form-item>
          <el-form-item label="详细地址" prop="detail">
            <el-input
              type="textarea"
              v-model="editForm.detail"
              placeholder="请输入详细地址"
              rows="3"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮政编码" prop="zipCode">
            <el-input v-model="editForm.zipCode" placeholder="请输入邮政编码"></el-input>
          </el-form-item>
          <el-form-item label="是否默认">
            <el-switch
              v-model="editForm.isDefault"
              active-color="#13ce66"
              inactive-color="#ff4949"
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
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Download } from '@element-plus/icons-vue'

// 定义类型接口
interface Address {
  id: number
  userId: number
  username?: string
  contactName: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  zipCode?: string
  isDefault: string
  createTime?: string
  updateTime?: string
}

interface EditForm {
  id: string
  userId: string
  contactName: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  zipCode: string
  isDefault: string
  loading?: boolean
}

// 路由和日志
const router = useRouter()
const route = useRoute()

// 加载状态
const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  addressId: '',
  userId: '',
  contactName: '',
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

// 编辑对话框
const editDialogVisible = ref(false)
const isEditMode = ref(false)
const editForm = reactive<EditForm>({
  id: '',
  userId: '',
  contactName: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  zipCode: '',
  isDefault: '0',
})

const editFormRef = ref()

// 表单验证规则
const editRules = reactive({
  userId: [{ required: true, message: '请输入用户ID', trigger: 'blur' }],
  contactName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
  province: [{ required: true, message: '请输入省份', trigger: 'blur' }],
  city: [{ required: true, message: '请输入城市', trigger: 'blur' }],
  district: [{ required: true, message: '请输入区县', trigger: 'blur' }],
  detail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
})

// 页面加载时获取数据
onMounted(() => {
  getAddresses()
})

// 获取地址列表
const getAddresses = async () => {
  try {
    loading.value = true
    // 使用真实API调用
    // const response = await addressApi.getAddresses({
    //   currentPage: currentPage.value,
    //   pageSize: pageSize.value,
    //   ...searchForm
    // })

    // 模拟数据
    const mockData: Address[] = []
    for (let i = 0; i < pageSize.value; i++) {
      const index = (currentPage.value - 1) * pageSize.value + i
      mockData.push({
        id: index + 1,
        userId: Math.floor(Math.random() * 1000) + 1,
        username: `user_${Math.floor(Math.random() * 1000) + 1}`,
        contactName: `联系人${index + 1}`,
        phone: `1380013800${index % 10}`,
        province: `省份${Math.floor(Math.random() * 10) + 1}`,
        city: `城市${Math.floor(Math.random() * 10) + 1}`,
        district: `区县${Math.floor(Math.random() * 10) + 1}`,
        detail: `详细地址${index + 1} 街道 ${Math.floor(Math.random() * 100)} 号`,
        zipCode: `${Math.floor(Math.random() * 900000) + 100000}`,
        isDefault: Math.random() > 0.7 ? '1' : '0',
        createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updateTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }

    addressList.value = mockData
    total.value = 100
  } catch (error) {
    logger.error('获取地址列表失败', error)
    ElMessage.error('获取地址列表失败')
    addressList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 搜索地址
const search = () => {
  currentPage.value = 1
  getAddresses()
}

// 重置搜索
const resetSearch = () => {
  searchForm.addressId = ''
  searchForm.userId = ''
  searchForm.contactName = ''
  searchForm.phone = ''
  searchForm.isDefault = ''
  currentPage.value = 1
  getAddresses()
}

// 刷新数据
const refreshData = () => {
  getAddresses()
}

// 导出地址
const exportAddresses = () => {
  ElMessage.success('导出功能开发中')
}

// 处理选择变化
const handleSelectionChange = (selection: Address[]) => {
  selectedAddressIds.value = selection.map(item => item.id)
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
  editForm.userId = String(row.userId)
  editForm.contactName = row.contactName
  editForm.phone = row.phone
  editForm.province = row.province
  editForm.city = row.city
  editForm.district = row.district
  editForm.detail = row.detail
  editForm.zipCode = row.zipCode || ''
  editForm.isDefault = row.isDefault
  editDialogVisible.value = true
}

// 添加地址
const addAddress = () => {
  isEditMode.value = false
  editForm.id = ''
  editForm.userId = ''
  editForm.contactName = ''
  editForm.phone = ''
  editForm.province = ''
  editForm.city = ''
  editForm.district = ''
  editForm.detail = ''
  editForm.zipCode = ''
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
    // 使用真实API调用
    // const response = await addressApi.saveAddress(editForm)
    editForm.loading = true
    await new Promise(resolve => setTimeout(resolve, 1000))
    ElMessage.success('保存成功')
    editDialogVisible.value = false
    getAddresses()
  } catch (error) {
    logger.error('保存地址失败', error)
    ElMessage.error('保存地址失败')
  } finally {
    editForm.loading = false
  }
}

// 设置默认地址
const setDefault = (row: Address) => {
  ElMessage.success('设置默认地址功能开发中')
}

// 删除地址
const deleteAddress = (row: Address) => {
  ElMessage.success('删除地址功能开发中')
}
</script>

<style scoped>
.address-container {
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

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: bold;
}

.address-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.contact {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.full-address {
  font-size: 13px;
  color: #606266;
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
