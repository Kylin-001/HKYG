<template>
  <div class="forum-page">
    <div class="page-header">
      <div class="header-content max-w-screen-xl mx-auto px-4 lg:px-8">
        <h1 class="page-title">
          <el-icon><ChatDotRound /></el-icon>
          {{ t('community.forum') || '校园论坛' }}
        </h1>
        <button class="publish-btn" @click="$router.push('/community/publish')">
          <el-icon><EditPen /></el-icon>
          {{ t('community.createPost') || '发帖子' }}
        </button>
      </div>
    </div>

    <div class="main-content max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
      <div class="top-bar glass-effect rounded-2xl p-4 mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div class="board-tabs">
          <button
            v-for="board in boards"
            :key="board.value"
            class="board-tab"
            :class="{ active: activeBoard === board.value }"
            @click="activeBoard = board.value"
          >
            {{ board.emoji }} {{ board.label }}
          </button>
        </div>
        <div class="search-wrap">
          <el-icon><Search /></el-icon>
          <input v-model="searchKeyword" type="text" placeholder="搜索帖子..." class="forum-search" @keyup.enter="handleSearch" />
        </div>
      </div>

      <div class="content-layout">
        <main class="post-list-main">
          <div class="sort-bar mb-4 flex items-center gap-3">
            <span class="sort-label">排序：</span>
            <div class="sort-chips-group bg-gray-50 rounded-lg p-1 inline-flex gap-0.5">
              <button
                v-for="s in sortOptions"
                :key="s.value"
                class="sort-chip"
                :class="{ active: sortBy === s.value }"
                @click="sortBy = s.value"
              >{{ s.label }}</button>
            </div>
          </div>

          <div v-if="loading" class="loading-grid grid gap-4">
            <Skeleton v-for="i in 5" :key="i" type="card" />
          </div>

          <div v-else-if="filteredPosts.length === 0" class="empty-state glass-effect rounded-2xl p-12 text-center">
            <el-icon class="empty-icon"><DocumentDelete /></el-icon>
            <h3>{{ t('common.noData') || '暂无相关帖子' }}</h3>
            <p>{{ t('community.placeholder') || '来发第一篇帖子吧' }}</p>
          </div>

          <div v-else class="posts-feed">
            <router-link
              v-for="post in filteredPosts"
              :key="post.id"
              :to="`/community/post/${post.id}`"
              class="post-card glass-effect rounded-2xl overflow-hidden"
            >
              <div class="pc-header">
                <img :src="post.authorAvatar" :alt="post.authorName" class="author-avatar" width="40" height="40" />
                <div class="author-info">
                  <span class="author-name">{{ post.authorName }}</span>
                  <span class="post-meta">
                    <span class="board-tag" :style="{ color: getBoardColor(post.board || post.boardId || '') }">{{ post.boardName }}</span>
                    ·
                    <span>{{ formatTime(post.publishTime || post.createdAt || '') }}</span>
                  </span>
                </div>
                <span v-if="post.isTop" class="top-badge">置顶</span>
              </div>

              <h3 class="pc-title">{{ post.title }}</h3>
              <p class="pc-excerpt">{{ post.excerpt || post.content?.slice(0, 120) || '' }}</p>

              <div v-if="post.images && post.images.length > 0" class="pc-images">
                <img
                  v-for="(img, i) in post.images.slice(0, 3)"
                  :key="i"
                  :src="img"
                  :alt="`配图${i + 1}`"
                  class="pc-img"
                  :class="{ 'single-img': post.images.length === 1 }"
                />
                <span v-if="post.images.length > 3" class="more-count">+{{ post.images.length - 3 }}</span>
              </div>

              <div class="pc-tags" v-if="(post.tags && post.tags.length)">
                <span v-for="tag in post.tags.slice(0, 3)" :key="tag" class="tag">#{{ tag }}</span>
              </div>

              <div class="pc-footer">
                <div class="stats-row">
                  <span class="stat-item"><el-icon><View /></el-icon> {{ formatCount(post.views) }}</span>
                  <span class="stat-item"><el-icon><ChatDotRound /></el-icon> {{ post.comments ?? post.commentCount ?? 0 }}</span>
                  <span class="stat-item"><el-icon><Star /></el-icon> {{ post.likes ?? post.likeCount ?? 0 }}</span>
                </div>
                <span class="last-reply" v-if="post.lastReplyTime || post.lastReplyAt">
                  最后回复 {{ formatTime(post.lastReplyTime || post.lastReplyAt || '') }}
                </span>
              </div>
            </router-link>
          </div>

          <div v-if="!loading && filteredPosts.length > 0" class="load-more mt-8 text-center">
            <button class="load-btn" :class="{ loading: loadingMore }" @click="loadMore">
              {{ loadingMore ? (t('common.loading') || '加载中...') : (t('common.viewAll') || '加载更多') }}
            </button>
          </div>
        </main>

        <aside class="forum-sidebar">
          <div class="hot-topics-card glass-effect rounded-2xl p-5 sticky top-24">
            <h3 class="sidebar-title">🔥 热门话题</h3>
            <div class="topic-list">
              <a
                v-for="(topic, idx) in hotTopics"
                :key="idx"
                href="#"
                class="topic-item"
                @click.prevent="searchKeyword = topic; handleSearch()"
              >
                <span class="topic-rank" :class="{ top3: idx < 3 }">{{ idx + 1 }}</span>
                <span class="topic-name">{{ topic }}</span>
                <span class="topic-hot">🔥{{ Math.floor(Math.random() * 900) + 100 }}</span>
              </a>
            </div>
          </div>

          <div class="active-users-card glass-effect rounded-2xl p-5 mt-4">
            <h3 class="sidebar-title">💬 活跃用户</h3>
            <div class="user-list">
              <div v-for="user in activeUsers" :key="user.name" class="user-item">
                <img :src="user.avatar" :alt="user.name" class="u-avatar" />
                <div class="u-info">
                  <span class="u-name">{{ user.name }}</span>
                  <span class="u-posts">发帖 {{ user.posts }} 篇</span>
                </div>
                <button class="follow-u-btn" :class="{ followed: user.followed }" @click="user.followed = !user.followed">
                  {{ user.followed ? '已关注' : '关注' }}
                </button>
              </div>
            </div>
          </div>

          <div class="notice-card glass-effect rounded-2xl p-5 mt-4">
            <h3 class="sidebar-title">📢 公告栏</h3>
            <div class="notice-list">
              <a v-for="(notice, i) in notices" :key="i" href="#" class="notice-item" @click.prevent>
                <span class="notice-dot"></span>
                {{ notice }}
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useI18n } from '@/locales'
import { ElMessage } from 'element-plus'
import { ChatDotRound, EditPen, Search, View, Star, DocumentDelete } from '@element-plus/icons-vue'
import Skeleton from '@/components/Skeleton.vue'
import { useCommunityStore } from '@/stores/community'

