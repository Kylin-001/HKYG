import { execSync } from 'child_process'
import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const seedDir = join(__dirname)
const DB = { host: '192.168.186.128', port: 3306, user: 'hkyg', password: 'Mysql@8Root!2025', database: 'heikeji_mall' }

function q(sql) {
  const f = join(seedDir, '__v.sql')
  writeFileSync(f, sql)
  try {
    return execSync(`mysql -h${DB.host} -P${DB.port} -u${DB.user} -p"${DB.password}" ${DB.database} < "${f}" 2>&1`, { encoding: 'utf-8', shell: true })
  } finally { try { unlinkSync(f) } catch {} }
}

const tables = [
  'user', 'user_auth', 'user_address', 'role', 'menu', 'role_menu', 'user_role',
  'category', 'store', 'product', 'product_image', 'cart',
  'order', 'order_item', 'payment', 'product_comment',
  'merchant', 'takeout_category', 'takeout_product', 'takeout_order', 'takeout_order_item',
  'secondhand_category', 'secondhand_product', 'lost_found',
  'delivery_person', 'delivery_order',
  'campus', 'campus_notice', 'boards', 'posts', 'comments', 'activities',
  'coupon', 'user_coupon', 'member_level', 'point_rule', 'point_record', 'order_review'
]

console.log('='.repeat(55))
console.log('  heikeji_mall 数据库 - 种子数据验证报告')
console.log('='.repeat(55))

let total = 0
for (const t of tables) {
  const r = q(`SELECT COUNT(*) AS cnt FROM \`${t}\`;`)
  const match = r.match(/(\d+)/)
  const cnt = match ? parseInt(match[1]) : 0
  total += cnt
  console.log(`  ${t.padEnd(25)} ${String(cnt).padStart(6)} 条`)
}

console.log('-'.repeat(55))
console.log(`  ${'总计'.padEnd(25)} ${String(total).padStart(6)} 条`)
console.log('='.repeat(55))
