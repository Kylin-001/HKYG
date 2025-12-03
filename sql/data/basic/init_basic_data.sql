-- 初始化基础数据脚本
-- 确保已先创建数据库和表结构

USE `heikeji_mall`;

-- 执行所有基础数据文件
SOURCE ./category_data.sql;
-- SOURCE ./delivery_locker_data.sql; -- 已存在
SOURCE ./dict_data.sql;
SOURCE ./merchant_data.sql;
SOURCE ./product_data.sql;
SOURCE ./role_permission_data.sql;
SOURCE ./system_config_data.sql;
