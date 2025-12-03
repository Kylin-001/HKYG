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

// 定义类型接口
interface User {
  id: number
  username: string
  nickname?: string
  phone?: string
  email?: string
  sex?: number
  level?: number
  totalSpent?: number
  orderCount?: number
  status: string
  createTime?: string
  lastLoginTime?: string
  remark?: string
  avatar?: string
}

interface Role {
  id: number
  roleName: string
  description?: string
}

interface EditForm {
  id: string
  username: string
  nickname: string
  password: string
  phone: string
  email: string
  sex: number
  level: number
  status: string
  remark: string
  loading?: boolean
}

interface RoleForm {
  userId: string
  username: string
  roleIds: number[]
}

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
  registerTimeRange: [],
})

// 分页信息
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const userList = ref([])

// 选中的用户ID
const selectedUserIds = ref([])
const selectedRows = ref([])

// 用户统计
const totalUserCount = ref(0)
const todayNewCount = ref(0)
const activeUserCount = ref(0)
const disabledUserCount = ref(0)

// 编辑对话框
const editDialogVisible = ref(false)
const isEditMode = ref(false)
const editForm = reactive({
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
  try {
    loading.value = true
    // 使用真实API调用
    // const response = await userApi.getUsers({
    //   currentPage: currentPage.value,
    //   pageSize: pageSize.value,
    //   ...searchForm
    // })

    // 模拟数据
    const mockData: User[] = []
    for (let i = 0; i < pageSize.value; i++) {
      const index = (currentPage.value - 1) * pageSize.value + i
      mockData.push({
        id: index + 1,
        username: `user_${index + 1}`,
        nickname: `用户${index + 1}`,
        phone: `1380013800${index % 10}`,
        email: `user_${index + 1}@example.com`,
        sex: Math.floor(Math.random() * 3),
        level: Math.floor(Math.random() * 3) + 1,
        totalSpent: Math.random() * 10000,
        orderCount: Math.floor(Math.random() * 100),
        status: Math.random() > 0.3 ? '1' : '0',
        createTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastLoginTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      })
    }

    userList.value = mockData
    total.value = 100
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
    logger.error('获取用户统计失败', error)
    // 失败时设置默认值
    totalUserCount.value = 0
    todayNewCount.value = 0
    activeUserCount.value = 0
    disabledUserCount.value = 0
  }
}

// 搜索
const search = () => {
  currentPage.value = 1
  getUsers()
}

// 重置搜索
const resetSearch = () => {
  searchForm.userId = ''
  searchForm.userName = ''
  searchForm.phone = ''
  searchForm.status = ''
  currentPage.value = 1
  getUsers()
}

// 分页处理
const handleCurrentChange = (page: number) => {
  currentPage.value = page
  getUsers()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  getUsers()
}

// 查看用户详情
const viewUser = (user: User) => {
  // 可以跳转到详情页面或在对话框中显示
  ElMessage.info(`查看用户 ${user.username} 的详情`)
  // 如果需要跳转到详情页面，可以使用：
  // router.push(`/user/view/${user.id}`)
}

// 状态更改
const handleStatusChange = async (row: User) => {
  try {
    const statusText = row.status === '1' ? '禁用' : '启用'
    const newStatus = row.status === '1' ? '0' : '1'

    // 使用真实API更新状态
    // await userApi.updateUserStatus({
    //   userId: row.id,
    //   status: newStatus
    // })

    row.status = newStatus
    ElMessage.success(`用户${statusText}成功`)
  } catch (error) {
    logger.error('状态更改失败', error)
    ElMessage.error('状态更改失败')
    // 恢复原状态
    row.status = row.status === '1' ? '0' : '1'
  }
}

// 处理选择变化
const handleSelectionChange = (selection: User[]) => {
  selectedUserIds.value = selection.map(item => item.id)
  selectedRows.value = selection
}

// 刷新数据
const refreshData = () => {
  getUsers()
  fetchUserStats()
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

// 编辑用户（对话框）
const editUserDialog = (user: User) => {
  isEditMode.value = true
  Object.assign(editForm, {
    id: user.id.toString(),
    username: user.username,
    nickname: user.nickname || '',
    password: '',
    phone: user.phone || '',
    email: user.email || '',
    sex: user.sex || 0,
    level: user.level || 1,
    status: user.status || '1',
    remark: user.remark || '',
  })
  editDialogVisible.value = true
}

// 取消编辑
const cancelEdit = () => {
  editDialogVisible.value = false
  if (editFormRef.value) {
    editFormRef.value.resetFields()
  }
}

// 提交编辑
const submitEdit = async () => {
  try {
    editForm.loading = true

    // 使用真实API提交编辑
    // await userApi.updateUser({
    //   userId: editForm.id,
    //   ...editForm
    // })

    ElMessage.success('编辑用户成功')
    editDialogVisible.value = false
    getUsers()
  } catch (error) {
    logger.error('编辑用户失败', error)
    ElMessage.error('编辑用户失败')
  } finally {
    editForm.loading = false
  }
}

// 删除用户
const deleteUser = async (row: User) => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 使用真实API删除用户
    // await userApi.deleteUser({
    //   userId: row.id
    // })

    ElMessage.success('删除用户成功')
    getUsers()
  } catch (error: any) {
    if (error !== 'cancel' && error.code !== 'ERR_CANCELED') {
      logger.error('删除用户失败', error)
      ElMessage.error('删除用户失败')
    }
  }
}

