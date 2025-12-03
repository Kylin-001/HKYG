<template>
  <div class="merchant-settings">
    <!-- 页面头部 -->
    <div class="page-header">
      <h2>店铺设置</h2>
      <div class="header-actions">
        <el-button @click="resetForm">重置</el-button>
        <el-button type="primary" @click="saveSettings">保存设置</el-button>
      </div>
    </div>

    <!-- 设置选项卡 -->
    <el-card class="settings-card">
      <el-tabs v-model="activeTab" @tab-click="handleTabChange">
        <!-- 基本信息 -->
        <el-tab-pane label="基本信息" name="basic">
          <div class="tab-content">
            <el-form ref="basicForm" :model="basicSettings" :rules="basicRules" label-width="100px">
              <!-- 店铺头像 -->
              <el-form-item label="店铺头像">
                <el-upload
                  class="avatar-uploader"
                  action=""
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="basicSettings.avatar" :src="basicSettings.avatar" class="avatar" />
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <div class="upload-tip">支持 JPG/PNG 格式，建议尺寸 200x200px</div>
              </el-form-item>

              <!-- 店铺封面 -->
              <el-form-item label="店铺封面">
                <el-upload
                  class="cover-uploader"
                  action=""
                  :show-file-list="false"
                  :before-upload="beforeCoverUpload"
                >
                  <img v-if="basicSettings.cover" :src="basicSettings.cover" class="cover-image" />
                  <div v-else class="cover-placeholder">
                    <i class="el-icon-plus"></i>
                    <span>上传店铺封面</span>
                  </div>
                </el-upload>
                <div class="upload-tip">支持 JPG/PNG 格式，建议尺寸 750x300px</div>
              </el-form-item>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="店铺名称" prop="name">
                    <el-input v-model="basicSettings.name" placeholder="请输入店铺名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="店铺类型" prop="category">
                    <el-select v-model="basicSettings.category" placeholder="选择店铺类型">
                      <el-option label="中式快餐" value="中式快餐"></el-option>
                      <el-option label="西式料理" value="西式料理"></el-option>
                      <el-option label="日韩料理" value="日韩料理"></el-option>
                      <el-option label="饮品甜点" value="饮品甜点"></el-option>
                      <el-option label="小吃烧烤" value="小吃烧烤"></el-option>
                      <el-option label="海鲜类" value="海鲜类"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="店铺简介" prop="description">
                <el-input
                  v-model="basicSettings.description"
                  type="textarea"
                  :rows="4"
                  placeholder="请输入店铺简介，50字以内"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="联系电话" prop="phone">
                    <el-input v-model="basicSettings.phone" placeholder="请输入联系电话"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="营业时间" prop="businessHours">
                    <el-time-picker
                      v-model="basicSettings.businessHours"
                      is-range
                      range-separator="至"
                      start-placeholder="开始时间"
                      end-placeholder="结束时间"
                      format="HH:mm"
                      value-format="HH:mm"
                    />
                  </el-form-item>
                </el-col>
              </el-row>

              <el-form-item label="店铺地址" prop="address">
                <el-input v-model="basicSettings.address" placeholder="请输入详细地址"></el-input>
              </el-form-item>

              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="经度" prop="longitude">
                    <el-input v-model="basicSettings.longitude" placeholder="请输入经度"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="纬度" prop="latitude">
                    <el-input v-model="basicSettings.latitude" placeholder="请输入纬度"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <!-- 配送信息 -->
              <el-form-item label="配送设置">
                <div class="delivery-settings">
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-form-item label="配送方式">
                        <el-checkbox-group v-model="basicSettings.deliveryMethods">
                          <el-checkbox label="外卖配送">外卖配送</el-checkbox>
                          <el-checkbox label="到店自取">到店自取</el-checkbox>
                        </el-checkbox-group>
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="配送费" prop="deliveryFee">
                        <el-input-number
                          v-model="basicSettings.deliveryFee"
                          :min="0"
                          :step="0.5"
                          :precision="2"
                          placeholder="配送费"
                        />
                        元
                      </el-form-item>
                    </el-col>
                    <el-col :span="8">
                      <el-form-item label="起送金额" prop="minOrderAmount">
                        <el-input-number
                          v-model="basicSettings.minOrderAmount"
                          :min="0"
                          :step="1"
                          placeholder="起送金额"
                        />
                        元
                      </el-form-item>
                    </el-col>
                  </el-row>

                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="配送距离">
                        <el-input-number
                          v-model="basicSettings.deliveryDistance"
                          :min="0.5"
                          :step="0.5"
                          placeholder="最大配送距离"
                        />
                        公里
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="预计送达">
                        <el-input-number
                          v-model="basicSettings.estimatedDeliveryTime"
                          :min="15"
                          :step="5"
                          placeholder="预计送达时间"
                        />
                        分钟
                      </el-form-item>
                    </el-col>
                  </el-row>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 营业状态 -->
        <el-tab-pane label="营业状态" name="status">
          <div class="tab-content">
            <el-form label-width="120px">
              <!-- 营业状态切换 -->
              <el-form-item label="当前状态">
                <el-switch
                  v-model="statusSettings.isOpen"
                  active-text="营业中"
                  inactive-text="已打烊"
                  @change="handleStatusChange"
                />
                <div class="status-description">
                  <i class="el-icon-info"></i>
                  切换营业状态将影响店铺在用户端的展示和可下单状态
                </div>
              </el-form-item>

              <!-- 营业时间管理 -->
              <el-form-item label="营业时间">
                <div class="business-hours-settings">
                  <div class="hours-section">
                    <h4>每周营业时间</h4>
                    <div class="week-schedule">
                      <div
                        v-for="day in weekDays"
                        :key="day.value"
                        class="day-schedule"
                        :class="{ closed: !day.isOpen }"
                      >
                        <div class="day-info">
                          <span class="day-name">{{ day.label }}</span>
                          <el-switch
                            v-model="day.isOpen"
                            size="mini"
                            @change="updateWeekSchedule"
                          />
                        </div>
                        <div v-if="day.isOpen" class="time-range">
                          <el-time-picker
                            v-model="day.openTime"
                            format="HH:mm"
                            value-format="HH:mm"
                            size="mini"
                            placeholder="开始时间"
                          />
                          <span>至</span>
                          <el-time-picker
                            v-model="day.closeTime"
                            format="HH:mm"
                            value-format="HH:mm"
                            size="mini"
                            placeholder="结束时间"
                          />
                        </div>
                        <div v-else class="closed-label">休息</div>
                      </div>
                    </div>
                  </div>

                  <!-- 特殊情况设置 -->
                  <div class="special-settings">
                    <h4>特殊情况设置</h4>
                    <el-form-item label="临时休息">
                      <el-date-picker
                        v-model="statusSettings.breakDate"
                        type="date"
                        placeholder="选择休息日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                      />
                      <el-button
                        type="warning"
                        size="mini"
                        @click="addBreakDate"
                        style="margin-left: 10px"
                      >
                        添加休息日
                      </el-button>
                    </el-form-item>

                    <div v-if="statusSettings.breakDates.length > 0" class="break-dates">
                      <el-tag
                        v-for="(date, index) in statusSettings.breakDates"
                        :key="index"
                        closable
                        @close="removeBreakDate(index)"
                        type="warning"
                      >
                        {{ date }}
                      </el-tag>
                    </div>
                  </div>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 通知设置 -->
        <el-tab-pane label="通知设置" name="notifications">
          <div class="tab-content">
            <el-form label-width="150px">
              <el-form-item label="订单通知">
                <el-switch
                  v-model="notificationSettings.newOrder"
                  active-text="开启"
                  inactive-text="关闭"
                />
                <div class="setting-description">新订单到达时的通知提醒</div>
              </el-form-item>

              <el-form-item label="取消订单通知">
                <el-switch
                  v-model="notificationSettings.cancelledOrder"
                  active-text="开启"
                  inactive-text="关闭"
                />
                <div class="setting-description">用户取消订单时的通知提醒</div>
              </el-form-item>

              <el-form-item label="退款申请通知">
                <el-switch
                  v-model="notificationSettings.refundRequest"
                  active-text="开启"
                  inactive-text="off"
                />
                <div class="setting-description">用户申请退款时的通知提醒</div>
              </el-form-item>

              <el-form-item label="库存不足通知">
                <el-switch
                  v-model="notificationSettings.lowStock"
                  active-text="开启"
                  inactive-text="关闭"
                />
                <div class="setting-description">商品库存不足时的提醒通知</div>
              </el-form-item>

              <el-form-item label="营业时间变更">
                <el-switch
                  v-model="notificationSettings.businessHoursChange"
                  active-text="开启"
                  inactive-text="关闭"
                />
                <div class="setting-description">营业时间调整后的确认通知</div>
              </el-form-item>

              <!-- 通知方式 -->
              <el-divider>通知方式</el-divider>

              <el-form-item label="手机通知">
                <el-switch
                  v-model="notificationSettings.phoneNotify"
                  active-text="开启"
                  inactive-text="关闭"
                />
                <el-input
                  v-model="notificationSettings.phone"
                  placeholder="请输入手机号码"
                  style="width: 200px; margin-left: 10px"
                />
                <div class="setting-description">通过短信方式接收重要通知</div>
              </el-form-item>

              <el-form-item label="邮箱通知">
                <el-switch
                  v-model="notificationSettings.emailNotify"
                  active-text="开启"
                  inactive-text="关闭"
                />
                <el-input
                  v-model="notificationSettings.email"
                  placeholder="请输入邮箱地址"
                  style="width: 200px; margin-left: 10px"
                />
                <div class="setting-description">通过邮件方式接收详细报告</div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 支付设置 -->
        <el-tab-pane label="支付设置" name="payment">
          <div class="tab-content">
            <el-form label-width="150px">
              <!-- 支付方式 -->
              <el-form-item label="收款方式">
                <el-checkbox-group v-model="paymentSettings.paymentMethods">
                  <el-checkbox label="微信支付">微信支付</el-checkbox>
                  <el-checkbox label="支付宝">支付宝</el-checkbox>
                  <el-checkbox label="现金支付">现金支付（到店自取）</el-checkbox>
                </el-checkbox-group>
              </el-form-item>

              <!-- 银行卡信息 -->
              <el-form-item label="银行卡信息">
                <div class="bank-info">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <el-form-item label="开户行">
                        <el-input
                          v-model="paymentSettings.bankInfo.bankName"
                          placeholder="请输入开户银行"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item label="账户名">
                        <el-input
                          v-model="paymentSettings.bankInfo.accountName"
                          placeholder="请输入账户名称"
                        ></el-input>
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-form-item label="卡号">
                    <el-input
                      v-model="paymentSettings.bankInfo.accountNumber"
                      placeholder="请输入银行卡号"
                      maxlength="19"
                    />
                  </el-form-item>
                </div>
              </el-form-item>

              <!-- 提现设置 -->
              <el-divider>提现设置</el-divider>

              <el-form-item label="自动提现">
                <el-switch
                  v-model="paymentSettings.autoWithdraw"
                  active-text="开启"
                  inactive-text="关闭"
                />
                <div class="setting-description">自动将订单收入提现到绑定银行卡</div>
              </el-form-item>

              <el-form-item label="提现频率">
                <el-select v-model="paymentSettings.withdrawFrequency" placeholder="选择提现频率">
                  <el-option label="每日" value="每日"></el-option>
                  <el-option label="每周" value="每周"></el-option>
                  <el-option label="每月" value="每月"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="最低提现金额">
                <el-input-number
                  v-model="paymentSettings.minWithdrawAmount"
                  :min="1"
                  :step="10"
                  placeholder="最低提现金额"
                />
                元
                <div class="setting-description">当可用余额超过此金额时触发提现</div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>

        <!-- 安全设置 -->
        <el-tab-pane label="安全设置" name="security">
          <div class="tab-content">
            <el-form label-width="120px">
              <!-- 密码修改 -->
              <el-form-item label="登录密码">
                <el-button type="primary" @click="showPasswordDialog = true">修改密码</el-button>
                <div class="setting-description">定期更换密码可以提高账户安全性</div>
              </el-form-item>

              <!-- 手机号绑定 -->
              <el-form-item label="绑定手机">
                <el-input v-model="securitySettings.phone" placeholder="请输入手机号码" readonly />
                <el-button type="text" @click="showPhoneDialog = true" style="margin-left: 10px">
                  修改
                </el-button>
              </el-form-item>

              <!-- 邮箱绑定 -->
              <el-form-item label="绑定邮箱">
                <el-input v-model="securitySettings.email" placeholder="请输入邮箱地址" readonly />
                <el-button type="text" @click="showEmailDialog = true" style="margin-left: 10px">
                  修改
                </el-button>
              </el-form-item>

              <!-- 实名认证 -->
              <el-divider>实名认证</el-divider>

              <el-form-item label="认证状态">
                <div class="certification-status">
                  <el-tag
                    :type="
                      securitySettings.certificationStatus === '已认证' ? 'success' : 'warning'
                    "
                  >
                    {{ securitySettings.certificationStatus }}
                  </el-tag>
                  <el-button
                    v-if="securitySettings.certificationStatus !== '已认证'"
                    type="primary"
                    size="small"
                    @click="startCertification"
                    style="margin-left: 10px"
                  >
                    立即认证
                  </el-button>
                </div>
                <div class="setting-description">完成实名认证才能正常经营</div>
              </el-form-item>

              <!-- 操作日志 -->
              <el-divider>安全日志</el-divider>

              <el-form-item label="登录记录">
                <el-button @click="viewLoginLog">查看登录日志</el-button>
                <div class="setting-description">查看近期的登录记录和异常登录</div>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 修改密码对话框 -->
    <el-dialog title="修改登录密码" v-model="showPasswordDialog" width="500px">
      <el-form
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordFormRef"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入原密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
          ></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="showPasswordDialog = false">取消</el-button>
        <el-button type="primary" @click="changePassword">确认修改</el-button>
      </template>
    </el-dialog>

    <!-- 修改手机号对话框 -->
    <el-dialog title="修改手机号" v-model="showPhoneDialog" width="500px">
      <el-form :model="phoneForm" :rules="phoneRules" ref="phoneFormRef" label-width="100px">
        <el-form-item label="原手机号">
          <el-input :value="securitySettings.phone" readonly></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="phoneForm.code" placeholder="请输入验证码"></el-input>
          <el-button
            type="primary"
            size="mini"
            @click="sendSmsCode"
            :disabled="smsCountdown > 0"
            style="margin-left: 10px"
          >
            {{ smsCountdown > 0 ? `${smsCountdown}秒后重发` : '发送验证码' }}
          </el-button>
        </el-form-item>
        <el-form-item label="新手机号" prop="newPhone">
          <el-input v-model="phoneForm.newPhone" placeholder="请输入新手机号"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="showPhoneDialog = false">取消</el-button>
        <el-button type="primary" @click="changePhone">确认修改</el-button>
      </template>
    </el-dialog>

    <!-- 修改邮箱对话框 -->
    <el-dialog title="修改邮箱" v-model="showEmailDialog" width="500px">
      <el-form :model="emailForm" :rules="emailRules" ref="emailFormRef" label-width="100px">
        <el-form-item label="原邮箱">
          <el-input :value="securitySettings.email" readonly></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="emailForm.code" placeholder="请输入验证码"></el-input>
          <el-button
            type="primary"
            size="mini"
            @click="sendEmailCode"
            :disabled="emailCountdown > 0"
            style="margin-left: 10px"
          >
            {{ emailCountdown > 0 ? `${emailCountdown}秒后重发` : '发送验证码' }}
          </el-button>
        </el-form-item>
        <el-form-item label="新邮箱" prop="newEmail">
          <el-input v-model="emailForm.newEmail" placeholder="请输入新邮箱地址"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button @click="showEmailDialog = false">取消</el-button>
        <el-button type="primary" @click="changeEmail">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance } from 'element-plus'

