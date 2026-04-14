<template>
  <div class="settings-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="header-icon">
          <el-icon :size="28" color="#fff"><Setting /></el-icon>
        </div>
        <div class="header-text">
          <h1>账户设置</h1>
          <p>管理您的个人信息和偏好设置</p>
        </div>
      </div>

      <!-- 用户信息卡片 -->
      <div class="user-card">
        <div class="user-info">
          <div class="avatar-wrapper" @click="handleAvatarClick">
            <img :src="userInfo.avatar" class="avatar" width="88" height="88" />
            <div class="avatar-overlay">
              <el-icon :size="20" color="#fff"><Camera /></el-icon>
            </div>
          </div>
          <div class="user-details">
            <h2>{{ userInfo.nickname }}</h2>
            <p class="email">{{ userInfo.email }}</p>
            <div class="tags">
              <span class="tag tag-green">
                <el-icon :size="12"><CircleCheck /></el-icon>
                已认证
              </span>
              <span class="tag tag-blue">学生用户</span>
            </div>
          </div>
          <button class="edit-btn" @click="showEditField('nickname')">编辑资料</button>
        </div>
      </div>

      <div class="main-grid">
        <!-- 左侧内容 -->
        <div class="left-column">
          <!-- 基本信息 -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-icon blue">
                <el-icon :size="16" color="#fff"><User /></el-icon>
              </div>
              <h3>基本信息</h3>
            </div>
            <div class="section-body">
              <div class="setting-item" @click="showEditField('nickname')">
                <div class="item-left">
                  <div class="item-icon blue-light">
                    <el-icon :size="18" color="#3b82f6"><User /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label">昵称</p>
                    <p class="value">{{ userInfo.nickname }}</p>
                  </div>
                </div>
                <el-icon class="arrow" :size="18"><ArrowRight /></el-icon>
              </div>

              <div class="setting-item" @click="showEditField('email')">
                <div class="item-left">
                  <div class="item-icon purple-light">
                    <el-icon :size="18" color="#8b5cf6"><Message /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label">邮箱</p>
                    <p class="value">{{ userInfo.email || '未绑定' }}</p>
                  </div>
                </div>
                <el-icon class="arrow" :size="18"><ArrowRight /></el-icon>
              </div>

              <div class="setting-item">
                <div class="item-left">
                  <div class="item-icon green-light">
                    <el-icon :size="18" color="#10b981"><Phone /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label">手机号</p>
                    <p class="value">{{ userInfo.phone }}</p>
                  </div>
                </div>
                <button class="action-btn" @click="showPhoneModal = true">更换</button>
              </div>

              <div class="setting-item">
                <div class="item-left">
                  <div class="item-icon orange-light">
                    <el-icon :size="18" color="#f59e0b"><OfficeBuilding /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label">学号</p>
                    <p class="value">{{ userInfo.studentId }}</p>
                  </div>
                </div>
                <span class="status-badge">已认证</span>
              </div>
            </div>
          </div>

          <!-- 安全设置 -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-icon purple">
                <el-icon :size="16" color="#fff"><Lock /></el-icon>
              </div>
              <h3>安全设置</h3>
            </div>
            <div class="section-body">
              <div class="setting-item" @click="showPasswordModal = true">
                <div class="item-left">
                  <div class="item-icon red-light">
                    <el-icon :size="18" color="#ef4444"><Lock /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">登录密码</p>
                    <p class="desc">定期更换密码可以保护账户安全</p>
                  </div>
                </div>
                <button class="action-btn">修改</button>
              </div>

              <div class="setting-item">
                <div class="item-left">
                  <div class="item-icon pink-light">
                    <el-icon :size="18" color="#ec4899"><Key /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">支付密码</p>
                    <p class="desc">{{ settings.hasPayPassword ? '已设置，保障支付安全' : '未设置，建议立即设置' }}</p>
                  </div>
                </div>
                <button class="action-btn">{{ settings.hasPayPassword ? '修改' : '设置' }}</button>
              </div>

              <div class="setting-item">
                <div class="item-left">
                  <div class="item-icon teal-light">
                    <el-icon :size="18" color="#14b8a6"><Lock /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">两步验证</p>
                    <p class="desc">已开启短信验证</p>
                  </div>
                </div>
                <el-switch v-model="settings.twoFactorAuth" active-color="#6366f1" />
              </div>
            </div>
          </div>

          <!-- 通知设置 -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-icon orange">
                <el-icon :size="16" color="#fff"><Bell /></el-icon>
              </div>
              <h3>通知设置</h3>
            </div>
            <div class="section-body">
              <div class="setting-item">
                <div class="item-left">
                  <div class="item-icon blue-light">
                    <el-icon :size="18" color="#3b82f6"><ShoppingCart /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">订单消息推送</p>
                    <p class="desc">订单状态变更、物流更新等</p>
                  </div>
                </div>
                <el-switch v-model="settings.orderNotify" active-color="#6366f1" />
              </div>

              <div class="setting-item">
                <div class="item-left">
                  <div class="item-icon purple-light">
                    <el-icon :size="18" color="#8b5cf6"><Calendar /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">活动提醒</p>
                    <p class="desc">校园活动开始前提醒</p>
                  </div>
                </div>
                <el-switch v-model="settings.activityNotify" active-color="#6366f1" />
              </div>

              <div class="setting-item">
                <div class="item-left">
                  <div class="item-icon green-light">
                    <el-icon :size="18" color="#10b981"><ChatDotRound /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">社区互动通知</p>
                    <p class="desc">评论回复、点赞、私信等</p>
                  </div>
                </div>
                <el-switch v-model="settings.communityNotify" active-color="#6366f1" />
              </div>

              <div class="setting-item">
                <div class="item-left">
                  <div class="item-icon rose-light">
                    <el-icon :size="18" color="#f43f5e"><Present /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">营销消息</p>
                    <p class="desc">优惠活动、新品推荐等</p>
                  </div>
                </div>
                <el-switch v-model="settings.promoNotify" active-color="#6366f1" />
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="right-column">
          <div class="section-card">
            <div class="section-header">
              <div class="section-icon teal">
                <el-icon :size="16" color="#fff"><MoreFilled /></el-icon>
              </div>
              <h3>其他</h3>
            </div>
            <div class="section-body">
              <div class="setting-item" @click="clearCache">
                <div class="item-left">
                  <div class="item-icon gray-light">
                    <el-icon :size="16" color="#6b7280"><Delete /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">清除缓存</p>
                    <p class="desc">当前缓存 23.5 MB</p>
                  </div>
                </div>
                <span class="text-link">清除</span>
              </div>

              <div class="setting-item" @click="goToAbout">
                <div class="item-left">
                  <div class="item-icon gray-light">
                    <el-icon :size="16" color="#6b7280"><InfoFilled /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">关于我们</p>
                    <p class="desc">版本 1.0.0</p>
                  </div>
                </div>
                <el-icon class="arrow" :size="16"><ArrowRight /></el-icon>
              </div>

              <div class="setting-item" @click="goToPrivacy">
                <div class="item-left">
                  <div class="item-icon gray-light">
                    <el-icon :size="16" color="#6b7280"><Document /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">隐私政策</p>
                  </div>
                </div>
                <el-icon class="arrow" :size="16"><ArrowRight /></el-icon>
              </div>
            </div>
          </div>

          <div class="logout-card">
            <button class="logout-btn" @click="handleLogout">
              <el-icon :size="18"><SwitchButton /></el-icon>
              退出登录
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐藏的文件输入框 -->
    <input ref="fileInputRef" type="file" accept="image/*" style="display: none;" @change="handleFileChange" />

    <!-- 头像查看弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAvatarModal" class="modal-overlay" @click.self="showAvatarModal = false">
          <div class="modal-content">
            <img :src="userInfo.avatar" class="modal-avatar" />
            <h3>更换头像</h3>
            <p>支持 JPG、PNG 格式，建议尺寸不小于 200x200</p>
            <div class="upload-area" @click="triggerFileInput">
              <el-icon :size="32" color="#cbd5e1"><Upload /></el-icon>
              <p>点击上传图片</p>
            </div>
            <button class="btn-secondary" @click="showAvatarModal = false">关闭</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 头像上传裁剪弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAvatarUploadDialog" class="modal-overlay" @click.self="closeAvatarUploadDialog">
          <div class="modal-content" style="max-width: 400px;">
            <h3>预览头像</h3>
            <p>将自动居中裁剪为正方形</p>
            <div style="padding: 20px 0;">
              <div style="position: relative; margin: 0 auto; width: 200px; height: 200px; border-radius: 16px; overflow: hidden; background: #f3f4f6; display: flex; align-items: center; justify-content: center;">
                <img v-if="previewUrl" :src="previewUrl" alt="头像预览" style="width: 100%; height: 100%; object-fit: cover;" />
              </div>
            </div>
            <div style="display: flex; gap: 12px;">
              <button class="btn-secondary" @click="reselectImage" :disabled="isUploading">
                <el-icon :size="16"><RefreshRight /></el-icon>
                重新选择
              </button>
              <button class="btn-primary" @click="confirmUpload" :disabled="isUploading">
                <el-icon v-if="isUploading" class="animate-spin" :size="16"><RefreshRight /></el-icon>
                <el-icon v-else :size="16"><Check /></el-icon>
                {{ isUploading ? '上传中...' : '确认上传' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
          <div class="modal-content modal-small">
            <h3>编辑{{ editFieldLabel }}</h3>
            <el-input v-model="editValue" :placeholder="'请输入' + editFieldLabel" size="large" />
            <div class="modal-actions">
              <button class="btn-secondary" @click="showEditModal = false">取消</button>
              <button class="btn-primary" @click="saveField">保存</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPasswordModal" class="modal-overlay" @click.self="showPasswordModal = false">
          <div class="modal-content modal-small">
            <h3>修改登录密码</h3>
            <div class="input-group">
              <el-input v-model="pwdForm.oldPwd" type="password" placeholder="请输入当前密码" size="large" show-password />
              <el-input v-model="pwdForm.newPwd" type="password" placeholder="请输入新密码（至少8位）" size="large" show-password />
              <el-input v-model="pwdForm.confirmPwd" type="password" placeholder="请确认新密码" size="large" show-password />
            </div>
            <div class="modal-actions">
              <button class="btn-secondary" @click="showPasswordModal = false">取消</button>
              <button class="btn-primary" @click="changePassword">确认修改</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 更换手机号弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPhoneModal" class="modal-overlay" @click.self="showPhoneModal = false">
          <div class="modal-content modal-small">
            <h3>更换手机号</h3>
            <div class="input-group">
              <el-input v-model="phoneForm.phone" placeholder="请输入新手机号" size="large" maxlength="11">
                <template #prefix>
                  <el-icon><Phone /></el-icon>
                </template>
              </el-input>
              <div class="code-input-row">
                <el-input v-model="phoneForm.code" placeholder="请输入验证码" size="large" maxlength="6">
                  <template #prefix>
                    <el-icon><Key /></el-icon>
                  </template>
                </el-input>
                <button
                  class="btn-send-code"
                  :disabled="codeCountdown > 0 || !isValidPhone"
                  @click="sendPhoneCode"
                >
                  {{ codeCountdown > 0 ? `${codeCountdown}s后重发` : '获取验证码' }}
                </button>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn-secondary" @click="showPhoneModal = false">取消</button>
              <button class="btn-primary" @click="changePhone" :disabled="!canChangePhone">确认更换</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { useUserStore } from '@/stores/user'
import * as userApi from '@/api/user'
import {
  Setting, User, Lock, Bell, ArrowRight, SwitchButton, Upload,
  Camera, CircleCheck, Message, Phone, OfficeBuilding, Key,
  ShoppingCart, Calendar, ChatDotRound, Present, Delete, InfoFilled,
  Document, MoreFilled, RefreshRight, Check
} from '@element-plus/icons-vue'

const userStore = useUserStore()

const showAvatarModal = ref(false)
const showEditModal = ref(false)
const showPasswordModal = ref(false)
const editingField = ref('')
const editValue = ref('')

// ====== 头像上传相关状态 ======
const showAvatarUploadDialog = ref(false)
const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const isUploading = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)
const cropSize = ref(200)

function handleAvatarClick() {
  showAvatarModal.value = true
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过5MB')
    return
  }

  selectedFile.value = file
  previewUrl.value = URL.createObjectURL(file)
  showAvatarUploadDialog.value = true
  showAvatarModal.value = false
  target.value = ''
}

