<template>
  <div class="min-h-screen bg-surface-secondary">
    <!-- Hero Section - 现代化搜索头部 -->
    <div class="relative overflow-hidden">
      <!-- 背景渐变 -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary via-primary-600 to-primary-400">
        <div class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
      </div>
      
      <!-- 装饰性圆形 -->
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-32 -left-32 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
      
      <!-- Hero Content -->
      <div class="relative max-w-screen-xl mx-auto px-4 lg:px-8 py-16 lg:py-24">
        <div class="text-center max-w-3xl mx-auto">
          <!-- 标题动画 -->
          <div class="scroll-animate scroll-animate-scale">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <el-icon :size="16" class="text-white/80"><Headset /></el-icon>
              <span class="text-sm text-white/90 font-medium">24小时在线服务</span>
            </div>
            
            <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              帮助中心
            </h1>
            <p class="text-lg text-white/80 mb-8 font-light">
              常见问题解答与使用指南，助您快速解决问题
            </p>
          </div>
          
          <!-- 搜索框 -->
          <div class="scroll-animate scroll-animate-delay-1">
            <div class="relative max-w-2xl mx-auto">
              <div class="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <el-icon :size="20" class="text-text-tertiary"><Search /></el-icon>
              </div>
              <input 
                v-model="searchQuery"
                type="text"
                placeholder="搜索问题关键词，如：订单、支付、请假..."
                class="w-full pl-12 pr-4 py-4 rounded-2xl bg-white shadow-xl shadow-black/10 border-0 text-text-primary placeholder:text-text-tertiary focus:ring-4 focus:ring-white/30 focus:outline-none transition-all duration-300 text-base"
              />
              <div v-if="searchQuery" class="absolute inset-y-0 right-4 flex items-center">
                <button @click="searchQuery = ''" class="p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <el-icon :size="16" class="text-text-quaternary"><Close /></el-icon>
                </button>
              </div>
            </div>
            
            <!-- 热门搜索 -->
            <div class="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span class="text-sm text-white/60">热门：</span>
              <button 
                v-for="tag in hotTags" 
                :key="tag"
                @click="searchQuery = tag"
                class="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-sm text-white/80 transition-all duration-200 border border-white/10"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 快捷入口卡片 -->
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 -mt-8 relative z-10">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          v-for="(card, idx) in quickCards" 
          :key="idx"
          @click="scrollToSection(card.section)"
          class="group bg-white rounded-2xl p-5 cursor-pointer shadow-lg shadow-black/5 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 border border-border-subtle"
        >
          <div class="flex items-start justify-between mb-3">
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
              :style="{ background: card.gradient }"
            >
              <el-icon :size="24" class="text-white"><component :is="card.icon" /></el-icon>
            </div>
            <el-icon :size="16" class="text-text-quaternary group-hover:text-primary transition-colors"><ArrowRight /></el-icon>
          </div>
          <h3 class="font-semibold text-text-primary text-base mb-1">{{ card.title }}</h3>
          <p class="text-sm text-text-secondary">{{ card.desc }}</p>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- 左侧导航 -->
        <div class="lg:col-span-3">
          <div class="sticky top-24 space-y-6">
            <!-- 分类导航 -->
            <div class="bg-white rounded-2xl p-4 shadow-sm border border-border-subtle">
              <h3 class="font-semibold text-text-primary px-3 py-2 mb-2">问题分类</h3>
              <nav class="space-y-1">
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  @click="activeCategory = cat.id; scrollToSection('faq')"
                  :class="[
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    activeCategory === cat.id
                      ? 'bg-primary/5 text-primary'
                      : 'text-text-secondary hover:bg-surface-tertiary hover:text-text-primary'
                  ]"
                >
                  <el-icon :size="18"><component :is="cat.icon" /></el-icon>
                  {{ cat.name }}
                  <span 
                    :class="[
                      'ml-auto text-xs px-2 py-0.5 rounded-full',
                      activeCategory === cat.id ? 'bg-primary text-white' : 'bg-surface-tertiary text-text-tertiary'
                    ]"
                  >
                    {{ cat.count }}
                  </span>
                </button>
              </nav>
            </div>

            <!-- 联系卡片 -->
            <div class="bg-gradient-to-br from-primary to-primary-600 rounded-2xl p-5 text-white">
              <div class="flex items-center gap-3 mb-3">
                <div class="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <el-icon :size="20"><ChatDotRound /></el-icon>
                </div>
                <div>
                  <h4 class="font-semibold">在线客服</h4>
                  <p class="text-xs text-white/70">7×24小时在线</p>
                </div>
              </div>
              <button class="w-full py-2.5 rounded-xl bg-white text-primary font-semibold text-sm hover:bg-white/90 transition-colors">
                立即咨询
              </button>
            </div>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="lg:col-span-9 space-y-10">
          <!-- 常见问题 -->
          <section id="faq" class="scroll-mt-28">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <el-icon :size="20" class="text-gold"><ChatDotRound /></el-icon>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-text-primary">常见问题</h2>
                  <p class="text-sm text-text-secondary">{{ filteredFaqItems.length }} 个问题</p>
                </div>
              </div>
              
              <!-- 筛选标签 -->
              <div class="hidden sm:flex items-center gap-2">
                <button
                  v-for="filter in quickFilters"
                  :key="filter"
                  @click="activeFilter = activeFilter === filter ? '' : filter"
                  :class="[
                    'px-3 py-1.5 rounded-lg text-sm transition-all duration-200',
                    activeFilter === filter
                      ? 'bg-primary text-white'
                      : 'bg-white text-text-secondary hover:bg-surface-tertiary border border-border-subtle'
                  ]"
                >
                  {{ filter }}
                </button>
              </div>
            </div>

            <!-- FAQ 列表 -->
            <div class="space-y-3">
              <TransitionGroup name="faq-list">
                <div
                  v-for="(item, idx) in filteredFaqItems"
                  :key="idx"
                  class="bg-white rounded-2xl border border-border-subtle overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  <button
                    @click="toggleFaq(idx)"
                    class="w-full flex items-center justify-between p-5 text-left group"
                  >
                    <div class="flex items-center gap-4">
                      <span class="w-8 h-8 rounded-lg bg-primary/5 text-primary flex items-center justify-center text-sm font-bold">
                        Q{{ idx + 1 }}
                      </span>
                      <span class="font-medium text-text-primary group-hover:text-primary transition-colors">
                        {{ item.question }}
                      </span>
                    </div>
                    <div 
                      :class="[
                        'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300',
                        openFaq === idx ? 'bg-primary text-white rotate-180' : 'bg-surface-tertiary text-text-tertiary'
                      ]"
                    >
                      <el-icon :size="16"><ArrowDown /></el-icon>
                    </div>
                  </button>
                  
                  <Transition name="expand">
                    <div v-show="openFaq === idx" class="border-t border-border-subtle">
                      <div class="p-5 pl-[4.5rem]">
                        <div class="text-sm text-text-secondary leading-relaxed space-y-2" v-html="item.answer"></div>
                        <div v-if="item.tags?.length" class="mt-4 flex flex-wrap gap-2">
                          <span
                            v-for="tag in item.tags"
                            :key="tag"
                            class="px-3 py-1 rounded-full bg-surface-tertiary text-text-secondary text-xs font-medium"
                          >
                            {{ tag }}
                          </span>
                        </div>
                        
                        <!-- 有用/无用反馈 -->
                        <div class="mt-4 pt-4 border-t border-border-subtle flex items-center gap-4">
                          <span class="text-sm text-text-tertiary">这个回答对您有帮助吗？</span>
                          <div class="flex items-center gap-2">
                            <button 
                              @click="handleHelpful(idx, true)"
                              :class="[
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200',
                                helpfulMap[idx] === true ? 'bg-success/10 text-success' : 'hover:bg-surface-tertiary text-text-secondary'
                              ]"
                            >
                              <el-icon :size="14"><CircleCheck /></el-icon>
                              有用
                            </button>
                            <button 
                              @click="handleHelpful(idx, false)"
                              :class="[
                                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all duration-200',
                                helpfulMap[idx] === false ? 'bg-error/10 text-error' : 'hover:bg-surface-tertiary text-text-secondary'
                              ]"
                            >
                              <el-icon :size="14"><CircleClose /></el-icon>
                              无用
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Transition>
                </div>
              </TransitionGroup>
              
              <!-- 空状态 -->
              <div v-if="filteredFaqItems.length === 0" class="text-center py-16 bg-white rounded-2xl border border-border-subtle">
                <div class="w-20 h-20 rounded-full bg-surface-tertiary flex items-center justify-center mx-auto mb-4">
                  <el-icon :size="32" class="text-text-quaternary"><Search /></el-icon>
                </div>
                <h3 class="text-lg font-semibold text-text-primary mb-2">未找到相关问题</h3>
                <p class="text-sm text-text-secondary mb-4">尝试使用其他关键词搜索</p>
                <button @click="searchQuery = ''; activeFilter = ''" class="text-primary hover:underline">
                  清除筛选条件
                </button>
              </div>
            </div>
          </section>

          <!-- 使用指南 -->
          <section id="guide" class="scroll-mt-28">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center">
                <el-icon :size="20" class="text-info"><Reading /></el-icon>
              </div>
              <div>
                <h2 class="text-xl font-bold text-text-primary">使用指南</h2>
                <p class="text-sm text-text-secondary">分步教程，快速上手</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div
                v-for="(guide, idx) in guides"
                :key="idx"
                class="group bg-white rounded-2xl border border-border-subtle p-6 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div class="flex items-start gap-4">
                  <div class="relative">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-400 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary/20">
                      {{ String(idx + 1).padStart(2, '0') }}
                    </div>
                    <div v-if="idx < guides.length - 1" class="absolute top-full left-1/2 w-0.5 h-4 bg-gradient-to-b from-primary/30 to-transparent -translate-x-1/2 hidden md:block"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h3 class="font-semibold text-text-primary text-base mb-3 group-hover:text-primary transition-colors">
                      {{ guide.title }}
                    </h3>
                    <ol class="space-y-2">
                      <li 
                        v-for="(step, sIdx) in guide.steps" 
                        :key="sIdx"
                        class="flex items-start gap-2 text-sm text-text-secondary"
                      >
                        <span class="w-5 h-5 rounded-full bg-surface-tertiary flex items-center justify-center text-xs text-text-tertiary shrink-0 mt-0.5">
                          {{ sIdx + 1 }}
                        </span>
                        <span>{{ step }}</span>
                      </li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 联系我们 -->
          <section id="contact" class="scroll-mt-28">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-xl bg-crimson/10 flex items-center justify-center">
                <el-icon :size="20" class="text-crimson"><Service /></el-icon>
              </div>
              <div>
                <h2 class="text-xl font-bold text-text-primary">联系我们</h2>
                <p class="text-sm text-text-secondary">多种渠道，随时为您服务</p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div
                v-for="(contact, idx) in contacts"
                :key="idx"
                class="group bg-white rounded-2xl border border-border-subtle p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 text-center"
              >
                <div 
                  class="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                  :style="{ background: contact.gradient }"
                >
                  <el-icon :size="28" class="text-white"><component :is="contact.icon" /></el-icon>
                </div>
                <h3 class="font-semibold text-text-primary mb-1">{{ contact.title }}</h3>
                <p class="text-sm text-primary font-medium mb-1">{{ contact.value }}</p>
                <p v-if="contact.note" class="text-xs text-text-tertiary">{{ contact.note }}</p>
              </div>
            </div>
          </section>

          <!-- 意见反馈 -->
          <section id="feedback" class="scroll-mt-28">
            <div class="bg-gradient-to-br from-surface to-surface-secondary rounded-3xl border border-border-subtle p-6 lg:p-10 relative overflow-hidden">
              <!-- 装饰背景 -->
              <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div class="relative">
                <div class="flex items-center gap-3 mb-6">
                  <div class="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <el-icon :size="20" class="text-primary"><EditPen /></el-icon>
                  </div>
                  <div>
                    <h2 class="text-xl font-bold text-text-primary">意见反馈</h2>
                    <p class="text-sm text-text-secondary">您的建议是我们进步的动力</p>
                  </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <!-- 反馈表单 -->
                  <form @submit.prevent="submitFeedback" class="space-y-4">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div class="relative">
                        <input
                          v-model="feedbackForm.email"
                          type="email"
                          placeholder="您的邮箱（选填）"
                          class="w-full px-4 py-3 rounded-xl bg-white border border-border-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-sm"
                        />
                        <el-icon :size="16" class="absolute right-4 top-1/2 -translate-y-1/2 text-text-quaternary"><Message /></el-icon>
                      </div>
                      <select
                        v-model="feedbackForm.category"
                        class="w-full px-4 py-3 rounded-xl bg-white border border-border-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-sm appearance-none cursor-pointer"
                      >
                        <option value="" disabled>选择反馈类型</option>
                        <option value="bug">🐛 功能异常 / Bug报告</option>
                        <option value="feature">✨ 新功能建议</option>
                        <option value="ui">🎨 界面体验问题</option>
                        <option value="other">📝 其他</option>
                      </select>
                    </div>
                    
                    <div class="relative">
                      <textarea
                        v-model="feedbackForm.content"
                        rows="4"
                        placeholder="请详细描述您的问题或建议，我们会认真阅读每一条反馈..."
                        class="w-full px-4 py-3 rounded-xl bg-white border border-border-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-200 text-sm resize-none"
                      ></textarea>
                      <div class="absolute bottom-3 right-3 text-xs text-text-quaternary">
                        {{ feedbackForm.content.length }}/500
                      </div>
                    </div>

                    <div class="flex items-center justify-between">
                      <p class="text-xs text-text-tertiary">
                        <el-icon :size="12" class="inline mr-1"><InfoFilled /></el-icon>
                        提交后我们会在1-2个工作日内回复
                      </p>
                      <button
                        type="submit"
                        :disabled="!canSubmit || submitting"
                        :class="[
                          'px-8 py-3 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2',
                          canSubmit && !submitting
                            ? 'bg-gradient-to-r from-primary to-primary-400 text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5'
                            : 'bg-surface-tertiary text-text-tertiary cursor-not-allowed'
                        ]"
                      >
                        <el-icon v-if="submitting" class="animate-spin"><Loading /></el-icon>
                        <span>{{ submitting ? '提交中...' : '提交反馈' }}</span>
                        <el-icon v-if="!submitting"><ArrowRight /></el-icon>
                      </button>
                    </div>
                  </form>

                  <!-- 反馈统计 -->
                  <div class="space-y-4">
                    <div class="bg-white rounded-2xl p-5 border border-border-subtle">
                      <h4 class="font-semibold text-text-primary mb-4">反馈处理进度</h4>
                      <div class="space-y-3">
                        <div v-for="stat in feedbackStats" :key="stat.label" class="flex items-center gap-3">
                          <div class="w-2 h-2 rounded-full" :style="{ background: stat.color }"></div>
                          <span class="text-sm text-text-secondary flex-1">{{ stat.label }}</span>
                          <span class="text-sm font-semibold text-text-primary">{{ stat.value }}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="bg-gradient-to-r from-success/10 to-success/5 rounded-2xl p-5 border border-success/20">
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center">
                          <el-icon :size="20" class="text-success"><CircleCheck /></el-icon>
                        </div>
                        <div>
                          <p class="text-sm text-text-secondary">本月已解决反馈</p>
                          <p class="text-2xl font-bold text-success">1,234</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import {
  QuestionFilled, ChatDotRound, Reading, Service, EditPen,
  ArrowDown, ArrowRight, ShoppingCart, CreditCard, Document, Bell,
  Phone, Message, Location, Clock, Promotion, User, Search, Close,
  Headset, CircleCheck, CircleClose, InfoFilled, Loading, Goods,
  Wallet, Calendar
} from '@element-plus/icons-vue'

