-- ================================
-- 黑科易购项目数据库性能监控脚本
-- 创建日期: 2025-11-18
-- 用途: 实时监控数据库性能和健康状态
-- ================================

-- 设置日期格式
SET @current_time = NOW();
SET @check_date = DATE_FORMAT(@current_time, '%Y-%m-%d %H:%i:%s');

-- 1. 数据库整体性能概览
SELECT 
    @check_date AS check_time,
    '=== 数据库性能概览 ===' AS section,
    NULL AS metric,
    NULL AS value,
    NULL AS status;

-- 连接数统计
SELECT 
    @check_date AS check_time,
    '连接统计' AS section,
    '当前连接数' AS metric,
    COUNT(*) AS value,
    CASE 
        WHEN COUNT(*) > 100 THEN 'WARNING'
        WHEN COUNT(*) > 80 THEN 'NORMAL'
        ELSE 'GOOD'
    END AS status
FROM information_schema.PROCESSLIST 
WHERE db = DATABASE();

-- 慢查询统计（需要启用慢查询日志）
SELECT 
    @check_time AS check_time,
    '慢查询监控' AS section,
    '5分钟内慢查询数' AS metric,
    COALESCE((
        SELECT COUNT(*) 
        FROM mysql.slow_log 
        WHERE start_time >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
    ), 0) AS value,
    CASE 
        WHEN COALESCE((
            SELECT COUNT(*) 
            FROM mysql.slow_log 
            WHERE start_time >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
        ), 0) > 10 THEN 'CRITICAL'
        WHEN COALESCE((
            SELECT COUNT(*) 
            FROM mysql.slow_log 
            WHERE start_time >= DATE_SUB(NOW(), INTERVAL 5 MINUTE)
        ), 0) > 5 THEN 'WARNING'
        ELSE 'GOOD'
    END AS status;

-- 2. 表级别性能分析
SELECT 
    @check_time AS check_time,
    '=== 表性能分析 ===' AS section,
    NULL AS metric,
    NULL AS value,
    NULL AS status;

-- 表大小统计
SELECT 
    @check_time AS check_time,
    '表大小' AS section,
    table_name AS metric,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS '大小(MB)',
    CASE 
        WHEN (data_length + index_length) > 1073741824 THEN 'WARNING'  -- > 1GB
        WHEN (data_length + index_length) > 536870912 THEN 'NORMAL'   -- > 512MB
        ELSE 'GOOD'
    END AS status
FROM information_schema.TABLES 
WHERE table_schema = DATABASE() 
ORDER BY (data_length + index_length) DESC 
LIMIT 10;

-- 表更新频率分析
SELECT 
    @check_time AS check_time,
    '更新频率' AS section,
    'user表更新' AS metric,
    (
        SELECT COUNT(*) 
        FROM information_schema.TABLE_STATISTICS 
        WHERE table_schema = DATABASE() AND table_name = 'user' AND stat_name = 'rows_read'
    ) AS value,
    'INFO' AS status;

SELECT 
    @check_time AS check_time,
    '更新频率' AS section,
    'order表更新' AS metric,
    (
        SELECT COUNT(*) 
        FROM information_schema.TABLE_STATISTICS 
        WHERE table_schema = DATABASE() AND table_name = 'order' AND stat_name = 'rows_read'
    ) AS value,
    'INFO' AS status;

-- 3. 索引效率分析
SELECT 
    @check_time AS check_time,
    '=== 索引效率分析 ===' AS section,
    NULL AS metric,
    NULL AS value,
    NULL AS status;

-- 未使用的索引
SELECT 
    @check_time AS check_time,
    '未使用索引' AS section,
    CONCAT(table_name, '.', index_name) AS metric,
    '需要检查' AS value,
    'WARNING' AS status
FROM information_schema.STATISTICS 
WHERE table_schema = DATABASE() 
  AND index_name != 'PRIMARY'
  AND cardinality < 10
LIMIT 5;

-- 高基数索引（可能选择性过高）
SELECT 
    @check_time AS check_time,
    '高基数索引' AS section,
    CONCAT(table_name, '.', index_name) AS metric,
    cardinality AS value,
    'INFO' AS status
FROM information_schema.STATISTICS 
WHERE table_schema = DATABASE() 
  AND index_name != 'PRIMARY'
  AND cardinality > 10000
ORDER BY cardinality DESC
LIMIT 5;

-- 4. 业务指标监控
SELECT 
    @check_time AS check_time,
    '=== 业务指标监控 ===' AS section,
    NULL AS metric,
    NULL AS value,
    NULL AS status;

-- 用户活跃度
SELECT 
    @check_time AS check_time,
    '用户活跃度' AS section,
    '今日新增用户' AS metric,
    (
        SELECT COUNT(*) 
        FROM `user` 
        WHERE DATE(create_time) = CURDATE()
    ) AS value,
    CASE 
        WHEN (
            SELECT COUNT(*) 
            FROM `user` 
            WHERE DATE(create_time) = CURDATE()
        ) > 50 THEN 'GOOD'
        WHEN (
            SELECT COUNT(*) 
            FROM `user` 
            WHERE DATE(create_time) = CURDATE()
        ) > 10 THEN 'NORMAL'
        ELSE 'WARNING'
    END AS status;

