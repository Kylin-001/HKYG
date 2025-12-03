<template>
  <div class="user-list-container">
    <el-card class="box-card">
      <div slot="header" class="card-header">
        <span>用户管理</span>
        <el-button-group>
          <el-button :icon="Refresh" @click="refreshData">刷新</el-button>
          <el-button type="primary" @click="addUser">添加用户</el-button>
          <el-button type="primary" :icon="Download" @click="exportUsers">导出用户</el-button>
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
        <el-form-item label="手机号">
          <el-input
            v-model="searchForm.phone"
            placeholder="请输入手机号"
            clearable
            style="width: 180px"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="请选择状态"
            clearable
            style="width: 120px"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注册时间">
          <el-date-picker
            v-model="searchForm.registerTimeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            clearable
            value-format="yyyy-MM-dd HH:mm:ss"
            style="width: 300px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 用户统计概览 -->
      <div class="user-stats">
        <div class="stat-item">
          <div class="stat-label">总用户数</div>
          <div class="stat-value">{{ totalUserCount }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">今日新增</div>
          <div class="stat-value primary">{{ todayNewCount }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">活跃用户</div>
          <div class="stat-value success">{{ activeUserCount }}</div>
        </div>
        <div class="stat-item">
          <div class="stat-label">禁用用户</div>
          <div class="stat-value danger">{{ disabledUserCount }}</div>
        </div>
      </div>

      <!-- 批量操作区域 -->
      <div class="batch-actions" v-if="selectedUserIds.length > 0">
        <span class="selected-count">已选择 {{ selectedUserIds.length }} 个用户</span>
        <el-button-group>
          <el-button type="primary" size="small" @click="batchEnable">批量启用</el-button>
          <el-button type="danger" size="small" @click="batchDisable">批量禁用</el-button>
          <el-button type="warning" size="small" @click="batchDelete">批量删除</el-button>
        </el-button-group>
      </div>

      <!-- 用户列表 -->
      <el-table
        v-loading="loading"
        :data="userList"
        style="width: 100%"
        stripe
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="id" label="用户ID" width="100"></el-table-column>
        <el-table-column label="用户信息" width="200">
          <template v-slot="scope">
            <div class="user-info">
              <el-image
                :src="scope.row.avatar || 'https://via.placeholder.com/40'"
                style="width: 40px; height: 40px; border-radius: 50%"
                fit="cover"
              ></el-image>
              <div class="user-details">
                <div class="username" :title="scope.row.username">{{ scope.row.username }}</div>
                <div class="nickname" v-if="scope.row.nickname">{{ scope.row.nickname }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" width="150"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="sex" label="性别" width="80">
          <template v-slot="scope">
            {{ scope.row.sex === 1 ? '男' : scope.row.sex === 2 ? '女' : '未知' }}
          </template>
        </el-table-column>
        <el-table-column prop="level" label="用户等级" width="100">
          <template v-slot="scope">
            <el-tag size="small" :type="getLevelTagType(scope.row.level)">
              {{ getLevelText(scope.row.level) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="totalSpent" label="累计消费" width="120" align="right">
          <template v-slot="scope"> ¥{{ (scope.row.totalSpent || 0).toFixed(2) }} </template>
        </el-table-column>
        <el-table-column
          prop="orderCount"
          label="订单数"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.status"
              @change="handleStatusChange(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间" width="180"></el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录" width="180"></el-table-column>
        <el-table-column label="操作" width="280" fixed="right">
          <template v-slot="scope">
            <el-button type="primary" size="small" @click="viewUser(scope.row)">查看详情</el-button>
            <el-button type="success" size="small" @click="editUserDialog(scope.row)"
              >编辑</el-button
            >
            <el-button type="warning" size="small" @click="assignRoles(scope.row)"
              >分配角色</el-button
            >
            <el-button type="danger" size="small" @click="deleteUser(scope.row)">删除</el-button>
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

      <!-- 编辑用户对话框 -->
      <el-dialog
        :title="isEditMode ? '编辑用户' : '添加用户'"
        v-model:visible="editDialogVisible"
        width="600px"
      >
        <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="120px">
          <el-form-item label="用户名" prop="username">
            <el-input
              v-model="editForm.username"
              placeholder="请输入用户名"
              :disabled="isEditMode"
            ></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="editForm.nickname" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item v-if="!isEditMode" label="密码" prop="password">
            <el-input
              type="password"
              v-model="editForm.password"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="editForm.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="editForm.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
              <el-radio :label="0">未知</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="用户等级" prop="level">
            <el-select v-model="editForm.level" placeholder="请选择用户等级">
              <el-option label="普通会员" :value="1"></el-option>
              <el-option label="高级会员" :value="2"></el-option>
              <el-option label="VIP会员" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户状态" prop="status">
            <el-switch
              v-model="editForm.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-value="1"
              inactive-value="0"
            ></el-switch>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              v-model="editForm.remark"
              placeholder="请输入备注"
              rows="3"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelEdit">取消</el-button>
          <el-button type="primary" @click="submitEdit" :loading="editForm.loading">提交</el-button>
        </div>
      </el-dialog>

      <!-- 角色分配对话框 -->
      <el-dialog title="角色分配" v-model:visible="roleDialogVisible" width="600px">
        <el-form ref="roleForm" :model="roleForm" label-width="120px">
          <el-form-item label="用户姓名">
            <el-input v-model="roleForm.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="用户角色">
            <el-checkbox-group v-model="roleForm.roleIds">
              <el-checkbox
                v-for="role in enabledRoles"
                :key="role.id"
                :label="role.id"
                style="display: block; margin: 10px 0"
              >
                {{ role.roleName }} - {{ role.description }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="已分配角色">
            <div class="assigned-roles">
              <el-tag
                v-for="role in userRoles"
                :key="role.id"
                type="success"
                size="small"
                effect="dark"
                closable
              >
                {{ role.roleName }}
              </el-tag>
              <span v-if="userRoles.length === 0" class="no-roles">暂无分配角色</span>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleRoleDialogClose">取消</el-button>
          <el-button type="primary" @click="submitRoleAssignment" :loading="roleLoading"
            >确定分配</el-button
          >
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 导入日志工具
import logger from '@/utils/logger'
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Refresh, Download } from '@element-plus/icons-vue'

// 导入类型定义
import { UserListItem as User, Role, EditForm, RoleForm } from '@/types/user'

// 导入API
import { userApi } from '@/api/user'

// 路由和日志
const router = useRouter()
const route = useRoute()

// 加载状态
const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  userId: '',
  userName: '',
  phone: '',
  status: '',
  registerTimeRange: [] as string[],
})

// 分页信息
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const userList = ref<User[]>([])

// 选中的用户ID
const selectedUserIds = ref<number[]>([])
const selectedRows = ref<User[]>([])

// 用户统计
const totalUserCount = ref(0)
const todayNewCount = ref(0)
const activeUserCount = ref(0)
const disabledUserCount = ref(0)

// 编辑对话框
const editDialogVisible = ref(false)
const isEditMode = ref(false)
const editForm = reactive<EditForm>({
  id: '',
  username: '',
  nickname: '',
  password: '',
  phone: '',
  email: '',
  sex: 0,
  level: 1,
  status: '1',
  remark: '',
})

const editFormRef = ref()

// 表单验证规则
const editRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
  ],
  nickname: [{ max: 50, message: '昵称长度不能超过 50 个字符', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
  ],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }],
  email: [
    {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: '请输入正确的邮箱地址',
      trigger: 'blur',
    },
  ],
})