const { t } = useI18n()
const communityStore = useCommunityStore()

interface Post {
  id: number
  title: string
  excerpt?: string
  content?: string
  authorName: string
  authorAvatar: string
  board?: string
  boardId?: string
  boardName: string
  publishTime?: string
  createdAt?: string
  lastReplyTime?: string
  lastReplyAt?: string
  views: number
  comments?: number
  commentCount?: number
  likes: number
  likeCount?: number
  isTop: boolean
  images?: string[]
  tags?: string[]
}

const loadingMore = ref(false)
const activeBoard = ref('all')
const searchKeyword = ref('')
const sortBy = ref('latest')

const boards = computed(() => {
  const storeBoards = communityStore.boards
  if (storeBoards && storeBoards.length > 0) {
    return [{ value: 'all', label: '全部', emoji: '🌐' }, ...storeBoards]
  }
  return [
    { value: 'all', label: '全部', emoji: '🌐' },
    { value: 'tech', label: '技术交流', emoji: '💻' },
    { value: 'life', label: '生活杂谈', emoji: '☕' },
    { value: 'study', label: '学习互助', emoji: '📚' },
    { value: 'emotion', label: '情感树洞', emoji: '💝' },
    { value: 'trade', label: '闲置交易', emoji: '🛒' }
  ]
})

const sortOptions = [
  { value: 'latest', label: '最新' },
  { value: 'hot', label: '最热' },
  { value: 'essence', label: '精华' }
]

const posts = computed(() => communityStore.posts as Post[])

const hotTopics = ['前端面试', '考研经验', '食堂测评', '宿舍生活', '校园周边', '实习分享', '课程推荐', '社团招新']

