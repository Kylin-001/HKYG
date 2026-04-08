<template>
  <div class="page min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-text-primary">成绩查询</h1>
        <el-select v-model="selectedSemester" size="default" class="!w-44" placeholder="选择学期">
          <el-option v-for="s in semesters" :key="s.value" :label="s.label" :value="s.value" />
        </el-select>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div class="lg:col-span-1 space-y-5">
          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5 text-center">
            <div class="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center">
              <span class="text-2xl font-bold text-white">{{ gpa }}</span>
            </div>
            <p class="font-bold text-text-primary text-lg">GPA</p>
            <p class="text-xs text-gray-400 mt-1">本学期绩点</p>
          </div>

          <!-- 成绩趋势图表 -->
          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5">
            <h3 class="font-bold text-text-primary mb-4 flex items-center gap-2">
              📈 成绩趋势
            </h3>
            <v-chart :option="chartOption" autoresize class="w-full" style="height: 320px;" @click="handleChartClick" />
          </div>

          <!-- 点击图表后显示的详细成绩表格 -->
          <Teleport to="body">
            <Transition name="fade">
              <div v-if="showDetailDialog" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="showDetailDialog = false">
                <div class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-scale-in">
                  <div class="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 flex items-center justify-between">
                    <h3 class="font-bold text-text-primary">📊 {{ selectedSemesterDetail }} 详细成绩</h3>
                    <button @click="showDetailDialog = false" class="w-8 h-8 bg-white/60 hover:bg-white rounded-full flex items-center justify-center transition-colors">
                      <el-icon :size="16"><Close /></el-icon>
                    </button>
                  </div>
                  <div class="overflow-x-auto max-h-[60vh] overflow-y-auto">
                    <table class="w-full">
                      <thead class="sticky top-0 z-10">
                        <tr class="bg-gray-50/90">
                          <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">课程名称</th>
                          <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">学分</th>
                          <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">成绩</th>
                          <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">绩点</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-50">
                        <tr v-for="(g, idx) in semesterDetailGrades" :key="idx"
                          class="hover:bg-gray-50/30 transition-colors">
                          <td class="px-4 py-3 text-sm font-medium text-text-primary">{{ g.name }}</td>
                          <td class="px-4 py-3 text-center text-sm text-gray-600">{{ g.credit }}</td>
                          <td class="px-4 py-3 text-center">
                            <span :class="['inline-flex items-center justify-center min-w-[40px] px-2 py-0.5 rounded-lg text-xs font-bold', scoreBadgeClass(g.score)]">
                              {{ g.score }}
                            </span>
                          </td>
                          <td class="px-4 py-3 text-center text-sm text-gray-600">{{ g.gpaPoint.toFixed(1) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Transition>
          </Teleport>

          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-5">
            <h3 class="font-bold text-text-primary mb-4 flex items-center gap-2">
              <span class="w-1 h-5 bg-gradient-to-b from-blue-400 to-indigo-400 rounded-full"></span>成绩统计
            </h3>
            <div class="space-y-3">
              <div v-for="stat in gradeStats" :key="stat.label" class="flex items-center justify-between">
                <span class="text-sm text-gray-500">{{ stat.label }}</span>
                <span class="text-sm font-semibold" :class="stat.color">{{ stat.value }}</span>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-purple-100 p-5">
            <h3 class="font-bold text-purple-700 mb-3">📊 成绩分布</h3>
            <div class="space-y-2.5">
              <div v-for="dist in distribution" :key="dist.range" class="flex items-center gap-3">
                <span class="text-xs text-gray-500 w-14 shrink-0">{{ dist.range }}</span>
                <div class="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden relative">
                  <div :class="['h-full rounded-full transition-all duration-700', dist.bgColor]"
                    :style="{ width: dist.percent + '%' }"></div>
                  <span class="absolute inset-0 flex items-center justify-center text-[10px] font-medium text-gray-600">{{ dist.count }}门</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3">
          <div class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 overflow-hidden">
            <div class="px-6 py-4 bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-100 flex items-center justify-between">
              <h3 class="font-bold text-text-primary">课程成绩明细</h3>
              <div class="flex items-center gap-2 text-xs text-gray-400">
                <span>共 {{ grades.length }} 门课程</span>
                <span>|</span>
                <span>总学分 {{ totalCredits }}</span>
              </div>
            </div>

            <div class="overflow-x-auto">
              <table class="w-full">
                <thead>
                  <tr class="bg-gray-50/80">
                    <th class="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">课程名称</th>
                    <th class="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">课程代码</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">学分</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">成绩</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">绩点</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">等级</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-50">
                  <tr v-for="(grade, idx) in sortedGrades" :key="grade.code"
                    class="hover:bg-gray-50/30 transition-colors group"
                    :class="{ 'bg-emerald-50/30': isTopGrade(grade.score) }">
                    <td class="px-5 py-4">
                      <div class="flex items-center gap-2">
                        <span :class="['w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold shrink-0', getSubjectBg(grade.type)]">
                          {{ getSubjectIcon(grade.type) }}
                        </span>
                        <span class="font-medium text-sm text-text-primary group-hover:text-indigo-600 transition-colors">{{ grade.name }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-4 text-xs text-gray-400 font-mono">{{ grade.code }}</td>
                    <td class="px-4 py-4 text-center text-sm font-semibold text-text-primary">{{ grade.credit }}</td>
                    <td class="px-4 py-4 text-center">
                      <span :class="['inline-flex items-center justify-center min-w-[48px] px-2.5 py-1 rounded-lg text-sm font-bold', scoreBadgeClass(grade.score)]">
                        {{ grade.score }}
                      </span>
                    </td>
                    <td class="px-4 py-4 text-center text-sm font-medium text-gray-600">{{ grade.gpaPoint.toFixed(1) }}</td>
                    <td class="px-4 py-4 text-center">
                      <span :class="['px-2.5 py-0.5 rounded-full text-xs font-medium', levelBadgeClass(grade.score)]">
                        {{ getLevel(grade.score) }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/50 p-4 flex items-center gap-3 cursor-pointer hover:border-emerald-200 hover:shadow-md transition-all">
              <div class="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <el-icon class="text-emerald-500 text-lg"><Document /></el-icon>
              </div>
              <div>
                <p class="text-sm font-medium text-text-primary">成绩单导出</p>
                <p class="text-xs text-gray-400">下载PDF格式成绩单</p>
              </div>
            </div>
            <div class="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/50 p-4 flex items-center gap-3 cursor-pointer hover:border-blue-200 hover:shadow-md transition-all">
              <div class="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <el-icon class="text-blue-500 text-lg"><TrendCharts /></el-icon>
              </div>
              <div>
                <p class="text-sm font-medium text-text-primary">成绩趋势分析</p>
                <p class="text-xs text-gray-400">查看各学期变化曲线</p>
              </div>
            </div>
            <div class="bg-white/80 backdrop-blur-md rounded-xl shadow-sm border border-white/50 p-4 flex items-center gap-3 cursor-pointer hover:border-orange-200 hover:shadow-md transition-all">
              <div class="w-11 h-11 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
                <el-icon class="text-orange-500 text-lg"><Warning /></el-icon>
              </div>
              <div>
                <p class="text-sm font-medium text-text-primary">学业预警</p>
                <p class="text-xs text-gray-400">挂科风险 & 重修提醒</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { Document, TrendCharts, Warning, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components'
import { useCampusStore } from '@/stores/campus'

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
])

const campusStore = useCampusStore()

const selectedSemester = ref('2025-2026-2')

const semesters = [
  { label: '2025-2026 第2学期', value: '2025-2026-2' },
  { label: '2025-2026 第1学期', value: '2025-2026-1' },
  { label: '2024-2025 第2学期', value: '2024-2025-2' },
  { label: '2024-2025 第1学期', value: '2024-2025-1' }
]

// 成绩趋势 Mock 数据
const gradeTrendData = reactive({
  semesters: ['2023秋', '2024春', '2024秋', '2025春'],
  gpa: [3.2, 3.45, 3.68, 3.82],
  avgScore: [78.5, 81.2, 84.6, 87.3],
  credits: [18, 20, 19.5, 21],
  rank: [45, 32, 18, 12]
})

// 图表点击详情
const showDetailDialog = ref(false)
const selectedSemesterDetail = ref('')
const semesterDetailGrades = ref<any[]>([])

// ECharts 配置
const chartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.96)',
    borderColor: '#e5e7eb',
    borderWidth: 1,
    textStyle: { color: '#374151', fontSize: 12 },
    formatter: (params: any[]) => {
      const idx = params[0]?.dataIndex ?? 0
      const data = gradeTrendData
      return `
        <div style="padding: 8px 12px; min-width: 180px;">
          <div style="font-weight: 600; color: #1f2937; margin-bottom: 8px; border-bottom: 1px solid #f3f4f6; padding-bottom: 6px;">
            📅 ${data.semesters[idx]}
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #3b82f6;"></span>
              <span style="color: #6b7280;">GPA：</span>
              <span style="font-weight: 600; color: #3b82f6;">${data.gpa[idx]}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #10b981;"></span>
              <span style="color: #6b7280;">均分：</span>
              <span style="font-weight: 600; color: #10b981;">${data.avgScore[idx]}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #6b7280;">学分：</span>
              <span style="font-weight: 500;">${data.credits[idx]}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="color: #6b7280;">排名：</span>
              <span style="font-weight: 500;">第 ${data.rank[idx]} 名</span>
            </div>
          </div>
          <div style="margin-top: 8px; padding-top: 6px; border-top: 1px solid #f3f4f6; font-size: 11px; color: #9ca3af;">
            点击查看详细成绩 →
          </div>
        </div>
      `
    }
  },
  legend: {
    data: ['GPA', '均分'],
    bottom: 0,
    icon: 'roundRect',
    itemWidth: 16,
    itemHeight: 8,
    textStyle: { fontSize: 11, color: '#6b7280' }
  },
  grid: {
    left: 50,
    right: 55,
    top: 20,
    bottom: 40
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100,
      zoomOnMouseWheel: true,
      moveOnMouseMove: true
    }
  ],
  xAxis: {
    type: 'category',
    data: gradeTrendData.semesters,
    axisLine: { lineStyle: { color: '#e5e7eb' } },
    axisLabel: { color: '#6b7280', fontSize: 11 },
    axisTick: { show: false }
  },
  yAxis: [
    {
      type: 'value',
      name: 'GPA',
      nameTextStyle: { color: '#3b82f6', fontSize: 11, padding: [0, 0, 0, 20] },
      min: 0,
      max: 4.0,
      interval: 1,
      splitLine: { lineStyle: { color: '#f3f4f4', type: 'dashed' } },
      axisLine: { show: true, lineStyle: { color: '#3b82f6' } },
      axisLabel: { color: '#3b82f6', fontSize: 10, formatter: (v: number) => v.toFixed(1) }
    },
    {
      type: 'value',
      name: '均分',
      nameTextStyle: { color: '#10b981', fontSize: 11, padding: [0, 20, 0, 0] },
      min: 0,
      max: 100,
      interval: 25,
      splitLine: { show: false },
      axisLine: { show: true, lineStyle: { color: '#10b981' } },
      axisLabel: { color: '#10b981', fontSize: 10, formatter: '{value}' }
    }
  ],
  series: [
    {
      name: 'GPA',
      type: 'line',
      yAxisIndex: 0,
      data: gradeTrendData.gpa,
      smooth: true,
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: { width: 2.5, color: '#3b82f6' },
      itemStyle: { color: '#3b82f6', borderColor: '#fff', borderWidth: 2 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.25)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.02)' }
          ]
        }
      }
    },
    {
      name: '均分',
      type: 'line',
      yAxisIndex: 1,
      data: gradeTrendData.avgScore,
      smooth: true,
      symbol: 'triangle',
      symbolSize: 9,
      lineStyle: { width: 2.5, color: '#10b981', type: 'dashed' },
      itemStyle: { color: '#10b981', borderColor: '#fff', borderWidth: 2 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(16, 185, 129, 0.15)' },
            { offset: 1, color: 'rgba(16, 185, 129, 0.02)' }
          ]
        }
      }
    }
  ]
}))

