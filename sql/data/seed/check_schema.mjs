import { execSync } from 'child_process'

const DB_CONFIG = {
  host: '192.168.186.128',
  port: 3306,
  user: 'hkyg',
  password: 'Mysql@8Root!2025',
  database: 'heikeji_mall'
}

function runQuery(sql) {
  const cmd = `mysql -h${DB_CONFIG.host} -P${DB_CONFIG.port} -u${DB_CONFIG.user} -p"${DB_CONFIG.password}" ${DB_CONFIG.database} -e "${sql.replace(/"/g, '\\"')}" 2>/dev/null`
  try {
    return execSync(cmd, { encoding: 'utf-8', shell: true }).trim()
  } catch (e) {
    return e.stderr?.toString() || e.message
  }
}

console.log('=== 检查 user 表结构 ===')
console.log(runQuery("DESCRIBE user;"))

console.log('\n=== 检查 merchant 表结构 ===')
console.log(runQuery("DESCRIBE merchant;"))

console.log('\n=== 检查所有表(包含campus/building) ===')
console.log(runQuery("SHOW TABLES LIKE '%campus%';"))
console.log(runQuery("SHOW TABLES LIKE '%building%';"))
console.log(runQuery("SHOW TABLES LIKE '%classroom%';"))

console.log('\n=== 数据库字符集 ===')
console.log(runQuery("SHOW VARIABLES LIKE 'character_set%';"))
