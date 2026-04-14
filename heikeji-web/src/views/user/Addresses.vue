<template>
  <div class="addresses-page">
    <div class="container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-icon">
            <el-icon :size="28" color="#fff"><Location /></el-icon>
          </div>
          <div class="header-text">
            <h1>我的收货地址</h1>
            <p>管理您的收货地址，方便快捷下单</p>
          </div>
        </div>
        <button class="add-btn" @click="openAddModal">
          <el-icon :size="18"><Plus /></el-icon>
          添加新地址
        </button>
      </div>

      <!-- 地址列表 - 卡片式布局 -->
      <div class="addresses-grid">
        <div
          v-for="(addr, index) in sortedAddresses"
          :key="addr.id"
          class="address-card"
          :class="{ 'is-default': addr.isDefault }"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <!-- 默认地址标识 -->
          <div v-if="addr.isDefault" class="default-badge">
            <el-icon><StarFilled /></el-icon>
            默认地址
          </div>

          <!-- 地址内容 -->
          <div class="card-content">
            <div class="user-info">
              <div class="name">{{ addr.receiverName || addr.name }}</div>
              <div class="phone">{{ addr.receiverPhone || addr.phone }}</div>
            </div>
            <div class="address-info">
              <div class="region">{{ addr.province }} {{ addr.city }} {{ addr.district }}</div>
              <div class="detail">{{ addr.detail || addr.detailAddress }}</div>
              <div v-if="addr.zipCode" class="zip">邮编：{{ addr.zipCode }}</div>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="card-actions">
            <button class="action-btn edit" @click="openEditModal(addr)">
              <el-icon><Edit /></el-icon>
              编辑
            </button>
            <button class="action-btn delete" @click="deleteAddress(addr)">
              <el-icon><Delete /></el-icon>
              删除
            </button>
            <button
              v-if="!addr.isDefault"
              class="action-btn default"
              @click="setDefault(addr)"
            >
              <el-icon><Star /></el-icon>
              设为默认
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="addresses.length === 0" class="empty-state">
        <div class="empty-icon">
          <el-icon :size="64"><Location /></el-icon>
        </div>
        <h3>暂无收货地址</h3>
        <p>添加收货地址，让购物更便捷</p>
        <button class="add-btn large" @click="openAddModal">
          <el-icon :size="20"><Plus /></el-icon>
          添加新地址
        </button>
      </div>
    </div>
  </div>

  <!-- 添加/编辑地址弹窗 -->
  <el-dialog
    v-model="showModal"
    :title="editingId ? '编辑收货地址' : '添加收货地址'"
    width="500px"
    :close-on-click-modal="false"
    destroy-on-close
  >
    <!-- 当前配送至 -->
    <div class="flex items-center justify-between text-sm mb-4">
      <span class="text-gray-500">当前配送至</span>
      <div class="flex items-center gap-2">
        <span class="text-gray-900">中国大陆</span>
        <button class="text-blue-600 hover:text-blue-700">切换 &gt;</button>
      </div>
    </div>

    <el-form ref="formRef" :model="form" :rules="rules" label-position="top" size="default">
      <!-- 地址信息 -->
      <el-form-item label="地址信息" prop="region" required>
        <el-cascader
          v-model="selectedRegion"
          :options="regionOptions"
          :props="{ value: 'label', label: 'label', children: 'children' }"
          placeholder="请选择省/市/区/街道"
          class="w-full"
          @change="onRegionChange"
        />
      </el-form-item>

      <!-- 详细地址 -->
      <el-form-item label="详细地址" prop="detail" required>
        <el-input
          v-model="form.detail"
          type="textarea"
          :rows="3"
          placeholder="请输入详细地址信息，如道路、门牌号、小区、楼栋号、单元等信息"
        />
      </el-form-item>

      <!-- 收货人姓名 -->
      <el-form-item label="收货人姓名" prop="name" required>
        <el-input v-model="form.name" placeholder="长度不超过25个字符" maxlength="25" style="width: 200px;" />
      </el-form-item>

      <!-- 手机号码 -->
      <el-form-item label="手机号码" prop="phone" required>
        <div class="flex gap-2">
          <el-select v-model="form.countryCode" style="width: 120px;">
            <el-option label="中国大陆 +86" value="+86" />
            <el-option label="中国香港 +852" value="+852" />
            <el-option label="中国澳门 +853" value="+853" />
            <el-option label="中国台湾 +886" value="+886" />
          </el-select>
          <el-input v-model="form.phone" placeholder="请输入11位手机号" style="width: 200px;" maxlength="11" />
        </div>
      </el-form-item>

      <!-- 设为默认 -->
      <el-form-item>
        <el-checkbox v-model="form.isDefault">
          <span class="text-gray-700">设为默认收货地址</span>
        </el-checkbox>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex items-center justify-end gap-4">
        <el-button
          @click="closeModal"
          size="default"
        >
          取消
        </el-button>
        <el-button
          type="primary"
          @click="submitForm"
          size="default"
          style="background-color: #ff5000; border-color: #ff5000;"
        >
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useOrderStore } from '@/stores/order'
import { regionData } from '@/utils/regionData'
import { Location, Plus, Star, StarFilled, Edit, Delete } from '@element-plus/icons-vue'