function cropAvatar(): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Canvas context not available'))
        return
      }

      const size = cropSize.value
      canvas.width = size
      canvas.height = size

      const minDim = Math.min(img.width, img.height)
      const sx = (img.width - minDim) / 2
      const sy = (img.height - minDim) / 2

      ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size)

      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to create blob'))
        }
      }, 'image/jpeg', 0.9)
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = previewUrl.value
  })
}

async function confirmUpload() {
  if (!selectedFile.value) return

  try {
    isUploading.value = true
    const croppedBlob = await cropAvatar()
    const croppedFile = new File([croppedBlob], 'avatar.jpg', { type: 'image/jpeg' })
    await userStore.uploadAvatar(croppedFile)
    userInfo.avatar = userStore.user?.avatar || userInfo.avatar
    ElMessage.success('头像更新成功')
    closeAvatarUploadDialog()
  } catch (error) {
    console.error('上传头像失败:', error)
    ElMessage.error('上传头像失败，请重试')
  } finally {
    isUploading.value = false
  }
}

function closeAvatarUploadDialog() {
  showAvatarUploadDialog.value = false
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = ''
  }
  selectedFile.value = null
}

function reselectImage() {
  closeAvatarUploadDialog()
  setTimeout(() => {
    fileInputRef.value?.click()
  }, 100)
}

