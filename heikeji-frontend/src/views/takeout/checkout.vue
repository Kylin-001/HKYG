<template>
  <div class="checkout-container">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="goBack" icon="el-icon-arrow-left" circle></el-button>
        <h1><i class="el-icon-document"></i> 确认订单</h1>
      </div>
    </div>

    <div class="checkout-content">
      <el-row :gutter="20">
        <!-- 左侧：订单信息 -->
        <el-col :span="16">
          <!-- 收货地址 -->
          <el-card class="info-card">
            <div slot="header">
              <span><i class="el-icon-location"></i> 收货地址</span>
              <el-button type="text" @click="showAddressDialog = true">管理地址</el-button>
            </div>
            <div v-if="selectedAddress" class="address-info">
              <div class="address-main">
                <span class="receiver-name">{{ selectedAddress.name }}</span>
                <span class="receiver-phone">{{ selectedAddress.phone }}</span>
                <el-tag v-if="selectedAddress.isDefault" type="primary" size="mini">默认</el-tag>
              </div>
              <div class="address-detail">
                {{ selectedAddress.province }}{{ selectedAddress.city }}{{ selectedAddress.area
                }}{{ selectedAddress.detail }}
              </div>
            </div>
            <div v-else class="no-address">
              <el-button type="primary" @click="showAddressDialog = true">
                <i class="el-icon-plus"></i> 添加收货地址
              </el-button>
            </div>
          </el-card>

          <!-- 送达时间 -->
          <el-card class="info-card">
            <div slot="header">
              <span><i class="el-icon-time"></i> 送达时间</span>
            </div>
            <el-radio-group v-model="deliveryTime" size="small">
              <el-radio-button label="asap">尽快送达（预计30分钟）</el-radio-button>
              <el-radio-button label="scheduled">选择时间</el-radio-button>
            </el-radio-group>

            <div v-if="deliveryTime === 'scheduled'" class="time-selector">
              <el-date-picker
                v-model="selectedDeliveryTime"
                type="datetime"
                placeholder="选择送达时间"
                :picker-options="deliveryTimePickerOptions"
                size="small"
              ></el-date-picker>
            </div>
          </el-card>

          <!-- 备注信息 -->
          <el-card class="info-card">
            <div slot="header">
              <span><i class="el-icon-edit-outline"></i> 订单备注</span>
            </div>
            <el-input
              v-model="orderRemark"
              type="textarea"
              :rows="3"
              placeholder="有什么要求请写在这里..."
              maxlength="200"
              show-word-limit
            ></el-input>
          </el-card>

          <!-- 商品清单 -->
          <el-card class="info-card">
            <div slot="header">
              <span><i class="el-icon-shopping-cart-2"></i> 商品清单</span>
              <el-button type="text" @click="$router.push('/takeout/cart')">返回购物车</el-button>
            </div>

            <div
              v-for="merchantGroup in groupedCartProducts"
              :key="merchantGroup.merchantId"
              class="merchant-order"
            >
              <div class="merchant-header">
                <h4>{{ merchantGroup.merchantName }}</h4>
                <span class="delivery-time">{{ merchantGroup.deliveryTime }}分钟送达</span>
              </div>

              <el-table :data="merchantGroup.products" border size="small">
                <el-table-column label="商品信息" width="200">
                  <template slot-scope="{ row }">
                    <div class="product-info">
                      <img
                        :src="row.image || '/static/images/default-product.jpg'"
                        class="product-image"
                      />
                      <div class="product-details">
                        <div class="product-name">{{ row.name }}</div>
                        <div v-if="row.specName" class="product-spec">{{ row.specName }}</div>
                      </div>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="quantity"
                  label="数量"
                  width="80"
                  align="center"
                ></el-table-column>
                <el-table-column label="单价" width="80" align="center">
                  <template slot-scope="{ row }"> ¥{{ row.price }} </template>
                </el-table-column>
                <el-table-column label="小计" width="80" align="center">
                  <template slot-scope="{ row }">
                    <span class="subtotal">¥{{ (row.price * row.quantity).toFixed(2) }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧：订单汇总 -->
        <el-col :span="8">
          <el-card class="summary-card">
            <div slot="header">
              <span>订单汇总</span>
            </div>

            <div class="summary-content">
              <!-- 费用明细 -->
              <div class="fee-detail">
                <div class="fee-item">
                  <span class="fee-label">商品总额</span>
                  <span class="fee-value">¥{{ goodsAmount.toFixed(2) }}</span>
                </div>
                <div class="fee-item">
                  <span class="fee-label">配送费</span>
                  <span class="fee-value">¥{{ totalDeliveryFee.toFixed(2) }}</span>
                </div>
                <div v-if="discountAmount > 0" class="fee-item discount">
                  <span class="fee-label">优惠减免</span>
                  <span class="fee-value">-¥{{ discountAmount.toFixed(2) }}</span>
                </div>
              </div>

              <el-divider></el-divider>

              <div class="total-amount">
                <span class="total-label">应付总额</span>
                <span class="total-value">¥{{ finalAmount.toFixed(2) }}</span>
              </div>

              <!-- 优惠券 -->
              <div class="coupon-section">
                <el-button
                  v-if="availableCoupons.length > 0"
                  type="text"
                  @click="showCouponDialog = true"
                  class="coupon-btn"
                >
                  <i class="el-icon-ticket"></i>
                  {{ selectedCoupon ? `已选择：${selectedCoupon.title}` : '使用优惠券' }}
                </el-button>
                <div v-else class="no-coupon">暂无可用优惠券</div>
              </div>

              <!-- 支付方式 -->
              <div class="payment-section">
                <h4>支付方式</h4>
                <el-radio-group v-model="paymentMethod" size="small">
                  <el-radio label="wechat">微信支付</el-radio>
                  <el-radio label="alipay">支付宝</el-radio>
                  <el-radio label="balance">余额支付</el-radio>
                </el-radio-group>
              </div>

              <!-- 提交按钮 -->
              <div class="submit-section">
                <el-button
                  type="primary"
                  size="large"
                  :loading="submitting"
                  :disabled="!canSubmit"
                  @click="submitOrder"
                  class="submit-btn"
                >
                  {{ submitting ? '提交中...' : `提交订单 ¥${finalAmount.toFixed(2)}` }}
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 地址管理对话框 -->
    <el-dialog title="管理收货地址" :visible.sync="showAddressDialog" width="600px">
      <div class="address-list">
        <div
          v-for="address in addressList"
          :key="address.id"
          class="address-item"
          :class="{ active: selectedAddress && selectedAddress.id === address.id }"
          @click="selectAddress(address)"
        >
          <div class="address-main">
            <span class="receiver-name">{{ address.name }}</span>
            <span class="receiver-phone">{{ address.phone }}</span>
            <el-tag v-if="address.isDefault" type="primary" size="mini">默认</el-tag>
          </div>
          <div class="address-detail">
            {{ address.province }}{{ address.city }}{{ address.area }}{{ address.detail }}
          </div>
          <div class="address-actions">
            <el-button type="text" size="mini">编辑</el-button>
            <el-button type="text" size="mini" @click="setDefaultAddress(address)"
              >设为默认</el-button
            >
          </div>
        </div>
      </div>

      <div slot="footer">
        <el-button @click="showAddressDialog = false">取消</el-button>
        <el-button type="primary" @click="addNewAddress">添加新地址</el-button>
      </div>
    </el-dialog>

    <!-- 优惠券选择对话框 -->
    <el-dialog title="选择优惠券" :visible.sync="showCouponDialog" width="500px">
      <div class="coupon-list">
        <div
          v-for="coupon in availableCoupons"
          :key="coupon.id"
          class="coupon-item"
          :class="{ active: selectedCoupon && selectedCoupon.id === coupon.id }"
          @click="selectCoupon(coupon)"
        >
          <div class="coupon-amount">¥{{ coupon.amount }}</div>
          <div class="coupon-info">
            <div class="coupon-title">{{ coupon.title }}</div>
            <div class="coupon-condition">满{{ coupon.condition }}元可用</div>
            <div class="coupon-expire">有效期至 {{ coupon.expireDate }}</div>
          </div>
        </div>
      </div>

      <div slot="footer">
        <el-button @click="showCouponDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmCoupon">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 导入日志工具
import logger from '@/utils/logger'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'CheckoutPage',
  data() {
    return {
      // 收货地址相关
      showAddressDialog: false,
      selectedAddress: null,
      addressList: [],

      // 送达时间
      deliveryTime: 'asap',
      selectedDeliveryTime: null,
      deliveryTimePickerOptions: {
        disabledDate(time) {
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          const maxDate = new Date()
          maxDate.setDate(maxDate.getDate() + 7) // 最多7天内
          return time.getTime() < today.getTime() || time.getTime() > maxDate.getTime()
        },
        selectableRange: ['09:00:00 - 22:00:00'],
      },

      // 订单备注
      orderRemark: '',

      // 优惠券相关
      showCouponDialog: false,
      selectedCoupon: null,
      availableCoupons: [],

      // 支付方式
      paymentMethod: 'wechat',

      // 提交状态
      submitting: false,
    }
  },

  computed: {
    // 从 Vuex 获取购物车数据
    ...mapState('cart', {
      cartProducts: 'products',
    }),

    ...mapGetters('cart', {
      goodsAmount: 'goodsAmount',
      totalDeliveryFee: 'totalDeliveryFee',
      finalAmountGetter: 'finalAmount',
    }),

    // 按商家分组的购物车商品
    groupedCartProducts() {
      const groups = {}

      this.cartProducts.forEach(product => {
        const { merchantId } = product
        const { merchantName } = product

        if (!groups[merchantId]) {
          groups[merchantId] = {
            merchantId,
            merchantName,
            deliveryFee: 2,
            deliveryTime: 25 + Math.floor(Math.random() * 20), // 25-45分钟
            products: [],
          }
        }

        groups[merchantId].products.push(product)
      })

      return Object.values(groups)
    },

    // 最终应付金额
    finalAmount() {
      const discount = this.selectedCoupon ? this.selectedCoupon.amount : 0
      return Math.max(0, this.goodsAmount + this.totalDeliveryFee - discount)
    },

    // 优惠金额
    discountAmount() {
      return this.selectedCoupon ? this.selectedCoupon.amount : 0
    },

    // 是否可以提交订单
    canSubmit() {
      return this.selectedAddress && this.cartProducts.length > 0 && this.finalAmount >= 0
    },
  },

  mounted() {
    this.loadAddresses()
    this.loadCoupons()
    this.selectDefaultAddress()
  },

  methods: {
    // 加载收货地址
    loadAddresses() {
      // 模拟地址数据
      this.addressList = [
        {
          id: 1,
          name: '张三',
          phone: '13800138000',
          province: '北京市',
          city: '海淀区',
          area: '中关村大街',
          detail: '北京大学学生公寓1号楼101室',
          isDefault: true,
        },
        {
          id: 2,
          name: '李四',
          phone: '13900139000',
          province: '北京市',
          city: '海淀区',
          area: '中关村大街',
          detail: '清华大学东门附近学生宿舍',
          isDefault: false,
        },
      ]
    },

    // 选择默认地址
    selectDefaultAddress() {
      const defaultAddress = this.addressList.find(addr => addr.isDefault)
      if (defaultAddress) {
        this.selectedAddress = defaultAddress
      }
    },

    // 加载优惠券
    loadCoupons() {
      // 模拟优惠券数据
      this.availableCoupons = [
        {
          id: 1,
          title: '新用户专享',
          amount: 5,
          condition: 20,
          expireDate: '2024-12-31',
        },
        {
          id: 2,
          title: '满30减8',
          amount: 8,
          condition: 30,
          expireDate: '2024-12-15',
        },
        {
          id: 3,
          title: '周五特惠',
          amount: 10,
          condition: 40,
          expireDate: '2024-11-30',
        },
      ]
    },

    // 选择地址
    selectAddress(address) {
      this.selectedAddress = address
    },

    // 设为默认地址
    setDefaultAddress(address) {
      this.addressList.forEach(addr => {
        addr.isDefault = addr.id === address.id
      })
      this.selectedAddress = address
    },

    // 添加新地址
    addNewAddress() {
      this.$message.info('添加地址功能开发中...')
    },

    // 选择优惠券
    selectCoupon(coupon) {
      this.selectedCoupon = coupon
    },

    // 确认优惠券选择
    confirmCoupon() {
      this.showCouponDialog = false
    },

    // 提交订单
    async submitOrder() {
      if (!this.canSubmit) return

      this.submitting = true
      try {
        // 模拟订单提交
        await new Promise(resolve => setTimeout(resolve, 2000))

        const orderData = {
          addressId: this.selectedAddress.id,
          deliveryTime: this.deliveryTime === 'asap' ? 'ASAP' : this.selectedDeliveryTime,
          remark: this.orderRemark,
          paymentMethod: this.paymentMethod,
          couponId: this.selectedCoupon ? this.selectedCoupon.id : null,
          products: this.cartProducts,
          totalAmount: this.finalAmount,
        }

        // 清空购物车
        this.clearCart()

        // 跳转到订单详情页面
        this.$router.push({
          path: '/takeout/order-success',
          query: { orderNo: `TK${Date.now()}` },
        })

        this.$message.success('订单提交成功！')
      } catch (error) {
        this.$message.error('订单提交失败，请重试')
        logger.error('订单提交失败', error)
      } finally {
        this.submitting = false
      }
    },

    // 返回
    goBack() {
      this.$router.go(-1)
    },

    // Vuex actions
    ...mapActions('cart', {
      clearCart: 'clearCart',
    }),
  },
}
</script>

