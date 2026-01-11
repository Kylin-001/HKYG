<!--
@fileoverview 动作菜单组件
@description 支持权限控制、图标+文字、分组显示和快捷操作
@example
  <ActionMenu
    :items="menuItems"
    :permissions="userPermissions"
    @action="handleAction"
    type="dropdown"
  />
-->
<template>
  <div class="action-menu" :class="{ disabled: disabled }">
    <!-- 下拉菜单模式 -->
    <el-dropdown
      v-if="type === 'dropdown'"
      :trigger="trigger"
      :hide-on-click="hideOnClick"
      :show-timeout="showTimeout"
      :hide-timeout="hideTimeout"
      @command="handleAction"
      :disabled="disabled"
    >
      <span class="action-menu-trigger">
        <slot name="trigger">
          <el-button :type="buttonType" :size="buttonSize" :plain="plain" :circle="circle">
            <template v-if="!textOnly">
              <el-icon :size="iconSize"><MoreFilled /></el-icon>
              <template v-if="hasText">{{ text }}</template>
            </template>
            <template v-else>{{ text }}</template>
            <i v-if="hasText" class="el-icon--right el-icon-arrow-down"></i>
          </el-button>
        </slot>
      </span>

      <!-- 菜单内容 -->
      <el-dropdown-menu slot="dropdown" class="action-menu-dropdown">
        <template v-for="group in filteredMenuGroups" :key="group.title || 'default'">
          <!-- 菜单分组标题 -->
          <el-dropdown-item v-if="group.title" disabled class="menu-group-title">
            {{ group.title }}
          </el-dropdown-item>

          <!-- 菜单项 -->
          <el-dropdown-item
            v-for="item in group.items"
            :key="item.key"
            :command="item"
            :disabled="item.disabled || !checkPermission(item)"
            :divided="item.divided"
          >
            <template v-if="item.icon">
              <el-icon :size="iconSize"><component :is="item.icon" /></el-icon>
              <span class="menu-item-text">{{ item.label }}</span>
            </template>
            <template v-else>{{ item.label }}</template>
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </el-dropdown>

    <!-- 按钮组模式 -->
    <div v-else-if="type === 'button-group'" class="action-menu-button-group">
      <el-button-group>
        <el-button
          v-for="item in filteredMenuItems"
          :key="item.key"
          :type="item.type || 'default'"
          :size="buttonSize"
          :plain="item.plain || false"
          :circle="item.circle || false"
          :disabled="item.disabled || !checkPermission(item)"
          :loading="item.loading || false"
          @click="handleAction(item)"
          :class="{ 'action-menu-button': true, 'with-icon': item.icon }"
        >
          <template v-if="item.icon">
            <el-icon :size="iconSize"><component :is="item.icon" /></el-icon>
            <template v-if="!iconOnly"
              ><span class="button-text">{{ item.label }}</span></template
            >
          </template>
          <template v-else>{{ item.label }}</template>
        </el-button>
      </el-button-group>
    </div>

    <!-- 图标组模式 -->
    <div v-else-if="type === 'icon-group'" class="action-menu-icon-group">
      <template v-for="item in filteredMenuItems" :key="item.key">
        <el-tooltip :content="item.label" :placement="tooltipPlacement" :disabled="!tooltip">
          <el-button
            :type="item.type || 'text'"
            :size="buttonSize"
            circle
            :disabled="item.disabled || !checkPermission(item)"
            :loading="item.loading || false"
            @click="handleAction(item)"
            class="action-menu-icon-button"
          >
            <el-icon :size="iconSize"><component :is="item.icon" /></el-icon>
          </el-button>
        </el-tooltip>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MoreFilled } from '@element-plus/icons-vue'

// 定义接口
interface ActionMenuItem {
  key: string
  label: string
  icon?: any
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
  plain?: boolean
  circle?: boolean
  loading?: boolean
  disabled?: boolean
  divided?: boolean
  permission?: string | string[]
  [key: string]: any
}

interface ActionMenuGroup {
  title?: string
  items: ActionMenuItem[]
}

