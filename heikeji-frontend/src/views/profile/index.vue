<template>
  <div class="profile-container">
    <el-card class="box-card">
      <div class="user-overview">
        <!-- 头像上传 -->
        <div class="avatar-section">
          <el-upload
            class="avatar-uploader"
            action="/api/upload/avatar"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="basicForm.avatar" :src="basicForm.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>

        <!-- 用户信息 -->
        <div class="user-info-section">
          <div class="user-meta">
            <h3>{{ basicForm.name || '未设置姓名' }}</h3>
            <p class="username">@{{ basicForm.username || '未设置用户名' }}</p>
          </div>
          <div class="meta-items">
            <div class="meta-item">
              <span class="label">部门：</span>
              <span class="value">{{ basicForm.department || '未设置' }}</span>
            </div>
            <div class="meta-item">
              <span class="label">职位：</span>
              <span class="value">{{ basicForm.position || '未设置' }}</span>
            </div>
            <div class="meta-item">
              <span class="label">电话：</span>
              <span class="value">{{ basicForm.phone || '未设置' }}</span>
            </div>
            <div class="meta-item">
              <span class="label">邮箱：</span>
              <span class="value">{{ basicForm.email || '未设置' }}</span>
            </div>
          </div>
        </div>

        <!-- 统计数据 -->
        <div class="user-stats">
          <div class="stat-item">
            <div class="stat-number">{{ userStats.loginCount }}</div>
            <div class="stat-label">登录次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ userStats.continuousLogin }}</div>
            <div class="stat-label">连续登录</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">{{ userStats.workingDays }}</div>
            <div class="stat-label">入职天数</div>
          </div>
        </div>
      </div>
    </el-card>

    <el-tabs v-model="activeTab" class="profile-tabs">
      <el-tab-pane label="基本信息" name="basic">
        <el-form ref="basicFormRef" :model="basicForm" :rules="basicRules" label-width="80px">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="basicForm.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="basicForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="部门" prop="department">
            <el-input v-model="basicForm.department" placeholder="请输入部门"></el-input>
          </el-form-item>
          <el-form-item label="职位" prop="position">
            <el-input v-model="basicForm.position" placeholder="请输入职位"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="basicForm.phone" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="basicForm.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="头像">
            <el-upload
              class="avatar-uploader"
              action="/api/upload/avatar"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="basicForm.avatar" :src="basicForm.avatar" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="saveBasicInfo">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="安全设置" name="security">
        <el-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-width="100px"
        >
          <el-form-item label="原密码" prop="oldPassword">
            <el-input
              v-model="passwordForm.oldPassword"
              type="password"
              placeholder="请输入原密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input
              v-model="passwordForm.newPassword"
              type="password"
              placeholder="请输入新密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input
              v-model="passwordForm.confirmPassword"
              type="password"
              placeholder="请确认新密码"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="changePassword">修改密码</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="操作日志" name="logs">
        <el-table :data="operationLogs" stripe>
          <el-table-column prop="operation" label="操作"></el-table-column>
          <el-table-column prop="time" label="时间" width="180"></el-table-column>
          <el-table-column prop="ip" label="IP地址" width="140"></el-table-column>
          <el-table-column prop="userAgent" label="用户代理"></el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.profile-container {
  padding: 20px;
}

.box-card {
  margin-bottom: 20px;
}

.user-overview {
  display: flex;
  align-items: center;
  padding: 20px;
}

.avatar-section {
  margin-right: 30px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}

.user-info-section {
  flex: 1;
}

.user-meta {
  margin-bottom: 15px;
}

.user-meta h3 {
  margin: 0 0 5px 0;
  font-size: 20px;
  color: #303133;
}

.username {
  margin: 0;
  color: #909399;
  font-size: 14px;
}

.meta-items {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-item .label {
  color: #606266;
  margin-right: 5px;
}

.meta-item .value {
  color: #303133;
}

.user-stats {
  display: flex;
  margin-left: 30px;
}

.stat-item {
  text-align: center;
  margin: 0 15px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #909399;
}

.profile-tabs {
  background: white;
  padding: 20px;
}

.avatar-uploader {
  display: inline-block;
}
</style>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'

// 定义类型接口
interface BasicForm {
  name: string
  username: string
  department: string
  position: string
  phone: string
  email: string
  avatar: string
}

interface PasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

interface UserStats {
  loginCount: number
  continuousLogin: number
  workingDays: number
}

interface OperationLog {
  operation: string
  time: string
  ip: string
  userAgent: string
}

// 响应式数据
const activeTab = ref('basic')
const basicFormRef = ref<FormInstance | null>(null)
const passwordFormRef = ref<FormInstance | null>(null)

const basicForm = reactive<BasicForm>({
  name: '张三',
  username: 'zhangsan',
  department: '技术部',
  position: '前端工程师',
  phone: '13800138000',
  email: 'zhangsan@example.com',
  avatar: '',
})

const passwordForm = reactive<PasswordForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const userStats = reactive<UserStats>({
  loginCount: 128,
  continuousLogin: 15,
  workingDays: 365,
})

const operationLogs = reactive<OperationLog[]>([
  {
    operation: '登录系统',
    time: '2024-01-15 09:30:00',
    ip: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0',
  },
  {
    operation: '修改个人信息',
    time: '2024-01-14 16:20:00',
    ip: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0',
  },
  {
    operation: '上传头像',
    time: '2024-01-14 14:15:00',
    ip: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0',
  },
])

// 表单验证规则
const basicRules = reactive({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [{ type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }],
})

const passwordRules = reactive({
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

// 处理头像上传成功
const handleAvatarSuccess = (res: any, file: any) => {
  basicForm.avatar = URL.createObjectURL(file.raw)
}

// 头像上传前验证
const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像只能是 JPG 格式!')
  }
  if (!isLt2M) {
    ElMessage.error('上传头像大小不能超过 2MB!')
  }
  return isJPG && isLt2M
}

// 保存基本信息
const saveBasicInfo = async () => {
  if (!basicFormRef.value) return

  try {
    await basicFormRef.value.validate()
    ElMessage.success('保存成功')
    // 这里调用API保存用户信息
  } catch (error) {
    ElMessage.error('请检查输入信息')
  }
}

// 修改密码
const changePassword = async () => {
  if (!passwordFormRef.value) return

  try {
    await passwordFormRef.value.validate()
    ElMessage.success('密码修改成功')
    // 这里调用API修改密码
    passwordForm.oldPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
  } catch (error) {
    ElMessage.error('请检查输入信息')
  }
}
</script>
