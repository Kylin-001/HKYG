<template>
  <div class="announcement-container">
    <div class="header-actions" v-if="isAdmin">
      <el-button type="primary" @click="handlePublish">发布公告</el-button>
    </div>

    <el-tabs v-model="activeTab" @tab-change="handleTabChange">
      <el-tab-pane label="全部公告" name="all" />
      <el-tab-pane label="系统通知" name="system" />
      <el-tab-pane label="活动公告" name="activity" />
      <el-tab-pane label="重要通知" name="notice" />
    </el-tabs>

    <div class="search-bar" v-if="isAdmin">
      <el-form :model="searchForm" inline>
        <el-form-item label="关键词">
          <el-input
            v-model="searchForm.keyword"
            placeholder="搜索标题/内容"
            clearable
            @keyup.enter="handleSearch"
          />
        </el-form-item>
        <el-form-item label="重要性">
          <el-select
            v-model="searchForm.importance"
            placeholder="选择重要性"
            clearable
            @change="handleSearch"
          >
            <el-option label="低" value="low" />
            <el-option label="普通" value="normal" />
            <el-option label="重要" value="high" />
            <el-option label="紧急" value="urgent" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="searchForm.status"
            placeholder="选择状态"
            clearable
            @change="handleSearch"
          >
            <el-option label="草稿" value="draft" />
            <el-option label="已发布" value="published" />
            <el-option label="已归档" value="archived" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <div class="announcement-list" v-loading="loading">
      <el-empty v-if="!loading && list.length === 0" description="暂无公告" />
      <div
        v-for="item in list"
        :key="item.id"
        class="announcement-item"
        :class="{ 'is-read': item.isRead, 'is-important': item.importance === 'urgent' }"
        @click="handleView(item)"
      >
        <div class="item-icon">
          <el-icon :size="24">
            <BellFilled v-if="item.importance === 'urgent'" />
            <Notification v-else-if="item.type === 'system'" />
            <Calendar v-else-if="item.type === 'activity'" />
            <Memo v-else />
          </el-icon>
        </div>
        <div class="item-content">
          <div class="item-header">
            <span class="item-title">{{ item.title }}</span>
            <div class="item-tags">
              <el-tag v-if="item.importance === 'urgent'" type="danger" size="small">紧急</el-tag>
              <el-tag v-if="item.importance === 'high'" type="warning" size="small">重要</el-tag>
              <el-tag :type="getTypeColor(item.type)" size="small">{{
                getTypeName(item.type)
              }}</el-tag>
            </div>
          </div>
          <div class="item-body">{{ item.content }}</div>
          <div class="item-footer">
            <span class="item-time">{{ formatTime(item.publishTime) }}</span>
            <span class="item-publisher">{{ item.publisher }}</span>
            <span class="item-read-count"
              ><el-icon><View /></el-icon> {{ item.readCount }}</span
            >
          </div>
        </div>
        <div class="item-actions" v-if="isAdmin" @click.stop>
          <el-button link type="primary" @click="handleEdit(item)">编辑</el-button>
          <el-button link type="danger" @click="handleDelete(item)">删除</el-button>
        </div>
      </div>
    </div>

    <div class="pagination" v-if="total > 0">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <el-dialog v-model="detailVisible" :title="currentAnnouncement?.title" width="700px">
      <div class="detail-content" v-if="currentAnnouncement">
        <div class="detail-header">
          <el-tag :type="getTypeColor(currentAnnouncement.type)" size="large">{{
            getTypeName(currentAnnouncement.type)
          }}</el-tag>
          <el-tag v-if="currentAnnouncement.importance === 'urgent'" type="danger" size="large"
            >紧急</el-tag
          >
          <el-tag v-if="currentAnnouncement.importance === 'high'" type="warning" size="large"
            >重要</el-tag
          >
          <span class="detail-time"
            >发布时间: {{ formatTime(currentAnnouncement.publishTime) }}</span
          >
        </div>
        <el-divider />
        <div class="detail-body">{{ currentAnnouncement.content }}</div>
        <div class="detail-attach" v-if="currentAnnouncement.attachmentUrl">
          <el-link :href="currentAnnouncement.attachmentUrl" type="primary" target="_blank">
            <el-icon><Attachment /></el-icon>
            {{ currentAnnouncement.attachmentName || '附件下载' }}
          </el-link>
        </div>
      </div>
    </el-dialog>

    <el-dialog v-model="publishVisible" :title="isEdit ? '编辑公告' : '发布公告'" width="800px">
      <el-form :model="publishForm" :rules="publishRules" ref="publishFormRef" label-width="100px">
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="publishForm.title"
            placeholder="请输入公告标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-radio-group v-model="publishForm.type">
            <el-radio label="system">系统通知</el-radio>
            <el-radio label="activity">活动公告</el-radio>
            <el-radio label="notice">重要通知</el-radio>
            <el-radio label="emergency">紧急通知</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="重要性" prop="importance">
          <el-radio-group v-model="publishForm.importance">
            <el-radio label="low">低</el-radio>
            <el-radio label="normal">普通</el-radio>
            <el-radio label="high">重要</el-radio>
            <el-radio label="urgent">紧急</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            v-model="publishForm.content"
            type="textarea"
            :rows="8"
            placeholder="请输入公告内容"
            maxlength="5000"
            show-word-limit
          />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="生效时间" prop="validFrom">
              <el-date-picker
                v-model="publishForm.validFrom"
                type="datetime"
                placeholder="选择生效时间"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失效时间" prop="validUntil">
              <el-date-picker
                v-model="publishForm.validUntil"
                type="datetime"
                placeholder="选择失效时间"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="目标用户">
          <el-select
            v-model="publishForm.targetRoles"
            multiple
            placeholder="选择目标角色"
            style="width: 100%"
          >
            <el-option label="全部用户" value="all" />
            <el-option label="管理员" value="admin" />
            <el-option label="商家" value="merchant" />
            <el-option label="用户" value="user" />
            <el-option label="配送员" value="courier" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="publishVisible = false">取消</el-button>
        <el-button @click="handleSaveDraft">保存草稿</el-button>
        <el-button type="primary" @click="handleSubmitPublish">发布</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { BellFilled, Notification, Calendar, Memo, View, Attachment } from '@element-plus/icons-vue'
