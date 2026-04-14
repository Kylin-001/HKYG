import { execSync } from 'child_process'
import { readFileSync, existsSync, writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const seedDir = join(__dirname)

const DB_CONFIG = {
  host: '192.168.186.128',
  port: 3306,
  user: 'hkyg',
  password: 'Mysql@8Root!2025',
  database: 'heikeji_mall'
}

const SQL_FILES = [
  { file: 'heikeji_mall_seed_data_part1.sql', tables: [
    'user', 'user_auth', 'user_address', 'role', 'menu', 'role_menu', 'user_role',
    'category', 'store', 'product', 'product_image', 'cart', 'order', 'order_item',
    'payment', 'product_comment'
  ]},
  { file: 'heikeji_mall_seed_data_part2.sql', tables: [
    'merchant', 'takeout_category', 'takeout_product', 'takeout_order', 'takeout_order_item',
    'secondhand_category', 'secondhand_product', 'lost_found',
    'delivery_person', 'delivery_order'
  ]},
  { file: 'heikeji_mall_seed_data_part3.sql', tables: [
    'campus', 'campus_notice', 'boards', 'posts', 'comments', 'activities',
    'coupon', 'user_coupon', 'member_level', 'point_rule', 'point_record', 'order_review'
  ]}
]

function runMysql(sql) {
  const tmpFile = join(seedDir, `__tmp_${Date.now()}.sql`)
  writeFileSync(tmpFile, sql)
  try {
    const cmd = `mysql -h${DB_CONFIG.host} -P${DB_CONFIG.port} -u${DB_CONFIG.user} -p"${DB_CONFIG.password}" ${DB_CONFIG.database} < "${tmpFile}" 2>&1`
    return execSync(cmd, { encoding: 'utf-8', shell: true, timeout: 30000 })
  } finally {
    try { unlinkSync(tmpFile) } catch {}
  }
}

function importFile(sqlFile) {
  const cmd = `mysql -h${DB_CONFIG.host} -P${DB_CONFIG.port} -u${DB_CONFIG.user} -p"${DB_CONFIG.password}" ${DB_CONFIG.database} < "${sqlFile}" 2>&1`
  return execSync(cmd, { encoding: 'utf-8', shell: true, timeout: 120000 })
}

console.log('='.repeat(60))
console.log('  黑科易购 - 数据库种子数据导入工具 v2')
console.log('  (自动清空已有数据后重新导入)')
console.log('='.repeat(60))
console.log(`\n目标数据库: ${DB_CONFIG.host}:${DB_CONFIG.port}/${DB_CONFIG.database}`)

for (const part of SQL_FILES) {
  const fullPath = join(seedDir, part.file)
  
  if (!existsSync(fullPath)) {
    console.error(`\n[跳过] 文件不存在: ${part.file}`)
    continue
  }

  const content = readFileSync(fullPath, 'utf-8')
  
  console.log(`\n${'═'.repeat(55)}`)
  console.log(`  [导入] ${part.file}`)
  console.log(`  大小: ${(content.length / 1024).toFixed(1)} KB`)
  console.log(`${'═'.repeat(55)}`)

  if (part.tables && part.tables.length > 0) {
    console.log(`\n  [清理] 清空 ${part.tables.length} 个相关表...`)
    const truncateSql = [
      'SET FOREIGN_KEY_CHECKS = 0;',
      ...part.tables.map(t => `TRUNCATE TABLE \`${t}\`;`),
      'SET FOREIGN_KEY_CHECKS = 1;'
    ].join('\n')
    
    try {
      runMysql(truncateSql)
      console.log(`  [OK] 表清空完成`)
    } catch (e) {
      const msg = e.stderr?.toString() || e.message
      console.log(`  [WARN] 部分表清空失败(可能不存在): ${msg.slice(0, 100)}`)
    }
  }

  console.log(`\n  [执行] 导入数据...`)
  try {
    const result = importFile(fullPath)
    if (result.trim()) {
      const lines = result.trim().split('\n').filter(l => l.trim())
      for (const line of lines) {
        if (!line.includes('Warning') && !line.includes('insecure')) {
          console.log(`  ${line}`)
        }
      }
    }
    console.log(`\n  [✅ 完成] ${part.file} 导入成功!`)
  } catch (error) {
    const stderr = error.stderr?.toString() || ''
    const stdout = error.stdout?.toString() || ''
    console.error(`\n  [❌ 失败] ${part.file}:`)
    if (stderr && !stderr.includes('Warning')) {
      const errLines = stderr.split('\n').filter(l => l.includes('ERROR'))
      for (const el of errLines.slice(0, 3)) {
        console.error(`  ${el.trim()}`)
      }
    }
    if (stdout.trim()) {
      console.error(`  输出: ${stdout.slice(0, 200)}`)
    }
  }
}

console.log('\n' + '='.repeat(60))
console.log('  所有种子数据导入任务完成!')
console.log('='.repeat(60))
