<template>
  <div class="page min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-text-primary">
          教室查询
        </h1>
        <div class="flex gap-3">
          <el-button
            round
            class="!rounded-full !px-5"
            @click="showMyBookings = true"
          >
            <el-icon class="mr-1">
              <Document />
            </el-icon>我的预约
          </el-button>
          <el-button
            type="primary"
            round
            class="!rounded-full !px-5 !bg-[#003B80] hover:!bg-[#002d61]"
            @click="showBooking = true"
          >
            <el-icon class="mr-1">
              <Plus />
            </el-icon>预约教室
          </el-button>
        </div>
      </div>

      <!-- 视图切换 + 筛选区域 -->
      <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5 mb-6">
        <!-- 视图切换 Tab -->
        <div class="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
          <el-radio-group
            v-model="viewMode"
            size="default"
            class="!bg-transparent"
          >
            <el-radio-button
              value="grid"
              class="!rounded-lg"
            >
              <el-icon class="mr-1">
                <Grid />
              </el-icon>平面图视图
            </el-radio-button>
            <el-radio-button
              value="list"
              class="!rounded-lg"
            >
              <el-icon class="mr-1">
                <List />
              </el-icon>列表视图
            </el-radio-button>
          </el-radio-group>
          <span class="text-xs text-gray-400">共 {{ filteredRooms.length }} 间教室</span>
        </div>

        <!-- 筛选条件 -->
        <div class="flex flex-col gap-4">
          <!-- 第一行：教学楼选择 -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500 font-medium whitespace-nowrap">教学楼：</span>
            <div class="flex flex-wrap gap-2 flex-1">
              <button
                v-for="building in buildingOptions"
                :key="building.value"
                :class="['px-3 py-1.5 rounded-lg text-xs font-medium transition-all border',
                         filterBuilding === building.value
                           ? 'bg-[#003B80] text-white border-[#003B80]'
                           : 'bg-white text-gray-600 border-gray-200 hover:border-[#003B80]/50 hover:text-[#003B80]']"
                @click="filterBuilding = filterBuilding === building.value ? '' : building.value"
              >
                <span class="flex items-center gap-1">
                  <span
                    class="w-2 h-2 rounded-full"
                    :style="{ backgroundColor: building.color }"
                  />
                  {{ building.label }}
                </span>
              </button>
            </div>
          </div>

          <!-- 第二行：楼层 + 容量 -->
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500 font-medium whitespace-nowrap">楼层：</span>
              <el-radio-group
                v-model="filterFloor"
                size="small"
                class="!bg-transparent"
              >
                <el-radio-button value="">
                  全部
                </el-radio-button>
                <el-radio-button
                  v-for="f in [1,2,3,4,5,6]"
                  :key="f"
                  :value="f"
                >
                  {{ f }}F
                </el-radio-button>
              </el-radio-group>
            </div>

            <div class="flex items-center gap-2 ml-auto">
              <span class="text-xs text-gray-500 font-medium whitespace-nowrap">容量：</span>
              <el-radio-group
                v-model="filterCapacity"
                size="small"
                class="!bg-transparent"
              >
                <el-radio-button value="">
                  不限
                </el-radio-button>
                <el-radio-button value="small">
                  &lt;30人
                </el-radio-button>
                <el-radio-button value="medium">
                  30-60人
                </el-radio-button>
                <el-radio-button value="large">
                  &gt;60人
                </el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <!-- 第三行：设备筛选 + 搜索 -->
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500 font-medium whitespace-nowrap">设备：</span>
              <el-checkbox-group
                v-model="filterEquipment"
                size="small"
                class="!bg-transparent"
              >
                <el-checkbox
                  label="投影仪"
                  value="投影仪"
                />
                <el-checkbox
                  label="空调"
                  value="空调"
                />
                <el-checkbox
                  label="电脑"
                  value="电脑"
                />
              </el-checkbox-group>
            </div>

            <el-input
              v-model="searchRoom"
              placeholder="搜索教室编号或教学楼..."
              prefix-icon="Search"
              clearable
              size="default"
              class="!w-56 ml-auto"
            />
            <button
              class="text-sm text-gray-400 hover:text-indigo-500 transition-colors whitespace-nowrap px-3 py-1 hover:bg-gray-50 rounded-lg"
              @click="resetFilter"
            >
              重置筛选
            </button>
          </div>
        </div>
      </div>

      <!-- 收藏的教室快捷入口 -->
      <div
        v-if="favoriteRoomsList.length > 0 && !filterBuilding && !filterFloor && !filterCapacity && !filterEquipment.length && !searchRoom"
        class="mb-6"
      >
        <div class="flex items-center gap-2 mb-3">
          <el-icon class="text-amber-500">
            <StarFilled />
          </el-icon>
          <span class="text-sm font-medium text-gray-700">我的收藏</span>
          <span class="text-xs text-gray-400">({{ favoriteRoomsList.length }})</span>
        </div>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="room in favoriteRoomsList.slice(0, 5)"
            :key="room.id"
            :class="['px-3 py-2 rounded-xl text-xs font-medium transition-all border flex items-center gap-2',
                     room.status === 'available'
                       ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                       : 'bg-gray-50 border-gray-200 text-gray-500']"
            @click="handleRoomClick(room)"
          >
            <span
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: getBuildingColor(room.building) }"
            />
            <span>{{ room.number }}</span>
            <span class="text-gray-400">{{ getBuildingShortName(room.building) }}</span>
          </button>
          <button
            v-if="favoriteRoomsList.length > 5"
            class="px-3 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-gray-600 transition-all"
            @click="searchRoom = favoriteRoomsList.map(r => r.number).join(' ')"
          >
            +{{ favoriteRoomsList.length - 5 }} 更多
          </button>
        </div>
      </div>

      <!-- 平面图视图（Grid 视图） -->
      <div
        v-if="viewMode === 'grid'"
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      >
        <div
          v-for="room in filteredRooms"
          :key="room.id"
          :class="['group relative bg-gradient-to-br rounded-2xl border-2 p-4 cursor-pointer transition-all duration-300',
                   room.status === 'available' ? 'from-emerald-50 to-teal-50/30 border-emerald-300 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-100/50 hover:-translate-y-1' :
                   room.status === 'occupied' ? 'from-yellow-50 to-amber-50/30 border-yellow-300 opacity-80' :
                   room.status === 'booked' ? 'from-orange-50 to-amber-50/30 border-orange-300' :
                   'from-gray-50 to-slate-50/30 border-gray-200 opacity-60']"
          @click="handleRoomClick(room)"
        >
          <!-- 教室号（大字） -->
          <div class="text-center mb-3">
            <span
              :class="['text-2xl font-black tracking-wide',
                       room.status === 'available' ? 'text-emerald-700' :
                       room.status === 'occupied' ? 'text-yellow-700' :
                       room.status === 'booked' ? 'text-orange-600' : 'text-gray-400']"
            >
              {{ room.number }}
            </span>
          </div>

          <!-- 状态标签 -->
          <div class="flex justify-center mb-3">
            <span
              :class="['px-3 py-1 rounded-full text-[11px] font-semibold',
                       room.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                       room.status === 'occupied' ? 'bg-yellow-100 text-yellow-700' :
                       room.status === 'booked' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500']"
            >
              {{ statusText(room.status) }}
              <span
                v-if="room.status === 'occupied' && room.currentClass"
                class="ml-1 text-[10px]"
              >{{ room.freeAt }}</span>
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
            <span
              v-for="eq in room.equipment.slice(0, 3)"
              :key="eq"
              class="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-white/80 rounded text-[9px] text-gray-500 border border-gray-100"
            >
              <el-icon
                :size="10"
                class="shrink-0"
              >
                <component :is="equipmentIcon(eq)" />
              </el-icon>
              {{ eq }}
            </span>
          </div>

          <!-- 收藏按钮 -->
          <button
            class="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all shadow-sm"
            @click="toggleFavorite(room.id, $event)"
          >
            <el-icon
              :size="14"
              :class="isFavorite(room.id) ? 'text-amber-400' : 'text-gray-300 hover:text-amber-400'"
            >
              <StarFilled v-if="isFavorite(room.id)" />
              <Star v-else />
            </el-icon>
          </button>

          <!-- 预约按钮（仅空闲状态显示） -->
          <div
            v-if="room.status === 'available'"
            class="mt-3 pt-3 border-t border-emerald-100/50"
          >
            <button class="w-full py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium rounded-lg transition-colors shadow-sm">
              立即预约
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div
        v-if="filteredRooms.length === 0"
        class="text-center py-16"
      >
        <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <el-icon
            :size="32"
            class="text-gray-400"
          >
            <OfficeBuilding />
          </el-icon>
        </div>
        <h3 class="text-lg font-medium text-gray-700 mb-2">
          未找到符合条件的教室
        </h3>
        <p class="text-sm text-gray-400 mb-6">
          当前筛选条件下没有可用的教室，试试调整筛选条件
        </p>
        <div class="flex justify-center gap-3">
          <el-button
            type="primary"
            class="!bg-[#003B80] hover:!bg-[#002d61]"
            @click="resetFilter"
          >
            重置筛选条件
          </el-button>
          <el-button
            v-if="favoriteRoomsList.length > 0"
            @click="showFavoritesOnly"
          >
            查看我的收藏
          </el-button>
        </div>
      </div>

      <!-- 列表视图（保留原有卡片样式） -->
      <div
        v-if="viewMode === 'list'"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <div
          v-for="room in filteredRooms"
          :key="room.id"
          :class="['group bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer',
                   room.status === 'available' ? 'border-emerald-100 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-100' :
                   room.status === 'occupied' ? 'border-red-100 opacity-80' : 'border-gray-200']"
          @click="room.status === 'available' && openDetail(room)"
        >
          <div
            class="relative h-32 overflow-hidden"
            :class="statusHeaderBg(room.status)"
          >
            <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
              <span class="text-3xl font-bold tracking-wider">{{ room.number }}</span>
              <span class="text-xs mt-1 opacity-90 flex items-center gap-1">
                <span
                  class="w-2 h-2 rounded-full"
                  :style="{ backgroundColor: getBuildingColor(room.building) }"
                />
                {{ getBuildingShortName(room.building) }} {{ room.floor }}楼
              </span>
            </div>
            <div class="absolute top-3 right-3">
              <span :class="['px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md', statusBadge(room.status)]">
                {{ statusText(room.status) }}
              </span>
            </div>
            <!-- 收藏按钮 -->
            <button
              class="absolute top-3 left-3 w-7 h-7 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all shadow-sm z-10"
              @click="toggleFavorite(room.id, $event)"
            >
              <el-icon
                :size="14"
                :class="isFavorite(room.id) ? 'text-amber-400' : 'text-gray-300 hover:text-amber-400'"
              >
                <StarFilled v-if="isFavorite(room.id)" />
                <Star v-else />
              </el-icon>
            </button>
            <div class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div class="p-4">
            <div class="flex items-center justify-between mb-3">
              <span
                class="px-2 py-0.5 rounded text-[10px] font-medium"
                :class="typeBadge(room.type)"
              >{{ typeLabel(room.type) }}</span>
              <span class="text-xs text-gray-400">容量 {{ room.capacity }}人</span>
            </div>

            <div class="space-y-1.5 text-xs text-gray-500 mb-3">
              <div class="flex items-center gap-2">
                <el-icon class="text-sm">
                  <Monitor />
                </el-icon>{{ room.equipment.join(' / ') }}
              </div>
              <div class="flex items-center gap-2">
                <el-icon class="text-sm">
                  <Location />
                </el-icon>{{ room.location }}
              </div>
            </div>

            <div
              v-if="room.status === 'available' && room.availableSlots?.length"
              class="pt-3 border-t border-gray-100"
            >
              <div class="flex items-center justify-between text-[11px] text-gray-400 mb-2">
                <span>今日可用时段</span>
                <span class="text-emerald-500 font-medium">{{ room.availableSlots?.length || 0 }}个</span>
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="slot in room.availableSlots?.slice(0, 4) || []"
                  :key="slot"
                  class="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[10px]"
                >{{ slot }}</span>
                <span
                  v-if="(room.availableSlots?.length || 0) > 4"
                  class="px-2 py-0.5 bg-gray-100 text-gray-400 rounded text-[10px]"
                >+{{ (room.availableSlots?.length || 0) - 4 }}</span>
              </div>
            </div>

            <div
              v-if="room.status === 'occupied'"
              class="pt-3 border-t border-gray-100"
            >
              <p class="text-xs text-gray-400">
                当前使用：<span class="text-text-primary font-medium">{{ room.currentClass }}</span>
              </p>
              <p class="text-xs text-gray-400 mt-1">
                预计空闲：{{ room.freeAt }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="filteredRooms.length === 0"
        class="py-16 text-center"
      >
        <p class="text-gray-400 mb-1">
          没有找到匹配的教室
        </p>
        <p class="text-gray-300 text-sm">
          试试调整筛选条件吧~
        </p>
      </div>
    </div>

    <!-- 列表视图详情弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="selectedRoom && viewMode === 'list'"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          @click.self="selectedRoom = null"
        >
          <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col animate-scale-in">
            <div
              class="relative h-40 shrink-0"
              :class="statusHeaderBg(selectedRoom.status)"
            >
              <div class="absolute inset-0 flex flex-col items-center justify-center text-white">
                <span class="text-4xl font-bold tracking-wider">{{ selectedRoom.number }}</span>
                <span class="text-sm mt-1 opacity-90">{{ selectedRoom.building }} · {{ selectedRoom.floor }}楼 · {{ selectedRoom.capacity }}人</span>
              </div>
              <button
                class="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                @click="selectedRoom = null"
              >
                <el-icon :size="18">
                  <Close />
                </el-icon>
              </button>
            </div>

            <div class="overflow-y-auto flex-1 p-6 space-y-5">
              <div class="grid grid-cols-2 gap-3">
                <div class="p-3 bg-gray-50 rounded-xl">
                  <p class="text-xs text-gray-400">
                    教室类型
                  </p>
                  <p class="text-sm font-medium mt-0.5">
                    {{ typeLabel(selectedRoom.type) }}
                  </p>
                </div>
                <div class="p-3 bg-gray-50 rounded-xl">
                  <p class="text-xs text-gray-400">
                    设备设施
                  </p>
                  <p class="text-sm font-medium mt-0.5">
                    {{ selectedRoom.equipment.join('、') }}
                  </p>
                </div>
              </div>

              <div>
                <h4 class="font-bold text-sm text-text-primary mb-3">
                  今日可用时段
                </h4>
                <div class="grid grid-cols-4 gap-2">
                  <button
                    v-for="slot in allTimeSlots"
                    :key="slot.time"
                    :disabled="!slot.available"
                    :class="['py-2.5 rounded-xl text-xs font-medium transition-all',
                             slot.available ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200' : 'bg-gray-50 text-gray-300 cursor-not-allowed']"
                    @click="slot.available && bookSlot(slot.time)"
                  >
                    {{ slot.time }}
                    <span
                      v-if="slot.available"
                      class="block text-[10px] opacity-70 mt-0.5"
                    >可预约</span>
                    <span
                      v-else
                      class="block text-[10px] mt-0.5"
                    >{{ slot.reason }}</span>
                  </button>
                </div>
              </div>

              <div class="bg-blue-50 rounded-xl p-4">
                <h4 class="font-bold text-sm text-blue-700 mb-2 flex items-center gap-1">
                  <el-icon :size="14">
                    <Document />
                  </el-icon> 预约须知
                </h4>
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
        <div
          v-if="bookingDialogVisible"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          @click.self="bookingDialogVisible = false"
        >
          <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-scale-in">
            <div class="px-6 py-4 bg-gradient-to-r from-[#003B80] to-blue-700 flex items-center justify-between">
              <h3 class="font-bold text-white text-lg flex items-center gap-2">
                <el-icon :size="18">
                  <EditPen />
                </el-icon> 预约教室
              </h3>
              <button
                class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                @click="bookingDialogVisible = false"
              >
                <el-icon :size="16">
                  <Close />
                </el-icon>
              </button>
            </div>

            <div class="p-6 space-y-5">
              <div class="bg-blue-50 rounded-xl p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-xs text-blue-500 mb-1">
                      预约教室
                    </p>
                    <p class="text-xl font-bold text-[#003B80]">
                      {{ bookingRoom?.number }}
                    </p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-gray-400 mb-1">
                      容量
                    </p>
                    <p class="text-lg font-semibold text-text-primary">
                      {{ bookingRoom?.capacity }}座
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">选择日期</label>
                <el-date-picker
                  v-model="bookingDate"
                  type="date"
                  placeholder="选择日期"
                  class="!w-full"
                  :disabled-date="disabledDate"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">选择时间段</label>
                <div class="grid grid-cols-3 gap-2">
                  <button
                    v-for="slot in availableTimeSlotsForBooking"
                    :key="slot.time"
                    :class="['py-2.5 rounded-xl text-xs font-medium transition-all border-2',
                             selectedBookingSlot === slot.time
                               ? 'border-[#003B80] bg-[#003B80]/10 text-[#003B80]'
                               : 'border-gray-200 bg-white text-gray-600 hover:border-[#003B80]/30 hover:text-[#003B80]']"
                    @click="selectedBookingSlot = slot.time"
                  >
                    {{ slot.time }}
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-text-primary mb-2">使用目的</label>
                <el-input
                  v-model="bookingPurpose"
                  type="textarea"
                  :rows="3"
                  placeholder="请简要说明使用目的..."
                  maxlength="200"
                  show-word-limit
                />
              </div>

              <div class="flex gap-3 pt-2">
                <el-button
                  class="flex-1 !rounded-xl !h-11"
                  @click="bookingDialogVisible = false"
                >
                  取消
                </el-button>
                <el-button
                  type="primary"
                  class="flex-1 !rounded-xl !h-11 !bg-[#003B80] hover:!bg-[#002d61]"
                  :disabled="!selectedBookingSlot || !bookingPurpose.trim() || !bookingDate"
                  :loading="campusStore.loading"
                  @click="confirmBooking"
                >
                  确认预约
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 我的预约弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showMyBookings"
          class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
          @click.self="showMyBookings = false"
        >
          <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-scale-in flex flex-col">
            <div class="px-6 py-4 bg-gradient-to-r from-[#003B80] to-blue-700 flex items-center justify-between shrink-0">
              <h3 class="font-bold text-white text-lg flex items-center gap-2">
                <el-icon :size="18">
                  <Document />
                </el-icon> 我的教室预约
              </h3>
              <button
                class="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                @click="showMyBookings = false"
              >
                <el-icon :size="16">
                  <Close />
                </el-icon>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto p-6">
              <div
                v-if="campusStore.myClassroomBookings?.length === 0"
                class="text-center py-12"
              >
                <el-icon
                  :size="48"
                  class="text-gray-300 mb-4"
                >
                  <Document />
                </el-icon>
                <p class="text-gray-400">
                  暂无预约记录
                </p>
              </div>

              <div
                v-else
                class="space-y-4"
              >
                <div
                  v-for="booking in campusStore.myClassroomBookings"
                  :key="booking.id"
                  class="bg-gray-50 rounded-xl p-4 border border-gray-100"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <span class="text-lg font-bold text-[#003B80]">{{ booking.roomNumber }}</span>
                        <span class="text-sm text-gray-500">{{ booking.building }} {{ booking.floor }}楼</span>
                        <el-tag
                          :type="booking.status === 'active' ? 'success' : booking.status === 'completed' ? 'info' : 'danger'"
                          size="small"
                        >
                          {{ booking.status === 'active' ? '进行中' : booking.status === 'completed' ? '已完成' : '已取消' }}
                        </el-tag>
                      </div>
                      <div class="text-sm text-gray-600 space-y-1">
                        <p><span class="text-gray-400">日期：</span>{{ booking.date }}</p>
                        <p><span class="text-gray-400">时间：</span>{{ booking.time }}</p>
                        <p><span class="text-gray-400">用途：</span>{{ booking.reason }}</p>
                      </div>
                    </div>
                    <el-button
                      v-if="booking.status === 'active'"
                      type="danger"
                      size="small"
                      :loading="campusStore.loading"
                      @click="cancelBooking(booking.id)"
                    >
                      取消
                    </el-button>
                  </div>
                </div>
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
import { useI18n } from 'vue-i18n'
import {
  Plus, Close, Monitor, Location, Grid, List, VideoCamera, ColdDrink, Monitor as Computer,
  Document, EditPen, Star, StarFilled, MapLocation, Clock, OfficeBuilding
} from '@element-plus/icons-vue'
import { useCampusStore } from '@/stores/campus'

