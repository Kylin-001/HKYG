<template>
  <div class="security-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="header-icon">
          <el-icon :size="28" color="#fff"><Lock /></el-icon>
        </div>
        <div class="header-text">
          <h1>账号安全</h1>
          <p>保护您的账号安全，管理登录设备和验证方式</p>
        </div>
      </div>

      <div class="main-grid">
        <!-- 左侧内容 -->
        <div class="left-column">
          <!-- 安全评分卡片 -->
          <div class="section-card security-score-card">
            <div class="score-content">
              <div class="score-circle-wrapper">
                <el-progress
                  type="dashboard"
                  :percentage="securityScore"
                  :color="scoreColor"
                  :stroke-width="12"
                  :width="140"
                  :show-text="false"
                />
                <div class="score-text">
                  <span class="score-number">{{ securityScore }}</span>
                  <span class="score-label">安全评分</span>
                </div>
              </div>
              <div class="score-info">
                <h3>{{ scoreTitle }}</h3>
                <p>{{ scoreDescription }}</p>
                <div class="score-tips">
                  <div v-for="(tip, index) in securityTips" :key="index" class="tip-item">
                    <el-icon :size="14" :color="tip.completed ? '#10b981' : '#f59e0b'">
                      <CircleCheck v-if="tip.completed" />
                      <Warning v-else />
                    </el-icon>
                    <span :class="{ 'completed': tip.completed }">{{ tip.text }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 密码安全 -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-icon red">
                <el-icon :size="16" color="#fff"><Lock /></el-icon>
              </div>
              <h3>密码安全</h3>
            </div>
            <div class="section-body">
              <div class="setting-item" @click="showPasswordModal = true">
                <div class="item-left">
                  <div class="item-icon red-light">
                    <el-icon :size="18" color="#ef4444"><Key /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">登录密码</p>
                    <p class="desc">{{ passwordSecurity.lastChanged ? `上次修改：${passwordSecurity.lastChanged}` : '建议定期更换密码' }}</p>
                  </div>
                </div>
                <button class="action-btn">修改</button>
              </div>

              <div class="setting-item" @click="showPayPasswordModal = true">
                <div class="item-left">
                  <div class="item-icon orange-light">
                    <el-icon :size="18" color="#f59e0b"><Wallet /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">支付密码</p>
                    <p class="desc">{{ passwordSecurity.hasPayPassword ? '已设置，保障支付安全' : '未设置，建议立即设置' }}</p>
                  </div>
                </div>
                <button class="action-btn">{{ passwordSecurity.hasPayPassword ? '修改' : '设置' }}</button>
              </div>

              <div class="setting-item">
                <div class="item-left">
                  <div class="item-icon blue-light">
                    <el-icon :size="18" color="#3b82f6"><Timer /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">密码修改周期</p>
                    <p class="desc">建议每 90 天更换一次密码</p>
                  </div>
                </div>
                <el-select v-model="passwordSecurity.changePeriod" size="small" style="width: 120px;">
                  <el-option label="30天" :value="30" />
                  <el-option label="60天" :value="60" />
                  <el-option label="90天" :value="90" />
                  <el-option label="180天" :value="180" />
                </el-select>
              </div>
            </div>
          </div>

          <!-- 双重验证 -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-icon purple">
                <el-icon :size="16" color="#fff"><CircleCheck /></el-icon>
              </div>
              <h3>双重验证</h3>
            </div>
            <div class="section-body">
              <div class="setting-item">
                <div class="item-left">
                  <div class="item-icon green-light">
                    <el-icon :size="18" color="#10b981"><Message /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">短信验证</p>
                    <p class="desc">{{ twoFactor.phone ? `已绑定：${maskPhone(twoFactor.phone)}` : '未开启' }}</p>
                  </div>
                </div>
                <el-switch v-model="twoFactor.smsEnabled" active-color="#10b981" />
              </div>

              <div class="setting-item">
                <div class="item-left">
                  <div class="item-icon blue-light">
                    <el-icon :size="18" color="#3b82f6"><MessageBox /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">邮箱验证</p>
                    <p class="desc">{{ twoFactor.email ? `已绑定：${maskEmail(twoFactor.email)}` : '未开启' }}</p>
                  </div>
                </div>
                <el-switch v-model="twoFactor.emailEnabled" active-color="#3b82f6" />
              </div>

              <div class="setting-item" @click="showAuthenticatorModal = true">
                <div class="item-left">
                  <div class="item-icon purple-light">
                    <el-icon :size="18" color="#8b5cf6"><Cellphone /></el-icon>
                  </div>
                  <div class="item-text">
                    <p class="label-main">验证器 APP</p>
                    <p class="desc">{{ twoFactor.authenticator ? '已绑定 Google Authenticator' : '使用验证器应用获取动态验证码' }}</p>
                  </div>
                </div>
                <button class="action-btn">{{ twoFactor.authenticator ? '管理' : '绑定' }}</button>
              </div>
            </div>
          </div>

          <!-- 登录设备管理 -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-icon teal">
                <el-icon :size="16" color="#fff"><Monitor /></el-icon>
              </div>
              <h3>登录设备管理</h3>
              <span class="device-count">{{ devices.length }} 台设备</span>
            </div>
            <div class="section-body">
              <div v-for="device in devices" :key="device.id" class="device-item">
                <div class="device-info">
                  <div class="device-icon" :class="device.type">
                    <el-icon :size="20" color="#fff">
                      <Cellphone v-if="device.type === 'mobile'" />
                      <Monitor v-else-if="device.type === 'pc'" />
                      <Monitor v-else />
                    </el-icon>
                  </div>
                  <div class="device-details">
                    <div class="device-header">
                      <span class="device-name">{{ device.name }}</span>
                      <span v-if="device.isCurrent" class="current-badge">当前设备</span>
                    </div>
                    <p class="device-meta">{{ device.location }} · {{ device.lastActive }}</p>
                    <p class="device-browser">{{ device.browser }}</p>
                  </div>
                </div>
                <button
                  v-if="!device.isCurrent"
                  class="action-btn danger"
                  @click="kickDevice(device)"
                >
                  踢出
                </button>
              </div>
            </div>
          </div>

          <!-- 登录历史记录 -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-icon blue">
                <el-icon :size="16" color="#fff"><Clock /></el-icon>
              </div>
              <h3>登录历史记录</h3>
              <span class="view-all" @click="showAllHistory = true">查看全部</span>
            </div>
            <div class="section-body">
              <div v-for="(record, index) in loginHistory.slice(0, 5)" :key="index" class="history-item">
                <div class="history-icon" :class="record.status">
                  <el-icon :size="16" color="#fff">
                    <CircleCheck v-if="record.status === 'success'" />
                    <CircleClose v-else />
                  </el-icon>
                </div>
                <div class="history-info">
                  <div class="history-header">
                    <span class="history-time">{{ record.time }}</span>
                    <span class="history-status" :class="record.status">
                      {{ record.status === 'success' ? '成功' : '失败' }}
                    </span>
                  </div>
                  <p class="history-detail">{{ record.location }} · {{ record.device }} · {{ record.ip }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="right-column">
          <!-- 账号绑定 -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-icon green">
                <el-icon :size="16" color="#fff"><Link /></el-icon>
              </div>
              <h3>账号绑定</h3>
            </div>
            <div class="section-body">
              <div class="bind-item" @click="showBindPhoneModal = true">
                <div class="bind-icon phone">
                  <el-icon :size="18" color="#fff"><Phone /></el-icon>
                </div>
                <div class="bind-info">
                  <span class="bind-title">手机号</span>
                  <span class="bind-status" :class="{ 'bound': accountBindings.phone }">
                    {{ accountBindings.phone ? maskPhone(accountBindings.phone) : '未绑定' }}
                  </span>
                </div>
                <el-icon class="arrow" :size="16"><ArrowRight /></el-icon>
              </div>

              <div class="bind-item" @click="showBindEmailModal = true">
                <div class="bind-icon email">
                  <el-icon :size="18" color="#fff"><Message /></el-icon>
                </div>
                <div class="bind-info">
                  <span class="bind-title">邮箱</span>
                  <span class="bind-status" :class="{ 'bound': accountBindings.email }">
                    {{ accountBindings.email ? maskEmail(accountBindings.email) : '未绑定' }}
                  </span>
                </div>
                <el-icon class="arrow" :size="16"><ArrowRight /></el-icon>
              </div>

              <div class="bind-item" @click="showWechatBindModal = true">
                <div class="bind-icon wechat">
                  <el-icon :size="18" color="#fff"><ChatDotRound /></el-icon>
                </div>
                <div class="bind-info">
                  <span class="bind-title">微信</span>
                  <span class="bind-status" :class="{ 'bound': accountBindings.wechat }">
                    {{ accountBindings.wechat ? '已绑定' : '未绑定' }}
                  </span>
                </div>
                <button class="action-btn small">{{ accountBindings.wechat ? '解绑' : '绑定' }}</button>
              </div>

              <div class="bind-item" @click="showQQBindModal = true">
                <div class="bind-icon qq">
                  <el-icon :size="18" color="#fff"><ChatLineRound /></el-icon>
                </div>
                <div class="bind-info">
                  <span class="bind-title">QQ</span>
                  <span class="bind-status" :class="{ 'bound': accountBindings.qq }">
                    {{ accountBindings.qq ? '已绑定' : '未绑定' }}
                  </span>
                </div>
                <button class="action-btn small">{{ accountBindings.qq ? '解绑' : '绑定' }}</button>
              </div>
            </div>
          </div>

          <!-- 安全通知设置 -->
          <div class="section-card">
            <div class="section-header">
              <div class="section-icon orange">
                <el-icon :size="16" color="#fff"><Bell /></el-icon>
              </div>
              <h3>安全通知</h3>
            </div>
            <div class="section-body">
              <div class="notify-item">
                <div class="notify-text">
                  <p class="label-main">登录提醒</p>
                  <p class="desc">新设备登录时发送通知</p>
                </div>
                <el-switch v-model="securityNotify.loginAlert" active-color="#6366f1" />
              </div>

              <div class="notify-item">
                <div class="notify-text">
                  <p class="label-main">密码修改提醒</p>
                  <p class="desc">密码变更时发送通知</p>
                </div>
                <el-switch v-model="securityNotify.passwordChange" active-color="#6366f1" />
              </div>

              <div class="notify-item">
                <div class="notify-text">
                  <p class="label-main">绑定变更提醒</p>
                  <p class="desc">手机号/邮箱变更时发送通知</p>
                </div>
                <el-switch v-model="securityNotify.bindingChange" active-color="#6366f1" />
              </div>

              <div class="notify-item">
                <div class="notify-text">
                  <p class="label-main">异常登录提醒</p>
                  <p class="desc">检测到异常登录行为时通知</p>
                </div>
                <el-switch v-model="securityNotify.abnormalLogin" active-color="#6366f1" />
              </div>
            </div>
          </div>

          <!-- 账号注销 -->
          <div class="danger-card">
            <div class="danger-header">
              <el-icon :size="20" color="#ef4444"><Delete /></el-icon>
              <span>账号注销</span>
            </div>
            <p class="danger-desc">注销后账号将无法恢复，请谨慎操作</p>
            <button class="danger-btn" @click="showDeleteAccountModal = true">
              申请注销账号
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 修改登录密码弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPasswordModal" class="modal-overlay" @click.self="showPasswordModal = false">
          <div class="modal-content modal-small">
            <div class="modal-header">
              <div class="modal-icon red">
                <el-icon :size="24" color="#fff"><Lock /></el-icon>
              </div>
              <h3>修改登录密码</h3>
            </div>
            <div class="input-group">
              <el-input v-model="pwdForm.oldPwd" type="password" placeholder="请输入当前密码" size="large" show-password />
              <el-input v-model="pwdForm.newPwd" type="password" placeholder="请输入新密码（至少8位）" size="large" show-password />
              <el-input v-model="pwdForm.confirmPwd" type="password" placeholder="请确认新密码" size="large" show-password />
              <div class="password-strength" v-if="pwdForm.newPwd">
                <span>密码强度：</span>
                <div class="strength-bar">
                  <div class="strength-fill" :style="{ width: passwordStrength + '%', background: strengthColor }"></div>
                </div>
                <span :style="{ color: strengthColor }">{{ strengthText }}</span>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn-secondary" @click="showPasswordModal = false">取消</button>
              <button class="btn-primary" @click="changePassword">确认修改</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 设置/修改支付密码弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showPayPasswordModal" class="modal-overlay" @click.self="showPayPasswordModal = false">
          <div class="modal-content modal-small">
            <div class="modal-header">
              <div class="modal-icon orange">
                <el-icon :size="24" color="#fff"><Wallet /></el-icon>
              </div>
              <h3>{{ passwordSecurity.hasPayPassword ? '修改支付密码' : '设置支付密码' }}</h3>
            </div>
            <div class="input-group">
              <el-input v-if="passwordSecurity.hasPayPassword" v-model="payPwdForm.oldPwd" type="password" placeholder="请输入原支付密码" size="large" show-password maxlength="6" />
              <el-input v-model="payPwdForm.newPwd" type="password" placeholder="请输入6位数字支付密码" size="large" show-password maxlength="6" />
              <el-input v-model="payPwdForm.confirmPwd" type="password" placeholder="请确认支付密码" size="large" show-password maxlength="6" />
            </div>
            <div class="modal-actions">
              <button class="btn-secondary" @click="showPayPasswordModal = false">取消</button>
              <button class="btn-primary" @click="changePayPassword">确认</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 绑定手机号弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showBindPhoneModal" class="modal-overlay" @click.self="showBindPhoneModal = false">
          <div class="modal-content modal-small">
            <div class="modal-header">
              <div class="modal-icon green">
                <el-icon :size="24" color="#fff"><Phone /></el-icon>
              </div>
              <h3>{{ accountBindings.phone ? '更换手机号' : '绑定手机号' }}</h3>
            </div>
            <div class="input-group">
              <el-input v-model="bindPhoneForm.phone" placeholder="请输入手机号" size="large" maxlength="11">
                <template #prefix>
                  <el-icon><Phone /></el-icon>
                </template>
              </el-input>
              <div class="code-input-row">
                <el-input v-model="bindPhoneForm.code" placeholder="请输入验证码" size="large" maxlength="6">
                  <template #prefix>
                    <el-icon><Key /></el-icon>
                  </template>
                </el-input>
                <button
                  class="btn-send-code"
                  :disabled="codeCountdown > 0 || !isValidPhone"
                  @click="sendPhoneCode"
                >
                  {{ codeCountdown > 0 ? `${codeCountdown}s后重发` : '获取验证码' }}
                </button>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn-secondary" @click="showBindPhoneModal = false">取消</button>
              <button class="btn-primary" @click="bindPhone" :disabled="!canBindPhone">确认绑定</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 绑定邮箱弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showBindEmailModal" class="modal-overlay" @click.self="showBindEmailModal = false">
          <div class="modal-content modal-small">
            <div class="modal-header">
              <div class="modal-icon blue">
                <el-icon :size="24" color="#fff"><Message /></el-icon>
              </div>
              <h3>{{ accountBindings.email ? '更换邮箱' : '绑定邮箱' }}</h3>
            </div>
            <div class="input-group">
              <el-input v-model="bindEmailForm.email" placeholder="请输入邮箱地址" size="large">
                <template #prefix>
                  <el-icon><Message /></el-icon>
                </template>
              </el-input>
              <div class="code-input-row">
                <el-input v-model="bindEmailForm.code" placeholder="请输入验证码" size="large" maxlength="6">
                  <template #prefix>
                    <el-icon><Key /></el-icon>
                  </template>
                </el-input>
                <button
                  class="btn-send-code"
                  :disabled="emailCodeCountdown > 0 || !isValidEmail"
                  @click="sendEmailCode"
                >
                  {{ emailCodeCountdown > 0 ? `${emailCodeCountdown}s后重发` : '获取验证码' }}
                </button>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn-secondary" @click="showBindEmailModal = false">取消</button>
              <button class="btn-primary" @click="bindEmail" :disabled="!canBindEmail">确认绑定</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 验证器APP弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAuthenticatorModal" class="modal-overlay" @click.self="showAuthenticatorModal = false">
          <div class="modal-content">
            <div class="modal-header">
              <div class="modal-icon purple">
                <el-icon :size="24" color="#fff"><Cellphone /></el-icon>
              </div>
              <h3>绑定验证器 APP</h3>
            </div>
            <div class="authenticator-content">
              <div class="qr-code-wrapper">
                <div class="qr-code">
                  <!-- 模拟二维码 -->
                  <div class="qr-placeholder">
                    <el-icon :size="48" color="#cbd5e1"><Grid /></el-icon>
                  </div>
                </div>
                <p class="qr-tip">使用 Google Authenticator 或类似应用扫描</p>
              </div>
              <div class="secret-key">
                <span class="key-label">密钥：</span>
                <code class="key-value">JBSWY3DPEHPK3PXP</code>
                <button class="copy-btn" @click="copySecretKey">
                  <el-icon :size="14"><CopyDocument /></el-icon>
                </button>
              </div>
              <el-input v-model="authenticatorCode" placeholder="请输入6位验证码" size="large" maxlength="6" style="text-align: center;" />
            </div>
            <div class="modal-actions">
              <button class="btn-secondary" @click="showAuthenticatorModal = false">取消</button>
              <button class="btn-primary" @click="bindAuthenticator">确认绑定</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 查看全部登录历史弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAllHistory" class="modal-overlay" @click.self="showAllHistory = false">
          <div class="modal-content modal-large">
            <div class="modal-header">
              <div class="modal-icon blue">
                <el-icon :size="24" color="#fff"><Clock /></el-icon>
              </div>
              <h3>登录历史记录</h3>
            </div>
            <div class="history-list">
              <div v-for="(record, index) in loginHistory" :key="index" class="history-item large">
                <div class="history-icon" :class="record.status">
                  <el-icon :size="16" color="#fff">
                    <CircleCheck v-if="record.status === 'success'" />
                    <CircleClose v-else />
                  </el-icon>
                </div>
                <div class="history-info">
                  <div class="history-header">
                    <span class="history-time">{{ record.time }}</span>
                    <span class="history-status" :class="record.status">
                      {{ record.status === 'success' ? '成功' : '失败' }}
                    </span>
                  </div>
                  <p class="history-detail">{{ record.location }} · {{ record.device }} · {{ record.ip }}</p>
                </div>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn-secondary" @click="showAllHistory = false">关闭</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 账号注销弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showDeleteAccountModal" class="modal-overlay" @click.self="showDeleteAccountModal = false">
          <div class="modal-content modal-small">
            <div class="modal-header danger">
              <div class="modal-icon red">
                <el-icon :size="24" color="#fff"><Warning /></el-icon>
              </div>
              <h3>账号注销</h3>
            </div>
            <div class="delete-account-content">
              <div class="warning-box">
                <el-icon :size="20" color="#f59e0b"><Warning /></el-icon>
                <p>注销账号后，以下数据将被永久删除且无法恢复：</p>
              </div>
              <ul class="delete-list">
                <li>个人资料和账号信息</li>
                <li>订单记录和交易数据</li>
                <li>收藏的店铺和商品</li>
                <li>优惠券和积分</li>
                <li>社区发布的内容</li>
              </ul>
              <el-checkbox v-model="deleteConfirm.agreed">
                我已阅读并同意以上条款，确认注销账号
              </el-checkbox>
              <el-input
                v-model="deleteConfirm.password"
                type="password"
                placeholder="请输入登录密码确认"
                size="large"
                show-password
              />
            </div>
            <div class="modal-actions">
              <button class="btn-secondary" @click="showDeleteAccountModal = false">取消</button>
              <button
                class="btn-danger"
                :disabled="!canDeleteAccount"
                @click="deleteAccount"
              >
                确认注销
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/stores/user'
import * as userApi from '@/api/user'
import {
  Lock, CircleCheck, Warning, Key, Wallet, Timer, Message,
  MessageBox, Cellphone, Monitor, Clock, Link, Phone, Bell, Delete,
  ArrowRight, ChatDotRound, ChatLineRound, Grid, CopyDocument,
  CircleClose
} from '@element-plus/icons-vue'

const userStore = useUserStore()

// ====== 安全评分 ======
const securityScore = computed(() => {
  let score = 0
  if (passwordSecurity.hasLoginPassword) score += 25
  if (passwordSecurity.hasPayPassword) score += 15
  if (twoFactor.smsEnabled) score += 20
  if (twoFactor.emailEnabled) score += 15
  if (twoFactor.authenticator) score += 15
  if (accountBindings.phone) score += 5
  if (accountBindings.email) score += 5
  return Math.min(score, 100)
})

const scoreColor = computed(() => {
  if (securityScore.value >= 80) return '#10b981'
  if (securityScore.value >= 60) return '#f59e0b'
  return '#ef4444'
})

const scoreTitle = computed(() => {
  if (securityScore.value >= 80) return '账号很安全'
  if (securityScore.value >= 60) return '账号安全良好'
  return '账号存在风险'
})

const scoreDescription = computed(() => {
  if (securityScore.value >= 80) return '您的账号安全设置完善，请继续保持！'
  if (securityScore.value >= 60) return '建议开启更多安全保护措施'
  return '请尽快完善安全设置，保护账号安全'
})

const securityTips = computed(() => [
  { text: '设置登录密码', completed: passwordSecurity.hasLoginPassword },
  { text: '设置支付密码', completed: passwordSecurity.hasPayPassword },
  { text: '绑定手机号', completed: !!accountBindings.phone },
  { text: '开启双重验证', completed: twoFactor.smsEnabled || twoFactor.emailEnabled },
  { text: '绑定邮箱', completed: !!accountBindings.email }
])

// ====== 密码安全 ======
const passwordSecurity = reactive({
  hasLoginPassword: true,
  hasPayPassword: false,
  lastChanged: '2024-03-15',
  changePeriod: 90
})

// ====== 双重验证 ======
const twoFactor = reactive({
  phone: '13800138000',
  smsEnabled: true,
  email: 'user@example.com',
  emailEnabled: false,
  authenticator: false
})

// ====== 登录设备 ======
interface Device {
  id: string
  name: string
  type: 'mobile' | 'pc' | 'tablet'
  location: string
  lastActive: string
  browser: string
  isCurrent: boolean
}

const devices = ref<Device[]>([
  {
    id: '1',
    name: 'Windows PC',
    type: 'pc',
    location: '广东深圳',
    lastActive: '当前在线',
    browser: 'Chrome 123.0',
    isCurrent: true
  },
  {
    id: '2',
    name: 'iPhone 15 Pro',
    type: 'mobile',
    location: '广东深圳',
    lastActive: '2小时前',
    browser: 'Safari',
    isCurrent: false
  },
  {
    id: '3',
    name: 'iPad Air',
    type: 'tablet',
    location: '广东广州',
    lastActive: '3天前',
    browser: 'Chrome',
    isCurrent: false
  }
])

// ====== 登录历史 ======
interface LoginRecord {
  time: string
  location: string
  device: string
  ip: string
  status: 'success' | 'failed'
}

const loginHistory = ref<LoginRecord[]>([
  { time: '2024-04-13 14:30:22', location: '广东深圳', device: 'Windows PC', ip: '113.**.**.45', status: 'success' },
  { time: '2024-04-13 08:15:10', location: '广东深圳', device: 'iPhone', ip: '113.**.**.45', status: 'success' },
  { time: '2024-04-12 22:45:33', location: '广东深圳', device: 'iPad', ip: '113.**.**.12', status: 'success' },
  { time: '2024-04-12 18:20:15', location: '北京', device: 'Android', ip: '220.**.**.88', status: 'failed' },
  { time: '2024-04-11 09:30:00', location: '广东深圳', device: 'Windows PC', ip: '113.**.**.45', status: 'success' },
  { time: '2024-04-10 20:15:22', location: '上海', device: 'MacBook', ip: '180.**.**.33', status: 'success' },
  { time: '2024-04-09 14:20:10', location: '广东深圳', device: 'iPhone', ip: '113.**.**.45', status: 'success' }
])

// ====== 账号绑定 ======
const accountBindings = reactive({
  phone: '13800138000',
  email: 'user@example.com',
  wechat: true,
  qq: false
})

// ====== 安全通知 ======
const securityNotify = reactive({
  loginAlert: true,
  passwordChange: true,
  bindingChange: true,
  abnormalLogin: true
})

// ====== 弹窗控制 ======
const showPasswordModal = ref(false)
const showPayPasswordModal = ref(false)
const showBindPhoneModal = ref(false)
const showBindEmailModal = ref(false)
const showAuthenticatorModal = ref(false)
const showAllHistory = ref(false)
const showDeleteAccountModal = ref(false)

// ====== 表单数据 ======
const pwdForm = reactive({ oldPwd: '', newPwd: '', confirmPwd: '' })
const payPwdForm = reactive({ oldPwd: '', newPwd: '', confirmPwd: '' })
const bindPhoneForm = reactive({ phone: '', code: '' })
const bindEmailForm = reactive({ email: '', code: '' })
const authenticatorCode = ref('')
const deleteConfirm = reactive({ agreed: false, password: '' })

// ====== 验证码倒计时 ======
const codeCountdown = ref(0)
const emailCodeCountdown = ref(0)
let countdownTimer: ReturnType<typeof setInterval> | null = null
let emailCountdownTimer: ReturnType<typeof setInterval> | null = null

// ====== 计算属性 ======
const isValidPhone = computed(() => /^1[3-9]\d{9}$/.test(bindPhoneForm.phone))
const canBindPhone = computed(() => isValidPhone.value && bindPhoneForm.code.length === 6)

const isValidEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bindEmailForm.email))
const canBindEmail = computed(() => isValidEmail.value && bindEmailForm.code.length === 6)