const userInfo = reactive({
  avatar: computed(() => userStore.user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=33&size=200'),
  nickname: computed(() => userStore.user?.nickname || '未设置昵称'),
  email: computed(() => userStore.user?.email || ''),
  phone: computed(() => userStore.user?.phone || '未绑定手机号'),
  studentId: computed(() => (userStore.user as any)?.studentId || '未认证')
})

const settings = reactive({
  hasPayPassword: true,
  twoFactorAuth: true,
  orderNotify: true,
  activityNotify: true,
  communityNotify: true,
  promoNotify: false
})

const pwdForm = reactive({ oldPwd: '', newPwd: '', confirmPwd: '' })

// 更换手机号相关
const showPhoneModal = ref(false)
const phoneForm = reactive({ phone: '', code: '' })
const codeCountdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// 手机号验证
const isValidPhone = computed(() => {
  return /^1[3-9]\d{9}$/.test(phoneForm.phone)
})

// 是否可以更换手机号
const canChangePhone = computed(() => {
  return isValidPhone.value && phoneForm.code.length === 6
})

// 发送验证码
async function sendPhoneCode() {
  if (!isValidPhone.value) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  try {
    await userApi.sendCode(phoneForm.phone, 'bind')
    // 使用 Message 显示成功提示，更明显
    ElMessage({
      message: `验证码已发送至 ${phoneForm.phone}，请输入6位数字验证码`,
      type: 'success',
      duration: 5000,
      showClose: true,
      customClass: 'phone-code-message'
    })
    // 开始倒计时
    codeCountdown.value = 60
    countdownTimer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0 && countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)
  } catch (err: any) {
    ElMessage.error(err.message || '发送验证码失败')
  }
}

