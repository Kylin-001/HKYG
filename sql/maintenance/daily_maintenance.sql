-- ================================
-- 黑科易购项目日常维护脚本
-- 版本: 1.0
-- 描述: 数据库日常维护、清理和优化操作
-- 日期: 2025-11-18
-- ================================

USE `heikeji_mall`;

-- ================================
-- 1. 日志清理任务
-- ================================

-- 清理超过30天的审计日志
DELETE FROM `data_audit_log` 
WHERE create_time < DATE_SUB(NOW(), INTERVAL 30 DAY);

SELECT CONCAT('清理审计日志记录数: ', ROW_COUNT()) AS cleanup_result;

-- 清理已删除的用户相关数据（如果存在软删除标记超过90天）
UPDATE `user` 
SET del_flag = 1 
WHERE del_flag = 0 
AND update_time < DATE_SUB(NOW(), INTERVAL 90 DAY)
AND id NOT IN (
    SELECT DISTINCT user_id FROM `order` 
    WHERE create_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
);

SELECT CONCAT('标记过期用户记录数: ', ROW_COUNT()) AS cleanup_result;

-- ================================
-- 2. 索引优化
-- ================================

-- 更新表统计信息
ANALYZE TABLE `user`, `product`, `order`, `payment`, `cart`, `address`;

-- 清理过期的购物车记录（超过7天未购买）
DELETE FROM `cart` 
WHERE create_time < DATE_SUB(NOW(), INTERVAL 7 DAY);

SELECT CONCAT('清理过期购物车记录数: ', ROW_COUNT()) AS cleanup_result;

-- ================================
-- 3. 数据统计更新
-- ================================

-- 更新商品销量统计
UPDATE `product` p
SET sales = (
    SELECT COALESCE(SUM(oi.quantity), 0)
    FROM `order_item` oi
    JOIN `order` o ON oi.order_id = o.id
    WHERE oi.product_id = p.id
    AND o.status >= 3  -- 已完成订单
    AND o.create_time >= DATE_SUB(NOW(), INTERVAL 1 YEAR)  -- 一年内
)
WHERE p.id IN (
    SELECT DISTINCT oi.product_id
    FROM `order_item` oi
    JOIN `order` o ON oi.order_id = o.id
    WHERE o.create_time >= DATE_SUB(NOW(), INTERVAL 1 DAY)  -- 最近有订单的商品
);

SELECT CONCAT('更新商品销量: ', ROW_COUNT()) AS update_result;

-- 更新用户积分（基于消费金额）
UPDATE `user` u
SET score = (
    SELECT FLOOR(COALESCE(SUM(actual_amount), 0) / 10)  -- 每消费10元获得1积分
    FROM `order` 
    WHERE user_id = u.id 
    AND status >= 3  -- 已完成订单
    AND create_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)  -- 最近30天
)
WHERE u.id IN (
    SELECT DISTINCT user_id 
    FROM `order` 
    WHERE create_time >= DATE_SUB(NOW(), INTERVAL 30 DAY)
);

SELECT CONCAT('更新用户积分: ', ROW_COUNT()) AS update_result;

-- ================================
-- 4. 数据完整性维护
-- ================================

-- 清理购物车中的无效商品引用
DELETE c FROM `cart` c
LEFT JOIN `product` p ON c.product_id = p.id
WHERE p.id IS NULL OR p.status = 0;  -- 商品不存在或已下架

SELECT CONCAT('清理无效购物车记录: ', ROW_COUNT()) AS cleanup_result;

-- 清理已删除用户的购物车数据
DELETE c FROM `cart` c
LEFT JOIN `user` u ON c.user_id = u.id
WHERE u.id IS NULL OR u.del_flag = 1;

SELECT CONCAT('清理已删除用户购物车: ', ROW_COUNT()) AS cleanup_result;

-- ================================
-- 5. 性能优化
-- ================================

-- 清理订单表的过期临时数据（如果存在草稿状态的订单超过24小时）
DELETE FROM `order`
WHERE status = 0  -- 待支付
AND create_time < DATE_SUB(NOW(), INTERVAL 24 HOUR)
AND id NOT IN (
    SELECT DISTINCT order_id FROM `payment` WHERE status = 1  -- 有支付中的记录
);

SELECT CONCAT('清理过期订单: ', ROW_COUNT()) AS cleanup_result;