const canDeleteAccount = computed(() => deleteConfirm.agreed && deleteConfirm.password.length >= 6)

// 密码强度计算
const passwordStrength = computed(() => {
  const pwd = pwdForm.newPwd
  if (!pwd) return 0
  let strength = 0
  if (pwd.length >= 8) strength += 25
  if (pwd.length >= 12) strength += 10
  if (/[a-z]/.test(pwd)) strength += 15
  if (/[A-Z]/.test(pwd)) strength += 15
  if (/\d/.test(pwd)) strength += 15
  if (/[^a-zA-Z0-9]/.test(pwd)) strength += 20
  return Math.min(strength, 100)
})

const strengthColor = computed(() => {
  if (passwordStrength.value >= 80) return '#10b981'
  if (passwordStrength.value >= 50) return '#f59e0b'
  return '#ef4444'
})

const strengthText = computed(() => {
  if (passwordStrength.value >= 80) return '强'
  if (passwordStrength.value >= 50) return '中'
  return '弱'
})

// ====== 方法 ======
function maskPhone(phone: string): string {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

function maskEmail(email: string): string {
  const [name, domain] = email.split('@')
  const maskedName = name.length > 2 ? name.slice(0, 2) + '***' : '***'
  return `${maskedName}@${domain}`
}

async function kickDevice(device: Device) {
  try {
    await ElMessageBox.confirm(
      `确定要踢出设备 "${device.name}" 吗？踢出后该设备将需要重新登录。`,
      '踢出设备',
      { confirmButtonText: '确认踢出', cancelButtonText: '取消', type: 'warning' }
    )
    devices.value = devices.value.filter(d => d.id !== device.id)
    ElMessage.success('设备已踢出')
  } catch {
    // 用户取消
  }
}

async function sendPhoneCode() {
  if (!isValidPhone.value) {
    ElMessage.warning('请输入正确的手机号')
    return
  }
  try {
    await userApi.sendCode(bindPhoneForm.phone, 'bind')
    ElMessage.success(`验证码已发送至 ${maskPhone(bindPhoneForm.phone)}`)
    codeCountdown.value = 60
    countdownTimer = setInterval(() => {
      codeCountdown.value--
      if (codeCountdown.value <= 0 && countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }, 1000)
  } catch (err: any) {
    ElMessage.error(err.message || '发送验证码失败')
  }
}

async function bindPhone() {
  if (!canBindPhone.value) return
  try {
    await userApi.bindPhone(bindPhoneForm.phone, bindPhoneForm.code)
    accountBindings.phone = bindPhoneForm.phone
    ElMessage.success('手机号绑定成功')
    showBindPhoneModal.value = false
    bindPhoneForm.phone = ''
    bindPhoneForm.code = ''
  } catch (err: any) {
    ElMessage.error(err.message || '绑定手机号失败')
  }
}

async function sendEmailCode() {
  if (!isValidEmail.value) {
    ElMessage.warning('请输入正确的邮箱地址')
    return
  }
  try {
    // await userApi.sendEmailCode(bindEmailForm.email, 'bind')
    ElMessage.success(`验证码已发送至 ${maskEmail(bindEmailForm.email)}`)
    emailCodeCountdown.value = 60
    emailCountdownTimer = setInterval(() => {
      emailCodeCountdown.value--
      if (emailCodeCountdown.value <= 0 && emailCountdownTimer) {
        clearInterval(emailCountdownTimer)
        emailCountdownTimer = null
      }
    }, 1000)
  } catch (err: any) {
    ElMessage.error(err.message || '发送验证码失败')
  }
}

async function bindEmail() {
  if (!canBindEmail.value) return
  try {
    // await userApi.bindEmail(bindEmailForm.email, bindEmailForm.code)
    accountBindings.email = bindEmailForm.email
    ElMessage.success('邮箱绑定成功')
    showBindEmailModal.value = false
    bindEmailForm.email = ''
    bindEmailForm.code = ''
  } catch (err: any) {
    ElMessage.error(err.message || '绑定邮箱失败')
  }
}

async function changePassword() {
  if (!pwdForm.oldPwd || !pwdForm.newPwd) {
    ElMessage.warning('请填写完整信息')
    return
  }
  if (pwdForm.newPwd.length < 8) {
    ElMessage.warning('新密码至少8位')
    return
  }
  if (pwdForm.newPwd !== pwdForm.confirmPwd) {
    ElMessage.warning('两次密码不一致')
    return
  }
  try {
    await userApi.changePassword(pwdForm.oldPwd, pwdForm.newPwd)
    showPasswordModal.value = false
    Object.assign(pwdForm, { oldPwd: '', newPwd: '', confirmPwd: '' })
    passwordSecurity.lastChanged = new Date().toISOString().split('T')[0]
    ElMessage.success('密码修改成功')
  } catch (err: any) {
    ElMessage.error(err.message || '密码修改失败')
  }
}

async function changePayPassword() {
  if (payPwdForm.newPwd.length !== 6 || !/^\d{6}$/.test(payPwdForm.newPwd)) {
    ElMessage.warning('支付密码必须是6位数字')
    return
  }
  if (payPwdForm.newPwd !== payPwdForm.confirmPwd) {
    ElMessage.warning('两次密码不一致')
    return
  }
  try {
    // await userApi.changePayPassword(payPwdForm.oldPwd, payPwdForm.newPwd)
    showPayPasswordModal.value = false
    Object.assign(payPwdForm, { oldPwd: '', newPwd: '', confirmPwd: '' })
    passwordSecurity.hasPayPassword = true
    ElMessage.success('支付密码设置成功')
  } catch (err: any) {
    ElMessage.error(err.message || '设置失败')
  }
}

function copySecretKey() {
  navigator.clipboard.writeText('JBSWY3DPEHPK3PXP')
  ElMessage.success('密钥已复制')
}

async function bindAuthenticator() {
  if (authenticatorCode.value.length !== 6) {
    ElMessage.warning('请输入6位验证码')
    return
  }
  try {
    // await userApi.bindAuthenticator(authenticatorCode.value)
    twoFactor.authenticator = true
    showAuthenticatorModal.value = false
    authenticatorCode.value = ''
    ElMessage.success('验证器绑定成功')
  } catch (err: any) {
    ElMessage.error(err.message || '绑定失败')
  }
}

async function deleteAccount() {
  if (!canDeleteAccount.value) return
  try {
    await ElMessageBox.confirm(
      '此操作不可撤销，确定要注销账号吗？',
      '最终确认',
      { confirmButtonText: '确认注销', cancelButtonText: '取消', type: 'error' }
    )
    // await userApi.deleteAccount(deleteConfirm.password)
    ElMessage.success('账号注销申请已提交')
    showDeleteAccountModal.value = false
    deleteConfirm.agreed = false
    deleteConfirm.password = ''
  } catch {
    // 用户取消
  }
}

onMounted(async () => {
  // 获取最新用户信息
  if (userStore.token) {
    try {
      await userStore.fetchUserInfo()
    } catch (err) {
      console.error('获取用户信息失败:', err)
    }
  }
})

onUnmounted(() => {
  // 清理定时器
  if (countdownTimer) clearInterval(countdownTimer)
  if (emailCountdownTimer) clearInterval(emailCountdownTimer)
})
</script>

<style scoped>
.security-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  padding: 32px 0;
}

.container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 0 16px;
}

