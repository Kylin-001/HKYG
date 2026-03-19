<template>
  <div class="empty-classroom-container">
    <div class="page-header">
      <div class="header-left">
        <h2>空教室查询</h2>
        <span class="subtitle">快速查询可用的教室资源</span>
      </div>
      <div class="header-right">
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="教学楼">
          <el-select
            v-model="searchForm.buildingId"
            placeholder="请选择教学楼"
            clearable
            @change="handleBuildingChange"
          >
            <el-option
              v-for="building in buildings"
              :key="building.id"
              :label="building.name"
              :value="building.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="searchForm.date"
            type="date"
            placeholder="选择日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item label="时间段">
          <el-select v-model="searchForm.classSection" placeholder="选择时间段" clearable>
            <el-option label="第1-2节 (08:00-10:00)" :value="1" />
            <el-option label="第3-4节 (10:00-12:00)" :value="2" />
            <el-option label="第5-6节 (14:00-16:00)" :value="3" />
            <el-option label="第7-8节 (16:00-18:00)" :value="4" />
            <el-option label="第9-10节 (19:00-21:00)" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-row :gutter="20" class="classroom-grid">
      <el-col v-for="classroom in classrooms" :key="classroom.id" :xs="24" :sm="12" :md="8" :lg="6">
        <el-card class="classroom-card" :class="{ 'is-available': classroom.isAvailable }">
          <div class="classroom-header">
            <h3>{{ classroom.name }}</h3>
            <el-tag :type="classroom.isAvailable ? 'success' : 'danger'" size="small">
              {{ classroom.isAvailable ? '空闲' : '使用中' }}
            </el-tag>
          </div>
          <div class="classroom-info">
            <div class="info-item">
              <span class="label">教学楼:</span>
              <span class="value">{{ getBuildingName(classroom.buildingId) }}</span>
            </div>
            <div class="info-item">
              <span class="label">楼层:</span>
              <span class="value">{{ classroom.floor }}楼</span>
            </div>
            <div class="info-item">
              <span class="label">容量:</span>
              <span class="value">{{ classroom.capacity }}人</span>
            </div>
          </div>
          <div class="classroom-actions">
            <el-button type="primary" size="small" @click="handleViewSchedule(classroom)">
              查看课程
            </el-button>
            <el-button
              size="small"
              @click="handleBookClassroom(classroom)"
              v-if="classroom.isAvailable"
            >
              预订
            </el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="classrooms.length === 0 && !loading" description="暂无可用教室" />

    <el-dialog v-model="scheduleDialogVisible" title="教室课程安排" width="700px">
      <div class="schedule-container">
        <h4>{{ selectedClassroom?.name }} - {{ searchForm.date }}</h4>
        <el-timeline>
          <el-timeline-item
            v-for="(schedule, index) in classroomSchedules"
            :key="index"
            :timestamp="`${schedule.startTime} - ${schedule.endTime}`"
            placement="top"
            :type="schedule.status === 1 ? 'primary' : 'info'"
          >
            <el-card>
              <div class="schedule-item">
                <div class="schedule-title">{{ schedule.courseName || '自习' }}</div>
                <div class="schedule-teacher" v-if="schedule.teacherName">
                  教师: {{ schedule.teacherName }}
                </div>
                <el-tag size="small" :type="schedule.status === 1 ? 'danger' : 'success'">
                  {{ schedule.status === 1 ? '已占用' : '空闲' }}
                </el-tag>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-if="classroomSchedules.length === 0" description="暂无课程安排" />
      </div>
      <template #footer>
        <el-button @click="scheduleDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Search } from '@element-plus/icons-vue'
import {
  getBuildings,
  getClassrooms,
  searchAvailableClassrooms,
  getClassroomSchedule,
} from '@/api/campus'
import type { CampusBuilding, CampusClassroom, CampusClassroomSchedule } from '@/types/campus'