// 批量启用
const batchEnable = async () => {
  try {
    if (!selectedRows.value || selectedRows.value.length === 0) {
      ElMessage.warning('请选择要启用的用户')
      return
    }

    const userIds = selectedRows.value.map(row => row.id)

    // 使用真实API批量更新状态
    // await userApi.batchUpdateUserStatus({
    //   userIds,
    //   status: '1'
    // })

    ElMessage.success(`成功启用${selectedRows.value.length}个用户`)
    getUsers()
  } catch (error) {
    logger.error('批量启用失败', error)
    ElMessage.error('批量启用失败')
  }
}

// 批量禁用
const batchDisable = async () => {
  try {
    if (!selectedRows.value || selectedRows.value.length === 0) {
      ElMessage.warning('请选择要禁用的用户')
      return
    }

    const userIds = selectedRows.value.map(row => row.id)

    // 使用真实API批量更新状态
    // await userApi.batchUpdateUserStatus({
    //   userIds,
    //   status: '0'
    // })

    ElMessage.success(`成功禁用${selectedRows.value.length}个用户`)
    getUsers()
    fetchUserStats()
  } catch (error) {
    logger.error('批量禁用失败', error)
    ElMessage.error('批量禁用失败')
  }
}

// 批量删除
const batchDelete = async () => {
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedUserIds.value.length} 个用户吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'danger',
      }
    )

    // 使用真实API批量删除用户
    // await userApi.batchDeleteUsers({
    //   userIds: selectedUserIds.value
    // })

    ElMessage.success('批量删除成功')
    getUsers()
    fetchUserStats()
  } catch (error: any) {
    if (error !== 'cancel' && error.code !== 'ERR_CANCELED') {
      logger.error('批量删除失败', error)
      ElMessage.error('批量删除失败')
    }
  }
}

// 导出用户
const exportUsers = () => {
  ElMessage.info('导出功能开发中')
}

// 获取等级文本
const getLevelText = (level: number | undefined) => {
  if (level === undefined) return '普通会员'
  const levelMap: Record<number, string> = {
    1: '普通会员',
    2: '高级会员',
    3: 'VIP会员',
  }
  return levelMap[level] || '普通会员'
}

// 获取等级标签类型
const getLevelTagType = (level: number | undefined) => {
  if (level === undefined) return 'info'
  const typeMap: Record<number, string> = {
    1: 'info',
    2: 'success',
    3: 'warning',
  }
  return typeMap[level] || 'info'
}

// 分配角色
const assignRoles = (user: User) => {
  roleForm.userId = user.id.toString()
  roleForm.username = user.username
  roleForm.roleIds = []
  roleDialogVisible.value = true

  // 获取可用角色和用户当前角色
  Promise.all([
    // userApi.getEnabledRoles(),
    // userApi.getUserRoleIds(user.id)
    Promise.resolve([] as Role[]),
    Promise.resolve([] as number[]),
  ]).then(([roles, userRoleIds]) => {
    enabledRoles.value = roles
    roleForm.roleIds = userRoleIds

    // 获取用户已分配角色详情
    // userApi.getUserRoles(user.id).then(userRolesData => {
    //   userRoles.value = userRolesData
    // })
  })
}

// 提交角色分配
const submitRoleAssignment = () => {
  roleLoading.value = true

  // userApi
  //   .assignUserRoles({
  //     userId: roleForm.userId,
  //     roleIds: roleForm.roleIds
  //   })
  setTimeout(() => {
    ElMessage.success('角色分配成功')
    handleRoleDialogClose()
    roleLoading.value = false
  }, 500)
  //   .catch(() => {
  //     ElMessage.error('角色分配失败')
  //   })
  //   .finally(() => {
  //     roleLoading.value = false
  //   })
}

// 关闭角色分配对话框
const handleRoleDialogClose = () => {
  roleDialogVisible.value = false
  roleForm.userId = ''
  roleForm.username = ''
  roleForm.roleIds = []
  userRoles.value = []
  enabledRoles.value = []
}
</script>

<style lang="scss" scoped>
.user-list-container {
  padding: 20px;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: 500;
  }

  .search-form {
    margin-bottom: 20px;
    padding: 20px;
    background: #f5f7fa;
    border-radius: 4px;
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }

  .user-stats {
    display: flex;
    margin-bottom: 20px;
    gap: 20px;
  }

  .stat-item {
    flex: 1;
    background: #f5f7fa;
    border-radius: 6px;
    padding: 20px;
    text-align: center;
    transition: all 0.3s;
  }

  .stat-item:hover {
    background: #ecf5ff;
    transform: translateY(-2px);
  }

  .stat-label {
    font-size: 14px;
    color: #606266;
    margin-bottom: 10px;
  }

  .stat-value {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
  }

  .stat-value.danger {
    color: #f56c6c;
  }

  .stat-value.primary {
    color: #409eff;
  }

  .stat-value.success {
    color: #67c23a;
  }

  .batch-actions {
    margin-bottom: 15px;
    padding: 10px;
    background: #f0f9ff;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .selected-count {
    color: #606266;
  }

  .user-info {
    display: flex;
    align-items: center;
  }

  .user-details {
    margin-left: 10px;
    line-height: 1.5;
  }

  .username {
    font-weight: 500;
  }

  .nickname {
    font-size: 12px;
    color: #909399;
  }

  .dialog-footer {
    text-align: center;

    & .assigned-roles {
      margin-top: 10px;

      & .el-tag {
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }

    & .no-roles {
      color: #909399;
      font-size: 14px;
    }
  }
}
</style>
