<template>
  <div class="post-detail-page">
    <div class="detail-container max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
      <nav class="breadcrumb mb-6">
        <router-link to="/community/forum" class="breadcrumb-link">校园论坛</router-link>
        <span class="separator">/</span>
        <span class="current">帖子详情</span>
      </nav>

      <div v-if="loading" class="skeleton-wrap">
        <Skeleton type="card" />
      </div>

      <div v-else class="detail-layout">
        <main class="main-column">
          <article class="post-article glass-effect rounded-2xl overflow-hidden">
            <header class="post-header">
              <div class="author-info">
                <img :src="post.authorAvatar" :alt="post.authorName" class="author-avatar" width="48" height="48" />
                <div class="author-meta">
                  <h4 class="author-name">{{ post.authorName }}</h4>
                  <div class="post-meta-row">
                    <span class="post-time">{{ formatTime(post.publishTime) }}</span>
                    <span class="post-board" :style="{ color: post.boardColor }">
                      {{ post.board }}
                    </span>
                    <span class="view-count"><el-icon><View /></el-icon> {{ post.views }}
                    </span>
                  </div>
                </div>
              </div>
              <h1 class="post-title">{{ post.title }}</h1>
              <div class="post-tags">
                <span v-for="tag in post.tags" :key="tag" class="post-tag">#{{ tag }}</span>
              </div>
            </header>

            <div class="post-content">
              <div
                v-for="(block, idx) in post.contentBlocks"
                :key="idx"
                class="content-block"
                :class="block.type"
              >
                <p v-if="block.type === 'text'" v-html="formatContent(block.text)"></p>
                <img v-if="block.type === 'image'" :src="block.src" :alt="`配图${idx + 1}`" class="content-image" />
                <blockquote v-if="block.type === 'quote'">
                  {{ block.text }}
                </blockquote>
              </div>
            </div>

            <footer class="post-footer">
              <div class="action-bar">
                <button class="action-btn" :class="{ active: isLiked, 'like-bounce': likeAnimating }" @click="toggleLike">
                  <el-icon><StarFilled v-if="isLiked" /><Star v-else /></el-icon>
                  <span>{{ displayLikes }} 赞</span>
                </button>
                <button class="action-btn" @click="scrollToComment">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>{{ comments.length }} 评论</span>
                </button>
                <button class="action-btn collect-btn" :class="{ active: isCollected, 'collect-rotate': collectAnimating }" @click="toggleCollect">
                  <el-icon><StarFilled v-if="isCollected" /><CollectionTag v-else /></el-icon>
                  <span>收藏</span>
                </button>
                <button class="action-btn share-btn-trigger" @click="showSharePanel = !showSharePanel">
                  <el-icon><Share /></el-icon>
                  <span>分享</span>
                </button>
              </div>

              <!-- 分享面板 -->
              <transition name="share-panel-fade">
                <div v-if="showSharePanel" class="share-panel-overlay" @click.self="showSharePanel = false">
                  <div class="share-panel">
                    <h4 class="share-panel-title">分享到</h4>
                    <div class="share-options">
                      <button class="share-option" @click="copyLink">
                        <div class="share-option-icon link">🔗</div>
                        <span>复制链接</span>
                      </button>
                      <button class="share-option" @click="generatePoster">
                        <div class="share-option-icon poster">🖼️</div>
                        <span>生成海报</span>
                      </button>
                      <button class="share-option" @click="shareToWechat">
                        <div class="share-option-icon wechat">💬</div>
                        <span>微信好友</span>
                      </button>
                    </div>
                    <button class="share-cancel-btn" @click="showSharePanel = false">取消</button>
                  </div>
                </div>
              </transition>
            </footer>
          </article>

          <section ref="commentSection" class="comments-section glass-effect rounded-2xl p-6 mt-6">
            <h3 class="comments-title">
              全部评论 ({{ comments.length }})
            </h3>

            <div class="comment-input-area">
              <img :src="myAvatar" alt="我的头像" class="my-avatar" />
              <div class="input-wrapper">
                <textarea
                  v-model="newComment"
                  placeholder="写下你的想法..."
                  class="comment-textarea"
                  rows="3"
                  maxlength="500"
                  @focus="handleCommentFocus"
                ></textarea>
                <div class="input-actions">
                  <div class="emoji-toolbar">
                    <button class="tool-btn" title="表情">😊</button>
                    <button class="tool-btn" title="图片">🖼️</button>
                    <button class="tool-btn" title="@提及">@</button>
                  </div>
                  <div class="submit-area">
                    <span class="char-count">{{ newComment.length }}/500</span>
                    <button class="submit-btn" :disabled="!newComment.trim()" @click="submitComment">
                      发布评论
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="sort-bar">
              <button
                v-for="sort in commentSorts"
                :key="sort.value"
                class="sort-chip"
                :class="{ active: commentSort === sort.value }"
                @click="commentSort = sort.value"
              >
                {{ sort.label }}
              </button>
            </div>

            <div class="comments-list">
              <div
                v-for="comment in sortedComments"
                :key="comment.id"
                class="comment-item"
              >
                <img :src="comment.avatar || defaultAvatar" :alt="comment.author" class="c-avatar" />
                <div class="c-body">
                  <div class="c-header">
                    <span class="c-author" :class="{ isOP: comment.isOP }">
                      {{ comment.author }}
                      <span v-if="comment.isOP" class="op-badge">楼主</span>
                    </span>
                    <span class="c-floor">#{{ comment.floor }}</span>
                    <span class="c-time">{{ formatTime(comment.time) }}</span>
                  </div>
                  <p class="c-content">{{ comment.content }}</p>
                  <div v-if="comment.images && comment.images.length > 0" class="c-images">
                    <img
                      v-for="(img, i) in comment.images"
                      :key="i"
                      :src="img"
                      :alt="`评论图${i + 1}`"
                      class="c-img"
                    />
                  </div>
                  <div class="c-actions">
                    <button class="c-action" :class="{ active: comment.isLiked }" @click="likeComment(comment)">
                      <el-icon><Star /></el-icon> {{ comment.likes || '' }}
                    </button>
                    <button class="c-action" @click="replyTo(comment)">回复</button>
                    <button class="c-action c-report">举报</button>
                  </div>
                  <div v-if="replyTarget?.id === comment.id" class="reply-input-area">
                    <textarea
                      v-model="replyText"
                      :placeholder="`回复 ${comment.author}：`"
                      class="reply-textarea"
                      rows="2"
                    ></textarea>
                    <div class="reply-actions">
                      <button class="cancel-reply" @click="cancelReply">取消</button>
                      <button class="send-reply" @click="sendReply(comment)" :disabled="!replyText.trim()">发送</button>
                    </div>
                  </div>
                  <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
                    <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                      <span class="reply-author" :class="{ isOP: reply.isOP }">{{ reply.author }}</span>
                      <template v-if="reply.replyTo">
                        <span class="reply-arrow"> 回复 </span>
                        <span class="reply-to">{{ reply.replyTo }}</span>
                      </template>
                      <span class="reply-sep">：</span>
                      <span class="reply-text">{{ reply.text }}</span>
                      <span class="reply-time">{{ formatTime(reply.time) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <aside class="sidebar-column">
          <div class="author-card glass-effect rounded-2xl p-5 sticky top-24">
            <div class="ac-header">
              <img :src="post.authorAvatar" :alt="post.authorName" class="ac-avatar" />
              <div class="ac-info">
                <h4>{{ post.authorName }}</h4>
                <p class="ac-bio">{{ post.authorBio }}</p>
              </div>
            </div>
            <div class="ac-stats">
              <div class="ac-stat-item">
                <strong>{{ post.authorPosts }}</strong>
                <span>帖子</span>
              </div>
              <div class="ac-stat-item">
                <strong>{{ post.authorFollowers }}</strong>
                <span>粉丝</span>
              </div>
              <div class="ac-stat-item">
                <strong>{{ post.authorFollowing }}</strong>
                <span>关注</span>
              </div>
            </div>
            <button class="follow-btn" :class="{ following: isFollowing }" @click="toggleFollow">
              {{ isFollowing ? '已关注' : '+ 关注' }}
            </button>
          </div>

          <div class="related-card glass-effect rounded-2xl p-5 mt-4">
            <h4 class="rc-title">相关推荐</h4>
            <div class="related-list">
              <router-link
                v-for="rp in relatedPosts"
                :key="rp.id"
                :to="`/community/post/${rp.id}`"
                class="related-item"
              >
                <span class="rp-title">{{ rp.title }}</span>
                <span class="rp-meta">
                  <el-icon><View /></el-icon> {{ rp.views }}
                </span>
              </router-link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  View, Star, StarFilled, ChatDotRound,
  CollectionTag, Share
} from '@element-plus/icons-vue'
import Skeleton from '@/components/Skeleton.vue'
import { useCommunityStore } from '@/stores/community'

const route = useRoute()
const router = useRouter()
const communityStore = useCommunityStore()

interface ContentBlock {
  type: 'text' | 'image' | 'quote'
  text?: string
  src?: string
}

interface Reply {
  id: number
  author: string
  isOP?: boolean
  replyTo?: string
  text: string
  time: string
}

interface Comment {
  id: number
  author: string
  avatar?: string
  content: string
  time: string
  floor: number
  likes: number
  isLiked: boolean
  isOP: boolean
  images?: string[]
  replies?: Reply[]
}

const loading = computed(() => communityStore.loading)
const isLiked = ref(false)
const isCollected = ref(false)
const isFollowing = ref(false)
const newComment = ref('')
const commentSort = ref('hot')
const replyTarget = ref<Comment | null>(null)
const replyText = ref('')
const commentSection = ref<HTMLElement | null>(null)
const showSharePanel = ref(false)
const likeAnimating = ref(false)
const collectAnimating = ref(false)

// 从 localStorage 恢复状态
onMounted(async () => {
  try {
    await communityStore.fetchPostDetail(route.params.id as string)

    // 恢复点赞状态
    const likedKey = `liked-post-${route.params.id}`
    const savedLiked = localStorage.getItem(likedKey)
    if (savedLiked === 'true') {
      isLiked.value = true
    }

    // 恢复收藏状态
    const collectedKey = `collected-post-${route.params.id}`
    const savedCollected = localStorage.getItem(collectedKey)
    if (savedCollected === 'true') {
      isCollected.value = true
    }
  } catch (err: any) {
    ElMessage.error(err.message || '获取帖子详情失败')
  }
})

const myAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80'
const defaultAvatar = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80'

const commentSorts = [
  { value: 'hot', label: '最热' },
  { value: 'newest', label: '最新' }
]

const post = computed(() => {
  const currentPost = communityStore.currentPost
  if (currentPost) {
    return {
      id: currentPost.id,
      title: currentPost.title,
      authorName: currentPost.authorName || '匿名用户',
      authorAvatar: currentPost.authorAvatar || defaultAvatar,
      authorBio: currentPost.authorBio || '',
      authorPosts: currentPost.authorPosts || 0,
      authorFollowers: currentPost.authorFollowers || 0,
      authorFollowing: currentPost.authorFollowing || 0,
      board: currentPost.boardName || '未分类',
      boardColor: '#3b82f6',
      publishTime: currentPost.publishTime || currentPost.createdAt || new Date().toISOString(),
      views: currentPost.views || 0,
      likes: currentPost.likes || 0,
      tags: currentPost.tags || [],
      contentBlocks: (currentPost.contentBlocks && currentPost.contentBlocks.length > 0
        ? currentPost.contentBlocks
        : currentPost.content
          ? [{ type: 'text', text: currentPost.content, content: currentPost.content }]
          : []) as ContentBlock[]
    }
  }
  return {
    id: 0,
    title: '帖子不存在',
    authorName: '',
    authorAvatar: defaultAvatar,
    authorBio: '',
    authorPosts: 0,
    authorFollowers: 0,
    authorFollowing: 0,
    board: '',
    boardColor: '#6b7280',
    publishTime: new Date().toISOString(),
    views: 0,
    likes: 0,
    tags: [],
    contentBlocks: [] as ContentBlock[]
  }
})

const comments = computed(() => {
  const currentPost = communityStore.currentPost
  return (currentPost?.comments || []) as Comment[]
})

const relatedPosts = [
  { id: 2, title: '【面经】字节跳动前端实习面试经验分享', views: 8921 },
  { id: 3, title: 'Vue3 vs React：2026年该如何选择？', views: 5634 },
  { id: 4, title: '从0到1搭建一个完整的Vue3项目', views: 4521 },
  { id: 5, title: '前端工程师必备的Chrome开发者工具技巧', views: 3201 }
]

// 显示点赞数（已赞时+1）
const displayLikes = computed(() => {
  return isLiked.value ? post.value.likes + 1 : post.value.likes
})

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
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

function formatContent(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/### (.*)/g, '<h3>$1</h3>')
    .replace(/## (.*)/g, '<h2>$1</h2>')
    .replace(/- (.*)/g, '<li>$1</li>')
    .replace(/\n/g, '<br/>')
}

const sortedComments = computed(() => {
  const list = [...comments.value]
  if (commentSort.value === 'hot') {
    return list.sort((a, b) => b.likes - a.likes)
  }
  return list.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
})

async function toggleLike() {
  // 触发弹跳动画
  likeAnimating.value = true
  setTimeout(() => {
    likeAnimating.value = false
  }, 600)

  try {
    isLiked.value = !isLiked.value

    // 持久化到 localStorage
    const likedKey = `liked-post-${post.value.id}`
    localStorage.setItem(likedKey, String(isLiked.value))

    await communityStore.toggleLikePost(String(post.value.id), isLiked.value)
    ElMessage.success(isLiked.value ? '已点赞 ❤️' : '已取消点赞')
  } catch (err: any) {
    isLiked.value = !isLiked.value
    ElMessage.error(err.message || '操作失败')
  }
}

function toggleCollect() {
  // 触发旋转动画
  collectAnimating.value = true
  setTimeout(() => {
    collectAnimating.value = false
  }, 800)

  isCollected.value = !isCollected.value

  // 持久化到 localStorage
  const collectedKey = `collected-post-${post.value.id}`
  localStorage.setItem(collectedKey, String(isCollected.value))

  ElMessage.success(isCollected.value ? '已收藏到我的收藏夹 ⭐' : '已取消收藏')
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(() => {
    ElMessage.success('链接已复制到剪贴板 📋')
    showSharePanel.value = false
  }).catch(() => {
    ElMessage.error('复制失败，请手动复制')
  })
}

function generatePoster() {
  ElMessage.info('海报生成功能开发中 🎨')
  showSharePanel.value = false
}

function shareToWechat() {
  if (navigator.share) {
    navigator.share({
      title: post.value.title,
      text: `看看这个帖子：${post.value.title}`,
      url: window.location.href
    }).then(() => {
      ElMessage.success('分享成功 ✨')
      showSharePanel.value = false
    }).catch(() => {
      // 用户取消分享
    })
  } else {
    ElMessage.info('您的浏览器不支持原生分享，已为您复制链接')
    copyLink()
  }
}

function scrollToComment() {
  commentSection.value?.scrollIntoView({ behavior: 'smooth' })
}

function handleCommentFocus() {
  // 聚焦时延迟滚动到底部
  setTimeout(() => {
    commentSection.value?.scrollIntoView({ behavior: 'smooth' })
  }, 300)
}

async function submitComment() {
  if (!newComment.value.trim()) return
  try {
    await communityStore.addComment(String(post.value.id), newComment.value.trim())
    newComment.value = ''
    await communityStore.fetchPostDetail(route.params.id as string)
    ElMessage.success('评论发布成功')
  } catch (err: any) {
    ElMessage.error(err.message || '评论发布失败')
  }
}

function likeComment(comment: Comment) {
  comment.isLiked = !comment.isLiked
  comment.likes += comment.isLiked ? 1 : -1
}

function replyTo(comment: Comment) {
  replyTarget.value = replyTarget.value?.id === comment.id ? null : comment
  replyText.value = ''
}

function cancelReply() {
  replyTarget.value = null
  replyText.value = ''
}

function sendReply(comment: Comment) {
  if (!replyText.value.trim()) return
  if (!comment.replies) comment.replies = []
  comment.replies.push({
    id: Date.now(),
    author: '我',
    replyTo: comment.author,
    text: replyText.value.trim(),
    time: new Date().toISOString()
  })
  replyText.value = ''
  replyTarget.value = null
  ElMessage.success('回复成功')
}

function toggleFollow() {
  isFollowing.value = !isFollowing.value
  ElMessage.success(isFollowing.value ? '已关注作者' : '已取消关注')
}
</script>

<style scoped>
.post-detail-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
}

.breadcrumb {
  font-size: 0.875rem;
  color: #9ca3af;
}

.breadcrumb-link {
  color: #ec4899;
  text-decoration: none;
  transition: color 0.2s;
}
.breadcrumb-link:hover { color: #db2777; }

.separator { margin: 0 0.5rem; }
.current { color: #374151; }

.detail-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 1.5rem;
}

.post-article {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.post-header {
  padding: 1.75rem 2rem;
  border-bottom: 1px solid #fce7f3;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fce7f3;
}

.author-meta {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.author-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
}

.post-meta-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: #9ca3af;
}

.post-board {
  font-weight: 600;
}

.view-count {
  display: inline-flex;
  align-items: center;
  gap: 0.125rem;
}

.post-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1f2937;
  line-height: 1.4;
  margin-bottom: 0.75rem;
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.post-tag {
  padding: 0.1875rem 0.5625rem;
  background: #fdf2f8;
  color: #ec4899;
  border-radius: 6px;
  font-size: 0.8125rem;
  font-weight: 500;
}

.post-content {
  padding: 2rem;
}

.content-block {
  margin-bottom: 1.25rem;
}

.content-block.text p {
  font-size: 0.9375rem;
  line-height: 1.85;
  color: #374151;
}

.content-block.text :deep(h2) {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin: 1.5rem 0 0.75rem;
  padding-bottom: 0.375rem;
  border-bottom: 2px solid #fce7f3;
}

.content-block.text :deep(h3) {
  font-size: 1.0625rem;
  font-weight: 600;
  color: #374151;
  margin: 1.25rem 0 0.5rem;
}

.content-block.text :deep(li) {
  list-style-position: inside;
  color: #4b5563;
  line-height: 1.8;
}

.content-image {
  width: 100%;
  max-height: 450px;
  object-fit: cover;
  border-radius: 12px;
}

.content-block.quote {
  padding: 1rem 1.25rem;
  background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%);
  border-left: 4px solid #ec4899;
  border-radius: 0 12px 12px 0;
  font-style: italic;
  color: #831843;
  font-size: 0.9375rem;
  line-height: 1.7;
}

.post-footer {
  padding: 1.25rem 2rem;
  border-top: 1px solid #fce7f3;
}

.action-bar {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  border-radius: 10px;
  background: #fdf2f8;
  border: 1px solid #fce7f3;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
  color: #6b7280;
}

.action-btn:hover {
  background: #fce7f3;
  color: #ec4899;
}

.action-btn.active {
  background: #ec4899;
  color: white;
  border-color: #ec4899;
}

/* 点赞弹跳动画 */
.like-bounce {
  animation: like-bounce 0.6s ease;
}

@keyframes like-bounce {
  0% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(0.95); }
  75% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

/* 收藏旋转动画 */
.collect-rotate .el-icon {
  animation: collect-rotate 0.8s ease;
}

@keyframes collect-rotate {
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.2); }
  100% { transform: rotate(360deg) scale(1); }
}

