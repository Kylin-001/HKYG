<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useStudentAffairsStore } from '@/stores/studentAffairs'
import type { AidPolicy } from '@/types/studentAffairs'
import { Reading, Search, Star, Download, Message, QuestionFilled,
  Money, Trophy, Wallet, CreditCard, Briefcase, WarningFilled, CircleCheckFilled,
  Location, Phone, Promotion, Timer } from '@element-plus/icons-vue'

const store = useStudentAffairsStore()

// ==================== 状态管理 ====================
const searchKeyword = ref('')
const selectedCategory = ref<string>('all')
const showDetailDialog = ref(false)
const currentPolicy = ref<AidPolicy | null>(null)
const favoritePolicies = ref<Set<string>>(new Set())

// ==================== 配置项 ====================
const categories = [
  { value: 'all', label: '全部', icon: Reading },
  { value: 'scholarship', label: '奖学金', icon: Trophy },
  { value: 'grant', label: '助学金', icon: Money },
  { value: 'loan', label: '助学贷款', icon: Wallet },
  { value: 'workstudy', label: '勤工助学', icon: Briefcase },
  { value: 'temporary_aid', label: '临时补助', icon: WarningFilled }
]

// 模拟政策数据
const mockPolicies: AidPolicy[] = [
  {
    id: '1',
    title: '国家奖学金',
    category: 'scholarship',
    type: 'national',
    description: '用于奖励特别优秀的全日制普通本专科（含高职、第二学士学位）在校生。',
    eligibility: ['学习成绩排名在年级前10%', '综合素质测评优秀', '无违纪处分记录'],
    amountRange: '8000元/年',
    deadline: '每年10月31日',
    documentUrls: [],
    isActive: true,
    isFavorited: false,
    faqs: [
      { question: '国家奖学金可以和其他奖学金同时获得吗？', answer: '不可以，同一学年内国家奖学金与其他国家奖学金不能兼得。' },
      { question: '申请需要什么材料？', answer: '申请书、成绩单、获奖证明等。' }
    ],
    applicationRequirements: [
      { requirement: '年级成绩排名前10%', isMet: true },
      { requirement: '无挂科记录', isMet: true },
      { requirement: '综合素质优秀', isMet: false }
    ]
  },
  {
    id: '2',
    title: '国家励志奖学金',
    category: 'scholarship',
    type: 'national',
    description: '用于奖励品学兼优的家庭经济困难学生。',
    eligibility: ['家庭经济困难', '学习成绩优秀', '生活俭朴'],
    amountRange: '5000元/年',
    deadline: '每年10月31日',
    documentUrls: [],
    isActive: true,
    faqs: []
  },
  {
    id: '3',
    title: '国家助学金',
    category: 'grant',
    type: 'national',
    description: '用于资助家庭经济困难的全日制普通本专科（含高职、第二学士学位）在校生。',
    eligibility: ['经学校认定为家庭经济困难学生', '品行端正', '学习努力'],
    amountRange: '2000-4000元/年（分三档）',
    deadline: '每年10月15日',
    documentUrls: [],
    isActive: true,
    faqs: []
  },
  {
    id: '4',
    title: '国家助学贷款',
    category: 'loan',
    type: 'national',
    description: '帮助高校家庭经济困难学生支付在校学习期间所需的学费和住宿费。',
    eligibility: ['具有完全民事行为能力', '诚实守信', '已被录取或在校就读'],
    amountRange: '最高12000元/年',
    deadline: '随时可申请',
    documentUrls: [],
    isActive: true,
    faqs: []
  },
  {
    id: '5',
    title: '校内勤工助学岗位',
    category: 'workstudy',
    type: 'school',
    description: '为家庭经济困难学生提供校内勤工助学机会，帮助学生顺利完成学业。',
    eligibility: ['被认定为家庭经济困难学生', '学有余力', '能保证工作时间'],
    amountRange: '300-800元/月',
    deadline: '每学期初申请',
    documentUrls: [],
    isActive: true,
    faqs: []
  }
]

const policies = ref<AidPolicy[]>(mockPolicies)

// 常见问题FAQ
const faqs = [
  { question: '如何申请国家助学金？', answer: '首先进行家庭经济困难认定，然后填写助学金申请表并提交相关证明材料。' },
  { question: '助学金什么时候发放？', answer: '一般在每年12月底前一次性发放到学生银行卡中。' },
  { question: '国家助学贷款如何还款？', answer: '毕业后两年内开始还款，还款期限最长可达毕业后20年。' },
  { question: '可以同时申请多项资助吗？', answer: '部分资助项目可以兼得，具体请查看各项目的详细说明。' }
]