-- 订单活跃度
SELECT 
    @check_time AS check_time,
    '订单活跃度' AS section,
    '今日订单数' AS metric,
    (
        SELECT COUNT(*) 
        FROM `order` 
        WHERE DATE(create_time) = CURDATE()
    ) AS value,
    CASE 
        WHEN (
            SELECT COUNT(*) 
            FROM `order` 
            WHERE DATE(create_time) = CURDATE()
        ) > 100 THEN 'GOOD'
        WHEN (
            SELECT COUNT(*) 
            FROM `order` 
            WHERE DATE(create_time) = CURDATE()
        ) > 20 THEN 'NORMAL'
        ELSE 'WARNING'
    END AS status;

-- 支付状态分布
SELECT 
    @check_time AS check_time,
    '支付状态' AS section,
    status AS metric,
    COUNT(*) AS value,
    CASE 
        WHEN status = 1 THEN 'SUCCESS'
        WHEN status = 2 THEN 'WARNING'  -- 处理中
        WHEN status = 3 THEN 'INFO'     -- 已完成
        WHEN status = 4 THEN 'CRITICAL' -- 失败
        ELSE 'NORMAL'
    END AS status
FROM `payment`
WHERE DATE(create_time) = CURDATE()
GROUP BY status;

-- 5. 系统资源使用情况
SELECT 
    @check_time AS check_time,
    '=== 系统资源 ===' AS section,
    NULL AS metric,
    NULL AS value,
    NULL AS status;

-- InnoDB缓冲池使用率
SELECT 
    @check_time AS check_time,
    'InnoDB缓冲池' AS section,
    '缓冲池使用率' AS metric,
    ROUND(
        (1 - (SELECT VARIABLE_VALUE FROM performance_schema.GLOBAL_STATUS WHERE VARIABLE_NAME = 'Innodb_buffer_pool_pages_free') / 
         (SELECT VARIABLE_VALUE FROM performance_schema.GLOBAL_STATUS WHERE VARIABLE_NAME = 'Innodb_buffer_pool_pages_total')
        ) * 100, 2
    ) AS value,
    CASE 
        WHEN ROUND(
            (1 - (SELECT VARIABLE_VALUE FROM performance_schema.GLOBAL_STATUS WHERE VARIABLE_NAME = 'Innodb_buffer_pool_pages_free') / 
             (SELECT VARIABLE_VALUE FROM performance_schema.GLOBAL_STATUS WHERE VARIABLE_NAME = 'Innodb_buffer_pool_pages_total')
            ) * 100, 2
        ) > 90 THEN 'WARNING'
        WHEN ROUND(
            (1 - (SELECT VARIABLE_VALUE FROM performance_schema.GLOBAL_STATUS WHERE VARIABLE_NAME = 'Innodb_buffer_pool_pages_free') / 
             (SELECT VARIABLE_VALUE FROM performance_schema.GLOBAL_STATUS WHERE VARIABLE_NAME = 'Innodb_buffer_pool_pages_total')
            ) * 100, 2
        ) > 80 THEN 'NORMAL'
        ELSE 'GOOD'
    END AS status;

-- 查询缓存命中率（如果启用）
SELECT 
    @check_time AS check_time,
    '查询缓存' AS section,
    '缓存命中率' AS metric,
    ROUND(
        (SELECT VARIABLE_VALUE FROM performance_schema.GLOBAL_STATUS WHERE VARIABLE_NAME = 'Qcache_hits') / 
        NULLIF((SELECT VARIABLE_VALUE FROM performance_schema.GLOBAL_STATUS WHERE VARIABLE_NAME = 'Qcache_hits') + 
               (SELECT VARIABLE_VALUE FROM performance_schema.GLOBAL_STATUS WHERE VARIABLE_NAME = 'Com_select'), 0) * 100, 2
    ) AS value,
    CASE 
        WHEN ROUND(
            (SELECT VARIABLE_VALUE FROM performance_schema.GLOBAL_STATUS WHERE VARIABLE_NAME = 'Qcache_hits') / 
            NULLIF((SELECT VARIABLE_VALUE FROM performance_schema.GLOBAL_STATUS WHERE VARIABLE_NAME = 'Qcache_hits') + 
                   (SELECT VARIABLE_VALUE FROM performance_schema.GLOBAL_STATUS WHERE VARIABLE_NAME = 'Com_select'), 0) * 100, 2
        ) > 90 THEN 'GOOD'
        WHEN ROUND(
            (SELECT VARIABLE_VALUE FROM performance_schema.GLOBAL_STATUS WHERE VARIABLE_NAME = 'Qcache_hits') / 
            NULLIF((SELECT VARIABLE_VALUE FROM performance_schema.GLOBAL_STATUS WHERE VARIABLE_NAME = 'Qcache_hits') + 
                   (SELECT VARIABLE_VALUE FROM performance_schema.GLOBAL_STATUS WHERE VARIABLE_NAME = 'Com_select'), 0) * 100, 2
        ) > 70 THEN 'NORMAL'
        ELSE 'WARNING'
    END AS status;

-- 6. 监控总结
SELECT 
    @check_time AS check_time,
    '=== 监控总结 ===' AS section,
    '监控完成时间' AS metric,
    @check_time AS value,
    'INFO' AS status;

SELECT '=== 性能监控报告生成完成 ===' AS final_message;
SELECT '建议定期执行此脚本进行性能监控' AS recommendation;