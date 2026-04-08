<template>
  <div class="campus-home-page max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
    <h1 class="text-2xl font-bold text-text-primary mb-6">校园服务</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link to="/campus/schedule" class="service-card bg-surface rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all">
        <div class="text-4xl mb-4">📅</div>
        <h3 class="text-lg font-semibold text-text-primary mb-2">课表查询</h3>
        <p class="text-sm text-text-secondary">查看本周课程安排</p>
      </router-link>
      <router-link to="/campus/grades" class="service-card bg-surface rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all">
        <div class="text-4xl mb-4">📊</div>
        <h3 class="text-lg font-semibold text-text-primary mb-2">成绩查询</h3>
        <p class="text-sm text-text-secondary">查看考试成绩</p>
      </router-link>
      <router-link to="/campus/library" class="service-card bg-surface rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all">
        <div class="text-4xl mb-4">📚</div>
        <h3 class="text-lg font-semibold text-text-primary mb-2">图书馆</h3>
        <p class="text-sm text-text-secondary">书籍搜索与座位预约</p>
      </router-link>
      <router-link to="/campus/classroom" class="service-card bg-surface rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all">
        <div class="text-4xl mb-4">🏫</div>
        <h3 class="text-lg font-semibold text-text-primary mb-2">教室预约</h3>
        <p class="text-sm text-text-secondary">查询空闲教室并预约</p>
      </router-link>
      <router-link to="/campus/map" class="service-card bg-surface rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all">
        <div class="text-4xl mb-4">🗺️</div>
        <h3 class="text-lg font-semibold text-text-primary mb-2">校园地图</h3>
        <p class="text-sm text-text-secondary">校园导航与建筑信息</p>
      </router-link>
      <router-link to="/campus/dormitory" class="service-card bg-surface rounded-2xl shadow-sm p-8 hover:shadow-lg transition-all">
        <div class="text-4xl mb-4">🏠</div>
        <h3 class="text-lg font-semibold text-text-primary mb-2">宿舍服务</h3>
        <p class="text-sm text-text-secondary">报修与电费充值</p>
      </router-link>
    </div>
  </div>
</template>
