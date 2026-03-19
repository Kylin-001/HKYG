<template>
  <div class="user-role-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h2>用户角色分配</h2>
        <span class="subtitle">为用户分配角色权限</span>
      </div>
      <div class="header-right">
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <!-- 用户角色分配卡片 -->
    <el-card class="user-role-card">
      <!-- 左侧用户列表 -->
      <div class="user-role-layout">
        <div class="user-list-container">
          <h3>用户列表</h3>
          <el-input
            v-model="searchParams.keyword"
            placeholder="用户名或手机号"
            clearable
            size="small"
            style="margin-bottom: 20px; width: 100%"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-table
            v-loading="loading"
            :data="userList"
            style="width: 100%"
            border
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="id" label="用户ID" width="100" align="center" />
            <el-table-column prop="username" label="用户名" width="150" align="center" />
            <el-table-column prop="nickname" label="昵称" width="150" align="center" />
            <el-table-column prop="phone" label="手机号" width="180" align="center" />
            <el-table-column prop="email" label="邮箱" align="center" />
            <el-table-column prop="status" label="状态" width="100" align="center">
              <template #default="scope">
                <el-tag :type="scope.row.status === '1' ? 'success' : 'danger'">
                  {{ scope.row.status === '1' ? '启用' : '禁用' }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="180" align="center" />
          </el-table>

          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="pagination.currentPage"
              v-model:page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>

        <!-- 右侧角色分配 -->
        <div class="role-assignment-container">
          <h3>角色分配</h3>
          <div v-if="selectedUsers.length === 0" class="no-selection">
            <el-empty description="请选择用户" />
          </div>
          <div v-else-if="selectedUsers.length > 1" class="multiple-selection">
            <el-empty description="请选择单个用户进行角色分配" />
          </div>
          <div v-else class="single-selection">
            <div class="selected-user-info">
              <div class="user-avatar">
                <el-avatar :size="40" :src="selectedUsers[0].avatar || ''">
                  {{ selectedUsers[0].nickname?.charAt(0) || selectedUsers[0].username.charAt(0) }}
                </el-avatar>
              </div>
              <div class="user-details">
                <div class="user-name">
                  {{ selectedUsers[0].nickname || selectedUsers[0].username }}
                </div>
                <div class="user-id">用户ID: {{ selectedUsers[0].id }}</div>
              </div>
            </div>

            <div class="role-list">
              <h4>当前角色</h4>
              <div class="current-roles">
                <el-tag
                  v-for="role in selectedUserRoles"
                  :key="role.id"
                  closable
                  @close="handleRemoveRole(role.id)"
                >
                  {{ role.name }}
                </el-tag>
                <el-tag v-if="selectedUserRoles.length === 0" type="info"> 未分配角色 </el-tag>
              </div>

              <h4 style="margin-top: 20px">可选角色</h4>
              <div class="available-roles">
                <el-checkbox-group v-model="checkedRoles" @change="handleRoleChange">
                  <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">
                    {{ role.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>

              <div class="action-buttons">
                <el-button type="primary" @click="handleSaveRoles">
                  <el-icon><Check /></el-icon>
                  保存角色分配
                </el-button>
                <el-button @click="handleCancel">
                  <el-icon><Close /></el-icon>
                  取消
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Search, Check, Close } from '@element-plus/icons-vue'
import * as systemApi from '@/api/system'

// 导入类型定义
interface User {
  id: string
  username: string
  nickname: string
  avatar: string
  phone: string
  email: string
  status: string
  createTime: string
}

interface Role {
  id: string
  name: string
  code: string
  description: string
}

// 响应式状态
const loading = ref(false)
const userList = ref<User[]>([])
const roleList = ref<Role[]>([])
const total = ref(0)
const selectedUsers = ref<User[]>([])
const selectedUserRoles = ref<Role[]>([])
const checkedRoles = ref<string[]>([])

// 搜索参数
const searchParams = reactive({
  keyword: '',
})

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
})

// 初始化数据
onMounted(() => {
  fetchUserList()
  fetchRoleList()
})

