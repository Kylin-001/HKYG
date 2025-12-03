<template>
  <div class="breadcrumb-wrapper">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in computedBreadcrumbs"
        :key="index"
        :to="item.path && index < computedBreadcrumbs.length - 1 ? { path: item.path } : null"
        class="breadcrumb-item"
      >
        <i v-if="item.icon" :class="item.icon" class="breadcrumb-icon"></i>
        <span class="breadcrumb-text">{{ item.name }}</span>
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

// 定义面包屑项接口
interface BreadcrumbItem {
  path: string
  name: string
  icon?: string
}

// 定义路由匹配项接口
interface RouteMatched {
  path: string
  name?: string
  hidden?: boolean
  meta?: {
    title?: string
    icon?: string
  }
}

// 定义组件名称
const name = 'Breadcrumb'

// 定义属性
const props = defineProps<{
  breadcrumbs?: BreadcrumbItem[]
}>()

// 路由实例
const route = useRoute()

// 响应式数据
const levelList = ref<RouteMatched[]>([])
const lastBreadcrumbs = ref<BreadcrumbItem[] | null>(null)

// 兼容外部传入的 breadcrumbs 和内部生成的 levelList
const computedBreadcrumbs = computed<BreadcrumbItem[]>(() => {
  // 如果外部传入了 breadcrumbs，使用外部的
  if (props.breadcrumbs && props.breadcrumbs.length > 0) {
    return props.breadcrumbs
  }

  // 否则使用内部生成的 levelList
  return levelList.value.map(item => ({
    path: item.path,
    name: item.meta?.title || (item.name as string) || '',
    icon: item.meta?.icon,
  }))
})

// 监听路由变化
watch(
  () => route,
  () => {
    getBreadcrumb()
  },
  { immediate: true }
)

// 监听外部传入的 breadcrumbs 变化
watch(
  () => props.breadcrumbs,
  newVal => {
    // 优化：只有当面包屑变化时才更新
    if (JSON.stringify(newVal) !== JSON.stringify(lastBreadcrumbs.value)) {
      lastBreadcrumbs.value = JSON.parse(JSON.stringify(newVal)) as BreadcrumbItem[]
    }
  },
  { immediate: true, deep: true }
)

// 获取面包屑数据
const getBreadcrumb = () => {
  // 只需要获取匹配的路由信息
  let matched = route.matched as RouteMatched[]
  // 移除主布局路由
  matched = matched.filter(item => item.name && !item.hidden)
  const first = matched[0]
  // 如果是首页直接返回首页
  if (first && first.path !== '/') {
    matched = [{ path: '/', meta: { title: '首页', icon: 'el-icon-s-home' } }].concat(matched)
  }
  levelList.value = matched
}
</script>

<style lang="scss" scoped>
.breadcrumb-wrapper {
  margin-bottom: 16px;
  background-color: #fff;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #ebeef5;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  }

  // 优化面包屑项目样式
  .breadcrumb-item {
    display: flex;
    align-items: center;
    cursor: pointer;

    &:last-child {
      cursor: default;

      .breadcrumb-text {
        color: #606266;
        font-weight: 500;
      }
    }

    &:not(:last-child) {
      .breadcrumb-text {
        color: $primary-color;
      }

      &:hover {
        .breadcrumb-icon,
        .breadcrumb-text {
          color: $primary-color;
        }
      }
    }

    // 面包屑图标样式
    .breadcrumb-icon {
      font-size: 14px;
      margin-right: 4px;
      color: #909399;
      transition: color 0.2s ease;
    }

    // 面包屑文字样式
    .breadcrumb-text {
      font-size: 14px;
      color: #606266;
      transition: color 0.2s ease;
    }
  }

  // Element UI 面包屑默认样式覆盖
  ::v-deep .el-breadcrumb {
    font-size: 14px;
    line-height: 1.4;

    .el-breadcrumb__item {
      .el-breadcrumb__inner {
        font-weight: 400;

        &:hover {
          color: $primary-color;
        }
      }

      &:last-child .el-breadcrumb__inner {
        color: #606266;
        cursor: default;

        &:hover {
          color: #606266;
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .breadcrumb-wrapper {
    padding: 10px 15px;
    margin-bottom: 12px;

    .breadcrumb-item {
      .breadcrumb-text {
        font-size: 13px;
      }

      .breadcrumb-icon {
        font-size: 12px;
      }
    }

    ::v-deep .el-breadcrumb {
      font-size: 13px;

      .el-breadcrumb__item {
        .el-breadcrumb__inner {
          font-size: 13px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .breadcrumb-wrapper {
    padding: 8px 12px;

    ::v-deep .el-breadcrumb {
      .el-breadcrumb__item {
        .el-breadcrumb__inner {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
