<template>
  <div class="page min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      <h1 class="text-2xl font-bold text-text-primary mb-6">宿舍服务</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-5">
          <div class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
            <div class="absolute right-0 top-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
            <div class="absolute left-20 bottom-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2"></div>
            <div class="relative z-10 flex items-center justify-between">
              <div>
                <p class="text-sm opacity-80 mb-1">我的宿舍</p>
                <h2 class="text-2xl font-bold">{{ dormInfo.building }} {{ dormInfo.room }}</h2>
                <p class="text-sm mt-2 opacity-90">{{ dormInfo.address }}</p>
              </div>
              <div class="text-right">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-2">
                  <span class="text-3xl">🏠</span>
                </div>
                <p class="text-xs opacity-80">入住 {{ dormInfo.moveInDate }}</p>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div v-for="quick in quickActions" :key="quick.title"
              @click="handleQuickAction(quick)"
              class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5 cursor-pointer hover:border-indigo-200 hover:shadow-lg transition-all group">
              <div :class="['w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110', quick.bgColor]">
                <el-icon :size="24" :class="quick.iconColor"><component :is="quick.icon" /></el-icon>
              </div>
              <h4 class="font-semibold text-text-primary text-sm mb-1">{{ quick.title }}</h4>
              <p class="text-xs text-gray-400 leading-relaxed">{{ quick.desc }}</p>
            </div>
          </div>

          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h3 class="font-bold text-text-primary flex items-center gap-2">
                <span class="w-1 h-5 bg-gradient-to-b from-orange-400 to-red-400 rounded-full"></span>报修记录
              </h3>
              <button @click="showRepairModal = true" class="text-sm text-indigo-500 hover:text-indigo-600 font-medium">+ 新增报修</button>
            </div>
            <div class="divide-y divide-gray-50">
              <div v-for="repair in repairs" :key="repair.id" class="px-6 py-4 hover:bg-gray-50/30 transition-colors">
                <div class="flex items-start justify-between mb-2">
                  <div class="flex items-center gap-2">
                    <h4 class="font-medium text-sm text-text-primary">{{ repair.title }}</h4>
                    <span :class="['px-2 py-0.5 rounded-full text-[10px] font-medium', repairStatusStyle(repair.status)]">
                      {{ repairStatusText(repair.status) }}
                    </span>
                  </div>
                  <span class="text-xs text-gray-400">{{ repair.date }}</span>
                </div>
                <p class="text-xs text-gray-500 mb-2 line-clamp-1">{{ repair.description }}</p>
                <div class="flex items-center gap-3 text-[11px] text-gray-400">
                  <span>工单号: {{ repair.ticketNo }}</span>
                  <span v-if="repair.handler">处理人: {{ repair.handler }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-100">
              <h3 class="font-bold text-text-primary flex items-center gap-2">
                <span class="w-1 h-5 bg-gradient-to-b from-teal-400 to-cyan-400 rounded-full"></span>电费 & 水费
              </h3>
            </div>
            <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5 border border-yellow-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">⚡</span>
                    <div>
                      <p class="font-bold text-text-primary">电费余额</p>
                      <p class="text-xs text-gray-400">剩余电量约可用 15 天</p>
                    </div>
                  </div>
                  <button @click="recharge('electric')" class="px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs font-medium hover:bg-amber-600 transition-colors">
                    充值
                  </button>
                </div>
                <p class="text-3xl font-bold text-amber-600">¥{{ utilityData.electricBalance.toFixed(2) }}</p>
                <div class="mt-3 pt-3 border-t border-yellow-100/60">
                  <div class="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>本月用电</span><span>{{ utilityData.electricUsed }} 度</span>
                  </div>
                  <div class="w-full h-1.5 bg-yellow-100 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full" style="width: 65%"></div>
                  </div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <span class="text-2xl">💧</span>
                    <div>
                      <p class="font-bold text-text-primary">水费余额</p>
                      <p class="text-xs text-gray-400">本月已用 {{ utilityData.waterUsed }} 吨</p>
                    </div>
                  </div>
                  <button @click="recharge('water')" class="px-3 py-1.5 rounded-full bg-blue-500 text-white text-xs font-medium hover:bg-blue-600 transition-colors">
                    充值
                  </button>
                </div>
                <p class="text-3xl font-bold text-blue-600">¥{{ utilityData.waterBalance.toFixed(2) }}</p>
                <div class="mt-3 pt-3 border-t border-blue-100/60">
                  <div class="flex justify-between text-xs text-gray-500 mb-1.5">
                    <span>本月用水</span><span>{{ utilityData.waterUsed }} 吨</span>
                  </div>
                  <div class="w-full h-1.5 bg-blue-100 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" style="width: 40%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="space-y-5">
          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5">
            <h3 class="font-bold text-text-primary mb-4 flex items-center gap-2">
              <span class="w-1 h-5 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-full"></span>室友信息
            </h3>
            <div class="space-y-3">
              <div v-for="mate in roommates" :key="mate.name"
                class="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                <img :src="mate.avatar" class="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" />
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-text-primary">{{ mate.name }}
                    <span v-if="mate.isMe" class="ml-1.5 px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-600 text-[10px]">我</span>
                  </p>
                  <p class="text-xs text-gray-400 truncate">{{ mate.department }} · {{ mate.major }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-100 p-5">
            <h3 class="font-bold text-rose-700 mb-3">📢 宿管通知</h3>
            <ul class="space-y-2.5 text-sm text-rose-800/80">
              <li v-for="(notice, i) in dormNotices" :key="i" class="flex items-start gap-2">
                <span class="w-1.5 h-1.5 bg-rose-400 rounded-full mt-1.5 shrink-0"></span>
                <span>{{ notice }}</span>
              </li>
            </ul>
          </div>

          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5">
            <h3 class="font-bold text-text-primary mb-4 flex items-center gap-2">
              <span class="w-1 h-5 bg-gradient-to-b from-violet-400 to-purple-400 rounded-full"></span>快捷服务
            </h3>
            <div class="space-y-2.5">
              <button v-for="service in extraServices" :key="service"
                class="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 text-sm font-medium text-gray-600 transition-all group">
                <span>{{ service.icon }}</span>
                <span class="flex-1 text-left">{{ service.label }}</span>
                <el-icon class="text-gray-300 group-hover:text-indigo-400 transition-colors"><ArrowRight /></el-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showRepairModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="showRepairModal = false">
          <div class="bg-white rounded-3xl shadow-2xl max-w-md w-full animate-scale-in">
            <div class="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 class="text-lg font-bold text-text-primary">新增报修</h3>
              <button @click="showRepairModal = false" class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center"><el-icon><Close /></el-icon></button>
            </div>
            <div class="p-6 space-y-4">
              <el-form label-position="top">
                <el-form-item label="报修类型">
                  <el-select v-model="repairForm.type" placeholder="选择类型" class="w-full">
                    <el-option label="水电设施" value="utility" />
                    <el-option label="家具损坏" value="furniture" />
                    <el-option label="网络问题" value="network" />
                    <el-option label="门窗锁具" value="door" />
                    <el-option label="其他" value="other" />
                  </el-select>
                </el-form-item>
                <el-form-item label="问题描述">
                  <el-input v-model="repairForm.desc" type="textarea" :rows="3" placeholder="请详细描述故障情况..." />
                </el-form-item>
                <el-form-item label="上传图片（选填）">
                  <div class="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-indigo-300 transition-colors cursor-pointer">
                    <el-icon :size="28" class="text-gray-300 mb-1"><Camera /></el-icon>
                    <p class="text-xs text-gray-400">点击上传照片</p>
                  </div>
                </el-form-item>
                <el-form-item label="方便维修时间">
                  <el-input v-model="repairForm.preferredTime" placeholder="如：工作日下午" />
                </el-form-item>
              </el-form>
            </div>
            <div class="p-5 border-t border-gray-100 bg-gray-50/50 flex gap-3">
              <button @click="showRepairModal = false" class="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50">取消</button>
              <button @click="submitRepair" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-md">提交报修</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Close, ArrowRight, Camera, Tools, SetUp, Document, Bell, DataLine } from '@element-plus/icons-vue'
import { useCampusStore } from '@/stores/campus'

const campusStore = useCampusStore()

const showRepairModal = ref(false)

const dormInfo = computed(() => ({
  building: campusStore.dormitory?.building || '12号楼',
  room: campusStore.dormitory?.room || '305室',
  address: campusStore.dormitory?.address || '学生公寓12号楼3层北侧',
  moveInDate: campusStore.dormitory?.moveInDate || '2023年9月',
  floor: campusStore.dormitory?.floor || 3,
  type: campusStore.dormitory?.type || '四人间'
}))

const quickActions = [
  { title: '在线报修', desc: '快速提交维修申请，跟踪处理进度', icon: Tools, bgColor: 'bg-orange-100', iconColor: 'text-orange-500' },
  { title: '门禁管理', desc: '临时密码、访客授权、开门记录', icon: SetUp, bgColor: 'bg-blue-100', iconColor: 'text-blue-500' },
  { title: '卫生评分', desc: '查看本周宿舍卫生检查结果', icon: Document, bgColor: 'bg-green-100', iconColor: 'text-green-500' }
]

const repairs = ref([
  { id: 1, title: '空调制冷效果差', description: '开启制冷模式后出风温度偏高，疑似缺氟或滤网堵塞', status: 'processing', date: '2026-03-28', ticketNo: 'BX20260328001', handler: '王师傅' },
  { id: 2, title: '卫生间水龙头漏水', description: '左侧水龙头拧紧后仍有滴水，需要更换密封圈', status: 'completed', date: '2026-03-15', ticketNo: 'BX20260315002', handler: '李师傅' },
  { id: 3, title: '衣柜门铰链松动', description: '上铺右侧衣柜门开合时异响，铰链螺丝松动', status: 'completed', date: '2026-02-20', ticketNo: 'BX20260220003', handler: '张师傅' }
])

const utilityData = computed(() => ({
  electricBalance: campusStore.dormitory?.electricBalance || 45.68,
  electricUsed: campusStore.dormitory?.electricUsed || 128,
  waterBalance: campusStore.dormitory?.waterBalance || 23.45,
  waterUsed: campusStore.dormitory?.waterUsed || 12
}))

const roommates = [
  { name: '张三', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=33&size=80', department: '计算机学院', major: '软件工程', isMe: true },
  { name: '李四', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=12&size=80', department: '计算机学院', major: '软件工程', isMe: false },
  { name: '王五', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=53&size=80', department: '计算机学院', major: '人工智能', isMe: false },
  { name: '赵六', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=68&size=80', department: '计算机学院', major: '网络安全', isMe: false }
]

const dormNotices = [
  '本周三上午9:00-11:00进行消防安全检查，请在寝室留人配合',
  '夏季空调开放时间为每日18:00-次日08:00，请节约用电',
  '新学期门禁卡续期已自动完成，有效期至2027年1月',
  '禁止在宿舍使用大功率电器，违者将通报批评并取消评优资格'
]

const extraServices = [
  { icon: '🔑', label: '临时密码生成' },
  { icon: '👥', label: '访客来访登记' },
  { icon: '📋', label: '物品借用登记' },
  { icon: '📊', label: '住宿信息变更' },
  { icon: '💬', label: '联系宿管阿姨' },
  { icon: '📖', label: '宿舍管理规定' }
]

const repairForm = ref({ type: '', desc: '', preferredTime: '' })

function handleQuickAction(action: any) {
  if (action.title === '在线报修') showRepairModal.value = true
  else ElMessage.info(`${action.title} 功能开发中...`)
}

function recharge(type: string) {
  ElMessage.success(`跳转到${type === 'electric' ? '电费' : '水费'}充值页面...`)
}

function submitRepair() {
  if (!repairForm.value.type || !repairForm.value.desc) { ElMessage.warning('请填写完整信息'); return }
  showRepairModal.value = false
  ElMessage.success('报修单已提交，预计24小时内处理')
  repairForm.value = { type: '', desc: '', preferredTime: '' }
}

function repairStatusText(status: string): string {
  const map: Record<string, string> = { pending: '待处理', processing: '处理中', completed: '已完成', rejected: '已驳回' }
  return map[status] || status
}

function repairStatusStyle(status: string): string {
  const map: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-700', processing: 'bg-blue-100 text-blue-700', completed: 'bg-emerald-100 text-emerald-700', rejected: 'bg-red-100 text-red-700' }
  return map[status] || ''
}

onMounted(async () => {
  try {
    await campusStore.fetchDormitory()
  } catch {
    ElMessage.error('获取宿舍信息失败')
  }
})
</script>

<style scoped>
.line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-scale-in { animation: scaleIn 0.25s ease-out forwards; }
</style>