<style scoped>
.checkout-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left h1 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

/* 卡片样式 */
.info-card,
.summary-card {
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.info-card .el-card__header,
.summary-card .el-card__header {
  background: #f8f9fa;
  border-radius: 12px 12px 0 0;
}

/* 地址信息 */
.address-info {
  padding: 10px 0;
}

.address-main {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.receiver-name {
  font-weight: bold;
  color: #333;
}

.receiver-phone {
  color: #666;
}

.address-detail {
  color: #666;
  line-height: 1.5;
}

.no-address {
  text-align: center;
  padding: 20px 0;
}

/* 送达时间 */
.time-selector {
  margin-top: 15px;
}

/* 商家订单 */
.merchant-order {
  margin-bottom: 20px;
}

.merchant-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.merchant-header h4 {
  margin: 0;
  color: #333;
}

.delivery-time {
  color: #666;
  font-size: 14px;
}

/* 商品信息 */
.product-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 2px;
}

.product-spec {
  font-size: 12px;
  color: #666;
}

.subtotal {
  font-weight: bold;
  color: #ff4757;
}

/* 订单汇总 */
.summary-content {
  padding: 10px 0;
}

.fee-detail {
  margin-bottom: 15px;
}

.fee-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.fee-item.discount {
  color: #ff4757;
}

.fee-label {
  color: #666;
}

.fee-value {
  color: #333;
  font-weight: bold;
}

.total-amount {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 10px 0;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px;
}

.total-label {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.total-value {
  font-size: 20px;
  font-weight: bold;
  color: #ff4757;
}

/* 优惠券 */
.coupon-section {
  margin-bottom: 20px;
}

.coupon-btn {
  color: #ff4757;
}

.no-coupon {
  color: #999;
  font-size: 14px;
}

/* 支付方式 */
.payment-section {
  margin-bottom: 30px;
}

.payment-section h4 {
  margin: 0 0 10px 0;
  color: #333;
}

/* 提交按钮 */
.submit-section {
  text-align: center;
}

.submit-btn {
  width: 100%;
  padding: 15px;
  font-size: 16px;
  font-weight: bold;
}

/* 地址列表 */
.address-list {
  max-height: 400px;
  overflow-y: auto;
}

.address-item {
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.address-item:hover {
  border-color: #409eff;
}

.address-item.active {
  border-color: #409eff;
  background: #f0f9ff;
}

.address-item .address-main {
  margin-bottom: 8px;
}

.address-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

/* 优惠券列表 */
.coupon-list {
  max-height: 400px;
  overflow-y: auto;
}

.coupon-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.coupon-item:hover {
  border-color: #ff4757;
}

.coupon-item.active {
  border-color: #ff4757;
  background: #fff5f5;
}

.coupon-amount {
  font-size: 24px;
  font-weight: bold;
  color: #ff4757;
  margin-right: 15px;
  min-width: 60px;
}

.coupon-info {
  flex: 1;
}

.coupon-title {
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.coupon-condition,
.coupon-expire {
  font-size: 12px;
  color: #666;
  margin-bottom: 2px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .checkout-container {
    padding: 10px;
  }

  .page-header {
    padding: 10px 15px;
  }

  .el-col {
    margin-bottom: 20px;
  }
}
</style>
