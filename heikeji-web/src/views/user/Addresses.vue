<template>
  <div class="page min-h-screen">
    <div class="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-text-primary">收货地址</h1>
          <p class="text-sm text-gray-400 mt-1">管理您的收货地址，方便快捷下单</p>
        </div>
        <el-button type="primary" round class="!rounded-full !px-6" @click="openAddModal()">
          <el-icon class="mr-1"><Plus /></el-icon>新增地址
        </el-button>
      </div>

      <div v-if="addresses.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <div v-for="addr in addresses" :key="addr.id"
          :class="['group rounded-2xl border p-5 transition-all duration-300 relative overflow-hidden',
            addr.isDefault ? 'border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-white shadow-sm' : 'border-gray-100 bg-white hover:border-gray-200 hover:shadow-md']">

          <div v-if="addr.isDefault" class="absolute top-0 right-0 w-24 h-24 overflow-hidden">
            <div class="absolute -top-4 -right-4 w-16 h-16 bg-indigo-500 rotate-45"></div>
            <span class="absolute top-2 right-3 text-[10px] text-white font-bold z-10">默认</span>
          </div>

          <div class="flex items-start gap-3 mb-3">
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shrink-0">
              <span class="text-sm font-bold text-indigo-600">{{ addr.name.charAt(0) }}</span>
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="font-semibold text-text-primary">{{ addr.name }}</span>
                <span class="text-sm text-gray-500">{{ addr.phone }}</span>
                <span v-if="addr.tag" :class="['px-2 py-0.5 rounded text-[10px] font-medium', tagStyle(addr.tag)]">{{ addr.tag }}</span>
              </div>
            </div>
          </div>

          <p class="text-sm text-gray-600 leading-relaxed mb-4 pl-[52px]">
            {{ addr.province }}{{ addr.city }}{{ addr.district }}{{ addr.detail }}
          </p>

          <div class="flex items-center justify-between pt-3 border-t border-gray-50 pl-[52px]">
            <button v-if="!addr.isDefault" @click="setDefault(addr)"
              class="text-sm text-gray-500 hover:text-indigo-600 transition-colors flex items-center gap-1">
              <el-icon><Star /></el-icon>设为默认
            </button>
            <span v-else class="text-xs text-indigo-500 font-medium flex items-center gap-1">
              <el-icon><Select /></el-icon>默认地址
            </span>

            <div class="flex items-center gap-3">
              <button @click="openEditModal(addr)" class="text-sm text-gray-400 hover:text-indigo-600 transition-colors">编辑</button>
              <button @click="deleteAddress(addr)" class="text-sm text-gray-400 hover:text-red-500 transition-colors">删除</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 py-20 text-center">
        <div class="w-28 h-28 mx-auto mb-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full flex items-center justify-center">
          <el-icon :size="48" class="text-blue-300"><LocationInformation /></el-icon>
        </div>
        <h3 class="text-lg font-medium text-text-primary mb-2">还没有添加收货地址</h3>
        <p class="text-sm text-gray-400 mb-6">添加地址后下单更便捷哦~</p>
        <el-button type="primary" round class="!rounded-full !px-8" @click="openAddModal()">新增地址</el-button>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="closeModal">
          <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
            <div class="shrink-0 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 class="text-lg font-bold text-text-primary">{{ editingId ? '编辑地址' : '新增地址' }}</h3>
              <button @click="closeModal" class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <el-icon><Close /></el-icon>
              </button>
            </div>

            <div class="overflow-y-auto flex-1 p-6 space-y-5">
              <el-form ref="formRef" :model="form" label-position="top" :rules="rules">
                <div class="grid grid-cols-2 gap-4">
                  <el-form-item label="收货人" prop="name">
                    <el-input v-model="form.name" placeholder="请输入姓名" />
                  </el-form-item>
                  <el-form-item label="手机号" prop="phone">
                    <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
                  </el-form-item>
                </div>

                <el-form-item label="所在地区" prop="province">
                  <div class="flex gap-2">
                    <el-select v-model="form.province" placeholder="省" class="flex-1" @change="onProvinceChange">
                      <el-option v-for="p in provinces" :key="p" :label="p" :value="p" />
                    </el-select>
                    <el-select v-model="form.city" placeholder="市" class="flex-1" :disabled="!form.province">
                      <el-option v-for="c in cities" :key="c" :label="c" :value="c" />
                    </el-select>
                    <el-select v-model="form.district" placeholder="区" class="flex-1" :disabled="!form.city">
                      <el-option v-for="d in districts" :key="d" :label="d" :value="d" />
                    </el-select>
                  </div>
                </el-form-item>

                <el-form-item label="详细地址" prop="detail">
                  <el-input v-model="form.detail" type="textarea" :rows="2" placeholder="街道、楼栋、门牌号等" />
                </el-form-item>

                <el-form-item label="地址标签">
                  <div class="flex gap-2">
                    <button v-for="tag in tagOptions" :key="tag"
                      @click="form.tag = form.tag === tag ? '' : tag"
                      :class="['px-4 py-1.5 rounded-full text-sm transition-all',
                        form.tag === tag ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200']">
                      {{ tag }}
                    </button>
                  </div>
                </el-form-item>

                <el-form-item>
                  <el-checkbox v-model="form.isDefault">设为默认收货地址</el-checkbox>
                </el-form-item>
              </el-form>
            </div>

            <div class="shrink-0 p-5 border-t border-gray-100 bg-gray-50/50">
              <div class="flex gap-3">
                <button @click="closeModal" class="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">
                  取消
                </button>
                <button @click="submitForm" class="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium shadow-lg shadow-indigo-200 hover:shadow-xl transition-shadow">
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Close, Star, Select, LocationInformation } from '@element-plus/icons-vue'
import { useOrderStore } from '@/stores/order'

