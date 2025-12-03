<template>
  <div class="system-admin-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>系统管理员管理</span>
        <el-button type="primary" size="small" @click="handleAdd">
          <i class="el-icon-plus"></i> 添加管理员
        </el-button>
      </div>

      <el-form :inline="true" :model="searchForm" class="admin-search-form">
        <el-form-item label="管理员账号">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入管理员账号"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="管理员姓名">
          <el-input
            v-model="searchForm.realName"
            placeholder="请输入管理员姓名"
            clearable
          ></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.roleId" placeholder="请选择角色" clearable>
            <el-option value="" label="全部"></el-option>
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option value="" label="全部"></el-option>
            <el-option value="1" label="启用"></el-option>
            <el-option value="0" label="禁用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchAdmins">查询</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="admins" style="width: 100%" v-loading="loading">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="username" label="账号" width="180"></el-table-column>
        <el-table-column prop="realName" label="姓名" width="120"></el-table-column>
        <el-table-column prop="roleName" label="角色" width="150"></el-table-column>
        <el-table-column prop="phone" label="手机号" width="150"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template v-slot="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(scope.row)"
              :disabled="scope.row.id === 1"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
        <el-table-column prop="lastLoginTime" label="最后登录时间" width="180"></el-table-column>
        <el-table-column label="操作" width="200">
          <template v-slot="scope">
            <el-button size="mini" @click="handleEdit(scope.row)" :disabled="scope.row.id === 1"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="handleResetPassword(scope.row)"
              :disabled="scope.row.id === 1"
              >重置密码</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)"
              :disabled="scope.row.id === 1"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        v-model:page-size="pagination.pageSize"
        v-model:current-page="pagination.currentPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        class="admin-pagination"
      ></el-pagination>
    </el-card>

    <!-- 添加/编辑管理员对话框 -->
    <el-dialog :title="dialogTitle" v-model:visible="dialogVisible" width="600px">
      <el-form :model="formData" :rules="rules" ref="formRef" label-width="120px">
        <el-form-item label="管理员账号" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入管理员账号"
            :disabled="isEdit"
          ></el-input>
        </el-form-item>
        <div v-if="!isEdit">
          <el-form-item label="登录密码" prop="password">
            <el-input
              type="password"
              v-model="formData.password"
              placeholder="请输入登录密码"
              show-password
              minlength="6"
              maxlength="20"
            ></el-input>
          </el-form-item>
        </div>
        <el-form-item label="管理员姓名" prop="realName">
          <el-input v-model="formData.realName" placeholder="请输入管理员姓名"></el-input>
        </el-form-item>
        <el-form-item label="所属角色" prop="roleId">
          <el-select v-model="formData.roleId" placeholder="请选择所属角色">
            <el-option
              v-for="role in roleList"
              :key="role.id"
              :label="role.name"
              :value="role.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号码"
            maxlength="11"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入电子邮箱"></el-input>
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
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </el-dialog>

    <!-- 重置密码对话框 -->
    <el-dialog title="重置密码" v-model:visible="resetPasswordVisible" width="400px">
      <el-form
        :model="resetPasswordForm"
        :rules="resetPasswordRules"
        ref="resetPasswordFormRef"
        label-width="120px"
      >
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            type="password"
            v-model="resetPasswordForm.newPassword"
            placeholder="请输入新密码"
            show-password
            minlength="6"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            type="password"
            v-model="resetPasswordForm.confirmPassword"
            placeholder="请再次输入新密码"
            show-password
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetPasswordVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmResetPassword">确定重置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
// 导入Vue 3 API
import { ref, reactive, onMounted } from 'vue'
// 导入Element Plus组件
import { ElMessage, ElMessageBox } from 'element-plus'
// 导入日志工具
import logger from '@/utils/logger'

// 定义类型接口
interface Admin {
  id: number
  username: string
  realName: string
  roleId: number
  roleName: string
  phone: string
  email: string
  status: number
  createTime: string
  lastLoginTime: string
}

interface Role {
  id: number
  name: string
}

interface SearchForm {
  username: string
  realName: string
  roleId: string
  status: string
}

interface FormData {
  id: string
  username: string
  password: string
  realName: string
  roleId: string
  phone: string
  email: string
  status: string
}

interface ResetPasswordForm {
  newPassword: string
  confirmPassword: string
}

interface Pagination {
  currentPage: number
  pageSize: number
  total: number
}

// 搜索表单
const searchForm = reactive<SearchForm>({
  username: '',
  realName: '',
  roleId: '',
  status: '',
})

// 管理员列表
const admins = ref<Admin[]>([])

// 加载状态
const loading = ref(false)

// 角色列表
const roleList = ref<Role[]>([])

