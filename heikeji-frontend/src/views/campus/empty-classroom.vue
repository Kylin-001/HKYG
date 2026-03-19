<template>
  <div class="empty-classroom-container">
    <div class="search-bar">
      <el-form :model="searchForm" inline>
        <el-form-item label="日期">
          <el-date-picker
            v-model="searchForm.date"
            type="date"
            placeholder="选择日期"
            :disabled-date="disabledDate"
            @change="handleSearch"
          />
        </el-form-item>
        <el-form-item label="教学楼">
          <el-select
            v-model="searchForm.building"
            placeholder="选择教学楼"
            clearable
            @change="handleSearch"
          >
            <el-option v-for="b in buildings" :key="b" :label="b" :value="b" />
          </el-select>
        </el-form-item>
        <el-form-item label="时段">
          <el-select
            v-model="searchForm.timeSlot"
            placeholder="选择时段"
            clearable
            @change="handleSearch"
          >
            <el-option v-for="t in timeSlots" :key="t.value" :label="t.label" :value="t.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            v-model="searchForm.type"
            placeholder="教室类型"
            clearable
            @change="handleSearch"
          >
            <el-option label="教学楼" value="lecture" />
            <el-option label="实验室" value="lab" />
            <el-option label="会议室" value="meeting" />
            <el-option label="活动室" value="exercise" />
          </el-select>
        </el-form-item>
        <el-form-item label="容量">
          <el-input-number
            v-model="searchForm.minCapacity"
            :min="0"
            :max="200"
            placeholder="最小容量"
            @change="handleSearch"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="classroom-grid" v-loading="loading">
      <el-empty v-if="!loading && classroomList.length === 0" description="暂无空教室" />
      <el-card
        v-for="classroom in classroomList"
        :key="classroom.id"
        class="classroom-card"
        shadow="hover"
        @click="handleViewDetail(classroom)"
      >
        <div class="card-header">
          <div class="classroom-name">{{ classroom.name }}</div>
          <el-tag :type="getTypeColor(classroom.type)" size="small">{{
            getTypeName(classroom.type)
          }}</el-tag>
        </div>
        <div class="card-body">
          <div class="info-item">
            <el-icon><Location /></el-icon>
            <span>{{ classroom.building }} - {{ classroom.floor }}楼</span>
          </div>
          <div class="info-item">
            <el-icon><User /></el-icon>
            <span>容量: {{ classroom.capacity }}人</span>
          </div>
          <div class="info-item" v-if="classroom.equipment?.length">
            <el-icon><Tools /></el-icon>
            <span>{{ classroom.equipment.join('、') }}</span>
          </div>
        </div>
        <div class="card-footer">
          <el-button type="primary" size="small" @click.stop="handleReserve(classroom)"
            >预约</el-button
          >
          <el-button size="small" @click.stop="handleViewSchedule(classroom)">查看日程</el-button>
        </div>
      </el-card>
    </div>

    <el-dialog v-model="detailVisible" title="教室详情" width="600px">
      <div v-if="selectedClassroom" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="教室名称">{{ selectedClassroom.name }}</el-descriptions-item>
          <el-descriptions-item label="类型">{{
            getTypeName(selectedClassroom.type)
          }}</el-descriptions-item>
          <el-descriptions-item label="教学楼">{{
            selectedClassroom.building
          }}</el-descriptions-item>
          <el-descriptions-item label="楼层">{{ selectedClassroom.floor }}楼</el-descriptions-item>
          <el-descriptions-item label="容量"
            >{{ selectedClassroom.capacity }}人</el-descriptions-item
          >
          <el-descriptions-item label="设备">{{
            selectedClassroom.equipment?.join('、') || '无'
          }}</el-descriptions-item>
        </el-descriptions>
        <div class="schedule-section" v-if="scheduleData.length">
          <h4>今日日程</h4>
          <el-timeline>
            <el-timeline-item
              v-for="slot in scheduleData"
              :key="slot.time"
              :type="slot.status === 'available' ? 'success' : 'info'"
            >
              <div class="schedule-item">
                <span class="time">{{ slot.time }}</span>
                <span class="status">{{
                  slot.status === 'available' ? '空闲' : slot.courseName
                }}</span>
              </div>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="reserveVisible" title="预约教室" width="500px">
      <el-form :model="reserveForm" :rules="reserveRules" ref="reserveFormRef" label-width="100px">
        <el-form-item label="教室" prop="classroomId">
          <el-input v-model="reserveForm.classroomId" disabled />
        </el-form-item>
        <el-form-item label="日期" prop="date">
          <el-date-picker
            v-model="reserveForm.date"
            type="date"
            placeholder="选择日期"
            :disabled-date="disabledDate"
          />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-select v-model="reserveForm.startTime" placeholder="选择开始时间">
            <el-option v-for="t in timeOptions" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-select v-model="reserveForm.endTime" placeholder="选择结束时间">
            <el-option v-for="t in timeOptions" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="用途" prop="purpose">
          <el-input v-model="reserveForm.purpose" type="textarea" placeholder="请输入预约用途" />
        </el-form-item>
        <el-form-item label="联系人" prop="contactName">
          <el-input v-model="reserveForm.contactName" placeholder="请输入联系人姓名" />
        </el-form-item>
        <el-form-item label="联系电话" prop="contactPhone">
          <el-input v-model="reserveForm.contactPhone" placeholder="请输入联系电话" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="reserveVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmitReserve">提交预约</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Location, User, Tools } from '@element-plus/icons-vue'