const orderStore = useOrderStore()

const showModal = ref(false)
const editingId = ref<number | null>(null)
const formRef = ref()

const form = reactive({
  name: '', phone: '', province: '', city: '', district: '', detail: '', tag: '', isDefault: false
})

const rules = {
  name: [{ required: true, message: '请输入收货人姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  province: [{ required: true, message: '请选择省份', trigger: 'change' }],
  detail: [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
}

const tagOptions = ['家', '公司', '学校']

const addresses = computed(() => orderStore.addresses)

const provinces = ['黑龙江省', '北京市', '上海市', '广东省', '浙江省']
const citiesMap: Record<string, string[]> = {
  '黑龙江省': ['哈尔滨市', '齐齐哈尔市', '牡丹江市'],
  '北京市': ['北京市'],
  '上海市': ['上海市'],
  '广东省': ['广州市', '深圳市', '东莞市'],
  '浙江省': ['杭州市', '宁波市', '温州市']
}
const districtsMap: Record<string, string[]> = {
  '哈尔滨市': ['南岗区', '道里区', '道外区', '香坊区', '松北区'],
  '北京市': ['海淀区', '朝阳区', '西城区', '东城区'],
  '上海市': ['浦东新区', '黄浦区', '徐汇区'],
  '广州市': ['天河区', '越秀区', '海珠区'],
  '深圳市': ['南山区', '福田区', '宝安区'],
  '杭州市': ['西湖区', '滨江区', '余杭区']
}

const cities = ref<string[]>([])
const districts = ref<string[]>([])

function onProvinceChange() {
  form.city = ''
  form.district = ''
  cities.value = citiesMap[form.province] || []
  districts.value = []
}

function openAddModal() {
  editingId.value = null
  Object.assign(form, { name: '', phone: '', province: '', city: '', district: '', detail: '', tag: '', isDefault: false })
  showModal.value = true
}

function openEditModal(addr: any) {
  editingId.value = addr.id
  Object.assign(form, { ...addr })
  if (form.province) {
    cities.value = citiesMap[form.province] || []
    districts.value = districtsMap[form.city] || []
  }
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  editingId.value = null
}

async function submitForm() {
  try {
    await formRef.value?.validate()
    if (editingId.value) {
      await orderStore.updateAddress(editingId.value, { ...form })
      ElMessage.success('地址已更新')
    } else {
      await orderStore.addAddress({ ...form })
      ElMessage.success('地址已添加')
    }
    closeModal()
  } catch {}
}

async function setDefault(addr: any) {
  try {
    await orderStore.setDefaultAddress(addr.id)
    ElMessage.success('已设为默认地址')
  } catch (err: any) {
    ElMessage.error(err.message || '操作失败')
  }
}

async function deleteAddress(addr: any) {
  try {
    await ElMessageBox.confirm('确定删除该地址吗？', '提示', { confirmButtonText: '确认删除', cancelButtonText: '取消', type: 'warning' })
    await orderStore.deleteAddress(addr.id)
    ElMessage.success('地址已删除')
  } catch (err: any) {
    if (err !== 'cancel') {
      ElMessage.error(err.message || '删除失败')
    }
  }
}

function tagStyle(tag: string): string {
  const map: Record<string, string> = { 家: 'bg-orange-100 text-orange-600', 公司: 'bg-blue-100 text-blue-600', 学校: 'bg-green-100 text-green-600' }
  return map[tag] || 'bg-gray-100 text-gray-600'
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
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.animate-scale-in { animation: scaleIn 0.25s ease-out forwards; }
</style>
