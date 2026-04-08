﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿﻿<template>
  <div class="page min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-8">
        <div class="flex items-center gap-4">
          <div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">活动中心</h1>
            <p class="text-sm text-text-secondary mt-1">发现精彩校园活动，结识志同道合的朋友</p>
          </div>
          <!-- 视图切换按钮组 -->
          <div class="view-switch-group">
            <button
              @click="viewMode = 'list'"
              :class="['view-switch-btn', viewMode === 'list' ? 'active' : '']"
            >
              <el-icon><List /></el-icon>列表
            </button>
            <button
              @click="viewMode = 'calendar'"
              :class="['view-switch-btn', viewMode === 'calendar' ? 'active' : '']"
            >
              <el-icon><Calendar /></el-icon>日历
            </button>
          </div>
        </div>
        <el-button type="primary" round class="!rounded-full !px-6" @click="handleShowPublish">
          <el-icon class="mr-1"><Plus /></el-icon>发布活动
        </el-button>
      </div>

      <!-- ========== 列表视图（原有内容）========== -->
      <Transition name="view-fade" mode="out-in">
        <div v-if="viewMode === 'list'" key="list-view" class="flex flex-col lg:flex-row gap-6">
        <div class="flex-1 min-w-0">
          <div class="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 mb-6 text-white relative overflow-hidden">
            <div class="absolute right-0 top-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4"></div>
            <div class="absolute left-20 bottom-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-3">
                <span class="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">本周热门</span>
                <span class="text-white/80 text-xs">{{ currentWeekRange }}</span>
              </div>
              <h2 class="text-xl font-bold mb-2">{{ featuredActivity.title || '' }}</h2>
              <p class="text-white/90 text-sm mb-4 line-clamp-2">{{ featuredActivity.description || '' }}</p>
              <div class="flex items-center gap-4 text-sm">
                <span class="flex items-center gap-1">
                  <el-icon><Calendar /></el-icon>{{ featuredActivity.date || '' }}
                </span>
                <span class="flex items-center gap-1">
                  <el-icon><Location /></el-icon>{{ featuredActivity.location || '' }}
                </span>
                <span class="flex items-center gap-1">
                  <el-icon><User /></el-icon>{{ featuredActivity.joined ?? 0 }}/{{ featuredActivity.maxPeople ?? 0 }}人
                </span>
              </div>
            </div>
          </div>

          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 mb-6">
            <div class="px-6 pt-5 pb-0">
              <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-5">
                <div class="flex gap-2 flex-wrap">
                  <button v-for="tab in categoryTabs" :key="tab.value"
                    @click="activeCategory = tab.value"
                    :class="['px-4 py-2 rounded-full text-sm font-medium transition-all duration-300',
                      activeCategory === tab.value
                        ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
                    {{ tab.label }}
                  </button>
                </div>
                <div class="flex gap-2 w-full sm:w-auto">
                  <el-input v-model="searchKeyword" placeholder="搜索活动..." prefix-icon="Search" clearable
                    class="!w-full sm:!w-56" size="default" />
                </div>
              </div>
            </div>

            <div class="px-6 pb-6">
              <div v-if="filteredActivities.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div v-for="activity in filteredActivities" :key="activity.id"
                  @click="openDetail(activity)"
                  class="group bg-gradient-to-br from-white to-gray-50/50 rounded-2xl overflow-hidden border border-gray-100 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-500/10 transition-all duration-300 cursor-pointer">
                  <div class="relative h-44 overflow-hidden">
                    <img :src="activity.cover" :alt="activity.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div class="absolute top-3 left-3 flex gap-2">
                      <span :class="['px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md',
                        activity.status === 'recruiting' ? 'bg-emerald-500/90 text-white' :
                        activity.status === 'ongoing' ? 'bg-blue-500/90 text-white' :
                        'bg-gray-500/90 text-white']">
                        {{ statusMap[activity.status] }}
                      </span>
                      <span v-if="activity.isHot" class="px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/90 text-white backdrop-blur-md">
                        🔥 热门
                      </span>
                      <span v-if="activity.isRecommended" class="px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/90 text-white backdrop-blur-md">
                        ⭐ 推荐
                      </span>
                    </div>
                    <div class="absolute bottom-3 left-3 right-3">
                      <h3 class="text-white font-bold text-base line-clamp-1 group-hover:text-teal-200 transition-colors">{{ activity.title }}</h3>
                    </div>
                  </div>
                  <div class="p-4">
                    <p class="text-gray-600 text-sm line-clamp-2 mb-3 leading-relaxed">{{ activity.description }}</p>
                    <div class="flex flex-wrap gap-2 mb-3">
                      <span v-for="tag in activity.tags" :key="tag"
                        class="px-2 py-0.5 bg-teal-50 text-teal-600 rounded text-xs">{{ tag }}</span>
                    </div>
                    <div class="space-y-2 text-sm text-gray-500">
                      <div class="flex items-center gap-2">
                        <el-icon class="text-teal-500"><Calendar /></el-icon>
                        <span>{{ activity.date }} {{ activity.time }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <el-icon class="text-teal-500"><Location /></el-icon>
                        <span>{{ activity.location }}</span>
                      </div>
                    </div>
                    <div class="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <img :src="activity.organizer?.avatar || ''" class="w-6 h-6 rounded-full object-cover" />
                        <span class="text-xs text-gray-500">{{ activity.organizer?.name || '' }}</span>
                      </div>
                      <div class="flex items-center gap-3 text-xs text-gray-400">
                        <span class="flex items-center gap-1"><el-icon><User /></el-icon>{{ activity.joined ?? 0 }}/{{ activity.maxPeople ?? 0 }}</span>
                        <span class="flex items-center gap-1"><el-icon><View /></el-icon>{{ activity.views ?? 0 }}</span>
                      </div>
                    </div>
                    <div class="mt-3">
                      <div class="flex items-center justify-between mb-1.5">
                        <span class="text-xs text-gray-400">报名进度</span>
                        <span class="text-xs font-medium" :class="getProgressColor(activity)">{{ getProgressPercent(activity) }}%</span>
                      </div>
                      <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div :class="['h-full rounded-full transition-all duration-500', getProgressBg(activity)]"
                          :style="{ width: getProgressPercent(activity) + '%' }"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-else class="py-16 text-center">
                <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <el-icon :size="40" class="text-gray-300"><DocumentDelete /></el-icon>
                </div>
                <p class="text-gray-400 text-base mb-1">暂无相关活动</p>
                <p class="text-gray-300 text-sm">换个关键词试试吧~</p>
              </div>

              <div v-if="filteredActivities.length > 0" class="mt-6 text-center">
                <button @click="loadMore"
                  class="px-8 py-2.5 rounded-full border border-gray-200 text-gray-500 text-sm hover:border-teal-300 hover:text-teal-500 transition-all duration-300">
                  加载更多活动
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:w-80 shrink-0 space-y-5">
          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5">
            <h3 class="font-bold text-text-primary mb-4 flex items-center gap-2">
              <span class="w-1 h-5 bg-gradient-to-b from-teal-400 to-cyan-400 rounded-full"></span>即将开始
            </h3>
            <div class="space-y-3">
              <div v-for="(item, index) in upcomingActivities.slice(0, 5)" :key="item.id"
                @click="openDetail(item)"
                class="flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/50 cursor-pointer transition-colors group">
                <span :class="['w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                  index < 3 ? 'bg-gradient-to-br from-teal-400 to-cyan-400 text-white' : 'bg-gray-100 text-gray-400']">
                  {{ index + 1 }}
                </span>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-text-primary line-clamp-1 group-hover:text-teal-600 transition-colors">{{ item.title }}</p>
                  <p class="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                    <el-icon><Clock /></el-icon>{{ item.date }} {{ (item.time || '').split('-')[0] }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5">
            <h3 class="font-bold text-text-primary mb-4 flex items-center gap-2">
              <span class="w-1 h-5 bg-gradient-to-b from-orange-400 to-red-400 rounded-full"></span>人气社团
            </h3>
            <div class="grid grid-cols-2 gap-3">
              <div v-for="club in popularClubs" :key="club.name"
                class="text-center p-3 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer group">
                <div class="text-3xl mb-1.5 transform group-hover:scale-110 transition-transform">{{ club.icon }}</div>
                <p class="text-xs font-medium text-text-primary">{{ club.name }}</p>
                <p class="text-[10px] text-gray-400 mt-0.5">{{ club.members }}成员</p>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100 p-5">
            <h3 class="font-bold text-orange-700 mb-2 flex items-center gap-2">
              <el-icon :size="16" class="text-orange-600"><Promotion /></el-icon> 活动公告
            </h3>
            <ul class="space-y-2.5 text-sm">
              <li v-for="notice in notices" :key="notice" class="flex items-start gap-2 text-orange-800/80">
                <span class="w-1.5 h-1.5 bg-orange-400 rounded-full mt-1.5 shrink-0"></span>
                <span>{{ notice }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      </Transition>

      <!-- ========== 日历视图 ========== -->
      <Transition name="view-fade" mode="out-in">
        <div v-if="viewMode === 'calendar'" key="calendar-view" class="calendar-view-container">
          <!-- 日历热力图 + 统计侧栏 -->
          <div class="flex flex-col lg:flex-row gap-6 mb-6">
            <!-- 左侧：日历热力图 -->
            <div class="flex-1 min-w-0">
              <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5 lg:p-6">
                <div class="flex items-center justify-between mb-4">
                  <h3 class="font-bold text-text-primary text-lg flex items-center gap-2">
                    <el-icon class="text-[#003B80]"><Calendar /></el-icon>
                    活动日历
                  </h3>
                  <div class="flex items-center gap-2">
                    <button @click="changeMonth(-1)" class="month-nav-btn" :disabled="isMinMonth">
                      <el-icon><ArrowLeft /></el-icon>
                    </button>
                    <span class="month-label font-semibold text-sm min-w-[100px] text-center">{{ currentCalendarLabel }}</span>
                    <button @click="changeMonth(1)" class="month-nav-btn" :disabled="isMaxMonth">
                      <el-icon><ArrowRight /></el-icon>
                    </button>
                  </div>
                </div>
                <div class="calendar-chart-wrapper">
                  <v-chart :option="calendarChartOption" autoresize class="calendar-echarts" @mouseover="onCalendarHover" @click="onCalendarClick" />
                </div>
                <!-- 图例 -->
                <div class="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
                  <span>少</span>
                  <div class="flex gap-0.5">
                    <span v-for="(color, i) in legendColors" :key="i" class="w-3 h-3 rounded-sm" :style="{ backgroundColor: color }"></span>
                  </div>
                  <span>多</span>
                </div>
              </div>
            </div>

            <!-- 右侧：当月统计 -->
            <div class="lg:w-72 shrink-0">
              <div class="bg-gradient-to-br from-[#003B80]/5 to-[#003B80]/10 rounded-2xl border border-[#003B80]/15 p-5 h-full">
                <h3 class="font-bold text-[#003B80] mb-4 flex items-center gap-2">
                  <el-icon><DataAnalysis /></el-icon>本月活动统计
                </h3>
                <div class="space-y-3">
                  <div class="stat-item">
                    <span class="stat-label">总计</span>
                    <span class="stat-value">{{ monthStats.total }} 场</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">已结束</span>
                    <span class="stat-value text-gray-500">{{ monthStats.ended }} 场</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">进行中</span>
                    <span class="stat-value text-blue-500">{{ monthStats.ongoing }} 场</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">即将开始</span>
                    <span class="stat-value text-emerald-500">{{ monthStats.recruiting }} 场</span>
                  </div>
                </div>

                <div class="border-t border-[#003B80]/10 mt-4 pt-4 space-y-3">
                  <div v-if="monthStats.hottestDay" class="highlight-stat">
                    <span class="text-xs text-gray-500">🏆 最活跃</span>
                    <span class="font-bold text-[#003B80]">{{ monthStats.hottestDay }}</span>
                  </div>
                  <div v-if="monthStats.mostPopular" class="highlight-stat">
                    <span class="text-xs text-gray-500">👥 最受欢迎</span>
                    <span class="font-medium text-[#003B80] text-sm line-clamp-1">{{ monthStats.mostPopular }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 日历下方联动列表 -->
          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5 lg:p-6">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-bold text-text-primary flex items-center gap-2">
                <el-icon class="text-teal-500"><Document /></el-icon>
                <template v-if="selectedDate">
                  {{ selectedDateLabel }}的活动
                  <span class="text-sm font-normal text-gray-400">（{{ filteredByDate.length }} 个）</span>
                </template>
                <template v-else>
                  全部活动
                  <span class="text-sm font-normal text-gray-400">（点击日历日期筛选）</span>
                </template>
              </h3>
              <button v-if="selectedDate" @click="selectedDate = null" class="text-xs text-teal-600 hover:text-teal-700 transition-colors">
                清除筛选
              </button>
            </div>

            <!-- 有活动的列表 -->
            <div v-if="filteredByDate.length > 0" class="space-y-3">
              <div v-for="activity in filteredByDate" :key="activity.id"
                @click="openDetail(activity)"
                class="group flex gap-4 p-4 rounded-xl bg-gradient-to-r from-white to-gray-50/50 border border-gray-100 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/10 cursor-pointer transition-all duration-300">
                <img :src="activity.cover" :alt="activity.title" class="w-24 h-24 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform duration-300" />
                <div class="min-w-0 flex-1">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <h4 class="font-bold text-text-primary text-sm line-clamp-1 group-hover:text-teal-600 transition-colors">{{ activity.title }}</h4>
                    <span :class="['px-2 py-0.5 rounded-full text-xs font-medium shrink-0',
                      activity.status === 'recruiting' ? 'bg-emerald-100 text-emerald-700' :
                      activity.status === 'ongoing' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-500']">
                      {{ statusMap[activity.status] }}
                    </span>
                  </div>
                  <p class="text-xs text-gray-500 line-clamp-1 mb-2">{{ activity.description }}</p>
                  <div class="flex items-center gap-3 text-xs text-gray-400">
                    <span class="flex items-center gap-1"><el-icon><Clock /></el-icon>{{ activity.date }} {{ activity.time?.split('-')[0] || '' }}</span>
                    <span class="flex items-center gap-1"><el-icon><Location /></el-icon>{{ activity.location }}</span>
                    <span class="flex items-center gap-1"><el-icon><User /></el-icon>{{ activity.joined }}/{{ activity.maxPeople }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 无活动时的提示 -->
            <div v-else class="py-12 text-center">
              <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full flex items-center justify-center">
                <el-icon :size="36" class="text-gray-300"><Calendar /></el-icon>
              </div>
              <p class="text-gray-500 text-base mb-1">这天暂无活动</p>
              <p class="text-gray-400 text-sm mb-4">要不要发起一个精彩活动？</p>
              <el-button type="primary" round class="!rounded-full !px-6" @click="handleShowPublish">
                <el-icon class="mr-1"><Plus /></el-icon>发起活动
              </el-button>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="selectedActivity" class="fixed inset-0 z-[var(--z-dialog-overlay)] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="closeDetail">
          <div class="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col animate-scale-in">
            <div class="relative h-56 shrink-0 overflow-hidden">
              <img :src="selectedActivity.cover" :alt="selectedActivity.title" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <button @click="closeDetail"
                class="absolute top-4 right-4 w-9 h-9 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                <el-icon :size="18"><Close /></el-icon>
              </button>
              <div class="absolute bottom-4 left-5 right-5">
                <div class="flex gap-2 mb-2">
                  <span :class="['px-2.5 py-0.5 rounded-full text-xs font-medium',
                    selectedActivity.status === 'recruiting' ? 'bg-emerald-500 text-white' :
                    selectedActivity.status === 'ongoing' ? 'bg-blue-500 text-white' : 'bg-gray-400 text-white']">
                    {{ statusMap[selectedActivity.status] }}
                  </span>
                  <span v-if="selectedActivity.category" class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white">
                    {{ getCategoryLabel(selectedActivity.category) }}
                  </span>
                </div>
                <h2 class="text-xl font-bold text-white">{{ selectedActivity.title }}</h2>
              </div>
            </div>

            <div class="overflow-y-auto flex-1 p-6">
              <div class="grid grid-cols-2 gap-4 mb-5">
                <div class="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                  <div class="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center">
                    <el-icon class="text-teal-500 text-lg"><Calendar /></el-icon>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">时间</p>
                    <p class="text-sm font-medium text-text-primary">{{ selectedActivity.date }}<br/>{{ selectedActivity.time }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                  <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <el-icon class="text-blue-500 text-lg"><Location /></el-icon>
                  </div>
                  <div>
                    <p class="text-xs text-gray-400">地点</p>
                    <p class="text-sm font-medium text-text-primary line-clamp-2">{{ selectedActivity.location }}</p>
                  </div>
                </div>
              </div>

              <div class="mb-5">
                <h4 class="font-bold text-text-primary mb-2 flex items-center gap-2">
                  <el-icon class="text-teal-500"><InfoFilled /></el-icon>活动详情
                </h4>
                <div class="prose prose-sm prose-gray max-w-none text-gray-600 leading-relaxed whitespace-pre-line">{{ selectedActivity.fullDescription || selectedActivity.description }}</div>
              </div>

              <div class="mb-5">
                <h4 class="font-bold text-text-primary mb-3 flex items-center gap-2">
                  <el-icon class="text-teal-500"><User /></el-icon>已报名 ({{ selectedActivity.joined }})
                </h4>
                <div class="flex -space-x-2">
                  <img v-for="(avatar, i) in (selectedActivity.avatars || [])" :key="i" :src="avatar"
                    class="w-9 h-9 rounded-full border-2 border-white object-cover" />
                  <span v-if="selectedActivity.joined > 6"
                    class="w-9 h-9 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                    +{{ selectedActivity.joined - 6 }}
                  </span>
                </div>
              </div>

              <div class="mb-5">
                <h4 class="font-bold text-text-primary mb-2 flex items-center gap-2">
                  <el-icon class="text-teal-500"><CollectionTag /></el-icon>标签
                </h4>
                <div class="flex flex-wrap gap-2">
                  <span v-for="tag in selectedActivity.tags" :key="tag"
                    class="px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-sm">{{ tag }}</span>
                </div>
              </div>

              <div class="bg-gray-50 rounded-xl p-4">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <img :src="selectedActivity?.organizer?.avatar || ''" class="w-11 h-11 rounded-full object-cover ring-2 ring-teal-100" />
                    <div>
                      <p class="font-medium text-text-primary text-sm">{{ selectedActivity?.organizer?.name || '' }}</p>
                      <p class="text-xs text-gray-400">{{ selectedActivity?.organizer?.club || '' }} · 活动发起人</p>
                    </div>
                  </div>
                  <el-button type="primary" size="small" round class="!rounded-full">关注</el-button>
                </div>
              </div>
            </div>

            <div class="shrink-0 p-5 border-t border-gray-100 bg-gray-50/50">
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-4 text-sm text-gray-500">
                  <span class="flex items-center gap-1"><el-icon><View /></el-icon>{{ selectedActivity.views }} 浏览</span>
                  <span class="flex items-center gap-1"><el-icon><Star /></el-icon>{{ selectedActivity.likes }} 喜欢</span>
                </div>
                <span class="text-lg font-bold text-teal-600" v-if="selectedActivity.price > 0">
                  ¥{{ selectedActivity.price }}
                </span>
                <span class="text-sm text-green-600 font-medium" v-else>免费参与</span>
              </div>
              <div class="flex gap-3">
                <button class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
                  <el-icon><Star /></el-icon>喜欢
                </button>
                <button class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5">
                  <el-icon><Share /></el-icon>分享
                </button>
                <button @click="handleJoin(selectedActivity)"
                  :disabled="selectedActivity.status !== 'recruiting'"
                  :class="['flex-1 py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-1.5',
                    selectedActivity.status === 'recruiting'
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25 hover:shadow-xl'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed']">
                  <el-icon><Plus /></el-icon>{{ selectedActivity.status === 'recruiting' ? '立即报名' : '已结束' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPublish" class="publish-dialog-overlay" @click.self="showPublish = false">
          <div class="publish-dialog-content">
            <div class="shrink-0 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 class="text-lg font-bold text-text-primary">发布新活动</h3>
              <button @click="showPublish = false" class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <el-icon><Close /></el-icon>
              </button>
            </div>
            <div class="overflow-y-auto flex-1 p-6 space-y-5">
              <div>
                <label class="block text-sm font-medium text-text-primary mb-1.5">活动封面</label>
                <div
                  class="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-teal-300 hover:bg-teal-50/30 transition-colors cursor-pointer"
                  @click="$refs.coverInput?.click()"
                >
                  <input ref="coverInput" type="file" accept="image/*" class="hidden" @change="handleCoverUpload" />
                  <img v-if="publishForm.coverImage" :src="publishForm.coverImage" class="max-h-40 mx-auto rounded-lg" />
                  <template v-else>
                    <el-icon :size="36" class="text-gray-300 mb-2"><Plus /></el-icon>
                    <p class="text-sm text-gray-400">点击或拖拽上传封面图片</p>
                    <p class="text-xs text-gray-300 mt-1">建议尺寸 1200×628，支持 JPG/PNG</p>
                  </template>
                </div>
              </div>
              <el-form ref="publishFormRef" :model="publishForm" label-position="top" :rules="publishRules">
                <el-form-item label="活动标题" prop="title">
                  <el-input v-model="publishForm.title" placeholder="请输入活动标题（5-30字）" maxlength="30" show-word-limit />
                </el-form-item>
                <el-form-item label="活动类型" prop="category">
                  <el-select v-model="publishForm.category" placeholder="请选择活动类型" class="w-full" clearable filterable popper-class="dialog-popper">
                    <el-option v-for="cat in categoryTabs.filter(c => c.value !== 'all')" :key="cat.value" :label="cat.label" :value="cat.value">
                      <span>{{ cat.label }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <div class="grid grid-cols-2 gap-4">
                  <el-form-item label="活动日期" prop="date">
                    <el-date-picker v-model="publishForm.date" type="date" placeholder="选择日期" class="w-full" value-format="YYYY-MM-DD" popper-class="dialog-popper" />
                  </el-form-item>
                  <el-form-item label="活动时间" prop="time">
                    <div class="w-full time-range-wrapper">
                      <el-time-picker
                        v-model="publishForm.time"
                        is-range
                        range-separator="至"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        format="HH:mm"
                        value-format="HH:mm"
                        :default-value="[new Date(0, 0, 0, 9, 0), new Date(0, 0, 0, 17, 0)]"
                        popper-class="dialog-popper"
                      />
                    </div>
                  </el-form-item>
                </div>
                <el-form-item label="活动地点" prop="location">
                  <el-input v-model="publishForm.location" placeholder="如：学生活动中心301报告厅" />
                </el-form-item>
                <el-form-item label="人数限制" prop="maxPeople">
                  <el-input-number v-model="publishForm.maxPeople" :min="2" :max="500" class="w-full" />
                </el-form-item>
                <el-form-item label="活动费用" prop="price">
                  <el-input-number v-model="publishForm.price" :min="0" :precision="2" class="w-full" />
                  <p class="text-xs text-gray-400 mt-1">输入 0 表示免费活动</p>
                </el-form-item>
                <el-form-item label="活动详情" prop="description">
                  <el-input v-model="publishForm.description" type="textarea" :rows="5" placeholder="详细描述活动内容、流程、注意事项等..." maxlength="1000" show-word-limit />
                </el-form-item>
                <el-form-item label="标签">
                  <div class="flex flex-wrap gap-2">
                    <button v-for="tag in availableTags" :key="tag" @click="togglePublishTag(tag)"
                      :class="['px-3 py-1.5 rounded-full text-sm transition-all',
                        publishForm.tags.includes(tag) ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
                      {{ tag }}
                    </button>
                  </div>
                </el-form-item>
              </el-form>
            </div>
            <div class="shrink-0 p-5 border-t border-gray-100 bg-gray-50/50">
              <div class="flex gap-3">
                <button @click="showPublish = false" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                  取消
                </button>
                <button @click="submitPublish" class="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-lg shadow-teal-500/25 hover:shadow-xl transition-shadow">
                  发布活动
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showJoinSuccess" class="fixed inset-0 z-[var(--z-dialog-overlay)] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click="showJoinSuccess = false">
          <div class="bg-white rounded-3xl p-8 text-center shadow-2xl animate-scale-in max-w-sm mx-4">
            <div class="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center">
              <el-icon :size="40" class="text-white"><CircleCheckFilled /></el-icon>
            </div>
            <h3 class="text-xl font-bold text-text-primary mb-2">报名成功！</h3>
            <p class="text-gray-500 text-sm mb-6">我们将在活动开始前通过消息提醒您<br/>请留意通知哦~</p>
            <button @click="showJoinSuccess = false" class="px-8 py-2.5 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium shadow-lg shadow-teal-500/25">
              知道了
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  Plus, Close, Calendar, Location, User, Clock, View, Star, Share,
  InfoFilled, CollectionTag, DocumentDelete, CircleCheckFilled,
  List, ArrowLeft, ArrowRight, Document, DataAnalysis,
  Microphone, Basketball, Reading, Monitor, Aim, ChatDotRound,
  MagicStick, Headset, Flag, Bicycle
} from '@element-plus/icons-vue'
import { useCommunityStore } from '@/stores/community'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { HeatmapChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  CalendarComponent
} from 'echarts/components'

use([
  CanvasRenderer,
  HeatmapChart,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
  CalendarComponent
])

interface Activity {
  id: string
  title: string
  description: string
  fullDescription?: string
  cover: string
  category: string
  date: string
  time: string
  location: string
  organizer?: {
    name: string
    avatar: string
    club?: string
  }
  maxPeople: number
  joined: number
  views: number
  likes: number
  status: 'recruiting' | 'ongoing' | 'ended'
  tags: string[]
  price: number
  isHot: boolean
  isRecommended: boolean
  avatars?: string[]
}

const communityStore = useCommunityStore()

const activeCategory = ref('all')
const searchKeyword = ref('')
const showPublish = ref(false)
const selectedActivity = ref<Activity | null>(null)
const showJoinSuccess = ref(false)
const publishFormRef = ref<FormInstance>()

// ========== 视图模式切换 ==========
const viewMode = ref<'list' | 'calendar'>('list')

// ========== 日历视图相关 ==========
const calendarYear = ref(new Date().getFullYear())
const calendarMonth = ref(new Date().getMonth() + 1) // 1-12
const selectedDate = ref<string | null>(null)

// 图例颜色（与热力图一致）
const legendColors = ['#f0f0f0', '#bae7ff', '#69c0ff', '#1890ff', '#0958d9', '#003a8c']

// 生成丰富的日历 Mock 数据
function generateRichCalendarData(): [string, number][] {
  const data: Record<string, number> = {}
  const now = new Date()
  const y = calendarYear.value
  const m = calendarMonth.value
  const daysInMonth = new Date(y, m, 0).getDate()

  // 先从现有 activities 中提取日期信息
  allActivities.value.forEach(act => {
    const actDate = act.date || ''
    const d = actDate.split('T')[0] || actDate
    if (d) {
      const [dy, dm] = d.split('-').map(Number)
      if (dy === y && dm === m) {
        data[d] = (data[d] || 0) + 1
      }
    }
  })

  // 补充更多未来日期的模拟数据，让日历更丰富
  const seedDates: [number, number][] = [
    [2, 1], [3, 2], [5, 3], [7, 0], [8, 1], [10, 2], [12, 4],
    [14, 1], [15, 3], [17, 0], [18, 2], [20, 1], [22, 3],
    [23, 1], [25, 0], [26, 2], [28, 4], [29, 1], [30, 2]
  ]

  seedDates.forEach(([day, count]) => {
    if (day <= daysInMonth) {
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      if (!data[dateStr]) {
        data[dateStr] = count
      }
    }
  })

  return Object.entries(data).map(([date, count]) => [date, count])
}

const calendarData = computed(() => generateRichCalendarData())

// 当前日历显示的年月标签
const currentCalendarLabel = computed(() => `${calendarYear.value}年${calendarMonth.value}月`)

// 是否到达最小月份限制（当前月前6个月）
const isMinMonth = computed(() => {
  const minDate = new Date()
  minDate.setMonth(minDate.getMonth() - 6)
  return calendarYear.value < minDate.getFullYear() ||
    (calendarYear.value === minDate.getFullYear() && calendarMonth.value <= minDate.getMonth() + 1)
})

// 是否到达最大月份限制（当前月后6个月）
const isMaxMonth = computed(() => {
  const maxDate = new Date()
  maxDate.setMonth(maxDate.getMonth() + 6)
  return calendarYear.value > maxDate.getFullYear() ||
    (calendarYear.value === maxDate.getFullYear() && calendarMonth.value >= maxDate.getMonth() + 1)
})

function changeMonth(delta: number) {
  let newMonth = calendarMonth.value + delta
  let newYear = calendarYear.value
  if (newMonth > 12) { newMonth = 1; newYear++ }
  if (newMonth < 1) { newMonth = 12; newYear-- }
  calendarYear.value = newYear
  calendarMonth.value = newMonth
  selectedDate.value = null
}

// ECharts 日历热力图配置
const calendarChartOption = computed(() => ({
  tooltip: {
    formatter(params: any) {
      const dateStr = params.value?.[0] || ''
      const count = params.value?.[1] || 0
      const d = new Date(dateStr)
      const label = `${d.getMonth() + 1}月${d.getDate()}日`
      if (count === 0) return `<div style="font-size:13px;padding:4px 8px;"><b>${label}</b><br/><span style="color:#999;">暂无活动</span></div>`
      // 找到当天的活动列表
      const dayActs = allActivities.value.filter(a => (a.date || '').startsWith(dateStr))
      const listHtml = dayActs.length > 0
        ? `<br/>` + dayActs.slice(0, 4).map((a: Activity) =>
            `· <span style="color:#003B80">${a.title}</span>`
          ).join('<br/>')
          + (dayActs.length > 4 ? `<br/>...等${dayActs.length}个活动` : '')
        : ''
      return `<div style="font-size:13px;padding:4px 8px;"><b>${label}</b> · <b style="color:#003B80">${count} 个活动</b>${listHtml}</div>`
    }
  },
  visualMap: {
    show: false,
    min: 0,
    max: 5,
    inRange: {
      color: ['#f0f0f0', '#bae7ff', '#69c0ff', '#1890ff', '#0958d9', '#003a8c']
    },
    calculable: false,
    orient: 'horizontal',
    left: 'center',
    bottom: 0
  },
  calendar: {
    top: 20,
    left: 30,
    right: 30,
    cellSize: ['auto', 40],
    year: calendarYear.value,
    month: calendarMonth.value - 1,
    range: `${calendarYear.value}-${String(calendarMonth.value).padStart(2, '0')}`,
    itemStyle: {
      borderRadius: 6,
      borderColor: '#fff',
      borderWidth: 2
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#eee',
        width: 1,
        type: 'solid'
      }
    },
    monthLabel: {
      show: false
    },
    dayLabel: {
      firstDay: 1,
      nameMap: ['日', '一', '二', '三', '四', '五', '六'],
      fontSize: 11,
      color: '#666'
    },
    yearLabel: { show: false }
  },
  series: [{
    type: 'heatmap',
    coordinateSystem: 'calendar',
    data: calendarData.value
  }]
}))

// 日历 hover / click 事件
function onCalendarHover(params: any) {
  if (params && params.value) {
    selectedDate.value = params.value[0]
  }
}

function onCalendarClick(params: any) {
  if (params && params.value) {
    selectedDate.value = params.value[0]
  }
}

// 选中的日期标签
const selectedDateLabel = computed(() => {
  if (!selectedDate.value) return ''
  const d = new Date(selectedDate.value)
  return `${d.getMonth() + 1}月${d.getDate()}日`
})

// 按选中日期筛选的活动
const filteredByDate = computed(() => {
  if (!selectedDate.value) {
    // 未选择日期时，显示当月所有按日期排序的活动
    const y = calendarYear.value
    const m = calendarMonth.value
    return allActivities.value
      .filter(a => {
        const d = a.date || ''
        const [dy, dm] = d.split('-').map(Number)
        return dy === y && dm === m
      })
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  }
  return allActivities.value.filter(a => (a.date || '').startsWith(selectedDate.value))
})

// ========== 当月统计 ==========
const monthStats = computed(() => {
  const y = calendarYear.value
  const m = calendarMonth.value
  const monthActs = allActivities.value.filter(a => {
    const d = a.date || ''
    const [dy, dm] = d.split('-').map(Number)
    return dy === y && dm === m
  })

  // 统计各状态数量
  const ended = monthActs.filter(a => a.status === 'ended').length
  const ongoing = monthActs.filter(a => a.status === 'ongoing').length
  const recruiting = monthActs.filter(a => a.status === 'recruiting').length

  // 找最活跃的一天
  const dateCountMap: Record<string, number> = {}
  monthActs.forEach(a => {
    const d = a.date || ''
    dateCountMap[d] = (dateCountMap[d] || 0) + 1
  })
  let hottestDay = ''
  let maxCount = 0
  Object.entries(dateCountMap).forEach(([date, count]) => {
    if (count > maxCount) {
      maxCount = count
      hottestDay = date
    }
  })
  const hottestDayFormatted = hottestDay
    ? (() => { const d = new Date(hottestDay); return `${d.getMonth() + 1}/${d.getDate()}` })()
    : ''

  // 找最受欢迎的活动（浏览量最多）
  const mostPopular = monthActs.length > 0
    ? [...monthActs].sort((a, b) => (b.views || 0) - (a.views || 0))[0]?.title
    : ''

  return {
    total: monthActs.length,
    ended,
    ongoing,
    recruiting,
    hottestDay: hottestDayFormatted,
    mostPopular
  }
})

const MOCK_USER = { nickname: '科小易', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=33&size=80' }

const categoryTabs = [
  { label: '全部', value: 'all' },
  { label: '文艺演出', value: 'art', icon: Microphone },
  { label: '体育竞技', value: 'sports', icon: Basketball },
  { label: '学术讲座', value: 'academic', icon: Reading },
  { label: '社交聚会', value: 'social', icon: Monitor },
  { label: '志愿公益', value: 'volunteer', icon: Aim }
]

const statusMap: Record<string, string> = {
  recruiting: '招募中',
  ongoing: '进行中',
  ended: '已结束'
}

const availableTags = ['校园', '户外', '音乐', '科技', '美食', '摄影', '运动', '手工', '游戏', '读书']

const publishForm = ref({
  title: '',
  category: '',
  date: '',
  time: null as [string, string] | null,
  location: '',
  maxPeople: 30,
  price: 0,
  description: '',
  tags: [] as string[],
  coverImage: '' as string,
  coverFile: null as File | null
})

const publishRules: FormRules = {
  title: [{ required: true, message: '请输入活动标题', trigger: 'blur' }],
  category: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
  date: [{ required: true, message: '请选择活动日期', trigger: 'change' }],
  location: [{ required: true, message: '请输入活动地点', trigger: 'blur' }]
}

const allActivities = computed(() => communityStore.activities || [])

const currentWeekRange = computed(() => {
  const now = new Date()
  const dayOfWeek = now.getDay() || 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - dayOfWeek + 1)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return `${monday.getMonth() + 1}月${monday.getDate()}日 - ${sunday.getMonth() + 1}月${sunday.getDate()}日`
})

const filteredActivities = computed(() => {
  let list = allActivities.value
  if (activeCategory.value !== 'all') {
    list = list.filter(a => a.category === activeCategory.value)
  }
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    list = list.filter(a =>
      a.title.toLowerCase().includes(kw) ||
      a.description.toLowerCase().includes(kw) ||
      a.tags.some(t => t.toLowerCase().includes(kw))
    )
  }
  return list
})

const upcomingActivities = computed(() => {
  return [...allActivities.value]
    .filter(a => a.status === 'recruiting')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const featuredActivity = computed<Activity>(() => {
  return upcomingActivities.value[0] || allActivities.value[0] || ({} as Activity)
})

const popularClubs = [
  { name: '街舞社', icon: MagicStick, members: '320+' },
  { name: '吉他社', icon: Headset, members: '256+' },
  { name: '动漫社', icon: Flag, members: '430+' },
  { name: '辩论队', icon: ChatDotRound, members: '180+' },
  { name: '棋类社', icon: Aim, members: '150+' },
  { name: '骑行社', icon: Bicycle, members: '210+' }
]

const notices = [
  '活动报名后请准时参加，无故缺席将影响信用积分',
  '大型活动需提前30分钟到场签到',
  '校外人员参加活动需提前申请访客码',
  '活动照片默认允许官方使用，如有异议请联系主办方'
]

function openDetail(activity: Activity) {
  selectedActivity.value = activity
}

function handleShowPublish() {
  showPublish.value = true
}

function handleCoverUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    ElMessage.warning('请选择图片文件')
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    ElMessage.warning('图片大小不能超过5MB')
    return
  }

  publishForm.value.coverFile = file
  const reader = new FileReader()
  reader.onload = (e) => {
    publishForm.value.coverImage = e.target?.result as string
    ElMessage.success('封面上传成功')
  }
  reader.readAsDataURL(file)
}

function closeDetail() {
  selectedActivity.value = null
}

async function handleJoin(activity: Activity) {
  if (activity.status !== 'recruiting') return
  try {
    await communityStore.joinActivity(activity.id)
    selectedActivity.value = null
    showJoinSuccess.value = true
  } catch (err: unknown) {
    const errorObj = err as { message?: string }
    ElMessage.error(errorObj.message || '报名失败')
  }
}

function loadMore() {
  ElMessage.info('已加载所有活动')
}

function togglePublishTag(tag: string) {
  const idx = publishForm.value.tags.indexOf(tag)
  if (idx >= 0) {
    publishForm.value.tags.splice(idx, 1)
  } else if (publishForm.value.tags.length < 5) {
    publishForm.value.tags.push(tag)
  }
}

function getCategoryLabel(value: string) {
  const cat = categoryTabs.find(t => t.value === value)
  return cat?.label || ''
}

function getProgressPercent(activity: Activity): number {
  return Math.round((activity.joined / activity.maxPeople) * 100)
}

function getProgressColor(activity: Activity): string {
  const pct = getProgressPercent(activity)
  if (pct >= 90) return 'text-red-500'
  if (pct >= 70) return 'text-orange-500'
  return 'text-teal-500'
}

function getProgressBg(activity: Activity): string {
  const pct = getProgressPercent(activity)
  if (pct >= 90) return 'bg-gradient-to-r from-red-400 to-red-500'
  if (pct >= 70) return 'bg-gradient-to-r from-orange-400 to-amber-400'
  return 'bg-gradient-to-r from-teal-400 to-cyan-400'
}

async function submitPublish() {
  try {
    await publishFormRef.value?.validate()
  } catch (err: unknown) {
    const errorList = Array.isArray(err) ? err : (err ? [err] : [])
    if (errorList.length) {
      const fieldNames: Record<string, string> = {
        title: '活动标题',
        category: '活动类型',
        date: '活动日期',
        location: '活动地点',
        description: '活动详情'
      }
      const names = errorList.map((e: { field?: string; message?: string }) => fieldNames[e.field || ''] || e.field || e.message || '').join('、')
      ElMessage.warning(`请完善${names}信息`)
    } else {
      ElMessage.warning('请填写所有必填项')
    }
    return
  }

  const timeRange = publishForm.value.time

  try {
    const coverUrl = publishForm.value.coverImage || 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=600&h=300&fit=crop'
    await communityStore.createActivity({
      title: publishForm.value.title,
      category: publishForm.value.category,
      date: publishForm.value.date,
      time: timeRange ? `${timeRange[0]}-${timeRange[1]}` : '',
      location: publishForm.value.location,
      maxPeople: publishForm.value.maxPeople,
      fee: publishForm.value.price,
      description: publishForm.value.description,
      tags: publishForm.value.tags,
      cover: coverUrl,
      organizer: { name: MOCK_USER.nickname, avatar: MOCK_USER.avatar, club: '个人' },
      joined: 0,
      views: 0,
      status: 'recruiting',
      isHot: false,
      isRecommended: false
    })

    showPublish.value = false
    ElMessage.success('活动发布成功！')
    publishForm.value = { title: '', category: '', date: '', time: null, location: '', maxPeople: 30, price: 0, description: '', tags: [], coverImage: '', coverFile: null }
  } catch (err: unknown) {
    const errorObj = err as { message?: string }
    ElMessage.error(errorObj.message || '发布失败，请重试')
  }
}

onMounted(async () => {
  try {
    await communityStore.fetchActivities()
  } catch (err: unknown) {
    const errorObj = err as { message?: string }
    ElMessage.error(errorObj.message || '获取活动列表失败')
  }
})
</script>

<style>
.publish-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-dialog-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.publish-dialog-content {
  background: white;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 32rem;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  animation: scaleIn 0.3s ease-out forwards;
  position: relative;
  z-index: var(--z-dialog-content);
}

.dialog-popper {
  z-index: var(--z-dialog-popper) !important;
}

.time-range-wrapper {
  width: 100%;
}

.time-range-wrapper :deep(.el-range-editor) {
  width: 100%;
}

.time-range-wrapper :deep(.el-range-input) {
  flex: 1;
}

@keyframes scaleIn {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.animate-scale-in { animation: scaleIn 0.3s ease-out forwards; }

/* ========== 视图切换按钮组 ========== */
.view-switch-group {
  display: inline-flex;
  background: #f0f0f0;
  border-radius: 12px;
  padding: 3px;
  gap: 2px;
}

.view-switch-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #666;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.view-switch-btn:hover:not(.active) {
  color: #333;
  background: rgba(255,255,255,0.7);
}

.view-switch-btn.active {
  background: linear-gradient(135deg, #003B80, #1890ff);
  color: white;
  box-shadow: 0 2px 8px rgba(0,59,128,0.25);
}

/* ========== 视图切换过渡动画 ========== */
.view-fade-enter-active,
.view-fade-leave-active {
  transition: all 0.35s ease;
}
.view-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.view-fade-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

/* ========== 日历视图容器 ========== */
.calendar-view-container {
  animation: fadeInUp 0.4s ease-out forwards;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ========== 月份导航按钮 ========== */
.month-nav-btn {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
}

.month-nav-btn:hover:not(:disabled) {
  border-color: #003B80;
  color: #003B80;
  background: #f0f5ff;
}

.month-nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.month-label {
  user-select: none;
}

/* ========== 日历图表容器 ========== */
.calendar-chart-wrapper {
  width: 100%;
  min-height: 220px;
}

.calendar-echarts {
  width: 100% !important;
  height: 220px !important;
}

/* ========== 统计卡片样式 ========== */
.stat-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
}

.stat-label {
  font-size: 13px;
  color: #666;
}

.stat-value {
  font-size: 15px;
  font-weight: 700;
  color: #003B80;
}

.highlight-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px 10px;
  background: rgba(0,59,128,0.04);
  border-radius: 10px;
}

/* ========== 响应式适配 ========== */
@media (max-width: 1024px) {
  .view-switch-group {
    padding: 2px;
  }

  .view-switch-btn {
    padding: 5px 10px;
    font-size: 12px;
  }

  .calendar-echarts {
    height: 200px !important;
  }

  .calendar-chart-wrapper {
    min-height: 200px;
  }
}

@media (max-width: 640px) {
  .view-switch-group {
    margin-top: 8px;
  }

  .calendar-echarts {
    height: 180px !important;
  }

  .calendar-chart-wrapper {
    min-height: 180px;
  }
}
</style>
