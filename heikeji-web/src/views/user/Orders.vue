<template>
  <div style="min-height: 100vh; background-color: #f5f7fa;">
    <div style="max-width: 1280px; margin: 0 auto; padding: 32px 16px;">
      <h1 style="font-size: 24px; font-weight: 700; color: #1f2937; margin-bottom: 24px;">我的订单</h1>

      <div style="background: white; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid #f3f4f6; overflow: hidden;">
        <!-- 标签栏 -->
        <div style="border-bottom: 1px solid #f3f4f6;">
          <div style="display: flex; padding: 16px 8px 0; gap: 4px; overflow-x: auto;">
            <button v-for="tab in tabs" :key="tab.value" @click="activeTab = tab.value"
              :style="{
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: 500,
                borderRadius: '12px 12px 0 0',
                whiteSpace: 'nowrap',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                background: activeTab === tab.value ? 'white' : 'transparent',
                color: activeTab === tab.value ? '#4f46e5' : '#6b7280'
              }">
              {{ tab.label }}
              <span v-if="tab.count > 0"
                :style="{
                  marginLeft: '6px',
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  fontSize: '10px',
                  fontWeight: 700,
                  background: activeTab === tab.value ? '#e0e7ff' : '#f3f4f6',
                  color: activeTab === tab.value ? '#4f46e5' : '#6b7280'
                }">
                {{ tab.count }}
              </span>
              <span v-if="activeTab === tab.value" 
                style="position: absolute; bottom: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #6366f1, #a855f7); border-radius: 1px 1px 0 0;"></span>
            </button>
          </div>
        </div>

        <!-- 订单列表 -->
        <div style="padding: 24px;">
          <div v-for="order in filteredOrders" :key="order.id"
            style="border-radius: 16px; border: 1px solid #f3f4f6; overflow: hidden; margin-bottom: 16px; transition: all 0.3s;"
            class="order-card">
            <!-- 订单头部 -->
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px 20px; background: #f9fafb;">
              <div style="display: flex; align-items: center; gap: 16px; font-size: 14px; color: #6b7280;">
                <span>订单号：{{ order.orderNo }}</span>
                <span>{{ formatDate(order.createdAt) }}</span>
              </div>
              <span :style="{
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                ...getStatusStyle(order.status)
              }">
                {{ statusText(order.status) }}
              </span>
            </div>

            <!-- 订单商品列表 -->
            <div style="padding: 20px;">
              <div v-for="(item, index) in order.items" :key="item.id"
                style="display: flex; gap: 16px; margin-bottom: 16px;"
                :style="{ borderBottom: index < order.items.length - 1 ? '1px solid #f3f4f6' : 'none', paddingBottom: index < order.items.length - 1 ? '16px' : '0' }">
                <img :src="item.productImage || defaultImage" 
                  style="width: 96px; height: 96px; border-radius: 12px; object-fit: cover; flex-shrink: 0;"
                  @error="$event.target.src = defaultImage" />
                <div style="min-width: 0; flex: 1;">
                  <h3 style="font-weight: 500; color: #1f2937; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">{{ item.productName || '商品' }}</h3>
                  <p style="font-size: 14px; color: #9ca3af; margin-top: 4px;">{{ formatSpecs(item.specifications) }}</p>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
                    <span style="font-weight: 700; font-size: 18px;" :style="{ color: order.status === 'cancelled' ? '#9ca3af' : '#ef4444' }">¥{{ (item.price ?? 0).toFixed(2) }}</span>
                    <span style="font-size: 14px; color: #9ca3af;">x{{ item.quantity ?? 1 }}</span>
                  </div>
                </div>
              </div>

              <!-- 订单底部 -->
              <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid #f9fafb;">
                <div style="font-size: 14px; color: #9ca3af;">
                  共{{ getTotalQuantity(order) }}件商品，实付
                  <span style="font-weight: 700; font-size: 16px; color: #1f2937; margin-left: 4px;">¥{{ (order.finalAmount ?? order.totalAmount ?? 0).toFixed(2) }}</span>
                </div>
                <div style="display: flex; gap: 8px;">
                  <button v-if="order.status === 'pending' || order.status === 'pending_payment'" @click="openCancelDialog(order)"
                    style="padding: 6px 16px; border-radius: 9999px; font-size: 14px; border: 1px solid #e5e7eb; background: white; color: #4b5563; cursor: pointer;">
                    取消订单
                  </button>
                  <button v-if="order.status === 'pending' || order.status === 'pending_payment'" @click="payOrder(order)"
                    style="padding: 6px 16px; border-radius: 9999px; font-size: 14px; border: none; background: linear-gradient(90deg, #6366f1, #a855f7); color: white; cursor: pointer; box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.2);">
                    去付款
                  </button>
                  <button v-if="order.status === 'shipped' || order.status === 'delivered'" @click="viewLogistics(order)"
                    style="padding: 6px 16px; border-radius: 9999px; font-size: 14px; border: 1px solid #e0e7ff; background: white; color: #4f46e5; cursor: pointer;">
                    查看物流
                  </button>
                  <button v-if="order.status === 'shipped' || order.status === 'delivered'" 
                    @click="openConfirmDialog(order)"
                    style="padding: 6px 16px; border-radius: 9999px; font-size: 14px; border: none; background: linear-gradient(90deg, #10b981, #14b8a6); color: white; cursor: pointer; z-index: 100; position: relative;">
                    确认收货
                  </button>
                  <button v-if="order.status === 'completed'" @click="buyAgain(order)"
                    style="padding: 6px 16px; border-radius: 9999px; font-size: 14px; border: 1px solid #e5e7eb; background: white; color: #4b5563; cursor: pointer;">
                    再次购买
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="filteredOrders.length === 0" style="text-align: center; padding: 64px 0;">
            <div style="width: 96px; height: 96px; margin: 0 auto 16px; background: #f9fafb; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
              <el-icon :size="44" style="color: #d1d5db;"><Document /></el-icon>
            </div>
            <p style="color: #9ca3af; margin-bottom: 4px;">暂无相关订单</p>
            <p style="color: #d1d5db; font-size: 14px;">去逛逛吧~</p>
            <button style="margin-top: 16px; padding: 8px 32px; border-radius: 9999px; border: none; background: #0056b3; color: white; font-size: 14px; cursor: pointer;" @click="$router.push('/')">去购物</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义确认收货对话框 -->
    <Teleport to="body">
      <Transition name="dialog-fade">
        <div v-if="confirmDialog.show" 
          style="position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); padding: 16px;"
          @click.self="closeConfirmDialog">
          <div style="background: white; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); max-width: 400px; width: 100%; overflow: hidden; transform: scale(1); animation: dialog-pop 0.3s ease-out;">
            <!-- 头部图标 -->
            <div style="padding: 32px 32px 16px; text-align: center;">
              <div style="width: 72px; height: 72px; margin: 0 auto; border-radius: 50%; background: linear-gradient(135deg, #d1fae5, #a7f3d0); display: flex; align-items: center; justify-content: center;">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
            </div>
            
            <!-- 内容 -->
            <div style="padding: 0 32px 24px; text-align: center;">
              <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">确认收货</h3>
              <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
                确认已收到商品？<br>
                <span style="font-size: 12px; color: #9ca3af;">确认后订单将标记为已完成</span>
              </p>
            </div>
            
            <!-- 按钮 -->
            <div style="display: flex; gap: 12px; padding: 0 32px 32px;">
              <button @click="closeConfirmDialog"
                style="flex: 1; padding: 14px; border-radius: 12px; border: 1px solid #e5e7eb; background: white; color: #4b5563; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s;"
                class="dialog-btn-cancel">
                取消
              </button>
              <button @click="executeConfirmReceive"
                :disabled="confirmDialog.isConfirming"
                style="flex: 1; padding: 14px; border-radius: 12px; border: none; background: linear-gradient(135deg, #10b981, #059669); color: white; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;"
                class="dialog-btn-confirm">
                <svg v-if="confirmDialog.isConfirming" style="animation: spin 1s linear infinite;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                {{ confirmDialog.isConfirming ? '确认中...' : '确认收货' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 再次购买成功对话框 -->
    <Teleport to="body">
      <Transition name="dialog-fade">
        <div v-if="buyAgainDialog.show" 
          style="position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); padding: 16px;"
          @click.self="closeBuyAgainDialog">
          <div style="background: white; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); max-width: 420px; width: 100%; overflow: hidden; transform: scale(1);">
            <!-- 头部图标 -->
            <div style="padding: 32px 32px 16px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto; border-radius: 50%; background: linear-gradient(135deg, #dbeafe, #bfdbfe); display: flex; align-items: center; justify-content: center;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </div>
            </div>
            
            <!-- 内容 -->
            <div style="padding: 0 32px 24px; text-align: center;">
              <h3 style="font-size: 22px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">添加成功</h3>
              <p style="font-size: 15px; color: #6b7280; line-height: 1.6;">
                已将 <span style="color: #3b82f6; font-weight: 600;">{{ buyAgainDialog.addedCount }}</span> 件商品加入购物车
              </p>
              
              <!-- 商品列表预览 -->
              <div v-if="buyAgainDialog.items.length > 0" style="margin-top: 16px; padding: 12px; background: #f9fafb; border-radius: 12px; text-align: left;">
                <div v-for="(item, index) in buyAgainDialog.items.slice(0, 3)" :key="index"
                  style="display: flex; align-items: center; gap: 10px; padding: 6px 0;"
                  :style="{ borderBottom: index < Math.min(buyAgainDialog.items.length, 3) - 1 ? '1px solid #e5e7eb' : 'none' }">
                  <img :src="item.productImage || defaultImage" 
                    style="width: 40px; height: 40px; border-radius: 8px; object-fit: cover;"
                    @error="$event.target.src = defaultImage" />
                  <div style="flex: 1; min-width: 0;">
                    <p style="font-size: 13px; color: #374151; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{{ item.productName }}</p>
                    <p style="font-size: 12px; color: #9ca3af;">x{{ item.quantity }}</p>
                  </div>
                </div>
                <div v-if="buyAgainDialog.items.length > 3" style="text-align: center; padding-top: 8px; font-size: 12px; color: #9ca3af;">
                  还有 {{ buyAgainDialog.items.length - 3 }} 件商品...
                </div>
              </div>
            </div>
            
            <!-- 按钮 -->
            <div style="display: flex; gap: 12px; padding: 0 32px 32px;">
              <button @click="closeBuyAgainDialog"
                style="flex: 1; padding: 14px; border-radius: 12px; border: 1px solid #e5e7eb; background: white; color: #4b5563; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s;"
                class="dialog-btn-cancel">
                继续浏览
              </button>
              <button @click="goToCart"
                style="flex: 1; padding: 14px; border-radius: 12px; border: none; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;"
                class="dialog-btn-cart">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                去购物车
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 物流追踪对话框 -->
    <Teleport to="body">
      <Transition name="dialog-fade">
        <div v-if="logisticsDialog.show"
          style="position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); padding: 16px;"
          @click.self="closeLogisticsDialog">
          <div style="background: white; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); max-width: 480px; width: 100%; overflow: hidden; transform: scale(1); max-height: 80vh; display: flex; flex-direction: column;">
            <!-- 头部 -->
            <div style="padding: 24px 24px 16px; border-bottom: 1px solid #f3f4f6;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <h3 style="font-size: 18px; font-weight: 700; color: #1f2937;">物流追踪</h3>
                <button @click="closeLogisticsDialog" style="background: none; border: none; cursor: pointer; padding: 4px; color: #9ca3af;">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 加载状态 -->
            <div v-if="logisticsDialog.loading" style="padding: 48px; text-align: center;">
              <div style="width: 48px; height: 48px; margin: 0 auto 16px; border: 3px solid #f3f4f6; border-top-color: #4f46e5; border-radius: 50%; animation: spin 1s linear infinite;"></div>
              <p style="color: #6b7280; font-size: 14px;">正在查询物流信息...</p>
            </div>

            <!-- 物流内容 -->
            <div v-else style="padding: 20px 24px; overflow-y: auto; flex: 1;">
              <!-- 物流信息卡片 -->
              <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); border-radius: 16px; padding: 20px; margin-bottom: 20px;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                  <div style="width: 48px; height: 48px; background: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
                      <rect x="1" y="3" width="15" height="13"></rect>
                      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                      <circle cx="5.5" cy="18.5" r="2.5"></circle>
                      <circle cx="18.5" cy="18.5" r="2.5"></circle>
                    </svg>
                  </div>
                  <div>
                    <p style="font-weight: 600; color: #1f2937; font-size: 16px;">{{ logisticsDialog.logistics.company }}</p>
                    <p style="font-size: 13px; color: #6b7280; margin-top: 2px;">{{ logisticsDialog.logistics.status }}</p>
                  </div>
                </div>

                <!-- 运单号 -->
                <div style="background: white; border-radius: 10px; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <p style="font-size: 12px; color: #9ca3af; margin-bottom: 2px;">运单号</p>
                    <p style="font-weight: 600; color: #1f2937; font-size: 15px; font-family: monospace;">{{ logisticsDialog.logistics.trackingNo }}</p>
                  </div>
                  <button @click="copyTrackingNo" style="padding: 8px 16px; border-radius: 8px; border: 1px solid #e0e7ff; background: white; color: #4f46e5; font-size: 13px; cursor: pointer; display: flex; align-items: center; gap: 6px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    复制
                  </button>
                </div>
              </div>

              <!-- 物流轨迹时间线 -->
              <div style="position: relative;">
                <h4 style="font-size: 14px; font-weight: 600; color: #374151; margin-bottom: 16px;">物流详情</h4>

                <div v-for="(trace, index) in logisticsDialog.logistics.traces" :key="index"
                  style="display: flex; gap: 16px; position: relative; padding-bottom: 24px;"
                  :style="{ paddingBottom: index < logisticsDialog.logistics.traces.length - 1 ? '24px' : '0' }">

                  <!-- 时间线 -->
                  <div style="display: flex; flex-direction: column; align-items: center; flex-shrink: 0;">
                    <!-- 节点 -->
                    <div :style="{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: trace.status === 'current' ? '#3b82f6' : '#d1d5db',
                      border: '2px solid white',
                      boxShadow: trace.status === 'current' ? '0 0 0 4px rgba(59, 130, 246, 0.2)' : 'none'
                    }"></div>
                    <!-- 连接线 -->
                    <div v-if="index < logisticsDialog.logistics.traces.length - 1" style="width: 2px; flex: 1; background: #e5e7eb; margin-top: 4px;"></div>
                  </div>

                  <!-- 内容 -->
                  <div style="flex: 1; margin-top: -4px;">
                    <p :style="{
                      fontSize: '14px',
                      lineHeight: '1.5',
                      color: trace.status === 'current' ? '#1f2937' : '#6b7280',
                      fontWeight: trace.status === 'current' ? 500 : 400
                    }">{{ trace.content }}</p>
                    <p style="font-size: 12px; color: #9ca3af; margin-top: 4px;">{{ trace.time }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 底部按钮 -->
            <div style="padding: 16px 24px 24px; border-top: 1px solid #f3f4f6;">
              <button @click="closeLogisticsDialog"
                style="width: 100%; padding: 14px; border-radius: 12px; border: none; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; font-size: 15px; font-weight: 600; cursor: pointer;">
                我知道了
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 取消订单确认对话框 -->
    <Teleport to="body">
      <Transition name="dialog-fade">
        <div v-if="cancelOrderDialog.show"
          style="position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); padding: 16px;"
          @click.self="closeCancelDialog">
          <div style="background: white; border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); max-width: 400px; width: 100%; overflow: hidden; transform: scale(1);">
            <!-- 头部图标 -->
            <div style="padding: 32px 32px 16px; text-align: center;">
              <div style="width: 72px; height: 72px; margin: 0 auto; border-radius: 50%; background: linear-gradient(135deg, #fee2e2, #fecaca); display: flex; align-items: center; justify-content: center;">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
            </div>
            
            <!-- 内容 -->
            <div style="padding: 0 32px 24px; text-align: center;">
              <h3 style="font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 8px;">确认取消订单</h3>
              <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
                确定要取消该订单吗？<br>
                <span style="font-size: 12px; color: #9ca3af;">取消后订单将无法恢复</span>
              </p>
              
              <!-- 订单信息预览 -->
              <div v-if="cancelOrderDialog.order" style="margin-top: 16px; padding: 12px; background: #f9fafb; border-radius: 12px; text-align: left;">
                <p style="font-size: 13px; color: #374151; font-weight: 500;">订单号：{{ cancelOrderDialog.order.orderNo || cancelOrderDialog.order.id }}</p>
                <p style="font-size: 13px; color: #6b7280; margin-top: 4px;">实付金额：<span style="color: #dc2626; font-weight: 600;">¥{{ (cancelOrderDialog.order.finalAmount || cancelOrderDialog.order.totalAmount || 0).toFixed(2) }}</span></p>
              </div>
            </div>
            
            <!-- 按钮 -->
            <div style="display: flex; gap: 12px; padding: 0 32px 32px;">
              <button @click="closeCancelDialog"
                style="flex: 1; padding: 14px; border-radius: 12px; border: 1px solid #e5e7eb; background: white; color: #4b5563; font-size: 15px; font-weight: 500; cursor: pointer; transition: all 0.2s;"
                class="dialog-btn-cancel">
                再想想
              </button>
              <button @click="executeCancelOrder"
                :disabled="cancelOrderDialog.isCancelling"
                style="flex: 1; padding: 14px; border-radius: 12px; border: none; background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px;"
                class="dialog-btn-danger">
                <svg v-if="cancelOrderDialog.isCancelling" style="animation: spin 1s linear infinite;" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
                </svg>
                {{ cancelOrderDialog.isCancelling ? '取消中...' : '确认取消' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document } from '@element-plus/icons-vue'
import { useOrderStore } from '@/stores/order'
import { useCartStore } from '@/stores/cart'
import { useRouter, useRoute } from 'vue-router'
import * as cartApi from '@/api/cart'
import type { Order, OrderItem } from '@/types/order'

const orderStore = useOrderStore()
const cartStore = useCartStore()
const router = useRouter()
const route = useRoute()

// 默认商品图片 - 使用 data URI 避免网络请求
const defaultImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96"%3E%3Crect width="96" height="96" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="14"%3E无图片%3C/text%3E%3C/svg%3E'

// 从 URL 参数获取初始状态
const getInitialTab = () => {
  const status = route.query.status as string
  if (status && ['pending_payment', 'pending_shipment', 'shipped', 'completed'].includes(status)) {
    return status
  }
  return 'all'
}

const activeTab = ref(getInitialTab())

// 监听 URL 参数变化
watch(() => route.query.status, (newStatus) => {
  if (newStatus && ['pending_payment', 'pending_shipment', 'shipped', 'completed'].includes(newStatus as string)) {
    activeTab.value = newStatus as string
  }
})

// 确认收货对话框状态 - 使用 reactive 对象来避免 Vue 警告
const confirmDialog = ref({
  show: false,
  isConfirming: false,
  currentOrder: null as Order | null
})

// 再次购买成功对话框状态
const buyAgainDialog = ref({
  show: false,
  addedCount: 0,
  items: [] as OrderItem[]
})

// 取消订单确认对话框状态
const cancelOrderDialog = ref({
  show: false,
  order: null as Order | null,
  isCancelling: false
})

// 打开确认收货对话框
function openConfirmDialog(order: Order) {
  confirmDialog.value.currentOrder = order
  confirmDialog.value.show = true
}

// 关闭确认收货对话框
function closeConfirmDialog() {
  confirmDialog.value.show = false
  confirmDialog.value.currentOrder = null
  confirmDialog.value.isConfirming = false
}

// 关闭再次购买成功对话框
function closeBuyAgainDialog() {
  buyAgainDialog.value.show = false
  buyAgainDialog.value.addedCount = 0
  buyAgainDialog.value.items = []
}

// 跳转到购物车
function goToCart() {
  closeBuyAgainDialog()
  router.push('/cart')
}

// 执行确认收货
async function executeConfirmReceive() {
  if (!confirmDialog.value.currentOrder) return
  
  confirmDialog.value.isConfirming = true
  try {
    await orderStore.confirmReceive(String(confirmDialog.value.currentOrder.id))
    ElMessage.success('已确认收货')
    closeConfirmDialog()
  } catch (err: any) {
    console.error('[Orders] Error:', err)
    ElMessage.error(err.message || '操作失败')
  } finally {
    confirmDialog.value.isConfirming = false
  }
}

const tabs = computed(() => {
  const orders = orderStore.orders
  return [
    { label: '全部', value: 'all', count: orders.length },
    { label: '待付款', value: 'pending_payment', count: orders.filter(o => o.status === 'pending' || o.status === 'pending_payment').length },
    { label: '待发货', value: 'pending_shipment', count: orders.filter(o => o.status === 'paid' || o.status === 'pending_shipment').length },
    { label: '待收货', value: 'shipped', count: orders.filter(o => o.status === 'shipped' || o.status === 'delivered').length },
    { label: '已完成', value: 'completed', count: orders.filter(o => o.status === 'completed').length }
  ]
})

const orders = computed(() => orderStore.orders)

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value
  if (activeTab.value === 'pending_payment') return orders.value.filter(o => o.status === 'pending' || o.status === 'pending_payment')
  if (activeTab.value === 'pending_shipment') return orders.value.filter(o => o.status === 'paid' || o.status === 'pending_shipment')
  if (activeTab.value === 'shipped') return orders.value.filter(o => o.status === 'shipped' || o.status === 'delivered')
  return orders.value.filter(o => o.status === activeTab.value)
})

