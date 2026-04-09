const BASE = 'http://localhost:5174'

async function api(method, url, body) {
  const opts = { method, headers: { Accept: 'application/json', 'Content-Type': 'application/json' } }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(BASE + url, opts)
  return await res.json()
}

console.log('=== 二手市场 发布+搜索 完整流程测试 ===\n')

// 1. 搜索前 - 列表数量
let r = await api('GET', '/secondhand/items')
console.log('1. 搜索前列表:', r.data?.list?.length || 0, '条商品')

// 2. 发布新商品
r = await api('POST', '/secondhand/items', { title: '出闲置 iPhone 15 Pro Max 256G 原色钛金属', description: '用了3个月，成色99新，带原装充电器和壳膜', price: 7999, originalPrice: 9999, category: 'electronics', condition: 'like_new', isNegotiable: true, images: ['https://images.unsplash.com/photo-1592750475208-a6bcbfda90eb?w=400&h=300&fit=crop'], location: '黑科大' })
console.log('2. 发布结果:', r.success ? '✅ 成功' : '❌ 失败', '- 商品ID:', r.data?.id)

// 3. 再次查看列表
r = await api('GET', '/secondhand/items')
console.log('3. 发布后列表:', r.data?.list?.length || 0, '条商品 (应+1)')

// 4. 搜索关键词 "iPhone"
r = await api('GET', '/secondhand/items?keyword=iPhone')
console.log('4. 搜索"iPhone":', r.data?.list?.length || 0, '条结果 (应>=1)')
if (r.data?.list?.length > 0) console.log('   找到:', r.data.list[0].title)

// 5. 搜索不存在的关键词
r = await api('GET', '/secondhand/items?keyword=不存在的东西xyz123')
console.log('5. 搜索"不存在的东西":', r.data?.list?.length || 0, '条结果 (应为0)')

// 6. 分类筛选
r = await api('GET', '/secondhand/items?category=electronics')
console.log('6. 筛选数码分类:', r.data?.list?.length || 0, '条 (应包含刚发布的iPhone)')

console.log('\n=== 测试完成 ===')
