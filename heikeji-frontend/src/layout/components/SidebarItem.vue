<template>
  <div v-if="!item.hidden" class="sidebar-item">
    <!-- 有子菜单的情况 -->
    <template
      v-if="
        hasOneShowingChild(item.children, item) &&
        (!onlyOneChild.children || onlyOneChild.noShowingChildren) &&
        !item.alwaysShow
      "
    >
      <router-link :to="resolvePath(onlyOneChild.path)" class="sidebar-link">
        <ItemIcon :icon="item.icon || onlyOneChild.icon" />
        <span class="sidebar-label">{{ item.meta.title }}</span>
        <!-- 显示权限标签 -->
        <span v-if="showTags">
          <span v-if="item.meta.new" class="sidebar-badge sidebar-badge-new">新</span>
          <span v-if="item.meta.hot" class="sidebar-badge sidebar-badge-hot">热</span>
        </span>
      </router-link>
    </template>
    <!-- 无子菜单的情况 -->
    <template v-else-if="!item.children || !item.children.length">
      <router-link v-if="item.path" :to="resolvePath(item.path)" class="sidebar-link">
        <ItemIcon :icon="item.icon" />
        <span class="sidebar-label">{{ item.meta.title }}</span>
        <!-- 显示权限标签 -->
        <span v-if="showTags">
          <span v-if="item.meta.new" class="sidebar-badge sidebar-badge-new">新</span>
          <span v-if="item.meta.hot" class="sidebar-badge sidebar-badge-hot">热</span>
        </span>
      </router-link>
    </template>
    <!-- 有多级子菜单的情况 -->
    <template v-else>
      <div class="dropdown-wrapper">
        <router-link
          v-if="item.path"
          :to="resolvePath(item.path)"
          class="sidebar-link dropdown-title"
          @click.stop="toggleOpen"
          @click.prevent
        >
          <ItemIcon :icon="item.icon" />
          <span class="sidebar-label">{{ item.meta.title }}</span>
          <i :class="['el-icon-arrow-down', { rotate90: isOpen }]" />
        </router-link>
        <div v-else class="sidebar-link dropdown-title" @click.stop="toggleOpen">
          <ItemIcon :icon="item.icon" />
          <span class="sidebar-label">{{ item.meta.title }}</span>
          <i :class="['el-icon-arrow-down', { rotate90: isOpen }]" />
        </div>
        <transition name="el-zoom-in-top" mode="out-in">
          <div v-show="isOpen" class="sidebar-submenu">
            <sidebar-item
              v-for="child in item.children"
              :key="child.path"
              :item="child"
              :base-path="resolvePath(child.path)"
              :is-nest="true"
            />
          </div>
        </transition>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps } from 'vue'
import path from 'path'
import ItemIcon from './ItemIcon'

// 定义props类型
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  basePath: {
    type: String,
    default: '',
  },
  isNest: {
    type: Boolean,
    default: false,
  },
})

// 定义响应式变量
const isOpen = ref(false)

// 计算属性
const showTags = computed(() => {
  return props.item.meta && (props.item.meta.new || props.item.meta.hot)
})

const onlyOneChild = computed(() => {
  const onlyOne = {}
  let showingCount = 0
  let noShowingCount = 0
  if (!props.item.children || props.item.children.length === 0) {
    return onlyOne
  }
  props.item.children.forEach(child => {
    if (!child.hidden) {
      onlyOne.path = child.path
      onlyOne.icon = child.icon
      showingCount++
    } else {
      noShowingCount++
    }
  })
  if (showingCount === 1) {
    return onlyOne
  } else {
    onlyOne.noShowingChildren = false
    if (noShowingCount === props.item.children.length) {
      onlyOne.noShowingChildren = true
    }
    return onlyOne
  }
})

// 方法
const resolvePath = routePath => {
  if (routePath === '/' || routePath === '') {
    return props.basePath || ''
  }
  return path.resolve(props.basePath || '', routePath)
}

const hasOneShowingChild = (children = [], parent) => {
  const showingChildren = children.filter(item => {
    if (item.hidden) {
      return false
    } else {
      // 将子节点的隐藏状态，上移给父节点
      if (item.alwaysShow || !item.redirect) {
        parent.redirect = undefined
        parent.alwaysShow = true
      }
      return true
    }
  })
  // 只有一个子路由，且子路由没有隐藏
  if (showingChildren.length === 1) {
    return true
  }
  // 没有子路由，且父路由为索引路由
  if (showingChildren.length === 0) {
    return true
  }
  return false
}

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}
</script>

<style lang="scss" scoped>
@use '@/styles/variables.scss' as *;

.sidebar-item {
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-link {
  position: relative;
  display: block;
  padding: 12px 20px;
  color: $menuText;
  transition: all 0.2s;
  cursor: pointer;
  &:hover {
    color: $menuActiveText;
    background-color: $menuHover;
  }
  &.router-link-active {
    color: $menuActiveText;
    background-color: $menuHover;
  }
}

.sidebar-label {
  display: inline-block;
  margin-left: 10px;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.sidebar-badge {
  position: relative;
  display: inline-block;
  height: 20px;
  padding: 0 8px;
  margin-left: 10px;
  line-height: 20px;
  font-size: 12px;
  color: #fff;
  background-color: #ff4949;
  border-radius: 10px;
  vertical-align: middle;
}

.dropdown-wrapper {
  position: relative;
}

.dropdown-title {
  position: relative;
  & .el-icon-arrow-down {
    transition: transform 0.3s;
    font-size: 12px;
    margin-left: 5px;
  }
  & .rotate90 {
    transform: rotate(90deg);
  }
}

.sidebar-submenu {
  padding-left: 20px;
  background-color: $subMenuBackground;
}

// 嵌套菜单样式
.is-nest {
  .sidebar-link {
    padding-left: 28px;
  }
}
</style>
