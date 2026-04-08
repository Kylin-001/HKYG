const BASE = 'http://localhost:5174'

async function api(method, url, body) {
  const opts = { method, headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(BASE + url, opts)
  return await res.json()
}

const tests = [
  // === 读操作 ===
  { name: '首页-热销', method: 'GET', url: '/products/hot?_t=1' },
  { name: '首页-推荐', method: 'GET', url: '/products/recommend?_t=1' },
  { name: '商品列表+分页', method: 'GET', url: '/products?page=1&pageSize=5' },
  { name: '商品详情', method: 'GET', url: '/products/101' },
  { name: '商品搜索', method: 'GET', url: '/products/search?keyword=耳机' },
  { name: '商品分类', method: 'GET', url: '/products/categories' },
  { name: '购物车', method: 'GET', url: '/cart' },
  { name: '订单列表', method: 'GET', url: '/orders?page=1&pageSize=10' },
  { name: '订单详情', method: 'GET', url: '/orders/ord1' },
  { name: '地址列表', method: 'GET', url: '/addresses' },
  { name: '用户信息', method: 'GET', url: '/user/info' },
  { name: '外卖商家', method: 'GET', url: '/takeout/merchants' },
  { name: '外卖商家详情', method: 'GET', url: '/takeout/merchants/m1' },
  { name: '外卖商品', method: 'GET', url: '/takeout/products?merchantId=m1' },
  { name: '外卖订单', method: 'GET', url: '/takeout/orders' },
  { name: '配送跟踪', method: 'GET', url: '/takeout/orders/tk1/track' },
  { name: '二手分类', method: 'GET', url: '/secondhand/categories' },
  { name: '二手列表', method: 'GET', url: '/secondhand/items?page=1&pageSize=10' },
  { name: '二手搜索iPhone', method: 'GET', url: '/secondhand/items?keyword=iPhone' },
  { name: '校园课表', method: 'GET', url: '/campus/schedule' },
  { name: '校园GPA', method: 'GET', url: '/campus/gpa' },
  { name: '校园宿舍', method: 'GET', url: '/campus/dormitory' },
  { name: '校园教室', method: 'GET', url: '/campus/classrooms' },
  { name: '图书馆搜索', method: 'GET', url: '/campus/library/search?keyword=算法' },
  { name: '校园地图', method: 'GET', url: '/campus/map/data' },
  { name: '社区版块', method: 'GET', url: '/community/boards' },
  { name: '社区帖子(分页)', method: 'GET', url: '/community/posts?page=1&pageSize=3&_t=1' },
  { name: '帖子详情', method: 'GET', url: '/community/posts/p1' },
  { name: '失物招领', method: 'GET', url: '/community/lost-found' },
  { name: '活动列表', method: 'GET', url: '/community/activities' },
  { name: '活动详情', method: 'GET', url: '/community/activities/act1' },
  { name: '收藏夹', method: 'GET', url: '/favorites' },
  { name: '优惠券', method: 'GET', url: '/coupons' },
  { name: '通知消息', method: 'GET', url: '/notifications' },

  // === 写操作 ===
  { name: '[写] 登录', method: 'POST', url: '/auth/login', body: { account: 'test', password: '123456' } },
  { name: '[写] 添加购物车', method: 'POST', url: '/cart', body: { productId: 102, quantity: 2 } },
  { name: '[写] 发布二手', method: 'POST', url: '/secondhand/items', body: { title: '测试商品-可删除', description: '自动化测试', price: 99, category: 'electronics', condition: 'likeNew', location: '测试楼', images: [] } },
  { name: '[写] 发布活动', method: 'POST', url: '/community/activities', body: { title: '测试活动', category: 'test', date: '2026-05-01', time: '09:00-17:00', location: '测试地点', maxPeople: 50, fee: 0, description: '自动化测试活动', tags: ['测试'] } },
  { name: '[写] 发布帖子', method: 'POST', url: '/community/posts', body: { title: '测试帖子', content: '这是测试内容', board: 'life', tags: ['测试'] } },
  { name: '[写] 创建地址', method: 'POST', url: '/addresses', body: { receiverName: '测试用户', receiverPhone: '13800138000', province: '黑龙江', city: '哈尔滨', district: '松北区', detailAddress: '黑科大A区1号楼', isDefault: false } },
  { name: '[写] 支付订单', method: 'POST', url: '/payments', body: { orderNo: 'HK20260401001', method: 'alipay', amount: 299 } },
  { name: '[写] 活动报名', method: 'POST', url: '/community/activities/act1/join', body: {} },
]

console.log('='.repeat(70))
console.log('  黑科易购 - 全面端到端功能验证 (读+写)')
console.log('  目标: http://localhost:5174')
console.log('='.repeat(70))

let pass = 0, fail = 0, results = []

for (const t of tests) {
  try {
    const res = await api(t.method, t.url, t.body)
    const ok = res.code === 200 && res.success !== false
    const icon = ok ? '\u2705' : '\u274c'
    const statusStr = ok ? 'PASS' : `FAIL(${res.status || '?'})`
    const detail = ok ? (typeof res.data === 'object' ? JSON.stringify(res.data).slice(0, 50) : String(res.data).slice(0, 40)) : JSON.stringify(res).slice(0, 80)
    console.log('  ' + icon + ' ' + (t.name + ':').padEnd(28) + ' ' + statusStr + ' ' + detail)
    if (ok) pass++
    else fail++
  } catch (e) {
    console.log(`  \u274c ${(t.name + ':').padEnd(28)} ERROR  ${e.message.slice(0, 70)}`)
    fail++
  }
}

console.log('-'.repeat(70))
console.log(`  \u7ed3\u679c: ${pass}/${tests.length} \u901a\u8fc7, ${fail} \u5931\u8d25`)
if (fail === 0) console.log('  \u2705 \u6240\u90e8\u63a5\u8bd5\u901a\u8fc5!')
else console.log(`  \u274c ${fail}\u4e2a\u529f\u80fd\u9700\u8981\u4fee\u590d`)
console.log('='.repeat(70))