// 图表点击事件处理
function handleChartClick(params: any) {
  if (params.componentType === 'series' && params.dataIndex !== undefined) {
    const idx = params.dataIndex
    selectedSemesterDetail.value = gradeTrendData.semesters[idx]
    
    // Mock 详细成绩数据（根据不同学期生成）
    const mockDetails: Record<number, any[]> = {
      0: [
        { name: '高等数学A(下)', credit: 4, score: 76, gpaPoint: 2.7 },
        { name: '大学物理B', credit: 3, score: 72, gpaPoint: 2.3 },
        { name: 'C语言程序设计', credit: 3, score: 85, gpaPoint: 3.5 },
        { name: '大学英语(二)', credit: 2, score: 78, gpaPoint: 2.8 },
        { name: '线性代数', credit: 3, score: 70, gpaPoint: 2.0 },
        { name: '思想道德与法治', credit: 3, score: 88, gpaPoint: 3.7 }
      ],
      1: [
        { name: '高等数学B(上)', credit: 4, score: 82, gpaPoint: 3.2 },
        { name: '大学物理实验', credit: 1.5, score: 86, gpaPoint: 3.6 },
        { name: '数据结构', credit: 4, score: 79, gpaPoint: 2.9 },
        { name: '大学英语(三)', credit: 2, score: 83, gpaPoint: 3.3 },
        { name: '中国近现代史纲要', credit: 3, score: 80, gpaPoint: 3.0 },
        { name: '体育(二)', credit: 1, score: 90, gpaPoint: 3.9 },
        { name: '离散数学', credit: 3, score: 77, gpaPoint: 2.7 },
        { name: '电路原理', credit: 3, score: 81, gpaPoint: 3.1 }
      ],
      2: [
        { name: '概率论与数理统计', credit: 3, score: 88, gpaPoint: 3.7 },
        { name: '操作系统', credit: 4, score: 85, gpaPoint: 3.5 },
        { name: '计算机网络', credit: 3, score: 90, gpaPoint: 3.9 },
        { name: '大学英语(四)', credit: 2, score: 84, gpaPoint: 3.3 },
        { name: '马克思主义基本原理', credit: 3, score: 82, gpaPoint: 3.2 },
        { name: '数据库原理', credit: 3, score: 86, gpaPoint: 3.6 },
        { name: '体育(三)', credit: 1, score: 92, gpaPoint: 3.9 }
      ],
      3: [
        { name: '编译原理', credit: 3, score: 91, gpaPoint: 3.9 },
        { name: '软件工程', credit: 3, score: 88, gpaPoint: 3.7 },
        { name: '人工智能导论', credit: 2, score: 93, gpaPoint: 4.0 },
        { name: '算法设计与分析', credit: 3, score: 86, gpaPoint: 3.6 },
        { name: '毛泽东思想和中国特色社会主义理论体系概论', credit: 3, score: 85, gpaPoint: 3.5 },
        { name: '专业英语', credit: 2, score: 89, gpaPoint: 3.7 },
        { name: '毕业设计(预研)', credit: 2, score: 95, gpaPoint: 4.0 },
        { name: '体育(四)', credit: 1, score: 94, gpaPoint: 4.0 }
      ]
    }
    
    semesterDetailGrades.value = mockDetails[idx] || []
    showDetailDialog.value = true
  }
}

