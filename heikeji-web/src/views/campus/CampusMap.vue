<template>
  <div class="campus-map-page">
    <div class="page-header">
      <div class="header-content max-w-screen-xl mx-auto px-4 lg:px-8">
        <h1 class="page-title">
          <el-icon><MapLocation /></el-icon>
          校园地图
        </h1>
      </div>
    </div>

    <div class="main-content max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
      <div class="map-layout">
        <aside class="sidebar">
          <div class="search-panel glass-effect rounded-2xl p-4 mb-4">
            <div class="search-input-wrap">
              <el-icon><Search /></el-icon>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索地点..."
                class="map-search-input"
              />
            </div>
          </div>

          <div class="category-panel glass-effect rounded-2xl p-4 mb-4">
            <h3 class="panel-title">建筑分类</h3>
            <div class="category-list">
              <button
                v-for="cat in mapCategories"
                :key="cat.value"
                class="cat-item"
                :class="{ active: activeCategory === cat.value }"
                @click="activeCategory = cat.value"
              >
                <span class="cat-dot" :style="{ background: cat.color }"></span>
                {{ cat.label }}
                <span class="cat-count">{{ cat.count }}</span>
              </button>
            </div>
          </div>

          <div class="places-list glass-effect rounded-2xl p-4 overflow-hidden flex flex-col" style="max-height: 400px;">
            <h3 class="panel-title">地点列表</h3>
            <div class="places-scroll">
              <button
                v-for="place in filteredPlaces"
                :key="place.id"
                class="place-item"
                :class="{ selected: selectedPlace?.id === place.id }"
                @click="selectPlace(place)"
              >
                <span class="place-color" :style="{ background: place.color }"></span>
                <div class="place-info">
                  <span class="place-name">{{ place.name }}</span>
                  <span class="place-type">{{ place.type }}</span>
                </div>
                <el-icon class="place-arrow"><ArrowRight /></el-icon>
              </button>
              <p v-if="filteredPlaces.length === 0" class="no-results">未找到匹配地点</p>
            </div>
          </div>
        </aside>

        <main class="map-main">
          <div class="map-container glass-effect rounded-2xl overflow-hidden relative">
            <svg
              viewBox="0 0 800 600"
              class="campus-svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <linearGradient id="grassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#e8f5e9;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#c8e6c9;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="roadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:#e0e0e0;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#bdbdbd;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#bbdefb;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#90caf9;stop-opacity:1" />
                </linearGradient>
              </defs>

              <rect width="800" height="600" fill="url(#grassGrad)" />

              <g id="roads">
                <rect x="380" y="0" width="40" height="600" fill="url(#roadGrad)" rx="2" opacity="0.6"/>
                <rect x="0" y="280" width="800" height="35" fill="url(#roadGrad)" rx="2" opacity="0.6"/>
                <rect x="150" y="0" width="30" height="280" fill="url(#roadGrad)" rx="2" opacity="0.5"/>
                <rect x="550" y="315" width="30" height="285" fill="url(#roadGrad)" rx="2" opacity="0.5"/>
                <line x1="400" y1="0" x2="400" y2="600" stroke="#fff" stroke-width="1" stroke-dasharray="12,8" opacity="0.4"/>
                <line x1="0" y1="297" x2="800" y2="297" stroke="#fff" stroke-width="1" stroke-dasharray="12,8" opacity="0.4"/>
              </g>

              <g id="lake">
                <ellipse cx="650" cy="450" rx="90" ry="60" fill="url(#waterGrad)" stroke="#64b5f6" stroke-width="2"/>
                <text x="650" y="455" text-anchor="middle" fill="#1565c0" font-size="11" font-weight="600">镜湖</text>
              </g>

              <g id="buildings">
                <g
                  v-for="building in visibleBuildings"
                  :key="building.id"
                  class="building-group"
                  :class="{ highlighted: selectedPlace?.id === building.id }"
                  @click="selectPlace(building)"
                >
                  <rect
                    :x="building.x"
                    :y="building.y"
                    :width="building.w"
                    :height="building.h"
                    :fill="selectedPlace?.id === building.id ? building.color : (building.color + 'cc')"
                    :stroke="selectedPlace?.id === building.id ? '#1f2937' : building.color"
                    :stroke-width="selectedPlace?.id === building.id ? 2.5 : 1"
                    rx="6"
                    class="building-rect"
                    filter="url(#glow)"
                  >
                    <animate
                      attributeName="opacity"
                      values="0.85;1;0.85"
                      dur="3s"
                      repeatCount="indefinite"
                      v-if="selectedPlace?.id === building.id"
                    />
                  </rect>
                  <text
                    :x="building.x + building.w / 2"
                    :y="building.y + building.h / 2 - 4"
                    text-anchor="middle"
                    :fill="isLightColor(building.color) ? '#333' : '#fff'"
                    font-size="10"
                    font-weight="700"
                    class="building-label"
                  >{{ building.shortName }}</text>
                  <circle
                    :cx="building.x + building.w / 2"
                    :cy="building.y + building.h / 2 + 10"
                    r="4"
                    :fill="getPoiIcon(building.category).color"
                    stroke="#fff"
                    stroke-width="1.5"
                  />
                </g>
              </g>

              <g id="legend" transform="translate(10, 520)">
                <rect x="0" y="0" width="180" height="70" rx="8" fill="white" fill-opacity="0.92" stroke="#e5e7eb"/>
                <text x="12" y="18" font-size="10" font-weight="700" fill="#374151">图例</text>
                <g transform="translate(12, 28)">
                  <rect v-for="(lc, i) in legendColors" :key="i" :x="(i % 3) * 56" :y="Math.floor(i / 3) * 18" width="12" height="12" :fill="lc.color" rx="2"/>
                  <text v-for="(lc, i) in legendColors" :key="'t'+i" :x="(i % 3) * 56 + 16" :y="Math.floor(i / 3) * 18 + 10" font-size="8" fill="#6b7280">{{ lc.label }}</text>
                </g>
              </g>

              <g id="compass" transform="translate(750, 40)">
                <circle cx="0" cy="0" r="24" fill="white" fill-opacity="0.9" stroke="#e5e7eb"/>
                <polygon points="0,-18 5,-4 0,-8 -5,-4" fill="#ef4444"/>
                <polygon points="0,18 5,4 0,8 -5,4" fill="#9ca3af"/>
                <text x="0" y="-22" text-anchor="middle" font-size="8" font-weight="700" fill="#ef4444">N</text>
                <text x="0" y="29" text-anchor="middle" font-size="7" fill="#9ca3af">S</text>
                <text x="28" y="3" text-anchor="middle" font-size="7" fill="#9ca3af">E</text>
                <text x="-28" y="3" text-anchor="middle" font-size="7" fill="#9ca3af">W</text>
              </g>
            </svg>

            <transition name="slide-left">
              <div v-if="selectedPlace" class="detail-panel glass-effect">
                <button class="close-detail" @click="selectedPlace = null">
                  <el-icon><Close /></el-icon>
                </button>
                <div class="detail-header" :style="{ borderTopColor: selectedPlace.color }">
                  <span class="detail-badge" :style="{ background: selectedPlace.color }">{{ selectedPlace.type }}</span>
                  <h3>{{ selectedPlace.name }}</h3>
                </div>
                <div class="detail-body">
                  <div class="info-row">
                    <el-icon><Location /></el-icon>
                    <span>{{ selectedPlace.address }}</span>
                  </div>
                  <div class="info-row">
                    <el-icon><Clock /></el-icon>
                    <span>开放时间：{{ selectedPlace.hours }}</span>
                  </div>
                  <div class="info-row">
                    <el-icon><Phone /></el-icon>
                    <span>{{ selectedPlace.phone || '暂无电话' }}</span>
                  </div>
                  <p class="detail-desc">{{ selectedPlace.description }}</p>
                  <div class="detail-tags">
                    <span v-for="tag in selectedPlace.tags" :key="tag" class="d-tag">{{ tag }}</span>
                  </div>
                  <div class="detail-actions">
                    <button class="nav-btn primary" @click="navigateTo(selectedPlace)">
                      <el-icon><Navigation /></el-icon>
                      导航前往
                    </button>
                    <button class="nav-btn secondary" @click="sharePlace(selectedPlace)">
                      <el-icon><Share /></el-icon>
                      分享位置
                    </button>
                  </div>
                </div>
              </div>
            </transition>

            <div class="map-controls">
              <button class="control-btn" title="放大" @click="zoomIn"><el-icon><ZoomIn /></el-icon></button>
              <button class="control-btn" title="缩小" @click="zoomOut"><el-icon><ZoomOut /></el-icon></button>
              <button class="control-btn" title="重置" @click="resetView"><el-icon><Aim /></el-icon></button>
            </div>
          </div>

          <div class="quick-nav-bar glass-effect rounded-2xl p-3 mt-4">
            <span class="quick-label">快捷导航：</span>
            <button
              v-for="quick in quickNavs"
              :key="quick.name"
              class="quick-chip"
              @click="selectPlace(quick.place)"
            >
              {{ quick.name }}
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Reading, House, Star, Soccer,
  MapLocation, Search, ArrowRight, Location, Clock, Phone,
  Close, Position, Share, ZoomIn, ZoomOut, Aim
} from '@element-plus/icons-vue'
import { useCampusStore } from '@/stores/campus'