// 搜索和筛选状态
const searchQuery = ref('')
const activeCategory = ref('all')
const activeFilter = ref('')
const openFaq = ref<number | null>(0)
const helpfulMap = ref<Record<number, boolean | null>>({})

// 热门搜索标签
const hotTags = ['订单查询', '支付方式', '请假流程', '密码找回', '校园卡']

// 快速筛选
const quickFilters = ['购物', '学工', '支付', '账户']

// 分类数据
const categories = [
  { id: 'all', name: '全部问题', icon: Document, count: 8 },
  { id: 'shopping', name: '购物相关', icon: ShoppingCart, count: 3 },
  { id: 'affairs', name: '学工办理', icon: Calendar, count: 3 },
  { id: 'payment', name: '缴费支付', icon: Wallet, count: 2 },
]

// 快捷入口卡片
const quickCards = [
  { 
    title: '购物指南', 
    desc: '商品浏览、下单、支付全流程', 
    icon: ShoppingCart, 
    gradient: 'linear-gradient(135deg, #000AB0 0%, #3B82F6 100%)',
    section: 'guide' 
  },
  { 
    title: '校园服务', 
    desc: '学工办理、缴费、公告等', 
    icon: CreditCard, 
    gradient: 'linear-gradient(135deg, #B8860B 0%, #D4A84B 100%)',
    section: 'faq' 
  },
  { 
    title: '账户管理', 
    desc: '个人信息、密码修改、安全设置', 
    icon: User, 
    gradient: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
    section: 'contact' 
  },
  { 
    title: '意见反馈', 
    desc: 'Bug报告、功能建议、问题咨询', 
    icon: EditPen, 
    gradient: 'linear-gradient(135deg, #B91C1C 0%, #D64545 100%)',
    section: 'feedback' 
  }
]