// 监听选中用户变化
watch(selectedUsers, newVal => {
  if (newVal.length === 1) {
    fetchUserRoles(newVal[0].id)
  } else {
    selectedUserRoles.value = []
    checkedRoles.value = []
  }
})

// 获取用户列表
const fetchUserList = async () => {
  loading.value = true
  try {
    const res = await systemApi.getAdminList({
      keyword: searchParams.keyword,
      current: pagination.currentPage,
      size: pagination.pageSize,
    })
    userList.value = res.data.records || []
    total.value = res.data.total || 0
  } catch (error) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }
}

// 获取角色列表
const fetchRoleList = async () => {
  try {
    const res = await systemApi.getEnabledRoles()
    roleList.value = res.data || []
  } catch (error) {
    ElMessage.error('获取角色列表失败')
  }
}

// 获取用户角色
const fetchUserRoles = async (userId: string) => {
  try {
    const res = await systemApi.getUserRoleIds(userId)
    const roleIds = res.data || []
    selectedUserRoles.value = roleList.value.filter(role => roleIds.includes(role.id))
    checkedRoles.value = roleIds
  } catch (error) {
    ElMessage.error('获取用户角色失败')
  }
}

// 搜索用户
const handleSearch = () => {
  pagination.currentPage = 1
  fetchUserList()
}

// 刷新用户列表
const handleRefresh = () => {
  searchParams.keyword = ''
  pagination.currentPage = 1
  fetchUserList()
}

// 分页变化处理
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchUserList()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  fetchUserList()
}

// 选择用户变化
const handleSelectionChange = (selection: any[]) => {
  selectedUsers.value = selection
}

// 角色选择变化
const handleRoleChange = (val: string[]) => {
  console.log('Selected roles:', val)
}

// 移除角色
const handleRemoveRole = (roleId: string) => {
  selectedUserRoles.value = selectedUserRoles.value.filter(role => role.id !== roleId)
  checkedRoles.value = selectedUserRoles.value.map(role => role.id)
}

// 保存角色分配
const handleSaveRoles = async () => {
  if (selectedUsers.value.length !== 1) {
    ElMessage.warning('请选择单个用户')
    return
  }
  try {
    const userId = selectedUsers.value[0].id
    await systemApi.assignUserRoles(userId, checkedRoles.value)
    selectedUserRoles.value = roleList.value.filter(role => checkedRoles.value.includes(role.id))
    ElMessage.success('角色分配保存成功')
  } catch (error) {
    ElMessage.error('角色分配保存失败')
  }
}

// 取消操作
const handleCancel = () => {
  checkedRoles.value = selectedUserRoles.value.map(role => role.id)
}
</script>

<style lang="scss" scoped>
.user-role-management {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: #333;
  }

  .subtitle {
    display: block;
    margin-top: 5px;
    font-size: 14px;
    color: #999;
  }

  .header-right {
    display: flex;
    gap: 10px;
  }
}

.user-role-card {
  margin-bottom: 20px;
}

.user-role-layout {
  display: flex;
  gap: 20px;

  .user-list-container {
    flex: 1;
    border-right: 1px solid #e0e0e0;
    padding-right: 20px;

    h3 {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 600;
    }
  }

  .role-assignment-container {
    width: 400px;
    padding-left: 20px;

    h3 {
      margin-top: 0;
      margin-bottom: 20px;
      font-size: 16px;
      font-weight: 600;
    }

    .no-selection,
    .multiple-selection {
      height: 400px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .selected-user-info {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f0f8ff;
      border-radius: 8px;

      .user-avatar {
        margin-right: 15px;
      }

      .user-details {
        .user-name {
          font-weight: 600;
          margin-bottom: 5px;
        }

        .user-id {
          font-size: 12px;
          color: #999;
        }
      }
    }

    .role-list {
      h4 {
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 14px;
        font-weight: 600;
      }

      .current-roles {
        margin-bottom: 10px;

        .el-tag {
          margin-right: 5px;
          margin-bottom: 5px;
        }
      }

      .available-roles {
        margin-bottom: 20px;

        .el-checkbox {
          display: block;
          margin-bottom: 10px;
        }
      }

      .action-buttons {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
      }
    }
  }
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