const campusStore = useCampusStore()

interface Place {
  id: number
  name: string
  shortName: string
  type: string
  category: string
  color: string
  x: number
  y: number
  w: number
  h: number
  address: string
  hours: string
  phone?: string
  description: string
  tags: string[]
}

const searchQuery = ref('')
const activeCategory = ref('all')
const selectedPlace = ref<Place | null>(null)

const mapCategories = computed(() => [
  { value: 'all', label: '全部', color: '#6b7280', count: places.value.length },
  { value: 'teaching', label: '教学楼', color: '#3b82f6', count: places.value.filter(p => p.category === 'teaching').length },
  { value: 'dorm', label: '宿舍区', color: '#8b5cf6', count: places.value.filter(p => p.category === 'dorm').length },
  { value: 'service', label: '服务设施', color: '#10b981', count: places.value.filter(p => p.category === 'service').length },
  { value: 'sports', label: '运动场馆', color: '#f59e0b', count: places.value.filter(p => p.category === 'sports').length },
  { value: 'other', label: '其他', color: '#ec4899', count: places.value.filter(p => p.category === 'other').length }
])

const places = computed<Place[]>(() => {
  if (!campusStore.mapPlaces?.length) return []
  return campusStore.mapPlaces.map((place, index) => ({
    id: place.id || index + 1,
    name: place.name,
    shortName: place.shortName || place.name.substring(0, 2),
    type: place.type || '',
    category: place.category || 'other',
    color: place.color || '#6b7280',
    x: place.x || 0,
    y: place.y || 0,
    w: place.w || 80,
    h: place.h || 60,
    address: place.address || '',
    hours: place.hours || '',
    phone: place.phone,
    description: place.description || '',
    tags: place.tags || []
  }))
})

