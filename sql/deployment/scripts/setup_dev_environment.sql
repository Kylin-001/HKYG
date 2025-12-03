-- ================================
-- 黑科易购项目开发环境数据库部署脚本
-- 创建日期: 2025-11-18
-- 用途: 开发环境快速搭建
-- ================================

-- 设置字符集
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS `heikeji_mall_dev` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `heikeji_mall_dev`;

-- 执行简化版表结构创建
SOURCE ../simple_schema.sql;

-- 创建索引优化
SOURCE ../optimize_indexes.sql;

-- 创建基础测试数据
SOURCE ../init_data.sql;

-- 添加更多开发测试数据
INSERT INTO `user` (`student_no`, `nickname`, `phone`, `status`, `balance`) VALUES
('2022020004', '测试用户A', '13800138004', 0, 200.00),
('2022020005', '测试用户B', '13800138005', 0, 150.00),
('2022020006', '测试用户C', '13800138006', 0, 80.00);

-- 添加商品分类
INSERT INTO `category` (`name`, `parent_id`, `sort_order`) VALUES
('早餐食品', 1, 1),
('饮料饮品', 1, 2),
('生活用品', 2, 1),
('学习用品', 3, 1);

-- 添加商家数据（简化版）
INSERT INTO `merchant` (`name`, `type`, `description`, `status`) VALUES
('校园小卖部', 0, '主营零食饮料', 0),
('文具店', 1, '主营学习用品', 0),
('便利店', 0, '主营生活用品', 0);

-- 添加商品数据（简化版）
INSERT INTO `product` (`merchant_id`, `category_id`, `name`, `price`, `stock`, `status`) VALUES
(1, 1, '豆浆', 3.50, 100, 0),
(1, 1, '包子', 2.00, 50, 0),
(1, 2, '可乐', 3.00, 200, 0),
(2, 4, '笔记本', 8.00, 30, 0),
(3, 3, '洗发水', 25.00, 20, 0);

-- 恢复外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- 显示创建结果
SELECT 'Database setup completed!' AS message;
SELECT COUNT(*) AS table_count FROM information_schema.tables WHERE table_schema = 'heikeji_mall_dev';
SELECT COUNT(*) AS user_count FROM `user`;
SELECT COUNT(*) AS product_count FROM `product`;
SELECT COUNT(*) AS category_count FROM `category`;