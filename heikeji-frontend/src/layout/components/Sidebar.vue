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
        <div
          v-if="route.children && route.children.length > 0"
          class="menu-item has-children hover-scale"
        >
          <div class="menu-header click-scale" @click="toggleSubMenu(route.path)">
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
                class="sub-menu-item hover-scale click-scale"
                :class="{ 'sub-menu-item-active': route.path === child.path }"
                tag="div"
              >
                <i :class="child.meta.icon || 'el-icon-circle-check'" class="sub-menu-icon"></i>
                <span class="sub-menu-title">{{ child.meta.title }}</span>
              </router-link>
            </div>
          </transition>
        </div>

        <!-- 无子菜单的路由 -->
        <div v-else class="menu-item hover-scale">
          <router-link
            :to="route.path"
            class="menu-link click-scale"
            :class="{ 'menu-link-active': route.path === route.path }"
          >
            <i :class="route.meta.icon || 'el-icon-menu'" class="menu-icon"></i>
            <span class="menu-title">{{ route.meta.title }}</span>
          </router-link>
        </div>
      </div>
    </nav>

    <!-- 侧边栏底部学校文化元素 -->
    <div class="sidebar-footer">
      <div class="school-info">
        <div class="school-logo">
          <img
            src="@/assets/images/school-logo.svg"
            alt="黑龙江科技大学校徽"
            class="sidebar-logo-img"
          />
        </div>
        <div class="school-info-text">
          <div class="school-name">黑龙江科技大学</div>
          <div class="school-slogan">自强不息，创业创新</div>
        </div>
      </div>
      <div class="system-info">
        <div class="system-name">黑科易购校园电商平台</div>
        <div class="system-version">v1.0.0</div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

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

// 获取当前路由
const route = useRoute()

// 方法
const toggleSubMenu = path => {
  emit('toggle-submenu', path)
}

const isSubMenuOpen = path => {
  return props.submenuOpenStatus[path] || false
}
</script>

<style scoped lang="scss">
@import '@/styles/variables.scss';

.sidebar {
  width: $sideBarWidth;
  background-color: $primary;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  height: calc(100vh - #{$header-height});
  position: relative;
  z-index: 100;

  // 添加顶部装饰条
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, $secondary, $primary-light);
  }

  &.sidebar-collapsed {
    width: 80px;
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
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.2);

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
  padding: 20px 0;
  color: #ffffff;

  .menu-item {
    &.has-children .menu-header {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      cursor: pointer;
      transition: all 0.2s;
      color: #ffffff;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }

      .menu-icon {
        font-size: 18px;
        margin-right: 12px;
        color: rgba(255, 255, 255, 0.9);
        flex-shrink: 0;
      }

      .menu-title {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        font-weight: 500;
      }

      .menu-arrow {
        transition: transform 0.3s;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);

        &.rotate {
          transform: rotate(180deg);
        }
      }
    }

    .sub-menu {
      height: 0;
      overflow: hidden;
      transition: height 0.3s ease;
      background-color: rgba(255, 255, 255, 0.05);

      &.sub-menu-open {
        height: auto;
      }

      .sub-menu-item {
        display: flex;
        align-items: center;
        padding: 10px 20px 10px 55px;
        cursor: pointer;
        transition: all 0.2s;
        color: rgba(255, 255, 255, 0.8);
        text-decoration: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 13px;

        &:hover {
          background-color: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        &.sub-menu-item-active {
          background-color: rgba(204, 0, 0, 0.2);
          color: #ffffff;
          position: relative;
          font-weight: 500;

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            bottom: 0;
            width: 3px;
            background-color: $secondary;
          }
        }

        .sub-menu-icon {
          font-size: 13px;
          margin-right: 10px;
          color: rgba(255, 255, 255, 0.7);
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
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      transition: all 0.2s;
      font-size: 14px;
      font-weight: 500;

      &:hover {
        background-color: rgba(255, 255, 255, 0.1);
        color: #ffffff;
      }

      &.menu-link-active {
        background-color: rgba(204, 0, 0, 0.2);
        color: #ffffff;
        position: relative;
        font-weight: 600;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background-color: $secondary;
        }
      }

      .menu-icon {
        font-size: 18px;
        margin-right: 12px;
        color: rgba(255, 255, 255, 0.9);
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
        padding: 15px 10px;

        .menu-title,
        .menu-arrow {
          display: none;
        }
      }

      .menu-link {
        justify-content: center;
        padding: 15px 10px;

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
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;

  &:hover {
    background: rgba(255, 255, 255, 0.4);
  }
}

// 侧边栏底部信息
.sidebar-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background-color: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  text-align: center;

  .footer-text {
    margin: 0;
    line-height: 1.4;
  }

  .footer-year {
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
  }
}

// 侧边栏底部学校文化元素样式
.sidebar-footer {
  padding: 20px;
  margin-top: auto;
  background-color: rgba(0, 0, 0, 0.1);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;

  .school-info {
    display: flex;
    align-items: center;
    margin-bottom: 15px;

    .school-logo {
      margin-right: 15px;
    }

    .sidebar-logo-img {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      object-fit: contain;
    }

    .school-info-text {
      flex: 1;
    }

    .school-name {
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      margin-bottom: 4px;
    }

    .school-slogan {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.8);
      font-style: italic;
    }
  }

  .system-info {
    text-align: center;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);

    .system-name {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.9);
      margin-bottom: 4px;
      font-weight: 500;
    }

    .system-version {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.6);
    }
  }
}

// 折叠状态下隐藏底部信息
.sidebar-collapsed {
  .sidebar-footer {
    display: none;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .sidebar {
    width: 260px;
  }

  .sidebar-footer {
    display: none;
  }
}
</style>