/* 页面标题 */
.page-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ef4444 0%, #f59e0b 50%, #10b981 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.3);
}

.header-text h1 {
  font-size: 24px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 4px 0;
}

.header-text p {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

/* 主网格布局 */
.main-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
}

@media (min-width: 1024px) {
  .main-grid {
    grid-template-columns: 2fr 1fr;
  }
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 卡片样式 */
.section-card {
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 24px;
  border-bottom: 1px solid #f3f4f6;
}

.section-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-icon.red {
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
}

.section-icon.purple {
  background: linear-gradient(135deg, #c084fc 0%, #8b5cf6 100%);
}

.section-icon.blue {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
}

.section-icon.teal {
  background: linear-gradient(135deg, #2dd4bf 0%, #14b8a6 100%);
}

.section-icon.green {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
}

.section-icon.orange {
  background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
}

.section-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.device-count,
.view-all {
  margin-left: auto;
  font-size: 12px;
  color: #6b7280;
}

.view-all {
  cursor: pointer;
  transition: color 0.2s;
}

.view-all:hover {
  color: #4f46e5;
}

.section-body {
  padding: 0;
}

/* 安全评分卡片 */
.security-score-card {
  padding: 24px;
}

.score-content {
  display: flex;
  gap: 32px;
  align-items: center;
}

.score-circle-wrapper {
  position: relative;
  flex-shrink: 0;
}

.score-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-number {
  font-size: 36px;
  font-weight: 700;
  color: #111827;
  line-height: 1;
}

.score-label {
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
}

.score-info {
  flex: 1;
}

.score-info h3 {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.score-info > p {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 16px 0;
}

.score-tips {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
}

.tip-item .completed {
  color: #10b981;
  text-decoration: line-through;
}

/* 设置项 */
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f9fafb;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item:hover {
  background: #f9fafb;
}

.item-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.item-icon {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.item-icon.red-light {
  background: #fee2e2;
}

.item-icon.orange-light {
  background: #fef3c7;
}

.item-icon.blue-light {
  background: #dbeafe;
}

.item-icon.green-light {
  background: #d1fae5;
}

.item-icon.purple-light {
  background: #ede9fe;
}

.item-icon.teal-light {
  background: #ccfbf1;
}

.item-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.label-main {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.desc {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.action-btn {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #4f46e5;
  background: #e0e7ff;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #c7d2fe;
}

.action-btn.danger {
  color: #ef4444;
  background: #fee2e2;
}

.action-btn.danger:hover {
  background: #fecaca;
}

.action-btn.small {
  padding: 4px 10px;
  font-size: 11px;
}

/* 设备项 */
.device-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #f9fafb;
}

.device-item:last-child {
  border-bottom: none;
}

.device-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.device-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.device-icon.mobile {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
}

.device-icon.pc {
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
}

.device-icon.tablet {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
}

.device-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.device-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.device-name {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.current-badge {
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 10px;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.device-meta,
.device-browser {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

/* 历史记录项 */
.history-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 24px;
  border-bottom: 1px solid #f9fafb;
}

.history-item:last-child {
  border-bottom: none;
}

.history-item.large {
  padding: 16px 24px;
}

.history-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.history-icon.success {
  background: #d1fae5;
}

.history-icon.failed {
  background: #fee2e2;
}

.history-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.history-time {
  font-size: 13px;
  font-weight: 500;
  color: #111827;
}

.history-status {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 6px;
}

.history-status.success {
  color: #10b981;
  background: #d1fae5;
}

.history-status.failed {
  color: #ef4444;
  background: #fee2e2;
}

.history-detail {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

/* 绑定项 */
.bind-item {
  display: flex;
  align-items: center;
  padding: 14px 24px;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f9fafb;
}

.bind-item:last-child {
  border-bottom: none;
}

.bind-item:hover {
  background: #f9fafb;
}

.bind-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.bind-icon.phone {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.bind-icon.email {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.bind-icon.wechat {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.bind-icon.qq {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.bind-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.bind-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.bind-status {
  font-size: 12px;
  color: #9ca3af;
}

.bind-status.bound {
  color: #10b981;
}

.bind-item .arrow {
  color: #d1d5db;
  transition: color 0.2s;
}

.bind-item:hover .arrow {
  color: #4f46e5;
}

/* 通知项 */
.notify-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 24px;
  border-bottom: 1px solid #f9fafb;
}

.notify-item:last-child {
  border-bottom: none;
}

.notify-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

/* 危险区域卡片 */
.danger-card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #fee2e2;
}

.danger-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.danger-header span {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.danger-desc {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 16px 0;
}

.danger-btn {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  color: #ef4444;
  background: #fee2e2;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.danger-btn:hover {
  background: #fecaca;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
}

.modal-content {
  background: #fff;
  border-radius: 24px;
  padding: 32px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  max-width: 400px;
  width: 100%;
}

.modal-small {
  max-width: 400px;
  text-align: left;
}

.modal-large {
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  text-align: left;
}

.modal-header.danger h3 {
  color: #ef4444;
}

.modal-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-icon.red {
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
}

.modal-icon.orange {
  background: linear-gradient(135deg, #fb923c 0%, #f59e0b 100%);
}

.modal-icon.green {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
}

.modal-icon.blue {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
}

.modal-icon.purple {
  background: linear-gradient(135deg, #c084fc 0%, #8b5cf6 100%);
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #6b7280;
}

.strength-bar {
  flex: 1;
  height: 6px;
  background: #f3f4f6;
  border-radius: 3px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s, background 0.3s;
}

.code-input-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.code-input-row .el-input {
  flex: 1;
}

.btn-send-code {
  padding: 0 16px;
  height: 40px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.btn-send-code:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-send-code:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: #9ca3af;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn-secondary {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);
  transition: box-shadow 0.2s;
}

.btn-primary:hover {
  box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-danger {
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.2);
  transition: box-shadow 0.2s;
}

.btn-danger:hover:not(:disabled) {
  box-shadow: 0 10px 15px -3px rgba(239, 68, 68, 0.3);
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  box-shadow: none;
}

/* 验证器内容 */
.authenticator-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}

.qr-code-wrapper {
  text-align: center;
}

.qr-code {
  width: 160px;
  height: 160px;
  background: #f9fafb;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.qr-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.qr-tip {
  font-size: 12px;
  color: #9ca3af;
  margin: 0;
}

.secret-key {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: #f3f4f6;
  border-radius: 10px;
}

.key-label {
  font-size: 12px;
  color: #6b7280;
}

.key-value {
  font-family: monospace;
  font-size: 13px;
  color: #111827;
  background: #fff;
  padding: 2px 8px;
  border-radius: 4px;
}

.copy-btn {
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;
}

.copy-btn:hover {
  color: #4f46e5;
}

/* 历史记录列表 */
.history-list {
  max-height: 400px;
  overflow-y: auto;
}

/* 注销账号内容 */
.delete-account-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.warning-box {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #fef3c7;
  border-radius: 10px;
}

.warning-box p {
  font-size: 13px;
  color: #92400e;
  margin: 0;
  line-height: 1.5;
}

.delete-list {
  margin: 0;
  padding-left: 20px;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.8;
}

.delete-list li {
  margin-bottom: 4px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .score-content {
    flex-direction: column;
    text-align: center;
  }

  .score-tips {
    align-items: flex-start;
  }

  .device-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .device-item .action-btn {
    align-self: flex-end;
  }
}
</style>