const activeUsers = [
  { name: '代码小王子', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60', posts: 128, followed: false },
  { name: '上岸学长', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b8167ba71b?w=60', posts: 89, followed: true },
  { name: '干饭人一号', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60', posts: 67, followed: false },
  { name: '考研党小李', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60', posts: 45, followed: false }
]

const notices = [
  '关于论坛新版上线试运行的通知',
  '社区规范更新：禁止发布广告信息',
  '【活动】春季摄影大赛征稿中',
  '关于账号实名认证的说明'
]

function getBoardColor(board: string): string {
  const map: Record<string, string> = { tech: '#3b82f6', life: '#f59e0b', study: '#10b981', emotion: '#ec4899', trade: '#8b5cf6' }
  return map[board] || '#6b7280'
}

function formatTime(timeStr: string): string {
  const date = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  return `${date.getMonth() + 1}-${date.getDate()}`
}

function formatCount(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
  return String(n)
}

const filteredPosts = computed(() => {
  let result = [...posts.value]

  if (activeBoard.value !== 'all') {
    result = result.filter(p => p.board === activeBoard.value)
  }

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(kw) ||
      (p.excerpt || p.content || '').toLowerCase().includes(kw) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(kw)))
    )
  }

  switch (sortBy.value) {
    case 'hot': result.sort((a, b) => b.likes - a.likes); break
    case 'essence': result.filter(p => p.isTop || p.likes > 100).sort((a, b) => b.likes - a.likes); break
    case 'latest':
    default: result.sort((a, b) => new Date(b.publishTime || b.createdAt).getTime() - new Date(a.publishTime || a.createdAt).getTime()); break
  }

  return result
})

async function handleSearch() {
  try {
    await communityStore.fetchPosts({ keyword: searchKeyword.value })
  } catch (err: any) {
    ElMessage.error(err.message || '搜索失败')
  }
}

function loadMore() {
  loadingMore.value = true
  setTimeout(() => { loadingMore.value = false }, 800)
}

onMounted(async () => {
  try {
    await Promise.all([
      communityStore.fetchBoards(),
      communityStore.fetchPosts()
    ])
  } catch (err: any) {
    ElMessage.error(err.message || '加载数据失败')
  }
})
</script>

<style scoped>
.forum-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
}