const { t } = useI18n()

const campusStore = useCampusStore()

// 视图模式：grid（平面图）| list（列表）
const viewMode = ref<'grid' | 'list'>('grid')

// 筛选条件
const filterBuilding = ref('')
const filterFloor = ref<number | ''>('')
const filterCapacity = ref('')
const filterEquipment = ref<string[]>([])
const searchRoom = ref('')

// 收藏教室（从 localStorage 读取）
const favoriteRooms = ref<string[]>([])

// 加载收藏的教室
function loadFavoriteRooms() {
  const saved = localStorage.getItem('classroom_favorites')
  if (saved) {
    try {
      favoriteRooms.value = JSON.parse(saved)
    } catch {
      favoriteRooms.value = []
    }
  }
}

// 保存收藏到 localStorage
function saveFavoriteRooms() {
  localStorage.setItem('classroom_favorites', JSON.stringify(favoriteRooms.value))
}

// 切换收藏状态
function toggleFavorite(roomId: string, event: Event) {
  event.stopPropagation()
  const index = favoriteRooms.value.indexOf(roomId)
  if (index > -1) {
    favoriteRooms.value.splice(index, 1)
    ElMessage.success('已取消收藏')
  } else {
    favoriteRooms.value.push(roomId)
    ElMessage.success('已添加到收藏')
  }
  saveFavoriteRooms()
}