const orderStore = useOrderStore()

const showModal = ref(false)
const editingId = ref<string | null>(null)
const formRef = ref()
const selectedRegion = ref<string[]>([])

const form = reactive({
  name: '',
  phone: '',
  countryCode: '+86',
  province: '',
  city: '',
  district: '',
  detail: '',
  zipCode: '',
  isDefault: false,
  region: ''
})

const rules = {
  name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  detail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }],
  region: [{ required: true, message: '请选择所在地区', trigger: 'change' }]
}

const addresses = computed(() => orderStore.addresses)

// 排序后的地址列表（默认地址排在最前面）
const sortedAddresses = computed(() => {
  return [...addresses.value].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1
    if (!a.isDefault && b.isDefault) return 1
    return 0
  })
})

const regionOptions = regionData

function onRegionChange(value: string[]) {
  if (value && value.length >= 3) {
    form.province = value[0] || ''
    form.city = value[1] || ''
    form.district = value[2] || ''
    // 设置 region 字段用于表单验证
    form.region = value.join('/')
  }
}

function openAddModal() {
  console.log('[Addresses] Opening add modal')
  editingId.value = null
  selectedRegion.value = []
  form.name = ''
  form.phone = ''
  form.countryCode = '+86'
  form.province = ''
  form.city = ''
  form.district = ''
  form.detail = ''
  form.zipCode = ''
  form.isDefault = false
  form.region = ''
  showModal.value = true
  console.log('[Addresses] showModal:', showModal.value)
}

async function openEditModal(addr: any) {
  console.log('[Addresses] Opening edit modal for:', addr.id)
  editingId.value = addr.id
  selectedRegion.value = [addr.province, addr.city, addr.district].filter(Boolean)
  
  // 先显示弹窗
  showModal.value = true
  
  // 等待 DOM 更新后再赋值
  await nextTick()
  
  // 直接赋值，确保响应式更新
  form.name = addr.receiverName || addr.name || ''
  form.phone = addr.receiverPhone || addr.phone || ''
  form.countryCode = addr.countryCode || '+86'
  form.province = addr.province || ''
  form.city = addr.city || ''
  form.district = addr.district || ''
  form.detail = addr.detail || addr.detailAddress || ''
  form.zipCode = addr.zipCode || ''
  form.isDefault = addr.isDefault || false
  form.region = addr.province && addr.city && addr.district ? `${addr.province}/${addr.city}/${addr.district}` : ''
  
  console.log('[Addresses] form.phone:', form.phone)
}

function closeModal() {
  showModal.value = false
  editingId.value = null
  selectedRegion.value = []
}

async function submitForm() {
  try {
    await formRef.value?.validate()
    const submitData = { ...form }
    if (editingId.value) {
      await orderStore.updateAddress(editingId.value, submitData)
      ElMessage.success('地址已更新')
    } else {
      await orderStore.addAddress(submitData)
      ElMessage.success('地址已添加')
    }
    closeModal()
  } catch (err: any) {
    console.error('保存地址失败:', err)
    ElMessage.error(err.message || '保存失败，请重试')
  }
}