const grades = computed(() => campusStore.grades)

const gpa = computed(() => {
  if (campusStore.gpa) return campusStore.gpa.toFixed(2)
  const total = grades.value.reduce((s, g) => s + g.credit * g.gpaPoint, 0)
  const credits = grades.value.reduce((s, g) => s + g.credit, 0)
  return credits > 0 ? (total / credits).toFixed(2) : '0.00'
})

const totalCredits = computed(() => grades.value.reduce((s, g) => s + g.credit, 0))

const avgScore = computed(() => grades.value.length > 0 ? (grades.value.reduce((s, g) => s + g.score, 0) / grades.value.length).toFixed(1) : '0.0')

const maxScore = computed(() => grades.value.length > 0 ? Math.max(...grades.value.map(g => g.score)) : 0)
const minScore = computed(() => grades.value.length > 0 ? Math.min(...grades.value.map(g => g.score)) : 0)

const gradeStats = computed(() => [
  { label: '平均分', value: avgScore.value, color: 'text-indigo-600' },
  { label: '最高分', value: maxScore.value, color: 'text-emerald-500' },
  { label: '最低分', value: minScore.value, color: 'text-red-400' },
  { label: '总学分', value: totalCredits.value, color: 'text-blue-500' }
])

const distribution = computed(() => {
  const len = grades.value.length || 1
  return [
    { range: '90-100', count: grades.value.filter(g => g.score >= 90).length, percent: (grades.value.filter(g => g.score >= 90).length / len * 100), bgColor: 'bg-gradient-to-r from-emerald-400 to-teal-400' },
    { range: '80-89', count: grades.value.filter(g => g.score >= 80 && g.score < 90).length, percent: (grades.value.filter(g => g.score >= 80 && g.score < 90).length / len * 100), bgColor: 'bg-gradient-to-r from-blue-400 to-cyan-400' },
    { range: '70-79', count: grades.value.filter(g => g.score >= 70 && g.score < 80).length, percent: (grades.value.filter(g => g.score >= 70 && g.score < 80).length / len * 100), bgColor: 'bg-gradient-to-r from-yellow-400 to-amber-400' },
    { range: '60-69', count: grades.value.filter(g => g.score >= 60 && g.score < 70).length, percent: (grades.value.filter(g => g.score >= 60 && g.score < 70).length / len * 100), bgColor: 'bg-gradient-to-r from-orange-400 to-red-300' },
    { range: '<60', count: grades.value.filter(g => g.score < 60).length, percent: (grades.value.filter(g => g.score < 60).length / len * 100), bgColor: 'bg-gradient-to-r from-red-400 to-red-500' }
  ]
})

