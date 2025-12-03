-- ================================
-- 黑科易购项目数据完整性检查脚本
-- 版本: 1.0
-- 描述: 检查数据库中数据的一致性和完整性
-- 日期: 2025-11-18
-- ================================

USE `heikeji_mall`;

-- 设置输出格式
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';

-- 初始化检查结果表
DROP TABLE IF EXISTS `data_integrity_check_result`;
CREATE TEMPORARY TABLE `data_integrity_check_result` (
  `check_category` VARCHAR(50) NOT NULL,
  `check_item` VARCHAR(100) NOT NULL,
  `status` VARCHAR(20) NOT NULL,
  `details` TEXT,
  `count` INT DEFAULT 0,
  PRIMARY KEY (`check_category`, `check_item`)
);

-- ================================
-- 1. 基础数据一致性检查
-- ================================

-- 1.1 检查孤儿记录
-- 检查有购物车记录但无对应用户的记录
INSERT INTO `data_integrity_check_result`
SELECT 
    '基础数据一致性' AS check_category,
    '购物车孤儿记录' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CONCAT('发现 ', COUNT(*), ' 条购物车记录无对应用户') AS details,
    COUNT(*) AS count
FROM `cart` c
LEFT JOIN `user` u ON c.user_id = u.id
WHERE u.id IS NULL;

-- 检查有订单但无对应用户的记录
INSERT INTO `data_integrity_check_result`
SELECT 
    '基础数据一致性' AS check_category,
    '订单孤儿记录' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CONCAT('发现 ', COUNT(*), ' 条订单记录无对应用户') AS details,
    COUNT(*) AS count
FROM `order` o
LEFT JOIN `user` u ON o.user_id = u.id
WHERE u.id IS NULL;

-- 检查有地址但无对应用户的记录
INSERT INTO `data_integrity_check_result`
SELECT 
    '基础数据一致性' AS check_category,
    '地址孤儿记录' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CONCAT('发现 ', COUNT(*), ' 条地址记录无对应用户') AS details,
    COUNT(*) AS count
FROM `address` a
LEFT JOIN `user` u ON a.user_id = u.id
WHERE u.id IS NULL;

-- 检查有订单商品但无对应订单的记录
INSERT INTO `data_integrity_check_result`
SELECT 
    '基础数据一致性' AS check_category,
    '订单商品孤儿记录' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CONCAT('发现 ', COUNT(*), ' 条订单商品记录无对应订单') AS details,
    COUNT(*) AS count
FROM `order_item` oi
LEFT JOIN `order` o ON oi.order_id = o.id
WHERE o.id IS NULL;

-- 检查有商品但无对应商家的记录
INSERT INTO `data_integrity_check_result`
SELECT 
    '基础数据一致性' AS check_category,
    '商品孤儿记录' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CONCAT('发现 ', COUNT(*), ' 条商品记录无对应商家') AS details,
    COUNT(*) AS count
FROM `product` p
LEFT JOIN `merchant` m ON p.merchant_id = m.id
WHERE m.id IS NULL;

-- 1.2 检查外键约束
-- 检查购物车中的商品是否存在
INSERT INTO `data_integrity_check_result`
SELECT 
    '外键约束' AS check_category,
    '购物车商品存在性' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CONCAT('发现 ', COUNT(*), ' 条购物车记录引用不存在的商品') AS details,
    COUNT(*) AS count
FROM `cart` c
LEFT JOIN `product` p ON c.product_id = p.id
WHERE p.id IS NULL;

-- 检查订单中的商品是否存在
INSERT INTO `data_integrity_check_result`
SELECT 
    '外键约束' AS check_category,
    '订单商品存在性' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CONCAT('发现 ', COUNT(*), ' 条订单商品记录引用不存在的商品') AS details,
    COUNT(*) AS count
FROM `order_item` oi
LEFT JOIN `product` p ON oi.product_id = p.id
WHERE p.id IS NULL;

-- 检查订单地址是否存在
INSERT INTO `data_integrity_check_result`
SELECT 
    '外键约束' AS check_category,
    '订单地址存在性' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CONCAT('发现 ', COUNT(*), ' 条订单记录引用不存在的地址') AS details,
    COUNT(*) AS count
FROM `order` o
LEFT JOIN `address` a ON o.address_id = a.id
WHERE a.id IS NULL;