// FAQ 数据
const faqItems = [
  {
    question: '如何下单购买商品？',
    answer: '<p>1. 在首页或分类页浏览商品，点击进入详情页</p><p>2. 选择规格后点击「加入购物车」或「立即购买」</p><p>3. 在购物车中确认商品信息，填写收货地址</p><p>4. 选择支付方式完成付款</p>',
    tags: ['购物', '新手'],
    category: 'shopping'
  },
  {
    question: '支持哪些支付方式？',
    answer: '<p>目前支持以下支付方式：</p><ul class="list-disc list-inside ml-2 space-y-1"><li><strong>微信支付</strong> - 推荐方式，安全快捷</li><li><strong>支付宝</strong> - 同样支持扫码和快捷支付</li><li><strong>校园卡余额</strong> - 使用校园卡预充值金额支付</li></ul>',
    tags: ['支付'],
    category: 'payment'
  },
  {
    question: '如何申请请假？',
    answer: '<p>1. 进入「学工办理」→「请假申请」模块</p><p>2. 选择请假类型（病假/事假/家庭事务/其他）</p><p>3. 填写请假原因、起止日期</p><p>4. 提交后等待辅导员审批，可在记录中查看进度</p>',
    tags: ['学工', '请假'],
    category: 'affairs'
  },
  {
    question: '学费如何缴纳？',
    answer: '<p>1. 进入「缴费中心」→「学费缴纳」页面</p><p>2. 查看待缴项目列表，勾选需要缴纳的项目</p><p>3. 确认总金额后点击支付</p><p>4. 如需缓缴可前往「绿色通道」申请延期</p><p>缴费成功后电子票据将发送至校园邮箱。</p>',
    tags: ['缴费', '学费'],
    category: 'payment'
  },
  {
    question: '忘记密码怎么办？',
    answer: '<p>在登录页面点击「忘记密码」，通过以下任一方式重置：</p><ul class="list-disc list-inside ml-2 space-y-1"><li><strong>学号+身份证号验证</strong></li><li><strong>绑定手机号接收验证码</strong></li><li><strong>联系学工处人工重置</strong>（电话：0451-88036000）</li></ul>',
    tags: ['账户', '安全'],
    category: 'shopping'
  },
  {
    question: '如何查看订单状态？',
    answer: '<p>登录后在「个人中心」→「我的订单」中查看所有订单：</p><ul class="list-disc list-inside ml-2 space-y-1"><li><strong>待付款</strong> - 请在30分钟内完成支付</li><li><strong>已发货</strong> - 可查看物流信息</li><li><strong>已完成</strong> - 支持申请售后</li></ul>',
    tags: ['订单'],
    category: 'shopping'
  },
  {
    question: '校园卡丢失了怎么办？',
    answer: '<p>1. 进入「学工办理」→「校园卡服务」</p><p>2. 点击「挂失」按钮立即冻结卡片</p><p>3. 如需补办，点击「补办」按钮支付¥20工本费</p><p>4. 补办完成后到指定地点领取新卡</p><p class="text-crimson font-medium mt-2">⚠️ 建议第一时间挂失以保障资金安全！</p>',
    tags: ['校园卡', '安全'],
    category: 'affairs'
  },
  {
    question: '如何获取通知提醒？',
    answer: '<p>系统会自动推送以下通知：</p><ul class="list-disc list-inside ml-2 space-y-1"><li>订单状态变更通知</li><li>审批结果通知（请假/助学金等）</li><li>系统公告和活动提醒</li></ul><p>可在「个人中心」→「消息设置」中管理通知偏好。</p>',
    tags: ['通知', '设置'],
    category: 'affairs'
  }
]

