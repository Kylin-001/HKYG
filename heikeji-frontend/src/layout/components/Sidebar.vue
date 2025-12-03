/** * 侧边栏导航组件 * 包含菜单导航、子菜单等功能 */

<template>
  <aside
    :class="[
      'sidebar',
      {
        'sidebar-collapsed': collapsed,
        'sidebar-show': showMobile,
      },
    ]"
  >
    <nav class="sidebar-menu">
      <div v-for="route in routes" :key="route.path">
        <!-- 有子菜单的路由 -->
        <div v-if="route.children && route.children.length > 0" class="menu-item has-children">
          <div class="menu-header" @click="toggleSubMenu(route.path)">
            <i :class="route.meta.icon || 'el-icon-menu'" class="menu-icon"></i>
            <span class="menu-title">{{ route.meta.title }}</span>
            <i
              :class="['el-icon-arrow-down', { rotate: isSubMenuOpen(route.path) }]"
              class="menu-arrow"
            ></i>
          </div>
          <!-- 子菜单 -->
          <transition name="sub-menu" mode="out-in">
            <div v-if="isSubMenuOpen(route.path)" class="sub-menu sub-menu-open">
              <router-link
                v-for="child in route.children.filter(item => !item.hidden)"
                :key="child.path"
                :to="child.path"
                class="sub-menu-item"
                :class="{ 'sub-menu-item-active': $route.path === child.path }"
                tag="div"
              >
                <i :class="child.meta.icon || 'el-icon-circle-check'" class="sub-menu-icon"></i>
                <span class="sub-menu-title">{{ child.meta.title }}</span>
              </router-link>
            </div>
          </transition>
        </div>

        <!-- 无子菜单的路由 -->
        <div v-else class="menu-item">
          <router-link
            :to="route.path"
            class="menu-link"
            :class="{ 'menu-link-active': $route.path === route.path }"
          >
            <i :class="route.meta.icon || 'el-icon-menu'" class="menu-icon"></i>
            <span class="menu-title">{{ route.meta.title }}</span>
          </router-link>
        </div>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
// Props定义
const props = defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
  showMobile: {
    type: Boolean,
    default: false,
  },
  routes: {
    type: Array,
    default: () => [],
  },
  submenuOpenStatus: {
    type: Object,
    default: () => {},
  },
})

// Emits定义
const emit = defineEmits(['toggle-submenu'])

// 方法
const toggleSubMenu = path => {
  emit('toggle-submenu', path)
}

const isSubMenuOpen = path => {
  return props.submenuOpenStatus[path] || false
}
</script>

<style scoped lang="scss">
.sidebar {
  width: $sidebar-width;
  background-color: #fff;
  border-right: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
  height: calc(100vh - #{$header-height});
  position: relative;
  z-index: 100;

  &.sidebar-collapsed {
    width: $sidebar-width-collapsed;
  }

  // 移动端侧边栏样式
  @media (max-width: 768px) {
    position: fixed;
    top: $header-height;
    left: 0;
    bottom: 0;
    width: 80%;
    max-width: 280px;
    transform: translateX(-100%);
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);

    &.sidebar-show {
      transform: translateX(0);
    }

    &.sidebar-collapsed {
      width: 80%;
      transform: translateX(-100%);

      &.sidebar-show {
        transform: translateX(0);
      }
    }
  }
}

// 侧边栏菜单样式
.sidebar-menu {
  padding: 10px 0;

  .menu-item {
    &.has-children .menu-header {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background-color: #f5f7fa;
      }

      .menu-icon {
        font-size: 16px;
        margin-right: 10px;
        color: #606266;
        flex-shrink: 0;
      }

      .menu-title {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .menu-arrow {
        transition: transform 0.3s;
        font-size: 12px;

        &.rotate {
          transform: rotate(180deg);
        }
      }
    }

    .sub-menu {
      height: 0;
      overflow: hidden;
      transition: height 0.3s ease;
      background-color: #fafafa;

      &.sub-menu-open {
        height: auto;
      }

      .sub-menu-item {
        display: flex;
        align-items: center;
        padding: 10px 20px 10px 50px;
        cursor: pointer;
        transition: all 0.2s;
        color: #606266;
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
          background-color: #f5f7fa;
          color: $primary-color;
        }

        &.sub-menu-item-active {
          background-color: #ecf5ff;
          color: $primary-color;
          position: relative;

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background-color: $primary-color;
          }
        }

        .sub-menu-icon {
          font-size: 14px;
          margin-right: 8px;
          flex-shrink: 0;
        }

        .sub-menu-title {
          flex: 1;
        }
      }
    }

    .menu-link {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      color: #606266;
      text-decoration: none;
      transition: all 0.2s;

      &:hover {
        background-color: #f5f7fa;
        color: $primary-color;
      }

      &.menu-link-active {
        background-color: #ecf5ff;
        color: $primary-color;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background-color: $primary-color;
        }
      }

      .menu-icon {
        font-size: 16px;
        margin-right: 10px;
        flex-shrink: 0;
      }

      .menu-title {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}

// 折叠状态下的样式
.sidebar-collapsed {
  .sidebar-menu {
    .menu-item {
      &.has-children .menu-header {
        justify-content: center;
        padding: 12px;

        .menu-title,
        .menu-arrow {
          display: none;
        }
      }

      .menu-link {
        justify-content: center;
        padding: 12px;

        .menu-title {
          display: none;
        }
      }

      .sub-menu {
        display: none;
      }
    }
  }
}

// 子菜单展开动画
.sub-menu-enter-active,
.sub-menu-leave-active {
  transition: all 0.3s ease;
}

.sub-menu-enter-from,
.sub-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

// 滚动条样式优化
.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.sidebar-menu::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