-- ================================
-- 2. 业务规则验证
-- ================================

-- 2.1 检查价格一致性
-- 检查订单商品价格是否与当前商品价格一致（允许1分误差）
INSERT INTO `data_integrity_check_result`
SELECT 
    '业务规则验证' AS check_category,
    '订单价格一致性' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'WARN' END AS status,
    CONCAT('发现 ', COUNT(*), ' 条订单商品价格与当前商品价格差异较大') AS details,
    COUNT(*) AS count
FROM `order_item` oi
JOIN `product` p ON oi.product_id = p.id
WHERE ABS(oi.price - p.price) > 0.01;

-- 2.2 检查用户余额
-- 检查用户余额是否为负数
INSERT INTO `data_integrity_check_result`
SELECT 
    '业务规则验证' AS check_category,
    '用户余额检查' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CONCAT('发现 ', COUNT(*), ' 个用户余额为负数') AS details,
    COUNT(*) AS count
FROM `user`
WHERE balance < 0;

-- 2.3 检查商品库存
-- 检查商品库存是否为负数
INSERT INTO `data_integrity_check_result`
SELECT 
    '业务规则验证' AS check_category,
    '商品库存检查' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CONCAT('发现 ', COUNT(*), ' 个商品库存为负数') AS details,
    COUNT(*) AS count
FROM `product`
WHERE stock < 0;

-- 2.4 检查订单状态一致性
-- 检查订单支付状态与实际支付记录
INSERT INTO `data_integrity_check_result`
SELECT 
    '业务规则验证' AS check_category,
    '订单支付状态' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CONCAT('发现 ', COUNT(*), ' 个订单支付状态不一致') AS details,
    COUNT(*) AS count
FROM `order` o
LEFT JOIN `payment` p ON o.order_no = p.order_no AND p.status = 2
WHERE o.status >= 2 AND p.id IS NULL;

-- ================================
-- 3. 数据质量检查
-- ================================

-- 3.1 检查必填字段
-- 检查用户必填字段
INSERT INTO `data_integrity_check_result`
SELECT 
    '数据质量' AS check_category,
    '用户必填字段' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CONCAT('发现 ', COUNT(*), ' 个用户缺少必填字段') AS details,
    COUNT(*) AS count
FROM `user`
WHERE student_no IS NULL OR student_no = '' OR nickname IS NULL OR nickname = '';

-- 检查商品必填字段
INSERT INTO `data_integrity_check_result`
SELECT 
    '数据质量' AS check_category,
    '商品必填字段' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CONCAT('发现 ', COUNT(*), ' 个商品缺少必填字段') AS details,
    COUNT(*) AS count
FROM `product`
WHERE name IS NULL OR name = '' OR price IS NULL;

-- 3.2 检查格式规范性
-- 检查手机号格式
INSERT INTO `data_integrity_check_result`
SELECT 
    '数据质量' AS check_category,
    '手机号格式' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'WARN' END AS status,
    CONCAT('发现 ', COUNT(*), ' 个用户手机号格式不规范') AS details,
    COUNT(*) AS count
FROM `user`
WHERE phone IS NOT NULL 
AND phone != '' 
AND phone NOT REGEXP '^1[3-9][0-9]{9}$';

-- 检查邮箱格式
INSERT INTO `data_integrity_check_result`
SELECT 
    '数据质量' AS check_category,
    '邮箱格式' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'WARN' END AS status,
    CONCAT('发现 ', COUNT(*), ' 个用户邮箱格式不规范') AS details,
    COUNT(*) AS count
FROM `user`
WHERE email IS NOT NULL 
AND email != '' 
AND email NOT REGEXP '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';

-- 3.3 检查重复数据
-- 检查用户学号重复
INSERT INTO `data_integrity_check_result`
SELECT 
    '数据质量' AS check_category,
    '用户学号重复' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CONCAT('发现 ', COUNT(*), ' 组重复的用户学号') AS details,
    COUNT(*) AS count
FROM (
    SELECT student_no, COUNT(*) as cnt
    FROM `user`
    WHERE student_no IS NOT NULL AND student_no != ''
    GROUP BY student_no
    HAVING cnt > 1
) t;

