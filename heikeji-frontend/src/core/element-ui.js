/**
 * ElementUI组件注册模块
 * 负责按需注册ElementUI组件和消息组件
 */

// 基础输入组件
import {
  Button,
  Select,
  Input,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Switch,
  DatePicker,
  TimePicker,
  Upload,
} from 'element-ui'

// 容器和布局组件
import { Card, Alert, Tag, Avatar, Badge, Tooltip, Popover, Loading } from 'element-ui'

// 导航组件
import {
  Breadcrumb,
  BreadcrumbItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
} from 'element-ui'

// 数据展示组件
import { Table, TableColumn, Tabs, TabPane, Pagination } from 'element-ui'

// 对话框组件
import { Dialog, Form, FormItem } from 'element-ui'

// 消息组件
import { Message, Notification, MessageBox } from 'element-ui'

// 组件分组
const elementComponents = {
  // 基础输入组件
  inputComponents: [
    Button,
    Select,
    Input,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
    Switch,
    DatePicker,
    TimePicker,
    Upload,
  ],

  // 容器和布局组件
  containerComponents: [Card, Alert, Tag, Avatar, Badge, Tooltip, Popover, Loading],

  // 导航组件
  navigationComponents: [
    Breadcrumb,
    BreadcrumbItem,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Menu,
    Submenu,
    MenuItem,
    MenuItemGroup,
  ],

  // 数据展示组件
  dataComponents: [Table, TableColumn, Tabs, TabPane, Pagination],

  // 对话框组件
  dialogComponents: [Dialog, Form, FormItem],

  // 消息组件
  messageComponents: {
    Message,
    Notification,
    MessageBox,
  },
}

/**
 * 注册ElementUI组件的辅助函数
 * @param {Array} components - 组件数组
 * @param {Vue} Vue - Vue实例
 */
function registerElementComponents(components, Vue) {
  components.forEach(component => {
    Vue.use(component)
  })
}

/**
 * 注册所有ElementUI组件
 * @param {Vue} Vue - Vue实例
 */
export function registerAllElementUI(Vue) {
  // 批量注册ElementUI组件
  registerElementComponents(elementComponents.inputComponents, Vue)
  registerElementComponents(elementComponents.containerComponents, Vue)
  registerElementComponents(elementComponents.navigationComponents, Vue)
  registerElementComponents(elementComponents.dataComponents, Vue)
  registerElementComponents(elementComponents.dialogComponents, Vue)

  // 确保正确注册消息组件
  Vue.use(Message)
  Vue.use(Notification)
  Vue.use(MessageBox)

  // 挂载到Vue原型上，方便在组件中使用
  Vue.prototype.$message = Message
  Vue.prototype.$notify = Notification
  Vue.prototype.$confirm = MessageBox.confirm
  Vue.prototype.$alert = MessageBox.alert
  Vue.prototype.$prompt = MessageBox.prompt

  return {
    success: true,
    message: 'ElementUI组件注册成功',
  }
}

// 导出组件分组配置（用于按需导入）
export { elementComponents }

// 默认导出注册函数
export default registerAllElementUI