async function deleteAddress(addr: any) {
  console.log('[Addresses] Deleting address:', addr.id)
  try {
    await ElMessageBox.confirm('确定删除该地址吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    console.log('[Addresses] Confirm delete, calling store...')
    await orderStore.deleteAddress(addr.id)
    ElMessage.success('地址已删除')
  } catch (err: any) {
    console.log('[Addresses] Delete error:', err)
    if (err !== 'cancel') {
      ElMessage.error(err.message || '删除失败')
    }
  }
}

async function setDefault(addr: any) {
  try {
    await orderStore.setDefaultAddress(addr.id)
    ElMessage.success('已设为默认地址')
  } catch (err: any) {
    ElMessage.error(err.message || '设置失败')
  }
}

// 取消默认地址功能 - 通常只能设置其他地址为默认
async function cancelDefault(addr: any) {
  ElMessage.info('请设置其他地址为默认地址')
}

onMounted(async () => {
  try {
    await orderStore.fetchAddresses()
  } catch (err: any) {
    ElMessage.error(err.message || '获取地址列表失败')
  }
})
</script>

<style scoped>
/* 页面容器 */
.addresses-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #f1f5f9 100%);
  padding: 32px 0;
  position: relative;
  overflow: hidden;
}

.addresses-page::before {
  content: '';
  position: absolute;
  top: -30%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.addresses-page::after {
  content: '';
  position: absolute;
  bottom: -20%;
  left: -5%;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%);
  pointer-events: none;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
}

/* 页面头部 */
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  padding: 24px 32px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px -5px rgba(59, 130, 246, 0.4);
}

.header-text h1 {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.header-text p {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
}

.add-btn.large {
  padding: 14px 32px;
  font-size: 16px;
}

/* 地址卡片网格 */
.addresses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 24px;
}

/* 地址卡片 */
.address-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.address-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.address-card.is-default {
  border: 2px solid #f59e0b;
  background: linear-gradient(135deg, rgba(255, 251, 235, 0.9) 0%, rgba(255, 255, 255, 0.9) 100%);
}

.address-card.is-default::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%);
}

/* 默认地址标识 */
.default-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

/* 卡片内容 */
.card-content {
  margin-bottom: 20px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.user-info .name {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
}

.user-info .phone {
  font-size: 14px;
  color: #64748b;
  padding: 4px 12px;
  background: #f1f5f9;
  border-radius: 20px;
}

.address-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.address-info .region {
  font-size: 14px;
  font-weight: 600;
  color: #3b82f6;
}

.address-info .detail {
  font-size: 14px;
  color: #475569;
  line-height: 1.6;
}

.address-info .zip {
  font-size: 12px;
  color: #94a3b8;
}

/* 操作按钮 */
.card-actions {
  display: flex;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.action-btn.edit {
  color: #3b82f6;
  background: #eff6ff;
}

.action-btn.edit:hover {
  background: #dbeafe;
}

.action-btn.delete {
  color: #ef4444;
  background: #fef2f2;
}

.action-btn.delete:hover {
  background: #fee2e2;
}

.action-btn.default {
  color: #f59e0b;
  background: #fffbeb;
  margin-left: auto;
}

.action-btn.default:hover {
  background: #fef3c7;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 40px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 24px;
  border-radius: 32px;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6366f1;
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.2);
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 24px 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .addresses-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
  
  .header-content {
    flex-direction: column;
  }
}

/* 修复 Element Plus 输入框样式 */
:deep(.el-input__inner) {
  padding: 0 12px;
  height: 32px;
  line-height: 32px;
}

:deep(.el-textarea__inner) {
  padding: 8px 12px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #333;
}

/* 修复必填项星号样式 */
:deep(.el-form-item.is-required .el-form-item__label:before) {
  content: '* ';
  color: #ff4d4f;
  margin-right: 4px;
}

/* 修复按钮样式 */
:deep(.el-button) {
  border-radius: 4px;
  padding: 8px 20px;
}

:deep(.el-button--primary) {
  background-color: #ff5000;
  border-color: #ff5000;
}

:deep(.el-button--primary:hover) {
  background-color: #ff6a00;
  border-color: #ff6a00;
}
</style>


