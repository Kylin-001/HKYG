<script setup lang="ts">
/**
 * 用户管理页面
 * 功能：用户列表、查看详情、禁用/启用用户
 */
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UserInfo } from '@/api/user'

// ====== 响应式状态 ======
const loading = ref(false)
const dialogVisible = ref(false)
const currentUser = ref<UserInfo | null>(null)

// ====== 搜索表单 ======
const searchForm = reactive({
  keyword: '',
  role: '',
  status: '',
})

// ====== 分页 ======
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

// ====== 表格数据 ======
const tableData = ref<UserInfo[]>([])

// ====== 角色选项 ======
const roleOptions = [
  { value: 'student', label: '学生' },
  { value: 'merchant', label: '商家' },
  { value: 'admin', label: '管理员' },
]

// ====== 状态选项 ======
const statusOptions = [
  { value: 'active', label: '正常', type: 'success' },
  { value: 'inactive', label: '未激活', type: 'info' },
  { value: 'banned', label: '禁用', type: 'danger' },
]

// ====== 生命周期 ======
onMounted(() => {
  fetchUserList()
})

// ====== 方法 ======

/**
 * 获取用户列表
 */
async function fetchUserList() {
  loading.value = true
  try {
    // 模拟数据
    tableData.value = [
      {
        id: '1',
        username: '张三',
        email: 'zhangsan@usth.edu.cn',
        phone: '13800138001',
        studentId: '2021001',
        realName: '张三',
        role: 'student',
        status: 'active',
        createdAt: '2024-01-01',
      },
      {
        id: '2',
        username: '李四',
        email: 'lisi@usth.edu.cn',
        phone: '13800138002',
        studentId: '2021002',
        realName: '李四',
        role: 'student',
        status: 'active',
        createdAt: '2024-01-02',
      },
    ]
    pagination.total = 2
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索
 */
function handleSearch() {
  pagination.page = 1
  fetchUserList()
}

/**
 * 重置搜索
 */
function resetSearch() {
  searchForm.keyword = ''
  searchForm.role = ''
  searchForm.status = ''
  handleSearch()
}

/**
 * 查看用户详情
 */
function viewUserDetail(row: UserInfo) {
  currentUser.value = row
  dialogVisible.value = true
}

/**
 * 切换用户状态
 */
async function toggleUserStatus(row: UserInfo) {
  const newStatus = row.status === 'active' ? 'banned' : 'active'
  const actionText = newStatus === 'active' ? '启用' : '禁用'
  
  try {
    await ElMessageBox.confirm(
      `确定要${actionText}用户 "${row.username}" 吗？`,
      `确认${actionText}`,
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    ElMessage.success(`${actionText}成功`)
    fetchUserList()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error(`${actionText}失败`)
    }
  }
}

/**
 * 分页变化
 */
function handlePageChange(page: number) {
  pagination.page = page
  fetchUserList()
}

/**
 * 每页数量变化
 */
function handleSizeChange(size: number) {
  pagination.pageSize = size
  pagination.page = 1
  fetchUserList()
}

/**
 * 获取角色标签
 */
function getRoleLabel(role: string): string {
  const map: Record<string, string> = {
    student: '学生',
    merchant: '商家',
    admin: '管理员',
  }
  return map[role] || role
}

/**
 * 获取状态标签类型
 */
function getStatusType(status: string): string {
  const map: Record<string, string> = {
    active: 'success',
    inactive: 'info',
    banned: 'danger',
  }
  return map[status] || 'info'
}

/**
 * 获取状态文本
 */
function getStatusText(status: string): string {
  const map: Record<string, string> = {
    active: '正常',
    inactive: '未激活',
    banned: '禁用',
  }
  return map[status] || status
}
</script>

<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold text-text-primary">用户管理</h2>
    </div>

    <!-- 搜索区域 -->
    <el-card shadow="never" class="search-card">
      <el-form :model="searchForm" inline class="search-form">
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="用户名/邮箱/学号"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="全部角色" clearable>
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="全部状态" clearable>
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 数据表格 -->
    <el-card shadow="never">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        style="width: 100%"
      >
        <el-table-column type="index" width="50" align="center" />
        
        <el-table-column label="用户信息" min-width="200">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary font-bold">
                {{ row.username.charAt(0) }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium text-text-primary">{{ row.username }}</div>
                <div class="text-xs text-text-tertiary">ID: {{ row.id }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="学号" width="120">
          <template #default="{ row }">
            {{ row.studentId || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column label="邮箱" min-width="180">
          <template #default="{ row }">
            {{ row.email }}
          </template>
        </el-table-column>
        
        <el-table-column label="手机号" width="130">
          <template #default="{ row }">
            {{ row.phone || '-' }}
          </template>
        </el-table-column>
        
        <el-table-column label="角色" width="100" align="center">
          <template #default="{ row }">
            <el-tag size="small">
              {{ getRoleLabel(row.role) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)" size="small">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="注册时间" width="160">
          <template #default="{ row }">
            {{ row.createdAt }}
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" @click="viewUserDetail(row)">
              详情
            </el-button>
            <el-button 
              link 
              :type="row.status === 'active' ? 'danger' : 'success'"
              @click="toggleUserStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="flex justify-end mt-4">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>

    <!-- 用户详情对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="用户详情"
      width="500px"
    >
      <div v-if="currentUser" class="space-y-4">
        <div class="flex items-center gap-4">
          <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary text-2xl font-bold">
            {{ currentUser.username.charAt(0) }}
          </div>
          <div>
            <div class="text-lg font-bold">{{ currentUser.username }}</div>
            <div class="text-sm text-text-tertiary">{{ currentUser.email }}</div>
          </div>
        </div>
        
        <el-descriptions :column="1" border>
          <el-descriptions-item label="用户ID">{{ currentUser.id }}</el-descriptions-item>
          <el-descriptions-item label="学号">{{ currentUser.studentId || '-' }}</el-descriptions-item>
          <el-descriptions-item label="真实姓名">{{ currentUser.realName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ currentUser.phone || '-' }}</el-descriptions-item>
          <el-descriptions-item label="角色">
            <el-tag size="small">{{ getRoleLabel(currentUser.role) }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="状态">
            <el-tag :type="getStatusType(currentUser.status)" size="small">
              {{ getStatusText(currentUser.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="注册时间">{{ currentUser.createdAt }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.search-card {
  :deep(.el-card__body) {
    padding: 20px;
  }
}

.search-form {
  .el-form-item {
    margin-bottom: 0;
    margin-right: 20px;
  }
}
</style>