// 定义组件属性
const props = defineProps<{
  // 菜单配置项（支持数组或分组对象）
  items: ActionMenuItem[] | ActionMenuGroup[]
  // 权限列表
  permissions?: string[]
  // 菜单类型：dropdown（下拉菜单）、button-group（按钮组）、icon-group（图标组）
  type?: 'dropdown' | 'button-group' | 'icon-group'
  // 下拉触发方式
  trigger?: 'hover' | 'click' | 'contextmenu'
  // 点击菜单项后是否隐藏菜单
  hideOnClick?: boolean
  // 菜单显示延迟（毫秒）
  showTimeout?: number
  // 菜单隐藏延迟（毫秒）
  hideTimeout?: number
  // 按钮类型
  buttonType?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'text' | 'default'
  // 按钮大小
  buttonSize?: 'large' | 'default' | 'small'
  // 图标大小
  iconSize?: number
  // 是否只显示图标
  iconOnly?: boolean
  // 是否只显示文字
  textOnly?: boolean
  // 是否显示提示
  tooltip?: boolean
  // 提示位置
  tooltipPlacement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'
  // 是否禁用
  disabled?: boolean
  // 下拉按钮文字
  text?: string
  // 是否显示边框
  plain?: boolean
  // 是否为圆形按钮
  circle?: boolean
}>()

// 定义默认值
const defaultProps = {
  type: 'dropdown',
  trigger: 'click',
  hideOnClick: true,
  showTimeout: 200,
  hideTimeout: 150,
  buttonType: 'default',
  buttonSize: 'default',
  iconSize: 16,
  iconOnly: false,
  textOnly: false,
  tooltip: true,
  tooltipPlacement: 'top',
  disabled: false,
  text: '操作',
  plain: false,
  circle: false,
}

// 合并默认值
const mergedProps = { ...defaultProps, ...props }

// 定义事件
const emit = defineEmits<{
  (e: 'action', item: ActionMenuItem, key: string): void
}>()

// 计算属性：是否有文字
const hasText = computed(() => {
  return mergedProps.text && mergedProps.text.length > 0
})

// 计算属性：过滤后的菜单分组（带权限检查）
const filteredMenuGroups = computed(() => {
  const groups: ActionMenuGroup[] = []

  if (Array.isArray(props.items)) {
    // 如果是ActionMenuItem数组，转换为分组格式
    if (props.items.length > 0 && 'key' in props.items[0]) {
      const validItems = (props.items as ActionMenuItem[]).filter(item => checkPermission(item))
      if (validItems.length > 0) {
        groups.push({ items: validItems })
      }
    }
    // 如果是ActionMenuGroup数组，直接处理
    else {
      ;(props.items as ActionMenuGroup[]).forEach(group => {
        const validItems = group.items.filter(item => checkPermission(item))
        if (validItems.length > 0) {
          groups.push({ ...group, items: validItems })
        }
      })
    }
  }

  return groups
})

// 计算属性：过滤后的菜单项（用于按钮组和图标组）
const filteredMenuItems = computed(() => {
  const items: ActionMenuItem[] = []

  filteredMenuGroups.value.forEach(group => {
    items.push(...group.items)
  })

  return items
})

// 权限检查
const checkPermission = (item: ActionMenuItem): boolean => {
  // 如果没有权限配置，默认显示
  if (!item.permission) {
    return true
  }

  // 如果没有提供权限列表，默认显示
  if (!props.permissions || props.permissions.length === 0) {
    return true
  }

  // 单个权限检查
  if (typeof item.permission === 'string') {
    return props.permissions.includes(item.permission)
  }

  // 多个权限检查（满足任一即可）
  if (Array.isArray(item.permission)) {
    return item.permission.some(perm => props.permissions?.includes(perm))
  }

  return true
}

// 处理菜单点击
const handleAction = (item: ActionMenuItem) => {
  emit('action', item, item.key)
}
</script>

<style lang="scss" scoped>
.action-menu {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &.disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  .action-menu-trigger {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .action-menu-dropdown {
    .menu-group-title {
      color: #909399;
      font-weight: 500;
      cursor: default;
      background-color: #f5f7fa;

      &:hover {
        background-color: #f5f7fa;
      }
    }

    .el-dropdown-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .menu-item-text {
        flex: 1;
      }
    }
  }

  .action-menu-button-group {
    .el-button-group {
      .action-menu-button {
        margin: 0;

        &.with-icon {
          display: flex;
          align-items: center;
          gap: 4px;

          .button-text {
            white-space: nowrap;
          }
        }
      }
    }
  }

  .action-menu-icon-group {
    display: flex;
    gap: 4px;

    .action-menu-icon-button {
      padding: 8px;

      &:hover {
        background-color: #f5f7fa;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .action-menu {
    &[data-type='button-group'] {
      .el-button-group {
        .action-menu-button {
          padding: 8px 12px;
          font-size: 12px;

          .button-text {
            display: none;
          }
        }
      }
    }
  }
}
</style>
