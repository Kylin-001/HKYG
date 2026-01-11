<template>
  <div class="profile-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1><i class="el-icon-user"></i> 个人资料</h1>
    </div>

    <!-- 用户信息卡片 -->
    <el-card class="profile-card">
      <div class="avatar-section">
        <el-avatar :size="100" :src="userInfo.avatar || defaultAvatar" class="user-avatar">
          {{ userInfo.nickname ? userInfo.nickname.charAt(0) : 'U' }}
        </el-avatar>
        <div class="avatar-actions">
          <el-button type="primary" size="small">
            <i class="el-icon-upload"></i> 更换头像
          </el-button>
        </div>
      </div>

      <el-form :model="userInfo" label-width="80px" class="profile-form">
        <el-form-item label="用户名">
          <el-input v-model="userInfo.username" disabled placeholder="用户名" />
        </el-form-item>

        <el-form-item label="昵称">
          <el-input v-model="userInfo.nickname" placeholder="请输入昵称" />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input v-model="userInfo.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="userInfo.gender">
            <el-radio label="0">未知</el-radio>
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="userInfo.email" placeholder="请输入邮箱" />
        </el-form-item>

        <el-form-item label="生日">
          <el-date-picker
            v-model="userInfo.birthday"
            type="date"
            placeholder="选择生日"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="个性签名">
          <el-input
            v-model="userInfo.signature"
            type="textarea"
            :rows="3"
            placeholder="请输入个性签名"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveProfile" :loading="saving">
            <i class="el-icon-check"></i> 保存修改
          </el-button>
          <el-button @click="resetForm"> <i class="el-icon-refresh"></i> 重置 </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 账户安全卡片 -->
    <el-card class="security-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <h3><i class="el-icon-lock"></i> 账户安全</h3>
        </div>
      </template>

      <div class="security-items">
        <div class="security-item">
          <div class="security-info">
            <h4>修改密码</h4>
            <p>定期修改密码，保障账户安全</p>
          </div>
          <el-button type="primary" size="small" @click="goToChangePassword">
            <i class="el-icon-edit"></i> 立即修改
          </el-button>
        </div>

        <div class="security-item">
          <div class="security-info">
            <h4>绑定手机号</h4>
            <p>{{ userInfo.phone ? '已绑定' : '未绑定' }}手机号</p>
          </div>
          <el-button type="primary" size="small" @click="goToBindPhone">
            <i class="el-icon-link"></i> {{ userInfo.phone ? '更换绑定' : '立即绑定' }}
          </el-button>
        </div>

        <div class="security-item">
          <div class="security-info">
            <h4>绑定邮箱</h4>
            <p>{{ userInfo.email ? '已绑定' : '未绑定' }}邮箱</p>
          </div>
          <el-button type="primary" size="small" @click="goToBindEmail">
            <i class="el-icon-link"></i> {{ userInfo.email ? '更换绑定' : '立即绑定' }}
          </el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 路由
const router = useRouter()

// 默认头像
const defaultAvatar = '/static/images/default-avatar.jpg'

// 保存状态
const saving = ref(false)

// 用户信息
const userInfo = reactive({
  id: 0,
  username: '',
  nickname: '',
  phone: '',
  email: '',
  gender: '0',
  birthday: '',
  signature: '',
  avatar: '',
})

// 原始用户信息，用于重置
const originalUserInfo = reactive({ ...userInfo })

// 生命周期钩子：页面加载时获取用户信息
onMounted(() => {
  fetchUserInfo()
})

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    // 模拟API请求，实际项目中替换为真实API
    // const response = await userApi.getUserInfo()
    // Object.assign(userInfo, response.data)
    // Object.assign(originalUserInfo, response.data)

    // 模拟数据
    setTimeout(() => {
      Object.assign(userInfo, {
        id: 1,
        username: 'user123',
        nickname: '黑科易购用户',
        phone: '13800138000',
        email: '',
        gender: '1',
        birthday: '1990-01-01',
        signature: '这是一个个性签名',
        avatar: '',
      })
      Object.assign(originalUserInfo, { ...userInfo })
    }, 500)
  } catch (error) {
    ElMessage.error('获取用户信息失败')
  }
}

// 保存个人资料
const saveProfile = async () => {
  saving.value = true
  try {
    // 模拟API请求，实际项目中替换为真实API
    // await userApi.updateUserInfo(userInfo)

    // 模拟数据
    setTimeout(() => {
      Object.assign(originalUserInfo, { ...userInfo })
      ElMessage.success('个人资料保存成功')
      saving.value = false
    }, 1000)
  } catch (error) {
    ElMessage.error('保存个人资料失败')
    saving.value = false
  }
}

// 重置表单
const resetForm = () => {
  Object.assign(userInfo, { ...originalUserInfo })
  ElMessage.info('表单已重置')
}

// 跳转到修改密码页面
const goToChangePassword = () => {
  router.push('/app/user/change-password')
}

// 跳转到绑定手机号页面
const goToBindPhone = () => {
  router.push('/app/user/bind-phone')
}

// 跳转到绑定邮箱页面
const goToBindEmail = () => {
  router.push('/app/user/bind-email')
}
</script>

<style scoped>
.profile-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  margin-bottom: 20px;
  padding: 15px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.page-header h1 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

/* 个人资料卡片 */
.profile-card {
  margin-bottom: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

/* 头像部分 */
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #eee;
}

.user-avatar {
  margin-bottom: 15px;
  cursor: pointer;
  transition: transform 0.3s;
}

.user-avatar:hover {
  transform: scale(1.1);
}

/* 表单样式 */
.profile-form {
  max-width: 600px;
  margin: 0 auto;
}

.profile-form .el-form-item {
  margin-bottom: 20px;
}

/* 账户安全卡片 */
.security-card {
  margin-bottom: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

/* 安全项 */
.security-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f9f9f9;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.security-item:hover {
  background: #f0f0f0;
}

.security-info h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
}

.security-info p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .profile-container {
    padding: 10px;
  }

  .page-header {
    padding: 10px 15px;
  }

  .profile-form {
    max-width: 100%;
  }

  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