-- 检查用户认证重复
INSERT INTO `data_integrity_check_result`
SELECT 
    '数据质量' AS check_category,
    '用户认证重复' AS check_item,
    CASE WHEN COUNT(*) = 0 THEN 'PASS' ELSE 'FAIL' END AS status,
    CONCAT('发现 ', COUNT(*), ' 组重复的用户认证记录') AS details,
    COUNT(*) AS count
FROM (
    SELECT user_id, COUNT(*) as cnt
    FROM `user_auth`
    GROUP BY user_id
    HAVING cnt > 1
) t;

-- ================================
-- 4. 统计信息
-- ================================

-- 4.1 表记录数统计
INSERT INTO `data_integrity_check_result`
SELECT 
    '统计信息' AS check_category,
    '用户表记录数' AS check_item,
    'INFO' AS status,
    CONCAT('用户表共有 ', COUNT(*), ' 条记录') AS details,
    COUNT(*) AS count
FROM `user`;

INSERT INTO `data_integrity_check_result`
SELECT 
    '统计信息' AS check_category,
    '商品表记录数' AS check_item,
    'INFO' AS status,
    CONCAT('商品表共有 ', COUNT(*), ' 条记录') AS details,
    COUNT(*) AS count
FROM `product`;

INSERT INTO `data_integrity_check_result`
SELECT 
    '统计信息' AS check_category,
    '订单表记录数' AS check_item,
    'INFO' AS status,
    CONCAT('订单表共有 ', COUNT(*), ' 条记录') AS details,
    COUNT(*) AS count
FROM `order`;

-- 4.2 业务数据统计
INSERT INTO `data_integrity_check_result`
SELECT 
    '统计信息' AS check_category,
    '活跃用户数' AS check_item,
    'INFO' AS status,
    CONCAT('活跃用户（30天内有订单）有 ', COUNT(DISTINCT o.user_id), ' 个') AS details,
    COUNT(DISTINCT o.user_id) AS count
FROM `order` o
WHERE o.create_time >= DATE_SUB(NOW(), INTERVAL 30 DAY);

INSERT INTO `data_integrity_check_result`
SELECT 
    '统计信息' AS check_category,
    '总交易额' AS check_item,
    'INFO' AS status,
    CONCAT('总交易额：', FORMAT(SUM(actual_amount), 2)) AS details,
    SUM(actual_amount) AS count
FROM `order`
WHERE status >= 3;

-- ================================
-- 5. 输出检查结果
-- ================================

-- 按类别和状态排序输出检查结果
SELECT 
    check_category AS '检查类别',
    check_item AS '检查项目',
    status AS '状态',
    details AS '详情',
    count AS '数量'
FROM `data_integrity_check_result`
ORDER BY check_category, 
         CASE status WHEN 'FAIL' THEN 1 WHEN 'WARN' THEN 2 WHEN 'PASS' THEN 3 WHEN 'INFO' THEN 4 END,
         check_item;

-- 汇总统计
SELECT 
    check_category AS '检查类别',
    COUNT(*) AS '检查项目数',
    SUM(CASE WHEN status = 'FAIL' THEN 1 ELSE 0 END) AS '失败数',
    SUM(CASE WHEN status = 'WARN' THEN 1 ELSE 0 END) AS '警告数',
    SUM(CASE WHEN status = 'PASS' THEN 1 ELSE 0 END) AS '通过数',
    SUM(CASE WHEN status = 'INFO' THEN 1 ELSE 0 END) AS '信息数'
FROM `data_integrity_check_result`
GROUP BY check_category
ORDER BY check_category;

-- 总体统计
SELECT 
    '总体统计' AS '检查类别',
    SUM(CASE WHEN status = 'FAIL' THEN 1 ELSE 0 END) AS '失败数',
    SUM(CASE WHEN status = 'WARN' THEN 1 ELSE 0 END) AS '警告数',
    SUM(CASE WHEN status = 'PASS' THEN 1 ELSE 0 END) AS '通过数',
    SUM(CASE WHEN status = 'INFO' THEN 1 ELSE 0 END) AS '信息数',
    COUNT(*) AS '总检查项目'
FROM `data_integrity_check_result`;

-- 恢复SQL模式
SET SQL_MODE=@OLD_SQL_MODE;

-- 清理临时表
DROP TEMPORARY TABLE IF EXISTS `data_integrity_check_result`;