import * as announcementApi from '@/api/announcement'

interface Announcement {
  id: string
  title: string
  content: string
  type: string
  importance: string
  publishTime: string
  publisher: string
  readCount: number
  isRead?: boolean
  attachmentUrl?: string
  attachmentName?: string
  validFrom: string
  validUntil: string
}

const isAdmin = ref(true)
const loading = ref(false)
const activeTab = ref('all')
const list = ref<Announcement[]>([])
const total = ref(0)
const detailVisible = ref(false)
const publishVisible = ref(false)
const isEdit = ref(false)
const currentAnnouncement = ref<Announcement | null>(null)
const publishFormRef = ref()

const searchForm = reactive({
  keyword: '',
  importance: '',
  type: '',
  status: '',
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
})

const publishForm = reactive({
  id: '',
  title: '',
  content: '',
  type: 'system',
  importance: 'normal',
  validFrom: '',
  validUntil: '',
  targetRoles: [] as string[],
})

const publishRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
  type: [{ required: true, message: '请选择类型', trigger: 'change' }],
  importance: [{ required: true, message: '请选择重要性', trigger: 'change' }],
}

const getTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    system: 'primary',
    activity: 'success',
    notice: 'warning',
    emergency: 'danger',
  }
  return colors[type] || 'info'
}

const getTypeName = (type: string) => {
  const names: Record<string, string> = {
    system: '系统通知',
    activity: '活动公告',
    notice: '重要通知',
    emergency: '紧急通知',
  }
  return names[type] || type
}

const formatTime = (time: string) => {
  if (!time) return ''
  return new Date(time).toLocaleString('zh-CN')
}

