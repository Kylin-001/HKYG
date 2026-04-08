<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

const features = [
  { title: '无感开课', desc: '基于人脸识别的无感知签到开课系统，自动记录考勤', icon: '🧑‍🏫', color: 'from-primary to-primary-light', path: '' },
  { title: '语音签到', desc: '支持语音命令签到，解放双手，便捷高效', icon: '🎙️', color: 'from-pine to-pine-light', path: '' },
  { title: '作业发布', desc: '在线布置、提交、批改作业，AI辅助评分', icon: '📝', color: 'from-gold to-gold-light', path: '' },
  { title: '课堂录像回看', desc: '智慧教室全程录像，课后随时回看复习', icon: '🎬', color: 'from-crimson to-crimson-light', path: '' },
  { title: '课堂报告', desc: 'AI生成每堂课的教学报告，分析学生参与度', icon: '📊', color: 'from-info to-primary-light', path: '' },
  { title: '互动问答', desc: '实时弹幕提问，AI自动整理Q&A', icon: '💬', color: 'from-purple-400 to-pink-400', path: '' },
]

function handleFeatureClick(feature: typeof features[0]) {
  if (feature.path) {
    router.push(feature.path)
  } else {
    ElMessage.info(`"${feature.title}" 功能正在对接课程资源云平台...`)
  }
}
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 space-y-6">
    <!-- 标题区 -->
    <section class="bg-gradient-to-br from-indigo-600 via-purple-500 to-pink-500 rounded-2xl p-6 text-white relative overflow-hidden">
      <div class="absolute bottom-0 right-0 w-56 h-56 bg-white/5 rounded-full translate-y-1/2 translate-x-1/4"></div>
      <div class="relative z-10">
        <div class="flex items-center gap-2 mb-2">
          <span class="text-2xl">🎓</span>
          <h1 class="text-xl font-bold">AI教学中心</h1>
        </div>
        <p class="text-white/80 text-sm mb-3">黑科大智慧教室核心功能入口 — 无感开课 · 语音签到 · AI课堂报告</p>
        <div class="flex items-center gap-3 text-xs text-white/60">
          <span class="px-2 py-0.5 rounded-full bg-white/15">对接课程资源云平台</span>
          <span class="px-2 py-0.5 rounded-full bg-white/15">USTH智慧教室</span>
        </div>
      </div>
    </section>

    <!-- 功能卡片 -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="feature in features" :key="feature.title"
        @click="handleFeatureClick(feature)"
        :class="['group p-5 rounded-2xl cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300',
          `bg-gradient-to-br ${feature.color} text-white relative overflow-hidden`]">
        <div class="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div class="relative z-10">
          <span class="text-3xl mb-3 block group-hover:scale-110 transition-transform duration-300">{{ feature.icon }}</span>
          <h3 class="text-base font-bold mb-1.5">{{ feature.title }}</h3>
          <p class="text-white/75 text-sm leading-relaxed">{{ feature.desc }}</p>
          <button class="mt-3 px-4 py-1.5 rounded-lg bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-colors">
            进入功能 →
          </button>
        </div>
      </div>
    </section>

    <!-- 使用说明 -->
    <section class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-5">
      <h2 class="text-base font-bold text-text-primary mb-3">📖 使用说明</h2>
      <ul class="space-y-2 text-sm text-text-secondary">
        <li class="flex items-start gap-2"><span class="text-primary shrink-0">1.</span><span>无感开课：进入智慧教室后，系统通过摄像头自动识别人脸完成签到和开课</span></li>
        <li class="flex items-start gap-2"><span class="text-primary shrink-0">2.</span><span>语音签到：在课堂上说出"我已到达"等语音指令即可完成签到</span></li>
        <li class="flex items-start gap-2"><span class="text-primary shrink-0">3.</span><span>课堂录像：所有智慧教室的课程录像将在课后24小时内上传至本平台</span></li>
        <li class="flex items-start gap-2"><span class="text-primary shrink-0">4.</span><span>课堂报告：教师可在课后查看AI生成的课堂参与度、注意力分布等分析报告</span></li>
      </ul>
    </section>
  </div>
</template>
