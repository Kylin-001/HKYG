<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAnnouncementStore } from '@/stores/announcement'
import { Search, View, Star, Document, EditPen, Trophy, Briefcase, Bell, Calendar, ArrowRight, Filter } from '@element-plus/icons-vue'

const router = useRouter()
const store = useAnnouncementStore()

const keyword = ref('')
const activeType = ref('')

const typeOptions = [
  { value: '', label: '全部公告', icon: Star, color: 'from-slate-500 to-slate-600', bgColor: 'bg-slate-50', textColor: 'text-slate-600', borderColor: 'border-slate-200' },
  { value: 'teaching', label: '教学通知', icon: Document, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', textColor: 'text-blue-600', borderColor: 'border-blue-200' },
  { value: 'student', label: '学工通知', icon: EditPen, color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50', textColor: 'text-amber-600', borderColor: 'border-amber-200' },
  { value: 'activity', label: '校园活动', icon: Trophy, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50', textColor: 'text-emerald-600', borderColor: 'border-emerald-200' },
  { value: 'recruitment', label: '招聘信息', icon: Briefcase, color: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-50', textColor: 'text-rose-600', borderColor: 'border-rose-200' },
]

function handleSearch() {
  store.fetchAnnouncements({ type: activeType.value, keyword: keyword.value })
}

function handleTypeChange(type: string) {
  activeType.value = type
  store.fetchAnnouncements({ type, keyword: keyword.value })
}

function getTypeOption(type: string) {
  return typeOptions.find(t => t.value === type) || typeOptions[0]
}

onMounted(() => {
  store.fetchAnnouncements()
})
</script>

<template>
  <div class="announcement-container">
    <!-- Header Section with Gradient Background -->
    <section class="header-section">
      <div class="header-content">
        <h1 class="header-title">
          <span class="title-icon">
            <el-icon :size="28"><Bell /></el-icon>
          </span>
          信息公告
        </h1>
        <p class="header-subtitle">校园最新动态，一手掌握</p>
      </div>
    </section>

    <!-- Search & Filter Section -->
    <section class="filter-section">
      <!-- Search Bar -->
      <div class="search-bar">
        <div class="search-input-wrapper">
          <el-icon :size="18" class="search-icon">
            <Search />
          </el-icon>
          <input
            v-model="keyword"
            @keyup.enter="handleSearch"
            placeholder="搜索公告标题、内容..."
            class="search-input"
          />
        </div>
        <button @click="handleSearch" class="search-button">
          <el-icon :size="16"><Search /></el-icon>
          <span>搜索</span>
        </button>
      </div>

      <!-- Filter Tags -->
      <div class="filter-tags">
        <span class="filter-label">
          <el-icon :size="14"><Filter /></el-icon>
          筛选
        </span>
        <div class="tags-wrapper">
          <button
            v-for="opt in typeOptions"
            :key="opt.value"
            @click="handleTypeChange(opt.value)"
            :class="['filter-tag', { 'active': activeType === opt.value }]"
            :style="activeType === opt.value ? {
              background: `linear-gradient(135deg, var(--tw-gradient-stops))`
            } : {}"
          >
            <span v-if="activeType === opt.value" class="tag-gradient" :class="opt.color"></span>
            <el-icon :size="14"><component :is="opt.icon" /></el-icon>
            <span>{{ opt.label }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Announcement List -->
    <section v-if="store.announcements.length > 0" class="list-section">
      <!-- List Header -->
      <div class="list-header">
        <h2 class="list-title">
          <span class="title-bar"></span>
          公告列表
          <span class="list-count">({{ store.announcements.length }}条)</span>
        </h2>
        <div class="list-sort">
          <span>排序:</span>
          <select class="sort-select">
            <option>最新发布</option>
            <option>最多浏览</option>
          </select>
        </div>
      </div>

      <!-- Cards -->
      <div class="cards-container">
        <div
          v-for="(item, index) in store.announcements"
          :key="item.id"
          @click="router.push(`/announcements/${item.id}`)"
          class="announcement-card"
          :style="{ animationDelay: `${index * 0.05}s` }"
        >
          <!-- Left Accent Line -->
          <div class="card-accent" :class="item.isTop ? 'accent-top' : getTypeOption(item.type).textColor.replace('text-', 'accent-')"></div>

          <div class="card-content">
            <!-- Type Icon / Badge -->
            <div class="card-icon-wrapper">
              <div
                v-if="item.isTop"
                class="icon-badge icon-top"
              >
                <svg class="top-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                </svg>
              </div>
              <div
                v-else
                class="icon-badge"
                :class="getTypeOption(item.type).bgColor"
              >
                <el-icon :size="22" :class="getTypeOption(item.type).textColor">
                  <component :is="getTypeOption(item.type).icon" />
                </el-icon>
              </div>
            </div>

            <!-- Content -->
            <div class="card-body">
              <!-- Title Row -->
              <div class="card-title-row">
                <span
                  v-if="item.isTop"
                  class="badge badge-top"
                >
                  置顶
                </span>
                <span
                  v-else
                  class="badge"
                  :class="[getTypeOption(item.type).bgColor, getTypeOption(item.type).textColor]"
                >
                  {{ getTypeOption(item.type).label }}
                </span>
                <h3 class="card-title">
                  {{ item.title }}
                </h3>
              </div>

              <!-- Description -->
              <p class="card-description">
                {{ item.content ? item.content.replace(/<[^>]+>/g, '').slice(0, 120) : '暂无内容描述...' }}
              </p>

              <!-- Meta Info -->
              <div class="card-meta">
                <span class="meta-item">
                  <el-icon :size="13"><Calendar /></el-icon>
                  {{ item.publishedAt }}
                </span>
                <span class="meta-item">
                  <svg class="meta-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  {{ item.department }}
                </span>
                <span class="meta-item">
                  <el-icon :size="13"><View /></el-icon>
                  {{ item.viewCount }}
                </span>
              </div>
            </div>

            <!-- Arrow -->
            <div class="card-arrow">
              <div class="arrow-circle">
                <el-icon :size="16"><ArrowRight /></el-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Empty State -->
    <div v-else-if="!store.loading" class="empty-state">
      <div class="empty-icon">
        <el-icon :size="48"><Bell /></el-icon>
      </div>
      <h3 class="empty-title">暂无公告</h3>
      <p class="empty-desc">试试调整筛选条件或搜索关键词</p>
    </div>

    <!-- Loading State -->
    <div v-if="store.loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>
  </div>
</template>

<style scoped>
/* ====== Container ====== */
.announcement-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  min-height: 100vh;
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
}

/* ====== Header Section ====== */
.header-section {
  position: relative;
  margin-bottom: 24px;
  padding: 40px 32px;
  background: linear-gradient(135deg, #000AB0 0%, #1e40af 50%, #3b82f6 100%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px -10px rgba(0, 10, 176, 0.3);
}

.header-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  opacity: 0.5;
}

.header-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.header-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  font-size: 32px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.header-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-weight: 400;
}

/* ====== Filter Section ====== */
.filter-section {
  background: white;
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

/* Search Bar */
.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 15px;
  background: #f8fafc;
  color: #1e293b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
}

.search-input::placeholder {
  color: #94a3b8;
}

.search-input:hover {
  border-color: #cbd5e1;
  background: white;
}

.search-input:focus {
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.search-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #000AB0 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(0, 10, 176, 0.25);
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 10, 176, 0.35);
}

.search-button:active {
  transform: translateY(0);
}

/* Filter Tags */
.filter-tags {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  white-space: nowrap;
}

.tags-wrapper {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-tag {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: #f1f5f9;
  border: 2px solid transparent;
  border-radius: 50px;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.filter-tag:hover {
  background: #e2e8f0;
  color: #475569;
  transform: translateY(-1px);
}

.filter-tag.active {
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
}

.tag-gradient {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.filter-tag.active > *:not(.tag-gradient) {
  position: relative;
  z-index: 1;
}

/* ====== List Section ====== */
.list-section {
  animation: fadeIn 0.5s ease-out;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 0 4px;
}

.list-title {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.title-bar {
  width: 4px;
  height: 24px;
  background: linear-gradient(180deg, #000AB0 0%, #3b82f6 100%);
  border-radius: 2px;
}

.list-count {
  font-size: 14px;
  font-weight: 500;
  color: #94a3b8;
}

.list-sort {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #64748b;
}

.sort-select {
  background: transparent;
  border: none;
  outline: none;
  color: #1e293b;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}

/* ====== Cards ====== */
.cards-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.announcement-card {
  position: relative;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideUp 0.5s ease-out backwards;
}

.announcement-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.12);
  border-color: #bfdbfe;
}

.card-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.announcement-card:hover .card-accent {
  opacity: 1;
}

.accent-top {
  background: linear-gradient(180deg, #f43f5e 0%, #fb7185 100%);
}

.accent-blue-600 {
  background: linear-gradient(180deg, #2563eb 0%, #3b82f6 100%);
}

.accent-amber-600 {
  background: linear-gradient(180deg, #d97706 0%, #f59e0b 100%);
}

.accent-emerald-600 {
  background: linear-gradient(180deg, #059669 0%, #10b981 100%);
}

.accent-rose-600 {
  background: linear-gradient(180deg, #e11d48 0%, #f43f5e 100%);
}

.accent-slate-600 {
  background: linear-gradient(180deg, #475569 0%, #64748b 100%);
}

.card-content {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px 24px;
}

/* Card Icon */
.card-icon-wrapper {
  flex-shrink: 0;
}

.icon-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  transition: all 0.3s ease;
}

.icon-top {
  background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
  color: white;
  box-shadow: 0 8px 20px -4px rgba(244, 63, 94, 0.4);
}

.top-icon {
  width: 26px;
  height: 26px;
}

.announcement-card:hover .icon-badge:not(.icon-top) {
  transform: scale(1.05);
}

/* Card Body */
.card-body {
  flex: 1;
  min-width: 0;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.badge {
  flex-shrink: 0;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
}

.badge-top {
  background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%);
  color: white;
  box-shadow: 0 4px 10px -2px rgba(244, 63, 94, 0.3);
}

.card-title {
  flex: 1;
  font-size: 17px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.announcement-card:hover .card-title {
  color: #2563eb;
}

.card-description {
  font-size: 14px;
  line-height: 1.7;
  color: #64748b;
  margin: 0 0 14px 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Card Meta */
.card-meta {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #94a3b8;
  font-weight: 500;
}

.meta-icon {
  width: 14px;
  height: 14px;
}

/* Card Arrow */
.card-arrow {
  flex-shrink: 0;
  align-self: center;
  opacity: 0;
  transform: translateX(10px);
  transition: all 0.3s ease;
}

.announcement-card:hover .card-arrow {
  opacity: 1;
  transform: translateX(0);
}

.arrow-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-radius: 50%;
  color: #2563eb;
  transition: all 0.3s ease;
}

.announcement-card:hover .arrow-circle {
  background: linear-gradient(135deg, #000AB0 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);
}

/* ====== Empty State ====== */
.empty-state {
  text-align: center;
  padding: 80px 24px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  border-radius: 20px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.empty-desc {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

/* ====== Loading State ====== */
.loading-state {
  text-align: center;
  padding: 80px 24px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ====== Responsive ====== */
@media (max-width: 768px) {
  .announcement-container {
    padding: 16px;
  }

  .header-section {
    padding: 20px;
  }

  .header-section h1 {
    font-size: 24px;
  }

  .type-filter {
    gap: 8px;
  }

  .filter-btn {
    padding: 8px 14px;
    font-size: 13px;
  }

  .announcement-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .announcement-card {
    padding: 20px;
  }
}
</style>