// 类型定义
interface BankInfo {
  bankName: string
  accountName: string
  accountNumber: string
}

interface BasicSettings {
  avatar: string
  cover: string
  name: string
  category: string
  description: string
  phone: string
  businessHours: string[]
  address: string
  longitude: string
  latitude: string
  deliveryMethods: string[]
  deliveryFee: number
  minOrderAmount: number
  deliveryDistance: number
  estimatedDeliveryTime: number
}

interface StatusSettings {
  isOpen: boolean
  breakDate: string
  breakDates: string[]
}

interface WeekDay {
  label: string
  value: number
  isOpen: boolean
  openTime: string
  closeTime: string
}

interface NotificationSettings {
  newOrder: boolean
  cancelledOrder: boolean
  refundRequest: boolean
  lowStock: boolean
  businessHoursChange: boolean
  phoneNotify: boolean
  phone: string
  emailNotify: boolean
  email: string
}

interface PaymentSettings {
  paymentMethods: string[]
  bankInfo: BankInfo
  autoWithdraw: boolean
  withdrawFrequency: string
  minWithdrawAmount: number
}

interface SecuritySettings {
  phone: string
  email: string
  certificationStatus: string
}

interface PasswordForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

interface PhoneForm {
  code: string
  newPhone: string
}

interface EmailForm {
  code: string
  newEmail: string
}

