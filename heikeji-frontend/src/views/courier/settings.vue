<template>
  <div class="courier-settings">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <h1>
          <i class="el-icon-setting"></i>
          个人设置
        </h1>
        <p>管理您的个人信息和配送偏好设置</p>
      </div>
    </div>

    <el-row :gutter="20">
      <!-- 侧边栏 -->
      <el-col :span="6">
        <el-card class="sidebar-card">
          <div class="sidebar">
            <div class="profile-section">
              <el-avatar :size="80" :src="courierProfile.avatar" class="profile-avatar">
                <i class="el-icon-user-solid"></i>
              </el-avatar>
              <h3>{{ courierProfile.name }}</h3>
              <p class="courier-id">配送员ID: {{ courierProfile.id }}</p>
            </div>
            <el-menu
              :default-active="activeMenuItem"
              @select="handleMenuSelect"
              class="sidebar-menu"
            >
              <el-menu-item index="personal">
                <i class="el-icon-user"></i>
                <span>个人信息</span>
              </el-menu-item>
              <el-menu-item index="vehicle">
                <i class="el-icon-truck"></i>
                <span>车辆信息</span>
              </el-menu-item>
              <el-menu-item index="delivery">
                <i class="el-icon-location-outline"></i>
                <span>配送偏好</span>
              </el-menu-item>
              <el-menu-item index="notifications">
                <i class="el-icon-bell"></i>
                <span>通知设置</span>
              </el-menu-item>
              <el-menu-item index="security">
                <i class="el-icon-lock"></i>
                <span>安全设置</span>
              </el-menu-item>
              <el-menu-item index="feedback">
                <i class="el-icon-chat-dot-round"></i>
                <span>意见反馈</span>
              </el-menu-item>
            </el-menu>
          </div>
        </el-card>
      </el-col>

      <!-- 主内容区 -->
      <el-col :span="18">
        <!-- 个人信息 -->
        <el-card class="content-card" v-if="activeMenuItem === 'personal'">
          <div v-slot:header>
            <span>个人信息</span>
            <el-button
              type="primary"
              size="mini"
              @click="editMode = !editMode"
              :icon="editMode ? 'el-icon-view' : 'el-icon-edit'"
            >
              {{ editMode ? '查看' : '编辑' }}
            </el-button>
          </div>

          <el-form
            :model="courierProfile"
            :rules="profileRules"
            ref="profileForm"
            label-width="120px"
            :disabled="!editMode"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="真实姓名" prop="name">
                  <el-input v-model="courierProfile.name" :disabled="!editMode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="身份证号" prop="idCard">
                  <el-input v-model="courierProfile.idCard" :disabled="!editMode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="手机号码" prop="phone">
                  <el-input v-model="courierProfile.phone" :disabled="!editMode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="紧急联系人" prop="emergencyContact">
                  <el-input
                    v-model="courierProfile.emergencyContact"
                    :disabled="!editMode"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="紧急联系电话" prop="emergencyPhone">
                  <el-input
                    v-model="courierProfile.emergencyPhone"
                    :disabled="!editMode"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="入职时间">
                  <el-input :value="courierProfile.joinDate" disabled></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="现居住地址" prop="address">
              <el-input
                v-model="courierProfile.address"
                type="textarea"
                :rows="3"
                :disabled="!editMode"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button v-if="editMode" type="primary" @click="saveProfile" :loading="saving">
                保存修改
              </el-button>
              <el-button v-if="editMode" @click="cancelEdit">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 车辆信息 -->
        <el-card class="content-card" v-if="activeMenuItem === 'vehicle'">
          <div v-slot:header>
            <span>车辆信息</span>
            <el-button
              type="primary"
              size="mini"
              @click="vehicleEditMode = !vehicleEditMode"
              :icon="vehicleEditMode ? 'el-icon-view' : 'el-icon-edit'"
            >
              {{ vehicleEditMode ? '查看' : '编辑' }}
            </el-button>
          </div>

          <el-form
            :model="vehicleInfo"
            :rules="vehicleRules"
            ref="vehicleForm"
            label-width="120px"
            :disabled="!vehicleEditMode"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="车辆类型" prop="type">
                  <el-select
                    v-model="vehicleInfo.type"
                    placeholder="选择车辆类型"
                    :disabled="!vehicleEditMode"
                  >
                    <el-option label="电动车" value="electric-bike"></el-option>
                    <el-option label="摩托车" value="motorcycle"></el-option>
                    <el-option label="自行车" value="bicycle"></el-option>
                    <el-option label="汽车" value="car"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车辆品牌" prop="brand">
                  <el-input v-model="vehicleInfo.brand" :disabled="!vehicleEditMode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="车牌号码" prop="plateNumber">
                  <el-input
                    v-model="vehicleInfo.plateNumber"
                    :disabled="!vehicleEditMode"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="车辆颜色" prop="color">
                  <el-input v-model="vehicleInfo.color" :disabled="!vehicleEditMode"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="保险到期时间" prop="insuranceExpiry">
                  <el-date-picker
                    v-model="vehicleInfo.insuranceExpiry"
                    type="date"
                    placeholder="选择日期"
                    :disabled="!vehicleEditMode"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="年检到期时间" prop="inspectionExpiry">
                  <el-date-picker
                    v-model="vehicleInfo.inspectionExpiry"
                    type="date"
                    placeholder="选择日期"
                    :disabled="!vehicleEditMode"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="车辆照片">
              <div class="vehicle-photos">
                <div class="photo-item" v-for="(photo, index) in vehicleInfo.photos" :key="index">
                  <img :src="photo" class="vehicle-photo" />
                  <el-button
                    v-if="vehicleEditMode"
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    circle
                    @click="removePhoto(index)"
                  ></el-button>
                </div>
                <el-upload
                  v-if="vehicleEditMode"
                  class="photo-upload"
                  :show-file-list="false"
                  accept="image/*"
                  :before-upload="handlePhotoUpload"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                v-if="vehicleEditMode"
                type="primary"
                @click="saveVehicleInfo"
                :loading="saving"
              >
                保存修改
              </el-button>
              <el-button v-if="vehicleEditMode" @click="cancelVehicleEdit">取消</el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 配送偏好 -->
        <el-card class="content-card" v-if="activeMenuItem === 'delivery'">
          <div v-slot:header>
            <span>配送偏好</span>
          </div>

          <el-form label-width="150px">
            <el-form-item label="接单模式">
              <el-radio-group v-model="deliveryPreferences.acceptMode">
                <el-radio label="manual">手动接单</el-radio>
                <el-radio label="auto">自动接单</el-radio>
                <el-radio label="semi-auto">半自动接单</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="最大配送距离">
              <el-slider
                v-model="deliveryPreferences.maxDistance"
                :min="1"
                :max="10"
                show-stops
                show-input
                :format-tooltip="formatDistanceTooltip"
              ></el-slider>
            </el-form-item>

            <el-form-item label="配送类型偏好">
              <el-checkbox-group v-model="deliveryPreferences.preferredTypes">
                <el-checkbox label="takeout">外卖配送</el-checkbox>
                <el-checkbox label="pickup">取快递</el-checkbox>
                <el-checkbox label="buy">代购商品</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item label="服务时间段">
              <div class="time-selector">
                <div
                  class="time-row"
                  v-for="(timeSlot, index) in deliveryPreferences.timeSlots"
                  :key="index"
                >
                  <el-time-picker
                    v-model="timeSlot.start"
                    placeholder="开始时间"
                    format="HH:mm"
                  ></el-time-picker>
                  <span class="time-separator">至</span>
                  <el-time-picker
                    v-model="timeSlot.end"
                    placeholder="结束时间"
                    format="HH:mm"
                  ></el-time-picker>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    circle
                    @click="removeTimeSlot(index)"
                  ></el-button>
                </div>
                <el-button type="text" @click="addTimeSlot">
                  <i class="el-icon-plus"></i>
                  添加时间段
                </el-button>
              </div>
            </el-form-item>

            <el-form-item label="特殊服务能力">
              <el-checkbox-group v-model="deliveryPreferences.specialServices">
                <el-checkbox label="fragile">易碎物品</el-checkbox>
                <el-checkbox label="cold-chain">冷链配送</el-checkbox>
                <el-checkbox label="heavy">大件物品</el-checkbox>
                <el-checkbox label="urgent">紧急配送</el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="saveDeliveryPreferences" :loading="saving">
                保存设置
              </el-button>
            </el-form-item>
          </el-form>
        </el-card>

        <!-- 通知设置 -->
        <el-card class="content-card" v-if="activeMenuItem === 'notifications'">
          <div v-slot:header>
            <span>通知设置</span>
          </div>

          <div class="notification-settings">
            <div class="setting-group">
              <h4>订单通知</h4>
              <div class="setting-item">
                <label>新订单提醒</label>
                <el-switch v-model="notificationSettings.newOrderAlert"></el-switch>
              </div>
              <div class="setting-item">
                <label>订单状态变化</label>
                <el-switch v-model="notificationSettings.orderStatusChange"></el-switch>
              </div>
              <div class="setting-item">
                <label>客户取消订单</label>
                <el-switch v-model="notificationSettings.orderCancelled"></el-switch>
              </div>
            </div>

            <div class="setting-group">
              <h4>系统通知</h4>
              <div class="setting-item">
                <label>系统公告</label>
                <el-switch v-model="notificationSettings.systemAnnouncement"></el-switch>
              </div>
              <div class="setting-item">
                <label>版本更新</label>
                <el-switch v-model="notificationSettings.versionUpdate"></el-switch>
              </div>
              <div class="setting-item">
                <label>账户余额提醒</label>
                <el-switch v-model="notificationSettings.balanceAlert"></el-switch>
              </div>
            </div>

            <div class="setting-group">
              <h4>通知方式</h4>
              <div class="setting-item">
                <label>手机推送</label>
                <el-switch v-model="notificationSettings.pushNotification"></el-switch>
              </div>
              <div class="setting-item">
                <label>短信通知</label>
                <el-switch v-model="notificationSettings.smsNotification"></el-switch>
              </div>
              <div class="setting-item">
                <label>语音提醒</label>
                <el-switch v-model="notificationSettings.voiceAlert"></el-switch>
              </div>
            </div>

            <div class="setting-item">
              <el-button type="primary" @click="saveNotificationSettings" :loading="saving">
                保存设置
              </el-button>
            </div>
          </div>
        </el-card>

        <!-- 安全设置 -->
        <el-card class="content-card" v-if="activeMenuItem === 'security'">
          <div v-slot:header>
            <span>安全设置</span>
          </div>

          <el-tabs v-model="securityActiveTab">
            <el-tab-pane label="修改密码" name="password">
              <el-form label-width="120px" style="max-width: 500px">
                <el-form-item label="当前密码">
                  <el-input v-model="securityForm.currentPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="新密码">
                  <el-input v-model="securityForm.newPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item label="确认密码">
                  <el-input v-model="securityForm.confirmPassword" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="changePassword">确认修改</el-button>
                </el-form-item>
              </el-form>
            </el-tab-pane>

            <el-tab-pane label="登录记录" name="loginHistory">
              <el-table :data="loginHistory" style="width: 100%">
                <el-table-column prop="time" label="登录时间" width="180"></el-table-column>
                <el-table-column prop="device" label="设备" width="120"></el-table-column>
                <el-table-column prop="ip" label="IP地址" width="150"></el-table-column>
                <el-table-column prop="location" label="登录地点" width="150"></el-table-column>
                <el-table-column prop="status" label="状态" width="80">
                  <template v-slot="{ row }">
                    <el-tag :type="row.status === '成功' ? 'success' : 'danger'">
                      {{ row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <el-tab-pane label="隐私设置" name="privacy">
              <div class="privacy-settings">
                <div class="setting-item">
                  <label>位置信息</label>
                  <el-switch v-model="privacySettings.locationSharing"></el-switch>
                </div>
                <div class="setting-item">
                  <label>手机号码可见性</label>
                  <el-switch v-model="privacySettings.phoneVisibility"></el-switch>
                </div>
                <div class="setting-item">
                  <label>状态在线显示</label>
                  <el-switch v-model="privacySettings.onlineStatus"></el-switch>
                </div>
                <div class="setting-item">
                  <el-button type="primary" @click="savePrivacySettings">保存设置</el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>

        <!-- 意见反馈 -->
        <el-card class="content-card" v-if="activeMenuItem === 'feedback'">
          <div v-slot:header>
            <span>意见反馈</span>
          </div>

          <el-form label-width="100px" style="max-width: 600px">
            <el-form-item label="反馈类型">
              <el-select v-model="feedbackForm.type" placeholder="选择反馈类型">
                <el-option label="功能建议" value="feature"></el-option>
                <el-option label="问题报告" value="bug"></el-option>
                <el-option label="服务改进" value="improvement"></el-option>
                <el-option label="其他" value="other"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="反馈内容">
              <el-input
                v-model="feedbackForm.content"
                type="textarea"
                :rows="6"
                placeholder="请详细描述您的意见和建议..."
              ></el-input>
            </el-form-item>

            <el-form-item label="联系邮箱">
              <el-input
                v-model="feedbackForm.email"
                placeholder="如需回复，请留下邮箱地址"
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="submitFeedback" :loading="submitting">
                提交反馈
              </el-button>
              <el-button @click="resetFeedbackForm">重置</el-button>
            </el-form-item>
          </el-form>

          <!-- 历史反馈 -->
          <div class="feedback-history">
            <h4>历史反馈</h4>
            <el-timeline>
              <el-timeline-item
                v-for="item in feedbackHistory"
                :key="item.id"
                :timestamp="item.time"
                :type="getFeedbackTypeColor(item.type)"
              >
                <h5>{{ getFeedbackTypeText(item.type) }}</h5>
                <p>{{ item.content }}</p>
                <div class="feedback-status">
                  <el-tag :type="getStatusTagType(item.status)" size="mini">
                    {{ item.status }}
                  </el-tag>
                </div>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义类型接口
interface CourierProfile {
  id: string
  name: string
  idCard: string
  phone: string
  emergencyContact: string
  emergencyPhone: string
  address: string
  joinDate: string
  avatar: string
}

interface VehicleInfo {
  type: string
  brand: string
  plateNumber: string
  color: string
  insuranceExpiry: string
  inspectionExpiry: string
  photos: string[]
}

interface TimeSlot {
  start: Date | null
  end: Date | null
}

interface DeliveryPreferences {
  acceptMode: string
  maxDistance: number
  preferredTypes: string[]
  timeSlots: TimeSlot[]
  specialServices: string[]
}

interface NotificationSettings {
  newOrderAlert: boolean
  orderStatusChange: boolean
  orderCancelled: boolean
  systemAnnouncement: boolean
  versionUpdate: boolean
  balanceAlert: boolean
  pushNotification: boolean
  smsNotification: boolean
  voiceAlert: boolean
}

interface SecurityForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface LoginHistoryItem {
  time: string
  device: string
  ip: string
  location: string
  status: string
}

interface PrivacySettings {
  locationSharing: boolean
  phoneVisibility: boolean
  onlineStatus: boolean
}

interface FeedbackForm {
  type: string
  content: string
  email: string
}

interface FeedbackHistoryItem {
  id: number
  type: string
  content: string
  status: string
  time: string
}

// 响应式状态
const activeMenuItem = ref('personal')
const editMode = ref(false)
const vehicleEditMode = ref(false)
const saving = ref(false)
const submitting = ref(false)
const securityActiveTab = ref('password')

const courierProfile = reactive<CourierProfile>({
  id: 'C001',
  name: '张师傅',
  idCard: '110101199001011234',
  phone: '138****8888',
  emergencyContact: '张三',
  emergencyPhone: '139****9999',
  address: '北京市海淀区中关村大街1号',
  joinDate: '2023-06-15',
  avatar: '',
})

const profileRules = reactive({
  name: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  idCard: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    {
      pattern:
        /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
      message: '请输入正确的身份证号码',
      trigger: 'blur',
    },
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  emergencyContact: [{ required: true, message: '请输入紧急联系人', trigger: 'blur' }],
  emergencyPhone: [
    { required: true, message: '请输入紧急联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' },
  ],
  address: [{ required: true, message: '请输入现居住地址', trigger: 'blur' }],
})

const vehicleInfo = reactive<VehicleInfo>({
  type: 'electric-bike',
  brand: '雅迪',
  plateNumber: '京A12345',
  color: '黑色',
  insuranceExpiry: '2024-12-31',
  inspectionExpiry: '2024-06-30',
  photos: [],
})

const vehicleRules = reactive({
  type: [{ required: true, message: '请选择车辆类型', trigger: 'change' }],
  brand: [{ required: true, message: '请输入车辆品牌', trigger: 'blur' }],
  plateNumber: [{ required: true, message: '请输入车牌号码', trigger: 'blur' }],
  color: [{ required: true, message: '请输入车辆颜色', trigger: 'blur' }],
})

const deliveryPreferences = reactive<DeliveryPreferences>({
  acceptMode: 'manual',
  maxDistance: 5,
  preferredTypes: ['takeout', 'pickup'],
  timeSlots: [{ start: new Date(2024, 0, 1, 8, 0), end: new Date(2024, 0, 1, 22, 0) }],
  specialServices: ['fragile', 'urgent'],
})

const notificationSettings = reactive<NotificationSettings>({
  newOrderAlert: true,
  orderStatusChange: true,
  orderCancelled: true,
  systemAnnouncement: true,
  versionUpdate: false,
  balanceAlert: true,
  pushNotification: true,
  smsNotification: false,
  voiceAlert: true,
})

const securityForm = reactive<SecurityForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const loginHistory = reactive<LoginHistoryItem[]>([
  {
    time: '2024-01-15 14:30:25',
    device: 'iPhone 14',
    ip: '192.168.1.100',
    location: '北京市海淀区',
    status: '成功',
  },
  {
    time: '2024-01-14 18:45:12',
    device: 'Android',
    ip: '192.168.1.101',
    location: '北京市海淀区',
    status: '成功',
  },
  {
    time: '2024-01-14 10:20:33',
    device: 'iPhone 13',
    ip: '192.168.1.102',
    location: '北京市海淀区',
    status: '成功',
  },
])

const privacySettings = reactive<PrivacySettings>({
  locationSharing: true,
  phoneVisibility: false,
  onlineStatus: true,
})

const feedbackForm = reactive<FeedbackForm>({
  type: '',
  content: '',
  email: '',
})

const feedbackHistory = reactive<FeedbackHistoryItem[]>([
  {
    id: 1,
    type: 'feature',
    content: '建议增加订单推送功能',
    status: '已处理',
    time: '2024-01-10 15:30:00',
  },
  {
    id: 2,
    type: 'bug',
    content: '地图导航偶尔出现卡顿',
    status: '处理中',
    time: '2024-01-08 10:20:00',
  },
])

// 表单引用
const profileForm = ref()
const vehicleForm = ref()

// 方法
const handleMenuSelect = (key: string) => {
  activeMenuItem.value = key
}

const saveProfile = () => {
  profileForm.value.validate((valid: boolean) => {
    if (valid) {
      saving.value = true
      setTimeout(() => {
        saving.value = false
        editMode.value = false
        ElMessage.success('个人信息保存成功')
      }, 1000)
    }
  })
}

const cancelEdit = () => {
  editMode.value = false
  // 重置表单数据
  profileForm.value.resetFields()
}

const saveVehicleInfo = () => {
  vehicleForm.value.validate((valid: boolean) => {
    if (valid) {
      saving.value = true
      setTimeout(() => {
        saving.value = false
        vehicleEditMode.value = false
        ElMessage.success('车辆信息保存成功')
      }, 1000)
    }
  })
}

const cancelVehicleEdit = () => {
  vehicleEditMode.value = false
  vehicleForm.value.resetFields()
}

const handlePhotoUpload = (file: File) => {
  // 模拟上传照片
  const reader = new FileReader()
  reader.onload = (e: ProgressEvent<FileReader>) => {
    if (e.target?.result) {
      vehicleInfo.photos.push(e.target.result as string)
    }
  }
  reader.readAsDataURL(file)
  return false
}

const removePhoto = (index: number) => {
  vehicleInfo.photos.splice(index, 1)
}

const saveDeliveryPreferences = () => {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    ElMessage.success('配送偏好保存成功')
  }, 1000)
}