-- 更新支付表的超时记录（支付中超过2小时未完成的标记为失败）
UPDATE `payment`
SET status = 3  -- 支付失败
WHERE status = 1  -- 支付中
AND create_time < DATE_SUB(NOW(), INTERVAL 2 HOUR);

SELECT CONCAT('更新超时支付记录: ', ROW_COUNT()) AS update_result;

-- ================================
-- 6. 数据归档
-- ================================

-- 归档6个月前的已完成订单到历史表（如果存在）
-- 注意：这里只是示例，实际操作需要考虑业务需求
/*
CREATE TABLE IF NOT EXISTS `order_history` LIKE `order`;
INSERT INTO `order_history` 
SELECT * FROM `order` 
WHERE status = 3  -- 已完成
AND completed_time < DATE_SUB(NOW(), INTERVAL 6 MONTH);

DELETE FROM `order` 
WHERE id IN (SELECT id FROM `order_history`);
*/

-- ================================
-- 7. 缓存相关维护
-- ================================

-- 重置商品热门度缓存（基于最近7天销量）
UPDATE `product`
SET is_hot = CASE 
    WHEN sales > (
        SELECT AVG(sales) * 2 FROM `product` 
        WHERE status = 1 
        AND del_flag = 0
    ) THEN 1 
    ELSE 0 
END
WHERE status = 1 AND del_flag = 0;

SELECT CONCAT('更新热门商品标记: ', ROW_COUNT()) AS update_result;

-- ================================
-- 8. 系统健康检查
-- ================================

-- 检查数据库连接数
SELECT 
    '连接数检查' AS 检查项目,
    VARIABLE_VALUE AS 当前值,
    CASE 
        WHEN VARIABLE_VALUE > 100 THEN '警告：连接数过高'
        WHEN VARIABLE_VALUE > 50 THEN '注意：连接数较多'
        ELSE '正常'
    END AS 状态
FROM performance_schema.GLOBAL_STATUS
WHERE VARIABLE_NAME = 'Threads_connected';

-- 检查InnoDB缓冲池使用情况
SELECT 
    'InnoDB缓冲池' AS 检查项目,
    ROUND(VARIABLE_VALUE/1024/1024, 2) AS '使用量(MB)',
    CASE 
        WHEN VARIABLE_VALUE > 1073741824 THEN '警告：使用率超过1GB'
        WHEN VARIABLE_VALUE > 536870912 THEN '注意：使用率超过512MB'
        ELSE '正常'
    END AS 状态
FROM performance_schema.GLOBAL_STATUS
WHERE VARIABLE_NAME = 'Innodb_buffer_pool_pages_data';

-- 检查表空间使用情况
SELECT 
    TABLE_NAME AS '表名',
    ROUND(((DATA_LENGTH + INDEX_LENGTH) / 1024 / 1024), 2) AS '大小(MB)',
    TABLE_ROWS AS '记录数'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'heikeji_mall'
ORDER BY (DATA_LENGTH + INDEX_LENGTH) DESC
LIMIT 10;

-- ================================
-- 9. 备份验证
-- ================================

-- 验证重要表的数据完整性
SELECT 
    '用户表' AS 表名,
    COUNT(*) AS 记录数,
    MIN(create_time) AS 最早记录,
    MAX(create_time) AS 最新记录,
    COUNT(DISTINCT student_no) AS 唯一学号数
FROM `user`;

SELECT 
    '订单表' AS 表名,
    COUNT(*) AS 记录数,
    MIN(create_time) AS 最早记录,
    MAX(create_time) AS 最新记录,
    SUM(actual_amount) AS 总金额
FROM `order`;

SELECT 
    '商品表' AS 表名,
    COUNT(*) AS 记录数,
    SUM(sales) AS 总销量,
    COUNT(CASE WHEN status = 1 THEN 1 END) AS 上架商品数
FROM `product`;

-- ================================
-- 10. 输出维护摘要
-- ================================

SELECT 
    NOW() AS '维护完成时间',
    '数据库日常维护任务执行完成' AS '执行状态',
    '包含：日志清理、索引优化、数据统计更新、完整性维护、性能优化、健康检查' AS '执行内容';

-- 设置下次维护提醒
SELECT 
    '建议下次维护时间: ' AS '维护提醒',
    DATE_ADD(NOW(), INTERVAL 1 DAY) AS '时间',
    '建议频率：每日执行清理任务，每周执行优化任务，每月执行深度检查' AS '说明';