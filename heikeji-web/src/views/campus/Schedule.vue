<template>
  <el-config-provider :locale="elementLocale">
    <div class="schedule-page">
      <div class="page-header">
        <div class="header-content max-w-screen-xl mx-auto px-4 lg:px-8">
          <h1 class="page-title">
            <el-icon><Calendar /></el-icon>
            我的课表
          </h1>
          <div class="header-actions">
            <span class="current-week">第 {{ currentWeek }} 周</span>
            <button
              class="today-btn"
              @click="goToToday"
            >
              今天
            </button>
          </div>
        </div>
      </div>

      <div class="main-content max-w-screen-xl mx-auto px-4 lg:px-8 py-6">
        <div class="view-toggle-bar glass-effect rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div class="week-nav">
            <button
              class="nav-btn"
              @click="prevWeek"
            >
              <el-icon><ArrowLeft /></el-icon>
            </button>
            <div class="date-picker-wrapper">
              <el-date-picker
                v-model="selectedDate"
                type="date"
                placeholder="选择日期"
                value-format="YYYY-MM-DD"
                :clearable="false"
                class="date-picker-custom date-picker-hidden"
                @change="onDateChange"
              />
              <div
                class="date-display"
                @click="openDatePicker"
              >
                {{ selectedDateDisplay }}
              </div>
            </div>
            <span class="week-range">{{ weekRangeText }}</span>
            <button
              class="nav-btn"
              @click="nextWeek"
            >
              <el-icon><ArrowRight /></el-icon>
            </button>
          </div>
          <div class="view-switcher">
            <button
              v-for="view in viewModes"
              :key="view.value"
              class="view-chip"
              :class="{ active: currentView === view.value }"
              @click="currentView = view.value"
            >
              {{ view.label }}
            </button>
          </div>
        </div>

        <div
          v-if="currentView === 'week'"
          class="schedule-week glass-effect rounded-2xl overflow-hidden"
        >
          <div class="week-grid">
            <div class="time-column">
              <div class="corner-cell" />
              <div
                v-for="period in timeSlots"
                :key="period.id"
                class="time-slot"
              >
                <span class="period-num">{{ period.id }}</span>
                <span class="time-range">{{ period.start }}<br>{{ period.end }}</span>
              </div>
            </div>
            <div
              v-for="day in weekDays"
              :key="day.key"
              class="day-column"
              :class="{ 'is-today': day.isToday }"
            >
              <div class="day-header">
                <span class="day-name">{{ day.name }}</span>
                <span
                  class="day-date"
                  :class="{ today: day.isToday }"
                >{{ day.date }}</span>
              </div>
              <div class="courses-area">
                <div
                  v-for="(course, idx) in getCoursesForDay(day.key)"
                  :key="idx"
                  class="course-card"
                  :style="courseStyle(course)"
                  @click="showCourseDetail(course)"
                >
                  <div class="course-name">
                    {{ course.name }}
                  </div>
                  <div class="course-info">
                    <span class="course-location">{{ course.location }}</span>
                    <span class="course-teacher">{{ course.teacher }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="currentView === 'day'"
          class="schedule-day glass-effect rounded-2xl overflow-hidden p-6"
        >
          <div class="day-view-header">
            <h2 class="day-title">
              {{ currentDayName }} {{ currentDateStr }}
            </h2>
            <div class="day-stats">
              <span class="stat-item">
                <el-icon><Notebook /></el-icon>
                {{ todayCourses.length }} 节课
              </span>
              <span class="stat-item free-time">
                <el-icon><Clock /></el-icon>
                {{ freePeriods }} 节空闲
              </span>
            </div>
          </div>

          <div class="day-timeline">
            <div class="timeline-hours">
              <div
                v-for="h in 24"
                :key="h"
                class="hour-mark"
              >
                <span class="hour-label">{{ String(h - 1).padStart(2, '0') }}:00</span>
              </div>
            </div>
            <div class="timeline-body">
              <div
                v-if="todayCourses.length === 0"
                class="no-courses"
              >
                <el-icon><CoffeeCup /></el-icon>
                <p>今天没有课程，好好休息吧~</p>
              </div>
              <div
                v-for="course in todayCourses"
                :key="course.id"
                class="timeline-course"
                :style="dayViewStyle(course)"
                @click="showCourseDetail(course)"
              >
                <div class="tc-time">
                  {{ course.startTime }} - {{ course.endTime }}
                </div>
                <div class="tc-name">
                  {{ course.name }}
                </div>
                <div class="tc-meta">
                  <span>{{ course.location }}</span>
                  <span>{{ course.teacher }}</span>
                </div>
              </div>
              <div
                v-if="isCurrentDay"
                class="now-indicator"
                :style="{ top: nowIndicatorTop }"
              >
                <div class="now-dot" />
                <div class="now-line" />
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="currentView === 'list'"
          class="schedule-list glass-effect rounded-2xl overflow-hidden"
        >
          <div class="list-header">
            <h3>全部课程</h3>
            <span class="total-count">共 {{ allCourses.length }} 门课</span>
          </div>
          <div class="course-list-items">
            <div
              v-for="course in allCourses"
              :key="course.id"
              class="list-course-item"
              @click="showCourseDetail(course)"
            >
              <div
                class="lc-color-bar"
                :style="{ background: course.color }"
              />
              <div class="lc-info">
                <h4 class="lc-name">
                  {{ course.name }}
                </h4>
                <div class="lc-meta">
                  <span class="lc-tag">
                    <el-icon><Calendar /></el-icon>
                    {{ course.dayLabel }}
                  </span>
                  <span class="lc-tag">
                    <el-icon><Clock /></el-icon>
                    第{{ course.startPeriod }}-{{ course.endPeriod }}节
                  </span>
                  <span class="lc-tag">
                    <el-icon><Location /></el-icon>
                    {{ course.location }}
                  </span>
                  <span class="lc-tag">
                    <el-icon><User /></el-icon>
                    {{ course.teacher }}
                  </span>
                </div>
              </div>
              <el-icon class="lc-arrow">
                <ArrowRight />
              </el-icon>
            </div>
          </div>
        </div>

        <div class="quick-actions mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            class="action-card glass-effect rounded-2xl p-5 text-center cursor-pointer hover:scale-105 transition-transform"
            @click="openAddCourseModal"
          >
            <el-icon class="action-icon text-blue-500">
              <DocumentAdd />
            </el-icon>
            <p class="action-label">
              添加课程
            </p>
          </div>
          <div
            class="action-card glass-effect rounded-2xl p-5 text-center cursor-pointer hover:scale-105 transition-transform"
            @click="openImportModal"
          >
            <el-icon class="action-icon text-green-500">
              <Download />
            </el-icon>
            <p class="action-label">
              导入课表
            </p>
          </div>
          <div
            class="action-card glass-effect rounded-2xl p-5 text-center cursor-pointer hover:scale-105 transition-transform"
            @click="openShareModal"
          >
            <el-icon class="action-icon text-orange-500">
              <Share />
            </el-icon>
            <p class="action-label">
              分享课表
            </p>
          </div>
          <div
            class="action-card glass-effect rounded-2xl p-5 text-center cursor-pointer hover:scale-105 transition-transform"
            @click="openReminderModal"
          >
            <el-icon class="action-icon text-purple-500">
              <Bell />
            </el-icon>
            <p class="action-label">
              上课提醒
            </p>
          </div>
        </div>
      </div>

      <Teleport to="body">
        <!-- 课程详情弹窗 -->
        <transition name="modal-fade">
          <div
            v-if="selectedCourse"
            class="modal-overlay"
            @click.self="selectedCourse = null"
          >
            <div class="course-detail-modal glass-effect rounded-2xl overflow-hidden">
              <div
                class="modal-header"
                :style="{ background: selectedCourse.color }"
              >
                <h3>{{ selectedCourse.name }}</h3>
                <button
                  class="close-btn"
                  @click="selectedCourse = null"
                >
                  <el-icon><Close /></el-icon>
                </button>
              </div>
              <div class="modal-body">
                <div class="detail-grid">
                  <div class="detail-item">
                    <span class="detail-label">授课教师</span>
                    <span class="detail-value">{{ selectedCourse.teacher }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">上课地点</span>
                    <span class="detail-value">{{ selectedCourse.location }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">上课时间</span>
                    <span class="detail-value">{{ selectedCourse.dayLabel }} 第{{ selectedCourse.startPeriod }}-{{ selectedCourse.endPeriod }}节</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">具体时段</span>
                    <span class="detail-value">{{ selectedCourse.startTime }} - {{ selectedCourse.endTime }}</span>
                  </div>
                  <div class="detail-item full-width">
                    <span class="detail-label">周次安排</span>
                    <span class="detail-value">第 {{ selectedCourse.weeks }}（每周{{ selectedCourse.dayLabel }}）</span>
                  </div>
                </div>
                <div class="modal-actions">
                  <button
                    class="modal-btn secondary"
                    @click="editCourse(selectedCourse)"
                  >
                    <el-icon><EditPen /></el-icon>
                    编辑
                  </button>
                  <button class="modal-btn primary">
                    <el-icon><Location /></el-icon>
                    导航去教室
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- 上课提醒弹窗 -->
        <transition name="modal-fade">
          <div
            v-if="showReminderModal"
            class="modal-overlay"
            @click.self="closeReminderModal"
          >
            <div
              class="course-detail-modal glass-effect rounded-2xl overflow-hidden"
              style="max-width: 480px;"
            >
              <div
                class="modal-header"
                style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);"
              >
                <h3>上课提醒</h3>
                <button
                  class="close-btn"
                  @click="closeReminderModal"
                >
                  <el-icon><Close /></el-icon>
                </button>
              </div>
              <div class="modal-body">
                <div class="reminder-content">
                  <div class="reminder-toggle">
                    <div class="toggle-info">
                      <h4>开启上课提醒</h4>
                      <p>在课程开始前自动发送提醒通知</p>
                    </div>
                    <el-switch
                      v-model="reminderForm.enabled"
                      active-color="#8b5cf6"
                    />
                  </div>

                  <transition name="fade">
                    <div
                      v-if="reminderForm.enabled"
                      class="reminder-options"
                    >
                      <el-divider />
                      <el-form label-position="top">
                        <el-form-item label="提前提醒时间">
                          <el-radio-group v-model="reminderForm.reminderMinutes">
                            <el-radio :label="5">
                              5分钟
                            </el-radio>
                            <el-radio :label="10">
                              10分钟
                            </el-radio>
                            <el-radio :label="15">
                              15分钟
                            </el-radio>
                            <el-radio :label="30">
                              30分钟
                            </el-radio>
                          </el-radio-group>
                        </el-form-item>
                        <el-form-item label="提醒方式">
                          <el-radio-group v-model="reminderForm.reminderMethod">
                            <el-radio label="notification">
                              浏览器通知
                            </el-radio>
                            <el-radio label="email">
                              邮件提醒
                            </el-radio>
                            <el-radio label="both">
                              两者都用
                            </el-radio>
                          </el-radio-group>
                        </el-form-item>
                      </el-form>
                    </div>
                  </transition>
                </div>
                <div class="modal-actions">
                  <button
                    class="modal-btn secondary"
                    @click="closeReminderModal"
                  >
                    取消
                  </button>
                  <button
                    class="modal-btn primary"
                    :disabled="campusStore.loading"
                    @click="saveReminder"
                  >
                    <el-icon v-if="campusStore.loading">
                      <Loading />
                    </el-icon>
                    保存设置
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- 分享课表弹窗 -->
        <transition name="modal-fade">
          <div
            v-if="showShareModal"
            class="modal-overlay"
            @click.self="closeShareModal"
          >
            <div
              class="course-detail-modal glass-effect rounded-2xl overflow-hidden"
              style="max-width: 480px;"
            >
              <div
                class="modal-header"
                style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);"
              >
                <h3>分享课表</h3>
                <button
                  class="close-btn"
                  @click="closeShareModal"
                >
                  <el-icon><Close /></el-icon>
                </button>
              </div>
              <div class="modal-body">
                <div class="share-content">
                  <div
                    v-if="!shareUrl"
                    class="share-options"
                  >
                    <p class="share-desc">
                      生成分享链接，其他人可以通过链接查看你的课表
                    </p>
                    <el-form label-position="top">
                      <el-form-item label="链接有效期">
                        <el-radio-group v-model="shareExpireDays">
                          <el-radio :label="1">
                            1天
                          </el-radio>
                          <el-radio :label="7">
                            7天
                          </el-radio>
                          <el-radio :label="30">
                            30天
                          </el-radio>
                        </el-radio-group>
                      </el-form-item>
                    </el-form>
                    <button
                      class="modal-btn primary w-full mt-4"
                      :disabled="campusStore.loading"
                      @click="generateShareLink"
                    >
                      <el-icon v-if="campusStore.loading">
                        <Loading />
                      </el-icon>
                      生成分享链接
                    </button>
                  </div>
                  <div
                    v-else
                    class="share-result"
                  >
                    <div class="share-success">
                      <el-icon
                        class="success-icon"
                        :size="48"
                        color="#10b981"
                      >
                        <CircleCheck />
                      </el-icon>
                      <p class="success-text">
                        分享链接已生成
                      </p>
                      <p class="expire-text">
                        有效期至：{{ shareExpireAt }}
                      </p>
                    </div>
                    <div class="share-url-box">
                      <el-input
                        v-model="shareUrl"
                        readonly
                        class="share-input"
                      >
                        <template #append>
                          <el-button @click="copyShareLink">
                            <el-icon><CopyDocument /></el-icon>
                            复制
                          </el-button>
                        </template>
                      </el-input>
                    </div>
                    <div class="share-actions">
                      <button
                        class="modal-btn secondary"
                        @click="resetShare"
                      >
                        重新生成
                      </button>
                      <button
                        class="modal-btn primary"
                        @click="closeShareModal"
                      >
                        完成
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- 导入课表弹窗 -->
        <transition name="modal-fade">
          <div
            v-if="showImportModal"
            class="modal-overlay"
            @click.self="closeImportModal"
          >
            <div
              class="course-detail-modal glass-effect rounded-2xl overflow-hidden"
              style="max-width: 480px;"
            >
              <div
                class="modal-header"
                style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);"
              >
                <h3>导入课表</h3>
                <button
                  class="close-btn"
                  @click="closeImportModal"
                >
                  <el-icon><Close /></el-icon>
                </button>
              </div>
              <div class="modal-body">
                <div class="import-content">
                  <p class="import-desc">
                    支持导入 Excel (.xlsx) 或 CSV 格式的课表文件
                  </p>
                  <el-upload
                    class="upload-area"
                    drag
                    action="#"
                    :auto-upload="false"
                    :on-change="handleFileChange"
                    :show-file-list="false"
                    accept=".xlsx,.csv"
                  >
                    <el-icon class="upload-icon">
                      <Upload />
                    </el-icon>
                    <div class="upload-text">
                      <span>点击或拖拽文件到此处</span>
                    </div>
                    <template #tip>
                      <div class="upload-tip">
                        请确保文件包含：课程名称、教师、教室、星期、节次等信息
                      </div>
                    </template>
                  </el-upload>
                  <div
                    v-if="importFile"
                    class="selected-file"
                  >
                    <el-icon><Document /></el-icon>
                    <span>{{ importFile.name }}</span>
                    <el-button
                      type="danger"
                      link
                      @click="importFile = null"
                    >
                      删除
                    </el-button>
                  </div>
                </div>
                <div class="modal-actions">
                  <button
                    class="modal-btn secondary"
                    @click="closeImportModal"
                  >
                    取消
                  </button>
                  <button
                    class="modal-btn primary"
                    :disabled="!importFile || campusStore.loading"
                    @click="importSchedule"
                  >
                    <el-icon v-if="campusStore.loading">
                      <Loading />
                    </el-icon>
                    开始导入
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- 添加/编辑课程弹窗 -->
        <transition name="modal-fade">
          <div
            v-if="showAddCourseModal"
            class="modal-overlay"
            @click.self="closeAddCourseModal"
          >
            <div
              class="course-detail-modal glass-effect rounded-2xl overflow-hidden"
              style="max-width: 480px;"
            >
              <div
                class="modal-header"
                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"
              >
                <h3>{{ isEditing ? '编辑课程' : '添加课程' }}</h3>
                <button
                  class="close-btn"
                  @click="closeAddCourseModal"
                >
                  <el-icon><Close /></el-icon>
                </button>
              </div>
              <div class="modal-body">
                <el-form
                  :model="courseForm"
                  label-position="top"
                  class="course-form"
                >
                  <el-form-item
                    label="课程名称"
                    required
                  >
                    <el-input
                      v-model="courseForm.courseName"
                      placeholder="请输入课程名称"
                    />
                  </el-form-item>
                  <el-form-item label="授课教师">
                    <el-input
                      v-model="courseForm.teacher"
                      placeholder="请输入教师姓名"
                    />
                  </el-form-item>
                  <el-form-item label="上课地点">
                    <el-input
                      v-model="courseForm.classroom"
                      placeholder="请输入教室位置"
                    />
                  </el-form-item>
                  <div class="form-row">
                    <el-form-item
                      label="星期"
                      required
                      style="flex: 1;"
                    >
                      <el-select
                        v-model="courseForm.dayOfWeek"
                        placeholder="选择星期"
                      >
                        <el-option
                          v-for="(day, index) in weekDaysOptions"
                          :key="index"
                          :label="day"
                          :value="index"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="开始节次"
                      required
                      style="flex: 1;"
                    >
                      <el-select
                        v-model="courseForm.startSection"
                        placeholder="开始节次"
                      >
                        <el-option
                          v-for="n in 10"
                          :key="n"
                          :label="`第${n}节`"
                          :value="n"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item
                      label="结束节次"
                      required
                      style="flex: 1;"
                    >
                      <el-select
                        v-model="courseForm.endSection"
                        placeholder="结束节次"
                      >
                        <el-option
                          v-for="n in 10"
                          :key="n"
                          :label="`第${n}节`"
                          :value="n"
                        />
                      </el-select>
                    </el-form-item>
                  </div>
                  <div class="form-row">
                    <el-form-item
                      label="开始时间"
                      style="flex: 1;"
                    >
                      <el-time-picker
                        v-model="courseForm.startTime"
                        format="HH:mm"
                        placeholder="开始时间"
                        style="width: 100%;"
                      />
                    </el-form-item>
                    <el-form-item
                      label="结束时间"
                      style="flex: 1;"
                    >
                      <el-time-picker
                        v-model="courseForm.endTime"
                        format="HH:mm"
                        placeholder="结束时间"
                        style="width: 100%;"
                      />
                    </el-form-item>
                  </div>
                  <el-form-item label="课程颜色">
                    <div class="color-picker">
                      <div
                        v-for="color in courseColors"
                        :key="color"
                        class="color-option"
                        :style="{ background: color, border: courseForm.color === color ? '3px solid #333' : 'none' }"
                        @click="courseForm.color = color"
                      />
                    </div>
                  </el-form-item>
                </el-form>
                <div class="modal-actions">
                  <button
                    class="modal-btn secondary"
                    @click="closeAddCourseModal"
                  >
                    取消
                  </button>
                  <button
                    class="modal-btn primary"
                    :disabled="!courseForm.courseName || campusStore.loading"
                    @click="saveCourse"
                  >
                    <el-icon v-if="campusStore.loading">
                      <Loading />
                    </el-icon>
                    {{ isEditing ? '保存' : '添加' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </Teleport>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import {
  Calendar, ArrowLeft, ArrowRight, Clock, Location,
  Notebook, CoffeeCup, User, DocumentAdd, Download,
  Share, Bell, Close, EditPen, Loading, Upload, Document,
  CircleCheck, CopyDocument
} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useCampusStore } from '@/stores/campus'
import type { AddCourseRequest } from '@/api/campus'

// Element Plus 中文语言包
const elementLocale = zhCn

const { t } = useI18n()

const campusStore = useCampusStore()

interface Course {
  id: number
  name: string
  teacher: string
  location: string
  day: string
  dayLabel: string
  startPeriod: number
  endPeriod: number
  startTime: string
  endTime: string
  color: string
  weeks: string
}

const currentView = ref<'week' | 'day' | 'list'>('week')
const currentWeek = ref(8)
const selectedDayIndex = ref(new Date().getDay() || 7)
const selectedCourse = ref<Course | null>(null)
const selectedDate = ref<string>(new Date().toISOString().split('T')[0])

// 添加/编辑课程相关
const showAddCourseModal = ref(false)
const isEditing = ref(false)
const editingCourseId = ref<string>('')

const weekDaysOptions = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const courseColors = [
  '#667eea', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
]

const courseForm = ref<{
  courseName: string
  teacher: string
  classroom: string
  dayOfWeek: number
  startSection: number
  endSection: number
  startTime: string
  endTime: string
  color: string
}>({
  courseName: '',
  teacher: '',
  classroom: '',
  dayOfWeek: 1,
  startSection: 1,
  endSection: 2,
  startTime: '08:00',
  endTime: '09:40',
  color: courseColors[0]
})

function openAddCourseModal() {
  isEditing.value = false
  editingCourseId.value = ''
  courseForm.value = {
    courseName: '',
    teacher: '',
    classroom: '',
    dayOfWeek: 1,
    startSection: 1,
    endSection: 2,
    startTime: '08:00',
    endTime: '09:40',
    color: courseColors[0]
  }
  showAddCourseModal.value = true
}

function editCourse(course: Course) {
  isEditing.value = true
  editingCourseId.value = String(course.id)
  const dayMap: Record<string, number> = {
    sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6
  }
  courseForm.value = {
    courseName: course.name,
    teacher: course.teacher,
    classroom: course.location,
    dayOfWeek: dayMap[course.day] || 1,
    startSection: course.startPeriod,
    endSection: course.endPeriod,
    startTime: course.startTime,
    endTime: course.endTime,
    color: course.color
  }
  selectedCourse.value = null
  showAddCourseModal.value = true
}

function closeAddCourseModal() {
  showAddCourseModal.value = false
}

async function saveCourse() {
  if (!courseForm.value.courseName) {
    ElMessage.warning('请输入课程名称')
    return
  }
  if (courseForm.value.startSection > courseForm.value.endSection) {
    ElMessage.warning('开始节次不能大于结束节次')
    return
  }

  const data: AddCourseRequest = {
    courseName: courseForm.value.courseName,
    teacher: courseForm.value.teacher,
    classroom: courseForm.value.classroom,
    dayOfWeek: courseForm.value.dayOfWeek,
    startSection: courseForm.value.startSection,
    endSection: courseForm.value.endSection,
    startTime: courseForm.value.startTime,
    endTime: courseForm.value.endTime,
    color: courseForm.value.color
  }

  try {
    if (isEditing.value && editingCourseId.value) {
      await campusStore.updateCourseItem(editingCourseId.value, data)
    } else {
      await campusStore.addCourseItem(data)
    }
    closeAddCourseModal()
  } catch {
    // 错误已在store中处理
  }
}

// 导入课表相关
const showImportModal = ref(false)
const importFile = ref<File | null>(null)

function openImportModal() {
  importFile.value = null
  showImportModal.value = true
}

function closeImportModal() {
  showImportModal.value = false
  importFile.value = null
}

function handleFileChange(file: any) {
  importFile.value = file.raw
}

async function importSchedule() {
  if (!importFile.value) {
    ElMessage.warning('请选择要导入的文件')
    return
  }
  try {
    await campusStore.importScheduleFile(importFile.value)
    closeImportModal()
  } catch {
    // 错误已在store中处理
  }
}

// 分享课表相关
const showShareModal = ref(false)
const shareExpireDays = ref(7)
const shareUrl = ref('')
const shareExpireAt = ref('')

function openShareModal() {
  shareUrl.value = ''
  shareExpireAt.value = ''
  shareExpireDays.value = 7
  showShareModal.value = true
}

function closeShareModal() {
  showShareModal.value = false
}

function resetShare() {
  shareUrl.value = ''
  shareExpireAt.value = ''
}

async function generateShareLink() {
  try {
    const result = await campusStore.shareScheduleLink(shareExpireDays.value)
    shareUrl.value = result.shareUrl
    shareExpireAt.value = new Date(result.expiresAt).toLocaleString('zh-CN')
  } catch {
    // 错误已在store中处理
  }
}

function copyShareLink() {
  if (shareUrl.value) {
    navigator.clipboard.writeText(shareUrl.value).then(() => {
      ElMessage.success('链接已复制到剪贴板')
    }).catch(() => {
      ElMessage.error('复制失败')
    })
  }
}

// 上课提醒相关
const showReminderModal = ref(false)
const reminderForm = ref({
  enabled: false,
  reminderMinutes: 15,
  reminderMethod: 'notification' as 'notification' | 'email' | 'both'
})

function openReminderModal() {
  // 从store加载当前设置
  reminderForm.value = {
    enabled: campusStore.reminderSettings.enabled,
    reminderMinutes: campusStore.reminderSettings.reminderMinutes,
    reminderMethod: campusStore.reminderSettings.reminderMethod
  }
  showReminderModal.value = true
}

function closeReminderModal() {
  showReminderModal.value = false
}

async function saveReminder() {
  try {
    await campusStore.updateReminder({
      enabled: reminderForm.value.enabled,
      reminderMinutes: reminderForm.value.reminderMinutes,
      reminderMethod: reminderForm.value.reminderMethod
    })
    closeReminderModal()
  } catch {
    // 错误已在store中处理
  }
}

const viewModes = [
  { value: 'week', label: '周视图' },
  { value: 'day', label: '日视图' },
  { value: 'list', label: '列表' }
]

const timeSlots = [
  { id: 1, start: '08:00', end: '08:45' },
  { id: 2, start: '08:55', end: '09:40' },
  { id: 3, start: '10:05', end: '10:50' },
  { id: 4, start: '11:00', end: '11:45' },
  { id: 5, start: '13:30', end: '14:15' },
  { id: 6, start: '14:25', end: '15:10' },
  { id: 7, start: '15:35', end: '16:20' },
  { id: 8, start: '16:30', end: '17:15' },
  { id: 9, start: '18:30', end: '19:15' },
  { id: 10, start: '19:25', end: '20:10' }
]

const courses = computed<Course[]>(() => {
  if (!campusStore.schedule?.length) return []
  return campusStore.schedule.map((item, index) => ({
    id: index + 1,
    name: item.courseName,
    teacher: item.teacher || '',
    location: item.classroom || '',
    day: ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][item.dayOfWeek] || 'mon',
    dayLabel: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][item.dayOfWeek] || '周一',
    startPeriod: item.startSection || 1,
    endPeriod: item.endSection || 2,
    startTime: item.startTime || '08:00',
    endTime: item.endTime || '09:40',
    color: item.color || ['#667eea', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'][index % 9],
    weeks: item.weeks || '1-16周'
  }))
})

