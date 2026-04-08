<template>
  <div class="page min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-text-primary">教室查询</h1>
        <el-button type="primary" round class="!rounded-full !px-5 !bg-[#003B80] hover:!bg-[#002d61]" @click="showBooking = true">
          <el-icon class="mr-1"><Plus /></el-icon>预约教室
        </el-button>
      </div>

      <!-- 视图切换 + 筛选区域 -->
      <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5 mb-6">
        <!-- 视图切换 Tab -->
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <el-radio-group v-model="viewMode" size="default" class="!bg-transparent">
            <el-radio-button value="grid" class="!rounded-lg">
              <el-icon class="mr-1"><Grid /></el-icon>平面图视图
            </el-radio-button>
            <el-radio-button value="list" class="!rounded-lg">
              <el-icon class="mr-1"><List /></el-icon>列表视图
            </el-radio-button>
          </el-radio-group>
          <span class="text-xs text-gray-400">共 {{ filteredRooms.length }} 间教室</span>
        </div>

        <!-- 筛选条件 -->
        <div class="flex flex-col gap-4">
          <!-- 第一行：楼层 + 容量 -->
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500 font-medium whitespace-nowrap">楼层：</span>
              <el-radio-group v-model="filterFloor" size="small" class="!bg-transparent">
                <el-radio-button value="">全部</el-radio-button>
                <el-radio-button v-for="f in [1,2,3,4,5]" :key="f" :value="f">{{ f }}F</el-radio-button>
              </el-radio-group>
            </div>

            <div class="flex items-center gap-2 ml-auto">
              <span class="text-xs text-gray-500 font-medium whitespace-nowrap">容量：</span>
              <el-radio-group v-model="filterCapacity" size="small" class="!bg-transparent">
                <el-radio-button value="">不限</el-radio-button>
                <el-radio-button value="small">&lt;30人</el-radio-button>
                <el-radio-button value="medium">30-60人</el-radio-button>
                <el-radio-button value="large">&gt;60人</el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <!-- 第二行：设备筛选 + 搜索 -->
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500 font-medium whitespace-nowrap">设备：</span>
              <el-checkbox-group v-model="filterEquipment" size="small" class="!bg-transparent">
                <el-checkbox label="投影仪" value="投影仪" />
                <el-checkbox label="空调" value="空调" />
                <el-checkbox label="电脑" value="电脑" />
              </el-checkbox-group>
            </div>

            <el-input v-model="searchRoom" placeholder="搜索教室编号..." prefix-icon="Search" clearable size="default" class="!w-52 ml-auto" />
            <button @click="resetFilter" class="text-sm text-gray-400 hover:text-indigo-500 transition-colors whitespace-nowrap px-3 py-1 hover:bg-gray-50 rounded-lg">重置筛选</button>
          </div>
        </div>
      </div>

      <!-- 平面图视图（Grid 视图） -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        <div v-for="room in filteredRooms" :key="room.id"
          :class="['group relative bg-gradient-to-br rounded-2xl border-2 p-4 cursor-pointer transition-all duration-300',
            room.status === 'available' ? 'from-emerald-50 to-teal-50/30 border-emerald-300 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1' :
            room.status === 'occupied' ? 'from-yellow-50 to-amber-50/30 border-yellow-300 opacity-80' :
            room.status === 'booked' ? 'from-orange-50 to-amber-50/30 border-orange-300' :
            'from-gray-50 to-slate-50/30 border-gray-200 opacity-60']"
          @click="handleRoomClick(room)">
          
          <!-- 教室号（大字） -->
          <div class="text-center mb-3">
            <span :class="['text-2xl font-black tracking-wide',
              room.status === 'available' ? 'text-emerald-700' :
              room.status === 'occupied' ? 'text-yellow-700' :
              room.status === 'booked' ? 'text-orange-600' : 'text-gray-400']">
              {{ room.number }}
            </span>
          </div>

          <!-- 状态标签 -->
          <div class="flex justify-center mb-3">
            <span :class="['px-3 py-1 rounded-full text-[11px] font-semibold',
              room.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
              room.status === 'occupied' ? 'bg-yellow-100 text-yellow-700' :
              room.status === 'booked' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500']">
              {{ statusText(room.status) }}
              <span v-if="room.status === 'occupied' && room.currentClass" class="ml-1 text-[10px]">{{ room.freeAt }}</span>
            </span>
          </div>

          <!-- 容量信息 -->
          <div class="text-center text-xs text-gray-500 mb-2">
            <span>{{ room.capacity }}座</span>
            <span class="mx-1">|</span>
            <span>{{ room.floor }}F</span>
          </div>

          <!-- 设备标签 -->
          <div class="flex justify-center gap-1.5 flex-wrap">
            <span v-for="eq in room.equipment.slice(0, 3)" :key="eq"
              class="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white/80 rounded text-[9px] text-gray-500 border border-gray-100">
              <el-icon :size="10" class="shrink-0">
                <component :is="equipmentIcon(eq)" />
              </el-icon>
              {{ eq }}
            </span>
          </div>

          <!-- 预约按钮（仅空闲状态显示） -->
          <div v-if="room.status === 'available'" class="mt-3 pt-3 border-t border-emerald-100/50">
            <button class="w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-colors shadow-sm">
              立即预约
            </button>
          </div>
        </div>
      </div>

      <!-- 列表视图（保留原有卡片样式） -->
      <div v-if="viewMode === 'list'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="room in filteredRooms" :key="room.id"
          :class="['group bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer',
            room.status === 'available' ? 'border-emerald-100 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100' :
            room.status === 'occupied' ? 'border-red-100 opacity-80' : 'border-gray-200']"
          @click="room.status === 'available' && openDetail(room)">
          <div class="relative h-32 overflow-hidden" :class="statusHeaderBg(room.status)">
            <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span class="text-3xl font-bold tracking-wider">{{ room.number }}</span>
              <span class="text-xs mt-1 opacity-90">{{ room.building }} {{ room.floor }}楼</span>
            </div>
            <div class="absolute top-3 right-3">
              <span :class="['px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md', statusBadge(room.status)]">
                {{ statusText(room.status) }}
              </span>
            </div>
            <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>

          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <span class="px-2 py-0.5 rounded text-[10px] font-medium" :class="typeBadge(room.type)">{{ typeLabel(room.type) }}</span>
              <span class="text-xs text-gray-400">容量 {{ room.capacity }}人</span>
            </div>

            <div class="space-y-1.5 text-xs text-gray-500 mb-3">
              <div class="flex items-center gap-2"><el-icon class="text-sm"><Monitor /></el-icon>{{ room.equipment.join(' / ') }}</div>
              <div class="flex items-center gap-2"><el-icon class="text-sm"><Location /></el-icon>{{ room.location }}</div>
            </div>

            <div v-if="room.status === 'available'" class="pt-3 border-t border-gray-100">
              <div class="flex items-center justify-between text-[11px] text-gray-400 mb-2">
                <span>今日可用时段</span>
                <span class="text-emerald-500 font-medium">{{ room.availableSlots.length }}个</span>
              </div>
              <div class="flex flex-wrap gap-1">
                <span v-for="slot in room.availableSlots.slice(0, 4)" :key="slot"
                  class="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px]">{{ slot }}</span>
                <span v-if="room.availableSlots.length > 4" class="px-2 py-0.5 bg-gray-100 text-gray-400 rounded text-[10px]">+{{ room.availableSlots.length - 4 }}</span>
              </div>
            </div>

            <div v-if="room.status === 'occupied'" class="pt-3 border-t border-gray-100">
              <p class="text-xs text-gray-400">当前使用：<span class="text-text-primary font-medium">{{ room.currentClass }}</span></p>
              <p class="text-xs text-gray-400 mt-1">预计空闲：{{ room.freeAt }}</p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredRooms.length === 0" class="py-16 text-center">
        <p class="text-gray-400 mb-1">没有找到匹配的教室</p>
        <p class="text-gray-300 text-sm">试试调整筛选条件吧~</p>
      </div>
    </div>

    <!-- 列表视图详情弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selectedRoom && viewMode === 'list'" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="selectedRoom = null">
          <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col animate-scale-in">
            <div class="relative h-40 shrink-0" :class="statusHeaderBg(selectedRoom.status)">
              <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span class="text-4xl font-bold tracking-wider">{{ selectedRoom.number }}</span>
                <span class="text-sm mt-1 opacity-90">{{ selectedRoom.building }} · {{ selectedRoom.floor }}楼 · {{ selectedRoom.capacity }}人</span>
              </div>
              <button @click="selectedRoom = null" class="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <el-icon :size="18"><Close /></el-icon>
              </button>
            </div>

            <div class="overflow-y-auto flex-1 p-6 space-y-5">
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-gray-50 rounded-xl">
                  <p class="text-xs text-gray-400">教室类型</p>
                  <p class="text-sm font-medium mt-0.5">{{ typeLabel(selectedRoom.type) }}</p>
                </div>
                <div class="p-3 bg-gray-50 rounded-xl">
                  <p class="text-xs text-gray-400">设备设施</p>
                  <p class="text-sm font-medium mt-0.5">{{ selectedRoom.equipment.join('、') }}</p>
                </div>
              </div>

              <div>
                <h4 class="font-bold text-sm text-text-primary mb-3">今日可用时段</h4>
                <div class="grid grid-cols-4 gap-2">
                  <button v-for="slot in allTimeSlots" :key="slot.time"
                    :disabled="!slot.available"
                    :class="['py-2.5 rounded-xl text-xs font-medium transition-all',
                      slot.available ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200' : 'bg-gray-50 text-gray-300 cursor-not-allowed']"
                    @click="slot.available && bookSlot(slot.time)">
                    {{ slot.time }}
                    <span v-if="slot.available" class="block text-[10px] opacity-70 mt-0.5">可预约</span>
                    <span v-else class="block text-[10px] mt-0.5">{{ slot.reason }}</span>
                  </button>
                </div>
              </div>

              <div class="bg-blue-50 rounded-xl p-4">
                <h4 class="font-bold text-sm text-blue-700 mb-2 flex items-center gap-1"><el-icon :size="14"><Document /></el-icon> 预约须知</h4>
                <ul class="space-y-1 text-xs text-blue-600/80">
                  <li>• 每次最多预约4小时，需提前15分钟签到</li>
                  <li>• 预约后请准时使用，迟到超过15分钟自动释放</li>
                  <li>• 禁止在教室内吸烟、饮食或从事与学习无关的活动</li>
                  <li>· 离开时请关闭空调和灯光，保持环境整洁</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 平面图预约弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="bookingDialogVisible" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="bookingDialogVisible = false">
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            <div class="px-6 py-4 bg-gradient-to-r from-[#003B80] to-blue-700 flex items-center justify-between">
              <h3 class="font-bold text-white text-lg flex items-center gap-2"><el-icon :size="18"><EditPen /></el-icon> 预约教室</h3>
              <button @click="bookingDialogVisible = false" class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors">
                <el-icon :size="16"><Close /></el-icon>
              </button>
            </div>

            <div class="p-6 space-y-5">
              <div class="bg-blue-50 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-blue-500 mb-1">预约教室</p>
                    <p class="text-xl font-bold text-[#003B80]">{{ bookingRoom?.number }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-400 mb-1">容量</p>
                    <p class="text-lg font-semibold text-text-primary">{{ bookingRoom?.capacity }}座</p>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">选择时间段</label>
                <div class="grid grid-cols-3 gap-2">
                  <button v-for="slot in availableTimeSlotsForBooking" :key="slot.time"
                    :class="['py-2.5 rounded-xl text-xs font-medium transition-all border-2',
                      selectedBookingSlot === slot.time
                        ? 'border-[#003B80] bg-[#003B80]/10 text-[#003B80]'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-[#003B80]/30 hover:text-[#003B80]']"
                    @click="selectedBookingSlot = slot.time">
                    {{ slot.time }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">使用目的</label>
                <el-input v-model="bookingPurpose" type="textarea" :rows="3" placeholder="请简要说明使用目的..." maxlength="200" show-word-limit />
              </div>

              <div class="flex gap-3 pt-2">
                <el-button @click="bookingDialogVisible = false" class="flex-1 !rounded-xl !h-11">取消</el-button>
                <el-button type="primary" class="flex-1 !rounded-xl !h-11 !bg-[#003B80] hover:!bg-[#002d61]"
                  :disabled="!selectedBookingSlot || !bookingPurpose.trim()"
                  @click="confirmBooking">
                  确认预约
                </el-button>
              </div>
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
import { Plus, Close, Monitor, Location, Grid, List, VideoCamera, ColdDrink, Monitor as Computer,
  Document, EditPen } from '@element-plus/icons-vue'
import { useCampusStore } from '@/stores/campus'

const campusStore = useCampusStore()

// 视图模式：grid（平面图）| list（列表）
const viewMode = ref<'grid' | 'list'>('grid')

// 筛选条件
const filterFloor = ref<number | ''>('')
const filterCapacity = ref('')
const filterEquipment = ref<string[]>([])
const searchRoom = ref('')
const showBooking = ref(false)
const selectedRoom = ref<any>(null)

// 平面图预约相关
const bookingDialogVisible = ref(false)
const bookingRoom = ref<any>(null)
const selectedBookingSlot = ref('')
const bookingPurpose = ref('')

const buildings = ['主楼', '信息楼', '理学楼', '外语楼', '综合实验楼']

// Mock 教室数据（增强版，包含更多状态）
const mockClassrooms = [
  // 1F
  { id: 1, number: 'A101', building: '主楼', floor: 1, type: 'normal', capacity: 45, equipment: ['投影仪', '空调'], location: '1楼东侧', status: 'available', availableSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'] },
  { id: 2, number: 'A102', building: '主楼', floor: 1, type: 'multi', capacity: 60, equipment: ['投影仪', '空调', '电脑'], location: '1楼西侧', status: 'occupied', currentClass: '高等数学A(下)', freeAt: '11:40' },
  { id: 3, number: 'A103', building: '主楼', floor: 1, type: 'normal', capacity: 35, equipment: ['空调'], location: '1楼中部', status: 'available', availableSlots: ['08:00-10:00', '14:00-16:00', '16:00-18:00', '19:00-21:00'] },
  { id: 4, number: 'B101', building: '信息楼', floor: 1, type: 'lab', capacity: 30, equipment: ['电脑', '空调', '投影仪'], location: '1楼北侧', status: 'booked', availableSlots: [] },
  { id: 5, number: 'B102', building: '信息楼', floor: 1, type: 'seminar', capacity: 20, equipment: ['投影仪', '空调'], location: '1楼南侧', status: 'available', availableSlots: ['09:00-11:00', '14:00-17:00'] },
  { id: 6, number: 'C101', building: '理学楼', floor: 1, type: 'normal', capacity: 50, equipment: ['投影仪', '空调'], location: '1楼大厅旁', status: 'maintenance', availableSlots: [] },
  
  // 2F
  { id: 7, number: 'A201', building: '主楼', floor: 2, type: 'multi', capacity: 80, equipment: ['投影仪', '空调', '电脑'], location: '2楼东侧', status: 'available', availableSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '19:00-21:00'] },
  { id: 8, number: 'A202', building: '主楼', floor: 2, type: 'normal', capacity: 45, equipment: ['空调'], location: '2楼西侧', status: 'occupied', currentClass: '数据结构', freeAt: '15:30' },
  { id: 9, number: 'A203', building: '主楼', floor: 2, type: 'normal', capacity: 28, equipment: ['投影仪', '空调'], location: '2楼中部', status: 'available', availableSlots: ['14:00-16:00', '16:00-18:00'] },
  { id: 10, number: 'B201', building: '信息楼', floor: 2, type: 'lab', capacity: 40, equipment: ['电脑', '空调'], location: '2楼机房区', status: 'available', availableSlots: ['08:00-12:00', '14:00-17:00'] },
  { id: 11, number: 'B202', building: '信息楼', floor: 2, type: 'multi', capacity: 65, equipment: ['投影仪', '空调', '电脑'], location: '2楼多媒体室', status: 'booked', availableSlots: [] },
  { id: 12, number: 'C201', building: '理学楼', floor: 2, type: 'normal', capacity: 55, equipment: ['投影仪', '空调'], location: '2楼大教室', status: 'available', availableSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00'] },

  // 3F
  { id: 13, number: 'A301', building: '主楼', floor: 3, type: 'normal', capacity: 42, equipment: ['投影仪', '空调'], location: '3楼东侧', status: 'available', availableSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '19:00-21:00'] },
  { id: 14, number: 'A302', building: '主楼', floor: 3, type: 'seminar', capacity: 25, equipment: ['投影仪', '空调'], location: '3楼研讨室', status: 'available', availableSlots: ['09:00-11:00', '14:00-17:00', '19:00-21:00'] },
  { id: 15, number: 'A303', building: '主楼', floor: 3, type: 'normal', capacity: 38, equipment: ['空调'], location: '3楼西侧', status: 'occupied', currentClass: '计算机网络', freeAt: '16:50' },
  { id: 16, number: 'B301', building: '信息楼', floor: 3, type: 'lab', capacity: 35, equipment: ['电脑', '空调', '投影仪'], location: '3楼实验室', status: 'maintenance', availableSlots: [] },
  { id: 17, number: 'B302', building: '信息楼', floor: 3, type: 'normal', capacity: 48, equipment: ['投影仪', '空调'], location: '3楼普通教室', status: 'available', availableSlots: ['08:00-12:00', '14:00-18:00'] },
  { id: 18, number: 'C301', building: '理学楼', floor: 3, type: 'multi', capacity: 70, equipment: ['投影仪', '空调', '电脑'], location: '3楼阶梯教室', status: 'booked', availableSlots: [] },

  // 4F
  { id: 19, number: 'A401', building: '主楼', floor: 4, type: 'normal', capacity: 32, equipment: ['空调'], location: '4楼东侧', status: 'available', availableSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00'] },
  { id: 20, number: 'A402', building: '主楼', floor: 4, type: 'normal', capacity: 44, equipment: ['投影仪', '空调'], location: '4楼西侧', status: 'available', availableSlots: ['08:00-12:00', '14:00-18:00', '19:00-21:00'] },
  { id: 21, number: 'A403', building: '主楼', floor: 4, type: 'seminar', capacity: 22, equipment: ['投影仪', '空调'], location: '4楼研讨室', status: 'booked', availableSlots: [] },
  { id: 22, number: 'B401', building: '信息楼', floor: 4, type: 'lab', capacity: 30, equipment: ['电脑', '空调'], location: '4楼机房', status: 'available', availableSlots: ['14:00-17:00', '19:00-21:00'] },
  { id: 23, number: 'B402', building: '信息楼', floor: 4, type: 'multi', capacity: 58, equipment: ['投影仪', '空调', '电脑'], location: '4楼多媒体', status: 'occupied', currentClass: '人工智能导论', freeAt: '15:15' },
  { id: 24, number: 'C401', building: '理学楼', floor: 4, type: 'normal', capacity: 46, equipment: ['投影仪', '空调'], location: '4楼教室', status: 'available', availableSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'] },

  // 5F
  { id: 25, number: 'A501', building: '主楼', floor: 5, type: 'normal', capacity: 36, equipment: ['投影仪', '空调'], location: '5楼东侧', status: 'available', availableSlots: ['08:00-12:00', '14:00-18:00'] },
  { id: 26, number: 'A502', building: '主楼', floor: 5, type: 'normal', capacity: 52, equipment: ['空调'], location: '5楼西侧', status: 'available', availableSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '19:00-21:00'] },
  { id: 27, number: 'B501', building: '信息楼', floor: 5, type: 'lab', capacity: 28, equipment: ['电脑', '空调', '投影仪'], location: '5楼实验室', status: 'maintenance', availableSlots: [] },
  { id: 28, number: 'B502', building: '信息楼', floor: 5, type: 'seminar', capacity: 18, equipment: ['投影仪', '空调'], location: '5楼研讨室', status: 'available', availableSlots: ['09:00-11:00', '14:00-17:00'] }
]

const rooms = computed(() => {
  if (campusStore.classrooms?.length) {
    return campusStore.classrooms.map(room => ({
      id: room.id,
      number: room.number || room.name,
      building: room.building || buildings[0],
      floor: room.floor || 1,
      type: room.type || 'normal',
      capacity: room.capacity || 45,
      equipment: room.equipment || ['投影仪', '空调'],
      location: room.location || '',
      status: room.status || 'available',
      availableSlots: room.availableSlots || [],
      currentClass: room.currentClass,
      freeAt: room.freeAt
    }))
  }
  return mockClassrooms
})

// 筛选后的教室列表
const filteredRooms = computed(() => {
  let list = rooms.value
  
  if (filterFloor.value !== '') list = list.filter(r => r.floor === filterFloor.value)
  
  if (filterCapacity.value) {
    if (filterCapacity.value === 'small') list = list.filter(r => r.capacity < 30)
    else if (filterCapacity.value === 'medium') list = list.filter(r => r.capacity >= 30 && r.capacity <= 60)
    else if (filterCapacity.value === 'large') list = list.filter(r => r.capacity > 60)
  }

  // 设备筛选（多选）
  if (filterEquipment.value.length > 0) {
    list = list.filter(r => filterEquipment.value.every(eq => r.equipment.includes(eq)))
  }

  if (searchRoom.value.trim()) {
    const kw = searchRoom.value.toLowerCase()
    list = list.filter(r => r.number.toLowerCase().includes(kw))
  }
  
  return list
})

// 可用时间段（用于预约）
const allTimeSlots = [
  { time: '08:00', available: true, reason: '' }, { time: '09:00', available: true, reason: '' },
  { time: '10:00', available: false, reason: '已占用' }, { time: '11:00', available: false, reason: '已占用' },
  { time: '13:00', available: true, reason: '' }, { time: '14:00', available: true, reason: '' },
  { time: '15:00', available: true, reason: '' }, { time: '16:00', available: false, reason: '已占用' },
  { time: '17:00', available: true, reason: '' }, { time: '18:00', available: true, reason: '' },
  { time: '19:00', available: true, reason: '' }, { time: '20:00', available: false, reason: '已关闭' }
]

// 平面图预约可用时段
const availableTimeSlotsForBooking = computed(() => {
  const slots = [
    { time: '08:00-10:00' },
    { time: '10:00-12:00' },
    { time: '14:00-16:00' },
    { time: '16:00-18:00' },
    { time: '19:00-21:00' }
  ]
  return slots
})

// 设备图标映射
function equipmentIcon(equipment: string) {
  const map: Record<string, any> = {
    '投影仪': VideoCamera,
    '空调': ColdDrink,
    '电脑': Computer
  }
  return map[equipment] || Monitor
}

// 状态文本映射（增强版）
function statusText(status: string): string {
  const map: Record<string, string> = {
    available: '空闲',
    occupied: '上课中',
    booked: '已预约',
    maintenance: '维修中'
  }
  return map[status] || status
}

function statusBadge(status: string): string {
  const map: Record<string, string> = {
    available: 'bg-emerald-500/90 text-white',
    occupied: 'bg-red-500/90 text-white',
    booked: 'bg-orange-500/90 text-white',
    maintenance: 'bg-gray-400/90 text-white'
  }
  return map[status] || ''
}

function statusHeaderBg(status: string): string {
  const map: Record<string, string> = {
    available: 'bg-gradient-to-br from-emerald-400 to-teal-500',
    occupied: 'bg-gradient-to-br from-red-400 to-orange-500',
    booked: 'bg-gradient-to-br from-orange-400 to-yellow-500',
    maintenance: 'bg-gradient-to-br from-gray-400 to-slate-500'
  }
  return map[status] || ''
}

function typeLabel(type: string): string {
  const map: Record<string, string> = { normal: '普通教室', multi: '多媒体教室', lab: '实验室', seminar: '研讨室' }
  return map[type] || type
}

function typeBadge(type: string): string {
  const map: Record<string, string> = { normal: 'bg-blue-100 text-blue-600', multi: 'bg-purple-100 text-purple-600', lab: 'bg-cyan-100 text-cyan-600', seminar: 'bg-amber-100 text-amber-600' }
  return map[type] || ''
}

// 处理教室点击（根据视图模式不同）
function handleRoomClick(room: any) {
  if (room.status === 'available') {
    bookingRoom.value = room
    selectedBookingSlot.value = ''
    bookingPurpose.value = ''
    bookingDialogVisible.value = true
  } else if (room.status === 'occupied') {
    ElMessage.info(`${room.number} 当前正在上课，预计 ${room.freeAt} 空闲`)
  } else if (room.status === 'booked') {
    ElMessage.warning(`${room.number} 已被预约`)
  } else {
    ElMessage.error(`${room.number} 正在维护中，暂不可用`)
  }
}

function openDetail(room: any) { 
  selectedRoom.value = room 
}

function resetFilter() {
  filterFloor.value = ''; 
  filterCapacity.value = ''; 
  filterEquipment.value = []; 
  searchRoom.value = ''
}

function bookSlot(time: string) {
  ElMessage.success(`已预约 ${selectedRoom.value?.number} ${time} 时段`)
  selectedRoom.value = null
}

// 确认预约（平面图视图）
function confirmBooking() {
  if (!selectedBookingSlot.value || !bookingPurpose.value.trim()) {
    ElMessage.warning('请选择时间段并填写使用目的')
    return
  }
  ElMessage.success(`成功预约 ${bookingRoom.value?.number} ${selectedBookingSlot.value}`)
  bookingDialogVisible.value = false
  bookingRoom.value = null
  selectedBookingSlot.value = ''
  bookingPurpose.value = ''
}

onMounted(async () => {
  try {
    await campusStore.fetchClassrooms()
  } catch {
    ElMessage.error('获取教室信息失败')
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-scale-in { animation: scaleIn 0.25s ease-out forwards; }
</style>