// 指南数据
const guides = [
  {
    title: '首次购物流程',
    steps: ['注册/登录账号', '浏览商品或搜索关键词', '加入购物车或直接购买', '填写收货地址和联系方式', '选择支付方式并完成付款', '在「我的订单」中跟踪物流']
  },
  {
    title: '学工业务办理',
    steps: ['进入「学工办理」模块', '选择对应业务（请假/助学金/军训服等）', '填写必要信息和上传材料', '提交申请等待审核', '在记录列表中查看审批状态', '审核通过后按提示操作']
  },
  {
    title: '缴费中心使用',
    steps: ['进入「缴费中心」模块', '查看待缴项目概览', '进入具体缴费页面（学费/住宿费）', '勾选需要缴纳的项目', '确认金额后选择支付方式', '保留电子票据作为凭证']
  },
  {
    title: '校园卡管理',
    steps: ['在「学工办理」→「校园卡服务」查看余额', '如需充值，选择金额和支付方式', '消费记录实时更新可随时查看', '如遇丢失立即挂失', '补办需支付¥20工本费', '权限管理可开启/关闭门禁等功能']
  }
]

// 联系数据
const contacts = [
  { 
    title: '客服热线', 
    value: '0451-88036123', 
    icon: Phone, 
    gradient: 'linear-gradient(135deg, #000AB0 0%, #3B82F6 100%)',
    note: '工作日 8:00-17:00' 
  },
  { 
    title: '在线客服', 
    value: 'help.usth.edu.cn', 
    icon: Message, 
    gradient: 'linear-gradient(135deg, #1565C0 0%, #42A5F5 100%)',
    note: '7×24小时在线' 
  },
  { 
    title: '办公地址', 
    value: '主楼A区102室', 
    icon: Location, 
    gradient: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
    note: '学生服务中心' 
  },
  { 
    title: '响应时间', 
    value: '一般1-2工作日', 
    icon: Clock, 
    gradient: 'linear-gradient(135deg, #B8860B 0%, #D4A84B 100%)',
    note: '紧急问题优先处理' 
  }
]

