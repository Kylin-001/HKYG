import { execSync } from 'child_process'
import { writeFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const seedDir = join(__dirname)
const DB = { host: '192.168.186.128', port: 3306, user: 'hkyg', password: 'Mysql@8Root!2025', database: 'heikeji_mall' }

function q(sql) {
  const f = join(seedDir, '__q.sql')
  writeFileSync(f, sql)
  try {
    return execSync(`mysql -h${DB.host} -P${DB.port} -u${DB.user} -p"${DB.password}" ${DB.database} < "${f}" 2>&1`, { encoding: 'utf-8', shell: true })
  } finally { try { unlinkSync(f) } catch {} }
}

console.log('=== order 表结构 ===')
console.log(q('DESCRIBE `order`;'))
console.log('\n=== order_review 表结构 ===')
console.log(q('DESCRIBE order_review;'))