// 分页信息
const pagination = reactive<Pagination>({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

// 对话框
const dialogVisible = ref(false)
const dialogTitle = ref('添加管理员')
const isEdit = ref(false)

// 表单引用
const formRef = ref()

// 表单数据
const formData = reactive<FormData>({
  id: '',
  username: '',
  password: '',
  realName: '',
  roleId: '',
  phone: '',
  email: '',
  status: '1',
})

// 表单验证规则
const rules = reactive({
  username: [
    { required: true, message: '请输入管理员账号', trigger: 'blur' },
    { min: 4, max: 20, message: '账号长度在4到20个字符', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入登录密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' },
  ],
  realName: [{ required: true, message: '请输入管理员姓名', trigger: 'blur' }],
  roleId: [{ required: true, message: '请选择所属角色', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  email: [
    { required: true, message: '请输入电子邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的电子邮箱', trigger: 'blur' },
  ],
})

// 重置密码
const resetPasswordVisible = ref(false)
const resetPasswordFormRef = ref()
const resetPasswordForm = reactive<ResetPasswordForm>({
  newPassword: '',
  confirmPassword: '',
})

const resetPasswordRules = reactive({
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在6到20个字符', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== resetPasswordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

// 当前操作的管理员ID
const currentAdminId = ref('')

// 获取管理员列表
const fetchAdmins = async () => {
  loading.value = true
  try {
    // 模拟数据
    setTimeout(() => {
      admins.value = [
        {
          id: 1,
          username: 'admin',
          realName: '系统管理员',
          roleName: '超级管理员',
          phone: '13800138000',
          email: 'admin@example.com',
          status: 1,
          createTime: '2024-01-01 10:00:00',
          lastLoginTime: '2024-01-15 09:30:00',
        },
        {
          id: 2,
          username: 'user1',
          realName: '张三',
          roleName: '普通管理员',
          phone: '13800138001',
          email: 'zhangsan@example.com',
          status: 1,
          createTime: '2024-01-02 10:00:00',
          lastLoginTime: '2024-01-14 16:20:00',
        },
      ]
      pagination.total = 2
      loading.value = false
    }, 500)
  } catch (error) {
    logger.error('获取管理员列表错误', error)
    ElMessage.error('获取管理员列表失败')
    admins.value = []
    pagination.total = 0
    loading.value = false
  }
}

// 获取角色列表
const fetchRoles = async () => {
  try {
    // 模拟数据
    roleList.value = [
      { id: 1, name: '超级管理员' },
      { id: 2, name: '普通管理员' },
      { id: 3, name: '操作员' },
    ]
  } catch (error) {
    logger.error('获取角色列表错误', error)
    ElMessage.error('获取角色列表失败')
    roleList.value = []
  }
}

// 搜索管理员
const searchAdmins = () => {
  pagination.currentPage = 1
  fetchAdmins()
}

// 重置搜索
const resetSearch = () => {
  searchForm.username = ''
  searchForm.realName = ''
  searchForm.roleId = ''
  searchForm.status = ''
  fetchAdmins()
  pagination.currentPage = 1
}

// 处理添加管理员
const handleAdd = () => {
  dialogTitle.value = '添加管理员'
  isEdit.value = false
  formData.id = ''
  formData.username = ''
  formData.password = ''
  formData.realName = ''
  formData.roleId = ''
  formData.phone = ''
  formData.email = ''
  formData.status = '1'
  dialogVisible.value = true
}

// 处理编辑管理员
const handleEdit = (row: Admin) => {
  dialogTitle.value = '编辑管理员'
  isEdit.value = true
  formData.id = row.id.toString()
  formData.username = row.username
  formData.realName = row.realName
  formData.roleId = row.roleId.toString()
  formData.phone = row.phone
  formData.email = row.email
  formData.status = row.status.toString()
  dialogVisible.value = true
}

// 处理状态变化
const handleStatusChange = async (row: Admin) => {
  try {
    // 模拟API调用
    setTimeout(() => {
      ElMessage.success(row.status === 1 ? '已启用' : '已禁用')
    }, 300)
  } catch (error) {
    logger.error('更新管理员状态错误', error)
    // 恢复原状态
    row.status = row.status === 1 ? 0 : 1
    ElMessage.error('状态更新失败')
  }
}

// 处理重置密码
const handleResetPassword = (row: Admin) => {
  currentAdminId.value = row.id.toString()
  resetPasswordForm.newPassword = ''
  resetPasswordForm.confirmPassword = ''
  resetPasswordVisible.value = true
}

// 确认重置密码
const confirmResetPassword = async () => {
  try {
    if (!resetPasswordFormRef.value) return
    const valid = await resetPasswordFormRef.value.validate()
    if (!valid) return

    // 模拟API调用
    setTimeout(() => {
      ElMessage.success('密码重置成功')
      resetPasswordVisible.value = false
    }, 500)
  } catch (error) {
    logger.error('重置密码错误', error)
    ElMessage.error('密码重置失败')
  }
}

// 处理删除管理员
const handleDelete = async (row: Admin) => {
  try {
    await ElMessageBox.confirm(`确定要删除管理员"${row.realName}"吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 模拟API调用
    setTimeout(() => {
      ElMessage.success('删除成功')
      fetchAdmins()
    }, 500)
  } catch (error: any) {
    if (error !== 'cancel') {
      logger.error('删除管理员失败', error)
      ElMessage.error('删除管理员失败，请重试')
    } else {
      ElMessage.info('已取消删除')
    }
  }
}

// 处理分页大小变化
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  fetchAdmins()
}

// 处理当前页变化
const handleCurrentChange = (current: number) => {
  pagination.currentPage = current
  fetchAdmins()
}

// 处理表单提交
const handleSubmit = async () => {
  try {
    if (!formRef.value) return
    const valid = await formRef.value.validate()
    if (!valid) return

    // 模拟API调用
    setTimeout(() => {
      ElMessage.success(isEdit.value ? '编辑成功' : '添加成功')
      dialogVisible.value = false
      fetchAdmins()
    }, 500)
  } catch (error) {
    logger.error('保存管理员信息错误', error)
    ElMessage.error('保存失败，请重试')
  }
}

// 组件挂载时调用
onMounted(() => {
  fetchAdmins()
  fetchRoles()
})
</script>

<style scoped>
.system-admin-container {
  padding: 20px;
}

.admin-search-form {
  margin-bottom: 20px;
}

.admin-pagination {
  margin-top: 20px;
  text-align: right;
}

.dialog-footer {
  text-align: center;
}
</style>