const formatDistanceTooltip = (val: number) => {
  return `${val}公里`
}

const addTimeSlot = () => {
  deliveryPreferences.timeSlots.push({
    start: null,
    end: null,
  })
}

const removeTimeSlot = (index: number) => {
  deliveryPreferences.timeSlots.splice(index, 1)
}

const saveNotificationSettings = () => {
  saving.value = true
  setTimeout(() => {
    saving.value = false
    ElMessage.success('通知设置保存成功')
  }, 1000)
}

const changePassword = () => {
  if (securityForm.newPassword !== securityForm.confirmPassword) {
    ElMessage.error('两次输入的密码不一致')
    return
  }

  saving.value = true
  setTimeout(() => {
    saving.value = false
    securityForm.currentPassword = ''
    securityForm.newPassword = ''
    securityForm.confirmPassword = ''
    ElMessage.success('密码修改成功')
  }, 1000)
}

const savePrivacySettings = () => {
  ElMessage.success('隐私设置保存成功')
}

const submitFeedback = () => {
  if (!feedbackForm.content.trim()) {
    ElMessage.error('请输入反馈内容')
    return
  }

  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    feedbackForm.type = ''
    feedbackForm.content = ''
    feedbackForm.email = ''
    ElMessage.success('反馈提交成功，我们会尽快处理')
  }, 1000)
}