// 是否已收藏
function isFavorite(roomId: string) {
  return favoriteRooms.value.includes(roomId)
}

// 收藏的教室列表
const favoriteRoomsList = computed(() => {
  return rooms.value.filter(r => favoriteRooms.value.includes(r.id))
})

// 教学楼选项（带颜色标识）
const buildingOptions = [
  { value: '主楼', label: '主楼', color: '#003B80', prefix: 'Z' },
  { value: '第一教学楼', label: '第一教学楼', color: '#10b981', prefix: 'A' },
  { value: '第二教学楼', label: '第二教学楼', color: '#f59e0b', prefix: 'B' },
  { value: '矿业工程实验楼', label: '矿业工程实验楼', color: '#8b5cf6', prefix: 'K' },
  { value: '机电工程实验楼', label: '机电工程实验楼', color: '#ec4899', prefix: 'J' }
]

// 获取教学楼颜色
function getBuildingColor(buildingName: string) {
  return buildingOptions.find(b => b.value === buildingName)?.color || '#6b7280'
}

// 获取教学楼简称
function getBuildingShortName(buildingName: string) {
  const shortNames: Record<string, string> = {
    '主楼': '主楼',
    '第一教学楼': '一教',
    '第二教学楼': '二教',
    '矿业工程实验楼': '矿业楼',
    '机电工程实验楼': '机电楼'
  }
  return shortNames[buildingName] || buildingName
}
const showBooking = ref(false)
const showMyBookings = ref(false)
const selectedRoom = ref<any>(null)

