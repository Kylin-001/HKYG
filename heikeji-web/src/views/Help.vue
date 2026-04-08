<template>
  <div class="min-h-screen bg-gray-50/50">
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      <header class="text-center mb-10">
        <h1 class="text-3xl font-bold text-text-primary flex items-center justify-center gap-3 mb-2">
          <el-icon :size="32" class="text-primary"><QuestionFilled /></el-icon> 帮助中心
        </h1>
        <p class="text-text-tertiary">常见问题解答与使用指南</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div v-for="(card, idx) in quickCards" :key="idx"
          @click="scrollToSection(card.section)"
          class="bg-white rounded-2xl border border-primary-50/50 p-5 cursor-pointer hover:shadow-md hover:border-primary/30 transition-all group">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center mb-3" :style="{ backgroundColor: card.bg }">
            <el-icon :size="22" :class="card.color"><component :is="card.icon" /></el-icon>
          </div>
          <h3 class="font-semibold text-text-primary text-sm mb-1">{{ card.title }}</h3>
          <p class="text-xs text-text-tertiary">{{ card.desc }}</p>
        </div>
      </div>

      <section id="faq" class="mb-10">
        <h2 class="text-xl font-bold text-text-primary mb-5 flex items-center gap-2">
          <el-icon :size="20" class="text-gold"><ChatDotRound /></el-icon> 常见问题
        </h2>
        <div class="space-y-3">
          <div v-for="(item, idx) in faqItems" :key="idx"
            class="bg-white rounded-2xl border border-primary-50/50 overflow-hidden hover:shadow-sm transition-shadow">
            <button @click="toggleFaq(idx)"
              class="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50/30 transition-colors">
              <span class="font-medium text-text-primary text-sm pr-4">{{ item.question }}</span>
              <el-icon :size="16" :class="['text-text-quaternary transition-transform duration-200', openFaq === idx ? 'rotate-180' : '']"><ArrowDown /></el-icon>
            </button>
            <div v-show="openFaq === idx"
              class="px-5 pb-5 pt-0 border-t border-gray-100 mt-0">
              <div class="pt-4 text-sm text-text-secondary leading-relaxed space-y-2" v-html="item.answer"></div>
              <div v-if="item.tags && item.tags.length > 0" class="mt-3 flex flex-wrap gap-1.5">
                <span v-for="tag in item.tags" :key="tag"
                  class="px-2.5 py-0.5 rounded-full bg-primary-50 text-primary text-[11px] font-medium">{{ tag }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="guide" class="mb-10">
        <h2 class="text-xl font-bold text-text-primary mb-5 flex items-center gap-2">
          <el-icon :size="20" class="text-info"><Reading /></el-icon> 使用指南
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div v-for="(guide, idx) in guides" :key="idx"
            class="bg-white rounded-2xl border border-primary-50/50 p-6 hover:shadow-sm transition-all">
            <div class="flex items-start gap-4">
              <span class="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-bold shrink-0">{{ String(idx + 1).padStart(2, '0') }}</span>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-text-primary text-sm mb-2">{{ guide.title }}</h3>
                <ol class="list-decimal list-inside space-y-1.5 text-xs text-text-secondary pl-1">
                  <li v-for="(step, sIdx) in guide.steps" :key="sIdx">{{ step }}</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" class="mb-10">
        <h2 class="text-xl font-bold text-text-primary mb-5 flex items-center gap-2">
          <el-icon :size="20" class="text-crimson"><Service /></el-icon> 联系我们
        </h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="(contact, idx) in contacts" :key="idx"
            class="bg-white rounded-2xl border border-primary-50/50 p-5 hover:shadow-sm transition-all text-center">
            <div class="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" :style="{ backgroundColor: contact.bg }">
              <el-icon :size="24" :class="contact.color"><component :is="contact.icon" /></el-icon>
            </div>
            <h3 class="font-semibold text-text-primary text-sm mb-1">{{ contact.title }}</h3>
            <p class="text-xs text-text-secondary break-all">{{ contact.value }}</p>
            <p v-if="contact.note" class="text-[10px] text-text-quaternary mt-1">{{ contact.note }}</p>
          </div>
        </div>
      </section>

      <section id="feedback" class="mb-8">
        <div class="bg-gradient-to-br from-primary/5 to-primary-light/5 rounded-2xl border border-primary-10 p-6 lg:p-8">
          <h2 class="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
            <el-icon :size="18" class="text-primary"><EditPen /></el-icon> 意见反馈
          </h2>
          <p class="text-sm text-text-secondary mb-5">如果您有建议或遇到问题，欢迎向我们反馈，我们会尽快处理。</p>
          <form @submit.prevent="submitFeedback" class="max-w-lg space-y-3">
            <input v-model="feedbackForm.email" type="email" placeholder="您的邮箱（选填）"
              class="w-full px-4 py-2.5 rounded-xl border border-primary-100 focus:border-primary focus:ring-2 focus:ring-primary-50 outline-none text-sm bg-white" />
            <select v-model="feedbackForm.category"
              class="w-full px-4 py-2.5 rounded-xl border border-primary-100 focus:border-primary outline-none text-sm bg-white">
              <option value="" disabled>选择反馈类型</option>
              <option value="bug">功能异常 / Bug报告</option>
              <option value="feature">新功能建议</option>
              <option value="ui">界面体验问题</option>
              <option value="other">其他</option>
            </select>
            <textarea v-model="feedbackForm.content" :rows="4" placeholder="请详细描述您的问题或建议（至少10个字符）..."
              class="w-full px-4 py-2.5 rounded-xl border border-primary-100 focus:border-primary focus:ring-2 focus:ring-primary-50 outline-none text-sm resize-none"></textarea>
            <button type="submit" :disabled="!canSubmit || submitting"
              class="px-7 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold shadow-brand hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed transition-all">
              {{ submitting ? '提交中...' : '提交反馈' }}
            </button>
          </form>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import {
  QuestionFilled, ChatDotRound, Reading, Service, EditPen,
  ArrowDown, ShoppingCart, CreditCard, Document, Bell,
  Phone, Message, Location, Clock, Promotion, User
} from '@element-plus/icons-vue'

const openFaq = ref<number | null>(null)

function toggleFaq(index: number) {
  openFaq.value = openFaq.value === index ? null : index
}

function scrollToSection(id: string): void {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const quickCards = [
  { title: '购物指南', desc: '商品浏览、下单、支付全流程', icon: ShoppingCart, color: 'text-primary', bg: 'rgba(0,10,176,0.08)', section: 'guide' },
  { title: '校园服务', desc: '学工办理、缴费、公告等', icon: CreditCard, color: 'text-gold', bg: 'rgba(212,168,67,0.1)', section: 'faq' },
  { title: '账户管理', desc: '个人信息、密码修改、安全设置', icon: User, color: 'text-pine', bg: 'rgba(45,134,89,0.08)', section: 'contact' },
  { title: '意见反馈', desc: 'Bug报告、功能建议、问题咨询', icon: EditPen, color: 'text-crimson', bg: 'rgba(192,57,43,0.06)', section: 'feedback' }
]

const faqItems = [
  {
    question: '如何下单购买商品？',
    answer: '<p>1. 在首页或分类页浏览商品，点击进入详情页</p><p>2. 选择规格后点击「加入购物车」或「立即购买」</p><p>3. 在购物车中确认商品信息，填写收货地址</p><p>4. 选择支付方式完成付款</p>',
    tags: ['购物', '新手']
  },
  {
    question: '支持哪些支付方式？',
    answer: '<p>目前支持以下支付方式：</p><ul class="list-disc list-inside ml-2"><li><strong>微信支付</strong> - 推荐方式，安全快捷</li><li><strong>支付宝</strong> - 同样支持扫码和快捷支付</li><li><strong>校园卡余额</strong> - 使用校园卡预充值金额支付</li></ul>',
    tags: ['支付']
  },
  {
    question: '如何申请请假？',
    answer: '<p>1. 进入「学工办理」→「请假申请」模块</p><p>2. 选择请假类型（病假/事假/家庭事务/其他）</p><p>3. 填写请假原因、起止日期</p><p>4. 提交后等待辅导员审批，可在记录中查看进度</p>',
    tags: ['学工', '请假']
  },
  {
    question: '学费如何缴纳？',
    answer: '<p>1. 进入「缴费中心」→「学费缴纳」页面</p><p>2. 查看待缴项目列表，勾选需要缴纳的项目</p><p>3. 确认总金额后点击支付</p><p>4. 如需缓缴可前往「绿色通道」申请延期</p><p>缴费成功后电子票据将发送至校园邮箱。</p>',
    tags: ['缴费', '学费']
  },
  {
    question: '忘记密码怎么办？',
    answer: '<p>在登录页面点击「忘记密码」，通过以下任一方式重置：</p><ul class="list-disc list-inside ml-2"><li><strong>学号+身份证号验证</strong></li><li><strong>绑定手机号接收验证码</strong></li><li><strong>联系学工处人工重置</strong>（电话：0451-88036000）</li></ul>',
    tags: ['账户', '安全']
  },
  {
    question: '如何查看订单状态？',
    answer: '<p>登录后在「个人中心」→「我的订单」中查看所有订单：</p><ul class="list-disc list-inside ml-2"><li><strong>待付款</strong> - 请在30分钟内完成支付</li><li><strong>已发货</strong> - 可查看物流信息</li><li><strong>已完成</strong> - 支持申请售后</li></ul>',
    tags: ['订单']
  },
  {
    question: '校园卡丢失了怎么办？',
    answer: '<p>1. 进入「学工办理」→「校园卡服务」</p><p>2. 点击「挂失」按钮立即冻结卡片</p><p>3. 如需补办，点击「补办」按钮支付¥20工本费</p><p>4. 补办完成后到指定地点领取新卡</p><p>⚠️ 建议第一时间挂失以保障资金安全！</p>',
    tags: ['校园卡', '安全']
  },
  {
    question: '如何获取通知提醒？',
    answer: '<p>系统会自动推送以下通知：</p><ul class="list-disc list-inside ml-2"><li>订单状态变更通知</li><li>审批结果通知（请假/助学金等）</li><li>系统公告和活动提醒</li></ul><p>可在「个人中心」→「消息设置」中管理通知偏好。</p>',
    tags: ['通知', '设置']
  }
]

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

const contacts = [
  { title: '客服热线', value: '0451-88036123', icon: Phone, color: 'text-primary', bg: 'rgba(0,10,176,0.08)', note: '工作日 8:00-17:00' },
  { title: '在线客服', value: 'help.usth.edu.cn', icon: Message, color: 'text-info', bg: 'rgba(59,130,246,0.08)', note: '7×24小时在线' },
  { title: '办公地址', value: '主楼A区102室', icon: Location, color: 'text-pine', bg: 'rgba(45,134,89,0.08)', note: '学生服务中心' },
  { title: '响应时间', value: '一般1-2工作日', icon: Clock, color: 'text-gold', bg: 'rgba(212,168,67,0.1)', note: '紧急问题优先处理' }
]

const feedbackForm = ref({
  email: '',
  category: '',
  content: ''
})
const submitting = ref(false)

const canSubmit = computed(() => {
  return feedbackForm.value.category && feedbackForm.value.content.trim().length >= 10
})

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
</script>
