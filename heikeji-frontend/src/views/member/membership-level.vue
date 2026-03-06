<template>
  <div class="membership-level-container">
    <el-card class="current-level-card">
      <template #header>
        <div class="card-header">
          <span>我的会员等级</span>
          <el-button type="primary" @click="checkUpgrade">检查升级</el-button>
        </div>
      </template>
      <div v-loading="loading" class="current-level-content">
        <div v-if="currentLevel" class="level-info">
          <div class="level-badge">
            <div class="level-name">{{ currentLevel.name }}</div>
            <div class="level-icon">👑</div>
          </div>
          <div class="level-details">
            <div class="detail-item">
              <span class="label">折扣系数：</span>
              <span class="value discount">{{ (currentLevel.discount * 10).toFixed(1) }}折</span>
            </div>
            <div class="detail-item">
              <span class="label">积分范围：</span>
              <span class="value">
                {{ currentLevel.minPoints }} - {{ currentLevel.maxPoints || '∞' }}
              </span>
            </div>
            <div v-if="currentLevel.description" class="detail-item description">
              {{ currentLevel.description }}
            </div>
          </div>
        </div>
        <el-empty v-else description="暂无等级信息" />
      </div>
    </el-card>

    <el-card class="all-levels-card">
      <template #header>
        <span>会员等级体系</span>
      </template>
      <div v-loading="loading" class="levels-timeline">
        <el-timeline>
          <el-timeline-item
            v-for="(level, index) in allLevels"
            :key="level.id"
            :type="getTimelineType(level)"
            :size="getTimelineSize(level)"
          >
            <div class="level-card-item" :class="{ 'current': currentLevel?.id === level.id }">
              <div class="level-header">
                <div class="level-title">
                  <span class="level-name">{{ level.name }}</span>
                  <el-tag v-if="currentLevel?.id === level.id" type="success" size="small">
                    当前等级
                  </el-tag>
                </div>
                <div class="level-points">
                  <el-icon class="points-icon"><Coin /></el-icon>
                  <span>{{ level.minPoints }} 积分</span>
                </div>
              </div>
              <div class="level-body">
                <div class="level-privileges">
                  <div class="privilege-item">
                    <el-icon><Discount /></el-icon>
                    <span>折扣：{{ (level.discount * 10).toFixed(1) }}折</span>
                  </div>
                  <div v-if="level.privileges" class="privilege-list">
                    <div
                      v-for="(privilege, idx) in parsePrivileges(level.privileges)"
                      :key="idx"
                      class="privilege-item"
                    >
                      <el-icon><Star /></el-icon>
                      <span>{{ privilege }}</span>
                    </div>
                  </div>
                </div>
                <div v-if="level.description" class="level-description">
                  {{ level.description }}
                </div>
              </div>
            </div>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Coin, Discount, Star } from '@element-plus/icons-vue'
import * as memberApi from '@/api/member'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()

const loading = ref(false)
const currentLevel = ref(null)
const allLevels = ref([])

const fetchCurrentLevel = async () => {
  try {
    loading.value = true
    const userId = userStore.userId || 1
    const res = await memberApi.getCurrentLevel(userId)
    currentLevel.value = res.data || null
  } catch (error) {
    console.error('获取当前等级失败:', error)
    ElMessage.error('获取当前等级失败')
  } finally {
    loading.value = false
  }
}

const fetchAllLevels = async () => {
  try {
    loading.value = true
    const res = await memberApi.getAllLevels()
    allLevels.value = res.data || []
  } catch (error) {
    console.error('获取等级列表失败:', error)
    ElMessage.error('获取等级列表失败')
  } finally {
    loading.value = false
  }
}

const checkUpgrade = async () => {
  try {
    loading.value = true
    const userId = userStore.userId || 1
    const currentPoints = userStore.points || 0
    const res = await memberApi.checkAndUpgrade(userId, currentPoints)
    if (res.data) {
      ElMessage.success('恭喜！您已升级会员等级')
      await fetchCurrentLevel()
    } else {
      ElMessage.info('暂未达到升级条件')
    }
  } catch (error) {
    console.error('检查升级失败:', error)
    ElMessage.error(error.message || '检查升级失败')
  } finally {
    loading.value = false
  }
}

const getTimelineType = (level) => {
  if (!currentLevel.value) return 'info'
  if (level.id === currentLevel.value.id) return 'primary'
  if (level.minPoints > currentLevel.value.minPoints) return 'success'
  return 'info'
}

const getTimelineSize = (level) => {
  if (!currentLevel.value) return 'normal'
  if (level.id === currentLevel.value.id) return 'large'
  return 'normal'
}

const parsePrivileges = (privileges) => {
  try {
    return JSON.parse(privileges)
  } catch {
    return []
  }
}

onMounted(() => {
  fetchCurrentLevel()
  fetchAllLevels()
})
</script>

<style scoped>
.membership-level-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.current-level-card {
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.current-level-card :deep(.el-card__header) {
  background: rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-level-content {
  min-height: 200px;
}

.level-info {
  display: flex;
  gap: 40px;
  align-items: center;
}

.level-badge {
  flex: 0 0 200px;
  text-align: center;
}

.level-name {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 16px;
}

.level-icon {
  font-size: 64px;
}

.level-details {
  flex: 1;
}

.detail-item {
  margin-bottom: 16px;
  font-size: 16px;
}

.detail-item .label {
  opacity: 0.8;
  margin-right: 8px;
}

.detail-item .value {
  font-weight: bold;
  font-size: 18px;
}

.detail-item.discount {
  color: #ffd700;
  font-size: 24px;
}

.detail-item.description {
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.6;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.all-levels-card {
  margin-top: 20px;
}

.levels-timeline {
  padding: 20px;
}

.level-card-item {
  background: white;
  border: 2px solid #ebeef5;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.3s;
}

.level-card-item.current {
  border-color: #409eff;
  background: #f0f9ff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
}

.level-card-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.level-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.level-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.level-title .level-name {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.level-points {
  display: flex;
  align-items: center;
  color: #f56c6c;
  font-weight: bold;
  font-size: 16px;
}

.points-icon {
  margin-right: 4px;
  font-size: 18px;
}

.level-body {
  color: #606266;
}

.level-privileges {
  margin-bottom: 12px;
}

.privilege-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.privilege-list {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #ebeef5;
}

.level-description {
  line-height: 1.6;
  color: #909399;
  font-size: 14px;
}

@media (max-width: 768px) {
  .membership-level-container {
    padding: 10px;
  }

  .level-info {
    flex-direction: column;
    gap: 20px;
  }

  .level-badge {
    flex: 0 0 auto;
  }

  .level-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
