/**
 * Iconify 图标映射
 * 统一管理项目中使用的图标
 *
 * 图标来源:
 * - mdi: Material Design Icons
 * - ph: Phosphor Icons
 * - lucide: Lucide Icons
 * - heroicons: Heroicons
 * - fluent: Fluent UI Icons
 * - carbon: Carbon Icons
 *
 * 查找图标: https://icon-sets.iconify.design/
 */

// 常用图标映射
export const icons = {
  // 导航类
  home: 'mdi:home',
  user: 'mdi:account',
  users: 'mdi:account-group',
  settings: 'mdi:cog',
  logout: 'mdi:logout',
  menu: 'mdi:menu',
  close: 'mdi:close',
  back: 'mdi:arrow-left',
  forward: 'mdi:arrow-right',
  up: 'mdi:arrow-up',
  down: 'mdi:arrow-down',

  // 操作类
  add: 'mdi:plus',
  edit: 'mdi:pencil',
  delete: 'mdi:delete',
  search: 'mdi:magnify',
  filter: 'mdi:filter',
  sort: 'mdi:sort',
  refresh: 'mdi:refresh',
  download: 'mdi:download',
  upload: 'mdi:upload',
  share: 'mdi:share',
  print: 'mdi:printer',
  copy: 'mdi:content-copy',
  paste: 'mdi:content-paste',
  cut: 'mdi:content-cut',

  // 状态类
  success: 'mdi:check-circle',
  error: 'mdi:alert-circle',
  warning: 'mdi:alert',
  info: 'mdi:information',
  help: 'mdi:help-circle',
  loading: 'mdi:loading',

  // 文件类
  file: 'mdi:file',
  folder: 'mdi:folder',
  image: 'mdi:image',
  video: 'mdi:video',
  audio: 'mdi:music',
  document: 'mdi:file-document',
  pdf: 'mdi:file-pdf',
  excel: 'mdi:file-excel',
  word: 'mdi:file-word',

  // 通信类
  email: 'mdi:email',
  phone: 'mdi:phone',
  message: 'mdi:message',
  notification: 'mdi:bell',
  chat: 'mdi:chat',

  // 购物类
  cart: 'mdi:cart',
  shopping: 'mdi:shopping',
  payment: 'mdi:credit-card',
  wallet: 'mdi:wallet',
  order: 'mdi:clipboard-list',

  // 学习/学工类
  book: 'mdi:book',
  school: 'mdi:school',
  graduation: 'mdi:graduation-cap',
  calendar: 'mdi:calendar',
  schedule: 'mdi:clock',
  task: 'mdi:checkbox-marked',
  assignment: 'mdi:clipboard-text',
  grade: 'mdi:chart-bar',
  certificate: 'mdi:certificate',

  // 其他
  heart: 'mdi:heart',
  star: 'mdi:star',
  bookmark: 'mdi:bookmark',
  tag: 'mdi:tag',
  location: 'mdi:map-marker',
  time: 'mdi:clock',
  date: 'mdi:calendar',
  view: 'mdi:eye',
  hide: 'mdi:eye-off',
  lock: 'mdi:lock',
  unlock: 'mdi:lock-open',
  shield: 'mdi:shield-check',
  security: 'mdi:security',
  link: 'mdi:link',
  external: 'mdi:open-in-new',
  fullscreen: 'mdi:fullscreen',
  minimize: 'mdi:fullscreen-exit',
  moon: 'mdi:moon-waning-crescent',
  sun: 'mdi:white-balance-sunny',
  translate: 'mdi:translate',
  more: 'mdi:dots-horizontal',
  moreVertical: 'mdi:dots-vertical',
} as const

// 图标类型
export type IconName = keyof typeof icons

/**
 * 获取图标名称
 * @param name 图标键名
 * @returns Iconify 图标全称
 */
export function getIcon(name: IconName): string {
  return icons[name] || name
}

/**
 * 常用图标组合
 */
export const iconSets = {
  // 导航菜单图标
  navigation: {
    home: icons.home,
    user: icons.user,
    settings: icons.settings,
    logout: icons.logout,
  },

  // 操作按钮图标
  actions: {
    add: icons.add,
    edit: icons.edit,
    delete: icons.delete,
    search: icons.search,
    refresh: icons.refresh,
  },

  // 状态图标
  status: {
    success: icons.success,
    error: icons.error,
    warning: icons.warning,
    info: icons.info,
  },

  // 学工相关图标
  studentAffairs: {
    school: icons.school,
    calendar: icons.calendar,
    task: icons.task,
    assignment: icons.assignment,
    grade: icons.grade,
    certificate: icons.certificate,
    notification: icons.notification,
    document: icons.document,
  },
}

export default icons