// ==================== 计算属性 ====================
const filteredPolicies = computed(() => {
  let result = policies.value

  if (selectedCategory.value !== 'all') {
    result = result.filter(p => p.category === selectedCategory.value)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(p =>
      p.title.toLowerCase().includes(keyword) ||
      p.description.toLowerCase().includes(keyword)
    )
  }

  return result
})

// ==================== 方法 ====================
function toggleFavorite(policyId: string) {
  const policy = policies.value.find(p => p.id === policyId)
  if (policy) {
    policy.isFavorited = !policy.isFavorited
    if (policy.isFavorited) {
      favoritePolicies.value.add(policyId)
      ElMessage.success('已收藏')
    } else {
      favoritePolicies.value.delete(policyId)
      ElMessage.info('已取消收藏')
    }
  }
}

function viewDetail(policy: AidPolicy) {
  currentPolicy.value = policy
  showDetailDialog.value = true
}

function handleDownload(url: string) {
  ElMessage.success('文件下载已开始')
}

function handleContact() {
  ElMessage.info('正在连接资助中心...')
}

onMounted(() => {
  store.fetchAidPolicies()
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-6 space-y-6">
    <!-- 搜索和筛选 -->
    <div class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-5 shadow-sm">
      <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <!-- 搜索框 -->
        <div class="flex-1 w-full relative">
          <el-input v-model="searchKeyword" placeholder="搜索政策名称或关键词..." size="large" clearable>
            <template #prefix>
              <Search />
            </template>
          </el-input>
        </div>

        <!-- 分类筛选 -->
        <div class="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          <button v-for="cat in categories" :key="cat.value"
                  @click="selectedCategory = cat.value"
                  :class="['px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5',
                    selectedCategory === cat.value
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-gray-100 text-text-secondary hover:bg-gray-200']">
            {{ cat.icon }} {{ cat.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 政策列表 -->
    <div v-if="filteredPolicies.length > 0" class="space-y-4">
      <div v-for="policy in filteredPolicies" :key="policy.id"
           @click="viewDetail(policy)"
           class="bg-white/90 backdrop-blur-md rounded-xl border border-primary-50/50 p-5 hover:shadow-md transition-all cursor-pointer group">
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-start gap-3 flex-1">
            <span class="text-2xl mt-0.5">{{ categories.find(c => c.value === policy.category)?.icon }}</span>
            <div class="flex-1">
              <h3 class="text-base font-semibold text-text-primary mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                {{ policy.title }}
                <button @click.stop="toggleFavorite(policy.id)" class="p-1 rounded hover:bg-gold/10 transition-colors">
                  <Star :class="['w-5 h-5', policy.isFavorited ? 'text-gold fill-current' : 'text-text-quaternary']" />
                </button>
              </h3>
              <p class="text-sm text-text-secondary leading-relaxed line-clamp-2">{{ policy.description }}</p>
            </div>
          </div>
          <span :class="['px-2.5 py-1 rounded-full text-xs font-medium ml-3 flex-shrink-0',
            policy.isActive ? 'bg-pine/10 text-pine border border-pine/20' : 'bg-gray-100 text-text-quaternary']">
            {{ policy.isActive ? '有效' : '已失效' }}
          </span>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-gray-100">
          <div class="flex items-center gap-4 text-xs text-text-tertiary">
            <span class="flex items-center gap-1"><el-icon :size="12"><Money /></el-icon> {{ policy.amountRange }}</span>
            <span class="flex items-center gap-1"><el-icon :size="12"><Timer /></el-icon> 截止：{{ policy.deadline }}</span>
            <span class="flex items-center gap-1"><el-icon :size="12"><Promotion /></el-icon> {{ categories.find(c => c.value === policy.category)?.label }}</span>
          </div>
          <button class="text-xs text-primary font-medium hover:text-primary-light flex items-center gap-1">
            查看详情 →
          </button>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-center py-16 bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50">
      <Reading :size="48" class="mx-auto mb-4 text-primary/30" />
      <p class="text-text-tertiary text-base font-medium mb-2">未找到相关政策</p>
      <p class="text-text-quaternary text-sm">尝试调整搜索关键词或分类</p>
    </div>

    <!-- 常见问题FAQ -->
    <section class="bg-white/90 backdrop-blur-md rounded-2xl border border-primary-50/50 p-6 shadow-sm">
      <h2 class="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
        <QuestionFilled /> 常见问题 FAQ
      </h2>

      <div class="space-y-3">
        <div v-for="(faq, index) in faqs" :key="index"
             class="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
          <p class="font-medium text-text-primary mb-2 flex items-start gap-2">
            <span class="text-primary font-bold">Q:</span>
            {{ faq.question }}
          </p>
          <p class="text-sm text-text-secondary pl-5 leading-relaxed">
            <span class="font-medium text-info">A:</span>
            {{ faq.answer }}
          </p>
        </div>
      </div>
    </section>

    <!-- 在线咨询入口 -->
    <div class="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 text-white text-center shadow-lg">
      <h3 class="text-xl font-bold mb-2">还有疑问？联系资助中心</h3>
      <p class="text-white/80 text-sm mb-6">我们随时为您提供帮助和支持</p>
      <button @click="handleContact"
              class="px-8 py-3 bg-white text-primary font-semibold rounded-xl hover:shadow-lg transition-all inline-flex items-center gap-2">
        <Message /> 在线咨询
      </button>
      <div class="mt-6 text-sm text-white/70 space-y-1">
        <p class="flex items-center gap-1.5 justify-center"><el-icon :size="13"><Location /></el-icon> 办公地点：主楼B座201室</p>
        <p class="flex items-center gap-1.5 justify-center"><el-icon :size="13"><Phone /></el-icon> 咨询电话：0451-88036123</p>
        <p class="flex items-center gap-1.5 justify-center"><el-icon :size="13"><Message /></el-icon> 邮箱：zzzx@usth.edu.cn</p>
        <p class="flex items-center gap-1.5 justify-center"><el-icon :size="13"><Timer /></el-icon> 工作时间：周一至周五 8:00-17:00</p>
      </div>
    </div>

    <!-- 政策详情弹窗 -->
    <el-dialog v-model="showDetailDialog" :title="currentPolicy?.title || ''" width="700px" :close-on-click-modal="true">
      <div v-if="currentPolicy" class="space-y-5">
        <!-- 基本信息 -->
        <div class="grid grid-cols-2 gap-4 p-4 rounded-xl bg-gray-50">
          <div><span class="text-xs text-text-tertiary">类别：</span>{{ categories.find(c => c.value === currentPolicy.category)?.label }}</div>
          <div><span class="text-xs text-text-tertiary">金额范围：</span><strong class="text-gold">{{ currentPolicy.amountRange }}</strong></div>
          <div><span class="text-xs text-text-tertiary">截止日期：</span>{{ currentPolicy.deadline }}</div>
          <div><span class="text-xs text-text-tertiary">状态：</span>
            <el-icon v-if="currentPolicy.isActive" :size="14" class="text-pine"><CircleCheckFilled /></el-icon>
            <el-icon v-else :size="14" class="text-crimson"><WarningFilled /></el-icon>
            {{ currentPolicy.isActive ? ' 有效' : ' 已失效' }}
          </div>
        </div>

        <!-- 详细描述 -->
        <div>
          <h4 class="text-sm font-semibold text-text-primary mb-2">政策简介</h4>
          <p class="text-sm text-text-secondary leading-relaxed">{{ currentPolicy.description }}</p>
        </div>

        <!-- 申请条件 -->
        <div>
          <h4 class="text-sm font-semibold text-text-primary mb-3">申请条件</h4>
          <ul class="space-y-2">
            <li v-for="(condition, index) in currentPolicy.eligibility" :key="index"
                class="flex items-start gap-2 text-sm text-text-secondary">
              <span class="text-primary mt-0.5"><CircleCheckFilled :size="12" /></span>
              {{ condition }}
            </li>
          </ul>
        </div>

        <!-- 条件对照表 -->
        <div v-if="currentPolicy.applicationRequirements && currentPolicy.applicationRequirements.length > 0">
          <h4 class="text-sm font-semibold text-text-primary mb-3">我的条件符合情况</h4>
          <div class="space-y-2">
            <div v-for="req in currentPolicy.applicationRequirements" :key="req.requireation"
                 class="flex items-center justify-between p-3 rounded-lg border"
                 :class="req.isMet ? 'border-pine/30 bg-pine/5' : 'border-warning/30 bg-warning/5'">
              <span class="text-sm text-text-primary">{{ req.requirement }}</span>
              <span :class="['text-xs px-2 py-1 rounded-full font-medium', req.isMet ? 'bg-pine/10 text-pine' : 'bg-warning/10 text-warning']">
                {{ req.isMet ? '✓ 符合' : '✗ 不符合' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 常见问题 -->
        <div v-if="currentPolicy.faqs && currentPolicy.faqs.length > 0">
          <h4 class="text-sm font-semibold text-text-primary mb-3">相关问题</h4>
          <div class="space-y-2">
            <div v-for="(faq, index) in currentPolicy.faqs" :key="index" class="p-3 rounded-lg bg-blue-50/50">
              <p class="text-sm font-medium text-text-primary mb-1">Q: {{ faq.question }}</p>
              <p class="text-xs text-text-secondary">A: {{ faq.answer }}</p>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-3 pt-4 border-t border-gray-200">
          <button class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
            <Download /> 下载政策文件
          </button>
          <button @click="handleContact"
                  class="flex-1 py-2.5 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-all flex items-center justify-center gap-2">
            <Message /> 咨询详情
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