// 更换手机号
async function changePhone() {
  if (!canChangePhone.value) return
  try {
    await userApi.bindPhone(phoneForm.phone, phoneForm.code)
    // 更新本地用户信息
    if (userStore.user) {
      userStore.user.phone = phoneForm.phone
      localStorage.setItem('user', JSON.stringify(userStore.user))
    }
    ElMessage.success('手机号更换成功')
    showPhoneModal.value = false
    // 重置表单
    phoneForm.phone = ''
    phoneForm.code = ''
    codeCountdown.value = 0
    if (countdownTimer) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  } catch (err: any) {
    ElMessage.error(err.message || '更换手机号失败')
  }
}

const editFieldLabel = computed(() => {
  const map: Record<string, string> = { nickname: '昵称', email: '邮箱' }
  return map[editingField.value] || ''
})

function showEditField(field: string) {
  editingField.value = field
  if (field === 'nickname') {
    editValue.value = userInfo.nickname
  } else if (field === 'email') {
    editValue.value = userInfo.email || ''
  } else if (field === 'phone') {
    editValue.value = userInfo.phone || ''
  }
  showEditModal.value = true
}

async function saveField() {
  if (!editValue.value.trim()) return
  try {
    const updateData: any = {}
    if (editingField.value === 'nickname') {
      updateData.nickname = editValue.value
    } else if (editingField.value === 'email') {
      updateData.email = editValue.value
    } else if (editingField.value === 'phone') {
      updateData.phone = editValue.value
    }
    await userStore.updateProfile(updateData)
    showEditModal.value = false
    ElMessage.success('保存成功')
  } catch (err: any) {
    ElMessage.error(err.message || '保存失败')
  }
}

