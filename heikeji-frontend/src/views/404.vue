<template>
  <div class="page-404">
    <div class="wrapper">
      <div class="error-code">404</div>
      <div class="error-message">抱歉，您访问的页面不存在！</div>
      <div class="error-action">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="back">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.replace('/')
}

function back() {
  router.back()
}
</script>

<style lang="scss" scoped>
.page-404 {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.wrapper {
  text-align: center;
}

.error-code {
  font-size: 120px;
  font-weight: 600;
  color: #667eea;
  line-height: 1.2;
  margin-bottom: 20px;
}

.error-message {
  font-size: 20px;
  color: #909399;
  margin-bottom: 30px;
}

.error-action .el-button {
  margin: 0 10px;
  min-width: 120px;
}

// 响应式适配
@media screen and (max-width: 768px) {
  .error-code {
    font-size: 80px;
  }

  .error-message {
    font-size: 16px;
  }

  .error-action {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .error-action .el-button {
    margin: 10px 0;
    width: 200px;
  }
}
</style>
