-- ================================
-- 黑科易购项目数据库备份脚本
-- 创建日期: 2025-11-18
-- 用途: 定期数据备份和维护
-- ================================

-- 设置会话变量
SET @backup_date = DATE_FORMAT(NOW(), '%Y%m%d_%H%i%s');
SET @backup_dir = '/backup/database/';
SET @database_name = 'heikeji_mall';

-- 创建备份目录（如果不存在）
-- 注意: 在实际环境中需要系统级命令或手动创建目录
-- SYSTEM mkdir -p @backup_dir;

-- 1. 创建完整数据库备份
-- 使用mysqldump命令（需要在系统命令行执行）
-- mysqldump -u root -p --single-transaction --routines --triggers @database_name > @backup_dir@database_name_@backup_date.sql

-- 2. 数据完整性检查
SELECT 'Starting data integrity check...' AS status;

-- 检查用户表数据完整性
SELECT 
    'User Table' AS table_name,
    COUNT(*) AS total_records,
    COUNT(DISTINCT id) AS unique_ids,
    SUM(CASE WHEN student_no IS NULL THEN 1 ELSE 0 END) AS null_student_no,
    SUM(CASE WHEN nickname IS NULL THEN 1 ELSE 0 END) AS null_nickname,
    SUM(CASE WHEN phone IS NULL THEN 1 ELSE 0 END) AS null_phone
FROM `user`;

-- 检查订单表数据完整性  
SELECT 
    'Order Table' AS table_name,
    COUNT(*) AS total_records,
    SUM(CASE WHEN user_id NOT IN (SELECT id FROM `user`) THEN 1 ELSE 0 END) AS orphaned_orders,
    SUM(CASE WHEN total_amount < 0 THEN 1 ELSE 0 END) AS invalid_amounts
FROM `order`;

-- 检查商品表数据完整性
SELECT 
    'Product Table' AS table_name,
    COUNT(*) AS total_records,
    SUM(CASE WHEN price < 0 THEN 1 ELSE 0 END) AS invalid_prices,
    SUM(CASE WHEN stock < 0 THEN 1 ELSE 0 END) AS invalid_stock
FROM `product`;

-- 检查支付表数据完整性
SELECT 
    'Payment Table' AS table_name,
    COUNT(*) AS total_records,
    SUM(CASE WHEN amount < 0 THEN 1 ELSE 0 END) AS invalid_amounts,
    SUM(CASE WHEN status NOT IN (0,1,2,3,4) THEN 1 ELSE 0 END) AS invalid_status
FROM `payment`;

-- 3. 表空间使用情况分析
SELECT 
    table_name AS '表名',
    table_rows AS '行数',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS '大小(MB)',
    ROUND((data_free / 1024 / 1024), 2) AS '碎片空间(MB)'
FROM information_schema.TABLES 
WHERE table_schema = @database_name 
ORDER BY (data_length + index_length) DESC;

-- 4. 需要优化的表（碎片率超过20%）
SELECT 
    table_name AS '表名',
    ROUND(((data_free / (data_length + data_free)) * 100), 2) AS '碎片率(%)'
FROM information_schema.TABLES 
WHERE table_schema = @database_name 
  AND data_free > 0
  AND (data_free / (data_length + data_free)) > 0.20
ORDER BY (data_free / (data_length + data_free)) DESC;

-- 5. 索引使用情况分析
SELECT 
    table_name AS '表名',
    index_name AS '索引名',
    cardinality AS '基数',
    ROUND((table_rows / NULLIF(cardinality, 0)), 2) AS '选择性'
FROM information_schema.STATISTICS 
WHERE table_schema = @database_name 
  AND index_name != 'PRIMARY'
ORDER BY table_name, cardinality DESC;

-- 6. 慢查询统计（需要在MySQL配置中启用慢查询日志）
-- 这部分需要从performance_schema中查询
-- SELECT * FROM performance_schema.events_statements_summary_by_digest 
-- WHERE schema_name = @database_name 
-- ORDER BY avg_timer_wait DESC LIMIT 10;

-- 7. 备份完成统计
SELECT 
    @backup_date AS backup_timestamp,
    @database_name AS database_name,
    'Backup and maintenance check completed' AS status,
    COUNT(*) AS total_tables
FROM information_schema.tables 
WHERE table_schema = @database_name;

-- 8. 备份验证SQL（执行备份后验证）
-- -- 验证备份文件完整性
-- SELECT 'Verification: Testing backup file integrity...' AS status;
-- -- 在实际环境中，这里会验证备份文件的MD5或SHA256值
-- SELECT 'Backup file verification completed' AS result;