async function changePassword() {
  if (!pwdForm.oldPwd || !pwdForm.newPwd) { ElMessage.warning('请填写完整信息'); return }
  if (pwdForm.newPwd.length < 8) { ElMessage.warning('新密码至少8位'); return }
  if (pwdForm.newPwd !== pwdForm.confirmPwd) { ElMessage.warning('两次密码不一致'); return }
  try {
    await userApi.changePassword(pwdForm.oldPwd, pwdForm.newPwd)
    showPasswordModal.value = false
    Object.assign(pwdForm, { oldPwd: '', newPwd: '', confirmPwd: '' })
    ElMessage.success('密码修改成功')
  } catch (err: any) {
    ElMessage.error(err.message || '密码修改失败')
  }
}

async function clearCache() {
  try {
    // 清除 localStorage 中除登录信息外的数据
    const token = localStorage.getItem('token')
    const user = localStorage.getItem('user')
    localStorage.clear()
    if (token) localStorage.setItem('token', token)
    if (user) localStorage.setItem('user', user)
    
    // 清除 sessionStorage
    sessionStorage.clear()
    
    ElMessage.success('缓存已清除')
  } catch (err) {
    ElMessage.error('清除缓存失败')
  }
}

async function handleLogout() {
  try {
    await ElMessageBox.confirm('确定要退出登录吗？', '退出登录', { confirmButtonText: '确认退出', cancelButtonText: '取消', type: 'warning' })
    // 先执行登出
    await userStore.logout()
    // 显示成功消息
    ElMessage.success('已退出登录')
    // 使用 window.location 强制跳转到首页（确保页面完全刷新）
    window.location.href = '/'
  } catch (err) {
    // 用户取消或其他错误
    console.log('Logout cancelled or error:', err)
  }
}

// 跳转到关于我们页面
function goToAbout() {
  window.open('/about', '_blank')
}

// 跳转到隐私政策页面
function goToPrivacy() {
  window.open('/privacy', '_blank')
}

onMounted(async () => {
  // 获取最新用户信息
  if (userStore.token) {
    try {
      await userStore.fetchUserInfo()
    } catch (err) {
      console.error('获取用户信息失败:', err)
    }
  }
})
</script>

<style scoped>
.settings-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
  padding: 32px 0;
  position: relative;
  overflow: hidden;
}

/* 背景装饰 */
.settings-page::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 800px;
  height: 800px;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.settings-page::after {
  content: '';
  position: absolute;
  bottom: -30%;
  left: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

.container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 16px;
  position: relative;
  z-index: 1;
}

/* 页面标题 - 现代化设计 */
.page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.04);
}