const quickNavs = computed(() => [
  { name: '图书馆', place: places.value[3] },
  { name: '第一食堂', place: places.value[5] },
  { name: '体育馆', place: places.value[7] },
  { name: 'A教学楼', place: places.value[0] },
  { name: 'A区宿舍', place: places.value[9] }
].filter(n => n.place))

const legendColors = [
  { label: '教学', color: '#3b82f6' },
  { label: '宿舍', color: '#8b5cf6' },
  { label: '服务', color: '#10b981' },
  { label: '运动', color: '#ef4444' },
  { label: '餐饮', color: '#f59e0b' },
  { label: '其他', color: '#ec4899' }
]

const filteredPlaces = computed(() => {
  let result = places.value

  if (activeCategory.value !== 'all') {
    result = result.filter(p => p.category === activeCategory.value)
  }

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.tags.some(t => t.toLowerCase().includes(q))
    )
  }

  return result
})

const visibleBuildings = computed(() => {
  if (activeCategory.value === 'all' && !searchQuery.value.trim()) return places.value
  const ids = new Set(filteredPlaces.value.map(p => p.id))
  return places.value.filter(p => ids.has(p.id))
})

function selectPlace(place: Place) {
  selectedPlace.value = selectedPlace.value?.id === place.id ? null : place
}

function isLightColor(color: string): boolean {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 155
}

function getPoiIcon(category: string): { icon: any; color: string } {
  const map: Record<string, { icon: any; color: string }> = {
    teaching: { icon: Reading, color: '#3b82f6' },
    dorm: { icon: House, color: '#8b5cf6' },
    service: { icon: Star, color: '#10b981' },
    sports: { icon: Soccer, color: '#ef4444' },
    other: { icon: Location, color: '#ec4899' }
  }
  return map[category] || { icon: Location, color: '#9ca3af' }
}

function navigateTo(place: Place) {
  ElMessage.success(`正在导航至 ${place.name}...`)
}

function sharePlace(place: Place) {
  navigator.clipboard.writeText(`${place.name} - ${place.address}`)
  ElMessage.success('位置信息已复制')
}

function zoomIn() { ElMessage.info('放大地图') }
function zoomOut() { ElMessage.info('缩小地图') }
function resetView() {
  selectedPlace.value = null
  activeCategory.value = 'all'
  searchQuery.value = ''
}

onMounted(async () => {
  try {
    await campusStore.fetchMapPlaces()
  } catch {
    ElMessage.error('获取地图数据失败')
  }
})
</script>

<style scoped>
.campus-map-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
}

.page-header {
  background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
  padding: 1.25rem 0;
  color: white;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.map-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.25rem;
}

.sidebar {
  display: flex;
  flex-direction: column;
}

.search-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input-wrap .el-icon {
  position: absolute;
  left: 0.75rem;
  color: #9ca3af;
  z-index: 1;
}

.map-search-input {
  width: 100%;
  padding: 0.625rem 0.75rem 0.625rem 2.25rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
  background: white;
  box-sizing: border-box;
}

