// 简化的 i18n 实现 - 不使用 vue-i18n，直接返回中文
const messages: Record<string, string> = {
  // 首页
  'home.heroExplore': '立即探索',
  'home.heroLearnMore': '了解更多',
  'home.featuredProducts': '精选商品',
  'home.viewAll': '查看全部',
  'home.newArrivals': '新品上架',
  'home.hotSales': '热销商品',
  'home.categories': '商品分类',
  'home.recommendations': '为你推荐',

  // 通用
  'common.search': '搜索',
  'common.searchPlaceholder': '请输入搜索关键词',
  'common.loading': '加载中...',
  'common.loadMore': '加载更多',
  'common.noMore': '没有更多了',
  'common.empty': '暂无数据',
  'common.error': '出错了',
  'common.retry': '重试',
  'common.cancel': '取消',
  'common.confirm': '确认',
  'common.submit': '提交',
  'common.save': '保存',
  'common.delete': '删除',
  'common.edit': '编辑',
  'common.add': '添加',
  'common.create': '创建',
  'common.update': '更新',
  'common.remove': '移除',
  'common.close': '关闭',
  'common.back': '返回',
  'common.next': '下一步',
  'common.previous': '上一步',
  'common.finish': '完成',
  'common.success': '成功',
  'common.failed': '失败',
  'common.warning': '警告',
  'common.info': '提示',

  // 导航
  'nav.home': '首页',
  'nav.products': '商品',
  'nav.cart': '购物车',
  'nav.orders': '订单',
  'nav.profile': '我的',
  'nav.settings': '设置',
  'nav.help': '帮助',
  'nav.about': '关于',
  'nav.contact': '联系我们',
  'nav.logout': '退出登录',
  'nav.login': '登录',
  'nav.register': '注册',

  // 认证
  'auth.login': '登录',
  'auth.register': '注册',
  'auth.forgotPassword': '忘记密码',
  'auth.rememberMe': '记住我',
  'auth.username': '用户名',
  'auth.password': '密码',
  'auth.confirmPassword': '确认密码',
  'auth.verificationCode': '验证码',
  'auth.sendCode': '发送验证码',
  'auth.resend': '重新发送',
  'auth.loginSuccess': '登录成功',
  'auth.registerSuccess': '注册成功',

  // 购物车
  'cart.title': '购物车',
  'cart.empty': '购物车是空的',
  'cart.total': '合计',
  'cart.checkout': '去结算',
  'cart.addToCart': '加入购物车',
  'cart.remove': '删除商品',
  'cart.selectAll': '全选',
  'cart.quantity': '数量',

  // 订单
  'orders.title': '我的订单',
  'orders.orderNo': '订单号',
  'orders.status': '订单状态',
  'orders.total': '订单金额',
  'orders.date': '下单时间',
  'orders.pending': '待付款',
  'orders.paid': '已付款',
  'orders.shipped': '已发货',
  'orders.completed': '已完成',
  'orders.cancelled': '已取消',
  'orders.refunding': '退款中',
  'orders.refunded': '已退款',

  // 商品
  'product.price': '价格',
  'product.originalPrice': '原价',
  'product.stock': '库存',
  'product.sales': '销量',
  'product.description': '商品描述',
  'product.specifications': '规格参数',
  'product.reviews': '用户评价',
  'product.addToCart': '加入购物车',
  'product.buyNow': '立即购买',
  'product.outOfStock': '缺货',
  'product.inStock': '有货',

  // 用户
  'user.profile': '个人资料',
  'user.nickname': '昵称',
  'user.avatar': '头像',
  'user.phone': '手机号',
  'user.email': '邮箱',
  'user.address': '收货地址',
  'user.password': '密码',
  'user.oldPassword': '原密码',
  'user.newPassword': '新密码',
  'user.confirmPassword': '确认密码',
  'user.changePassword': '修改密码',
  'user.bindPhone': '绑定手机',
  'user.bindEmail': '绑定邮箱',

  // 设置
  'settings.title': '设置',
  'settings.language': '语言',
  'settings.theme': '主题',
  'settings.notification': '消息通知',
  'settings.privacy': '隐私设置',
  'settings.about': '关于我们',
  'settings.version': '版本号',
  'settings.clearCache': '清除缓存',

  // 主题
  'theme.light': '浅色模式',
  'theme.dark': '深色模式',
  'theme.system': '跟随系统',

  // 验证
  'validation.required': '此项为必填项',
  'validation.email': '请输入有效的邮箱地址',
  'validation.phone': '请输入有效的手机号',
  'validation.password': '密码长度至少6位',
  'validation.passwordMismatch': '两次输入的密码不一致',

  // 消息
  'message.addSuccess': '添加成功',
  'message.updateSuccess': '更新成功',
  'message.deleteSuccess': '删除成功',
  'message.saveSuccess': '保存成功',
  'message.submitSuccess': '提交成功',
  'message.operationSuccess': '操作成功',
  'message.networkError': '网络错误，请检查网络连接',
  'message.serverError': '服务器错误，请稍后重试',
  'message.timeoutError': '请求超时，请稍后重试',
  'message.loginExpired': '登录已过期，请重新登录',

  // 校园相关
  'campus.title': '校园服务',
  'campus.dormitory': '宿舍管理',
  'campus.card': '校园卡',
  'campus.repair': '报修服务',
  'campus.lostFound': '失物招领',
  'campus.express': '快递服务',
  'campus.takeout': '外卖服务',
  'campus.secondhand': '二手市场',
  'campus.parttime': '兼职信息',
  'campus.activities': '校园活动',
  'campus.notices': '通知公告',
}

// 翻译函数
export function t(key: string): string {
  return messages[key] || key
}

// 组合式函数 - 用于 Vue 组件
export function useI18n() {
  return {
    t,
    locale: { value: 'zh-CN' },
  }
}

// 创建 i18n 实例
export function createI18n() {
  return {
    install(app: any) {
      app.config.globalProperties.$t = t
      app.provide('i18n', { t })
    },
    global: {
      t,
      locale: { value: 'zh-CN' },
    },
  }
}

// 支持的语言列表
export const availableLocales = [
  { code: 'zh-CN', name: '简体中文' },
  { code: 'en-US', name: 'English' },
]

// 设置语言（简化版，始终返回中文）
export function setLocale(_locale: string) {
  console.log('Locale set to:', _locale)
  return 'zh-CN'
}

export default createI18n