function getWeekDate(offset: number): Date {
  const base = selectedDate.value ? new Date(selectedDate.value) : new Date()
  const dayOfWeek = base.getDay() || 7
  const monday = new Date(base)
  // 计算本周一的日期，然后加上 offset 天得到本周的某一天
  monday.setDate(base.getDate() - dayOfWeek + 1 + offset)
  return monday
}

function onDateChange(val: string) {
  if (val) {
    selectedDate.value = val
  }
}

const weekDays = computed(() => {
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  const names = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const today = new Date()

  return days.map((key, i) => {
    const date = getWeekDate(i)
    const isToday = date.toDateString() === today.toDateString()
    return {
      key,
      name: names[i],
      date: date.getDate(),
      isToday,
      fullDate: date.toLocaleDateString('zh-CN')
    }
  })
})

const weekRangeText = computed(() => {
  const start = getWeekDate(0)
  const end = getWeekDate(6)
  const fmt = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`
  return `${fmt(start)} - ${fmt(end)}`
})

// 格式化选中的日期显示（用于日期选择器）
const selectedDateDisplay = computed(() => {
  if (!selectedDate.value) return ''
  const d = new Date(selectedDate.value)
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${month}月${day}日`
})

const currentDayName = computed(() => {
  const names = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  return names[new Date().getDay()]
})

const currentDateStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
})

const todayCourses = computed(() => {
  const dayMap: Record<string, string> = {
    0: 'sun', 1: 'mon', 2: 'tue', 3: 'wed', 4: 'thu', 5: 'fri', 6: 'sat'
  }
  const todayKey = dayMap[new Date().getDay()]
  return courses.value.filter(c => c.day === todayKey).sort((a, b) => a.startPeriod - b.startPeriod)
})

const freePeriods = computed(() => {
  const occupied = new Set(todayCourses.value.flatMap(c =>
    Array.from({ length: c.endPeriod - c.startPeriod + 1 }, (_, i) => c.startPeriod + i)
  ))
  return 10 - occupied.size
})

const allCourses = computed(() => [...courses.value].sort((a, b) => {
  const dayOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
  return dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day) || a.startPeriod - b.startPeriod
}))

const isCurrentDay = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return selectedDate.value === today
})

const nowIndicatorTop = computed(() => {
  const now = new Date()
  const hours = now.getHours() + now.getMinutes() / 60
  return `${(hours / 24) * 100}%`
})

function getCoursesForDay(dayKey: string): Course[] {
  return courses.value.filter(c => c.day === dayKey)
}

function courseStyle(course: Course) {
  const height = (course.endPeriod - course.startPeriod + 1) * 60
  const top = (course.startPeriod - 1) * 60
  return {
    background: course.color,
    height: `${height}px`,
    top: `${top}px`
  }
}

