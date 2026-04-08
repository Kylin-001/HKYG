<template>
  <div class="page min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      <h1 class="text-2xl font-bold text-text-primary mb-6">账户设置</h1>

      <div class="max-w-3xl space-y-5">
        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h3 class="font-bold text-text-primary flex items-center gap-2">
              <span class="w-1 h-5 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full"></span>基本信息
            </h3>
          </div>
          <div class="divide-y divide-gray-50">
            <div class="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer group" @click="showAvatarModal = true">
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500 w-20">头像</span>
                <div class="flex items-center gap-3">
                  <img :src="userInfo.avatar" class="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-indigo-200 transition-all" />
                  <el-icon class="text-gray-300 group-hover:text-indigo-400 transition-colors"><ArrowRight /></el-icon>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer group" @click="showEditField('nickname')">
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500 w-20">昵称</span>
                <div class="flex items-center gap-3">
                  <span class="text-sm text-text-primary">{{ userInfo.nickname }}</span>
                  <el-icon class="text-gray-300 group-hover:text-indigo-400 transition-colors"><ArrowRight /></el-icon>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer group" @click="showEditField('email')">
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500 w-20">邮箱</span>
                <div class="flex items-center gap-3">
                  <span class="text-sm text-text-primary">{{ userInfo.email || '未绑定' }}</span>
                  <el-icon class="text-gray-300 group-hover:text-indigo-400 transition-colors"><ArrowRight /></el-icon>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between px-6 py-4">
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500 w-20">手机号</span>
                <span class="text-sm text-text-primary">{{ userInfo.phone }}</span>
              </div>
              <button class="text-xs text-indigo-500 hover:text-indigo-600 font-medium">更换</button>
            </div>
            <div class="flex items-center justify-between px-6 py-4">
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500 w-20">学号</span>
                <span class="text-sm text-text-primary font-mono">{{ userInfo.studentId }}</span>
              </div>
              <span class="px-2 py-0.5 rounded bg-green-50 text-green-600 text-[10px] font-medium">已认证</span>
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h3 class="font-bold text-text-primary flex items-center gap-2">
              <span class="w-1 h-5 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full"></span>安全设置
            </h3>
          </div>
          <div class="divide-y divide-gray-50">
            <div class="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer group">
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500 w-28">登录密码</span>
                <span class="text-sm text-text-primary">••••••••</span>
              </div>
              <button @click="showPasswordModal = true" class="text-xs text-indigo-500 hover:text-indigo-600 font-medium">修改</button>
            </div>
            <div class="flex items-center justify-between px-6 py-4">
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500 w-28">支付密码</span>
                <span :class="['text-sm', settings.hasPayPassword ? 'text-text-primary' : 'text-gray-400']">
                  {{ settings.hasPayPassword ? '已设置' : '未设置' }}
                </span>
              </div>
              <button class="text-xs text-indigo-500 hover:text-indigo-600 font-medium">{{ settings.hasPayPassword ? '修改' : '设置' }}</button>
            </div>
            <div class="flex items-center justify-between px-6 py-4">
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500 w-28">两步验证</span>
                <span class="text-sm text-emerald-500 text-xs">已开启 (短信)</span>
              </div>
              <el-switch v-model="settings.twoFactorAuth" active-color="#6366f1" />
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h3 class="font-bold text-text-primary flex items-center gap-2">
              <span class="w-1 h-5 bg-gradient-to-b from-orange-400 to-red-400 rounded-full"></span>通知设置
            </h3>
          </div>
          <div class="divide-y divide-gray-50">
            <div class="flex items-center justify-between px-6 py-4">
              <div>
                <p class="text-sm text-text-primary">订单消息推送</p>
                <p class="text-xs text-gray-400 mt-0.5">订单状态变更、物流更新等通知</p>
              </div>
              <el-switch v-model="settings.orderNotify" active-color="#6366f1" />
            </div>
            <div class="flex items-center justify-between px-6 py-4">
              <div>
                <p class="text-sm text-text-primary">活动提醒</p>
                <p class="text-xs text-gray-400 mt-0.5">校园活动开始前提醒</p>
              </div>
              <el-switch v-model="settings.activityNotify" active-color="#6366f1" />
            </div>
            <div class="flex items-center justify-between px-6 py-4">
              <div>
                <p class="text-sm text-text-primary">社区互动通知</p>
                <p class="text-xs text-gray-400 mt-0.5">评论回复、点赞、私信等</p>
              </div>
              <el-switch v-model="settings.communityNotify" active-color="#6366f1" />
            </div>
            <div class="flex items-center justify-between px-6 py-4">
              <div>
                <p class="text-sm text-text-primary">营销消息</p>
                <p class="text-xs text-gray-400 mt-0.5">优惠活动、新品推荐等</p>
              </div>
              <el-switch v-model="settings.promoNotify" active-color="#6366f1" />
            </div>
          </div>
        </div>

        <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h3 class="font-bold text-text-primary flex items-center gap-2">
              <span class="w-1 h-5 bg-gradient-to-b from-teal-400 to-cyan-400 rounded-full"></span>其他
            </h3>
          </div>
          <div class="divide-y divide-gray-50">
            <div class="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer group">
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500 w-28">清除缓存</span>
                <span class="text-sm text-gray-400">当前缓存 23.5 MB</span>
              </div>
              <button @click="clearCache" class="text-xs text-indigo-500 hover:text-indigo-600 font-medium">清除</button>
            </div>
            <div class="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer group">
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500 w-28">关于我们</span>
                <span class="text-sm text-gray-400">版本 1.0.0</span>
              </div>
              <el-icon class="text-gray-300 group-hover:text-indigo-400 transition-colors"><ArrowRight /></el-icon>
            </div>
            <div class="flex items-center justify-between px-6 py-4 hover:bg-gray-50/50 transition-colors cursor-pointer group">
              <div class="flex items-center gap-4">
                <span class="text-sm text-gray-500 w-28">隐私政策</span>
              </div>
              <el-icon class="text-gray-300 group-hover:text-indigo-400 transition-colors"><ArrowRight /></el-icon>
            </div>
            <div class="flex items-center justify-between px-6 py-4 hover:bg-red-50/30 transition-colors cursor-pointer" @click="handleLogout">
              <div class="flex items-center gap-4">
                <span class="text-sm text-red-500 w-28 font-medium">退出登录</span>
              </div>
              <el-icon class="text-red-400"><SwitchButton /></el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAvatarModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="showAvatarModal = false">
          <div class="bg-white rounded-3xl p-8 text-center shadow-2xl animate-scale-in max-w-sm mx-4">
            <img :src="userInfo.avatar" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-indigo-100" />
            <h3 class="font-bold text-text-primary mb-2">更换头像</h3>
            <p class="text-sm text-gray-400 mb-6">支持 JPG、PNG 格式，建议尺寸不小于 200x200</p>
            <div class="border-2 border-dashed border-gray-200 rounded-xl p-6 mb-4 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer">
              <el-icon :size="32" class="text-gray-300 mb-2"><Upload /></el-icon>
              <p class="text-sm text-gray-400">点击上传图片</p>
            </div>
            <button @click="showAvatarModal = false" class="px-8 py-2.5 rounded-full bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors">
              关闭
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showEditModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="showEditModal = false">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <h3 class="text-lg font-bold text-text-primary mb-5">编辑{{ editFieldLabel }}</h3>
            <el-input v-model="editValue" :placeholder="'请输入' + editFieldLabel" size="large" @keyup.enter="saveField" />
            <div class="flex gap-3 mt-6">
              <button @click="showEditModal = false" class="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">取消</button>
              <button @click="saveField" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md">保存</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPasswordModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="showPasswordModal = false">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <h3 class="text-lg font-bold text-text-primary mb-5">修改登录密码</h3>
            <div class="space-y-4">
              <el-input v-model="pwdForm.oldPwd" type="password" placeholder="请输入当前密码" size="large" show-password />
              <el-input v-model="pwdForm.newPwd" type="password" placeholder="请输入新密码（至少8位）" size="large" show-password />
              <el-input v-model="pwdForm.confirmPwd" type="password" placeholder="请确认新密码" size="large" show-password />
            </div>
            <div class="flex gap-3 mt-6">
              <button @click="showPasswordModal = false" class="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">取消</button>
              <button @click="changePassword" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md">确认修改</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ArrowRight, SwitchButton, Upload } from '@element-plus/icons-vue'