.page-header {
  background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
  padding: 1.25rem 0;
  color: white;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.publish-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1.25rem;
  background: rgba(255,255,255,0.2);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 9999px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.publish-btn:hover { background: rgba(255,255,255,0.3); }

.top-bar { border: 1px solid rgba(0,0,0,0.05); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; }

.board-tabs { display: flex; gap: 0.375rem; flex-wrap: wrap; }

.board-tab {
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  background: white;
  border: 1px solid #e5e7eb;
  font-size: 0.8125rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}
.board-tab:hover { border-color: #db2777; color: #db2777; }
.board-tab.active {
  background: linear-gradient(135deg, #db2777 0%, #be185d 100%);
  color: white;
  border-color: transparent;
  font-weight: 600;
}

.search-wrap {
  position: relative;
  display: flex;
  align-items: center;
}
.search-wrap .el-icon { position: absolute; left: 0.75rem; color: #9ca3af; z-index: 1; }

.forum-search {
  width: 240px;
  padding: 0.625rem 0.75rem 0.625rem 2.25rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
  background: white;
}
.forum-search:focus { border-color: #db2777; box-shadow: 0 0 0 3px rgba(219, 39, 119, 0.08); }

.content-layout {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.5rem;
}

.sort-label { font-size: 0.8125rem; color: #6b7280; font-weight: 500; }

.sort-chips-group { display: inline-flex; }

.sort-chip {
  padding: 0.375rem 0.875rem;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 0.8125rem;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}
.sort-chip.active { background: white; color: #db2777; font-weight: 600; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }

.posts-feed { display: flex; flex-direction: column; gap: 1rem; }

.post-card {
  border: 1px solid rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
  background: white;
}
.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(219, 39, 119, 0.1);
}

.pc-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 1.25rem 0.75rem;
}

.author-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.author-info { display: flex; flex-direction: column; gap: 0.0625rem; }

.author-name { font-size: 0.875rem; font-weight: 600; color: #1f2937; }

.post-meta { font-size: 0.75rem; color: #9ca3af; display: flex; align-items: center; gap: 0.25rem; }

.board-tag { font-weight: 600; }

.top-badge {
  margin-left: auto;
  padding: 0.125rem 0.5rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #b45309;
  border-radius: 4px;
  font-size: 0.6875rem;
  font-weight: 700;
  flex-shrink: 0;
}

.pc-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.5;
  margin-bottom: 0.375rem;
  padding: 0 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pc-excerpt {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 0.75rem;
  padding: 0 1.25rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pc-images {
  display: flex;
  gap: 0.5rem;
  padding: 0 1.25rem;
  margin-bottom: 0.75rem;
}

.pc-img {
  width: 140px;
  height: 96px;
  object-fit: cover;
  border-radius: 10px;
  flex-shrink: 0;
}
.pc-img.single-img { width: 100%; max-height: 260px; height: auto; }

.more-count {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 96px;
  background: #f3f4f6;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  color: #9ca3af;
  flex-shrink: 0;
}

.pc-tags {
  display: flex;
  gap: 0.375rem;
  padding: 0 1.25rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.125rem 0.5rem;
  background: #fdf2f8;
  color: #db2777;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.pc-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.25rem 1rem;
  border-top: 1px solid #fce7f3;
}

.stats-row { display: flex; gap: 1rem; }

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8125rem;
  color: #9ca3af;
}

.last-reply { font-size: 0.75rem; color: #c4b5fd; }

.load-btn {
  padding: 0.625rem 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  background: white;
  color: #6b7280;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}
.load-btn:hover:not(.loading) { border-color: #db2777; color: #db2777; }
.load-btn.loading { opacity: 0.65; cursor: not-allowed; }

.forum-sidebar { display: flex; flex-direction: column; }

.sidebar-card, .active-users-card, .notice-card { border: 1px solid rgba(0,0,0,0.05); }

.sidebar-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.topic-list { display: flex; flex-direction: column; gap: 0.5rem; }

.topic-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.5rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s;
  font-size: 0.8125rem;
  color: #374151;
}
.topic-item:hover { background: #fdf2f8; }

.topic-rank {
  width: 20px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  border-radius: 6px;
  font-size: 0.6875rem;
  font-weight: 700;
  background: #f3f4f6;
  color: #9ca3af;
  flex-shrink: 0;
}
.topic-rank.top3 { background: linear-gradient(135deg, #fecaca 0%, #fecdd3 100%); color: #dc2626; }

.topic-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.topic-hot { font-size: 0.6875rem; color: #ef4444; flex-shrink: 0; }

.user-list { display: flex; flex-direction: column; gap: 0.75rem; }

.user-item {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.u-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.u-info { flex: 1; display: flex; flex-direction: column; gap: 0.0625rem; }

.u-name { font-size: 0.8125rem; font-weight: 600; color: #1f2937; }

.u-posts { font-size: 0.6875rem; color: #9ca3af; }

.follow-u-btn {
  padding: 0.25rem 0.625rem;
  border: 1px solid #db2777;
  border-radius: 6px;
  background: transparent;
  color: #db2777;
  font-size: 0.6875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}
.follow-u-btn:hover { background: #fdf2f8; }
.follow-u-btn.followed { border-color: #d1d5db; color: #9ca3af; background: #f9fafb; }

.notice-list { display: flex; flex-direction: column; gap: 0.625rem; }

.notice-item {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.8125rem;
  color: #4b5563;
  text-decoration: none;
  line-height: 1.5;
  transition: color 0.2s;
}
.notice-item:hover { color: #db2777; }

.notice-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #db2777;
  flex-shrink: 0;
  margin-top: 0.5rem;
}

.empty-state { border: 1px solid rgba(0,0,0,0.05); }
.empty-icon { font-size: 3.5rem; color: #fbcfe8; margin-bottom: 1rem; }
.empty-state h3 { font-size: 1.125rem; color: #374151; margin-bottom: 0.375rem; }
.empty-state p { color: #9ca3af; }

@media (max-width: 1024px) {
  .content-layout { grid-template-columns: 1fr; }
  .forum-sidebar { display: none; }
}

@media (max-width: 640px) {
  .header-content { flex-direction: column; gap: 0.75rem; text-align: center; }
  .pc-img { width: 90px; height: 64px; }
  .more-count { width: 44px; height: 64px; font-size: 0.75rem; }
  .pc-footer { flex-direction: column; gap: 0.5rem; align-items: flex-start; }
}
</style>