import * as classroomApi from '@/api/classroom'

interface Classroom {
  id: string
  building: string
  name: string
  capacity: number
  floor: number
  type: string
  equipment: string[]
}

interface TimeSlot {
  time: string
  status: string
  courseName?: string
}

const loading = ref(false)
const buildings = ref<string[]>([])
const timeSlots = ref<Array<{ label: string; value: string }>>([])
const classroomList = ref<Classroom[]>([])
const detailVisible = ref(false)
const reserveVisible = ref(false)
const selectedClassroom = ref<Classroom | null>(null)
const scheduleData = ref<TimeSlot[]>([])
const reserveFormRef = ref()

const searchForm = reactive({
  date: new Date(),
  building: '',
  timeSlot: '',
  type: '',
  minCapacity: 0,
})

const reserveForm = reactive({
  classroomId: '',
  date: '',
  startTime: '',
  endTime: '',
  purpose: '',
  contactName: '',
  contactPhone: '',
})

const reserveRules = {
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }],
  purpose: [{ required: true, message: '请输入用途', trigger: 'blur' }],
  contactName: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
  contactPhone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
}

const timeOptions = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
  '19:00',
  '19:30',
  '20:00',
  '20:30',
  '21:00',
  '21:30',
  '22:00',
]

const disabledDate = (date: Date) => {
  return date < new Date(new Date().setHours(0, 0, 0, 0))
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    lecture: 'primary',
    lab: 'success',
    meeting: 'warning',
    exercise: 'info',
  }
  return colors[type] || ''
}

const getTypeName = (type: string) => {
  const names: Record<string, string> = {
    lecture: '教学楼',
    lab: '实验室',
    meeting: '会议室',
    exercise: '活动室',
  }
  return names[type] || type
}

const handleSearch = async () => {
  loading.value = true
  try {
    const res = await classroomApi.queryEmptyRooms({
      date: searchForm.date,
      building: searchForm.building,
      type: searchForm.type,
    })
    let list = res.data || []

    if (searchForm.minCapacity > 0) {
      list = list.filter((c: Classroom) => c.capacity >= searchForm.minCapacity)
    }

    classroomList.value = list
  } catch (error) {
    ElMessage.error('查询失败')
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  searchForm.building = ''
  searchForm.timeSlot = ''
  searchForm.type = ''
  searchForm.minCapacity = 0
  handleSearch()
}

const handleViewDetail = async (classroom: Classroom) => {
  selectedClassroom.value = classroom
  detailVisible.value = true

  try {
    const res = await classroomApi.getClassroomStatus(classroom.id, searchForm.date)
    scheduleData.value = res.data || []
  } catch (error) {
    scheduleData.value = []
  }
}

const handleViewSchedule = (classroom: Classroom) => {
  handleViewDetail(classroom)
}

const handleReserve = (classroom: Classroom) => {
  reserveForm.classroomId = classroom.name
  reserveForm.date = searchForm.date
  reserveForm.startTime = ''
  reserveForm.endTime = ''
  reserveForm.purpose = ''
  reserveForm.contactName = ''
  reserveForm.contactPhone = ''
  reserveVisible.value = true
}

const handleSubmitReserve = async () => {
  if (!reserveFormRef.value) return

  try {
    await reserveFormRef.value.validate()
    await classroomApi.reserveClassroom(reserveForm)
    ElMessage.success('预约成功')
    reserveVisible.value = false
  } catch (error) {
    ElMessage.error('预约失败')
  }
}

onMounted(async () => {
  try {
    const [buildingRes, timeSlotRes] = await Promise.all([
      classroomApi.getBuildings(),
      classroomApi.getTimeSlots(),
    ])
    buildings.value = buildingRes.data || []
    timeSlots.value = timeSlotRes.data || []
    handleSearch()
  } catch (error) {
    ElMessage.error('初始化失败')
  }
})
</script>

<style scoped lang="scss">
.empty-classroom-container {
  padding: 20px;

  .search-bar {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .classroom-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
  }

  .classroom-card {
    cursor: pointer;
    transition: transform 0.2s;

    &:hover {
      transform: translateY(-4px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;

      .classroom-name {
        font-size: 16px;
        font-weight: 600;
        color: #303133;
      }
    }

    .card-body {
      .info-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
        color: #606266;
        font-size: 14px;

        .el-icon {
          color: #409eff;
        }
      }
    }

    .card-footer {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  }

  .detail-content {
    .schedule-section {
      margin-top: 20px;

      h4 {
        margin-bottom: 12px;
      }

      .schedule-item {
        display: flex;
        justify-content: space-between;

        .time {
          color: #909399;
        }

        .status {
          color: #303133;
        }
      }
    }
  }
}
</style>