function dayViewStyle(course: Course) {
  const [startH, startM] = course.startTime.split(':').map(Number)
  const [endH, endM] = course.endTime.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM
  const totalMinutes = 24 * 60

  const topPct = (startMinutes / totalMinutes) * 100
  const heightPct = ((endMinutes - startMinutes) / totalMinutes) * 100

  return {
    background: course.color,
    top: `${topPct}%`,
    height: `max(${heightPct}%, 60px)`
  }
}

function showCourseDetail(course: Course) {
  selectedCourse.value = course
}

// 打开日期选择器
function openDatePicker() {
  // 通过点击隐藏的日期选择器来打开弹窗
  const datePickerInput = document.querySelector('.date-picker-hidden .el-input__inner') as HTMLElement
  if (datePickerInput) {
    datePickerInput.click()
  }
}

function prevWeek() {
  const currentDate = selectedDate.value ? new Date(selectedDate.value) : new Date()
  currentDate.setDate(currentDate.getDate() - 7)
  selectedDate.value = currentDate.toISOString().split('T')[0]
  currentWeek.value = Math.max(1, currentWeek.value - 1)
}

function nextWeek() {
  const currentDate = selectedDate.value ? new Date(selectedDate.value) : new Date()
  currentDate.setDate(currentDate.getDate() + 7)
  selectedDate.value = currentDate.toISOString().split('T')[0]
  currentWeek.value = Math.min(20, currentWeek.value + 1)
}