.map-search-input:focus {
  border-color: #ea580c;
  box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.08);
}

.panel-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.75rem;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.cat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.625rem;
  border-radius: 8px;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.8125rem;
  color: #4b5563;
  width: 100%;
}

.cat-item:hover {
  background: #fff7ed;
}

.cat-item.active {
  background: linear-gradient(135deg, rgba(234, 88, 12, 0.08) 0%, rgba(220, 38, 38, 0.05) 100%);
  color: #ea580c;
  font-weight: 600;
}

.cat-dot {
  width: 10px;
  height: 10px;
  border-radius: 3px;
  flex-shrink: 0;
}

.cat-count {
  margin-left: auto;
  font-size: 0.6875rem;
  background: #f3f4f6;
  padding: 0.0625rem 0.4375rem;
  border-radius: 9999px;
  color: #9ca3af;
}

.places-scroll {
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-height: 300px;
}

.place-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.625rem;
  border-radius: 8px;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.place-item:hover {
  background: #fff7ed;
}

.place-item.selected {
  background: linear-gradient(135deg, rgba(234, 88, 12, 0.1) 0%, rgba(220, 38, 38, 0.06) 100%);
}

.place-color {
  width: 8px;
  height: 32px;
  border-radius: 3px;
  flex-shrink: 0;
}

.place-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.place-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #1f2937;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.place-type {
  font-size: 0.6875rem;
  color: #9ca3af;
}

.place-arrow {
  color: #d1d5db;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.no-results {
  text-align: center;
  padding: 1.5rem 0;
  font-size: 0.8125rem;
  color: #9ca3af;
}

.map-container {
  position: relative;
  min-height: 500px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.campus-svg {
  width: 100%;
  height: auto;
  display: block;
}

.building-group {
  cursor: pointer;
  transition: all 0.3s ease;
}

.building-rect {
  transition: all 0.3s ease;
}

.building-group:hover .building-rect {
  stroke-width: 2 !important;
  filter: url(#glow);
}

.building-label {
  pointer-events: none;
  user-select: none;
}

.detail-panel {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 280px;
  border-radius: 16px;
  overflow: hidden;
  animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.06);
  z-index: 10;
}

.close-detail {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.06);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.875rem;
  z-index: 5;
  transition: all 0.2s;
}

.close-detail:hover {
  background: rgba(0, 0, 0, 0.12);
}

.detail-header {
  padding: 1.25rem 1rem 0.75rem;
  border-top: 4px solid #3b82f6;
}

.detail-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
}

.detail-header h3 {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
}

.detail-body {
  padding: 0.75rem 1rem 1.25rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.info-row .el-icon {
  color: #9ca3af;
  font-size: 0.9375rem;
  flex-shrink: 0;
}

.detail-desc {
  font-size: 0.8125rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0.75rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 1rem;
}

.d-tag {
  padding: 0.125rem 0.5rem;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 0.6875rem;
  color: #6b7280;
}

.detail-actions {
  display: flex;
  gap: 0.5rem;
}

.nav-btn {
  flex: 1;
  padding: 0.5625rem 0;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  border: none;
}

.nav-btn.primary {
  background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
  color: white;
}

.nav-btn.secondary {
  background: #f3f4f6;
  color: #4b5563;
}

.nav-btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(234, 88, 12, 0.3);
}

.map-controls {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.control-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: white;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #4b5563;
  font-size: 1rem;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.control-btn:hover {
  background: #fff7ed;
  border-color: #ea580c;
  color: #ea580c;
}

.quick-nav-bar {
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.quick-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  white-space: nowrap;
}

.quick-chip {
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  background: white;
  border: 1px solid #e5e7eb;
  font-size: 0.8125rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s;
}

.quick-chip:hover {
  border-color: #ea580c;
  color: #ea580c;
  background: #fff7ed;
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}

.slide-left-enter-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-left-leave-active { transition: all 0.2s ease; }
.slide-left-enter-from { opacity: 0; transform: translateX(20px); }
.slide-left-leave-to { opacity: 0; transform: translateX(20px); }

@media (max-width: 1024px) {
  .map-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 0.75rem;
  }

  .search-panel,
  .category-panel,
  .places-list {
    margin-bottom: 0;
  }

  .places-list {
    max-height: none;
  }

  .places-scroll {
    max-height: 150px;
  }
}

@media (max-width: 640px) {
  .sidebar {
    grid-template-columns: 1fr;
  }

  .detail-panel {
    position: fixed;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    border-radius: 16px 16px 0 0;
    max-height: 60vh;
    overflow-y: auto;
  }

  .map-controls {
    bottom: 0.5rem;
    left: 0.5rem;
  }
}
</style>