/* 分享面板 */
.share-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 10000;
}

.share-panel {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 16px 16px 0 0;
  padding: 2rem 1.5rem 1.5rem;
  animation: slide-up 0.3s ease;
}

@keyframes slide-up {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.share-panel-title {
  font-size: 1rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.share-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.share-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.share-option:hover .share-option-icon {
  transform: translateY(-4px);
}

.share-option-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  transition: all 0.2s;
}

.share-option-icon.link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.share-option-icon.poster {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.share-option-icon.wechat {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.share-option span {
  font-size: 0.8125rem;
  color: #374151;
  font-weight: 500;
}

.share-cancel-btn {
  width: 100%;
  padding: 0.875rem;
  background: #f3f4f6;
  border: none;
  border-radius: 12px;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.share-cancel-btn:hover {
  background: #e5e7eb;
}

/* 分享面板过渡 */
.share-panel-fade-enter-active,
.share-panel-fade-leave-active {
  transition: opacity 0.3s ease;
}

.share-panel-fade-enter-from,
.share-panel-fade-leave-to {
  opacity: 0;
}

.comments-section {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.comments-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1.25rem;
}

.comment-input-area {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.my-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.input-wrapper {
  flex: 1;
}

.comment-textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 0.9375rem;
  resize: vertical;
  outline: none;
  transition: all 0.2s;
  font-family: inherit;
  box-sizing: border-box;
  background: white;
}

.comment-textarea:focus {
  border-color: #ec4899;
  box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.08);
}

.input-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

.emoji-toolbar {
  display: flex;
  gap: 0.25rem;
}

.tool-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.2s;
}

.tool-btn:hover { background: #fdf2f8; }

.submit-area {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.char-count {
  font-size: 0.75rem;
  color: #9ca3af;
}

.submit-btn {
  padding: 0.5rem 1.25rem;
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.submit-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.sort-bar {
  display: flex;
  gap: 0.375rem;
  margin-bottom: 1.25rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 10px;
  width: fit-content;
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
  color: #ec4899;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item {
  display: flex;
  gap: 0.75rem;
}

.c-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.c-body {
  flex: 1;
  min-width: 0;
}

.c-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.375rem;
  flex-wrap: wrap;
}

.c-author {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.c-author.isOP { color: #ec4899; }

.op-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  background: #fdf2f8;
  color: #ec4899;
  padding: 0.0625rem 0.375rem;
  border-radius: 4px;
}

.c-floor {
  font-size: 0.75rem;
  color: #d1d5db;
}

.c-time {
  font-size: 0.75rem;
  color: #9ca3af;
}

.c-content {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 0.5rem;
}

.c-images {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.c-img {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.c-img:hover { transform: scale(1.05); }

.c-actions {
  display: flex;
  gap: 1rem;
}

.c-action {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background: none;
  border: none;
  font-size: 0.75rem;
  color: #9ca3af;
  cursor: pointer;
  transition: color 0.2s;
  padding: 0.25rem 0;
}

.c-action:hover { color: #ec4899; }
.c-action.active { color: #ec4899; }
.c-action.c-report:hover { color: #ef4444; }

.reply-input-area {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #fafafa;
  border-radius: 10px;
}

.reply-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.8125rem;
  resize: none;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
}

.reply-textarea:focus { border-color: #ec4899; }

.reply-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.cancel-reply {
  padding: 0.375rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  font-size: 0.75rem;
  cursor: pointer;
  color: #6b7280;
}

.send-reply {
  padding: 0.375rem 0.875rem;
  border: none;
  border-radius: 6px;
  background: #ec4899;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
}

.send-reply:disabled { opacity: 0.5; cursor: not-allowed; }

.replies-list {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #fefefe;
  border-radius: 8px;
  border-left: 3px solid #fce7f3;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.reply-item {
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #6b7280;
}

.reply-author.isOP { color: #ec4899; font-weight: 600; }
.reply-author { font-weight: 600; color: #374151; }
.reply-arrow { color: #9ca3af; }
.reply-to { color: #ec4899; }
.reply-sep { color: #9ca3af; }
.reply-text { color: #4b5563; }
.reply-time { margin-left: auto; font-size: 0.6875rem; color: #c4b5fd; }

.sidebar-column {
  display: flex;
  flex-direction: column;
}

.author-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.ac-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.ac-avatar {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fce7f3;
}

.ac-info h4 {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
}

.ac-bio {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.125rem;
}

.ac-stats {
  display: flex;
  justify-content: space-around;
  padding: 0.75rem 0;
  border-top: 1px solid #fce7f3;
  border-bottom: 1px solid #fce7f3;
  margin-bottom: 1rem;
}

.ac-stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.125rem;
}

.ac-stat-item strong {
  font-size: 1.0625rem;
  color: #1f2937;
}

.ac-stat-item span {
  font-size: 0.6875rem;
  color: #9ca3af;
}

.follow-btn {
  width: 100%;
  padding: 0.625rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
  color: white;
}

.follow-btn.following {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

.follow-btn:not(.following):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.related-card {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.rc-title {
  font-size: 0.9375rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 1rem;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.related-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  text-decoration: none;
  transition: background 0.2s;
}

.related-item:hover { background: #fdf2f8; }

.rp-title {
  font-size: 0.8125rem;
  font-weight: 500;
  color: #374151;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rp-meta {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.6875rem;
  color: #9ca3af;
  flex-shrink: 0;
}

@media (max-width: 1024px) {
  .detail-layout {
    grid-template-columns: 1fr;
  }

  .sidebar-column {
    order: -1;
  }

  .related-card { display: none; }
}

@media (max-width: 640px) {
  .post-header { padding: 1.25rem; }
  .post-content { padding: 1.25rem; }
  .post-footer { padding: 1rem 1.25rem; }
  .post-title { font-size: 1.25rem; }

  .action-bar { flex-wrap: wrap; }
  .action-btn { min-width: calc(50% - 0.25rem); }

  .comment-input-area { flex-direction: column; }
  .my-avatar { display: none; }
}
</style>
