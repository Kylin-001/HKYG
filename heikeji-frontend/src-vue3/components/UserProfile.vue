<!-- src/components/UserProfile.vue -->
<template>
  <div class="user-profile">
    <el-card class="profile-card" v-loading="loading">
      <template #header>
        <div class="card-header">
          <h3>用户信息</h3>
          <el-button type="primary" size="small" @click="onEdit"> 编辑 </el-button>
        </div>
      </template>

      <div class="profile-content">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="avatar-section">
              <el-avatar :size="80" :src="userInfo.avatar" @error="onAvatarError">
                {{ userInitials }}
              </el-avatar>
              <el-button class="avatar-upload" size="small" @click="onUploadAvatar">
                更换头像
              </el-button>
            </div>
          </el-col>

          <el-col :span="16">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="用户名">
                {{ userInfo.nickname || '未设置' }}
              </el-descriptions-item>
              <el-descriptions-item label="学号">
                {{ userInfo.studentId || '未绑定' }}
              </el-descriptions-item>
              <el-descriptions-item label="邮箱">
                {{ userInfo.email || '未设置' }}
              </el-descriptions-item>
              <el-descriptions-item label="手机号">
                {{ userInfo.phone || '未绑定' }}
              </el-descriptions-item>
              <el-descriptions-item label="注册时间">
                {{ formatDate(userInfo.createdAt) }}
              </el-descriptions-item>
              <el-descriptions-item label="最后登录">
                {{ formatDate(userInfo.lastLoginAt) }}
              </el-descriptions-item>
            </el-descriptions>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import type { UserInfo } from '@/types/user'

// 响应式数据
const loading = ref(false)
const userInfo = ref<UserInfo>({
  id: 0,
  nickname: '',
  studentId: '',
  email: '',
  phone: '',
  avatar: '',
  createdAt: new Date(),
  lastLoginAt: new Date(),
})

// 计算属性
const userInitials = computed(() => {
  const name = userInfo.value.nickname || '黑科易购用户'
  return name.substring(0, 2).toUpperCase()
})

// 方法
const loadUserInfo = async () => {
  loading.value = true
  try {
    // TODO: 调用 API 获取用户信息
    // const response = await getUserInfo()
    // userInfo.value = response.data
    await new Promise(resolve => setTimeout(resolve, 1000)) // 模拟 API 调用
  } catch (error) {
    ElMessage.error('加载用户信息失败')
    console.error('加载用户信息失败:', error)
  } finally {
    loading.value = false
  }
}

const onEdit = () => {
  ElMessage.info('编辑功能待实现')
}

const onUploadAvatar = () => {
  ElMessage.info('头像上传功能待实现')
}

const onAvatarError = () => {
  userInfo.value.avatar = '/images/default-avatar.png'
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// 生命周期
onMounted(() => {
  loadUserInfo()
})
</script>

<style lang="scss" scoped>
.user-profile {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .profile-card {
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        color: #303133;
      }
    }

    .profile-content {
      .avatar-section {
        text-align: center;

        .avatar-upload {
          margin-top: 16px;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .user-profile {
    padding: 10px;

    .profile-card {
      .profile-content {
        .el-row {
          .el-col {
            margin-bottom: 20px;
          }
        }
      }
    }
  }
}
</style>