// 角色分配相关
const roleDialogVisible = ref(false)
const roleForm = reactive<RoleForm>({
  userId: '',
  username: '',
  roleIds: [],
})
const enabledRoles = ref<Role[]>([])
const userRoles = ref<Role[]>([])
const roleLoading = ref(false)

// 页面加载时获取数据
onMounted(() => {
  getUsers()
  fetchUserStats()
})

// 获取用户列表
const getUsers = async () => {
  loading.value = true
  try {
    const params = {
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      ...searchForm,
    }

    const response = await userApi.getUserList(params)
    userList.value = response.data.records
    total.value = response.data.total

    logger.info('获取用户列表成功', { count: userList.value.length })
  } catch (error) {
    logger.error('获取用户列表失败', error)
    ElMessage.error('获取用户列表失败')
    userList.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

// 获取用户统计数据
const fetchUserStats = async () => {
  try {
    // 使用真实API调用统计数据
    // const response = await userApi.getUserStatistics()
    // const { totalUserCount, todayNewCount, activeUserCount, disabledUserCount } = response.data

    // 模拟数据
    totalUserCount.value = 1568
    todayNewCount.value = 24
    activeUserCount.value = 1234
    disabledUserCount.value = 56
  } catch (error) {
    logger.error('获取用户统计数据失败', error)
    ElMessage.error('获取用户统计数据失败')
  }
}

// 获取等级标签类型
const getLevelTagType = (level: number): string => {
  switch (level) {
    case 1:
      return 'info'
    case 2:
      return 'success'
    case 3:
      return 'warning'
    default:
      return 'info'
  }
}

// 获取等级文本
const getLevelText = (level: number): string => {
  switch (level) {
    case 1:
      return '普通会员'
    case 2:
      return '高级会员'
    case 3:
      return 'VIP会员'
    default:
      return '普通会员'
  }
}

// 搜索用户
const search = () => {
  currentPage.value = 1
  getUsers()
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, {
    userId: '',
    userName: '',
    phone: '',
    status: '',
    registerTimeRange: [],
  })
  currentPage.value = 1
  getUsers()
}

// 刷新数据
const refreshData = () => {
  getUsers()
  fetchUserStats()
}

// 导出用户
const exportUsers = async () => {
  try {
    const params = {
      currentPage: 1,
      pageSize: 0, // 导出所有数据
      ...searchForm,
    }

    const blob = await userApi.exportUserList(params)
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `用户列表_${new Date().toISOString().slice(0, 10)}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    ElMessage.success('导出成功')
    logger.info('导出用户列表成功')
  } catch (error) {
    logger.error('导出用户列表失败', error)
    ElMessage.error('导出失败')
  }
}

// 处理选择变化
const handleSelectionChange = (selection: User[]) => {
  selectedUserIds.value = selection.map(item => item.id)
  selectedRows.value = selection
}

// 批量启用
const batchEnable = () => {
  ElMessageBox.confirm('确定要批量启用选中的用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      loading.value = true
      try {
        await userApi.batchEnableUser(selectedUserIds.value)

        // 更新本地数据
        userList.value.forEach(user => {
          if (selectedUserIds.value.includes(user.id)) {
            user.status = '1'
          }
        })

        ElMessage.success('批量启用成功')
        logger.info('批量启用用户成功', { count: selectedUserIds.value.length })

        // 清空选中
        selectedUserIds.value = []
      } catch (error) {
        logger.error('批量启用用户失败', error)
        ElMessage.error('批量启用失败')
      } finally {
        loading.value = false
      }
    })
    .catch(() => {
      // 取消操作
    })
}

// 批量禁用
const batchDisable = () => {
  ElMessageBox.confirm('确定要批量禁用选中的用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      loading.value = true
      try {
        await userApi.batchDisableUser(selectedUserIds.value)

        // 更新本地数据
        userList.value.forEach(user => {
          if (selectedUserIds.value.includes(user.id)) {
            user.status = '0'
          }
        })

        ElMessage.success('批量禁用成功')
        logger.info('批量禁用用户成功', { count: selectedUserIds.value.length })

        // 清空选中
        selectedUserIds.value = []
      } catch (error) {
        logger.error('批量禁用用户失败', error)
        ElMessage.error('批量禁用失败')
      } finally {
        loading.value = false
      }
    })
    .catch(() => {
      // 取消操作
    })
}

// 批量删除
const batchDelete = () => {
  ElMessageBox.confirm('确定要批量删除选中的用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      loading.value = true
      try {
        await userApi.batchDeleteUser(selectedUserIds.value)

        // 更新本地数据
        userList.value = userList.value.filter(user => !selectedUserIds.value.includes(user.id))

        ElMessage.success('批量删除成功')
        logger.info('批量删除用户成功', { count: selectedUserIds.value.length })

        // 清空选中
        selectedUserIds.value = []
      } catch (error) {
        logger.error('批量删除用户失败', error)
        ElMessage.error('批量删除失败')
      } finally {
        loading.value = false
      }
    })
    .catch(() => {
      // 取消操作
    })
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  getUsers()
}

// 处理每页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  getUsers()
}

// 查看用户详情
const viewUser = (row: User) => {
  ElMessage.success('查看详情功能开发中')
}

// 编辑用户
const editUserDialog = (row: User) => {
  isEditMode.value = true
  Object.assign(editForm, {
    id: row.id.toString(),
    username: row.username,
    nickname: row.nickname || '',
    password: '',
    phone: row.phone || '',
    email: row.email || '',
    sex: row.sex || 0,
    level: row.level || 1,
    status: row.status,
    remark: row.remark || '',
  })
  editDialogVisible.value = true
}

// 添加用户
const addUser = () => {
  isEditMode.value = false
  Object.assign(editForm, {
    id: '',
    username: '',
    nickname: '',
    password: '',
    phone: '',
    email: '',
    sex: 0,
    level: 1,
    status: '1',
    remark: '',
  })
  editDialogVisible.value = true
}

// 取消编辑
const cancelEdit = () => {
  editDialogVisible.value = false
}

// 提交编辑
const submitEdit = async () => {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()
    editForm.loading = true

    if (isEditMode.value) {
      // 更新用户
      await userApi.updateUser(editForm)

      // 更新本地数据
      const index = userList.value.findIndex(u => u.id === parseInt(editForm.id))
      if (index !== -1) {
        userList.value[index] = {
          ...userList.value[index],
          ...editForm,
          id: parseInt(editForm.id),
        }
      }
      ElMessage.success('用户更新成功')
      logger.info('更新用户成功', { userId: editForm.id })
    } else {
      // 创建用户
      await userApi.createUser(editForm)
      ElMessage.success('用户创建成功')
      logger.info('创建用户成功', { username: editForm.username })

      // 重新获取用户列表
      getUsers()
    }

    editDialogVisible.value = false
  } catch (error) {
    logger.error('保存用户失败', error)
    if (error instanceof Error) {
      ElMessage.error(error.message)
    } else {
      ElMessage.error('保存失败')
    }
  } finally {
    editForm.loading = false
  }
}

// 处理状态变化
const handleStatusChange = (row: User) => {
  ElMessageBox.confirm(
    `确定要${row.status === '1' ? '禁用' : '启用'}用户「${row.username}」吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(async () => {
      try {
        await userApi.updateUserStatus(row.id, row.status)
        ElMessage.success('状态更新成功')
        logger.info(`${row.status === '1' ? '禁用' : '启用'}用户成功`, { userId: row.id })
      } catch (error) {
        // 恢复原始状态
        row.status = row.status === '1' ? '0' : '1'
        logger.error('更新用户状态失败', error)
        ElMessage.error('状态更新失败')
      }
    })
    .catch(() => {
      // 恢复原始状态
      row.status = row.status === '1' ? '0' : '1'
    })
}

// 分配角色
const assignRoles = (row: User) => {
  roleForm.userId = String(row.id)
  roleForm.username = row.username
  roleForm.roleIds = []
  // 模拟数据
  enabledRoles.value = [
    { id: 1, roleName: '管理员', description: '系统管理员' },
    { id: 2, roleName: '普通用户', description: '普通用户' },
  ]
  userRoles.value = []
  roleDialogVisible.value = true
}

// 处理角色对话框关闭
const handleRoleDialogClose = () => {
  roleDialogVisible.value = false
}

// 提交角色分配
const submitRoleAssignment = () => {
  ElMessage.success('角色分配功能开发中')
  roleDialogVisible.value = false
}
</script>

<style scoped>
.user-list-container {
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

.user-stats {
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

.batch-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.selected-count {
  font-weight: bold;
  color: #409eff;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-details {
  margin-left: 10px;
}

.username {
  font-weight: bold;
  margin-bottom: 2px;
}

.nickname {
  font-size: 12px;
  color: #909399;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.assigned-roles {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.no-roles {
  color: #909399;
  font-size: 14px;
}

.dialog-footer {
  text-align: center;
}
</style>
