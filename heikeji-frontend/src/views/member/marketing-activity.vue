<template>
  <div class="marketing-activity-container">
    <el-card class="activities-card">
      <template #header>
        <div class="card-header">
          <span>营销活动</span>
          <el-radio-group v-model="filterStatus" size="small">
            <el-radio-button label="">全部</el-radio-button>
            <el-radio-button label="available">可参与</el-radio-button>
            <el-radio-button label="completed">已完成</el-radio-button>
          </el-radio-group>
        </div>
      </template>

      <div v-loading="loading" class="activities-grid">
        <div
          v-for="activity in filteredActivities"
          :key="activity.id"
          class="activity-item"
          @click="showActivityDetail(activity)"
        >
          <div class="activity-header">
            <div class="activity-type">
              <el-tag :type="getActivityTypeTag(activity.type)" size="small">
                {{ getActivityTypeName(activity.type) }}
              </el-tag>
            </div>
            <div v-if="activity.isCompleted" class="activity-status completed">
              <el-icon><CircleCheck /></el-icon>
              <span>已完成</span>
            </div>
            <div v-else-if="!activity.canParticipate" class="activity-status disabled">
              <el-icon><CircleClose /></el-icon>
              <span>已参与</span>
            </div>
          </div>
          <div class="activity-body">
            <h3 class="activity-name">{{ activity.name }}</h3>
            <div class="activity-time">
              <el-icon><Calendar /></el-icon>
              <span>{{ formatTimeRange(activity.startTime, activity.endTime) }}</span>
            </div>
            <div v-if="activity.description" class="activity-description">
              {{ activity.description }}
            </div>
          </div>
          <div class="activity-footer">
            <el-button
              v-if="activity.canParticipate"
              type="primary"
              size="small"
              @click.stop="handleParticipate(activity)"
            >
              立即参与
            </el-button>
            <el-button v-else-if="!activity.isCompleted" type="info" size="small" disabled>
              已参与
            </el-button>
            <el-button v-else type="success" size="small" disabled> 已完成 </el-button>
          </div>
        </div>

        <el-empty v-if="filteredActivities.length === 0" description="暂无活动" />
      </div>
    </el-card>

    <el-dialog
      v-model="detailDialogVisible"
      :title="selectedActivity?.name"
      width="700px"
      @close="handleCloseDetail"
    >
      <div v-if="selectedActivity" class="activity-detail">
        <div class="detail-header">
          <el-tag :type="getActivityTypeTag(selectedActivity.type)" size="large">
            {{ getActivityTypeName(selectedActivity.type) }}
          </el-tag>
          <div class="detail-status">
            <el-tag v-if="selectedActivity.isCompleted" type="success">已完成</el-tag>
            <el-tag v-else-if="!selectedActivity.canParticipate" type="info">已参与</el-tag>
            <el-tag v-else type="warning">可参与</el-tag>
          </div>
        </div>
        <div class="detail-body">
          <div class="detail-section">
            <h4>活动时间</h4>
            <p>{{ formatTimeRange(selectedActivity.startTime, selectedActivity.endTime) }}</p>
          </div>
          <div v-if="selectedActivity.description" class="detail-section">
            <h4>活动说明</h4>
            <p>{{ selectedActivity.description }}</p>
          </div>
          <div v-if="selectedActivity.config" class="detail-section">
            <h4>活动配置</h4>
            <pre>{{ formatConfig(selectedActivity.config) }}</pre>
          </div>
        </div>
        <div class="detail-actions">
          <el-button
            v-if="selectedActivity.canParticipate"
            type="primary"
            size="large"
            @click="handleParticipate(selectedActivity)"
            :loading="participating"
          >
            立即参与
          </el-button>
          <el-button v-else-if="!selectedActivity.isCompleted" type="info" size="large" disabled>
            已参与
          </el-button>
          <el-button v-else type="success" size="large" disabled> 已完成 </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Calendar, CircleCheck, CircleClose } from '@element-plus/icons-vue'