.header-icon {
  width: 56px;
  height: 56px;
  border-radius: 20px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px -5px rgba(99, 102, 241, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-icon:hover {
  transform: scale(1.05) rotate(5deg);
  box-shadow: 0 15px 40px -5px rgba(99, 102, 241, 0.5);
}

.header-text h1 {
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #1e293b 0%, #475569 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.header-text p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
  font-weight: 500;
}

/* 用户信息卡片 - 现代化设计 */
.user-card {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 28px;
  margin-bottom: 28px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 24px;
}

.avatar-wrapper {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.avatar {
  width: 88px;
  height: 88px;
  border-radius: 24px;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar-wrapper:hover .avatar {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(168, 85, 247, 0.8) 100%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(4px);
}

.avatar-wrapper:hover .avatar-overlay {
  opacity: 1;
}

.user-details {
  flex: 1;
}

.user-details h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;
}

.email {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(8px);
}

.tag:hover {
  transform: scale(1.05);
}

.tag-green {
  background: rgba(220, 252, 231, 0.8);
  color: #16a34a;
  border: 1px solid rgba(22, 163, 74, 0.2);
}

.tag-blue {
  background: rgba(224, 231, 255, 0.8);
  color: #4f46e5;
  border: 1px solid rgba(79, 70, 229, 0.2);
}

.edit-btn {
  padding: 12px 24px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
}

/* 主网格布局 */
.main-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 1024px) {
  .main-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.left-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 卡片样式 */
/* 设置卡片 - 现代化设计 */
.section-card {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.5);
  margin-bottom: 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(243, 244, 246, 0.8);
  background: rgba(255, 255, 255, 0.4);
}

.section-icon {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-icon:hover {
  transform: scale(1.1) rotate(5deg);
}

.section-icon.blue {
  background: linear-gradient(135deg, #60a5fa 0%, #4f46e5 100%);
}

.section-icon.purple {
  background: linear-gradient(135deg, #c084fc 0%, #ec4899 100%);
}

.section-icon.orange {
  background: linear-gradient(135deg, #fb923c 0%, #ef4444 100%);
}

.section-icon.teal {
  background: linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%);
}

.section-header h3 {
  font-size: 17px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.2px;
}

.section-body {
  padding: 8px;
}

/* 设置项 - 现代化设计 */
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  margin: 4px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  border: 1px solid transparent;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: rgba(99, 102, 241, 0.1);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transform: translateX(4px);
}

.item-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon.blue-light {
  background: #dbeafe;
}

.item-icon.purple-light {
  background: #ede9fe;
}

.item-icon.green-light {
  background: #d1fae5;
}

.item-icon.orange-light {
  background: #fef3c7;
}

.item-icon.red-light {
  background: #fee2e2;
}

.item-icon.pink-light {
  background: #fce7f3;
}

.item-icon.teal-light {
  background: #ccfbf1;
}

.item-icon.rose-light {
  background: #ffe4e6;
}

.item-icon.gray-light {
  background: #f3f4f6;
}

.item-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.label {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.value {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.label-main {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.desc {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.arrow {
  color: #d1d5db;
  transition: color 0.2s;
}

.setting-item:hover .arrow {
  color: #4f46e5;
}

.action-btn {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #4f46e5;
  background: #e0e7ff;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #c7d2fe;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #16a34a;
  background: #dcfce7;
}

.text-link {
  font-size: 13px;
  font-weight: 500;
  color: #4f46e5;
  cursor: pointer;
}

.text-link:hover {
  color: #4338ca;
}

/* 退出登录 */
.logout-card {
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #fee2e2;
}

.logout-btn {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #ef4444;
  background: #fee2e2;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: #fecaca;
}

/* 弹窗 */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 360px;
  width: 100%;
}

.modal-small {
  max-width: 400px;
  text-align: left;
}

.modal-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  margin: 0 auto 16px;
  object-fit: cover;
  border: 4px solid #e0e7ff;
}

.modal-content h3 {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.modal-content > p {
  font-size: 14px;
  color: #9ca3af;
  margin: 0 0 24px 0;
}

.upload-area {
  border: 2px dashed #e5e7eb;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  cursor: pointer;
  transition: all 0.2s;
}

.upload-area:hover {
  border-color: #4f46e5;
  background: #eef2ff;
}

.upload-area p {
  font-size: 14px;
  color: #9ca3af;
  margin: 8px 0 0 0;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 20px 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-secondary {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);
  transition: box-shadow 0.2s;
}

.btn-primary:hover {
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

/* 验证码输入行 */
.code-input-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.code-input-row .el-input {
  flex: 1;
}

.btn-send-code {
  padding: 0 16px;
  height: 40px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.btn-send-code:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-send-code:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #9ca3af;
}

/* 加载旋转动画 */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 验证码消息样式 - 确保显示在最上层且明显 */
:global(.phone-code-message) {
  z-index: 99999 !important;
  top: 20px !important;
  min-width: 380px !important;
  padding: 15px 20px !important;
}

:global(.phone-code-message .el-message__content) {
  font-size: 15px !important;
  font-weight: 500;
}
</style>