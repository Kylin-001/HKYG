<template>
  <div class="library-page">
    <div class="page-header">
      <div class="header-content max-w-screen-xl mx-auto px-4 lg:px-8">
        <h1 class="page-title">
          <el-icon><Reading /></el-icon>
          图书馆
        </h1>
        <div class="header-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="tab-btn"
            :class="{ active: activeTab === tab.value }"
            @click="activeTab = tab.value"
          >
            <el-icon><component :is="tab.icon" /></el-icon>
            {{ tab.label }}
            <span v-if="tab.badge" class="tab-badge">{{ tab.badge }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="main-content max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
      <div v-if="activeTab === 'search'" class="tab-content">
        <div class="search-section glass-effect rounded-2xl p-6 mb-6">
          <div class="search-bar-wrapper">
            <el-icon class="search-icon"><Search /></el-icon>
            <input
              v-model="bookSearchKeyword"
              type="text"
              placeholder="搜索书名、作者、ISBN..."
              class="search-input"
              @keyup.enter="handleBookSearch"
            />
            <button class="search-btn" @click="handleBookSearch">搜索</button>
          </div>

          <div class="quick-filters">
            <button
              v-for="cat in bookCategories"
              :key="cat.value"
              class="filter-chip"
              :class="{ active: selectedBookCategory === cat.value }"
              @click="selectedBookCategory = cat.value"
            >
              {{ cat.label }}
            </button>
          </div>
        </div>

        <div v-if="!hasSearched" class="welcome-section glass-effect rounded-2xl p-8 text-center">
          <el-icon class="welcome-icon"><Reading /></el-icon>
          <h2 class="welcome-title">探索知识的海洋</h2>
          <p class="welcome-desc">搜索你感兴趣的书籍，开启阅读之旅</p>
          <div class="hot-keywords">
            <span class="hot-label">热门搜索：</span>
            <button v-for="kw in hotKeywords" :key="kw" class="keyword-tag" @click="bookSearchKeyword = kw; handleBookSearch()">{{ kw }}</button>
          </div>
        </div>

        <div v-else class="results-section">
          <div class="results-header">
            <span class="results-count">找到 {{ searchResults.length }} 本相关书籍</span>
            <div class="sort-options">
              <button
                v-for="sort in bookSortOptions"
                :key="sort.value"
                class="sort-chip"
                :class="{ active: bookSortBy === sort.value }"
                @click="bookSortBy = sort.value"
              >
                {{ sort.label }}
              </button>
            </div>
          </div>

          <div class="book-grid">
            <div
              v-for="book in sortedBooks"
              :key="book.isbn"
              class="book-card glass-effect"
              @click="showBookDetail(book)"
            >
              <div class="book-cover">
                <img :src="book.cover" :alt="book.title" width="140" height="200" loading="lazy" />
                <span class="availability-badge" :class="book.available ? 'available' : 'unavailable'">
                  {{ book.available ? '可借' : '已借出' }}
                </span>
              </div>
              <div class="book-info">
                <h3 class="book-title">{{ book.title }}</h3>
                <p class="book-author">{{ book.author }}</p>
                <div class="book-meta">
                  <span class="meta-item">
                    <el-icon><Files /></el-icon>
                    {{ book.location }}
                  </span>
                  <span class="meta-item">
                    <el-icon><CollectionTag /></el-icon>
                    剩余{{ book.copies }}本
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'seat'" class="tab-content">
        <div class="seat-info-bar glass-effect rounded-2xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div class="info-group">
            <div class="info-item">
              <el-icon><OfficeBuilding /></el-icon>
              <span>当前楼层：{{ currentFloor }}F</span>
            </div>
            <div class="info-item">
              <el-icon><Clock /></el-icon>
              <span>{{ currentDate }}</span>
            </div>
            <div class="info-item available">
              <el-icon><Chair /></el-icon>
              <span>可用座位：{{ availableSeats }}/{{ totalSeats }}</span>
            </div>
          </div>
          <div class="floor-selector">
            <button
              v-for="f in [1, 2, 3, 4, 5]"
              :key="f"
              class="floor-btn"
              :class="{ active: currentFloor === f }"
              @click="currentFloor = f"
            >
              {{ f }}F
            </button>
          </div>
        </div>

        <div class="seat-map glass-effect rounded-2xl overflow-hidden">
          <div class="map-header">
            <div class="map-legend">
              <span class="legend-item"><span class="dot available-dot"></span>可用</span>
              <span class="legend-item"><span class="dot occupied-dot"></span>已占用</span>
              <span class="legend-item"><span class="dot reserved-dot"></span>我的预约</span>
              <span class="legend-item"><span class="dot maintenance-dot"></span>维护中</span>
            </div>
          </div>

          <div class="seat-grid-container">
            <div class="stage-area">
              <span class="stage-label">讲 台</span>
            </div>
            <div class="seats-layout">
              <div
                v-for="row in seatRows"
                :key="row.row"
                class="seat-row"
              >
                <span class="row-label">{{ row.label }}</span>
                <div class="seat-cells">
                  <button
                    v-for="seat in row.seats"
                    :key="seat.id"
                    class="seat-cell"
                    :class="[seat.status, { selected: selectedSeat?.id === seat.id }]"
                    :disabled="seat.status !== 'available'"
                    @click="selectSeat(seat)"
                  >
                    <span class="seat-num">{{ seat.num }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <transition name="slide-up">
          <div v-if="selectedSeat" class="seat-action-bar glass-effect rounded-2xl p-5 mt-6">
            <div class="selected-info">
              <div class="seat-detail">
                <h4>座位 {{ selectedSeat.num }}</h4>
                <p>{{ currentFloor }}F - {{ selectedSeat.zone }}区 - 第{{ selectedSeat.row }}排</p>
              </div>
              <div class="time-picker">
                <label>预约时长：</label>
                <div class="duration-options">
                  <button
                    v-for="d in durations"
                    :key="d.value"
                    class="duration-chip"
                    :class="{ active: selectedDuration === d.value }"
                    @click="selectedDuration = d.value"
                  >
                    {{ d.label }}
                  </button>
                </div>
              </div>
            </div>
            <div class="action-buttons">
              <button class="cancel-btn" @click="selectedSeat = null">取消选择</button>
              <button class="confirm-btn" @click="confirmBooking">
                <el-icon><Select /></el-icon>
                确认预约
              </button>
            </div>
          </div>
        </transition>

        <div class="my-bookings mt-6">
          <h3 class="section-heading">
            <el-icon><Ticket /></el-icon>
            我的预约记录
          </h3>
          <div class="booking-list glass-effect rounded-2xl overflow-hidden">
            <div
              v-for="booking in myBookings"
              :key="booking.id"
              class="booking-item"
              :class="booking.status"
            >
              <div class="booking-status-indicator"></div>
              <div class="booking-info">
                <h4>{{ booking.seatNum }} 号座位</h4>
                <p>{{ booking.floor }}F · {{ booking.date }} · {{ booking.timeRange }}</p>
              </div>
              <span class="booking-status-tag">{{ getStatusLabel(booking.status) }}</span>
              <button
                v-if="booking.status === 'active'"
                class="cancel-booking-btn"
                @click="cancelBooking(booking.id)"
              >
                取消预约
              </button>
            </div>
            <div v-if="myBookings.length === 0" class="empty-bookings text-center py-8">
              <p class="text-gray-400">暂无预约记录</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <transition name="modal-fade">
        <div v-if="selectedBook" class="modal-overlay" @click.self="selectedBook = null">
          <div class="book-modal glass-effect rounded-2xl overflow-hidden">
            <div class="modal-close" @click="selectedBook = null">
              <el-icon><Close /></el-icon>
            </div>
            <div class="modal-body">
              <div class="detail-cover">
                <img :src="selectedBook.cover" :alt="selectedBook.title" />
              </div>
              <div class="detail-info">
                <h2>{{ selectedBook.title }}</h2>
                <p class="author-line">{{ selectedBook.author }} 著</p>
                <div class="detail-meta">
                  <div class="dm-item">
                    <span class="dm-label">出版社</span>
                    <span class="dm-value">{{ selectedBook.publisher }}</span>
                  </div>
                  <div class="dm-item">
                    <span class="dm-label">ISBN</span>
                    <span class="dm-value">{{ selectedBook.isbn }}</span>
                  </div>
                  <div class="dm-item">
                    <span class="dm-label">分类</span>
                    <span class="dm-value">{{ selectedBook.category }}</span>
                  </div>
                  <div class="dm-item">
                    <span class="dm-label">馆藏位置</span>
                    <span class="dm-value">{{ selectedBook.location }}</span>
                  </div>
                  <div class="dm-item">
                    <span class="dm-label">剩余馆藏</span>
                    <span class="dm-value highlight">{{ selectedBook.copies }} 本</span>
                  </div>
                </div>
                <p class="book-intro">{{ selectedBook.intro }}</p>
                <div class="modal-actions">
                  <button class="action-btn secondary">
                    <el-icon><Star /></el-icon>
                    收藏
                  </button>
                  <button class="action-btn primary" :disabled="!selectedBook.available">
                    <el-icon><Reading /></el-icon>
                    {{ selectedBook.available ? '立即借阅' : '已借完' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Reading, Search, Files, CollectionTag,
  OfficeBuilding, Clock, Grid, Select, Ticket, Star, Close
} from '@element-plus/icons-vue'
import { useCampusStore } from '@/stores/campus'

const campusStore = useCampusStore()

const activeTab = ref('search')
const tabs = [
  { value: 'search', label: '图书检索', icon: 'Search' },
  { value: 'seat', label: '座位预约', icon: 'Chair' }
]

const bookSearchKeyword = ref('')
const selectedBookCategory = ref('all')
const hasSearched = ref(false)
const bookSortBy = ref('relevance')

const bookCategories = [
  { value: 'all', label: '全部' },
  { value: 'cs', label: '计算机' },
  { value: 'math', label: '数学' },
  { value: 'literature', label: '文学' },
  { value: 'science', label: '理工' },
  { value: 'economics', label: '经管' },
  { value: 'art', label: '艺术' }
]

const hotKeywords = ['高等数学', '数据结构', '人工智能导论', 'Python编程', '算法竞赛']

const bookSortOptions = [
  { value: 'relevance', label: '综合排序' },
  { value: 'newest', label: '最新入库' },
  { value: 'popular', label: '热门借阅' }
]

interface Book {
  isbn: string
  title: string
  author: string
  publisher: string
  category: string
  location: string
  copies: number
  available: boolean
  cover: string
  intro: string
}

const searchResults = computed<Book[]>(() => {
  if (!campusStore.libraryBooks?.length) return []
  return campusStore.libraryBooks.map(book => ({
    isbn: book.isbn || String(book.id),
    title: book.title,
    author: book.author || '',
    publisher: book.publisher || '',
    category: book.category || '',
    location: book.location || '',
    copies: book.copies || 1,
    available: book.available !== false,
    cover: book.cover || '',
    intro: book.intro || book.description || ''
  }))
})

const selectedBook = ref<Book | null>(null)

async function handleBookSearch() {
  if (!bookSearchKeyword.value.trim()) return
  hasSearched.value = true

  try {
    await campusStore.searchBooks(bookSearchKeyword.value)
    ElMessage.success(`找到 ${searchResults.value.length} 本相关书籍`)
  } catch {
    ElMessage.error('搜索失败')
  }
}

const sortedBooks = computed(() => {
  const books = [...searchResults.value]
  switch (bookSortBy.value) {
    case 'newest': return books.sort(() => Math.random() - 0.5)
    case 'popular': return books.sort((a, b) => b.copies - a.copies)
    default: return books
  }
})

function showBookDetail(book: Book) {
  selectedBook.value = book
}

interface Seat {
  id: string
  num: number
  row: number
  zone: string
  status: 'available' | 'occupied' | 'reserved' | 'maintenance'
}

const currentFloor = ref(3)
const selectedSeat = ref<Seat | null>(null)
const selectedDuration = ref(120)

const durations = [
  { value: 60, label: '1小时' },
  { value: 120, label: '2小时' },
  { value: 180, label: '3小时' },
  { value: 240, label: '4小时' }
]

function generateSeats(): Seat[] {
  const seats: Seat[] = []
  const zones = ['A', 'B', 'C']
  const statuses: Seat['status'][] = ['available', 'available', 'available', 'available', 'available', 'occupied', 'occupied', 'reserved', 'maintenance']

  for (let row = 1; row <= 10; row++) {
    const colsPerZone = row <= 3 ? 6 : row <= 7 ? 8 : 10
    let seatNum = (row - 1) * (colsPerZone * 3) + 1

    for (const zone of zones) {
      for (let col = 0; col < colsPerZone; col++) {
        seats.push({
          id: `${currentFloor.value}-${row}-${zone}-${col}`,
          num: seatNum++,
          row,
          zone,
          status: statuses[Math.floor(Math.random() * statuses.length)]
        })
      }
    }
  }
  return seats
}

const allSeats = ref<Seat[]>(generateSeats())

const seatRows = computed(() => {
  const rows: { row: number; label: string; seats: Seat[] }[] = []
  const grouped = new Map<number, Seat[]>()

  allSeats.value.forEach(seat => {
    if (!grouped.has(seat.row)) grouped.set(seat.row, [])
    grouped.get(seat.row)!.push(seat)
  })

  grouped.forEach((seats, rowNum) => {
    rows.push({ row: rowNum, label: `第${rowNum}排`, seats })
  })

  return rows.sort((a, b) => a.row - b.row)
})

const totalSeats = computed(() => allSeats.value.length)
const availableSeats = computed(() => allSeats.value.filter(s => s.status === 'available').length)

const currentDate = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
})

function selectSeat(seat: Seat) {
  if (seat.status === 'available') {
    selectedSeat.value = selectedSeat.value?.id === seat.id ? null : seat
  }
}

function confirmBooking() {
  if (!selectedSeat.value) return
  ElMessage.success(`成功预约 ${selectedSeat.value.num} 号座位，时长 ${selectedDuration.value} 分钟`)
  const seat = allSeats.value.find(s => s.id === selectedSeat.value!.id)!
  seat.status = 'reserved'
  myBookings.value.unshift({
    id: Date.now(),
    seatNum: seat.num,
    floor: currentFloor.value,
    date: currentDate.value.replace(/年|月/g, '-').replace('日', ''),
    timeRange: `${selectedDuration.value}分钟`,
    status: 'active'
  })
  selectedSeat.value = null
}

interface Booking {
  id: number
  seatNum: number
  floor: number
  date: string
  timeRange: string
  status: 'active' | 'completed' | 'cancelled'
}

const myBookings = ref<Booking[]>([
  { id: 1, seatNum: 42, floor: 3, date: '2026-04-02', timeRange: '2小时', status: 'active' },
  { id: 2, seatNum: 18, floor: 2, date: '2026-04-01', timeRange: '3小时', status: 'completed' }
])

function cancelBooking(id: number) {
  const booking = myBookings.value.find(b => b.id === id)
  if (booking) {
    booking.status = 'cancelled'
    ElMessage.info('已取消预约')
  }
}

function getStatusLabel(status: string): string {
  const map: Record<string, string> = { active: '进行中', completed: '已完成', cancelled: '已取消' }
  return map[status] || status
}
</script>

<style scoped>
.library-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
}