const sortedGrades = computed(() => [...grades.value].sort((a, b) => b.score - a.score))

function scoreBadgeClass(score: number): string {
  if (score >= 90) return 'bg-emerald-100 text-emerald-700'
  if (score >= 80) return 'bg-blue-100 text-blue-700'
  if (score >= 70) return 'bg-yellow-100 text-yellow-700'
  if (score >= 60) return 'bg-orange-100 text-orange-700'
  return 'bg-red-100 text-red-700'
}

function levelBadgeClass(score: number): string {
  if (score >= 90) return 'bg-emerald-100 text-emerald-700'
  if (score >= 80) return 'bg-blue-100 text-blue-600'
  if (score >= 70) return 'bg-yellow-100 text-yellow-700'
  if (score >= 60) return 'bg-orange-100 text-orange-600'
  return 'bg-red-100 text-red-600'
}

function getLevel(score: number): string {
  if (score >= 95) return 'A+'
  if (score >= 90) return 'A'
  if (score >= 85) return 'A-'
  if (score >= 80) return 'B+'
  if (score >= 75) return 'B'
  if (score >= 70) return 'B-'
  if (score >= 65) return 'C+'
  if (score >= 60) return 'C'
  return 'F'
}

function isTopGrade(score: number): boolean { return score >= 94 }

function getSubjectIcon(type: string): string {
  const map: Record<string, string> = { math: '📐', cs: '💻', physics: '⚛️', english: '📖', politics: '🏛️', pe: '🏃', ee: '⚡' }
  return map[type] || '📚'
}

function getSubjectBg(type: string): string {
  const map: Record<string, string> = { math: 'bg-violet-100 text-violet-600', cs: 'bg-blue-100 text-blue-600', physics: 'bg-cyan-100 text-cyan-600', english: 'bg-green-100 text-green-600', politics: 'bg-red-100 text-red-600', pe: 'bg-orange-100 text-orange-600', ee: 'bg-yellow-100 text-yellow-600' }
  return map[type] || 'bg-gray-100 text-gray-600'
}

onMounted(async () => {
  try {
    await Promise.all([
      campusStore.fetchGrades(selectedSemester.value),
      campusStore.fetchGPA()
    ])
  } catch {
    ElMessage.error('获取成绩数据失败')
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-scale-in { animation: scaleIn 0.25s ease-out forwards; }
</style>
