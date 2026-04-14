<template>
  <div class="about-page">
    <div class="container">
      <!-- 页面标题 -->
      <div class="page-header">
        <div class="header-icon">
          <el-icon :size="32" color="#fff"><InfoFilled /></el-icon>
        </div>
        <h1>关于我们</h1>
        <p>黑科易购 - 黑龙江科技大学校园电商平台</p>
      </div>

      <!-- 平台介绍 -->
      <div class="content-card">
        <h2>平台简介</h2>
        <p class="description">
          黑科易购是专为黑龙江科技大学师生打造的校园电商平台，致力于提供便捷、安全、优质的校园购物服务。
          我们整合了校园周边优质商家资源，为师生提供食品生鲜、数码家电、图书文具、日用百货等多品类商品。
        </p>
        
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-number">10,000+</div>
            <div class="stat-label">注册用户</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">500+</div>
            <div class="stat-label">合作商家</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">50,000+</div>
            <div class="stat-label">商品数量</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">99%</div>
            <div class="stat-label">好评率</div>
          </div>
        </div>
      </div>

      <!-- 核心功能 -->
      <div class="content-card">
        <h2>核心功能</h2>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon blue">
              <el-icon :size="24" color="#fff"><ShoppingCart /></el-icon>
            </div>
            <h3>便捷购物</h3>
            <p>一键下单，快速配送，支持多种支付方式</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon green">
              <el-icon :size="24" color="#fff"><Ticket /></el-icon>
            </div>
            <h3>优惠福利</h3>
            <p>专属学生优惠，积分兑换，限时秒杀</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon purple">
              <el-icon :size="24" color="#fff"><ChatDotRound /></el-icon>
            </div>
            <h3>校园社区</h3>
            <p>二手交易，失物招领，校园资讯</p>
          </div>
          <div class="feature-item">
            <div class="feature-icon orange">
              <el-icon :size="24" color="#fff"><School /></el-icon>
            </div>
            <h3>校园服务</h3>
            <p>学工办理，缴费中心，校园卡服务</p>
          </div>
        </div>
      </div>

      <!-- 联系我们 -->
      <div class="content-card">
        <h2>联系我们</h2>
        <div class="contact-list">
          <div class="contact-item">
            <el-icon :size="20" color="#6366f1"><Location /></el-icon>
            <span>黑龙江省哈尔滨市南岗区黑龙江科技大学</span>
          </div>
          <div class="contact-item">
            <el-icon :size="20" color="#6366f1"><Message /></el-icon>
            <span>support@heikeji.edu.cn</span>
          </div>
          <div class="contact-item">
            <el-icon :size="20" color="#6366f1"><Phone /></el-icon>
            <span>400-123-4567</span>
          </div>
        </div>
      </div>

      <!-- 版本信息 -->
      <div class="version-card">
        <p>黑科易购 v2.0.0</p>
        <p class="copyright">© 2024 黑龙江科技大学 版权所有</p>
        <p class="motto">厚德博学 · 强吾兴邦</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { InfoFilled, ShoppingCart, Ticket, ChatDotRound, School, Location, Message, Phone } from '@element-plus/icons-vue'
</script>

<style scoped>
.about-page {
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
  text-align: center;
  margin-bottom: 32px;
}

.header-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.3);
}

.page-header h1 {
  font-size: 28px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
}

/* 内容卡片 */
.content-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
}

.content-card h2 {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 16px 0;
}

.description {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.8;
  margin: 0 0 24px 0;
}

/* 统计数据 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (min-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #6366f1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
}

/* 功能特性 */
.features-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 16px;
}

@media (min-width: 640px) {
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 12px;
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.feature-icon.blue {
  background: linear-gradient(135deg, #60a5fa 0%, #4f46e5 100%);
}

.feature-icon.green {
  background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
}

.feature-icon.purple {
  background: linear-gradient(135deg, #c084fc 0%, #a855f7 100%);
}

.feature-icon.orange {
  background: linear-gradient(135deg, #fb923c 0%, #f97316 100%);
}

.feature-item h3 {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0 0 8px 0;
}

.feature-item p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

/* 联系方式 */
.contact-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #4b5563;
}

/* 版本信息 */
.version-card {
  text-align: center;
  padding: 24px;
  color: #6b7280;
}

.version-card p {
  margin: 0 0 8px 0;
  font-size: 14px;
}

.version-card .copyright {
  font-size: 12px;
  color: #9ca3af;
}

.version-card .motto {
  font-size: 13px;
  color: #6366f1;
  font-weight: 500;
  margin-top: 16px;
}
</style>