function goToToday() {
  selectedDate.value = new Date().toISOString().split('T')[0]
  currentWeek.value = 8
}

onMounted(async () => {
  try {
    await campusStore.fetchSchedule()
  } catch {
    ElMessage.error(t('message.operationFailed'))
  }
})
</script>

<style scoped>
.schedule-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4ff 0%, #e8edf5 100%);
}

.page-header {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  padding: 1.5rem 0;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-week {
  font-size: 0.9375rem;
  opacity: 0.9;
  font-weight: 600;
}

.today-btn {
  padding: 0.5rem 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 9999px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.today-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.view-toggle-bar {
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.week-nav {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-btn {
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
  transition: all 0.2s;
}

.nav-btn:hover {
  background: #f0efff;
  border-color: #667eea;
  color: #667eea;
}

.week-range {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
  min-width: 180px;
  text-align: center;
}

.date-picker-custom {
  width: 140px;
}

.date-picker-custom :deep(.el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 0 0 1px #e5e7eb inset;
  font-size: 0.9375rem;
  font-weight: 600;
  padding: 4px 12px;
}

.date-picker-custom :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #667eea inset;
}

.date-picker-custom :deep(.el-input__inner) {
  color: #1f2937;
  text-align: center;
}

/* 日期选择器包装器 */
.date-picker-wrapper {
  position: relative;
  display: inline-block;
}

/* 隐藏的日期选择器 */
.date-picker-hidden {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  overflow: hidden;
  pointer-events: none;
}

.date-picker-hidden :deep(.el-input) {
  width: 0;
  height: 0;
}

.date-picker-hidden :deep(.el-input__wrapper) {
  display: none;
}

/* 自定义日期显示 */
.date-display {
  width: 140px;
  padding: 8px 12px;
  border-radius: 10px;
  background: white;
  border: 1px solid #e5e7eb;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 0 0 1px #e5e7eb inset;
}

.date-display:hover {
  box-shadow: 0 0 0 1px #667eea inset;
  border-color: #667eea;
}

.view-switcher {
  display: flex;
  gap: 0.375rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 10px;
}

.view-chip {
  padding: 0.5rem 1rem;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.view-chip.active {
  background: white;
  color: #4f46e5;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.schedule-week {
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.week-grid {
  display: grid;
  grid-template-columns: 56px repeat(7, 1fr);
  min-width: 800px;
}

.time-column {
  background: #fafbfc;
  border-right: 1px solid #f0f0f0;
}

.corner-cell {
  height: 52px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

.time-slot {
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
}

.period-num {
  font-size: 0.75rem;
  font-weight: 700;
  color: #4f46e5;
}

.time-range {
  font-size: 0.625rem;
  color: #9ca3af;
  line-height: 1.3;
  text-align: center;
}

.day-column {
  border-right: 1px solid #f0f0f0;
  position: relative;
}

.day-column:last-child {
  border-right: none;
}

.day-column.is-today {
  background: rgba(79, 70, 229, 0.02);
}

.day-header {
  height: 52px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
  position: sticky;
  top: 0;
  background: inherit;
  z-index: 2;
}

.day-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
}

.day-date {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.125rem;
}

.day-date.today {
  width: 22px;
  height: 22px;
  line-height: 22px;
  text-align: center;
  background: #4f46e5;
  color: white;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.6875rem;
}

.courses-area {
  position: relative;
  min-height: 600px;
}

.course-card {
  position: absolute;
  left: 3px;
  right: 3px;
  border-radius: 8px;
  padding: 4px 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
  z-index: 1;
}

.course-card:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.course-name {
  font-size: 0.75rem;
  font-weight: 700;
  color: white;
  line-height: 1.3;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.course-location,
.course-teacher {
  font-size: 0.625rem;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.schedule-day {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.day-view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.day-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.day-stats {
  display: flex;
  gap: 1rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  color: #6b7280;
  padding: 0.375rem 0.75rem;
  background: #f3f4f6;
  border-radius: 8px;
}

.stat-item.free-time {
  color: #10b981;
  background: #ecfdf5;
}

.day-timeline {
  display: grid;
  grid-template-columns: 56px 1fr;
  position: relative;
  min-height: 480px;
}

.timeline-hours {
  border-right: 1px solid #e5e7eb;
}

.hour-mark {
  height: 60px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0;
  position: relative;
}

.hour-label {
  font-size: 0.6875rem;
  color: #9ca3af;
  margin-top: -8px;
}

.timeline-body {
  position: relative;
}

.no-courses {
  text-align: center;
  padding: 3rem 1rem;
  color: #9ca3af;
}

.no-courses .el-icon {
  font-size: 3rem;
  margin-bottom: 0.75rem;
  opacity: 0.4;
}

.no-courses p {
  font-size: 0.9375rem;
}

.timeline-course {
  position: absolute;
  left: 8px;
  right: 8px;
  border-radius: 12px;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
  z-index: 1;
}

.timeline-course:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
  z-index: 10;
}

.tc-time {
  font-size: 0.75rem;
  font-weight: 600;
  opacity: 0.9;
  margin-bottom: 0.125rem;
}

.tc-name {
  font-size: 0.9375rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
}

.tc-meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  opacity: 0.85;
}

.now-indicator {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 20;
  pointer-events: none;
}

.now-dot {
  width: 10px;
  height: 10px;
  background: #ef4444;
  border-radius: 50%;
  position: absolute;
  left: -5px;
  top: -5px;
  animation: pulse-dot 2s infinite;
}

.now-line {
  height: 1px;
  background: #ef4444;
  width: 100%;
}

@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(239, 68, 68, 0); }
}

.schedule-list {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

.list-header h3 {
  font-size: 1.0625rem;
  font-weight: 700;
  color: #1f2937;
}

.total-count {
  font-size: 0.8125rem;
  color: #9ca3af;
}

.list-course-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f9fafb;
  cursor: pointer;
  transition: background 0.2s;
}

.list-course-item:hover {
  background: #f9fafb;
}

.list-course-item:last-child {
  border-bottom: none;
}

.lc-color-bar {
  width: 4px;
  height: 48px;
  border-radius: 2px;
  flex-shrink: 0;
}

.lc-info {
  flex: 1;
  min-width: 0;
}

.lc-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.375rem;
}

.lc-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.lc-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
  background: #f3f4f6;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}

.lc-arrow {
  color: #c4b5fd;
  font-size: 1.125rem;
  flex-shrink: 0;
}

.action-card {
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.action-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.action-icon {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
}

.action-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: #374151;
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

.course-detail-modal {
  width: 100%;
  max-width: 420px;
  animation: modalSlideIn 0.3s ease;
}

.modal-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 700;
}

.close-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.modal-body {
  padding: 1.5rem;
}

.course-form :deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
  padding-bottom: 0.5rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.color-picker {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.color-option:hover {
  transform: scale(1.1);
}

.import-content {
  padding: 1rem 0;
}

.import-desc {
  text-align: center;
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.upload-area :deep(.el-upload-dragger) {
  width: 100%;
  padding: 2rem;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: #f9fafb;
  transition: all 0.2s;
}

.upload-area :deep(.el-upload-dragger:hover) {
  border-color: #667eea;
  background: #f0efff;
}

.upload-icon {
  font-size: 3rem;
  color: #9ca3af;
  margin-bottom: 1rem;
}

.upload-text {
  color: #374151;
  font-size: 1rem;
}

.upload-tip {
  text-align: center;
  color: #9ca3af;
  font-size: 0.75rem;
  margin-top: 0.75rem;
}

.selected-file {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f0efff;
  border-radius: 8px;
  color: #4f46e5;
}

.share-content {
  padding: 1rem 0;
}

.share-desc {
  text-align: center;
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.share-success {
  text-align: center;
  padding: 1.5rem 0;
}

.success-icon {
  margin-bottom: 0.75rem;
}

.success-text {
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.expire-text {
  font-size: 0.875rem;
  color: #9ca3af;
}

.share-url-box {
  margin: 1.5rem 0;
}

.share-input :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px #e5e7eb inset;
}

.share-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.reminder-content {
  padding: 1rem 0;
}

.reminder-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.toggle-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.25rem;
}

.toggle-info p {
  font-size: 0.875rem;
  color: #9ca3af;
}

.reminder-options {
  padding-top: 0.5rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item.full-width {
  grid-column: span 2;
}

.detail-label {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 500;
}

.detail-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: #1f2937;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
}

.modal-btn {
  flex: 1;
  padding: 0.75rem;
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

.modal-btn.primary {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
}

.modal-btn.secondary {
  background: #f3f4f6;
  color: #4b5563;
}

@keyframes modalSlideIn {
  from { opacity: 0; transform: translateY(16px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.modal-fade-enter-active { transition: opacity 0.3s ease; }
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .week-grid {
    min-width: 600px;
  }

  .time-slot {
    height: 48px;
  }

  .courses-area {
    min-height: 480px;
  }

  .course-card {
    padding: 2px 4px;
  }

  .course-name {
    font-size: 0.625rem;
  }

  .course-location,
  .course-teacher {
    font-size: 0.5625rem;
  }

  .day-timeline {
    grid-template-columns: 40px 1fr;
  }

  .hour-mark {
    height: 48px;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-item.full-width {
    grid-column: span 1;
  }
}
</style>