const showAvatarModal = ref(false)
const showEditModal = ref(false)
const showPasswordModal = ref(false)
const editingField = ref('')
const editValue = ref('')

const userInfo = reactive({
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=33&size=200',
  nickname: '科小易',
  email: 'zhangsan@hkust.edu.cn',
  phone: '138****8888',
  studentId: '2023010****'
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

const editFieldLabel = computed(() => {
  const map: Record<string, string> = { nickname: '昵称', email: '邮箱' }
  return map[editingField.value] || ''
})

function showEditField(field: string) {
  editingField.value = field
  editValue.value = field === 'nickname' ? userInfo.nickname : (userInfo.email || '')
  showEditModal.value = true
}

function saveField() {
  if (!editValue.value.trim()) return
  if (editingField.value === 'nickname') userInfo.nickname = editValue.value
  else if (editingField.value === 'email') userInfo.email = editValue.value
  showEditModal.value = false
  ElMessage.success('保存成功')
}

function changePassword() {
  if (!pwdForm.oldPwd || !pwdForm.newPwd) { ElMessage.warning('请填写完整信息'); return }
  if (pwdForm.newPwd.length < 8) { ElMessage.warning('新密码至少8位'); return }
  if (pwdForm.newPwd !== pwdForm.confirmPwd) { ElMessage.warning('两次密码不一致'); return }
  showPasswordModal.value = false
  Object.assign(pwdForm, { oldPwd: '', newPwd: '', confirmPwd: '' })
  ElMessage.success('密码修改成功')
}

function clearCache() {
  ElMessage.success('缓存已清除（23.5 MB）')
}

function handleLogout() {
  ElMessageBox.confirm('确定要退出登录吗？', '退出登录', { confirmButtonText: '确认退出', cancelButtonText: '取消', type: 'warning' })
    .then(() => { ElMessage.success('已退出登录'); setTimeout(() => window.location.href = '/login', 1500) }).catch(() => {})
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-scale-in { animation: scaleIn 0.25s ease-out forwards; }
</style>