.page-header {
  background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
  padding: 1.25rem 0;
  color: white;
}

.header-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.tab-btn:hover {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

.tab-btn.active {
  background: white;
  color: #059669;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.tab-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  background: #ef4444;
  border-radius: 50%;
  font-size: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
}

.search-section {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.search-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.search-icon {
  font-size: 1.25rem;
  color: #9ca3af;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  padding: 0.875rem 1.25rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 14px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  background: white;
}

.search-input:focus {
  border-color: #059669;
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.08);
}

.search-btn {
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

.search-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);
}

.quick-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-chip {
  padding: 0.375rem 0.875rem;
  border-radius: 9999px;
  font-size: 0.8125rem;
  background: white;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-chip:hover,
.filter-chip.active {
  border-color: #059669;
  color: #059669;
  background: #ecfdf5;
}

.welcome-section {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.welcome-icon {
  font-size: 4rem;
  color: #10b981;
  opacity: 0.5;
  margin-bottom: 1rem;
}

.welcome-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.welcome-desc {
  color: #9ca3af;
  margin-bottom: 1.5rem;
}

.hot-keywords {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.hot-label {
  font-size: 0.875rem;
  color: #6b7280;
}

.keyword-tag {
  padding: 0.25rem 0.75rem;
  background: #f0fdf4;
  color: #059669;
  border-radius: 9999px;
  font-size: 0.8125rem;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.keyword-tag:hover {
  background: #059669;
  color: white;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.results-count {
  font-size: 0.9375rem;
  color: #6b7280;
}

.results-count strong {
  color: #059669;
  font-weight: 700;
}

.sort-options {
  display: flex;
  gap: 0.375rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 10px;
}

.sort-chip {
  padding: 0.375rem 0.875rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 0.8125rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.sort-chip.active {
  background: white;
  color: #059669;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

.book-card {
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
}

.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(5, 150, 105, 0.15);
}

.book-cover {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.book-card:hover .book-cover img {
  transform: scale(1.05);
}

.availability-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.1875rem 0.5625rem;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 600;
  color: white;
}

.availability-badge.available {
  background: #10b981;
}
.availability-badge.unavailable {
  background: #ef4444;
}

.book-info {
  padding: 0.875rem;
}

.book-title {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
  margin-bottom: 0.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 0.8125rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}

.book-meta {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

.seat-info-bar {
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.info-group {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #4b5563;
}

.info-item.available {
  color: #059669;
  font-weight: 600;
}

.floor-selector {
  display: flex;
  gap: 0.375rem;
}

.floor-btn {
  width: 40px;
  height: 36px;
  border-radius: 8px;
  background: white;
  border: 1px solid #e5e7eb;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.floor-btn:hover {
  border-color: #059669;
  color: #059669;
}

.floor-btn.active {
  background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
  color: white;
  border-color: transparent;
}

.seat-map {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.map-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  justify-content: center;
}

.map-legend {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: #6b7280;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 4px;
}

.available-dot { background: #10b981; }
.occupied-dot { background: #d1d5db; }
.reserved-dot { background: #3b82f6; }
.maintenance-dot { background: #f59e0b; }

.seat-grid-container {
  padding: 1.5rem;
  overflow-x: auto;
}

.stage-area {
  text-align: center;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: linear-gradient(90deg, transparent, rgba(5, 150, 105, 0.06), transparent);
  border-radius: 8px;
}

.stage-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: #059669;
  letter-spacing: 0.5em;
}

.seats-layout {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.seat-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.row-label {
  width: 40px;
  font-size: 0.6875rem;
  color: #9ca3af;
  text-align: right;
  flex-shrink: 0;
  font-weight: 500;
}

.seat-cells {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  justify-content: center;
}

.seat-cell {
  width: 30px;
  height: 28px;
  border-radius: 6px;
  border: none;
  font-size: 0.625rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.seat-cell.available {
  background: #d1fae5;
  color: #047857;
  border: 1.5px solid #10b981;
}

.seat-cell.available:hover {
  background: #10b981;
  color: white;
  transform: scale(1.15);
  z-index: 5;
}

.seat-cell.selected {
  background: #059669 !important;
  color: white !important;
  transform: scale(1.2);
  box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.3);
  z-index: 10;
}

.seat-cell.occupied {
  background: #f3f4f6;
  color: #c4b5fd;
  cursor: not-allowed;
}

.seat-cell.reserved {
  background: #dbeafe;
  color: #2563eb;
  cursor: not-allowed;
}

.seat-cell.maintenance {
  background: #fef3c7;
  color: #d97706;
  cursor: not-allowed;
}

.seat-cell:disabled {
  cursor: not-allowed;
}

.seat-action-bar {
  border: 1px solid rgba(0, 0, 0, 0.05);
  animation: slideUpFadeIn 0.3s ease;
}

.selected-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.25rem;
}

.seat-detail h4 {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
}

.seat-detail p {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.125rem;
}

.time-picker {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.time-picker label {
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
  white-space: nowrap;
}

.duration-options {
  display: flex;
  gap: 0.375rem;
}

.duration-chip {
  padding: 0.375rem 0.875rem;
  border-radius: 8px;
  background: white;
  border: 1.5px solid #e5e7eb;
  font-size: 0.8125rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.duration-chip.active {
  border-color: #059669;
  background: #ecfdf5;
  color: #059669;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.cancel-btn {
  padding: 0.625rem 1.5rem;
  border-radius: 10px;
  background: #f3f4f6;
  color: #4b5563;
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.75rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
  color: white;
  border: none;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.confirm-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35);
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.booking-list {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.booking-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f9fafb;
  transition: background 0.2s;
}

.booking-item:last-child {
  border-bottom: none;
}

.booking-item:hover {
  background: #fafafa;
}

.booking-status-indicator {
  width: 4px;
  height: 40px;
  border-radius: 2px;
  flex-shrink: 0;
}

.booking-item.active .booking-status-indicator { background: #10b981; }
.booking-item.completed .booking-status-indicator { background: #9ca3af; }
.booking-item.cancelled .booking-status-indicator { background: #ef4444; }

.booking-info {
  flex: 1;
  min-width: 0;
}

.booking-info h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
}

.booking-info p {
  font-size: 0.8125rem;
  color: #9ca3af;
  margin-top: 0.125rem;
}

.booking-status-tag {
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.booking-item.active .booking-status-tag { background: #ecfdf5; color: #059669; }
.booking-item.completed .booking-status-tag { background: #f3f4f6; color: #6b7280; }
.booking-item.cancelled .booking-status-tag { background: #fef2f2; color: #ef4444; }

.cancel-booking-btn {
  padding: 0.375rem 0.875rem;
  border-radius: 6px;
  background: none;
  border: 1px solid #e5e7eb;
  color: #ef4444;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-booking-btn:hover {
  background: #fef2f2;
  border-color: #fecaca;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.book-modal {
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modalSlideIn 0.3s ease;
  position: relative;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.08);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 1.125rem;
  z-index: 10;
  transition: all 0.2s;
}

.modal-close:hover {
  background: rgba(0, 0, 0, 0.15);
}

.modal-body {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 2rem;
  padding: 2rem;
}

.detail-cover {
  border-radius: 12px;
  overflow: hidden;
  aspect-ratio: 3/4;
  background: #f0fdf4;
}

.detail-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-info h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.4;
  margin-bottom: 0.25rem;
}

.author-line {
  font-size: 0.9375rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.detail-meta {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.dm-item {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.dm-label {
  font-size: 0.6875rem;
  color: #9ca3af;
}

.dm-value {
  font-size: 0.8125rem;
  color: #374151;
  font-weight: 500;
}

.dm-value.highlight {
  color: #059669;
  font-weight: 700;
}

.book-intro {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, #059669 0%, #0d9488 100%);
  color: white;
}

.action-btn.secondary {
  background: #f3f4f6;
  color: #4b5563;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes slideUpFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes modalSlideIn {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.slide-up-enter-active { transition: all 0.3s ease; }
.slide-up-leave-active { transition: all 0.2s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(12px); }

.modal-fade-enter-active { transition: opacity 0.3s ease; }
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .book-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .seat-cell {
    width: 26px;
    height: 24px;
    font-size: 0.5625rem;
  }

  .modal-body {
    grid-template-columns: 140px 1fr;
    gap: 1rem;
    padding: 1.25rem;
  }

  .detail-meta {
    grid-template-columns: 1fr;
  }

  .selected-info {
    flex-direction: column;
    align-items: stretch;
  }

  .time-picker {
    flex-direction: column;
    align-items: flex-start;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
