-- 初始化测试数据脚本
-- 确保已先创建数据库、表结构和基础数据

USE `heikeji_mall`;

-- 执行所有测试数据文件
SOURCE ./user_test_data.sql;
SOURCE ./order_test_data.sql;
SOURCE ./cart_test_data.sql;