const fetchList = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      type: activeTab.value !== 'all' ? activeTab.value : undefined,
      page: pagination.currentPage,
      size: pagination.pageSize,
    }
    const res = await announcementApi.getAnnouncements(params)
    list.value = res.data.records || []
    total.value = res.data.total || 0
  } catch (error) {
    ElMessage.error('获取列表失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.currentPage = 1
  fetchList()
}

const handleReset = () => {
  searchForm.keyword = ''
  searchForm.importance = ''
  searchForm.status = ''
  handleSearch()
}

const handleTabChange = () => {
  handleSearch()
}

const handleSizeChange = () => {
  fetchList()
}

const handleCurrentChange = () => {
  fetchList()
}

const handleView = async (item: Announcement) => {
  currentAnnouncement.value = item
  detailVisible.value = true

  if (!item.isRead) {
    await announcementApi.markAnnouncementRead(item.id)
    item.isRead = true
  }
}

const handlePublish = () => {
  isEdit.value = false
  Object.assign(publishForm, {
    id: '',
    title: '',
    content: '',
    type: 'system',
    importance: 'normal',
    validFrom: new Date(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    targetRoles: ['all'],
  })
  publishVisible.value = true
}

const handleEdit = (item: Announcement) => {
  isEdit.value = true
  Object.assign(publishForm, item)
  publishVisible.value = true
}

const handleDelete = async (item: Announcement) => {
  try {
    await ElMessageBox.confirm('确定删除该公告吗?', '提示', { type: 'warning' })
    await announcementApi.deleteAnnouncement(item.id)
    ElMessage.success('删除成功')
    fetchList()
  } catch {}
}

const handleSaveDraft = async () => {
  try {
    await publishFormRef.value?.validate()
    const data = { ...publishForm, status: 'draft' }
    if (isEdit.value) {
      await announcementApi.updateAnnouncement(publishForm.id, data)
    } else {
      await announcementApi.publishAnnouncement(data)
    }
    ElMessage.success('保存成功')
    publishVisible.value = false
    fetchList()
  } catch {}
}

const handleSubmitPublish = async () => {
  try {
    await publishFormRef.value?.validate()
    const data = { ...publishForm, status: 'published' }
    if (isEdit.value) {
      await announcementApi.updateAnnouncement(publishForm.id, data)
    } else {
      await announcementApi.publishAnnouncement(data)
    }
    ElMessage.success('发布成功')
    publishVisible.value = false
    fetchList()
  } catch {}
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped lang="scss">
.announcement-container {
  padding: 20px;

  .header-actions {
    margin-bottom: 16px;
  }

  .search-bar {
    background: #fff;
    padding: 16px;
    border-radius: 8px;
    margin-bottom: 16px;
  }

  .announcement-list {
    .announcement-item {
      display: flex;
      gap: 16px;
      padding: 16px;
      background: #fff;
      border-radius: 8px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
      }

      &.is-read {
        opacity: 0.7;
      }

      &.is-important {
        border-left: 4px solid #f56c6c;
      }

      .item-icon {
        flex-shrink: 0;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #ecf5ff;
        border-radius: 8px;
        color: #409eff;
      }

      .item-content {
        flex: 1;
        min-width: 0;

        .item-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;

          .item-title {
            font-size: 16px;
            font-weight: 600;
            color: #303133;
          }

          .item-tags {
            display: flex;
            gap: 4px;
          }
        }

        .item-body {
          color: #606266;
          font-size: 14px;
          margin-bottom: 8px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .item-footer {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #909399;

          .item-read-count {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }

      .item-actions {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
    }
  }

  .pagination {
    margin-top: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .detail-content {
    .detail-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;

      .detail-time {
        margin-left: auto;
        color: #909399;
        font-size: 14px;
      }
    }

    .detail-body {
      font-size: 15px;
      line-height: 1.8;
      color: #303133;
      white-space: pre-wrap;
    }

    .detail-attach {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }
  }
}
</style>