// 响应式数据
const activeTab = ref('basic')
const showPasswordDialog = ref(false)
const showPhoneDialog = ref(false)
const showEmailDialog = ref(false)
const smsCountdown = ref(0)
const emailCountdown = ref(0)

// 表单引用
const passwordFormRef = ref<FormInstance | null>(null)
const phoneFormRef = ref<FormInstance | null>(null)
const emailFormRef = ref<FormInstance | null>(null)

// 基本信息设置
const basicSettings = reactive<BasicSettings>({
  avatar: '',
  cover: '',
  name: '老李面馆',
  category: '中式快餐',
  description:
    '传承传统手工拉面工艺，为您提供正宗的兰州拉面。精选上等面粉，配合祖传拉面手法，每一根面条都劲道十足。',
  phone: '13888888888',
  businessHours: ['09:00', '21:00'],
  address: '北京市朝阳区三里屯街道工体北路2号',
  longitude: '116.443789',
  latitude: '39.928895',
  deliveryMethods: ['外卖配送', '到店自取'],
  deliveryFee: 3.0,
  minOrderAmount: 20.0,
  deliveryDistance: 5.0,
  estimatedDeliveryTime: 30,
})

const basicRules = reactive({
  name: [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
  category: [{ required: true, message: '请选择店铺类型', trigger: 'change' }],
  description: [{ required: true, message: '请输入店铺简介', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入联系电话', trigger: 'blur' }],
  businessHours: [{ required: true, message: '请设置营业时间', trigger: 'change' }],
  address: [{ required: true, message: '请输入店铺地址', trigger: 'blur' }],
})

// 营业状态设置
const statusSettings = reactive<StatusSettings>({
  isOpen: true,
  breakDate: '',
  breakDates: ['2024-12-25', '2024-01-01'],
})

const weekDays = reactive<WeekDay[]>([
  { label: '周一', value: 1, isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { label: '周二', value: 2, isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { label: '周三', value: 3, isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { label: '周四', value: 4, isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { label: '周五', value: 5, isOpen: true, openTime: '09:00', closeTime: '21:00' },
  { label: '周六', value: 6, isOpen: true, openTime: '09:00', closeTime: '22:00' },
  { label: '周日', value: 7, isOpen: true, openTime: '09:00', closeTime: '22:00' },
])

// 通知设置
const notificationSettings = reactive<NotificationSettings>({
  newOrder: true,
  cancelledOrder: true,
  refundRequest: true,
  lowStock: true,
  businessHoursChange: true,
  phoneNotify: true,
  phone: '13888888888',
  emailNotify: false,
  email: '',
})

// 支付设置
const paymentSettings = reactive<PaymentSettings>({
  paymentMethods: ['微信支付', '支付宝'],
  bankInfo: {
    bankName: '中国工商银行',
    accountName: '李明',
    accountNumber: '6222000012345678901',
  },
  autoWithdraw: true,
  withdrawFrequency: '每周',
  minWithdrawAmount: 100,
})

// 安全设置
const securitySettings = reactive<SecuritySettings>({
  phone: '13888888888',
  email: 'merchant@example.com',
  certificationStatus: '已认证',
})

// 密码修改表单
const passwordForm = reactive<PasswordForm>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordRules = reactive({
  oldPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
})

// 手机号修改表单
const phoneForm = reactive<PhoneForm>({
  code: '',
  newPhone: '',
})

const phoneRules = reactive({
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  newPhone: [
    { required: true, message: '请输入新手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' },
  ],
})

// 邮箱修改表单
const emailForm = reactive<EmailForm>({
  code: '',
  newEmail: '',
})

const emailRules = reactive({
  code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
  newEmail: [
    { required: true, message: '请输入新邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' },
  ],
})

// 处理Tab切换
const handleTabChange = (tab: any) => {
  activeTab.value = tab.name
}

// 重置表单
const resetForm = () => {
  ElMessageBox.confirm('确定要重置所有设置吗？', '提示', {
    confirmButtonText: '确定重置',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    loadSettings()
    ElMessage.success('设置已重置')
  })
}

// 保存设置
const saveSettings = () => {
  ElMessage.success('设置保存成功')
}

// 加载设置
const loadSettings = () => {
  // 加载设置数据
  Object.assign(basicSettings, { ...basicSettings })
  Object.assign(statusSettings, { ...statusSettings })
  Object.assign(notificationSettings, { ...notificationSettings })
  Object.assign(paymentSettings, { ...paymentSettings })
  Object.assign(securitySettings, { ...securitySettings })
}

// 图片上传前处理
const beforeAvatarUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isJPG) {
    ElMessage.error('上传头像只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('上传头像大小不能超过 2MB!')
    return false
  }

  ElMessage.success('头像上传功能开发中...')
  return false
}

const beforeCoverUpload = (file: File) => {
  const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
  const isLt5M = file.size / 1024 / 1024 < 5

  if (!isJPG) {
    ElMessage.error('上传封面只能是 JPG/PNG 格式!')
    return false
  }
  if (!isLt5M) {
    ElMessage.error('上传封面大小不能超过 5MB!')
    return false
  }

  ElMessage.success('封面上传功能开发中...')
  return false
}

// 营业状态切换
const handleStatusChange = (newStatus: boolean) => {
  ElMessage.success(`店铺已${newStatus ? '开始营业' : '停止营业'}`)
}

// 更新周营业时间
const updateWeekSchedule = () => {
  ElMessage.success('营业时间已更新')
}

// 添加休息日
const addBreakDate = () => {
  if (statusSettings.breakDate) {
    statusSettings.breakDates.push(statusSettings.breakDate)
    statusSettings.breakDate = ''
    ElMessage.success('休息日已添加')
  }
}

// 移除休息日
const removeBreakDate = (index: number) => {
  statusSettings.breakDates.splice(index, 1)
}

// 开始实名认证
const startCertification = () => {
  ElMessage.info('实名认证功能开发中...')
}

// 查看登录日志
const viewLoginLog = () => {
  ElMessage.info('登录日志查看功能开发中...')
}

// 修改密码
const changePassword = () => {
  passwordFormRef.value?.validate(valid => {
    if (valid) {
      showPasswordDialog.value = false
      ElMessage.success('密码修改成功')
      Object.assign(passwordForm, {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    }
  })
}

// 发送短信验证码
const sendSmsCode = () => {
  if (smsCountdown.value > 0) return

  smsCountdown.value = 60
  const timer = setInterval(() => {
    smsCountdown.value--
    if (smsCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)

  ElMessage.success('验证码已发送')
}

// 发送邮箱验证码
const sendEmailCode = () => {
  if (emailCountdown.value > 0) return

  emailCountdown.value = 60
  const timer = setInterval(() => {
    emailCountdown.value--
    if (emailCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)

  ElMessage.success('验证码已发送')
}

// 修改手机号
const changePhone = () => {
  phoneFormRef.value?.validate(valid => {
    if (valid) {
      showPhoneDialog.value = false
      securitySettings.phone = phoneForm.newPhone
      Object.assign(phoneForm, {
        code: '',
        newPhone: '',
      })
      ElMessage.success('手机号修改成功')
    }
  })
}

// 修改邮箱
const changeEmail = () => {
  emailFormRef.value?.validate(valid => {
    if (valid) {
      showEmailDialog.value = false
      securitySettings.email = emailForm.newEmail
      Object.assign(emailForm, {
        code: '',
        newEmail: '',
      })
      ElMessage.success('邮箱修改成功')
    }
  })
}

// 组件挂载时加载设置
onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.merchant-settings {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.settings-card {
  border-radius: 8px;
  border: none;
}

.tab-content {
  padding: 20px 0;
}

/* 头像上传 */
.avatar-uploader {
  width: 120px;
  height: 120px;
  border: 1px dashed #dcdfe6;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

/* 封面上传 */
.cover-uploader {
  width: 300px;
  height: 120px;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  border: 2px dashed #dcdfe6;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #999;
  cursor: pointer;
}

.cover-placeholder i {
  font-size: 30px;
  margin-bottom: 5px;
}

.upload-tip {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

/* 配送设置 */
.delivery-settings {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
}

.delivery-settings .el-form-item {
  margin-bottom: 0;
}

/* 营业时间设置 */
.business-hours-settings {
  width: 100%;
}

.hours-section {
  margin-bottom: 30px;
}

.hours-section h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.week-schedule {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
}

.day-schedule {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.day-schedule:last-child {
  border-bottom: none;
}

.day-schedule.closed {
  opacity: 0.6;
}

.day-info {
  width: 80px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.day-name {
  font-weight: bold;
  color: #333;
}

.time-range {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
}

.time-range .el-time-picker {
  width: 120px;
}

.closed-label {
  color: #999;
  font-style: italic;
}

.special-settings {
  margin-top: 20px;
}

.special-settings h4 {
  margin: 0 0 15px 0;
  color: #333;
}

.break-dates {
  margin-top: 10px;
}

.break-dates .el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

/* 状态描述 */
.status-description {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.setting-description {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}

/* 银行卡信息 */
.bank-info {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
}

.bank-info .el-form-item {
  margin-bottom: 0;
}

/* 认证状态 */
.certification-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .merchant-settings {
    padding: 10px;
  }

  .page-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .cover-uploader {
    width: 100%;
    max-width: 300px;
  }

  .week-schedule {
    padding: 10px;
  }

  .day-schedule {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .day-info {
    width: auto;
  }

  .time-range {
    width: 100%;
    justify-content: center;
  }

  .bank-info .el-row {
    flex-direction: column;
  }

  .bank-info .el-col {
    width: 100%;
  }
}
</style>
