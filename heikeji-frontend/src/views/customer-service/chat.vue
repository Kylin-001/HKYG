<template>
  <div class="customer-service-container">
    <el-card class="chat-card">
      <div slot="header" class="chat-header">
        <div class="header-left">
          <el-avatar :size="40" icon="el-icon-service"></el-avatar>
          <div class="header-info">
            <div class="header-title">智能客服小E</template>
            <div class="header-status">
              <span class="status-dot"></span>
              在线
            </template>
          </template>
        </template>
        <div class="header-right">
          <el-button type="text" @click="clearHistory">清空记录</el-button>
        </template>
      </template>

      <div class="chat-content" ref="chatContent">
        <div class="welcome-message">
          <el-avatar :size="36" icon="el-icon-service"></el-avatar>
          <div class="welcome-text">
            <div class="bot-name">智能客服小E</template>
            <div class="welcome-content">
              您好！我是黑科易购智能客服小E，很高兴为您服务！😊<br>
              我可以帮您解答关于<strong>注册、下单、支付、配送、退款</strong>等问题。<br>
              请直接输入您的问题~
            </template>
          </template>
        </template>

        <div
          v-for="(msg, index) in messages"
          :key="index"
          :class="['message-item', msg.type === 'user' ? 'user-message' : 'bot-message']"
        >
          <el-avatar v-if="msg.type === 'bot'" :size="36" icon="el-icon-service"></el-avatar>
          <div class="message-content">
            <div class="message-bubble" v-html="formatContent(msg.content)"></template>
          </template>
          <el-avatar v-if="msg.type === 'user'" :size="36" icon="el-icon-user"></el-avatar>
        </template>

        <div v-if="loading" class="message-item bot-message">
          <el-avatar :size="36" icon="el-icon-service"></el-avatar>
          <div class="message-content">
            <div class="message-bubble loading">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </template>
          </template>
        </template>
      </template>

      <div class="quick-replies">
        <el-tag
          v-for="(reply, index) in quickReplies"
          :key="index"
          @click="sendQuickReply(reply.question)"
          class="quick-tag"
        >
          {{ reply.question }}
        </el-tag>
      </template>

      <div class="chat-input">
        <el-input
          v-model="inputMessage"
          placeholder="请输入您的问题..."
          @keyup.enter.native="sendMessage"
          :disabled="loading"
        >
          <el-button slot="append" @click="sendMessage" :loading="loading">发送</el-button>
        </el-input>
      </template>
    </el-card>

    <el-card class="eval-card" v-if="showEvaluation">
      <div slot="header">请对本次服务进行评价</template>
      <div class="eval-buttons">
        <el-button
          v-for="option in evaluationOptions"
          :key="option.value"
          :type="selectedRating === option.value ? 'primary' : 'default'"
          @click="submitEvaluation(option.value)"
        >
          {{ option.label }}
        </el-button>
      </template>
    </el-card>
  </template>
</template>

<script>
import { chat, getHistory, getQuickReplies, getEvaluationOptions, submitFeedback, clearChatHistory } from '@/api/customer-service'

export default {
  name: 'CustomerService',
  data() {
    return {
      sessionId: '',
      messages: [],
      inputMessage: '',
      loading: false,
      quickReplies: [],
      evaluationOptions: [],
      selectedRating: null,
      showEvaluation: false,
      messageCount: 0
    }
  },
  created() {
    this.sessionId = this.generateSessionId()
    this.loadHistory()
    this.loadQuickReplies()
    this.loadEvaluationOptions()
  },
  methods: {
    generateSessionId() {
      return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    },
    loadHistory() {
      getHistory(this.sessionId).then(response => {
        this.messages = response.data || []
      }).catch(() => {
        this.messages = []
      })
    },
    loadQuickReplies() {
      getQuickReplies().then(response => {
        this.quickReplies = response.data || []
      })
    },
    loadEvaluationOptions() {
      getEvaluationOptions().then(response => {
        this.evaluationOptions = response.data || []
      })
    },
    sendMessage() {
      if (!this.inputMessage.trim() || this.loading) return

      const message = this.inputMessage.trim()
      this.inputMessage = ''

      this.messages.push({
        type: 'user',
        content: message,
        timestamp: Date.now()
      })

      this.scrollToBottom()
      this.loading = true

      chat({
        sessionId: this.sessionId,
        message: message
      }).then(response => {
        const data = response.data
        if (data) {
          this.messages.push({
            type: 'bot',
            content: data.reply,
            timestamp: Date.now()
          })

          this.messageCount++
          if (this.messageCount >= 5) {
            this.showEvaluation = true
            this.messageCount = 0
          }
        }
        this.loading = false
        this.$nextTick(() => {
          this.scrollToBottom()
        })
      }).catch(() => {
        this.loading = false
        this.$message.error('发送失败，请重试')
      })
    },
    sendQuickReply(question) {
      this.inputMessage = question
      this.sendMessage()
    },
    formatContent(content) {
      if (!content) return ''
      return content.replace(/\n/g, '<br>')
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const content = this.$refs.chatContent
        if (content) {
          content.scrollTop = content.scrollHeight
        }
      })
    },
    clearHistory() {
      this.$confirm('确认清空聊天记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        clearChatHistory(this.sessionId).then(() => {
          this.messages = []
          this.$message.success('聊天记录已清空')
        })
      })
    },
    submitEvaluation(rating) {
      this.selectedRating = rating
      submitFeedback({
        sessionId: this.sessionId,
        rating: rating,
        content: ''
      }).then(() => {
        this.$message.success('感谢您的评价！')
        this.showEvaluation = false
        this.selectedRating = null
      })
    }
  }
}
</script>

<style scoped>
.customer-service-container {
  padding: 20px;
  height: calc(100vh - 110px);
  display: flex;
  flex-direction: column;
}

.chat-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
}

.header-info {
  margin-left: 12px;
}

.header-title {
  font-size: 16px;
  font-weight: bold;
}

.header-status {
  font-size: 12px;
  color: #67C23A;
  display: flex;
  align-items: center;
  margin-top: 4px;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #67C23A;
  border-radius: 50%;
  margin-right: 4px;
}

.chat-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
  min-height: 400px;
}

.welcome-message {
  display: flex;
  margin-bottom: 20px;
}

.welcome-text {
  margin-left: 12px;
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  max-width: 80%;
}

.bot-name {
  font-size: 12px;
  color: #909399;
  margin-bottom: 4px;
}

.welcome-content {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
}

.user-message {
  flex-direction: row-reverse;
}

.bot-message {
  flex-direction: row;
}

.message-content {
  max-width: 70%;
  margin: 0 12px;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

.user-message .message-bubble {
  background: #409EFF;
  color: #fff;
}

.bot-message .message-bubble {
  background: #f5f5f5;
  color: #333;
}

.loading .dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #909399;
  border-radius: 50%;
  margin: 0 2px;
  animation: loading 1.4s infinite ease-in-out;
}

.loading .dot:nth-child(1) {
  animation-delay: 0s;
}

.loading .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loading {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.quick-replies {
  padding: 10px 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.quick-tag {
  cursor: pointer;
}

.chat-input {
  padding-top: 15px;
}

.eval-card {
  margin-top: 20px;
}

.eval-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}
</style>
