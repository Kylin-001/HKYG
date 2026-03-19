<template>
  <div class="announcement-container">
    <div class="page-header">
      <div class="header-left">
        <h2>校园公告</h2>
        <span class="subtitle">及时了解校园最新动态</span>
      </div>
      <div class="header-right">
        <el-button @click="handleRefresh">
          <el-icon><Refresh /></el-icon>
          刷新
        </el-button>
      </div>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="16" :lg="18">
        <el-card class="announcement-list-card">
          <template #header>
            <div class="card-header">
              <span>公告列表</span>
              <el-tabs v-model="activeTab" @tab-change="handleTabChange">
                <el-tab-pane label="全部" name="all" />
                <el-tab-pane label="置顶" name="top" />
              </el-tabs>
            </div>
          </template>

          <div class="search-box">
            <el-input
              v-model="searchForm.keyword"
              placeholder="搜索公告标题"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>

          <div class="announcement-list" v-loading="loading">
            <div
              v-for="announcement in announcements"
              :key="announcement.id"
              class="announcement-item"
              @click="handleViewDetail(announcement)"
            >
              <div class="announcement-tag" v-if="announcement.isTop">
                <el-tag type="danger" size="small">置顶</el-tag>
              </div>
              <div class="announcement-tag" v-else-if="announcement.priority === 3">
                <el-tag type="warning" size="small">紧急</el-tag>
              </div>
              <div class="announcement-tag" v-else-if="announcement.priority === 2">
                <el-tag type="primary" size="small">重要</el-tag>
              </div>
              <div class="announcement-content">
                <h4 class="announcement-title">
                  {{ announcement.title }}
                </h4>
                <div class="announcement-meta">
                  <span class="meta-item">
                    <el-icon><Calendar /></el-icon>
                    {{ formatDate(announcement.publishTime) }}
                  </span>
                  <span class="meta-item">
                    <el-icon><View /></el-icon>
                    {{ announcement.viewCount }}次阅读
                  </span>
                </div>
              </div>
              <el-icon class="arrow-icon"><ArrowRight /></el-icon>
            </div>

            <el-empty v-if="announcements.length === 0 && !loading" description="暂无公告" />
          </div>

          <div class="pagination-container" v-if="total > 0">
            <el-pagination
              v-model:current-page="pagination.currentPage"
              v-model:page-size="pagination.pageSize"
              :page-sizes="[10, 20, 50]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="24" :md="8" :lg="6">
        <el-card class="category-card">
          <template #header>
            <div class="card-header">
              <span>公告分类</span>
            </div>
          </template>
          <div class="category-list">
            <div
              v-for="category in categories"
              :key="category.id"
              class="category-item"
              :class="{ active: searchForm.categoryId === category.id }"
              @click="handleSelectCategory(category.id)"
            >
              <span class="category-name">{{ category.name }}</span>
              <span class="category-count">0</span>
            </div>
            <div
              class="category-item"
              :class="{ active: !searchForm.categoryId }"
              @click="handleSelectCategory(undefined)"
            >
              <span class="category-name">全部分类</span>
            </div>
          </div>
        </el-card>

        <el-card class="top-announcements-card">
          <template #header>
            <div class="card-header">
              <span>热门公告</span>
            </div>
          </template>
          <div class="top-announcements-list">
            <div
              v-for="(announcement, index) in topAnnouncements"
              :key="announcement.id"
              class="top-announcement-item"
              @click="handleViewDetail(announcement)"
            >
              <span class="top-index" :class="`top-${index + 1}`">{{ index + 1 }}</span>
              <span class="top-title">{{ announcement.title }}</span>
            </div>
            <el-empty
              v-if="topAnnouncements.length === 0"
              description="暂无热门公告"
              :image-size="80"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-model="detailDialogVisible"
      :title="selectedAnnouncement?.title"
      width="800px"
      class="announcement-detail-dialog"
    >
      <div class="announcement-detail" v-if="selectedAnnouncement">
        <div class="detail-header">
          <div class="detail-meta">
            <span class="meta-item">
              <el-icon><Calendar /></el-icon>
              发布时间: {{ formatDate(selectedAnnouncement.publishTime) }}
            </span>
            <span class="meta-item">
              <el-icon><View /></el-icon>
              阅读次数: {{ selectedAnnouncement.viewCount }}
            </span>
          </div>
        </div>
        <div class="detail-content" v-html="selectedAnnouncement.content"></div>
      </div>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Refresh, Search, Calendar, View, ArrowRight } from '@element-plus/icons-vue'
import {
  getAnnouncements,
  getAnnouncementById,
  getAnnouncementCategories,
  getTopAnnouncements,
  getPublishedAnnouncements,
} from '@/api/campus'
import type { CampusAnnouncement, CampusAnnouncementCategory } from '@/types/campus'

const loading = ref(false)
const announcements = ref<CampusAnnouncement[]>([])
const topAnnouncements = ref<CampusAnnouncement[]>([])
const categories = ref<CampusAnnouncementCategory[]>([])
const total = ref(0)
const activeTab = ref('all')
const detailDialogVisible = ref(false)
const selectedAnnouncement = ref<CampusAnnouncement | null>(null)

