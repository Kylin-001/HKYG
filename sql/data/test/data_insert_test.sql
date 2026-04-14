-- ============================================================
-- 数据插入功能 - 测试数据脚本
-- 目标数据库: heikeji_mall
-- 用途: 验证批量数据插入功能是否正常工作
-- 创建时间: 2026-04-07
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
USE `heikeji_mall`;

-- ============================================================
-- 1. 单条用户数据插入测试
-- ============================================================

INSERT INTO `user` (
    `username`, `password`, `student_no`, `nickname`,
    `phone`, `sex`, `avatar`, `status`, `is_verified`,
    `balance`, `score`, `college`, `major`, `grade`,
    `create_time`
) VALUES (
    'testuser001',
    '$2a$10$TestHashedPassword1234567890123456789012345678',
    '2026990001',
    '测试用户001',
    '13900001111',
    1,
    'https://example.com/avatar/test001.jpg',
    0,
    1,
    100.00,
    500,
    '计算机学院',
    '软件工程',
    '2026',
    NOW()
);

-- 验证单条插入结果
SELECT '单条用户插入验证' AS operation,
       COUNT(*) AS record_count,
       id,
       username,
       student_no,
       nickname
FROM user
WHERE username = 'testuser001';

-- ============================================================
-- 2. 批量用户数据插入测试（5条）
-- ============================================================

INSERT INTO `user` (
    `username`, `password`, `student_no`, `nickname`,
    `phone`, `sex`, `avatar`, `status`, `is_verified`,
    `balance`, `score`, `college`, `major`, `grade`,
    `create_time`
) VALUES
('batch_user_01', '$2a$10$HashedPassword1234567890123456789012345', '2026990101', '批量用户01', '13901010101', 1, NULL, 0, 1, 50.00, 200, '理学院', '数学', '2026', NOW()),
('batch_user_02', '$2a$10$HashedPassword1234567890123456789012345', '2026990102', '批量用户02', '13901010202', 2, NULL, 0, 1, 80.00, 350, '文学院', '中文', '2026', NOW()),
('batch_user_03', '$2a$10$HashedPassword1234567890123456789012345', '2026990103', '批量用户03', '13901010303', 1, NULL, 0, 0, 0.00, 100, '工程学院', '机械', '2026', NOW()),
('batch_user_04', '$2a$10$HashedPassword1234567890123456789012345', '2026990104', '批量用户04', '13901010404', 2, NULL, 0, 1, 120.50, 480, '商学院', '会计', '2026', NOW()),
('batch_user_05', '$2a$10$HashedPassword1234567890123456789012345', '2026990105', '批量用户05', '13901010505', 1, NULL, 0, 1, 200.00, 800, '艺术学院', '设计', '2026', NOW());

-- 验证批量插入结果
SELECT '批量用户插入验证' AS operation,
       COUNT(*) AS inserted_count
FROM user
WHERE username LIKE 'batch_user_%';

-- 显示批量插入的用户详情
SELECT id, username, student_no, nickname, phone, college, major, create_time
FROM user
WHERE username LIKE 'batch_user_%'
ORDER BY id;

-- ============================================================
-- 3. 商品数据插入测试
-- 前提：需要确保category表和store表中存在对应的外键记录
-- ============================================================

-- 先检查是否存在测试用的分类和商家
SELECT '检查分类数据' AS operation, id, name FROM category LIMIT 5;
SELECT '检查商家数据' AS operation, id, name FROM store LIMIT 5;

-- 插入测试商品（假设分类ID=1和商家ID=1存在）
INSERT INTO `product` (
    `name`, `category_id`, `store_id`, `price`,
    `original_price`, `stock`, `sales_count`,
    `description`, `status`, `is_featured`,
    `create_time`
) VALUES
('测试商品001 - 笔记本电脑', 1, 1, 4999.00, 5999.00, 100, 0, '高性能笔记本电脑，适合学习和办公', 1, 0, NOW()),
('测试商品002 - 无线鼠标', 1, 1, 79.90, 99.00, 500, 0, '人体工学设计，续航持久', 1, 0, NOW()),
('测试商品003 - 机械键盘', 1, 1, 299.00, 399.00, 200, 0, '青轴机械键盘，手感优秀', 1, 1, NOW());

-- 验证商品插入结果
SELECT '商品插入验证' AS operation,
       COUNT(*) AS inserted_count
FROM product
WHERE name LIKE '测试商品%';

-- 显示插入的商品详情
SELECT id, name, category_id, store_id, price, stock, status, create_time
FROM product
WHERE name LIKE '测试商品%'
ORDER BY id;

-- ============================================================
-- 4. 数据完整性验证查询
-- ============================================================

-- 验证用户表的唯一性约束
SELECT '用户名唯一性检查' AS check_type,
       username,
       COUNT(*) AS duplicate_count
FROM user
GROUP BY username
HAVING COUNT(*) > 1;

-- 验证学号的唯一性约束
SELECT '学号唯一性检查' AS check_type,
       student_no,
       COUNT(*) AS duplicate_count
FROM user
GROUP BY student_no
HAVING COUNT(*) > 1;

-- 验证手机号的唯一性（排除NULL值）
SELECT '手机号唯一性检查' AS check_type,
       phone,
       COUNT(*) AS duplicate_count
FROM user
WHERE phone IS NOT NULL
GROUP BY phone
HAVING COUNT(*) > 1;

-- 检查商品外键完整性
SELECT '商品-分类外键检查' AS check_type,
       p.id AS product_id,
       p.name AS product_name,
       p.category_id,
       CASE WHEN c.id IS NOT NULL THEN '有效' ELSE '无效' END AS category_status
FROM product p
LEFT JOIN category c ON p.category_id = c.id
WHERE p.name LIKE '测试商品%';

SELECT '商品-商家外键检查' AS check_type,
       p.id AS product_id,
       p.name AS product_name,
       p.store_id,
       CASE WHEN s.id IS NOT NULL THEN '有效' ELSE '无效' END AS store_status
FROM product p
LEFT JOIN store s ON p.store_id = s.id
WHERE p.name LIKE '测试商品%';

-- ============================================================
-- 5. 数据统计汇总
-- ============================================================

SELECT '数据插入统计汇总' AS summary,
       (SELECT COUNT(*) FROM user WHERE username = 'testuser001') AS single_user_inserted,
       (SELECT COUNT(*) FROM user WHERE username LIKE 'batch_user_%') AS batch_users_inserted,
       (SELECT COUNT(*) FROM product WHERE name LIKE '测试商品%') AS products_inserted,
       (SELECT COUNT(*) FROM user) AS total_users,
       (SELECT COUNT(*) FROM product) AS total_products;

-- ============================================================
-- 6. 清理测试数据（可选，取消注释执行）
-- ============================================================

-- DELETE FROM user WHERE username IN ('testuser001') OR username LIKE 'batch_user_%';
-- DELETE FROM product WHERE name LIKE '测试商品%';
-- SELECT '测试数据清理完成' AS result;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 脚本执行完成提示
-- ============================================================
SELECT '✅ 数据插入测试脚本执行完成！请查看上述验证结果确认数据是否成功写入。' AS completion_message;
