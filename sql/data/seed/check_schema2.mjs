import { execSync } from 'child_process'

const DB_CONFIG = {
  host: '192.168.186.128',
  port: 3306,
  user: 'hkyg',
  password: 'Mysql@8Root!2025',
  database: 'heikeji_mall'
}

const queries = [
  "DESCRIBE user;",
  "DESCRIBE merchant;",
  "SHOW TABLES;",
  "SHOW VARIABLES LIKE 'character_set%';"
]

for (const sql of queries) {
  console.log('\n=== QUERY ===')
  console.log(sql)
  
  const tmpFile = `__tmp_query_${Date.now()}.sql`
  const fs = await import('fs')
  fs.writeFileSync(tmpFile, sql)
  
  const cmd = `mysql -h${DB_CONFIG.host} -P${DB_CONFIG.port} -u${DB_CONFIG.user} -p"${DB_CONFIG.password}" ${DB_CONFIG.database} < "${tmpFile}" 2>&1`
  
  try {
    const result = execSync(cmd, { encoding: 'utf-8', shell: true })
    console.log(result)
  } catch (e) {
    console.error('ERROR:', e.stderr?.toString() || e.message?.toString())
  }
  
  try { fs.unlinkSync(tmpFile) } catch {}
}