const searchForm = reactive({
  keyword: '',
  categoryId: undefined as number | undefined,
  pageNum: 1,
  pageSize: 10,
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

const loadAnnouncements = async () => {
  loading.value = true
  try {
    const params = {
      ...searchForm,
      pageNum: pagination.currentPage,
      pageSize: pagination.pageSize,
    }
    const res = await getAnnouncements(params)
    announcements.value = res.data?.list || []
    total.value = res.data?.total || 0
  } catch (error) {
    ElMessage.error('获取公告列表失败')
    console.error(error)
  } finally {
    loading.value = false
  }
}

const loadCategories = async () => {
  try {
    const res = await getAnnouncementCategories()
    categories.value = res.data || []
  } catch (error) {
    console.error('获取分类失败', error)
  }
}

const loadTopAnnouncements = async () => {
  try {
    const res = await getTopAnnouncements()
    topAnnouncements.value = (res.data || []).slice(0, 5)
  } catch (error) {
    console.error('获取热门公告失败', error)
  }
}

const handleSearch = () => {
  pagination.currentPage = 1
  loadAnnouncements()
}

const handleTabChange = (tabName: string) => {
  if (tabName === 'top') {
    loadTopAnnouncements()
  } else {
    loadAnnouncements()
  }
}

const handleSelectCategory = (categoryId: number | undefined) => {
  searchForm.categoryId = categoryId
  pagination.currentPage = 1
  loadAnnouncements()
}

const handleViewDetail = async (announcement: CampusAnnouncement) => {
  try {
    const res = await getAnnouncementById(announcement.id)
    selectedAnnouncement.value = res.data
    detailDialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取公告详情失败')
    console.error(error)
  }
}

const handleRefresh = () => {
  loadAnnouncements()
  loadCategories()
  loadTopAnnouncements()
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadAnnouncements()
}

const handleCurrentChange = (page: number) => {
  pagination.currentPage = page
  loadAnnouncements()
}

onMounted(() => {
  loadAnnouncements()
  loadCategories()
  loadTopAnnouncements()
})
</script>

<style lang="scss" scoped>
.announcement-container {
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

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.announcement-list-card {
  border-radius: 8px;
  margin-bottom: 20px;

  .search-box {
    margin-bottom: 20px;
  }

  .announcement-list {
    .announcement-item {
      display: flex;
      align-items: center;
      padding: 15px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 10px;
      background-color: #fafafa;

      &:hover {
        background-color: #ecf5ff;
      }

      .announcement-tag {
        margin-right: 10px;
        flex-shrink: 0;
      }

      .announcement-content {
        flex: 1;
        min-width: 0;

        .announcement-title {
          margin: 0 0 8px 0;
          font-size: 16px;
          color: #303133;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .announcement-meta {
          display: flex;
          gap: 20px;

          .meta-item {
            display: flex;
            align-items: center;
            gap: 4px;
            color: #909399;
            font-size: 13px;
          }
        }
      }

      .arrow-icon {
        color: #c0c4cc;
        flex-shrink: 0;
      }
    }
  }

  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}

.category-card,
.top-announcements-card {
  border-radius: 8px;
  margin-bottom: 20px;

  .category-list {
    .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 15px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s;
      margin-bottom: 8px;

      &:hover {
        background-color: #f5f7fa;
      }

      &.active {
        background-color: #ecf5ff;
        color: #409eff;

        .category-name {
          font-weight: 600;
        }
      }

      .category-name {
        color: #303133;
      }

      .category-count {
        color: #909399;
        font-size: 13px;
      }
    }
  }

  .top-announcements-list {
    .top-announcement-item {
      display: flex;
      align-items: center;
      padding: 10px 0;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        .top-title {
          color: #409eff;
        }
      }

      .top-index {
        width: 24px;
        height: 24px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        font-weight: 600;
        color: #fff;
        margin-right: 10px;
        flex-shrink: 0;

        &.top-1 {
          background-color: #f56c6c;
        }

        &.top-2 {
          background-color: #e6a23c;
        }

        &.top-3 {
          background-color: #409eff;
        }

        &:not(.top-1):not(.top-2):not(.top-3) {
          background-color: #909399;
        }
      }

      .top-title {
        color: #303133;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        transition: color 0.3s;
      }
    }
  }
}

.announcement-detail-dialog {
  :deep(.el-dialog__body) {
    padding: 20px 30px;
  }
}

.announcement-detail {
  .detail-header {
    border-bottom: 1px solid #ebeef5;
    padding-bottom: 15px;
    margin-bottom: 20px;

    .detail-meta {
      display: flex;
      gap: 20px;

      .meta-item {
        display: flex;
        align-items: center;
        gap: 4px;
        color: #909399;
        font-size: 14px;
      }
    }
  }

  .detail-content {
    line-height: 1.8;
    color: #303133;
    font-size: 15px;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
}
</style>