// 反馈统计
const feedbackStats = [
  { label: '已处理', value: '98%', color: '#2E7D32' },
  { label: '处理中', value: '1.5%', color: '#B8860B' },
  { label: '待处理', value: '0.5%', color: '#9CA3AF' }
]

// 过滤后的 FAQ
const filteredFaqItems = computed(() => {
  let items = faqItems
  
  // 分类筛选
  if (activeCategory.value !== 'all') {
    items = items.filter(item => item.category === activeCategory.value)
  }
  
  // 标签筛选
  if (activeFilter.value) {
    items = items.filter(item => item.tags?.includes(activeFilter.value))
  }
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    items = items.filter(item => 
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query) ||
      item.tags?.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  return items
})

// 反馈表单
const feedbackForm = ref({
  email: '',
  category: '',
  content: ''
})
const submitting = ref(false)

const canSubmit = computed(() => {
  return feedbackForm.value.category && 
         feedbackForm.value.content.trim().length >= 10 &&
         feedbackForm.value.content.length <= 500
})

// 方法
function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}

function scrollToSection(id: string): void {
  const el = document.getElementById(id)
  if (el) {
    const offset = 100
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

function handleHelpful(idx: number, helpful: boolean) {
  helpfulMap.value[idx] = helpfulMap.value[idx] === helpful ? null : helpful
  if (helpfulMap.value[idx] !== null) {
    ElMessage.success(helpful ? '感谢您的认可！' : '我们会继续改进')
  }
}

async function submitFeedback(): Promise<void> {
  if (!canSubmit.value) return
  submitting.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    ElMessage.success('感谢您的反馈！我们会尽快处理。')
    feedbackForm.value = { email: '', category: '', content: '' }
  } catch {
    ElMessage.error('提交失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

// 滚动动画
onMounted(() => {
  nextTick(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    
    document.querySelectorAll('.scroll-animate').forEach(el => {
      observer.observe(el)
    })
  })
})
</script>

<style scoped>
/* 动画定义 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 滚动触发动画 */
.scroll-animate {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.scroll-animate.is-visible {
  opacity: 1;
  transform: translateY(0);
}

.scroll-animate-scale {
  transform: scale(0.95);
}

.scroll-animate-scale.is-visible {
  transform: scale(1);
}

.scroll-animate-delay-1 {
  transition-delay: 0.1s;
}

/* FAQ 展开动画 */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-height: 500px;
  opacity: 1;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

/* FAQ 列表过渡 */
.faq-list-move,
.faq-list-enter-active,
.faq-list-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-list-enter-from,
.faq-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.faq-list-leave-active {
  position: absolute;
}

/* 旋转动画 */
.rotate-180 {
  transform: rotate(180deg);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-quaternary);
}

/* 选中样式 */
::selection {
  background: var(--color-primary-200);
  color: var(--color-primary);
}

/* 减少动画偏好支持 */
@media (prefers-reduced-motion: reduce) {
  .scroll-animate,
  .faq-list-move,
  .faq-list-enter-active,
  .faq-list-leave-active,
  .expand-enter-active,
  .expand-leave-active {
    transition: none !important;
    animation: none !important;
  }
  
  .scroll-animate {
    opacity: 1;
    transform: none;
  }
}
</style>