const resetFeedbackForm = () => {
  feedbackForm.type = ''
  feedbackForm.content = ''
  feedbackForm.email = ''
}

const getFeedbackTypeText = (type: string) => {
  const typeMap = {
    feature: '功能建议',
    bug: '问题报告',
    improvement: '服务改进',
    other: '其他',
  }
  return typeMap[type] || '未知'
}

const getFeedbackTypeColor = (type: string) => {
  const colorMap = {
    feature: 'primary',
    bug: 'danger',
    improvement: 'warning',
    other: 'info',
  }
  return colorMap[type] || 'info'
}

const getStatusTagType = (status: string) => {
  const statusMap = {
    待处理: 'warning',
    处理中: 'primary',
    已处理: 'success',
    已关闭: 'info',
  }
  return statusMap[status] || 'info'
}
</script>

<style scoped>
.courier-settings {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.header-content h1 {
  margin: 0;
  color: #303133;
  font-size: 24px;
}

.header-content h1 i {
  margin-right: 10px;
  color: #409eff;
}

.header-content p {
  margin: 5px 0 0 35px;
  color: #606266;
}

.sidebar-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.profile-section {
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #ebeef5;
  margin-bottom: 20px;
}

.profile-avatar {
  margin-bottom: 15px;
}

.profile-section h3 {
  margin: 0 0 5px 0;
  color: #303133;
}

.courier-id {
  color: #909399;
  font-size: 14px;
}

.sidebar-menu {
  border: none;
}

.content-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.vehicle-photos {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.photo-item {
  position: relative;
}

.vehicle-photo {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #ebeef5;
}

.photo-item .el-button {
  position: absolute;
  top: -8px;
  right: -8px;
}

.photo-upload {
  width: 100px;
  height: 100px;
  border: 2px dashed #ebeef5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.photo-upload:hover {
  border-color: #409eff;
}

.photo-upload i {
  font-size: 24px;
  color: #909399;
}

.time-selector {
  width: 100%;
}

.time-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.time-separator {
  color: #606266;
}

.notification-settings {
  padding: 20px 0;
}

.setting-group {
  margin-bottom: 30px;
}

.setting-group h4 {
  margin: 0 0 15px 0;
  color: #303133;
  font-size: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #409eff;
  display: inline-block;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #ebeef5;
}

.setting-item label {
  color: #606266;
  font-size: 14px;
}

.privacy-settings {
  padding: 20px 0;
}

.feedback-history {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid #ebeef5;
}

.feedback-history h4 {
  margin: 0 0 20px 0;
  color: #303133;
}

.feedback-status {
  margin-top: 10px;
}

.el-timeline-item h5 {
  margin: 0 0 5px 0;
  color: #303133;
  font-size: 14px;
}

.el-timeline-item p {
  margin: 0 0 5px 0;
  color: #606266;
  font-size: 13px;
}
</style>
