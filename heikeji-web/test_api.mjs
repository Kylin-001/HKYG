const BASE = 'http://localhost:5174'

const tests = [
  { name: '首页-热销商品', method: 'GET', url: '/products/hot?_t=1' },
  { name: '首页-推荐商品', method: 'GET', url: '/products/recommend?_t=1' },
  { name: '商品列表(分页)', method: 'GET', url: '/products?page=1&pageSize=10' },
  { name: '商品详情', method: 'GET', url: '/products/101' },
  { name: '商品分类', method: 'GET', url: '/products/categories' },
  { name: '商品搜索', method: 'GET', url: '/products/search?keyword=耳机' },
  { name: '购物车列表', method: 'GET', url: '/cart' },
  { name: '订单列表(分页)', method: 'GET', url: '/orders?page=1&pageSize=10' },
  { name: '订单详情', method: 'GET', url: '/orders/ord1' },
  { name: '地址列表', method: 'GET', url: '/addresses' },
  { name: '用户信息', method: 'GET', url: '/user/info' },
  { name: '外卖商家列表', method: 'GET', url: '/takeout/merchants' },
  { name: '外卖商家详情', method: 'GET', url: '/takeout/merchants/m1' },
  { name: '外卖商品列表', method: 'GET', url: '/takeout/products?merchantId=m1' },
  { name: '外卖订单列表', method: 'GET', url: '/takeout/orders' },
  { name: '外卖配送跟踪', method: 'GET', url: '/takeout/orders/tk1/track' },
  { name: '二手分类', method: 'GET', url: '/secondhand/categories' },
  { name: '二手商品列表', method: 'GET', url: '/secondhand/items?page=1&pageSize=10' },
  { name: '校园课表', method: 'GET', url: '/campus/schedule' },
  { name: '校园成绩/GPA', method: 'GET', url: '/campus/gpa' },
  { name: '校园宿舍', method: 'GET', url: '/campus/dormitory' },
  { name: '校园教室', method: 'GET', url: '/campus/classrooms' },
  { name: '校园图书馆搜索', method: 'GET', url: '/campus/library/search?keyword=算法' },
  { name: '校园地图', method: 'GET', url: '/campus/map/data' },
  { name: '社区版块', method: 'GET', url: '/community/boards' },
  { name: '社区帖子(分页)', method: 'GET', url: '/community/posts?page=1&pageSize=3&_t=1' },
  { name: '帖子详情', method: 'GET', url: '/community/posts/p1' },
  { name: '失物招领', method: 'GET', url: '/community/lost-found' },
  { name: '活动列表', method: 'GET', url: '/community/activities' },
  { name: '活动详情', method: 'GET', url: '/community/activities/act1' },
  { name: '收藏列表', method: 'GET', url: '/favorites' },
  { name: '优惠券列表', method: 'GET', url: '/coupons' },
  { name: '通知消息', method: 'GET', url: '/notifications' },
  { name: '登录接口', method: 'POST', url: '/auth/login', body: { account: 'test', password: '123456' } },
]

async function runTest(t) {
  try {
    const opts = {
      method: t.method,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    }
    if (t.body) opts.body = JSON.stringify(t.body)
    const res = await fetch(BASE + t.url, opts)
    const data = await res.json()
    const ok = res.ok && data.code === 200 && data.success !== false
    return { name: t.name, status: ok ? 'PASS' : `FAIL(${res.status})`, detail: ok ? `${JSON.stringify(data.data || {}).slice(0, 60)}...` : JSON.stringify(data).slice(0, 100) }
  } catch (e) {
    return { name: t.name, status: 'ERROR', detail: e.message.slice(0, 80) }
  }
}

console.log('='.repeat(70))
console.log('  黑科易购 - Mock Server 全面API测试 (v2)')
console.log('  目标: http://localhost:5174')
console.log('='.repeat(70))

const results = await Promise.all(tests.map(runTest))
let pass = 0; let fail = 0

for (const r of results) {
  const icon = r.status === 'PASS' ? '\u2705' : '\u274c'
  console.log(`  ${icon} ${(r.name + ':').padEnd(22)} ${r.status.padStart(8)}  ${r.detail || ''}`)
  if (r.status === 'PASS') pass++
  else fail++
}

console.log('-'.repeat(70))
console.log(`  \u7ed3\u679c: ${pass}/${results.length} \u901a\u8fc7, ${fail} \u5931\u8d25`)
if (fail === 0) console.log('  \u2705 \u6240\u6709\u63a5\u53e3\u6d4b\u8bd5\u901a\u8fc5!')
else console.log('  \u274c \u5b58\u5728\u5931\u8d25\u63a5\u53e3\uff0c\u9700\u8981\u4fee\u590d')
console.log('='.repeat(70))