function statusText(status: string): string {
  const map: Record<string, string> = {
    pending: '待付款', pending_payment: '待付款', 
    pending_shipment: '待发货', paid: '待发货',
    shipped: '待收货', delivered: '待收货',
    completed: '已完成', cancelled: '已取消'
  }
  return map[status] || status
}

function getStatusStyle(status: string): { background: string; color: string } {
  const map: Record<string, { background: string; color: string }> = {
    pending: { background: '#ffedd5', color: '#ea580c' },
    pending_payment: { background: '#ffedd5', color: '#ea580c' },
    paid: { background: '#dbeafe', color: '#2563eb' },
    pending_shipment: { background: '#dbeafe', color: '#2563eb' },
    shipped: { background: '#d1fae5', color: '#059669' },
    delivered: { background: '#d1fae5', color: '#059669' },
    completed: { background: '#f3f4f6', color: '#4b5563' },
    cancelled: { background: '#f3f4f6', color: '#9ca3af' }
  }
  return map[status] || { background: '#f3f4f6', color: '#4b5563' }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function formatSpecs(specs?: Record<string, string>): string {
  if (!specs) return ''
  return Object.entries(specs).map(([key, value]) => `${key}: ${value}`).join(' | ')
}

function getTotalQuantity(order: Order): number {
  if (!order.items || order.items.length === 0) return 0
  return order.items.reduce((sum: number, item: OrderItem) => sum + (item.quantity || 0), 0)
}

function openCancelDialog(order: Order) {
  cancelOrderDialog.value.order = order
  cancelOrderDialog.value.show = true
}

function closeCancelDialog() {
  cancelOrderDialog.value.show = false
  cancelOrderDialog.value.order = null
  cancelOrderDialog.value.isCancelling = false
}

async function executeCancelOrder() {
  if (!cancelOrderDialog.value.order) return
  
  cancelOrderDialog.value.isCancelling = true
  try {
    await orderStore.cancelOrder(String(cancelOrderDialog.value.order.id))
    ElMessage.success('订单已取消')
    closeCancelDialog()
  } catch (err: any) {
    ElMessage.error(err.message || '取消失败')
  } finally {
    cancelOrderDialog.value.isCancelling = false
  }
}

function payOrder(order: Order) {
  // 跳转到支付页面
  router.push(`/payment?orderId=${order.id}&amount=${order.finalAmount || order.totalAmount || 0}`)
}

// 物流追踪对话框状态
const logisticsDialog = ref({
  show: false,
  loading: false,
  order: null as Order | null,
  logistics: {
    company: '',
    trackingNo: '',
    status: '',
    traces: [] as Array<{
      time: string
      content: string
      status: string
    }>
  }
})

// 打开物流追踪对话框
async function viewLogistics(order: Order) {
  logisticsDialog.value.order = order
  logisticsDialog.value.show = true
  logisticsDialog.value.loading = true

  try {
    // 模拟获取物流数据，实际项目中应该调用API
    // const data = await orderApi.getLogistics(order.id)

    // 模拟数据
    await new Promise(resolve => setTimeout(resolve, 800))

    logisticsDialog.value.logistics = {
      company: '顺丰速运',
      trackingNo: 'SF' + Math.random().toString(36).substr(2, 10).toUpperCase(),
      status: '运输中',
      traces: [
        {
          time: new Date().toLocaleString('zh-CN'),
          content: '快件已到达【哈尔滨南岗区营业部】',
          status: 'current'
        },
        {
          time: new Date(Date.now() - 3600000 * 4).toLocaleString('zh-CN'),
          content: '快件已发往【哈尔滨南岗区营业部】',
          status: 'completed'
        },
        {
          time: new Date(Date.now() - 3600000 * 12).toLocaleString('zh-CN'),
          content: '快件已到达【哈尔滨转运中心】',
          status: 'completed'
        },
        {
          time: new Date(Date.now() - 3600000 * 18).toLocaleString('zh-CN'),
          content: '快件已发往【哈尔滨转运中心】',
          status: 'completed'
        },
        {
          time: new Date(Date.now() - 3600000 * 24).toLocaleString('zh-CN'),
          content: '【北京市】快件已揽收',
          status: 'completed'
        }
      ]
    }
  } catch (err) {
    console.error('获取物流信息失败:', err)
    ElMessage.error('获取物流信息失败')
  } finally {
    logisticsDialog.value.loading = false
  }
}

// 关闭物流追踪对话框
function closeLogisticsDialog() {
  logisticsDialog.value.show = false
  logisticsDialog.value.order = null
  logisticsDialog.value.logistics = {
    company: '',
    trackingNo: '',
    status: '',
    traces: []
  }
}

// 复制运单号
function copyTrackingNo() {
  if (!logisticsDialog.value.logistics.trackingNo) return

  navigator.clipboard.writeText(logisticsDialog.value.logistics.trackingNo).then(() => {
    ElMessage.success('运单号已复制')
  }).catch(() => {
    ElMessage.error('复制失败')
  })
}



async function buyAgain(order: Order) {
  if (!order.items || order.items.length === 0) {
    ElMessage.warning('订单中没有商品')
    return
  }

  try {
    // 将订单中的商品添加到购物车
    let addedCount = 0
    for (const item of order.items) {
      try {
        await cartApi.addToCart({
          productId: item.productId,
          quantity: item.quantity
        })
        addedCount++
      } catch (err) {
        console.error(`添加商品 ${item.productName} 失败:`, err)
      }
    }

    // 刷新购物车数据
    await cartStore.fetchCart()

    if (addedCount > 0) {
      // 显示美观的成功对话框
      buyAgainDialog.value.addedCount = addedCount
      buyAgainDialog.value.items = order.items
      buyAgainDialog.value.show = true
    } else {
      ElMessage.warning('商品添加失败，请稍后重试')
    }
  } catch (err: any) {
    console.error('[Orders] 再次购买失败:', err)
    ElMessage.error(err.message || '操作失败')
  }
}

onMounted(async () => {
  console.log('[Orders] Component mounted, fetching orders...')
  try {
    await orderStore.fetchOrders()
    console.log('[Orders] Orders fetched successfully:', orderStore.orders)
  } catch (err: any) {
    console.error('[Orders] Failed to fetch orders:', err)
    ElMessage.error(err.message || '获取订单列表失败')
  }
})
</script>

<style scoped>
/* 隐藏滚动条 */
::-webkit-scrollbar {
  display: none;
}

/* 订单卡片悬停效果 */
.order-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border-color: #e0e7ff;
}

/* 对话框动画 */
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
}

.dialog-fade-enter-active > div,
.dialog-fade-leave-active > div {
  transition: transform 0.3s ease;
}

.dialog-fade-enter-from > div,
.dialog-fade-leave-to > div {
  transform: scale(0.9);
}

/* 按钮悬停效果 */
.dialog-btn-cancel:hover {
  background: #f9fafb !important;
  border-color: #d1d5db !important;
}

.dialog-btn-confirm:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  transform: translateY(-1px);
}

.dialog-btn-confirm:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 危险按钮样式（取消订单） */
.dialog-btn-danger:hover:not(:disabled) {
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.4);
  transform: translateY(-1px);
}

.dialog-btn-danger:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* 再次购买对话框按钮样式 */
.dialog-btn-cart {
  background: linear-gradient(135deg, #3b82f6, #2563eb) !important;
}

.dialog-btn-cart:hover {
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4) !important;
  transform: translateY(-1px);
}

/* 加载动画 */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
