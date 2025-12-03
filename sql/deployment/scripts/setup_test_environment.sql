-- ================================
-- 黑科易购项目测试环境数据库部署脚本
-- 创建日期: 2025-11-18
-- 用途: 测试环境完整搭建
-- ================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 创建测试数据库
CREATE DATABASE IF NOT EXISTS `heikeji_mall_test` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `heikeji_mall_test`;

-- 执行完整表结构创建
SOURCE ../schema.sql;

-- 创建索引优化
SOURCE ../optimize_indexes.sql;

-- 创建基础业务数据
SOURCE ../basic_data.sql;
SOURCE ../init_data.sql;

-- 创建测试数据
SOURCE ../heikeji_user_data.sql;
SOURCE ../heikeji_campus_data.sql;

-- 恢复外键检查
SET FOREIGN_KEY_CHECKS = 1;

-- 验证测试环境数据
SELECT 'Test environment setup completed!' AS message;
SELECT COUNT(*) AS total_tables FROM information_schema.tables WHERE table_schema = 'heikeji_mall_test';
SELECT COUNT(*) AS users FROM `user`;
SELECT COUNT(*) AS products FROM `product`;
SELECT COUNT(*) AS orders FROM `order`;
SELECT COUNT(*) AS merchants FROM `merchant`;

-- 性能测试准备
ANALYZE TABLE `user`, `product`, `order`, `payment`;
SELECT 'Statistics updated for performance testing' AS info;