import * as memberApi from '@/api/member'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const loading = ref(false)
const activities = ref([])
const filterStatus = ref('')
const detailDialogVisible = ref(false)
const selectedActivity = ref(null)
const participating = ref(false)

const filteredActivities = computed(() => {
  if (!filterStatus.value) {
    return activities.value
  }
  if (filterStatus.value === 'available') {
    return activities.value.filter(a => a.canParticipate)
  }
  if (filterStatus.value === 'completed') {
    return activities.value.filter(a => a.isCompleted)
  }
  return activities.value
})

const fetchActivities = async () => {
  try {
    loading.value = true
    const userId = userStore.userId || 1
    const res = await memberApi.getAvailableActivities(userId)
    activities.value = res.data || []
  } catch (error) {
    console.error('获取活动列表失败:', error)
    ElMessage.error('获取活动列表失败')
  } finally {
    loading.value = false
  }
}

const showActivityDetail = activity => {
  selectedActivity.value = activity
  detailDialogVisible.value = true
}

const handleCloseDetail = () => {
  selectedActivity.value = null
  detailDialogVisible.value = false
}

const handleParticipate = async activity => {
  try {
    await ElMessageBox.confirm(`确定要参与活动"${activity.name}"吗？`, '确认参与', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    })

    participating.value = true
    const userId = userStore.userId || 1
    await memberApi.participateActivity(activity.id, userId)
    ElMessage.success('参与成功')
    detailDialogVisible.value = false
    await fetchActivities()
  } catch (error) {
    if (error !== 'cancel') {
      console.error('参与活动失败:', error)
      ElMessage.error(error.message || '参与活动失败')
    }
  } finally {
    participating.value = false
  }
}

const getActivityTypeTag = type => {
  const typeMap = {
    1: 'primary',
    2: 'success',
    3: 'warning',
  }
  return typeMap[type] || 'info'
}

const getActivityTypeName = type => {
  const typeMap = {
    1: '优惠券活动',
    2: '积分活动',
    3: '满减活动',
  }
  return typeMap[type] || '其他活动'
}

const formatTimeRange = (startTime, endTime) => {
  if (!startTime || !endTime) return ''
  const start = new Date(startTime)
  const end = new Date(endTime)
  return `${start.toLocaleDateString('zh-CN')} - ${end.toLocaleDateString('zh-CN')}`
}

const formatConfig = config => {
  try {
    return JSON.stringify(JSON.parse(config), null, 2)
  } catch {
    return config
  }
}

onMounted(() => {
  fetchActivities()
})
</script>

<style scoped>
.marketing-activity-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  min-height: 400px;
}

.activity-item {
  border: 1px solid #ebeef5;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
  background: white;
  display: flex;
  flex-direction: column;
}

.activity-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.activity-type {
  flex: 1;
}

.activity-status {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #909399;
}

.activity-status.completed {
  color: #67c23a;
}

.activity-status.disabled {
  color: #909399;
}

.activity-body {
  flex: 1;
  padding: 16px;
}

.activity-name {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 12px 0;
  color: #303133;
}

.activity-time {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #606266;
  font-size: 14px;
  margin-bottom: 12px;
}

.activity-description {
  color: #909399;
  font-size: 14px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.activity-footer {
  padding: 12px 16px;
  border-top: 1px solid #ebeef5;
  text-align: right;
}

.activity-detail {
  padding: 20px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ebeef5;
}

.detail-body {
  margin-bottom: 24px;
}

.detail-section {
  margin-bottom: 20px;
}

.detail-section h4 {
  font-size: 16px;
  font-weight: bold;
  margin: 0 0 8px 0;
  color: #303133;
}

.detail-section p {
  color: #606266;
  line-height: 1.6;
  margin: 0;
}

.detail-section pre {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  color: #606266;
  overflow-x: auto;
}

.detail-actions {
  text-align: right;
}

@media (max-width: 768px) {
  .marketing-activity-container {
    padding: 10px;
  }

  .activities-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .activity-item:hover {
    transform: none;
  }
}
</style>