// 平面图预约相关
const bookingDialogVisible = ref(false)
const bookingRoom = ref<any>(null)
const bookingDate = ref('')
const selectedBookingSlot = ref('')
const bookingPurpose = ref('')

// 日期选择限制（不能选择过去日期）
function disabledDate(date: Date) {
  return date < new Date(new Date().setHours(0, 0, 0, 0))
}

// 黑龙江科技大学实际教学楼名称
const buildings = ['主楼', '第一教学楼', '第二教学楼', '矿业工程实验楼', '机电工程实验楼']

// Mock 教室数据（黑龙江科技大学实际教学楼数据）
const mockClassrooms = [
  // 主楼 (Z)
  { id: 1, number: 'Z101', building: '主楼', floor: 1, type: 'normal', capacity: 60, equipment: ['投影仪', '空调', '电脑'], location: '1楼东侧', status: 'available', availableSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'] },
  { id: 2, number: 'Z102', building: '主楼', floor: 1, type: 'multi', capacity: 120, equipment: ['投影仪', '空调', '电脑', '音响'], location: '1楼报告厅', status: 'occupied', currentClass: '新生入学教育', freeAt: '11:40' },
  { id: 3, number: 'Z201', building: '主楼', floor: 2, type: 'normal', capacity: 50, equipment: ['投影仪', '空调'], location: '2楼东侧', status: 'available', availableSlots: ['08:00-10:00', '14:00-16:00', '16:00-18:00', '19:00-21:00'] },
  { id: 4, number: 'Z202', building: '主楼', floor: 2, type: 'seminar', capacity: 30, equipment: ['投影仪', '空调', '电脑'], location: '2楼会议室', status: 'available', availableSlots: ['09:00-11:00', '14:00-17:00'] },
  { id: 5, number: 'Z301', building: '主楼', floor: 3, type: 'normal', capacity: 55, equipment: ['投影仪', '空调'], location: '3楼东侧', status: 'occupied', currentClass: '高等数学A(下)', freeAt: '15:30' },
  { id: 6, number: 'Z302', building: '主楼', floor: 3, type: 'normal', capacity: 45, equipment: ['投影仪', '空调', '电脑'], location: '3楼西侧', status: 'available', availableSlots: ['08:00-12:00', '14:00-18:00'] },

  // 第一教学楼 (A)
  { id: 7, number: 'A101', building: '第一教学楼', floor: 1, type: 'normal', capacity: 80, equipment: ['投影仪', '空调', '电脑'], location: '1楼大教室', status: 'available', availableSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '19:00-21:00'] },
  { id: 8, number: 'A102', building: '第一教学楼', floor: 1, type: 'multi', capacity: 60, equipment: ['投影仪', '空调'], location: '1楼多媒体教室', status: 'occupied', currentClass: '大学英语', freeAt: '09:40' },
  { id: 9, number: 'A201', building: '第一教学楼', floor: 2, type: 'normal', capacity: 50, equipment: ['投影仪', '空调'], location: '2楼东侧', status: 'available', availableSlots: ['14:00-16:00', '16:00-18:00'] },
  { id: 10, number: 'A202', building: '第一教学楼', floor: 2, type: 'normal', capacity: 50, equipment: ['投影仪', '空调', '电脑'], location: '2楼西侧', status: 'booked', availableSlots: [] },
  { id: 11, number: 'A301', building: '第一教学楼', floor: 3, type: 'normal', capacity: 45, equipment: ['投影仪', '空调'], location: '3楼东侧', status: 'available', availableSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00'] },
  { id: 12, number: 'A302', building: '第一教学楼', floor: 3, type: 'normal', capacity: 45, equipment: ['空调'], location: '3楼西侧', status: 'maintenance', availableSlots: [] },

  // 第二教学楼 (B)
  { id: 13, number: 'B101', building: '第二教学楼', floor: 1, type: 'normal', capacity: 60, equipment: ['投影仪', '空调', '电脑'], location: '1楼东侧', status: 'available', availableSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '19:00-21:00'] },
  { id: 14, number: 'B102', building: '第二教学楼', floor: 1, type: 'multi', capacity: 80, equipment: ['投影仪', '空调', '电脑', '音响'], location: '1楼阶梯教室', status: 'occupied', currentClass: '数据结构', freeAt: '11:45' },
  { id: 15, number: 'B201', building: '第二教学楼', floor: 2, type: 'normal', capacity: 50, equipment: ['投影仪', '空调'], location: '2楼东侧', status: 'available', availableSlots: ['09:00-11:00', '14:00-17:00', '19:00-21:00'] },
  { id: 16, number: 'B202', building: '第二教学楼', floor: 2, type: 'normal', capacity: 50, equipment: ['投影仪', '空调', '电脑'], location: '2楼西侧', status: 'available', availableSlots: ['08:00-12:00', '14:00-18:00'] },
  { id: 17, number: 'B301', building: '第二教学楼', floor: 3, type: 'normal', capacity: 45, equipment: ['投影仪', '空调'], location: '3楼东侧', status: 'occupied', currentClass: '计算机网络', freeAt: '16:50' },
  { id: 18, number: 'B302', building: '第二教学楼', floor: 3, type: 'seminar', capacity: 35, equipment: ['投影仪', '空调', '电脑'], location: '3楼研讨室', status: 'booked', availableSlots: [] },

  // 矿业工程实验楼 (K)
  { id: 19, number: 'K101', building: '矿业工程实验楼', floor: 1, type: 'lab', capacity: 30, equipment: ['实验设备', '电脑', '投影仪', '空调'], location: '1楼采矿实验室', status: 'available', availableSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00'] },
  { id: 20, number: 'K102', building: '矿业工程实验楼', floor: 1, type: 'lab', capacity: 25, equipment: ['实验设备', '电脑', '空调'], location: '1楼安全实验室', status: 'occupied', currentClass: '采矿工程实验', freeAt: '11:30' },
  { id: 21, number: 'K201', building: '矿业工程实验楼', floor: 2, type: 'lab', capacity: 35, equipment: ['实验设备', '投影仪', '空调'], location: '2楼矿井模拟实验室', status: 'available', availableSlots: ['08:00-12:00', '14:00-18:00'] },
  { id: 22, number: 'K202', building: '矿业工程实验楼', floor: 2, type: 'lab', capacity: 30, equipment: ['实验设备', '电脑', '投影仪', '空调'], location: '2楼岩石力学实验室', status: 'available', availableSlots: ['14:00-17:00', '19:00-21:00'] },
  { id: 23, number: 'K301', building: '矿业工程实验楼', floor: 3, type: 'lab', capacity: 40, equipment: ['实验设备', '电脑', '空调'], location: '3楼通风实验室', status: 'maintenance', availableSlots: [] },
  { id: 24, number: 'K302', building: '矿业工程实验楼', floor: 3, type: 'lab', capacity: 35, equipment: ['实验设备', '投影仪', '空调'], location: '3楼矿山机电实验室', status: 'available', availableSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'] },

  // 机电工程实验楼 (J)
  { id: 25, number: 'J101', building: '机电工程实验楼', floor: 1, type: 'lab', capacity: 30, equipment: ['实验设备', '电脑', '投影仪', '空调'], location: '1楼机械实验室', status: 'available', availableSlots: ['08:00-12:00', '14:00-18:00'] },
  { id: 26, number: 'J102', building: '机电工程实验楼', floor: 1, type: 'lab', capacity: 25, equipment: ['实验设备', '电脑', '空调'], location: '1楼电气实验室', status: 'occupied', currentClass: '电路实验', freeAt: '15:15' },
  { id: 27, number: 'J201', building: '机电工程实验楼', floor: 2, type: 'lab', capacity: 35, equipment: ['实验设备', '投影仪', '空调'], location: '2楼自动化实验室', status: 'available', availableSlots: ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '19:00-21:00'] },
  { id: 28, number: 'J202', building: '机电工程实验楼', floor: 2, type: 'lab', capacity: 30, equipment: ['实验设备', '电脑', '投影仪', '空调'], location: '2楼数控实验室', status: 'booked', availableSlots: [] }
]

const rooms = computed(() => {
  if (campusStore.classrooms?.length) {
    return campusStore.classrooms.map(room => ({
      id: room.id,
      number: room.roomNumber,
      building: room.building || buildings[0],
      floor: room.floor || 1,
      type: room.type === 'lecture' ? 'normal' : room.type === 'lab' ? 'lab' : room.type === 'multimedia' ? 'multi' : 'normal',
      capacity: room.capacity || 45,
      equipment: room.facilities || ['投影仪', '空调'],
      status: room.isAvailable ? 'available' : 'occupied',
      availableSlots: room.isAvailable ? ['08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00'] : [],
      location: room.location || '1楼'
    }))
  }
  return mockClassrooms
})

// 筛选后的教室列表
const filteredRooms = computed(() => {
  let list = rooms.value

  // 教学楼筛选
  if (filterBuilding.value) {
    list = list.filter(r => r.building === filterBuilding.value)
  }

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
    list = list.filter(r =>
      r.number.toLowerCase().includes(kw) ||
      r.building.toLowerCase().includes(kw)
    )
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
    投影仪: VideoCamera,
    空调: ColdDrink,
    电脑: Computer
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
    ElMessage.info(t('campus.roomOccupied', { number: room.number, freeAt: room.freeAt }))
  } else if (room.status === 'booked') {
    ElMessage.warning(t('campus.roomBooked', { number: room.number }))
  } else {
    ElMessage.error(t('campus.roomMaintenance', { number: room.number }))
  }
}

function openDetail(room: any) {
  selectedRoom.value = room
}

function resetFilter() {
  filterBuilding.value = ''
  filterFloor.value = ''
  filterCapacity.value = ''
  filterEquipment.value = []
  searchRoom.value = ''
}

// 只显示收藏的教室
function showFavoritesOnly() {
  resetFilter()
  searchRoom.value = favoriteRoomsList.value.map(r => r.number).join(' ')
}

function bookSlot(time: string) {
  ElMessage.success(t('campus.bookSlotSuccess', { number: selectedRoom.value?.number, time }))
  selectedRoom.value = null
}

// 确认预约（平面图视图）
async function confirmBooking() {
  if (!selectedBookingSlot.value || !bookingPurpose.value.trim() || !bookingDate.value) {
    ElMessage.warning(t('campus.bookingFormIncomplete'))
    return
  }

  try {
    // 解析时间段为 periods
    const periodMap: Record<string, number[]> = {
      '08:00-10:00': [1, 2],
      '10:00-12:00': [3, 4],
      '14:00-16:00': [5, 6],
      '16:00-18:00': [7, 8],
      '19:00-21:00': [9, 10]
    }
    const periods = periodMap[selectedBookingSlot.value] || [1, 2]
    const dateStr = new Date(bookingDate.value).toISOString().split('T')[0]

    await campusStore.bookClassroom(
      bookingRoom.value?.id,
      dateStr,
      periods,
      bookingPurpose.value.trim()
    )

    bookingDialogVisible.value = false
    bookingRoom.value = null
    bookingDate.value = ''
    selectedBookingSlot.value = ''
    bookingPurpose.value = ''

    // 刷新教室列表
    await campusStore.fetchClassrooms()
  } catch (error) {
    console.error('预约失败:', error)
  }
}

// 取消预约
async function cancelBooking(bookingId: string) {
  try {
    await campusStore.cancelClassroomBookingItem(bookingId)
  } catch (error) {
    console.error('取消预约失败:', error)
  }
}

onMounted(async () => {
  // 加载收藏的教室
  loadFavoriteRooms()

  try {
    await Promise.all([
      campusStore.fetchClassrooms(),
      campusStore.fetchMyClassroomBookings()
    ])
  } catch {
    ElMessage.error(t('campus.fetchClassroomsFailed'))
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-scale-in { animation: scaleIn 0.25s ease-out forwards; }
</style>