const loading = ref(false)
const buildings = ref<CampusBuilding[]>([])
const classrooms = ref<any[]>([])
const classroomSchedules = ref<CampusClassroomSchedule[]>([])
const scheduleDialogVisible = ref(false)
const selectedClassroom = ref<CampusClassroom | null>(null)

const searchForm = reactive({
  buildingId: undefined as number | undefined,
  date: new Date().toISOString().split('T')[0],
  classSection: undefined as number | undefined,
})

const buildingMap = computed(() => {
  const map = new Map<number, string>()
  buildings.value.forEach(b => map.set(b.id, b.name))
  return map
})

const getBuildingName = (buildingId: number) => {
  return buildingMap.value.get(buildingId) || '未知'
}

const loadBuildings = async () => {
  try {
    const res = await getBuildings()
    buildings.value = res.data || []
  } catch (error) {
    ElMessage.error('获取教学楼列表失败')
    console.error(error)
  }
}

const searchClassrooms = async () => {
  loading.value = true
  try {
    const params = {
      buildingId: searchForm.buildingId,
      date: searchForm.date,
      classSection: searchForm.classSection,
    }
    const res = await searchAvailableClassrooms(params)
    classrooms.value = (res.data || []).map((classroom: any) => ({
      ...classroom,
      isAvailable: true,
    }))
  } catch (error) {
    ElMessage.error('查询教室失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleBuildingChange = () => {
  if (searchForm.buildingId) {
    loadClassroomsByBuilding()
  }
}

const loadClassroomsByBuilding = async () => {
  if (!searchForm.buildingId) return
  try {
    const res = await getClassrooms(searchForm.buildingId)
    classrooms.value = (res.data || []).map((classroom: any) => ({
      ...classroom,
      isAvailable: true,
    }))
  } catch (error) {
    console.error(error)
  }
}

const handleSearch = () => {
  searchClassrooms()
}

const handleReset = () => {
  searchForm.buildingId = undefined
  searchForm.date = new Date().toISOString().split('T')[0]
  searchForm.classSection = undefined
  classrooms.value = []
}

const handleRefresh = () => {
  loadBuildings()
  if (searchForm.buildingId) {
    searchClassrooms()
  }
}

const handleViewSchedule = async (classroom: any) => {
  selectedClassroom.value = classroom
  try {
    const res = await getClassroomSchedule(classroom.id, searchForm.date)
    classroomSchedules.value = res.data || []
    scheduleDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取课程安排失败')
    console.error(error)
  }
}

const handleBookClassroom = (classroom: any) => {
  ElMessage.info('预订功能开发中...')
}

onMounted(() => {
  loadBuildings()
})
</script>

<style lang="scss" scoped>
.empty-classroom-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

  .header-left {
    h2 {
      margin: 0 0 5px 0;
      font-size: 24px;
      color: #303133;
    }

    .subtitle {
      color: #909399;
      font-size: 14px;
    }
  }

  .header-right {
    display: flex;
    gap: 10px;
  }
}

.search-card {
  margin-bottom: 20px;
  border-radius: 8px;
}

.search-form {
  margin: 0;
}

.classroom-grid {
  margin-top: 20px;
}

.classroom-card {
  margin-bottom: 20px;
  transition: all 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
  }

  &.is-available {
    border-left: 4px solid #67c23a;
  }

  .classroom-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    h3 {
      margin: 0;
      font-size: 18px;
      color: #303133;
    }
  }

  .classroom-info {
    margin-bottom: 15px;

    .info-item {
      display: flex;
      margin-bottom: 8px;

      .label {
        color: #909399;
        width: 60px;
      }

      .value {
        color: #303133;
      }
    }
  }

  .classroom-actions {
    display: flex;
    gap: 10px;
  }
}

.schedule-container {
  h4 {
    margin: 0 0 20px 0;
    color: #303133;
  }

  .schedule-item {
    .schedule-title {
      font-size: 16px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 5px;
    }

    .schedule-teacher {
      color: #909399;
      font-size: 14px;
      margin-bottom: 10px;
    }
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .search-form {
    .el-form-item {
      width: 100%;
    }
  }
}
</style>
